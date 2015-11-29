
var beanName = "com.sgepit.pmis.budget.hbm.BdgMoneyApp";
var beanNameInfo = "com.sgepit.pmis.budget.hbm.BdgInfo";
var pid = CURRENTAPPID;
var rootNew = null;
var treePanelNew = null;
var otherId;

    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	'uuid': {
			name: 'uuid',
			fieldLabel: '主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'otherUuid': {
			name: 'otherUuid',
			fieldLabel: '主表主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'bdgUuid': {
			name: 'bdgUuid',
			fieldLabel: '概算主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'bdgno': {
			name: 'bdgno',
			fieldLabel: '财务编码',
			readOnly: true,
			anchor:'95%'
         }, 'bdgname': {
			name: 'bdgname',
			fieldLabel: '概算名称',
			readOnly: true,
			anchor:'95%'
         }, 'bdgmoney': {
			name: 'bdgmoney',
			fieldLabel: '概算金额',
			readOnly: true,
			anchor:'95%'
         }, 'sumMoney': {
			name: 'sumMoney',
			fieldLabel: '累计金额',
			readOnly: true,
			anchor:'95%'
         }, 'sumPercent': {
			name: 'sumPercent',
			fieldLabel: '累计百分比',
			readOnly: true,
			anchor:'95%'
         }, 'remainder': {
			name: 'remainder',
			fieldLabel: '差额',
			readOnly: true,
			anchor:'95%'
         }, 'monthMoney': {
			name: 'monthMoney',
			fieldLabel: '当月金额',
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
    
    // 3. 定义记录集
    var Columns = [
    	{name: 'uuid', type: 'string'},
		{name: 'otherUuid', type: 'string'},
		{name: 'bdgUuid', type: 'string'},
		{name: 'sumMoney', type: 'float'},
		{name: 'monthMoney', type: 'float'},
		{name: 'bdgname', type: 'string'},
		{name: 'bdgno', type: 'float'},
		{name: 'bdgmoney', type: 'string'},
		{name: 'sumPercent', type: 'float'},
		{name: 'remainder', type: 'float'},
		{name: 'isleaf', type: 'float'},
		{name: 'parent', type: 'string'}
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
        labelWidth: 70, 
        height: 200,
        split: true,
        collapsible : true,
        collapsed: true,
        collapseMode : 'mini',
        minSize: 200,
        maxSize: 400,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '其他费用投资完成修改页',
            	layout: 'form',
            	border: true,
            	items: [
            		new fm.TextField(fc['bdgname']),
            		new fm.TextField(fc['bdgno']),
            		new fm.NumberField(fc['bdgmoney']),
		            new fm.NumberField(fc['sumMoney']),
		            new fm.NumberField(fc['sumPercent']),
		            new fm.NumberField(fc['remainder']),
		            new fm.NumberField(fc['monthMoney']),
					saveBtn
    			]
    		}),
    		new fm.TextField(fc['uuid']),
			new fm.TextField(fc['otherUuid']),
    		new fm.TextField(fc['bdgUuid']),
			new fm.TextField(fc['isleaf']),
            new fm.TextField(fc['parent'])
    	]
    });
    
	// 表单保存方法
    function formSave(){
    	saveBtn.setDisabled(true); 
    	var form = formPanel.getForm();
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
    		if (field) obj[name] = field.getValue();
    	}
    	if (!obj['monthMoney']){
    		obj['monthMoney'] = 0;
    	}
    	treePanelNew.getEl().mask("loading...");
   		othCompletionMgm.addOrUpdateBdgMoneyApp(obj, function(flag){
   			if ("0" == flag){
   				var node = tmpNode.parentNode;
			  
		    	if (node.isExpanded()) {
			    	var bdgUuid = node.text == rootText ? "0" : node.attributes.bdgUuid;
			    	var baseParams = treePanelNew.loader.baseParams ;
					baseParams.parent = bdgUuid;
					baseParams.otherId = otherId;
			    	treeLoaderNew.load(node);
			    	node.expand();
		    	} else {
		    		node.expand();
		    	}
		    	treePanelNew.getEl().unmask();
				Ext.example.msg('保存成功！', '您成功保存了一条概算信息！');
   			}else{
   				treePanelNew.getEl().unmask();
   				Ext.Msg.show({
					title: '提示',
					msg: '数据保存失败！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
   			}
   		});
    }
   
    function formCancel(){
	   formPanel.getForm().reset();
    }
	





