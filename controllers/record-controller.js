const Records = require('../models/record')
const Categories = require('../models/category')
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
        const start = dayjs(selectDate).startOf('month').toDate()
        const end = dayjs(selectDate).endOf('month').toDate()
        query.date = { $gte: start, $lt: end }
      }

      const [categories, records, allRecords] = await Promise.all([
        Categories.find({}).lean(),
        Records.find(query).populate('categoryId').sort({ date: 'desc' }).lean(),
        Records.find({ userId }).sort({ date: 'desc' }).lean()
      ])

      const totalAmount = records.reduce((total, record) => total + Number(record.amount), 0).toLocaleString()
      const categoryIdToString = categories.map(category => ({ ...category, _id: category._id.toString() }))
      const dateArr = new Set(allRecords.map(record => dayjs(record.date).format('YYYY-MM')))

      res.render('records', { totalAmount, categories: categoryIdToString, records, categoryId, dateArr, selectDate })
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
        Records.findOne({ _id: req.params.id, userId: req.user._id }).populate('categoryId').lean(),
        Categories.find({}).lean()
      ])
      if (!record) throw new Error("Record didn't exist！")

      const categoryId = record.categoryId._id.toString()
      const categoryIdToString = categories.map(category => ({ ...category, _id: category._id.toString() }))
      const date = (dayjs(record.date).format('YYYY-MM-DD'))

      res.render('edit', { record, categories: categoryIdToString, categoryId, date })
    } catch (err) {
      next(err)
    }
  },
  putRecord: async (req, res, next) => {
    try {
      const userId = req.user._id
      const { record, date, categoryId, amount } = req.body
      if (!record || !date || !categoryId || !amount) throw new Error('Please fill out these field！')

      await Records.findOneAndUpdate(
        { _id: req.params.id, userId },
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
      await Records.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
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
        const start = dayjs(selectDate).startOf('month').toDate()
        const end = dayjs(selectDate).endOf('month').toDate()
        query.date = { $gte: start, $lt: end }
      }

      const [categories, records, allRecords] = await Promise.all([
        Categories.find({}).lean(),
        Records.find(query).populate('categoryId').sort({ date: 'desc' }).lean(),
        Records.find({ userId }).sort({ date: 'desc' }).lean()
      ])

      const totalAmount = records.reduce((total, record) => total + Number(record.amount), 0).toLocaleString()
      const categoryName = categories.map(category => category.name)
      const dateArr = new Set(allRecords.map(record => dayjs(record.date).format('YYYY-MM')))
      const categorySum = []

      for (let i = 0; i < categoryName.length; i++) {
        let sum = 0
        for (let j = 0; j < records.length; j++) {
          if (records[j].categoryId.name === categoryName[i]) {
            sum += records[j].amount
          }
        }
        categorySum.push(sum)
      }

      res.render('chart', { totalAmount, categories: categoryName, dateArr, selectDate, categorySum })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = recordController
