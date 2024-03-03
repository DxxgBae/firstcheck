import { create } from 'zustand';
import html2canvas from 'html2canvas';
import fetchJsonp from 'fetch-jsonp';

const { naver } = window;
const cadastralLayer = new naver.maps.CadastralLayer();
const infoElement = document.createElement('div');
infoElement.className = 'iw_inner';
const infoList = ['주소', '지목', '용도', '면적', '소유자'];
for (var i of infoList) {
    const div = document.createElement('div');
    div.className = 'text';
    const small = document.createElement('small');
    small.textContent = i;
    div.append(small);
    const h = document.createElement('h6');
    div.append(h);
    infoElement.append(div);
}
const indoArrow = document.createElement('i');
indoArrow.className = 'fa-solid fa-play';
infoElement.append(indoArrow);
infoElement.append(indoArrow.cloneNode());
const infoWindow = new naver.maps.InfoWindow({ content: infoElement });
const keyVworld = 'A8901E28-B93C-3A14-B1C1-2FBC40EB22CA';
//const keyData = 'GXGoD02oAtHgVlYoMYAk%2FF4R7Z68cpmqauPMq9sw6L6lZfZWQfPzLsNZHMAs9P1ohYCffI%2BSxxD5iGwZtbwJKQ%3D%3D';
const landUseList = [
    '제1종전용주거지역',
    '제2종전용주거지역',
    '제1종일반주거지역',
    '제2종일반주거지역',
    '제3종일반주거지역',
    '준주거지역',
    '중심상업지역',
    '일반상업지역',
    '근린상업지역',
    '유통상업지역',
    '전용공업지역',
    '일반공업지역',
    '준공업지역',
    '보전녹지지역',
    '생산녹지지역',
    '자연녹지지역',
    '보전관리지역',
    '생산관리지역',
    '계획관리지역',
    '농림지역',
    '자연환경보전지역'
];

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
            fetchJsonp(`https://api.vworld.kr/req/wfs?key=${keyVworld}&request=GetFeature&output=text/javascript&typename=lp_pa_cbnd_bubun&srsname=EPSG:4326&bbox=${e.coord._lng},${e.coord._lat},${e.coord._lng},${e.coord._lat}`)
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
                promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/ladfrlList?key=${keyVworld}&pnu=${properties.pnu}&numOfRows=1`));
                promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/getPossessionAttr?key=${keyVworld}&pnu=${properties.pnu}&numOfRows=1`));
                promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/getLandUseAttr?key=${keyVworld}&pnu=${properties.pnu}&numOfRows=100`));
                promises.push(fetchJsonpPromise(`https://api.vworld.kr/ned/data/getIndvdLandPriceAttr?key=${keyVworld}&pnu=${properties.pnu}&numOfRows=100`));
                Promise.all(promises)
                    .then(responses => {
                        const [ladfrlList, possessionAttr, landUseAttr, indvdLandPriceAttr] = responses;
                        if (ladfrlList.ladfrlVOList) {
                            const item = ladfrlList.ladfrlVOList.ladfrlVOList[0];
                            properties.area = Number(item.lndpclAr);
                            properties.jimok = item.lndcgrCodeNm;
                        }
                        if (possessionAttr.possessions) {
                            const item = possessionAttr.possessions.field[0];
                            properties.owner_nm = item.posesnSeCodeNm.replace(' ', '·').replace('기관', '');
                            properties.owner_count = Number(possessionAttr.possessions.totalCount);
                        }
                        if (landUseAttr.landUses) {
                            properties.landUse = '';
                            properties.landUses = landUseAttr.landUses.field;
                            for (var i of properties.landUses)
                                if (i.cnflcAt !== '3')
                                    if (landUseList.indexOf(i.prposAreaDstrcCodeNm) > 0) {
                                        if (properties.landUse !== '') properties.landUse += ' ';
                                        properties.landUse += i.prposAreaDstrcCodeNm;
                                    }
                        }
                        if (indvdLandPriceAttr.indvdLandPrices) properties.jiga = indvdLandPriceAttr.indvdLandPrices.field.reverse();

                        map.data.addGeoJson(featureCollection);
                        state.setFeatures(map.data.getAllFeature().sort((a, b) => (a.property_pnu > b.property_pnu) ? 1 : -1));
                    })
                    .catch(error => console.error(error));
            };
        });

        map.data.addListener('click', (e) => {
            state.removeFeature(e.feature);
            infoWindow.close();
        });
        map.data.addListener('mouseover', (e) => {
            infoElement.children[0].lastChild.textContent = e.feature.property_addr;
            infoElement.children[1].lastChild.textContent = e.feature.property_jimok;
            infoElement.children[2].lastChild.textContent = e.feature.property_landUse;
            infoElement.children[3].lastChild.textContent = `${e.feature.property_area.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} m²`;
            infoElement.children[4].lastChild.textContent = `${e.feature.property_owner_nm}${e.feature.property_owner_count > 1 ? `(${e.feature.property_owner_count})` : ''}`;
            infoWindow.open(map, e.feature.marker);
        });
        map.data.addListener('mouseout', () => infoWindow.close());

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