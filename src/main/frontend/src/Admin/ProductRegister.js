import React, { useEffect, useState } from 'react';
import styles from './ProductRegister.module.css';
import { useNavigate } from "react-router-dom";

const ProductRegister = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productName: '',
        registerYear: '',
        productPrice: '',
        productStock: '',
        productDiscount: '',
        imageUrl: '',
        colorCodes: '',
        cateCode: ''
    });

    useEffect(() => {
        fetch("http://localhost:8090/admin/main") // ✅ Spring Boot API 호출
            .then(response => response.json())
            .then(data => {
                setMessage(data.message); // ✅ JSON 데이터에서 message 가져오기
            })
            .catch(error => console.error("Error fetching admin data:", error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleCancel = () => {
        navigate('/admin/ProductManage');
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 동작 방지

        try {
            const response = await fetch("http://localhost:8090/products", { // 백엔드 API 주소
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData), // 입력된 데이터 전송
            });

            if (response.ok) {
                alert("상품이 성공적으로 등록되었습니다!");
                navigate('/admin/ProductManage'); // 상품 관리 페이지로 이동
            } else {
                const errorData = await response.json();
                alert(`상품 등록 실패: ${errorData.message || "알 수 없는 오류"}`);
            }
        } catch (error) {
            console.error("상품 등록 중 오류 발생:", error);
            alert("상품 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.wrap}>
                {/* 관리자 페이지 제목 */}
                <div className={styles.admin_top_wrap}>
                    <span>관리자 페이지</span>
                </div>

                {/* 관리자 페이지 콘텐츠 */}
                <div className={styles.admin_wrap}>
                    {/* 좌측 네비게이션 */}
                    <div className={styles.admin_navi_wrap}>
                        <ul>
                            <li onClick={() => navigate("/admin/ProductRegister")}>
                                <a className={styles.admin_list_01}>상품 등록</a>
                            </li>
                            <li onClick={() => navigate("/admin/ProductManage")}>
                                <a className={styles.admin_list_02}>상품 관리</a>
                            </li>
                            <li onClick={() => navigate("/admin/author-register")}>
                                <a className={styles.admin_list_03}>작가 등록</a>
                            </li>
                            <li onClick={() => navigate("/admin/author-manage")}>
                                <a className={styles.admin_list_04}>작가 관리</a>
                            </li>
                            <li onClick={() => navigate("/admin/user-manage")}>
                                <a className={styles.admin_list_05}>회원 관리</a>
                            </li>
                        </ul>
                    </div>

                    {/* 메인 콘텐츠 영역 */}
                    <div className={styles.admin_content_wrap}>
                        <div class="admin_content_subject"><span>상품 등록</span>
                            <div className={styles.admin_content_main}>
                                <form onSubmit={handleSubmit} id="enrollForm">
                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                    <label>상품명</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                    <input
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                    />
                                    </div>
                                </div>

                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                    <label>등록 날짜</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                    <input
                                        name="registerYear"
                                        value={formData.registerYear}
                                        onChange={handleInputChange}
                                    />
                                    </div>
                                </div>

                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                    <label>상품 가격</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                    <input
                                        name="productPrice"
                                        value={formData.productPrice}
                                        onChange={handleInputChange}
                                    />
                                    </div>
                                </div>

                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                    <label>상품 재고</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                    <input
                                        name="productStock"
                                        value={formData.productStock}
                                        onChange={handleInputChange}
                                    />
                                    </div>
                                </div>

                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                    <label>상품 할인률</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                    <input
                                        name="productDiscount"
                                        value={formData.productDiscount}
                                        onChange={handleInputChange}
                                    />
                                    </div>
                                </div>

                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                    <label>상품 이미지</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                    <input
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                    />
                                    </div>
                                </div>

                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                    <label>상품 색상</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                    <input
                                        name="colorCodes"
                                        value={formData.colorCodes}
                                        onChange={handleInputChange}
                                    />
                                    </div>
                                </div>

                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                    <label>상품 카테고리</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                    <input
                                        name="cateCode"
                                        value={formData.cateCode}
                                        onChange={handleInputChange}
                                    />
                                    </div>
                                </div>

                                <div className={styles.btn_section}>
                                    <button type="button" id="cancelBtn" className={styles.btn} onClick={handleCancel}>
                                    취소
                                    </button>
                                    <button type="submit" id="enrollBtn" className={`${styles.btn} ${styles.enroll_btn}`}>
                                    등록
                                    </button>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    );
};

export default ProductRegister;