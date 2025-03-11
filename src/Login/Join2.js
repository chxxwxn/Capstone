import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import styles from "./Join2.module.css";

const Join2 = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const isFormValid = 
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      emailValid &&
      password !== "" &&
      passwordValid &&
      passwordLengthValid &&
      phone1 !== "" &&
      phone2 !== "" &&
      checked;
    
    setFormValid(isFormValid);
  }, [firstName, lastName, email, emailValid, password, passwordValid, passwordLengthValid, phone1, phone2, checked]);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(value);
    setEmailValid(emailRegex.test(value));
  };

  const validatePassword = (value) => {
    setPassword(value);
    
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

  const handleSubmit = () => {
    if (formValid) {
      // 폼 제출 로직
      console.log("Form submitted");
      navigate('/');
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>JOIN</h2>
      <p className={styles.subtitle}>아래 정보를 기입해 주세요</p>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="이름" 
            className={styles.input} 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="성" 
            className={styles.input} 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <input
          type="email"
          placeholder="이메일"
          className={`${styles.input} ${!emailValid && email !== "" ? styles.invalidInput : ""}`}
          value={email}
          onChange={(e) => validateEmail(e.target.value)}
        />
        {!emailValid && email !== "" && (
          <p className={styles.errorMessage}>올바른 이메일 형식이 아닙니다.</p>
        )}
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            className={styles.input}
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
          />
          <button type="button" className={styles.eyeButton} onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className={styles.passwordValidation}>
          <p className={passwordValid ? styles.valid : styles.invalid}>
            {passwordValid ? "✅" : "❌"} 영문 소문자/숫자/특수문자 중 2가지 이상 조합
          </p>
          <p className={passwordLengthValid ? styles.valid : styles.invalid}>
            {passwordLengthValid ? "✅" : "❌"} 8~16자
          </p>
        </div>
        <div className={styles.phoneContainer}>
          <select className={styles.phoneSelect}>
            <option>010</option>
          </select>
          <input 
            type="text" 
            className={styles.phoneInput} 
            value={phone1}
            onChange={(e) => setPhone1(e.target.value)}
          />
          <input 
            type="text" 
            className={styles.phoneInput} 
            value={phone2}
            onChange={(e) => setPhone2(e.target.value)}
          />
        </div>
        <div className={styles.terms}>
          <input
            type="checkbox"
            id="terms"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <label htmlFor="terms">
            F.M의 <a href="#">개인정보 처리방침 및 이용약관</a>에 동의합니다.
          </label>
        </div>
        {showWarning && !formValid && (
          <p className={styles.warningMessage}>모든 필드를 입력하고 약관에 동의해주세요.</p>
        )}
        <button 
          className={`${styles.submitButton} ${!formValid ? styles.disabledButton : ''}`} 
          onClick={handleSubmit}
          disabled={!formValid}
        >
          계속
        </button>
      </div>
    </div>
  );
};

export default Join2;
