import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, User, Users, Database, Check, X, AlertCircle, Server, Globe } from 'lucide-react';

const APIPoliciesDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const [authorization, setAuthorization] = useState(null);
  const [animateTransition, setAnimateTransition] = useState(false);
  
  // Modern color palette
  const colors = {
    primary: {
      light: '#EEF2FF', // indigo-50
      medium: '#818CF8', // indigo-400
      default: '#4F46E5', // indigo-600
      dark: '#3730A3', // indigo-800
    },
    secondary: {
      light: '#F5F3FF', // violet-50
      medium: '#A78BFA', // violet-400
      default: '#7C3AED', // violet-600
      dark: '#5B21B6', // violet-800
    },
    success: {
      light: '#ECFDF5', // emerald-50
      medium: '#34D399', // emerald-400
      default: '#10B981', // emerald-500
      dark: '#065F46', // emerald-800
    },
    danger: {
      light: '#FEF2F2', // red-50
      medium: '#F87171', // red-400
      default: '#EF4444', // red-500
      dark: '#991B1B', // red-800
    },
    neutral: {
      light: '#F8FAFC', // slate-50
      medium: '#94A3B8', // slate-400
      default: '#64748B', // slate-500
      dark: '#1E293B', // slate-800
    }
  };
  
  const steps = [
    { id: 'request', title: 'API Request' },
    { id: 'policy', title: 'Policy Summary' },
    { id: 'decision', title: 'Authorization Decision' },
    { id: 'response', title: 'API Response' }
  ];
  
  const users = [
    { id: 1, name: 'Michael Chen', role: 'Administrator', permissions: ['READ', 'WRITE', 'DELETE', 'CREATE', 'UPDATE'] },
    { id: 2, name: 'Raj Patel', role: 'User', permissions: ['READ'] },
    { id: 3, name: 'Sara Jameson (Wealth Manager)', role: 'Finance', permissions: ['READ', 'WRITE', 'CREATE', 'UPDATE'] }
  ];
  
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [selectedResource, setSelectedResource] = useState('customer-data');
  const [selectedActions, setSelectedActions] = useState(['READ']);
  
  useEffect(() => {
    // Add transition animation when changing steps
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
  
  const resources = [
    { id: 'customer-data', name: 'Customer Data', icon: <Users size={20} /> },
    { id: 'financial-records', name: 'Financial Records', icon: <Database size={20} /> },
    { id: 'system-settings', name: 'System Settings', icon: <Server size={20} /> }
  ];
  
  const actions = ['READ', 'WRITE', 'DELETE', 'CREATE', 'UPDATE'];
  
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
  
  const handleNext = () => {
    setAnimateTransition(true);
    
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
    setAnimateTransition(true);
    
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      if (activeStep === 3) {
        setShowDecision(true);
      } else if (activeStep === 2) {
        setShowDecision(false);
      }
    }
  };

  // Get the background color based on step index  
  const getStepBgColor = (index) => {
    if (index === activeStep) return colors.primary.default;
    if (index < activeStep) return colors.success.default;
    return colors.neutral.medium;
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 transition-all duration-300">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 flex items-center justify-center">
          <Shield className="mr-3 h-8 w-8 text-indigo-600" />
          API Policies and Authorization
        </h1>
        <p className="text-slate-600 mt-2">A visual API authorization flow for a Wealth Management firm</p>
      </div>
      
      {/* Improved progress steps */}
      <div className="mb-8 w-full">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`h-12 w-12 rounded-full flex items-center justify-center shadow-md transform transition-all duration-300 ease-in-out ${
                  index === activeStep ? 'scale-110' : ''
                }`}
                style={{ 
                  backgroundColor: getStepBgColor(index),
                  color: index <= activeStep ? 'white' : 'rgb(30, 41, 59)',
                  boxShadow: index === activeStep ? '0 0 15px rgba(79, 70, 229, 0.5)' : ''
                }}
              >
                {index < activeStep ? (
                  <Check size={24} />
                ) : (
                  <span style={{ fontSize: "20px" }}>{index + 1}</span>
                )}
              </div>
              
              {/* Progress connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute h-0.5 bg-gray-200 w-full" 
                  style={{ 
                    left: `calc(${(index * 100) / (steps.length - 1)}% - 10%)`,
                    width: '20%',
                    top: '6%',
                    zIndex: 0 
                  }}>
                  <div className="h-full transition-all duration-500 ease-in-out"
                    style={{ 
                      width: index < activeStep ? '100%' : '0%',
                      backgroundColor: colors.success.default 
                    }}></div>
                </div>
              )}
              
              <div className="text-sm mt-2 text-center font-medium text-slate-700">{step.title}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div 
        className={`bg-white rounded-xl shadow-xl p-6 mb-6 flex-grow border border-indigo-100 transition-all duration-500 ease-in-out ${
          animateTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {activeStep === 0 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <User className="mr-2 h-6 w-6 text-indigo-600" />
              Configure API Request
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="font-medium text-indigo-800 mb-3 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Select User
                </h3>
                <div className="space-y-2">
                  {users.map(user => (
                    <div 
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`cursor-pointer p-3 rounded-lg transition-all duration-300 transform ${
                        selectedUser.id === user.id 
                          ? 'bg-indigo-200 border-l-4 border-indigo-600 shadow-md translate-x-1' 
                          : 'bg-white hover:bg-indigo-100 hover:translate-x-1'
                      }`}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-slate-600">Role: <span className="font-medium">{user.role}</span></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-violet-50 p-4 rounded-xl border border-violet-200 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="font-medium text-violet-800 mb-3 flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Select Resource
                </h3>
                <div className="space-y-2">
                  {resources.map(resource => (
                    <div 
                      key={resource.id}
                      onClick={() => setSelectedResource(resource.id)}
                      className={`cursor-pointer p-3 rounded-lg flex items-center transition-all duration-300 transform ${
                        selectedResource === resource.id 
                          ? 'bg-violet-200 border-l-4 border-violet-600 shadow-md translate-x-1' 
                          : 'bg-white hover:bg-violet-100 hover:translate-x-1'
                      }`}
                    >
                      <div className="mr-2 text-violet-700">{resource.icon}</div>
                      <div className="font-medium">{resource.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="font-medium text-emerald-800 mb-3 flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  Select Actions (Multiple)
                </h3>
                <div className="space-y-2">
                  {actions.map(action => (
                    <div 
                      key={action}
                      onClick={() => toggleAction(action)}
                      className={`cursor-pointer p-3 rounded-lg flex items-center transition-all duration-300 transform ${
                        selectedActions.includes(action) 
                          ? 'bg-emerald-200 border-l-4 border-emerald-600 shadow-md translate-x-1' 
                          : 'bg-white hover:bg-emerald-100 hover:translate-x-1'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border mr-2 flex items-center justify-center transition-all duration-300 ${
                        selectedActions.includes(action) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-400'
                      }`}>
                        {selectedActions.includes(action) && <Check className="h-4 w-4 text-white" />}
                      </div>
                      <div className="font-medium">{action}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md">
              <h3 className="font-medium text-slate-700 mb-2 flex items-center">
                <Globe className="mr-2 h-5 w-5 text-indigo-600" />
                API Request Preview:
              </h3>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg overflow-x-auto text-sm shadow-inner">
{`GET /api/${selectedResource}
Authorization: Bearer jwt.token.here
X-User-ID: ${selectedUser.id}
X-Actions: ${selectedActions.join(',')}`}
              </pre>
            </div>
          </div>
        )}
        
        {activeStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Lock className="mr-2 h-6 w-6 text-indigo-600" />
              Policy Summary
            </h2>
            
            <div className="flex items-center justify-center my-8">
              <div className="relative">
                <div className="w-72 h-72 rounded-full bg-indigo-100 flex items-center justify-center shadow-lg transition-all duration-500 transform hover:scale-105">
                  <div className="w-56 h-56 rounded-full bg-indigo-200 flex items-center justify-center transition-all duration-500">
                    <div className="w-40 h-40 rounded-full bg-indigo-300 flex items-center justify-center transition-all duration-500">
                      <Lock className="h-20 w-20 text-indigo-800 animate-pulse" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg border border-indigo-200 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-5 w-5 text-indigo-600" />
                    <span className="font-medium">User: <strong>{selectedUser.name}</strong></span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white p-3 rounded-lg shadow-lg border border-indigo-200 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center text-sm">
                    <Key className="mr-2 h-5 w-5 text-emerald-600" />
                    <span className="font-medium">Actions: <strong>{selectedActions.join(', ')}</strong></span>
                  </div>
                </div>
                
                <div className="absolute left-0 top-1/2 transform -translate-x-3/4 -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg border border-indigo-200 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center text-sm">
                    <Database className="mr-2 h-5 w-5 text-violet-600" />
                    <span className="font-medium">Resource: <strong>{selectedResource}</strong></span>
                  </div>
                </div>
                
                <div className="absolute right-0 top-1/2 transform translate-x-3/4 -translate-y-1/2 bg-white p-3 rounded-lg shadow-lg border border-indigo-200 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center text-sm">
                    <Shield className="mr-2 h-5 w-5 text-red-600" />
                    <span className="font-medium">Role: <strong>{selectedUser.role}</strong></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-md transition-all duration-300 hover:shadow-lg">
              <h3 className="font-medium text-slate-700 mb-3 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-indigo-700" />
                Policy Rules Applied:
              </h3>
              <div className="space-y-3 max-w-3xl mx-auto">
                <div className="p-3 bg-white rounded-lg border border-slate-100 flex items-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200">
                  <div className="mr-3 text-violet-600 bg-violet-100 p-2 rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="text-sm">
                    User <strong>{selectedUser.name}</strong> has role <strong>{selectedUser.role}</strong> with permissions: <strong>{selectedUser.permissions.join(', ')}</strong>
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
                
                {selectedResource === 'financial-records' && (
                  <div className="p-3 bg-white rounded-lg border border-red-100 flex items-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-300">
                    <div className="mr-3 text-red-600 bg-red-100 p-2 rounded-full">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="text-sm">
                      <strong>Special Policy:</strong> Financial Records require Finance or Administrator role
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
              <Shield className="mr-2 h-6 w-6 text-indigo-600" />
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
                      `${selectedUser.name} is authorized to perform all requested actions on ${selectedResource}` :
                      `${selectedUser.name} is not authorized to perform all requested actions on ${selectedResource}`
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
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <Server className="mr-2 h-6 w-6 text-indigo-600" />
              API Response
            </h2>
            
            <div className="flex justify-center">
              <div className="max-w-2xl w-full space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-110">
                    <Globe className="h-10 w-10 text-indigo-600" />
                  </div>
                  <div className="flex-grow relative">
                    <div className="h-3 bg-indigo-200 rounded-full shadow-inner overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-in-out ${
                          authorization?.overall ? 'bg-indigo-600 w-full' : 'bg-red-500 w-1/4'
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
                      <div className="text-sm font-medium bg-indigo-50 p-2 rounded transition-all duration-300 hover:bg-indigo-100">{selectedUser.name}</div>
                      
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
      
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          className={`px-5 py-2 rounded-lg shadow flex items-center transition-all duration-300 ${
            activeStep === 0 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 hover:shadow-md'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 hover:shadow-lg flex items-center transition-all duration-300 transform hover:translate-y-[-2px]"
        >
          {activeStep === steps.length - 1 ? 'Restart Flow' : 'Next Step'}
          {activeStep !== steps.length - 1 && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default APIPoliciesDemo;
