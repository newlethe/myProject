<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<!-- @author:guox  -->
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	String unitID = (String)session.getAttribute(Constant.USERUNITID);
%>
<html>
	<head>
		<base href="<%=basePath%>">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>PPT文件模板</title>
		
		<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css" />
	 	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
	    <script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script>
		
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		
		<script type='text/javascript' src='<%=path%>/Business/jsp/common/util.js'></script>
		<script type="text/javascript" src="<%=path%>/extExtend/columnNodeUI.js"></script>
	    <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnTree.css" />
	    <script type="text/javascript" src="<%=path%>/extExtend/PagingToolbarEx.js"></script>
	    
	    <style type="text/css">
			html, body {
		        font:normal 12px verdana;
		        margin:0;
		        padding:0;
		        border:0 none;
		        overflow:hidden;
		        height:100%;
		    }
		</style>
	</head>
	<body>
		<div id="center">
			<form name="docFrm">
				<object id="TANGER_OCX" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
					codebase="<%=basePath%>/<%=Constant.NTKOCAB%>" width="100%" height="100%">
					<param name="Menubar" value="-1">
					<param name="Titlebar" value="0">
					<param name="IsShowToolMenu" value="-1">
					<param name="IsHiddenOpenURL" value="0">
					<param name="IsUseUTF8URL" value="-1">
					<%=Constant.NTKOCOPYRIGHT%>
					<SPAN STYLE="color:red"><br>不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>
				</object>
			</form>
		</div>
		<div id="east"></div>
	</body>
</html>

<script type="text/javascript">
var basePath = "<%=basePath%>"
var param = window.dialogArguments
var docOcx

Ext.onReady(function(){

	var container = new Ext.Panel({
		region: 'center',
		contentEl: 'center',
		//title: '&nbsp;',
		border: false
	});
	
	//////////////////////////////////////////////////
	var indexTree = new Ext.tree.TreePanel({
		region: 'center',
		rootVisible:false,
		margins:'0 0 0 0',
        autoScroll:true,
        border: false,
        loader: new Ext.tree.TreeLoader({
	        dataUrl: '<%=path%>/Business/jsp/common/templet/treeInxData.jsp'
	    }),
        root: new Ext.tree.AsyncTreeNode({
            text: 'root',
            id: '0',
            expanded: true
        })
	});

	var nmField = new Ext.form.TextField({
		fieldLabel: '书签名',
		allowBlank: false,
		width:200
	});
	
	var colStore = new Ext.data.SimpleStore({
		id: 0,
		fields: ['val', 'txt', 'typ']
    });
    var colBox = new Ext.form.ComboBox({
    	fieldLabel: '类&nbsp;&nbsp;&nbsp;型',
    	allowBlank: false,
    	width:200,
    	maxHeight:200,
    	store: colStore,
    	displayField:'txt',
		valueField:'val',
		typeAhead: true,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
    
    var corpStore = new Ext.data.SimpleStore({
		fields: ['val', 'txt']
    });
    var corpBox = new Ext.form.ComboBox({
    	fieldLabel: '单&nbsp;&nbsp;&nbsp;位',
    	allowBlank: false,
    	width:200,
    	maxHeight:200,
    	store: corpStore,
    	displayField:'txt',
		valueField:'val',
		typeAhead: true,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
    
	var dateStore = new Ext.data.SimpleStore({
        id: 0,
		fields: ['val', 'txt', 'typ']
    });
    var dateBox = new Ext.form.ComboBox({
    	fieldLabel: '时&nbsp;&nbsp;&nbsp;间',
    	allowBlank: false,
    	width:120,
    	maxHeight:200,
    	store: dateStore,
    	displayField:'txt',
		valueField:'val',
		typeAhead: true,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
    dateBox.on('expand',function() {
    	if(colBox.getValue()!="") {
			var t = colStore.getById(colBox.getValue()).get('typ')
			dateStore.filterBy(function(d){
				if(d.get('typ').substring(0,1)==t) {
					return true
				}
				else {
					return false
				}
			});
		}
	})
	dateBox.on('select',function(c,r,i) {
		if(r.get('typ').length>1) {
			mBox.show()
		}
		else {
			mBox.hide()
		}
	})
	
	var mss = new Ext.data.SimpleStore({
        fields: ['val', 'txt', 'typ'],
        data : [ ['01','1月','MM'],['02','2月','MM'],['03','3月','MM'],['04','4月','MM'],['05','5月','MM'],['06','6月','MM'],
        		['07','7月','MM'],['08','8月','MM'],['09','9月','MM'],['10','10月','MM'],['11','11月','MM'],['12','12月','MM'],
        		['1Q','1季度','QQ'],['2Q','2季度','QQ'],['3Q','3季度','QQ'],['4Q','4季度','QQ'] ]
    });
    var mBox = new Ext.form.ComboBox({
    	hideLabel:true,
    	width:60,
    	maxHeight:200,
    	hidden: true,
    	store: mss,
    	displayField:'txt',
		valueField:'val',
		typeAhead: id,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
    mBox.on('expand',function() {
		if(dateBox.getValue()!="") {
			var t = dateStore.getById(dateBox.getValue()).get('typ')
			mss.filterBy(function(d){
				if(d.get('typ')==t) {
					return true
				}
				else {
					return false
				}
			});
		}
	})
	mBox.on('hide',function (){
		mBox.setValue('')
	});
	
	var numSS1 = new Ext.data.SimpleStore({
        fields: ['val', 'txt'],
        data : [ ['','　'],['0','0'], ['1','1'], ['2','2'], ['3','3'], ['4','4'] ]
    });
	var num1Field = new Ext.form.ComboBox({
    	fieldLabel: '小数位',
    	width:200,
    	maxHeight:200,
    	store: numSS1,
    	displayField:'txt',
		valueField:'val',
		typeAhead: true,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
	
	var numSS2 = new Ext.data.SimpleStore({
        fields: ['val', 'txt'],
        data : [ ['','　'], ['10','10'], ['100','100'], ['1000','1000'], ['10000','10000'], ['0.1','0.1'], ['0.01','0.01'], ['0.001','0.001'], ['0.0001','0.0001'] ]
    });
	var num2Field = new Ext.form.ComboBox({
    	fieldLabel: '系&nbsp;&nbsp;&nbsp;数',
    	width:200,
    	maxHeight:200,
    	store: numSS2,
    	displayField:'txt',
		valueField:'val',
		typeAhead: true,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
    
	var fsf = new Ext.FormPanel({
		region: 'south',
		labelWidth: 50,
		height: 168,
		frame:true,
		items:[ nmField, colBox, corpBox, 
				{layout:'column', border:false,items:[{columnWidth:.7,layout:'form',border:false,items:dateBox},{columnWidth:.3,layout:'form',border:false,items:mBox}]},
				num1Field, num2Field]
	});
	////////////////////
	var datRs = Ext.data.Record.create([
		//templete_id,search_code,search_name,col_id,guideline_id,search_time,unitid,col_digit
		{name: 'templete_id', type: 'string'},
		{name: 'search_code', type: 'string'},
		{name: 'search_name', type: 'string'},
		{name: 'col_id', type: 'string'},
		{name: 'guideline_id', type: 'string'},
		{name: 'search_time', type: 'string'},
		{name: 'unitid', type: 'string'},
		{name: 'col_digit', type: 'string'},
		{name: 'col_zoom', type: 'string'}
	]);
	var datReader = new Ext.data.JsonReader({root:'rows',totalProperty:'totalCount'},datRs);
	//var datNm = new Ext.grid.RowNumberer();
	var datSm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	var datCm = new Ext.grid.ColumnModel([
		datSm,
		{id:'search_name',header:'书签名',dataIndex:'search_name'}
	]);
	var datDs = new Ext.data.Store({
		reader: datReader
    });
    
	var gridPanel = new Ext.grid.GridPanel({
		title:'书签',
        autoScroll:true,
        autoExpandColumn: 'search_name',
        store: datDs,
        cm: datCm,
        sm: datSm,
        tbar:[{id:'add',text:'新增',cls:'x-btn-text-icon',icon:'images/icons/toolbar_item_add.png',handler:addBK},
			{id:'edit',text:'编辑',cls:'x-btn-text-icon',icon:'images/icons/toolbar_item_edit.png',handler:editBK},
			{id:'del',text:'删除',cls:'x-btn-text-icon',icon:'images/icons/toolbar_item_del.png',handler:delBK}],
		bbar: new Ext.PagingToolbarEx({id:'mybbar',
			pageSize: 25,
			store: datDs
		}),
		buttons: [{text:'插入书签',handler:insertBookMark}],
		buttonAlign:'center'
	})
	function insertBookMark() {
		var r = gridPanel.getSelectionModel().getSelected()
		if(r) {
			docOcx.ActiveDocument.Application.Selection.TypeText(" ")
			var bknm = "x" + r.get('search_code') + "_" + (new Date()).getTime().toString(36)
			docOcx.ActiveDocument.Bookmarks.Add(bknm)
			docOcx.SetBookmarkValue(bknm, "[" + r.get('search_name') + "]")
			docOcx.ActiveDocument.Bookmarks(bknm).Select()
		}
		else {
			alert("请选择要插入的书签")
		}
	}
	
	var currentPage
	datDs.loadPage = function( n ) {
		var sql = "select search_code,search_name,col_id,guideline_id,search_time,unitid,col_digit,col_zoom"
				+ " from sgcc_bulletin_searchitem where templete_id='" + param.templet_id + "' order by search_code desc"
		db2Json.selectPageData(sql,n,25,function(dat){
			datDs.loadData({totalCount:dat[0],rows:eval(dat[1])})
			currentPage = n
		});
	}
	
	var bookmarkMode = "insert"
	var bookmarkID = ""

	function delBK() {
		var r = gridPanel.getSelectionModel().getSelected()
		if(r) {
			if(existsBookmark(r.get('search_code'))) {
				alert("该书签已被引用,不能删除")
			}
			else {
				db2Json.execute("delete from sgcc_bulletin_searchitem where templete_id='" + param.templet_id + "' and search_code='" + r.get('search_code') + "'",
								function(b){if(b)datDs.loadPage(currentPage)})
			}
		}
		else {
			alert("请选择要删除的记录")
		}
	}
	
	function editBK() {
		var r = gridPanel.getSelectionModel().getSelected()
		if(r) {
			east.setActiveTab(editPanel)
			bookmarkMode = "update"
			bookmarkID = r.get('search_code')
			db2Json.selectSimpleData("select f_inx_path('" + r.get('guideline_id') + "') from dual",function(dat){
				indexTree.collapseAll()
				var s = eval(dat)
				indexTree.expandPath('/0'+s[0][0],'id',function(t,n) {
					if(t) {
						indexTree.getSelectionModel().select(n)
					}
				});
			});
			nmField.setValue(r.get('search_name'))
			colBox.setValue(r.get('col_id'))
			corpBox.setValue(r.get('unitid'))
			dateBox.setValue(r.get('search_time').substring(0,2))
			if(r.get('search_time').length==4) {
				mBox.show()
    			mBox.setValue(r.get('search_time').substring(2,4))
			}
			else {
				mBox.hide()
			}
			num1Field.setValue(r.get('col_digit'))
			num2Field.setValue(r.get('col_zoom'))
			//editPanel.doLayout()
		}
		else {
			alert("请选择要编辑的记录")
		}
	}
	
	function addBK() {
		east.setActiveTab(editPanel)
		bookmarkMode = "insert"
		gridPanel.getSelectionModel().clearSelections()
		indexTree.getSelectionModel().clearSelections()
		nmField.reset()
		colBox.reset()
		corpBox.reset()
		dateBox.reset()
		mBox.hide()
		num1Field.reset()
		num2Field.reset()
		//editPanel.doLayout()
	}
	////////////////////
	var editPanel = new Ext.Panel({
		title:'编辑',
		layout:'border',
		items:[indexTree, fsf],
		buttons: [{text:'保存',handler:confirm},{text:'返回',handler:cancel}],
		buttonAlign:'center'
	})
	editPanel.on('activate',function(p){p.doLayout()})
	function confirm() {
		//nmField, colBox, corpBox, dateBox, num1Field, num2Field
		var inxNode = indexTree.getSelectionModel().getSelectedNode()
		if(!inxNode) {
			alert("请选择指标")
		}
		else if(nmField.isValid() && colBox.isValid() && corpBox.isValid() && dateBox.isValid()) {
			var str = "select search_code from sgcc_bulletin_searchitem"
					+ " where col_id='" + colBox.getValue() + "'"
					+ " and guideline_id='" + inxNode.id + "'"
					+ " and search_time='" + dateBox.getValue() + mBox.getValue() + "'"
					+ " and unitid='" + corpBox.getValue() + "'"
					+ (bookmarkMode=="insert"?"":" and search_code<>'" + bookmarkID + "'")
					+ " and templete_id='" + param.templet_id + "'"
			db2Json.selectSimpleData(str,function(dat){
				var s = eval(dat)
				if(s.length>0) {
					alert("相同的数据项已存在,无法保存")
				}
				else {
					var bkID
					var sql
					if(bookmarkMode=="insert") {
						bkID = getSN()
						sql = "insert into sgcc_bulletin_searchitem"
							+ " (templete_id,search_code,search_name,"
							+ " search_type,col_id,guideline_id,"
							+ " search_time,unitid,col_digit,col_zoom)"
							+ " values ('" + param.templet_id + "','" + bkID + "','" + nmField.getValue() + "',"
							+ "'1','" + colBox.getValue() + "','" + inxNode.id + "',"
							+ "'" + dateBox.getValue() + mBox.getValue() + "','" + corpBox.getValue() + "','" + num1Field.getValue() + "',"
							+ "'" + num2Field.getValue() + "')"
					}
					else if(bookmarkMode=="update"){
						bkID = bookmarkID
						sql = "update sgcc_bulletin_searchitem"
							+ " set search_name='" + nmField.getValue() + "',col_id='" + colBox.getValue() + "',guideline_id='" + inxNode.id + "',"
							+ " search_time='" + dateBox.getValue() + mBox.getValue() + "',unitid='" + corpBox.getValue() + "',col_digit='" + num1Field.getValue() + "',"
							+ " col_zoom='" + num2Field.getValue() + "'"
							+ " where templete_id='" + param.templet_id + "' and search_code='" + bkID + "'"
					}
					db2Json.execute(sql,function(b){
						if(b) {
							if(bookmarkMode=="insert") {
								datDs.loadPage(1)
								gridPanel.getBottomToolbar().cursor = 1
							}
							else if(bookmarkMode=="update"){
								datDs.loadPage(currentPage)
							}
							east.setActiveTab(gridPanel)
						}
					});
				}
			})
		}
	}
	function cancel() {
		east.setActiveTab(gridPanel)
	}
	
	var east = new Ext.TabPanel({
    	id: 'east',
    	region: 'east',
    	contentEl: 'east',
    	title:'&nbsp;',
    	split:true,
		width: 280,
		minSize: 260,
		maxSize: 380,
		collapsible: true,
		//collapsed: true,
		margins:'0 0 0 0',
		activeTab: 0,
		//tabPosition:'bottom',
		//layout:'border',
		items:[ gridPanel, editPanel ]
    });
    
    var viewport = new Ext.Viewport({
		layout:'border',
		items:[east,container]
	});
	//east.hideTabStripItem(0)
	east.hideTabStripItem(1)
	//////////////////////////////////////////////////
	function init(){
		docOcx = document.all('TANGER_OCX')
		if(param.file_id=="") {
			docOcx.CreateNew("PowerPoint.Show")
		}
		else {
			try {
				docOcx.OpenFromURL("<%=path%>/filedownload?method=fileDownload&id=" + param.file_id)
			}
			catch(ex){
				docOcx.CreateNew("PowerPoint.Show")
				param.file_id = ""
			}
		}
		docOcx.AddCustomMenu2(1, "时间标签(D)")
		docOcx.AddCustomMenuItem2(1, 1, -1, false, "  年度(Y)        ", false)
		docOcx.AddCustomMenuItem2(1, 2, -1, false, "  月度(M)        ", false)
		
		db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit start WITH unitid='<%=unitID%>' CONNECT BY PRIOR unitid=upunit order by view_order_num",
			function(dat){
				corpStore.loadData(eval(dat))
			});
		db2Json.selectSimpleData("select property_code,property_name,detail_type from property_code where type_name='REPORT_COL' order by item_id",
			function(dat){
				colStore.loadData(eval(dat))
			});
		db2Json.selectSimpleData("select property_code,property_name,detail_type from property_code where type_name='REPORT_DATE' order by item_id",
			function(dat){
				dateStore.loadData(eval(dat))
			});
		datDs.loadPage(1)
	}
	init()
	//////////////////////////////////////////////////
});

function existsBookmark(bknm) {
	var bks = docOcx.ActiveDocument.Bookmarks
	for(var i=1;i<=bks.Count;i++) {
		if(bks(i).Name.indexOf(bknm)>-1) {
			return true
		}
	}
	return false
}
</script>


<SCRIPT language="JScript" for="TANGER_OCX" event="OnFileCommand(cmd,cancel)">
	if(cmd==3) {
		docOcx.CancelLastCommand = true
		var h = docOcx.SaveToURL("<%=path%>/Business/jsp/common/templet/docTempletUpload.jsp?tmpid="+param.templet_id+"&fileid="+param.file_id,"docTemplet", "", param.template_name + ".ppt" ,"docFrm")
		if(h.indexOf("true")>-1) {
			alert("保存成功！")
		}
		window.returnValue = true
	}
</SCRIPT>

<SCRIPT language="JScript" for="TANGER_OCX" event="OnCustomMenuCmd2(menuPos, submenuPos, subsubmenuPos, menuCaption, myMenuID)">
	var dateStr = ""
	switch(submenuPos) {
		case 1:
			dateStr = "YYYY"
			break
		case 2:
			dateStr = "MM"
			break
	}
	docOcx.ActiveDocument.Application.Selection.TypeText(" ")
	var bknm = "d" + dateStr + "_" + (new Date()).getTime().toString(36)
	docOcx.ActiveDocument.Bookmarks.Add(bknm)
	docOcx.SetBookmarkValue(bknm, "[" + dateStr + "]")
	docOcx.ActiveDocument.Bookmarks(bknm).Select()
</SCRIPT>