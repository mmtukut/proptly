import React from "react";
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { filterProperties } from './data/properties.data';
import Header from './components/layout/Header'
import AIChatWidget from './components/widget/AIChatWidget';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routes/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { AIChatProvider } from './contexts/AIChatContext';

import { SavedPropertiesProvider } from './contexts/SavedPropertiesContext';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from './pages/HomePage';
import PropertyDetailView from "./pages/PropertyDetailView";
import Properties from './pages/Properties';
import About from './pages/About';
import SignIn from './components/auth/SignIn';
import SignUp from "./components/auth/SignUp";
import MapView from './components/map/MapView';
import AgentsPage from './pages/Agents/AgentsPage';
import TopAgents from './pages/Agents/TopAgents';
import VerifiedAgents from './pages/Agents/VerifiedAgents';
import AgencyDirectory from './pages/Agents/AgencyDirectory';
import MapLayout from './layouts/MapLayout';
import ForgotPassword from './components/auth/ForgotPassword';
import EmailVerification from './components/auth/EmailVerification';
import CompleteProfile from './components/auth/CompleteProfile';
import AddProperty from './components/property/AddProperty';
import MobileNav from './components/layout/MobileNav';
import SavedProperties from './components/property/SavedProperties';
import VerifyEmail from './components/auth/VerifyEmail';
import Profile from './components/profile/Profile';

// Admin Components
import VerificationDashboard from './components/admin/VerificationDashboard';
import SystemSettings from './components/admin/SystemSettings';
import AuditLogs from './components/admin/AuditLogs';
import UserManagementDashboard from './components/admin/UserManagementDashboard';

// Verification Components
import AgentVerificationForm from './components/verification/AgentVerificationForm';
import PropertyVerificationForm from './components/verification/PropertyVerificationForm';

// Notification Components
import NotificationBell from './components/notifications/NotificationBell';
import AllNotifications from './components/notifications/AllNotifications';

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const isMapView = location.pathname === '/map';
    const isPropertyDetailView = location.pathname === '/property/:id';

    const handleSaveChange = () => {
        console.log("Property saved or removed");
    };

    return (
        <div className="app">
            {!isMapView && !isPropertyDetailView && (
                <Header />
            )}
            {!isPropertyDetailView && (
                <AIChatWidget />
            )}
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage handleSaveChange={handleSaveChange} />} />
                <Route path="/properties" element={<Properties handleSaveChange={handleSaveChange} />} />
                <Route path="/property/:id" element={<PropertyDetailView />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* Protected Routes */}
                <Route
                    path="/complete-profile"
                    element={
                        <PrivateRoute>
                            <CompleteProfile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/map"
                    element={
                        <MapLayout>
                            <MapView
                                properties={filterProperties({})}
                                onClose={() => navigate(-1)}
                            />
                        </MapLayout>
                    }
                />

                {/* Agent Routes */}
                <Route path="/agents" element={<AgentsPage />}>
                    <Route index element={<TopAgents />} />
                    <Route path="top" element={<TopAgents />} />
                    <Route path="verified" element={<VerifiedAgents />} />
                    <Route path="agencies" element={<AgencyDirectory />} />
                </Route>

                {/* Property Management Routes */}
                <Route
                    path="/add-property"
                    element={
                        <PrivateRoute>
                            <AddProperty />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/saved-properties"
                    element={
                        <PrivateRoute>
                            <SavedProperties />
                        </PrivateRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute adminOnly>
                            <div className="admin-layout">
                                <Routes>
                                    <Route path="verifications" element={<VerificationDashboard />} />
                                    <Route path="settings" element={<SystemSettings />} />
                                    <Route path="audit-logs" element={<AuditLogs />} />
                                    <Route path="users" element={<UserManagementDashboard />} />
                                </Routes>
                            </div>
                        </PrivateRoute>
                    }
                />

                {/* Verification Routes */}
                <Route
                    path="/verify/agent/:id"
                    element={
                        <PrivateRoute adminOnly>
                            <AgentVerificationForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/verify/property/:id"
                    element={
                        <PrivateRoute adminOnly>
                            <PropertyVerificationForm />
                        </PrivateRoute>
                    }
                />

                {/* Notification Routes */}
                <Route
                    path="/notifications"
                    element={
                        <PrivateRoute>
                            <AllNotifications />
                        </PrivateRoute>
                    }
                />
            </Routes>
            {!isMapView && !isPropertyDetailView && <Footer />}
            <MobileNav />   
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AIChatProvider>
            <SavedPropertiesProvider>
                <AppContent />
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        duration: 5000,
                        style: {
                            background: '#fff',
                            color: '#363636',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '12px 24px',
                        },
                    }}
                />
            </SavedPropertiesProvider>
            </AIChatProvider>
        </AuthProvider>
    );
}

export default App;
