var rockTree, zbInfoGrid, zbContentGrid;
var beanName = 'com.sgepit.pcmis.bid.hbm.PcBidZbApply';
var contentBeanName = 'com.sgepit.pcmis.bid.hbm.PcBidZbContent';

var currentPrjObj;
var contentDs, smContent; // 从表ds
// 招标类型array
var bidTypeArr = new Array(),bidTypeArrTbar=new Array();
// 招标方式array
var bidWayArr = new Array();
// 产业类型array
var industryTypeArr = new Array();
// 建设性质array
var prjTypeArr = new Array();
var bidTypeStroe,bidTypeStroeTbar;
var bidWayStroe;
var industryTypeStore;
var prjTypeStore;
var bidApplyBusinessType = "PCBidApplyReport";
var currentZbUids; // 当前选中的主表
var contentPlantInt;
var curDeletedApplyId; // 当前删除的招标申请id（删除附件使用）
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';
var treeCombo;
//项目单位array
var array_prjs=new Array();
//负责用户array
var array_user=new Array();
var proTreeCombo;
var unitid=USERBELONGUNITID;
var upunit=USERBELONGUNITID;
var where="unit_type_id not in ('9')";
var unitStore,unitArr,unitBox;
var allUserArray = new Array();
var zbApplyDS;
var sm;
var zbApplyGrid;
var upBtn,shBtn,thBtn;
var selectedRecord = null;  //选中的招标内容的记录
var mainPanelSelectedIndex = null;
var contentPanelSelectedIndex = null;
Ext.onReady(function() {
	var downloadColStr = disableBtn ? '查看' : '上传';
	
	// 通用combobox renderer
	Ext.util.Format.comboRenderer = function(combo) {
		return function(value) {
			var record = combo.findRecord(combo.valueField, value);
			return record
					? record.get(combo.displayField)
					: combo.valueNotFoundText;
		}
	}
	// 移交资料室
	var transBtn = new Ext.Toolbar.Button({
				id : 'transfer',
				text : '移交文件',
				handler : onItemClick,
				icon : CONTEXT_PATH
						+ "/jsp/res/images/icons/book_go.png",
				cls : "x-btn-text-icon"
			});

	DWREngine.setAsync(false);

	//得到部门所属用户
	db2Json.selectSimpleData("select userid, realname from rock_user order by unitid",	function(dat){
		allUserArray = eval(dat);
	});
	
  unitStore = new Ext.data.SimpleStore({
       fields:['val','txt']
  }) 
  db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit order by unitid",
		function(dat){
			unitArr = eval(dat);
			unitStore.loadData(unitArr)			
	});	
	//项目单位
	var bean2="com.sgepit.frame.sysman.hbm.SgccIniUnit";
	baseDao.findByWhere2(bean2,"",function(list){   
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].unitid);
			temp.push(list[i].unitname);
			array_prjs.push(temp);			
		}
    }); 
	baseDao.findByWhere2('com.sgepit.pcmis.zhxx.hbm.VPcZhxxPrjInfo', "pid = '"
					+ currentPid + "'", function(retVal) {
				if (retVal.length > 0) {
					currentPrjObj = retVal[0];
				}
			});

	appMgm.getCodeValue('招标类型', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					bidTypeArr.push(temp);
				}
			});
	appMgm.getCodeValue('招标类型', function(list) {
					var tempInit=new Array();
					tempInit.push("-1");
					tempInit.push("全部");
					bidTypeArrTbar.push(tempInit);
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					bidTypeArrTbar.push(temp);
				}
			});			
	appMgm.getCodeValue('招标方式', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					bidWayArr.push(temp);
				}
			});
	appMgm.getCodeValue('产业类型', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					industryTypeArr.push(temp);
				}
			});
	appMgm.getCodeValue('建设性质', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					prjTypeArr.push(temp);
				}
			});

	DWREngine.setAsync(true);

	
	
	//部门用户store
	var dsCombo_user=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: array_user
	});	
	//项目单位store
	var dsCombo_prjs=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: array_prjs
	});	
	// 招标类型store
	bidTypeStroe = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bidTypeArr
			});
	// 招标类型store顶部工具栏
	bidTypeStroeTbar = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bidTypeArrTbar
			});			
			
	// 招标方式store
	bidWayStroe = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bidWayArr
			});

	industryTypeStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : industryTypeArr
			});

	prjTypeStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : prjTypeArr
			});
	// 部门用户下拉框
	var userCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : dsCombo_user,
				valueField : 'k',
				displayField : 'v',
				allowBlank : false,
				name : 'respondUser'

			});
	// 招标类型下拉框
	var bidTypeCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : bidTypeStroe,
				valueField : 'k',
				displayField : 'v',
				allowBlank : false,
				name : 'zbType'

			});
	// 招标类型下拉框顶部工具栏
	var bidTypeComboTbar = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : bidTypeStroeTbar,
				valueField : 'k',
				displayField : 'v',
				allowBlank : true,
				name : 'zbType',
				emptyText : '全部'
			});	
	//顶部工具栏招标类型的过滤
	bidTypeComboTbar.on("select",function(){
		 var zbType=bidTypeComboTbar.getValue();
		 if(zbType&&zbType!="-1"){
		 	zbApplyDS.baseParams.params= "pid='"+ currentPid+"'"+" and zbType='"+zbType+"'";
		 	zbApplyDS.load();
		 }else if(zbType=="-1"){
		 	zbApplyDS.baseParams.params="pid='"+ currentPid+"'";
		 	zbApplyDS.load();		 	
		 }
	});
	//项目单位下拉框
	proTreeCombo=new Ext.form.ComboBox({
		hidden :true,
		name : 'respondDept',
		anchor : '95%',
		width:200,
		listWidth:300,
		store:dsCombo_prjs,
    	displayField:'v',
   		valueField:'k',
    	typeAhead: true,
    	editable:false,
   		mode: 'local',
    	lazyRender:true,
    	triggerAction: 'all',
    	emptyText:"",
   		selectOnFocus:true
	});	
	/******************************上报start******************************/
	upBtn = new Ext.Button({
		id:'up',
		text: '上报',
		iconCls: 'upload',
		handler: ReportUp
	});
		//上报执行函数
	function ReportUp(){
		var record = sm.getSelected();
		if(record){
			st = record.get("reportStatus");
		}else{
			Ext.example.msg('提示', '请选中一条数据！');
			return;
		}	
		if(st == '1'|| st =='3'){
			Ext.example.msg('提示', '该条数据已经上报！');
			return;
		}
		var myMask = new Ext.LoadMask(Ext.getBody(),{msg:'数据上报中，请稍等'});		
		if(record == null || record =='' || record.get('uids')==''){
			Ext.example.msg('提示', '请选中一条记录！', 2);
			return;
		}
//		baseDao.findByWhere2("com.sgepit.pcmis.tzgl.hbm.PcTzgkMonthCompDetail",
//					"sj_type='" + m_record.get('sjType') + "' and unit_id='"
//							+ m_record.get('pid') + "'", function(list) {
//							
//		});
		DWREngine.setAsync(false);
		var pid = CURRENTAPPID;
		var hql="from PcBidZbApply t where t.uids='"+record.get("uids")+"' and t.pid='"+pid+"'";
		baseDao.findByHql(hql,function(list){
				Ext.MessageBox.confirm('确认','上报操作将不可恢复，上报后数据将不能修改，确认要上报吗？',function(btn,text){
				if(btn=="yes"){
					//ypGrid.body.mask('数据上报中，请稍后！', 'x-mask-loading');
					//Ext.getBody().mask('数据上报中，请稍后！', 'x-mask-loading');    
					//修改上报状态，并执行数据交互，包括主表和从表
					var uids = record.get('uids');
					myMask.show();
					zlgkMgm.pcZbsqxxExchangeDataToQueue(uids,pid,REALNAME,USERBELONGUNITNAME,function(str){
						myMask.hide();
						if(str!=null&&str!=""){
							Ext.Msg.show({
								title : '提示',
								msg : str,
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.INFO,
								fn : function(value){
									//ypGrid.body.unmask();
									//Ext.getBody().unmask(); 
								}
							});
						}
						zbApplyDS.reload();
					});
				}
			});
		})
		DWREngine.setAsync(true); 
	}
	/******************************上报  end******************************/
	/******************************审核start******************************/
	shBtn = new Ext.Button({
		id:'sh',
		text:'审核',
		cls:"x-btn-text-icon",
		icon:BASE_PATH +"/jsp/res/images/pass2.png",
		handler:verifyPass
	});
	function verifyPass(){
		var record = sm.getSelected();
		var st;
		if(record){
			st = record.get("reportStatus");
		}else{
			Ext.example.msg('提示', '请选中一条数据！');
			return;
		}	
		if(st == '3'){
			Ext.example.msg('提示', '该条数据已经审核！');
			return;
		}
		Ext.Msg.confirm('提示','您是否确认要"审核通过"此条记录？',function(txt){
			if(txt=='yes'){
				var record = sm.getSelected();
				var uids=record.get('uids');
				Ext.getBody().mask("提交中……");
				zlgkMgm.updateZbsqState(uids,REALNAME,USERBELONGUNITNAME," ",USERBELONGUNITID,3, function(flag){
					Ext.getBody().unmask();
					if(flag=="1"){
						Ext.example.msg('提示','操作成功');													
					}else{
						Ext.example.msg('提示','操作失败',2);													
					}
					zbApplyDS.reload();
				})
			}
		})
	}
	/******************************审核  end******************************/
	/******************************退回重报start******************************/
	thBtn = new Ext.Button({
		id:'th',
		cls:"x-btn-text-icon",
		icon:BASE_PATH +"jsp/res/images/sendBack2.png",
		text:'退回重报',
		handler:verifyBack
	});
	
	function verifyBack(){
		try{
			var record = sm.getSelected();
			var st = record.get("reportStatus");
			if(st == '2'){
				Ext.example.msg('提示', '该条数据已经退回重报！');
				return;
			}
			if(record){
				var winPanel = new BackWindow({
					doBack:function(reason){
						var mask = new Ext.LoadMask(Ext.getBody(), {msg : "退回中，请稍等..."});
						mask.show();
						zlgkMgm.updateZbsqState(record.get('uids'),REALNAME,USERBELONGUNITNAME,reason,USERBELONGUNITID,2, function(flag){
						mask.hide();
							if(flag=="1"){
								Ext.example.msg('提示','操作成功!');	
								win.hide();
							}else{
								Ext.example.msg('提示','操作失败!');										
							}
							zbApplyDS.reload();
						});
					}
				});
				var win=new Ext.Window({
					id:'backWin',
					width: 700, minWidth: 460, height: 400,
					layout: 'border', closeAction: 'close',
					border: false, constrain: true, maximizable: true, modal: true,
					items: [winPanel,{
						region : 'south',
						height:240,
						title:'交互记录',
						xtype : 'panel',
	//					autoScroll:true,
						html : '<iframe name="bidDetailFrame" src="'+CONTEXT_PATH+ 
						'/PCBusiness/bid/pc.businessBack.log.jsp?edit_pid='+record.get('pid')+'&edit_uids='+record.get('uids')
						+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
					}]
				});
				win.show();
			}
		}catch(e){
		}				
	}
	/******************************退回重报  end******************************/
      //单位选择
  unitBox = new Ext.form.ComboBox({
        emptyText : '请选择单位',
        id : 'respondDept',
        store : unitStore,
        allowBlank : false,
        displayField : 'txt',
        valueField : 'val', 
        width : 300,
        editable : false,
        typeAhead : id,
        triggerAction : 'all',
        mode : 'local',
        tpl: "<tpl for='.'><div style='height:220px'><div id='unittree'></div></div></tpl>",   
	    selectOnFocus:true
    });	
   var unitTreeNodeUrl =  CONTEXT_PATH + "/servlet/PcBidServlet";
  var unitTree =  new Ext.tree.TreePanel({
        loader : new Ext.tree.TreeLoader({
                 dataUrl :unitTreeNodeUrl,
                 requestMethod: "POST",
                 baseParams:{
			        ac:"syncBuilding3GroupUnitTree",
					ifcheck : false,
					baseWhere :where,
					unitid:unitid,
			        upunit:upunit,
					async : false,
					hascheck:"no"
			}
            }),
        border : false,
        root : new Ext.tree.AsyncTreeNode({
             text :USERBELONGUNITNAME,
             id: USERBELONGUNITID,
             expanded : true
           }),
        rootVisible : false   
  })
   unitTree.on('beforeload',function(node){
	 unitTree.loader.baseParams.parentId = node.id; 
  })
  
  unitBox.on('expand',function(){   
        unitTree.render('unittree');  
    });
  unitBox.on('select',function(){
  		alert("select");
  }); 
    
  unitTree.on('click',function(node){
    unitBox.collapse(); 
	var leaf=node.leaf;
	if(leaf==1){
    	var rec = smContent.getSelected() ;
    	rec.set("respondUser", "");		
		unitBox.setValue(node.id); 
		DWREngine.setAsync(false);
		//得到部门所属用户
		PCBidDWR.getUserInDept(node.id,function(list){
			array_user=new Array();
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].userid);
				temp.push(list[i].realname);
				array_user.push(temp);			
				}
	 		}
		);			
		DWREngine.setAsync(true);
		dsCombo_user.loadData(array_user);
		}
		else{
			Ext.example.msg("提示","请选择具体负责部门");
    			return;
		}       	
    }); 
	   
	// 招标方式下拉框
	var bidWayCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : bidWayStroe,
				valueField : 'k',
				displayField : 'v',
				allowBlank : false,
				name : 'zbWay'
			});

	// //////功能菜单//////////////////////
	zbInfoGrid = createZbInfoGrid();
	zbContentGrid = createZbContentGrid();
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [zbContentGrid, zbInfoGrid]
			});
	if(zbUids !=""){
			zbApplyGrid.showHideTopToolbarItems("save", false);
			zbApplyGrid.showHideTopToolbarItems("add", false);
			zbApplyGrid.showHideTopToolbarItems("del", false);
			transBtn.hide();
			zbApplyDS.baseParams.params = "pid='"+ currentPid+"' and uids = '"+zbUids+"'";
			zbApplyDS.load({
				params:{
					start:0,
					limit:PAGE_SIZE
				}
			});
		}	
	//zbInfoGrid.getTopToolbar().add(upBtn,'-',shBtn,'-',thBtn);
	if(USERBELONGUNITTYPEID == '0' && USERNAME !='system'){
		zbApplyGrid.showHideTopToolbarItems("save", false);
		zbApplyGrid.showHideTopToolbarItems("add", false);
		zbApplyGrid.showHideTopToolbarItems("del", false);
	}else if(USERBELONGUNITTYPEID == 'A'|| USERBELONGUNITTYPEID == '3'){
		zbInfoGrid.getTopToolbar().add(upBtn);
	}else if(USERBELONGUNITTYPEID == '2'){
		zbApplyDS.baseParams.params = "pid='"+ currentPid+"' and reportStatus <> '0'";
		zbApplyDS.load({
				params:{
					start:0,
					limit:PAGE_SIZE
				}
			});
		zbApplyGrid.showHideTopToolbarItems("save", false);
		zbApplyGrid.showHideTopToolbarItems("add", false);
		zbApplyGrid.showHideTopToolbarItems("del", false);
		zbApplyGrid.getTopToolbar().add(shBtn,'-',thBtn);
		
	}else{
		//zbApplyGrid.showHideTopToolbarItems("save", false);
		//zbApplyGrid.showHideTopToolbarItems("add", false);
		//zbApplyGrid.showHideTopToolbarItems("del", false);
	}
	if(!dydaView){
		if (disableBtn) {
			zbInfoGrid.getTopToolbar().setHeight(1);
			zbContentGrid.getTopToolbar().setHeight(1);
		}
		
		//如果没有动态数据添加返回按钮
//		zbInfoGrid.getTopToolbar().add('->',{text: '返回',iconCls: 'returnTo',handler: function(){history.back();}})
	}
	//if(zbInfoGrid.getTopToolbar().items.get('del')!=undefined)
	//zbInfoGrid.getTopToolbar().items.get('del').disable();
	if(zbContentGrid.getTopToolbar().items.get('del')!=undefined)
	zbContentGrid.getTopToolbar().items.get('del').disable();
	
	// 招标申请信息
	function createZbInfoGrid() {
		sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : false,
					header : ''
				});

		sm.on('rowselect', function(sm, idx, r) {
					mainPanelSelectedIndex = idx;
					zbContentGrid.setTitle("【" + r.get('zbName') + "】招标内容详细信息");
					currentZbUids = r.data.uids;
					contentPlantInt.zbUids = currentZbUids;
					if (r.data.uids) {
						reloadZbContent();
					}
					/*
					if(!dydaView){
						if(zbInfoGrid.getTopToolbar().items.get('del'))
							zbInfoGrid.getTopToolbar().items.get('del').enable();
					}
					*/
				});
		sm.on('rowdeselect',function(sm,idx,r){
			/*
			if(!dydaView){
				if(zbInfoGrid.getTopToolbar().items.get('del'))
					zbInfoGrid.getTopToolbar().items.get('del').disable();
			}
			*/
		});

		var columns = [new Ext.grid.RowNumberer(),sm, {
					id : 'uids',
					header : 'uids',
					dataIndex : 'uids',
					hidden : true,
					width : 100
				}, {
					id : 'pid',
					header : '项目编号',
					width : 100,
					hidden : true,
					dataIndex : 'pid'
				}, {
					id : 'prjName',
					header : '项目名称',
					dataIndex : 'prjName',
					width : 100,
					dataIndex : 'pid',
					hidden : true,
					renderer : prjRenderer
				}, {
					id : 'industryType',
					header : '产业类型',
					width : 100,
					dataIndex : 'pid',
					hidden : true,
					renderer : prjRenderer

				}, {
					id : 'prjType',
					header : '建设性质',
					width : 100,
					dataIndex : 'pid',
					hidden : true,
					renderer : prjRenderer

				}, {
					id : 'con-scale',
					header : '建设规模',
					width : 100,
					dataIndex : 'pid',
					hidden : true
				}, {
					id : 'con-cycle',
					header : '建设周期',
					width : 100,
					dataIndex : 'pid',
					hidden : true
				}, {
					id : 'total-invesment',
					header : '总投资',
					width : 100,
					dataIndex : 'pid',
					hidden : true
				}, {
					id : 'prj-con-company',
					header : '项目建设单位',
					width : 100,
					dataIndex : 'pid',
					hidden : true
				}, {
					id : 'prj-exam-company',
					header : '项目审批单位',
					width : 100,
					dataIndex : 'pid',
					hidden : true
				}, {
					id : 'zbName',
					header : '招标项目名称',
					dataIndex : 'zbName',
					width : 100,
					renderer :function(value) {
						var qtip = "qtip=" + value;
						return'<span ' + qtip + '>' + value + '</span>';
					},
					editor : dydaView?"":new Ext.form.TextField({
								name : 'zbName'
							})
				}, {
					id : 'applyDate',
					header : '申请时间',
					width : 60,
					dataIndex : 'applyDate',
					align : 'center',
					sortable :true,
					renderer : formatDate,
					editor :dydaView?"": new Ext.form.DateField({
								name : 'applyDate',
								format: 'Y-m-d',
		    					readOnly:true
							})
				}, {
					hidden:true,
					id : 'zbApproveNo',
					header : '批准文号',
					width : 100,
					dataIndex : 'zbApproveNo',
					editor :dydaView?"": new Ext.form.TextField({
								name : 'zbApproveNo'
							})
				}, {
					id : 'zbType',
					header : '招标类型',
					width : 60,
					dataIndex : 'zbType',
					editor :dydaView?"": bidTypeCombo,
					align : 'left',
					renderer : Ext.util.Format.comboRenderer(bidTypeCombo)

				}, {
					id : 'respondMan',
					header : '主要负责人',
					dataIndex : 'respondMan',
					align : 'center',
					width : 60,
					hidden: true,
					editor :dydaView?"": new Ext.form.TextField({
								name : 'respondMan'
							})
				}, {
					id : 'zbWay',
					header : '招标方式',
					dataIndex : 'zbWay',
					align : 'left',
					width : 40,
					editor : dydaView?"":bidWayCombo,
					renderer : Ext.util.Format.comboRenderer(bidWayCombo)

				}, {
					id : 'applyReport',
					header : '申请报告',
					width : 40,
					dataIndex : 'applyReport',
					align : 'left',
					renderer : function(value, metadata, record, rowIndex,
							colIndex, store) {
						var downloadStr="";
						var count=0;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+bidApplyBusinessType+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);
					    if(disableBtn==true){
					    	 downloadStr="查看["+count+"]";
					    }else{
					    	 downloadStr="上传["+count+"]";
					    }																				
						return '<a href="javascript:showUploadWin(\''
								+ bidApplyBusinessType + '\', ' + !disableBtn
								+ ', \'' + record.data.uids + '\')">'
								+ downloadStr + '</a>';
					}

				},{
					id : 'reportStatus',
					header : "上报状态",
					dataIndex : "reportStatus",
					width : 60,
					align:'left',
					renderer : stateRender
				}, {
					id : 'memo',
					header : '备注',
					dataIndex : 'memo',
					width : 100,
					editor :dydaView?"": new Ext.form.TextField({
								name : 'memo'
							})
				}, {
					id : 'zbNo',
					header : '招标编号',
					dataIndex : 'zbNo',
					hidden : true,
					editor : dydaView?"":new Ext.form.TextField({
								name : 'zbNo'
							})
				}];

		var Columns = [{
					name : 'uids',
					type : 'string'
				}, // Grid显示的列，必须包括主键(可隐藏)
				{
					name : 'pid',
					type : 'string'
				}, {
					name : 'zbType',
					type : 'string'
				}, {
					name : 'zbName',
					type : 'string'
				}, {
					name : 'respondMan',
					type : 'string'
				}, {
					name : 'zbWay',
					type : 'string'
				},{
					name : 'reportStatus',
					type : 'float'
				}, {
					name : 'memo',
					type : 'string'
				}, {
					name : 'zbNo',
					type : 'string'
				}, {
					name : 'zbApproveNo',
					type : 'string'
				}, {
					name : 'applyDate',
					type : 'date',
			    	dateFormat : 'Y-m-d H:i:s'
				}];
			zbApplyDS = new Ext.data.Store({
			baseParams : {
				ac : 'list', // 表示取列表
				bean : beanName,
				business : "baseMgm",
				method : "findWhereOrderby",
				params : "pid='"+ currentPid+"'",
				outFilter:outFilter
			},
			proxy : new Ext.data.HttpProxy({
						method : 'GET',
						url : MAIN_SERVLET
					}),
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount',
						id : "uids"
					}, Columns),
			remoteSort : true,
			pruneModifiedRecords : true
				// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
			});
		zbApplyDS.setDefaultSort("applyDate","desc")
		zbApplyDS.load();
		var zbApplyPlant= {
						uids : '',
						pid : currentPid,
						zbType : '',
						zbName : '',
						respondMan : '',
						zbWay : '',
						reportStatus:'',
						memo : '',
						zbNo : '',
						zbApproveNo : '',
						applyDate:new Date()
						
					};
		zbApplyGrid = new Ext.grid.EditorGridTbarPanel({
					addBtn:hasBtn,
					saveBtn:hasBtn,
					delBtn:hasBtn,
					region : 'center',
					ds : zbApplyDS, // 数据源
					columns : columns, // 列模型
					sm : sm,
					tbar : ["招标类型:",bidTypeComboTbar,"-"/*,transBtn,"-"*/], // 顶部工具栏，可选
					border : false, // 
					region : 'center',
					clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
					autoScroll : true, // 自动出现滚动条
					loadMask : true, // 加载时是否显示进度
					viewConfig : {
						forceFit : true,
						ignoreAdd : true
					},
					bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
						pageSize : PAGE_SIZE,
						store : zbApplyDS,
						displayInfo : true,
						displayMsg : ' {0} - {1} / {2}',
						emptyMsg : "无记录。"
					}),
					deleteHandler : function() {
						var sm = this.getSelectionModel();
						var ds = this.getStore();
						if (sm.getCount() > 0) {
							Ext.MessageBox.confirm('确认',
									'该操作会删除招标申请以及其所属的招标内容和详细信息，是否确认删除？',
									function(btn, text) {
										if (btn == "yes") {
											var records = sm.getSelections()
											var codes = []
											for (var i = 0; i < records.length; i++) {
												var m = records[i]
														.get(this.primaryKey)
												if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
													continue;
												}
												codes[codes.length] = m
											}
											var mrc = codes.length
											if (mrc > 0) {
												deletaZbApplyAttachment(codes);
												var ids = codes.join(",");
												this.doDelete(mrc, ids)
											} else {
												ds.reload();
											}
										}
									}, this);
						}
					},
					plant : Ext.data.Record.create(Columns),
					plantInt :zbApplyPlant,
					servletUrl : MAIN_SERVLET,
					bean : beanName,
					business : "baseMgm",
					primaryKey : "uids",
					listeners : {
						aftersave : function(grid, idsOfInsert, idsOfUpdate,
								primaryKey, bean) {
							if (!doExchange) {
								return;
							}
							var insArr = new Array();
							var updArr = new Array();
							if (idsOfInsert.length > 0) {
								insArr = idsOfInsert.split(',');

							}
							if (idsOfUpdate.length > 0) {
								updArr = idsOfUpdate.split(',');
							}
							var allArr = insArr.concat(updArr);
							// alert(allArr)
							if (allArr.length > 0) {
								//招标申请信息【修改或保持】数据交互
								//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
								PCBidDWR.excDataZbForSave(bean,updArr,insArr,false, currentPid, defaultOrgRootID,
									function(flag){
								
								})
							}
						},
						click:function(){
							if(sm.getSelected()&&sm.getSelected()!=null){
								var repStatus = sm.getSelected().get("reportStatus");
								if(repStatus !='0' && repStatus != '2'){
									zbApplyGrid.showHideTopToolbarItems("del", false);
								}else{
									if(zbUids !=""){
										zbApplyGrid.showHideTopToolbarItems("del", false);
									}else{
										zbApplyGrid.showHideTopToolbarItems("del", true);
									}
									
								}
							}
						},
						afterdelete : function(grid, ids, primaryKey, bean) {
							if (!doExchange) {
								return;
							}
							var delArr = ids.split(',');
							if (delArr.length > 0) {
								//招标申请信息【删除】数据交互
								//参数：ids数组，是否立即发送，发送单位，接收单位
								PCBidDWR.excDataZbApplyForDel(delArr,false,currentPid,defaultOrgRootID,
									function(flag){
								});
							}

						}
					}
				});

		zbApplyGrid.on('afterdelete', function() {
					contentDs.removeAll();
					currentZbUids = null;
					if (curDeletedApplyId) {
						deleteZbApplyAttachment();
					}
				});
		zbApplyGrid.on('beforeinsert', function() {
			 var zbType=bidTypeComboTbar.getValue();
			 if(zbType&&zbType!="-1"){
			 	zbApplyPlant.zbType=zbType;
			 	bidTypeCombo.setValue(zbType);
			 }				
			 return true;
		});
								
		return zbApplyGrid;
	}
	//上报状态
	function stateRender(value,meta,record){
		var renderStr="";
		if(value=="0") return "<font color=gray>未上报</font>";
		if(value=="1") {
			renderStr="<font color=black>已上报</font>";
		}
		if(value=="2") renderStr="<font color=red>退回重报</font>";
		if(value=="3") renderStr="<font color=blue>审核通过</font>";
		return "<a title='点击查看详细信息' " +
				"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uids')+"\")'>"+renderStr+"</a>";
	}
	
	// 招标内容
	function createZbContentGrid() {
		var spinner = new Ext.ux.form.Spinner({
			width:100,
			name:'rateStatus',
		    strategy: new Ext.ux.form.Spinner.NumberStrategy({minValue:'0', maxValue:'100'}),
		    listeners:{
		    	change : function(field,no,oo){
		    		if(isNaN(parseInt(no))||parseInt(no)>100){
		    			if(isNaN(parseInt(oo))||parseInt(oo)>100){
		    				field.setValue(0)	
		    			}else{
		    				field.setValue(parseInt(oo))
		    			}
		    		}else{
		    			field.setValue(parseInt(no));
		    		}
		    	}
		    }
		});
		smContent = new Ext.grid.CheckboxSelectionModel({
					singleSelect : true,
					header : ''
				});
		var columns = [new Ext.grid.RowNumberer(), {
					id : 'contentes',
					header : '招标内容',
					dataIndex : 'contentes',
					width : 140,
					renderer :function(value) {
						var qtip = "qtip=" + value;
						return'<span ' + qtip + '>' + value + '</span>';
					},
					editor :dydaView?"": new Ext.form.TextField({
								name : 'contentes',
								allowBlank : false
							})

				},{
					id : 'bdgMoney',
					header : '概算金额',
					dataIndex : 'bdgMoney',
					align : 'right',
					width : 100,
					renderer:function(value, metadata, record, rowIndex,colIndex, store){
//						selectedRecord = record;
						var uids = record.get("uids"); //内容ID
						DWREngine.setAsync(false);
						var sql = "select t.plan_bgmoney from pc_bid_bdg_apportion t where t.content_id = '"+uids+"' order by t.bdgid";
				        db2Json.selectData(sql, function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null && list.length >0){
					   	 value =list[0].plan_bgmoney;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);
						return "<a href='javascript:openGSFTWin(\""+rowIndex+"\",\""+value+"\");'>"+value+"</>";
					}
				
				}, {
					id : 'startDate',
					header : '开始时间',
					dataIndex : 'startDate',
					width : 80,
					align : 'center',
					renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
					type : 'date',
					editor : dydaView?"":new Ext.form.DateField({
								name : 'startDate',
								readOnly:true,
								format : 'Y-m-d'
							})
				}, {
					id : 'endDate',
					header : '结束时间',
					dataIndex : 'endDate',
					align : 'center',
					width : 80,
					renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
					type : 'date',
					editor :dydaView?"": new Ext.form.DateField({
								name : 'endDate',
								readOnly:true,
								format : 'Y-m-d'
							})
				}, {
					id : 'rateStatus',
					header : '工作进度',
					hidden:true,
					dataIndex : 'rateStatus',
					align : 'center',
					width : 140,
					editor :dydaView?"": spinner, 
					renderer: function(value){
				        var columnWidth = (120-10);
				        var width = columnWidth * value / 100;
				        return '<div style="background:#C6D6EE;position:absolute;width:'+width+'px;height:22px"></div>'
				            + '<div style="border:solid 1px #FF0000;position:relative;height:20px;line-height:20px;width:'+columnWidth+'px;">'+value+'%</div>';
				    }
				}, {
					id : 'respondDept',
					hidden:true,
					header : '负责部门',
					align : 'center',
					width : 140,
					dataIndex : 'respondDept',
					editor :dydaView?"": unitBox,
					align : 'center',
					renderer :Ext.util.Format.comboRenderer(proTreeCombo) 
				}, {
					id : 'respondUser',
					header : '负责人',
					align : 'center',
					width : 90,
					dataIndex : 'respondUser',
					editor :dydaView?"": userCombo,
					align : 'center',
					renderer : respondUserRendererFun
				},{
					id : 'applyAmount',
					hidden:true,
					header : '申请金额(元)',
					dataIndex : 'applyAmount',
					align : 'right',
					width : 100,
					editor : dydaView?"":new Ext.form.NumberField({
								name : 'applyAmount'
							})
				}, {
                    id : 'memo',
                    header : '备注',
                    dataIndex : 'memo',
                    width : 180,
                    editor : dydaView?"":new Ext.form.TextField({
                                name : 'memo'
                            })
                }
		];

		var Columns = [{
					name : 'uids',
					type : 'string'
				}, {
					name : 'pid',
					type : 'string'
				}, {
					name : 'zbUids',
					type : 'string'
				}, {
					name : 'contentes',
					type : 'string'
				},{
					name : 'bdgMoney',
					type : 'float'
				}, {
					name : 'zbBd',
					type : 'string'
				}, {
					name : 'startDate',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'

				}, {
					name : 'endDate',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'rateStatus',
					type : 'float'
				}, {
					name : 'respondDept',
					type : 'string'
				}, {
					name : 'respondUser',
					type : 'string'
				}, {
					name : 'memo',
					type : 'string'
				}, {
					name : 'applyAmount',
					type : 'float'
				}

		]
		contentDs = new Ext.data.Store({
			baseParams : {
				ac : 'list', // 表示取列表
				bean : contentBeanName,
				business : "baseMgm",
				method : "findByProperty"
			},
			proxy : new Ext.data.HttpProxy({
						method : 'GET',
						url : MAIN_SERVLET
					}),
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount',
						id : "uids"
					}, Columns),
			remoteSort : true,
			pruneModifiedRecords : true
				// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
			});
		contentDs.on('beforeload', function(store, options) {
					store.baseParams.params = 'zbUids' + SPLITB + currentZbUids;
				});

		contentPlantInt = {
			uids : '',
			pid : currentPid,
			zbUids : '',
			contentes : '',
			startDate : null,
			endDate : null,
			rateStatus : 0,
			respondDept :USERDEPTID,
			respondUser : USERID,
			memo : '',
			zbBd:'',
			applyAmount : 0,
			bdgMoney:0
		};

		var tmpGrid = new Ext.grid.EditorGridTbarPanel({
					addBtn:hasBtn,
					saveBtn:hasBtn,
					delBtn:hasBtn,
					region : 'south',
					sm : smContent,
					ds : contentDs, // 数据源
					columns : columns, // 列模型
					height : 280,
					tbar : [], // 顶部工具栏，可选
					title : "招标内容详细信息", // 面板标题
					iconCls : 'icon-by-category', // 面板样式
					border : false, // 
					clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
					autoScroll : true, // 自动出现滚动条
					collapsible : false, // 是否可折叠
					animCollapse : false, // 折叠时显示动画
					loadMask : true, // 加载时是否显示进度
					viewConfig : {
						forceFit : true,
						ignoreAdd : true
					},
					bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
						pageSize : PAGE_SIZE,
						store : contentDs,
						displayInfo : true,
						displayMsg : ' {0} - {1} / {2}',
						emptyMsg : "无记录。"
					}),
					plant : Ext.data.Record.create(Columns),
					plantInt : contentPlantInt,
					deleteHandler : function() {
						var sm = this.getSelectionModel();
						var ds = this.getStore();
						if (sm.getCount() > 0) {
							Ext.MessageBox.confirm('确认',
									'该操作会删除招标内容以及其所属的所有详细过程记录和附件，是否确认删除？',
									function(btn, text) {
										if (btn == "yes") {
											var records = sm.getSelections()
											var codes = []
											for (var i = 0; i < records.length; i++) {
												var m = records[i]
														.get(this.primaryKey)
												if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
													continue;
												}
												codes[codes.length] = m
											}
											var mrc = codes.length
											if (mrc > 0) {
												deleteAllDetailAttachment(codes);
												var ids = codes.join(",");
												this.doDelete(mrc, ids)
											} else {
												ds.reload();
											}
										}
									}, this);
						}
					},
					servletUrl : MAIN_SERVLET,
					bean : contentBeanName,
					business : "baseMgm",
					primaryKey : "uids",
					listeners : {
						aftersave : function(grid, idsOfInsert, idsOfUpdate,
								primaryKey, bean) {
							if (!doExchange) {
								return;
							}
							var insArr = new Array();
							var updArr = new Array();
							if (idsOfInsert.length > 0) {
								insArr = idsOfInsert.split(',');

							}
							if (idsOfUpdate.length > 0) {
								updArr = idsOfUpdate.split(',');
							}
							var allArr = insArr.concat(updArr);
							if (allArr.length > 0) {
								//招标内容信息【修改或保持】数据交互
								//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
								PCBidDWR.excDataZbForSave(bean,updArr,insArr,false, currentPid, defaultOrgRootID,
									function(flag){
								
								})
							}

						},
						afterdelete : function(grid, ids, primaryKey, bean) {
							var delArr = ids.split(',');

							if (!doExchange) {
								return;
							}
							if (delArr.length > 0) {
								//招标内容删除
							    //参数：ids数组，是否立即发送，发送单位，接收单位
								PCBidDWR.excDataZbContentForDel(delArr,false,currentPid,defaultOrgRootID,
									function(flag){
									
								});
							}

						}
					}
				});
		if(zbUids !=""){
			tmpGrid.addBtn=false;
			tmpGrid.saveBtn=false;
			tmpGrid.delBtn=false;
		}
		tmpGrid.on('beforeinsert', function() {
					if (currentZbUids == null || currentZbUids == '') {
						Ext.Msg.show({
									title : '新增记录',
									msg : '请先选择一条招标申请信息！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.INFO
								});
						return false;

					} else {
						return true;
					}
				});
				
		smContent.on('rowselect',function(sm,idx,r){
			contentPanelSelectedIndex = idx;
			if(!dydaView){
				zbContentGrid.getTopToolbar().items.get('del').enable();
			}
			//选择行时选择负责人列表
			var respondDept=r.get("respondDept");
			if(respondDept&&respondDept!=""){
				DWREngine.setAsync(false);
				//得到部门所属用户
			PCBidDWR.getUserInDept(respondDept,function(list){
				array_user=new Array();
				for(i = 0; i < list.length; i++) {
					var temp = new Array();	
					temp.push(list[i].userid);
					temp.push(list[i].realname);
					array_user.push(temp);			
					}
	 			}
			);			
			DWREngine.setAsync(true);
			dsCombo_user.loadData(array_user);						
		}		
		
		});
		smContent.on('rowdeselect',function(sm,idx,r){
			if(!dydaView){
				zbContentGrid.getTopToolbar().items.get('del').disable();
			}
		});
		return tmpGrid;
	}
	reloadHandler();
});

function prjRenderer(value) {
	var retVal = currentPrjObj[this.id];
	switch (this.id) {
		case 'industryType' : {

			var index = industryTypeStore.find('k', retVal);
			if (index > -1) {
				return industryTypeStore.getAt(index).get('v');
			} else {
				return retVal;
			}
			break;
		}
		case 'prjType' : {

			var index = prjTypeStore.find('k', retVal);
			if (index > -1) {
				return prjTypeStore.getAt(index).get('v');
			} else {
				return retVal;
			}
			break;
		}

		default : {
			return retVal;
		}
	}

}

function showUploadWin(businessType, editable, businessId) {

	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
		return;
	}

	var fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
				title : '申请报告文件信息',
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
	fileWin.on("close",function(){
		zbApplyDS.load();
	});
}

function reloadZbContent() {
	contentDs.baseParams.params = 'zbUids' + SPLITB + currentZbUids;
	contentDs.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});	
}

function deleteZbApplyAttachment() {
	var bizTypes = new Array();
	bizTypes.push(bidApplyBusinessType);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedApplyId, function(retVal) {
				curDeletedApplyId = null;
			});
}

function deletaZbApplyAttachment(uidArr) {
	DWREngine.setAsync(false);
	PCBidDWR.clearZbApplyAttachment(uidArr);
	DWREngine.setAsync(true);
}

function deleteAllDetailAttachment(uidArr) {
	DWREngine.setAsync(false);
	PCBidDWR.clearZbDetailAttachment(uidArr);
	DWREngine.setAsync(true);

}

function uploadSuccess(fileLsh, businessId, businessType, blobTable) {
	if (doExchange) {
		var fileIdArr = new Array();
		fileIdArr.push(fileLsh);
		var  beanname =  beanName;
		if(businessType==bidApplyBusinessType){//招标申请对应的附件
			beanname =  beanName;
			//参数说明：业务bean名称，业务主键，文件流水号号数组,发送单位,接收单位,业务说明,是否立即发送
			PCBidDWR.excDataAttachments(beanname, businessId, fileIdArr, currentPid, defaultOrgRootID,
				"招标申请【附件上传】", false,function(flag){
					
			});
		}
	}
}

function deleteSuccess(fidArr,businessId, businessType, blobTable) {
	if (doExchange) {
		var  beanname =  beanName;
		if(businessType==bidApplyBusinessType){//招标申请对应的附件
			beanname =  beanName;
			//参数说明：业务bean名称，业务主键，文件流水号号数组,发送单位,接收单位,业务说明,是否立即发送
			PCBidDWR.excDataAttachments(beanname, businessId, fidArr, currentPid, defaultOrgRootID,
				"招标申请【附件删除】", false,function(flag){
					
			});
		}
	}
}

function respondUserRendererFun(v, m, r){
	var respondDept=r.get("respondDept");
	if(respondDept&&respondDept!=""){
		for(i = 0; i < allUserArray.length; i++) {
			if(allUserArray[i][0]==v) {
				return allUserArray[i][1];
			}
		}
	}
	return "";
}

function onItemClick(item) {
	switch (item.id) {	
		case 'transfer' :
			var selRecords = zbApplyGrid.getSelectionModel().getSelections();
			if (selRecords.length < 1) {
				return;
			}
			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			var fileIdArr = [];
			for (var i = 0; i < selRecords.length; i++) {
				fileIdArr.push(selRecords[i].data.uids);		
			}
			//Ext.log(fileIdArr);
			yjzls(fileIdArr.join(','));

			break;
	}
}
function yjzls(filePk) {
	var rtn = window
			.showModalDialog(
					CONTEXT_PATH
							+ "/PCBusiness/bid/com.fileTrans.jsp?type=PcBidZbApply&fileId="
							+ filePk,
					null,
					"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
	}
}
//上报数据交互记录
function showReportLog(pid,uids){
		var m_record=new Object();
		m_record.pid=pid;
		m_record.uids=uids;
		window.showModalDialog(
			CONTEXT_PATH+ "/PCBusiness/bid/pc.businessBack.log.jsp",
			m_record,"dialogWidth:800px;dialogHeight:300px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
	}
function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

/**
 * 打开概算分摊的页面
 * @param rowIndex 行号
 * @param value 招标概算金额
 */
function openGSFTWin(rowIndex,value){
	selectedRecord = zbContentGrid.getStore().getAt(rowIndex);
	var mPageNo = zbApplyGrid.getBottomToolbar().getPageData().activePage;
	var cPageNo = zbContentGrid.getBottomToolbar().getPageData().activePage;
	var mIndex = zbApplyGrid.getSelectionModel()
	
	var uids = selectedRecord.get("uids");
	var zbUids = selectedRecord.get("zbUids");  //招标项目uid
	var content = selectedRecord.get("contentes"); //内容
	var bdgMoney = value || selectedRecord.get("bdgMoney"); // 招标概算金额
	
	var contentUrl = BASE_PATH + "/PCBusiness/bid/pc.bid.zb.gsft.jsp";
	contentUrl += "?conid="+uids+"&conname="+encodeURIComponent(content)+"&conmoney="+bdgMoney+"&isquery=1&zbUids=" 
		+ zbUids + "&mPageNo=" + mPageNo + "&cPageNo=" +cPageNo + "&mIndex=" + mainPanelSelectedIndex + "&cIndex=" + contentPanelSelectedIndex;
	window.location.href = contentUrl;
}

function reloadHandler(){
	if(null != mPageNo && "" != mPageNo){
		setPage(zbApplyDS,mPageNo);
		setPage(contentDs,cPageNo);
		zbApplyDS.on('load',function(){
			sm.selectRow(mIndex);
		});
		zbContentGrid.on("load",function(){
			smContent.selectRow(cIndex);
		});
	}
	
	//设置页面翻转
	function setPage(ds,pageNo){
		ds.load({
			params:{
				start:(pageNo-1) * PAGE_SIZE,
				limit:PAGE_SIZE
			}
		});
	}
}