// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  //Приватне поле, яке містить список створених товарів
  static #list = []

  constructor(name, price, description) {
    this.id = this.generateUniqueId()
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  // Генерує унікальне число з 5 цифр
  generateUniqueId() {
    let randomNumber = Math.floor(Math.random() * 100000)
    return randomNumber.toString().padStart(5, '0')
  }

  // Додає товар до списку
  static add = (product) => {
    this.#list.push(product)
  }

  // Повертає список створених товарів
  static getList = () => this.#list

  // Знайти товар за ID
  static getById = (id) => {
    this.#list.find((product) => product.id === id)
  }

  // Оновлює властивості товару за ID
  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      if (data.name) {
        product.name = data.name
      }
      if (data.price) {
        product.price = data.price
      }
      if (data.description) {
        product.description = data.description
      }
      return product
    } else {
      return false
    }
  }

  // Видаляє товар за ID
  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

//=================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
  })
  // ↑↑ сюди вводимо JSON дані
})

//=================================================================

// !!! GET для створення товара !!!

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})

//=================================================================
// !!! POST для створення нового товару !!!
router.post('/product-create', function (req, res) {
  //console.log(req.body)
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)
  console.log(product)

  res.render('alert', {
    style: 'alert',

    alert: 'Успішне виконання дії',
  })
})

//====================================================

//!!! GET для отримання списку товарів !!!

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-list', function (req, res) {
  const list = Product.getList()

  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

//================================================================

//!!! GET для редагування товару !!!

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-edit', function (req, res) {
  const { id } = req.query
  console.log(id)

  const list = Product.getList()
  console.log(list)

  Product.getById(Number(id))

  if (!id) {
    console.log('помилка')
    res.render('alert', {
      style: 'alert',
      alert: 'Товар з таким ID не знайдено ',
    })
  }
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-edit', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-edit',

    data: {
      products: {
        list,
      },
    },
  })
})

//=======================================================

// !!! POST для оновлення товару по ID !!!
router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  let result = false

  const product = { name, price, description, id }

  if (id === id) {
    Product.add(product)

    result = true
  }

  console.log(product, id)

  res.render('alert', {
    style: 'alert',

    alert: result
      ? 'Успішно редаговано'
      : 'Сталася помилка ',
  })
})

//=======================================================

// !!!Видалити товар по ID !!!
router.get('/product-delete', function (req, res) {
  const { id } = req.query

  let result = false

  if (id) {
    Product.deleteById(id)

    result = true
  }

  res.render('alert', {
    style: 'alert',

    alert: result
      ? 'Продукт видаленний'
      : 'Сталася помилка немає ID',
  })
})

//=======================================================

// Підключаємо роутер до бек-енду
module.exports = router
