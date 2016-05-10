var bean = "com.imfav.business.customer.hbm.Customer";
var business = "baseMgm";
var listMethod = "findwhereorderby"; 
var primaryKey = "uids";
var orderColumn = "addTime"
var gridPanel;

var hideBtn = false;
/**
 * 销售总监，则为true
 * @type Boolean
 */
var hideAllBtn = false;
if(USERPOSNAME.indexOf("账号专员") != -1){
	hideBtn = true;
}else if(USERPOSNAME.indexOf("销售总监") != -1){
	hideBtn = true;
	hideAllBtn = true;
}

var startYear = "2015";
var startMonth = "01";
var startYearMonth = startYear+""+startMonth
var thisYear = new Date().getFullYear();
var thisMonth = (new Date().getMonth()) + 1;
var thisYearMonth = thisYear+""+thisMonth;
var today = thisYear+"-"+thisMonth+"-"+(new Date().getDate());

//年月选择框
var array_yearMonth=getYearMonthBySjType(startYearMonth,thisYearMonth);
var allUserArr = new Array();
var unitArr = new Array();
var unitUserArr = new Array();
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
db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit order by unitid",
	function(dat){
		unitArr = (eval(dat))
});
db2Json.selectSimpleData("select userid,realname from rock_user where dept_id = '"+USERDEPTID+"'",
	function(dat){
		unitUserArr = (eval(dat))
});
baseMgm.getData("select userid, realname from rock_user ",function(list){
	for(var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i][0]);
		temp.push(list[i][1]);
		allUserArr.push(temp);
	}
});
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
//    Ext.form.Field.prototype.msgTarget = 'side';
        
	var dsCombo_yearMonth=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: array_yearMonth
	});
	var monthCombo = new Ext.form.ComboBox({
		width:100,
		store :dsCombo_yearMonth,
		value:thisYearMonth,
    	displayField:'v',
		valueField:'k',
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		allowBlank: false,
		selectOnFocus:true,
		listeners:{
   			'select':function(){
   				var month = monthCombo.getValue();
   				var paramsStr = " and to_char(addTime,'YYYYMM') = '"+month+"' ";
				dsLoad();
   			}
   		}
	});
	
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
	
	var salesmanDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:salesmanArr});
	var managerDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:managerArr});
	var directorDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:directorArr});
    var unitDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:unitArr});
    var unitUserDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:unitUserArr});
    var paywayDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:paywayArr});
    
	var Columns = [
		{name: 'uids', type: 'string'}
		,{name: 'name', type: 'string'}
		,{name: 'mobile', type: 'string'}
		,{name: 'qq', type: 'string'}
		,{name: 'province', type: 'string'}
		,{name: 'city', type: 'string'}
		,{name: 'fund', type: 'float'}
		,{name: 'quote', type: 'float'}
		,{name: 'deposit', type: 'float'}
		,{name: 'back', type: 'float'}
		,{name: 'payway', type: 'string'}
		,{name: 'backTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		,{name: 'salesman', type: 'string'}
		,{name: 'manager', type: 'string'}
		,{name: 'director', type: 'string'}
		,{name: 'remark', type: 'string'}
		,{name: 'addUser', type: 'string'}
		,{name: 'addTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		,{name: 'state', type: 'string'}
		,{name: 'managerShow', type: 'string'}
		,{name: 'toKefu', type: 'string'}
	];
	var Plant = Ext.data.Record.create(Columns);	
    var PlantInt = {
    	uids:''
    	,name: ''
    	,mobile: ''
    	,qq: ''
    	,province: ''
    	,city: ''
    	,fund: 0
    	,quote: 0
    	,deposit: 0
    	,back: 0
    	,payway: ''
    	,backTime: ''
    	,salesman: ''
    	,manager: ''
    	,director: ''
    	,aaaa: ''
    	,bbbb: ''
    	,remark: ''
    	,addUser: USERID
    	,addTime: SYS_DATE_DATE
    	,state: '0'
    	,managerShow: '0'
    	,toKefu: '0'
    }	
    var formRecord = Ext.data.Record.create(Columns);
    
	var fc={
		 'uids':{name:'uids',fieldLabel:'主键'}
		,'name':{name:'name',fieldLabel:'客户姓名',allowBlank:false}
		,'mobile':{name:'mobile',fieldLabel:'手机',allowBlank:false,maxLength:11,
			enableKeyEvent:true,
			listeners:{
				'blur':function(field){
					var num = field.getValue();
					if(num.toString().length == 11){
						DWREngine.setAsync(false);
					    customerMgm.getMobileFrom(num,function(str){
					    	try{
						    	if(null != num && "" != num){
							    	var temp = str.split("||"); 
							    	formPanel.getForm().findField("province").setValue(temp[0]);
							    	formPanel.getForm().findField("city").setValue(temp[1]);
						    	}
					    	}catch(e){
					    		alert(e)
					    	}
					    });
					    DWREngine.setAsync(true);
					}
				}
			}
		}
		,'qq':{name:'qq',fieldLabel:'QQ'}
		,'province':{name:'province',fieldLabel:'省'}
		,'city':{name:'city',fieldLabel:'市'}
		,'fund':{name:'fund',fieldLabel:'资金(万)',allowBlank:false}
		,'quote':{name:'quote',fieldLabel:'报价',allowBlank:false}
		,'deposit':{name:'deposit',fieldLabel:'定金',allowBlank:false}
		,'back':{name:'back',fieldLabel:'回款'}
		,'payway':{name:'payway',fieldLabel:'付款方式',valueField:'k',displayField:'v',mode:'local',
			typeAhead:true,triggerAction:'all',store:paywayDs,lazyRender:true,editable:false}
		,'addTime':{name:'addTime',fieldLabel:'添加时间',format:'Y-m-d',readOnly:true}
		,'backTime':{name:'backTime',fieldLabel:'回款时间',format:'Y-m-d',readOnly:true}
		,'salesman':{name:'salesman',fieldLabel:'业务员',valueField:'k',displayField:'v',mode:'local',
			typeAhead:true,triggerAction:'all',store:salesmanDs,lazyRender:true,disabled :true,
			listeners:{
				'select' : function(combo){} 
				}
			}
		,'manager':{name:'manager',fieldLabel:'经理',valueField:'k',displayField:'v',mode:'local',
			typeAhead:true,triggerAction:'all',store:managerDs,lazyRender:true,
			listeners:{
				'select' : function(combo){
//						var record = sm.getSelected();
						var manager = combo.getValue();
						DWREngine.setAsync(false);
						//查询该销售经理对应的销售总监
						var sql1 = "select t.userid,t.realname from rock_user t WHERE t.userid = " +
								" (select t.guidetype from rock_user t WHERE t.userid = '"+manager+"')";
			    		baseMgm.getData(sql1,function(list){
			    			if(list != null && list.length > 0){
			    				formPanel.getForm().findField('director').setValue(list[0][0])
			    			}
					    });
					    //查询该销售经理对于的业务员
					    var sql2 = "select t.userid,t.realname from rock_user t WHERE t.guidetype = '"+manager+"'";
			    		baseMgm.getData(sql2,function(list){
			    			if(list != null && list.length > 0){
			    				formPanel.getForm().findField('salesman').enable();
								var tempArr = (eval(list));
								salesmanDs.loadData(tempArr);
			    			}else{
			    				formPanel.getForm().findField('salesman').disable();
			    			}
					    });
						DWREngine.setAsync(true);
					}
				}
			}
		,'director':{name:'director',fieldLabel:'总监',valueField:'k',displayField:'v',mode:'local',
			typeAhead:true,triggerAction:'all',store:allUserArr,lazyRender:true,disabled :true}
		,'addUser':{name:'addUser',fieldLabel:'添加人'}
		,'remark':{name:'remark',fieldLabel:'备注',width:'100%'}
		,'state':{name:'state',fieldLabel:'定金状态'}
		,'managerShow':{name:'managerShow',fieldLabel:'分配经理'}
	};
	
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true})
	var rowNum = new Ext.grid.RowNumberer({header:'',width:25});
	var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,rowNum
    	, {id:'uids',header: fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hideable:false,hidden:true}
    	, {id:'managerShow',header: fc['managerShow'].fieldLabel,dataIndex:fc['managerShow'].name,align:'center',width:80,
    		hideable:hideAllBtn,hidden:!hideAllBtn,
    		renderer:function(value, cell, record, rowInd, colInd, store){
    			var str = "分配";
    			var color = "#00f";
    			if(value == 1){
    				str = "取消";
    				color = "#f00";
    			}else{
    				value = 0
    			}
    			return "<input type='button' value=' "+str+" ' style='color:"+color+";' onclick='managerShow(\""+record.data.uids+"\","+value+")'>";
    		}
    	}
    	, {id:'state',header:fc['state'].fieldLabel,dataIndex:fc['state'].name,align:'center',hideable:!hideAllBtn,hidden:hideAllBtn,
    		renderer:function(value,cell,record){
    			var str = "<input type='button' value=' 回定金 ' onclick='hasDeposit(\""+record.data.uids+"\")'>";
    			if(value == "1"){
	    			str = "定金已回";
    			}
    			return str;
    		}
    	}
    	, {id:'name',header: fc['name'].fieldLabel,dataIndex: fc['name'].name,width:80,
    		align:"center",editor:new Ext.form.TextField(fc['name'])}
    	, {id:'mobile',header: fc['mobile'].fieldLabel,dataIndex: fc['mobile'].name,width:100,
    		align:"center",editor:new Ext.form.TextField(fc['mobile'])}
    	, {id:'qq',header: fc['qq'].fieldLabel,dataIndex: fc['qq'].name,width:100,
    		align:"center",editor:new Ext.form.TextField(fc['qq']),
    		renderer:function(value){
    				if(value.length > 0){
	    				return '<a target="_blank" href="http://wpa.qq.com/msgrd?v=1&uin='+value+'&site=imfav.cn&menu=yes">' +
	    						'<img border="0" src="/frame/jsp/res/images/qq.gif" ' +
								'alt="点击这里给我发消息" title="点击这里给我发消息" height="20"/></a>';
//    					return '<img  style="CURSOR: pointer" onclick="javascript:window.open' +
//    							'(\'http://b.qq.com/webc.htm?new=0&sid='+value+'&o=imfav.cn&q=7\',' +
//    							' \'_blank\', \'height=502, width=644,toolbar=no,scrollbars=no,menubar=no,status=no\');"' +
//    							'  border="0" height="20" SRC=http://wpa.qq.com/pa?p=1:'+value+':51 alt="点击这里给我发消息">';
    				}else{
    					return '';
    				}
    			}
    		}
    	, {id:'province',header: fc['province'].fieldLabel,dataIndex: fc['province'].name,width:80,hideable:!hideAllBtn,hidden:hideAllBtn,
    		align:"center",editor:new Ext.form.TextField(fc['province'])}
    	, {id:'city',header: fc['city'].fieldLabel,dataIndex: fc['city'].name,width:80,hideable:!hideAllBtn,hidden:hideAllBtn,
    		align:"center",editor:new Ext.form.TextField(fc['city'])}
    	, {id:'fund',header: fc['fund'].fieldLabel,dataIndex: fc['fund'].name,width:80,
    		align:'right',editor:new Ext.form.NumberField(fc['fund']),
    		renderer:function(value){return value+"万"}}
    	, {id:'quote',header: fc['quote'].fieldLabel,dataIndex: fc['quote'].name,width:80,
    		align:'right',editor:new Ext.form.NumberField(fc['quote'])}
    	, {id:'deposit',header: fc['deposit'].fieldLabel,dataIndex: fc['deposit'].name,width:80,
    		align:'right',editor:new Ext.form.NumberField(fc['deposit'])}
    	, {id:'back',header: fc['back'].fieldLabel,dataIndex: fc['back'].name,width:80,
    		align:'right'}
    	, {id:'payway',header: fc['payway'].fieldLabel,dataIndex: fc['payway'].name,
			align:"center",editor:new Ext.form.ComboBox(fc['payway']),
    		renderer:function(value){return formatCombo(value,paywayArr)}}
    	, {id:'addTime',header: fc['addTime'].fieldLabel,dataIndex: fc['addTime'].name,hideable:!hideAllBtn,hidden:hideAllBtn,
    		align:"center",renderer : formatDate}
    	, {id:'backTime',header: fc['backTime'].fieldLabel,dataIndex: fc['backTime'].name,
    		align:"center",editor:new Ext.form.DateField(fc['backTime']),
    		renderer:formatDate}
    	, {id:'salesman',header: fc['salesman'].fieldLabel,dataIndex: fc['salesman'].name,
			align:"center",editor:new Ext.form.ComboBox(fc['salesman']),
    		renderer:function(value){return formatCombo(value,salesmanArr)}}
    	, {id:'manager',header: fc['manager'].fieldLabel,dataIndex: fc['manager'].name,align:"center",
    		renderer:function(value){return formatCombo(value,allUserArr)}}
    	, {id:'director',header: fc['director'].fieldLabel,dataIndex: fc['director'].name,align:"center",
    		renderer:function(value){return formatCombo(value,allUserArr)}}
    	, {id:'remark',header: fc['remark'].fieldLabel,dataIndex: fc['remark'].name,width:200,hideable:!hideAllBtn,hidden:hideAllBtn,
    		editor:new Ext.form.TextField(fc['remark'])}
    	, {id:'addUser',header: fc['addUser'].fieldLabel,dataIndex: fc['addUser'].name,hideable:!hideAllBtn,hidden:hideAllBtn,
    		align:"center",renderer:function(value){return formatCombo(value,allUserArr)}}
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
	
	var addBtn = new Ext.Button({
		id:'add',
		text:'发账号',
		iconCls : 'add',
		handler:function(){
			custFormWin.show();
			PlantInt.addUser = USERID;
			var loadFormRecord = new formRecord(PlantInt);
			formPanel.getForm().loadRecord(loadFormRecord);
		}
	})
	var editBtn = new Ext.Button({
		id:'edit',
		text:'修改',
		iconCls : 'btn',
		handler:function(){
			var record = sm.getSelected();
			if(record){
				custFormWin.show();
				var uids = record.data.uids;
				DWREngine.setAsync(false);
			    baseDao.findById(bean, uids,function(obj){
			    	var loadFormRecord = new formRecord(obj);
					formPanel.getForm().loadRecord(loadFormRecord);
			    });
			    DWREngine.setAsync(true);
			    
			}else{
				Ext.example.msg("提示","请先选择一个客户！")
			}
		}
	})
	var delBtn = new Ext.Button({
		id:'del',
		text:'删除',
		iconCls : 'remove',
		handler:function(){
			var record = sm.getSelected();
			if(record){
				Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text) {
					if (btn == "yes") {
						var uids = record.data.uids;
						DWREngine.setAsync(false);
					    customerMgm.deleteCustomer(uids,function(str){
					    	if(str == "0"){
					    		Ext.example.msg("提示","客户信息删除失败！");
					    	}else if(str == "1"){
					    		Ext.example.msg("提示","客户信息删除成功！");
					    		ds.reload();
					    	}else if(str == "2"){
					    		Ext.example.msg("提示","客户有股票交易信息，不能删除！");
					    	}
					    });
					    DWREngine.setAsync(true);
					}
				});
			}else{
				Ext.example.msg("提示","请先选择一个客户！")
			}
		}
	})
	
	var addBackBtn = new Ext.Button({
		id : 'addBack',
		text : "增加回款",
		iconCls : 'add',
		handler : function(){
			var record = sm.getSelected();
			if(record){
				var uids = record.data.uids;
				var payway = record.data.payway;
				addBackWin.showBackWin(uids,true,payway);
				addBackWin.on("hide",function(){
					addBackWin.closeBackWin(ds);
				});
			}else{
				Ext.example.msg("提示","请先选择一个客户！")
			}
		}
	})
	
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
		emptyText:'客户/手机/QQ/省/市/业务员',
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
		value: (hideAllBtn == true ? null : new Date()),
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
	
	var tbarArr  = [addBtn,'-',editBtn,'-',delBtn,'-',addBackBtn];
	if(hideBtn){
		tbarArr  = [addBtn,'-',editBtn,'-',addBackBtn];
	}
	if(hideAllBtn){
		tbarArr = ['总监：',directorCombo,'经理：',managerCombo,'业务员：',salesmanCombo]
	}
	tbarArr.push('->','添加时间：',dateField_begin,'至',dateField_end,'-',keyText,keyBtn)
	
//	gridPanel = new Ext.grid.EditorGridTbarPanel({
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
			ignoreAdd: true,
			getRowClass : function(rec, rowIndex, rowparams, ds) {
				if (hideAllBtn == false && rec.get('state') == '1') {
					return 'grid-record-blue';
				}else{
					return '';
				}
			}
		},
		plant: Plant,				
		plantInt: PlantInt,	
		servletUrl: MAIN_SERVLET,		
		bean: bean,					
		business: business,	
		primaryKey: primaryKey,
		listeners : {
		    "render" : function (){
		        if(directorUserid != null){
		        	directorCombo.setValue(directorUserid)
		        	directorCombo.setDisabled(true);
		        	salesmanCombo.setDisabled(true);
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
	
	//TODO:表单
	var formPanel = new Ext.form.FormPanel({
		header:false,
		border:false,
		split: true,
		bodyStyle:'padding:10px;',
		labelAlign:'left',
        labelWidth: 60,
		items : [{
			//两列
			layout : 'column',
			border : false,
			items : [{
				layout : 'form',
				columnWidth : .5,
				border : false,
				items : [new Ext.form.TextField(fc['name'])
						,new Ext.form.TextField(fc['qq'])
						,new Ext.form.TextField(fc['province'])
						,new Ext.form.TextField(fc['city'])
						,new Ext.form.ComboBox(fc['manager'])
						,new Ext.form.ComboBox(fc['salesman'])
						,new Ext.form.ComboBox(fc['director'])
						]
			}, {
				layout : 'form',
				columnWidth : .5,
				border : false,
				items : [new Ext.form.NumberField(fc['mobile'])
						,new Ext.form.NumberField(fc['fund'])
						,new Ext.form.NumberField(fc['quote'])
						,new Ext.form.NumberField(fc['deposit'])
						,new Ext.form.ComboBox(fc['payway'])
						,new Ext.form.DateField(fc['backTime'])
						,new Ext.form.DateField(fc['addTime'])
						]
			}]
		}, {
			layout : 'column',
			border : false,
			items : [{
				layout : 'form',
				columnWidth : .95,
				border : false,
				items : [new Ext.form.TextArea(fc['remark']),
				new Ext.form.Label({html:'<div style="color:red;float:right;">* 请核对信息无误后再保存！</div>'})]
			}]
		},{
			layout : 'column',
			hidden: true,
            hideLabel:true,
            items : [
            	new Ext.form.TextField(fc['uids'])
            	,new Ext.form.TextField(fc['addUser'])
            	,new Ext.form.TextField(fc['state'])
            	,new Ext.form.NumberField(fc['back'])
            	,new Ext.form.TextField(fc['managerShow'])
            	,new Ext.form.TextField(fc['toKefu'])
            	]
		}]
	})
	var saveFormBtn = new Ext.Button({
		id:'save',
		text:'保存',
		minWidth :80,
		handler:formSave
	})
	function formSave(){
    	var form = formPanel.getForm();
    	if(!form.isValid()){
            Ext.example.msg("提示","请填写完整客户信息后再保存！")
    		return false;
        }
		saveFormBtn.setDisabled(true)
    	var obj = new Object();
    	for (var i=0; i<Columns.length; i++){
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
		Ext.getBody().mask("数据保存中，请稍等！");
   		customerMgm.addOrUpdateCustomer(obj, function(uids){
   			if(uids == null || uids == ""){
   				Ext.example.msg("提示","客户信息保存失败！")
   			}else if(uids == "1"){
   				Ext.example.msg("提示","保存失败，该客户手机号已经存在！")
   			}else{
   				Ext.example.msg("提示","客户信息保存成功！")
   				form.findField('uids').setValue(uids);
   			}
   			Ext.getBody().unmask();
   			saveFormBtn.setDisabled(false);
   		})
	}
	var closeFormBtn = new Ext.Button({
		id:'close',
		text:'关闭',
		minWidth:80,
		handler:function(){
			custFormWin.hide();
			ds.reload();
		}
	})
	
	var custFormWin = new Ext.Window({
//		title:'编辑股票信息',
		width: 500,
		height: 330,
		modal: true, 
		plain: true, 
		border: false,
		header: false,
		resizable: false,
		layout: 'fit',
		buttonAlign:'center',
		closeAction : 'hide',
		items: [formPanel],
		buttons:[saveFormBtn,closeFormBtn]
	});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel]
	});	
	
	dsLoad();
	
	sm.on("rowselect",function(obj,rinx,rec){
	
	});
	
	function dsLoad(){
		//var month = monthCombo.getValue();
		//var paramsStr = " to_char(addTime,'YYYYMM') = '"+month+"' ";
		var paramsStr = " 1=1 ";
		if(hideAllBtn == false){
			var pb = dateField_begin;
			var pe = dateField_end;
			if ('' == pb.getValue() && '' != pe.getValue()){
				paramsStr += ' and addTime <= to_date(\'' + formatDate(pe.getValue()) + '\',\'YYYY-MM-DD\')';
			} else if ('' != pb.getValue() && "" == pe.getValue()){
				paramsStr += ' and addTime >= to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD\')';
			} else if ('' != pb.getValue() && '' != pe.getValue()){
				if (pb.getValue() > pe.getValue()){
					Ext.example.msg('提示！', '开始时间应该小于等于结束时间！');
					return false;
				} else {
						paramsStr += ' and ( addTime ' 
								+ ' between to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD\')' 
								+ ' and to_date(\'' + formatDate(pe.getValue())+ '\',\'YYYY-MM-DD\') )'; 
				}
			}
		}
		
		var key = typeof(keyText) != "undefined" ? keyText.getValue() : "";
		if("" != key && key.length != 0){
			//模糊查询，支持客户姓名，手机，QQ，省，市，业务员
			paramsStr += " and (name like '%"+key+"%' or mobile like '%"+key+"%' or qq like '%"+key+"%' or " +
					" province like '%"+key+"%' or city like '%"+key+"%' or " +
					" salesman in (select userid from RockUser where realname like '%"+key+"%') )";
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
        
        //加入按照中间人（账号专员）过滤的条件
        if(hideBtn == true && hideAllBtn == false){
			paramsStr += " and addUser = '"+USERID+"' ";
		}
		
		if(hideAllBtn == true){
			var sql = "SELECT t.userid FROM rock_user t START WITH " +
					" t.userid = '"+USERID+"' connect by PRIOR t.userid = t.guidetype";
			var uidsStr = "";
			DWREngine.setAsync(false);
			baseDao.getData(sql,function(list){
				for(i = 0; i < list.length; i++) {
					uidsStr += ",'"+list[i]+"'";		
				}
			});	
			DWREngine.setAsync(true);
			uidsStr = uidsStr.substring(1);
			//定金已回的客户，需要用state = 1 and deposit > 0
			ds.baseParams.params = paramsStr + " and salesman in ("+uidsStr+") and state = '1' and deposit > 0 ";
		}else{
			ds.baseParams.params = paramsStr;
		}
		
		ds.load({params:{start:0,limit: PAGE_SIZE}});
		fixedFilterPart = ds.baseParams.params;
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
function hasDeposit(uids){
	if(uids){
		Ext.MessageBox.confirm('确认', '确认此用户的定金已回吗？', function(btn,text) {
			if (btn == "yes") {
				DWREngine.setAsync(false);
			    customerMgm.customerHasDeposit(uids,function(str){
			    	if(str == "0"){
			    		Ext.example.msg("提示","客户定金操作失败！");
			    	}else if(str == "1"){
			    		Ext.example.msg("提示","客户定金操作成功！");
			    		gridPanel.getStore().reload();
			    	}
			    });
			    DWREngine.setAsync(true);
			}
		});
	}else{
		Ext.example.msg("提示","请先选择一个客户！")
	}
}

function managerShow(uids,show){
	var sql = "UPDATE CRM_CUSTOMER T SET T.MANAGER_SHOW = '"+(1-show)+"' " +
				" WHERE T.UIDS = '"+uids+"'";
	baseDao.updateBySQL(sql);
	gridPanel.getStore().reload();
}
