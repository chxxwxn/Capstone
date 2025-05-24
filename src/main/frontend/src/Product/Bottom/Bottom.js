import React, { useState, useEffect, useContext } from 'react';
import { Icon } from '@iconify/react';
import styles from '../Product.module.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { LoginContext } from "../../Login/LoginContext";


const Preview = () => {
  const { id } = useParams(); // /all/:id 에서 id 추출
  const productId = parseInt(id);
  const [wishlist, setWishlist] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [products, setProducts] = useState([]); // API로부터 불러올 제품 데이터
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null); // 모달 이미지 상태 추가
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 가져오기 
  const { member } = useContext(LoginContext); // member 정보 가져오기
  const memberMail = member?.memberMail || '';

  const handleNavigation = (subcategory) => {
    // 현재 경로에서 마지막 슬래시 이후의 부분을 제외하고 사용
    const basePath = location.pathname.split("/")[1]; // 첫 번째 경로(segment) 가져오기
    navigate(`/${basePath}/${subcategory.toLowerCase()}`);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8090/products/${productId}`);
      const data = await response.json();
  
    // 단일 객체를 배열로 감싸서 매핑
    const mappedData = [{
      id: data.productId,
      name: data.productName,
      price: data.productPrice,
      color: data.colorCodes.split(',').map(color => color.trim()),
      date: data.registerYear,
      image: data.images,
    }];
    console.log("data from server:", data);
      setProducts(mappedData); // 매핑된 데이터를 상태에 저장
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

  const handleAddToCart = async (product) => {
    const memberMail = member?.memberMail || ''; // 로그인한 사용자 이메일
    const productId = product.id;       // 상품 ID
    const productQuantity = quantity;          // 수량 (필요시 선택 기능 추가 가능)
    const productColor = selectedColor; // 기본값 예시
    const productSize = selectedSize;        // 기본값 예시
  
    try {
      const response = await fetch("http://localhost:8090/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          memberMail,
          productId,
          productQuantity,
          productColor,
          productSize
        })
      });
  
      if (!response.ok) {
        throw new Error("서버 오류 발생");
      }
  
      const result = await response.text(); // 백에서 메시지 반환 시
  
      alert("장바구니에 담겼습니다!");
      console.log(result);
    } catch (error) {
      console.error("장바구니 담기 실패:", error);
      alert("장바구니 담기에 실패했습니다.");
    }
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
        if (!res.ok) {
          throw new Error('서버 응답 오류');
        }
        console.log(`${isWishlisted ? '삭제' : '추가'} 완료`);
      })
      .catch((err) => {
        console.error('찜 처리 중 오류:', err);
      });
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
      images: ["/outer/cardigan/CroppedKnit-b4.jpg", "/outer/cardigan/CroppedKnit-b5.jpg"] // 리뷰 사진 추가
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
          <div className={styles.categoryTitle}>BOTTOM</div>
          
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
              <a key={product.id}>
                <img src={product.image[0].imageUrl} alt={product.name} className={styles.productImage} />
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
                    {product.color.map((color, index) => {
                      const [colorCode, colorName] = color.split('-'); // '#ffffff', '블랙'
                      return (
                        <span
                          key={index}
                          className={`${styles.colorCircle} ${selectedColor === color ? styles.selectedColor : ''}`}
                          style={{ backgroundColor: colorCode }}
                          onClick={() => setSelectedColor(color)} // 저장할 값은 '#ffffff-블랙' 그대로
                        ></span>
                      );
                    })}
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
                  <button className={styles.cartButton} onClick={() => handleAddToCart(product)}>장바구니</button>
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
        {products.map((product) => (
          <>
            <img src={product.image[1].imageUrl} alt="Image 1" />
            <img src={product.image[2].imageUrl} alt="Image 2" />
            <img src={product.image[3].imageUrl} alt="Image 3" />
          </>
        ))}
      </div>
      <div className={styles.productDetail}>
        <div className={styles.productDetailInfo}>SIDE</div>
      </div>
      <div className={styles.imageGrid}>
        {products.map((product) => (
          <>
            <img src={product.image[4].imageUrl} alt="Image 4" />
            <img src={product.image[5].imageUrl} alt="Image 5" />
            <img src={product.image[6].imageUrl} alt="Image 6" />
          </>
        ))}
      </div>
      <div className={styles.productDetail}>
        <div className={styles.productDetailInfo}>BACK</div>
      </div>
      <div className={styles.imageGrid}>
        {products.map((product) => (
          <>
            <img src={product.image[7].imageUrl} alt="Image 7" />
            <img src={product.image[8].imageUrl} alt="Image 8" />
            <img src={product.image[9].imageUrl} alt="Image 9" />
          </>
        ))}
      </div>
      <div className={styles.productDetail}>
        <div className={styles.productDetailLine}></div>
        <div className={styles.productDetailInfo}>DEATAIL</div>
      </div>
      <div className={styles.imageGridDetail}>
        {products.map((product) => (
          <>
            <img src={product.image[10].imageUrl} alt="Image 10" />
            <img src={product.image[11].imageUrl} alt="Image 11" />
            <img src={product.image[12].imageUrl} alt="Image 12" />
            <img src={product.image[13].imageUrl} alt="Image 13" />
            <img src={product.image[14].imageUrl} alt="Image 14" />
            <img src={product.image[15].imageUrl} alt="Image 15" />
          </>
        ))}
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
