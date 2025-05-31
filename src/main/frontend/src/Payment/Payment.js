import React, { useState, useContext, useEffect } from 'react';
import styles from './Payment.module.css';
import AddressSearch from './AddressSearch'; // 카카오맵 주소 검색 컴포넌트 추가
import { LoginContext } from "../Login/LoginContext";
import { Link } from 'react-router-dom';


const Payment = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [paymentAgreement, setPaymentAgreement] = useState(false);
    const [productPrice, setProductPrice] = useState(0);
    const [shippingCost] = useState(3000);
    const [rewardPoints, setRewardPoints] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [showAddressSearch, setShowAddressSearch] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
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
    const [coupons, setCoupons] = useState([]); // ✅ 쿠폰 상태 추가
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await fetch(`http://localhost:8090/coupon/list`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();

                    // 사용 완료 쿠폰은 제외
                    const mapped = data
                        .filter(coupon => coupon.status !== '사용 완료')
                        .map((coupon) => ({
                            id: coupon.couponId,
                            couponCode: coupon.couponCode,
                            name: coupon.name,
                            discount: coupon.discountType === 'percent'
                                ? `${coupon.discountValue}% 할인`
                                : '무료 배송',
                            dead: `( ${coupon.expireDate} 소멸 예정)`,
                            date: coupon.issueDate,
                            use: coupon.status,
                        }));

                    setCoupons(mapped);
                } else {
                    console.warn("쿠폰 목록을 가져오지 못했습니다");
                }
            } catch (error) {
                console.error("쿠폰 불러오기 실패:", error);
            }
        };

        fetchCoupons();
    }, []);

    useEffect(() => {
        const storedMember = sessionStorage.getItem("member");
        if (storedMember) {
            const parsed = JSON.parse(storedMember);
            fetch(`http://localhost:8090/cart/list?memberMail=${parsed.memberMail}`)
            .then(res => res.json())
            .then(data => {
                const mapped = data.map(item => ({
                cartId: item.cartId,
                id: item.productId,
                name: item.product.productName,
                price: item.product.productPrice,
                size: item.productSize,
                color: item.productColor,
                image: item.imageUrl,
                quantity: item.productQuantity
                }));
                setCartItems(mapped);
            });
        }
    }, []);

    const [paymentItems, setPaymentItems] = useState([]);

    useEffect(() => {
        const storedItems = sessionStorage.getItem("paymentItems");
        if (storedItems) {
            const parsedItems = JSON.parse(storedItems);
            setPaymentItems(parsedItems);

            // 상품 금액 계산: 단가 × 수량 합산
            const total = parsedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
            setProductPrice(total);
        }
    }, []);
    
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

    const handleSaveAddress = async () => {
        const newAddress = { ...tempAddress };

        try {
            const response = await fetch("http://localhost:8090/address/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(newAddress),
            });

            if (!response.ok) throw new Error("주소 저장 실패");
            console.log("주소 저장 성공");
        } catch (err) {
            console.error("주소 저장 오류:", err);
            alert("주소 저장에 실패했습니다.");
            return;
        }

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
    const selectedCode = e.target.value;
    const foundCoupon = coupons.find(c => c.couponCode === selectedCode);
    setSelectedCoupon(foundCoupon || null);

    let newCouponDiscount = 0;
    let tempTotal = productPrice - discount + shippingCost;

    if (foundCoupon) {
        if (foundCoupon.discount.includes('%')) {
            const percent = parseInt(foundCoupon.discount); // 예: "10% 할인" → 10
            newCouponDiscount = Math.floor((productPrice - discount) * (percent / 100));
            tempTotal -= newCouponDiscount;
        } else if (foundCoupon.discount.includes('무료')) {
            newCouponDiscount = shippingCost;
            tempTotal -= shippingCost;
        }
    }

    tempTotal -= rewardPoints;

    setCouponDiscount(newCouponDiscount);
    setTotalAmount(tempTotal);
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

                const orderStatus = selectedPaymentMethod === 'account' ? '입금 전' : '배송 준비 중';

                const orderData = cartItems.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    size: item.size,
                    color: item.color,
                    price: item.price,
                    quantity: item.quantity,
                    status: orderStatus,
                    image: item.image,
                }));

                sessionStorage.setItem("orderToSave", JSON.stringify(orderData));

                if (selectedCoupon) {
                    fetch(`http://localhost:8090/coupon/use?couponCode=${selectedCoupon.couponCode}`, {
                        method: "PUT",
                        credentials: "include",
                    })
                    .then((res) => {
                        if (!res.ok) throw new Error("쿠폰 상태 변경 실패");
                        console.log("쿠폰 상태 업데이트 완료");
                    })
                    .catch((err) => {
                        console.error("쿠폰 상태 업데이트 오류:", err);
                    });
                }

                await fetch('http://localhost:8090/order/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(orderData), // 결제한 상품 리스트
                    });

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

                if (selectedCoupon || rewardPoints > 0) {
                    fetch(`http://localhost:8090/member/use-benefits?memberMail=${member.memberMail}&usedPoint=${rewardPoints}`, {
                        method: 'PUT',
                        credentials: 'include',
                    })
                    .then((res) => {
                        if (!res.ok) throw new Error("혜택 차감 실패");
                        console.log("적립금과 쿠폰 차감 완료");
                    })
                    .catch((err) => {
                        console.error("혜택 차감 오류:", err);
                    });
                }
          
                if (!response.ok) {
                    throw new Error('카카오페이 결제 준비 실패');
                }
          
                const data = await response.json();

                sessionStorage.setItem("tid", data.tid);

                window.location.href = data.next_redirect_pc_url;
            } catch (error) {
                console.error('결제 오류:', error);
                alert('카카오페이 결제 중 오류가 발생했습니다.');
            }
        }
    };

    const { isLoggedIn } = useContext(LoginContext);

    const isPromotionActive = false; // 예시: 지금은 프로모션 아님
    const discount = isPromotionActive ? Math.floor(productPrice * 0.1) : 0;
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const calculatedTotal = productPrice - discount - couponDiscount - rewardPoints + shippingCost;
        setTotalAmount(calculatedTotal > 0 ? calculatedTotal : 0); // 음수 방지
    }, [productPrice, discount, couponDiscount, rewardPoints, shippingCost]);
    
    useEffect(() => {
    const storedMember = sessionStorage.getItem("member");
    if (storedMember) {
        try {
            const parsedMember = JSON.parse(storedMember);
            setMember(parsedMember);

            const name = parsedMember.memberLn + parsedMember.memberFn;
            const phone =
                parsedMember.memberNum2 === "0000" && parsedMember.memberNum3 === "0000"
                    ? parsedMember.memberNum1
                    : `${parsedMember.memberNum1}-${parsedMember.memberNum2}-${parsedMember.memberNum3}`;

            // ✅ 배송지 목록 전체 가져오기
            fetch(`http://localhost:8090/address/getAll?memberMail=${parsedMember.memberMail}`, {
                method: "GET",
                credentials: "include",
            })
                .then((res) => res.json())
                .then((addressList) => {
                    if (Array.isArray(addressList)) {
                        const processed = addressList.map(addr => ({
                            name,
                            phone,
                            address: addr.address,
                            detailAddress: addr.detailAddress,
                            zipCode: addr.zipCode
                        }));
                        setShippingAddresses(processed);
                        setSelectedAddress(processed[0]); // 가장 최근 주소 선택
                    }
                })
                .catch((err) => {
                    console.error("배송지 목록 불러오기 오류:", err);
                });
        } catch (err) {
            console.error("회원 정보 파싱 오류:", err);
        }
    }
}, []);
 
    return (
        isLoggedIn && member ? (
        <>
        <div className={styles.paymentContainer}>
            <h1>주문하기</h1>
            <div className={styles.contentWrapper}>
                {/* 좌측 영역 */}
                <div className={styles.leftSection}>
                    {/* 상품 정보 */}
                    <div>
                        {paymentItems.map((item, index) => (
                            <div key={index} className={styles.productInfo}>
                                <img src={item.image} alt="상품 이미지" />
                                <div>
                                    <span>{item.name}</span>
                                    <p>{item.size} / {item.color}</p>
                                    <p>{(item.price).toLocaleString()}원 × {item.quantity}개</p>
                                </div>
                            </div>
                        ))}
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
                            <select value={selectedCoupon?.couponCode || ''} onChange={handleCouponChange}>
                                <option value="">사용할 쿠폰을 선택하세요</option>
                                {coupons.map(coupon => (
                                    <option key={coupon.id} value={coupon.couponCode}>
                                        {coupon.name}
                                    </option>
                                ))}
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
