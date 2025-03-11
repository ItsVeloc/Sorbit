// components/teacher/AssignmentList.js
import React, { useContext } from 'react';
import { AssignmentContext } from '../../contexts/AssignmentContext';
import { format } from 'date-fns';

const AssignmentList = () => {
  const { assignments, deleteAssignment } = useContext(AssignmentContext);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      deleteAssignment(id);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="assignment-list-container">
      <h2>My Assignments</h2>
      
      {assignments.length === 0 ? (
        <div className="no-assignments">
          <p>You haven't created any assignments yet.</p>
        </div>
      ) : (
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <div className="assignment-header">
                <h3>{assignment.title}</h3>
                <span className="assignment-subject">{assignment.subject}</span>
              </div>
              
              <p className="assignment-description">
                {assignment.description.substring(0, 100)}
                {assignment.description.length > 100 ? '...' : ''}
              </p>
              
              <div className="assignment-meta">
                <div className="meta-item">
                  <span className="meta-label">Due:</span>
                  <span className="meta-value">
                    {formatDate(assignment.dueDate)}
                  </span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">Code:</span>
                  <span className="meta-value code">{assignment.code}</span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">Questions:</span>
                  <span className="meta-value">
                    {assignment.questions ? assignment.questions.length : 0}
                  </span>
                </div>
              </div>
              
              <div className="assignment-actions">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(assignment.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;