BEGIN;

INSERT INTO mood_users (user_name, full_name, password, nickname)
VALUES
('testUser', 'Bob', 'password1', 'bobby'),
('testUser1', 'Joe', 'password2', 'joey');

INSERT INTO mood_entries (title, content, duration, user_id, mood_type)
VALUES
('Sample title', 'Sample content', 5, 1, 'Balanced'),
('Sample title1', 'Sample content1', 3, 2, 'Erratic'),
('Sample title2', 'Sample content2', 2, 2, 'Balanced'),
('Sample title3', 'Sample content3', 4, 1, 'Low');

INSERT INTO mood_comments (text, rating, entry_id, user_id)
VALUES
('Sample text', 5, 1, 1),
('Sample text2', 3, 1, 2);

COMMIT;