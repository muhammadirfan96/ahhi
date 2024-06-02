import InventoriBarangModel from '../models/InventoriBarangModel.js';
import PenerimaanBarangModel from '../models/PenerimaanBarangModel.js';
import LokasiPenyimpananModel from '../models/LokasiPenyimpananModel.js';
import PengirimanBarangModel from '../models/PengirimanBarangModel.js';
import PergeseranBarangModel from '../models/PergeseranBarangModel.js';
import generateRandomString from '../utils/generateRandomString.js';

const penerimaanBarang = async (req, res, next) => {
  try {
    const { nama, jumlah, jenis, tanggal, id_pemasok, lokasi_penyimpanan } =
      req.body;

    const nomor_seri = generateRandomString(20);

    //add inventaris barang
    const newInventoriBarang = new InventoriBarangModel({
      nama,
      jumlah,
      jenis,
      nomor_seri,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    });
    const addedInventoriBarang = await newInventoriBarang.save();

    //add penerimaan barang
    const newPenerimaanBarang = new PenerimaanBarangModel({
      id_inventaris_barang: addedInventoriBarang._id,
      jumlah,
      tanggal,
      id_pemasok,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    });

    const addedPenerimaanBarang = await newPenerimaanBarang.save();

    //add lokasi penyimpanan
    const newLokasiPenyimpanan = new LokasiPenyimpananModel({
      id_inventaris_barang: addedInventoriBarang._id,
      lokasi: lokasi_penyimpanan,
      jumlah,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    });

    const addedLokasiPenyimpanan = await newLokasiPenyimpanan.save();

    res.status(201).json({
      addedInventoriBarang,
      addedPenerimaanBarang,
      addedLokasiPenyimpanan
    });
  } catch (e) {
    next(e);
  }
};

const penambahanBarang = async (req, res, next) => {
  try {
    const data = req.data;
    const { jumlah, tanggal, id_pemasok, lokasi_penyimpanan } = req.body;

    //update inventaris barang
    const updatedInventoriBarang = await InventoriBarangModel.findByIdAndUpdate(
      data._id,
      { jumlah: data.jumlah + parseInt(jumlah) },
      { new: true }
    );

    //add penerimaan barang
    const newPenerimaanBarang = new PenerimaanBarangModel({
      id_inventaris_barang: updatedInventoriBarang._id,
      jumlah,
      tanggal,
      id_pemasok,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    });

    const addedPenerimaanBarang = await newPenerimaanBarang.save();

    //add lokasi penyimpanan
    const newLokasiPenyimpanan = new LokasiPenyimpananModel({
      id_inventaris_barang: updatedInventoriBarang._id,
      lokasi: lokasi_penyimpanan,
      jumlah,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    });

    const addedLokasiPenyimpanan = await newLokasiPenyimpanan.save();

    res.status(200).json({
      updatedInventoriBarang,
      addedPenerimaanBarang,
      addedLokasiPenyimpanan
    });
  } catch (e) {
    next(e);
  }
};

const pengirimanBarang = async (req, res, next) => {
  try {
    const data = req.data;
    const { jumlah, tanggal, id_pelanggan } = req.body;

    // add pengiriman barang
    const newPengirimanBarang = new PengirimanBarangModel({
      id_inventaris_barang: data.id_inventaris_barang,
      jumlah,
      tanggal,
      id_pelanggan,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    });

    const addedPengirimanBarang = await newPengirimanBarang.save();

    // update lokasi penyimpanan berdasarkan id lokasi penyimpanan, kurangi jumlahnya dgn jumlah yg baru
    const updatedLokasiPenyimpanan =
      await LokasiPenyimpananModel.findByIdAndUpdate(
        data._id,
        { jumlah: data.jumlah - parseInt(jumlah) },
        { new: true }
      );

    // updated inventaris barang
    const oldInventoriBarang = await InventoriBarangModel.findById(
      data.id_inventaris_barang
    );
    const updatedInventoriBarang = await InventoriBarangModel.findByIdAndUpdate(
      data.id_inventaris_barang,
      { jumlah: oldInventoriBarang.jumlah - parseInt(jumlah) },
      { new: true }
    );

    res.status(200).json({
      updatedLokasiPenyimpanan,
      updatedInventoriBarang,
      addedPengirimanBarang
    });
  } catch (e) {
    next(e);
  }
};

const pergeseranBarang = async (req, res, next) => {
  try {
    const data = req.data;
    const { lokasi_tujuan, jumlah, tanggal } = req.body;

    // add pergeseran barang
    const newPergeseranBarang = new PergeseranBarangModel({
      id_inventaris_barang: data.id_inventaris_barang,
      jumlah,
      tanggal,
      lokasi_awal: data.lokasi,
      lokasi_akhir: lokasi_tujuan,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    });

    const addedPergeseranBarang = await newPergeseranBarang.save();

    // update lokasi penyimpanan berdasarkan id lokasi penyimpanan, kurangi jumlahnya dgn jumlah yg baru
    const updatedLokasiPenyimpanan =
      await LokasiPenyimpananModel.findByIdAndUpdate(
        data._id,
        { jumlah: data.jumlah - parseInt(jumlah) },
        { new: true }
      );

    // add lokssi penyimpanan
    const newLokasiPenyimpanan = new LokasiPenyimpananModel({
      id_inventaris_barang: data.id_inventaris_barang,
      lokasi: lokasi_tujuan,
      jumlah,
      createdBy: req.uid || null,
      updatedBy: req.uid || null
    });

    const addedLokasiPenyimpanan = await newLokasiPenyimpanan.save();

    res.status(200).json({
      addedPergeseranBarang,
      updatedLokasiPenyimpanan,
      addedLokasiPenyimpanan
    });
  } catch (e) {
    next(e);
  }
};

// updateBarang


export {
  penerimaanBarang,
  penambahanBarang,
  pengirimanBarang,
  pergeseranBarang
};
