var bean = 'com.sgepit.pmis.budget.hbm.BdgMoneyPlanCon'
var beanCon = 'com.sgepit.pmis.contract.hbm.ConOve'
var business = 'baseMgm'
var listMethod = 'findWhereOrderby'
var primaryKey = 'planconid'
var orderColumn = 'plantime'
var propertyName = 'conid'
var conFormSetTitle = '合同资金基本信息'
var conid
var PlantInt
var conFormRecord

	//合同资金状况的form 相关
	var conFc = {
		'pid':{
			name:'pid',
			filedLabel:'工程项目编号',
			rendOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'conid':{
			name:'conid',
			fieldLabel:'合同主键',
			rendOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'conno':{
			name:'conno',
			fieldLabel:'合同编号',
			readOnly:true,
			anchor:'95%'
		},'conname':{
			name:'conname',
			fieldLabel:'合同名称',
			readOnly:true,
			anchor:'95%'
		},'signdate':{
			name:'signdate',
			fieldLabel:'合同签订时间',
			readOnly:true,
			disabled:true,
			format:'Y-m-d',
			anchor:'95%'
		},'convalue':{
			name:'convalue',
			fieldLabel:'合同签订金额',
			readOnly:true,
			anchor:'95%'
		},'bdgmoney':{
			name:'bdgmoney',
			fieldLabel:'合同概算金额',
			readOnly:true,
			anchor:'95%'
		}
	}

	var ConColumns = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'conno', type: 'string'},    	
		{name: 'conname', type: 'string'},
		{name: 'convalue', type: 'float'},
		{name: 'bdgmoney', type: 'float'},
		{name: 'signdate', type: 'date', dateFormat: 'Y-m-d H:i:s'}		
	]
	
	conFormRecord = Ext.data.Record.create(ConColumns)
	
	var conFormPanel = new Ext.form.FormPanel({
		id:'con-form',
		header:false,
		width:400,
		height:100,
		split:true,
		collapsible:true,
		collapseMode:'mini',
		border:false,
		region:'center',
		bodyStyle:'padding:10px 10px;border:0px dashed #3764A0',
		iconCls:'icon-detail-form',
		labelAlign:'left',
		items:[
			new Ext.form.FieldSet({
				id:'con-fieldSet',
				title:conFormSetTitle,
				border:true,
				layout:'column',
				items:[{
					layout:'form',
					columnWidth:.4,
					bodyStyle:'border:0px;',
					items:[
						new Ext.form.TextField(conFc['conno']),
						new Ext.form.TextField(conFc['convalue']),
						new Ext.form.DateField(conFc['signdate'])
					]
				},{
					layout:'form',
					columnWidth:.6,
					bodyStyle:'border:5px;',
					items:[
						new Ext.form.TextField(conFc['conname']),
						new Ext.form.TextField(conFc['bdgmoney']),
						new Ext.form.TextField({
							id:'totalPay',
							name:'totalPay',
							fieldLabel:'付款总金额',
							readOnly:true,
							anchor:'95%'
						})
					]					
				}]				
			}),
			new Ext.form.TextField(conFc['conid']),
			new Ext.form.TextField(conFc['pid'])
		]
	})
	
	//合同计划付款的grid 相关
	var planFc = {
		'planconid':{
			name:'planconid',
			fieldLabel:'付款计划主键',
			hidden:true,
			hideLabel:true
		},'pid':{
			name:'pid',
			fieldLabel:'工程项目编号',
			hidden:true,
			hideLabel:true
		},'conid':{
			name:'conid',
			fieldLabel:'合同主键',
			hidden:true,
			hideLabel:true
		},'plantime':{
			name:'plantime',
			fieldLabel:'计划付款时间',
			format:'Y-m-d',
			readOnly:true,
			anchor:'95%'
		},'plainmoney':{
			name:'plainmoney',
			fieldLabel:'计划付款金额',
			anchor:'95%'
		},'planRemark':{
			name:'planRemark',
			fieldLabel:'备注',
			blankText:'',
			anchor:'95%'
		}
	}
	
	var PlanColumns = [
		{name:'planconid',type:'string'},
		{name:'pid',type:'string'},
		{name:'conid',type:'string'},
		{name:'plantime',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'plainmoney',type:'float'},
		{name:'planRemark',type:'string'}
	]
	
	var Plant = Ext.data.Record.create(PlanColumns)
	PlantInt = {planconid:null,pid:CURRENTAPPID,conid:conid,plantime:'',plainmoney:0,planRemark:''}
	
	var sm = new Ext.grid.CheckboxSelectionModel()
	
	var cm = new Ext.grid.ColumnModel([
		sm,{
			id:'planconid',
			header:planFc['planconid'].fieldLabel,
			dataIndex:planFc['planconid'].name,
			hidden:true
		},{
			id:'pid',
			header:planFc['pid'].fieldLabel,
			dataIndex:planFc['pid'].name,
			hidden:true
		},{
			id:'conid',
			header:planFc['conid'].fieldLabel,
			dataIndex:planFc['conid'].name,
			hidden:true
		},{
			id:'plantime',
			header:planFc['plantime'].fieldLabel,
			dataIndex:planFc['plantime'].name,
			renderer:formatDate,
			editor:new Ext.form.DateField(planFc['plantime']),
			width:100
		},{
			id:'plainmoney',
			header:planFc['plainmoney'].fieldLabel,
			dataIndex:planFc['plainmoney'].name,
			renderer: cnMoney,
			editor:new Ext.form.NumberField(planFc['plainmoney']),
			width:150
		},{
			id:'planRemark',
			header:planFc['planRemark'].fieldLabel,
			dataIndex:planFc['planRemark'].name,
			editor:new Ext.form.TextArea(planFc['planRemark']),
			width:200
		}
	])
	cm.defaultSortable = true
	
	var planDs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				
	    	bean: bean,				
	    	business: business,
	    	method: listMethod
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, PlanColumns),
		remoteSort:true,
		pruneModifiedRecords:true
	})
	planDs.setDefaultSort(orderColumn,'asc')

	var planGrid = new Ext.grid.EditorGridTbarPanel({
		id:'con-plan-grid',
		ds:planDs,
		cm:cm,
		sm:sm,
		width:400,
		height:425,		
		border:false,
		region:'south',
		clicksToEdit:2,
		header:false,
		frame:false,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
        viewConfig:{
        	ignoreAdd:true
        },
        tbar:[],
        bbar:new Ext.PagingToolbar({
        	pageSize:PAGE_SIZE,
        	store:planDs,
        	displayInfo:true,
        	displayMsg:' {0} - {1} / {2}',
        	emptyMsg:'无记录。'
        }),
        plant:Plant,
        plantInt:PlantInt,
        servletUrl:MAIN_SERVLET,
        bean:bean,
        business:business,
        primaryKey:primaryKey
	})
	
	planGrid.on('beforeinsert',function(){
		if(conid ==''||conid ==null){
			Ext.Msg.alert('系统提示','请选择具体合同再进行操作')
			return false
		}
	})
	
	function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    }
	
	
	
	
	
	
	
	
	
	