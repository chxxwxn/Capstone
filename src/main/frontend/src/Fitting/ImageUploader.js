// src/components/ImageUploader.js
import React, { useState } from "react";
import axios from "axios";
import styles from './ImageUploader.module.css';

export default function ImageUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택하세요.");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:8090/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // 세션 유지
      });
      alert("업로드 성공!");
    } catch (error) {
      console.error(error);
      alert("업로드 실패");
    }
  };

  return (
    <div className={styles.container}>
      <main>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="preview" width={200} />}
        <button onClick={handleUpload}>업로드</button>
      </main>
    </div>
  );
}
