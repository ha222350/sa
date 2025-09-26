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
const USE_SIMULATION = true; // Set to false for API mode

// Dummy data for simulation mode
const dummyData: DashboardData = {
  user: {
    name: 'Joanna Marie Baguio',
    age: 22,
    impairment_level: 'Totally Blind',
    serial_number: 'GL001',
    device_active: true,
  },
  caregiver: { name: 'Kevin Keith P. Selisana', phone_number: '+63 912 345 6789' },
  lastSync: '5 seconds ago',
  currentLocation: 'Ayala Center',
  locationUpdate: '10 seconds ago',
  batteryLevel: '78%',
  batteryTime: '~6 hours remaining',
  activityText: 'WALKING',
  stepCount: '1,247',
  activityLog: [
    { title: 'Entered Ayala Center', details: 'Automatic check-in via geofence', time: '5 minutes ago', icon: 'fas fa-map-marker-alt', color: '#e74c3c' },
    { title: 'Obstacle Detected', details: '0.8m ahead, slight right turn suggested', time: '10 minutes ago', icon: 'fas fa-exclamation-triangle', color: '#f1c40f' },
    { title: 'Battery Level Normal', details: 'Battery at 82%', time: '15 minutes ago', icon: 'fas fa-battery-full', color: '#2ecc71' },
    { title: 'Walking Detected', details: 'Speed: 2.1 km/h', time: '20 minutes ago', icon: 'fas fa-walking', color: '#3498db' },
  ],
};

// Fetch data from API (if not simulation)
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
          lastSync: `${Math.floor(Math.random() * 10) + 1} seconds ago`,
          batteryLevel: `${Math.floor(Math.random() * 20) + 70}%`,
          stepCount: `${Math.floor(Math.random() * 500) + 1000}`,
        }));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="dashboard-fullscreen">
      <Sidebar />
      <main className="main-content">
        <div className="dashboard-header">Monitoring Dashboard</div>
        {/* Patient Info Card */}
        <div className="dashboard-card bg-gradient-to-r from-blue-400 to-purple-500 text-white mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-teal-400 flex items-center justify-center text-2xl font-bold mb-4">
            {data.user.name.split(' ').map(w => w[0]).join('').slice(0,2)}
          </div>
          <div className="text-xl font-bold mb-2">{data.user.name}</div>
          <div className="mb-2">Age: {data.user.age} • Condition: {data.user.impairment_level}</div>
          <div className="mb-2">Emergency Contact: {data.caregiver.name} (Caregiver) - {data.caregiver.phone_number}</div>
          <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 font-semibold">Smart Stick #{data.user.serial_number} - {data.user.device_active ? 'Connected' : 'Disconnected'}</div>
        </div>
        {/* Stats Grid */}
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="text-purple-700 font-bold mb-2">Device Status</div>
            <div className="text-2xl font-bold mb-2"><span className="text-green-500"><i className="fas fa-walking"></i> {data.user.device_active ? 'Online' : 'Offline'}</span></div>
            <div className="text-gray-500"><i className="fas fa-wifi"></i> Last sync: {data.lastSync}</div>
          </div>
          <div className="dashboard-card">
            <div className="text-purple-700 font-bold mb-2">Current Location</div>
            <div className="text-2xl font-bold mb-2">{data.currentLocation}</div>
            <div className="text-gray-500"><i className="fas fa-clock"></i> Updated {data.locationUpdate}</div>
          </div>
          <div className="dashboard-card">
            <div className="text-purple-700 font-bold mb-2">Battery Level</div>
            <div className="text-2xl font-bold mb-2">{data.batteryLevel}</div>
            <div className="text-gray-500"><i className="fas fa-battery-three-quarters"></i> {data.batteryTime}</div>
          </div>
          <div className="dashboard-card">
            <div className="text-purple-700 font-bold mb-2">Activity Status</div>
            <div className="text-2xl font-bold mb-2"><i className="fas fa-walking"></i> {data.activityText}</div>
            <div className="text-gray-500"><i className="fas fa-shoe-prints"></i> {data.stepCount} steps today</div>
          </div>
          <div className="dashboard-card">
            <div className="text-purple-700 font-bold mb-2">EMERGENCY SYSTEM</div>
            <div className="text-2xl font-bold mb-2"><span className="text-green-500"><i className="fas fa-check"></i> Ready</span></div>
            <div className="text-gray-500"><i className="fas fa-mobile-alt"></i> SMS alerts via GSM network</div>
          </div>
          <div className="dashboard-card">
            <div className="text-purple-700 font-bold mb-2">NIGHT REFLECTOR</div>
            <div className="text-2xl font-bold mb-2"><span className="text-yellow-400"><i className="fas fa-sun"></i> Active</span></div>
            <div className="text-gray-500"><i className="fas fa-lightbulb"></i> Auto-activates in low light</div>
          </div>
        </div>
        {/* Activity Feed */}
        <ExportButtons activityLog={data.activityLog} />
        <div className="dashboard-card">
          <div className="text-purple-700 font-bold mb-4 flex items-center"><i className="fas fa-history mr-2"></i> Real-time Activity Log</div>
          <ul>
            {data.activityLog.map((item, idx) => (
              <li className="flex items-center mb-4" key={idx}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl mr-4" style={{ background: item.color }}><i className={item.icon}></i></div>
                <div>
                  <div className="font-bold text-gray-800">{item.title}</div>
                  <div className="text-gray-500">{item.details}</div>
                  <div className="text-purple-700 font-semibold">{item.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;