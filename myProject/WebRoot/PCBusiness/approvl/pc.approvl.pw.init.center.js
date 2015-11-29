var pwTreePanel, projTreePanel;
var indTypeCombo, secondCompany = new Array(), pwLevel = [['', '无']];
var RW = (ModuleLVL < 3 ? true : false);// 读写权限
var iniUnitId = '';
var iniUnitName = '';
var showExchange = (USERBELONGUNITTYPEID == "A" ? false : true);

Ext.override(Ext.tree.ColumnNodeUI,{
	renderElements : function(n, a, targetNode, bulkRender){
		// add some indent caching, this helps performance when rendering a large tree   
		this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';
		
		var t = n.getOwnerTree();
        var cols = t.columns;
        var bw = t.borderWidth;
        var c = cols[0];
		var chx = '<input type=checkbox name="checkNode" ' + (a.checked?'checked':'') + ' ' + (a.disabled?'disabled':'') + ' >';
		
		if(a.ifcheck != null && a.ifcheck != "undefined"){
			chx = '<input style="display:' + a.ifcheck + '" type=checkbox name="checkNode" ' + (a.checked?'checked':'') + ' ' + (a.disabled?'disabled':'') + ' >';
			
		}
		var buf = [ '<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf ', a.cls,'">',
                '<div class="x-tree-col" style="width:',c.width-bw,'px;">',
				'<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
				'<img src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow">',
				chx,			                
				'<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on">',
				'<a hidefocus="on" class="x-tree-node-anchor" href="',a.href ? a.href : "#",'" tabIndex="1" ',
				a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '>',
				'<span unselectable="on">', n.text || (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]),"</span></a>",
                "</div>"];

		for(var i=1,len=cols.length; i<len; i++){
			c = cols[i];
			buf.push('<div class="x-tree-col ',(c.cls?c.cls:''),'" style="width:',c.width-bw,'px;">',
					'<div class="x-tree-col-text">',(c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]),"</div>",
					"</div>");
		}
		buf.push(
            '<div class="x-clear"></div></div>',
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>");

        if(bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()) {
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin",
                                n.nextSibling.ui.getEl(), buf.join(""));
        } else {
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(""));
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.firstChild.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        
        this.checkbox = cs[2];
        this.iconNode = cs[3];
        this.anchor = cs[4];
        this.textNode = cs[4].firstChild;
        //注册checkbox的click事件
        //createDelegate( [Object obj], [Array args], [Boolean/Number appendArgs] ) :这个函数的目的是创建委托
        Ext.fly(this.checkbox).on('click',this.check.createDelegate(this,[null]));
		//禁用节点
		if(a.disabled) n.disable()
	}
})


Ext.onReady(function() {
	Ext.QuickTips.init();
	
	DWREngine.setAsync(false);
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
	appMgm.getCodeValue('批文等级', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					pwLevel.push(temp);
				}
			});
	DWREngine.setAsync(true);
	
	//二级公司下拉框初始的二级公司编号和二级公司名称
	iniUnitId = (secondCompany.length > 0 ? secondCompany[0][0] : '-1');
	iniUnitName = (secondCompany.length > 0 ? secondCompany[0][1] : '二级企业');
	
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
				value : iniUnitId,
				triggerAction : 'all',
				mode : 'local',
				listeners : {
					select : function(combo, record, index) {
						//重新加载项目单位树
						loadProjTree(record.get('k'), record.get('v'));
						//清空批文初始化信息
						loadPwTree('0','0')
					}
				}
			});

	projTreePanel = createProjTree(iniUnitId, iniUnitName);
	pwTreePanel = createPwSortTree(iniUnitId);
})
// 二级企业管辖项目单位,包括前期项目维护
function createProjTree(rootId, rootText) {
	// 首先得到二级企业下的所有的项目单位
	var tree = new Ext.tree.TreePanel({
				region : 'west',
				border : false,
				rootVisible : false,
				title : '&nbsp',
				minSize : 175,
				maxSize : 500,
				frame : false,
				autoScroll : true, 
				split : true,
				loader : new Ext.tree.TreeLoader({					
					url : MAIN_SERVLET,
					baseParams : {
						ac : "tree",
						treeName : "pwInitUnitTree",
						businessName : "approvlMgm",
						parent : iniUnitId              //根据二级公司的编号转到后台查询该二级公司下所有的三级公司和项目单位
					},
					clearOnLoad : true,
					baseAttrs : {
						expanded : false
					},
					uiProviders : {
						'col' : Ext.tree.ColumnNodeUI
					}
				}),
				width : 200,
				root : new Ext.tree.AsyncTreeNode({
					text : iniUnitName,
					leaf: false,
					expanded : true,
					nodeType: '~A',
					id : iniUnitId
				}),
				listeners : {
					beforeload : function(node, e) {
						var parentid = null;
						if(node.getDepth()==0)
						{
							parentid = node.id;
						}
						else
						{
							parentid = node.attributes.id;
						}
						var baseParams = tree.loader.baseParams
						baseParams.parent = parentid;
						Ext.getBody().mask();
					},
					click : function(node) {
						if (node.attributes.nodeType == 'A') 
						{
							loadPwTree(indTypeCombo.getValue(), node.attributes.id)
						}
					},	
			load:function(){
				Ext.getBody().unmask();
			}
				}
			});
	return tree;
}

// 批文分类ColumnTree
var root = new Ext.tree.AsyncTreeNode({
			text : '批文分类',
			iconCls : 'form',
			expanded : true,
			id : '0'
		})
		
function createPwSortTree(iniUnitId) {
	var treePanel = new Ext.tree.ColumnTree({
		id : 'approvl-tree',
		region : 'center',
		frame : false,
		border : false,
		rootVisible : true,
		lines : true,
		autoScroll : true,
		animate : false,
		// cascade级联选择/ascend父节点级选/multiple多选/single单选
		checkModel : "cascade",
		
		root : root,	
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
				}, {
					xtype : 'tbspacer',
					hidden : !RW
				}, {
					xtype : 'tbspacer',
					hidden : !RW
				}, '-',{
					text : '保存',
					iconCls : 'save',
					hidden : !RW,
					handler : saveHandler
				}, '-',{
					xtype : 'tbspacer',
					hidden : !RW
				}, {
					xtype : 'tbspacer',
					hidden : !RW
				},{
					xtype : 'tbspacer',
					hidden : !RW
				},{
					xtype : 'tbspacer',
					hidden : !RW
				},
				{
					text : "批文初始化", 
					iconCls : 'btn',
					hidden : !RW||true,
					handler : exchangeHandler
				}, 
					{
					xtype : 'tbspacer',
					hidden : !RW
				}, {
					xtype : 'tbspacer',
					hidden : !RW
				}, '&nbsp;&nbsp;&nbsp;集团二级公司:&nbsp;&nbsp;', indTypeCombo],
		columns : [{
					header : '批文分类名称',
					width : 400,
					dataIndex : 'classifyName'
				},
//				{
//					header : '批文分类编号',        //真实批文分类编号, 注解该列, 调试时去掉注解
//					width : 200,
//					hiddenLabel: true,
//					hidden: true,
//					labelWidth: 0,
//					dataIndex : 'classfiyNo'
//				},
					{
					header : '批文分类编号',       //伪批文分类编号
					width : 200,
					dataIndex : 'classfiyNoPre'
				}, {
					header : '批文等级',
					width : 200,
					dataIndex : 'pwLevel'
				}, {
					id:'memo',
					header : '备注',
					width : 200,
					dataIndex : 'memo',
					renderer: function(value, node, attributes){
								Ext.apply(attributes,{qtitle: value})
								/*if(tip==''||tip==null)
									return ;
								else
								{
									metadata.attr = 'title="'+tip+'"';
								}*/
								return value;
							  }
				}],
		loader : new Ext.tree.TreeLoader({
					url : MAIN_SERVLET,
					baseParams : {
						ac : "columntree",
						treeName : "pwsortTreeSub",
						businessName : "approvlMgm",
						parent : "0",
						unitid : ''
					},
					clearOnLoad : true,
					baseAttrs : {
						expanded : true
					},
					uiProviders : {
						'col' : Ext.tree.ColumnNodeUI
					}
				}),

		listeners : {
			beforeload : function(node, e) {
				var parentid = node.attributes.classfiyNo;
				if (parentid == null || parentid == "" || parentid == undefined) {
					parentid = "0";
				}
				var baseParams = treePanel.loader.baseParams
				baseParams.parent = parentid;
				Ext.getBody().mask();
			},
			load:function(){
				Ext.getBody().unmask();
			}
		}
	});
	return treePanel
}

 //批文初始化数据交互
function exchangeHandler() {
	var unit2Id = indTypeCombo.getValue();
	var n = projTreePanel.getSelectionModel().getSelectedNode();
	if (unit2Id == "") {
		Ext.example.msg('提示', '请您选中二级企业!');
		return;
	} else if (n == null) {
		Ext.example.msg('提示', '请您选中项目单位!');
		return;
	}

	DWREngine.setAsync(false);
	approvlMgm.distributePcPwTree(n.id, function(flag) {
				if (flag=='success'||flag=='SUCESS') {
					Ext.example.msg('提示', '数据交互成功!');
				} else {
					Ext.example.msg('提示', '数据交互失败!');
				}
			});
	DWREngine.setAsync(true);
}

function saveHandler() {
	var checkedNodes = new Array();
	checkedNodes = pwTreePanel.getChecked("classfiyNo");
	var unit2Id = indTypeCombo.getValue();
	var n = projTreePanel.getSelectionModel().getSelectedNode();
	if (unit2Id == "") {
		Ext.example.msg('提示', '请您选中二级企业!');
		return;
	} else if (n == null) {
		Ext.example.msg('提示', '请您选中项目单位!');
		return;
	}
	
	approvlMgm.initProjPwSortBySortIds(unit2Id, n.id, checkedNodes.join(","),
			function(flag) {
				if (flag) {
					Ext.example.msg('提示', '操作成功!');
				} else {
					Ext.example.msg('提示', '操作失败!');
				}
			});
}

// 批文分类树刷新
function loadPwTree(unitId, pid) {
	pwTreePanel.loader.baseParams.unitid = unitId;
	pwTreePanel.loader.baseParams.pid = (pid || "");
	pwTreePanel.root.reload();
}
// 二级企业下辖项目单位树刷新
function loadProjTree(unitId, unitName) {
	var rt = projTreePanel.root;
	if (rt.id == unitId)
	{
		return;     //如果下拉框选选中当前的二级公司就返回
	}
	rt.id = unitId;
	rt.setText(unitName);
	projTreePanel.loader.baseParams.parent = unitId;
	rt.reload()
}