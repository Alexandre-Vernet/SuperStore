CREATE TABLE IF NOT EXISTS images
(
    id         SERIAL PRIMARY KEY,
    product_id INTEGER     NOT NULL,
    url        TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products (id)
);