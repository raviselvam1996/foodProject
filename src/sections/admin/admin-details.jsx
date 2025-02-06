import { Button, Card, CardContent, CardHeader, Grid } from '@mui/material';
import React from 'react';
import { FaShop } from 'react-icons/fa6';
import { FaUserFriends } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdFeedback } from "react-icons/md";
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

const AdminDetails = () => {
  const dar = 'sdfjhdsjkf';
  console.log(dar);
  const router = useRouter();

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-4">
                <FaShop />
                Shop Settings
              </span>
            }
          />
          <CardContent>
            <p className="text-gray-500">ndsbfajs jsdhkjf skdjfh ks jhsfdk dhfhkasdfh</p>
            <div className='flex justify-end'>
            <Button variant="outlined" color="primary" size="small"  href={paths.dashboard.admin.shopDetail}
            >
              View
            </Button>
            </div>
        
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-4">
<FaUserFriends />
Employee Profile
              </span>
            }
          />
          <CardContent>
            <p className="text-gray-500">ndsbfajsdhfhkasdfh</p>
            <div className='flex justify-end'>
            <Button variant="outlined" color="primary" size="small" className="">
              View
            </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-4">
                <HiUserGroup />
                <span> Customer Profile</span>
              </span>
            }
          />
          <CardContent>
            <p className="text-gray-500">ndsbfajsdhfhkasdfh</p>
            <div className='flex justify-end'>
            <Button variant="outlined" color="primary" size="small" className="">
              View
            </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-4">
                <MdFeedback />
                <span> Feedback</span>
              </span>
            }
          />
          <CardContent>
            <p className="text-gray-500">ndsbfajsdhfhkasdfh</p>
            <div className='flex justify-end'>
            <Button variant="outlined" color="primary" size="small" className="">
              View
            </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminDetails;
