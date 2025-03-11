import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Container from '../components/common/Container';
import TeacherDashboard from '../components/teacher/TeacherDashboard';
import '../styles/teacher.css';

const Teacher = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="app teacher-app">
      <Header title="AI Homework Assistant - Teacher Dashboard">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/student" className="nav-link">Student View</Link>
      </Header>
      
      <Container>
        <div className="teacher-tabs">
          <button 
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Assignment
          </button>
          <button 
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            My Assignments
          </button>
        </div>
        
        <TeacherDashboard activeTab={activeTab} />
      </Container>
      
      <Footer />
    </div>
  );
};

export default Teacher;