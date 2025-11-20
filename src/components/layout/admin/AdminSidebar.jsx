import React, { useState, useEffect } from 'react';
import { Link, useLocation} from 'react-router-dom'
import logo_white from "../../../assets/img/kspo_logo_white.svg";

const AdminSidebar = () => {
    // 아코디언 메뉴의 상태 관리
    const [openMenu, setOpenMenu] = useState(null);
    const location = useLocation(); // 현재 경로 가져오기
    const [menuData,setMenuData ]= useState([
        {
            title: '문서 관리',
            path: '/ksponcoadministrator/document',
        },
        {
            title: '이력 관리',
            path: '/ksponcoadministrator/history',
            subMenu: [
                {title:'사용자 질의 응답 이력 관리', path:'/ksponcoadministrator/history/userQueryAnswerHistory'},
                {title:'챗봇 이용 현황', path:'/ksponcoadministrator/history/chatbotUsageStatus'}
            ]
        },
        {
            title: '관리자 관리',
            path: '/ksponcoadministrator/adminManagement',
        },
    ]);
    // 현재 활성화된 메뉴의 인덱스를 찾아 설정
    useEffect(() => {
        const activeMenuIndex = menuData.findIndex((menu) => {
            if (location.pathname.startsWith(menu.path)) return true;
            return menu.subMenu && menu.subMenu.some((subMenu)=> location.pathname.startsWith(subMenu.path));
        });
        // 활성화된 메뉴를 찾아 openMenu로 설정 (없다면 null)
        setOpenMenu(activeMenuIndex !== -1 ? activeMenuIndex : null);
    }, [location.pathname]);

    // 메뉴 열림/닫힘 상태 토글 함수
    const toggleMenu = (menuIndex) => {
        setOpenMenu((prevMenu) => (prevMenu === menuIndex ? null : menuIndex));
    };

    return (
        <div className="w-[220px] h-[100vh] fixed top-0 left-0 bg-primary-color">
            <h1 className="w-full h-[48px] flex items-center justify-center py-[10px] px-[22px] border-b border-gray1">
                <Link to={"/ksponcoadministrator"}></Link>
                <img src={`${logo_white}`} alt="한국체육산업개발 로고"/>
            </h1>
            {/* 동적 메뉴 렌더링 */}
            <div className="py-[10px]">
                {menuData && menuData.map((menu, index) => {
                    const isMenuActive = location.pathname.startsWith(menu.path);
                    const isSubMenuActive = menu.subMenu && menu.subMenu.some((subMenu) => location.pathname.startsWith(subMenu.path));
                    const isOpened = openMenu === index;

                    return (
                        <div key={index}>
                            <Link
                                to={menu.subMenu ? "#" : menu.path}
                                className={`w-full flex items-center justify-between px-[20px] py-[14px] text-[16px] font-medium ${
                                    isOpened || isMenuActive || isSubMenuActive
                                        ? "text-white"
                                        : "text-gray2"
                                }`}
                                onClick={(event) => {
                                    if (menu.subMenu) {
                                        event.preventDefault();
                                        toggleMenu(index);
                                    }
                                }}
                            >
                                {menu.title}
                            </Link>

                            {menu.subMenu && (
                                <ul className={`transition-max-height duration-300 ease-in-out overflow-hidden bg-primary-color-light ${
                                    isOpened
                                        ? "max-h-[500px] py-[10px]"
                                        : "max-h-0 py-0"
                                }`}>
                                    {menu.subMenu.map((subMenu, subIndex) => (
                                        <li key={subIndex}>
                                            <Link
                                                to={subMenu.path}
                                                className={`block py-[11px] pl-[40px] pr-[10px] text-[15px] ${
                                                    location.pathname.startsWith(subMenu.path)
                                                        ? "text-white"
                                                        : "text-gray2"
                                                }`}
                                            >
                                                {subMenu.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

}
export default AdminSidebar