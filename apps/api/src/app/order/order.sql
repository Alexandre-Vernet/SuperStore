CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    address_id INTEGER NOT NULL,
    cart_id INTEGER REFERENCES carts(id) NULL,
    state TEXT NOT NULL,
    delivery_method TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
