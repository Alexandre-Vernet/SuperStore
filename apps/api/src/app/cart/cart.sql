CREATE TABLE public.carts (
    id SERIAL PRIMARY KEY,
    product_id integer REFERENCES products(id),
    quantity decimal NOT NULL,
    total_price decimal NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
