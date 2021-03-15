import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawBlacklist {
  geyser_id: string
}

interface IRawWhitelist {
  geyser_id: string
}

interface IRawTokenPolicy {
  geyser_id: string
  acquire_token_required: number | null
}

interface IRawToken {
  token: string
  geyser_id: string
  acquire_permission: number
}

export function setRawBlacklist(item: IRawBlacklist): IRawBlacklist {
  getDatabase().prepare(`
    INSERT INTO geyser_blacklist (geyser_id)
    VALUES ($geyser_id);
  `).run(item)

  return item
}

export function hasRawBlacklist(id: string): boolean {
  return !!getRawBlacklist(id)
}

export function getRawBlacklist(id: string): IRawBlacklist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM geyser_blacklist
     WHERE geyser_id = $id;
  `).get({ id })
}

export function setRawWhitelist(item: IRawWhitelist): IRawWhitelist {
  getDatabase().prepare(`
    INSERT INTO geyser_whitelist (geyser_id)
    VALUES ($geyser_id);
  `).run(item)

  return item
}

export function hasRawWhitelist(id: string): boolean {
  return !!getRawWhitelist(id)
}

export function getRawWhitelist(id: string): IRawWhitelist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM geyser_whitelist
     WHERE geyser_id = $id;
  `).get({ id })
}

export function setRawTokenPolicy<T extends IRawTokenPolicy>(item: T): T {
  getDatabase().prepare(`
    INSERT INTO geyser_token_policy (
      geyser_id
    , acquire_token_required
    )
    VALUES (
      $geyser_id
    , $acquire_token_required
    );
  `).run(item)

  return item
}

export function hasRawTokenPolicy(id: string): boolean {
  return !!getRawTokenPolicy(id)
}

export function getRawTokenPolicy(id: string): IRawTokenPolicy | null {
  return getDatabase().prepare(`
    SELECT *
      FROM geyser_token_policy
     WHERE geyser_id = $id;
  `).get({ id })
}

export function setRawToken(item: IRawToken): IRawToken {
  getDatabase().prepare(`
    INSERT INTO geyser_token (
      token
    , geyser_id
    , acquire_permission
    )
    VALUES (
      $token
    , $geyser_id
    , $acquire_permission
    );
  `).run(item)

  return item
}

export function hasRawToken(token: string, id: string): boolean {
  return !!getRawToken(token, id)
}

export function getRawToken(token: string, id: string): IRawToken | null {
  return getDatabase().prepare(`
    SELECT *
      FROM geyser_token
     WHERE token = $token
       AND geyser_id = $id;
  `).get({ token, id })
}
