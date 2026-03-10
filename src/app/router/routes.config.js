import { lazy } from 'react';
import { ROLES } from '../permissions/roles';

export const ROUTES = [
    {
        path: '/',
        component: lazy(() => import('../../Components/Common/FirstCategory')),
        roles: null,
        layout: 'admin',
    },
    {
        path: '/time',
        component: lazy(() => import('../../Components/Common/Time')),
        roles: null,
        layout: 'admin',
    },
    {
        path: '/hr',
        component: lazy(() => import('../../Components/Common/hr')),
        roles: null,
        layout: 'admin',
    },
];
