// Zod Schema

import { z } from "zod";



// Menu Schema
export const ShopSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required!' })
        .email({ message: 'Email must be a valid email address!' }),
    phone: z
        .number()
        .min(1, { message: 'Email is required!' }),
    address: z.string().min(1, { message: 'required!' }),
});

// Menu Schema
export const PolicySchema = z.object({

    privacy_policy: z.string().min(1, { message: 'required!' }),
    tnc: z.string().min(1, { message: 'required!' }),
});
