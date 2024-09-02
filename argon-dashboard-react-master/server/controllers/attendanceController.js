const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new Attendance record
exports.createAttendance = async (req, res) => {
    try {
        const { employee_id, date, status, hours_worked, reason } = req.body;
        if (!employee_id || !date || !status) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const attendance = new Attendance({ employee_id, date, status, hours_worked, reason });
        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Attendance records without pagination
exports.getAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find()
            .populate('employee_id', 'name position');
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single Attendance record by ID
exports.getAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const attendance = await Attendance.findById(id).populate('employee_id', 'name position');
        if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an Attendance record by ID
exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const attendance = await Attendance.findByIdAndUpdate(id, req.body, { new: true });
        if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Delete an Attendance record by ID
exports.deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const attendance = await Attendance.findByIdAndDelete(id);
        if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
        res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Attendance records by employee ID
exports.getAttendanceByEmployeeId = async (req, res) => {
    try {
        const { employeeId } = req.params;
        if (!isValidObjectId(employeeId)) {
            return res.status(400).json({ message: 'Invalid Employee ID format' });
        }

        const attendanceRecords = await Attendance.find({ employee_id: employeeId });
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
