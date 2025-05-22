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
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword') || '';

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8090/products");
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

      // 상품 이름에 키워드가 포함된 것만 필터링
      const filtered = mappedData.filter(product =>
        product.name && product.name.toLowerCase().includes(keyword.toLowerCase())
      );
  
        setProducts(filtered);
        setSortedProducts(filtered); // 꼭 같이 설정
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword]);

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
          throw new Error('이미 등록됨');
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

  return (
    <>
 
      {/* Category Header 컴포넌트 */}
      <div className={styles.categoryHeader}>
        <div className={styles.categoryTop}>
          <div className={styles.categoryTitle}>SEARCHING : {keyword}</div>
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
