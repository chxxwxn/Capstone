import React, { useState, useContext, useEffect  } from "react";
import styles from "./InfoEdit.module.css";
import { Info } from 'lucide-react';
import { LoginContext } from "../Login/LoginContext";
import { Link } from 'react-router-dom'


// 주소 입력 및 검색을 위한 컴포넌트
const AddressInput = ({ value, onChange, disabled, member }) => {
  const [postcode, setPostcode] = useState(value?.postcode || "");
  const [roadAddress, setRoadAddress] = useState(value?.roadAddress || "");
  const [detailAddress, setDetailAddress] = useState(value?.detailAddress || "");

  useEffect(() => {
    setPostcode(value?.postcode || "");
    setRoadAddress(value?.roadAddress || "");
    setDetailAddress(value?.detailAddress || "");
  }, [value]);

  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.onload = () => openPostcode();
      document.body.appendChild(script);
    } else {
      openPostcode();
    }
  };

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        const updated = {
          postcode: data.zonecode,
          roadAddress: data.roadAddress,
          detailAddress: "",
        };
        setPostcode(data.zonecode);
        setRoadAddress(data.roadAddress);
        setDetailAddress("");

        onChange(updated); // info 업데이트
        if (member?.memberMail) saveAddressToServer(updated, member);
      },
    }).open();
  };

  const handleDetailAddressChange = (e) => {
    const newDetail = e.target.value;
    setDetailAddress(newDetail);
    const updated = {
      postcode,
      roadAddress,
      detailAddress: newDetail,
    };
    onChange(updated);

    if (postcode && roadAddress && newDetail && member?.memberMail) {
      saveAddressToServer(updated, member);
    }
  };

  const saveAddressToServer = async (addr, member) => {
    try {
      const res = await fetch("http://localhost:8090/address/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          memberMail: member.memberMail,
          name: member.memberLn + member.memberFn,
          phone: `${member.memberNum1}-${member.memberNum2}-${member.memberNum3}`,
          address: addr.roadAddress,
          detailAddress: addr.detailAddress,
          zipCode: addr.postcode,
        }),
      });

      if (!res.ok) throw new Error("주소 저장 실패");
      console.log("주소 저장 성공");
    } catch (err) {
      console.error("주소 저장 오류:", err);
    }
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
              onChange={(e) => {
                setPostcode(e.target.value);
                onChange({ ...value, postcode: e.target.value });
              }}
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
            onChange={(e) => {
              setRoadAddress(e.target.value);
              onChange({ ...value, roadAddress: e.target.value });
            }}
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

const PhoneInput = ({ info, setInfo, disabled }) => (
  <div className={styles.InfoItem}>
    <div className={styles.InfoTitle}>휴대전화</div>
    <div className={styles.Information}>
      <div className={styles.PhoneInputWrapper}>
        <input
          type="text"
          value={info.memberNum1}
          onChange={(e) => setInfo((prev) => ({ ...prev, memberNum1: e.target.value }))}
          maxLength="3"
          className={styles.PhoneInput}
          placeholder="010"
          disabled={disabled}
        />
        -
        <input
          type="text"
          value={info.memberNum2}
          onChange={(e) => setInfo((prev) => ({ ...prev, memberNum2: e.target.value }))}
          maxLength="4"
          className={styles.PhoneInput}
          placeholder="1234"
          disabled={disabled}
        />
        -
        <input
          type="text"
          value={info.memberNum3}
          onChange={(e) => setInfo((prev) => ({ ...prev, memberNum3: e.target.value }))}
          maxLength="4"
          className={styles.PhoneInput}
          placeholder="5678"
          disabled={disabled}
        />
      </div>
    </div>
  </div>
);

const isPhoneValid = (inputValue) => {
  const regex = /^[0-9]{4}$/; // 4자리 숫자만 허용
  return regex.test(inputValue); // 4자리 숫자만 유효
};


const InfoEdit = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const [member, setMember] = useState(null);
  const [info, setInfo] = useState(null); // 초기엔 null
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    const storedMember = sessionStorage.getItem('member');
    if (storedMember) {
      try {
        const parsed = JSON.parse(storedMember);

        // 전화번호 초기값 처리
        let phoneRaw = parsed.memberNum1 || "";
        let num1 = parsed.memberNum1 || "";
        let num2 = parsed.memberNum2 || "";
        let num3 = parsed.memberNum3 || "";

        // +82 국제번호 제거 및 - 기준 분리
        if (phoneRaw.startsWith("+82")) {
          phoneRaw = phoneRaw.replace("+82", "").trim();
          if (phoneRaw.startsWith("10-")) {
            phoneRaw = "0" + phoneRaw;
          }
        }

        if ((num2 === "0000" && num3 === "0000") || (!num2 && !num3)) {
          const parts = phoneRaw.split("-");
          if (parts.length === 3) {
            num1 = parts[0];
            num2 = parts[1];
            num3 = parts[2];
          }
        }

        const parsedBirth = parsed.birth || "";
        const [year, month, day] = parsedBirth.split("-");

        setMember(parsed);

        setInfo({
          email: parsed.memberMail,
          password: parsed.memberPw,
          name: parsed.memberFn + parsed.memberLn || '',
          memberNum1: num1,
          memberNum2: num2,
          memberNum3: num3,
          address: { postcode: '', roadAddress: '', detailAddress: '' },
          receiveAds: "none",
          gender: parsed.gender || "none",
          birthYear: year || "1990",
          birthMonth: month || "01",
          birthDay: day || "01",
          height: parsed.height || "",
          weight: parsed.weight || "",
        });

        // 주소 정보 불러오기
      fetch(`http://localhost:8090/address/get?memberMail=${parsed.memberMail}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => {
          if (res.status === 204) return null;
          return res.json();
        })
        .then((data) => {
          if (data) {
            setInfo((prev) => ({
              ...prev,
              address: {
                postcode: data.zipCode,
                roadAddress: data.address,
                detailAddress: data.detailAddress,
              }
            }));
          } else {
            console.log("주소 정보 없음 — 사용자 입력 필요");
          }
        });
    } catch (error) {
      console.error('JSON parsing error:', error);
      sessionStorage.removeItem('member');
    }
  }
}, []);
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

  const getPhone = () => {
    
    const { memberNum1, memberNum2, memberNum3 } = info;

    // 값이 다 들어와 있을 경우 조합
  if (memberNum1 && memberNum2 && memberNum3) {
    return `${memberNum1}-${memberNum2}-${memberNum3}`;
  }

  // memberNum1이 전체 번호인 경우
  if (memberNum1 && memberNum1.includes("-")) {
    return memberNum1;
  }
     return "";
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
  const phone = getPhone(); // 여기서 phone 값 정상화
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  const isPhoneValid = phoneRegex.test(phone);

  const isPasswordValid = passwordValid;
  const isConfirmPasswordValid = confirmPassword.trim() !== "" && confirmPassword === info.password;
  const isAddressValid = info.address.postcode.trim() !== "" && info.address.roadAddress.trim() !== "";

  console.log("phone:", phone, "=>", isPhoneValid);
  console.log("password:", info.password, "=>", isPasswordValid);
  console.log("confirmPassword:", confirmPassword, "=>", isConfirmPasswordValid);
  console.log("address:", info.address, "=>", isAddressValid);

  return isPhoneValid && isPasswordValid && isConfirmPasswordValid && isAddressValid;
  };
    

  // 저장하기 버튼 클릭 핸들러
  const handleSave = async () => {
    if (!validateForm()) {
      alert("모든 필드를 정확히 입력해주세요.");
      return;
    }

    try {
      const fullBirth = `${info.birthYear}-${info.birthMonth}-${info.birthDay}`;

      // 회원 정보 수정 요청
      await fetch('http://localhost:8090/member/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        memberMail: info.email,
        memberPw: info.password,
        memberNum1: info.memberNum1,
        memberNum2: info.memberNum2,
        memberNum3: info.memberNum3,
        gender: info.gender || "none",
        birth: fullBirth,
        height: parseInt(info.height) || 0,
        weight: parseInt(info.weight) || 0,
      }),
    });

      // 주소 저장 요청
      await fetch('http://localhost:8090/address/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          address: info.address.roadAddress,
          detailAddress: info.address.detailAddress,
          zipCode: info.address.postcode,
        }),
      });
          alert("정보가 성공적으로 저장되었습니다.");
          setIsEditable(false);
        } catch (error) {
          console.error("저장 중 오류 발생:", error);
          alert("저장에 실패했습니다.");
        }
      };

  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    isLoggedIn && member ? (
    <>
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

  <div className={styles.InfoItem2}>
    <div className={styles.InfoTitle}>비밀번호</div>
    
    <div className={styles.InputArea}>
      <div className={styles.InputWrapper}>
        <input
  type={isEditable ? (showPassword ? "text" : "password") : "password"}
  value={isEditable ? info.password : "********"} // isEditable 아닐 때는 마스킹
  onChange={handlePasswordChange}
  className={`${styles.InfoInput} ${
    info.password !== "" && !passwordValid ? styles.invalidBorder : ""
  } ${passwordValid && info.password !== "" ? styles.validBorder : ""}`}
  placeholder={isEditable ? "새 비밀번호" : "********"}
  disabled={!isEditable}
/>

{/* 비밀번호 보기 토글 (선택사항) */}
{isEditable && (
  <div
    className={styles.InfoHintIcon}
    onClick={() => setShowTooltip((prev) => !prev)}
  >
    <Info size={14} />
  </div>
)}
      </div>

      {isEditable && showTooltip && (
        <div className={styles.Information4}>
          8~16자 영문 소문자/숫자/특수문자{"\n"}중 2가지 이상 조합
        </div>
      )}
    </div>
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
        <PhoneInput info={info} setInfo={setInfo} disabled={!isEditable} />
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
                    <div className={styles.InputWrapper2}>
                    <div className={styles.Information}>
                      <input
                        type="number"
                        value={info.height}
                        onChange={(e) => setInfo({ ...info, height: e.target.value })}
                        className={styles.InfoInput}
                        placeholder="키"
                        disabled={!isEditable}
                      />
                      <span className={styles.Information3}>cm</span>
                    </div>
                    </div>
                  </div>

                  {/* 몸무게 입력 */}
                  <div className={styles.InfoItem}>
                    <div className={styles.InfoTitle}>몸무게</div>
                    <div className={styles.InputWrapper2}>
                    <div className={styles.Information}>
                      <input
                        type="number"
                        value={info.weight}
                        onChange={(e) => setInfo({ ...info, weight: e.target.value })}
                        className={styles.InfoInput}
                        placeholder="몸무게"
                        disabled={!isEditable}
                      />
                     <span className={styles.Information3}>kg</span>
                    </div>
                    </div>
                  </div>

        </div>
       
      </div>
      <div className={styles.Secession}>회원탈퇴</div>
    </div>
    </>
    ): (
      <Link to="/login"></Link>
    )
  );
};

export default InfoEdit;