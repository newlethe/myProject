var treeBean = 'com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypStatisticsTree';
var bean = "com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypRecord";
var beanTree = 'com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypTree';
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "uuid";

var formWindow;
var ds;
var gridPanel;
var store;

var getLevelArr = new Array();
var fileArr = new Array();
var billstateArr = new Array();
var unitArr = new Array();
var gcTypes = new Array();


var whereSql = '';
var businessType = 'zlMaterail';
var count=0;

var selectedPath = "";
var unitComValue = "";
var billstateComValue = "";
var getStartTime = "";
var getEndTime = "";

var unitArr = new Array();
Ext.onReady(function(){
    Ext.QuickTips.init();
    
   DWREngine.setAsync(false);
	appMgm.getCodeValue('质量验评工程类型',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			gcTypes.push(temp);			
		}
    });
    appMgm.getCodeValue('质量验评施工单位',function(list){         //获取施工单位
    	if(list!=null&&list.length>0){
	    	var temp1 = new Array();		
			temp1.push('01');	
			temp1.push('所有单位');
			unitArr.push(temp1);	
			for(i = 0; i < list.length; i++) {
				var temp = new Array();		
				temp.push(list[i].propertyCode);	
				temp.push(list[i].propertyName);
				unitArr.push(temp);			
			}
    	}else{
    		unitArr = [['01','所有单位'],['007','山西电建一公司'],['005','山西电建三公司'],['008','山西四建集团']];
    	}
    });
	DWREngine.setAsync(true);
    
    columns = [
           {
				id : 'uuid',
				header : "质量验评分类主键",
				width : 110,
				sortable : true,
				dataIndex : 'uuid',
				hidden : true, 
				locked : true
			},  {
				id : 'engineerNo',
				header : "工程编号",
				width : 260,
				sortable : true,
				renderer :function(value) {
					var qtip = "qtip=" + value;
					return'<span ' + qtip + '>' + value + '</span>';
				},
				dataIndex : 'engineerNo'
			}, {
				id : 'engineerName',
				header : "工程名称",
				width : 180,
				sortable : true,
				renderer :function(value) {
					var qtip = "qtip=" + value;
					return'<span ' + qtip + '>' + value + '</span>';
				},
				dataIndex : 'engineerName'
			}, {
				id : 'engineerType',
				header : "工程类别",
				width : 80,
				sortable : true,
				align : 'center',
				renderer :function(value) {
                         for(var i = 0; i < gcTypes.length; i ++){
                            if(value == gcTypes[i][0]){
                              return gcTypes[i][1]
                            }
                         }
				},
				dataIndex : 'engineerType'
			}, {
				id : 'typeXm',
				header : "项目",
				width : 110,
				sortable : true,
				align : 'center',
				hidden : true,
				dataIndex : 'typeXm',
				renderer : function(v, p, r) {
					if(v != '0'){
						var getUuid = r.get('uuid');
						var getType = '01';
						var getpid = r.get('pid');
						return "<a href='javascript:void(0)'  style='color:blue;' onclick='showRecordList" +
								"(\""+getUuid+"\",\""+getType+"\",\""+getpid+"\")'>"+v+"</a>";
					}else{
					   return v;
					}
                }
			}, {
				id : 'typeZy',
				header : "专业",
				width : 110,
				sortable : true,
				hidden : true,
				align : 'center',
				dataIndex : 'typeZy',
				renderer : function(v, p, r) {
					if(v != '0'){
						var getUuid = r.get('uuid');
						var getType = '02';
						var getpid = r.get('pid');
						return "<a href='javascript:void(0)'  style='color:blue;' onclick='showRecordList" +
								"(\""+getUuid+"\",\""+getType+"\",\""+getpid+"\")'>"+v+"</a>";
					}else{
					   return v;
					}

                }
			}, {
				id : 'typeXt',
				header : "系统验收数",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'typeXt',
				renderer : function(v, p, r) {
					if(v != '0'){
						var getUuid = r.get('uuid');
						var getType = '03';
						var getpid = r.get('pid');
						return "<a href='javascript:void(0)'  style='color:blue;' onclick='showRecordList" +
								"(\""+getUuid+"\",\""+getType+"\",\""+getpid+"\")'>"+v+"</a>";
					}else{
					   return v;
					}

                }
			}, {
				id : 'typeDw',
				header : "单位工程验收数",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'typeDw',
				renderer : function(v, p, r) {
					if(v != '0'){
						var getUuid = r.get('uuid');
						var getType = '04';
						var getpid = r.get('pid');
						return "<a href='javascript:void(0)'  style='color:blue;' onclick='showRecordList" +
								"(\""+getUuid+"\",\""+getType+"\",\""+getpid+"\")'>"+v+"</a>";
					}else{
					   return v;
					}

                }
			}, {
				id : 'typeZdw',
				header : "子单位工程验收数",
				width : 120,
				sortable : true,
				align : 'center',
				dataIndex : 'typeZdw',
				renderer : function(v, p, r) {
					if(v != '0'){
						var getUuid = r.get('uuid');
						var getType = '05';
						var getpid = r.get('pid');
						return "<a href='javascript:void(0)'  style='color:blue;' onclick='showRecordList" +
								"(\""+getUuid+"\",\""+getType+"\",\""+getpid+"\")'>"+v+"</a>";
					}else{
					   return v;
					}

                }
			}, {
				id : 'typeFb',
				header : "分部工程验收数",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'typeFb',
				renderer : function(v, p, r) {
					if(v != '0'){
						var getUuid = r.get('uuid');
						var getType = '06';
						var getpid = r.get('pid');
						return "<a href='javascript:void(0)'  style='color:blue;' onclick='showRecordList" +
								"(\""+getUuid+"\",\""+getType+"\",\""+getpid+"\")'>"+v+"</a>";
					}else{
					   return v;
					}

                }
			}, {
				id : 'typeZfb',
				header : "子分部工程验收数",
				width : 120,
				sortable : true,
				align : 'center',
				dataIndex : 'typeZfb',
				renderer : function(v, p, r) {
					if(v != '0'){
						var getUuid = r.get('uuid');
						var getType = '07';
						var getpid = r.get('pid');
						return "<a href='javascript:void(0)'  style='color:blue;' onclick='showRecordList" +
								"(\""+getUuid+"\",\""+getType+"\",\""+getpid+"\")'>"+v+"</a>";
					}else{
					   return v;
					}

                }
			}, {
				id : 'typeFx',
				header : "分项工程验收数",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'typeFx',
				renderer : function(v, p, r) {
					if(v != '0'){
						var getUuid = r.get('uuid');
						var getType = '08';
						var getpid = r.get('pid');
						return "<a href='javascript:void(0)'  style='color:blue;' onclick='showRecordList" +
								"(\""+getUuid+"\",\""+getType+"\",\""+getpid+"\")'>"+v+"</a>";
					}else{
					   return v;
					}

                }
			}, {
				id : 'typeJy',
				header : "检验批数",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'typeJy',
				renderer : function(v, p, r) {
					if(v != '0'){
						var getUuid = r.get('uuid');
						var getType = '09';
						var getpid = r.get('pid');
						return "<a href='javascript:void(0)'  style='color:blue;' onclick='showRecordList" +
								"(\""+getUuid+"\",\""+getType+"\",\""+getpid+"\")'>"+v+"</a>";
					}else{
					   return v;
					}

                }
			}, {
				id : 'typeJb',
				header : "隐蔽验收验收数",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'typeJb',
				renderer : function(v, p, r) {
					if(v != '0'){
						var getUuid = r.get('uuid');
						var getType = '10';
						var getpid = r.get('pid');
						return "<a href='javascript:void(0)'  style='color:blue;' onclick='showRecordList" +
								"(\""+getUuid+"\",\""+getType+"\",\""+getpid+"\")'>"+v+"</a>";
					}else{
					   return v;
					}

                }
			},
//			{
//				id : 'unit',
//				header : "创建单位",
//				width : 110,
//				sortable : true,
//				align : 'center',
//				dataIndex : 'unit',
//				hidden : true, 
//				locked : true
//			},  {
//				id : 'billstategl',
//				header : "状态/审批",
//				width : 110,
//				sortable : true,
//				align : 'center',
//				dataIndex : 'billstategl',
//				hidden : true, 
//				locked : true
//			}, {
//				id : 'checkDate',
//				header : "验收日期",
//				width : 110,
//				sortable : true,
//				align : 'center',
//				dataIndex : 'checkDate',
//				hidden : true, 
//				locked : true
//			},				
			{
				id : 'pid',
				header : "PID",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'pid',
				hidden : true, 
				locked : true
			}, {
				id : 'parentID',
				header : "父节点",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'parentNo',
				hidden : true, 
				locked : true
			}, {
				id : 'isleaf',
				header : "子节点",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'isleaf',
				hidden : true, 
				locked : true
			}, {
				id : 'treeId',
				header : "树节点ID",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'treeId',
				hidden : true, 
				locked : true
			}, {
				id : 'parentId',
				header : "父节点ID",
				width : 110,
				sortable : true,
				align : 'center',
				dataIndex : 'parentId',
				hidden : true, 
				locked : true
			}
    ];
    var startTime = new Ext.form.DateField({
		    id : 'startTime',
			name: 'startTime',
			format : 'Y-m-d',
			minValue : '2000-01-01',
			emptyText : '开始时间',
			anchor:'95%',
			listeners:{
			    change:function(record,newValue,oldValue){
			     getStartTime = newValue.dateFormat('Ymd');
			}}
         })
    var endTime = new Ext.form.DateField({
		    id : 'endTime',
			name: 'endTime',
			format : 'Y-m-d',
			minValue : '2000-01-01',
			emptyText : '结束时间',
			anchor:'95%',
			listeners:{
			    change:function(record,newValue,oldValue){
			     getEndTime = newValue.dateFormat('Ymd');
			}}
         })
    btnexpendAll = new Ext.Button({
	    	text : '展开',
	        iconCls : 'icon-expand-all',
	        tooltip : '全部展开',
	        handler : function() {
	           store.expandAllNode();
	        }
        }) ;
    btnexpendClose = new Ext.Button({
	        text : '折叠',
	        iconCls : 'icon-collapse-all',
	        tooltip : '全部收起',
	        handler : function() {
	            store.collapseAllNode();
	        }
	    }) ;

    var queryBtn = new Ext.Button({
    	id : 'queryBtn',
        text : '查询',
        iconCls : 'btn',
		handler : function(){
		      queryFn();
		}
    })
    var excelBtn = new Ext.Button({
		id : 'export',
		text : '导出数据',
		tooltip : '导出数据到Excel',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			exportDataFile();
		}
	})
	
	var billstateArr = [['5','所有状态'],['0','未上报'],['1','已上报'],['2','审批完成'],['3','退回重报'],['4','退回重审']];
	var billstateDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:billstateArr
 	})  
	var unitDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:unitArr
 	})

	var unitCom =  new Ext.form.ComboBox({
    		name:'unitCom',
			readOnly : true,
			width:160,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			emptyText : '请选择单位...',
			value : '所有单位',
			mode: 'local',
			store:unitDs,
			listeners:{select:function(combo,record,index){
				unitComValue = combo.getValue();
				if(unitComValue.length>10){
				    unitComValue = "";
				}
				store.load();
			}}
    });
    var billstateCom =  new Ext.form.ComboBox({
    		name:'billstateCom',
			readOnly : true,
			width:100,
			emptyText : '请选择状态...',
			value : '所有状态',
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			store:billstateDs,
			listeners:{select:function(combo,record,index){
				 billstateComValue = combo.getValue();
				 if(billstateComValue.length>3){
				   billstateComValue = "";
				 }
				 store.load();
			}}
    });         
    store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parentId',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'pcZlgkZlypStatisticsTree',// 后台java代码的业务逻辑方法定义
					business : 'zlgkImpl',// spring 管理的bean定义
					bean : treeBean,// gridtree展示的bean
					params : 'pid' + SPLITB +  PID +SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'treeId',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ['uuid','engineerNo','engineerName','engineerType',
							          'typeXm','typeZy','typeXt','typeDw','typeZdw','typeFb',
							          'typeZfb','typeFx','typeJy','typeJb','pid','parentNo','isleaf','treeId','parentId']
						}),
				listeners : {
					'beforeload' : function(ds, options) {
						var parent = null;
						if (options.params[ds.paramNames.active_node] == null) {
							options.params[ds.paramNames.active_node] = '0';
							parent = "0"; // 此处设置第一次加载时的parent参数
						} else {
							parent = options.params[ds.paramNames.active_node];
						}
						if(startTime.getValue() != ''){
						      getStartTime = startTime.getValue().dateFormat('Ymd');
						}
						if(endTime.getValue() != ""){
						      getEndTime = endTime.getValue().dateFormat('Ymd');
						}
						if(unitCom.getValue() != "所有单位" ){
						  unitComValue = unitCom.getValue();
						}
						if(unitCom.getValue() == '01'){
						      unitComValue = "";
						}
						if(billstateCom.getValue() != '所有状态'){
						   billstateComValue =  billstateCom.getValue();
						}
						if(billstateCom.getValue() == '5'){
						   billstateComValue = "";
						}
						ds.baseParams.params = 'pid' + SPLITB + PID
								+ ";parent" + SPLITB + parent+';getStartTime'+SPLITB+getStartTime
								+';getEndTime'+SPLITB+getEndTime+';unitComValue'+SPLITB+unitComValue
								+';billstateComValue'+SPLITB+billstateComValue;// 此处设置除第一次加载外的加载参数设置
					} 
				}
			});  
  
	var tbarArr = ['<font color=#15428b><B>质量验评统计<B></font>','-',btnexpendClose,//'-',btnexpendAll,
	 '-','检索时间：',startTime,'-',endTime,'-',queryBtn,'->',unitCom,'-',billstateCom,'-',excelBtn];
    treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				id : 'budget-tree-panel',
				iconCls : 'icon-by-category',
				store : store,
				master_column_id : 'engineerNo',// 定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'center',
				tbar : tbarArr,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				frame : false,
				collapsible : false,
				animCollapse : false,
				border : true,
				columns : columns,
				stripeRows : true
			});   
    var viewport = new Ext.Viewport({
					layout : 'border',
					iconCls : 'icon-show-all',
					items : [treeGrid]
				});			
	store.on("load", function(ds1, recs) {
		if(selectedPath && selectedPath!="") {
			store.expandPath(selectedPath, "treeId");
		} else {
			if (ds1.getCount() > 0) {
				var rec1 = ds1.getAt(0);
				if (!ds1.isExpandedNode(rec1)) {
					var ChildrenRec = this.getNodeChildren(rec1);
					ds1.expandNode(rec1);
					if(ChildrenRec!= null){
						var len = ChildrenRec.length;
					   if(len>0){
				        	this.expandNode(ChildrenRec[0]);
				        }
					}
				}
			}
		}
	});
	
	
	store.on('expandnode', function(ds, rc) {
			if (selectedPath && selectedPath != "") {
				var equidArr = selectedPath.split("/");
				if (rc.get("engineerNo") == equidArr.pop()) {
					treeGrid.getSelectionModel().selectRow(ds.indexOf(rc));
				}
			}
	});	
//**********************记录表统计***************************

//************************获取相关的数据Start******************
    DWREngine.setAsync(false);
	appMgm.getCodeValue('验收等级',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			getLevelArr.push(temp);			
		}
    });
    //审批状态
    appMgm.getCodeValue('审批状态',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			billstateArr.push(temp);			
		}
    });
    var querySql = "select fileid,filename from APP_FILEINFO where fileid in (" +
    		"  select filelsh from pc_zlgk_zlyp_record) order by filedate desc"
    baseMgm.getData(querySql,function(list){
       		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i][0]);	
			temp.push(list[i][1]);
			fileArr.push(temp);			
		}
    })
    //施工单位
    baseMgm.getData("select t.unitid,t.unitname from sgcc_ini_unit t",function(list){
       		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i][0]);	
			temp.push(list[i][1]);
			unitArr.push(temp);			
		}
    })
	DWREngine.setAsync(true);
	
	var fileDs =  new Ext.data.SimpleStore({
		 fields : ['k', 'v'],
		 data : fileArr
	})
	
	var getLevelDs = new Ext.data.SimpleStore({
		 fields : ['k', 'v'],
		 data : getLevelArr
	})
	
	var unitDs = new Ext.data.SimpleStore({
		 fields : ['k', 'v'],
		 data : unitArr
	})
//************************获取相关的数据END********************	
	
//**************************页面信息Start********************
	var fm = Ext.form;			// 包名简写（缩写）
	var fc = {
		   'uuid' :{
				name: 'uuid',
				fieldLabel: '主键',
				hidden:true,
				hideLabel:true,
				anchor:'95%'
	         },
	        'treeUuid' : {
				name: 'treeUuid',
				fieldLabel: '质量验评分类树主键',
				anchor:'95%'
	         },
	       'fileNo' : {
				name: 'fileNo',
				fieldLabel: '文件编号',
				allowBlank : false,
				anchor:'95%'
	         },
	       'fileName' : {
				name: 'fileName',
				fieldLabel: '文件名称',
				allowBlank : false,
				anchor:'95%'
	         },
	       'filelsh' : {
				name: 'filelsh',
				fieldLabel: '上传文件',
				readOnly : true,
				anchor:'95%',
				valueField:'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	            disabled : true,
	            readOnly : true,
	            triggerAction: 'all',
	            store: fileDs,
	            lazyRender:true,
	            listClass: 'x-combo-list-small',
				anchor:'95%'
	         },
	       'checkLevel' : {
				name: 'checkLevel',
				fieldLabel: '验收等级',
				valueField:'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	            readOnly : true,
	            triggerAction: 'all',
	            store: getLevelDs,
	            lazyRender:true,
	            listClass: 'x-combo-list-small',
				anchor:'95%'
	         },
	       'checkResult' : {
				name: 'checkResult',
				fieldLabel: '验收结果',
				anchor:'95%'
	         },
	       'checkDate' : {
				name: 'checkDate',
				fieldLabel: '验收日期',
				format : 'Y-m-d',
				minValue : '2010-01-01',
				anchor:'95%'
	         },
	       'billstategl' : {//状态/审批(管理)
				name: 'billstategl',
				fieldLabel: '状态/审批',
				anchor:'95%'
	         },
	        'billstatesp' : {//状态/审批(审批)
				name: 'billstatesp',
				fieldLabel: '状态/审批',
				anchor:'95%'
	         },
	        'billstatecx' : {//状态/审批(查询)
				name: 'billstatecx',
				fieldLabel: '状态/审批',
				anchor:'95%'
	         },
	       'unit' : {
				name: 'unit',
				fieldLabel: '施工单位',
				valueField:'k',
				displayField: 'v',
				mode: 'local',
	            typeAhead: true,
	            readOnly : true,
	            triggerAction: 'all',
	            store: unitDs,
	            lazyRender:true,
	            listClass: 'x-combo-list-small',
				anchor:'95%'
	         },
	       'createMan' : {
				name: 'createMan',
				fieldLabel: '上报人',
				anchor:'95%'
	         },
	       'createManId' : {
				name: 'createManId',
				fieldLabel: '上报人ID',
				hidden:true,
				hideLabel:true,
				anchor:'95%'
	         },
	       'approvalMan' : {
				name: 'approvalMan',
				fieldLabel: '审批人',
				hidden:true,
				hideLabel:true,
				anchor:'95%'	       
	       }, 
	       'backMan' : {
				name: 'backMan',
				fieldLabel: '撤销审批人员',
				hidden:true,
				hideLabel:true,
				anchor:'95%'	       
	       },
	       'pid' : {
				name: 'pid',
				fieldLabel: 'PID',
				anchor:'95%'
	         },
	       'memo' : {
				name: 'memo',
				fieldLabel: '备注',
				height: 50,
				width: 700,
				xtype: 'textarea',
				anchor:'95%'
	         }
	};
	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cm =new Ext.grid.ColumnModel([
	       new Ext.grid.RowNumberer(),
//	       sm,
	       {
				id : 'uuid',
				header : fc['uuid'].fieldLabel,
				dataIndex : fc['uuid'].name,
				hidden : true,
				width : 100
			},  {
				id : 'treeUuid',
				header : fc['treeUuid'].fieldLabel,
				dataIndex : fc['treeUuid'].name,
				hidden : true,
				width : 100
			},  {
				id : 'fileNo',
				header : fc['fileNo'].fieldLabel,
				dataIndex : fc['fileNo'].name,
				align : 'center',
				type : 'string',
				width : 100
			}, {
				id : 'fileName',
				header : fc['fileName'].fieldLabel,
				dataIndex : fc['fileName'].name,
				align : 'center',
				type : 'string',
				renderer : function(value, metaData, record, rowIndex,
								colIndex, store) {
						if(record.data.filelsh == null || record.data.filelsh == ''){
						   var qtip = "qtip=文件没有上传，不能下载！";
						   return '<span ' + qtip + ' style='+'"color:blue;"'+'>' +value+ '</span>';
						}			
						var url = "servlet/MainServlet?ac=downloadfile&fileid="
						        + record.data.filelsh;
						return "<center><a href='" + url + "'><span style='color:blue; '>" +value+"</span></a></center>"
				},
				width : 200
			}, {
				id : 'filelsh',
				header : fc['filelsh'].fieldLabel,
				dataIndex : fc['filelsh'].name,
				align : 'center',
				width : 110,
				renderer : function(value, metaData, record, rowIndex,
								colIndex, store){
						var downloadStr="";
						var infoid = record.get('uuid');
						var billstate = record.get('billstategl');
						var count=0;
						DWREngine.setAsync(false);
				        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+infoid+
				                           "' and transaction_type='"+businessType+"'", function (jsonData) {
					    var list = eval(jsonData);
					    if(list!=null){
					   	 count=list[0].num;
					     		 }  
					      	 });
					    DWREngine.setAsync(true);
					    downloadStr="附件["+count+"]";
					    editable1 = false;
						return '<div id="sidebar"><a href="javascript:showUploadWin(\''
									+ businessType + '\', ' + editable1 + ', \''
									+ infoid
									+ '\', \''+"文件附件"+'\')">' + downloadStr +'</a></div>'
					
					
					    }
			}, {
				id : 'checkLevel',
				header : fc['checkLevel'].fieldLabel,
				dataIndex : fc['checkLevel'].name,
				align : 'center',
				width : 110,
				renderer : function(value){
				    for(var i = 0; i < getLevelArr.length; i ++){
				       if(value == getLevelArr[i][0]){
				          return getLevelArr[i][1];
				       }
				    }
				}
			}, {
				id : 'checkResult',
				header : fc['checkResult'].fieldLabel,
				dataIndex : fc['checkResult'].name,
				align : 'center',
				width : 100
			}, {
				id : 'checkDate',
				header : fc['checkDate'].fieldLabel,
				dataIndex : fc['checkDate'].name,
				renderer : formatDate,
				type : 'date',
				align : 'center',
				width : 100
			}, {
				id : 'billstategl',
				header : fc['billstategl'].fieldLabel,
				dataIndex : fc['billstategl'].name,
				align : 'center',
				renderer : function(value,meta,record){
		            var renderStr="";
						if(value=="0") return "<font color=gray>未上报</font>";
						if(value=="1") renderStr="<font color=black>已上报</font>";
						if(value=="2") renderStr="<font color=red>审批完成</font>";
						if(value=="3") renderStr="<font color=blue>退回重报</font>";
						if(value=="4") renderStr="<font color=blue>退回重审</font>";
					return "<a title='点击查看详细信息' " +
							"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uuid')+"\",\""+"addOrupdate"+"\")'>"+renderStr+"</a>";
				},
				width : 100
			}, {
				id : 'billstatesp',
				header : fc['billstatesp'].fieldLabel,
				dataIndex : fc['billstatesp'].name,
				align : 'center',
				hidden : true,
		/*		
				renderer : function(value,meta,record){
		            var renderStr="";
						if(value=="0") renderStr="<font color=gray>未审批</font>";
						if(value=="1") renderStr="<font color=black>审批完成</font>";
						if(value=="2") renderStr="<font color=blue>退回重报</font>";
						if(value=="3") renderStr="<font color=blue>退回重审</font>";
					return "<a title='点击查看详细信息' " +
							"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uuid')+"\",\""+"approval"+"\")'>"+renderStr+"</a>";
				},*/
				width : 100
			}, {
				id : 'billstatecx',
				header : fc['billstatecx'].fieldLabel,
				dataIndex : fc['billstatecx'].name,
				align : 'center',
				hidden : true,
	/*			renderer : function(value,meta,record){
		            var renderStr="";
                        if(value=="0") renderStr = "<font color=gray>审批完成</font>";
						if(value=="1") renderStr="<font color=black>退回重审</font>";
					return "<a title='点击查看详细信息' " +
							"href='javascript:showReportLog(\""+record.get('pid')+"\",\""+record.get('uuid')+"\",\""+"query"+"\")'>"+renderStr+"</a>";
				},*/
				width : 100
			}, {
				id : 'unit',
				header : fc['unit'].fieldLabel,
				dataIndex : fc['unit'].name,
				align : 'center',
//				hidden : (edit_flag == "approval" || edit_flag == "query")?true:false,
				renderer : function(v){
					for(var i = 0; i < unitArr.length;i ++){
					   if(v==unitArr[i][0]){
						   	 var qtip = "qtip=" + unitArr[i][1];
			                 return '<span ' + qtip + '>' + unitArr[i][1] + '</span>';
					   }
					}
				},
				width : 180
			}, {
				id : 'createMan',
				header : fc['createMan'].fieldLabel,
				dataIndex : fc['createMan'].name,
				align : 'center',
				width : 100
			}, {
				id : 'createManId',
				header : fc['createManId'].fieldLabel,
				dataIndex : fc['createManId'].name,
				align : 'center',
				hidden : true,
				width : 100
			}, {
				id : 'approvalMan',
				header : fc['approvalMan'].fieldLabel,
				dataIndex : fc['approvalMan'].name,
				align : 'center',
				hidden : true,
				width : 100
			}, {
				id : 'backMan',
				header : fc['backMan'].fieldLabel,
				dataIndex : fc['backMan'].name,
				align : 'center',
				hidden : true,
				width : 100
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				align : 'center',
				hidden : true,
				width : 100
			}, {
				id : 'memo',
				header : fc['memo'].fieldLabel,
				dataIndex : fc['memo'].name,
				align : 'center',
				width : 100
			}
	])
	
	
	var Columns = [
			{name: 'uuid' , type: 'string'},
			{name: 'treeUuid' , type: 'string'},
			{name: 'fileNo' , type: 'string'},
			{name: 'fileName' , type: 'string'},
			{name: 'filelsh' , type: 'string'},
			{name: 'checkLevel' , type: 'string'},
			{name: 'checkResult' , type: 'string'},
			{name: 'checkDate' , type : 'date',dateFormat : 'Y-m-d'},
			{name: 'billstategl' , type: 'string'},
			{name: 'billstatesp' , type: 'string'},
			{name: 'billstatecx' , type: 'string'},
			{name: 'unit' , type: 'string'},
			{name: 'createMan' , type: 'string'},
			{name: 'createManId' , type: 'string'},
			{name: 'approvalMan' ,type : 'string'},
			{name: 'backMan', type : 'string'},
			{name: 'pid' , type: 'string'},
			{name: 'memo' , type: 'string'}
	]
		ds = new Ext.data.Store({
			baseParams: {
		    	ac: 'list',
		    	bean: bean,				
		    	business: business,
		    	method: listMethod,
		    	params: whereSql
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
	        pruneModifiedRecords: true	
    });
    ds.setDefaultSort(orderColumn, 'desc');
    cm.defaultSortable = true;
    gridPanel = new Ext.grid.GridPanel({
			ds : ds,
			cm : cm,
			sm : sm,
			title : '质量验评管理',
			saveBtn : false,
			addBtn : false,
			delBtn : false,
			header: false,
		    border: false,
		    layout: 'fit',
		    region: 'center',
	        stripeRows:true,
	        loadMask : true,
            width:document.body.clientWidth*0.9,
            height:document.body.clientHeight*0.66,
		    viewConfig: {
		        forceFit: false,
		        ignoreAdd: true
		    },
		    enableHdMenu : false,
		    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	            pageSize: PAGE_SIZE,
	            store: ds,
	            displayInfo: true,
	            displayMsg: ' {0} - {1} / {2}',
	            emptyMsg: "无记录。"
	        })
	})

	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    function queryFn(){
       var startTime =  Ext.get('startTime').getValue();
       var endTime =  Ext.get('endTime').getValue();
       if(startTime == "开始时间"){
          Ext.example.msg('信息提示',"请选择开始时间!");
          return;
       }
       if(endTime == "结束时间"){
          Ext.example.msg('信息提示',"请选择结束时间!");
          return;
       }
       if(endTime<startTime){
          Ext.example.msg('信息提示',"结束时间不能小于开始时间!");
          return;
       }
       store.load(); 
    }
    
	//导出数据
	function exportDataFile(){
        var openUrl = CONTEXT_PATH
                + "/servlet/PCZlgkServlet?ac=exportData&businessType=pcZlgkZlypExecl&pid="
                + PID+"&getStartTime="+getStartTime+"&getEndTime="+getEndTime+"&unitComValue="+unitComValue+"&billstateComValue="+ billstateComValue;
        document.all.formAc.action = openUrl
        document.all.formAc.submit();						
	}    
})

//**********************根据点击的相关项进行查询******************
	function showRecordList(getUuid,getType,getpid){
	   var   formWindow  = new Ext.Window({	               
	                width:document.body.clientWidth*0.9,
	                height:document.body.clientHeight*0.7,
	                closeAction:'hide',
	                maximizable : true,
	                plain: true,
	                modal:true,
	                closable : true,
	                autoScroll:true,
	                buttonAlign : 'center',
	                bodyStyle:'overflow-y:auto;overflow-x:hidden;',
	                items: [gridPanel],
	                animEl:'action-new',
	                listeners: {
						    'hide' : function(){
						        formWindow.hide();
						        formWindow = null;
						    }
						}	
	            });
	            formWindow.show();
				var treeIdSql="select tree_id from pc_zlgk_zlyp_tree where uuid='"+getUuid+"'";
				var treeIdstr = "";
				DWREngine.setAsync(false);
				baseDao.getData(treeIdSql,function(list){
					if(list!=null&&list.length==1){
						treeIdstr=list[0];
					}
				});	
				DWREngine.setAsync(true);
				var sql = "select uuid from "+beanTree+" where treeId like '"+treeIdstr+"%'" +
						  		" and pid='"+getpid+"' and engineer_type = '"+getType+"'";
				var whereSql = "";
				if(billstateComValue != ''){
	                whereSql += " and billstategl='"+billstateComValue+"'";
	            }
	            if(unitComValue != ''){
	               whereSql += " and unit='"+unitComValue+"'";
	            }
	            if(getEndTime != '' && getStartTime != ''){
	                whereSql += "and checkDate between to_date('"+Ext.get('startTime').getValue()+"', 'yyyy-mm-dd') and  to_date('"+Ext.get('endTime').getValue()+"', 'yyyy-mm-dd')";
	            }
		        ds.baseParams.params = "pid='"+CURRENTAPPID+"' and treeUuid in ("+sql+") "+ whereSql;
		        ds.load({params:{start:0,limit:PAGE_SIZE}});
	}
	
//显示多附件的文件列表
function showUploadWin(businessType, editable1, businessId, winTitle) {
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
			+ businessType + "&editable=" + editable1 + "&businessId="
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