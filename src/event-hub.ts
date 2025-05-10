import { Emitter } from '@blackglory/structures'
import { waitForEmitter } from '@blackglory/wait-for'

export enum Event {
  RateLimiterSet
, RateLimiterReset
, RateLimiterRemoved
}

type RateLimiterEventToArgs = {
  [Event.RateLimiterSet]: []
  [Event.RateLimiterReset]: []
  [Event.RateLimiterRemoved]: []
}

class EventHub {
  private rateLimiterIdToEmitter: Map<string, Emitter<RateLimiterEventToArgs>> = new Map()

  async waitFor(
    rateLimiterId: string
  , event: keyof RateLimiterEventToArgs
  , abortSignal?: AbortSignal
  ): Promise<void> {
    if (!this.rateLimiterIdToEmitter.has(rateLimiterId)) {
      this.rateLimiterIdToEmitter.set(rateLimiterId, new Emitter())
    }

    const emitter = this.rateLimiterIdToEmitter.get(rateLimiterId)!
    await waitForEmitter(emitter, event, abortSignal)
  }

  on<T extends Event>(
    rateLimiterId: string
  , event: T
  , listener: (...args: RateLimiterEventToArgs[T]) => void
  ): () => void {
    if (!this.rateLimiterIdToEmitter.has(rateLimiterId)) {
      this.rateLimiterIdToEmitter.set(rateLimiterId, new Emitter())
    }

    const emitter = this.rateLimiterIdToEmitter.get(rateLimiterId)!
    return emitter.on(event, listener)
  }

  once<T extends Event>(
    rateLimiterId: string
  , event: T
  , listener: (...args: RateLimiterEventToArgs[T]) => void
  ): () => void {
    if (!this.rateLimiterIdToEmitter.has(rateLimiterId)) {
      this.rateLimiterIdToEmitter.set(rateLimiterId, new Emitter())
    }

    const emitter = this.rateLimiterIdToEmitter.get(rateLimiterId)!
    return emitter.once(event, listener)
  }

  emit<T extends Event>(
    rateLimiterId: string
  , event: T
  , ...args: RateLimiterEventToArgs[T]
  ): void {
    this.rateLimiterIdToEmitter.get(rateLimiterId)?.emit(event, ...args)
  }
}

export const eventHub = new EventHub()
