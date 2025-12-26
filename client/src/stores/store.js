import {ref} from 'vue';
import { defineStore } from 'pinia';

import {useAlertStore} from "@/stores/alertStore.js";

export const useStore = defineStore('store', () => {
  const alertStore = useAlertStore();

  let showMessage = ref(false);
  const isModalOpen = ref(false);
  let isLoading = ref(false);

  function setLoading(value) {
    isLoading.value = value
    console.log(isLoading.value)
  }

  return {
    showMessage,
    isModalOpen,
    isLoading,
    setLoading
  }
});


// const count = ref(0)
// const doubleCount = computed(() => count.value * 2)
// function increment() {
//   count.value++
// }


