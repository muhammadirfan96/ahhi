import LokasiPenyimpananModel from '../models/LokasiPenyimpananModel.js';

const showLokasiPenyimpanan = async (req, res, next) => {
  try {
    const data = req.data;
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

const findLokasiPenyimpanan = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit ?? 20);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;

    const lokasi = req.query.lokasi ?? '';

    let filter = {
      lokasi: { $regex: lokasi , $options: 'i'},
    };

    if (req.role === 'user') {
      filter.createdBy = req.uid;
    }

    const all_data = (await LokasiPenyimpananModel.find(filter)).length;
    const data = await LokasiPenyimpananModel.find(filter)
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

export { showLokasiPenyimpanan, findLokasiPenyimpanan };
