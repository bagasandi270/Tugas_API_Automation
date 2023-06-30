const request = require('supertest')
const { expect } = require('chai')
const baseUrl = 'https://kasir-api.belajarqa.com'
const userRegistration = require('../testData/userRegistration.json')
const userLogin = require('../testData/userLogin.json')
const createUser = require('../testData/createUser.json')
const addUnit = require('../testData/addUnit.json')
const addCategory = require('../testData/addCategory.json')
const addCustomer = require('../testData/addCustomer.json')
const updateUser = require('../testData/updateUser.json')
const updateUnit = require('../testData/updateUnit.json')
const updateCategories = require('../testData/updateCategories.json')
const updateCustomers = require('../testData/updateCustomers.json')

var token
var officeId
var userId
var unitId
var categoryId
var customerId
var productId


beforeEach(function (done) {
    request(baseUrl)
        .post('/authentications')
        .send(userLogin)
        .end(function (err, response) {
            token = response.body.data.accessToken
            if (err) {
                throw err
            }
            done()
        })
})

describe('Test Endpoint Registration /registration and Login /authentications', function () {
    //Endpoint /registration
    //Authorization - Registration
    it('Success create user registration', (done) => {
        request(baseUrl)
            .post('/registration')
            .send(userRegistration)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Toko berhasil didaftarkan')
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(userRegistration.name)
                expect(await response.body.data.email).not.to.be.null
                expect(await response.body.data.email).to.be.equal(userRegistration.email)
                expect(await response.body.data.password).not.to.be.null
                console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Endpoint /authentications
    //Authorization - Login
    it('Success login using valid credential', (done) => {
        request(baseUrl)
            .post('/authentications')
            .send(userLogin)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Authentication berhasil ditambahkan')
                expect(await response.body.data.accessToken).not.to.be.null
                expect(await response.body.data.refreshToken).not.to.be.null
                expect(await response.body.data.user.id).not.to.be.null
                expect(await response.body.data.user.name).not.to.be.null
                expect(await response.body.data.user.name).to.be.equal(userRegistration.name)
                expect(await response.body.data.user.role).not.to.be.null
                expect(await response.body.data.user.role).to.be.equal('admin')
                expect(await response.body.data.user.email).not.to.be.null
                expect(await response.body.data.user.email).to.be.equal(userRegistration.email)
                expect(await response.body.data.user.company_name).not.to.be.null
                expect(await response.body.data.user.company_name).to.be.equal(userRegistration.name)
                officeId = response.body.data.user.officeId
                console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    it('Failed login using invalid credential', (done) => {
        request(baseUrl)
            .post('/authentications')
            .send({
                "email": "toko123@gmail.com",
                "password": "toko123"
            })
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(401)
                expect(await response.body.status).to.be.equal('fail')
                expect(await response.body.message).to.be.equal('Kredensial yang Anda berikan salah')
                console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    it('Failed login using invalid email format', (done) => {
        request(baseUrl)
            .post('/authentications')
            .send({
                "email": "toko123@gmail",
                "password": "toko123"
            })
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(400)
                expect(await response.body.status).to.be.equal('fail')
                expect(await response.body.message).to.be.equal('\"email\" must be a valid email')
                console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    it('Failed login without any input', (done) => {
        request(baseUrl)
            .post('/authentications')
            .send()
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(400)
                expect(await response.body.status).to.be.equal('fail')
                expect(await response.body.message).to.be.equal('\"value\" must be of type object')
                console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })
})

describe('Test Endpoint User /users', function () {
    //Endpoint /users
    //Users - Create User
    it('Success create user cashier', (done) => {
        request(baseUrl)
            .post('/users')
            .send(createUser)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('User berhasil ditambahkan')
                expect(await response.body.data.userId).not.to.be.null
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(createUser.name)
                userId = response.body.data.userId
                console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //Users - Get User Detail
    it('Success get user detail', (done) => {
        request(baseUrl)
            .get('/users/' + userId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.data.user.id).not.to.be.null
                expect(await response.body.data.user.name).not.to.be.null
                expect(await response.body.data.user.name).to.be.equal(createUser.name)
                expect(await response.body.data.user.email).not.to.be.null
                expect(await response.body.data.user.email).to.be.equal(createUser.email)
                expect(await response.body.data.user.role).not.to.be.null
                expect(await response.body.data.user.role).to.be.equal('kasir')
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
   
    it('Success get user list', (done) => {
        request(baseUrl)
            .get('/users')
            .query({
                q: 'kasir',
                p: 1
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
    it('Success update user', (done) => {
        request(baseUrl)
            .put('/users/' + userId)
            .send(updateUser)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(updateUser.name)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('User berhasil diupdate')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
    it('Success delete user', (done) => {
        request(baseUrl)
            .del('/users/' + userId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('User berhasil dihapus')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
            
    })
    
})

describe('Test Endpoint Unit /units', function () {
    //Endpoint /users
    //Users - Create User
    it('Success create unit', (done) => {
        request(baseUrl)
            .post('/units')
            .send(addUnit)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(201)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.message).to.be.equal('Unit berhasil ditambahkan')
                expect(await response.body.data.userId).not.to.be.null
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(addUnit.name)
                unitId = response.body.data.unitId
                console.log(response.body)
                if (err) {
                    throw err
                }
                done()
            })
    })

    //get detail
    it('Success get unit detail', (done) => {
        request(baseUrl)
            .get('/units/' + unitId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.data.unit.id).not.to.be.null
                expect(await response.body.data.unit.name).not.to.be.null
                expect(await response.body.data.unit.name).to.be.equal(addUnit.name)
                expect(await response.body.data.unit.description).not.to.be.null
                expect(await response.body.data.unit.description).to.be.equal(addUnit.description)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
    //get list
    it('Success get units list', (done) => {
        request(baseUrl)
            .get('/units')
            .query({
                q: 'gram',
                page: 1
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
    //update
    it('Success update unit', (done) => {
        request(baseUrl)
            .put('/units/' + unitId)
            .send(updateUnit)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                expect(await response.body.data.name).not.to.be.null
                expect(await response.body.data.name).to.be.equal(updateUnit.name)
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
    })
    it('Success delete unit', (done) => {
        request(baseUrl)
            .del('/units/' + unitId)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + token)
            .end(async function (err, response) {
                expect(await response.statusCode).to.be.equal(200)
                expect(await response.body.status).to.be.equal('success')
                console.log(JSON.stringify(response.body))
                if (err) {
                    throw err
                }
                done()
            })
            
    })
        it('Success add categories', (done) => {
            request(baseUrl)
                .post('/categories')
                .send(addCategory)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(201)
                    expect(await response.body.status).to.be.equal('success')
                    //expect(await response.body.message).to.be.equal('Categories berhasil ditambahkan')
                   // expect(await response.body.data.userId).not.to.be.null
                   // expect(await response.body.data.name).not.to.be.null
                   // expect(await response.body.data.name).to.be.equal(addUnit.name)
                    categoryId = response.body.data.categoryId
                    console.log(response.body)
                    if (err) {
                        throw err
                    }
                    done()
                })
        })
        it('Success get categories detail', (done) => {
            request(baseUrl)
                .get('/categories/' + categoryId)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(200)
                    console.log(JSON.stringify(response.body))
                    if (err) {
                        throw err
                    }
                    done()
                })
        })
        it('Success get categories list', (done) => {
            request(baseUrl)
                .get('/categories')
                .query({
                    q: 'gram',
                    page: 1
                })
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(200)
                    expect(await response.body.status).to.be.equal('success')
                    console.log(JSON.stringify(response.body))
                    if (err) {
                        throw err
                    }
                    done()
                })
        })

        it('Success update Category', (done) => {
            request(baseUrl)
                .put('/categories/' + categoryId)
                .send(updateCategories)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(200)
                    expect(await response.body.status).to.be.equal('success')
                    expect(await response.body.data.name).not.to.be.null
                    expect(await response.body.data.name).to.be.equal(updateCategories.name)
                    console.log(JSON.stringify(response.body))
                    if (err) {
                        throw err
                    }
                    done()
                })
        })
        it('Success delete category', (done) => {
            request(baseUrl)
                .del('/categories/' + categoryId)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(200)
                    expect(await response.body.status).to.be.equal('success')
                    console.log(JSON.stringify(response.body))
                    if (err) {
                        throw err
                    }
                    done()
                })
                
        })   
        it('Success add Customer', (done) => {
            request(baseUrl)
                .post('/customers')
                .send(addCustomer)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(201)
                    expect(await response.body.status).to.be.equal('success')
                    //expect(await response.body.message).to.be.equal('Categories berhasil ditambahkan')
                   // expect(await response.body.data.userId).not.to.be.null
                   // expect(await response.body.data.name).not.to.be.null
                   // expect(await response.body.data.name).to.be.equal(addUnit.name)
                    customerId = response.body.data.customerId
                    console.log(response.body)
                    if (err) {
                        throw err
                    }
                    done()
                })
        })
        it('Success get categories detail', (done) => {
            request(baseUrl)
                .get('/customers/' + customerId)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(200)
                    console.log(JSON.stringify(response.body))
                    if (err) {
                        throw err
                    }
                    done()
                })
        })
        it('Success get customer list', (done) => {
            request(baseUrl)
                .get('/customers')
                .query({
                    q: 'kasir',
                    p: 1
                })
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(200)
                    expect(await response.body.status).to.be.equal('success')
                    console.log(JSON.stringify(response.body))
                    if (err) {
                        throw err
                    }
                    done()
                })
        })
        it('Success update customers', (done) => {
            request(baseUrl)
                .put('/customers/' + customerId)
                .send(updateCustomers)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(200)
                    expect(await response.body.status).to.be.equal('success')
                    expect(await response.body.data.name).not.to.be.null
                    expect(await response.body.data.name).to.be.equal(updateCustomers.name)
                    console.log(JSON.stringify(response.body))
                    if (err) {
                        throw err
                    }
                    done()
                })
        })
        it('Success delete customers', (done) => {
            request(baseUrl)
                .del('/customers/' + customerId)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(200)
                    expect(await response.body.status).to.be.equal('success')
                    //expect(await response.body.message).to.be.equal('Customers berhasil dihapus')
                    console.log(JSON.stringify(response.body))
                    if (err) {
                        throw err
                    }
                    done()
                })
                
        })
        it('Success add products', (done) => {
            request(baseUrl)
                .post('/products')
                .send({
                    
                        category_id : categoryId,
                        "code": "A314ASDDFIER3432",
                        "name": "taro",
                        "price": "3500",
                        "cost": "3000",
                        "stock": "5"
    
                     
                })

                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(201)
                    expect(await response.body.status).to.be.equal('success')
                    //expect(await response.body.message).to.be.equal('products berhasil ditambahkan')
                    //expect(await response.body.data.productId).not.to.be.null
                   // expect(await response.body.data.name).not.to.be.null
                  // expect(await response.body.data.productId).not.to.be.null
                   //expect(await response.body.data.name).to.be.equal("taro")
                   // productId = response.body.data.productId
                    console.log(JSON.stringify(response.body))
                    if (err) {
                        throw err
                    }
                    done()
                })
        })
        it('Success get Product Detail', (done) => {
            request(baseUrl)
                .get('/products/' + productId)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'bearer ' + token)
                .end(async function (err, response) {
                    expect(await response.statusCode).to.be.equal(200)
                   expect(await response.body.data.products.id).not.to.be.null
                    //expect(await response.body.data.products.name).not.to.be.null
                    //expect(await response.body.data.products.name).to.be.equal(productId.name)
                    //expect(await response.body.data.products.email).not.to.be.null
                    //expect(await response.body.data.products.email).to.be.equal(productId.email)
                    //expect(await response.body.data.products.role).not.to.be.null
                    //expect(await response.body.data.products.role).to.be.equal('kasir')
                    //expect(await response.body.status).to.be.equal('success')
                    productId = response.body.data.productId
                    console.log(JSON.stringify(response.body))
                    if (err) {
                        throw err
                    }
                    done()
                })
        })

})