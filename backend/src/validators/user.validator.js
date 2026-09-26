import { z } from 'zod';

const registerValidateSchema = z.object({
    fullname: z
        .string()
        .trim()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name cannot exceed 100 characters'),

    email: z
        .email('Please provide a valid email address')
        .trim()
        .toLowerCase()
        .max(254, 'Email cannot exceed 254 characters'),

    distCode: z
        .string()
        .trim()
        .min(1, 'District code is required')
        .max(20, 'District code cannot exceed 20 characters'),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password cannot exceed 128 characters'),
});

const loginValidateSchema = z.object({
    distCode: z
        .string()
        .trim()
        .min(1, 'District code is required')
        .max(20, 'District code cannot exceed 20 characters'),

    email: z
        .email('Please provide a valid email address')
        .trim()
        .toLowerCase()
        .max(254, 'Email cannot exceed 254 characters'),

    password: z
        .string()
        .min(1, 'Password is required')
        .max(128, 'Password cannot exceed 128 characters'),
});

export { registerValidateSchema, loginValidateSchema };
