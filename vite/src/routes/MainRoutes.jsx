import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const ProfilePage = Loadable(lazy(() => import('views/profile-page')));
const JobPage = Loadable(lazy(() => import('views/job-page')));
const SkillPage = Loadable(lazy(() => import('views/skill-page')));
const SkillDetail = Loadable(lazy(() => import('views/skill-page/skill-detail')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'profile-page',
      element: <ProfilePage />
    },
    {
      path: 'job-page',
      element: <JobPage />
    },
    {
      path: 'skill-page',
      element: <SkillPage />
    },
    {
      path: 'skill-detail',
      element: <SkillDetail />
    }
  ]
};

export default MainRoutes;
