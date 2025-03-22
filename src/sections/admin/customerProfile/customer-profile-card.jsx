import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  IconButton,
  Divider,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import { EmailInboxIcon } from "src/assets/icons";
import { TbPhoneIncoming } from "react-icons/tb";
import { FaInfoCircle } from "react-icons/fa";


const CustomerProfileCard = ({customerData}) => {
  return (
<Card sx={{ maxWidth: 500, p: 2, boxShadow: 3, borderRadius: 2, maxHeight: "100vh", overflowY: "auto" }}>
{/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Customer Profile</Typography>
    
      </Stack>

      {/* Customer Info */}
      <Stack direction="row" alignItems="center" spacing={2} mt={2}>
        <Avatar sx={{ width: 48, height: 48, bgcolor: "gray" }} />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
              {customerData.name}
          </Typography>
          {/* <Typography
            variant="caption"
            sx={{ backgroundColor: "green", color: "white", px: 1, py: 0.5, borderRadius: 1 }}
          >
            ● Last Order Yesterday
          </Typography> */}
          <Stack direction="row" alignItems="center" spacing={1} mt={1}>
            <Typography variant="body2">{customerData.email}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TbPhoneIncoming fontSize="small" color="action" />
            <Typography variant="body2">{customerData.mobile}</Typography>
          </Stack>
        </Box>
      </Stack>

      {/* Customer Addresses */}
      <Box mt={3}>
        <Typography variant="subtitle2" fontWeight="bold">
          Customer Address Details
        </Typography>
        <AddressList addressData={customerData?.address}/>
      </Box>

      {/* Orders & Feedback */}
      <Box mt={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" fontWeight="bold">
            Orders & Feedback
          </Typography>
          {/* <Button color="error" size="small">View All</Button> */}
        </Stack>
        <OrderList orderData={customerData?.orders}/>
      </Box>

  
    </Card>
  );
};

// Address Component
const AddressList = ({addressData}) => {
  const addresses = [
    { type: "Home (Primary Address)", address: "45 High Street, Cambridge, CB1 1JD" },
    { type: "Grandma’s Place", address: "24 High Street, Cambridge, CB1 1JD" },
    { type: "Office", address: "35 High Street, Cambridge, CB1 1JD" },
  ];

  return (
    <Stack spacing={1} mt={1}>
      {addressData.map((item, index) => (
                <Card key={index} variant="outlined">
        <Paper key={index} sx={{ p: 1.5, borderRadius: 1 }}>
          <Typography variant="caption" fontWeight="bold">
            {
              item.type || 'Home'
            } Address
          </Typography>
          <Typography variant="body2">{ item.address+','+item.city+','+item.country+'-'+item.pincode }</Typography>
        </Paper>
        </Card>
      ))}
    </Stack>
  );
};

// Orders Component
const OrderList = ({orderData}) => {
  const orders = [
    { date: "Yesterday", meal: "Pizza Meal For 2 (12\") - 2", drinks: 4, burgers: 2, total: 20 },
    { date: "13 Nov 2024", meal: "Pizza Meal For 2 (12\") - 2", drinks: 4, burgers: 2, total: 20 },
  ];

  return (
    <Stack spacing={2} mt={2}>
      {orderData?.map((order, index) => (
        <Card key={index} variant="outlined">
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight="bold"   sx={{
    width: '150px', 
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  }}>
                {order.item_name} - {order.qty}
              </Typography>
              <Typography variant="caption" color="text.secondary" >
               ORD ID - {order.order_id}
              </Typography>
            </Stack>
            {
              order.addons.map((item) => (

                <Typography variant="body2"  sx={{ mt: 1 }}>
                  <span className="flex items-center gap-3">
                    <span>{item.addon_name} - </span>
                    {
                  item.items.map((addon) => (
                         <>
                                   <span className="flex items-center gap-3">
                            <Chip
                                              label={addon}
                                              color={'primary'}
                                              sx={{ mt: 1 }}
                                              variant="outlined"
                                              size="small"
                                            />
                    </span>
                         </>
          ))
                }
                </span>
   
                <span>

                </span>
                </Typography>)
                )
            }

<Stack direction="row" justifyContent="space-between" alignItems="center">

            <Typography variant="body2" fontWeight="bold" color={'primary'} sx={{ mt: 1 }}>
              Order Total - £{order.total_amount}
            </Typography>
            <Typography variant="caption" fontWeight="bold" color={'primary'} sx={{ mt: 1 }}>
              {order.updatedAt}
            </Typography>
            </Stack>
            {/* <Button color="error" size="small" sx={{ mt: 1 }}>
              View Feedback
            </Button> */}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default CustomerProfileCard;
