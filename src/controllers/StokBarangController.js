import StokBarangModel from '../models/StokBarangModel.js';

const showStokBarang = async (req, res, next) => {
  try {
    const data = req.data;
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const findStokBarang = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;

    let filter = {};

    if (req.query.id_inventaris_barang) {
      filter.id_inventaris_barang = { $regex: id_inventaris_barang };
    }

    if (req.role === 'user') {
      filter.createdBy = req.uid;
    }

    const all_data = (await StokBarangModel.find(filter)).length;
    const data = await StokBarangModel.find(filter)
      .sort({ _id: 'desc' })
      .skip(offset)
      .limit(limit);

    const result = {
      all_data: all_data,
      all_page: Math.ceil(all_data / limit),
      crr_page: page,
      data: data
    };

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const createStokBarang = async (req, res, next) => {
  try {
    const { id_inventaris_barang, minimal, maksimal } = req.body;
    const data = {
      id_inventaris_barang,
      minimal,
      maksimal,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    };

    const newData = new StokBarangModel(data);
    const savedData = await newData.save();

    res.status(201).json(savedData);
  } catch (e) {
    next(e);
  }
};

const updateStokBarang = async (req, res, next) => {
  try {
    const data = req.data;

    const { id_inventaris_barang, minimal, maksimal } = req.body;
    const newData = {
      id_inventaris_barang,
      minimal,
      maksimal,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    };

    const updated = await StokBarangModel.findByIdAndUpdate(data._id, newData, {
      new: true
    });

    res.status(200).json(updated);
  } catch (e) {
    next(e);
  }
};

const deleteStokBarang = async (req, res, next) => {
  try {
    const data = req.data;
    const deleted = await StokBarangModel.findByIdAndDelete(data._id);
    res.status(200).json(deleted);
  } catch (e) {
    next(e);
  }
};

export {
  showStokBarang,
  findStokBarang,
  createStokBarang,
  updateStokBarang,
  deleteStokBarang
};
