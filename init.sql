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

    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS images
(
    id         SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    url        TEXT    NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.newsletter
(
    id            SERIAL PRIMARY KEY,
    email         TEXT UNIQUE             NOT NULL,
    is_subscribed BOOLEAN   DEFAULT FALSE NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at    TIMESTAMP DEFAULT NOW() NOT NULL
);


CREATE TABLE IF NOT EXISTS public.orders
(
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER                 NOT NULL,
    address_id      INTEGER                 NOT NULL,
    promotion_id    INTEGER                 NULL,
    state           TEXT                    NOT NULL,
    delivery_method TEXT                    NOT NULL,
    payment_method  TEXT                    NOT NULL,
    sub_total_price DECIMAL                 NOT NULL,
    shipping_price  DECIMAL                 NOT NULL,
    taxes_price     DECIMAL                 NOT NULL,
    total_price     DECIMAL                 NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at      TIMESTAMP DEFAULT NOW() NOT NULL,

    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_address_id FOREIGN KEY (address_id) REFERENCES addresses (id) ON DELETE CASCADE,
    CONSTRAINT fk_promotions_id FOREIGN KEY (promotion_id) REFERENCES promotions (id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.order_products
(
    id         SERIAL PRIMARY KEY NOT NULL,
    order_id   INTEGER            NOT NULL,
    product_id INTEGER            NOT NULL,
    quantity   INTEGER            NOT NULL,
    size       VARCHAR(3)         NULL,

    CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);


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


CREATE TABLE IF NOT EXISTS public.promotions
(
    id         SERIAL PRIMARY KEY,
    label      TEXT UNIQUE NOT NULL,
    amount     DECIMAL     NOT NULL,
    count      DECIMAL     NOT NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP   NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS public.reviews
(
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER        NOT NULL,
    user_id     INTEGER NOT NULL,
    rating      INTEGER        NOT NULL,
    description TEXT           NOT NULL,
    created_at  TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP      NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


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

    CONSTRAINT fk_addresses_id FOREIGN KEY (addresses_id) REFERENCES addresses (id) ON DELETE CASCADE
);