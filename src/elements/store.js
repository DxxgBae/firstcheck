import create from 'zustand';

export const stateFeatures = create((set) => ({
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
}));