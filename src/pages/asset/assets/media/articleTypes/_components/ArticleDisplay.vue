<template>
  <div>
    <WriteupGeneratingState
      v-if="articleStatus === 'pending' || articleStatus === 'writing'"
      :article-status="articleStatus"
      :body-text="PRESSBOX_COPY.status.generatingBodyWeekend"
      :is-timed-out="isPollingTimedOut"
      :is-checking="isCheckingStatus"
      @check-status="$emit('check-status')"
      @keep-waiting="$emit('keep-waiting')"
    />

    <!-- Show error state when status is failed -->
    <WriteupFailedState
      v-else-if="articleStatus === 'failed'"
      :is-locked="isLocked"
      :is-requesting="isRequesting"
      :detail-message="detailMessage"
      @retry="$emit('request-writeup')"
    />

    <div
      v-else-if="
        (articleStatus === 'completed' || articleStatus === 'waiting') &&
        formattedArticles.length > 0 &&
        formattedArticles.some(
          (article) =>
            article.title !== 'No Title' && article.subtitle !== 'No Subtitle'
        )
      "
    >
      <div
        v-for="(article, index) in formattedArticles"
        :key="index"
        class="mb-4"
      >
        <div v-if="false" class="mb-3 pa-3 bg-blue-lighten-5 rounded">
          <div class="text-caption font-weight-bold mb-3 d-flex align-center">
            <v-icon size="small" class="mr-2">mdi-information-outline</v-icon>
            Article Context Data ({{ article.articleDataForPrompt?.length }}
            {{
              article.articleDataForPrompt?.length === 1 ? "match" : "matches"
            }})
          </div>
          <div
            v-for="(promptData, promptIndex) in article.articleDataForPrompt"
            :key="promptIndex"
            class="mb-3"
          >
            <div class="text-caption font-weight-bold mb-1">
              Match {{ promptIndex + 1 }}:
            </div>
            <pre
              class="text-body-2 pa-2 bg-white rounded"
              style="
                white-space: pre-wrap;
                word-break: break-all;
                max-height: 400px;
                overflow-y: auto;
              "
              >{{ formatPromptData(promptData.prompt) }}</pre
            >
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
    <WriteupEmptyState
      v-else
      :headline="PRESSBOX_COPY.empty.headline"
      :subhead="PRESSBOX_COPY.empty.weekendSubhead"
      :description="PRESSBOX_COPY.empty.weekendDescription"
      :is-requesting="isRequesting"
      :is-locked="isLocked"
      @request-writeup="$emit('request-writeup')"
    >
      <DataValidity_weekendresults
        :articles="articles"
        :isSavingFixtures="isSavingFixtures"
      />
    </WriteupEmptyState>
  </div>
</template>

<script setup lang="ts">
import type { FormattedArticle, FlattenedArticle } from "@/types/ArticleTypes";
import WriteupEmptyState from "./WriteupEmptyState.vue";
import WriteupFailedState from "./WriteupFailedState.vue";
import WriteupGeneratingState from "./WriteupGeneratingState.vue";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";
import DataValidity_weekendresults from "./DataValidity_weekendresults.vue";

defineProps<{
  articleStatus: string;
  formattedArticles: FormattedArticle[];
  isFirstResultForArticle: (articleId: number, currentIndex: number) => boolean;
  formatPromptData: (promptString: string) => string;
  isRequesting?: boolean;
  isLocked?: boolean;
  isPollingTimedOut?: boolean;
  isCheckingStatus?: boolean;
  detailMessage?: string;
  articles?: FlattenedArticle[];
  isSavingFixtures?: boolean;
}>();

defineEmits<{
  "request-writeup": [];
  "check-status": [];
  "keep-waiting": [];
}>();
</script>
