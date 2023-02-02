import { Queue } from '@blackglory/structures'
import { Deferred } from 'extra-promise'
import { withAbortSignal, raceAbortSignals, AbortController } from 'extra-abort'
import { IGeyserConfig } from './contract.js'

export class Geyser {
  cycleStartTime: number = Date.now()
  acquiredCount: number = 0
  acquireSignals: Queue<Deferred<void>> = new Queue()
  acquireControllers: Queue<AbortController> = new Queue()

  duration!: number
  limit!: number

  constructor(public readonly namespace: string, config: IGeyserConfig) {
    this.updateConfig(config)
  }

  updateConfig(config: IGeyserConfig): void {
    this.limit = config.limit
    this.duration = config.duration
  }

  resetCycle(): void {
    this.cycleStartTime = Date.now()
    this.acquiredCount = 0

    let controller: AbortController | undefined
    while (controller = this.acquireControllers.dequeue()) {
      controller.abort()
    }
  }

  /**
   * @throws {AbortError}
   */
  async acquire(abortSignal: AbortSignal): Promise<void> {
    if (this.isFull()) {
      const signal = new Deferred<void>()
      const controller = new AbortController()
      this.acquireControllers.enqueue(controller)
      this.acquireSignals.enqueue(signal)
      try {
        await withAbortSignal(
          raceAbortSignals([abortSignal, controller.signal])
        , async () => await signal
        )
      } finally {
        this.acquireSignals.remove(signal)
        this.acquireControllers.remove(controller)
      }
    }
    this.acquiredCount++
  }

  nextTick(): void {
    const now = Date.now()
    if (this.isCycleOver(now)) {
      this.cycleStartTime = now
      this.acquiredCount = 0
    }

    while (this.acquireSignals.size && this.isntFull()) {
      const signal = this.acquireSignals.dequeue()!
      signal.resolve()
    }
  }

  isCycleOver(timestamp: number): boolean {
    return timestamp - this.cycleStartTime > this.duration
  }

  isFull(): boolean {
    return this.acquiredCount === this.limit
  }

  isntFull(): boolean {
    return this.acquiredCount < this.limit
  }

  isIdle(): boolean {
    return this.acquireSignals.size === 0
        && this.acquiredCount === 0
  }
}

export { AbortError } from 'extra-abort'
