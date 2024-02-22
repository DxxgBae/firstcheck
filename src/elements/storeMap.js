import { create } from 'zustand';

export const stateFeatures = create((set) => ({
    map: null,
    cadastralLayer: null,
    setMap: (mapElement, cadastralLayerElement) => set((state) => {
        if (!state.map)
            return {
                map: mapElement,
                cadastralLayer: cadastralLayerElement
            };
    }),
    features: [],
    addFeature: (newFeature) =>
        set((state) => {
            const updatedFeatures = [...state.features, newFeature];
            updatedFeatures.sort((a, b) => (a.property_pnu > b.property_pnu) ? 1 : -1);
            for (var i in updatedFeatures) updatedFeatures[i].marker.getElement().firstChild.textContent = Number(i) + 1;
            return { features: updatedFeatures };
        }),
    removeFeature: (featureToRemove) =>
        set((state) => {
            const updatedFeatures = state.features.filter((feature) => feature !== featureToRemove);
            for (var i in updatedFeatures) updatedFeatures[i].marker.getElement().firstChild.textContent = Number(i) + 1;
            return { features: updatedFeatures }
        }),
    clearFeatures: () =>
        set(() => ({ features: [] })),
    getJiga: (feature, year) => {
        if (!feature.property_jiga) return;

        for (var i of feature.property_jiga)
            if (i.stdrYear === year)
                return [Number(i.pblntfPclnd), `${i.stdrYear}-${i.stdrMt}`];

        return [0,];
    },
    getLandUse: (feature) => {
        if (!feature.property_landUse) return;
        const landUses = [];
        const dataLandUse = [
            { code: 'UQA111', name: '제1종전용주거지역' },
            { code: 'UQA112', name: '제2종전용주거지역' },
            { code: 'UQA121', name: '제1종일반주거지역' },
            { code: 'UQA122', name: '제2종일반주거지역' },
            { code: 'UQA123', name: '제3종일반주거지역' },
            { code: 'UQA130', name: '준주거지역' },
            { code: 'UQA210', name: '중심상업지역' },
            { code: 'UQA220', name: '일반상업지역' },
            { code: 'UQA230', name: '근린상업지역' },
            { code: 'UQA240', name: '유통상업지역' },
            { code: 'UQA310', name: '전용공업지역' },
            { code: 'UQA320', name: '일반공업지역' },
            { code: 'UQA330', name: '준공업지역' },
            { code: 'UQA410', name: '보전녹지지역' },
            { code: 'UQA420', name: '생산녹지지역' },
            { code: 'UQA430', name: '자연녹지지역' },
            { code: 'UQB100', name: '계획관리지역' },
            { code: 'UQB200', name: '생산관리지역' },
            { code: 'UQB300', name: '보전관리지역' },
            { code: 'UQC001', name: '농림지역' },
            { code: 'UQD001', name: '자연환경보전지역' },
        ]

        for (var i of feature.property_landUse)
            if (i.cnflcAt === '1')
                for (var j of dataLandUse)
                    if (j.code.toString() === i.prposAreaDstrcCode.toString())
                        if (landUses.indexOf(i.prposAreaDstrcCodeNm) < 0) landUses.push(i.prposAreaDstrcCodeNm);

        for (var ii of feature.property_landUse)
            if (ii.cnflcAt === '2')
                for (var jj of dataLandUse)
                    if (jj.code.toString() === ii.prposAreaDstrcCode.toString())
                        if (landUses.indexOf(ii.prposAreaDstrcCodeNm) < 0) landUses.push(ii.prposAreaDstrcCodeNm);

        return landUses.join(' ');
    }
}));