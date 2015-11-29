var formPanelTitle = "凭证基本信息";
var servletName = "servlet/FACompleteServlet";
var conname = '';
var partyb = '';
var proofNo = '';
var proofAbstract = '';
var remark = '';
// 必填项后加*号
var requiredMark = "<font color='red' >*</font>";

Ext.onReady(function() {
	//修改
	if (uids) {
		var sql = "select t.proof_no,t.proof_abstract,t.comptime,t.conid,t.totalmoney,t.remark"
				+ " from FACOMP_PROOF_INFO t where t.uids = '" + uids + "'";
		DWREngine.setAsync(false);
		baseMgm.getData(sql, function(list) {
					if (list != null && list.length > 0) {
						proofNo = list[0][0];
						proofAbstract = list[0][1];
						time = list[0][2];
						conid = list[0][3];
						money = list[0][4];
						remark = list[0][5];
					}
				})
		DWREngine.setAsync(true);
	}
	if (conid) {
		var sql = "select t.CONNAME,t.PARTYBNO from CON_OVE t where t.CONID = '"
				+ conid + "'";
		DWREngine.setAsync(false);
		baseMgm.getData(sql, function(list) {
					if (list != null && list.length > 0) {
						conname = list[0][0];
						partyb = list[0][1];
					}
				})
		DWREngine.setAsync(true);
	} else if (conno) {
		//生产部，综合部使用的是conno
		var sql = "select t.CONID,t.CONNAME,t.PARTYBNO from CON_OVE t where t.CONNO = '"
				+ conno + "'";
		DWREngine.setAsync(false);
		baseMgm.getData(sql, function(list) {
					if (list != null && list.length > 0) {
						conid = list[0][0];
						conname = list[0][1];
						partyb = list[0][2];
					}
				})
		DWREngine.setAsync(true);
	}
	DWREngine.setAsync(false);
	baseMgm.getData("select b.partyb from Con_Partyb b where b.cpid = '" + partyb + "'", function(list) {
				if (list != null && list.length > 0) {
					partyb = list[0];
				}
			})
	DWREngine.setAsync(true);

	// 所有表单域
	var formItems = [{
				name : 'uids',
				fieldLabel : 'uids',
				xtype : 'hidden'
			}, {
				name : 'pid',
				fieldLabel : 'PID',
				xtype : 'hidden'
			}, {
				name : 'conid',
				fieldLabel : 'conid',
				xtype : 'hidden'
			}, {
				name : 'proofNo',
				fieldLabel : '凭证号' + requiredMark,
				allowBlank : false
			}, {
				name : 'proofAbstract',
				fieldLabel : '凭证摘要' + requiredMark,
				allowBlank : false
			}, {
				name : 'comptime',
				fieldLabel : '期别',
				readOnly : true
			}, {
				name : 'conname',
				fieldLabel : '合同名称',
				readOnly : true
			}, {
				name : 'partyb',
				fieldLabel : '施工/供货单位',
				readOnly : true
			}, {
				name : 'totalmoney',
				fieldLabel : '总金额',
				readOnly : true
			}, {
				name : 'remark',
				fieldLabel : '备注',
				xtype : 'textarea',
				height : 100
			}, {
				name : 'relateuids',
				fieldLabel : '关联数据的主键',
				xtype : 'hidden'
			}];

	// 保存按钮
	var saveBtn = new Ext.Button({
				name : 'save',
				text : '保存',
				iconCls : 'save',
				handler : saveHandle
			});

	var closeBtn = new Ext.Button({// 关闭按钮
		name : "close",
		text : "关闭",
		iconCls : 'icon-delete',
		handler : function() {
			window.close();
		}
	});

	// form的fieldset
	var formFieldSet = new Ext.form.FieldSet({
				title : formPanelTitle,
				layout : 'form',
				border : true,
				labelWidth : 100,
				defaults : {
					border : true,
					anchor : '90%'
				},
				defaultType : 'textfield',
				items : formItems,
				buttons : [saveBtn, closeBtn]
			});

	var formPanel = new Ext.FormPanel({
				id : 'formPanel',
				header : false,
				border : false,
				split : true,
				border : false,
				region : 'center',
				bodyStyle : 'padding:10px 10px; border:0px dashed #3764A0',
				iconCls : 'icon-detail-form', // 面板样式
				labelAlign : 'left',
				items : [formFieldSet]
			});

	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [formPanel]
			});

	var formRecord = Ext.data.Record.create(formItems);
	var loadFormRecord = new formRecord({
				uids : uids,
				pid : CURRENTAPPID,
				conid : conid,
				proofNo : proofNo,
				proofAbstract : proofAbstract,
				conname : conname,
				partyb : partyb,
				comptime : time,
				totalmoney : money,
				remark : remark,
				relateuids : relateuids
			});
	formPanel.getForm().loadRecord(loadFormRecord);

	function saveHandle() {
		// 避免重复提交
		saveBtn.setDisabled(true);
		// 当前的记录对象
		var currObj = formPanel.getForm().getValues();
		if (!currObj.proofNo) {
			Ext.example.msg('提示', '凭证号不能为空');
			saveBtn.setDisabled(false);
			return false;
		}
		if (!currObj.proofAbstract) {
			Ext.example.msg('提示', '凭证摘要不能为空');
			saveBtn.setDisabled(false);
			return false;
		}
		//修改
		if (uids) {
			var proof_no = formPanel.getForm().findField('proofNo').getValue();
			var proof_abstract = formPanel.getForm().findField('proofAbstract').getValue();
			var remarkNew = formPanel.getForm().findField('remark').getValue();
			var sqlUpdate = "update FACOMP_PROOF_INFO t set t.proof_no = '" + proof_no +  "',t.proof_abstract = '"
					+ proof_abstract + "',t.remark = '" + remarkNew + "' where t.uids = '" + uids + "'";
			DWREngine.setAsync(false);
			baseDao.updateBySQL(sqlUpdate, function(flag) {
								if (flag == 1) {
									Ext.example.msg('提示', '修改成功!');
									window.returnValue= 'y';
									window.setTimeout('window.close();',1000);
								} else {
									Ext.example.msg('提示', '修改失败!');
									saveBtn.setDisabled(false);
									return false;
								}
							});
			DWREngine.setAsync(true);
			
		} else {//新增
			var json = Ext.encode(currObj);
			Ext.Ajax.request({
						method : 'post',
						url : servletName,
						params : {
							ac : 'save-update',
							beanType : 'proof'
						},
						jsonData : json,
						success : function(result, request) {
							var obj = Ext.decode(result.responseText);
							if (obj.success == true) {
								Ext.example.msg('保存', '保存成功!');
								window.returnValue= 'y';
								window.setTimeout('window.close();',1000);
							} else {
								Ext.Msg.show({
											title : '保存失败',
											msg : obj.msg,
											buttons : Ext.Msg.OK,
											icon : Ext.MessageBox.ERROR
										});
								saveBtn.setDisabled(false);
								return false;
							}
						},
						failure : function(result, request) {
							Ext.Msg.show({
										title : '操作失败',
										msg : '操作失败！',
										buttons : Ext.Msg.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	}
})

