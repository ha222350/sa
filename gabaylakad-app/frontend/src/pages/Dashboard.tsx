import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ExportButtons from '../components/ExportButtons';

// TypeScript interfaces for dashboard data
interface Patient {
  name: string;
  age: number;
  impairment_level: string;
  serial_number: string;
  device_active: boolean;
}
interface Caregiver {
  name: string;
  phone_number: string;
}
interface DashboardData {
  user: Patient;
  caregiver: Caregiver;
  lastSync: string;
  currentLocation: string;
  locationUpdate: string;
  batteryLevel: string;
  batteryTime: string;
  activityText: string;
  stepCount: string;
  activityLog: Array<{ title: string; details: string; time: string; icon: string; color: string }>;
}

// Config flag for simulation/API mode
const USE_SIMULATION = true;

// Dummy data for simulation mode - matching your screenshot exactly
const dummyData: DashboardData = {
  user: {
    name: 'Joanna Marie Baguio',
    age: 22,
    impairment_level: 'Totally Blind',
    serial_number: 'GL001',
    device_active: true,
  },
  caregiver: { name: 'Kevin Keith P. Sellisma', phone_number: '+63 918 214 9193' },
  lastSync: '7 seconds ago',
  currentLocation: 'SM City Cebu',
  locationUpdate: '3 minutes ago',
  batteryLevel: '65%',
  batteryTime: '~6 hours remaining',
  activityText: 'WALKING',
  stepCount: '1,776',
  activityLog: [
    { title: 'Entered SM City Cebu', details: 'Automatic check-in via geofence', time: '5 minutes ago', icon: 'fas fa-map-marker-alt', color: '#e74c3c' },
    { title: 'Obstacle Detected', details: '0.8m ahead, slight right turn suggested', time: '10 minutes ago', icon: 'fas fa-exclamation-triangle', color: '#f1c40f' },
    { title: 'Battery Level Normal', details: 'Battery at 82%', time: '15 minutes ago', icon: 'fas fa-battery-full', color: '#2ecc71' },
    { title: 'Walking Detected', details: 'Speed: 2.1 km/h', time: '20 minutes ago', icon: 'fas fa-walking', color: '#3498db' },
  ],
};

const fetchDashboardData = async (): Promise<DashboardData> => {
  const res = await fetch('http://localhost:5000/api/dashboard');
  return await res.json();
};

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData>(dummyData);

  useEffect(() => {
    if (!USE_SIMULATION) {
      fetchDashboardData().then(setData);
    } else {
      // Simulate live updates
      const interval = setInterval(() => {
        setData(prev => ({
          ...prev,
          lastSync: `${Math.floor(Math.random() * 10)} seconds ago`,
          batteryLevel: `${Math.floor(Math.random() * 20) + 60}%`,
          stepCount: `${Math.floor(Math.random() * 500) + 1500}`,
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content-full">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header-section">
            <h1>Monitoring Dashboard</h1>
          </div>

          {/* Patient Info */}
          <div className="patient-info-section">
            <h2>{data.user.name}</h2>
            <p>Age: {data.user.age} - Condition: {data.user.impairment_level}</p>
            <p>Emergency Contact: {data.caregiver.name} (Caregiver) - {data.caregiver.phone_number}</p>
            <div className="device-status">
              <strong>Smart Stick #{data.user.serial_number} - Connected</strong>
            </div>
          </div>

          <hr className="section-divider" />

          {/* Status Cards - Full Width Grid */}
          <div className="status-grid-full">
            {/* Device Status Card */}
            <div className="status-card">
              <div className="status-header">
                <h3>DEVICE STATUS</h3>
                <span className="online-badge">ONLINE</span>
              </div>
              <div className="status-content">
                <p>Last sync: {data.lastSync}</p>
                
                <div className="location-section">
                  <h4>CURRENT LOCATION</h4>
                  <p className="location-name">{data.currentLocation}</p>
                  <p className="location-update">• Updated {data.locationUpdate}</p>
                </div>
              </div>
            </div>

            {/* Battery Level Card */}
            <div className="status-card">
              <div className="status-header">
                <h3>BATTERY LEVEL</h3>
                <span className="battery-value">{data.batteryLevel}</span>
              </div>
              <div className="status-content">
                <p>{data.batteryTime}</p>
              </div>
            </div>

            {/* Activity Status Card */}
            <div className="status-card">
              <div className="status-header">
                <h3>ACTIVITY STATUS</h3>
                <span className="activity-value">{data.activityText}</span>
              </div>
              <div className="status-content">
                <p>{data.stepCount} steps today</p>
              </div>
            </div>

            {/* Emergency System Card */}
            <div className="status-card">
              <div className="status-header">
                <h3>EMERGENCY SYSTEM</h3>
                <span className="ready-badge">READY</span>
              </div>
              <div className="status-content">
                <p>SMS alerts via GSM network</p>
              </div>
            </div>

            {/* Night Reflector Card */}
            <div className="status-card">
              <div className="status-header">
                <h3>NIGHT REFLECTOR</h3>
                <span className="active-badge">ACTIVE</span>
              </div>
              <div className="status-content">
                <p>Auto-activates in low light</p>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <ExportButtons activityLog={data.activityLog} />
          <div className="activity-log-section">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {data.activityLog.map((item, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-icon">
                    <i className={item.icon} style={{ color: item.color }}></i>
                  </div>
                  <div className="activity-details">
                    <strong>{item.title}</strong>
                    <p>{item.details}</p>
                    <span className="activity-time">{item.time}</span>
                  </div>  
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;