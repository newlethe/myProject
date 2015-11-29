var pid = CURRENTAPPID;
var rootNew = null;
var treePanelNew = null;
var store=null;
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	'uids': {
			name: 'uids',
			fieldLabel: '主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 
         'pid': {
			name: 'pid',
			fieldLabel: 'pid',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },
         'bdgId': {
			name: 'bdgId',
			fieldLabel: '概算主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },
         'contentId': {
			name: 'contentId',
			fieldLabel: '内部流水号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },
         'bdgNo': {
			name: 'bdgNo',
			fieldLabel: '概算编码',
			readOnly: true,
			anchor:'95%'
         }, 
         'bdgName': {
			name: 'bdgName',
			fieldLabel: '概算名称',
			readOnly: true,
			anchor:'95%'
         }, 
        
         'zbgsMoney': {
			name: 'zbgsMoney',
			fieldLabel: '本次招标对应概算金额',
			readOnly: true,
			anchor:'95%'
         }, 
         'planBgMoney': {
 			name: 'planBgMoney',
 			fieldLabel: '本次计划概算金额',
 			anchor:'95%'
          }, 
         'isleaf': {
			name: 'isleaf',
			fieldLabel: '是否子节点',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 
         'parentId': {
			name: 'parentId',
			fieldLabel: '父节点',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }
    }
    
    // 3. 定义记录集
    var Columns = [
    	{name: 'uids', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'bdgId', type: 'string'},
		{name: 'contentId', type: 'float'},
		{name: 'zbgsMoney', type: 'float'},
		{name: 'planBgMoney', type: 'float'},
		{name: 'bdgNo', type: 'string'},
		{name: 'bdgName', type: 'string'},
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
    			title: '招标概算金额修改页',
            	layout: 'form',
            	border: true,
            	autoHeight:true,
            	items: [
            		new fm.TextField(fc['bdgName']),
            		new fm.TextField(fc['bdgNo']),
            		new fm.NumberField(fc['zbgsMoney']),
		            new fm.NumberField(fc['planBgMoney']),
					saveBtn
    			]
    		}),
    		new fm.TextField(fc['pid']),
			new fm.TextField(fc['uids']),
    		new fm.TextField(fc['contentId']),
			new fm.TextField(fc['isleaf']),
            new fm.TextField(fc['parentId']),
			new fm.TextField(fc['bdgId'])
    	]
    });
    
	// 表单保存方法
    function formSave(){
    	saveBtn.setDisabled(true); 
    	var form = formPanel.getForm();
    	if(!form.isValid()){
    		return false;
    	}
    	var form = formPanel.getForm();
    	var value =  form.findField("planBgMoney").getValue();
    	var uids = form.findField("uids").getValue();
    	form.findField("zbgsMoney").setValue(value);
    	bidBdgApportionMgm.updatePlanBgMoney(uids,value,function(){
    		reloadTreeMoney(form,value);
    	});
    	
    }
    //更新
	function reloadTreeMoney(form,value){
   		var nodeRecord=tmpNodeRecord;
   		 var oldZbgsMoney =  nodeRecord.data["zbgsMoney"];
   		 var oldPlanBgMoney = nodeRecord.data["planBgMoney"];
   		 var sum = parseFloat(oldZbgsMoney) - parseFloat(oldPlanBgMoney) + parseFloat(value);
       	nodeRecord.set('zbgsMoney', sum);
       	nodeRecord.set('planBgMoney', parseFloat(value));
       	nodeRecord.commit();
	}
