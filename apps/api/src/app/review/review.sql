CREATE TABLE IF NOT EXISTS public.reviews
(
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER   NOT NULL,
    user_id     INTEGER   NOT NULL,
    rating      INTEGER   NOT NULL,
    description TEXT      NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);