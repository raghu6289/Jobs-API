const notFound = (req, res) => {
  res.status(404).json({ msg: "route does not found" })
}

module.exports = notFound