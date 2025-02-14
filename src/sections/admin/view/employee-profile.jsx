import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmployeeProfileTable } from '../emplyeeProfile/employee-profile-table';
// import AdminDetails from '../admin-details';


// ----------------------------------------------------------------------

export function EmployeeProfile() {
    
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Employee Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Employee Profile', href: paths.dashboard.tour.root },
          // { name: 'New tour' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

<EmployeeProfileTable/>
    </DashboardContent>
  );
}
