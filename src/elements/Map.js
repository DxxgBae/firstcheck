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

        const selectSite = (e) => {
            fetchJsonp(`https://api.vworld.kr/req/data?request=GetFeature&key=${keyVworld}&data=LP_PA_CBND_BUBUN&crs=EPSG:4326&geomFilter=POINT(${e.coord._lng} ${e.coord._lat})`)
                .then(response => response.json())
                .then(data => {
                    if (!data.response.result) return;
                    const featureCollection = data.response.result.featureCollection;
                    featureCollection.bbox = null;
                    map.data.addGeoJson(featureCollection);

                    const features = map.data.getAllFeature();
                    const feature = features.at(-1);
                    const pnu = feature.property_pnu;
                    feature.marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(feature.getBounds().getCenter()),
                        map: map,
                        icon: {
                            content: `<div class="marker">${features.length}</div>`,
                            anchor: new naver.maps.Point(10, 10),
                        }
                    });
                    feature.setStyle({
                        strokeLineCap: 'round',
                        strokeLineJoin: 'round',
                    });
                    naver.maps.Event.addListener(feature, 'click', (e) => {
                        e.feature.marker.setMap(null);
                        map.data.removeFeature(e.feature);
                        removeFeature(e.feature);
                    });
                    console.log(feature);
                    console.log(feature.marker);

                    fetchJsonp(`https://api.vworld.kr/ned/data/ladfrlList?key=${keyVworld}&pnu=${pnu}`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.ladfrlVOList) return;
                            const item = data.ladfrlVOList.ladfrlVOList[0];
                            feature.property_area = Number(item.lndpclAr);
                            feature.property_jimok = item.lndcgrCodeNm;
                        })
                        .catch(error => console.error('Error:', error));

                    fetchJsonp(`https://api.vworld.kr/ned/data/getPossessionAttr?key=${keyVworld}&pnu=${pnu}&numOfRows=1`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.possessions) return;
                            const item = data.possessions.field[0];
                            feature.property_owner = item.posesnSeCodeNm;
                            feature.property_ownerCount = Number(item.cnrsPsnCo) + 1;
                        })
                        .catch(error => console.error('Error:', error));

                    fetchJsonp(`https://api.vworld.kr/ned/data/getLandUseAttr?key=${keyVworld}&pnu=${pnu}&numOfRows=100`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.landUses) return;
                            feature.property_landUse = data.landUses.field;
                        })
                        .catch(error => console.error('Error:', error));

                    fetchJsonp(`https://api.vworld.kr/ned/data/getIndvdLandPriceAttr?key=${keyVworld}&pnu=${pnu}&numOfRows=100`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.indvdLandPrices) return;
                            feature.property_price = data.indvdLandPrices.field.reverse();
                        })
                        .catch(error => console.error('Error:', error));

                    setTimeout(() => addFeature(feature), 500);
                })
                .catch(error => console.error('Error:', error));
        };

        toolRef.current.children[toolRef.current.children.length - 3].addEventListener('change', () => {
            map.setMapTypeId(naver.maps.MapTypeId.NORMAL);
            cadastralLayer.setMap(null);
        });
        toolRef.current.children[toolRef.current.children.length - 2].addEventListener('change', () => {
            map.setMapTypeId(naver.maps.MapTypeId.HYBRID);
            cadastralLayer.setMap(null);
        });
        toolRef.current.children[toolRef.current.children.length - 1].addEventListener('change', () => {
            map.setMapTypeId(naver.maps.MapTypeId.NORMAL);
            cadastralLayer.setMap(map);
        });

        map.addListener('click', selectSite);
    }, [naver]);

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
                <div className='item' onClick={() => {
                }}>
                    <i className='fa-solid fa-camera' />
                </div>
                <label className='item'>
                    <i className='fa-solid fa-globe' />
                    <input type='radio' name='tool' defaultChecked={true} />
                </label>
                <label className='item'>
                    <i className='fa-solid fa-earth-asia' />
                    <input type='radio' name='tool' />
                </label>
                <label className='item'>
                    <i className='fa-solid fa-table-cells' />
                    <input type='radio' name='tool' />
                </label>
            </div>
        </section>
    );
}

export default Map;