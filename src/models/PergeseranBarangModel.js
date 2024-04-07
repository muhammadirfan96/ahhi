import mongoose from 'mongoose';

const scheema = new mongoose.Schema(
  {
    id_inventaris_barang: String,
    jumlah: Number,
    tanggal: Date,
    lokasi_awal: String,
    lokasi_akhir: String,
    createdBy: String,
		updatedBy: String
  },
  { timestamps: true }
);

const PergeseranBarangModel = mongoose.model('pergeseran_barang', scheema);

export default PergeseranBarangModel;
