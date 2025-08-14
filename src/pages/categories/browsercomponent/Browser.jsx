import React, { useState, useEffect } from "react";
import { Book, List, CheckSquare, ToggleLeft, CreditCard, Loader, Radio, MousePointerClick, Plus, Search, Sun, Moon, Grid, List as ListIcon } from "lucide-react";
import "./browse.css";
import UIUploadModal from "../../../components/UIUploadModal";
import UIComponentCard from "../../../components/UIComponentCard";

const UIGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

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
  }, [selectedCategory, searchTerm]);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
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
            <div className="search-container">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="view-controls">
              <button 
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <ListIcon size={18} />
              </button>
            </div>
            
            <button 
              className="upload-button"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} />
              Upload
            </button>
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
          <div className={`components-container ${viewMode}-view`}>
            {components.map((component) => (
              <UIComponentCard
                key={component._id || component.id}
                component={component}
                viewMode={viewMode}
                theme={isDarkMode ? 'dark' : 'light'}
              />
            ))}
          </div>
        )}
      </main>

      <UIUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default UIGallery;
