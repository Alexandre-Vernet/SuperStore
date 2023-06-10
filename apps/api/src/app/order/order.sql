CREATE TABLE public.orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    address_id INTEGER NOT NULL,
    products_id INTEGER[] NOT NULL,
    state TEXT NOT NULL,
    delivery_method TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    sub_total_price DECIMAL NOT NULL,
    shipping_price DECIMAL NOT NULL,
    taxes_price DECIMAL NOT NULL,
    total_price DECIMAL NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
