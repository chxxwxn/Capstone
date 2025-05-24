import React, { useState, useContext, useEffect } from 'react';
import styles from './Payment.module.css';
import AddressSearch from './AddressSearch'; // 카카오맵 주소 검색 컴포넌트 추가
import { LoginContext } from "../Login/LoginContext";
import { Link } from 'react-router-dom';


const Payment = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [paymentAgreement, setPaymentAgreement] = useState(false);
    const [productPrice] = useState(59900);
    const [discount] = useState(5990);
    const [shippingCost] = useState(3000);
    const [rewardPoints, setRewardPoints] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [showAddressSearch, setShowAddressSearch] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCoupon, setSelectedCoupon] = useState("");
    const [isEditingShipping, setIsEditingShipping] = useState(false);
    const [member, setMember] = useState(null);
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [tempAddress, setTempAddress] = useState({
        name: '',
        phone: '',
        address: '',
        detailAddress: '',
        zipCode: '',
    });
    const [showAddressList, setShowAddressList] = useState(false);

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

    const handleRewardPointsChange = (e) => {
        let value = e.target.value;
        if (value > 5000) {
            value = 5000;
            alert('최대 사용 가능한 적립금은 5,000원입니다.');
        }
        setRewardPoints(value);
    };
    

    const handleApplyRewardPoints = () => {
        const parsedRewardPoints = parseInt(rewardPoints) || 0;
        if (parsedRewardPoints > 5000) {
            alert('최대 사용 가능한 적립금은 5,000원입니다.');
            setRewardPoints('5000');
        }
    };

    const handleCouponChange = (e) => {
        setSelectedCoupon(e.target.value);
        if (e.target.value === '10') {
            setCouponDiscount(productPrice * 0.1);
        } else if (e.target.value === 'free') {
            setCouponDiscount(shippingCost);
        } else {
            setCouponDiscount(0);
        }
    };

    const handlePayButtonClick = async () => {
        if (!paymentAgreement) {
            alert('결제 내용을 확인하고 동의해야 합니다.');
            return;
        }
        if (!selectedPaymentMethod) {
            alert('결제 수단을 선택해야 합니다.');
            return;
        }
        if (selectedPaymentMethod === 'kakaopay') {
            try {
              const response = await fetch('http://localhost:8090/payment/ready', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({
                  quantity: 1,               // 수량
                  totalAmount: totalAmount, // 총 결제 금액
                  itemName: "REGLAN SYMBOL KNIT ZIP-UP"
                }),
              });
          
              if (!response.ok) {
                throw new Error('카카오페이 결제 준비 실패');
              }
          
              const data = await response.json();
              window.location.href = data.next_redirect_pc_url;
            } catch (error) {
              console.error('결제 오류:', error);
              alert('카카오페이 결제 중 오류가 발생했습니다.');
            }
        }
    };

    const { isLoggedIn } = useContext(LoginContext);

    const calculateTotal = () => {
        const parsedRewardPoints = parseInt(rewardPoints) || 0;
        return productPrice + shippingCost - discount - parsedRewardPoints - couponDiscount;
    };

    const totalAmount = calculateTotal();
    
    useEffect(() => {
        const storedMember = sessionStorage.getItem("member");
        if (storedMember) {
          try {
            const parsedMember = JSON.parse(storedMember);
            setMember(parsedMember);
      
            setShippingAddresses([
              {
                name: parsedMember.memberLn + parsedMember.memberFn,
                phone:
                parsedMember.memberNum2 === "0000" && parsedMember.memberNum3 === "0000"
                    ? parsedMember.memberNum1
                    : `${parsedMember.memberNum1}-${parsedMember.memberNum2}-${parsedMember.memberNum3}`,
                address: '서울특별시', // 나중에 DB나 사용자 입력으로 바꾸는 것도 가능
                detailAddress: '1동 002호',
                zipCode: '12345',
              },
            ]);
          } catch (err) {
            console.error("회원 정보 파싱 오류:", err);
          }
        }
    }, []);
 
    return (
        isLoggedIn ? (
        <>
        <div className={styles.paymentContainer}>
            <h1>주문하기</h1>
            <div className={styles.contentWrapper}>
                {/* 좌측 영역 */}
                <div className={styles.leftSection}>
                    {/* 상품 정보 */}
                    <div className={styles.productInfo}>
                        <img src="cardigan/1-1.jpg" alt="상품 이미지" />
                        <div>
                            <span>REGLAN SYMBOL KNIT ZIP-UP</span>
                            <p>S / CHARCOAL</p>
                            <p>{productPrice.toLocaleString()}원  1개</p>
                        </div>
                    </div>

                    {/* 배송 정보 */}
                    <div className={styles.shippingInfo}>
                        <h2>
                            배송정보
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
                        </h2>
                        {!isEditingShipping ? (
                            <>
                                <p>수령인명: {selectedAddress?.name ||(shippingAddresses.length > 0 ? shippingAddresses[0].name : '')}</p>
                                <p>전화번호: {selectedAddress?.phone ||(shippingAddresses.length > 0 ? shippingAddresses[0].phone : '')}</p>
                                <p>주소: {(selectedAddress?.address || shippingAddresses[0]?.address || '') + ' ' +(selectedAddress?.detailAddress || shippingAddresses[0]?.detailAddress || '') +' (' + (selectedAddress?.zipCode || shippingAddresses[0]?.zipCode || '') + ')'}</p>
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
                                <button className={styles.searchButton} onClick={handleSearchAddressClick}>주소 찾기</button>
                                {showAddressSearch && <AddressSearch onAddressSelect={handleAddressSelectFromSearch} />}
                                <input
                                    type="text"
                                    value={tempAddress.detailAddress}
                                    placeholder="상세 주소 입력"
                                    onChange={(e) => setTempAddress({ ...tempAddress, detailAddress: e.target.value })}
                                />
                                <button className={styles.saveButton} onClick={handleSaveAddress}>주소 저장</button>
                            </>
                        )}
                        {/* 배송지 목록 토글 */}
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

                    {/* 적립금 및 쿠폰 사용 */}
                    <div className={styles.rewardCouponSection}>
                        <h2>적립금 및 쿠폰 사용</h2>
                        <div>
                            <label>적립금</label>
                            <input
                                type="number"
                                placeholder="사용할 적립금을 입력하세요."
                                value={rewardPoints}
                                onChange={handleRewardPointsChange}
                                onBlur={handleApplyRewardPoints}
                            />
                            <span> / 보유 적립금: {member?.point?.toLocaleString()}원</span>
                        </div>
                        <div>
                            <label>쿠폰</label>
                            <select value={selectedCoupon} onChange={handleCouponChange}>
                                <option value="">사용할 쿠폰을 선택하세요</option>
                                <option value="10">10% 할인 쿠폰</option>
                                <option value="free">무료 배송 쿠폰</option>
                            </select>
                        </div>
                    </div>

                    {/* 결제 수단 선택 */}
                    <div className={styles.paymentOptions}>
                        <h2>결제 수단 선택</h2>
                        {['kakaopay', 'creditCard', 'bankTransfer'].map((method) => (
                            <label key={method}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method}
                                    checked={selectedPaymentMethod === method}
                                    onChange={() => setSelectedPaymentMethod(method)}
                                />
                                {method === 'kakaopay' ? '카카오페이' : method === 'creditCard' ? '신용카드' : '계좌이체'}
                            </label>
                        ))}
                    </div>

                </div>

                {/* 우측 영역 */}
                <div className={styles.rightSection}>
                    <h2>결제 정보</h2>
                    <p>상품 금액: {productPrice.toLocaleString()}원</p>
                    <p>할인: {discount.toLocaleString()}원</p>
                    <p>배송비: {shippingCost.toLocaleString()}원</p>
                    <p>쿠폰 할인: {couponDiscount.toLocaleString()}원</p>
                    <p>적립금 사용: {rewardPoints}원</p>
                    <br /><hr /><br />
                    <h3>총 결제 금액: {totalAmount.toLocaleString()}원</h3>

                    {/* 결제 동의 */}
                    <div className={styles.paymentAgreement}>
                        <label>
                            <input
                                type="checkbox"
                                checked={paymentAgreement}
                                onChange={() => setPaymentAgreement(!paymentAgreement)}
                            />
                            결제 내용을 확인하고 동의합니다.
                        </label>
                        <button onClick={handlePayButtonClick}>결제하기</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    ) :(
        <Link to="/login"></Link>
    )
    );
};

export default Payment;
