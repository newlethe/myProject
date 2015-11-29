var beanNameTree = 'com.sgepit.pmis.budget.hbm.BdgMoneyPlanSub'
var beanNameBdg = 'com.sgepit.pmis.budget.hbm.BdgInfo'


	var subFc = {
		'id':{
			name:'id',
			fieldLabel:'主键ID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'mainid':{
			name:'mainid',
			fieldLabel:'主表主键ID',
			readOnly:true,
			hidden:true,
			hideLabel:true,			
			anchor:'95%'
		},'pid':{
			name:'pid',
			fieldLabel:'工程项目编号',
			readOnly:true,
			hidden:true,
			hideLabel:true,			
			anchor:'95%'
		},'bdgid':{
			name:'bdgid',
			fieldLabel:'概算编号',
			readOnly:true,
			anchor:'95%'
		},'bdgconids':{
			name:'bdgconids',
			fieldLabel:'分摊合同号集合',
			readOnly:true,
			hidden:true,
			hideLabel:true,			
			anchor:'95%'
		},'planmoney':{
			name:'planmoney',
			fieldLabel:'工程量投资金额',
			width:150,
			anchor:'95%'
		},'plantime':{
			name:'plantime',
			fieldLabel:'投资时间',
			readOnly:true,
			hidden:true,
			hideLabel:true,			
			anchor:'95%'
		},'isleaf':{
			name:'isleaf',
			fieldLabel:'是否子节点',
			readOnly:true,
			hidden:true,
			hideLabel:true,			
			anchor:'95%'
		},'parent':{
			name:'parent',
			fieldLabel:'父节点',
			readOnly:true,
			hidden:true,
			hideLabel:true,			
			anchor:'95%'
		},'remark':{
			name:'remark',
			fieldLabel:'备注',
			width:150,
			height:50,
			anchor:'95%'
		},'bdgno':{
			name:'bdgno',
			fieldLabel:'财务编码',
			width:150,
			readOnly:true,
			anchor:'95%'
		},'bdgname':{
			name:'bdgname',
			fieldLabel:'概算名称',
			width:150,
			readOnly:true,
			anchor:'95%'
		},'connames':{
			id:'connames',
			name:'connames',
			fieldLabel:'分摊合同名称集',
			width:150,
			height:50,
			readOnly:true,
			anchor:'95%'
		},'bdgmoney':{
			name:'bdgmoney',
			fieldLabel:'概算金额',
			width:150,
			readOnly:true,
			anchor:'95%'
		},'totalappmoney':{
			name:'totalappmoney',
			fieldLabel:'分摊总金额',
			width:150,
			readOnly:true,
			anchor:'95%'
		}
	}
	
	var SubColumns = [
		{name:'id',type:'string'},
		{name:'mainid',type:'string'},
		{name:'pid',type:'string'},
		{name:'bdgid',type:'string'},
		{name:'bdgconids',type:'string'},
		{name:'planmoney',type:'float'},
		{name:'plantime',type:'date'},
		{name:'isleaf',type:'float'},
		{name:'parent',type:'string'},
		{name:'remark',type:'string'},
		{name:'bdgno',type:'string'},
		{name:'bdgname',type:'string'},
		{name:'connames',type:'string'},
		{name:'bdgmoney',type:'float'},
		{name:'totalappmoney',type:'float'}
	]
	var subInt = {
		id:null,
		pid:CURRENTAPPID,
		bdgid:'',
		bdgconids:'',
		planmoney:0,
		plantime:'',
		isleaf:1,
		parent:'',
		remark:'',
		bdgno:'',
		bdgname:'',
		connames:'',
		bdgmoney:0,
		totalappmoney:0
	}
	
	var saveBtn = new Ext.Button({
		name:'save',
		text:'保存',
		iconCls:'save',
		disabled:true,
		handler:formSave
	})
	
	var formPanel = new Ext.form.FormPanel({
		id:'form-panel',
		header:false,
		border:false,
		width:300,
		labelWidth:100,
		height:200,
		split:true,
		collapsible:true,
		collapsed:true,
		collapseMode:'mini',
		minSize:200,
		maxSize:400,
		region:'east',
		bodyStyle:'padding:10px 10px;border:0px dashed #3764A0',
		labelAlign:'left',
		items:[
			new Ext.form.FieldSet({
				title:'投资计划金额修改页面',
				layout:'form',
				border:true,
				items:[
					new Ext.form.TextField(subFc['bdgname']),
					new Ext.form.TextField(subFc['bdgno']),
					new Ext.form.NumberField(subFc['bdgmoney']),
					new Ext.form.NumberField(subFc['totalappmoney']),
					new Ext.form.NumberField(subFc['planmoney']),
					new Ext.form.TextArea(subFc['connames']),
					new Ext.form.TextArea(subFc['remark']),
					saveBtn
				]
			}),
			new Ext.form.TextField(subFc['id']),
			new Ext.form.TextField(subFc['mainid']),
			new Ext.form.TextField(subFc['pid']),
			new Ext.form.TextField(subFc['bdgid']),
			new Ext.form.TextField(subFc['bdgconids']),
			new Ext.form.DateField(subFc['plantime']),
			new Ext.form.TextField(subFc['isleaf']),
			new Ext.form.TextField(subFc['parent'])
		]
	})
	
	function formSave(){
		saveBtn.setDisabled(true)
		var baseform = formPanel.getForm()
		if(baseform.isValid()){
			if(formPanel.isNew)
				doFormSave(true,tmpLeaf)
			else
				doFormSave(false,tmpLeaf)	
		}
	}
	
	function doFormSave(isNew,leaf){
		var baseform = formPanel.getForm()
		var obj = new Object()
		for(var i =0;i<SubColumns.length;i++){
			var name = SubColumns[i].name
			var field = baseform.findField(name)
			if(field)
				obj[name] = field.getValue()
		}
		if(!obj['planmoney'])
			obj['planmoney'] = 0
		subTreePanel.getEl().mask("loading...")
		bdgMoneyPlanSubMgm.updatePlanSubtree(obj,function(flag){
			if(flag == '0'){
				var node = tmpNode.parentNode
				if(node.isExpanded()){
					var bdgid = node.text ==rootText?'0':node.attributes.bdgid
					var baseParams = subTreePanel.loader.baseParams
					baseParams.parent = bdgid
					baseParams.mainid = mainid
					subTreeLoader.load(node) //?全更新的话应该可以将node替换成subRoot
					node.expand()
				}else{
					node.expand()
				}
				subTreePanel.getEl().unmask()
				Ext.example.msg('保存成功!','您成功保存了一条投资计划信息!')
			}else{
				subTreePanel.getEl().unmask()
				Ext.Msg.alert('提示','数据保存失败!')
			}
		})
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	