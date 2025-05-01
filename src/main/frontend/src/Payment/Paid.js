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
      } catch (error) {
        console.error("결제 승인 실패:", error);
      }
    };
  
    if (pgToken) {
      approvePayment();
    }
  }, [pgToken]);

  return (
    isLoggedIn ? (
    
    <div className={styles.Paid}>
        <div className={styles.PaidText}>결제가 완료되었습니다!</div>
      <div className={styles.PaidContainer}>
        <div className={styles.PaidProduct}>
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
