
import React, { useState } from 'react';
import './css/OptionPage.css';
import Sidebar from '../components/Sidebar';
import HomePreviewFrame from '../components/HomePreviewFrame';

function OptionPage() {
  const [_images] = useState([null, null, null]);
  const [_previewIndex] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [optionName, setOptionName] = useState('');
  const [optionPrice, setOptionPrice] = useState('');
  const [_optionGroups, setOptionGroups] = useState([]);
  const [customPreviewRefreshKey, setCustomPreviewRefreshKey] = useState(0);
  const [isAddingOption, setIsAddingOption] = useState(false);

  const handleAddOption = async () => {
    if (isAddingOption) return;

    try {
      setIsAddingOption(true);
      const api = await import('../utils/api');
      if (!groupName || !optionName) {
        alert('옵션 그룹과 값 이름을 입력하세요.');
        return;
      }
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
      const priceVal = optionPrice ? parseInt(optionPrice.replace(/[^0-9]/g, ''), 10) : 0;
      const itemRes = await api.addOptionItem({ group_id: groupId, name: optionName, price: priceVal });
      if (itemRes.success) {
        alert('옵션이 추가되었습니다.');
        setGroupName(''); setOptionName(''); setOptionPrice('');
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
        <img src="/img/MALO.svg" alt="MALO Logo" className="main-navbar-logo" />
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
            <div className="option-add-section">
              <h2 className="option-add-title">옵션추가</h2>
              <div className="option-add-card">
                <div className="option-form">
                  <div className="option-input-group">
                    <label className="option-label">옵션 이름</label>
                      <input type="text" className="option-input" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                  </div>
                    <div className="option-input-group">
                      <label className="option-label">옵션 값 이름</label>
                      <input type="text" className="option-input" value={optionName} onChange={(e) => setOptionName(e.target.value)} />
                    </div>
                    <div className="option-input-group">
                      <label className="option-label">옵션 가격</label>
                      <input type="text" className="option-input" value={optionPrice} onChange={(e) => setOptionPrice(e.target.value)} />
                    </div>
                </div>
                  <button className="option-add-button" onClick={handleAddOption} disabled={isAddingOption}>
                    {isAddingOption ? '추가 중...' : '옵션 추가하기'}
                  </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default OptionPage;
