import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import styles from './AddressSearch.module.css'

const AddressSearch = ({ onAddressSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const KAKAO_MAP_KEY = "648bc3a57b1fdfed62d7b08c8c6adf44"; // 카카오 JavaScript 키

    const delayedSearch = useCallback(
        debounce((term) => {
            setSearchTerm(term);
        }, 300),
        []
    );

    const handleInputChange = (e) => {
        delayedSearch(e.target.value);
    };

    const loadKakaoMap = () => {
        if (window.kakao && window.kakao.maps) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${KAKAO_MAP_KEY}&libraries=services`;
            script.onload = () => {
                window.kakao.maps.load(resolve);
            };
            document.head.appendChild(script);
        });
    };

    const searchAddress = () => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(searchTerm, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setSearchResults(
                    result.map((item) => ({
                        address_name: item.address_name,
                        post_code: item.road_address ? item.road_address.zone_no : '',
                    }))
                );
            } else {
                setSearchResults([]);
            }
        });
    };

    useEffect(() => {
        if (!searchTerm) return;

        loadKakaoMap().then(searchAddress);

        return () => {
            setSearchResults([]);
        };
    }, [searchTerm]);

    return (
        <div>
            <input
                type="text"
                placeholder="주소를 검색해주세요."
                onChange={handleInputChange}
            />
            <ul>
                {searchResults.map((result, index) => (
                    <li key={index} onClick={() => onAddressSelect(result)}>
                        {result.address_name} ({result.post_code})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddressSearch;