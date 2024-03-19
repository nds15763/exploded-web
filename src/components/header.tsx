import '../out.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // 确保路径正确

export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false); // 控制下拉菜单显示隐藏的状态
    const navigate = useNavigate();// 使用 AuthContext 提供的状态和方法
    const { isLoggedIn, username, logout } = useAuth();

    const handleLogin = () => {
        navigate('/login'); // 导航到登录页面
    };

    const handleLogout = () => {
        logout(); // 调用 AuthContext 提供的 logout 方法
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown); // 点击按钮时切换下拉菜单的显示状态
    };

    return (
        <header className="flex justify-between items-center p-4 border-b-2 border-gray-300 shadow-lg">
            <div className="logo ml-2">
                <a href="/">
                    <img src="/logo.png" alt="Logo" className="h-8" />
                </a>
            </div>
            <div className="buttons">
                {isLoggedIn ? (
                    <div className="dropdown inline-block relative" onClick={toggleDropdown}>
                        <button className="bg-black text-white hover:bg-gray-900 font-bold py-2 px-4 rounded">
                            <img src="user-avatar.png" alt="User Avatar" className="h-6 w-6 rounded-full inline-block mr-2" />
                            {username} {/* 使用 username 状态 */}
                        </button>
                        {showDropdown && (
                            <ul className="dropdown-menu absolute text-gray-700 pt-1 bg-white border border-gray-300 rounded w-40 mt-2 z-50">
                                <li className="border-b border-gray-300">
                                    <a href="#" className="block py-2 px-4 hover:bg-gray-300">Profile</a>
                                </li>
                                <li className="border-b border-gray-300">
                                    <a href="#" className="block py-2 px-4 hover:bg-gray-300">Settings</a>
                                </li>
                                <li>
                                    <a href="#" className="block py-2 px-4 hover:bg-gray-300" onClick={handleLogout}>Logout</a>
                                </li>
                            </ul>
                        )}
                    </div>
                ) : (
                    <button className="bg-black text-white hover:bg-gray-900 font-bold py-2 px-4 rounded" onClick={handleLogin}>
                        Login
                    </button>
                )}
            </div>
        </header>
    );
}
