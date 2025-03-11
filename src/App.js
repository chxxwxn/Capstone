import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './Main/Main';
import Login from './Login/Login';
import Header from './Header/Header';
import Banner from './Banner/Banner';
import Footer from './Footer/Footer';
import Password from './Login/Password';
import findPw from './Login/findPw';
import Join from './Login/Join';
import Join2 from './Login/Join2';
import MyPage from './MyPage/Mypage';
import Pre from './ProductPre/Pre';
import Padding from './Product/Padding';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<><Banner /><Main /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/Password" element={<Password />} />
        <Route path="/Join" element={<Join />} />
        <Route path="/Join2" element={<Join2 />} />
        <Route path="/findPw" element={<findPw />} />
        <Route path="/Mypage" element={<MyPage />} />
        <Route path="/Padding/:id" element={<Padding />} />
        <Route path="/Padding" element={<Pre />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
