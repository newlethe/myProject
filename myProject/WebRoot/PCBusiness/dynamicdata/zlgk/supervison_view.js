bean="com.sgepit.pcmis.zlgk.hbm.PcZlgkSuperreportInfo";
var reportType = [['1', '周报'], ['2', '月报']];
var reportStat = [['0', '未上报'], ['1', '已上报']];
var jlGrid = null;
var orderColumn = 'createdate';

Ext.onReady(function() {
			var jlColumns = [{
						name : 'pid',
						type : 'string'
					}, {
						name : 'uids',
						type : 'string'
					}, {
						name : 'createdate',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'createperson',
						type : 'string'
					}, {
						name : 'type',
						type : 'string'
					}, {
						name : 'reportname',
						type : 'string'
					}, {
						name : 'memo',
						type : 'string'
					}, {
						name : 'reportStat',
						type : 'string'
					}, {
						name : 'projectId',
						type : 'string'
					}, {
						name : 'supercompa',
						type : 'string'
					}]

			var jlDs = new Ext.data.Store({
				baseParams : {
					beanName : bean,
					primaryKey: 'uids',
					pid : PID,
					uids : UIDS
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : CONTEXT_PATH + "/servlet/DynamicServlet"
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'uids'
						}, jlColumns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
			jlDs.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
			jlDs.load();
			var fm = Ext.form;
			// 创建可编辑配置区域
			var fc = { // 创建编辑域配置
				'pid' : {
					name : 'pid',
					fieldLabel : '项目编号',
					hidden : true,
					hideLabel : true,
					anchor : '95%'
				},
				'uids' : {
					name : 'uids',
					fieldLabel : '唯一约束',
					hidden : true,
					hideLabel : true
				},
				'createdate' : {
					name : 'createdate',
					fieldLabel : '报告日期',
					hidden : false,
					hideLabel : false,
					format : 'Y-m-d',
					minValue : '2010-01-01',
					anchor : '95%'
				},
				'createperson' : {
					name : 'createperson',
					fieldLabel : '报告撰写人',
					hidden : false,
					hideLabel : false,
					anchor : '95%'
				},
				'type' : {
					name : 'type',
					fieldLabel : '报告类型',
					displayField : 'v',
					valueField : 'k',
					mode : 'local',
					triggerAction : 'all',
					lazyRender : false,
					listClass : 'x-combo-list-small',
					store : new Ext.data.SimpleStore({
								fields : ['k', 'v'],
								data : [['1', '周报'], ['2', '月报']]
							}),
					anchor : '95%'
				},
				'reportname' : {
					name : 'reportname',
					fieldLabel : '报告名称',
					hidden : false,
					hideLabel : false,
					anchor : '95%'
				},
				'memo' : {
					name : 'memo',
					fieldLabel : '备注',
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
					anchor : '95%',
					align: 'center'
				},
				'projectId' : {
					name : 'projectId',
					fieldLabel : '验评信息表ID',
					hidden : true,
					hideLabel : true,
					anchor : '95%'
				},
				'supercompa' : {
					name : 'supercompa',
					fieldLabel : '报告单位',
					hidden : false,
					hideLabel : false,
					anchor : '95%'
				}
			}
			// 编辑区域配置完成-------------------------------------
			// 创建列模型
			var jlSm = new Ext.grid.CheckboxSelectionModel({
						singleSelect : true
					})
			var jlCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), 
					{
						id : 'pid',
						header : fc['pid'].fieldLabel,
						dataIndex : fc['pid'].name,
						hidden : true
					}, {
						id : 'uids',
						header : fc['uids'].fieldLabel,
						dataIndex : fc['uids'].name,
						hidden : true
					}, {
						id : 'createdate',
						header : fc['createdate'].fieldLabel,
						dataIndex : fc['createdate'].name,
						hidden : false,
						width : 120,
						renderer : formatDate,
						align: 'center'
					}, {
						id : 'createperson',
						header : fc['createperson'].fieldLabel,
						dataIndex : fc['createperson'].name,
						hidden : true,
						width : 140
					}, {
						id : 'type',
						header : fc['type'].fieldLabel,
						dataIndex : fc['type'].name,
						hidden : false,
						renderer : typeShow,
						align: 'center'
					}, {
						id : 'reportname',
						header : fc['reportname'].fieldLabel,
						dataIndex : fc['reportname'].name,
						hidden : false,
						width : 180,
						align: 'center'
					}, {
						id : 'memo',
						header : fc['memo'].fieldLabel,
						dataIndex : fc['memo'].name,
						width : 120,
						hidden : true,
						align: 'center'
					}, {
						id : 'reportStat',
						header : fc['reportStat'].fieldLabel,
						dataIndex : fc['reportStat'].name,
						hidden : false,
						align: 'center',
						renderer : statShow
					}, {
						id : 'projectId',
						header : fc['projectId'].fieldLabel,
						dataIndex : fc['projectId'].name,
						hidden : true
					}, {
						id : 'supercompa',
						header : fc['supercompa'].fieldLabel,
						dataIndex : fc['supercompa'].name,
						hidden : false,
						width: 150,
						align: 'center'
					}, {
						// 附件id使用uids
						id : 'uids',
						header :'查看附件',
						// dataIndex : '',
						dataIndex : fc['uids'].name,
						hidden : false,
						align: 'center',
						width : 100,
						renderer : function(v,m,r) {
							return "<a href='javascript:uploadfile(\"" + v
									+ "\",\""+false+"\")'>"+'附件'+"</a>"
						}
					}]);
			// 列模型创建完毕

			// 创建显示批文办理情况的grid
			 jlGrid = new Ext.grid.GridPanel({
						id: 'glGrid',
						ds : jlDs,
						cm : jlCm, // 列模型
						sm : jlSm,
						layout : 'fit',
						region : 'center',
						tbar :['->',new Ext.Button({
							text: '返回',
							iconCls: 'returnTo',
							handler: function(){
								history.back();
							}
						})],
						header : false,
						autoScroll : true, // 自动出现滚动条
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						loadMask : true, // 加载时是否显示进度
						stripeRows : true,
						trackMouseOver : true,
						viewConfig : {
							forceFit : true,
							ignoreAdd : true
						}
					});

		
			
//布局的实现-----------------------------------------------------------------
			var viewPort = new Ext.Viewport({
						layout : 'border',
						items : [jlGrid]
					})
	
})
		
// Ext.onReady()结束

// 其他自定义函数(格式化)
function typeShow(value) {
	for (var i = 0; i < reportType.length; i++) {
		if (value == reportType[i][0]) {
			return reportType[i][1];
			break;
		}
	}
	return "";
}

function statShow(value) {
	for (var i = 0; i < reportStat.length; i++) {
		if (value == reportStat[i][0]) {
			return reportStat[i][1];
		}
	}
	return "";
}

function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
}

function uploadfile(val,enable) {
	var param = {
		businessId : val,
		businessType : 'PCJianLiBaoGao',
		editable : enable
	};
	showMultiFileWin(param);
}
