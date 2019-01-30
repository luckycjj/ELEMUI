const allBillstatus = [
  { key: '0', display_name: '新建' },
  { key: '5', display_name: '已驳回' },
  { key: '10', display_name: '已确认' },
  { key: '15', display_name: '已派车' },
  { key: '20', display_name: '司机发车' },
  { key: '30', display_name: '部分提货' },
  { key: '40', display_name: '已提货' },
  { key: '50', display_name: '部分到货' },
  { key: '60', display_name: '已到货' },
  { key: '70', display_name: '部分签收' },
  { key: '80', display_name: '已签收' },
  { key: '90', display_name: '已回单' },
  { key: '100', display_name: '关闭' }
]
// 订单状态（为派单下）
const vbillstatusOptions = [
  { key: '0', display_name: '新建' },
  { key: '10', display_name: '已确认' }
]
const vbillstatusShipOptions = [
  { key: '15', display_name: '已派车' },
  { key: '20', display_name: '司机出发' },
  { key: '40', display_name: '已提货' },
  { key: '60', display_name: '已到货' }
]
const vbillstatusCompOptions = [
  { key: '80', display_name: '已签收' },
  { key: '90', display_name: '已回单' }
]
const vbillstatusAllOptions = [
  { key: '0', display_name: '新建' },
  { key: '10', display_name: '已确认' },
  { key: '15', display_name: '已派车' },
  { key: '20', display_name: '司机出发' },
  { key: '40', display_name: '已提货' },
  { key: '60', display_name: '已到货' },
  { key: '80', display_name: '已签收' },
  { key: '90', display_name: '已回单' }
]
const pk_trans_typeOptions = [
  { key: 'e5e602a22c5a4689b8d151c76a4d1179', display_name: '零担运输' },
  { key: '5fda0edc8df34b4d8c1ed44a6f1f866e', display_name: '整车运输' }
]
const entrustStates = [
  { key: '0', display_name: '待确认' },
  { key: '10', display_name: '已确认' },
  { key: '20', display_name: '司机出发' },
  { key: '31', display_name: '提货到达' },
  { key: '32', display_name: '开始装货' },
  { key: '33', display_name: '装货完毕' },
  { key: '41', display_name: '运输到达' },
  { key: '42', display_name: '开始卸货' },
  { key: '43', display_name: '卸货完毕' },
  { key: '50', display_name: '已签收' },
  { key: '55', display_name: '已回单' },
  { key: '60', display_name: '退单' }
]
const entrustStatesSend = [
  { key: '0', display_name: '待确认' },
  { key: '10', display_name: '已确认' }
]
const entrustStatesUnderWay = [
  { key: '20', display_name: '司机出发' },
  { key: '31', display_name: '提货到达' },
  { key: '32', display_name: '开始装货' },
  { key: '33', display_name: '装货完毕' },
  { key: '41', display_name: '运输到达' },
  { key: '42', display_name: '开始卸货' },
  { key: '43', display_name: '卸货完毕' }
]
const entrustStatesCompleted = [
  { key: '50', display_name: '已签收' },
  { key: '55', display_name: '已回单' }
]
const costStates = [
  { key: '0', display_name: '未确认' },
  { key: '1', display_name: '已确认' },
  { key: '2', display_name: '已对账' },
  { key: '3', display_name: '已开票' },
  { key: '4', display_name: '已核销' }
]
const serviceStates = [
  { key: '0', display_name: '一装一卸' },
  { key: '1', display_name: '一装' },
  { key: '2', display_name: '一卸' }
]
const paymentStates = [
  { key: '1', display_name: '电汇' },
  { key: '2', display_name: '现金' },
  { key: '3', display_name: '支票' }
  // { key: '4', display_name: '代收' },
  // { key: '5', display_name: '代付' }
]
const balatypeStates = [
  { key: '0', display_name: '月结' },
  { key: '1', display_name: '现结' }
]
const carLengthStates = [
  { key: '4', display_name: '4' },
  { key: '5.5', display_name: '5.5' },
  { key: '6.2', display_name: '6.2' },
  { key: '7.2-8.8', display_name: '7.2-8.8' },
  { key: '9.6', display_name: '9.6' },
  { key: '9.6-12.5', display_name: '9.6-12.5' },
  { key: '12.5-15', display_name: '12.5-15' },
  { key: '15-17', display_name: '15-17' }
]
const entrustStateKeyValue = entrustStates.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default{
  allBillstatus,
  vbillstatusOptions,
  vbillstatusShipOptions,
  vbillstatusCompOptions,
  vbillstatusAllOptions,
  pk_trans_typeOptions,
  entrustStates,
  entrustStatesSend,
  entrustStatesUnderWay,
  entrustStatesCompleted,
  costStates,
  serviceStates,
  paymentStates,
  balatypeStates,
  carLengthStates,
  entrustStateKeyValue
}
