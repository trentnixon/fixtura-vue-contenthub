<template>
    <div>
        <!-- Legacy article incompatibility message - check FIRST before other states -->
        <div v-if="isLegacy" class="text-center pa-8">
            <v-icon color="warning" size="64" class="mb-6">mdi-alert</v-icon>
            <p class="text-h6 font-weight-bold mb-3">Legacy Article Detected</p>
            <p class="article-body mb-4">
                This Render is no longer compatible with the new AI system.
            </p>
            <p class="text-caption text-grey">
                Please create a new render to use the latest AI article features.
            </p>
        </div>

        <!-- Show loading state when status is pending or writing -->
        <!-- pending: article generation queued, writing: article is being written -->
        <div v-else-if="articleStatus === 'pending' || articleStatus === 'writing'" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" size="64" class="mb-6"></v-progress-circular>
            <p class="text-h6 font-weight-bold mb-3">Generating new article...</p>
            <p class="article-body mb-3">
                Please wait whilst we create your Top 5 article. This may take some time.
            </p>
            <p class="text-caption text-grey">
                You can leave and check back later if you wish.
            </p>
        </div>

        <!-- Show error state when status is failed -->
        <div v-else-if="articleStatus === 'failed'" class="text-center pa-8">
            <v-icon color="error" size="64" class="mb-6">mdi-alert-circle</v-icon>
            <p class="text-h6 font-weight-bold mb-3 text-error">Article generation failed</p>
            <p class="article-body mb-3">
                We encountered an issue while creating your article. This may happen if the article has been locked due
                to reaching the feedback limit or if it's too old.
            </p>
            <p class="text-caption text-grey mb-4">
                Please try requesting a new write-up or contact support if the issue persists.
            </p>
            <PrimaryButton label="Try Again" :loading="isRequesting" :disabled="isRequesting || isLocked"
                @click="$emit('request-writeup')" />
        </div>

        <!-- Check if articles exist with valid content (show when status is completed or waiting) -->
        <!-- waiting status indicates article exists and is ready (backward compatibility for legacy articles) -->
        <!-- Only show if articles have actual content (topScorers), not just placeholder records -->
        <div
            v-else-if="(articleStatus === 'completed' || articleStatus === 'waiting') && formattedArticles.length > 0 && formattedArticles.some(article => article.topScorers && article.topScorers.length > 0)">
            <!-- Iterate through each article -->
            <div v-for="(article, index) in formattedArticles" :key="index" class="mb-4">
                <!-- Article Title -->
                <h4 class="article-title">{{ article.title }}</h4>
                <p class="article-subtitle">{{ article.subtitle }}</p>

                <!-- Divider -->
                <v-divider class="my-4"></v-divider>

                <!-- Top Scorers List -->
                <div v-for="(scorer, scorerIndex) in article.topScorers" :key="scorerIndex" class="mb-4">
                    <!-- Scorer Position and Name -->
                    <h5 class="article-title">
                        {{ scorer.position }}. {{ scorer.player_name }}
                    </h5>

                    <!-- Performance Stats -->
                    <p class="article-body">{{ scorer.performance_stats }}</p>

                    <!-- Article Body -->
                    <p class="article-body">{{ scorer.article_body }}</p>

                    <!-- Divider Between Scorers (except last) -->
                    <v-divider v-if="scorerIndex < article.topScorers.length - 1" class="my-4"></v-divider>
                </div>

                <!-- Divider Between Articles -->
                <v-divider v-if="index < formattedArticles.length - 1" class="my-4"></v-divider>
            </div>
        </div>

        <!-- No articles state -->
        <div v-else class="text-center pa-8">
            <p class="article-body text-bold mb-2">AI Top 5 Articles on Demand.</p>
            <p class="article-body mb-4">
                Create professional Top 5 performance articles instantly. Our AI analyzes player data and generates
                comprehensive listicles that you can customize and refine to perfection.
            </p>
            <PrimaryButton label="Create an Article" :loading="isRequesting" :disabled="isRequesting || isLocked"
                @click="$emit('request-writeup')" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FormattedTop5Article } from "../_composables/useTop5Formatting";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";

const props = defineProps<{
    articleStatus: string;
    formattedArticles: FormattedTop5Article[];
    isRequesting?: boolean;
    isLocked?: boolean;
    isLegacy?: boolean;
}>();

defineEmits<{
    "request-writeup": [];
}>();
</script>
