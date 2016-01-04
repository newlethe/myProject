var customerGridWin = customerGridWin || {};

(function(){
	var _thisSelectUserid = null;
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
		text : "选择客户",
		iconCls : 'add',
		handler : function(){
			var recordArr = sm.getSelections();
			if(recordArr && recordArr.length > 0){
				var uidsArr = new Array();
				for (var i = 0; i < recordArr.length; i++) {
					var rec = recordArr[i];
					uidsArr.push(rec.data.uids);
				}
				DWREngine.setAsync(false);
				stockMgm.selectCustomerUser(uidsArr,_thisSelectUserid,state,function(num){
					if(num > 0){
						Ext.example.msg("提示","客户分配成功！")
						ds.reload();
					}else{
						Ext.example.msg("提示","客户分配失败！")
					}
				})
				DWREngine.setAsync(true);
			}else{
				Ext.example.msg("提示","请先选择一个客户！")
			}
		}
	});
	var closeBtn = new Ext.Button({
		id:'close',
		text:'关闭窗口',
		iconCls: 'remove',
		handler:function(){
			customerGridWin.hide();
		}
	})
	var tbarArr = [addCustBtn,'-',closeBtn];
	var selectCustGridPanel = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		sm: sm,
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
			forceFit: true,
			ignoreAdd: true
		}
	});
	
	customerGridWin = new Ext.Window({
		width: 600,
		height: 400,
		modal: true, 
		plain: true, 
		border: false,
		title: '分配客户',
		resizable: false,
		layout: 'fit',
		closeAction : 'hide',
		items: [selectCustGridPanel]
		,showCustomerGridWin: showCustomerGridWin
		,closeCustomerGridWin: closeCustomerGridWin
	});
	
	function showCustomerGridWin(userid){
		_thisSelectUserid = userid;
		customerGridWin.show();
		ds.baseParams.params = " 1=1 and uids not in (select t.custUids from CustUser t)";
		if(state == 2){
			//角色为销售总监时，给销售经理分配用户，用户只查询中间人分配给当前销售总监的客户
			ds.baseParams.params = " 1=1 and uids in (select t.custUids from CustUser t where t.userid = '"+USERID+"')" +
					" and uids not in (select t.custUids from CustUser t where t.userid = '"+_thisSelectUserid+"')";
		}
		ds.load({params:{start:0,limit: PAGE_SIZE}});
	}
	
	function closeCustomerGridWin(custDs){
		custDs.reload();
	}
	
})();