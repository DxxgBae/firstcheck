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
                <i className='fa-solid fa-search' />
                <i className='fa-solid fa-home' />
                <i className='fa-solid fa-home' />
                <i className='fa-solid fa-home' />
                <i className='fa-solid fa-home' />
                <i className='fa-solid fa-home' />
                <i className='fa-solid fa-home' />
            </div>
        </section>
    );
}

export default Map;