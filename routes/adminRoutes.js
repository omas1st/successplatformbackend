const express = require('express');
const router  = express.Router();
const admin   = require('../controllers/adminController');

// User management
router.get('/users',        admin.listUsers);
router.put('/users/:id',    admin.updateUser);
router.delete('/users/:id', admin.deleteUser);

// Balls editor
router.get('/balls',        admin.getBalls);
router.put('/balls',        admin.updateBalls);

// Past winning & results
router.get('/past-winning', admin.getPastWinning);
router.put('/past-winning', admin.updatePastWinning);
router.get('/past-results', admin.getPastResults);
router.put('/past-results', admin.updatePastResults);

// Notifications
router.post('/notify/:id',  admin.notifyUser);

// Redirect URLs
router.get('/redirects/:id', admin.getRedirects);
router.put('/redirects/:id', admin.updateRedirects);

module.exports = router;
