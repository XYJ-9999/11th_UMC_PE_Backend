CREATE DATABASE IF NOT EXISTS movie_rating
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE movie_rating;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS members;
SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE members ( 
  member_id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  nickname VARCHAR(40) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (member_id),
  UNIQUE KEY uq_members_email (email),
  UNIQUE KEY uq_members_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ratings (
  rating_id INT NOT NULL AUTO_INCREMENT,
  member_id INT NOT NULL,
  movie_id INT NOT NULL,
  score TINYINT NOT NULL,
  comment TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (rating_id),
  UNIQUE KEY uq_rating_member_movie (member_id, movie_id),
  CONSTRAINT fk_ratings_member FOREIGN KEY (member_id)
    REFERENCES members(member_id) ON DELETE CASCADE,
  CONSTRAINT chk_rating_score CHECK (score BETWEEN 1 AND 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE favorites (
  favorite_id INT NOT NULL AUTO_INCREMENT,
  member_id INT NOT NULL,
  movie_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (favorite_id),
  UNIQUE KEY uq_favorite_member_movie (member_id, movie_id),
  CONSTRAINT fk_favorites_member FOREIGN KEY (member_id)
    REFERENCES members(member_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 회원 데이터는 POST /members/signup으로 생성하세요.
-- 두 명의 테스트 회원을 가입시킨 뒤 각각 로그인하면 403 시나리오를 검증할 수 있습니다.


-- 테스트 회원 A/B: 비밀번호는 모두 Demo1234! (bcrypt cost 10)
-- 실습 시 두 계정으로 각각 로그인하여 403 소유권 검증을 진행합니다.
INSERT INTO members (email, nickname, password) VALUES
('a@umc.com', '회원A', '$2b$10$7EqJtq98hPqEX7fNZaFWoO5u1d8f5J4p1b7qv0v6Q7vK0G5n6Q6eK'),
('b@umc.com', '회원B', '$2b$10$7EqJtq98hPqEX7fNZaFWoO5u1d8f5J4p1b7qv0v6Q7vK0G5n6Q6eK');
