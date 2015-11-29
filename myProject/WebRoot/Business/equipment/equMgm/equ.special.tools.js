
var applicantGrid,applicantGrid2,applicantGrid3,applicantGrid4;
var applicantDs,applicantDs2,applicantDs3,applicantDs4;
var bidContentId = null;
var applicantBeanName = "com.sgepit.pmis.equipment.hbm.EquSpecialTools";
var applicantBeanName2 = "com.sgepit.pmis.equipment.hbm.EquSpecialToolsDetail";
var applicantBeanName3 = "";
var applicantBeanName4 = "com.sgepit.pmis.equipment.hbm.EquSpecialToolsDetailGh";
var plantInt,plantInt2,plantInt3,plantInt4;
var disableBtn = ModuleLVL != '1';
var sm,sm2,sm3,sm4;
var Columns,Columns2,Columns3,Columns4;
var unitStore,unitArr,unitBox,proTreeCombo;
var cm4,gridLabel4;
var where="unit_type_id not in ('9')";
var unitid=USERBELONGUNITID;
var upunit=USERBELONGUNITID;
var equTypeArr=new Array();
//项目单位array
var array_prjs=new Array();
//负责用户array
var array_user=new Array();
var detailuids,jcnum,stockid;
var ghWin,selectWin;
var bh_;
var incrementLsh =0;
var maxStockBhPrefix;

Ext.onReady(function() {
    maxStockBhPrefix = USERNAME + new Date().format('ym');
    DWREngine.setAsync(false);  
    stockMgm.getStockPlanNewBh(maxStockBhPrefix,"bh","wz_cjhpb",null,function(dat){
        if(dat != "")   {
            bh_ = dat;
            incrementLsh = (bh_.substr(maxStockBhPrefix.length,4)) *1
        }   
    })
    DWREngine.setAsync(true); 
	if(isFlwTask && bh!=null && bh!="") bh_ = bh;  
	// 通用combobox renderer
	Ext.util.Format.comboRenderer = function(combo) {
		return function(value) {
			var record = combo.findRecord(combo.valueField, value);
			return record
					? record.get(combo.displayField)
					: combo.valueNotFoundText;
		}
	}
	//借用
	var borrowBtn = new Ext.Toolbar.Button({
				id : 'borrow',
				text : '借用',
				handler : borrowFun
			});	
	//归还
	var ghBtn = new Ext.Toolbar.Button({
				id : 'gh',
				text : '归还',
				handler : guihFun
			});		
	DWREngine.setAsync(false);
	DWREngine.setAsync(false);
	//设备类型equTypeArr
	appMgm.getCodeValue("设备合同树分类",function(list){
		for(i = 0; i < list.length; i++) {
			if(list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			equTypeArr.push(temp);			
		}
	});
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
    DWREngine.setAsync(true);
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
	//项目单位下拉框
	proTreeCombo=new Ext.form.ComboBox({
		hidden :true,
		name : 'dept',
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
   var userCombo = new Ext.form.ComboBox({
		triggerAction : 'all',
		mode : 'local',
		lazyRender : true,
		store : dsCombo_user,
		valueField : 'k',
		displayField : 'v',
		allowBlank : false,
		name : 'deptuser'

			});	
      //单位选择
  unitBox = new Ext.form.ComboBox({
        emptyText : '请选择单位',
        id : 'dept',
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
  unitBox.on('select',function(){
  }); 
    
  unitTree.on('click',function(node){
    unitBox.collapse(); 
	var leaf=node.leaf;
	if(leaf==1){
    	var rec = sm.getSelected() ;
    	rec.set("dept", "");		
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
	sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true,
				header : ''
			});	
	
	sm2 = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true,
				header : ''
			});				
	var cm = new Ext.grid.ColumnModel({
				columns : [sm
				  ,{
					id : 'uids',
					header : 'uids',
					dataIndex : 'uids',
					hidden : true
					},
				  {
					id : 'PID',
					header : 'pid',
					dataIndex : 'pid',
					hidden : true
					},
					{
					id : 'bh',
					header : '借用编号',
					dataIndex : 'bh',
					width : 200
					},
				   {
					id : 'state',
					header : '审批状态',
					dataIndex : 'state',
					width : 120,
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
								if("0"==data){
									return "未审批";
								}else if("-1"==data){
									return "审批中";
								}else if("1"==data){
									return "已审批";
								}
			                }									
					}
					,{
					id : 'dept',
					header : '借用部门',
					dataIndex : 'dept',
					width : 300,
					editor :unitBox,
					renderer :respondDeptRendererFun								
					},{
					id : 'deptuser',
					header : '借用人',
					dataIndex : 'deptuser',
					width : 160,
					editor :userCombo,
					renderer : respondUserRendererFun									
					}, {
					id : 'usetime',
					header : '借用时间',
					dataIndex : 'usetime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
					align : 'center',
					width:150,
					type : 'date',
					editor : new Ext.form.DateField({
								name : 'usetime',
								readOnly:true,
								format : 'Y-m-d'
							})
					},
				   {
					id : 'memo',
					header : '备注',
					dataIndex : 'memo',
					width : 400,
					editor : new Ext.form.TextField({
								name : 'memo',
								allowBlank : true
							}),
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
	                var qtip = "qtip=" + data;
	                return '<span ' + qtip + '>' + data + '</span>';
	                    return data;
			                }									
					}]

			});
	var cm2 = new Ext.grid.ColumnModel({
				columns : [sm2
				  ,{
					id : 'uids',
					header : 'uids',
					dataIndex : 'uids',
					width : 100,
					hidden : true
					},{
					id : 'masteruids',
					header : 'masteruids',
					dataIndex : 'masteruids',
					width : 100,
					hidden : true
					},{
					id : 'stockid',
					header : 'stockid',
					dataIndex : 'stockid',
					width : 100,
					hidden : true
					},{
					id : 'bh',
					header : 'bh',
					dataIndex : 'bh',
					width : 100,
					hidden : true
					},{
					id : 'conid',
					header : 'conid',
					dataIndex : 'conid',
					width : 100,
					hidden : true
					},
				   {
					id : 'toolstype',
					header : '设备类型',
					dataIndex : 'toolstype',
					width : 400,
					renderer : function(v,m,record){			
						var equ = "";
						DWREngine.setAsync(false);
					       db2Json.selectData("select uids,equ_type from equ_goods_stock where uids='"+record.data.stockid+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					    	for(var i=0;i<list.length;i++){
					    		equ=list[i].equ_type;
					    	}
					   
					     }  
					     });
					    DWREngine.setAsync(true);					
						for(var i=0;i<equTypeArr.length;i++){
							if(equ == equTypeArr[i][0])
								equ = equTypeArr[i][1];
						}
						return equ;
					}								
					},
				   {
					id : 'toolsname',
					header : '设备名称',
					dataIndex : 'toolsname',
					width : 400,
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
	                        	var equ_part_name="";
								DWREngine.setAsync(false);
							       db2Json.selectData("select uids,equ_part_name from equ_goods_stock where uids='"+record.data.stockid+"'", function (jsonData) {
							    var list = eval(jsonData);
							    if(list!=null){
							    	for(var i=0;i<list.length;i++){
							    		equ_part_name=list[i].equ_part_name;
							    	}
							   
							     }  
							     });
							    DWREngine.setAsync(true);
							    return equ_part_name;
			                }									
					},
				   {
					id : 'toolsxh',
					header : '规格型号',
					dataIndex : 'toolsxh',
					width : 400,
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
	                        	var ggxh="";
								DWREngine.setAsync(false);
							       db2Json.selectData("select uids,ggxh from equ_goods_stock where uids='"+record.data.stockid+"'", function (jsonData) {
							    var list = eval(jsonData);
							    if(list!=null){
							    	for(var i=0;i<list.length;i++){
							    		ggxh=list[i].ggxh;
							    	}
							   
							     }  
							     });
							    DWREngine.setAsync(true);
							    return ggxh;
			                }									
					},
				   {
					id : 'state',
					header : '状态',
					dataIndex : 'state',
					//width : 400,
                    hidden : true,
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
	                        	var jcnum=record.data.jcnum;
	                        	var ghnum=record.data.ghnum;
								if(jcnum!=0&&jcnum==ghnum){
									return "已归还";
								}else{
									return "已借出";
								}
			                }									
					},
				   {
					id : 'jcnum',
					header : '借出数量',
					dataIndex : 'jcnum',
					width : 400,
					editor : new Ext.form.TextField({
								name : 'jcnum',
								allowBlank : true
							}),					
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
								return data;
			                }									
					},
				   {
					id : 'ghnum',
					header : '已归还数量',
					dataIndex : 'ghnum',
					width : 400,
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
							var count=0;
							DWREngine.setAsync(false);
						       db2Json.selectData("select uids,ghnum from EQU_SPECIAL_TOOLS_DETAIL_GH where detailuids='"+record.data.uids+"'", function (jsonData) {
						    var list = eval(jsonData);
						    if(list!=null){
						    	for(var i=0;i<list.length;i++){
						    		count=count+parseInt(list[i].ghnum,10);
						    	}
						   
						     }  
						     });
						    DWREngine.setAsync(true);
						    count=parseInt(count,10);
						    return count;
			                }									
					},
				   {
					id : 'syjcnum',
					header : '剩余借出数量',
					dataIndex : 'syjcnum',
					width : 400,
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
								var jcnum=record.data.jcnum;
								var count=0;
								DWREngine.setAsync(false);
							       db2Json.selectData("select uids,ghnum from EQU_SPECIAL_TOOLS_DETAIL_GH where detailuids='"+record.data.uids+"'", function (jsonData) {
							    var list = eval(jsonData);
							    if(list!=null){
							    	for(var i=0;i<list.length;i++){
							    		count=count+parseInt(list[i].ghnum,10);
							    	}
							   
							     }  
							     });
							    DWREngine.setAsync(true);
							    count=parseInt(count,10);	
							    return jcnum-count;							
			                }									
					}
					,
				   {
					id : 'memo',
					header : '备注',
					dataIndex : 'memo',
					width : 400,
					editor : new Ext.form.TextField({
								name : 'memo',
								allowBlank : true
							}),
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
	                var qtip = "qtip=" + data;
	                return '<span ' + qtip + '>' + data + '</span>';
	                    return data;
			                }									
					}]

			});			

	Columns = [
			{
				name : 'uids',
				type : 'string'
			},		
			{
				name : 'pid',
				type : 'string'
			},		
			{
				name : 'dept',
				type : 'string'
			},		
			{
				name : 'bh',
				type : 'string'
			},		
			{
				name : 'state',
				type : 'string'
			},		
			{
				name : 'deptuser',
				type : 'string'
			},
			{
			name : 'usetime',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
			},		
			{
				name : 'memo',
				type : 'string'
			}		
			]
	Columns2 = [
			{
				name : 'uids',
				type : 'string'
			},		
			{
				name : 'bh',
				type : 'string'
			},		
			{
				name : 'stockid',
				type : 'string'
			},		
			{
				name : 'masteruids',
				type : 'string'
			},		
			{
				name : 'conid',
				type : 'string'
			},		
			{
				name : 'jcnum',
				type : 'float'
			},		
			{
				name : 'ghnum',
				type : 'float'
			},		
			{
				name : 'syjcnum',
				type : 'float'
			},		
			{
				name : 'state',
				type : 'string'
			},		
			{
				name : 'memo',
				type : 'string'
			}		
			]	
	applicantDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : applicantBeanName,
			business : "baseMgm",
			method : "findWhereOrderby",
			orderby:"bh desc"
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
		pruneModifiedRecords : true,
		sortInfo: {field: 'bh', direction: 'DESC'}
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
	applicantDs2 = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : applicantBeanName2,
			business : "baseMgm",
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
				}, Columns2),
		remoteSort : true,
		pruneModifiedRecords : true
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});		

	plantInt = {
		uids : '',
		dept :USERDEPTID,
		deptuser:USERID,
		bh:'',
        pid : CURRENTAPPID,
		state:'0',
		memo : '',
		usetime : new Date()
	};
	plantInt2 = {
		uids : '',
		masteruids :'',
		bh:'',
		stockid:'',
		conid:'',
		jcnum:0,
		ghnum:0,
		syjcnum:0,
		state:'',
		memo :''
	};
    var gridLabel=
    '<font color=#15428b><B>专用工具借用<B></font>';
    var gridLabel2=
    '<font color=#15428b><B>借用详细表<B></font>';    
	applicantGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				ds : applicantDs, // 数据源
				cm : cm, // 列模型
				sm : sm,
				tbar : new Ext.Toolbar({
						items : [gridLabel, '-']
						}),
				iconCls : 'icon-by-category', // 面板样式
				border : false, // 
				clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
				header : false, //
				autoScroll : true, // 自动出现滚动条
				deleteHandler : function() {
					this.defaultDeleteHandler();
				},
				saveHandler : function() {
					this.defaultSaveHandler();
							
				},			
				loadMask : true, // 加载时是否显示进度
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : applicantDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(Columns),
				plantInt : plantInt,
				servletUrl : MAIN_SERVLET,
				bean : applicantBeanName,
				business : "baseMgm",
				primaryKey : "uids",
				listeners : {
				}
			});
    applicantGrid2 = new Ext.grid.EditorGridTbarPanel({
		region : 'south',
		ds : applicantDs2, // 数据源
		cm : cm2, // 列模型
		sm : sm2,
		height : 300,
		addBtn : false, // 是否显示新增按钮
		tbar : new Ext.Toolbar({
					items : [gridLabel2, '-', borrowBtn, "-", ghBtn, "-"]
				}),
		iconCls : 'icon-by-category', // 面板样式
		border : false, // 
		clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
		header : false, //
		autoScroll : true, // 自动出现滚动条
		deleteHandler : function() {
			this.defaultDeleteHandler();
		},
		saveHandler : function() {
			var records = applicantDs2.getModifiedRecords();
			if (records.length > 0) {
				var errMsm = "";
				for (var i = 0; i < records.length; i++) {
					var thisJcnum = records[i].data.jcnum;
					var otherSumNum = 0;
					var stockNum = 0;
                    var ghNum = 0;
					DWREngine.setAsync(false);
                    //其他单据借用数量
					db2Json.selectData(
							"select uids,jcnum from EQU_SPECIAL_TOOLS_DETAIL where uids!='"
									+ records[i].data.uids + "' and stockid='"
									+ records[i].data.stockid + "'", function(
									jsonData) {
								var list = eval(jsonData);
								if (list != null) {
									for (var i = 0; i < list.length; i++) {
										otherSumNum += parseInt(list[i].jcnum,10);
									}
								}
							});
                    //库存数量
					db2Json.selectData(
							"select uids,stock_num from equ_goods_stock where uids='"
									+ records[i].data.stockid + "'", function(
									jsonData) {
								var list = eval(jsonData);
								if (list != null) {
									for (var i = 0; i < list.length; i++) {
										stockNum += parseInt(list[i].stock_num,10);
									}
								}
							});
                    //已归还数量
                    DWREngine.setAsync(false);
	                var sql = "SELECT nvl(d.jcnum,0) jcnum ,(SELECT nvl(sum(g.ghnum),0) FROM " +
	                        " equ_special_tools_detail_gh g WHERE g.detailuids = d.uids) ghnum " +
	                        " FROM equ_special_tools_detail d WHERE d.stockid = '"+records[i].data.stockid+"' "
	                db2Json.selectData(sql, function(jsonData) {
	                    var list = eval(jsonData);
	                    if (list != null) {
	                        for (var i = 0; i < list.length; i++) {
	                            ghNum +=  parseInt(list[i].ghnum,10);
	                        }
	                    }
	                });
	                DWREngine.setAsync(true);
					if (parseInt(otherSumNum, 10) + parseInt(thisJcnum, 10) - parseInt(ghNum,10) > parseInt(
							stockNum, 10)) {
						errMsm = "库存不足，请修改借出数量！"
						break;
					}
				}
				if (errMsm != "") {
					Ext.example.msg('不能选择！', errMsm);
					return;
				} else {
					this.defaultSaveHandler();
				}
				if (isFlwTask == true) {
					Ext.Msg.show({
								title : '您成功维护了专用工具借用信息！',
								msg : '您是否进行发送流程到下一步操作！<br><br>是：[完成流程任务] 否：[继续维护数据]',
								buttons : Ext.Msg.YESNO,
								icon : Ext.MessageBox.INFO,
								fn : function(value) {
									if ('yes' == value) {
										parent.IS_FINISHED_TASK = true;
										parent.mainTabPanel
												.setActiveTab('common');
									}
								}
							});
				}
			} else {
				Ext.Msg.show({
							title : '提示',
							msg : '无数据的修改！',
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.INFO
						});
			}
		},
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : applicantDs2,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : Ext.data.Record.create(Columns2),
		plantInt : plantInt2,
		servletUrl : MAIN_SERVLET,
		bean : applicantBeanName2,
		business : "baseMgm",
		primaryKey : "uids",
		listeners : {}
	});	
		if(bh){
			applicantDs.baseParams.params="bh='"+bh+"'";
		}	
		applicantDs.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});	

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [applicantGrid,applicantGrid2],
		listeners: {
			afterlayout: function(){
                  applicantGrid.getTopToolbar().disable();
                  applicantGrid2.getTopToolbar().disable();
//				if (isFlwView == true){
//					applicantGrid.getTopToolbar().disable();
//					applicantGrid2.getTopToolbar().disable();
//					borrowBtn.setDisabled(true);
//			    }
//			    if(isFlwTask || isFlwView){
//			    	borrowBtn.setDisabled(true);
//					with(applicantGrid.getTopToolbar().items){
//				    	get('add').disable();
//				    	get('del').disable();
//				    }
//				}
			}
		}
	});
	applicantGrid.on("afterinsert",function(){
		var rec = sm.getSelected();
		if(bh_){
			rec.set("bh",bh_);
		} else{
			incrementLsh = parseInt(incrementLsh,10) +1;
			incrementLsh="000"+incrementLsh;
			rec.set("bh",incrementLsh);
		}
		bh_ = null;
	})	
	if(isFlwTask){
		DWREngine.setAsync(false);
		baseMgm.getData("select uids,bh from EQU_SPECIAL_TOOLS where bh='"+bh_+"' ",function(list){
			if(list.length==0){
				applicantGrid.defaultInsertHandler();
    			applicantGrid.defaultSaveHandler();
			}
		})
		DWREngine.setAsync(true);
	} 			
	//applicantGrid.getSelectionModel().selectFirstRow();//选择第一行  
	applicantDs.addListener('load',function(){
	   var records=[];//存放选中记录
	    var record = applicantDs.getAt(0);
	    records.push(record);
	   sm.selectRecords(records);//执行选中记录
	  });
			
	borrowBtn.setDisabled(true);
	ghBtn.setDisabled(true);
		applicantGrid.getTopToolbar().items.get('add').setText("新增借用");
	sm.on('rowselect', function(sm, idx, r) {
		plantInt2.masteruids=r.get("uids");
		masteruids=r.get("uids");
		bh_=r.get("bh");
		var billstate=r.get("state");
		applicantDs2.baseParams.params="masteruids='"+r.get("uids")+"'";
		applicantDs2.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});			    
	    borrowBtn.setDisabled(false);
		var respondDept=r.get("dept");
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
        if (isFlwTask) {
			if (billstate == '0') {
				with (applicantGrid.getTopToolbar().items) {
					get('add').disable();
					get('save').enable();
					get('del').disable();
				}
				with (applicantGrid2.getTopToolbar().items) {
					get('add').enable();
					get('save').enable();
					get('del').enable();
				}
				borrowBtn.enable();
				ghBtn.disable();
			} else if (billstate == '-1') {
				with (applicantGrid.getTopToolbar().items) {
					get('add').disable();
					get('save').enable();
					get('del').disable();
				}
				with (applicantGrid2.getTopToolbar().items) {
					get('add').enable();
					get('save').enable();
					get('del').enable();
				}
				borrowBtn.enable();
				ghBtn.disable();
			} else if (billstate == '1') {
				with (applicantGrid.getTopToolbar().items) {
					get('add').disable();
					get('save').disable();
					get('del').disable();
				}
				with (applicantGrid2.getTopToolbar().items) {
					get('add').disable();
					get('save').disable();
					get('del').disable();
				}
				borrowBtn.disable();
				ghBtn.enable();
			}
		}else{
            with (applicantGrid.getTopToolbar().items) {
                get('add').disable();
                get('save').disable();
                get('del').disable();
            }
            with (applicantGrid2.getTopToolbar().items) {
                get('add').disable();
                get('save').disable();
                get('del').disable();
            }
            borrowBtn.disable();
            ghBtn.setDisabled(billstate == '1' ? false : true);
        }
        
        if(isFlwView){
			with (applicantGrid.getTopToolbar().items) {
				get('add').disable();
				get('save').disable();
				get('del').disable();
			}
			with (applicantGrid2.getTopToolbar().items) {
				get('add').disable();
				get('save').disable();
				get('del').disable();
			}
			borrowBtn.disable();
			ghBtn.setDisabled(billstate == '1' ? false : true);
		}
	});
	sm.on('rowdeselect', function(sm, idx, r) {
		plantInt2.masteruids='';
		applicantDs2.baseParams.params="1=1";
		applicantDs2.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});			
	  	borrowBtn.setDisabled(true);
		  	
		masteruids=null;
		if(applicantGrid.getTopToolbar().items.get('del'))
			applicantGrid.getTopToolbar().items.get('del').disable();				
	});
	sm2.on('rowselect', function(sm2, idx, r) {
        var record = sm.getSelected();
        if(record == null) return;
        var bill = record.get("state");
        
	    detailuids=r.get("uids");
	    jcnum=r.get("jcnum");
	    stockid=r.get("stockid");
        var ghnum = r.get("ghnum");
        if(bill == "1" && jcnum > ghnum){
            ghBtn.setDisabled(false);
        }else{
            ghBtn.setDisabled(true);
        }
        
        if(isFlwView){
            ghBtn.setDisabled(true);
        }
//	    ghBtn.setDisabled(false);
//	    if(isFlwTask || isFlwView){
//	    	ghBtn.setDisabled(true);
//		}		    			
	});
//	sm2.on('rowdeselect', function(sm, idx, r) {
//	  	ghBtn.setDisabled(true);
//		detailuids=null;
//		jcnum=null;
//		stockid=null;
//		if(applicantGrid2.getTopToolbar().items.get('del'))
//			applicantGrid2.getTopToolbar().items.get('del').disable();				
//	});	
		sm4 = new Ext.grid.CheckboxSelectionModel({
			singleSelect : false,
			header : ''
		});	
		cm4 = new Ext.grid.ColumnModel({
				columns : [sm4
				  ,{
					id : 'uids',
					header : 'uids',
					dataIndex : 'uids',
					width : 100,
					hidden : true
					},{
					id : 'detailuids',
					header : 'detailuids',
					dataIndex : 'detailuids',
					width : 100,
					hidden : true
					},
				   {
					id : 'deptuser',
					header : '归还人',
					type:'string',
					dataIndex : 'deptuser',
					width : 400,
					editor : new Ext.form.TextField({
								name : 'deptuser',
								allowBlank : true
							}),
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
	                var qtip = "qtip=" + data;
	                return '<span ' + qtip + '>' + data + '</span>';
	                    return data;
			                }									
					},
				   {
					id : 'ghnum',
					header : '归还数量',
					dataIndex : 'ghnum',
					width : 400,
					editor : new Ext.form.TextField({
								name : 'ghnum',
								allowBlank : true
							}),
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
	                var qtip = "qtip=" + data;
	                return '<span ' + qtip + '>' + data + '</span>';
	                    return data;
			                }									
					}
					, {
					id : 'ghtime',
					type:'date',
					header : '归还时间',
					dataIndex : 'ghtime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
					align : 'center',
					width:250,
					type : 'date',
					editor : new Ext.form.DateField({
								name : 'ghtime',
								readOnly:true,
								format : 'Y-m-d'
							})
					},
				   {
					id : 'memo',
					header : '备注',
					dataIndex : 'memo',
					width : 400,
					editor : new Ext.form.TextField({
								name : 'memo',
								allowBlank : true
							}),
	                renderer :  function(data, metadata, record, rowIndex,
	                        columnIndex, store) {
	                var qtip = "qtip=" + data;
	                return '<span ' + qtip + '>' + data + '</span>';
	                    return data;
			                }									
					}]

			});	
			
	Columns4 = [
			{
				name : 'uids',
				type : 'string'
			},		
			{
				name : 'detailuids',
				type : 'string'
			},		
			{
				name : 'deptuser',
				type : 'string'
			},		
			{
				name : 'ghnum',
				type : 'float'
			},
			{
			name : 'ghtime',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
			},		
			{
				name : 'memo',
				type : 'string'
			}		
			]	
	applicantDs4 = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : applicantBeanName4,
			business : "baseMgm",
			method : "findWhereOrderby",
			orderby:"ghtime desc"
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : "uids"
				}, Columns4),
		remoteSort : true,
		pruneModifiedRecords : true,
		sortInfo: {field: 'ghtime', direction: 'DESC'}
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});					
	plantInt4 = {
		uids : '',
		detailuids:'',
		deptuser:'',
		ghnum:0,
		memo : '',
		ghtime : new Date()
	};	
	plantInt4.detailuids=detailuids;
    gridLabel4=
    '<font color=#15428b><B>归还记录<B></font>';	
    
    var queryBtn = new Ext.Button({
        id : 'query',
        text : '查询',
        tooltip : '查询',
        iconCls : 'option',
        handler : showWindow_
    });
    
	applicantGrid4 = new Ext.grid.EditorGridTbarPanel({
        region : 'center',
        ds : applicantDs4, // 数据源
        cm : cm4, // 列模型
        sm : sm4,
        tbar : [gridLabel4, '-'],
        iconCls : 'icon-by-category', // 面板样式
        border : false, // 
        clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
        header : false, //
        autoScroll : true, // 自动出现滚动条
        crudText : {add:'新增归还'},
        deleteHandler : function() {
            this.defaultDeleteHandler();
        },
        saveHandler : function() {
            var records = applicantDs4.getModifiedRecords();
            var uidsArr = "";
            var jcnum = sm2.getSelected().get("jcnum");
            var editNum = 0;
            for (var i = 0; i < records.length; i++) {
                if(records[i].data.uids!="")
                   uidsArr += ",'" + records[i].data.uids + "'";
                editNum += parseInt(records[i].data.ghnum, 0);
            }
            uidsArr = uidsArr.substring(1);
            DWREngine.setAsync(false);
            var sql = "select nvl(sum(ghnum),0) from EQU_SPECIAL_TOOLS_DETAIL_GH where detailuids='"
                    + detailuids + "'"
            if (uidsArr != "") {
                sql = sql + " and uids not in (" + uidsArr + ")";
            }
            baseDao.getData(sql, function(num) {
                    editNum += parseInt(num, 10);
                });
            DWREngine.setAsync(true);
            if (editNum > jcnum) {
                Ext.example.msg("提示", "借出数量为 "+jcnum+"，归还总数量不能大于借出数量！");
                return;
            } else {
                this.defaultSaveHandler();
            }
        },
        loadMask : true, // 加载时是否显示进度
        viewConfig : {
            forceFit : true,
            ignoreAdd : true
        },
        bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
            pageSize : PAGE_SIZE,
            store : applicantDs4,
            displayInfo : true,
            displayMsg : ' {0} - {1} / {2}',
            emptyMsg : "无记录。"
        }),
        plant : Ext.data.Record.create(Columns4),
        plantInt : plantInt4,
        servletUrl : MAIN_SERVLET,
        bean : applicantBeanName4,
        business : "baseMgm",
        primaryKey : "uids",
        listeners : {}
    });
    
    function showWindow_() {
        showWindow(applicantGrid4)
    };
});

function respondUserRendererFun(v, m, r){
	var respondDeptUser=r.get("deptuser");
	if(respondDeptUser&&respondDeptUser!=""){
		for(i = 0; i < allUserArray.length; i++) {
			if(allUserArray[i][0]==v) {
				return allUserArray[i][1];
			}
		}
	}
	return "";
}
function respondDeptRendererFun(v, m, r){
	var respondDept=r.get("dept");
	if(respondDept&&respondDept!=""){
		for(i = 0; i < array_prjs.length; i++) {
			if(array_prjs[i][0]==v) {
				return array_prjs[i][1];
			}
		}
	}
	return "";
}
function borrowFun(){
	if (masteruids == null || masteruids == "") {
		Ext.Msg.show({
					title : '提示',
					msg : '请先选择上面的专用工具借用！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
				});
		return;
	}else{
		var url=CONTEXT_PATH+"/Business/equipment/equMgm/equ.special.tools.selectWin.jsp?masteruids="+masteruids+"&bh="+bh_;
		selectWin = new Ext.Window({
			title:'选择物资',
			buttonAlign:'center',
			//layout:'border',
			width: document.body.clientWidth,
		    height: document.body.clientHeight,
		    modal: true,
		    closeAction: 'hide',
		    constrain:true,
		    maximizable: true,
		    plain: true,
			html : "<iframe name='fileFrame' src='"
					+ url
					+ "' frameborder=0 style='width:100%;height:100%;'></iframe>",
			listeners: {
				hide: function(){
					applicantDs2.reload();
				}
			}

		});
  		selectWin.show();
	}
}

function guihFun() {
	if (detailuids) {
		plantInt4.detailuids = detailuids;
		
		applicantDs4.baseParams.params = "detailuids='" + detailuids + "'";
		applicantDs4.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
		if (!ghWin) {
			ghWin = new Ext.Window({
						title : '归还记录',
						width : 600,
						height : 400,
						minWidth : 300,
						minHeight : 200,
						layout : 'fit',
						plain : true,
						closeAction : 'hide',
						modal : true,
						items : [applicantGrid4]
					});
		}

		ghWin.show();
		ghWin.on("hide", function() {
					applicantDs2.baseParams.params = "masteruids='"
							+ masteruids + "'";
					applicantDs2.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
				});
                
			var count = 0;
			DWREngine.setAsync(false);
			db2Json.selectData(
					"select uids,ghnum from EQU_SPECIAL_TOOLS_DETAIL_GH where detailuids='"
							+ detailuids + "'", function(jsonData) {
						var list = eval(jsonData);
						if (list != null) {
							for (var i = 0; i < list.length; i++) {
								count = count + parseInt(list[i].ghnum,10);
							}
	
						}
					});
			DWREngine.setAsync(true);
			count = parseInt(count, 10);
			if (count >= jcnum) {
				applicantGrid4.getTopToolbar().items.get('add').disable();
				applicantGrid4.getTopToolbar().items.get('del').disable();
				applicantGrid4.getTopToolbar().items.get('save').disable();
			} else {
				applicantGrid4.getTopToolbar().items.get('add').enable();
				applicantGrid4.getTopToolbar().items.get('del').enable();
				applicantGrid4.getTopToolbar().items.get('save').enable();
			}
	} else {
		Ext.example.msg("提示", "请选择需要归还的设备！");
	}
}

