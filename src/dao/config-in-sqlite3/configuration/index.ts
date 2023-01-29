import * as Configuration from './configuration.js'

export const ConfigurationDAO: IConfigurationDAO = {
  getAllNamespacesWithConfiguration: asyncify(Configuration.getAllNamespacesWithConfiguration)
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
