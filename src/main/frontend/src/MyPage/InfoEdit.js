import React, { useState } from "react";
import styles from "./InfoEdit.module.css";


// 주소 입력 및 검색을 위한 컴포넌트
const AddressInput = ({ value, onChange, disabled }) => {
  const [postcode, setPostcode] = useState(value?.postcode || "");
  const [roadAddress, setRoadAddress] = useState(value?.roadAddress || "");
  const [detailAddress, setDetailAddress] = useState(value?.detailAddress || "");

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setPostcode(data.zonecode);
        setRoadAddress(data.roadAddress);
        setDetailAddress("");
      },
    }).open();
  };

  const handleDetailAddressChange = (e) => {
    setDetailAddress(e.target.value);
    onChange({
      postcode,
      roadAddress,
      detailAddress: e.target.value,
    });
  };

  return (
    <div className={styles.InfoItem2}>
      <div className={styles.InfoTitle}>주소</div>
      <div className={styles.Information}>
        <div className={styles.AddressWrapper}>
          <div className={styles.AddressWrapper1}>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className={styles.InfoInput2}
              placeholder="우편번호"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className={styles.AddressButton}
              disabled={disabled}
            >
              주소 검색
            </button>
          </div>
          <input
            type="text"
            value={roadAddress}
            onChange={(e) => setRoadAddress(e.target.value)}
            className={styles.InfoInput}
            placeholder="주소"
            disabled={disabled}
          />
          <input
            type="text"
            value={detailAddress}
            onChange={handleDetailAddressChange}
            className={styles.InfoInput}
            placeholder="상세주소"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

const InfoInput = ({ title, type, value, onChange, placeholder, helperText, disabled }) => (
  <div className={styles.InfoItem}>
    <div className={styles.InfoTitle}>{title}</div>
    <div className={styles.Information}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={styles.InfoInput}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
    {helperText && <div className={styles.Information2}>{helperText}</div>}
  </div>
);

const PhoneInput = ({ value, onChange, disabled }) => (
  <div className={styles.InfoItem}>
    <div className={styles.InfoTitle}>휴대전화</div>
    <div className={styles.Information}>
      <div className={styles.PhoneInputWrapper}>
        {["010", "0000", "0000"].map((placeholder, index) => (
          <React.Fragment key={index}>
            <input
              type="text"
              value={index === 0 ? "010" : value.split("-")[index] || ""}
              onChange={(e) => onChange(e, index)}
              maxLength="4"
              className={`${styles.PhoneInput} ${
                // 첫 번째 칸인 '010'은 유효성 검사 및 보더 색상 변화에 영향 없음
                index !== 0 && !isPhoneValid(value.split("-")[index]) && value.split("-")[index] !== "" && !disabled
                  ? styles.invalidBorder
                  : ""
              } ${index !== 0 && isPhoneValid(value.split("-")[index]) && !disabled ? styles.validBorder : ""}`}
              placeholder={placeholder}
              disabled={disabled}
            />
            {index < 2 && "-"}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

const isPhoneValid = (inputValue) => {
  const regex = /^[0-9]{4}$/; // 4자리 숫자만 허용
  return regex.test(inputValue); // 4자리 숫자만 유효
};


const InfoEdit = () => {
  const [info, setInfo] = useState({
    email: "test1234@naver.com",
    password: "qwer1234",
    name: "홍길동",
    phone: "010-1234-1234",
    address: { postcode: "우편번호", roadAddress: "주소", detailAddress: "상세주소" },
    receiveAds: "none",
    gender: "male",
    birthYear: "1990",
    birthMonth: "01",
    birthDay: "01",
    height: "170",
    weight: "65",
  });
  const [isEditable, setIsEditable] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [isPasswordMatch, setPasswordMatch] = useState(false);
  const [isValid, setIsValid] = useState(true); // 유효성 상태

// 비밀번호 유효성 검사 함수
const validatePassword = (password) => {
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValidLength = password.length >= 8 && password.length <= 16;

  return isValidLength && ((hasLowercase && hasNumber) || (hasLowercase && hasSpecialChar) || (hasNumber && hasSpecialChar));
};



  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setInfo({ ...info, password: newPassword });
  
    // 비밀번호 실시간 유효성 검사
    setPasswordValid(validatePassword(newPassword));
  };
  // 비밀번호 확인 입력 핸들러
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatch(newConfirmPassword === info.password);  // 비밀번호와 일치하는지 확인 후 상태 업데이트
  };

  // 주소 변경 핸들러
  const handleAddressChange = (newAddress) => {
    setInfo({ ...info, address: newAddress });
  };

  // 전화번호 변경 핸들러
  const handlePhoneChange = (e, index) => {
    const newPhone = [...info.phone.split("-")];
    newPhone[index] = e.target.value;
    setInfo({ ...info, phone: newPhone.join("-") });

    console.log(info.phone.split("-")); // 전화번호 배열 확인
  };

  // 유효성 검사 함수
const validateForm = () => {
  // 전화번호 유효성 검사
  const isPhoneValid = info.phone.split("-").every((part) => part.length === 4 && /^[0-9]{4}$/.test(part));

  // 비밀번호 유효성 검사
  const isPasswordValid = passwordValid;
  const isConfirmPasswordValid = confirmPassword === info.password;

  // 모든 조건이 만족해야 저장 가능
  return isPhoneValid && isPasswordValid && isConfirmPasswordValid;
};

// 저장하기 버튼 클릭 핸들러
const handleSave = () => {
  if (!validateForm()) {
    alert("모든 필드를 정확히 입력해주세요.");
    setIsValid(false); // 유효성 검사 실패 시 상태 업데이트
  } else {
    alert("저장되었습니다!");
    setIsValid(true); // 유효성 검사 성공 시 상태 업데이트
    setIsEditable(false); // 수정 불가능 상태로 전환
  }
};

  
  return (
    <div className={styles.InfoEdit}>
      <div className={styles.InfoEditHeader}>
        <div className={styles.InfoEditTitle}>회원정보</div>
        <div className={styles.InfoHeader}>
          <div className={styles.InfoEditTitle2}>기본정보</div>
          <div
            className={styles.editButton}
            onClick={() => {
              if (isEditable) {
                handleSave(); // 저장하기 버튼 클릭 시 저장
              } else {
                setIsEditable(true); // 수정 가능 상태로 전환
              }
            }}
          >
            {isEditable ? "저장하기" : "수정하기"}
          </div>

        </div>
      </div>

      <div className={styles.InfoBox}>
        <InfoInput
          title="이메일"
          type="email"
          value={info.email}
          onChange={() => {}}
          placeholder="이메일"
          disabled={true}
        />

          <div className={styles.InfoItem}>
            <div className={styles.InfoTitle}>비밀번호</div>
            <div className={styles.Information}>
              <input
                type={isEditable ? "text" : "password"}
                value={info.password}
                onChange={handlePasswordChange} // 실시간 유효성 검사 핸들러
                className={`${styles.InfoInput} ${
                  info.password !== "" && !passwordValid ? styles.invalidBorder : ""
                } ${passwordValid && info.password !== "" ? styles.validBorder : ""}`}
                placeholder={isEditable ? "새 비밀번호" : "비밀번호"}
                disabled={!isEditable}
              />
            </div>

            {isEditable && (
              <div className={styles.Information2}>
                영문 소문자/숫자/특수문자 중 2가지 이상 조합, 8~16자
              </div>
            )}
          </div>

        {/* 비밀번호 확인 */}
        {isEditable && (
          <div className={styles.InfoItem}>
            <div className={styles.InfoTitle}>비밀번호 확인</div>
            <div className={styles.Information}>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`${styles.InfoInput} ${
                  !isPasswordMatch && confirmPassword !== "" ? styles.invalidBorder : ""
                } ${isPasswordMatch ? styles.validBorder : ""}`}
                placeholder="비밀번호 확인"
                disabled={!isEditable}
              />
            </div>
          </div>
        )}

        <InfoInput title="이름" type="text" value={info.name} onChange={() => {}} placeholder="이름" disabled={true} />
        <AddressInput value={info.address} onChange={handleAddressChange} disabled={!isEditable} />
        <PhoneInput value={info.phone} onChange={handlePhoneChange} disabled={!isEditable} />
        <div className={styles.InfoItem}>
          <div className={styles.InfoTitle}>광고수신여부</div>
          <div className={styles.Information}>
            <div className={styles.adwrapper}>
              {["none", "kakao", "sms"].map((value) => (
                <label key={value} className={styles.RadioLabel}>
                  <input
                    type="radio"
                    name="receiveAds"
                    value={value}
                    checked={info.receiveAds === value}
                    onChange={(e) => setInfo({ ...info, receiveAds: e.target.value })}
                    className={styles.RadioInput}
                    disabled={!isEditable}
                  />
                  {value === "none" ? "수신 안 함" : value === "kakao" ? "카카오톡" : "문자"}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.InfoHeader}>
         <div className={styles.InfoEditTitle2}>추가정보</div>        
      </div>
        <div className={styles.InfoBox2}>
          <div className={styles.InfoEditHeader}>
          
          {/* 성별 선택 */}
          <div className={styles.InfoItem}>
                  <div className={styles.InfoTitle}>성별</div>
                  <div className={styles.Information}>
                  <div className={styles.adwrapper}>
                    {["male", "female", "none"].map((value) => (
                      <label key={value} className={styles.RadioLabel}>
                        <input
                          type="radio"
                          name="gender"
                          value={value}
                          checked={info.gender === value}
                          onChange={(e) => setInfo({ ...info, gender: e.target.value })}
                          className={styles.RadioInput}
                          disabled={!isEditable}
                        />
                        {value === "male" ? "남성" : value === "female" ? "여성" : "선택 안함"}
                      </label>
                    ))}
                    </div>
                  </div>
                </div>


                  {/* 생년월일 선택 */}
                  <div className={styles.InfoItem}>
                    <div className={styles.InfoTitle}>생년월일</div>
                    <div className={styles.Information}>
                    <div className={styles.birthwrapper}>
                      <select
                        value={info.birthYear}
                        onChange={(e) => setInfo({ ...info, birthYear: e.target.value })}
                        className={styles.SelectInput}
                        disabled={!isEditable}
                      >
                        {Array.from({ length: 100 }, (_, i) => (
                          <option key={i} value={1925 + i}>
                            {1925 + i}
                          </option>
                        ))}
                      </select>
                      <select
                        value={info.birthMonth}
                        onChange={(e) => setInfo({ ...info, birthMonth: e.target.value })}
                        className={styles.SelectInput}
                        disabled={!isEditable}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <select
                        value={info.birthDay}
                        onChange={(e) => setInfo({ ...info, birthDay: e.target.value })}
                        className={styles.SelectInput}
                        disabled={!isEditable}
                      >
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      </div>
                    </div>
                  </div>

                  {/* 키 입력 */}
                  <div className={styles.InfoItem}>
                    <div className={styles.InfoTitle}>키</div>
                    <div className={styles.Information}>
                      <input
                        type="number"
                        value={info.height}
                        onChange={(e) => setInfo({ ...info, height: e.target.value })}
                        className={styles.InfoInput}
                        placeholder="키"
                        disabled={!isEditable}
                      />
                      <span className={styles.Information2}>cm</span>
                    </div>
                  </div>

                  {/* 몸무게 입력 */}
                  <div className={styles.InfoItem}>
                    <div className={styles.InfoTitle}>몸무게</div>
                    <div className={styles.Information}>
                      <input
                        type="number"
                        value={info.weight}
                        onChange={(e) => setInfo({ ...info, weight: e.target.value })}
                        className={styles.InfoInput}
                        placeholder="몸무게"
                        disabled={!isEditable}
                      />
                      <div className={styles.Information2}>kg</div>
                    </div>
                  </div>
        </div>
       
      </div>
      <div className={styles.Secession}>회원탈퇴</div>
    </div>
  );
};

export default InfoEdit;