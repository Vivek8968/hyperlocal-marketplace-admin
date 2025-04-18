import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Divider,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { 
  PeopleOutline, 
  StorefrontOutlined, 
  Inventory2Outlined, 
  TrendingUp 
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title
);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get system statistics
        const statsResponse = await api.get('/admin/stats');
        setStats(statsResponse.data);
        
        // Get recent activity
        const activityResponse = await api.get('/admin/recent-activity');
        setRecentActivity(activityResponse.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Prepare chart data
  const userTypeData = {
    labels: ['Customers', 'Shopkeepers', 'Admins'],
    datasets: [
      {
        data: [
          stats?.userStats?.totalCustomers || 0,
          stats?.userStats?.totalShopkeepers || 0,
          stats?.userStats?.totalAdmins || 0
        ],
        backgroundColor: [
          'rgba(53, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Shop approval status data
  const shopStatusData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          stats?.shopStats?.approvedShops || 0,
          stats?.shopStats?.pendingShops || 0,
          stats?.shopStats?.rejectedShops || 0
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Weekly growth data
  const growthData = {
    labels: stats?.weeklyStats?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'New Users',
        data: stats?.weeklyStats?.newUsers || [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(53, 162, 235, 0.8)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'New Shops',
        data: stats?.weeklyStats?.newShops || [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'New Products',
        data: stats?.weeklyStats?.newProducts || [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgba(75, 192, 192, 0.8)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">
                    {stats?.userStats?.totalUsers || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <PeopleOutline />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Shops
                  </Typography>
                  <Typography variant="h4">
                    {stats?.shopStats?.totalShops || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <StorefrontOutlined />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h4">
                    {stats?.productStats?.totalProducts || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <Inventory2Outlined />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    New This Week
                  </Typography>
                  <Typography variant="h4">
                    {stats?.weeklyStats?.total || 0}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts and Activity Section */}
      <Grid container spacing={3}>
        {/* User Types Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              User Distribution
            </Typography>
            <Box sx={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie data={userTypeData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        
        {/* Shop Status Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Shop Approval Status
            </Typography>
            <Box sx={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie data={shopStatusData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List sx={{ width: '100%', maxHeight: 250, overflow: 'auto' }}>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{activity.type[0].toUpperCase()}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.description}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {activity.user}
                            </Typography>
                            {` — ${new Date(activity.timestamp).toLocaleString()}`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <Typography align="center" color="textSecondary">
                  No recent activity
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* Weekly Growth */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Growth
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={growthData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
