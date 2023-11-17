// dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// include related modules
const faker = require('faker')
const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')
const Records = require('../record')
const Categories = require('../category')
const Users = require('../user')
const userData = require('./userData.json').results

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', async () => {
  try {
    const categories = await Categories.find({})
    const users = await Promise.all(userData.map(async user => {
      return await Users.create({
        name: user.name,
        email: user.email,
        password: bcrypt.hashSync(user.password, 10)
      })
    }))
    console.log('User seeder is created!')
    const records = Array.from({ length: 20 }, () => ({
      name: faker.lorem.words(),
      date: faker.date.past(),
      amount: faker.finance.amount(undefined, undefined, 0),
      userId: users[Math.floor(Math.random() * users.length)]._id,
      categoryId: categories[Math.floor(Math.random() * categories.length)]._id
    }))

    await Records.insertMany(records)
  } catch (err) {
    console.error(err)
  } finally {
    console.log('All seeder is created!')
    await db.close()
    process.exit()
  }
})
