<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<%@ page language="java" pageEncoding="utf-8" %>
<html>
  <head>
    
    <title>日志管理</title>
    
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/jsp/common/golobalJs.jsp" %>
	<base href="<%=basePath%>">
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_DHX")%>/codebase/dhtmlx.css" />
	<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_DHX")%>/codebase/dhtmlx_custom.css" />
	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_DHX")%>/codebase/dhtmlx.js"></script>
	<!-- DWR -->
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script src="dwr/interface/db2Json.js"></script>
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	
	<!-- PAGE -->
	<script type="text/javascript" src="dhtmlx/js/componentsUtil.js"></script>
	<script type="text/javascript" src="dhtmlx/js/dhxTreeGridUtil.js"></script>
	<script type="text/javascript" src="dhtmlx/js/json2.js"></script>
	<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
	<script type="text/javascript">
var baseUrl = CONTEXT_PATH + "/servlet/RzglServlet";
var userid = '${userid}';
var userdeptid = '${userdeptid}';
var username = '${username}';
var roletype ='${roletype}';
var rzgl_rz_fj = '${rzgl_rz_fj}';
var FlTree,RzGrid,RzGridDp,RzGridToolBar;
var FlTree_root_id = '',tree_selectId = '';
function pageOnload(){
	dhtmlx.image_path='/dhx/codebase/imgs/';

	var main_layout = new dhtmlXLayoutObject(document.body, '2U');

	var a = main_layout.cells('a');
	a.setWidth('220');
	a.hideHeader();
	FlTree = a.attachTree();


	var b = main_layout.cells('b');
	b.hideHeader();
	RzGridToolBar = b.attachToolbar();
	var RzGridToolBar_str = [
	     {type:"datebetween",id: 'rq',format: '%Y-%m-%d',width: '80',ksText:'开始时间：',jsText:'结束时间：'},
	     {type:"label",text:"员工姓名:"},
	     {type:"input",id:"yg_xm"},
	     {type:"button",id:"query",text:"查询"},
	     {type:"spacer",id:"query"},
	     {id:"add"},
	     {id:"edit"},
	     {id:"delete"}
	    ];
	RzGridToolBar.render(RzGridToolBar_str);
	//RzGridToolBar.loadXML('./data/toolbar.xml', function(){});
	RzGrid = b.attachGrid();
	
	RzGrid.setHeader(["uids","日期","工作内容","员工姓名","附件"]);
	RzGrid.setColTypes("ro,dhxCalendarA,ro,coro,link");
	
	RzGrid.setColumnMinWidth('0,100,120,60,60');
	RzGrid.setColAlign('left,center,left,center,center');
	RzGrid.setColSorting('str,str,str,str,str');
	RzGrid.setInitWidths("0,100,*,70,80");
	RzGrid.enableCellIds(true);
	RzGrid.setColumnIds('uids,create_date,work_content,create_user,fj_str');
	RzGrid.setColumnHidden(RzGrid.getColIndexById("uids"), true);
	RzGrid.init();
	RzGridDp = new dataProcessor(baseUrl+"?ac=RzglLoadRzGrid");
	RzGridDp.setUpdateMode('off');
	RzGridDp.init(RzGrid);
	RzGrid.attachFooter(["<div id='RzGrid_recinfoArea' style='width:100%;height:100%'></div>","#cspan","#cspan","#cspan","#cspan"],['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
	RzGrid.enablePaging(true, 20,  3,'RzGrid_recinfoArea');
	RzGrid.setPagingSkin('toolbar','dhx_skyblue');
	//RzGrid.load('./data/grid.xml', 'xml');
	
	
//布局结束，事件开始 
	//分类树加载
	FlTree.loadXML(baseUrl+"?ac=rzglFlTreeLoad&userId="+userid+"&roletype="+roletype,function(){
	});
	//分类树tip开启
	FlTree.enableAutoTooltips(1);
	//分类树加载完成后事件
	FlTree.attachEvent('onXLE', function(tree, id) {
		if(FlTree.hasChildren(id)){
			FlTree.openAllItems(id);
			//得到根节点id
			FlTree_root_id = FlTree.getChildItemIdByIndex(id,0);
			tree_selectId = FlTree_root_id;
			FlTree.selectItem(tree_selectId, true);
		}
	});	
	//分类树节点选中事件
	FlTree.attachEvent("onClick",function(id){
		tree_selectId = id;
		refreshRzGrid(id);
		var childNum = FlTree.hasChildren(id);
		if(childNum > 0){
			RzGridToolBar.disableItem("add");
		}else{
			RzGridToolBar.ag("add");
		}
	});
	//
	RzGridToolBar.attachEvent("onClick",function(id){
		switch(id){
			case "add":
				showRzForm(null,id);
				break;
			case "edit":
				var selectRz = RzGrid.getSelectedRowId();
				if(selectRz == null || selectRz == ""){
					dhxMessageWin("请先选择一条日志记录。");
					return false;
				}
				var rz_create_user = RzGrid.cells(selectRz,RzGrid.getColIndexById("create_user")).getValue();
				if( rz_create_user == userid){
					showRzForm(selectRz,id);
				}else{
					dhxMessageWin("选择的日志不是您新增的，不能编辑。");
				}
				break;
			case "delete":
				var selectRz = RzGrid.getSelectedRowId();
				if(selectRz == null || selectRz == ""){
					dhxMessageWin("请先选择一条日志记录。");
					return false;
				}
				var rz_create_user = RzGrid.cells(selectRz,RzGrid.getColIndexById("create_user")).getValue();
				if( rz_create_user == userid){
					delRowData(RzGrid, RzGridDp);
				}else{
					dhxMessageWin("选择的日志不是您新增的，不能删除。");
				}
				break;
			case "query":
				refreshRzGrid(tree_selectId);
				break;
		}
	});
	RzGridDp.attachFunctions(null, function(){
		dhxMessageWin("操作成功。");
		refreshRzGrid(tree_selectId);
	});
	//
	RzGrid.attachEvent("onEditCell", function(stage,rId,cInd,nValue,oValue){
		return false;
	});
	RzGridToolBar.getCalendar("start_rq").attachEvent("onClick",function(date){
		RzGridToolBar.setCalendarValue("end_rq",date.format("yyyy-MM-dd"));
	});
}
//

//刷新RzGrid
function refreshRzGrid(fl){
	var url = baseUrl+"?ac=RzglLoadRzGrid&userId="+userid+"&roletype="+roletype;//跟用户权限关联2014-3-4
	//得到ToolBar上的过滤条件组成json串。
	var result = {};
	var start = RzGridToolBar.getCalendarValue("rq","start");
	var end = RzGridToolBar.getCalendarValue("rq","end");
	var yg_xm = RzGridToolBar.getValue("yg_xm");
	if(start != null && start != ''){
		result["start"] = start;
	}
	if(end != null && end != ''){
		result["end"] = end;
	}
	if(yg_xm != null && yg_xm != ''){
		result["yg_xm"] = encodeURI(yg_xm);
	}
	if(fl != null && fl != ''){
		result["fl"] = fl;
	}
	url += "&jsonParm="+JSON.stringify(result);
	RzGrid.clearAndLoad(url);
}
//
function showRzForm(uid,buttonId){
	var windows = getWin();
	win_pass = windows.createWindow('win_pass', 0, 0, 550, 300);
	var title = '';
	if(buttonId=='add'){
		title='新增日志';
	}else{
		title='编辑日志';
	}
	win_pass.setText(title);
	win_pass.center();
	win_pass.denyResize();//不允许最大化、最小化
	win_pass.setModal(1);
	win_pass.button('park').hide();
	win_pass.button('minmax1').hide();
	var str = [
	        { type:"hidden",name:"uids"},
	        { type:"hidden",name:"fl_uids"},
	   		{ type:"input" , name:"fl_uids_name", label:"日志分类:", disabled:'true',width:110, labelWidth:"100", labelAlign:"right"  },
			{ type:"calendar" , name:"create_date", label:"日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期:",validate: "NotEmpty",readonly:true,useString:true, dateFormat:"%Y-%m-%d", inputWidth:"110",labelWidth:"100", options:{
	   			
	   		},labelAlign:"right" },
	   		{ type:"newcolumn" , position:""  },
	   		{ type:"hidden",name:"create_user"},
	   		{ type:"hidden",name:"fj_str"},
	   		{ type:"input" , name:"create_user_name", label:"员工姓名:",disabled:'true', width:110, labelWidth:"100", labelAlign:"right" },
	   		{ type:"newcolumn" , position:""  },
	   		{ type:"input" , name:"work_content", label:"工作内容:",  rows:"6",width:380,inputWidth:"300", labelWidth:"100", labelAlign:"right" }
	   	];
	var rzForm = win_pass.attachForm(str);
	var rzFormBar = win_pass.attachToolbar("","bottom");
	rzFormBar.render([{id:'save',text:'保存'},{id:'cancel',text:'关闭',img:'no.png'}]);
	rzFormBar.setItemCenter();
	var rzFormDp = new dataProcessor(baseUrl+"?ac=rzglLoarRzForm");
	rzFormDp.setUpdateMode('off');
	rzFormDp.init(rzForm);
	//布局结束，事件开始
	if(buttonId == "add"){
		rzForm.setItemValue("fl_uids", tree_selectId);
		rzForm.setItemValue("fl_uids_name", FlTree.getUserData(tree_selectId,"fl_name"));
		rzForm.setItemValue("create_user", userid);
		rzForm.setItemValue("create_user_name", username);
		rzForm.setItemValue("fj_str", rzgl_rz_fj);
	}else{
		rzForm.load(baseUrl+"?ac=rzglLoarRzForm&uids="+uid);
	}
	rzFormBar.attachEvent("onClick",function(id){
		rzForm.blur();
		switch(id){
			case "save":
				if(!rzForm.validate()){
		 			dhxMessageWin("红色部分输入值不正确。");
		 			return false;
		 		}else{
		 			rzFormDp.sendData();
		 		}
				break;
			case "cancel":
				win_pass.close();
				break;
		}
	});
	rzFormDp.attachFunctions("", function(){
		refreshRzGrid(tree_selectId);
		dhxMessageWin("保存成功。");
		win_pass.close();
	});
}

//查看设备附件函数
function showFileWin(uids,businessType,finished){
	var editable = true;
	//var ModuleLVL = "1";	//模块的权限级别(1完全控制 > 2写、运行 > 3读 > 4禁止访问)
	//得到日志作者
	if(uids == null || uids == ''){
		dhxMessageWin("未选中日志，请刷新重试。");
	}
	var rz_create_user = RzGrid.cells(uids,RzGrid.getColIndexById("create_user")).getValue();
	if( rz_create_user == userid){
		
	}else{
		editable = false;
	}
	if(finished == '1'){
		editable = false;
	}
	var fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&editable="+editable+"&businessId="
			+ uids+"&businessType="+businessType;
	var ext;
	try {
		ext = parent.Ext;
	} catch (e) {
		ext = Ext;
	}
	templateWin = new ext.Window({
				title : "日志附件",
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				plain : true,
				closeAction : 'hide',
				modal : true,
				html : "<iframe name='frmAttachPanel' src='" + fileUploadUrl
						+ "' frameborder=0 width=100% height=100%></iframe>"
			});
	templateWin.show();
	//给ext的hide事件增加function
	templateWin.on('hide', function (pa, oe) {
		refreshRzGrid(tree_selectId);
	},this);
}

	</script>

  </head>
  
  <body onload="pageOnload()" style="width:100%;height:100%">
  </body>
</html>
