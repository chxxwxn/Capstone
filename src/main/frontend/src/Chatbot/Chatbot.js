import React, { useEffect, useState, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';
import styles from './Chatbot.module.css';

function PersonalColorChat() {
  const [model, setModel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAwaitingImage, setIsAwaitingImage] = useState(false);
  const [isGenderMale] = useState(true);
  const [mode, setMode] = useState(null);

  const hasInitialized = useRef(false);
  const chatboxRef = useRef(null);

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
            className={styles.buttonStyle1}
            onClick={() => handleOptionSelect(1)}
          >
            스타일링 추천
          </button>
          <button
            className={styles.buttonStyle2}
            onClick={() => handleOptionSelect(2)}
          >
            퍼스널컬러 맞춤 추천
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
      addMessage('user', '스타일링 추천');
      addMessage('bot', (
        <div>
          분위기, 기온, 목적 등의 키워드를 알려주세요!<br />
          (예: 첫 데이트, 꾸안꾸)
        </div>
      ));    } else if (option === 2) {
      setMode('color');
      setIsAwaitingImage(true);
      addMessage('user', '퍼스널컬러 맞춤 추천');
      addMessage('bot', '사진을 업로드해주세요.');
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    addMessage('user', userText);
    setInputText('');

    if (mode === 'style') {
      addMessage('bot', '서비스 제작 중입니다.');
    } else if (mode === 'color') {
      addMessage('bot', '사진을 업로드해주세요.');
      setIsAwaitingImage(true);
    } else {
      const lowerText = userText.toLowerCase().replace(/\s/g, '');
      if (['퍼스널컬러', '퍼컬'].some(keyword => lowerText.includes(keyword))) {
        setMode('color');
        setIsAwaitingImage(true);
        addMessage('bot', '사진을 업로드해주세요.');
      } else {
        addMessage('bot', '먼저 옵션을 선택해 주세요.');
      }
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
        const resultComponent = getResultComponent(prediction);
        addMessage('bot', resultComponent);
        setIsAwaitingImage(false);
      } else {
        addMessage('bot', '먼저 "퍼스널컬러 맞춤 추천"을 선택해주세요.');
      }
    };
  };

  const getResultComponent = (prediction) => {
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
        <strong>당신의 퍼스널컬러는 "{resultTitle}"입니다!</strong>
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
          <div className={styles.keywordBar}>
            <button
              className={`${styles.keywordButton} ${mode === 'style' ? styles.activeButton : ''}`}
              onClick={() => handleOptionSelect(1)}
            >
              스타일링 추천
            </button>
            <button
              className={`${styles.keywordButton} ${mode === 'color' ? styles.activeButton : ''}`}
              onClick={() => handleOptionSelect(2)}
            >
              퍼스널컬러 맞춤 추천
            </button>
          </div>

          <div className={styles.inputArea}>
            <div className={styles.inputBar}>
              <label htmlFor="imageUpload" className={styles.imageUploadLabel}>
                🖼️
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInputHidden}
              />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                placeholder="메시지를 입력하세요..."
              />
              <button onClick={handleSendText} className={styles.sendButton}>
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalColorChat;
