var treePanel, treeLoader;
var rootNode, selectNode, selectPath
var treeNodeUrl = CONTEXT_PATH
		+ "/servlet/ComFileSortServlet?method=buildAllTreeByDeptAndChild&parentId="
		+ g_rootId + "&deptId=" + USERDEPTID;
var editable = ModuleLVL == '1';
var syncLabel = new Ext.form.Label({
	text : '',
	cls : 'syncLabel'
});
//下发窗口变量
var smTbUnit,gridTbUnitWin,gridTbUnit,toolbarItemsUnit,saveTbUnit,pageToolbarTbUnit;
var dataGridRsTbUnit,dataGridDsReaderTbUnit,dsResultTbUnit, columnModelTbUnit;
var rootNameLabel = new Ext.Toolbar.Button({
	id:"rootNameLabelId",
	cls : 'syncLabel'
});
var mask;
//分类选择根节点初始值
 var curRootId=g_rootId;
Ext.onReady(function() {
	if (isAdmin == '1') {
		// 若是维护模块中的页面则开放所有节点
		treeNodeUrl = CONTEXT_PATH
				+ "/servlet/ComFileSortServlet?method=buildAllTreeByDept&parentId="
				+ g_rootId;
	} else if (isSortIssue == '1' && DEPLOY_UNITTYPE == 'A') {
		// 若是具有下发分类功能的模块，则部署在接收方的程序可以查看到所有节点（不过滤权限）
		treeNodeUrl = CONTEXT_PATH
				+ "/servlet/ComFileSortServlet?method=buildAllTreeByDept&parentId="
				+ g_rootId;
	} else {
		// 管理员可以看到所在机构及其所属机构具有权限的节点
		treeNodeUrl = CONTEXT_PATH
				+ "/servlet/ComFileSortServlet?method=buildAllTreeByDeptAndChild&parentId="
				+ g_rootId + "&deptId=" + USERDEPTID;
	}

	rootNode = new Ext.tree.AsyncTreeNode({
				text : g_rootName,

				id : g_rootId,
				desc : g_rootBh
			});
	treeLoader = new Ext.tree.TreeLoader({
				dataUrl : treeNodeUrl,
				requestMethod : "GET"
			});
	treeLoader.on("load", function(obj, node, rsp) {
				treePanel.expandAll();
				if (selectNode) {
					treePanel.fireEvent("click", selectNode);
				} else {
					selectNode = node;
					treePanel.fireEvent("click", node);
				}
				if (isSortIssue == '1' && DEPLOY_UNITTYPE == '0') {

					var curRoot = node.firstChild;
					if (curRoot) {
						var isSync = curRoot.attributes.isSync;
						var syncText = '(未下发)';
						if (isSync == '1') {
							syncText = '(已下发)';
						}
						//Ext.get(syncLabel.getEl()).update(syncText);
					}
				}
			});
	var tbarItems = [{
				iconCls : 'icon-expand-all',
				tooltip : '全部展开',
				handler : function() {
					rootNode.expand(true);
				}
			}, '-', {
				iconCls : 'icon-collapse-all',
				tooltip : '全部折叠',
				handler : function() {
					rootNode.collapse(true);
				}
			}];
								
	if (isSortIssue == '1' && DEPLOY_UNITTYPE == '0') {
		tbarItems.push('->', {
					text : '下发分类',
					scope:treePanel,
					tooltip : '下发当前模块所有的分类信息及权限设置',
					handler : function() {

/*						Ext.MessageBox.confirm("下发分类", "是否要将本模块所有的分类信息进行下发？",
								function(btn) {

									if (btn == "yes") {
										var mask = new Ext.LoadMask(Ext
														.getBody(), {
													msg : "正在交换数据..."
												});
										mask.show();
										ComFileSortDWR.issueFileSort(g_rootId,
												function(retVal) {
													mask.hide();
													if (retVal == 'success') {
														Ext.Msg.alert("操作提示",
																"下发成功!");
														rootNode.reload();
													} else {
														Ext.Msg
																.alert(
																		"操作提示",
																		"下发失败: "
																				+ retVal);
													}

												});
									}

								});*/
						
						//下发分类窗口GIRD选择列表
							dataGridRsTbUnit = Ext.data.Record.create([{
									name : 'unitid',
									type : 'string'
								}, {
									name : 'unitname',
									type : 'string'
								}, {
									name : 'upunit',
									type : 'string'
								}, {
									name : 'appUrl',
									type : 'string'
								}, {
									name : 'state',
									type : 'string'
								}]);
										
							dataGridDsReaderTbUnit = new Ext.data.JsonReader({
									id : "unitid",
									root : 'topics',
									totalProperty : 'totalCount'
								}, dataGridRsTbUnit)				
							dsResultTbUnit = new Ext.data.Store({
										proxy : new Ext.data.HttpProxy({
													url : CONTEXT_PATH
															+ '/servlet/ComFileSortServlet'
												}),
										reader : dataGridDsReaderTbUnit
									});	
							dsResultTbUnit.sort('state','DESC');
							dsResultTbUnit.on("beforeload", function(ds1) {
										Ext.apply(ds1.baseParams, {
													method : 'getIssueFileSortUnit',
													g_rootId : g_rootId
												})
									});	
							smTbUnit = new Ext.grid.CheckboxSelectionModel({
		
							});									
							columnModelTbUnit = new Ext.grid.ColumnModel([smTbUnit, 
									 {
										header : '单位ID',
										dataIndex : 'unitid',
										align : 'center',
										hidden:true,
										width : 12
									}, 
									 {
										header : '单位名称',
										dataIndex : 'unitname',
										align : 'left',
										width :260
									},  
									{
										header : '状态',
										dataIndex : 'state',
										align : 'center',
										width : 81,
										renderer:function(value){
											return value=="1"?"已下发":"未下发";
										}
						
									}]);						
							 pageToolbarTbUnit=new Ext.PagingToolbar({
											pageSize : PAGE_SIZE,
											beforePageText : "第",
											afterPageText : "页, 共{0}页",
											store : dsResultTbUnit,
											displayInfo : true,
											firstText : '第一页',
											prevText : '前一页',
											nextText : '后一页',
											lastText : '最后一页',
											refreshText : '刷新',
											displayMsg : '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
											emptyMsg : "无记录。"
										});						
							saveTbUnit = new Ext.Toolbar.Button({
										id : 'saveTbUnit',
										iconCls : 'save',
										text : "下发",      
										handler : saveTbUnitFun
									});	
							toolbarItemsUnit= [saveTbUnit];	
							rootNameLabel = new Ext.Toolbar.Button({
								id:"rootNameLabelId",
								cls : 'syncLabel'
							});							
							rootNameLabel.setText("<font color=red>"+"["+g_rootName+"]"+"</font>");								
							toolbarItemsUnit.push('->', rootNameLabel);										
							// 创建Grid
							gridTbUnit = new Ext.grid.GridPanel({
										id : 'file-grid',
										ds : dsResultTbUnit,
										cm : columnModelTbUnit,
										sm : smTbUnit,
										region : 'center',
										layout : 'anchor',
										autoScroll : true, // 自动出现滚动条
										collapsible : false, // 是否可折叠
										animCollapse : false, // 折叠时显示动画
										loadMask : true, // 加载时是否显示进度
										stripeRows : true,
										viewConfig : {
											//forceFit : true
										},
										bbar : pageToolbarTbUnit,
										tbar : new Ext.Toolbar({
													items : toolbarItemsUnit
												})
									});		
							//smTbUnit.clearSelections();   
							dsResultTbUnit.load({
										params : {
											start : 0,
											limit : PAGE_SIZE
										}
									});
							gridTbUnitWin = new Ext.Window({
										title : '分类下发',
										width : 381,
										//x:220,
										//y:60,
										height : 400,
										minWidth : 300,
										minHeight : 200,
										layout : 'fit',
										plain : true,
										closeAction : 'hide',
										modal : true,
										items:[gridTbUnit]
									});		
							gridTbUnitWin.show(selectNode.id);
					}
				});
		//tbarItems.push('-', syncLabel);
	}

	treePanel = new Ext.tree.TreePanel({
		id : 'fileSort-tree',
		region : 'west',
		frame : false,
		tbar : tbarItems,
		enableDD : true,
		split : true,
		width : 200,
		minSize : 175,
		maxSize : 400,
		collapsible : true,
		//margins : '0 0 0 5',
		rootVisible : false,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		loader : treeLoader,
		root : rootNode
			// ,collapseFirst : true
		});
	treePanel.on('beforenodedrop', function(e) {
				if (e.dropNode.parentNode.id != e.target.parentNode.id) {
					Ext.Msg.alert("操作提示", "节点只能在本层间移动，不允许移到到【"
									+ e.target.parentNode.text + "】下。")
					return false;
				} else {
					return true;
				}
			})
	treePanel.on('nodedrop', function(e) {
				Ext.Msg.show({
							title : '操作提示',
							msg : '是否确定移动该节点，调整分类间的排序？',
							buttons : Ext.Msg.YESNO,
							fn : function(value) {
								if ("yes" == value)
									moveNode(e);
								else {
									rootNode.reload();
								}
							},
							icon : Ext.MessageBox.QUESTION
						});

			});
	var rightClick = new Ext.menu.Menu({
				id : 'rightClickCont',
				items : [{
					id : 'addNode',
					handler : rMenuFun,
					icon : CONTEXT_PATH
							+ "/jsp/res/images/icons/toolbar_item_add.png",
					cls : "x-btn-text-icon",
					text : '增加分类'
				}, '-', {
					id : 'deleteNode',
					handler : rMenuFun,
					icon : CONTEXT_PATH
							+ "/jsp/res/images/icons/toolbar_item_delete.png",
					cls : "x-btn-text-icon",
					text : '删除分类'
				}]
			});
	if (editable) {
		if (!(isSortIssue == '1' && DEPLOY_UNITTYPE == 'A')) {
			treePanel.addListener('contextmenu', rightClickFn);
		}

	}

	function rightClickFn(node, e) {
		treePanel.fireEvent("click", node)
		rightClick.showAt(e.getXY());
	}
	treePanel.on("click", function(node) {
				curRootId=node.id;
				curRootName=node.text;
				sortNameField.setValue(node.text);
				sortBhField.setValue(node.attributes.desc);

				pidField.setValue(node.attributes.pid);

				parentNodeField.setValue("该分类是根目录")
				sortPathField.setValue("");
				if (node.parentNode) {
					if (node.parentNode.text != node.text) {
						parentNodeField.setValue(node.parentNode.text)
						try {
							selectPath = node.getPath("text").replace(
									"/" + g_rootName, "")
							sortPathField.setValue(selectPath);
						} catch (e) {
							sortPathField.setValue(selectPath);
						}
					}
				}
				fileUploadUrlFull = fileUploadUrl + node.id
				window.frames["fileFrame"].location.href = fileUploadUrlFull
				selectNode = node;
				treeGridStore.reload();

			})
})
function moveNode(e) {
	Ext.Ajax.request({
				url : CONTEXT_PATH
						+ "/servlet/ComFileSortServlet?method=moveNode",
				method : 'post',
				params : {
					node : e.dropNode.id,
					relationPk : e.target.id,
					moveType : e.point
				},
				success : function(response, option) {
					var msg = response.responseText;
					if (msg.indexOf('true') > -1) {
						// Ext.Msg.alert('执行成功',"<p>节点已经移动完毕！");
					} else {
						Ext.Msg.alert('执行出错', msg);
						rootNode.reload();
					}
				},
				failure : function(response, option) {
					Ext.Msg.alert('访问出错', "异步通讯失败，请与管理员联系！");
					rootNode.reload();
				}
			});

}
var pWin
function rMenuFun(item) {
	if (item.id == "deleteNode") {
		ComFileSortDWR.deleteVerification(selectNode.id, function(dat) {
			if (!dat) {
				Ext.Msg.alert("操作提示", "该分类下或下属分类下已经添加了文件，要删除该分类，请先删除相关文件!");
			} else {
				Ext.MessageBox.confirm("操作提示", "您将删除【" + selectNode.text
								+ "】节点及下属分类所有信息，删除后将不能恢复，请确认!", function(btn) {

							if (btn == "yes") {
								Ext.Ajax.request({
											url : CONTEXT_PATH
													+ "/servlet/ComFileSortServlet",
											method : 'post',
											params : {
												sortId : selectNode.id,
												method : item.id
											},
											success : function(response, option) {
												var msg = response.responseText;
												if (msg.indexOf("true") > -1) {
													// Ext.Msg.alert('执行成功',"<p>节点已经移动完毕！");
													selectNode = null;
									 				rootNode.reload();
												} else {
													Ext.Msg.alert('执行出错', msg);
													rootNode.reload();
												}
											},
											failure : function(response, option) {
												Ext.Msg.alert('访问出错',
														"异步通讯失败，请与管理员联系！");
												rootNode.reload();
											}
										});
							}
						})
			}
		})

	} else if (item.id == "addNode") {

		var pWinUrl = CONTEXT_PATH
				+ "/Business/fileAndPublish/sort/com.fileSort.property.jsp?isSortIssue="
				+ isSortIssue;
		pWin = new Ext.Window({
			id : 'propertyWin',
			title : '新增分类',
			width : 500,
			height : 200,
			modal : true,
			resizable : false,
			// border: false,
			html : '<iframe name="propertyFrame" src="'
					+ pWinUrl
					+ '" frameborder=0 style="width:100%;height:100%;"></iframe>'
		})
		pWin.show();
	}
}
//保存分类下发选择的单位值
function saveTbUnitFun(){
	var rateStatus=0;
	var offer=0;
	var tbUnitIdArray=new Array();
	var records=smTbUnit.getSelections();
	if(records&&records.length>0){
		for(var i=0;i<records.length;i++){
			var record=records[i];
			tbUnitIdArray.push(record.get("unitid"));	
		}	
		DWREngine.setAsync(false);
		//下发操作file-grid
		mask = new Ext.LoadMask(Ext.getBody(), {
					msg : "正在交换数据..."
				});
		gridTbUnitWin.hide();	
		mask.show();
		ComFileSortDWR.issueFileSortBySelect(tbUnitIdArray,g_rootId,
				function(retVal) {
					if (retVal == 'success') {
						mask.hide();
						Ext.Msg.alert("操作提示",
								"下发成功!");  
						rootNode.reload();
					} else {
						mask.hide();
						Ext.Msg.alert(
										"操作提示",
										"下发失败: "
												+ retVal); 
					}

				});		

		DWREngine.setAsync(true);	
		
	}

}

function deleteSuccess( fidArr,businessId, businessType, blobTable, beanName){
			/*
			 * blobTable  sgcc_attach_blob
			 * beanName  sgcc_attach_list
			 * businessType   FAPTemplate  
			 * fidArr文件流水数组
			 * */
			if(DEPLOY_UNITTYPE=="0"){//是集团公司时删除模板附件时需要将项目单位对应附件删除
				var unitArr=new Array();
				DWREngine.setAsync(false);
				//查找已下发的项目单位
        		db2Json.selectData("select distinct(unitid) from issue_filesort_unit where status='1'", function (jsonData) {
	    		var list = eval(jsonData);
	    		if(list!=null){
					for(var i=0;i<list.length;i++){
						unitArr.push(list[i].unitid);
					}
	     		 }  
	      	 });
	   		   DWREngine.setAsync(true);			
	   		   ComFileManageDWR.deleteFileByUnitId(fidArr,unitArr,"FAPTemplate","sgcc_attach_blob","sgcc_attach_list",function(flag){
	   		   });
	   		     					
			}
}







