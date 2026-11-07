import {ENV} from './env.interface.ts';

export interface ToggleFile {
    apps: AppToggles[];
}

export interface AppToggles {
    name: string;
    features: FeatureToggle[];
}

interface FeatureToggle {
    name: string;
    id: string;
    envs: [
        LocalEnv,
        ProdEnv
    ];
}

interface Environment{
    envName: ENV;
    value: boolean;
}

interface LocalEnv extends Environment {
    envName: ENV.local;
}

interface ProdEnv extends Environment {
    envName: ENV.prod;
}