import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import AdminDetails from '../admin-details';


// ----------------------------------------------------------------------

export function Admin() {
    const dar = 'fsdfjsdf'
    console.log(dar);
    
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Menu"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Admin', href: paths.dashboard.tour.root },
          // { name: 'New tour' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

<AdminDetails/>
    </DashboardContent>
  );
}
