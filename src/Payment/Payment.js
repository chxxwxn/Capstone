import React, { useState } from 'react';
import styles from './Payment.module.css';
import AddressSearch from './AddressSearch'; // 카카오맵 주소 검색 컴포넌트 추가

const Payment = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [paymentAgreement, setPaymentAgreement] = useState(false);
    const [productPrice] = useState(59900);
    const [discount] = useState(5990);
    const [shippingCost] = useState(3000);
    const [rewardPoints, setRewardPoints] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [selectedCoupon, setSelectedCoupon] = useState('');
    const [showAddressSearch, setShowAddressSearch] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        name: '홍길동',
        phone: '010-1111-2222',
        address: '서울특별시',
        detailAddress: '1동 002호',
        zipCode: '12345',
    });

    const [isEditingShipping, setIsEditingShipping] = useState(false);
    const [tempAddress, setTempAddress] = useState(shippingAddress);

    // 주소 검색 버튼 클릭 시
    const handleSearchAddressClick = () => {
        setShowAddressSearch(true);
    };

    // AddressSearch 컴포넌트에서 주소 선택 시
    const handleAddressSelectFromSearch = (address) => {
        setTempAddress({
            ...tempAddress,
            address: address.address_name,
            zipCode: address.post_code,
        });
        setShowAddressSearch(false); // 주소 선택 후 AddressSearch 컴포넌트 숨김
    };

    // 주소 저장 버튼 클릭 시
    const handleSaveAddress = () => {
        setShippingAddress(tempAddress);
        setIsEditingShipping(false);
    };

    // 적립금 사용
    const handleRewardPointsChange = (e) => {
        setRewardPoints(e.target.value);
    };

    const handleApplyRewardPoints = () => {
        const parsedRewardPoints = parseInt(rewardPoints) || 0;
        if (parsedRewardPoints > 5000) {
            alert('최대 사용 가능한 적립금은 5,000원입니다.');
            setRewardPoints('5000');
        }
    };

    // 쿠폰 사용
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

    // 결제
    const handlePayButtonClick = () => {
        if (!paymentAgreement) {
            alert('결제 내용을 확인하고 동의해야 합니다.');
            return;
        }
        if (!selectedPaymentMethod) {
            alert('결제 수단을 선택해야 합니다.');
            return;
        }
        alert(`결제 수단: ${selectedPaymentMethod} (으)로 결제를 진행합니다.`);
    };

    // 총 결제 금액 계산
    const calculateTotal = () => {
        const parsedRewardPoints = parseInt(rewardPoints) || 0;
        return productPrice + shippingCost - discount - parsedRewardPoints - couponDiscount;
    };

    const totalAmount = calculateTotal();

    return (
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
                            <button
                                className={styles.editButton}
                                onClick={() => setIsEditingShipping(!isEditingShipping)}
                            >
                                {isEditingShipping ? '취소' : '수정하기'} &gt;
                            </button>
                        </h2>
                        {!isEditingShipping ? (
                            <>
                                <p>수령인명: {shippingAddress.name}</p>
                                <p>전화번호: {shippingAddress.phone}</p>
                                <p>주소: {shippingAddress.address} {shippingAddress.detailAddress} ({shippingAddress.zipCode})</p>
                            </>
                        ) : (
                            <>
                                <input
                                    type="text"
                                    value={tempAddress.address}
                                    placeholder="주소를 입력하세요."
                                    onChange={(e) => setTempAddress({ ...tempAddress, address: e.target.value })}
                                />
                                <button className={styles.serachButton} onClick={handleSearchAddressClick}>주소 찾기</button>
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
                    </div>

                    {/* 적립금 및 쿠폰 사용 */}
                    <div className={styles.rewardCouponSection}>
                        <h2>적립금 및 쿠폰 사용</h2>
                        <div>
                            <label>적립금<br></br>(총 5,000원)</label>
                            <input
                                type="number"
                                placeholder="사용할 적립금을 입력하세요."
                                value={rewardPoints}
                                onChange={handleRewardPointsChange}
                                onBlur={handleApplyRewardPoints}
                            />
                            <span>원</span>
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
                                    value={method}
                                    checked={selectedPaymentMethod === method}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                />
                                {method === 'kakaopay' ? '카카오페이' : method === 'creditCard' ? '신용카드' : '실시간 계좌이체'}
                            </label>
                        ))}
                    </div>
                </div>

                {/* 우측 영역 (결제 정보) */}
                <div className={styles.rightSection}>
                    <h2>결제 정보</h2>
                    <p><span>상품 금액:</span> {productPrice.toLocaleString()}원</p>
                    <p><span>할인 금액:</span> -{discount.toLocaleString()}원</p>
                    <p><span>배송비:</span> {shippingCost.toLocaleString()}원</p>
                    {parseInt(rewardPoints) > 0 && <p><span>적립금 사용:</span> -{parseInt(rewardPoints).toLocaleString()}원</p>}
                    {couponDiscount > 0 && <p><span>쿠폰 할인:</span> -{couponDiscount.toLocaleString()}원</p>}
                    <p><span>총 결제 금액:</span> {totalAmount.toLocaleString()}원</p>

                    <div className={styles.paymentAgreement}>
                        <label>
                            <input type="checkbox" checked={paymentAgreement} onChange={(e) => setPaymentAgreement(e.target.checked)} />
                            위 주문 내역을 확인하였으며, 모든 약관에 동의합니다.
                        </label>
                        <button onClick={handlePayButtonClick}>결제하기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
