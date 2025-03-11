import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ViewOrder } from 'src/sections/orders/view/view-order';


// ----------------------------------------------------------------------

const metadata = { title: `ViewOrder | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <ViewOrder/>
    </>
  );
}
