<%@ page language="java" pageEncoding="utf-8"%>

<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<title>报表列表</title>
		
	</head>
	<body>	
		
	</body>
</html>
<script type="text/javascript">
var container,northToolbar
var insertBtn,updateBtn,deleteBtn
var allowedDocTypes = "xls,xlsx";

Ext.onReady(function(){
	insertBtn = new Ext.Toolbar.Button({
			id: 'add',
            icon: basePath+"business/res/images/toolbar_item_add.png",
            cls: "x-btn-text-icon",
            text: "新&nbsp;增",
            handler: onItemClick
	})
	updateBtn = new Ext.Toolbar.Button({
			id: 'edit',
            text: '编辑',	
			cls: 'x-btn-text-icon',
			icon: basePath+ "business/res/images/toolbar_item_edit.png",
			handler: onItemClick
	})
	deleteBtn = new Ext.Toolbar.Button({
			id: 'delete',
            icon: basePath+"business/res/images/toolbar_item_del.png",
            cls: "x-btn-text-icon",
            text: "删&nbsp;除",
            handler: onItemClick
	})
    //定义工具栏
    northToolbar = new Ext.Toolbar({height:25});
   
    container = new Ext.Panel({
		//layout : 'border',
		region: 'center',
		renderTo: document.body,
		border: false,
		tbar: northToolbar,
		html:'<iframe name="grid1" src="<%=basePath%>jsp/common/appendix/xlsListGrid.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>'
		
	});	
    
    var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [container]
	});
	
     northToolbar.add(insertBtn, updateBtn, deleteBtn)
});

function onItemClick(item){

	var grid1 = window.frames["grid1"].dbnetgrid1
	switch(item.id) {
		case 'add':
			grid1.actionTable.all.insertBtn.click()
			break
		case 'edit':
			grid1.toolbar.all.updateBtn.click()
			break
		case 'delete':
			grid1.toolbar.all.deleteBtn.click()
			break
	}
}

var currentFileExt
function viewTemplate(){
	var grid = window.frames["grid1"].dbnetgrid1
	var curRow = grid.currentRow;
	window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+curRow.file_lsh)
}
function uploadTemplate(flag){
	var uploadForm = new Ext.form.FormPanel({   
	  baseCls: 'x-plain',   
	  labelWidth: 80,   
	  url: MAIN_SERVLET+"?ac=upload",   
	  fileUpload: true,   
	  defaultType: 'textfield',   
	
	  items: [{   
	    xtype: 'textfield',   
	    fieldLabel: '流水号',   
	    name: 'fileid1',
	    readOnly: true,
	    hidden: true,
	    hideLabel: true,
	    anchor: '90%'  // anchor width by percentage   
	  },{   
	    xtype: 'textfield',   
	    fieldLabel: '请选择文件',   
	    name: 'filename1',   
	    inputType: 'file',   
	    allowBlank: false,   
	    blankText: 'File can\'t not empty.',   
	    anchor: '90%'  // anchor width by percentage   
	  }]   
	});   
	
	var uploadWin = new Ext.Window({   
	  title: '上传',   
	  width: 450,   
	  height: 180,   
	  minWidth: 300,   
	  minHeight: 100,   
	  layout: 'fit',   
	  plain:true,   
	  bodyStyle:'padding:5px;',   
	  buttonAlign:'center',   
	  items: uploadForm,   
	
	  buttons: [{   
	    text: '上传',   
	    handler: function() {
	      var filename = uploadForm.form.findField("filename1").getValue()
	      if (filename!= ""){
	      	var fileExt = filename.substring(filename.lastIndexOf(".")+1,filename.length).toLowerCase();
	     	if (allowedDocTypes.indexOf(fileExt) == -1) {
	     		Ext.MessageBox.alert("提示", "请选择Office文档！");
	     		return;
	     	}else{
	     		currentFileExt = fileExt
	     	}
	      }
	      if(uploadForm.form.isValid()){   
	        Ext.MessageBox.show({   
	             title: '请等待',   
	             msg: '上传中...',   
	             progressText: '',   
	             width:300,   
	             progress:true,   
	             closable:false,   
	             animEl: 'loading'  
	           });   
	        uploadForm.getForm().submit({
	          method: 'POST',
	          params:{ac:'upload'},
	          success: function(form, action){
				tip = Ext.QuickTips.getQuickTip();
				tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传成功!', 'icon-success')
				tip.show();
				Ext.MessageBox.hide();
	            uploadWin.hide();
	            var rtn = action.result.msg;
	            var fileid = rtn[0].fileid;
	            var filename = rtn[0].filename;
	            fileUploaded(fileid,filename);
	          },       
	           failure: function(){       
	            Ext.Msg.alert('Error', 'File upload failure.');       
	           }   
	        })              
	      }   
	     }   
	  },{   
	    text: '关闭',   
	    handler:function(){uploadWin.hide();}   
	  }]   
	});
	
	uploadWin.show();
	if (flag) {
		var grid = window.frames["grid1"].dbnetgrid1
		var curRow = grid.currentRow;
		uploadForm.getForm().findField("fileid1").setValue(curRow.file_lsh);
	}
}

function fileUploaded(fileid, filename){

	var grid = window.frames["grid1"].dbnetgrid1
	var curRow = grid.currentRow;
	grid.selectData("update sgcc_plan_appendix set file_name ='" + filename + "', file_lsh='" + fileid + "' where appendixid='" +curRow.appendixid + "'")
	grid.loadData();
}

</script>