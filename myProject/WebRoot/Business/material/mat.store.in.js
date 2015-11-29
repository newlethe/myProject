var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";
var bean = "com.sgepit.pmis.material.hbm.MatStoreIn";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "inNo";
var selectWin;
var inId;
var billTypes = new Array();
var htType = new Array();
var hasFlow=false;//页面是否配置流程
var ds;
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'";

Ext.onReady(function() {
	var addRkdBtn = new Ext.Button({
		text: '新增入库单',
		iconCls: 'add',
		handler: function(){
				popWinwdow("insert");
			}
	});
	var editRkdBtn = new Ext.Button({
		text: '编辑',
		iconCls: 'btn',
		handler: function(){
				popWinwdow("update");
			}
	});
	var delRkdBtn = new Ext.Button({
		text: '删除',
		iconCls: 'remove',
		handler: function(){
			gridPanel.defaultDeleteHandler();
		}
	});
	DWREngine.setAsync(false);
    var rtnState='';
	systemMgm.getFlowType(USERUNITID,MODID,function(rtn){
	    rtnState=rtn;
	})
	if(isFlwTask != true && isFlwView != true){
		if(rtnState=='BusinessProcess'){
		    hasFlow=true;
		}else{
			hasFlow=false;
		}
	}else{
		hasFlow=true;
	}
	DWREngine.setAsync(true);
	DWREngine.setAsync(false);
	 //02:物资部合同，CG物资部合同分类中的采购合同
	//2011-09-02 多项目中修改，此处采购合同隶属于材料合同，属性代码中“合同划分类型”的“详细设置”包含CL的合同分类下所有合同
    conoveMgm.getCgHt("CL","","1=1",function(list){
    	for(i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].conid);
				temp.push("【"+list[i].conno+"】"+list[i].conname);
				htType.push(temp);
			}
    
    })
        //供货单位
    var deptType = new Array();
    DWREngine.setAsync(false);
    baseMgm.getData("select uids,csmc from WZ_CSB where ISUSED='1' and "+pidWhereString+" ",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			deptType.push(temp);
		}
	})
	
	//用户名
	var userArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user ",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);
	
    DWREngine.setAsync(true);
	appMgm.getCodeValue('流程状态',function(list){		//流程审批状态
			for(i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].propertyCode);
				temp.push(list[i].propertyName);
				billTypes.push(temp);
			}
	    });
	 DWREngine.setAsync(true);
	 var btnConMat = new Ext.Button({
		text: '从合同材料选',
		iconCls: 'add',
		handler: function(){
			if (sm.hasSelection()){
				var conid = sm.getSelected().get('conid');
				if (conid){
					var appid = sm.getSelected().get('uuid');
					var params = "conid=" + conid+ "&appid="+ appid +"&type=apply&page=storein1";
					selectWinShow(params);
				}else{
                    Ext.example.msg('提示！', '请选择一个合同！');
				}
			}else{
                Ext.example.msg('提示！', '请选择一条主记录！');
			}
		}
	});
	
	var btnList = new Ext.Button({
		text: '选择入库物资',
		iconCls: 'add',
		handler: selectList
	});
	
	var btnGoods = new Ext.Button({
		text: '从到货中选',
		iconCls: 'add',
		handler: selectGoods
	});
	
	//2010-11-22 zhangh
	var btnStockPlan = new Ext.Button({
		text: '从采购计划选',
		iconCls: 'add',
		handler: selectStockPlan
		
	})
	
    
	var fm = Ext.form;		// 包名简写（缩写）
	var fc = {		// 创建编辑域配置
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',
			hideLabel : true
		},'inNo' : {
			name : 'inNo',
			fieldLabel : '入库单编号',
			anchor : '95%'
		},'dept' : {
			name : 'dept',
			fieldLabel : '部门名称',
			anchor : '95%'
		},'name' : {
			name : 'name',
			fieldLabel : '姓名',
			anchor : '95%'
		},'inDate' : {
			name : 'inDate',
			fieldLabel : '入库日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'conid' : {
			name : 'conid',
			fieldLabel : '采购合同',
			readOnly:true,
			anchor : '95%'
		},'sum' : {
			name : 'sum',
			fieldLabel : '总价',
			anchor : '95%'
		},'fareType' : {
			name : 'fareType',
			fieldLabel : '费用类型',
			anchor : '95%'
		},'offerDept' : {
			name : 'offerDept',
			fieldLabel : '供货单位',
			anchor : '95%'
		},'matType' : {
			name : 'matType',
			fieldLabel : '物品类别',
			anchor : '95%'
		},'arrivDate' : {
			name : 'arrivDate',
			fieldLabel : '到货日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'userWay' : {
			name : 'userWay',
			fieldLabel : '用途',
			anchor : '95%'
		},'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		},'storetype':{
			name:'storetype',
			fieldLabel:'区分标志符',
			anchor:'95%'
		},'billState':{
			name:'billState',
			fieldLabel:'审批状态',
			anchor:'95%'
		},'finished':{
			name:'finished',
			fieldLabel:'完结',
			anchor:'95%'
		},'pid':{
			name:'pid',
			fieldLabel:'PID',
			hidden:true
		}
	}

    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'inNo', type: 'string'},
		{name: 'dept', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'inDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'arrivDate',   type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'sum', type: 'float' },
		{name: 'fareType', type: 'string'},
		{name: 'offerDept', type: 'string'},
		{name: 'matType', type: 'string'},
		{name: 'userWay', type: 'string'},
		{name: 'remark', type: 'string'},
		{name:'storetype', type:'string'},
		{name:'billState', type:'string'},
		{name:'pid', type:'string'}
		];

	var Plant = Ext.data.Record.create(Columns);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantInt = {
		uuid : null,
		inNo : '',
		dept : '',
		name:'',
		inDate:'',
		conid:'',
		sum:null,
		fareType:'',
		offerDept:'',
		matType:'',
		arrivDate:'',
		userWay:'',
		remark: '',
		storetype: storetype,
		billState : 0,
		pid : CURRENTAPPID
	}
	var conField = new Ext.form.TriggerField(fc['conid']); 
    conField.onTriggerClick = function (){newWin()}
    
    var cmArr=[
	sm,{
		id : 'uuid',
		header : fc['uuid'].fieldLabel,
		dataIndex : fc['uuid'].name,
		hidden : true
	}, {
		id : 'inNo',
		header : fc['inNo'].fieldLabel,
		dataIndex : fc['inNo'].name,
		width : 120		
	}, {
		id : 'dept',
		header : fc['dept'].fieldLabel,
		dataIndex : fc['dept'].name,
		width : 80,
		hidden : true
		
	}, {
		id : 'name',
		header : fc['name'].fieldLabel,
		dataIndex : fc['name'].name,
		width : 60,
		renderer:function(value){
			for(var i=0;i<userArr.length;i++){
				if(userArr[i][0]==value){
					return userArr[i][1];
				}
			}
		}
	}, {
		id : 'conid',
		header : fc['conid'].fieldLabel,
		dataIndex : fc['conid'].name,
		hidden : false,
		width : 120,
		renderer: conName
	}, {
		id : 'offerDept',
		header : fc['offerDept'].fieldLabel,
		dataIndex : fc['offerDept'].name,
		renderer:function(value){
			for(var i=0;i<deptType.length;i++){
				if(deptType[i][0]==value){
					return deptType[i][1];
				}	
			}	
		},
		width : 100
		
	}, {
		id : 'matType',
		header : fc['matType'].fieldLabel,
		dataIndex : fc['matType'].name,
		width : 60
		
	}, {
		id : 'inDate',
		header : fc['inDate'].fieldLabel,
		dataIndex : fc['inDate'].name,
		width : 60,
		renderer: formatDate
	}, {
		id : 'arrivDate',
		header : fc['arrivDate'].fieldLabel,
		dataIndex : fc['arrivDate'].name,
		width : 60,
		renderer: formatDate
	}, {
		id : 'sum',
		header : fc['sum'].fieldLabel,
		dataIndex : fc['sum'].name,
		width : 40,
		renderer : function(v){
			return v.toFixed(4);
		}
	},  {
		id : 'fareType',
		header : fc['fareType'].fieldLabel,
		dataIndex : fc['fareType'].name,
		width : 60
	},{
		id : 'userWay',
		header : fc['userWay'].fieldLabel,
		dataIndex : fc['userWay'].name,
		width : 120		
	}, {
		id : 'remark',  
		header : fc['remark'].fieldLabel,
		dataIndex : fc['remark'].name,
		hidden : true
	},{
		id:'storetype',
		header:fc['storetype'].fieldLabel,
		dataIndex:fc['storetype'].name,
		hidden:true
	},{
		id:'billState',
		header:fc['billState'].fieldLabel,
		dataIndex:fc['billState'].name,
		width : 60,
		hidden:!hasFlow,
		renderer : billTypeRender
	},{
		id:'pid',
		header:fc['pid'].fieldLabel,
		dataIndex:fc['pid'].name,
		hidden:true
	}];
	var finishArr={
		id : 'finished',
		header : fc['finished'].fieldLabel,
		dataIndex : fc['finished'].name,
		renderer : function(v, m, r) {
            var b = r.get('billState');
            var str = "<input type='checkbox' "
                    + (b == 1 ? "disabled checked title='已完结' " : "title='未完结'")
                    + " onclick='finishFun(\"" + r.get("uuid") + "\",this)'>"
			return str;
		},
		width : 40
	};
	if(!hasFlow){
		cmArr.splice(2,0,finishArr);
	}
	var cm = new Ext.grid.ColumnModel(cmArr)
	cm.defaultSortable = true;
	var nowUser = " and name='"+USERID+"' "
	if(isFlwTask || isFlwView){
		nowUser	= " and 1=1"
	}
	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : "storetype= '"+storetype+"' "+nowUser+" and "+pidWhereString
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.setDefaultSort(orderColumn, 'asc');
	
	
    //根据流程状态查询
    var billFilterArr = [['','查看全部'],['0','新建'],['-1','审批中'],['1','已审批']];
 	var dsBillState = new Ext.data.SimpleStore({
 		fields:['v','k'],
 		data:billFilterArr
 	})
 	
    var billStateFilter = new Ext.form.ComboBox({
    	id : 'billFilter',
    	fieldLabel : '流程状态',
		readOnly : true,
    	store : dsBillState,
    	width : 70,
    	readOnly : true,
		displayField : 'k',
    	valueField : 'v',
    	mode : 'local',
    	triggerAction : 'all',
    	emptyText:'查看全部',
    	listeners : {
			select : filterByBillState
		}
    })
    function filterByBillState(){
    	var filter = Ext.getCmp('billFilter').getValue();
    	if(filter==""){
    		ds.baseParams.params = " storetype= '"+storetype+"' "+nowUser+" and "+pidWhereString;
    	}else{
    		ds.baseParams.params = " billState='"+filter+"' and storetype= '"+storetype+"' "+nowUser+" and "+pidWhereString;
    	}
    	ds.reload();
    }
	

	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region : 'center',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><b>'+storetitle+'</b></font>','-',addRkdBtn,'-',editRkdBtn,'-',delRkdBtn,'-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 10,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		listeners : {
			'afterdelete' : function(grid, ids) {//删除主表记录后删除从表记录
				var hql = "delete from " + beanB + " where inId='" + ids
						+ "'";
				DWREngine.setAsync(false);
				baseDao.executeHQL(hql);
				DWREngine.setAsync(true);
				dsB.reload();
			}
		},
		addBtn : false,
		delBtn : false,
		saveBtn : false,
		primaryKey : primaryKey
	});
	if(isFlwTask || isFlwView){
		ds.baseParams.params = "in_no = '"+rkdbh+"'  and "+pidWhereString;
	}
	ds.load({ params:{start: 0, limit: 10 }});
	
	
	//---------------------------------------------------
	var fentanBtn = new Ext.Button({
		text: '到货分摊',
		iconCls: 'btn',
		handler: showFentan
	});
	var fentanSave = new Ext.Button({
		text: '保存分摊',
		iconCls: 'save',
        hidden : true,
		handler: saveFtNum
	})
	
	
	var gridPanelB = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-ss-panel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		//tbar : [btnList,'-',btnConMat,'-',btnStockPlan,'-'],
		tbar : [btnList,'-',btnConMat,'-',btnStockPlan,'-',fentanBtn,'-'],
		border : false,
		region : 'south',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		height: 300, 
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsB,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		//crudText: {add:'从采购单选'}, 
		addBtn : false,
		insertHandler: getGoodsMat,
		saveHandler: beforeSave,
		plant : PlantB,
		plantInt : PlantIntB,
		servletUrl : MAIN_SERVLET,
		bean:beanB,
		business : businessB,
		primaryKey : primaryKeyB
	});
	
	
	//--------------------到货分摊--------------------
	//查询出申请计划物资表
	var beanFt = "com.sgepit.pmis.wzgl.hbm.WzCjsxb";
	var businessFt = "baseMgm";
	var primaryKeyFt = "uids";
	
	var fmFt =  Ext.form;
	var fcFt = {
		'uids':{name:'uids',fieldLabel:'编号',hidden:true,hideLabel:true},
		'bh':{name:'bh',fieldLabel:'申请计划编号',anchor:'95%'},
		'jhbh':{name:'jhbh',fieldLabel:'采购计划编号',anchor:'95%'},
		'bm':{name:'bm',fieldLabel:'物资编码',anchor:'95%'},
		'pm':{name:'pm',fieldLabel:'品名',anchor:'95%'},
		'sqsl':{name:'sqsl',fieldLabel:'申请数量',anchor:'95%'},
		'ftsl':{name:'ftsl',fieldLabel:'分摊数量',anchor:'95%'},
        'tdTotalNum':{name:'tdTotalNum',fieldLabel:'替代总数',anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'PID',hidden:true}
	}
	var ColumnsFt = [
		{name:'uids',type:'string'},
		{name:'bh',type:'string'},
		{name:'jhbh',type:'string'},
		{name:'bm',type:'string'},
		{name:'pm',type:'string'},
		{name:'sqsl',type:'float'},
		{name:'ftsl',type:'float'},
		{name:'tdTotalNum',type:'float'},
		{name:'pid',type:'string'}
	];
	
	
	var PlantFt = Ext.data.Record.create(ColumnsFt);

	PlantIntFt = {
		uids: '',
		bh: '',
		jhbh: '',
		bm: '',
		pm: '',
		sqsl: '',
		ftsl: '',
        tdTotalNum : '',
		pid: CURRENTAPPID
	};
	
	var smFt = new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cmFt = new Ext.grid.ColumnModel([
		smFt,
		{id:'uids',header:fcFt['uids'].fieldLabel,dataIndex:fcFt['uids'].name,hidden:true},
		{id:'bh',header:fcFt['bh'].fieldLabel,dataIndex:fcFt['bh'].name},
		{id:'jhbh',header:fcFt['jhbh'].fieldLabel,dataIndex:fcFt['jhbh'].name},
		{id:'bm',header:fcFt['bm'].fieldLabel,dataIndex:fcFt['bm'].name},
		{id:'pm',header:fcFt['pm'].fieldLabel,dataIndex:fcFt['pm'].name},
		{id:'sqsl',header:fcFt['sqsl'].fieldLabel,dataIndex:fcFt['sqsl'].name},
		{id:'ftsl',header:fcFt['ftsl'].fieldLabel,dataIndex:fcFt['ftsl'].name,
			editor:new fmFt.NumberField(fc['ftsl']),
			renderer:function(value,cell,record){
				cell.attr = "style=background-color:#FBF8BF";
//				if(value>record.get('sqsl')){
//					Ext.example.msg('错误','['+record.get('bh')+']的分摊总数不能大于可分摊数量');
//				}
				return value;
			}
		},
		{id:'tdTotalNum',header:fcFt['tdTotalNum'].fieldLabel,dataIndex:fcFt['tdTotalNum'].name},
		{id:'pid',header:fcFt['pid'].fieldLabel,dataIndex:fcFt['pid'].name,hidden:true}
		/*
		,{header:'已领用数量',
			renderer:function(value,cell,record){
				var sql = "select nvl(sum(real_num),0) from mat_store_outsub where out_type = 4 and cat_no = '"+record.get('bm')+"' and app_id = '"+record.get('bh')+"'";
				var ylysl = 0;
				DWREngine.setAsync(false);
				baseMgm.getData(sql,function(num){
					ylysl = num;
				});
				DWREngine.setAsync(true);
				return "<div id='"+record.get('uids')+"'>"+ylysl+"</div>";
			}	
		}
		*/
	]);
	
	
	var dsFt = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanFt,
			business : businessFt,
			method : listMethod,
			params : pidWhereString
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyFt
		}, ColumnsFt),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	
	var catName,inNum,catNo,uuid;
	var fentanPanel = new Ext.grid.EditorGridTbarPanel({
		ds: dsFt,
		cm: cmFt,
		sm: smFt,
		tbar : ['<b>品名：</b><font id=name></font>','-','<b>编码：</b><font id=no></font>','-','<b>剩余可分摊总数量：</b><font id=num color=red></font>','->',fentanSave],
		region:'center',
		border : false,
		clicksToEdit : 1,
		stripeRows:true,
		header : false,
		autoScroll : true, // 自动出现滚动条
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsFt,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		addBtn : false,
		delBtn : false,
		saveBtn : false,
		//saveHandler : saveFtNum,
		plant : PlantFt,
		plantInt : PlantIntFt,
		servletUrl : MAIN_SERVLET,
		bean : beanFt,
		business : businessFt,
		primaryKey : primaryKeyFt
		
	});
	//dsFt.load({params:{start:0,limit:PAGE_SIZE}});
    
    //--------------------到货分摊替换列表--------------------
    
    var beanTd = "com.sgepit.pmis.material.hbm.MatStoreInReplace";
    var primaryKeyTd = "uids";
    var wzArr = new Array();
    DWREngine.setAsync(false);
    baseMgm.getData("select bm,pm,gg from wz_bm ",function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            temp.push(list[i][2]);
            wzArr.push(temp); 
        }
    });
    DWREngine.setAsync(true);
    
    var fcTd = {
        'uids':{name:'uids',fieldLabel:'编号',hidden:true},
        'pid':{name:'pid',fieldLabel:'PID',hidden:true},
        'bh':{name:'bh',fieldLabel:'申请计划编号',hidden:true},
        'bm':{name:'bm',fieldLabel:'物资编码',hidden:true},
        'tdBm':{name:'tdBm',fieldLabel:'替代物资编码'},
        'tdNum':{name:'tdNum',fieldLabel:'替代数量'}
    }
    var ColumnsTd = [
        {name:'uids',type:'string'},
        {name:'pid',type:'string'},
        {name:'bh',type:'string'},
        {name:'bm',type:'string'},
        {name:'tdBm',type:'string'},
        {name:'tdNum',type:'float'}
    ];
    var PlantTd = Ext.data.Record.create(ColumnsTd);
    var PlantIntTd = {
        uids: '',
        pid: CURRENTAPPID,
        bh: '',
        bm: '',
        tdBm: '',
        tdNum: ''
    };
    
    var smTd = new Ext.grid.CheckboxSelectionModel({singleSelect:false});

    var cmTd = new Ext.grid.ColumnModel([
        smTd,
        {id:'uids',header:fcTd['uids'].fieldLabel,dataIndex:fcTd['uids'].name,hidden:true},
        {id:'pid',header:fcTd['pid'].fieldLabel,dataIndex:fcTd['pid'].name,hidden:true},
        {id:'bh',header:fcTd['bh'].fieldLabel,dataIndex:fcTd['bh'].name,hidden:true},
        {id:'bm',header:fcTd['bm'].fieldLabel,dataIndex:fcTd['bm'].name,hidden:true},
        {id:'tdBm',header:fcTd['tdBm'].fieldLabel,dataIndex:fcTd['tdBm'].name,width:140,align:'center'},
        {header:'替代品名',dataIndex:fcTd['tdBm'].name,width:140,align:'center',
	        renderer:function(v,c,r){
	            var bm = r.get('tdBm');
		        for(var i=0;i<wzArr.length;i++){
		            if(wzArr[i][0]==bm){
		                return wzArr[i][1];
		            }   
		        }
	        }
        },
        {header:'替代规格型号',dataIndex:fcTd['tdBm'].name,width:140,align:'center',
	        renderer:function(v,c,r){
	            var bm = r.get('tdBm');
		        for(var i=0;i<wzArr.length;i++){
		            if(wzArr[i][0]==bm){
		                return wzArr[i][2];
		            }   
		        }
	        }
        },
        {id:'tdNum',header:fcTd['tdNum'].fieldLabel,dataIndex:fcTd['tdNum'].name,width:80,align:'right',
            editor:new Ext.form.NumberField(fcTd['tdNum']),
            renderer:function(value,cell,record){
                cell.attr = "style=background-color:#FBF8BF";
                return value;
            }
        },
        /*
        {header:'可用替代数量',dataIndex:fcTd['tdBm'].name,width:80,align:'right',
            renderer:function(v,c,r){
	            var bm = r.get('tdBm');
                
                return 0
            }
        },
        */
        {header:'本次到货数量',dataIndex:fcTd['tdBm'].name,width:80,align:'right',
            renderer:function(v,c,r){
	            var bm = r.get('tdBm');
	            var records = dsB.getRange();
	            for(var i=0;i<records.length;i++){
	                if(records[i].get("catNo")==bm){
	                    return records[i].get("inNum");
	                }   
	            }
	        }
        }
    ]);
    var dsTd = new Ext.data.Store({
        baseParams : {
            ac : "list",
            bean : beanTd,
            business : business,
            method : listMethod,
            params : ""
        },
        proxy : new Ext.data.HttpProxy({
            method : 'GET',
            url : MAIN_SERVLET
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount',
            id : primaryKeyTd
        }, ColumnsTd),
        remoteSort : true,
        pruneModifiedRecords : true
    });
    
    var tidaiSelect = new Ext.Button({
        text: '选择替代物资',
        iconCls: 'add',
        handler: function(){
            var record = smFt.getSelected();
            if(record == null || record == ""){
                Ext.example.msg('提示！', '请选择一条物资记录！');
                return;
            }
            selectTdWzWin.show();
        }
    });
    
    var tidaiSave = new Ext.Button({
        text: '保存替代',
        iconCls: 'save',
        handler: function(){
            
            var records = dsTd.getModifiedRecords();
            if(records == null || records.length == 0){
                return;
            }
            var tdArr = new Array();
            var sqsl = smFt.getSelected().get("sqsl");
            var ftsl = smFt.getSelected().get("ftsl");
            var tdsl = 0;    //所有替代物资数量之和
            for (var i = 0; i < dsTd.getRange().length; i++) {
                tdsl += dsTd.getRange()[i].get("tdNum");
                tdArr.push(dsTd.getRange()[i].data);
            }
            if(ftsl + tdsl > sqsl){
                //Ext.example.msg('提示！', '替代物资总数量与分摊数量之和，不能大于申请数量！');
                Ext.Msg.show({
	                title: '提示',
	                msg: '替代物资总数量与分摊数量之和，不能大于申请数量',
	                icon: Ext.Msg.WARNING, 
	                buttons: Ext.MessageBox.OK
	            })
                return;
            }
            var bh = smFt.getSelected().get("bh");//申请计划编号
            var bm = smFt.getSelected().get("bm");//申请计划细表物资编码
            DWREngine.setAsync(false);
            matStoreMgm.saveTdWz(tdArr,bh,bm,CURRENTAPPID,function(str){
                if(str == "1"){
                    Ext.example.msg('提示！', '替代物资保存成功！');
                    dsFt.reload();
                }else{
                    Ext.example.msg('提示！', '替代物资保存失败！');
                }
            });
            DWREngine.setAsync(true);
        }
    });

    var tidaiDel = new Ext.Button({
        text: '删除',
        iconCls: 'remove',
        handler: function(){
            var records = smTd.getSelections();
            if(records == null || records.length == 0){
                return;
            }
            Ext.MessageBox.confirm('确认','删除操作将不可恢复，确认要删除吗？',function(btn,text){
                if (btn == "yes") {
                    var bh = smFt.getSelected().get("bh");//申请计划编号
	                var bm = smFt.getSelected().get("bm");//申请计划细表物资编码
	                var uidsArr = new Array();
	                for (var i = 0; i < records.length; i++) {
	                    uidsArr.push(records[i].get("uids"));
	                }
	                DWREngine.setAsync(false);
	                matStoreMgm.deleteTdWz(uidsArr,bh,bm,CURRENTAPPID,function(str){
	                    if(str == "1"){
	                        Ext.example.msg('提示！', '替代物资删除成功！');
	                        dsFt.reload();
	                    }else if(str == "0"){
	                        Ext.example.msg('提示！', '替代物资删除失败！');
	                    }else{
                            var strArr = str.split(",");
                            var msg = "";
                            if(strArr.length > 0){
                                for (var i = 0; i < strArr.length; i++) {
                                    for (var j = 0; j < wzArr.length; j++) {
                                        if(strArr[i] == wzArr[j][0])
                                            msg += "&nbsp;&nbsp;"+wzArr[j][1]+"<br>";
                                    }
                                }
                            }
                            if(msg!=""){
                                Ext.Msg.show({
				                   msg: "以下物资已经被领用，将不会被删除！<br><br>"+msg,
				                   closable:false,
				                   buttons: Ext.Msg.OK,
                                   fn: function(btn){
                                        dsFt.reload();
				                   }
				                });   
                            }
	                    }
	                });
	                DWREngine.setAsync(true);
                }
            });
        }
    });
    var dsTdWz = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : beanB,
            business : businessB,
            method : listMethodB,
            params : ''
        },
        proxy : new Ext.data.HttpProxy({
            method : 'GET',
            url : MAIN_SERVLET
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount',
            id : primaryKeyB
        }, ColumnsB),
        remoteSort : true,
        pruneModifiedRecords : true
    });
    var smTdWz = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
    var selectTdWzPanel = new Ext.grid.GridPanel({
        ds : dsTdWz,
        cm : new Ext.grid.ColumnModel([
	        smTdWz,
	        {id:'uuid',header:fcB['uuid'].fieldLabel,dataIndex:fcB['uuid'].name,hidden:true},
	        {id:'pid',header:fcB['pid'].fieldLabel,dataIndex:fcB['pid'].name,hidden:true},
	        {id:'catNo',header:fcB['catNo'].fieldLabel,dataIndex:fcB['catNo'].name,width:180},
	        {id:'catName',header:fcB['catName'].fieldLabel,dataIndex:fcB['catName'].name,width:180},
	        {id:'inNum',header:fcB['inNum'].fieldLabel,dataIndex:fcB['inNum'].name,width:80},
	        {id:'inType',header:fcB['inType'].fieldLabel,dataIndex:fcB['inType'].name,width:80}
        ]),
        sm : smTdWz,
        tbar : ['->',{
            text : '确认选择替代物资',
            iconCls : 'add',
            handler : function(){
                var records = smTdWz.getSelections();
                if(records == null || records.length == 0){
                    Ext.example.msg('提示！', '请选择一条物资记录！');
                    return;
                }
                var bh = smFt.getSelected().get("bh");//申请计划编号
                var bm = smFt.getSelected().get("bm");//申请计划细表物资编码
                var bmArr = new Array();
                for (var i = 0; i < records.length; i++) {
                    bmArr.push(records[i].get("catNo"));
                }
                DWREngine.setAsync(false);
                matStoreMgm.getTdWz(bmArr,bh,bm,CURRENTAPPID,function(str){
                    if(str == "1"){
                        Ext.example.msg('提示！', '替代物资选择成功！');
                        selectTdWzWin.hide();
                    }else{
                        Ext.example.msg('提示！', '替代物资选择失败！');
                    }
                });
                DWREngine.setAsync(true);
            }
        }],
        viewConfig : {
            forceFit : true,
            ignoreAdd : true
        }
    });
    var selectTdWzWin = new Ext.Window({
        title:'选择到货替代物资',
        width:document.body.clientWidth*.8,
        height:document.body.clientHeight*.8,
        closeAction: 'hide',
        modal:true,
        plain:true,
        border: false,
        resizable: false,
        layout: 'fit',
        items: [selectTdWzPanel],
        listeners : {
            'show' : function(){
                var uuid = sm.getSelected().get("uuid");
                var bh = smFt.getSelected().get("bh");
                var bm = smFt.getSelected().get("bm");
                dsTdWz.baseParams.params = "1=1 and inType='清单' and inId='"+uuid+"' " +
                        " and inNum!=0 and pid='"+CURRENTAPPID+"' " +
                        " and catNo not in (select tdBm from "+beanTd+" where bh = '"+bh+"' and bm = '"+bm+"')";
                dsTdWz.load();
            },
            'hide' : function(){
                dsTd.reload();
            }
        }
    });
    var tidaiPanel = new Ext.grid.EditorGridTbarPanel({
        ds: dsTd,
        cm: cmTd,
        sm: smTd,
        tbar : ['->',tidaiSelect,'-',tidaiSave,'-',tidaiDel],
        region:'south',
        border : false,
        height: document.body.clientHeight*.5,
        clicksToEdit : 1,
        stripeRows:true,
        header : false,
        autoScroll : true, // 自动出现滚动条
        loadMask : true, // 加载时是否显示进度
        viewConfig : {
            forceFit : true,
            ignoreAdd : true
        },
        bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
            pageSize : PAGE_SIZE,
            store : dsTd,
            displayInfo : true,
            displayMsg : ' {0} - {1} / {2}',
            emptyMsg : "无记录。"
        }),
        addBtn : false,
        saveBtn : false,
        delBtn : false,
        plant : PlantTd,
        plantInt : PlantIntTd,
        servletUrl : MAIN_SERVLET,
        bean : beanTd,
        business : business,
        primaryKey : primaryKeyTd
    });
    smFt.on("rowselect",function(){
        var record = smFt.getSelected();
        dsTd.baseParams.params = " bh='"+record.get("bh")+"' and bm='"+record.get("bm")+"' ";
        dsTd.load({params:{start:0,limit:PAGE_SIZE}});
    });
        
    
    
	//----------------------------------------------------
	var fentanWin = new Ext.Window({
		title:'到货分摊',
		width:document.body.clientWidth*.9,
		height:document.body.clientHeight,
		closeAction: 'hide',
		modal:true,
		plain:true,
		border: false,
		resizable: false,
		layout: 'border',
		items: [fentanPanel,tidaiPanel]
	});
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false,
		items: [gridPanel, gridPanelB]
		
	}) 

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel],
		listeners:{
			afterlayout:function(){
				if (isFlwView == true){
					gridPanel.getTopToolbar().disable()
					gridPanelB.getTopToolbar().disable()
				}
				if(isFlwTask){
					with(gridPanel.getTopToolbar().items){
				    	addRkdBtn.disable();
				    	delRkdBtn.disable();
				    }
				    fentanBtn.disable();
				}
			}
		}
	});
	if (ModuleLVL >= 3){
		gridPanel.getTopToolbar().disable()
		gridPanelB.getTopToolbar().disable()
	}
//	if(!isFlwTask && !isFlwView)gridPanel.getTopToolbar().add('审批状态：',billStateFilter);
	if (!isFlwTask && !isFlwView){
		if(hasFlow){
			gridPanel.getTopToolbar().add('审批状态：',billStateFilter);
		}
	}
	var changeNum = 0;
	fentanPanel.on('afteredit',function(e){
        changeNum = 0;
		var n = Ext.getDom('num').innerText;
        var sqsl = e.record.get('sqsl');        //申请数量
        var tdsl = e.record.get('tdTotalNum');  //替代总数量
		if('ftsl' == e.field){
			if(e.value > sqsl){
				Ext.example.msg('错误','['+e.record.get('bh')+']的分摊数量不能大于申请数量');
                e.record.reject();
                return;
			}else{	
				if(changeNum > n){
					Ext.example.msg('错误','修改的分摊数量不能大于<b>剩余可分摊总数量</b>');
                    e.record.reject();
                    return;
				}else{
					changeNum += e.value-e.originalValue; 
				}
				if(changeNum > n){
					Ext.example.msg('错误','修改的分摊数量不能大于<b>剩余可分摊总数量</b>');
                    e.record.reject();
                    return;
				}	
			}
            if(parseInt(e.value,10) + parseInt(tdsl,10) > sqsl){
                Ext.example.msg('错误','分摊数量与替代总数之和不能大于申请数量</b>');
                e.record.reject();
                return;
            }
            
		}
        //修改后自动调用保存方法
        saveFtNum();
 	});
 	fentanPanel.on('aftersave',showFentanInfo);
	
 	function showFentanInfo(){
		catName = smB.getSelected().get('catName');
   		inNum = smB.getSelected().get('inNum');
   		catNo = smB.getSelected().get('catNo');
   		uuid = smB.getSelected().get('uuid');
	   		
	   		//inNum:可分摊总数量
	   			//库存数量
				var sql1 = "select nvl(sl,0) from wz_bm where bm = '"+catNo+"' and "+pidWhereString+" ";
				//所有非计划（包含当前）占用数量（审批中和新建的非计划出库中，出库单中所有该物资领用数量之和）
				var sql2 = "select nvl(sum(real_Num),0) from mat_store_outsub where cat_no = '"+catNo+"' and out_type = '2'  and out_id in (select uuid from mat_store_out where bill_state<>1 and "+pidWhereString+" ) and "+pidWhereString+" ";
				//分摊占用数量（已审批的申请计划中，当前物资的所有分摊数量之和）
				var sql3 = "select nvl(sum(ftsl),0) from wz_cjsxb where bm = '"+catNo+"' and bh in (select bh from wz_cjspb where bill_state=1 and "+pidWhereString+" ) and "+pidWhereString+" ";
				//已审批通过的计划内领用数量
				var sql4 = "select nvl(sum(real_num),0) from mat_store_outsub where out_type=4 and cat_no='"+catNo+"' and out_id in (select uuid from mat_store_out where out_type=4 and bill_state=1 and "+pidWhereString+" ) and "+pidWhereString+" ";
				
				var sql = "select ("+sql1+")-("+sql2+")-("+sql3+")+("+sql4+") from mat_store_insub where uuid= '"+uuid+"' and "+pidWhereString+" "
	   		
			DWREngine.setAsync(false);
			baseMgm.getData(sql,function(num){
				inNum = num;
			});
			DWREngine.setAsync(true);
				
			fentanWin.show();
			cmFt.defaultSortable = true;//可排序
			dsFt.baseParams.params = " bh in (select bh from WzCjspb where billState='1' and "+pidWhereString+" ) and bm = '"+catNo+"' and "+pidWhereString+" ";
			dsFt.load({params:{start:0,limit:PAGE_SIZE}});
			Ext.get('name').update(catName);
			Ext.get('num').update(inNum);
			Ext.get('no').update(catNo);
		//if(inNum==0)fentanSave.disable();
			changeNum = 0;
 	}
	
	//var catName,inNum,catNo;
	function showFentan(){
		var ftid = smB.getSelected();
		if(ftid==null || ftid==""){
            Ext.example.msg('提示！', '请选择一条物资记录！');
			/*Ext.Msg.show({
				title: '提示',
	            msg: '请选择一条物资记录',
	            icon: Ext.Msg.WARNING, 
	            width:200,
	            buttons: Ext.MessageBox.OK
			})*/
		}else{
	   		showFentanInfo();
		}
	}
	function saveFtNum(){
		var flag = true;
		var records = dsFt.getModifiedRecords();
		if(records.length==0)return;
		/*
		if(dsFt.sum('ftsl')>inNum){
			Ext.example.msg('错误','分摊总数不能大于可分摊数量');
			flag = false;
			return;
		}
		*/
		var appNum,ftNum
		for(var i=0;i<records.length;i++){
			appNum = records[i].get('sqsl');
			ftNum = records[i].get('ftsl');
			if(ftNum > appNum){
				Ext.example.msg('错误','['+records[i].get('bh')+']的分摊数量不能大于申请数量');
				flag = false;
				break;
			}
			var sql = "select nvl(sum(real_num),0) from mat_store_outsub where out_type = 4 and cat_no = '"+records[i].get('bm')+"' and app_id = '"+records[i].get('bh')+"' and "+pidWhereString+" ";
			var ylysl = 0;
			DWREngine.setAsync(false);
			baseMgm.getData(sql,function(num){
				ylysl = num;
				//alert(records[i].get('bh')+"--"+ylysl)
			});
			DWREngine.setAsync(true);
			if(ftNum<ylysl){
				Ext.example.msg('错误','['+records[i].get('bh')+']的分摊数量不能小于已经领用的数量');
				flag = false;
				break;
			}	
		}
		if(flag)fentanPanel.defaultSaveHandler();
	}
	
	//-------------------------------------------function ------------------------------
	
   sm.on('rowselect', function(sm, rowIndex, record){
   		cmB.defaultSortable = true;
   		inId = record.get('uuid');
   		var billState = record.get('billState')
   		dsB.baseParams.params = " inId ='" + inId + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   		if(!isFlwTask && !isFlwView){
	   		if(billState!="0"){
				with(gridPanel.getTopToolbar().items){
			    	editRkdBtn.disable();
			    	delRkdBtn.disable();
			    }
			    with(gridPanelB.getTopToolbar().items){
			    	btnList.disable();
			    	btnConMat.disable();
			    	btnStockPlan.disable();
			    	if(billState=="1"){
			    		fentanBtn.enable();
			    	}else{
			    		fentanBtn.disable();
			    	}
			    	get('save').disable();
			    	get('del').disable();
			    	delRkdBtn.disable();;
			    }
			}else{
				with(gridPanel.getTopToolbar().items){
			    	editRkdBtn.enable();
			    	delRkdBtn.enable();
			    }
			    with(gridPanelB.getTopToolbar().items){
			    	btnList.enable();
			    	btnConMat.enable();
			    	btnStockPlan.enable();
			    	fentanBtn.disable();
			    	get('save').enable();
			    	get('del').enable();
			    	delRkdBtn.enable();
			    }
			}
   		}
   })	
    smB.on("rowselect",function(smB, rowIndex, record){
        var inType = record.get('inType')
        if(inType == "清单"){
            fentanBtn.setDisabled(true);
        }else{
            if(sm.getSelected().get("billState") == "1"){
                fentanBtn.setDisabled(false);
            }
        }
    });

    // 物资清单  
   	function selectList(){
   		if (sm.hasSelection()){
   			var inId = sm.getSelected().get('uuid');
//   			window.location.href = BASE_PATH+"jsp/material/mat.appbuy.app.tree.jsp?inId="
//   					+inId + "&type=storeIn";
//   			var url = BASE_PATH+"jsp/material/mat.appbuy.app.tree.jsp"
   			var params = "inId=" +inId + "&type=storeIn&page=storein2";
   			selectWinShow(params);
   		}else{
            Ext.example.msg('提示！', '请选择一条入库记录！');
   			/*Ext.Msg.show({
				title: '提示',
	            msg: '请选择一条入库记录',
	            icon: Ext.Msg.WARNING, 
	            width:200,
	            buttons: Ext.MessageBox.OK
			})*/
   		}
   	}
   	
   	// 到货单  
   	function selectGoods(){
   		if (sm.hasSelection()){
   			var inId = sm.getSelected().get('uuid');
//   			window.location.href = BASE_PATH+"jsp/material/mat.store.in.select.jsp?inId=" + inId;
//   			var url = BASE_PATH+"jsp/material/mat.store.in.select.jsp"
   			var params = "inId=" +inId + "&type=storeIn&page=storein3";
   			selectWinShow(params);   			
   		}else{
   			Ext.example.msg('提示！', '请选择一条入库记录！');
            /*Ext.Msg.show({
                title: '提示',
                msg: '请选择一条入库记录',
                icon: Ext.Msg.WARNING, 
                width:200,
                buttons: Ext.MessageBox.OK
            })*/
   		}
   	}
   	
   	// 选购单(grid)
   	function getGoodsMat(){ 
    	if (sm.hasSelection()){
   			var inId = sm.getSelected().get('uuid');
//   			window.location.href = BASE_PATH+"jsp/material/mat.goods.check.select.jsp?inId="
//   					+inId + "&type=storeIn";
//   			var url = BASE_PATH+"jsp/material/mat.goods.check.select.jsp"
   			var params = "inId=" +inId + "&type=storeIn&page=storein4";
   			selectWinShow(params);
   		}else{
   			Ext.example.msg('提示！', '请选择一条入库记录！');
            /*Ext.Msg.show({
                title: '提示',
                msg: '请选择一条入库记录',
                icon: Ext.Msg.WARNING, 
                width:200,
                buttons: Ext.MessageBox.OK
            })*/
   		}
   	}
   	
   	//2010-11-22 zhangh
   	//从采购计划中选
   	function selectStockPlan(){
   	    if (sm.hasSelection()){
   			var inId = sm.getSelected().get('uuid');
//   			window.location.href = BASE_PATH+"jsp/material/mat.goods.check.select.jsp?inId="
//   					+inId + "&type=storeIn";
//   			var url = BASE_PATH+"jsp/material/mat.goods.check.select.jsp"
   			var params = "inId=" +inId + "&type=storeIn&page=storein5" 
   			selectWinShow(params)
   		}else{
   			Ext.example.msg('提示！', '请选择一条入库记录！');
            /*Ext.Msg.show({
                title: '提示',
                msg: '请选择一条入库记录',
                icon: Ext.Msg.WARNING, 
                width:200,
                buttons: Ext.MessageBox.OK
            })*/
   		}
   	}
   	
   	function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    function beforeSave(){
   		var records = dsB.getModifiedRecords();
   		var flag = true;
   		for (var i=0; i<records.length; i++){
   			
   			//入库数不能大于采购的判断
   			var record = records[i];
   			var conid = sm.getSelected().get('conid');
			var cgjhbh = record.get('formId')
			var inNum = record.get('inNum');
			//alert(conid+"-"+cgjhbh+"-"+inNum)
			var num = 0;
			if(record.get('inType')=='采购计划'){
				DWREngine.setAsync(false);
				baseMgm.getData("select bm,ygsl from wz_cjhxb where bh='"+cgjhbh+"' and "+pidWhereString+" ",function(obj){
					for(var i=0;i<obj.length;i++){
						if(obj[i][0]==record.get('catNo')){
							num = obj[i][1];
							break;
						}
					}
				})
				DWREngine.setAsync(true);
			}else if(record.get('inType')=='采购合同'){
				DWREngine.setAsync(false);
				baseMgm.getData("select bm,sl from con_mat where hth='"+conid+"' and "+pidWhereString+" ",function(obj){
					for(var i=0;i<obj.length;i++){
						if(obj[i][0]==record.get('catNo')){
							num = obj[i][1];
							break;
						}
					}
				})
				DWREngine.setAsync(true);
			}
			//判断结束

			if(inNum>num && record.get('inType')!="清单"){
				Ext.Msg.show({
					title: '提示',
		            msg: '【'+record.get('catName')+'】的入库数量出错，<br><br>入库数量不能大于采购数量，<br><br>采购数量为：'+num,
		            //icon: Ext.Msg.WARNING, 
		            //width:250,
		            buttons: Ext.MessageBox.OK
				})
				flag = false;
				break;
			}
			records[i].set('subSum', parseFloat(records[i].get('price'))*parseFloat(records[i].get('inNum')));
   		}
   		if(flag){
   			gridPanelB.defaultSaveHandler();
   			if (isFlwTask == true){
				Ext.Msg.show({
					title: '您成功维护了'+storetitle+'信息！',
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
   	
   	function newWin(){
		if(!conWindow){
	         conWindow = new Ext.Window({
	             title: '合同列表',
	             layout: 'fit',
	             width: 800,
	             height: 450,
	             modal: true,
	             closeAction: 'hide',
	             constrain:true,
	             maximizable: true,
	             plain: true,
	             items: gridCon
             });
    	}
    	dsCon.load({params:{start: 0,limit:  PAGE_SIZE}});
    	conWindow.show();
   	}
   	
   	function conName(value){
   		var conname = '';
   		if(value == ''||value == null)
   			return ''
   		DWREngine.setAsync(false);  
		var str = '';
   		for(var i=0; i<htType.length; i++) {
   			if (htType[i][0] == value) {
   				str = htType[i][1]
   				break; 
   			}
   		}
   		var qtip = "qtip=" + str;
	    return'<span ' + qtip + '>' + str + '</span>';
   		DWREngine.setAsync(true);    		
   	}
   	
   	
   	function selectWinShow(params){
   		if(!selectWin){
   			selectWin = new Ext.Window({
   				title:'选择',
   				closeAction:'hide',
   				//width:800,height:450,
                width: document.body.clientWidth,
                height: document.body.clientHeight,
   				modal:true,plain:true,border: false, resizable: false,
   				autoLoad:{
   					url:BASE_PATH +'Business/material/viewDispatcher.jsp',
   					text:'loading...'
   				},
				listeners: {
					hide: function(){
						dsB.reload();
						if (isFlwTask == true){
							Ext.Msg.show({
								title: '您成功维护了'+storetitle+'信息！',
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
   			})
   		}
   		selectWin.autoLoad.params = params;
   		selectWin.show();
   		selectWin.doAutoLoad();
   	}
});

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

function popWinwdow(mode){
	if(mode == "insert"){
		window.location.href = BASE_PATH+"Business/material/mat.store.in.addorupdate.jsp?hasFlow="+hasFlow;
	}else if(mode == "update"){
		var rec = sm.getSelected()
		if(rec){
			var inNo = rec.get('inNo');
			var uuid = rec.get('uuid');
			window.location.href = BASE_PATH+"Business/material/mat.store.in.addorupdate.jsp?rkdbh="
		    			+ inNo + "&uuid=" + uuid + "&isTask="+isFlwTask+ "&isView="+isFlwView+"&hasFlow="+hasFlow;
		}
	}
}
function finishFun(uids, finished){
	DWREngine.setAsync(false);
    var sql = "update MAT_STORE_IN set BILL_STATE='1' where UUID='"+uids+"'";
    baseDao.updateBySQL(sql,function(str){
        if(str == "1"){
            Ext.example.msg("提示","完结操作成功！");
            finished.checked = true;
            ds.reload();
        }
    })
    DWREngine.setAsync(true);
}
