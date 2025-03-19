import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const storedMember = sessionStorage.getItem('member');
    const member = storedMember ? JSON.parse(storedMember) : null;

    // 로그인되지 않은 경우 → 로그인 페이지로 이동
    if (!member) {
        return <Navigate to="/login" replace />;
    }

    // 관리자가 아닌 경우 → 메인 페이지로 이동
    if (member.adminCk !== 1) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />; // 관리자 페이지 렌더링
};

export default AdminRoute;