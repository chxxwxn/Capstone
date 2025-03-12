import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Join.module.css';

function Join() {
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    thirdParty: false,
  });

  // 개별 체크박스 변경 핸들러
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    let updatedAgreements = { ...agreements, [id]: checked };

    // 개별 체크박스가 모두 체크되면 'all' 체크
    if (id !== 'all') {
      const allChecked = updatedAgreements.terms && updatedAgreements.privacy && updatedAgreements.thirdParty;
      updatedAgreements.all = allChecked;
    } else {
      // '모든 약관 동의' 체크 시, 나머지도 체크 / 해제
      updatedAgreements = {
        all: checked,
        terms: checked,
        privacy: checked,
        thirdParty: checked,
      };
    }

    setAgreements(updatedAgreements);
  };

  // 모든 필수 항목이 체크되었을 때만 다음 페이지로 이동
  const handleNext = () => {
    if (agreements.terms && agreements.privacy && agreements.thirdParty) {
      setTimeout(() => {
        navigate('/Join2');
      }, 300); // 0.3초 딜레이 추가 (자연스럽게 이동)
    } else {
      alert('모든 필수 약관에 동의해야 합니다.');
    }
  };

  return (
    <div className={styles.container} onKeyDown={(e) => e.key === 'Enter' && handleNext()} tabIndex={0}>
      <div className={styles.main}>
        <h1 className={styles.title}>JOIN</h1>

        <p className={styles.description}>
          계속 진행하시려면<br />아래 권한에 동의해 주세요.
        </p>
        <p className={styles.terms}>*진행하시기 전에 내용을 검토하고 동의해 주세요.</p>

        <div className={styles["agreement-list"]}>
          <input type="checkbox" id="all" checked={agreements.all} onChange={handleCheckboxChange} />
          <label htmlFor="all"><strong>모든 약관에 동의합니다.</strong></label>
          <br />

          <input type="checkbox" id="terms" checked={agreements.terms} onChange={handleCheckboxChange} />
          <label htmlFor="terms"><a href="#">이용약관</a>에 동의합니다. *</label>

          <input type="checkbox" id="privacy" checked={agreements.privacy} onChange={handleCheckboxChange} />
          <label htmlFor="privacy"><a href="#">개인 정보 수집 및 이용</a>에 동의합니다. *</label>

          <input type="checkbox" id="thirdParty" checked={agreements.thirdParty} onChange={handleCheckboxChange} />
          <label htmlFor="thirdParty"><a href="#">개인 정보의 제3자 제공 및 국외 이전</a>에 동의합니다. *</label>
        </div>

        <button className={styles.button} onClick={handleNext}>계속</button>
      </div>
    </div>
  );
}

export default Join;
