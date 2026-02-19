import { lazy } from 'react';
import { ROLES } from '../permissions/roles';

export const ROUTES = [
    {
        path: '/',
        component: lazy(() => import('../../Components/Common/FirstPage')),
        roles: null, 
    },
    {
        path: '/home',
        component: lazy(() => import('../../Components/Common/Home')),
        roles: null, 
    },
    {
        path: '/page',
        component: lazy(() => import('../../Components/Common/Page')),
        roles: null, 
    },
    {
        path: '/page/detail',
        component: lazy(() => import('../../Components/Common/PageDetail')),
        roles: null, 
    },
    {
        path: '/contact',
        component: lazy(() => import('../../Components/Common/Contact')),
        roles: null, 
    },
];

