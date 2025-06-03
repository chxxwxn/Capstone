import React, { useState } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Avatar = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} position={[0, -1.5, 0]} />;
};

const FittingRoom = () => {
  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axios.post('/api/photo', formData);
      setAvatarUrl(res.data.avatarUrl); // 백엔드가 반환하는 .glb URL
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>3D 피팅 룸</h2>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>사진 업로드</button>

      {avatarUrl && (
        <Canvas style={{ height: '80vh', background: '#eee' }}>
          <ambientLight />
          <directionalLight position={[5, 5, 5]} />
          <Avatar url={avatarUrl} />
          <OrbitControls />
        </Canvas>
      )}
    </div>
  );
};

export default FittingRoom;
