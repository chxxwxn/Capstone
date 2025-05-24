import React, { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import { Link, useNavigate } from 'react-router-dom';

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
  const [menuOpen, setMenuOpen] = useState(false); // 드롭다운 메뉴 열림 여부

  const navigate = useNavigate();

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('member');
    setMember(null);
    navigate('/');
    window.location.reload(); // 새로고침
  };

  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchVisible]);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedMember = sessionStorage.getItem('member');

    if (storedMember) {
      try {
        setMember(JSON.parse(storedMember));
      } catch (error) {
        console.error('JSON parsing error:', error);
        sessionStorage.removeItem('member');
      }
    } else {
      const params = new URLSearchParams(window.location.search);
      const memberParam = params.get('member');

      if (memberParam) {
        try {
          const memberData = JSON.parse(decodeURIComponent(memberParam));
          sessionStorage.setItem('member', JSON.stringify(memberData));
          setMember(memberData);
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
              <div
                className={styles.dropdownWrapper}
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button type="button" className={styles.iconButton} aria-label="마이페이지">
                  <img src="/icon/login2.png" alt="마이페이지" className={styles.icon} />
                </button>
                {menuOpen && (
                  <ul className={styles.dropdownMenu}>
                    <li>
                      <Link to="/mypage" className={styles.dropdownItem}>마이페이지</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className={styles.dropdownItem}>로그아웃</button>
                    </li>
                  </ul>
                )}
              </div>

              <Link to="/cart">
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
