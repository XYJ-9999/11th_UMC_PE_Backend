CREATE DATABASE IF NOT EXISTS umc_movie
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE umc_movie;

CREATE TABLE IF NOT EXISTS member (
  member_id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(60) NOT NULL,
  nickname VARCHAR(12) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (member_id),
  UNIQUE KEY uq_member_email (email),
  UNIQUE KEY uq_member_nickname (nickname)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rating (
  rating_id INT NOT NULL AUTO_INCREMENT,
  member_id INT NOT NULL,
  movie_id INT NOT NULL,
  score TINYINT UNSIGNED NOT NULL,
  comment VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (rating_id),
  UNIQUE KEY uq_rating_member_movie (member_id, movie_id),
  CONSTRAINT fk_rating_member FOREIGN KEY (member_id)
    REFERENCES member(member_id) ON DELETE CASCADE,
  CONSTRAINT chk_rating_score CHECK (score BETWEEN 1 AND 5)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS favorite (
  favorite_id INT NOT NULL AUTO_INCREMENT,
  member_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (favorite_id),
  CONSTRAINT fk_favorite_member FOREIGN KEY (member_id)
    REFERENCES member(member_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 테스트 회원은 POST /members/signup으로 생성하세요.
-- 평점 API 테스트는 회원가입 응답의 memberId를 사용하세요.
