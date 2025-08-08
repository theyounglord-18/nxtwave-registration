const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://34.9.176.56:27017/devops_students', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

// Mongoose Schema
const StudentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const Student = mongoose.model('Student', StudentSchema);

// API: Register
app.post('/api/register', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send({ message: 'Student registered' });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: 'Error registering student' });
  }
});

// API: Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email, password });

  if (!student) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }

  res.send({ message: 'Login successful' });
});

app.listen(3000, () => console.log('Backend running on port 3000'));

