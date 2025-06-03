import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import styles from './ModelViewer.module.css';

function Model({ path }) {
  const obj = useLoader(OBJLoader, path);
  return <primitive object={obj} scale={1.5} />;
}

export default function ModelViewer() {
  useEffect(() => {
    fetch("http://localhost:8090/api/generate-3d", {
      method: "POST",
      credentials: "include" // 세션 등 인증 포함
    })
      .then(res => res.text())
      .then(console.log)
      .catch(console.error);
  }, []); // 빈 배열 = 컴포넌트 마운트 시 1번만 실행

  return (
    <div className={styles.container}>
      <main>
        <Canvas camera={{ position: [0, 1, 3], fov: 45 }}>
          <ambientLight />
          <directionalLight position={[0, 5, 5]} />
          <Suspense fallback={null}>
            <Model path="http://localhost:8090/uploads/results/pifuhd_final/recon/result_test_512.obj" />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </main>
    </div>
  );
}
