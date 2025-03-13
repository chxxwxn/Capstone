import React, { useState } from 'react';
import styles from './Faq.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Faq = () => {
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('all');

  const categories = [
    { name: '배송문의', value: 'category1' },
    { name: '교환/환불 문의', value: 'category2' },
    { name: '주문/결제 문의', value: 'category3' },
    { name: '회원문의', value: 'category4' }
  ];

  const qnaList = [
    { id: 1, category: 'category1', question: '상품은 언제 배송받을 수 있나요?', answer: '주문하신 상품은 주문 순서대로 순차 발송해드리고 있습니다.\n\n주문 후 일반 상품의 경우 보통 3~4일 정도 소요됩니다.' },
    { id: 2, category: 'category1', question: '상품/구성품이 누락되어 배송됐어요.', answer: '브랜드 및 상품에 따라 출고지가 다르기 때문에 상품을 여러 개 주문한 경우에는 각각 배송이 됩니다.\n\n동일 브랜드 상품의 일부/구성품이 누락된 경우 아래 내용을 확인하여 1:1문의로 남겨주세요.' },
    { id: 3, category: 'category1', question: '포장(택배)박스, 상품/상품 박스가 파손되어 배송됐어요.', answer: '받아보신 포장(택배) 박스 및 상품/상품 박스가 파손된 상태로 배송이 되었나요?\n\n아래 내용을 확인하여 1:1문의로 사진과 함께 남겨주세요.\n\n\n\n\■ 포장(택배) 박스 / 상품 박스 / 상품\n\n1. 전체 사진\n\n2. 파손된 부분의 사진\n\n3. 받아보신 상품이 포장(택배) 박스에 담긴 상태의 사진\n\n4. 송장이 정확하게 보이는 포장(택배) 박스 전체의 사진\n    ※ 포장(택배) 박스, 제품 포장재, 상품 등을 받은 상태 그대로 보관해 주세요.\n\n\n※ 받아보신 상태 그대로를 보관 하지 않을 경우, 파손 사고 접수 확인이 어려울 수 있습니다.' },
    { id: 4, category: 'category1', question: '배송 완료 상품을 받지 못했어요.', answer: '택배사 배송 완료 이후 상품을 받지 못했거나 분실되었다면 아래 내용을 확인하여 1:1문의로 남겨주세요.\n\n■확인 요청 사항\n\n1. 상품이 배송 완료 상태인지 확인해 주세요.\n\n2. 상품 주문 시 입력한 수령지 정보를 확인해 주세요.\n\n3. 위탁 장소(소화전, 경비실 등)에 택배가 보관되어 있는지 확인해 주세요.\n\n4. 택배사로부터 배송 완료 문자 또는 전화를 받았는지 확인해 주세요.\n\n5. 상품이 분실로 확인될 경우 재배송 또는 환불 중 희망하는 처리 방법을 알려주세요.\n\n\n※ 택배사 확인은 영업일 기준 1~2일 소요될 수 있습니다.\n\n※ 확인 과정에서 상품 수령할 경우 고객센터 또는 1:1문의로 전달 바랍니다.' },
    { id: 5, category: 'category', question: '택배사 연락처를 알고 싶어요.', answer: '택배사 고객센터 번호는 아래를 확인해 주세요. 배송조회는 해당 택배사 홈페이지 또는 앱 에서도 확인 가능 합니다.\n\n\n\nCJ대한통운 : 1588-1255\n\n롯데 : 1588-2121\n\n로젠 : 1588-9988\n\n우체국 일반 & EMS : 1588-1300\n\n한진 : 1588-0011\n\nCVSnet편의점 : 1577-1287\n\nDHL : 1588-1751\n\nGTX로지스 : 1588-1756\n\nTNT Express : 1588-0588\n\n경동 : 080-873-2178\n\n대신 : 043-255-3211' },
    { id: 6, category: 'category2', question: '상품을 여러 개 구매했는데, 일부 수량 부분 교환/반품하고 싶어요.', answer: '카테고리 2의 첫 번째 질문에 대한 답변입니다.' },
    { id: 7, category: 'category2', question: '포장 박스, 상품 박스가 파손되어 배송됐어요.', answer: '카테고리 2의 두 번째 질문에 대한 답변입니다.' },
    { id: 8, category: 'category2', question: '반품 접수는 어떻게 하나요?', answer: '카테고리 2의 세 번째 질문에 대한 답변입니다.' },
    { id: 9, category: 'category2', question: '상품을 받았는데 교환하고 싶어요.', answer: '카테고리 2의 네 번째 질문에 대한 답변입니다.' },
    { id: 10, category: 'category2', question: '환불 금액은 언제 입금 되나요?', answer: '카테고리 2의 다섯 번째 질문에 대한 답변입니다.' },
    { id: 11, category: 'category3', question: '결제 방법에는 어떤 것들이 있나요?', answer: '카테고리 3의 첫 번째 질문에 대한 답변입니다.' },
    { id: 12, category: 'category3', question: '상품을 받는 주소(배송지) 등록은 어떻게 하나요?', answer: '카테고리 3의 두 번째 질문에 대한 답변입니다.' },
    { id: 13, category: 'category3', question: '오류로 결제가 안돼요.', answer: '카테고리 3의 세 번째 질문에 대한 답변입니다.' },
    { id: 14, category: 'category3', question: '카드 영수증 및 현금영수증, 세금계산서등 신청 및 조회는 어떻게 하나요?', answer: '카테고리 3의 네 번째 질문에 대한 답변입니다.' },
    { id: 15, category: 'category3', question: '포인트와 쿠폰을 동시에 사용할 수 있나요?', answer: '카테고리 3의 다섯 번째 질문에 대한 답변입니다.' },
    { id: 16, category: 'category4', question: '회원 탈퇴는 어떻게 하나요?', answer: '카테고리 4의 첫 번째 질문에 대한 답변입니다.' },
    { id: 17, category: 'category4', question: '아이디 및 비밀번호를 변경할 수 있나요?', answer: '카테고리 4의 두 번째 질문에 대한 답변입니다.' },
    { id: 18, category: 'category4', question: '본인인증 문자가 오지 않아요?', answer: '카테고리 4의 세 번째 질문에 대한 답변입니다.' },
    { id: 19, category: 'category4', question: '회원가입은 어떻게 하나요?', answer: '카테고리 4의 네 번째 질문에 대한 답변입니다.' },
    { id: 20, category: 'category4', question: '소셜 로그인은 어떻게 이용하나요?', answer: '카테고리 4의 다섯 번째 질문에 대한 답변입니다.' }
  ];

  const [showAnswers, setShowAnswers] = useState({
    all: {},
    category1: {},
    category2: {},
    category3: {},
    category4: {}
  });

  const toggleAnswer = (item) => {
    setShowAnswers(prev => ({
      ...prev,
      [item.category]: {
        ...prev[item.category],
        [item.id]: !prev[item.category][item.id]
      }
    }));
  };

  const getQnACard = (item) => {
    return (
      <div className={styles.faqCard} key={item.id}>
        <div className={styles.faqCardTitle} onClick={() => toggleAnswer(item)}>
          <span className={styles.questionMark}>Q.</span>
          <span>{item.question}</span>
        </div>
        <div className={showAnswers[item.category] && showAnswers[item.category][item.id] ? styles.faqCardAnswer : `${styles.faqCardAnswer} ${styles.faqCardNone}`}>
          <span className={styles.answerMark}>A.</span>
          {item.answer.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const filteredQnA = qnaList.filter((item) => {
    const isMatchingCategory = category === 'all' || category === item.category;
    const isMatchingSearch = item.question.toLowerCase().includes(searchInput.toLowerCase());
    return isMatchingCategory && isMatchingSearch;
  });

  return (
    <div className={styles['back-img1']}>
      <Header />
      <div className={styles.faqContainer}>
        <h2>FAQ</h2>
        <div className={styles.faqSearchAndTabs}>
          <div className={styles.categoryTabs}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={category === cat.value ? styles.activeTab : styles.tab}
                onClick={() => setCategory(cat.value)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className={styles.faqSearch}>
            <input
              type="text"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              <img src="/icon/search1.png" alt="Search" />
            </button>
          </div>
        </div>
        <div className={styles.faqList}>
          {filteredQnA.map((item) => getQnACard(item))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Faq;
