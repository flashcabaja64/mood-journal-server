BEGIN;

INSERT INTO mood_users (user_name, full_name, password, nickname)
VALUES
('testUser', 'Bob', 'password1', 'bobby'),
('testUser1', 'Joe', 'password2', 'joey');

INSERT INTO mood_entries (title, content, duration, mood_type, user_id)
VALUES
('Sample title', 'Sample content', 5, 'Balanced', 1),
('Sample title1', 'Sample content1', 3, 'Erratic', 1),
('Sample title2', 'Sample content2', 2, 'Balanced', 1),
('Sample title3', 'Sample content3', 4, 'Low', 1),
('Sample title', 'Sample content', 5, 'Balanced', 1),
('Sample title1', 'Sample content1', 3, 'Erratic', 1),
('Sample title2', 'Sample content2', 2, 'Balanced', 1),
('Sample title3', 'Sample content3', 4, 'Low', 1),
('Sample title', 'Sample content', 5, 'Balanced', 1),
('Sample title1', 'Sample content1', 3, 'Erratic', 1),
('Sample title2', 'Sample content2', 2, 'Balanced', 1),
('Sample title3', 'Sample content3', 4, 'Low', 1),
('Sample title', 'Sample content', 5, 'Balanced', 1),
('Sample title1', 'Sample content1', 3, 'Erratic', 1),
('Sample title2', 'Sample content2', 2, 'Balanced', 1),
('Sample title3', 'Sample content3', 4, 'Low', 1);

INSERT INTO mood_comments (text, entry_id, user_id)
VALUES
('Sample text', 2, 1),
('Sample text2', 3, 1);

COMMIT;