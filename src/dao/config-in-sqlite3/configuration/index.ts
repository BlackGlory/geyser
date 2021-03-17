import * as Configuration from './configuration'

export const ConfigurationDAO: IConfigurationDAO = {
  getAllIdsWithConfiguration: asyncify(Configuration.getAllIdsWithConfiguration)
, getConfiguration: asyncify(Configuration.getConfiguration)

, setDuration: asyncify(Configuration.setDuration)
, unsetDuration: asyncify(Configuration.unsetDuration)

, setLimit: asyncify(Configuration.setLimit)
, unsetLimit: asyncify(Configuration.unsetLimit)
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
