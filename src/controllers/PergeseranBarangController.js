import PergeseranBarangModel from '../models/PergeseranBarangModel.js';

const showPergeseranBarang = async (req, res, next) => {
  try {
    const data = req.data;
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const findPergeseranBarang = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;

    const id_inventaris_barang = req.query.id_inventaris_barang ?? '';
    const tanggal = req.query.tanggal ?? '';
    const lokasi_awal = req.query.lokasi_awal ?? '';
    const lokasi_akhir = req.query.lokasi_akhir ?? '';

    let filter = {
      id_inventaris_barang: { $regex: id_inventaris_barang },
      tanggal: { $regex: tanggal },
      lokasi_awal: { $regex: lokasi_awal },
      lokasi_akhir: { $regex: lokasi_akhir }
    };

    if (req.role === 'user') {
      filter.createdBy = req.uid;
    }

    const all_data = (await PergeseranBarangModel.find(filter)).length;
    const data = await PergeseranBarangModel.find(filter)
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

export { showPergeseranBarang, findPergeseranBarang };
