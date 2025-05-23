import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './Main/Main';
import Main2 from './Main/Main2';
import Login from './Login/Login';
import Header from './Header/Header';
import Banner from './Banner/Banner';
import Footer from './Footer/Footer';
import Password from './Login/Password';
import FindPw from './Login/findPw';
import FindPw2 from './Login/FindPw2';
import Join from './Login/Join';
import Join2 from './Login/Join2';
import MyPage from './MyPage/Mypage';
import Board from './Board/Board'; 
import Faq from './Board/Faq';  
import InfoEdit from './MyPage/InfoEdit';  
import Coupon from './MyPage/Coupon';
import SavingRate from './MyPage/Saving&Rate';
import OrderHistory from './MyPage/OrderHistory';

import Payment from './Payment/Payment';

/*outer*/
import PaddingPre from './ProductPre/OuterPre/PaddingPre';
import Padding from './Product/Outer/Padding';
import JacketPre from './ProductPre/OuterPre/JacketPre';
import Jacket from './Product/Outer/Jacket';
import CoatPre from './ProductPre/OuterPre/CoatPre';
import Coat from './Product/Outer/Coat';
import CardiganPre from './ProductPre/OuterPre/CardiganPre';
import Cardigan from './Product/Outer/Cardigan';
/* top */
import HoodiePre from './ProductPre/TopPre/HoodiePre';
import Hoodie from './Product/Top/Hoodie';
import KnitPre from './ProductPre/TopPre/KnitPre';
import Knit from './Product/Top/Knit';
import MTMPre from './ProductPre/TopPre/MTMPre';
import MTM from './Product/Top/MTM';
import Shirts from './Product/Top/Shirts';
import ShirtsPre from './ProductPre/TopPre/ShirtsPre';
import TeePre from './ProductPre/TopPre/TeePre';
import Tee from './Product/Top/Tee';
/*pants*/
import DenimPre from './ProductPre/BottomPre/DenimPre';
import Denim from './Product/Bottom/Denim';
import PantsPre from './ProductPre/BottomPre/PantsPre';
import Pants from './Product/Bottom/Pants';
import SkirtPre from './ProductPre/BottomPre/SkirtPre';
import Skirt from './Product/Bottom/Skirt';
/*Etc*/
import EtcPre from './ProductPre/EtcPre/EtcPre';
import Etc from './Product/Etc/Etc';
import RingPre from './ProductPre/EtcPre/RingPre';
import Ring from './Product/Etc/Ring';
/*All*/
import AllPre from './ProductPre/AllPre/AllPre';
import All from './Product/All/All';
import OuterPre from './ProductPre/OuterPre/OuterPre';
import Outer from './Product/Outer/Outer';
import TopPre from './ProductPre/TopPre/TopPre';
import Top from './Product/Top/Top';
import BottomPre from './ProductPre/BottomPre/BottomPre';
import Bottom from './Product/Bottom/Bottom';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<><Banner /><Main /></>} />
        <Route path="/Main2" element={<><Banner /><Main2 /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/Password" element={<Password />} />
        <Route path="/Join" element={<Join />} />
        <Route path="/Join2" element={<Join2 />} />
        <Route path="/FindPw" element={<FindPw />} />
        <Route path="/FindPw2" element={<FindPw2 />} />
        <Route path="/Mypage" element={<MyPage />} />
        <Route path="/Board" element={<Board />} />
        <Route path="/Faq" element={<Faq />} />
        <Route path="/Mypage/InfoEdit" element={<InfoEdit />} />
        <Route path="/Mypage/Coupon" element={<Coupon />} />
        <Route path="/Mypage/Saving&Rate" element={<SavingRate />} />
        <Route path="/Mypage/OrderHistory" element={<OrderHistory />} />

        <Route path="/Payment" element={<Payment />} />
        /* All */
                <Route path="/all" element={<AllPre />} />
                <Route path="/all/:id" element={<All />} />     
        
                /*OUTER*/
                <Route path="/outer" element={<OuterPre />} />
                <Route path="/outer/:id" element={<Outer />} />
                <Route path="outer/Padding" element={<PaddingPre />} />
                <Route path="outer/Padding/:id" element={<Padding />} />
                <Route path="outer/Jacket" element={<JacketPre />} />
                <Route path="outer/Jacket/:id" element={<Jacket />} />
                <Route path="outer/Coat" element={<CoatPre />} />
                <Route path="outer/Coat/:id" element={<Coat />} />
                <Route path="outer/Cardigan" element={<CardiganPre />} />
                <Route path="outer/Cardigan/:id" element={<Cardigan />} />
        
                /* top */
                <Route path="/top" element={<TopPre />} />
                <Route path="/top/:id" element={<Top />} />
                <Route path="top/hoodie" element={<HoodiePre />} />
                <Route path="top/hoodie/:id" element={<Hoodie />} />
                <Route path="top/knit" element={<KnitPre />} />
                <Route path="top/knit/:id" element={<Knit />} />
                <Route path="top/mtm" element={<MTMPre />} />
                <Route path="top/mtm/:id" element={<MTM />} />
                <Route path="top/shirts" element={<ShirtsPre />} />
                <Route path="top/shirts/:id" element={<Shirts />} />
                <Route path="top/tee" element={<TeePre />} />
                <Route path="top/tee/:id" element={<Tee />} />
        
                /*Bottom*/
                <Route path="/bottom" element={<BottomPre />} />
                <Route path="/bottom/:id" element={<Bottom />} />
                <Route path="bottom/denim" element={<DenimPre />} />
                <Route path="bottom/denim/:id" element={<Denim />} />
                <Route path="bottom/pants" element={<PantsPre />} />
                <Route path="bottom/pants/:id" element={<Pants />} />
                <Route path="bottom/skirt" element={<SkirtPre />} />
                <Route path="bottom/skirt/:id" element={<Skirt />} />
        
                /*Etc*/
                <Route path="/etc" element={<EtcPre />} />
                <Route path="/etc/:id" element={<Etc />} />
                <Route path="etc/ring" element={<RingPre />} />
                <Route path="etc/ring/:id" element={<Ring />} />
        
      </Routes>
      <Footer />
    </>
  );
}

export default App;
