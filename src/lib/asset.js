const {assets} = require('../utils/core');

const getAssetSlugById = (id) => {
    const asset = assets.find(asset => asset.id === id);

    if (!asset) {
        throw new Error('Please provide a valid asset id!')
    } else {
        return asset.slug
    }
};

const getAssetIdBySlug = (slug) => {
    const asset = assets.find(asset => asset.slug === slug);

    if (!asset) {
        throw new Error('Please provide a valid asset slug!')
    } else {
        return asset.id
    }
};

const getAssetDenominatorByAsset = (identifier) => {
    const asset = assets.find(asset => asset.slug === identifier || asset.id === identifier);

    if (!asset) {
        throw new Error('Please provide a valid asset!')
    } else {
        return asset.decimals
    }
};

const getAssetDescriptionByAsset = (identifier) => {
    const asset = assets.find(asset => asset.slug === identifier || asset.id === identifier);

    if (!asset) {
        throw new Error('Please provide a valid asset!')
    } else {
        return asset.description
    }
};

module.exports = {
    getAssetSlugById,
    getAssetIdBySlug,
    getAssetDenominatorByAsset,
    getAssetDescriptionByAsset
};