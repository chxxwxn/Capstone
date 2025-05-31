import React, { useState, useContext, useEffect } from "react";
import styles from "./Saving&Rate.module.css";
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import { LoginContext } from "../Login/LoginContext";

const SavingRate = () => {
  const [savingCode, setSavingCode] = useState('');
  const [filter, setFilter] = useState("전체"); // 사용 여부 필터
  const [selectedPeriod, setSelectedPeriod] = useState("전체"); // 기간 필터
  const [currentRate, setCurrentRate] = useState("Enjoy"); // 현재 등급 상태
  const [showAll, setShowAll] = useState(false); // 전체 내역 표시 여부

  const [savings, setSavings] = useState([]);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const res = await fetch('http://localhost:8090/point/history', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          const formatted = data.map((item, index) => ({
            id: index + 1,
            amount: (item.amount > 0 ? "+" : "") + item.amount.toLocaleString() + "원",
            productName: item.description || "내역 없음",
            dead: item.expire_at ? `( ${item.expire_at} 소멸 예정)` : "-",
            date: item.created_at.substring(0, 10),
            use: item.type
          }));
          setSavings(formatted);
        } else {
          console.warn("적립금 내역 조회 실패");
        }
      } catch (error) {
        console.error("적립금 내역 불러오기 오류:", error);
      }
    };

    fetchSavings();
  }, []);

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
 

// 현재 날짜
const currentDate = new Date();

// 1️⃣ processedSavings를 먼저 선언
const processedSavings = savings.map((saving) => {
  const expirationDateMatch = saving.dead.match(/\d{4}-\d{2}-\d{2}/);
  if (expirationDateMatch) {
    const expirationDate = new Date(expirationDateMatch[0]);
    if (expirationDate < currentDate && saving.use === "적립") {
      return { ...saving, use: "만료" }; // 만료 상태로 변경
    }
  }
  return saving;
});

// 2️⃣ 이후에 calculateTotalSavings()에서 사용
const calculateTotalSavings = () => {
  return processedSavings.reduce((total, saving) => {
    const numericAmount = parseInt(saving.amount.replace(/[^0-9\-]/g, ""), 10);

    // 만료된 적립금은 제외
    if (saving.use === "만료") {
      return total;
    }

    return total + Math.max(numericAmount, 0);
  }, 0);
};

const savingTotal = calculateTotalSavings().toLocaleString() + "원";


const filteredByPeriodSavings = processedSavings.filter((saving) => {
  if (selectedPeriod === "전체") return true;

  const startDate = getDateRange(selectedPeriod);
  const savingDate = new Date(saving.date);

  return savingDate >= startDate;
});

// 사용 상태 (use)에 맞게 혜택 필터링
const filteredSavings = filteredByPeriodSavings.filter((saving) => {
  if (filter === "전체") return true;
  return saving.use === filter;
});

  const [visibleIndex, setVisibleIndex] = useState(null);

  const handleToggle = (index) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  const rateData = [
    { icon: "S", text: "Sensual 등급", ex1:"감각적인 \n 패션의 소유자<br/>전체 주문 금액 100만원 이상", ex2: "3% 할인 및 \n적립 적용<br />10%, 15% \n할인 쿠폰 매월 지급" },
    { icon: "T", text: "Trendy \n 등급", ex1: "유행을 \n 잘 따르는 사람<br/>전체 주문 금액 60만원 이상", ex2: "2% 할인 및 \n적립 적용<br />5%, 10% \n할인 쿠폰 매월 지급" },
    { icon: "Y", text: "Youth \n등급", ex1: "젊게 사는 사람<br/>전체 주문 금액 30만원 이상", ex2: "2% 할인 및 \n적립 적용<br />5% 할인 쿠폰 매월 2개 지급" },
    { icon: "L", text: "Learn \n등급", ex1: "패션 학습자<br/>전체 주문 금액 10만원 이상", ex2: "1% 할인 및 \n적립 적용<br />2% 할인 쿠폰 매월 2개 지급" },
    { icon: "E", text: "Enjoy \n등급", ex1: "패션을 \n즐기는 자<br/>첫 가입 시", ex2: "1% 적립 적용<br />10% 환영 쿠폰 및 배송비 무료 쿠폰 지급" },
  ];

  
  // 동적으로 스타일을 적용하는 함수
  const getStyle = (rate) => {
    const isCurrentRate = currentRate === rate.text.split(" ")[0]; // 현재 등급에 해당하는지 확인
    return {
      RateIcon: {
        backgroundColor: isCurrentRate ? "#303030" : "#ddd",
      },
      RateText: {
        color: isCurrentRate ? "#303030" : "#888",
      },
      RateEx1: {
        color: isCurrentRate ? "#303030" : "#888",
      },
      RateEx2: {
        color: isCurrentRate ? "#303030" : "#888",
      },
      RateLine: {
        backgroundColor: isCurrentRate ? "#303030" : "#ddd",
      }
    };
  };

  // 현재 날짜
  const today = new Date();

  const calculateLostSavings = () => {
    let remainingSavings = []; // 적립된 적립금 리스트 (FIFO 사용을 위해 배열로 관리)
    let usedAmount = 0; // 총 사용된 금액
  
    // 적립 및 사용 내역을 적립된 순서대로 처리
    savings.forEach(saving => {
      const numericAmount = parseInt(saving.amount.replace(/[^0-9\-]/g, ""), 10);
  
      if (saving.use === "적립") {
        // 적립이면 FIFO 순서대로 리스트에 추가
        remainingSavings.push({ amount: numericAmount, dead: new Date(saving.dead.match(/\d{4}-\d{2}-\d{2}/)[0]) });
      } else if (saving.use === "사용") {
        // 사용이면 먼저 적립된 금액부터 차감
        let amountToUse = numericAmount * -1; // 사용 금액을 양수로 변환
  
        while (amountToUse > 0 && remainingSavings.length > 0) {
          if (remainingSavings[0].amount <= amountToUse) {
            // 적립금 전액을 사용하면 배열에서 제거
            amountToUse -= remainingSavings[0].amount;
            remainingSavings.shift();
          } else {
            // 일부만 사용하고 남은 금액 업데이트
            remainingSavings[0].amount -= amountToUse;
            amountToUse = 0;
          }
        }
      }
    });
  
    // 현재 날짜 기준으로 30일 이내 소멸될 금액 계산
    return remainingSavings.reduce((total, saving) => {
      const diffDays = (saving.dead - today) / (1000 * 3600 * 24);
      if (diffDays <= 30 && diffDays >= 0) {
        return total + saving.amount;
      }
      return total;
    }, 0);
  };
  
  const lostTotal = calculateLostSavings().toLocaleString() + "원";
  
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

  return (
    isLoggedIn && member ? (
      <>
    <div className={styles.SavingRate}>
      <div className={styles.Saving}>
        <div className={styles.SavingRateTitle}>적립금 및 회원등급</div>
        <div className={styles.SavingTitle}>현재 적립금</div>
        <div className={styles.SavingTotal}>{member.point}</div>
        <div className={styles.Lost}>
          <span className={styles.LostText}>소멸 예정 적립금 (30일 이내)</span>
          <span className={styles.LostTotal}>{lostTotal}</span>
        </div>
      </div>

      <div className={styles.SavingHistory}>
        <div className={styles.SavingHistoryState}>
          <select className={styles.State} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="전체">전체</option>
            <option value="적립">적립</option>
            <option value="사용">사용</option>
            <option value="만료">만료</option>
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
        <div className={styles.SavingHistoryBox}>
          <div className={styles.ListHeader}>
            <span className={styles.Num}>번호</span>
            <span className={styles.Info}>적립</span>
            <span className={styles.Date}>적립/사용일</span>
            <span className={styles.Use}>사용</span>
          </div>
          {filteredSavings.length === 0 ? (
              <div className={styles.NoHistory}>적립금 내역이 없습니다</div>
            ) : (
              filteredSavings.slice(0, showAll ? filteredSavings.length : 5).map((saving) => (
                <div key={saving.id} className={styles.List}>
                  <span className={styles.NumDetail}>{saving.id}</span>
                  <div className={styles.InfoDetail}>
                    <span className={styles.Amount} style={{ textDecoration: saving.use === '만료' ? 'line-through' : 'none' }}>
                      {saving.amount}
                    </span>
                    <span className={styles.ProductName}>{saving.productName}</span>
                    <span className={styles.Dead}>{saving.dead}</span>
                  </div>
                  <span className={styles.DateDetail}>{saving.date}</span>
                  <span className={styles.UseDetail}>{saving.use}</span>
                </div>
              ))
  )}

            {filteredSavings.length > 5 && (
              <button className={styles.MoreButton} onClick={() => setShowAll(!showAll)}>
                {showAll ? "접기" : "더보기"}
              </button>
            )}
          </div>
      </div>

      <div className={styles.Rate}>
        <div className={styles.RateHeader}>
          <span className={styles.RateTitle}>등급별 혜택</span>
          <span className={styles.RateMy}>
             현재 회원님의 등급은 <span className={styles.RateMyCurrentRate}>{currentRate}</span> 입니다
        </span>
        </div>
        <p className={styles.MobileGuideText}>등급 아이콘을 클릭하여 혜택을 확인해 보세요</p>
          <div className={styles.RateContainer}>
          {rateData.map((rate, index) => {
        const stylesForRate = getStyle(rate);

        return (
          
          <div key={index} className={styles.RateBox}>
            <div className={styles.RateShow} onClick={() => handleToggle(index)}>
              <span
                className={styles.RateIcon}
                style={stylesForRate.RateIcon}
              >
                {rate.icon}
              </span>
              <span
                className={`${styles.RateText} ${
                  visibleIndex === index ? styles.show : styles.hide
                }`}
                style={stylesForRate.RateText}
              >
                {rate.text}
              </span>
            </div>
            <div
              className={`${styles.RateInfo} ${
                visibleIndex === index ? styles.show : styles.hide
              }`}
            >
              <div
                className={styles.RateEx1}
                dangerouslySetInnerHTML={{ __html: rate.ex1 }}
                style={stylesForRate.RateEx1}
              />
              <div className={styles.RateLine} style={stylesForRate.RateLine} />
              <span
                className={styles.RateEx2}
                dangerouslySetInnerHTML={{ __html: rate.ex2 }}
                style={stylesForRate.RateEx2}
              />
            </div>
          </div>
          
        );
          })}
        </div>
      </div>
    </div>
    </>
    ): (
      <Link to="/login"></Link>
    )
  );
};

export default SavingRate;
