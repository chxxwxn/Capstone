import React, { useState } from 'react';
import styles from './Cart.module.css';
import { Link } from "react-router-dom";

// 장바구니 항목을 표시하는 컴포넌트
const CartItem = ({ item, selectedItems, onQuantityChange, onRemoveItem, onSelectItem }) => (
    <div key={item.id} className={styles.OrderBox}>
        <div className={styles.productInfo}>
            {/* 체크박스 - 해당 상품 선택 여부 */}
            <input
                type="checkbox"
                className={styles.productCheckbox}
                checked={selectedItems.includes(item.id)} // 해당 상품이 선택되었는지 확인
                onChange={() => onSelectItem(item.id)} // 선택 여부 토글
            />
            <img src={item.image} alt={item.name} />
            <div className={styles.ProductLine}></div>
            <div className={styles.productInfo2}>
                <div className={styles.InfoBox}>
                    <div className={styles.OrderInfo1}>
                        {/* 상품 이름 및 정보 */}
                        <div className={styles.ProductName}>{item.name}</div>
                        <div className={styles.ProductInfo}>
                            <div className={styles.Size}>{item.size}</div> /
                            <div className={styles.Color}>{item.color}</div>
                        </div>
                    </div>
                    <div className={styles.BuyInfo}>
                        {/* 상품 가격 */}
                        <div className={styles.Price}>
                            {(item.price * item.quantity).toLocaleString()}원
                        </div>
                    </div>
                </div>

                {/* 수량 조정 및 삭제 버튼 */}
                <div className={styles.controlsContainer}>
                    <div className={styles.quantityControl}>
                        <button onClick={() => onQuantityChange(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onQuantityChange(item.id, 1)}>+</button>
                    </div>

                    <div className={styles.removeButtonContainer}>
                        {/* 삭제 버튼 */}
                        <button className={styles.removeButton} onClick={() => onRemoveItem(item.id)}>삭제</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// 장바구니 컴포넌트
const Cart = () => {
    const [paymentAgreement, setPaymentAgreement] = useState(false); // 결제 동의 상태
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 상품 목록
    const [cartItems, setCartItems] = useState([  // 장바구니에 담긴 상품 목록
        { id: 1, name: 'REGLAN SYMBOL KNIT ZIP-UP', size: 'S', color: 'CHARCOAL', price: 59900, quantity: 1, image: 'cardigan/1-1.jpg' },
        { id: 2, name: 'COTTON HOODIE', size: 'M', color: 'BLACK', price: 49900, quantity: 1, image: 'cardigan/1-1.jpg' },
    ]);

    const shippingCost = 3000; // 배송비
    const discount = 0; // 할인 금액 고정

    // 선택된 상품들의 금액 합계 계산
    const productPrice = selectedItems.length === 0 
        ? 0 
        : cartItems
            .filter((item) => selectedItems.includes(item.id)) // 선택된 상품 필터링
            .reduce((acc, item) => acc + item.price * item.quantity, 0); // 금액 합산

    // 총 결제 금액 계산
    const calculateTotal = () => {
        const selectedProductPrice = cartItems
            .filter((item) => selectedItems.includes(item.id)) // 선택된 상품 필터링
            .reduce((acc, item) => acc + item.price * item.quantity, 0); // 금액 합산

        return selectedItems.length === 0 ? 0 : selectedProductPrice + shippingCost - discount; // 총합 계산
    };

    const totalAmount = calculateTotal(); // 최종 결제 금액

    // 결제 버튼 클릭 시 동작
    const handlePayButtonClick = (event) => {
        if (selectedItems.length === 0) {
            alert('상품을 선택하세요.'); // 상품이 선택되지 않으면 경고
            event.preventDefault();
        } else if (!paymentAgreement) {
            alert('결제 내용을 확인하고 동의해야 합니다.'); // 결제 동의가 없으면 경고
            event.preventDefault();
        }
    };

    // 수량 변경 핸들러
    const handleQuantityChange = (id, delta) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) } // 수량 최소 1개로 제한
                    : item
            )
        );
    };

    // 상품 삭제 핸들러
    const handleRemoveItem = (id) => {
        const confirmDelete = window.confirm("상품을 삭제하시겠습니까?");
        if (confirmDelete) {
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== id)); // 해당 상품 삭제
        }
    };

    // 선택된 상품들 삭제 핸들러
    const handleRemoveSelectedItems = () => {
        if (selectedItems.length === 0) {
            alert("삭제할 상품을 선택하세요."); // 선택된 상품 없으면 경고
            return;
        }

        const confirmDelete = window.confirm("선택한 상품을 삭제하시겠습니까?");
        if (confirmDelete) {
            setCartItems((prevItems) =>
                prevItems.filter((item) => !selectedItems.includes(item.id)) // 선택된 상품 삭제
            );
            setSelectedItems([]); // 선택된 상품 초기화
        }
    };

    // 개별 상품 선택 핸들러
    const handleSelectItem = (id) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((itemId) => itemId !== id) // 선택 해제
                : [...prevSelected, id] // 선택 추가
        );
    };

    // 전체 선택/해제 핸들러
    const handleSelectAll = () => {
        setSelectedItems(selectedItems.length === cartItems.length ? [] : cartItems.map((item) => item.id)); // 전체 선택 또는 해제
    };

    return (
        <div className={styles.Cart}>
            <div className={styles.CartTitle}>장바구니</div>

            <div className={styles.CartContainer}>
                <div className={styles.leftSection}>
                    {/* 전체 선택/해제 및 선택된 상품 삭제 */}
                    <div className={styles.selectionControls}>
                        <label className={styles.selectAllLabel}>
                            <input
                                type="checkbox"
                                checked={selectedItems.length === cartItems.length && cartItems.length > 0} // 전체 선택 상태 체크
                                onChange={handleSelectAll} // 전체 선택/해제
                            />
                            <span>전체 선택</span>
                        </label>
                        <button className={styles.removeSelectedButton} onClick={handleRemoveSelectedItems}>
                            선택한 상품 삭제
                        </button>
                    </div>

                    {/* 장바구니 항목 */}
                    {cartItems.length === 0 ? (
                        <div className={styles.emptyMessage}>상품이 없습니다.</div>
                    ) : (
                        cartItems.map((item) => (
                            <CartItem 
                                key={item.id}
                                item={item}
                                selectedItems={selectedItems}
                                onQuantityChange={handleQuantityChange}
                                onRemoveItem={handleRemoveItem}
                                onSelectItem={handleSelectItem}
                            />
                        ))
                    )}
                </div>

                {/* 결제 정보 섹션 */}
                <div className={styles.rightSection}>
                    <div className={styles.OrderDetailTitle2}>결제정보</div>
                    <div className={styles.Line} />
                    <div className={styles.OrderDetailTitle3}>
                        <div>상품 금액: {productPrice.toLocaleString()}원</div>
                    </div>
                    <div className={styles.totaldiscount}>
                        <div>할인: {discount.toLocaleString()}원</div>
                        <div>배송비: {shippingCost.toLocaleString()}원</div>
                    </div>
                    <div className={styles.OrderDetailTitle3}>
                        총 결제 금액: {totalAmount.toLocaleString()}원
                    </div>

                    {/* 결제 동의 체크박스 및 결제 버튼 */}
                    <div className={styles.paymentAgreement}>
                        <label>
                            <input
                                type="checkbox"
                                checked={paymentAgreement}
                                onChange={() => setPaymentAgreement(!paymentAgreement)} // 결제 동의 상태 토글
                            />
                            결제 내용을 확인하고 동의합니다.
                        </label>
                        <Link to="/Payment" className={styles.payButtonWrapper}>
                            <button className={styles.payButton} onClick={handlePayButtonClick}>
                                결제하기
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
