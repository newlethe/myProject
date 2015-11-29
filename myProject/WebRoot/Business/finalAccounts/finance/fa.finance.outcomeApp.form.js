var formPanelTitle = "编辑";
var saveBtn;
var servletName = "servlet/FAFinanceServlet";
var currentPid = CURRENTAPPID;
// 所有表单域
//是否禁用添加/修改/删除按钮
var btnDisabled = ModuleLVL != '1';
var formItems = [{
			name : 'uids',
			fieldLabel : '编号',
			xtype : 'hidden',
			readOnly : true
		}, 
		{
			name : 'pid',
			fieldLabel : 'pid'
		}	
		,{
			name : 'bdgid',
			fieldLabel : 'bdgid',
			xtype : 'hidden',
			readOnly : true
		}, {
			name : 'deferredExpense',
			fieldLabel : '待摊支出',
			xtype : 'numberfield'
		}, {
			name : 'buildPubExpense',
			fieldLabel : '建筑共益费',
			xtype : 'numberfield'
		}, {
			name : 'buildExclExpense',
			fieldLabel : '建筑专属费',
			xtype : 'numberfield'
		}, {
			name : 'installPubExpense',
			fieldLabel : '安装共益费',
			xtype : 'numberfield'
		}, {
			name : 'installExclExpense',
			fieldLabel : '安装专属费',
			xtype : 'numberfield'
		}, {
			name : 'equPubExpense',
			fieldLabel : '设备共益费',
			xtype : 'numberfield'
		}, {
			name : 'equExclExpense',
			fieldLabel : '设备专属费',
			xtype : 'numberfield'
		}, {
			name : 'exclProperties',
			fieldLabel : '专属费性质及范围',
			xtype : 'textarea'
		}

];

function saveOrUpdate(outcomeAppReport) {
	Ext.Ajax.request({
				method : 'post',
				url : servletName,
				params : {
					ac : 'save-update',
					beanType : 'faOutcomeAppReport'
				},
				jsonData : Ext.encode(outcomeAppReport),
				success : function(result, request) {

					Ext.example.msg('保存', '保存成功!');
					var state = treePanel.getState();

					// 若为添加新节点将其父节点展开
					var parentPath = treePanel.getNodeById(parentNodeId)
							.getPath();
					// 当前选中的节点，若是新增则选中父节点
					var activePath;
					if (outcomeAppReport.uids == null
							|| outcomeAppReport.uids == '') {
						activePath = parentPath;
						state.expandedNodes.push(parentPath);

					} else {
						activePath = treePanel.getNodeById(curNodeId).getPath();
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
			disabled : btnDisabled,
			handler : function() {
				// 避免重复提交
				this.setDisabled(true);
				autoCaclBtn.setDisabled(true);

				// 当前的记录对象
				var currObj = formPanel.getForm().getValues();
				if ( currObj.pid || currObj.pid == '' ){
					currObj.pid = currentPid;
				}
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

//自动分摊按钮
var autoCaclBtn = new Ext.Button({
	name : 'autoCacl',
	text : '自动分摊',
	iconCls : 'btn',
	tooltip : '将待摊支出除去专属费后按三部分资产的比例摊入共益费中',
	handler : function(){
		autoCaclPubExpense();
	}
});

// form的fieldset
var formFieldSet = new Ext.form.FieldSet({
			title : formPanelTitle,
			layout : 'form',
			border : true,
			labelWidth : 80,
			defaults : {
				width : 120,
				border : true
			},
			defaultType : 'textfield',
			items : formItems,
			buttons : [autoCaclBtn, saveBtn]
		});

var formPanel = new Ext.FormPanel({
			id : 'formPanel',
			header : false,
			border : false,
			width : 290,
			split : true,
			animCollapse : false,
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

function autoCaclPubExpense() {
	var outcomeAppObj = formPanel.getForm().getValues();
	formPanel.getForm().load({
				url : servletName,
				root : 'data',
				params : {
					json : Ext.encode(outcomeAppObj),
					ac : 'autoCaclPubExpense'
				}
				
			});
}