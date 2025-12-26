const RequestModel = require('../models/request-model');
const mongoose = require('mongoose');

class RequestController {
    async createRequest(req, res, next) {
        try {
            const { userID, fullName, telephone, sum, status } = req.body;

            // Валидация обязательных полей
            if (!userID || !fullName || !telephone || sum === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Отсутствуют обязательные поля: userID, fullName, telephone, sum'
                });
            }

            // Валидация суммы
            if (typeof sum !== 'number' || sum < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Сумма должна быть положительным числом'
                });
            }

            // Создание нового запроса
            const newRequest = await RequestModel.create({
                userID,
                fullName,
                telephone,
                sum,
                status: status || 'active'
            });

            res.status(201).json({
                success: true,
                message: 'Запрос успешно создан',
                data: newRequest
            });

        } catch (error) {
            console.error('Ошибка создания запроса:', error);

            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    message: 'Ошибка валидации',
                    errors: messages
                });
            }

            res.status(500).json({
                success: false,
                message: 'Ошибка сервера при создании запроса',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async deleteRequest(req, res, next) {
        try {
            const { id } = req.params;

            // Проверка валидности ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Некорректный ID запроса'
                });
            }

            // Поиск и удаление запроса
            const deletedRequest = await RequestModel.findByIdAndDelete(id);

            if (!deletedRequest) {
                return res.status(404).json({
                    success: false,
                    message: 'Запрос не найден'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Запрос успешно удален',
                data: deletedRequest
            });

        } catch (error) {
            console.error('Ошибка удаления запроса:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка сервера при удалении запроса',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async updateRequest(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Проверка валидности ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Некорректный ID запроса'
                });
            }

            // Проверка наличия нового статуса
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Не указан новый статус'
                });
            }

            // Поиск запроса
            const request = await RequestModel.findById(id);

            if (!request) {
                return res.status(404).json({
                    success: false,
                    message: 'Запрос не найден'
                });
            }

            // Проверка, можно ли изменить запрос
            if (!request.canBeModified()) {
                return res.status(400).json({
                    success: false,
                    message: `Запрос со статусом '${request.status}' не может быть изменен`
                });
            }

            // Обновление статуса
            const updatedRequest = await RequestModel.updateStatus(id, status);

            res.json({
                success: true,
                message: 'Статус запроса успешно обновлен',
                data: updatedRequest
            });

        } catch (error) {
            console.error('Ошибка обновления статуса:', error);

            if (error.message.includes('Недопустимый статус')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Ошибка сервера при обновлении статуса',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    async getRequestsById(req, res, next) {
        try {
            const { userID } = req.params;

            const {
                status,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                page = 1,
                limit = 10
            } = req.query;

            // Валидация параметров
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const skip = (pageNum - 1) * limitNum;
            const sortOrderValue = sortOrder === 'asc' ? 1 : -1;

            // Формирование фильтра
            const filter = { userID };
            if (status) {
                filter.status = status;
            }

            // Построение запроса
            const query = RequestModel.find(filter);

            // Применение сортировки
            query.sort({ [sortBy]: sortOrderValue });

            // Пагинация
            query.skip(skip).limit(limitNum);

            // Выполнение запроса и подсчет общего количества
            const [requests, totalCount] = await Promise.all([
                query.exec(),
                RequestModel.countDocuments(filter)
            ]);

            // Если нет запросов
            if (requests.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Запросы не найдены',
                    data: [],
                    pagination: {
                        page: pageNum,
                        limit: limitNum,
                        total: totalCount,
                        pages: Math.ceil(totalCount / limitNum)
                    }
                });
            }

            res.json({
                success: true,
                message: 'Запросы найдены',
                data: requests,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: totalCount,
                    pages: Math.ceil(totalCount / limitNum)
                }
            });

        } catch (error) {
            console.error('Ошибка выборки запросов:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка сервера при получении запросов',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = new RequestController();