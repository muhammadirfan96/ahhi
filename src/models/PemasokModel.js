import mongoose from 'mongoose';

const scheema = new mongoose.Schema(
  {
    nama: String,
    alamat: String,
    kontak: String,
    createdBy: String,
		updatedBy: String
  },
  { timestamps: true }
);

const PemasokModel = mongoose.model('pemasok', scheema);

export default PemasokModel;
