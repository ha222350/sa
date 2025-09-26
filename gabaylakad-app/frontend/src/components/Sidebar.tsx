import './dashboard-sidebar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState } from 'react';

const navTabs = [
  { key: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
  { key: 'profile', label: 'My Profile', icon: 'fas fa-user' },
  { key: 'history', label: 'History', icon: 'fas fa-history' },
  { key: 'location', label: 'Location Tracking', icon: 'fas fa-map-marker-alt' },
  { key: 'sensor', label: 'Sensor Data', icon: 'fas fa-microchip' },
  { key: 'alerts', label: 'Alerts & Safety', icon: 'fas fa-bell' },
];

const Sidebar: React.FC = () => {
  // collapsed by default
  const [expanded, setExpanded] = useState(false);

  // Expand on hover (desktop) and touch (mobile)
  return (
    <aside
      className={`sidebar-nav ${expanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onTouchStart={() => setExpanded(true)}
      onTouchEnd={() => setExpanded(false)}
      aria-hidden={false}
    >
      <div className="sidebar-logo" aria-hidden>
        <i className="fas fa-blind"></i>
      </div>

      <nav className="sidebar-menu" role="navigation" aria-label="Main navigation">
        <ul>
          {navTabs.map(tab => (
            <li key={tab.key} className="sidebar-item">
              <button className={`sidebar-link`} aria-label={tab.label}>
                <i className={tab.icon} aria-hidden></i>
                <span className="sidebar-label">{tab.label}</span>
              </button>
            </li>
          ))}

          <li className="sidebar-item">
            <button className={`sidebar-link`} aria-label="Logout">
              <i className={`fas fa-sign-out-alt`} aria-hidden></i>
              <span className="sidebar-label">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
