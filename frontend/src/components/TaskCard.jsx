import { useState } from 'react';

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    setLoading(true);
    await onUpdate(task._id, { status: e.target.value });
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setLoading(true);
    await onDelete(task._id);
    setLoading(false);
  };

  return (
    <div className="task-card" style={{ opacity: loading ? 0.5 : 1 }}>
      <p className="task-title">{task.title}</p>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <select
          className="select"
          value={task.status}
          onChange={handleStatusChange}
          disabled={loading}
        >
          <option value="todo">📋 Todo</option>
          <option value="inprogress">⚡ In Progress</option>
          <option value="done">✅ Done</option>
        </select>

        <button className="btn-danger" onClick={handleDelete} disabled={loading}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
