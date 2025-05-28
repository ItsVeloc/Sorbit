import 'package:flutter/material.dart';
import 'chatpage.dart';
import 'package:intl/intl.dart';

class AssignmentsPage extends StatelessWidget {
  final List<Map<String, dynamic>> currentAssignments = [
    {
      "subject": "English",
      "teacher": "Ms Stevens - Poetry",
      "dueDate": DateTime.now().add(Duration(days: 1, hours: 9)) // Tomorrow 9 AM
    },
    {
      "subject": "Spanish",
      "teacher": "Mr Doe - Loret",
      "dueDate": DateTime.now().add(Duration(days: 5, hours: 15, minutes: 30)) // Friday 3:30 PM
    },
    {
      "subject": "Computer Science",
      "teacher": "Mr Doe - Loret",
      "dueDate": DateTime.now().add(Duration(days: 8, hours: 23, minutes: 59)) // Next Monday 11:59 PM
    },
    {
      "subject": "PE",
      "teacher": "Mr Doe - Loret",
      "dueDate": DateTime.now().add(Duration(days: 3, hours: 14)) // Wednesday 2:00 PM
    },
    {
      "subject": "Geography",
      "teacher": "Mr Doe - Loret",
      "dueDate": DateTime.now().add(Duration(days: 10, hours: 9)) // Next Thursday 9 AM
    },
    {
      "subject": "Physics",
      "teacher": "Mr Doe - Loret",
      "dueDate": DateTime.now().add(Duration(hours: 23, minutes: 59)) // Today 11:59 PM
    },
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
          _buildAssignmentList(context, currentAssignments),
          SizedBox(height: 16),
          Text(
            'Previous Assignments',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          _buildAssignmentList(context, currentAssignments), // Placeholder for past assignments
        ],
      ),
    );
  }

  Widget _buildAssignmentList(BuildContext context, List<Map<String, dynamic>> assignments) {
    // Sort assignments by due date (closest first)
    List<Map<String, dynamic>> sortedAssignments = List.from(assignments);
    sortedAssignments.sort((a, b) =>
        (a["dueDate"] as DateTime).compareTo(b["dueDate"] as DateTime)
    );

    return Column(
      children: sortedAssignments
          .map((assignment) => Card(
        elevation: 2,
        child: ListTile(
          onTap: (){Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const AssignmentDetailPage(),
            ),
          );},
          leading: CircleAvatar(child: Icon(Icons.book)),
          title: Text(assignment["subject"]!),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(assignment["teacher"]!),
              SizedBox(height: 4),
              Text(
                _formatDueDate(assignment["dueDate"] as DateTime),
                style: TextStyle(
                  fontSize: 12,
                  color: _getDueDateColor(assignment["dueDate"] as DateTime),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ))
          .toList(),
    );
  }

  String _formatDueDate(DateTime dueDate) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final tomorrow = today.add(Duration(days: 1));
    final dueDateOnly = DateTime(dueDate.year, dueDate.month, dueDate.day);

    String timeStr = DateFormat('h:mm a').format(dueDate);

    if (dueDateOnly == today) {
      return "Due: Today, $timeStr";
    } else if (dueDateOnly == tomorrow) {
      return "Due: Tomorrow, $timeStr";
    } else if (dueDate.difference(now).inDays < 7) {
      String dayName = DateFormat('EEEE').format(dueDate);
      return "Due: $dayName, $timeStr";
    } else {
      return "Due: ${DateFormat('MMM d, h:mm a').format(dueDate)}";
    }
  }

  Color _getDueDateColor(DateTime dueDate) {
    final now = DateTime.now();
    final hoursUntilDue = dueDate.difference(now).inHours;

    if (hoursUntilDue < 24) {
      return Colors.red; // Due within 24 hours
    } else if (hoursUntilDue < 72) {
      return Colors.orange; // Due within 3 days
    }
    return Colors.grey[600]!; // Due later
  }
}



class AssignmentDetailPage extends StatelessWidget {
  const AssignmentDetailPage({super.key});

  @override
  Widget build(BuildContext context) {
    const assignmentTitle = 'English Essay';
    const assignmentDescription = '''
Write a 1,000 word essay on the themes of identity and self-expression in Shakespeare's "Hamlet". 
Focus particularly on Hamlet's soliloquies and how they reflect his inner conflict.
''';

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              assignmentTitle,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: SingleChildScrollView(
                child: Text(
                  assignmentDescription,
                  style: const TextStyle(fontSize: 16, height: 1.5),
                ),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ChatPage(),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Start Work',
                  style: TextStyle(fontSize: 16, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CoursesPage extends StatelessWidget {
  const CoursesPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final List<String> courses = [
      'English',
      'Maths',
      'Physics',
      'Computer Science',
      'Geography',
      'History',
      'PE',
      'Design Technology',
      'Chemistry',
      'Biology',
      'Spanish',
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFE8E8E8),
      body: SingleChildScrollView(child:SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Courses',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w500,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFE6E0F8),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: courses.length,
                  separatorBuilder: (context, index) => const Divider(
                    height: 1,
                    color: Colors.white24,
                    indent: 16,
                    endIndent: 16,
                  ),
                  itemBuilder: (context, index) {
                    return Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                      child: Text(
                        courses[index],
                        style: const TextStyle(
                          fontSize: 16,
                          color: Colors.black87,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),),
    );
  }
}