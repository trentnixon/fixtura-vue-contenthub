<template>
  <div>
    <WriteupGeneratingState
      v-if="articleStatus === 'pending' || articleStatus === 'writing'"
      :article-status="articleStatus"
      :body-text="PRESSBOX_COPY.status.generatingBodyLadder"
      :is-timed-out="isPollingTimedOut"
      :is-checking="isCheckingStatus"
      @check-status="$emit('check-status')"
      @keep-waiting="$emit('keep-waiting')"
    />

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
          (article) => article.leagues && article.leagues.length > 0
        )
      "
    >
      <div
        v-for="(article, index) in formattedArticles"
        :key="index"
        class="mb-4"
      >
        <div
          v-for="(league, leagueIndex) in article.leagues"
          :key="leagueIndex"
          class="mb-4"
        >
          <h4 class="article-title">{{ league.title }}</h4>
          <p class="article-subtitle">{{ league.subtitle }}</p>

          <p class="article-body">{{ league.article_body }}</p>

          <v-divider
            v-if="leagueIndex < article.leagues.length - 1"
            class="my-4"
          ></v-divider>
        </div>

        <v-divider
          v-if="index < formattedArticles.length - 1"
          class="my-4"
        ></v-divider>
      </div>
    </div>

    <WriteupEmptyState
      v-else
      :headline="PRESSBOX_COPY.empty.ladderHeadline"
      :subhead="PRESSBOX_COPY.empty.ladderSubhead"
      :description="PRESSBOX_COPY.empty.ladderDescription"
      :is-requesting="isRequesting"
      :is-locked="isLocked"
      @request-writeup="$emit('request-writeup')"
    />
  </div>
</template>

<script setup lang="ts">
import type { FormattedLadderArticle } from "../_composables/useLadderFormatting";
import WriteupEmptyState from "./WriteupEmptyState.vue";
import WriteupFailedState from "./WriteupFailedState.vue";
import WriteupGeneratingState from "./WriteupGeneratingState.vue";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";

defineProps<{
  articleStatus: string;
  formattedArticles: FormattedLadderArticle[];
  isRequesting?: boolean;
  isLocked?: boolean;
  isPollingTimedOut?: boolean;
  isCheckingStatus?: boolean;
  detailMessage?: string;
}>();

defineEmits<{
  "request-writeup": [];
  "check-status": [];
  "keep-waiting": [];
}>();
</script>
