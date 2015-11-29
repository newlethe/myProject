var beanName = "com.sgepit.pmis.material.hbm.MatFrame";
var primaryKey = "uuid";
var formPanelTitle = "编辑记录（查看详细信息）";
var pid = PID;

   
    var fm = Ext.form;			// 包名简写（缩写）
    
    var fc = {		// 创建编辑域配置
    	 'uuid': {
			name: 'uuid',
			fieldLabel: '材料结构主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'catNo': {
			name: 'catNo',
			fieldLabel: '分类编号',
			readOnly: true,
			anchor:'95%'
         }, 'catName': {
			name: 'catName',
			fieldLabel: '品名(分类)<font color=red>*</font>',
			anchor:'95%'
         }, 'spec': {
			name: 'spec',
			fieldLabel: '规格',
			anchor:'95%'
         }, 'warehouse': {
			name: 'warehouse',
			fieldLabel: '仓库名',
			anchor:'95%'
         }, 'wareNo': {
			name: 'wareNo',
			fieldLabel: '货位号',
			anchor:'95%'
         }, 'unit': {
			name: 'unit',
			fieldLabel: '单位',
			anchor:'95%'
         }, 'price': {
			name: 'price',
			fieldLabel: '单价',
			anchor:'95%'
         }, 'enName': {
			name: 'enName',
			fieldLabel: '英文名',
			anchor:'95%'
         }, 'appid': {
			name: 'appid',
			fieldLabel: '物资申请主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'isleaf': {
			name: 'isleaf',
			fieldLabel: '是否子节点',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'parent': {
			name: 'parent',
			fieldLabel: '父节点',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			width: 160,
			height: 70,
			anchor:'95%'
         }
    }
    
    // 3. 定义记录集
    var ColumnsF = [
		{name: 'pid', type: 'string'},
		{name: 'uuid', type: 'string'},
		{name: 'catNo', type: 'string'},
		{name: 'catName', type: 'string'},
		{name: 'spec', type: 'string'},
		{name: 'warehouse', type: 'string'},
		{name: 'wareNo', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'enName', type: 'string'},
		{name: 'remark', type: 'string'}, 
		{name: 'appid', type: 'string'}, 
		{name: 'isleaf', type: 'float'}, 
		{name: 'parent', type: 'string'}
	];
    // 6. 创建表单form-panel
    var saveBtn = new Ext.Button({
		name: 'save',
       text: '保存',
       iconCls: 'save',
       disabled: true,
       handler: formSave
	})
	
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        width : 300,
        height: 200,
        split: true,
        collapsible : true,
        collapseMode : 'mini',
        collapsed: true, 
        minSize: 200,
        maxSize: 400,
        labelWith: 60,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			id: 'fieldset',
    			title: '材料结构维护编辑页',
            	layout: 'form',
            	border: true,
            	items: [
		            new fm.TextField(fc['catName']),
		            new fm.TextField(fc['catNo']),
		            new fm.TextField(fc['spec']),
		            new fm.TextField(fc['enName']),
		            new fm.TextField(fc['unit']),
		            new fm.NumberField(fc['price']),
		            new fm.TextField(fc['warehouse']),
		            new fm.TextField(fc['wareNo']),
					new fm.TextArea(fc['remark']),
		            saveBtn
    			]
    		}),
    		new fm.NumberField(fc['isleaf']),
            new fm.TextField(fc['parent']),
			new fm.TextField(fc['pid']),   
			new fm.TextField(fc['appid']), 
			new fm.TextField(fc['uuid'])
    	]
    });
    
    
    // 表单保存方法
    
    function formSave(){
    	saveBtn.setDisabled(true);  
    	var form = formPanel.getForm();
    	if (form.isValid()){
	    	if (formPanel.isNew) {
	    		doFormSave(true)  //新增
	    	} else {
	    		doFormSave(false)//修改
	    	}
	    }
    }
    
    function doFormSave(isNew){
    	var form = formPanel.getForm();
    	var obj = new Object();
    	for (var i=0; i<ColumnsF.length; i++){
    		var name = ColumnsF[i].name;
    		var field = form.findField(name);
    		if (field){
    			obj[name] = field.getValue();
    		} 
    	}
        treePanel.getEl().mask("loading...");
   		matFrameMgm.updateMatFrame(obj, function(){
   				var node = isNew&&!tmpNode.isLeaf() ? tmpNode : tmpNode.parentNode;

			    if (isNew) {
			    	var uuid = node.text == rootText ? "0" : node.attributes.uuid;
			    	var baseParams = treePanel.loader.baseParams
					baseParams.parent = uuid;	
			    }

		    	if (node.isExpanded()) {

		    		var uuid = node.text == rootText ? "0" : node.attributes.uuid;
		    		var baseParams = treePanel.loader.baseParams
					baseParams.parent = uuid;
			    	treeLoader.load(node);
			    	node.expand();
		    	} else {
		    		treeLoader.load(node);
		    		node.expand();
		    	}
				Ext.example.msg('保存成功！', '您成功保存了一条信息！');
				treePanel.getEl().unmask();	
   			
   		});
    }
    
    function formCancel(){
	   	formPanel.getForm().reset();
    }



