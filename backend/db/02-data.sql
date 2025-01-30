use yapper;

INSERT INTO users (user_id, first_name, last_name, username, salt, password)
VALUES
(1, 'Zack', 'Martin', 'zackmartin', '48c8947f69c054a5caa934674ce8881d02bb18fb59d5a63eeaddff735b0e9', '83d9bdb5e20f3571b087db9aabf190a296741c3e864d7742f35658cfccc1b79c4599aad25084aa9a28c649a50c92244227b3e53e197621301d619d1ea01873c4'),
(2, 'John', 'Doe', 'johndoe', '801e87294783281ae49fc8287a0fd86779b27d7972d3e84f0fa0d826d7cb67dfefc', 'e289219c34f9a32ebc82393f09719b7f34872de95463242b5ffe8bb4b11a5fe7d454f9f5d082c8207c5d69b220ba06624b4bb15ffa05cc7d7d53c43f9e96da6a'),
(3, 'Samuel', 'Moore', 'samuelmoore', '801e87294783281ae49fc8287a0fd86779b27d7972d3e84f0fa0d826d7cb67dfefc', 'e289219c34f9a32ebc82393f09719b7f34872de95463242b5ffe8bb4b11a5fe7d454f9f5d082c8207c5d69b220ba06624b4bb15ffa05cc7d7d53c43f9e96da6a');

INSERT INTO yaps (yap_id, user_id, datetime, text)
VALUES
(1, 1, '2025-01-19 03:50:25', 'Hi everyone!'),
(2, 1, '2025-01-21 00:17:32', 'Anyone got any movie recommendations?'),
(3, 2, '2025-01-23 22:40:23', 'Captain America: Winter Soldier is really good!'),
(4, 3, '2025-01-25 20:15:54', 'One of the best MCU movies for sure.'),
(5, 3, '2025-01-27 09:36:50', 'I hope the new one is good also!');

INSERT INTO follows (follower_id, following_id)
VALUES
(1, 2), (1, 3),
(2, 1), (2, 3),
(3, 1), (3, 2);
