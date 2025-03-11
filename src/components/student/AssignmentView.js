// components/student/AssignmentView.js
import React from 'react';
import { format } from 'date-fns';

const AssignmentView = ({ assignment }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="assignment-view">
      <div className="assignment-header">
        <h2>{assignment.title}</h2>
        <span className="assignment-subject">{assignment.subject}</span>
      </div>
      
      <div className="assignment-details">
        <p className="due-date">
          <strong>Due:</strong> {formatDate(assignment.dueDate)}
        </p>
        <div className="assignment-description">
          <p>{assignment.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentView;