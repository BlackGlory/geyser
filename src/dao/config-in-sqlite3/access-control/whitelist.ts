import { getDatabase } from '../database'

export function getAllWhitelistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT geyser_id
      FROM geyser_whitelist;
  `).all()

  return result.map(x => x['geyser_id'])
}

export function inWhitelist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM geyser_whitelist
              WHERE geyser_id = $id
           ) AS exist_in_whitelist;
  `).get({ id })

  return result['exist_in_whitelist'] === 1
}

export function addWhitelistItem(id: string) {
  getDatabase().prepare(`
    INSERT INTO geyser_whitelist (geyser_id)
    VALUES ($id)
        ON CONFLICT
        DO NOTHING;
  `).run({ id })
}

export function removeWhitelistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM geyser_whitelist
     WHERE geyser_id = $id;
  `).run({ id })
}
