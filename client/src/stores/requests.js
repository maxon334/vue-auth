import {defineStore} from "pinia";
import {ref, computed} from "vue";
import router from "@/router/index.js";
import { $app } from '@/http/axios.js'
import {useAlertStore} from "@/stores/alertStore.js";
import { useAuthStore } from '@/stores/authStore.js'

export const useRequestsStore = defineStore('filtering', () => {
  const alertStore = useAlertStore();

  let requests = ref([]);
  let nameFilter = ref('');
  let statusFilter = ref('');

  function setName(value) {
    nameFilter.value = value
  }
  function setStatus(value) {
    statusFilter.value = value
  }

  function setRequests(reqs) {
    requests.value = reqs
  }

  // фильтрация запросов при вводе в поле с именем и статусом
  const filteredRequests = computed(() =>
    requests.value
    .filter(item => {
      if (nameFilter.value) {
        if (item.fullName.toLowerCase().startsWith(nameFilter.value.toLowerCase())) {
          return item
        }
      } else {
        return item
      }
    })
    .filter(item => {
      if (statusFilter.value) {
        if (item.status === statusFilter.value) {
          return item
        }
      } else {
        return item
      }
    })
  )

  async function getRequestsByID() {
    try {
      const res = await $app.get('/api/requests/' + useAuthStore().user.id);
      setRequests(res.data.data)
    } catch (e) {console.error(e)}
  }

  async function getRequestByID(id) {
    let res;
    try {
      res = await $app.get('/api/request/' + id);
    } catch (e) {console.log(e)}
    return res;
  }

  async function addNewRequest(req) {
    try {
      await $app.post('/api/request', {
        userID: req.userID,
        fullName: req.name.value,
        telephone: req.phone.value,
        status: req.status.value,
        sum: req.sum.value,
      });
      await getRequestsByID();
      alertStore.changeAlert(true, 'primary', 'Заявка успешно создана!')
    } catch (e) {
      console.log(e);
      alertStore.changeAlert(true, 'danger', 'Что-то пошло не так...')
    }
  }

  async function changeReqState(id, status) {
    try {
      await $app.patch('/api/request/' + id, { status });
      await router.push('/requests');
      alertStore.changeAlert(true, 'warning', 'Статус заявки обновлен!');
    } catch (e) { console.log(e) }
  }

  async function deleteUser(id) {
    try {
      await $app.delete('/api/request/' + id);
      await router.push('/requests');
      alertStore.changeAlert(true, 'danger', 'Заявка удалена!');
    } catch (e) {console.log(e)}
  }

  return {
    nameFilter, statusFilter,
    setStatus, setName,
    addNewRequest,
    changeReqState,
    deleteUser,
    requests,
    getRequestsByID,
    getRequestByID,
    filteredRequests
  }
})
