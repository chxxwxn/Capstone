import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import styles from '../Product.module.css';
import { useNavigate, useLocation } from "react-router-dom";



const Preview = () => {
  const [wishlist, setWishlist] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null); // 모달 이미지 상태 추가
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 가져오기

  const handleNavigation = (subcategory) => {
    // 현재 경로에서 마지막 슬래시 이후의 부분을 제외하고 사용
    const basePath = location.pathname.split("/")[1]; // 첫 번째 경로(segment) 가져오기
    navigate(`/${basePath}/${subcategory.toLowerCase()}`);
  };

  const categories = [
    { name: "MTM", path: "MTM" },
    { name: "Hoodie", path: "Hoodie" },
    { name: "Knit", path: "Knit" },
    { name: "Shirts", path: "Shirts" },
    { name: "Tee", path: "Tee" },
  ];
;

  const products = [
    {
      id: 1,
      name: '2WAY HOOD DOWN JACKET',
      image: '/padding/1-1.jpg',
      price: 200000,
      color: ['#778D72', '#C3E5F0', '#303030'],
      date: '2025-02-01',
    },
  ];

  const toggleWishlist = (id) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(id) ? prevWishlist.filter((item) => item !== id) : [...prevWishlist, id]
    );
  };

  const reviews = [
    { 
      id: 1,
      starIcon: "★",
      starNum: 3,
      phy: "여성•170cm•55kg",
      size: "M",
      buy: "구매",
      date: "2024.12.30",
      idName: "abcd***",
      content: "옷이 예뻐요",
      images: ["/padding/1-4.jpg", "/padding/1-5.jpg"] // 리뷰 사진 추가
    },
    { 
      id: 2,
      starIcon: "★",
      starNum: 5,
      phy: "남성•180cm•75kg",
      size: "L",
      buy: "구매",
      date: "2025.01.15",
      idName: "efgh***",
      content: "색상이 너무 예뻐요",
    }
  ];

  const handleImageClick = (image) => {
    setSelectedImage(image); // 클릭한 이미지를 상태에 저장
  };

  const handleCloseModal = () => {
    setSelectedImage(null); // 모달 닫기
  };

  const [openAsk, setOpenAsk] = useState(null); // 어떤 문의가 열려있는지 관리


  const toggleAsk = (id) => {
    setOpenAsk(openAsk === id ? null : id); // 클릭 시 열리고 닫히게 함
  };
  
const asks = [
  { 
    id: 1,
    category: "배송",
    answerStatus: "답변 완료",
    date: "2024.12.30",
    idName: "abcd***",
    title: "배송이 얼마나 걸리나요?",
    open: "펼치기",
    detail: "평균 배송 기간이 얼마나 되나요?",
    answer: "보통 2~3일 내에 배송됩니다."
  },
  { 
    id: 2,
    category: "배송",
    answerStatus: "답변 완료",
    date: "2024.12.30",
    idName: "abcd***",
    title: "배송이 얼마나 걸리나요?",
    open: "펼치기",
    detail: "평균 배송 기간이 얼마나 되나요?",
    answer: "보통 2~3일 내에 배송됩니다."
  },
];


  return (
    <>
     
      {/* 카테고리 헤더 */}
      <div className={styles.categoryHeader}>
        <div className={styles.categoryTop}>
          <div className={styles.categoryTitle}>TOP &gt;</div>
          <div className={styles.categoryItems}>
                    {categories.map((category, index) => (
                        <div
                          key={index}
                          className={styles.categoryItem}
                          style={{
                            cursor: "pointer",
                            color: category.name === "Hoodie" ? "black" : "rgba(0, 0, 0, 0.5)", 
                            borderBottom: category.name === "Hoodie" ? "2px solid black" : "none"
                          }}
                          onClick={() => handleNavigation(category.path)}
                        >
                          {category.name}
                        </div>
                      ))}
          
                    </div>
        </div>
        <div className={styles.categoryLine}></div>
      </div>

      {/* 상품 리스트 */}
      <div className={styles.productList}>
        <div className={styles.productGrid}>
          {/* 상품 정보 영역 */}
          <div className={styles.productInfoContainer}>
            {products.map((product) => (
              <div key={product.id} className={styles.productInfo}>
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
                <p className={styles.productPrice}>{product.price.toLocaleString()}원</p>
              </div>
            ))}
          </div>

          {/* 이미지 영역 */}
          <div className={styles.productImageContainer}>
            {products.map((product) => (
              <a key={product.id} href={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
              </a>
            ))}
          </div>

          {/* 컬러 영역 */}
          <div className={styles.productInfoContainer}>
            {products.map((product) => (
              <div key={product.id} className={styles.productbuy}>
                {/* 사이즈 선택 */}
                <div className={styles.productSize}>
                  <p className={styles.optionTitle}>사이즈</p>
                  <div className={styles.sizeOptions}>
                    {['S', 'M', 'L'].map((size) => (
                      <button
                        key={size}
                        className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 색상 옵션 */}
                <div className={styles.productColorOptions}>
                  <p className={styles.optionTitle}>색상</p>
                  <div className={styles.colorOptions}>
                    {product.color.map((color, index) => (
                      <span
                        key={index}
                        className={`${styles.colorCircle} ${selectedColor === color ? styles.selectedColor : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      ></span>
                    ))}
                  </div>
                </div>

                {/* 수량 선택 */}
                <div className={styles.productQuantity}>
                  <p className={styles.optionTitle}>수량</p>
                  <div className={styles.quantityControl}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>

                {/* 장바구니 & 구매 버튼 */}
                <div className={styles.buttonGroup}>
                  <button className={styles.cartButton}>장바구니</button>
                  <button className={styles.buyButton}>구매하기</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 상품 상세 정보 섹션*/}
      <div className={styles.productDetail}>
        <div className={styles.productDetailLine}></div>
        <div className={styles.productDetailInfo}>FRONT</div>
      </div>
      <div className={styles.imageGrid}>
        <img src="/padding/1-1.jpg" alt="Image 1" />
        <img src="/padding/1-1.jpg" alt="Image 2" />
        <img src="/padding/1-1.jpg" alt="Image 3" />
      </div>
      <div className={styles.productDetail}>
        <div className={styles.productDetailInfo}>SIDE</div>
      </div>
      <div className={styles.imageGrid}>
        <img src="/padding/1-2.jpg" alt="Image 1" />
        <img src="/padding/1-2.jpg" alt="Image 2" />
        <img src="/padding/1-2.jpg" alt="Image 3" />
      </div>
      <div className={styles.productDetail}>
        <div className={styles.productDetailInfo}>BACK</div>
      </div>
      <div className={styles.imageGrid}>
        <img src="/padding/1-3.jpg" alt="Image 1" />
        <img src="/padding/1-3.jpg" alt="Image 2" />
        <img src="/padding/1-3.jpg" alt="Image 3" />
      </div>
      <div className={styles.productDetail}>
        <div className={styles.productDetailLine}></div>
        <div className={styles.productDetailInfo}>DEATAIL</div>
      </div>
      <div className={styles.imageGridDetail}>
        <img src="/padding/1-4.jpg" alt="Image 1" />
        <img src="/padding/1-4.jpg" alt="Image 2" />
        <img src="/padding/1-4.jpg" alt="Image 3" />
        <img src="/padding/1-5.jpg" alt="Image 1" />
        <img src="/padding/1-5.jpg" alt="Image 2" />
        <img src="/padding/1-5.jpg" alt="Image 3" />
      </div>
      <div className={styles.productDetail}>
        <div className={styles.productDetailLine}></div>
        <div className={styles.productDetailInfo}>SIZE</div>
      </div>
      <div className={styles.productDetailInfoText}>
        (cm) <br />
        총장(B옆목점): 51 <br />
        가슴단면: 38.5 <br />
        밑단: 33 <br />
        암홀: 20.5 <br />
        화장: 80 <br />
        <br />
        Model(W): 170cm / CHEST 31" / WAIST 24" / HIP 35"
      </div>
      <div className={styles.productDetail}>
        <div className={styles.productDetailLine}></div>
        <div className={styles.productDetailInfo}>INFO</div>
      </div>
      <div className={styles.productDetailInfoText}>
        - 울 혼방 원사로 제직 되었습니다.<br />
        - 밑단이 자연스럽게 말려 올라가는 디테일과 주름지게 착용되는 긴 소매 기장이 포인트인 디자인입니다.<br />
        - 래글런 소매로 제직하여 퀄리티를 높여주었습니다.<br />
        - 앞판에 RR 레터링 로고가 퀄리티 높은 자수로 작업되어 있습니다.<br />
        <br />
        * 니트 특성상 강한 마찰 시 보풀이 생길 수 있습니다.<br />
        * 사이즈는 측정 방법과 신축성에 따라 오차가 있을 수 있습니다.<br />
        * 소비자의 세탁 부주의로 인한 변형에 대해서는 보상 및 책임이 어렵습니다.<br />
        <br />
        WOOL 4% NYLON 20% POLYESTER 52% ACRYLIC 24%<br />
        <br />
        드라이<br />
        열건조 금지<br />
        다리미 금지<br />
        비틀기 금지<br />
        표백 금지
      </div>

      <div className={styles.review}>
          {/* REVIEW HEADER */}
          <div className={styles.reviewHeader}>
            <div className={styles.reviewTitle}>리뷰</div>
            <div className={styles.reviewWrite}>작성하기</div>
          </div>

          {/* 리뷰 목록 */}
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewPost}>
              {/* REVIEW INFO */}
              <div className={styles.reviewInfo}>
                {/* REVIEW STAR */}
                <div className={styles.reviewStar}>
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={styles.reviewStarIcon}
                      style={{ color: index < review.starNum ? '#000' : '#aaa' }}
                    >
                      {review.starIcon}
                    </span>
                  ))}
                  <span className={styles.reviewStarNum}>{review.starNum}</span>
                </div>

                {/* REVIEW DATA */}
                <div className={styles.reviewData}>
                  <span className={styles.reviewPhy}>{review.phy}</span>
                  <span className={styles.reviewDataDiv}>|</span>
                  <span className={styles.reviewSize}>{review.size}</span>
                  <span className={styles.reviewBuy}>{review.buy}</span>
                </div>

                {/* REVIEW POST DATE */}
                  <span className={styles.reviewDate}>{review.date}</span>
              </div>

              {/* REVIEW POST ID */}     
              <span className={styles.reviewId}>{review.idName}</span>
         

              {/* REVIEW CONTENT */}
              <div className={styles.reviewContent}>{review.content}</div>
              
            {/* 이미지 클릭 시 모달 열기 */}
            {review.images && review.images.length > 0 && (
                      <div className={styles.reviewImages}>
                        {review.images.map((imgSrc, index) => (
                          <img
                            key={index}
                            src={imgSrc}
                            className={styles.reviewImage}
                            onClick={() => handleImageClick(imgSrc)} // 이미지 클릭 시 핸들러
                          />
                        ))}
                      </div>
                    )}


              {/* REVIEW LINE */}
              <div className={styles.reviewLine}></div>
            </div>
          ))}
        </div>

        {/* 모달 이미지 보기 */}
        {selectedImage && (
                <div className={styles.modal} onClick={handleCloseModal}>
                  <div className={styles.modalContent}>
                    <img src={selectedImage} alt="Larger view" className={styles.modalImage} />
                  </div>
                </div>
              )}

      
<div className={styles.ask}>
      <div className={styles.askHeader}>
        <div className={styles.askTitle}>문의</div>
        <div className={styles.askWrite}>작성하기</div>
      </div>
      {asks.map((ask) => (
        <div key={ask.id} className={styles.askPost}>
          <div className={styles.askInfo}>
            <div className={styles.askCategoryMark}>
              <div className={styles.askCategory}>{ask.category}</div>
              <div className={styles.askAnswer}>{ask.answerStatus}</div>
            </div>
            <div className={styles.askDate}>{ask.date}</div>
          </div>
          <div className={styles.askId}>{ask.idName}</div>

          {/* 클릭 시 드롭다운 토글 */}
          <div className={styles.askTitleHeader}>
          <div className={styles.askTitleHeader}>
            <div className={styles.askContentTitle}>
              Q. {ask.title}
            </div>
            <div
              className={styles.askContentOpen}
              onClick={() => toggleAsk(ask.id)}
            >
              • {openAsk === ask.id ? "닫기" : "펼치기"}
            </div>
          </div>

          </div>
          
            {/* askContentDetail, answerContent, askClose가 열릴지 여부를 상태로 관리 */}
            {openAsk === ask.id && (
                <div className={`${styles.askContentDetail} ${openAsk === ask.id ? styles.open : ""}`}>
                &nbsp;&nbsp;&nbsp;&nbsp; {ask.detail}
                <div className={styles.answerLine}></div>
                <div className={styles.answer}>
                  <div className={styles.answerContent}> A. {ask.answer}</div>
                </div>
              </div>
              
              )}
            <div className={styles.reviewLine}></div>
        </div>
      ))}
    </div>
  
    </>
  );
};

export default Preview;
