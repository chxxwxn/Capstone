import React, { useState, useEffect, useContext } from 'react';
import { Icon } from '@iconify/react';
import styles from '../Pre.module.css';
import { useNavigate, useLocation } from "react-router-dom";
import { LoginContext } from "../../Login/LoginContext";

const Preview = () => {
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [selectedSort, setSelectedSort] = useState('best'); // 초기 상태를 'best'로 설정
  const [products, setProducts] = useState([]); // API로부터 불러올 제품 데이터
  const itemsPerPage = 9;
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 가져오기
  const { member } = useContext(LoginContext); // member 정보 가져오기
  const memberMail = member?.memberMail || '';

  const categories = [
    { name: "MTM", path: "MTM" },
    { name: "Hoodie", path: "Hoodie" },
    { name: "Knit", path: "Knit" },
    { name: "Shirts", path: "Shirts" },
    { name: "Tee", path: "Tee" },
  ];
  
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8090/products/top/shirts");
      const data = await response.json();
  
      // 서버 데이터를 ClothVo 형식으로 매핑
      const mappedData = data.map(item => ({
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        color: item.colorCodes.split(',').map(color => color.trim().split('-')[0]),
        date: item.registerYear,
        image: item.imageUrl,
      }));
  
      setProducts(mappedData); // 매핑된 데이터를 상태에 저장
      setSortedProducts(mappedData); // 처음에는 정렬된 상태로 설정
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 로그인된 사용자의 찜 목록 불러오기
  const fetchWishlist = async () => {
    if (!member?.memberMail) return; // 로그인되지 않은 경우는 패스

    try {
      const response = await fetch(`http://localhost:8090/wishlist/list?memberMail=${memberMail}`);
      if (!response.ok) throw new Error("찜 목록 로딩 실패");

      const data = await response.json(); // 예: [{ productId: 1 }, { productId: 2 }]
      const ids = data.map(item => item.productId); // ID 배열만 추출
      setWishlist(ids); // 찜 상태로 설정
    } catch (error) {
      console.error("Wishlist fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // 컴포넌트가 마운트될 때 API 호출
    fetchWishlist(); // 찜 목록 불러오기
  }, [member?.memberMail]);
  
  const handleNavigation = (subcategory) => {
    // 현재 경로에서 마지막 슬래시 이후의 부분을 제외하고 사용
    const basePath = location.pathname.split("/")[1]; // 첫 번째 경로(segment) 가져오기
    navigate(`/${basePath}/${subcategory.toLowerCase()}`);
  };
  
  const toggleWishlist = (id) => {
    const isWishlisted = wishlist.includes(id);
  
    setWishlist((prevWishlist) =>
      isWishlisted ? prevWishlist.filter((item) => item !== id) : [...prevWishlist, id]
    );
  
    const wishlistData = {
      memberMail: member?.memberMail || '', // 실제 로그인된 사용자 ID로 교체 필요
      productId: id,
    };
  
    fetch(`http://localhost:8090/wishlist/${isWishlisted ? 'delete' : 'insert'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wishlistData),
    })
      .then((res) => {
        if (res.status === 409) {
          alert('이미 등록된 상품입니다.');
          throw new Error('서버 응답 오류');
        }
        if (!res.ok) {
          throw new Error('서버 응답 오류');
        }
        console.log(`${isWishlisted ? '삭제' : '추가'} 완료`);
      })
      .catch((err) => {
        console.error('찜 처리 중 오류:', err);
      });
  };

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortBest = () => {
    const sorted = [...products].sort((a, b) => a.id - b.id); // id 기준 오름차순 정렬
    setSortedProducts(sorted);
    setCurrentPage(1); // 정렬 후 첫 페이지로 리셋
    setSelectedSort('best'); // 선택된 소트 상태 업데이트
  };

  const handleSortNew = () => {
    const sorted = [...products].sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신 날짜 기준 내림차순 정렬
    setSortedProducts(sorted);
    setCurrentPage(1); // 정렬 후 첫 페이지로 리셋
    setSelectedSort('new'); // 선택된 소트 상태 업데이트
  };

  const handleSortHigh = () => {
    const sorted = [...products].sort((a, b) => b.price - a.price); // 가격 내림차순 정렬
    setSortedProducts(sorted);
    setCurrentPage(1); // 정렬 후 첫 페이지로 리셋
    setSelectedSort('high'); // 선택된 소트 상태 업데이트
  };

  const handleSortLow = () => {
    const sorted = [...products].sort((a, b) => a.price - b.price); // 가격 오름차순 정렬
    setSortedProducts(sorted);
    setCurrentPage(1); // 정렬 후 첫 페이지로 리셋
    setSelectedSort('low'); // 선택된 소트 상태 업데이트
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
          <div className={styles.categoryTitle}>TOP &gt;</div>
          <div className={styles.categoryItems}>
          <div className={styles.categoryItems}>
          {categories.map((category, index) => (
              <div
                key={index}
                className={styles.categoryItem}
                style={{
                  cursor: "pointer",
                  color: category.name === "Shirts" ? "black" : "rgba(0, 0, 0, 0.5)", 
                  borderBottom: category.name === "Shirts" ? "2px solid black" : "none"
                }}
                onClick={() => handleNavigation(category.path)}
              >
                {category.name}
              </div>
            ))}

          </div>
          </div>
        </div>
        <div className={styles.categoryLine}></div>
        <div className={styles.sortButtons}>
          <button
            className={`${styles.sortButton} ${selectedSort === 'best' ? '' : styles.inactive}`}
            onClick={handleSortBest}
          >
            BEST
          </button>
          <div className={styles.borderDivider}></div>
          <button
            className={`${styles.sortButton} ${selectedSort === 'new' ? '' : styles.inactive}`}
            onClick={handleSortNew}
          >
            NEW
          </button>
          <div className={styles.borderDivider}></div>
          <button
            className={`${styles.sortButton} ${selectedSort === 'high' ? '' : styles.inactive}`}
            onClick={handleSortHigh}
          >
            HIGH
          </button>
          <div className={styles.borderDivider}></div>
          <button
            className={`${styles.sortButton} ${selectedSort === 'low' ? '' : styles.inactive}`}
            onClick={handleSortLow}
          >
            LOW
          </button>
        </div>
      </div>

      <div className={styles.productList}>
        <div className={styles.productGrid}>
          {paginatedProducts.map((product) => (
            <div key={product.id} className={styles.product}>
              <a href={`/top/shirts/${product.id}`}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                </a>

              <div className={styles.productHeader}>
                <p className={styles.productName}>{product.name}</p>
                <button className={styles.wishlistButton} onClick={() => toggleWishlist(product.id)}>
                  <Icon
                    icon={wishlist.includes(product.id) ? 'solar:heart-bold' : 'solar:heart-outline'}
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

export default Preview;
