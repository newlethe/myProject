var primaryKey = "uids"
// var propertyName = "sortUids"
// var approvalStatus =[['%', '全部'], ['1', '已办理'], ['0', '未办理'], ['-1', '办理中']];

var projInfo = {
	pid : '',
	pname : '',
	industryType : ''
};
var reportStat = [['0', '未上报'], ['1', '已上报']];

var orderColumn = 'createdate';

Ext.onReady(function() {
			// DWREngine.setAsync(false);
			// baseDao.findByWhere2("com.sgepit.pcmis.zhxx.hbm.VPcZhxxPrjInfo","pid='"+pid+"'",function(list){
			// if(list.length>0) projInfo = list[0];
			// });
			// DWREngine.setAsync(true);

			var ypColumns = [{
						name : 'uids',
						type : 'string'
					}, // Grid显示的列，必须包括主键(可隐藏)
					{
						name : 'pid',
						type : 'string'
					}, {
						name : 'projectId',
						type : 'string'
					}, {
						name : 'createdate',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'createperson',
						type : 'string'
					}, {
						name : 'yeardate',
						type : 'string'
					}, {
						name : 'reportname',
						type : 'string'
					}, {
						name : 'reportStat',
						type : 'string'
					}, {
						name : 'memo',
						type : 'string'
					}]

			var ypDs = new Ext.data.Store({
				baseParams : {
					ac : 'list', // 表示取列表
					bean : 'com.sgepit.pcmis.zlgk.hbm.PcZlgkYpInfo',
					business : 'baseMgm',
					method : 'findWhereOrderby',
					params : "pid='" + pid + "'"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : "uids"
						}, ypColumns),
				remoteSort : true,
				pruneModifiedRecords : true
					// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
				});

			ypDs.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列

			var fm = Ext.form;
			// 创建可编辑配置区域
			var fc = { // 创建编辑域配置
				'uids' : {
					name : 'uids',
					fieldLabel : '唯一约束',
					hidden : true,
					hideLabel : true
				},
				'pid' : {
					name : 'pid',
					fieldLabel : '项目编号',
					hidden : true,
					hideLabel : true,
					anchor : '95%'
				},
				'projectId' : {
					name : 'projectId',
					fieldLabel : '验评信息表ID',
					hidden : true,
					hideLabel : true,
					anchor : '95%'
				},
				'createdate' : {
					name : 'createdate',
					fieldLabel : '填报时间',
					hidden : false,
					hideLabel : false,
					format : 'Y-m-d',
					minValue : '2010-01-01',
					anchor : '95%'
				},
				'createperson' : {
					name : 'createperson',
					fieldLabel : '填报人',
					hidden : false,
					hideLabel : false,
					anchor : '95%'
				},
				'yeardate' : {
					name : 'yeardate',
					fieldLabel : '上报年份',
					hidden : true,
					hideLabel : true,
					anchor : '95%'
				},
				'reportname' : {
					name : 'reportname',
					fieldLabel : '验评信息表名称',
					hidden : false,
					hideLabel : false,
					anchor : '95%'
				},
				'reportStat' : {
					name : 'reportStat',
					fieldLabel : '上报状态',
					displayField : 'v',
					valueField : 'k',
					mode : 'local',
					triggerAction : 'all',
					lazyRender : false,
					listClass : 'x-combo-list-small',
					store : new Ext.data.SimpleStore({
								fields : ['k', 'v'],
								data : [['0', '未上报'], ['1', '已上报']]
							}),
					anchor : '95%'
				},
				'memo' : {
					name : 'memo',
					fieldLabel : '备注',
					hidden : false,
					hideLabel : false,
					anchor : '95%'
				}
			}
			// 编辑区域配置完成-------------------------------------
			// 创建列模型
			var ypSm = new Ext.grid.CheckboxSelectionModel({
						singleSelect : true
					})
			var ypCm = new Ext.grid.ColumnModel([ypSm, {
						id : 'uids',
						header : fc['uids'].fieldLabel,
						dataIndex : fc['uids'].name,
						hidden : true
					}, {
						id : 'pid',
						header : fc['pid'].fieldLabel,
						dataIndex : fc['pid'].name,
						hidden : true
					}, {
						id : 'projectId',
						header : fc['projectId'].fieldLabel,
						dataIndex : fc['projectId'].name,
						hidden : true
					}, {
						id : 'createdate',
						header : fc['createdate'].fieldLabel,
						dataIndex : fc['createdate'].name,
						hidden : false,
						width : 160,
						renderer : formatDate
					}, {
						id : 'createperson',
						header : fc['createperson'].fieldLabel,
						dataIndex : fc['createperson'].name,
						hidden : false,
						width : 140
					}, {
						id : 'yeardate',
						header : fc['yeardate'].fieldLabel,
						dataIndex : fc['yeardate'].name,
						hidden : true
					}, {
						id : 'reportname',
						header : fc['reportname'].fieldLabel,
						dataIndex : fc['reportname'].name,
						hidden : false,
						width : 180
					}, {
						// 这里附件id使用uids
						id : 'uids',
						header : '附件',
//						dataIndex : '',
						dataIndex :'uids',
						hidden : false,
						width : 100,
						align: 'center',
						renderer : function(v){
//							return "<a href='javascript:uploadfile(\"" + primaryKey
//									+ "\",\"BUSINESSTYPE\")'>查看</a>"
							return "<a href='javascript:downloadfile(\""+v+"\",\"BUSINESSTYPE\")'>查看</a>"
						}
					}, {
						id : 'reportStat',
						header : fc['reportStat'].fieldLabel,
						dataIndex : fc['reportStat'].name,
						hidden : false,
						renderer : statusShow
					}, {
						id : 'memo',
						header : fc['memo'].fieldLabel,
						dataIndex : fc['memo'].name,
						width : 120,
						hidden : false
					}]);
			// 列模型创建完毕

			// 创建显示批文办理情况的grid
			var ypGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				ds : ypDs,
				cm : ypCm, // 列模型
				sm : ypSm,
				addBtn: false,
				delBtn: false,
				saveBtn: false,
				tbar : [
//					{
//					xtype: 'button',
//					text: '上报',
//					handler: ReportUp
//				},'->'
				],// 顶部工具栏，可选
//				title:'<center><b><font size=3>质量验评信息一览表</font></b></center>',// 面板标题
				border : false, // 
				clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
				header : true, //
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				// autoExpandColumn: 'pwName', //列宽度自动扩展，可以用列名，也可以用序号（从1开始）
				loadMask : true, // 加载时是否显示进度
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ypDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(ypColumns),
				plantInt : {
					uids : '',
					pid : CURRENTAPPID,
					projectId : '',
					createdate : SYS_DATE_DATE,
					createperson : '',
					yeardate : '',
					reportname : SYS_DATE_DATE.getFullYear() + "年" + SYS_DATE_DATE.getMonth()+"月" + "质量验评统计报表",
					reportStat : '0',
					memo : ''
				},
				servletUrl : MAIN_SERVLET,
				bean : 'com.sgepit.pcmis.zlgk.hbm.PcZlgkYpInfo',
				primaryKey : "uids"
				});

			// 下面是布局的实现-----------------------------------------------------------------
			var viewPort = new Ext.Viewport({
						layout : 'border',
						items : [ypGrid]
					})
			ypDs.load();
		}) // Ext.onReady()结束
// 其他自定义函数(格式化)
function statusShow(value) {
	for (var i = 0; i < reportStat.length; i++) {
		if (value == reportStat[i][0]) {
			return reportStat[i][1];
			break;
		}
	}
	return "";
}

function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
};

function downloadfile(pid,biztype){
	var param = {
		businessId:pid,
		businessType:biztype,
		editable : "true"
	};
	showMultiFileWin(param);
}

//上报执行函数
function ReportUp()
{
	
}