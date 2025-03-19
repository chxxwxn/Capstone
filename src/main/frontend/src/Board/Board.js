import React, { useState } from "react";
import styles from "./Board.module.css";
import { Link } from "react-router-dom"; // Link 컴포넌트 import

const Board = () => {
  const [activeTab, setActiveTab] = useState("review");
  const [selectedType, setSelectedType] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");

  const posts = [
    { id: 1, date: "2025.01.21", image: "/padding/1-4.jpg", title: "패딩 최고" },
    { id: 2, date: "2025.01.21", image: "/coat/1-5.jpg", title: "스타일리시 코트" },
    { id: 3, date: "2025.01.21", image: "/top/1-4.jpg", title: "편안한 상의" },
    { id: 4, date: "2025.01.21", image: "/top/2-4.jpg", title: "예쁜 티셔츠" },
  ];

  const inquiries = [
    { id: 4, title: "배송 문의", status: "답변완료", date: "2025.01.21", category: "배송" },
    { id: 3, title: "사이즈 문의", status: "", date: "2025.01.21", category: "상품" },
    { id: 2, title: "주문 취소", status: "", date: "2025.01.21", category: "주문" },
    { id: 1, title: "환불 요청", status: "", date: "2025.01.21", category: "환불" },
  ];

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (selectedType === "전체") return true;
    return inquiry.category === selectedType;
  }).filter((inquiry) => {
    return inquiry.title.toLowerCase().includes(searchKeyword.toLowerCase());
  });

  return (
    <div className={styles.board}>
      <h1 className={styles.title}>게시판</h1>
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
        {/* FAQ 버튼 추가 */}
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
                  <img src={post.image} alt="Post" className={styles.image} />
                  <div className={styles.overlay}>
                    <p className={styles.hoverTitle}>{post.title}</p>
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
              <button>오늘</button>
              <button>1주일</button>
              <button>1개월</button>
              <button>3개월</button>
              <button>6개월</button>
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
    </div>
  );
};

export default Board;
