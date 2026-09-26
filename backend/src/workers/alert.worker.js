import { Worker } from 'bullmq';

import { bullRedis } from '../config/redis.js';
import { env } from '../config/env.js';
import { mailTransporter } from '../config/mail.js';
import { logger } from '../utils/logger.js';
import { emergencyVolunteerEmail } from '../templates/emergencyVolunteerEmail.js';

const alertWorker = new Worker(
    'volunteer-alerts',

    async (job) => {
        const { volunteerId, name, email, district, safeZoneLat, safeZoneLng } = job.data;

        const html = emergencyVolunteerEmail({
            name,
            district,
            safeZoneLat,
            safeZoneLng,
        });

        const hasSafeZone =
            safeZoneLat !== null &&
            safeZoneLng !== null &&
            safeZoneLat !== undefined &&
            safeZoneLng !== undefined;

        const text = [
            `Hello ${name},`,
            '',
            'Your area has been identified as a Red Zone.',
            'Volunteer support may be required in your district.',
            '',
            `District: ${district}`,
            '',
            hasSafeZone
                ? `Nearest safe zone coordinates: ${safeZoneLat}, ${safeZoneLng}`
                : 'A safe-zone location is currently unavailable.',
            '',
            hasSafeZone
                ? 'Please use the safe-zone route provided in this email.'
                : 'Please follow instructions from the district response team.',
            '',
            'Do not enter unsafe areas if authorities have issued movement restrictions.',
            '',
            '— Sindhu Drishti',
        ].join('\n');

        await mailTransporter.sendMail({
            from: `"Sindhu Drishti" <${env.SMTP_USER}>`,

            to: email,

            subject: '🚨 Sindhu Drishti — Emergency Volunteer Alert',

            text,

            html,

            headers: {
                'X-Sindhu-Drishti-Volunteer-ID': String(volunteerId),
            },
        });

        logger.info(
            {
                volunteerId,
                district,
                email,
                safeZoneLat,
                safeZoneLng,
            },
            'Volunteer alert email sent',
        );
    },

    {
        connection: bullRedis,
        concurrency: 5,
    },
);

alertWorker.on('failed', (job, error) => {
    logger.error(
        {
            jobId: job?.id,
            volunteerId: job?.data?.volunteerId,
            err: error,
        },
        'Volunteer alert email failed',
    );
});

alertWorker.on('error', (error) => {
    logger.error(
        {
            err: error,
        },
        'Volunteer alert worker error',
    );
});

export { alertWorker };
