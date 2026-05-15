
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Sidebar.css';
import { logoutUser } from '../utils/api';

function Sidebar() {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const menuItems = [
        { name: '첫화면', path: '/' },
        { name: '메뉴판', path: '/menu' },
        { name: '옵션', path: '/option' }
    ];

    const activeItem = menuItems.find(item => item.path === location.pathname)?.name || '첫화면';

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleItemClick = (item) => {
        navigate(item.path);
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login', { replace: true });
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
            <button className="sidebar-logout-btn" onClick={handleLogout}>로그아웃</button>
        </aside>
    );
}

export default Sidebar;
