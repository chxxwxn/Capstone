import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import styles from './Wish.module.css';
import { useNavigate, useLocation } from "react-router-dom";

const Wish = () => {
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedProducts, setSortedProducts] = useState([]);
  const itemsPerPage = 9;
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 가져오기
  
  const products = [
    { id: 1, name: '2WAY HOOD DOWN JACKET', image: '/padding/1-1.jpg', price: 200000, color: ['#778D72', '#C3E5F0', '#303030'], date: '2025-02-01' },
    { id: 2, name: 'COLLAR DOWN JACKET', image: '/padding/2-1.jpg', price: 458000, color: ['#EECACA', '#332a25', '#1e2535'], date: '2025-01-01' },
    { id: 3, name: 'LIGHT DOWN JACKET', image: '/padding/3-1.jpg', price: 358000, color: ['#ADA38C', '#adb5be', '#303030'], date: '2025-01-20' },
    { id: 4, name: '2WAY HOOD DOWN JACKET', image: '/padding/1-1.jpg', price: 200000, color: ['#778D72', '#C3E5F0', '#303030'], date: '2025-02-01' },
    { id: 5, name: 'COLLAR DOWN JACKET', image: '/padding/2-1.jpg', price: 458000, color: ['#EECACA', '#332a25', '#1e2535'], date: '2025-01-01' },
    { id: 6, name: 'LIGHT DOWN JACKET', image: '/padding/3-1.jpg', price: 358000, color: ['#ADA38C', '#adb5be', '#303030'], date: '2025-01-20' },
    { id: 7, name: '2WAY HOOD DOWN JACKET', image: '/padding/1-1.jpg', price: 200000, color: ['#778D72', '#C3E5F0', '#303030'], date: '2025-02-01' },
    { id: 8, name: 'COLLAR DOWN JACKET', image: '/padding/2-1.jpg', price: 458000, color: ['#EECACA', '#332a25', '#1e2535'], date: '2025-01-01' },
    { id: 9, name: 'LIGHT DOWN JACKET', image: '/padding/3-1.jpg', price: 358000, color: ['#ADA38C', '#adb5be', '#303030'], date: '2025-01-20' },
    { id: 10, name: 'LIGHT DOWN JACKET', image: '/padding/3-1.jpg', price: 358000, color: ['#ADA38C', '#adb5be', '#303030'], date: '2025-02-10' },
  ];
  const handleNavigation = (subcategory) => {
    // 현재 경로에서 마지막 슬래시 이후의 부분을 제외하고 사용
    const basePath = location.pathname.split("/")[1]; // 첫 번째 경로(segment) 가져오기
    navigate(`/${basePath}/${subcategory.toLowerCase()}`);
  };
  
  const toggleWishlist = (id) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(id) ? prevWishlist.filter((item) => item !== id) : [...prevWishlist, id]
    );
  };

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  

 

  useEffect(() => {
    // 초기 페이지 로드 시 'best' 버튼을 선택된 상태로 설정
    setSortedProducts([...products]);
  }, []);

  useEffect(() => {
    // 정렬된 상품 목록이 변경되면 현재 페이지를 1로 초기화
    setCurrentPage(1);
  }, [sortedProducts]);

  

  
  return (
    <>
 
      {/* Category Header 컴포넌트 */}
      <div className={styles.categoryHeader}>
        <div className={styles.categoryTop}>
          <div className={styles.categoryTitle}>WISH LIST</div>
          <div className={styles.categoryItems}>
          <div className={styles.categoryItems}>
         
          </div>
          </div>
        </div>
        <div className={styles.categoryLine}></div>
        
      </div>

      <div className={styles.productList}>
        <div className={styles.productGrid}>
          {paginatedProducts.map((product) => (
            <div key={product.id} className={styles.product}>
              <a href={`/all/${product.id}`}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                </a>

              <div className={styles.productHeader}>
                <p className={styles.productName}>{product.name}</p>
                <button className={styles.wishlistButton} onClick={() => toggleWishlist(product.id)}>
                  <Icon
                    icon={wishlist.includes(product.id) ? 'solar:heart-outline' :'solar:heart-bold' }
                    className={wishlist.includes(product.id) ? styles.wishlistIconActive : styles.wishlistIcon}
                  />
                </button>
              </div>
              <div className={styles.productLine}></div>
              <div className={styles.productInfo}>
                <p className={styles.productPrice}>{product.price.toLocaleString()}원</p>
                <p className={styles.productColor}>
                  {product.color.map((color, index) => (
                    <span key={index} className={styles.colorCircle} style={{ backgroundColor: color }}></span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 페이지네이션 버튼 */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default Wish;
