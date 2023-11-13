import { inject, ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
export const useFormGroup = () => {
  const formBus = inject("form-events", void 0);
  const formGroup = inject("form-group", void 0);
  const blurred = ref(false);
  function emitFormEvent(type, path) {
    if (formBus) {
      formBus.emit({ type, path });
    }
  }
  function emitFormBlur() {
    emitFormEvent("blur", formGroup?.name.value);
    blurred.value = true;
  }
  function emitFormChange() {
    emitFormEvent("change", formGroup?.name.value);
  }
  const emitFormInput = useDebounceFn(() => {
    if (blurred.value) {
      emitFormEvent("input", formGroup?.name.value);
    }
  }, 300);
  return {
    emitFormBlur,
    emitFormInput,
    emitFormChange,
    formGroup
  };
};
