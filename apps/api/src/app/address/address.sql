CREATE TABLE public.addresses (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NULL,
    address VARCHAR(255) NOT NULL,
    apartment VARCHAR(255) NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postal_code VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
