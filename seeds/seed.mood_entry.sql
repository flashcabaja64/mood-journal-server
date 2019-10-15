BEGIN;

INSERT INTO mood_entries (title, content, user_id)
VALUES
('Sample title', 'Sample content', 1);

INSERT INTO mood_users (user_name, full_name, password, nickname)
VALUES
('testUser', 'Bob', 'password1', 'bobby');

INSERT INTO mood_comments (text, rating, entry_id, user_id)
VALUES
('Sample text', 5, 1, 1);

COMMIT;