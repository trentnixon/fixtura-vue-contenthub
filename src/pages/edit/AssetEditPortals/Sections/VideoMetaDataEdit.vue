<template>
  <v-container class="pa-0 w-100">
    <v-row>
      <v-col cols="12" sm="6" class="pa-4">
        <v-card
          class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-4"
        >
          <div class="card-title py-2 px-4">Organisation Details</div>
          <v-card class="pa-4 elevation-0 bg-surface rounded-md">
            <MediaImageInput
              :value="localMeta.Video.HeroImage"
              @update="(val) => (localMeta.Video.HeroImage = val)"
            />

            <FormRowTwoItems>
              <template #description>
                <!-- Description content here -->
                <p class="text-body">Edit Organisation Name</p>
              </template>

              <template #form-element>
                <!-- Form element content here -->
                <TextInput
                  label="Organisation Name"
                  :value="localMeta.Club.Name"
                  @update="(val) => (localMeta.Club.Name = val)"
                />
              </template>
            </FormRowTwoItems>
            <FormRowTwoItems>
              <template #description>
                <ColorInput
                  label="Primary Color"
                  :value="localMeta.Video.Theme.primary"
                  @update="(val) => (localMeta.Video.Theme.primary = val)"
                />
              </template>

              <template #form-element>
                <!-- Form element content here -->
                <ColorInput
                  label="Secondary Color"
                  :value="localMeta.Video.Theme.secondary"
                  @update="(val) => (localMeta.Video.Theme.secondary = val)"
                />
              </template>
            </FormRowTwoItems>
          </v-card>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" class="pa-4">
        <v-card
          class="py-2 px-1 elevation-0 bg-surface-lighten1 rounded-md mt-4"
        >
          <div class="card-title py-2 px-4">Titles</div>
          <v-card class="pa-4 elevation-0 bg-surface rounded-md">
            <v-row>
              <v-col cols="12" class="px-0">
                <div
                  class="pa-2 d-flex justify-start content-center align-center"
                >
                  <TextInput
                    label="Opening Video Title"
                    :value="localMeta.Video.Title"
                    @update="(val) => (localMeta.Video.Title = val)"
                  />
                </div>
              </v-col>
            </v-row>
            <FormRowTwoItems>
              <template #description>
                <TextInput
                  label="Section Title"
                  :value="localMeta.Video.TitleSplit[0]"
                  @update="(val) => (localMeta.Video.TitleSplit[0] = val)"
                />
              </template>

              <template #form-element>
                <!-- Form element content here -->
                <TextInput
                  label="Section Subtitle"
                  :value="localMeta.Video.TitleSplit[1]"
                  @update="(val) => (localMeta.Video.TitleSplit[1] = val)"
                />
              </template>
            </FormRowTwoItems>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import TextInput from "@/pages/edit/AssetEditPortals/formElements/TextInput.vue";
import ColorInput from "@/pages/edit/AssetEditPortals/formElements/ColorInput.vue";
import FormRowTwoItems from "@/components/forms/structure/FormRowTwoItems.vue";
import MediaImageInput from "@/pages/edit/AssetEditPortals/formElements/MediaImageInput.vue";

const props = defineProps({
  videoMeta: Object,
});
const emits = defineEmits(["update"]);

const localMeta = ref(JSON.parse(JSON.stringify(props.videoMeta)));
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
console.log("[props.videoMeta]", props.videoMeta);
watch(
  () => props.videoMeta,
  () => {
    localMeta.value = JSON.parse(JSON.stringify(props.videoMeta));
  }
);

watch(
  localMeta,
  () => {
    emits("update", localMeta.value);
  },
  { deep: true }
);
</script>
