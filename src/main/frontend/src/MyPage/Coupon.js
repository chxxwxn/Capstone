import React, { useState, useContext, useEffect } from 'react';
import styles from "./Coupon.module.css";
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import { LoginContext } from "../Login/LoginContext";


const Coupon = () => {
    const [couponCode, setCouponCode] = useState('');
    const [filter, setFilter] = useState("전체"); // 사용 여부 필터
    const [selectedPeriod, setSelectedPeriod] = useState("전체"); // 기간 필터
    const { isLoggedIn } = useContext(LoginContext);
    const [member, setMember] = useState(null);

    useEffect(() => {
        const storedMember = sessionStorage.getItem('member');
        if (storedMember) {
          try {
            setMember(JSON.parse(storedMember)); // JSON 변환
          } catch (error) {
            console.error('JSON parsing error:', error);
            sessionStorage.removeItem('member'); // 오류 발생 시 데이터 삭제
          }
        }
      }, []);

    useEffect(() => {
        const storedMember = sessionStorage.getItem('member');
        if (!storedMember) return;

        const parsed = JSON.parse(storedMember);
        const email = parsed.memberMail;

        fetch(`http://localhost:8090/coupon/list?memberMail=${email}`, {
            method: "GET",
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => {
            const mappedCoupons = data.map((coupon) => ({
                id: coupon.couponId,
                discount: coupon.discountType === 'percent' ? `${coupon.discountValue}% 할인` : "무료 배송",
                name: coupon.name,
                dead: coupon.expireDate ? `( ${coupon.expireDate} 소멸 예정)` : "",
                date: coupon.issueDate || "날짜 없음",
                use: coupon.status
            }));

            setCoupons(mappedCoupons);
            })
            .catch((err) => {
            console.error("쿠폰 불러오기 실패:", err);
            });
    }, []);

    const handleCouponCodeChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) {
            setCouponCode(value);
        }
    };

    const getDateRange = (period) => {
        const today = new Date();
        let startDate;

        switch (period) {
            case "오늘":
                startDate = today;
                break;
            case "1주일":
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                break;
            case "1개월":
                startDate = new Date(today);
                startDate.setMonth(today.getMonth() - 1);
                break;
            case "3개월":
                startDate = new Date(today);
                startDate.setMonth(today.getMonth() - 3);
                break;
            default:
                startDate = new Date("1900-01-01");
        }

        return startDate;
    };

    const [coupons, setCoupons] = useState([
        {
            id: 1,
            discount: "10% 할인",
            name: "신규 가입 쿠폰",
            dead: "( 2025-03-20 소멸 예정)",
            date: "2025-03-25", // 임의의 등록일
            use: "사용 가능",
        },
        {
            id: 2,
            discount: "5,000원 할인",
            name: "생일 축하 쿠폰",
            dead: "( 2025-03-20 소멸 예정)",
            date: "2024-11-25", // 임의의 등록일
            use: "사용 완료",
        },
        {
            id: 3,
            discount: "5,000원 할인",
            name: "생일 축하 쿠폰",
            dead: "( 2025-03-20 소멸 예정)",
            date: "2025-03-25", // 임의의 등록일
            use: "사용 만료",
        },
    ]);

    // Period에 맞게 쿠폰 필터링
    const filteredByPeriodCoupons = coupons.filter(coupon => {
        if (selectedPeriod === "전체") return true;

        const startDate = getDateRange(selectedPeriod);
        const couponDate = new Date(coupon.date);  // 쿠폰의 등록일을 Date 객체로 변환

        return couponDate >= startDate; // 선택한 기간 내의 쿠폰만 반환
    });

    // 사용 상태 (use)에 맞게 쿠폰 필터링
    const filteredCoupons = filteredByPeriodCoupons.filter(coupon => {
        if (filter === "전체") return true;
        return coupon.use === filter;
    });

    const handleCouponSubmit = async () => {
        if (couponCode.length !== 10) {
            alert("쿠폰 코드는 숫자 10자리여야 합니다.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8090/coupon/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // 세션 기반 인증 시 필요
            body: JSON.stringify({
                couponCode: couponCode,
                name: "사용자 입력 쿠폰",          // 예시 이름, 서버에서도 변경 가능
                discountType: "percent",          // 또는 "free_shipping"
                discountValue: 10,                // 예: 10% 할인
                status: "사용 가능",
                expireDate: "2025-12-31"          // 만료일 직접 지정 또는 서버에서 계산
            }),
            });

            if (response.ok) {
            alert("쿠폰이 등록되었습니다!");
            setCouponCode("");
            } else {
            const errorText = await response.text();
            alert(`쿠폰 등록 실패: ${errorText}`);
            }
        } catch (error) {
            console.error("쿠폰 등록 중 오류:", error);
            alert("쿠폰 등록에 실패했습니다.");
        }
    };
    

    return (
        isLoggedIn && member ? (
    <>
        <div className={styles.Coupon}>
            <div className={styles.CouponHeader}>
                <div className={styles.CouponTitle}>쿠폰</div>
                <div className={styles.CouponRegister}>
                    <div className={styles.CouponRegisterTitle}>쿠폰 등록</div>
                    <div className={styles.CouponRegisterBox}>
                        <div className={styles.EntryBox}>
                            <input
                                type="text"
                                className={styles.CodeEntry}
                                placeholder="쿠폰 코드 입력(숫자 10자리)"
                                value={couponCode}
                                onChange={handleCouponCodeChange}
                                maxLength="10"
                                required
                            />
                            <button
                                className={styles.CodeEnter}
                                style={{
                                    backgroundColor: couponCode.length === 10 ? '#303030' : '#ccc',
                                    cursor: couponCode.length === 10 ? 'pointer' : 'not-allowed',
                                }}
                                disabled={couponCode.length !== 10}
                                onClick={handleCouponSubmit}
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.CouponHistory}>
                <div className={styles.CouponHistoryTitle}>쿠폰 내역</div>
                <div className={styles.CouponHistoryState}>
                    <select className={styles.State} value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="전체">전체</option>
                        <option value="사용 가능">사용 가능</option>
                        <option value="사용 완료">사용 완료</option>
                        <option value="사용 만료">사용 만료</option>
                    </select>
                    <span className={styles.Period}>
                        {["전체", "오늘", "1주일", "1개월", "3개월"].map((period) => (
                            <button
                                key={period}
                                className={`${styles.PeriodButton} ${selectedPeriod === period ? styles.Selected : ""}`}
                                onClick={() => setSelectedPeriod(period)}
                            >
                                {period}
                            </button>
                        ))}
                    </span>
                </div>
                <div className={styles.CouponHistoryBox}>
                    <div className={styles.ListHeader}>
                        <span className={styles.Num}>번호</span>
                        <span className={styles.Info}>쿠폰</span>
                        <span className={styles.Date}>등록일</span>
                        <span className={styles.Use}>사용</span>
                    </div>
                    {filteredCoupons.map((coupon) => (
                        <div key={coupon.id} className={styles.List}>
                            <span className={styles.NumDetail}>{coupon.id}</span>
                            <div className={styles.InfoDetail}>
                                <span
                                    className={styles.Discount}
                                    style={{
                                        textDecoration: coupon.use === '사용 만료' ? 'line-through' : 'none',
                                    }}
                                >
                                    {coupon.discount}
                                </span>
                                <span className={styles.Name}>{coupon.name}</span>
                                <span className={styles.Dead}>{coupon.dead}</span>
                            </div>
                            <span className={styles.DateDetail}>{coupon.date}</span>
                            <span className={styles.UseDetail}>{coupon.use}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
        ) : (
            <Link to="/login"></Link>
        )
    );
};

export default Coupon;
