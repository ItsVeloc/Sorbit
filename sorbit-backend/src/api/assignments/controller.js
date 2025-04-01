const Assignment = require('../../models/Assignment');
const { NotFoundError, BadRequestError } = require('../../utils/errors');

// Get all current assignments for a student
exports.getCurrentAssignments = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    
    const assignments = await Assignment.find({
      students: studentId,
      dueDate: { $gte: new Date() },
      status: 'published'
    })
    .populate('teacher', 'name')
    .populate('course', 'name')
    .sort({ dueDate: 1 });
    
    res.json({ assignments });
  } catch (err) {
    next(err);
  }
};

// Get assignment details
exports.getAssignmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const assignment = await Assignment.findById(id)
      .populate('teacher', 'name')
      .populate('course', 'name');
      
    if (!assignment) {
      throw new NotFoundError('Assignment not found');
    }
    
    // Check if user is the teacher or a student assigned to this assignment
    const isTeacher = assignment.teacher._id.toString() === userId;
    const isStudent = assignment.students.includes(userId);
    
    if (!isTeacher && !isStudent) {
      throw new NotFoundError('Assignment not found');
    }
    
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

// Join an assignment using code (for students)
exports.joinAssignment = async (req, res, next) => {
  try {
    const { code } = req.body;
    const studentId = req.user.id;
    
    if (!code) {
      throw new BadRequestError('Assignment code is required');
    }
    
    const assignment = await Assignment.findOne({ 
      code, 
      status: 'published'
    });
    
    if (!assignment) {
      throw new NotFoundError('Invalid assignment code');
    }
    
    // Check if student is already added
    if (assignment.students.includes(studentId)) {
      return res.json({ message: 'Already enrolled in this assignment' });
    }
    
    // Add student to assignment
    assignment.students.push(studentId);
    await assignment.save();
    
    res.status(201).json({ 
      message: 'Successfully joined assignment',
      assignment: {
        id: assignment._id,
        title: assignment.title,
        subject: assignment.subject,
        dueDate: assignment.dueDate
      }
    });
  } catch (err) {
    next(err);
  }
};