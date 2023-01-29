import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { prepareGeyser } from './utils.js'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const namespace = 'namespace'
    await prepareGeyser(namespace)

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/geyser/${namespace}`)
    ))

    expect(res.status).toBe(204)
  })
})
