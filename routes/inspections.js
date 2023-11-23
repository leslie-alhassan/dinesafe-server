const router = require('express').Router();
const inspectionController = require('../controllers/inspectionController');

router.post('/', inspectionController.addInspectionDetails);
router.get('/', inspectionController.getAllInspections);
router.get('/:establishmentId', inspectionController.getInspectionDetails);
router.put('/:inspectionId', inspectionController.updateInspectionDetails);
router.delete('/:inspectionId', inspectionController.deleteInspectionDetails);
module.exports = router;
