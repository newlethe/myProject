/*
 * 该页面功能目前只提供三级公司以及项目单位部署使用（2012-07-03）
 * 
 */
var bean = "com.sgepit.frame.flow.hbm.VFlowStatistics";;
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var ds, grid;
var businessType = "FlowStatistics";
var userArray = [];
var unitArray = [];
 var whereStr = "";

	if('3'==USERBELONGUNITTYPEID)
	{
		var getUnitSql = "select * from sgcc_ini_unit where unit_type_id='A' " +
				"connect by prior unitid=upunit start with upunit='"+USERBELONGUNITID+"'";
		DWREngine.setAsync(false);
		baseDao.getDataAutoCloseSes(getUnitSql, function(list){
			if(list.length>0)	
			{
				for(var i=0; i<list.length; i++)
				{
					var temp = [];
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					unitArray.push(temp);
				}
			}
		})
		DWREngine.setAsync(true);
	}



	//第一次登陆页面初始化后台视图(开始时间--一周前的日期<当前日期为基准>， 结束日期--当前日期， 超时小时--获取用户上次设定值)
	DWREngine.setAsync(false);
		flwStatisticsMgm.upDateViewFlwStatistics(new Date().add(Date.DAY, -7).format('Y-m-d'), 
												new Date().format('Y-m-d'), overHour);
	DWREngine.setAsync(true);
	
var unitDs = new Ext.data.SimpleStore({
					fields : ['k', 'v'],
					data : unitArray
			}); 
			
var beginDate = new Ext.form.DateField({
	id: 'bDate',
	name: 'bDate',
	format: 'Y-m-d',
	width: 100,
	readOnly: true,
	value: new Date().add(Date.DAY, -7) //当前日期之前7天的日期
});

var endDate = new Ext.form.DateField({
	id: 'eDate', 
	name: 'eDate',
	format: 'Y-m-d',
	readOnly: true,
	width: 100,
	value: new Date()   //当前日期
});

	//设定流程处理超时时限
var overHourField = new Ext.form.NumberField({
	allowBlank :false,
	baseChars:'0123456789',
	width:40,
	value: overHour //读取jsp页面从后台取得的超时时间值
});

var unitCombo = new Ext.form.ComboBox({
	name : 'unit-combo',
	readOnly : true,
	valueField : 'k',
	displayField : 'v',
	mode : 'local',       //必须指定数据是local还是remote(默认值)
	triggerAction : 'all',
	store : unitDs,
	lazyRender : true,
	allowBlank : true,
	listClass : 'x-combo-list-small',
	width : 200,
	listeners: {
		'select': function(combo){
			var unitid = combo.getValue();
			ds.baseParams.params = "unitid='"+unitid+"' and userstate not in('0','2') and unitid='"+CURRENTAPPID+"'";
			ds.load({params:{start:0, limit:PAGE_SIZE}});
		}
	}
});

var dsindexid = new Ext.data.SimpleStore({
			fields : [],
			data : [[]]
		});
var unitComboGouj = new Ext.form.ComboBox({
		id : 'parentequno',
		name : 'parentequno',
		fieldLabel : '系统单位树',
		readOnly : true,
		mode : 'local',
		editable : false,
		allowBlank : false,
		listWidth : 300,
		maxHeight : 400,
		width: 120,
		triggerAction : 'all',
		value : '请选择...',
		//		emptyText : '请选择...',
		store : dsindexid,
		tpl : "<tpl for='.'><div style='height: 100%'><div id='tree'></div></div></tpl>",
		listClass : 'x-combo-list-small',
		anchor : '95%'
		   })

unitComboGouj.on("beforequery", function() {
	tree.render('tree');
	tree.on('beforeload', function(node) {
		var id = node.id;
		if (id == null)
			id = '0';
		var baseParams = tree.loader.baseParams
		baseParams.parentId = id;
	});
	tree.on('load', function(node){
			 node.expand();
				node.eachChild(function(child) {
		           child.expand();  
	            });
    })
	tree.on('checkchange', function (node, checked) {
	        node.expand();
	        node.eachChild(function(child) {
		           child.expand();  
	         });
			node.checked = checked;
	        node.cascade( function( node ){   
	           node.attributes.checked = checked;   
	           node.ui.checkbox.checked = checked; 
	           return true;   
	         }); 
	}, tree);
});
		
Ext.onReady(function(){
	
	//查询按钮
	var queryBtn = new Ext.Button({
		text: '查询',
		iconCls: 'form',
		handler: queryHandler
	});
	
	//导出为excel文档按钮
	var exportExcelBtn = new Ext.Button({
			id : 'export',
			text : '导出数据',
			tooltip : '导出流程统计信息',
			cls : 'x-btn-text-icon',
			icon : 'jsp/res/images/icons/page_excel.png',
			handler : function() {
				exportDataFile();
			}
	});
	var chooseUnitCombo= unitCombo;
	//国锦需求，单位选择为下来框树选择，此处做判断是否为国锦
	if(CURRENTAPPID == "1030603"){
	    chooseUnitCombo = unitComboGouj;
	}
	
	//项目单位的底部工具栏
	var projectBbar = ['-','<font color=#15428b>开始时间：</font>', beginDate, 
					   '&nbsp;&nbsp<font color=#15428b>结束时间：</font>', endDate,
					   '-','<font color=#FF2525>超时处理时限:</font>', 
					   overHourField, 
					   '<font color=#FF2525>小时</font>','-',
					   "<font color=#FF2525>"+"统计时间:"+curDate,
		               '-', queryBtn,'-', exportExcelBtn];
	//三级公司的底部工具栏
	var unit3Bbar = ['-','<font color=#15428b>开始时间：</font>', beginDate, 
					   '&nbsp;&nbsp<font color=#15428b>结束时间：</font>', endDate,
					   '-','选择项目单位:&nbsp;&nbsp',chooseUnitCombo,'<p>',
					   '-','<font color=#FF2525>超时处理时限:</font>', 
					   overHourField, 
					   '<font color=#FF2525>小时</font>',
					   '-','统计时间：'+curDate,
		               '-', queryBtn,'-', exportExcelBtn];
	var bbarBtn = "";
    //国锦与其他项目单位“选择项目单位”不同，此处判断选择
	if(CURRENTAPPID == "1030603"){
	    bbarBtn = unit3Bbar
	}else{
	   bbarBtn = USERBELONGUNITTYPEID=='A'?projectBbar:unit3Bbar
	}	
	
	var northPanel = new Ext.Panel({
		border: false,
		region: 'north',
		split: true,
		height: 80,
		bodyStyle: 'display: none;',
		collapseMode: 'mini',
		collapsible: true,
		layout: 'fit',
		animCollapse: true,
		collapsed: false,
		bbar: bbarBtn
	});
	
	var sm = new Ext.grid.CheckboxSelectionModel({header: '',singleSelect : true})
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			width: 20
		}),sm, {
			id: 'userid',
			header: '用户编号',
			dataIndex: 'userid',
			hidden: true
		},{
		    id: 'vieworder',
		    header: '显示顺序',
		    dataIndex: 'vieworder',
		    hidden: true
		}, {
		    id: 'posid',
		    header: '部门、岗位编号',
		    dataIndex: 'posid',
		    hidden: true
		}, {
			id: 'posname',
			header: '部门、岗位名称',
			dataIndex: 'posname',
			width: 120
        }, {
			id: 'username',
			header: '姓名',
			dataIndex: 'username',
			summaryType:'custom',
			calculateFn: caculateHandler,
			summaryRenderer: function(v) {return "合计:";}
		},{
			id: 'unitid',
			header: '单位编号',
			dataIndex: 'unitid',
			hidden: true
		},{
			id: 'unit2id',
			header: '二级公司编号',
			dataIndex: 'unit2id',
			hidden: true
		},{
			id: 'unit3id',
			header: '三级公司编号',
			dataIndex: 'unit3id',
			width: 120,
			hidden: true
		},{
			id: 'csum',
			header: '起草流程数',
			dataIndex: 'csum',
			align: 'center',
			width: 80,
			renderer: rendererFun,
			summaryType:'custom',
			calculateFn: caculateHandler,
			summaryRenderer: SumRenderFun
		},{
			id: 'psum',
			header: '<font color=blue>处理流程数</font>',
			dataIndex: 'psum',
			align: 'center',
			width: 80,
			renderer: rendererFun,
			summaryType:'custom',
			calculateFn: caculateHandler,
			summaryRenderer: SumRenderFun
		},{
			id: 'oversum',
			header: '<font color=red>超时处理流程数</font>',
			dataIndex: 'oversum',
			align: 'center',
			width: 80,
			renderer: rendererFun,
			summaryType:'custom',
			calculateFn: caculateHandler,
			summaryRenderer: SumRenderFun
		},{
			id: 'usum',
			header: '<font color= blue>待处理流程数</font>',
			dataIndex: 'usum',
			align: 'center',
			width: 80,
			renderer: usumRenderFun,
			summaryType:'custom',
			calculateFn: caculateHandler,
			summaryRenderer: SumRenderFun
		}, {
			id: 'overusum',
			header: '<font color=red>待处理超时流程数</font>',
			dataIndex: 'overusum',
			align: 'center',
		    renderer: overusumFun,
		    summaryType:'custom',
			calculateFn: caculateHandler,
			summaryRenderer: SumRenderFun,
		    width: 80
		}
	]);
//	cm.defaultSortable = true;
	
	var Columns = [
		{name: 'userid', type: 'string'},
		{name: 'vieworder', type: 'string'},
		{name: 'posid', type: 'string'},
		{name: 'posname', type: 'string'},
		{name: 'username', type: 'string'},
		{name: 'unitid', type: 'string'},
		{name: 'unit2id', type: 'string'},
		{name: 'unit3id', type: 'string'},
		{name: 'csum', type: 'string'},
		{name: 'psum', type: 'string'},
		{name: 'oversum', type: 'string'},
		{name: 'usum', type: 'string'},
		{name: 'overusum', type: 'string'}
	];
	
	ds = new Ext.data.Store({
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
			id: 'userid'
		}, Columns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	
//	ds.load({params:{start:0,limit:PAGE_SIZE}});
	
	//加载完成默认选中第一行
	ds.baseParams.params = "userstate not in('0','2') and unitid='"+CURRENTAPPID+"'";
	ds.on('load', function(){
		grid.getSelectionModel().selectFirstRow();
	})
	ds.setDefaultSort("vieworder", 'asc');
	ds.load({params:{start:0, limit:PAGE_SIZE}});
	var summary = new Ext.ux.grid.GridSummary();
	
	grid = new Ext.grid.EditorGridPanel({
		store: ds,
		cm: cm,
		sm: sm,
		border: false, 
		region: 'center',
		header: false, 
		stripeRows: true,
		autoScroll: true,
		loadMask: true,
		collapsible: true,
    	animCollapse: true,
    	plugins: [summary],
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [northPanel,grid]
	});
	
});  //eof Ext.onReady

function rendererFun(value, cellmeta, record, rowIndex, columnIndex, store){
	var type = grid.getColumnModel().getDataIndex(columnIndex);
	var userid = record.get('userid');
	if(0==value||'0'==value){
		return value
	}
	else{
		return "<a href='javascript:getFlwInsInfo(\"" + type + "\",\"" + userid + "\")'>"+
																	"<font color='blue'/>"+value+"</a>";
	}
}

function overusumFun(value, cellmeta, record, rowIndex, columnIndex, store){
	var count = record.get('overusum'); // 未处理并已超时流程数
	var userid = record.get('userid');
	//已超时待办事项
	if(0==count||'0'==count){
	     return 0;
	}else{
	    return	 "<font color='red'>" +" <a href='javascript:getFlwInsInfo(\"" + 'overusum' + "\",\"" + userid + "\")'>"+
			     "<font color='red'/>【"+count+"】</a>"+"</font>";
	}
}
function usumRenderFun(value, cellmeta, record, rowIndex, columnIndex, store)
{
	//该列是待办事项和已超时待办事项的合并， 请注意type的取值有两种
	var type = grid.getColumnModel().getDataIndex(columnIndex);
	var userid = record.get('userid');
	var usumCount = value;  //未处理流程数
//	var count = record.get('overusum'); // 未处理并已超时流程数
	if(0==usumCount||'0'==usumCount){
		return  0
	}else {
			return "<a href='javascript:getFlwInsInfo(\"" + type + "\",\"" + userid + "\")'>"+
																	"<font color='blue'/>【"+value+"】</a> "
	}
}

//获取对应流程实例信息方法(type区分用户起草流程，用户处理流程，用户超时处理流程，用户待办事项)
function getFlwInsInfo(type, userid){
	var bDate = beginDate.getValue().format('Y-m-d');
	var eDate = endDate.getValue().format('Y-m-d');
	var hour = overHourField.getValue();
	var tjDate = new Date().format('Y-m-d H:m:s');
	
	var rec = grid.getSelectionModel().getSelected();
	var uname = rec.get('username');
	
	var uidsArray = [];	
	//确定跳转页面标题
	if('csum' == type)
	{
		var statisticsType = "起草流程信息";
	}
	else if('psum' == type)
	{
		var statisticsType = "已处理流程信息";
	}
	else if('oversum' == type)
	{
		var statisticsType = "超时处理流程信息";
	}
	else if('usum' == type)
	{
		var statisticsType = "待办事项信息";
	}
	else if('overusum' == type)
	{
		var statisticsType = "已超时待办事项信息";
	}
	else
	{
		var statisticsType = "";
	}
	DWREngine.setAsync(false);
		flwStatisticsMgm.getFlowLogids(bDate, eDate, userid, type, function(list){
			if(list.length>0)
			{	
				for(var i=0; i<list.length; i++)
				{
					uidsArray.push(list[i]);
				}
			}
		});
	DWREngine.setAsync(true);
	
	var URL = "jsp/flow/flw.statistics.instances.info.jsp?uidsArray="+uidsArray;
    dailogWin = new Ext.Window({
			id: 'statisticsInfoWin',
			title: '流程使用情况统计查询',
			modal: true,
			resizable: true,
			floating : true,
			width: 1000,
			height: 360,
			header: true,
			autoScroll : true,
			tbar:[
					"<font color='red'>姓名："+uname+"&nbsp;&nbsp"+
					'统计类型：'+statisticsType+"&nbsp;&nbsp"+
					'时间区间：'+bDate+"至"+eDate+"&nbsp;&nbsp"+
					'统计时间：'+tjDate+"</font>"
			],
			resizable: false,
			html: '<iframe name="fileFrm" src="'+URL+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
		});
		
	dailogWin.show()
//	var URL = "jsp/flow/flw.statistics.instances.info.jsp";
//	window.showModalDialog(BASE_PATH + URL, argObject, 
//			"dialogWidth:1000px;dialogHeight:600px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
}

function queryHandler(){
	var sDate = beginDate.getValue().format('Y-m-d');  //开始时间
	var eDate = endDate.getValue().format('Y-m-d');     //结束时间
	var hour = overHourField.getValue();        //超时时限
	
	DWREngine.setAsync(false);
		flwStatisticsMgm.upDateViewFlwStatistics(sDate, eDate, hour);
	DWREngine.setAsync(true);
	
	ds.load();
}

//选择单位树
function chooseFun(){
	         var value="";
	         var nodes = tree.getChecked();
	         if(nodes == null || nodes == "") return;
             for(var i = 0;i<nodes.length;i++){
					var node = nodes[i];
					if(i == nodes.length-1){
						value += node.text;
						whereStr +="'"+node.id+"'";
					}else{
						if(node.leaf=='1' || node.id == '01' ){
	                       value += node.text+"、";
	                       whereStr +="'"+node.id+"',";
						}
					}
					
             }
             unitComboGouj.collapse();
             unitComboGouj.setValue(value);
             ds.baseParams.params = "posid in("+whereStr+") and userstate not in('0','2') and unitid='"+CURRENTAPPID+"'";
             ds.load();
             root.reload();
	    }

//导出为excel文档方法
function exportDataFile() {
	if(CURRENTAPPID == "1030603"){ //国锦要求选择项目单位导出
         if(whereStr != ""){
            var openUrl = CONTEXT_PATH + "/servlet/FlowStatisticsServlet?ac=exportData&businessType=" + businessType+"&whereStr="+whereStr+"&pid="+CURRENTAPPID;
         }else{
         	var openUrl = CONTEXT_PATH + "/servlet/FlowStatisticsServlet?ac=exportData&businessType=" + 
				          businessType +"&unitid="+USERBELONGUNITID+"&pid="+CURRENTAPPID;
         }
	}
	else  if('A'==USERBELONGUNITTYPEID)   //项目单位用户使用导出功能
	{
		var openUrl = CONTEXT_PATH + "/servlet/FlowStatisticsServlet?ac=exportData&businessType=" + 
					  businessType +"&unitid="+USERBELONGUNITID+"&pid="+CURRENTAPPID;
	}
	else if('3'==USERBELONGUNITTYPEID)           //三级公司使用导出功能
	{
		var unitid = unitCombo.getValue();
		var openUrl = CONTEXT_PATH + "/servlet/FlowStatisticsServlet?ac=exportData&businessType=" + 
					  businessType +"&unitid="+unitid+"&pid="+CURRENTAPPID;
	}
	else        //默认导出所有数据
	{   
		   var openUrl = CONTEXT_PATH + "/servlet/FlowStatisticsServlet?ac=exportData&businessType=" + businessType+"&pid="+CURRENTAPPID;
	}
	
	document.all.formAc.action = openUrl;       
	document.all.formAc.submit();			  
}

function caculateHandler(name, r, rs){
	var v=0;
	for(var i=0;i<rs.length;i++){
		var count = rs[i].get(name);
		v += parseInt(count);
	}
	return (v.toString().fontsize(2))
}

function SumRenderFun(v){
	if(v==undefined||v==null)
		return '0'.fontsize(2);
	else
		return v.toString().fontsize(2);
}

