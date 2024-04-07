import PemasokModel from '../models/PemasokModel.js';

const showPemasok = async (req, res, next) => {
  try {
    const data = req.data;
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const findPemasok = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;

    const nama = req.query.nama ?? '';
    const alamat = req.query.alamat ?? '';
    const kontak = req.query.kontak ?? '';

    let filter = {
      nama: { $regex: nama },
      alamat: { $regex: alamat },
      kontak: { $regex: kontak }
    };

    if (req.role === 'user') {
      filter.createdBy = req.uid;
    }

    const all_data = (await PemasokModel.find(filter)).length;
    const data = await PemasokModel.find(filter)
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

const createPemasok = async (req, res, next) => {
  try {
    const { nama, alamat, kontak } = req.body;
    const data = {
      nama,
      alamat,
      kontak,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    };

    const newData = new PemasokModel(data);
    const savedData = await newData.save();

    res.status(201).json(savedData);
  } catch (e) {
    next(e);
  }
};

const updatePemasok = async (req, res, next) => {
  try {
    const data = req.data;

    const { nama, alamat, kontak } = req.body;
    const newData = {
      nama,
      alamat,
      kontak,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    };

    const updated = await PemasokModel.findByIdAndUpdate(data._id, newData, {
      new: true
    });

    res.status(200).json(updated);
  } catch (e) {
    next(e);
  }
};

const deletePemasok = async (req, res, next) => {
  try {
    const data = req.data;
    const deleted = await PemasokModel.findByIdAndDelete(data._id);
    res.status(200).json(deleted);
  } catch (e) {
    next(e);
  }
};

export {
  showPemasok,
  findPemasok,
  createPemasok,
  updatePemasok,
  deletePemasok
};
