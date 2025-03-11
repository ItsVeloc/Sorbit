// utils/localStorage.js
export const saveAssignments = (assignments) => {
  localStorage.setItem('assignments', JSON.stringify(assignments));
};

export const getAssignments = () => {
  const assignments = localStorage.getItem('assignments');
  return assignments ? JSON.parse(assignments) : [];
};

