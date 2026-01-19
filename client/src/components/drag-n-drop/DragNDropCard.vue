<template>
  <div class="ticket-card">
    <div class="card-content">
      <!-- Контактная информация -->
      <div class="contact-info">
        <div class="contact-name">
          <span class="label">Контакт:</span>
          <span class="value">{{ ticket.name }}</span>
        </div>
        <div class="contact-phone">
          <span class="label">Телефон:</span>
          <span class="value">{{ formatPhone(ticket.phone) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7,9)}-${cleaned.slice(9)}`
  }
  return phone
}
</script>

<style scoped>
.ticket-card {
  background: white;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  cursor: grab;
  transition: all 0.2s ease;
  position: relative;
}

.ticket-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #d1d5db;
}

.ticket-card:active {
  cursor: grabbing;
}

.ticket-card.dragging {
  opacity: 0.8;
  transform: rotate(3deg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Основное содержимое */

.contact-name, .contact-phone {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
}

.contact-name .label, .contact-phone .label {
  color: #6b7280;
  font-weight: 500;
}

.contact-name .value {
  font-weight: 600;
  color: #111827;
}

.contact-phone .value {
  font-family: 'SF Mono', monospace;
  color: #374151;
}

.contact-phone {
  margin-bottom: 0;
}

/* Футер карточки */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

.drag-handle {
  color: #d1d5db;
  cursor: grab;
  font-size: 20px;
  padding: 4px 8px;
  user-select: none;
}

.drag-handle:hover {
  color: #9ca3af;
}

/* Цветные левые границы по статусу */
.ticket-card.status-new {
  border-left: 4px solid #8b5cf6;
}

.ticket-card.status-active {
  border-left: 4px solid #3b82f6;
}

.ticket-card.status-pending {
  border-left: 4px solid #f59e0b;
}

.ticket-card.status-completed {
  border-left: 4px solid #10b981;
}
</style>
