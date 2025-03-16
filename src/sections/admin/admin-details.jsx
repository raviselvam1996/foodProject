import { Grid } from '@mui/material';
import React from 'react';
import { AdminListView } from './admin-list-views';

const AdminDetails = () => {
  return (
    <Grid container spacing={6}>
          <Grid item xs={12} sm={12}>
          <AdminListView/>

          </Grid>

    </Grid>
  );
};

export default AdminDetails;
