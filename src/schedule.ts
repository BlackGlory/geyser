import { eventHub, Event } from '@src/event-hub.js'
import { isntNull } from '@blackglory/prelude'
import { getAllRateLimiterIds } from '@dao/get-all-rate-limiter-ids.js'
import { getNextCycleTimestamp } from '@dao/get-next-cycle-timestamp.js'
import { setSchedule } from 'extra-timers'
import { SyncDestructor } from 'extra-defer'

const idToCancelSchedule: Map<string, () => void> = new Map()

export function startEnteredNextCycleEventScheduler(): () => void {
  const destructor = new SyncDestructor()
  const ids = getAllRateLimiterIds()

  destructor.defer(eventHub.onGlobal(Event.Set, id => {
    updateSchedule(id)
  }))

  destructor.defer(eventHub.onGlobal(Event.Reset, id => {
    updateSchedule(id)
  }))

  destructor.defer(eventHub.onGlobal(Event.Removed, id => {
    const cancelSchedule = idToCancelSchedule.get(id)
    cancelSchedule?.()
  }))

  for (const id of ids) {
    updateSchedule(id)
  }

  return () => {
    destructor.execute()

    idToCancelSchedule.forEach(cancel => cancel())
    idToCancelSchedule.clear()
  }
}

function updateSchedule(id: string): void {
  const cancelSchedule = idToCancelSchedule.get(id)
  cancelSchedule?.()

  const nextCycleTimestamp = getNextCycleTimestamp(id)
  if (
    isntNull(nextCycleTimestamp) && 
    Number.isFinite(nextCycleTimestamp) &&
    nextCycleTimestamp >= Date.now()
  ) {
    const cancelSchedule = setSchedule(nextCycleTimestamp, () => {
      eventHub.emit(id, Event.EnteredNextCycle)
    })
    idToCancelSchedule.set(id, cancelSchedule)
  }
}
