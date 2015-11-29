var beanName = "com.sgepit.frame.flow.hbm.GczlJyxm";
var primaryKey = "uids";
var formPanelTitle = "编辑记录（查看详细信息）";
var pid = CURRENTAPPID;

var fm = Ext.form; // 包名简写（缩写）

var gcTypeArr = new Array(); // 存放工程类别数据
var gcTypeStore; // 工程类别下拉框数据源
DWREngine.setAsync(false);
appMgm.getCodeValue('工程类别', function(list) { // 获取工程类别

			// 添加空选项
			gcTypeArr.push(['', '']);

			for (i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].propertyCode);
				temp.push(list[i].propertyName);
				gcTypeArr.push(temp);
			}
		});
DWREngine.setAsync(true);

gcTypeStore = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data : gcTypeArr
		});

var fc = { // 创建编辑域配置
	'xmbh' : {
		name : 'xmbh',
		fieldLabel : '检验项目编号',
		readOnly : true,
		anchor : '95%'
	},
	'xmmc' : {
		name : 'xmmc',
		fieldLabel : '项目名称',
		anchor : '95%'
	},
	'parentbh' : {
		name : 'parentbh',
		fieldLabel : '父节点',
		readOnly : true,
		anchor : '95%'
	},
	'isleaf' : {
		name : 'isleaf',
		fieldLabel : '是否子节点',
		readOnly : true,
		hidden : true,
		hideLabel : true,
		anchor : '95%'
	},
	'uids' : {
		name : 'uids',
		fieldLabel : '主键',
		readOnly : true,
		hidden : true,
		hideLabel : true,
		anchor : '95%'
	},
	'gcType' : { // 工程类别 2011-1-10
		name : 'gcType',
		editable : false,
		fieldLabel : '工程类别',
		valueField : 'k',
		displayField : 'v',
		inputType : 'select-one',
		mode : 'local',
		typeAhead : true,
		triggerAction : 'all',
		allowBlank : true,
		store : gcTypeStore,
		tpl : '<tpl for=".">' + '<div class="x-combo-list-item">'
				+ '{v}&nbsp;' + '</div></tpl>',
		anchor : '95%'
	}

}

// 3. 定义记录集
var Columns = [{
			name : 'uids',
			type : 'string'
		}, {
			name : 'xmbh',
			type : 'string'
		}, {
			name : 'xmmc',
			type : 'string'
		}, {
			name : 'isleaf',
			type : 'string'
		}, {
			name : 'parentbh',
			type : 'string'
		}, {
			name : 'gcType',
			type : 'string'
		}];

// 6. 创建表单form-panel
var saveBtn = new Ext.Button({
			name : 'save',
			text : '保存',
			iconCls : 'save',
			handler : formSave
		})

var formPanel = new Ext.FormPanel({
			id : 'form-panel',
			header : false,
			border : false,
			width : 300,
			height : 200,
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
			items : [
					new Ext.form.FieldSet({
								title : '检验项目结构树编辑页',
								layout : 'form',
								border : true,
								items : [new fm.TextField(fc['xmbh']),
										new fm.TextField(fc['parentbh']),
										new fm.TextField(fc['xmmc']),
										new fm.ComboBox(fc['gcType']), saveBtn]
							}), new fm.TextField(fc['isleaf']),
					new fm.TextField(fc['uids'])]
		});

// 表单保存方法
function formSave() {
	saveBtn.setDisabled(true);
	var form = formPanel.getForm();
	if (form.isValid()) {
		if (formPanel.isNew) {
			doFormSave(true, tmpLeaf) // 修改
		} else {
			doFormSave(false, tmpLeaf)// 新增
		}
	}
}

function doFormSave(isNew, leaf) {
	var form = formPanel.getForm();
	var obj = new Object();
	for (var i = 0; i < Columns.length; i++) {
		var name = Columns[i].name;
		var field = form.findField(name);
		if (field)
			obj[name] = field.getValue();
	}

	DWREngine.setAsync(false);
	gczlJyxmImpl.addOrUpdate(obj, function(flag) {
				if ("0" == flag) {
					var tree = Ext.getCmp("budget-tree-panel")
					var path = tempNode.getPath();
					if (tempNode.parentNode) {
						tempNode.parentNode.reload();
					} else {
						tempNode.reload()
					}
					tree.expandPath(path, null, function() {
								var curNode = tree.getNodeById(tempNode.id);
								curNode.select()
							})
					Ext.example.msg('保存成功！', '您成功保存了一条检验项目信息！');
				} else {
					Ext.Msg.show({
								title : '提示',
								msg : '数据保存失败！',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
	DWREngine.setAsync(true);
}

function formCancel() {
	formPanel.getForm().reset();
}
