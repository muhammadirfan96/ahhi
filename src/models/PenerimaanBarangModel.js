import mongoose from 'mongoose';

const scheema = new mongoose.Schema(
  {
    id_inventaris_barang: String,
    jumlah: Number,
    tanggal: Date,
    id_pemasok: String,
    createdBy: String,
		updatedBy: String
  },
  { timestamps: true }
);

const PenerimaanBarangModel = mongoose.model('penerimaan_barang', scheema);

export default PenerimaanBarangModel;
