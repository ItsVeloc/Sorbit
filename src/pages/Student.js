import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Container from '../components/common/Container';
import StudentDashboard from '../components/student/StudentDashboard';
import '../styles/student.css';

const Student = () => {
  const [assignmentCode, setAssignmentCode] = useState('');
  const [activeAssignment, setActiveAssignment] = useState(null);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    // In the MVP, we'll get the assignment from localStorage
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    const found = assignments.find(a => a.code === assignmentCode);
    
    if (found) {
      setActiveAssignment(found);
    } else {
      alert('Assignment not found. Please check the code and try again.');
    }
  };

  const handleReset = () => {
    setActiveAssignment(null);
    setAssignmentCode('');
  };

  return (
    <div className="app student-app">
      <Header title="AI Homework Assistant - Student View">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/teacher" className="nav-link">Teacher View</Link>
      </Header>
      
      <Container>
        {!activeAssignment ? (
          <div className="code-entry">
            <h2>Enter your assignment code</h2>
            <form onSubmit={handleCodeSubmit}>
              <input
                type="text"
                value={assignmentCode}
                onChange={(e) => setAssignmentCode(e.target.value)}
                placeholder="Enter assignment code"
                required
              />
              <button type="submit">Start Assignment</button>
            </form>
          </div>
        ) : (
          <div className="active-assignment">
            <button className="back-button" onClick={handleReset}>
              ← Back to code entry
            </button>
            <StudentDashboard assignment={activeAssignment} />
          </div>
        )}
      </Container>
      
      <Footer />
    </div>
  );
};

export default Student;