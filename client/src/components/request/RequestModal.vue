<template>
  <form class="card" @submit.prevent="createPerson">
    <div class="form-control" :class="{'error': errors.name, 'valid': isNameValid}">
      <label for="fio">ФИО</label>
      <input v-model="name" type="text" id="fio" @input="isFieldValid('name')" />
      <small v-if="errors.name">{{ errors.name }}</small>
    </div>

    <div class="form-control" :class="{'error': errors.phone, 'valid': isPhoneValid}">
      <label for="phone">Телефон</label>
      <input v-model="phone" type="number" id="phone" @input="isFieldValid('phone')" />
      <small v-if="errors.phone">{{ errors.phone }}</small>
    </div>

    <div class="form-control" :class="{'error': errors.sum, 'valid': isSumValid}">
      <label for="amount">Суммы</label>
      <input v-model="sum" type="number" id="amount" @input="isFieldValid('sum')" />
      <small v-if="errors.sum">{{ errors.sum }}</small>
    </div>

    <div class="form-control">
      <label for="status">Статус</label>
      <select v-model="status" id="status">
        <option value="done">Завершен</option>
        <option value="canceled">Отменен</option>
        <option value="active">Активен</option>
        <option value="inProgress">Выполняется</option>
      </select>
    </div>

    <button type="submit" class="btn primary">
      {{ !loading ? 'Создать' : '' }}
      <app-loader type="primary small" v-if="loading" />
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { isMobilePhone } from 'validator'
import { useRequestsStore } from '@/stores/requests.js'
import { useAuthStore } from '@/stores/authStore.js'
import AppLoader from '@/components/ui/AppLoader.vue'

const emits = defineEmits(['close'])
const requestsStore = useRequestsStore()
const authStore = useAuthStore()

const { errors, defineField, meta, setFieldError, validateField } = useForm({
  validationSchema: yup.object({
    name: yup.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов').required('Поле не должно быть пустым'),
    phone: yup.string().min(1, 'Неверный номер').max(15, 'Неверный номер').required('Поле не должно быть пустым'),
    sum: yup.string().min(1, 'Неверная сумма').max(15, 'Неверная сумма').required('Поле не должно быть пустым'),
  }),
});

const [name, nameAttrs] = defineField('name');
const [phone, phoneAttrs] = defineField('phone');
const [sum, sumAttrs] = defineField('sum');

let isNameValid = ref(false);
let isPhoneValid = ref(false);
let isSumValid = ref(false);
let status = ref('active');
let loading = ref(false);

function isValid() {
  if (meta.value.valid) {
    return true
  } else {
    if (!isNameValid.value) setFieldError('name', 'Заполните поле');
    if (!isPhoneValid.value) setFieldError('phone', 'Заполните поле');
    if (!isSumValid.value) setFieldError('sum', 'Заполните поле');
  }
}

// Если поле валидно - показываем это(класс valid)
async function isFieldValid(validate) {
  if (validate === 'name') {
    isNameValid.value = (await validateField(validate)).valid
  } else if (validate === 'phone') {
    isPhoneValid.value = await isMobilePhone(`${phone.value}`)
  } else if (validate === 'sum') {
    isSumValid.value = (await validateField(validate)).valid
  }
}

async function createPerson() {
  loading.value = true;
  if (isValid()) {
    const req = { userID: authStore.user.id, name, phone, sum, status }
    try {
      await requestsStore.addNewRequest(req);
      emits('close')
    } catch (e) {
      console.error(e)
    }
  }
  loading.value = false;
}
</script>

<style scoped></style>
