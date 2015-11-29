var beanFj = "com.sgepit.pmis.equipment.hbm.EquFile"
var businessFj = "baseMgm"
var listMethodFj = "findWhereOrderby"
var primaryKeyFj = "uids"
var orderColumnFj = "treeuids"

var uploadRow = {};
var allowedDocTypes = "xls,xlsx,doc,docx";
var gridPanelFj;

Ext.onReady(function(){
	var fm = Ext.form;
	var fileTreeArr = new Array();
	DWREngine.setAsync(false);
	//技术资料分类
	var sql = "select a.uuid,a.treename from ( select t.* from equ_type_tree t " +
		" where t.conid = '"+selectConid+"' ) a start with a.treeid = '04'"+
		" connect by PRIOR  a.treeid =  a.parentid";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1] == 4 ? "技术资料" : list[i][1]);		
			fileTreeArr.push(temp);			
		}
	});
	DWREngine.setAsync(true);
	var fileTreeDs = new Ext.data.SimpleStore({
		fields : ['k','v'],
		data : fileTreeArr
	})
	var fcFj = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'conid' : {name : 'conid',fieldLabel : '合同主键'},
		'treeuids' : {
			name : 'treeuids',
			fieldLabel : '设备合同分类树',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: fileTreeDs
		},
		'mainid' : {name : 'mainid',fieldLabel : '到货单主键'},
		'fileid' : {name : 'fileid',fieldLabel : '查看'},
		'filename' : {name : 'filename',fieldLabel : '附件名称'},
		'remark' : {name : 'remark',fieldLabel : '备注'},
		'dhOrKx' : {name : 'dhOrKx',fieldLabel : '到货or开箱'}
	};
	
	var smFj = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cmFj = new Ext.grid.ColumnModel([
		//smFj,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcFj['uids'].fieldLabel,
			dataIndex : fcFj['uids'].name,
			hidden : true
		},{
			id : 'conid',
			header : fcFj['conid'].fieldLabel,
			dataIndex : fcFj['conid'].name,
			hidden : true
		},{
			id : 'pid',
			header : fcFj['pid'].fieldLabel,
			dataIndex : fcFj['pid'].name,
			hidden : true
		},{
			id : 'mainid',
			header : fcFj['mainid'].fieldLabel,
			dataIndex : fcFj['mainid'].name,
			hidden : true
		},{
			id : 'treeuids',
			header : fcFj['treeuids'].fieldLabel,
			dataIndex : fcFj['treeuids'].name,
			editor : fileEdit=="true" ? new fm.ComboBox(fcFj['treeuids']) : false,
			renderer : function(v){
				var tree = "";
				for(var i=0;i<fileTreeArr.length;i++){
					if(v == fileTreeArr[i][0])
						tree = fileTreeArr[i][1];
				}
				return tree;
			},
			align : 'center',
			width : 100
		},{
			id : 'fileid',
			header : fcFj['fileid'].fieldLabel,
			dataIndex : fcFj['fileid'].name,
			//editor : new fm.TextField(fcFj['fileid']),
			renderer : function(v,b,r){
				if(v == ""){
					return fileEdit=="true" ? "<a href='javascript:uploadTemplate()' title='上传'>上传</a>" : "未上传"
				}else{
					return "<a href='javascript:viewTemplate()' title='查看'>查看</a>";
				}
			},
			align : 'center',
			//hidden : fileEdit=="true" ? false : true,
			width : 70
		},{
			id : 'filename',
			header : fcFj['filename'].fieldLabel,
			dataIndex : fcFj['filename'].name,
			editor : fileEdit=="true" ? new fm.TextField(fcFj['filename']) : false,
			renderer : function(v,m,r){
				var id = r.get('fileid');
				if(id == null || id =="")
					return v;
				else
					return "<a href='javascript:viewTemplate()' title='"+v+"'>"+v+"</a>";
			},
			align : 'center',
			width : 300
		},{
			id : 'remark',
			header : fcFj['remark'].fieldLabel,
			dataIndex : fcFj['remark'].name,
			editor : fileEdit=="true" ? new fm.TextField(fcFj['remark']) : false,
			align : 'center',
			width : 180
		},{
			id : 'dhOrKx',
			header : fcFj['dhOrKx'].fieldLabel,
			dataIndex : fcFj['dhOrKx'].name,
			hidden : true
		}
	]);
	var ColumnsFj = [
		{name:'uids', type:'string'},
		{name:'conid', type:'string'},
		{name:'pid', type:'string'},
		{name:'mainid', type:'string'},
		{name:'treeuids', type:'string'},
		{name:'fileid', type:'string'},
		{name:'filename', type:'string'},
		{name:'remark', type:'string'},
		{name:'dhOrKx', type:'string'}
	];
	var PlantFj = Ext.data.Record.create(ColumnsFj);
    var PlantIntFj = {
		uids : '',
		pid : CURRENTAPPID,
		conid : selectConid,
		treeuids : '',
		mainid : edit_uids,
		fileid : '',
		filename : '',
		remark : '',
		dhOrKx : type
	}	
	
	var dsFj = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanFj,
	    	business: businessFj,
	    	method: listMethodFj,
	    	params: "pid='"+CURRENTAPPID+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyFj
        }, ColumnsFj),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsFj.setDefaultSort(orderColumnFj, 'desc');	//设置默认排序列
	
	gridPanelFj = new Ext.grid.EditorGridTbarPanel({
		ds : dsFj,
		cm : cmFj,
		sm : smFj,
		title : '附件',
		tbar : ['<font color=#15428b><B>附件信息<B></font>','-'],
		insertHandler : addFile,
		addBtn : fileEdit=="true"?true:false,
		saveBtn : fileEdit=="true"?true:false,
		delBtn : fileEdit=="true"?true:false,
		header: false,
	    border: false,
	    layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 10,
            store: dsFj,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
		plant : PlantFj,
		plantInt : PlantIntFj,
		servletUrl : MAIN_SERVLET,
		bean : beanFj,
		business : businessFj,
		primaryKey : primaryKeyFj
	});	
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [gridPanelFj]
	})
	
	//查询当前选中节点的所有子节点主键。
	var sql = "select a.uuid from ( select t.* from equ_type_tree t " +
			" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
			" (SELECT t.treeid from equ_type_tree t where t.uuid = '"+selectUuid+"' " +
			" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid";
	var treeuuidstr = "";
	DWREngine.setAsync(false);
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			treeuuidstr += ",'"+list[i]+"'";		
		}
	});	
	DWREngine.setAsync(true);
	treeuuidstr = treeuuidstr.substring(1);
	if(fileEdit == "true"){
		dsFj.baseParams.params = "pid='"+CURRENTAPPID+"' and mainid='"+edit_uids+"'";
	}else{
		dsFj.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
	}
	dsFj.load({params:{start:0,limit:PAGE_SIZE}});
	
	
	function addFile(){
		var uids = "";
		if(parent.formPanel)
			if(parent.formPanel.getForm().findField("uids")){
				uids = parent.formPanel.getForm().findField("uids").getValue();
			}
        if(uids == null || uids == ""){
			Ext.example.msg('提示信息','请先保存单据的基本信息！');
			return;
		}
		PlantIntFj.mainid = uids;
		gridPanelFj.defaultInsertHandler();
	}
	
	gridPanelFj.on("cellclick", function(grid, rowIdx, colIdx, e){
    		var record = grid.getStore().getAt(rowIdx);
    		uploadRow.fileid = record.get("fileid");
    		uploadRow.row = rowIdx
    		uploadRow.col = colIdx
    })
});


function viewTemplate(){
	window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+uploadRow.fileid)
}

function uploadTemplate(flag) {
	var uploadForm = new Ext.form.FormPanel({
		baseCls : 'x-plain',
		labelWidth : 80,
		url : MAIN_SERVLET + "?ac=upload",
		fileUpload : true,
		defaultType : 'textfield',

		items : [{
			xtype : 'textfield',
			fieldLabel : '流水号',
			name : 'fileid1',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '90%' // anchor width by percentage
		}, {
			xtype : 'textfield',
			fieldLabel : '请选择文件',
			name : 'filename1',
			inputType : 'file',
			allowBlank : false,
			// blankText: 'File can\'t not empty.',
			anchor : '90%' // anchor width by percentage
		}]
	});

	var uploadWin = new Ext.Window({
		title : '上传',
		width : 450,
		height : 140,
		minWidth : 300,
		minHeight : 100,
		layout : 'fit',
		plain : true,
		bodyStyle : 'padding:5px;',
		buttonAlign : 'center',
		items : uploadForm,
		buttons : [{
			text : '上传',
			handler : function() {
				var filename = uploadForm.form.findField("filename1").getValue()
				if (filename != "") {
					var fileExt = filename.substring(filename.lastIndexOf(".") + 1, filename.length).toLowerCase();
					if (allowedDocTypes.indexOf(fileExt) == -1) {
						Ext.MessageBox.alert("提示", "请选择Office文档！");
						return;
					} else {
						currentFileExt = fileExt
					}
				}
				if (uploadForm.form.isValid()) {
					Ext.MessageBox.show({
						title : '请等待',
						msg : '上传中...',
						progressText : '',
						width : 300,
						progress : true,
						closable : false,
						animEl : 'loading'
					});
					uploadForm.getForm().submit({
						method : 'POST',
						params : {
							ac : 'upload'
						},
						success : function(form, action) {
							tip = Ext.QuickTips.getQuickTip();
							tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;上传成功!','icon-success')
							tip.show();
							Ext.MessageBox.hide();
							uploadWin.hide();
							var rtn = action.result.msg;
							var fileid = rtn[0].fileid;
							var filename = rtn[0].filename;
							fileUploaded(fileid, filename);
						},
						failure : function() {
							Ext.example.msg('Error', 'File upload failure.');
						}
					})
				}
			}
		}, {
			text : '关闭',
			handler : function() {
				uploadWin.hide();
			}
		}]
	});

	uploadWin.show();
	if (flag) {
		uploadForm.getForm().findField("fileid1").setValue(uploadRow.fileid);
	}

}

function fileUploaded(fileid, filename){
	var record = gridPanelFj.getStore().getAt(uploadRow.row)
	record.set("fileid", fileid);
	record.set("filename", filename);
}
