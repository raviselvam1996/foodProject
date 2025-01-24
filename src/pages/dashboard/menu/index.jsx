import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MenuCreation } from 'src/sections/menu/view';

// ----------------------------------------------------------------------

const metadata = { title: `User profile | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <MenuCreation />
    </>
  );
}
