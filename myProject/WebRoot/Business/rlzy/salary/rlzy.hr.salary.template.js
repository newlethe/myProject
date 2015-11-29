var bean = "com.sgepit.pmis.rlzj.hbm.HrSalaryTemplate"
var business = "baseMgm"
var listMethod = "findWhereOrderBy"
var primaryKey = "uids"
var orderColumn = "uids"
var selectedTemplateUids = "0"
var sm,cm,ds
var gridPanel;

var recordArr = new Array();
Ext.onReady(function(){
	//工资单类型
	var salaryTypeArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select uids,name from HR_SALARY_TYPE where uids!='BONUS'",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			salaryTypeArr.push(temp);
		}
	})
	DWREngine.setAsync(true);
	var salaryTypeDs = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
		data: salaryTypeArr
	});
	
	var fm = Ext.form;
	 
	var fc = {
		'uids':{name:'uids',fieldLabel:'主键'},
		'templateName':{name:'templateName',fieldLabel:'模板名称',allowBlank:false},
		'templateDept':{name:'templateDept',fieldLabel:'使用部门'},
		'sjType':{name:'sjType',fieldLabel:'时间',allowBlank:false},
		'salaryType':{name:'salaryType',fieldLabel:'工资单类别',allowBlank:false},
		'formula':{name:'formula',fieldLabel:'使用的公式'},
		'xgridTitle':{name:'xgridTitle',fieldLabel:'工资单表头'},
		'state':{name:'state',fieldLabel:'状态'},
		'remark':{name:'remark',fieldLabel:'备注'},
		'pid':{name:'pid',fieldLabel:'PID'}
	};
	var salaryTypeCombo = new Ext.form.ComboBox({
		displayField: 'v',
		valueField:'k',
		mode: 'local',
		allowBlank:false,
        typeAhead: true,
        triggerAction: 'all',
        editable: false,
        store: salaryTypeDs,
        lazyRender:true
	})
	
	var deptArray = new Array();
	var deptStore = new Ext.data.SimpleStore({
        fields: ['val', 'txt']
    });
    var sql = "select t.unitid,t.unitname from sgcc_ini_unit t where t.unit_type_id = '8' "
		+ " start with t.unitid = '"+USERBELONGUNITID+"' "
		+ " connect by PRIOR  t.unitid =  t.upunit";
	if(CURRENTAPPID == "1030902" || CURRENTAPPID == "1030903"){
		sql = "select t.unitid,t.unitname "
  		+ " from sgcc_ini_unit t where t.unit_type_id != '7' "
 		+ " and (t.unitid like '1030901%' or t.unitid like '1030902%' or t.unitid like '1030903%') "
 		+ " and(t.upunit like '1030901%' or t.upunit = '10309') "
 		+ " order by t.unitid asc";
	}
	DWREngine.setAsync(false);
	baseDao.getData(sql, function(list){
		for (var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
	 		temp.push(list[i][1]);
	 		deptArray.push(temp);
		}
	});
	DWREngine.setAsync(true);
	deptStore.loadData(deptArray);
	var templateDeptCombo = new Ext.form.MultiSelect({
    	store: deptStore,
    	displayField:'txt',
		valueField:'val',
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true,
		anchor:'95%'
	})
	var Columns = [
		{name:'uids',type:'string'},
		{name:'templateName',type:'string'},
		{name:'templateDept',type:'string'},
		{name:'sjType',type:'string'},
		{name:'salaryType',type:'string'},
		{name:'formula',type:'string'},
		{name:'xgridTitle',type:'string'},
		{name:'state',type:'string'},
		{name:'remark',type:'string'},
		{name:'pid',type:'string'}
	];
	
	var Plant = Ext.data.Record.create(Columns);   	
	
	var PlantInt = {
		uids:'',
		templateName:'',
		templateDept:'',
		sjType:'',
		salaryType:'',
		formula:'',
		xgridTitle:'0',
		state:'1',
		remark:'',
		pid:CURRENTAPPID
	}
	
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	
	cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uids',header: fc['uids'].fieldLabel,dataIndex: fc['uids'].name,hidden:true},
		{id:'templateName',header: fc['templateName'].fieldLabel,dataIndex: fc['templateName'].name,
			editor:new fm.TextField(fc['templateName']),width:160,align:"center"
		},
		{id:'sjType',header: fc['sjType'].fieldLabel,dataIndex: fc['sjType'].name,
			editor:new fm.NumberField(fc['sjType']),width:80,align:"center"
		},
		{id:'templateDept',header:fc['templateDept'].fieldLabel,dataIndex:fc['templateDept'].name,
			renderer:function(value,cell,record){
				var arr = value.split(",");
				var str = '';
				for(var i=0;i<deptArray.length;i++){
					for(var j=0;j<arr.length;j++){
						if(arr[j] == deptArray[i][0]){
							str +=deptArray[i][1]+',';
						}
					}
				}
				return "<div id="+record.get("uids")+">"+str+"</div>";
			},
			editor:templateDeptCombo,width:120,align:'center'
		},
		{id:'salaryType',header: fc['salaryType'].fieldLabel,dataIndex: fc['salaryType'].name,
			renderer:function(value){
				var str = '';
		   		for(var i=0; i<salaryTypeArr.length; i++) {
		   			if (salaryTypeArr[i][0] == value) {
		   				str = salaryTypeArr[i][1]
		   				break; 
		   			}
		   		}
		   		return str;
			},
			editor:salaryTypeCombo,width:80,align:"center"
		},
		{id:'formula',header: fc['formula'].fieldLabel,dataIndex: fc['formula'].name,
			renderer:function(value,cell,record){
				return "<a href=javascript:formulaView('"+record.get('uids')+"')>查看</a>"
			},width:80,align:"center"
		},
		{id:'xgridTitle',header: fc['xgridTitle'].fieldLabel,dataIndex: fc['xgridTitle'].name,
			renderer:function(value,cell,record){
				return "<a href=javascript:openView()>查看表头</a>"
			},width:80,align:"center"
		},
		{id:'excel', header: "Excel模板",
			renderer:function(value,cell,record, rowInx, colInx){
				return "<a href=javascript:openExcel1('"+record.get('uids')+"','"+ rowInx +"')>查看</a>"
			},width:80,align:"center"
		},
		{id:'state',header: fc['state'].fieldLabel,dataIndex: fc['state'].name,hidden:true},
		{id:'remark',header: fc['remark'].fieldLabel,dataIndex: fc['remark'].name,
			editor:new fm.TextField(fc['remark']),width:160,align:"center"
		},
		{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true}
	]);
	
	cm.defaultSortable = true;
	
	ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method:listMethod,
			params:"salaryType != 'BONUS' and pid = '"+CURRENTAPPID+"' "
		},
		proxy:new Ext.data.HttpProxy({
			method: 'GET',
            url: MAIN_SERVLET
		}),
		reader:new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns),
		remoteSort: true,
        pruneModifiedRecords: true
	});
	ds.setDefaultSort(orderColumn, 'desc');
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds:ds,
		sm:sm,
		cm:cm,
		tbar: ['<font color=#15428b><b>工资模版维护</b></font>','-'],
        region: 'center',
        border: false,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows:true, 
		saveHandler: saveTemplateHandler,
      	deleteHandler: deleteTemplateHandler,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant:Plant,				
      	plantInt:PlantInt,			
      	servletUrl:MAIN_SERVLET,		
      	bean:bean,					
      	business:business,	
      	primaryKey:primaryKey
	});
	ds.load({params:{start:0,limt:PAGE_SIZE}});
	
	function deleteTemplateHandler(){
		var record = sm.getSelected();
		if(record!=null&&record!=""){
			Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,	text) {
				if (btn == "yes") {
					DWREngine.setAsync(false);
					rlzyXcglMgm.deleteTemplateByUids(selectedTemplateUids,function(str){
						if(str=="0"){
							Ext.example.msg('操作成功','模板删除成功！');
							ds.reload();
						}else if(str=="1"){
							Ext.example.msg('操作失败','该模板已经被使用，不能删除！');
						}else if(str=="2"){
							Ext.example.msg('操作失败','系统错误，请检查后重新删除！');
						}
					})
					DWREngine.setAsync(true);
				}
			})
		}
	}
	function saveTemplateHandler(){
		var records = ds.getModifiedRecords();
		var boolSj = boolSalary = boolName = true;
		var sj = "";
		if(records!=null&&records.length>0){
			for (var i = 0; i < records.length; i++) {
				if(records[i].get('templateName')=="") boolName = false;
				if(records[i].get('salaryType')=="") boolSalary = false;
				sj = records[i].get('sjType').toString();
				if(sj.length!=8)boolSj = false;
				if(parseInt(sj.substr(4,2),10)>12||parseInt(sj.substr(4,2),10)<1)boolSj = false;
				if(!boolSj||!boolName||!boolSalary) break;
			}
		}
		if(!boolSj){
			Ext.Msg.show({
				title : '时间格式错误！',
				msg : "时间格式为8为数字，前四位为当前年份，如2011，中间两位为当前月份，如06，最后两位为工资发放次数。<br><br><p align='center'>请检查后重新保存！</p>",
				buttons : Ext.Msg.OK,
				width : 400,
				icon : Ext.MessageBox.ERROR
			});
		}else if(!boolName){
			Ext.Msg.show({
				title : '保存出错！',
				msg : "模板名称必须填写！",
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.ERROR
			});
		}else if(!boolSalary){
			Ext.Msg.show({
				title : '保存出错！',
				msg : "工资单类别必须选择！",
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.ERROR
			});
		}else{
			for (var i = 0; i < records.length; i++) {
				if(records[i].get('templateDept').indexOf(",")!=0)
					records[i].set("templateDept",","+records[i].get('templateDept')+",");
			}
			gridPanel.defaultSaveHandler();
		}	
	}
	
	
	//=====科目=====
	var itemBtn = new Ext.Button({
		id:'item',
		iconCls:'btn',
		text:'设置科目',
		handler:setItemFun
	})
	var itemBean = "com.sgepit.frame.guideline.hbm.SgccGuidelineInfo";
	var itemPrimaryKey = "zbSeqno"
	var itemOrderColumn = "zbSeqno"
	var itemColumns = [
		{name:'zbSeqno',type:'string'},
		{name:'realname',type:'string'}
	]
	var itemSm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	var itemCm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
		itemSm,
		{id:'zbSeqno',header:'科目编号',dataIndex:'zbSeqno',width:80},
		{id:'realname',header:'科目名称',dataIndex:'realname',width:160}
	])
	var itemDs = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:itemBean,
			business:business,
			method:listMethod,
			params:"parentid='005' and state='1'"
		},
		proxy:new Ext.data.HttpProxy({
			method: 'GET',
            url: MAIN_SERVLET
		}),
		reader:new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: itemPrimaryKey
		},itemColumns),
		remoteSort: true,
        pruneModifiedRecords: true
	});
	itemDs.setDefaultSort(itemOrderColumn, 'asc');
	var formulaTextArea = new Ext.form.TextArea({
		id:'formulaTextArea',
		fieldLabel:'公式',
//		readOnly:true,
		layout: 'form',
		width:450,
		height:90
	});
	var formulaHidden = new Ext.form.Hidden({
		id:'formulaHidden'
	});
	var selAccBtn = new Ext.Button({
		id:'selAccBtn',
		iconCls:'btn',
		text:'选择工资账套',
		handler:selAccFun
	})
	var editForBtn = new Ext.Button({
		id:'editForBtn',
		iconCls:'btn',
		text:'编辑计算公式'
	})
	var itemCompleteBtn = new Ext.Button({
		id:'itemCompleteBtn',
		iconCls:'save',
		text:'科目设置完成',
		handler:compItemFun
	})
	var itemPanel = new Ext.grid.GridPanel({
		ds:itemDs,
		sm:itemSm,
		cm:itemCm,
		tbar: [selAccBtn,'->',itemCompleteBtn],
        region: 'center',
        border: false,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows:true, 
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
		
	})
	itemDs.load();
	itemSm.handleMouseDown = Ext.emptyFn;
	
	
	//科目
	var kmArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select zb_seqno,name from sgcc_guideline_info where parentid='005' order by zb_seqno ",function(list){
	for(var i=0;i<list.length;i++){
			var temp = new Array();
			temp.push("ITEM:"+list[i][0]);
	 		temp.push(list[i][1]);
	 		kmArr.push(temp);
	 	}
	})
	DWREngine.setAsync(true);
	var kmSelStore = new Ext.data.SimpleStore({
		id : 'km',
		fields : ['k','v'],
		data:kmArr
	});
	var kmSel_com = new fm.ComboBox({
		id : 'kmsel',
		fieldLabel:'科目',
		width:110,
		readOnly : true,
		store:kmSelStore,
		displayField : 'v',
		valueField : 'k',
		triggerAction: 'all',
		mode: 'local',
		listeners:{
			'select':function(combo,record,index){
				var form = formPanel.getForm();
				var text =form.findField('formulaTextArea').getValue();
				form.findField('formulaTextArea').setValue(text+record.data.v)
        	},
        	'beforequery':function(){
        		var records = itemSm.getSelections();
        		var dataArr = new Array();
        		if(records.length==0){
					Ext.example.msg('提示','请先选择科目！');
					return false;
				}
        		for (var i = 0; i < records.length; i++) {
        			dataArr.push(["ITEM:"+records[i].get('zbSeqno'),records[i].get('realname')])
        		}
        		kmSelStore.loadData(dataArr)
        	}
        }
	})
	
	
	//参数
	var paramArr = new Array();

	var paramStore = new Ext.data.SimpleStore({
		id : 'par',
		fields : ['k','v'],
		data:paramArr
	});
	var param_com = new fm.ComboBox({
		id : 'params',
		fieldLabel:'参数',
		width:110,
		store:paramStore,
		readOnly : true,
		displayField : 'v',
		valueField : 'k',
		triggerAction: 'all',
		mode: 'local',
		listeners:{
			'select':function(combo,record,index){
				var form = formPanel.getForm();
				var text = form.findField('formulaTextArea').getValue();
				form.findField('formulaTextArea').setValue(text+record.data.v)
        	},
        	'beforequery':function(){
        		DWREngine.setAsync(false);
        		var parArr = new Array();
				var sql = "select t1.uids,t1.name  from hr_salary_basic_info t1 ,hr_salary_template_item t2 " +
						"where t1.uids = t2.item_id and t2.type = 'PARAM' and t2.template_id = '"+selectedTemplateUids+"'"
				baseMgm.getData(sql,function(list){
					if(list.length==0){
						Ext.example.msg('提示','请先设置参数！');
						return false;
					}
					for(var i=0;i<list.length;i++){
						var temp = new Array();
						temp.push("PARAM:"+list[i][0]);
				 		temp.push(list[i][1]);
				 		parArr.push(temp);
				 	}
				})
				paramStore.loadData(parArr)
				DWREngine.setAsync(true);
        	}
        }
	})
	//运算符号
	var symbol_arr =[['=','='],['-','-'],['+','+'],['*','*'],['/','/'],['(','('],[')',')']]
	var symbStore = new Ext.data.SimpleStore({
		id:'symb',
		fields : ['k','v'],
		data : symbol_arr
	})
	var symbol_com = new fm.ComboBox({
		id : 'symbol',
		fieldLabel:'符号',
		readOnly : true,
		width:110,
		store:symbStore,
		displayField : 'v',
		valueField : 'k',
		triggerAction: 'all',
		mode: 'local',
		listeners:{'select':function(combo,record,index){
			var form = formPanel.getForm();
			var text =form.findField('formulaTextArea').getValue();
			form.findField('formulaTextArea').setValue(text+record.data.v)
        }}
	})
	var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        autoScroll:true,
        region: 'south',
        bodyStyle: 'padding:10px;',
        height: 180,
        items: [{
			layout: 'column',
			autoWidth:true,
	        border:false, 
	        items: [{
    			layout: 'form',
    			width:170,
                border:false, 
                labelWidth:36,
                items: [kmSel_com]
        	},{
    			layout: 'form',
                border:false, 
                width:170,
                labelWidth:36,
                items: [param_com]
        	},{
    			layout: 'form',
                border:false, 
                width:170,
                labelWidth:36,
                items: [symbol_com]
        	}]
        },{
//        	layout: 'column',
//            border:false,
//            height:30,
//            items: [{
//            	columnWidth:0.12,layout:"form",border:false,
//                items: [{xtype:'button',text:"+",minWidth:40,handler:symbolFun}]
//			},{
//                columnWidth:0.12,layout:"form",border:false,
//                items: [{xtype:'button',text:"-",minWidth:40,handler:symbolFun}]
//			},{
//				columnWidth:0.12,layout:"form",border:false,
//                items: [{xtype:'button',text:"*",minWidth:40,handler:symbolFun}]
//			},{
//				columnWidth:0.12,layout:"form",border:false,
//                items: [{xtype:'button',text:"/",minWidth:40,handler:symbolFun}]
//			},{
//				columnWidth:0.12,layout:"form",border:false,
//                items: [{xtype:'button',text:"=",minWidth:40,handler:symbolFun}]
//			},{
//				columnWidth:0.12,layout:"form",border:false,
//                items: [{xtype:'button',text:"(",minWidth:40,handler:symbolFun}]
//			},{
//				columnWidth:0.12,layout:"form",border:false,
//                items: [{xtype:'button',text:")",minWidth:40,handler:symbolFun}]
//			},{
//				columnWidth:0.12,layout:"form",border:false,
//                items: [{xtype:'button',text:";",minWidth:40,handler:symbolFun}]
//			}]
//		},{
			layout: 'form',
            border:false, 
            labelWidth:36,
            items: [formulaTextArea,formulaHidden]
         }]
    });
    
    function symbolFun(){
    	var sym = this.text;
    	var form = formPanel.getForm();
		var text =form.findField('formulaTextArea').getValue();
		form.findField('formulaTextArea').setValue(text+sym)
    } 
    
	
	var itemWin = new Ext.Window({
		title:'工资科目列表',
		width: 550,
		height: document.body.clientHeight*0.95,
		modal: true,
		plain: true, 
		border: false, 
		resizable: false,
		closeAction: 'hide',
		layout: 'border',
		items:[itemPanel,formPanel]
	});
	itemSm.on('rowselect',function(){})
	
	function setItemFun(){
		var record = sm.getSelected();
		if(record==null||record==""){
			Ext.example.msg('出现错误','请先选择模板！');
			return;
		}else if(record.get('uids')==""){
			Ext.example.msg('出现错误','请先保存模板！');
			return;			
		}
		DWREngine.setAsync(false);
		//读取代码格式公式
		FormulaUtil.getTemplateFormula(selectedTemplateUids,function(formula){
			Ext.getCmp('formulaHidden').setValue(formula);
			//将代码格式公式转为中文显示
			FormulaUtil.getFormulaText(formula,function(str){
				str = str.replace(/;/g, ";\n");
				Ext.getCmp('formulaTextArea').setValue(str);
			})
		})
		//读取已经被选择的科目
		var uidsArray = new Array();
		var sql = "select item_id from hr_salary_template_item where template_id = '"+selectedTemplateUids+"' and type = 'ITEM' ";
		baseMgm.getData(sql,function(list){
			for(var i = 0;i<list.length;i++){
				uidsArray.push(list[i])
			}
		})
		DWREngine.setAsync(true);
		itemDs.load({
			callback:function(){
				var rows = new Array();
				for (var i = 0; i < uidsArray.length; i++) {
					var r = itemDs.indexOfId(uidsArray[i])
					rows.push(r);
				}
				itemSm.selectRows(rows,true);
			}
		})	
		itemWin.show();
	}
	function selAccFun(){
		accWin.show();
	}
	function compItemFun(){
		var textArea = Ext.getCmp('formulaTextArea').getValue();
		var textAreaHidden = Ext.getCmp('formulaHidden').getValue();
		if(textArea==null||textArea==""){
			Ext.example.msg('操作失败','请先编辑完成公式！');
			return;
		}
		var records = itemSm.getSelections();
		if(records==null||records.length==0){
			Ext.example.msg('操作失败','请先选择科目！');
			return;
		}
		var zbSeqnoArr = new Array();
		for (var i = 0; i < records.length; i++) {
			zbSeqnoArr.push("'"+records[i].get('zbSeqno')+"'");
		}
		
		DWREngine.setAsync(false);
		textArea = textArea.replace(/\s/g, "");
		FormulaUtil.getFormulaByText(textArea,function(str){
			if(str.indexOf("ITEM")==0){
				textAreaHidden = str;
				Ext.getCmp('formulaHidden').setValue(str);
				rlzyXcglMgm.getItemAndFormulaToTemplate(zbSeqnoArr,textAreaHidden,selectedTemplateUids,function(bool){
					if(bool){
						//根据模板的公式生成表头
						FormulaUtil.updateXgridTitle(selectedTemplateUids);
						Ext.example.msg('操作成功','科目公式保存成功！');
						itemWin.hide();
						ds.reload();
					}else{
						Ext.example.msg('操作失败','请检查后重新操作！');
					}	
				})
			}else{
				Ext.Msg.alert("公式定义错误",str);
			}
		})
		DWREngine.setAsync(true);
	}
	itemWin.on('hide',function(){
	    //窗口关闭时行清空选择和文本域
		//itemDs.getTotalCount();
	    itemSm.deselectRange(0,itemDs.getCount());
		formulaTextArea.reset();
	})
	
	//=====账套=====
	var accBean = "com.sgepit.pmis.rlzj.hbm.HrAccountSet";
	var accPrimaryKey = "uids"
	var accOrderColumn = "uids"
	var accColumns = [
		{name:'uids',type:'string'},
		{name:'code',type:'string'},
		{name:'name',type:'string'},
		{name:'items',type:'string'},
		{name:'formula',type:'string'},
		{name:'pid',type:'string'}
	]
	var accSm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var accCm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
		accSm,
		{id:'uids',header:'主键',dataIndex:'uids',hidden:true},
		{id:'code',header:'账套编号',dataIndex:'code',width:80},
		{id:'name',header:'账套名称',dataIndex:'name',width:160},
		{id:'items',header:'科目',dataIndex:'items',hidden:true},
		{id:'formula',header:'公式',dataIndex:'formula',hidden:true},
		{id:'pid',header:'PID',dataIndex:'pid',hidden:true}
	])
	var accDs = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:accBean,
			business:business,
			method:listMethod,
			params:"state = '1' and pid = '"+CURRENTAPPID+"' and deptid like '%,"+USERDEPTID+",%' "
		},
		proxy:new Ext.data.HttpProxy({
			method: 'GET',
            url: MAIN_SERVLET
		}),
		reader:new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: accPrimaryKey
		},accColumns),
		remoteSort: true,
        pruneModifiedRecords: true
	});
	accDs.setDefaultSort(accOrderColumn, 'asc');
	var accFormulaTextArea = new Ext.form.TextArea({
		id:'accFormulaTextArea',
		readOnly:true,
		width:360,
		height:90
	});
	
	var selAccToTempBtn = new Ext.Button({
		id:'selAccToTempBtn',
		iconCls:'btn',
		text:'选择账套',
		handler:selAccToTempFun
	})
	
	var accPanel = new Ext.grid.GridPanel({
		ds:accDs,
		sm:accSm,
		cm:accCm,
		//tbar: ['-','账套列表','-'],
        region: 'center',
        width : 400,
        layout : 'fit',
        split:true,
        border: false,
        autoScroll: true,			//自动出现滚动条
        collapsible: true,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows:true, 
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: accDs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	})
	accDs.load();
	
	//var accItemSm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	var accItemCm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
		//itemSm,
		{id:'zbSeqno',header:'科目编号',dataIndex:'zbSeqno',width:80},
		{id:'realname',header:'科目名称',dataIndex:'realname',width:160}
	])
	var accItemDs = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:itemBean,
			business:business,
			method:listMethod,
			params:" pid = '"+CURRENTAPPID+"' "
		},
		proxy:new Ext.data.HttpProxy({
			method: 'GET',
            url: MAIN_SERVLET
		}),
		reader:new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: itemPrimaryKey
		},itemColumns),
		remoteSort: true,
        pruneModifiedRecords: true
	});
	accItemDs.setDefaultSort(itemOrderColumn, 'asc');
	var accItemsPanel = new Ext.grid.GridPanel({
		ds:accItemDs,
		//sm:itemSm,
		cm:accItemCm,
		layout : 'fit',
		//tbar: ['-','科目列表','-'],
        region: 'east',
        border: false,
        width : 400,
        autoScroll: true,			//自动出现滚动条
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        split: true,			//设置可滑动
        collapsible : true,		//滑动展开，左右展开
        collapsed: false,		//滑动展开，设置默认为展开
        collapseMode : 'mini',	//设置可滑动展开与关闭	
        stripeRows:true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar:['公式：',accFormulaTextArea]
	});

	
	var accWin = new Ext.Window({
		title:'选择工资账套',
		tbar:[selAccToTempBtn],
		width: 880,
		height: document.body.clientHeight*0.95,
		modal: true,
		plain: true, 
		border: false, 
		resizable: false,
		closeAction: 'hide',
		layout : 'border',
		items:[accPanel,accItemsPanel]
	})
	
	function selAccToTempFun(){
		var record = accSm.getSelected();
		var formula = record.get('formula');
		var items = record.get('items').split(",")
		var rows = new Array();
		for (var i = 0; i < items.length; i++) {
			var r = itemDs.indexOfId(items[i])
			rows.push(r);
		}
		itemSm.deselectRange(0,itemDs.getCount());
		itemSm.selectRows(rows,true);
		
		DWREngine.setAsync(false);
		Ext.getCmp('formulaHidden').setValue(formula);
		//将代码格式公式转为中文显示
		FormulaUtil.getFormulaText(formula,function(str){
			str = str.replace(/;/g, ";\n");
			Ext.getCmp('formulaTextArea').setValue(str);
		})
		DWREngine.setAsync(true);
		accWin.hide();
	}
	
	//=====参数=====
	var paramBtn = new Ext.Button({
		id:'param',
		iconCls:'btn',
		text:'设置参数',
		handler:setParamFun
	})
	var paramBean = "com.sgepit.pmis.rlzj.hbm.HrSalaryBasicInfo";
	var paramPrimaryKey = "uids"
	var paramOrderColumn = "orderNum"
	var paramColumns = [
		{name:'uids',type:'string'},
		{name:'code',type:'string'},
		{name:'name',type:'string'},
		{name:'configInfo',type:'string'},
		{name:'orderNum',type:'string'}
	]
	var paramSm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	var paramCm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
		paramSm,
		{id:'uids',header:'主键',dataIndex:'uids',hidden:true},
		{id:'code',header:'编号',dataIndex:'code',width:80},
		{id:'name',header:'名称',dataIndex:'name',width:160},
		{id:'configInfo',header:'来源',dataIndex:'configInfo',hidden:true},
		{id:'orderNum',header:'排序',dataIndex:'orderNum',hidden:true}
	])
	var paramDs = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:paramBean,
			business:business,
			method:listMethod,
			params:""
		},
		proxy:new Ext.data.HttpProxy({
			method: 'GET',
            url: MAIN_SERVLET
		}),
		reader:new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: paramPrimaryKey
		},paramColumns),
		remoteSort: true,
        pruneModifiedRecords: true
	});
	paramDs.setDefaultSort(paramOrderColumn, 'asc');

	var paramCompleteBtn = new Ext.Button({
		id:'paramCompleteBtn',
		iconCls:'save',
		text:'参数选择完成',
		handler:compParamFun
	})
	var paramPanel = new Ext.grid.GridPanel({
		ds:paramDs,
		sm:paramSm,
		cm:paramCm,
		tbar: ['->',paramCompleteBtn],
        region: 'center',
        border: false,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows:true, 
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
		
	})
	paramDs.load();
	paramSm.handleMouseDown = Ext.emptyFn;
	
	var paramWin = new Ext.Window({
		title:'工资科目列表',
		width: 480,
		height: 500,
		modal: true,
		plain: true, 
		border: false, 
		resizable: false,
		closeAction: 'hide',
		layout: 'fit',
		items:[paramPanel]
	});
	function setParamFun(){
		var record = sm.getSelected();
		if(record==null||record==""){
			Ext.example.msg('出现错误','请先选择模板！');
			return;
		}else if(record.get('uids')==""){
			Ext.example.msg('出现错误','请先保存模板！');
			return;			
		}
		//读取已经被选择的科目
		var uidsArray = new Array();
		var sql = "select item_id from hr_salary_template_item where template_id = '"+selectedTemplateUids+"' and type = 'PARAM' ";
		baseMgm.getData(sql,function(list){
			for(var i = 0;i<list.length;i++){
				uidsArray.push(list[i])
			}
		})
		DWREngine.setAsync(true);
		itemDs.load({
			callback:function(){
				var rows = new Array();
				for (var i = 0; i < uidsArray.length; i++) {
					var r = paramDs.indexOfId(uidsArray[i])
					rows.push(r);
				}
				paramSm.selectRows(rows,true);
			}
		})	
		paramWin.show();
	}
	function compParamFun(){
		var records = paramSm.getSelections();
		var uidsArr = new Array();
		for (var i = 0; i < records.length; i++) {
			uidsArr.push("'"+records[i].get('uids')+"'");
		}
		DWREngine.setAsync(false);
		rlzyXcglMgm.getParamToTemplate(uidsArr,selectedTemplateUids,function(bool){
			if(bool){
				//根据模板的公式生成表头
				FormulaUtil.updateXgridTitle(selectedTemplateUids);
				Ext.example.msg('操作成功','参数选择成功！');
				paramWin.hide();
				ds.reload();
			}else{
				Ext.example.msg('操作失败','请检查后重新操作！');
			}
		})	
		DWREngine.setAsync(false);
	}
	paramWin.on('hide',function(){
	    //窗口关闭时行清空选择
	    paramSm.deselectRange(0,paramDs.getCount());
	})
	
	//=====用户=====
	var userBtn = new Ext.Button({
		id:'user',
		iconCls:'btn',
		text:'设置用户',
		handler:setUserFun
	})

	
	var root,treeLoader
	var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=tree&unitType=7`9";
	var userBean = "com.sgepit.pmis.rlzj.hbm.HrSalaryTemplateUser";
	
	root = new Ext.tree.AsyncTreeNode({
       text: USERBELONGUNITNAME,
       id: USERBELONGUNITID,
       expanded:true
    });
    treeLoader = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl + "&parentId=" + USERBELONGUNITID + "&treeName=HrManOrgTree",
		requestMethod: "GET"
	})
	if(CURRENTAPPID == "1030902" || CURRENTAPPID == "1030903"){
		root = new Ext.tree.AsyncTreeNode({
	       text: '山西国金电力有限公司',
	       id: '10309',
	       expanded:true
	    });
		treeLoader = new Ext.tree.TreeLoader({
			dataUrl: treeNodeUrl + "&parentId=10309&treeName=HrManOrgTree",
			requestMethod: "GET"
		})
	}
	treePanel = new Ext.tree.TreePanel({
        id:'orgs-tree',
        region:'west',
        border:false,
        split:true,
        width: 180,
        minSize: 150,
        maxSize: 200,
        frame: false,
        layout: 'accordion',
        rootVisible: true,
        lines:false,
        autoScroll:true,
        collapsible: true,
        animCollapse:false,
        animate: false,
        collapseMode:'mini',
        tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ root.collapse(true); }
        }],
        loader: treeLoader,
        root: root,
        collapseFirst:false
	});
	treePanel.on('beforeload', function(node){ 
		treePanel.loader.dataUrl = treeNodeUrl+"&parentId="+node.id+"&treeName=HrManOrgTree"; 
	});
	
    treePanel.on('click', function(node, e){
		e.stopEvent();
		PlantInt.posid = node.id;
		var titles = [node.text];
		var obj = node.parentNode;
		while(obj!=null){
			titles.push(obj.text);
			obj = obj.parentNode;
		}
		selectedOrgId = node.id
		selectedOrgName = node.text
		var  strTree = ''
		DWREngine.setAsync(false);
			baseMgm.getData("select t.unitid from sgcc_ini_unit t start with t.unitid = '"+node.id+"' connect by prior t.unitid = t.upunit",function(list){
				if(list !=null){
					for(var i = 0;i<list.length;i++){
						if(list.length == 1){
							strTree="'"+list[i]+"'";
						}else{
							if(i>=0 && i< list.length-1){
								strTree +="'"+list[i]+"',";
							}else{
								strTree +="'"+list[i]+"'";
							}	
						}
					}
				}
			});
		DWREngine.setAsync(true);  
		var paramStrCur = "posId"+SPLITB+USERUNITID+SPLITA+"posid"+SPLITB+strTree+SPLITA+"templateId"+SPLITB+selectedTemplateUids;
		if(CURRENTAPPID == "1030902" || CURRENTAPPID == "1030903"){
			paramStrCur = "posId"+SPLITB+node.id+SPLITA+"posid"+SPLITB+strTree+SPLITA+"templateId"+SPLITB+selectedTemplateUids;
		}else{
			if (selectedOrgId=="1")
				paramStrCur = "posId"+SPLITB+USERUNITID+SPLITA+"templateId"+SPLITB+selectedTemplateUids;
		}
		userDs.baseParams.params = paramStrCur;
		userDs.load({params:{start: 0,limit: 20}});
    });
	
	var userSm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	var userCm = new Ext.grid.ColumnModel([
		userSm,
		{id:'manInfo.userid',header:'主键',dataIndex:'manInfo.userid',hidden: true},
		{id:'manInfo.realname',header:'用户姓名',dataIndex: 'manInfo.realname'},
		{id:'manInfo.posname',header:'部门',dataIndex:'manInfo.posname'},
//		{id:'manInfo.sex',header:'xxx',dataIndex:'manInfo.sex'},
		{id:'uids',header:'UIDS',dateIndex:'uids',hidden:true}
	]);
	userCm.defaultSortable = true;
	
	var userColumns = [
		{name: 'manInfo.userid', type: 'string'},
		{name: 'manInfo.realname', type: 'string'},
		{name: 'manInfo.posname', type: 'string'},
		{name: 'manInfo.sex', type: 'string'},
		{name: 'uids', type: 'string'}
	];
	
	var userDs = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: userBean,
			business: 'rlzyXcglMgm',
			method: 'findUserInfoByTemplate'
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'manInfo.userid'
		}, userColumns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	 
	
	var insertUsers = new Ext.Button({
		text: '选择用户',
		iconCls: 'add',
		handler: function(){
			var records = userSm.getSelections();
			if (records.length > 0){
				var useridArr = new Array();
				for (var i = 0; i < records.length; i++) {
					useridArr.push("'"+records[i].get('manInfo.userid')+"'")
				}
				DWREngine.setAsync(false);
				rlzyXcglMgm.insertUserToTemplateUser(useridArr,selectedTemplateUids,function(bool){
					if(bool){
						Ext.example.msg('操作成功','选择用户保存成功！');
						//userWin.hide();
						//userDs.reload();
						//selectedUserDs.reload();
						for (var i = 0; i < records.length; i++) {
							userDs.remove(records[i])
						}
						selectedUserDs.add(records)
					}else{
						Ext.example.msg('操作失败','请检查后重新操作！');
					}	
				})
				DWREngine.setAsync(true);
			}
		}
	})
	
	var removeUsers = new Ext.Button({
		text: '移除用户',
		iconCls: 'remove',
		handler: function(){
			var records = selectedUserSm.getSelections();
			if (records.length > 0){
				var useridArr = new Array();
				for (var i = 0; i < records.length; i++) {
					useridArr.push("'"+records[i].get('manInfo.userid')+"'")
				}
				DWREngine.setAsync(false);
				rlzyXcglMgm.deleteUserFromTemplateUser(useridArr,selectedTemplateUids,function(bool){
					if(bool){
						Ext.example.msg('操作成功','选择用户移除成功！');
						//userWin.hide();
						//userDs.reload();
						//selectedUserDs.reload();
						for (var i = 0; i < records.length; i++) {
							selectedUserDs.remove(records[i])
						}
						userDs.add(records)
					}else{
						Ext.example.msg('操作失败','请检查后重新操作！');
					}	
				})
				DWREngine.setAsync(true);
			}
		}
	})
	
	var userPanel = new Ext.grid.GridPanel({
		ds: userDs,
		cm: userCm,
		sm: userSm,
		tbar: ['-', insertUsers],
		border: false,
		region: 'center',
		header: false,
		autoScroll: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
//		enableDD: true,   
//    	ddGroup: "tgDD",    
//    	draggable : true,
//	    enableDragDrop : true,
		bbar: new Ext.PagingToolbar({
	        pageSize: PAGE_SIZE,
	        store: userDs,
	        displayInfo: true,
	        displayMsg: ' {0} - {1} / {2}',
	        emptyMsg: "无记录。"
	    })
	});
	userDs.setDefaultSort('manInfo.userid', 'desc');

	var selectedUserSm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	var selectedUserCm = new Ext.grid.ColumnModel([
		selectedUserSm,
		{id:'manInfo.userid',header:'主键',dataIndex:'manInfo.userid',hidden: true},
		{id:'manInfo.realname',header:'用户姓名',dataIndex: 'manInfo.realname'},
		{id:'manInfo.posname',header:'部门',dataIndex:'manInfo.posname'},
//		{id:'manInfo.sex',header:'xxx',dataIndex:'manInfo.sex'},
		{id:'uids',header:'UIDS',dateIndex:'uids',hidden: true}
	]);
	var selectedUserDs = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: userBean,
			business: 'rlzyXcglMgm',
			method: 'findUserInfoByTemplate'
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'manInfo.userid'
		}, userColumns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
 
	var selectedUserPanel = new Ext.grid.GridPanel({
		ds: selectedUserDs,
		cm: selectedUserCm,
		sm: selectedUserSm,
		tbar: ['<font color=#15428b><b>已选择用户</b></font>','-',removeUsers],
		border: false,
		width: 280,
		region: 'east',
		header: false,
		autoScroll: true,			//自动出现滚动条
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        split: true,			//设置可滑动
        collapsible : true,		//滑动展开，左右展开
        collapsed: false,		//滑动展开，设置默认为展开
        collapseMode : 'mini',	//设置可滑动展开与关闭	
        stripeRows:true,
		loadMask: true,
//		enableDD: true,   
//    	ddGroup: "tgDD",    
//    	draggable : true,
//	    enableDragDrop : true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		}
	});
	selectedUserDs.setDefaultSort('manInfo.userid', 'desc');
	
	
	var userWin = new Ext.Window({
		title:'选择用户',
		iconCls: 'form',
		layout: 'border',
		width: document.body.clientWidth*0.95, 
		height: document.body.clientHeight*0.95,
		modal: true,
		closeAction: 'hide',
		maximizable: true,
		plain: true,
		items: [treePanel, userPanel,selectedUserPanel]
	})

	function setUserFun(){
		var record = sm.getSelected();
		if(record==null||record==""){
			Ext.example.msg('出现错误','请先选择模板！');
			return;
		}else if(record.get('uids')==""){
			Ext.example.msg('出现错误','请先保存模板！');
			return;			
		}
		userDs.baseParams.params = "posId"+SPLITB+USERUNITID+SPLITA+"templateId"+SPLITB+selectedTemplateUids;
		if(CURRENTAPPID == "1030902" || CURRENTAPPID == "1030903"){
				userDs.baseParams.params = "posId"+SPLITB+'1030901'+SPLITA+"templateId"+SPLITB+selectedTemplateUids;
		}
		userDs.load({params:{start: 0,limit: 20}});
		selectedUserDs.baseParams.params = "selected"+SPLITB+"true"+SPLITA+"templateId"+SPLITB+selectedTemplateUids;
		selectedUserDs.load();
		userWin.show();
	}
	
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		region : 'center',
		items : [gridPanel]
	});
	gridPanel.getTopToolbar().add(itemBtn,'-',paramBtn,'-',userBtn);
	
	var notesTip = new Ext.ToolTip({
		autoHeight : true, 
    	autowidth : true,
		target: gridPanel.getEl()
	});

	gridPanel.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("4" == columnIndex){
			if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
			if(grid.getStore().getAt(rowIndex).get('uids') !=''){
				notesTip.add({
					id: 'notes_id',
					//html: grid.getStore().getAt(rowIndex).get('templateDept')
					html: Ext.getDom(grid.getStore().getAt(rowIndex).get('uids')).innerText
				});
			}
			var point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	});
	sm.on('rowselect',function(){
		var record = sm.getSelected();
		if(record!=null&&record!='')
		selectedTemplateUids = record.get('uids');
	})
	
	accSm.on('rowselect',function(){
		var record = accSm.getSelected();
		var itemsArr = record.get('items').split(",");
		for (var i = 0; i < itemsArr.length; i++) {
			itemsArr[i] = "'"+itemsArr[i]+"'"
		}
		accItemDs.baseParams.params = "parentid='005' and zbSeqno in ("+itemsArr+")";
		accItemDs.load();
		var formula = record.get('formula');
		DWREngine.setAsync(false);
		FormulaUtil.getFormulaText(formula,function(str){
			str = str.replace(/;/g, ";\n");
			Ext.getCmp('accFormulaTextArea').setValue(str);
		})
		DWREngine.setAsync(true);
	})
	
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
})


	function openView() {
		var xgrid_title = sm.getSelected().get('xgridTitle');
		if(xgrid_title == 0){
			Ext.example.msg('操作失败','还没有设置表头内容！');
		}else{
			param.head = xgrid_title
			window.showModelessDialog(parent.basePath + "Business/rlzy/salary/xgridview.jsp", param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes")
		}
	}
	
	function formulaView(){
		var formula = sm.getSelected().get('formula');
		if(formula==null||formula==""){
			Ext.example.msg('操作失败','该模板还没有设置公式！');
			return;
		}
		DWREngine.setAsync(false);
			//将代码格式公式转为中文显示
			FormulaUtil.getFormulaText(formula,function(str){
				formula = str.replace(/;/g, ";</br>");
			})
		DWREngine.setAsync(true);
		Ext.Msg.show({
			title : '使用的公式',
			msg : formula,
			width: 300,
			buttons : Ext.Msg.OK
		});
	}
	
	function openExcel1( uids, rowInd ) {
		var rec = gridPanel.getStore().getAt(rowInd);
		var headerStr = rec.data["xgridTitle"];
		
		var tran_type = "HR_SALARY_TEMPLATE";
		var fileLsh = "";
		
		var excelUrl = 	basePath+"Business/rlzy/salary/templateToExcelView.jsp"
		var param = new Object()
		param.url = MAIN_SERVLET+"?ac=downloadFile" ;
		param.businessId = uids;
		
		var sql1 = "select distinct fileID from APP_FILEINFO where BUSINESSID='" + uids + "'";
		DWREngine.setAsync(false);
		db2Json.selectSimpleData(sql1, function(dat){
			var arr = eval(dat);
			if(dat!='[]' && dat!='' && arr.length!=0 && arr[0].length>0){
				//打开模板
				fileLsh = arr[0];
				param.fileLsh = fileLsh;
				window.showModelessDialog(excelUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes")
			} else {
				if(headerStr && headerStr!=null && headerStr.length>0 && headerStr!="0" ){
					XgridBean.headerXMLStringToExcel(uids, headerStr, function (fileId) {
						if(fileId!='-1') {
							fileLsh = fileId;
							param.fileLsh = fileLsh;
							window.showModelessDialog(excelUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes")
						} else {
							Ext.example.msg('操作失败','模板导出失败！');
						}
					}); 
				} else {
					Ext.example.msg('操作失败','还没有设置表头内容！');
				}
			}
		});
		DWREngine.setAsync(true);
	}
	

