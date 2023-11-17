// dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// include related modules
const db = require('../../config/mongoose')
const Categories = require('../category')
const categoryData = require('./categoryData.json').results

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', async () => {
  try {
    await Promise.all(categoryData.map(async item => {
      await Categories.create({
        name: item.name,
        icon: item.icon
      })
    }))
  } catch (err) {
    console.error(err)
  } finally {
    console.log('Category seeder is created.')
    await db.close()
    process.exit()
  }
})
