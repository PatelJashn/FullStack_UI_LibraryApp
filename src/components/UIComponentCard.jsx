import React, { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import './UIComponentCard.css';

const UIComponentCard = ({ component, viewMode = 'grid', theme = 'dark' }) => {
  const [showPreview, setShowPreview] = useState(true);

  const handleDownload = () => {
    const codeContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${component.title}</title>
    <style>
${component.code?.css || ''}
    </style>
</head>
<body>
${component.code?.html || ''}
    <script>
${component.code?.js || ''}
    </script>
</body>
</html>`;

    const blob = new Blob([codeContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.title.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const cardClass = `ui-component-card ${viewMode}-view ${theme}-theme`;

  return (
    <div className={cardClass}>
      <div className="card-header">
        <h3 className="card-title">{component.title}</h3>
        <div className="card-actions">
          <button 
            className="action-btn download-btn"
            onClick={handleDownload}
            title="Download"
          >
            <Download size={16} />
          </button>
          <button 
            className="action-btn preview-btn"
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? "Hide Preview" : "Show Preview"}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="card-preview">
          <div className="preview-content">
            <iframe
              srcDoc={`
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
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
      )}
    </div>
  );
};

export default UIComponentCard; 