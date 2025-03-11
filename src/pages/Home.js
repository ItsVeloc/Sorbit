import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Container from '../components/common/Container';

const Home = () => {
  const loadDemoData = () => {
    // Import the initialization function from testRun.js
    const assignments = require('../utils/testRun.js');
    alert('Demo data loaded successfully! Teacher and student views are now populated with sample data.');
  };

  return (
    <div className="app">
      <Header title="AI Homework Assistant" />
      <Container>
        <div className="home-page">
          <h1>Welcome to AI Homework Assistant</h1>
          <p>Select your role to continue:</p>
          
          <div className="role-selection">
            <Link to="/teacher" className="role-button teacher">
              I'm a Teacher
            </Link>
            <Link to="/student" className="role-button student">
              I'm a Student
            </Link>
          </div>
          
          {/* Demo Button for testing */}
          <button 
            className="demo-button" 
            onClick={loadDemoData}
            style={{
              marginTop: '2rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#9b59b6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Load Demo Data
          </button>
          
          <div className="app-description">
            <h2>About this application</h2>
            <p>
              AI Homework Assistant helps teachers create interactive homework
              assignments powered by AI. Students can engage with a chatbot tutor
              that guides them through the learning material and tests their understanding.
            </p>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Home;