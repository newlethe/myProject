var bean = "com.sgepit.pmis.material.hbm.MatStoreOut"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "uuid"
var orderColumn = "uuid"

var beanOut = "com.sgepit.pmis.material.hbm.MatStoreOutsub"

//1-----领料单  or  2------计划外出库 or     3------退料单
var outTypeArr = [['1','领料单'],['2','计划外出库'],['3','退料单'],['4','计划内领用']]
var billTypes = new Array();
var gridPanel,gridPanelOut;
var ds,dsOut,sm,smOut;
var PAGE_SIZE = 10;
var PAGE_SIZE_OUT = 20;
var selectedData;
var selectUuid,selectUuidOut;
var maxStockBhPrefix,maxStockBh,incrementLsh;
var selectRecord=""; 
var bdgArr = new Array();//领料用途
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
var equWareArr =  new Array();
var equidS = new Array();
var typetreeArr = new Array();

var businessType = "zlMaterial";


 var chooseBtn = new Ext.Button({
        text : '确定选择',
        iconCls : 'add',
        handler : function(){
            var selNode = fixedTypeTree.getSelectionModel().getSelectedNode();
            if(!selNode){
                Ext.example.msg('提示！', '请先选中需要操作的节点！');
                return;
            }
            if(selNode == root){
                Ext.example.msg('提示','不能选择根节点');
                return;
            }
            var record = smOut.getSelected();
            record.set('fixedAssetTreeid',selNode.attributes.uids);
            fixedTypeWin.hide();
        }
    })
Ext.onReady(function(){
    
	//查询出仓库
	DWREngine.setAsync(false);
	
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
    //页面调整为“领用部门”，属性代码中不变，仍然为“领用单位”
    appMgm.getCodeValue('综合部或生产部领用部门',function(list){         
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);
				if(list[i].propertyName=='生产准备部门')continue;
				deptArray.push(temp);	
			}
	    });
	//处理设备仓库下拉框
    DWREngine.setAsync(false);
    var typeArr = new Array();
    baseMgm.getData("select wareno,waretype from equ_warehouse where pid='" + CURRENTAPPID
                    + "' and parent='01' order by equid ", function(list){
              for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            typeArr.push(temp);
        }
    }); 
    baseMgm.getData("select uids,equid,wareno,waretype from equ_warehouse where pid='" + CURRENTAPPID
                    + "' order by equid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            temp.push(list[i][2]);
            for(var j=0;j<typeArr.length;j++){
                if(list[i][3] == typeArr[j][1]){
                    temp.push(typeArr[j][0]);
                }
            }
              equWareArr.push(temp);
           
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
	//材料合同
    var conArry=new Array();
    var sqls  = "";
    if(edit_flag=="prod"){
          sqls = " select conno,conname from con_ove  where condivno='QT' and " +pidWhereString+
		    	 " and sort = ( select property_code from Property_code  "+
		         " where type_name = (select uids from property_type "+
		         " where type_name = '其他合同') and property_name='生产准备合同')";    	
    }else{
         sqls =  "select conno,conname from con_ove where pid='" + CURRENTAPPID
                    + "' and 1=1 and contractordept='综合部' order by conno "   	
    }
    
	baseMgm.getData(sqls, function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push("【"+list[i][0]+"】"+list[i][1]);
            conArry.push(temp);
        }
    })
    //领料用途
    baseMgm.getData("select bdgid,bdgname from bdg_info where pid='" + CURRENTAPPID
                    + "' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][0]);
            bdgArr.push(temp);
        }
    })
    
    
  //数量下拉框  
    var sls = new Array();
	var sql1 = "select bm,nvl(sl,0) from WZ_BM t,mat_store_insub r where t.bm=r.stockno and t.pm=r.cat_name" +
			   " and t.pid='"+CURRENTAPPID+"'";
	baseMgm.getData(sql1,function(list){
		if(list.length>0){
		   for(var i=0;i<list.length;i++){
		     var temp = new Array();
		     temp.push(list[i][0]);
		     temp.push(list[i][1]);
		     sls.push(temp);
		   }
		}
	})
	
		 //获取仓库号的仓库分类，用于判断仓库号子节点的判断
	 baseMgm.getData("select equid from equ_warehouse where parent='01'",function(list){
	        for(var i=0;i<list.length;i++){ 
	            if(list[i] != null && list[i] != ""){
	                var temp = new Array();
	                temp.push(list[i]);
	                equidS.push(temp);
	            }
	        }
	    	
	    }) 
	    
	//TODO:固定资产
    var sql1 = "select t.uids,t.fixedname from Facomp_Fixed_Asset_Tree t";
    baseDao.getData(sql1,function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);          
            temp.push(list[i][1]);         
            typetreeArr.push(temp);         
        }
    });
	DWREngine.setAsync(true);
	
	var getEquid = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : equWareArr
    });
	var depDs = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : deptArray
    });
    var conDs = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : conArry
    });

	var bdginfoDs = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: bdgArr
    });
    
 	var typetreeDs = new Ext.data.SimpleStore({
	   fields: ['k', 'v'],   
	   data: typetreeArr
	}); 
	
	var fm = Ext.form;
	var fc = {
		'uuid':{name:'uuid',fieldLabel:'编号',hidden:true,hideLabel:true},
		'outNo':{name:'outNo',fieldLabel:'出库单号',allowBlank:false},
		'conno':{name:'conno',fieldLabel:'合同编号',allowBlank:false,anchor:'95%'},
		'outDate':{name:'outDate',fieldLabel:'出库日期',allowBlank:false},
		'sendWare':{name:'sendWare',fieldLabel:'仓库',allowBlank:false},
		'using' : {name : 'using',fieldLabel : '领料用途'},
		'dealMan':{name:'dealMan',fieldLabel:'经受人',allowBlank:false},
		'dept':{name:'dept',fieldLabel:'领用部门',allowBlank:false},
		'remark':{name:'remark',fieldLabel:'备注'},
		'outType':{name:'outType',fieldLabel:'出库类别'},
		'fileid' : {name : 'fileid',fieldLabel : '出库单'},
		'billState':{name:'billState',fieldLabel:'审批状态',anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'PID',value:CURRENTAPPID,hidden:true},
		'compOrProd':{name:'compOrProd',fieldLabel:'出库类型',hidden:true},
		'auditState':{name:'auditState',fieldLabel:'稽核状态'}
	};
	
	var Columns = [
		{name:'uuid',type:'string'},
		{name:'outNo',type:'string'},
		{name:'conno',type:'string'},
		{name:'outDate',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'sendWare',type:'string'},
		{name:'dealMan',type:'string'},
		{name:'dept',type:'string'},
		{name:'remark',type:'string'},
		{name:'outType',type:'string'},
		{name:'billState', type:'string'},
		{name:'using', type:'string'},
		{name : 'fileid', type : 'string'},
		{name:'pid', type:'string'},
		{name: 'compOrProd',type:'string'},
		{name: 'auditState' ,type:'string'}
	];
	
	
	var Plant = Ext.data.Record.create(Columns);

	PlantInt = {
		uuid:'',
		outNo:'',
		conno:'',
		outDate:'',
		sendWare:'',
		dealMan:USERID,
		dept:'',
		remark:'',
		outType:'4',
		billState:'0',
		using:'',
		fileid:'',
		compOrProd : edit_flag,
		pid:CURRENTAPPID,
		auditState : ''
	};
//TODP
	
	 var  wareTreeCombo = new Ext.ux.TreeCombo({
        id : 'sendWare',
        name : 'sendWare',
        fieldLabel : '仓库号',
        resizable:true,
        width: 183,
        treeWidth : 300,
        allowBlank : false,
        loader:new Ext.tree.TreeLoader({
            url: MAIN_SERVLET,
            requestMethod: "GET",
            baseParams: {
                ac : "tree",
                treeName:"ckxxTreeNew",
                businessName:"equBaseInfo", 
                parent: '01'
            },
            clearOnLoad: true,
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
        }),
        root:  new Ext.tree.AsyncTreeNode({
            id : "01",
            text: "仓库信息",
            iconCls: 'form',
            expanded:true
        })
    });
    wareTreeCombo.getTree().on('beforeload',function(node){
        wareTreeCombo.getTree().loader.baseParams.parent = node.id; 
    });
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var usingCombox=new Ext.form.ComboBox(fc['using']);
	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uuid',header:fc['uuid'].fieldLabel,dataIndex:fc['uuid'].name,hidden:true},
		{id:'outNo',type:'string',header:fc['outNo'].fieldLabel,dataIndex:fc['outNo'].name,align:'center',
			width : 160
		},
		{id:'conno',header:fc['conno'].fieldLabel,dataIndex:fc['conno'].name,align:'center',
			renderer:function(value){
				for(var i = 0;i<conArry.length;i++){
					if(value == conArry[i][0]){
						return conArry[i][1]
					}
				}
			},
			width : 200
		},
		{id:'outDate',type:'date',header:fc['outDate'].fieldLabel,dataIndex:fc['outDate'].name,align:'center',
			renderer: formatDate
		},
		{id:'dealMan',header:fc['dealMan'].fieldLabel,dataIndex:fc['dealMan'].name,align:'center',hidden:true,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{id:'dept',type:'string',header:fc['dept'].fieldLabel,dataIndex:fc['dept'].name,align:'center',
			renderer:function(value){
				for(var i = 0;i<deptArray.length;i++){
					if(value == deptArray[i][0]){
						return deptArray[i][1]
					}
				}
			}
		},
		{id:'sendWare',type:'comboTree',header:fc['sendWare'].fieldLabel,dataIndex:fc['sendWare'].name,align:'center',
			comboTree:wareTreeCombo,
			renderer:function(v){
				var equid = "";
	            for (var i = 0; i < equWareArr.length; i++) {
	                if (v == equWareArr[i][1])
	                    equid = equWareArr[i][3]+" - "+equWareArr[i][2];
	            }
	            return equid;
			}
		},
		{id:'using',header:fc['using'].fieldLabel,dataIndex:fc['using'].name,align:'center',
			renderer:function(value){
				for(var i=0;i<bdgArr.length;i++){
					if(bdgArr[i][0]==value){
						return bdgArr[i][1];
					}
				}
			}
		},
		{id:'remark',header:fc['remark'].fieldLabel,dataIndex:fc['remark'].name,align:'center',hidden:true
		},
		{id:'outType',header:fc['outType'].fieldLabel,dataIndex:fc['outType'].name,align:'center',
			renderer:function(value){
				for(var i=0;i<outTypeArr.length;i++){
					if(outTypeArr[i][0] == value){
						return outTypeArr[i][1]
					}
				}
			},
			hidden : true
    },{
        id:'fileid',
        header:fc['fileid'].fieldLabel,
        dataIndex:fc['fileid'].name,
        renderer : function(v,m,r){
            if(v!=''){
                return "<center><a href='" + BASE_PATH
                        + "servlet/MainServlet?ac=downloadfile&fileid="
                        + v +"'><img src='" + BASE_PATH
                        + "jsp/res/images/word.gif'></img></a></center>"
            }else{
                return "<img src='"+BASE_PATH+"jsp/res/images/word_bw.gif'></img>";
            }
        },
        align : 'center',
        width : 90
    },{
			id:'billState',
			header:fc['billState'].fieldLabel,
			dataIndex:fc['billState'].name,
			align:'center',
			hidden:true
		},
		{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true},
		{
			id:'auditState',
			header:fc['auditState'].fieldLabel,
			dataIndex:fc['auditState'].name,
			align:'center'
		}
	]);
	
	cm.defaultSortable = true;//可排序
//	var nowUser = " and dealMan='"+USERID+"' "//+nowUser
	nowUser	= " and 1=1"
	fixedFilterPart =  " outType='4' "+" and "+pidWhereString+" and compOrProd='"+edit_flag+"'  and billState = '1' and auditState='1'"
	ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod,
			params:" outType='4' "+" and "+pidWhereString+" and compOrProd='"+edit_flag+"'  and billState = '1' and auditState='1'"
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
    
	cm.defaultSortable = true;
	
	gridPanel = new Ext.grid.QueryExcelGridPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		region:'north',
		enableHdMenu : false,
		border : false,
		height: 286, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		stripeRows:true,
		addBtn:false,
		delBtn:false,
		saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>出库单<B></font>','->',"单位（元）"],
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
	            if (currRecord.get("billState") != '0')   
	                e.cancel = true;   
	        }
		}
	});
    
    
    //-------------------------出库子表
    var fcOut = {
		'uuid':{name:'uuid',fieldLabel:'编号',hidden:true,hideLabel:true},
		'outId':{name:'outId',fieldLabel:'出库单主键'},
		'appId':{name:'appId',fieldLabel:'申请计划编号'},
		'matId':{name:'matId',fieldLabel:'材料主键'},
		'catNo':{id : 'catNo',name:'catNo',fieldLabel:'材料编码'},
		'catName':{name:'catName',fieldLabel:'材料名称'},
		'spec':{name:'spec',fieldLabel:'规格型号'},
		'unit':{name:'unit',fieldLabel:'单位'},
		'appNum':{name:'appNum',fieldLabel:'申请数量'},
		'realNum':{name:'realNum',fieldLabel:'领用数量',decimalPrecision:4},
		'price':{name:'price',fieldLabel:'入库单价'},
		'money':{name:'money',fieldLabel:'出库金额'},
		'kcje':{name:'kcje',fieldLabel:'库存金额'},
		'outType':{name:'outType',fieldLabel:'出库类别'},
		'pid':{name:'pid',fieldLabel:'PID',hidden:true},
		'fixedAssetTreeid':{
		                name:'fixedAssetTreeid',
		                fieldLabel:'资产分类',
				        readOnly : true,
				        triggerClass: 'x-form-date-trigger',
				        onTriggerClick: function(){
				            fixedTypeWin.show();
				        },
				        listClass : 'display : none',
				        mode : 'local',
				        anchor : '95%',
				        valueField: 'k',
				        displayField: 'v',
				        lazyRender:true,
				        triggerAction: 'all',
				        store : typetreeDs
			 }
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
		{name:'appNum',type:'float'},
		{name:'realNum',type:'float'},
		{name:'price',type:'float'},
		{name:'money',type:'string'},
		{name:'outType',type:'string'},
		{name:'pid',type:'string'},
		{name:'kcje',type:'float'},
		{name:'fixedAssetTreeid',type:'string'}
	];
	
	
	var PlantOut = Ext.data.Record.create(ColumnsOut);

	var PlantIntOut = {
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
		pid:CURRENTAPPID,
		kcje :0,
		fixedAssetTreeid : ''
	};
	
	smOut =  new Ext.grid.CheckboxSelectionModel();
    var typetreeCombo  = new fm.ComboBox(fcOut['fixedAssetTreeid']);
	var cmOut = new Ext.grid.ColumnModel([
		smOut,
		{id:'uuid',header:fcOut['uuid'].fieldLabel,dataIndex:fcOut['uuid'].name,hidden:true},
		{id:'outId',header:fcOut['outId'].fieldLabel,dataIndex:fcOut['outId'].name,hidden:true},
		{id:'appId',header:fcOut['appId'].fieldLabel,dataIndex:fcOut['appId'].name,align:'center',hidden:true},
		{id:'matId',header:fcOut['matId'].fieldLabel,dataIndex:fcOut['matId'].name,hidden:true},
		{id:'catNo',header:fcOut['catNo'].fieldLabel,dataIndex:fcOut['catNo'].name,align:'center'},
		{id:'catName',header:fcOut['catName'].fieldLabel,dataIndex:fcOut['catName'].name,align:'center'},
		{id:'fixedAssetTreeid',header:fcOut['fixedAssetTreeid'].fieldLabel,
		            dataIndex:fcOut['fixedAssetTreeid'].name,align:'center',
		   			renderer : function(v,m,r){
							var treeName = "";
							m.attr = "style=background-color:#FBF8BF";
							for(var i=0;i<typetreeArr.length;i++){
								if(v == typetreeArr[i][0]){
									treeName = typetreeArr[i][1];
								}
							}
							return treeName;
				   },
			      editor :typetreeCombo
	     },
		{id:'spec',header:fcOut['spec'].fieldLabel,dataIndex:fcOut['spec'].name,align:'center'},
		{id:'unit',header:fcOut['unit'].fieldLabel,dataIndex:fcOut['unit'].name,align:'center'},
		
		//申请数量
		{id:'appNum',header:fcOut['appNum'].fieldLabel,dataIndex:fcOut['appNum'].name,align:'center',hidden:true},
		//分摊数量
		{id:'realNum',header:fcOut['realNum'].fieldLabel,dataIndex:fcOut['realNum'].name,align:'center',
			editor:new Ext.form.NumberField(fcOut['realNum']),
			renderer:function(value,cell,record){
				cell.attr = "style=background-color:#FBF8BF";
				return value;
			}
		},
		{id:'price',header:fcOut['price'].fieldLabel,dataIndex:fcOut['price'].name,align:'center'},
		{id:'money',header:fcOut['money'].fieldLabel,dataIndex:fcOut['money'].name,align:'center',
			editor:new Ext.form.NumberField(fcOut['money']),
			renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				cellmeta.attr = "style=background-color:#FBF8BF";
				return "<div align=right>"+cnMoney(value/*record.data.realNum*record.data.price*/)+"</div>";
			}
		},
		{
		 id:'kcje',header:fcOut['kcje'].fieldLabel,dataIndex:fcOut['kcje'].name,align:'center'},
		{id:'outType',header:fcOut['outType'].fieldLabel,dataIndex:fcOut['outType'].name,align:'center',
			renderer:function(value){
				for(var i=0;i<outTypeArr.length;i++){
					if(outTypeArr[i][0] == value){
						return outTypeArr[i][1]
					}
				}
			},hidden:true
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
	
    cmOut.defaultSortable = true;
	gridPanelOut = new Ext.grid.EditorGridTbarPanel({
		ds : dsOut,
		cm : cmOut,
		sm : smOut,
		region:'center',
		border : false,
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		enableHdMenu : false,
		stripeRows:true,
		addBtn:false,
		delBtn:false,
		saveBtn:true,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>出库单明细<B></font>','-'],
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
		plant : PlantOut,
		plantInt : PlantIntOut,
		servletUrl : MAIN_SERVLET,
		bean : beanOut,
		business : business,
		primaryKey : primaryKey
	});
	

	var contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				items : [gridPanel,gridPanelOut]
			});
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[treePanel,contentPanel],
        listeners: {
            afterlayout: function () {
                treePanel.root.expand();
            }
        }
    });
    ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			} 
		}); 
		
	sm.on('rowselect', function(sm, rowIndex, record){
  		cmOut.defaultSortable = true;//可排序
   		selectUuid = record.get('uuid');
   		selectRecord = record;
   		dsOut.baseParams.params = "outId = '"+selectUuid+"'";
   		dsOut.load({params:{start:0,limit:PAGE_SIZE_OUT}});
	
	})	
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    }; 

   function showWindow_(){showWindow(gridPanel)};   
})


//显示多附件的文件列表
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
    ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			} 
		});
	});
}
