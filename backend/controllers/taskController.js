const Task = require('../models/Task');

// @desc Get all tasks for logged-in user
// @route GET /api/tasks
// @access Private

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}`});
  }
};

// @desc Create a new task
// @route POST /api/tasks
// @access Private

const createTask = async (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}`});
  }
};

// @desc Update a task
// @route PUT /api/tasks/:id
// @access Private

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found'});
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: `server error: ${error.message}`});
  }
};

// @desc Delete a task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };

