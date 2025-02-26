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
  ArrowRight,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

const APIPoliciesDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const [authorization, setAuthorization] = useState(null);
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [theme, setTheme] = useState('blue');
  
  // Define theme styles
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
      primaryLight: 'bg-indigo-900',
      primaryLightHover: 'hover:bg-indigo-800',
      secondary: 'bg-violet-600',
      secondaryText: 'text-violet-400',
      secondaryLight: 'bg-violet-900',
      accent: 'bg-teal-600',
      accentText: 'text-teal-400',
      accentLight: 'bg-teal-900',
      background: 'bg-gray-900',
      error: 'bg-red-500',
      errorText: 'text-red-400',
      errorLight: 'bg-red-900',
      success: 'bg-emerald-500',
      successText: 'text-emerald-400',
      successLight: 'bg-emerald-900',
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
          <RefreshCw size={18} />
        </button>
      </div>
      
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-blue-800'} flex items-center justify-center`}>
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
                index === activeStep ? currentTheme.primary + ' text-white shadow-lg' : 
                index < activeStep ? currentTheme.success + ' text-white' : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                {index < activeStep ? (
                  <Check size={24} />
                ) : (
                  <div className="flex items-center justify-center">
                    {index === activeStep ? (
                      <span>{steps[index].icon}</span>
                    ) : (
                      <span>{steps[index].icon}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeStep === 3 && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
              <Server className={`mr-2 h-6 w-6 ${currentTheme.primaryText}`} />
              API Response
            </h2>
            
            <div className="flex justify-center">
              <div className="max-w-2xl w-full space-y-4">
                {/* Network flow visualization */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800' : currentTheme.primaryLight} p-3 rounded-full shadow-md transition-all duration-300`}>
                    <Globe className={`h-10 w-10 ${currentTheme.primaryText}`} />
                  </div>
                  <div className="flex-grow relative">
                    <div className={`h-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-200'} rounded-full shadow-inner overflow-hidden`}>
                      <div className={`h-full rounded-full transition-all duration-1000 ${
                        authorization?.overall ? 
                          (theme === 'dark' ? currentTheme.primary + ' w-full' : 'bg-blue-600 w-full') : 
                          (theme === 'dark' ? currentTheme.error + ' w-1/4' : 'bg-red-500 w-1/4')
                      }`}></div>
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800' : currentTheme.secondaryLight} p-3 rounded-full shadow-md transition-all duration-300`}>
                    <Server className={`h-10 w-10 ${currentTheme.secondaryText}`} />
                  </div>
                </div>
                
                {/* Response code display */}
                <div className={`${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-900'} p-5 rounded-lg shadow-lg text-sm transition-all duration-500`}>
                  {authorization?.overall ? (
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="h-4 w-4 rounded-full bg-green-500 mr-3"></div>
                        <span className="text-green-400 font-medium">200 OK</span>
                      </div>
                      <pre className="text-green-300 mt-3 overflow-x-auto">
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
    "processing_time_ms": ${getRandomResponseTime()}
  }
}`}
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-3">
                        <div className="h-4 w-4 rounded-full bg-red-500 mr-3"></div>
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
                    </div>
                  )}
                </div>
                
                {/* Request summary */}
                <div className={`p-5 ${theme === 'dark' ? currentTheme.primaryLight : 'bg-blue-50'} rounded-lg border ${theme === 'dark' ? 'border-indigo-800' : 'border-blue-200'} shadow-md transition-all duration-300`}>
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-3 flex items-center`}>
                    <Server className={`mr-2 h-5 w-5 ${currentTheme.primaryText}`} />
                    Request Summary:
                  </h3>
                  <div className="space-y-3">
                    <div className={`grid grid-cols-2 gap-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm`}>
                      {/* Summary key-value pairs */}
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium`}>User:</div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'bg-indigo-900 text-gray-200' : 'bg-blue-50'} p-2 rounded transition-all duration-300`}>{selectedUser.name}</div>
                      
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Resource:</div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'bg-violet-900 text-gray-200' : 'bg-purple-50'} p-2 rounded transition-all duration-300`}>{selectedResource}</div>
                      
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Actions:</div>
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'bg-teal-900 text-gray-200' : 'bg-green-50'} p-2 rounded transition-all duration-300`}>{selectedActions.join(', ')}</div>
                      
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Decision:</div>
                      <div className={`text-sm font-medium p-2 rounded transition-all duration-300 ${
                        authorization?.overall ? 
                          (theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700') : 
                          (theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700')
                      }`}>
                        {authorization?.overall ? 'Authorized ✓' : 'Unauthorized ✗'}
                      </div>
                      
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Response Code:</div>
                      <div className={`text-sm font-medium p-2 rounded transition-all duration-300 ${
                        authorization?.overall ? 
                          (theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700') : 
                          (theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700')
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
                )}
              </div>
              <div className={`text-sm mt-2 text-center ${index === activeStep ? (theme === 'dark' ? 'text-white font-medium' : 'font-medium') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}>
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`${theme === 'dark' ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-lg'} rounded-lg p-6 mb-6 flex-grow border ${theme === 'dark' ? 'border-gray-700' : 'border-blue-100'} transition-all duration-500`}>
        {activeStep === 0 && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
              <User className={`mr-2 h-6 w-6 ${currentTheme.primaryText}`} />
              Configure API Request
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* User selection panel */}
              <div className={`${theme === 'dark' ? 'bg-gray-900' : currentTheme.primaryLight} p-4 rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'} border shadow-sm transition-all duration-300`}>
                <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-blue-800'} mb-3 flex items-center`}>
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
                          `${currentTheme.primaryLight} border-l-4 border-indigo-500 shadow-sm` : 
                          `${currentTheme.primaryLight} border-l-4 border-blue-600 shadow-sm`
                        ) : 
                        (theme === 'dark' ? 
                          'bg-gray-800 hover:bg-gray-700' : 
                          'bg-white hover:bg-gray-50'
                        )
                      }`}
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
              <div className={`${theme === 'dark' ? 'bg-gray-900' : currentTheme.secondaryLight} p-4 rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-purple-200'} border shadow-sm transition-all duration-300`}>
                <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-purple-800'} mb-3 flex items-center`}>
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
                          `${currentTheme.secondaryLight} border-l-4 border-violet-500 shadow-sm` : 
                          `${currentTheme.secondaryLight} border-l-4 border-purple-600 shadow-sm`
                        ) : 
                        (theme === 'dark' ? 
                          'bg-gray-800 hover:bg-gray-700' : 
                          'bg-white hover:bg-gray-50'
                        )
                      }`}
                    >
                      <div className={`mr-2 ${currentTheme.secondaryText}`}>{resource.icon}</div>
                      <div className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>{resource.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions selection panel */}
              <div className={`${theme === 'dark' ? 'bg-gray-900' : currentTheme.accentLight} p-4 rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-green-200'} border shadow-sm transition-all duration-300`}>
                <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-green-800'} mb-3 flex items-center`}>
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
                          `${currentTheme.accentLight} border-l-4 border-teal-500 shadow-sm` : 
                          `${currentTheme.accentLight} border-l-4 border-green-600 shadow-sm`
                        ) : 
                        (theme === 'dark' ? 
                          'bg-gray-800 hover:bg-gray-700' : 
                          'bg-white hover:bg-gray-50'
                        )
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border mr-2 flex items-center justify-center transition-all duration-300 ${
                        selectedActions.includes(action) ? 
                        (theme === 'dark' ? 
                          `${currentTheme.accent} border-teal-400` : 
                          `${currentTheme.accent} border-green-600`
                        ) : 
                        (theme === 'dark' ? 
                          'border-gray-600' : 
                          'border-gray-400'
                        )
                      }`}>
                        {selectedActions.includes(action) && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>{action}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* API Request Preview */}
            <div className={`mt-4 p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border shadow-sm transition-all duration-300`}>
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
                <div className={`w-72 h-72 rounded-full ${theme === 'dark' ? 'bg-gray-800' : currentTheme.primaryLight} flex items-center justify-center shadow-lg transition-all duration-500`}>
                  <div className={`w-56 h-56 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-200'} flex items-center justify-center transition-all duration-500`}>
                    <div className={`w-40 h-40 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-blue-300'} flex items-center justify-center transition-all duration-500`}>
                      <Lock className={`h-20 w-20 ${theme === 'dark' ? 'text-indigo-400' : 'text-blue-800'}`} />
                    </div>
                  </div>
                </div>
                
                {/* User card */}
                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'} border transition-all duration-300`}>
                  <div className="flex items-center text-sm">
                    <User className={`mr-2 h-5 w-5 ${currentTheme.primaryText}`} />
                    <span className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>
                      User: <strong>{selectedUser.name}</strong>
                    </span>
                  </div>
                </div>
                
                {/* Actions card */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'} border transition-all duration-300`}>
                  <div className="flex items-center text-sm">
                    <Key className={`mr-2 h-5 w-5 ${currentTheme.accentText}`} />
                    <span className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>
                      Actions: <strong>{selectedActions.join(', ')}</strong>
                    </span>
                  </div>
                </div>
                
                {/* Resource card */}
                <div className={`absolute left-0 top-1/2 transform -translate-x-3/4 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'} border transition-all duration-300`}>
                  <div className="flex items-center text-sm">
                    <Database className={`mr-2 h-5 w-5 ${currentTheme.secondaryText}`} />
                    <span className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>
                      Resource: <strong>{selectedResource}</strong>
                    </span>
                  </div>
                </div>
                
                {/* Role card */}
                <div className={`absolute right-0 top-1/2 transform translate-x-3/4 -translate-y-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'border-gray-700' : 'border-blue-200'} border transition-all duration-300`}>
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
                <Shield className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-blue-700'}`} />
                Policy Rules Applied:
              </h3>
              <div className="space-y-3 max-w-3xl mx-auto">
                {/* User permissions rule */}
                <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} border flex items-center shadow-sm transition-all duration-300`}>
                  <div className={`mr-3 ${currentTheme.secondaryText} ${theme === 'dark' ? 'bg-violet-900' : 'bg-purple-100'} p-2 rounded-full`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div className={`text-sm ${theme === 'dark' && 'text-gray-300'}`}>
                    User <strong>{selectedUser.name}</strong> has role <strong>{selectedUser.role}</strong> with permissions: <strong>{selectedUser.permissions.join(', ')}</strong>
                  </div>
                </div>
                
                {/* Selected actions rule */}
                <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} border flex items-center shadow-sm transition-all duration-300`}>
                  <div className={`mr-3 ${currentTheme.accentText} ${theme === 'dark' ? 'bg-teal-900' : 'bg-green-100'} p-2 rounded-full`}>
                    <Key className="h-5 w-5" />
                  </div>
                  <div className={`text-sm ${theme === 'dark' && 'text-gray-300'}`}>
                    Selected actions: <strong>{selectedActions.join(', ')}</strong>
                  </div>
                </div>
                
                {/* Resource rule */}
                <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} border flex items-center shadow-sm transition-all duration-300`}>
                  <div className={`mr-3 ${currentTheme.secondaryText} ${theme === 'dark' ? 'bg-violet-900' : 'bg-purple-100'} p-2 rounded-full`}>
                    <Database className="h-5 w-5" />
                  </div>
                  <div className={`text-sm ${theme === 'dark' && 'text-gray-300'}`}>
                    Resource <strong>{selectedResource}</strong> requires specific roles for access
                  </div>
                </div>
                
                {/* Special rules */}
                {selectedResource === 'financial-records' && (
                  <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg ${theme === 'dark' ? 'border-red-900' : 'border-red-100'} border flex items-center shadow-sm transition-all duration-300`}>
                    <div className={`mr-3 ${currentTheme.errorText} ${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'} p-2 rounded-full`}>
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                      <strong>Special Policy:</strong> Financial Records require Finance or Administrator role
                    </div>
                  </div>
                )}
                
                {selectedResource === 'system-settings' && (
                  <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg ${theme === 'dark' ? 'border-red-900' : 'border-red-100'} border flex items-center shadow-sm transition-all duration-300`}>
                    <div className={`mr-3 ${currentTheme.errorText} ${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'} p-2 rounded-full`}>
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                      <strong>Special Policy:</strong> System Settings require Administrator role
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeStep === 2 && (
          <div className="space-y-6">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
              <Shield className={`mr-2 h-6 w-6 ${currentTheme.primaryText}`} />
              Authorization Decision
            </h2>
            
            <div className="flex items-center justify-center py-10">
              {showDecision && (
                <div className={`flex flex-col items-center p-8 rounded-lg ${
                  authorization?.overall ? 
                    (theme === 'dark' ? currentTheme.successLight : 'bg-green-50') : 
                    (theme === 'dark' ? currentTheme.errorLight : 'bg-red-50')
                } border-2 ${
                  authorization?.overall ? 
                    (theme === 'dark' ? 'border-green-700' : 'border-green-300') : 
                    (theme === 'dark' ? 'border-red-700' : 'border-red-300')
                } shadow-lg max-w-2xl w-full transition-all duration-500`}>
                  <div className={`rounded-full p-5 ${
                    authorization?.overall ? 
                      (theme === 'dark' ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-700') : 
                      (theme === 'dark' ? 'bg-red-700 text-red-200' : 'bg-red-200 text-red-700')
                  } shadow-md transition-all duration-500`}>
                    {authorization?.overall ? 
                      <Check className="h-16 w-16" /> : 
                      <X className="h-16 w-16" />
                    }
                  </div>
                  <h3 className={`text-xl font-bold mt-4 ${
                    authorization?.overall ? 
                      (theme === 'dark' ? 'text-green-400' : 'text-green-800') : 
                      (theme === 'dark' ? 'text-red-400' : 'text-red-800')
                  }`}>
                    {authorization?.overall ? 'Access Granted' : 'Access Denied'}
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-2 text-center max-w-md`}>
                    {authorization?.overall ? 
                      `${selectedUser.name} is authorized to perform all requested actions on ${selectedResource}` :
                      `${selectedUser.name} is not authorized to perform all requested actions on ${selectedResource}`
                    }
                  </p>
                  
                  <div className="mt-6 w-full">
                    <h4 className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium mb-3 flex items-center`}>
                      <Database className={`mr-2 h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      Action Details:
                    </h4>
                    <div className="grid gap-3">
                      {authorization?.details.map((detail, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border transition-all duration-300 ${
                            detail.allowed ? 
                              (theme === 'dark' ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200') : 
                              (theme === 'dark' ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200')
                          } shadow-sm`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`mr-2 ${
                                detail.allowed ? 
                                  (theme === 'dark' ? 'text-green-400' : 'text-green-600') : 
                                  (theme === 'dark' ? 'text-red-400' : 'text-red-600')
                              }`}>
                                {detail.allowed ? 
                                  <Check className="h-5 w-5" /> : 
                                  <X className="h-5 w-5" />
                                }
                              </div>
                              <span className={`font-medium ${theme === 'dark' && 'text-gray-200'}`}>{detail.action}</span>
                            </div>
                            <span className={`text-sm font-medium ${
                              detail.allowed ? 
                                (theme === 'dark' ? 'text-green-400' : 'text-green-600') : 
                                (theme === 'dark' ? 'text-red-400' : 'text-red-600')
                            }`}>
                              {detail.allowed ? 'Allowed' : 'Denied'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`mt-4 p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg text-sm ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border w-full transition-all duration-300`}>
                    <pre className={`whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : ''}`}>
{`{
  "subject": "${selectedUser.name}",
  "role": "${selectedUser.role}",
  "resource": "${selectedResource}",
  "actions": ${JSON.stringify(selectedActions)},
  "overallAllowed": ${authorization?.overall},
  "details": ${JSON.stringify(authorization?.details, null, 2)},
  "timestamp": "${new Date().toISOString()}",
  "decision_id": "policy-${Math.random().toString(36).substring(2, 15)}"
}`}
                    </pre>
                  </div>
