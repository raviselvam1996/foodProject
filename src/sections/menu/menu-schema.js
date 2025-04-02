// Zod Schema

import { z } from "zod";


// Menu Schema
export const schema = z.object({
  name: z.string().min(1, { message: 'required!' }),
  short_desc: z.string().min(1, { message: 'required!' }),
});
// Menu item Schema
export const itemSchema = z.object({
    name: z.string().min(1, { message: 'required!' }),
    price:z.union([
      z.number(),
      z.string()
    ]).nullable().refine(val => (val !== null && val != ''), { message: 'Required' }),

  food_type: z.string(),
  short_desc: z.string(),
  long_desc: z.string(),
});
// Addon schema
export const addonSchema = z  
  .object({
    name: z.string().min(1, { message: 'AddOn Name is required!' }),
    select_upto: z.number(), // Prevents 0 and negative numbers
    is_required: z.boolean(),
    is_multi_select: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.is_multi_select) {
        return data.select_upto !== null && data.select_upto >= 1;
      }
      return true; // If is_multi_select is false, select_upto can be null
    },
    {
      message: 'Select Upto is required!',
      path: ['select_upto'],
    }
  );
//   Addon Item schema
  export const addonItemSchema = z.object({
  name: z.string().min(1, { message: 'required!' }),
  price: z.union([
    z.number(),
    z.string()
  ]).optional()
});