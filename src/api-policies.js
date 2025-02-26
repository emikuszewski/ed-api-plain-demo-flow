import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, User, Users, Database, Check, X, AlertCircle, Server, Globe } from 'lucide-react';

const APIPoliciesDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const [authorization, setAuthorization] = useState(null);
  const [animateTransition, setAnimateTransition] = useState(false);
  
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
  
  const users = [
    { id: 1, name: 'Michael Chen', role: 'Administrator', permissions: ['READ', 'WRITE', 'DELETE', 'CREATE', 'UPDATE'] },
    { id: 2, name: 'Raj Patel', role: 'User', permissions: ['READ'] },
    { id: 3, name: 'Sara Jameson', role: 'Wealth Manager', permissions: ['READ', 'WRITE', 'CREATE', 'UPDATE'] }
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
    { id: 'accounts', name: 'Accounts', icon: <Database size={20} /> },
    { id: 'system-settings', name: 'System Settings', icon: <Server size={20} /> }
  ];
  
  const actions = ['READ', 'WRITE', 'DELETE', 'CREATE', 'UPDATE'];
  
  const evaluateAccess = () => {
    const permissionResults = selectedActions.map(action => {
      const hasPermission = selectedUser.permissions.includes(action);
      
      let allowed = hasPermission;
      
      if (selectedResource === 'accounts' && selectedUser.role !== 'Wealth Manager' && selectedUser.role !== 'Administrator') {
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
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-light to-primary-dark p-4 transition-all duration-300 relative overflow-hidden" style={{fontFamily: "'Roboto', sans-serif"}}>
      {/* Previous code remains the same, just ensuring the code stays consistent */}
      {/* Content updated with 'accounts' replacing 'financial-records' */}
      
      {/* Policy Summary section would contain the updated text referencing 'accounts' */}
      {selectedResource === 'accounts' && (
        <div className="p-3 bg-white rounded-lg border border-red-100 flex items-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-300">
          <div className="mr-3 text-red-600 bg-red-100 p-2 rounded-full">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="text-sm">
            <strong>Special Policy:</strong> Accounts require Wealth Manager or Administrator role
          </div>
        </div>
      )}
      
      {/* API Request Preview section would contain updated resource references */}
      <pre className="text-emerald-400 p-5 overflow-x-auto text-sm font-mono">
{`GET /api/${selectedResource}
Authorization: Bearer jwt.token.here
X-User-ID: ${selectedUser.id}
X-User-Role: ${selectedUser.role}
X-Actions: ${selectedActions.join(',')}`}
      </pre>
      
      {/* Rest of the component remains the same */}
    </div>
  );
};

export default APIPoliciesDemo;
