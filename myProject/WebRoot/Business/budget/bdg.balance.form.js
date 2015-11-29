
var beanName = "com.sgepit.pmis.budget.hbm.BdgBalApp";
var beanNameInfo = "com.sgepit.pmis.budget.hbm.BdgInfo";
var beanNameMoney = "com.sgepit.pmis.budget.hbm.BdgMoneyApp";
var pid = CURRENTAPPID;
var rootNew = null;
var treePanelNew = null;

    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {					// 创建编辑域配置
    	'balappid': {
			name: 'balappid',
			fieldLabel: '合同结算概算主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'balid': {
			name: 'balid',
			fieldLabel: '结算主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'conid': {
			name: 'conid',
			fieldLabel: '内部流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'bdgno': {
			name: 'bdgno',
			fieldLabel: '概算编号',
			readOnly:true,
			anchor:'95%'
         }, 'bdgname': {
			name: 'bdgname',
			fieldLabel: '概算名称',
			readOnly:true,
			anchor:'95%'
         }, 'bdgmoney': {
			name: 'bdgmoney',
			fieldLabel: '概算金额',
			readOnly:true,
            //allowNegative: false,
            //maxValue: 100000000,
			anchor:'95%'
         }, 'balmoney': {
			name: 'balmoney',
			fieldLabel: '结算金额',
            //allowNegative: false,
            //maxValue: 100000000,
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
         }
    }
    
    // 3. 定义记录集
    var Columns = [
    	{name: 'balappid', type: 'string'},
    	{name: 'balid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'conid', type: 'float'},
		{name: 'bdgmoney', type: 'float'},
		{name: 'balmoney', type: 'float'},
		{name: 'bdgno', type: 'string'},
		{name: 'bdgname', type: 'string'},
		{name: 'isleaf', type: 'float'},
		{name: 'parent', type: 'string'}
	];
	
	var saveBtn = new Ext.Button({
		name: 'save',
           text: '保存',
           iconCls: 'save',
           handler: formSave
	})
	
    // 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        width : 300,
        height: 200,
        split: true,
        collapsible : true,
        collapseMode : 'mini',
        minSize: 200,
        maxSize: 400,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '结算概算修改页',
            	layout: 'form',
            	border: true,
            	items: [
            		new fm.TextField(fc['bdgname']),
            		new fm.TextField(fc['bdgno']),
            		new fm.NumberField(fc['bdgmoney']),
		            new fm.NumberField(fc['balmoney']),
					saveBtn
    			]
    		}),
    		new fm.TextField(fc['isleaf']),
		    new fm.TextField(fc['parent']),
            new fm.TextField(fc['conid']),
			new fm.TextField(fc['pid']),
			new fm.TextField(fc['balid']),
			new fm.TextField(fc['balappid']),
			new fm.TextField(fc['bdgid'])
    	]
    });
    // 保存方法
    function formSave(){
   	var form = formPanel.getForm();
   	if (form.isValid()){
    	if (formPanel.isNew) {
    		doFormSave(true,tmpLeaf)
    	} else {
    		doFormSave(false,tmpLeaf)
    	}
    }
    }
    
    function doFormSave(isNew,tmpLeaf){
    	var form = formPanel.getForm();
    	var obj = new Object();
    	for (var i=0; i<Columns.length; i++){
    		var name = Columns[i].name;
    		var field = form.findField(name);
    		if (field) obj[name] = field.getValue();
    	}
    	
    	//treePanelNew.getEl().mask("loading...");
   		bdgBalMgm.addOrUpdateBdgBalApp(obj, function(flag){
   			if ("0" == flag){   				
   				var elNode = tmpNode.getUI().elNode;
				var node = tmpNode;
				var oldFactMoneyStr = elNode.all("balmoney").innerText;
				var oldFactMoney = oldFactMoneyStr.replace("￥","")*1
				var newFactMoney = form.findField("balmoney").getValue() *1
				var differ = newFactMoney*1 - oldFactMoney*1
				while(node.parentNode){					 			
					var elNode = node.getUI().elNode;
					var treeOldMoneyStr = elNode.all("balmoney").innerText;	
					var treeOldMoney = treeOldMoneyStr.replace("￥","")*1 		
					var treeNewMoney  = treeOldMoney + differ*1	

					node.attributes.balmoney =treeNewMoney
					elNode.all("balmoney").innerText = "￥"+ treeNewMoney
			
					node = node.parentNode
				}
   				/*var node = tmpNode.parentNode;
   				
   				if (node.isExpanded()) {
			    	var bdgid = node.text == rootText ? "0" : node.attributes.bdgid;
			    	treePanelNew.loader.dataUrl = BASE_PATH+ "servlet/BdgServlet?ac=bdgBalTree&conid=" 
			    		+ selectedConID + "&balid=" + balid  +"&parent=" + bdgid + "";
			    	treeLoaderNew.load(node);
			    	node.expand();
		    	} else {
		    		node.expand();
		    	}*/
		    	
				Ext.example.msg('保存成功！', '您成功保存了一条概算信息！');
   			}else{
   				Ext.Msg.show({
					title: '提示',
					msg: '数据保存失败！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
   			}
   			//treePanelNew.getEl().unmask();
   		});
    }
    




