import create from 'zustand';

export const stateFeatures = create((set) => ({
    features: [],
    addFeature: (newFeature) =>
        set((state) => ({ features: [...state.features, newFeature] })),
    removeFeature: (featureToRemove) =>
        set((state) => ({ features: state.features.filter((feature) => feature !== featureToRemove) })),
}));