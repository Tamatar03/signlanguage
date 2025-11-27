/**
 * Sample Data Seeder
 * 
 * This script helps populate your database with sample modules and lessons.
 * Run this after setting up Firebase to get started quickly.
 * 
 * Usage:
 * 1. Ensure you're logged in as a teacher/admin
 * 2. Update the USER_ID constant with your Firebase user ID
 * 3. Run this in the browser console on the admin page
 */

const SAMPLE_MODULES = [
  {
    title: "ASL Alphabet Basics",
    description: "Learn the American Sign Language alphabet from A to Z",
    category: "alphabets",
    difficulty: "beginner"
  },
  {
    title: "Numbers 1-10",
    description: "Master signing numbers from one to ten",
    category: "numbers",
    difficulty: "beginner"
  },
  {
    title: "Common Greetings",
    description: "Learn essential greeting signs like hello, goodbye, thank you",
    category: "words",
    difficulty: "beginner"
  },
  {
    title: "Family Signs",
    description: "Sign language for family members: mother, father, sister, brother",
    category: "words",
    difficulty: "beginner"
  },
  {
    title: "Everyday Phrases",
    description: "Common phrases used in daily conversation",
    category: "phrases",
    difficulty: "intermediate"
  }
];

const SAMPLE_LESSONS = {
  "ASL Alphabet Basics": [
    { sign: "A", title: "The Letter A", description: "Form a fist with thumb to the side" },
    { sign: "B", title: "The Letter B", description: "Flat hand with thumb across palm" },
    { sign: "C", title: "The Letter C", description: "Form a C shape with your hand" },
  ],
  "Numbers 1-10": [
    { sign: "1", title: "Number One", description: "Point index finger upward" },
    { sign: "2", title: "Number Two", description: "Extend index and middle finger" },
    { sign: "3", title: "Number Three", description: "Extend thumb, index, and middle finger" },
  ],
  "Common Greetings": [
    { sign: "Hello", title: "Hello/Hi", description: "Wave your hand or touch forehead and move forward" },
    { sign: "Thank You", title: "Thank You", description: "Touch fingers to chin and move forward" },
    { sign: "Please", title: "Please", description: "Circular motion on chest with flat hand" },
  ]
};

// Instructions with step-by-step guidance
const INSTRUCTIONS = {
  "A": [
    "Make a fist with your dominant hand",
    "Keep your thumb pointing upward along the side of your fist",
    "Hold your hand at chest level",
    "Ensure fingers are curled tightly"
  ],
  "Hello": [
    "Start with your hand near your forehead or temple",
    "Touch your forehead lightly with your fingers",
    "Move your hand forward and slightly away from your head",
    "Can also be signed as a simple wave"
  ],
  "1": [
    "Extend your index finger straight up",
    "Keep all other fingers curled into your palm",
    "Point your finger toward the sky",
    "Hold at chest or shoulder height"
  ]
};

console.log("Sample data structure ready!");
console.log("To seed data:");
console.log("1. Use the admin interface at /admin");
console.log("2. Click 'Create Module' and 'Create Lesson' buttons");
console.log("3. Copy data from SAMPLE_MODULES and SAMPLE_LESSONS arrays above");
console.log("\nOr integrate this with Firebase Admin SDK for automated seeding.");
