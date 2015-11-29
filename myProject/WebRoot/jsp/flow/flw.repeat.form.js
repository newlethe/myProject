var bean = "com.sgepit.frame.flow.hbm.FlwDefinitionView";
var nodeBean = "com.sgepit.frame.flow.hbm.FlwNodeView";
var arrUploadfields = new Array();

var ds;
Ext.onReady(function(){
	
	var fileFieldSet = new Ext.form.FieldSet({
		id: 'fileFieldSet',
		title: '<div style="font-weight: normal;">'
				+'<b>流程关键节点</b> -&nbsp;&nbsp;&nbsp;'
				+'<font color=green>绿色</font>：开始节点 '
				+'<font color=blue>蓝色</font>：状态节点 '
				+'<font color=red>红色</font>：结束节点</div>'
	});
	
	var fileForm = new Ext.FormPanel({
		fileUpload: true,
		header: false, 
		border: false,
		bodyStyle: 'padding: 10px 10px;',
		url: ""+CONTEXT_PATH+"/servlet/FlwServlet?ac=uploadModelDoc&flowid="+parent.FLOW_ID,
		autoScroll: true,
		labelAlign: 'right',
		items: [{
			xtype: 'fieldset', title: '流程基本信息',
			items: [
				{xtype: 'textfield', name: 'flowtitle', fieldLabel: '流程标题', width: 260, readOnly: true}
			]
		}]
	});
	
	var saveBtn = new Ext.Button({
		text: '上传模板',
		iconCls: 'upload',
		disabled: true,
		handler: function(){
			fileForm.getForm().submit({
				waitTitle: 'Please waiting...',
				waitMsg: 'Upload data...',
				success: function(form, action){
					Ext.Msg.show({
						title: '提示',
						msg: action.result.msg,
						icon: Ext.Msg.INFO,
						buttons: Ext.Msg.OK,
						fn: function(value){
							if('ok' == value){
								parent.FLOW_ID = "", parent.FLOW_TITLE = "";
								window.location.reload(true);
							}
						}
					});
				},
				failure: function(form, action){
					Ext.Msg.show({
						title: '提示',
						msg: action.result.msg,
						icon: Ext.Msg.ERROR,
						buttons: Ext.Msg.OK,
						fn: function(value){
							if('ok' == value){
								parent.FLOW_ID = "", parent.FLOW_TITLE = "";
								window.location.reload(true);
							}
						}
					});
				}
			})
		}
	});
	
	var mainPanel = new Ext.Panel({
		region: 'center',
		layout: 'fit',
		border: false,
		collapsible: true,
    	animCollapse: true,
    	tbar: [
    		{text: "<font color=#15428b><b>&nbsp;流程再定义</b></font>", iconCls: 'select'},
    		'->',
			'<font color=green>在流程【关键点】上传【文件模板】&nbsp;</font>'
    	],
    	items: [fileForm],
    	bbar: ['->',saveBtn]
	})
	
	//设置文档在普通节点上的读写权限
	DWREngine.setAsync(false);
	var cnodeArr = new Array();
	baseDao.getData("select cnodeid,name from flw_common_node", function(list) {
		for (var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			cnodeArr.push(temp);
		}
	});
	DWREngine.setAsync(true);

	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	var fc = {
		'uids' : {name : 'uids', fieldLabel : '主键'},
		'cnodeid' : {name : 'cnodeid', fieldLabel : '普通节点'},
		'nodeid' : {name : 'nodeid', fieldLabel : '关键节点'},
		'flowid' : {name : 'flowid', fieldLabel : '流程'},
		'readtype' : {name : 'readtype', fieldLabel : '权限'}
	}

	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 40
		}),
		{
			id : 'uids',
			header : fc['uids'].fieldLabel,
			dataIndex : fc['uids'].name,
			hidden : true
		}, {
			id : 'cnodeid',
			header : fc['cnodeid'].fieldLabel,
			dataIndex : fc['cnodeid'].name,
			renderer : function(v){
				var str = '';
		   		for(var i=0; i<cnodeArr.length; i++) {
		   			if (cnodeArr[i][0] == v) {
		   				str = cnodeArr[i][1]
		   				break; 
		   			}
		   		}
		   		return str;
			},
			width : 180
		}, {
			id : 'nodeid',
			header : fc['nodeid'].fieldLabel,
			dataIndex : fc['nodeid'].name,
			hidden : true
		}, {
			id : 'flowid',
			header : fc['flowid'].fieldLabel,
			dataIndex : fc['flowid'].name,
			hidden : true
		}, {
			id : 'readtype',
			header : fc['readtype'].fieldLabel,
			dataIndex : fc['readtype'].name,
			renderer : function(value,cell,record,row,col,store){
				var str = "<input type='checkbox' "+(value==1?"checked":"")+" onclick='readChxClick(\""+row+"\",this)'>"
				var read = ""+(value==1?"<span style='color:green'>【可写】</span>":"【只读】")+""
				return str+read; 				
			},
			align : "center",
			width : 60
		}
	]);

	//cm.defaultSortable = true;

	var Columns = [
		{name: 'uids', type: 'string'},
		{name: 'cnodeid', type: 'string'},
		{name: 'nodeid', type: 'string'},
		{name: 'flowid', type: 'string'},
		{name: 'readtype', type: 'string'}
	];

	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : "com.sgepit.frame.flow.hbm.FlwCommonNodeFiles",
			business : "baseMgm",
			method : "findWhereOrderBy",
			params : "1=2"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : "uids"
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.setDefaultSort("uids", 'asc');
	var btn = new Ext.Button({
		text : ''
	})
	var gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		title : '设置文档权限',
		tbar : ['->',{
			text : '保存设置',
			iconCls: 'save',
			handler : function(){
				var records = ds.getModifiedRecords();
				if(records.length == 0) return;
				var tempArr = new Array();
				for (var i = 0; i < records.length; i++) {
					tempArr.push(records[i].data)
				}
				DWREngine.setAsync(false);
				flwDefinitionMgm.saveCommonNodeFileType(tempArr,function(str){
					if(str == "OK"){
						Ext.example.msg('提示信息','普通节点文档读写权限配置保存成功！');
						ds.reload();
					}else{
						Ext.example.msg('提示信息','操作出错！');
					}
				});	
				DWREngine.setAsync(true);	
			}
		},'-',{
			id : 'selectAll',
			text : '全部选择',
			iconCls : 'btn',
			handler : function(){
				var r = 0;
				if(this.text == "全部选择"){
					this.setText("取消全选");
					r = 1;
				}else if(this.text == "取消全选"){
					this.setText("全部选择");
				}
				for (var i = 0; i < ds.getCount(); i++) {
					if(ds.getAt(i)) 
						ds.getAt(i).set("readtype",r);
				}
			}
		}],
		header: false,
	    border: false,
	    region: 'center',
        stripeRows : true,
        autoScroll : true,
        loadMask : true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    }
	});
	
	
	var nodeWin = new Ext.Window({
		width : 500,
		height : document.body.clientHeight*0.9,
		modal: true, 
		plain: true, 
		border: false, 
		resizable: false,
		layout : 'fit',
		closeAction : 'hide',
		items : [gridPanel] 
	});
		
	var viewport = new Ext.Viewport({
		layout: 'fit',
		border: false,
		items: [mainPanel]
	});
	
	if (parent.FLOW_ID && parent.FLOW_TITLE){
		fileForm.getForm().findField('flowtitle').setValue(parent.FLOW_TITLE);
		DWREngine.setAsync(false);
		baseDao.findByWhere2(nodeBean, "flowid='"+parent.FLOW_ID+"' order by type", function(list){
			for (var i = 0; i < list.length; i++){
				var _flag = "";
				
				flwFrameMgm.checkIsUploadDoc(list[1].flowid, list[i].nodeid, function(flag){_flag = flag;});
				fileFieldSet.insert(i,{
					layout: 'column', border: false,
					items: [{
						columnWidth: .65, border: false,
						layout: 'form',
						items: [{
							xtype: 'fileuploadfield',
							id: list[i].nodeid,
							fieldLabel: getType(list[i]),//list[i].name,
							width: 360,
							value: _flag == '' ? '' : '已上传文件',
							buttonText: '<div><img src="jsp/res/images/word.gif" align="absmiddle">&nbsp;&nbsp;上传</div>',
							listeners: {
								'fileselected': function(fup, v){
									if (checkFileFormat(v)) {
										arrUploadfields.push(fup)
										saveBtn.enable();
									} else {
										fup.setValue("");
										Ext.example.msg('警告', '请上传word文档！');
									}
								}
							}
						}]
					},{
						columnWidth: .15, border: false,
						items: [{
							xtype: 'button',
							nodeid: list[i].nodeid,
							text: '设置文档权限',
							iconCls: 'btn',
							disabled: _flag == '' ? true : false,
							tooltip: '设置普通节点处理人的文档编辑权限',
							handler: function(){
								var errMsg = "";
								DWREngine.setAsync(false);
								flwDefinitionMgm.initCommonNodeFileType(this.nodeid,function(str){
									errMsg = str;
								});	
								DWREngine.setAsync(true);
								if(errMsg.length > 0){
									Ext.example.msg('提示信息', errMsg);
									return;
								}else{
									//prompt('',this.nodeid)
									nodeWin.show();
									ds.baseParams.params = "nodeid = '"+this.nodeid+"'";
									ds.load();
								}
							}
						}]
					},{
						columnWidth: .10, border: false,
						items: [{
							xtype: 'button',
							nodeid: list[i].nodeid,
							text: '重置',
							iconCls: 'refresh',
							tooltip: '清除准备上传的Word模板',
							handler: function(){
								for(var i=0; i<arrUploadfields.length; i++){
									if (arrUploadfields[i].getId() == this.nodeid){
										arrUploadfields[i].setValue('');
									}
								}
							}
						}]
					},{
						columnWidth: .10, border: false,
						items: [{
							xtype: 'button',
							text: '下载',
							iconCls: 'download',
							tooltip: '下载已上传的Word模板',
							nodeid: list[i].nodeid,
							disabled: _flag == '' ? true : false,
							handler: function(){
								var nodeid = this.nodeid;
								window.location.href = ''+CONTEXT_PATH+'/servlet/FlwServlet?ac=downloadModelDoc&nodeid='+nodeid+'&flowid='+parent.FLOW_ID;
							}
						}]
					}]
				});
			}
		});
		DWREngine.setAsync(true);
		fileForm.insert(1, fileFieldSet);
		viewport.render();
	}
	
	function checkFileFormat(filename){
		var _filename = filename.split('\\')[filename.split('\\').length-1];
		return (_filename.indexOf('.doc') != -1) ? true : false;
	}
	
	function getType(obj){
		if (obj.type == '0') return '<font color=green>'+obj.name+'</font>';
		if (obj.type == '1') return '<font color=blue>'+obj.name+'</font>';
		if (obj.type == '2') return '<font color=red>'+obj.name+'</font>';
	}
});

function readChxClick(r,obj){
	var record = ds.getAt(r);
	if(obj.checked == true){
		record.set("readtype","1");
	}else{
		record.set("readtype","0");
	}
}
