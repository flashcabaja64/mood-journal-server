CREATE TABLE mood_entries (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  duration INTEGER NOT NULL,
  mood_type TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);