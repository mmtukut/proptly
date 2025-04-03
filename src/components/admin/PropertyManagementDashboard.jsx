import React, { useState, useEffect } from 'react';
import { Card, Grid, Typography, Box, CircularProgress, Tabs, Tab, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import propertyManagementService from '../../services/propertyManagement';


const PropertyManagementDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [analytics, setAnalytics] = useState({
    summary: {
      totalProperties: 0,
      activeListings: 0,
      pendingVerification: 0,
      totalValue: 0,
      totalViews: 0,
      totalInquiries: 0
    },
    byType: [],
    byStatus: [],
    byLocation: [],
    trends: {
      views: [],
      listings: [],
      inquiries: []
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const analytics = await propertyManagementService.getPropertyAnalytics();
      if (analytics) {
        setAnalytics({
          summary: {
            totalProperties: analytics.totalProperties || 0,
            activeListings: analytics.activeListings || 0,
            pendingVerification: analytics.pendingVerification || 0,
            totalValue: analytics.totalValue || 0,
            totalViews: analytics.totalViews || 0,
            totalInquiries: analytics.totalInquiries || 0
          },
          byType: analytics.byType || [],
          byStatus: analytics.byStatus || [],
          byLocation: analytics.byLocation || [],
          trends: {
            views: analytics.trends?.views || [],
            listings: analytics.trends?.listings || [],
            inquiries: analytics.trends?.inquiries || []
          }
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const renderSummaryCards = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">Total Properties</Typography>
          <Typography variant="h4">{analytics.summary.totalProperties}</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">Active Listings</Typography>
          <Typography variant="h4">{analytics.summary.activeListings}</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">Pending Verification</Typography>
          <Typography variant="h4">{analytics.summary.pendingVerification}</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">Total Property Value</Typography>
          <Typography variant="h4">₦{(analytics.summary.totalValue / 1000000).toFixed(2)}M</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">Total Views</Typography>
          <Typography variant="h4">{analytics.summary.totalViews}</Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">Total Inquiries</Typography>
          <Typography variant="h4">{analytics.summary.totalInquiries}</Typography>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDistributionCharts = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Properties by Type</Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.byType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analytics.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Properties by Status</Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.byStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            {renderSummaryCards()}
            <Box sx={{ mt: 3 }}>
              {renderDistributionCharts()}
            </Box>
          </>
        );
      case 1:
        return (
          <Typography variant="h6">
            Detailed analytics coming soon...
          </Typography>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Property Management Dashboard</Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Overview" />
          <Tab label="Detailed Analytics" />
        </Tabs>
      </Paper>

      {renderContent()}
    </Box>
  );
};

export default PropertyManagementDashboard;
