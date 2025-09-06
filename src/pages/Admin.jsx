import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeManagement, setActiveManagement] = useState(''); // 'events', 'team', 'gallery'
  const [events, setEvents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'upcoming',
    date: '',
    time: '',
    title: '',
    description: '',
    location: '',
    image: '',
    link: '',
    linkText: '',
    tags: []
  });
  const [newMember, setNewMember] = useState({
    name: '',
    position: '',
    bio: '',
    initials: '',
    photo: ''
  });
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    eventId: ''
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await api.post('/auth/verify', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Check if locked due to too many attempts
    if (isLocked) {
      setStatus({ type: 'error', message: 'Please wait before trying again.' });
      return;
    }
    
    // Input validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setStatus({ type: 'error', message: 'Please enter both username and password' });
      return;
    }
    
    // Basic input sanitization
    const sanitizedCredentials = {
      username: credentials.username.trim().toLowerCase(),
      password: credentials.password.trim()
    };
    
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      const response = await api.post('/auth/login', sanitizedCredentials);
      const { token } = response.data.data;
      localStorage.setItem('adminToken', token);
      setIsAuthenticated(true);
      fetchData();
      setStatus({ type: 'success', message: 'Login successful!' });
      // Clear credentials from memory for security
      setCredentials({ username: '', password: '' });
      // Reset failed attempts on successful login
      setLoginAttempts(0);
      setIsLocked(false);
    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Lock after 3 failed attempts
      if (newAttempts >= 3) {
        setIsLocked(true);
        // Auto-unlock after 5 minutes
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
        }, 5 * 60 * 1000);
        setStatus({ type: 'error', message: 'Too many failed attempts. Account locked for 5 minutes.' });
      } else {
        const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
        setStatus({ type: 'error', message: `${errorMessage} (${newAttempts}/3 attempts)` });
      }
      
      // Clear password field on error
      setCredentials(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
  };

  const fetchData = async () => {
    try {
      const [eventsRes, teamRes, galleryRes] = await Promise.all([
        api.get('/events'),
        api.get('/team'),
        api.get('/gallery')
      ]);
      setEvents(eventsRes.data.data || []);
      setTeamMembers(teamRes.data.data || []);
      setGalleryItems(galleryRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.post('/events', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Event added successfully!' });
      setNewEvent({
        type: 'upcoming',
        date: '',
        time: '',
        title: '',
        description: '',
        location: '',
        image: '',
        link: '',
        linkText: '',
        tags: []
      });
      fetchData();
    } catch (error) {
      console.error('Add event error:', error.response?.data || error.message);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.details ? 
          error.response.data.details.join(', ') : 
          'Failed to add event'
      });
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.post('/team', newMember, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Team member added successfully!' });
      setNewMember({
        name: '',
        position: '',
        bio: '',
        initials: '',
        photo: ''
      });
      fetchData();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to add team member' });
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Event deleted successfully!' });
      fetchData();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to delete event' });
    }
  };

  const deleteTeamMember = async (id) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/team/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Team member removed successfully!' });
      fetchData();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to remove team member' });
    }
  };

  const addGalleryItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.post('/gallery', newGalleryItem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Gallery item added successfully!' });
      setNewGalleryItem({
        title: '',
        description: '',
        imageUrl: '',
        eventId: ''
      });
      fetchData();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to add gallery item' });
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Gallery item deleted successfully!' });
      fetchData();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to delete gallery item' });
    }
  };

  // Edit Functions
  const startEditEvent = (event) => {
    setEditingEvent({
      ...event,
      tags: Array.isArray(event.tags) ? event.tags : []
    });
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.put(`/events/${editingEvent.id}`, editingEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Event updated successfully!' });
      setEditingEvent(null);
      fetchData();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update event' });
    } finally {
      setLoading(false);
    }
  };

  const startEditMember = (member) => {
    setEditingMember({ ...member });
  };

  const updateMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.put(`/team/${editingMember.id}`, editingMember, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Team member updated successfully!' });
      setEditingMember(null);
      fetchData();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update team member' });
    } finally {
      setLoading(false);
    }
  };

  const startEditGalleryItem = (item) => {
    setEditingGalleryItem({ ...item });
  };

  const updateGalleryItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await api.put(`/gallery/${editingGalleryItem.id}`, editingGalleryItem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Gallery item updated successfully!' });
      setEditingGalleryItem(null);
      fetchData();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update gallery item' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card max-w-md w-full"
        >
          <h1 className="text-3xl font-orbitron font-bold text-center mb-8 neon-text">
            Admin Login
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
                required
                autoComplete="username"
                maxLength={50}
                disabled={isLocked}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
                required
                autoComplete="current-password"
                maxLength={100}
                disabled={isLocked}
              />
            </div>

            {isLocked && (
              <div className="p-4 rounded-lg bg-orange-500 bg-opacity-20 border border-orange-500 text-orange-400">
                ⚠️ Account temporarily locked due to multiple failed attempts. Please try again later.
              </div>
            )}

            {status.message && (
              <div className={`p-4 rounded-lg ${
                status.type === 'success' 
                  ? 'bg-green-500 bg-opacity-20 border border-green-500 text-green-400'
                  : 'bg-red-500 bg-opacity-20 border border-red-500 text-red-400'
              }`}>
                {status.message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || isLocked}
              className={`w-full btn-primary ${(loading || isLocked) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold neon-text text-center sm:text-left">
            🛠️ Admin Control Panel
          </h1>
          <button
            onClick={handleLogout}
            className="btn-secondary self-center sm:self-auto"
          >
            Logout
          </button>
        </div>

        {status.message && (
          <div className={`p-4 rounded-lg mb-6 ${
            status.type === 'success' 
              ? 'bg-green-500 bg-opacity-20 border border-green-500 text-green-400'
              : 'bg-red-500 bg-opacity-20 border border-red-500 text-red-400'
          }`}>
            {status.message}
          </div>
        )}

        {/* Dashboard Overview */}
        {activeManagement === '' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Events Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-4 sm:p-6 text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">📅</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan mb-2">
                  {events.length}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">
                  Total Events
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6">
                  Manage your club events, workshops, and activities
                </p>
                <button
                  onClick={() => setActiveManagement('events')}
                  className="w-full btn-primary text-sm sm:text-base"
                >
                  Manage Events
                </button>
              </motion.div>

              {/* Team Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-4 sm:p-6 text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">👥</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan mb-2">
                  {teamMembers.length}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">
                  Team Members
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6">
                  Add and manage your club team members
                </p>
                <button
                  onClick={() => setActiveManagement('team')}
                  className="w-full btn-primary text-sm sm:text-base"
                >
                  Manage Team
                </button>
              </motion.div>

              {/* Gallery Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">🖼️</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan mb-2">
                  {galleryItems.length}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">
                  Gallery Items
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6">
                  Manage your club's photo gallery and memories
                </p>
                <button
                  onClick={() => setActiveManagement('gallery')}
                  className="w-full btn-primary text-sm sm:text-base"
                >
                  Manage Gallery
                </button>
              </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-4 sm:mb-6">
                📊 Quick Overview
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center p-3 sm:p-4 bg-black bg-opacity-30 rounded-lg border border-gray-600">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-neon-cyan">
                    {events.filter(e => e.type === 'upcoming').length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">Upcoming Events</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-black bg-opacity-30 rounded-lg border border-gray-600">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-neon-magenta">
                    {events.filter(e => e.type === 'past').length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">Past Events</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-black bg-opacity-30 rounded-lg border border-gray-600">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-neon-yellow">
                    {teamMembers.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">Active Members</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-black bg-opacity-30 rounded-lg border border-gray-600">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">
                    {galleryItems.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300">Photos</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Button for Management Sections */}
        {activeManagement !== '' && (
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => setActiveManagement('')}
              className="btn-secondary text-sm sm:text-base"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}

        {/* Events Management */}
        {activeManagement === 'events' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-4 sm:mb-6">
                Add New Event
              </h2>
              <form onSubmit={addEvent} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    placeholder="e.g., Tech Hub, Online, Conference Room"
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white resize-none text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Image URL
                  </label>
                  <input
                    type="url"
                    value={newEvent.image}
                    onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    placeholder="https://example.com/event-image.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={newEvent.link}
                    onChange={(e) => setNewEvent({...newEvent, link: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Link Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={newEvent.linkText}
                    onChange={(e) => setNewEvent({...newEvent, linkText: e.target.value})}
                    placeholder="e.g., Register Now"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(newEvent.tags) ? newEvent.tags.join(', ') : ''}
                    onChange={(e) => setNewEvent({
                      ...newEvent, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    placeholder="e.g., Tech, Open, Workshop"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary w-full sm:w-auto text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Adding...' : 'Add Event'}
                  </button>
                </div>
              </form>
            </div>

            {/* Events List */}
            <div className="card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-4 sm:mb-6">
                Current Events ({events.length})
              </h2>
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="border border-gray-600 rounded-lg p-3 sm:p-4 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white">{event.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs w-fit ${
                          event.type === 'upcoming' 
                            ? 'bg-green-500 bg-opacity-20 text-green-400'
                            : 'bg-gray-500 bg-opacity-20 text-gray-400'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                      <p className="text-sm text-neon-magenta mb-1">{event.date} {event.time && `• ${event.time}`}</p>
                      {event.location && <p className="text-sm text-neon-cyan mb-1">📍 {event.location}</p>}
                      <p className="text-gray-300 text-sm mb-2">{event.description}</p>
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {event.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {event.link && (
                        <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-neon-cyan text-sm hover:underline">
                          {event.linkText || 'Learn More'} →
                        </a>
                      )}
                    </div>
                    <div className="flex flex-row lg:flex-col gap-2">
                      <button
                        onClick={() => startEditEvent(event)}
                        className="flex-1 lg:flex-none px-3 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors duration-300 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="flex-1 lg:flex-none px-3 py-1 bg-red-500 bg-opacity-20 border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors duration-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Management */}
        {activeManagement === 'team' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-4 sm:mb-6">
                Add New Team Member
              </h2>
              <form onSubmit={addTeamMember} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={newMember.position}
                    onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Initials
                  </label>
                  <input
                    type="text"
                    value={newMember.initials}
                    onChange={(e) => setNewMember({...newMember, initials: e.target.value.toUpperCase()})}
                    maxLength={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newMember.photo}
                    onChange={(e) => setNewMember({...newMember, photo: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={newMember.bio}
                    onChange={(e) => setNewMember({...newMember, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white resize-none text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary w-full sm:w-auto text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Adding...' : 'Add Team Member'}
                  </button>
                </div>
              </form>
            </div>

            {/* Team Members List */}
            <div className="card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-4 sm:mb-6">
                Current Team Members ({teamMembers.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full flex items-center justify-center text-black font-bold overflow-hidden">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span className={member.photo ? 'hidden' : 'flex items-center justify-center w-full h-full'}>
                          {member.initials}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-sm sm:text-base">{member.name}</h3>
                        <p className="text-xs sm:text-sm text-neon-magenta">{member.position}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3">{member.bio}</p>
                    <button
                      onClick={() => deleteTeamMember(member.id)}
                      className="w-full px-3 py-1 bg-red-500 bg-opacity-20 border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors duration-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Management */}
        {activeManagement === 'gallery' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-4 sm:mb-6">
                Add Gallery Item
              </h2>
              <form onSubmit={addGalleryItem} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newGalleryItem.title}
                    onChange={(e) => setNewGalleryItem({...newGalleryItem, title: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newGalleryItem.description}
                    onChange={(e) => setNewGalleryItem({...newGalleryItem, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white resize-none text-sm sm:text-base"
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newGalleryItem.imageUrl}
                    onChange={(e) => setNewGalleryItem({...newGalleryItem, imageUrl: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Related Event (Optional)
                  </label>
                  <select
                    value={newGalleryItem.eventId}
                    onChange={(e) => setNewGalleryItem({...newGalleryItem, eventId: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  >
                    <option value="">Select an event (optional)</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary w-full sm:w-auto text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Adding...' : 'Add Gallery Item'}
                  </button>
                </div>
              </form>
            </div>

            {/* Gallery Items List */}
            <div className="card p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-4 sm:mb-6">
                Current Gallery Items ({galleryItems.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryItems.map(item => (
                  <div key={item.id} className="border border-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-white mb-2 text-sm sm:text-base">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-300 text-xs sm:text-sm mb-2">{item.description}</p>
                      )}
                      <button
                        onClick={() => deleteGalleryItem(item.id)}
                        className="w-full px-3 py-2 bg-red-500 bg-opacity-20 border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors duration-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Edit Event Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-4 sm:mb-6">Edit Event</h2>
              <form onSubmit={updateEvent} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={editingEvent.type}
                    onChange={(e) => setEditingEvent({...editingEvent, type: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={editingEvent.time || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={editingEvent.location || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white resize-none text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={editingEvent.image || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, image: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Link</label>
                  <input
                    type="url"
                    value={editingEvent.link || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, link: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Link Text</label>
                  <input
                    type="text"
                    value={editingEvent.linkText || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, linkText: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                  <input
                    type="text"
                    value={Array.isArray(editingEvent.tags) ? editingEvent.tags.join(', ') : ''}
                    onChange={(e) => setEditingEvent({
                      ...editingEvent,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black bg-opacity-50 border-2 border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none text-white text-sm sm:text-base"
                  />
                </div>
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 text-sm sm:text-base"
                  >
                    {loading ? 'Updating...' : 'Update Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="btn-secondary flex-1 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
