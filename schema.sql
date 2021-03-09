-- psql -f schema.sql -d trips;

DROP TABLE IF EXISTS trip;

CREATE TABLE trip (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
        
);