var outBean = "com.sgepit.pmis.equipment.hbm.EquHouseoutSub"
var setupBean = "com.sgepit.pmis.equipment.hbm.EquSbaz"
var business = "baseMgm"
var listMethod = "findWhereOrderBy"
var primaryKey = "sbno"
var orderColumn = "sbno"
var gridfiter = "1=2"
var selectSbId = "";
var uids
var tempNode,isRootNode,thisBdgid,thisBdgname,thisBdgno
Ext.onReady(function (){
	sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})   //  创建选择模式	
	sm.on("rowselect",function(obj,inx,rec){
		selectSbId = rec.data.sbno;
		PlantInt.sbId = selectSbId;
		PlantInt.ckdId = selectCkdId
		ds_az.baseParams.params = "sb_id = '"+selectSbId+"' and ckd_id = '"+selectCkdId+"'"
		ds_az.load();
		Ext.getCmp("addBtn").setDisabled(false);
		Ext.getCmp("editBtn").setDisabled(false);
		Ext.getCmp("del").setDisabled(false);
		
		conid = thisBdgid = thisBdgname = thisBdgno = ""
		DWREngine.setAsync(false);
		baseMgm.getData("select conid,bdgid from equ_sbaz where sb_id = '"+selectSbId+"' and ckd_id = '"+selectCkdId+"' order by uids desc",function(list){
			if(list.length>0){
				conid = list[0][0];
				thisBdgid = list[0][1];
				for(var i = 0;i<bdgidArray.length;i++){
					if(bdgidArray[i][0] == thisBdgid){
						thisBdgname = bdgidArray[i][1];
						thisBdgno = bdgidArray[i][2];
						break;
					}
				}
			}
		})
		DWREngine.setAsync(true);
	})
	var cm = new Ext.grid.ColumnModel([
		sm,{
			id:'equid',
			header:"设备ID",
			dataIndex: "equid",
			hidden:true
		},{
			id:'sbno',
			header:"设备编码",
			dataIndex: "sbno"
		},{
			id:'sbmc',
			header:"设备名称",
			dataIndex:"sbmc"
		},{
			id:'sccj',
			header:"生产厂家",
			dataIndex: "sccj"
		},{
			id:'dw',
			header:"计量单位",
			dataIndex: "dw"
		},{
			id:'cksl',
			header:"出库数量",
			dataIndex: "cksl"
		}
	]);	
	// 3. 定义记录集
    var Columns = [
    	{name: 'equid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'sbno', type: 'string'},
		{name: 'sbmc', type: 'string'},    	
		{name: 'sccj', type: 'string'},    	
		{name: 'dw', type: 'string'},    	
		{name: 'cksl', type: 'float'}]
	// 4. 创建数据源
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: outBean,				
	    	business: business,
	    	method: listMethod,
	    	params: gridfiter
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'sbno'
        }, Columns),
        remoteSort: true
    });
    ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
  	var grid = new Ext.grid.GridPanel({
	    store: ds,
	    cm: cm,
	    sm: sm,
	    title: "出库单出库设备",
	    ///iconCls: 'icon-show-all',
	    border: false,
	    layout: 'fit',
	    region: 'center',
	    //height : 500,
	    //header: false,
	    autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,			//加载时是否显示进度
        stripeRows:true,
        trackMouseOver:true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    }
	})
	
	
	
	sm_az =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})   //  创建选择模式	
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	 'ckdId': {name: 'ckdId',fieldLabel: '出库单ID',hideLabel:true,hidden:true},
         'pid': {name: 'pid',fieldLabel: '工程项目编号',hideLabel:true,hidden:true}, 
         'sbId': {name: 'sbId',fieldLabel: '设备ID',hideLabel:true,hidden:true}, 
         'sbKks': {name: 'sbKks',fieldLabel: '设备KKS编码',allowBlank: false, width: 160}, 
         'azSj': {name: 'azSj',fieldLabel: '安装日期',allowBlank: false,format: 'Y-m-d',minValue: '2010-01-01',width: 160}, 
         'szWz': {name: 'szWz',fieldLabel: '安装位置',allowBlank: false,width: 300}, 
         'memo': {name: 'memo',fieldLabel: '备注',width: 300},
         'uids': {name: 'uids',fieldLabel: '主键',hideLabel:true,hidden:true},
         'conid': {name: 'conid',fieldLabel: '安装合同', width: 300},
         'bdgid': {name: 'bdgid',fieldLabel: '概算项目', hideLabel:true,hidden:true},
         'bdgno': {name: 'bdgno',fieldLabel: '概算编号', hideLabel:true,hidden:true}
    }
    var cm_az = new Ext.grid.ColumnModel([		// 创建列模型
    	new Ext.grid.RowNumberer(),
		sm_az,
        {id:'ckdId',header: fc['ckdId'].fieldLabel,dataIndex: fc['ckdId'].name,hidden: true},
        {id:'pid', header: fc['pid'].fieldLabel, dataIndex: fc['pid'].name,hidden: true},
        {id:'sbId', header: fc['sbId'].fieldLabel, dataIndex: fc['sbId'].name,hidden: true},
        {id:'sbKks',header: fc['sbKks'].fieldLabel,dataIndex: fc['sbKks'].name,width: 100},
        {id:'azSj',header: fc['azSj'].fieldLabel,dataIndex: fc['azSj'].name,renderer:formatDate, width: 80},
        {id:'szWz',header: fc['szWz'].fieldLabel,dataIndex: fc['szWz'].name,width: 200},       
		{id:'memo',header: fc['memo'].fieldLabel,dataIndex: fc['memo'].name,width: 120},
        {id:'uids',header: fc['uids'].fieldLabel,dataIndex: fc['uids'].name,hidden: true},
        {id:'conid',header: fc['conid'].fieldLabel,dataIndex: fc['conid'].name,width: 120,
        	renderer : function(value){
        		for(i = 0; i < conidArray.length; i++) {
        			if(conidArray[i][0] == value){
        				return conidArray[i][2];
        				break;
        			}
				}
        	}
        },
        {id:'bdgid',header: fc['bdgid'].fieldLabel,dataIndex: fc['bdgid'].name,width: 120,
	       	renderer : function(value){
        		for(i = 0; i < bdgidArray.length; i++) {
        			if(bdgidArray[i][0] == value){
        				return bdgidArray[i][1];
        				break;
        			}
				}
        	}
        },
        {id:'bdgno',header: fc['bdgno'].fieldLabel,dataIndex: fc['bdgno'].name,hidden: true}
    ]);
    cm_az.defaultSortable = true;						
	// 3. 定义记录集
    var Columns_az = [
    	{name: 'ckdId', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'sbId', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'sbKks', type: 'string'},    	
		{name: 'azSj', type: 'date',dateFormat: 'Y-m-d H:i:s'},    	
		{name: 'szWz', type: 'string'},    	
		{name: 'memo', type: 'string'},    	
		{name: 'uids', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'bdgno', type: 'string'}
		]
    var Plant = Ext.data.Record.create(Columns_az);			//定义记录集   	
    var PlantInt = ({								//设置初始值 
    	ckdId: selectCkdId,
    	sbId:selectSbId,
    	pid: CURRENTAPPID,
    	sbKks: '',
    	azSj:'',
    	szWz:'',
    	memo: '',
    	uids: '',
    	conid: '',
    	bdgid: '',
    	bdgno:''
    });
    
	// 4. 创建数据源
    ds_az = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: setupBean,				
	    	business: business,
	    	method: listMethod,
	    	params: gridfiter
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'uids'
        }, Columns_az),
        remoteSort: true
    });
    ds_az.setDefaultSort("az_sj", 'desc');	//设置默认排序列
    var addBtn = new Ext.Button({
		id: 'addBtn',
        text: '新增',
        iconCls: 'add',
        disabled: true,
        handler: openAzWin    	
    })
    var editBtn = new Ext.Button({
		id: 'editBtn',
        text: '修改',
        iconCls: 'btn',
        disabled: true,
        handler: openAzWin    	
    })
  	var grid_az = new Ext.grid.EditorGridTbarPanel({
	    store: ds_az,
	    cm: cm_az,
	    sm: sm_az,
	    border: false,
	    layout: 'fit',
	    region: 'south',
	    tbar:['<font color=#15428b><b>设备安装信息</b></font>','-',addBtn,'-',editBtn,'-'],
	    addBtn:false,
	    saveBtn:false,
	    delBtn:true,
	    height: 320,
	    //header: false,
	    autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,			//加载时是否显示进度
        stripeRows:true,
        trackMouseOver:true,
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: setupBean,					
      	business: business,	
      	//insertHandler: openAzWin,
      	//saveHandler: saveSub,
      	primaryKey: 'uids',	
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    }
	    //tbar: [btnConfirm,btnReturn],
	})
    
    
    var conidArray = new Array();
 	var bdgidArray = new Array();

 	DWREngine.setAsync(false);
 	var contFilterId = "";				//合同一级分类属性代码，格式如('SB','GC','CL')
	var contractType = new Array();		//合同一级分类
	//根据属性代码中对应“合同划分类型”中查询出设备合同，“详细设置”列包含SB
	var sbSql = "select c.property_code,c.property_name from property_code c " +
			"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
			"and c.detail_type like '%SB%'";
	baseMgm.getData(sbSql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			contractType.push(temp);			
			contFilterId+="'"+list[i][0]+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length-1);
	})
	
 	
 	//-----------------设备安装合同
 	baseMgm.getData("select conid,conname,conno from con_ove where condivno in ("+contFilterId+") and pid='" + CURRENTAPPID + "'",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push("["+list[i][2]+"]"+list[i][1]);
			temp.push(list[i][1]);
			conidArray.push(temp);
		}
    });
    //-----------------安装概算
    var sql="select b.bdgid,b.bdgname,b.bdgno from V_BDGMONEYAPP v,BDG_INFO b where v.BDGID=b.bdgid and v.CONID in ( select t.conid from con_ove t where t.condivno in ("+contFilterId+") ) and b.isleaf=1"
 	baseMgm.getData(sql,function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			temp.push(list[i][2]);
			bdgidArray.push(temp);
		}
    });
 	DWREngine.setAsync(true);
 	
  	var conidSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:conidArray
 	})  
 	var bdgidSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:bdgidArray
 	})  
    var azConid = new fm.ComboBox({
		name : fc['conid'].name,
		fieldLabel : fc['conid'].fieldLabel,
		width : fc['conid'].width,
		allowBlank : false,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : conidSt,
		readOnly : true
	})
	
	var azBdgid = new Ext.form.TriggerField({
		name: 'bdgname', 
		fieldLabel: '概算项目',
		width : 300,
		triggerClass: 'x-form-date-trigger',
		readOnly: true, 
		allowBlank : false,
		selectOnFocus: true, 
		onTriggerClick: showChangeWin
	})
	
	azConid.on("select",function(){
		var form = azFormPanel.getForm();
		form.findField('bdgid').setValue("");	
		form.findField('bdgno').setValue("");
		form.findField('bdgname').setValue("");
	})
	
	function showChangeWin(){
		var form = azFormPanel.getForm();
		var azConid = form.findField('conid').getValue();
		if(azConid == null || azConid == ""){
			Ext.example.msg('提示','请先选择安装合同！');
			return false;
		}else{
			bdgTreePanel.loader.baseParams.conid = conid;
			bdgTreePanel.root.reload();
			bdgTreeWin.show();
		} 
	}
	
	//--------------安装合同概算树
	var bdgRootText = "安装合同概算项目";
	var conid = '';
	var conmoney = 0;
	var bdgRoot = new Ext.tree.AsyncTreeNode({
		text : bdgRootText,
		iconCls : 'form',
		id : '0'
	})
	var bdgTreeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "bdgMoneyTree",
			businessName : "bdgMgm",
			conid : conid,
			conmoney : conmoney,
			parent : 0
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	})
	
	var bdgTreePanel = new Ext.tree.ColumnTree({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		region : 'center',
		frame : false,
		header : false,
		border : false,
		rootVisible : false,
		autoScroll : true,
		lines : true,
		tbar : [{
				text : '全部展开',
				iconCls : 'icon-expand-all',
				tooltip : 'Expand All',
				handler : function(){bdgRoot.expand(true);}
			}, '-', {
				text : '全部收起',
				iconCls : 'icon-collapse-all',
				tooltip : 'Collapse All',
				handler : function(){bdgRoot.collapse(true);}
			}, '-', {
				text : '选择概算',
				iconCls : 'add',
				handler : selectBdgTree
			}],
		columns : [{
					header : '概算名称',
					width : 370, // 隐藏字段
					dataIndex : 'bdgname'
				}, {
					header : '概算编码',
					width : 0,
					dataIndex : 'bdgno',
					renderer : function(value) {
						return "<div id='bdgno'>" + value + "</div>";
					}
				}, {
					header : '概算主键',
					width : 0,
					dataIndex : 'bdgid',
					renderer : function(value) {
						return "<div id='bdgid'>" + value + "</div>";
					}
				}],
		loader : bdgTreeLoader,
		root : bdgRoot
	});
	
	bdgTreePanel.on('beforeload', function(node) {
		bdgid = node.attributes.bdgid;
		var form = azFormPanel.getForm();
		conid = form.findField('conid').getValue();
		if (bdgid == null || bdgid == "") bdgid = '0';
		var baseParams = bdgTreePanel.loader.baseParams
		baseParams.conid = conid;
		baseParams.conmoney = conmoney;
		baseParams.parent = bdgid;
	})
	bdgTreePanel.on('beforeclick', function(node){
		if(!node.isLeaf()){
			node.expand();
			return false;
		}
    });
    
    bdgTreePanel.on('click', function(node){
    	tempNode = node
		isRootNode = (bdgRootText == tempNode.text);
		thisBdgid = isRootNode ? "0" : tempNode.attributes.bdgid;
		thisBdgno = isRootNode ? "0" : tempNode.attributes.bdgno;
		thisBdgname = isRootNode ? "0" : tempNode.attributes.bdgname;
    });
	
	function selectBdgTree(){
		if(thisBdgid=="" || thisBdgno==""){
			Ext.example.msg("提示","请先选择的概算项目！");
			return;
		}else{
			var form = azFormPanel.getForm();
			form.findField('bdgid').setValue(thisBdgid);	
			form.findField('bdgno').setValue(thisBdgno);
			form.findField('bdgname').setValue(thisBdgname);
			bdgTreeWin.hide();
		}
	}
    
	var bdgTreeWin = new Ext.Window({
		title : '合同概算',
		height : document.body.clientHeight-10,
		width : 400,
		border : false,
		layout : 'fit',
		resizable : false,
		modal : true,
		closeAction : 'hide',
		items : [bdgTreePanel]
	});

    var azFormPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        region: 'center',
        layout: 'border',
        labelWidth :120,
        bodyStyle: 'padding:10px;',
    	labelAlign: 'left',
    	items: [
    	new Ext.form.FieldSet({
			title : '基本信息',
			autoWidth : true,
			border : true,
			layout : 'fit',
			items : [
				new fm.TextField(fc['uids']),
				new fm.TextField(fc['pid']),
				new fm.TextField(fc['ckdId']),
				new fm.TextField(fc['sbId']),
				new fm.TextField(fc['bdgno']),
				new fm.TextField(fc['bdgid']),
				{
					layout : 'form',
					columnWidth : .50,
					bodyStyle : 'border:0px;',
					items : [
						new fm.TextField(fc['sbKks']),
						new fm.DateField(fc['azSj']),
						azConid,
						azBdgid,
						new fm.TextField(fc['szWz']),
						new fm.TextArea(fc['memo'])
					]
				}
			]
		})],
		buttons: [{
			id: 'save',
            text: '保存',
            disabled: false,
            handler: doFormSave
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){azWin.hide();}
        }]
    });
    
    var azWin = new Ext.Window({
    	title : '设备安装',
    	width : 500,
    	height : 380,
    	closeAction : 'hide',
		modal:true,
		plain:true,
		border: false,
		resizable: false,
		layout: 'fit',
		items: [azFormPanel]
    });
    
    function formatDate(value){ 
	    return value ? value.dateFormat('Y-m-d') : '';
	};
	
	
	function openAzWin(){
		var btnId = this.id;
		var record = sm.getSelected();
		if(record == null) {
			Ext.example.msg('设备安装', '请选择需要安装的设备！');
			return;
		}
		var formRecord = Ext.data.Record.create(Columns_az);
		var loadFormRecord = null;

		if(btnId == "addBtn"){
			if(ds_az.getTotalCount() >= parseInt(sm.getSelected().data.cksl)){
				Ext.example.msg('设备安装', '该出库设备已经全部安装');
				return;
			}else{
				loadFormRecord = new formRecord({
			    	ckdId: selectCkdId,
			    	sbId: selectSbId,
			    	sbKks: '',
			    	azSj:new Date(),
			    	szWz:'',
			    	memo: '',
			    	uids: '',
			    	pid: CURRENTAPPID,
			    	conid: conid,
			    	bdgid: thisBdgid,
			    	bdgno: thisBdgno,
			    	bdgname: thisBdgname
				});
			}
		}else if(btnId == "editBtn"){
			var record_az = sm_az.getSelected();
			if(typeof(record_az)=='undefined'){
				Ext.example.msg('设备安装', '请选择需要修改的安装信息！');
				return;
			}
			uids = record_az.get('uids');
			DWREngine.setAsync(false);
			baseMgm.findById(setupBean, uids, function(obj) {
				for(var i = 0;i<bdgidArray.length;i++){
					if(bdgidArray[i][0] == obj.bdgid){
						obj.bdgname = bdgidArray[i][1];
						obj.bdgno = bdgidArray[i][2];
						break;
					}
				}
				loadFormRecord = new formRecord(obj);
			});
			DWREngine.setAsync(true);
		}
		azWin.show();
		azFormPanel.getForm().loadRecord(loadFormRecord);
		if(btnId == "editBtn")azFormPanel.getForm().findField('sbKks').disable();
		if(btnId == "addBtn")azFormPanel.getForm().findField('sbKks').enable();
	}
	
	
    function doFormSave(){
    	var form = azFormPanel.getForm()
    	if(form.findField('sbKks').getValue()=="")return false;
    	if(form.findField('szWz').getValue()=="")return false;
    	var obj = form.getValues()
    	for(var i=0; i<Columns_az.length; i++) {
    		var n = Columns_az[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	equSetupMgm.saveOrUpdateSbaz(obj,function(str){
    		if(str=="0")Ext.example.msg('保存出错！', '保存安装信息时出差！');
    		if(str=="3")Ext.example.msg('保存出错！', 'KKS编码已经存在！');
    		if(str=="1"){
    			Ext.example.msg('保存成功！', '您成功新增了一条信息！');
    			azWin.hide();
    			ds_az.reload();
    		}
    		if(str=="2"){
    			Ext.example.msg('保存成功！', '您成功修改了一条信息！');
    			azWin.hide();
    			ds_az.reload();
    		}    		
    	})
   		DWREngine.setAsync(true);
    }
	
	var viewport = new Ext.Viewport({
        layout:'border',
        items: [treePanel,{
        	region:'center',
        	layout:'border',
        	items:[grid,grid_az]
        }]
    });
    
    treePanel.render(); // 显示树
    treePanel.expand();
	root.expand(false,true,function(){
		if(root.firstChild)root.firstChild.expand();
	});
    Ext.getCmp("addBtn").setDisabled(true);
	Ext.getCmp("editBtn").setDisabled(true);
	Ext.getCmp("del").setDisabled(true);	
    ds.load();

});
