var beanName = "com.sgepit.pmis.finalAccounts.finance.hbm.FaFinBalance";
var primaryKey = "uids";
var formPanelTitle = "编辑记录（查看详细信息）";
var fareType =[ [1,'摊入费'],[2,'基座费'],[3,'原价值']];

	var dsFareType= new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: fareType
    });
    
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		            // 创建编辑域配置
    	'uids': {
			name: 'uids',
			fieldLabel: '科目分类主键',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }, 'accoutId': {
			name: 'accoutId',
			fieldLabel: '帐套代码',
			anchor:'95%'
         }, 'subYear': {
			name: 'subYear',
			fieldLabel: '科目年份',
			format: 'Y-m-d',
			anchor:'95%'
         }, 'subNo': {
			name: 'subNo',
			fieldLabel: '科目编号',
			anchor:'95%'
         }, 'fullName': {
			name: 'fullName',
			fieldLabel: '科目全称',
			anchor:'95%'
         }, 'subName': {
			name: 'subName',
			fieldLabel: '科目名称',
			anchor:'95%'
         }, 'subType': {
			name: 'subType',
			fieldLabel: '科目类型',
			anchor:'95%'
         }, 'subRemark': {
			name: 'subRemark',
			fieldLabel: '科目说明',
			anchor:'95%'
         }, 'subGrade': {
			name: 'subGrade',
			fieldLabel: '科目级别',
			anchor:'95%'
         }, 'moneyType': {
			name: 'moneyType',
			fieldLabel: '外币类型',
			anchor:'95%'
         }, 'numType': {
			name: 'numType',
			fieldLabel: '数字类型',
			anchor:'95%'
         }, 'isCheck': {
			name: 'isCheck',
			fieldLabel: '是否检查',
			anchor:'95%'
         }, 'isClear': {
			name: 'isClear',
			fieldLabel: '是否清理',
			anchor:'95%'
         }, 'isHelp': {
			name: 'isHelp',
			fieldLabel: '是否辅助',
			anchor:'95%'
         }, 'isDollar': {
			name: 'isDollar',
			fieldLabel: '是否外币',
			anchor:'95%'
         }, 'isNum': {
			name: 'isNum',
			fieldLabel: '是否数量',
			anchor:'95%'
         }, 'isBank': {
			name: 'isBank',
			fieldLabel: '是否银行',
			anchor:'95%'
         }, 'isBack': {
			name: 'isBack',
			fieldLabel: '是否交互',
			anchor:'95%'
         }, 'bdgWay': {
			name: 'bdgWay',
			fieldLabel: '概算方向',
			anchor:'95%'
         }, 'appMoney': {
			name: 'appMoney',
			fieldLabel: '分摊金额',
			value:0,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'fareType': {
			name: 'fareType',
			fieldLabel: '计入位置',
			readOnly : true,
			valueField: 'k',
			displayField: 'v', 
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsFareType,
            lazyRender: true,
            listClass: 'x-combo-list-small',
//            hidden:true,
//			hideLabel:true,
			anchor:'95%'
         }, 'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }, 'houseId': {
			name: 'houseId',
			fieldLabel: '房屋资产流水号',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }, 'indexId': {
			name: 'indexId',
			fieldLabel: '索引号',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }, 'isLeaf': {
			name: 'isLeaf',
			fieldLabel: '是否子节点',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }, 'parent': {
			name: 'parent',
			fieldLabel: '父节点',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }
    }
    
    // 3. 定义记录集
    var Columns = [
		{name: 'uids', type: 'string'},
		{name: 'accoutId', type: 'string'},
		{name: 'subYear', type: 'date', dateFormat: 'Y-m-d'},
		{name: 'subNo', type: 'string'},
		{name: 'fullName', type: 'string'},
		{name: 'subName', type: 'float'},
		{name: 'subType', type: 'string'},
		{name: 'subRemark', type: 'string'},
		{name: 'subGrade', type: 'string'},
		{name: 'moneyType', type: 'string'},
		{name: 'numType', type: 'string'},
		{name: 'isCheck', type: 'string'},
		{name: 'isClear', type: 'string'},
		{name: 'isHelp', type: 'string'},
		{name: 'isDollar', type: 'string'},
		{name: 'isNum', type: 'string'},
		{name: 'isBank', type: 'string'},
		{name: 'isBack', type: 'string'},
		{name: 'bdgWay', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'houseId', type: 'string'},
		{name: 'indexId', type: 'string'},
		{name: 'isLeaf', type: 'float'},
		{name: 'appMoney', type: 'float'},
		{name: 'fareType', type: 'string'},
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
    			title: '科目分类编辑页',
            	layout: 'form',
            	border: true,
            	labelWidth: 60,
            	items: [
		            new fm.TextField(fc['accoutId']),
		            new fm.DateField(fc['subYear']),
		            new fm.TextField(fc['subNo']),
		            new fm.TextField(fc['fullName']),
		            new fm.TextField(fc['subName']),
		            new fm.TextField(fc['subType']),
		            new fm.TextField(fc['subRemark']),
		            new fm.TextField(fc['subGrade']),
		            new fm.TextField(fc['moneyType']),
		            new fm.TextField(fc['numType']),
		            new fm.TextField(fc['isCheck']),
		            new fm.TextField(fc['isClear']),
		            new fm.TextField(fc['isHelp']),
		            new fm.TextField(fc['isDollar']),
		            new fm.TextField(fc['isNum']),
		            new fm.TextField(fc['isBank']),
		            new fm.ComboBox(fc['fareType']),
		            new fm.TextField(fc['bdgWay']),
		            saveBtn
    			]
    		}),
    		new fm.NumberField(fc['appMoney']),
    		new fm.NumberField(fc['isLeaf']),
            new fm.TextField(fc['parent']),
            new fm.TextField(fc['bdgid']),
            new fm.TextField(fc['houseId']),
            new fm.TextField(fc['indexId']),
			new fm.TextField(fc['uids'])
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
    	
        treePanel.getEl().mask("loading...");
        obj.pid = CURRENTAPPID;
   		financeSortService.addOrUpdateSubject(obj, function(){
			var node = isNew&&!tmpNode.isLeaf() ? tmpNode : tmpNode.parentNode;
		    if (isNew) {
		    	var uuid = node.text == rootText ? "0" : node.attributes.uids;
		    	var baseParams = treePanel.loader.baseParams
				baseParams.parent = uuid;
		    }
	    	if (node.isExpanded()) {
		    	treeLoader.load(node);
		    	node.expand();
	    	} else {
	    		node.expand();
	    	}
			Ext.example.msg('保存成功！', '您成功保存了一条科目！');
   			treePanel.getEl().unmask("loading...");
   		});
    }
    
    function formCancel(){
	   	formPanel.getForm().reset();
    }
