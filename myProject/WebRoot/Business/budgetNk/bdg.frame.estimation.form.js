var beanName = "com.sgepit.pmis.budgetNk.hbm.BudgetNk";
var primaryKey = "bdgid";
var formPanelTitle = "编辑记录（查看详细信息）";
var pid = CURRENTAPPID;
// 标记是否为新增记录
var isAdd;

// 所有表单域
var formItems = [{
			name : 'pid',
			fieldLabel : 'PID',
			readOnly : true,
			xtype : 'hidden' // 隐藏域
		}, {
			name : 'bdgid',
			fieldLabel : '概算主键',
			xtype : 'hidden'// 隐藏域
		}, {
			name : 'bdgNo',
			fieldLabel : '财务编码',
			allowBlank : false,
			anchor : '95%'
		}, {
			name : 'bdgName',
			fieldLabel : '概算名称',
			allowBlank : false,
			anchor : '95%'
		}, {
			name : 'hasBdgAmount',
			fieldLabel : '是否工程量',
			xtype : 'hidden' // 隐藏域

		}, {
			name : 'bdgMoney',
			fieldLabel : '概算金额',
			xtype : 'numberfield',
			decimalPrecision : 4,
			allowBlank : true,
			anchor : '95%'
		}, {
			name : 'totalMoney',
			fieldLabel : '分摊总金额',
			xtype : 'numberfield',
			decimalPrecision : 4,
			readOnly : true,
			anchor : '95%'
		}, {
			name : 'matMoney',
			fieldLabel : '材料金额',
			xtype : 'hidden' // 隐藏域
		}, {
			name : 'buildMoney',
			fieldLabel : '建筑金额',
			readOnly : true,
			xtype : 'hidden', // 隐藏域
			anchor : '95%'
		}, {
			name : 'equMoney',
			fieldLabel : '设备安装金额',
			readOnly : true,
			xtype : 'hidden', // 隐藏域
			anchor : '95%'
		}, {
			name : 'isLeaf',
			fieldLabel : '是否子节点',
			readOnly : true,
			xtype : 'hidden'// 隐藏域
		}, {
			name : 'parent',
			fieldLabel : '父节点',
			readOnly : true,
			xtype : 'hidden'// 隐藏域

		}, {
			name : 'correspondBdg',
			fieldLabel : '对应概算',
			readOnly : true,
			xtype : 'hidden'// 隐藏域

		}, {
			name : 'isFinish',
			fieldLabel : '是否完成',
			readOnly : true,
			xtype : 'hidden'// 隐藏域

		}, {
			name : 'isAudit',
			fieldLabel : '是否稽核',
			readOnly : true,
			xtype : 'hidden'// 隐藏域

		}, {
			name : 'auditNo',
			fieldLabel : '稽核编号',
			readOnly : true,
			xtype : 'hidden'// 隐藏域

		}, {
			name : 'auditId',
			fieldLabel : '稽核主键',
			readOnly : true,
			xtype : 'hidden'// 隐藏域

		}, {
			name : 'assetNo',
			fieldLabel : '固定资产编号',
			readOnly : true,
			xtype : 'hidden'// 隐藏域

		}]

// 添加/修改概算信息
function saveOrUpdate(currBdgObj) {

	var mask = new Ext.LoadMask(Ext.getBody(), {
				msg : "正在更新..."
			});
	mask.show();
	Ext.Ajax.request({
		method : 'post',

		url : 'servlet/BudgetNkServlet',
		params : {
			ac : 'save-update'
		},
		jsonData : Ext.encode(currBdgObj),
		success : function(result, request) {
			mask.hide();
			Ext.example.msg('保存成功！', '您成功保存了一条概算信息！');

			var state = treePanel.getState();
			contentPanel.body.mask('Loading', 'x-mask-loading');

			// 若为添加新节点将其父节点展开
			var parentPath = treePanel.getNodeById(currBdgObj.parent).getPath();
			// 当前选中的节点，若是新增则选中父节点
			var activePath;
			if (isAdd) {
				activePath = parentPath;
				state.expandedNodes.push(parentPath);

			} else {
				activePath = treePanel.getNodeById(currBdgObj.bdgid).getPath();
			}

			treePanel.getLoader().load(treePanel.getRootNode(), function() {
				contentPanel.body.unmask();
				// 将树按之前状态展开
				treePanel.applyState(state, activePath);

					// 若为新增则再展开父节点

				});

		},
		failure : function(result, request) {
			mask.hide();

			Ext.Msg.show({
						title : '操作失败',
						msg : '操作失败',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.ERROR
					});

		}
	});
	mask.destroy();

}

// 保存按钮
var saveBtn = new Ext.Button({
			name : 'save',
			text : '保存',
			iconCls : 'save',
			handler : function() {
				// 避免重复提交
				this.setDisabled(true);

				// 当前的记录对象
				var currBdgObj = budgetFormPanel.getForm().getValues();

				// 没有id既为新增
				if (!currBdgObj.bdgid)
					isAdd = true;
				else
					isAdd = false;

				saveOrUpdate(currBdgObj);
			}
		})

var closeBtn = new Ext.Button({// 关闭按钮
	name : "close",
	text : "关闭",
	iconCls : 'icon-delete',
	handler : function() {
		budgetFormPanel.collapse();
	}
});

// form的fieldset
var formFieldSet = new Ext.form.FieldSet({
			title : '概算信息',
			layout : 'form',
			border : true,
			defaults : {
				width : 140,
				border : true
			},
			defaultType : 'textfield',
			items : formItems,
			buttons : [closeBtn, saveBtn]
		});

var budgetFormPanel = new Ext.FormPanel({
			id : 'budgetFormPanel',
			header : false,
			border : false,
			width : 300,
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
			items : [formFieldSet // Default config options for child items

			]
		});
