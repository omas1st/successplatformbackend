const express = require('express');
const router  = express.Router();
const lotto   = require('../controllers/lottoController');

router.get('/free',         lotto.getFree);
router.get('/premium',      lotto.getPremium);
router.get('/past-winning', lotto.getPastWinning);
router.get('/past-results', lotto.getPastResults);

module.exports = router;
