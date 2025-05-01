import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import FaildOrdersDetails from '../faildOrders';


// ----------------------------------------------------------------------

export function FaildOrders() {
  return (
    <DashboardContent>
      {/* <CustomBreadcrumbs
        heading="Orders History"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Order History', href: paths.dashboard.tour.root },
          // { name: 'New tour' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      /> */}

<FaildOrdersDetails/>
    </DashboardContent>
  );
}
