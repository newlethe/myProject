var bean = "com.imfav.business.customer.hbm.ViewCustStock";
var business = "baseMgm";
var listMethod = "findwhereorderby"; 
var primaryKey = "uids";
var orderColumn = "firstBackTime"
var gridPanel;
var hideBtn = false;
var PAGE_SIZE = 40;


var startYear = "2015";
var startMonth = "01";
var startYearMonth = startYear+""+startMonth
var thisYear = new Date().getFullYear();
var thisMonth = (new Date().getMonth()) + 1;
var thisYearMonth = thisYear+""+thisMonth;

//年月选择框
var array_yearMonth=getYearMonthBySjType(startYearMonth,thisYearMonth);
	
var allUserArr = new Array();
var unitArr = new Array();
var unitUserArr = new Array();
var paywayArr = new Array();
var haveArr = new Array();
haveArr.push(['-1','全部客户']);
var refreshArr = new Array();

DWREngine.setAsync(false);
db2Json.selectSimpleData("select userid,realname from rock_user order by unitid",
	function(dat){
		allUserArr = (eval(dat))
});
db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit order by unitid",
	function(dat){
		unitArr = (eval(dat))
});
 db2Json.selectSimpleData("select userid,realname from rock_user where dept_id = '"+USERDEPTID+"'",
	function(dat){
		unitUserArr = (eval(dat))
});

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

appMgm.getCodeValue('付款方式', function(list) {
	for (var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i].propertyCode);
		temp.push(list[i].propertyName);
		paywayArr.push(temp);
	}
})
appMgm.getCodeValue('客户状态', function(list) {
	for (var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i].propertyCode);
		temp.push(list[i].propertyName);
		haveArr.push(temp);
	}
})
appMgm.getCodeValue('定时刷新', function(list) {
	for (var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i].propertyCode);
		temp.push(list[i].propertyName);
		refreshArr.push(temp);
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
	
	var salesmanDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:[]});
	var managerDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:[]});
	var directorDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:directorArr});
	
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
	
	var userDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:allUserArr});
    var unitDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:unitArr});
    var unitUserDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:unitUserArr});
    var paywayDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:paywayArr});
    var haveDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:haveArr});
    var refreshDs = new Ext.data.SimpleStore({fields: ['k', 'v'],data:refreshArr});
    
	var Columns = [
		{name: 'uids', type: 'string'}
		,{name: 'name', type: 'string'}
		,{name: 'mobile', type: 'string'}
		,{name: 'fund', type: 'float'}
		,{name: 'salesman', type: 'string'}
		,{name: 'manager', type: 'string'}
		,{name: 'director', type: 'string'}
		,{name: 'stockNo', type: 'string'}
		,{name: 'stockName', type: 'string'}
		,{name: 'openPosition', type: 'float'}
		,{name: 'nowPrice', type: 'float'}
		,{name: 'haveNumber', type: 'float'}
		,{name: 'profitPoint', type: 'float'}
		,{name: 'incomeMoney', type: 'float'}
		,{name: 'quote', type: 'float'}
		,{name: 'back', type: 'float'}
		,{name: 'firstBackTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		,{name: 'newDealTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		,{name: 'giveup', type: 'string'}
		,{name: 'remark', type: 'string'}
		,{name: 'addUser', type: 'string'}
		,{name: 'addTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		,{name: 'haveState', type: 'string'}
		,{name: 'toKefu', type: 'string'}
		,{name: 'toKefuUser', type: 'string'}
		,{name: 'toKefuTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	];
	var Plant = Ext.data.Record.create(Columns);	
    var PlantInt = {
    	uids:''
    	,name: ''
    	,mobile: ''
    	,fund: ''
    	,salesman: ''
    	,manager: ''
    	,director: ''
    	,stockNo: ''
    	,stockName: ''
    	,openPosition: 0
    	,nowPrice: 0
    	,haveNumber: 0
    	,profitPoint: 0
    	,incomeMoney: 0
    	,quote: 0
    	,back: 0
    	,firstBackTime: ''
    	,newDealTime: ''
    	,giveup: ''
    	,remark: ''
    	,addUser: USERID
    	,addTime: SYS_DATE_DATE
    	,haveState: ''
    	,toKefu: '0'
    	,toKefuUser: ''
    	,toKefuTime: SYS_DATE_DATE
    }	
    
	var fc={
		 'uids':{name:'uids',fieldLabel:'主键'}
		,'name':{name:'name',fieldLabel:'客户姓名'}
		,'mobile':{name:'mobile',fieldLabel:'手机'}
		,'fund':{name:'fund',fieldLabel:'资金(万)'}
		,'salesman':{name:'salesman',fieldLabel:'业务员',valueField:'k',displayField:'v',mode:'local',
					typeAhead:true,triggerAction:'all',store:userDs,lazyRender:true}
		,'manager':{name:'manager',fieldLabel:'经理'}
		,'director':{name:'director',fieldLabel:'总监'}
		,'stockNo':{name:'stockNo',fieldLabel:'股票代码'}
		,'stockName':{name:'stockName',fieldLabel:'股票名称'}
		,'openPosition':{name:'openPosition',fieldLabel:'建仓成本'}
		,'nowPrice':{name:'nowPrice',fieldLabel:'现价'}
		,'haveNumber':{name:'haveNumber',fieldLabel:'数量'}
		,'profitPoint':{name:'profitPoint',fieldLabel:'盈利点(%)'}
		,'incomeMoney':{name:'incomeMoney',fieldLabel:'收益'}
		,'quote':{name:'quote',fieldLabel:'报价'}
		,'back':{name:'back',fieldLabel:'回款'}
		,'firstBackTime':{name:'firstBackTime',fieldLabel:'回款时间',format:'Y-m-d'}
		,'haveState':{name:'haveState',fieldLabel:'客户状态'}
		,'toKefu':{name:'toKefu',fieldLabel:'移交客服部'}
		,'toKefuTime':{name:'toKefuTime',fieldLabel:'移交时间'}
		,'toKefuUser':{name:'toKefuUser',fieldLabel:'移交人'}
		,'newDealTime':{name:'newDealTime',fieldLabel:'最新交易时间',format:'Y-m-d'}
		,'giveup':{name:'giveup',fieldLabel:'放弃'}
		,'remark':{name:'remark',fieldLabel:'备注'}
		,'addUser':{name:'addUser',fieldLabel:'添加人'}
		,'addTime':{name:'addTime',fieldLabel:'添加时间',format:'Y-m-d'}
	};
	
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true})
	var rowNum = new Ext.grid.RowNumberer({header:'',width:25});
	var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,rowNum
    	, {id:'uids',header: fc['uids'].fieldLabel,dataIndex: fc['uids'].name,hideable:false,hidden:true}
    	, {id:'firstBackTime',header: fc['firstBackTime'].fieldLabel,dataIndex: fc['firstBackTime'].name,width:100,align:"center",
    		renderer:function(value,cell,record){
    			return formatDate(value);	
    		}
    	}
    	, {id:'newDealTime',header: fc['newDealTime'].fieldLabel,dataIndex: fc['newDealTime'].name,width:100,align:"center",
    		renderer:function(value,cell,record){
    			return formatDate(value);	
    		}
    	}
    	, {id:'haveState',header:fc['haveState'].fieldLabel,dataIndex: fc['haveState'].name,width:80,align:"center",
    		renderer:function(value){
    			var color = "red";
    			if(value == "01")color = "red";
    			if(value == "02")color = "green";
    			if(value == "03")color = "blue";
    			return "<div style='color:"+color+";'>"+formatCombo(value,haveArr)+"</div>";
    		}}
    	, {id:'name',header: fc['name'].fieldLabel,dataIndex: fc['name'].name,width:80,align:"center",
    		renderer:function(value,cell,record){
    			var giveup = record.data.giveup;
    			if("1" == giveup){
    				value = "<div style='color:#666;background:#ddd;' title='放弃客户'>"+value+"</div>";
    			}
    			return value;
    		}
    	}
    	, {id:'mobile',header: fc['mobile'].fieldLabel,dataIndex: fc['mobile'].name,width:100,align:"center"}
    	, {id:'fund',header: fc['fund'].fieldLabel,dataIndex: fc['fund'].name,width:100,align:'right',
    		renderer:function(value){return value+"万"}}
    	, {id:'salesman',header: fc['salesman'].fieldLabel,dataIndex: fc['salesman'].name,align:"center",
    		renderer:function(value){return formatCombo(value,allUserArr)}}
    	, {id:'manager',header: fc['manager'].fieldLabel,dataIndex: fc['manager'].name,align:"center",hidden:true,
    		renderer:function(value){return formatCombo(value,allUserArr)}}
    	, {id:'director',header: fc['director'].fieldLabel,dataIndex: fc['director'].name,align:"center",hidden:true,
    		renderer:function(value){return formatCombo(value,allUserArr)}}
    	, {id:'stockNo',header: fc['stockNo'].fieldLabel,dataIndex: fc['stockNo'].name,width:100,align:"center",
			renderer:function(value,cell,record){return formatBackColor(value,cell,record)}
    	}
    	, {id:'stockName',header: fc['stockName'].fieldLabel,dataIndex: fc['stockName'].name,width:100,align:"center",
    		renderer:function(value,cell,record){return formatBackColor(value,cell,record)}
    	}
    	, {id:'openPosition',header: fc['openPosition'].fieldLabel,dataIndex: fc['openPosition'].name,width:100,align:'right',
    		renderer:function(value,cell,record){return formatBackColor(value.toFixed(2),cell,record)}
    	}
    	, {id:'nowPrice',header: fc['nowPrice'].fieldLabel,dataIndex: fc['nowPrice'].name,width:100,align:'right',
    		renderer :function(value,cell,record){
    			//cell.attr = "style='background:#FBF8BF;'";
    			var open = record.data.openPosition;
    			if(value > open){
    				return "<div style='color:red'>"+value.toFixed(2)+"</div>";
    			}else{
    				return "<div style='color:green'>"+value.toFixed(2)+"</div>";
    			}
    		}
    	}
    	, {id:'haveNumber',header: fc['haveNumber'].fieldLabel,dataIndex: fc['haveNumber'].name,width:100,align:'right',
    		renderer:function(value,cell,record){return formatBackColor(value,cell,record)}
    	}
    	, {id:'profitPoint',header: fc['profitPoint'].fieldLabel,dataIndex: fc['profitPoint'].name,width:100,align:'right',
    		renderer:function(value,cell,record){
    			//cell.attr = "style='background:#FBF8BF;'";
    			var openPosition = record.data.openPosition;
    			var nowPrice = record.data.nowPrice;
    			//value = getProfitPoint(openPosition,nowPrice);
				var color = (value > 0) ? "red" : "green";
				var bgColor = "";
				if(value >= 5){
					bgColor = "#FFCDD2";
				}else if(value <= -5){
					bgColor = "#DCEDC8";
				}
				return "<div style='color:"+color+"; background:"+bgColor+";'>"+value.toFixed(2)+"</div>";
    		}
    	}
    	, {id:'incomeMoney',header: fc['incomeMoney'].fieldLabel,dataIndex: fc['incomeMoney'].name,width:100,align:'right',
    		renderer:function(value,cell,record){
    			//cell.attr = "style='background:#FBF8BF;'";
    			var openPosition = record.data.openPosition;
    			var nowPrice = record.data.nowPrice;
    			var haveNumber = record.data.haveNumber;
    			//value = getIncomeMoney(openPosition,nowPrice,haveNumber);
    			if(value == -999999)value = 0;
				var color = (value > 0) ? "red" : "green";
    			var profitPoint = getProfitPoint(openPosition,nowPrice);
				var bgColor = "";
				if(profitPoint >= 5){
					bgColor = "#FFCDD2";
				}else if(profitPoint <= -5){
					bgColor = "#DCEDC8";
				}
				return "<div style='color:"+color+"; background:"+bgColor+";'>"+value.toFixed(2)+"</div>";
    		}
    	}
    	, {id:'quote',header: fc['quote'].fieldLabel,dataIndex: fc['quote'].name,width:80,align:'right'}
    	, {id:'back',header: fc['back'].fieldLabel,dataIndex: fc['back'].name,width:80,align:'right'}
    	, {id:'giveup',header: fc['giveup'].fieldLabel,dataIndex: fc['giveup'].name,width:80,align:'center',
    		renderer:function(value,cell,record){
				var str = "";
				if("1" == value){
					str = "放弃客户";
				}
    			return str;
    		}
    	}
    	, {id:'remark',header: fc['remark'].fieldLabel,dataIndex: fc['remark'].name,width:200,
    		renderer:function(value,cell,record){
    			var title = "";  
			    var tip = value;   
			    cell.attr = 'ext:qtitle="' + title + '"' + ' ext:qtip="' + tip + '"';    
			    return value;   
    		}
    	}
    	, {id:'addUser',header: fc['addUser'].fieldLabel,dataIndex: fc['addUser'].name,hideable:false,hidden:true,
    		align:"center",renderer:function(value){return formatCombo(value,allUserArr)}}
    	, {id:'addTime',header: fc['addTime'].fieldLabel,dataIndex: fc['addTime'].name,hideable:false,hidden:true,
    		align:"center",renderer : formatDate}
    	, {id:'toKefuUser',header: fc['toKefuUser'].fieldLabel,dataIndex: fc['toKefuUser'].name,hideable:false,hidden:true,
    		align:"center",renderer:function(value){return formatCombo(value,allUserArr)}}
    	, {id:'toKefuTime',header: fc['toKefuTime'].fieldLabel,dataIndex: fc['toKefuTime'].name,hideable:false,hidden:true,
    		align:"center",renderer : formatDate}
    	, {id:'toKefu',header: fc['toKefu'].fieldLabel, dataIndex: 'toKefu', align:'center',//hideable:!kefu,hidden:!kefu,
    		renderer:function(value,cell,record){
    			var haveState = record.data.haveState;
    			var uids = record.data.uids;
				var custUids = uids.split("-")[0];
    			var str = "";
    			if('02' == haveState || '03' == haveState){
    				if("1" == value){
    					str = "已移交客服部";
    				}else{
		    			str = "<input type='button' value=' 移交客服部 ' onclick='moveToFun(\""+custUids+"\")'>";
    				}
    			}
    			return str;
    		}}
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
	ds.setDefaultSort('firstBackTime', 'desc');
	
	var buyStockBtn = new Ext.Button({
		id : 'buy',
		text : '买入',
		iconCls : 'add',
		handler : showStockFormWin
	})
	var sellStockBtn = new Ext.Button({
		id : 'sell',
		text : '卖出',
		iconCls : 'resend',
		handler : showStockFormWin
	})
	var editStockBtn = new Ext.Button({
		id : 'edit',
		text : '编辑',
		iconCls : 'btn',
		handler : showStockFormWin
	})
	function showStockFormWin(){
		var record = sm.getSelected();
		if(record){
			var uids = record.data.uids;
			stockFormWin.showStockFormWin(uids,this.id);
			stockFormWin.on('hide',function(){
				ds.reload();
			})
		}else{
			Ext.example.msg("提示","请先选择一个客户！")
		}
	}
	function giveupCustomer(){
		var record = sm.getSelected();
		if(record){
			var uids = record.data.uids;
			var giveup = record.data.giveup;
			giveup = giveup == '1' ? '0' : '1';
			var custUids = uids.split("-")[0];
			var sql = "UPDATE CRM_CUSTOMER T SET T.GIVEUP = '"+giveup+"' WHERE T.UIDS = '" + custUids + "'";
			baseDao.updateBySQL(sql,function(){
				Ext.example.msg("提示","放弃客户操作成功！")
				ds.reload();
			});
		}else{
			Ext.example.msg("提示","请先选择一个客户！")
		}
	}
	var historyBtn = new Ext.Button({
		id : 'history',
		text : '交易记录',
		iconCls : 'book_open',
		handler : showHistoryWin
	})
	
	
	function showHistoryWin(){
		var record = sm.getSelected();
		if(record){
			//var stockNo = record.data.stockNo
			//if(stockNo){
				stockHistoryWin.showStockHistoryWin(record);
				stockHistoryWin.on('hide',function(){
					ds.reload();
				})
			//}else{
			//	Ext.example.msg("提示","暂无历史记录！")
			//}
		}else{
			Ext.example.msg("提示","请先选择一个客户！")
		}
	}
	
	function showBackWin(){
		var record = sm.getSelected();
		if(record){
			var uids = record.data.uids;
			var custUids = uids.split("-")[0];
			addBackWin.showBackWin(custUids,false);
			addBackWin.on("hide",function(){
				addBackWin.closeBackWin(ds);
			});
		}else{
			Ext.example.msg("提示","请先选择一个客户！")
		}
	}
	
	function showBacklogWin(){
		var record = sm.getSelected();
		if(record){
			var uids = record.data.uids;
			var custUids = uids.split("-")[0];
			backlogWin.showBacklogWin(custUids,false);
			backlogWin.on('hide',function(){
				ds.reload();
			})
		}else{
			Ext.example.msg("提示","请先选择一个客户！")
		}
	
	}
	
	var refreshBtn = new Ext.Button({
		id : 'refresh',
		text : '刷新价格',
		iconCls : 'refresh',
		handler : refreshPriceFun
	})
	function refreshPriceFun(){
		DWREngine.setAsync(false);
		Ext.getBody().mask("数据刷新中，请稍等！");
//		var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"报表数据执行中，请稍后！"});
//		myMask.show();
//		myMask.hide();
		stockMgm.refreshStockPrice(function(num){
			if(num == null || num == "" || num == "0"){
				Ext.example.msg("提示","股票信息刷新失败！")
			}else{
				Ext.example.msg("提示","股票信息刷新成功！")
				ds.reload();
			}
			Ext.getBody().unmask();
		})
		DWREngine.setAsync(true);
	}
	
	var excelBtn = new Ext.Button({
		id : 'export',
		text : '导出数据',
//		hidden : true,
		tooltip : '导出数据到Excel',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			exportDataFile();
		}
	})
	
	//导出数据
	function exportDataFile(){
		var where = ds.baseParams.params;
		var header = "";
		var num = cm.getColumnCount();
		for (var i = 0; i < num; i++) {
			if(i == 0 || i == 1) continue;
			var obj = cm.getColumnById(cm.getColumnId(i));
			if(obj.hidden)continue;
			header += "~"+obj.dataIndex+"="+obj.header;
		}
		header = header.substring(1);
		//return false;
		console.log(header)
        var openUrl = CONTEXT_PATH
                + "/servlet/CustomerServlet?ac=exportDataByHssf&where="+where+"&header="+encodeURIComponent(header)+"";
        document.all.formAc.action = openUrl
        document.all.formAc.submit();						
	}
	
	var delStockBtn = new Ext.Button({
		id : 'delStockBtn',
		text : '删除股票',
		iconCls : 'remove',
		handler : function(){
			var record = sm.getSelected();
			if(record){
				Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn, text) {
					if (btn == "yes") {
						var record = sm.getSelected();
						var uids = record.data.uids;
						uids = uids.substring(uids.indexOf("-")+1,uids.length);
						DWREngine.setAsync(false);
						stockMgm.deleteStock(uids,function(num){
							if(num > 0){
								Ext.example.msg("提示","您成功删除了1条股票信息。");
								ds.reload();
				   			}else{
				   				Ext.example.msg("提示","股票信息删除失败！")
				   			}
						})
						DWREngine.setAsync(true);
					}
				})
			}else{
				Ext.example.msg("提示","请先选择一个客户！")
			}
		}
	})
	
	var haveStateCombo = new Ext.form.ComboBox({
		width:80,
		store :haveDs,
		value:'-1',
    	displayField:'v',
		valueField:'k',
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		allowBlank: false,
		selectOnFocus:true,
		listeners:{
   			'select':function(){
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
		emptyText:'客户/手机/代码/名称/业务员',
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
//		value: new Date(),
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
	
	var refreshTime = null;
	var refreshTimeCombo = new Ext.form.ComboBox({
		width:80,
		store: refreshDs,
		value:'0',
    	displayField:'v',
		valueField:'k',
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		allowBlank: false,
		selectOnFocus:true,
		listeners:{
   			'select':function(){
   				if(refreshTime != null){
   					window.clearInterval(refreshTime);
   				}else{
   					refreshPriceFun();
   				}
   				var time = refreshTimeCombo.getValue();
   				if(time != 0){
					refreshTime = window.setInterval(refreshPriceFun, time*1000); 
   				}
   			}
   		}
	});
	
	var giveupCombo = new Ext.form.ComboBox({
		width:80,
		store : new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data : [['-1', '全部客户'],['0','活跃客户'], ['1', '放弃客户']]
		}),
		value:'0',
    	displayField:'v',
		valueField:'k',
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		allowBlank: false,
		selectOnFocus:true,
		listeners:{
   			'select':function(){
				dsLoad();
   			}
   		}
	});
	
	var tbarArr  = [buyStockBtn,'-',sellStockBtn,'-',editStockBtn,'-',historyBtn,'-',excelBtn,'-',
			refreshBtn,'-','定时刷新：',refreshTimeCombo, '-','放弃客户：',giveupCombo];
	
	var addToolbar = new Ext.Toolbar({
		items : ['总监：',directorCombo,'经理：',managerCombo,'业务员：',salesmanCombo,'-',
		'客户状态：',haveStateCombo,'-','时间：',dateField_begin,'至',dateField_end,'-',keyText,keyBtn]
    })
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds: ds,
		cm: cm,
		sm: sm,
		addBtn: false,
		saveBtn: false,
		delBtn: false,
		tbar: tbarArr,
		header: false,
		region: 'center',
		autoScroll: true,
		collapsible: false,
		animCollapse: false,
		loadMask: true,
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
				if(kefu == true){
					var y = new Date().getFullYear();
					var m = (new Date().getMonth()) + 1;
					var d = new Date().getDate();
					var today = y+"-"+(m<10?"0"+m:m)+"-"+(d<10?"0"+d:d);
					var time = formatDate(rec.get("toKefuTime"));
					//移交时间为当天，背景显示红
					if(time == today){
						return 'grid-record-red'
					}
				}else if (rec.get('haveState') == '02' || rec.get('haveState') == '03') {
					//已移交，显示蓝，未移交，显示黄
					if(rec.get('toKefu') == "1"){
						return 'grid-record-blue';
					}else{
						return 'grid-record-yollow';
					}
				}
				return '';
			}
		},
		plant: Plant,				
		plantInt: PlantInt,	
		servletUrl: MAIN_SERVLET,		
		bean: bean,					
		business: business,	
		primaryKey: primaryKey,
		listeners:{
			"celldblclick" : function(grid, row, col, e){
				//alert(row+">>>"+col)
			},
		    "render" : function (){
		        addToolbar.render(this.tbar);
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
	
	
	var gridMenu = new Ext.menu.Menu({
        id: 'gridMenu',
        items: [{
					id : 'buy',
					text : '买入',
					iconCls : 'add',
					handler : showStockFormWin
				},{
					id : 'sell',
					text : '卖出',
					iconCls : 'resend',
					handler : showStockFormWin
				},{
					id : 'edit',
					text : '编辑',
					iconCls : 'btn',
					handler : showStockFormWin
				},{
					id : 'giveup',
					text : '放弃客户',
					iconCls : 'resend',
					handler : giveupCustomer
				},'-',{
					id : 'history',
					text : '历史交易',
					iconCls : 'book_open',
					handler : showHistoryWin
				},{
					id : 'back_list',
					text : '回款记录',
					iconCls : 'book_open',
					handler : showBackWin
				},{
					id : 'back_log',
					text : '回访日志',
					iconCls : 'book_open',
					handler : showBacklogWin
				},'-',{
					id : 'refresh',
					text : '刷新价格',
					iconCls : 'refresh',
					handler : refreshPriceFun
				}]
    });
	gridPanel.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(grid, rowIndex, e){
		e.stopEvent();
		grid.getSelectionModel().selectRow(rowIndex);
	    coords = e.getXY();
	    gridMenu.showAt([coords[0], coords[1]]);
	}
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel]
	});	
	
	dsLoad();
	
	sm.on("rowselect",function(obj,rinx,rec){
		var haveNumber = rec.data.haveNumber;
		if(haveNumber == 0){
			editStockBtn.disable();
			sellStockBtn.disable();
			Ext.getCmp('edit').disable();
			Ext.getCmp('sell').disable();
		}else{
//			if(kefu == false){
//				var toKefu = rec.data.toKefu;
//				if(toKefu == '1'){
//					buyStockBtn.disable();
//					editStockBtn.disable();
//					sellStockBtn.disable();
//					Ext.getCmp('buy').disable();
//					Ext.getCmp('edit').disable();
//					Ext.getCmp('sell').disable();
//				}else{
//					buyStockBtn.enable();
//					editStockBtn.enable();
//					sellStockBtn.enable();
//					Ext.getCmp('buy').enable();
//					Ext.getCmp('edit').enable();
//					Ext.getCmp('sell').enable();
//				}
//			}else{
				editStockBtn.enable();
				sellStockBtn.enable();
				Ext.getCmp('edit').enable();
				Ext.getCmp('sell').enable();
//			}
		}
	});
	
	function dsLoad(){
//		var month = monthCombo.getValue();
//		var paramsStr = " to_char(addTime,'YYYYMM') = '"+month+"' ";
		
		var paramsStr = " 1=1 ";
		//客户定金状态，定金已回的才能显示
		paramsStr += " and state = '1' ";
		
		//时间范围过滤
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
		
		var haveState = haveStateCombo.getValue();
		//工具栏客户状态下拉框过滤
		if(haveState != "-1"){
			paramsStr += " and haveState = '"+haveState+"' ";
		}
		
		var key = typeof(keyText) != "undefined" ? keyText.getValue() : "";
		if("" != key && key.length != 0){
			//模糊查询，支持客户姓名，手机，QQ，省，市，业务员
			paramsStr += " and (name like '%"+key+"%' or mobile like '%"+key+"%' or " +
					" stockNo like '%"+key+"%' or stockName like '%"+key+"%' or " +
					" salesman in (select userid from RockUser where realname like '%"+key+"%') )";
		}
		
		if(kefu == true){
			paramsStr += " and toKefu = '1' ";
		}else{
			if(directorUserid != null){
				paramsStr += " and director = '"+directorUserid+"' ";
	        }
	        if(managerUserid != null){
				paramsStr += " and manager = '"+managerUserid+"' ";
	        }
	        if(salesmanUserid != null){
				paramsStr += " and salesman = '"+salesmanUserid+"' ";
	        }
		}
        
        if(directorCombo.getValue().length > 0){
			paramsStr += " and director = '"+directorCombo.getValue()+"' ";
        }
        if(managerCombo.getValue().length > 0){
//			paramsStr += " and manager = '"+managerCombo.getValue()+"' and managerShow = '1' ";
			paramsStr += " and manager = '"+managerCombo.getValue()+"' ";
        }
        if(salesmanCombo.getValue().length > 0){
			paramsStr += " and salesman = '"+salesmanCombo.getValue()+"' ";
        }
        
        if(giveupCombo.getValue() >= 0){
			paramsStr += " and giveup = '"+giveupCombo.getValue()+"' ";
        }
		
		if(USERNAME == "system"){
			ds.baseParams.params = paramsStr;
		}else{
			if(kefu == true){
				paramsStr += " and toKefu = '1' ";
			}else{
				//如果当前用户角色是销售经理，则需要按照managerShow字段为1进行过滤
				if(USERPOSNAME.indexOf("销售经理") != -1){
//					paramsStr += " and managerShow = '1' and manager = '"+USERID+"'";
					paramsStr += " and manager = '"+USERID+"'";
				}else{
					//如果不是经理，则为总监，则看到的是没有被分配的客户
					if(managerCombo.getValue().length > 0){
						paramsStr += " and director = '"+USERID+"'";
					}else{
//						paramsStr += " and managerShow != '1' and director = '"+USERID+"'";
						paramsStr += " and director = '"+USERID+"'";
					}					
				}
			}
			
			/*
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
			ds.baseParams.params = paramsStr + " and salesman in ("+uidsStr+")";
			*/
			ds.baseParams.params = paramsStr;
//			ds.baseParams.params = paramsStr + " and substr(uids,0,32) in (select c.custUids from CustUser c where c.userid = '"+USERID+"')";
			
		}
		ds.load({params:{start:0,limit: PAGE_SIZE}});
//		ds.load();
		fixedFilterPart = ds.baseParams.params;
	}
	
});

function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
};
function formatCombo(value,array) {
	for (var i = 0; i < array.length; i++) {
		if(value == array[i][0]){
			return array[i][1];
		}
	}
};
function isInArr(value,array) {
	for (var i = 0; i < array.length; i++) {
		if(value == array[i][0]){
			return true;
		}
	}
	return false;
}
function formatBackColor(value,cell,record){
	//cell.attr = "style='background:#FBF8BF;'";
	return value;
}
/**
 * 点击“满仓”或“空仓”按钮后，弹出编辑窗口
 * @param {} uids
 */
function clickShowStockFormWin(uids){
	stockFormWin.showStockFormWin(uids,'buy');
	stockFormWin.on('hide',function(){
		gridPanel.getStore().reload();
	})
}
/**
 * 计算盈利点，盈利点=(现价-成本价)/成本价*100
 * @param {} openPosition
 * @param {} nowPrice
 * @return {}
 */
function getProfitPoint(openPosition,nowPrice){
	var value = 0;
	if(openPosition != 0){
		value = (nowPrice - openPosition) / openPosition * 100;
	}
	return value;
}
/**
 * 计算收益，收益=(现价-成本价)*数量
 * @param {} nowPrice
 * @param {} openPosition
 * @param {} haveNumber
 * @return {}
 */
function getIncomeMoney(openPosition,nowPrice,haveNumber){
	var value = 0;
	value = (nowPrice - openPosition) * haveNumber;
	return value;
}

function moveToFun(uids) {
	var rtn = confirm("是否确认分配给客服经理？")
	if (rtn == true) {
		var sql = "UPDATE CRM_CUSTOMER T SET T.TO_KEFU = '1',T.TO_KEFU_USER = '"+USERID+"',T.TO_KEFU_TIME = SYSDATE WHERE T.UIDS = '" + uids + "'";
		baseDao.updateBySQL(sql);
		gridPanel.getStore().reload();
	}
}

