import { useEffect, useRef } from 'react';
import './Map.css';

function Map() {
    const mapRef = useRef(null);
    const { naver } = window;

    useEffect(() => {
        if (!mapRef.current || !naver) return;

        const map = new naver.maps.Map(mapRef.current, {
            center: new naver.maps.LatLng(37.51740, 127.02262),
            zoom: 15
        });

        console.log(map);

    }, [naver]);

    return (
        <section ref={mapRef} id='Map'>
            <div className='noise' />
            <div className='tool'>
                <label className='item'>
                    <input type='text' id='search' placeholder='SEARCH' />
                    <i className='fa-solid fa-search' />
                </label>
                <div className='item'>
                    <i className='fa-solid fa-ruler' />
                </div>
                <div className='item'>
                    <i className='fa-solid fa-globe' />
                </div>
                <div className='item'>
                    <i className='fa-solid fa-earth-asia' />
                </div>
                <div className='item'>
                    <i className='fa-solid fa-table-cells' />
                </div>
            </div>
        </section>
    );
}

export default Map;