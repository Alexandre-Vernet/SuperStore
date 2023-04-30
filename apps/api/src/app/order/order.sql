CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id),
    state TEXT,
    cart_id integer REFERENCES carts(id),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);
