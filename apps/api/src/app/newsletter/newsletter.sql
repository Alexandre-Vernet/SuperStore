CREATE TABLE public.newsletter (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    is_subscribed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
