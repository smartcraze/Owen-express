const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, rateOrder, getAllOrders, updateOrderStatus, getOrderStatus } = require('../controllers/orderController');

router.post('/payment', createOrder);
router.get('/all', getAllOrders);
router.get('/user/:email', getUserOrders);
router.get('/:id/status', getOrderStatus);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/rate', rateOrder);

module.exports = router;
