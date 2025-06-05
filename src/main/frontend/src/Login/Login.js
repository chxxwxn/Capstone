import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { LoginContext } from "../Login/LoginContext";


const KAKAO_JS_KEY = "e0004ba73de38814f9c3d941049efff8"; 

function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setError(true);
      return;
    }
    setError(false);

    try {
      const response = await fetch('http://localhost:8090/member/mailChk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberMail: email }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 실패');
      }

      const data = await response.json();
      if (data.exists) {
        navigate('/Password', { state: { email }, replace: true });
      } else {
        navigate('/Join', { replace: true });
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  };

  const { isLoggedIn } = useContext(LoginContext);
  
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao) {
        window.Kakao.init(KAKAO_JS_KEY);
        console.log("Kakao SDK initialized:", window.Kakao.isInitialized());
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleKakaoLogin = () => {
    if (window.Kakao) {
      window.Kakao.Auth.authorize({
        redirectUri: "http://localhost:8090/member/kakao/callback",
        scope: "profile_nickname account_email phone_number" // ✅ 꼭 포함해야 함
      });
    } else {
      console.error("Kakao SDK not initialized");
    }
  };

  const gomain = () => {
    navigate('/');
  };

  return (
    isLoggedIn ? (
      <>
        {gomain}
      </>
    ) : (
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
          name="memberMail"
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
    )
  );
}

export default Login;