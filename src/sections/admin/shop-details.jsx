import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardHeader, CardContent, Button, Typography, CircularProgress } from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from "dayjs";
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { RHFEditor, RHFTextField } from 'src/components/hook-form';
import { useInfoUpdateMutation, usePolicyUpdateMutation, useShopSettingsQuery, useTimingUpdateMutation } from 'src/services/admin';
import { toast } from 'sonner';
import { handleApiError } from 'src/utils/errorHandler';
import { PolicySchema, ShopSchema } from './admin-schema';
import { LoadingScreen } from 'src/components/loading-screen';

export const ShopDetailComponent = () => {
  const [timeValues, setTimeValues] = useState([])
  // Form for the AddOn
  const shopMethods = useForm({
    resolver: zodResolver(ShopSchema),
    defaultValues: {
      email: '',
      phone: '',
      address: '',
    },
  });
  const {
    handleSubmit: shopHandleSubmit,
    watch: shopWatch,
    reset: shopReset,
    formState: { errors: shopError },
  } = shopMethods;

    // Form for the AddOn
    const policyMethods = useForm({
      resolver: zodResolver(PolicySchema),
      defaultValues: {
        privacy_policy: '',
        tnc: '',
      },
    });
    const {
      handleSubmit: policyHandleSubmit,
      watch: policyWatch,
      reset: policyReset,
      formState: { errors: policyError },
    } = policyMethods;

  const {
    data: shopData,
    isLoading: loadingCategories,
    error: categoriesError,
    refetch,
  } = useShopSettingsQuery();
    const [policyUpdate] = usePolicyUpdateMutation();
    const [infoUpdate] = useInfoUpdateMutation();
    const [timingUpdate] = useTimingUpdateMutation();
  
    useEffect(() => {
if(shopData?.shopTimimngs?.length > 0){
  const datass = shopData.shopTimimngs
  const timings = datass.map((item) => ({
    id:item.id,
    day:item.day,
    pickup_from: dayjs(item.pickup_from),
    pickup_to: dayjs(item.pickup_to),
    delivery_from: dayjs(item.delivery_from),
    delivery_to: dayjs(item.delivery_to),
    shop_opensat: dayjs(item.shop_opensat),
    shop_closesat: dayjs(item.shop_closesat),
  }))
  setTimeValues(timings)
  const info = shopData?.shop || {  email: '',
    phone: null,
    address: '',}

  shopReset(
    {
      email: info.email,
      phone:info.phone,
      address: info.address,
    }
  )
  const policy = shopData?.policy || {      privacy_policy: '',
    tnc: '',  }

  policyReset(
    {
      privacy_policy: policy.privacy_policy,
      tnc: policy.tnc,
    }
  )
}
    },[shopData,shopReset,policyReset])

  const handleTimeChange = (index, type, newTime) => {
    const updatedTimes = [...timeValues];
    updatedTimes[index][type] = newTime;
    setTimeValues(updatedTimes);
  };

   // Addon Item creation and Edit fun
   const shopSubmit = async (data) => {
    try {
      // Create FormData instance
      const formData = data;
      const  response = await infoUpdate(formData).unwrap();

      if (response.status) {
        toast.success(response.message);
      }else{
        toast.error(response.message);
      }
      } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)    }
  };

   // Addon Item creation and Edit fun
   const policySubmit = async (data) => {
    try {
      // Create FormData instance
      const formData = data;
      const  response = await policyUpdate(formData).unwrap();

      if (response.status) {
        toast.success(response.message);
      }else{
        toast.error(response.message);
      }
        } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)    }
  };
     // Addon Item creation and Edit fun
     const timingSubmit = async () => {
      try {
        // Create FormData instance
        const formData = timeValues;
        const  response = await timingUpdate(formData).unwrap();
  
        if (response.status) {
          toast.success(response.message);
        }else{
          toast.error(response.message);
        }
      } catch (error) {
        const errorMessage = handleApiError(error);
        console.error(errorMessage);
        toast.error(errorMessage)    }
    };
  return (
    <>
    
    {
      loadingCategories ? 

      <LoadingScreen />
    :
    <>
      <TableContainer component={Paper}>
        <Table size="small"> {/* Smaller Table */}
          <TableHead>
            <TableRow>
              <TableCell><strong>Day</strong></TableCell>
              <TableCell><strong>Pickup Time (From - To)</strong></TableCell>
              <TableCell><strong>Delivery Time (From - To)</strong></TableCell>
              <TableCell><strong>Shop Run Time (From - To)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeValues?.length > 0 &&  timeValues?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.day}</TableCell>

                {/* Pickup Time */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TimePicker
                      value={item.pickup_from}
                      onChange={(newValue) => handleTimeChange(index, "pickup_from", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                    <span>to</span>
                    <TimePicker
                      value={item.pickup_to}
                      onChange={(newValue) => handleTimeChange(index, "pickup_to", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </div>
                </TableCell>

                {/* Delivery Time */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TimePicker
                      value={item.delivery_from}
                      onChange={(newValue) => handleTimeChange(index, "delivery_from", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                    <span>to</span>
                    <TimePicker
                      value={item.delivery_to}
                      onChange={(newValue) => handleTimeChange(index, "delivery_to", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </div>
                </TableCell>

                {/* Shop Run Time */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TimePicker
                      value={item.shop_opensat}
                      onChange={(newValue) => handleTimeChange(index, "shop_opensat", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                    <span>to</span>
                    <TimePicker
                      value={item.shop_closesat}
                      onChange={(newValue) => handleTimeChange(index, "shop_closesat", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className='flex justify-end mt-5'>

<Button variant="contained" color="primary" onClick={timingSubmit} 
>
Time Update
</Button>
</div>
      <Card>
        <CardHeader
          title={
            <span className="flex items-center gap-4">
              Shop Contact Info
            </span>
          }
        />
        <CardContent>
          <FormProvider {...shopMethods}>
            <form onSubmit={shopHandleSubmit(shopSubmit)} noValidate className="p-3 flex flex-col gap-4">
              <RHFTextField name="email" label="Email Address" size="small" type='email' />
              <RHFTextField name="phone" label="Phone Number" size="small"  />
              <RHFTextField name="address" label="Address" size="small" />
              <div className='flex justify-end'>

              <Button variant="contained" color="primary" type="submit" 
            >
              Submit
            </Button>
            </div>
            </form>
          </FormProvider>  

        </CardContent>
      </Card>

      <Card className='mt-5'>
        <CardHeader
          title={
            <span className="flex items-center gap-4">

              Shop Policy
            </span>
          }
        />
        <CardContent>
          <FormProvider {...policyMethods}>
            <form onSubmit={policyHandleSubmit(policySubmit)} noValidate className="p-3 flex flex-col gap-4">
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            Privacy Policy
          </Typography>
                            <RHFEditor fullItem name="privacy_policy" sx={{ maxHeight: 480 }} />
                            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            Terms & Conditions
          </Typography>
                            <RHFEditor fullItem name="tnc" sx={{ maxHeight: 480 }} />
              <div className='flex justify-end'>

              <Button variant="contained" color="primary" type="submit" 
            >
              Submit
            </Button>
              </div>
            </form>
          </FormProvider>  

        </CardContent>
      </Card>
    </>
    }
    </>
  )
}
