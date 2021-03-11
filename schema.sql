-- psql -f schema.sql -d trips;

DROP TABLE IF EXISTS trip;

CREATE TABLE trip (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(255),
    desination VARCHAR(255),
    category VARCHAR(255),
    waypoints TEXT
        
);