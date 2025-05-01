import React, { useEffect, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import styles from './Chatbot.module.css'; // CSS 모듈로 임포트

function PersonalColor() {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // 미리보기 이미지 URL 상태 추가
  const [isGenderMale, setIsGenderMale] = useState(true); // 성별 상태 추가

  useEffect(() => {
    const loadModel = async () => {
      const modelURL = `${process.env.PUBLIC_URL}/models/model.json`; // 모델 경로
      const metadataURL = `${process.env.PUBLIC_URL}/models/metadata.json`; // 메타데이터 경로

      try {
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
      } catch (error) {
        console.error("모델 로드 실패:", error);
      }
    };

    loadModel();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && model) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      setImageUrl(img.src); // 이미지 URL 상태 업데이트
      img.onload = async () => {
        const predictionResult = await model.predict(img);
        setPrediction(predictionResult);
      };
    }
  };

  const getResult = (className) => {
    let resultTitle, resultExplain;
    if (isGenderMale) {
      switch (className) {
        case "spring":
          resultTitle = "봄 웜톤";
          break;
        case "summer":
          resultTitle = "여름 쿨톤";
          break;
        case "fall":
          resultTitle = "가을 웜톤";
          break;
        case "winter":
          resultTitle = "겨울 쿨톤";
          break;
        default:
          resultTitle = "알수없음";
      }
    } 

    return { resultTitle };
  };

  const renderPrediction = () => {
    if (!prediction) return null;

    // 예측값을 확률에 따라 내림차순으로 정렬
    const sortedPredictions = prediction.sort((a, b) => b.probability - a.probability);
    
    // 가장 높은 확률을 가진 클래스 가져오기
    const topPrediction = sortedPredictions[0];
    const { resultTitle, resultExplain } = getResult(topPrediction.className);

    return (
      <div className={styles.predictionResult}>
        <h2>{resultTitle}</h2>
        <p>{resultExplain}</p>
        <div className={styles.progressBar}>
          {sortedPredictions.map((pred, index) => {
            const probability = (pred.probability * 100).toFixed(2);
            let barWidth = `${probability}%`;
            if (probability < 10) barWidth = '4%';
            else if (probability < 1) barWidth = '2%';

            return (
              <div key={index} className={styles.classResult}>
                <p>{pred.className === "spring" ? "봄 웜톤" : 
                     pred.className === "summer" ? "여름 쿨톤" :
                     pred.className === "fall" ? "가을 웜톤" : 
                     pred.className === "winter" ? "겨울 쿨톤" : "알수없음"}: {probability}%</p>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.bar} ${styles[pred.className]}`}
                    style={{ width: barWidth }}
                  ></div>
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
      <h1>퍼스널 컬러 테스트</h1>
      <input type="file" onChange={handleImageUpload} />
      {imageUrl && <img src={imageUrl} alt="Uploaded Preview" className={styles.previewImg} />}
      {renderPrediction()}
    </div>
  );
}

export default PersonalColor;
