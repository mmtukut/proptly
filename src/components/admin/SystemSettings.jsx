import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoVerification: false,
    maintenanceMode: false,
    verificationTimeout: 48,
    maxFileSize: 5,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/admin/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load system settings');
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = async (setting, value) => {
    try {
      await axios.patch('/api/admin/settings', { [setting]: value });
      setSettings(prev => ({ ...prev, [setting]: value }));
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-gray-600">Enable system-wide email notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Auto Verification</h3>
            <p className="text-gray-600">Automatically verify new properties</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.autoVerification}
              onChange={(e) => handleSettingChange('autoVerification', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Maintenance Mode</h3>
            <p className="text-gray-600">Enable system maintenance mode</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.maintenanceMode}
              onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <h3 className="font-medium mb-2">Verification Timeout (hours)</h3>
          <input
            type="number"
            min="1"
            max="168"
            value={settings.verificationTimeout}
            onChange={(e) => handleSettingChange('verificationTimeout', parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">Max File Size (MB)</h3>
          <input
            type="number"
            min="1"
            max="50"
            value={settings.maxFileSize}
            onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
