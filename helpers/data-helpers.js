const dayjs = require('dayjs')

module.exports = {
  calculateSum: data => {
    return data.reduce((total, amount) => total + Number(amount.amount), 0).toLocaleString()
  },
  dateRange: selectDate => {
    const start = dayjs(selectDate).startOf('month').toDate()
    const end = dayjs(selectDate).endOf('month').toDate()
    return { $gte: start, $lt: end }
  },
  categoryIdToString: categories => {
    return categories.map(category => ({ ...category, _id: category._id.toString() }))
  },
  dateData: allRecords => {
    return new Set(allRecords.map(record => dayjs(record.date).format('YYYY-MM')))
  },
  calculateCategorySum: (categories, records) => {
    const categorySum = []

    for (let i = 0; i < categories.length; i++) {
      let sum = 0
      for (let j = 0; j < records.length; j++) {
        if (records[j].categoryId.name === categories[i]) {
          sum += records[j].amount
        }
      }
      categorySum.push(sum)
    }
    return categorySum
  }
}
