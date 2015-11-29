var formPanelTitle = "编辑概算信息";
var saveBtn;
var servletName = "servlet/BdgStructureServlet";


// 选项对象(通用)
var SelectItem = Ext.data.Record.create([{
			name : 'key'
		}, {
			name : 'value'
		}]);
// 下拉列表reader(通用)
var selReader = new Ext.data.ArrayReader({
			id : 'key'
		}, ['key', 'value']);

// 工程类型下拉列表
var gcTypeStore = new Ext.data.Store({

			url : servletName,
			baseParams : {
				ac : 'listbox-gctype'
			},

			reader : selReader
		});

gcTypeStore.load({
			callback : function() {
				// 插入空选项
				var emptySel = new SelectItem({
							key : '',
							value : ''

						});
				gcTypeStore.insert(0, emptySel);
			}
		});

var gcTypeCombo = new Ext.form.ComboBox({
			name : 'gcType',
			fieldLabel : '工程类型',
			typeAhead : true,
			triggerAction : 'all',
			mode : 'local',
			lazyRender : true,
			store : gcTypeStore,
			valueField : 'key',
			displayField : 'value',
			allowBlank : true,
			tpl : '<tpl for=".">' + '<div class="x-combo-list-item">'
					+ '{value}&nbsp;' + '</div></tpl>'
		});

var buildBdgField = new Ext.form.Hidden({
			name : 'buildbdg',
			fieldLabel : 'buildbdg',
			readOnly : true
		});
var buildBdgTrigger = new Ext.form.TriggerField({
			id : 'build',
			name : 'buildno',
			fieldLabel : '建筑概算编号',
			readOnly : true
		});
var buildNameField = new Ext.form.TextField({
			name : 'buildname',
			fieldLabel : '建筑概算名称',
			readOnly : true
		});
var equipBdgField = new Ext.form.Hidden({
			name : 'equipbdg',
			fieldLabel : 'equipbdg',
			readOnly : true
		});
var equipBdgTrigger = new Ext.form.TriggerField({
			id : 'equip',
			name : 'equipno',
			fieldLabel : '设备概算编号',
			readOnly : true
		});
var equipNameField = new Ext.form.TextField({
			name : 'equipname',
			fieldLabel : '设备概算名称',
			readOnly : true
		});
var installBdgField = new Ext.form.Hidden({
			name : 'installbdg',
			fieldLabel : 'installbdg',
			readOnly : true
		});
var installBdgTrigger = new Ext.form.TriggerField({
			id : 'install',
			name : 'installno',
			fieldLabel : '安装概算编号',
			readOnly : true
		});
var installNameField = new Ext.form.TextField({
			name : 'installname',
			fieldLabel : '安装概算名称',
			readOnly : true
		});
var otherBdgField = new Ext.form.Hidden({
			name : 'otherbdg',
			fieldLabel : 'otherbdg',
			readOnly : true
		});
var otherBdgTrigger = new Ext.form.TriggerField({
			id : 'other',
			name : 'otherno',
			fieldLabel : '其它概算编号',
			readOnly : true
		});
var otherNameField = new Ext.form.TextField({
			name : 'othername',
			fieldLabel : '其它概算名称',
			readOnly : true
		});

buildBdgTrigger.onTriggerClick = selectBdg;
equipBdgTrigger.onTriggerClick = selectBdg;
installBdgTrigger.onTriggerClick = selectBdg;
otherBdgTrigger.onTriggerClick = selectBdg;

// 所有表单域
var formItems = [{
			name : 'bdgid',
			fieldLabel : 'bdgid',
			xtype : 'hidden',
			readOnly : true
		}, {
			name : 'pid',
			fieldLabel : 'PID',
			readOnly : 'true',
			xtype : 'hidden'
		}, {
			name : 'bdgno',
			fieldLabel : '编号',
			allowBlank : false
		}, {
			name : 'bdgname',
			fieldLabel : '概算名称',
			allowBlank : false
		}, gcTypeCombo, buildBdgField, buildBdgTrigger, buildNameField,
		equipBdgField, equipBdgTrigger, equipNameField, installBdgField,
		installBdgTrigger, installNameField, otherBdgField, otherBdgTrigger,
		otherNameField, {
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
			name : 'correspondbdg',
			fieldLabel : '对应概算',
			readOnly : true,
			xtype : 'hidden'
		}

];

function saveOrUpdate(bdgObj) {
	Ext.Ajax.request({
				method : 'post',
				url : servletName,
				params : {
					ac : 'save-update-node',
					id : bdgObj.bdgid,
					beanType : 'faBdgInfo'
				},
				jsonData : Ext.encode(bdgObj),
				success : function(result, request) {

					Ext.example.msg('保存', '保存成功!');

					var state = treePanel.getState();

					// 若为添加新节点将其父节点展开
					var parentPath = treePanel.getNodeById(bdgObj.parent)
							.getPath();
					// 当前选中的节点，若是新增则选中父节点
					var activePath;
					if (bdgObj.uids == null
							|| bdgObj.uids == '') {
						activePath = parentPath;
						state.expandedNodes.push(parentPath);

					} else {
						activePath = treePanel.getNodeById(bdgObj.id).getPath();
					}

					treePanel.getLoader().load(treePanel.getRootNode(),
							function() {
								// 将树按之前状态展开
								treePanel.applyState(state, activePath);

								// 若为新增则再展开父节点

						});
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
			disabled : true,
			handler : function() {
				if (!formPanel.getForm().isValid()) {
					return;
				}

				// 避免重复提交
				this.setDisabled(true);

				// 当前的记录对象
				var currObj = formPanel.getForm().getValues();
				currObj.gcType = gcTypeCombo.getValue();
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
			labelWidth : 100,
			defaults : {
				width : 140,
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
			width : 290,
			split : true,
			collapsible : true,
			collapsed : false,
			collapseMode : 'mini',
			minSize : 200,
			maxSize : 400,
			border : false,
			region : 'east',
			bodyStyle : 'padding:10px 10px; border:0px dashed #3764A0',
			iconCls : 'icon-detail-form', // 面板样式
			labelAlign : 'left',
			items : [formFieldSet // Default config options for child items

			]
		});

function selectBdg() {

	bdgType = this.id;
	showSelectBdgWin();
}