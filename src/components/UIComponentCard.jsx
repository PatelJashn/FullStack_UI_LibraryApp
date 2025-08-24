import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UIComponentCard.css';

const UIComponentCard = ({ component, viewMode = 'grid', theme = 'dark', isDeleteMode = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Don't navigate if we're in delete mode
    if (isDeleteMode) return;
    
    const componentId = component._id || component.id;
    console.log("Navigating to component:", componentId, "Component data:", component);
    navigate(`/component/${componentId}`, { 
      state: { component: component } 
    });
  };

  const cardClass = `ui-component-card ${viewMode}-view ${theme}-theme`;

  return (
    <div className={cardClass} onClick={handleCardClick}>
      <div className="component-preview">
        <iframe
          srcDoc={`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                html, body { 
                  margin: 0 !important; 
                  padding: 20px !important; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                  background: transparent !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  min-height: 100vh !important;
                  box-sizing: border-box !important;
                  width: 100% !important;
                  height: 100% !important;
                }
                
                /* Ensure all direct children of body are centered */
                body > * {
                  max-width: 100% !important;
                  max-height: 100% !important;
                }
                
                ${component.code?.css || ''}
              </style>
            </head>
            <body>
              ${component.code?.html || ''}
              <script>${component.code?.js || ''}</script>
            </body>
            </html>
          `}
          title={component.title}
          className="preview-iframe"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default UIComponentCard; 