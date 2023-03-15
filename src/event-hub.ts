import { Emitter } from '@blackglory/structures'
import { waitForEmitter } from '@blackglory/wait-for'

export enum Event {
  Set
, Reset
, Removed
}

type RateLimiterEventToArgs = {
  [Event.Set]: []
  [Event.Reset]: []
  [Event.Removed]: []
}

class EventHub {
  private idToEmitter: Map<string, Emitter<RateLimiterEventToArgs>> = new Map()

  async waitFor(
    id: string
  , event: keyof RateLimiterEventToArgs
  , abortSignal?: AbortSignal
  ): Promise<void> {
    if (!this.idToEmitter.has(id)) {
      this.idToEmitter.set(id, new Emitter())
    }

    const emitter = this.idToEmitter.get(id)!
    await waitForEmitter(emitter, event, abortSignal)
  }

  on<T extends Event>(
    id: string
  , event: T
  , listener: (...args: RateLimiterEventToArgs[T]) => void
  ): () => void {
    if (!this.idToEmitter.has(id)) {
      this.idToEmitter.set(id, new Emitter())
    }

    const emitter = this.idToEmitter.get(id)!
    return emitter.on(event, listener)
  }

  once<T extends Event>(
    id: string
  , event: T
  , listener: (...args: RateLimiterEventToArgs[T]) => void
  ): () => void {
    if (!this.idToEmitter.has(id)) {
      this.idToEmitter.set(id, new Emitter())
    }

    const emitter = this.idToEmitter.get(id)!
    return emitter.once(event, listener)
  }

  emit<T extends Event>(
    id: string
  , event: T
  , ...args: RateLimiterEventToArgs[T]
  ): void {
    this.idToEmitter.get(id)?.emit(event, ...args)
  }
}

export const eventHub = new EventHub()
