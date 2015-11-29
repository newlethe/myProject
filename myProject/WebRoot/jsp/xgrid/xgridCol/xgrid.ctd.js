/*
 * 
 * 
 */

var bean = "com.sgepit.frame.xgridTemplet.hbm.SgprjPropertyCode";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = 'codeSn';
var orderColumn = 'codeSn';
var queryData = '';
var checkTypeArray = new Array();

var fixedFilterPart = "1 = 1";
Ext.onReady(function() {

			Ext.QuickTips.init();
			
			 for(var i=0;i<3;i++){
			    var temp = new Array()
			    if(i == 0){
					temp.push(['列配置']);
			    }
			    if(i == 1){
					temp.push(['模板类型']);
			    }
			    if(i == 2){
					temp.push(['列下拉选择项配置']);
			    }
					checkTypeArray.push(temp);
			 }
		    
			var checkTypeData = new Ext.data.SimpleStore({
						fields : ['k',''],
						data : checkTypeArray
					});
			var checkType = new Ext.form.ComboBox({
						store : checkTypeData,
						AutoWidth : true,
						autoHeight : true,
						displayField : 'k',
						valueField : '',
						typeAhead : true,
						mode : 'local',
						triggerAction : 'all',
						emptyText : '  --类型查询--',
						selectOnFocus : true
					});

			checkType.on('select', chooseType)
			var sm = new Ext.grid.CheckboxSelectionModel({
						singleSelect : true
					})
			var colModel = new Ext.grid.ColumnModel([{
						id : 'codeSn', 
						type : 'string', 
						header : '主键',    //0
						dataIndex : 'codeSn',
						width : 100,
						hidden : true,						
						sortable : true
					}, {
						id : 'codeId',     
						type : 'string',
						header : '编号',    //1
						dataIndex : 'codeId',
						width : 200,
						sortable : true
					}, {
						id : 'codeType',  
						type : 'string',
						header : '类型',     //2
						dataIndex : 'codeType',
						width : 150,
//						hidden : true,
						sortable : true
					}, {
						id : 'codeTable',    
						type : 'string',
						header : '数据库表名',   //3
						dataIndex : 'codeTable',
						width : 300,
						hidden : true,
						sortable : true
					}, {
						id : 'codeNote',   
						type : 'string',
						header : '说明',     //4
						dataIndex : 'codeNote',
						width : 250,
//						hidden : true,
						sortable : true
					}, {
						id : 'codeCol',    
						type : 'string',
						header : '数据库列名',   //5
						dataIndex : 'codeCol',
						width : 200,
//						hidden : true,
						sortable : true
					}, {
						id : 'codeColtype',  
						type : 'string',
						header : '列类型',   //6
						dataIndex : 'codeColtype',
						width : 150,
//						hidden : true,						
						sortable : true
					}, {
						id : 'modelType',  
						type : 'string',
						header : '所属模板',   //7
						dataIndex : 'modelType',
//						hidden : true,
						width : 250,
						sortable : true
					}, {
						id : 'sjTran',  
						type : 'string',
						header : '时间转换类型',   //8
						dataIndex : 'sjTran',
						width : 100,
						hidden : true,
						sortable : true

					}, {
						id : 'orderId',
						type : 'string', 
						header : '排序',   //9
						dataIndex : 'orderId',
						width : 100,
						hidden : true,						
						sortable : true
					}, {
						id : 'note',  
						type : 'string',
						header : '备注',  //10
						dataIndex : 'note',
						width : 220,
						hidden : true,
						sortable : true

					}])

			var Columns = [{
						name : 'codeSn',
						type : 'string'
					}, {
						name : 'codeId',
						type : 'string'
					}, {
						name : 'codeType',
						type : 'string'
					}, {
						name : 'codeTable',
						type : 'string'
					}, {
						name : 'codeCol',
						type : 'string'
					}, {
						name : 'codeColtype',
						type : 'string'
					}, {
						name : 'codeNote',
						type : 'string'
					}, {
						name : 'sjTran',
						type : 'string'
					}, {
						name : 'orderId',
						type : 'string'
					}, {
						name : 'note',
						type : 'string'
					}, {
						name : 'modelType',
						type : 'string'
					}]

			var Plant = Ext.data.Record.create(Columns);
			var PlantInt = {
				codeSn : '',
				codeId : '',
				codeType : '',
				codeTable : '',
				codeCol : '',
				codeColtype : '',
				codeNote : '',
				sjTran : '',
				orderId : '',
				note : '',
				modelType : ''
			}

			var store = new Ext.data.Store({
						baseParams : {
							ac : 'list', // 表示取列表
							bean : bean,
							business : business,
							method : listMethod,
							params : queryData
						},// 设置代理（保持默认）
						proxy : new Ext.data.HttpProxy({
									method : 'GET',
									url : MAIN_SERVLET
								}),
						// 创建reader读取数据（保持默认）
						reader : new Ext.data.JsonReader({
									root : 'topics',
									totalProperty : 'totalCount',
									id : primaryKey
								}, Columns),
						// 设置是否可以服务器端排序
						remoteSort : true,
						pruneModifiedRecords : true
					});

			var brnView = new Ext.Button({
						id : 'view',
						text : '修改',
						iconCls : 'view',
						handler : function() {
							// var url = 'jsp/view.jsp';
							// window.location.href = url;
						}
					})

			var btnAdd = new Ext.Button({

			})

			var gridpanel = new Ext.grid.QueryExcelGridPanel({
						ds : store,
						cm : colModel,
						// sm : sm,
						title : '数据项配置查询',
						tbar : [checkType],
						iconCls : 'icon-show-all',
						border : false,
						region : 'center',
						clicksToEdit : 2,
						layout : 'fit',
						autoScroll : true, // 自动出现滚动条
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
//						autoExpandColumn : 5, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
						loadMask : true, // 加载时是否显示进度
						// addBtn : false, // 是否显示新增按钮
						// saveBtn : false, // 是否显示保存按钮
						// delBtn : false, // 是否显示删除按钮
//						viewConfig : {
//							forceFit : true,
//							ignoreAdd : true
//						},
						bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
							pageSize : PAGE_SIZE,
							store : store,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录。"
						}),
						plant : Plant,
						plantInt : PlantInt,
						servletUrl : MAIN_SERVLET,
						bean : bean,
						business : business,
						primaryKey : primaryKey
					})

			var view = new Ext.Viewport({
						layout : 'border',
						items : [gridpanel]
					})
			//Ext.getCmp('showQuery').setVisible(false) ;
			
			store.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
			function chooseType() {
				var codeType = '';
				colModel.setHidden(2,false);
				colModel.setHidden(3,false);
				colModel.setHidden(5,false);
				colModel.setHidden(6,false);
				colModel.setHidden(7,true);
				colModel.setHidden(10,true);
				var checkValue = checkType.getValue();
				if (checkValue != '') {
					if(checkValue ==  '列配置'){
					  codeType  = 'PROJECT_COL'
					}else if(checkValue ==  '模板类型'){
					 codeType  = 'PROJECT_TYPE'
					}else 	if(checkValue ==  '列下拉选择项配置'){
					 codeType  = 'PROJECT_CO'
					}
					queryData = '', 
					queryData += ' code_type=\'' + codeType         
							+ '\'';
						if(codeType == 'PROJECT_COL'){  
							    colModel.setColumnWidth(1,120);
							    colModel.setColumnWidth(4,280);
							    colModel.setColumnWidth(5,250);
								colModel.setHidden(2,true);      
								colModel.setHidden(3,true); 
								colModel.setHidden(7,false);    
						}else if(codeType == 'PROJECT_TYPE'){
							    colModel.setColumnWidth(1,350)
							    colModel.setColumnWidth(4,400)
								colModel.setHidden(2,true);
								colModel.setHidden(5,true);
								colModel.setHidden(6,true);
								colModel.setHidden(7,true);
						}else if(codeType == 'PROJECT_CO'){
							    colModel.setColumnWidth(1,200);
							    colModel.setColumnWidth(4,200)
                     			colModel.setHidden(5,true);										
								colModel.setHidden(6,true);	
								colModel.setHidden(7,true);	
								colModel.setHidden(10,false);
						}

						fixedFilterPart = queryData
                    	store.baseParams.params = queryData;
						store.load({
									params : {
										start : 0,
										limit : PAGE_SIZE
									}
								});
				}
			}
		})
