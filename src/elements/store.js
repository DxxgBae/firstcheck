import create from 'zustand';

export const stateFeatures = create((set) => ({
    features: [],
    addFeature: (newFeature) =>
        set((state) => {
            const updatedFeatures = [...state.features, newFeature];
            updatedFeatures.sort((a, b) => (a.property_pnu > b.property_pnu) ? 1 : -1);
            return { features: updatedFeatures };
        }),
    removeFeature: (featureToRemove) =>
        set((state) => ({ features: state.features.filter((feature) => feature !== featureToRemove) })),
}));