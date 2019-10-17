ALTER TABLE mood_entries
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS mood_users;