import {defineStore} from "pinia";
import {ref, computed, reactive, toRaw, isReactive, isRef} from "vue";
import router from "@/router/index.js";
import axios from "axios";
import {useAlertStore} from "@/stores/alertStore.js";
import { $app } from '@/http/axios.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useStore } from '@/stores/store.js'


export const useRequestsStore = defineStore('filtering', () => {
  const alertStore = useAlertStore();
  const authStore = useAuthStore();

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
  function filterRequests() {
    return computed(() => {
      return requests.value.filter(item => {
        if (nameFilter.value !== '' && statusFilter.value !== '') {
          if (item.fullName.toLowerCase().startsWith(nameFilter.value.toLowerCase()) && item.status === statusFilter.value) {
            return item
          }
        } else if (nameFilter.value === '' && statusFilter.value !== '') {
          if (item.status === statusFilter.value) {
            return item
          }
        } else if (nameFilter.value !== '' && statusFilter.value === '') {
          if (item.fullName.toLowerCase().startsWith(nameFilter.value.toLowerCase())) {
            return item
          }
        } else if (nameFilter.value === '' && statusFilter.value === '') {
          return item
        }
      })
    })
  }

  async function getRequestsByID() {
    try {
      const res = await $app.get('/api/requests/' + useAuthStore().user.id);
      setRequests(res.data.data)
    } catch (e) {console.log(e)}
  }

  async function getRequestByID(id) {
    useStore().setLoading(true);
    let res;
    try {
      res = await $app.get('/api/request/' + id);
      console.log(res)
    } catch (e) {console.log(e)}
    useStore().setLoading(false);
    return res;
  }

  async function addNewRequest(req) {
    useStore().setLoading(true);

    try {
      await $app.post('/api/request', {
        userID: req.userID,
        fullName: req.name.value,
        telephone: req.phone.value,
        status: req.status.value,
        sum: req.sum.value,
      });
      await getRequestsByID();
      useStore().setLoading(false);
    } catch (e) {console.log(e); useStore().setLoading(false);}
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
    filterRequests,
    setStatus, setName,
    addNewRequest,
    changeReqState,
    deleteUser,
    requests,
    setRequests,
    getRequestsByID,
    getRequestByID
  }
})
