-- Migration: 002_books_isbn_required
-- При создании книги обязателен только isbn

ALTER TABLE books ALTER COLUMN title DROP NOT NULL;
ALTER TABLE books ALTER COLUMN author DROP NOT NULL;
ALTER TABLE books ALTER COLUMN isbn SET NOT NULL;
