import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅 추가
import { Eye, EyeOff } from "lucide-react"; // 아이콘 라이브러리 사용
import styles from "./Password.module.css";

function Password() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // 네비게이트 함수

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>PASSWORD</h1>
        <div className={styles.description}>비밀번호를 입력하세요.</div>
        <div className={styles.inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            className={styles.passwordInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        <button className={styles.button}>로그인</button>
      </main>
    </div>
  );
}

export default Password;
