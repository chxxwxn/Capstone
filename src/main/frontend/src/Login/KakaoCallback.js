import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function KakaoCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code'); // 카카오에서 받은 인가 코드

    if (code) {
      fetch('http://localhost:8090/member/kakao/callback?code=' + code, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('카카오 로그인 성공:', data);
          navigate('/', { state: { kakaoUserInfo: data } });
        })
        .catch((error) => {
          console.error('카카오 로그인 실패:', error);
          navigate('/login'); // 실패 시 로그인 페이지로
        });
    }
  }, [location, navigate]);

  return <div>카카오 로그인 중...</div>;
}

export default KakaoCallback;
