import React, { useEffect, useState } from 'react';
import styles from './Main.module.css';
import Footer from '../Footer/Footer'; // Footer 불러오기

function Main() {
  const products = [
    { id: 1, name: '2WAY HOOD DOWN JACKET', image: '/padding/1-1.jpg' },
    { id: 2, name: 'CROPPED KNIT CARDIGAN', image: '/cardigan/1-1.jpg' },
    { id: 3, name: 'WOOL FISHERMAN KNIT CARDIGAN', image: '/top/2-1.jpg' },
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
    <div className={styles.container}> {/* Wrap content in a container */}
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
        <section className={`${styles.bestProducts} ${scrollY > 300 ? styles.visible : ''}`}>
          <h2>BEST</h2>
          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.product}>
                <div className={styles.productImageWrapper}>
                  <img src={product.image} alt={product.name} />
                  <div className={styles.productOverlay}>
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
            <img className={styles.ad1} src="/ad/1.jpg" alt="ad1" />
            <img className={styles.ad2} src="/ad/2.jpg" alt="ad2" />
            <img className={styles.ad3} src="/ad/3.jpg" alt="ad3" />
            <img className={styles.ad4} src="/ad/4.jpg" alt="ad4" />
            <img className={styles.ad5} src="/ad/5.jpg" alt="ad5" />
            <img className={styles.ad6} src="/ad/6.jpg" alt="ad6" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Main;
