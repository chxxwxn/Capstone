import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './Mypage.module.css';
import Header2 from '../Header/Header2';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import

const orders = [
  {
    id: "1",
    img: '/padding/3-4.jpg',
    productName: '2WAY HOOD DOWN JACKET',
    size: "M",
    color: "BLUE",
    price: '200,000' ,
    quantity: 1,
    status: "상품 준비 중"
  },
  {
    id: "2",
    img: '/padding/1-4.jpg',
    productName: 'LIGHT DOWN JACKET',
    size: "M",
    color: "BEIGE",
    price: '358,000' ,
    quantity: 1,
    status: "배송 준비 중"
  },
];

const Mypage = () => {
  return (
    <>
      <div className={styles.Mypage}>
        <Header2 />
        <div className={styles.MypageHeader}>
          <div className={styles.MypageTitle}>마이페이지</div>
        </div>
        <div className={styles.MypageBox}>
          <div className={styles.Box1}>
            <div className={styles.ProfileBox}>
              <div className={styles.Profile}>
                <div className={styles.RateIcon}>S</div>
                <div className={styles.InfoEdit}>회원정보수정</div>
              </div>
              <div className={styles.TextBox}>
                <div className={styles.HelloBox}>안녕하세요! 홍길동 님.</div>
                <div className={styles.RateBox}>
                  회원님의 등급은 <span className={styles.Rate}>Silver</span> 입니다.
                </div>
              </div>
            </div>
          </div>

          <div className={styles.Box2}>
            <div className={styles.SavingBox}>
              <div className={styles.SavingIcon}>
                <Icon
                  icon={'material-symbols-light:money-bag-rounded'}
                  className={styles.SavingIconcss}
                />
              </div>
              <div className={styles.SavingPcs}>1,000원</div>
              <div className={styles.SavingTotal}>총 적립금</div>
            </div>
          </div>
          <div className={styles.Box3}>
            <div className={styles.CouponBox}>
              <div className={styles.CouponIcon}>
                <Icon
                  icon={'mdi:coupon'}
                  className={styles.SavingIconcss}
                />
              </div>
              <div className={styles.CouponPcs}>1개</div>
              <div className={styles.CouponTotal}>총 쿠폰</div>
            </div>
          </div>
          <div className={styles.Box4}>
            <div className={styles.WishBox}>
              <div className={styles.WishIcon}>
                <Icon
                  icon={'solar:heart-bold'}
                  className={styles.SavingIconcss}
                />
              </div>
              <div className={styles.WishPcs}>1개</div>
              <div className={styles.WishTotal}>찜한 상품</div>
            </div>
          </div>

          {/* 게시판 아이콘과 네모칸 전체를 클릭 가능하도록 변경 */}
          <div className={styles.Box4}>
            <Link to="/Board" className={styles.BoardLink}> {/* Link 컴포넌트 사용 */}
              <div className={styles.BoardBox}>
                <div className={styles.BoardIcon}>
                  <Icon
                    icon={'tabler:file-filled'}
                    className={styles.SavingIconcss}
                  />
                </div>
                <div className={styles.BoardPcs}>1개</div>
                <div className={styles.BoardTotal}>게시판</div>
              </div>
            </Link>
          </div>
        </div>
        <div className={styles.OrderProcessing}>
          <div className={styles.OrderProcessingTitle}>나의 주문 처리 현황</div>
          <div className={styles.StatusBox}>
            <div className={styles.Status1}>
              <div className={styles.StatusNum1}>0</div>
              <div className={styles.StatusText}>입금 전</div>
            </div>
            <div className={styles.StatusNext}>
              <Icon
                icon={'ooui:next-ltr'}
                className={styles.StatusNext}
              />
            </div>
            <div className={styles.Status2}>
              <div className={styles.StatusNum2}>0</div>
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
            <div className={styles.CurrentOrderNext}> > </div>
          </div>
          <div className={styles.CurrentLine}></div>
          {orders.map((order) => (
            <div key={order.id} className={styles.OrderBox}>
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
              <div className={styles.OrderStatus}>{order.status}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Mypage;
