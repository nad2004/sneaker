import { Card, Typography, Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Title } from "react-admin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs"; // npm install dayjs

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalEarning, setTotalEarning] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [chartData, setChartData] = useState([]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/order/get-order-list");
      const Userresponse = await axios.post("http://localhost:8080/api/user/get");
      
      const orderData = response.data.data;
      setOrders(orderData);
      setUsers(Userresponse.data.data)
      
      setCustomerCount(Userresponse.data.data.filter(user => user.role === "CUSTOMER").length);
      // Tính toán Total Earning
      const totalEarning = orderData.reduce((sum, order) => sum + (order.totalAmt || 0), 0);
      setTotalEarning(totalEarning);

      // Xử lý dữ liệu biểu đồ: Nhóm theo ngày hoặc tháng
      const groupedData = orderData.reduce((acc, order) => {
        const date = dayjs(order.createdAt).format("MMM D"); // "Mar 25"
        if (!acc[date]) acc[date] = { date, revenue: 0, orders: 0, customers: 0 };

        acc[date].revenue += order.totalAmt || 0;
        acc[date].orders += 1;
        acc[date].customers += order.customerId ? 1 : 0; // Giả sử có customerId

        return acc;
      }, {});

      // Convert object thành array & sort theo thời gian
      const sortedData = Object.values(groupedData).sort((a, b) =>
        dayjs(a.date, "MMM D").isBefore(dayjs(b.date, "MMM D")) ? -1 : 1
      );

      setChartData(sortedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <>
      <Title title="Dashboard" />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Store Overview
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Revenue
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ${totalEarning.toLocaleString()}
              </Typography>
              
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Orders
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {orders.length}
              </Typography>
             
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Customers
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {customerCount}
              </Typography>
             
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Revenue & Orders Comparison
        </Typography>

        {/* Biểu đồ cột */}
        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#00bcd4" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
