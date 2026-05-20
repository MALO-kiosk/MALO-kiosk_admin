
import React, { useState, useEffect, useMemo } from 'react';
import './css/MenuPage.css';
import Sidebar from '../components/Sidebar';
import HomePreviewFrame from '../components/HomePreviewFrame';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '../utils/api';

const PRIMARY_CATEGORIES = ['추천', '신메뉴', '커피/음료', '디저트'];
const SECONDARY_CATEGORIES = ['커피', '디카페인 커피', '음료', '티/라떼'];

const normalizePrimaryCategory = (value) => {
  if (!value) return null;
  const normalized = String(value).trim().toLowerCase();
  if (['추천', 'recommended'].includes(normalized)) return 'recommended';
  if (['신메뉴', 'new'].includes(normalized)) return 'new';
  if (['커피/음료', '커피', 'coffee/음료', 'coffee'].includes(normalized)) return 'coffee';
  if (['디저트', 'dessert'].includes(normalized)) return 'dessert';
  return null;
};

const normalizeCoffeeDetailCategory = (value) => {
  if (!value) return null;
  const normalized = String(value).trim().toLowerCase();
  if (['커피', 'coffee'].includes(normalized)) return 'coffee';
  if (['디카페인 커피', '디카페인', 'decaf'].includes(normalized)) return 'decaf';
  if (['음료', 'drink'].includes(normalized)) return 'drink';
  if (['티/라떼', '티', '라떼', 'tea', 'latte'].includes(normalized)) return 'tea';
  return null;
};

const inferCoffeeDetailCategoryByName = (name) => {
  if (!name) return null;
  const normalized = String(name).trim().toLowerCase();
  if (normalized.includes('디카페인') || normalized.includes('decaf')) return 'decaf';
  if (normalized.includes('티') || normalized.includes('tea') || normalized.includes('라떼') || normalized.includes('latte')) {
    return 'tea';
  }
  if (normalized.includes('에이드') || normalized.includes('주스') || normalized.includes('스무디') || normalized.includes('음료') || normalized.includes('ade') || normalized.includes('juice') || normalized.includes('smoothie')) {
    return 'drink';
  }
  if (normalized.includes('커피') || normalized.includes('아메리카노') || normalized.includes('에스프레소') || normalized.includes('카푸치노') || normalized.includes('coffee') || normalized.includes('espresso') || normalized.includes('cappuccino')) {
    return 'coffee';
  }
  return null;
};

function MenuPage() {
  const assetBase = import.meta.env.BASE_URL;
  const normalizeImage = (img) => {
    if (!img) return `${assetBase}img/noImage.svg`;
    if (typeof img !== 'string') return img;
    const trimmed = img.trim();
    if (trimmed.startsWith('data:') || trimmed.startsWith('http')) return trimmed;
    if (trimmed.startsWith('/')) return `${assetBase}${trimmed.replace(/^\//, '')}`;
    if (trimmed.startsWith('img/')) return `${assetBase}${trimmed}`;
    return trimmed;
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState('미리보기'); // 현재 메인에 표시될 모드

  // 메뉴 리스트 데이터 (DB에서 로드)
  const [menuItems, setMenuItems] = useState([]);
  const [activePrimaryCategory, setActivePrimaryCategory] = useState('coffee');
  const [activeCoffeeDetailCategory, setActiveCoffeeDetailCategory] = useState('coffee');

  // 선택된 메뉴 상태
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editPrimaryCategory, setEditPrimaryCategory] = useState(PRIMARY_CATEGORIES[0]);
  const [editSecondaryCategory, setEditSecondaryCategory] = useState(SECONDARY_CATEGORIES[0]);
  
  // 새 메뉴 추가 입력 필드
  const [addName, setAddName] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addImage, setAddImage] = useState(`${assetBase}img/noImage.svg`);
  const [addPrimaryCategory, setAddPrimaryCategory] = useState(PRIMARY_CATEGORIES[0]);
  const [addSecondaryCategory, setAddSecondaryCategory] = useState(SECONDARY_CATEGORIES[0]);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [isUpdatingMenu, setIsUpdatingMenu] = useState(false);

  const handleMainClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubItemClick = (mode) => {
    setSelectedMode(mode);
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (item) => {
    const primary = item?.primary_category || item?.category_primary || item?.category || PRIMARY_CATEGORIES[0];
    const inferredSecondary = item?.secondary_category || item?.category_secondary || item?.subcategory || null;

    setSelectedMenu(item);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditPrimaryCategory(primary);
    setEditSecondaryCategory(primary === '디저트' ? null : (inferredSecondary || SECONDARY_CATEGORIES[0]));
  };

  const hasSelectedMenu = Boolean(selectedMenu);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((menu) => {
      const rawPrimary = menu.primary_category || menu.category_primary || menu.category;
      const primaryCategory = normalizePrimaryCategory(rawPrimary);
      const isCoffeeGroupItem =
        primaryCategory === 'coffee' ||
        primaryCategory === 'recommended' ||
        primaryCategory === 'new';

      if (activePrimaryCategory === 'dessert') {
        return primaryCategory === 'dessert';
      }

      if (activePrimaryCategory === 'recommended') {
        if (primaryCategory !== 'recommended') return false;
      } else if (activePrimaryCategory === 'new') {
        if (primaryCategory !== 'new') return false;
      } else if (activePrimaryCategory === 'coffee') {
        if (!isCoffeeGroupItem) return false;
      } else {
        return primaryCategory === activePrimaryCategory;
      }

      const rawSecondary = menu.secondary_category || menu.category_secondary || menu.subcategory;
      const detailCategory =
        normalizeCoffeeDetailCategory(rawSecondary) ||
        inferCoffeeDetailCategoryByName(menu.name);

      if (!detailCategory) return false;

      return detailCategory === activeCoffeeDetailCategory;
    });
  }, [activeCoffeeDetailCategory, activePrimaryCategory, menuItems]);

  useEffect(() => {
    if (filteredMenuItems.length === 0) return undefined;

    const firstVisible = filteredMenuItems[0];
    const hasVisibleSelection = selectedMenu && filteredMenuItems.some((item) => item.id === selectedMenu.id);

    if (!hasVisibleSelection && firstVisible) {
      const timerId = window.setTimeout(() => {
        setSelectedMenu(firstVisible);
        setEditName(firstVisible?.name || '');
        setEditPrice(firstVisible?.price || '');
        const firstPrimary = firstVisible?.primary_category || firstVisible?.category_primary || firstVisible?.category || PRIMARY_CATEGORIES[0];
        setEditPrimaryCategory(firstPrimary);
        setEditSecondaryCategory(
          firstPrimary === '디저트' ? null : (firstVisible?.secondary_category || firstVisible?.category_secondary || firstVisible?.subcategory || SECONDARY_CATEGORIES[0])
        );
      }, 0);

      return () => window.clearTimeout(timerId);
    }

    return undefined;
  }, [filteredMenuItems, selectedMenu]);

  const handleAddMenu = () => {
    if (isAddingMenu) return;
    if (!addName || !addPrice) {
      alert('메뉴 이름과 가격을 입력해주세요.');
      return;
    }
    (async () => {
      setIsAddingMenu(true);
      try {
        const payload = {
          name: addName,
          price: addPrice,
          image: addImage,
          primary_category: addPrimaryCategory,
          secondary_category: addPrimaryCategory === '디저트' ? null : addSecondaryCategory,
        };
        const result = await addMenuItem(payload);
        if (result.success && result.data && result.data.length > 0) {
          const rawCreated = result.data[0];
          const created = {
            ...rawCreated,
            image: normalizeImage(rawCreated.image || addImage),
            primary_category: addPrimaryCategory,
            secondary_category: addPrimaryCategory === '디저트' ? null : addSecondaryCategory,
          };
          setMenuItems([...menuItems, created]);
          setSelectedMenu(created);
          setEditName(created.name || '');
          setEditPrice(created.price || '');
          setEditPrimaryCategory(created.primary_category || PRIMARY_CATEGORIES[0]);
          setEditSecondaryCategory(created.primary_category === '디저트' ? null : (created.secondary_category || SECONDARY_CATEGORIES[0]));
          setAddName('');
          setAddPrice('');
          setAddImage(`${assetBase}img/noImage.svg`);
          setAddPrimaryCategory(PRIMARY_CATEGORIES[0]);
          setAddSecondaryCategory(SECONDARY_CATEGORIES[0]);
        } else {
          console.error('Failed to add menu:', result.error);
          alert('메뉴 추가에 실패했습니다. 콘솔을 확인하세요.');
        }
      } catch (err) {
        console.error('Add menu error:', err);
        alert('메뉴 추가 중 오류가 발생했습니다.');
      } finally {
        setIsAddingMenu(false);
      }
    })();
  };

  const handleAddImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAddImage(event.target?.result || `${assetBase}img/noImage.svg`);
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
          const normalized = res.data.map((it) => ({
            ...it,
            image: normalizeImage(it.image),
          }));
          setMenuItems(normalized);
          const first = normalized[0] || null;
          setSelectedMenu(first);
          setEditName(first?.name || '');
          setEditPrice(first?.price || '');
          const firstPrimary = first?.primary_category || first?.category_primary || first?.category || PRIMARY_CATEGORIES[0];
          setEditPrimaryCategory(firstPrimary);
          setEditSecondaryCategory(
            firstPrimary === '디저트' ? null : (first?.secondary_category || first?.category_secondary || first?.subcategory || SECONDARY_CATEGORIES[0])
          );
        } else {
          console.error('Menu fetch failed:', res.error);
        }
      } catch (err) {
        console.error('Error fetching menus:', err);
      }
    })();
  }, []);

  const handleUpdateMenu = async () => {
    if (isUpdatingMenu) return;
    if (!selectedMenu) return;
    setIsUpdatingMenu(true);
    try {
      const payload = {
        name: editName,
        price: editPrice,
        image: selectedMenu.image,
        primary_category: editPrimaryCategory,
        secondary_category: editSecondaryCategory,
      };

      const result = await updateMenuItem(selectedMenu.id, payload);
      if (result.success && result.data && result.data.length > 0) {
        const rawUpdated = result.data[0];
        const updated = { ...rawUpdated, image: normalizeImage(rawUpdated.image) };
        setMenuItems(menuItems.map((item) =>
          item.id === selectedMenu.id ? updated : item,
        ));
        setSelectedMenu(updated);
        alert('메뉴가 수정되었습니다.');
      } else {
        console.error('Failed to update menu:', result.error);
        alert('메뉴 수정에 실패했습니다. 콘솔을 확인하세요.');
      }
    } catch (err) {
      console.error('Update menu error:', err);
      alert('메뉴 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdatingMenu(false);
    }
  };

  const handleDeleteMenu = async (id) => {
    try {
      const result = await deleteMenuItem(id);
      if (result.success) {
        const filtered = menuItems.filter(item => item.id !== id);
        setMenuItems(filtered);
        if (selectedMenu?.id === id) {
          setSelectedMenu(filtered[0] || null);
        }
        alert('메뉴가 삭제되었습니다.');
      } else {
        console.error('Failed to delete menu:', result.error);
        alert('메뉴 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('Delete menu error:', err);
      alert('메뉴 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result || `${assetBase}img/noImage.svg`;
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
        <img src={`${assetBase}img/MALO.svg`} alt="MALO Logo" className="main-navbar-logo" />
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
                src={isMenuOpen ? `${assetBase}img/up.svg` : `${assetBase}img/down.svg`} 
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
            <HomePreviewFrame
              view="menu"
              menuItems={filteredMenuItems}
              selectedMenu={selectedMenu}
              activePrimaryCategory={activePrimaryCategory}
              activeCoffeeDetailCategory={activeCoffeeDetailCategory}
              onPrimaryCategoryChange={setActivePrimaryCategory}
              onCoffeeDetailCategoryChange={setActiveCoffeeDetailCategory}
            />
          </div>

          <div className="menu-management-wrapper">
            {/* 메뉴 수정 섹션 */}
            <div className="menu-section">
              <h2 className="menu-add-title">메뉴</h2>
              <div className="menu-add-card">
                {hasSelectedMenu ? (
                  <>
                    <div className="menu-image-placeholder" onClick={() => document.getElementById('image-upload-edit')?.click()}>
                      <img 
                        src={selectedMenu.image} 
                        alt="menu" 
                        className="full-image"
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
                        />
                      </div>
                      <div className="menu-input-group">
                        <label className="menu-label">메뉴 가격</label>
                        <input 
                          type="text" 
                          className="menu-input" 
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                        />
                      </div>
                      <div className="menu-dropdown-row">
                        <div className="menu-dropdown">
                          <select
                            className="menu-select"
                            value={editPrimaryCategory}
                            onChange={(e) => {
                              const nextPrimary = e.target.value;
                              setEditPrimaryCategory(nextPrimary);
                              if (nextPrimary === '디저트') {
                                setEditSecondaryCategory(null);
                              }
                            }}
                          >
                            {PRIMARY_CATEGORIES.map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div className="menu-dropdown">
                          <select
                            className="menu-select"
                            value={editSecondaryCategory ?? ''}
                            onChange={(e) => setEditSecondaryCategory(e.target.value || null)}
                            disabled={editPrimaryCategory === '디저트'}
                          >
                            <option value="" hidden />
                            {SECONDARY_CATEGORIES.map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <button className="menu-add-button" onClick={handleUpdateMenu} disabled={isUpdatingMenu}>
                      {isUpdatingMenu ? '수정 중...' : '메뉴 수정하기'}
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            {/* 메뉴 리스트 섹션 */}
            <div className="menu-list-section">
              <div className="menu-list-scroll">
                {filteredMenuItems.map((item) => (
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
                      <img src={`${assetBase}img/x.svg`} alt="delete" style={{ width: '20px', height: '20px' }} />
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
                  <img src={addImage} alt="menu" className={addImage !== `${assetBase}img/noImage.svg` ? "full-image" : ""} />
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
                      <select
                        className="menu-select"
                        value={addPrimaryCategory}
                        onChange={(e) => {
                          const nextPrimary = e.target.value;
                          setAddPrimaryCategory(nextPrimary);
                          if (nextPrimary === '디저트') {
                            setAddSecondaryCategory(SECONDARY_CATEGORIES[0]);
                          }
                        }}
                      >
                        {PRIMARY_CATEGORIES.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="menu-dropdown">
                      <select
                        className="menu-select"
                        value={addSecondaryCategory}
                        onChange={(e) => setAddSecondaryCategory(e.target.value)}
                        disabled={addPrimaryCategory === '디저트'}
                      >
                        {SECONDARY_CATEGORIES.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <button 
                  className="menu-add-button" 
                  onClick={handleAddMenu}
                  disabled={isAddingMenu}
                  style={{
                    background: '#2196F3',
                    marginTop: '10px',
                  }}
                >
                  {isAddingMenu ? '추가 중...' : '메뉴 추가하기'}
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
