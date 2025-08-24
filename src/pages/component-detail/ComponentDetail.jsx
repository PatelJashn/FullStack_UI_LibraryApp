import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Copy, Check, ArrowLeft, Code, Eye, Download, Send, Sparkles } from "lucide-react";
import "./ComponentDetail.css";

const ComponentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState({ html: false, css: false });
  const [activeTab, setActiveTab] = useState("preview");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  useEffect(() => {
    if (location.state && location.state.component) {
      setComponent(location.state.component);
      setLoading(false);
    } else {
      fetchComponent();
    }
  }, [id, location.state]);

  const fetchComponent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5002/api/ui-components/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComponent(data.component || data);
      } else {
        setComponent(null);
      }
    } catch (error) {
      console.error("Error fetching component:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadCode = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAiPrompt = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiProcessing(true);
    console.log("AI Prompt:", aiPrompt);
    setTimeout(() => {
      setIsAiProcessing(false);
      setAiPrompt("");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading component...</p>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="error-container">
        <h2>Component not found</h2>
        <p>Unable to load component with ID: {id}</p>
        <button onClick={() => navigate("/categories")} className="back-button">
          <ArrowLeft size={16} />
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="component-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => navigate("/categories")} className="back-button">
          <ArrowLeft size={20} />
          Back to Categories
        </button>
        <div className="header-info">
          <h1>{component.title}</h1>
          <div className="component-meta">
            <span className="category-tag">{component.category}</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="detail-content">
        {/* Left Side - Preview Panel */}
        <div className="preview-section">
          <div className="preview-frame">
            {component.code?.html || component.code?.css ? (
              <div 
                className="component-preview"
                dangerouslySetInnerHTML={{ 
                  __html: `
                    <style>${component.code?.css || ''}</style>
                    ${component.code?.html || ''}
                  `
                }}
              />
            ) : (
              <div className="no-preview">
                <p>No preview available</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Code and AI Panel */}
        <div className="code-section">
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === "html" ? "active" : ""}`}
              onClick={() => setActiveTab("html")}
            >
              <Code size={18} />
              HTML
            </button>
            <button
              className={`tab-button ${activeTab === "css" ? "active" : ""}`}
              onClick={() => setActiveTab("css")}
            >
              <Code size={18} />
              CSS
            </button>
            <button
              className={`tab-button ${activeTab === "ai" ? "active" : ""}`}
              onClick={() => setActiveTab("ai")}
            >
              <Sparkles size={18} />
              AI Assistant
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "html" && (
              <div className="code-container">
                <div className="code-header">
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(component.code?.html || '', "html")}
                  >
                    {copied.html ? <Check size={16} /> : <Copy size={16} />}
                    {copied.html ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="code-block html-code">
                  <code>{component.code?.html || ''}</code>
                </pre>
              </div>
            )}

            {activeTab === "css" && (
              <div className="code-container">
                <div className="code-header">
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(component.code?.css || '', "css")}
                  >
                    {copied.css ? <Check size={16} /> : <Copy size={16} />}
                    {copied.css ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="code-block css-code">
                  <code>{component.code?.css || ''}</code>
                </pre>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="ai-container">
                <div className="ai-header">
                  <h3>AI Code Assistant</h3>
                  <p>Describe the changes you want to make to this component</p>
                </div>
                
                <div className="ai-prompt-section">
                  <textarea
                    className="ai-prompt-input"
                    placeholder="e.g., 'Make the button rounded with a blue gradient', 'Add hover effects to all elements', 'Change the color scheme to dark mode'"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                  />
                  <button
                    className="ai-submit-button"
                    onClick={handleAiPrompt}
                    disabled={isAiProcessing || !aiPrompt.trim()}
                  >
                    {isAiProcessing ? (
                      <>
                        <div className="ai-loading-spinner"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Generate Changes
                      </>
                    )}
                  </button>
                </div>

                <div className="ai-info">
                  <h4>How it works:</h4>
                  <ul>
                    <li>Describe the changes you want in natural language</li>
                    <li>AI will analyze your request and modify the code</li>
                    <li>Preview will update automatically with the changes</li>
                    <li>You can download the modified code</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="component-details">
        <div className="detail-section">
          <h3>Description</h3>
          <p>{component.description || "No description available."}</p>
        </div>
        
        <div className="detail-section">
          <h3>Tags</h3>
          <div className="tags-container">
            {component.tags && component.tags.length > 0 ? (
              component.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))
            ) : (
              <span className="no-tags">No tags available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetail;
