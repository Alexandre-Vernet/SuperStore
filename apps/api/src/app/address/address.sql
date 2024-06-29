CREATE TABLE IF NOT EXISTS public.addresses
(
    id         SERIAL PRIMARY KEY,
    company    TEXT      NULL,
    address    TEXT      NOT NULL,
    apartment  TEXT      NULL,
    country    TEXT      NOT NULL,
    city       TEXT      NOT NULL,
    zip_code   TEXT      NOT NULL,
    phone      TEXT      NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
)