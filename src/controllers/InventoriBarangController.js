import InventoriBarangModel from '../models/InventoriBarangModel.js';

const showInventoriBarang = async (req, res, next) => {
  try {
    const data = req.data;
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const findInventoriBarang = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;

    const nama = req.query.nama ?? '';
    const jenis = req.query.jenis ?? '';
    const nomor_seri = req.query.nomor_seri ?? '';

    let filter = {
      nama: { $regex: nama, $options: 'i' },
      jenis: { $regex: jenis, $options: 'i' },
      nomor_seri: { $regex: nomor_seri , $options: 'i'}
    };

    if (req.role === 'user') {
      filter.createdBy = req.uid;
    }

    const all_data = (await InventoriBarangModel.find(filter)).length;
    const data = await InventoriBarangModel.find(filter)
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

export { showInventoriBarang, findInventoriBarang };
