import React, { useState, useCallback, useEffect } from 'react';
import styles from './Payment.module.css';
import AddressSearch from './AddressSearch'; // AddressSearch 컴포넌트 import

const Payment = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [paymentAgreement, setPaymentAgreement] = useState(false);
    const [productPrice] = useState(59900); // 상품 가격
    const [discount] = useState(5990); // 할인 금액
    const [shippingCost] = useState(3000); // 배송비
    const [rewardPoints, setRewardPoints] = useState(''); // 적립금 입력
    const [couponDiscount, setCouponDiscount] = useState(0); // 쿠폰 할인 금액
    const [shippingAddress, setShippingAddress] = useState({
        name: '홍길동',
        phone: '010-1111-2222',
        address: '서울특별시',
        detailAddress: '1동 002호',
        zipCode: '12345',
    });
    const [isEditingShipping, setIsEditingShipping] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState('');

    const handlePaymentMethodChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
    };

    const handlePaymentAgreementChange = (e) => {
        setPaymentAgreement(e.target.checked);
    };

    const calculateTotal = () => {
        const parsedRewardPoints = parseInt(rewardPoints) || 0;
        return productPrice + shippingCost - discount - parsedRewardPoints - couponDiscount;
    };

    const handleEditShippingClick = () => {
        setIsEditingShipping(true);
    };

    const handleAddressSelectFromSearch = (address) => {
        setShippingAddress({
            ...shippingAddress,
            address: address.address_name,
            detailAddress: address.post_code,
            zipCode: address.zone_no, // 우편번호 저장
        });
        setIsEditingShipping(false);
    };

    const handleRewardPointsChange = (e) => {
        setRewardPoints(e.target.value);
    };

    const handleCouponChange = (e) => {
        setSelectedCoupon(e.target.value);
        if (e.target.value === '10') {
            setCouponDiscount(productPrice * 0.1); // 10% 할인
        } else if (e.target.value === 'free') {
            setCouponDiscount(shippingCost); // 배송비 무료
        } else {
            setCouponDiscount(0); // 쿠폰 선택 해제 시 할인 초기화
        }
    };

    const handleApplyRewardPoints = () => {
        const parsedRewardPoints = parseInt(rewardPoints) || 0;
        if (parsedRewardPoints > 5000) {
            alert('최대 사용 가능한 적립금은 5,000원입니다.');
            setRewardPoints('5000');
        }
    };

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

    const handleSaveAddress = () => {
        // 주소 저장 로직
        alert('주소가 저장되었습니다.');
        setIsEditingShipping(false);
    };

    const parsedRewardPoints = parseInt(rewardPoints) || 0;
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
                        <h2>배송정보 <button onClick={handleEditShippingClick}>수정하기 &gt;</button></h2>
                        <div>
                            <p>수령인명</p>
                            <p>{shippingAddress.name}</p>
                        </div>
                        <div>
                            <p>전화번호</p>
                            <p>{shippingAddress.phone}</p>
                        </div>
                        <div>
                            <p>주소</p>
                            <p>{shippingAddress.address} {shippingAddress.detailAddress} ({shippingAddress.zipCode})</p>
                        </div>
                        {isEditingShipping && (
                            <div>
                                <AddressSearch onAddressSelect={handleAddressSelectFromSearch} />
                                <button onClick={handleSaveAddress}>주소 저장</button>
                            </div>
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
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="kakaopay"
                                    checked={selectedPaymentMethod === 'kakaopay'}
                                    onChange={handlePaymentMethodChange}
                                />
                                카카오페이
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="naverpay"
                                    checked={selectedPaymentMethod === 'naverpay'}
                                    onChange={handlePaymentMethodChange}
                                />
                                네이버페이
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="creditCard"
                                    checked={selectedPaymentMethod === 'creditCard'}
                                    onChange={handlePaymentMethodChange}
                                />
                                신용카드
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="bankTransfer"
                                    checked={selectedPaymentMethod === 'bankTransfer'}
                                    onChange={handlePaymentMethodChange}
                                />
                                실시간 계좌이체
                            </label>
                        </div>
                    </div>
                </div>

                {/* 우측 영역 (결제 정보) */}
                <div className={styles.rightSection}>
                    <h2>결제 정보</h2>
                    <p><span>상품 금액:</span> {productPrice.toLocaleString()}원</p>
                    <p><span>할인 금액:</span> -{discount.toLocaleString()}원</p>
                    <p><span>배송비:</span> {shippingCost.toLocaleString()}원</p>
                    {parsedRewardPoints > 0 && (
                        <p>
                            <span>적립금 사용:</span> -{parsedRewardPoints.toLocaleString()}원
                        </p>
                    )}
                    {couponDiscount > 0 && (
                        <p>
                            <span>쿠폰 할인:</span> -{couponDiscount.toLocaleString()}원
                        </p>
                    )}
                    <p><span>총 결제 금액:</span> {totalAmount.toLocaleString()}원</p>

                    {/* 결제 동의 및 결제하기 */}
                    <div className={styles.paymentAgreement}>
                        <label>
                            <input
                                type="checkbox"
                                checked={paymentAgreement}
                                onChange={handlePaymentAgreementChange}
                            />
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
