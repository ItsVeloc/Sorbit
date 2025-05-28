import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:sorbit_app/student-assignments.dart';


// You can keep this class as a StatelessWidget since the data is final.
class HomePage extends StatelessWidget {
  HomePage({Key? key}) : super(key: key);

  // The sample data you provided
  final List<Map<String, dynamic>> _currentAssignments = [
    {
      "subject": "English",
      "teacher": "Ms Stevens - Poetry",
      "dueDate": DateTime.now().add(const Duration(days: 1, hours: 9))
    },
    {
      "subject": "Spanish",
      "teacher": "Mr Doe - Loret",
      "dueDate": DateTime.now().add(const Duration(days: 5, hours: 15, minutes: 30))
    },
    {
      "subject": "Computer Science",
      "teacher": "Mr Doe - Loret",
      "dueDate": DateTime.now().add(const Duration(days: 8, hours: 23, minutes: 59))
    },
    {
      "subject": "PE",
      "teacher": "Mr Doe - Loret",
      "dueDate": DateTime.now().add(const Duration(days: 3, hours: 14))
    },
    {
      "subject": "Geography",
      "teacher": "Mr Doe - Loret",
      "dueDate": DateTime.now().add(const Duration(days: 10, hours: 9))
    },
    {
      "subject": "Physics",
      "teacher": "Mr Doe - Loret",
      "dueDate": DateTime.now().add(const Duration(hours: 23, minutes: 59))
    },
    {
      "subject": "Art",
      "teacher": "Ms. Garcia - Sketching",
      "dueDate": DateTime.now().add(const Duration(days: 3, hours: 16))
    }
  ];

  // Helper function to format the due date into a readable string
  String _formatDueDate(DateTime dueDate) {
    final now = DateTime.now();
    final difference = dueDate.difference(now);

    if (difference.isNegative) {
      return "Overdue";
    } else if (difference.inDays == 0) {
      if (difference.inHours == 0) {
        return "Due in ${difference.inMinutes} minutes";
      }
      return "Due today";
    } else if (difference.inDays == 1) {
      // Check if it's tomorrow, not just 24 hours away
      final tomorrow = DateTime(now.year, now.month, now.day + 1);
      if (dueDate.day == tomorrow.day) {
        return "Due tomorrow";
      }
    }
    return "Due in ${difference.inDays} days";
  }


  @override
  Widget build(BuildContext context) {
    // Sort the assignments by the soonest due date first
    // Create a mutable copy to sort, as _currentAssignments is final
    final List<Map<String, dynamic>> sortedAssignments = List.from(_currentAssignments);
    sortedAssignments.sort((a, b) => a['dueDate'].compareTo(b['dueDate']));

    return Scaffold(
      // Set background to white as requested
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Text(
                  'Home',
                  style: TextStyle(fontSize: 34, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
                ),
              ),
              const SizedBox(height: 20),

              // HORIZONTALLY SCROLLABLE SECTION - Now built from your data
              SizedBox(
                height: 180,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  // Use the length of your assignments list
                  itemCount: sortedAssignments.length,
                  itemBuilder: (context, index) {
                    final assignment = sortedAssignments[index];
                    // Add spacing between cards
                    return Padding(
                      padding: const EdgeInsets.only(right: 12.0),
                      child: _buildUpcomingAssignmentCard(context, assignment),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),

              // VERTICALLY SCROLLABLE CONTENT - Now shows ALL assignments in a single tile
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: sortedAssignments.isEmpty
                    ? const Center(child: Text("No assignments found!"))
                    : ListView.builder(
                  // Important: These properties allow the inner ListView to scroll within the outer SingleChildScrollView
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: sortedAssignments.length,
                  itemBuilder: (context, index) {
                    final assignment = sortedAssignments[index];
                    return Column(
                      children: [
                        _buildSingleAssignmentCard(context, assignment), // Pass context to the new single card widget
                        // Add more spacing if this isn't the last item
                        if (index < sortedAssignments.length - 1)
                          const SizedBox(height: 24),
                      ],
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Updated to take a Map of assignment data
  Widget _buildUpcomingAssignmentCard(
      BuildContext context, Map<String, dynamic> assignment) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const AssignmentDetailPage(),
          ),
        );
      },
      child: Container(
        width: 150,
        decoration: BoxDecoration(
          color: Colors.grey.shade100, // Using a light grey for the card
          borderRadius: BorderRadius.circular(24),
        ),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child:  Center(
                    child: Image.network('https://cdn.discordapp.com/attachments/870625854504464437/1377301684006555738/image_2025-03-21_150047843.png?ex=683877a6&is=68372626&hm=e1f72800dbfe112692ad602f3e95e70b7b13aac235c41932712abe7c9eb816d1&'),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(assignment['subject'],
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              Text(_formatDueDate(assignment['dueDate']),
                  style: const TextStyle(color: Colors.grey, fontSize: 12)),
            ],
          ),
        ),
      ),
    );
  }

  // New widget to combine teacher info and assignment content into one tile
  Widget _buildSingleAssignmentCard(BuildContext context, Map<String, dynamic> assignment) {
    final teacherInfo = assignment['teacher'].split(' - ');
    final teacherName = teacherInfo.isNotEmpty ? teacherInfo[0] : '';
    final topic = teacherInfo.length > 1 ? teacherInfo[1] : 'Details';

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const AssignmentDetailPage(),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.grey.shade100,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Assignment content section (now includes all info)
            Container(
              height: 150,
              decoration: BoxDecoration(
                  color: Colors.grey.shade200,
                  borderRadius: const BorderRadius.only( // Apply top rounding to this container
                    topLeft: Radius.circular(16),
                    topRight: Radius.circular(16),
                  )
              ),
              child: Center(
                child: Icon(Icons.book_outlined, color: Colors.grey.shade600, size: 60),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row( // Row to display subject and more_horiz icon
                    children: [
                      Expanded(
                        child: Text(
                          assignment['subject'],
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const Icon(Icons.more_horiz),
                    ],
                  ),
                  Text(
                    teacherName, // Teacher's name
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  Text(
                    topic, // Topic
                    style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Due: ${DateFormat('EEEE, MMM d, y').add_jm().format(assignment['dueDate'])}",
                    style: TextStyle(fontSize: 14, color: Colors.grey.shade800),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
