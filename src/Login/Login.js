import React, { useState, useEffect } from 'react';
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
    }, 300);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    script.onload = () => {
      if (window.Kakao) {
        window.Kakao.init('648bc3a57b1fdfed62d7b08c8c6adf44');
        console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleKakaoLogin = () => {
    if (window.Kakao) {
      window.Kakao.Auth.login({
        success: function (authObj) {
          console.log(authObj);
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: function (res) {
              console.log(res);
              // 로그인 성공 후 Main2로 이동
              navigate('/Main2', { state: { kakaoUserInfo: res } });
            },
            fail: function (error) {
              console.error(error);
            },
          });
        },
        fail: function (err) {
          console.error(err);
        },
      });
    } else {
      console.error('Kakao SDK not initialized');
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
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
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
        <button className={styles.kakaoButton} onClick={handleKakaoLogin}>
          카카오 로그인
        </button>
      </main>
    </div>
  );
}

export default Login;
