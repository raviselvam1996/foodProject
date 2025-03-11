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
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";

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

const ViewOrderDetails = () => {
  const [selectedOrder, setSelectedOrder] = useState(orders[0]);

  return (
    <Box>


      <Grid container spacing={2}>
        {/* Left Side - Orders List */}
        <Grid item xs={12} sm={6} sx={{ height: "100vh", overflowY: "auto", pr: 1,pb:1 }} className="custom-scroll">
        <Card>
  <CardContent>
  <Typography fontWeight="bold" fontSize={16}>
    <span className="flex items-center gap-2">
    <TbTruckDelivery fontSize={19}/>
    Delivery Orders
    </span>

        </Typography>
  {orders.map((order) => (
    <Card
      key={order.id}
      sx={{
        mt: 2,
        p: 2,
        cursor: "pointer",
      }}
      className={`border-l-4 p-4 border-red-500`}
      >
      {/* Customer and Order ID */}
      <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle1" color="red" fontSize={14}>
          ORD ID - {order.id}
        </Typography>
              {/* Time and Remaining Time */}
      <Typography color="error" fontSize={14}>
      Delivery by -  Today {order.time} ({order.remainingTime})
      </Typography>
      </Box>



      {/* Items List - Left Item Name, Right Price */}
      {order.items.map((item, index) => (
        <Box key={index} display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography fontSize={14}>
           {item.quantity} X {item.name}
          </Typography>
          <Typography fontWeight="bold" fontSize={14}>{formatPrice(item.price)}</Typography>
        </Box>
      ))}

      <Divider sx={{ my: 1 }} />

      {/* Fees and Total - Left Label, Right Amount */}

      <Box display="flex" justifyContent="space-between" fontWeight="bold">
      <Box className="flex justify-between items-center gap-4">
        <Typography>Total Bill ( charges ):</Typography>
        <Chip
        label={order.paymentStatus}
        color={order.paymentStatus === "PAID" ? "success" : "warning"}
        sx={{ mt: 1 }}
        variant="outlined"
        size="small"

      />
        </Box>
        <Typography><b>{formatPrice(order.totalBill)}</b></Typography>
      </Box>

      {/* Payment Status */}

   <Button variant="contained" color="error" sx={{ mt: 1, width: "100%" }}>
        Mark as Ready
      </Button>

    </Card>
  ))}
  </CardContent>
  </Card>
</Grid>


        {/* Right Side - Order Details */}
        <Grid item xs={12} sm={6} sx={{ height: "100vh", overflowY: "auto", pr: 1,pb:1 }} className="custom-scroll">
<Card>
  <CardContent>
  <Typography fontWeight="bold" fontSize={16}>
  <span className="flex items-center gap-2">
    <FaPersonWalkingLuggage fontSize={19}/>
    Pick Up Orders    </span>  
        </Typography>
    
  {orders.map((order) => (
    <Card
      key={order.id}
      sx={{
        mt: 2,
        p: 2,
        cursor: "pointer",
      }}
      className={`border-l-4 p-4 border-red-500`}
      >
      {/* Customer and Order ID */}
      <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle1" color="red" fontSize={14}>
          ORD ID - {order.id}
        </Typography>
              {/* Time and Remaining Time */}
      <Typography color="error" fontSize={14}>
      Delivery by -  Today {order.time} ({order.remainingTime})
      </Typography>
      </Box>



      {/* Items List - Left Item Name, Right Price */}
      {order.items.map((item, index) => (
        <Box key={index} display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography fontSize={14}>
           {item.quantity} X {item.name}
          </Typography>
          <Typography fontWeight="bold" fontSize={14}>{formatPrice(item.price)}</Typography>
        </Box>
      ))}

      <Divider sx={{ my: 1 }} />

      {/* Fees and Total - Left Label, Right Amount */}

      <Box display="flex" justifyContent="space-between" fontWeight="bold">
      <Box className="flex justify-between items-center gap-4">
        <Typography>Total Bill ( charges ):</Typography>
        <Chip
        label={order.paymentStatus}
        color={order.paymentStatus === "PAID" ? "success" : "warning"}
        sx={{ mt: 1 }}
        variant="outlined"
        size="small"

      />
        </Box>
        <Typography><b>{formatPrice(order.totalBill)}</b></Typography>
      </Box>

      {/* Payment Status */}

   <Button variant="contained" color="error" sx={{ mt: 1, width: "100%" }}>
        Mark as Ready for collection
      </Button>

    </Card>
  ))}
    </CardContent>
</Card>

  
</Grid>
      </Grid>
    </Box>
  );
};

export default ViewOrderDetails;


