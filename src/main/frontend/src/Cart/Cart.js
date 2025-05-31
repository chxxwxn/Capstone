import React, { useState, useEffect, useContext } from 'react';
import styles from './Cart.module.css';
import { Link } from "react-router-dom";
import { LoginContext } from "../Login/LoginContext";

// 장바구니 항목을 표시하는 컴포넌트
const CartItem = ({ item, selectedItems, onQuantityChange, onRemoveItem, onSelectItem }) => (
    <div key={item.cartid} className={styles.OrderBox}>
        <div className={styles.productInfo}>
            {/* 체크박스 - 해당 상품 선택 여부 */}
            <input
                type="checkbox"
                className={styles.productCheckbox}
                checked={selectedItems.includes(item.cartid)} // 해당 상품이 선택되었는지 확인
                onChange={() => onSelectItem(item.cartid)} // 선택 여부 토글
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
                            <div className={styles.Color}>{item.color.split("-")[1]}</div>
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
                        <button onClick={() => onQuantityChange(item.cartid, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onQuantityChange(item.cartid, 1)}>+</button>
                    </div>

                    <div className={styles.removeButtonContainer}>
                        {/* 삭제 버튼 */}
                        <button className={styles.removeButton} onClick={() => onRemoveItem(item.cartid)}>삭제</button>
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
    const { member } = useContext(LoginContext); // member 정보 가져오기
    const [cartItems, setCartItems] = useState([]);
    const memberMail = member?.memberMail || '';
    
    const shippingCost = 3000; // 배송비
    const discount = 0; // 할인 금액 고정

    useEffect(() => {
        if (!memberMail) return; // 이메일 없으면 fetch 안 함

        fetch(`http://localhost:8090/cart/list?memberMail=${memberMail}`)
            .then((response) => {
                if (!response.ok) throw new Error("네트워크 응답 실패");
                return response.json();
            })
            .then((data) => {
                const mappedData = data.map(item => ({
                    cartid: item.cartId,
                    id: item.productId,
                    name: item.product.productName,
                    price: item.product.productPrice,
                    size: item.productSize,
                    color: item.productColor,
                    image: item.imageUrl,
                    quantity: item.productQuantity
                }));
                setCartItems(mappedData);
            })
            .catch((error) => {
                console.error("장바구니 불러오기 실패:", error);
            });
    }, [memberMail]);
    

    // 선택된 상품들의 금액 합계 계산
    const productPrice = selectedItems.length === 0 
        ? 0 
        : cartItems
            .filter((item) => selectedItems.includes(item.cartid)) // 선택된 상품 필터링
            .reduce((acc, item) => acc + item.price * item.quantity, 0); // 금액 합산

    // 총 결제 금액 계산
    const calculateTotal = () => {
        const selectedProductPrice = cartItems
            .filter((item) => selectedItems.includes(item.cartid)) // 선택된 상품 필터링
            .reduce((acc, item) => acc + item.price * item.quantity, 0); // 금액 합산

        return selectedItems.length === 0 ? 0 : selectedProductPrice + shippingCost - discount; // 총합 계산
    };

    const totalAmount = calculateTotal(); // 최종 결제 금액

    // 결제 버튼 클릭 시 동작
    const handlePayButtonClick = (event) => {
        const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.cartid));
        if (selectedCartItems.length === 0) {
            alert("결제할 상품을 선택해주세요.");
            return;
        }

        sessionStorage.setItem("paymentItems", JSON.stringify(selectedCartItems));
        window.location.href = "/payment";
    };

    // 수량 변경 핸들러
    const handleQuantityChange = (cartid, delta) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.cartid === cartid
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    
        // 변경된 수량 계산
        const item = cartItems.find(item => item.cartid === cartid);
        if (!item) return;
    
        const newQuantity = Math.max(1, item.quantity + delta);
    
        // 서버에 수량 변경 요청 보내기
        fetch(`http://localhost:8090/cart/updateQuantity`, {
            method: "PUT",  // 또는 PATCH 가능
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cartId: cartid,
                productQuantity: newQuantity,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("수량 업데이트 실패");
            }
            return response.text();
        })
        .then((data) => {
            console.log("수량 업데이트 성공:", data);
            // 필요 시 추가 상태 업데이트 가능
        })
        .catch((error) => {
            alert("수량 업데이트에 실패했습니다.");
            console.error(error);
        });
    };
    

    // 단일 삭제
    const handleRemoveItem = (cartid) => {
        const confirmDelete = window.confirm("상품을 삭제하시겠습니까?");
        if (confirmDelete) {
            fetch(`http://localhost:8090/cart/delete/${cartid}`, {
                method: "DELETE"
            })
            .then(() => {
                setCartItems(prev => prev.filter(item => item.cartid !== cartid));
            })
            .catch(err => console.error("삭제 실패:", err));
        }
    };

    // 선택 삭제
    const handleRemoveSelectedItems = () => {
        if (selectedItems.length === 0) {
            alert("삭제할 상품을 선택하세요.");
            return;
        }

        const confirmDelete = window.confirm("선택한 상품을 삭제하시겠습니까?");
        if (confirmDelete) {
            fetch(`http://localhost:8090/cart/deleteSelected`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(selectedItems)
            })
            .then(() => {
                setCartItems(prev => prev.filter(item => !selectedItems.includes(item.cartid)));
                setSelectedItems([]);
            })
            .catch(err => console.error("삭제 실패:", err));
        }
    };

    // 개별 상품 선택 핸들러
    const handleSelectItem = (cartid) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(cartid)
                ? prevSelected.filter((itemId) => itemId !== cartid) // 선택 해제
                : [...prevSelected, cartid] // 선택 추가
        );
    };

    // 전체 선택/해제 핸들러
    const handleSelectAll = () => {
        setSelectedItems(selectedItems.length === cartItems.length ? [] : cartItems.map((item) => item.cartid)); // 전체 선택 또는 해제
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
                                key={item.cartid}
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
                            <button className={styles.payButton} onClick={handlePayButtonClick}>
                                결제하기
                            </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
