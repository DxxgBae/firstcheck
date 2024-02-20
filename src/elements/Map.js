import { useEffect, useRef } from 'react';
import { stateFeatures } from './store';
import fetchJsonp from 'fetch-jsonp';
import './Map.css';

function Map() {
    const mapRef = useRef();
    const mapNormalRef = useRef();
    const mapHybridRef = useRef();
    const mapCadastralRef = useRef();
    const { addFeature, removeFeature } = stateFeatures();

    useEffect(() => {
        const { naver } = window;
        const keyVworld = 'A8901E28-B93C-3A14-B1C1-2FBC40EB22CA';
        //const keyData = 'GXGoD02oAtHgVlYoMYAk%2FF4R7Z68cpmqauPMq9sw6L6lZfZWQfPzLsNZHMAs9P1ohYCffI%2BSxxD5iGwZtbwJKQ%3D%3D';
        if (!mapRef.current || !naver) return;

        const map = new naver.maps.Map(mapRef.current, {
            center: new naver.maps.LatLng(37.51740, 127.02262),
            zoom: 15
        });
        const cadastralLayer = new naver.maps.CadastralLayer();

        const selectSite = (e) =>
            fetchJsonp(`https://api.vworld.kr/req/wfs?key=${keyVworld}&request=GetFeature&output=text/javascript&typename=lt_c_landinfobasemap&srsname=EPSG:4326&bbox=${e.coord._lng},${e.coord._lat},${e.coord._lng},${e.coord._lat}`)
                .then(response => response.json())
                .then(data => { })
                .catch(error => { });

        window.parseResponse = function (featureCollection) {
            const features = map.data.getAllFeature();
            const pnu = featureCollection.features[0].properties.pnu;
            for (var i of features) if (pnu === i.property_pnu) return;
            featureCollection.bbox = null;
            map.data.addGeoJson(featureCollection);

            const feature = features.at(-1);
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

            const promises = [];
            const fetchJsonpPromise = (url) => {
                return fetchJsonp(url)
                    .then(response => response.json())
                    .catch(error => console.error(error));
            };
            promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/getPossessionAttr?key=${keyVworld}&pnu=${pnu}&numOfRows=1`));
            promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/getLandUseAttr?key=${keyVworld}&pnu=${pnu}&numOfRows=100`));
            promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/getIndvdLandPriceAttr?key=${keyVworld}&pnu=${pnu}&numOfRows=100`));
            Promise.all(promises)
                .then(responses => {
                    const [possessionAttr, landUseAttr, indvdLandPriceAttr] = responses;

                    if (possessionAttr.possessions.field[0]) feature.property_owner_count = Number(possessionAttr.possessions.field[0].cnrsPsnCo) + 1;
                    if (landUseAttr.landUses.field.length > 0) feature.property_landUse = landUseAttr.landUses.field;
                    if (indvdLandPriceAttr.indvdLandPrices.field.length > 0) feature.property_jiga = indvdLandPriceAttr.indvdLandPrices.field.reverse();

                    feature.property_addr = [feature.property_sido_nm, feature.property_sgg_nm, feature.property_emd_nm, feature.property_ri_nm, feature.property_jibun].join(' ');
                    console.log(feature);
                    addFeature(feature);
                })
                .catch(error => console.error(error));
        };

        mapNormalRef.current.addEventListener('change', () => {
            map.setMapTypeId(naver.maps.MapTypeId.NORMAL);
            cadastralLayer.setMap(null);
        });
        mapHybridRef.current.addEventListener('change', () => {
            map.setMapTypeId(naver.maps.MapTypeId.HYBRID);
            cadastralLayer.setMap(null);
        });
        mapCadastralRef.current.addEventListener('change', () => {
            map.setMapTypeId(naver.maps.MapTypeId.NORMAL);
            cadastralLayer.setMap(map);
        });

        map.addListener('click', selectSite);
    }, []);

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
                <label className='item' ref={mapNormalRef}>
                    <i className='fa-solid fa-globe' />
                    <input type='radio' name='tool' defaultChecked={true} />
                </label>
                <label className='item' ref={mapHybridRef}>
                    <i className='fa-solid fa-earth-asia' />
                    <input type='radio' name='tool' />
                </label>
                <label className='item' ref={mapCadastralRef}>
                    <i className='fa-solid fa-table-cells' />
                    <input type='radio' name='tool' />
                </label>
            </div>
        </section>
    );
}

export default Map;