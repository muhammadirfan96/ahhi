import mongoose from 'mongoose';

const scheema = new mongoose.Schema(
  {
    id_inventaris_barang: String,
    minimal: Number,
    maksimal: Number,
    createdBy: String,
    updatedBy: String
  },
  { timestamps: true }
);

const StokBarangModel = mongoose.model('stok_barang', scheema);

export default StokBarangModel;
