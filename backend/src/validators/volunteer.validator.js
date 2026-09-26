import { z } from 'zod';
const registerVolunteerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
    email: z
        .email('Please provide a valid email address')
        .trim()
        .toLowerCase()
        .max(254, 'Email must not exceed 254 characters'),
    skills: z
        .array(
            z
                .string()
                .trim()
                .min(1, 'Skill cannot be empty')
                .max(50, 'Skill must not exceed 50 characters'),
        )
        .min(1, 'At least one skill is required')
        .max(20, 'Maximum 20 skills are allowed'),
    latitude: z.coerce.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
    longitude: z.coerce.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
    availability: z.boolean().default(true),
    district: z
        .string()
        .trim()
        .min(1, 'District is required')
        .max(100, 'District must not exceed 100 characters'),
    vehicle: z
        .string()
        .trim()
        .max(50, 'Vehicle information must not exceed 50 characters')
        .nullable()
        .optional(),
});
export { registerVolunteerSchema };
