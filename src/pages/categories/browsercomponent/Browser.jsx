import React, { useState, useEffect } from "react";
import { Book, List, CheckSquare, ToggleLeft, CreditCard, Loader, Radio, MousePointerClick, Plus, Trash2, FileText } from "lucide-react";
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
    { name: "Forms", icon: FileText },
  ];

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  useEffect(() => {
    fetchComponents();
  }, [selectedCategory]);

  const fetchComponents = async () => {
    console.log('🔄 Fetching components for category:', selectedCategory);
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }

      // Force refresh for All category by adding a timestamp
      if (selectedCategory === "All") {
        params.append("_t", Date.now());
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/ui-components?${params}`);
      if (response.ok) {
        const data = await response.json();
        let fetchedComponents = data.components || [];
        
        console.log('📊 Fetched components:', fetchedComponents.length);
        console.log('📊 Response data:', data);
        
        // Sort components: put forms at the end in ALL categories
        fetchedComponents.sort((a, b) => {
          const aIsForm = a.category === "Forms";
          const bIsForm = b.category === "Forms";
          
          if (aIsForm && !bIsForm) return 1; // Forms go to the end
          if (!aIsForm && bIsForm) return -1; // Non-forms go to the beginning
          return 0; // Keep original order within each group
        });
        
        // Always update components when we get data
        console.log('📊 Setting components:', fetchedComponents.length);
        setComponents(fetchedComponents);
      } else {
        console.error("Failed to fetch components:", response.status);
        // Don't clear components on error, just log it
      }
    } catch (error) {
      console.error("Error fetching components:", error);
      // Don't clear components on error, just log it
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (newComponent) => {
    console.log('🔄 Adding new component:', newComponent.title, 'Category:', newComponent.category);
    console.log('📊 Current components before add:', components.length);
    
    setComponents(prev => {
      const updated = [newComponent, ...prev];
      console.log('📊 Components after add:', updated.length);
      return updated;
    });
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
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/ui-components/${componentId}`, {
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



  return (
    <div className={`ui-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Categories</h2>
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
              {isDeleteMode ? 'Cancel Delete Mode' : 'Delete Mode'}
            </button>

            {isDeleteMode && selectedComponents.size > 0 && (
              <>
                <button 
                  className="delete-selected-button"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 size={18} />
                  Delete ({selectedComponents.size})
                </button>
              </>
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
          <div className={`components-container grid-view ${selectedCategory === "All" || selectedCategory === "Forms" ? 'all-category' : ''}`}>
            {components.map((component) => (
              <div 
                key={component._id || component.id}
                className={`component-wrapper ${isDeleteMode ? 'delete-mode' : ''} ${selectedComponents.has(component._id || component.id) ? 'selected' : ''} ${component.category === "Forms" ? 'form-component' : ''}`}
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
