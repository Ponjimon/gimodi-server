/**
 * @param {import('better-sqlite3').Database} db
 */
export default function migrate(db) {
  db.exec(`ALTER TABLE bans ADD COLUMN nickname TEXT DEFAULT NULL`);
}
