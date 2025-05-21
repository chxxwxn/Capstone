import React, { useEffect, useState } from 'react';
import styles from './Main.module.css';
import Footer from '../Footer/Footer'; // Footer 불러오기

function Main() {
  const products = [
    { id: 1, name: '2WAY HOOD\nDOWN JACKET', image: '/padding/1-1.jpg' },
    { id: 2, name: 'CROPPED\nKNIT CARDIGAN', image: '/cardigan/1-1.jpg' },
    { id: 3, name: 'WOOL\nFISHERMAN KNIT CARDIGAN', image: '/top/2-1.jpg' },
    { id: 4, name: 'VELVET HOOD ZIP-UP', image: '/top/1-1.jpg' },
  ];

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* 📌 카테고리 섹션 추가 */}

        {/* Fit Mood 섹션 */}
        <section className={`${styles.fitMood} ${scrollY > 100 ? styles.visible : ''}`}>
          <h1>
            <div className={styles.fit}>
              <span>Fit</span>
            </div>
            <div className={styles.mood}>
              <span>Mood</span>
            </div>
          </h1>
          <div className={styles.detail}>
            <span>패션의 정석</span>
            <br />
            <span>분위기에 알맞은</span>
          </div>
        </section>

        {/* Best Products 섹션 */}
        <section className={`${styles.bestProducts} ${scrollY > 300 ? styles.visible : ''}`}> {/* 스크롤 효과 유지 */}
          <h2>BEST</h2>
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.product}>
                <div className={styles.productImageWrapper}>
                  <img src={product.image} alt={product.name} />
                  <div className={styles.productOverlay}> {/* 호버 효과는 그대로 유지 */}
                    <p className={styles.productName}>{product.name}</p>
                    <button className={styles.buyNow}>BUY NOW</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Responsibility 섹션 */}
        <section className={`${styles.brandResponsibility} ${scrollY > 600 ? styles.visible : ''}`}>
          <div className={styles.brandImages}>
            <img className={styles.ad} src="../ad/ad.png" alt="ad" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Main;