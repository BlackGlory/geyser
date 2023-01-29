import { ValueGetter } from 'value-getter'
import { isNumber } from '@blackglory/prelude'
import { Getter } from 'justypes'
import { getCache } from '@env/cache.js'
import { getAppRoot } from '@src/utils.js'
import * as path from 'path'

export enum ListBasedAccessControl {
  Disable
, Whitelist
, Blacklist
}

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

export const ADMIN_PASSWORD: Getter<string | undefined> =
  env('GEYSER_ADMIN_PASSWORD')
    .memoize(getCache)
    .get()

export const LIST_BASED_ACCESS_CONTROL: Getter<ListBasedAccessControl> =
  env('GEYSER_LIST_BASED_ACCESS_CONTROL')
    .convert(val => {
      switch (val) {
        case 'whitelist': return ListBasedAccessControl.Whitelist
        case 'blacklist': return ListBasedAccessControl.Blacklist
        default: return ListBasedAccessControl.Disable
      }
    })
    .memoize(getCache)
    .get()

export const TOKEN_BASED_ACCESS_CONTROL: Getter<boolean> =
  env('GEYSER_TOKEN_BASED_ACCESS_CONTROL')
    .convert(toBool)
    .default(false)
    .memoize(getCache)
    .get()

export const ACQUIRE_TOKEN_REQUIRED: Getter<boolean> =
  env('GEYSER_ACQUIRE_TOKEN_REQUIRED')
    .convert(toBool)
    .default(false)
    .memoize(getCache)
    .get()

export const DURATION: Getter<number> =
  env('GEYSER_DURATION')
    .convert(toInteger)
    .default(Infinity)
    .memoize(getCache)
    .get()

export const LIMIT: Getter<number> =
  env('GEYSER_LIMIT')
    .convert(toInteger)
    .default(0)
    .memoize(getCache)
    .get()

function env(name: string): ValueGetter<string | undefined> {
  return new ValueGetter(name, () => process.env[name])
}

function toBool(val: string | boolean | undefined): boolean | undefined {
  if (val) return val === 'true'
  return false
}

function toInteger(val: string | number | undefined ): number | undefined {
  if (isNumber(val)) return val
  if (val) return Number.parseInt(val, 10)
}
