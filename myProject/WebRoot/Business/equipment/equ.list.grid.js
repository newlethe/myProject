var bean = "com.sgepit.pmis.equipment.hbm.EquList"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "sbId"
var orderColumn = "sbBm"   
var gridfiter = p_conId =="alone"?"1=1":"conid='"+p_conId+"'"
var gridTilte = p_conId =="alone"?"设备清单":"合同："+ p_conName + " 设备清单" 
var SPLITB = "`"
var pid = CURRENTAPPID;
var isLeaf , sbId, tmpNode, tmpLeaf, indexId = '' ;
var treePanel, treeLoader, contentPanel,ds;

var types_sbqd = new Array();
var jzhType = new Array();
	DWREngine.setAsync(false);
	appMgm.getCodeValue('设备类型',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			types_sbqd.push(temp);			
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
	
	var bdgArr = new Array();
	DWREngine.setAsync(false);
	var sql="select b.bdgno,b.bdgname from V_BDGMONEYAPP v,BDG_INFO b where v.BDGID=b.bdgid and v.CONID = '"+p_conId+"' and b.isleaf=1";
	baseMgm.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i][0]);		
			temp.push(list[i][1]);	
			bdgArr.push(temp);			
		}
	})
	DWREngine.setAsync(true)

	var selectBdgBtn = new Ext.Button({
		text:'选择概算项目',
		iconCls: 'btn',
		handler:selectBdg
	})

	var dsTypes = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : types_sbqd
    });
	
    var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType
    }); 
    
    var sm =  new Ext.grid.CheckboxSelectionModel({})   //  创建选择模式
    
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'sbId': {
			name: 'sbId',
			fieldLabel: '设备主键',
			hidden:true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '系统编码',
			hidden:true,
			hideLabel:true
         }, 'sbBm': {
			name: 'sbBm',
			fieldLabel: '设备编码/图号',
			anchor:'95%'
         }, 'sbMc': {
			name: 'sbMc',
			fieldLabel: '设备名称',  
			anchor:'95%'
         },'sccj': {
			name: 'sccj',
			fieldLabel: '生产厂家',
			anchor:'95%'
         },'returnDate': {
			name: 'returnDate',
			fieldLabel: '到货日期',
			format: 'Y-m-d',
            minValue: '2010-01-01',
			anchor:'95%'
         }, 'ggxh': {
			name: 'ggxh',
			fieldLabel: '规格型号', 
			anchor:'95%'
         }, 'dw': {
			name: 'dw',
			fieldLabel: '单位',
			anchor:'95%'
         },'zs': {
			name: 'zs',
			fieldLabel: '总到货数量',
			anchor:'95%'
         },'dj': {
			name: 'dj',
			fieldLabel: '签订单价',
			anchor:'95%'
         },'zj': {
			name: 'zj',
			fieldLabel: '签订总价',
			anchor:'95%'
         },'jzh': {
			name: 'jzh',
			fieldLabel: '机组号',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: dsJzh,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         } ,'sx': {
			name: 'sx',
			fieldLabel: '属性',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: dsTypes,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         } ,'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },
         'kcsl': {
			name: 'kcsl',
			fieldLabel: '库存数量',
			anchor:'95%'
         },
         //2010-12-20 新增内容
         'dhzsl': {name: 'dhzsl',fieldLabel: '到货总数量',anchor:'95%'},
         'yszsl': {name: 'yszsl',fieldLabel: '验收总数量',anchor:'95%'},
         'rkzsl': {name: 'rkzsl',fieldLabel: '入库总数量',anchor:'95%'},
         'ckzsl': {name: 'ckzsl',fieldLabel: '出库总数量',anchor:'95%'},
         'kczsl': {name: 'kczsl',fieldLabel: '库存总数量',anchor:'95%'},
         
         'bdgid': {name: 'bdgid',fieldLabel: '概算编号',anchor:'95%'},
         'bdgno': {name: 'bdgno',fieldLabel: '概算',anchor:'95%'},
         'jhsl': {name: 'jhsl',fieldLabel: '签订数量',anchor:'95%'},
         'azsl': {name: 'azsl',fieldLabel: '安装数量',anchor:'95%'}       
    }

     // 3. 定义记录集
    var Columns = [
    	{name: 'bdgid', type: 'string'},
    	{name: 'bdgno', type: 'string'},
		{name: 'jhsl', type: 'float'},
		{name: 'azsl', type: 'float'},		
    	{name: 'sbId', type: 'string'},
    	{name: 'pid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'sbBm', type: 'string'},    	
		{name: 'sbMc', type: 'string' },
		{name: 'sx', type: 'string'},
		{name: 'ggxh', type: 'string'},
		{name: 'jzh', type: 'string'},
		{name: 'dw', type: 'string'},
		{name: 'zs', type: 'float'},
		{name: 'kcsl', type: 'string'},
		{name: 'dj', type: 'float'},
		{name: 'zj', type: 'float'},
		{name: 'sccj', type: 'string'},
		{name: 'conid', type: 'string'},
		
		{name: 'dhzsl', type: 'float'},
		{name: 'yszsl', type: 'float'},
		{name: 'rkzsl', type: 'float'},
		{name: 'ckzsl', type: 'float'},
		{name: 'kczsl', type: 'float'},
		
		{name: 'returnDate', type: 'date',dateFormat: 'Y-m-d H:i:s'}
		];
		
    var Plant = Ext.data.Record.create(Columns);			//定义记录集   	
    var PlantInt = {sbId:'',pid:CURRENTAPPID, sbBm:'', sbMc:'', returnDate:'', sccj:'',  ggxh:'',jzh:'',
    				sx:'1',  zs:0, dj:0, zj:'', dw:'',conid:p_conId,
    				kcsl:'',jhsl:0,bdgid:'',azsl:0,
    				dhzsl:0,yszsl:0,rkzsl:0,ckzsl:0,kczsl:0
    				}	//设置初始值 
        
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	//new Ext.grid.RowNumberer({header:'序号',width:33}),
    	{id:'sbId',header: fc['sbId'].fieldLabel,dataIndex: fc['sbId'].name,hidden: true
        },{id:'conid',header: fc['conid'].fieldLabel,dataIndex: fc['conid'].name,hidden: true
        },{id:'pid',header: fc['pid'].fieldLabel,dataIndex: fc['pid'].name,hidden: true
        },{id:'sbBm',header: fc['sbBm'].fieldLabel,dataIndex: fc['sbBm'].name
        },{id:'sbMc',header: fc['sbMc'].fieldLabel,dataIndex: fc['sbMc'].name,editor: new fm.TextField(fc['sbMc']),width: 150
        },{id:'ggxh',header: fc['ggxh'].fieldLabel,dataIndex: fc['ggxh'].name, editor: new fm.TextField(fc['ggxh']),width: 100
         },{id:'sccj', header: fc['sccj'].fieldLabel, dataIndex: fc['sccj'].name,editor: new fm.TextField(fc['sccj']),width: 200
        },{id:'sx',header: fc['sx'].fieldLabel, dataIndex: fc['sx'].name, editor: new fm.ComboBox(fc['sx']), renderer: dsTypeRender, width: 60
        },{id:'bdgid',header: fc['bdgid'].fieldLabel,dataIndex: fc['bdgid'].name,hidden: true 
        },{id:'bdgno',header: fc['bdgno'].fieldLabel,dataIndex: fc['bdgno'].name,width: 100,
        	renderer:function(value){
        		var str = '';
		   		for(var i=0;i<bdgArr.length;i++){
		   			if (bdgArr[i][0] == value) {
		   				str = bdgArr[i][1]
		   				break; 
		   			}
		   		}
		   		return str;
        	}
        },{id:'jzh',header: fc['jzh'].fieldLabel,dataIndex: fc['jzh'].name, editor: new fm.ComboBox(fc['jzh']),width: 80,renderer: dsJzhRender
        },{id:'dw',header: fc['dw'].fieldLabel,dataIndex: fc['dw'].name, editor: new fm.TextField(fc['dw']),width: 35 
        },{id:'returnDate',header: fc['returnDate'].fieldLabel,dataIndex: fc['returnDate'].name, renderer:formatDate,editor: new fm.DateField(fc['returnDate']),width: 100       
        },{id:'jhsl', header: fc['jhsl'].fieldLabel,width: 80,dataIndex: fc['jhsl'].name,editor: new fm.NumberField(fc['jhsl'])
        },{id:'dj',header: fc['dj'].fieldLabel,dataIndex: fc['dj'].name,width: 60,editor: new fm.TextField(fc['dj'])
        },{id:'zj',header: fc['zj'].fieldLabel,dataIndex: fc['zj'].name, renderer:zjRender, width: 60
       	 },{id:'zs',hidden : true,header: fc['zs'].fieldLabel,dataIndex: fc['zs'].name,width: 80
       	 },{id:'kcsl',hidden : true,header: fc['kcsl'].fieldLabel,dataIndex: fc['kcsl'].name,renderer:getStoreNum,width: 80
        
        },{id:'dhzsl',header: fc['dhzsl'].fieldLabel,dataIndex: fc['dhzsl'].name,width:70,css:'background:#f5fffa;'
        },{id:'yszsl',header: fc['yszsl'].fieldLabel,dataIndex: fc['yszsl'].name,width:70,css:'background:#f5fffa;'
        },{id:'rkzsl',header: fc['rkzsl'].fieldLabel,dataIndex: fc['rkzsl'].name,width:70,css:'background:#f5fffa;'
        },{id:'ckzsl',header: fc['ckzsl'].fieldLabel,dataIndex: fc['ckzsl'].name,width:70,css:'background:#f5fffa;'
        },{id:'kczsl',header: fc['kczsl'].fieldLabel,dataIndex: fc['kczsl'].name,width:70,css:'background:#f5fffa;'
        
        },{id:'azsl',hidden : true,header: fc['azsl'].fieldLabel,width: 80,dataIndex: fc['azsl'].name
        }  
    ]);

    cm.defaultSortable = true;						//设置是否可排序
      
    // 4. 创建数据源
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
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
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'asc');	//设置默认排序列
    var btnAdd = new Ext.Button({
		id: 'chooseEqu',
		text: '从设备清册选择',
		tooltip: '从设备清册选择设备',
		iconCls: 'add',
		handler: function(){
			insertFun();
		}
	});
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
        title : gridTilte,
    	id: 'grffid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        //tbar: ['修改概算','-'],			//顶部工具栏，可选
        tbar:[],
        border: false,				// 
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        header: true,				//
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
        crudText:{add:'从设备清册选择设备'},
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: primaryKey,
      	deleteHandler: deleteFun,
      	saveHandler: saveFun,
      	insertHandler: insertFun,
      	
      	enableDD: true,   
    	ddGroup: "tgDD",    
	    enableDragDrop : true

   });  
   
    
    ds.on('load',function(_store,_records,_obj){
    	DWREngine.setAsync(false);
    	for(var i=0;i<_records.length;i++){
    		baseMgm.getData("select * from equ_rec_sub where EQUID ='"+ _records[i].data.sbId +"' and recid is not null",function(_list){
    			//alert(_list)
    			if(_list.length > 0) Ext.DomHelper.applyStyles(grid.getView().getRow(i),"background-color:red") ;
    		})
    	}
    	DWREngine.setAsync(true);
    })
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };
    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
    
    
    function renderConno(value, metadata, record){
		var getConid = record.get('conid');
		//alert(record.get('parentid'))
		if(getConid && getConid!="" && record.get('parentid')){
			var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
			output += 'onmouseout="this.style.cursor = \'default\';"'
			output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
			output += 'window.location.href=\''+BASE_PATH
			output += 'Business/contract/cont.generalInfo.view.jsp?conid='+getConid+'\'">'+ value+'</span>'
			return output;
		}else{
			return value;
		}
	}
    
    function strToInt(str){
    	if (str[0] == '0') {
    		str = str.substring(1, str.length);
    		strToInt(str);
    	} else {
    		return str;
    	}
    }
    
	// 新增一个设备
    function insertFun(){
		selectWin_sbqc.show();
    	treePanelsb.render(); // 显示树
    	treePanelsb.expand();
		if(rootsb.firstChild){
			rootsb.expand(false,true,function(){rootsb.firstChild.expand()});//自动展开第一次子节点
		}
		dssb.reload({params:{start: 0,limit: PAGE_SIZE}});
    };
    
	// 保存一个设备
	function saveFun(){
		var records = grid.getStore().getModifiedRecords();
		if(records.length == 0) return;
		var equListArr = new Array();
		var conid = "";
		for (var i=0; i<records.length; i++){
			equListArr.push(records[i].data);
			conid = records[i].data.conid;
		}
		DWREngine.setAsync(false);
		equlistMgm.saveEqulistAndUpdateQc(equListArr,conid,function(str){
			if(str=="2"){
				Ext.example.msg('提示','设备已经有到货记录，不能修改！');
				return;
			}else if(str=="1"){
				Ext.example.msg('提示','设备修改成功！')
				ds.reload();
			}else if(str=="0"){
				Ext.example.msg('提示','设备修改错误');
				return;
			}
		})
		DWREngine.setAsync(true);
    };
	
    // 删除一个设备
    function deleteFun(){
    	var records = sm.getSelections();
		if(records.length == 0) return;
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text) {
			if (btn == "yes") {
				var sbIdArr = new Array();
				var conid = "";
				for (var i=0; i<records.length; i++){
					sbIdArr.push(records[i].data.sbId);
					conid = records[i].data.conid;
				}
		
		    	DWREngine.setAsync(false);
		    	equlistMgm.deleteEqulistSb(sbIdArr,conid,function(str){
		    		if(str=="2"){
						Ext.example.msg('提示','设备已经有到货记录，不能删除！');
						return;
					}else if(str=="1"){
						Ext.example.msg('提示','设备删除成功！')
						ds.reload();
					}else if(str=="0"){
						Ext.example.msg('提示','设备删除错误');
						return;
					}
		    	});
		    	DWREngine.setAsync(true);
			}
		})		
    	//grid.defaultDeleteHandler();
    }
    
    //选择概算分类
    function selectBdg(){
    	var records = sm.getSelections();
		if(thisBdgid=="" || thisBdgno==""){
			Ext.example.msg("提示","请先选择左侧的概算分类！");
			return;
		}
		if(records.length == 0){
			Ext.example.msg("提示","请选择需要修改概算的设备！");
			return;
		}
		for(var i=0;i<records.length;i++){
			records[i].set('bdgid',thisBdgid);
			records[i].set('bdgno',thisBdgno);
		}
		grid.defaultSaveHandler();
    	//Ext.example.msg("提示","修改设备所属的概算分类")
    }
    
	// 重新加载清单树    
    function reloadTree(){
    	if (tmpNode){
			var node = tmpNode.isLeaf()? tmpNode.parentNode : tmpNode;
			var baseParams = treePanel.loader.baseParams
			baseParams.parent = node.attributes.sbId;
			treePanel.getEl().mask('waiting..');
			if (node.isExpanded()) {
			   treeLoader.load(node);
			   node.expand();
		    } 
		    node.expand();
			treePanel.getEl().unmask();
		}
    }
    
   // 属性值 
   function dsTypeRender(value){
   		var str = types_sbqd[5][1];
   		for(var i=0; i<types_sbqd.length; i++) {
   			if (types_sbqd[i][0] == value) {
   				str = types_sbqd[i][1]
   				break; 
   			}
   		}
   		return str;
   }
   
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
   
   //概算名称
   function bdgRender(value){
   		var str = '';
   		for(var i=0;i<bdgArr.length;i++){
   			if (bdgArr[i][0] == value) {
   				str = bdgArr[i][1]
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
					setTimeout(reloadTree, 2000);
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
	function zjRender(value,metadata,record){
		var result = 0;
		result = record.data.dj * record.data.jhsl
		return result;
	}
	function formatDate(value){ 
	    return value ? value.dateFormat('Y-m-d') : '';
	};	
