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

  const handleSubmit = async () => {
    if (!formValid) {
      setShowWarning(true);
      return;  // 유효하지 않은 경우 여기서 종료
    }

    const memberData = {
      memberMail: email,
      memberPw: password,
      memberFn: firstName,
      memberLn: lastName,
      memberNum1: "010",
      memberNum2: phone1,
      memberNum3: phone2
    };

    try {
      const response = await fetch("http://localhost:8090/member/Join2", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",  // 인증 쿠키 포함
        body: JSON.stringify(memberData)
    });
    
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`서버 오류: ${errorData}`);
      }
    
      alert("회원가입이 완료되었습니다!");
      navigate("/");  // 회원가입 성공 후에 이동
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("서버 오류가 발생했습니다.");
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
            name='memberFn'
          />
          <input 
            type="text" 
            placeholder="성" 
            className={styles.input} 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            name='memberLn'
          />
        </div>
        <input
          type="email"
          placeholder="이메일"
          className={`${styles.input} ${!emailValid && email !== "" ? styles.invalidInput : ""}`}
          value={email}
          onChange={(e) => validateEmail(e.target.value)}
          name='memberMail'
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
            <option name='memberNum1'>010</option>
          </select>
          <input 
            type="text"
            className={styles.phoneInput} 
            value={phone1}
            onChange={(e) => setPhone1(e.target.value)}
            name='memberNum2'
          />
          <input 
            type="text" 
            className={styles.phoneInput} 
            value={phone2}
            onChange={(e) => setPhone2(e.target.value)}
            name='memberNum3'
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
