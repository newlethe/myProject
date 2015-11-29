var beanName = "com.sgepit.pmis.budgetNk.hbm.BudgetPayAppNk";
var pid = CURRENTAPPID;

// 所有表单域
var formItems = [{
			name : 'payappid',
			fieldLabel : '变更主键',
			readOnly : true,
			xtype : 'hidden' // 隐藏域
		}, {
			name : 'bdgid',
			fieldLabel : '概算主键',
			xtype : 'hidden'
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
			name : 'proname',
			xtype : 'hidden'
		}, {
			name : 'actiondate',
			xtype : 'hidden'
		}, {
			name : 'begindate',
			xtype : 'hidden'
		}, {
			name : 'enddate',
			xtype : 'hidden'
		}, {
			name : 'auditing',
			xtype : 'hidden'
		}, {
			name : 'passpay',
			xtype : 'hidden'
		}, {
			name : 'realBdgMoney',
			fieldLabel : '本合同分摊',
			xtype : 'numberfield',
			decimalPrecision : 4,
			readOnly : true
		}, {
			name : 'applypay',
			fieldLabel : '申请支付',
			decimalPrecision : 4,
			xtype : 'numberfield',
			allowBlank : false
		}, {
			name : 'factpay',
			fieldLabel : '实际金额',
			decimalPrecision : 4,
			xtype : 'numberfield',
			allowBlank : false
		}, {
			name : 'isLeaf',
			xtype : 'hidden'// 隐藏域
		}, {
			name : 'parent',
			xtype : 'hidden'// 隐藏域
		}, {
			name : 'payappno',
			xtype : 'hidden'
		}, {
			name : 'remark',
			fieldLabel : '备注',
			xtype : 'textarea'
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
			title : '付款分摊修改',
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
			id : 'pay-app-form-panel',
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

// 修改付款分摊信息
function update(currAppObj) {

	var mask = new Ext.LoadMask(Ext.getBody(), {
				msg : "正在更新..."
			});
	mask.show();
	Ext.Ajax.request({
		method : 'post',

		url : 'servlet/BudgetPayAppServlet',
		params : {
			ac : 'updatePayApp'
		},
		jsonData : Ext.encode(currAppObj),
		success : function(result, request) {
			var difference = parseFloat(currAppObj.factpay)
					- parseFloat(tempNode.attributes.factpay);
			// alert(difference);

			tempNode.attributes.sumfactpay = parseFloat(tempNode.attributes.sumfactpay)
					+ difference;

			tempNode.attributes.factpay = currAppObj.factpay;
			tempNode.attributes.applypay = currAppObj.applypay;
			refreshNodeColumns(tempNode);
			if (tempNode.parentNode) {
				sumPayAppValue(tempNode.parentNode, difference);
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
function sumPayAppValue(node, difference) {
	if (!node.parentNode)
		return;

	var childNodes = node.childNodes;
	var sum = 0.0;
	var sum2 = 0.0;
	for (var i = 0; i < childNodes.length; i++) {
		sum += parseFloat(childNodes[i].attributes.factpay);
		sum2 += parseFloat(childNodes[i].attributes.applypay);
	}
	node.attributes.factpay = sum;
	node.attributes.applypay = sum2;

	// 总金额
	node.attributes.sumfactpay = parseFloat(node.attributes.sumfactpay)
			+ difference;

	refreshNodeColumns(node);
	sumPayAppValue(node.parentNode, difference);
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
