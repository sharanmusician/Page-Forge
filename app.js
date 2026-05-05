import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

const PageForge = () => {
  const [images, setImages] = useState([]);
  const [isForging, setIsForging] = useState(false);

  // Function to handle adding images (Append to current list)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  // The "Forge" Logic
  const forgePDF = async () => {
    if (images.length === 0) return alert("The forge is empty! Add images.");
    
    setIsForging(true);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < images.length; i++) {
      if (i > 0) pdf.addPage();
      
      const imgData = await getBase64(images[i].file);
      // Logic to scale image to fit A4 while maintaining margins
      pdf.addImage(imgData, 'JPEG', 10, 10, pageWidth - 20, 0);
    }

    pdf.save('PageForge_Document.pdf');
    setIsForging(false);
  };

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
  };

  return (
    <div className="forge-container">
      <header className="forge-header">
        <h1>PAGE FORGE</h1>
        <p>Premium Image-to-PDF Craftsmanship</p>
      </header>

      <main className="workspace">
        <div className="toolbar">
          <label className="btn-secondary">
            + Add Images
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} hidden />
          </label>
          
          <button 
            className="btn-primary" 
            onClick={forgePDF} 
            disabled={isForging}
          >
            {isForging ? 'Forging...' : 'Forge PDF'}
          </button>

          <button className="btn-danger" onClick={() => setImages([])}>Clear Forge</button>
        </div>

        <div className="preview-grid">
          {images.map((img, index) => (
            <div key={index} className="image-card">
              <img src={img.url} alt="preview" />
              <span>{index + 1}</span>
            </div>
          ))}
          {images.length === 0 && <div className="placeholder">Forge is cold. Add images to start.</div>}
        </div>
      </main>
    </div>
  );
};

export default PageForge;
