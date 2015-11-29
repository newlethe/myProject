var btn_create, btn_delete, btn_grant
var deptId = ""
deptId = USERDEPTID
// 时间
var store_month, combox_month;

// 工资单类型
var salaryTypeCombo;

/* 打开工资单参数 */
var sjType, salaryType, hrSalaryMaster;

var userDs, userWin;

var label_state_no;
var label_state_yes;
var label_state_rollback;
var label_state_permit;

var selectUserIDs = "";// 工资单发放的人员信息
var templateUserIDs = "";// 模板人员信息

Ext.onReady(function() {
	var fm = Ext.form; // 包名简写（缩写）

	// 工资单类型
	var label_salaryType = new Ext.Toolbar.TextItem({
				text : "工资单类型："
			});
	salaryTypeSt = new Ext.data.SimpleStore({
				fields : ['value', 'text']
			})

	salaryTypeCombo = new Ext.form.ComboBox({
				name : 'salaryType',
				hiddenName : 'salaryType',
				fieldLabel : '工资单类型',
				valueField : 'value',
				displayField : 'text',
				mode : 'local',
				typeAhead : true,
				allowBlank : false,
				triggerAction : 'all',
				forceSelection : true,
				selectOnFocus : true,
				emptyText : '选择类型...',
				store : salaryTypeSt,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			});
	salaryTypeCombo.on('select', function(obj, record, idx) {
				salaryType = record.data.value;
				openXgrid();
			});

	// 时间 - 工资发放次数
	label_state_no = new Ext.Toolbar.TextItem({
				text : "<b><font color='red'>奖金未上报</font></b>"
			});

	label_state_yes = new Ext.Toolbar.TextItem({
				text : "<b><font color='green'>奖金已上报</font></b>"
			});

	label_state_rollback = new Ext.Toolbar.TextItem({
				text : "<b><font color='red'>奖金已退回</font></b>"
			});

	label_state_permit = new Ext.Toolbar.TextItem({
				text : "<b><font color='green'>奖金已批准</font></b>"
			});
	var label_month = new Ext.Toolbar.TextItem({
				text : "奖金："
			});

	store_month = new Ext.data.SimpleStore({
				fields : ['value', 'text']
			})

	combox_month = new Ext.form.ComboBox({
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
				value : sjType,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			});

	combox_month.on('select', function(obj, record, idx) {
				sjType = record.data.value
				reloadType(sjType);
			});

	// 新增
	btn_create = new Ext.Toolbar.Button({
				text : '新增',
				tooltip : '生成奖金',
				iconCls : 'x-btn-text-icon',
				icon : CONTEXT_PATH + '/jsp/res/images/icons/add.png',
				handler : create
			});

	var text_memo = new Ext.form.TextField({
				id : 'text_memo'
			});

	btn_grant = new Ext.Toolbar.Button({
				text : '上报',
				tooltip : '奖金上报',
				iconCls : 'x-btn-text-icon',
				icon : CONTEXT_PATH + '/jsp/res/images/icons/coins.png',
				disabled : true,
				handler : grant
			});

	btn_delete = new Ext.Toolbar.Button({
				text : '删除',
				tooltip : '删除当前选择时间工资数据',
				iconCls : 'x-btn-text-icon',
				icon : CONTEXT_PATH + '/jsp/res/images/icons/delete.png',
				disabled : true,
				handler : deleteFun
			});

	btn_changeUser = new Ext.Toolbar.Button({
				text : '选择员工',
				tooltip : '设置奖金表的发放员工信息',
				iconCls : 'x-btn-text-icon',
				icon : CONTEXT_PATH + '/jsp/res/images/shared/icons/group.png',
				handler : changeUserFun
			});

	var tbar = new Ext.Toolbar({
				items : [
						btn_create
						// ,btn_changeUser
						, btn_delete, '-', label_state_no, label_state_yes,
						label_state_rollback, label_state_permit, btn_grant,
						'-', label_month, combox_month
				// ,label_salaryType
				// ,salaryTypeCombo
				]
			});

	var xgridPanel = new Ext.Panel({
		region : 'center',
		layout : 'fit',
		border : false,
		html : '<iframe name="xgridFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});

	var contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				tbar : tbar,
				items : [xgridPanel]
			});

	// viewport--------------------------------------------------------------------------------------------------
	var viewport = new Ext.Viewport({
				layout : 'border',
				border : false,
				items : [contentPanel]
			});

	reloadSjCombo();

	// 选择员工【begin】---------------------------------------------------------------------------------------
	var root, treeLoader
	var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=tree&unitType=2`9";
	var userBean = "com.sgepit.pmis.rlzj.hbm.HrManInfo";

	root = new Ext.tree.AsyncTreeNode({
				text : defaultOrgRootName,
				id : defaultOrgRootId,
				expanded : true
			});
	treeLoader = new Ext.tree.TreeLoader({
				dataUrl : treeNodeUrl + "&parentId=" + defaultOrgRootId
						+ "&treeName=HrManOrgTree",
				requestMethod : "GET"
			})

	treePanel = new Ext.tree.TreePanel({
				id : 'orgs-tree',
				region : 'west',
				border : false,
				split : true,
				width : 196,
				minSize : 175,
				maxSize : 500,
				frame : false,
				layout : 'accordion',
				rootVisible : true,
				lines : false,
				autoScroll : true,
				collapsible : true,
				animCollapse : false,
				animate : false,
				collapseMode : 'mini',
				tbar : [{
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
						}],
				loader : treeLoader,
				root : root,
				collapseFirst : false
			});
	treePanel.on('beforeload', function(node) {
				treePanel.loader.dataUrl = treeNodeUrl + "&parentId=" + node.id
						+ "&treeName=HrManOrgTree";
			});

	treePanel.on('click', function(node, e) {
				e.stopEvent();
				var titles = [node.text];
				var obj = node.parentNode;
				while (obj != null) {
					titles.push(obj.text);
					obj = obj.parentNode;
				}
				selectedOrgId = node.id
				selectedOrgName = node.text
				var paramStrCur = "posid='" + node.id + "'";
				if (selectedOrgId == defaultOrgRootId)
					paramStrCur = "";
				userDs.baseParams.params = paramStrCur;
				userDs.load({
							params : {
								start : 0,
								limit : 20
							}
						});
			});

	var userSm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false
			});
	var userCm = new Ext.grid.ColumnModel([userSm, {
		id : 'userid',
		header : '主键',
		dataIndex : 'userid',
		hidden : true,
		renderer : function(val, m, rec, rowIndex) {
			if (selectUserIDs != ""
					&& selectUserIDs.indexOf("`" + val + "`") > -1) {
				userSm.selectRow(rowIndex, true);
			}
			return val;
		}
	}, {
		id : 'username',
		header : '用户名',
		dataIndex : 'username',
		hidden : true
	}, {
		id : 'realname',
		header : '用户姓名',
		dataIndex : 'realname'
	}, {
		id : 'posid',
		header : '部门或岗位',
		dataIndex : 'posid',
		hidden : true
	}, {
		id : 'posname',
		header : '部门或岗位',
		dataIndex : 'posname'
	}, {
		id : 'sex',
		header : '性别',
		dataIndex : 'sex',
		renderer : function(value) {
			if (value != "")
				return value == '0'
						? "<img src='jsp/res/images/shared/icons/user_suit.gif'>"
						: "<img src='jsp/res/images/shared/icons/user_female.gif'>";
			else
				return value;
		}
	}]);
	userCm.defaultSortable = true;

	var userColumns = [{
				name : 'userid',
				type : 'string'
			}, {
				name : 'username',
				type : 'string'
			}, {
				name : 'realname',
				type : 'string'
			}, {
				name : 'posid',
				type : 'string'
			}, {
				name : 'posname',
				type : 'string'
			}, {
				name : 'sex',
				type : 'string'
			}];

	userDs = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : userBean,
					business : "baseMgm",
					method : 'findWhereOrderBy',
					params : ''
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'userid'
						}, userColumns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	userDs.setDefaultSort('userid', 'desc');

	var userPanel = new Ext.grid.GridPanel({
				ds : userDs,
				cm : userCm,
				sm : userSm,
				border : false,
				region : 'center',
				layout : 'accordion',
				header : false,
				autoScroll : true,
				loadMask : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({
							pageSize : PAGE_SIZE,
							store : userDs,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录。"
						}),
				width : 200
			});

	// 选中工资发放员工
	userSm.on('rowselect', function(sm, rowIndex, rec) {
				rlzyXcglMgm.addDetailData(rec.data.userid, hrSalaryMaster,
						function(rtn) {
						});
			});

	// 删除工资发放员工
	userSm.on('rowdeselect', function(sm, rowIndex, rec) {
				rlzyXcglMgm.deleteDetailData(rec.data.userid,
						hrSalaryMaster.uids, function(rtn) {
						});
			});

	userWin = new Ext.Window({
				title : '选择用户',
				iconCls : 'form',
				layout : 'border',
				width : 600,
				height : 500,
				modal : true,
				closeAction : 'hide',
				maximizable : true,
				plain : true,
				items : [treePanel, userPanel]
			});

	userWin.on('hide', function() {
				openXgrid();
			});
		// 选择员工 【end】--------------------------------------------------

});

function reloadType(sj) {
	var sql1 = "select distinct uids as value, name as text from hr_salary_type where uids in (select distinct salary_type from hr_salary_master where sj_type='"
			+ sj + "')";
	// var sql1 = "select distinct uids as value, name as text from
	// hr_salary_type where uids in(select salary_type from hr_salary_master
	// where sj_type in (select max(sj_type) from hr_salary_master where
	// salary_type ='BONUS'))"
	db2Json.selectSimpleData(sql1, function(dat) {
				if (dat != '[]' && dat != '') {
					var data = eval(dat);
					salaryTypeSt.loadData(data)
					// salaryTypeCombo.setValue(data[0][0])
					salaryType = 'BONUS'
					openXgrid();
				} else {
					create();
				}
			});
}

function reloadSjCombo() {
	var sql = "select distinct sj_type as value, substr(sj_type, 0, 4)||'年'||substr(sj_type, 5, 2)||'月'||substr(sj_type, 7, 2)||'次' as text from hr_salary_master where salary_type ='BONUS' and unit_id='"
			+ USERDEPTID + "' order by sj_type desc";
	db2Json.selectSimpleData(sql, function(dat) {
				if (dat != '[]' && dat != '') {
					var data = eval(dat);
					store_month.loadData(data)
					combox_month.setValue(data[0][0])
					sjType = combox_month.getValue();
					reloadType(sjType);
				} else {
					alert("没有任何奖金表信息，请新增奖金表！")
					create();
				}
			});
}

// 新增奖金
function create() {
	// var style =
	// "dialogWidth:950px;dialogHeight:550px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
	// var url =
	// CONTEXT_PATH+"/Business/rlzy/salary/rlzy.salary.input.master.form.jsp"
	// var rtn = window.showModalDialog(encodeURI(url), null, style);
	var url = BASE_PATH
			+ "Business/rlzy/bonus/rlzy.bonus.input.master.form.jsp";
	window.location.href = url;
	// if(rtn!=null && rtn.length>0){
	// reloadSjCombo();
	// }
}

// 打开奖金报表
function openXgrid() {
	var saveable = "true";
	DWREngine.setAsync(false);
	rlzyXcglMgm.getSalaryMaster(deptId, sjType, salaryType, CURRENTAPPID, function(master) {
				if (master != null) {
					hrSalaryMaster = master;
					saveable = (master.state == '1'||master.state == '3') ? false : true;
					checkButton(master.state);
					var xgridUrl = CONTEXT_PATH
							+ "/Business/rlzy/salary/xgrid.jsp?templateId="
							+ master.templateId + "&sjType=" + sjType
							+ "&reportId=" + master.uids + "&saveable="
							+ saveable;
					document.all.xgridFrame.src = xgridUrl;
				} else {
					alert("打开奖金表出错！")
				}
			});
	DWREngine.setAsync(true);
}

// 根据工资单的发放状态切换按钮状态；
function checkButton(status) {

	if (status == '0') {// 未上报
		btn_grant.enable()
		btn_delete.enable()
		btn_changeUser.enable()
		label_state_no.show();
		label_state_yes.hide();
		label_state_rollback.hide();
		label_state_permit.hide();
	} else if (status == '1' || status == '3') {// 已上报或批准
		btn_grant.disable()
		btn_delete.disable()
		btn_changeUser.disable()
		if (status == '1') {
			label_state_rollback.hide();
			label_state_permit.hide();
			label_state_no.hide();
			label_state_yes.show();
		} else if (status == '3') {
			label_state_rollback.hide();
			label_state_permit.show();
			label_state_no.hide();
			label_state_yes.hide();
		}

	}

	else if (status == '2') {// 退回
		btn_grant.enable() 
		btn_delete.disable()
		btn_changeUser.enable() 
		label_state_rollback.show();
		label_state_permit.hide();
		label_state_no.hide();
		label_state_yes.hide();
	}

}

// 删除工资单
function deleteFun() {
	Ext.MessageBox.confirm('提示', '是否确定删除当前时间所有奖金数据？', function(btn) {
				if (btn == "yes") {
					DWREngine.setAsync(false);
					rlzyXcglMgm.deleteSalaryMaster(deptId, sjType, salaryType, CURRENTAPPID,
							function(obj) {
								if (obj == 'OK') {
									reloadSjCombo();
								} else {
									alert("删除失败！");
								}
							});
					DWREngine.setAsync(true);
				}
			});
}

// 工资发放
function grant() {
	Ext.Msg.confirm('提示', '上报之后数据将不能修改，确认上报本次奖金报表？', function(btn, text) {
				if (btn == 'ok' || btn == 'yes') {
					hrSalaryMaster.sendTime = new Date()
					hrSalaryMaster.sendUserId = USERID
					hrSalaryMaster.state = '1'  
					DWREngine.setAsync(false); 
					rlzyXcglMgm.updateSalaryMaster(hrSalaryMaster,
							function(obj) {
								if (obj == "OK") {
									alert('上报成功！')
									openXgrid();
								} else {
									alert('上报失败！')
								}
							});
					DWREngine.setAsync(true);

				}
			});

}

// 设置工资单发放人员
function changeUserFun() {
	DWREngine.setAsync(false);
	rlzyXcglMgm.getSalaryUserByReportId(hrSalaryMaster.uids, function(rtn) {
				if (rtn == "") {
				} else {
					selectUserIDs = "`" + rtn + "`";
				}
				userDs.baseParams.params = "";
				userDs.load({
							params : {
								start : 0,
								limit : 20
							}
						});
				userWin.show();
			});
	DWREngine.setAsync(true);
}
