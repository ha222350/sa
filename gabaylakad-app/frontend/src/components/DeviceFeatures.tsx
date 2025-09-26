import React from 'react';
import './DeviceFeatures.css';

const features = [
  {
    title: 'Smart Walking Stick',
    img: '/images/device-main.png',
    desc: 'A modern assistive device for the visually impaired, featuring real-time tracking, emergency alerts, and more.'
  },
  {
    title: 'Location Tracking',
    img: '/images/location-feature.png',
    desc: 'Track the real-time location of the user for safety and peace of mind.'
  },
  {
    title: 'Emergency System',
    img: '/images/emergency-feature.png',
    desc: 'Instant emergency alerts sent to caregivers via SMS and app notifications.'
  },
  {
    title: 'Night Reflector',
    img: '/images/night-reflector.png',
    desc: 'Automatic night reflector for enhanced visibility in low-light conditions.'
  },
  {
    title: 'Sensor Data',
    img: '/images/sensor-feature.png',
    desc: 'Monitor walking activity, battery status, and device health.'
  },
];

const DeviceFeatures: React.FC = () => (
  <div className="device-features-page">
    <header className="features-header">
      <h1>GabayLakad Smart Stick</h1>
      <p className="features-sub">Empowering independence and safety for the visually impaired.</p>
    </header>
    <div className="features-list">
      {features.map((f, idx) => (
        <div className="feature-card" key={idx}>
          <img src={f.img} alt={f.title} className="feature-img" />
          <h2>{f.title}</h2>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
    <footer className="features-footer">
      <p>&copy; {new Date().getFullYear()} GabayLakad. All rights reserved.</p>
    </footer>
  </div>
);

export default DeviceFeatures;
