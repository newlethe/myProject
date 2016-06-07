var importedUserArr; // 要导入的所有用户数组
var importUserStore;
var importUserGrid;
var importUserList;

var colModel = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
		{
			id : 'useraccount',
			header : '用户名',
			dataIndex : 'useraccount',
			width : 120

		}, {
			id : 'realname',
			header : '用户姓名',
			dataIndex : 'realname',
			width : 120
		}, {
			id : 'sex',
			header : '性别',
			dataIndex : 'sex',
			width : 60,
			renderer : function(value) {
				if (value != "")
					return value == '0' ? '男' : '女';
				else
					return value;
			}
		}, {
			id : 'unitid',
			header : '所在公司',
			dataIndex : 'unitid',
			width : 150,
			hidden : true,
			renderer : showDeptOrPosNameFun
		}, {
			id : 'posid',
			header : '部门或岗位',
			dataIndex : 'posid',
			renderer : showDeptOrPosNameFun,
			width : 100

		}, {
			id : 'email',
			header : 'HR同步信息',
			dataIndex : 'email',
			width : 350
		}]);

var store = new Ext.data.Store({
			reader : new Ext.data.ArrayReader({
						id : 'userid'
					}, ['userid', 'useraccount', 'realname', 'sex', 'unitid',
							'deptId', 'posid', 'userpassword', 'userstate',
							'email'])

		});

// 确认，取消按钮
var confirmBtn = new Ext.Button({
			id : 'confirm-btn',
			text : '确认同步',
			tooltip : '将列表中的用户同步到MIS系统中',
			icon : CONTEXT_PATH + "/jsp/res/images/icons/accept.png",
			cls : "x-btn-text-icon",
			handler : function() {
				Ext.Msg.show({
							title : '用户导入确认',
							msg : '列表中的用户信息将同步到基建MIS系统中，该操作将对基建MIS用户表进行更新，请慎重执行！',
							buttons : Ext.Msg.YESNO,
							icon : Ext.MessageBox.QUESTION,
							fn : function(btn) {
								if (btn == 'yes') {
									UserSync.syncHRUser(importUserList,
											function(retVal) {
												Ext.Msg.alert("操作提示", retVal
																.split(',')[0]);
												if (retVal.split(',').length) {
													newTime = retVal.split(',')[1]
													Ext.getCmp('timefield')
															.setValue(newTime);
												}
												importWindow.hide();
												userDS.reload();
											});
								}
							}
						});
			}
		});

var cancelBtn = new Ext.Button({
			id : 'cancel-btn',
			text : '取消',
			icon : CONTEXT_PATH + "/jsp/res/images/icons/cancel.png",
			cls : "x-btn-text-icon",
			tooltip : '取消用户同步操作，列表中的用户不会进行更新',
			handler : function() {
				importWindow.hide();
			}
		});

var importGrid = new Ext.grid.GridPanel({

			id : 'import-grid',
			region : 'center',
			tbar : [confirmBtn, cancelBtn],
			ds : store,

			cm : colModel,

			sm : new Ext.grid.RowSelectionModel({}),

			loadMask : true, // 加载时是否显示进度
			stripeRows : true,

			viewConfig : {
				forceFit : true,
				ignoreAdd : true
			}

		});

var importWindow;

function importUserConfirm(start, end, time) {
	confirmBtn.setDisabled(true);
	store.removeAll();
	UserSync.sysHRUserByNumToList(start, end, time, function(list) {
				importUserList = list;
				importedUserArr = new Array();
				for (var i = 0; i < list.length; i++) {
					var user = list[i];
					var tempArr = new Array();
					tempArr.push(user['userid']);
					tempArr.push(user['useraccount']);
					tempArr.push(user['realname']);
					tempArr.push(user['sex']);
					tempArr.push(user['unitid']);
					tempArr.push(user['deptId']);
					tempArr.push(user['posid']);
					tempArr.push(user['userpassword']);
					tempArr.push(user['userstate']);
					tempArr.push(user['email']);
					importedUserArr.push(tempArr);
				}
				// store.data = importedUserArr;
				store.loadData(importedUserArr, false);
				confirmBtn.setDisabled(false);
			})
}