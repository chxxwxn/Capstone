import React, { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

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
  const [isFixed, setIsFixed] = useState(false);
  const [member, setMember] = useState(null);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchVisible]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 로그인 상태 확인 (sessionStorage에서 member 정보 가져오기)
  useEffect(() => {
    // 1️⃣ 기존 `sessionStorage`에서 member 정보 가져오기
    const storedMember = sessionStorage.getItem('member');

    if (storedMember) {
        try {
            setMember(JSON.parse(storedMember)); // JSON 변환
        } catch (error) {
            console.error('JSON parsing error:', error);
            sessionStorage.removeItem('member'); // 오류 발생 시 데이터 삭제
        }
    } else {
        // 2️⃣ URL에 `member` 정보가 있는지 확인 (카카오 로그인 후 리다이렉트 시)
        const params = new URLSearchParams(window.location.search);
        const memberParam = params.get('member');

        if (memberParam) {
            try {
                const memberData = JSON.parse(decodeURIComponent(memberParam));
                sessionStorage.setItem('member', JSON.stringify(memberData)); // 세션에 저장
                setMember(memberData); // 상태 업데이트
            } catch (error) {
                console.error('Failed to parse member data:', error);
            }
        }
    }
}, []);

  return (
    <header className={`${styles.header} ${isFixed ? styles.fixed : ''}`}>
      <div className={styles.headerContent}>
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

        <Link to="/" className={styles.logo}>
          <img src="/logo.png" alt="F.M. Logo" className={styles.logoImage} />
        </Link>

        <nav className={styles.nav}>
          <div className={`${styles.searchContainer} ${searchVisible ? styles.open : ''}`}>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.searchButton}`}
              aria-label="검색"
              onClick={toggleSearch}
            >
              <img src="/icon/search1.png" alt="검색" className={styles.icon} />
            </button>
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
              ref={searchInputRef}
            />
          </div>
          {member ? (
            <>
              <Link to="/mypage">
                <button type="button" className={styles.iconButton} aria-label="로그인">
                  <img src="/icon/login2.png" alt="로그인" className={styles.icon} />
                </button>
              </Link>
              <Link to="/Cart">
                <button type="button" className={styles.iconButton} aria-label="장바구니">
                  <img src="/icon/cart2.png" alt="장바구니" className={styles.icon} />
                </button>
              </Link>
              <Link to="">
                <button type="button" className={styles.iconButton} aria-label="채팅">
                  <img src="/icon/chat2.png" alt="채팅" className={styles.icon} />
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <button type="button" className={styles.iconButton} aria-label="로그인">
                  <img src="/icon/login1.png" alt="로그인" className={styles.icon} />
                </button>
              </Link>
              <Link to="/cart">
                <button type="button" className={styles.iconButton} aria-label="장바구니">
                  <img src="/icon/cart1.png" alt="장바구니" className={styles.icon} />
                </button>
              </Link>
              <Link to="">
                <button type="button" className={styles.iconButton} aria-label="채팅">
                  <img src="/icon/chat1.png" alt="채팅" className={styles.icon} />
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
