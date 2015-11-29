var bean = 'com.sgepit.pmis.finalAccounts.complete.hbm.FacompWxzcCqdtAsset';
var conBeanName = "com.sgepit.pmis.finalAccounts.complete.hbm.FacompWxzcCqdtInverstView";
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "fixedno"
var rootNew,treeLoaderNew,treePanelNew;
var ds,sm,otherAssetGrid;
var rootText="其他资产";
var selectConid="";
var conDs;
Ext.onReady(function() {
	var typetreeArr = new Array();
    DWREngine.setAsync(false);
    var sql1 = "select t.uids,t.treeid,t.fixedno,t.fixedname from Facomp_Fixed_Asset_Tree t";
    baseDao.getData(sql1,function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);          
            temp.push(list[i][1]);          
            temp.push(list[i][2]);          
            temp.push(list[i][3]);          
            typetreeArr.push(temp);         
        }
    });
    DWREngine.setAsync(true);
	var typetreeDs = new Ext.data.SimpleStore({
	   fields: ['k', 'v'],   
	   data: typetreeArr
	});
	var fm = Ext.form; // 包名简写（缩写）
	/***************************其他资产合同树 start************************************/
	rootNew = new Ext.tree.AsyncTreeNode({
		id:'0',
        text: rootText,
        iconCls: 'form'
    })
	treeLoaderNew = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"otherAssetConTree", 
			businessName:"faCostManageService", 
			pid:CURRENTAPPID, 
			parent:0
		},
		clearOnLoad: false,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanelNew = new Ext.tree.ColumnTree({
        id: 'asset-tree-panel',
        iconCls: 'icon-by-category',
        region: 'west',
        width: 300,
        minSize: 100,
        maxSize: 700,
        frame: false,
        header: false,
        border: false,
        split : true,
        collapsible : true,
        collapseMode : 'mini',
        lines: true,
        autoScroll: true,
		tbar:[{
                iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ rootNew.expand(true); }
            },'-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ rootNew.collapse(true); }
            }],       
		columns:[{
            header: '合同名称',
            width: 700,	
            dataIndex: 'conname'
        },{
            header: '合同编号',
            width: 0,
            dataIndex: 'conno',
            hidden:true
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            dataIndex: 'pid',
            renderer: function(value){
            	return "<div id='pid'>"+value+"</div>";
            }
        },{
            header: '主键',	
            width: 0,				
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        },
        	{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parentid',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        }], 
        loader: treeLoaderNew,
        root: rootNew,
        rootVisible: true
	});
	
	
	treePanelNew.on('beforeload', function(node) {
		var parentid = node.attributes.conid;
		if (parentid == null)
			parentid = '0';
		var baseParams = treePanelNew.loader.baseParams
		baseParams.pid = CURRENTAPPID;
		baseParams.parent = parentid;	
			
	});
    treePanelNew.on('click', function (node, e ){  
		var elNode = node.getUI().elNode;
		var isIeaf = elNode.all("isleaf")!=null?elNode.all("isleaf").innerText:0;
		var conid=node.id;
		if(isIeaf!=1){
			selectConid="";
			var conids=""
			DWREngine.setAsync(false);
       		db2Json.selectData("select conid from facomp_other_asset_con_view where pid='"+CURRENTAPPID+"' and parentid like '"+conid+"%'",
	        		function (jsonData) {
				    	var list = eval(jsonData);
				    	if(list!=null){
				            for(var i=0;i<list.length;i++){
				            	var bdgid=list[i].conid;
				            	conids+="'"+bdgid+"'"+",";
				            }
				            conids=conids.substring(0,conids.length-1);
				    	}
		  	 });
		    DWREngine.setAsync(true);
	        ds.baseParams.params = "conid in ("+conids+") and pid='" + CURRENTAPPID + "'";	
	        conDs.baseParams.params = "conid in ("+conids+") and pid='" + CURRENTAPPID + "'";	
		}else{
        	selectConid = elNode.all("conid").innerText;
        	PlantInt.conid=selectConid;
        	ds.baseParams.params = "pid='" + CURRENTAPPID + "' and conid='" + selectConid + "'";
        	conDs.baseParams.params = "pid='" + CURRENTAPPID + "' and conid='" + selectConid + "'";
		}
		ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
		conDs.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
	});
	/***************************其他资产合同树  end************************************/
	/***************************其他资产合同树  end************************************/
		var root = new Ext.tree.AsyncTreeNode({
	        id : "01",
	        text : "固定资产",
	        expanded : true,
	        iconCls : 'form'
	    })
	    var rootType = new Ext.tree.AsyncTreeNode({
	        id : "01",
	        text : "固定资产分类",
	        expanded : true,
	        iconCls : 'form'
	    })
	    var treeLoader = new Ext.tree.TreeLoader({
	        url: MAIN_SERVLET,
	        baseParams: {
	            ac:"columntree", 
	            treeName:"getFACompFixedAssetList", 
	            businessName:"faFixedAssetService",
	            parentid:"0",
	            pid: CURRENTAPPID
	        },
	        clearOnLoad: true,
	        uiProviders:{
	            'col': Ext.tree.ColumnNodeUI
	        }
	    });
	    
	    var treePanelObj = {
	        id : 'list',
	        region: 'west',
	        width: 240,
	        minSize: 240,
	        maxSize: 550,
	        frame: false,
	        header: false,
	        border: false,
	        collapsible : true,
	        collapseMode : 'mini',
	        rootVisible: true,
	        split: true,
	        lines: true,
	        autoScroll: true,
	        animate: false,
	        tbar: [
	        '<font color=#15428b><b>固定资产清单</b></font>','-',
	        {
	            iconCls: 'icon-expand-all',
	            tooltip: '全部展开',
	            handler: function(){ root.expand(true); }
	        }, '-', {
	            iconCls: 'icon-collapse-all',
	            tooltip: '全部折叠',
	            handler: function(){ root.collapse(true); }
	        }
	        //,'-',addTreeBtn,'-',editTreeBtn,'-',delTreeBtn
	        ],
	        columns:[{
	            header: '固定资产名称',
	            dataIndex: 'fixedname',
	            width: 380,
	            renderer: function(value){
	                return "<div id='fixedname'>"+value+"</div>";
	            }
	        },{
	            header: '固定资产编码',
	            dataIndex: 'fixedno',
	            renderer: function(value){
	                return "<div id='fixedno'>"+value+"</div>";
	            },
	            width: 160
	        },{
	            header: '主键',
	            dataIndex: 'uids',
	            width: 0,
	            renderer: function(value){
	                return "<div id='uids'>"+value+"</div>";
	            }
	        },{
	            header: '树编码',
	            dataIndex: 'treeid',
	            width: 0,
	            renderer: function(value){
	                return "<div id='treeid'>"+value+"</div>";
	            }
	        }, {
	            header: '是否子节点',
	            dataIndex: 'isleaf',
	            width: 0,
	            renderer: function(value){
	                return "<div id='isleaf'>"+value+"</div>";
	            }
	        },{
	            header: '父节点',
	            dataIndex: 'parentid',
	            width: 0,
	            renderer: function(value){
	                return "<div id='parentid'>"+value+"</div>";
	            }
	        }], 
	        loader: treeLoader,
	        root: root
	    };
	    var treeLoaderType = new Ext.tree.TreeLoader({
	        url: MAIN_SERVLET,
	        baseParams: {
	            ac:"columntree", 
	            treeName:"getFACompFixedAssetTree", 
	            businessName:"faFixedAssetService",
	            parentid:"01",
	            pid: CURRENTAPPID
	        },
	        clearOnLoad: true,
	        uiProviders:{
	            'col': Ext.tree.ColumnNodeUI
	        }
	    });
	    
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
	            var record = sm.getSelected();
	            record.set('typetreeid',selNode.attributes.uids);
	            fixedTypeWin.hide();
	        }
	    })
	    var treePanelObj2 = treePanelObj;
	    treePanelObj2.id = 'tree';
	    treePanelObj2.root = rootType;
	    treePanelObj2.loader = treeLoaderType;
	    treePanelObj2.region = 'center';
	    treePanelObj2.tbar = [{
	            iconCls: 'icon-expand-all',
	            tooltip: '全部展开',
	            handler: function(){ rootType.expand(true); }
	        }, '-', {
	            iconCls: 'icon-collapse-all',
	            tooltip: '全部折叠',
	            handler: function(){ rootType.collapse(true); }
	        },'-',chooseBtn
	    ]
	    var fixedTypeTree = new Ext.tree.ColumnTree(treePanelObj2);
	
	    
	//TODO:固定资产分类树窗口
	    var fixedTypeWin = new Ext.Window({                 
	         title: '<font color=#15428b><b>固定资产分类</b></font>',
	         layout: 'fit',
	         width: 560,
	         height: 480,
	         modal: true,
	         closeAction: 'hide',
	         items: [fixedTypeTree]
	     });
	     
	    fixedTypeTree.on('beforeload', function(node) {
	        var treeid = node.attributes.treeid;
	        if (treeid == null){
	            treeid = "01";
	        }
	        fixedTypeTree.loader.baseParams.parentid = treeid
	        fixedTypeTree.loader.baseParams.pid = CURRENTAPPID;
	    })
    

	/***************************其他资产合同树  end************************************/
	
	sm = new Ext.grid.CheckboxSelectionModel(); // 创建选择模式
	var fc = { // 创建编辑域配置
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同主键',
			hidden : true,
			hideLabel : true
		},'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			hidden : true,
			hideLabel : true
		},'xh' : {
			name : 'xh',
			fieldLabel : '序号',
			hidden : true,
			hideLabel : true
		},
		'fixedno' : {
			name : 'fixedno',
			fieldLabel : '资产编号',
			anchor : '95%'
		},
		'fixedname' : {
			name : 'fixedname',
			fieldLabel : '资产名称<font color=red>*</font>',
			allowBlank:false,
			anchor : '95%'
		},
		'typetreeid' : {
			name : 'typetreeid',
			fieldLabel : '资产分类<font color=red>*</font>',
			allowBlank:false,
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

		},
		'deliveryUnit' : {
			name : 'deliveryUnit',
			fieldLabel : '供货单位',
			anchor : '95%'
		},
		'unit' : {
			name : 'unit',
			fieldLabel : '单位',
			anchor : '95%'
		},
		'num' : {
			name : 'num',
			fieldLabel : '数量',
			anchor : '95%'
		},
		'money' : {
			name : 'money',
			fieldLabel : '金额<font color=red>*</font>',
			allowBlank:false,
			anchor : '95%'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		}
	}

	// 3. 定义记录集
	var Columns = [{
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'uids',
				type : 'string'
			}, {
				name : 'xh',
				type : 'string'
			}, {
				name : 'fixedno',
				type : 'string'
			}, {
				name : 'fixedname',
				type : 'string'
			}, {
				name : 'typetreeid',
				type : 'string'
			}, {
				name : 'deliveryUnit',
				type : 'string'
			}, {
				name : 'unit',
				type : 'string'
			}, {
				name : 'num',
				type : 'float'
			}, {
				name : 'money',
				type : 'float'
			}, {
				name : 'remark',
				type : 'string'
			}];
	var typetreeCombo = new fm.ComboBox(fc['typetreeid']);
	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantInt = {
		uids:'',
		pid : CURRENTAPPID,
		conid : selectConid,
		xh:'',
		fixedno:'',
		fixedname:'',
		typetreeid:'',
		deliveryUnit:'',
		unit:'',
		num:'',
		money:'',
		remark : ''
	} // 设置初始值

	cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : 'conid',
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				hidden : true
			}, {
				id : 'xh',
				header : fc['xh'].fieldLabel,
				dataIndex : fc['xh'].name,
				hidden : true
			}, {
				id : 'fixedno',
				header : fc['fixedno'].fieldLabel,
				dataIndex : fc['fixedno'].name,
				editor : new fm.TextField(fc['fixedno']),
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				width : 160
			}, {
				id : 'fixedname',
				header : fc['fixedname'].fieldLabel,
				dataIndex : fc['fixedname'].name,
				editor : new fm.TextField(fc['fixedname']),
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				width : 200
			}, {
				id : 'typetreeid',
				header : fc['typetreeid'].fieldLabel,
				dataIndex : fc['typetreeid'].name,
				editor:typetreeCombo,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					for (var i = 0; i < typetreeArr.length; i++) {
	                    if(v == typetreeArr[i][0])
	                        return typetreeArr[i][3];
	                }
				},
				width : 160
			}, {
				id : 'deliveryUnit',
				header : fc['deliveryUnit'].fieldLabel,
				dataIndex : fc['deliveryUnit'].name,
				editor : new fm.TextField(fc['deliveryUnit']),
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				width : 160
			}, {
				id : 'unit',
				header : fc['unit'].fieldLabel,
				dataIndex : fc['unit'].name,
				editor : new fm.TextField(fc['unit']),
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				width : 80
			}, {
				id : 'num',
				header : fc['num'].fieldLabel,
				dataIndex : fc['num'].name,
				editor : new fm.NumberField(fc['num']),
				align:'right',
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				width : 100
			}, {
				id : 'money',
				header : fc['money'].fieldLabel,
				dataIndex : fc['money'].name,
				editor : new fm.NumberField(fc['money']),
				align:'right',
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				width : 100
			}, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				editor : new fm.TextField(fc['remark']),
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				width : 100
			}]);

	cm.defaultSortable = true; // 设置是否可排序

	// 4. 创建数据源
	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : "pid='" + CURRENTAPPID + "'"
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
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
	ds.setDefaultSort(orderColumn, 'asc'); // 设置默认排序列
	ds.on('load', function(t, rs) {
	})
	// 5. 创建可编辑的grid: grid-panel
	otherAssetGrid = new Ext.grid.EditorGridTbarPanel({
				ds : ds, // 数据源
				cm : cm, // 列模型
				sm : sm, // 行选择模式
				tbar : ['<font color=#15428b><B>固定资产信息<B></font>','-'], // 顶部工具栏，可选
				border : false, // 
				region : 'center',
				clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
				header : false, //
				frame : false, // 是否显示圆角边框
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				// expend properties
				plant : Plant,
				plantInt : PlantInt,
				servletUrl : MAIN_SERVLET,
				insertHandler:insertFun,
				bean : bean,
				business : business,
				primaryKey : primaryKey
			});
	/**=================================其他合同稽核信息Begin=======================================*/

	var fcCon = {
			conid : {
				name : 'conid',
				fieldLabel : '合同Id'
			},
			pid : {
				name : 'pid',
				fieldLabel : '项目Id'
			},
			conno : {
				name : 'conno',
				fieldLabel : '合同编号'
			},
			conname : {
				name : 'conname',
				fieldLabel : '合同名称'
			},
			conmoney : {
				name : 'conmoney',
				fieldLabel : '合同签订金额'
			},
			changemoney : {
				name : 'changemoney',
				fieldLabel : '合同变更金额'
			},
			convaluemoney : {
				name : 'convaluemoney',
				fieldLabel : '合同总金额'
			},
			investmentFinishMoney : {
				name : 'investmentFinishMoney',
				fieldLabel : '投资完成金额'
			}
	};
	
	var conColumnParams = [{
				name : 'conid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'	
			}, {
				name : 'conno',
				type : 'string'
			}, {
				name : 'conname',
				type : 'string'
			}, {
				name : 'conmoney',
				type : 'float'
			}, {
				name : 'changemoney',
				type : 'float'
			}, {
				name : 'convaluemoney',
				type : 'float'
			}, {
				name : 'investmentFinishMoney',
				type : 'float'
			}];
	
	var conSm = new Ext.grid.CheckboxSelectionModel({});
	
	var conCm = new Ext.grid.ColumnModel([conSm,
			{
				id : 'conid',
				header : fcCon['conid'].fieldLabel,
				dataIndex : fcCon['conid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcCon['pid'].fieldLabel,
				dataIndex : fcCon['pid'].name,
				hidden : true
			}, {
				id : 'conno',
				header : fcCon['conno'].fieldLabel,
				dataIndex : fcCon['conno'].name
			}, {
				id : 'conname',
				header : fcCon['conname'].fieldLabel,
				dataIndex : fcCon['conname'].name,
				width : 180
			}, {
				id : 'conmoney',
				header : fcCon['conmoney'].fieldLabel,
				dataIndex : fcCon['conmoney'].name,
				align:'right'
			}, {
				id : 'changemoney',
				header : fcCon['changemoney'].fieldLabel,
				dataIndex : fcCon['changemoney'].name,
				align:'right'
			}, {
				id : 'convaluemoney',
				header : fcCon['convaluemoney'].fieldLabel,
				dataIndex : fcCon['convaluemoney'].name,
				align:'right'
			}, {
				id : 'investmentFinishMoney',
				header : fcCon['investmentFinishMoney'].fieldLabel,
				dataIndex : fcCon['investmentFinishMoney'].name,
				align:'right'
			}
		]);
	conCm.defaultSortable = true;
	conCm.defaultWidth = 140;

	conDs = new Ext.data.Store({
			baseParams : {
				ac : 'list',
				bean : conBeanName,
				business : business,
				method : listMethod,
				params : "pid='" + CURRENTAPPID + "'"
			},
			proxy : new Ext.data.HttpProxy({
						method : 'GET',
						url : MAIN_SERVLET
					}),
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount',
						id : 'conid'
					}, conColumnParams),
			remoteSort : true
		});
	conDs.setDefaultSort("conid", 'asc');

	var conGrid = new Ext.grid.EditorGridTbarPanel({
			region : 'south',
			id : 'conGrid',
			iconCls : 'icon-by-category',
			ds : conDs,
			cm : conCm,
			sm : conSm,
			servletUrl : MAIN_SERVLET,
			bean : conBeanName,
			tbar : ['<font color=#15428b><B>其他合同已稽核投资完成信息<B></font>','-'],
			border : false,
			autoScroll : 'true',
			clicksToEdit : 2,
			primaryKey : 'conid',
			addBtn : false,
			height:document.body.clientHeight * 0.3,
			saveBtn : false,
			delBtn : false,
			loadMask : true,
			stripeRows : true,
			bbar : new Ext.PagingToolbar({
					pageSize : PAGE_SIZE,
					store : conDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
					}),
			viewConfig : {
				forceFit : false,
				ignoreAdd : true
			}
		});
	
	/**=================================其他合同稽核信息End=========================================*/
	var contentPanel=new Ext.Panel({
		layout:'border',
		region:'center',
		border:false,
		items:[otherAssetGrid,conGrid]
	})
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [treePanelNew,contentPanel]
			});
	otherAssetGrid.getTopToolbar().add('->','单位：元')
	rootNew.reload(function(){
				if(rootNew.hasChildNodes()){
					rootNew.expand(false,false,null)
				}
			});
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	conDs.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
});
function insertFun(){
	if(selectConid!=null&&selectConid.length>0){
		this.defaultInsertHandler();
	}else{
		Ext.example.msg('提示', '请先选择一条合同！');
	}
}