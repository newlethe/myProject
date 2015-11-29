var pid = CURRENTAPPID;
var formPanel;
var Columnsform;
var saveBtn;
var getEquidstore = new Array();
var text;
var getUids;
var getIsleaf;

var pathTree;

var waretypeArr = new Array();

	DWREngine.setAsync(false);
    appMgm.getCodeValue("仓库类别",function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode);    
            temp.push(list[i].propertyName);        
            waretypeArr.push(temp);         
        }
        waretypeArr.push(['',"(空)"]);
    });
	DWREngine.setAsync(true);

	//仓库类别
	var waretypeDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : waretypeArr
	});
	// 设备仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : getEquidstore
			});
	var dsindexid = new Ext.data.SimpleStore({
				fields : [],
				data : [[]]
			});
	var fm = Ext.form; // 包名简写（缩写）
	var fc = { // 创建编辑域配置
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			allowBlank : false,
			anchor : '95%'
		},
		'uids' : {
			id : 'uids',
			name : 'uids',
			fieldLabel : '设备仓库主键',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			allowBlank : false,
			anchor : '95%'
		},
		'equid' : {
			id : 'equid',
			name : 'equid',
			fieldLabel : '系统编码',
			allowBlank : false,
			width : 143,
			anchor : '95%'
		},
		'parentequid' : {
			id : 'parentequid',
			name : 'parentequid',
			fieldLabel : '上一级系统编码',
			readOnly : true,
			disabled : true,
			width : 143,
			anchor : '95%'
		},
		'parentequno' : {
			id : 'parentequno',
			name : 'parentequno',
			fieldLabel : '上一级库区库位编码',
			readOnly : true,
			disabled : true,
			anchor : '95%'
		},
		'equno' : {
			id : 'equno',
			name : 'equno',
			fieldLabel : '库区库位编码',
			width : 143,
			anchor : '95%'
		},
		'detailed' : {
			id : 'detailed',
			name : 'detailed',
			fieldLabel : '详细位置描述',
			width : 143,
			anchor : '95%',
			listeners : {
               blur : function(v,r,m){
               	if(Ext.getCmp('detailed').getValue().length>200){
               	    Ext.example.msg('信息提示！','您输入的【详细位置描述】信息长度大于200字符，请精简相关信息！');
                    return;
               	}
               }
             }
		},
		'memo' : {
			id : 'memo',
			name : 'memo',
			fieldLabel : '备注',
			width : 143,
//			height:100,
			anchor : '95%'
		},
		'isleaf' : {
			id: 'isleaf',
			name : 'isleaf',
			fieldLabel : '是否子节点',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'parent' : {
			id: 'parent',
			name : 'parent',
			fieldLabel : '父节点',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		// "waretype","waretypecode","wareno","warenocode",
		'waretype' : {
			id : 'waretype',
			name : 'waretype',
			fieldLabel : '仓库类别',
			store : waretypeDs,
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			width : 134,
//			allowBlank : false,
			anchor : '95%'
		},
		'waretypecode' : {
			id : 'waretypecode',
			name : 'waretypecode',
			fieldLabel : '仓库类别编号',
			vtype : "alphanum",// 'email'只能有效的Email,'alpha'只能输入字母,'alphanum'只能输入数字和字母,'url'只能输入url
			vtypeText : "只能输入数字和字母！",
			emptyText : "只能输入数字和字母",
			width : 150,
//			allowBlank : false,
			anchor : '95%'
		},
		'wareno' : {
			id : 'wareno',
			name : 'wareno',
			fieldLabel : '仓库号',
			width : 150,
//			allowBlank : false,
			anchor : '95%'
		},
		'warenocode' : {
			id : 'warenocode',
			name : 'warenocode',
			fieldLabel : '仓库号编号',
			vtype : "alphanum",
			vtypeText : "只能输入数字和字母！",
			emptyText : "只能输入数字和字母",
			width : 150,
//			allowBlank : false,
			anchor : '95%'
		}
	}
	// 3. 定义记录集
	Columnsform = [{
				name : 'pid',
				type : 'string'
			}, {
				name : 'uids',
				type : 'string'
			}, {
				name : 'parentequid',
				type : 'string'
			}, {
				name : 'equid',
				type : 'string'
			}, {
				name : 'equidBox',
				type : 'string'
			}, {
				name : 'parentequno',
				type : 'string'
			}, {
				name : 'equno',
				type : 'string'
			}, {
				name : 'detailed',
				type : 'string'
			}, {
				name : 'memo',
				type : 'string'
			}, {
				name : 'isleaf',
				type : 'float'
			}, {
				name : 'parent',
				type : 'string'
            }, {
				name : 'waretype',
				type : 'string'
			}, {
				name : 'waretypecode',
				type : 'string'
			}, {
				name : 'wareno',
				type : 'string'
			}, {
				name : 'warenocode',
				type : 'string'
			}];

	// 6. 创建表单form-panel
	saveBtn = new Ext.Button({
				name : 'save',
				text : '保存',
				iconCls : 'save',
				handler : formSave
			})
	var comboxWithTree = new Ext.form.ComboBox({
		id : 'parentequno',
		name : 'parentequno',
		fieldLabel : '上一级库区库位编码',
		readOnly : true,
		mode : 'local',
		editable : false,
		allowBlank : false,
		listWidth : 200,
		maxHeight : 400,
		triggerAction : 'all',
		store : dsindexid,
		tpl : "<tpl for='.'><div style='height: 200px'><div id='tree'></div></div></tpl>",
		listClass : 'x-combo-list-small',
		anchor : '95%'
	})
	comboxWithTree.on('expand', function() {
				newtreePanel.on('beforeload', function(node) {
					var parent = node.attributes.equid;
					if (parent == null)
						parent = '01';
					var baseParams = newtreePanel.loader.baseParams
					baseParams.orgid = Ext.getCmp("equid").getValue();
					baseParams.parent = parent;
				})
				newtreePanel.render('tree');
				newroot.reload();
//				newroot.expand(true);
			});
	newtreePanel.on('click', function(node) {
		        var parentEquid = node.attributes.equid;
		        var parentEquno = node.attributes.equno;
		        var equid = Ext.getCmp("parentequid").getValue();
		        var equno = Ext.getCmp("parentequno").getValue();
				getUids = node.attributes.uids;
				getIsleaf = node.attributes.isleaf;
				if(parentEquid != equid &&  parentEquno != equno){
						Ext.getCmp("parentequid").setValue(node.attributes.equid)
						Ext.getCmp("parent").setValue(node.attributes.equid)
						comboxWithTree.setValue(node.attributes.equno);
						comboxWithTree.collapse();
						DWREngine.setAsync(false);
						equBaseInfo.getActequid(node.attributes.equid, pid,0, function(list) {	
									formPanel.getForm().findField("equid").setValue(list);
						pathTree = node.getPath() + "/" + list;
								})
						DWREngine.setAsync(true);
                }else{
					comboxWithTree.collapse();
                }
			});

    Ext.form.Field.prototype.msgTarget = 'qtip';// 提示的方式，枚举值为"qtip","title","under","side",id(元素id)
	formPanel = new Ext.FormPanel({
				id : 'form-panel',
				header : false,
				border : false,
				width : 320,
				height : 200,
				split : true,
				collapsible : true,
				collapsed : true,
				collapseMode : 'mini',
				minSize : 500,
				maxSize : 400,
				border : false,
				region : 'east',
				bodyStyle : 'padding:10px 10px; border:0px dashed #3764A0',
				iconCls : 'icon-detail-form', // 面板样式
				labelAlign : 'left',
				items : [
						new Ext.form.FieldSet({
									title : '设备仓库编辑页',
									id : 'formFieldSet',
									layout : 'form',
									width : 300,
									border : true,
									items : [
											new fm.TextField(fc['parentequid']),
											comboxWithTree,
											new fm.TextField(fc['equid']),
											new fm.TextField(fc['equno']),
											new fm.ComboBox(fc['waretype']),
											new fm.TextField(fc['waretypecode']),
											new fm.TextField(fc['wareno']),
											new fm.TextField(fc['warenocode']),
											new fm.TextField(fc['detailed']),
											new fm.TextArea(fc['memo']),
											saveBtn]
								}),
                        new fm.Hidden(fc['isleaf']),
						new fm.Hidden(fc['parent']),
						new fm.Hidden(fc['uids']),
						new fm.Hidden(fc['pid'])]
						
			});
	function formSave() {
		var form = formPanel.getForm();
        if(!form.isValid()){
            Ext.example.msg('提示信息','数据填写出错！');
            return;
        }
		saveBtn.setDisabled(true);
		if (getBtnId == "menu_add") {
			saveBtn.setDisabled(false);
			doFormSave(getBtnId);
			equBaseInfo.getActequid(formPanel.getForm().findField("parentequid").getValue(), pid,0, function(list) {
				formPanel.getForm().findField("equid").setValue(list);
			});
		    DWREngine.setAsync(true);
			formPanel.getForm().findField('uids').setValue("");
			formPanel.getForm().findField('equno').setValue("");
			formPanel.getForm().findField('memo').setValue("");
			formPanel.getForm().findField('detailed').setValue("");
			formPanel.getForm().findField('equid').el.dom.disabled = true;
			formPanel.getForm().findField('isleaf').setValue("1");
			
		} else if (getBtnId == "menu_update") {
			doFormSave(getBtnId);
		}
	}
	function doFormSave(flag) {
		var form = formPanel.getForm();
		var getparenteEquid = formPanel.getForm().findField("parentequid").getValue();
		var getEquno = formPanel.getForm().findField("equno").getValue();
		var getEquid = formPanel.getForm().findField("equid").getValue();
		var getuids = formPanel.getForm().findField("uids").getValue();
		var getMemo = formPanel.getForm().findField("memo").getValue();
		var detailedS = formPanel.getForm().findField("detailed").getValue();
		if(detailedS.length>200){
		    setTimeout(function(){
		        Ext.example.msg('信息提示！', '您输入的【详细位置描述】信息字数过长，请控制在【<span style="color:red;">200</span>】字内！');
		    },1500)
		    saveBtn.setDisabled(false);
		    return;
		}
		if(getMemo.length>200){
		    setTimeout(function(){
		        Ext.example.msg('信息提示！', '您输入的【备注】信息字数过长，请控制在【<span style="color:red;">200</span>】字内！');
		    },1500)
		    saveBtn.setDisabled(false);
		    return;
		}
	    if(getEquno==""||getEquno==null){
			    Ext.Msg.alert("信息提示","请输入<font style='color:red;'>库区库位编码!</font>");
			    saveBtn.setDisabled(false);
			    return;
	    }
		var rec = treeGrid.getSelectionModel().getSelected();
		var obj = new Object();
	    var equid ="";
	    var uids ="";
		for (var i = 0; i < Columnsform.length; i++) {
			var name = Columnsform[i].name;
//			if(name == "parentequid") continue;
			var field = form.findField(name);
			if (field != null) {
				obj[name] = field.getValue();
			}
		}
		if(rec==null||rec==""){
		    equid = "0";
		    uids = "0";
		}else{
		    equid = rec.data.equid;
		    uids = rec.data.uids;
		}
		treeGrid.getEl().mask("loading...");
		DWREngine.setAsync(false);
		equBaseInfo.addOrUpdateEquWarehouseNew(obj,function(text) {
			if (text == "addSuccess") {
					// if (getIsleaf == 1) {
					// baseDao.updateBySQL(
					// "update equ_warehouse t set t.isleaf='0' where t.pid='"
					// + pid + "' and t.uids='"
					// + getUids + "'",
					// function() {
					// })
					// }waretypecode
				    formPanel.getForm().findField("waretype").setValue("");
				    formPanel.getForm().findField("waretypecode").setValue("");
				    formPanel.getForm().findField("wareno").setValue("");
				    formPanel.getForm().findField("warenocode").setValue("");
				    formPanel.getForm().findField("detailed").setValue("");
				    formPanel.getForm().findField("memo").setValue("");
					Ext.example.msg('保存成功！', '您成功保存了一条仓库信息！');
					saveBtn.setDisabled(false);
				} else if(text =='updateSuccess'){
					Ext.example.msg('保存成功！', '您成功修改了一条仓库信息！');
					formPanel.collapse();
				}else{
					Ext.example.msg('信息提示！', '保存失败！');
				}
			})
		DWREngine.setAsync(true);
		if(rec==null||rec==""){
		     store.load();
		}else{
			store.load();
			selectCrrentTreeNode();//定位到上次选择的节点处
		}
		treeGrid.getEl().unmask();

	}
	// 定位到上次选择的树节点
	function selectCrrentTreeNode() {
		if(!pathTree){
			var rec = treeGrid.getSelectionModel().getSelected();
			pathTree = store.getPath(rec, "equid");
		}
		store.on("load",function(){
			if(pathTree)store.expandPath(pathTree, "equid");
			store.on('expandnode',function(ds,rc){
				if(pathTree && pathTree!="") {
					var equidArr = pathTree.split("/");
					if(rc.get("equid") == equidArr.pop()){
						treeGrid.getSelectionModel().selectRow(ds.indexOf(rc));
					}
				}
			});
		});
	}
	function formCancel() {
		formPanel.getForm().reset();
	}