import React,{useEffect, useState, useContext} from 'react';
import styles from './Paid.module.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginContext } from "../Login/LoginContext";

export default function Paid() {
const navigate = useNavigate();
const [params] = useSearchParams();
const pgToken = params.get("pg_token");
const [approved, setApproved] = useState(false);
const { isLoggedIn } = useContext(LoginContext);
  const [member, setMember] = useState(null);
const [recentOrders, setRecentOrders] = useState([]);

  const filteredOrders = [
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
    }
  ];
  const visibleOrders = 1; // 보여줄 주문 개수

  useEffect(() => {
    const approvePayment = async () => {
      try {
        const response = await fetch(`http://localhost:8090/payment/success?pg_token=${pgToken}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        console.log("결제 승인 성공:", data);
        setApproved(true);

        // ✅ 주문 정보 세션스토리지에서 꺼내기
        const orderToSave = sessionStorage.getItem("orderToSave");
        if (orderToSave) {
          const parsedOrders = JSON.parse(orderToSave);
          await fetch("http://localhost:8090/order/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(parsedOrders),
          });

          console.log("주문 정보 저장 완료");
          sessionStorage.removeItem("orderToSave"); // 저장 후 삭제
        }
      } catch (error) {
        console.error("결제 승인 실패:", error);
      }
    };

    if (pgToken) {
      approvePayment();
    }
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
    if (!member) return;

    fetch(`http://localhost:8090/order/recent?memberMail=${member.memberMail}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setRecentOrders(data);
      })
      .catch((err) => {
        console.error("최근 주문 불러오기 실패:", err);
      });
  }, [member]);

  return (
    isLoggedIn && member ? (
    
    <div className={styles.Paid}>
        <div className={styles.PaidText}>결제가 완료되었습니다!</div>
      <div className={styles.PaidContainer}>
        <div className={styles.PaidProduct}>
          <div className={styles.ProductList}>
            {recentOrders.slice(0, 1).map((order) => (
              <div key={order.id} className={styles.ProductList}>
                <div className={styles.OrederNumDate}>
                  <div className={styles.OrederDate}>{new Date(order.order_date).toLocaleDateString()}</div>
                  <div> | </div>
                  <div className={styles.OrederNum}>
                    <Link to={`/mypage/OrderHistory/${order.orderId}`} className={styles.OrderLink}>
                      {order.orderId}
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

            <button
            className={styles.OrderDetailButton}
            onClick={() => navigate(`/mypage/OrderHistory/${filteredOrders[0].orderNum}`)}
            >
            주문내역 보기
            </button>
        </div>


      </div>
    </div>
    ) :(
      <div></div>
    )
  );
}
