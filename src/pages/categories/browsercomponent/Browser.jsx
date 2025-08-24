import React, { useState, useEffect } from "react";
import { Book, List, CheckSquare, ToggleLeft, CreditCard, Loader, Radio, MousePointerClick, Plus, Sun, Moon, Trash2 } from "lucide-react";
import "./browse.css";
import UIUploadModal from "../../../components/UIUploadModal";
import UIComponentCard from "../../../components/UIComponentCard";

const UIGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState(new Set());
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  const categories = [
    { name: "All", icon: Book },
    { name: "Buttons", icon: List },
    { name: "Checkboxes", icon: CheckSquare },
    { name: "Toggle switches", icon: ToggleLeft },
    { name: "Cards", icon: CreditCard },
    { name: "Loaders", icon: Loader },
    { name: "Inputs", icon: MousePointerClick },
    { name: "Radio buttons", icon: Radio },
  ];

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  useEffect(() => {
    fetchComponents();
  }, [selectedCategory]);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`http://localhost:5002/api/ui-components?${params}`);
      if (response.ok) {
        const data = await response.json();
        setComponents(data.components || []);
      } else {
        setComponents([]);
      }
    } catch (error) {
      setComponents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (newComponent) => {
    setComponents(prev => [newComponent, ...prev]);
  };

  const handleDeleteModeToggle = () => {
    if (!isDeleteMode) {
      setShowPasswordModal(true);
    } else {
      setIsDeleteMode(false);
      setSelectedComponents(new Set());
    }
  };

  const handlePasswordSubmit = () => {
    if (password === "appleapple") {
      setIsDeleteMode(true);
      setShowPasswordModal(false);
      setPassword("");
    } else {
      alert("Incorrect password!");
      setPassword("");
    }
  };

  const handleComponentSelect = (componentId) => {
    if (!isDeleteMode) return;
    
    const newSelected = new Set(selectedComponents);
    if (newSelected.has(componentId)) {
      newSelected.delete(componentId);
    } else {
      newSelected.add(componentId);
    }
    setSelectedComponents(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedComponents.size === 0) {
      alert("Please select components to delete");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedComponents.size} component(s)?`)) {
      try {
        const deletePromises = Array.from(selectedComponents).map(async (componentId) => {
          const response = await fetch(`http://localhost:5002/api/ui-components/${componentId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          return response.ok ? componentId : null;
        });

        const deletedIds = await Promise.all(deletePromises);
        const successfulDeletes = deletedIds.filter(id => id !== null);

        if (successfulDeletes.length > 0) {
          setComponents(prev => prev.filter(component => 
            !successfulDeletes.includes(component._id || component.id)
          ));
          alert(`Successfully deleted ${successfulDeletes.length} component(s)`);
        }

        setIsDeleteMode(false);
        setSelectedComponents(new Set());
      } catch (error) {
        console.error('Error deleting components:', error);
        alert('Error deleting components: ' + error.message);
      }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`ui-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Categories</h2>
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        
        {categories.map(({ name, icon: Icon }) => (
          <div 
            key={name} 
            className={`sidebar-item ${selectedCategory === name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(name)}
          >
            <Icon size={18} />
            <span className="category-name">{name}</span>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-header">
          <div className="header-left">
            <h1 className="main-title">UI Gallery</h1>
          </div>
          
          <div className="main-actions">
            <button 
              className="upload-button"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} />
              Upload
            </button>

            <button 
              className={`delete-mode-button ${isDeleteMode ? 'active' : ''}`}
              onClick={handleDeleteModeToggle}
            >
              <Trash2 size={18} />
              {isDeleteMode ? 'Cancel' : 'Delete'}
            </button>

            {isDeleteMode && selectedComponents.size > 0 && (
              <button 
                className="delete-selected-button"
                onClick={handleDeleteSelected}
              >
                <Trash2 size={18} />
                Delete ({selectedComponents.size})
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : components.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎨</div>
            <h3>No components found</h3>
            <button 
              className="upload-button"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} />
              Upload Component
            </button>
          </div>
        ) : (
          <div className="components-container grid-view">
            {components.map((component) => (
              <div 
                key={component._id || component.id}
                className={`component-wrapper ${isDeleteMode ? 'delete-mode' : ''} ${selectedComponents.has(component._id || component.id) ? 'selected' : ''}`}
                onClick={() => handleComponentSelect(component._id || component.id)}
              >
                <UIComponentCard
                  component={component}
                  theme={isDarkMode ? 'dark' : 'light'}
                  isDeleteMode={isDeleteMode}
                />
                {isDeleteMode && (
                  <div className="selection-overlay">
                    <div className="selection-checkbox">
                      {selectedComponents.has(component._id || component.id) && (
                        <CheckSquare size={20} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <UIUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <h3>Enter Password</h3>
            <p>Please enter the password to enable delete mode</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="password-input"
              autoComplete="off"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handlePasswordSubmit();
                }
              }}
            />
            <div className="password-modal-actions">
              <button 
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="submit-button"
                onClick={handlePasswordSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIGallery;
