import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import {  CustomerProfile } from 'src/sections/admin/view';


// ----------------------------------------------------------------------

const metadata = { title: `Employee Profile | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <CustomerProfile/>
    </>
  );
}
