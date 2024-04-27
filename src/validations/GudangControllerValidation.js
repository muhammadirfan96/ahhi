import { body, param, query } from 'express-validator';
import PemasokModel from '../models/PemasokModel.js';
import PelangganModel from '../models/PelangganModel.js';
import runValidation from '../middlewares/runValidation.js';
import { showInventoriBarangValidation } from './InventoriBarangValidation.js';
import { showLokasiPenyimpananValidation } from './LokasiPenyimpananValidation.js';

const penerimaanBarangValidation = [
  body('nama').trim().escape().notEmpty().withMessage('nama required'),
  body('jumlah').isInt({ min: 1 }).withMessage('jumlah minimum 1'),
  body('jenis').trim().escape().notEmpty().withMessage('jenis required'),
  body('tanggal').isISO8601().toDate(),
  body('id_pemasok')
    .isMongoId()
    .withMessage('invalid ID')
    .bail()
    .custom(async (value, { req }) => {
      try {
        let filter;
        if (req.role === 'admin') {
          filter = { _id: value };
        } else if (req.role === 'user') {
          filter = { _id: value, createdBy: req.uid };
        } else {
          throw new Error('role not allowed');
        }

        const data = await PemasokModel.findOne(filter);
        if (!data) throw new Error('data not found');
        // req.data = data;
      } catch (err) {
        throw new Error(err.message);
      }
      return true;
    })
    .bail({ level: 'request' }),
  body('lokasi_penyimpanan')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('lokasi_penyimpanan required'),
  runValidation
];

// jumlah, tanggal, id_pemasok, lokasi_penyimpanan
const penambahanBarangValidation = [
  ...showInventoriBarangValidation,
  body('jumlah').isInt({ min: 1 }).withMessage('jumlah minimum 1'),
  body('tanggal').isISO8601().toDate(),
  body('id_pemasok')
    .isMongoId()
    .withMessage('invalid ID')
    .bail()
    .custom(async (value, { req }) => {
      try {
        let filter;
        if (req.role === 'admin') {
          filter = { _id: value };
        } else if (req.role === 'user') {
          filter = { _id: value, createdBy: req.uid };
        } else {
          throw new Error('role not allowed');
        }

        const data = await PemasokModel.findOne(filter);
        if (!data) throw new Error('data not found');
        // req.data = data;
      } catch (err) {
        throw new Error(err.message);
      }
      return true;
    })
    .bail({ level: 'request' }),
  body('lokasi_penyimpanan')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('lokasi_penyimpanan required'),
  runValidation
];

// jumlah, tanggal, id_pelanggan
const pengirimanBarangValidation = [
  ...showLokasiPenyimpananValidation,
  body('jumlah')
    .isInt({ min: 1 })
    .withMessage('jumlah minimum 1')
    .custom((value, { req }) => {
      if (value > req.data.jumlah)
      throw  new Error(`jumlah maksimum ${req.data.jumlah}`);
      return true;
    }),
  body('tanggal').isISO8601().toDate(),
  body('id_pelanggan')
    .isMongoId()
    .withMessage('invalid ID')
    .bail()
    .custom(async (value, { req }) => {
      try {
        let filter;
        if (req.role === 'admin') {
          filter = { _id: value };
        } else if (req.role === 'user') {
          filter = { _id: value, createdBy: req.uid };
        } else {
          throw new Error('role not allowed');
        }

        const pelanggan = await PelangganModel.findOne(filter);
        if (!pelanggan) throw new Error('data not found');
      } catch (err) {
        throw new Error(err.message);
      }
      return true;
    })
    .bail({ level: 'request' }),
  runValidation
];

// lokasi_tujuan, jumlah, tanggal
const pergeseranBarangValidation = [
  ...showLokasiPenyimpananValidation,
  body('lokasi_tujuan')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('lokasi_tujuan required'),
  body('jumlah')
    .isInt({ min: 1 })
    .withMessage('jumlah minimum 1')
    .custom((value, { req }) => {
      if (value > req.data.jumlah)
        throw new Error(`jumlah maksimum ${req.data.jumlah}`);
      return true;
    }),
  body('tanggal').isISO8601().toDate(),
  runValidation
];

export {
  penerimaanBarangValidation,
  penambahanBarangValidation,
  pengirimanBarangValidation,
  pergeseranBarangValidation
};
