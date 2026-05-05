import { useState } from "react";

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onAdd({ title, description });
    setTitle('');
    setDescription('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom: '2rem' }}>
      <h3>Add New Task</h3>
      <div style={{ marginBottom: '0.5rem' }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '0.5rem', width: '100%', marginBottom: '0.5rem'}}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '0.5rem', width: '100%' }}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm