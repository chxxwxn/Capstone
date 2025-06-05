import { createContext, useState, useEffect } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [member, setMember] = useState(null);

  useEffect(() => {
    const storedMember = sessionStorage.getItem('member');
    if (storedMember) {
      setIsLoggedIn(true);
      setMember(JSON.parse(storedMember)); // 문자열 → 객체로 변환
    }
  }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, member }}>
      {children}
    </LoginContext.Provider>
  );
};
