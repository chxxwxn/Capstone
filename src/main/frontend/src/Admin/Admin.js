import React, { useEffect, useState } from 'react';
import './Admin.module.css';

const Admin = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch("http://localhost:8090/admin/main") // Spring Boot API 호출
            .then(response => response.json())
            .then(data => {
                setMessage(data.message); // JSON 데이터에서 message 가져오기
            })
            .catch(error => console.error("Error fetching admin data:", error));
    }, []);

    return (
        <div>
            <h1>관리자 페이지</h1>
            <p>{message}</p> {/* 서버에서 받은 메시지 출력 */}
        </div>
    );
};

export default Admin;