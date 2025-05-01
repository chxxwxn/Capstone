import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './FindPw2.module.css';
import { Eye, EyeOff } from "lucide-react";

function FindPw2() {
  const navigate = useNavigate();
  const location = useLocation();

  const { phoneNumber } = location.state || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 확인 비밀번호 상태 추가
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true); // 비밀번호 일치 여부 상태 추가

  const handleCancel = () => {
    navigate('/');
  };

  const validatePassword = (value) => {
    setNewPassword(value);

    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const isValidCombination = [hasLowercase, hasNumber, hasSpecial].filter(Boolean).length >= 2;
    setPasswordValid(isValidCombination);

    setPasswordLengthValid(value.length >= 8 && value.length <= 16);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMatch(false); // 비밀번호 불일치 상태 설정
      return; // 저장 중단
    } else {
      setPasswordMatch(true); // 비밀번호 일치 상태 설정
    }
    // 저장 로직
    console.log('새 비밀번호:', newPassword);
    alert('비밀번호가 변경되었습니다!');
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>NEW PASSWORD</h1>
        <p className={styles.description}>
          전화번호를 인증하고<br></br>새 비밀번호를 입력하세요.
        </p>

        <div className={styles.info}>
          <p>* 아이디 : dhsladjkf@naver.com</p>
          <p>* 전화번호 : 010-****-1234</p>
        </div>

        <div className={styles.form}>
          <div className={styles.newPassword}>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="새 비밀번호"
                className={styles.newPwInput}
                value={newPassword}
                onChange={(e) => validatePassword(e.target.value)}
              />
              <button type="button" className={styles.eyeButton} onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className={styles.passwordRequirements}>
              <p className={passwordValid ? styles.valid : styles.invalid}>
                {passwordValid ? "✅ " : "❌ "} 영문 소문자/숫자/특수문자 중 2가지 이상 조합
              </p>
              <p className={passwordLengthValid ? styles.valid : styles.invalid}>
                {passwordLengthValid ? "✅ " : "❌ "} 8-16자
              </p>
            </div>

            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="새 비밀번호 확인"
                className={styles.newPwInput}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" className={styles.eyeButton} onClick={togglePasswordVisibility}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!passwordMatch && (
              <p className={styles.errorMessage}>새 비밀번호와 일치하지 않습니다.</p>
            )}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleSave}>
            저장
          </button>
        </div>
      </main>
    </div>
  );
}

export default FindPw2;
