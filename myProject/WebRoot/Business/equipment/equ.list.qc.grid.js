var bean = "com.sgepit.pmis.equipment.hbm.EquListQc"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "sbid"
var orderColumn = "kks"   
var SPLITB = "`"
var pid = CURRENTAPPID;
var isLeaf , sbId, tmpNode, tmpLeaf, indexId = '' ;
var treePanel, treeLoader, contentPanel;
var types = new Array();
var jzhType = new Array();

DWREngine.setAsync(false);
appMgm.getCodeValue('设备类型',function(list){         //获取合同状态
	for(i = 0; i < list.length; i++) {
		var temp = new Array();	
		temp.push(list[i].propertyCode);		
		temp.push(list[i].propertyName);	
		types.push(temp);			
	}
   }); 
appMgm.getCodeValue('机组号',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			jzhType.push(temp);			
		}
    }); 
DWREngine.setAsync(true);
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
         }, 'kks': {name: 'kks',fieldLabel: 'KKS编码',anchor:'95%'
         }, 'sbMc': {name: 'sbMc',fieldLabel: '设备名称', anchor:'95%', allowBlank:false
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
           id:'pid',header: fc['pid'].fieldLabel,dataIndex: fc['pid'].name,hidden: true       
        },{id:'sbid',header: fc['sbid'].fieldLabel,dataIndex: fc['sbid'].name,hidden: true       
        },{id:'parent', header: fc['parent'].fieldLabel, dataIndex: fc['parent'].name, hidden: true
        },{id:'isleaf', header: fc['isleaf'].fieldLabel,dataIndex: fc['isleaf'].name,hidden: true
        },{id:'kks',header: fc['kks'].fieldLabel,dataIndex: fc['kks'].name,
           editor: new fm.TextField(fc['kks']),width: 100
        },{id:'sbMc', header: fc['sbMc'].fieldLabel,dataIndex: fc['sbMc'].name,
           editor: new fm.TextField(fc['sbMc']),width: 150
        },{
           id:'sx',
           header: fc['sx'].fieldLabel,dataIndex: fc['sx'].name,
           editor: new fm.ComboBox(fc['sx']),renderer: dsTypeRender,width: 60
        },{id:'ggxh',header: fc['ggxh'].fieldLabel,dataIndex: fc['ggxh'].name,
           editor: new fm.TextField(fc['ggxh']),width: 100
        },{
           id:'sccj',header: fc['sccj'].fieldLabel,dataIndex: fc['sccj'].name,
           editor: new fm.TextField(fc['sccj']),width: 80
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
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: " parent=0 and pid='" + CURRENTAPPID + "'"
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
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'asc');	//设置默认排序列
    
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
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        border: false,				// 
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
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,
      	primaryKey: primaryKey,	
      	deleteHandler: deleteFun,
      	saveHandler: saveFun,
      	insertHandler: insertFun
   });
   grid.on("beforeinsert",function(){
   		var node =  tmpNode
    	var id = node.attributes.kks//对应结构树id
    	var jzh = node.attributes.jzh;
    	/*
    	DWREngine.setAsync(false); 
    	equlistMgm.getIndexId(id, function(str){
//    		PlantInt.kks = str;
    		PlantInt.parent = id;
    		PlantInt.jzh = jzh;
    	});
    	DWREngine.setAsync(true);
    	*/
    	return true;
   })
	grid.on("aftersave",function(){   
		ds.reload();
	})
   //ds.baseParams.parent=""
   ds.load();
    
    function strToInt(str){
    	if (str[0] == '0') {
    		str = str.substring(1, str.length);
    		strToInt(str);
    	} else {
    		return str;
    	}
    }
    
	// 新增一个清单
    function insertFun(){
    	if(tmpNode == null)return 
    	grid.defaultInsertHandler();
    };
    
    // 保存一个清单
    function saveFun(){
    	var records = grid.getStore().getModifiedRecords(); 
    	var node =  tmpNode 
    	var id = node.attributes.sbid
    	if (tmpLeaf == 1){
    		DWREngine.setAsync(false); 
    			equlistMgm.saveEqulistQc(id, function(){
    				grid.defaultSaveHandler();
    			});
    		DWREngine.setAsync(true); 
    	}else{
    		grid.defaultSaveHandler();
    	}
    	setTimeout(reloadTree, 1000);
    };
	
    // 删除一个清单
    function deleteFun(){
    	if (sm.hasSelection()){
    		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text) {
				if (btn == "yes") {
		    		var sbIds = new Array();
		    		var records = sm.getSelections();
		    		for (i=0; i<records.length; i++){
		    			if(records[i].isNew || records[i].get('sbid')=="") {
		    			} else {
		    				sbIds.push(records[i].get('sbid'));
		    			}
		    		}
		    		if(sbIds.length>0){
			    		DWREngine.setAsync(false); 
						equlistMgm.deleteEqulistQc(sbIds, function(flag){
							if (flag == 1){
								Ext.Msg.show({
									title: '提示',
						            msg: '被删除的设备存在子节点，不能删除！',
						            icon: Ext.Msg.WARNING, 
						            width:300,
						            buttons: Ext.MessageBox.OK
								})
							}else if(flag == 2){
								Ext.Msg.show({
									title: '提示',
						            msg: '被删除的设备在清单中已经使用，不能删除！',
						            icon: Ext.Msg.WARNING, 
						            width:300,
						            buttons: Ext.MessageBox.OK
								})
							}else if(flag == 0){
								Ext.example.msg('提示','删除成功，成功删除了'+sbIds.length+'条记录！');
								ds.reload();
								setTimeout(reloadTree, 1000);
							}
			//    				else{
			//    					grid.defaultDeleteHandler();
			//    					setTimeout(reloadTree, 1000);
			//    				}
						})
			    		DWREngine.setAsync(true);
		    		} else {
		    			ds.reload();
						setTimeout(reloadTree, 1000);
		    		}
				}
    		})
    	}
    }
    
	// 重新加载清单树    
    function reloadTree(){
    	var selNode = treePanel.getSelectionModel().getSelectedNode();
		if(selNode){
			var path = selNode.getPath();
			if(selNode.parentNode){
				selNode.parentNode.reload();
			}else{
				selNode.reload()	
			}
			treePanel.expandPath(path,null,function(){
				 treePanel.getNodeById(selNode.id).select();
			})
		}
    	/*
    	if (tmpNode){
			var node = tmpNode.isLeaf()? tmpNode.parentNode : tmpNode;
			var baseParams = treePanel.loader.baseParams
			baseParams.parent = node.attributes.kks;
			treePanel.getEl().mask('waiting..');
			if (node.isExpanded()) {
			   treeLoader.load(node);
			   node.expand();
		    } 
		    node.expand();
			treePanel.getEl().unmask();
		}
		*/
    }
    
   // 属性值 
   function dsTypeRender(value){
   		var str = types[5][1];
   		for(var i=0; i<types.length; i++) {
   			if (types[i][0] == value) {
   				str = types[i][1]
   				break; 
   			}
   		}
   		return str;
   }
   //机组号
   function dsJzhRender(value){
   		var str = '';
   		for(var i=0; i<jzhType.length; i++) {
   			if (jzhType[i][0] == value) {
   				str = jzhType[i][1]
   				break; 
   			}
   		}
   		return str;
   }
   
	function showExcelWin(){
		if(!fileWin){
			var fileForm = new Ext.form.FormPanel({
				fileUpload:true,
				labelWidth:30,
				layout:'form',
				baseCls:'x-plain',
				items:[{
					id:'excelfile',
					xtype:'fileuploadfield',
					fieldLabel:'excel',
					buttonText:'excel上传',
					width: 390,
					border:false,
					listeners:{
						'fileselected':function(field,value){
							var _value = value.split('\\')[value.split('\\').length-1]
							if(_value.indexOf('.xls') != -1){
								this.ownerCt.buttons[0].enable()
							}else{
								field.setValue('')
								this.ownerCt.buttons[0].disable()
								Ext.example.msg('警告','请上传excel格式的文件')
							}
						}
					}
				}],
				buttons:[{
					text:'确定',
					iconCls:'upload',
					disabled:true,
					handler:doExcelUpLoad
				}]
			})
			var fileWin = new Ext.Window({
				id:'excelWin',
				title:'excel导入',
//				closeAction:'hide',
				modal:true,
				width:450,
				height:100,
				items:[fileForm]
			})
		}
		fileWin.show()
	}

	function doExcelUpLoad(){
		var win = this.ownerCt.ownerCt
		var args = "parentid`"+tmpNode.attributes.sbId +";realname`"+REALNAME
		this.ownerCt.getForm().submit({
			waitTitle:'请稍候...',
			waitMsg:'数据上传中...',
			url:MAIN_SERVLET+"?ac=upExcel&bean="+bean+"&business=equlistMgm&method=saveHandleExcel&argments="+args,
			success:function(form,action){
				Ext.Msg.alert('恭喜',action.result.msg,function(v){
					win.close()
					treePanel.fireEvent('click',tmpNode)
				
				})
			},
			failure:function(form,action){
				Ext.Msg.alert('提示',action.result.msg,function(v){
					win.close()
					setTimeout(reloadTree, 1000);
				})
			}
		})
	}	
	
	function getStoreNum(value,metadata,record){
		var result = 0;
		if(record.data.sbId){
			DWREngine.setAsync(false); 
			equRecMgm.storeNum(record.data.sbId,function(num){
				result = num;
			})
			DWREngine.setAsync(true); 		
		}
		return result;
	}
	function getStoreNum2(value,metadata,record){
		var result = 0;
		if(record.data.sbId){
			DWREngine.setAsync(false); 
			equRecMgm.storeNum2(record.data.sbId,function(num){
				result = num;
			})
			DWREngine.setAsync(true); 		
		}
		return result;
	}
	function getStoreNum3(value,metadata,record){
		var result = 0;
		if(record.data.sbId){
			DWREngine.setAsync(false); 
			equRecMgm.storeNum3(record.data.sbId,function(num){
				result = num;
			})
			DWREngine.setAsync(true); 		
		}
		return result;
	}
	
