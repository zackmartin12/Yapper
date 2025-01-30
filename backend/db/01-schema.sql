use yapper;

CREATE TABLE users (
	user_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    salt VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(user_id)
);

CREATE TABLE yaps (
	yap_id INT NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
	datetime DATETIME NOT NULL,
	text TEXT NOT NULL,
	PRIMARY KEY (yap_id)
);

CREATE TABLE likes (
    yap_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (yap_id) REFERENCES yaps(yap_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY (yap_id, user_id)
);

CREATE TABLE follows (
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    FOREIGN KEY (follower_id) REFERENCES users(user_id),
    FOREIGN KEY (following_id) REFERENCES users(user_id),
    PRIMARY KEY (follower_id, following_id)
);
