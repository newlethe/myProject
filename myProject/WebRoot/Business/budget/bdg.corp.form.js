
var beanName = "com.sgepit.pmis.budget.hbm.BdgCorpInfo";
var beanNameInfo = "com.sgepit.pmis.budget.hbm.BdgInfo";
var pid = CURRENTAPPID;
var rootNew = null;
var treePanelNew = null;
    
    var fm = Ext.form;			// 包名简写（缩写）
    
    var fc = {		// 创建编辑域配置
    	'corpid': {
			name: 'corpid',
			fieldLabel: '主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'basicid': {
			name: 'basicid',
			fieldLabel: '外键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'bdgno': {
			name: 'bdgno',
			fieldLabel: '概算编号',
			readOnly: true,
			anchor:'95%'
         }, 'bdgname': {
			name: 'bdgname',
			fieldLabel: '概算名称<font color=\'red\'>*</font>',
			readOnly: true,
			allowBlank: false,
			anchor:'95%'
         }, 'appmoney': {
			name: 'appmoney',
			fieldLabel: '分摊金额<font color=\'red\'>*</font>',
            allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
			anchor:'95%'
         }, 'bdgmoney': {
			name: 'bdgmoney',
			fieldLabel: '概算金额',
			readOnly: true,
            allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
         }, 'corpremark': {
			name: 'corpremark',
			fieldLabel: '备注',
			width: 240,
			height: 150,
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
    	{name: 'corpid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'basicid', type: 'string'},
		{name: 'appmoney', type: 'float'},
		{name: 'corpremark', type: 'string'},
		{name: 'bdgname', type: 'string'},
		{name: 'bdgno', type: 'string'},
		{name: 'bdgmoney', type: 'float'},
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
        width: 400,
        height: 200,
        split: true,
        collapsible : true,
        collapseMode : 'mini',
        minSize: 300,
        maxSize: 400,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '建设法人管理费',
            	layout: 'form',
            	border: true,
            	items: [
            		new fm.TextField(fc['bdgname']),
            		new fm.TextField(fc['bdgno']),
            		new fm.NumberField(fc['bdgmoney']),
		            new fm.NumberField(fc['appmoney']),
		         	new fm.TextArea(fc['corpremark']),
					
					saveBtn
    			]
    		}),
    		new fm.TextField(fc['isleaf']),
            new fm.TextField(fc['parent']),
			new fm.TextField(fc['pid']),
			new fm.TextField(fc['corpid']),
			new fm.TextField(fc['basicid']),
			new fm.TextField(fc['bdgid'])
    	]
    });
    
	// 表单保存方法
    function formSave(){
    	var form = formPanel.getForm();
    	//var ids = form.findField('appid').getValue();
    	if (form.isValid()){
	    	if (formPanel.isNew) {
	    		doFormSave(true)
	    	} else {
	    		doFormSave(false)
	    	}
	    }
    }
    
    function doFormSave(isNew){
    	var form = formPanel.getForm();
    	var obj = new Object();
    	for (var i=0; i<Columns.length; i++){
    		var name = Columns[i].name;
    		var field = form.findField(name);
    		if (field) obj[name] = field.getValue();
    	}
    	DWREngine.setAsync(false);
   		bdgCorpMgm.addOrUpdateBdgCorpInfo(obj, function(flag){
   			if ("0" == flag){
   				Ext.example.msg('保存成功！', '您成功保存了一条建设法人信息！');
   				rootNew.reload();
   				treePanelNew.expandAll();
   			}else{
   				Ext.Msg.show({
					title: '提示',
					msg: '数据保存失败！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
   			}
   		});
   		DWREngine.setAsync(true);
    }
