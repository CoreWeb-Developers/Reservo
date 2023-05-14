import z from 'zod';
import { SERVICE_NAME_LENGTH, SERVICE_DESCRIPTION_LENGTH, LATITUDE, LONGITUDE } from '../consts/validation';

export const subscribeSchema = z.object({
  isVisible: z.boolean(),
  promoCode: z.string().optional(),
});

const createSchema = z
  .object({
    name: z.string().min(SERVICE_NAME_LENGTH.min).max(SERVICE_NAME_LENGTH.max),
    description: z.string().min(SERVICE_DESCRIPTION_LENGTH.min).max(SERVICE_DESCRIPTION_LENGTH.max),
    price: z.number({ invalid_type_error: 'Input price' }).min(0),
    ticketsAvailable: z.number({ invalid_type_error: 'Input number of tickets' }).positive(),
    isNotificationsOn: z.boolean(),
    isPublic: z.boolean(),
    date: z.coerce.date().min(new Date(), { message: 'Set date in the future' }),
    publishDate: z.coerce.date(),
    latitude: z.number().min(LATITUDE.min).max(LATITUDE.max),
    longitude: z.number().min(LONGITUDE.min).max(LONGITUDE.max),
    companyId: z.number().positive(),
    formatId: z.number().positive(),
    themeId: z.number().positive(),
  })
  .refine((data) => data.date >= data.publishDate, {
    message: 'Publication date must be before the service date',
    path: ['publishDate'],
  });

const updateSchema = z
  .object({
    name: z.string().min(SERVICE_NAME_LENGTH.min).max(SERVICE_NAME_LENGTH.max),
    description: z.string().min(SERVICE_DESCRIPTION_LENGTH.min).max(SERVICE_DESCRIPTION_LENGTH.max),
    price: z.number({ invalid_type_error: 'Input price' }).min(0),
    ticketsAvailable: z.number({ invalid_type_error: 'Input number of slots available' }).positive(),
    isNotificationsOn: z.boolean(),
    isPublic: z.boolean(),
    date: z.coerce.date().min(new Date(), { message: 'Set date in the future' }),
    publishDate: z.coerce.date(),
    latitude: z.number().min(LATITUDE.min).max(LATITUDE.max),
    longitude: z.number().min(LONGITUDE.min).max(LONGITUDE.max),
    formatId: z.number().positive(),
    themeId: z.number().positive(),
  })
  .refine((data) => data.date >= data.publishDate, {
    message: 'Publication date must be before the service date',
    path: ['publishDate'],
  });

export { createSchema, updateSchema };
export type ISubscribe = z.infer<typeof subscribeSchema>;
export type ICreate = z.infer<typeof createSchema>;
export type IUpdate = z.infer<typeof updateSchema>;
