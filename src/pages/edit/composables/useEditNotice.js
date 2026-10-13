import { nextTick, reactive } from "vue";

export const editNotice = reactive({
  visible: false,
  message: "",
  color: "success",
  timeout: 3000,
});

export async function showEditNotice(message, color = "success") {
  editNotice.visible = false;
  editNotice.message = message;
  editNotice.color = color;
  await nextTick();
  editNotice.visible = true;
}
