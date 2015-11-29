var bean = "com.sgepit.pmis.finalAccounts.complete.hbm.FacompEquWzBmInv";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";
var selectTreeNo = '';

var typetreeArr = new Array();
var equWareArr = new Array();

Ext.onReady(function () {
	//TODO:固定资产
    DWREngine.setAsync(false);
    var sql1 = "select t.uids,t.fixedname from Facomp_Fixed_Asset_Tree t";
    baseDao.getData(sql1,function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);          
            temp.push(list[i][1]);          
            //temp.push(list[i][2]);          
            //temp.push(list[i][3]);          
            typetreeArr.push(temp);         
        }
    });
    baseMgm.getData("select uids,equid,wareno,waretype from equ_warehouse where pid='" + CURRENTAPPID
                    + "' order by equid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            temp.push(list[i][2]);
            if(list[i][3]=="SBCK")
                temp.push("材料仓库");
            else if(list[i][3]=="CLCK")
                temp.push("材料仓库")
            else if(list[i][3]="JGCK")
                temp.push("建管仓库")
            equWareArr.push(temp);
        }
    });
    DWREngine.setAsync(true);
	var typetreeDs = new Ext.data.SimpleStore({
	   fields: ['k', 'v'],   
	   data: typetreeArr
	});
	var rootKC = new Ext.tree.TreeNode({text:'仓库库存',id : '01'});  
    var node1 = new Ext.tree.TreeNode({text:'设备管理库存',id : 'SB'});  
    var node2 = new Ext.tree.TreeNode({text:'材料管理仓库',id : 'CL'});  
    var node3 = new Ext.tree.TreeNode({text:'物资管理仓库',id : 'WZ'});
//    var node4 = new Ext.tree.TreeNode({text:'生产准备仓库',id : 'prod'});  
    rootKC.appendChild(node1); 
    rootKC.appendChild(node2); 
    rootKC.appendChild(node3); 
//    rootKC.appendChild(node4);
    var treePanel = new Ext.tree.TreePanel({
        id: 'orgs-tree',
        region: 'west',
        split: true,
        width: 196,
        minSize: 175,
        maxSize: 500,
        frame: false,
        collapsible: true,
        enableDD: true,
        margins: '5 0 5 5',
        cmargins: '0 0 0 0',
        rootVisible: true,
        lines: false,
        autoScroll: true,
        animCollapse: false,
        animate: false,
        collapseMode: 'mini',
        loader: new Ext.tree.TreeLoader({}),
        root: rootKC,
        collapseFirst: false
    });
    
//TODO:库存资产信息
    var fm = Ext.form;

	var fc ={
			'uids' : {name : 'uids',fieldLabel : '主键'},
			'assetsNo' : {name : 'assetsNo',fieldLabel : '资产编码'},
			'assetsName' : {name : 'assetsName',fieldLabel : '资产名称'},
			'stockNo' : {name : 'stockNo',fieldLabel : '物资编码'},
			'assetsFl' : {
				        //id : 'assetsFl',
			            name : 'assetsFl',
			            fieldLabel : '资产分类'	,
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
				        editable : false,
				        lazyRender:true,
				        triggerAction: 'all',
				        store : typetreeDs
			 },
			'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
			'storage' : {name : 'storage',fieldLabel : '存放库位'},
			'unit' : {name : 'unit',fieldLabel : '单位'},
			'stockNum' : {name : 'stockNum',fieldLabel : '数量'},
			'kcMoney' : {name : 'kcMoney',fieldLabel : '金额'},
			'remark' : {name : 'remark',fieldLabel : '备注'},
			'pid' : {name : 'pid',fieldLabel : 'PID'},
			'kcUids' : {name : 'kcUids',fieldLabel : '库存主键'},
			'datetype' : {name : 'datetype',fieldLabel : '库存主键'},
			'conid' : {name : 'conid',fieldLabel : '合同主键'}
	}
	
	
//TODO:固定资产分类树窗口CM	
	var typetreeCombo = new fm.ComboBox(fc['assetsFl']);
    var typetreeCombo1 = new Ext.ux.TreeCombo({
        id : 'assetsFl',
        name : 'assetsFl',
        fieldLabel : '资产分类',
        resizable:true,
        width: 183,
        treeWidth : 300,
        editable : false,
        allowBlank : false,
        loader:new Ext.tree.TreeLoader({
            url: MAIN_SERVLET,
            requestMethod: "GET",
            baseParams: {
                ac : "tree",
                treeName:"getFACompFixedAssetTreeNew",
                businessName : 'faBaseInfoService',
                parent: '01',
                pid : CURRENTAPPID
            },
            clearOnLoad: true,
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
        }),
        root:  new Ext.tree.AsyncTreeNode({
            id : "01",
            text: "资产分类",
            iconCls: 'form',
            expanded:true
        })
    });
    typetreeCombo1.getTree().on('beforeload',function(node){
        typetreeCombo1.getTree().loader.baseParams.parent = node.id; 
    });
    var  wareTreeCombo = new Ext.ux.TreeCombo({
        id : 'storage',
        name : 'storage',
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
	var  cm = new Ext.grid.ColumnModel([
			//smSub,
			new Ext.grid.RowNumberer({
				header : '序号',
				width : 35
			}),
			{
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			},{
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			},{
			    id : 'stockNo',
				header : fc['stockNo'].fieldLabel,
				dataIndex : fc['stockNo'].name,
				align : 'left',
				width : 200
			},{
			    id : 'assetsName',
				header : fc['assetsName'].fieldLabel,
				dataIndex : fc['assetsName'].name,
				type : 'string',
				align : 'left',
				width : 200
			},{
			    id : 'assetsNo',
				header : fc['assetsNo'].fieldLabel,
				dataIndex : fc['assetsNo'].name,
				renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
				editor : new fm.TextField(fc['assetsNo']),
				type : 'string',
				align : 'right',
				width : 100
			},{
			    id : 'assetsFl',
			    header : fc['assetsFl'].fieldLabel,
			    dataIndex : fc['assetsFl'].name,
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
			    editor :typetreeCombo,
			    type : 'comboTree',
			    comboTree:typetreeCombo1,
			    align : 'right',
			    width : 100
			},{
				id : 'ggxh',
				header : fc['ggxh'].fieldLabel,
				dataIndex : fc['ggxh'].name,
			    align : 'center',
			    width : 100
            },{
				id : 'storage',
				header : fc['storage'].fieldLabel,
				dataIndex : fc['storage'].name,
				type : 'comboTree',
			    comboTree:wareTreeCombo,
			    renderer : function(v){
		            var equid = "";
		            for (var i = 0; i < equWareArr.length; i++) {
		                if (v == equWareArr[i][1])
		                    equid = equWareArr[i][3]+" - "+equWareArr[i][2];
		            }
		            return equid;
		        },
			    align : 'center',
			    width : 100
			},{
				id : 'unit',
				header : fc['unit'].fieldLabel,
				dataIndex : fc['unit'].name,
				align : 'center',
				width : 100
			},{
				id : 'stockNum',
				header : fc['stockNum'].fieldLabel,
				dataIndex : fc['stockNum'].name,
			    align : 'right',
				width : 100
			},{
				id : 'kcMoney',
				header : fc['kcMoney'].fieldLabel,
				dataIndex : fc['kcMoney'].name,
				renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
				editor : new fm.NumberField(fc['kcMoney']),
				align : 'right',
				width : 100
			},{
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
				editor : new fm.TextField(fc['remark']),
				align : 'right',
				width : 200
			},{
				id : 'kcUids',
				header : fc['kcUids'].fieldLabel,
				dataIndex : fc['kcUids'].name,
				editor : new fm.NumberField(fc['kcUids']),
				align : 'right',
				hidden : true
			},{
				id : 'datetype',
				header : fc['datetype'].fieldLabel,
				dataIndex : fc['datetype'].name,
				editor : new fm.NumberField(fc['datetype']),
				align : 'right',
				hidden : true
			},{
				id : 'conid',
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				editor : new fm.NumberField(fc['conid']),
				align : 'right',
				hidden : true
			}
		]);
		var Columns = [
			{name:'uids' ,type:'string'},
		    {name:'pid' ,type:'string'},
		    {name:'assetsNo' ,type:'string'},
		    {name:'assetsName' ,type:'string'},
		    {name:'stockNo' ,type:'string'},
		    {name:'assetsFl' ,type:'string'},
		    {name:'ggxh' ,type:'string'},
		    {name:'storage' ,type:'string'},
		    {name:'unit' ,type:'string'},
		    {name:'stockNum' ,type:'float'},
		    {name:'kcMoney' ,type:'float'},
		    {name:'remark' ,type:'string'},
		    {name:'kcUids' ,type:'string'},
		    {name:'datetype' ,type:'string'},
		    {name:'conid',type:'string'}
		];
    var ds = new Ext.data.Store({
			baseParams: {
		    	ac: 'list',
		    	bean: bean,
		    	business: business,
		    	method: listMethod,
		    	params: " stockNum>'0'"
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
	ds.setDefaultSort(orderColumn, 'desc');	//设置默认排序列
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
				uids : '',
				pid : CURRENTAPPID,
				assetsNo : '',
				assetsName : '',
				stockNo : '',
				assetsFl : '',
				ggxh : '',
				storage : '',
				unit : '',
				stockNum : 0,
				kcMoney : 0,
				remark : '',
				kcUids : '',
				datetype : '',
				conid : ''
		}
	var initBtn = new Ext.Button({
	         	id : 'initBtn',
				text : '初始化',
				iconCls : 'btn',
				handler : initFn
	 })
	 var saveBtn = new Ext.Button({
	         	id : 'saveBtn',
				text : '保存',
				iconCls : 'save',
				handler : saveFn
	 })
//	 var delBtn = new Ext.Button({
//	         	id : 'delBtn',
//				text : '删除',
//				iconCls : 'remove',
//				handler : delFn
//	 })
	 var gridPanel = new Ext.grid.EditorGridTbarPanel({
			ds : ds,
			cm : cm,
			sm : sm,
	        title : '库存资产信息',
			tbar : ['<font color=#15428b><B>库存资产信息<B></font>','-',initBtn,'-',saveBtn,'-',{//,delBtn,'-'
					id: 'query',
					text: '查询',
					tooltip: '查询',
					iconCls: 'option',
					handler: showWindow_
				}],
			header: false,
		    border: false,
			autoWidth : true,
		    region: 'center',
		    addBtn : false, // 是否显示新增按钮
		    saveBtn : false, // 是否显示保存按钮
		    delBtn : false, // 是否显示删除按钮
	        stripeRows:true,
	        loadMask : true,
		    viewConfig: {
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
//	        insertHandler : insertFn, // 自定义新增方法，可选
//	        saveHandler : saveFn,// 自定义保存方法，可选
//	        deleteHandler : deleteFn,       // 自定义删除方法，可选
	        plant : Plant,
			plantInt : PlantInt,
			servletUrl : MAIN_SERVLET,
			bean : bean,
			business : business,
			primaryKey : primaryKey
	});
		
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [treePanel,gridPanel],
        listeners: {
            afterlayout: function () {
                treePanel.root.expand();
                treePanel.root.select();
            }
        }
    });
    
    ds.load({params:{start:0,limit:PAGE_SIZE}});
	
    treePanel.on('click',function(node){
    	selectTreeNo = node.id;
    	if(selectTreeNo == '01'){
    		 ds.baseParams.params = " stockNum>'0'";
    	     ds.load({params:{start:0,limit:PAGE_SIZE}});
    	}else{
    		 ds.baseParams.params = " datetype='"+selectTreeNo+"' and stockNum>'0'";
             ds.load({params:{start:0,limit:PAGE_SIZE}});
    	}
    })

    
//TODO:function
    function initFn() {
//    	if(selectTreeNo == '' || selectTreeNo == '01'){
//    	    Ext.example.msg('信息提示','请选择左边树节点！');
//    	    return;
//    	}
		Ext.Msg.show({
				title : '提示信息',
				msg : "初始化操作不可恢复，是否要初始化？",
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(btn) {
					if (btn == 'yes') {
					        var mask = new Ext.LoadMask(Ext.getBody(), {
										msg : "正在初始化，请稍等..."
							});
							mask.show();
							DWREngine.setAsync(false);
                            faFixedAssetService.insertFromKcToFacompEquWzBmInv(CURRENTAPPID,function(str){
                                if(str == "success"){
	                             	 mask.hide();
	                                 Ext.example.msg('信息提示','初始化完成！');
	                                 ds.reload();                               
                                }else{
	                             	 mask.hide();
	                                 Ext.example.msg('信息提示','初始化失败！');
	                                 ds.reload();                                
                                }
                            })
                            DWREngine.setAsync(true);
					}else{
					   return;
					}
				}
		})
    }
    
    function saveFn(){
    	 gridPanel.defaultSaveHandler();
    }
    function delFn(){
         gridPanel.defaultDeleteHandler();
    }
    function showWindow_(){showWindow(gridPanel)};
});