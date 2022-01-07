import { RouteProps } from 'react-router';
import PrototypeExamplePage from './PrototypeExamplePage';
import PrototypeReplaceData from './PrototypeReplaceData';
import PrototypeMetadata from './PrototypeMetadata';
import PrototypePublicMetadata from './PrototypePublicMetadata';
import PrototypeBauGlossary from './PrototypeBauGlossary';
import PrototypePreRelease from './PrototypePreRelease';
import PrototypePublicPreRelease from './PrototypePublicPreRelease';
import PrototypeTableHighlights from './PrototypeTableHighlights';
import PrototypeHomepage from './PrototypeHomepage';
import PrototypeHomepage2 from './PrototypeHomepage2';
import PrototypeRelease from './PrototypeRelease';
import PrototypeManageUsers from './PrototypeManageUsers';
import PrototypeAdminDashboard from './PrototypeAdminDashboard';
import PrototypeAdminPublication from './PrototypeAdminPublication';
import PrototypeAdminMethodology from './PrototypeAdminMethodology';
import PrototypeAdminContact from './PrototypeAdminContact';
import PrototypeAdminDetails from './PrototypeAdminDetails';
import PrototypeAdminAccess from './PrototypeAdminAccess';
import PrototypeAdminLegacy from './PrototypeAdminLegacy';

interface PrototypeRoute extends RouteProps {
  name: string;
  path: string;
}

const prototypeRoutes: PrototypeRoute[] = [
  {
    name: 'Example prototype',
    path: '/prototypes/example',
    component: PrototypeExamplePage,
  },
  {
    name: 'Replace existing data',
    path: '/prototypes/replaceData',
    component: PrototypeReplaceData,
  },
  {
    name: 'Create Public metadata',
    path: '/prototypes/metadata',
    component: PrototypeMetadata,
  },
  {
    name: 'View Public metadata',
    path: '/prototypes/public-metadata',
    component: PrototypePublicMetadata,
  },
  {
    name: 'BAU manage glossary',
    path: '/prototypes/manage-glossary',
    component: PrototypeBauGlossary,
  },
  {
    name: 'Pre release access',
    path: '/prototypes/pre-release',
    component: PrototypePreRelease,
  },
  {
    name: 'Public Pre release list',
    path: '/prototypes/public-pre-release',
    component: PrototypePublicPreRelease,
  },
  {
    name: 'Homepage A',
    path: '/prototypes/homepage',
    component: PrototypeHomepage,
  },
  {
    name: 'Homepage B',
    path: '/prototypes/homepage2',
    component: PrototypeHomepage2,
  },
  {
    name: 'Table highlights',
    path: '/prototypes/table-highlights',
    component: PrototypeTableHighlights,
  },
  {
    name: 'Release',
    path: '/prototypes/release',
    component: PrototypeRelease,
  },
  {
    name: 'Manage users',
    path: '/prototypes/manage-users',
    component: PrototypeManageUsers,
  },
  {
    name: 'Admin dashboard',
    path: '/prototypes/admin-dashboard',
    component: PrototypeAdminDashboard,
  },
  {
    name: 'Admin publication',
    path: '/prototypes/admin-publication',
    component: PrototypeAdminPublication,
  },
  {
    name: 'Admin methodology',
    path: '/prototypes/admin-methodology',
    component: PrototypeAdminMethodology,
  },
  {
    name: 'Admin contact',
    path: '/prototypes/admin-contact',
    component: PrototypeAdminContact,
  },
  {
    name: 'Admin publication details',
    path: '/prototypes/admin-details',
    component: PrototypeAdminDetails,
  },
  {
    name: 'Admin manage access',
    path: '/prototypes/admin-access',
    component: PrototypeAdminAccess,
  },
  {
    name: 'Admin legacy releases',
    path: '/prototypes/admin-legacy',
    component: PrototypeAdminLegacy,
  },
];

export default prototypeRoutes;
