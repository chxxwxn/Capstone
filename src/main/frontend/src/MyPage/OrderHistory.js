import React, { useState, useEffect, useContext } from "react";
import styles from "./OrderHistory.module.css";
import { Link } from "react-router-dom";
import { LoginContext } from "../Login/LoginContext";

const OrderHistory = () => {
    const [filterOrderCheck, setFilterOrderCheck] = useState("전체");
    const [filterOrderClaim, setFilterOrderClaim] = useState("전체");
    const [selectedPeriod, setSelectedPeriod] = useState("전체");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [activeTab, setActiveTab] = useState("OrderCheck");
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [visibleOrders, setVisibleOrders] = useState(5); // 처음에는 5개만 표시
    const { isLoggedIn } = useContext(LoginContext);
    const [member, setMember] = useState(null);
    const getDateRange = (period) => {
        const today = new Date();
        let startDate = new Date("1900-01-01");

        switch (period) {
            case "오늘":
                startDate = new Date(today);
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
                break;
        }
        return startDate;
    };

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
        const storedMember = sessionStorage.getItem("member");
        if (storedMember) {
            setMember(JSON.parse(storedMember));
        }
    }, []);

    useEffect(() => {
        if (!member) return;

        fetch(`http://localhost:8090/order/list?memberMail=${member.memberMail}`, {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ 주문 원본 데이터:", JSON.stringify(data, null, 2));

            const converted = data.map(order => ({
                ...order,
                orderDate: new Date().toISOString().split("T")[0],
                orderNum: order.orderId,
                img: order.image,
                productName: order.productName,
                size: order.size,
                color: order.color,
                price: Number(order.price).toLocaleString() + "원",
                quantity: order.quantity,
                status: order.status
            }));

            setOrders(converted);
            setFilteredOrders(converted); // 초기값으로 설정
            })
            .catch(err => console.error("주문 데이터 불러오기 실패:", err));
    }, [member]);

    useEffect(() => {
        let filtered = orders;
    
        // 1️⃣ 날짜 필터링
        if (selectedPeriod !== "전체") {
            const start = getDateRange(selectedPeriod);
            const end = new Date();
            filtered = filtered.filter(order => {
                const [year, month, day] = order.orderDate.split(".");
                const orderDateObj = new Date(order.order_date ?? order.orderDate); // 둘 다 고려
                return orderDateObj >= start && orderDateObj <= end;
            });
        }
    
        // 2️⃣ 탭에 따른 상태 필터링
        if (activeTab === "OrderCheck") {
            const validStatuses = ["주문 접수", "결제 완료", "상품 준비 중", "배송 준비 중", "배송 시작", "배송 완료"];
            filtered = filtered.filter(order => validStatuses.includes(order.status));
            if (filterOrderCheck !== "전체") {
                filtered = filtered.filter(order => order.status === filterOrderCheck);
            }
        } else if (activeTab === "OrderClaim") {
            const validStatuses = [
                "취소 접수", "취소 진행 중", "취소 완료",
                "교환 접수", "교환 진행 중", "교환 완료",
                "환불 접수", "환불 진행 중", "환불 완료",
                "반품 접수", "반품 진행 중", "반품 완료"
            ];
            filtered = filtered.filter(order => validStatuses.includes(order.status));
    
            if (filterOrderClaim !== "전체") {
                const statusMapping = {
                    "취소": ["취소 접수", "취소 진행 중", "취소 완료"],
                    "교환": ["교환 접수", "교환 진행 중", "교환 완료"],
                    "환불": ["환불 접수", "환불 진행 중", "환불 완료"],
                    "반품": ["반품 접수", "반품 진행 중", "반품 완료"]
                };
                filtered = filtered.filter(order =>
                    statusMapping[filterOrderClaim]?.includes(order.status) || order.status === filterOrderClaim
                );
            }
        }
    
        setFilteredOrders(filtered);
    }, [selectedPeriod, activeTab, filterOrderCheck, filterOrderClaim]);
    

    const handleSearch = () => {
        const start = startDate ? new Date(startDate) : getDateRange(selectedPeriod);
        const end = endDate ? new Date(endDate) : new Date();

        const filtered = orders.filter((order) => {
            const [year, month, day] = order.orderDate.split(".");
            const orderDateObj = new Date(`${year}-${month}-${day}`);
            return orderDateObj >= start && orderDateObj <= end;
        });

        setFilteredOrders(filtered);
    };

    const handleLoadMore = () => {
        setVisibleOrders((prevVisibleOrders) => prevVisibleOrders + 5);
    };

    return (
        isLoggedIn && member ? (
        <div className={styles.OrderHistory}>
            <div className={styles.Container}>
                <div className={styles.OrderHistoryTitle}>주문 내역</div>
                <div className={styles.OrderHistoryHeader}>
                    <div
                        className={`${styles.OrderCheck} ${activeTab === "OrderCheck" ? styles.Active : styles.Inactive}`}
                        onClick={() => setActiveTab("OrderCheck")}
                    >
                        주문 내역 조회
                    </div>
                    <div
                        className={`${styles.OrderClaim} ${activeTab === "OrderClaim" ? styles.Active : styles.Inactive}`}
                        onClick={() => setActiveTab("OrderClaim")}
                    >
                        취소/교환/환불/반품
                    </div>
                </div>

                <div className={styles.OrderHistoryHeader2}>
                    <div className={styles.OrderHistoryState}>
                        <select
                            className={styles.State}
                            value={activeTab === "OrderCheck" ? filterOrderCheck : filterOrderClaim}
                            onChange={(e) => {
                                if (activeTab === "OrderCheck") {
                                    setFilterOrderCheck(e.target.value);
                                } else {
                                    setFilterOrderClaim(e.target.value);
                                }
                            }}
                        >
                            <option value="전체">전체 | 주문 상태</option>
                            {activeTab === "OrderCheck" ? (
                                <>
                                    <option value="주문 접수">주문 접수</option>
                                    <option value="결제 완료">결제 완료</option>
                                    <option value="상품 준비 중">상품 준비 중</option>
                                    <option value="배송 준비 중">배송 준비 중</option>
                                    <option value="배송 시작">배송 시작</option>
                                    <option value="배송 완료">배송 완료</option>
                                </>
                            ) : (
                                <>
                                    <option value="취소">취소</option>
                                    <option value="교환">교환</option>
                                    <option value="환불">환불</option>
                                    <option value="반품">반품</option>
                                </>
                            )}
                        </select>

                        <span className={styles.Period}>
                            <span className={styles.PeriodText}>
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
                            <span className={styles.PeriodSelect}>
                                <input
                                    type="date"
                                    className={styles.PeriodInput}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <span> - </span>
                                <input
                                    type="date"
                                    className={styles.PeriodInput}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                <button className={styles.SearchButton} onClick={handleSearch}>
                                    조회
                                </button>
                            </span>
                        </span>
                    </div>
                </div>

                <div className={styles.ProductList}>
                    {filteredOrders.slice(0, visibleOrders).map((order) => (
                        <div key={order.id} className={styles.ProductList}>
                            <div className={styles.OrederNumDate}>
                               <div className={styles.OrederDate}>
                                    {order.orderDate.replaceAll("-", ".")}
                                </div>
                                <div> | </div>
                                <div className={styles.OrederNum}>
                                    <Link to={`/mypage/OrderHistory/${order.orderNum}`} className={styles.OrderLink}>
                                        {order.orderNum}
                                    </Link>
                                </div>

                            </div>

                            <div className={styles.OrderBox}>
                                <div className={styles.OrderInfoBox}>
                                    <div className={styles.OrderPhoto}>
                                        <img src={order.img} alt={order.productName} />
                                    </div>
                                    <div className={styles.ProductLine}></div>
                                    <div className={styles.InfoBox}>
                                        <div className={styles.OrderInfo}>
                                            <div className={styles.ProductName}>{order.productName}</div>
                                            <div className={styles.ProductInfo}>
                                                <div className={styles.Size}>{order.size}</div> /
                                                <div className={styles.Color}>{order.color.split("-")[1]}</div>
                                            </div>
                                        </div>
                                        <div className={styles.BuyInfo}>
                                            <div className={styles.Price}>{order.price}</div> •
                                            <div className={styles.Info}>{order.quantity}개</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.OrderStatusContainer}>
                                    <div className={styles.OrderStatus}>{order.status}</div>
                                    <div className={styles.OrderStatusAdd}>
                                        {order.status === "배송 완료" && (
                                            <button className={styles.ReviewButton} onClick={() => console.log("리뷰 작성 페이지 이동")}>
                                                리뷰 쓰기
                                            </button>
                                        )}
                                        {order.status === "배송 시작" && (
                                            <button className={styles.TrackButton} onClick={() => console.log("배송 조회 페이지 이동")}>
                                                배송 조회
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredOrders.length > 5 && visibleOrders < filteredOrders.length && (
                    <div className={styles.More} onClick={handleLoadMore}>
                        더 보기
                    </div>
                )}
                <div className={styles.NoOrders}>{filteredOrders.length === 0 && "주문 내역이 없습니다."}</div>
            </div>
        </div>
        ) :(
      <div></div>
    )
    );
};

export default OrderHistory;
