import { Queue } from '@blackglory/structures'
import { Signal } from 'extra-promise'
import { withAbortSignal } from 'extra-abort'

export class Geyser {
  cycleStartTime: number = Date.now()
  count: number = 0
  queue: Queue<Signal> = new Queue()

  duration!: number
  limit!: number

  constructor(public readonly namespace: string, config: IGeyserConfig) {
    this.updateConfig(config)
  }

  updateConfig(config: IGeyserConfig): void {
    this.limit = config.limit
    this.duration = config.duration
  }

  /**
   * @throws {AbortError}
   */
  async acquire(abortSignal: AbortSignal): Promise<void> {
    if (this.isFull()) {
      const signal = new Signal()
      this.queue.enqueue(signal)
      try {
        await withAbortSignal(abortSignal, () => signal)
      } finally {
        this.queue.remove(signal)
      }
    }
    this.count++
  }

  nextTick() {
    const now = Date.now()
    if (this.isCycleOver(now)) {
      this.cycleStartTime = now
      this.count = 0
    }

    while (this.queue.size && this.isntFull()) {
      const signal = this.queue.dequeue()!
      signal.emit()
    }
  }

  isCycleOver(timestamp: number) {
    return timestamp - this.cycleStartTime > this.duration
  }

  isFull(): boolean {
    return this.count === this.limit
  }

  isntFull(): boolean {
    return this.count < this.limit
  }

  isIdle(): boolean {
    return this.queue.size === 0
        && this.count === 0
  }
}

export { AbortError } from 'extra-abort'
