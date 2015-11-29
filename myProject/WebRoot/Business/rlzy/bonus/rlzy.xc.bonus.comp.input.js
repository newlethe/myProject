var nowDate = new Date();
var nowYear = nowDate.getYear();
var nowMonth = nowDate.getMonth() + 1;
var nowSj = nowYear + ((nowMonth < 10) ? '0' : '') + nowMonth + '01'
var nowSjDesc = nowYear + '年' + (((nowMonth < 10) ? '0' : '') + nowMonth) + '月'
		+ '01次'
var months = new Array(), data_sj = new Array()
var combox_month, combox_sj, store_month, store_sj, xcBonus
var uids = "", deptId = USERDEPTID, template_id
var selectedTreeGridNode, selectedTreeGridParentNode, treeLoader, root
var contentPanel, gridPanel, xgridPanel
var label_month, label_bm, label_user, label_state, btn_switch, tbar
var xGridUrl = "";
var unitIds = new Array();
var unitid=USERBELONGUNITID;
var upunit=USERBELONGUNITID;
var treeLoaderURL="";
Ext.onReady(function() {
		 	if(USERBELONGUNITTYPEID=='A'){//项目单位的情况
          		DWREngine.setAsync(false);
          		db2Json.selectData("select unitid,upunit,unitname from sgcc_ini_unit where unitid='"+USERBELONGUNITID+"'", function (jsonData) {
	      		var list = eval(jsonData);
	      		if(list!=null){
	        		  upunit=list[0].upunit;
	     		 }  
	      	 });
	      		 DWREngine.setAsync(true);
        	}
       treeLoaderURL = BASE_PATH + 'servlet/RlzyServlet'
		+ '?ac=getBonusGridNewTree' + '&sjType=' + nowSj+'&userBelongUnitid='+upunit+'&pid='+CURRENTAPPID+'&deptId='+unitid;
	var fm = Ext.form; // 包名简写（缩写）
	DWREngine.setAsync(false);
	rlzyXcglMgm.getSjTypeListFromSalaryMaster(deptId, "BONUS",CURRENTAPPID,function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].toString());
					temp.push(list[i].toString().substring(0, 4) + '年'
							+ list[i].toString().substring(4, 6) + '月'
							+ list[i].toString().substring(6, 8) + '次');
					months.push(temp);
				}
			});
	DWREngine.setAsync(true);

	// 部门，填写人，也需要像状态那么处理，显示数据相应的部门、填写人、状态，待处理
	label_bm = new Ext.Toolbar.Item(document.all.toolbarDeptName);// {text:"部门："+(USERORG==""?UNITNAME:USERORG)});
	label_month = new Ext.Toolbar.TextItem({
				text : "奖金月份：",
				id : "monthLabelId"
			});
	label_user = new Ext.Toolbar.Item(document.all.toolbarUserName);// {text:"填写人："+REALNAME});
	label_state = new Ext.Toolbar.Item(document.all.toolbarStatus);

	store_month = new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : months
			})
	combox_month = new Ext.form.ComboBox({
				id : "selectSjId",
				name : 'selectSj',
				hiddenName : 'selectSj',
				fieldLabel : '时间',
				valueField : 'value',
				displayField : 'text',
				mode : 'local',
				typeAhead : true,
				allowBlank : false,
				triggerAction : 'all',
				forceSelection : true,
				selectOnFocus : true,
				emptyText : '选择时间...',
				store : store_month,
				value : nowSj,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '100%'
			});
	combox_month.on('select', function(obj, record, idx) {
				nowSj = record.data.value
				findXcBonusM("query")
	/*			if (!findXcBonusM("query")) {
					alert('没有数据')
				} else { 
					if (xcBonus.uids != null)
						uids = xcBonus.uids
					if (xcBonus.deptId != null)
						deptId = xcBonus.deptId
					if (xcBonus.state != null)
						setStatus(xcBonus.state)
					if (xcBonus.template_id != null)
						template_id = xcBonus.template_id;*/
					loadTreeGrid()
					if (contentPanel.getActiveTab().getId() != 'tab_list') {
						openGrid(xcBonus.uids, xcBonus.deptId, combox_month.getValue(),
								 xcBonus.template_id);
					}

			//	}
			});
	combox_month.setValue(nowSjDesc);

	for (y = nowYear; y >= nowYear - 1; y--) {
		for (m = 12; m >= 1; m--) {
			var temp = new Array();
			var flag = true;
			for (i = 0; i < months.length; i++) {
				if (months[i][0].toString() == y + ''
						+ (((m < 10) ? '0' : '') + m)) {
					flag = false;
					break;
				}
			}
			if (flag) {
				temp.push(y + '' + (((m < 10) ? '0' : '') + m));
				temp.push(y + '年' + (((m < 10) ? '0' : '') + m) + '月');
				data_sj.push(temp);
			}
		}
	}

	btn_switch = new Ext.Toolbar.Button({
				text : '返回',// '切换',
				tooltip : '返回列表查看',// '切换到部门列表或具体奖金数据',
				iconCls : 'pagePrev',
				// disabled: true,
				handler : switchTab
			});

	tbar = new Ext.Toolbar({
				items : ['-', label_month, combox_month, '->', label_bm,
						label_user, label_state, btn_switch,
						'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;']
			});

	// --------------------------------------------------------------
	root = new Ext.tree.TreeNode({
				text : 'root'
			})
	treeLoader = new Ext.tree.TreeLoader({
				url : treeLoaderURL,
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});
	treePanel = new Ext.tree.ColumnTree({
		id : 'modules-tree-panel',
		iconCls : 'icon-by-category',
		// region:'center',
		region : 'treegrid',
		frame : false,
		border : false,
		height : 800,
		autoScroll : true,
		rootVisible : false,
		tbar : [{
					iconCls : 'icon-expand-all',
					tooltip : 'Expand All',
					handler : function() {
						root.expand(true);
					}
				}, '-', {
					iconCls : 'icon-collapse-all',
					tooltip : 'Collapse All',
					handler : function() {
						root.collapse(true);
					}
				}],
		columns : [{
					header : '单位名称',
					width : 240,
					dataIndex : 'unitname',
					search : true
				}, {
					header : '单位ID',
					width : 0,
					dataIndex : 'id',
					search : true
				}, {
					header : '奖金流水号',
					width : 0,
					dataIndex : 'uids',
					search : true
				}, {
					header : '标题',
					width : 360,
					dataIndex : 'title',
					search : true,
					renderer : function(vl, n, a) {
						if ( a['state'] != null && a['state'] != '1'
								&& a['state'] != '3') {
							return vl;
						}
						else if(a['state']==null&&a['id']!=upunit){
							return vl;
						}
						else {
							var rootId=a['id'];	
							if(rootId==upunit){
							return "<u title='"
							+ vl
							+ "' onclick=openGridByRoot('"
							+ a['uids']
							+ "','"
							+ a['deptId']  
							+ "','"
							+ nowSj
							+ "','"
							+ a['template_id']
							+ "') style='color:blue;text-decoration:underline'>"
							+ vl + "</u>";
							}
							// status为1或status为3时才会有超链接,即状态为已上报或已批准时才有超链接
							else{
								var rootId=a['deptId'];					
								return "<u title='"
								+ vl
								+ "' onclick=openGrid('"
								+ a['uids']
								+ "','"
								+ a['deptId']
								+ "','"
								+ combox_month.getValue()
								+ "','"
								+ a['template_id']
								+ "') style='color:blue;text-decoration:underline'>"
								+ vl + "</u>";
		
							}

							
						}
					}
				}, {
					header : '单位部门',
					width : 0,
					dataIndex : 'deptId',
					align : 'center',
					search : true
				}, {
					header : '模板id',
					width : 0,
					dataIndex : 'template_id',
					align : 'center',
					search : true
				}, {
					header : '状态',
					width : 150,
					dataIndex : 'state',
					align : 'center',
					search : true,
					renderer : function(value, n, a) {
						//alert(value);
						if (value == null || value == '0')
							return '<font color=gray>未上报</font>'
						else if (value == '1')
							return '<B><font color=green>已上报</font></B>&nbsp;&nbsp;<u onclick=uploadById(\''
									+ a['uids']
									+ '\',\'2\')  style=\'color:red\'>退回</u>&nbsp;&nbsp;<u onclick=permit(\''
									+ a['uids']
									+ '\',\'3\') style=\'color:blue\'>批准</u>'
						else if (value == '2') 
							return '<B><font color=blue>已退回</font></B>' 
						else if (value == '3')
							return '<B><font color=blue>已批准</font></B>'

					}
				}, {
					header : '流程状态',
					width : 0,
					dataIndex : 'send_state',
					align : 'center',
					search : true,
					renderer : function(value) {
					}
				}, {
					header : '上报时间',
					width : 175,
					dataIndex : 'send_time',
					align : 'center',
					search : true
				}, {
					header : '上报人',
					width : 0,
					dataIndex : 'username',
					align : 'center',
					search : true
				}],
		loader : treeLoader,
		root : root
	});
	treePanel.on("beforeclick", nodeBeforeClick);
	function nodeBeforeClick(node, e) {
		// 对树的相当于是rowSelect
		uids = node.attributes['uids'];
		deptId = node.attributes['deptId'];// 在树的rowSelect的时候给全局deptId重新赋值
		state = node.attributes['state'];
		unitname = node.attributes['unitname'];
		username = node.attributes['username'];
		username = (username==null||username=="")?"无":username;
		setLabels(unitname, username, node.attributes['state']);
		findXcBonusM("query")
	}
	// ------------------------------------------------------------------------------
	gridPanel = new Ext.Panel({
				id : 'tab_list',
				layout : 'fit',
				items : treePanel
			});

	gridPanel.on('activate', onSwitchTabs)
	xgridPanel = new Ext.Panel({
		id : 'tab_xgrid',
		layout : 'fit',
		frame : true,
		html : '<iframe name="gridFrame" id="gridFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'

	});
	xgridPanel.on('activate', onSwitchTabs)
	contentPanel = new Ext.TabPanel({
				id : 'content',
				renderTo : "center",
				region : 'center',
				iconCls : 'icon-by-category',
				border : false,
				tbar : tbar,
				frame : true,
				tabPosition : 'buttom',
				defaults : {
					autoScroll : true
				},
				activeTab : 0,
				items : [gridPanel, xgridPanel]
			});

	// viewport--------------------------------------------------------------------------------------------------
	var viewport = new Ext.Viewport({
				// layout:'fit',
				layout : 'border',
				items : [contentPanel]
			});
	// viewport--------------------------------------------------------------------------------------------------
	treePanel.render();
	treeLoader.on('load', function() {
		root.expand(true);
		root.collapse(true);
		root.expand(false, true, function() {

					for (var index = 0; index < root.childNodes.length; index++) {
						root.childNodes[index].expand()
					}

				})
	})
	treePanel.expand()
	loadTreeGrid()
	// 加载数据--------------------------------------------------------------------------------------------------

	// 自定方法--------------------------------------------------------------------------------------------------
	findXcBonusM("query");
});
// 自定方法--------------------------------------------------------------------------------------------------
function onSwitchTabs(tab) {
	if (tab.id == 'tab_list') {
			Ext.getCmp("selectSjId").setVisible(true);
	     	label_month.setVisible(true);
		btn_switch.hide()
	} else {
		btn_switch.show()
	}
}
function switchTab() {
				Ext.getCmp("selectSjId").enable();
				label_month.setVisible(true);
	if (contentPanel.getActiveTab().getId() == 'tab_list') {
		label_month.setVisible(true);
		btn_switch.hide()
		contentPanel.setActiveTab(xgridPanel)
		// openGrid()
	} else {
	
		btn_switch.show()
		contentPanel.setActiveTab(gridPanel)
	}
}
function loadTreeGrid() {
	 treeLoaderURL = BASE_PATH + 'servlet/RlzyServlet'
		+ '?ac=getBonusGridNewTree' + '&sjType=' + nowSj+'&userBelongUnitid='+upunit+'&pid='+CURRENTAPPID+'&deptId='+unitid;
	treeLoader.url = treeLoaderURL;
	treeLoader.load(treePanel.getRootNode(), function() {
				//while (root.childNodes.length > 1) {
				//	root.firstChild.remove()
				//}
			})
}
function findXcBonusM(type) {
	var rtn = false;
	DWREngine.setAsync(false);
	var salary_type = "BONUS";
	rlzyXcglMgm.getSalaryMaster(deptId, nowSj, salary_type,CURRENTAPPID,function(obj) {
				var state = '1' 
				if (obj != null && obj.uids != null) {
					xcBonus = obj
					state = obj.state == null ? '1' : obj.state
					nowSj = obj.sjType == null ? '' : obj.sjType
					rtn = true
				} else {
					rtn = false
				}
			});
	DWREngine.setAsync(true);
	return rtn
}
function uploadById(uids, state) {
    var rtn = false;
	Ext.Msg.confirm('提示', '确认退回吗？', function(btn, text) {
				if (btn == 'ok' || btn == 'yes') {
					xcBonus.state = state
					xcBonus.uids = uids;
					xcBonus.send_state = '1';
					xcBonus.pid=CURRENTAPPID;
					DWREngine.setAsync(false);
					rlzyXcglMgm.updateSalaryMaster(xcBonus, function(obj) {
								if (obj == "OK") {
									setStatus(state)
									treeLoader.load(treePanel.getRootNode(),
											function() {
/*												while (root.childNodes.length > 1) {
													root.firstChild.remove()
												}*/
											})
									rtn = true
								}
							});
					DWREngine.setAsync(true);
				}
			});
	return rtn
}
function permit(uids, state) {
	Ext.Msg.confirm('提示', '一旦批准无法修改，确认批准吗？', function(btn, text) {
				if (btn == 'ok' || btn == 'yes') {
					xcBonus.state = '3'
					xcBonus.uids = uids;
					xcBonus.send_state = '1';
					xcBonus.pid=CURRENTAPPID;
					rlzyXcglMgm.updateSalaryMaster(xcBonus, function(rtn) {
								if (rtn == "OK") {
									setStatus(xcBonus.state)
									treeLoader.load(treePanel.getRootNode(),
											function() {
/*												while (root.childNodes.length > 1) {
													root.firstChild.remove()
												}*/
											})
								} else {
									alert('有错误')
								}
							});
				}
			});
}

function setStatus(state) {
	var statusDesc = '';
	if (state == null || state == '0') {
		statusDesc = '未上报';      
	} else if (state == '1') {
		statusDesc = '已上报';
	} else if (state == '2') {
		statusDesc = '已退回';
	} else if (state == '3') {
		statusDesc = '已批准';
	} else {
		statusDesc = '已退回';
	} 
	document.all.toolbarStatus.value =('状态：' + statusDesc)
}

function setLabels(unitname, username, state) {
	setStatus(state)
	document.all.toolbarDeptName.value = "部门：" + unitname;
	document.all.toolbarUserName.value = ("填写人：" + username)
}

function openGrid(_uids, _deptId, _startSj, template_id) {//非根节点页面
	Ext.getCmp("selectSjId").setDisabled(true);
	label_month.setVisible(true);
	var startSj;
	startSj = _startSj;
	xGridUrl = CONTEXT_PATH + "/Business/rlzy/salary/xgrid.jsp?templateId="
			+ template_id + "&reportId=" + _uids;
	xGridUrl += "&sjType=" + startSj;
	contentPanel.setActiveTab(xgridPanel)
	document.all.gridFrame.src = xGridUrl;
}

DWREngine.setAsync(false); // 设置为同步
var sql = "select unitid from sgcc_ini_unit where (unit_type_id = '8') order by unitid asc";
baseMgm.getData(sql, function(dat) {
	for (i = 0; i < dat.length; i++) { 
		unitIds.push(dat[i]);
	}
}); 
DWREngine.setAsync(true); // 重新设置为异步

function openGridByRoot(_uids, _deptId, _startSj, template_id) {//根节点汇总页面
	Ext.getCmp("selectSjId").setDisabled(true);
	label_month.setVisible(true);
	var startSj;
	startSj = _startSj;
	
	xGridUrl = CONTEXT_PATH + "/Business/rlzy/bonus/rlzy.bonus.statistic.query.xgrid.jsp?unitIds="
			+ unitIds;
	xGridUrl += "&sjType=" + startSj;  
	contentPanel.setActiveTab(xgridPanel)
	document.all.gridFrame.src = xGridUrl; 
} 
