var AUDIT_TYPE_BUILDING = "BUILDING";
var treePanel
var data, uncheckBdgid;
var idS = new Array();
var win, bdgid, tempNode;
var viewport;

Ext.onReady(function() {
	var singleAuditBtn = new Ext.Button({
		id: 'single',
		text: '单独稽核',
		iconCls: 'btn',
		handler: auditFun 
	});
	
	var mergeAuditBtn = new Ext.Button({
		id: 'merge',
		text: '合并稽核',
		iconCls: 'btn',
		handler: auditFun 
	});
	
	var mergeToAuditBtn = new Ext.Button({
		id: 'mergeTo',
		text: '合并到稽核',
		iconCls: 'btn',
		handler: auditFun 
	});
	 
	var deleteAuditBtn = new Ext.Button({
		id: 'deleteAudit',
		text: '撤销稽核',
		iconCls: 'remove',
		handler: deleteAuditFun 
	});
	 
	var btnLook = new Ext.Button({
		text: '查看固定资产',
		iconCls: 'add',
		handler: lookAsset 
	});

	root = new Ext.tree.AsyncTreeNode({
		text : '概算信息',
		iconCls : 'form'

	})

	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "getBuildingTree",
			businessName : "financialAuditService",
			parent : '010101',
			pid: CURRENTAPPID
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});
	treePanel = new Ext.tree.ColumnTree({
		id : 'budget11-tree-panel',
		iconCls : 'icon-by-category',
		region : 'center',
		width : 800,
		minSize : 275,
		maxSize : 600,
		frame : false,
		header : false,
		checkModel: 'multiple',
		tbar : ['<font color=#15428b><b>&nbsp;合同概算</b></font>', '-', {
			iconCls : 'icon-expand-all',
			tooltip : 'Expand All',
			handler : function() {
				root.expand(true);
			}
		}, '-', {
			iconCls : 'icon-collapse-all',
			tooltip : 'Collapse All',
			handler : function() {
				root.collapse(true);
			}
		},'->'],
		border : false,
		rootVisible : true,
		lines : true,
		autoScroll : true,
		animate : false,
		columns : [{
			header : '概算名称',
			width : 400,
			dataIndex : 'bdgname'
		}, {
			header : '概算主键',
			width : 0, // 隐藏字段
			dataIndex : 'bdgid',
			renderer : function(value) {
				return "<div id='bdgid'>" + value + "</div>";
			}
		}, {
			header : '稽核流水号',
			width : 150,
			dataIndex : 'auditNo'
		}, {
			header : '财务编码',
			width : 200,
			dataIndex : 'bdgno'
		}, {
			header : '概算金额',
			width : 80,
			dataIndex : 'bdgmoney',
			renderer : cnMoney
		}, {
			header : '分摊总金额',
			width : 120,
			dataIndex : 'contmoney',
			align : 'right',
			renderer : function(value) {
				return '<div align=right>' + cnMoney(value) + '</div>';
			}
		}, {
			header : '是否子节点',
			width : 0,
			dataIndex : 'isleaf',  
			renderer : function(value) {
				return "<div id='isleaf'>" + value + "</div>";
			}

		}, {
			header : '父节点',
			width : 0,
			dataIndex : 'parent',
			renderer : function(value) {
				return "<div id='parent'>" + value + "</div>";
			}

		}, {
			header : '选择',
			width : 40,
			dataIndex : 'ischeck',
			renderer : checkColRender

		}],
		loader : treeLoader,
		root : root,
		rootVisible : false
	});
	treePanel.on('beforeload', function(node) {
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '010101';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = bdgid;
	})

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel]
	});
	
	if (ModuleLVL < 3) {
		treePanel.getTopToolbar().add(singleAuditBtn, mergeAuditBtn, mergeToAuditBtn, '-', deleteAuditBtn);
	}
	treePanel.getTopToolbar().add('-', btnLook)

	treePanel.expand();
	root.expand(true);

	function checkColRender(value, m, rec) {
		if (rec.leaf) {
			return '<div id="colChecker" class="x-grid3-check-col">&#160;</div>'
		} else {
			return ''
		}
	}

	treePanel.on("click", function(node, e) {
		var elNode = node.getUI().elNode;
		bdgid = elNode.all("bdgid").innerText;
		var chx = e.getTarget()
		tempNode = node;

		if (chx.id && chx.id.indexOf("Checker") > 0) {
			chx.className = chx.className == "x-grid3-check-col-on"
					? "x-grid3-check-col"
					: "x-grid3-check-col-on";
			var checked = chx.className == "x-grid3-check-col-on";
			deepCheck(node, chx.id, checked)
		}
	});

	function deepCheck(node, id, checked) {
		for (var i = 0; i < node.childNodes.length; i++) {
			var child = node.childNodes[i];
			var elNode = child.getUI().elNode;
			var chx = elNode.all(id)
			checkerClick(chx, checked)
			deepCheck(child, id, checked)
		}
	}

	function deepConcat(node) {
		var arr = new Array();
		var len = node.childNodes.length;
		for (var i = 0; i < len; i++) {
			var child = node.childNodes[i]
			if(child.leaf) {
				var elNode = child.getUI().elNode;
				var checked = elNode.all("colChecker").className == "x-grid3-check-col-on";
				if (checked) {
					var id = elNode.all("bdgid").innerText;
					arr.push(id);
				}
			} else {
				arr = arr.concat(deepConcat(child));
			}
		}
		return arr;
	}

	//稽核
	function auditFun(btn){
		var data = deepConcat(root);
		if (data.length == 0) {
			Ext.Msg.alert("提示", "请选择要稽核的项目！");
			return;
		}
		
		var mergeType = "N";
		if(btn.id=="merge") {
			mergeType = "M";
			if(data.length<2) {
				Ext.Msg.alert("提示", "合并稽核请选择至少两个项目！");
				return;
			}
		} else if (btn.id=="mergeTo") {
			mergeType = "MT";
		}
		
		var checkFlag = true;
		var sourceNos = "";
		var objectIds = "";
		
		var confirmDataArr = new Array();
		var dataArr = new Array();
		for (i=0; i<data.length; i++) {
			var nodeId = data[i];
			var node = treePanel.getNodeById(nodeId);
			if(node.attributes.auditNo!=null && node.attributes.auditNo.length>0) {
				checkFlag = false;
				break;
			}
			objectIds += "`" + node.attributes.bdgid;
			dataArr.push(node.attributes);
			
			var temp = node.attributes;
			temp.buildingSelfAmount = node.attributes.contmoney;
			if(i==0) {
				temp.mainFlag = "1";
			} else {
				temp.mainFlag = "0";
			}
			confirmDataArr.push(temp);
		}
		
		if(checkFlag) {
			if(objectIds.length>0) {
				objectIds = objectIds.substring(1);
				
				var master = new Object();
				master.objectIDs = objectIds;
				master.businessType = AUDIT_TYPE_BUILDING;
				master.operator = USERID;
				master.equStockOutDetailVOArr = dataArr;
				
				if(mergeType=="N") {
					var mergeConfirmUrl = CONTEXT_PATH + "/Business/finalAccounts/financialAudit/buildingAudit/fa.building.audit.single.info.jsp"
					var param = new Object();
					param.basicData = Ext.encode(confirmDataArr);
					var rtn = showModalDialog(mergeConfirmUrl, param, "dialogWidth:1000px;dialogHeight:600px;center:yes;resizable:yes;");
					if(rtn) {
						master.buildingBdgDetailVOArr = Ext.decode(rtn);
						saveAuditDataFun(master, mergeType, "", "");
					}
				} else if (mergeType=="M") {
					var mergeConfirmUrl = CONTEXT_PATH + "/Business/finalAccounts/financialAudit/buildingAudit/fa.building.audit.merge.info.jsp"
					var param = new Object();
					param.basicData = Ext.encode(confirmDataArr);
					var rtn = showModalDialog(mergeConfirmUrl, param, "dialogWidth:1000px;dialogHeight:600px;center:yes;resizable:yes;");
					if(rtn) {
						master.buildingBdgDetailVOArr = Ext.decode(rtn.data);
						saveAuditDataFun(master, mergeType, "", rtn.mainObjectId);
					}						
				} else if (mergeType=="MT") {
					var mergeConfirmUrl = CONTEXT_PATH + "/Business/finalAccounts/financialAudit/buildingAudit/fa.building.audit.mergeTo.info.jsp"
					var param = new Object();
					param.basicData = Ext.encode(confirmDataArr);
					var rtn = showModalDialog(mergeConfirmUrl, param, "dialogWidth:1000px;dialogHeight:600px;center:yes;resizable:yes;");
					if(rtn) {
						master.buildingBdgDetailVOArr = Ext.decode(rtn.data);
						saveAuditDataFun(master, mergeType, rtn.mainAuditId, "");
					}						
				}
			}
		} else {
			Ext.Msg.alert("提示", "某些选中的设备已经稽核！");
		}
	}

//稽核信息保存	
	function saveAuditDataFun(master, mergeType, mainAuditId, mainObjectId) {
		master.pid = CURRENTAPPID;
		financialAuditService.auditAdd(master, mergeType, mainAuditId, mainObjectId, function(d) {
			if(d=="OK") {
				Ext.Msg.alert("提示", "选中的设备已经稽核！");
				treePanel.getRootNode().reload();
				treePanel.getRootNode().expand(true);
			} else {
				Ext.Msg.alert("提示", "稽核失败，原因：" + d);
			}
		});
	}
    
	// 查看固定资产
	function lookAsset(){
		var mergeConfirmUrl = CONTEXT_PATH + "/Business/finalAccounts/financialAudit/buildingAudit/fa.building.assets.main.jsp"
		var param = new Object();
		var rtn = showModalDialog(mergeConfirmUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;");
	}
   	
   	//撤销稽核
	function deleteAuditFun(){
		var checkFlag = true;
		var delAuditIds = "";
		var recArr = deepConcat(root);
		
		for (i=0; i<recArr.length; i++) {
			var nodeId = recArr[i];
			var node = treePanel.getNodeById(nodeId);
			if(node.attributes.auditNo==null || node.attributes.auditNo.length==0) {
				checkFlag = false;
				break;
			}
			delAuditIds += "`" + node.attributes.auditId;
		}
		
		if(!checkFlag) {
			Ext.Msg.alert("提示", "请选择要撤销的稽核！");
			return;
		} 
		if (delAuditIds.length>0) {
			delAuditIds = delAuditIds.substring(1);
			Ext.Msg.confirm("确认", "确认稽核选中的设备？", function(btn) {
				if(btn=="yes") {
					financialAuditService.delAuditByIds(delAuditIds, function(d) {
						if(d=="OK") {
							Ext.Msg.alert("提示", "稽核撤销成功！");
							treePanel.getRootNode().reload();
							treePanel.getRootNode().expand(true);
						}
					});
				}
			});
		}
	}

});

function checkerClick(chx, flag) {
	if (chx.className != "") {
		var checked = chx.className == "x-grid3-check-col-on";
		
		if (typeof(flag) == "undefined")
			chx.className = checked
					? "x-grid3-check-col"
					: "x-grid3-check-col-on"
		else
			chx.className = flag
					? "x-grid3-check-col-on"
					: "x-grid3-check-col"
	}
}