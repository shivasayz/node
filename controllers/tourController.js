import { format } from 'morgan';
import { Tour } from '../models/modelsExport.js';
import APIFeatures from './../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';

// middlewares
const aliasTopTours = (req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: {
      limit: '5',
      sort: 'price',
      fields: 'name,price,ratingAverage,summary,difficulty',
    },
    writable: true,
    configurable: true,
  });

  next();
};

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

const getAllTours = catchAsync(async (req, res,next) => {
  // execute query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // send response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

const getTourById = catchAsync(async (req, res,next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({_id: req.params.id});
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    result: {
      status: 'update success',
      data: {
        tour,
      },
    },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    result: {
      status: 'delete success',
    },
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTour: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRatings: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    // {
    //   $match: { _id: { $ne: 'DIFFICULT' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
        monthStr: {
          $arrayElemAt: [
            [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
            { $subtract: ['$_id', 1] },
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numToursStarts: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    total: plan.length,
    data: {
      plan,
    },
  });
});

export default {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
