import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTicket, 
  faBell, 
  faPlus, 
  faInbox,
  faClockRotateLeft,
  faUser,
  faUsers,
  faChartBar, 
  faCog,
  faShield,
  faUserTie,
  faCalendar,
  faPencil,
  faBook,
  faList,
  faUserCheck,
  faUndo,
  faRedo,
  faCopy,
  faScissors,
  faPaste,
  faEnvelope,
  faRobot,
  faXmark,
  faLock,
  faBan 
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { MyTickets } from './pages/MyTickets';
import { HistoryPage } from './pages/HistoryPage';
import { AllTicketsPage } from './pages/AllTicketsPage';
import LoginScreen from './screens/LoginScreen';

type UserRole = 'agent' | 'super-admin' | 'business-admin' | 'business-employee';

interface NavItem {
  id: string;
  label: string;
  icon: IconDefinition;
  roles: UserRole[];
  description: string; // Add description field
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { id: 'createTicket', label: 'New Ticket', icon: faPlus, roles: ['business-employee', 'agent'],
        description: 'Create a new support ticket' },
      { id: 'history', label: 'History', icon: faClockRotateLeft, roles: ['agent', 'super-admin', 'business-admin', 'business-employee'],
        description: 'View ticket history and past interactions' },
    ]
  },
  {
    title: 'Tickets',
    items: [
      { id: 'allTickets', label: 'All Tickets', icon: faInbox, roles: ['agent', 'super-admin', 'business-admin'],
        description: 'Overview of all tickets in the system' },
      { id: 'assignedTickets', label: 'Assigned to Me', icon: faUserCheck, roles: ['agent'],
        description: 'View tickets assigned to you' },
      { id: 'createdTickets', label: 'Created by Me', icon: faList, roles: ['business-employee', 'agent'],
        description: 'View tickets you have created' },
      { id: 'draftTickets', label: 'Drafts', icon: faPencil, roles: ['business-employee', 'agent'],
        description: 'Access your saved ticket drafts' },
      { id: 'ticketCalendar', label: 'Calendar', icon: faCalendar, roles: ['agent', 'super-admin', 'business-admin'],
        description: 'View tickets in calendar format' },
    ]
  },
  {
    title: 'Resources',
    items: [
      { id: 'howToGuides', label: 'How-To Guides', icon: faBook, roles: ['agent', 'super-admin', 'business-admin', 'business-employee'],
        description: 'Access guides and tutorials' },
    ]
  },
  {
    title: 'Team',
    items: [
      { id: 'teamOverview', label: 'Team Overview', icon: faUsers, roles: ['super-admin', 'business-admin'],
        description: 'View team performance and statistics' },
      { id: 'userManagement', label: 'User Management', icon: faUserTie, roles: ['super-admin', 'business-admin'],
        description: 'Manage user accounts and permissions' },
      { id: 'analytics', label: 'Analytics', icon: faChartBar, roles: ['super-admin', 'business-admin'],
        description: 'View analytics and reports' },
    ]
  },
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'Profile', icon: faUser, roles: ['agent', 'super-admin', 'business-admin', 'business-employee'],
        description: 'View and edit your profile' },
      { id: 'notifications', label: 'Notifications', icon: faBell, roles: ['agent', 'super-admin', 'business-admin', 'business-employee'],
        description: 'Manage your notifications' },
      { id: 'settings', label: 'Settings', icon: faCog, roles: ['agent', 'super-admin', 'business-admin', 'business-employee'],
        description: 'Adjust your settings' },
    ]
  },
  {
    title: 'Admin',
    items: [
      { id: 'adminPanel', label: 'Admin Panel', icon: faShield, roles: ['super-admin'],
        description: 'Access the admin panel' },
    ]
  }
] as const;

// Derive PageType from navigation item IDs
type PageType = typeof navSections[number]['items'][number]['id'];

// Utility function to get default page based on role
const getDefaultPage = (role: UserRole): PageType => {
  switch (role) {
    case 'business-employee':
      return 'createdTickets';
    case 'agent':
      return 'assignedTickets';
    case 'super-admin':
    case 'business-admin':
      return 'allTickets';
  }
};

interface UserCredentials {
  name: string;
  email: string;
  role: UserRole;
  licenseExpiry?: Date;
  businessName?: string;
}

const mockUser: UserCredentials = {
  name: 'John Smith',
  email: 'john@business.com',
  role: 'super-admin',
  licenseExpiry: new Date('2025-12-31'),
  businessName: 'Acme Corp'
};

interface LicenseStatus {
  isExpired: boolean;
  formattedDate: string;
}

const formatLicenseExpiry = (expiryDate: Date | undefined): LicenseStatus => {
  if (!expiryDate) {
    return {
      isExpired: false,
      formattedDate: 'No expiry date'
    };
  }

  const now = new Date();
  const diff = Math.floor((now.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = now > expiryDate;
  
  let formattedDate = '';
  if (diff === 0) formattedDate = 'today';
  else if (diff === 1) formattedDate = 'yesterday';
  else if (diff < 7) formattedDate = `${diff} days ago`;
  else if (diff < 14) formattedDate = 'a week ago';
  else formattedDate = expiryDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return {
    isExpired,
    formattedDate
  };
};

function App(): JSX.Element {
  const userRole: UserRole = 'super-admin';
  const [currentPage, setCurrentPage] = useState<PageType>(getDefaultPage(userRole));
  const [isOnline] = useState(true); // This should come from your actual online/offline detection logic
  const [hoverDescription, setHoverDescription] = useState<string>('');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add state for login status

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const isBusinessUser = mockUser.role === 'business-admin' || mockUser.role === 'business-employee';
  const licenseStatus = formatLicenseExpiry(mockUser.licenseExpiry);

  const isDisabled = isBusinessUser && licenseStatus.isExpired;

  const getCurrentPageTitle = (): string => {
    return navSections
      .flatMap(section => section.items)
      .find(item => item.id === currentPage)?.label ?? '';
  };

  const handleRenewLicense = (): void => {
    // Implement license renewal logic
    console.log('Renewing license...');
  };

  const handleNavClick = (pageId: PageType) => {
    if (isDisabled) return;
    setCurrentPage(pageId);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'myTickets':
        return <MyTickets/>;
      case 'createTicket':
        return <h2>Create New Ticket</h2>;
      case 'history':
        return <HistoryPage/>;
      case 'profile':
        return <h2>My Profile</h2>;
      case 'teamOverview':
        return <h2>Team Overview</h2>;
      case 'analytics':
        return <h2>Analytics Dashboard</h2>;
      case 'userManagement':
        return <h2>User Management</h2>;
      case 'settings':
        return <h2>Settings</h2>;
      case 'adminPanel':
        return <h2>Admin Panel</h2>;
      case 'search':
        return <h2>Search</h2>;
      case 'notifications':
        return <h2>Notifications</h2>;
      case 'allTickets':
        return <AllTicketsPage/>;
      case 'assignedTickets':
        return <h2>Tickets Assigned to Me</h2>;
      case 'createdTickets':
        return <h2>Tickets Created by Me</h2>;
      case 'draftTickets':
        return <h2>Draft Tickets</h2>;
      case 'ticketCalendar':
        return <h2>Ticket Calendar</h2>;
      case 'howToGuides':
        return <h2>How-To Guides</h2>;
      default:
        return <h2>Page not found</h2>;
    }
  };

  const handleLogin = (email: string, password: string) => {
    // Dummy login logic
    if (email === 'user@example.com' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid login credentials');
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`app-container ${isAIChatOpen ? 'with-ai-panel' : ''}`}>
      <header className="top-panel">
        <div className="header-left">
          <div className="user-credentials">
            <div className="user-avatar">{mockUser.name[0].toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{mockUser.name}</div>
            </div>
            <div className="page-title">{`/ ${getCurrentPageTitle()}`}</div>
            {isBusinessUser && licenseStatus.isExpired && (
              <div className="license-status">
                <button 
                  type="button"
                  className="license-badge"
                  title={`License expired ${licenseStatus.formattedDate}`}
                >
                  License Expired {licenseStatus.formattedDate}
                </button>
                <button 
                  type="button"
                  className="renew-button"
                  onClick={handleRenewLicense}
                  title="Click to renew your license"
                >
                  Renew
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="header-center">
          <div className="action-buttons">
            <button className="action-button" title="Undo">
              <FontAwesomeIcon icon={faUndo} />
            </button>
            <button className="action-button" title="Redo">
              <FontAwesomeIcon icon={faRedo} />
            </button>
            <div className="separator" />
            <button className="action-button" title="Copy">
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <button className="action-button" title="Cut">
              <FontAwesomeIcon icon={faScissors} />
            </button>
            <button className="action-button" title="Paste">
              <FontAwesomeIcon icon={faPaste} />
            </button>
            <div className="separator" />
            <button className="action-button" title="Email">
              <FontAwesomeIcon icon={faEnvelope} />
            </button>
          </div>
        </div>

        <div className="header-right">
          <button 
            className={`action-button ${isAIChatOpen ? 'active' : ''}`}
            onClick={() => setIsAIChatOpen(!isAIChatOpen)}
            title="AI Assistant"
          >
            <FontAwesomeIcon icon={faRobot} />
          </button>
        </div>
      </header>
      
      <aside className="left-panel">
        <nav className="nav-buttons">
          {navSections.map((section: NavSection) => {
            const filteredItems = section.items.filter((item: NavItem) => 
              item.roles.includes(userRole)
            );
            
            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="nav-section">
                <div className="nav-section-title">{section.title}</div>
                {filteredItems.map((item: NavItem) => (
                  <button 
                    key={item.id}
                    className={`nav-button ${currentPage === item.id ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                    onClick={() => handleNavClick(item.id as PageType)}
                    onMouseEnter={() => setHoverDescription(isDisabled ? 'License expired. Please renew to continue.' : item.description)}
                    onMouseLeave={() => setHoverDescription('')}
                  >
                    <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                    <span>{item.label}</span>
                    {isDisabled && <FontAwesomeIcon icon={faLock} className="lock-icon" />}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
      
      {isAIChatOpen && (
        <aside className={`ai-panel ${isDisabled ? 'locked' : ''}`}>
          <div className="ai-panel-header">
            <div className="context-info">
              <FontAwesomeIcon icon={navSections
                .flatMap(section => section.items)
                .find(item => item.id === currentPage)?.icon || faTicket} 
              />
              <span>{getCurrentPageTitle()}</span>
            </div>
            {isDisabled && (
              <div className="license-lock-indicator">
                <FontAwesomeIcon icon={faBan} />
                <span>License Expired</span>
              </div>
            )}
            <button 
              className="action-button"
              onClick={() => setIsAIChatOpen(false)}
              title="Close AI Panel"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div className="ai-panel-content">
            <div className="chat-messages">
              {/* Chat messages will go here */}
            </div>
          </div>
          <div className="chat-input-container">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={isDisabled ? "AI features unavailable - License expired" : "Chat with the AI agent."}
              className="chat-input"
              disabled={isDisabled}
              onKeyDown={(e) => {
                if (!isDisabled && e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  console.log('Sending:', chatInput);
                  setChatInput('');
                }
              }}
            />
         
          </div>
        </aside>
      )}

      <footer className="bottom-panel">
        <div className="status-container">
          <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
          <span>{mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)} Mode</span>
          <span className="status-text">({isOnline ? 'Online' : 'Offline'})</span>
        </div>
        <div className="description-container">
          {hoverDescription && <span className="hover-description">{hoverDescription}</span>}
        </div>
      </footer>
    </div>
  );
}

export default App;
