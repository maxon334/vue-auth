<template>
    <verify-email v-if="!authStore.isVerified" />
    <app-page v-if="!loading">
      <button :disabled="!authStore.isAuthenticated" class="btn primary" style="position: absolute; right: 20px; top: 20px"
              @click="isModalOpen = true">Создать
      </button>

      <request-filter ></request-filter>
      <request-table :requests="requestsStore.filteredRequests"></request-table>
      <teleport to="body">
        <app-modal title="Создание пользователя" v-if="isModalOpen" @close="closeModal">
          <request-modal @close="closeModal" />
        </app-modal>
      </teleport>
    </app-page>
    <teleport to="body">
      <app-message v-if="alertStore.alert.show" :type="alertStore.alert.type" :text="alertStore.alert.text" />
      <app-loader v-if="loading" />
    </teleport>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAlertStore } from "@/stores/alertStore.js";
import { useAuthStore } from "@/stores/authStore.js";
import {useRequestsStore} from "@/stores/requests.js";

import AppPage from '../components/ui/AppPage.vue'
import RequestTable from '../components/request/RequestTable.vue'
import RequestModal from '../components/request/RequestModal.vue'
import RequestFilter from '../components/request/RequestFilter.vue'
import AppModal from '../components/ui/AppModal.vue'
import AppLoader from '../components/ui/AppLoader.vue'
import AppMessage from "@/components/ui/AppMessage.vue";
import VerifyEmail from "@/components/VerifyEmail.vue";

const alertStore = useAlertStore();
const authStore = useAuthStore();
const requestsStore = useRequestsStore();
const isModalOpen = ref(false);

let loading = ref(false);

alertStore.closeAlert();

function closeModal() {
  isModalOpen.value = false
}

onMounted(async () => {
  loading.value = true;
  authStore.$subscribe(async (mutation) => {
    if (mutation.events.newValue.id) {
      await requestsStore.getRequestsByID();
    }
  });
  try {
    await useRequestsStore().getRequestsByID();
  } catch (e) {console.log(e)}
  loading.value = false;
})
</script>
