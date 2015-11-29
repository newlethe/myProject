var fm = Ext.form;
var fc = {		
    'pid': {
		name: 'pid',
		fieldLabel: 'PID',
		readOnly:true,
		hidden:true,
		hideLabel:true,
		allowBlank: false,
		anchor:'95%'
    }, 'treeid': {
		name: 'treeid',
		fieldLabel: '分类主键',
		readOnly:true,
		hidden:true,
		hideLabel:true,
		anchor:'95%'
    }, 'bm': {
		name: 'bm',
		fieldLabel: '编码',
		disabled:true,
		anchor:'95%'
    }
    , 'orgid': {
		name: 'orgid',
		fieldLabel: '部门id',
		readOnly:true,
		hidden:true,
		hideLabel:true,
		anchor:'95%'
    }, 'indexid': {
		name: 'indexid',
		fieldLabel: '系统自动生成编码',
		hidden:true,
		hideLabel:true,
		anchor:'95%'
    }
    , 'mc': {
		name: 'mc',
		fieldLabel: '分类名称<font color=\'red\'>*</font>',
		disabled:true,
		allowBlank: false,
		anchor:'95%'
    }, 'isleaf': {
		name: 'isleaf',
		fieldLabel: '是否子节点',
		readOnly:true,
		hidden:true,
		hideLabel:true,
		anchor:'95%'
    }, 'parent': {
		name: 'parent',
		fieldLabel: '父节点',
		readOnly:true,
		hidden:true,
		hideLabel:true,
		anchor:'95%'
    }
}

var Columns = [
	{name: 'pid', type: 'string'},
	{name: 'treeid', type: 'string'},
    {name: 'mc', type: 'string'},
	{name: 'isleaf', type: 'float'},
	{name: 'parent', type: 'string'},
	{name: 'bm', type: 'string'},
	{name: 'indexid', type: 'string'},
	{name: 'orgid', type: 'string'}
];

var saveBtn = new Ext.Button({
	name: 'save',
    text: '保存',
    iconCls: 'save',
    handler: formSave,
    disabled: true
})

var formPanel = new Ext.FormPanel({
    id: 'form-panel',
    header: false,
    width : 400,
    height: 200,
    split: true,
    collapsible : true,
    collapseMode : 'mini',
    minSize: 300,
    maxSize: 400,
    border: false,
    region: 'east',
    bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
	iconCls: 'icon-detail-form',
	labelAlign: 'left',
	items: [
		new Ext.form.FieldSet({
			title: '基本信息',
        	layout: 'form',
        	border: true,
        	items: [
        	    new fm.TextField(fc['treeid']),
                new fm.TextField(fc['mc']),
                new fm.TextField(fc['bm']),         
                saveBtn
			]
		}),  
		  		new fm.TextField(fc['isleaf']),
	            new fm.TextField(fc['parent']),
	            new fm.TextField(fc['indexid']),
				new fm.TextField(fc['pid']),
				new fm.TextField(fc['orgid'])
				
	]
});

		function formSave(){
			saveBtn.setDisabled(true);
			var form = formPanel.getForm();
			form.findField("bm").disable();
			form.findField("mc").disable();
			if (form.isValid()){
		    	if (formPanel.isNew) {	    
		    		doFormSave(true,tmpLeaf)
		    	} else {
		    		doFormSave(false,tmpLeaf)
		    	}
		    }
		}

		function doFormSave(isNew,leaf){
			var form = formPanel.getForm();
			var obj = new Object();
			
			for (var i=0; i<Columns.length; i++){
				var name = Columns[i].name;
				var field = form.findField(name);
				if (field) {
					obj[name] = field.getValue();
				}
			}
			treePanel.getEl().mask("loading...");
			zlMgm.addOrUpdate(obj, indexid, orgid, function(flag){
				if ("0" == flag){
					var node = isNew == true && !tmpNode.isLeaf ? tmpNode.parentNode:tmpNode;
					if(isNew == true && tmpNode.attributes.isleaf == 1){
						node = tmpNode.parentNode;
					}
				    if (isNew) {
				    	/*var treeData = node.text == rootText ? "root" : node.attributes.treeid;
				    	var baseParams = treePanel.loader.baseParams
							baseParams.parent = treeData;*/
				   }
				   if(isNew == false){
				   		node = tmpNode.parentNode;
				   }
			    	if (node.isExpanded()) {
			    		var parent = node.attributes.treeid;
						var baseParams = treePanel.loader.baseParams
						baseParams.parent = parent;
				    	treeLoader.load(node);
				    	node.expand();		    	
			    	} else {
			    		var parent = node.attributes.treeid;
						var baseParams = treePanel.loader.baseParams
						baseParams.parent = parent;
			    		treeLoader.load(node);
			    		node.expand();
			    	}
					Ext.example.msg('保存成功！', '您成功保存了一条信息！');
				}else{
					Ext.Msg.show({
						title: '提示',
						msg: '数据保存失败！',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
				}
				treePanel.getEl().unmask("loading...");
			});
}