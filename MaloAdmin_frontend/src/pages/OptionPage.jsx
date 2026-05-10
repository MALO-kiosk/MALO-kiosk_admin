
import React, { useState } from 'react';
import './css/OptionPage.css';
import Sidebar from '../components/Sidebar';

function OptionPage() {
  const [images] = useState([null, null, null]);
  const [previewIndex] = useState(null);

  return (
    <div className="option-page">
      <nav className="main-navbar">
        <img src="/img/MALO.svg" alt="MALO Logo" className="main-navbar-logo" />
        <span className="main-navbar-right">미림점 1번 키오스크</span>
      </nav>
      <Sidebar />
      <main className="main-content">
        <h1 className="main-title">옵션</h1>
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

          <div className="option-management-wrapper">
            <div className="option-add-section">
              <h2 className="option-add-title">옵션추가</h2>
              <div className="option-add-card">
                <div className="option-form">
                  <div className="option-input-group">
                    <label className="option-label">옵션 이름</label>
                    <input type="text" className="option-input"/>
                  </div>
                  <div className="option-input-group">
                    <label className="option-label">옵션 가격</label>
                    <input type="text" className="option-input"/>
                  </div>
                </div>
                <button className="option-add-button">옵션 추가하기</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default OptionPage;
