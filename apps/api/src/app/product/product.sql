CREATE TABLE IF NOT EXISTS products
(
    id          SERIAL PRIMARY KEY,
    name        TEXT UNIQUE NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    description TEXT        NOT NULL,
    price       DECIMAL     NOT NULL,
    categories  TEXT[]      NOT NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);