<template>
    <div v-if="!selectedAsset">No data available for the selected asset.</div>
    <div v-else>
        <h1>{{ selectedAsset?.type }} - Asset Details</h1>

        <!-- Display filtered downloads -->
        <h2>Filtered Downloads ({{ getTotalDownloads }})</h2>
        <ul>
            <li v-for="download in getFilteredDownloads" :key="download.assetId">
                Download ID: {{ download.assetId }} (Category: {{ download.assetCategoryID }})
            </li>
        </ul>

        <!-- Display full downloads -->
        <h2>Full Downloads</h2>
        <ul>
            <li v-for="fullDownload in getFullDownloads" :key="fullDownload?.id">
                <strong>Download ID:</strong> {{ fullDownload?.id || 'N/A' }}<br />
                <strong>Name:</strong> {{ fullDownload?.attributes?.Name || 'N/A' }}<br />
                <strong>Type:</strong> {{ fullDownload?.attributes?.asset_category?.data?.attributes?.Name || 'Unknown'
                }}
            </li>
        </ul>

        <!-- Display filtered AI articles -->
        <h2>Filtered AI Articles ({{ getTotalArticles }})</h2>
        <ul>
            <li v-for="article in getFilteredAiArticles" :key="article.articleId">
                Article: {{ article.articleName }}
            </li>
        </ul>

        <!-- Display full AI articles -->
        <h2>Full AI Articles</h2>
        <ul>
            <li v-for="fullAiArticle in getFullAiArticles" :key="fullAiArticle?.id">
                <strong>Article ID:</strong> {{ fullAiArticle?.id || 'N/A' }}<br />
                <strong>Name:</strong> {{ fullAiArticle?.attributes?.Name || 'N/A' }}<br />
                <strong>Category:</strong> {{ fullAiArticle?.attributes?.asset_category?.data?.attributes?.Name ||
                    'Unknown' }}
            </li>
        </ul>
    </div>
</template>

<script setup>

import { useAssetDownloadData } from '@/pages/asset/composables/useAssetDownloadData';

const {
    selectedAsset,
    getFilteredDownloads,
    getFilteredAiArticles,
    getFullDownloads,
    getFullAiArticles,
    getTotalDownloads,
    getTotalArticles,

} = useAssetDownloadData();
</script>
