var bean = 'com.sgepit.pcmis.bid.hbm.PcBidZbApply';
// 招标类型array
var bidTypeArr = new Array();
// 招标方式array
var bidWayArr = new Array();
var businessType = "PCBidApplyReport";

Ext.onReady(function() {
	DWREngine.setAsync(false);
	appMgm.getCodeValue('招标类型', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					bidTypeArr.push(temp);
				}
			});
	appMgm.getCodeValue('招标方式', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					bidWayArr.push(temp);
				}
			});

	DWREngine.setAsync(true);

	// 招标申请信息
		var sm = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
		var columns = [new Ext.grid.RowNumberer(), {
					id : 'uids',
					header : 'uids',
					dataIndex : 'uids',
					hidden : true,
					width : 100
				}, {
					id : 'pid',
					header : '项目编号',
					width : 100,
					hidden : true,
					dataIndex : 'pid'
				}, {
					id : 'zbName',
					header : '招标项目名称',
					dataIndex : 'zbName',
					width : 100
				}, {
					id : 'zbApproveNo',
					header : '批准文号',
					width : 100,
					dataIndex : 'zbApproveNo'
				}, {
					id : 'zbType',
					header : '招标类型',
					width : 60,
					dataIndex : 'zbType',
					align : 'center',
					renderer : function(k){
						for(var i = 0;i<bidTypeArr.length;i++){
							if(k == bidTypeArr[i][0]){
								return bidTypeArr[i][1];
							}
						}
					}
				}, {
					id : 'respondMan',
					header : '主要负责人',
					dataIndex : 'respondMan',
					align : 'center',
					width : 60
				}, {
					id : 'zbWay',
					header : '招标方式',
					dataIndex : 'zbWay',
					align : 'center',
					width : 40,
					renderer : function(k){
						for(var i = 0;i<bidWayArr.length;i++){
							if(k == bidWayArr[i][0]){
								return bidWayArr[i][1];
							}
						}
					}
				}, {
					id : 'applyReport',
					header : '申请报告',
					width : 40,
					dataIndex : 'uids',
					align : 'center',
					renderer : function(v){
							return "<a href='javascript:uploadfile(\""+v+"\",\""+businessType+"\")'>查看</a>";
						}

				}, {
					id : 'memo',
					header : '备注',
					dataIndex : 'memo',
					width : 100
				}, {
					id : 'zbNo',
					header : '招标编号',
					dataIndex : 'zbNo',
					hidden : true
				}];

		var Columns = [{
					name : 'uids',
					type : 'string'
				}, // Grid显示的列，必须包括主键(可隐藏)
				{
					name : 'pid',
					type : 'string'
				}, {
					name : 'zbType',
					type : 'string'
				}, {
					name : 'zbName',
					type : 'string'
				}, {
					name : 'respondMan',
					type : 'string'
				}, {
					name : 'zbWay',
					type : 'string'
				}, {
					name : 'memo',
					type : 'string'
				}, {
					name : 'zbNo',
					type : 'string'
				}, {
					name : 'zbApproveNo',
					type : 'string'
				}];

		var zbApplyDS = new Ext.data.Store({
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
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});

		zbApplyDS.load();

		var zbApplyGrid = new Ext.grid.GridPanel({
					region : 'center',
					ds : zbApplyDS, // 数据源
					columns : columns, // 列模型
					sm : sm,
					border : false,
					tbar :['->',new Ext.Button({
						text: '返回',
						iconCls: 'returnTo',
						handler: function(){
							history.back();
						}
					})],
					layout : 'fit',
					region : 'center',
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
				
		var viewport = new Ext.Viewport({
			layout : 'border',
			items : [zbApplyGrid]
		});
});

function uploadfile(uids,biztype){
	param = {
		businessId:uids,
		businessType:biztype
	};
	showMultiFileWin(param);
	
}

