<%@ page language="java" pageEncoding="GBK"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
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
		<title>WORDģ��鿴</title>
		
		<!-- link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css" />
	 	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
	    <script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script -->
	    
	    <script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/docData.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		
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
		<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
			<tr><td id="tab1" width="100%">
			<form name="docFrm">
				<object id="TANGER_OCX" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
					codebase="<%=basePath%><%=Constant.NTKOCAB%>" width="100%" height="100%">
					<param name="Menubar" value="-1">
					<param name="Titlebar" value="0">
					<param name="IsShowToolMenu" value="-1">
					<param name="IsHiddenOpenURL" value="0">
					<param name="IsUseUTF8URL" value="-1">
					<%=Constant.NTKOCOPYRIGHT%>
					<SPAN STYLE="color:red"><br>����װ���ĵ��ؼ������ڼ���������ѡ���м��������İ�ȫ���á�</SPAN>
				</object>
			</form>
			</td>
			<td id="tab2" width="">
			<object id="TANGER_OCX1" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
				codebase="<%=basePath%><%=Constant.NTKOCAB%>" width="100%" height="100%"><param name="Menubar" value="0">
				<param name="Menubar" value="0">
				<param name="FileSave" value="0">
				<param name="Titlebar" value="0">
				<param name="IsShowToolMenu" value="-1">
				<param name="IsHiddenOpenURL" value="0">
				<param name="IsUseUTF8URL" value="-1">
				<%=Constant.NTKOCOPYRIGHT%>
				<SPAN STYLE="color:red"><br>����װ���ĵ��ؼ������ڼ���������ѡ���м��������İ�ȫ���á�</SPAN>
			</object>
			</td></tr>
		</table>
		<IFRAME ID="loadingFrm" style="POSITION:absolute;LEFT:100px;TOP:100px;WIDTH:56px;HEIGHT:58px;display:none"
				src="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/images/default/shared/large-loading.gif" 
				frameBorder="0" scrolling="no"></IFRAME>
	</body>
</html>

<script type="text/javascript">
var docOcx,docOcx1
var param = window.dialogArguments
var unitID = "<%=unitID%>"
window.onload = init
window.onbeforeunload = closeWin
window.onerror = function(){return true}
var docPos = new Object()
var deptPos = new Object()
var chartComment = "";
function init() {
	docOcx = document.all('TANGER_OCX')
	docOcx1 = document.all('TANGER_OCX1')
	if(param.file_id && param.file_id!="") {
		docOcx.OpenFromURL("<%=path%>/filedownload?method=fileDownload&id=" + param.file_id)
	}
	else {
		db2Json.selectSimpleData("select file_lsh from sgcc_analyse_report_template where template_id='" + param.templet_id + "'",function (dat){
			var s = eval(dat)
			docOcx.OpenFromURL("<%=path%>/filedownload?method=fileDownload&id=" + s[0][0])
		})
	}
	try{
		docOcx1.CreateNew("Word.Document")
	}catch(ex){
		docOcx1.CreateNew("Wps.Document")
		/*try{
			docOcx1.CreateNew("Wps.Document")
		}catch(e){
			
		}*/
		
	}
	
	docOcx.AddCustomMenu2(1, "�ĵ�����(D)")
	docOcx.AddCustomMenuItem2(1, 0, -1, false, "  ������ȡ(P)        ", false)
	docOcx.AddCustomMenuItem2(1, 1, -1, false, "  �����л�(W)        ", false)
	if((!param.templet_id || param.templet_id=="") || (!param.date || param.date=="") ) {
		docOcx.EnableCustomMenuItem2(1, 0, -1, false)
	}
	docOcx.AddCustomMenuItem2(1, 2, -1, true, "  �ο��ĵ�(R)        ", false)
	//////////////////////////////////////////////////
	var sql = "select file_lsh,decode(unitName,null,'','['||unitName||']')||file_name from sgcc_attach_list,sgcc_ini_unit"
			+ " where sgcc_attach_list.dept_id=sgcc_ini_unit.unitID(+)"
			+ " and (NLS_LOWER(file_name) like '%.doc%' or NLS_LOWER(file_name) like '%.xls%')"
			+ " and TRANSACTION_ID='" + param.file_pk + "'"
	if(param.file_dept) {
		sql += " and dept_id='" + param.file_dept + "'"
	}
	sql += " order by unitName"
	db2Json.selectSimpleData(sql,function (dat){
		var s = eval(dat)
		for(var i=0;i<s.length;i++) {
			docOcx.AddCustomMenuItem2(1, 2, i , false, "  " + s[i][1] + "  ", false)
			docPos[i] = s[i][0]
		}
	});
	//////////////////////////////////////////////////
	if(param.file_dept) {
		/*docOcx.AddCustomMenu2( 2, "���ʱ�ʡ��˾���š�")
		docOcx.AddCustomMenuItem2(1, 3, -1, true, "  ʡ��˾����(S)     ", false)
		//db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit where upunit=(select upunit from sgcc_ini_unit where unitid='" + unitID + "') and unit_type_id='0' order by view_order_num",function (dat){
		db2Json.selectSimpleData("select property_code as unitid,property_name as unitname from property_code where type_name='רҵ�������' order by property_code",function (dat){
			var s = eval(dat)
			for(var i=0;i<s.length;i++) {
				docOcx.AddCustomMenuItem2(1, 3, i , false, " " + s[i][1] + " ", false)
				deptPos[i] = s[i][0]
			} 
		});*/
	}
}

function replaceBookmark() {
	var loadingFrm = window.frames["loadingFrm"].frameElement
	loadingFrm.style.left = document.body.clientWidth/2
	loadingFrm.style.top = document.body.clientHeight/2
	loadingFrm.style.display = ""
	
	var str = "";
	var bks = docOcx.ActiveDocument.Bookmarks
	var y="",m="",q=""
	y = param.date.substring(0,4)
	if(param.date.length==6) {
		if(param.date.indexOf("Q")==-1) {
			m = param.date.substring(4,6)
		}
		else {
			q = param.date.substring(4,5)
		}
	}
	setExcelChartDate(y,m);
	for(var i=1;i<=bks.Count;i++) {
		if(bks(i).Name.indexOf("x")==0) {
			if(str=="") {
				str = bks(i).Name
			}
			else {
				str += ";" + bks(i).Name
			}
		}
		else if(bks(i).Name.indexOf("dYYYY")==0) {
			//docOcx.SetBookmarkValue(bks(i).Name, y)
			SetBookmarkValue(bks(i).Name, y)
		}
		else if(bks(i).Name.indexOf("dMM")==0) {
			//docOcx.SetBookmarkValue(bks(i).Name, m)
			SetBookmarkValue(bks(i).Name, m)
		}
		
		/*else if(bks(i).Name.indexOf("dQ")==0) {
			docOcx.SetBookmarkValue(bks(i).Name, q)
		}*/
	}
	if(str != ""){
		str += ";" + chartComment
	}else{
		str = chartComment
	}
	if(str!="") {
		docData.selectData(param.date, str, function(dat) {
			var ds = eval('('+dat+')')
			for(c in ds) {
				if(c.indexOf('x') == 0)
					SetBookmarkValue(c,ds[c])
			}
			setExcelChartData(ds)
			if(dat != '{}') {
				alert("������ȡ��ϣ�")
			}else {
				alert("û����Ҫ�滻�����ݣ�")
			}
			loadingFrm.style.display = "none"
		});
	}
	else {
		loadingFrm.style.display = "none"
	}
	
}

function SetBookmarkValue( bknm, bkvl ) {
	var range = docOcx.ActiveDocument.Bookmarks(bknm).Range
	range.Text = bkvl
	docOcx.ActiveDocument.Bookmarks.Add(bknm,range)
	
}

function closeWin() {
	if(docOcx.ActiveDocument && !docOcx.ActiveDocument.Saved && confirm("�Ƿ񱣴���ļ��ĸ��ģ�")) {
		saveDoc()
		return ""
	}
}

function saveDoc() {
	//var fileName = prompt("�����ĵ�����",param.file_name)
	var fileName = param.file_name
	if(!fileName || fileName=="") {
		alert("�ļ�������Ϊ��")
		return
	}
	else if(fileName.toLowerCase().indexOf(".doc")==-1) {
		if(fileName.toLowerCase().indexOf(".wps")==-1){
			if(docOcx1.ActiveDocument == '�� NTKOOFFICE�ؼ� �е� WPS�ĵ�'){
				fileName = fileName + ".wps"
			}else{
				fileName = fileName + ".doc"
			}
		}
	}
	var paramStr = "tmpid=" + param.templet_id 
				+ "&fileid=" + param.file_id
				+ "&pk=" + param.file_pk
				+ "&type=" + param.file_type
				+ "&dept=" + param.file_dept
				+ "&upper=" + param.upper
	var h = docOcx.SaveToURL("<%=path%>/fileupload?" + paramStr, "docFile", "", fileName , "docFrm")
	if(h.indexOf("true")>-1) {
		param.file_id = h.substring(h.indexOf("true")+4,h.indexOf("<script>"))
		alert("����ɹ���")
	}
}



//�滻ͼ���������
function setExcelChartDate(y,m){
	var shapes= docOcx.ActiveDocument.InlineShapes ;
	var count = shapes.Count
	//û��ͼ��ͷ���
	if(count == 0){
		return ;
	}else{
		for(var i=1;i<=count;i++){
			var shape = docOcx.ActiveDocument.InlineShapes(i)
			//�ж�ole�����Ƿ���ͼ��
			if(shape.type == 1 && shape.OLEFormat.ProgId.substr(0, 12) == "Excel.Chart."){
				shape.OLEFormat.Activate()
				//��ȡexcel��comments
				var comments = shape.OLEFormat.Object.Application.Sheets(2).Comments;
				for(var j=1;j<=comments.Count;j++){
					var c = comments(j);
					//��comments��Ӧ�ĵ�Ԫ��������滻Ϊ���
					if(c.Text() == "YYYY"){
						c.Parent.Value = y;
					}else if(c.Text() == "MM"){
						c.Parent.Value = m;
					}else{
						//��coments��Ϊʱ��˵������ָ�� ���ｫָ����֯��׼�������̨�Ի�ȡֵ�� �����ﴦ����Ϊ�˱����ٺ����ֱ���һ��comments
						if(chartComment != ""){
							chartComment += ";"+c.Text()
						}else{
							chartComment += c.Text()
						}
					}
				}
			}
		}
	}
	
}
//�滻ͼ���������
function setExcelChartData(ds){
	var map = ds
	var shapes= docOcx.ActiveDocument.InlineShapes ;
	var count = shapes.Count
	if(count == 0){
		return ;
	}else{
		for(var i=1;i<=count;i++){
			var shape = docOcx.ActiveDocument.InlineShapes(i)
			if(shape.type == 1 && shape.OLEFormat.ProgId.substr(0, 12) == "Excel.Chart."){
				shape.OLEFormat.Activate()
				var comments = shape.OLEFormat.Object.Application.Sheets(2).Comments;
				//��comments��Ӧ�ĵ�Ԫ����������
				for(var j=1;j<=comments.Count;j++){
					var c = comments(j)
					if(c.Text() != "YYYY" && c.Text()!="MM")
					c.Parent.Value = map[c.Text()]
				}
			}
		}
	}
	
}
</script>

<SCRIPT language="JScript" for="TANGER_OCX" event="OnFileCommand(cmd,cancel)">
	if(cmd==3) {
		docOcx.CancelLastCommand = true
		saveDoc()
	}
</SCRIPT>

<SCRIPT language="JScript" for="TANGER_OCX" event="OnCustomMenuCmd2(menuPos, submenuPos, subsubmenuPos, menuCaption, myMenuID)">
	switch(submenuPos) {
		case 0:
			replaceBookmark()
			break
		case 1:
			if(tab2.width == "") {
				tab1.width = "60%"
				tab2.width = "40%"
			}
			else {
				tab1.width = "100%"
				tab2.width = ""
			}
			break
		case 2:
			docOcx1.OpenFromURL("<%=path%>/filedownload?method=fileDownload&id=" + docPos[subsubmenuPos])
			tab1.width = "60%"
			tab2.width = "40%"
			break
		case 3:
			docOcx1.RemoveCustomMenu2(2)
			docOcx.AddCustomMenu2( 2, "���ʱ�ʡ��˾����:" + menuCaption + "��")
			param.upper = deptPos[subsubmenuPos]
			break
	}
</SCRIPT>

