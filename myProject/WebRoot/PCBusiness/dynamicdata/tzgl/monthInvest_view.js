var bean = "com.sgepit.pcmis.tzgl.hbm.PcTzglMonthCompM"

var gridPanel=null;
Ext.onReady(function() {
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			})
	var array_yearMonth=new Array();
	var pre_year=new Date().getYear();
	var months=["01","02","03","04","05","06","07","08","09","10","11","12"];
	for(i =0 ; i <5 ; i++) {
		for(j=0;j<12;j++){
			var temp = new Array();	
			temp.push(pre_year-i+months[j]);		
			temp.push(pre_year-i+"年"+months[j]+"月");	
			array_yearMonth.push(temp);
		}			
	}
	
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
		 new Ext.grid.RowNumberer(),{
				id : 'uids',
				type : 'string',
				header : "主键",
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'pid',
				type : 'string',
				header : "项目编码",
				dataIndex : 'pid',
				hidden : true
			}, {
				id : 'sjType',
				type : 'string',
				header : "时间",
				width:70,
				dataIndex : "sjType",
				align:'center',
				renderer:function(k){
					for(var i = 0;i<array_yearMonth.length;i++){
						if(k == array_yearMonth[i][0]){
							return array_yearMonth[i][1];
						}
					}
				}
			}, {
				id : 'userId',
				type : 'string',
				header : "填报人",
				width:60,
				dataIndex : 'userId',
				align:'center',
				renderer:function(v){
					var value="";
					if(v){
						DWREngine.setAsync(false);
						baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.RockUser", "userid='"+v+"'",function(list){
							if(list.length>0){
								value=list[0].realname;
							}
						});
						DWREngine.setAsync(true);
					};
					return value;
				}
			
			}, {
				id : 'createDate',
				type : 'date',
				header : "填报日期",
				width:100,
				align:'center',
				dataIndex : 'createDate',
				renderer:function(v){if(v)return v.format('Y-m-d H:i:s')}
			
			}, {
				id : 'title',
				type : 'string',
				header :"报表名称",
				width:140,
				align:'center',
				dataIndex : 'title',
				renderer:function(v){
						return "<a href='javascript:showEditWindow2()'>"+v+"</a>";
				}
			}, {
				id : 'memo',
				type : 'string',
				header :"备注",
				width:150,
				dataIndex : 'memo'
			}
	]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'uids',
				type : 'string'
			},{
				name : 'pid',
				type : 'string'
			},{
				name : 'sjType',
				type : 'string'
			},{
				name : 'unitId',
				type : 'string'
			},{
				name : 'title',
				type : 'string'
			},{
				name : 'billState',
				type : 'float'
			},{
				name : 'reportStatus',
				type : 'float'
			},{
				name : 'memo',
				type : 'string'
			},{
				name : 'userId',
				type : 'string'
			},{
				name : 'createDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'lastModifyDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}];
/**
 * 创建数据源
 */
	var ds= new Ext.data.Store({
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
	ds.load();

	
	
	gridPanel =  new Ext.grid.GridPanel({
		store : ds,
		cm : cm,
		sm : sm,
		border : false,
		layout : 'fit',
		region : 'center',
		header : false,
		tbar :['->',new Ext.Button({
			text: '返回',
			iconCls: 'returnTo',
			handler: function(){
				history.back();
			}
		})],
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
		items : [gridPanel]
	});
    
});  

function showEditWindow2(){
	var m_record=gridPanel.getSelectionModel().getSelected();
	window.showModalDialog(
			CONTEXT_PATH+ "/PCBusiness/tzgl/baseInfoInput/pc.tzgl.input.monthInvest.form.jsp",
			m_record,"dialogWidth:820px;dialogHeight:440px;status:no;center:yes;resizable:no;Minimize:yes;Maximize:no");
}



