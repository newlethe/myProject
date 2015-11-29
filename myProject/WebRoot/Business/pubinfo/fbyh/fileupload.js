var extFileWin
var _fileType
var _filePK
var _fileDept
var _fileDate
var _fileEdit

Ext.onReady(function(){
	var rs = Ext.data.Record.create([
		{name: 'file_lsh', type: 'string'},
		{name: 'file_name', type: 'string'},
		//{name: 'dept_id', type: 'string'},
		{name: 'memo', type: 'string'},
		{name: 'template_id', type: 'string'}
	]);
	var reader = new Ext.data.JsonReader({},rs);
	
	//checkbox column
	//var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	//row index column
	var nm = new Ext.grid.RowNumberer();
	
	var cm = new Ext.grid.ColumnModel([
		nm,//sm,
		{id:'file_name',header:'文件名',dataIndex:'file_name',width:50,renderer:fileStyle},
		//{id:'dept_id',header:'版本号',dataIndex:'dept_id'},
		{id:'memo',header:'附件说明',dataIndex:'memo'}
	]);
	
	function fileStyle( v, m, d, r, c, s ) {
		return "<a style='color:black' href='frame/filedownload?id="+d.get('file_lsh')+"'>" + v + "</a>"
	}
	
	var ds = new Ext.data.Store({
		reader: reader
    });
   
	var addFileBtn = new Ext.Toolbar.Button({
			id: 'add',
			text: '新增',
			cls: 'x-btn-text-icon',
			icon: 'jsp/res/images/icons/basket_add.png',
			handler: onFileItemClick
	});
	var delFileBtn = new Ext.Toolbar.Button({
			id: 'del',
			text: '删除',
			cls: 'x-btn-text-icon',
			icon: 'jsp/res/images/icons/basket_delete.png',
			handler: onFileItemClick
	});
    var tfilebar = new Ext.Toolbar({items:[ addFileBtn, '  ', delFileBtn ]})
	var grid = new Ext.grid.GridPanel({
		id: 'fileGrid',
		store: ds,
		height:220,
		cm: cm,
		autoExpandColumn:'file_name',
		selModel: new Ext.grid.RowSelectionModel(),
		tbar: tfilebar,
		region: 'north'
		//border:false
	});

	var bookTplMarkup = [
		'附件说明: <br/>{memo}'
	];
	var bookTpl = new Ext.Template(bookTplMarkup);
	
	extFileWin = new Ext.Window({
        title: '&nbsp;',
		frame: true,
		width: 540,
		height: 400,
		layout: 'border',        
        minWidth: 300,
        minHeight: 200,
        hidden:true,
    //  layout: 'fit',
    //	plain: true,
        closeAction: 'hide',
        modal: true,
        items: [grid,	{
				id: 'detailPanel',
				region: 'center',
				bodyStyle: {
					background: '#ffffff',
					padding: '7px'
				},
				html: '请选择需要查看的附件说明'
			}],
        buttonAlign: 'center',
        buttons: [{text:'关闭',handler:closeFileWin}]
    });

    extFileWin.on('show',function(){
    	    extFileWin.toFront();  
    	var detailPanel = Ext.getCmp('detailPanel');
		bookTpl.overwrite(detailPanel.body,"");
    	})
	grid.getSelectionModel().on('rowselect', function(sm, rowIdx, r) {
		var detailPanel = Ext.getCmp('detailPanel');
		bookTpl.overwrite(detailPanel.body, r.data);
	});    
});

function closeFileWin() {
	extFileWin.hide()
}

var uploadWin
function openUploadWin() {
	uploadWin = new Ext.Window({
		id: 'uploadWin',
		title: '文件上传',
		width: 420,
		height: 280,
		//border: false,
		modal: true,
		shim: true,
		html: '<iframe name="fileFrm" src="Business/pubinfo/fbyh/fileupload.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>',
		buttons: [{text:'上传',handler:fileSubmit},{text:'关闭',handler:closeUploadWin}],
       	buttonAlign:'center'
	});
	uploadWin.show()
}

/* var templetWin
function openTempletWin() {
	templetWin = new Ext.Window({
		id: 'templetWin',
		title: '选择模板',
		width: 320,
		height: 120,
		//border: false,
		modal: true,
		shim: true,
		html: '<iframe name="templetFrm" src="'+g_path+'/masterPlan/file/fileTemplet.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>',
		buttons: [{text:'确定',handler:openTemplet},{text:'关闭',handler:closeTempletWin}],
       	buttonAlign:'center'
	});
	templetWin.show()
} */

function onFileItemClick(item) {
	switch(item.id) {
		case 'add':
			openUploadWin()
			break
		case 'del':
			Ext.MessageBox.confirm('请确认','请确认是否删除?',function(btn){
				if(btn=="yes"){
					delFile();
					}
			})
			
			break
	}
}

function showFileWin( p_type, p_id, p_b, p_dept, p_date) {
	_fileType = p_type
	_filePK = p_id
	_fileDept = p_dept
	_fileDate = p_date
	_fileEdit = p_b
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
	var sql = "select file_lsh,file_name,dept_id,memo from sgcc_attach_list where transaction_id='" + _filePK + "'"  
	db2Json.selectData(sql, function (jsonData) {
		var ds = Ext.getCmp('fileGrid').getStore()
		ds.loadData(eval(jsonData),false)
	});
}

function fileSubmit() {
	window.frames["fileFrm"].doSubmit()
}

function closeUploadWin() {
	uploadWin.close()
}


function delFile() {
	var arr = Ext.getCmp('fileGrid').getSelectionModel().getSelections()
	if(arr.length) {
		var  sql = ""
		for(var i=0;i<arr.length;i++) {
			var fid = arr[i].get('file_lsh')
			sql += "delete from sgcc_attach_list where file_lsh='" + fid + "';delete from system_longdata where file_lsh='" + fid + "';"
		}
		if(sql!="") {
			db2Json.execute(sql,function(b){
				if(b) {
					loadFileGrid()
				}
			});
		}
	}   
}