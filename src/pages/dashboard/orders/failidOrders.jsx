import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { FaildOrders } from 'src/sections/orders/view';


// ----------------------------------------------------------------------

const metadata = { title: `Failed Orders | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <FaildOrders/>
    </>
  );
}
