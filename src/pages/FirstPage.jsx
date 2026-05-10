
import React, { useState, useRef } from 'react';
import './css/FirstPage.css';
import Sidebar from '../components/Sidebar';

function FirstPage() {
  const [images, setImages] = useState([null, null, null]);
  const [previewIndex, setPreviewIndex] = useState(null); // 현재 키오스크에 보일 이미지 인덱스
  const fileInputRef = useRef(null);
  const [pickingIndex, setPickingIndex] = useState(null);

  const handleBoxClick = (index) => {
    if (images[index]) {
      // 이미 이미지가 있다면 프리뷰만 교체
      setPreviewIndex(index);
    } else {
      // 이미지가 없다면 파일 업로드 실행
      setPickingIndex(index);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && pickingIndex !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[pickingIndex] = reader.result;
        setImages(newImages);
        setPreviewIndex(pickingIndex); // 업로드 즉시 프리뷰에 반영
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleDelete = (index, e) => {
    e.stopPropagation();
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
    if (previewIndex === index) {
      setPreviewIndex(null); // 프리뷰 중인 이미지가 삭제되면 프리뷰 초기화
    }
  };

  return (
    <div className="first-page">
      <nav className="main-navbar">
        <img src="/img/MALO.svg" alt="MALO Logo" className="main-navbar-logo" />
        <span className="main-navbar-right">미림점 1번 키오스크</span>
      </nav>
      <Sidebar />
      <main className="main-content">
        <h1 className="main-title">첫화면</h1>
        <div className="main-layout">
          <div className="home-preview-frame">
            <img src="/img/home.svg" alt="Home" className="home-preview-img" />
            <div className="kiosk-ad-display">
              {previewIndex !== null && images[previewIndex] && (
                <img 
                  src={images[previewIndex]} 
                  alt="Kiosk Preview" 
                  className="kiosk-ad-preview-item" 
                />
              )}
            </div>
          </div>
          <div className="ad-section">
            <h2 className="ad-section-title">적용된 광고 이미지</h2>
            <div className="ad-grid">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className={`ad-box ${previewIndex === index ? 'active' : ''}`} 
                  onClick={() => handleBoxClick(index)}
                  style={{ 
                    backgroundImage: img ? `url(${img})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!img && (
                    <img src="/img/noImage.svg" alt="No Image" className="ad-box-main-img" />
                  )}
                  <img 
                    src="/img/x.svg" 
                    alt="Delete" 
                    className="ad-box-delete-btn" 
                    onClick={(e) => handleDelete(index, e)}
                  />
                </div>
              ))}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default FirstPage;
