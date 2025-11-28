import React, { useState } from 'react';
import { X, Upload, Code, FileText, Tag, Palette } from 'lucide-react';
import { useAuth } from './AuthContext';
import './UIUploadModal.css';

const UIUploadModal = ({ isOpen, onClose, onUpload }) => {
  const { token, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    category: 'All',
    html: '',
    css: '',
    js: '',
    tags: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [useTailwind, setUseTailwind] = useState(false);

  const categories = [
    'All', 'Buttons', 'Checkboxes', 'Toggle switches', 
    'Cards', 'Loaders', 'Inputs', 'Radio buttons', 'Forms'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // First, check if backend is reachable (with timeout)
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const healthCheck = await fetch(`${apiBaseUrl}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!healthCheck.ok) {
        throw new Error(`Backend health check failed: ${healthCheck.status}`);
      }
      console.log('✅ Backend is reachable');
    } catch (healthError) {
      console.error('❌ Backend health check failed:', healthError);
      const errorMsg = healthError.name === 'AbortError' 
        ? 'Backend server did not respond (timeout)'
        : healthError.message;
      alert(`Cannot connect to backend server at ${apiBaseUrl}.\n\nError: ${errorMsg}\n\nPlease make sure:\n1. The backend server is running (npm start in backend folder)\n2. The API URL is correct\n3. There are no firewall/network issues`);
      setIsLoading(false);
      return;
    }

    try {
      const componentData = {
        title: `Component ${Date.now()}`, // Auto-generate title
        description: `UI Component in ${formData.category} category`, // Auto-generate description
        category: formData.category,
        code: {
          html: formData.html,
          css: useTailwind ? '' : formData.css, // Empty CSS for Tailwind components
          js: formData.js
        },
        useTailwind: useTailwind,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Only add Authorization header if we have all three: token, authentication status, and user object
      // This ensures we never send invalid/expired tokens
      // If any of these are missing, upload will proceed as anonymous (which is fine)
      if (token && isAuthenticated && user && user._id) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('📤 Sending request with authentication');
      } else {
        console.log('📤 Sending request as anonymous user');
      }

      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/ui-components`;
      console.log('📤 Uploading to:', apiUrl);
      console.log('📤 Component data:', componentData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(componentData),
      });

      if (response.ok) {
        const savedComponent = await response.json();
        console.log('✅ Component uploaded successfully:', savedComponent);
        onUpload(savedComponent);
        onClose();
        setFormData({
          category: 'All',
          html: '',
          css: '',
          js: '',
          tags: ''
        });
      } else {
        let errorMessage = 'Failed to upload component';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        console.error('❌ Upload failed:', errorMessage);
        alert('Error uploading component: ' + errorMessage);
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // Provide more helpful error messages
      let errorMessage = 'Network error. ';
      if (error.message === 'Failed to fetch') {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
        errorMessage += `Cannot connect to backend server at ${apiUrl}. `;
        errorMessage += 'Please make sure the backend server is running.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      alert('Error uploading component: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal">
        <div className="upload-modal-header">
          <h2>Upload UI Code</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">

          <div className="form-group">
            <label>
              <Tag size={16} />
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <Tag size={16} />
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, button, modern"
            />
          </div>

          <div className="form-group">
            <label>
              <Palette size={16} />
              Styling Method
            </label>
            <div className="styling-toggle">
              <button
                type="button"
                className={`toggle-btn ${!useTailwind ? 'active' : ''}`}
                onClick={() => setUseTailwind(false)}
              >
                <Code size={14} />
                CSS
              </button>
              <button
                type="button"
                className={`toggle-btn ${useTailwind ? 'active' : ''}`}
                onClick={() => setUseTailwind(true)}
              >
                <Palette size={14} />
                Tailwind
              </button>
            </div>
          </div>

          <div className="code-section">
            <h3>Code</h3>
            
            <div className="form-group">
              <label>
                <Code size={16} />
                {useTailwind ? 'HTML with Tailwind Classes' : 'HTML'} *
              </label>
              <textarea
                name="html"
                value={formData.html}
                onChange={handleChange}
                placeholder={useTailwind ? '<button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Click me</button>' : "<div>Your HTML code here</div>"}
                required={true}
                rows={6}
                className="code-textarea"
              />
              {useTailwind && (
                <div className="tailwind-info">
                  <small>💡 Write your HTML with Tailwind classes directly in the elements. Example: &lt;button class="bg-blue-500 text-white px-4 py-2"&gt;Button&lt;/button&gt;</small>
                </div>
              )}
            </div>

            {!useTailwind && (
              <div className="form-group">
                <label>
                  <Code size={16} />
                  CSS *
                </label>
                <textarea
                  name="css"
                  value={formData.css}
                  onChange={handleChange}
                  placeholder="/* Your CSS styles here */"
                  required={!useTailwind}
                  rows={6}
                  className="code-textarea"
                />
              </div>
            )}

            <div className="form-group">
              <label>
                <Code size={16} />
                JavaScript (optional)
              </label>
              <textarea
                name="js"
                value={formData.js}
                onChange={handleChange}
                placeholder="// Your JavaScript code here"
                rows={4}
                className="code-textarea"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="upload-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Upload size={16} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Code
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UIUploadModal; 