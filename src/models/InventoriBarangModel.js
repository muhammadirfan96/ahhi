import mongoose from 'mongoose';

const scheema = new mongoose.Schema(
  {
    nama: String,
    jumlah: Number,
    jenis: String,
    nomor_seri: String,
    createdBy: String,
    updatedBy: String
  },
  { timestamps: true }
);

const InventoriBarangModel = mongoose.model('inventori_barang', scheema);

export default InventoriBarangModel;
