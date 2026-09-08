<template>
  <div>
    <div v-if="isLegacy" class="text-center pa-8">
      <v-icon color="warning" size="64" class="mb-6">mdi-alert</v-icon>
      <p class="text-h6 font-weight-bold mb-3">
        {{ PRESSBOX_COPY.legacy.title }}
      </p>
      <p class="article-body mb-4">
        {{ PRESSBOX_COPY.legacy.renderIncompatible }}
      </p>
      <p class="text-caption text-grey">
        {{ PRESSBOX_COPY.legacy.newRenderHint }}
      </p>
    </div>

    <WriteupGeneratingState
      v-else-if="articleStatus === 'pending' || articleStatus === 'writing'"
      :article-status="articleStatus"
      :body-text="PRESSBOX_COPY.status.generatingBodyDefault"
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
          (article) => article.topScorers && article.topScorers.length > 0
        )
      "
    >
      <div
        v-for="(article, index) in formattedArticles"
        :key="index"
        class="mb-4"
      >
        <h4 class="article-title">{{ article.title }}</h4>
        <p class="article-subtitle">{{ article.subtitle }}</p>

        <v-divider class="my-4"></v-divider>

        <div
          v-for="(scorer, scorerIndex) in article.topScorers"
          :key="scorerIndex"
          class="mb-4"
        >
          <h5 class="article-title">
            {{ scorer.position }}. {{ scorer.player_name }}
          </h5>

          <p class="article-body">{{ scorer.performance_stats }}</p>

          <p class="article-body">{{ scorer.article_body }}</p>

          <v-divider
            v-if="scorerIndex < article.topScorers.length - 1"
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
      :headline="headlineText"
      :subhead="subheadText"
      :description="descriptionText"
      :is-requesting="isRequesting"
      :is-locked="isLocked"
      @request-writeup="$emit('request-writeup')"
    />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import type { FormattedTop5Article } from "../_composables/useTop5Formatting";
import WriteupEmptyState from "./WriteupEmptyState.vue";
import WriteupFailedState from "./WriteupFailedState.vue";
import WriteupGeneratingState from "./WriteupGeneratingState.vue";
import { PRESSBOX_COPY } from "@/constants/pressboxCopy";

const props = withDefaults(
  defineProps<{
    articleStatus: string;
    formattedArticles: FormattedTop5Article[];
    isRequesting?: boolean;
    isLocked?: boolean;
    isPollingTimedOut?: boolean;
    isCheckingStatus?: boolean;
    detailMessage?: string;
    isLegacy?: boolean;
    headlineText?: string;
    subheadText?: string;
    descriptionText?: string;
  }>(),
  {
    headlineText: PRESSBOX_COPY.empty.top5DefaultHeadline,
    descriptionText: PRESSBOX_COPY.empty.top5DefaultDescription,
  }
);

const {
  articleStatus,
  formattedArticles,
  isRequesting,
  isLocked,
  isLegacy,
  headlineText,
  subheadText,
  descriptionText,
} = toRefs(props);

defineEmits<{
  "request-writeup": [];
  "check-status": [];
  "keep-waiting": [];
}>();
</script>
