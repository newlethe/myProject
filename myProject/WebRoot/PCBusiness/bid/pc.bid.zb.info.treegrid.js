var treePanel, store;
var data;
var treeTitle = '招标详细信息';
var bean = "com.sgepit.pcmis.bid.hbm.PcBidZbApplyTreeView";
var currentPid = CURRENTAPPID;
var bidApplyBusinessType = "PCBidApplyReport";

var pbWayArr = new Array();
var agencyNameArr = new Array();

Ext.onReady(function() {

	DWREngine.setAsync(false);
	appMgm.getCodeValue('评标方法', function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			pbWayArr.push(temp);
		}
	});
	
	appMgm.getCodeValue('招标代理机构', function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			agencyNameArr.push(temp);
		}
	});
	
	
	DWREngine.setAsync(true);
	
	var fc = {
		'uids' : {
			name : 'uids',
			fieldLabel : '主键'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
		},
		'treeid' : {
			name : 'treeid',
			fieldLabel : '节点编号'
		},
		'parentid' : {
			name : 'parentid',
			fieldLabel : '父节点编号'
		},
		'isleaf' : {
			name : 'isleaf',
			fieldLabel : '叶子节点'
		},
		'zbName' : {
			name : 'zbName',
			fieldLabel : '招标项目/招标内容'
		},
		'startDate' : {
			name : 'startDate',
			fieldLabel : '招标时间'
		},
		'pbWays' : {
			name : 'pbWays',
			fieldLabel : '评标方法'
		},
		'tbUnit' : {
			name : 'tbUnit',
			fieldLabel : '中标单位'
		},
		'tbPrice' : {
			name : 'tbPrice',
			fieldLabel : '中标价格（万元）'
		},
		'agencyName' : {
			name : 'agencyName',
			fieldLabel : '招标代理机构'
		}
	};

	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
		autoLoad : true,
		leaf_field_name : 'isleaf',// 是否叶子节点字段
		parent_id_field_name : 'parentid',// 树节点关联父节点字段
		url : MAIN_SERVLET,
		baseParams : {
			ac : 'list',
			method : 'getPcBidZbApplyTree',// 后台java代码的业务逻辑方法定义
			business : 'pcBidService',// spring 管理的bean定义
			bean : bean,// gridtree展示的bean
			params : 'parentid' + SPLITB + '0' + SPLITB// 查询条件
		},
		reader : new Ext.data.JsonReader({
			id : 'uids',
			root : 'topics',
			totalProperty : 'totalCount',
			fields : ["uids", "pid", "parentid",
				"treeid", "isleaf", "zbName",
				"startDate", "pbWays", "tbUnit",
				"tbPrice", "agencyName"]
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
				ds.baseParams.params = "pid" + SPLITB + currentPid
					+ ";parentid" + SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
			}
		}
	});

	treePanel = new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		store : store,
		master_column_id : 'zbName',// 定义设置哪一个数据项为展开定义
		autoScroll : true,
		region : 'center',
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		frame : false,
		collapsible : false,
		animCollapse : false,
		border : true,
		stripeRows : true,
		rootVisible: false,
		title : '', // 设置标题
		tbar : ['<font color=#15428b><b>&nbsp;' + treeTitle + '</b></font>'],
		border : false,
		lines : true,
		autoScroll : true,
		animate : false,
		columns : [{
			id : 'uids',
			header : fc['uids'].fieldLabel,
			dataIndex : fc['uids'].name,
			hidden : true
		}, {
			id : 'pid',
			header : fc['pid'].fieldLabel,
			dataIndex : fc['pid'].name,
			hidden : true
		}, {
			id : 'treeid',
			header : fc['treeid'].fieldLabel,
			dataIndex : fc['treeid'].name,
			hidden : true
		}, {
			id : 'parentid',
			header : fc['parentid'].fieldLabel,
			dataIndex : fc['parentid'].name,
			hidden : true
		}, {
			id : 'isleaf',
			header : fc['isleaf'].fieldLabel,
			dataIndex : fc['isleaf'].name,
			hidden : true
		}, {
			id : 'zbName',
			header : fc['zbName'].fieldLabel,
			dataIndex : fc['zbName'].name,
			width : 240
		}, {
			id : 'startDate',
			header : fc['startDate'].fieldLabel,
			dataIndex : fc['startDate'].name,
			align : 'center',
			width : 70,
			renderer : formatDate
		}, {
			id : 'applyReport',
			header : '申请报告',
			dataIndex : 'applyReport',
			align : 'center',
			width : 40,
			renderer : function(value, metadata, record) {
				var count = 0;
				var uids = record.data.uids;
				var parentid = record.data.parentid;
				if (parentid != '0'){
					uids = parentid;
				}
				DWREngine.setAsync(false);
				db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"
						+ uids + "' and transaction_type='" + bidApplyBusinessType + "'", function(jsonData) {
					var list = eval(jsonData);
					if (list != null) {
						count = list[0].num;
					}
				});
				DWREngine.setAsync(true);
				var downloadStr = "查看[" + count + "]";
				return '<a href="javascript:showUploadWin(\'' + bidApplyBusinessType
						+ '\', false, \'' + uids + '\')">' + downloadStr + '</a>';
			}
		}, {
			id : 'zbFile',
			header : '招标文件',
			dataIndex : 'zbFile',
			align : 'center',
			width : 40,
			renderer : function(value, metadata, record) {
				var count = 0;
				var uids = record.data.uids;
				var parentid = record.data.parentid;
				if (parentid != '0'){
					var progressUids = "";
					DWREngine.setAsync(false);
					db2Json.selectData("select t.uids from pc_bid_progress t where content_uids='" + uids
							+ "' and progress_Type='TbSendZbDoc'", function(jsonData){
						var list = eval(jsonData);
						if (list != null && list[0] && list[0].uids) {
							progressUids = list[0].uids;
						}
					});
					db2Json.selectData("select count(FILE_LSH) as count from SGCC_ATTACH_LIST where " +
							"transaction_Type='PcBidProgress' and transaction_Id='" + progressUids + "'", function(jsonData) {
						var list = eval(jsonData);
						if (list != null && list[0].count > 0) {
							count = list[0].count;
						}
					});
					DWREngine.setAsync(true);
					var downloadStr = "查看[" + count + "]";
					return '<a href="javascript:getFjValue(\'' + progressUids + '\',\'zbFile\')">' + downloadStr + '</a>';
				}
			}
		}, {
			id : 'pbFile',
			header : '评标报告',
			dataIndex : 'pbFile',
			align : 'center',
			width : 40,
			renderer : function(value, metadata, record) {
				var count = 0;
				var uids = record.data.uids;
				var parentid = record.data.parentid;
				if (parentid != '0'){
					var progressUids = "";
					DWREngine.setAsync(false);
					db2Json.selectData("select t.uids from pc_bid_progress t where content_uids='" + uids
							+ "' and progress_Type='BidAssess'", function(jsonData){
						var list = eval(jsonData);
						if (list != null && list[0] && list[0].uids) {
							progressUids = list[0].uids;
						}
					});
					db2Json.selectData("select count(FILE_LSH) as count from SGCC_ATTACH_LIST where " +
							"transaction_Type='PCBidAssessReport' and transaction_Id='" + progressUids + "'", function(jsonData) {
						var list = eval(jsonData);
						if (list != null && list[0].count > 0) {
							count = list[0].count;
						}
					});
					DWREngine.setAsync(true);
					var downloadStr = "查看[" + count + "]";
					return '<a href="javascript:getFjValue(\'' + progressUids + '\',\'pbFile\')">' + downloadStr + '</a>';
				}
			}
		}, {
			id : 'pbWays',
			header : fc['pbWays'].fieldLabel,
			dataIndex : fc['pbWays'].name,
			width : 120,
			renderer : function(v){
				var str = "";
				if (v){
					for (var i=0; i<pbWayArr.length; i++){
						if (pbWayArr[i][0]==v){
							str = pbWayArr[i][1];
							break;
						}
					}
				}
				return str;
			}
		}, {
			id : 'tbUnit',
			header : fc['tbUnit'].fieldLabel,
			dataIndex : fc['tbUnit'].name,
			width : 160
		}, {
			id : 'tbPrice',
			header : fc['tbPrice'].fieldLabel,
			dataIndex : fc['tbPrice'].name,
			align : 'right',
			width : 80
		}, {
			id : 'agencyName',
			header : fc['agencyName'].fieldLabel,
			dataIndex : fc['agencyName'].name,
			width : 120,
			renderer : function(v){
				var str = "";
				if (v){
					for (var i=0; i<agencyNameArr.length; i++){
						if (agencyNameArr[i][0]==v){
							str = agencyNameArr[i][1];
							break;
						}
					}
				}
				return str;
			}
		}]
	});

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel]
	});

	function formatDate(value){
		return value ? value.substring(0, 10) : '';
    };

});

/*设置评标报告与其他附件的查看上传状态*/
function getFjValue(uids,type){
	var fjtbean="com.sgepit.pcmis.bid.hbm.PcBidProgress";
	var businessType = "PcBidProgress";
	if (type == 'pbFile'){
		businessType = "PCBidAssessReport";
	}
	if (uids == null || uids == ''){
		return;
	}
	showUploadWin(businessType, false, uids, '招标进度附件', fjtbean);
}

function showUploadWin(businessType, editable, businessId, winTitle,beanName) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
			title : '上传文件',
			msg : '请先保存记录再进行上传！',
			buttons : Ext.Msg.OK,
			icon : Ext.MessageBox.WARNING
		});
		return;
	}

	var title = '查看文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId=" + businessId;
	if (beanName){
		fileUploadUrl += "&beanName="+beanName
	}
	fileWin = new Ext.Window({
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