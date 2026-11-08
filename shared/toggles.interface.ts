import {ENV} from './env.interface.ts';
import z from 'zod';


const ToggleEnvironmentSchema = z.object({
    envName: z.enum(ENV),
    value: z.boolean()
})

const FeatureToggleSchema = z.object({
    name: z.string(),
    id: z.string(),
    envs: z.array(ToggleEnvironmentSchema)
})

export const AppToggleSchema = z.object({
    name: z.string(),
    features: z.array(FeatureToggleSchema)
});

export const ToggleFileSchema = z.object({
    apps: z.array(AppToggleSchema)
});

export type ToggleFile = z.infer<typeof ToggleFileSchema>;
export type AppToggle = z.infer<typeof AppToggleSchema>;
