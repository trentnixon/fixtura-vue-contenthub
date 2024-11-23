<template>
  <div v-if="value">
    <FormRowTwoItems>
      <template #description>
        <PrimaryButton
          color="primary"
          label="Change Media"
          @click="showModal = true"
        />
      </template>

      <template #form-element>
        <!-- Form element content here -->
        <div class="rounded-md d-flex align-center justify-center">
          <v-img
            v-if="selectedOption?.url"
            :src="selectedOption.url"
            max-width="130"
            max-height="120"
            class="rounded-md ma-0 pa-0"
          />
        </div>
      </template>
    </FormRowTwoItems>

    <!-- Preview of selected image -->
    <div class="d-flex justify-end content-end align-center mb-4"></div>

    <!-- Modal for selecting an image -->
    <v-dialog v-model="showModal" width="600">
      <v-card>
        <v-card-title>Select an Image</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                v-for="(item, index) in mediaLibraryOptions"
                :key="index"
                cols="4"
                class="d-flex flex-column align-center"
              >
                <v-img
                  :src="item.url"
                  :width="150"
                  max-height="150"
                  class="mb-0 rounded-md"
                  aspect-ratio="1"
                  cover
                />

                <PrimaryButton
                  color="success"
                  label="Select"
                  class="mt-2"
                  @click="selectImage(item)"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text @click="showModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from "vue";
import { useAccountStore } from "@/store/account";
import { storeToRefs } from "pinia";
import PrimaryButton from "@/components/primitives/buttons/PrimaryButton.vue";
import FormRowTwoItems from "@/components/forms/structure/FormRowTwoItems.vue";

const props = defineProps({
  label: String,
  value: Object, // Expecting the initial full image object
});
const emits = defineEmits(["update"]);

// Access account media library from the store
const accountStore = useAccountStore();
const { getMediaLibrary } = storeToRefs(accountStore);

// Manage modal visibility
const showModal = ref(false);

// Selected image
const selectedOption = ref(props.value);

// Media options for grid display
const mediaLibraryOptions = computed(() => {
  return getMediaLibrary.value.map((item) => {
    const { title = "Untitled Image", imageId } = item.attributes;
    const {
      url = "",
      width = null,
      height = null,
    } = imageId?.data?.attributes || {};
    return { title, url, width, height };
  });
});

// Watch for changes in the parent `value` prop to keep the internal state in sync
watch(
  () => props.value,
  (newValue) => {
    selectedOption.value = newValue;
  }
);

// Handle selecting an image
function selectImage(item) {
  selectedOption.value = item;
  emits("update", item); // Emit the selected image details to the parent
  showModal.value = false; // Close the modal
}
</script>
