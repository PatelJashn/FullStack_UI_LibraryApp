import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UIUploadModal from '../../components/UIUploadModal';
import './UploadPage.css';

const UploadPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsModalOpen(false);
    navigate('/categories'); // Redirect to categories after closing
  };

  const handleUpload = (newComponent) => {
    // Component uploaded successfully
    console.log('Component uploaded:', newComponent);
    // The modal will close and redirect to categories
  };

  return (
    <div className="upload-page">
      <UIUploadModal 
        isOpen={isModalOpen}
        onClose={handleClose}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default UploadPage;
