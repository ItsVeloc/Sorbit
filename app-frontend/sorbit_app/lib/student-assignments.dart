import 'package:flutter/material.dart';

class AssignmentsPage extends StatelessWidget {
  final List<Map<String, String>> currentAssignments = [
    {"subject": "English", "teacher": "Ms Stevens - Poetry"},
    {"subject": "Spanish", "teacher": "Mr Doe - Loret"},
    {"subject": "Computer Science", "teacher": "Mr Doe - Loret"},
    {"subject": "PE", "teacher": "Mr Doe - Loret"},
    {"subject": "Geography", "teacher": "Mr Doe - Loret"},
    {"subject": "Physics", "teacher": "Mr Doe - Loret"},
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Current Assignments',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          _buildAssignmentList(currentAssignments),
          SizedBox(height: 16),
          Text(
            'Previous Assignments',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          _buildAssignmentList(currentAssignments), // Placeholder for past assignments
        ],
      ),
    );
  }

  Widget _buildAssignmentList(List<Map<String, String>> assignments) {
    return Column(
      children: assignments
          .map((assignment) => Card(
        elevation: 2,
        child: ListTile(
          leading: CircleAvatar(child: Icon(Icons.book)),
          title: Text(assignment["subject"]!),
          subtitle: Text(assignment["teacher"]!),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.arrow_upward),
              SizedBox(width: 8),
              Icon(Icons.grid_view),
            ],
          ),
        ),
      ))
          .toList(),
    );
  }
}
