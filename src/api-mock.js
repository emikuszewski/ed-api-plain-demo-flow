// Mock data for testing or fallback if API is unavailable
export const mockUsers = [
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

export const mockActions = ['READ', 'WRITE', 'DELETE', 'CREATE', 'UPDATE', 'APPROVE', 'REJECT'];

// Mock API fetch functions
export const fetchMockUsers = () => {
  return Promise.resolve(mockUsers);
};

export const fetchMockActions = () => {
  return Promise.resolve(mockActions);
};
