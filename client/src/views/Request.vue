<template>
  <app-loader v-if="loading"></app-loader>
  <app-page title="Заявка" v-if="item && !loading">
    <p><strong>Имя владельца:</strong> {{ item.fullName }}</p>
    <p><strong>Телефон:</strong> {{ item.telephone }}</p>
    <p><strong>Сумма:</strong> {{ formatCurrency(item.sum) }}</p>
    <p><strong>Статус:</strong> <app-status :type="item.status" :key="item.status" /></p>

    <div class="form-control">
      <label for="status">Статус:</label>
      <select v-model="status" id="status">
        <option value="done">Завершен</option>
        <option value="canceled">Отменен</option>
        <option value="active">Активен</option>
        <option value="inProgress">Выполняется</option>
      </select>
    </div>

    <button class="btn danger" @click="requestsStore.deleteUser(id)">Удалить</button>
    <button class="btn" v-if="isChanged" @click="requestsStore.changeReqState(id, status)">Обновить</button>
  </app-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRequestsStore } from '@/stores/requests.js'
import { formatCurrency } from '@/utils/currency.js'

import AppPage from '@/components/ui/AppPage.vue'
import AppStatus from '@/components/ui/AppStatus.vue'
import AppLoader from '@/components/ui/AppLoader.vue'

const props = defineProps({
  id: String
})
const requestsStore = useRequestsStore();
let item = ref(null);
let status = ref(null);

let loading = ref(false);
let isChanged = ref(false)

onMounted(async () => {
  loading.value = true
  item.value = (await requestsStore.getRequestByID(props.id)).data.data
  status.value = item.value.status
  loading.value = false

  watch(status, () => {
    isChanged.value = true
  })
})
</script>

<style scoped></style>
