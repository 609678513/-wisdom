var array=[
  {
    'index_id': 119,
    'area_id': '18335623',
    'name': '满意度',
    'value': 100
  },
  {
    'index_id': 119,
    'area_id': '18335624',
    'name': '满意度',
    'value': 20
  },
  {
    'index_id': 119,
    'area_id': '18335625',
    'name': '满意度',
    'value': 80
  }];


let max = array.reduce((a, b) => {
  if (a.value >= b.value) return a
  if (a.value < b.value) return b
})

console.log(max)