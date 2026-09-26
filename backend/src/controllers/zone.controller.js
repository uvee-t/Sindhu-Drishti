import { postgresPool } from '../config/database.js';
import { AppError } from '../utils/errors.js';

import {
    validateLocationSchema,
    priorityVillageQuerySchema,
} from '../validators/zone.validator.js';

const getRedZones = async (req, res) => {
    const result = await postgresPool.query(`
        SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', json_agg(
                json_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(wkb_geometry)::json,
                    'properties', json_build_object(
                        'zone_class', zone_class,
                        'area_sqkm', area_sqkm
                    )
                )
            )
        ) AS geojson
        FROM red_zones;
    `);

    if (!result.rows[0]?.geojson) {
        throw new AppError('No red zone data found.', 404, 'RED_ZONE_DATA_NOT_FOUND');
    }

    return res.status(200).json(result.rows[0].geojson);
};

const checkLocation = async (req, res) => {
    const validation = validateLocationSchema.safeParse(req.query);

    if (!validation.success) {
        throw new AppError('Invalid Coordinates!', 400, 'INVALID_COORDINATES');
    }

    const { lat, lon } = validation.data;

    const result = await postgresPool.query(
        `
        SELECT
            zone_class,
            area_sqkm
        FROM red_zones
        WHERE ST_Contains(
            wkb_geometry,
            ST_SetSRID(
                ST_MakePoint($1, $2),
                4326
            )
        )
        LIMIT 1;
        `,
        [lon, lat],
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message:
                'No zone data found for this location (outside district boundary or gap in coverage).',

            location: {
                lat,
                lon,
            },
        });
    }

    const zoneLabels = {
        0: 'GREEN',
        1: 'YELLOW',
        2: 'RED',
    };

    const zone = result.rows[0];

    return res.status(200).json({
        location: {
            lat,
            lon,
        },

        zone_class: zoneLabels[zone.zone_class],

        zone_area_sqkm: zone.area_sqkm,
    });
};

const nearestGreenZone = async (req, res) => {
    const validation = validateLocationSchema.safeParse(req.query);

    if (!validation.success) {
        throw new AppError('Invalid Coordinates!', 400, 'INVALID_COORDINATES');
    }

    const { lat, lon } = validation.data;

    const result = await postgresPool.query(
        `
        SELECT
            zone_class,
            area_sqkm,

            ST_Distance(
                wkb_geometry::geography,
                ST_SetSRID(
                    ST_MakePoint($1, $2),
                    4326
                )::geography
            ) / 1000.0 AS distance_km,

            ST_AsGeoJSON(
                ST_ClosestPoint(
                    wkb_geometry,
                    ST_SetSRID(
                        ST_MakePoint($1, $2),
                        4326
                    )
                )
            )::json AS nearest_point

        FROM red_zones

        WHERE zone_class = 0

        ORDER BY
            wkb_geometry <-> ST_SetSRID(
                ST_MakePoint($1, $2),
                4326
            )

        LIMIT 1;
        `,
        [lon, lat],
    );

    if (result.rows.length === 0) {
        throw new AppError('No green zone found for this location.', 404, 'GREEN_ZONE_NOT_FOUND');
    }

    const site = result.rows[0];

    return res.status(200).json({
        from_location: {
            lat,
            lon,
        },

        nearest_safe_zone: {
            zone_area_sqkm: site.area_sqkm,

            distance_km: parseFloat(Number(site.distance_km).toFixed(2)),

            nearest_point: site.nearest_point,
        },
    });
};

const priorityVillages = async (req, res) => {
    const validation = priorityVillageQuerySchema.safeParse(req.query);

    if (!validation.success) {
        throw new AppError(validation.error.issues[0].message, 400, 'INVALID_TIER');
    }

    const { tier } = validation.data;

    let query;
    let params = [];

    if (tier) {
        query = `
            SELECT
                vill_name AS village_name,
                sub_dist AS sub_district,
                population,
                pct_red,
                estimated_affected_population,
                priority_tier

            FROM villages

            WHERE priority_tier = $1

            ORDER BY
                estimated_affected_population DESC;
        `;

        params = [tier];
    } else {
        query = `
            SELECT
                vill_name AS village_name,
                sub_dist AS sub_district,
                population,
                pct_red,
                estimated_affected_population,
                priority_tier

            FROM villages

            WHERE priority_tier IN (
                'IMMEDIATE',
                'SHORT_TERM'
            )

            ORDER BY
                estimated_affected_population DESC;
        `;
    }

    const result = await postgresPool.query(query, params);

    return res.status(200).json({
        count: result.rows.length,

        total_estimated_affected_population: result.rows.reduce(
            (sum, row) => sum + Number(row.estimated_affected_population),
            0,
        ),

        villages: result.rows,
    });
};

const locations = async (req, res) => {
    const result = await postgresPool.query(`
        SELECT json_build_object(
            'type', 'FeatureCollection',

            'features', json_agg(
                json_build_object(
                    'type', 'Feature',

                    'geometry',
                    ST_AsGeoJSON(wkb_geometry)::json,

                    'properties',
                    json_build_object(
                        'village_name', vill_name,
                        'sub_district', sub_dist,
                        'population', population,
                        'pct_red', pct_red,
                        'estimated_affected_population',
                            estimated_affected_population,
                        'priority_tier', priority_tier
                    )
                )
            )
        ) AS geojson

        FROM villages;
    `);

    if (!result.rows[0]?.geojson) {
        throw new AppError('No village data found.', 404, 'VILLAGE_DATA_NOT_FOUND');
    }

    return res.status(200).json(result.rows[0].geojson);
};

const relocationSites = async (req, res) => {
    const result = await postgresPool.query(`
        SELECT
            site_id,
            area_sqkm,
            buildable_pct,
            developable_pct,
            avg_stream_distance_m,
            suitability_score,
            estimated_household_capacity,
            estimated_population_capacity,
            ST_AsGeoJSON(wkb_geometry)::json AS geometry

        FROM relocation_sites

        ORDER BY suitability_score DESC;
    `);

    if (result.rows.length === 0) {
        throw new AppError('No relocation site data found.', 404, 'RELOCATION_SITE_DATA_NOT_FOUND');
    }

    return res.status(200).json({
        count: result.rows.length,

        total_estimated_capacity: result.rows.reduce(
            (sum, row) => sum + Number(row.estimated_population_capacity),
            0,
        ),

        sites: result.rows,
    });
};

const nearestSafeZone = async (req, res) => {
    const validation = validateLocationSchema.safeParse(req.query);

    if (!validation.success) {
        throw new AppError('Invalid Coordinates!', 400, 'INVALID_COORDINATES');
    }

    const { lat, lon } = validation.data;

    const result = await postgresPool.query(
        `
        SELECT
            site_id,
            area_sqkm,
            buildable_pct,
            suitability_score,
            estimated_household_capacity,
            estimated_population_capacity,

            ST_Distance(
                wkb_geometry::geography,
                ST_SetSRID(
                    ST_MakePoint($1, $2),
                    4326
                )::geography
            ) / 1000.0 AS distance_km,

            ST_AsGeoJSON(
                ST_ClosestPoint(
                    wkb_geometry,
                    ST_SetSRID(
                        ST_MakePoint($1, $2),
                        4326
                    )
                )
            )::json AS nearest_point

        FROM relocation_sites

        ORDER BY
            wkb_geometry <-> ST_SetSRID(
                ST_MakePoint($1, $2),
                4326
            )

        LIMIT 1;
        `,
        [lon, lat],
    );

    if (result.rows.length === 0) {
        throw new AppError(
            'No relocation site found for this location.',
            404,
            'RELOCATION_SITE_NOT_FOUND',
        );
    }

    const site = result.rows[0];

    return res.status(200).json({
        from_location: {
            lat,
            lon,
        },

        nearest_safe_zone: {
            site_id: site.site_id,

            distance_km: parseFloat(Number(site.distance_km).toFixed(2)),

            area_sqkm: parseFloat(Number(site.area_sqkm).toFixed(2)),

            suitability_score: parseFloat(Number(site.suitability_score).toFixed(2)),

            estimated_household_capacity: site.estimated_household_capacity,

            estimated_population_capacity: site.estimated_population_capacity,

            nearest_point: site.nearest_point,
        },
    });
};

const floodZones = async (req, res) => {
    const result = await postgresPool.query(`
        SELECT json_build_object(
            'type', 'FeatureCollection',

            'features', json_agg(
                json_build_object(
                    'type', 'Feature',

                    'geometry',
                    ST_AsGeoJSON(wkb_geometry)::json,

                    'properties',
                    json_build_object(
                        'flood_zone_class',
                        flood_zone_class,

                        'area_sqkm',
                        area_sqkm
                    )
                )
            )
        ) AS geojson

        FROM flood_zones;
    `);

    if (!result.rows[0]?.geojson) {
        throw new AppError('No flood zone data found.', 404, 'FLOOD_ZONE_DATA_NOT_FOUND');
    }

    return res.status(200).json(result.rows[0].geojson);
};

export {
    getRedZones,
    checkLocation,
    nearestGreenZone,
    priorityVillages,
    locations,
    relocationSites,
    nearestSafeZone,
    floodZones,
};
