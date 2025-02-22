import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material';
import React from 'react';
import { FaShop } from 'react-icons/fa6';
import { FaUserFriends } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdFeedback } from "react-icons/md";
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { AdminListView } from './admin-list-views';

const AdminDetails = () => {
  const dar = 'sdfjhdsjkf';
  console.log(dar);
  const router = useRouter();

  return (
    <Grid container spacing={6}>
          <Grid item xs={12} sm={12}>
          <AdminListView/>

          </Grid>

    </Grid>
  );
};

export default AdminDetails;
