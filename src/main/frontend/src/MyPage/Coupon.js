import React, { useState } from 'react';
import styles from "./Coupon.module.css";

const Coupon = () => {
    const [couponCode, setCouponCode] = useState('');
    const [filter, setFilter] = useState("전체"); // 사용 여부 필터
    const [selectedPeriod, setSelectedPeriod] = useState("전체"); // 기간 필터

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

    const handleCouponSubmit = () => {
        const validCouponCode = '0123456789';
        if (couponCode === validCouponCode) {
            // 현재 날짜를 YYYY-MM-DD 형식으로 변환
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];  // "2025-03-25" 형식
    
            setCoupons([
                ...coupons,
                {
                    id: coupons.length + 1,
                    discount: "테스트 쿠폰",
                    name: "테스트 쿠폰",
                    dead: "( 2222-22-22 소멸 예정)",
                    date: formattedDate,  // 변환된 날짜 사용
                    use: "사용 가능",
                },
            ]);
            setCouponCode('');
        } else {
            alert("잘못된 쿠폰 코드입니다.");
        }
    };
    

    return (
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
    );
};

export default Coupon;
