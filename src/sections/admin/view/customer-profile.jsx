import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CustomerProfileTable } from '../customerProfile/customer-profile-table';



// ----------------------------------------------------------------------

export function CustomerProfile() {
    const dar = 'fsdfjsdf'
    console.log(dar);
    
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Menu"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Employee Profile', href: paths.dashboard.tour.root },
          // { name: 'New tour' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

<CustomerProfileTable/>
    </DashboardContent>
  );
}
