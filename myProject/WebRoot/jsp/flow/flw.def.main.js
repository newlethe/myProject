parent.flwDefWindow.getBottomToolbar().items.get('next').disable();
window.document.onmousedown = controlNext;
window.document.onkeydown = controlNext;
var panel;

Ext.onReady(function(){
	panel = new Ext.form.FormPanel({
		border: false,
		bodyBorder: false,
    	bodyStyle: 'padding:50px 25px;',
    	iconCls: 'icon-detail-form',
    	baseCls: 'x-panel-flow',
    	labelAlign: 'right',
    	items: [{
    		layout: 'column',
    		border: false,
    		bodyStyle: 'background: none;',
    		items: [{
    			columnWidth: .4, layout: 'form',
    			border: false, bodyStyle: 'background: none;',
    			items: [{
    				xtype: 'textfield', 
    				name: 'flowid', fieldLabel: '流程定义ID',
	    			hidden: true, hideLabel: true, border: true
    			}]
    		},{
    			columnWidth: .6, layout: 'form',
    			border: false, bodyStyle: 'background: none;',
    			items: [{
	    			xtype: 'textfield', 
	    			width: 150, 
	    			name: 'flowTitle',
	    			fieldLabel: '<font color=#15428b><b>流程名称</b></font>',
	    			border: true, allowBlank: false
				}]
    		}]
    	}]
	});

	var viewport = new Ext.Viewport({
		layout: 'fit',
		border: false,
		items: [panel]
	});

	if (parent._flwTitle != null){
		panel.getForm().findField('flowTitle').setValue(parent._flwTitle);
	}
	panel.getForm().findField('flowTitle').getEl().dom.select();
});

function controlNext(){
	if (panel.getForm().isValid()){
		parent._flwTitle = panel.getForm().findField('flowTitle').getValue();
		parent.flwDefWindow.getBottomToolbar().items.get('next').enable();
	} else {
		parent.flwDefWindow.getBottomToolbar().items.get('next').disable();
	}
}