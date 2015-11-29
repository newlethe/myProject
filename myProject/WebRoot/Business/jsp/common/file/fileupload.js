var extFileWin
var _fileType
var _filePK
var _fileDept
var _fileDate
var _fileEdit
var _reportType //报告类型
var _filesource
//模板按钮是否显示
var _templetBtnDisplay=true;

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
		return "<a style='color:black' href='"+BASE_PATH+"filedownload?method=fileDownload&id="+d.get('file_lsh')+"'>" + v + "</a>"
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
	var grid = new Ext.grid.GridPanel({
		id: 'fileGrid',
		store: ds,
		cm: cm,
		autoExpandColumn:'file_name',
		selModel: new Ext.grid.RowSelectionModel(),
		tbar: tfilebar,
		border:false
	});
	grid.getSelectionModel().on('rowselect',function(s,i,r) {
		if(_fileEdit && r.get('file_name').indexOf(".doc")>-1) {
			editFileBtn.enable()
		}
		else {
			editFileBtn.disable() 
		}
	})
	
	extFileWin = new Ext.Window({
        title: '&nbsp;',
        width: 500,
        height:360,
        minWidth: 300,
        minHeight: 200,
        layout: 'fit',
        plain: true,
        closeAction: 'hide',
        modal: true,
        items: [grid],
        buttonAlign: 'center',
        buttons: [{text:'关闭',handler:closeFileWin}]
    });
    //extFileWin.on('show',loadGrid)
});

function closeFileWin() {
	try{
		closeShowFileWinFun()
	} catch(e){
	}
	extFileWin.hide()
	
}

var uploadWin
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

var templetWin
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

function showFileWin( p_type, p_id, p_b, p_dept, p_date,p_fileType) {
	_fileType = p_type    //文件类型, 对应attachlist表中的transaction_Type
	_filePK = p_id        //业务ID 
	_fileEdit = p_b		  //文件是否可编辑
	_fileDept = p_dept    //部门岗位编号(如果没有这个参数，就不用选择报告类型)
	_fileDate = p_date    //时间
	_reportType = p_fileType //报告类型分类
	loadFileGrid()
	extFileWin.show()
	if(p_b) {
		Ext.getCmp('fileGrid').getTopToolbar().enable()
	}
	else {
		Ext.getCmp('fileGrid').getTopToolbar().disable()
	}
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
	fileServiceImpl.getAttachListToString(_reportType,_fileType,_filePK, function(dat){
		var ds = Ext.getCmp('fileGrid').getStore()
		ds.loadData(eval(dat),false)
	});	
    DWREngine.setAsync(true);
    
}

function fileSubmit() {
	window.frames["fileFrm"].doSubmit()
}

function closeUploadWin() {
	uploadWin.close()
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
	var r = Ext.getCmp('fileGrid').getSelectionModel().getSelected()
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
	var arr = Ext.getCmp('fileGrid').getSelectionModel().getSelections()
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