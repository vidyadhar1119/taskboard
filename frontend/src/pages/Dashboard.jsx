import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Inline add form state per column
  const [addingTo, setAddingTo] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get('/tasks');
        setTasks(res.data);
      } catch {
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

    const handleAddTask = async (status) => {
    if (!newTitle.trim()) return;
    try {
      const res = await API.post('/tasks', {
        title: newTitle,
        description: newDesc,
        status,
      });
      setTasks([res.data, ...tasks]);
      setNewTitle('');
      setNewDesc('');
      setAddingTo(null);
      toast.success('Task added!');
    } catch {
      toast.error('Failed to add task');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const res = await API.put(`/tasks/${id}`, updates);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      toast.success('Task updated!');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

    const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'todo',       label: 'Todo',        icon: '📋' },
    { key: 'inprogress', label: 'In Progress',  icon: '⚡' },
    { key: 'done',       label: 'Done',         icon: '✅' },
  ];

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">⚡ TaskBoard</div>
        <div className="navbar-user">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {user?.name}
          </span>
          <div className="user-avatar">{initial}</div>
          <button className="btn-ghost" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-body">
        <div className="dashboard-header">
          <h2 className="dashboard-title">My Workspace</h2>
          <p className="dashboard-subtitle">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="🔍  Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Showing {filtered.length} of {tasks.length}
          </span>
        </div>

        {loading && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '4rem' }}>
            Loading your tasks...
          </p>
        )}

        {/* Kanban Board */}
        {!loading && (
          <div className="kanban-board">
            {columns.map((col) => {
              const colTasks = filtered.filter((t) => t.status === col.key);
              return (
                <div key={col.key} className="kanban-column">

                  {/* Column Header */}
                  <div className="column-header">
                    <div className="column-title">
                      <span>{col.icon}</span>
                      <span>{col.label}</span>
                    </div>
                    <span className="column-count">{colTasks.length}</span>
                  </div>

                  {/* Task Cards */}
                  {colTasks.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem 0' }}>
                      No tasks here
                    </p>
                  )}

                  {colTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDelete={handleDeleteTask}
                      onUpdate={handleUpdateTask}
                    />
                  ))}

                  {/* Inline Add Form */}
                  {addingTo === col.key ? (
                    <div className="add-task-form">
                      <input
                        className="add-task-input"
                        type="text"
                        placeholder="Task title *"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        autoFocus
                      />
                      <input
                        className="add-task-input"
                        type="text"
                        placeholder="Description (optional)"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button className="btn-primary" style={{ flex: 1, padding: '0.5rem' }}
                          onClick={() => handleAddTask(col.key)}>
                          Add
                        </button>
                        <button className="btn-ghost" style={{ flex: 1, padding: '0.5rem' }}
                          onClick={() => { setAddingTo(null); setNewTitle(''); setNewDesc(''); }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button className="add-task-btn"
                      onClick={() => setAddingTo(col.key)}>
                      + Add Task
                    </button>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <Toast toasts={toast.toasts} />
    </>
  );
};

export default Dashboard;



