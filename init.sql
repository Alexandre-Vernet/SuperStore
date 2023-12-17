CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    addresses_id INTEGER[],
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS public.addresses (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NULL,
    address VARCHAR(255) NOT NULL,
    apartment VARCHAR(255) NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS public.newsletter (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    is_subscribed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);


 CREATE TABLE IF NOT EXISTS public.orders (
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


CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL NOT NULL,
    category TEXT[] NOT NULL,
    images TEXT[] NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS public.promotions (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    count DECIMAL NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
