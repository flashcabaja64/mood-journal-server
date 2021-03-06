CREATE TABLE mood_users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  nickname TEXT,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);

ALTER TABLE mood_entries
  ADD COLUMN
    user_id INTEGER REFERENCES mood_users(id)
    ON DELETE SET NULL;