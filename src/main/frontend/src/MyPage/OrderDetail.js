import styles from './OrderDetail.module.css';
import React, { useState, useEffect } from "react";
import AddressSearch from '../Payment/AddressSearch';
import { style } from 'framer-motion/client';

export default function OrderDetail() {
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
    }
  ];
  const [filteredOrders] = useState(orders);
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingAddresses, setShippingAddresses] = useState([
    {
      name: '홍길동',
      phone: '010-1111-2222',
      address: '서울특별시',
      detailAddress: '1동 002호',
      zipCode: '12345',
    },
  ]);
  const [tempAddress, setTempAddress] = useState({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    zipCode: '',
  });

  const handleSearchAddressClick = () => {
    setShowAddressSearch(true);
  };

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
    setShippingAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    setSelectedAddress(newAddress);
    setIsEditingShipping(false);
    setTempAddress({
      name: '',
      phone: '',
      address: '',
      detailAddress: '',
      zipCode: '',
    });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setTempAddress({ ...address });
  };


  const [productPrice] = useState(59900);
  const [discount] = useState(5990);
  const [shippingCost] = useState(3000);
  const [rewardPoints] = useState('');
  const [couponDiscount] = useState(0);

  const calculateTotal = () => {
    const parsedRewardPoints = parseInt(rewardPoints) || 0;
    return productPrice + shippingCost - discount - parsedRewardPoints - couponDiscount;
  };

  const totalAmount = calculateTotal();

  const [waybillInfo, setWaybillInfo] = useState({
    company: '대한통운',
    number: '1234-5678-9012',
  });
  
  const editableStatuses = ["주문 접수", "결제 완료", "상품 준비 중"];
const isEditableStatus = editableStatuses.includes(filteredOrders[0].status);

  return (
    <div className={styles.OrderDetail}>
      <div className={styles.OrderDetailTitle}>주문 상세</div>

      <div className={styles.OrderProduct}>
        <div className={styles.ProductList}>
          {filteredOrders.map((order) => (
            <div key={order.id} className={styles.ProductList}>
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
              <div className={styles.Line1} />
            </div>
            
          ))}
        </div>
      </div>
      

      <div className={styles.OrderInfo}>
        <div className={styles.left}>
        <div className={styles.Waybill}>
          <div className={styles.OrderDetailTitle2}>운송장</div>
          <div className={styles.Line} />
          {!["주문 접수", "결제 완료", "상품 준비 중", "배송 준비 중"].includes(filteredOrders[0].status) && (

          <div className={styles.WaybillContainer} >
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
            <div className={styles.OrderDetailTitle2}> 배송정보</div>
            
            {isEditableStatus && (
    <div className={styles.shippingButtons}>
      <button
        className={styles.editButton}
        onClick={() => setIsEditingShipping(!isEditingShipping)}
      >
        {isEditingShipping ? '취소' : '수정하기'} &gt;
      </button>
      <button
        className={styles.addressListButton}
        onClick={() => setShowAddressList(!showAddressList)}
      >
        배송지 목록
      </button>
    </div>
  )}
                </div>

                <div className={styles.Line} />
            

              {!isEditingShipping ? (
                <>
                  <p>수령인명: {selectedAddress?.name || shippingAddresses[0].name}</p>
                  <p>전화번호: {selectedAddress?.phone || shippingAddresses[0].phone}</p>
                  <p>
                    주소: {selectedAddress?.address || shippingAddresses[0].address}
                    {` `}
                    {selectedAddress?.detailAddress || shippingAddresses[0].detailAddress}
                    {` `}
                    ({selectedAddress?.zipCode || shippingAddresses[0].zipCode})
                  </p>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={tempAddress.name}
                    placeholder="수령인명을 입력하세요."
                    onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                  />
                  <input
                    type="text"
                    value={tempAddress.phone}
                    placeholder="전화번호를 입력하세요."
                    onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    value={tempAddress.address}
                    placeholder="주소를 입력하세요."
                    onChange={(e) => setTempAddress({ ...tempAddress, address: e.target.value })}
                  />
                  <button className={styles.searchButton} onClick={handleSearchAddressClick}>
                    주소 찾기
                  </button>
                  {showAddressSearch && (
                    <AddressSearch onAddressSelect={handleAddressSelectFromSearch} />
                  )}
                  <input
                    type="text"
                    value={tempAddress.detailAddress}
                    placeholder="상세 주소 입력"
                    onChange={(e) => setTempAddress({ ...tempAddress, detailAddress: e.target.value })}
                  />
                  <button className={styles.saveButton} onClick={handleSaveAddress}>
                    주소 저장
                  </button>
                </>
              )}

              {showAddressList && (
                <div className={styles.addressList}>
                  <h3>배송지 목록</h3>
                  {shippingAddresses.map((address, index) => (
                    <div key={index} className={styles.addressListItem}>
                      <button onClick={() => handleSelectAddress(address)}>
                        {address.name} ({address.phone})
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.Payment}>
            <div className={styles.rightSection}>
            <div className={styles.OrderDetailTitle2}> 결제정보</div>
            <div className={styles.Line} />
              <p>상품 금액: {productPrice.toLocaleString()}원</p>
              <div className={styles.totaldiscount}>
                <div>할인: {discount.toLocaleString()}원</div>
                <div>배송비: {shippingCost.toLocaleString()}원</div>
                <div>쿠폰 할인: {couponDiscount.toLocaleString()}원</div>
                <div>적립금 사용: {rewardPoints}원</div>
              </div>
            <div className={styles.OrderDetailTitle3}> 총 결제 금액: {totalAmount.toLocaleString()}원</div>
            </div>
          </div>
          <div className={styles.Method}>
              <div className={styles.OrderDetailTitle2}>결제수단</div>
              <div className={styles.Line} />
              <div className={styles.MethodContainer} >
                  <div className={styles.MethodDetail}>카카오페이(**카드) 일시불</div>
              </div>
        </div>
        </div>
      </div>
    </div>
  );
}
