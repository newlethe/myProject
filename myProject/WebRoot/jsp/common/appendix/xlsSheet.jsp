<%@ page language="java" pageEncoding="utf-8"%>
<!-- @author:guox  -->
<html>
	<head>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>报表表页</title>
		
		<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css" />
	 	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
	    <script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script>
		
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/xlsUtil.js'></script>
	<body topmargin=0 leftmargin=0 rightmargin=0 scroll=no>
		<div id="west"></div>
		<div id="center">
			<form name="docFrm">
				<object id="TANGER_OCX" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
					codebase="<%=basePath%><%=Constant.NTKOCAB%>" width="100%" height="100%">
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
	</body>
</html>

<script type="text/javascript">
var param = window.dialogArguments
var unitID = UNITID;
var defaultParentId = '<%= Constant.APPOrgRootID %>';
var defaultParentName = '<%= Constant.APPOrgRootNAME %>';

var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=tree";
if((ROLETYPE != '0') ){
	treeNodeUrl = treeNodeUrl +"&attachUnit=" + UNITID;
}
if(typeof(year)!='undefined'&& year !=''){
	treeNodeUrl += "&year="+year;
}

Ext.onReady(function(){
	
	treeLoader = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl + "&parentId=0&treeName=SysOrgTree",
		requestMethod: "GET"
	});
	
	var orgTree = new Ext.tree.TreePanel({
		id: 'tree1',
		region: 'center',
		rootVisible:false,
		margins:'0 0 0 0',
        autoScroll:true,
        border: false,
        loader: treeLoader,
        root: new Ext.tree.AsyncTreeNode({
            text: 'root',
            id: '0',
            expanded: true
        })
	});
	
	orgTree.on('beforeload', function(node){ 
		orgTree.loader.dataUrl = treeNodeUrl+"&parentId="+node.id+"&treeName=SysOrgTree"; 
	});
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
	orgTree.on('click',function (n,e){
		ds.rejectChanges()
		sm.clearSelections()
		xlsUtil.getDeptSheet( param.sj_type, n.id, function(dat){
			//excel表页设置
			signSheet( n.id, dat )
			//grid设置
			var rs = new Array()
			var sheets = dat.split("/")
			for(var i=1;i<sheets.length;i++) {
				var s = sheets[i].split("*")
				var rec = ds.getAt(ds.find('sheetname',s[0]))
				rec.set('row_id', s[1])
				rs.push(rec)
			}
			sm.selectRecords(rs)
		})
    })
    //////////////////////////////////////////////////
	//////////////////////////////////////////////////
	var rs = Ext.data.Record.create([
		{name: 'sheetname', type: 'string'},
		{name: 'row_id', type: 'string'}
	]);
	var reader = new Ext.data.ArrayReader({},rs);
	//checkbox column
	var sm = new Ext.grid.CheckboxSelectionModel();
	
	//row index column
	//var nm = new Ext.grid.RowNumberer();
	var cm = new Ext.grid.ColumnModel([
		//nm,
		sm,
		{id:'sheetname',header:'表页名',dataIndex:'sheetname'},
		{id:'row_id',header:'行号(0表示参考页)',dataIndex:'row_id', editor:new Ext.form.TextField()}
	]);
	var ds = new Ext.data.Store({
		reader: reader
    })
    
	var sheetPanel = new Ext.grid.EditorGridPanel({
		id: 'sheetPanel',
		region: 'south',
		//margins:'0 0 0 0',
        autoScroll:true,
        border: false,
        split:true,
        collapsible: true,
        height: 400,
        title:'&nbsp;',
        store: ds,
		cm: cm,
		sm:sm,
		autoExpandColumn:'row_id',
		buttons: [{text:'保存',handler:save}],
		buttonAlign:'center'
	});

	var west = new Ext.Panel({
		id: 'west',
    	region: 'west',
    	contentEl: 'west',
    	title:'&nbsp;',
    	split:true,
		width: 320,
		minSize: 260,
		maxSize: 380,
		collapsible: true,
		//collapsed: true,
		margins:'0 0 0 0',
		layout:'border',
		items:[orgTree,sheetPanel]
	});

	var container = new Ext.Panel({
		region: 'center',
		contentEl: 'center',
		//title: '&nbsp;',
		border: false
	});
	
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[west,container]
	});
	
	function save() {
		if(!orgTree.getSelectionModel().getSelectedNode()) {
			alert("请选择部门！")
			return
		}
		var str = ""
		var rs = sm.getSelections()
		var dept_id = orgTree.getSelectionModel().getSelectedNode().id
		for(var i=0;i<rs.length;i++) {
			str += "/" + rs[i].get('sheetname') + "*" + rs[i].get('row_id')
		}
		xlsUtil.setDeptSheet(param.id, orgTree.getSelectionModel().getSelectedNode().id , str, function(b) {
			if(b) {
				alert("保存成功！")
				signSheet( dept_id, str )
			}
			else {
				alert("保存失败！")
			}
		})
	}
	
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
	xlsOcx = document.all('TANGER_OCX')
	xlsOcx.OpenFromURL("<%=path%>/xlsUtil?type=download&pk="+param.file_lsh)
	
	var worksheets = xlsOcx.ActiveDocument.Worksheets
	var dat = ""
	for(var s=1;s<=worksheets.count;s++) {
		if(dat=="") {
			dat += "['" + worksheets(s).Name + "']"
		}
		else {
			dat += ",['" + worksheets(s).Name + "']"
		}
	}
	dat = "[" + dat + "]"
	ds.loadData(eval(dat))
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
	function signSheet(corpID, dat) {
		var ws = xlsOcx.ActiveDocument.Application.ActiveWorkbook.Worksheets
		var s = dat.split("/")
		for(var i=1;i<s.length;i++) {
			var r = s[i].split("*")
			ws(r[0]).Visible = true
			if(r[1]!="") {
				ws(r[0]).Cells.Font.ColorIndex = 15
				if(r[1]!="0") {
					try {
						ws(r[0]).Range(r[1]).Font.ColorIndex = 1
					}
					catch(ex) {
						alert("行号定义错误！")
					}
				}
			}
			else {
				ws(r[0]).Cells.Font.ColorIndex = 1
			}
		}
		for(var i=1;i<=ws.Count;i++) {
			if(corpID==unitID || dat=="" || dat.indexOf("/" + ws(i).Name + "*")>-1) {
				ws(i).Visible = true
			}
			else {
				ws(i).Visible = false
			}
		}
	}
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
});

</SCRIPT>