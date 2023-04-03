import { ValueGetter } from 'value-getter'
import { assert, isNumber } from '@blackglory/prelude'
import { Getter } from 'justypes'
import { getCache } from '@env/cache.js'
import { getAppRoot } from '@utils/get-app-root.js'
import * as path from 'path'

export enum NodeEnv {
  Test
, Development
, Production
}

export const NODE_ENV: Getter<NodeEnv | undefined> =
  env('NODE_ENV')
    .convert(val => {
      switch (val) {
        case 'test': return NodeEnv.Test
        case 'development': return NodeEnv.Development
        case 'production': return NodeEnv.Production
      }
    })
    .memoize(getCache)
    .get()

export const DATA: Getter<string> =
  env('GEYSER_DATA')
    .default(path.join(getAppRoot(), 'data'))
    .memoize(getCache)
    .get()

export const HOST: Getter<string> =
  env('GEYSER_HOST')
    .default('localhost')
    .memoize(getCache)
    .get()

export const PORT: Getter<number> =
  env('GEYSER_PORT')
    .convert(toInteger)
    .default(8080)
    .memoize(getCache)
    .get()

export const WS_HEARTBEAT_INTERVAL: Getter<number> =
  env('GEYSER_WS_HEARTBEAT_INTERVAL')
    .convert(toInteger)
    .default(0)
    .assert(shouldBePositiveOrZero)
    .memoize(getCache)
    .get()

function env(name: string): ValueGetter<string | undefined> {
  return new ValueGetter(name, () => process.env[name])
}

function toInteger(val: string | number | undefined ): number | undefined {
  if (isNumber(val)) return val
  if (val) return Number.parseInt(val, 10)
}

function shouldBePositiveOrZero(val: number) {
  assert(val === 0 || val > 0, 'should be positive or zero')
}
