import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { MenuDetails } from '../menu-details';

// ----------------------------------------------------------------------

export function MenuCreation() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Menu"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Menu', href: paths.dashboard.tour.root },
          // { name: 'New tour' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MenuDetails />
    </DashboardContent>
  );
}
