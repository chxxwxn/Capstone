import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2025 Your Company Name. All rights reserved.</p>
      <p>Contact Us: jennyq02@naver.com | Phone: +82-10-9220-0057</p>
      <p>Follow Us: <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">Instagram</a></p>
      <p>Address: 1234 Your Street, Your City, Your Country</p>
      <p>Terms of Service | Privacy Policy</p>
    </footer>
  );
}

export default Footer;
