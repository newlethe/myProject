var formPanelTitle = "编辑工程类型";
var servletName = "servlet/FACompleteServlet";
// 必填项后加*号
var requiredMark = "<font color='red' >*</font>";
// 所有表单域
var formItems = [{
			name : 'uids',
			xtype : 'hidden'
		}, {
			name : 'treeid',
			xtype : 'hidden'
		}, {
			name : 'pid',
			xtype : 'hidden'
		}, {
			name : 'gcTypeBm',
			fieldLabel : '工程类型编码' + requiredMark,
			allowBlank : false
		}, {
			name : 'gcTypeName',
			fieldLabel : '工程类型名称' + requiredMark,
			allowBlank : false
		}, {
			name : 'remark',
			fieldLabel : '备注'
		}, {
			name : 'isleaf',
			fieldLabel : '是否子节点',
			readOnly : true,
			xtype : 'hidden'// 隐藏域
		}, {
			name : 'parentid',
			fieldLabel : '父节点',
			readOnly : true,
			xtype : 'hidden'// 隐藏域
		}];

// 保存按钮
var saveBtn = new Ext.Button({
			name : 'save',
			text : '保存',
			iconCls : 'save',
			handler : saveOrUpdate
		});
// 关闭按钮
var closeBtn = new Ext.Button({
			name : "close",
			text : "关闭",
			iconCls : 'icon-delete',
			handler : function() {
				formPanel.collapse();
			}
		});

function saveOrUpdate() {
	// 避免重复提交
	saveBtn.setDisabled(true);
	var form = formPanel.getForm();
	// 当前的记录对象
	var currObj = formPanel.getForm().getValues();
	if (!currObj.gcTypeBm) {
		Ext.example.msg('提示', '工程类型编码不能为空');
		saveBtn.setDisabled(false);
		return false;
	}
	if (!currObj.gcTypeName) {
		Ext.example.msg('提示', '工程类型名称不能为空');
		saveBtn.setDisabled(false);
		return false;
	}
	var rec = treeGrid.getSelectionModel().getSelected();
	var isleaf = '0';
	if (rec.get('isleaf') == 1) {
		isleaf = '1';
	}
	Ext.Ajax.request({
				method : 'post',
				url : servletName,
				params : {
					ac : 'save-update',
					id : currObj.uids,
					isleaf : isleaf,
					beanType : 'gcType'
				},
				jsonData : Ext.encode(currObj),
				success : function(result, request) {
					var obj = Ext.decode(result.responseText);
					if (obj.success == true) {
						if (obj.msg == "false") {
							Ext.example.msg('提示', '工程项目编码重复!');
							saveBtn.setDisabled(false);
						} else {
							Ext.example.msg('保存', '保存成功!');
							selectedPath = store.getPath(rec, "uids");
							store.load();
							formPanel.collapse();
						}
					} else {
						Ext.Msg.show({
									title : '保存失败',
									msg : obj.msg,
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
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

// form的fieldset
var formFieldSet = new Ext.form.FieldSet({
			title : formPanelTitle,
			layout : 'form',
			border : true,
			labelWidth : 100,
			defaults : {
				width : 160,
				border : true
			},
			defaultType : 'textfield',
			items : formItems,
			buttons : [saveBtn, closeBtn]
		});

var formPanel = new Ext.FormPanel({
	id : 'formPanel',
	header : false,
	border : false,
	width : 320,
	split : true,
	collapsible : true,
	collapsed : true,
	collapseMode : 'mini',
	minSize : 300,
	maxSize : 400,
	border : false,
	region : 'east',
	bodyStyle : 'padding:10px 10px; border:0px dashed #3764A0',
	iconCls : 'icon-detail-form', // 面板样式
	labelAlign : 'left',
	items : [formFieldSet]
		// Default config options for child items
	});

saveBtn.setDisabled(true);