import React, { useEffect, useMemo, useState } from 'react';
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
  Badge,
  TextField,
  Stack,
} from '@mui/material';
import { formatPrice } from 'src/utils/amountChange';
import {
  useGetOrderHistoryMutation,
  useOrderChangeMutation,
  useOrderListMutation,
} from 'src/services/order';
import { toast } from 'sonner';
import { handleApiError } from 'src/utils/errorHandler';
import { formatString } from 'src/utils/change-case';
import { FaAddressCard } from 'react-icons/fa';
import moment from 'moment';
import { TbTruckDelivery } from 'react-icons/tb';
import { FaPersonWalkingLuggage } from 'react-icons/fa6';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';

const OrderTimer = ({ orderTime }) => {
  const [timeAgo, setTimeAgo] = useState(moment(orderTime).fromNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(moment(orderTime).fromNow());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [orderTime]);

  return <p style={{ color: 'red' }}>{timeAgo}</p>;
};

const OrderHistoryDetails = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const orderDetail = useBoolean();

  const [getOrderHistory, { isLoading: orderLoad }] = useGetOrderHistoryMutation();
  const OPTIONS = [
    { value: 'pickup', label: 'Pickup' },
    { value: 'delivery', label: 'Delivery' },

  ];
  // Filter orders based on searchQuery

  const filteredOrders = useMemo(() => {
    return orderData?.filter((order) => {
      const matchesStatus = statusFilter ? order.order_mode === statusFilter : true;
      const matchesSearch =
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.name.toLowerCase().includes(searchQuery.toLowerCase()); // Changed from user_name to name
      return matchesStatus && matchesSearch;
    });
  }, [orderData, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = {};
    OPTIONS.forEach((opt) => {
      counts[opt.value] = orderData.filter((order) => order.order_mode === opt.value).length;
    });
    return counts;
  }, [orderData]);

  const orderListGet = async () => {
    try {
      const response = await getOrderHistory().unwrap();
      if (response.status) {
        setOrderData(response.data);
        setSelectedOrder(response?.data[0] || null);
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
      <Typography variant="h5" style={{ color: 'red' }}>
        Orders History
      </Typography>
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
        <Grid container spacing={2} sx={{ mt: 2 }}>

        <Grid item xs={12} sx={{ mt: 2 }}>
  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
    <TextField
      label="Search Order ID or Name"
      variant="outlined"
      size="small"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{ minWidth: '250px' }}
    />
    <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
      <Button
        variant={!statusFilter ? 'contained' : 'outlined'}
        onClick={() => setStatusFilter('')}
      >
        All
      </Button>
      {OPTIONS.map((opt) => (
        <Badge key={opt.value} badgeContent={statusCounts[opt.value] || 0} color="primary">
          <Button
            variant={statusFilter === opt.value ? 'contained' : 'outlined'}
            onClick={() => {
              setStatusFilter(opt.value);
              setSelectedOrder(null);
            }}
          >
            {opt.label}
          </Button>
        </Badge>
      ))}
    </Stack>
  </Stack>
</Grid>

        </Grid>
    
     
          {filteredOrders?.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {/* Left Side - Orders List */}

              <Grid
                item
                sm={6}
                md={5}
                xs={12}
                sx={{ height: '100vh', overflowY: 'auto', pr: 1, pb: 1 }}
                className="custom-scroll"
              >
                {filteredOrders?.length > 0 &&
                  filteredOrders.map((order) => (
                    <Card
                      key={order.order_id}
                      sx={{
                        mt: 2,
                        p: 2,
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedOrder(order)}
                      className={`border-l-4 p-4 ${order.order_id === selectedOrder?.order_id ? 'border-red-500' : 'border-grey-500'}`}
                    >
                      {/* Customer and Order ID */}
                      <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                        <div>
                          <Typography variant="subtitle1" fontSize={15} style={{ color: 'red' }}>
                            {order.name}
                          </Typography>
                          <Chip
                            label={
                              order.order_mode === 'delivery' ? (
                                <span className="flex">
                                  <TbTruckDelivery fontSize={19} style={{ marginRight: 4 }} />
                                  <span>DELIVERY</span>
                                </span>
                              ) : (
                                <>
                                <div>
                                <span className="flex">
                                  <FaPersonWalkingLuggage
                                    fontSize={19}
                                    style={{ marginRight: 4 }}
                                  />
                                  <span>PICK UP</span> 
                                </span>
                                <p style={{ color: 'red',paddingLeft:10 }}> - {order.pickup_time || '00.00'}</p> 

                                </div>
               
                                </>
                      
                              )
                            }
                            color={order.order_mode != 'delivery' ? 'success' : 'info'}
                            sx={{
                              mt: 1,
                              py: order.order_mode !== 'delivery' ? 3 : 0  // MUI uses spacing units, not Tailwind
                            }}
                                                        variant="outlined"
                            size="small"
                          />
                        </div>
                        <Typography variant="subtitle1" fontSize={14}>
                          <span className="text-sm">
                            ORD ID -<span style={{ color: 'red' }}> {order.order_id}</span>{' '}
                          </span>
                          <OrderTimer orderTime={order.createdAt} />
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
                            {item.qty} X {item.name}
                          </Typography>
                          <Typography fontWeight="bold" fontSize={14}>
                            {formatPrice(item.amount)}
                          </Typography>
                        </Box>
                      ))}

                      <Divider sx={{ my: 1 }} />

                      {/* Fees and Total - Left Label, Right Amount */}
                      {/* <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Service Fee:</Typography>
                        <Typography variant="body2">{formatPrice(order.service_fee)}</Typography>
                      </Box> */}
                                <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2">Discount:</Typography>
                                        <Typography variant="body2">{formatPrice(order.discount_amount)}</Typography>
                                      </Box>  
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Delivery Fee:</Typography>
                        <Typography variant="body2">{formatPrice(order.delivery_fee)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" fontWeight="bold">
                        <Typography>Total Bill:</Typography>
                        <Typography>
                          <b>{formatPrice(order.total_amount)}</b>
                        </Typography>
                      </Box>
                      <div className="flex justify-between gap-4">
                        {/* Payment Status */}
                        {
                          order.payment_mode == 'Stripe' ?
                          (
                            order.payment_status == 'Pending' ? (
                              <Chip label="Pending" color="warning" variant="outlined" size="small" sx={{ mt: 1 }} />
                            ) : (
                              <Chip label="Paid" color="success" variant="outlined" size="small" sx={{ mt: 1 }}/>
                            )
                          )
                          :

                          <Chip
                          label={'COD'}
                          color='success'
                          sx={{ mt: 1 }}
                          variant="outlined"
                          size="small"
                        />

                        }
              
                        <Chip
                          label={formatString(order.order_status)}
                          color={'success'}
                          sx={{ mt: 1 }}
                          variant="outlined"
                          size="small"
                        />
                      </div>
                      <div className='w-full mt-2 block md:hidden'>
  <Button
    variant='contained'
    onClick={() => {
      setSelectedOrder(order)
      orderDetail.onTrue();

    } }
    size='small'
    className='text-sm w-full'
  >
    View Detail
  </Button>
</div>



                    </Card>
                  ))}
              </Grid>

              {/* Right Side - Order Details */}
              <Grid
                item
                xs={7}
                sm={6}
                md={7}
                className="hidden md:block sticky top-0 custom-scroll"
                sx={{ height: '100vh', overflowY: 'auto', pr: 1, pb: 1 }}
              >
                {selectedOrder ? (
                  <Card sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <div>
                        <Typography variant="h6">{selectedOrder?.name} </Typography>
                        {(selectedOrder?.address && selectedOrder?.order_mode != 'pickup') && (
                          <Card className="mt-5 border-l-4 border-red-500">
                            <Paper sx={{ p: 1.5, borderRadius: 1 }}>
                              <div className="flex items-center gap-2">
                                <FaAddressCard />
                                <Typography fontWeight="bold">
                                  {selectedOrder?.address.type || 'Home'} Address
                                </Typography>
                              </div>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {selectedOrder?.address?.address +
                                  ',' +
                                  selectedOrder?.address?.city +
                                  ',' +
                                  selectedOrder?.address?.country +
                                  '-' +
                                  selectedOrder?.address?.pincode}{' '}
                              </Typography>
                            </Paper>
                          </Card>
                        )}
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
                            {item.qty} X {item.name}
                          </Typography>
                          <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                            {item?.addon?.map((addons, i) => {
                              return (
                                <div key={i} className="m-5">
                                  <b>{addons.addon_name}</b>

                                  {addons?.addon_item?.map((ite, j) => (
                                    <span key={j} className="m-1 ml-2">
                                      <Chip
                                        variant="outlined"
                                        size="small"
                                        label={<span>{ite.addon_item_name}</span>}
                                        color="primary"
                                      />
                                    </span>
                                  ))}
                                </div>
                              );
                            })}
                          </Typography>
                          {item?.notes && (
                      <Box mt={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                        <Typography fontWeight="bold">Notes:</Typography>
                        <Typography variant="body2">{item.notes}</Typography>
                      </Box>
                    )}
                          <Divider sx={{ my: 1 }} />
                        </Box>
                      ))}


                  </Card>
                )  : (
                  <div className="flex items-center justify-center mt-10">
                    <p>Select an Order to view details!</p>
                  </div>
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
   
      

            <ConfirmDialog
              open={orderDetail.value}
              onClose={orderDetail.onFalse}
              title="Order Detail"
              content={
                <>
                {
                  selectedOrder && 
                  (
                    <div >
                      <Box display="flex" justifyContent="space-between">
                        <div>
                          <Typography>
                            <span className='text-sm'>
                            {selectedOrder?.name}
                            </span>
                            </Typography> 
                 
                        </div>
                        <Typography color="textSecondary">
                          <span className="text-xs">
                            ORD ID -<span style={{ color: 'red' }}> {selectedOrder.order_id}</span>{' '}
                          </span>
                        </Typography>
                      </Box>
                      <div>
                      {(selectedOrder?.address && selectedOrder?.order_mode != 'pickup') && (
                            <Card className="mt-5 border-l-4 border-red-500">
                              <Paper sx={{ p: 1.5, borderRadius: 1 }}>
                                <div className="flex items-center gap-2">
                                  <FaAddressCard />
                                  <Typography fontWeight="bold">
                                    <span className='text-sm'>
                                    {selectedOrder?.address.type || 'Home'} Address
                                    </span>
                                  </Typography>
                                </div>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  {selectedOrder?.address?.address +
                                    ',' +
                                    selectedOrder?.address?.city +
                                    ',' +
                                    selectedOrder?.address?.country +
                                    '-' +
                                    selectedOrder?.address?.pincode}{' '}
                                </Typography>
                              </Paper>
                            </Card>
                          )}
                      </div>
                      <Divider sx={{ my: 1 }} />
  
                      {selectedOrder?.items?.length > 0 &&
                        selectedOrder.items.map((item, index) => (
                          <Box key={index} mt={1}>
                            <Typography fontWeight="bold">
                              <span className='text-sm'>
                              {item.qty} X {item.name}
                              </span>
                            </Typography>
                            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                              {item?.addon?.map((addons, i) => {
                                return (
                                  <div key={i} className="m-5">
                                    <span className='text-xs'>
                                    <b>{addons.addon_name}</b>
                                    </span>
  
                                    {addons?.addon_item?.map((ite, j) => (
                                      <span key={j} className="m-1 ml-2">
                                        <Chip
                                          variant="outlined"
                                          size="small"
                                          label={<span>{ite.addon_item_name}</span>}
                                          color="primary"
                                        />
                                      </span>
                                    ))}
                                  </div>
                                );
                              })}
                            </Typography>
  
                            {item?.notes && (
                        <Box mt={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                          <Typography fontWeight="bold">Notes:</Typography>
                          <Typography variant="body2">{item.notes}</Typography>
                        </Box>
                      )}
  
                            <Divider sx={{ my: 1 }} />
                          </Box>
                        ))}
  
  
                    </div>
                  ) 
                }
             
                </>
              }

            />
    </Box>
  );
};

export default OrderHistoryDetails;
