var userArray = new Array();
DWREngine.setAsync(false);
baseMgm.getData("select userid,realname from rock_user ",function(list){
	for(var i = 0;i<list.length;i++){
		var temp = new Array();
		temp.push(list[i][0]);
		temp.push(list[i][1]);
		userArray.push(temp);
	}
})
DWREngine.setAsync(true);	
Ext.onReady(function(){
	var beanGetGoods = "com.sgepit.pmis.equipment.hbm.EquGetGoods";
	var business = "baseMgm";
	var listMethod = "findWhereOrderBy";
	var primaryKey = "ggid";
	var orderColumn = "ggid";
	var propertyName = "conid";
	var propertyValue = conid;
	var macTypes = [[1,'#1'],[2,'#2'],[3,'公共'],[-1,'  ']];
	var ktztTypes = [[0,'未入库'],[1,'处理中'],[2,'已入库'],[3,'暂估入库']];//0未入库，1处理中，2已入库，3暂估入库
	var SPLITB = "`";
	var sm;
	var bodyPanelTitle = "合同：" + conname + "，编号：" + conno + " - 设备入库";
	
	var fm = Ext.form;
	
	var fc = {
		'conid': {
			name: 'conid',
			fieldLabel: '合同内部流水号',
			ancher: '95%',
			readOnly: true,
			hidden: true,
			hideLabel: true
		}, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'ggid': {
			name: 'ggid',
			fieldLabel: '到货主键',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'ggNo': {
			name: 'ggNo',
			fieldLabel: '编号',
			anchor:'95%'
		}, 'ggDate': {
			name: 'ggDate',
			fieldLabel: '到货日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
		}, 'ggNum': {
			name: 'ggNum',
			fieldLabel: '数量',
			allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
		}, 'sgNo': {
			name: 'sgNo',
			fieldLabel: '发货通知单号',
			anchor:'95%'
		}, 'sgDate': {
			name: 'sgDate',
			fieldLabel: '发货日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
			anchor:'95%'
		}, 'sgMan': {
			name: 'sgMan',
			fieldLabel: '发运人',
			anchor:'95%'
		}, 'incasementNo': {
			name: 'incasementNo',
			fieldLabel: '装箱号',
			anchor:'95%'
		}, 'conveyance': {
			name: 'conveyance',
			fieldLabel: '运输工具',
			anchor:'95%'
		}, 'conveyanceNo': {
			name: 'conveyanceNo',
			fieldLabel: '运输工具号',
			anchor:'95%'
		}, 'faceNote': {
			name: 'faceNote',
			fieldLabel: '外观记录',
			anchor:'95%'
		}, 'layPlace': {
			name: 'layPlace',
			fieldLabel: '放置位置',
			anchor:'95%'
		}, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			anchor:'95%'
		},'rkrq':{
			name:'rkrq',
			fieldLabel:'入库日期',
			format: 'Y-m-d',
			readOnly:true,
			anchor:'95%'
		},'conmoney':{
			id:'conmoney',
			name:'conmoney',
			fieldLabel:'合同总金额',
			readOnly:true,
			anchor:'95%'
		},'partb':{
			id:'partb',
			name:'partb',
			fieldLabel:'乙方单位',
			readOnly:true,
			anchor:'95%'
		},'sbmc':{
			name:'sbmc',
			fieldLabel:'设备名称',
			anchor:'95%'
		},'dw':{
			name:'dw',
			fieldLabel:'单位',
			anchor:'95%'
		},'equipfee':{
			id:'equipfee',
			name:'equipfee',
			fieldLabel:'到货设备总金额',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'carryfee':{
			id:'carryfee',
			name:'carryfee',
			fieldLabel:'运保费',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'otherfee':{
			id:'otherfee',
			name:'otherfee',
			fieldLabel:'其它费用',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'toolfee':{
			id:'toolfee',
			name:'toolfee',
			fieldLabel:'专用工具金额 ',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},			
			anchor:'95%'
		},'partfee':{
			id:'partfee',
			name:'partfee',
			fieldLabel:'备品备件金额',
			listeners :{'change':function(field,newValue,oldValue){
				var total = Ext.getCmp('totalfee')
				total.setValue(total.value*1 + newValue*1 - oldValue*1)
			}},
			anchor:'95%'
		},'totalfee':{
			id:'totalfee',
			name:'totalfee',
			fieldLabel:'合计总金额',
			readOnly:true,
			anchor:'95%'
		},
		'bdgid':{id:'bdgid',name:'bdgid',fieldLabel:'概算编号',readOnly:true,anchor:'95%'},
		'bdgname':{id:'bdgname',name:'bdgname',fieldLabel:'概算名称',readOnly:true,anchor:'95%'},
		'openid':{id:'openid',name:'openid',fieldLabel:'开箱单号',readOnly:true,anchor:'95%'},
		'ghfp':{id:'ghfp',name:'ghfp',fieldLabel:'供货发票',readOnly:true,anchor:'95%'},
		'sysbh':{
			name:'sysbh',
			fieldLabel:'所属于安装系统编号',
			anchor:'95%'
		},'sysmc':{
			name:'sysmc',
			fieldLabel:'所属安装系统名称',
			anchor:'95%'
		},'invoicebh':{
			name:'invoicebh',
			fieldLabel:'供货发票号',
			anchor:'95%'
		},'checkbh':{
			name:'checkbh',
			fieldLabel:'验收单号',
			anchor:'95%'
		},'conno':{
			id:'conno',
			name:'conno',
			fieldLabel:'合同号',
			anchor:'95%',
			readOnly:true
		},'rkzt':{
			id:'rkzt',
			name:'rkzt',
			fieldLabel:'入库状态',
			anchor:'95%',
			readOnly:true
		},'sqr':{
			id:'sqr',
			name:'sqr',
			fieldLabel:'申请人',
			anchor:'95%',
			readOnly:true
		},'bdgid':{id:'bdgid',name:'bdgid',fieldLabel:'概算编号',readOnly:true,anchor:'95%'},
		'bdgname':{id:'bdgname',name:'bdgname',fieldLabel:'概算名称',readOnly:true,anchor:'95%'},
		'openid':{id:'openid',name:'openid',fieldLabel:'开箱单号',readOnly:true,anchor:'95%'}
	};
	
	var Columns = [
		{name: 'conid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'ggid', type: 'string'},
		{name: 'ggNo', type: 'string'},
		{name: 'ggDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ggNum', type: 'float'},
		{name: 'sgNo', type: 'string'},
		{name: 'sgDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'sgMan', type: 'string'},
		{name: 'incasementNo', type: 'string'},
		{name: 'conveyance', type: 'string'},
		{name: 'conveyanceNo', type: 'string'},
		{name: 'faceNote', type: 'string'},
		{name: 'layPlace', type: 'string'},
		{name: 'remark', type: 'string'},
		
		{name:'conno',type:'string'},
		{name:'partb',type:'string'},
		{name:'conmoney',type:'float'},
		{name:'sbmc',type:'string'},
		{name:'dw',type:'string'},
		{name:'equipfee',type:'float'},
		{name:'carryfee',type:'float'},
		{name:'otherfee',type:'float'},
		{name:'toolfee',type:'float'},
		{name:'partfee',type:'float'},
		{name:'totalfee',type:'float'},
		{name:'sysbh',type:'string'},
		{name:'sysmc',type:'string'},
		{name:'invoicebh',type:'string'},
		{name:'checkbh',type:'string'},
		{name:'rkzt',type:'string'},
		{name:'sqr',type:'string'},
		{name:'rkrq', type: 'date', dateFormat: 'Y-m-d H:i:s'}		,
		{name:'bdgid',type:'string'},
		{name:'bdgname',type:'string'},
		{name:'openid',type:'string'},
		{name:'ghfp',type:'string'}
		
	];
	
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([
		sm,{
			id: 'conid',
			header: fc['conid'].fieldLabel,
			dataIndex: fc['conid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'pid',
			header: fc['pid'].fieldLabel,
			dataIndex: fc['pid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'ggid',
			header: fc['ggid'].fieldLabel,
			dataIndex: fc['ggid'].name,
			hidden: true,
			width: 100
		},  {
			id: 'ggNo',
			header: fc['ggNo'].fieldLabel,
			dataIndex: fc['ggNo'].name,
			width: 120,
			editor: new fm.DateField(fc['ggDate'])
		}, {
			id: 'rkrq',
			header: fc['rkrq'].fieldLabel,
			dataIndex: fc['rkrq'].name,
			width: 100,
			renderer:formatDate,
			editor: new fm.TextField(fc['rkrq'])
		}, {
			id: 'conno',
			header: fc['conno'].fieldLabel,
			dataIndex: fc['conno'].name,
			width: 80,
			hidden: true,
			renderer:function(){return conno},
			editor: new fm.DateField(fc['conno'])
		}, {
			id: 'conmoney',
			header: fc['conmoney'].fieldLabel,
			dataIndex: fc['conmoney'].name,
			width: 80,
			hidden: true,
			renderer:function(){return parent.conmoney},
			editor: new fm.NumberField(fc['conmoney'])
		}, {
			id: 'partb',
			header: fc['partb'].fieldLabel,
			dataIndex: fc['partb'].name,
			width: 180
		}, {
			id: 'sbmc',
			header: fc['sbmc'].fieldLabel,
			dataIndex: fc['sbmc'].name,
			width: 80,
			hidden: true,
			editor: new fm.DateField(fc['sbmc'])
		}, {
			id: 'dw',
			header: fc['dw'].fieldLabel,
			dataIndex: fc['dw'].name,
			width: 80,
			hidden: true,
			editor: new fm.TextField(fc['dw'])
		}, {
			id: 'ggNum',
			header: fc['ggNum'].fieldLabel,
			dataIndex: fc['ggNum'].name,
			width: 80,
			hidden: true,
			editor: new fm.TextField(fc['ggNum'])
		}, {
			id: 'equipfee',
			header: fc['equipfee'].fieldLabel,
			dataIndex: fc['equipfee'].name,
			width: 100,
			editor: new fm.TextField(fc['equipfee'])
		}, {
			id: 'carryfee',
			header: fc['carryfee'].fieldLabel,
			dataIndex: fc['carryfee'].name,
			width: 80,
			editor: new fm.TextField(fc['carryfee'])
		}, {
			id: 'otherfee',
			header: fc['otherfee'].fieldLabel,
			dataIndex: fc['otherfee'].name,
			width: 80,
			editor: new fm.TextField(fc['otherfee'])
		}, {
			id: 'toolfee',
			header: fc['toolfee'].fieldLabel,
			dataIndex: fc['toolfee'].name,
			width: 80,
			editor: new fm.TextField(fc['toolfee'])
		}, {
			id: 'partfee',
			header: fc['partfee'].fieldLabel,
			dataIndex: fc['partfee'].name,
			width: 80,
			editor: new fm.TextField(fc['partfee'])
		}, {
			id: 'totalfee',
			header: fc['totalfee'].fieldLabel,
			dataIndex: fc['totalfee'].name,
			width: 80,
			editor: new fm.TextField(fc['totalfee'])
		}, 
		
		{id: 'bdgid',header: fc['bdgid'].fieldLabel,dataIndex: fc['bdgid'].name,width: 80}, 	
		{id: 'bdgname',header: fc['bdgname'].fieldLabel,dataIndex: fc['bdgname'].name,width: 80}, 	
		{id: 'openid',header: fc['openid'].fieldLabel,dataIndex: fc['openid'].name,width: 80}, 	
		{id: 'ghfp',header: fc['ghfp'].fieldLabel,dataIndex: fc['ghfp'].name,width: 80}, 	
				
		{
			id: 'sysbh',
			header: fc['sysbh'].fieldLabel,
			dataIndex: fc['sysbh'].name,
			width: 120,hidden:true,
			editor: new fm.TextField(fc['sysbh'])
		}, {
			id: 'sysmc',hidden:true,
			header: fc['sysmc'].fieldLabel,
			dataIndex: fc['sysmc'].name,
			width: 120,
			editor: new fm.TextField(fc['sysmc'])
		}, {
			id: 'invoicebh',
			header: fc['invoicebh'].fieldLabel,
			dataIndex: fc['invoicebh'].name,
			width: 80,
			editor: new fm.TextField(fc['invoicebh'])
		},  {
			id: 'checkbh',
			header: fc['checkbh'].fieldLabel,
			dataIndex: fc['checkbh'].name,
			width: 80,
			editor: new fm.TextField(fc['checkbh'])
		}, {
			id: 'rkzt',
			header: fc['rkzt'].fieldLabel,
			dataIndex: fc['rkzt'].name,
			width: 80,renderer:function(value){
				if(value==0){return "未入库"}
				if(value==1){return "处理中"}
				if(value==2){return "已入库"}
				if(value==3){return "暂估入库"}
			}
		},{
			id: 'sqr',
			header: fc['sqr'].fieldLabel,
			dataIndex: fc['sqr'].name,
			width: 80,renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{
			id: 'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width: 80,
			editor: new fm.TextField(fc['remark'])
		}
	]);
	cm.defaultSortable = true;
	
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanGetGoods,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName + "='" +propertyValue +"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');
    ds.load({
    	params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
    });    
	gridPanel = new Ext.grid.GridPanel({
    	id: 'cat-grid-panel',
        ds: ds,
        cm: cm,
        height:400,
        sm: sm,
        tbar: [''],
        region: 'center',
        title: bodyPanelTitle,
        loadMask: true,
        autoScroll:true,border: false,
		viewConfig:{
			ignoreAdd: true
		}
	});
   	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };	

  selectWin = new Ext.Window({
	title:'从设备入库中选择信息',
	buttonAlign:'center',
	layout:'border',
	width: document.body.clientWidth,
    height: document.body.clientHeight,
    modal: true,
    closeAction: 'hide',
    constrain:true,
    maximizable: true,
    plain: true,
	items:[gridPanel],
	buttons:[{id:'btnSavfe',text:'确定选择' ,handler:confirmChoose},{text:'取消',handler:function(){selectWin.hide()}}]
  });
		
  function confirmChoose(){
  	var selectRows = gridPanel.getSelectionModel().getSelected();
  	if(selectRows.length==0){
  		Ext.example.msg('提示！', '至少选取一条数据！');
  	}else{
  		Ext.getCmp('pid').setValue(selectRows.get('ggid'));
  		Ext.getCmp('equipfee').setValue(selectRows.get('equipfee'));
  		Ext.getCmp('carryfee').setValue(selectRows.get('carryfee'));
  		Ext.getCmp('otherfee').setValue(selectRows.get('otherfee'));
  		Ext.getCmp('toolfee').setValue(selectRows.get('toolfee'));
  		Ext.getCmp('partfee').setValue(selectRows.get('partfee'));
  		Ext.getCmp('totalfee').setValue(selectRows.get('totalfee'));
  		Ext.getCmp('checkbh').setValue(selectRows.get('checkbh'));
  		Ext.getCmp('bdgid').setValue(selectRows.get('bdgid'));
  		Ext.getCmp('bdgname').setValue(selectRows.get('bdgname'));
  		Ext.getCmp('openid').setValue(selectRows.get('openid'));
  		Ext.getCmp('ghfp').setValue(selectRows.get('ghfp'));
  		selectWin.hide()
  	}
  	
  }	
});