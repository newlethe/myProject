var comBoxBaseParams = {
		triggerAction : 'all',
		mode : 'local',
		lazyRender : true,
		valueField : 'k',
		displayField : 'v',
		listWidth:400,
		editable : false, 
		width: 280
		};
// 通用combobox renderer
Ext.util.Format.comboRenderer = function(combo) {
	return function(value) {
		var record = combo.findRecord(combo.valueField, value);
		return record? record.get(combo.displayField): combo.valueNotFoundText;
	}
}
Ext.util.Format.comboRenderer1 = function(combo) {
	return function(value) {
		var record = combo.findRecord(combo.valueField, value);
        if(!record) return ;
		var disvalue=record? record.get(combo.displayField): combo.valueNotFoundText;
		var qtip = "qtip=" + disvalue;
		return'<span ' + qtip + '>' + disvalue + '</span>'; 
	}
}
var rockTree, zbAgencyGrid;

var currentPrjObj;
var zbApplyCombo;
var zbApplyStore;
var sm;
var tmpGrid;
var zbAgencyNameCombo;
var allUserArray = new Array();
// 招标类型array
var bidTypeArr = new Array();
var bidTypeStroe;
var zbTypeLabel;
var bidApplySelectBar;
var agencyBeanName = 'com.sgepit.pcmis.bid.hbm.PcBidZbAgency';
var agencyDs;
var currentZbUids;
var currentAgencyName;
var plantInt;
// 上传附件的businessType
var bidAgencyBusinessType = "PCBidAgency";
var bidAgencyOtherBusinessType = "PCBidAgencyOther";
var bidAgencyContractBusinessType = "PCBidAgencyContract";
var curDeletedAgencyId; // 当前删除的id，删除附件使用
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';
var zbPrjStoreEdit = new Ext.data.SimpleStore({fields:['k','v']});
var zbPrjComboEdit = new Ext.form.ComboBox(Ext.apply({emptyText : '请选择招标项目',store : zbPrjStoreEdit,allowBlank:false},comBoxBaseParams));
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
Ext.onReady(function() {
	// 移交资料室
	var transBtn = new Ext.Toolbar.Button({
				id : 'transfer',
				text : '移交文件',
				handler : onItemClick,
				icon : CONTEXT_PATH
						+ "/jsp/res/images/icons/book_go.png",
				cls : "x-btn-text-icon"
			});	
	zbPrjComboEdit.on('select', PrjComselect);
	function PrjComselect(){
		var curPrj=zbPrjComboEdit.getValue();
		plantInt.zbUids=curPrj;
		//currentZbUids=curPrj;
	}
	var downloadColStr = disableBtn ? '查看' : '上传';

	// 招标项目下拉框
	var zbApplyArr = new Array();
	var zbApplyArr2 = new Array();
	//招标代理机构名称
	zbAgencyArr=new Array();
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
	PCBidDWR.getBidApplyForCurrentPrj(null,currentPid, function(list) {
				var temp=new Array();
				var temp2=new Array();
				var val="null";
				temp.push("");
				temp.push("所有");
				temp.push("所有");
				zbApplyArr.push(temp);
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					var temp2 = new Array();
					if(val!=list[i].zbName){
						temp.push(list[i].uids);
						temp.push(list[i].zbName);
						temp.push(list[i].zbType);
						temp2.push(list[i].uids);
						temp2.push(list[i].zbName);
						temp2.push(list[i].zbType)						
						zbApplyArr.push(temp);
						zbApplyArr2.push(temp2);		
						val=list[i].zbName;
					}
				}
				zbPrjStoreEdit.loadData(zbApplyArr2);
				
			});  			
		
	appMgm.getCodeValue('招标类型', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					bidTypeArr.push(temp);
				}
			});
	DWREngine.setAsync(true);
	zbApplyStore = new Ext.data.SimpleStore({
				fields : ['k', 'v', 't'],
				data : zbApplyArr
			});
	
	zbAgencyStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data :[['', '']]  
			});
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
	DWREngine.setAsync(false);		  
	PCBidDWR.getBidPcBidZbAgencyForCurrentPrj(currentPid, function(list) {
			  var temp=new Array();
				temp.push("-1");
				temp.push("所有");
				zbAgencyArr.push(temp);		
				for (var i = 0; i < list.length; i++) {
					temp=new Array();
					temp.push(list[i].agencyName);
					temp.push(list[i].agencyName);
					zbAgencyArr.push(temp);					
				}	
				
			});				 
	zbAgencyStore.loadData(zbAgencyArr);		
	DWREngine.setAsync(true);		
	// 招标类型store
	bidTypeStroe = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bidTypeArr
			});

	zbApplyCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				emptyText : '请选择招标项目',
				mode : 'local',
				width: 280,
				lazyRender : true,
				listWidth:400,
				store : zbApplyStore,
				valueField : 'k',
				displayField : 'v',
				editable : false,
				name : 'zbApplyId'
			});
			
	zbAgencyNameCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				emptyText : '请选择招标代理机构名称',
				mode : 'local',
				width: 280,
				lazyRender : false,
				listWidth:400,
				store : zbAgencyStore,
				valueField : 'k',
				displayField : 'v',
				editable : false,
				name : 'zbAgencyId',
				value:"-1"
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
    
  unitTree.on('click',function(node){  
    unitBox.collapse(); 
	var leaf=node.leaf;
	if(leaf==1){
    	var rec = sm.getSelected() ;
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
			
	zbApplyCombo.on('select', function(combo, record, index) {
				zbApplyComboSelect(record);
			});
	zbAgencyNameCombo.on('expand', function(combo, record, index) {
		DWREngine.setAsync(false);
		zbAgencyArr=new Array();
		PCBidDWR.getBidPcBidZbAgencyForCurrentPrj(currentPid, function(list) {
			var temp=new Array();
			temp.push("-1");
			temp.push("所有");
		    zbAgencyArr.push(temp);		
			for (var i = 0; i < list.length; i++) {
				temp=new Array();
				temp.push(list[i].agencyName);
				temp.push(list[i].agencyName);
				zbAgencyArr.push(temp);					
				}		
			});	
		DWREngine.setAsync(true);	
		zbAgencyStore.loadData(zbAgencyArr);					
			});			
	zbAgencyNameCombo.on('select', function(combo, record, index) {			
				zbAgencyComboSelect(record);
			});
			
	function zbApplyComboSelect(record){
		currentZbUids = record.data.k;
		plantInt.zbUids = currentZbUids;
		reloadZbAgency();
		var bidTypeStr = record.data.t;

		var index = bidTypeStroe.find('k', record.data.t);
		if (index > -1) {
			bidTypeStr = bidTypeStroe.getAt(index).get('v');
		}

		Ext.get(zbTypeLabel.getEl()).update(bidTypeStr);
	}
	function zbAgencyComboSelect(record){
		currentAgencyName = record.data.k;
		if(currentAgencyName!="-1")
		plantInt.agencyName = currentAgencyName;
		reloadZbAgency();
	}	

	// //////功能菜单//////////////////////
	zbAgencyGrid = createZbAgencyGrid();
	
	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [zbAgencyGrid]
			});
	if(zbUids !=""){
			zbAgencyGrid.showHideTopToolbarItems("save", false);
			zbAgencyGrid.showHideTopToolbarItems("add", false);
			zbAgencyGrid.showHideTopToolbarItems("del", false);
			transBtn.hide();
		}		
	zbAgencyGrid.getTopToolbar().add(transBtn);
	if(zbAgencyGrid.getTopToolbar().items.get('del')!=undefined)
	zbAgencyGrid.getTopToolbar().items.get('del').disable();
			
			
	if ( zbApplyArr.length > 0 ){
		zbApplyCombo.setValue(zbApplyArr[0][0]);
		var record = zbApplyStore.getAt(0);
		zbApplyComboSelect(record);
	}
	

	// 招标代理机构
	function createZbAgencyGrid() {
		 sm = new Ext.grid.CheckboxSelectionModel({
			singleSelect : false,
			header : ''
		});
		var columns = [new Ext.grid.RowNumberer(), sm,{
					id : 'uids',
					header : 'uids',
					dataIndex : 'uids',
					width : 100,
					hidden : true
				},

				{
					id : 'pid',
					header : '项目编号',
					width : 100,
					hidden : true,
					dataIndex : 'pid'
				}, {
					id : 'zbUids',
					header : '招标项目名称',
					dataIndex : 'zbUids',
					hidden:true
			
				}, {
					id : 'zbUidsName',
					header : '招标项目名称',
					dataIndex : 'zbUids',
					editor : zbPrjComboEdit,
					renderer:Ext.util.Format.comboRenderer1(zbPrjComboEdit)				
				}, {
					id : 'agencyName',
					header : '招标代理机构名称',
					dataIndex : 'agencyName',
					renderer :function(value) {
						var qtip = "qtip=" + value;
						return'<span ' + qtip + '>' + value + '</span>';
					},
					editor : new Ext.form.TextField({
								name : 'agencyName',
								allowBlank : false
							})
				}, {
					id : 'agencyData',
					header : '招标代理机构资料',
					hidden:true,
					dataIndex : 'uids',
					align : 'center',
					width : 100,
					renderer : function(value, metadata, record, rowIndex,
							colIndex, store) {
						var downloadStr="";
						var count=0;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+bidAgencyBusinessType+"'", function (jsonData) {
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
					    var str1= '<a href="javascript:showUploadWin(\''
								+ bidAgencyBusinessType + '\', ' + !disableBtn + ', \''
								+ record.data.uids
								+ '\', \'招标代理机构资料\' )">' + downloadStr +'</a>';													
						return str1;
					}
				}, {
					id : 'contractData',
					header : '合同附件',
					hidden:true,
					dataIndex : 'uids',
					align : 'center',
					width : 50,
					renderer : function(value, metadata, record, rowIndex,
							colIndex, store) {
						var downloadStr="";
						var count=0;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+bidAgencyOtherBusinessType+"'", function (jsonData) {
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
						var str1= '<a href="javascript:showUploadWin(\''
								+ bidAgencyOtherBusinessType + '\', ' + !disableBtn + ', \''
								+ record.data.uids + '\', \'合同附件\' )">' + downloadStr +'</a>';							
						return str1;								
					}
				}, {
					id : 'otherData',
					header : '其它资料',
					hidden:true,
					dataIndex : 'uids',
					align : 'center',
					width : 50,
					renderer : function(value, metadata, record, rowIndex,
							colIndex, store) {
						var downloadStr="";
						var count=0;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+bidAgencyContractBusinessType+"'", function (jsonData) {
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
						var str1= '<a href="javascript:showUploadWin(\''
								+ bidAgencyContractBusinessType
								+ '\', ' + !disableBtn + ', \'' + record.data.uids
								+ '\', \'其它资料\' )">' + downloadStr +'</a>';
								
						return str1;									
								
					}
				}, {
					id : 'respondDept',
					header : '负责部门',
					hidden:true,
					dataIndex : 'respondDept',
					width : 100,
					editor :unitBox,
					align : 'center',
					renderer :Ext.util.Format.comboRenderer(proTreeCombo) 
				}, {
					id : 'respondUser',
					header : '代理机构负责人',
					dataIndex : 'respondUser',
					width : 60,
					editor :userCombo,
					align : 'left',
					renderer :respondUserRendererFun
				}, {
					id : 'memo',
					header : '备注',
					hidden:true,
					dataIndex : 'memo',
					width : 160,
					editor : new Ext.form.TextField({
								name : 'memo'
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
					name : 'zbUids', // 主表id
					type : 'string'
				}, {
					name : 'agencyName',
					type : 'string'
				}, {
					name : 'respondDept',
					type : 'string'
				}, {
					name : 'respondUser',
					type : 'string'
				}, {
					name : 'memo',
					type : 'string'
				}

		]
		agencyDs = new Ext.data.Store({
			baseParams : {
				ac : 'list', // 表示取列表
				bean : agencyBeanName,
				business : "baseMgm",
				params : "pid='"+ currentPid+"'",
				method : "findWhereOrderby"
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
		agencyDs.on('beforeload', function(store, options) {
					if(zbUids != ''){
							currentZbUids = zbUids;
							currentAgencyName = '-1';
					}
					if(currentAgencyName==undefined){
						currentAgencyName="-1";
					}
					if(currentZbUids==""&&currentAgencyName=="-1"){
						store.baseParams.params="pid = '" + currentPid + "'";  
					}else if(currentAgencyName=="-1"&&currentZbUids!=""){
						store.baseParams.params ="pid = '" + currentPid + "' and "+"zbUids = '" + currentZbUids + "'";
					}
					else if(currentAgencyName!="-1"&&currentZbUids==""){
						store.baseParams.params ="pid = '" + currentPid + "' and "+"agencyName = '" + currentAgencyName + "'";
					}
					else if(currentAgencyName!="-1"&&currentZbUids!=""){
						store.baseParams.params ="pid = '" + currentPid + "' and "+"zbUids = '" + currentZbUids + "' and "+"agencyName = '" + currentAgencyName + "'";
					}	
				});

		// 招标类型标签
		zbTypeLabel = new Ext.form.Label({
					text : ''

				});
		// 第二行工具栏
		bidApplySelectBar = new Ext.Toolbar({
					items : [
								'&nbsp;招标代理机构名称: ', zbAgencyNameCombo, '-','&nbsp;招标项目名称: ', zbApplyCombo, '-', 
								'招标类型: ',zbTypeLabel
							]

				});

		plantInt = {
			uids : '',
			pid : currentPid,
			zbUids : '',
			agencyName : '',
			respondDept :USERDEPTID,
			respondUser : USERID,
			memo : ''
		};

		tmpGrid = new Ext.grid.EditorGridTbarPanel({
					region : 'center',
					ds : agencyDs, // 数据源
					columns : columns, // 列模型
					sm : sm,
					margins : '5 0 5 5',
					cmargins : '0 0 0 0',
					tbar : new Ext.Toolbar({
								items : [/*transBtn,"-"*/]
							}),
					listeners : {
						'render' : function() {
							bidApplySelectBar.render(this.tbar);
						},
						aftersave : function(grid, idsOfInsert, idsOfUpdate,
								primaryKey, bean) {
							if ( ! doExchange ){
								return;
							}
							var insArr = new Array();
							var updArr = new Array();
							if ( idsOfInsert.length > 0 ){
								insArr = idsOfInsert.split(',');
								
							}
							if ( idsOfUpdate.length > 0 ){
								updArr = idsOfUpdate.split(',');
							}
							var allArr = insArr.concat(updArr);
							//alert(allArr)
							if ( allArr.length > 0 ){
								//招标代理【修改或保持】数据交互
								//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
								PCBidDWR.excDataZbForSave(bean,updArr,insArr,false, currentPid, defaultOrgRootID,
									function(flag){
								
								})
							}
							
						},
						afterdelete : function(grid, ids, primaryKey, bean) {
							if ( ! doExchange ){
								return;
							}
							var delArr = ids.split(',');
							if ( delArr.length > 0 ){
								//代理机构【删除】数据交互
								//参数说明：业务bean名称，数据主键数据，是否立即发送，发送单位，接收单位
								PCBidDWR.excDataZbProcessForDel(bean,delArr,false,currentPid,defaultOrgRootID,
									function(flag){
								})
							}
						}
					}, // 顶部工具栏，可选
					header : false,
					title : "招标代理机构", // 面板标题
					border : false, // 
					region : 'center',
					clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
					autoScroll : true, // 自动出现滚动条
					deleteHandler : function() {
						var selSm = this.getSelectionModel();
						if (selSm.getCount() > 0) {
							curDeletedAgencyId = sm.getSelected().data.uids;
							this.defaultDeleteHandler();
						}
					},
					saveHandler : function() {
						var selSm = this.getSelectionModel();
						var zbUids= sm.getSelected().data.zbUids;
						plantInt.zbUids=zbUids;
						if(zbUids&&zbUids!="-1"){
							this.defaultSaveHandler();	
						}else{
							Ext.Msg.alert("提示","请选择招标项目名称");
						}						
						
					},
					animCollapse : false, // 折叠时显示动画
					loadMask : true, // 加载时是否显示进度
					viewConfig : {
						forceFit : true,
						ignoreAdd : true
					},
					bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
						pageSize : PAGE_SIZE,
						store : agencyDs,
						displayInfo : true,
						displayMsg : ' {0} - {1} / {2}',
						emptyMsg : "无记录。"
					}),
					plant : Ext.data.Record.create(Columns),
					plantInt : plantInt,
					servletUrl : MAIN_SERVLET,
					bean : agencyBeanName,
					business : "baseMgm",
					primaryKey : "uids"
				});
				//选择第一个项目
	

		tmpGrid.on('insert', function() {
					if (currentZbUids == null || currentZbUids == '') {
						Ext.Msg.show({
									title : '新增记录',
									msg : '请先选择招标项目！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.INFO
								});
						return false;

					} else {
						return true;
					}

				});

		tmpGrid.on('afterdelete', function() {
					if (curDeletedAgencyId) {
						deleteAgencyAttachment();
					}
				});
				
		sm.on('rowselect',function(sm,idx,r){
			zbAgencyGrid.getTopToolbar().items.get('del').enable();
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
		})
		sm.on('rowdeselect',function(sm,idx,r){
			zbAgencyGrid.getTopToolbar().items.get('del').disable();
		})
		return tmpGrid;
	}

	function reloadZbAgency() {
		agencyDs.reload();
	}
});

function showUploadWin(businessType, editable, businessId, winTitle) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
				title : title,
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
		agencyDs.load();
	});
}

function deleteAgencyAttachment() {
	var bizTypes = new Array();
	bizTypes.push(bidAgencyBusinessType, bidAgencyOtherBusinessType,
			bidAgencyContractBusinessType);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedAgencyId, function(retVal) {
				curDeletedAgencyId = null;
			});
}
//代理机构附件数据交互-上传
function uploadSuccess(fileLsh, businessId, businessType, blobTable) {
	if (doExchange) {
		var fileIdArr = new Array();
		fileIdArr.push(fileLsh);
		//参数说明：业务bean名称，业务主键，文件流水号号数组,发送单位,接收单位,业务说明,是否立即发送
		PCBidDWR.excDataAttachments(agencyBeanName, businessId, fileIdArr, currentPid, defaultOrgRootID,
			"招标代理机构【附件上传】", false,function(flag){
				
		});
	}
}
//代理机构附件数据交互-删除
function deleteSuccess(fidArr,businessId, businessType, blobTable) {
	if (doExchange) {
		//参数说明：业务bean名称，业务主键，文件流水号号数组,发送单位,接收单位,业务说明,是否立即发送
		PCBidDWR.excDataAttachments(agencyBeanName, businessId, fidArr, currentPid, defaultOrgRootID,
			"招标代理机构【附件删除】", false,function(flag){
				
		});
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
			var selRecords = tmpGrid.getSelectionModel().getSelections();
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
							+ "/PCBusiness/bid/com.fileTrans.jsp?type=PcBidZbAgency&fileId="
							+ filePk,
					null,
					"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
	}
}
function yjzls_(type,filePk) {
	var rtn = window
			.showModalDialog(
					CONTEXT_PATH
							+ "/PCBusiness/bid/com.fileTrans.jsp?fileId="
							+ filePk+"&type="+type,
					null,
					"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
	}
}