var beanName = "com.sgepit.pmis.finalAccounts.basicData.hbm.FAAssetsSortHBM";
var primaryKey = "uids";
var formPanelTitle = "编辑记录（查看详细信息）";

    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		            // 创建编辑域配置
    	'uids': {
			name: 'uids',
			fieldLabel: '资产分类主键',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }, 'assetsNo': {
			name: 'assetsNo',
			fieldLabel: '资产编码',
			anchor:'95%'
         }, 'assetsName': {
			name: 'assetsName',
			fieldLabel: '资产名称',
			anchor:'95%'
         }, 'unit': {
			name: 'unit',
			fieldLabel: '单位',
			anchor:'95%'
         }, 'depreciationRate': {
			name: 'depreciationRate',
			fieldLabel: '折旧率',
			anchor:'95%'
         }, 'isleaf': {
			name: 'isleaf',
			fieldLabel: '是否子节点',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }, 'parentId': {
			name: 'parentId',
			fieldLabel: '父节点',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }
    }
    
    // 3. 定义记录集
    var Columns = [
		{name: 'uids', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'assetsNo', type: 'string'},
		{name: 'assetsName', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'depreciationRate', type: 'float'},
		{name: 'isleaf', type: 'float'},
		{name: 'parentId', type: 'string'}
	];

	// 6. 创建表单form-panel
    var saveBtn = new Ext.Button({
		name: 'save',
        text: '保存',
        iconCls: 'save',
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
        collapsed: true,
        collapseMode : 'mini',
        minSize: 300,
        maxSize: 400,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '资产分类编辑页',
            	layout: 'form',
            	border: true,
            	items: [
		            new fm.TextField(fc['assetsName']),
		            new fm.TextField(fc['assetsNo']),
		            new fm.TextField(fc['unit']),
		            new fm.NumberField(fc['depreciationRate']),
		            saveBtn
    			]
    		}),
    		new fm.TextField(fc['isleaf']),
            new fm.TextField(fc['parentId']),
			new fm.TextField(fc['uids']),
			new fm.TextField(fc['pid'])
    	]
    });
    
    
    // 表单保存方法
    function formSave(){
    	saveBtn.setDisabled(true);   
    	var form = formPanel.getForm();
    	if (form.isValid()){
	    	if (formPanel.isNew) {
	    		doFormSave(true,tmpLeaf)  //修改
	    	} else {
	    		doFormSave(false,tmpLeaf)//新增
	    	}
	    }
    }
    
    function doFormSave(isNew,leaf){
    	var form = formPanel.getForm();
    	var obj = new Object();
    	for (var i=0; i<Columns.length; i++){
    		var name = Columns[i].name;
    		var field = form.findField(name);
    		if (field) obj[name] = field.getValue();
    	}
    	obj.pid = CURRENTAPPID;
        treePanel.getEl().mask("loading...");
   		faAssetsService.addOrUpdateSort(obj, function(){
			var node = isNew&&!tmpNode.isLeaf() ? tmpNode : tmpNode.parentNode;
		    if (isNew) {
		    	var uids = node.text == rootText ? "0" : node.attributes.uids;
		    	var baseParams = treePanel.loader.baseParams
				baseParams.parent = uids;
		    }
	    	if (node.isExpanded()) {
		    	treeLoader.load(node);
		    	node.expand();
	    	} else {
	    		node.expand();
	    	}
			Ext.example.msg('保存成功！', '您成功保存了一条资产分类信息！');
   			treePanel.getEl().unmask("loading...");
   		});
    }
    
    function formCancel(){
	   	formPanel.getForm().reset();
    }



