<template>
  <div v-if="!localMeta || !videoData" class="text-center py-4">
    <p class="text-body-2">Loading video metadata...</p>
  </div>
  <v-container v-else class="pa-0 w-100">
    <v-row>
      <v-col cols="12" sm="6" class="pa-4">
        <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-4">
          <div class="card-title py-2 px-4">Organisation Details</div>
          <v-card class="pa-4 elevation-0 bg-surface rounded-md">
            <!-- Organisation Logo -->
            <!-- TODO: Revisit this later - commenting out for now -->
            <!-- <MediaImageInput v-if="clubData && clubData.logo" :value="clubData.logo" @update="updateClubLogo" /> -->

            <!-- Hero Image - Only show when useBackground is "Image" -->
            <MediaImageInput v-if="shouldShowHeroImage && videoMedia && videoMedia.HeroImage"
              :value="videoMedia.HeroImage" @update="updateHeroImage" />

            <FormRowTwoItems>
              <template #description>
                <!-- Description content here -->
                <p class="text-body">Edit Organisation Name</p>
              </template>

              <template #form-element>
                <!-- Form element content here -->
                <TextInput v-if="clubData" label="Organisation Name" :value="clubData.Name || clubData.name"
                  @update="(val) => updateClubName(val)" />
              </template>
            </FormRowTwoItems>
            <FormRowTwoItems>
              <template #description>
                <ColorInput v-if="themeData" label="Primary Color" :value="themeData.primary"
                  @update="(val) => updateThemePrimary(val)" />
              </template>

              <template #form-element>
                <!-- Form element content here -->
                <ColorInput v-if="themeData" label="Secondary Color" :value="themeData.secondary"
                  @update="(val) => updateThemeSecondary(val)" />
              </template>
            </FormRowTwoItems>
          </v-card>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" class="pa-4">
        <v-card class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-4">
          <div class="card-title py-2 px-4">Titles</div>
          <v-card class="pa-4 elevation-0 bg-surface rounded-md">
            <v-row>
              <v-col cols="12" class="px-0">
                <div class="pa-2 d-flex justify-start content-center align-center">
                  <TextInput v-if="videoData && videoMetadata" label="Opening Video Title"
                    :value="videoMetadata.title || videoMetadata.Title || videoData.Title || videoData.videoTitle"
                    @update="(val) => updateVideoTitle(val)" />
                </div>
              </v-col>
            </v-row>
            <FormRowTwoItems>
              <template #description>
                <TextInput v-if="videoMetadata && videoMetadata.titleSplit" label="Section Title"
                  :value="videoMetadata.titleSplit[0]" @update="(val) => updateTitleSplit(0, val)" />
              </template>

              <template #form-element>
                <!-- Form element content here -->
                <TextInput v-if="videoMetadata && videoMetadata.titleSplit" label="Section Subtitle"
                  :value="videoMetadata.titleSplit[1]" @update="(val) => updateTitleSplit(1, val)" />
              </template>
            </FormRowTwoItems>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { defineProps, defineEmits } from "vue";
import TextInput from "@/pages/edit/AssetEditPortals/formElements/TextInput.vue";
import ColorInput from "@/pages/edit/AssetEditPortals/formElements/ColorInput.vue";
import FormRowTwoItems from "@/components/forms/structure/FormRowTwoItems.vue";
import MediaImageInput from "@/pages/edit/AssetEditPortals/formElements/MediaImageInput.vue";

const props = defineProps({
  videoMeta: Object,
});
const emits = defineEmits(["update"]);

// Handle both uppercase (Video) and lowercase (video) field names
const localMeta = ref(
  props.videoMeta ? JSON.parse(JSON.stringify(props.videoMeta)) : null
);

// Computed properties to handle different data structures
const videoData = computed(() => {
  if (!localMeta.value) return null;
  // Handle both uppercase (Video) and lowercase (video)
  const video = localMeta.value.Video || localMeta.value.video || null;
  console.log("[VideoMetaDataEdit] videoData computed:", video);
  return video;
});

const clubData = computed(() => {
  if (!localMeta.value) return null;
  // Handle both uppercase (Club) and lowercase (club)
  const club = localMeta.value.Club || localMeta.value.club || null;
  console.log("[VideoMetaDataEdit] clubData computed:", club);
  console.log("[VideoMetaDataEdit] clubData.Name:", club?.Name || club?.name);
  console.log("[VideoMetaDataEdit] Full localMeta structure:", localMeta.value);
  return club;
});

const themeData = computed(() => {
  if (!videoData.value) return null;
  // Handle both uppercase (Theme) and lowercase (theme)
  // Also check if theme is nested in appearance
  const appearance = videoData.value.appearance || videoData.value.Appearance;
  if (appearance) {
    return appearance.theme || appearance.Theme || null;
  }
  return videoData.value.Theme || videoData.value.theme || null;
});

const videoMetadata = computed(() => {
  if (!videoData.value) return null;
  // Handle both uppercase (Metadata) and lowercase (metadata)
  return videoData.value.metadata || videoData.value.Metadata || null;
});

const videoMedia = computed(() => {
  if (!videoData.value) return null;
  // Handle both uppercase (Media) and lowercase (media)
  return videoData.value.media || videoData.value.Media || null;
});

const shouldShowHeroImage = computed(() => {
  if (!videoData.value) return false;
  // Check templateVariation.useBackground (handle both uppercase and lowercase)
  const templateVariation = videoData.value.templateVariation || videoData.value.TemplateVariation;
  if (!templateVariation) return false;

  const useBackground = templateVariation.useBackground || templateVariation.UseBackground;
  return useBackground === "Image" || useBackground === "image";
});
/* const mediaData = ref({
  url: "",
  width: null,
  height: null,
  ratio: "landscape",
  AgeGroup: "",
  AssetType: "",
  markerPosition: "",
}); */

// Update the media data when a new selection is made
/* function updateMediaData(newData) {
  console.log("[newData]", newData);
  mediaData.value = {
    ...newData,
    ratio: newData.width > newData.height ? "landscape" : "portrait",
  };
} */
// Helper functions to update localMeta safely
function updateHeroImage(val) {
  if (!localMeta.value) return;
  const video = localMeta.value.Video || localMeta.value.video;
  if (video) {
    // HeroImage is nested in media object
    const media = video.media || video.Media;
    if (media) {
      media.HeroImage = val;
    } else {
      // Create media object if it doesn't exist
      video.media = { HeroImage: val };
    }
  }
}

// TODO: Revisit this later - commenting out for now
// function updateClubLogo(val) {
//   if (!localMeta.value) return;
//   const club = localMeta.value.Club || localMeta.value.club;
//   if (club) {
//     club.logo = val;
//   }
// }

function updateClubName(val) {
  if (!localMeta.value) return;
  const club = localMeta.value.Club || localMeta.value.club;
  if (club) {
    // Handle both uppercase (Name) and lowercase (name)
    if (club.Name !== undefined) {
      club.Name = val;
    } else {
      club.name = val;
    }
  }
}

function updateThemePrimary(val) {
  if (!localMeta.value) return;
  const video = localMeta.value.Video || localMeta.value.video;
  if (video) {
    // Theme is nested in appearance object
    const appearance = video.appearance || video.Appearance;
    if (appearance) {
      const theme = appearance.theme || appearance.Theme;
      if (theme) {
        theme.primary = val;
      } else {
        // Create theme if it doesn't exist
        appearance.theme = { primary: val };
      }
    } else {
      // Fallback to direct video theme (legacy)
      const theme = video.Theme || video.theme;
      if (theme) theme.primary = val;
    }
  }
}

function updateThemeSecondary(val) {
  if (!localMeta.value) return;
  const video = localMeta.value.Video || localMeta.value.video;
  if (video) {
    // Theme is nested in appearance object
    const appearance = video.appearance || video.Appearance;
    if (appearance) {
      const theme = appearance.theme || appearance.Theme;
      if (theme) {
        theme.secondary = val;
      } else {
        // Create theme if it doesn't exist
        appearance.theme = { secondary: val };
      }
    } else {
      // Fallback to direct video theme (legacy)
      const theme = video.Theme || video.theme;
      if (theme) theme.secondary = val;
    }
  }
}

function updateVideoTitle(val) {
  if (!localMeta.value) return;
  const video = localMeta.value.Video || localMeta.value.video;
  if (video) {
    // Check if metadata exists (lowercase or uppercase)
    const metadata = video.metadata || video.Metadata;
    if (metadata) {
      // Update in metadata (lowercase or uppercase)
      if (metadata.title !== undefined) {
        metadata.title = val;
      } else if (metadata.Title !== undefined) {
        metadata.Title = val;
      } else {
        metadata.title = val; // Create lowercase if doesn't exist
      }
    } else {
      // Fallback to direct video property
      if (video.Title !== undefined) {
        video.Title = val;
      } else {
        video.title = val;
      }
    }
  }
}

function updateTitleSplit(index, val) {
  if (!localMeta.value) return;
  const video = localMeta.value.Video || localMeta.value.video;
  if (video) {
    // titleSplit is nested in metadata object
    const metadata = video.metadata || video.Metadata;
    if (metadata) {
      const titleSplit = metadata.titleSplit || metadata.TitleSplit;
      if (titleSplit && Array.isArray(titleSplit)) {
        titleSplit[index] = val;
      } else {
        // Create titleSplit array if it doesn't exist
        metadata.titleSplit = metadata.titleSplit || ['', ''];
        metadata.titleSplit[index] = val;
      }
    }
  }
}

console.log("[VideoMetaDataEdit] props.videoMeta:", props.videoMeta);
console.log("[VideoMetaDataEdit] localMeta.value after initialization:", localMeta.value);
watch(
  () => props.videoMeta,
  (newValue) => {
    if (newValue) {
      localMeta.value = JSON.parse(JSON.stringify(newValue));
    }
  }
);

watch(
  localMeta,
  () => {
    if (localMeta.value) {
      emits("update", localMeta.value);
    }
  },
  { deep: true }
);
</script>
