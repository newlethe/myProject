var stockFormWin = stockFormWin || {}; 

(function(){
	var _edit = false;
	var bean = "com.imfav.business.stock.hbm.Stock";
	var fc={
		 'uids':{name:'uids',fieldLabel:'主键'}
		,'custUids':{name:'custUids',fieldLabel:'客户'}
		,'stockNo':{name:'stockNo',fieldLabel:'股票代码'
			,triggerClass: 'x-form-search-trigger'
			,emptyText:'输入股票代码按回车查询'
			,enableKeyEvents: true
			,onTriggerClick : queryByKey
			,listeners : {
				specialKey : function(field, e) {
					if(e.getKey()==e.ENTER){
						queryByKey();
					}
				}
			}
		}
		,'stockName':{name:'stockName',fieldLabel:'股票名称',readOnly:true}
		,'openPosition':{id:'openPosition',name:'openPosition',fieldLabel:'建仓成本'
			,enableKeyEvents : true
			,listeners : {
				keyup : formKeyUpFun
			}
		}
		,'nowPrice':{name:'nowPrice',fieldLabel:'现价'
			,enableKeyEvents : true
			,listeners : {
				keyup : formKeyUpFun
			}
		}
		,'haveNumber':{name:'haveNumber',fieldLabel:'数量'
			,enableKeyEvents : true
			,listeners : {
				keyup : formKeyUpFun
			}
		}
		,'profitPoint':{name:'profitPoint',fieldLabel:'盈利点(%)'}
		,'incomeMoney':{name:'incomeMoney',fieldLabel:'收益'}
		,'stockDeal':{name:'stockDeal',fieldLabel:'交易操作'}
		,'dealTime':{name:'dealTime',fieldLabel:'交易时间',format:'Y-m-d'}
		,'remark':{name:'remark',fieldLabel:'备注',width:'100%'}
	};
	
	function formKeyUpFun(){
		var form = formPanel.getForm();
		var openPosition = form.findField("openPosition").getValue();
		var nowPrice = form.findField("nowPrice").getValue();
		var haveNumber = form.findField("haveNumber").getValue();
		var profitPoint = getProfitPoint(openPosition,nowPrice);
		var incomeMoney = getIncomeMoney(openPosition,nowPrice,haveNumber);
		form.findField("profitPoint").setValue(profitPoint.toFixed(2));
		form.findField("incomeMoney").setValue(incomeMoney.toFixed(2));
	}
	
	var Columns = [
		{name: 'uids', type: 'string'}
		,{name: 'custUids', type: 'string'}
		,{name: 'stockNo', type: 'string'}
		,{name: 'stockName', type: 'string'}
		,{name: 'openPosition', type: 'float'}
		,{name: 'nowPrice', type: 'float'}
		,{name: 'haveNumber', type: 'float'}
		,{name: 'profitPoint', type: 'float'}
		,{name: 'incomeMoney', type: 'float'}
		,{name: 'stockDeal', type: 'string'}
		,{name: 'dealTime', type: 'date',dateFormat: 'Y-m-d H:i:s'}
		,{name: 'remark', type: 'string'}
	];
	
	var PlantInt = {
    	uids:''
    	,custUids: ''
    	,stockNo: ''
    	,stockName: ''
    	,openPosition: 0
    	,nowPrice: 0
    	,haveNumber: 0
    	,profitPoint: 0
    	,incomeMoney: 0
    	,stockDeal: ''
    	,dealTime: new Date()
    	,remark: ''
	};
	var formRecord = Ext.data.Record.create(Columns);
//	var loadFormRecord = new formRecord(PlantInt);
	
	var saveBtn = new Ext.Button({
		id:'save',
		text:'保存',
		minWidth :80,
		handler:formSave
	})
	
	var resetBtn = new Ext.Button({
		id : 'reset',
		text : '重置',
		minWidth : 80,
		handler : resetForm
	})
	
	var closeBtn = new Ext.Button({
		id:'close',
		text:'关闭',
		minWidth:80,
		handler:function(){
			resetForm();
			stockFormWin.hide();
		}
	})
	
	var stockNoQuery = new Ext.form.TextField({
		id : 'stockNo',
		emptyText:'请输入股票代码',
		width:100,
		enableKeyEvents: true,
		listeners : {
			specialKey : function(field, e) {
				if(e.getKey()==e.ENTER){
					queryByKey();
				}
			}
		}
	});
	var stockBtn = new Ext.Button({
		id : 'queryStockNo',
		text : "查询",
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/cx.png',
		handler : queryByKey
	});
	
	function queryByKey(){
		if(_edit)return false;
		var stockNo = formPanel.getForm().findField("stockNo").getValue();
		if(null == stockNo || "" == stockNo || "null" == stockNo){
			Ext.example.msg("提示","查询结果有误，请检查股票代码后重新查询！")
			return false;
		}
		if(stockNo.indexOf("sh") == 0 || stockNo.indexOf("sz") == 0){
		
		}else{
			if(stockNo.indexOf("600") == 0 || stockNo.indexOf("601") == 0 || stockNo.indexOf("603") == 0){
				stockNo = 'sh'+stockNo;
			}else{
				stockNo = 'sz'+stockNo;
			}
		}
		Ext.getBody().mask("数据查询中，请稍等！");
		stockMgm.getStockFromSina(stockNo,function(obj){
			if(obj == null || obj == "" || obj == "null"){
				Ext.example.msg("提示","查询结果有误，请检查股票代码后重新查询！")
			}else{
				var loadFormRecord = new formRecord(obj);
				formPanel.getForm().loadRecord(loadFormRecord);
			}
			Ext.getBody().unmask();
		})
	}
	
	var formPanel = new Ext.form.FormPanel({
		header:false,
		border:false,
		split: true,
		bodyStyle:'padding:10px;',
		labelAlign:'left',
        labelWidth: 60,
		items : [{
			layout : 'column',
			border : false,
			items : [{
				layout : 'form',
				columnWidth : .5,
				border : false,
				items : [new Ext.form.TriggerField(fc['stockNo'])
						,new Ext.form.TextField(fc['stockName'])
						,new Ext.form.NumberField(fc['openPosition'])
						,new Ext.form.NumberField(fc['nowPrice'])
						]
			}, {
				layout : 'form',
				columnWidth : .5,
				border : false,
				items : [new Ext.form.NumberField(fc['haveNumber'])
						,new Ext.form.NumberField(fc['profitPoint'])
						,new Ext.form.NumberField(fc['incomeMoney'])
						,new Ext.form.DateField(fc['dealTime'])
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
            	,new Ext.form.TextField(fc['custUids'])
            	,new Ext.form.TextField(fc['stockDeal'])
            	]
		}]
	});
	
	
	function formSave(){
    	var form = formPanel.getForm();
    	var stockNo = form.findField("stockNo").getValue();
    	var deal = form.findField('stockDeal').getValue();
    	if(stockNo == null || stockNo == ""){
    		Ext.example.msg("提示","请填写股票信息后再保存！")
    		return false;
    	}
		saveBtn.setDisabled(true)
    	var obj = new Object();
    	for (var i=0; i<Columns.length; i++){
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
//    		if (field){
//    			if(name == 'haveNumber' && deal == 'sell'){
//	    			obj[name] = 0 - field.getValue();
//    			}else{
//	    			obj[name] = field.getValue();
//    			}
//    		}
    	}
		Ext.getBody().mask("数据保存中，请稍等！");
   		stockMgm.addOrUpdateStock(obj, function(uids){
   			if(uids == null || uids == ""){
   				Ext.example.msg("提示","股票信息保存失败！")
   			}else{
   				Ext.example.msg("提示","股票信息保存成功！")
   				form.findField('uids').setValue(uids);
   			}
   			Ext.getBody().unmask();
   			saveBtn.setDisabled(false);
   		})
	}
	
	
	stockFormWin = new Ext.Window({
		title:'编辑股票信息',
		width: 500,
		height: 270,
		modal: true, 
		plain: true, 
		border: false,
		header: false,
		resizable: false,
		layout: 'fit',
		buttonAlign:'center',
		closeAction : 'hide',
		items: [formPanel],
		buttons:[saveBtn,closeBtn]
		,showStockFormWin: showStockFormWin
//		,showBuyStockForm: showBuyStockForm
//		,showSellStockForm: showSellStockForm
	});
	
	function showStockFormWin(uids,deal){
		stockFormWin.show();
		var form = formPanel.getForm();
		var custUids = uids.split("-")[0];
		var stockNo = uids.split("-")[1];
		_edit = false;
		var tempPlantInt = {
	    	uids:''
	    	,custUids: ''
	    	,stockNo: ''
	    	,stockName: ''
	    	,openPosition: 0
	    	,nowPrice: 0
	    	,haveNumber: 0
	    	,profitPoint: 0
	    	,incomeMoney: 0
	    	,stockDeal: ''
	    	,dealTime: ''
	    	,remark: ''
		};
		if(deal == "buy"){
			var txtLabel = Ext.getCmp('openPosition').getEl().parent().parent().first(); 
			txtLabel.dom.innerHTML="建仓成本"; 
			form.findField("stockNo").enable();
			form.findField("haveNumber").enable();
			tempPlantInt.custUids = custUids;
			tempPlantInt.stockDeal = deal;
			tempPlantInt.dealTime = new Date();
			var loadFormRecord = new formRecord(tempPlantInt);
			formPanel.getForm().loadRecord(loadFormRecord);
		}else if(deal == "sell"){
			var txtLabel = Ext.getCmp('openPosition').getEl().parent().parent().first(); 
			txtLabel.dom.innerHTML="卖出价格"; 
			_edit = true;
			form.findField("stockNo").disable();
			form.findField("haveNumber").disable();
			tempPlantInt.custUids = custUids;
			tempPlantInt.stockNo = stockNo;
			tempPlantInt.stockDeal = deal;
			tempPlantInt.dealTime = new Date();
			DWREngine.setAsync(false);
			var where = "custUids = '"+custUids+"' and stockNo = '"+stockNo+"' ";
		    baseDao.findByWhere2(bean, where,function(list){
		    	if(list.length > 0){
		    		var obj = list[0];
		    		tempPlantInt.haveNumber = 0 - parseInt(obj.haveNumber,10);
		    		tempPlantInt.stockName = obj.stockName;
		    		tempPlantInt.nowPrice = obj.nowPrice;
		    	}
		    });
		    DWREngine.setAsync(true);
		    var loadFormRecord = new formRecord(tempPlantInt);
			formPanel.getForm().loadRecord(loadFormRecord);
		}else if(deal == "edit"){
			var txtLabel = Ext.getCmp('openPosition').getEl().parent().parent().first(); 
			txtLabel.dom.innerHTML="建仓成本"; 
			_edit = true;
		    form.findField("stockNo").disable();
		    form.findField("haveNumber").enable();
			DWREngine.setAsync(false);
			var where = "custUids = '"+custUids+"' and stockNo = '"+stockNo+"' ";
		    baseDao.findByWhere2(bean, where,function(list){
		    	if(list.length > 0){
		    		var obj = list[0];
		    		var loadFormRecord = new formRecord(obj);
					formPanel.getForm().loadRecord(loadFormRecord);
		    	}
		    });
		    DWREngine.setAsync(true);
		}
	}
	
//	function showBuyStockForm(uids){
//		stockFormWin.show();
//		console.log("buy>>>"+uids);
//		var custUids = uids.split("-")[0];
//		var stockNo = uids.split("-")[1];
//		PlantInt.custUids = custUids;
//		PlantInt.stockDeal = "buy";
//		var loadFormRecord = new formRecord(PlantInt);
//		formPanel.getForm().loadRecord(loadFormRecord);
//	}
//	function showSellStockForm(uids){
//		console.log("sell>>"+uids);
//		stockFormWin.show();
//		var custUids = uids.split("-")[0];
//		var stockNo = uids.split("-")[1];
//		PlantInt.custUids = custUids;
//		PlantInt.stockDeal = "sell";
//	}
	
	function closeStockFormWin(custDs){
		stockFormWin.hide();
		resetForm();
		custDs.reload();
	}
	
	function resetForm() {
		var form = formPanel.getForm();
		for (var i=0; i<Columns.length; i++){
    		var name = Columns[i].name;
    		if(name == 'uids' || name == 'custUids' || name == 'stockDeal')
    			continue;
    		form.findField(name).reset();
    	}
	}
	
})();