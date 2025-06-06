import React, { useState, useContext, useEffect } from 'react';
import { Icon } from '@iconify/react';
import styles from './Mypage.module.css';
import Header from '../Header/Header';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import { LoginContext } from "../Login/LoginContext";

const Mypage = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const [member, setMember] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState({
    입금전: 0,
    배송준비중: 0,
    배송중: 0,
    배송완료: 0
  });

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
    fetch(`http://localhost:8090/order/list?memberMail=${member.memberMail}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error("주문 목록 요청 실패");
        return res.json();
      })
      .then(data => {
        const statusCounts = {
          입금전: 0,
          배송준비중: 0,
          배송중: 0,
          배송완료: 0
        };
        data.forEach(order => {
          if (order.status in statusCounts) {
            statusCounts[order.status]++;
          }
        });

        setOrderStatusCounts(statusCounts);
        setRecentOrders(data.slice(0, 3)); // 최근 3건
      })
      .catch(err => console.error("주문 정보 불러오기 오류:", err));
  }, [member]);

  return (
    isLoggedIn && member ? (
    <>
      <div className={styles.Mypage}>
        <Header />
        <div className={styles.MypageHeader}>
          <div className={styles.MypageTitle}>마이페이지</div>
        </div>
        <div className={styles.MypageBox}>
          <div className={styles.Box1}>
            <div className={styles.ProfileBox}>
              <div className={styles.Profile}>
                <div className={styles.RateIcon}>S</div>
                <div className={styles.InfoEdit}>
                  <Link to="/mypage/infoedit" className={styles.InfoEditLink}>회원정보수정</Link>
                </div>
              </div>
              <div className={styles.TextBox}>
                <div className={styles.HelloBox}>{member.memberLn}{member.memberFn}</div>
                <div className={styles.RateBox}>
                  회원님의 등급은 <span className={styles.Rate}>{member.memberRating}</span> 입니다.
                </div>
              </div>
            </div>
          </div>
          <div className={styles.BoxContainer}>
          <div className={styles.Box2}>
            <div className={styles.SavingBox}>
            <div className={styles.SavingIcon}>
            <Link to="/mypage/Saving&Rate"  className={styles.iconLink}>
            <Icon
              icon={'material-symbols-light:money-bag-rounded'}
              className={styles.SavingIconcss}
            />
            </Link>
            </div>
                  <div className={styles.SavingPcs}>{member.point}</div>
              <div className={styles.SavingTotal}>총 적립금</div>
            </div>
          </div>
          <div className={styles.Box3}>
            <div className={styles.CouponBox}>
            <div className={styles.CouponIcon}>
              <Link to="/mypage/coupon"  className={styles.iconLink}>
                <Icon
                  icon={'mdi:coupon'}
                  className={styles.SavingIconcss}
                />
              </Link>
            </div>
                  <div className={styles.CouponPcs}>{member.memberCoupon}개</div>
              <div className={styles.CouponTotal}>총 쿠폰</div>
            </div>
          </div>
          <div className={styles.Box4}>
            <div className={styles.WishBox}>
              <div className={styles.WishIcon}>
              <Link to="/mypage/Wish"  className={styles.iconLink} >
                <Icon
                  icon={'solar:heart-bold'}
                  className={styles.SavingIconcss}
                />
                </Link>
              </div>
              <div className={styles.WishPcs}>0개</div>
              <div className={styles.WishTotal}>찜한 상품</div>
            </div>
          </div>

          {/* 게시판 아이콘과 네모칸 전체를 클릭 가능하도록 변경 */}
          <div className={styles.Box4}>
            <div className={styles.BoardBox}>
                <div className={styles.BoardIcon}>
                <Link to="/Board"  className={styles.iconLink}> {/* Link 컴포넌트 사용 */}       
                  <Icon
                    icon={'tabler:file-filled'}
                    className={styles.SavingIconcss}
                  />
                  </Link>
                </div>
                <div className={styles.BoardPcs}>0개</div>
                <div className={styles.BoardTotal}>게시판</div>
              </div>
          </div>
        </div>
        </div>

        <div className={styles.OrderProcessing}>
          <div className={styles.OrderProcessingTitle}>나의 주문 처리 현황</div>
          <div className={styles.StatusBox}>
            <div className={styles.Status1}>
              <div className={styles.StatusNum1}>{orderStatusCounts.입금전}</div>
              <div className={styles.StatusText}>입금 전</div>
            </div>
            <div className={styles.StatusNext}>
              <Icon
                icon={'ooui:next-ltr'}
                className={styles.StatusNext}
              />
            </div>
            <div className={styles.Status2}>
              <div className={styles.StatusNum2}>{orderStatusCounts.배송준비중}</div>
              <div className={styles.StatusText}>배송 준비 중</div>
            </div>
            <div className={styles.StatusNext}>
              <Icon
                icon={'ooui:next-ltr'}
                className={styles.StatusNext}
              />
            </div>
            <div className={styles.Status3}>
              <div className={styles.StatusNum3}> 0 </div>
              <div className={styles.StatusText}>배송 중</div>
            </div>
            <div className={styles.StatusNext}>
              <Icon
                icon={'ooui:next-ltr'}
                className={styles.StatusNext}
              />
            </div>
            <div className={styles.Status4}>
              <div className={styles.StatusNum4}>0</div>
              <div className={styles.StatusText}>배송 완료</div>
            </div>
          </div>
        </div>
        <div className={styles.CurrentOrder}>
          <div className={styles.CurrentOrderHeader}>
            <div className={styles.CurrentOrderTitle}> 최근 주문 내역</div>
            <div className={styles.CurrentOrderNext}> <Link to="/mypage/OrderHistory"> &gt;</Link> </div>
          </div>
          <div className={styles.CurrentLine}></div>
          {recentOrders.map((order, index) => (
            <div key={index} className={styles.OrderBox}>
              <div className={styles.OrederInfoBox}>
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
              <div className={styles.OrderStatus}>{order.status}</div>
            </div>
          ))}
        </div>
      </div>
    </>
    ): (
      <Link to="/login"></Link>
    )
  );
};

export default Mypage;