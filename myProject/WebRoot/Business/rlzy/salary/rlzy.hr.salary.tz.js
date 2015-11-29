var primaryKey = 'uids';
var gridPanel;
var bean="com.sgepit.pmis.rlzj.hbm.HrAccountSet";
var business = "baseMgm"
var listMethod = "findwhereorderby";
var paramArr =new Array();
var kArr= new Array();
var billArray = new Array();
var deptArr = new Array();
var flag=false;
Ext.onReady(function(){
	DWREngine.setAsync(false);
	
	 baseMgm.getData("select zb_seqno,name from sgcc_guideline_info where parentid='005' order by zb_seqno ",function(list){
	 	for(var i=0;i<list.length;i++){
	 		var temp = new Array();
	 		temp.push(list[i][0]);
	 		temp.push(list[i][1]);
	 		kArr.push(temp);
	 	}
	 })
	
	appMgm.getCodeValue('有效状态',function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			billArray.push(temp);			
		}
    }); 
	
	 baseMgm.getData("select uids,name from hr_salary_basic_info",function(list){
	 	for(var i=0;i<list.length;i++){
	 		var temp = new Array();
	 		temp.push("PARAM:"+list[i][0]);
	 		temp.push(list[i][1]);
	 		paramArr.push(temp);
	 	}
	 })
	
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
	baseMgm.getData(sql,function(list){
		for(var i=0;i<list.length;i++){
	 		var temp = new Array();
	 		temp.push(list[i][0]);
	 		temp.push(list[i][1]);
	 		deptArr.push(temp);
	 	}
	})
	DWREngine.setAsync(true);
	
	
	var fm =Ext.form;
	var fc={
		'uids':{name:'uids',fieldLabel:'系统编号',hidden:true,hideLabel:true},
		'code':{name:'code',fieldLabel:'帐套编码'},
		'name':{name:'name',fieldLabel:'帐套名称'},
		'items':{name:'items',fieldLabel:'工资科目'},
		'formula':{name:'formula',fieldLabel:'计算公式'},
		'remark':{name:'remark',fieldLabel:'备注'},
		'state':{name:'state',fieldLabel:'有效状态'},
		'deptid':{name:'deptid',fieldLabel:'使用部门'},
		'pid':{name:'pid',fieldLabel:'PID'}
	}
	
	var Columns = [
		{name:'uids',type:'string'}     ,  {name:'code',type:'string'},     {name:'name',type:'string'},
		{name:'remark',type:'string'}   ,  {name:'items',type:'string'},    {name:'state',type:'string'},
		{name:'formula',type:'string'},
		{name:'deptid',type:'string'}	,	{name:'pid',type:'string'}
	]
	
	var Plant =Ext.data.Record.create(Columns);
	
	var sm = new Ext.grid.CheckboxSelectionModel();
	
	PlantInt = {
		uids:'',code:'',name:'',remark:'',state:'',items:'',formula:'',
		deptid:'',pid:''
	}
	
	var cm =new Ext.grid.ColumnModel([
		sm,
		{id:'uids',        header:fc['uids'].fieldLabel,    	dataIndex:fc['uids'].name,   hidden:true},
		{id:'code',        header:fc['code'].fieldLabel,    	dataIndex:fc['code'].name,   editor:new Ext.form.TextField(fc['code']),width:40},
		{id:'name',        header:fc['name'].fieldLabel,    	dataIndex:fc['name'].name,   editor:new Ext.form.TextField(fc['name']),width:40},		
		{id:'state',       header:fc['state'].fieldLabel,		dataIndex:fc['state'].name,width:40,
			renderer:function(value){
				for(var k=0;k<billArray.length;k++){
					if(billArray[k][0]==value){
						return billArray[k][1];
					}
				}
			}
		},
		{id:'items',       header:fc['items'].fieldLabel,		dataIndex:fc['items'].name,
			renderer:function(value){
				var text_km = value.split(",");
				for(var n=0;n<text_km.length;n++){
					for(var y=0;y<kArr.length;y++){
						if(kArr[y][0]==text_km[n]){
							text_km[n]=kArr[y][1]						
						}
					}
				}
				var v=""
				for(var o=0;o<text_km.length;o++){
					v +=text_km[o]+",";
				}
				return v;
			}
		},
		{id:'formula',     header:fc['formula'].fieldLabel,		dataIndex:fc['formula'].name,
			renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				DWREngine.setAsync(false);
				var formula= "";
				FormulaUtil.getFormulaText(value,function(s){
					formula = s 
				})
				DWREngine.setAsync(true);
				return "<div id='"+record.get('uids')+"'>"+formula+"</div>"
			}
		},
		{id:'deptid',header:fc['deptid'].fieldLabel,dataIndex:fc['deptid'].name,
			renderer:function(value){
				var arr = value.split(",");
				var str = '';
				for(var i=0;i<deptArr.length;i++){
					for(var j=0;j<arr.length;j++){
						if(arr[j] == deptArr[i][0]){
							str +=deptArr[i][1]+',';
						}
					}
				}
				return str;
			}	
		},
		{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true},
		{id:'remark',      header:fc['remark'].fieldLabel,      dataIndex:fc['remark'].name,   hidden:true}
	])
	
	ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod,
			params: " pid = '"+CURRENTAPPID+"' "
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	
	var addBtn = new Ext.Button({
    	text:'新增',
    	iconCls : 'add',
    	handler:addHandler
    })
    
	var editBtn = new Ext.Button({
		id:'edit',
		text : '修改',
		iconCls : 'btn',
		handler : toHandlerUpdate
	})
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		region:'center',
		border : false,
		height: 300, 
		split:true,
		model: 'mini',
		addBtn:false,
		//delBtn:false,
		saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>工资帐套维护<B></font>',addBtn,'-',editBtn,'-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	 var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel]
    });	
     function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  
   	 function addHandler(){
		var url = BASE_PATH + "Business/rlzy/salary/rlzy.hr.salary.tz.addorupdate.jsp"
		window.location.href = url;
	}
	
	 
   var notesTip = new Ext.ToolTip({
		width: 300,
		target: gridPanel.getEl()
	});

   gridPanel.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if (columnIndex=="6"){
			notesTip.add({
				id: 'notes_id', 
				html: Ext.getDom(grid.getStore().getAt(rowIndex).get('uids')).innerText
			});
			point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	});
	
	function toHandlerUpdate(){
		var record = gridPanel.getSelectionModel().getSelected();
		if(record==null||record==""){
			Ext.MessageBox.alert("提示","请选择数据!");
		}
		else{
			flag=true;
			var uids = record.get('uids');
			var name = record.get('name');
			var code = record.get('code');
			var state = record.get('state');
			var remark =record.get('remark');
			var items = record.get('items');
			var deptid = record.get('deptid');
			var url = BASE_PATH + "Business/rlzy/salary/rlzy.hr.salary.tz.addorupdate.jsp?uids="+uids+
			"&name="+name+"&code="+code+"&remark="+remark+"&state="+state+"&flag="+flag+"&deptid="+deptid+"&items="+items
			window.location.href = url;
		}
}

})

