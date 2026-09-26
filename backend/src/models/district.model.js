import mongoose from 'mongoose';
const districtSchema = new mongoose.Schema(
    {
        distCode: {
            type: String,
            required: true,
            unique: true,
        },
        distName: {
            type: String,
            required: true,
        },
    },
    { timestamps: false },
);

const District = mongoose.model('District', districtSchema);
export { District };
