
var applicantGrid;
var applicantDs;
var bidContentId = null;
var applicantBeanName = "com.sgepit.pmis.equipment.hbm.ArrivalGoodsLog";
var plantInt;
var disableBtn = ModuleLVL != '1';
var sm;
var Columns;
Ext.onReady(function() {
	sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false,
				header : ''
			});	
	var cm = new Ext.grid.ColumnModel({
				columns : [sm, {
							id : 'uids',
							header : 'uids',
							dataIndex : 'uids',
							width : 100,
							hidden : true
						}, {
					id : 'arrivaltime',
					header : '时间',
					dataIndex : 'arrivaltime',
					renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
					align : 'center',
					width:90,
					type : 'date',
					editor : new Ext.form.DateField({
								name : 'arrivaltime',
								readOnly:true,
								format : 'Y-m-d'
							})
					},
				 {
							id : 'memo',
							header : '内容',
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

	Columns = [{
				name : 'uids',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
			name : 'arrivaltime',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
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
			orderby:"arrivaltime desc"
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
		sortInfo: {field: 'arrivaltime', direction: 'DESC'}
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
/*	applicantDs.on('beforeload', function(store, options) {
				store.baseParams.params ="pid="+CURRENTAPPID;
			});*/
	plantInt = {
		uids : '',
		memo : '',
		arrivaltime : new Date()
	};
    var gridLabel=
    '<font color=#15428b><B>到货备忘<B></font>';
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
				region : 'center',
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
	var mainPanel = new Ext.Panel({
				layout : 'border',
				items : [applicantGrid]
			});
		applicantDs.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [mainPanel]
			});
	if(applicantGrid.getTopToolbar().items.get('del'))
		applicantGrid.getTopToolbar().items.get('del').disable();
	
	sm.on('rowselect', function(sm, idx, r) {
		if(applicantGrid.getTopToolbar().items.get('del'))
			applicantGrid.getTopToolbar().items.get('del').enable();				
	});
	sm.on('rowdeselect', function(sm, idx, r) {
		if(applicantGrid.getTopToolbar().items.get('del'))
			applicantGrid.getTopToolbar().items.get('del').disable();				
	});
			
});


