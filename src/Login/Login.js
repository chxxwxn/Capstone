import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = () => {
    if (!isValidEmail(email)) {
      setError(true);
      return;
    }
    setError(false);

    setTimeout(() => {
      if (email === 'fitmood@example.com') {
        navigate('/Password');
      } else {
        navigate('/Join');
      }
    }, 300); // 약간의 딜레이로 자연스럽게 전환
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
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false); // 입력할 때마다 경고 문구 초기화
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // 기본 동작 방지
              handleLogin();
            }
          }}
        />
        {error && <p className={styles.error}>올바른 이메일 형식을 입력하세요.</p>}
        <p className={styles.terms}>
          * 입력 양식 : fitmood@example.com<br />
          * 계속 진행하면 <a href="#">개인정보 처리방침 및 이용약관</a>에 동의하게 됩니다.
        </p>
        <button className={styles.button} onClick={handleLogin} disabled={!isValidEmail(email)}>
          계속
        </button>
      </main>
    </div>
  );
}

export default Login;
