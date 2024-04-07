import mongoose from 'mongoose';

const scheema = new mongoose.Schema(
  {
    id_inventaris_barang: String,
    jumlah: Number,
    tanggal: Date,
    id_pelanggan: String,
    createdBy: String,
		updatedBy: String
  },
  { timestamps: true }
);

const PengirimanBarangModel = mongoose.model('pengiriman_barang', scheema);

export default PengirimanBarangModel;
