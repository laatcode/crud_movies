DROP DATABASE IF EXISTS movies;
CREATE DATABASE movies;

USE movies;

CREATE TABLE movies (
    id BINARY(16) PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    year INT(4) NOT NULL,
    director VARCHAR(255) NOT NULL,
    duration INT(3) NOT NULL,
    poster TEXT,
    rate DECIMAL(3,1) NOT NULL
);

CREATE TABLE genres (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL
);

CREATE TABLE movies_genres (
    movie_id BINARY(16) NOT NULL,
    genre_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- INSERT INTO movies (id, title, year, director, duration, rate) VALUES (UUID_TO_BIN(UUID()), 'test', 2025, 'Luis Avila', 160, 7.2);

INSERT INTO genres (name) VALUES ('Action'), ('Comedy'), ('Drama'), ('Horror'), ('Sci-Fi');

-- INSERT INTO movies_genres (movie_id, genre_id) VALUES (UUID_TO_BIN((SELECT BIN_TO_UUID(id) id FROM movies LIMIT 1)), 1);
-- INSERT INTO movies_genres (movie_id, genre_id) VALUES (UUID_TO_BIN((SELECT BIN_TO_UUID(id) id FROM movies LIMIT 1)), 2);