import React, { useState } from "react";
import styles from "./Board.module.css";
import { Link } from "react-router-dom";
import moment from 'moment'; // moment 라이브러리 추가

const Board = () => {
  const [activeTab, setActiveTab] = useState("review");
  const [selectedType, setSelectedType] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState(null); // 선택된 날짜 범위 상태 추가

  const [posts, setPosts] = useState([
    {
      id: 1,
      date: "2025.01.21",
      image: "/padding/1-4.jpg",
      title: "패딩 최고",
      rating: 4,
      reviewText: "패딩 너무 좋아요!",
    },
    {
      id: 2,
      date: "2025.01.21",
      image: "/coat/1-5.jpg",
      title: "스타일리시 코트",
      rating: 5,
      reviewText: "코트 핏이 예술입니다.",
    },
    {
      id: 3,
      date: "2025.03.15",
      image: "/top/1-4.jpg",
      title: "편안한 상의",
      rating: 3,
      reviewText: "무난하게 입기 좋아요.",
    },
    {
      id: 4,
      date: "2024.09.20",
      image: "/top/2-4.jpg",
      title: "예쁜 티셔츠",
      rating: 4,
      reviewText: "색상이 너무 예뻐요.",
    },
  ]);

  const [inquiries, setInquiries] = useState([ // useState를 사용하여 inquiries를 관리
    {
      id: 4,
      title: "배송 문의",
      status: "답변완료",
      date: "2025.03.18",
      category: "배송",
    },
    {
      id: 3,
      title: "사이즈 문의",
      status: "",
      date: "2025.03.10",
      category: "상품",
    },
    {
      id: 2,
      title: "주문 취소",
      status: "",
      date: "2025.01.21",
      category: "주문",
    },
    {
      id: 1,
      title: "환불 요청",
      status: "",
      date: "2024.10.01",
      category: "환불",
    },
  ]);

  const [currentReview, setCurrentReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  // 날짜 필터링 함수
  const filterByDateRange = (inquiries, dateRange) => {
    if (!dateRange) return inquiries; // 날짜 범위가 선택되지 않았을 경우, 모든 문의 내역을 반환

    const today = moment();
    let startDate;

    switch (dateRange) {
      case '오늘':
        startDate = today;
        break;
      case '1주일':
        startDate = today.clone().subtract(1, 'weeks');
        break;
      case '1개월':
        startDate = today.clone().subtract(1, 'months');
        break;
      case '3개월':
        startDate = today.clone().subtract(3, 'months');
        break;
      case '6개월':
        startDate = today.clone().subtract(6, 'months');
        break;
      default:
        return inquiries; // 기본적으로 모든 문의 내역을 반환
    }

    return inquiries.filter(inquiry => {
      const inquiryDate = moment(inquiry.date, "YYYY.MM.DD");
      return inquiryDate.isSameOrAfter(startDate, 'day') && inquiryDate.isSameOrBefore(today, 'day');
    });
  };

  // 문의 내역 필터링 로직 업데이트
  const filteredInquiries = filterByDateRange(inquiries, selectedDateRange)
    .filter(inquiry => {
      if (selectedType === "전체") return true;
      return inquiry.category === selectedType;
    })
    .filter(inquiry => {
      return inquiry.title.toLowerCase().includes(searchKeyword.toLowerCase());
    });

  const handleDateRangeClick = (range) => {
    setSelectedDateRange(range);
  };

  const openPopup = (image, review) => {
    setSelectedImage(image);
    setCurrentReview(review);
    setEditingReview({ ...review });
    setIsEditing(false);
    setCharCount(review.reviewText.length);
  };

  const closePopup = () => {
    setSelectedImage(null);
    setIsEditing(false);
    setCurrentReview(null);
    setEditingReview(null);
    setCharCount(0);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const updateStarRating = (newRating) => {
    setEditingReview({ ...editingReview, rating: newRating });
  };

  const updateReviewText = (newText) => {
    if (newText.length <= 800) {
      setEditingReview({ ...editingReview, reviewText: newText });
      setCharCount(newText.length);
    }
  };

  const displayStars = (rating) => {
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return filledStars + emptyStars;
  };

  const saveChanges = () => {
    const reviewIndex = posts.findIndex((post) => post.id === currentReview.id);

    if (reviewIndex !== -1) {
      const newPosts = [...posts];
      newPosts[reviewIndex] = editingReview;

      setPosts(newPosts);
      setCurrentReview(editingReview);
    }

    setIsEditing(false);
  };

  return (
    <div className={styles.Board}>
        <div className={styles.BoardTitle}>게시판</div>
        <div className={styles.tabs}>
        <button
          className={activeTab === "review" ? styles.activeTab : ""}
          onClick={() => setActiveTab("review")}
        >
          후기 ({posts.length})
        </button>
        <button
          className={activeTab === "inquiry" ? styles.activeTab : ""}
          onClick={() => setActiveTab("inquiry")}
        >
          문의내역 ({inquiries.length})
        </button>
        {activeTab === "inquiry" && (
          <Link to="/Faq" className={styles.faqButton}>
            자주 묻는 질문 &gt;
          </Link>
        )}
      </div>

      {activeTab === "review" ? (
        <div className={styles.reviewContent}>
          <div className={styles.grid}>
            {posts.map((post) => (
              <div key={post.id} className={styles.card}>
                <p className={styles.date}>{post.date}</p>
                <div className={styles.imageWrapper}>
                  <div onClick={() => openPopup(post.image, post)}>
                    <img
                      src={post.image}
                      alt="Post"
                      className={styles.image}
                    />
                    <div className={styles.overlay}>
                      <p className={styles.hoverTitle}>{post.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.inquiryContent}>
          <div className={styles.filterContainer}>
            <div className={styles.filterType}>
              <select onChange={(e) => setSelectedType(e.target.value)}>
                <option value="전체">문의 유형</option>
                <option value="배송">배송</option>
                <option value="상품">상품</option>
                <option value="주문">주문</option>
                <option value="환불">환불</option>
              </select>
            </div>
            <div className={styles.dateFilter}>
              <button onClick={() => handleDateRangeClick('오늘')}>오늘</button>
              <button onClick={() => handleDateRangeClick('1주일')}>1주일</button>
              <button onClick={() => handleDateRangeClick('1개월')}>1개월</button>
              <button onClick={() => handleDateRangeClick('3개월')}>3개월</button>
              <button onClick={() => handleDateRangeClick('6개월')}>6개월</button>
            </div>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button>조회</button>
            </div>
          </div>
          <table className={styles.inquiryTable}>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성일</th>
                <th>유형</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{inquiry.id}</td>
                  <td>
                    {inquiry.title}
                    {inquiry.status && (
                      <span className={styles.status}>{inquiry.status}</span>
                    )}
                  </td>
                  <td>{inquiry.date}</td>
                  <td>{inquiry.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedImage && editingReview && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button onClick={closePopup} className={styles.closeButton}>
              X
            </button>
            {isEditing ? (
              <button onClick={saveChanges} className={styles.saveButton}>
                저장하기
              </button>
            ) : (
              <button onClick={handleEdit} className={styles.editButton}>
                <img src="/edit.png" alt="Edit" className={styles.editIcon} />
              </button>
            )}
            <h2 className={styles.popupTitle}>REVIEW</h2>
            {isEditing ? (
              <>
                <div className={styles.starRating}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <span
                      key={rating}
                      onClick={() => updateStarRating(rating)}
                      style={{
                        cursor: "pointer",
                        color: rating <= editingReview.rating ? "#ff9800" : "gray",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>
                    상품명 : 2WAY HOOD DOWN JACKET
                  </div>
                  <div className={styles.productDetails}>
                    상품정보 사이즈 색상
                  </div>
                </div>
                <div className={styles.imageContainer}>
                  <img src={selectedImage} alt="Popup Image" />
                  <img src={selectedImage} alt="Popup Image" />
                </div>
                <textarea
                  className={styles.reviewTextarea}
                  value={editingReview.reviewText}
                  onChange={(e) => {
                    if (e.target.value.length <= 800) {
                      updateReviewText(e.target.value);
                      setCharCount(e.target.value.length);
                    }
                  }}
                  maxLength="800"
                />
                <div className={styles.charCount}>
                  {charCount}/800
                </div>
              </>
            ) : (
              <>
                <div className={styles.starRating}>
                  {displayStars(editingReview.rating)}
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>
                    상품명 : 2WAY HOOD DOWN JACKET
                  </div>
                  <div className={styles.productDetails}>
                    상품정보 사이즈 색상
                  </div>
                </div>
                <div className={styles.imageContainer}>
                  <img src={selectedImage} alt="Popup Image" />
                </div>
                <div className={styles.reviewText}>
                  {editingReview.reviewText}
                </div>
              </>
            )}

            <div className={styles.dateAndUser}>
              2025.01.21 <br />
              이*채
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
