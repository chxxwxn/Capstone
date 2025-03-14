import React, { useState } from "react";
import styles from "./Board.module.css";

const Board = () => {
  const [activeTab, setActiveTab] = useState("review"); // 현재 활성화된 탭 상태

  const posts = [
    { id: 1, date: "2025.01.21", image: "/padding/1-4.jpg" },
    { id: 2, date: "2025.01.21", image: "/coat/1-5.jpg" },
    { id: 3, date: "2025.01.21", image: "/top/1-4.jpg" },
    { id: 4, date: "2025.01.21", image: "/top/2-4.jpg" },
    { id: 5, date: "2025.01.21", image: "/top/2-5.jpg" },
    { id: 6, date: "2025.01.21", image: "/padding/1-5.jpg" },
  ];

  return (
    <div className={styles.board}>
      <h1 className={styles.title}>게시판</h1>
      <div className={styles.tabs}>
        <button
          className={activeTab === "review" ? styles.activeTab : ""}
          onClick={() => setActiveTab("review")}
        >
          후기 ({posts.length}) {/* 후기 갯수를 posts 배열 길이로 표시 */}
        </button>
        <button
          className={activeTab === "inquiry" ? styles.activeTab : ""}
          onClick={() => setActiveTab("inquiry")}
        >
          문의내역 (0)
        </button>
      </div>
      {activeTab === "review" ? (
        <div className={styles.grid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.card}>
              <p className={styles.date}>{post.date}</p>
              <img src={post.image} alt="Post" className={styles.image} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>문의내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Board;
