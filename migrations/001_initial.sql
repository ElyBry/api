-- Migration: 001_initial
-- Tables: cabinets, books, users with is_deleted soft delete support

-- Cabinets
CREATE TABLE IF NOT EXISTS cabinets (
  id         SERIAL PRIMARY KEY,
  number     VARCHAR(255) NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_cabinets_is_deleted ON cabinets (is_deleted);

-- Books
CREATE TABLE IF NOT EXISTS books (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(500) NOT NULL,
  author           VARCHAR(255) NOT NULL,
  isbn             VARCHAR(20),
  publication_year INTEGER,
  is_deleted       BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_books_is_deleted ON books (is_deleted);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  full_name  VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(50),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_users_is_deleted ON users (is_deleted);
