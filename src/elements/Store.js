import { create } from 'zustand';
import html2canvas from 'html2canvas';
import fetchJsonp from 'fetch-jsonp';
const { naver } = window;
const cadastralLayer = new naver.maps.CadastralLayer();
const keyVworld = 'A8901E28-B93C-3A14-B1C1-2FBC40EB22CA';
//const keyData = 'GXGoD02oAtHgVlYoMYAk%2FF4R7Z68cpmqauPMq9sw6L6lZfZWQfPzLsNZHMAs9P1ohYCffI%2BSxxD5iGwZtbwJKQ%3D%3D';

export const useStore = create((set) => ({
    map: null,
    features: [],
    setMap: (mapDiv) => set((state) => {
        if (state.map) return state;

        const map = new naver.maps.Map(mapDiv, {
            center: new naver.maps.LatLng(37.51740, 127.02262),
            zoom: 15
        });

        map.data.setStyle(() => ({
            fillColor: 'var(--color-black)',
            strokeColor: 'var(--color-black)',
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
        }));

        map.addListener('click', (e) => {
            fetchJsonp(`https://api.vworld.kr/req/wfs?key=${keyVworld}&request=GetFeature&output=text/javascript&typename=lt_c_landinfobasemap&srsname=EPSG:4326&bbox=${e.coord._lng},${e.coord._lat},${e.coord._lng},${e.coord._lat}`)
                .then(response => response.json())
                .then(data => { })
                .catch(error => { });

            window.parseResponse = (featureCollection) => {
                featureCollection.bbox = null;
                const properties = featureCollection.features[0].properties

                const promises = [];
                const fetchJsonpPromise = (url) => {
                    return fetchJsonp(url)
                        .then(response => response.json())
                        .catch(error => console.error(error));
                };
                promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/getPossessionAttr?key=${keyVworld}&pnu=${properties.pnu}&numOfRows=1`));
                promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/getLandCharacteristics?key=${keyVworld}&pnu=${properties.pnu}&numOfRows=1`));
                promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/getLandUseAttr?key=${keyVworld}&pnu=${properties.pnu}&numOfRows=100`));
                promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/getIndvdLandPriceAttr?key=${keyVworld}&pnu=${properties.pnu}&numOfRows=100`));
                Promise.all(promises)
                    .then(responses => {
                        const [possessionAttr, landCharacteristics, landUseAttr, indvdLandPriceAttr] = responses;
                        if (possessionAttr.possessions.field.length > 0) {
                            const item = possessionAttr.possessions.field[0];
                            properties.addr = [properties.sido_nm, properties.sgg_nm, properties.emd_nm, properties.ri_nm, item.mnnmSlno].join(' ').replace('  ', ' ');
                            properties.owner_nm = item.posesnSeCodeNm.replace(' ', '·').replace('기관', '');
                            properties.owner_count = Number(item.cnrsPsnCo) + 1;
                        }
                        if (landCharacteristics.landCharacteristicss.field.length > 0) {
                            const item = landCharacteristics.landCharacteristicss.field[0];
                            console.log(item);
                        }
                        if (landUseAttr.landUses.field.length > 0) properties.landUse = landUseAttr.landUses.field;
                        if (indvdLandPriceAttr.indvdLandPrices.field.length > 0) properties.jiga = indvdLandPriceAttr.indvdLandPrices.field.reverse();

                        map.data.addGeoJson(featureCollection);
                        state.setFeatures(map.data.getAllFeature().sort((a, b) => (a.property_pnu > b.property_pnu) ? 1 : -1));
                    })
                    .catch(error => console.error(error));
            };
        });

        map.data.addListener('click', (e) => state.removeFeature(e.feature));

        return { map: map };
    }),
    setFeatures: (features) => set((state) => {
        for (var i in features) {
            if (features[i].marker) features[i].marker.setMap(null);
            features[i].marker = new naver.maps.Marker({
                position: features[i].bounds.getCenter(),
                map: state.map,
                icon: {
                    content: `<div class="marker">${Number(i) + 1}</div>`,
                    size: new naver.maps.Size(20, 20),
                    anchor: new naver.maps.Point(10, 10),
                },
            });
        }
        return { features: features };
    }),
    removeFeature: (feature) => set((state) => {
        feature.marker.setMap(null);
        state.map.data.removeFeature(feature);
        state.setFeatures(state.map.data.getAllFeature());
        return state;
    }),
    clearFeatures: () => set((state) => {
        if (!state.map) return state;
        while (state.features.length > 0) state.removeFeature(state.features[0]);
        return state;
    }),
    setMapType: (type) => set((state) => {
        if (!state.map) return state;

        switch (type) {
            case 'normal':
                state.map.setMapTypeId(naver.maps.MapTypeId.NORMAL);
                cadastralLayer.setMap(null);
                break;
            case 'hybrid':
                state.map.setMapTypeId(naver.maps.MapTypeId.HYBRID);
                cadastralLayer.setMap(null);
                break;
            case 'cadastral':
                state.map.setMapTypeId(naver.maps.MapTypeId.NORMAL);
                cadastralLayer.setMap(state.map);
                break;
            default: break;
        }

        return state;
    }),
    getScreenShot: (target) => set((state) => {
        if (!state.map) return state;

        target.parentElement.style.opacity = 0;

        html2canvas(state.map.getElement(), { useCORS: true })
            .then((canvas) => {
                const link = document.createElement('a');
                const date = new Date();
                link.href = canvas.toDataURL('image/jpg');
                link.download = `FirstCheck ScreenShot ${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.jpg`;
                link.click();
            });

        target.parentElement.style.opacity = 1;

        return state;
    }),
}));