import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, User, Users, Database, Check, X, AlertCircle, Server, Globe } from 'lucide-react';

// ========== API CONFIGURATION ==========
// Set this to false to use mock data, true to use real API
const USE_REAL_API = false;

// Real API configuration - for when CORS issues are resolved
const API_BASE_URL = 'https://presales-platform.us1.plainid.io/v1';
const API_KEY = 'oye5i0uZ6XSt22aspTilh2YokktFUPD8';
const USERS_ENDPOINT = `${API_BASE_URL}/users`;
const ACTIONS_ENDPOINT = `${API_BASE_URL}/actions`;

// ========== MOCK DATA ==========
// Used when USE_REAL_API is false
const mockUsers = [
  { 
    id: 1, 
    name: 'Michael Chen', 
    role: 'Administrator', 
    email: 'michael.chen@example.com',
    department: 'IT',
    permissions: ['READ', 'WRITE', 'DELETE', 'CREATE', 'UPDATE'] 
  },
  { 
    id: 2, 
    name: 'Raj Patel', 
    role: 'User', 
    email: 'raj.patel@example.com',
    department: 'Sales',
    permissions: ['READ'] 
  },
  { 
    id: 3, 
    name: 'Sara Jameson', 
    role: 'Wealth Manager', 
    email: 'sara.jameson@example.com',
    department: 'Finance',
    permissions: ['READ', 'WRITE', 'CREATE', 'UPDATE'] 
  },
  { 
    id: 4, 
    name: 'Emma Wilson', 
    role: 'Wealth Manager', 
    email: 'emma.wilson@example.com',
    department: 'Finance',
    permissions: ['READ', 'WRITE', 'CREATE'] 
  },
  { 
    id: 5, 
    name: 'James Rodriguez', 
    role: 'Administrator', 
    email: 'james.rodriguez@example.com',
    department: 'IT',
    permissions: ['READ', 'WRITE', 'DELETE', 'CREATE', 'UPDATE'] 
  }
];

const mockActions = ['READ', 'WRITE', 'DELETE', 'CREATE', 'UPDATE', 'APPROVE', 'REJECT'];

// ========== API SERVICE FUNCTIONS ==========
// Fetches users from either mock data or real API based on USE_REAL_API toggle
const fetchUsers = async () => {
  // For demo - use mock data
  if (!USE_REAL_API) {
    console.log("Using mock users data");
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => resolve(mockUsers), 800);
    });
  }
  
  // Real API implementation
  try {
    console.log("Fetching users from real API:", USERS_ENDPOINT);
    const response = await fetch(USERS_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      // Add mode and credentials to help with CORS
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Users API response:", data);
    
    // Map the API response to the format we need
    const formattedUsers = Array.isArray(data.data) 
      ? data.data.map(user => ({
          id: user.id || user.userId || user._id,
          name: user.displayName || user.name || `User ${user.id}`,
          role: user.role || user.userRole || 'User',
          email: user.email || `user${user.id}@example.com`,
          permissions: user.permissions || ['READ']
        }))
      : [];

    return formattedUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    console.log("Falling back to mock data");
    return mockUsers; // Fallback to mock data on error
  }
};

// Fetches actions from either mock data or real API based on USE_REAL_API toggle
const fetchActions = async () => {
  // For demo - use mock data
  if (!USE_REAL_API) {
    console.log("Using mock actions data");
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => resolve(mockActions), 600);
    });
  }
  
  // Real API implementation
  try {
    console.log("Fetching actions from real API:", ACTIONS_ENDPOINT);
    const response = await fetch(ACTIONS_ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      // Add mode and credentials to help with CORS
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch actions: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Actions API response:", data);
    
    // Map the API response to the format we need
    const formattedActions = Array.isArray(data.data) 
      ? data.data.map(action => action.name || action.action || action)
      : [];

    return formattedActions.length > 0 ? formattedActions : mockActions;
  } catch (error) {
    console.error("Error fetching actions:", error);
    console.log("Falling back to mock data");
    return mockActions; // Fallback to mock data on error
  }
};

const APIPoliciesDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const [authorization, setAuthorization] = useState(null);
  const [animateTransition, setAnimateTransition] = useState(false);
  
  // Dynamic data states
  const [users, setUsers] = useState([]);
  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedResource, setSelectedResource] = useState('accounts');
  const [selectedActions, setSelectedActions] = useState([]);
  
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch both users and actions in parallel
        const [usersData, actionsData] = await Promise.all([
          fetchUsers(),
          fetchActions()
        ]);
        
        setUsers(usersData);
        setActions(actionsData);
        
        // Set initial selected user and action
        if (usersData.length > 0) {
          setSelectedUser(usersData[0]);
        }
        if (actionsData.length > 0) {
          setSelectedActions([actionsData[0]]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Error loading data: " + err.message);
        
        // Fall back to mock data if API calls fail
        setUsers(mockUsers);
        setActions(mockActions);
        setSelectedUser(mockUsers[0]);
        setSelectedActions([mockActions[0]]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Animation transition effect
  useEffect(() => {
    if (animateTransition) {
      const timer = setTimeout(() => {
        setAnimateTransition(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [animateTransition]);
  
  const toggleAction = (action) => {
    if (selectedActions.includes(action)) {
      if (selectedActions.length > 1) {
        setSelectedActions(selectedActions.filter(a => a !== action));
      }
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };
  
  // PlainID brand colors (from brand guidelines)
  const colors = {
    primary: {
      light: '#D1E4E5', // Misty Teal
      medium: '#00A7B5', // PlainID Teal
      default: '#00A7B5', // PlainID Teal
      dark: '#002A3A', // Deep Teal
    },
    secondary: {
      light: '#EEF1F4', // Icy Gray
      medium: '#BFCED6', // Cloudy Gray
      default: '#515A6C', // Slate
      dark: '#002A3A', // Deep Teal
    },
    success: {
      light: '#D1E4E5', // Misty Teal
      medium: '#00A7B5', // PlainID Teal (replacing Neon Green for better visibility)
      default: '#00A7B5', // PlainID Teal (replacing Neon Green for better visibility)
      dark: '#00A7B5', // PlainID Teal
    },
    danger: {
      light: '#FEF2F2', // red-50
      medium: '#F87171', // red-400
      default: '#EF4444', // red-500
      dark: '#991B1B', // red-800
    },
    neutral: {
      light: '#EEF1F4', // Icy Gray
      medium: '#BFCED6', // Cloudy Gray
      default: '#515A6C', // Slate
      dark: '#002A3A', // Deep Teal
    }
  };
  
  // PlainID background dot pattern styles
  const dotPatternStyle = {
    backgroundImage: `radial-gradient(${colors.primary.medium} 1.5px, transparent 1.5px), radial-gradient(${colors.primary.medium} 1.5px, transparent 1.5px)`,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
    opacity: 0.15
  };
  
  const steps = [
    { id: 'request', title: 'API Request' },
    { id: 'policy', title: 'Policy Summary' },
    { id: 'decision', title: 'Authorization Decision' },
    { id: 'response', title: 'API Response' }
  ];
  
  const resources = [
    { id: 'accounts', name: 'Accounts', icon: <Users size={20} /> },
    { id: 'partners', name: 'Partners', icon: <Database size={20} /> },
    { id: 'system-settings', name: 'System Settings', icon: <Server size={20} /> }
  ];
  
  const evaluateAccess = () => {
    if (!selectedUser || selectedActions.length === 0) return;
    
    const permissionResults = selectedActions.map(action => {
      const hasPermission = selectedUser.permissions.includes(action);
      
      let allowed = hasPermission;
      
      if (selectedResource === 'partners' && selectedUser.role !== 'Wealth Manager' && selectedUser.role !== 'Administrator') {
        allowed = false;
      }
      
      if (selectedResource === 'system-settings' && selectedUser.role !== 'Administrator') {
        allowed = false;
      }
      
      return {
        action,
        allowed
      };
    });
    
    const overallAuthorized = permissionResults.every(result => result.allowed);
    
    setAuthorization({
      overall: overallAuthorized,
      details: permissionResults
    });
    setShowDecision(true);
  };
  
  const handleNext = () => {
    setAnimateTransition(true);
    
    if (activeStep === 1) {
      evaluateAccess();
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      
      // Scroll to top with smooth animation
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    } else {
      setActiveStep(0);
      setShowDecision(false);
      setAuthorization(null);
      
      // Scroll to top with smooth animation
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    }
  };
  
  const handleBack = () => {
    setAnimateTransition(true);
    
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      if (activeStep === 3) {
        setShowDecision(true);
      } else if (activeStep === 2) {
        setShowDecision(false);
      }
      
      // Scroll to top with smooth animation
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  // Get the background color based on step index  
  const getStepBgColor = (index) => {
    if (index === activeStep) return colors.primary.default;
    if (index < activeStep) return colors.success.default;
    return colors.secondary.medium;
  };
  
  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-light to-primary-dark p-4 transition-all duration-300 relative overflow-hidden" style={{fontFamily: "'Roboto', sans-serif"}}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={dotPatternStyle}></div>
        <div className="flex items-center justify-center h-screen">
          <div className="glass-effect p-10 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-pulse-slow">
              <Shield className="h-16 w-16 mb-4" style={{color: colors.primary.default}} />
            </div>
            <h2 className="text-xl font-semibold" style={{color: colors.primary.default}}>Loading API Policies Demo...</h2>
            <p className="text-slate-600 mt-2">Fetching users and actions from PlainID</p>
            <div className="mt-4 w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-gradient" style={{width: '70%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-light to-primary-dark p-4 transition-all duration-300 relative overflow-hidden" style={{fontFamily: "'Roboto', sans-serif"}}>
      {/* PlainID dot grid pattern background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={dotPatternStyle}></div>
      
      {/* Header - No logo, just title */}
      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center justify-center bg-white/60 backdrop-blur-sm py-4 px-7 rounded-xl shadow-lg animate-pulse-slow">
          <Shield className="mr-3 h-9 w-9" style={{color: colors.primary.default}} />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r" 
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.primary.default}, ${colors.primary.dark})`,
              fontFamily: "'Roboto', sans-serif", 
              fontWeight: 500 // Roboto Medium per guidelines
            }}>
            API Policies and Authorization
          </h1>
        </div>
        <p className="mt-3 max-w-xl mx-auto" style={{color: colors.secondary.default, fontFamily: "'Roboto', sans-serif"}}>
          A visual API authorization flow for a Wealth Management firm
        </p>
        
        {/* Show API status indicator if there was an error */}
        {error && (
          <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error} (using fallback data)
          </div>
        )}
      </div>
      
      {/* Refined progress steps */}
      <div className="mb-12 w-full relative z-10">
        <div className="glass-effect py-5 px-8 rounded-2xl mb-5 shadow-lg" style={{backgroundColor: "rgba(255, 255, 255, 0.7)"}}>
          <div className="grid grid-cols-4 gap-2 relative">
            {/* Progress connector line */}
            <div className="absolute top-6 left-0 w-full h-0.5" style={{backgroundColor: colors.secondary.medium}}></div>
            
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Completed progress line */}
                {index > 0 && (
                  <div className="absolute top-6 right-1/2 h-0.5 transition-all duration-1000 ease-in-out" 
                    style={{ 
                      width: index <= activeStep ? '100%' : '0%',
                      backgroundColor: colors.success.default,
                      zIndex: 1,
                      left: '-50%'
                    }}>
                  </div>
                )}
              
                {/* Step circle */}
                <div 
                  className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500 ease-in-out z-10 ${
                    index === activeStep ? 'scale-110' : ''
                  }`}
                  style={{ 
                    backgroundColor: getStepBgColor(index),
                    color: index <= activeStep ? 'white' : colors.secondary.default,
                    boxShadow: index === activeStep ? `0 0 20px ${colors.primary.default}80` : '',
                    fontFamily: "'Roboto', sans-serif"
                  }}
                >
                  {index < activeStep ? (
                    <Check size={24} className="animate-fadeIn" />
                  ) : (
                    <span className="font-semibold" style={{ fontSize: "18px" }}>{index + 1}</span>
                  )}
                  
                  {/* Ripple effect for active step */}
                  {index === activeStep && (
                    <div className="absolute inset-0 rounded-full animate-ping opacity-40" 
                      style={{ backgroundColor: colors.primary.default }}></div>
                  )}
                </div>
                
                <div className="text-sm mt-3 text-center font-medium" style={{fontFamily: "'Roboto', sans-serif"}}>
                  <span className={`inline-block transition-all duration-300 ${
                    index === activeStep ? 'transform translate-y-0 font-semibold' : 
                    index < activeStep ? '' : 'opacity-70'
                  }`}
                  style={{ 
                    color: index === activeStep ? colors.primary.default : 
                           index < activeStep ? colors.success.default : 
                           colors.secondary.default
                  }}>
                    {step.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div 
        className={`glass-effect rounded-xl shadow-2xl p-8 mb-6 flex-grow border transition-all duration-500 ease-in-out relative z-10 ${
          animateTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}
        style={{ 
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderColor: colors.primary.light
        }}
      >
        {/* PlainID dot grid pattern - smaller version in the card */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full overflow-hidden opacity-10 -translate-y-1/3 translate-x-1/3 pointer-events-none">
          <div style={{
            backgroundImage: `radial-gradient(${colors.primary.default} 1px, transparent 1px)`,
            backgroundSize: '15px 15px',
            width: '100%',
            height: '100%'
          }}></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full overflow-hidden opacity-10 translate-y-1/3 -translate-x-1/3 pointer-events-none">
          <div style={{
            backgroundImage: `radial-gradient(${colors.primary.default} 1px, transparent 1px)`,
            backgroundSize: '15px 15px',
            width: '100%',
            height: '100%'
          }}></div>
        </div>
        
        {activeStep === 0 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <User className="mr-2 h-6 w-6" style={{color: colors.primary.default}} />
              Configure API Request
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-5 rounded-xl border border-indigo-200/50 shadow-sm transition-all duration-300 hover:shadow-lg group">
                <h3 className="font-medium text-indigo-800 mb-4 flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg shadow-sm group-hover:bg-indigo-200 transition-all duration-300 mr-3">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-base">Select User</span>
                </h3>
                <div className="space-y-3">
                  {users.map(user => (
                    <div 
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`cursor-pointer p-4 rounded-lg transition-all duration-300 transform ${
                        selectedUser && selectedUser.id === user.id 
                          ? 'bg-indigo-200/80 border-l-4 border-indigo-600 shadow-md translate-x-1' 
                          : 'bg-white/80 hover:bg-indigo-100/60 hover:translate-x-1 hover:shadow-md'
                      }`}
                    >
                      <div className="font-medium text-indigo-900">{user.name}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Role: <span className={`font-medium inline-block px-2 py-0.5 rounded ${
                          user.role === 'Administrator' ? 'bg-red-100 text-red-700' : 
                          user.role === 'Wealth Manager' ? 'bg-purple-100 text-purple-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>{user.role}</span>
                      </div>
                      {user.email && (
                        <div className="text-xs text-slate-500 mt-1">
                          {user.email}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 p-5 rounded-xl border border-violet-200/50 shadow-sm transition-all duration-300 hover:shadow-lg group">
                <h3 className="font-medium text-violet-800 mb-4 flex items-center">
                  <div className="bg-violet-100 p-2 rounded-lg shadow-sm group-hover:bg-violet-200 transition-all duration-300 mr-3">
                    <Database className="h-5 w-5 text-violet-600" />
                  </div>
                  <span className="text-base">Select Resource</span>
                </h3>
                <div className="space-y-3">
                  {resources.map(resource => (
                    <div 
                      key={resource.id}
                      onClick={() => setSelectedResource(resource.id)}
                      className={`cursor-pointer p-4 rounded-lg flex items-center transition-all duration-300 transform ${
                        selectedResource === resource.id 
                          ? 'bg-violet-200/80 border-l-4 border-violet-600 shadow-md translate-x-1' 
                          : 'bg-white/80 hover:bg-violet-100/60 hover:translate-x-1 hover:shadow-md'
                      }`}
                    >
                      <div className={`mr-3 bg-violet-100 p-2 rounded-lg ${
                        selectedResource === resource.id ? 'bg-violet-200' : ''
                      }`}>
                        {resource.icon}
                      </div>
                      <div className="font-medium text-violet-900">{resource.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 rounded-xl border border-emerald-200/50 shadow-sm transition-all duration-300 hover:shadow-lg group">
                <h3 className="font-medium text-emerald-800 mb-4 flex items-center">
                  <div className="bg-emerald-100 p-2 rounded-lg shadow-sm group-hover:bg-emerald-200 transition-all duration-300 mr-3">
                    <Key className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-base">Select Actions</span>
                </h3>
                <div className="space-y-3">
                  {actions.map(action => (
                    <div 
                      key={action}
                      onClick={() => toggleAction(action)}
                      className={`cursor-pointer p-4 rounded-lg flex items-center transition-all duration-300 transform ${
                        selectedActions.includes(action) 
                          ? 'bg-emerald-200/80 border-l-4 border-emerald-600 shadow-md translate-x-1' 
                          : 'bg-white/80 hover:bg-emerald-100/60 hover:translate-x-1 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-md border mr-3 flex items-center justify-center transition-all duration-300 ${
                        selectedActions.includes(action) ? 'bg-emerald-600 border-emerald-600 scale-110' : 'border-slate-400'
                      }`}>
                        {selectedActions.includes(action) && <Check className="h-4 w-4 text-white" />}
                      </div>
                      <div className="font-medium text-emerald-900">{action}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="font-medium text-white mb-4 flex items-center">
                <div className="bg-slate-700 p-2 rounded-lg shadow-md mr-3">
                  <Globe className="h-5 w-5 text-indigo-400" />
                </div>
                API Request Preview
              </h3>
              <div className="flex space-x-2 mb-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <div className="bg-slate-950 rounded-lg overflow-hidden shadow-inner">
                <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 border-b border-slate-700">
                  request.http
                </div>
                <pre className="text-emerald-400 p-5 overflow-x-auto text-sm font-mono">
{`GET /api/${selectedResource}
Authorization: Bearer ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}
X-User-ID: ${selectedUser ? selectedUser.id : ''}
X-User-Role: ${selectedUser ? selectedUser.role : ''}
X-Actions: ${selectedActions.join(',')}`}
                </pre>
              </div>
              <div className="flex justify-between mt-3">
                <div className="text-xs text-slate-400">Authorization API • v2.3.1</div>
                <div className="text-xs text-slate-400">Wealth Management Platform</div>
              </div>
            </div>
          </div>
        )}
        
        {activeStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Lock className="mr-2 h-6 w-6" style={{color: colors.primary.default}} />
              Policy Summary
            </h2>
            
            <div className="flex items-center justify-center my-8">
              <div className="relative">
                <div className="w-72 h-72 rounded-full bg-blue-100 flex items-center justify-center shadow-lg transition-all duration-500 transform hover:scale-105">
                  <div className="w-56 h-56 rounded-full bg-blue-200 flex items-center justify-center transition-all duration-500">
                    <div className="w-40 h-40 rounded-full bg-blue-300 flex items-center justify-center transition-all duration-500">
                      <Lock className="h-20 w-20 text-blue-800 animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg border border-blue-200 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="font-medium">User: <strong>{selectedUser ? selectedUser.name : ''}</strong></span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white p-3 rounded-lg shadow-lg border border-blue-200 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center text-sm">
                    <Key className="mr-2 h-5 w-5 text-emerald-600" />
                    <span className="font-medium">Actions: <strong>{selectedActions.join(', ')}</strong></span>
                  </div>
                </div>
                
                <div className="absolute left-0 top-1/2 transform -translate-x-3/4 -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg border border-blue-200 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center text-sm">
                    <Database className="mr-2 h-5 w-5 text-violet-600" />
                    <span className="font-medium">Resource: <strong>{selectedResource}</strong></span>
                  </div>
                </div>
                
                <div className="absolute right-0 top-1/2 transform translate-x-3/4 -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg border border-blue-200 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center text-sm">
                    <Shield className="mr-2 h-5 w-5 text-red-600" />
                    <span className="font-medium">Role: <strong>{selectedUser ? selectedUser.role : ''}</strong></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-md transition-all duration-300 hover:shadow-lg">
              <h3 className="font-medium text-slate-700 mb-3 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-blue-700" />
                Policy Rules Applied:
              </h3>
              <div className="space-y-3 max-w-3xl mx-auto">
                <div className="p-3 bg-white rounded-lg border border-slate-100 flex items-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200">
                  <div className="mr-3 text-violet-600 bg-violet-100 p-2 rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="text-sm">
                    User <strong>{selectedUser ? selectedUser.name : ''}</strong> has role <strong>{selectedUser ? selectedUser.role : ''}</strong> with permissions: <strong>{selectedUser ? selectedUser.permissions.join(', ') : ''}</strong>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-slate-100 flex items-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200">
                  <div className="mr-3 text-emerald-600 bg-emerald-100 p-2 rounded-full">
                    <Key className="h-5 w-5" />
                  </div>
                  <div className="text-sm">
                    Selected actions: <strong>{selectedActions.join(', ')}</strong>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-slate-100 flex items-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-violet-200">
                  <div className="mr-3 text-violet-600 bg-violet-100 p-2 rounded-full">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="text-sm">
                    Resource <strong>{selectedResource}</strong> requires specific roles for access
                  </div>
                </div>
                
                {selectedResource === 'partners' && (
                  <div className="p-3 bg-white rounded-lg border border-red-100 flex items-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-300">
                    <div className="mr-3 text-red-600 bg-red-100 p-2 rounded-full">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="text-sm">
                      <strong>Special Policy:</strong> Partners require Wealth Manager or Administrator role
                    </div>
                  </div>
                )}
                
                {selectedResource === 'system-settings' && (
                  <div className="p-3 bg-white rounded-lg border border-red-100 flex items-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-300">
                    <div className="mr-3 text-red-600 bg-red-100 p-2 rounded-full">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="text-sm">
                      <strong>Special Policy:</strong> System Settings require Administrator role
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Shield className="mr-2 h-6 w-6" style={{color: colors.primary.default}} />
              Authorization Decision
            </h2>
            
            <div className="flex items-center justify-center py-10">
              {showDecision && (
                <div 
                  className={`flex flex-col items-center p-8 rounded-xl ${
                    authorization?.overall ? 'bg-emerald-50' : 'bg-red-50'
                  } border-2 ${
                    authorization?.overall ? 'border-emerald-300' : 'border-red-300'
                  } shadow-lg max-w-2xl w-full transition-all duration-500 transform ${
                    animateTransition ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                  }`}
                >
                  <div 
                    className={`rounded-full p-5 ${
                      authorization?.overall ? 'bg-emerald-200 text-emerald-700' : 'bg-red-200 text-red-700'
                    } shadow-md transition-all duration-500 transform hover:scale-110`}
                  >
                    {authorization?.overall ? 
                      <Check className="h-16 w-16 animate-[ping_1s_ease-in-out]" /> : 
                      <X className="h-16 w-16 animate-[ping_1s_ease-in-out]" />
                    }
                  </div>
                  <h3 
                    className={`text-xl font-bold mt-4 ${
                      authorization?.overall ? 'text-emerald-800' : 'text-red-800'
                    }`}
                  >
                    {authorization?.overall ? 'Access Granted' : 'Access Denied'}
                  </h3>
                  <p className="text-slate-600 mt-2 text-center max-w-md">
                    {authorization?.overall ? 
                      `${selectedUser ? selectedUser.name : ''} is authorized to perform all requested actions on ${selectedResource}` :
                      `${selectedUser ? selectedUser.name : ''} is not authorized to perform all requested actions on ${selectedResource}`
                    }
                  </p>
                  
                  <div className="mt-6 w-full">
                    <h4 className="text-slate-700 font-medium mb-3 flex items-center">
                      <Database className="mr-2 h-5 w-5 text-indigo-600" />
                      Action Details:
                    </h4>
                    <div className="grid gap-3">
                      {authorization?.details.map((detail, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border transition-all duration-300 transform hover:translate-x-1 ${
                            detail.allowed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                          } shadow-sm`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`mr-2 ${
                                detail.allowed ? 'text-emerald-600' : 'text-red-600'
                              }`}>
                                {detail.allowed ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                              </div>
                              <span className="font-medium">{detail.action}</span>
                            </div>
                            <span className={`text-sm font-medium ${
                              detail.allowed ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {detail.allowed ? 'Allowed' : 'Denied'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg text-sm border border-slate-200 w-full transition-all duration-300 hover:shadow-md">
                    <pre className="whitespace-pre-wrap">
{`{
  "subject": "${selectedUser ? selectedUser.name : ''}",
  "role": "${selectedUser ? selectedUser.role : ''}",
  "resource": "${selectedResource}",
  "actions": ${JSON.stringify(selectedActions)},
  "overallAllowed": ${authorization?.overall},
  "details": ${JSON.stringify(authorization?.details, null, 2)},
  "timestamp": "${new Date().toISOString()}",
  "decision_id": "policy-${Math.random().toString(36).substring(2, 15)}"
}`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Server className="mr-2 h-6 w-6" style={{color: colors.primary.default}} />
              API Response
            </h2>
            
            <div className="flex justify-center">
              <div className="max-w-2xl w-full space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-110">
                    <Globe className="h-10 w-10 text-blue-600" />
                  </div>
                  <div className="flex-grow relative">
                    <div className="h-3 bg-blue-200 rounded-full shadow-inner overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-in-out ${
                          authorization?.overall ? 'bg-blue-600 w-full' : 'bg-red-500 w-1/4'
                        }`}
                      ></div>
                      <div 
                        className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" 
                        style={{ animation: "shine 2s infinite linear" }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 bg-violet-100 p-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-110">
                    <Server className="h-10 w-10 text-violet-600" />
                  </div>
                </div>
                
                <style>
                  {`
                    @keyframes shine {
                      0% { transform: translateX(-100%); }
                      100% { transform: translateX(100%); }
                    }
                    @keyframes fadeIn {
                      from { opacity: 0; transform: translateY(10px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                      animation: fadeIn 0.5s ease-out forwards;
                    }
                    @keyframes ping {
                      75%, 100% {
                        transform: scale(1.2);
                        opacity: 0;
                      }
                    }
                  `}
                </style>
                
                <div className="bg-slate-900 p-5 rounded-xl shadow-lg text-sm transition-all duration-300 transform hover:shadow-xl">
                  {authorization?.overall ? (
                    <>
                      <div className="flex items-center mb-3">
                        <div className="h-4 w-4 rounded-full bg-emerald-500 mr-3 animate-pulse"></div>
                        <span className="text-emerald-400 font-medium">200 OK</span>
                      </div>
                      <pre className="text-emerald-300 mt-3 overflow-x-auto">
{`{
  "status": "success",
  "data": {
    // ${selectedResource} data would be here
    "id": "resource-${Math.random().toString(36).substring(2, 10)}",
    "name": "Sample ${selectedResource}",
    "last_updated": "${new Date().toISOString()}"
  },
  "metadata": {
    "request_id": "req-${Math.random().toString(36).substring(2, 10)}",
    "processing_time_ms": ${Math.floor(Math.random() * 100) + 20}
  }
}`}
                      </pre>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center mb-3">
                        <div className="h-4 w-4 rounded-full bg-red-500 mr-3 animate-pulse"></div>
                        <span className="text-red-400 font-medium">403 Forbidden</span>
                      </div>
                      <pre className="text-red-300 mt-3 overflow-x-auto">
{`{
  "status": "error",
  "code": "ACCESS_DENIED",
  "message": "User does not have permission to perform requested actions on ${selectedResource}",
  "request_id": "req-${Math.random().toString(36).substring(2, 10)}"
}`}
                      </pre>
                    </>
                  )}
                </div>
                
                <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-200 shadow-md transition-all duration-300 hover:shadow-lg">
                  <h3 className="font-medium text-slate-700 mb-3 flex items-center">
                    <Server className="mr-2 h-5 w-5 text-indigo-600" />
                    Request Summary:
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm text-slate-600 font-medium">User:</div>
                      <div className="text-sm font-medium bg-indigo-50 p-2 rounded transition-all duration-300 hover:bg-indigo-100">{selectedUser ? selectedUser.name : ''}</div>
                      
                      <div className="text-sm text-slate-600 font-medium">Resource:</div>
                      <div className="text-sm font-medium bg-violet-50 p-2 rounded transition-all duration-300 hover:bg-violet-100">{selectedResource}</div>
                      
                      <div className="text-sm text-slate-600 font-medium">Actions:</div>
                      <div className="text-sm font-medium bg-emerald-50 p-2 rounded transition-all duration-300 hover:bg-emerald-100">{selectedActions.join(', ')}</div>
                      
                      <div className="text-sm text-slate-600 font-medium">Decision:</div>
                      <div className={`text-sm font-medium p-2 rounded transition-all duration-300 hover:scale-105 ${
                        authorization?.overall ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}>
                        {authorization?.overall ? 'Authorized ✓' : 'Unauthorized ✗'}
                      </div>
                      
                      <div className="text-sm text-slate-600 font-medium">Response Code:</div>
                      <div className={`text-sm font-medium p-2 rounded transition-all duration-300 hover:scale-105 ${
                        authorization?.overall ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}>
                        {authorization?.overall ? '200 OK' : '403 Forbidden'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-8 relative z-10">
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          className={`px-6 py-3 rounded-xl shadow flex items-center transition-all duration-300 ${
            activeStep === 0 
              ? 'cursor-not-allowed border' 
              : 'bg-white hover:shadow-md border hover:border-opacity-100'
          }`}
          style={{ 
            backgroundColor: activeStep === 0 ? colors.secondary.light : 'white',
            color: activeStep === 0 ? colors.secondary.medium : colors.primary.default, 
            borderColor: activeStep === 0 ? colors.secondary.medium + '50' : colors.primary.default + '50',
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 500 // Roboto Medium per guidelines
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Back</span>
        </button>
        
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeStep ? 'scale-125' : ''
                }`}
                style={{
                  backgroundColor: index === activeStep ? colors.primary.default : 
                                  index < activeStep ? colors.success.default : 
                                  colors.secondary.medium
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleNext}
          className="px-6 py-3 text-white rounded-xl shadow-lg hover:shadow-lg flex items-center transition-all duration-300 transform hover:translate-y-[-2px]"
          style={{
            background: `linear-gradient(to right, ${colors.primary.default}, ${colors.primary.dark})`,
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 500 // Roboto Medium per guidelines
          }}
        >
          {activeStep === steps.length - 1 ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Restart Flow
            </>
          ) : (
            <>
              Next Step
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
          
          {/* Add subtle glow effect to button */}
          <div className="absolute inset-0 rounded-xl bg-white opacity-20 blur-xl animate-pulse-slow -z-10"></div>
        </button>
      </div>
    </div>
  );
};

export default APIPoliciesDemo;
