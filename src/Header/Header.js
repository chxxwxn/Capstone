import React, { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom'; // react-router-dom 임포트

function Header() {
  const categories = {
    ALL: [],
    OUTER: ['Padding', 'Jacket', 'Coat', 'Cardigan'],
    TOP: ['MTM', 'Hoodie', 'Knit', 'Shirts', 'Tee'],
    BOTTOM: ['Denim', 'Skirt', 'Pants'],
    ETC: ['Ring'],
  };

  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef(null);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchVisible]);

  return (
    <header className={styles.header}>
      <Link to="/"> {/* Link 컴포넌트로 감싸기 */}
        <div className={styles.logo}>
          <img src="/logo.png" alt="F.M. Logo" className={styles.logoImage} />
        </div>
      </Link>

      {/* 📌 카테고리 네비게이션 */}
      <nav
        className={styles.categoryNav}
        onMouseEnter={() => setHoveredCategory(true)}
        onMouseLeave={() => setHoveredCategory(false)}
      >
        <ul className={styles.categoryList}>
          {Object.keys(categories).map((category, index) => (
            <li key={index} className={styles.categoryItem}>
              <Link to={`/${category.toLowerCase()}`} className={styles.categoryLink}>
                {category}
              </Link>
              {hoveredCategory && categories[category].length > 0 && (
                <div className={styles.categoryDropdown}>
                  <ul>
                    {categories[category].map((sub, subIndex) => (
                      <li key={subIndex}>
                      {/* ✅ 서브 카테고리 링크 추가 */}
                      <Link
                        to={`/${category.toLowerCase()}/${sub.toLowerCase()}`}
                        className={styles.categoryDropdownui}
                      >
                        {sub}
                      </Link>
                    </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* 아이콘 영역 */}
      <nav className={styles.nav}>
        <div className={styles.searchContainer}>
          {/* Wrap search button and input */}
          <button
            className={`${styles.iconButton} ${styles.searchButton}`}
            aria-label="검색"
            onClick={toggleSearch}
          >
            <img src="/icon/search1.png" alt="검색" className={styles.icon} />
          </button>
          {searchVisible && (
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
              ref={searchInputRef}
            />
          )}
        </div>
        <Link to="/login">
          {/* Link 컴포넌트로 감싸기 */}
          <button className={styles.iconButton} aria-label="로그인">
            <img src="/icon/login1.png" alt="로그인" className={styles.icon} />
          </button>
        </Link>
        <button className={styles.iconButton} aria-label="장바구니">
          <img src="/icon/cart1.png" alt="장바구니" className={styles.icon} />
        </button>
        <button className={styles.iconButton} aria-label="채팅">
          <img src="/icon/chat1.png" alt="채팅" className={styles.icon} />
        </button>
      </nav>
    </header>
  );
}

export default Header;
