import { Emitter } from '@blackglory/structures'
import { waitForEmitter } from '@blackglory/wait-for'

export enum Event {
  Set
, Reset
, Removed
, EnteredNextCycle
}

type GlobalEventToArgs = {
  [Event.Set]: [id: string]
  [Event.Reset]: [id: string]
  [Event.Removed]: [id: string]
  [Event.EnteredNextCycle]: [id: string]
}

type RateLimiterEventToArgs = {
  [Event.Set]: []
  [Event.Reset]: []
  [Event.Removed]: []
  [Event.EnteredNextCycle]: []
}

class EventHub {
  private globalEmitter = new Emitter<GlobalEventToArgs>()
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

  onGlobal<T extends Event>(
    event: T
  , listener: (...args: GlobalEventToArgs[T]) => void
  ): () => void {
    return this.globalEmitter.on(event, listener)
  }

  onRateLimiter<T extends Event>(
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

  onceRateLimiter<T extends Event>(
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

  emit(id: string, event: Event): void {
    this.idToEmitter.get(id)?.emit(event)
    this.globalEmitter.emit(event, id)
  }
}

export const eventHub = new EventHub()
