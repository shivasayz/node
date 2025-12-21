import express from 'express';
import tourController from '../controllers/tourController.js';
const {
  getAllTours,
  createTour,
  deleteTour,
  updateTour,
  getTourById,
  checkID,
  checkBody,
} = tourController;

const router = express.Router();

router.param('id', checkID);

router.route(`/`).get(getAllTours).post(checkBody, createTour);
router.route(`/:id`).delete(deleteTour).patch(updateTour).get(getTourById);

export default router;
