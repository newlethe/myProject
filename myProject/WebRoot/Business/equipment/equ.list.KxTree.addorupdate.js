var fm = Ext.form;
var jzhType = [[5,'#1、#2机组'],[1,'#1机组'],[2,'#2机组']];
var types = [[-1,'--'], [1,'设备'],[2,'部件'],[3,'备品备件'],[4,'专用工具'],[6,'零件'],[5,'合同']];
var dsTypes = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : types
    });
var dsJzh = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
        data : jzhType
    }); 
var fc = {		// 创建编辑域配置
    	 'sbId': {
			name: 'sbId',
			fieldLabel: '设备主键',
			hidden:true,
			hideLabel:true
         },'indexId': {
			name: 'indexId',
			fieldLabel: '过滤条件' ,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden:true,
			hideLabel:true
         }, 'sbBm': {
			name: 'sbBm',
			fieldLabel: '设备编码',
			readOnly : true,
			anchor:'95%'
         }, 'sbMc': {
			name: 'sbMc',
			fieldLabel: '设备名称',  
			anchor:'95%'
         },'sccj': {
			name: 'sccj',
			fieldLabel: '生产厂家',
			anchor:'95%'
         },'returnDate': {
			name: 'returnDate',
			fieldLabel: '到货日期',
			format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
         }, 'ggxh': {
			name: 'ggxh',
			fieldLabel: '规格型号', 
			anchor:'95%'
         }, 'dw': {
			name: 'dw',
			fieldLabel: '单位',
			anchor:'95%'
         },'zs': {
			name: 'zs',
			fieldLabel: '到货数量',
			anchor:'95%'
         },'dj': {
			name: 'dj',
			fieldLabel: '单价',
			anchor:'95%'
         },'zj': {
			name: 'dj',
			fieldLabel: '总价',
			anchor:'95%'
         },'jzh': {
			name: 'jzh',
			fieldLabel: '机组号',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: dsJzh,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         } ,'sx': {
			name: 'sx',
			fieldLabel: '属性',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: dsTypes,
            lazyRender:true,
            hidden:true,
			hideLabel:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         } ,'parentid': {
			name: 'parentid',
			fieldLabel: '父节点',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         } ,'isleaf': {
			name: 'isleaf',
			fieldLabel: '是否子节点',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'boxNo': {
			name: 'boxNo',
			fieldLabel: '箱件号',
			anchor:'95%'
         } ,'partNo': {
			name: 'partNo',
			fieldLabel: '部件号',
			anchor:'95%'
         } ,'recordman': {
			name: 'recordman',
			fieldLabel: '录入人',
			anchor:'95%'
         } ,'projectDept': {
			name: 'projectDept',
			fieldLabel: '业主工程部',
			anchor:'95%'
         } ,'supervision': {
			name: 'supervision',
			fieldLabel: '监理',
			anchor:'95%'
         } ,'storeBillstate': {
			name: 'storeBillstate',
			fieldLabel: '到货状态',
			readOnly : true,
			anchor:'95%'
         } ,'kcsl': {
			name: 'kcsl',
			fieldLabel: '库存数量',
			readOnly : true,
			anchor:'95%'
         }      
    }

 // 3. 定义记录集
    var Columns = [
    	{name: 'sbId', type: 'string'},
    	{name: 'pid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'indexId', type: 'string'},
		{name: 'sbBm', type: 'string'},    	
		{name: 'sbMc', type: 'string' },
		{name: 'returnDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'sccj', type: 'string'},
		{name: 'ggxh', type: 'string'},
		{name: 'jzh', type: 'string'},
		{name: 'sx', type: 'string'},
		{name: 'parentid', type: 'string'},
		{name: 'zs', type: 'float'},
		{name: 'dj', type: 'float'},
		{name: 'zj', type: 'float'},
		{name: 'isleaf', type: 'float'},
		{name: 'dw', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'boxNo', type: 'string'},
		{name: 'partNo', type: 'string'},
		{name: 'recordman', type: 'string'},
		{name: 'projectDept', type: 'string'},
		{name: 'supervision', type: 'string'},
		{name: 'storeBillstate', type: 'string'}
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
    collapsed: true, 
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
        	   
        	    new fm.TextField(fc['sbMc']),
                new fm.TextField(fc['sbBm']),
                new fm.TextField(fc['ggxh']),
                new fm.TextField(fc['dw']),
               // new fm.NumberField(fc['zs']),
               // new fm.NumberField(fc['kcsl']),
                new fm.TextField(fc['sccj']),
                //new fm.TextField(fc['recordman']),
                //new fm.TextField(fc['storeBillstate']),
               // new fm.DateField(fc['returnDate']),
               // new fm.TextField(fc['boxNo']),
               // new fm.TextField(fc['partNo']),
                saveBtn
			]
		}),  
				new fm.TextField(fc['sbId']),
		  		new fm.TextField(fc['parentid']),
		  		new fm.TextField(fc['sx']),
	            new fm.TextField(fc['pid']),
	            new fm.TextField(fc['conid']),
	            new fm.TextField(fc['isleaf']),
	            new fm.TextField(fc['indexId'])
				
	]
});

		function formSave(){
			saveBtn.setDisabled(true);
			var form = formPanel.getForm();
			//form.findField("bm").disable();
			//form.findField("mc").disable();
			if (form.isValid()){
		    		var ggxh=form.findField('ggxh');
			   	var getggxh=form.findField('ggxh').getRawValue();
			   	if(getggxh!=loadFormRecord.get('ggxh')){
			   	DWREngine.setAsync(false);
			   	equlistMgm.checkGgXh(getggxh,indexid, function(flag){
	     			if (flag){
			     		if (formPanel.isNew) {	    
				    		doFormSave(false,tmpLeaf)
				    	} else {
				    		doFormSave(true,tmpLeaf)
				    	}
	     			} else {
	     				Ext.Msg.show({
							title: '提示',
							msg: '规格型号已存在,请重新输入!',
							buttons: Ext.Msg.OK,
							fn: function(value){
								ggxh.focus();
								ggxh.getEl().dom.select();
							},
							icon: Ext.MessageBox.WARNING
						});
						saveBtn.setDisabled(false);
	     			}
     			});
			   DWREngine.setAsync(true);
			   	}else{
			   		doFormSave(true,tmpLeaf);
			   	  
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
			equlistMgm.addOrUpdate(obj, indexid, function(flag){
				if ("0" == flag){
					var node = isNew&&!tmpNode.isLeaf() ? tmpNode : tmpNode.parentNode;
				    if (isNew) {
				    	/*var treeData = node.text == rootText ? "root" : node.attributes.treeid;
				    	var baseParams = treePanel.loader.baseParams
							baseParams.parent = treeData;*/
				   }
			    	if (node.isExpanded()) {
				    	treeLoader.load(node);
				    	node.expand();
			    	} else {
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