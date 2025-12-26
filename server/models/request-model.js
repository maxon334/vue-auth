const {Schema, model} = require('mongoose');

const RequestSchema = new Schema({
    userID: {
        type: String,
        required: [true, 'User ID обязателен'],
        index: true // Для быстрого поиска по userID
    },
    fullName: {
        type: String,
        required: [true, 'Полное имя обязательно'],
        trim: true
    },
    telephone: {
        type: String,
        required: [true, 'Телефон обязателен'],
        match: [/^[\+]?[0-9\s\-\(\)]+$/, 'Введите корректный номер телефона']
    },
    sum: {
        type: Number,
        required: [true, 'Сумма обязательна'],
        min: [0, 'Сумма не может быть отрицательной']
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['active', 'done', 'canceled', 'inProgress'],
            message: 'Недопустимый статус. Доступные: active, done, canceled, inProgress'
        },
        default: 'active'
    }
}, {
    timestamps: true // Автоматически управляет createdAt и updatedAt
});

// Статический метод для обновления статуса
RequestSchema.statics.updateStatus = async function(requestId, newStatus) {
    const allowedStatuses = ['active', 'done', 'canceled', 'inProgress'];

    if (!allowedStatuses.includes(newStatus)) {
        throw new Error(`Недопустимый статус. Доступные: ${allowedStatuses.join(', ')}`);
    }

    return this.findByIdAndUpdate(
        requestId,
        {
            status: newStatus
        },
        { new: true, runValidators: true }
    );
};

// Метод экземпляра для проверки, может ли запрос быть изменен
RequestSchema.methods.canBeModified = function() {
    const nonModifiableStatuses = ['completed', 'rejected'];
    return !nonModifiableStatuses.includes(this.status);
};

module.exports = model('Request', RequestSchema);