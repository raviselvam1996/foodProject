// Zod Schema

import { z } from "zod";



// Menu Schema
export const ShopSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
        phone: z
        .string()
        .min(10, { message: 'Phone number must be at least 10 digits!' }) // Adjust length as needed
        .max(15, { message: 'Phone number cannot exceed 15 digits!' }) // Prevent overly long numbers
        .regex(/^\d+$/, { message: 'Phone number must contain only digits!' }), // Only numbers allowed

    address: z.string().min(1, { message: 'required!' }),
});

// Menu Schema
export const PolicySchema = z.object({

    privacy_policy: z.string().min(1, { message: 'required!' }),
    tnc: z.string().min(1, { message: 'required!' }),
});

// EMployee Schema
export const EmployeeSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
        phone_number: z
        .string()
        .min(10, { message: 'Phone number must be at least 10 digits!' }) // Adjust length as needed
        .max(15, { message: 'Phone number cannot exceed 15 digits!' }) // Prevent overly long numbers
        .regex(/^\d+$/, { message: 'Phone number must contain only digits!' }), // Only numbers allowed

        password: z
        .string()
        .optional(), // Adjust length as needed


    name: z.string().min(1, { message: 'required!' }),
});