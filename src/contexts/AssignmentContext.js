import React, { createContext, useState, useEffect } from 'react';
import { saveAssignments, getAssignments } from '../utils/localStorage';
import { generateCode } from '../utils/codeGenerator';

export const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load assignments from localStorage on initial render
  useEffect(() => {
    const loadedAssignments = getAssignments();
    setAssignments(loadedAssignments);
    setLoading(false);
  }, []);

  // Save assignments to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveAssignments(assignments);
    }
  }, [assignments, loading]);

  const createAssignment = (newAssignment) => {
    const assignmentWithCode = {
      ...newAssignment,
      id: Date.now().toString(),
      code: generateCode(),
      createdAt: new Date().toISOString(),
    };

    setAssignments([...assignments, assignmentWithCode]);
    return assignmentWithCode;
  };

  const updateAssignment = (updatedAssignment) => {
    const updatedAssignments = assignments.map(assignment => 
      assignment.id === updatedAssignment.id ? updatedAssignment : assignment
    );
    
    setAssignments(updatedAssignments);
  };

  const deleteAssignment = (assignmentId) => {
    const filteredAssignments = assignments.filter(
      assignment => assignment.id !== assignmentId
    );
    
    setAssignments(filteredAssignments);
  };

  const getAssignmentByCode = (code) => {
    return assignments.find(assignment => assignment.code === code);
  };

  const value = {
    assignments,
    loading,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentByCode
  };

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
};