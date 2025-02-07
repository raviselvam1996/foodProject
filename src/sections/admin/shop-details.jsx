import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardHeader, CardContent, Button, Typography } from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from "dayjs";
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { RHFEditor, RHFTextField } from 'src/components/hook-form';
import { useInfoUpdateMutation, usePolicyUpdateMutation, useShopSettingsQuery } from 'src/services/admin';
import { toast } from 'sonner';
import { handleApiError } from 'src/utils/errorHandler';
import { PolicySchema, ShopSchema } from './admin-schema';

const daysOfWeek = [
  { day: "Monday", pickupFrom: "08:00 AM", pickupTo: "10:00 AM", deliveryFrom: "10:30 AM", deliveryTo: "12:00 PM", shopFrom: "07:00 AM", shopTo: "09:00 PM" },
  { day: "Tuesday", pickupFrom: "09:30 AM", pickupTo: "11:00 AM", deliveryFrom: "11:30 AM", deliveryTo: "01:00 PM", shopFrom: "07:30 AM", shopTo: "09:30 PM" },
  { day: "Wednesday", pickupFrom: "07:45 AM", pickupTo: "09:45 AM", deliveryFrom: "10:00 AM", deliveryTo: "11:30 AM", shopFrom: "07:00 AM", shopTo: "08:30 PM" },
  { day: "Thursday", pickupFrom: "08:15 AM", pickupTo: "10:15 AM", deliveryFrom: "10:45 AM", deliveryTo: "12:15 PM", shopFrom: "07:15 AM", shopTo: "09:15 PM" },
  { day: "Friday", pickupFrom: "09:00 AM", pickupTo: "11:30 AM", deliveryFrom: "11:45 AM", deliveryTo: "01:15 PM", shopFrom: "07:45 AM", shopTo: "09:45 PM" },
  { day: "Saturday", pickupFrom: "10:00 AM", pickupTo: "12:00 PM", deliveryFrom: "12:30 PM", deliveryTo: "02:00 PM", shopFrom: "08:00 AM", shopTo: "10:00 PM" },
  { day: "Sunday", pickupFrom: "08:30 AM", pickupTo: "10:30 AM", deliveryFrom: "11:00 AM", deliveryTo: "12:30 PM", shopFrom: "07:30 AM", shopTo: "08:00 PM" },
];
export const ShopDetailComponent = () => {
  const [timeValues, setTimeValues] = useState(
    daysOfWeek.map((item) => ({
      pickupFrom: dayjs(item.pickupFrom, "hh:mm A"),
      pickupTo: dayjs(item.pickupTo, "hh:mm A"),
      deliveryFrom: dayjs(item.deliveryFrom, "hh:mm A"),
      deliveryTo: dayjs(item.deliveryTo, "hh:mm A"),
      shopFrom: dayjs(item.shopFrom, "hh:mm A"),
      shopTo: dayjs(item.shopTo, "hh:mm A"),
    }))
  );

  const {
    data: categoriesData,
    isLoading: loadingCategories,
    error: categoriesError,
    refetch,
  } = useShopSettingsQuery();
    const [policyUpdate] = usePolicyUpdateMutation();
    const [infoUpdate] = useInfoUpdateMutation();
  
  // Form for the AddOn
  const shopMethods = useForm({
    resolver: zodResolver(ShopSchema),
    defaultValues: {
      email: '',
      phone: null,
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

  const handleTimeChange = (index, type, newTime) => {
    const updatedTimes = [...timeValues];
    updatedTimes[index][type] = newTime;
    setTimeValues(updatedTimes);
  };
  const onSubmit = (data) => {
    console.log(data);

  }
   // Addon Item creation and Edit fun
   const shopSubmit = async (data) => {
    try {
      // Create FormData instance
      const formData = data;
      const  response = await infoUpdate(formData).unwrap();

      if (response.status) {
        toast.success(response.message);
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
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage)    }
  };
  return (
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
            {daysOfWeek.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.day}</TableCell>

                {/* Pickup Time */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TimePicker
                      value={timeValues[index].pickupFrom}
                      onChange={(newValue) => handleTimeChange(index, "pickupFrom", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                    <span>to</span>
                    <TimePicker
                      value={timeValues[index].pickupTo}
                      onChange={(newValue) => handleTimeChange(index, "pickupTo", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </div>
                </TableCell>

                {/* Delivery Time */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TimePicker
                      value={timeValues[index].deliveryFrom}
                      onChange={(newValue) => handleTimeChange(index, "deliveryFrom", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                    <span>to</span>
                    <TimePicker
                      value={timeValues[index].deliveryTo}
                      onChange={(newValue) => handleTimeChange(index, "deliveryTo", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </div>
                </TableCell>

                {/* Shop Run Time */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TimePicker
                      value={timeValues[index].shopFrom}
                      onChange={(newValue) => handleTimeChange(index, "shopFrom", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                    <span>to</span>
                    <TimePicker
                      value={timeValues[index].shopTo}
                      onChange={(newValue) => handleTimeChange(index, "shopTo", newValue)}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
              <RHFTextField name="phone" label="Phone Number" size="small" type='number' />
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
  )
}
