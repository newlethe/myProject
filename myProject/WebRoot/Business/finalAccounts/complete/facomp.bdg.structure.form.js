var formPanelTitle = "编辑概算信息";
var selectBdgWin;
var formPanel;
var formFieldSet;
var saveBtn,closeBtn;
//工程类型集合
var gcTypeArr = new Array();
var gcTypeTreeCombo, buildBdgField, buildBdgTrigger, buildNameField,
	equipBdgField, equipBdgTrigger, equipNameField, installBdgField,
	installBdgTrigger, installNameField, otherBdgField, otherBdgTrigger,otherNameField;
// 必填项后加*号
var requiredMark = "<font color='red' >*</font>";

Ext.onReady(function() {
	DWREngine.setAsync(false);
	baseMgm.getData("select TREEID,GC_TYPE_NAME from FACOMP_GC_TYPE where pid='"
						+ CURRENTAPPID + "' order by UIDS ", function(list) {
					for (var i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i][0]);
						temp.push(list[i][1]);
						gcTypeArr.push(temp);
					}
				});
	DWREngine.setAsync(true);
	gcTypeTreeCombo = new Ext.ux.TreeCombo({
				id : 'gcType',
				name : 'gcType',
				fieldLabel : '工程类型',
				resizable : true,
				readOnly : true,
				treeWidth : 200,
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "gcTypeColumnTree",
								businessName : business,
								parent : '01',
								pid : CURRENTAPPID
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : "01",
							text : "工程类型",
							iconCls : 'form',
							expanded : true
						})
			});
	
	gcTypeTreeCombo.getTree().on('beforeload', function(node) {
				gcTypeTreeCombo.getTree().loader.baseParams.parent = node.id;
			});
	
	gcTypeTreeCombo.on('select', function(tree, node) {
				if (node.id == '01') {
					Ext.example.msg("信息提示：", "请选择分类下的子分类！");
					this.setRawValue("");
					return;
				}
				this.setRawValue(node.text);
			});

	buildBdgField = new Ext.form.Hidden({
				name : 'buildbdg',
				fieldLabel : 'buildbdg'
			});
	buildBdgTrigger = new Ext.form.TriggerField({
				id : 'build',
				name : 'buildno',
				fieldLabel : '建筑概算编号',
				readOnly : true
			});
	buildNameField = new Ext.form.TextField({
				id : 'buildname',
				name : 'buildname',
				fieldLabel : '建筑概算名称',
				readOnly : true,
				width : 140
			});

	equipBdgField = new Ext.form.Hidden({
				name : 'equipbdg',
				fieldLabel : 'equipbdg'
			});
	equipBdgTrigger = new Ext.form.TriggerField({
				id : 'equip',
				name : 'equipno',
				fieldLabel : '设备概算编号',
				readOnly : true
			});
	equipNameField = new Ext.form.TextField({
				name : 'equipname',
				fieldLabel : '设备概算名称',
				readOnly : true,
				width : 140
			});

	installBdgField = new Ext.form.Hidden({
				name : 'installbdg',
				fieldLabel : 'installbdg'
			});
	installBdgTrigger = new Ext.form.TriggerField({
				id : 'install',
				name : 'installno',
				fieldLabel : '安装概算编号',
				readOnly : true
			});
	installNameField = new Ext.form.TextField({
				name : 'installname',
				fieldLabel : '安装概算名称',
				readOnly : true,
				width : 140
			});

	otherBdgField = new Ext.form.Hidden({
				name : 'otherbdg',
				fieldLabel : 'otherbdg'
			});
	otherBdgTrigger = new Ext.form.TriggerField({
				id : 'other',
				name : 'otherno',
				fieldLabel : '其它概算编号',
				readOnly : true
			});
	otherNameField = new Ext.form.TextField({
				name : 'othername',
				fieldLabel : '其它概算名称',
				readOnly : true,
				width : 140
			});
	
	buildBdgTrigger.onTriggerClick = selectBdg;
	equipBdgTrigger.onTriggerClick = selectBdg;
	installBdgTrigger.onTriggerClick = selectBdg;
	otherBdgTrigger.onTriggerClick = selectBdg;
	
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
				name : 'bdgno',
				fieldLabel : '编号' + requiredMark,
				allowBlank : false,
				width : 140
			}, {
				name : 'bdgname',
				fieldLabel : '概算名称' + requiredMark,
				allowBlank : false,
				width : 140
			}, gcTypeTreeCombo, buildBdgTrigger, buildNameField,
			equipBdgTrigger, equipNameField, installBdgTrigger,
			installNameField, otherBdgTrigger, otherNameField, buildBdgField,
			equipBdgField, installBdgField, otherBdgField, {
				name : 'isleaf',
				fieldLabel : '是否子节点',
				xtype : 'hidden'
			}, {
				name : 'parentid',
				fieldLabel : '父节点',
				xtype : 'hidden'
			}, {
				name : 'treeid',
				fieldLabel : '节点Id',
				xtype : 'hidden'
			}];

	// 保存按钮
	saveBtn = new Ext.Button({
				name : 'save',
				text : '保存',
				iconCls : 'save',
				handler : saveOrUpdate
			});
	
	closeBtn = new Ext.Button({// 关闭按钮
		name : "close",
		text : "关闭",
		iconCls : 'icon-delete',
		handler : function() {
			formPanel.collapse();
		}
	});
	
	// form的fieldset
	formFieldSet = new Ext.form.FieldSet({
				title : formPanelTitle,
				layout : 'form',
				border : true,
				labelWidth : 100,
				defaults : {
					border : true
				},
				defaultType : 'textfield',
				items : formItems,
				buttons : [saveBtn, closeBtn]
			});
	
	formPanel = new Ext.FormPanel({
		id : 'formPanel',
		header : false,
		border : false,
		width : 310,
		split : true,
		collapsible : true,
		collapsed : true,
		collapseMode : 'mini',
		minSize : 200,
		maxSize : 400,
		border : false,
		region : 'east',
		bodyStyle : 'padding:10px 10px; border:0px dashed #3764A0',
		iconCls : 'icon-detail-form', // 面板样式
		labelAlign : 'left',
		items : [formFieldSet],
		listeners : {
			'expend' : function() {
				var width1 = Ext.getCmp('buildname').getSize().width - 20;
				gcTypeTreeCombo.setWidth(width1);
				equipBdgTrigger.setWidth(width1);
				buildBdgTrigger.setWidth(width1);
				installBdgTrigger.setWidth(width1);
				otherBdgTrigger.setWidth(width1);
			}
		}
			// Default config options for child items
		});
	
	function saveOrUpdate() {
		// 避免重复提交
		saveBtn.setDisabled(true);
		// 当前的记录对象
		var currObj = formPanel.getForm().getValues();
		currObj.gcType = gcTypeTreeCombo.getValue();
		if (!currObj.bdgno) {
			Ext.example.msg('提示', '概算编号不能为空');
			saveBtn.setDisabled(false);
			return false;
		}
		if (!currObj.bdgname) {
			Ext.example.msg('提示', '概算名称不能为空');
			saveBtn.setDisabled(false);
			return false;
		}
		var rec = treeGrid.getSelectionModel().getSelected();
		var isleaf = '0';
		if (rec.get('isleaf') == 1) {
			isleaf = '1';
		}
		var json = Ext.encode(currObj);
		Ext.Ajax.request({
					method : 'post',
					url : servletName,
					params : {
						ac : 'save-update',
						id : currObj.uids,
						isleaf : isleaf,
						beanType : 'faBdgInfo'
					},
					jsonData : json,
					success : function(result, request) {
						var obj = Ext.decode(result.responseText);
						if (obj.success == true) {
							if (obj.msg == "false") {
								Ext.example.msg('提示', '概算编号重复!');
								saveBtn.setDisabled(false);
							} else {
								Ext.example.msg('保存', '保存成功!');
								selectedPath = store.getPath(rec, "uids");
								store.load();
								formPanel.collapse();
								DWREngine.setAsync(false);
								baseMgm.getData(buiSql, function(list) {
											buiArr = new Array();
											for (var i = 0; i < list.length; i++) {
												buiArr.push(list[i]);
											}
										});
								baseMgm.getData(equSql, function(list) {
											equArr = new Array();
											for (var i = 0; i < list.length; i++) {
												equArr.push(list[i]);
											}
										});
								baseMgm.getData(insSql, function(list) {
											insArr = new Array();
											for (var i = 0; i < list.length; i++) {
												insArr.push(list[i]);
											}
										});
								baseMgm.getData(othSql, function(list) {
											othArr = new Array();
											for (var i = 0; i < list.length; i++) {
												othArr.push(list[i]);
											}
										});
								DWREngine.setAsync(true);
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
})