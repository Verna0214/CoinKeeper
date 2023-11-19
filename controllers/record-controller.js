const Records = require('../models/record')
const Categories = require('../models/category')
const dayjs = require('dayjs')

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
  },
  createPage: async (req, res, next) => {
    try {
      const categories = await Categories.find({}).lean()
      return res.render('new', { categories })
    } catch (err) {
      next(err)
    }
  },
  postRecord: async (req, res, next) => {
    try {
      const userId = req.user._id
      const { record, date, categoryId, amount } = req.body
      if (!record || !date || !categoryId || !amount) throw new Error('Please fill out these field！')

      await Records.create({
        name: record,
        date,
        amount,
        userId,
        categoryId
      })
      req.flash('success_messages', 'Congratulations！Create a new record.')
      res.redirect('/records')
    } catch (err) {
      next(err)
    }
  },
  editPage: async (req, res, next) => {
    try {
      const [record, categories] = await Promise.all([
        Records.findOne({ _id: req.params.id }).populate('categoryId').lean(),
        Categories.find({}).lean()
      ])
      const categoryId = record.categoryId._id.toString()
      const categoryIdToString = categories.map(category => ({ ...category, _id: category._id.toString() }))
      const date = (dayjs(record.date).format('YYYY-MM-DD'))

      res.render('edit', { record, categories: categoryIdToString, categoryId, date })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = recordController
