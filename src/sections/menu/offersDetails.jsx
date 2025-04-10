import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Box,
} from '@mui/material';import { RHFTextField } from 'src/components/hook-form';
import {
  useOfferDelMutation,
  useOfferInsertsMutation,
  useOfferListMutation,
} from 'src/services/menu';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleApiError } from 'src/utils/errorHandler';
import { toast } from 'sonner';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import dayjs from 'dayjs';

// Menu item Schema
export const offerSchema = z.object({
    amount:z.union([
      z.number(),
      z.string()
    ]).nullable().refine(val => (val !== null && val != ''), { message: 'Required' }),
    discount_percentage:z.union([
        z.number(),
        z.string()
      ]).nullable().refine(val => (val !== null && val != ''), { message: 'Required' }),

});

const OfferDetails = () => {
  const [offerValues, setOfferValues] = useState([]);

  const [offerInserts] = useOfferInsertsMutation();
  const [offerDel] = useOfferDelMutation();
  const [offerList] = useOfferListMutation();

  const offerMethod = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: {
        discount_percentage: 0,
        amount:0
    },
  });
  const {
    handleSubmit: offerSubmit,
    reset: offerReset,
    formState: { errors: offerError },
    
  } = offerMethod;

  // Addon Item creation and Edit fun
  const offerInsert = async (data) => {
    try {

      const response = await offerInserts(data).unwrap();

      if (response.status) {
        toast.success(response.message);
        offerListing();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };
  const offerListing = async () => {
    try {
      const response = await offerList().unwrap();

      if (response.status) {
        setOfferValues(response.data);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };
  const offerDelete = async (id) => {
    try {
      const formData = {
        id,
      };
      const response = await offerDel(formData).unwrap();

      if (response.status) {
        toast.success(response.message);
        offerListing();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
    offerListing();
  },[])
  return (
    <Box>
      <Card className="mt-5">
        <CardHeader title={<span className="flex items-center gap-4">Create Offers</span>} />
        <CardContent>
          <FormProvider {...offerMethod}>
            <form onSubmit={offerSubmit(offerInsert)} noValidate className="p-3 flex  gap-4">
              <RHFTextField name="amount" label="Discount Amount" type="number" size="small" />
              <RHFTextField name="discount_percentage" label="Discount Percentage" type="number" size="small" />

              <div>
                <Button variant="contained" color="primary" type="submit">
                  Add
                </Button>
              </div>
            </form>
          </FormProvider>

          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>S.NO</b>
                  </TableCell>
                  <TableCell>
                    <b>Discount Amount</b>
                  </TableCell>
                  <TableCell>
                    <b>Discount Percentage</b>
                  </TableCell>
                  <TableCell>
                    <b>Created Time</b>
                  </TableCell>
                  <TableCell>
                    <b>Delete</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offerValues.map((row, i) => (
                  <TableRow key={row.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.discount_percentage}</TableCell>
                    <TableCell>{dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          offerDelete(row.id);
                        }}
                      >
                        <MdOutlineDeleteOutline className="cursor-pointer hover:text-red-500 transition" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OfferDetails;
