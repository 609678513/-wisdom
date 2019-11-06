const departmentHelper = require('../service/dbhelper/departmentHelper')
const personHelper = require("../service/dbHelper/personHelper")
const lodash = require('lodash')
const assert = require('assert')


const model = 'department'

function constrTree(data) {
  let roots = []
  // 获取根节点
  data.forEach(ele => {
    if (!ele.parent) {
      roots.push(ele)
    }
  })
  let tree = []
  roots.forEach(ele => {
    let tmp = {
      _id: ele._id,
      name: ele.name,
      parent: ele.parent,
      level: ele.level,
      sort: ele.sort,
      children: getChildren(data, ele)
    }
    tree.push(tmp)
  })
  return tree
}

// data 中获取所有ele的子节点
function getChildren(data, ele) {
  let children = []
  // 获取ele的所有children
  data.forEach((child) => {
    if (child.parent && child.parent.toString() === ele._id.toString()) {
      children.push({
        _id: child._id,
        name: child.name,
        parent: child.parent,
        level: child.level,
        sort: child.sort,
        children: getChildren(data, child)
      })
    }
  })
  return children
}

async function recConstructDepartmentList(_id) {
  let results = []
  let children = await departmentHelper.find({parent: _id, deleted: false})
  for (let child of children) {
    results.push(child._id.toString())
    results = lodash.union(results, await recConstructDepartmentList(child))
  }
  return results
}


exports.findPage = async ({filter = {}, pagination}) => {
  if (pagination) {
    return await departmentHelper.pageQuery3(model, filter, pagination)
  } else {
    return await departmentHelper.find(model, filter)
  }
},

exports.find = async (query) => {
    if (Object.keys(query.params).length > 0) {
      let filter = query.params
      return await departmentHelper.find(model, filter)
    } else {
      return false
    }
  },

exports.findOne = async (filter) => {
    filter.deleted = false
    return departmentHelper.findOne(filter)
  },

exports.findIdListIncludeChildren = async (_id) => {
  let results = [_id]
    return lodash.union(results, await recConstructDepartmentList(_id))
  },

exports.findDepartmentTree = async (query) => {
    let departments = await departmentHelper.find({deleted: false}, '', {sort: 1, updateTime: -1})
    return constrTree(departments)
  },

exports.add = async (department) => {
  console.log('增加部门', department)
  // deprecated : 同级部门不可重复，不同级可重复
    // let depByName = await dbHelper.findOne(model, {name: department.name, deleted: false})
    // assert(!depByName, "部门已存在！")
    // 设置等级:父节点的等级+1
    let parent = await departmentHelper.findOne({_id: department.parent, deleted: false})
  // assert(parent, "上级部门不存在！")
    if (!parent) {
      department.level = 1
    } else {
      department.level = parent.level + 1
    }

    // 新增部门默认排序为1
    department.sort = 1
    // 设置排序 1.查找父节点下的子节点(同级节点) 修改子节点的排序
    let deps = await departmentHelper.find({parent: department.parent, deleted: false})
    console.log('排序否？', parent)
  deps.forEach(async (dep) => {
      dep.sort++
      await departmentHelper.findOneAndUpdate({_id: dep._id}, dep)
    })

    return await departmentHelper.add(department)
  },

exports.update = async (department) => {
    console.log('开始修改部门')
    const oldDep = await departmentHelper.findOne({_id: department._id, deleted: false})
    assert(oldDep, '部门不存在!')

    let depByName = await departmentHelper.findOne({
      name: department.name,
      parent: department.parent,
      deleted: false
    })
    assert(!depByName, '已存在同级部门')

    return departmentHelper.updateOne({_id: department._id}, department)
  },

exports.delete = async (filter) => {
    console.log('删除开始', filter)
    let dep = await departmentHelper.findOne({_id: filter._id, deleted: false})
    assert(dep, '部门不存在！')
    // 判断是否存在下级部门
    let childDep = await departmentHelper.findOne({parent: dep._id, deleted: false})
    assert(!childDep, '部门下存在子部门，不能删除！')
    // 判断是否有人员属于此部门
    let person = await personHelper.findOne({department: dep._id, deleted: false})
    assert(!person, '部门下存在人员，不能删除！')
    dep.deleted = true
    return await departmentHelper.findOneAndUpdate(filter, dep)
}

