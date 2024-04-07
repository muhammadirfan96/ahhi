import mongoose from 'mongoose';

const scheema = new mongoose.Schema(
  {
    id_inventaris_barang: String,
    lokasi: String,
    jumlah: Number,
    createdBy: String,
		updatedBy: String
  },
  { timestamps: true }
);

const LokasiPenyimpananModel = mongoose.model(
  'lokasi_penyimpanan',
  scheema
);

export default LokasiPenyimpananModel;
