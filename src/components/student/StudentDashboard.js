// components/student/StudentDashboard.js
import React from 'react';
import AssignmentView from './AssignmentView';
import ChatInterface from './ChatInterface';

const StudentDashboard = ({ assignment }) => {
  return (
    <div className="student-dashboard">
      <AssignmentView assignment={assignment} />
      <ChatInterface assignment={assignment} />
    </div>
  );
};

export default StudentDashboard;