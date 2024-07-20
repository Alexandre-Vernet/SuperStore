CREATE TABLE IF NOT EXISTS public.addresses
(
    id         SERIAL PRIMARY KEY,
    user_id    INT       NOT NULL,
    company    TEXT      NULL,
    address    TEXT      NOT NULL,
    apartment  TEXT      NULL,
    country    TEXT      NOT NULL,
    city       TEXT      NOT NULL,
    zip_code   TEXT      NOT NULL,
    phone      TEXT      NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users (id)
)