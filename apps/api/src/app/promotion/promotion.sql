CREATE TABLE IF NOT EXISTS public.promotions
(
    id         SERIAL PRIMARY KEY,
    label      TEXT      NOT NULL,
    amount     DECIMAL   NOT NULL,
    count      DECIMAL   NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);