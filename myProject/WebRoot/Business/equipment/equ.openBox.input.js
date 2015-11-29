/*
 * Ext JS Library 2.0 Beta 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 *   
 * http://extjs.com/license
 */
// 全局变量

var uuid;
var bean = "com.sgepit.pmis.equipment.hbm.EquOpenBox"
var beanSub = "com.sgepit.pmis.equipment.hbm.EquOpenBoxSub"
var beanPartyb = "com.sgepit.pmis.contract.hbm.ConPartyb";
var business = "baseMgm"
var listMethod = "findWhereOrderBy"
var primaryKey = "uuid"
var orderColumn = "boxno"
var formPanelTitle = "新增一条记录"
var SPLITB = "`"
var pid = CURRENTAPPID;
var bodyPanelTitle = "合同：" + conname + "，编号：" + conno + " - 所有开箱记录";
var selectWindow;
var selectedGgId;
var jzhType = new Array();
var jzhType2 = new Array();
var wzType = new Array();
var formWindow;
var data = new Array();
var data_sub = new Array();
var data_rec = new Array();
var partBs= new Array();
var dsSub;
var queryWin,queryWin2;
var kxState='';
var billTypes = new Array();
var flowWindow;

Ext.onReady(function (){
	if(isFlwTask == true || isFlwTask == "true"){
		DWREngine.setAsync(false);
		baseMgm.getData("select boxno from equ_open_box where boxno='"+boxno+"'",function(obj){
			if(obj.length==0){
				var url = BASE_PATH+"Business/equipment/equ.openBox.addorupdate.jsp?";
				window.location.href = url + "&conno="+conno+"&conid="+conid+"&conname="+conname+"&partId="+partB+"&uuids="+uuids+"&isTask=true&boxno="+boxno;
			}
		})
		DWREngine.setAsync(true);
	}


	DWREngine.setAsync(false);
	appMgm.getCodeValue('机组号',function(list){         //获取机组号
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);	
				jzhType.push(temp);	
				jzhType2.push(temp);		
			}
	    });
	appMgm.getCodeValue('流程状态',function(list){         //流程审批状态
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);	
				billTypes.push(temp);	
			}
	    });
    appMgm.getCodeValue('设备类型',function(list){         //获取设备类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);		
			wzType.push(temp);	
		}
    });
    DWREngine.setAsync(true);
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
	    	disabled: true,
	    	handler: toHandler
	    },'EDIT': {
	    	id: 'edit',
	    	text: '修改',
	    	iconCls: 'btn',
	    	disabled: true,
	    	handler: toHandler
	    },'DEL': {
	    	id: 'dell',
	    	text: '删除',
	    	iconCls: 'multiplication',
	    	disabled: true,
	    	handler: toHandler
	    },'NOW': {
	    	id: 'now',
	    	text: '<font color=green>当前开箱申请</font>',
			pressed: true,
			iconCls: 'btn',
			hidden: true,
			handler: getNowData
	    },'DAI': {
	    	id: 'dai',
	    	text: '<font color=red>待开箱申请</font>',
			pressed: true,
			hidden: true,
			iconCls: 'btn',
			handler: getDaiData
	    },'OLD1': {
	    	id: 'old',
	    	text: '<font color=green>已申请开箱(处理中)</font>',
			pressed: true,
			iconCls: 'refresh',
			hidden: true,
			handler: getOldData1
	    },'OLD2': {
	    	id: 'old',
	    	text: '<font color=blue>已申请开箱（处理完毕）</font>',
			pressed: true,
			iconCls: 'finish',
			hidden: true,
			handler: getOldData2
	    },'ALL': {
	    	id: 'all',
	    	text: '<font color=red>所有开箱记录</font>',
			pressed: true,
			hidden: true,
			iconCls: 'btn',
			handler: getAllData
	    },'btnQuery':{
		   text: '查询',
		   iconCls: 'option',
		   handler: doQueryAdjunct1
          }
    };
    /**
     * @description 本页面一共有3种被调用的状态：
     * 		1、普通应用程序调用；
     * 		2、流程实例在流转中，任务节点调用；
     * 		3、流程实例被查看的时候调用；
     * @param isFlwTask = true 为第2种状态
     * @param isFlwView = true 为第3种状态
     * @param isFlwTask != true && isFlwView != true 为第1种状态
     */
    if (isFlwTask == true){
    	BUTTON_CONFIG['EDIT'].disabled = false;
    } else if (isFlwView == true){
    } else if (isFlwTask != true && isFlwView != true) {
    	BUTTON_CONFIG['ADD'].disabled = false;
    	BUTTON_CONFIG['EDIT'].disabled = false;
    	BUTTON_CONFIG['DEL'].disabled = false;
    }
	
	DWREngine.setAsync(false);
	conpartybMgm.getPartyB(function(list){         //获取乙方单位
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);			
			temp.push(list[i].partyb);		
			partBs.push(temp);			
		}
    });	
    DWREngine.setAsync(true);
    
    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType
    });   
    var dsJzh2 = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType2
    });       
	 var combox_wztype = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : wzType
    });
	// 1. 创建选择模式
    var sm =  new Ext.grid.CheckboxSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'uuid': {
			name: 'uuid',
			fieldLabel: '开箱主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'ggId': {
			name: 'ggId',
			fieldLabel: '到货批次',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'buildPart': {
			name: 'buildPart',
			fieldLabel: '供货单位',
			anchor:'95%'
         }, 'fixPart': {
			name: 'fixPart',
			fieldLabel: '安装单位',
			anchor:'95%'
         }, 'boxno': {
			name: 'boxno',
			fieldLabel: '开箱单号',
			anchor:'95%'
         },'opendate': {
			name: 'opendate',
			fieldLabel: '开箱日期',
			readOnly:true,
			width:60,
            format: 'Y-m-d',
            minValue: '2000-01-01',
            //allowBlank: false,
            readOnly:false,
			anchor:'95%'
         },'checkdate': {
			name: 'checkdate',
			fieldLabel: '到货日期',
			width:60,
            format: 'Y-m-d H:i:s',
            minValue: '2000-01-01',
            allowBlank: false,
			anchor:'95%'
         }, 'appearance': {
			name: 'appearance',
			fieldLabel: '外观记录', 
			//hidden:true,
			//hideLabel:true,
			anchor:'95%'
         }, 'openAddress': {
			name: 'openAddress',
			fieldLabel: '开箱地点', 
			//hidden:true,
			//hideLabel:true,
			anchor:'95%'
         },'equipment': {
			name: 'equipment',
			fieldLabel: '设备及附件外观质量情况',
			height:200, 
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'filedetail': {
			name: 'filedetail',
			fieldLabel: '质量证明文件， 技术资料',
			height:200, 
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'problems': {
			name: 'problems',
			fieldLabel: '存在的问题及处理意见 ',
			height:200, 
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'comments': {
			name: 'comments',
			fieldLabel: '开箱检验评定 ',
			height:200,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }  ,'partno': {
			name: 'partno',
			fieldLabel: '部件号 ',
			anchor:'95%'
         }  ,'box_no': {
			name: 'box_no',
			fieldLabel: '箱件号 ',
			anchor:'95%'
         } ,'bz': {
			name: 'bz',
			fieldLabel: '备注 ',
			anchor:'95%'
         } ,'jzh': {
			name: 'jzh',
			fieldLabel: '机组号 ',
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
         } ,'sysbh': {
			name: 'sysbh',
			fieldLabel: '系统 ',
			anchor:'95%'
         } ,'sysmc': {
			name: 'sysmc',
			fieldLabel: '系统名称 ',
			anchor:'95%'
         }  ,'sbmc': {
			name: 'sbmc',
			fieldLabel: '到货设备概述',
			anchor:'95%'
         }  ,'jsbm': {
			name: 'jsbm',
			fieldLabel: '到货编号',
			anchor:'95%'
         }  ,'ggxh': {
			name: 'ggxh',
			fieldLabel: '规格型号',
			anchor:'95%'
         } ,'wztype': {
			name: 'wztype',
			fieldLabel: '物资类别',
			anchor:'95%'
         } ,'sbid': {
			name: 'sbid',
			fieldLabel: 'id',
			anchor:'95%'
         } ,'billstate': {
            name: 'billstate',
			fieldLabel: '流程状态',
			anchor:'95%'
         },
         'kxzt': { name: 'kxzt',fieldLabel: '开箱状态',anchor:'95%'},         
         'ghfwys': { name: 'ghfwys',fieldLabel: '供货范围验收',anchor:'95%'},         
         'qdys': { name: 'qdys',fieldLabel: '清单验收',anchor:'95%'},         
         'zlys': { name: 'zlys',fieldLabel: '资料验收',anchor:'95%'},         
         'hjdwjry': { name: 'hjdwjry',fieldLabel: '会检单位及人员',anchor:'95%'}    
    }
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,{
           id:'uuid',
           header: fc['uuid'].fieldLabel,
           dataIndex: fc['uuid'].name,
           hidden: true        
        },{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,  
           hidden: true      
        },{
           id:'boxno',
           header: fc['boxno'].fieldLabel,
           dataIndex: fc['boxno'].name,
//           renderer: renderBoxno,
//           editor:new Ext.form.TextField(fc['boxno']),
           width: 160
        },{
           header: fc['openAddress'].fieldLabel,
           dataIndex: fc['openAddress'].name,
           //editor:new Ext.form.TextField(fc['openAddress']),
           width: 120
          // css : 'background: pink;'
        },{
           header: fc['opendate'].fieldLabel,
           dataIndex: fc['opendate'].name,
           //editor:new Ext.form.DateField(fc['opendate']),
           width: 120,
           //css : 'background: pink;',
           renderer:formatDate
        },{
           id:'wztype',
           header: fc['wztype'].fieldLabel,
           dataIndex: fc['wztype'].name,
           renderer:wztypeRender,hidden:true,
           width: 100
        },{
           id:'sbmc',
           header: fc['sbmc'].fieldLabel,
           dataIndex: fc['sbmc'].name,
           width: 150
        },{
           id:'ggxh',
           header: fc['ggxh'].fieldLabel,
           dataIndex: fc['ggxh'].name,
           width: 100,
           hidden: true  
        },{
           id:'jsbm',
           header: fc['jsbm'].fieldLabel,
           dataIndex: fc['jsbm'].name,
           width: 100,
           hidden: true  
        },{
           header: fc['checkdate'].fieldLabel,
           dataIndex: fc['checkdate'].name,
           width: 120,
           renderer:formatDate
        },{
           id:'jzh',
           header: fc['jzh'].fieldLabel,
           dataIndex: fc['jzh'].name,
          // editor: new Ext.form.ComboBox(fc['jzh']),           
           renderer:jzhRender,
           width: 100,
           hidden: true  
        },{
           id:'box_no',
           header: fc['box_no'].fieldLabel,
           dataIndex: fc['box_no'].name,
           width: 100
        },{
           id:'partno',
           header: fc['partno'].fieldLabel,
           dataIndex: fc['partno'].name,hidden:true,
           width: 100
        },{
           id:'ggId',
           header: fc['ggId'].fieldLabel,
           dataIndex: fc['ggId'].name,
           hidden: true
        },{
           id:'sysbh',
           header: fc['sysbh'].fieldLabel,
           dataIndex: fc['sysbh'].name,
           //editor:new Ext.form.TextField(fc['sysbh']),
           width: 100
        },{
           id:'buildPart',
           header: fc['buildPart'].fieldLabel,
           dataIndex: fc['buildPart'].name,
           renderer:partbRender,
           width: 250
        },
        {id:'kxzt',  header: fc['kxzt'].fieldLabel, dataIndex: fc['kxzt'].name,
        	renderer:function (value){//（0申请开箱，1开箱检验，2通过检验，3未通过检验）
        		if(value==0){return "申请开箱"}
        		if(value=1){return "开箱检验"}
        		if(value==2){return "通过检验"}
        		if(value==3){return "未通过检验"}
        	},hidden:true
        },	
        {id:'ghfwys',  header: fc['ghfwys'].fieldLabel, dataIndex: fc['ghfwys'].name,hidden:true },	
        {id:'qdys',  header: fc['qdys'].fieldLabel, dataIndex: fc['qdys'].name,hidden:true },	
        {id:'zlys',  header: fc['zlys'].fieldLabel, dataIndex: fc['zlys'].name,hidden:true },	
        {id:'hjdwjry',  header: fc['hjdwjry'].fieldLabel, dataIndex: fc['hjdwjry'].name,hidden:true },	
        {
           id:'fixPart',
           header: fc['fixPart'].fieldLabel,
           dataIndex: fc['fixPart'].name,
           hidden: true
        },{
           header: fc['appearance'].fieldLabel,
           dataIndex: fc['appearance'].name,
           //editor:new Ext.form.TextField(fc['appearance']),
           width: 80
        },{
           header: fc['equipment'].fieldLabel,
           dataIndex: fc['equipment'].name,
           hidden: true, 
           width: 120
        },{
           header: fc['filedetail'].fieldLabel,
           dataIndex: fc['filedetail'].name,
           hidden: true, 
           width: 120
        },{
           header: fc['problems'].fieldLabel,
           dataIndex: fc['problems'].name,
           hidden: true, 
           width: 120
        },{
           header: fc['comments'].fieldLabel,
           dataIndex: fc['comments'].name,
           //editor:new Ext.form.TextField(fc['comments']),
           width: 120
        },{
           header: fc['pid'].fieldLabel,
           dataIndex: fc['pid'].name,
           width: 90,
           hidden:true
        },{
           header: fc['sbid'].fieldLabel,
           dataIndex: fc['sbid'].name,
           width: 90,
           hidden:true
        },{
           id:'billstate',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           width: 120,hidden:false,
           renderer:billTypeRender
        }
      
    ]);
    cm.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},
    	{name: 'uuid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'boxno', type: 'string'},
		{name: 'ggId', type: 'string'},
		{name: 'opendate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'checkdate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'appearance', type: 'string'},
		{name: 'equipment', type: 'string'},
		{name: 'filedetail', type: 'string'},
		{name: 'problems', type: 'string'},
		{name: 'buildPart', type: 'string'},
		{name: 'fixPart', type: 'string'},
		{name: 'openAddress', type: 'string'},
		{name: 'comments', type: 'string'},
		{name: 'partno', type: 'string'},
		{name: 'box_no', type: 'string'},
		{name: 'bz', type: 'string'},
		{name: 'jzh', type: 'string'},
		{name: 'sysbh', type: 'string'},
		{name: 'sysmc', type: 'string'},
		{name: 'sbmc', type: 'string'},
		{name: 'jsbm', type: 'string'},
		{name: 'ggxh', type: 'string'},
		{name: 'wztype', type: 'string'},
		{name: 'sbid', type: 'string'},
		{name: 'billstate', type: 'string'},
		{name: 'kxzt', type: 'float'},
		{name: 'ghfwys', type: 'string'},
		{name: 'qdys', type: 'string'},
		{name: 'zlys', type: 'string'},
		{name: 'hjdwjry', type: 'string'}
		];
		
		var Plant = Ext.data.Record.create(Columns);			//定义记录集   	
	 
		 var PlantInt = {
		 	uuid:'',
		 	conid:'',
		 	pid: CURRENTAPPID,
		 	boxno:'',
		 	ggId:'',
		 	opendate:'',
		 	checkdate:'',
		 	appearance:'',
		 	equipment:'',
		 	filedetail:'',
		 	problems:'',
		 	buildPart:'',
		 	box_no:'',
		 	openAddress:'',
		 	comments:'',
		 	partno:'',
		 	bz:'',
		 	jzh:'',
		 	sysbh:'',
		 	sysmc:'',
		 	sbmc:''
		 }		
        
    // 4. 创建数据源
    var kxdfilter = "conid='"+conid+"'"
    if (isFlwTask == true || isFlwView == true){
    	kxdfilter = kxdfilter + " and boxno = '"+boxno+"'"
    }
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: kxdfilter
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    grid = new Ext.grid.EditorGridTbarPanel({
        // basic properties
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [BUTTON_CONFIG['ADD'],'-',BUTTON_CONFIG['EDIT'],'-',BUTTON_CONFIG['DEL']],	
        border: false,				// 
        region: 'center',
        width:1000,
        title: bodyPanelTitle,
        header: true,
        delBtn : false, // 是否显示删除按钮
        addBtn : false, // 是否显示新增按钮				
        saveBtn: false,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        enableDragDrop: true,       //一旦选中某行，就不能取消选中，除非选中其他行
        animCollapse: false,		//折叠时显示动画
//      autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        stripeRows:true, 
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE3,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: 'uuid',
      	//saveHandler: saveOpenBoxHandler,
      	deleteHandler: deleteOpenBoxHandler,
      	listeners: {
      		afteredit: function(e){
      			if (isFlwTask == true){
					if (boxno != null && boxno != ''){
						e.record.set('boxno', boxno);
					}
					   e.record.set('billstate', 1);
      			}
      		},
      		aftersave: function(){
      			if (g_funname.indexOf('开箱主表') != -1) {
      				if (isFlwTask == true){
						Ext.Msg.show({
							title: '您成功维护了设备开箱信息！',
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
      	}
	});
	
	 ds.on('load',function(_store,_records,_obj){
    	DWREngine.setAsync(false);
    	for(var i=0;i<_records.length;i++){
    		baseMgm.getData("select * from equ_open_box_sub where open_id ='"+ _records[i].data.uuid+"'" ,function(_list){
    			if(_list.length == 0) {Ext.DomHelper.applyStyles(grid.getView().getRow(i),"background-color:#99CCFF");}
    		})
    	}
    	DWREngine.setAsync(true);
    })
    
    

    
	function toHandler(){
		var state = this.id;
		if ("" != state){
			Ext.get('loading-mask').show();
			Ext.get('loading').show();
		    if ("menu_flow" == state){
				Ext.get('loading-mask').hide();
				Ext.get('loading').hide();
				var _boxno = this.boxno;
				baseDao.findByWhere2("com.sgepit.webpmis.domain.flow.InsDataInfoView", "paramvalues like '%boxno:"+_boxno+"%' and funname ='设备开箱主表信息录入'", function(list){
					if (list.length > 0){
						showFlow(list[0].insid);
					} else {
						Ext.example.msg('提示', '该设备没有走开箱流程！');
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
 
	function deleteOpenBoxHandler(){
		if (sm.getSelections().length == 1){
    		openBoxMgm.checkDelete(selectedGgId, function(flag){
    			if('不能删除' == flag){
    				Ext.example.msg('提示','该开箱的设备已经被领用了，不能删除!')
    				return;
    			}
				Ext.Msg.show({
					title: '提示',
					msg: ("" == flag) ? '是否要删除?　　　　' : flag,
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
							//Ext.get('loading-mask').show();
							//Ext.get('loading').show();
							openBoxMgm.delOpenBox(selectedGgId, function(){
								//Ext.get('loading-mask').hide();
								//Ext.get('loading').hide();
								Ext.example.msg('删除成功！', '您成功删除了一条到货信息！');
								ds.load({
									callback: function(){
										if (ds.getCount() > 0){
											sm.selectRow(0);
										}else{
											dsSub.removeAll();
										}
									}
								});
							});		
						}
					}
				});
			})
		} else {
			Ext.example.msg('提示', '请选择一个开箱主表记录进行删除！');
		}   		
	}
	
	
    //右键菜单
	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	//grid.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("conid");
		var boxno = record.get("boxno");
		gridMenu.removeAll();
	    gridMenu.addMenuItem({
	    	id: 'menu_flow',
            text: '　流程信息',
            boxno: boxno,
            iconCls: 'flow',
            handler : toHandler
	    });
	    gridMenu.showAt(e.getXY());
	}
	
	
 	function contextmenu(grid, rowIndex, e){
		e.stopEvent();
		var record = grid.getStore().getAt(rowIndex);
		var uuid = record.get("uuid");
		
	    var gridMenu = new Ext.menu.Menu({
	        id: 'gridMenu',
	        items: [{
	        			id: 'menu_add',
		                text: '　新增',
		                value: conid,
		                iconCls: 'add',
		                handler : toHandler
                    },{
                    	id: 'menu_edit',
		                text: '　修改',
		                value: uuid,
		                iconCls: 'btn',   
		                handler : toHandler
                    },{
                    	id: 'menu_del',
		                text: '　删除',
		                value: uuid,
		                iconCls: 'multiplication',
		                handler : toHandler
                	}, '-', {
	        			id: 'menu_view',
		                text: '　查看',
		                value: uuid,
		                iconCls: 'form',
		                handler : toHandler
                    }]
	    });
	    gridMenu.showAt( e.getXY());
	}

	function toHandler(){
		
			var state = this.id;
			var url = BASE_PATH+"Business/equipments/equ.openBox.addorupdate.jsp?";
			if ("" != state){
			    if ("menu_view" == state){
			    	window.location.href = BASE_PATH+ "Business/equipment/equ.openBox.view.jsp?uuid="+this.value+"&conname=" 
			    		+conname+"&ggNo=" +ggNo
				}
				if ("menu_add" == state||"add"==state){
					var url = BASE_PATH+"Business/equipment/equ.openBox.addorupdate.jsp?";
					window.location.href = url + "&conno="+conno+"&conid="+conid + "&conname=" + conname +"&partId=" + partB + "&uuids=" + uuids;
				}
				if ("menu_edit" == state||"edit"==state){
					if(sm.getSelections().length>0){
						var url = BASE_PATH+"Business/equipment/equ.openBox.addorupdate.jsp?";
						if(isFlwTask == true){
							url = url + "isTask=true&boxno="+boxno
						}
						if(isFlwView == true){
							url = url + "isView=true&boxno="+boxno
						}
						
						//window.location.href = url + "conid="+conid + "&conname=" + conname +"&partId=" + partId + "&uuid=" + this.value ;
						window.location.href = url + "&conno="+conno+"&conid="+conid + "&conname=" + conname +"&partId=" + partB + "&uuid=" + sm.getSelections()[0].get("uuid");
					}else{
						Ext.Msg.show({
			   				title: '提示',
				            msg: '请先选择需要修改的开箱记录！',
				            icon: Ext.Msg.WARNING, 
				            buttons: Ext.MessageBox.OK
			   			});
					}				
				}
				//主表删除
				if ("menu_del" == state||"del"==state){
					if(sm.getSelections().length>0){
						var uuid = sm.getSelections()[0].get("uuid");
						Ext.Msg.show({
							title: '提示',
							msg: '是否要删除?　　　　',
							buttons: Ext.Msg.YESNO,
							icon: Ext.MessageBox.QUESTION,
							fn: function(value){
								if ("yes" == value){
									var sbids = new Array();
									baseMgm.getData("select sb_id from equ_open_box_sub where open_id='"+selectedGgId+"'",function(list){
										sbids = list;
									})
									//删除主表时级联删除从表
									openBoxMgm.delOpenBox(uuid, function(){
										//window.location.reload();
										ds.load({
											callback: function(){
												if (ds.getCount() > 0){
													sm.selectRow(0);
												}else{
													dsSub.removeAll();
												}
												//2010-12-22 删除开箱主表时，级联更新从表，执行更新总开箱验收数量
												for(var i=0;i<sbids.length;i++){
													var sumSql = "select sum(opensl) from equ_open_box_sub where sb_id='"+sbids[i]+"' and open_id in (select uuid from equ_open_box t where conid='"+conid+"')"
										   			var sql = "update equ_list set yszsl=("+sumSql+") where conid='"+conid+"' and sb_id='"+sbids[i]+"'";
										   			//document.write(sql)
										   			baseDao.updateBySQL(sql,function(str){
										   			//	alert(str)
										   			})
									   			}
											}
										});
									}); 
								}
							}
						});
					}else{
						Ext.Msg.show({
			   				title: '提示',
				            msg: '请先选择需要删除的开箱记录！',
				            icon: Ext.Msg.WARNING, 
				            buttons: Ext.MessageBox.OK
			   			});
					}
				}else{return}
			}
		
	}

	//----------------------------------------------------从表相关
	var fcSub = {
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true
		},
		'openId' : {
			name : 'openId',
			fieldLabel : '主表主键',
			hidden : true,
			hideLabel : true
		},
		'sbId' : {
			name : 'sbId',
			fieldLabel : '设备主键',
			hidden : true,
			hideLabel : true
		},
		'sbbm' : {
			name : 'sbbm',
			fieldLabel : '设备编码',
			anchor : '95%'
		},
		'sbbmc' : {
			name : 'sbbmc',
			fieldLabel : '设备名称',
			anchor : '95%'
		},
		'ggxh' : {
			name : 'ggxh',
			fieldLabel : '规格型号',
			anchor : '95%'
		},
		'sl' : {
			name : 'sl',
			fieldLabel : '总到货数量',
			anchor : '95%'
		},
		'dw' : {
			name : 'dw',
			fieldLabel : '单位',
			anchor : '95%'
		},
		'sccj' : {
			name : 'sccj',
			fieldLabel : '生产厂家',
			anchor : '95%'
		},
		'getgoodsDiff' : {
			name : 'getgoodsDiff',
			fieldLabel : '到货与合同差异',
			anchor : '95%'
		},
		'slDiff' : {
			name : 'slDiff',
			fieldLabel : '与装箱单数量差异',
			anchor : '95%'
		},
		'outshow' : {
			name : 'outshow',
			fieldLabel : '外观状况',
			anchor : '95%'
		},
		'process' : {
			name : 'process',
			fieldLabel : '处理意见',
			anchor : '95%'
		},
		'pictureno' : {
			name : 'pictureno',
			fieldLabel : '照片编号',
			anchor : '95%'
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同编号',
			anchor : '95%'
		},
		'opensl' : {
			name : 'opensl',	
			fieldLabel : '当前验收数量',		
			anchor : '95%'
		},'yssl' : {
			name : 'yssl',
			fieldLabel : '总验收数量',
			anchor : '95%'
		},'jzh' : {
			name: 'jzh',
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
		},'dz': {
			name: 'dz',
			fieldLabel: '当前单重(kg)',
			anchor:'95%'
         },'zz': {
			name: 'zz',
			fieldLabel: '当前总重(kg)',
			anchor:'95%'
         }
	}
	
	var smSub =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})   //  创建选择模式	
	
	var cmSub = new Ext.grid.ColumnModel([
		smSub,{
			id:'uuid',
			header:fcSub['uuid'].fieldLabel,
			dataIndex: fcSub['uuid'].name,
			hidden:true
		},{
			id:'pid',
			header:fcSub['pid'].fieldLabel,
			dataIndex: fcSub['pid'].name,
			hidden:true
		},{
			id:'openId',
			header:fcSub['openId'].fieldLabel,
			dataIndex: fcSub['openId'].name,
			hidden:true
		},{
			id:'sbId',
			header:fcSub['sbId'].fieldLabel,
			dataIndex: fcSub['sbId'].name,
			hidden:true
		},{
			id:'sbbm',
			header:fcSub['sbbm'].fieldLabel,
			dataIndex: fcSub['sbbm'].name,
			hidden:true
		},{
			id:'sbbmc',
			header:fcSub['sbbmc'].fieldLabel,
			dataIndex: fcSub['sbbmc'].name
		},{
			id:'ggxh',
			header:fcSub['ggxh'].fieldLabel,
			dataIndex: fcSub['ggxh'].name
		},{
			id:'dw',
			header:fcSub['dw'].fieldLabel,
			width:60,
			dataIndex: fcSub['dw'].name
		},{
			id:'sl',
			header:fcSub['sl'].fieldLabel,
			width:80,//hidden:true,
			dataIndex: fcSub['sl'].name,
			renderer : function(value,cell,record){
				var dhzsl = 0;
				DWREngine.setAsync(false);
           		baseMgm.getData("select dhzsl from equ_list t where sb_id='"+record.get('sbId')+"'",function(str){
           			if(str!=null && str!="")dhzsl = str;
           		})
           		DWREngine.setAsync(true);
           		return dhzsl;
			}
		},{
		   //id:'dhsl',
		   header : '当前到货数量',
           //dataIndex: 'dhsl',
           renderer : function(value,cell,record){
           		var dhsl=0;
           		DWREngine.setAsync(false);
           		baseMgm.getData("select dhsl from equ_sbdh_arr t where sb_id='"+record.get('sbId')+"' and dh_id=(select gg_id from equ_open_box t where uuid='"+record.get('openId')+"')",function(str){
           			if(str!=null && str!="")dhsl = str;
           		})
           		DWREngine.setAsync(true);
           		return dhsl;
           },
           width: 80
		},{
			id:'opensl',
			header:fcSub['opensl'].fieldLabel,
			width:80,
			css : 'background: #FFFFCC;',
			dataIndex: fcSub['opensl'].name,
			editor:new Ext.form.NumberField(fcSub['opensl'])
		},{
           header: fcSub['yssl'].fieldLabel,
           dataIndex: fcSub['yssl'].name,
           renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
           		var yszsl=0;
           		DWREngine.setAsync(false);
           		baseMgm.getData("select yszsl from equ_list where conid='"+conid+"' and sb_id='"+record.get('sbId')+"'",function(str){
           			if(str!=null && str!="")yszsl = str;
           		})
           		DWREngine.setAsync(true);
           		return yszsl;
           },
           width: 80
		},{
           header: fcSub['zz'].fieldLabel,
           dataIndex: fcSub['zz'].name,
           width: 80
        },{
           header: fcSub['dz'].fieldLabel,
           dataIndex: fcSub['dz'].name,
           editor: new Ext.form.NumberField(fcSub['dz']),
           css : 'background: pink;', 
           width: 80
        },{
			id:'jzh',
			header:fcSub['jzh'].fieldLabel,
			dataIndex: fcSub['jzh'].name,
            renderer: jzhRender,hidden:true,
            editor: new Ext.form.ComboBox(fcSub['jzh']),
            width:100
		},{
			id:'sccj',
			header:fcSub['sccj'].fieldLabel,
			dataIndex: fcSub['sccj'].name,hidden:true,
			width:150
		},{
			id:'getgoodsDiff',
			header:fcSub['getgoodsDiff'].fieldLabel,
			dataIndex: fcSub['getgoodsDiff'].name,
			width:120,
			editor:new Ext.form.TextField(fcSub['getgoodsDiff'])
		},{
			id:'slDiff',
			header:fcSub['slDiff'].fieldLabel,
			dataIndex: fcSub['slDiff'].name,
			width:150,
			editor:new Ext.form.NumberField(fcSub['slDiff'])
		},{
			id:'outshow',
			header:fcSub['outshow'].fieldLabel,
			dataIndex: fcSub['outshow'].name,
			editor:new Ext.form.TextField(fcSub['outshow'])
		},{
			id:'process',
			header:fcSub['process'].fieldLabel,
			dataIndex: fcSub['process'].name,
			editor:new Ext.form.TextField(fcSub['process'])
		},{
			id:'pictureno',
			header:fcSub['pictureno'].fieldLabel,
			dataIndex: fcSub['pictureno'].name,hidden:true,
			editor:new Ext.form.TextField(fcSub['pictureno'])
		},{
			id:'conid',
			header:fcSub['conid'].fieldLabel,
			dataIndex: fcSub['conid'].name,hidden:true
		}
	]);	
	cmSub.defaultSortable = true;
	
	 var ColumnsSub = [
	 	{name:'uuid',type:'string'},
	 	{name:'pid',type:'string'},
	 	{name:'openId',type:'string'},
	 	{name:'sbId',type:'string'},
	 	{name:'sbbm',type:'string'},
	 	{name:'sbbmc',type:'string'},
	 	{name:'ggxh',type:'string'},
	 	{name:'sl',type:'float'},
	 	{name:'dw',type:'string'},
	 	{name:'sccj',type:'string'},
	 	{name:'getgoodsDiff',type:'string'},
	 	{name:'slDiff',type:'float'},
	 	{name:'outshow',type:'string'},
	 	{name:'process',type:'string'},
	 	{name:'pictureno',type:'string'},
	 	{name:'conid',type:'string'},
	 	{name:'opensl',type:'float'},
	 	{name:'yssl',type:'float'},
	 	{name:'jzh',type:'string'},
	 	{name: 'dz', type: 'float'},
		{name: 'zz', type: 'float'}
	 ]
	 // 4. 创建数据源
     dsSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanSub,				
	    	business: business,
	    	method: listMethod
//	    	params: "openId"+SPLITB+""
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'uuid'
        }, ColumnsSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsSub.setDefaultSort('sbbm', 'asc');
	 var PlantSub = Ext.data.Record.create(ColumnsSub);			//定义记录集   	
	 
	 var PlantIntSub = {
	 	uuid:'',
	 	pid: CURRENTAPPID,
	 	openId:'',
	 	sbId:'',
	 	sbbm:'',
	 	sbbmc:'',
	 	ggxh:'',
	 	sl:'',
	 	dw:'',
	 	sccj:'',
	 	getgoodsDiff:'',
	 	outshow:'',
	 	process:'',
	 	pictureno:'',
	 	conid:'',
	 	opensl:0,
	 	yssl:0
	 }

 	
    
	var equSelect = new Ext.Button({
    	text: '选择设备或部件',
    	iconCls: 'add',
    	handler: function(){
    		if (sm.getSelections().length > 0){
    			if (sm.getSelections().length == 1){
          baseMgm.getData("select * from equ_open_box where uuid = '"+ selectedGgId+"'" ,function(_list){
    		     selectWin(conid, conname, conno, selectedGgId,_list[0].GG_ID,_list[0].SBID);
		});
	    		} else {
	    			Ext.Msg.show({
	    				title: '提示',
			            msg: '<br>请在一个设备到货批次下新增开箱信息！',
			            icon: Ext.Msg.WARNING, 
			            width: 300,
			            buttons: Ext.MessageBox.OK
	    			})
	    		}
    		}
    	}
    });    
    
     var btnQuery2 = new Ext.Button({
		text: '查询',
		iconCls: 'option',
		disabled: true,
		handler: doQueryAdjunct2
	});
	
    // 5. 创建可编辑的grid
    var gridSub = new Ext.grid.EditorGridTbarPanel({
        ds: dsSub,						//数据源
        cm: cmSub,						//列模型
        sm: smSub,						//行选择模式
        height: 300,				//高
        border: false,				// 
        //tbar:[equSelect,'-'],
        tbar:['-'],
        region: 'south',
        addBtn : false,
        delBtn : false, 			// 是否显示删除按钮
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: false,				//
        frame: false,				//是否显示圆角边框
        autoScroll: true,			//自动出现滚动条   
        collapsed: false,
        collapsible: true,
        split:true,
       // animCollapse: false,		//折叠时显示动画
//        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
        enableDragDrop: true, 
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE3,
            store: dsSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: PlantSub,				
      	plantInt: PlantIntSub,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanSub,					
      	business: business,	
      	primaryKey: 'uuid',
      	saveHandler:openBoxSaveHandler,
      	deleteHandler:openBoxDeleteHandler
   });    
   
  var s_opensl=0;
  gridSub.on('beforeedit',function(e){
	   	s_opensl=e.record.data.opensl;
 		if('opensl' == e.field){
 		   if(e.record.data.opensl=="0"){
 			  e.record.set("opensl","");}
 		}
 		if('dz' == e.field){
 		    if(e.record.data.dz=="0"){
 			   e.record.set("dz","");}	
 	    }
   })  
   gridSub.on('afteredit',function(e){
 		if('opensl' == e.field){                             //opensl：当前到货数量//当前验收数量
 			var _change = -(e.value*1 - e.originalValue*1);
 			var _sl = e.record.data.sl                        //sl:总到货数量
 			var _dz = e.record.data.dz;
 			var _opensl = e.record.data.opensl;
 			e.record.set("zz",_dz*_opensl);
 		}
 		if('dz' == e.field){
 			var _dz = e.record.data.dz;
 			var _opensl = e.record.data.opensl;
 			e.record.set("zz",_dz*_opensl);
 		}
   })
   
  
   function openBoxSaveHandler(){
   		var records = dsSub.getModifiedRecords();
   		var flw_flag = true;
   		if(records.length==0)return;
   		for(var i = 0;i<records.length;i++){ 
   			DWREngine.setAsync(false);
   			var dhsl = 0
     		baseMgm.getData("select dhsl from equ_sbdh_arr t where sb_id='"+records[i].get('sbId')+"' and dh_id=(select gg_id from equ_open_box t where uuid='"+records[i].get('openId')+"')",function(str){
     			if(str!=null && str!="")dhsl = str;
     		})
     		DWREngine.setAsync(true);
     		
     		if(records[i].get('opensl')>dhsl){
     			Ext.Msg.show({
	   				title: '提示',
		            msg: '设备'+records[i].get('sbbmc')+'的验收数量不能大于到货数量！',
		            icon: Ext.Msg.WARNING, 
		            buttons: Ext.MessageBox.OK
	   			});
	   			flw_flag = false;
				break;
     		}
   		  		
   			DWREngine.setAsync(false);
   			openBoxMgm.saveOpenBoxSub(records[i].data,function(state){
	   			if(state!=""){
	   				Ext.example.msg('提示',state);	
	   				dsSub.reload();
	   				return;
	   			}else{
	   				Ext.example.msg('提示','成功保存了该设备信息');
	   			}
   			});
   			
   			//更新清单中验收总数量
   			var sumSql = "select sum(opensl) from equ_open_box_sub where sb_id='"+records[i].get('sbId')+"' and open_id in (select uuid from equ_open_box t where conid='"+conid+"')"
   			var sql = "update equ_list set yszsl=("+sumSql+") where conid='"+conid+"' and sb_id='"+records[i].get('sbId')+"'";
   			//document.write(sql)
   			baseDao.updateBySQL(sql,function(str){
   			//	alert(str)
   			})
   			DWREngine.setAsync(true);
   		}
   		
   		dsSub.commitChanges();
   		if (isFlwTask == true && flw_flag == true){
			Ext.Msg.show({
				title: '您成功维护了设备开箱信息！',
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
   
   function openBoxDeleteHandler(){
   		var records = smSub.getSelections();
   		var arrids = new Array();
   		for(var i = 0;i<records.length;i++){
   			arrids.push(records[i].data.sbId)
   		}
   		openBoxMgm.checkDeleteOpenSub(arrids,function(_str){
   			if("" != _str)Ext.example.msg('提示,不能删除','您选择删除的设备中含有被领用的设备');
   			else gridSub.defaultDeleteHandler();
   		})
   }
   
   	function saveOpenBoxHandler(){	
   	var count=0;
		var editRecords = ds.getModifiedRecords();
		for (var i=0; i<editRecords.length; i++){
		openBoxMgm.changedhzt(editRecords[i].get('ggId'),editRecords[i].get('sbid'),editRecords[i].get('opendate'));
			if (editRecords[i].get('opendate') == ''|| editRecords[i].get('opendate') == 'null'|| editRecords[i].get('opendate') == null) {
			count+=1;
				openBoxMgm.deleteBoxno(editRecords[i].get('uuid'),function(){
				    ds.baseParams.params = "conid='"+conid+"' and boxno='"+boxno+"'";
		               ds.load({
		        	         params:{
		    	             start: 0,
		    	             limit: PAGE_SIZE3
	                               	}
	                           });
				}
				);
			}
		}
		if(count){Ext.example.msg('提示', '成功去掉了'+(editRecords.length)+'条开箱申请！');}
		if(count==0){
		this.defaultSaveHandler();
		}
	}
	//---------------------------------------------------从表相关结束

	
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [grid,gridSub]
    });
    
    // 12. 加载数据
	if (isFlwTask == true || isFlwView == true){
		//Ext.getCmp('add').hide() ;
		//Ext.getCmp('del').hide() ;
		if (g_funname.indexOf('开箱主表') != -1){
	    if(isFlwTask == true){
			getDaiData();
		}else if(isFlwView == true){
		    getNowData();}
		}else if (g_funname.indexOf('开箱从表') != -1){
		     SAVE_OPEN_BOX_SUB();
			ds.baseParams.params = "boxno = "+boxno;
			ds.load({
				params:{
			    	start: 0,
			    	limit: PAGE_SIZE3
		    	},
		    	callback: function(r, opt, s){
		    		if (ds.getCount() > 0) sm.selectFirstRow();
		    	}
		    });
		}else{
			getAllData();
		}
    } else{
		getAllData();
    }
    
    sm.on('selectionchange',function(s){
    	if(s.getSelected()){
    		selectedGgId = s.getSelected().get('uuid');
    		var bill = s.getSelected().get('billstate');
    		if(isFlwTask){
				if(bill == "0"){
					BUTTON_CONFIG['ADD'].disabled = true;
					BUTTON_CONFIG['DEL'].disabled = true;	
				}else{
					grid.getTopToolbar().disable();
					gridSub.getTopToolbar().disable();				
				}
			}else if(isFlwView){
				grid.getTopToolbar().disable();
				gridSub.getTopToolbar().disable();	
			}else {
				if(bill == "0"){
					with(grid.getTopToolbar().items){
						//get("addd").enable();
						get("edit").enable();
						get("dell").enable();
					}
					gridSub.getTopToolbar().enable();
				}else{
					with(grid.getTopToolbar().items){
						//get("addd").disable();
						get("edit").disable();
						get("dell").disable();
					}
					gridSub.getTopToolbar().disable();
				}
			}
    		btnQuery2.setDisabled(false);
    		dsSub.baseParams.params = "openId='"+selectedGgId+"'";
    		dsSub.load({
    			params: {
    				start: 0,
    				limit: PAGE_SIZE3
    			}
    		});    		
    	}
    })
    
        function SAVE_OPEN_BOX_SUB(){
    	if (isFlwTask == true && g_funname.indexOf('开箱从表') != -1) {
	    		openBoxMgm.saveall(boxno);
    	}
    }

    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
    
	function renderBoxno(value, metadata, record){
		var uuid = record.get('uuid');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\''+BASE_PATH
		output += 'Business/equipment/equ.openBox.view.jsp?uuid='+uuid+'&conname='+conname+'\'">'+ value+'</span>'
		return output;
	}
	
	function selectWin(_conid, _conname, _conno, _uuid,_ggid,_sbid){
    	if (!selectWindow){
   			selectWindow = new Ext.Window({
				title: '选择设备或部件',
				iconCls: 'btn',
				layout: 'fit',
				width: 850, height: 500,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true,
				listeners: {
					hide: function(){
						dsSub.reload();
					}
				}
			});
   		}
   		selectWindow.show();
   		selectWindow.load({
			url: BASE_PATH+'Business/equipment/viewDispatcher.jsp',
			params: 'pid='+CURRENTAPPID+'&type=selectkx&conid='+_conid+'&conname='+_conname+'&conno='+_conno+'&uuid='+_uuid+'&ggid='+_ggid+'&sbid='+_sbid +'&argments=openbox'
		});
    }
    
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
   
    var g_smEquSub = new Ext.grid.CheckboxSelectionModel({singleSelect: false});
   
	var g_columnsEquSub = [
		{name: 'SB_ID', type: 'string'},
		{name: 'SB_MC', type: 'string'},
		{name: 'GGXH', type: 'string'},
		{name: 'DW', type: 'string'},
		{name: 'ZS', type: 'float'},	
		{name: 'DHSL', type: 'float'},
		{name: 'SCCJ', type: 'string'},	
		{name: 'JZH', type: 'string'},
		{name: 'WZTYPE', type: 'string'}
	];
	
	var g_storeEquSub = new Ext.data.SimpleStore({
		fields: g_columnsEquSub
	});   
   
	var g_cmEquSub = new Ext.grid.ColumnModel([
		g_smEquSub,
			{
				id: 'sb_id',
				header: '设备主键',
				dataIndex: 'SB_ID',
				hidden: true,
				width: 100
			}, {   
				id: 'wztype',
				header: '货物类别',
				dataIndex: 'WZTYPE',
				renderer:wztypeRender,
				width: 150
			}, {   
				id: 'sbmc',
				header: '货物名称',
				dataIndex: 'SB_MC',
				width: 150
			}, {
				id: 'ggxh',
				header: '规格型号',
				dataIndex: 'GGXH',
				width: 100
			}, {
				id: 'dw',
				header: '单位',
				dataIndex: 'DW',
				width: 50
			}, {
				id: 'zs',
				header: '总数量',
				dataIndex: 'ZS',
				width: 80
			}, {
				id: 'dhsl',
				header: '到货总数',
				dataIndex: 'DHSL',
				width: 80
			}, {
				id: 'sccj',
				header: '生产厂家',
				dataIndex: 'SCCJ',
				width: 150
			}, {
				id: 'jzh',
				header: '机组号',
				dataIndex: 'JZH',
				renderer:jzhRender,
				width: 80
			}
	]);
	g_cmEquSub.defaultSortable = true;
	
	function showEquData(obj){
	    	if (conid != "" && obj != null){
	    		data_rec.length = 0;
	    		DWREngine.setAsync(false);
	    		openBoxMgm.equGoodsSub(conid, function(list){
	    			for (var i = 0; i < list.length; i++) {
		    			var obj = new Array();
			    		obj.push(list[i].SB_ID);
			    		obj.push(list[i].SB_MC);
			    		obj.push(list[i].GGXH);
			    		obj.push(list[i].DW);
			    		obj.push(list[i].ZS);
			    		obj.push(list[i].DHSL);
			    		obj.push(list[i].SCCJ);
			    		obj.push(list[i].JZH);
			    		obj.push(list[i].WZTYPE);
			    		data_rec.push(obj);
	    			}
	    		});
	    		DWREngine.setAsync(true);
	    		g_storeEquSub.loadData(data_rec);
	    }
	}
	    
	
	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;到货设备与部件</b></font>',
		iconCls: 'title'
	});
	
//	var btnFind = new Ext.Button({
//		text: '查询',
//		iconCls: 'btn',
//		handler: findEqu
//	});
	
	var btnSaveSel = new Ext.Button({
		text: '保存',
		iconCls: 'save',
		handler: saveSelected
	});
	
//	var sbMc = new Ext.form.TextField({
//	    id: 'sbMc',
//	    name: 'sbMc'
//	});
//	
//	var scCj = new Ext.form.TextField({
//	    id: 'scCj',
//	    name: 'scCj'
//	});
//	
//	var jzH = new Ext.form.TextField({
//	    id: 'jzH',
//	    name: 'jzH'
//	});

	var g_gridEquSub = new Ext.grid.GridPanel({
	    store: g_storeEquSub,
	    cm: g_cmEquSub,
	    sm: g_smEquSub,
	    border: false,
	    tbar: [
//	    	titleBar, '->', 
//	    	new Ext.Button({
//	        	text: "<font color=#15428b><b>&nbsp;货物名称</b></font>", 
//	        	iconCls: 'refresh'
//	        }),sbMc, 
//	        new Ext.Button({
//	        	text: "<font color=#15428b><b>&nbsp;生产厂家</b></font>", 
//	        	iconCls: 'refresh'
//	        }),scCj, 
//	        new Ext.Button({
//	        	text: "<font color=#15428b><b>&nbsp;机组号</b></font>", 
//	        	iconCls: 'refresh'
//	        }),jzH, 
//	    	btnFind, '->',
	    	btnSaveSel],
		    region: 'center',
		    width: 670,
		    split: true,
		    autoScroll: true,
		    loadMask: true,
			viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
	});   
	
    function popWinwdow(){
 		if(!formWindow){
			formWindow = new Ext.Window({	               
				title: '选择到货设备',
				iconCls: 'form',
				layout: 'border',
				border: false,
				width: 950,
				height: 500,
				modal: true,
//				constrain: true,
				maximizable: true,
				closeAction: 'hide',
				items: [g_gridEquSub]				
			}); 
     	}
     	formWindow.show();
//     	loadStore();
   	}   
   	
	function wztypeRender(value){
		var result = '';
		if('2' == value)result='设备';
		else if('3' == value)result='备品备件';
		else if('4' == value)result='专用工具';
		else result = '';
		return result;
	}  
	function saveSelected(){
		var records = g_smEquSub.getSelections();
		if (records){
			var equids = new Array();
			for (var i = 0; i < records.length; i++) {
				equids.push(records[i].get('SB_ID'));
			}	
			openBoxMgm.insertSelectEqu(conid,equids,partB,function(){
				Ext.example.msg('保存成功！', '您成功新增（' + equids.length + '）条设备开箱从表信息！');
				ds.load();
			})
		}
		
	}
	
   	function partbRender(value){
   		var str = value;
   		for(var i=0; i<partBs.length; i++) {
   			if (partBs[i][0] == value) {
   				str = partBs[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
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
   
   function getNowData(){
    	var date = new Date();
    	getNowData='1';
		var today = date.getYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
		/*var sql = "conid='" + conid +"'"
				+" and opendate >= to_date('"+today+" 00:00:00','YYYY-MM-DD hh24:mi:ss')"
				+" and opendate <= to_date('"+today+" 23:59:59','YYYY-MM-DD hh24:mi:ss')"
				//+" and boxno!=null"*/
		var sql="conid='"+conid+"' and boxno='"+boxno+"'";
		ds.baseParams.params = sql;
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
    }
    function getDaiData(){
        kxState='2';
		var sql = "conid='"+conid+"'" 
				+" and boxno "
		ds.baseParams.params = sql;
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
    }
    
     function getOldData1(){
    	var date = new Date();
		var today = date.getYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
		var sql =  "conid='" + conid +"' and boxno is not null and (billstate=1 or billstate=3)";
		ds.baseParams.params = sql;
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
    }
    
    function getOldData2(){
    	var date = new Date();
		var today = date.getYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
		var sql =  "conid='" + conid +"' and boxno is not null and (billstate=2)";
		ds.baseParams.params = sql;
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
    }
    function getAllData(){
    	kxState='3';
    	//ds.baseParams.params = "conid='" + conid +"' and boxno is not null";
		ds.load({
			params:{
		    	start: 0,
		    	limit: PAGE_SIZE3
	    	}
	    });
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
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////主表查询部分
  function doQueryAdjunct1(){
		if (!queryWin) {
			queryWin = new Ext.Window({
				title: '查询数据',
				width: 450, height: 430,
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
	 				new Ext.form.TextField(fc['boxno']),
	 				new Ext.form.TextField(fc['openAddress']),
	 				new Ext.form.TextField(fc['sbmc']),
	 				new Ext.form.TextField(fc['ggxh']),
	 				new Ext.form.TextField(fc['jsbm']),
	 				new Ext.form.ComboBox({
	            		name: 'wztype',
						fieldLabel: '物资类别', emptyText : '请选择...',
						typeAhead: true, 
						valueField: 'k', displayField: 'v',
						mode: 'local', triggerAction: 'all',
			            store: combox_wztype,lazyRender: true, editable: false,
			            listClass: 'x-combo-list-small',
						anchor: '95%'
	            	}),new Ext.form.ComboBox({
	            		name: 'jzh',
						fieldLabel: '机组号', emptyText : '请选择...',
						typeAhead: true,  
						valueField: 'k', displayField: 'v',
						mode: 'local', triggerAction: 'all',
			            store: dsJzh2,lazyRender: true, editable: false,
			            listClass: 'x-combo-list-small',
						anchor: '95%'
	            	}),
	 				{
	            		border: false, layout: 'column',
	            		items: [
	            			{
		            			layout: 'form', columnWidth: .6, bodyStyle: 'border: 0px;',
		            			items: [
		            				new Ext.form.DateField({
										id: 'opendate'+'_begin',
										fieldLabel: '要求开箱日期', width: 120,
										format: 'Y-m-d', minValue: '2000-01-01', emptyText: '开始时间'
									})
		            			]
		            		},{
		            			layout: 'form', columnWidth: .4, bodyStyle: 'border: 0px; padding: 0px 16px;',
		            			items: [
									new Ext.form.DateField({
										id: 'opendate'+'_end',
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
										id: 'checkdate'+'_begin',
										fieldLabel: '到货日期', width: 120,
										format: 'Y-m-d', minValue: '2000-01-01', emptyText: '开始时间'
									})
		            			]
		            		},{
		            			layout: 'form', columnWidth: .4, bodyStyle: 'border: 0px; padding: 0px 16px;',
		            			items: [
									new Ext.form.DateField({
										id: 'checkdate'+'_end',
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
    	var strSql = "conid='"+conid+"'";
    	var form = queryPanel1.getForm();
    	var boxno = form.findField('boxno').getValue();
    	var openAddress = form.findField('openAddress').getValue();
    	var sbmc = form.findField('sbmc').getValue();
    	var ggxh = form.findField('ggxh').getValue();
    	var jsbm = form.findField('jsbm').getValue();
    	var wztype = form.findField('wztype').getValue();
    	var jzh = form.findField('jzh').getValue();
    	var opendate_begin = form.findField('opendate_begin').getValue();
    	var opendate_end = form.findField('opendate_end').getValue();
    	var checkdate_begin = form.findField('checkdate_begin').getValue();
    	var checkdate_end = form.findField('checkdate_end').getValue();
    	if (boxno != '' && boxno != null){
    		strSql += " and boxno like '%"+boxno+"%'";
    	}
    	if (openAddress != '' && openAddress != null){
    		strSql += " and openAddress like '%"+openAddress+"%'";
    	}
    	if (sbmc != '' && sbmc != null){
    		strSql += " and sbmc like '%"+sbmc+"%'";
    	}
    	if (ggxh != '' && ggxh != null){
    		strSql += " and ggxh like '%"+ggxh+"%'";
    	}
    	if (jsbm != '' && jsbm != null){
    		strSql += " and jsbm like '%"+jsbm+"%'";
    	}
    	if (wztype != '' && wztype != null){
    		strSql += " and wztype like '%"+wztype+"%'";
    	}
    	if (jzh != '' && jzh != null){
    		strSql += " and jzh like '%"+jzh+"%'";
    	}
    	if('' == opendate_begin && '' != opendate_end){
   			strSql += " and ( opendate" + " <= to_date('" + formatDate(opendate_end) + "','YYYY-MM-DD'))";
   		} else if ('' != opendate_begin && "" == opendate_end){
	   		strSql += " and ( opendate" + " >= to_date('" + formatDate(opendate_begin) + "','YYYY-MM-DD'))";
	   	} else if ('' != opendate_begin && '' != opendate_end){
			if (opendate_begin > opendate_end){
				Ext.example.msg('提示！','开始时间应该小于等于结束时间！');
				val = false; 
			} else {
				strSql += " and ( opendate"
						+ " between to_date('" + formatDate(opendate_begin) + "','YYYY-MM-DD')" 
						+ " and to_date('" + formatDate(opendate_end)+ "','YYYY-MM-DD'))"; 
				
			}
	    }
	     if('' == checkdate_begin && '' != checkdate_end){
   			strSql += " and ( checkdate" + " <= to_date('" + formatDate(checkdate_end) + "','YYYY-MM-DD'))";
   		} else if ('' != checkdate_begin && "" == checkdate_end){
	   		strSql += " and ( checkdate" + " >= to_date('" + formatDate(checkdate_begin) + "','YYYY-MM-DD'))";
	   	} else if ('' != checkdate_begin && '' != checkdate_end){
			if (checkdate_begin > checkdate_end){
				Ext.example.msg('提示！','开始时间应该小于等于结束时间！');
				val = false; 
			} else {
				strSql += " and ( recdate"
						+ " between to_date('" + formatDate(checkdate_begin) + "','YYYY-MM-DD')" 
						+ " and to_date('" + formatDate(checkdate_end)+ "','YYYY-MM-DD'))"; 
				
			}
	    }
	    if(kxState=='1'){strSql += "and boxno="+boxno;}
	    else if(kxState=='2'){strSql += "and boxno is null";}
	    else if(kxState=='3'){strSql += "and boxno is not null";}
	    if (val){
	    	with(ds){
	    		baseParams.params = strSql;
	    		load({
   					params : {
						start : 0,
						limit : PAGE_SIZE3
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
				width: 450, height: 230,
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
	 				new Ext.form.TextField(fcSub['sbbmc']),
	 				new Ext.form.TextField(fcSub['ggxh']),
	 				new Ext.form.TextField(fcSub['sccj']),
	 			    new Ext.form.ComboBox({
	            		name: 'jzh',
						fieldLabel: '机组号', emptyText : '请选择...',
						typeAhead: true,  
						valueField: 'k', displayField: 'v',
						mode: 'local', triggerAction: 'all',
			            store: dsJzh2,lazyRender: true, editable: false,
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
    	var strSql ="openId ='"+selectedGgId+"'";
    	var form = queryPanel2.getForm();
    	var sbmc = form.findField('sbbmc').getValue();
    	var ggxh = form.findField('ggxh').getValue();
    	var sccj = form.findField('sccj').getValue();
    	var jzh = form.findField('jzh').getValue();
    	if (sbmc != '' && sbmc != null){
    		strSql += " and sbmc like '%"+sbmc+"%'";
    	}
    	if (ggxh != '' && ggxh != null){
    		strSql += " and ggxh like '%"+ggxh+"%'";
    	}
    	if (sccj != '' && sccj != null){
    		strSql += " and sccj like '%"+sccj+"%'";
    	}
    	if (jzh != '' && jzh != null){
    		strSql += " and jzh like '%"+jzh+"%'";
    	}
	    if (val){
	    	with(dsSub){
	    		baseParams.params = strSql;
	    		load({
   					params : {
						start : 0,
						limit : PAGE_SIZE3
					},
   					callback: function(){ queryWin2.hide(); }
   				});
	    	}
	    }
    }
   
});