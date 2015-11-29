<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<%@ page language="java" pageEncoding="utf-8" %>
<html>
  <head>
    
    <title>分类树维护</title>
    
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
	<script type="text/javascript">
var redHtml = "<font color='red'>*</font>";
var baseUrl = CONTEXT_PATH + "/servlet/RzglServlet";
var userid = '${userid}';
var userdeptid = '${userdeptid}';
var FlTreeGrid,FlTreeGridDp,FlTreeToolBar,FlForm,FlFormBar,FlQxGrid,FlQxGridDp;
var treeSelect='';
function pageOnload(){
	dhtmlx.image_path='/dhx/codebase/imgs/';
	var main_layout = new dhtmlXLayoutObject(document.body, '3W');

	var a = main_layout.cells('a');
	a.setText('日志管理分类树维护');
	FlTreeToolBar = a.attachToolbar();
	
	var FlTreeToolBar_str = [
	     {id:'expand',text:'展开',img:'tree_expand.png'},
	     {id:'colspan',text:'折叠',img:'tree_shrink.png'},
	     {id:'add',text:'新增'},
	     {id:'edit'},
	     {id:'delete'}
	];
	FlTreeToolBar.render(FlTreeToolBar_str);
	
	FlTreeGrid = a.attachGrid();
	FlTreeGrid.setHeader(["uids","分类名称","分类编码","排序号"]);
	FlTreeGrid.setColTypes("ro,tree,ro,ro");
	
	FlTreeGrid.setColumnMinWidth('0,100,50,50');
	FlTreeGrid.setColSorting('str,str,str,str');
	FlTreeGrid.setInitWidths("0,*,*,50");
	FlTreeGrid.enableCellIds(true);
	FlTreeGrid.setColumnIds('uids,fl_name,fl_code,order_num');
	FlTreeGrid.setColAlign('left,left,left,center');
	FlTreeGrid.setColumnHidden(FlTreeGrid.getColIndexById("uids"), true);
	FlTreeGrid.setColumnHidden(FlTreeGrid.getColIndexById("order_num"), true);
	FlTreeGrid.init();
	FlTreeGridDp = new dataProcessor(baseUrl+"?ac=LoadFlTreeGrid");
	FlTreeGridDp.setUpdateMode('off');
	FlTreeGridDp.init(FlTreeGrid);
	
	var b = main_layout.cells('b');
	var middleLay = b.attachLayout('2E');

	var FlFormCell = middleLay.cells('a');
	FlFormCell.setHeight('200');
	FlFormCell.setText('日志管理分类编辑');
	var str = [
			{ type:"hidden" , name:"up_uids"},  
			{ type:"hidden" , name:"uids"},
			{ type:"hidden" , name:"create_user",value:userid },
			{ type:"hidden" , name:"create_dept",value:userdeptid },
	   		{ type:"input" , name:"up_code", label:"上级分类编号：",disabled:true, width:200, labelWidth:"120", labelAlign:"right" },
	   		{ type:"input" , name:"up_name", label:"上级分类名称：",validate: "NotEmpty", width:200, labelWidth:"120", labelAlign:"right"  },
	   		{ type:"input" , name:"curr_code", label:"分&nbsp;&nbsp;类&nbsp;&nbsp;编&nbsp;&nbsp;号：", disabled:true,width:200, labelWidth:"120", labelAlign:"right" },
	   		{ type:"input" , name:"curr_name", label:"分&nbsp;&nbsp;类&nbsp;名&nbsp;称"+redHtml+"：",validate: "NotEmpty", width:200, labelWidth:"120", labelAlign:"right" }

	   	];
	FlForm = FlFormCell.attachForm(str);
    FlFormBar = FlFormCell.attachToolbar("","bottom");
	FlFormBar.render([{id:'save',text:'保存'}]);
	FlFormBar.setItemCenter();
	var FlFormDp = new dataProcessor(baseUrl+"?ac=loadFlForm");
	FlFormDp.setUpdateMode('off');
	FlFormDp.init(FlForm);
	var cell_2 = middleLay.cells('b');
	cell_2.hideHeader();

	
	var c = main_layout.cells('c');
	c.setText('分类权限设置');
	FlQxGrid = c.attachGrid();
	
	FlQxGrid.setHeader(["uids","单位或部门名称","权限设置","selectFl"]);
	FlQxGrid.setColTypes("ro,tree,ch,ro");
	
	FlQxGrid.setColumnMinWidth('0,100,50,0');
	FlQxGrid.setColSorting('str,str,str,str');
	FlQxGrid.setInitWidths("0,*,60,0");
	FlQxGrid.enableCellIds(true);
	FlQxGrid.setColumnIds('unitid,unitname,qx,selectFl');
	FlQxGrid.setColAlign('left,left,center,center');
	FlQxGrid.setColumnHidden(FlQxGrid.getColIndexById("uids"), true);
	FlQxGrid.setColumnHidden(FlQxGrid.getColIndexById("selectFl"), true);
	FlQxGrid.init();
	FlQxGridDp = new dataProcessor(baseUrl+"?ac=loadFlQxUnit");
	//FlQxGridDp.setUpdateMode('off');
	FlQxGridDp.init(FlQxGrid);
	
//布局结束，事件开始
	//分类树grid编辑事件
	FlTreeGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){
		return false;
	});
	//分类树dp事件
	FlTreeGridDp.attachFunctions("",function(){
		refreshFlTreeGrid(null);//修复删除后form，权限不刷新
		dhxMessageWin("操作成功。");
	});
	//分类权限dp事件
	FlQxGridDp.attachFunctions("",function(){
		dhxMessageWin("操作成功。");
	});
	//加载分类树
	refreshFlTreeGrid(null);
	//分类树选中事件
	FlTreeGrid.attachEvent("onRowSelect",function(id){
		//加载分类form，默认为edit业务
		var parentId = FlTreeGrid.getParentId(id);
		if(parentId == '0'){
			FlFormLoad(id,"edit");
		}else{
			FlFormLoad(id,"edit");
		}
		refreshFlQxGrid(id);
	});
	//组织机构treeGrid勾选设置级联
	FlQxGrid.attachEvent('onCheck', function(rId,cInd,state){
		var qxTreeSelect = FlTreeGrid.getSelectedRowId();
		if(qxTreeSelect == null || qxTreeSelect == ''){
			dhxMessageWin('未选择要设置的分类!');
			return false;
		}
		setTreeGridCascadSelect('0', this, rId, cInd, state,'1','1');
		return true;
	});
	//分类树按钮事件
	FlTreeToolBar.attachEvent("onClick",function(id){
		switch(id){
		    case "expand":
		    	FlTreeOpenAll();
		    	break;
		    case "colspan":
		    	FlTreeCollapseAll();
		    	break;
			case "add":
				var selectId = FlTreeGrid.getSelectedRowId();
				if(selectId == null || selectId == ''){
					dhxMessageWin("请先选择一个父节点，再新增。");
					return false;
				}
				FlFormLoad(selectId,id);
				break;
			case "edit":
				var selectId = FlTreeGrid.getSelectedRowId();
				if(selectId == null || selectId == ''){
					dhxMessageWin("请选择要修改的分类。");
					return false;
				}
				var parentId = FlTreeGrid.getParentId(selectId);
				if(parentId == '0'){
					dhxMessageWin("顶级节点，不能编辑。");
				}
				FlFormLoad(selectId,id);
				break;
			case "delete":
				var selectId = FlTreeGrid.getSelectedRowId();
				if(selectId == null || selectId == ''){
					dhxMessageWin("请选择要删除的分类。");
					return false;
				}
				var parentId = FlTreeGrid.getParentId(selectId);
				if(parentId == '0'){
					dhxMessageWin("顶级节点，不能删除。");
					return false;
				}
				var childNum = FlTreeGrid.hasChildren(selectId);
				if(childNum > 0){
					dhxMessageWin("该分类下面还有分类，不能删除。");
					return false;
				}
				delRowData(FlTreeGrid, FlTreeGridDp);
				break;
		}
	});
	//分类form按钮事件
	FlFormBar.attachEvent("onClick",function(id){
		FlForm.blur();
		switch(id){
			case "save":
				if(!FlForm.validate()){
					dhxMessageWin("红色部分数据输入有误，请检查！");
					return false;
				}
				FlFormDp.sendData();
				break;
		}
	});
	//formDp事件
	FlFormDp.attachFunctions("",function(){
		//form保存后做2件事，刷新树，选中操作的节点
		dhxMessageWin("操作成功。");
		refreshFlTreeGrid(treeSelect);
	});
}
//刷新树
function refreshFlTreeGrid(s_Id){
	FlTreeGrid.clearAll();
	FlTreeGrid.load(baseUrl+"?ac=LoadFlTreeGrid",function(){
		FlTreeOpenAll();
		if(s_Id != null){
			FlTreeGrid.selectRowById(s_Id,true,true,true);
		}else{
			var count = FlTreeGrid.getRowsNum();
			if(count > 0){
				//FlTreeGrid.selectFirst(true);
				FlTreeGrid.selectRow(0,true,true,true);
			}
		}
		
	});
}
//展开分类树
function FlTreeOpenAll(){
	FlTreeGrid.expandAll();
}
//折叠分类树
function FlTreeCollapseAll(){
	FlTreeGrid.collapseAll();
}
//分类form加载
function FlFormLoad(selectId,buttonId){
	FlForm.load(baseUrl+"?ac=loadFlForm&selectId="+selectId+"&buttonId="+buttonId,function(){
		treeSelect = selectId;
		var parentId = FlTreeGrid.getParentId(selectId);
		if(parentId == '0' && buttonId == 'edit'){
			FlForm.disableItem("up_name");
			FlForm.disableItem("curr_name");
			FlFormBar.disableItem("save");
			//dhxMessageWin("顶级节点不能修改！");
			return false;
		}else{
			var fatherId = FlTreeGrid.getParentId(selectId);
			var grandFatherId = FlTreeGrid.getParentId(fatherId);
			//alert("grandFatherId:"+grandFatherId+"fatherId:"+fatherId);
			FlFormBar.ag("save");
			if(grandFatherId == '0' && buttonId == 'edit'){
				FlForm.disableItem("up_name");
				FlForm.ag("curr_name");
			}else{
				FlForm.ag("curr_name");
				//FlForm.ag("up_name");//禁用上级节点可编辑
				FlForm.disableItem("up_name");
			}
		}
	});
}

//刷新树
function refreshFlQxGrid(fl_id){
	FlQxGrid.clearAll();
	var url = baseUrl+"?ac=loadFlQxUnit";
	if(fl_id != null){
		url += "&flId="+fl_id;
	}
	FlQxGrid.load(url,function(){
		FlQxGrid.expandAll();
	});
}



	
	</script>
		
  </head>
  
  <body onload="pageOnload()" style="width:100%;height:100%">
  </body>
</html>
