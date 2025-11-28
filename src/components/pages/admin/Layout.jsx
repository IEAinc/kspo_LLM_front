import { Outlet } from "react-router-dom";
import "../../../assets/css/admin.css";

import AdminHeader from "../../layout/admin/AdminHeader.jsx";
import AdminSidebar from "../../layout/admin/AdminSidebar.jsx";

export default function Layout() {
  return (
    <div>
      {/* 헤더 */}
      <AdminHeader />

      {/* 사이드바 */}
      <AdminSidebar />

      <div className="mt-[48px] ml-[220px] p-[32px] bg-primary-blue-light"
        style={{ minHeight: 'calc(100vh - 48px)', overflowY: 'auto' }}>
        {/* 브레드크럼 추가 */}
        <div>
          {/*<Breadcrumb/>*/}
        </div>

        {/* 하위 콘텐츠 */}
        <Outlet />
      </div>
    </div>
  );
}