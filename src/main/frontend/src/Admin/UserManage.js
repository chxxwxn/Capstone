import React, { useEffect, useState } from 'react';
import styles from './UserManage.module.css';
import { useNavigate } from "react-router-dom";

const UserManage = () => {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:8090/member/list', {
          method: 'GET',
          credentials: 'include', // 세션 필요하면 추가
        });
        if (!response.ok) {
          throw new Error('회원 목록을 불러오지 못했습니다.');
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
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
              <li onClick={() => navigate("/admin/UserManage")}>
                <a className={styles.admin_list_05}>회원 관리</a>
              </li>
            </ul>
          </div>
              
          {/* 메인 콘텐츠 영역 */}
          <div style={{ padding: '20px' }}>
            <h2>회원 관리</h2>
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>회원 메일</th>
                  <th>회원 성</th>
                  <th>회원 이름</th>
                  <th>회원 패스워드</th>
                  <th>회원 전화번호</th>
                  <th>회원 등급</th>
                  <th>회원 포인트</th>
                  <th>쿠폰 갯수</th>
                </tr>
              </thead>
              <tbody>
              {members.map((member, index) => (
                <tr key={index}>
                  <td>{member.memberMail}</td>
                  <td>{member.memberLn}</td>
                  <td>{member.memberFn}</td>
                  <td>{member.memberPw}</td>
                  <td>{member.memberNum1}-{member.memberNum2}-{member.memberNum3}</td>
                  <td>{member.memberRating}</td>
                  <td>{member.point}</td>
                  <td>{member.memberCoupon}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManage;
