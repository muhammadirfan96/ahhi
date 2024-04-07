import PenerimaanBarangModel from '../models/PenerimaanBarangModel.js';

const showPenerimaanBarang = async (req, res, next) => {
  try {
    const data = req.data;
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const findPenerimaanBarang = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;

    const id_inventaris_barang = req.query.id_inventaris_barang ?? '';
    const tanggal = req.query.tanggal ?? '';
    const id_pemasok = req.query.id_pemasok ?? '';

    let filter = {
      id_inventaris_barang: { $regex: id_inventaris_barang },
      tanggal: { $regex: tanggal },
      id_pemasok: { $regex: id_pemasok }
    };

    if (req.role === 'user') {
      filter.createdBy = req.uid;
    }

    const all_data = (await PenerimaanBarangModel.find(filter)).length;
    const data = await PenerimaanBarangModel.find(filter)
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

export { showPenerimaanBarang, findPenerimaanBarang };
