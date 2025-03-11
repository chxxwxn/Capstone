import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === 'fitmood@example.com') {
      navigate('/Password'); // Password 페이지로 이동
    } else {
      navigate('/Join');
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>LOGIN</h1>
        <div className={styles.description}>
          가입 또는 로그인을 위해<br />이메일을 입력하세요.
        </div>
        <input
          type="email"
          placeholder="이메일"
          className={styles.emailInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className={styles.terms}>
          * 입력 양식 : fitmood@example.com<br />
        * 계속 진행하면 <a href="#">개인정보 처리방침 및 이용약관</a>에 동의하게 됩니다.
        </p>
        <button className={styles.button} onClick={handleLogin}>
          계속
        </button>
      </main>
    </div>
  );
}

export default Login;
