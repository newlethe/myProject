var servletName = "servlet/RlzyServlet";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var primaryKey = "uids";
var orderColumn = "uids";
var startSj;
var endSj;
var unitIds;
var userIds;
var userDetailItemsids;
var itemIds;
var	typeIds;

var unitCombo;
var userCombo;
var userDetailCombo;
var salaryItemCombo;
var salaryTypeCombo;

var xgridUrl = "Business/rlzy/salary/rlzy.salary.statistic.query.xgrid.jsp";
var i=0;
Ext.onReady(function() {
	var curUserId=USERID;//当前用户ID
	var curUserRealName=REALNAME;//当前用户中文名
	var curUserPosId=USERDEPTID;//当前部门编号
	var curUserPosName=USERPOSNAME;//当前部门名称  
	var paramSm = new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	// 开始时间数据源
	var beginSjTypeStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['val', 'txt']
    });
	// 开始时间下拉框
	var beginSjCombo = new Ext.form.ComboBox({
		// title : '开始日期',
		triggerAction : 'all',
		mode : 'local',
		store : beginSjTypeStore,
		valueField : 'val',
		displayField : 'txt',
		editable : false,
		width : 110
	});
	beginSjCombo.on('select', function(combo, record, index) {
		var sql = "select distinct sj_type as value, substr(sj_type, 0, 4)||'年'||substr(sj_type, 5, 2)||'月'||substr(sj_type, 7, 2)||'次' as text " +
				"from hr_salary_master t where sj_type >= '"+record.data.val+"' and salary_type = 'BONUS'  and pid='"+CURRENTAPPID+"' order by sj_type asc";
		db2Json.selectSimpleData(sql,function(dat){
			endSjTypeStore.loadData(eval(dat))
		});
	});
	var beginSql = "select distinct sj_type as value, substr(sj_type, 0, 4)||'年'||substr(sj_type, 5, 2)||'月'||substr(sj_type, 7, 2)||'次' as text " +
				"from hr_salary_master t where salary_type = 'BONUS'  and pid='"+CURRENTAPPID+"' order by sj_type asc";
	db2Json.selectSimpleData(beginSql,function(dat){
		beginSjTypeStore.loadData(eval(dat))
	});
	
	
	// 结束日期数据源
	var endSjTypeStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['val', 'txt']
    });
	// 结束时间下拉框
	var endSjCombo = new Ext.form.ComboBox({
		// title : '结束日期',
		triggerAction : 'all',
		mode : 'local',
		store : endSjTypeStore,
		valueField : 'val',
		displayField : 'txt',
		editable : false,
		width : 110
	});
	var endSql = "select distinct sj_type as value, substr(sj_type, 0, 4)||'年'||substr(sj_type, 5, 2)||'月'||substr(sj_type, 7, 2)||'次' as text from hr_salary_master t where t.salary_type = 'BONUS'  and pid='"+CURRENTAPPID+"' order by sj_type asc";
	db2Json.selectSimpleData(endSql,function(dat){
		endSjTypeStore.loadData(eval(dat))
	});
	
	var selReader = new Ext.data.ArrayReader({
	id : 'key'
	}, ['val', 'txt']);
	
	//部门选择数据源
	var unitListStore = new Ext.data.Store({
		url : servletName,
		baseParams : {
			ac : 'unitListBox',
			userBelongUnitid:USERBELONGUNITID
		},
		reader : selReader,
				autoLoad : true
	});
	// 部门选择下拉框
	unitCombo = new Ext.form.MultiSelect({
		triggerAction : 'all',
		mode : 'local',
		emptyText : '不选表示所有部门',
		store : unitListStore,
		valueField : 'val',
		displayField : 'txt',
		editable : false,
		width : 120
	});
	unitCombo.on('select', function() {
		reloadUsers();
	});
	// 部门全选
	var unitAllCheck = new Ext.form.Checkbox({
		id : 'unit-all-check',
		boxLabel : '全选'
	});
	unitAllCheck.on('check', function(c, checked) {
		if (checked) {
			unitCombo.selectAll();
		} else {
			unitCombo.deselectAll();
		}
		reloadUsers();
	});
	function reloadUsers() {
		userCombo.clearValue();
		var unitStr = unitCombo.getCheckedValue('val');
		if ( unitStr != '' ){
			loadUserList(unitStr.split(',') );
		}
	}
	function loadUserList(unitIds){
		userListStore.load({
			params : {
				unitIds : unitIds
			}
		});
	}
	//用户选择数据源
	var userListStore = new Ext.data.Store({
		url : servletName,
		baseParams : {
			ac : 'userListBox',
			userBelongUnitid:USERBELONGUNITID
			
		},
		reader : selReader,
				autoLoad : true
	});
	// 用户选择下拉框
	userCombo = new Ext.form.MultiSelect({
		triggerAction : 'all',
		id : 'user-combo',
		mode : 'local',
		store : userListStore,
		emptyText : '不选表示所有人员',
		valueField : 'val',
		displayField : 'txt',
		width : 110,
		editable : false
	});
	// 人员全选
	var userAllCheck = new Ext.form.Checkbox({
		id : 'user-all-check',
		boxLabel : '全选'
	});
	userAllCheck.on('check', function(c, checked) {
		if (checked) {
			userCombo.selectAll();
		} else {
			userCombo.deselectAll();
		}
	});
	
	//======用户详情======
	
	// 用户详情下拉框
	userDetailCombo =  new Ext.Button({
		id:'param',
		iconCls:'btn',
		text:'员工信息',
		handler:setParamFun 
	});
	var paramBean = "com.sgepit.pmis.rlzj.hbm.HrSalaryBasicInfo";
	var paramPrimaryKey = "uids";
	var paramOrderColumn = "orderNum";
	var paramColumns = [
		{name:'uids',type:'string'},
		{name:'code',type:'string'},
		{name:'name',type:'string'},
		{name:'configInfo',type:'string'},
		{name:'orderNum',type:'string'}
	]

	var paramCm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer(),
		paramSm,
		{id:'uids',header:'主键',dataIndex:'uids',hidden:true},
		{id:'code',header:'编号',dataIndex:'code',width:80},
		{id:'name',header:'名称',dataIndex:'name',width:160},
		{id:'configInfo',header:'来源',dataIndex:'configInfo',hidden:true},
		{id:'orderNum',header:'排序',dataIndex:'orderNum',hidden:true}
	]) 
	//用户详情数据源
	var userDetailListStore = new Ext.data.Store({
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
	
	userDetailListStore.setDefaultSort(paramOrderColumn, 'asc');
	
    var paramCompleteBtn = new Ext.Button({
		id:'paramCompleteBtn',
		iconCls:'save',
		text:'信息选择完成',
		handler:compParamFun
	})
	var paramCancelBtn = new Ext.Button({
		id:'paramCancelBtn',
		iconCls:'remove',
		text:'取消选择',      
		handler:cancelParamFun
	})
	
	var paramPanel = new Ext.grid.GridPanel({
		ds:userDetailListStore,
		sm:paramSm,
		cm:paramCm,
		tbar: ['->',paramCompleteBtn,paramCancelBtn],
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
	});
	userDetailListStore.load();
	paramSm.handleMouseDown = Ext.emptyFn;
	var paramWin = new Ext.Window({
		title:'员工信息列表',
		width: 480,
		height: 400,
		modal: true,
		plain: true, 
		border: false, 
		resizable: false,
		closeAction: 'hide',
		closable:true,
		layout: 'fit',
		items:[paramPanel]
	});
	
	function setParamFun(){
		paramWin.show();
	}
	function compParamFun(){
		paramWin.hide();      
	}
	function cancelParamFun(){	
		paramSm.deselectRange(0,userDetailListStore.getCount());
	}
	paramWin.on('hide',function(){
	   	paramWin.hide(); 
	})	  
//=========详情结束=====	
	
	//======奖金科目======
	var itemListStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['val', 'txt']
    });
	salaryItemCombo = new Ext.form.MultiSelect({
		triggerAction : 'all',
		id : 'item-combo',
		mode : 'local',
		store : itemListStore,
		emptyText : '不选表示所有科目',
		valueField : 'val',
		displayField : 'txt',
		width : 100,
		editable : false
	});
	db2Json.selectSimpleData("select zb_seqno,realname from sgcc_guideline_info where parentid='005' and state='1' order by zb_seqno",
		function(dat){
			itemListStore.loadData(eval(dat))
	}); 
	
	//======奖金类别======
	var typeListStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['val', 'txt']
    });
	salaryTypeCombo = new Ext.form.MultiSelect({
		triggerAction : 'all',
		id : 'type-combo',
		mode : 'local',
		store : typeListStore,
		emptyText : '不选表示所有类别',
		valueField : 'val',
		displayField : 'txt',
		width : 100,
		editable : false
	});
	db2Json.selectSimpleData("select uids,name from hr_salary_type where state='1'",
		function(dat){
			typeListStore.loadData(eval(dat))
	}); 
	
	// 查询按钮Ext.getCmp('exec-btn'). handler(); 
	var execBtn = new Ext.Toolbar.Button({
		id : 'exec-btn',
		text : '查询',
		handler : function(){execQuery()},
		iconCls : 'form'
	});
   
	// 导出按钮
	var exportBtn = new Ext.Toolbar.Button({
		id : 'export-btn',
		text : '导出Excel',
		tooltip : '导出数据到Excel',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			document.getElementById('gzxgrid').contentWindow.exportExcel();
		}
	});

	gridPanel = new Ext.Panel({
		id:"gridId",
		title : '奖金查询',
		tbar : ['开始时间', beginSjCombo, '结束时间', endSjCombo,
				//'-', '部门', unitCombo, unitAllCheck, '员工', userCombo, userAllCheck,
				'部门', unitCombo,  '员工', userCombo,
				//'科目',salaryItemCombo,'类别',salaryTypeCombo,'-',userDetailCombo,
				'-',userDetailCombo,
				'->', execBtn,exportBtn], 
		border : false,
		region : 'center',
		loadMask : true,
		html : '<iframe id="gzxgrid" src="'+xgridUrl+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});

	// 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel]
	});
//		salaryTypeCombo.setDisabled(true);
//		salaryTypeCombo.setValue("BOUNS");
//	    salaryTypeCombo.setRawValue("奖金");
	
//给是个人查询的部门下拉框和用户下拉框赋值
  	if(flagRole!=""&&flagRole=='self'){
  		Ext.getCmp("gridId").setTitle("个人奖金查询");//panel的标题
	    unitCombo.setDisabled(true);
	    userCombo.setDisabled(true);
	    unitCombo.setValue(curUserPosId);
	    unitCombo.setRawValue(curUserPosName);
	    userCombo.setValue(curUserId);
	    userCombo.setRawValue(curUserRealName);	 
  	}else{
		Ext.getCmp("gridId").setTitle("奖金统计查询");
  	}
  	
	   //给开始时间设置默认值
		var curDate= new Date() 
		var year=curDate.getFullYear();//本年
		var month=curDate.getMonth()+1 ; //  getMonth()  从 Date 对象返回月份 (0 ~ 11)
		var startCount="01";
		if(month<10)
   		month="0"+month;
		var  startSjVal=year+""+month+""+startCount;
 		var  startSjLabel=year+"年"+month+"月"+startCount+"次";
 		var endSjVal,endSjLabel;
  		startSj=startSjVal;
  		beginSjCombo.setValue(startSjVal);
  		beginSjCombo.setRawValue(startSjLabel);
  		DWREngine.setAsync(false); //设置为同步    
  		//查询出结束时间并设置到结束时间下拉框中
  		var initEndSql1 = "select max(sj_type) as value,substr(max(sj_type), 0, 4)||'年'||substr(max(sj_type), 5, 2)||'月'||substr(max(sj_type), 7, 2)||'次' as text from hr_salary_master t where salary_type = 'BONUS'  and pid='"+CURRENTAPPID+"' order by sj_type asc";
		db2Json.selectSimpleData(initEndSql1,function(dat){		
			var responseData=Ext.util.JSON.decode(dat);
			endSjVal= eval("("+dat+")"); 
			endSj=endSjVal[0][0]; 
			var endLabel=endSjVal[0][1]; 
		    endSjCombo.setValue(endSj);
			endSjCombo.setRawValue(endLabel);	
		});  
		DWREngine.setAsync(true);	
	        
	function execQuery() {
		startSj = beginSjCombo.getValue();   
		endSj = endSjCombo.getValue(); 
		if (startSj == '') {
			Ext.Msg.alert('时间选择', '请选择开始时间！');
			return;
		}
		if (endSj == '') {
			Ext.Msg.alert('时间选择', '请选择结束时间！');
			return;
		}
		if(startSj > endSj){
			Ext.Msg.alert('时间选择', '开始时间必须早于结束时间！');
			return;
		}

		unitIds =null;   
		userIds = null;
		//区分是个人查询还是奖金统计查询
	  	if(flagRole!=""&&flagRole=='self'){//个人奖金查询时
	  		unitIds=new Array();
	  		userIds=new Array();
	  		unitIds.push(curUserPosId); 
	  		userIds.push(curUserId);   
	  	}else{//奖金统计查询时
			var unitStr = unitCombo.getCheckedValue('val');
			if (unitStr != '') {
				unitIds = unitStr.split(',');
			}
			else if(unitStr==''||unitStr==""){
				var deptStr ="";
 				DWREngine.setAsync(false);
 				baseMgm.getData("select t.unitid,t.unitname from sgcc_ini_unit t where t.unit_type_id = '8' start with upunit='"+USERBELONGUNITID+"'  connect by prior unitid = upunit",function(list){
 				if(list!=null){
 					for(i = 0; i < list.length; i++) {	
					deptStr+="'"+list[i][0];
					}	
 				}
   				 });
 				DWREngine.setAsync(true);
				if(deptStr!=""){
					unitIds=deptStr.split("'");
	 				 }	
		
				}
			var userStr = userCombo.getCheckedValue('val');
			if (userStr != '') {
				userIds = userStr.split(',');		
		  	}
		  	else if(userStr==''||userStr==""){
				if(unitIds!=null){
				}
				else{
					var users="";
 					DWREngine.setAsync(false);
 					baseMgm.getData("select userid,realname from rock_user where dept_id in (select t.unitid from sgcc_ini_unit t where t.unit_type_id = '8' start with upunit='"+USERBELONGUNITID+"'  connect by prior unitid = upunit)",function(list){
 					if(list!=null){
 						for(i = 0; i < list.length; i++) {	
						users+="'"+list[i][0];
						}	
 					}
   					 });
 					DWREngine.setAsync(true);
					if(users!=""){
						userIds=users.split("'");
	 				 }	
				}	
			}  	
		}     
		//用户详情获取数据
		userDetailItemsids = new Array(); 
		var records = paramSm.getSelections();
		if (records!=""&&records!=null&& records.length!=0){
			for (var i = 0; i < records.length; i++) {
				userDetailItemsids.push(records[i].get('configInfo'));
		   	} 
		}else{
			userDetailItemsids=null;
		}   
		//用户详情获取数据结束  
		  
		itemIds = new Array();
		typeIds = new Array();
		var itemStr = salaryItemCombo.getCheckedValue('val');
		var itemNameStr = salaryItemCombo.getCheckedDisplay('txt');
		if (itemStr != '') {
			var temp = "";
			for (var i = 0; i < itemStr.split(',').length; i++) {
				temp += itemStr.split(',')[i]+"-"+itemNameStr.split(',')[i]+",";
			}
			temp = temp.substring(0,temp.length-1);
			itemIds = temp.split(',');
		}

//		var typeStr = salaryTypeCombo.getCheckedValue('val');
//		var typeNameStr = salaryTypeCombo.getCheckedDisplay('txt');
//		if (typeStr != '') {
//			var temp = ""
//			for (var i = 0; i < typeStr.split(',').length; i++) {
//				temp += typeStr.split(',')[i]+"-"+typeNameStr.split(',')[i]+",";
//			}
//			temp = temp.substring(0,temp.length-1);
//			typeIds = temp.split(',');
//		}
		var str = "";
		DWREngine.setAsync(false);
		baseMgm.getData("select uids||'-'||name from hr_salary_type where state='1' and code='BONUS'",function(dat){
			str = dat.toString();
		}); 
		DWREngine.setAsync(true);
		typeIds.push(str)
		
		//调用iframe子页面中的doReload方法; 
		try{
			var obj=document.getElementById("gzxgrid").contentWindow;  
            obj.doReload();               
		}catch(e){   
			Ext.Msg.alert("提示","请点击查询按钮");     
		}     
		finally{    	 
		}
	}
	
	viewport.on("render", function(vp){
		execQuery()
	})
})  

//时间设置完成        
function downloadFile(fileLsh) {
	if (fileLsh != "") {
		var openUrl = CONTEXT_PATH + "/servlet/MainServlet?ac=downloadFile&fileid="+fileLsh;
		document.all.formAc.action = openUrl
		document.all.formAc.submit()
	} else {
		Ext.Msg.alert("提示", "该文件不存在!");
	}
}