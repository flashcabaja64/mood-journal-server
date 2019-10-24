CREATE TABLE mood_comments (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  entry_id INTEGER
    REFERENCES mood_entries(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER
    REFERENCES mood_users(id) ON DELETE CASCADE NOT NULL
);