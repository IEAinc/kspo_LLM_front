import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import AdminHeader from "../../layout/admin/AdminHeader.jsx";
import AdminSidebar from "../../layout/admin/AdminSidebar.jsx";
import {userApi} from "../../../assets/api/userApi.js";
import "../../../assets/css/admin.css";

export default function Layout() {
    const location = useLocation();
    const navigator = useNavigate()

    function logoutUser() {
        userApi.logout()
            .then(() => {
                navigator("/ksponcoadministrator/login")
            })
            .catch(() => {
                navigator("/ksponcoadministrator/login")
            });
    }

    const checkAuthentication = () => {
        userApi.validateToken()
            .then((response) => {
                // 200 일경우 로컬 스토리지에 {"id", "name"} 데이터 저장
                if (response.status === 200) {
                    localStorage.setItem("userId", response.data.id);
                    localStorage.setItem("userName", response.data.name);
                } else if (response.status !== 200) logoutUser();
            })
            .catch(() => { logoutUser(); });
    }

    useEffect(() => {
        checkAuthentication();
    }, [location]);
    return (
        <div>
            {/* 헤더 */}
            <AdminHeader/>
            {/* 사이드바 */}
            <AdminSidebar/>
            {/* 콘텐츠 */}
            <div className="admin-content">
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