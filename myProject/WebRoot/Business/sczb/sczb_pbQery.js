var beanPB = "com.sgepit.pmis.sczb.hbm.SczbPbQuery";
var businessPB = "baseMgm"
var listMethodPB = "findWhereOrderby"
var primaryKeyPB = "uids"
var orderColumnPB = "initialDate"
var currentPid = CURRENTAPPID;	

Ext.onReady(function() {
		//是否禁用添加/修改/删除按钮
		var btnDisabled = ModuleLVL != '1';

		DWREngine.setAsync(false);
		systemMgm.getUnitById(CURRENTAPPID, function(u) {
			if (u && u != null && u != 'null') {
				currentPid = u.upunit;
			}
		});
		DWREngine.setAsync(true);
		
		var gridfilter = "PID = '" + currentPid + "' ";
		
		var fm = Ext.form;
		
		var ColumnsPB = [ {
			name : 'uids',
			type : 'string'
		}, //Grid显示的列，必须包括主键(可隐藏)
				{
					name : 'pid',
					type : 'string'
				}, {
					name : 'initialDate',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'zcName',
					type : 'string'
				}, {
					name : 'bcName',
					type : 'string'
				}, {
					name : 'beginTime',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'endTime',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				}, {
					name : 'myType',
					type : 'string'
				}]
		
		var fcPB = {
			'uids' : {
				name : 'uids',
				fieldLabel : 'uids',
				anchor : '95%'
			},
			'pid' : {
				name : 'pid',
				fieldLabel : 'pid',
				//hidden:true,
				//hideLabel:true,
				anchor : '95%'
			},
			'initialDate' : {
				name : 'initialDate',
				fieldLabel : '日期',
				//hideLabel:true,
				//hidden:true,
				anchor : '95%'
			},
			'zcName' : {
				name : 'zcName',
				fieldLabel : '值次',
				allowBlank : false,
				anchor : '95%'
			},
			'bcName' : {
				name : 'bcName',
				fieldLabel : '班次',
				allowBlank : false,
				anchor : '95%'
			},
			'beginTime' : {
				name : 'beginTime',
				fieldLabel : '开始时间',
				anchor : '95%'
			},
			'endTime' : {
				name : 'endTime',
				fieldLabel : '结束时间',
				anchor : '95%'
			},
			'myType' : {
				name : 'myType',
				fieldLabel : 'myType',
				anchor : '95%'
			}
		}
		
		var smPB = new Ext.grid.CheckboxSelectionModel( {
			singleSelect : true
		})
		
		var cmPB = new Ext.grid.ColumnModel( [ // 创建列模型
				{
					id : 'uids',
					header : fcPB['uids'].fieldLabel,
					dataIndex : fcPB['uids'].name,
					hidden : true
				}, {
					id : 'pid',
					header : fcPB['pid'].fieldLabel,
					dataIndex : fcPB['pid'].name,
					hidden : true
				}, {
					id : 'initialDate',
					header : fcPB['initialDate'].fieldLabel,
					dataIndex : fcPB['initialDate'].name,
					editor : new fm.DateField(fcPB['initialDate']),
					renderer : Ext.util.Format.dateRenderer('Y-m-d '),
					hidden : false
				}, {
					id : 'zcName',
					header : fcPB['zcName'].fieldLabel,
					dataIndex : fcPB['zcName'].name,
					width : 65
				}, {
					id : 'bcName',
					header : fcPB['bcName'].fieldLabel,
					dataIndex : fcPB['bcName'].name,
					width : 120
				}, {
					id : 'beginTime',
					header : fcPB['beginTime'].fieldLabel,
					dataIndex : fcPB['beginTime'].name,
					editor : new fm.DateField(fcPB['jlDate']),
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					width : 150,
					hidden : false
				}, {
					id : 'endTime',
					header : fcPB['endTime'].fieldLabel,
					editor : new fm.DateField(fcPB['jlDate']),
					renderer : Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
					dataIndex : fcPB['endTime'].name,
					width : 150
				}, {
					id : 'myType',
					header : fcPB['myType'].fieldLabel,
					dataIndex : fcPB['myType'].name,
					width : 150,
					hidden : true
				}]);
		cmPB.defaultSortable = true; //设置是否可排序
		
		
		var PlantPB = Ext.data.Record.create(ColumnsPB); //定义记录集
		
		var PlantIntPB = {
			uids : '',
			pid : currentPid,
			initialDate : '',
			zcName : '',
			bcName : '',
			beginTime : '',
			endTime : '',
			myType : ''
		} //设置初始值
		
		var PlantFieldsIntPB = new Object();
		Ext.applyIf(PlantFieldsIntPB, PlantIntPB)
		
		var dsPB = new Ext.data.Store( {
			baseParams : {
				ac : 'list',
				bean : beanPB,
				business : businessPB,
				method : listMethodPB,
				params : gridfilter
			},
			proxy : new Ext.data.HttpProxy( {
				method : 'GET',
				url : MAIN_SERVLET
			}),

			reader : new Ext.data.JsonReader( {
				root : 'topics',
				totalProperty : 'totalCount',
				id : 'uids'
			}, ColumnsPB),

			remoteSort : true,
			pruneModifiedRecords : true
		});
		dsPB.setDefaultSort(orderColumnPB, 'desc');
		/**
		 * 
		gridPB.getTopToolbar().add('开始时间：');
	   	gridPB.getTopToolbar().add(beginTimeDateFile);
	    gridPB.getTopToolbar().add('-');
	    gridPB.getTopToolbar().add('结束时间：');
	    gridPB.getTopToolbar().add(endTimeDateFile);
	   	gridPB.getTopToolbar().add(btnQuery); 
		*/
		var beginTimeDateFile=new fm.DateField({
			id:'beginTimeDate',
			value:new Date(),
			format : 'Y-m-d '
		})
		var endTimeDateFile=new fm.DateField({
			id:'endTimeDate',
			value:new Date(),
			format : 'Y-m-d '
		})
		var btnQuery=new Ext.Toolbar.Button({
						id : 'attachment',
						text : '查询',
						icon : CONTEXT_PATH
								+ "/jsp/res/images/icons/magnifier.png",
						cls : "x-btn-text-icon",
						handler : selectData
		});
		var gridPB = new Ext.grid.GridPanel( {
			// basic properties
			id : 'grid-panrel', //id,可选
			ds : dsPB, //数据源
			cm : cmPB, //列模型
			sm : smPB, //行选择模式
			tbar: ['开始时间',beginTimeDateFile,'结束时间：',endTimeDateFile,btnQuery ],		//顶部工具栏，可选
			//height : 50, //高
			//        iconCls: 'icon-show-all',	//面板样式
			border : false,
			region : 'center',
			clicksToEdit : 2, //单元格单击进入编辑状态,1单击，2双击
			header : false,
			autoScroll : true, //自动出现滚动条
			collapsible : false, //是否可折叠
			animCollapse : false, //折叠时显示动画
			autoExpandColumn : 2, //列宽度自动扩展，可以用列名，也可以用序号（从1开始）
			loadMask : true, //加载时是否显示进度
			stripeRows : true,
			viewConfig : {
				forceFit : true,
				ignoreAdd : true
			},
			plant : PlantPB, //初始化记录集，必须
			plantInt : PlantIntPB, //初始化记录集配置，必须
			servletUrl : MAIN_SERVLET, //服务器地址，必须
			bean : beanPB, //bean名称，必须
			business : businessPB, //business名称，可选
			primaryKey : primaryKeyPB, //主键列名称，必须
			formBtn : false,
			saveBtn : false,
			bbar : new Ext.PagingToolbar( {//在底部工具栏上添加分页导航
						pageSize : PAGE_SIZE,
						store : dsPB,
						displayInfo : true,
						displayMsg : ' {0} - {1} / {2}',
						emptyMsg : "无记录。"
					}),
			listeners : {
				afterdelete : function(grid, ids, primaryKey, bean) {

								}
						}
		});
		
		dsPB.load( {
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
		var viewport = new Ext.Viewport( {
			layout : 'border',
			items : [gridPB ]
		});
		
		
		
		function selectData(){
			
			var beginStr=beginTimeDateFile.getValue().getFullYear()+"-"+(beginTimeDateFile.getValue().getMonth()+1)+"-"+beginTimeDateFile.getValue().getDate();
			var endStr=endTimeDateFile.getValue().getFullYear()+"-"+(endTimeDateFile.getValue().getMonth()+1)+"-"+endTimeDateFile.getValue().getDate();
			
			DWREngine.setAsync(false);
			sczbJjbMgm.initJJBQuery(currentPid,beginStr,endStr, function(u) {
			});
			DWREngine.setAsync(true);
			
			var selectSql=" initialDate between to_date('"+beginStr+"','yyyy-mm-dd') and to_date('"+endStr+"','yyyy-mm-dd')";
			dsPB.baseParams.params = selectSql+" and pid='"+currentPid+"'";
			dsPB.load({
				params:{
					start: 0,
					limit: PAGE_SIZE
				}
			});
		}
		
	   	
		

	});