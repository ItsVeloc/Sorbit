import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Teacher from './pages/Teacher';
import Student from './pages/Student';
import { AssignmentProvider } from './contexts/AssignmentContext';
import './styles/global.css';

function App() {
  return (
    <AssignmentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/student" element={<Student />} />
        </Routes>
      </Router>
    </AssignmentProvider>
  );
}

export default App;