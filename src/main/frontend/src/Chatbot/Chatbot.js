import React, { useEffect, useState, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import styles from './Chatbot.module.css';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

function PersonalColorChat() {
  const [model, setModel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAwaitingImage, setIsAwaitingImage] = useState(false);
  const [isGenderMale] = useState(true);
  const [personalColor, setPersonalColor] = useState(null);
  const [products, setProducts] = useState([]); // API로부터 불러올 제품 데이터
const [inputValue, setInputValue] = useState('');

  const hasInitialized = useRef(false);
  const chatboxRef = useRef(null);

  const [mode, setMode] = useState('default'); 
  const [placeholder, setPlaceholder] = useState('메시지를 입력해주세요');

  const startFreeChat = () => {
  setMode('gpt');
  setPlaceholder("자유채팅을 끝내려면 '자유채팅 끝내기'를 입력해주세요");
};



  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const loadModel = async () => {
      const modelURL = `${process.env.PUBLIC_URL}/models/model.json`;
      const metadataURL = `${process.env.PUBLIC_URL}/models/metadata.json`;
      try {
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
      } catch (error) {
        console.error("모델 로드 실패:", error);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    addMessage('bot', (
      <div>
        어떤 서비스를 원하시나요?
        <div className={styles.optionContainer}>
          <button
            className={styles.buttonStyle}
            onClick={() => handleOptionSelect(1)}
          >
            상황별 스타일링 추천
          </button>
          <button
            className={styles.buttonStyle}
            onClick={() => handleOptionSelect(2)}
          >
            퍼스널컬러 맞춤 추천
          </button>
          <button
            className={styles.buttonStyle}
            onClick={() => handleOptionSelect(3)}
          >
            자유 채팅
          </button>
        </div>
      </div>
    ));
  }, []);

  

  const addMessage = (sender, content, isImage = false) => {
    setMessages((prev) => [...prev, { sender, content, isImage }]);
  };

  const handleOptionSelect = (option) => {
    if (option === 1) {
      setMode('style');
      setIsAwaitingImage(false);
       setPlaceholder('메시지를 입력해주세요');
      addMessage('user', '스타일링 추천');
      addMessage('bot', (
        <div>
          분위기, 기온, 목적 등의 키워드를 알려주세요!<br />
          (예: 첫 데이트, 꾸안꾸)
        </div>
      ));    } else if (option === 2) {
      setMode('color');
      setIsAwaitingImage(true);
       setPlaceholder('메시지를 입력해주세요');
      addMessage('user', '퍼스널컬러 맞춤 추천');
      addMessage('bot', '사진을 업로드해주세요.');
    } else if (option === 3) {  // 여기 옵션 3 추가
      setMode('gpt');
      setIsAwaitingImage(false);
      addMessage('user', '자유채팅 모드 선택');
       startFreeChat();
      addMessage('bot', '무엇이든 물어보세요! 자유롭게 대화할 수 있어요.');
      
      
    } else {
    setMode('default');  // 자유채팅 아니면 기본 모드
    setPlaceholder('메시지를 입력해주세요');
  }
  };

  const knownStyleKeywords = ['꾸안꾸', '데이트', '댄디']; // 현재 DB에 있는 키워드들


  const renderModeOptions = (modesToShow) => (
  <div className={styles.optionContainer}>
    {modesToShow.includes('style') && (
      <button
        className={styles.buttonStyle}
        onClick={() => handleOptionSelect(1)}
      >
        상황별 스타일링 추천
      </button>
    )}
    {modesToShow.includes('color') && (
      <button
        className={styles.buttonStyle}
        onClick={() => handleOptionSelect(2)}
      >
        퍼스널컬러 맞춤 추천
      </button>
    )}
    {modesToShow.includes('gpt') && (
      <button
        className={styles.buttonStyle}
        onClick={() => handleOptionSelect(3)}
      >
        자유 채팅
      </button>
    )}
  </div>
);



 const handleSendText = async (text) => {
  const userText = text?.trim() || inputValue.trim();  // inputValue 사용
  if (!userText) return;
  addMessage('user', userText);
  setInputValue('');

    // 스타일 추천 기능
    if (mode === 'style') {
      const matchedKeywords = knownStyleKeywords.filter(keyword => userText.includes(keyword));

      if (matchedKeywords.length > 0) {
        try {
          const response = await fetch(`http://localhost:8090/products`);
          const data = await response.json();

          const filtered = data.filter(item =>
            item.productStyles &&
            matchedKeywords.every(keyword => item.productStyles.includes(keyword))
          );

          const mappedData = filtered.map(item => ({
            id: item.productId,
            name: item.productName,
            image: item.imageUrl,
          }));

          setProducts(mappedData);

          if (mappedData.length > 0) {
          // 텍스트 말풍선
          addMessage('bot', (
            <>
              <div className={styles.styleRe}>
                <strong className={styles.keywords}>{`"${matchedKeywords.join(', ')}"`}</strong>
                <span className={styles.styleRetext}> 스타일에 맞는 추천 옷이에요!</span>
              </div>

              <div className={styles.productList}>
                {[...mappedData]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3)
                  .map((product) => (
                    <div key={product.id} className={styles.product}>
                      <Link to={`/all/${product.id}`}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className={styles.productImage} 
                        />
                      </Link>
                    </div>
                  ))}
              </div>
            </>
          ));


          // 스타일 추천 메시지 다음에 안내 추가
          addMessage('bot', (
            <div>
              계속 스타일을 추천받고 싶다면 키워드를 입력해 주세요.<br />
              다른 서비스를 원하시면 아래 버튼을 눌러주세요.
              {renderModeOptions(['color', 'gpt'])}
            </div>
          ));


          } else {
            addMessage('bot', `"${matchedKeywords.join(', ')}" 스타일에 맞는 상품이 아직 없습니다.`);
          }

        } catch (error) {
          console.error("상품 데이터를 불러오는 중 오류 발생:", error);
          addMessage('bot', '상품 데이터를 불러오는 데 실패했습니다.');
        }
      } else {
        addMessage('bot', '스타일 키워드를 잘 인식하지 못했어요 😢 다시 입력해 주세요! (예: 꾸안꾸, 데이트)');
      }

    // 퍼스널컬러 모드일 때
    } else if (mode === 'color') {
      addMessage('bot', '사진을 업로드해주세요.');
      setIsAwaitingImage(true);

      addMessage('bot', (
        <div>
          계속 추천을 받으시려면 이미지를 업로드해 주세요.<br />
          다른 서비스를 원하시면 아래 버튼을 눌러주세요.
          {renderModeOptions(['style', 'gpt'])}
        </div>
      ));


    // 일반 대화 (OpenAI)
    } else if (mode === 'gpt') {
  // 자유채팅 종료 명령어 처리
  if (userText === '자유채팅 끝내기') {
    setMode('default');
    setInputText('');
    addMessage('bot', (
      <div>
        자유채팅을 종료했어요. 😊<br />
        다른 서비스를 원하시면 아래 버튼을 눌러주세요.
        {renderModeOptions(['style', 'color', 'gpt'])}
      </div>
    ));
     setPlaceholder('메시지를 입력해주세요');
    return;
  }
      try {
        const res = await fetch('http://localhost:8090/api/chat/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText })
        });
        const data = await res.text();
        addMessage('bot', data);
      } catch (err) {
        console.error("GPT 대화 중 오류:", err);
        addMessage('bot', '죄송합니다. 챗봇 응답에 문제가 발생했어요.');
      }
    } else {
      addMessage('bot', '먼저 옵션을 선택해 주세요.');
    }
  };


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    addMessage('user', img.src, true);

    img.onload = async () => {
      if (!model) return;
      if (mode === 'color') {
        const prediction = await model.predict(img);

        const sorted = prediction.sort((a, b) => b.probability - a.probability);
        const top = sorted[0];

        const getPersonalColor = (className) => {
          switch (className) {
            case 'spring': return 'springWarm';
            case 'summer': return 'summerCool';
            case 'fall': return 'autumnWarm';
            case 'winter': return 'winterCool';
            default: return 'unknown';
          }
        };

        const personalColor = getPersonalColor(top.className);
        setPersonalColor(personalColor); // 이게 비동기적이므로 기다릴 필요 있음

        // 결과 메시지는 상품이 로드되고 난 뒤에 보여줌
        const getResultAndShow = async () => {
          try {
            const response = await fetch(`http://localhost:8090/products/color/${personalColor}`);
            const data = await response.json();

            const mappedData = data.map(item => ({
              id: item.productId,
              name: item.productName,
              image: item.imageUrl,
            }));

            setProducts(mappedData);

            const resultComponent = getResultComponent(prediction, mappedData);
            addMessage('bot', resultComponent);
          } catch (error) {
            console.error("추천 상품 불러오기 실패:", error);
            addMessage('bot', '상품 추천 정보를 불러오지 못했습니다.');
          }
        };

        await getResultAndShow();
        setIsAwaitingImage(false);

        addMessage('bot', (
        <div>
          계속 추천을 받으시려면 이미지를 업로드해 주세요.<br />
          다른 서비스를 원하시면 아래 버튼을 눌러주세요.
          {renderModeOptions(['style', 'gpt'])}
        </div>
      ));
      }
    };
  };

  const getResultComponent = (prediction, products) => {
    const sorted = prediction.sort((a, b) => b.probability - a.probability);
    const top = sorted[0];

    const getToneName = (className) => {
      switch (className) {
        case 'spring': return '봄 웜톤';
        case 'summer': return '여름 쿨톤';
        case 'fall': return '가을 웜톤';
        case 'winter': return '겨울 쿨톤';
        default: return '알 수 없음';
      }
    };

    const resultTitle = getToneName(top.className);

    return (
      <div>
        <div className={styles.styleRe}>
          <span className={styles.styleRe}> 당신의 퍼스널컬러는</span>
            <strong className={styles.keywords}>"{resultTitle}"</strong>
            <span className={styles.styleRe}> 입니다!</span>
          </div>
        <div style={{ marginTop: '10px' }}>
          {sorted.map((pred, index) => {
            const toneName = getToneName(pred.className);
            const percentage = (pred.probability * 100).toFixed(2);
            return (
              <div key={index} style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.9em', marginBottom: '2px' }}>{toneName}: {percentage}%</div>
                <div style={{
                  height: '8px',
                  background: '#eee',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background:
                      pred.className === 'spring' ? '#f9c74f' :
                      pred.className === 'summer' ? '#90be6d' :
                      pred.className === 'fall' ? '#f9844a' :
                      pred.className === 'winter' ? '#577590' :
                      '#ccc'
                  }} />
                </div>
              </div>
            );
          })}
          
        </div>
        <div className={styles.recommendedClothes}>
          <h3>{getToneName(top.className)}에 맞는 추천 옷</h3>
          <div className={styles.productList}>
            {[...products]
              .sort(() => Math.random() - 0.5) // 랜덤으로 섞고
              .slice(0, 3) // 앞에서 3개만 선택
              .map((product) => (
                <div key={product.id} className={styles.product}>
                  <Link to={`/all/${product.id}`}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={styles.productImage} 
                    />
                  </Link>
                </div>
            ))}
          </div>
        </div>
        
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>스타일 서포터</div>

      <div className={styles.inputAreaWrapper}>
        <div className={styles.chatbox} ref={chatboxRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.sender === 'user' ? styles.userMsg : styles.botMsg}>
              {msg.isImage ? (
                <img src={msg.content} alt="uploaded" className={styles.imageMsg} />
              ) : typeof msg.content === 'string' ? (
                <p>{msg.content}</p>
              ) : (
                msg.content
              )}
            </div>
          ))}
        </div>

        <div className={styles.inputcontatiner}>
          
          <div className={styles.inputArea}>
            <div className={styles.inputBar}>
              
              <input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendText();
                }}
                 
              />
              <button onClick={() => handleSendText()} className={styles.sendButton}>
              <Icon icon="ri:arrow-up-line" className={styles.sendIcon} />
            </button>

              <label htmlFor="imageUpload" className={styles.imageUploadLabel}>
                 <Icon icon="material-symbols:photo-sharp" className={styles.imageIcon} />
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInputHidden}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalColorChat;