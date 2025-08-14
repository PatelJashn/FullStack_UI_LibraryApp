import React, { useState } from 'react';
import { X, Upload, Code, FileText, Tag } from 'lucide-react';
import './UIUploadModal.css';

const UIUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    category: 'All',
    html: '',
    css: '',
    js: '',
    tags: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'All', 'Buttons', 'Checkboxes', 'Toggle switches', 
    'Cards', 'Loaders', 'Inputs', 'Radio buttons'
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

    try {
      const componentData = {
        title: `Component ${Date.now()}`, // Auto-generate title
        description: `UI Component in ${formData.category} category`, // Auto-generate description
        category: formData.category,
        code: {
          html: formData.html,
          css: formData.css,
          js: formData.js
        },
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch('http://localhost:5002/api/ui-components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(componentData),
      });

      if (response.ok) {
        const savedComponent = await response.json();
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
        const error = await response.json();
        alert('Error uploading component: ' + error.message);
      }
    } catch (error) {
      alert('Error uploading component: ' + error.message);
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

          <div className="code-section">
            <h3>Code</h3>
            
            <div className="form-group">
              <label>
                <Code size={16} />
                HTML *
              </label>
              <textarea
                name="html"
                value={formData.html}
                onChange={handleChange}
                placeholder="<div>Your HTML code here</div>"
                required
                rows={6}
                className="code-textarea"
              />
            </div>

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
                required
                rows={6}
                className="code-textarea"
              />
            </div>

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