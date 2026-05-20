
import React, { useState, useRef, useEffect } from 'react';
import './css/FirstPage.css';
import Sidebar from '../components/Sidebar';

function FirstPage() {
  const [banners, setBanners] = useState([{}, {}, {}]); // 3개 슬롯
  const [previewIndex, setPreviewIndex] = useState(null);
  const fileInputRef = useRef(null);
  const [pickingIndex, setPickingIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);

  // DB에서 배너 로드
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const { getBanners } = await import('../utils/api');
        const res = await getBanners();
        if (res.success && Array.isArray(res.data)) {
          const bannerMap = {};
          res.data.forEach((b) => {
            bannerMap[b.position] = b;
          });
          const orderedBanners = [bannerMap[0] || {}, bannerMap[1] || {}, bannerMap[2] || {}];
          setBanners(orderedBanners);

          const defaultPreviewIndex = orderedBanners.findIndex((banner) => Boolean(banner?.image_url));
          setPreviewIndex(defaultPreviewIndex !== -1 ? defaultPreviewIndex : null);
        }
      } catch (err) {
        console.error('Load banners error:', err);
      }
    };
    loadBanners();
  }, []);

  const handleBoxClick = (index) => {
    if (uploading || deletingIndex !== null) return;
    if (banners[index]?.image_url) {
      setPreviewIndex(index);
    } else {
      setPickingIndex(index);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    if (uploading) {
      e.target.value = '';
      return;
    }
    const file = e.target.files[0];
    if (file && pickingIndex !== null) {
      setUploading(true);
      try {
        const { uploadBanner } = await import('../utils/api');
        const res = await uploadBanner(file, pickingIndex);
        if (res.success && res.data && res.data.length > 0) {
          const newBanners = [...banners];
          newBanners[pickingIndex] = res.data[0];
          setBanners(newBanners);
          setPreviewIndex(pickingIndex);
          alert('배너가 업로드되었습니다.');
        } else {
          alert('배너 업로드 실패');
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('업로드 중 오류 발생');
      } finally {
        setUploading(false);
      }
    }
    e.target.value = '';
  };

  const handleDelete = async (index, e) => {
    e.stopPropagation();
    if (!banners[index]?.id) return;
    if (deletingIndex !== null) return;
    setDeletingIndex(index);
    
    try {
      const { deleteBanner } = await import('../utils/api');
      const res = await deleteBanner(banners[index].id, banners[index].file_name);
      if (res.success) {
        const newBanners = [...banners];
        newBanners[index] = {};
        setBanners(newBanners);
        if (previewIndex === index) {
          setPreviewIndex(null);
        }
        alert('배너가 삭제되었습니다.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('삭제 중 오류 발생');
    } finally {
      setDeletingIndex(null);
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
              {previewIndex !== null && banners[previewIndex]?.image_url && (
                <img 
                  src={banners[previewIndex].image_url} 
                  alt="Kiosk Preview" 
                  className="kiosk-ad-preview-item" 
                />
              )}
            </div>
          </div>
          <div className="ad-section">
            <h2 className="ad-section-title">적용된 광고 이미지</h2>
            <div className="ad-grid">
              {banners.map((banner, index) => (
                <div 
                  key={index} 
                  className={`ad-box ${previewIndex === index ? 'active' : ''}`} 
                  onClick={() => handleBoxClick(index)}
                  style={{ 
                    backgroundImage: banner?.image_url ? `url(${banner.image_url})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!banner?.image_url && (
                    <img src="/img/noImage.svg" alt="No Image" className="ad-box-main-img" />
                  )}
                  <img 
                    src="/img/x.svg" 
                    alt="Delete" 
                    className="ad-box-delete-btn" 
                    onClick={(e) => handleDelete(index, e)}
                    style={{ opacity: deletingIndex === index ? 0.5 : 1, pointerEvents: deletingIndex !== null ? 'none' : 'auto' }}
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
              disabled={uploading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default FirstPage;
