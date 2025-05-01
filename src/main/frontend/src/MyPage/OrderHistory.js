import React, { useState, useEffect } from "react";
import styles from "./OrderHistory.module.css";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    const [filterOrderCheck, setFilterOrderCheck] = useState("전체");
    const [filterOrderClaim, setFilterOrderClaim] = useState("전체");
    const [selectedPeriod, setSelectedPeriod] = useState("전체");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [activeTab, setActiveTab] = useState("OrderCheck");

    const orders = [
        {
            id: "1",
            orderDate: "2025.01.21",
            orderNum: "202501210002",
            img: "/padding/3-4.jpg",
            productName: "2WAY HOOD DOWN JACKET",
            size: "M",
            color: "BLUE",
            price: "59,900",
            quantity: 1,
            status: "배송 완료",
        },
        {
            id: "2",
            orderDate: "2025.01.21",
            orderNum: "202501210003",
            img: "/padding/1-4.jpg",
            productName: "LIGHT DOWN JACKET",
            size: "M",
            color: "BEIGE",
            price: "358,000",
            quantity: 1,
            status: "배송 준비 중",
        },
        {
            id: "3",
            orderDate: "2025.02.01",
            orderNum: "202502010001",
            img: "/padding/2-4.jpg",
            productName: "COTTON PARKA",
            size: "L",
            color: "BLACK",
            price: "120,000",
            quantity: 1,
            status: "배송 완료",
        },
        {
            id: "4",
            orderDate: "2025.02.05",
            orderNum: "202502050004",
            img: "/padding/4-4.jpg",
            productName: "WATERPROOF COAT",
            size: "S",
            color: "NAVY",
            price: "150,000",
            quantity: 1,
            status: "배송 시작",
        },
        {
            id: "5",
            orderDate: "2025.02.10",
            orderNum: "202502100005",
            img: "/padding/5-4.jpg",
            productName: "DOWN VEST",
            size: "M",
            color: "GRAY",
            price: "175,000",
            quantity: 1,
            status: "반품 완료",
        },
        {
            id: "6",
            orderDate: "2025.02.15",
            orderNum: "202502150006",
            img: "/padding/6-4.jpg",
            productName: "WINTER BOOTS",
            size: "XL",
            color: "BROWN",
            price: "250,000",
            quantity: 1,
            status: "취소 접수",
        },
    ];

    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [visibleOrders, setVisibleOrders] = useState(5); // 처음에는 5개만 표시

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
        let filtered = orders;
    
        // 1️⃣ 날짜 필터링
        if (selectedPeriod !== "전체") {
            const start = getDateRange(selectedPeriod);
            const end = new Date();
            filtered = filtered.filter(order => {
                const [year, month, day] = order.orderDate.split(".");
                const orderDateObj = new Date(`${year}-${month}-${day}`);
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
                                <div className={styles.OrederDate}>{order.orderDate}</div>
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
                                                <div className={styles.Color}>{order.color}</div>
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
    );
};

export default OrderHistory;
