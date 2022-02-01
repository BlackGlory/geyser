import { Queue } from '@blackglory/structures'
import { Signal } from 'extra-promise'
import { withAbortSignal, raceAbortSignals, AbortController } from 'extra-abort'

export class Geyser {
  cycleStartTime: number = Date.now()
  acquired: number = 0
  acquireSignals: Queue<Signal> = new Queue()
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
    this.acquired = 0

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
      const signal = new Signal()
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
    this.acquired++
  }

  nextTick(): void {
    const now = Date.now()
    if (this.isCycleOver(now)) {
      this.cycleStartTime = now
      this.acquired = 0
    }

    while (this.acquireSignals.size && this.isntFull()) {
      const signal = this.acquireSignals.dequeue()!
      signal.emit()
    }
  }

  isCycleOver(timestamp: number) {
    return timestamp - this.cycleStartTime > this.duration
  }

  isFull(): boolean {
    return this.acquired === this.limit
  }

  isntFull(): boolean {
    return this.acquired < this.limit
  }

  isIdle(): boolean {
    return this.acquireSignals.size === 0
        && this.acquired === 0
  }
}

export { AbortError } from 'extra-abort'
