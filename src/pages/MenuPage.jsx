
import React, { useState, useEffect } from 'react';
import './css/MenuPage.css';
import Sidebar from '../components/Sidebar';
import HomePreviewFrame from '../components/HomePreviewFrame';
import { getMenuItems } from '../utils/api';
import { addMenuItem } from '../utils/api';

function MenuPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState('미리보기'); // 현재 메인에 표시될 모드

  // 메뉴 리스트 데이터 (DB에서 로드)
  const [menuItems, setMenuItems] = useState([]);

  // 선택된 메뉴 상태
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  
  // 새 메뉴 추가 입력 필드
  const [addName, setAddName] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addImage, setAddImage] = useState('/img/noImage.svg');

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

  const handleAddMenu = () => {
    if (!addName || !addPrice) {
      alert('메뉴 이름과 가격을 입력해주세요.');
      return;
    }
    (async () => {
      try {
        const payload = { name: addName, price: addPrice, image: addImage };
        const result = await addMenuItem(payload);
        if (result.success && result.data && result.data.length > 0) {
          const created = result.data[0];
          setMenuItems([...menuItems, created]);
          setAddName('');
          setAddPrice('');
          setAddImage('/img/noImage.svg');
          setSelectedMenu(created);
        } else {
          console.error('Failed to add menu:', result.error);
          alert('메뉴 추가에 실패했습니다. 콘솔을 확인하세요.');
        }
      } catch (err) {
        console.error('Add menu error:', err);
        alert('메뉴 추가 중 오류가 발생했습니다.');
      }
    })();
  };

  const handleAddImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAddImage(event.target?.result || '/img/noImage.svg');
      };
      reader.readAsDataURL(file);
    }
  };

  // 마운트 시 DB에서 메뉴 불러오기
  useEffect(() => {
    (async () => {
      try {
        const res = await getMenuItems();
        if (res.success && Array.isArray(res.data)) {
          setMenuItems(res.data);
          const first = res.data[0] || null;
          setSelectedMenu(first);
          setEditName(first?.name || '');
          setEditPrice(first?.price || '');
        } else {
          console.error('Menu fetch failed:', res.error);
        }
      } catch (err) {
        console.error('Error fetching menus:', err);
      }
    })();
  }, []);

  const handleUpdateMenu = () => {
    if (!selectedMenu) return;
    setMenuItems(menuItems.map(item => 
      item.id === selectedMenu.id 
        ? { ...item, name: editName, price: editPrice }
        : item
    ));
    setSelectedMenu({ ...selectedMenu, name: editName, price: editPrice });
  };

  const handleDeleteMenu = (id) => {
    const filtered = menuItems.filter(item => item.id !== id);
    setMenuItems(filtered);
    if (selectedMenu?.id === id) {
      setSelectedMenu(filtered[0] || null);
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result || '/img/noImage.svg';
        if (selectedMenu) {
          setMenuItems(menuItems.map(item =>
            item.id === selectedMenu.id
              ? { ...item, image: imageData }
              : item
          ));
          setSelectedMenu({ ...selectedMenu, image: imageData });
        }
      };
      reader.readAsDataURL(file);
    }
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
            <HomePreviewFrame view="menu" menuItems={menuItems} selectedMenu={selectedMenu} />
          </div>

          <div className="menu-management-wrapper">
            {/* 메뉴 수정 섹션 */}
            <div className="menu-section">
              <h2 className="menu-add-title">메뉴</h2>
              <div className="menu-add-card">
                <div className="menu-image-placeholder" onClick={() => document.getElementById('image-upload-edit')?.click()}>
                  <img 
                    src={selectedMenu ? selectedMenu.image : "/img/noImage.svg"} 
                    alt="menu" 
                    className={selectedMenu ? "full-image" : ""}
                  />
                  <input 
                    id="image-upload-edit"
                    type="file" 
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    style={{ display: 'none' }}
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
                <button className="menu-add-button" onClick={handleUpdateMenu}>메뉴 수정하기</button>
              </div>
            </div>

            {/* 메뉴 리스트 섹션 */}
            <div className="menu-list-section">
              <div className="menu-list-scroll">
                {menuItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`menu-item-card ${selectedMenu?.id === item.id ? 'selected' : ''}`}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <div 
                      className="menu-item-image-container"
                      onClick={() => handleMenuItemClick(item)}
                    >
                      <img src={item.image} alt={item.name} className="menu-item-image" />
                    </div>
                    <div 
                      className="menu-item-info"
                      onClick={() => handleMenuItemClick(item)}
                    >
                      <span className="menu-item-name">{item.name}</span>
                      <span className="menu-item-price">{item.price}</span>
                    </div>
                    <button 
                      className="menu-delete-button"
                      onClick={() => handleDeleteMenu(item.id)}
                      title="삭제"
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img src="/img/x.svg" alt="delete" style={{ width: '20px', height: '20px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 메뉴 추가 섹션 */}
            <div className="menu-add-section">
              <h2 className="menu-add-title">메뉴추가</h2>
              <div className="menu-add-card">
                <div className="menu-image-placeholder" onClick={() => document.getElementById('image-upload-add')?.click()}>
                  <img src={addImage} alt="menu" className={addImage !== '/img/noImage.svg' ? "full-image" : ""} />
                  <input 
                    id="image-upload-add"
                    type="file" 
                    accept="image/*"
                    onChange={handleAddImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="menu-form">
                  <div className="menu-input-group">
                    <label className="menu-label">메뉴 이름</label>
                    <input 
                      type="text" 
                      className="menu-input"
                      value={addName}
                      onChange={(e) => setAddName(e.target.value)}
                    />
                  </div>
                  <div className="menu-input-group">
                    <label className="menu-label">메뉴 가격</label>
                    <input 
                      type="text" 
                      className="menu-input"
                      value={addPrice}
                      onChange={(e) => setAddPrice(e.target.value)}
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
                <button 
                  className="menu-add-button" 
                  onClick={handleAddMenu}
                  style={{
                    background: '#2196F3',
                    marginTop: '10px',
                  }}
                >
                  메뉴 추가하기
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default MenuPage;
