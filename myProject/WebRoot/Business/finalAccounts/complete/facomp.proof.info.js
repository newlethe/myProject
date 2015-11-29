var servletName = 'servlet/FACompleteServlet';
var beanName = "com.sgepit.pmis.finalAccounts.complete.hbm.FacompProofInfo";
var business = "baseMgm";
var uncompBusiness = "faBaseInfoService";
var listMethod = "findWhereOrderby";
var pageSize = 8;
var gridfilter = "pid = '" + pid + "'";
// 是否禁用添加/修改/删除按钮
var btnDisabled = ModuleLVL != '1';
// 必填项后加*号
var requiredMark = "<font color='red' >*</font>";
var conArr = new Array();
var conid,condiv;
var viewSbclWin,viewSgqtWin;
var sm,subSm;
var sgqtParams;
var subjectArr = new Array();//财务科目

Ext.onReady(function() {
	var sql = "select t.CONID,t.CONNAME,b.partyb from CON_OVE t,Con_Partyb b where t.CONID" +
			" in (select conid from FACOMP_PROOF_INFO) and t.partybno = B.CPID";
	DWREngine.setAsync(false);
	baseMgm.getData(sql, function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					conArr.push(temp);
				}
			})
	baseDao.getData("select TREEID,SUBJECT_ALLNAME,SUBJECT_NAME from FACOMP_FINANCE_SUBJECT where PID='" + CURRENTAPPID
					+ "'", function(list){
	    for(i = 0; i < list.length; i++) {
	        var temp = new Array();
	        temp.push(list[i][0]);
	        temp.push(list[i][1]);
	        temp.push(list[i][2]);
	        subjectArr.push(temp);
	    }
	});
	DWREngine.setAsync(true);

	/** ================================凭证信息Begin===================================== */
	var fc = {
		uids : {
			name : 'uids',
			fieldLabel : 'uids'
		},
		pid : {
			name : 'pid',
			fieldLabel : 'pid'
		},
		conid : {
			name : 'conid',
			fieldLabel : '合同ID'
		},
		proofNo : {
			name : 'proofNo',
			fieldLabel : '凭证号'
		},
		proofAbstract : {
			name : 'proofAbstract',
			fieldLabel : '凭证摘要',
			allowBlank : false
		},
		comptime : {
			name : 'comptime',
			fieldLabel : '期别'
		},
		conmoneyno : {
			name : 'conmoneyno',
			fieldLabel : '合同编号'
		},
		conname : {
			name : 'conname',
			fieldLabel : '合同名称'
		},
		partyb : {
			name : 'partyb',
			fieldLabel : '施工/供货单位'
		},
		totalmoney : {
			name : 'totalmoney',
			fieldLabel : '总金额'
		},
		remark : {
			name : 'remark',
			fieldLabel : '备注'
		},
		createtime : {
			name : 'createtime',
			fieldLabel : '创建时间'
		},
		relateuids : {
			name : 'relateuids',
			fieldLabel : '关联数据主键'
		},
		detialBh : {
			name : 'detialBh',
			fieldLabel : '编号',
			allowBlank : false
		}
	};

	var columnParams = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'proofNo',
				type : 'string'
			}, {
				name : 'proofAbstract',
				type : 'string'
			}, {
				name : 'comptime',
				type : 'string'
			}, {
				name : 'totalmoney',
				type : 'float'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'createtime',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'relateuids',
				type : 'string'
			}, {
				name : 'detialBh',
				type : 'float'
			}];

	sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	sm.on('rowselect', function(sm, rowIndex, record) {
				subDs.baseParams.params = gridfilter + " and relateuids = '"
						+ record.get('uids') + "'";
				conid = record.get('conid');
				subDs.load({
							params : {
								start : 0,
								limit : pageSize
							}
					});
			});

	var cm = new Ext.grid.ColumnModel([sm, {
				id : fc['uids'].name,
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : fc['pid'].name,
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : fc['conid'].name,
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				hidden : true
			}, {
				id : fc['proofNo'].name,
				header : fc['proofNo'].fieldLabel,
				dataIndex : fc['proofNo'].name
			}, {
				id : fc['proofAbstract'].name,
				header : fc['proofAbstract'].fieldLabel,
				dataIndex : fc['proofAbstract'].name
			}, {
				id : fc['comptime'].name,
				header : fc['comptime'].fieldLabel,
				dataIndex : fc['comptime'].name,
				width : 80
			}, {
				id : fc['conname'].name,
				header : fc['conname'].fieldLabel,
				dataIndex : fc['conname'].name,
				renderer : function(v, m, r) {
					for (var i = 0; i < conArr.length; i++) {
						if (r.get('conid') == conArr[i][0]) {
							return conArr[i][1];
						}
					}
				}
			}, {
				id : fc['partyb'].name,
				header : fc['partyb'].fieldLabel,
				dataIndex : fc['partyb'].name,
				width : 200,
				renderer : function(v, m, r) {
					for (var i = 0; i < conArr.length; i++) {
						if (r.get('conid') == conArr[i][0]) {
							return conArr[i][2];
						}
					}
				}
			}, {
				id : fc['totalmoney'].name,
				header : fc['totalmoney'].fieldLabel,
				dataIndex : fc['totalmoney'].name
			}, {
				id : fc['remark'].name,
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				width : 250
			}, {
				id : fc['createtime'].name,
				header : fc['createtime'].fieldLabel,
				dataIndex : fc['createtime'].name,
				hidden : true
			}, {
				id : fc['relateuids'].name,
				header : fc['relateuids'].fieldLabel,
				dataIndex : fc['relateuids'].name,
				hidden : true
			}]);
	cm.defaultSortable = true;
	cm.defaultWidth = 150;

	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanName,
					business : business,
					method : listMethod,
					params : gridfilter + " and CREATTIME is not null"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'uids'
						}, columnParams),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	ds.setDefaultSort('createtime', 'desc');
	ds.on('load', function() {
				sm.selectFirstRow();
			});

	var editBtn = new Ext.Button({
				name : 'edit',
				text : '修改',
				iconCls : 'btn',
				handler : editHandle
			});
	var delBtn = new Ext.Button({
				name : 'remove',
				text : '删除',
				iconCls : 'remove',
				handler : delHandle
			});

	var proofGrid = new Ext.grid.GridPanel({
				region : 'north',
				id : 'proofGrid',
				titel : '凭证信息管理',
				iconCls : 'icon-by-category',
				height : document.body.clientHeight * 0.5,
				ds : ds,
				cm : cm,
				sm : sm,
				tbar : ['凭证信息管理', '-', editBtn, '-', delBtn],
				border : false,
				autoScroll : 'true',
				loadMask : true,
				stripeRows : true,
				bbar : new Ext.PagingToolbar({
							pageSize : pageSize,
							beforePageText : '第',
							store : ds,
							displayInfo : true,
							emptyMsg : '无记录'
						}),
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				}
			});

	/** =================================凭证信息End===================================== */
	/** =================================凭证详细信息Begin======================================= */

	subSm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var subCm = new Ext.grid.ColumnModel([subSm, {
				id : fc['uids'].name,
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : fc['pid'].name,
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : fc['conid'].name,
				header : '财务科目ID',
				dataIndex : fc['conid'].name,
				hidden : true
			}, {
				id : fc['detialBh'].name,
				header : '编号' + requiredMark,
				dataIndex : fc['detialBh'].name,
				editor : new Ext.form.NumberField(fc['detialBh']),
				width : 120,
				renderer : editorColor
			}, {
				id : fc['proofAbstract'].name,
				header : '凭证详细信息编号' + requiredMark,
				dataIndex : fc['proofAbstract'].name,
				editor : new Ext.form.TextField(fc['proofAbstract']),
				renderer : editorColor
			}, {
				id : fc['comptime'].name,
				header : '科目全称',
				dataIndex : fc['comptime'].name,
				width : 200,
				renderer : function(v){
					for (var i=0;i<subjectArr.length;i++){
						if(subjectArr[i][0] == v){
							return subjectArr[i][1];
						}
					}
					return v;
				}
			}, {
				id : 'projectname',
				header : '系统工程名称',
				dataIndex : 'projectname',
				renderer : function(v, m, r) {
					var subjectAllname = r.get('comptime');
					for (var i=0;i<subjectArr.length;i++){
						if(subjectArr[i][0] == subjectAllname){
							return subjectArr[i][2];
						}
					}
					var i = subjectAllname.lastIndexOf('/');
					if (i == -1){
						i = subjectAllname.lastIndexOf('-');
					}
					return subjectAllname.substring(i + 1);
				}
			}, {
				id : fc['conname'].name,
				header : fc['conname'].fieldLabel,
				dataIndex : fc['conname'].name,
				renderer : function(v, m, r) {
					var rec = sm.getSelected();
					for (var i = 0; i < conArr.length; i++) {
						if (rec.get('conid') == conArr[i][0]) {
							return conArr[i][1];
						}
					}
				}
			}, {
				id : fc['partyb'].name,
				header : fc['partyb'].fieldLabel,
				dataIndex : fc['partyb'].name,
				renderer : function(v, m, r) {
					var rec = sm.getSelected();
					for (var i = 0; i < conArr.length; i++) {
						if (rec.get('conid') == conArr[i][0]) {
							return conArr[i][2];
						}
					}
				}
			}, {
				id : fc['totalmoney'].name,
				header : fc['totalmoney'].fieldLabel,
				dataIndex : fc['totalmoney'].name,
				width : 120
			}, {
				id : fc['remark'].name,
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				width : 250,
				editor : new Ext.form.TextField(fc['remark']),
				renderer : editorColor
			}, {
				id : fc['relateuids'].name,
				header : fc['relateuids'].fieldLabel,
				dataIndex : fc['relateuids'].name,
				hidden : true
			}]);
	subCm.defaultSortable = true;
	subCm.defaultWidth = 180;

	var subDs = new Ext.data.Store({
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
						}, columnParams),
				remoteSort : true
			});
	subDs.setDefaultSort("detialBh", 'asc');
	subDs.on('load', function() {
				subSm.selectFirstRow();
			});

	var viewBtn = new Ext.Button({
				name : 'view',
				text : '查看详细',
				iconCls : 'btn',
				handler : viewHandle
			});

	var subGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				id : 'subGrid',
				titel : '凭证详细信息',
				iconCls : 'icon-by-category',
				ds : subDs,
				cm : subCm,
				sm : subSm,
				servletUrl : MAIN_SERVLET,
				bean : beanName,
				tbar : ['凭证详细信息', '-', viewBtn, '-'],
				border : false,
				autoScroll : 'true',
				clicksToEdit : 1,
				primaryKey : 'uids',
				addBtn : false,
				delBtn : false,
				loadMask : true,
				stripeRows : true,
				bbar : new Ext.PagingToolbar({
							pageSize : pageSize,
							beforePageText : '第',
							store : subDs,
							displayInfo : true,
							emptyMsg : '无记录'
						}),
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				}
			});

	/** =================================凭证详细信息End========================================= */

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [proofGrid, subGrid]
			});

	ds.load({
				params : {
					start : 0,
					limit : pageSize
				}
			});

	function editHandle() {
		var r = sm.getSelected();
		if (r == null) {
			Ext.example.msg('提示', '请选择一条数据');
			return false;
		}
		var docUrl = BASE_PATH + "Business/finalAccounts/complete/facomp.proof.form.jsp?uids=" + r.get('uids');
		var rtnstr = showModalDialog(docUrl, "",
				"dialogWidth:400px;dialogHeight:400px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
		if (rtnstr == 'y') {
			ds.load({
						params : {
							start : 0,
							limit : pageSize
						}
					});
		}
	}

	function delHandle() {
		var r = sm.getSelected();
		if (r == null) {
			Ext.example.msg('提示', '请选择一条数据!');
			return false;
		}
		Ext.Msg.show({
					title : '删除节点',
					msg : '确认删除该凭证及其凭证详细信息?',
					buttons : Ext.Msg.YESNO,
					icon : Ext.MessageBox.QUESTION,

					fn : function(value) {
						if (value == 'yes') {
							var uids = r.get('uids');
							var rtn;
							DWREngine.setAsync(false);
							faBaseInfoService.deleteProof(uids, function(str) {
										rtn = str;
									});
							DWREngine.setAsync(true);
							if (rtn == 'true') {
								Ext.example.msg('提示', '删除成功!');
								subDs.removeAll();
								ds.load({
											params : {
												start : 0,
												limit : pageSize
											}
										});
								return;
							} else {
								Ext.example.msg('提示', '删除失败!');
								return;
							}
						}
					}
				})
	}

	function viewHandle(){
		var r = sm.getSelected();
		conid = r.get('conid');
		if(r.get('comptime').length > 8){
			if (!viewSbclWin) {
				viewSbclWin = new Ext.Window({
							border : false,
					        modal : true,
					        layout : 'border',
					        closeAction : 'hide',
					        title : '设备、材料合同投资完成',
							width : document.body.clientWidth * 0.9,
							height : document.body.clientHeight * 0.9,
							items : [bdgTreeGrid,sbclPanel]
						});
						
			}
			bdgTreeStore.load();
			viewSbclWin.show();

			DWREngine.setAsync(false);
			baseMgm.getData("select c.condivno from con_ove c where c.conid = '" + conid + "'", function(list) {
				condiv = list[0];
			})
			DWREngine.setAsync(true);
			sbclDs.baseParams.bean = condiv == 'SB' ? "com.sgepit.pmis.equipment.hbm.EquGoodsStockOut"
							: "com.sgepit.pmis.wzgl.hbm.WzGoodsStockOut";
			sbclDs.baseParams.params = gridfilter + " and uids = '" + r.get('relateuids') + "'";
			sbclDs.load({
						params : {
							start : 0,
							limit : pageSize
						}
					});
		}else{
			if(!viewSgqtWin){
				viewSgqtWin = new Ext.Window({
							border : false,
					        modal : true,
					        layout : 'border',
					        closeAction : 'hide',
					        title : '施工、其他合同投资完成',
							width : document.body.clientWidth * 0.9,
							height : document.body.clientHeight * 0.9,
							items : [treePanelNew,sgqtGrid]
						});
						
			}
			rootNew.reload();
			viewSgqtWin.show();

			var proid = "";
			var subject = subSm.getSelected().get('conid');//财务科目treeid
			DWREngine.setAsync(false);
			baseMgm.getData("select t.proappid from BDG_PROJECT t where t.financial_account = '" + subject + "'", function(list) {
				for(var i=0;i<list.length;i++){
					if(i!=0){
						proid += ",'" + list[i] + "'";
					}else {
						proid = "'" + list[0] + "'";
					}
				}
			})
			DWREngine.setAsync(true);
			sgqtParams = gridfilter + " and MON_ID = '" + r.get('relateuids')
							+ "' and proid in (" + proid + ")";
			sgqtDs.baseParams.params = sgqtParams;
			sgqtDs.load({
						params : {
							start : 0,
							limit : pageSize
						}
					});
		}
	}

	function editorColor(v, m, r) {
		m.attr = "style=background-color:#FBF8BF";
		return v;
	}
});
