require('../utils/dbConnection');
require('../Models/personEntity');
const Department = require('../Models/departmentEntity')

exports.find = async (query, populate = '', sort = {'createTime': -1}) => {
    return await Department.find(query).populate(populate).sort(sort)
}

exports.findOne = async (query, populate = '') => {
    return Department.findOne(query).populate(populate)
}

exports.add = async (body) => {
    // console.log('dbHelper-add:',body)
    return Department.create(body)
}

exports.save = async (body) => {
    if (body && body._id) {
        return Department.findOne({_id: body._id}).then(result => {
            if (result) {
                return new Promise((resolve, reject) => {
                  Department.update({_id: body._id}, body).then(resolve(body)).catch(e => reject(e))
                })
            } else {
                return Department.create(body)
            }
        })
    } else {
        return Department.create(body)
    }
}

exports.insertMany = async (documents) => {
    return Department.insertMany(documents)
}

exports.update = async (filter, body) => {
    return Department.update(filter, body)
}

exports.updateMany = async (filter, doc) => {
    return Department.updateMany(filter, doc)
}

exports.updateOne = async (filter, body, options) => {
    return Department.updateOne(filter, body, options)
}

exports.findOneAndUpdate = async (filter, body, options = {new: true}) => {
    return  Department.findOneAndUpdate(filter, body, options)
}

exports.delete = async (filter) => {
    return Department.remove(filter)
}

/**
 *
 * @param {*} model
 * @param {*} query {
 *   params: {},
 *   page: {},
 *   populate: []
 * }
 */
exports.query = async (query) => {
    if (query.page) {
        return exports.pageQuery(query.params, query.page, query.populate)
    } else {
        return exports.find(query.params, query.populate, query.sort)
    }
}

exports.count = async (params) => {
    let count = await models[model].countDocuments(params)
    return {count: count}
}


