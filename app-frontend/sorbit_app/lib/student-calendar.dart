import 'package:flutter/material.dart';
import 'package:sorbit_app/student-assignments.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:intl/intl.dart';

class CalendarPage extends StatefulWidget {
  @override
  _CalendarPageState createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  // The list of assignments you provided
  final List<Map<String, dynamic>> _currentAssignments = [
    {
      "subject": "English",
      "teacher": "Ms Stevens - Poetry",
      "dueDate": DateTime.now().add(Duration(days: 1, hours: 9)) // Tomorrow 9 AM
    },
    {
      "subject": "Spanish",
      "teacher": "Mr Doe - Loret",
      "dueDate":
      DateTime.now().add(Duration(days: 5, hours: 15, minutes: 30)) // Friday 3:30 PM
    },
    {
      "subject": "Computer Science",
      "teacher": "Mr Doe - Loret",
      "dueDate":
      DateTime.now().add(Duration(days: 8, hours: 23, minutes: 59)) // Next Monday 11:59 PM
    },
    {
      "subject": "PE",
      "teacher": "Mr Doe - Loret",
      "dueDate":
      DateTime.now().add(Duration(days: 3, hours: 14)) // Wednesday 2:00 PM
    },
    {
      "subject": "Geography",
      "teacher": "Mr Doe - Loret",
      "dueDate":
      DateTime.now().add(Duration(days: 10, hours: 9)) // Next Thursday 9 AM
    },
    {
      "subject": "Physics",
      "teacher": "Mr Doe - Loret",
      "dueDate":
      DateTime.now().add(Duration(hours: 23, minutes: 59)) // Today 11:59 PM
    },
    // Example of another assignment on the same day
    {
      "subject": "Art",
      "teacher": "Ms. Garcia - Sketching",
      "dueDate": DateTime.now().add(Duration(days: 3, hours: 16)) // Same day as PE, but different time
    }
  ];

  late final ValueNotifier<List<Map<String, dynamic>>> _selectedEvents;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  CalendarFormat _calendarFormat = CalendarFormat.month;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    _selectedEvents = ValueNotifier(_getEventsForDay(_selectedDay!));
  }

  @override
  void dispose() {
    _selectedEvents.dispose();
    super.dispose();
  }

  // This function gets the list of events for a given day
  List<Map<String, dynamic>> _getEventsForDay(DateTime day) {
    // A simple implementation checking for events on the same day.
    return _currentAssignments
        .where((assignment) => isSameDay(assignment['dueDate'], day))
        .toList();
  }

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
    if (!isSameDay(_selectedDay, selectedDay)) {
      setState(() {
        _selectedDay = selectedDay;
        _focusedDay = focusedDay;
      });
      _selectedEvents.value = _getEventsForDay(selectedDay);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          TableCalendar(
            firstDay: DateTime.utc(2020, 1, 1),
            lastDay: DateTime.utc(2030, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            onDaySelected: _onDaySelected,

            onPageChanged: (focusedDay) {
              _focusedDay = focusedDay;
            },
            // The magic happens here! This loads the events for each day.
            eventLoader: _getEventsForDay,
            // Customizing the calendar's appearance
            calendarStyle: CalendarStyle(
              // Use a purple color for the selected day
              selectedDecoration: BoxDecoration(
                color: Colors.purple.shade300,
                shape: BoxShape.circle,
              ),
              // Use a lighter purple for today's date
              todayDecoration: BoxDecoration(
                color: Colors.purple.shade100,
                shape: BoxShape.circle,
              ),
              // Style for the event markers (the dots)
              markerDecoration: BoxDecoration(
                color: Colors.redAccent,
                shape: BoxShape.circle,
              ),
            ),
            headerStyle: HeaderStyle(
              formatButtonVisible: false,
              formatButtonTextStyle:
              TextStyle().copyWith(color: Colors.white, fontSize: 15.0),
              formatButtonDecoration: BoxDecoration(
                color: Colors.purple,
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
          ),
          const SizedBox(height: 8.0),
          // This part displays the list of assignments for the selected day
          Expanded(
            child: ValueListenableBuilder<List<Map<String, dynamic>>>(
              valueListenable: _selectedEvents,
              builder: (context, value, _) {
                if (value.isEmpty) {
                  return Center(
                    child: Text("No assignments due on this day! 🎉"),
                  );
                }
                return ListView.builder(
                  itemCount: value.length,
                  itemBuilder: (context, index) {
                    final assignment = value[index];
                    return Container(
                      margin: const EdgeInsets.symmetric(
                        horizontal: 12.0,
                        vertical: 4.0,
                      ),
                      decoration: BoxDecoration(
                        border: Border.all(),
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: ListTile(
                        onTap: () { Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const AssignmentDetailPage(),
                          ),
                        );},
                        title: Text(assignment['subject']),
                        subtitle: Text(assignment['teacher']),
                        trailing: Text(
                          // Format the time to be more readable
                          "Due: ${DateFormat.jm().format(assignment['dueDate'])}",
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}