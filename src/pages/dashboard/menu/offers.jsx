import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { OffersPage } from 'src/sections/menu/view';


// ----------------------------------------------------------------------

const metadata = { title: `Offers | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <OffersPage/>
    </>
  );
}
