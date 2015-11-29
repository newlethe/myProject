var formPanelTitle = "编辑工程类型";
var saveBtn;
var servletName = "servlet/BdgStructureServlet";

// 所有表单域
var formItems = [{
			name : 'uids',
			fieldLabel : '编号',
			xtype : 'hidden',
			readOnly : true
		}, {
			name : 'pid',
			fieldLabel : 'PID',
			readOnly : 'true',
			xtype : 'hidden'
		}, {
			name : 'gcTypeName',
			fieldLabel : '项目类型名称'
		}, {
			name : 'bdgLevel',
			fieldLabel : '概算层次(系统概算)',
			xtype : 'numberfield',
			maxLength : 2
		}, {
			name : 'faBdgLevel',
			fieldLabel : '概算层次(竣工决算结构)',
			xtype : 'numberfield',
			maxLength : 2
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

		}

];

function saveOrUpdate(gcTypeObj) {
	Ext.Ajax.request({
				method : 'post',
				url : servletName,
				params : {
					ac : 'save-update-node',
					id : gcTypeObj.uids,
					beanType : 'gcType'
				},
				jsonData : Ext.encode(gcTypeObj),
				success : function(result, request) {
					treePanel.getLoader().load(treePanel.getRootNode(), function(){
						treePanel.getRootNode().expand(true);
					});
					Ext.example.msg('保存', '保存成功!');
				},
				failure : function(result, request) {
					
					Ext.Msg.show({
								title : '操作失败',
								msg : '操作失败',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});

				}

			});

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
				var currObj = formPanel.getForm().getValues();

				saveOrUpdate(currObj);
			}
		})

var closeBtn = new Ext.Button({// 关闭按钮
	name : "close",
	text : "关闭",
	iconCls : 'icon-delete',
	handler : function() {
		formPanel.collapse();
	}
});

// form的fieldset
var formFieldSet = new Ext.form.FieldSet({
			title : formPanelTitle,
			layout : 'form',
			border : true,
			labelWidth : 140,
			defaults : {
				width : 140,
				border : true
			},
			defaultType : 'textfield',
			items : formItems,
			buttons : [ saveBtn]
		});

var formPanel = new Ext.FormPanel({
			id : 'formPanel',
			header : false,
			border : false,
			width : 330,
			split : true,
			collapsible : false,
			collapsed : false,
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