
// 全局变量
var conid = conid;
var conname = conname;
var v_rkoutid =""
var bean = "com.sgepit.pmis.equipment.hbm.EquHouseout";
var beanSub = "com.sgepit.pmis.equipment.hbm.EquHouseoutSub";
var beanGoods = "com.sgepit.pmis.equipment.hbm.EquGetGoods";

var beanGet = "com.sgepit.pmis.equipment.hbm.EquInfoGet"
var business = "baseMgm"
var listMethod = "findWhereOrderBy"
var primaryKey = "outid"
var orderColumn = "outno"
var propertyName = "conid"
var propertyValue = conid;
var SPLITB = "`"
var pid = CURRENTAPPID;
var headerTitle = "合同：" + conname + "，编号：" + conno + " ,所有出库记录" 
var allEqu       // 所有设备（弹出框）
var gridS;
var inidSelect="";
 
var aouWindow
	
Ext.onReady(function(){
	if(isFlwTask){
		DWREngine.setAsync(false);
		baseMgm.getData("select outno from equ_houseout where outno='"+outno+"'",function(obj){
			if(obj.length==0){
				addOrUpdateWindow(conid, conname, conno, '');
			}
		})
		DWREngine.setAsync(true);
	}
	
	
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
	
	var jzhType = new Array()
	DWREngine.setAsync(false);
	appMgm.getCodeValue('机组号', function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			jzhType.push(temp);
		}
	});
	DWREngine.setAsync(true);
	function dsJzhRender(value) {
		var str = '';
		for (var i = 0; i < jzhType.length; i++) {
			if (jzhType[i][0] == value) {
				str = jzhType[i][1]
				break;
			}
		}
		return str;
	}
	
	   var BUTTON_CONFIG = {
    	'ADD': {
	    	id: 'add',
	    	text: '新增',
	    	iconCls: 'add',
	    	disabled: true,
	    	handler: function(){
	    		addOrUpdateWindow(conid, conname, conno, '');
	    	}
	    },'EDIT': {
	    	id: 'edit',
	    	text: '修改',
	    	iconCls: 'btn',
	    	disabled: true,
	    	handler: function(){
	    		if (sm.getSelections().length == 1){
	    			var rec = sm.getSelected();
	    			addOrUpdateWindow(conid, conname, conno, rec.data.outid);
	    		} else {
	    			Ext.example.msg('提示','请选择一个设备入库批次进行修改！');
	    		}
	    	}
	    },'DEL':{
	    	id: 'del',
	    	text: '删除',
	    	iconCls: 'multiplication',
	    	disabled: true,
	    	handler: function(){
	    		if (sm.getSelections().length == 1){
		    		var rec = sm.getSelected();
		    		DWREngine.setAsync(false);
		    		equGetGoodsMgm.checkDelete(rec.data.outid, function(flag){
						Ext.Msg.show({
							title: '提示',
							msg: ("" == flag) ? '是否要删除?　　　　' : flag,
							buttons: Ext.Msg.YESNO,
							icon: Ext.MessageBox.QUESTION,
							fn: function(value){
								if ("yes" == value){
									Ext.get('loading-mask').show();
									Ext.get('loading').show();
									equGetGoodsMgm.deleteHouseOut(rec.data.outid, function(str){
									//equGetGoodsMgm.deleteCkd(rec.data.outid, function(){
										Ext.get('loading-mask').hide();
										Ext.get('loading').hide();
										if(str=="1"){
											Ext.example.msg('删除成功！', '您成功删除了一条出库单信息！');
											ds.reload({
												callback: function(){
													if (ds.getCount() > 0){
														sm.selectRow(0);
													}
												}
											});
											ds_out_sb.reload();
										}else if(str=="2"){
											Ext.example.msg('删除失败！', '出库单中有安装信息的设备不能删除！');
										}else{
											Ext.example.msg('删除失败！', '删除出现错误！');
										}
									});
								}
							}
						});
					})
					DWREngine.setAsync(true);
	    		} else {
	    			Ext.example.msg('提示', '请选择一个设备到货批次进行删除！');
	    		}
	    	}
	    },'BACK': {
			text: '返回',
			iconCls: 'returnTo',
			disabled: true,
			handler: function(){
				window.location.href = CONTEXT_PATH + '/Business/equipment/equ.contInfo.input.jsp';
			}
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
    	//BUTTON_CONFIG['ADD'].disabled = false;
    	BUTTON_CONFIG['EDIT'].disabled = false;
    	//BUTTON_CONFIG['DEL'].disabled = false;
    	//BUTTON_CONFIG['OPEN'].disabled = false;
    } else if (isFlwView == true){
    	
    } else if (isFlwTask != true && isFlwView != true) {
    	BUTTON_CONFIG['ADD'].disabled = false;
    	BUTTON_CONFIG['EDIT'].disabled = false;
    	BUTTON_CONFIG['DEL'].disabled = false;
    	//BUTTON_CONFIG['BACK'].disabled = false;
    }
	
	//----------------------------------------------主表grid----------------------------------------
    var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect: true })
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	 'outid': {name: 'outid',fieldLabel: '设备出库主键',hidden:true,hideLabel:true,anchor:'95%'},
         'conid': {name: 'conid',fieldLabel: '合同号',hidden:true,hideLabel:true,anchor:'95%'}, 
         'pid': {name: 'pid',fieldLabel: '入库主键',hidden:true,hideLabel:true,anchor:'95%'}, 
         'outno': {name: 'outno',fieldLabel: '出库编号',anchor:'95%'}, 
         'getPart': {name: 'getPart',fieldLabel: '领用单位',anchor:'95%'}, 
         'getPerson': {name: 'getPerson',fieldLabel: '领用人',anchor:'95%'},
         'outDate': {name: 'outDate',fieldLabel: '出库日期',format: 'Y-m-d',minValue: '2000-01-01',anchor:'95%'}, 
         'equMoney': {name: 'equMoney',fieldLabel: '设备金额',anchor:'95%'}, 
         'sumMoney': {name: 'sumMoney',fieldLabel: '合计价格',anchor:'95%'}, 
         'wareAdmin': {name: 'wareAdmin',fieldLabel: '仓库管理员',anchor:'95%'}, 
         'state': {name: 'state',fieldLabel: '状态',anchor:'95%'},
         'remark': {name: 'remark',fieldLabel: '备注',anchor:'95%'},
         'equipfee':{name:'equipfee',fieldLabel:'到货设备总金额',anchor:'95%'},
         'carryfee':{name:'carryfee',fieldLabel:'运保费',anchor:'95%'},
         'otherfee':{name:'otherfee',fieldLabel:'其它费用',anchor:'95%'},
         'toolfee':{name:'toolfee',fieldLabel:'专用工具金额',anchor:'95%'},
         'partfee':{name:'partfee',fieldLabel:'备品备件金额',anchor:'95%'},
         'totalfee':{name:'totalfee',fieldLabel:'合计总金额',anchor:'95%'},
         'checkbh':{name:'checkbh',fieldLabel:'验收单号',anchor:'95%'},
         'rkzt':{name:'rkzt',fieldLabel:'出库状态',anchor:'95%'},
         'sqr':{name:'sqr',fieldLabel:'申请人',anchor:'95%'},
         'bdgid':{name:'bdgid',fieldLabel:'概算编号',anchor:'95%'},
         'bdgname':{name:'bdgname',fieldLabel:'概算名称',anchor:'95%'},
         'openid':{name:'openid',fieldLabel:'开箱单号',anchor:'95%'},
         'ghfp':{name:'ghfp',fieldLabel:'供货发票',anchor:'95%'}
    }
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	/*{id:'outid', header: "从设备入库中选取", dataIndex: fc['outid'].name,width:130,renderer:function(value){
    			return  "&nbsp;&nbsp;&nbsp;<u class=btn1_mouseout onclick=addSb()> <font color ='green'> (选择)</font></u>" 
    		}
        },{id:'outid', header: fc['outid'].fieldLabel, dataIndex: fc['outid'].name,
           hidden: true        
        },*/
        {id:'conid',header: fc['conid'].fieldLabel,dataIndex: fc['conid'].name, hidden: true },
        {id:'pid', header: fc['pid'].fieldLabel, dataIndex: fc['pid'].name, hidden: true },
        {id:'outno',header: fc['outno'].fieldLabel,dataIndex: fc['outno'].name,//editor: new fm.TextField(fc['outno']),
        width: 120},
        {id:'getPart',header: fc['getPart'].fieldLabel,dataIndex: fc['getPart'].name,hidden:true,width: 100},
        {id:'getPerson',header: fc['getPerson'].fieldLabel,hidden:true,width: 120},
        {id:'outDate',header: fc['outDate'].fieldLabel,dataIndex: fc['outDate'].name,renderer:formatDate, //editor: new fm.DateField(fc['outDate']),
        width: 80},
        {id:'equMoney',header: fc['equMoney'].fieldLabel,dataIndex: fc['equMoney'].name,
           //editor: new fm.NumberField(fc['equMoney']),
           width: 80
        },
        {id:'sumMoney',header: fc['sumMoney'].fieldLabel,dataIndex: fc['sumMoney'].name,hidden:true,width: 80},
        {id:'wareAdmin',header: fc['wareAdmin'].fieldLabel,dataIndex: fc['wareAdmin'].name,hidden:true, width: 120},
        {id:'state',header: fc['state'].fieldLabel,dataIndex: fc['state'].name,hidden:true,width: 120},
        {id:'equipfee',header: fc['equipfee'].fieldLabel,dataIndex: fc['equipfee'].name, width: 120},
        {id:'carryfee',header: fc['carryfee'].fieldLabel,dataIndex: fc['carryfee'].name, width: 120},
        {id:'otherfee',header: fc['otherfee'].fieldLabel,dataIndex: fc['otherfee'].name, width: 120},
        {id:'toolfee',header: fc['toolfee'].fieldLabel,dataIndex: fc['toolfee'].name, width: 120},
        {id:'partfee',header: fc['partfee'].fieldLabel,dataIndex: fc['partfee'].name, width: 120},
        {id:'totalfee',header: fc['totalfee'].fieldLabel,dataIndex: fc['totalfee'].name, width: 120},
        {id:'checkbh',header: fc['checkbh'].fieldLabel,dataIndex: fc['checkbh'].name, width: 120},
        {id:'rkzt',header: fc['rkzt'].fieldLabel,dataIndex: fc['rkzt'].name, width: 120},
        {id:'sqr',header: fc['sqr'].fieldLabel,dataIndex: fc['sqr'].name,
         width: 120,renderer:function(value){
			for(var i = 0;i<userArray.length;i++){
				if(value == userArray[i][0]){
					return userArray[i][1]
				}
			}
		}
        },
        {id:'bdgid',header: fc['bdgid'].fieldLabel,dataIndex: fc['bdgid'].name, width: 120},
        {id:'bdgname',header: fc['bdgname'].fieldLabel,dataIndex: fc['bdgname'].name, width: 120},
        {id:'openid',header: fc['openid'].fieldLabel,dataIndex: fc['openid'].name, width: 120},
        {id:'ghfp',header: fc['ghfp'].fieldLabel,dataIndex: fc['ghfp'].name, width: 120},
        {id:'remark',header: fc['remark'].fieldLabel,dataIndex: fc['remark'].name,
           //editor: new fm.TextField(fc['remark']),
           width: 120
        }
      
    ]);
    cm.defaultSortable = true;						

    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},
    	{name: 'outid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'outno', type: 'string'},
		{name: 'getPart', type: 'string'},
		{name: 'getPerson', type: 'string'},
		{name: 'outDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'equMoney', type: 'float'},
		{name: 'sumMoney', type: 'float'},
		{name: 'wareAdmin', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'state', type: 'string'},
		{name: 'equipfee', type: 'float'},
		{name: 'carryfee', type: 'float'},
		{name: 'otherfee', type: 'float'},
		{name: 'toolfee', type: 'float'},
		{name: 'partfee', type: 'float'},
		{name: 'totalfee', type: 'float'},
		{name: 'checkbh', type: 'string'},
		{name: 'rkzt', type: 'string'},
		{name: 'sqr', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'bdgname', type: 'string'},
		{name: 'openid', type: 'string'},
		{name: 'ghfp', type: 'string'}
		];
    var Plant = Ext.data.Record.create(Columns);			//定义记录集   	
    var PlantInt = ({								//设置初始值 
    	outid: "",              conid:conid,        pid: CURRENTAPPID,        outno:'',
    	getPart: USERORG,       getPerson: USERID,   equMoney: "",   sumMoney: "",
    	wareAdmin:'',            remark: '',          state: '',      sqr:USERID,
    	equipfee:'',             carryfee:'',         otherfee:'',      toolfee:'',
    	partfee:'',              totalfee:'',          checkbh:'',      rkzt:'',
    	bdgid:'',                bdgname:'',           openid:'',       ghfp :'',
    	outDate:''
    });	
        
      
    // 4. 创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName+"='"+propertyValue+"'"
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
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列

    // 5. 创建可编辑的grid: grid-panel
    grid = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',			
        ds: ds,						
        cm: cm,						
        sm: sm,		
        title: headerTitle,
        //addBtn:false,saveBtn:false,delBtn:false,
        tbar: [BUTTON_CONFIG['ADD'], '-', BUTTON_CONFIG['EDIT'], '-', BUTTON_CONFIG['DEL']],
        height: 200,				
        region: 'center',
        clicksToEdit: 2,			
        autoScroll:true,border: false,	
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,		
        enableDragDrop: true,
        addBtn:false,
        saveBtn:false,
        delBtn:false,
		viewConfig:{
			forceFit: false,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
		//extend
		plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: primaryKey	
   });
    // 12. 加载数据
	if(isFlwTask || isFlwView) ds.baseParams.params += " and outno='"+outno+"'";
    ds.load({params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
    });

	//=======================================end========================================================
	//****************************************从表**********************************************************
    var sm_out_sb =  new Ext.grid.CheckboxSelectionModel({singleSelect: false })
    var fm_out_sb = Ext.form;			// 包名简写（缩写）
    var fc_out_sb = {		// 创建编辑域配置
    	 'uuid': {name: 'uuid',fieldLabel: '主键',hidden:true,hideLabel:true,anchor:'95%'},
         'equid': {name: 'equid',fieldLabel: '入库主表主键',anchor:'95%'} ,
         'outid': {name: 'outid',fieldLabel: '设备入库主键',anchor:'95%'} ,
         'spec': {name: 'spec',fieldLabel: '规格',anchor:'95%'} ,
         'unit': {name: 'unit',fieldLabel: '单位（无效)',anchor:'95%'} ,
         'applyNum': {name: 'applyNum',fieldLabel: '申请数量',anchor:'95%'} ,
         'realNum': {name: 'realNum',fieldLabel: '实发数量',anchor:'95%'} ,
         'price': {name: 'price',fieldLabel: '单价',anchor:'95%'} ,
         'sumPrice': {name: 'sumPrice',fieldLabel: '合计价格',anchor:'95%'} ,
         'inSubid': {name: 'inSubid',fieldLabel: '设备入库从表主键',anchor:'95%'} ,
         'pid': {name: 'pid',fieldLabel: 'PID',anchor:'95%'} ,
        
         'sbno': {name: 'sbno',fieldLabel: '设备编号',anchor:'50%'} ,
         'sbmc': {name: 'sbmc',fieldLabel: '设备名称',anchor:'95%'} ,
         'cksl': {name: 'cksl',fieldLabel: '出库数量',anchor:'50%'} ,
         'wztype': {name: 'wztype',fieldLabel: '物资状态',anchor:'50%'} ,
         'jzh': {name: 'jzh',fieldLabel: '机组号',anchor:'50%'} ,
         'gcbh': {name: 'gcbh',fieldLabel: '单位工程编号',anchor:'95%'} ,
         'dw': {name: 'dw',fieldLabel: '单位',anchor:'50%'} ,
         'dj': {name: 'dj',fieldLabel: '单价',anchor:'50%'} ,
         'zj': {name: 'zj',fieldLabel: '总价',anchor:'50%'} ,
         'sccj': {name: 'sccj',fieldLabel: '生产厂家',anchor:'95%'} ,
         'warehouseno': {name: 'warehouseno',fieldLabel: '仓库号',anchor:'50%'} ,
         'libraryno': {name: 'libraryno',fieldLabel: '库位号',anchor:'50%'} ,
         'bz': {name: 'bz',fieldLabel: '备注',anchor:'95%'},
         'conid': {name: 'conid',fieldLabel: '合同编号',hidden:true,hideLabel:true}
       
    }
    var cm_out_sb = new Ext.grid.ColumnModel([		// 创建列模型
    	sm_out_sb,
    	{id:'uuid', header: "从设备入库中选取", dataIndex: fc_out_sb['uuid'].name,width:130,hidden:true,renderer:function(value){
    			return  "&nbsp;&nbsp;&nbsp;<u class=btn1_mouseout onclick=popEquipment()> <font color ='green'> (选择)</font></u>" 
    		}
        },
        {id:'equid',header: fc_out_sb['equid'].fieldLabel,dataIndex: fc_out_sb['equid'].name,hidden:true },
        {id:'outid',header: fc_out_sb['outid'].fieldLabel,dataIndex: fc_out_sb['outid'].name,hidden:true },
        {id:'spec',header: fc_out_sb['spec'].fieldLabel,dataIndex: fc_out_sb['spec'].name,hidden:true },
        {id:'unit',header: fc_out_sb['unit'].fieldLabel,dataIndex: fc_out_sb['unit'].name,hidden:true },
        {id:'sbno',header: fc_out_sb['sbno'].fieldLabel,dataIndex: fc_out_sb['sbno'].name },
        {id:'sbmc',header: fc_out_sb['sbmc'].fieldLabel,dataIndex: fc_out_sb['sbmc'].name },
        {header: '库存数量',renderer:function(value,cell,record){
        	DWREngine.setAsync(false);
        	var kczsl = 0;
        	//baseMgm.getData("select kczsl,cksl from EQU_HOUSEOUT_cksl_VIEW where conid='"+conid+"' and sb_id='"+record.get('equid')+"'",function(num){
        	baseMgm.getData("select kczsl from equ_list where conid='"+conid+"' and sb_id='"+record.get('equid')+"'",function(num){
        		//if(num.length>0) kczsl = num[0][0]-num[0][1];
        		if(num!=null&&num!="") kczsl = num;
        	})
        	DWREngine.setAsync(true);
        	return kczsl
        }},
        {id:'applyNum',hidden:true,header: fc_out_sb['applyNum'].fieldLabel,dataIndex: fc_out_sb['applyNum'].name,editor: new fm_out_sb.NumberField(fc_out_sb['applyNum']) },
        {id:'realNum',hidden:true,header: fc_out_sb['realNum'].fieldLabel,dataIndex: fc_out_sb['realNum'].name,editor: new fm_out_sb.NumberField(fc_out_sb['realNum'])  },
        {id:'cksl',header: fc_out_sb['cksl'].fieldLabel,dataIndex: fc_out_sb['cksl'].name,css:'background:#FFFFCC;',editor: new fm_out_sb.NumberField(fc_out_sb['cksl'])  },
        
        {id:'price',header: fc_out_sb['price'].fieldLabel,dataIndex: fc_out_sb['price'].name,hidden:true  },
        {id:'sumPrice',header: fc_out_sb['sumPrice'].fieldLabel,dataIndex: fc_out_sb['sumPrice'].name,hidden:true,editor: new fm_out_sb.NumberField(fc_out_sb['sumPrice']) },
        {id:'inSubid',header: fc_out_sb['inSubid'].fieldLabel,dataIndex: fc_out_sb['inSubid'].name,hidden:true  },
        {id:'pid',header: fc_out_sb['pid'].fieldLabel,dataIndex: fc_out_sb['pid'].name,hidden:true  },

        {id:'wztype',header: fc_out_sb['wztype'].fieldLabel,dataIndex: fc_out_sb['wztype'].name },
        {id:'jzh',header: fc_out_sb['jzh'].fieldLabel,dataIndex: fc_out_sb['jzh'].name,renderer:dsJzhRender },
        {id:'gcbh',header: fc_out_sb['gcbh'].fieldLabel,dataIndex: fc_out_sb['gcbh'].name },
        {id:'dw',header: fc_out_sb['dw'].fieldLabel,dataIndex: fc_out_sb['dw'].name },
        {id:'dj',header: fc_out_sb['dj'].fieldLabel,dataIndex: fc_out_sb['dj'].name },
        {id:'zj',header: fc_out_sb['zj'].fieldLabel,dataIndex: fc_out_sb['zj'].name },
        {id:'sccj',header: fc_out_sb['sccj'].fieldLabel,dataIndex: fc_out_sb['sccj'].name },
        {id:'warehouseno',header: fc_out_sb['warehouseno'].fieldLabel,dataIndex: fc_out_sb['warehouseno'].name },
        {id:'libraryno',header: fc_out_sb['libraryno'].fieldLabel,dataIndex: fc_out_sb['libraryno'].name },
        {id:'bz',header: fc_out_sb['bz'].fieldLabel,dataIndex: fc_out_sb['bz'].name,editor: new fm_out_sb.TextField(fc_out_sb['bz']) },
        {id:'conid',header: fc_out_sb['conid'].fieldLabel,dataIndex: fc_out_sb['conid'].name,hidden:true}
    ]);
    						

    // 3. 定义记录集
    var Column_out_sb = [
    	{name: 'uuid', type: 'string'},
    	{name: 'equid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'outid', type: 'string'},
		{name: 'spec', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'applyNum', type: 'float'},
		{name: 'realNum', type: 'float'},
		{name: 'price', type: 'float'},
		{name: 'sumPrice', type: 'float'},
		{name: 'inSubid', type: 'string'},
		{name: 'pid', type: 'string'},
		
		{name: 'sbno', type: 'string'},
		{name: 'sbmc', type: 'string'},
		{name: 'cksl', type: 'float'},
		{name: 'wztype', type: 'string'},
		{name: 'jzh', type: 'string'},
		{name: 'gcbh', type: 'string'},
		{name: 'dw', type: 'string'},
		{name: 'dj', type: 'float'},
		{name: 'zj', type: 'float'},
		{name: 'sccj', type: 'string'},
		{name: 'warehouseno', type: 'string'},
		{name: 'libraryno', type: 'string'},
		{name: 'bz', type: 'string'},
		{name: 'conid', type: 'string'}
		];
		
		
		
    var Plant_out_sb = Ext.data.Record.create(Column_out_sb);			//定义记录集  
    var PlantInt_out_sb = ({								//设置初始值 
	 	uuid:'',     equid:'',     outid:inidSelect,   spec:'',
		unit:'',     applyNum:0,  realNum:0, price:0,
		sumPrice:0, inSubid:'',   pid:'',
		
		sbno:'',      sbmc:'',     cksl:'',        wztype:'',
		jzh:'',       gcbh:'',     dw:'',          dj:'',
		zj:'',        sccj:'',     warehouseno:'', libraryno:'', bz:'', pid: CURRENTAPPID,conid:''
    });	
        
      
    // 4. 创建数据源
    var ds_out_sb = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beanSub,				
	    	business: business,
	    	method: listMethod
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'uuid'
        }, Column_out_sb),

        remoteSort: true,
        pruneModifiedRecords: true	
    });
    ds_out_sb.setDefaultSort("uuid", 'desc');	//设置默认排序列

	var outBtn = new Ext.Button({
		text : '从合同设备清单中选取',
		iconCls : 'add',
		handler : popEquipment
	})

    // 5. 创建可编辑的grid: grid-panel
    gridSub = new Ext.grid.EditorGridTbarPanel({
    	id: 'grid-panel',			
        ds: ds_out_sb,						
        cm: cm_out_sb,						
        sm: sm_out_sb,		
        title: "详细出库的设备",
        tbar:[outBtn,'-'],
        height: 310,				
        region: 'south',
        clicksToEdit: 2,
        addBtn : false,		
        autoScroll:true,border: false,	
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,		
        enableDragDrop: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds_out_sb,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
		//extend
		plant: Plant_out_sb,				
      	plantInt: PlantInt_out_sb,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanSub,					
      	business: business,
      	saveHandler:saveSub,
      	deleteHandler:deleteSub,
      	//insertHandler:insertSub,
      	primaryKey: 'uuid'	
   });  
    
    
    modRec = new Object();
	gridSub.on("aftersave",function(){
		DWREngine.setAsync(false);		
		if(modRec != null){
			for(var i=0;i<modRec.length;i++){
	   			var equid=modRec[i].get('equid');
	   			//更新清单中出库总数量
		   		var sumSql = "select sum(cksl) from equ_houseout_sub where equid='"+equid+"' and outid in (select outid from equ_houseout t where conid='"+conid+"')"
		   		var sql = "update equ_list set ckzsl=("+sumSql+") where conid='"+conid+"' and sb_id='"+equid+"'";
		   		baseDao.updateBySQL(sql,function(str){
		   			//更新库存
					baseDao.updateBySQL("update equ_list set kczsl=nvl(rkzsl,0)-nvl(ckzsl,0) where conid='"+conid+"' and sb_id='"+equid+"'",function(str){
						ds_out_sb.reload();
					})					
		   		})		   		
			}
			
		}
		DWREngine.setAsync(true);
	})
	
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [grid,gridSub],
        listeners: {
			afterlayout: function(){
				if (isFlwView == true){
					grid.getTopToolbar().disable();
					gridSub.getTopToolbar().disable();
			    }
			}
		}
    });
    
	 //gridSub.getTopToolbar().items.get('add').setVisible(false);
    
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function insertFun(){
       grid.defaultInsertHandler();
    };
    
    
    function beforeDel(){
    	var record = sm.getSelected();
		var id = record.get('outid');
		equInfoGetMgm.delOutSub(id, function(flag){
			if (flag == 1){
				Ext.Msg.show({
					title: '警告',
		            msg: '存在子记录不能删除',
		            icon: Ext.MessageBox.ERROR,
		            width:300,
		            buttons: Ext.MessageBox.OK
				})
			}else{
				grid.defaultDeleteHandler();
			}		
		});
    }
 
   function insertSub(){
   	if(grid.getSelectionModel().getSelected()){
   		gridSub.defaultInsertHandler();
   	}else{return}
   }
   
   function saveSub(){
   		var records = ds_out_sb.getModifiedRecords();
   		if(records.length==0)return;
   		modRec = records
   		var flag = false;
   		var slArr = new Array();
   		for(var i=0;i<records.length;i++){
   			var cksl=records[i].get('cksl');
   			var equid=records[i].get('equid');
   			var sbmc=records[i].get('sbmc');
   			var uuid = records[i].get('uuid');
   			//修改是判断库存
   			var sumSql = "select sum(x.cksl) from (select uuid,equid,cksl from equ_houseout_sub where equid='"+equid+"' and outid in(select outid from equ_houseout where  conid='"+conid+"')) x where uuid<>'"+uuid+"'"
   			var sql = "select rkzsl,("+sumSql+") from equ_list where conid='"+conid+"' and sb_id='"+equid+"'"		
   			DWREngine.setAsync(false);
   			baseMgm.getData(sql,function(str){
   				slArr = str;
   			});
   			DWREngine.setAsync(true);
			if(cksl+slArr[0][1]>slArr[0][0]){
				Ext.Msg.show({
				   title: '提示！',
				   msg: '设备:'+sbmc+'的[出库数量]不能大于[库存数量]！',
				   buttons: Ext.Msg.OK,
				   icon: Ext.MessageBox.INFO
				});
				flag=true;
				break;
        	}
        	//修改时判断设备是否已经安装
        	var outid = records[i].get('outid');
        	var sbno = records[i].get('sbno');
        	var sql2="select * from equ_sbaz where ckd_id='"+outid+"' and sb_id='"+sbno+"'";
        	var azlist = new Array();
        	DWREngine.setAsync(false);
   			baseMgm.getData(sql2,function(str){
   				azlist = str;
   			});
   			DWREngine.setAsync(true);
   			if(azlist.length>0){
   				Ext.Msg.show({
				   title: '提示！',
				   msg: '设备:'+sbmc+'已经有安装信息，不能修改！',
				   buttons: Ext.Msg.OK,
				   icon: Ext.MessageBox.INFO
				});
				flag=true;
				break;
   			}
   		}
		if(!flag){
			gridSub.defaultSaveHandler();
        	ds_out_sb.commitChanges();	
			ds_out_sb.reload();
			if (isFlwTask == true){
				Ext.Msg.show({
					title: '您成功维护了设备到货信息！',
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
   
   
	//删除从表
	function deleteSub(){
		var records = sm_out_sb.getSelections();
		if(records.length==0)return;
		Ext.MessageBox.confirm('确认','删除操作将不可恢复，确认要删除吗？',function(btn,text){
			if(btn == "yes"){
				var uuidArr = new Array();
				for(var i = 0;i<records.length;i++){
					uuidArr.push(records[i].data.uuid);
				}
				DWREngine.setAsync(false);
				equGetGoodsMgm.deleteHouseOutSub(uuidArr,function(str){
					if(str=="1"){
						Ext.example.msg('删除成功！', '您成功删除了设备出库信息！');
						ds_out_sb.reload();
					}else if(str=="2"){
						Ext.example.msg('删除失败！', '出库单中有安装信息的设备不能删除！');
					}else{
						Ext.example.msg('删除失败！', '删除出现错误！');
					}
				})
				DWREngine.setAsync(true);
			}
		});  
	} 
 
   
     // 11. 事件绑定
	sm.on('rowselect', function(sm){ // grid 行选择事件
		cm_out_sb.defaultSortable = true;
		var record = sm.getSelected();
		inidSelect =record.get('outid')
		ds_out_sb.baseParams.params = "outid='"+inidSelect+"'";
		ds_out_sb.load();
		PlantInt_out_sb.outid = inidSelect;
    });	  
   
    
    
    function addOrUpdateWindow(_conid, _conname, _conno, _outid){
    	if (!aouWindow){
   			aouWindow = new Ext.Window({
				title: '设备出库',
				iconCls: 'option',
				layout: 'fit',
				width: document.body.clientWidth, height: document.body.clientHeight,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true,
				listeners: {
					hide: function(){
						ds.load({params:{
						    	start: 0,
						    	limit: PAGE_SIZE
					    	}
					    });
					}
				}
			});
   		}
   		aouWindow.show();
   		var urlParams = "pid="+CURRENTAPPID+"&type=houseout&conid="+_conid+"&conname="+_conname+"&conno="+_conno+"&outid="+_outid
   		if(isFlwTask){
   			urlParams = "pid="+CURRENTAPPID+"&type=houseout&conid="+_conid+"&conname="+_conname+"&conno="+_conno+"&outid="+_outid+"&outno="+outno+"&isTask=true"
   		}
   		aouWindow.load({
			url: BASE_PATH+'Business/equipment/viewDispatcher.jsp',
			params: urlParams
		});
    }    
    
function popEquipment(){
	if(grid.getSelectionModel().getSelected()){
		v_rkoutid = grid.getSelectionModel().getSelected().get('pid');
		dsSubrk.baseParams.params = "dhId ='"+v_rkoutid+"'";
		dsSubrk.baseParams.params = "conid = '"+conid+"' and kczsl>0 and sbId not in (select equid from EquHouseoutSub where outid='"+inidSelect+"')";
		dsSubrk.load({params:{start:0,limit:PAGE_SIZE}});
		allEqu.show();	
	}
}
    
});

function addSb(){
	selectWin.show()
}




