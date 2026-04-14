import mongoose from 'mongoose'

const districtLocationSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      required: true,
      trim: true,
    },
    districtKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    mandals: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

districtLocationSchema.index({ districtKey: 1 }, { unique: true })

const DistrictLocation = mongoose.model('DistrictLocation', districtLocationSchema)

export default DistrictLocation