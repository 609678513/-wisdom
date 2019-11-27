const MessageXSend = require('./submailSDK/lib/messageXSend');
const agreementCauseList = ['商务','会议','项目','应聘','私人','考察参观','其他']

// 邀约补全信息短信 WYzDy2
exports.completeInformation = async (invitationRecord) => {
  console.log('补全信息短信开始')

  let project = 'WYzDy2'
  let url = 'http://47.103.124.206:8080/#/bq/' + invitationRecord._id
  let message = new MessageXSend();

  message.set_to(invitationRecord.tel);
  message.set_project(project);

  message.add_var('name1', invitationRecord.name);
  message.add_var('name2', invitationRecord.sponsor.name);
  message.add_var('time', invitationRecord.agreementDate.time);
  message.add_var('type', agreementCauseList[invitationRecord.agreementCause]);
  message.add_var('tel', invitationRecord.sponsor.tel);
  message.add_var('path', url);

  message.xsend()
  console.log('补全信息短信结束')
}

// 接待人通知发送短信 d6zSD
exports.reception = async (invitationRecord) => {
  console.log('接待人通知短信开始')
  let project = 'd6zSD'
  let message = new MessageXSend();

  message.set_to(invitationRecord.receptionist.tel);
  message.set_project(project);
  message.add_var('time', invitationRecord.agreementDate.time);
  message.add_var('name', invitationRecord.name);
  message.add_var('remark', invitationRecord.receptionRemark);

  message.xsend()
  console.log('接待人通知短信结束')
}

// 取消发送短信接待人和访客 d6zSD
exports.cancellation = async (invitationRecord) => {
  console.log('取消通知短信开始')
  let receptionProject = 'qcCsn2'
  let visitorProject = 'n6Mo74'
  let visitorMessage = new MessageXSend();
  let receptionMessage = new MessageXSend();

  visitorMessage.set_to(invitationRecord.tel);
  visitorMessage.set_project(visitorProject);
  visitorMessage.add_var('time', invitationRecord.agreementDate.time);
  visitorMessage.add_var('name', invitationRecord.name);
  visitorMessage.add_var('reason', invitationRecord.closeReason);

  if (invitationRecord && invitationRecord.receptionist) {
    receptionMessage.set_to(invitationRecord.receptionist.tel);
    receptionMessage.set_project(receptionProject);
    receptionMessage.add_var('time', invitationRecord.agreementDate.time);
    receptionMessage.add_var('name', invitationRecord.receptionist.name);
  }


  // visitorMessage.xsend()
  // receptionMessage.xsend()
  console.log('取消通知短信结束')
}

// 拜访时间发生改变通知接待人和访客  nhFZh1 nhFZh1
exports.timeChange = async (invitationRecord) => {
  console.log('拜访时间改变短信开始')
  let receptionProject = 'peqhZ1'
  let visitorProject = 'nhFZh1'
  let visitorMessage = new MessageXSend();
  let receptionMessage = new MessageXSend();

  visitorMessage.set_to(invitationRecord.tel);
  visitorMessage.set_project(visitorProject);
  visitorMessage.add_var('name', invitationRecord.name);
  visitorMessage.add_var('time', invitationRecord.agreementDate.time);
  if (invitationRecord && invitationRecord.receptionist) {
    console.log('接待人发送短信了')
    receptionMessage.set_to(invitationRecord.receptionist.tel);
    receptionMessage.set_project(receptionProject);
    receptionMessage.add_var('name', invitationRecord.receptionist.name);
    receptionMessage.add_var('name1', invitationRecord.name);
    receptionMessage.add_var('tel', invitationRecord.tel)
    receptionMessage.add_var('time', invitationRecord.agreementDate.time);
  }
  visitorMessage.xsend()
  receptionMessage.xsend()
  console.log('拜访时间改变短信结束')
}

// 已到访 通知接待人 o7Y6v
exports.visitInform = async (invitationRecord) => {
  if(!invitationRecord.receptionist){
     return
  }
  console.log('已到访通知短信开始')
  let receptionProject = 'o7Y6v'
  let receptionMessage = new MessageXSend();

  receptionMessage.set_to(invitationRecord.receptionist.tel);
  receptionMessage.set_project(receptionProject);
  receptionMessage.add_var('name', invitationRecord.receptionist.name);
  receptionMessage.add_var('name1', invitationRecord.name);
  receptionMessage.add_var('tel', invitationRecord.tel);

  receptionMessage.xsend()
  console.log('已到访通知短信结束')
}

// 失效发送短信给接待人和访客 暂时不做
exports.cancellation = async (invitationRecord) => {
  console.log('失效通知短信开始')
  let receptionProject = 'qcCsn2'
  let visitorProject = 'n6Mo74'
  let visitorMessage = new MessageXSend();
  let receptionMessage = new MessageXSend();

  visitorMessage.set_to(invitationRecord.tel);
  visitorMessage.set_project(visitorProject);
  visitorMessage.add_var('time', invitationRecord.agreementDate.time);
  visitorMessage.add_var('name', invitationRecord.name);
  visitorMessage.add_var('reason', invitationRecord.closeReason);

  receptionMessage.set_to(invitationRecord.receptionist.tel);
  receptionMessage.set_project(receptionProject);
  receptionMessage.add_var('time', invitationRecord.agreementDate.time);
  receptionMessage.add_var('name', invitationRecord.receptionist.name);

  visitorMessage.xsend()
  receptionMessage.xsend()
  console.log('失效通知短信结束')
}


