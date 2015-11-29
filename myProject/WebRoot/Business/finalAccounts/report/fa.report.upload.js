var servletName = 'servlet/PrjGeneralInfoServlet';
var beanName = 'com.sgepit.pmis.finalAccounts.report.hbm.FAUnitReport';
var business = "baseMgm";
var listMethod = "findWhereOrderby"
var currentPid = CURRENTAPPID;
var gridfilter = "pid = '" + currentPid + "'";
var ds, faReportPanel;
Ext.onReady(function() {

	// 保存所有用户名
	var userArray = new Array();
	DWREngine.setAsync(false);
	baseMgm
			.getData(
					"select userid,realname from rock_user where userid in ( select user_id from fa_unit_report ) union "
							+ "select '"
							+ USERID
							+ "' userid, '"
							+ REALNAME
							+ "' realname from dual", function(list) {
						for (var i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push(list[i][0]);
							temp.push(list[i][1]);
							userArray.push(temp);
						}
					})
	DWREngine.setAsync(true);
	var userStore = new Ext.data.SimpleStore({
				fields : ['userid', 'realname'],
				id : 'userid',
				data : userArray
			})
	var paramTypeArr = [];

	// 通用combobox renderer
	Ext.util.Format.comboRenderer = function(combo) {
		return function(value) {
			var record = combo.findRecord(combo.valueField, value);
			return record
					? record.get(combo.displayField)
					: combo.valueNotFoundText;
		}
	}

	// 日期renderer
	var dateRenderer = Ext.util.Format.dateRenderer('Y-m-d');

	// 上报按钮
	var reportBtn = new Ext.Button({
				id : 'upload-btn',
				iconCls : 'upload',
				text : '上报',
				tooltip : '上报竣工决算报表',
				handler : function() {
					if (ds.getTotalCount() > 0) {
						var record = ds.getAt(0);
						if (!record.data.fileLsh || record.data.fileLsh == '') {
							Ext.Msg.alert("提示", "当前报表还没有上传文件！");
							return;
						}
						if (record.data.reportStatus != 0) {
							Ext.Msg.alert("提示", "当前报表已上报！");
							return;
						}
						Ext.MessageBox.confirm('确认', '确认要上报竣工决算报表吗？', function(
										btn, text) {
									if (btn == 'yes') {

										report(record);
									}
								});
					}

				}
			});

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'sjType',
				type : 'string'
			}, {
				name : 'title',
				type : 'string'
			}, {
				name : 'billState',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'userId',
				type : 'string'
			}, {
				name : 'createDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'lastModifyDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'reportStatus',
				type : 'int'
			}, {
				name : 'fileLsh',
				type : 'string'
			}];

	var sm = new Ext.grid.CheckboxSelectionModel({

	});

	// 列模型
	var cm = new Ext.grid.ColumnModel([{
				id : 'uids',
				header : 'uids',
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'pid',
				header : '项目名称',
				dataIndex : 'pid',
				width : 200,
				align : 'center',
				renderer : function(value){
					if ( value == currentPid ){
						return CURRENTAPPNAME;
					}
				}
			}, {
				id : 'title',
				header : '竣工决算报表',
				width : 150,
				align : 'center',
				dataIndex : 'title',
				renderer : function(value, metaData, record, rowIndex,
						colIndex, store) {

					if (record.data.fileLsh) {

						var rtnHtml = '<a class="downloadLink" title="下载'
								+ value + '" onclick=downloadFile("'
								+ record.data.fileLsh + '")>【下载】</a>';
						if (record.data.reportStatus == 0) {
							rtnHtml += '  <a class="downloadLink" onclick="uploadFile(\''
									+ record.data.uids + '\')">【重新上传】</a>';
						}

					} else {
						var rtnHtml = '';
						if (record.data.reportStatus == 0) {
							rtnHtml += ' <a class="downloadLink" onclick="uploadFile(\''
									+ record.data.uids + '\')")">【附件上传】</a>';

						}

					}

					return rtnHtml;
				}
			}, {
				id : 'lastModifyDate',
				header : '填报日期',
				dataIndex : 'lastModifyDate',
				align : 'center',
				renderer : Ext.util.Format.dateRenderer('Y-m-d'),
				editor : new Ext.form.DateField({
										name : 'lastModifyDate',
										format : 'Y-m-d',
										readOnly : true,
										listeners : {
											change : function(filed, newValue, oldValue){
												var record = ds.getAt(0);
												record.data.lastModifyDate = newValue;
												faReportDWR.updateFAUnitReport(record.data, function() {
													faReportPanel.getStore().reload();
												});
											}
										
										}
									})

		}	, {
				id : 'userId',
				header : '填报人',
				align : 'center',
				dataIndex : 'userId',
				renderer : function(value) {
					var idx = userStore.find('userid', value);
					if (idx != -1) {
						return userStore.getAt(idx).get('realname');
					} else {
						return value;
					}
				}
			}, {
				id : 'reportStatus',
				header : '上报状态',
				align : 'center',
				dataIndex : 'reportStatus',
				renderer : function(value) {
					if (value == 0) {
						return '未上报';
					} else {
						return '已上报';
					}
				}
			}]);
	cm.defaultSortable = true;

	ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanName,
					business : business,
					method : listMethod,
					params : gridfilter
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'uids'
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true

			});

	// ds.setDefaultSort('paramType', 'asc');

	// 工程概况参数tab页
	faReportPanel = new Ext.grid.EditorGridPanel({
				region : 'center',
				id : 'fa-report-panel',
				// title : '竣工决算报表录入',
				// iconCls : 'icon-by-category',
				ds : ds,
				cm : cm,
				sm : sm,
				clicksToEdit :1,
				servletUrl : MAIN_SERVLET,
				bean : beanName,
				tbar : [reportBtn],
				border : false,
				autoScroll : 'true',
				loadMask : true,
				viewConfig : {
					forceFit : true
				}
			});

	// 创建viewport，加入面板
	var viewport = new Ext.Viewport({
			layout : 'fit',
			items : [faReportPanel]
		});

	faReportDWR.initFAUnitReport(currentPid, function(retVal) {
		ds.load();
	});
	
	ds.on('load',function(){
		if(!ds.getCount()>0) return;
		var record = ds.getAt(0);
		if(record.get('reportStatus') == 1){
			reportBtn.setDisabled(true);
		}else{
			reportBtn.setDisabled(false);
		}
	})
	
});
	
//过滤显示没有部署MIS的项目单位
var _combo = parent.proTreeCombo;
var _data = _combo ? _combo.store : null;
	if(_combo){
		var notUrlArr = new Array();
		var isHave = false;
		DWREngine.setAsync(false);
		var sql = "select unitid,unitname from Sgcc_Ini_Unit "
				+ " where app_url is null and unit_type_id = 'A'"
				+ " start with unitid = '"+USERBELONGUNITID+"' connect by prior unitid = upunit";
		baseMgm.getData(sql,function(list){
			for(i = 0; i < list.length; i++) {
				if(list[i][0] == CURRENTAPPID) 
					isHave = true;
				var temp = new Array();	
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				notUrlArr.push(temp);			
			}
	    }); 
	    DWREngine.setAsync(true);
		_data.loadData(notUrlArr);
		_combo.setValue(CURRENTAPPID);	    
	    if(!isHave){
	    	_combo.setValue(notUrlArr[0][0]);
	    	switchoverProj(notUrlArr[0][0], notUrlArr[0][1]);
			parent.window.frames["contentFrame"].location.reload();
	    }	
		if(_combo.list)_combo.list.hide();
	}

window.onbeforeunload = function(){
	if(_combo){
		_data.loadData(parent.array_prjs);
		if(_combo.list)_combo.list.hide();
	}
}


function uploadFile(filePk) {

	var record = ds.getById(filePk);

	var param = new Object();
	// param.allowableFileType = ".doc`.docx`.wps`.ppt`.pptx`.rtf`.dps";
	param.allowableFileType = "";
	param.businessId = filePk;
	param.businessType = "FA_REPORT";
	param.fileSource = "blob";
	param.compressFlag = "0";
	param.fileId = record.get("fileLsh");
	upWin = showBlobFileWin(param);
	upWin.on('beforeclose', function(panel) {
				// alert(panel.rtnObj.fileName);
				// 返回的文件信息（id，文件名，大小）
				var updatedInfo = panel.rtnObj;
				if (updatedInfo) {
					if (record.data.createDate == '') {
						record.data.createDate = null;

					}
					
					if (  record.data.lastModifyDate == '' ){
						record.data.lastModifyDate = null;
					}

					record.data.lastModifyDate = new Date();
					record.data.userId = USERID;
					record.data.fileLsh = updatedInfo.fileId;
					faReportDWR.updateFAUnitReport(record.data, function() {
								faReportPanel.getStore().reload();
							});
				}

			});

}

function downloadFile(fileLsh) {
	if (fileLsh != "") {
		var openUrl = CONTEXT_PATH + "/filedownload?method=fileDownload&id="
				+ fileLsh;
		document.all.formAc.action = openUrl
		document.all.formAc.submit()
	} else {
		Ext.Msg.alert("提示", "该文件不存在!");
	}
}

function report(record) {

	if (record.data.createDate == '') {
		record.data.createDate = null;

	}

	if (record.data.lastModifyDate == '') {
		record.data.lastModifyDate = null;

	}
	record.data.reportStatus = 1;
	faReportDWR.updateFAUnitReport(record.data, function(retVal) {
				if (retVal) {
					Ext.example.msg('提示', '上报成功!');
					faReportPanel.getStore().reload();
				} else {
					Ext.example.msg('提示', '上报失败!');
				}

			});

}
