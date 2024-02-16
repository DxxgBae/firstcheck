import { useEffect, useRef } from 'react';
import fetchJsonp from 'fetch-jsonp';
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

        const selectSite = (lat, lng, center = null, zoom = null) => {
            fetchJsonp(`https://api.vworld.kr/req/data?request=GetFeature&key=A8901E28-B93C-3A14-B1C1-2FBC40EB22CA&data=LP_PA_CBND_BUBUN&crs=EPSG:4326&geomFilter=POINT(${lng} ${lat})`)
                .then(response => response.json())
                .then(data => {
                    map.data.addGeoJson(data.response.result.featureCollection);
                    naver.maps.Event.addListener(map.data.getAllFeature().at(-1), 'click', (e) => map.data.removeFeature(e.feature));
                    if (center) map.setCenter(center);
                    if (zoom) map.setZoom(zoom);
                })
                .catch(error => console.error('Error:', error));
        };

        naver.maps.Event.addListener(map, 'click', (e) => {
            selectSite(e.coord._lat, e.coord._lng, map.getCenter(), map.getZoom());
        });
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