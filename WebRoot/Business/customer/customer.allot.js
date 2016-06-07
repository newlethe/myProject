
﻿var beanUser = "com.sgepit.frame.sysman.hbm.RockUser"
var businessUser = "baseMgm"
var listMethodUser = "findWhereOrderby"
var primaryKeyUser = "userid"
var orderColumnUser = "userid"

var bean = "com.imfav.business.customer.hbm.Customer";
var business = "baseMgm";
var listMethod = "findwhereorderby"; 
var primaryKey = "uids";
var orderColumn = "addTime"
var state = 1;

var userRolename = "销售总监";
if(USERPOSNAME.indexOf(userRolename) != -1){
	userRolename = "销售经理";
	state = 2;
}

Ext.onReady(function(){
	
	var unitArr = new Array();
	DWREngine.setAsync(false);
	db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit order by unitid",
		function(dat){
			unitArr = (eval(dat))
	});
	DWREngine.setAsync(true);

	//TODO:用户模块
	var smUser = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var fcUser = {
		'userid' : {name : 'userid', fieldLabel : '主键'},
		'realname' : {name : 'realname', fieldLabel : '姓名'},
		'deptId' : {name : 'deptId', fieldLabel : '部门'}
	}
	var rowNum = new Ext.grid.RowNumberer({header:'',width:25});
	var cmUser = new Ext.grid.ColumnModel([//创建列模型
		rowNum
		,{id:'userid',header:fcUser['userid'].fieldLabel,dataIndex:fcUser['userid'].name,hideable:false,hidden:true}
		,{id:'realname',header:fcUser['realname'].fieldLabel,dataIndex:fcUser['realname'].name}
		,{id:'deptId',header:fcUser['deptId'].fieldLabel,dataIndex:fcUser['deptId'].name,
			renderer:function(value){return formatCombo(value,unitArr)}}
	]);
	cmUser.defaultSortable = true;
	var ColumnsUser = [
		{name : 'userid',type : 'string'}
		,{name : 'realname',type : 'string'}
		,{name : 'deptId',type : 'string'}
	];
	
	var whereUser = "userid IN (SELECT ru.userid FROM RockRole2user ru WHERE ru.rolepk = " +
			" (SELECT r.rolepk FROM RockRole r WHERE r.rolename = '"+userRolename+"'))";
	var dsUser = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanUser,
			business : businessUser,
			method : listMethodUser,
			params : whereUser
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyUser
		}, ColumnsUser),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsUser.setDefaultSort(orderColumnUser, 'asc');

	var userBtn = new Ext.Button({
		id : 'user',
		text : userRolename+"列表",
		iconCls : 'orangeUser',
		handler : function(){
			dsUser.reload();
		}
	})
	var contGridPanel = new Ext.grid.GridPanel({
		ds : dsUser,
		cm : cmUser,
		sm : smUser,
		width : 260,
		tbar : [userBtn],
		header : false,
		region : 'west',
		split:true,
		collapsible: true,
		animCollapse: true,
		stripeRows : true,
		loadMask : true,
        animate: true,
        collapseMode:'mini',
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		}
	});
	
	//TODO:客户模块
	var Columns = [
		{name: 'uids', type: 'string'}
		,{name: 'name', type: 'string'}
		,{name: 'mobile', type: 'string'}
		,{name: 'qq', type: 'string'}
		,{name: 'province', type: 'string'}
		,{name: 'city', type: 'string'}
	];
	var fc={
		 'uids':{name:'uids',fieldLabel:'主键'}
		,'name':{name:'name',fieldLabel:'客户姓名'}
		,'mobile':{name:'mobile',fieldLabel:'手机'}
		,'qq':{name:'qq',fieldLabel:'QQ'}
		,'province':{name:'province',fieldLabel:'省'}
		,'city':{name:'city',fieldLabel:'市'}
	};
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})
	var rowNum = new Ext.grid.RowNumberer({header:'',width:25});
	var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,rowNum
    	, {id:'uids',header: fc['uids'].fieldLabel,dataIndex: fc['uids'].name,hideable:false,hidden:true}
    	, {id:'name',header: fc['name'].fieldLabel,dataIndex: fc['name'].name,width:80,
    		align:"center",editor:new Ext.form.TextField(fc['name'])}
    	, {id:'mobile',header: fc['mobile'].fieldLabel,dataIndex: fc['mobile'].name,width:100,
    		align:"center",editor:new Ext.form.TextField(fc['mobile'])}
    	, {id:'qq',header: fc['qq'].fieldLabel,dataIndex: fc['qq'].name,width:100,
    		align:"center",editor:new Ext.form.TextField(fc['qq'])}
    	, {id:'province',header: fc['province'].fieldLabel,dataIndex: fc['province'].name,width:80,
    		align:"center",editor:new Ext.form.TextField(fc['province'])}
    	, {id:'city',header: fc['city'].fieldLabel,dataIndex: fc['city'].name,width:80,
    		align:"center",editor:new Ext.form.TextField(fc['city'])}
	]);
	cm.defaultSortable = true;
	var ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	ds.setDefaultSort(orderColumn, 'desc');
	
	
	var addCustBtn = new Ext.Button({
		id : 'addCust',
		text : "分配客户",
		iconCls : 'add',
		handler : function(){
			var record = smUser.getSelected();
			if(record){
				customerGridWin.showCustomerGridWin(record.data.userid);
				customerGridWin.on("hide",function(){
					customerGridWin.closeCustomerGridWin(ds);
				});
			}else{
				Ext.example.msg("提示","请先选择一个"+userRolename+"！")
			}
		}
	});
	var removeCustBtn = new Ext.Button({
		id : 'removeCust',
		text : "移除客户",
		iconCls : 'remove',
		handler : function(){
			var record = smUser.getSelected();
			var recordArr = sm.getSelections();
			if(recordArr && recordArr.length > 0){
				var uidsArr = new Array();
				for (var i = 0; i < recordArr.length; i++) {
					var rec = recordArr[i];
					uidsArr.push(rec.data.uids);
				}
				DWREngine.setAsync(false);
				stockMgm.removeCustomerUser(uidsArr,record.data.userid,function(num){
					if(num > 0){
						Ext.example.msg("提示","客户移除成功！")
						ds.reload();
					}else{
						Ext.example.msg("提示","客户移除失败！")
					}
				})
				DWREngine.setAsync(true);
			}else{
				Ext.example.msg("提示","请先选择一个客户！")
			}
		}
	});
	var tbarArr = [addCustBtn,'-',removeCustBtn];
	var custGridPanel = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		sm: sm,
		tbar: tbarArr,
		header: false,
		region: 'center',
		autoScroll: true,
		loadMask: true,
		bbar: new Ext.PagingToolbar({
		    pageSize: PAGE_SIZE,
		    store: ds,
		    displayInfo: true,
		    displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		}),
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
	});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contGridPanel,custGridPanel]
	});	
	
	dsUser.load();
	smUser.on("rowselect",function(obj,rinx,rec){
		var record = smUser.getSelected();
		var userid = record.data.userid;
		ds.baseParams.params = " 1=1 and uids in (select t.custUids from CustUser t where t.userid = '"+userid+"')";
		ds.load();
	});
	
});


function formatCombo(value,array) {
	for (var i = 0; i < array.length; i++) {
		if(value == array[i][0]){
			return array[i][1];
		}
	}
};