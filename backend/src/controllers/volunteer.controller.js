import { postgresPool } from '../config/database.js';
import { alertQueue } from '../queues/alert.queue.js';
import { AppError } from '../utils/errors.js';
import { registerVolunteerSchema } from '../validators/volunteer.validator.js';

const registerVolunteer = async (req, res) => {
    const validation = registerVolunteerSchema.safeParse(req.body);

    if (!validation.success) {
        throw new AppError(validation.error.issues[0].message, 400, 'VALIDATION_ERROR');
    }

    const { name, email, skills, latitude, longitude, availability, district, vehicle } =
        validation.data;

    try {
        const result = await postgresPool.query(
            `
            INSERT INTO volunteers (
                name,
                email,
                skills,
                latitude,
                longitude,
                location,
                availability,
                district,
                vehicle
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                ST_SetSRID(
                    ST_MakePoint($5, $4),
                    4326
                )::geography,
                $6,
                $7,
                $8
            )
            RETURNING
                id,
                name,
                email,
                skills,
                latitude,
                longitude,
                availability,
                district,
                vehicle,
                created_at,
                updated_at;
            `,
            [name, email, skills, latitude, longitude, availability, district, vehicle ?? null],
        );

        return res.status(201).json({
            success: true,
            message: 'Volunteer registered successfully.',
            volunteer: result.rows[0],
        });
    } catch (error) {
        if (error.code === '23505') {
            throw new AppError(
                'A volunteer with this email already exists.',
                409,
                'VOLUNTEER_EMAIL_ALREADY_EXISTS',
            );
        }

        throw error;
    }
};

const getAlertVolunteers = async (req, res) => {
    const { distCode } = req.user;

    if (!distCode) {
        throw new AppError(
            'District information missing from authentication token.',
            400,
            'DISTRICT_NOT_FOUND',
        );
    }

    const result = await postgresPool.query(
        `
        SELECT
            id,
            name,
            email,
            skills,
            latitude,
            longitude,
            availability,
            district,
            vehicle,
            created_at,
            updated_at
        FROM volunteers
        WHERE district = $1
        ORDER BY created_at DESC;
        `,
        [distCode],
    );

    return res.status(200).json({
        success: true,
        district: distCode,
        count: result.rows.length,
        volunteers: result.rows,
    });
};

const sendAlert = async (req, res) => {
    const { distCode } = req.user;

    if (!distCode) {
        throw new AppError(
            'District information missing from authentication token.',
            400,
            'DISTRICT_NOT_FOUND',
        );
    }

    const result = await postgresPool.query(
        `
        SELECT DISTINCT
            v.id,
            v.name,
            v.email,
            v.skills,
            v.latitude,
            v.longitude,
            v.availability,
            v.district,
            v.vehicle
        FROM volunteers v
        INNER JOIN red_zones rz
            ON ST_Contains(
                rz.wkb_geometry,
                v.location::geometry
            )
        WHERE v.district = $1
            AND v.availability = TRUE
            AND rz.zone_class = 2;
        `,
        [distCode],
    );

    if (result.rows.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No available volunteers found in red zones.',
            count: 0,
        });
    }

    const jobs = [];

    for (const volunteer of result.rows) {
        const safeZoneResult = await postgresPool.query(
            `
            SELECT
                site_id,
                ST_Y(
                    ST_PointOnSurface(wkb_geometry)
                ) AS latitude,
                ST_X(
                    ST_PointOnSurface(wkb_geometry)
                ) AS longitude
            FROM relocation_sites
            WHERE wkb_geometry IS NOT NULL
            ORDER BY
                wkb_geometry <-> ST_SetSRID(
                    ST_MakePoint($2, $1),
                    4326
                )
            LIMIT 1;
            `,
            [volunteer.latitude, volunteer.longitude],
        );

        const safeZone = safeZoneResult.rows[0] ?? null;

        jobs.push({
            name: 'volunteer-alert',

            data: {
                volunteerId: volunteer.id,
                name: volunteer.name,
                email: volunteer.email,
                district: volunteer.district,

                safeZoneLat: safeZone ? Number(safeZone.latitude) : null,

                safeZoneLng: safeZone ? Number(safeZone.longitude) : null,
            },

            opts: {
                attempts: 3,

                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },

                removeOnComplete: 1000,
                removeOnFail: 5000,
            },
        });
    }

    await alertQueue.addBulk(jobs);

    return res.status(202).json({
        success: true,
        message: 'Alert queued successfully.',
        count: jobs.length,
    });
};

export { registerVolunteer, getAlertVolunteers, sendAlert };
