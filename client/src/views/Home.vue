<template>
  <the-navbar />
  <app-page>
    <button class="btn primary" style="position: absolute; right: 20px; top: 20px"
            @click="store.isModalOpen = !store.isModalOpen">Создать
    </button>

    <request-filter ></request-filter>
    <request-table :requests="requestsStore.filterRequests().value"></request-table>
    <the-sidebar v-if="store.showMessage" />
    <app-modal title="Создание пользователя" v-if="store.isModalOpen">
      <request-modal />
    </app-modal>
  </app-page>
  <app-message v-if="alertStore.alert.show" :type="alertStore.alert.type" :text="alertStore.alert.text" />
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "@/stores/store.js";
import { useAlertStore } from "@/stores/alertStore.js";
import { useAuthStore } from "@/stores/authStore.js";
import {useRequestsStore} from "@/stores/requests.js";
import { $app } from '@/http/axios.js'

import AppPage from '../components/ui/AppPage.vue'
import RequestTable from '../components/request/RequestTable.vue'
import RequestModal from '../components/request/RequestModal.vue'
import RequestFilter from '../components/request/RequestFilter.vue'
import AppModal from '../components/ui/AppModal.vue'
import AppLoader from '../components/ui/AppLoader.vue'
import TheNavbar from "@/components/TheNavbar.vue";
import TheSidebar from "@/components/TheSidebar.vue";
import AppMessage from "@/components/ui/AppMessage.vue";


export default {
  setup() {
    const store = useStore();
    const alertStore = useAlertStore();
    const authStore = useAuthStore();
    const requestsStore = useRequestsStore();

    const isModalOpen = ref(false);

    onMounted(async () => {

    });

    return {
      store, alertStore, authStore, requestsStore,
      isModalOpen
    }
  },
  components: {
    AppMessage,
    TheSidebar, TheNavbar,
    AppPage, RequestTable,
    RequestModal, RequestFilter,
    AppModal, AppLoader
  },
}
</script>
