CREATE TABLE IF NOT EXISTS public.users
(
    id           SERIAL PRIMARY KEY,
    addresses_id INTEGER,
    first_name   TEXT                    NOT NULL,
    last_name    TEXT                    NOT NULL,
    email        TEXT                    NOT NULL,
    password     TEXT                    NOT NULL,
    is_admin     boolean                 NOT NULL,
    created_at   TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at   TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT fk_addresses_id FOREIGN KEY (addresses_id) REFERENCES addresses (id)
);