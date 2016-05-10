var stockHistoryWin = stockHistoryWin || {};

(function(){

	var bean = "com.imfav.business.stock.hbm.Stock";
	var orderColumn = "dealTime";
	var total_1 = 0;
	var total_2 = 0;
	
	var fc={
		 'uids':{name:'uids',fieldLabel:'主键'}
		,'custUids':{name:'custUids',fieldLabel:'客户'}
		,'stockNo':{name:'stockNo',fieldLabel:'股票代码'}
		,'stockName':{name:'stockName',fieldLabel:'股票名称'}
		,'openPosition':{name:'openPosition',fieldLabel:'买入价/卖出价'}
		,'nowPrice':{name:'nowPrice',fieldLabel:'现价'}
		,'haveNumber':{name:'haveNumber',fieldLabel:'数量'}
		,'profitPoint':{name:'profitPoint',fieldLabel:'盈利点(%)'}
		,'incomeMoney':{name:'incomeMoney',fieldLabel:'收益'}
		,'stockDeal':{name:'stockDeal',fieldLabel:'方向'}
		,'dealTime':{name:'dealTime',fieldLabel:'交易时间',format:'Y-m-d'}
		,'remark':{name:'remark',fieldLabel:'备注'}
	};
	
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true})
	var rowNum = new Ext.grid.RowNumberer({header:'',width:25});
	var cm = new Ext.grid.ColumnModel([
    	sm,
    	rowNum
    	, {id:'uids',header: fc['uids'].fieldLabel,dataIndex: fc['uids'].name,hideable:false,hidden:true}
    	, {id:'custUids',header: fc['custUids'].fieldLabel,dataIndex: fc['custUids'].name,hideable:false,hidden:true}
    	, {id:'stockNo',header: fc['stockNo'].fieldLabel,dataIndex: fc['stockNo'].name,align:"center"}
    	, {id:'stockName',header: fc['stockName'].fieldLabel,dataIndex: fc['stockName'].name,align:"center"}
    	, {id:'stockDeal',header: fc['stockDeal'].fieldLabel,dataIndex: fc['stockDeal'].name,align:"center",
    		renderer:function(value,cell,record){
    			if(value == 'buy'){
    				return "买入";
    			}else if(value == 'sell'){
    				return "卖出";
    			}
    		}
    	}
    	, {id:'openPosition',header: fc['openPosition'].fieldLabel,dataIndex: fc['openPosition'].name,align:'right',
    		width:120,renderer:function(value,cell,record){
    			return value.toFixed(2)
    		}
    	}
    	, {id:'nowPrice',header: fc['nowPrice'].fieldLabel,dataIndex: fc['nowPrice'].name,align:'right',hidden:true,
    		renderer :function(value,cell,record){
    			var open = record.data.openPosition;
    			if(value > open){
    				return "<div style='color:red'>"+value.toFixed(2)+"</div>";
    			}else{
    				return "<div style='color:green'>"+value.toFixed(2)+"</div>";
    			}
    		}
    	}
    	, {id:'haveNumber',header: fc['haveNumber'].fieldLabel,dataIndex: fc['haveNumber'].name,align:'right',
    		renderer:function(value,cell,record){
    			return value.toFixed(2)
    		}
    	}
    	, {id:'profitPoint',header: fc['profitPoint'].fieldLabel,dataIndex: fc['profitPoint'].name,align:'right',
    		renderer:function(value,cell,record,rid,cid,ds){
    			if(record.data.stockDeal == 'buy'){
    				return null
    			}else{
	    			var v = 0;
	    			var stock = record.data.stockNo;
	    			var sell = record.data.openPosition;
	    			var buy = 0;
	    			for (var i = 0; i < ds.getCount(); i++) {
						var res = ds.getAt(i);
						if(stock == res.data.stockNo && res.data.stockDeal == 'buy'){
							buy = res.data.openPosition;
							break;
						}
					}
    				value = (sell - buy) / buy * 100
					var color = (value > 0) ? "red" : "green";
					total_1 += parseFloat(value.toFixed(2));
					return "<div style='color:"+color+"'>"+value.toFixed(2)+"</div>";
    			}
    		}
    	}
    	, {id:'incomeMoney',header: fc['incomeMoney'].fieldLabel,dataIndex: fc['incomeMoney'].name,align:'right',
    		renderer:function(value,cell,record,rid,cid,ds){
    			if(record.data.stockDeal == 'buy'){
    				return null
    			}else{
	    			var v = 0;
	    			var stock = record.data.stockNo;
	    			var sell = record.data.openPosition;
	    			var num = record.data.haveNumber;
	    			var buy = 0;
	    			for (var i = 0; i < ds.getCount(); i++) {
						var res = ds.getAt(i);
						if(stock == res.data.stockNo && res.data.stockDeal == 'buy'){
							buy = res.data.openPosition;
							break;
						}
					}
    				value = (sell - buy) * Math.abs(num);
					var color = (value > 0) ? "red" : "green";
					total_2 += parseFloat(value.toFixed(2));
					return "<div style='color:"+color+"'>"+value.toFixed(2)+"</div>";
    			}
    		}
    	}
    	
    	, {id:'dealTime',header: fc['dealTime'].fieldLabel,dataIndex: fc['dealTime'].name,
    		align:"center",renderer : formatDate}
    	, {id:'remark',header: fc['remark'].fieldLabel,dataIndex: fc['remark'].name}
	]);
	cm.defaultSortable = true;
	
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
		,{name: 'dealTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		,{name: 'remark', type: 'string'}
	];
	
	var ds = new Ext.data.Store({
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
	ds.setDefaultSort(orderColumn, 'asc');
	//cm.defaultSortable = true;
	
	var showAllCheckbox = new Ext.form.Checkbox({
		boxLabel : '查看该用户所有股票',
		id : 'finished',
		name : 'finished',
		fieldLabel : '完结',
		checked : true,
		listeners : {
 			'check' : function(cb, check){
 				if (check){
					ds.baseParams.params = " custUids = '"+_custUids+"' ";
					document.getElementById("custStock").innerHTML = "所有股票";
				} else {
					ds.baseParams.params = " custUids = '"+_custUids+"' and stockNo = '"+_stockNo+"' ";
					document.getElementById("custStock").innerHTML = _stockName+"["+_stockNo+"]";
 				}
//				ds.load({params:{start:0,limit: PAGE_SIZE}});
 				ds.load();
 			}
 		}
	})
	
	var closeBtn = new Ext.Button({
		id:'close',
		text:'关闭窗口',
		iconCls: 'remove',
		handler:function(){
			stockHistoryWin.hide();
		}
	})
	
	var editBtn = new Ext.Button({
		id : 'edit',
		text : '编辑股票',
		iconCls : 'btn',
		handler : function(){
			var record = sm.getSelected();
			if(record){
				var uids = record.data.uids;
				stockFormWin.showStockFormWin(uids,"edit");
				stockFormWin.on('hide',function(){
					ds.reload();
				})
			}else{
				Ext.example.msg("提示","请先选择一个股票！")
			}
		}
	})
	
	var delStockBtn = new Ext.Button({
		id : 'delete',
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
								total_1 = 0;
								total_2 = 0;
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
	
	var tbarText = '<b>客户：<span id="custName"></span>，' +
			'股票：<span id="custStock"></span>，' +
			'总体收益：<span id="custIncome"></span>，' +
			'盈利点(%)：<span id="custProfitPoint"></b>';
	var tbarArr = [tbarText,'->',showAllCheckbox,'-',delStockBtn,'-',closeBtn];
	var gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		sm : sm,
		cm : cm,
		tbar : tbarArr,
		header : false,
		border : false,
		region: 'center',
		stripeRows : true,
		loadMask : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true,
			getRowClass : function(rec, rowIndex, rowparams, ds) {
				if (rec.get('stockDeal') == 'sell') {
					return 'grid-record-yollow';
				}
				return '';
			}
		}/*,
		bbar : new Ext.PagingToolbar({
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})*/
	});
	
	stockHistoryWin = new Ext.Window({
		title:'查看股票交易信息',
		width: 880,
		height: 470,
		modal: true, 
		plain: true, 
		border: false,
		header: false,
		resizable: false,
		layout: 'fit',
		buttonAlign:'center',
		closeAction : 'hide',
		items: [gridPanel]
		,showStockHistoryWin: showStockHistoryWin
		,listeners : {
			hide : function(){
				showAllCheckbox.reset();
				_custUids = null;
				_stockNo = null;
				_stockName = null;
			}
		}
	})
	
	var _custUids = null;
	var _stockNo = null;
	var _stockName = null;
	function showStockHistoryWin(record){
		stockHistoryWin.show();
		var uids = record.data.uids;
		var custUids = uids.split("-")[0];
		var stockNo = uids.split("-")[1];
		var name = record.data.name;
		document.getElementById("custName").innerHTML = name;
		var toKefu = record.data.toKefu;
		if(toKefu == "1" && kefu != true){
			delStockBtn.disable();
		}else{
			delStockBtn.enable();
		}
		if(stockNo != null && stockNo != ""){
			var stockName = record.data.stockName
			document.getElementById("custStock").innerHTML = stockName+"["+stockNo+"]";
			_stockNo = stockNo;
			_stockName = stockName;
		}
		_custUids = custUids;
//		var paramsStr = " custUids = '"+custUids+"' and stockNo = '"+stockNo+"' ";
		//默认勾上“查看该用户所有股票”
		var paramsStr = " custUids = '"+custUids+"' ";
		ds.baseParams.params = paramsStr;
//		ds.load({params:{start:0,limit: PAGE_SIZE}});
		ds.load();
		ds.on('load',function(){
			var income = total_2;
			var inprofitPoint = total_1;
			var custIncome = document.getElementById("custIncome");
			var custProfitPoint = document.getElementById("custProfitPoint");
			/*
			for (var i = 0; i < ds.getTotalCount(); i++) {
	    		var rec = ds.getAt(i);
	    		if(rec.data.stockDeal == 'sell'){
		    		income += parseFloat(rec.data.incomeMoney);
	    			inprofitPoint += parseFloat(rec.data.profitPoint);
	    		}
	    		
			}
			*/
			if(income > 0){
				custIncome.innerHTML = income;
				custIncome.style.color = 'red';
			}else{
				custIncome.innerHTML = income;
				custIncome.style.color = 'green';
			}
			if(inprofitPoint > 0){
				custProfitPoint.innerHTML = inprofitPoint;
				custProfitPoint.style.color = 'red';
			}else{
				custProfitPoint.innerHTML = inprofitPoint;
				custProfitPoint.style.color = 'green';
			}
			
		})
	}
})();
