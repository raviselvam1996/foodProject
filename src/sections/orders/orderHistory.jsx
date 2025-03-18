import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  MenuItem,
  FormControl,
  Select,
  Paper,
} from '@mui/material';
import { formatPrice } from 'src/utils/amountChange';
import { useGetOrderHistoryMutation, useOrderChangeMutation, useOrderListMutation } from 'src/services/order';
import { toast } from 'sonner';
import { handleApiError } from 'src/utils/errorHandler';
import { formatString } from 'src/utils/change-case';
import { FaAddressCard } from 'react-icons/fa';


const OrderHistoryDetails = () => {
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [orderData, setOrderData] = useState([]);

  const [getOrderHistory, { isLoading: orderLoad }] = useGetOrderHistoryMutation();

  const orderListGet = async () => {
    try {
      const response = await getOrderHistory().unwrap();
      if (response.status) {
        setOrderData(response.data);
        setSelectedOrder(response?.data[0] || []);
      } else {
        setOrderData([]);
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
    orderListGet();
  }, []);

  return (
    <Box>
      {/* Order Header */}
      {/* <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" color="error">
          Today (1)
        </Button>
        <Button variant="outlined" color="success">
          Tomorrow (2)
        </Button>
        <Button variant="outlined">Previous Orders</Button>
      </Box> */}
      {orderLoad ? (
        <div className="flex justify-center items-center mt-10">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          {orderData.length > 0 ? (
            <Grid container spacing={2}>
              {/* Left Side - Orders List */}
              <Grid
                item
                xs={5}
                sx={{ height: '100vh', overflowY: 'auto', pr: 1, pb: 1 }}
                className="custom-scroll"
              >
                {orderData.length > 0 &&
                  orderData.map((order) => (
                    <Card
                      key={order.order_id}
                      sx={{
                        mt: 2,
                        p: 2,
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedOrder(order)}
                      className={`border-l-4 p-4 ${order.order_id === selectedOrder.order_id ? 'border-red-500' : 'border-grey-500'}`}
                    >
                      {/* Customer and Order ID */}
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1" fontSize={15} style={{ color: 'red' }}>
                          {order.user_name}
                        </Typography>
                        <Typography variant="subtitle1" fontSize={14}>
                          <span className="text-sm">
                            ORD ID -<span style={{ color: 'red' }}> {order.order_id}</span>{' '}
                          </span>
                        </Typography>
                      </Box>

                      {/* Items List - Left Item Name, Right Price */}
                      {order.items.map((item, index) => (
                        <Box
                          key={index}
                          display="flex"
                          justifyContent="space-between"
                          sx={{ mb: 1, mt: 3 }}
                        >
                          <Typography fontWeight="bold" fontSize={14}>
                            {item.qty} X {item.item_name}
                          </Typography>
                          <Typography fontWeight="bold" fontSize={14}>
                            {formatPrice(item.total_amount)}
                          </Typography>
                        </Box>
                      ))}

                      <Divider sx={{ my: 1 }} />

                      {/* Fees and Total - Left Label, Right Amount */}
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Service Fee:</Typography>
                        <Typography variant="body2">{formatPrice(order.service_fee)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Delivery Fee:</Typography>
                        <Typography variant="body2">{formatPrice(order.service_fee)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" fontWeight="bold">
                        <Typography>Total Bill:</Typography>
                        <Typography>
                          <b>{formatPrice(order.total_amount)}</b>
                        </Typography>
                      </Box>
                      <div className='flex justify-between gap-4'>
                        {/* Payment Status */}
                        <Chip
                          label={order.payment_mode == 'COD' ? 'COD' : 'PAID'}
                          color={order.payment_mode != 'COD' ? 'success' : 'warning'}
                          sx={{ mt: 1 }}
                          variant="outlined"
                          size="small"
                        />
                          <Chip
                          label={formatString(order.order_status)}
                          color={'success'}
                          sx={{ mt: 1 }}
                          variant="outlined"
                          size="small"
                        />
                      </div>

                    </Card>
                  ))}
              </Grid>

              {/* Right Side - Order Details */}
              <Grid item xs={7} className="sticky top-0 custom-scroll"    sx={{ height: '100vh', overflowY: 'auto', pr: 1, pb: 1 }}>
                {selectedOrder && (
                  <Card sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <div>

                      <Typography variant="h6">{selectedOrder.user_name} </Typography>
                      {selectedOrder?.address?.map((item, index) => (
                          <Card key={index}  className='mt-5 border-l-4 border-red-500'>
                            <Paper key={index} sx={{ p: 1.5, borderRadius: 1 }}>
                              <div className='flex items-center gap-2'>
                              <FaAddressCard />

                              <Typography  fontWeight="bold">
                                {item.type || 'Home'} Address
                              </Typography>
                              </div>
                              <Typography variant="body2" sx={{mt:1}}>{item.address + ',' + item.city + ',' + item.country + '-' + item.pincode} </Typography>
                            </Paper>
                          </Card>
                        ))}
                      </div>
                      <Typography color="textSecondary">
                        {' '}
                        <span className="text-sm">
                          ORD ID -<span style={{ color: 'red' }}> {selectedOrder.order_id}</span>{' '}
                        </span>
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />

                    {selectedOrder?.items?.length > 0 &&
                      selectedOrder.items.map((item, index) => (
                        <Box key={index} mt={1}>
                          <Typography fontWeight="bold">
                            {item.qty} X {item.item_name}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {item?.addons?.map((addon, i) => {
                              return (
                                <div key={i} className="m-5">
                                  <b>{addon.addon_name}</b>

                                  {addon?.addon_item?.map((ite, j) => (
                                    <span key={j} className="m-1 ml-2">
                                      <Chip
                                        variant="outlined"
                                        size="small"
                                        label={<span>{ite}</span>}
                                        color="primary"
                                      />
                                    </span>
                                  ))}
                                </div>
                              );
                            })}
                          </Typography>

                          <Divider sx={{ my: 1 }} />
                        </Box>
                      ))}

                    {selectedOrder?.notes && (
                      <Box mt={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                        <Typography fontWeight="bold">Notes:</Typography>
                        <Typography variant="body2">{selectedOrder.notes}</Typography>
                      </Box>
                    )}
                  </Card>
                )}
              </Grid>
            </Grid>
          ) : (
            <div className="flex items-center justify-center mt-10">
              <p>No Orders Found Today!</p>
            </div>
          )}
        </>
      )}
    </Box>
  );
};

export default OrderHistoryDetails;
