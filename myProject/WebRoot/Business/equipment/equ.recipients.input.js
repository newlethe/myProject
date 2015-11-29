﻿var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.equipment.hbm.EquRec";
var beanSub = "com.sgepit.pmis.equipment.hbm.EquRecSub";
var business = "baseMgm";       
var listMethod = "findByProperty";
var listMethodSub ="findWhereOrderBy";
var primaryKey = "recid";
var orderColumn = "recid";
var recColumn = "recno";
var propertyName = "conid";
var gridPanelTitle = "所有记录";
var propertyValue;
var SPLITB = "`";
var macTypes =[[1,'#1'],[2,'#2'],[3,'公共'],[-1,'  ']];
var equTypes = new Array();
var selectedRecId = "";
var selRecSubId = "";
var bodyPanelTitle = "设备出库信息   合同：" + selectedConName + "，编号：" + selectedConNo;
var formWindow;
var data = new Array();
var data_sub = new Array();
var data_rec = new Array();
var data_rec1=new Array();
var data_rec2=new Array();
var dsSub;
var CONOVE;
var jzhType2 = [[5,'#1、#2机组'],[3,'#3机组-'],[2,'#2机组'],['','所有机组']];
var wzType = [[2,'设备'],[3,'备品备件'],[4,'专用工具'],['','所有类型']];
var selectWindow;
var userOrgName="";
var queryWin,queryWin2;
var billTypes = [[1,'处理中'],[2,'处理完毕'],[3,'被退回']];
var flowWindow,recWindow;

Ext.onReady(function(){
       //获取申领单位信息
		baseMgm.getData("select unitname from sgcc_ini_unit t where unitid = '"+USERUNITID+"'",function(n){
			userOrgName = n;
			/*if(_list[0]){
				alert()
				userOrgName = _list[0].UNITNAME;
			}*/
		});
	/**
	 * @description 被流程所调用的页面中，按钮的统一化管理
	 * @param BUTTON_CONFIG - 存放当前页面上的所有按钮
	 * @author xiaos
	 */
var BUTTON_CONFIG = {
    	'ADD': {
	    	id: 'add',
	    	text: '新增',
	    	iconCls: 'add',
	    	//disabled: true,
	    	handler: function(){
	    		RecWin("add")
    	}
	    },'EDIT': {
	    	id: 'edit',
	    	text: '修改',
	    	iconCls: 'btn',
	    	//disabled: true,
	    	handler: function(){
    		if (sm.getSelected()){
    			RecWin("update")
    		}
    	}
	    },'DEL': {
	    	id: 'del',
	    	text: '删除',
	    	iconCls: 'btn',
	    	//disabled: true,
	    	handler: function(){
	    		if (sm.getSelected()){
	    			Ext.Msg.show({
					title: '提示',
					msg: '是否要删除?　　　　',
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
							equRecMgm.deleteEquRec("",sm.getSelections()[0].get("recid"), function(){
								window.location.reload();
							Ext.example.msg('成功删除！', '您成功删除了一条信息！');
							}); 
						}
					}
				});
    		}
	    	}
	    },'NOW': {
	    	id: 'now',
	    	text: '<font color=green>当前出库申请</font>',
			pressed: true,
			iconCls: 'btn',
			disabled: true,
			handler: getNowData
	    },'OLD1': {
	    	id: 'old',
	    	text: '<font color=green>已申请出库(处理中)</font>',
			pressed: true,
			iconCls: 'refresh',
			disabled: true,
			handler: getOldData1
	    },'OLD2': {
	    	id: 'old',
	    	text: '<font color=blue>已申请出库（处理完毕）</font>',
			pressed: true,
			iconCls: 'finish',
			disabled: true,
			handler: getOldData2
	    },'ALL': {
	    	id: 'all',
	    	text: '<font color=red>所有出库记录</font>',
			pressed: true,
			disabled: true,
			iconCls: 'btn',
			handler: getAllData
	    },'btnQuery':{
		   text: '查询',
		   iconCls: 'option',
		   handler: doQueryAdjunct1
          }
          }
   
       if (isFlwTask == true){
    	BUTTON_CONFIG['NOW'].disabled = false;
    	BUTTON_CONFIG['ALL'].disabled = false;
    } else if (isFlwView == true){
    	BUTTON_CONFIG['NOW'].disabled = true;
    } else if (isFlwTask != true && isFlwView != true) {
    	BUTTON_CONFIG['NOW'].disabled = true;
    	BUTTON_CONFIG['OLD1'].disabled = false;
    	BUTTON_CONFIG['OLD2'].disabled = false;
    	BUTTON_CONFIG['ALL'].disabled = false;
    }
	DWREngine.setAsync(false); 
    /*appMgm.getCodeValue('设备类型',function(list){alert()
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);
			equTypes.push(temp);
		}
    });*/
    
    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType2
    });
    
    var combox_wztype = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : wzType
    });
	
	if (isFlwTask == true||isFlwView == true){
		baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conno='"+g_conno+"'", function(list){
			CONOVE = list[0];
		});	
		
	}
	
	DWREngine.setAsync(true);
	
	if (isFlwTask == true||isFlwView == true){
		bodyPanelTitle = "设备出库信息   合同：" + CONOVE.conname + "，编号：" + g_conno;
	}	
	propertyValue = (isFlwTask != true && isFlwView != true)?selectedConId:CONOVE.conid
	var dsMachine = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
		data: macTypes
	});
	
	var fm = Ext.form;
	
	var fc = {
		'conid': {
			name: 'conid',
			fieldLabel: '合同ID',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			anchor: '95%'
		}, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'recid': {
			name: 'recid',
			fieldLabel: '出库主键',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'recno': {
			name: 'recno',
			fieldLabel: '出库单编号',
			anchor:'95%'
		}, 'recdate': {
			name: 'recdate',
			fieldLabel: '出库日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
		}, 'recunit': {
			name: 'recunit',
			fieldLabel: '申领单位',
			anchor:'95%'
		}, 'recman': {
			name: 'recman',
			fieldLabel: '申领人',
			anchor:'95%'
		}, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			anchor:'95%'
		}, 'pleRecdate': {
			name: 'pleRecdate',
			fieldLabel: '申领日期',
			width:45,
            format: 'Y-m-d',
			anchor:'95%'
		},'billstate': {
            name: 'billstate',
			fieldLabel: '流程状态',
			anchor:'95%'
         }    
	};
	
	var Columns = [
		{name: 'conid', type: 'string'},
		{name: 'pid', type: 'string'}, 
		{name: 'recid', type: 'string'},
		{name: 'recno', type: 'string'},
		{name: 'recdate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'recunit', type: 'string'},
		{name: 'recman', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'pleRecdate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'billstate', type: 'string'}
	];
	
	var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
		conid: (isFlwTask != true && isFlwView != true)?selectedConId:CONOVE.conid,
		pid: CURRENTAPPID,
		recid: '',
		recno: isFlwTask == true ? g_recno : getRecNoInit(),
		recunit:userOrgName,
		recman: isFlwTask == true ? '' : REALNAME,
		remark: '',
		pleRecdate:new Date(),
		billstate:1
	};
	
	function test(){return '001';}
	
	function getRecNoInit() {
		var recnoInit;
		DWREngine.setAsync(false); 
		equRecMgm.getRecNo((isFlwTask != true && isFlwView != true)?selectedConId:CONOVE.conid, function(recNo){
			recnoInit = recNo;
    	});   
		DWREngine.setAsync(true);
		return recnoInit;
	}
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	var cm = new Ext.grid.ColumnModel([
		sm, {
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
			id: 'recid',
			header: fc['recid'].fieldLabel,
			dataIndex: fc['recid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'recno',
			header: fc['recno'].fieldLabel,
			dataIndex: fc['recno'].name,
			width: 200
		}, {
			id: 'pleRecdate',
			header: fc['pleRecdate'].fieldLabel,
			dataIndex: fc['pleRecdate'].name,
			width: 80,
			renderer: formatDate,
			css : 'background: yellow;', 
			editor: new fm.DateField(fc['pleRecdate'])
		}, {
			id: 'recunit',
			header: fc['recunit'].fieldLabel,
			dataIndex: fc['recunit'].name,
			width: 200,
			editor: new fm.TextField(fc['recunit'])
		}, {
			id: 'recman',
			header: fc['recman'].fieldLabel,
			dataIndex: fc['recman'].name,
			width: 200,
			editor: new fm.TextField(fc['recman'])
		}, {
			id: 'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width: 300,
			editor: new fm.TextField(fc['remark'])
		}, {
			id: 'recdate',
			header: fc['recdate'].fieldLabel,
			dataIndex: fc['recdate'].name,
			width: 80,
			renderer: formatDate,
			css : 'background: green;', 
			editor: new fm.DateField(fc['recdate'])
		},{
           id:'billstate',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           width: 120,
           renderer:billTypeRender
        }
	]);
	cm.defaultSortable = true;
	
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethodSub,
	    	params: propertyName + "=" +propertyValue
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
    ds.setDefaultSort(recColumn, 'desc');

	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
       // tbar: ["<font color=#15428b><b>&nbsp;设备出库</b></font>" ],
        tbar: [''],
        iconCls: 'icon-by-category',
        border: false,
        region: 'center',
        height:300,
        clicksToEdit: 2,
        header: false,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        enableDragDrop: true,         //一旦选中某行，就不能取消选中，除非选中其他行
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 5,
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
      	primaryKey: primaryKey,		
      	insertHandler: insertFun,
      	deleteHandler: deleteFun
	});
	sm.on('rowselect', catGridRowSelected);
	//流程在申请出库节点主表编辑功能控制
    gridPanel.on('beforeedit',function(e){
 	    if(g_funname == '申请出库'){
 	    if('recdate' == e.field){                             //recnum：出库数量
 	        Ext.example.msg('提示：', '申领阶段不允许填写出库日期！');
 	        return false;
 	    }
 		}else if(g_funname == '实际出库'){
 		 if('pleRecdate' == e.field||'recunit' == e.field||'recman'==e.field){ 
 	        return false;
 		  }
 		}
   })
var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	gridPanel.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var recno = record.get("recno");
		gridMenu.removeAll();
	    gridMenu.addMenuItem({
	    	id: 'menu_flow',
            text: '　流程信息',
            recno: recno,
            iconCls: 'flow',
            handler : toHandler
	    });
	    gridMenu.showAt(e.getXY());
	}
	
  function toHandler(){
		var state = this.id;
		if ("" != state){
			Ext.get('loading-mask').show();
			Ext.get('loading').show();
		    if ("menu_flow" == state){
				Ext.get('loading-mask').hide();
				Ext.get('loading').hide();
				var _recno = this.recno;
				baseDao.findByWhere("com.sgepit.webpmis.domain.flow.InsDataInfoView", "paramvalues like '%recno:"+_recno+"%' and funname ='申请领用'", function(list){
					if (list.length > 0){
						showFlow(list[0].insid);
					} else {
						Ext.example.msg('提示', '该设备没有走出库流程！');
					}
				});
			}else{return}
		}
	}
   	 function showFlow(_insid){
		if(!flowWindow){
			flowWindow = new Ext.Window({	               
				title: ' 流程信息',
				iconCls: 'form',
				width: 900,
				height: 500,
				modal: true,
				closeAction: 'hide',
				maximizable: false,
				resizable: false,
				plain: true,
				autoLoad: {
					url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
					params: 'pid='+CURRENTAPPID+'&type=flwInfo&insid='+_insid,
					text: 'Loading...'
				}
			});
		} else {
			flowWindow.autoLoad.params = 'type=flwInfo&insid='+_insid;
			flowWindow.doAutoLoad();
		}
		flowWindow.show();
	}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var fcsub = {		// 创建编辑域配置
    	 'recsubid': {
			name: 'recsubid',
			fieldLabel: '出库从表主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'recid': {
			name: 'recid',
			fieldLabel: '出库主键(与主表关联ID)',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'equid': {
			name: 'equid',
			fieldLabel: '设备id',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'wztype': {
			name: 'wztype',
			fieldLabel: '物资类别',
			anchor:'95%'
         },'sbmc': {
			name: 'sbmc',
			fieldLabel: '设备名称',
			anchor:'95%'
         } ,'ggxh': {
			name: 'ggxh',
			fieldLabel: '规格型号',
			anchor:'95%'
         },	'dw' : {
			name : 'dw',
			fieldLabel : '单位',
			anchor : '95%'
		},	'sccj' : {
			name : 'sccj',
			fieldLabel : '生产厂家',
			anchor : '95%'
		},'kcsl' : {
			name : 'kcsl',
			fieldLabel : '库存数量',
			anchor : '95%'
		}, 'pleRecnum': {
			name: 'pleRecnum',
			fieldLabel: '申领数量',
			anchor:'95%'
         }, 'recnum': {
			name: 'recnum',
			fieldLabel: '出库数量',
			anchor:'95%'
         },'machineNo' : {
			name: 'machineNo',
			fieldLabel: '机组号',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: dsJzh,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		} ,'box_no': {
			name: 'box_no',
			fieldLabel: '箱件号',
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '备注 ',
			anchor:'95%'
         },'part_no': {
			name: 'part_no',
			fieldLabel: '部件号',
			anchor:'95%'
         }
    }
	var ColumnsSub = [
		{name: 'recsubid', type: 'string'},
		{name: 'recid', type: 'string'},
		{name: 'equid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'wztype', type: 'string'},
		{name: 'sbmc', type: 'string'},
		{name: 'ggxh', type: 'string'},
		{name: 'dw', type: 'string'},
		{name: 'sccj', type: 'string'},	
		{name: 'kcsl', type: 'float'},
		{name: 'pleRecnum', type: 'float'},
		{name: 'recnum', type: 'float'},
		{name: 'machineNo', type: 'string'},
		{name: 'box_no', type: 'string'},
		{name: 'part_no', type: 'string'},
		{name: 'remark', type: 'string'}
	];
	
	var smSub = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	var cmSub = new Ext.grid.ColumnModel([
		smSub, {
			id: 'recsubid',
			header: fcsub['recsubid'].fieldLabel,
			dataIndex: fcsub['recsubid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'recid',
			header: fcsub['recid'].fieldLabel,
			dataIndex: fcsub['recid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'equid',
			header: fcsub['equid'].fieldLabel,
			dataIndex: fcsub['equid'].name,
			hidden: true,
			width: 100
		},{
			id: 'wztype',
			header: fcsub['wztype'].fieldLabel,
			dataIndex: fcsub['wztype'].name,
			renderer:wztypeRender,
			width: 60
		}, {
			id: 'sbmc',
			header: fcsub['sbmc'].fieldLabel,
			dataIndex: fcsub['sbmc'].name,
			width: 150
		}, {
			id: 'ggxh',
			header: fcsub['ggxh'].fieldLabel,
			dataIndex: fcsub['ggxh'].name,
			width: 100
		}, {
			id: 'dw',
			header: fcsub['dw'].fieldLabel,
			dataIndex: fcsub['dw'].name,
			width: 50
		}, {
		   id: 'kcsl',
           header: fcsub['kcsl'].fieldLabel,
			dataIndex: fcsub['kcsl'].name,
			css : 'background: red;',
           width: 80
        },{
			id: 'pleRecnum',
			header: fcsub['pleRecnum'].fieldLabel,
			dataIndex: fcsub['pleRecnum'].name, 
			width: 80,
			css : 'background: yellow;',  
			editor:new Ext.form.TextField(fcsub['pleRecnum'])
		}, {
			id: 'sccj',
			header: fcsub['sccj'].fieldLabel,
			dataIndex: fcsub['sccj'].name,
			width: 150
		},  {
			id: 'machineNo',
			header: fcsub['machineNo'].fieldLabel,
			dataIndex: fcsub['machineNo'].name,
			renderer: jzhRender,
			width: 80
		}, {
			id: 'box_no',
			header: fcsub['box_no'].fieldLabel,
			dataIndex: fcsub['box_no'].name,
			width: 60
		}, {
			id: 'part_no',
			header: fcsub['part_no'].fieldLabel,
			dataIndex: fcsub['part_no'].name,
			width: 60
		}, {
			id: 'remark',
			header: fcsub['remark'].fieldLabel,
			dataIndex: fcsub['remark'].name,
			width: 120,
			editor:new Ext.form.TextField(fcsub['remark'])
		},{
			id: 'recnum',
			header: fcsub['recnum'].fieldLabel,
			dataIndex: fcsub['recnum'].name,
			width: 80,
			css : 'background: green;',    
			editor:new Ext.form.TextField(fcsub['recnum'])
		}
	]);
	cmSub.defaultSortable = true;
	
	 dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanSub,				
	    	business: business,
	    	method: listMethodSub
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'recsubid'
        }, ColumnsSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsSub.setDefaultSort('ggxh', 'asc');
    
/*
    var addBtn = new Ext.Button({
    	text: '新增',
    	iconCls: 'add',
    	handler: function(){
    		insertFunPart();
    	}
    });
    
    addBtn.on('click', showEquData);
    
    var editBtn = new Ext.Button({
    	id: 'edit',
    	text: '修改',
    	iconCls: 'btn',
    	disabled: true,
    	handler: function(){
    		if (smSub.getSelected()){
	    		equRecMgm.storeNum(smSub.getSelected().get('SB_ID'), function(num){
//					var url = BASE_PATH+"Business/equipment/equ.recipients.addorupdate.jsp?";
//					window.location.href = url + "recsubid=" + selRecSubId + "&storenum=" + num;
	    			selectWin(selRecSubId, num);
				});
    		}
    	}
    });
    */
       //待领用
       var daily = new Ext.Button({
	       id: 'daily',
    	   text: '待出库设备',
    	   pressed: true,
    	   //disabled: true,
    	   iconCls: 'add',
    	   handler: getDLy
           });
           
    var delBtn = new Ext.Button({
    	id: 'del',
    	text: '删除',
    	iconCls: 'multiplication',
    	disabled: true,
    	handler: function(){
    		Ext.Msg.show({
				title: '提示',
				msg: '是否要删除?　　　　',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(value){
					if ("yes" == value){
						Ext.get('loading-mask').show();
						Ext.get('loading').show();
						equRecMgm.deleteRecSub(selRecSubId, function(state){
							Ext.get('loading-mask').hide();
							Ext.get('loading').hide();
							if ("" == state){
								Ext.example.msg('删除成功！', '您成功删除了一条出库从表信息！');
								data_rec.length = 0;
								dsSub.loadData(data_rec);
							} else {
								Ext.Msg.show({
								   title:'提示',
								   msg: state,
								   buttons: Ext.Msg.OK,
								   icon: Ext.MessageBox.WARNING
								});
							}
						});
					}
				}
			});
    	}
    });
  
     var SaveBtn = new Ext.Button({
    	text: '申领该设备',
    	iconCls: 'finish',
    	disabled: true,
    	pressed: true,
    	tooltip: '<font color=#15428b><b>&nbsp;请注意填写申请数量</b></font>',
    	handler: savely
    });
    
     var btnQuery2 = new Ext.Button({
		text: '查询',
		iconCls: 'option',
		disabled: true,
		handler: doQueryAdjunct2
	});
	
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
    	id: 'code-grid-panel',
        ds: dsSub,
        cm: cmSub,
        sm: smSub,
        tbar: [daily,'-',SaveBtn],
        iconCls: 'icon-by-category',
        border: false, 
       // minSize: 2,
        height:260,
        region: 'south',
        clicksToEdit: 2,
        header: false,
        autoScroll: true,
        split: true,
        collapsed: false,
        collapsible: true,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 20,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
		plant : Plant, // 初始化记录集，必须
		plantInt : PlantInt, // 初始化记录集配置，必须
		servletUrl : ServletUrl, // 服务器地址，必须
		bean : beanSub, // bean名称，必须
		business : "baseMgm", // business名称，可选
		primaryKey : 'recsubid',//,// 主键列名称，必须
		//insertHandler : insertFun, // 自定义新增按钮的单击方法，可选
		//deleteHandler : deleteFun//,
		//insertMethod : 'saveDeptInfo',// 自定义增删改的方法名，可选，可部分设置insertMethod/saveMethod/deleteMethod中的一个或几个
		saveHandler : savelyinfo
	});
	//smSub.on('selectionchange', selChangeFun);
	
	  gridPanelSub.on('beforeedit',function(e){
 	    if('recnum' == e.field){                             //recnum：出库数量
 	    if(e.record.data.recid==''){
 	        Ext.example.msg('提示：', '待出库设备中不允许填写出库数量，请填写【申领数量】！');
 	        return false;
 	    }else if(g_funname == '申请出库'){
 	        Ext.example.msg('提示：', '申领过程中不允许修改出库数量，请修改【申领数量】！');
 	        return false;
 	    }}
 		 if(g_funname == '实际出库'){
 		 if('pleRecnum' == e.field){ 
 		  return false;
 		  } 
 		 }
   })
   
	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	
	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;'+bodyPanelTitle+'</b></font>'
	})
	
   
	var contentPanel = new Ext.Panel({
        id: 'main-panel',
		tbar: [titleBar],
        border: false,
        region: 'center',
        split: true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[gridPanel, gridPanelSub]
    });	
	
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [contentPanel],
		listeners:{
			afterlayout:function(){
			    gridPanel.showHideTopToolbarItems("add", false);
			    gridPanel.showHideTopToolbarItems("del", false);
			    gridPanel.showHideTopToolbarItems("refresh", false);
			 	gridPanelSub.showHideTopToolbarItems("refresh", false);
				gridPanelSub.showHideTopToolbarItems("del", false);
				gridPanelSub.showHideTopToolbarItems("add", false);
				//gridPanel.showHideTopToolbarItems("save", false);
				if (isFlwView != true && isFlwTask != true){
				gridPanel.showHideTopToolbarItems("save", false);
				gridPanelSub.showHideTopToolbarItems("save", false);
			    } else if (isFlwView == true){
			    gridPanel.showHideTopToolbarItems("save", false);
				gridPanelSub.showHideTopToolbarItems("save", false);
					//gridPanelSub.getTopToolbar().disable();
			    } else if (isFlwTask == true){
			      //  gridPanel.showHideTopToolbarItems("add", false);
			    	//gridPanel.showHideTopToolbarItems("del", false);
			    	//gridPanel.showHideTopToolbarItems("refresh", false);
			    	/*if (g_funname.indexOf('流程节点一') != -1){
						gridSub.getTopToolbar().disable();
					} else if (g_funname.indexOf('流程节点二') != -1){
						grid.getTopToolbar().disable();
						BUTTON_CONFIG['DAI'].disabled = true;
						BUTTON_CONFIG['NOW'].disabled = true;
						BUTTON_CONFIG['ALL'].disabled = true;
					}*/
			    	if (g_funname == '申请领用') {
			    	} else if (g_funname == '实际领用') {
			    	}
			    }
			}  
		}	
    });
    gridPanel.getTopToolbar().add(BUTTON_CONFIG['ADD'],BUTTON_CONFIG['EDIT'],BUTTON_CONFIG['DEL'],BUTTON_CONFIG['btnQuery'],'-',BUTTON_CONFIG['NOW'],'->',BUTTON_CONFIG['OLD1'],'-',BUTTON_CONFIG['OLD2'],'-',BUTTON_CONFIG['ALL']);
    //gridPanel.getTopToolbar().add(BUTTON_CONFIG['btnQuery']);
    gridPanelSub.getTopToolbar().add(btnQuery2);
    if (isFlwTask == true || isFlwView == true) ds.baseParams.params = "recno='"+g_recno+"'";
    ds.load({callback: SAVE_REC_FROM_FLOW});
    ds.on('load', function(){if (isFlwTask == true) selectSingleData('recno', g_recno);})
    //getNowLy();
    
    function selectSingleData(k, v){
    	for (var i=0; i<ds.getCount(); i++) {
    		if (ds.getAt(i).get(k) == v){
    			sm.selectRow(i);return;
    		}
    	}
    }
    //TODO
    function SAVE_REC_FROM_FLOW(){
    	if (isFlwTask == true && g_funname == '申请领用') {
	    	baseDao.findByWhere(bean, "conid="+CONOVE.conid+" and recno="+g_recno, function(list){
	    		if (list.length>0) {
	    			ds.reload();
	    		} else {
		    		gridPanel.defaultInsertHandler();
		    		ds.getAt(0).set('recman', REALNAME);
		    		gridPanel.defaultSaveHandler();
	    		}
	    	});
    	}
    }
    
    function catGridRowSelected(obj){
    	var record = sm.getSelected();
    	if(record){
    		selectedGgId = record.get('recid');
    		dsSub.baseParams.params = "recid='"+selectedGgId+"'";
    		dsSub.load({
    			params: {
    				start: 0,
    				limit: PAGE_SIZE3
    			}
    		});
		    	btnQuery2.setDisabled(false);
	    	if(isFlwTask== true){ //流程中需使用的按钮
		    	if (g_funname == '申请领用') daily.setDisabled(false);
		    	gridPanelSub.showHideTopToolbarItems("save", true);
		    	SaveBtn.setDisabled(true);
	    	}		
    	}
    	/*
    	if (record == null || (record.get("recid")=="")) {
    		if (selectedRecId != ""){
	    		selectedRecId = "";
    		}
    	} else {
    		if (selectedRecId != record.get("recid")) {
	    		selectedRecId = record.get("recid");
	    		var g_recName = record.get('recno');
	    		btnGridTitle.setText("<font color=#15428b><b>&nbsp;"+g_recName+" 设备领用信息</b></font>");
    		}
    	}
    	selectedRecId = record.get("recid")
    	if (selectedRecId != "" && obj != null){
    		data_rec.length = 0;
    		DWREngine.setAsync(false);
    		equRecMgm.equRecSub(selectedRecId, function(list){
    			for (var i = 0; i < list.length; i++) {
	    			var obj = new Array();
	    			obj.push(list[i].RECSUBID);
		    		obj.push(list[i].RECID);
		    		obj.push(list[i].EQUID);
		    		obj.push(list[i].SB_MC);
		    		obj.push(list[i].PARENTMC);
		    		obj.push(list[i].GGXH);
		    		obj.push(list[i].DW);
		    		obj.push(list[i].ZS);
		    		obj.push(list[i].SL);
		    		//obj.push(list[i].DHSL);
		    		obj.push(list[i].SCCJ);
		    		obj.push(list[i].PLE_RECNUM);
		    		obj.push(list[i].RECNUM);
		    		obj.push(list[i].MACHINE_NO);
		    		obj.push(list[i].RECDATE);
		    		obj.push(list[i].REMARK);
		    		obj.push(list[i].PLE_RECDATE);
		    		
		    		obj.push(list[i].WZTYPE);
		    		//obj.push(list[i].GG_DATE);
		    		obj.push(list[i].CHECKDATE);
		    		obj.push(list[i].BOX_NO);
		    		obj.push(list[i].PART_NO);
		    		obj.push(list[i].PROJECT_DEPT);
		    		obj.push(list[i].SUPERVISION);
		    		
		    		data_rec.push(obj);
    			}
    		});
    		DWREngine.setAsync(true);
    		dsSub.loadData(data_rec);
    	}
    	*/
    }
    
    function billTypeRender(value){	//单据状态类型
   		var str = '';
   		for(var i=0; i<billTypes.length; i++) {
   			if (billTypes[i][0] == value) {
   				str = billTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
	function insertFun(){
	this.defaultInsertHandler();
    }
    function deleteFun(){
    	var records = sm.getSelections();
    	if (records.length > 0){
	    	var ids = new Array();
	    	for (var i=0; i<records.length; i++){
	    		ids.push(records[i].get('recid'));
	    	}
	    	equRecMgm.checkDelete(ids, function(flag){
	    	if("" != flag){Ext.example.msg('提示！', flag); return;}
	    		Ext.Msg.show({
					title: '提示',
					//msg: ("" == flag) ? '是否要删除?' : flag,
					msg: '是否要删除?',
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
							Ext.get('loading-mask').show();
							Ext.get('loading').show();
							equRecMgm.deleteEquRec(flag, ids, function(){
								Ext.get('loading-mask').hide();
								Ext.get('loading').hide();
								Ext.example.msg('删除成功！', '您成功删除了出库信息！');
								ds.load();
							});
						}
					}
				});
	    	});
    	}
    }
    function selChangeFun(){
    	var record = smSub.getSelected();
    	if (record) {
    		//saveBtn.enable();
    		//delBtn.enable();
    	} else {
    		//editBtn.disable();
    		//delBtn.disable();
    	}
    }
 
    function insertFunPart(){
    /*	if ("" != selectedRecId){
    		popWinwdow();
    		popWinwdow();
    	}else{
    		Ext.example.msg('操作错误！', '请先选择主表信息！');
    	}*/
    }
     
    function popWinwdow(){
 		if(!formWindow){
			formWindow = new Ext.Window({	               
				title: '选择设备部件',
				iconCls: 'form',
				layout: 'border',
				border: false,
				width: 950,
				height: 500,
				modal: true,
//				constrain: true,
				maximizable: true,
				closeAction: 'hide',
				items: [g_gridEquSub],
				listeners: {
					hide: function(){
						//dsSub.reload();
						if (isFlwTask == true){
							Ext.Msg.show({
								title: '您成功维护了设备出库信息！',
								msg: '您是否进行发送流程到下一步操作！<br><br>是：[完成流程任务] 否：[继续维护数据]',
								buttons: Ext.Msg.YESNO,
								icon: Ext.MessageBox.INFO,
								fn: function(value){
							   		if ('yes' == value){
							   			parent.IS_FINISHED_TASK = true;
										parent.mainTabPanel.setActiveTab('common');
							   		}
								}
							});
						}
					}
				}  				
			}); 
     	}
     	formWindow.show();
//     	loadStore();
   	}
   	function fnValidate(){
   		var flag = true;
   		var editRecords = ds.getModifiedRecords();
    	for (var i = 0; i < editRecords.length; i++) {
    		var record = editRecords[i];
    		var f_equNum = record.get('equNum');
    		if ("" == f_partNum){
    			Ext.example.msg('提示', '必填项：数量 未填写！');
    			flag = false;
    		}
    	}
    	return flag;
   	}
	
    /*
    function getStoreNum(value,metadata,record){
		var result = record.data.ZS;
		DWREngine.setAsync(false); 
		equRecMgm.storeNum(record.data.SB_ID,function(num){
			result = num;
		})
		DWREngine.setAsync(true); 
		return result;
	}
    */
	
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
   function jzhRender(value){
   		var str = '';
   		for(var i=0; i<jzhType.length; i++) {
   			if (jzhType[i][0] == value) {
   				str = jzhType[i][1]
   				break; 
   			}
   		}
   		return str;
   }  
   
	function wztypeRender(value){
		var result = '';
		if('2' == value)result='设备';
		else if('3' == value)result='备品备件';
		else if('4' == value)result='专用工具';
		else result = '';
		return result;
	}   
	
	
	function getrefesh(a){                //修改出库数据以后，重新加载从表数据
		dsSub.baseParams.params ="conid=" + (isFlwTask == true ? CONOVE.conid : selectedConId) +"and recid='"+a+"' and recid is not null"
    		dsSub.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
	}
	function getDLy(){
		dsSub.baseParams.params ="conid=" + (isFlwTask == true ? CONOVE.conid : selectedConId) +"and kcsl!=0 and recid is null"
    	dsSub.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
	    selectedGgId='';
	    SaveBtn.setDisabled(false);
	   // btnQuery2.setDisabled(true);
	    gridPanelSub.showHideTopToolbarItems("save", false);
	}
	
    function savelyinfo(){                                  //保存设备
     var editRecords = dsSub.getModifiedRecords();
		for (var i=0; i<editRecords.length; i++){
			DWREngine.setAsync(false);
   			equRecMgm.SaveRecSub(editRecords[i].data,sm.getSelected().get('recid'),function(state){
	   			if(state=="1"){Ext.example.msg('删除成功！', '您成功删除了该条出库信息！');}
	   			else if(state=="2"){
	   				Ext.example.msg('保存成功！', '您成功修改了该条出库信息！');
	   				if (isFlwTask == true){
						Ext.Msg.show({
							title: '您成功维护了设备出库信息！',
							msg: '您是否进行发送流程到下一步操作！<br><br>是：[完成流程任务] 否：[继续维护数据]',
							buttons: Ext.Msg.YESNO,
							icon: Ext.MessageBox.INFO,
							fn: function(value){
						   		if ('yes' == value){
						   			parent.IS_FINISHED_TASK = true;
									parent.mainTabPanel.setActiveTab('common');
						   		}
							}
						});
					}
	   			}
	   			else if(state=="4"){Ext.example.msg('提示', '【库存数量】不足，请重新修改请领数量！');}
	   			else if(state=="6"){Ext.example.msg('提示', '申请数量不能小于0！');}
	   			
   			});
   			getrefesh(editRecords[i].get('recid'));
   			DWREngine.setAsync(true);
		}
    }

	function savely(){                            //出库设备
	var editRecords = dsSub.getModifiedRecords();
	var flag = false;
		for (var i=0; i<editRecords.length; i++){
			if (editRecords[i].get('pleRecnum') == '0'|| editRecords[i].get('pleRecnum') == ''|| editRecords[i].get('pleRecnum') == null) {
				Ext.example.msg('提示', '必需填写【请领数量】！');
				return;
			}
			DWREngine.setAsync(false);
   			equRecMgm.SaveRecSub(editRecords[i].data,sm.getSelected().get('recid'),function(state){
   			if(state=="5"){Ext.example.msg('提示', '【库存数量】不足，请重新填写请领数量！');  getDLy(); flag = false;}  
   			else if(state=="7"){Ext.example.msg('提示', '申请数量不能小于0！'); flag = false;}  
   			else if(state=="3"){                
   			Ext.example.msg('出库成功！', '您成功出库了该设备！');  
   			getDLy();flag = true;
   			               }                                 
   			});
   			DWREngine.setAsync(true);
		}
		if (flag == true && isFlwTask == true) {
			Ext.Msg.show({
				title: '您成功维护了设备出库信息！',
				msg: '您是否进行发送流程到下一步操作！<br><br>是：[完成流程任务] 否：[继续维护数据]',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.INFO,
				fn: function(value){
			   		if ('yes' == value){
			   			parent.IS_FINISHED_TASK = true;
						parent.mainTabPanel.setActiveTab('common');
			   		}
				}
			});
		}
	}
	 function getNowData(){
		var sql="recno='" + g_recno +"'";
		ds.baseParams.params = sql;
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
    }
    
     function getOldData1(){
		ds.baseParams.params = propertyName + "=" +propertyValue +" and (billstate=1 or billstate=3)";
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
    }
    
    function getOldData2(){
		ds.baseParams.params = propertyName + "=" +propertyValue +" and (billstate=2)";
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
    }
    function getAllData(){
    	ds.baseParams.params =propertyName + "=" +propertyValue ;
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
    }
    
////////////////////////////////////////////////////////////////////////////////////////////////////////////主表查询部分
  function doQueryAdjunct1(){
		if (!queryWin) {
			queryWin = new Ext.Window({
				title: '查询数据',
				width: 450, height: 330,
				layout: 'fit',
				iconCls: 'option',
				closeAction: 'hide',
				border: true,
				constrain: true,
				maximizable: false,
				resizable: false,
				modal: false,
				items: [queryPanel1]
			});
		}
		queryPanel1.getForm().reset();
		queryWin.show();
	}
	var queryPanel1 = new Ext.form.FormPanel({
        border: false, autoScroll: true,
		bodyStyle: 'padding: 10px 10px; border:0px;',
		labelAlign: 'right', layout: 'form',
	 	items: [
	 		new Ext.form.FieldSet({      
	 			title: '关键字',
	 			layout: 'form',
	 			border: true,
	 			items: [
	 				new Ext.form.TextField(fc['recno']),
	 				new Ext.form.TextField(fc['recunit']),
	 				new Ext.form.TextField(fc['recman']),
	 				{
	            		border: false, layout: 'column',
	            		items: [
	            			{
		            			layout: 'form', columnWidth: .6, bodyStyle: 'border: 0px;',
		            			items: [
		            				new Ext.form.DateField({
										id: 'pleRecdate'+'_begin',
										fieldLabel: '申领日期', width: 120,
										format: 'Y-m-d', minValue: '2000-01-01', emptyText: '开始时间'
									})
		            			]
		            		},{
		            			layout: 'form', columnWidth: .4, bodyStyle: 'border: 0px; padding: 0px 16px;',
		            			items: [
									new Ext.form.DateField({
										id: 'pleRecdate'+'_end',
										hideLabel: true, width: 125,
										format: 'Y-m-d', minValue: '2000-01-01', emptyText: '结束时间'
									})
		            			]
		            		}
	            		]
	            	},{
	            		border: false, layout: 'column',
	            		items: [
	            			{
		            			layout: 'form', columnWidth: .6, bodyStyle: 'border: 0px;',
		            			items: [
		            				new Ext.form.DateField({
										id: 'recdate'+'_begin',
										fieldLabel: '出库日期', width: 120,
										format: 'Y-m-d', minValue: '2000-01-01', emptyText: '开始时间'
									})
		            			]
		            		},{
		            			layout: 'form', columnWidth: .4, bodyStyle: 'border: 0px; padding: 0px 16px;',
		            			items: [
									new Ext.form.DateField({
										id: 'recdate'+'_end',
										hideLabel: true, width: 125,
										format: 'Y-m-d', minValue: '2000-01-01', emptyText: '结束时间'
									})
		            			]
		            		}
	            		]
	            	}
				]
	 		})
	 	],
	 	bbar: ['->',{
			id: 'query',
			text: '查询',
			tooltip: '查询',
			iconCls: 'btn',
			handler: execQuery1
		},'-']
	});
	
	    function execQuery1(){
    	var val = true;
    	var strSql = propertyName + "=" +propertyValue ;
    	var form = queryPanel1.getForm();
    	var recno = form.findField('recno').getValue();
    	var recunit = form.findField('recunit').getValue();
    	var recman = form.findField('recman').getValue();
    	var pleRecdate_begin = form.findField('pleRecdate_begin').getValue();
    	var pleRecdate_end = form.findField('pleRecdate_end').getValue();
    	var recdate_begin = form.findField('recdate_begin').getValue();
    	var recdate_end = form.findField('recdate_end').getValue();
    	if (recno != '' && recno != null){
    		strSql += " and recno like '%"+recno+"%'";
    	}
    	if (recunit != '' && recunit != null){
    		strSql += " and recunit like '%"+recunit+"%'";
    	}
    	if (recman != '' && recman != null){
    		strSql += " and recman like '%"+recman+"%'";
    	}
    	if('' == pleRecdate_begin && '' != pleRecdate_end){
   			strSql += " and ( pleRecdate" + " <= to_date('" + formatDate(pleRecdate_end) + "','YYYY-MM-DD'))";
   		} else if ('' != pleRecdate_begin && "" == pleRecdate_end){
	   		strSql += " and ( pleRecdate" + " >= to_date('" + formatDate(pleRecdate_begin) + "','YYYY-MM-DD'))";
	   	} else if ('' != pleRecdate_begin && '' != pleRecdate_end){
			if (pleRecdate_begin > pleRecdate_end){
				Ext.example.msg('提示！','开始时间应该小于等于结束时间！');
				val = false; 
			} else {
				strSql += " and ( pleRecdate"
						+ " between to_date('" + formatDate(pleRecdate_begin) + "','YYYY-MM-DD')" 
						+ " and to_date('" + formatDate(pleRecdate_end)+ "','YYYY-MM-DD'))"; 
				
			}
	    }
	     if('' == recdate_begin && '' != recdate_end){
   			strSql += " and ( recdate" + " <= to_date('" + formatDate(recdate_end) + "','YYYY-MM-DD'))";
   		} else if ('' != recdate_begin && "" == recdate_end){
	   		strSql += " and ( recdate" + " >= to_date('" + formatDate(recdate_begin) + "','YYYY-MM-DD'))";
	   	} else if ('' != recdate_begin && '' != recdate_end){
			if (recdate_begin > recdate_end){
				Ext.example.msg('提示！','开始时间应该小于等于结束时间！');
				val = false; 
			} else {
				strSql += " and ( recdate"
						+ " between to_date('" + formatDate(recdate_begin) + "','YYYY-MM-DD')" 
						+ " and to_date('" + formatDate(recdate_end)+ "','YYYY-MM-DD'))"; 
				
			}
	    }
	    if (val){
	    	with(ds){
	    		baseParams.params = strSql;
	    		load({
   					params : {
						start : 0,
						limit : PAGE_SIZE
					},
   					callback: function(){ queryWin.hide(); }
   				});
	    	}
	    }
    }
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////从表表查询部分
  function doQueryAdjunct2(){
		if (!queryWin2) {
			queryWin2 = new Ext.Window({
				title: '查询数据',
				width: 450, height: 330,
				layout: 'fit',
				iconCls: 'option',
				closeAction: 'hide',
				border: true,
				constrain: true,
				maximizable: false,
				resizable: false,
				modal: false,
				items: [queryPanel2]
			});
		}
		queryPanel2.getForm().reset();
		queryWin2.show();
	}
	var queryPanel2 = new Ext.form.FormPanel({
        border: false, autoScroll: true,
		bodyStyle: 'padding: 10px 10px; border:0px;',
		labelAlign: 'right', layout: 'form',
	 	items: [
	 		new Ext.form.FieldSet({
	 			title: '关键字',
	 			layout: 'form',
	 			border: true,
	 			items: [
	 				new fm.TextField(fcsub['sbmc']),
	 				new fm.TextField(fcsub['ggxh']),
	 				new fm.TextField(fcsub['sccj']),
	 				new fm.TextField(fcsub['box_no']),
	 				new fm.TextField(fcsub['part_no']),
	 				new fm.ComboBox({
	            		name: 'wztype',
						fieldLabel: '物资类别', emptyText : '请选择...',
						typeAhead: true, 
						valueField: 'k', displayField: 'v',
						mode: 'local', triggerAction: 'all',
			            store: combox_wztype,lazyRender: true, editable: false,
			            listClass: 'x-combo-list-small',
						anchor: '95%'
	            	}),new fm.ComboBox({
	            		name: 'machineNo',
						fieldLabel: '机组号', emptyText : '请选择...',
						typeAhead: true,  
						valueField: 'k', displayField: 'v',
						mode: 'local', triggerAction: 'all',
			            store: dsJzh,lazyRender: true, editable: false,
			            listClass: 'x-combo-list-small',
						anchor: '95%'
	            	})
	 				
				]
	 		})
	 	],
	 	bbar: ['->',{
			id: 'query',
			text: '查询',
			tooltip: '查询',
			iconCls: 'btn',
			handler: execQuery2
		},'-']
	});
	
function execQuery2(){
    	var val = true;
    	var strSql = propertyName + "=" +propertyValue;
    	var form = queryPanel2.getForm();
    	var sbmc = form.findField('sbmc').getValue();
    	var ggxh = form.findField('ggxh').getValue();
    	var sccj = form.findField('sccj').getValue();
    	var box_no = form.findField('box_no').getValue();
    	var part_no = form.findField('part_no').getValue();
    	var wztype = form.findField('wztype').getValue();
    	var machineNo = form.findField('machineNo').getValue();
    	if (sbmc != '' && sbmc != null){
    		strSql += " and sbmc like '%"+sbmc+"%'";
    	}
    	if (ggxh != '' && ggxh != null){
    		strSql += " and ggxh like '%"+ggxh+"%'";
    	}
    	if (sccj != '' && sccj != null){
    		strSql += " and sccj like '%"+sccj+"%'";
    	}
    	if (box_no != '' && box_no != null){
    		strSql += " and box_no like '%"+box_no+"%'";
    	}
    	if (part_no != '' && part_no != null){
    		strSql += " and part_no like '%"+part_no+"%'";
    	}
    	if (wztype != '' && wztype != null){
    		strSql += " and wztype like '%"+wztype+"%'";
    	}
    	if (machineNo != '' && machineNo != null){
    		strSql += " and machineNo like '%"+machineNo+"%'";
    	}
    	if(selectedGgId!=''){
    	   strSql += " and recid ='"+selectedGgId+"'";
    	}else {
    	   strSql += " and recid is null";
    	}
	    if (val){
	    	with(dsSub){
	    		baseParams.params = strSql;
	    		load({
   					params : {
						start : 0,
						limit : 20
					},
   					callback: function(){ queryWin2.hide(); }
   				});
	    	}
	    }
    }
	/*
	    var record = sm.getSelected();
	    var recordsub=smSub.getSelected();
	    recordsub = smSub.getSelections();
	    var ids = new Array(); 
	    var recid=record.get('recid');
	    if(recid!=null||recid!=''){
	    	if(smSub.hasSelection()){
	    		for (var i = 0; i < recordsub.length; i++) {
					ids.push(recordsub[i].get('RECSUBID'));
				}
				
				DWREngine.setAsync(false);
				equRecMgm.SaveRecSub(ids,recid)
				Ext.example.msg('保存成功！', '您成功保存了该条信息！');
				DWREngine.setAsync(true);
			
	    	}
	    }
	     getDLy();*/
	
	/*
	function selectWin(_selRecSubId, _storenum){
    	if (!selectWindow){
   			selectWindow = new Ext.Window({
				title: '更新设备出库',
				iconCls: 'btn',
				layout: 'fit',
				width: 850, height: 500,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true,
				listeners:{
					'hide':function(){
						sm.fireEvent('rowselect',catGridRowSelected);
					}
				}
			});
   		}
   		selectWindow.show();
   		selectWindow.load({
			url: BASE_PATH+'Business/equipment/viewDispatcher.jsp',
			params: 'pid='+PID+'&type=equrecedit&recsubid='+_selRecSubId+'&storenum='+_storenum
		});
    }	*/
    
	function RecWin(style){
    	if (!recWindow){
   			recWindow = new Ext.Window({
				title: '更新设备出库',
				iconCls: 'btn',
				layout: 'fit',
				width: 950, height: 500,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true
			});
   		}
   		recWindow.show();
   		if("add"==style){
	   		recWindow.load({
				url: BASE_PATH+'Business/equipment/viewDispatcher.jsp',
				params: 'pid='+CURRENTAPPID+'&type=equrecedit&conid=' + selectedConId
			});
   		}else if("update"==style){
   			recWindow.load({
   				url : BASE_PATH+'Business/equipment/viewDispatcher.jsp',
				params: "pid="+CURRENTAPPID+"&type=equrecedit&recid=" + sm.getSelections()[0].get("recid") + "&conid=" + selectedConId
			});
   		}
    }    
});
