var beanName = "com.sgepit.pcmis.balance.hbm.PcBalanceSortTree";
var primaryKey = "uids";
var formPanelTitle = "编辑记录（查看详细信息）";
var pid = CURRENTAPPID;

//读写权限标志
var rwFlag = (ModuleLVL<3?true:false);
DWREngine.setAsync(true);
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	'uids': {
			name: 'uids',
			fieldLabel: '结算主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 
    	 'pid': {
			name: 'pid',
			fieldLabel: '项目编号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'balanceName': {
			name: 'balanceName',
			fieldLabel: '费用名称',
			allowBlank: false,
			anchor:'95%'
         },'balanceNo': {
			name: 'balanceNo',
			readOnly: true,
			fieldLabel: '费用编码',    //系统自动分配费用编码
			anchor:'95%',
			listeners: {
				focus: function(){
					this.el.dom.blur();
				}
			}
         },'parentBalanceName' :{
            id:'parentBalanceName',
            name: 'parentBalanceName',
            fieldLabel: '上级费用名称',
            readOnly  : true,
            anchor:'95%',
            listeners: {
				render: function(){
					this.el.dom.disabled = true;
				}
            }
         },'parentBalanceNo' :{
            id :'parentBalanceNo',
            name :'parentBalanceNo',
            fieldLabel: '上级费用编码',
            readOnly  : true,
            anchor : '95%',
            listeners: {
				render: function(){
					this.el.dom.disabled = true;
				}
            }
         }, 'constructionCost': {
            id : 'constructionCost',
			name: 'constructionCost',
			fieldLabel: '工程总价',
            allowBlank: true,
			anchor:'95%'
         },'coMoney':{
            id : 'coMoney',
            name : 'coMoney',
            fieldLabel: '已完成金额',
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
			fieldLabel: '上级费用编码',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }
    }
    
    // 3. 定义记录集
    var Columns = [
    	{name: 'uids', type: 'uids'},
		{name: 'pid', type: 'string'},
		{name: 'balanceNo', type: 'string'},
		{name: 'balanceName', type: 'string'},
		{name: 'parent', type: 'string'},
		{name: 'parentBalanceName', type: 'string'},
		{name: 'parentBalanceNo', type: 'string'},
		{name: 'constructionCost', type: 'float'},
        {name : 'coMoney', type : 'float'},
		{name: 'isleaf', type: 'float'}
	];

	// 6. 创建表单form-panel
    var saveBtn = new Ext.Button({
		name: 'save',
        text: '保存',
        iconCls: 'save',
        handler: formSave
	})
	
	var cancleBtn = new Ext.Button({
		name: 'cancle',
		text: '取消',
		iconCls: 'remove',
		handler: function(){
			formPanel.collapse(true);
		}
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
        minSize: 400,
        maxSize: 400,
        border: false,
        region: 'east',
        frame: true,
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
		buttons:[saveBtn,cancleBtn],
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '结算结构树维护',
            	layout: 'form',
                width : 300,
            	border: true,
            	items: [
            		new fm.Hidden(fc['uids']),
            		new fm.Hidden(fc['pid']),
            		new fm.TextField(fc['balanceNo']),
            		new fm.TextField(fc['balanceName']),
            		new fm.TextField(fc['parentBalanceNo']),
                    new fm.TextField(fc['parentBalanceName']),
		            new fm.NumberField(fc['constructionCost']),
                    new fm.NumberField(fc['coMoney']),
                    new fm.Hidden(fc['isleaf']), //初始化为叶子
                    new fm.Hidden(fc['parent'])
    			]
    		})
    	]
    });
    
    // 表单保存方法
    function formSave(){
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
   		balanceMgm.addOrUpdateBalanceInfo(obj, function(flag){
   			if ("1" == flag){
   				var tree = Ext.getCmp("budget-tree-panel")
				store.load();
                Ext.example.msg('保存成功！', '您成功保存了一条结算信息!',1);
   			}
   			else if("-1"==flag){
   			        Ext.Msg.show({
						title: '提示',
						msg: '该结算中结算编码已存在！',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
   			}
   			else{
   				Ext.Msg.show({
					title: '提示',
					msg: '数据保存失败！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});
   			}
   		});
   		
   		formPanel.collapse(true);
    }
    
    function formCancel(){
	   	formPanel.getForm().reset();
    }

