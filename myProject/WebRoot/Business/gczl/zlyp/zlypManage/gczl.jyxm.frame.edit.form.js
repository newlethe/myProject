var beanName = "com.sgepit.frame.flow.hbm.GczlJyxm";
var primaryKey = "uids";
var formPanelTitle = "编辑记录（查看详细信息）";
var gcTypeArr = new Array();
var pid = CURRENTAPPID;

DWREngine.setAsync(false);
appMgm.getCodeValue('工程类别', function(list) { // 获取工程类别
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

    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	  'xmbh': {
			name: 'xmbh',
			fieldLabel: '检验项目编号',
			allowBlank:false,
			anchor:'95%'
         }, 'xmmc': {
			name: 'xmmc',
			fieldLabel: '项目名称',
			allowBlank:false,
			anchor:'95%'
         },'parentbh': {
			name: 'parentbh',
			fieldLabel: '父节点',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'isleaf': {
			name: 'isleaf',
			fieldLabel: '是否子节点',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'uids': {
			name: 'uids',
			fieldLabel: '主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid':{
         	name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			hideLabel:true,
			value: CURRENTAPPID
         }, 'gcType':{
			name : 'gcType',
			editable : false,
			fieldLabel : '工程类别',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : gcTypeStore,
			tpl : '<tpl for=".">' + '<div class="x-combo-list-item">'
					+ '{v}&nbsp;' + '</div></tpl>',
			anchor : '95%'
		}
    }
    
    // 3. 定义记录集
    var Columns = [
		{name: 'uids', type: 'string'},
		{name: 'xmbh', type: 'string'},
		{name: 'xmmc', type: 'string'},
		{name: 'isleaf', type: 'string'},
		{name: 'parentbh', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'gcType',type: 'string'}
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
        //labelAlign: 'right',
        layout: 'form',
        //width : 300,
        //height: 200,
        //split: true,
        //collapsible : true,
        //collapsed: true,
        //collapseMode : 'mini',
        //minSize: 300,
        //maxSize: 400,
        //border: false,
        region: 'center',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'center',
    	items: [
    		new Ext.form.FieldSet({
    			title: '检验项目结构树编辑页',
            	layout: 'form',
            	border: true,
            	items: [
		            new fm.TextField(fc['xmbh']),
		            new fm.TextField(fc['xmmc']),
		            new fm.ComboBox(fc['gcType']),
		            saveBtn
    			]
    		}),
    		new fm.TextField(fc['parentbh']),
    		new fm.TextField(fc['isleaf']),
            new fm.TextField(fc['uids']),
            new fm.TextField(fc['pid'])
    	]
    });
    
    
    // 表单保存方法
    function formSave(){
    	//saveBtn.setDisabled(true);
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
    	var win = Ext.getCmp("tree-form-win");
    	var form = formPanel.getForm();
    	var obj = new Object();
    	for (var i=0; i<Columns.length; i++){
    		var name = Columns[i].name;
    		var field = form.findField(name);
    		if (field) obj[name] = field.getValue();
    	}
    	DWREngine.setAsync(false);
   		gczlJyxmImpl.addOrUpdate(obj, function(flag){
   			if ("0" == flag){
   				var tree = Ext.getCmp("budget-tree-panel")
   				tempNode = tree.getNodeById(tempNode.id);
				var path = tempNode.getPath();
				if(tempNode.parentNode){
					tempNode.parentNode.reload();
				}else{
					tempNode.reload()	
				}
				tree.expandPath(path,null,function(){
					var curNode = tree.getNodeById(tempNode.id);
					curNode.select()
				})	
				Ext.example.msg('保存成功！', '您成功保存了一条检验项目信息！');
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
   		win.hide();
    }
    
    function formCancel(){
	   	formPanel.getForm().reset();
    }



