// components/teacher/TeacherDashboard.js
import React from 'react';
import AssignmentForm from './AssignmentForm';
import AssignmentList from './AssignmentList';

const TeacherDashboard = ({ activeTab }) => {
  return (
    <div className="teacher-dashboard">
      {activeTab === 'create' ? <AssignmentForm /> : <AssignmentList />}
    </div>
  );
};

export default TeacherDashboard;