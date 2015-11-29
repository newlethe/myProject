var beanName = "com.sgepit.pmis.budgetNk.hbm.BudgetMoneyAppNk";
var beanNameInfo = "ccom.sgepit.pmis.budgetNk.hbm.BudgetNk";
var pid = CURRENTAPPID;

// 所有表单域
var formItems = [{
			name : 'appid',
			fieldLabel : '分摊主键',
			readOnly : true,
			xtype : 'hidden' // 隐藏域
		}, {
			name : 'pid',
			fieldLabel : '项目工程编号',
			xtype : 'hidden'// 隐藏域
		}, {
			name : 'conid',
			fieldLabel : '内部流水号',
			xtype : 'hidden'
		}, {
			name : 'bdgName',
			fieldLabel : '概算名称',
			xtype : 'textfield',
			readOnly : true
		}, {
			name : 'bdgNo',
			fieldLabel : '财务编码',
			xtype : 'textfield',
			readOnly : true
		}, {
			name : 'bdgMoney',
			fieldLabel : '概算金额',
			xtype : 'numberfield',
			decimalPrecision : 4,
			readOnly : true
		}, {
			name : 'realMoney',
			fieldLabel : '本合同分摊',
			decimalPrecision : 4,
			xtype : 'numberfield',
			allowBlank : false
		}, {
			name : 'prosign',
			fieldLabel : '项目标示',
			xtype : 'hidden'
		}, {
			name : 'remark',
			fieldLabel : '备注',
			xtype : 'textarea'
		}, {
			name : 'bdgid',
			fieldLabel : '概算主键',
			xtype : 'hidden'
		}, {
			name : 'isLeaf',
			xtype : 'hidden'// 隐藏域
		}, {
			name : 'parent',
			xtype : 'hidden'// 隐藏域
		}]

// 保存按钮
var saveBtn = new Ext.Button({
			name : 'save',
			text : '保存',
			iconCls : 'save',
			handler : function() {
				// 避免重复提交
				this.setDisabled(true);
				
				var currAppObj = formPanel.getForm().getValues();

				update(currAppObj);
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
			title : '合同分摊修改',
			layout : 'form',
			border : true,
			defaults : {
				width : 160,
				border : true
			},
			defaultType : 'textfield',
			items : formItems,
			buttons : [closeBtn, saveBtn]
		});

var formPanel = new Ext.FormPanel({
			id : 'money-appform-panel',
			header : false,
			border : false,
			width : 300,
			labelWidth : 70,
			split : true,
			collapsible : true,
			collapsed : true,
			collapseMode : 'mini',
			minSize : 200,
			maxSize : 400,
			border : false,
			region : 'east',
			bodyStyle : 'padding:10px 10px; border:0px dashed #3764A0',
			labelAlign : 'left',
			items : [formFieldSet]
		});

// 添加/修改概算信息
function update(currAppObj) {

	var mask = new Ext.LoadMask(Ext.getBody(), {
				msg : "正在更新..."
			});
	mask.show();
	Ext.Ajax.request({
		method : 'post',

		url : 'servlet/BudgetMoneyAppServlet',
		params : {
			ac : 'updateMoneyApp'
		},
		jsonData : Ext.encode(currAppObj),
		success : function(result, request) {
			var difference = parseFloat(currAppObj.realMoney)
					- parseFloat(tempNode.attributes.realMoney);
			// alert(difference);
			tempNode.attributes.realMoney = currAppObj.realMoney;
			tempNode.attributes.sumRealMoney = parseFloat(tempNode.attributes.sumRealMoney)
					+ difference;
			refreshNodeColumns(tempNode);
			if (tempNode.parentNode) {
				sumBdgAppValue(tempNode.parentNode, difference);
			}
			mask.hide();
			Ext.example.msg('保存成功！', '您成功保存了一条概算信息！');

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

// 将修改的结果逐级向父节点统计
function sumBdgAppValue(node, change) {
	if (!node.parentNode)
		return;

	var childNodes = node.childNodes;
	var sum = 0.0;
	for (var i = 0; i < childNodes.length; i++) {
		sum += parseFloat(childNodes[i].attributes.realMoney);

	}
	node.attributes.realMoney = sum;

	// 总金额
	node.attributes.sumRealMoney = parseFloat(node.attributes.sumRealMoney)
			+ change;

	refreshNodeColumns(node);
	sumBdgAppValue(node.parentNode, change);
}

// 刷新节点显示数据
function refreshNodeColumns(n) {
	var t = n.getOwnerTree();
	var a = n.attributes;
	var cols = t.columns;
	var el = n.ui.getEl().firstChild; // <div class="x-tree-el">
	var cells = el.childNodes;

	// <div class="x-tree-col"><div class="x-tree-col-text">

	for (var i = 1, len = cols.length; i < len; i++) {
		var d = cols[i].dataIndex;
		var v = (a[d] != null) ? a[d] : '';
		if (cols[i].renderer)
			v = cols[i].renderer(v);
		cells[i].firstChild.innerHTML = v;
	}
}
