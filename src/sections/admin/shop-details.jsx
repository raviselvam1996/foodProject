import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from "dayjs";

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
    
      const handleTimeChange = (index, type, newTime) => {
        const updatedTimes = [...timeValues];
        updatedTimes[index][type] = newTime;
        setTimeValues(updatedTimes);
      };
  return (
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
  )
}
