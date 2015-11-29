
var savable = false;
var filePk = "";
//文件尚未保存标识
var unsaved = true;
var fileUidsField;
var publishStateIdField;
var fileCreatetimeField;
var authorField ;
var fileField;
var titleField ;
var fileContentFiled ;
var pidField;
var Columns;
Ext.onReady(function() {
    
     Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'title',
				type : 'string'
			}, {
				name : 'content',
				type : 'string'
			}, {
				name : 'equclass',
				type : 'string'
			}, {
				name : 'author',
				type : 'string'
			}, {
				name : 'status',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'createtime',
				type : 'date'
			}]
	
	// 保存按钮
	var saveBtn = new Ext.Button({
				text : '保存',
				minWidth : 80,
				handler : docPropertyFormSaveFun
			}
	);

	// 关闭按钮
	var closeBtn = new Ext.Button({
				text : '关闭',
				minWidth : 80,
				handler : closeWin
			});

	fileUidsField = new Ext.form.TextField({
				allowBlank : true,
				id : 'uids',
				name : 'uids',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "文件主键",
				hidden : true,
				hideLabel : true
			});
	pidField = new Ext.form.TextField({
				allowBlank : true,
				id : 'pid',
				name : 'pid',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "项目主键",
				hidden : true,
				hideLabel : true
			});			

	fileField = new Ext.form.TextField({
				id : 'attach_file',
				emptyText : '选择上传的文件',
				fieldLabel : '文档',
				name : 'file',
				buttonText : '浏览',
				anchor : '95%',
				hidden : true,
				hideLabel : true
			});

	fileField.on('fileselected', function() {
				// 设置默认文件名
				var filePath = this.getValue();
				if (filePath && filePath.length > 0) {
					var fileName = filePath.substring(filePath
									.lastIndexOf("\\")
									+ 1, filePath.lastIndexOf("."));
				}
				titleField.setValue(fileName);

				var fileExtension = filePath.substring(
						filePath.lastIndexOf(".") + 1, filePath.length)
						.toLowerCase();
			
			});

	fileCreatetimeField = new Ext.form.DateField({
				// allowBlank: false,
				id : 'createtime',
				name : 'createtime',
				size : 100,
				maxLength : 100,
				maxLengthText : "输入不能多于200个字符",
				anchor : '98%',
				// validator: textValidator,
				fieldLabel : "设备到货信息起草时间",
				format : 'Y-m-d H:i:s',
				hidden : true,
				hideLabel : true
			});
	 titleField = new Ext.form.TextField({
				allowBlank : false,
				id : 'title',
				// name: 'title',
				size : 200,
				maxLength : 200,
				maxLengthText : "输入不能多于200个字符",
				anchor : '97%',
				// validator: textValidator,
				fieldLabel : "设备到货信息标题<font color='red'>*</font>"
			});
	authorField = new Ext.form.TextField({
				allowBlank : false,
				id : 'author',
				// name: 'title',
				size : 200,
				hidden:true,
				maxLength : 200,
				maxLengthText : "输入不能多于100个字符",
				anchor : '97%',
				// validator: textValidator,
				fieldLabel : "设备到货信息作者<font color='red'>*</font>"
			});			
    
    var classArr = new Array();
    DWREngine.setAsync(false);  
    appMgm.getCodeValue('设备到货信息通知分类',function(list){         //获取合同付款方式
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            classArr.push(temp);         
        }
    });
    DWREngine.setAsync(true);
    
    var newclassDs = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: classArr
    });
            
    var newsclassField = new Ext.form.ComboBox({
            name:'newsclass',
            fieldLabel:"设备到货信息分类<font color='red'>*</font>",
            readOnly : true,
            valueField: 'k',
            displayField: 'v',
            allowBlank: false,
            mode : 'local',
            triggerAction : 'all',
            store:newclassDs,
            triggerAction: 'all',
            anchor:'95%'
    });
            
            
	fileContentFiled = new Ext.form.TextArea({
				allowBlank:false,
				id : 'content',
				fieldLabel : "到货信息<font color='red'>*</font>",
				height : 220,
				anchor : '99%',
				size : 3000,
				maxLength : 3000,
				maxLengthText : "输入不能多于3000个字符"
			});
			
	publishStateIdField = new Ext.form.Hidden({
				allowBlank : true,
				id : 'status',
				name : 'status',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "设备到货信息发布状态"
			});
	
		var formTitle = editMode == 'insert' ? '起草设备到货信息' : '详细设备到货信息';
		docPropertyForm = new Ext.FormPanel({
					id : 'docProperty_form',
					title : formTitle,
					labelWidth : 75,
					frame : true,
					region : 'center',
					bodyBorder : true,
					border : true,
					bodyStyle : 'padding:5px 5px 5px 5px',
					width : 580,
					height : 500,
					layout : 'form',
					enctype : 'multipart/form-data',
					fileUpload : 'true',
					method : 'POST',
					url : '',
					layout : 'column',
					items : [
							  {// 第三行，设备到货信息描述
								columnWidth : .98,
								layout : 'form',
								items : [fileContentFiled]
							}, {// 以下全部为隐藏域
								items : [
										fileCreatetimeField,publishStateIdField,fileUidsField,fileField,pidField,authorField]
							}]
				});
				
				if ( editEnable ){
					docPropertyForm.addButton(saveBtn);
				}
				docPropertyForm.addButton(closeBtn);
	

	// docPropertyForm.add(titleFieldSet,contentFieldSet);
	
	if ( editEnable == true) {
		savable = true;
	}

	if ( editMode == 'insert' ){
		filePk = newFilePk;
	
	}else
	{
		filePk = selectedRecord.get("uids");
	}
	if(billtype==true){	
		filePk =selectedRecord.data.uids
		}
	var fileType="*.jpg";
	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=equManamentAttach&editable="
			+ savable + "&businessId=" + filePk+"&fileType="+fileType;
			
	filePanel = new Ext.Panel({
				border : true,
				region : "south",
				// height:'60%',
				height : 210,
				split : true,
				title : "设备到货信息图片",
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
			

		var viewport = new Ext.Viewport({
					layout : 'border',
					items : [docPropertyForm, filePanel]
				});
			
	
	setFiledAbled();

})
function docPropertyFormSaveFun() {
	if (editMode == "update" && editEnable == false) {
		return;
	}
	var form = docPropertyForm.getForm();
	if ( !form.isValid() ){
		return;
	}
	var data = form.getValues();
    
    for (var i = 0; i < Columns.length; i++) {
        var n = Columns[i].name;
        var field = form.findField(n);
        if (field) {
            data[n] = field.getValue();
        }
    }
    
	var jsonData = Ext.encode(data);
	var method = "saveLocalEquInfo";
	if (editMode == "update") {
		method = "updateEquInfo";
		Ext.Ajax.request({
					waitMsg : '保存中......',
					method : 'POST',
					url : CONTEXT_PATH + '/servlet/NewsServlet',
					params : {
						method : method
					},
					fileUpload : 'true',
					jsonData : jsonData,
					success : function(response, params) {
						Ext.MessageBox.alert("提示", "数据保存成功!")
						unsaved = false;
						window.returnValue = 'changed';
					},
					failure : function(response, params) {
						Ext.MessageBox.alert("提示", response.responseText)
					}
				});
	} else {
		
		form.submit({
					waitMsg : '保存中......',
					method : 'POST',
					url : CONTEXT_PATH
							+ '/servlet/NewsServlet?method=' + method,
					params : data,
					success : function(response, params) {
						Ext.MessageBox.alert("提示", "数据保存成功!");
						unsaved = false;
						editMode="update";//用户不关闭窗口再次点击保存时模式将是更新
						window.returnValue = 'changed';
					},
					failure : function(response, params) {
						Ext.MessageBox.alert("提示", response.responseText)
					}
				});
	}

}
function closeWin() {
	window.close();
	if ( unsaved && editMode == 'insert'){
		
		ComFileManageDWR.deleteUnsavedFileAttatchment(filePk);
	}
}
function setFiledAbled() {
	if (editMode == "update") {
		docPropertyForm.getForm().loadRecord(selectedRecord);
		if (editEnable) {		
			fileContentFiled.el.dom.readOnly = false;
		} else {
			fileContentFiled.el.dom.readOnly = true;
		}
	} else if (editMode == "insert") {
		pidField.setValue(CURRENTAPPID);
		fileUidsField.setValue(filePk);
		authorField.setValue(REALNAME);
		publishStateIdField.setValue(0);
		fileCreatetimeField.setValue(SYS_TIME_STR);
	}

}