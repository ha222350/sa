import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/index.css'; // Import your CSS styles
import './dashboard-custom.css'; // Custom dashboard CSS
import './dashboard-enhanced.css'; // Enhanced dashboard CSS (create this file)
// Import jsPDF and the autoTable plugin
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to get initials from name
function getInitials(name: string) {
    if (!name) return '';
    return name
        .split(' ')
        .filter(Boolean)
        .map(word => word[0].toUpperCase())
        .join('')
        .slice(0, 2);
}

const navTabs = [
    { key: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { key: 'profile', label: 'My Profile', icon: 'fas fa-user' },
    { key: 'history', label: 'History', icon: 'fas fa-history' },
    { key: 'location', label: 'Location Tracking', icon: 'fas fa-map-marker-alt' },
    { key: 'sensor', label: 'Sensor Data', icon: 'fas fa-microchip' },
    { key: 'alerts', label: 'Alerts & Safety', icon: 'fas fa-bell' },
];

// Simulated API fetch hooks for dynamic data (replace with real API calls later)
const useDeviceData = () => {
  // Replace with actual API integration
  const [data] = useState({
    user: {
      name: 'Pedro Santos',
      age: 65,
      impairment_level: 'Low Vision',
      serial_number: 'SN123456',
      device_active: true,
    },
    caregiver: { name: 'Juan Dela Cruz', phone_number: '+63 912 345 6789' },
    lastSync: 'Loading...',
    currentLocation: 'Loading...',
    locationUpdate: 'Loading...',
    batteryLevel: 'Loading...',
    batteryTime: 'Loading...',
    activityText: 'Loading...',
    stepCount: 'Loading...',
    activityLog: [
      {
        title: 'Loading Activity Data...',
        details: 'Please wait while we fetch the latest activity information',
        time: 'Now',
        icon: 'fas fa-sync',
        color: '#3498db',
      },
    ],
    error_message: '',
  });
  // useEffect(() => { /* fetch from API here */ }, []);
  return data;
};


const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const data = useDeviceData();
  const navigate = useNavigate();

  // Export analytics to PDF
  const handleExport = () => {
    const doc = new jsPDF();
    doc.text('Device Analytics Report', 14, 16);
    autoTable(doc, {
      head: [['Metric', 'Value']],
      body: [
        ['Patient Name', data.user.name],
        ['Age', data.user.age],
        ['Condition', data.user.impairment_level],
        ['Device Serial', data.user.serial_number],
        ['Device Status', data.user.device_active ? 'Connected' : 'Disconnected'],
        ['Last Sync', data.lastSync],
        ['Current Location', data.currentLocation],
        ['Battery Level', data.batteryLevel],
        ['Steps Today', data.stepCount],
      ],
      startY: 24,
    });
    doc.save('device-analytics.pdf');
  };

  // Logout logic: clear session and navigate to features page
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/features');
  };

    return (
        <>
          {/* Overlay for mobile sidebar */}
          <div className={`overlay${sidebarOpen ? '' : ' show'}`} onClick={() => setSidebarOpen(true)} />
          <div className="container dashboard-enhanced">
            {/* Sidebar */}
            <aside className={`sidebar${sidebarOpen ? '' : ' collapsed open'}`}>
              <div className="sidebar-header">
                <div className="logo">
                  <i className="fas fa-walking"></i>
                </div>
                <h2>GabayLakad</h2>
                <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
                </button>
              </div>
              <nav className="sidebar-menu">
                <ul className="nav-list">
                  {navTabs.map(tab => (
                    <li className="nav-item" key={tab.key}>
                      <button
                        className={`nav-link${activeTab === tab.key ? ' active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                        data-tab={tab.key}
                        tabIndex={0}
                      >
                        <i className={tab.icon}></i>
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button className="logout-btn" aria-label="Logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </nav>
            </aside>
            {/* Main Content */}
            <main className={`main-content${sidebarOpen ? '' : ' expanded'} dashboard-main`}> 
              {/* Header */}
              <div className="header dashboard-header">
                <h1 className="header-title">Monitoring Dashboard</h1>
                <div className="header-actions">
                  <button className="btn-primary export-btn" onClick={handleExport}>
                    <i className="fas fa-file-export"></i> Export Analytics
                  </button>
                  <div className="user-info">
                    <div className="user-avatar">{getInitials(data.caregiver.name)}</div>
                    <div className="user-details">
                      <h4>{data.caregiver.name}</h4>
                      <p>Caregiver</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className={`tab-content${activeTab === 'dashboard' ? ' active' : ''}`} id="dashboard">
                {data.error_message ? (
                  <div className="error-notification">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{data.error_message}</span>
                  </div>
                ) : (
                  <>
                    {/* Patient Information Banner */}
                    <div className="patient-info dashboard-card highlight-card">
                      <div className="patient-avatar avatar-lg">{getInitials(data.user.name)}</div>
                      <div className="patient-details">
                        <h3 id="patientName">{data.user.name}</h3>
                        <p>Age: <span id="patientAge">{data.user.age ?? 'N/A'}</span> • Condition: <span id="patientCondition">{data.user.impairment_level}</span></p>
                        <p>Emergency Contact: <span id="emergencyContact">{data.caregiver.name} (Caregiver) - {data.caregiver.phone_number}</span></p>
                        <div className="device-badge">
                          <i className="fas fa-walking"></i> Smart Stick #<span id="deviceId">{data.user.serial_number ?? 'N/A'}</span> - <span id="deviceStatus">{data.user.device_active ? 'Connected' : 'Disconnected'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Cards */}
                    <div className="dashboard-grid dashboard-cards">
                      {/* Device Status */}
                      <div className="dashboard-card">
                        <div className="card-header">
                          <div>
                            <div className="card-title">Device Status</div>
                            <div className="card-value">
                              <span className={`status-indicator ${data.user.device_active ? 'online' : 'offline'}`} id="deviceStatusIndicator">
                                <i className="fas fa-circle"></i> <span id="deviceStatusText">{data.user.device_active ? 'Online' : 'Offline'}</span>
                              </span>
                            </div>
                            <div className="card-trend">
                              <i className="fas fa-wifi"></i> Last sync: <span id="lastSync">{data.lastSync}</span>
                            </div>
                          </div>
                          <div className="card-icon device">
                            <i className="fas fa-walking"></i>
                          </div>
                        </div>
                      </div>
                      {/* Current Location */}
                      <div className="dashboard-card">
                        <div className="card-header">
                          <div>
                            <div className="card-title">Current Location</div>
                            <div className="card-value" style={{ fontSize: '1.4rem' }} id="currentLocation">{data.currentLocation}</div>
                            <div className="card-trend">
                              <i className="fas fa-clock"></i> Updated <span id="locationUpdate">{data.locationUpdate}</span>
                            </div>
                          </div>
                          <div className="card-icon location">
                            <i className="fas fa-map-marker-alt"></i>
                          </div>
                        </div>
                      </div>
                      {/* Battery Level */}
                      <div className="dashboard-card">
                        <div className="card-header">
                          <div>
                            <div className="card-title">Battery Level</div>
                            <div className="card-value" id="batteryLevel">{data.batteryLevel}</div>
                            <div className="card-trend">
                              <i className="fas fa-battery-three-quarters" id="batteryIcon"></i> <span id="batteryTime">{data.batteryTime}</span>
                            </div>
                          </div>
                          <div className="card-icon battery">
                            <i className="fas fa-battery-three-quarters"></i>
                          </div>
                        </div>
                      </div>
                      {/* Activity Status */}
                      <div className="dashboard-card">
                        <div className="card-header">
                          <div>
                            <div className="card-title">Activity Status</div>
                            <div className="card-value">
                              <span className="status-indicator walking" id="activityStatus">
                                <i className="fas fa-walking"></i> <span id="activityText">{data.activityText}</span>
                              </span>
                            </div>
                            <div className="card-trend">
                              <i className="fas fa-shoe-prints"></i> <span id="stepCount">{data.stepCount}</span> steps today
                            </div>
                          </div>
                          <div className="card-icon activity">
                            <i className="fas fa-shoe-prints"></i>
                          </div>
                        </div>
                      </div>
                      {/* Emergency System */}
                      <div className="dashboard-card">
                        <div className="card-header">
                          <div>
                            <div className="card-title">EMERGENCY SYSTEM</div>
                            <div className="card-value">
                              <span className="status-indicator online" id="emergencySystemStatus">
                                <i className="fas fa-check"></i> Ready
                              </span>
                            </div>
                            <div className="card-trend">
                              <i className="fas fa-mobile-alt"></i> SMS alerts via GSM network
                            </div>
                          </div>
                          <div className="card-icon emergency">
                            <i className="fas fa-exclamation-triangle"></i>
                          </div>
                        </div>
                      </div>
                      {/* Night Reflector */}
                      <div className="dashboard-card">
                        <div className="card-header">
                          <div>
                            <div className="card-title">NIGHT REFLECTOR</div>
                            <div className="card-value">
                              <span className="status-indicator online" id="nightReflectorStatus">
                                <i className="fas fa-sun"></i> Active
                              </span>
                            </div>
                            <div className="card-trend">
                              <i className="fas fa-lightbulb"></i> Auto-activates in low light
                            </div>
                          </div>
                          <div className="card-icon night">
                            <i className="fas fa-sun"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="activity-section dashboard-card">
                      <h2 className="section-title">
                        <i className="fas fa-history"></i> Real-time Activity Log
                      </h2>
                      <ul className="activity-list" id="activityList">
                        {data.activityLog.map((item, idx) => (
                          <li className="activity-item" key={idx}>
                            <div className="activity-icon" style={{ background: item.color }}>
                              <i className={item.icon}></i>
                            </div>
                            <div className="activity-content">
                              <div className="activity-title">{item.title}</div>
                              <div className="activity-details">{item.details}</div>
                              <div className="activity-time">{item.time}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Other tabs content placeholders */}
              <div className={`tab-content${activeTab === 'profile' ? ' active' : ''}`} id="profile">
                <div className="activity-section">
                  <h2 className="section-title">My Profile</h2>
                  <p>Profile management functionality will be implemented here.</p>
                </div>
              </div>
              <div className={`tab-content${activeTab === 'history' ? ' active' : ''}`} id="history">
                <div className="activity-section">
                  <h2 className="section-title">History</h2>
                  <p>Historical data and reports will be displayed here.</p>
                </div>
              </div>
              <div className={`tab-content${activeTab === 'location' ? ' active' : ''}`} id="location">
                <div className="activity-section">
                  <h2 className="section-title">Location Tracking</h2>
                  <p>Real-time location tracking and maps will be implemented here.</p>
                </div>
              </div>
              <div className={`tab-content${activeTab === 'sensor' ? ' active' : ''}`} id="sensor">
                <div className="activity-section">
                  <h2 className="section-title">Sensor Data</h2>
                  <p>Detailed sensor readings and analytics will be displayed here.</p>
                </div>
              </div>
              <div className={`tab-content${activeTab === 'alerts' ? ' active' : ''}`} id="alerts">
                <div className="activity-section">
                  <h2 className="section-title">Safety Alerts</h2>
                  <p>Alert management and notification settings will be available here.</p>
                </div>
              </div>
            </main>
          </div>
        </>
    );
};

export default Dashboard;