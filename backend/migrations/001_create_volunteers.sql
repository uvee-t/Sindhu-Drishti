CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,

    skills TEXT[] NOT NULL DEFAULT '{}',

    latitude DOUBLE PRECISION NOT NULL
        CHECK (latitude >= -90 AND latitude <= 90),

    longitude DOUBLE PRECISION NOT NULL
        CHECK (longitude >= -180 AND longitude <= 180),

    location GEOGRAPHY(POINT, 4326) NOT NULL,

    availability BOOLEAN NOT NULL DEFAULT TRUE,

    district VARCHAR(20) NOT NULL,

    vehicle VARCHAR(50),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS volunteers_location_idx
    ON volunteers USING GIST (location);

CREATE INDEX IF NOT EXISTS volunteers_district_idx
    ON volunteers (district);

CREATE INDEX IF NOT EXISTS volunteers_availability_idx
    ON volunteers (availability);
