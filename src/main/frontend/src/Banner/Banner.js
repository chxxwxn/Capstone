import React from 'react';
import styles from './Banner.module.css';

function Banner() {
  return (
    <section className={styles.banner}>
      <img
        src="/banner.jpg"
        alt="Main Banner"
        className={styles.bannerImage}
      />
    </section>
  );
}

export default Banner;
