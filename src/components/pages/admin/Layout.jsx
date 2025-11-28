import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import AdminHeader from "../../layout/admin/AdminHeader.jsx";
import AdminSidebar from "../../layout/admin/AdminSidebar.jsx";
import {userApi} from "../../../assets/api/userApi.js";
import "../../../assets/css/admin.css";

export default function Layout() {
    const location = useLocation();
    const navigator = useNavigate()

    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const VALIDATION_TTL = 15 * 60 * 1000; // 15분
    const lastValidatedKey = 'lastValidatedAt';

    function logoutUser() {
        userApi.logout()
            .then(() => {
                navigator("/ksponcoadministrator/login")
            })
            .catch(() => {
                navigator("/ksponcoadministrator/login")
            });
    }

    const checkAuthentication = async (force = false) => {
        setIsChecking(true);
        try {
            const last = Number(localStorage.getItem(lastValidatedKey) || 0);
            const now = Date.now();

            // TTL 내이면 로컬 판단으로 인증 유지 (빠른 렌더링 목적)
            if (!force && last && (now - last) < VALIDATION_TTL) {
                // 로컬에 user 정보가 있으면 인증된 상태로 본다
                const userId = localStorage.getItem('userId');
                if (userId) {
                    setIsAuthenticated(true);
                    setIsChecking(false);
                    return;
                }
            }

            const response = await userApi.validateToken();
            if (response && response.status === 200) {
                localStorage.setItem("userId", response.data.id);
                localStorage.setItem("userName", response.data.name);
                localStorage.setItem(lastValidatedKey, String(Date.now()));
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("userId");
                localStorage.removeItem("userName");
                localStorage.removeItem(lastValidatedKey);
                setIsAuthenticated(false);
                logoutUser();
            }
        } catch (err) {
            localStorage.removeItem(lastValidatedKey);
            setIsAuthenticated(false);
            logoutUser();
        } finally {
            setIsChecking(false);
        }
    }

    useEffect(() => {
        checkAuthentication();
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                checkAuthentication(true);
            }
        }
        const handleFocus = () => {
            checkAuthentication(true);
        }

        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('focus', handleFocus);
        }
    }, [location]);

    useEffect(() => {
        if (!isChecking && !isAuthenticated) {
            navigator("/ksponcoadministrator/login");
        }
    }, [isChecking, isAuthenticated]);

    if (!isAuthenticated) return null;

    return (
        <div>
            {/* 헤더 */}
            <AdminHeader/>
            {/* 사이드바 */}
            <AdminSidebar/>
            {/* 콘텐츠 */}
            <div className="mt-[48px] ml-[220px] p-[32px] bg-primary-blue-light"
                 style={{minHeight: 'calc(100vh - 48px)', overflowY: 'auto'}}>
                {/* 브레드크럼 추가 */}
                <div>
                    {/*<Breadcrumb/>*/}
                </div>

                {/* 하위 콘텐츠 */}
                <Outlet/>
            </div>
        </div>
    )
}