import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FindPw.module.css';

function FindPw() {
  const [name, setName] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState(180); // 3분 = 180초
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (showVerification && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      // 시간 초과 처리
    }
    return () => clearInterval(interval);
  }, [showVerification, timer]);

  const handleCancel = () => {
    alert('취소되었습니다.');
    navigate('/');
  };

  const handleSubmit = () => {
    if (!name || !phone1 || !phone2 || !phone3) {
      alert('모든 칸을 입력해주세요.');
      return;
    }

    if (showVerification) {
      if (timer === 0) {
        alert('인증 시간이 만료되었습니다. 인증번호를 다시 확인해주세요.');
        return;
      }
      
      if (!verificationCode) {
        alert('인증번호를 입력해주세요.');
        return;
      }
      
      // 여기에 인증번호 확인 로직 추가
      console.log('인증번호:', verificationCode);
    }

    const phoneNumber = `${phone1}-${phone2}-${phone3}`;
    console.log('이름:', name);
    console.log('전화번호:', phoneNumber);

    // FindPw2로 이동하면서 데이터 전달
    navigate('/FindPw2', {
      state: {
        phoneNumber: phoneNumber,
      },
    });
  };

  const handlePhoneInput = (e, setPhone) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone(value);
  };

  const handleSendCode = () => {
    if (!phone1 || !phone2 || !phone3) {
      alert('전화번호를 모두 입력해주세요.');
      return;
    }
    alert('인증 코드가 전송되었습니다.');
    setShowVerification(true);
    setTimer(180); // 타이머 리셋
  };

  const handleVerificationCodeInput = (e) => {
    setVerificationCode(e.target.value);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isPhoneComplete = phone1.length === 3 && phone2.length === 4 && phone3.length === 4;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>FIND PASSWORD</h1>
        <p className={styles.description}>
          이름과 전화번호를 이용해<br></br> 비밀번호를 찾으세요.
        </p>
        <p className={styles.note}>*회원가입 시 기재한 이름과 전화번호를 입력해주세요.</p>

        <div className={styles.form}>
          <input
            type="text"
            placeholder="이름"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className={styles.phoneInputGroup}>
            <input
              type="text"
              className={styles.phoneInput}
              value={phone1}
              onChange={(e) => handlePhoneInput(e, setPhone1)}
              maxLength="3"
            />
            <span className={styles.separator}>-</span>
            <input
              type="text"
              className={styles.phoneInput}
              value={phone2}
              onChange={(e) => handlePhoneInput(e, setPhone2)}
              maxLength="4"
            />
            <span className={styles.separator}>-</span>
            <input
              type="text"
              className={styles.phoneInput}
              value={phone3}
              onChange={(e) => handlePhoneInput(e, setPhone3)}
              maxLength="4"
            />
            <div className={styles.sendCodeButton}>
              <button 
                className={`${styles.sendCodeButton} ${!isPhoneComplete ? styles.disabled : ''}`} 
                onClick={handleSendCode}
                disabled={!isPhoneComplete}
              >
                코드 전송
              </button>
            </div>
          </div>

          {showVerification && (
            <div className={styles.verificationGroup}>
              <input
                type="text"
                placeholder="인증번호 입력"
                className={styles.inputnum}
                value={verificationCode}
                onChange={handleVerificationCodeInput}
              />
              <span className={styles.timer}>{formatTime(timer)}</span>
              <button className={styles.resendCodeButton} onClick={handleSendCode}>
                코드<br></br>재전송
              </button>
            </div>
          )}

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
    </div>
  );
}

export default FindPw;
