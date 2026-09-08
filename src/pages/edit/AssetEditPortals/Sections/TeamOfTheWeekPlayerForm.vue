<template>
  <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md h-100">
    <div class="card-title py-2 px-4">
      Edit {{ categoryLabel }} — {{ displayName }}
    </div>
    <v-card class="pa-4 elevation-0 bg-surface rounded-md">
      <v-container class="pa-0">
        <div class="pa-1 mb-4">
          <div class="d-flex align-center ga-3 totw-team-row">
            <v-select
              v-if="showTeamPicker"
              label="Team"
              :items="teamOptions"
              item-title="name"
              item-value="name"
              :model-value="getSelectedClubName"
              @update:model-value="updateClubByName"
              variant="outlined"
              density="compact"
              class="flex-grow-1"
              :loading="accountState.loading"
              :disabled="isSingleTeamOption"
              :hint="
                isClubAccount
                  ? 'Club accounts use their own team and logo.'
                  : undefined
              "
              :persistent-hint="isClubAccount"
            />

            <TextInput
              v-else
              class="flex-grow-1"
              label="Primary Team"
              :value="player.primaryTeam"
              :validations="[isValidName]"
              @update="(val) => updateField('primaryTeam', val)"
            />

            <v-avatar size="48" class="flex-shrink-0">
              <v-img
                :src="player.club?.logo?.url || icons?.default?.logo"
                :alt="player.primaryTeam || displayName"
              />
            </v-avatar>
          </div>
        </div>

        <FormRowTwoItems>
          <template #description>
            <TextInput
              label="Player Name"
              :value="player.player"
              :validations="[isValidName, isRequired]"
              @update="(val) => updateField('player', val)"
            />
          </template>
          <template #form-element>
            <v-select
              label="Category"
              :items="TOTW_CATEGORY_OPTIONS"
              :model-value="playerCategory"
              @update:model-value="updateCategory"
              variant="outlined"
              density="compact"
            />
          </template>
        </FormRowTwoItems>

        <v-row v-if="showPositionSelect" class="ma-0">
          <v-col cols="12" sm="6" class="pa-1 mb-2">
            <v-select
              label="Sub-category"
              :items="positionSelectItems"
              item-title="label"
              item-value="value"
              :model-value="playerPosition"
              @update:model-value="updatePosition"
              variant="outlined"
              density="compact"
              hint="Controls icon and stats in the video render."
              persistent-hint
            />
          </v-col>
        </v-row>

        <template v-for="(pair, pairIndex) in statFieldPairs" :key="pairIndex">
          <FormRowTwoItems>
            <template #description>
              <StatField
                v-if="pair[0]"
                :field="pair[0]"
                :player="player"
                @update="updateField"
              />
            </template>
            <template #form-element>
              <StatField
                v-if="pair[1]"
                :field="pair[1]"
                :player="player"
                @update="updateField"
              />
            </template>
          </FormRowTwoItems>
        </template>
      </v-container>
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import FormRowTwoItems from "@/components/forms/structure/FormRowTwoItems.vue";
import TextInput from "@/pages/edit/AssetEditPortals/formElements/TextInput.vue";
import StatField from "./TeamOfTheWeekStatField.vue";
import { useAccountStore } from "@/store/account";
import {
  isRequired,
  isValidName,
} from "@/pages/edit/validations/genericValidations";
import type {
  TotwEditCategory,
  TotwPlayer,
  TotwPositionSlug,
} from "@/types/TeamOfTheWeek";
import {
  TOTW_CATEGORY_OPTIONS,
  getCategoryPositionLabel,
  getPlayerDisplayName,
  getPositionSelectItemsForCategory,
  getStatFieldsForCategory,
  resolveTotwEditCategory,
  showPositionSelectForCategory,
  type TotwStatFieldConfig,
} from "@/pages/edit/composables/useTotwPlayerStats";
import { useTotwTeamOptions } from "@/pages/edit/composables/useTotwTeamOptions";

const props = defineProps<{
  player: TotwPlayer;
  index: number;
}>();

const emit = defineEmits<{
  updateField: [payload: { key: string; value: unknown }];
}>();

const icons = inject("icons") as { default: { logo: string } };
const accountState = useAccountStore();
const { teamOptions, showTeamPicker, isClubAccount, isSingleTeamOption } =
  useTotwTeamOptions();

const displayName = computed(() => getPlayerDisplayName(props.player));
const categoryLabel = computed(() => getCategoryPositionLabel(props.player));
const playerCategory = computed(() => resolveTotwEditCategory(props.player));
const playerPosition = computed(
  () =>
    (props.player.categoryDetail?.position as TotwPositionSlug | undefined) ??
    null
);
const showPositionSelect = computed(() =>
  showPositionSelectForCategory(playerCategory.value)
);
const positionSelectItems = computed(() =>
  getPositionSelectItemsForCategory(playerCategory.value)
);

const statFieldPairs = computed(() => {
  const fields = getStatFieldsForCategory(playerCategory.value);
  const pairs: [TotwStatFieldConfig | null, TotwStatFieldConfig | null][] = [];

  for (let i = 0; i < fields.length; i += 2) {
    pairs.push([fields[i] ?? null, fields[i + 1] ?? null]);
  }

  return pairs;
});

const getSelectedClubName = computed(() => {
  if (props.player.club?.name) return props.player.club.name;
  if (props.player.primaryTeam) return props.player.primaryTeam;

  const logo = props.player.club?.logo;
  if (!logo?.url) return null;

  const club = teamOptions.value.find(
    (c: {
      logo: { url: string; width: number; height: number };
      name: string;
    }) =>
      c.logo.url === logo.url &&
      c.logo.width === logo.width &&
      c.logo.height === logo.height
  );
  return club ? club.name : null;
});

function updateField(key: string, value: unknown) {
  emit("updateField", { key, value });
}

function updateCategory(category: TotwEditCategory) {
  updateField("category", category);
}

function updatePosition(position: TotwPositionSlug | null) {
  if (!position) return;
  updateField("categoryDetail.position", position);
}

function updateClubByName(newClubName: string) {
  const selectedClub = teamOptions.value.find(
    (club: {
      name: string;
      logo?: { url: string; width: number; height: number };
    }) => club.name === newClubName
  );
  if (selectedClub?.logo) {
    updateField("club", {
      name: newClubName,
      logo: selectedClub.logo,
    });
    updateField("primaryTeam", newClubName);
    updateField("batting.team", newClubName);
    updateField("bowling.team", newClubName);
  }
}
</script>

<style scoped>
.totw-team-row {
  min-height: 48px;
}

.totw-team-row :deep(.v-input) {
  width: 100%;
}
</style>
