<%@ page language="java" pageEncoding="UTF-8"%>
<!-- 父页面需要传3个参数 -->
<!-- 1)fileType:文件类型, 对应attachlist表中的transaction_Type-->
<!-- 2)filePK:业务ID-->
<!-- 3)fileDept:部门岗位编号(如果没有这个参数，就不用选择报告类型) -->
<!-- 4)fileEditable:是否可编辑 -->
<!-- 5)editable:是否有工具栏（默认有） -->
<!-- 6)reportType:报告类型 -->
<!-- 7)filesource:上传方式ftp/blob(默认blob) -->
<!-- 8)compress:是否压缩（默认1压缩） -->
<%
	String _fileType = (String)request.getParameter("fileType");
	String _filePK = (String)request.getParameter("filePK");
	String _fileDept = request.getParameter("fileDept")==null?"":(String)request.getParameter("fileDept");
	String _fileEditable = (String)request.getParameter("fileEditable");
	String _editable = (String)request.getParameter("editable")==null?"true":(String)request.getParameter("editable");
	String _reportType = (String)request.getParameter("reportType")==null?"":(String)request.getParameter("reportType");
	String _filesource = request.getParameter("filesource")==null?"blob":request.getParameter("filesource");
	String _compress = request.getParameter("compress")==null?"1":request.getParameter("compress");
%>
<html>
	<head>
		<title>文件上传</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script src='dwr/interface/fileServiceImpl.js'></script>
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/engine.js'></script>
	</head>
	<body>
	<form action="" id="formAc" method="post" name="formAc" TARGET="frm" >
    </form>
   <iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
	</body>
</html>
<script>
	var path = '<%=path %>';
	var _fileType = '<%=_fileType%>';
	var _filePK = '<%=_filePK%>';
	var _fileDept = '<%=_fileDept%>';
	var _fileEdit = '<%=_fileEditable%>';
	var _editable = '<%=_editable%>';
	var _reportType = '<%=_reportType%>';
	var _fileDate
	var _filesource = '<%=_filesource %>'
	var _compress = '<%=_compress %>'
	
	//模板按钮是否显示
	var _templetBtnDisplay=true;
	var grid;
	var uploadWin
	var templetWin
Ext.onReady(function(){
	var rs = Ext.data.Record.create([
		{name: 'file_lsh', type: 'string'},
		{name: 'file_name', type: 'string'},
		{name: 'unitname', type: 'string'},
		{name: 'unitid', type: 'string'},
		{name: 'template_id', type: 'string'}
	]);
	var reader = new Ext.data.JsonReader({},rs);
	
	var nm = new Ext.grid.RowNumberer();
	
	var cm = new Ext.grid.ColumnModel([
		nm,//sm,
		{id:'file_name',header:'文件名',dataIndex:'file_name',width:160,renderer:fileStyle},
		{id:'unitname',header:'报告类型',dataIndex:'unitname'}
	]);
	
	function fileStyle( v, m, d, r, c, s ) {
		return "<u style='cursor:hand;'><a onclick=downloadFile('" + d.get('file_lsh') + "');return false;><font color=blue>"+ v +"</font></a></u>";
		//return "<a style='color:black' onclick=downloadFile('"+d.get('file_lsh')+"')>" + v + "</a>"
	}
	
	var ds = new Ext.data.Store({
		reader: reader
    });
   
	var addFileBtn = new Ext.Toolbar.Button({
			id: 'add',
			text: '新增',
			cls: 'x-btn-text-icon',
			icon: BASE_PATH+'jsp/res/images/toolbar/toolbar_item_add.png',
			handler: onFileItemClick
	});
	var templetBtn = new Ext.Toolbar.Button({
			id: 'templet',
			text: '模板',
			cls: 'x-btn-text-icon',
			icon: BASE_PATH+'jsp/res/images/toolbar/toolbar_item_link.png',
			hidden:_templetBtnDisplay,
			handler: onFileItemClick
	});
	var editFileBtn = new Ext.Toolbar.Button({
			id: 'edit',
			text: '编辑',
			cls: 'x-btn-text-icon',
			icon: BASE_PATH+'jsp/res/images/toolbar/toolbar_item_edit.png',
			handler: onFileItemClick
	});
	var delFileBtn = new Ext.Toolbar.Button({
			id: 'del',
			text: '删除',
			cls: 'x-btn-text-icon',
			icon: BASE_PATH+'jsp/res/images/toolbar/toolbar_item_delete.png',
			handler: onFileItemClick
	});
    var tfilebar = new Ext.Toolbar({items:[ addFileBtn, '  ', templetBtn, '  ', editFileBtn, '  ', delFileBtn ]})
	grid = new Ext.grid.GridPanel({
		id: 'fileGrid',
		store: ds,
		cm: cm,
		autoExpandColumn:'file_name',
		selModel: new Ext.grid.RowSelectionModel(),
		tbar: tfilebar,
		border:false
	});
	if(_editable=='false'){
		addFileBtn.hide();
		templetBtn.hide();
		editFileBtn.hide();
		delFileBtn.hide();
	}
	
	 var viewport = new Ext.Viewport({
        layout:'fit',
        items:[ grid ]
    });
    
	grid.getSelectionModel().on('rowselect',function(s,i,r) {
		if(_fileEdit && r.get('file_name').indexOf(".doc")>-1) {
			editFileBtn.enable()
		}
		else {
			editFileBtn.disable() 
		}
	})
	
	function openUploadWin() {
		uploadWin = new Ext.Window({
			id: 'uploadWin',
			title: '文件上传',
			width: 320,
			height: 120,
			//border: false,
			modal: true,
			shim: true,
			html: '<iframe name="fileFrm" src="'+BASE_PATH+'Business/jsp/common/file/fileupload.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>',
			buttons: [{text:'上传',handler:fileSubmit},{text:'关闭',handler:closeUploadWin}],
	       	buttonAlign:'center'
		});
		uploadWin.show()
	}
	
	function openTempletWin() {
		templetWin = new Ext.Window({
			id: 'templetWin',
			title: '选择模板',
			width: 320,
			height: 120,
			//border: false,
			modal: true,
			shim: true,
			html: '<iframe name="templetFrm" src="'+BASE_PATH+'Business/jsp/common/file/fileTemplet.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>',
			buttons: [{text:'确定',handler:openTemplet},{text:'关闭',handler:closeTempletWin}],
	       	buttonAlign:'center'
		});
		templetWin.show()
	}			
	
	function onFileItemClick(item) {
		switch(item.id) {
			case 'add':
				openUploadWin()
				break
			case 'templet':
				openTempletWin()
				break
			case 'del':
				delFile()
				break
			case 'edit':
				editFile()
				break;
		}
	}
	
	function showFileWin( p_type, p_id, p_b, p_dept, p_date) {
		_fileType = p_type    
		_filePK = p_id         
		_fileDept = p_dept    
		_fileDate = p_date     
		_fileEdit = p_b    
		loadFileGrid()
		if(p_b) {
			grid.getTopToolbar().enable()
		}
		else {
			grid.getTopToolbar().disable()
		}
	}
	
	
	
	function fileSubmit() {
		window.frames["fileFrm"].doSubmit()
	}
	
	
	function openTemplet() {
		var frm = window.frames["templetFrm"]
		if(frm.docTemplet.value=="") {
			alert("请选择模板")
		}
		else if(frm.fileName.value=="") {
			alert("文件名不能为空")
		}
		else {
			var param = new Object()
			param.date = _fileDate
			param.templet_id = frm.docTemplet.value
			param.file_id = ""
			param.file_name = frm.fileName.value
			param.file_pk = _filePK
			param.file_type = _fileType
			param.file_dept = _fileDept
			param.upper = ""
			closeTempletWin()
			window.showModalDialog(BASE_PATH+"Business/jsp/common/templet/docView.jsp", param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;" )
			loadFileGrid()
		}
	}
	
	function editFile() {
		var r = grid.getSelectionModel().getSelected()
		if(r) {
			var param = new Object()
			param.date = _fileDate
			param.templet_id = r.get('template_id')
			param.file_id = r.get('file_lsh')
			param.file_name = r.get('file_name')
			param.file_pk = _filePK
			param.file_type = _fileType
			param.file_dept = _fileDept
			param.upper = r.get('unitid')
			window.showModalDialog(BASE_PATH+"Business/jsp/common/templet/docView.jsp", param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;" )
			loadFileGrid()
		}
		else {
			alert("请选择需要编辑的文档")
		}
	}
	
	function closeTempletWin() {
		templetWin.close()
	}
	
	function delFile() {
		var arr = grid.getSelectionModel().getSelections()
		if(arr.length && confirm("确认删除已选中的文件？")) {
			var  sql = ""
			var fileIDs = "";
			for(var i=0;i<arr.length;i++) {
				fileIDs+="'"+arr[i].get('file_lsh')+"'"
				if(i<arr.length-1) fileIDs+=",";
			}
			DWREngine.setAsync(false);	
			fileServiceImpl.deleteAttachList(fileIDs, "",function(b){
				if(b) {
					loadFileGrid()
				}
			});	
		    DWREngine.setAsync(true);
		}
	}
	showFileWin(_fileType,_filePK,_fileEdit,_fileDept)
	
});

function downloadFile(val){
	var openUrl = CONTEXT_PATH + "/filedownload?&method=fileDownload&id=" + val +"&filesource="+ _filesource + "&compress=" + _compress;
	document.all.formAc.action =openUrl
	document.all.formAc.submit()	
}

function loadFileGrid() {
	var fileDeptThis 
	if(_fileDept == "all")
	{
		fileDeptThis = ""
	} else
	{
		fileDeptThis = _fileDept
	}
	
	DWREngine.setAsync(false);	
	var report = "报告类型";
	if(_reportType=="PRJ_RESULT"){
		report = "研究成果报告类型"
	}
	fileServiceImpl.getAttachListToString(report,_fileType,_filePK, function(dat){
		var ds = grid.getStore()
		ds.loadData(eval(dat),false)
	});	
    DWREngine.setAsync(true);
    
}
function closeUploadWin() {
	uploadWin.close()
}
</script>