var solarYYCombo,solarMMCombo,solarDDCombo;//阳历年月日选择框
var searchform;
var CommonRecord = Ext.data.Record.create([{name:'v',mapping:'v'}]);
Ext.onReady(function(){
	var solarYYCombo = new Ext.form.ComboBox({
		xtype:'combo',
		valueField: 'v', 
		displayField: 'v',
		value:(new Date).getYear(),
		width:60,
		mode:'local',
		triggerAction: 'all', 
		editable: false,
		store: new Ext.data.SimpleStore({fields: ['v']}),
		listeners:{
			beforerender:function(combo){
				var yyStore = combo.store;
				for(var i=1940;i<=2020;i++){
					yyStore.add(new CommonRecord({v:i}))
				}
			},
			select:function(){changeDate(true);}
		}
	});
	var solarMMCombo = new Ext.form.ComboBox({
		xtype:'combo',
		valueField: 'v', 
		displayField: 'v',
		value:((new Date).getMonth()+101+"").substring(1),
		width:40,
		mode:'local',
		triggerAction: 'all', 
		editable: false,
		store: new Ext.data.SimpleStore({fields: ['v']}),
		listeners:{
			beforerender:function(combo){
				var mmStore = combo.store;
				for(var i=101;i<=112;i++){
					mmStore.add(new CommonRecord({v:i.toString().substring(1)}))
				}
			},
			select:function(){changeDate(true);}
		}
	});
	var solarDDCombo = new Ext.form.ComboBox({
		valueField: 'v', 
		displayField: 'v',
		value:((new Date).getDate()+100+"").substring(1),
		width:40,
		mode:'local',
		triggerAction: 'all', 
		editable: false,
		store: new Ext.data.SimpleStore({fields: ['v']}),
		listeners:{
			beforerender:function(combo){
				var daysStore = combo.store;
				var days = solarDays((new Date()).getYear(),(new Date()).getMonth())+100;
				for(var i=101;i<=days;i++){
					daysStore.add(new CommonRecord({v:i.toString().substring(1)}))
				}
			},
			select:function(){changeDate(true);}
		}
	});
	
	
	var remindPanel = new Ext.Panel({
		layout:'border',
		tbar:new Ext.Toolbar({
			height:25,
			items:[{
				xtype:"tbbutton",
				text:"<b><font color=blue>人事工作提醒</font></b>",
				iconCls: 'title',
				onMouseOver:Ext.emptyFn
			},'->','阳历：',solarYYCombo,'&nbsp;年&nbsp;',solarMMCombo,'&nbsp;月&nbsp;',solarDDCombo,
			'日&nbsp;&nbsp;&nbsp;&nbsp;阴历：',new Ext.Toolbar.Item("lunarCal"),{
				text:'最大化',iconCls:'add',
				handler:function(){
					if(this.text=='最大化'){
						if(top&&top.collapsedWestAndNorth){
							top.collapsedWestAndNorth();
							this.setText('还原');
							this.setIconClass("remove")
						}
					}else{
						if(top&&top.expandWestAndNorth){
							top.expandWestAndNorth();
							this.setText('最大化');
							this.setIconClass("add")
						}
					}
				}
			}]
		}),
		items:[{
			xtype:'persongrid',
			id:'pgrid',
			region:'center',
			checkbox:new Ext.form.Checkbox({
				id:"cbox",
				listeners:{
					check : function(){reloadData(false)}
				}
			})
		},{
			xtype:'sortinfogrid',
			region:'west',
			id:'sortgrid',
			width:200,
			listeners:{
				rowclick : function( grid,rowIndex,e){
					var sortRecord=grid.getSelectionModel().getSelected();
					if(sortRecord) reloadData(false);
				} 
			}
		}]
	});
	function changeDate(loadsort){
		var yy = solarYYCombo.getValue();
		var mm = solarMMCombo.getValue();
		var dd = solarDDCombo.getValue();
		var daysStore = solarDDCombo.store;
		var days = solarDays(parseInt(yy,10),(parseInt(mm,10)-1))+100;
		daysStore.removeAll();
		for(var i=101;i<=days;i++)	daysStore.add(new CommonRecord({v:i.toString().substring(1)}))
		if(mm=="02"&&(parseInt(dd,10)+100>days))  solarDDCombo.setValue(days.toString().substring(1));
		
		var lunar = new Lunar(new Date(yy,(parseInt(mm,10)-1),parseInt(solarDDCombo.getValue(),10)));
		lunarCal.value = lunar.year+"年"+lunar.month+"月"+lunar.day+"日";
		
	    reloadData(loadsort);
	};
	function reloadData(loadsort){
		var pgrid = Ext.getCmp('pgrid');
		var sortgrid = Ext.getCmp('sortgrid');
		var cbox = Ext.getCmp("cbox");
		if(pgrid&&sortgrid&&cbox){
			var pStore = pgrid.getStore();
			var sortRecord=sortgrid.getSelectionModel().getSelected()
			
			var y = parseInt(solarYYCombo.getValue(),10);
			var m = parseInt(solarMMCombo.getValue(),10)-1;
			var d = parseInt(solarDDCombo.getValue(),10);
			
			if(sortRecord){
				var lunarObj      = new Lunar(new Date(y,m,d));
				var lunar1stObj   = new Lunar(new Date(y,m,1));
				var lunarFinalObj = new Lunar(new Date(y,m,solarDays(y,m)));
				
				var solar      = solarYYCombo.getValue()+""+solarMMCombo.getValue()+""+solarDDCombo.getValue();
				var lunar      = lunarObj.year+""+(lunarObj.month+100+"").substring(1)+""+(lunarObj.day+100+"").substring(1);
				var lunar1st   = lunar1stObj.year+""+(lunar1stObj.month+100+"").substring(1)+""+(lunar1stObj.day+100+"").substring(1);
				var lunarFinal = lunarFinalObj.year+""+(lunarFinalObj.month+100+"").substring(1)+""+(lunarFinalObj.day+100+"").substring(1);
				//alert("solar:"+solar+";lunar"+lunar+";lunar1st:"+lunar1st+";lunarFinal:"+lunarFinal);
				var sortid =  sortRecord.get("sortid");
				rlzyMgm.getRemindWherestr(sortid,solar,lunar,lunar1st,lunarFinal,function(wherestr){
					pStore.baseParams.params = wherestr+(cbox.getValue()?" AND onthejob='1'":"");
					fixedFilterPart = wherestr+(cbox.getValue()?" AND onthejob='1'":"");
					pStore.load({
						params: {start: 0,limit: PAGE_SIZE},
						callback:function(){if(loadsort) sortgrid.loadData(y,m,d);}
					});
				});
			}else{
				pStore.baseParams.params = (cbox.getValue()?"onthejob='1'":"1=1");
				fixedFilterPart = (cbox.getValue()?"onthejob='1'":"1=1");
				pStore.load({
					params: {start: 0,limit: PAGE_SIZE},
					callback:function(){if(loadsort) sortgrid.loadData(y,m,d);}
				});
			}
		}
	};
	var viewport = new Ext.Viewport({
        layout:'fit',
        items:[ remindPanel],
        listeners:{	afterlayout:function(){changeDate(true)}}
    });	
});
	var exportExcelBtn = new Ext.Button({
		id: 'export',
		text: '导出数据',
		hidden:true,
		tooltip: '导出数据到Excel',
		cls: 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler: exportDataFile
	});

	function exportDataFile(){			
		var exportQueryStr = fixedFilterPart  + " and " + queStr
		var openUrl = CONTEXT_PATH + "/servlet/RlzyServlet?ac=exportData&businessType=userRemind&params=" + encodeURI(exportQueryStr);
		document.all.formAc.action = openUrl
		document.all.formAc.submit();
	}
//人员具体信息列表
var PersonGrid = Ext.extend(Ext.grid.QueryExcelGridPanel ,{
	border: false,
	header: false, stripeRows: true,
	autoScroll: true,
	loadMask: true,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	},
	sm:new Ext.grid.RowSelectionModel({singleSelect:true}),
	cm:new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			width: 20
		}),{
			id:'realname',
			header:"姓名",
			sortable:true,
			resizable:true,
			dataIndex:"realname",
			type:'string',
			width:100
		},{
			id:'usernum',
			header:"编号",
			sortable:true,
			resizable:true,
			dataIndex:"usernum",
			type:'string',
			width:100
		},{
			id:'posname',
			header:"部门",
			sortable:true,
			resizable:true,
			dataIndex:"posname",
			type:'string',
			width:100
		},{
			id:'postname',
			header:"职务",
			sortable:true,
			resizable:true,
			dataIndex:"postname",
			type:'string',
			width:100
		},{
			id:'onthejob',
			header:"在职状态",
			sortable:true,
			resizable:true,
			dataIndex:"onthejob",
			type:'combo',
			store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '离职'],['1', '在职']]
			}),
			width:100,
			renderer:function(v){if(v==1){return '在职'}else{ return '离职'}}
		},{
			id:'birthday',
			header:"出生年月(阴历)",
			sortable:true,
			resizable:true,
			dataIndex:"birthday",
			width:100,
			type:'date',
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		},{
			id:'signeddate',
			header:"本次签合同日期",
			sortable:true,
			resizable:true,
			dataIndex:"signeddate",
			width:100,
			type:'date',
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		},{
			id:'enddate',
			header:"合同到期日期",
			sortable:true,
			resizable:true,
			dataIndex:"enddate",
			width:100,
			type:'date',
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		},{
			id:'leftdate',
			header:"离职日期",
			sortable:true,
			resizable:true,
			dataIndex:"leftdate",
			width:100,
			type:'date',
			renderer : Ext.util.Format.dateRenderer('Y-m-d')
		}
	]),
	ds : new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: "com.sgepit.pmis.rlzj.hbm.VHrManInfo",
			business: "baseMgm",
			method: "findWhereOrderBy",
			params: "1=1"
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: "userid"
		}, [{name: 'userid', type: 'string'},
			{name: 'realname', type: 'string'},
			{name: 'usernum', type: 'string'},
			{name: 'orgid', type: 'string'},
			{name: 'orgname', type: 'string'},
			{name: 'postcode', type: 'string'},
			{name: 'postname', type: 'string'},
			{name: 'onthejob', type: 'string'},
			{name: 'birthday', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'entrydate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'signeddate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'enddate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'leftdate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name:'posname' ,type:'string'}
		]),
		remoteSort: false
	}),
	initComponent: function(){
		var _self = this;
		this.ds.load({params:{start:0,limit:PAGE_SIZE}});
		//this.cm.defaultSortable = true;
		//this.ds.setDefaultSort('ftime', 'asc');
		if(this.checkbox==null){
			this.checkbox = new Ext.form.Checkbox();
		};
		this.tbar = [this.checkbox,'&nbsp;&nbsp;过滤离职人员',
			'-',
			exportExcelBtn,
			'-'
//			{
//				text:'&nbsp;',
//				onMouseOver:Ext.emptyFn,
//				handler:Ext.emptyFn
//			}
		];
		this.bbar = new Ext.PagingToolbar({
	        pageSize: PAGE_SIZE,
	        store: _self.ds,
	        displayInfo: true,
	        displayMsg: ' {0} - {1} / {2}',
	        emptyMsg: "无记录。"
	    });
		PersonGrid.superclass.initComponent.call(this);
	}
})
Ext.reg("persongrid",PersonGrid);
//信息类别
var SortInfoGrid=Ext.extend(Ext.grid.GridPanel ,{
	region:"west",
	width:200,
	header: false, stripeRows: true,
	autoScroll: true,
	loadMask: true,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	},
	sm:new Ext.grid.RowSelectionModel({singleSelect:true}),
	cm:new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			width: 20
		}),{
			header:"ID",
			sortable:false,
			resizable:false,
			dataIndex:"sortid",
			hidden:true
		},{
			header:"项目",
			sortable:false,
			resizable:false,
			dataIndex:"sortname",
			width:140
		},{
			header:"数量",
			sortable:false,
			resizable:false,
			align:'center',
			dataIndex:"num",
			width:80
		}
	]),
	ds: new Ext.data.SimpleStore({
   		fields: [
            {name: 'sortid', type: 'string'},
            {name: 'sortname', type: 'string'},
            {name: 'num', type: 'int'}
        ]
   	}),
	initComponent: function(){
		SortInfoGrid.superclass.initComponent.call(this);
	},
	loadData:function(y,m,d){
		if(y&&m&&d){
			DWREngine.setAsync(false);
			var ds = this.ds;
			var lunarObj      = new Lunar(new Date(y,m,d));
			var lunar1stObj   = new Lunar(new Date(y,m,1));
			var lunarFinalObj = new Lunar(new Date(y,m,solarDays(y,m)));
			
			var solar      = y+""+(m+101+"").substring(1)+""+(d+100+"").substring(1);
			var lunar      = lunarObj.year+""+(lunarObj.month+100+"").substring(1)+""+(lunarObj.day+100+"").substring(1);
			var lunar1st   = lunar1stObj.year+""+(lunar1stObj.month+100+"").substring(1)+""+(lunar1stObj.day+100+"").substring(1);
			var lunarFinal = lunarFinalObj.year+""+(lunarFinalObj.month+100+"").substring(1)+""+(lunarFinalObj.day+100+"").substring(1);
			//alert("y:"+y+";m:"+m+";d:"+d);
			//alert("solar:"+solar+";\rlunar:"+lunar+";\rlunar1st:"+lunar1st+";\rlunarFinal:"+lunarFinal);
			rlzyMgm.getRemindData(solar,lunar,lunar1st,lunarFinal,
				function(json){
					try{
						ds.loadData(eval(json));
					}catch(e){}
			});
			DWREngine.setAsync(true);
		}
	}
});
Ext.reg("sortinfogrid",SortInfoGrid);
//由阳历年月判断该月的天数（注意：月份是从0到11）
function solarDays(y,m) {
	var solarMonth=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    if(m==1)
    	return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28)
	else
    	return(solarMonth[m])
}
