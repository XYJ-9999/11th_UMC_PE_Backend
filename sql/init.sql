CREATE DATABASE IF NOT EXISTS umc_movie
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE umc_movie;

CREATE TABLE IF NOT EXISTS member (
  member_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  nickname VARCHAR(50) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rating (
  rating_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT NOT NULL,
  movie_id BIGINT NOT NULL,
  score TINYINT NOT NULL,
  comment TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rating_member FOREIGN KEY (member_id) REFERENCES member(member_id),
  UNIQUE KEY uk_rating_member_movie (member_id, movie_id)
);

CREATE TABLE IF NOT EXISTS favorite (
  favorite_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT NOT NULL,
  movie_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_favorite_member FOREIGN KEY (member_id) REFERENCES member(member_id),
  UNIQUE KEY uk_favorite_member_movie (member_id, movie_id)
);

INSERT IGNORE INTO member (member_id, email, password, nickname) VALUES
  (1, 'noco@umc.com', '$2a$10$dummyEncodedPasswordValue', '수현'),
  (2, 'minseo@umc.com', '$2a$10$dummyEncodedPasswordValue', '민서');

INSERT IGNORE INTO rating (rating_id, member_id, movie_id, score, comment, created_at, updated_at) VALUES
  (1, 1, 550, 5, '최고의 영화!', '2026-08-26 10:00:00', '2026-08-26 10:00:00'),
  (2, 1, 155, 4, '다시 봐도 명작', '2026-08-27 10:00:00', '2026-08-27 10:00:00'),
  (3, 2, 550, 3, '호불호가 갈릴 것 같아요', '2026-08-26 11:00:00', '2026-08-26 11:00:00');
