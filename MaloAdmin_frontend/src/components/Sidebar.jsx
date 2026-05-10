
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Sidebar.css';

function Sidebar() {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('첫화면');

    const menuItems = [
        { name: '첫화면', path: '/' },
        { name: '메뉴판', path: '/menu' },
        { name: '옵션', path: '/option' }
    ];

    useEffect(() => {
        const currentItem = menuItems.find(item => item.path === location.pathname);
        if (currentItem) {
            setActiveItem(currentItem.name);
        }
    }, [location.pathname]);

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleItemClick = (item) => {
        setActiveItem(item.name);
        navigate(item.path);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-title">키오스크 관리</div>
            <div className="sidebar-group">
                <div className="sidebar-group-header" onClick={handleToggle} style={{ cursor: 'pointer' }}>
                    <span>맞춤 설정</span>
                    <img
                        src={open ? "/img/down.svg" : "/img/up.svg"}
                        alt={open ? "아래 화살표" : "위 화살표"}
                        className="sidebar-arrow-img"
                    />
                </div>
                {open && (
                    <ul className="sidebar-list">
                        {menuItems.map((item) => (
                            <li
                                key={item.name}
                                className={`sidebar-list-item ${activeItem === item.name ? 'active' : ''}`}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button className="sidebar-logout-btn">로그아웃</button>
        </aside>
    );
}

export default Sidebar;
