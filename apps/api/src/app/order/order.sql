CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id) NULL,
    cart_id integer REFERENCES carts(id) NULL,
    state TEXT NOT NULL,
    company TEXT NULL,
    address TEXT NOT NULL,
    apartment TEXT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    post_code TEXT NOT NULL,
    phone TEXT NOT NULL,
    delivery_method TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
