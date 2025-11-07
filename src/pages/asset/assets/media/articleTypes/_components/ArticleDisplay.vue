<template>
    <div>
        <!-- Show loading state when status is pending or writing -->
        <!-- pending: article generation queued, writing: article is being written -->
        <div v-if="articleStatus === 'pending' || articleStatus === 'writing'" class="text-center pa-8">
            <v-progress-circular indeterminate color="primary" size="64" class="mb-6"></v-progress-circular>
            <p class="text-h6 font-weight-bold mb-3">Generating new article...</p>
            <p class="article-body mb-3">
                Please wait whilst we create your article. This may take some time depending on the number of fixtures
                this week.
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
        <!-- Only show if articles have actual content (not just "No Title"/"No Subtitle" placeholders) -->
        <div v-else-if="(articleStatus === 'completed' || articleStatus === 'waiting') && formattedArticles.length > 0 && formattedArticles.some(article => article.title !== 'No Title' && article.subtitle !== 'No Subtitle')">
            <!-- Iterate through each article -->
            <div v-for="(article, index) in formattedArticles" :key="index" class="mb-4">
                <!-- Show ArticleDataForPrompt only for the first result of each article -->
                <!-- DEBUG: Hidden for production - change v-if to show -->
                <div v-if="false" class="mb-3 pa-3 bg-blue-lighten-5 rounded">
                    <div class="text-caption font-weight-bold mb-3 d-flex align-center">
                        <v-icon size="small" class="mr-2">mdi-information-outline</v-icon>
                        Article Context Data ({{ article.articleDataForPrompt?.length }} {{
                            article.articleDataForPrompt?.length === 1
                                ?
                                'match' : 'matches' }})
                    </div>
                    <div v-for="(promptData, promptIndex) in article.articleDataForPrompt" :key="promptIndex"
                        class="mb-3">
                        <div class="text-caption font-weight-bold mb-1">Match {{ promptIndex + 1 }}:</div>
                        <pre class="text-body-2 pa-2 bg-white rounded"
                            style="white-space: pre-wrap; word-break: break-all; max-height: 400px; overflow-y: auto;">{{
                                formatPromptData(promptData.prompt) }}</pre>
                    </div>
                </div>

                <h4 class="article-title">{{ article.title }}</h4>
                <p class="article-subtitle">{{ article.subtitle }}</p>
                <h5 class="article-subtitle">
                    {{ article.team1 }} {{ article.score1 }} vs {{ article.team2 }}
                    {{ article.score2 }}
                </h5>
                <p class="article-body">{{ article.articleBody }}</p>
                <p class="article-body">{{ article.highlights }}</p>
                <v-divider class="my-4"></v-divider>
            </div>
        </div>
        <div v-else class="text-center pa-8">
            <p class="article-body text-bold mb-2">AI Articles on Demand.</p>
            <p class="article-body mb-4">
                Edit, update, and create professional cricket articles instantly. Our AI analyzes match data and
                generates
                comprehensive write-ups that you can customize and refine to perfection.
            </p>
            <PrimaryButton label="Create an Article" :loading="isRequesting" :disabled="isRequesting || isLocked"
                @click="$emit('request-writeup')" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FormattedArticle } from "@/types/ArticleTypes";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";

defineProps<{
    articleStatus: string;
    formattedArticles: FormattedArticle[];
    isFirstResultForArticle: (articleId: number, currentIndex: number) => boolean;
    formatPromptData: (promptString: string) => string;
    isRequesting?: boolean;
    isLocked?: boolean;
}>();

defineEmits<{
    "request-writeup": [];
}>();
</script>
