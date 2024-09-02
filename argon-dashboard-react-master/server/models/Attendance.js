const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['To Define', 'Present', 'Absent'],
    default: 'To Define'
  },
  hours_worked: {
    type: Number,
    default: null
  },
  reason: {
    type: String,
    enum: ['Congé', 'Imprévu', 'Retard', 'Autorisation'],
    default: null
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
