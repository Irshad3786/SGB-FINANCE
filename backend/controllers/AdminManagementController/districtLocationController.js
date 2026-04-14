import mongoose from 'mongoose'
import DistrictLocation from '../../models/districtLocationModel.js'

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim()

const normalizeKey = (value) => normalizeText(value).toLowerCase()

const parseMandals = (value) => {
  const rawList = Array.isArray(value)
    ? value
    : String(value || '')
        .split(/[\n,]/g)
        .map((item) => item.trim())

  const seen = new Set()
  const mandals = []

  rawList.forEach((item) => {
    const mandal = normalizeText(item)
    const mandalKey = normalizeKey(mandal)

    if (!mandal || seen.has(mandalKey)) {
      return
    }

    seen.add(mandalKey)
    mandals.push(mandal)
  })

  return mandals
}

const serializeDistrictLocation = (location) => ({
  _id: location._id,
  district: location.district,
  mandals: location.mandals || [],
  mandalCount: Array.isArray(location.mandals) ? location.mandals.length : 0,
  createdAt: location.createdAt,
  updatedAt: location.updatedAt,
})

const getDistrictLocations = async (req, res) => {
  try {
    const locations = await DistrictLocation.find({})
      .sort({ districtKey: 1 })
      .lean()

    return res.status(200).json({
      success: true,
      message: 'District locations fetched successfully',
      data: locations.map(serializeDistrictLocation),
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch district locations',
      error: error.message,
    })
  }
}

const getDistrictMandals = async (req, res) => {
  try {
    const district = normalizeText(req.params.district)

    if (!district) {
      return res.status(400).json({
        success: false,
        message: 'District name is required',
      })
    }

    const location = await DistrictLocation.findOne({ districtKey: normalizeKey(district) }).lean()

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'District not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'District mandals fetched successfully',
      data: serializeDistrictLocation(location),
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch district mandals',
      error: error.message,
    })
  }
}

const createDistrictLocation = async (req, res) => {
  try {
    const district = normalizeText(req.body?.district)
    const mandals = parseMandals(req.body?.mandals)

    if (!district) {
      return res.status(400).json({
        success: false,
        message: 'District name is required',
      })
    }

    if (mandals.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add at least one mandal',
      })
    }

    const districtKey = normalizeKey(district)

    const existing = await DistrictLocation.findOne({ districtKey }).lean()
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'District already exists',
      })
    }

    const createdLocation = await DistrictLocation.create({
      district,
      districtKey,
      mandals,
    })

    return res.status(201).json({
      success: true,
      message: 'District location created successfully',
      data: serializeDistrictLocation(createdLocation),
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create district location',
      error: error.message,
    })
  }
}

const updateDistrictLocation = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid district id',
      })
    }

    const district = req.body?.district !== undefined ? normalizeText(req.body.district) : undefined
    const mandals = req.body?.mandals !== undefined ? parseMandals(req.body.mandals) : undefined

    const updatePayload = {}

    if (district !== undefined) {
      if (!district) {
        return res.status(400).json({
          success: false,
          message: 'District name is required',
        })
      }

      const districtKey = normalizeKey(district)
      const duplicate = await DistrictLocation.findOne({
        _id: { $ne: id },
        districtKey,
      }).lean()

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'District already exists',
        })
      }

      updatePayload.district = district
      updatePayload.districtKey = districtKey
    }

    if (mandals !== undefined) {
      if (mandals.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please add at least one mandal',
        })
      }

      updatePayload.mandals = mandals
    }

    const updatedLocation = await DistrictLocation.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    }).lean()

    if (!updatedLocation) {
      return res.status(404).json({
        success: false,
        message: 'District location not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'District location updated successfully',
      data: serializeDistrictLocation(updatedLocation),
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update district location',
      error: error.message,
    })
  }
}

const deleteDistrictLocation = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid district id',
      })
    }

    const deletedLocation = await DistrictLocation.findByIdAndDelete(id).lean()

    if (!deletedLocation) {
      return res.status(404).json({
        success: false,
        message: 'District location not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'District location deleted successfully',
      data: serializeDistrictLocation(deletedLocation),
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete district location',
      error: error.message,
    })
  }
}

export {
  getDistrictLocations,
  getDistrictMandals,
  createDistrictLocation,
  updateDistrictLocation,
  deleteDistrictLocation,
}