import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import OrderDetails from '../orderDetails';


// ----------------------------------------------------------------------

export function Order() {

  return (
    <DashboardContent>
      {/* <CustomBreadcrumbs
        heading="Orders"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Order', href: paths.dashboard.tour.root },
          // { name: 'New tour' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      /> */}

<OrderDetails/>
    </DashboardContent>
  );
}
