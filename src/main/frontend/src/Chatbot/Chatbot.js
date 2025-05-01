import React, { useEffect, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import styles from './Chatbot.module.css';

function PersonalColorChat() {
  const [model, setModel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAwaitingImage, setIsAwaitingImage] = useState(false);
  const [isGenderMale] = useState(true);

  useEffect(() => {
    const chatbox = document.querySelector(`.${styles.chatbox}`);
    chatbox.scrollTop = chatbox.scrollHeight;
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

  const addMessage = (sender, content, isImage = false) => {
    setMessages((prev) => [...prev, { sender, content, isImage }]);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    addMessage('user', userText);
    setInputText('');
  
    const lowerText = userText.toLowerCase().replace(/\s/g, '');
    if (['퍼스널컬러', '퍼컬'].some(keyword => lowerText.includes(keyword))) {
      addMessage('bot', '사진을 업로드해주세요.');
      setIsAwaitingImage(true);
    } else {
      addMessage('bot', '죄송해요, "퍼스널컬러"라고 입력해 주세요.');
    }
  };
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !model) return;

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    addMessage('user', img.src, true);

    img.onload = async () => {
      const prediction = await model.predict(img);
      const resultComponent = getResultComponent(prediction);
      addMessage('bot', resultComponent);
      setIsAwaitingImage(false);
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
      <div className={styles.header}>퍼스널컬러 챗봇</div>

      <div className={styles.chatbox}>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === 'user' ? styles.userMsg : styles.botMsg}>
            {msg.isImage ? (
              <img src={msg.content} alt="uploaded" className={styles.imageMsg} />
            ) : typeof msg.content === 'string' ? (
              <p>{msg.content}</p>
            ) : (
              msg.content // JSX 형태 메시지 렌더링
            )}
          </div>
        ))}
      </div>

      {isAwaitingImage && (
        <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.fileInput} />
      )}

      <div className={styles.inputArea}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={handleSendText}>전송</button>
      </div>
    </div>
  );
}

export default PersonalColorChat;
