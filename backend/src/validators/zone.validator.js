import { z } from 'zod';

const validateLocationSchema = z.object({
    lat: z.coerce.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),

    lon: z.coerce.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
});

const priorityVillageQuerySchema = z.object({
    tier: z
        .string()
        .trim()
        .toUpperCase()
        .refine((value) => ['IMMEDIATE', 'SHORT_TERM', 'MEDIUM_TERM', 'MONITOR'].includes(value), {
            message: 'tier must be one of: IMMEDIATE, SHORT_TERM, MEDIUM_TERM, MONITOR',
        })
        .optional(),
});

export { validateLocationSchema, priorityVillageQuerySchema };
