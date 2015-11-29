var rootsb, selectWin_sbqc,dssb;
var treePanelsbTitle = "设备清册维护";
var rootsbText = "所有设备";
var conidif="";
var beansb = "com.sgepit.pmis.equipment.hbm.EquListQc"
var businesssb = "baseMgm"
var listMethodsb = "findWhereOrderby"
var primaryKeysb = "sbid"
var orderColumnsb = "kks"   
var isLeafsb , sbIdsb, tmpNodesb, tmpLeafsb;
var treePanelsb, treeLoadersb, contentPanelsb;
var types = [[-1,'--'], [1,'设备'],[2,'部件'],[3,'备品备件'],[4,'专用工具'],[6,'零件'],[5,'合同']];

//var jzhType = [[5,'#1、#2机组'],[1,'#1机组'],[2,'#2机组']];

Ext.onReady(function (){
	rootsb = new Ext.tree.AsyncTreeNode({
        text: rootsbText,
        iconCls: 'form',
        id : '0'        
    })
	treeLoadersb = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"equListTreeQc", 
			businessName:"equMgm",
			parent:0,
			pid: CURRENTAPPID
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanelsb = new Ext.tree.ColumnTree({
        id: 'equipment-tree-panel',
        iconCls: 'icon-by-category',
        region: 'west',
        width: 240,
        minSize: 200,
        maxSize: 400,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        rootVisible: false,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '设备名称',
            width: 500,
            dataIndex: 'sbMc'
        },{
            header: '设备主键',
            width: 0,
            dataIndex: 'sbid',
            renderer: function(value){
            	return "<div id='sbid'>"+value+"</div>";
            }
        },{
            header: 'KKS设备编码',
            width: 0,
            dataIndex: 'kks',
            renderer: function(value){
            	return "<div id='kks'>"+value+"</div>";
            }
        }, {
            header: '规格型号',
            width: 0,
            dataIndex: 'ggxh'
        }, {
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
        	header: '机组号',
        	width: 0,
        	dataIndex: 'jzh'
        }], 
        loader: treeLoadersb,
        root: rootsb
	});

	treePanelsb.on('beforeload', function(node) {
		var sbid = node.attributes.kks;
		if (sbid == null)
			sbid = '0';
		var baseParams = treePanelsb.loader.baseParams;
		baseParams.parent = sbid;
	})
	
	treePanelsb.on('click', onClick);
	function onClick(node, e ){
		var elNode = node.getUI().elNode;
		var isRoot = node == rootsb;
		isLeafsb = isRoot ? "false" : elNode.all("isleaf").innerText;
		sbIdsb = isRoot ? "0" : elNode.all("kks").innerText;
		treePanelsb.selectPath(node.getPath());
		PlantInt.parent = sbIdsb
		tmpNodesb = node;
		tmpLeafsb = isLeafsb;
		dssb.baseParams.params = "parent = '"+ sbIdsb +"' and isleaf='1'  and  kks not in (select sbBm from EquList where conid = '"+p_conId+"')";
		dssb.load({params:{start: 0,limit: PAGE_SIZE}});
    	if(tmpNodesb.attributes.conid != '')excelBtn.setDisabled(false);		
	}
	
//------------------------------grid-------------------

	var dsTypes = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : types
    });
	
    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType
    }); 
    
    var sm =  new Ext.grid.CheckboxSelectionModel({header:''})   //  创建选择模式
    
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'sbid': {name: 'sbid',fieldLabel: '设备主键',hidden:true,hideLabel:true
    	 }, 'pid': {name: 'pid',fieldLabel: '工程项目编号',hidden:true,hideLabel:true
         },'parent': {name: 'parent',fieldLabel: '父节点' ,hidden:true,hideLabel:true,anchor:'95%'
         }, 'isleaf': {name: 'isleaf',fieldLabel: '叶子',hidden:true,hideLabel:true
         }, 'kks': {name: 'kks',fieldLabel: '设备编码',anchor:'95%'
         }, 'sbMc': {name: 'sbMc',fieldLabel: '设备名称', anchor:'95%'
         },'sccj': {name: 'sccj',fieldLabel: '生产厂家',anchor:'95%'
         }, 'ggxh': {name: 'ggxh',fieldLabel: '规格型号', anchor:'95%'
         }, 'dw': {name: 'dw',fieldLabel: '单位',anchor:'95%'
         },'sx': {name: 'sx',fieldLabel: '属性',
			displayField: 'v',valueField:'k',mode: 'local',
            typeAhead: true, triggerAction: 'all', editable: false,
            store: dsTypes,
            lazyRender:true,listClass: 'x-combo-list-small',anchor:'95%'
         } ,'jhsl': {name: 'jhsl',fieldLabel: '计划数量',anchor:'95%'
         },'memo': {name: 'memo',fieldLabel: '备注',anchor:'95%' },
         'jzh':{name:'jzh',fieldLabel:'机组号',
				displayField:'v',valueField:'k',mode:'local',
				typeAhead:true, triggerAction: 'all', store:dsJzh
         }
    }

     // 3. 定义记录集
    var Columns = [
    	{name: 'sbid', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'parent', type: 'string'},
    	{name: 'isleaf', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'kks', type: 'string'},    	
		{name: 'sbMc', type: 'string' },
		{name: 'sx', type: 'string'},
		{name: 'ggxh', type: 'string'},
		{name: 'sccj', type: 'string'},
		{name: 'dw', type: 'string'},
		{name: 'jhsl', type: 'float'},
		{name: 'memo', type: 'string'},
		{name: 'jzh', type: 'string'}
		];
		
    var Plant = Ext.data.Record.create(Columns);			//定义记录集   	
    var PlantInt = {sbid:'',parent:'', isleaf: '1', kks:'', sbMc:'', sx:'', ggxh:'',  sccj:'',dw:'',
    				jhsl:'', memo: '',jzh:'', pid: CURRENTAPPID}	//设置初始值 
        
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,new Ext.grid.RowNumberer({header:'序号',width:33}) ,{
           id:'sbid',header: fc['sbid'].fieldLabel,dataIndex: fc['sbid'].name,hidden: true       
        },{id:'pid',header: fc['pid'].fieldLabel,dataIndex: fc['pid'].name,hidden: true       
        },{id:'parent', header: fc['parent'].fieldLabel, dataIndex: fc['parent'].name, hidden: true
        },{id:'isleaf', header: fc['isleaf'].fieldLabel,dataIndex: fc['isleaf'].name,hidden: true
        },{id:'kks',header: fc['kks'].fieldLabel,dataIndex: fc['kks'].name
        },{id:'sbMc', header: fc['sbMc'].fieldLabel,dataIndex: fc['sbMc'].name,
           editor: new fm.TextField(fc['sbMc']),width: 150
        },{
           id:'sx', header: fc['sx'].fieldLabel,dataIndex: fc['sx'].name,
           editor: new fm.ComboBox(fc['sx']),renderer: dsTypeRender,
           //hidden: true,
           width: 60
        },{id:'ggxh',header: fc['ggxh'].fieldLabel,dataIndex: fc['ggxh'].name,
           editor: new fm.TextField(fc['ggxh']),width: 100
        },{
           id:'sccj',
           header: fc['sccj'].fieldLabel,
           dataIndex: fc['sccj'].name,
           editor: new fm.TextField(fc['sccj']),
           width: 80
        },{id:'dw', header: fc['dw'].fieldLabel, dataIndex: fc['dw'].name,
           editor: new fm.TextField(fc['dw']), width: 35
        },{id:'jhsl',header: fc['jhsl'].fieldLabel,dataIndex: fc['jhsl'].name,
           editor: new fm.NumberField(fc['jhsl']),width: 80
        },{
           id:'memo',
           header: fc['memo'].fieldLabel,dataIndex: fc['memo'].name,
           editor: new fm.TextField(fc['memo']),width: 80
        } ,{
			id:'jzh', 
        	header: fc['jzh'].fieldLabel,dataIndex: fc['jzh'].name,
           editor: new fm.ComboBox(fc['jzh']),renderer: dsJzhRender,width: 60
        }
    ]);

    cm.defaultSortable = true;						//设置是否可排序
      
    // 4. 创建数据源
    dssb = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: beansb,				
	    	business: businesssb,
	    	method: listMethodsb,
	    	params: " parent=0 and isleaf='1' "
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeysb
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dssb.setDefaultSort(orderColumnsb, 'asc');	//设置默认排序列
    
    var excelBtn = new Ext.Button({
			text:'excel导入',
			tooltip:'导入之后在左边选择概算树右键菜单进行关联;<br>或事先选好树节点导完之后直接进行选择关联!',
			iconCls: 'upload',
			pressed:true,
			disabled:true,
			handler:showExcelWin
		})

    // 5. 创建可编辑的grid: grid-panel
    var grid = new Ext.grid.EditorGridTbarPanel({
        // basic properties
    	id: 'grffid-panel',			//id,可选
        ds: dssb,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        border: false,				// 
        //addBtn:false,
        delBtn:false,
        //saveBtn:false,
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: false,				//
        frame: false,				//是否显示圆角边框
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dssb,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beansb,					
      	business: businesssb,	
      	primaryKey: primaryKeysb,
      	//deleteHandler: deleteFun,
      	saveHandler: saveFun,
      	insertHandler: insertFun
   });
//	2011-03-08 移植设备清册中的设备增删改
	grid.on("beforeinsert",function(){
		var node =  tmpNodesb
		var id = node.attributes.kks//对应结构树id
		var jzh = node.attributes.jzh;
		DWREngine.setAsync(false); 
		equlistMgm.getIndexId(id, function(str){
			PlantInt.kks = str;
			PlantInt.parent = id;
			PlantInt.jzh = jzh;
		});
		DWREngine.setAsync(true);
		return true;
	})
	grid.on("aftersave",function(){   
		dssb.reload();
	})
	dssb.load();
    
	// 新增一个清单
    function insertFun(){
    	if(tmpNodesb == null)return
    	if(tmpLeafsb=='1'){
    		Ext.example.msg('提示！', '不能在设备下面添加设备，请在设备分类中添加！');
    	}else{
    		grid.defaultInsertHandler();	
    	}
    };
    
    // 保存一个清单
    function saveFun(){
    	var records = grid.getStore().getModifiedRecords(); 
    	var node =  tmpNodesb 
    	var id = node.attributes.sbid
    	if (tmpLeafsb == 1){
    		DWREngine.setAsync(false); 
    			equlistMgm.saveEqulistQc(id, function(){
    				grid.defaultSaveHandler();
    			});
    		DWREngine.setAsync(true); 
    	}else{
    		grid.defaultSaveHandler();
    	}
    	setTimeout(reloadTree, 2000);
    };
	
    
    // 删除一个清单
    function deleteFun(){
    	if (sm.hasSelection()){
    		var sbIds = new Array();
    		var records = sm.getSelections()
    		for (i=0; i<records.length; i++){
    			sbIds[i] = records[i].get('sbid');
    		}
    		DWREngine.setAsync(false); 
    			equlistMgm.deleteEqulistQc(sbIds, function(flag){
    				if (flag == 1){
    					Ext.Msg.show({
    						title: '提示',
				            msg: '存在子点,不能删除',
				            icon: Ext.Msg.WARNING, 
				            width:300,
				            buttons: Ext.MessageBox.OK
    					})
    				}else{
    					grid.defaultDeleteHandler();
    					setTimeout(reloadTree, 2000);
    				}
    			})
    		DWREngine.setAsync(true); 
    	}
    }
    
	// 重新加载清单树    
    function reloadTree(){
    	if (tmpNodesb){
			var node = tmpNodesb.isLeaf()? tmpNodesb.parentNode : tmpNodesb;
			var baseParams = treePanelsb.loader.baseParams
			baseParams.parent = node.attributes.kks;
			treePanelsb.getEl().mask('waiting..');
			if (node.isExpanded()) {
			   treeLoadersb.load(node);
			   node.expand();
		    } 
		    node.expand();
			treePanelsb.getEl().unmask();
		}
    }
    
	
    
	selectWin_sbqc = new Ext.Window({
		title:'选择设备',
		buttonAlign:'center',
		layout:'border',
		width: document.body.clientWidth,
		height: document.body.clientHeight,
		modal: true,
		closeAction: 'hide',
		constrain:true,
		maximizable: true,
		plain: true,
		items:[treePanelsb, grid],
		buttons:[
			{id:'btnSavfe',text:'确定选择' ,handler:confirmChoose},
			{text:'取消',handler:function(){selectWin_sbqc.hide()}}
		]
	});
		
  function confirmChoose(){
  	var selectRows = grid.getSelectionModel().getSelections();
  	var records = dssb.getModifiedRecords();
  	if(records.length>0){
  		Ext.example.msg('提示！', '请先保存数据！');
  	}else if(selectRows.length==0){
  		Ext.example.msg('提示！', '至少选取一条数据！');
  	}else{
  		var parentid = p_conId;
  		var sbArr = new Array();
  		for(var i=0;i<selectRows.length;i++){
  			var temp = new Object();
  			Ext.applyIf(temp,PlantInt);
  			for(var j=0;j<Columns.length;j++){
  				if(typeof(temp[Columns[j].name]!="undefined")){
  					temp[Columns[j].name] = selectRows[i].get(Columns[j].name)
  					temp['bdgid']=thisBdgid;
  					temp['bdgno']=thisBdgno;
  					temp['pid'] = CURRENTAPPID;
  				}
  			}
  			sbArr.push(temp);
  		}
  		
  		equlistMgm.selectSbtoList(parentid,sbArr,thisBdgid,thisBdgno,function(state){
  			if(state){
  				Ext.example.msg('提示！', '选择成功！');
  				selectWin_sbqc.hide();
  				ds.load({params:{start:0,limit:PAGE_SIZE}});
  			}else{
  				Ext.example.msg('提示！', '选择失败！');
  			}
  		});
  	}
  	
  }	   
});

