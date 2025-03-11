import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './findPw.module.css';

function FindPw() {
  const [name, setName] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const navigate = useNavigate();

  const handleCancel = () => {
    // 취소 버튼 클릭 시 동작
    alert('취소되었습니다.');
  };

  const handleSubmit = () => {
    // 확인 버튼 클릭 시 동작
    alert('확인되었습니다.');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>F.M.</div>
        <div className={styles.navigation}>
          {/* 여기에 메뉴 아이템 추가 */}
          <a href="#" className={styles.navItem}></a>
          <a href="#" className={styles.navItem}></a>
          <a href="#" className={styles.navItem}></a>
          <a href="#" className={styles.navItem}></a>
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>아이디 찾기</h1>
        <p className={styles.description}>
          | 이름과 전화번호를 이용해 아이디를 찾으세요.
        </p>
        <p className={styles.note}>*회원가입 시 기재한 아이디와 전화번호를 적어주세요.</p>

        <div className={styles.form}>
          <input
            type="text"
            placeholder="아이디"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className={styles.phoneInputGroup}>
            <input
              type="text"
              className={styles.phoneInput}
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
              maxLength="3"
            />
            <span className={styles.separator}>-</span>
            <input
              type="text"
              className={styles.phoneInput}
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
              maxLength="4"
            />
            <span className={styles.separator}>-</span>
            <input
              type="text"
              className={styles.phoneInput}
              value={phone3}
              onChange={(e) => setPhone3(e.target.value)}
              maxLength="4"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.cancelButton} onClick={handleCancel}>
              취소
            </button>
            <button className={styles.submitButton} onClick={handleSubmit}>
              확인
            </button>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>© 2025 F.M. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FindPw;
