import React, { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8090/admin/main") // Spring Boot API 호출
            .then(response => response.json())
            .then(data => {
                setMessage(data.message); // JSON 데이터에서 message 가져오기
            })
            .catch(error => console.error("Error fetching admin data:", error));
    }, []);

    
    return (
        <div className={styles.wrapper}>
            <div className={styles.wrap}>
        
                {/* 관리자 페이지 제목 */}
                <div className={styles.admin_top_wrap}>
                <span>관리자 페이지</span>
                </div>
        
                {/* 관리자 페이지 콘텐츠 */}
                <div className={styles.admin_wrap}>
                {/* 좌측 네비게이션 */}
                <div className={styles.admin_navi_wrap}>
                    <ul>
                    <li onClick={() => navigate("/admin/ProductRegister")}>
                        <a className={styles.admin_list_01}>상품 등록</a>
                    </li>
                    <li onClick={() => navigate("/admin/ProductManage")}>
                        <a className={styles.admin_list_02}>상품 관리</a>
                    </li>
                    <li onClick={() => navigate("/admin/author-register")}>
                        <a className={styles.admin_list_03}>작가 등록</a>
                    </li>
                    <li onClick={() => navigate("/admin/author-manage")}>
                        <a className={styles.admin_list_04}>작가 관리</a>
                    </li>
                    <li onClick={() => navigate("/admin/user-manage")}>
                        <a className={styles.admin_list_05}>회원 관리</a>
                    </li>
                    </ul>
                </div>
        
                {/* 메인 콘텐츠 영역 */}
                <div className={styles.admin_content_wrap}>
                    <div>{message || "관리자 페이지 입니다."}</div>
                </div>
                </div>
            </div>
            </div>
        );
    };

export default Admin;