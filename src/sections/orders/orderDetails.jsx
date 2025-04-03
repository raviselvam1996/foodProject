import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Stack,
  Paper,
  TextField,
} from '@mui/material';
import { formatPrice } from 'src/utils/amountChange';
import { useOrderChangeMutation, useOrderListMutation } from 'src/services/order';
import { toast } from 'sonner';
import { handleApiError } from 'src/utils/errorHandler';
import { RHFSelect } from 'src/components/hook-form';
import { FaAddressCard } from 'react-icons/fa';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import moment from "moment";

const OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'on the way', label: 'On The Way' },
  { value: 'delivered', label: 'Delivered' },
];
const OrderTimer = ({ orderTime }) => {
  const [timeAgo, setTimeAgo] = useState(moment(orderTime).fromNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(moment(orderTime).fromNow());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [orderTime]);

  return <p>{timeAgo}</p>;
};
const OrderSelectBox = ({
  initialVal,
  orderStatusChange,
  orderId,
  orderChange,
  setOrderStatus,
  setOrderId,
}) => {
  const [initVal, setInitVal] = useState(initialVal);

  const orderChanges = (id, value) => {
    if (value == 'delivered') {
      orderChange();
      setOrderStatus(orderId);
      setOrderId(id);
    } else {
      // setInitVal(value);
      orderStatusChange(id, value);
    }
  };
  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={initVal}
          label=""
          onChange={(event) => {
            orderChanges(orderId, event.target.value);
          }}
        >
          <Divider sx={{ borderStyle: 'dashed' }} />
          {OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.value === 'Pending'} // Disable Pending option
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

const OrderDetails = () => {
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [checkOrderId, setCheckOrderId] = useState('');
  const delivery = useBoolean();
  const [searchQuery, setSearchQuery] = useState('');

  const [orderList, { isFetching: orderLoad ,isLoading:orderLoding }] = useOrderListMutation();
  const [orderChange, { isLoading: statusLoad }] = useOrderChangeMutation();

  const filteredOrders = useMemo(() => {
    return orderData?.filter(
      (order) =>
        order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orderData, searchQuery]);

  const orderListGet = async () => {
    try {
      const response = await orderList().unwrap();
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
  const orderListRef = useRef(orderListGet); // Store function reference

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await orderListRef.current(); // Call the mutation function
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders(); // Call immediately on mount

    const interval = setInterval(fetchOrders, 30000); // Call every 5 minutes

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  //  Change the order status
  const orderStatusChange = async (id, status) => {
    try {
      // Create FormData instance
      const formData = {
        id,
        status,
      };

      const response = await orderChange(formData).unwrap();

      if (response.status) {
        toast.success(response.message);
        delivery.onFalse();
        // if (status == 'delivered') {
        //   orderListGet();
        // }
        const updateData = orderData.map((order) => 
          order.order_id === id ? { ...order, order_status: status } : order
        );
        setOrderData(updateData);
        setOrderId(null);
        setOrderStatus(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };
  const deliveryChange = () => {
    if (orderStatus == checkOrderId) {
      orderStatusChange(orderId, 'delivered');
    } else {
      toast.error('Order Id not match');
    }
  };
  useEffect(() => {
    console.log("Filtered Orders Updated:", filteredOrders);
  }, [filteredOrders]);
  return (
    <Box>
      <Typography variant="h5" style={{ color: 'red' }}>
        Orders Details
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
      {orderLoad  ? (
        <div className="flex justify-center items-center mt-10">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Search Order ID or Name"
              variant="outlined"
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          {filteredOrders?.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {/* Left Side - Orders List */}

              <Grid
                item
                xs={5}
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
                      className={`border-l-4 p-4 ${order.order_id === selectedOrder.order_id ? 'border-red-500' : 'border-grey-500'}`}
                    >
                      {/* Customer and Order ID */}
                      <Box display="flex" justifyContent="space-between">
                        <div>
                        <Typography variant="subtitle1" fontSize={15} style={{ color: 'red' }}>
                          {order.name}
                        </Typography>
                        <Chip
                          label={order.order_mode == 'delivery' ? 'DELIVERY' : 'PICK UP'}
                          color={order.order_mode != 'delivery' ? 'success' : 'info'}
                          sx={{ mt: 1 }}
                          variant="outlined"
                          size="small"
                        />
                        </div>
                
                        <Typography variant="subtitle1" fontSize={14}>
                          <span
                            className="text-sm cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(order.order_id);
                              toast.success('Order ID copied');
                            }}
                          >
                           ORD - ID- <span style={{ color: 'red' }}> {order.order_id}</span>
                          </span>
                          <OrderTimer orderTime={order.createdAt}/>

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
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Service Fee:</Typography>
                        <Typography variant="body2">{formatPrice(order.service_fee)}</Typography>
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
                        <Chip
                          label={order.payment_mode == 'COD' ? 'COD' : 'PAID'}
                          color={order.payment_mode != 'COD' ? 'success' : 'warning'}
                          sx={{ mt: 1 }}
                          variant="outlined"
                          size="small"
                        />
                        {/* <OrderSelectBox
                          initialVal={order.order_status}
                          orderStatusChange={orderStatusChange}
                          orderId={order?.order_id}
                          orderChange={() => delivery.onTrue()}
                          setOrderStatus={setOrderStatus}
                          setOrderId={setOrderId}
                        /> */}
                         <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={order.order_status}
          label=""
          onChange={(event) => {
            setOrderId(order?.order_id);
            setOrderStatus(order?.order_id);
            if (event.target.value == 'delivered') {
              delivery.onTrue();
            } else {
            orderStatusChange(order?.order_id, event.target.value);
            }
          }}
          disabled={order.order_status === 'delivered'}
        >
          <Divider sx={{ borderStyle: 'dashed' }} />
          {OPTIONS.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.value === 'Pending'} // Disable Pending option
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
                      </div>
                    </Card>
                  ))}
              </Grid>

              {/* Right Side - Order Details */}
              <Grid
                item
                xs={7}
                className="sticky top-0 custom-scroll"
                sx={{ height: '100vh', overflowY: 'auto', pr: 1, pb: 1 }}
              >
                {selectedOrder && (
                  <Card sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                      <div>
                        <Typography variant="h6">{selectedOrder.name} </Typography>

                         {selectedOrder?.address &&
                                              <Card  className='mt-5 border-l-4 border-red-500'>
                                                <Paper sx={{ p: 1.5, borderRadius: 1 }}>
                                                  <div className='flex items-center gap-2'>
                                                  <FaAddressCard />
                                                  <Typography  fontWeight="bold">
                                                    {selectedOrder?.address.type || 'Home'} Address
                                                  </Typography>
                                                  </div>
                                                  <Typography variant="body2" sx={{mt:1}}>{selectedOrder?.address?.address + ',' + selectedOrder?.address?.city + ',' + selectedOrder?.address?.country + '-' + selectedOrder?.address?.pincode} </Typography>
                                                </Paper>
                                              </Card>
                                           }
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
                          <Typography variant="body2" sx={{ mt: 1 }}>
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
            <>
                      {
            !orderLoding  ?
            <div className="flex items-center justify-center mt-10">
              <p>No Orders Found Today!</p>
            </div>
            :    <div className="flex justify-center items-center mt-10">
            <CircularProgress color="primary" />
          </div>
            }
            </>
  

          )}
        </>
      )}
      <ConfirmDialog
        open={delivery.value}
        onClose={() => {
          delivery.onFalse();
          setOrderStatus(null);
          // orderListGet();
        }}
        title="Delivery"
        content={
          <>
            <p>Please Enter Order Id to delivered !</p>
            <TextField
              id="outlined-multiline-flexible"
              label="Order Id"
              size="small"
              sx={{ mt: 3 }}
              value={checkOrderId}
              onChange={(e) => setCheckOrderId(e.target.value)} // Capture input value
            />
          </>
        }
        action={
          <Button onClick={deliveryChange} variant="contained" color="error">
            Confirm
          </Button>
        }
      />
    </Box>
  );
};

export default OrderDetails;
