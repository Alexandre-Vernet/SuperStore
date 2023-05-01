CREATE TABLE public.carts (
    id SERIAL PRIMARY KEY,
    product_id integer REFERENCES products(id),
    user_id integer REFERENCES users(id),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);
