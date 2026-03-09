export const metrics = {
  students: 1248,
  avgScore: 82.6,
  attendance: 94.1,
  passRate: 91.3
};

export const students = [
  { id: "STU-1001", name: "Aarav Sharma", grade: "10", section: "A", score: 93, attendance: 97, trend: "up" },
  { id: "STU-1002", name: "Diya Menon", grade: "10", section: "A", score: 89, attendance: 95, trend: "up" },
  { id: "STU-1003", name: "Ishaan Verma", grade: "9", section: "C", score: 73, attendance: 88, trend: "down" },
  { id: "STU-1004", name: "Nisha Reddy", grade: "11", section: "B", score: 84, attendance: 92, trend: "up" },
  { id: "STU-1005", name: "Kabir Khan", grade: "12", section: "D", score: 96, attendance: 98, trend: "up" },
  { id: "STU-1006", name: "Meera Iyer", grade: "8", section: "A", score: 67, attendance: 85, trend: "down" },
  { id: "STU-1007", name: "Rohan Das", grade: "9", section: "B", score: 79, attendance: 90, trend: "up" },
  { id: "STU-1008", name: "Sana Ali", grade: "11", section: "C", score: 87, attendance: 94, trend: "up" }
];

export const subjectAverages = {
  labels: ["Math", "Science", "English", "History", "Computer", "Economics"],
  scores: [84, 79, 88, 74, 91, 77]
};

export const monthlyPerformance = {
  labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  scores: [74, 76, 79, 81, 82, 84, 86]
};

export const classWisePassRate = {
  labels: ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"],
  values: [86, 89, 93, 91, 95]
};
