
exports.DIRECTION = {0: '进', 1: '出'},

exports.GENDER = {0: '男', 1: '女'},

exports.ENTRY_STATE = {0: '在职', 1: '离职'},

exports.CERTIFICATE_TYPE = {0: '身份证', 1: '护照'},

exports.MESSAGE_TYPES = {
		0: '系统消息',
		1: '预约消息',
		2: '拜访消息',
		3: '人脸消息', // 包含黑名单、陌生人等，由web或client端获取personType判断弹相应消息提示
		4: '反馈消息', // Todo 待定，是否需要拆分
		5: '导入通知',
		6: '导出通知',
		7: '账号登出',
		8: '呼叫消息', // 访客呼叫前台
		9: '返回首页',  // 访客机扫码后返回首页
		10: '黑名单消息',  // ws黑名单消息
		11: '尾随消息',  // ws尾随消息
		12: '滞留消息',  // ws滞留消息
		// 大屏消息，适用于大屏前端内部和大屏前后端之间，当前大屏后端使用iopa(主业务逻辑在service)
		'BSD_SYSTEM_RESTART': 'BSD_SYSTEM_RESTART', // 大屏-系统重启 可以无消息内容
		'BSD_CONFIG_REFRESH': 'BSD_CONFIG_REFRESH', // 大屏-配置刷新 消息内容可以指定刷新的模块
		'BSD_LOG_EMAIL': 'BSD_LOG_EMAIL', // 大屏-生成并通过邮件发送日志 可以指定邮件地址列表
		'BSD_NORMAL': 'BSD_NORMAL', // 大屏-一般消息 消息内容包含子类型和消息内容 内容 {type: 'BSD-NORMAL', data: {subtype: 'PERSON-IO', data: {}}}
	},

	// 人员类型type 保持不变 0 员工 3 访客。没有其他值
	// 新增人员子类型。人员子类型存储于personTypeEntity中。
	// 里面包含了
	// default（是否为默认，员工有且只有一个，访客有且只有一个默认）
	// name（类型名称）
	// defaultRole（默认角色）
	// number编号(如下)
	// 1 ~ 9 员工子类型
	// 30 ~ 39 访客子类型
	// 30 普通访客 31 '快递', 32: '应聘', 33: 'VIP', 34: '陌生人', 35: '黑名单', 36: '其他'

	// 之前判断访客为vip
	// if (person.type === 4)
	// }
	// 现在判断访客为vip
	// if (person.type === 3 && person.subType === 33)
	// }
exports.PERSON_TYPE = {0: '员工', 3: '访客'},

exports.EMPLOYEE_SUB_TYPE = {1: '普通员工'},

exports.VISITOR_SUB_TYPE = {30: '普通访客', 31: '快递', 32: '应聘', 33: 'VIP', 34: '陌生人', 35: '黑名单', 36: '其他'},

exports.AGREEMENT_CAUSE = {0: '商务', 1: '会议', 2: '项目', 3: '私人', 4: '考察参观', 5: '其他'},

	// 拜访时间
exports.AGREEMENT_TIME = {0: '白天(08:00～18:00)', 1: '晚间(18:00～次日08:00)', 2: '全天(00:00～24:00)'}
