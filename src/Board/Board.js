import React from 'react';
import styles from './Board.module.css'; // 스타일 모듈 가져오기

const Board = () => {
  const posts = [
    { id: 1, date: '2025.01.21', image: '/image1.jpg', content: '호버하면 제목 뜨게?' },
    { id: 2, date: '2025.01.21', image: '/image2.jpg', content: '호버하면 제목 뜨게?' },
    { id: 3, date: '2025.01.21', image: '/image3.jpg', content: '호버하면 제목 뜨게?' },
    { id: 4, date: '2025.01.21', image: '/image4.jpg', content: '호버하면 제목 뜨게?' },
    { id: 5, date: '2025.01.21', image: '/image5.jpg', content: '호버하면 제목 뜨게?' },
    { id: 6, date: '2025.01.21', image: '/image6.jpg', content: '호버하면 제목 뜨게?' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>게시판</h1>
      <div className={styles.tabs}>
        <button className={styles.tab}>후기 (3)</button>
        <button className={styles.tab}>문의내역 (0)</button>
      </div>
      <div className={styles.postGrid}>
        {posts.map(post => (
          <div key={post.id} className={styles.post}>
            <div className={styles.imageContainer}>
              <img src={post.image} alt={post.content} />
              <div className={styles.overlay}>{post.content}</div>
            </div>
            <p className={styles.date}>{post.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
