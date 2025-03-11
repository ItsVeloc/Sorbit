// testRun.js - Run this in the browser console or include as a script for demo purposes
// This script populates the app with sample assignments and logs their access codes

(function initializeTestData() {
  // Clear existing data
  localStorage.removeItem('assignments');
  
  // Sample assignments for various subjects
  const sampleAssignments = [
    {
      id: "1001",
      title: "Introduction to Photosynthesis",
      subject: "Biology",
      description: "Learn about the process of photosynthesis, how plants convert light energy into chemical energy, and the importance of this process for life on Earth. Focus on the light-dependent and light-independent reactions.",
      dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
      code: "BIO123",
      createdAt: new Date().toISOString(),
      questions: [
        {
          question: "What are the two main stages of photosynthesis?",
          answer: "The light-dependent reactions and the Calvin cycle (light-independent reactions)"
        },
        {
          question: "What is the primary pigment that absorbs light energy in plants?",
          answer: "Chlorophyll a"
        },
        {
          question: "What is the chemical equation for photosynthesis?",
          answer: "6CO2 + 6H2O + light energy → C6H12O6 + 6O2"
        }
      ]
    },
    {
      id: "1002",
      title: "World War II: Causes and Effects",
      subject: "History",
      description: "Examine the causes leading to World War II, including economic factors, the Treaty of Versailles, and the rise of fascism. Discuss the major events of the war and its long-term impact on global politics and society.",
      dueDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
      code: "HIS456",
      createdAt: new Date().toISOString(),
      questions: [
        {
          question: "What were three major causes of World War II?",
          answer: "The Treaty of Versailles, economic depression, and the rise of fascist dictatorships in Europe"
        },
        {
          question: "How did the policy of appeasement contribute to the start of the war?",
          answer: "It allowed Hitler to gain territory and power without consequences, emboldening him to make more aggressive moves"
        },
        {
          question: "What was the significance of the Battle of Stalingrad?",
          answer: "It marked a major turning point in the war, as it ended the German advance into the Soviet Union and began the Soviet counteroffensive"
        }
      ]
    },
    {
      id: "1003",
      title: "Linear Equations and Inequalities",
      subject: "Mathematics",
      description: "Master the skills of solving linear equations and inequalities. Learn how to represent these solutions graphically on a number line and coordinate plane. Apply these concepts to solve real-world problems.",
      dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
      code: "MATH789",
      createdAt: new Date().toISOString(),
      questions: [
        {
          question: "Solve for x: 3x + 7 = 22",
          answer: "x = 5"
        },
        {
          question: "Solve the inequality: 2x - 5 < 7",
          answer: "x < 6"
        },
        {
          question: "A rectangle has a perimeter of 30 units. If its length is 2 units more than its width, what are the dimensions?",
          answer: "Length = 8.5 units, Width = 6.5 units"
        }
      ]
    }
  ];
  
  // Save sample assignments to localStorage
  localStorage.setItem('assignments', JSON.stringify(sampleAssignments));
  
  // Log success message and access codes
  console.log('🎉 Test data initialized successfully!');
  console.log('📝 Sample assignments created:');
  sampleAssignments.forEach(assignment => {
    console.log(`- ${assignment.title} (${assignment.subject})`);
    console.log(`  Access Code: ${assignment.code}`);
  });
  
  console.log('\n🔍 To test the app:');
  console.log('1. Go to the Teacher view to see the sample assignments');
  console.log('2. Switch to the Student view and enter one of the codes above');
  console.log('3. Test the AI chat interaction with the sample assignment');
  
  return sampleAssignments;
})();