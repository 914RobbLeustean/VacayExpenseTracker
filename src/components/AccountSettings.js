import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Bell, Globe, Clock, Download, LogOut, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// Helper function for simple class joining
//const classNames = (...classes) => classes.filter(Boolean).join(' ');

// Mock API simulation function
const simulateApiCall = (data, duration = 1500, shouldSucceed = true) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        console.log('Simulated API Success:', data);
        resolve({ success: true, message: 'Operation successful.', data });
      } else {
        console.error('Simulated API Error');
        reject({ success: false, message: 'Operation failed. Please try again.' });
      }
    }, duration);
  });
};

// Mock data (replace with actual data fetching if needed)
const mockUserData = {
  fullName: 'Alex Doe',
  email: 'alex.doe@example.com',
  phone: '555-123-4567',
  notifications: {
    email: true,
    push: false,
  },
  preferences: {
    timeZone: 'America/New_York',
    language: 'en',
  },
};

// Time zones (example list, expand as needed)
const timeZones = [
  { value: 'Etc/GMT+12', label: '(GMT-12:00) International Date Line West' },
  { value: 'Pacific/Midway', label: '(GMT-11:00) Midway Island, Samoa' },
  { value: 'Pacific/Honolulu', label: '(GMT-10:00) Hawaii' },
  { value: 'America/Anchorage', label: '(GMT-09:00) Alaska' },
  { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: 'America/Denver', label: '(GMT-07:00) Mountain Time (US & Canada)' },
  { value: 'America/Chicago', label: '(GMT-06:00) Central Time (US & Canada)' },
  { value: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'America/Caracas', label: '(GMT-04:30) Caracas' },
  { value: 'America/Halifax', label: '(GMT-04:00) Atlantic Time (Canada)' },
  { value: 'America/Sao_Paulo', label: '(GMT-03:00) Brasilia' },
  { value: 'Atlantic/South_Georgia', label: '(GMT-02:00) Mid-Atlantic' },
  { value: 'Atlantic/Azores', label: '(GMT-01:00) Azores' },
  { value: 'Europe/London', label: '(GMT+00:00) London, Lisbon' },
  { value: 'Europe/Paris', label: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris' },
  { value: 'Europe/Bucharest', label: '(GMT+02:00) Bucharest, Athens, Helsinki' }, // Added Bucharest
  { value: 'Europe/Moscow', label: '(GMT+03:00) Moscow, St. Petersburg, Volgograd' },
  { value: 'Asia/Dubai', label: '(GMT+04:00) Abu Dhabi, Muscat' },
  { value: 'Asia/Karachi', label: '(GMT+05:00) Islamabad, Karachi, Tashkent' },
  { value: 'Asia/Dhaka', label: '(GMT+06:00) Astana, Dhaka' },
  { value: 'Asia/Bangkok', label: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'Asia/Hong_Kong', label: '(GMT+08:00) Beijing, Hong Kong, Singapore' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Osaka, Sapporo, Tokyo' },
  { value: 'Australia/Sydney', label: '(GMT+10:00) Canberra, Melbourne, Sydney' },
  { value: 'Pacific/Noumea', label: '(GMT+11:00) Magadan, Solomon Is., New Caledonia' },
  { value: 'Pacific/Auckland', label: '(GMT+12:00) Auckland, Wellington' },
  { value: 'Pacific/Fiji', label: '(GMT+13:00) Fiji, Kamchatka, Marshall Is.' },
];

// Languages (example list)
const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español (Spanish)' },
  { value: 'fr', label: 'Français (French)' },
  { value: 'de', label: 'Deutsch (German)' },
  { value: 'ro', label: 'Română (Romanian)' }, // Added Romanian
];

const AccountSettings = ({ onClose, darkMode }) => {
  // State for user data and form inputs
  const [initialLoading, setInitialLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({ fullName: '', email: '', phone: '' });
  const [passwordInfo, setPasswordInfo] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [notifications, setNotifications] = useState({ email: false, push: false });
  const [preferences, setPreferences] = useState({ timeZone: '', language: '' });

  // State for loading indicators and feedback messages
  const [loadingStates, setLoadingStates] = useState({
    personal: false,
    password: false,
    notifications: false,
    preferences: false,
    deactivate: false,
    download: false,
  });
  const [feedback, setFeedback] = useState({ type: '', message: '', section: '' });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Fetch initial data on mount
  useEffect(() => {
    setInitialLoading(true);
    // Simulate fetching user data
    setTimeout(() => {
      setUserData(mockUserData);
      setPersonalInfo({
        fullName: mockUserData.fullName,
        email: mockUserData.email,
        phone: mockUserData.phone || '', // Handle potentially missing phone
      });
      setNotifications(mockUserData.notifications);
      setPreferences(mockUserData.preferences);
      setInitialLoading(false);
    }, 1000); // Simulate 1 second load time
  }, []);

  // Function to show feedback and clear it after a delay
  const showFeedback = (type, message, section) => {
    setFeedback({ type, message, section });
    setTimeout(() => {
      setFeedback({ type: '', message: '', section: '' });
    }, 4000); // Clear feedback after 4 seconds
  };

  // Basic email validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Form validation function
  const validateForm = (section) => {
    const newErrors = {};
    if (section === 'personal') {
      if (!personalInfo.fullName.trim()) newErrors.fullName = 'Full Name is required.';
      if (!personalInfo.email.trim()) {
        newErrors.email = 'Email Address is required.';
      } else if (!validateEmail(personalInfo.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
      // Optional: Add phone validation if needed
    } else if (section === 'password') {
      if (!passwordInfo.currentPassword) newErrors.currentPassword = 'Current Password is required.';
      if (!passwordInfo.newPassword) {
        newErrors.newPassword = 'New Password is required.';
      } else if (passwordInfo.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters long.';
      }
      if (passwordInfo.newPassword !== passwordInfo.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Passwords do not match.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle input changes
  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    if (errors[e.target.name]) { // Clear error when user types
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordInfo({ ...passwordInfo, [e.target.name]: e.target.value });
     if (errors[e.target.name]) { // Clear error when user types
      setErrors({ ...errors, [e.target.name]: '' });
    }
     // Clear confirm error if new password changes
     if (e.target.name === 'newPassword' && errors.confirmNewPassword) {
       setErrors({ ...errors, confirmNewPassword: '' });
     }
  };

  const handleNotificationChange = (notificationType) => {
    const newValue = !notifications[notificationType];
    const newNotifications = { ...notifications, [notificationType]: newValue };
    setNotifications(newNotifications);
    // Immediately attempt to save notification changes
    handleSaveNotifications(newNotifications);
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
    // Immediately attempt to save preference changes
    handleSavePreferences({ ...preferences, [name]: value });
  };

  // --- Save Handlers ---

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    if (!validateForm('personal')) return;

    setLoadingStates(prev => ({ ...prev, personal: true }));
    setFeedback({ type: '', message: '', section: '' }); // Clear previous feedback
    try {
      await simulateApiCall(personalInfo);
      setUserData(prev => ({ ...prev, ...personalInfo })); // Update main user data state
      showFeedback('success', 'Personal information updated successfully!', 'personal');
      setErrors({}); // Clear errors on success
    } catch (error) {
      showFeedback('error', error.message || 'Failed to update personal information.', 'personal');
    } finally {
      setLoadingStates(prev => ({ ...prev, personal: false }));
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validateForm('password')) return;

    setLoadingStates(prev => ({ ...prev, password: true }));
    setFeedback({ type: '', message: '', section: '' });
    try {
      // Simulate checking current password and updating
      await simulateApiCall({ currentPassword: passwordInfo.currentPassword, newPassword: passwordInfo.newPassword }, 1500, passwordInfo.currentPassword === 'password123'); // Simulate correct password is 'password123'

      showFeedback('success', 'Password updated successfully!', 'password');
      setPasswordInfo({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear fields
      setErrors({}); // Clear errors on success
    } catch (error) {
       if (passwordInfo.currentPassword !== 'password123') {
           setErrors({ ...errors, currentPassword: 'Incorrect current password.' });
           showFeedback('error', 'Incorrect current password.', 'password');
       } else {
           showFeedback('error', error.message || 'Failed to update password.', 'password');
       }
    } finally {
      setLoadingStates(prev => ({ ...prev, password: false }));
    }
  };

  const handleSaveNotifications = async (newNotificationSettings) => {
    setLoadingStates(prev => ({ ...prev, notifications: true }));
    setFeedback({ type: '', message: '', section: '' });
    try {
      await simulateApiCall(newNotificationSettings, 800); // Faster simulation for toggles
      setUserData(prev => ({ ...prev, notifications: newNotificationSettings }));
      showFeedback('success', 'Notification preferences updated.', 'notifications');
    } catch (error) {
      showFeedback('error', error.message || 'Failed to update notifications.', 'notifications');
      // Revert toggle state on failure
      setNotifications(userData.notifications);
    } finally {
      setLoadingStates(prev => ({ ...prev, notifications: false }));
    }
  };

  const handleSavePreferences = async (newPreferenceSettings) => {
    setLoadingStates(prev => ({ ...prev, preferences: true }));
    setFeedback({ type: '', message: '', section: '' });
    try {
      await simulateApiCall(newPreferenceSettings, 800);
      setUserData(prev => ({ ...prev, preferences: newPreferenceSettings }));
      showFeedback('success', 'Preferences updated.', 'preferences');
    } catch (error) {
      showFeedback('error', error.message || 'Failed to update preferences.', 'preferences');
      // Revert dropdown state on failure
      setPreferences(userData.preferences);
    } finally {
      setLoadingStates(prev => ({ ...prev, preferences: false }));
    }
  };

  // --- Account Actions ---

  const handleDeactivateAccount = async () => {
    const confirmation = window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.');
    if (!confirmation) return;

    setLoadingStates(prev => ({ ...prev, deactivate: true }));
    setFeedback({ type: '', message: '', section: '' });
    try {
      await simulateApiCall({ action: 'deactivate' }, 2000);
      showFeedback('success', 'Account deactivated successfully. You will be logged out.', 'actions');
      // In a real app, you would redirect or clear auth state here
      setTimeout(onClose, 2500); // Close modal after showing message
    } catch (error) {
      showFeedback('error', error.message || 'Failed to deactivate account.', 'actions');
    } finally {
      setLoadingStates(prev => ({ ...prev, deactivate: false }));
    }
  };

  const handleDownloadData = async () => {
    setLoadingStates(prev => ({ ...prev, download: true }));
    setFeedback({ type: '', message: '', section: '' });
    try {
      await simulateApiCall({ action: 'download' }, 1000);
      // Simulate file download
      const dataStr = JSON.stringify(userData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'my_vacation_tracker_data.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      linkElement.remove();
      showFeedback('success', 'Your data has started downloading.', 'actions');
    } catch (error) {
      showFeedback('error', error.message || 'Failed to download data.', 'actions');
    } finally {
      setLoadingStates(prev => ({ ...prev, download: false }));
    }
  };

  // --- Styling ---
  const inputBaseClass = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2`;
  const inputLightClass = `border-gray-300 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500`;
  const inputDarkClass = `border-gray-600 bg-gray-700 text-white focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400`;
  const labelBaseClass = `block text-sm font-medium mb-1`;
  const labelLightClass = `text-gray-700`;
  const labelDarkClass = `text-gray-300`;
  const buttonBaseClass = `px-4 py-2 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`;
  const primaryButtonClass = `text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'}`;
  const secondaryButtonClass = `border ${darkMode ? 'border-red-500 text-red-400 hover:bg-red-500 hover:text-white focus:ring-red-400' : 'border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500'}`;
  const tertiaryButtonClass = `border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-600 focus:ring-gray-500' : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400'}`;
  const sectionClass = `p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`;
  const toggleBaseClass = 'relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const toggleEnabledClass = darkMode ? 'bg-blue-600 focus:ring-blue-500' : 'bg-blue-500 focus:ring-blue-400';
  const toggleDisabledClass = darkMode ? 'bg-gray-600 focus:ring-gray-500' : 'bg-gray-200 focus:ring-gray-300';
  const toggleCircleBaseClass = 'inline-block w-4 h-4 transform bg-white rounded-full transition-transform';
  const toggleCircleEnabledClass = 'translate-x-6';
  const toggleCircleDisabledClass = 'translate-x-1';
  const errorTextClass = 'text-red-500 text-xs mt-1';

  const renderFeedback = (sectionName) => {
    if (feedback.section === sectionName && feedback.message) {
      const isSuccess = feedback.type === 'success';
      const bgColor = isSuccess ? (darkMode ? 'bg-green-900' : 'bg-green-100') : (darkMode ? 'bg-red-900' : 'bg-red-100');
      const textColor = isSuccess ? (darkMode ? 'text-green-300' : 'text-green-700') : (darkMode ? 'text-red-300' : 'text-red-700');
      const Icon = isSuccess ? CheckCircle : AlertCircle;

      return (
        <div className={`p-3 rounded-md mt-4 text-sm flex items-center ${bgColor} ${textColor}`}>
          <Icon size={18} className="mr-2 flex-shrink-0" />
          <span>{feedback.message}</span>
        </div>
      );
    }
    return null;
  };

  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className={`p-8 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Loader2 className={`animate-spin h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 overflow-hidden">
      <div className="flex items-center justify-center h-screen p-4">
        <div className={`relative w-full max-w-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
          {/* Header */}
          <div className={`sticky top-0 z-10 flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-t-lg`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Account Settings</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                aria-label="Close settings"
              >
                <X size={24} />
              </button>
              <button
                onClick={onClose}
                className={`p-1 rounded-full ${darkMode ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-gray-100'}`}
                aria-label="Save and exit settings"
              >
                <CheckCircle size={24} />
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
            <div className="p-4">
              {/* Personal Information Section */}
              <form onSubmit={handleSavePersonalInfo} className={sectionClass}>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="fullName" className={`${labelBaseClass} ${darkMode ? labelDarkClass : labelLightClass}`}>Full Name</label>
                    <div className="relative">
                      <User size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={personalInfo.fullName}
                        onChange={handlePersonalInfoChange}
                        className={`${inputBaseClass} ${darkMode ? inputDarkClass : inputLightClass} pl-10`}
                        disabled={loadingStates.personal}
                      />
                    </div>
                     {errors.fullName && <p className={errorTextClass}>{errors.fullName}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className={`${labelBaseClass} ${darkMode ? labelDarkClass : labelLightClass}`}>Email Address</label>
                     <div className="relative">
                      <Mail size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        className={`${inputBaseClass} ${darkMode ? inputDarkClass : inputLightClass} pl-10`}
                        disabled={loadingStates.personal}
                      />
                    </div>
                     {errors.email && <p className={errorTextClass}>{errors.email}</p>}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className={`${labelBaseClass} ${darkMode ? labelDarkClass : labelLightClass}`}>Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      className={`${inputBaseClass} ${darkMode ? inputDarkClass : inputLightClass} pl-10`}
                      disabled={loadingStates.personal}
                      placeholder="e.g., 555-123-4567"
                    />
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  {renderFeedback('personal')}
                  <button
                    type="submit"
                    className={`${buttonBaseClass} ${primaryButtonClass} ml-4`}
                    disabled={loadingStates.personal || (personalInfo.fullName === userData.fullName && personalInfo.email === userData.email && personalInfo.phone === userData.phone)}
                  >
                    {loadingStates.personal ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                    {loadingStates.personal ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>

              {/* Password Section */}
              <form onSubmit={handleUpdatePassword} className={sectionClass}>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="currentPassword" className={`${labelBaseClass} ${darkMode ? labelDarkClass : labelLightClass}`}>Current Password</label>
                     <div className="relative">
                       <Lock size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordInfo.currentPassword}
                        onChange={handlePasswordChange}
                        className={`${inputBaseClass} ${darkMode ? inputDarkClass : inputLightClass} pl-10`}
                        disabled={loadingStates.password}
                      />
                    </div>
                     {errors.currentPassword && <p className={errorTextClass}>{errors.currentPassword}</p>}
                  </div>
                  <div>
                    <label htmlFor="newPassword" className={`${labelBaseClass} ${darkMode ? labelDarkClass : labelLightClass}`}>New Password</label>
                     <div className="relative">
                       <Lock size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordInfo.newPassword}
                        onChange={handlePasswordChange}
                        className={`${inputBaseClass} ${darkMode ? inputDarkClass : inputLightClass} pl-10`}
                        disabled={loadingStates.password}
                      />
                    </div>
                     {errors.newPassword && <p className={errorTextClass}>{errors.newPassword}</p>}
                  </div>
                  <div>
                    <label htmlFor="confirmNewPassword" className={`${labelBaseClass} ${darkMode ? labelDarkClass : labelLightClass}`}>Confirm New Password</label>
                     <div className="relative">
                       <Lock size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={passwordInfo.confirmNewPassword}
                        onChange={handlePasswordChange}
                        className={`${inputBaseClass} ${darkMode ? inputDarkClass : inputLightClass} pl-10`}
                        disabled={loadingStates.password}
                      />
                     </div>
                      {errors.confirmNewPassword && <p className={errorTextClass}>{errors.confirmNewPassword}</p>}
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  {renderFeedback('password')}
                  <button
                    type="submit"
                    className={`${buttonBaseClass} ${primaryButtonClass} ml-4`}
                    disabled={loadingStates.password || !passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmNewPassword}
                  >
                    {loadingStates.password ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                    {loadingStates.password ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              {/* Notification Preferences Section */}
              <div className={sectionClass}>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                       <Mail size={18} className={`mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                       <span className={`${labelBaseClass} mb-0 ${darkMode ? labelDarkClass : labelLightClass}`}>Email Notifications</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleNotificationChange('email')}
                        className={`${toggleBaseClass} ${notifications.email ? toggleEnabledClass : toggleDisabledClass}`}
                        aria-pressed={notifications.email}
                        disabled={loadingStates.notifications}
                        >
                        <span className="sr-only">Enable email notifications</span>
                        <span className={`${toggleCircleBaseClass} ${notifications.email ? toggleCircleEnabledClass : toggleCircleDisabledClass}`} />
                    </button>

                    <div className="flex items-center">
                       <Bell size={18} className={`mr-3 ml-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                       <span className={`${labelBaseClass} mb-0 ml-4 ${darkMode ? labelDarkClass : labelLightClass}`}>Push Notifications</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleNotificationChange('push')}
                        className={`${toggleBaseClass} ${notifications.push ? toggleEnabledClass : toggleDisabledClass}`}
                        aria-pressed={notifications.push}
                        disabled={loadingStates.notifications}
                        >
                        <span className="sr-only">Enable push notifications</span>
                        <span className={`${toggleCircleBaseClass} ${notifications.push ? toggleCircleEnabledClass : toggleCircleDisabledClass}`} />
                    </button>

                  </div>
                </div>
                {renderFeedback('notifications')}
                 {loadingStates.notifications && <div className="flex justify-end mt-2"><Loader2 size={18} className="animate-spin text-blue-500" /></div>}
              </div>

              {/* Time Zone & Language Section */}
              <div className={sectionClass}>
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Time Zone & Language</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="timeZone" className={`${labelBaseClass} ${darkMode ? labelDarkClass : labelLightClass}`}>Time Zone</label>
                    <div className="relative">
                        <Clock size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <select
                          id="timeZone"
                          name="timeZone"
                          value={preferences.timeZone}
                          onChange={handlePreferenceChange}
                          className={`${inputBaseClass} ${darkMode ? inputDarkClass : inputLightClass} pl-10 appearance-none`}
                          disabled={loadingStates.preferences}
                        >
                          {timeZones.map(tz => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                        <div className={`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="language" className={`${labelBaseClass} ${darkMode ? labelDarkClass : labelLightClass}`}>Language</label>
                     <div className="relative">
                        <Globe size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <select
                          id="language"
                          name="language"
                          value={preferences.language}
                          onChange={handlePreferenceChange}
                          className={`${inputBaseClass} ${darkMode ? inputDarkClass : inputLightClass} pl-10 appearance-none`}
                          disabled={loadingStates.preferences}
                        >
                          {languages.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                          ))}
                        </select>
                         <div className={`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                     </div>
                  </div>
                </div>
                 {renderFeedback('preferences')}
                 {loadingStates.preferences && <div className="flex justify-end mt-2"><Loader2 size={18} className="animate-spin text-blue-500" /></div>}
              </div>

              {/* Account Actions Section */}
              <div className="p-6">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Account Actions</h3>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                   <button
                    onClick={handleDownloadData}
                    className={`${buttonBaseClass} ${tertiaryButtonClass} w-full md:w-auto`}
                    disabled={loadingStates.download || loadingStates.deactivate}
                  >
                     {loadingStates.download ? <Loader2 size={18} className="animate-spin mr-2" /> : <Download size={18} className="mr-2" />}
                     {loadingStates.download ? 'Downloading...' : 'Download My Data'}
                  </button>
                  <button
                    onClick={handleDeactivateAccount}
                    className={`${buttonBaseClass} ${secondaryButtonClass} w-full md:w-auto`}
                    disabled={loadingStates.deactivate || loadingStates.download}
                  >
                    {loadingStates.deactivate ? <Loader2 size={18} className="animate-spin mr-2" /> : <LogOut size={18} className="mr-2" />}
                    {loadingStates.deactivate ? 'Deactivating...' : 'Deactivate Account'}
                  </button>
                </div>
                 {renderFeedback('actions')}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;