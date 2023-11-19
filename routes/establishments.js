const router = require('express').Router();

const establishmentController = require('../controllers/establishmentController');

router.get('/', establishmentController.getAllEstablishments);
router.get('/:establishmentId', establishmentController.getEstablishment);
router.post('/', establishmentController.addEstablishment);
router.put('/:establishmentId', establishmentController.updateEstablishment);
router.delete('/:establishmentId', establishmentController.deleteEstablishment);

module.exports = router;
