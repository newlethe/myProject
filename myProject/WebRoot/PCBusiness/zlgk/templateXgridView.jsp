<%@ page language="java" pageEncoding="UTF-8"%>
<!-- @author:lizp  -->
<%@ include file="/dhtmlxGridCommon/xgridCommon/xgridjs.jsp"%>
<%
	String sj_type = request.getParameter("sj_type")==null?"":(String)request.getParameter("sj_type");
	String unit_id = request.getParameter("unit_id")==null?"":(String)request.getParameter("unit_id");
	String company_id = request.getParameter("company_id")==null?"":(String)request.getParameter("company_id");
	String headtype = request.getParameter("headtype")==null?"":(String)request.getParameter("headtype");
	String xgridtype = request.getParameter("xgridtype")==null?"":(String)request.getParameter("xgridtype");
	String keycol = request.getParameter("keycol")==null?"":(String)request.getParameter("keycol");
	String ordercol = request.getParameter("ordercol")==null?"":(String)request.getParameter("ordercol");
	String filter = request.getParameter("filter")==null?"":(String)request.getParameter("filter");
	String parentsql = request.getParameter("parentsql")==null?"":(String)request.getParameter("parentsql");
	String bpnode = request.getParameter("bpnode")==null?"":(String)request.getParameter("bpnode");
	String relatedCol = request.getParameter("relatedCol")==null?"":(String)request.getParameter("relatedCol");
	String editable = request.getParameter("editable")==null?"true":(String)request.getParameter("editable");
	String hasInsertBtn = request.getParameter("hasInsertBtn")==null?"true":(String)request.getParameter("hasInsertBtn");
	String hasEditBtn = request.getParameter("hasEditBtn")==null?"true":(String)request.getParameter("hasEditBtn");
	String hasDelBtn = request.getParameter("hasDelBtn")==null?"true":(String)request.getParameter("hasDelBtn");
	String hasSaveBtn = request.getParameter("hasSaveBtn")==null?"true":(String)request.getParameter("hasSaveBtn");

	String initInsertData = request.getParameter("initInsertData")==null?"":(String)request.getParameter("initInsertData");
	
	String skin = request.getParameter("skin")==null?"light":(String)request.getParameter("skin");
	String hasFooter = request.getParameter("hasFooter")==null?"true":(String)request.getParameter("hasFooter");
	String hideAllBtn = request.getParameter("hideAllBtn")==null?"false":(String)request.getParameter("hideAllBtn");
	
%>
<html>
	<head>
		<base href="<%=basePath%>">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>项目管理</title>
	</head>
	<body>
		<div id="gridbox"></div>
	</body>
	<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
	<script type='text/javascript' src='<%=path%>/dwr/interface/xgridCommon.js'></script>
	<script> 
//////////////xgrid中百分比单元格类型
 function eXcell_percent(cell){
	this.base=eXcell_ed;
	this.base(cell)
	this.getValue=function(){
		if (this.cell.childNodes.length > 1)
			return  parseFloat(this.cell.childNodes[0].innerHTML.toString()._dhx_trim())/100;
		else
			return  "0";
	}
}

eXcell_percent.prototype=new eXcell_ed;
eXcell_percent.prototype.setValue=function(val){
	if (isNaN(parseFloat(val))){
		val=this.val||0;
	}
	val = parseFloat(val);
	if(val<0) val=0;
	this.setCValue("<span style='padding-right:2px;'>"+(Math.round(val*10000)/100)+"</span><span>%</span>");
}  
////////////////////////////////////////////////////////////
/*
var param = window.dialogArguments;
if(param) {
	sj_type = param.sj_type ;	//时间
	unit_id = param.unit_id ; //单位(取表头用)
	company_id = param.company_id==undefined?"":param.company_id ; //单位(取数据用,为空表示全部单位数据)
	headtype = param.headtype ;    //类型（与配置表对应）
	xgridtype = param.xgridtype==undefined?"":param.xgridtype ; //xgrid类型（tree为treegrid）
	keycol = param.keycol ;   //单表查询时为主键列，多表查询是为关联列（仅支持单列）
	ordercol = param.ordercol==undefined? "" : param.ordercol ;   //排序列(支持多列)
	filter = param.filter==undefined?"" : param.filter  //过滤条件
	//treegrid需要
	parentsql = param.parentsql==undefined?"":param.parentsql  //treegrid时统计层sql（sql最后三列为relatedCol[关联列],cnode、pnode父子关系列）
	bpnode = param.bpnode==undefined?"":param.bpnode   //多层treegrid时起点的父节点id
	relatedCol = param.relatedCol==undefined?"":param.relatedCol  //treegrid时统计层与具体层管理的列名
	editable = param.editable==undefined?true:param.editable ; //能否编辑
	//控制工具栏按钮参数
	hasInsertBtn = param.hasInsertBtn == undefined ? true : param.hasInsertBtn;
	hasEditBtn = param.hasEditBtn == undefined ? true : param.hasEditBtn;
	hasDelBtn = param.hasDelBtn == undefined ? true : param.hasDelBtn;
	hasSaveBtn = param.hasSaveBtn == undefined ? true : param.hasSaveBtn;
	//插入时的固定数据
	initInsertData = param.initInsertData == undefined ? "" : param.initInsertData;
	hideAllBtn = param.hideAllBtn == undefined ? false : param.hideAllBtn;
	
	skin = param.skin == undefined ? "light" : param.skin;
} else {
*/
	sj_type = "<%=sj_type%>";
	unit_id = "<%=unit_id%>";
	company_id = "<%=company_id%>";
	headtype = "<%=headtype%>";
	xgridtype = "<%=xgridtype%>";
	keycol = "<%=keycol%>";
	ordercol = "<%=ordercol%>";
	filter = "<%=filter%>";
	parentsql = "<%=parentsql%>";
	bpnode = "<%=bpnode%>";
	relatedCol = "<%=relatedCol%>";
	editable = "<%=editable%>"=="false" ? false : true;
	hasInsertBtn = "<%=hasInsertBtn%>"=="false" ? false : true;
	hasEditBtn = "<%=hasEditBtn%>"=="false" ? false : true;
	hasDelBtn = "<%=hasDelBtn%>"=="false" ? false : true;
	hasSaveBtn = "<%=hasSaveBtn%>"=="false" ? false : true;
	initInsertData = "<%=initInsertData%>";

	skin = "<%=skin%>";
	hasFooter = "<%=hasFooter%>"=="false" ? false : true;
	hideAllBtn = "<%=hideAllBtn%>"=="false" ? false : true;
/*
}
*/
var mygrid,myDataProcessor
Ext.onReady(function(){
  doInsertBtn = new Ext.Toolbar.Button({
		id: 'insertRow',
        icon: insertBtnImagePath,
        cls: "x-btn-text-icon",
        text: "<b>增加</b>",
        handler: insertRow
    });  
	doEditBtn = new Ext.Toolbar.Button({
		id: 'editRow',
        icon: updateBtnImagePath,
        cls: "x-btn-text-icon",
        text: "<b>编辑</b>",
        handler: insertRow
    });  
    doDelBtn = new Ext.Toolbar.Button({
		id: 'deleteRow',
        icon: deleteBtnImagePath,
        cls: "x-btn-text-icon",
        text: "<b>删除</b>",
        handler: deleteRow
    }); 
    doSaveBtn = new Ext.Toolbar.Button({
		id: 'saveData',
        icon: saveBtnImagePath,
        cls: "x-btn-text-icon",
        text: "<b>保存</b>",
        handler: saveData
    });
    doExcelBtn = new Ext.Toolbar.Button({
		id: 'doExcel',
        icon: excelBtnImagePath,
        cls: "x-btn-text-icon",
        text: "<b>导出excel</b>",
        handler: templateForData
    });
    doInitBtn = new Ext.Toolbar.Button({
		id: 'doInit',
        icon: updateBtnImagePath,
        cls: "x-btn-text-icon",
        text: "<b>初始化统计报表</b>",
        handler: initData
    });
    
  xGridpanel=new Ext.grid.dhxGridPanel({
		region:'center',
		border: false,
        frame:true,
        align: 'right'
    });
    
    var tbarItem = [doInitBtn,'-',colMangeBtn,'-',doExcelBtn];    
    
    if ( hasSaveBtn ){
    	tbarItem.splice(2,0, doSaveBtn, '-');
    }
    if ( hasDelBtn ){
    	tbarItem.splice(2,0, doDelBtn, '-');  
    }
    if ( hasInsertBtn ){
    	tbarItem.splice(2,0, doInsertBtn, '-');
    }
    
    if(hideAllBtn)
    	tbarItem  = [colMangeBtn,'-',doExcelBtn]
    
	if(parent.ModuleLVL == "3") tbarItem = [colMangeBtn,'-',doExcelBtn];

	var container = new Ext.Panel({
        id:'content-panel',
        border: false,
        region:'center',
        split:true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        tbar:tbarItem,
        items:xGridpanel
    });
    
   viewport = new Ext.Viewport({
		layout:'border',
		hideBorders :false,
		items:container
	});
	
	xGridpanel.render('gridbox');
    mygrid=xGridpanel.grid; 
    init() ;
})

function init() {
	mygrid.setImagePath(xgridImagePath);
	mygrid.setSkin(skin);
	if(xgridtype.toLowerCase()!="tree")  {
		mygrid.enableSmartRendering(true);//异步加载
	}
	
	mygrid.init();
	myDataProcessor = new dataProcessor("");
	myDataProcessor.setUpdateMode("off");
	myDataProcessor.init(mygrid);
	mygrid.enableEditEvents(false,true,true) ;
	mygrid.attachEvent("onXLE",hideprogress);
	mygrid.attachEvent("onEditCell",cellOnEdit);
	mygrid.clearAll();
	mygrid.setDateFormat("y-m-d");
	
	loadXgrid()
  }
	
	//加载xgird数据
	function loadXgrid(){
	    progressstart()
	    xgridCommon.getXgridXML(xgridtype,sj_type,headtype,unit_id,company_id,keycol,filter,ordercol,parentsql,bpnode,relatedCol, true, function(data){
		   if(data) {
		      mygrid.clearAll();
		      mygrid.loadXMLString(data) ;
		      if(!hasFooter) mygrid.detachFooter(0);
		      mygrid.setColumnExcellType(3,"percent");
		      mygrid.setColumnExcellType(6,"percent");
		   } else {
		      alert("模板有误，请检查配置！")
		      hideprogress()
		   }
		})
	}
	
	//启动进度条
	function progressstart() {
	 	Ext.MessageBox.show({
		      width: 240,
		      progress: true,
		      closable: false
	     })
		Ext.MessageBox.wait('数据读取中...','请等待',{interval: 30,increment:100,duration: 100000,fn:function(){window.frames["grid1"].hideprogress();alert("加载超时，请重新加载！")}})
	 }
	 
	//隐藏进度条
	function hideprogress()  {
		if(editable)  {
			Ext.getCmp('insertRow').show()
			Ext.getCmp('deleteRow').show()
			Ext.getCmp('saveData').show()
		}
		if(Ext.MessageBox)  Ext.MessageBox.hide()
	}
	
	//新增项目
	function insertRow()  {
		var cols = mygrid.getColumnsNum() ;
		var newrowvalue = "" ;
		for(var i=0;i<cols;i++)  {
			var type = mygrid.getColType(i) ;
			if(type=='math'||type=='ch') {
				newrowvalue +="0,"
			} else {
				newrowvalue +=","
			}
		}
		mygrid.enableMathEditing(true);
		
		var cuid = getSN() ;
		if(mygrid.isTreeGrid())  {
			if(mygrid.getSelectedRowId()==null) {
			 	mygrid.addRow(cuid,newrowvalue,"",parent.category,"","")
			 }  else {
			 	var row_id = mygrid.getSelectedRowId() ;
			 	if(row_id.split(",").length>1) {
			 		row_id = row_id.split(",")[row_id.split(",").length-1]
			 	}
			 	var ifroot = mygrid.getRowAttribute(row_id,"root") ;
			 	if(ifroot&&ifroot==1)  {
			 		mygrid.addRow(cuid,newrowvalue,"",row_id,"","")
			 	} else {
			 		var parentid = mygrid.getParentId(row_id)
			 		var ind = mygrid.getRowIndex(row_id) ;
			 		mygrid.addRowAfter(cuid,newrowvalue,mygrid.getSelectedRowId()) 
			 	}
			 }
		} else  {
			if(mygrid.getSelectedRowId()==null) {
				mygrid.addRow(cuid,newrowvalue)
			} else {
				var row_id = mygrid.getSelectedRowId() ;
			 	if(row_id.split(",").length>1) {
			 		row_id = row_id.split(",")[row_id.split(",").length-1]
			 	}
			 	mygrid.addRow(cuid,newrowvalue,mygrid.getRowIndex(row_id)+1)
			}
		}
		myDataProcessor.setUpdated(cuid,true);
	}
	
	function cellOnEdit(stage,rowid,cindex)  {
		if(parent.cellOnEditFun) {
			return parent.cellOnEditFun(mygrid,rowid,cindex,stage);
		} else {
			if(mygrid.getRowAttribute(rowid,"root")=='1')  {
				return false ;
			} else {
				return true ; 
			}
		}
	}
	
	//删除行
	function deleteRow()  {
	   if(mygrid.getSelectedRowId()==null) {
		 	alert("请选择要删除的记录")
		 	return ;
		} 
		if(!window.confirm("是否确定要删除？"))  {
	     	return ;
	    } 
	    mygrid.deleteSelectedRows() ;
	}
	
	//保存
	function saveData()  {
	   mygrid.editStop()
	   if(myDataProcessor.updatedRows.length<1) {
			return ;
		}
		var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
		xmlDoc.setProperty("SelectionLanguage", "XPath");
		xmlDoc.async = false;
		if(xmlDoc.hasChildNodes()) {
			xmlDoc.removeChild(xmlDoc.firstChild)
		}
		var root = xmlDoc.createElement("rows")   ;
		//root.setAttribute("unit_id",unitId) ;
		root.setAttribute("keycol",keycol) ;
		var tablename = null ;
		var colname = "" ;
		xmlDoc.appendChild(root)   ;
		var head = xmlDoc.createElement("head")   ;
		for(var i=0;i<mygrid.getColumnsNum();i++) {
			if(mygrid.getColType(i)=='ro'||mygrid.getColType(i)=='ron'||mygrid.getColType(i)=='link'||mygrid.getColType(i)=="tree") continue ;
			var colsplit = mygrid.getColumnId(i).toUpperCase().split(".") ;
			if(colsplit.length>1) {
				if(tablename==null)  {
					tablename = colsplit[0]
					colname = colsplit[1]
				} else if(tablename==colsplit[0]){
					colname = colsplit[1]
				} else {
					continue ;
				}
			} else {
				colname = colsplit[0]
			}
			var column = xmlDoc.createElement("column")   ;
			column.text = colname ;
			head.appendChild(column) ;
		}
		if(tablename!=null) {
			root.setAttribute("tablename",tablename) ;
		}
		root.appendChild(head) ;
		for(var i = myDataProcessor.updatedRows.length-1;i>=0;i--){
			var pkid = myDataProcessor.updatedRows[i];
			var rootId = "";
			if(xgridtype.indexOf("tree")>-1) {
				rootId = getRootIdByRowId(mygrid.getParentId(pkid));
			}
			var row = xmlDoc.createElement("row")   ;
			var type="" ;
			if(mygrid.getUserData(myDataProcessor.updatedRows[i], "!nativeeditor_status") == 'deleted'){
				type = 'delete'
			}else{
				if(mygrid.getUserData(myDataProcessor.updatedRows[i], "!nativeeditor_status") == 'inserted') {
					type = 'insert'
				} else {
					type = 'update'
				}
				for(var j=0;j<mygrid.getColumnsNum();j++) {
					if(mygrid.getColType(j)=='ro'||mygrid.getColType(j)=='ron'||mygrid.getColType(j)=='link'||mygrid.getColType(j)=="tree") continue ;
					var cell = xmlDoc.createElement("cell")   ;
					cell.setAttribute("type",mygrid.getColType(j)) ;
					cell.text = mygrid.cells(pkid,j).getValue();
					row.appendChild(cell) ;
				}
			}
			row.setAttribute("type",type)  ;
			row.setAttribute("id",pkid)  ;
			if(type=="insert" && xgridtype.indexOf("tree")>-1) {
				row.setAttribute(relatedCol, mygrid.getRowAttribute(rootId, relatedCol)) ;
				if(initInsertData && initInsertData.length>0) {
					var initDataArr = initInsertData.split(";");
					for(k1=0; k1<initDataArr.length; k1++) {
						var tempA = initDataArr[k1].split("`");
						row.setAttribute(tempA[0], tempA[1]) ;
					}
				}
			}
			root.appendChild(row) ;
		}
		
		xgridCommon.saveXgrid(xmlDoc.xml,function(data){
		    if(data)  {
		    	var xmlRrt = new ActiveXObject('Microsoft.XMLDOM')
				xmlRrt.setProperty("SelectionLanguage", "XPath")
				xmlRrt.async = false
				xmlRrt.loadXML(data)
				var atag = xmlRrt.getElementsByTagName("action");
				for(var i=0;i<atag.length;i++) {
					var btag=atag[i];
					var action=btag.getAttribute("type");
					var sid=btag.getAttribute("sid");
					var tid=btag.getAttribute("tid");
					myDataProcessor.afterUpdateCallback(sid,tid,action,btag)
				};
				if(parent.afterSavexGrid) {
					//质量管控中验评信息录入保存xgrid后更新累计合格数，累计不合格数，累计合格率
					parent.afterSavexGrid(mygrid);
				}
		        alert("保存完成！")
		    } else {
		       alert("保存失败!")
		    }
		});
	}
	
	//获得模板url
	function getExcelFileId() {
		DWREngine.setAsync(false); 
		var fileid = null ;
		xgridCommon.getExcelTemplet(sj_type,headtype,unit_id,function(data){
			if(data) {
				fileid = data;
			}
		})
		return fileid;
	}
	
	//导出excel
	function tranexcelData()  {
		mygrid.editStop();
		var exceldata = getGridData(mygrid)
		var fileid = getExcelFileId() ; 
		var url = null ;
		if(fileid!=null)  {
			url = MAIN_SERVLET+"?ac=downloadFile&fileid="+fileid ;
		}
		//方案一：js
		//XgridToSheetExcel(url,exceldata) 
		//方案二：模板去取数据
		templateForData()
		//方案三:poi
		//saveToPOIExcel(mygrid,"第一页",fileid)
	}
	
	//导出excel(通过xgrid模板读取数据)
	function templateForData() {
		var fileid = getExcelFileId() ; 
		var url = null ;
		if(fileid!=null)  {
			url = MAIN_SERVLET+"?ac=downloadFile&fileid="+fileid ;
			var param = new Object()
			param.url = url
			param.sj_type = sj_type;  //时间
			param.company_id = company_id ; //取数据用（为空是全部单位）
			param.headtype = headtype;	//计划类型
			param.keycol = keycol;	
			param.ordercol = ordercol;	
			param.xgridtype = xgridtype ;
			param.parentsql = parentsql ;
			param.bpnode = bpnode ;
			param.relatedCol = relatedCol ;
			param.filter = filter;
			window.showModelessDialog(basePath+"dhtmlxGridCommon/excel/templateToExcelView.jsp", param , "dialogWidth:1000;dialogHeight:600;center:yes;resizable:yes;")	
		} else {
			alert("没有找到模板文件！");
		}
	}
	
	function getRootIdByRowId(rowId) {
		if(mygrid.getRowAttribute(rowId,"root")=='1') {
			return rowId;
		} else {
			return getRootIdByRowId(getParentId(rowId));
		}
	}

	//打开初始化窗口
	function initData(){
		if(parent.initBaoBiao)parent.initBaoBiao();
	}
</script>
</html>
