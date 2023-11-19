const Records = require('../models/record')
const Categories = require('../models/category')

const recordController = {
  getRecords: async (req, res, next) => {
    try {
      const categoryId = req.query.categoryId || null
      const userId = req.user._id
      const query = categoryId === null ? { userId } : { userId, categoryId }

      const [categories, records] = await Promise.all([
        Categories.find({}).lean(),
        Records.find(query).populate('categoryId').sort({ date: 'desc' }).lean()
      ])
      const totalAmount = records.reduce((total, record) => total + Number(record.amount), 0).toLocaleString()
      const categoryIdToString = categories.map(category => ({ ...category, _id: category._id.toString() }))

      res.render('records', { totalAmount, categories: categoryIdToString, records, categoryId })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = recordController
