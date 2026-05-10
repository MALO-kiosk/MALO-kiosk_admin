
import React, { useState } from 'react';
import './css/MenuPage.css';
import Sidebar from '../components/Sidebar';

function MenuPage() {
  const [images] = useState([null, null, null]);
  const [previewIndex] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState('미리보기'); // 현재 메인에 표시될 모드

  // 메뉴 리스트 데이터
  const [menuItems] = useState([
    { id: 1, name: '아메리카노', price: '3,000원', image: '/img/coffee.svg' },
    { id: 2, name: '카페라떼', price: '3,500원', image: '/img/latte.svg' },
    { id: 3, name: '녹차', price: '3,000원', image: '/img/tea.svg' },
    { id: 4, name: '스트로베리말차', price: '3,900원', image: '/img/Rectangle.svg' },
    { id: 5, name: '에스프레소', price: '2,500원', image: '/img/coffee.svg' },
  ]);

  // 선택된 메뉴 상태
  const [selectedMenu, setSelectedMenu] = useState(menuItems[0]);
  const [editName, setEditName] = useState(menuItems[0].name);
  const [editPrice, setEditPrice] = useState(menuItems[0].price);

  const handleMainClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubItemClick = (mode) => {
    setSelectedMode(mode);
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (item) => {
    setSelectedMenu(item);
    setEditName(item.name);
    setEditPrice(item.price);
  };

  // 선택되지 않은 나머지 모드 찾기
  const otherMode = selectedMode === '미리보기' ? '쉬운모드' : '미리보기';

  return (
    <div className="menu-page">
      <nav className="main-navbar">
        <img src="/img/MALO.svg" alt="MALO Logo" className="main-navbar-logo" />
        <span className="main-navbar-right">미림점 1번 키오스크</span>
      </nav>
      <Sidebar />
      <main className="main-content">
        <h1 className="main-title">메뉴판</h1>
        <div className="main-layout">
          <div className="menu-control-container">
            <div className="menu-control-main" onClick={handleMainClick}>
              <span>{selectedMode}</span>
              <img 
                src={isMenuOpen ? "/img/up.svg" : "/img/down.svg"} 
                alt="arrow" 
                className="control-arrow" 
              />
            </div>
            {isMenuOpen && (
              <div className="menu-control-dropdown">
                <div 
                  className="menu-control-sub-item"
                  onClick={() => handleSubItemClick(otherMode)}
                >
                  <span>{otherMode}</span>
                </div>
              </div>
            )}
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

          <div className="menu-management-wrapper">
            {/* 메뉴 수정 섹션 */}
            <div className="menu-section">
              <h2 className="menu-add-title">메뉴</h2>
              <div className="menu-add-card">
                <div className="menu-image-placeholder">
                  <img 
                    src={selectedMenu ? selectedMenu.image : "/img/noImage.svg"} 
                    alt="menu" 
                    className={selectedMenu ? "full-image" : ""}
                  />
                </div>
                <div className="menu-form">
                  <div className="menu-input-group">
                    <label className="menu-label">메뉴 이름</label>
                    <input 
                      type="text" 
                      className="menu-input" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="메뉴 이름"
                    />
                  </div>
                  <div className="menu-input-group">
                    <label className="menu-label">메뉴 가격</label>
                    <input 
                      type="text" 
                      className="menu-input" 
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="메뉴 가격"
                    />
                  </div>
                  <div className="menu-dropdown-row">
                    <div className="menu-dropdown">
                      <span>카테고리</span>
                      <img src="/img/down.svg" alt="down" />
                    </div>
                    <div className="menu-dropdown">
                      <span>카테고리</span>
                      <img src="/img/down.svg" alt="down" />
                    </div>
                  </div>
                </div>
                <button className="menu-add-button">메뉴 수정하기</button>
              </div>
            </div>

            {/* 메뉴 리스트 섹션 */}
            <div className="menu-list-section">
              <div className="menu-list-scroll">
                {menuItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`menu-item-card ${selectedMenu?.id === item.id ? 'selected' : ''}`}
                    onClick={() => handleMenuItemClick(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="menu-item-image-container">
                      <img src={item.image} alt={item.name} className="menu-item-image" />
                    </div>
                    <div className="menu-item-info">
                      <span className="menu-item-name">{item.name}</span>
                      <span className="menu-item-price">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 메뉴 추가 섹션 */}
            <div className="menu-add-section">
              <h2 className="menu-add-title">메뉴추가</h2>
              <div className="menu-add-card">
                <div className="menu-image-placeholder">
                  <img src="/img/noImage.svg" alt="no image" />
                </div>
                <div className="menu-form">
                  <div className="menu-input-group">
                    <label className="menu-label">메뉴 이름</label>
                    <input type="text" className="menu-input"/>
                  </div>
                  <div className="menu-input-group">
                    <label className="menu-label">메뉴 가격</label>
                    <input type="text" className="menu-input"/>
                  </div>
                  <div className="menu-dropdown-row">
                    <div className="menu-dropdown">
                      <span>카테고리</span>
                      <img src="/img/down.svg" alt="down" />
                    </div>
                    <div className="menu-dropdown">
                      <span>카테고리</span>
                      <img src="/img/down.svg" alt="down" />
                    </div>
                  </div>
                </div>
                <button className="menu-add-button">메뉴 추가하기</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default MenuPage;
