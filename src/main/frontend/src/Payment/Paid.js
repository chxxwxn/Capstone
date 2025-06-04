import React,{useEffect, useState, useContext} from 'react';
import styles from './Paid.module.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginContext } from "../Login/LoginContext";

export default function Paid() {
const navigate = useNavigate();
const [params] = useSearchParams();
const pgToken = params.get("pg_token");
const { isLoggedIn } = useContext(LoginContext);
const [member, setMember] = useState(null);
const [recentOrders, setRecentOrders] = useState([]);
const [orders, setOrders] = useState([]);
const [filteredOrders, setFilteredOrders] = useState([]);
const [visibleOrders, setVisibleOrders] = useState(0);

  useEffect(() => {
    if (!pgToken) return;

    const approveKey = `approved-${pgToken}`;
    if (sessionStorage.getItem(approveKey)) return;

    const approvePayment = async () => {
      try {
        const tid = sessionStorage.getItem("tid");
        if (!tid) throw new Error("❌ TID 없음");

        const response = await fetch(`http://localhost:8090/payment/success?pg_token=${pgToken}&tid=${tid}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error("결제 승인 실패");

        const data = await response.json();
        console.log("✅ 결제 승인 성공:", data);
        sessionStorage.setItem(approveKey, "true");

        const orderData = sessionStorage.getItem("orderToSave");
        if (orderData) {
          const response = await fetch("http://localhost:8090/order/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: orderData,
          });

          const savedOrders = await response.json(); // ✅ 여기서 받은 최신 order_id 포함된 목록
          setRecentOrders(savedOrders); // ✅ 최근 주문 내역 저장
        }

        // ✅ 포인트 및 쿠폰 차감
        const parsedMember = JSON.parse(sessionStorage.getItem("member"));
        const usedCoupon = sessionStorage.getItem("usedCoupon") === "true";
        const usedPoint = parseInt(sessionStorage.getItem("usedPoint"), 10) || 0;

        if (parsedMember) {
          // 1. 서버에 포인트 차감 요청
          await fetch(`http://localhost:8090/member/use-benefits?memberMail=${parsedMember.memberMail}&usedPoint=${usedPoint}`, {
            method: "PUT",
            credentials: "include"
          });

          // 2. 서버에서 최신 정보 불러와 세션 갱신
          const res = await fetch(`http://localhost:8090/member/get?memberMail=${parsedMember.memberMail}`, {
            credentials: 'include'
          });

          if (res.ok) {
            const latest = await res.json();

            // 3. 쿠폰은 백엔드에서 차감되지 않으므로 프론트에서 차감
            if (usedCoupon) {
              latest.memberCoupon--;
            }

            sessionStorage.setItem("member", JSON.stringify(latest));
            setMember(latest);
            console.log("🟢 최신 회원 정보 세션/상태 반영 완료");
          }
        }

      } catch (error) {
        console.error("❌ 결제 승인 실패:", error);
      }
    };

    approvePayment();
  }, [pgToken]);

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
    const savedOrders = sessionStorage.getItem("orderToSave");
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setRecentOrders(parsedOrders); // 그대로 화면에 출력
        sessionStorage.removeItem("orderToSave");
      } catch (error) {
        console.error("orderToSave JSON 파싱 실패", error);
      }
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
      if (recentOrders.length > 0) {
        setVisibleOrders(recentOrders.length);
      }
    }, [recentOrders]);

  return (
    isLoggedIn && member ? (
    
    <div className={styles.Paid}>
        <div className={styles.PaidText}>결제가 완료되었습니다!</div>
      <div className={styles.PaidContainer}>
        <div className={styles.PaidProduct}>
          <div className={styles.ProductList}>
            {recentOrders.map((order, index) => (
              <div key={order.id || index} className={styles.ProductList}>
                <div className={styles.OrederNumDate}>
                  <div className={styles.OrederDate}>{new Date(order.orderdate).toLocaleDateString()}</div>
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
                      <img src={order.image || "/default-image.jpg"} alt={order.productName} />
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
                        <div className={styles.Price}>{order.price.toLocaleString()}원</div> •
                        <div className={styles.Info}>{order.quantity}개</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        

        <div className={styles.Buttons}>
            <button
            className={styles.ReturnButton}
            onClick={() => navigate("/all")}
            >
            더 쇼핑하기
            </button>
        {filteredOrders.slice(0, visibleOrders).map((order) => (
          <button
              className={styles.OrderDetailButton}
              onClick={() => navigate(`/mypage/OrderHistory/${order.orderNum}`)}
            >
              주문내역 보기
          </button>
          ))}
        </div>


      </div>
    </div>
    ) :(
      <div></div>
    )
  );
}
