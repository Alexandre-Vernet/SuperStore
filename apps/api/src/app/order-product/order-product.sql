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
