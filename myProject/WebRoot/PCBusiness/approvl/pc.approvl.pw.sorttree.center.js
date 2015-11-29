var treePanel, treeLoader;
var formPanel;
var rootNode, selectNode, selectPath;
var tempNode;
var indTypeCombo, secondCompany = new Array(), pwLevel = [['0', '无']];

var FormRecord = Ext.data.Record.create([{
			name : 'uids',
			type : 'string'
		}, {
			name : 'pid',
			type : 'string'
		}, {
			name : 'classifyName',
			type : 'string' 
		}, {
			name : 'classfiyNo',
			type : 'string'
		}, {
			name : 'classfiyNoPre',
			type : 'string'
		},{
			name : 'lastOperator',
			type : 'string'
		}, {
			name : 'memo',
			type : 'string'
		}, {
			name : 'leaf',
			type : 'string'
		}, {
			name : 'industryType',
			type : 'string'
		}, {
			name : 'parentid',
			type : 'string'
		}, {
			name : 'unitid',
			type : 'string'
		}]);

var RW = (ModuleLVL < 3 ? true : false);// 读写权限

Ext.onReady(function() {
	DWREngine.setAsync(false);
	appMgm.getCodeValue('批文等级', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					pwLevel.push(temp);
				}
			});

	if (USERBELONGUNITTYPEID == "0") {// 目前登录用户是集团用户
		var _SQL = "select unitid, unitname from sgcc_ini_unit where unit_type_id='2'";
		baseMgm.getData(_SQL, function(list) {
					for (var i = 0; i < list.length; i++) {
						secondCompany.push(list[i]);
					}
				});
	} else if (USERBELONGUNITTYPEID == "2") {// 目前登录用户是二级企业用户
		secondCompany.push([USERBELONGUNITID, USERBELONGUNITNAME])
	} else {
		var _SQL = "select unitid, unitname from sgcc_ini_unit where unit_type_id='2' connect by prior upunit=unitid start with unitid = '"
				+ USERBELONGUNITID + "'";
		baseMgm.getData(_SQL, function(list) {
					for (var i = 0; i < list.length; i++) {
						secondCompany.push(list[i]);
					}
				});

	}

	DWREngine.setAsync(true);

	indTypeCombo = new Ext.form.ComboBox({
				name : 'indType',
				readOnly : true,
				width : 200,
				store : new Ext.data.SimpleStore({
							fields : ['k', 'v'],
							data : secondCompany
						}),
				valueField : 'k',
				displayField : 'v',
				value : (secondCompany.length > 0 ? secondCompany[0][0] : ''),
				triggerAction : 'all',
				mode : 'local',
				listeners : {
					select : function(combo, record, index) {
						formPanel.enable = true;
						formPanel.collapse(true);
						treeLoader.baseParams.unitid = record.get('k');
						root.reload();
						treePanel.getSelectionModel().select(root);
					}
				}
			});
	// 创建编辑域配置
	var fc = {
		'uids' : {
			name : 'uids',
			fieldLabel : '唯一约束',
			xtype : 'textfield',
			readOnly : true, // 部署时设为true
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '保留字',
			xtype : 'hidden',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'unitid' : {
			name : 'unitid',
			fieldLabel : '集团二级公司编号',
			xtype : 'textfield',
			value : USERBELONGUNITID, // 在此处设置unitid的初始化值
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'classifyName' : {
			name : 'classifyName',
			fieldLabel : '分类名称',
			xtype : 'textfield',
			allowBlank : false,
			anchor : '95%'
		},'classfiyNo' : {
			name : 'classfiyNo',
			xtype : 'textfield',
			fieldLabel : '批文分类编号',  //真实的批文分类编号, 新建的时候后台返回一个批文分类编号
			readOnly : true, // 部署时设为true
			allowBlank : false,
			fieldClass: "x-item-disabled",
			anchor : '95%'
		},
		'classfiyNoPre' : {
			name : 'classfiyNoPre',
			xtype : 'textfield',
			fieldLabel : '分类编号',    //伪装的批文分类编号,可以手动修改,在保存的时候判断唯一性就可以了
			readOnly : false, // 部署时设为true
			allowBlank : false,
//			fieldClass: "x-item-disabled",
			anchor : '95%'
			//添加监听, 不让该区域别选中
//			listeners:{
//						blur: function(o){
//							var flag = false;
//							var n_num = o.getValue();
//							var id = o.getId();
//							var err = "编号被占用!";
//							DWREngine.setAsync(false);
//								baseDao.findByWhere2("com.sgepit.pcmis.approvl.hbm.PcPwSortTree", 
//																	"CLASSFIY_NO_PRETEND='"+n_num+"'",function(list){
//									if(list.length>0)
//									{
//										if(list[0].uids != formPanel.getForm().findField('uids').getValue())
//										{
//											flag = true;
//										}
//									}
//								});
//							DWREngine.setAsync(true);
//							
//							if(flag)
//							{
//								showerr(o, err);
//							}
//						}
//			}
		},
		'lastOperator' : {
			name : 'lastOperator',
			xtype : 'textfield',
			fieldLabel : '最后一次操作人',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'memo' : {
			name : 'memo',
			fieldLabel : '备注',
			xtype : 'textarea',
			height: 120,
			anchor : '95%'
		},
		'leaf' : {
			name : 'leaf',
			fieldLabel : '是否子节点',
			xtype : 'hidden',
			hidden : true,
			hideLabel : true
		},
		'industryType' : {
			name : 'industryType',
			fieldLabel : '产业类型',
			xtype : 'hidden',
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'parentid' : {
			name : 'parentid',
			fieldLabel : '父节点ID',
			xtype : 'hidden',
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'pwLevel' : {
			name : 'pwLevel',
			id:'level',
			fieldLabel : '批文等级',
			xtype : 'combo',
			anchor : '95%',
			mode: 'local',
			readOnly : false,
			allowBlank: false,
			emptyText: '请选择批文等级',
			store : new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : pwLevel
					}),
			valueField : 'k',
			displayField : 'v',
			triggerAction : 'all',
			onTriggerClick:function(){
		        if(this.disabled){
		            return;
		        }
		        if(this.isExpanded()){
		            this.collapse();
		            this.el.focus();
		        }else {
		            this.onFocus({});
		            if(this.triggerAction == 'all') {
		                this.doQuery(this.allQuery, true);
		            } else {
		                this.doQuery(this.getRawValue());
		            }
		            this.el.focus();
		        }
		    },
		    width: 275
		}
	}
	
	formPanel = new Ext.FormPanel({
				width : 250,
				height :200,
				border : false,
				layout : 'column',
				region : 'east',
				collapsible : true,
				collapsed : true,
				collapseMode : 'mini',
				split : true,
				bodyStyle : 'padding:10px 10px; border:0px dashed #F0F4F5',
				labelAlign : 'top',
				enable : true,
				items:[		
					{
		    			autoWidth:true,
		    			autoHight: true,
		                border: false,
		                labelWidth: 60,
		                layout: 'column',
						items : [
							{
									layout : 'form',
									border : false,
									columnWidth : 1,
									defaults : { 
										width : 200
									},
									items : [
										new Ext.form.TextField(fc['classifyName']),
										{
							    			xtype:'panel',
							    			baseCls:"x-plain",
							    			height:15
							    		},
										new Ext.form.NumberField(fc['classfiyNoPre']),
										{
							    			xtype:'panel',
							    			baseCls:"x-plain",
							    			height:15
							    		},
										new Ext.form.ComboBox(fc['pwLevel']),
										{
							    			xtype:'panel',
							    			baseCls:"x-plain",
							    			height:15
							    		},
										new Ext.form.Hidden(fc['classfiyNo']),
										new Ext.form.TextArea(fc['memo']),
										new Ext.form.Hidden(fc['uids']),
										new Ext.form.Hidden(fc['pid']),
										new Ext.form.Hidden(fc['lastOperator']),
										new Ext.form.Hidden(fc['leaf']),
										new Ext.form.Hidden(fc['unitid']),
										new Ext.form.Hidden(fc['parentid'])
									]
							}],
					buttonAlign : 'left',
					buttons : [{
								name : 'save',
								text : '保存',
								iconCls : 'save',
								hidden : !RW,
								handler : formSave
							},{
								name : 'cancle',
								text : '取消',
								iconCls : 'remove',
								align: 'right',
								handler: cancleFun
							}]
				}],
				listeners : {
					beforecollapse : function(p) {
						var b = p.enable;
						p.enable = false;
						return b;
					},
					beforeexpand : function(p) {
						var b = p.enable;
						p.enable = false;
						return b;
					},
					checkchange : function(node, checked) {
						node.expand();
						node.attributes.checked = checked;
						node.eachChild(function(child) {
									child.ui.toggleCheck(checked);
									child.attributes.checked = checked;
									child.fireEvent('checkchange', child,
											checked);
								})
					}
				}
			});
	// 批文分类树对象构造
	root = new Ext.tree.AsyncTreeNode({
				text : '批文分类',
				iconCls : 'form',
				classfiyNo : '0',
				expanded : true,
				id : '0'
			})
	treeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "pwsortTree",
					businessName : "approvlMgm",
					parent : "0",
					unitid : (secondCompany.length > 0
							? secondCompany[0][0]
							: '')
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	treePanel = new Ext.tree.ColumnTree({
		id : 'approvl-tree',
		iconCls : 'icon-by-category',
		region : 'center',
		frame : false,
		border : false,
		rootVisible : true,
		lines : true,
		autoScroll : true,
		animate : false,
		tbar : [{
					iconCls : 'icon-expand-all',
					tooltip : '全部展开',
					handler : function() {
						root.expand(true);
					}
				}, '-', {
					iconCls : 'icon-collapse-all',
					tooltip : '全部折叠',
					handler : function() {
						root.collapse(true);
					}
				}, '-',{
					xtype : 'tbspacer',
					hidden : !RW
				}, {
					id: 'tree_add',
					text : '新增',
					iconCls : 'add',
					hidden : !RW,
					handler : addHandler
				}, '-',{
					xtype : 'tbspacer',
					hidden : !RW
				}, {
					id: 'tree_edit',
					text : '修改',
					disabled: true,
					iconCls : 'btn',
					hidden : !RW,
					handler : editHandler
				}, '-',{
					xtype : 'tbspacer',
					hidden : !RW
				}, {
					id: 'tree_delete',
					text : '删除',
					iconCls : 'remove',
					hidden : !RW,
					disabled: true,
					handler : delHandler
				}, '-',{
					xtype : 'tbspacer',
					hidden : !RW
				}, '&nbsp;&nbsp;&nbsp;集团二级公司:&nbsp;&nbsp;', indTypeCombo],
		columns : [{
					header : '批文分类名称',
					width : 400,
					dataIndex : 'classifyName'
				}, {
					header : '批文分类编号',
					width : 200,
					dataIndex : 'classfiyNoPre'
				}, {
					header : '批文等级',
					width : 200,
					dataIndex : 'pwLevel'
				}, {
					header : '备注',
					width : 200,
					dataIndex : 'memo',
					renderer: function(value){
						 return "<a title="+value+">"+value+"</a>";
					}
				}],
		loader : treeLoader,
		root : root,
		listeners : {
			beforeload : function(node, e) {
				var parentid = node.attributes.classfiyNo;
				if (parentid == null || parentid == "" || parentid == undefined) {
					parentid = "0";
				}
				var baseParams = treePanel.loader.baseParams
				baseParams.parent = parentid;
			},
			click : function(node, e) {
				
				//根节点和普通父节点"增加","删除","修改"都是可以使用状态, "修改"的功能在给提示"父节点不能直接删除"后不执行删除方法
				if(node.hasChildNodes())
				{
					Ext.getCmp("tree_delete").enable();
					Ext.getCmp("tree_add").enable();
					Ext.getCmp("tree_edit").enable();
				}
				else   
				{
					//子批文分类, 并且该子批文分类有具体的可以办理的批文, 新增, 修改, 删除按钮都不可以使用
//					if(node.attributes.disabled)
//					{
//						Ext.getCmp("tree_delete").disable();
//						Ext.getCmp("tree_add").disable();
//						Ext.getCmp("tree_edit").disable();
//					}
//					else  //"未办理"状态子节点
//					{	
//						Ext.getCmp("tree_delete").enable();
//						Ext.getCmp("tree_add").enable();
//						Ext.getCmp("tree_edit").enable();
//					}
					var delNumber = node.attributes.classfiyNo;
					
					var getPathSQL = "select nodepath from pc_pw_approval_mgm  where REGEXP_LIKE(nodepath,'"+delNumber+"+')";
//					var getPathSQL = "select nodepath from pc_pw_approval_mgm  where REGEXP_LIKE(nodepath,'10301+')";
					DWREngine.setAsync(false);
						baseMgm.getData(getPathSQL, function(list){
							if(list=='')
							{
								Ext.getCmp("tree_delete").enable();
//								Ext.getCmp("tree_add").enable();
								Ext.getCmp("tree_edit").enable();
							}
							else
							{
								Ext.getCmp("tree_delete").disable();
//								Ext.getCmp("tree_add").disable();
								Ext.getCmp("tree_edit").disable();
							}
						})
					DWREngine.setAsync(true);
				}
				node.expand();
				formPanel.enable = true;
				formPanel.collapse();
			}
		}
	});
	
	var viewport = new Ext.Viewport({
						layout : 'border',
						items : [treePanel, formPanel]
					});
					
	formPanel.collapse();
	// 使用键盘上的Delete键弹出删除提示
	keymap = new Ext.KeyMap(treePanel.id, {
			key : Ext.EventObject.DELETE,
			stopEvent : true,
			fn : function() {
				if (treePanel.getSelectionModel().getSelectedNode()) {
					delHandler();
				}
			}
		});
		
});//Ext.onReady结束


function addHandler() {
	var selNode = treePanel.getSelectionModel().getSelectedNode();
	if (!selNode) {
		Ext.example.msg('提示', '请您选中一个批文分类!')
		return;
	} else {
		var unitid = indTypeCombo.getValue();  //在集团二级公司新建第一个批文的时候选中的根节点是没有unitid属性的
		DWREngine.setAsync(false);
		var sql_maxbh = "select max(classfiy_no) maxNo,count(classfiy_no) countNo from PC_PW_SORT_TREE where "
				+ "parentId='" + selNode.attributes.classfiyNo + "'and unitid='" + unitid + "'";
		baseMgm.getData(sql_maxbh, function(list) {
					if (list.length == 1) {
						var fNo = selNode.attributes.classfiyNo;
						var id = selNode.attributes.unitid;
						var classfiyNo = (fNo == "0" ? unitid+"01" : (fNo + "01"));
						if (list[0][1] != 0) {
							var tmp = parseInt(("1" + list[0][0]), 10);
							if (!isNaN(tmp)) {
								classfiyNo = (tmp + 1 + "").substring(1);
							} else {
								classfiyNo = tmp + "01"
							}
						}
						var loadFormRecord1 = new FormRecord({
									uids : null,
									pid : '',
									classifyName : '',
									classfiyNo : classfiyNo,
									lastOperator : USERID,
									memo : '',
									leaf : 1,
									industryType : indTypeCombo.getValue(),
									unitid : indTypeCombo.getValue(),
									pwLevel: '0',
									parentid : selNode.attributes.classfiyNo
								});
						formPanel.getForm().loadRecord(loadFormRecord1);
						formPanel.enable = true;
						formPanel.expand();
					} 
				});
		DWREngine.setAsync(true);
	}
}

function editHandler() {
	var selNode = treePanel.getSelectionModel().getSelectedNode();
	if (!selNode||(selNode.parentNode==null)) {
		Ext.example.msg('提示', '请您选中一个批文分类!')
	} else {
		if (selNode.id == "0")
		{
			Ext.example.msg('提示', '根节点不可以编辑!')
			return;
		}
		
		if(selNode.hasChildNodes() && selNode.id!="0")  //是一个批文分类
		{
			if(hasPwStatIsZero(selNode)=="1")
			{
				formPanel.getForm().findField('pwLevel').el.dom.readonly = true;
				formPanel.getForm().findField('pwLevel').el.dom.disabled = true;
				Ext.apply(Ext.getCmp('level'),{disabled :true});
				
				formPanel.getForm().findField('memo').el.dom.readOnly = true;
				formPanel.getForm().findField('memo').el.dom.disabled = true;
			}
		}
		formPanel.getForm().loadRecord(new FormRecord(selNode.attributes));
		formPanel.enable = true;
		formPanel.expand();
	}

}

//点formPanel的取消按钮执行下列函数
function cancleFun()
{
	formPanel.enable = true;
	formPanel.collapse(true);
}

function formSave() {
	var selNode = treePanel.getSelectionModel().getSelectedNode();
	var form = formPanel.getForm();
	//对备注内容长度进行判断,如果超过200字符立即返回并提示
	var pwMemo = form.findField('memo').getValue();
	var pwName = form.findField('classifyName').getValue();
//	form.findField('leaf').setValue('1');
	//判断伪批文分类编号,如果该编号已经存在, 立刻返回并提示用户修改编号
	var classfiyNoPre = form.findField('classfiyNoPre').getValue();
	
	if(bytesOfString(pwName)>200)
	{
		Ext.Msg.show({
			title: '提示',
			msg: '批文名称长度超出系统允许范围!',
			buttons: Ext.Msg.OK,
			icon: Ext.MessageBox.INFO
		});
		return;
	}
	
	if(bytesOfString(pwMemo)>200)
	{
		Ext.Msg.show({
			title: '提示',
			msg: '备注内容长度超出系统允许范围!',
			buttons: Ext.Msg.OK,
			icon: Ext.MessageBox.INFO
		});
		return;
	}

	var recordIsNew = form.findField("uids").getValue();  //记录主键值, 如果没有表示新增记录
	var isInsert;            //标志是新增一条记录
	if (recordIsNew == null || recordIsNew == "")
		isInsert = true;
	else
		isInsert = false;
		
	var flag = false;  //判断编号是否被使用, 如果是新建的并且编号已经被使用已被占用,该项为true,返回并给用户提示
	DWREngine.setAsync(false);
		baseDao.findByWhere2("com.sgepit.pcmis.approvl.hbm.PcPwSortTree", 
											"CLASSFIY_NO_PRETEND='"+classfiyNoPre+"'",function(list){
			if(list.length>0)
			{
				if(list[0].uids != form.findField('uids').getValue())
				{
					flag = true;
				}
			}
		});
	DWREngine.setAsync(true);
	
	if(flag)
	{
		Ext.Msg.show({
					title: '提示',
					msg: '该编号已被被使用, 请使用其他编号!',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO
				});
		return;
	};	
	
	if (form.isValid()) {
		var hbm = form.getValues();
		approvlMgm.addOrUpdateApprovlPWSort(hbm, function(success) {
					if (success) {
						form.reset();
						var selNode = treePanel.getSelectionModel().getSelectedNode();
						if (selNode) {
							try {
								selNode.reload = root.reload
								selNode.expand = root.expand
								selNode.loadComplete = root.loadComplete
								//根节点
								if(selNode.getDepth()==0)
								{
//									formPanel.enable = true;
//									formPanel.collapse();
									root.reload();
								}
								//普通节点
								else if(selNode.parentNode && selNode.parentNode.reload)
								{
									selNode.parentNode.reload();
									if (isInsert) 
									{	
//										formPanel.enable = true;
//										formPanel.collapse();
									}
									else 
									{
										selNode.setText(hbm.classifyName);
//										formPanel.enable = true;
//										formPanel.collapse();
									}
									    formPanel.enable = true; 
										formPanel.collapse();
								}
								else 
								{
									root.reload();
								}
							} catch (e) {
							}

						}
					} else {
						alert('操作失败！')
					}
				})
	} else {
		Ext.example.msg('提示', '数据不完整');
		return;
	}
}

// 删除批文分类
function delHandler() {
	var delNode = treePanel.getSelectionModel().getSelectedNode();
	if (!delNode) {
		Ext.example.msg('提示', '请您选中一个批文分类!');
		return;
	}
	if (delNode.hasChildNodes()) {
		Ext.example.msg('提示', '父节点不能直接删除操作,请先删除该节点下的子节点！');
		return
	}
	
	var show = Ext.Msg.show({
				title : '提示',
				msg : '是否确定删除批文:[' + delNode.attributes.classifyName + '] ['
						+ delNode.attributes.classfiyNoPre + ']?',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				animEl : formPanel.id,
				fn : function(value) {
					if (value == 'yes') {
						var mask = new Ext.LoadMask(Ext.getBody(), {
									msg : "正在删除..."
								});
						approvlMgm.deleteApprovlClassfiyByNO(
								delNode.attributes.classfiyNo, function(flag) {
									if (flag) {
										Ext.example.msg('删除成功！',
												'您成功删除了一条批文分类信息！');
										delNode.parentNode.reload();
									} else {
										Ext.Msg.show({
													title : '提示',
													msg : '数据保存失败！',
													buttons : Ext.Msg.OK,
													icon : Ext.MessageBox.ERROR
												});
									}
									mask.destroy();
								});
					}
				}
			});
			
		show.getDialog().setPosition(event.x ,event.y+50);	
}

//判断一个字符串有多少个字节,返回该字符串字节数
function bytesOfString(str)
{
	var bytesCount = 0;
	if(null==str||str.length==0)
	{
		return 0;
	}
	
	for(var i=0; i<str.length; i++)
	{
		var c = str.charAt(i);
		if (/^[\u0000-\u00ff]$/.test(c))   //
		{
			//非双字节的编码字节数只+1
			bytesCount += 1;
		}
		else
		{   
			//双字节的编码(比如汉字)字节数+2
			bytesCount += 2;
		}
	}
	
	return bytesCount;
}

//判断某个批文分类下是否有一个批文是"办理中","已办理状态"
function hasPwStatIsZero(node)
{
	var flag = "0";
	if(null==node)
		return flag;
		
	node.eachChild(function(child){
		if(child.disabled)
		{
			flag = "1";
			return;
		}
		
		if(child.hasChildNodes())
		{
			hasPwStatIsZero(child);
		}
	})
	
    return flag;
}
