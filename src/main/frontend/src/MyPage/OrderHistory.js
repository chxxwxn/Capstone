import React, { useState, useEffect } from "react";
import styles from "./OrderHistory.module.css";

const OrderHistory = () => {
    const [filter, setFilter] = useState("전체");
    const [selectedPeriod, setSelectedPeriod] = useState("전체");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [activeTab, setActiveTab] = useState("OrderCheck");
    const [selectedAction, setSelectedAction] = useState("");  // 선택된 탭 상태 관리

    // 주문 데이터 (필터링 전에 정의)
    const orders = [
        {
            id: "1",
            orderDate: "2025.01.21",
            orderNum: "202501210002",
            img: "/padding/3-4.jpg",
            productName: "2WAY HOOD DOWN JACKET",
            size: "M",
            color: "BLUE",
            price: "200,000",
            quantity: 1,
            status: "상품 준비 중",
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
        let startDate = new Date("1900-01-01"); // 기본값 (전체)

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

    // 선택한 기간 변경 시 자동으로 startDate 업데이트
    useEffect(() => {
        // 자동으로 startDate와 endDate를 변경하는 코드 삭제
        // 이제 selectedPeriod는 날짜 범위 필터링만 담당
        if (selectedPeriod !== "전체") {
            // 선택된 기간에 맞는 시작 날짜만 구하고, startDate는 업데이트하지 않음
            const start = getDateRange(selectedPeriod);
            // 필터링만 진행
            const filtered = orders.filter((order) => {
                const [year, month, day] = order.orderDate.split(".");
                const orderDateObj = new Date(`${year}-${month}-${day}`);
                return orderDateObj >= start;
            });
    
            setFilteredOrders(filtered);
        } else {
            // 전체 기간일 경우 모든 주문 표시
            setFilteredOrders(orders);
        }
    }, [selectedPeriod]);

    // 주문 상태 필터링
    useEffect(() => {
        const filtered = orders.filter((order) => {
            if (filter === "전체") return true;
            return order.status === filter;
        });

        setFilteredOrders(filtered);
    }, [filter]);

    // 탭 전환에 따른 상태 필터 업데이트
    useEffect(() => {
        if (activeTab === "OrderCheck") {
            setFilter("전체");
        } else {
            setFilter("전체");
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedAction) {
            const statusMapping = {
                "취소": ["취소 접수", "취소 진행 중", "취소 완료"],
                "교환": ["교환 접수", "교환 진행 중", "교환 완료"],
                "환불": ["환불 접수", "환불 진행 중", "환불 완료"],
                "반품": ["반품 접수", "반품 진행 중", "반품 완료"]
            };

            const filtered = orders.filter((order) => 
                statusMapping[selectedAction].includes(order.status)
            );

            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders);
        }
    }, [selectedAction]);

    useEffect(() => {
        let filtered = orders;
    
        // 1️⃣ activeTab에 따라 1차 필터링
        if (activeTab === "OrderCheck") {
            // 주문 내역 탭: 주문 관련 상태만 필터링
            const validStatuses = ["주문 접수", "결제 완료", "상품 준비 중", "배송 준비 중", "배송 시작", "배송 완료"];
            filtered = orders.filter(order => validStatuses.includes(order.status));
        } else if (activeTab === "OrderClaim") {
            // 취소/교환/환불/반품 탭: 해당 상태만 필터링
            const validStatuses = ["취소 접수", "취소 진행 중", "취소 완료", "교환 접수", "교환 진행 중", "교환 완료", "환불 접수", "환불 진행 중", "환불 완료", "반품 접수", "반품 진행 중", "반품 완료"];
            filtered = orders.filter(order => validStatuses.includes(order.status));
        }
    
        // 2️⃣ filter 값에 따라 2차 필터링
        if (filter !== "전체") {
            if (filter === "취소") {
                filtered = filtered.filter(order =>
                    ["취소 접수", "취소 진행 중", "취소 완료"].includes(order.status)
                );
            } else if (filter === "교환") {
                filtered = filtered.filter(order =>
                    ["교환 접수", "교환 진행 중", "교환 완료"].includes(order.status)
                );
            } else if (filter === "환불") {
                filtered = filtered.filter(order =>
                    ["환불 접수", "환불 진행 중", "환불 완료"].includes(order.status)
                );
            } else if (filter === "반품") {
                filtered = filtered.filter(order =>
                    ["반품 접수", "반품 진행 중", "반품 완료"].includes(order.status)
                );
            } else {
                // 기타 상태 처리
                filtered = filtered.filter(order => order.status === filter);
            }
        }
    
        setFilteredOrders(filtered);
    }, [activeTab, filter, orders]);
    
    



const handleSearch = () => {
    const start = startDate ? new Date(startDate) : new Date("1900-01-01"); // 시작 날짜는 사용자가 선택한 대로, 기본값은 매우 오래된 날짜
    const end = endDate ? new Date(endDate) : new Date(); // 끝 날짜는 사용자가 선택한 대로, 기본값은 오늘

    const filteredOrders = orders.filter((order) => {
        const [year, month, day] = order.orderDate.split(".");
        const orderDateObj = new Date(`${year}-${month}-${day}`);

        return orderDateObj >= start && orderDateObj <= end;
    });

    console.log("조회 버튼 클릭됨!");
    console.log("선택한 상태:", filter);
    console.log("선택한 기간:", selectedPeriod);
    console.log("선택한 날짜 범위:", start, "-", end);
    console.log("필터링된 주문 내역:", filteredOrders);

    setFilteredOrders(filteredOrders);
};

    const handleLoadMore = () => {
        setVisibleOrders((prevVisibleOrders) => prevVisibleOrders + 5); // 더 보기 버튼을 클릭하면 5개씩 추가로 표시
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
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
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
                            <div className={styles.OrederNum}>{order.orderNum}</div>
                        </div>

                        <div className={styles.OrderBox}>
                            <div className={styles.OrederInfoBox}>
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
                                        리뷰쓰기
                                    </button>
                                )}
                                {order.status === "배송 시작" && (
                                    <button className={styles.TrackButton} onClick={() => console.log("배송 조회 페이지 이동")}>
                                        배송조회
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
            <div className={styles.Guide}>
            온라인 주문 배송안내
                <img src="/deliver.png" alt="안내 사항" className={styles.guideImage} />
                
            </div>

        </div>
        </div>
    );
};

export default OrderHistory;
