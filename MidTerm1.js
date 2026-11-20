//SET 2

const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory array
let students = [];
let nextId = 1;


// 1. POST - Add a new student
app.post('/api/students', (req, res) => {

    const { name, course, age } = req.body;

    // Check missing or invalid data
    if (
        typeof name !== 'string' || name.trim() === '' ||
        typeof course !== 'string' || course.trim() === '' ||
        typeof age !== 'number' || !Number.isFinite(age) || age < 0
    ) {
        return res.status(400).json({
            message: 'Missing or invalid data'
        });
    }

    // Check duplicate name
    const duplicate = students.find(
        s => s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({
            message: 'Student name already exists'
        });
    }

    // Create new student
    const newStudent = {
        id: nextId++,
        name: name.trim(),
        course: course.trim(),
        age: age
    };

    students.push(newStudent);

    res.status(201).json({
        message: 'Student added successfully',
        student: newStudent
    });
});


// 2. GET - Get all students
app.get('/api/students', (req, res) => {

    const { course } = req.query;

    if (course) {
        const filteredStudents = students.filter(
            s => s.course.toLowerCase() === course.toLowerCase()
        );

        return res.status(200).json(filteredStudents);
    }

    res.status(200).json(students);
});


// 3. GET - Get student by ID
app.get('/api/students/:id', (req, res) => {

    const id = Number(req.params.id);

    const student = students.find(
        s => s.id === id
    );

    if (!Number.isInteger(id) || id <= 0 || !student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    res.status(200).json(student);
});


// 4. PUT - Update student by ID
app.put('/api/students/:id', (req, res) => {

    const id = Number(req.params.id);

    const student = students.find(
        s => s.id === id
    );

    if (!Number.isInteger(id) || id <= 0 || !student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const { name, course, age } = req.body;

    // Validate data
    if (
        typeof name !== 'string' || name.trim() === '' ||
        typeof course !== 'string' || course.trim() === '' ||
        typeof age !== 'number' || !Number.isFinite(age) || age < 0
    ) {
        return res.status(400).json({
            message: 'Missing or invalid data'
        });
    }

    // Check duplicate name
    const duplicate = students.find(
        s => s.id !== id &&
        s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({
            message: 'Student name already exists'
        });
    }

    // Update student
    student.name = name.trim();
    student.course = course.trim();
    student.age = age;

    res.status(200).json({
        message: 'Student updated successfully',
        student: student
    });
});


// 5. DELETE - Delete student by ID
app.delete('/api/students/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = students.findIndex(
        s => s.id === id
    );

    if (!Number.isInteger(id) || id <= 0 || index === -1) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const deletedStudent = students.splice(index, 1);

    res.status(200).json({
        message: 'Student deleted successfully',
        student: deletedStudent[0]
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
