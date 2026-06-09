
import React, { useState } from 'react';
import './css/OptionPage.css';
import Sidebar from '../components/Sidebar';
import HomePreviewFrame from '../components/HomePreviewFrame';

function OptionPage() {
  const assetBase = import.meta.env.BASE_URL;
  const [_images] = useState([null, null, null]);
  const [_previewIndex] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [optionName, setOptionName] = useState('');
  const [optionPrice, setOptionPrice] = useState('');
  const [optionGroups, setOptionGroups] = useState([]);
  const [customPreviewRefreshKey, setCustomPreviewRefreshKey] = useState(0);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddOption = async () => {
    if (isAddingOption) return;

    try {
      setIsAddingOption(true);
      const api = await import('../utils/api');
      if (!groupName || !optionName) {
        alert('옵션 그룹과 값 이름을 입력하세요.');
        return;
      }

      const priceVal = optionPrice ? parseInt(optionPrice.toString().replace(/[^0-9]/g, ''), 10) : 0;

      if (editingItem) {
        // 수정 모드
        // 1. 옵션 그룹 이름이 변경되었는지 확인 (현재는 editingItem.group_id를 통해 그룹을 찾음)
        if (groupName !== editingItem.groupName) {
          await api.updateOptionGroup(editingItem.group_id, { name: groupName });
        }

        // 2. 옵션 아이템 수정
        const res = await api.updateOptionItem(editingItem.id, {
          name: optionName,
          price: priceVal
        });
        if (res.success) {
          alert('옵션이 수정되었습니다.');
          resetForm();
          loadOptionGroups();
          setCustomPreviewRefreshKey((k) => k + 1);
        } else {
          alert('수정에 실패했습니다.');
        }
        return;
      }

      // 추가 모드
      const groupRes = await api.getOptionGroupByName(groupName);
      let groupId = null;
      if (groupRes.success && groupRes.data) {
        groupId = groupRes.data.id;
      } else {
        const createRes = await api.addOptionGroup({ name: groupName });
        if (createRes.success && createRes.data && createRes.data.length > 0) {
          groupId = createRes.data[0].id;
        }
      }
      if (!groupId) throw new Error('그룹 ID를 찾거나 생성하지 못했습니다.');
      const itemRes = await api.addOptionItem({ group_id: groupId, name: optionName, price: priceVal });
      if (itemRes.success) {
        alert('옵션이 추가되었습니다.');
        resetForm();
        loadOptionGroups();
        setCustomPreviewRefreshKey((k) => k + 1);
      } else {
        console.error('Add option item failed:', itemRes.error);
        alert('옵션 추가에 실패했습니다. 콘솔을 확인하세요.');
      }
    } catch (err) {
      console.error('Option add error:', err);
      alert('옵션 추가 중 오류가 발생했습니다.');
    } finally {
      setIsAddingOption(false);
    }
  };

  const resetForm = () => {
    setGroupName('');
    setOptionName('');
    setOptionPrice('');
    setEditingItem(null);
  };

  const handleEdit = (group, item) => {
    setGroupName(group.name);
    setOptionName(item.name);
    setOptionPrice(item.price.toString());
    setEditingItem({ ...item, groupName: group.name });
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const api = await import('../utils/api');
      
      // 삭제할 아이템이 속한 그룹 찾기
      const targetGroup = optionGroups.find(g => g.option_items?.some(i => i.id === itemId));
      
      const res = await api.deleteOptionItem(itemId);
      if (res.success) {
        // 아이템 삭제 후 해당 그룹에 남은 아이템이 없으면 그룹도 삭제
        if (targetGroup && targetGroup.option_items.length === 1) {
          await api.deleteOptionGroup(targetGroup.id);
        }

        alert('삭제되었습니다.');
        loadOptionGroups();
        setCustomPreviewRefreshKey((k) => k + 1);
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const loadOptionGroups = async () => {
    try {
      const { getCustomOptions } = await import('../utils/api');
      const res = await getCustomOptions();
      if (res.success) setOptionGroups(res.data || []);
    } catch (err) {
      console.error('Load option groups error:', err);
    }
  };

  React.useEffect(() => {
    loadOptionGroups();
  }, []);

  return (
    <div className="option-page">
      <nav className="main-navbar">
        <img src={`${assetBase}img/MALO.svg`} alt="MALO Logo" className="main-navbar-logo" />
        <span className="main-navbar-right">미림점 1번 키오스크</span>
      </nav>
      <Sidebar />
      <main className="main-content">
        <h1 className="main-title">옵션</h1>
        <div className="main-layout">
          <div className="home-preview-frame">
            <HomePreviewFrame view="option" variant="basic" />
          </div>

          <div className="home-preview-frame">
            <HomePreviewFrame view="option" variant="custom" refreshKey={customPreviewRefreshKey} />
          </div>

          <div className="option-management-wrapper">
            <div className="option-management-container">
              <div className="option-add-section">
                <h2 className="option-add-title">옵션 추가</h2>
                <div className="option-add-card">
                  <div className="option-form">
                    <div className="option-input-group">
                      <label className="option-label">옵션 이름</label>
                      <input 
                        type="text" 
                        className="option-input" 
                        value={groupName} 
                        onChange={(e) => setGroupName(e.target.value)} 
                      />
                    </div>
                    <div className="option-input-group">
                      <label className="option-label">옵션 값 이름</label>
                      <input 
                        type="text" 
                        className="option-input" 
                        value={optionName} 
                        onChange={(e) => setOptionName(e.target.value)} 
                      />
                    </div>
                    <div className="option-input-group">
                      <label className="option-label">옵션 가격</label>
                      <input 
                        type="text" 
                        className="option-input" 
                        value={optionPrice} 
                        onChange={(e) => setOptionPrice(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="option-action-buttons">
                    <button className="option-add-button" onClick={handleAddOption} disabled={isAddingOption}>
                      {isAddingOption ? '처리 중...' : (editingItem ? '수정' : '옵션 추가하기')}
                    </button>
                    {editingItem && (
                      <button className="option-cancel-button" onClick={resetForm}>취소</button>
                    )}
                  </div>
                </div>
              </div>

              <div className="option-list-section">
                <h2 className="option-list-title">옵션 관리</h2>
                <div className="option-list-card">
                  <div className="option-list-container">
                    {optionGroups.map((group) => (
                      <React.Fragment key={group.id}>
                        {group.option_items?.map((item) => (
                          <div className="option-item-row" key={item.id}>
                            <span className="option-item-name">{item.name}</span>
                            <span className="option-item-price">{item.price?.toLocaleString()}원</span>
                            <div className="option-item-actions">
                              <button className="action-btn edit" onClick={() => handleEdit(group, item)}>
                                <img src={`${assetBase}img/edit.svg`} alt="edit" />
                              </button>
                              <button className="action-btn delete" onClick={() => handleDelete(item.id)}>
                                <img src={`${assetBase}img/del.svg`} alt="delete" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default OptionPage;
