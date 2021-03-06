var bean = "com.imfav.business.stock.hbm.ViewCustBackRecord";
var business = "baseMgm";
var listMethod = "findwhereorderby"; 
var primaryKey = "uids";
var orderColumn = "backTime"
var gridPanel;

var allUserArr = new Array();
var paywayArr = new Array();
var salesmanArr = new Array();//业务员
var managerArr = new Array();//销售经理
var directorArr = new Array();//销售总监


DWREngine.setAsync(false);
db2Json.selectSimpleData("select userid,realname FROM rock_user t WHERE t.userid IN " +
		" (SELECT ru.userid FROM rock_role2user ru WHERE ru.rolepk = " +
		" (SELECT r.rolepk FROM rock_role r WHERE r.rolename = '业务员')) order by unitid",
	function(dat){
		salesmanArr = (eval(dat))
});
db2Json.selectSimpleData("select userid,realname FROM rock_user t WHERE t.userid IN " +
		" (SELECT ru.userid FROM rock_role2user ru WHERE ru.rolepk = " +
		" (SELECT r.rolepk FROM rock_role r WHERE r.rolename = '销售经理')) order by unitid",
	function(dat){
		managerArr = (eval(dat))
});
db2Json.selectSimpleData("select userid,realname FROM rock_user t WHERE t.userid IN " +
		" (SELECT ru.userid FROM rock_role2user ru WHERE ru.rolepk = " +
		" (SELECT r.rolepk FROM rock_role r WHERE r.rolename = '销售总监')) order by unitid",
	function(dat){
		directorArr = [['','全部']].concat(eval(dat))
});
baseMgm.getData("select userid, realname from rock_user ",function(list){
	for(var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i][0]);
		temp.push(list[i][1]);
		allUserArr.push(temp);
	}
});
paywayArr.push(['-1','全部'])
appMgm.getCodeValue('付款方式', function(list) {
	for (var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i].propertyCode);
		temp.push(list[i].propertyName);
		paywayArr.push(temp);
	}
})
DWREngine.setAsync(true);

Ext.onReady(function(){
	Ext.QuickTips.init();
	
	var isDirector =  isManager = isSalesman = false;
	var directorUserid = managerUserid = salesmanUserid = null;
	
	if(isInArr(USERID,directorArr)){
		isDirector = true;
		directorUserid = USERID;
	}else if(isInArr(USERID,managerArr)){
		isDirector = true;
		isManager = true;
		managerUserid = USERID;
		DWREngine.setAsync(false);
		//查询该销售经理对应的销售总监
		var sql1 = "select t.userid,t.realname from rock_user t WHERE t.userid = " +
				" (select t.guidetype from rock_user t WHERE t.userid = '"+managerUserid+"')";
		baseMgm.getData(sql1,function(list){
			if(list != null && list.length > 0){
				directorUserid = (list[0][0]);
			}
	    });
	    DWREngine.setAsync(true);
	}else if(isInArr(USERID,salesmanArr)){
		isDirector = true;
		isManager = true;
		isSalesman = true;
		salesmanUserid = USERID;
		DWREngine.setAsync(false);
		//查询该销售经理对应的销售总监
		var sql1 = "select t.userid,t.realname from rock_user t WHERE t.userid = " +
				" (select t.guidetype from rock_user t WHERE t.userid = '"+salesmanUserid+"')";
		baseMgm.getData(sql1,function(list){
			if(list != null && list.length > 0){
				managerUserid = (list[0][0]);
			}
	    });
	    DWREngine.setAsync(true);
	    DWREngine.setAsync(false);
		//查询该销售经理对应的销售总监
		var sql1 = "select t.userid,t.realname from rock_user t WHERE t.userid = " +
				" (select t.guidetype from rock_user t WHERE t.userid = '"+managerUserid+"')";
		baseMgm.getData(sql1,function(list){
			if(list != null && list.length > 0){
				directorUserid = (list[0][0]);
			}
	    });
	    DWREngine.setAsync(true);
	}
	
//	var salesmanDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:salesmanArr});
	var salesmanDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:[]});
//	var managerDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:managerArr});
	var managerDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:[]});
	var directorDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:directorArr});
    var paywayDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:paywayArr});
	
    
    var Columns = [
		{name: 'uids', type: 'string'}
		,{name: 'custUids', type: 'string'}
		,{name: 'name', type: 'string'}
		,{name: 'mobile', type: 'string'}
		,{name: 'payway', type: 'string'}
		,{name: 'backMoney', type: 'float'}
		,{name: 'backTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		,{name: 'salesman', type: 'string'}
		,{name: 'manager', type: 'string'}
		,{name: 'director', type: 'string'}
	];
	
	var formRecord = Ext.data.Record.create(Columns);
    
	var fc={
		 'uids':{name:'uids',fieldLabel:'主键'}
		,'custUids':{name:'custUids',fieldLabel:'客户主键'}
		,'name':{name:'name',fieldLabel:'客户姓名'}
		,'mobile':{name:'mobile',fieldLabel:'手机'}
		,'backMoney':{name:'backMoney',fieldLabel:'回款金额'}
		,'backTime':{name:'backTime',fieldLabel:'回款时间',format:'Y-m-d'}
		,'payway':{name:'payway',fieldLabel:'付款方式'}
		,'salesman':{name:'salesman',fieldLabel:'业务员'}
		,'manager':{name:'manager',fieldLabel:'经理'}
		,'director':{name:'director',fieldLabel:'总监'}
	};
	
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true})
	var rowNum = new Ext.grid.RowNumberer({header:'',width:25});
	var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	//sm,
    	rowNum
    	, {id:'uids',header: fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hideable:false,hidden:true}
    	, {id:'custUids',header: fc['custUids'].fieldLabel,dataIndex:fc['uids'].name,hideable:false,hidden:true}
    	, {id:'name',header: fc['name'].fieldLabel,dataIndex: fc['name'].name,width:80,
    		align:"center",editor:new Ext.form.TextField(fc['name'])}
    	, {id:'mobile',header: fc['mobile'].fieldLabel,dataIndex: fc['mobile'].name,width:100,
    		align:"center",editor:new Ext.form.TextField(fc['mobile'])}
    	, {id:'backMoney',header: fc['backMoney'].fieldLabel,dataIndex: fc['backMoney'].name,width:80,
    		align:'right'}
    	, {id:'backTime',header: fc['backTime'].fieldLabel,dataIndex: fc['backTime'].name,
    		align:"center",editor:new Ext.form.DateField(fc['backTime']),
    		renderer:formatDate}
    	, {id:'payway',header: fc['payway'].fieldLabel,dataIndex: fc['payway'].name,
			align:"center",editor:new Ext.form.ComboBox(fc['payway']),
    		renderer:function(value){return formatCombo(value,paywayArr)}}
    	, {id:'salesman',header: fc['salesman'].fieldLabel,dataIndex: fc['salesman'].name,
			align:"center",editor:new Ext.form.ComboBox(fc['salesman']),
    		renderer:function(value){return formatCombo(value,salesmanArr)}}
    	, {id:'manager',header: fc['manager'].fieldLabel,dataIndex: fc['manager'].name,align:"center",
    		renderer:function(value){return formatCombo(value,allUserArr)}}
    	, {id:'director',header: fc['director'].fieldLabel,dataIndex: fc['director'].name,align:"center",
    		renderer:function(value){return formatCombo(value,allUserArr)}}
	]);
	cm.defaultSortable = true;
	
	var dsTotal = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : "1=1"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
		});
		
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
	
	var paywayCombo = new Ext.form.ComboBox({
		width:80,
		store:paywayDs,
		displayField:'v',
		valueField:'k',
		triggerAction: 'all',
		mode: 'local',
		value: '-1',
		editable: false,
		selectOnFocus:true,
		listeners:{
			'select' : function(combo){
					dsLoad();
				}
			}
	});
	
	var directorCombo = new Ext.form.ComboBox({
		width:80,
		store :directorDs,
		//value:(directorUserid == null ? null : directorUserid),
		emptyText:'销售总监',
    	displayField:'v',
		valueField:'k',
		triggerAction: 'all',
		mode: 'local',
//		disabled: isDirector,
		editable: false,
		selectOnFocus:true,
		listeners:{
			'select' : function(combo){
					managerCombo.clearValue();
					managerCombo.setDisabled(true);
					salesmanCombo.clearValue();
					salesmanCombo.setDisabled(true);
					var director = combo.getValue();
					changeManagerCombo(director);
					dsLoad();
				}
			}
	});
	function changeManagerCombo(director){
		//查询该销售总监对应的销售经理
		DWREngine.setAsync(false);
	    var sql2 = "select t.userid,t.realname from rock_user t WHERE t.guidetype = '"+director+"'";
		baseMgm.getData(sql2,function(list){
			if(list != null && list.length > 0){
				var tempArr = [['','全部']].concat(eval(list));
				managerDs.loadData(tempArr);
				managerCombo.setDisabled(false);
			}
	    });
	    DWREngine.setAsync(true);
	}
	var managerCombo = new Ext.form.ComboBox({
		width:80,
		store :managerDs,
		//value:(managerUserid == null ? null : managerUserid),
		emptyText:'销售经理',
    	displayField:'v',
		valueField:'k',
		triggerAction: 'all',
		mode: 'local',
//		disabled :isManager,
		editable: false,
		selectOnFocus:true,
		listeners:{
			'select' : function(combo){
					salesmanCombo.clearValue();
					salesmanCombo.setDisabled(true);
					var manager = combo.getValue();
					changeSalesmanCombo(manager);
					dsLoad();
				}
			}
	});
	function changeSalesmanCombo(manager){
		//查询该销售经理对于的业务员
		DWREngine.setAsync(false);
	    var sql2 = "select t.userid,t.realname from rock_user t WHERE t.guidetype = '"+manager+"'";
		baseMgm.getData(sql2,function(list){
			if(list != null && list.length > 0){
				var tempArr = [['','全部']].concat(eval(list));
				salesmanDs.loadData(tempArr);
				salesmanCombo.setDisabled(false);
			}
	    });
		DWREngine.setAsync(true);
	}
	var salesmanCombo = new Ext.form.ComboBox({
		width:80,
		store :salesmanDs,
		//value:(salesmanUserid == null ? null : salesmanUserid),
		emptyText:'业务员',
    	displayField:'v',
		valueField:'k',
		triggerAction: 'all',
		mode: 'local',
//		disabled :isSalesman,
		editable: false,
		selectOnFocus:true,
		listeners:{
   			'select':function(){
				dsLoad();
   			}
   		}
	});
	
	var keyText = new Ext.form.TextField({
		id : 'key',
		emptyText:'客户/手机/业务员',
		width:160,
		enableKeyEvents: true,
		listeners : {
			specialKey : function(field, e) {
				if(e.getKey()==e.ENTER){
					queryByKey();
				}
			}
		}
	});
	var keyBtn = new Ext.Button({
		id : 'queryByName',
		text : "查询",
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/cx.png',
		handler : queryByKey
	});
	
	function queryByKey(){
		dsLoad();
	}
	
	var dateField_obj = {
		format: 'Y-m-d',
		width: 95,
		readOnly: true,
		minValue: '2015-01-01',
		maxValue: new Date(),
		menuListeners : {
			select: function(m, d){
				this.setValue(d);
           		dsLoad();
			}
		}
	}
	var begin_obj = {id: 'begin',emptyText: '开始时间'};
	Ext.applyIf(begin_obj,dateField_obj);
	var dateField_begin = new Ext.form.DateField(begin_obj);
	var end_obj = {id: 'end',emptyText: '结束时间'};
	Ext.applyIf(end_obj,dateField_obj);
	var dateField_end = new Ext.form.DateField(end_obj);
	
	var tbarArr = ['总监：',directorCombo,'经理：',managerCombo,'业务员：',salesmanCombo,'付款方式：',paywayCombo,'->','添加时间：',dateField_begin,'至',dateField_end,'-',keyText,keyBtn];
	
	var refreshBtn = new Ext.Button({
		id : 'refresh',
		text : '刷新',
		iconCls : 'refresh',
		handler : function(){
			ds.reload();
			dsTotal.reload();
		}
	})
	var addToolbar = new Ext.Toolbar({
		items : [refreshBtn,'-','回款金额统计：','<span id="backMoneyTotal"></span>']
    })
	var addToolbar2 = new Ext.Toolbar({
		items : ['各项金额统计2：']
    })
	gridPanel = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		sm: sm,
		tbar: tbarArr,
		header: false,
		border: false,
		region: 'center',
		autoScroll: true,
		collapsible: false,
		animCollapse: false,
		loadMask: true,
		stripeRows : true,
		bbar: new Ext.PagingToolbar({
		    pageSize: PAGE_SIZE,
		    store: ds,
		    displayInfo: true,
		    displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		}),
		viewConfig:{
			forceFit: false,
			ignoreAdd: true
		},
		listeners : {
		    "render" : function (){
		        addToolbar.render(this.tbar);
//		        addToolbar2.render(this.tbar);
		        if(directorUserid != null){
		        	directorCombo.setValue(directorUserid)
		        	directorCombo.setDisabled(true);
		        	changeManagerCombo(directorUserid)
		        }
		        if(managerUserid != null){
		        	managerCombo.setValue(managerUserid)
		        	managerCombo.setDisabled(true);
		        	changeSalesmanCombo(managerUserid);
		        }
		        if(salesmanUserid != null){
		        	salesmanCombo.setValue(salesmanUserid)
		        	salesmanCombo.setDisabled(true);
		        }
		    }
		}
	});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel]
	});	
	
	dsLoad();
	
	sm.on("rowselect",function(obj,rinx,rec){
	
	});
	
	dsTotal.on("load",function(){
		document.getElementById("backMoneyTotal").innerHTML = dsTotal.sum('backMoney')+"元";
	})
	
	function dsLoad(){
		var paramsStr = " 1=1 ";
		
		//如果角色是中间人，则加入按照中间人（账号专员）过滤的条件
		if(USERPOSNAME.indexOf("账号专员") != -1){
			paramsStr += " and addUser = '"+USERID+"' ";
		}
		
		var pb = dateField_begin;
		var pe = dateField_end;
		if ('' == pb.getValue() && '' != pe.getValue()){
			paramsStr += ' and backTime <= to_date(\'' + formatDate(pe.getValue()) + '\',\'YYYY-MM-DD\')';
		} else if ('' != pb.getValue() && "" == pe.getValue()){
			paramsStr += ' and backTime >= to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD\')';
		} else if ('' != pb.getValue() && '' != pe.getValue()){
			if (pb.getValue() > pe.getValue()){
				Ext.example.msg('提示！', '开始时间应该小于等于结束时间！');
				return false;
			} else {
					paramsStr += ' and ( backTime ' 
							+ ' between to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD\')' 
							+ ' and to_date(\'' + formatDate(pe.getValue())+ '\',\'YYYY-MM-DD\') )'; 
			}
		}
		
		var key = typeof(keyText) != "undefined" ? keyText.getValue() : "";
		if("" != key && key.length != 0){
			//模糊查询，支持客户姓名，手机，业务员
			paramsStr += " and (name like '%"+key+"%' or mobile like '%"+key+"%' or " +
					" salesman in (select userid from RockUser where realname like '%"+key+"%') )";
		}
		var payway = paywayCombo.getValue();
		//工具栏客户状态下拉框过滤
		if(payway != "-1"){
			paramsStr += " and payway = '"+payway+"' ";
		}
		
		if(directorUserid != null){
			paramsStr += " and director = '"+directorUserid+"' ";
        }
        if(managerUserid != null){
			paramsStr += " and manager = '"+managerUserid+"' ";
        }
        if(salesmanUserid != null){
			paramsStr += " and salesman = '"+salesmanUserid+"' ";
        }
        
        if(directorCombo.getValue().length > 0){
			paramsStr += " and director = '"+directorCombo.getValue()+"' ";
        }
        if(managerCombo.getValue().length > 0){
			paramsStr += " and manager = '"+managerCombo.getValue()+"' ";
        }
        if(salesmanCombo.getValue().length > 0){
			paramsStr += " and salesman = '"+salesmanCombo.getValue()+"' ";
        }
		ds.baseParams.params = paramsStr;
		ds.load({params:{start:0,limit: PAGE_SIZE}});
		dsTotal.baseParams.params = paramsStr;
		dsTotal.load();
	}
	
});

function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
}
function formatCombo(value,array) {
	for (var i = 0; i < array.length; i++) {
		if(value == array[i][0]){
			return array[i][1];
		}
	}
}
function isInArr(value,array) {
	for (var i = 0; i < array.length; i++) {
		if(value == array[i][0]){
			return true;
		}
	}
	return false;
}
