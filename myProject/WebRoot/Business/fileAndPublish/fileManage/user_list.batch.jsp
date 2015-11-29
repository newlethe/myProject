<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String rootId = request.getParameter("rootId") == null ? "" : request.getParameter("rootId");
	String pubid = request.getParameter("pubId");
	String type = request.getParameter("type");
	//发布文件时是否要进行数据交换
	String exchangeOnPublish = request.getParameter("exchangeOnPublish") == null ? "0" :
		 request.getParameter("exchangeOnPublish");
%>
<html>
	<head>
		<title>信息发布</title>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script src='dwr/engine.js'>
</script>
		<script type="text/javascript"
			src="<%=path%>/dwr/interface/db2Json.js">
</script>
		<script type="text/javascript"
			src="<%=path%>/dwr/interface/ComFileManageDWR.js">
</script>
		<script><!--
var gridPane, userGrid, container, viewport, root
var unitName = '<%=unitname%>'
var pubId = '<%=pubid%>'
var type = 'bdwyh'
var username = '<%=username%>'
var unitId = '<%=userunitid%>'
var selectedUserId = ""
var selectedUserTemp = "";
var exchangeOnPublish = <%=exchangeOnPublish %>;
var rootId = '<%=rootId%>'
var treeNodeUrl = CONTEXT_PATH + "/servlet/ComFileManageServlet?ac=buildingUnitNewTree";
var RootUpunitunitid= USERBELONGUNITID;
var unitid=USERBELONGUNITID;
var upunit=USERBELONGUNITID;
var RootName=USERBELONGUNITNAME;
var Columns, Plant, PlantInt, sm, cm;

//批量发送文件id数组
var fileIds = window.parent.ids;


Ext.onReady(function() {
		var pubInfo = new Ext.Button( {
			text : '发布',
			iconCls : 'save',
			handler : function() {
				
				if (selectedUserTemp != "") {
					pubInfo.disable();
					selectedUserId = selectedUserTemp.substring(0,
									selectedUserTemp.length - 1);
					var doExchange = (exchangeOnPublish == "1");
				var waitMsg = '正在发布，请稍候...';
				if ( doExchange ){
					waitMsg = '正在进行数据交互，请稍候...';
				}
				var mask = new Ext.LoadMask(Ext.getBody(), {
													msg :waitMsg
												});
											mask.show();
					ComFileManageDWR.filesPublishToUser(USERID, USERDEPTID,
							fileIds, selectedUserId , doExchange,
							function(rtn) {
								mask.hide();
								if (rtn=='success') {
									
									Ext.Msg.alert('提示', '发布成功！');
									window.parent.returnValue = true;
									ds.load( {
														params : {
															start : 0,
															limit : PAGE_SIZE
														}});
									
								} else if (rtn=='failed'){
									Ext.Msg.alert('提示', '发布失败！');
								} else {
									Ext.Msg.show({
										title : '提示',
										msg : rtn,
										buttons : Ext.Msg.OK,
										icon : Ext.MessageBox.ERROR
									});
								}
								pubInfo.enable();
							})
					if (rootId=="xxbdw" && CURRENTAPPID == '1031902'){
						ComFileManageDWR.sendSmsToUser(REALNAME,USERPOSNAME,selectedUserId,pubId,function(rtn){
							if(rtn == 'true'){
								window.parent.returnValue = true;
								Ext.Msg.alert('提示','短信发送成功！');
							}else {
								Ext.Msg.show({
												title : '提示',
												msg : '短信发送失败',
												buttons : Ext.Msg.OK,
												icon : Ext.MessageBox.ERROR
											});
							}
						})
					}
				} else {
					Ext.Msg.alert('提示', '选择需要发布的用户！');
				}
			}
		})

		var bean = "com.sgepit.fileAndPublish.hbm.ComFilePublishHistory";
		var business = "ComFileManageService";
		var listMethod = "getPublishUserInDept";
		var primaryKey = "userid";
		var orderColumn = "pubDate";
		var listWhere = 'fileId' + SPLITB + pubId + SPLITA + 'unitId' + SPLITB+ unitId;
			

		Columns = [ {
			name : 'receiver',
			type : 'string'
		},//用户id
				{
					name : 'publishDept',
					type : 'string'
				},//用户单位名称
				{
					name : 'publishUser',
					type : 'string'
				},//用户姓名
				{
					name : 'uids',
					type : 'string'
				}, {
					name : 'publishTime',
					type : 'date',
					dateFormat : 'Y-m-d H:i:s'
				} ,{name : 'fileDeptName', type : 'string'}]

		Plant = Ext.data.Record.create(Columns); //定义记录集
		PlantInt = {
			receiver : '',
			publishDept : '',
			publishUser : '',
			uids : ''
		}

		sm = new Ext.grid.CheckboxSelectionModel( {
			listeners : {
				rowdeselect : function(sm, rowIndex, rec) {
					selectedUserTemp = selectedUserTemp.replace(
							rec.data.receiver + ",", "")
					
				},
				rowselect : function(sm, rowIndex, rec) {
				if (fileIds.length == 1) {
					if(rec.data.publishTime!=''){ 
						sm.deselectRow(rowIndex);
						return false; //不能进行选择
					}	
				}			
					selectedUserTemp = selectedUserTemp.replace(
							rec.data.receiver + ",", "")
							+ rec.data.receiver + ","
					}
				}
		});
		var columnModel = [ sm, 
		{	header : "单位名称",
			width : 150,
			dataIndex : "fileDeptName"
			
		},	
		{
			header : "部门、岗位名称",
			width : 120,
			dataIndex : "publishDept"
		}, {
			header : "接受人",
			width : 100,
			dataIndex : "publishUser"
		}];
		if (fileIds.length == 1) {
			columnModel.push( {
				header : "发布状态",
				dataIndex : "publishTime",
				width : 70,
				renderer : function(value) {
					if (value != '')
						return "<div style='color:red;'>已发布</div>"
					else
						return "未发布"
				}
			});
			columnModel.push( {
				header : "发布时间",
				width : 110,
				dataIndex : "publishTime",
				renderer : Ext.util.Format.dateRenderer('Y-m-d H:i') // Ext内置日期renderer
			});

		}
		cm = new Ext.grid.ColumnModel( // 创建列模型
				columnModel

		)

		cm.defaultSortable = true; //设置是否可排序
		ds = new Ext.data.Store( { // 分组
					baseParams : {
						ac : 'list', //表示取列表
						bean : bean,
						business : business,
						method : listMethod,
						params : listWhere
					},
					// 设置代理（保持默认）
					proxy : new Ext.data.HttpProxy( {
						method : 'GET',
						url : MAIN_SERVLET
					}),

					// 创建reader读取数据（保持默认）
					reader : new Ext.data.JsonReader( {
						root : 'topics',
						totalProperty : 'totalCount',
						id : primaryKey
					}, Columns),

					// 设置是否可以服务器端排序
					remoteSort : true,
					pruneModifiedRecords : true
				//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
				});
		ds.on("load", function(ds1) {
			var sa = new Array();
			for (i = 0; i < ds1.getCount(); i++) {
				var rec = ds1.getAt(i)
				if (selectedUserTemp.indexOf(rec.data.receiver + ",") > -1) {
					sa.push(i)
				}
			}
			sm.selectRows(sa)
		})
		userGrid = new Ext.grid.EditorGridTbarPanel( {
			id : 'cat-grid-panel', //id,可选
			ds : ds, //数据源
			cm : cm, //列模型
			sm : sm, //行选择模式
			//tbar: [],						//顶部工具栏，可选
			//title: "",					//面板标题
			//iconCls: 'icon-by-category',	//面板样式
			tbar : [ '单位用户', '->', pubInfo ],
			addBtn : false,
			saveBtn : false,
			delBtn : false,
			refreshBtn : false,
			border : false, // 
			region : 'center',
			clicksToEdit : 1, //单元格单击进入编辑状态,1单击，2双击
			//header: true,				//
			autoScroll : true, //自动出现滚动条
			collapsible : false, //是否可折叠
			animCollapse : false, //折叠时显示动画
			loadMask : true,
			viewConfig : {
				ignoreAdd : true
			}, //加载时是否显示进度
			bbar : new Ext.PagingToolbar( {//在底部工具栏上添加分页导航
						pageSize : PAGE_SIZE,
						beforePageText : "第",
						afterPageText : "页,共{0}页",
						store : ds,
						displayInfo : true,
						firstText : '第一页',
						prevText : '前一页',
						nextText : '后一页',
						lastText : '最后一页',
						refreshText : '刷新',
						displayMsg : '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
						emptyMsg : "无记录。"
					}),

			// expend properties
			plant : Plant,
			plantInt : PlantInt,
			servletUrl : MAIN_SERVLET,
			bean : bean,
			business : "ComFileManageService",
			primaryKey : primaryKey
		});
			
		var where="unit_type_id not in ('9')";
		root = new Ext.tree.AsyncTreeNode( {
			text : '所有单位',
			id : 0,
			expanded : true
		});

		treeLoader = new Ext.tree.TreeLoader( {
			dataUrl : treeNodeUrl + "&parentId=" + RootUpunitunitid,
			requestMethod : "GET",
			baseParams : {
					method : "buildingUnitNewTree",
					ifcheck : true,
					baseWhere :where,
					unitid:unitid,
			        upunit:upunit,
					async : false,
					hascheck:"no",
					deployUnitType : DEPLOY_UNITTYPE
				}
		})

		treePanel = new Ext.tree.TreePanel( {
			id : 'orgs-tree',
			region : 'west',
			split : true,
			width : 196,
			minSize : 175,
			maxSize : 500,
			frame : false,
			layout : 'accordion',
			margins : '0 0 0 0',
			cmargins : '0 0 0 0',
			rootVisible : false,
			lines : false,
			autoScroll : true,
			collapsible : true,
			animCollapse : false,
			animate : false,
			collapseMode : 'mini',
			tbar : [ {
				iconCls : 'icon-expand-all',
				tooltip : '全部展开',
				handler : function() {
					root.expand(true);
				}
			}, '-', {
				iconCls : 'icon-collapse-all',
				tooltip : '全部折叠',
				handler : function() {
					root.collapse(true);
				}
			} ],
			loader : treeLoader,
			root : root,
			collapseFirst : false
		});
		
		treePanel.on('load', function(node){
			node.expand();
			node.eachChild(function(child) {
			child.expand();  
			}); 
		});
		
		treePanel.on('beforeload', function(node) {
			treePanel.loader.dataUrl = treeNodeUrl + "&parentId=" + node.id
		});

		treePanel.on('click', function(node, e) {
			e.stopEvent();

				var listWhere = 'fileId' + SPLITB + pubId + SPLITA + 'unitId' + SPLITB + node.id;
				if (node.attributes.unitTypeId == '9') {
					if (node.parentNode) {
						listWhere = 'fileId' + SPLITB + pubId + SPLITA + 'unitId' + SPLITB+ node.parentNode.id+ SPLITA + 'posId' + SPLITB+ node.id;
		
					}

				}

				ds.baseParams.params = listWhere
				ds.load( {
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
			});

		container = new Ext.Panel( {
			region : 'center',
			margins : '0 0 0 0',
			layout : 'fit',
			items : userGrid
		});

		viewport = new Ext.Viewport( {
			layout : 'border',
			items : [ treePanel, container ]
		});

		ds.load( {
			params : {
				start : 0, //起始序号
				limit : PAGE_SIZE
			//结束序号，若不分页可不用设置这两个参数
				}
			});

		
	});
--></script>
	</head>

	<body>
		<div id="user"></div>
	</body>
</html>

