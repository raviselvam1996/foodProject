import { Navigate, useRoutes } from 'react-router-dom';

// import { MainLayout } from 'src/layouts/main';

// import { SplashScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------


export function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to='/dashboard/analytics' replace />,

      // element: (
      //   <Suspense fallback={<SplashScreen />}>
      //     <MainLayout>
      //       <HomePage />
      //     </MainLayout>
      //   </Suspense>
      // ),
    },

    // Auth
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Main
    ...mainRoutes,

    // Components
    ...componentsRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
