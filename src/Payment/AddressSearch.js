import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

const AddressSearch = ({ onAddressSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const delayedSearch = useCallback(
        debounce((term) => {
            setSearchTerm(term);
        }, 300),
        []
    );

    const handleInputChange = (e) => {
        delayedSearch(e.target.value);
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src =
            '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=YOUR_KAKAO_JAVASCRIPT_KEY&libraries=services';
        script.onload = () => {
            window.kakao.maps.load(() => {
                const geocoder = new window.kakao.maps.services.Geocoder();

                const searchAddress = () => {
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

                if (searchTerm) {
                    searchAddress();
                }
            });
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [searchTerm]);

    return (
        <div>
            <input
                type="text"
                placeholder="주소 검색"
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
