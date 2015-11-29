var bean = "com.sgepit.pmis.material.hbm.MatStoreOut"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "uuid"
var orderColumn = "uuid"

var beanOut = "com.sgepit.pmis.material.hbm.MatStoreOutsub"

//1-----领料单  or  2------计划外出库 or     3------退料单
//2011-11-08 增加出库类型 5：替代物资
var outTypeArr = [['1','领料单'],['2','计划外出库'],['3','退料单'],['4','计划内领用'],['5','替代物资']]
var billTypes = new Array();
var gridPanel,gridPanelOut;
var ds,dsOut;
var PAGE_SIZE = 10;
var PAGE_SIZE_OUT = 20;
var selectedData;
var selectUuid,selectUuidOut;
var maxStockBhPrefix,maxStockBh,incrementLsh;
var selectRecord=""; 

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
var bdgArr = new Array();//概算
var subjectArr = new Array();//财务科目
var hasFlow=false;//页面是否配置流程
Ext.onReady(function(){
	DWREngine.setAsync(false);
    var rtnState='';
	systemMgm.getFlowType(USERUNITID,MODID,function(rtn){
	    rtnState=rtn;
	})
	if(isFlwTask != true && isFlwView != true){
		if(rtnState=='BusinessProcess'){
		    hasFlow=true;
		}else if(rtnState=='ChangeStateAuto'){
		    hasFlow=false;
		}else if(rtnState=='None'){
		    hasFlow=false;
		}else{
			hasFlow=false;
		}
	}else{
		hasFlow=true;
	}
	DWREngine.setAsync(true);
	//查询出仓库
	DWREngine.setAsync(false);
	var wareArray = new Array();
	//com.sgepit.pmis.wzgl.hbm.WzCkh
	baseMgm.getData("select uids,ckmc from wz_ckh where "+pidWhereString+" ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			wareArray.push(temp);
		}
	})
	
	//申请人
	var userArray = new Array();
	baseMgm.getData("select userid,realname from rock_user where unitid = '"+CURRENTAPPID+"' ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArray.push(temp);
		}
	})
	
	//申请人部门
	var deptArray = new Array();
 	baseMgm.getData("select unitid,unitname from sgcc_ini_unit where UPUNIT = '"+CURRENTAPPID+"' order by unitid",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			deptArray.push(temp);
		}
    });
    
    //出库单号
    maxStockBhPrefix = USERNAME + new Date().format('ym');
	stockMgm.getStockPlanNewBh(maxStockBhPrefix,"OUT_NO","MAT_STORE_OUT",null,function(dat){
		if(dat != "")	{
			maxStockBh = dat;
			incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
		}	
	})
	
	appMgm.getCodeValue('流程状态',function(list){         //流程审批状态
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);	
				billTypes.push(temp);	
			}
	    });
	baseMgm.getData("select bdgid,bdgname from bdg_info where pid='"
					+ CURRENTAPPID + "' order by bdgid ", function(list) {
			for (var i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i][0]);
				temp.push(list[i][1] + " - " + list[i][0]);
				bdgArr.push(temp);
			}
		});
	baseDao.getData("select TREEID,SUBJECT_ALLNAME from FACOMP_FINANCE_SUBJECT where PID='"
					+ CURRENTAPPID + "'", function(list) {
			for (i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				subjectArr.push(temp);
			}
		});
	DWREngine.setAsync(true);
	
 	var wareArrayDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:wareArray
 	})
 
	var bdginfoDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : bdgArr
	});

	var addBtnWz = new Ext.Button({
    	text:'选择领用物资',
    	iconCls : 'add',
    	handler:addWZ
    })

	var fm = Ext.form;
	var fc = {
		'uuid':{name:'uuid',fieldLabel:'编号',hidden:true,hideLabel:true},
		'outNo':{name:'outNo',fieldLabel:'出库单号',allowBlank:false},
		'outDate':{name:'outDate',fieldLabel:'出库日期',allowBlank:false},
		'sendWare':{name:'sendWare',fieldLabel:'发料仓库',allowBlank:false,
			valueField:'k',
			displayField: 'v',
			mode: 'local',
	    	triggerAction: 'all',
	    	store:wareArrayDs,
	    	allowBlank:false,
	    	readOnly:true
		},
		'dealMan':{name:'dealMan',fieldLabel:'经手人',allowBlank:false},
		'dept':{name:'dept',fieldLabel:'部门',allowBlank:false},
		'remark':{name:'remark',fieldLabel:'备注'},
		'outType':{name:'outType',fieldLabel:'出库类别'},
		'billState':{
			name:'billState',
			fieldLabel:'审批状态',
			anchor:'95%'
		},
		'pid':{name:'pid',fieldLabel:'PID',value:CURRENTAPPID,hidden:true},
		'using' : {name : 'using',fieldLabel : '领料用途'},
		'finished':{
			name:'finished',
			fieldLabel:'完结',
			anchor:'95%'
		},
		'financialSubjects' : {name : 'financialSubjects' ,fieldLabel : '对应财务科目'}
	};
	
	var Columns = [
		{name:'uuid',type:'string'},
		{name:'outNo',type:'string'},
		{name:'outDate',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'sendWare',type:'string'},
		{name:'dealMan',type:'string'},
		{name:'dept',type:'string'},
		{name:'remark',type:'string'},
		{name:'outType',type:'string'},
		{name:'billState', type:'string'},
		{name:'pid', type:'string'},
		{name:'auditState', type:'string'},
		{name : 'using', type : 'string'},
		{name : 'financialSubjects' ,type : 'string'}
	];
	
	
	var Plant = Ext.data.Record.create(Columns);

	PlantInt = {
		uuid:'',
		outNo:flowbh,
		outDate:'',
		sendWare:'',
		dealMan:USERID,
		dept:USERDEPTID,
		remark:'',
		outType:'4',
		billState:'0',
		pid:CURRENTAPPID,
		using : '',
		financialSubjects : ''
	};

	var subjectTreeCombo = new Ext.ux.TreeCombo({
				name : 'financialSubjects',
				fieldLabel : '财务科目',
				resizable : true,
				treeWidth : 250,
				anchor : '95%',
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "subjectColumnTree",
								businessName : 'faBaseInfoService',
								parent : '01',
								pid : CURRENTAPPID
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : "01",
							text : "财务科目",
							iconCls : 'form',
							expanded : true
						}),
				listeners : {
					'select' : function(tree, node) {
						if (node.id == '01') {
							Ext.example.msg("信息提示：", "请选择分类下的子分类！");
							this.setRawValue("");
							return;
						}
						this.setRawValue(node.text);
					},
					'show' : function() {
						var rec = sm.getSelected();
						var subjectTreeid = rec.get('financialSubjects');
						if (subjectTreeid) {
							for (var i = 0; i < subjectArr.length; i++) {
								if (subjectTreeid == subjectArr[i][0]) {
									subjectTreeCombo.value = subjectTreeid;
									subjectTreeCombo.setRawValue(subjectArr[i][1]);
									break;
								}
							}
						} else {
							subjectTreeCombo.value = '';
							subjectTreeCombo.setRawValue('');
						}
					}
				}
			});
	subjectTreeCombo.getTree().on('beforeload', function(node) {
				subjectTreeCombo.getTree().loader.baseParams.parent = node.id;
			});

	var usingCombo = new Ext.form.ComboBox({
				name : 'using',
				fieldLabel : '领料用途',
				triggerClass : 'x-form-date-trigger',
				onTriggerClick : function() {
					bdgTreeWin.show();
				},
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : bdginfoDs,
				readOnly : true,
				listeners : {
					'show' : function(){
						var v = sm.getSelected().get('using');
						for(var i = 0; i < bdgArr.length; i++){
							if(v == bdgArr[i][0]){
								this.setRawValue(bdgArr[i][1]);
								break;
							}
						}
					}
				}
			})

	// 生成概算树
	var rootText = "工程概算";

	var rootNew = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'task-folder',
				expanded : true,
				id : '01'
			});
	var treeLoaderNew = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "equBdgTree",
					businessName : "equBaseInfo",
					bdgid : CURRENTAPPID + '-0101,' + CURRENTAPPID + '-0102,'
							+ CURRENTAPPID + '-0103,' + CURRENTAPPID + '-0104',
					parent : 0
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	var treePanelNew = new Ext.tree.ColumnTree({
				width : 550,
				header : false,
				border : false,
				lines : true,
				autoScroll : true,
				columns : [{
							header : '概算名称',
							width : 380, // 隐藏字段
							dataIndex : 'bdgname'
						}, {
							header : '概算编号',
							width : 140,
							dataIndex : 'bdgno'
						}, {
							header : '概算主键',
							width : 0,
							dataIndex : 'bdgid'
						}, {
							header : '是否子节点',
							width : 0,
							dataIndex : 'isleaf'
						}, {
							header : '父节点',
							width : 0,
							dataIndex : 'parent'
						}],
				loader : treeLoaderNew,
				root : rootNew,
				// rootVisible : false,
				tbar : [{
							iconCls : 'icon-expand-all',
							tooltip : 'Expand All',
							text : '全部展开',
							handler : function() {
								rootNew.expand(true);
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : 'Collapse All',
							text : '全部收起',
							handler : function() {
								rootNew.collapse(true);
							}
						}, '-', {
							text : '选择概算',
							iconCls : 'add',
							handler : function() {
								if (thisBdgid == null || thisBdgid == "0") {
									Ext.example.msg('提示信息', '请选择概算项！');
									return false;
								}
								var rec = sm.getSelected();
								rec.set('using',thisBdgid);
								bdgTreeWin.hide();
							}
						}]
			});

	treePanelNew.on('beforeload', function(node) {
				bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = CURRENTAPPID + '-01';
				var baseParams = treePanelNew.loader.baseParams;
				baseParams.parent = bdgid;
			})

	treePanelNew.on('click', function(node, e) {
				var tempNode = node;
				var isRootNode = (rootText == tempNode.text);
				thisBdgid = isRootNode ? "0" : tempNode.attributes.bdgid;
				thisBdgno = isRootNode ? "0" : tempNode.attributes.bdgno;
				thisBdgname = isRootNode ? "0" : tempNode.attributes.bdgname;
			});

	var bdgTreeWin = new Ext.Window({
				id : 'selectwin',
				title : '选择概算',
				width : 550,
				height : 400,
				layout : 'fit',
				border : false,
				resizable : false,
				closeAction : "hide",
				items : [treePanelNew],
				listeners : {
					'show' : function() {
						treePanelNew.render(); // 显示树
						treePanelNew.expand();
					}
				}
			});

	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cmArr=[
		sm,
		{id:'uuid',header:fc['uuid'].fieldLabel,dataIndex:fc['uuid'].name,hidden:true},
		{id:'outNo',header:fc['outNo'].fieldLabel,dataIndex:fc['outNo'].name,align:'center'
			//editor:new Ext.form.TextField(fc['outNo'])
		},
		{id:'outDate',header:fc['outDate'].fieldLabel,dataIndex:fc['outDate'].name,align:'center',
			renderer: formatDate,
			editor:new Ext.form.DateField(fc['outDate'])
		},
		{id:'sendWare',header:fc['sendWare'].fieldLabel,dataIndex:fc['sendWare'].name,align:'center',
			renderer:function(value){
				for(var i=0;i<wareArray.length;i++){
					if(wareArray[i][0]==value){
						return wareArray[i][1];
					}
				}
			},
			editor:new Ext.form.ComboBox(fc['sendWare'])
		},
		{id:'dealMan',header:fc['dealMan'].fieldLabel,dataIndex:fc['dealMan'].name,align:'center',
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{id:'dept',header:fc['dept'].fieldLabel,dataIndex:fc['dept'].name,align:'center',
			renderer:function(value){
				for(var i = 0;i<deptArray.length;i++){
					if(value == deptArray[i][0]){
						return deptArray[i][1]
					}
				}
			}			
		},
		{id:'remark',header:fc['remark'].fieldLabel,dataIndex:fc['remark'].name,align:'center',
			editor:new Ext.form.TextField(fc['remark'])
		},
		{id:'outType',header:fc['outType'].fieldLabel,dataIndex:fc['outType'].name,align:'center',width : 80,
			renderer:function(value){
				for(var i=0;i<outTypeArr.length;i++){
					if(outTypeArr[i][0] == value){
						return outTypeArr[i][1]
					}
				}
			}
		},
		{
			id:'billState',
			header:fc['billState'].fieldLabel,
			dataIndex:fc['billState'].name,
			align:'center',
			width : 70,
			hidden:!hasFlow,
			renderer : billTypeRender
		}, {
           id:'financialSubjects',
           header: fc['financialSubjects'].fieldLabel,
           dataIndex: fc['financialSubjects'].name,
           editor : subjectTreeCombo,	//财务科目
           width: 200,
           renderer : function(v){
				for(var i = 0; i < subjectArr.length; i++){
					if(v == subjectArr[i][0]){
						return subjectArr[i][1];
					}
				}
           }
        }, {
           id:'using',
           header: fc['using'].fieldLabel,
           dataIndex: fc['using'].name,
           editor : usingCombo,	//领料用途
           width: 180,
           renderer : function(v){
				for(var i = 0; i < bdgArr.length; i++){
					if(v == bdgArr[i][0]){
						return bdgArr[i][1];
					}
				}
           }
        },
		{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true},
		{
			id : 'auditState',
			header : '稽核状态',
			dataIndex : 'auditState',
			align : 'center',
			width : 70,
			renderer : function(v) {
				var str = '未稽核';
				if (v == '1') {
					str = '已稽核';
				} else if (v == '2') {
					str = '撤销稽核';
				}
				return str;
			}
		}
	];
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
	var cm = new Ext.grid.ColumnModel(cmArr);
	
	cm.defaultSortable = true;//可排序
	var nowUser = " and dealMan='"+USERID+"' "
	if(isFlwTask || isFlwView){
		nowUser	= " and 1=1"
	}
	ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod,
			params:" outType='4' "+nowUser+" and "+pidWhereString
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns),
		remoteSort: true,
        pruneModifiedRecords: true
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
    	emptyText : '查看全部',
    	listeners : {
			select : filterByBillState
		}
    })
    function filterByBillState(){
    	var filter = Ext.getCmp('billFilter').getValue();
    	if(filter==""){
    		ds.baseParams.params = " outType='4' "+nowUser+" and "+pidWhereString;
    	}else{
    		ds.baseParams.params = "billState='"+filter+"' and outType='4' "+nowUser+" and "+pidWhereString;	
    	}
    	ds.reload();
    }
	
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		region:'north',
		border : false,
		height: 286, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		stripeRows:true,
		//addBtn:false,
		//delBtn:false,
		//saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>计划内领用<B></font>','-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		//insertHandler:insertData,
		saveHandler:saveData,
		deleteHandler:deleteData,
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey,
		//流程状态不为0时，取消编辑
		listeners: {
			beforeedit:function(e){
	            var currRecord = e.record;
	            if (currRecord.get('auditState') == '1') {
	            	Ext.example.msg('提示','此数据已稽核,不可修改');
	            	return false;
	            }
	            if (currRecord.get("billState") != '0')   
	                e.cancel = true;   
	        }
		}
	});
	gridPanel.on("afterinsert",function(){
		if(flowbh!=null && flowbh!=""){
			maxStockBh = flowbh;
		}
		var rec = sm.getSelected();
		if(maxStockBh!= null){
			rec.set("outNo",maxStockBh);
		} else{
			incrementLsh = incrementLsh +1
			rec.set("outNo",maxStockBhPrefix + String.leftPad(incrementLsh,4,"0"))
		}
		maxStockBh = null;
		if(isFlwTask){
			selectRecord = rec;
		}
	})
	if(isFlwTask || isFlwView){
		ds.baseParams.params += " and outNo = '"+flowbh+"' and "+pidWhereString+" ";
	}
	if(!isFlwTask)ds.load({params:{start:0,limit:PAGE_SIZE}});
    
    
    //-------------------------出库子表
    
    var fcOut = {
		'uuid':{name:'uuid',fieldLabel:'编号',hidden:true,hideLabel:true},
		'outId':{name:'outId',fieldLabel:'出库单主键'},
		'appId':{name:'appId',fieldLabel:'申请计划编号'},
		'matId':{name:'matId',fieldLabel:'材料主键'},
		'catNo':{name:'catNo',fieldLabel:'材料编码'},
		'catName':{name:'catName',fieldLabel:'材料名称'},
		'spec':{name:'spec',fieldLabel:'规格型号'},
		'unit':{name:'unit',fieldLabel:'库存单位'},
		'appNum':{name:'appNum',fieldLabel:'申请数量'},
		'realNum':{name:'realNum',fieldLabel:'领用数量'},
		'price':{name:'price',fieldLabel:'单价',decimalPrecision : 4},
		'money':{name:'money',fieldLabel:'金额',decimalPrecision : 4},
		'outType':{name:'outType',fieldLabel:'出库类别'},
		'pid':{name:'pid',fieldLabel:'PID',hidden:true}
	};
	
	var ColumnsOut = [
		{name:'uuid',type:'string'},
		{name:'outId',type:'string'},
		{name:'appId',type:'string'},
		{name:'matId',type:'string'},
		{name:'catNo',type:'string'},
		{name:'catName',type:'string'},
		{name:'spec',type:'string'},
		{name:'unit',type:'string'},
		//{name:'sqsl',type:'float'},	//申请数量
		{name:'appNum',type:'float'},
		{name:'realNum',type:'float'},
		{name:'price',type:'float'},
		{name:'money',type:'string'},
		{name:'outType',type:'string'},
		{name:'pid',type:'string'}
	];
	
	
	var PlantOut = Ext.data.Record.create(ColumnsOut);

	PlantIntOut = {
		uuid:'',
		outId:selectUuid,
		appId:'',
		matId:'',
		catNo:'',
		catName:'',
		spec:'',
		unit:'',
		appNum:'',
		realNum:'',
		price:'',
		money:'',
		outType:'',
		pid:CURRENTAPPID
	};
	
	var smOut =  new Ext.grid.CheckboxSelectionModel();

	var cmOut = new Ext.grid.ColumnModel([
		smOut,
		{id:'uuid',header:fcOut['uuid'].fieldLabel,dataIndex:fcOut['uuid'].name,hidden:true},
		{id:'outId',header:fcOut['outId'].fieldLabel,dataIndex:fcOut['outId'].name,hidden:true},
		{id:'appId',header:fcOut['appId'].fieldLabel,dataIndex:fcOut['appId'].name,align:'center'},
		{id:'matId',header:fcOut['matId'].fieldLabel,dataIndex:fcOut['matId'].name,hidden:true},
		{id:'catNo',header:fcOut['catNo'].fieldLabel,dataIndex:fcOut['catNo'].name,align:'center'},
		{id:'catName',header:fcOut['catName'].fieldLabel,dataIndex:fcOut['catName'].name,align:'center'},
		{id:'spec',header:fcOut['spec'].fieldLabel,dataIndex:fcOut['spec'].name,align:'center'},
		{id:'unit',header:fcOut['unit'].fieldLabel,dataIndex:fcOut['unit'].name,align:'center'},
		
		//申请数量
		{id:'appNum',header:fcOut['appNum'].fieldLabel,dataIndex:fcOut['appNum'].name,align:'center'},
		//分摊数量
		{id:'ftsl',header:'分摊数量',align:'center',
			renderer:function(value,cell,record){
				var ftsl = "";
                var sql = "select nvl(ftsl,0) from wz_cjsxb where bh='"+record.get('appId')+"' and bm='"+record.get('catNo')+"' and pid='"+CURRENTAPPID+"'";
                if(record.get("outType")=="5"){
                    sql = "select nvl(td_num,0) from mat_store_in_replace where bh='"+record.get('appId')+"' and td_bm='"+record.get('catNo')+"' and pid='"+CURRENTAPPID+"'";
                }
				DWREngine.setAsync(false);
				baseMgm.getData(sql,function(list){
					ftsl = list;
				})
				DWREngine.setAsync(true);
				return ftsl;	
			}	
		},
		//剩余数量
		{id:'sysl',header:'<font color=red>剩余可领数量</font>',align:'center',
			renderer:function(value,cell,record){
				var sysl = "";
				var sql = "select avg(nvl(ftsl,0))-sum(nvl(real_num,0)) from wz_cjsxb wz,mat_store_outsub sub " +
						" where wz.bh=sub.app_id and wz.bm=sub.cat_no and wz.bh='"+record.get('appId')+"' " +
						" and wz.bm='"+record.get('catNo')+"'  and wz.pid='"+CURRENTAPPID+"' ";
                if(record.get("outType")=="5"){
                    sql = "select avg(nvl(td_num,0)) - sum(nvl(real_num,0)) from mat_store_in_replace re,mat_store_outsub sub " +
                        " where re.bh=sub.app_id and re.td_bm=sub.cat_no and re.bh='"+record.get('appId')+"' " +
                        " and re.td_bm='"+record.get('catNo')+"'  and re.pid='"+CURRENTAPPID+"' ";
                }
				DWREngine.setAsync(false);
				baseMgm.getData(sql,function(list){
					sysl = list;
				})
				DWREngine.setAsync(true);
				return sysl;	
			}
		},
		//领用数量
		{id:'realNum',header:fcOut['realNum'].fieldLabel,dataIndex:fcOut['realNum'].name,align:'center',
			editor:new Ext.form.NumberField(fcOut['realNum']),
			renderer:function(value,cell,record){
//			    cell.attr = "style=background-color:#FBF8BF";return value
				cell.attr = "style=background-color:#FBF8BF";
				//查询出分摊数量
				var ftsl = "";
                var sql = "select nvl(ftsl,0) from wz_cjsxb where bh='"+record.get('appId')+"' and bm='"+record.get('catNo')+"' and pid='"+CURRENTAPPID+"' ";
                if(record.get("outType")=="5"){
                    sql = "select nvl(td_num,0) from mat_store_in_replace where bh='"+record.get('appId')+"' and td_bm='"+record.get('catNo')+"' and pid='"+CURRENTAPPID+"'";
                }
				DWREngine.setAsync(false);
				baseMgm.getData(sql,function(list){
					ftsl = list;
				})
				DWREngine.setAsync(true);
				if(value>ftsl){
					Ext.Msg.show({
						title: '提示',
			            msg: '领用数量不能大于剩余可领数量',
			            icon: Ext.Msg.WARNING, 
			            width:200,
			            buttons: Ext.MessageBox.OK
					})
				}
			   return value;
			}
		},
		{id:'price',header:fcOut['price'].fieldLabel,dataIndex:fcOut['price'].name,align:'center',
			randerer : function(v){
				return v.toFixed(4);
			}
		},
		{id:'money',header:fcOut['money'].fieldLabel,dataIndex:fcOut['money'].name,align:'center',
			renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
//				return "<div align=right>"+ cnMoneyFour(record.data.realNum*record.data.price) +"</div>";
				return "<div align=right>￥"+ parseFloat(record.data.realNum*record.data.price) +"</div>";
			}
		},
		{id:'outType',header:fcOut['outType'].fieldLabel,dataIndex:fcOut['outType'].name,align:'center',
			renderer:function(value){
				for(var i=0;i<outTypeArr.length;i++){
					if(outTypeArr[i][0] == value){
						return outTypeArr[i][1]
					}
				}
			}
		},
		{id:'pid',header:fcOut['pid'].fieldLabel,dataIndex:fcOut['pid'].name,hidden:true}
	]);
	
	dsOut = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:beanOut,
			business:business,
			method: listMethod,
			params:pidWhereString
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},ColumnsOut),
		remoteSort: true,
        pruneModifiedRecords: true
	});
	
	dsOut.setDefaultSort(orderColumn, 'asc');
	
	gridPanelOut = new Ext.grid.EditorGridTbarPanel({
		ds : dsOut,
		cm : cmOut,
		sm : smOut,
		region:'center',
		border : false,
		//height: 300, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		stripeRows:true,
		addBtn:false,
		//delBtn:false,
		//saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		//tbar : ['<font color=#15428b><B>领料出库单<B></font>','-',addBtnWz,'-'],
		tbar : [addBtnWz,'-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE_OUT,
			store : dsOut,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		//insertHandler:insertData,
		saveHandler:saveOutNum,
		// expend properties
		plant : PlantOut,
		plantInt : PlantIntOut,
		servletUrl : MAIN_SERVLET,
		bean : beanOut,
		business : business,
		primaryKey : primaryKey,
		listeners : {
			beforeedit:function(e){
	            var currRecord = sm.getSelected();
	            if (currRecord.get('auditState') == '1') {
	            	Ext.example.msg('提示','此出库单已稽核,不可修改');
	            	return false;
	            }
			}
		}
	});
	
    gridPanelOut.on('afteredit',function(e){
    	if(e.field == 'realNum'){ 	
	    	var record = e.record;
	    	var realOld = e.originalValue;
	    	var realNew = e.value;
	    	if(realNew<0){
	    		record.set('realNum',realOld);
	    		return false;
	    	}
	    	var sysl = "";
			var sql = "select avg(nvl(ftsl,0))-sum(nvl(real_num,0)) from wz_cjsxb wz,mat_store_outsub sub " +
					" where wz.bh=sub.app_id and wz.bm=sub.cat_no and wz.bh='"+record.get('appId')+"' " +
					" and wz.bm='"+record.get('catNo')+"' and wz.pid = '"+CURRENTAPPID+"' ";
            if(record.get("outType")=="5"){
                sql = "select avg(nvl(td_num,0)) - sum(nvl(real_num,0)) from mat_store_in_replace re,mat_store_outsub sub " +
                    " where re.bh=sub.app_id and re.td_bm=sub.cat_no and re.bh='"+record.get('appId')+"' " +
                    " and re.td_bm='"+record.get('catNo')+"'  and re.pid='"+CURRENTAPPID+"' ";
            }
			DWREngine.setAsync(false);
			baseMgm.getData(sql,function(list){
				sysl = list;
			})
			DWREngine.setAsync(true);
			if(realNew - realOld > sysl){
				Ext.Msg.show({
					title: '提示',
		            msg: '领用数量修改出错，领用数量只能再增加'+sysl+'个',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
				});
				record.set('realNum',realOld);
			}else{
				var outmoney=realNew*record.data.price
				record.set('money',outmoney);
			}
		}
    });


    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel,gridPanelOut]
    });
    
    if (ModuleLVL >= 3){
		with(gridPanelOut.getTopToolbar().items){
			addBtnWz.disable();
		}
    }
    
//    if(!isFlwTask && !isFlwView)gridPanel.getTopToolbar().add('审批状态：',billStateFilter);
    if (!isFlwTask && !isFlwView){
		if(hasFlow){
			gridPanel.getTopToolbar().add('审批状态：',billStateFilter);
		}
	}
    if(isFlwTask){
		//查询此编号流程是否存在，存在则直接读出
		DWREngine.setAsync(false);
		//matStoreMgm.findBeanByProperty(bean,'outNo',flowbh,function(obj){
		baseMgm.getData("select out_no from mat_store_out where out_no='"+flowbh+"' and OUT_TYPE='4' and "+pidWhereString+" ",function(list){
			if(list.length==0){
				gridPanel.defaultInsertHandler();
			}else{
				ds.load({params:{start:0,limit:PAGE_SIZE}});				
			}
		});
		DWREngine.setAsync(true);

		with(gridPanel.getTopToolbar().items){
			get('del').disable();
			get('add').disable();
		}
	}
	if(isFlwView){
		with(gridPanel.getTopToolbar().items){
				get('add').disable();
				get('del').disable();
				get('save').disable();
			}
			with(gridPanelOut.getTopToolbar().items){
				addBtnWz.disable();
				get('del').disable();
				get('save').disable();
			}
	}
    
    sm.on('rowselect', function(sm, rowIndex, record){
   		cmOut.defaultSortable = true;//可排序
   		selectUuid = record.get('uuid');
   		selectRecord = record;
   		dsOut.baseParams.params = "outId = '"+selectUuid+"'";
   		dsOut.load({params:{start:0,limit:PAGE_SIZE_OUT}});
   		
   		if(record.get('billState')!='0'){
   			if(!isFlwTask && !isFlwView){
	   			with(gridPanel.getTopToolbar().items){
					get('del').disable();
					get('save').disable();
				}
				with(gridPanelOut.getTopToolbar().items){
					addBtnWz.disable();
					get('del').disable();
					get('save').disable();
				}
   			}
   		}else{
   			if(!isFlwTask && !isFlwView){
	   			with(gridPanel.getTopToolbar().items){
					get('del').enable();
					get('save').enable();
				}
				with(gridPanelOut.getTopToolbar().items){
					addBtnWz.enable();
					get('del').enable();
					get('save').enable();
				}
   			}
   		}
   		if (record.get('auditState') == '1') {
   			with(gridPanel.getTopToolbar().items){
					get('del').disable();
					get('save').disable();
				}
			with (gridPanelOut.getTopToolbar().items) {
				addBtnWz.disable();
				get('del').disable();
				get('save').disable();
			}
		}
   })
    
	function saveOutNum(){
		var records = dsOut.getModifiedRecords();
		modOutRecords = records;
		var flag = true;
		for(var i=0;i<records.length;i++){
			var record = records[i];
			//查询出分摊数量
			var ftsl = "";
			var value = record.get('realNum');
			var uuid = record.get('uuid');
			DWREngine.setAsync(false);
			var sql = "select nvl(avg(nvl(ftsl,0))-sum(nvl(real_num,0)),0) from wz_cjsxb wz,mat_store_outsub sub " +
					" where wz.bh=sub.app_id and wz.bm=sub.cat_no and wz.bh='"+record.get('appId')+"' " +
					" and wz.bm='"+record.data.catNo+"' and sub.uuid <> '"+uuid+"' and sub.pid='"+CURRENTAPPID+"' ";
			DWREngine.setAsync(false);
			baseMgm.getData(sql,function(list){
				ftsl = list;
			})
			DWREngine.setAsync(true);
			if(value>ftsl && ftsl>0){
				Ext.Msg.show({
					title: '提示',
		            msg: '领用数量不能大于剩余数量',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
				});
				flag = false;
				break;
			}
			record.set('realNum',value);
			record.set('money',record.get('appNum')*record.get('price'));
		}
		if(flag){
			gridPanelOut.defaultSaveHandler();
			if (isFlwTask == true || isFlwView == true){
				Ext.MessageBox.confirm(
					'保存成功！','成功添加领料单！<br>点击“Yes”可以发送到流程下一步操作！<br>点击“No”继续在本页添加领用物资！',
					function(value){
						if ('yes' == value){
							parent.IS_FINISHED_TASK = true;
							parent.mainTabPanel.setActiveTab('common');
						}
					}
				);
			}
		}
	}
    
    
	function addWZ(){
		var select = gridPanel.getSelectionModel().getSelected();
		if(select!=null && select.get('uuid')!=null && select.get('uuid')!=""){
	    	//wz_treePanel.root.reload() 
			dsB.baseParams.params = " nvl(sl,0)<>nvl(ffsl,0) and nvl(sl,0)<>nvl(tdTotalNum,0) and bh in " +
					" (select bh from com.sgepit.pmis.wzgl.hbm.WzCjspb where billState='1' and sqr='"+USERID+"' ) " +
					" and uids not in ( select aaa.uids from WzCjsxb aaa ,MatStoreOutsub bbb where " +
					" aaa.bh=bbb.appId and aaa.bm=bbb.catNo and bbb.outId='"+selectUuid+"' and bbb.pid='"+CURRENTAPPID+"' ) " +
					"and "+pidWhereString+" ";
			dsB.load({params:{start : 0,limit : 20}});
			selectWin.show(true);
		}else{
			Ext.MessageBox.alert("提示","请先选择出库单");    	
		}
	}

	function saveData(){
		if(selectRecord==null || selectRecord==""){
			Ext.Msg.show({
				title : '提示',
				msg : '请选择要保存的内容！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} 
		var date = selectRecord.get('outDate');
		var ware = selectRecord.get('sendWare');
		if (date==""){
    		Ext.Msg.show({
				title : '提示',
				msg : '出库日期不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else if (ware==""){
    		Ext.Msg.show({
				title : '提示',
				msg : '发料仓库不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{	
			gridPanel.defaultSaveHandler();
			/*
			if (isFlwTask == true || isFlwView == true){
				Ext.MessageBox.confirm(
					'保存成功！','成功添加领料单！<br>点击“Yes”可以发送到流程下一步操作！<br>点击“No”继续在本页添加领用物资！',
					function(value){
						if ('yes' == value){
							parent.IS_FINISHED_TASK = true;
							parent.mainTabPanel.setActiveTab('common');
						}
					}
				);
			}
			*/
    	}
	}
	
	//删除主表数据，需同时删除从表
	function deleteData(){
		var record = sm.getSelected();
		gridPanel.defaultDeleteHandler();
		gridPanel.on('afterdelete',function(){
			smOut.selectAll();
			gridPanelOut.defaultDeleteHandler();	
		})
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

	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    //保留小数点后4位
    function cnMoneyFour(v){
    	v = v.toFixed(4);
		v = String(v);
		var ps = v.split(".");
		var whole = ps[0];
		var sub = ps[1] ? "." + ps[1] : ".0000";
		var r = /(\d+)(\d{3})/;
		while (r.test(whole)) {
			whole = whole.replace(r, "$1" + "," + "$2");
		}
		v = whole + sub;
		if (v.charAt(0) == "-") {
			return "-￥" + v.substr(1);
		}
		return "￥" + v;
    }
})
function finishFun(uids, finished){
	DWREngine.setAsync(false);
    var sql = "update MAT_STORE_OUT set BILL_STATE='1' where UUID='"+uids+"'";
    baseDao.updateBySQL(sql,function(str){
        if(str == "1"){
            Ext.example.msg("提示","完结操作成功！");
            finished.checked = true;
            ds.reload();
        }
    })
    DWREngine.setAsync(true);
}