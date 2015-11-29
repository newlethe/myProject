var beanName = "com.sgepit.pmis.budget.hbm.BdgInfo";
var primaryKey = "bdgid";
var formPanelTitle = "编辑记录（查看详细信息）";
var pid = CURRENTAPPID;

// 工程类型下拉列表
var gcTypeStore = new Ext.data.SimpleStore({
    fields : ['uids','gcTypeName']
})
DWREngine.setAsync(false);
baseMgm.findAll("com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAGcType",function(list){
	var rec = new Ext.data.Record.create([
		{name : 'uids'},
		{name : 'gcTypeName'}
	])
	for(var i=0;i<list.length;i++){
		gcTypeStore.add(new rec({uids:list[i].uids,gcTypeName:list[i].gcTypeName}))
	}
})
DWREngine.setAsync(true);

    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	 'pid': {
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
         }, 'bdgno': {
            id : 'bdgno',
			name: 'bdgno',
			fieldLabel: '概算编码',
			anchor:'95%'
         }, 'prono': {
            id : 'prono',
			name: 'prono',
			fieldLabel: '序号',
			anchor:'95%'
         },'parentbdgname' :{
            id:'parentbdgname',
            name: 'parentbdgname',
            fieldLabel: '上级概算名称',
            readOnly  : true,
            disabled:true,
            anchor:'95%'
         },'parentbdgno' :{
            id :'parentbdgno',
            name :'parentbdgno',
            fieldLabel: '上级概算编码',
            readOnly  : true,
            disabled:true,
            anchor : '95%'
         },'bdgname': {
            id : 'bdgname',
			name: 'bdgname',
			fieldLabel: '概算名称',
			allowBlank: false,
			anchor:'95%'
         }, 'bdgflag': {
			name: 'bdgflag',
			fieldLabel: '是否工程量',
            allowBlank: true,
			emptyText: '请选择...',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            //store: bdgFlagTypes,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         }, 'bdgmoney': {
            id : 'bdgmoney',
			name: 'bdgmoney',
			fieldLabel: '执行概算金额',
            allowBlank: true,
			anchor:'95%',
			listeners : {
               blur : function(field){
               if(Ext.getCmp("remainingMoney").getValue() == 0){
                	var value = Ext.getCmp("bdgmoney").getValue()-Ext.getCmp("contmoney").getValue();
                	Ext.getCmp("remainingMoney").setValue(value)
               }
             }
           }
           //BUG8335 调整此字段取数，新字段在下方 zhangh 2015-11-18
//         },'remainingMoney':{
//            id : 'remainingMoney',
//            name : 'remainingMoney',
//            fieldLabel: '未签订合同金额',
//            allowBlank: true,
//            hidden:true,
//            hideLabel:true,
//            anchor:'95%'
         }, 'contmoney': {
            id : 'contmoney',
			name: 'contmoney',
			fieldLabel: '分摊总金额',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			disabled:true,
			anchor:'95%'
         }, 'matrmoney': {
			name: 'matrmoney',
			fieldLabel: '材料金额',
            readOnly:true,
			hidden:true,
			hideLabel:true,
            allowBlank: true,
			anchor:'95%'
         }, 'buildmoney': {
			name: 'buildmoney',
			fieldLabel: '建筑金额',
            readOnly:true,
			hidden:true,
			hideLabel:true,
            allowBlank: true,
			anchor:'95%'
         }, 'equmoney': {
			name: 'equmoney',
			fieldLabel: '设备安装金额',
            readOnly:true,
			hidden:true,
			hideLabel:true,
            allowBlank: true,
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
         },'gcType':{
            id : 'gcType',
            name : 'gcType',
            fieldLabel: '概算项目分类',
            allowBlank: true,
			valueField: 'uids', 
			displayField: 'gcTypeName',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: gcTypeStore,
            lazyRender:true,
            readOnly : true,
            listClass: 'x-combo-list-small',
			anchor:'95%'           
         },'ratifyBdg':{
			id : 'ratifyBdg',
			name : 'ratifyBdg',
			fieldLabel : '批准概算金额',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'conjymoney' : {
			id : 'conjymoney',
			name : 'conjymoney',
			fieldLabel : '合同结余金额',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},
		'bidbdgmoney':{id : 'bidbdgmoney',fieldLabel : '招标对应概算金额',readOnly : true},
		'signconbidbdgmoney':{id : 'signconbidbdgmoney',fieldLabel : '（已签合同）招标对应概算金额',readOnly : true},
		'conbdgappmoney':{id : 'conbdgappmoney',fieldLabel : '合同分摊总金额',readOnly : true},
		'bidconappmoney':{id : 'bidconappmoney',fieldLabel : '招标合同分摊金额',readOnly : true},
		'notbidconappmoney':{id : 'notbidconappmoney',fieldLabel : '非招标合同分摊金额',readOnly : true},
		'bidconothermoney':{id : 'bidconothermoney',fieldLabel : '招标合同结余金额',readOnly : true},
		'remainingMoney':{id : 'remainingMoney',fieldLabel : '未签订合同金额',readOnly : true}
    }
    
    // 3. 定义记录集
    var Columns = [
		{name: 'pid', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'bdgno', type: 'string'},
		{name: 'prono', type: 'string'},
		{name: 'bdgname', type: 'string'},
		{name: 'bdgflag', type: 'float'},
		{name: 'bdgmoney', type: 'float'},
//        {name : 'remainingMoney', type : 'float'},
		{name: 'contmoney', type: 'float'},
		{name: 'matrmoney', type: 'float'},
		{name: 'buildmoney', type: 'float'},
		{name: 'equmoney', type: 'float'},
		{name: 'isleaf', type: 'float'},
		{name: 'parent', type: 'string'},
		{name: 'parentbdgname', type: 'string'},
		{name: 'parentbdgno', type: 'string'},
		{name : 'gcType', type : 'string'},
		{name : 'ratifyBdg', type : 'float'},
		{name : 'conjymoney',type : 'float'},
		
		{name : 'bidbdgmoney',type : 'float'},
		{name : 'signconbidbdgmoney',type : 'float'},
		{name : 'conbdgappmoney',type : 'float'},
		{name : 'bidconappmoney',type : 'float'},
		{name : 'notbidconappmoney',type : 'float'},
		{name : 'bidconothermoney',type : 'float'},
		{name : 'remainingMoney',type : 'float'}
	];

	// 6. 创建表单form-panel
    var saveBtn = new Ext.Button({
		name: 'save',
           text: '保存',
           iconCls: 'save',
           handler: formSave
	})
	var bdginput=new fm.NumberField(fc['bdgmoney']);
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        width : 330,
        //height: 200,
        split: true,
        collapsible : true,
        collapsed: true,
        collapseMode : 'mini',
        minSize: 400,
        maxSize: 400,
        border: false,
        region: 'east',
//        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	tbar:[saveBtn],
    	items: [
    		new Ext.form.FieldSet({
    			title: '概算结构树编辑页',
            	layout: 'form',
                width : 330,
                labelWidth : 140,
            	border: true,
            	autoHeight: true,
            	items: [
                    new fm.TextField(fc['parentbdgname']),
                    new fm.TextField(fc['parentbdgno']),         	
		            new fm.TextField(fc['bdgname']),
		            new fm.TextField(fc['bdgno']),
		            new fm.TextField(fc['prono']),
		            new fm.ComboBox(fc['gcType']),
		            bdginput,            
		            new fm.NumberField(fc['bidbdgmoney']),
		            new fm.NumberField(fc['signconbidbdgmoney']),
		            new fm.NumberField(fc['conbdgappmoney']),
		            new fm.NumberField(fc['bidconappmoney']),
		            new fm.NumberField(fc['notbidconappmoney']),
		            new fm.NumberField(fc['bidconothermoney']),
		            new fm.NumberField(fc['remainingMoney'])
		            
    			]
    		}),
            new fm.NumberField(fc['conjymoney']),
//            new fm.NumberField(fc['remainingMoney']),
            new fm.NumberField(fc['ratifyBdg']),
            new fm.NumberField(fc['contmoney']),
    		new fm.TextField(fc['isleaf']),
            new fm.TextField(fc['parent']),
			new fm.NumberField(fc['matrmoney']),
			new fm.NumberField(fc['buildmoney']),
			new fm.NumberField(fc['equmoney']),
			new fm.TextField(fc['pid']),
			new fm.TextField(fc['bdgid'])
    	]
    });
    
    // 表单保存方法
    function formSave(){
    	saveBtn.setDisabled(true);   
    	var form = formPanel.getForm();
    	var getBdgName = form.findField('bdgname').getValue();
    	var getBdgNo = form.findField('bdgno').getValue();
        if(getBdgName.toString() == null  || getBdgName.toString() == ""){
             Ext.Msg.alert("提示信息","概算名称不能为空，请输入概算名称！");
             saveBtn.setDisabled(false);  
        }
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
    	var sql = '';
    	var getBdgid =  form.findField('bdgid').getValue();
    	var getBdgno =  form.findField('bdgno').getValue();
    	var getRemainingMoney  = form.findField('remainingMoney').getValue();
        var getContmoney    =  form.findField('contmoney').getValue();   
        var isleaf    =  form.findField('isleaf').getValue(); 
    	for (var i=0; i<Columns.length; i++){
    		var name = Columns[i].name;
    		var field = form.findField(name);
    		if (field) obj[name] = field.getValue();
    	}
    	
    	var bdgmoney=form.findField("bdgmoney").getValue();
    	if(bdgmoney.toString()==""||bdgmoney.toString()==null){
    		form.findField("bdgmoney").setValue("0");
    	}
    	
    	//当“合同实际分摊总金额”字段金额发生更新时，将发生更新的数据所在行，即对应的概算项所在行，以同字号加粗蓝色显示；
		//结束条件：用户对该行的“预计未签订合同金额”字段值进行了手动修改, 恢复黑色显示：flag=0 黑色；flag=1蓝色
    	if(getBdgid == ""){
    		//新增概算项目
			sql = "update bdg_info t  set t.flag='0'  where  t.bdgno='"+getBdgno+"'"
    	}else{
    		var flagchange = 0;
    		var getdatachange ="select t.remainingmoney ,t.flag from bdg_info t where t.bdgid ='"+getBdgid+"'"
    		DWREngine.setAsync(false);
    		baseMgm.getData(getdatachange,function(list) {
				if(list[0][0] == getRemainingMoney && list[0][1]){
					flagchange = list[0][1];
				}else if(list[0][0] != getRemainingMoney ){
					flagchange = 0;
				}
			})
			DWREngine.setAsync(true);
    		sql = "update bdg_info t  set t.flag='"+flagchange+"'  where  t.bdgid='"+getBdgid+"'"
    	}
        //treePanel.getEl().mask("loading...");	
    	if(isNew==true){//修改时，修改后的概算金额小于合同分摊总金额，给出提示；
			if(bdgmoney<getContmoney){
				Ext.Msg.show({
					title : '提示',
					msg : '修改后的概算金额【'+ bdgmoney +'】小于该节点的合同分摊总金额【'+ getContmoney +'】',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
				});					
			}       		
    	}
   		bdgInfoMgm.addOrUpdate(obj, function(flag){
   			if ("0" == flag){
   				getFlag = '1';
   				var tree = Ext.getCmp("budget-tree-panel")
   			    baseDao.updateBySQL(sql);		
				selectCrrentTreeNode();//定位到上次选择的节点处
                Ext.Msg.alert('保存成功！', '您成功保存了一条概算信息！<font style="color:red;"><br>如需系统自动累计更新其父层概算金额，请使用【概算平衡】功能。</font>');
   			}else if("2"==flag){
   			        Ext.Msg.show({
					title: '提示',
					msg: '该概算中概算编码已存在！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
					});
                    saveBtn.setDisabled(false);  
   			}else{
   				Ext.Msg.show({
					title: '提示',
					msg: '数据保存失败！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
				getFlag = '0';
   			}
   		});
    }
    
    function formCancel(){
	   	formPanel.getForm().reset();
    }

    //定位到上次选择的树节点		    
	function selectCrrentTreeNode(){
		var rec = treeGrid.getSelectionModel().getSelected();
		selectedPath = store.getPath(rec, "bdgid");
		store.load();
     }
     
     
       