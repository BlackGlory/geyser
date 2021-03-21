import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'
import { prepareGeyser } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('204', async () => {
    const id = 'id'
    await prepareGeyser(id)

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/geyser/${id}`)
    ))

    expect(res.status).toBe(204)
  })
})
