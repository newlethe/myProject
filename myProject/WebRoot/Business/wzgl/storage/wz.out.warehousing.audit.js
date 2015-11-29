var bean;
var tableName;
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "outDate";
var businessType = "zlMaterial";
var whereStr,paramsStr;
var cm;
var ds;

var bdgArr = new Array(); //领料用途
var typeArr = new Array(); // 处理设备仓库
var equWareArr = new Array();// 系统编号，仓库号，仓库类别
var warenoArr = new Array();// 仓库号
var waretypeArr = new Array();// 仓库类别
var deptArray = new Array();//领用单位
var htType;
var bodyArr;
var htTypeStore;
var bodyArrStore;

Ext.onReady(function() {
	if (treeFlag == "SBOUT") {
		bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStockOut";
		whereStr = "dataType = 'EQUBODY' and FINISHED = '1' and pid ='" + CURRENTAPPID + "'";
		tableName = "EQU_GOODS_STOCK_OUT";
	} else if (treeFlag == "CLOUT") {
		bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsStockOut";
		whereStr = "judgmentFlag = 'body' and FINISHED = '1' and pid ='" + CURRENTAPPID + "'";
		tableName = "WZ_GOODS_STOCK_OUT";
	}
	
	deptArray.push(['all','所有']);
	DWREngine.setAsync(false);
	baseMgm.getData("select bdgid,bdgname from bdg_info where pid='" + CURRENTAPPID + "' order by bdgid ", function(list) {
		        for (var i = 0; i < list.length; i++) {
		            var temp = new Array();
		            temp.push(list[i][0]);
		            temp.push(list[i][1]+" - "+list[i][0]);
		            bdgArr.push(temp);
		        }
		    });
	baseMgm.getData("select wareno,waretype,equid from equ_warehouse where pid='"
					+ CURRENTAPPID + "' and parent='01' order by equid ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					typeArr.push(temp);
				}
			});
	baseMgm.getData("select uids,equid,equno,wareno from equ_warehouse where pid='"
					+ CURRENTAPPID + "' order by equid ", function(list) {
				warenoArr.push(['all', '所有']);
				waretypeArr.push(['all', '所有']);
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					warenoArr.push([list[i][1], list[i][2]]);
					waretypeArr.push([list[i][1], list[i][3]]);
					for (var j = 0; j < typeArr.length; j++) {
						if (list[i][3] == typeArr[j][1])
							temp.push(typeArr[j][0]);
					}
					equWareArr.push(temp);
				}
			});
	appMgm.getCodeValue("领用单位", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					deptArray.push(temp);
				}
			});
	var subjectArr = new Array();//财务科目
	baseDao.getData("select TREEID,SUBJECT_ALLNAME from FACOMP_FINANCE_SUBJECT where PID='" + CURRENTAPPID
					+ "'", function(list){
	    for(i = 0; i < list.length; i++) {
	        var temp = new Array();
	        temp.push(list[i][0]);
	        temp.push(list[i][1]);
	        subjectArr.push(temp);
	    }
	});
	DWREngine.setAsync(true);

	var bdgArrStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bdgArr
			});
	
	// 生成概算树
	var rootText = "工程概算";
	var rootNew = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'task-folder',
				expanded : true,
				id : '01'
			});
	var treeLoaderNew = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "equBdgTree",
					businessName : "equBaseInfo",
					bdgid : CURRENTAPPID + '-0101,' + CURRENTAPPID + '-0102,'
							+ CURRENTAPPID + '-0103,' + CURRENTAPPID + '-0104',
					parent : 0
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});
	var treePanelNew = new Ext.tree.ColumnTree({
				width : 550,
				header : false,
				border : false,
				lines : true,
				autoScroll : true,
				columns : [{
							header : '概算名称',
							width : 380, // 隐藏字段
							dataIndex : 'bdgname'
						}, {
							header : '概算编号',
							width : 140,
							dataIndex : 'bdgno'
						}, {
							header : '概算主键',
							width : 0,
							dataIndex : 'bdgid'
						}, {
							header : '是否子节点',
							width : 0,
							dataIndex : 'isleaf'
						}, {
							header : '父节点',
							width : 0,
							dataIndex : 'parent'
						}],
				loader : treeLoaderNew,
				root : rootNew,
				tbar : [{
							iconCls : 'icon-expand-all',
							tooltip : 'Expand All',
							text : '全部展开',
							handler : function() {
								rootNew.expand(true);
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : 'Collapse All',
							text : '全部收起',
							handler : function() {
								rootNew.collapse(true);
							}
						}]
			});
	treePanelNew.on('beforeload', function(node) {
				var bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = CURRENTAPPID+'-01';
				var baseParams = treePanelNew.loader.baseParams;
				baseParams.parent = bdgid;
			})
	treePanelNew.on('click', function(node, e) {
				var tempNode = node;
				var isRootNode = (rootText == tempNode.text);
				var thisBdgid = isRootNode ? "0" : tempNode.attributes.bdgid;
				var thisBdgno = isRootNode ? "0" : tempNode.attributes.bdgno;
				var thisBdgname = isRootNode ? "0" : tempNode.attributes.bdgname;
				if(!isRootNode){
					usingCombo.setValue(thisBdgid);
					usingCombo.setRawValue(thisBdgname + "-" + thisBdgid);
					bdgTreeWin.hide();
				}
			});
	var bdgTreeWin = new Ext.Window({
				id : 'selectwin',
				title : '选择概算',
				width : 550,
				height : 400,
				layout : 'fit',
				border : false,
				resizable : false,
				closeAction : "hide",
				items : [treePanelNew],
				listeners : {
					'show' : function() {
						treePanelNew.render(); // 显示树
						treePanelNew.expand();
					}
				}
			});
	var usingCombo = new Ext.form.ComboBox({
				name : 'using',
				fieldLabel : '领料用途',
				triggerClass : 'x-form-date-trigger',
				onTriggerClick : showBdgTreeWin,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : bdgArrStore,
				anchor : '73%',
				readOnly : true
			});

	var subjectTreeCombo = new Ext.ux.TreeCombo({
				name : 'financialSubjects',
				fieldLabel : '财务科目',
				resizable : true,
				treeWidth : 250,
				width : 183,
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "subjectColumnTree",
								businessName : 'faBaseInfoService',
								parent : '01',
								pid : CURRENTAPPID
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : "01",
							text : "财务科目",
							iconCls : 'form',
							expanded : true
						})
			});
	subjectTreeCombo.getTree().on('beforeload', function(node) {
				subjectTreeCombo.getTree().loader.baseParams.parent = node.id;
			});
	subjectTreeCombo.on('select', function(tree, node) {
				if (node.id == '01') {
					Ext.example.msg("信息提示：", "请选择分类下的子分类！");
					this.setRawValue("");
					this.value = '';
					return;
				}
				this.value = node.id;
				this.setRawValue(node.text);
			});

	var Columns = [{
				name : 'outNo',
				type : 'string'
			}, {
				name : 'outDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'using',
				type : 'string'
			}, {
				name : 'fileid',
				type : 'string'
			}, {
				name : 'auditState',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'uids',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'treeuids',
				type : 'string'
			}, {
				name : 'recipientsUnit',
				type : 'string'
			}, {
				name : 'equid',
				type : 'string'
			}, {
				name : 'financialSubjects',
				type : 'string'
			}];

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	var cms = [sm, {
				id : 'outNo',
				header : '出库单号',
				dataIndex : 'outNo',
				align : 'center',
				type : 'string',
				width : 180,
				renderer : hrefFun
			}, {
				id : 'outDate',
				header : '出库日期',
				dataIndex : 'outDate',
				align : 'center',
				width : 80,
				renderer : formatDate
			}, {
				id : 'using',
				header : '领料用途',
				dataIndex : 'using',
				type : 'comboTree',
				comboTree : usingCombo,
            	align : 'center',
           	 	width : 180,
				renderer : function(v){
	                for (var i = 0; i < bdgArr.length; i++) {
	                    if (v == bdgArr[i][0])
	                        return bdgArr[i][1];
	                }
            	}
			}, {
				id : 'pid',
				header : 'PID',
				dataIndex : 'pid',
				hidden : true
			}, {
				id : 'uids',
				header : '主键',
				dataIndex : 'uids',
				hidden : true
			},  {
				id : 'treeuids',
				header : '设备合同分类树主键',
				dataIndex : 'treeuids',
				hidden : true
			},	{
				id : 'conid',
				header : '合同ID',
				dataIndex : 'conid',
				hidden : true
			}, {
				id : 'recipientsUnit',
				header : '领用单位',
				dataIndex : 'recipientsUnit',
				align : 'center',
				width : 150,
				renderer : function(v) {
					for (var i = 0; i < deptArray.length; i++) {
						if (v == deptArray[i][0])
							return deptArray[i][1];
					}
				}
			}, {
				id : 'equid',
				header : '仓库号',
				dataIndex : 'equid',
				align : 'center',
				width : 180,
				renderer : function(v) {
					var equid = "";
					for (var i = 0; i < equWareArr.length; i++) {
						if (v == equWareArr[i][1])
							return equWareArr[i][2] + " - " + equWareArr[i][1];
					}
				}
			}, {
				id : 'financialSubjects',
				header : '对应财务科目',
				dataIndex : 'financialSubjects',
				type : 'comboTree',
				align : 'center',
				comboTree : subjectTreeCombo,
				width : 180,
				renderer : function(v){
					for (var i=0;i<subjectArr.length;i++){
						if(subjectArr[i][0] == v){
							return subjectArr[i][1];
						}
					}
					return v;
				}
			}, {
				id : 'fileid',
				header : '出库单',
				dataIndex : 'fileid',
				renderer : function(v, m, r) {
					if (v != '') {
						return "<center><a href='" + BASE_PATH + "servlet/MainServlet?ac=downloadfile&fileid="
								+ v + "'><img src='" + BASE_PATH + "jsp/res/images/word.gif'></img></a></center>";
					} else {
						return "<img src='" + BASE_PATH + "jsp/res/images/word_bw.gif'></img>";
					}
				},
				align : 'center',
				width : 90
			}, {
				id : 'fileid',
				header : '附件',
				dataIndex : 'fileid',
				renderer : filelistFn,
				align : 'center',
				width : 100
			}, {
				id : 'auditState',
				header : '稽核状态',
				dataIndex : 'auditState',
				width : 80,
				align : 'center',
				renderer : function(v) {
					var str = '未稽核';
					if (v == '1') {
						str = '已稽核';
					} else if (v == '2') {
						str = '撤销稽核';
					}
					return str;
				}
			}];

		if (treeFlag == "CLOUT") {
			bodyArr = new Array();// 安装主体设备（建筑物）
			DWREngine.setAsync(false);
			baseMgm.getData("select  treeid,name,isleaf from wz_con_body_tree_view  "
									+ "start with  parentid='0' connect by prior treeid=parentid",
							function(list) {
								for (var i = 0; i < list.length; i++) {
									var temp = new Array();
									temp.push(list[i][0]);
									temp.push(list[i][1]);
									temp.push(list[i][2]);
									bodyArr.push(temp);
								}
							})
			DWREngine.setAsync(true);

			bodyArrStore = new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : bodyArr
					});
			// 对应主体设备树的构建
			var bodyRootText = "对应合同主体设备";
			var bodyRootNew = new Ext.tree.AsyncTreeNode({
						text : bodyRootText,
						iconCls : 'task-folder',
						expanded : true,
						id : '0'
					});
			var treeLoaderBody = new Ext.tree.TreeLoader({
						url : MAIN_SERVLET,
						baseParams : {
							ac : "columntree",
							treeName : "WzBodyTreeList",
							businessName : "wzglMgmImpl",
							parent : ''
						},
						clearOnLoad : true,
						uiProviders : {
							'col' : Ext.tree.ColumnNodeUI
						}
					});
			var treePanelBody = new Ext.tree.ColumnTree({
						width : 550,
						header : false,
						border : false,
						lines : true,
						autoScroll : true,
						columns : [{
									header : '对应主体设备名称',
									width : 380, // 隐藏字段
									dataIndex : 'name'
								}, {
									header : '对应主体设备编码',
									width : 140,
									dataIndex : 'treeid'
								}, {
									header : '主键',
									width : 0,
									dataIndex : 'uuids'
								}, {
									header : '是否子节点',
									width : 0,
									dataIndex : 'isleaf'
								}, {
									header : '父节点',
									width : 0,
									dataIndex : 'parentid'
								}],
						loader : treeLoaderBody,
						root : bodyRootNew,
						tbar : [{
									iconCls : 'icon-expand-all',
									tooltip : 'Expand All',
									text : '全部展开',
									handler : function() {
										bodyRootNew.expand(true);
									}
								}, '-', {
									iconCls : 'icon-collapse-all',
									tooltip : 'Collapse All',
									text : '全部收起',
									handler : function() {
										bodyRootNew.collapse(true);
									}
								}]
					});
			treePanelBody.on('beforeload', function(node) {
						var parentid = node.attributes.treeid;
						if (parentid == null)
							parentid = '0';
						var baseParams = treePanelBody.loader.baseParams
						baseParams.parent = parentid;
					});
			treePanelBody.on('click', function(node, e) {
						var tempNode = node;
						var isRootNodeBody = (bodyRootText == tempNode.text);
						thisBodyparentId = isRootNodeBody ? "0" : tempNode.attributes.parentid;
						thisBodyTreeid = isRootNodeBody ? "0" : tempNode.attributes.treeid;
						thisBodyName = isRootNodeBody ? "0" : tempNode.attributes.name;
						if(!isRootNodeBody){
							bodyCombo.setValue(thisBodyTreeid);
							bodyCombo.setRawValue(thisBodyName);
							bodyTreeWin.hide();
						}
					});
			var bodyTreeWin = new Ext.Window({
						id : 'selectBodywin',
						title : '选择对应主体设备',
						width : 550,
						height : 400,
						layout : 'fit',
						border : false,
						resizable : false,
						closeAction : "hide",
						items : [treePanelBody],
						listeners : {
							'show' : function() {
								treePanelBody.render(); // 显示树
								treePanelBody.expand();
							}
						}
					});
			var bodyCombo = new Ext.form.ComboBox({
						name : 'installationBody',
						triggerClass : 'x-form-date-trigger',
						fieldLabel : '安装主体设备（建筑物）',
						onTriggerClick : showBodyTreeWin,
						valueField : 'k',
						displayField : 'v',
						mode : 'local',
						typeAhead : true,
						triggerAction : 'all',
						store : bodyArrStore,
						readOnly : true,
						anchor : '73%',
						readOnly : true
					});

			var Columns_ = [{
						name : 'installationBody',
						type : 'string'
					}, {
						name : 'kks',
						type : 'string'
					}, {
						name : 'userPart',
						type : 'string'
					}];

			var cms_ = [{
				id : 'installationBody',
				header : '安装主体设备（建筑物）',
				dataIndex : 'installationBody',
				align : 'center',
				type : 'comboTree',
				comboTree : bodyCombo,
				width : 200,
				renderer : function(v) {
					for (var i = 0; i < bodyArr.length; i++) {
						if (v == bodyArr[i][0]) {
							var qtip = "qtip=" + bodyArr[i][1];
							return '<span ' + qtip + '>' + bodyArr[i][1] + '</span>';
						}
					}
				}
			}];

			Columns = Columns.concat(Columns_);
			cms = cms.concat(cms_);
		}
	cm = new Ext.grid.ColumnModel(cms);
	cm.defaultSortable = true;

	ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					params : whereStr
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKey
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	ds.setDefaultSort(orderColumn, 'desc');

	var auditBtn = new Ext.Button({
				id : 'audit',
				text : '稽核',
				iconCls : 'btn',
				handler : function() {
					var record = sm.getSelected();
					if (typeof(record) == 'undefined') {
						Ext.example.msg('提示', '请选择一条数据');
						return false;
					} else if (record.get('auditState') == '1') {
						Ext.example.msg('提示', '此数据已稽核');
						return false;
					}
					Ext.MessageBox.confirm('确认', '确认稽核吗?', function(btn, text) {
								if (btn == 'yes') {
									DWREngine.setAsync(false);
									baseDao.updateBySQL("update " + tableName + " set AUDIT_STATE = '1' where "
													+ primaryKey + " = '" + record.get(primaryKey) + "'", function(flag) {
														if (flag == 1) {
															ds.reload();
															Ext.example.msg('提示', '稽核成功!');
														} else {
															Ext.example.msg('提示', '稽核失败!');
														}
													});
									DWREngine.setAsync(true);
								}
							});
				}
			});
	var auditRevBtn = new Ext.Button({
				id : 'audit',
				text : '撤销稽核',
				iconCls : 'remove',
				handler : function() {
					var record = sm.getSelected();
					if (typeof(record) == 'undefined') {
						Ext.example.msg('提示', '请选择一条数据');
						return false;
					} else if (record.get('auditState') != '1') {
						Ext.example.msg('提示', '此数据未稽核或已撤销稽核');
						return false;
					}
					var uids = record.get('uids');
					var flag = checkproof(uids);
					if (flag){
						Ext.MessageBox.confirm('确认', '确认撤销稽核吗？',
								function(btn, text) {
									if (btn == 'yes') {
										DWREngine.setAsync(false);
										baseDao.updateBySQL("update " + tableName + " set AUDIT_STATE = '2' where "
														+ primaryKey + " = '" + record.get(primaryKey) + "'", function(flag) {
															if (flag == 1) {
																ds.reload();
																Ext.example.msg('提示', '撤销稽核成功!');
															} else {
																Ext.example.msg('提示', '撤销稽核失败!');
															}
														});
										DWREngine.setAsync(true);
									}
								});
					}else {
						Ext.example.msg('提示', '此数据已生成凭证，不可撤销!');
						return false;
					}
				}
			});
	var proofBtn = new Ext.Button({
				id : 'proof',
				text : '生成凭证',
				iconCls : 'btn',
				handler : function() {
					var record = sm.getSelected();
					if (typeof(record) == 'undefined') {
						Ext.example.msg('提示', '请选择一条数据');
						return false;
					} else if (record.get('auditState') != '1') {
						Ext.example.msg('提示', '此数据未稽核,不能生成凭证!');
						return false;
					}
					var uids = record.get('uids');
					var flag = checkproof(uids);
					if (flag){
						var con = "conid=" + record.get('conid');
						var money = "select NVL(SUM(t.amount),0) from " + tableName + "_SUB t where t.out_id = '"
								+ uids + "' and pid ='" + CURRENTAPPID + "'";
						var	relateuids = "&relateuids=" + uids;
						var time = record.get('outDate');
						time = "&time=" + formatDate(time);
						DWREngine.setAsync(false);
						baseMgm.getData(money, function(list) {
								money = list != null && list.length >0 ? '&money=' + list[0] : '';
						});
						DWREngine.setAsync(true);
						var docUrl = BASE_PATH + "Business/finalAccounts/complete/facomp.proof.form.jsp?" + con + time + money + relateuids;
						var rtnstr = showModalDialog(docUrl,"", "dialogWidth:400px;dialogHeight:400px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
						if(rtnstr == 'y'){
							window.location.href = BASE_PATH + "Business/finalAccounts/complete/facomp.proof.info.jsp";
						}
					}else {
						Ext.example.msg('提示', '此数据已生成凭证!');
						return false;
					}
				}
			});

	var wareTreeCombo = new Ext.ux.TreeCombo({
				id : 'storage',
				fieldLabel : '仓库号',
				resizable : true,
				width : 110,
				treeWidth : 200,
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "ckxxTreeNew",
								businessName : "equBaseInfo",
								parent : '01'
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : "01",
							text : "仓库信息",
							iconCls : 'form',
							expanded : true
						})
			});

	wareTreeCombo.getTree().on('beforeload', function(node) {
				wareTreeCombo.getTree().loader.baseParams.parent = node.id;
			});

	wareTreeCombo.on('select', function(tree, node) {
				if (node.id == '01') {
					Ext.example.msg("信息提示：", "请选择此分类下的子分类！");
					wareTreeCombo.setRawValue("");
					return;
				}
				var equname = "";
				for (var i = 0; i < equWareArr.length; i++) {
					if (node.id == equWareArr[i][1]) {
						equname = equWareArr[i][2] + " - " + equWareArr[i][1];
						break;
					}
				}
				this.setRawValue(equname);
			});

	var addToolbar = new Ext.Toolbar({
				items : [
						'出库日期:',
						new Ext.form.DateField({
									id : 'begin',
									emptyText : '开始时间',
									readOnly : true,
									width : 85,
									format : 'Y-m-d'
								}),
						'至',
						new Ext.form.DateField({
									id : 'end',
									readOnly : true,
									width : 85,
									format : 'Y-m-d',
									value : new Date
								}),
						'-',
						'稽核状态:',
						new Ext.form.ComboBox({
									id : 'state',
									store : new Ext.data.SimpleStore({
												fields : ['k', 'v'],
												data : [['all', '所有'],
														[0, '未稽核'], [1, '已稽核'],
														[2, '撤销稽核']]
											}),
									displayField : 'v',
									valueField : 'k',
									value : 'all',
									typeAhead : true,
									readOnly : true,
									mode : 'local',
									triggerAction : 'all',
									selectOnFocus : true,
									width : 70
								}), '-', '仓库号', wareTreeCombo, '-', '领用单位',
						new Ext.form.ComboBox({
									id : 'dept',
									store : new Ext.data.SimpleStore({
												fields : ['k', 'v'],
												data : deptArray
											}),
									displayField : 'v',
									valueField : 'k',
									value : 'all',
									typeAhead : true,
									readOnly : true,
									mode : 'local',
									triggerAction : 'all',
									selectOnFocus : true,
									width : 110,
									listWidth : 110
								}), '-', new Ext.Toolbar.Button({
									id : 'query',
									text : '查 询',
									iconCls: 'btn',
									icon : 'images/business/flowsend.png',
									handler : onItemClick
								}), '-', new Ext.Toolbar.Button({
									id : 'reset',
									text : '重 置',
									iconCls: 'refresh',
									handler : onItemClick
								})]
			});

	//使用高级查询组件的gridPanel,fixedFilterPart为高级查询的自定义参数
	fixedFilterPart = treeSql ? treeSql : whereStr;

	gridPanel = new Ext.grid.QueryExcelGridPanel({
				id : 'ff-grid-panel',
				ds : ds,
				cm : cm,
				sm : sm,
				border : false,
				region : 'center',
				header : false,
				autoScroll : true, // 自动出现滚动条
				tbar : ['<font color=#15428b><B>出库单信息<B></font>', '-', auditBtn, '-', auditRevBtn, '-', proofBtn, '->'],
				animCollapse : false, // 折叠时显示动画
				enableHdMenu : false,
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				listeners : {
					"render" : function() {
						addToolbar.render(this.tbar);
					}
				}
			});
	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [treePanel, gridPanel]
			});

	function formatDate(value) {
		return value && value instanceof Date
				? value.dateFormat('Y-m-d')
				: value;
	};

	// 跳转至从表详细信息页面
	function hrefFun(v, m, r) {
		var str = '<div id="hrefBar" ><a style="color:blue;" href="javascript:showModelDia(\'' + r.data.conid
				+ '\',\'' + r.data.treeuids + '\',\'' + r.data.uids + '\')">' + v + '</a></div>';
		return str;
	}

	// 附件查看
	function filelistFn(v, m, r) {
		if (treeFlag == 'SBOUT') {
			if (v == null || v == "")
				return '查看[0]';
			else
				return "<a href='javascript:viewTemplate(\"" + v + "\")' title='查看'>查看</a>";
		} else {
			var uidsStr = treeFlag == 'CLOUT' ? r.get('uids') : r.get('uuid');
			var count = 0;
			var editable = false;
			DWREngine.setAsync(false);
			db2Json.selectData( "select count(file_lsh) as num from sgcc_attach_list where transaction_id='"
							+ uidsStr + "' and transaction_type='" + businessType + "'", function(jsonData) {
						var list = eval(jsonData);
						if (list != null) {
							count = list[0].num;
						}
					});
			DWREngine.setAsync(true);
			var downloadStr = "查看[" + count + "]";
			return '<div id="sidebar"><a href="javascript:showUploadWin(\'' + businessType + '\', ' + editable
					+ ', \'' + uidsStr + '\', \'' + '附件列表' + '\')">' + downloadStr + '</a></div>';
		}
	}

	// 查询
	function onItemClick(item) {
		switch (item.id) {
			case 'query' :
				var begin = Ext.getCmp('begin').getValue();
				var end = Ext.getCmp('end').getValue();
				var state = Ext.getCmp('state').getValue();
				var storageRaw = Ext.getCmp('storage').getRawValue();
				var storage = Ext.getCmp('storage').getValue();
				var dept = Ext.getCmp('dept').getValue();
				var sql = '';
				var storageFiled = 'EQUID';
				var deptFiled = 'RECIPIENTS_UNIT';
				if (begin != '') {
					begin = begin.format('Y-m-d') + ' 00:00:00';
				}
				if (end != '') {
					end = end.format('Y-m-d') + ' 23:59:59';
				}
				if (begin != '' && end != '' && end < begin) {
					Ext.example.msg("提示", "结束时间不能早于开始时间!");
					return;
				} else if (begin == '' && end != '') {
					sql += " and OUT_DATE <= to_date('" + end + "','yyyy-MM-dd hh24:mi:ss')";
				} else if (begin != '' && end != '') {
					sql += " and OUT_DATE >=to_date('" + begin + "','yyyy-MM-dd hh24:mi:ss') and OUT_DATE <= to_date('"
							+ end + "','yyyy-MM-dd hh24:mi:ss')";
				} else if (begin != '' && end == '') {
					sql += " and OUT_DATE >= to_date('" + begin + "','yyyy-MM-dd hh24:mi:ss')";
				}
				if (state != 'all') {
					sql += " and AUDIT_STATE = '" + state + "'";
				}
				if (storageRaw && storage) {
					sql += " and " + storageFiled + " = '" + storage + "'";
				}
				if (dept != 'all') {
					sql += " and " + deptFiled + " = '" + dept + "'";
				}
				//带上高级查询的查询条件queStr,树的查询条件treeSql
				ds.baseParams.params = treeSql ? treeSql + sql + " and " + queStr : whereStr + sql + " and " + queStr;
				//为高级查询带上外部查询的条件
				fixedFilterPart = treeSql ? treeSql + sql : whereStr + sql;
				ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
				break;
			case 'reset' :
				Ext.getCmp('begin').setValue('');
				Ext.getCmp('end').setValue(new Date);
				Ext.getCmp('state').setValue('all');
				Ext.getCmp('storage').setRawValue('');
				Ext.getCmp('dept').setValue('all');
				//重置所有查询条件
				ds.baseParams.params = treeSql ? treeSql : whereStr;
				fixedFilterPart = treeSql ? treeSql : whereStr;
				ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
				break;

		}
	}

	function showBdgTreeWin() {
		bdgTreeWin.show();
	}
	function showSubjectTreeWin() {
		subjectTreeWin.show();
	}
	function showBodyTreeWin() {
		bodyTreeWin.show();
	}
})

function viewTemplate(fileid) {
	window.open(MAIN_SERVLET + "?ac=downloadFile&fileid=" + fileid)
}

// 显示多附件的文件列表
function showUploadWin(businessType, editable, businessId, winTitle) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
		return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH + "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId=" + businessId;
	var fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='" + fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
	
}

//验证是否已生成凭证
function checkproof(uids){
	var flag;
	DWREngine.setAsync(false);
	baseMgm.getData("select t.uids from FACOMP_PROOF_INFO t where t.relateuids = '"
				+ uids + "'", function(list) {
			flag = list != null && list.length >0 ? false : true;
	});
	DWREngine.setAsync(true);
	return flag;
}

//打开模态窗口，跳转至SB,CL的新增修改页面，SCXZB,SHB的主页面
function showModelDia(conid, treeuid, uids){
	var docUrl;
	if(tree_flag == 'SB'){
		docUrl = BASE_PATH + "Business/equipment/baseInfo/equbody/equ.goods.stock.out.addorupdate.jsp?conid=" + conid
					+ "&treeuids=" + treeuid + "&uids=" + uids + "&flag=edit&editBody=body&mark=markTrue&view=view";
	}else if(tree_flag == 'CL'){
		docUrl = BASE_PATH + "Business/wzgl/baseinfo_wzgl/wz.goods.stock.out.addorupdate.jsp?conid="
					+ conid + "&treeuids=" + treeuid + "&uids=" + uids + "&flag=edit&flagLayout=WZBODY&view=view";
	}
	showModalDialog(docUrl,"", "dialogWidth:" + screen.availWidth + "px;dialogHeight:"
				+ screen.availHeight + "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
}