const axios = require('axios');

const students = [
  { email: 'student1@example.com', password: 'password1', mobile: '1111111111', studentId: 'S101' },
  { email: 'student2@example.com', password: 'password2', mobile: '2222222222', studentId: 'S102' },
  // Add more students as needed
];

async function registerStudents() {
  for (const student of students) {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', student);
      console.log(`Registered: ${student.email}`, res.data);
    } catch (err) {
      if (err.response) {
        console.log(`Failed: ${student.email}`, err.response.data);
      } else {
        console.log(`Error: ${student.email}`, err.message);
      }
    }
  }
}

registerStudents(); 