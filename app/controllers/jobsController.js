const Jobs = require('../models/jobSchema')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')


const getAllJobs = async (req, res) => {
  const job = await Jobs.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ job, nbHits: job.length })
}

const getJob = async (req, res) => {
  const {
    user: { userId }, // the user id from user collection
    params: { id: jobId } } // job id from the params
    = req

  const job = await Jobs.findOne({
    _id: jobId,
    createdBy: userId
  })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}


const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Jobs.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const userId = req.user.userId // the user id from user collection
  const jobId = req.params.id // job id from the params
  const Data = req.body // update data from req.body

  if (!Data) {
    throw new BadRequestError('Please Provide all the information')
  }

  const job = await Jobs.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    Data,
    { new: true, runValidators: true }

  )

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })

}

const deleteJob = async (req, res) => {
  const userId = req.user.userId // the user id from user collection
  const jobId = req.params.id // job id from the params

  const job = await Jobs.findByIdAndRemove({
    _id: jobId,
    createdBy: userId
  })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ msg: "Successfully Deleted" })
}


module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}