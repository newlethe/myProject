var bean = "com.sgepit.pmis.investmentComp.hbm.ProAcmInfo";
var primaryKey = "acmId";
var orderColumn = "bdgid";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var title = "<font color=#15428b><b>工程量投资完成明细</b></font>" 	
var rootText = "所有概算项"
var filterStr = "";
var gsFilterStr = "";
var treePanelNew;
Ext.onReady(function (){

	var exportExcelBtn = new Ext.Button({
		id: 'export',
		text: '导出数据',
		tooltip: '导出数据到Excel',
		cls: 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler: function() {
			exportDataFile();
		}
	});
	
	//---------------------------------------------------------------------------------------------------------------------------
	rootNew = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        id : '0'     
    })
  
	treeLoaderNew = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"ProAcmTree", 
			businessName:"bdgMgm", 
			conid:conid, 
			monId: masterId,
			parent:0
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanelNew = new Ext.tree.ColumnTree({
        id: 'budget-tree-panel',
        iconCls: 'icon-by-category',
        region: 'west',
        width: 200,
        split: true,
        //collapsible : false,
        //collapsed: false,
        //collapseMode : 'mini',
        //trackMouseOver:true,
        minSize: 260,
        maxSize: 480,
        frame: false,
        header: false,
        tbar:[
			'<font color=#15428b><b>&nbsp;概算树</b></font>','-',
			{
                iconCls: 'icon-expand-all',
				tooltip: '展开概算树',
                handler: function(){ rootNew.expand(true); }
            }, '-', {
                iconCls: 'icon-collapse-all',
                tooltip: '收起概算树',
                handler: function(){ rootNew.collapse(true); }
            },'->'
		],
        border: false,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '概算名称',
            width: 460,	
            dataIndex: 'bdgname'
        },{
            header: '概算主键',	
            width: 0,				
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
        },{
            header: '本月总额',
            width: 0,
            dataIndex: 'proMoney',
//            renderer: function(value){
//            	return "<div id='proMoney' align='right'>￥"+value+"</div>";
//            }
			renderer: cnMoneyToPrecFun
        },{
            header: '累计总额',
            width: 0,
            dataIndex: 'sumMoney',
//            renderer: function(value){
//            	return "<div id='sumMoney' align='right'>￥"+value+"</div>";
//            }
			renderer: cnMoneyToPrecFun
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        }], 
        loader: treeLoaderNew,
        root: rootNew,
        rootVisible: false
	});
	treePanelNew.on("click",function(node){
		gsFilterStr = " and bdgid like '" +　node.id + "%'";
		ds.load({params:{start: 0,limit: PAGE_SIZE}});
	})
	treePanelNew.on('beforeload', function(node) {
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanelNew.loader.baseParams
		baseParams.conid = conid;
		baseParams.monId = masterId;
		baseParams.parent = bdgid;	
	});

	//---------------------------------------------------------------------------------------------------------------------------
	var fm = Ext.form; 
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: false})
	
    var fc = {		
    	'acmId': {
			name: 'acmId',
			fieldLabel: '工程投资完成主键',
			anchor:'95%'
        },'pid': {
			name: 'pid',
			fieldLabel: '项目编号',
			anchor:'95%'
        },'monId': {
			name: 'monId',
			fieldLabel: '月份主键',
			anchor:'95%'
        }, 'proid': {
			name: 'proid',
			fieldLabel: '分摊的工程量主键',
			anchor:'95%'
		},'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			anchor:'95%'
        },'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			anchor:'95%'
        },'proname': {
			name: 'proname',
			fieldLabel: '工程量名称',
			anchor:'95%'
        },'unit': {
			name: 'unit',
			fieldLabel: '单位',
			anchor:'95%'
        },'price': {
			name: 'price',
			fieldLabel: '单价',
			anchor:'95%'
        },'amount': {
			name: 'amount',
			fieldLabel: '总工程量',
			anchor:'95%'
        },'money': {
			name: 'money',
			fieldLabel: '总金额',
			anchor:'95%'
        }, 'totalpro': {
			name: 'totalpro',
			fieldLabel: '截止上月累计工程量',
			anchor:'95%'
		}, 'totallastmonthamount': {
			name: 'totallastmonthamount',
			fieldLabel: '截止上月累计总金额',
			anchor:'95%'
		}, 'totalthispro': {
			name: 'totalthispro',
			fieldLabel: '截止本月累计工程量',
			anchor:'95%'
		}, 'totalthismonthamount': {
			name: 'totalthismonthamount',
			fieldLabel: '截止本月累计总金额',
			anchor:'95%'
		}, 'totalpercent': {
			name: 'totalpercent',
			fieldLabel: '累计完成百分比%',
			anchor:'95%'
        }, 'declpro': {
			name: 'declpro',
			fieldLabel: '申报工程量',
			listeners:{
			'focus' :function(thisEditField){
				var rec = sm.getSelected();
		    	var declpro = rec.get('isper')== '1' ? (rec.get('declpro')*100).toFixed(2) + "%" : rec.get('declpro');
		    	thisEditField.setValue(declpro);
			}
			},
			anchor:'95%'
        }, 'checkpro': {
			name: 'checkpro',
			fieldLabel: '核定工程量',
			listeners:{
			'focus' :function(thisEditField){
				var rec = sm.getSelected();
		    	var checkpro = rec.get('isper')=='1' ? (rec.get('checkpro')*100).toFixed(2) + "%" : rec.get('checkpro');
		    	thisEditField.setValue(checkpro);
			}
			},
			anchor:'95%'
		}, 'ratiftpro': {
			name: 'ratiftpro',
			fieldLabel: '批准工程量',
			listeners:{
			'focus' :function(thisEditField){
				var rec = sm.getSelected();
		    	var ratiftpro = rec.get('isper')=='1' ? (rec.get('ratiftpro')*100).toFixed(2) + "%" : rec.get('ratiftpro');
		    	thisEditField.setValue(ratiftpro);
			}
			},
			anchor:'95%'
		}, 'decmoney': {
			name: 'decmoney',
			fieldLabel: '申报金额',
			anchor:'95%'
		}, 'checkmoney': {
			name: 'checkmoney',
			fieldLabel: '核定金额',
			anchor:'95%'
		}, 'ratiftmoney': {
			name: 'ratiftmoney',
			fieldLabel: '批准金额',
			anchor:'95%'
		}, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			anchor:'95%'
		}, 'isper': {
			name : 'isper',
			fieldLabel : '总工程量是否带百分号'
		}
	}

    var Columns = [
    	{name: 'acmId', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'monId', type: 'string'},
		{name: 'proid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'proname', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'amount', type: 'float'},
		{name: 'money', type: 'float'},
		{name: 'totalpro', type: 'string'},
		{name: 'totalpercent', type: 'float'},
		{name: 'declpro', type: 'float'},
		{name: 'checkpro', type: 'float'},
		{name: 'ratiftpro', type: 'float'},
		{name: 'decmoney', type: 'float'},
		{name: 'checkmoney', type: 'float'},
		{name: 'ratiftmoney', type: 'float'},
		{name: 'remark', type: 'string'},
		{name: 'isper', type: 'string'}
	];
			
    var Plant = Ext.data.Record.create(Columns);	
    var PlantInt = {
    	acmId: null, 
    	pid: CURRENTAPPID,
    	monId:'',
    	proid: '',
    	conid: '',
    	proname: '',
    	bdgid: '',
    	unit: '',
    	price: null,
    	amount: null,
    	money: null,
    	totalpro: '',
    	totalpercent: '',
    	declpro: null,
    	checkpro: null,
    	ratiftpro: null,
    	decmoney: null,
    	checkmoney: null,
    	ratiftmoney: null,
    	remark: ''
    } 

    var cm = new Ext.grid.ColumnModel([
    	sm,
    	new Ext.grid.RowNumberer(),
    	{
           id:'acmId',
           header: fc['acmId'].fieldLabel,
           dataIndex: fc['acmId'].name,
		   hidden:true
        }, {
           id:'pid',
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           hidden:true
        }, {
           id:'monId',
           header: fc['monId'].fieldLabel,
           dataIndex: fc['monId'].name,
           hidden:true
        }, {
           id:'proid',
           header: fc['proid'].fieldLabel,
           dataIndex: fc['proid'].name,
           hidden:true
        }, {
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden:true
        }, {
           id:'bdgid',
           header: fc['bdgid'].fieldLabel,
           dataIndex: fc['bdgid'].name,
           hidden:true
        }, {
           id:'proname',
           header: fc['proname'].fieldLabel,
           dataIndex: fc['proname'].name,
           align : 'left',
           width: 170,
           renderer: function (val) {
           	 var qtip = "qtip=" + val;
           	 return '<span ' + qtip + '>' + val + '</span>';
           }
        }, {
           id:'price',
           header: fc['price'].fieldLabel,
           dataIndex: fc['price'].name,
           renderer: cnMoney,
           align: 'right',
           width: 80
           //,
           //editor : new Ext.form.NumberField(fc['price'])
        },{
           id:'unit',
           header: fc['unit'].fieldLabel,
           dataIndex: fc['unit'].name,
           align : 'center',
           width: 50
        },{
           id:'amount',
           header: fc['amount'].fieldLabel,
           dataIndex: fc['amount'].name,
           align: 'right',
           width: 80,
           renderer : function(v,m,r){
				return r.get('isper') == '1' ? (v*100).toFixed(2) + "%" : v;
           }
        }, {
           id:'money',
           header: fc['money'].fieldLabel,
           dataIndex: fc['money'].name,
           renderer: cnMoneyToPrecFun,
           align: 'right',
           width: 80
        }, {
           id:'totalpro',
           header: fc['totalpro'].fieldLabel,
           dataIndex: fc['totalpro'].name,
           width: 135,
           align: 'right',
          // hidden: true,
       	   renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
           	var conid = record.data.conid;
           	var proid = record.data.proid;
           	var re=0;
		 	DWREngine.setAsync(false);
	 		//截止上月累计工程量
		 	var sql = "select nvl(sum(ratiftpro),0) sumv from pro_acm_info where conid='" + conid + "' and proid='"
						+ proid + "' and mon_id in(select uids from pro_acm_month t where conid='"
						+ conid + "' and t.month<" + sjType + ")";
		 	//Ext.log(sql);
           	baseMgm.getData(sql,function(list){
				re=list[0];
		    });
		 	DWREngine.setAsync(true);
		 	var isper=record.data.isper;
		 	if(isper=='1'){
		 		re=(re*100).toFixed(2)+"%";
		 	}
           	return re;
           }
        }, {
           id:'totallastmonthamount',
           header: fc['totallastmonthamount'].fieldLabel,
           dataIndex: fc['totallastmonthamount'].name,
           width: 135,
           align: 'right',
           hidden: true,
       	   renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
           	var conid = record.data.conid;
           	var proid = record.data.proid;
           	var price = record.data.price;
           	var re=0;
		 	DWREngine.setAsync(false);
	 		//截止上月累计工程量
		 	var sql = "select nvl(sum(ratiftpro),0) sumv from pro_acm_info where conid='" + conid + "' and proid='"
						+ proid + "' and mon_id in(select uids from pro_acm_month t where conid='"
						+ conid + "' and t.month<" + sjType + ")";
		 	//Ext.log(sql);
           	baseMgm.getData(sql,function(list){
				re=list[0];
		    });
		 	DWREngine.setAsync(true);
		 	re=re*price;
           	return cnMoneyToPrec(re,2);
           }
        }, {
           id:'totalthispro',
           header: fc['totalthispro'].fieldLabel,
           dataIndex: fc['totalthispro'].name,
           width: 135,
           align: 'right',
           hidden: true,
       	   renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
           	var conid = record.data.conid;
           	var proid = record.data.proid;
           	var re=0;
		 	DWREngine.setAsync(false);
	 		//截止本月累计工程量
		 	var sql = "select nvl(sum(ratiftpro),0) sumv from pro_acm_info where conid='" + conid + "' and proid='"
						+ proid + "' and mon_id in(select uids from pro_acm_month t where conid='"
						+ conid + "' and t.month<=" + sjType + ")";
		 	//Ext.log(sql);
           	baseMgm.getData(sql,function(list){
				re=list[0];
		    });
		 	DWREngine.setAsync(true);
		 	var isper=record.data.isper;
		 	if(isper=='1'){
		 		re=(re*100).toFixed(2)+"%";
		 	}
           	return re;
           }
        }, {
           id:'totalthismonthamount',
           header: fc['totalthismonthamount'].fieldLabel,
           dataIndex: fc['totalthismonthamount'].name,
           width: 135,
           align: 'right',
           hidden: true,
       	   renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
           	var conid = record.data.conid;
           	var proid = record.data.proid;
           	var price = record.data.price;
           	var re=0;
		 	DWREngine.setAsync(false);
	 		//截止本月累计工程量
		 	var sql = "select nvl(sum(ratiftpro),0) sumv from pro_acm_info where conid='" + conid + "' and proid='"
						+ proid + "' and mon_id in(select uids from pro_acm_month t where conid='"
						+ conid + "' and t.month<=" + sjType + ")";
		 	//Ext.log(sql);
           	baseMgm.getData(sql,function(list){
				re=list[0];
		    });
		 	DWREngine.setAsync(true);
		 	re=re*price;
           	return cnMoneyToPrec(re,2);
           }
        }, {
           id:'totalpercent',
           header: fc['totalpercent'].fieldLabel,
           dataIndex: fc['totalpercent'].name,
           align: 'right',
//           hidden: true
			renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
	           	var conid = record.data.conid;
	           	var proid = record.data.proid;
	           	var amount = record.data.amount;
	           	var re=0;
			 	DWREngine.setAsync(false);
	           	baseMgm.getData("select sum(ratiftpro)sumv from pro_acm_info where conid='"+conid+"' and proid='"+proid+"'and mon_id in(select uids from pro_acm_month t where conid='"
						+ conid + "' and t.month<=" + sjType + ")",function(list){  
					re=list[0]
			    });
			 	DWREngine.setAsync(true);
	           	return (amount==0 ? 0 : (re/amount * 100).toFixed(2)) + "";
			},
           width: 120
        }, {
           id:'declpro',
           header: fc['declpro'].fieldLabel,
           dataIndex: fc['declpro'].name,
           width: 80,
           align: 'right',
           editor: new fm.TextField(fc['declpro']),
           renderer: function(v, m,r) {
		       	if(step_flow!="yz"&&step_flow!="jl"){
           			m.css='x-grid-back-editable';  
				}
                return r.get('isper')=='1' ? (v*100).toFixed(2) + "%" : v; 
           }
        }, {
           id:'checkpro',
           header: fc['checkpro'].fieldLabel,
           dataIndex: fc['checkpro'].name,
           width: 80,
           align: 'right',
           editor: new fm.TextField(fc['checkpro']),
           renderer: function(v, m,r) {
           		if(step_flow!="yz"&&step_flow!="sgf"){
           			m.css='x-grid-back-editable';  
				}
                return r.get('isper')=='1' ? (v*100).toFixed(2) + "%" : v; 
           }
        }, {
           id:'ratiftpro',
           header: fc['ratiftpro'].fieldLabel,
           dataIndex: fc['ratiftpro'].name,
           width: 80,
           align: 'right',
           editor: new fm.TextField(fc['ratiftpro']),
           renderer: function(v, m,r) {
	           	if(step_flow!="jl"&&step_flow!="sgf"){
	           		m.css='x-grid-back-editable';
				}
                return r.get('isper')=='1' ? (v*100).toFixed(2) + "%" : v; 
           }
        }, {
           id:'decmoney',
           header: fc['decmoney'].fieldLabel,
           dataIndex: fc['decmoney'].name,
           editor: new fm.NumberField(fc['decmoney']),
           renderer : cnMoneyToPrecFun,
           align : 'right',
           width: 80
        }, {
           id:'checkmoney',
           header: fc['checkmoney'].fieldLabel,
           dataIndex: fc['checkmoney'].name,
           editor: new fm.NumberField(fc['checkmoney']),
           renderer : cnMoneyToPrecFun,
           align : 'right',
           width: 80
        }, {
           id:'ratiftmoney',
           header: fc['ratiftmoney'].fieldLabel,
           dataIndex: fc['ratiftmoney'].name,
           editor: new fm.NumberField(fc['ratiftmoney']),
           renderer : cnMoneyToPrecFun,
           align : 'right',
           width: 80
        },{
           id:'remark',
           header: fc['remark'].fieldLabel,
           dataIndex: fc['remark'].name,
           hidden:true,
		   align : 'center',
           editor: new fm.TextField(fc['remark'])
        }, {
			id:'isper',
			header: fc['isper'].fieldLabel,
			dataIndex: fc['isper'].name,
        	hidden : true
        }
	])
    cm.defaultSortable = true;

    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: " conid = '"+ conid + "' and monId = '" + masterId + "'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "acmId"
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');


	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'code-grid-panelsub',
        ds: ds,
        cm: cm,
        sm: sm,
        tbar: [{text:title}],
        iconCls: 'icon-by-category',
        border: false, 
        minSize: 2,
        region: 'center',
        clicksToEdit: 2,
        addBtn : !viewFlag, // 是否显示新增按钮
		saveBtn : !viewFlag, // 是否显示保存按钮
		delBtn : !viewFlag, // 是否显示删除按钮
        header: false,
        autoScroll: true,
        split: true,
        loadMask: true,
		viewConfig:{
			forceFit: false,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey:primaryKey,	
      	insertHandler : insertFun, // 自定义新增方法，可选
	    deleteHandler : deleteFun, // 自定义删除方法，可选
      	saveHandler: saveFun
	});	
	
	
	ds.on('beforeload', function(ds1){
		var baseParams = ds1.baseParams
    	if(isFlwView){
			baseParams.params = " conid = '"+ conid + "' and monId = '" + masterId + "' and declpro is not null and declpro<>0";
		} else {
			baseParams.params = " conid = '"+ conid + "' and monId = '" + masterId + "' " + filterStr;
		}
		baseParams.params += gsFilterStr;
	});
	
	if(step_flow=="sgf"){
		cm.setEditable(cm.getIndexById('checkpro'), false);
		cm.setEditable(cm.getIndexById('ratiftpro'), false);
	}
	if(step_flow=="jl"){
		cm.setEditable(cm.getIndexById('declpro'), false);
		cm.setEditable(cm.getIndexById('ratiftpro'), false);
	}
	if(step_flow=="yz"){
		cm.setEditable(cm.getIndexById('declpro'), false);
		cm.setEditable(cm.getIndexById('checkpro'), false);
	}

	if(isFlwView){
		cm.setEditable(cm.getIndexById('declpro'), false);
		cm.setEditable(cm.getIndexById('checkpro'), false);
		cm.setEditable(cm.getIndexById('ratiftpro'), false);
	}
	gridPanel.on("beforeedit",function(e){
		if(viewFlag==true){
			return false;
		}
	})
	gridPanel.on("afteredit",function(e){
		var editRecord=e.record;
		var editField=e.field;
		var newValue=e.value;
		var oldValue=e.originalValue ;
		if(editField=='declpro'||editField=='checkpro'||editField=='ratiftpro'){
			var regex = /^\-?\d+(\.\d+)?\%?$/;//可以为负数，一个或多个数字，0个或1个.和至少1个数字，0个或1个%
			var isper=editRecord.get('isper');
			if(isper=='1'){
				regex = /^\-?\d+(\.\d+)?\%$/;
				if(!regex.exec(newValue)){
			    	Ext.example.msg("提示","格式错误,只能输入百分数");
			    	editRecord.set(editField,oldValue);
			    	return false;
			    }
			}else{
				regex = /^\-?\d+(\.\d+)?$/;
				if(!regex.exec(newValue)){
			    	Ext.example.msg("提示","格式错误,只能输入数字");
			    	editRecord.set(editField,oldValue);
			    	return false;
			    }
			}
			newValue=newValue.indexOf("%")!=-1?(newValue.substring(0,newValue.length-1))/100:newValue;
			var price=editRecord.get('price');
			if(editField=='declpro'){
				editRecord.set('decmoney', price*newValue);
				editRecord.set('declpro',newValue);
				editRecord.set('checkmoney', price*newValue);
				editRecord.set('checkpro',newValue);
				editRecord.set('ratiftmoney', price*newValue);
				editRecord.set('ratiftpro',newValue);
			}else if(editField=='checkpro'){
	    		editRecord.set('checkmoney', price*newValue);
	    		editRecord.set('checkpro',newValue);
	    		editRecord.set('ratiftmoney', price*newValue);
	    		editRecord.set('ratiftpro',newValue);
			}else if(editField=='ratiftpro'){
				editRecord.set('ratiftmoney', price*newValue);
				editRecord.set('ratiftpro',newValue);
			}
			var re=0;
		 	DWREngine.setAsync(false);
	 		//截止本月累计工程量
		 	var sql = "select nvl(sum(ratiftpro),0) sumv from pro_acm_info where conid='" + conid + "' and proid='"
						+ editRecord.get('proid') + "' and mon_id in(select uids from pro_acm_month t where conid='"
						+ conid + "' and t.month<" + sjType + ")";
		 	//Ext.log(sql);
           	baseMgm.getData(sql,function(list){
				re=list[0];
		    });
		 	DWREngine.setAsync(true);
		 	var precent=((floatAdd(re,newValue))/editRecord.get('amount') * 100).toFixed(2);
		 	editRecord.set('totalpercent',precent);
		}
	})
   //---------------------------------------------------------------------------------------------------------------------------------- 
   // 9. 创建viewport，加入面板action和content
	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		items : [gridPanel, treePanelNew]	
	})
	
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [contentPanel]
    });
    var gridTopBar = gridPanel.getTopToolbar()
	with(gridTopBar){
		gridTopBar.add('->', exportExcelBtn);
		if(isFlwView){
			if(gridTopBar.items.get('filter')){
				gridTopBar.items.get('filter').setVisible(false);
			}
			if(gridTopBar.items.get('save')){
				gridTopBar.items.get('save').setVisible(false);
			}
			if(gridTopBar.items.get('init')){
				gridTopBar.items.get('init').setVisible(false);
			}
		}
	}
    sm.on('beforerowselect', function(sm, rowIndex, keepExisting, record){
		var checkpro = record.get('checkpro');
    	var ratiftpro = record.get('ratiftpro');
    })
    var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"数据加载中..."});
	myMask.show();
	proAcmMgm.initialProAcmInfo(conid, masterId, CURRENTAPPID, function(){
		myMask.hide();
		ds.load({params:{start: 0,limit: PAGE_SIZE}});
	});
   // ------------ 函数 ---------------------------------------------------------------------- 
   function formatDate(value){
     return value ? value.dateFormat('Y-m') : '';
    };
	
	
	// 查找概算项
	function lookup(){
		if (sm.hasSelection()){
			treePanelNew.expand();
			treePanelNew.getEl().mask("loading...");
			var bdgid = sm.getSelected().get('bdgid');
			var monId = sm.getSelected().get('monId');
			proAcmMgm.getPath(bdgid, masterId,  function(path){
				var baseParams = treePanelNew.loader.baseParams
					baseParams.conid = conid;
					baseParams.monId = masterId;
					baseParams.parent = '0';
				treePanelNew.render();
				treePanelNew.expandPath(path);
   				treePanelNew.selectPath(path);
			    treePanelNew.getEl().unmask();
			})
		}
    }
    
        
    function saveFun(){
		var records = ds.getModifiedRecords();
		if(records.length==0)return;
//    	var bdgids = new Array();
//    	var proIds = new Array();
//    	var defference = new Array();
		var isOverAmount=false;
    	for (var i=0; i<records.length; i++){
    		var price = records[i].get('price');
    		var declpro = records[i].get('declpro');
    		var checkpro = records[i].get('checkpro');
    		var ratiftpro = records[i].get('ratiftpro');
    		var proid=records[i].get('proid');
    		var amount=records[i].get('amount');
//    		bdgids.push(records[i].get('bdgid'))
//    		proIds.push(records[i].get('proid'))
//    		defference.push(records[i].get('ratiftpro')-records[i].modified.ratiftpro);
    		if (!price&&!declpro&&!checkpro&&!ratiftpro){
    			Ext.example.msg('提示','填写不完全！');
    			return;
    		}
//    		else{
//    			records[i].set('decmoney', price*declpro);
//	    		records[i].set('checkmoney', price*checkpro);
//	    		records[i].set('ratiftmoney', price*ratiftpro);
//    		}
    		var re=0;
		 	DWREngine.setAsync(false);
	 		//截止本月累计工程量
		 	var sql = "select nvl(sum(ratiftpro),0) sumv from pro_acm_info where conid='" + conid + "' and proid='"
						+ proid + "' and mon_id in(select uids from pro_acm_month t where conid='"
						+ conid + "' and t.month<" + sjType + ")";
		 	//Ext.log(sql);
           	baseMgm.getData(sql,function(list){
				re=list[0];
		    });
		 	DWREngine.setAsync(true);
    		if(floatAdd(declpro,re)>amount||floatAdd(checkpro,re)>amount||floatAdd(ratiftpro,re)>amount){
    			isOverAmount=true;
    		}
    	}
    	if(isOverAmount){
	    	Ext.MessageBox.confirm('确认', '累计工程量已超过总工程量,是否保存？', function(btn,
					text) {
				if (btn == "yes") {
					gridPanel.defaultSaveHandler();
			    	gridPanel.on('aftersave',function(){
				    	//lookup();
				    	proAcmMgm.updateProAcmMonth(masterId);
				    	proAcmMgm.updateProAcmTree(masterId);
				    	//执行工程量数据交换，0为不执行初始化的删除语句的前置SQL
				    	proAcmMgm.proAcmDataExchange(masterId,defaultOrgRootID,CURRENTAPPID,"0");
				    	if(isFlwTask){
				    		Ext.Msg.confirm('保存成功！',
								   '您成功新增了一条工程量付款信息，是否处理流程！　　　<br>点击【是】可以发送流程到下一步操作，点击【否】继续填写其他工程量付款信息！',
								function(btn){
								   	if (btn=="yes"){
							   			parent.parent.IS_FINISHED_TASK = true;
										parent.parent.mainTabPanel.setActiveTab('common');
							   		}
								}
							);
				    	}
			    	})
				}
			});
    	}else{
    		gridPanel.defaultSaveHandler();
			    	gridPanel.on('aftersave',function(){
				    	//lookup();
				    	proAcmMgm.updateProAcmMonth(masterId);
				    	proAcmMgm.updateProAcmTree(masterId);
				    	//执行工程量数据交换，0为不执行初始化的删除语句的前置SQL
				    	proAcmMgm.proAcmDataExchange(masterId,defaultOrgRootID,CURRENTAPPID,"0");
				    	if(isFlwTask){
				    		Ext.Msg.confirm('保存成功！',
								   '您成功新增了一条工程量付款信息，是否处理流程！　　　<br>点击【是】可以发送流程到下一步操作，点击【否】继续填写其他工程量付款信息！',
								function(btn){
								   	if (btn=="yes"){
							   			parent.parent.IS_FINISHED_TASK = true;
										parent.parent.mainTabPanel.setActiveTab('common');
							   		}
								}
							);
				    	}
			    	})
    	}
    }

//选择工程量窗口，从bdg_project表中选择
    function insertFun(){
		var node = treePanelNew.getSelectionModel().getSelectedNode();
		if(node == null || node.attributes.isleaf != '1'){
			Ext.example.msg('提示','请选择最下层的概算节点!');
			return false;
		}
		var bdgid = node.id;
    	    var whereDsNew  = "select t.proid from ProAcmInfo t  where t.conid='"+conid+"' and t.monId='"+masterId+"'";
    	  	dsNew.baseParams.params = "proappid not in("+whereDsNew+") and conid='"+conid+"' and bdgid='" + bdgid + "'";
        	dsNew.load({params:{start: 0,limit: 10}});
				widNew = new Ext.Window({
							title : '工程量明细单',
							layout : 'fit',
							buttonAlign : 'center',
							width : 800,
							height : 416,
							closeAction : 'hide',
							plain : true,
							items : [gridProject],
							buttons : [{
										text : '确定选择',
										// disabled:true
										handler : chooseSure
									}, {
										text : '退出',
										handler : function() {
											widNew.hide();
										}
									}]
						})
						widNew.show();
						smNew.clearSelections();
    }
//winNew确定选择
 function chooseSure(){
       var records = collectionToRecords();
       if(records.length == 0){
           Ext.Msg.alert("信息提示","请选择工程量！")
           return;
       }
       for(var i = 0 ;i < records.length ;i++){
          var proappid = records[i].get("proappid");
          DWREngine.setAsync(false);
          proAcmMgm.initialNewProAcmInfo(proappid,conid,masterId,CURRENTAPPID,function(){
          })
          DWREngine.setAsync(false);
       }
       Ext.example.msg('新增成功！', '您成功新增了'+records.length+'条记录。');
       ds.baseParams.params =" conid = '"+ conid + "' and monId = '" + masterId + "' ";
       ds.load({params:{start: 0,limit: PAGE_SIZE}});
       widNew.hide();
 }
//删除选择的工程量
     function deleteFun(){
	      var record = sm.getSelections();
	      if(!sm.getSelected()){
	         Ext.Msg.alert("信息提示","请选择工程量！")
	      }else{
	      	gridPanel.defaultDeleteHandler();
	        gridPanel.on("afterdelete",function(){
				proAcmMgm.updateProAcmMonth(masterId,function(){});
	        })

	      }

	}  
});
function cnMoneyToPrecFun(v){
	return cnMoneyToPrec(v,2);
}

function exportDataFile(){
	var openUrl = CONTEXT_PATH + "/servlet/InvestmentPlanServlet?ac=exportData&monId=" + masterId + "&businessType=Qantities_F_M&unitId=" + USERDEPTID + "&contractId=" + conid + "&sjType=" + sjType;
	document.all.formAc.action =openUrl
	document.all.formAc.submit();
}
//加法函数，用来得到精确的加法结果 
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。 
//调用：floatAdd(arg1,arg2) 
//返回值：arg1加上arg2的精确结果 
function floatAdd(arg1,arg2){  
   var r1,r2,m;  
   try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}  
   try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}  
   m=Math.pow(10,Math.max(r1,r2))  
   return (arg1*m+arg2*m)/m  
}