var sgqtGrid;
var sgqtDs;
var bdgTreeStore,bdgTreeGrid,node,treeColumns,treeTbar;
var rootNew,treeLoaderNew,treePanelNew,columnTreeColumns,columnTreeTbar;

var sbclPanel;
var businessType = "zlMaterial";
var sbclDs;
var bdgArr = new Array(); //领料用途
var typeArr = new Array(); // 处理设备仓库
var equWareArr = new Array();// 系统编号，仓库号，仓库类别
var deptArray = new Array();//领用单位

Ext.onReady(function() {

	/** ******************************************概算树begin********************************** */
	bdgTreeStore = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : false,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'VBdgTree',// 后台java代码的业务逻辑方法定义
					business : 'faBaseInfoService',// spring 管理的bean定义
					bean : 'com.sgepit.pmis.budget.hbm.VBdgInfo',// gridtree展示的bean
					params : 'pid' + SPLITB + pid// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'bdgid', // 此id作为ds.paramNames.active_node
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ['bdgid', 'bdgno', 'bdgname', 'parent',
									'isleaf']
						}),
				listeners : {
					'beforeload' : function(ds, options) {
						var parent = null;
						if (options.params[ds.paramNames.active_node] == null) {
							parent = '0';
						} else {
							parent = options.params[ds.paramNames.active_node];
						}
						ds.baseParams.params = 'pid' + SPLITB + pid + ";proof"
								+ SPLITB + "y" + ";parent" + SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});

	bdgTreeStore.on("load", function(ds1, recs) {
				if (ds1.getCount() > 0) {
					var rec1 = ds1.getAt(0);
					if (!ds1.isExpandedNode(rec1)) {
						ds1.expandNode(rec1);
					}
				}
			});

	treeColumns = [{
				id : 'bdgname',
				header : '概算名称_概算编号',
				width : 400,
				dataIndex : 'bdgname',
				renderer : function(v,m,r){
					return v + "_" + r.get('bdgno');
				}
			}, {
				header : '编号',
				dataIndex : 'bdgno',
				hidden : true
			}];

	treeTbar = ['概算结构', '-', {
				iconCls : 'icon-expand-all',
				tooltip : 'Expand All',
				handler : function() {
					bdgTreeStore.expandAllNode();
				}
			}, '-', {
				iconCls : 'icon-collapse-all',
				tooltip : 'Collapse All',
				handler : function() {
					bdgTreeStore.collapseAllNode();
				}
			}];
	bdgTreeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				store : bdgTreeStore,
				master_column_id : 'bdgname',// 此项为列的id，定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'west',
				split : true,
				width : 250,
				enableHdMenu : false,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				frame : false,
				collapsible : true,
				animCollapse : false,
				border : false,
				columns : treeColumns,
				stripeRows : true,
				tbar : treeTbar
			});
	bdgTreeGrid.on('click', function() {
				var r = sm.getSelected();
				var treeRec = this.getSelectionModel().getSelected();
				var newparam = "'";
				if (treeRec && treeRec.get('bdgno') != '01') {
					newparam = "' and using like '" + treeRec.get('bdgid')
							+ "%'";
				}
				sbclDs.baseParams.params = gridfilter + " and uids = '"
						+ r.get('relateuids') + newparam;
				sbclDs.load({
							params : {
								start : 0,
								limit : pageSize
							}
						});
			});
	/** ******************************************概算树begin********************************** */
	/** ******************************************合同分摊树begin********************************** */
	rootNew = new Ext.tree.AsyncTreeNode({
				text : '工程量',
				iconCls : 'form'
			});
	treeLoaderNew = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "bdgProjectTree",
					businessName : uncompBusiness,
					conid : conid,
					conmoney : 0,
					parent : 0
				},
				clearOnLoad : false,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});
	columnTreeColumns = [{
				header : '概算名称_概算编码',
				width : 400,
				dataIndex : 'bdgname'
			}, {
				header : '概算编码',
				width : 0,
				dataIndex : 'bdgno',
				hidden : true
			}, {
				header : '概算主键',
				width : 0,
				dataIndex : 'bdgid',
				renderer : function(value) {
					return "<div id='bdgid'>" + value + "</div>";
				}
			}, {
				header : '是否子节点',
				width : 0,
				dataIndex : 'isleaf',
				renderer : function(value) {
					return "<div id='isleaf'>" + value + "</div>";
				}
			}, {
				header : '父节点',
				width : 0,
				dataIndex : 'parent',
				renderer : function(value) {
					return "<div id='parent'>" + value + "</div>";
				}
			}];

	columnTreeTbar = ['概算结构', '-', {
				iconCls : 'icon-expand-all',
				tooltip : 'Expand All',
				handler : function() {
					rootNew.expand(true);
				}
			}, '-', {
				iconCls : 'icon-collapse-all',
				tooltip : 'Collapse All',
				handler : function() {
					rootNew.collapse(true);
				}
			}];

	treePanelNew = new Ext.tree.ColumnTree({
				iconCls : 'icon-by-category',
				region : 'west',
				width : 250,
				minSize : 100,
				maxSize : 600,
				frame : false,
				header : false,
				border : false,
				split : true,
				collapsible : true,
				collapseMode : 'mini',
				lines : true,
				autoScroll : true,
				tbar : columnTreeTbar,
				columns : columnTreeColumns,
				loader : treeLoaderNew,
				root : rootNew,
				rootVisible : false
			});
	treePanelNew.on('beforeload', function(node) {
				var baseParams = treePanelNew.loader.baseParams;
				baseParams.conid = conid;
				baseParams.conmoney = 0;
				var bdgid = node.attributes.bdgid;
				bdgid = bdgid ? bdgid : '0';
				baseParams.parent = bdgid;
			});
	treePanelNew.on('click', function(node, e) {
				var r = sm.getSelected();
				var newparam = "";
				if (node.attributes.bdgno != '01') {
					newparam = " and bdgid like '" + node.attributes.bdgid + "%'";
				}
				var subject = subSm.getSelected().get('conid');// 财务科目treeid
				sgqtDs.baseParams.params = sgqtParams + newparam;
				sgqtDs.load({
							params : {
								start : 0,
								limit : pageSize
							}
						});
			});
	treePanelNew.on('load', function() {
				rootNew.expandChildNodes();
			})

	/** *******************************************合同分摊树end***************************** */
	/** *******************************施工、其他合同投资完成begin**************************** */
	
	var sgqtColumns = [{
				name : 'acmId',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'monId',
				type : 'string'
			}, {
				name : 'proid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'bdgid',
				type : 'string'
			}, {
				name : 'proname',
				type : 'string'
			}, {
				name : 'unit',
				type : 'string'
			}, {
				name : 'price',
				type : 'float'
			}, {
				name : 'amount',
				type : 'float'
			}, {
				name : 'money',
				type : 'float'
			}, {
				name : 'ratiftpro',
				type : 'float'
			}, {
				name : 'ratiftmoney',
				type : 'float'
			}, {
				name : 'isper',
				type : 'string'
			}];

	var sgqtSm = new Ext.grid.CheckboxSelectionModel();

	var sgqtCm = new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer(),
			{
				id : 'acmId',
				header : '主键',
				dataIndex : 'acmId',
				hidden : true
			}, {
				id : 'pid',
				header : '项目ID',
				dataIndex : 'pid',
				hidden : true
			}, {
				id : 'monId',
				header : '主表主键',
				dataIndex : 'monId',
				hidden : true
			}, {
				id : 'proid',
				header : '工程量分摊主键',
				dataIndex : 'proid',
				hidden : true
			}, {
				id : 'conid',
				header : '合同主键',
				dataIndex : 'conid',
				hidden : true
			}, {
				id : 'bdgid',
				header : '概算编号',
				dataIndex : 'bdgid',
				hidden : true
			}, {
				id : 'proname',
				header : '项目名称',
				dataIndex : 'proname',
				align : 'left',
				width : 180,
				renderer : function(val) {
					var qtip = "qtip=" + val;
					return '<span ' + qtip + '>' + val + '</span>';
				}
			}, {
				id : 'price',
				header : '综合单价（元）',
				dataIndex : 'price',
				renderer : cnMoney,
				align : 'right',
				width : 100
			}, {
				id : 'unit',
				header : '单位',
				dataIndex : 'unit',
				align : 'center',
				width : 80
			}, {
				id : 'amount',
				header : '合同工程量',
				dataIndex : 'amount',
				align : 'right',
				width : 80,
				renderer : function(v, m, r) {
					return r.get('isper') == '1'
							? (v * 100).toFixed(2) + "%"
							: v;
				}
			}, {
				id : 'money',
				header : '合同价款（元）',
				dataIndex : 'money',
				renderer : function(v){
					return cnMoneyToPrec(v,2);
				},
				align : 'right',
				width : 100
			}, {
				id : 'ratiftpro',
				header : '批准工程量',
				dataIndex : 'ratiftpro',
				width : 100,
				align : 'right',
				renderer : function(v, m, r) {
					m.css = 'x-grid-back-editable';
					return r.get('isper') == '1'
							? (v * 100).toFixed(2) + "%"
							: v;
				}
			}, {
				id : 'ratiftmoney',
				header : '批准金额',
				dataIndex : 'ratiftmoney',
				renderer : function(v){
					return cnMoneyToPrec(v,2);
				},
				align : 'right',
				width : 100
			}, {
				id : 'isper',
				header : '总工程量是否带百分号',
				dataIndex : 'isper',
				hidden : true
			}]);
	sgqtCm.defaultSortable = true;

	sgqtDs = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : 'com.sgepit.pmis.investmentComp.hbm.ProAcmInfo',
					business : business,
					method : listMethod,
					params : "pid ='" + CURRENTAPPID + "'"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'uuid'
						}, sgqtColumns),
				remoteSort : true,
				pruneModifiedRecords : true
			});

	sgqtGrid = new Ext.grid.GridPanel({
				ds : sgqtDs,
				cm : sgqtCm,
				sm : sgqtSm,
				border : false,
				region : 'center',
				header : false,
				autoScroll : true, // 自动出现滚动条
				tbar : ['<font color=#15428b><B>工程量信息<B></font>'],
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : pageSize,
					store : sgqtDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});

	/*********************************施工、其他合同投资完成end*******************************/
	/*********************************设备、材料合同投资完成begin*****************************/

	DWREngine.setAsync(false);
	baseMgm.getData("select bdgid,bdgname from bdg_info where pid='"
					+ CURRENTAPPID + "' order by bdgid ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1] + " - " + list[i][0]);
					bdgArr.push(temp);
				}
			});
	baseMgm.getData("select wareno,waretype,equid from equ_warehouse where pid='"
					+ CURRENTAPPID + "' and parent='01' order by equid ",
			function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					typeArr.push(temp);
				}
			});
	baseMgm.getData("select uids,equid,equno,wareno,waretype from equ_warehouse where pid='"
					+ CURRENTAPPID + "' order by equid ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					for (var j = 0; j < typeArr.length; j++) {
						if (list[i][3] == typeArr[j][1])
							temp.push(typeArr[j][0]);
					}
					equWareArr.push(temp);
				}
			});
	// 领用单位
	appMgm.getCodeValue("领用单位", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					deptArray.push(temp);
				}
			});
	DWREngine.setAsync(true);

	var sbclColumns = [{
				name : 'outNo',
				type : 'string'
			}, {
				name : 'outDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'using',
				type : 'string'
			}, {
				name : 'fileid',
				type : 'string'
			}, {
				name : 'auditState',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'uids',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'treeuids',
				type : 'string'
			}, {
				name : 'recipientsUnit',
				type : 'string'
			}, {
				name : 'equid',
				type : 'string'
			}, {
				name : 'financialSubjects',
				type : 'string'
			}];

	var sbclSm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var sbclCm = new Ext.grid.ColumnModel([sbclSm, {
				id : 'outNo',
				header : '出库单号',
				dataIndex : 'outNo',
				align : 'center',
				width : 180
			}, {
				id : 'outDate',
				header : '出库日期',
				dataIndex : 'outDate',
				align : 'center',
				width : 80,
				renderer : formatDate
			}, {
				id : 'using',
				header : '领料用途',
				dataIndex : 'using',
				align : 'center',
				width : 180,
				renderer : function(v) {
					for (var i = 0; i < bdgArr.length; i++) {
						if (v == bdgArr[i][0])
							return bdgArr[i][1];
					}
				}
			}, {
				id : 'pid',
				header : 'PID',
				dataIndex : 'pid',
				hidden : true
			}, {
				id : 'uids',
				header : '主键',
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'treeuids',
				header : '设备合同分类树主键',
				dataIndex : 'treeuids',
				hidden : true
			}, {
				id : 'conid',
				header : '合同ID',
				dataIndex : 'conid',
				hidden : true
			}, {
				id : 'recipientsUnit',
				header : '领用单位',
				dataIndex : 'recipientsUnit',
				align : 'center',
				width : 150,
				renderer : function(v) {
					for (var i = 0; i < deptArray.length; i++) {
						if (v == deptArray[i][0])
							return deptArray[i][1];
					}
				}
			}, {
				id : 'equid',
				header : '仓库号',
				dataIndex : 'equid',
				align : 'center',
				width : 180,
				renderer : function(v) {
					var equid = "";
					for (var i = 0; i < equWareArr.length; i++) {
						if (v == equWareArr[i][1])
							return equWareArr[i][2] + " - " + equWareArr[i][1];
					}
				}
			}, {
				id : 'financialSubjects',
				header : '对应财务科目',
				dataIndex : 'financialSubjects',
				align : 'center',
				width : 220,
				renderer : function(v){
					for (var i=0;i<subjectArr.length;i++){
						if(subjectArr[i][0] == v){
							return subjectArr[i][1];
						}
					}
					return v;
				}
			}, {
				id : 'fileid',
				header : '出库单',
				dataIndex : 'fileid',
				renderer : function(v, m, r) {
					if (v != '') {
						return "<center><a href='" + BASE_PATH + "servlet/MainServlet?ac=downloadfile&fileid="
								+ v + "'><img src='" + BASE_PATH + "jsp/res/images/word.gif'></img></a></center>";
					} else {
						return "<img src='" + BASE_PATH
								+ "jsp/res/images/word_bw.gif'></img>";
					}
				},
				align : 'center',
				width : 90
			}, {
				id : 'fileid',
				header : '附件',
				dataIndex : 'fileid',
				renderer : filelistFn,
				align : 'center',
				width : 100
			}, {
				id : 'auditState',
				header : '稽核状态',
				dataIndex : 'auditState',
				width : 80,
				align : 'center',
				hidden : true,
				renderer : function(v) {
					var str = '未稽核';
					if (v == '1') {
						str = '已稽核';
					} else if (v == '2') {
						str = '撤销稽核';
					}
					return str;
				}
			}, {
				id : 'kks',
				header : 'KKS编码',
				dataIndex : 'kks',
				align : 'center',
				width : 180
			}, {
				id : 'userPart',
				header : '安装部位',
				dataIndex : 'userPart',
				align : 'center',
				width : 180
			}]);
	sbclCm.defaultSortable = true;

	sbclDs = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : '',
					business : business,
					method : listMethod,
					params : "pid ='" + CURRENTAPPID + "'"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'uids'
						}, sbclColumns),
				remoteSort : true,
				pruneModifiedRecords : true
			});

	sbclPanel = new Ext.grid.GridPanel({
				ds : sbclDs,
				cm : sbclCm,
				sm : sbclSm,
				border : true,
				region : 'center',
				header : false,
				autoScroll : true, // 自动出现滚动条
				tbar : ['<font color=#15428b><B>出库单信息<B></font>'],
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : pageSize,
					store : sbclDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});

	function formatDate(value) {
		return value && value instanceof Date ? value.dateFormat('Y-m-d') : value;
	};

	// 附件查看
	function filelistFn(v, m, r) {
		if (condiv == 'SB') {
			if (v == null || v == "")
				return '查看[0]';
			else
				return "<a href='javascript:viewTemplate(\"" + v + "\")' title='查看'>查看</a>";
		} else {
			var uidsStr = r.get('uids');
			var count = 0;
			var editable = false;
			DWREngine.setAsync(false);
			db2Json.selectData( "select count(file_lsh) as num from sgcc_attach_list where transaction_id='"
							+ uidsStr + "' and transaction_type='" + businessType + "'", function(jsonData) {
						var list = eval(jsonData);
						if (list != null) {
							count = list[0].num;
						}
					});
			DWREngine.setAsync(true);
			var downloadStr = "查看[" + count + "]";
			return '<div id="sidebar"><a href="javascript:showUploadWin(\'' + businessType + '\', ' + editable
					+ ', \'' + uidsStr + '\', \'' + '附件列表' + '\')">' + downloadStr + '</a></div>';
		}
	}

	/*********************************设备、材料合同投资完成end*******************************/

});

function viewTemplate(fileid) {
	window.open(MAIN_SERVLET + "?ac=downloadFile&fileid=" + fileid);
}

// 显示多附件的文件列表
function showUploadWin(businessType, editable, businessId, winTitle) {
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

	fileUploadUrl = CONTEXT_PATH + "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId=" + businessId;
	var fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='" + fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
}