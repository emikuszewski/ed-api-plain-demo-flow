import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  User, 
  Users, 
  Database, 
  Check, 
  X, 
  AlertCircle, 
  Server, 
  Globe,
  Activity,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ChevronRight,
  Eye,
  EyeOff,
  FileJson,
  MessageSquare,
  Menu,
  Settings
} from 'lucide-react';

const APIPoliciesDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const [authorization, setAuthorization] = useState(null);
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [theme, setTheme] = useState('blue');
  
  const themes = {
    blue: {
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      primaryText: 'text-blue-600',
      primaryLight: 'bg-blue-100',
      primaryLightHover: 'hover:bg-blue-200',
      secondary: 'bg-purple-600',
      secondaryText: 'text-purple-600',
      secondaryLight: 'bg-purple-100',
      accent: 'bg-green-600',
      accentText: 'text-green-600',
      accentLight: 'bg-green-100',
      highlight: 'bg-amber-500',
      highlightText: 'text-amber-600',
      highlightLight: 'bg-amber-100',
      background: 'bg-blue-50',
      error: 'bg-red-500',
      errorText: 'text-red-600',
      errorLight: 'bg-red-100',
      success: 'bg-green-500',
      successText: 'text-green-600',
      successLight: 'bg-green-100',
    },
    dark: {
      primary: 'bg-indigo-600',
      primaryHover: 'hover:bg-indigo-700',
      primaryText: 'text-indigo-400',
      primaryLight: 'bg-indigo-900/50',
      primaryLightHover: 'hover:bg-indigo-800',
      secondary: 'bg-violet-600',
      secondaryText: 'text-violet-400',
      secondaryLight: 'bg-violet-900/50',
      accent: 'bg-teal-600',
      accentText: 'text-teal-400',
      accentLight: 'bg-teal-900/50',
      highlight: 'bg-amber-500',
      highlightText: 'text-amber-400',
      highlightLight: 'bg-amber-900/50',
      background: 'bg-gray-900',
      error: 'bg-red-500',
      errorText: 'text-red-400',
      errorLight: 'bg-red-900/50',
      success: 'bg-emerald-500',
      successText: 'text-emerald-400',
      successLight: 'bg-emerald-900/50',
    },
    mint: {
      primary: 'bg-teal-600',
      primaryHover: 'hover:bg-teal-700',
      primaryText: 'text-teal-600',
      primaryLight: 'bg-teal-100',
      primaryLightHover: 'hover:bg-teal-200',
      secondary: 'bg-cyan-600',
      secondaryText: 'text-cyan-600',
      secondaryLight: 'bg-cyan-100',
      accent: 'bg-emerald-600',
      accentText: 'text-emerald-600',
      accentLight: 'bg-emerald-100',
      highlight: 'bg-yellow-400',
      highlightText: 'text-yellow-600',
      highlightLight: 'bg-yellow-100',
      background: 'bg-teal-50',
      error: 'bg-red-500',
      errorText: 'text-red-600',
      errorLight: 'bg-red-100',
      success: 'bg-emerald-500',
      successText: 'text-emerald-600',
      successLight: 'bg-emerald-100',
    }
  };
  
  const currentTheme = themes[theme];
  
  const steps = [
    { id: 'request', title: 'API Request', icon: <Globe className="h-5 w-5" /> },
    { id: 'policy', title: 'Policy Summary', icon: <Lock className="h-5 w-5" /> },
    { id: 'decision', title: 'Authorization Decision', icon: <Shield className="h-5 w-5" /> },
    { id: 'response', title: 'API Response', icon: <Server className="h-5 w-5" /> }
  ];
  
  const users = [
    { id: 1, name: 'Michael Chen', role: 'Administrator', permissions: ['READ', 'WRITE', 'DELETE', 'CREATE', 'UPDATE'] },
    { id: 2, name: 'Sarah Johnson', role: 'User', permissions: ['READ'] },
    { id: 3, name: 'Raj Patel', role: 'Finance', permissions: ['READ', 'WRITE', 'CREATE', 'UPDATE'] }
  ];
  
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [selectedResource, setSelectedResource] = useState('customer-data');
  const [selectedActions, setSelectedActions] = useState(['READ']);
  
  // Animation for transitions
  useEffect(() => {
    setAnimationPlaying(true);
    const timer = setTimeout(() => {
      setAnimationPlaying(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [activeStep]);
  
  // Toggle selection of an action
  const toggleAction = (action) => {
    if (selectedActions.includes(action)) {
      if (selectedActions.length > 1) {
        setSelectedActions(selectedActions.filter(a => a !== action));
      }
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };
  
  const resources = [
    { id: 'customer-data', name: 'Customer Data', icon: <Users size={20} /> },
    { id: 'financial-records', name: 'Financial Records', icon: <Database size={20} /> },
    { id: 'system-settings', name: 'System Settings', icon: <Server size={20} /> }
  ];
  
  const actions = ['READ', 'WRITE', 'DELETE', 'CREATE', 'UPDATE'];
  
  // Evaluate access based on user role, permissions and selected resource
  const evaluateAccess = () => {
    const permissionResults = selectedActions.map(action => {
      const hasPermission = selectedUser.permissions.includes(action);
      
      let allowed = hasPermission;
      
      if (selectedResource === 'financial-records' && selectedUser.role !== 'Finance' && selectedUser.role !== 'Administrator') {
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
  
  // Handle navigation between steps
  const handleNext = () => {
    if (activeStep === 1) {
      evaluateAccess();
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setActiveStep(0);
      setShowDecision(false);
      setAuthorization(null);
    }
  };
  
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      if (activeStep === 3) {
        setShowDecision(true);
      } else if (activeStep === 2) {
        setShowDecision(false);
      }
    }
  };
  
  // Toggle theme
  const toggleTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };
  
  // Format time for API response
  const getRandomResponseTime = () => Math.floor(Math.random() * 100) + 20;
  
  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : currentTheme.background} p-4 transition-colors duration-500`}>
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100'} transition-all duration-300`}
        >
          <RefreshCw size={18} className="animate-spin-slow" />
        </button>
      </div>
      
      <div className="text-center mb-8 transform transition-all duration-500 hover:scale-105">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : `text-${theme}-800`} flex items-center justify-center`}>
          <Shield className={`mr-3 h-8 w-8 ${currentTheme.primaryText}`} />
          API Policies and Authorization
        </h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
          A visual demonstration of modern API authorization flow
        </p>
      </div>
      
      {/* Progress steps */}
      <div className="mb-8 w-full">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className={`flex flex-col items-center transition-all duration-300 ${index === activeStep ? 'transform scale-110' : ''}`}>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                index === activeStep ? currentTheme.primary + ' text-white shadow-lg shadow-' + theme + '-500/50' : 
                index < activeStep ? currentTheme.success + ' text-white' : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                {index < activeStep ? (
                  <Check size={24} className="animate-scale-check" />
                ) : (
                  <div className="flex items-center justify-center">
                    {index === activeStep ? (
                      <span className="animate-pulse">{steps[index].icon}</span>
                    ) : (
                      <span>{steps[index].icon}</span>
                    )}
                  </div>
                )}
              </div>
              <div className={`text-sm mt-2 text-center ${index === activeStep ? (theme === 'dark' ? 'text-white font-medium' : 'font-medium') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}>
                {step.title}
              </div>
              
              {/* Progress line connecting steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-0 right-0" style={{ top: '2.5rem' }}>
                  <div className={`h-1 ${index < activeStep ? currentTheme.success : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} transition-all duration-500`} 
                      style={{width: '100%', marginLeft: '3rem'}}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className={`${theme === 'dark' ? 'bg-gray-800 shadow-lg shadow-black/20' : 'bg-white shadow-lg'} rounded-lg p-6 mb-6 flex-grow border ${theme === 'dark' ? 'border-gray-700' : 'border-' + theme + '-100'} transition-all duration-500 ${animationPlaying ? 'animate-fade-in' : ''}`}>
        {activeStep === 0 && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
              <User className={`mr-2 h-6 w-6 ${currentTheme.primaryText}`} />
              Configure API Request
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* User selection panel */}
              <div className={`${theme === 'dark' ? 'bg-gray-900/50' : currentTheme.primaryLight} p-4 rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-' + theme + '-200'} border shadow-sm transition-all duration-300 transform hover:scale-102 hover:shadow-md`}>
                <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-' + theme + '-800'} mb-3 flex items-center`}>
                  <User className="mr-2 h-5 w-5" />
                  Select User
                </h3>
                <div className="space-y-2">
                  {users.map(user => (
                    <div 
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`cursor-pointer p-3 rounded transition-all duration-300 ${
                        selectedUser.id === user.id ? 
                        (theme === 'dark' ? 
                          `${currentTheme.primaryLight} border-l-4 border-${theme}-500 shadow-sm` : 
                          `${currentTheme.primaryLight} border-l-4 border-${theme}-600 shadow-sm`
                        ) : 
                        (theme === 'dark' ? 
                          'bg-gray-800 hover:bg-gray-700' : 
                          'bg-white hover:bg-gray-50'
                        )
                      } ${selectedUser.id === user.id ? 'transform -translate-y-1' : ''}`}
                    >
                      <div className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>{user.name}</div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Role: <span className="font-medium">{user.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Resource selection panel */}
              <div className={`${theme === 'dark' ? 'bg-gray-900/50' : currentTheme.secondaryLight} p-4 rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-' + theme + '-200'} border shadow-sm transition-all duration-300 transform hover:scale-102 hover:shadow-md`}>
                <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-' + theme + '-800'} mb-3 flex items-center`}>
                  <Database className="mr-2 h-5 w-5" />
                  Select Resource
                </h3>
                <div className="space-y-2">
                  {resources.map(resource => (
                    <div 
                      key={resource.id}
                      onClick={() => setSelectedResource(resource.id)}
                      className={`cursor-pointer p-3 rounded flex items-center transition-all duration-300 ${
                        selectedResource === resource.id ? 
                        (theme === 'dark' ? 
                          `${currentTheme.secondaryLight} border-l-4 border-${theme}-500 shadow-sm` : 
                          `${currentTheme.secondaryLight} border-l-4 border-${theme}-600 shadow-sm`
                        ) : 
                        (theme === 'dark' ? 
                          'bg-gray-800 hover:bg-gray-700' : 
                          'bg-white hover:bg-gray-50'
                        )
                      } ${selectedResource === resource.id ? 'transform -translate-y-1' : ''}`}
                    >
                      <div className={`mr-2 ${currentTheme.secondaryText}`}>{resource.icon}</div>
                      <div className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>{resource.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions selection panel */}
              <div className={`${theme === 'dark' ? 'bg-gray-900/50' : currentTheme.accentLight} p-4 rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-' + theme + '-200'} border shadow-sm transition-all duration-300 transform hover:scale-102 hover:shadow-md`}>
                <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-' + theme + '-800'} mb-3 flex items-center`}>
                  <Key className="mr-2 h-5 w-5" />
                  Select Actions (Multiple)
                </h3>
                <div className="space-y-2">
                  {actions.map(action => (
                    <div 
                      key={action}
                      onClick={() => toggleAction(action)}
                      className={`cursor-pointer p-3 rounded flex items-center transition-all duration-300 ${
                        selectedActions.includes(action) ? 
                        (theme === 'dark' ? 
                          `${currentTheme.accentLight} border-l-4 border-${theme}-500 shadow-sm` : 
                          `${currentTheme.accentLight} border-l-4 border-${theme}-600 shadow-sm`
                        ) : 
                        (theme === 'dark' ? 
                          'bg-gray-800 hover:bg-gray-700' : 
                          'bg-white hover:bg-gray-50'
                        )
                      } ${selectedActions.includes(action) ? 'transform -translate-y-1' : ''}`}
                    >
                      <div className={`w-5 h-5 rounded border mr-2 flex items-center justify-center transition-all duration-300 ${
                        selectedActions.includes(action) ? 
                        (theme === 'dark' ? 
                          `${currentTheme.accent} border-${theme}-400` : 
                          `${currentTheme.accent} border-${theme}-600`
                        ) : 
                        (theme === 'dark' ? 
                          'border-gray-600' : 
                          'border-gray-400'
                        )
                      }`}>
                        {selectedActions.includes(action) && (
                          <Check className="h-4 w-4 text-white animate-scale-check" />
                        )}
                      </div>
                      <div className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>{action}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* API Request Preview */}
            <div className={`mt-4 p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border shadow-sm transition-all duration-300 transform hover:scale-102`}>
              <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                <Globe className={`mr-2 h-5 w-5 ${currentTheme.primaryText}`} />
                API Request Preview:
              </h3>
              <pre className={`${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-900'} ${theme === 'dark' ? 'text-green-400' : 'text-green-400'} p-4 rounded-lg overflow-x-auto text-sm shadow-inner`}>
{`GET /api/${selectedResource}
Authorization: Bearer jwt.token.here
X-User-ID: ${selectedUser.id}
X-Actions: ${selectedActions.join(',')}`}
              </pre>
            </div>
          </div>
        )}
        
        {activeStep === 1 && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
              <Lock className={`mr-2 h-6 w-6 ${currentTheme.primaryText}`} />
              Policy Summary
            </h2>
            
            {/* Policy visualization */}
            <div className="flex items-center justify-center my-8">
              <div className="relative">
                <div className={`w-72 h-72 rounded-full ${theme === 'dark' ? 'bg-gray-800' : currentTheme.primaryLight} flex items-center justify-center shadow-lg transition-all duration-500 animate-pulse-slow`}>
                  <div className={`w-56 h-56 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-' + theme + '-200'} flex items-center justify-center transition-all duration-500`}>
                    <div className={`w-40 h-40 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-' + theme + '-300'} flex items-center justify-center transition-all duration-500`}>
                      <Lock className={`h-20 w-20 ${theme === 'dark' ? 'text-' + theme + '-400' : 'text-' + theme + '-800'} animate-pulse`} />
                    </div>
                  </div>
                </div>
                
                {/* User card */}
                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'border-gray-700' : 'border-' + theme + '-200'} border transition-all duration-300 hover:scale-110 hover:shadow-xl`}>
                  <div className="flex items-center text-sm">
                    <User className={`mr-2 h-5 w-5 ${currentTheme.primaryText}`} />
                    <span className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>
                      User: <strong>{selectedUser.name}</strong>
                    </span>
                  </div>
                </div>
                
                {/* Actions card */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'border-gray-700' : 'border-' + theme + '-200'} border transition-all duration-300 hover:scale-110 hover:shadow-xl`}>
                  <div className="flex items-center text-sm">
                    <Key className={`mr-2 h-5 w-5 ${currentTheme.accentText}`} />
                    <span className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>
                      Actions: <strong>{selectedActions.join(', ')}</strong>
                    </span>
                  </div>
                </div>
                
                {/* Resource card */}
                <div className={`absolute left-0 top-1/2 transform -translate-x-3/4 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'border-gray-700' : 'border-' + theme + '-200'} border transition-all duration-300 hover:scale-110 hover:shadow-xl`}>
                  <div className="flex items-center text-sm">
                    <Database className={`mr-2 h-5 w-5 ${currentTheme.secondaryText}`} />
                    <span className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>
                      Resource: <strong>{selectedResource}</strong>
                    </span>
                  </div>
                </div>
                
                {/* Role card */}
                <div className={`absolute right-0 top-1/2 transform translate-x-3/4 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'border-gray-700' : 'border-' + theme + '-200'} border transition-all duration-300 hover:scale-110 hover:shadow-xl`}>
                  <div className="flex items-center text-sm">
                    <Shield className={`mr-2 h-5 w-5 ${currentTheme.errorText}`} />
                    <span className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>
                      Role: <strong>{selectedUser.role}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Policy rules */}
            <div className={`mt-6 p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border shadow-md transition-all duration-300`}>
              <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3 flex items-center`}>
                <Shield className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-' + theme + '-400' : 'text-' + theme + '-700'}`} />
                Policy Rules Applied:
              </h3>
              <div className="space-y-3 max-w-3xl mx-auto">
                {/* User permissions rule */}
                <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} border flex items-center shadow-sm transition-all duration-300 transform hover:scale-102 hover:shadow-md`}>
                  <div className={`mr-3 ${currentTheme.secondaryText} ${theme === 'dark' ? 'bg-' + theme + '-900/50' : 'bg-' + theme + '-100'} p-2 rounded-full`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div className={`text-sm ${theme === 'dark' && 'text-gray-300'}`}>
                    User <strong>{selectedUser.name}</strong> has role <strong>{selectedUser.role}</strong> with permissions: <strong>{selectedUser.permissions.join(', ')}</strong>
                  </div>
                </div>
                
                {/* Selected actions rule */}
                <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} border flex items-center shadow-sm transition-all duration-300 transform hover:scale-102 hover:shadow-md`}>
                  <div className={`mr-3 ${currentTheme.accentText} ${theme === 'dark' ? 'bg-' + theme + '-900/50' : 'bg-' + theme + '-100'} p-2 rounded-full`}>
                    <Key className="h-5 w-5" />
                  </div>
                  <div className={`text-sm ${theme === 'dark' && 'text-gray-300'}`}>
                    Selected actions: <strong>{selectedActions.join(', ')}</strong>
                  </div>
                </div>
                
                {/* Resource rule */}
                <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} border flex items-center shadow-sm transition-all duration-300 transform hover:scale-102 hover:shadow-md`}>
                  <div className={`mr-3 ${currentTheme.secondaryText} ${theme === 'dark' ? 'bg-' + theme + '-900/50' : 'bg-' + theme + '-100'} p-2 rounded-full`}>
                    <Database className="h-5 w-5" />
                  </div>
                  <div className={`text-sm ${theme === 'dark' && 'text-gray-300'}`}>
                    Resource <strong>{selectedResource}</strong> requires specific roles for access
                  </div>
                </div>
                
                {/* Special rules */}
                {selectedResource === 'financial-records' && (
                  <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg ${theme === 'dark' ? 'border-red-900' : 'border-red-100'} border flex items-center shadow-sm transition-all duration-300 transform hover:scale-102 hover:shadow-md animate-highlight-once`}>
                    <div className={`mr-3 ${currentTheme.errorText} ${theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100'} p-2 rounded-full`}>
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                      <strong>Special Policy:</strong> Financial Records require Finance or Administrator role
                    </div>
                  </div>
                )}
