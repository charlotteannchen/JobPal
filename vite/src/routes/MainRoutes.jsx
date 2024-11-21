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
const Job1 = Loadable(lazy(() => import('views/job-page/job1')));
const Job3 = Loadable(lazy(() => import('views/job-page/job3')));

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
      path: 'utils',
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-color',
          element: <UtilsColor />
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'tabler-icons',
    //       element: <UtilsTablerIcons />
    //     }
    //   ]
    // },
    // {
    //   path: 'icons',
    //   children: [
    //     {
    //       path: 'material-icons',
    //       element: <UtilsMaterialIcons />
    //     }
    //   ]
    // },
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
      path: 'job-page/job1',
      element: <Job1 />
    }, 
    {
      path: 'job-page/job3',
      element: <Job3 />
    }
  ]
};

export default MainRoutes;
