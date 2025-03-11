import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import { formatPrice } from "src/utils/amountChange";

const orders = [
  {
    id: "#123458",
    customer: "Alice Smith",
    time: "17:40",
    remainingTime: "30MIN",
    items: [
      { name: "Pizza Meal For 2 (12'')", quantity: 2, price: "6.50" },
      { name: "Burger", quantity: 2, price: "6.50" },
      { name: "Kebabs", quantity: 3, price: "7" },
    ],
    serviceFee: "0.50",
    deliveryFee: "0.50",
    totalBill: "25",
    paymentStatus: "PAID",
    status: "Accepted",
    toppings: ["Ham", "Pineapple"],
    dips: ["Curry"],
    drinks: ["1 Coca Cola", "1 Diet Coke"],
    notes: "I have a severe allergy to peanuts. Please ensure my food is prepared without any contact with peanuts or peanut products.",
  },
  {
    id: "#123457",
    customer: "Jakob Tho",
    time: "19:20",
    remainingTime: "01:40MIN",
    items: [
      { name: "Pizza Meal For 2 (12'')", quantity: 2, price: "6.50" },
      { name: "Burger", quantity: 2, price: "6.50" },
      { name: "Kebabs", quantity: 3, price: "7" },
    ],
    serviceFee: "0.50",
    deliveryFee: "0.50",
    totalBill: "25",
    paymentStatus: "COD",
    status: "Pending",
    toppings: ["Ham", "Pineapple"],
    dips: ["Curry"],
    drinks: ["1 Coca Cola", "1 Diet Coke"],
    notes: "",
  },
];

const OrderDetails = () => {
  const [selectedOrder, setSelectedOrder] = useState(orders[0]);

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

      <Grid container spacing={2}>
        {/* Left Side - Orders List */}
        <Grid item xs={5} sx={{ height: "80vh", overflowY: "auto", pr: 1 }} className="custom-scroll">

  {orders.map((order) => (
    <Card
      key={order.id}
      sx={{
        mt: 2,
        p: 2,
        cursor: "pointer",
      }}
      onClick={() => setSelectedOrder(order)}
      className={`border-l-4 p-4 ${order.id === selectedOrder.id ? "border-red-500" : "border-grey-500"}`}
      >
      {/* Customer and Order ID */}
      <Box display="flex" justifyContent="space-between">
        <Typography variant="subtitle1">
          {order.customer}
        </Typography>
        <Typography variant="subtitle1" color="red">
          ORD ID - {order.id}
        </Typography>
      </Box>

      {/* Time and Remaining Time */}
      <Typography color="error">
        Today {order.time} ({order.remainingTime})
      </Typography>

      {/* Items List - Left Item Name, Right Price */}
      {order.items.map((item, index) => (
        <Box key={index} display="flex" justifyContent="space-between">
          <Typography>
            {item.quantity} X {item.name}
          </Typography>
          <Typography fontWeight="bold">{formatPrice(item.price)}</Typography>
        </Box>
      ))}

      <Divider sx={{ my: 1 }} />

      {/* Fees and Total - Left Label, Right Amount */}
      <Box display="flex" justifyContent="space-between">
        <Typography  variant="body2">Service Fee:</Typography>
        <Typography variant="body2">{formatPrice(order.serviceFee)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">Delivery Fee:</Typography>
        <Typography variant="body2">{formatPrice(order.deliveryFee)}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" fontWeight="bold">
        <Typography>Total Bill:</Typography>
        <Typography><b>{formatPrice(order.totalBill)}</b></Typography>
      </Box>

      {/* Payment Status */}
      <Chip
        label={order.paymentStatus}
        color={order.paymentStatus === "PAID" ? "success" : "warning"}
        sx={{ mt: 1 }}
      />


    </Card>
  ))}
</Grid>


        {/* Right Side - Order Details */}
        <Grid item xs={7}     className="sticky top-0"  >
          <Card sx={{ p: 2 }} >
     
            <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              {selectedOrder.customer} <span style={{ color: "red" }}>ORD ID - {selectedOrder.id}</span>
            </Typography>
        <Typography color="textSecondary">Today</Typography>

      </Box>
            <Divider sx={{ my: 1 }} />

            {selectedOrder.items.map((item, index) => (
              <Box key={index} mt={1}>
                <Typography fontWeight="bold">
                  {item.quantity} X {item.name}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <b>Toppings:</b> 
                  {
                  selectedOrder?.toppings?.map((item,j)=> (
                    <span key={j} className="m-1">
                    <Chip
                    variant="outlined"
                    size="small"
                    label={
                      <span>{item}</span>
                    }
             
                    color="primary"
                  />
                </span>
                  ))}
              
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <b>Dip:</b>
                  {
                  selectedOrder?.dips?.map((item,j)=> (
                    <span key={j} className="m-1">
                    <Chip
                    variant="outlined"
                    size="small"
                    label={
                      <span>{item}</span>
                    }
             
                    color="primary"
                  />
                </span>
                  ))}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <b>Drinks:</b>
                  
                  {
                  selectedOrder?.drinks?.map((item,j)=> (
                    <span key={j} className="m-1">
                    <Chip
                    variant="outlined"
                    size="small"
                    label={
                      <span>{item}</span>
                    }
             
                    color="primary"
                  />
                </span>
                  ))}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}

            {selectedOrder.notes && (
              <Box mt={2} p={2} sx={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
                <Typography fontWeight="bold">Notes:</Typography>
                <Typography variant="body2">{selectedOrder.notes}</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;


