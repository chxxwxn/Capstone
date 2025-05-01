import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 페이지 이동을 위한 훅 추가
import { Eye, EyeOff } from "lucide-react"; // 아이콘 라이브러리 사용
import styles from "./Password.module.css";
import { LoginContext } from "./LoginContext";

function Password() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // 네비게이트 함수
  const location = useLocation(); // `Login.js`에서 전달된 state 값을 가져옴
  const email = location.state?.email || ""; // email 값 가져오기
  const { setIsLoggedIn } = useContext(LoginContext);

  useEffect(() => {
    if (!email) {
      alert("로그인이 필요합니다.");
      navigate("/Login");
    }
  }, [email, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8090/member/login.do', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ memberMail: email, memberPw: password }) // 이메일과 비밀번호 함께 전송
      });

      const data = await response.json();
      console.log('로그인 응답:', data);

      if (data.success && data.member) {
        sessionStorage.setItem('member', JSON.stringify(data.member));
        setIsLoggedIn(true);
        if (data.member.adminCk === 1) {
          navigate('/admin');
        } else {
          navigate('/');
        }

      } else {
        alert(data.message || '로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <form id="login_form" method="post" onSubmit={handleSubmit}>
          <h1 className={styles.title}>PASSWORD</h1>
          <div className={styles.description}>비밀번호를 입력하세요.</div>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              className={styles.passwordInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="memberPw"
            />
            <button className={styles.eyeButton} onClick={togglePasswordVisibility}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button 
            className={styles.findPasswordButton} 
            onClick={() => navigate("/FindPw")} // 클릭 시 findPw로 이동
          >
            비밀번호 찾기
          </button>
          <button className={styles.button} type="submit">로그인</button>
        </form>
      </main>
    </div>
  );
}

export default Password;