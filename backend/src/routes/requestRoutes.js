const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to attach user if token present (optional auth)
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization || (req.cookies && req.cookies.accessToken)) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .get(getRequests)
  .post(optionalAuth, createRequest);

router.route('/:id')
  .patch(optionalAuth, updateRequestStatus);

module.exports = router;
