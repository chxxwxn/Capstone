import styles from './OrderDetail.module.css';
import React, { useState, useEffect, useContext } from "react";
import AddressSearch from '../Payment/AddressSearch';
import { LoginContext } from "../Login/LoginContext";
import { useParams } from "react-router-dom";

export default function OrderDetail() {
  const { isLoggedIn } = useContext(LoginContext);
  const [member, setMember] = useState(null);
  const [order, setOrder] = useState(null);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [tempAddress, setTempAddress] = useState({
    name: '', phone: '', address: '', detailAddress: '', zipCode: ''
  });
  const { orderNum } = useParams();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const editableStatuses = ["주문 접수", "결제 완료", "상품 준비 중"];
  const [productPrice, setProductPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [waybillInfo] = useState({
    company: '대한통운',
    number: '1234-5678-9012',
  });

  useEffect(() => {
    const storedMember = sessionStorage.getItem('member');
    if (storedMember) {
      try {
        setMember(JSON.parse(storedMember));
      } catch (error) {
        console.error('JSON parsing error:', error);
        sessionStorage.removeItem('member');
      }
    }
  }, []);

  useEffect(() => {
    if (!orderNum) return;

    fetch(`http://localhost:8090/order/detail?orderNum=${orderNum}`, {
      credentials: "include"
    })
     .then(res => {
    if (!res.ok) {
      // 오류 응답 텍스트 그대로 읽기
      return res.text().then(err => {
        throw new Error("서버 오류: " + err);
      });
    }
    return res.json();
  })
      .then(data => {
        setOrder(data);
        setProductPrice(data.price);
        setDiscount(Number(data.discount));
        setShippingCost(Number(data.delcharges));
        setRewardPoints(Number(data.usedPoint));
        setCouponDiscount(Number(data.couponDiscount));

        setShippingAddresses([{
          name: data.name,
          phone: data.phone,
          address: data.address,
          detailAddress: '',
          zipCode: '',
        }]);

        setFilteredOrders([{
          id: data.order_id,
          orderDate: new Date(data.order_date).toLocaleDateString(),
          orderNum: data.order_id,
          img: data.image,
          productName: data.product_name,
          size: data.size,
          color: data.color,
          price: data.price,
          quantity: data.quantity,
          status: data.status,
        }]);
      })
      .catch(err => console.error("주문 상세 불러오기 실패:", err));
  }, [orderNum]);

  if (!isLoggedIn || !member || !order || filteredOrders.length === 0) {
    return <div>불러오는 중입니다...</div>;
  }

  const isEditableStatus = filteredOrders.length > 0 && editableStatuses.includes(filteredOrders[0].status);
  const totalAmount = productPrice + shippingCost - discount - rewardPoints - couponDiscount;

  const handleSearchAddressClick = () => setShowAddressSearch(true);

  const handleAddressSelectFromSearch = (address) => {
    setTempAddress({
      ...tempAddress,
      address: address.address_name,
      zipCode: address.post_code,
    });
    setShowAddressSearch(false);
  };

  const handleSaveAddress = () => {
    const newAddress = { ...tempAddress };
    setShippingAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    setIsEditingShipping(false);
    setTempAddress({ name: '', phone: '', address: '', detailAddress: '', zipCode: '' });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setTempAddress({ ...address });
  };

  return (
    <div className={styles.OrderDetail}>
      <div className={styles.OrderDetailTitle}>주문 상세</div>

      <div className={styles.OrderProduct}>
        {filteredOrders.map((order) => (
          <div key={order.orderNum} className={styles.ProductList}>
            <div className={styles.OrederNumDate}>
              <div className={styles.OrederDate}>{order.orderDate}</div>
              <div> | </div>
              <div className={styles.OrederNum}>{order.orderNum}</div>
            </div>
            <div className={styles.OrderBox}>
              <div className={styles.OrderInfoBox}>
                <div className={styles.OrderPhoto}>
                  <img src={order.img} alt={order.productName} />
                </div>
                <div className={styles.ProductLine}></div>
                <div className={styles.InfoBox}>
                  <div className={styles.OrderInfo1}>
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
              <div className={styles.OrderStatusContainer}>
                <div className={styles.OrderStatus}>{order.status}</div>
                <div className={styles.OrderStatusAdd}>
                  {order.status === "배송 완료" && (
                    <button className={styles.ReviewButton}>리뷰 쓰기</button>
                  )}
                  {order.status === "배송 시작" && (
                    <button className={styles.TrackButton}>배송 조회</button>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.Line1} />
          </div>
        ))}
      </div>

      <div className={styles.OrderInfo}>
        <div className={styles.left}>
          <div className={styles.Waybill}>
            <div className={styles.OrderDetailTitle2}>운송장</div>
            <div className={styles.Line} />
            {filteredOrders[0].status !== "배송 준비 중" && (
              <div className={styles.WaybillContainer}>
                <div className={styles.Company}>{waybillInfo.company}</div>
                <div className={styles.Num}>
                  <a
                    href={`https://trace.cjlogistics.com/web/detail.jsp?slipno=${waybillInfo.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {waybillInfo.number}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className={styles.Address}>
            <div className={styles.shippingInfo}>
              <div className={styles.AddresssHeader}>
                <div className={styles.OrderDetailTitle2}>배송정보</div>
                {isEditableStatus && (
                  <div className={styles.shippingButtons}>
                    <button onClick={() => setIsEditingShipping(!isEditingShipping)}>
                      {isEditingShipping ? '취소' : '수정하기'} &gt;
                    </button>
                    <button onClick={() => setShowAddressList(!showAddressList)}>
                      배송지 목록
                    </button>
                  </div>
                )}
              </div>
              <div className={styles.Line} />
              {!isEditingShipping ? (
                <>
                  <p>수령인명: {order.name}</p>
                  <p>전화번호: {order.phone}</p>
                  <p>주소: {order.address}</p>
                </>
              ) : (
                <>
                  <input type="text" placeholder="수령인명" value={tempAddress.name} onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })} />
                  <input type="text" placeholder="전화번호" value={tempAddress.phone} onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })} />
                  <input type="text" placeholder="주소" value={tempAddress.address} onChange={(e) => setTempAddress({ ...tempAddress, address: e.target.value })} />
                  <button onClick={handleSearchAddressClick}>주소 찾기</button>
                  {showAddressSearch && <AddressSearch onAddressSelect={handleAddressSelectFromSearch} />}
                  <input type="text" placeholder="상세 주소" value={tempAddress.detailAddress} onChange={(e) => setTempAddress({ ...tempAddress, detailAddress: e.target.value })} />
                  <button onClick={handleSaveAddress}>주소 저장</button>
                </>
              )}
              {showAddressList && (
                <div>
                  <h3>배송지 목록</h3>
                  {shippingAddresses.map((address, index) => (
                    <button key={index} onClick={() => handleSelectAddress(address)}>
                      {address.name} ({address.phone})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.Payment}>
            <div className={styles.rightSection}>
              <div className={styles.OrderDetailTitle2}>결제정보</div>
              <div className={styles.Line} />
              <p>상품 금액: {productPrice.toLocaleString()}원</p>
              <div className={styles.totaldiscount}>
                <div>할인: {discount.toLocaleString()}원</div>
                <div>배송비: {shippingCost.toLocaleString()}원</div>
                <div>쿠폰 할인: {couponDiscount.toLocaleString()}원</div>
                <div>적립금 사용: {rewardPoints.toLocaleString()}원</div>
              </div>
              <div className={styles.OrderDetailTitle3}>총 결제 금액: {(productPrice + shippingCost - discount - rewardPoints - couponDiscount).toLocaleString()}원</div>
            </div>
          </div>
          <div className={styles.Method}>
            <div className={styles.OrderDetailTitle2}>결제수단</div>
            <div className={styles.Line} />
            <div className={styles.MethodContainer}>
              <div className={styles.MethodDetail}>{order.paymethod} ({order.payment})</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
