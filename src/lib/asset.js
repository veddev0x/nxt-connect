const {assets} = require('../utils/core');

const getAssetSlugById = (id) => {
    const asset = assets.find(asset => asset.id === id);

    return asset ? asset.slug : new Error('Please provide a valid asset id!')
};

const getAssetIdBySlug = (slug) => {
    const asset = assets.find(asset => asset.slug === slug);

    return asset ? asset.id : new Error('Please provide a valid asset slug!')
};

const getAssetDenominatorByAsset = (identifier) => {
    const asset = assets.find(asset => asset.slug === identifier || asset.id === identifier || asset.description === identifier);

    return asset ? asset.decimals : new Error('Please provide a valid asset!')
};

const getAssetDescriptionByAsset = (identifier) => {
    const asset = assets.find(asset => asset.slug === identifier || asset.id === identifier || asset.description === identifier);

    return asset ? asset.description : new Error('Please provide a valid asset!')
};

module.exports = {
    getAssetSlugById,
    getAssetIdBySlug,
    getAssetDenominatorByAsset,
    getAssetDescriptionByAsset
};