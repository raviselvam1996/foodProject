import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import OfferDetails from '../offersDetails';


// ----------------------------------------------------------------------

export function OffersPage() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Offers"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Offers', href: paths.dashboard.tour.root },
          // { name: 'New tour' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
<OfferDetails/>
    </DashboardContent>
  );
}
