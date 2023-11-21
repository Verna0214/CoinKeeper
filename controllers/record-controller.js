const Records = require('../models/record')
const Categories = require('../models/category')
const { calculateSum, dateRange, categoryIdToString, dateData, calculateCategorySum } = require('../helpers/data-helpers')
const dayjs = require('dayjs')

const recordController = {
  getRecords: async (req, res, next) => {
    try {
      const categoryId = req.query.categoryId || null
      const selectDate = req.query.selectDate || null
      const userId = req.user._id
      const query = { userId }

      if (categoryId !== null) {
        query.categoryId = categoryId
      }
      if (selectDate !== null) {
        query.date = dateRange(selectDate)
      }

      const [categories, records, allRecords] = await Promise.all([
        Categories.find({}).lean(),
        Records.find(query).populate('categoryId').sort({ date: 'desc' }).lean(),
        Records.find({ userId }).sort({ date: 'desc' }).lean()
      ])

      const totalAmount = calculateSum(records)
      const categoriesArr = categoryIdToString(categories)
      const dateArr = dateData(allRecords)

      res.render('records', { totalAmount, categories: categoriesArr, records, categoryId, dateArr, selectDate })
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
      const _id = req.params.id
      const userId = req.user._id

      const [record, categories] = await Promise.all([
        Records.findOne({ _id, userId }).populate('categoryId').lean(),
        Categories.find({}).lean()
      ])
      if (!record) throw new Error("Record didn't exist！")

      const categoryId = record.categoryId._id.toString()
      const date = (dayjs(record.date).format('YYYY-MM-DD'))
      const categoriesArr = categoryIdToString(categories)

      res.render('edit', { record, categories: categoriesArr, categoryId, date })
    } catch (err) {
      next(err)
    }
  },
  putRecord: async (req, res, next) => {
    try {
      const _id = req.params.id
      const userId = req.user._id
      const { record, date, categoryId, amount } = req.body
      if (!record || !date || !categoryId || !amount) throw new Error('Please fill out these field！')

      await Records.findOneAndUpdate(
        { _id, userId },
        {
          name: record,
          date,
          amount,
          userId,
          categoryId
        }
      )
      req.flash('success_messages', 'Edit the record successfully！')
      res.redirect('/records')
    } catch (err) {
      next(err)
    }
  },
  deleteRecord: async (req, res, next) => {
    try {
      const _id = req.params.id
      const userId = req.user._id

      await Records.findOneAndDelete({ _id, userId })

      req.flash('success_messages', 'Delete the record successfully！')
      res.redirect('/records')
    } catch (err) {
      next(err)
    }
  },
  chartPage: async (req, res, next) => {
    try {
      const selectDate = req.query.selectDate || null
      const userId = req.user._id
      const query = { userId }

      if (selectDate !== null) {
        query.date = dateRange(selectDate)
      }

      const [categories, records, allRecords] = await Promise.all([
        Categories.find({}).lean(),
        Records.find(query).populate('categoryId').sort({ date: 'desc' }).lean(),
        Records.find({ userId }).sort({ date: 'desc' }).lean()
      ])

      const totalAmount = calculateSum(records)
      const categoryName = categories.map(category => category.name)
      const dateArr = dateData(allRecords)
      const categorySum = calculateCategorySum(categoryName, records)

      res.render('chart', { totalAmount, categories: categoryName, dateArr, selectDate, categorySum })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = recordController
