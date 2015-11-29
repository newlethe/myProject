var servletName = "servlet/RlzyServlet";
var startSj;
var endSj;
var unitIds;
var userIds;
var unitCombo;
var userCombo;

Ext.onReady(function() {

	// 选项对象(通用)
	var SelectItem = Ext.data.Record.create([{
				name : 'key'
			}, {
				name : 'value'
			}]);
	// 下拉列表reader(通用)
	var selReader = new Ext.data.ArrayReader({
				id : 'key'
			}, ['key', 'value']);
			
	// 开始时间数据源
	var beginSjTypeStore = new Ext.data.Store({
				url : servletName,
				baseParams : {
					ac : 'getSjTypeTillNow'
				},

				reader : selReader,
				autoLoad : true

			});
	
	//结束日期数据源
	var endSjTypeStore = new Ext.data.Store({
		url : servletName,
		baseParams : {
			ac : 'getSjTypeTillNow'
		},
		reader : selReader,
				autoLoad : true
	});
	
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
	
			
	// 开始时间下拉框
	var beginSjCombo = new Ext.form.ComboBox({
			//	title : '开始日期',
				triggerAction : 'all',
				mode : 'local',
				store : beginSjTypeStore,
				valueField : 'key',
				displayField : 'value',
				editable : false,
				width : 110
			});
	beginSjCombo.on('select', function(combo, record, index){
		endSjTypeStore.load({
			params:{
				startDate : record.data.key
			}
		});
		
	});
	
	//结束时间下拉框
	var endSjCombo = new Ext.form.ComboBox({
			//	title : '结束日期',
				triggerAction : 'all',
				mode : 'local',
				store : endSjTypeStore,
				valueField : 'key',
				displayField : 'value',
				editable : false,
				width : 110
			});
	var xgridUrl = "Business/rlzy/kqgl/rlzy.kq.statistic.xgrid.jsp";
	
	//部门选择下拉框
	unitCombo = new Ext.form.MultiSelect({
		triggerAction : 'all',
				mode : 'local',
				emptyText : '请选择部门,不选表示所有部门',
				store : unitListStore,
				valueField : 'key',
				displayField : 'value',
				editable : false,
				width : 190
	});
	
	unitCombo.on('select', function(){
		reloadUsers();
	});
	
	
	
	//部门全选
	var unitAllCheck = new Ext.form.Checkbox({
		id : 'unit-all-check',
		boxLabel : '全选'
	});
	
	unitAllCheck.on('check', function(c, checked){
		if ( checked ){
			unitCombo.selectAll();
		}
		else{
			unitCombo.deselectAll();
		}
		reloadUsers();
	});
	
	
	//用户选择下拉框
	userCombo = new Ext.form.MultiSelect({
		triggerAction : 'all',
		id : 'user-combo',
				mode : 'local',
				store : userListStore,
				emptyText : '请选择人员,不选表示所有人员',
				valueField : 'key',
				displayField : 'value',
				width : 210,
				editable : false
	});
	
	//人员全选
	var userAllCheck = new Ext.form.Checkbox({
		id : 'user-all-check',
		boxLabel : '全选'
	});
	
	userAllCheck.on('check', function(c, checked){
		if ( checked ){
			userCombo.selectAll();
		}
		else{
			userCombo.deselectAll();
		}
	});
	
	//查询按钮
	var execBtn = new Ext.Toolbar.Button({
		id : 'exec-btn',
		text : '查询',
		handler : execQuery,
		iconCls : 'form'
	});
	
		//导出按钮
	var exportBtn = new Ext.Toolbar.Button({
		id : 'export-btn',
		text : '导出Excel',
		tooltip: '导出数据到Excel',
		cls: 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function(){
			document.getElementById('kqxgrid').contentWindow.exportExcel(); 
		}
	});
	
	
	gridPanel = new Ext.Panel({
				title : '考勤统计查询',
				tbar : ['开始时间',beginSjCombo, '&nbsp;&nbsp;结束时间',endSjCombo, '-', '&nbsp;部门',unitCombo,unitAllCheck, '-','&nbsp;员工',userCombo, userAllCheck, '-', execBtn, '->', exportBtn],
				border : false,
				region : 'center',
				autoScroll : true,
				collapsible : false,
				animCollapse : false,
				loadMask : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				html: '<iframe name="kqxgrid" src="' + xgridUrl + '" frameborder=0 style="width:100%;height:100%;"></iframe>'
			});
			

	// 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [gridPanel]
			});
			
	function reloadUsers(){
	var unitStr = unitCombo.getCheckedValue('key');
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
	
	function execQuery(){
	startSj = beginSjCombo.getValue();
	endSj = endSjCombo.getValue();
	if ( startSj == '' ){
		Ext.Msg.alert('时间选择', '请选择开始时间！');
		return;
	}
	
	if ( endSj == '' ){
		Ext.Msg.alert('时间选择', '请选择结束时间！');
		return;
	}
	
	unitIds = null;
	userIds = null;
	var unitStr = unitCombo.getCheckedValue('key');
	if ( unitStr != '' ){
		unitIds = unitStr.split(',') ;
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
	var userStr = userCombo.getCheckedValue('key');
	if ( userStr != '' ){
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
	document.getElementById('kqxgrid').contentWindow.doReload(); 
	
}


});

function downloadFile(fileLsh) {
	if (fileLsh != "") {
		var openUrl = CONTEXT_PATH + "/servlet/MainServlet?ac=downloadFile&fileid="+fileLsh;
		document.all.formAc.action = openUrl
		document.all.formAc.submit()
	} else {
		Ext.Msg.alert("提示", "该文件不存在!");
	}
}

