var publisStateNameField;
var savable = false;
var filePk = "";
Ext.onReady(function() {
	
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

	fileField = new Ext.ux.form.FileUploadField({
				id : 'attach_file',
				emptyText : '选择上传的文件',
				fieldLabel : '文档',
				name : 'file',
				buttonText : '浏览',
				anchor : '95%'
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
	fileIdField = new Ext.form.TextField({
				// allowBlank: false,
				id : 'fileId',
				name : 'fileId',
				size : 80,
				maxLength : 100,
				maxLengthText : "输入不能多于100个字符",
				anchor : '83%',
				// validator: textValidator,
				fieldLabel : "文件编号"
			});
	fileCreatetimeField = new Ext.form.DateField({
				// allowBlank: false,
				id : 'fileCreatetime',
				name : 'fileCreatetime',
				size : 100,
				maxLength : 100,
				maxLengthText : "输入不能多于100个字符",
				anchor : '98%',
				// validator: textValidator,
				fieldLabel : "文件创建时间",
				format : 'Y-m-d H:i:s',
				hidden : true,
				hideLabel : true
			});
	titleField = new Ext.form.TextField({
				allowBlank : false,
				id : 'fileTile',
				// name: 'title',
				size : 100,
				maxLength : 100,
				maxLengthText : "输入不能多于100个字符",
				anchor : '97%',
				// validator: textValidator,
				fieldLabel : "文件名称<font color='red'>*</font>"
			});

	fileContentFiled = new Ext.form.TextArea({
				id : 'fileContent',
				fieldLabel : '文件概述',
				height : 130,
				anchor : '95%',
				size : 1000,
				maxLength : 1000,
				maxLengthText : "输入不能多于1000个字符"
			});
	billStateIdField = new Ext.form.TextField({
				allowBlank : true,
				id : 'billState',
				name : 'billState',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "流程状态ID",
				hidden : true,
				hideLabel : true
			});
	billStateNameField = new Ext.form.Hidden({
				allowBlank : true,
				id : 'billStateName',
				name : 'billStateName',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "流程状态"
			});
	publishStateIdField = new Ext.form.TextField({
				allowBlank : true,
				id : 'statePublish',
				name : 'statePublish',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "文件发布状态ID",
				hidden : true,
				hideLabel : true
			});
	publisStateNameField = new Ext.form.Hidden({
				allowBlank : true,
				id : 'publisStateName',
				name : 'publisStateName',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "文件发布状态"
			});
	fileSortIdField = new Ext.form.TextField({
				allowBlank : true,
				id : 'fileSortId',
				name : 'fileSortId',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "文件分类ID",
				hidden : true,
				hideLabel : true
			});
   			
	/*
	 * fileSortNameField = new Ext.form.TextField({ allowBlank: true, id :
	 * 'fileSortName', name: 'fileSortName', size: 100, maxLength:100, height:0,
	 * anchor: '98%', fieldLabel: "文件分类" });
	 */

	
	//pid
	var pidField = new Ext.form.Hidden({
				id : 'pid',
				name : 'pid',
				value : filterPid == null ? CURRENTAPPID : filterPid
			});
			
	reportStatusField = new Ext.form.Hidden({
     	id : 'reportStatus',
     	name : 'reportStatus'
     });
	//alert('pidField' + pidField.value)
			
	fileSortNameField = new Ext.form.ComboBox({
		store : new Ext.data.SimpleStore({
					fields : [],
					data : [[]]
				}),
		editable : false,
		shadow : false,
		id : 'fileSortName',
		name : 'fileSortName',
		mode : 'local',
		triggerAction : 'all',
		maxHeight : 100,
		size : 200,
		height : 0,
		anchor : '98%',
		fieldLabel : "文件分类",
		tpl : '<tpl for="."><div style="height:200px"><div id="tree1"></div></div></tpl>',
		selectedClass : '',
		hidden :SETTLEMENT=='true'?true:false,
		hideLabel :SETTLEMENT=='true'?true:false,
		onSelect : Ext.emptyFn
	});
	var treeNodeUrl = CONTEXT_PATH
			+ "/servlet/ComFileSortServlet?method=buildAllTreeByDept&parentId="
			+ treeInfo.rootId + "&deptId=" + USERDEPTID
	var tree1 = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
							dataUrl : treeNodeUrl
						}),
				border : false,
				rootVisible : false,
				root : new Ext.tree.AsyncTreeNode({
							text : treeInfo.rootName,
							id : treeInfo.rootId
						})
			});
	tree1.on('click', function(node) {
		if ( editEnable ){
		fileSortNameField.setValue(node.text);
				fileSortIdField.setValue(node.id);
		}
			
				fileSortNameField.collapse();
		
				
			});
	fileSortNameField.on('expand', function(combo, e) {

				tree1.render('tree1');
			});

	fileAuthorIdField = new Ext.form.TextField({
				allowBlank : true,
				id : 'fileAuther',
				name : 'fileAuther',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "作者ID",
				hidden : true,
				hideLabel : true
			});
	fileAuthorNameField = new Ext.form.Hidden({
				allowBlank : true,
				id : 'fileAutherName',
				name : 'fileAutherName',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "作者"
			});

	authorDeptIdField = new Ext.form.TextField({
				allowBlank : true,
				id : 'fileDept',
				name : 'fileDept',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "所属部门ID",
				hidden : true,
				hideLabel : true
			});
	authorDeptNameField = new Ext.form.Hidden({
				allowBlank : true,
				id : 'fileDeptName',
				name : 'fileDeptName',
				size : 100,
				maxLength : 100,
				height : 0,
				anchor : '98%',
				fieldLabel : "所属部门"
			});
	if (editMode == "update") {
		docPropertyForm = new Ext.FormPanel({
					id : 'docProperty_form',
					title : '文件属性',
					labelWidth : 100,
					frame : true,
					region : 'center',
					bodyBorder : true,
					border : true,
					bodyStyle : 'padding:5px 5px 5px 5px',
					width : 680,
					height : 500,
					layout : 'form',
					enctype : 'multipart/form-data',
					fileUpload : 'true',
					method : 'POST',
					url : '',
					layout : 'column',
					items : [{
								columnWidth : .50,
								layout : 'form',
								items : [fileSortNameField]
							}, {
								columnWidth : .24,
								layout : 'form',
								items : [billStateNameField]
							}, {
								columnWidth : .24,
								layout : 'form',
								items : [publisStateNameField]
							}, {
								columnWidth : .65,
								layout : 'form',
								items : [fileIdField, titleField]
							}, {
								columnWidth : .33,
								layout : 'form',
								items : [fileAuthorNameField,
										authorDeptNameField,
										fileCreatetimeField]
							}, {
								columnWidth : .98,
								layout : 'form',
								items : [fileContentFiled]
							}, {
								columnWidth : .98,
								layout : 'form',
								items : [billStateIdField, publishStateIdField,
										fileSortIdField, fileAuthorIdField,
										authorDeptIdField, fileUidsField, pidField, reportStatusField]
							}]
				});
				if ( editEnable ){
					docPropertyForm.addButton(saveBtn);
				}
				docPropertyForm.addButton(closeBtn);
				
	} else if (editMode == "insert") {
		docPropertyForm = new Ext.FormPanel({
					id : 'docProperty_form',
					title : '文件属性',
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
					items : [{// 第一行，分类和文件编号
						columnWidth : .50,
						layout : 'form',
						items : [fileSortNameField]
					}, {
						columnWidth : .50,
						layout : 'form',
						items : [fileIdField]
					}, {	// 第二行，文件标题和文件上传域
								columnWidth : .5,
								layout : 'form',
								items : [fileField]
							}, {
								columnWidth : .43,
								layout : 'form',
								items : [titleField]
							}, {// 第三行，文件描述
								columnWidth : .98,
								layout : 'form',
								items : [fileContentFiled]
							}, {// 以下全部为隐藏域
								items : [billStateNameField,
										publisStateNameField,
										fileAuthorNameField,
										authorDeptNameField,
										fileCreatetimeField, billStateIdField,
										publishStateIdField, fileSortIdField,
										fileAuthorIdField, authorDeptIdField,
										fileUidsField, pidField,reportStatusField]
							}],
					buttons : [saveBtn, closeBtn]
				});
	}

	// docPropertyForm.add(titleFieldSet,contentFieldSet);
	
	if (editMode == "update" && editEnable == true) {
		savable = true;

	}

	if (editMode != "insert") {
		filePk = selectedRecord.get("uids");
	}
	if(billtype==true){	
		filePk =selectedRecord.data.fileId
		}
	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType=FAPAttach&editable="
			+ savable + "&businessId=" + filePk;
	filePanel = new Ext.Panel({
				border : true,
				region : "south",
				// height:'60%',
				height : 220,
				split : true,
				title : "附件",
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	if (editMode == "update") {
		viewport = new Ext.Viewport({
					layout : 'border',
					items : [docPropertyForm, filePanel]
				});
	} else if (editMode == "insert") {
		viewport = new Ext.Viewport({
					layout : 'border',
					items : [docPropertyForm]
				});
	}
	setFiledAbled();

})
function docPropertyFormSaveFun() {
	if (editMode == "update" && editEnable == false) {
		return;
	}
	var form = docPropertyForm.getForm();
	var data = form.getValues();
	var jsonData = Ext.encode(data);
	var method = "saveNewLocalFile";
	if (editMode == "update") {
		method = "updateFileInfo";
		Ext.Ajax.request({
					waitMsg : '保存中......',
					method : 'POST',
					url : CONTEXT_PATH + '/servlet/ComFileManageServlet',
					params : {
						method : method
					},
					fileUpload : 'true',
					jsonData : jsonData,
					success : function(response, params) {
						Ext.MessageBox.alert("提示", "文件信息保存成功!")
						gridStore.reload()
						form.reset();
						closeWin();
					},
					failure : function(response, params) {
						Ext.MessageBox.alert("提示", response.responseText)
					}
				});
	} else {
		if (fileField.getValue() == "") {
			Ext.MessageBox.alert("提示", "请先上传文件，再进行保存操作！")
			return
		}
	
		form.submit({
					waitMsg : '保存中......',
					method : 'POST',
					url : CONTEXT_PATH
							+ '/servlet/ComFileManageServlet?method=' + method,
					params : data,
					success : function(response, params) {
						Ext.MessageBox.alert("提示", "文件信息保存成功!")
						gridStore.reload()
						form.reset();
						closeWin();
					},
					failure : function(response, params) {
						Ext.MessageBox.alert("提示", response.responseText)
					}
				});
	}

}
function closeWin() {
	window.close();
}
function setFiledAbled() {
	billStateNameField.el.dom.readOnly = true;
	publisStateNameField.el.dom.readOnly = true;
	fileAuthorNameField.el.dom.readOnly = true;
	authorDeptNameField.el.dom.readOnly = true;
	if (editMode == "update") {
		docPropertyForm.getForm().loadRecord(selectedRecord);
		if (editEnable) {
			
			fileIdField.el.dom.readOnly = false;
			titleField.el.dom.readOnly = false;
			fileContentFiled.el.dom.readOnly = false;
			fileSortNameField.el.dom.readOnly = false;
		} else {

			fileIdField.el.dom.readOnly = true;
			titleField.el.dom.readOnly = true;
			fileContentFiled.el.dom.readOnly = true;
			fileSortNameField.el.dom.readOnly = true;
		}
	} else if (editMode == "insert") {
		billStateNameField.setValue("新建");
		billStateIdField.setValue(0);
		publisStateNameField.setValue("未发布");
		publishStateIdField.setValue(0);
		fileAuthorNameField.setValue(REALNAME);
		fileAuthorIdField.setValue(USERID);
		authorDeptNameField.setValue(USERORG);
		authorDeptIdField.setValue(USERDEPTID);
		fileCreatetimeField.setValue(SYS_TIME_STR);
		if(SETTLEMENT=='true'){
		fileSortIdField.setValue('settlement');
		fileSortNameField.setValue('结算管理');
		}else {
		fileSortIdField.setValue(selectedNode.id);
		fileSortNameField.setValue(selectedNode.text);
		}
		reportStatusField.setValue(0);
	}

}