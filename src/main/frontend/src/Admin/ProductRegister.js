import React, { useEffect, useState } from 'react';
import styles from './ProductRegister.module.css';
import { useNavigate } from "react-router-dom";


const ProductRegister = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [mainCategory, setMainCategory] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [colors, setColors] = useState([{ color: '#000000', name: '' }]);
    const styleOptions = ["꾸안꾸", "댄디", "데이트", "캐주얼", "스트릿", "미니멀"];
    const [selectedStyles, setSelectedStyles] = useState([]);
    const categoryOptions = {
        OUTER: ["Padding", "Jacket", "Coat", "Cardigan"],
        TOP: ["MTM", "Hoodie", "Knit", "Shirts", "Tee"],
        BOTTOM: ["Denim", "Skirt", "Pants"],
        ETC: ["Ring"],
    };

    const [formData, setFormData] = useState({
        productName: '',
        registerYear: '',
        productPrice: '',
        productStock: '',
        productDiscount: '',
        colorCodes: '',
        cateCode: '',
        "images": [
            { "imageUrl": "", "imageOrder": 0 },
            { "imageUrl": "", "imageOrder": 1 },
            { "imageUrl": "", "imageOrder": 2 },
            { "imageUrl": "", "imageOrder": 3 },
            { "imageUrl": "", "imageOrder": 4 },
            { "imageUrl": "", "imageOrder": 5 },
            { "imageUrl": "", "imageOrder": 6 },
            { "imageUrl": "", "imageOrder": 7 },
            { "imageUrl": "", "imageOrder": 8 },
            { "imageUrl": "", "imageOrder": 9 },
            { "imageUrl": "", "imageOrder": 10 },
            { "imageUrl": "", "imageOrder": 11 },
            { "imageUrl": "", "imageOrder": 12 },
            { "imageUrl": "", "imageOrder": 13 },
            { "imageUrl": "", "imageOrder": 14 },
            { "imageUrl": "", "imageOrder": 15 }
        ]
    });

    const handleAddColor = () => {
        setColors([...colors, { color: '#000000', name: '' }]);
    };

    const handleColorChange = (index, newColor) => {
        const updatedColors = [...colors];
        updatedColors[index].color = newColor;
        setColors(updatedColors);
    };

    const handleColorNameChange = (index, newName) => {
        const updatedColors = [...colors];
        updatedColors[index].name = newName;
        setColors(updatedColors);
    };

    const handleRemoveColor = (index) => {
        const updatedColors = colors.filter((_, i) => i !== index);
        setColors(updatedColors);
    };

    // 이미지 선택 핸들러
    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const main = mainCategory.toLowerCase();      // 예: 'OUTER' → 'outer'
            const category = formData.cateCode.toLowerCase(); // 예: 'PADDING' → 'padding'
            const fileName = file.name; // '1-1.jpg'
            const imageUrl = `/${main}/${category}/${fileName}`; // '/outer/padding/1-1.jpg'
    
            setFormData((prevData) => {
                const updatedImages = [...prevData.images];
                updatedImages[index] = {
                    ...updatedImages[index],
                    imageUrl: imageUrl,
                    imageOrder: index,
                    };
                    return {
                    ...prevData,
                    images: updatedImages,
                    };
                });
        }
    };

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
        console.log("전송 직전 이미지 데이터 확인", formData.images);
        e.preventDefault(); // 기본 동작 방지

        const colorCodeString = colors
        .map((item) => `${item.color}-${item.name}`)
        .join(', '); // → "#ffffff-화이트, #000000-블랙"

        const updatedFormData = {
            ...formData,
            colorCodes: colorCodeString,
            productStyles: selectedStyles.join(", ")
        };

        console.log("색상 코드 확인", updatedFormData.colorCodes);

        try {
            const response = await fetch("http://localhost:8090/products", { // 백엔드 API 주소
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData), // 입력된 데이터 전송
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
            alert("상품 등록 중 오류가 발생했습니다.(모든 입력란 입력 필수)");
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
                            <li onClick={() => navigate("/admin/UserManage")}>
                                <a className={styles.admin_list_05}>회원 관리</a>
                            </li>
                        </ul>
                    </div>

                    {/* 메인 콘텐츠 영역 */}
                    <div className={styles.admin_content_wrap}>
                        <div className={styles.admin_content_subject}><div className={styles.admin_content_subject_sapn}>상품 등록</div>
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
                                        type="date"
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
                                        <label>상품 색상</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                        {colors.map((item, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                                            <input
                                                type="color"
                                                value={item.color}
                                                onChange={(e) => handleColorChange(index, e.target.value)}
                                                style={{ marginRight: '8px' }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="색상 이름 (필수)"
                                                value={item.name}
                                                onChange={(e) => handleColorNameChange(index, e.target.value)}
                                                required
                                                style={{
                                                marginRight: '8px',
                                                padding: '4px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveColor(index)}
                                                style={{
                                                backgroundColor: '#ff5e5e',
                                                color: 'white',
                                                border: 'none',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                                }}
                                            >
                                                삭제
                                            </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddColor}
                                            style={{
                                            marginTop: '6px',
                                            padding: '6px 12px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                            }}
                                        >
                                            색상 추가
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                        <label>상품 스타일</label>
                                    </div>
                                    <div className={styles.form_section_content} style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {styleOptions.map((style, index) => (
                                        <label key={index} style={{ marginRight: '15px', marginBottom: '8px' }}>
                                            <input
                                            type="checkbox"
                                            value={style}
                                            checked={selectedStyles.includes(style)}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (e.target.checked) {
                                                setSelectedStyles([...selectedStyles, value]);
                                                } else {
                                                setSelectedStyles(selectedStyles.filter((s) => s !== value));
                                                }
                                            }}
                                            />
                                            {style}
                                        </label>
                                        ))}
                                    </div>
                                </div>


                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                        <label>상품 카테고리</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                        {/* 대분류 드롭다운 */}
                                        <select
                                        value={mainCategory}
                                        onChange={(e) => {
                                            const selectedMain = e.target.value;
                                            setMainCategory(selectedMain);
                                            setSubCategories(categoryOptions[selectedMain] || []);
                                            setFormData((prevData) => ({
                                            ...prevData,
                                            cateCode: "", // 소분류 초기화
                                            }));
                                        }}
                                        >
                                        <option value="">대분류 선택</option>
                                        {Object.keys(categoryOptions).map((main) => (
                                            <option key={main} value={main}>
                                            {main}
                                            </option>
                                        ))}
                                        </select>

                                        {/* 소분류 드롭다운 */}
                                        <select
                                        value={formData.cateCode}
                                        onChange={(e) => {
                                            const selectedSub = e.target.value;
                                            setFormData((prevData) => ({
                                            ...prevData,
                                            cateCode: selectedSub, // 실제로 저장되는 건 소분류 값만!
                                            }));
                                        }}
                                        disabled={!mainCategory} // 대분류 선택 전엔 비활성화
                                        >
                                        <option value="">소분류 선택</option>
                                        {subCategories.map((sub) => (
                                            <option key={sub} value={sub}>
                                            {sub}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                </div>


                                <div className={styles.form_section}>
                                    <div className={styles.form_section_title}>
                                        <label>상품 이미지</label>
                                    </div>
                                    <div className={styles.form_section_content}>
                                        {[...Array(16)].map((_, index) => (
                                            <div key={index}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, index)}
                                                />
                                                <p style={{ fontSize: '12px' }}>
                                                    현재 경로: {formData.images[index].imageUrl}
                                                </p>
                                            </div>
                                        ))}
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