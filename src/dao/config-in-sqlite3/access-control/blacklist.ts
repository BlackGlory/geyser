import { getDatabase } from '../database'

export function getAllBlacklistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT geyser_id
      FROM geyser_blacklist;
  `).all()

  return result.map(x => x['geyser_id'])
}

export function inBlacklist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM geyser_blacklist
              WHERE geyser_id = $id
           ) AS exist_in_blacklist;
  `).get({ id })

  return result['exist_in_blacklist'] === 1
}

export function addBlacklistItem(id: string) {
  getDatabase().prepare(`
    INSERT INTO geyser_blacklist (geyser_id)
    VALUES ($id)
        ON CONFLICT
        DO NOTHING;
  `).run({ id })
}

export function removeBlacklistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM geyser_blacklist
     WHERE geyser_id = $id;
  `).run({ id })
}
