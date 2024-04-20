import PelangganModel from '../models/PelangganModel.js';

const showPelanggan = async (req, res, next) => {
  try {
    const data = req.data;
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const findPelanggan = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;

    const nama = req.query.nama ?? '';
    const alamat = req.query.alamat ?? '';
    const kontak = req.query.kontak ?? '';

    let filter = {
      nama: { $regex: nama , $options: 'i'},
      alamat: { $regex: alamat, $options: 'i' },
      kontak: { $regex: kontak , $options: 'i'}
    };

    if (req.role === 'user') {
      filter.createdBy = req.uid;
    }

    const all_data = (await PelangganModel.find(filter)).length;
    const data = await PelangganModel.find(filter)
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

const createPelanggan = async (req, res, next) => {
  try {
    const { nama, alamat, kontak } = req.body;
    const data = {
      nama,
      alamat,
      kontak,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    };

    const newData = new PelangganModel(data);
    const savedData = await newData.save();

    res.status(201).json(savedData);
  } catch (e) {
    next(e);
  }
};

const updatePelanggan = async (req, res, next) => {
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

    const updated = await PelangganModel.findByIdAndUpdate(data._id, newData, {
      new: true
    });

    res.status(200).json(updated);
  } catch (e) {
    next(e);
  }
};

const deletePelanggan = async (req, res, next) => {
  try {
    const data = req.data;
    const deleted = await PelangganModel.findByIdAndDelete(data._id);
    res.status(200).json(deleted);
  } catch (e) {
    next(e);
  }
};

export {
  showPelanggan,
  findPelanggan,
  createPelanggan,
  updatePelanggan,
  deletePelanggan
};
