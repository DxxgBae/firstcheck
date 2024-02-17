import { useEffect, useRef } from 'react';
import fetchJsonp from 'fetch-jsonp';
import { stateFeatures } from './store';
import './Map.css';

function Map() {
    const mapRef = useRef();
    const toolRef = useRef();
    const keyVworld = 'A8901E28-B93C-3A14-B1C1-2FBC40EB22CA';
    //const keyData = 'GXGoD02oAtHgVlYoMYAk%2FF4R7Z68cpmqauPMq9sw6L6lZfZWQfPzLsNZHMAs9P1ohYCffI%2BSxxD5iGwZtbwJKQ%3D%3D';
    const { naver } = window;
    const { addFeature, removeFeature } = stateFeatures();

    useEffect(() => {
        if (!mapRef.current || !naver) return;

        const map = new naver.maps.Map(mapRef.current, {
            center: new naver.maps.LatLng(37.51740, 127.02262),
            zoom: 15
        });

        const cadastralLayer = new naver.maps.CadastralLayer();
        console.log(naver.maps);
        console.log(naver.maps.UTMK);

        const selectSite = (e) => {
            console.log(e);
            fetchJsonp(`https://api.vworld.kr/req/data?request=GetFeature&key=${keyVworld}&data=LP_PA_CBND_BUBUN&crs=EPSG:4326&geomFilter=POINT(${e.coord._lng} ${e.coord._lat})`)
                .then(response => response.json())
                .then(data => {
                    if (!data.response.result) return;
                    const featureCollection = data.response.result.featureCollection;
                    featureCollection.bbox = null;
                    map.data.addGeoJson(featureCollection);

                    const feature = map.data.getAllFeature().at(-1);
                    const pnu = feature.property_pnu;

                    fetchJsonp(`https://api.vworld.kr/ned/data/ladfrlList?key=${keyVworld}&pnu=${pnu}`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.ladfrlVOList) return;
                            const item = data.ladfrlVOList.ladfrlVOList[0];
                            feature['property_area'] = Number(item.lndpclAr);
                            feature['property_jimok'] = item.lndcgrCodeNm;
                        })
                        .catch(error => console.error('Error:', error));

                    fetchJsonp(`https://api.vworld.kr/ned/data/getPossessionAttr?key=${keyVworld}&pnu=${pnu}&numOfRows=1`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.possessions) return;
                            const item = data.possessions.field[0];
                            feature['property_owner'] = item.posesnSeCodeNm;
                            feature['property_ownerCount'] = Number(item.cnrsPsnCo);
                        })
                        .catch(error => console.error('Error:', error));

                    setTimeout(() => addFeature(feature), 100);
                    naver.maps.Event.addListener(feature, 'click', (e) => {
                        map.data.removeFeature(e.feature);
                        removeFeature(e.feature);
                    });
                })
                .catch(error => console.error('Error:', error));
        };

        toolRef.current.children[2].addEventListener('click', () => map.setMapTypeId(naver.maps.MapTypeId.NORMAL));
        toolRef.current.children[3].addEventListener('click', () => map.setMapTypeId(naver.maps.MapTypeId.HYBRID));
        toolRef.current.children[4].addEventListener('click', () => cadastralLayer.getMap() ? cadastralLayer.setMap(null) : cadastralLayer.setMap(map));

        map.addListener('click', selectSite);
    }, [naver, addFeature, removeFeature]);

    return (
        <section ref={mapRef} id='Map'>
            <div className='noise' />
            <div ref={toolRef} className='tool'>
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