import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { Admin } from 'src/sections/admin/view';


// ----------------------------------------------------------------------

const metadata = { title: `Admin | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <Admin/>
    </>
  );
}
