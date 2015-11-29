/**
 * 临时存储流程定义相关信息
 * 
 * _allFigurePath - 数据结构
 * var FigurePath = function(){
 *		this.cpathid,
 *		this.flowid,
 *		this.nodeid,
 *		this.startid,
 *		this.starttype,
 *		this.endid
 *	};
 * 
 * _allFlowNode - 数据结构
 * var FlowNode = function(){
 * 		this.cnodeid,
 *		this.nodeid,
 *		this.flowid,
 *		this.name,
 *		this.handler,
 *		this.role,
 *		this.rolename,
 *		this.realname
 *	};
 */
var _xmlName, _allFigurePath = new Array(), _allFlowNode = new Array();

var flwCommonPanel;
var step = [
	'flw.common.draw.jsp',
	'flw.common.config.jsp',
	'flw.common.finish.jsp'
];
var _roleData = new Array();

var STATE = 0	//0 - 未完成；1 - 完成；2 - 修改；(在删除xml时判断)

DWREngine.setAsync(false);
systemMgm.getRoles(function(list){
	for (var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i].rolepk);
		temp.push(list[i].rolename);
		_roleData.push(temp);
	}
});
DWREngine.setAsync(true);

var tbs = [
	{
		xtype: 'tbtext',
		text: '<font color=#15428b>　导航:　</font>'		
	},{
		xtype: 'tbtext',
		text: '<font color=#3C8E60>绘制流程图</font>'
	},{ 
		xtype: 'tbtext', text: ' >> '
	},{
		xtype: 'tbtext',
		text: '<font color=#3C8E60>流程图节点配置</font>'
	},{ 
		xtype: 'tbtext', text: ' >> '
	},{
		xtype: 'tbtext',
		text: '<font color=#3C8E60>完成</font>'
	}
];

var B_NODEID = parent.B_NODEID, B_NAME = parent.B_NAME, E_NODEID = parent.E_NODEID, E_NAME = parent.E_NAME, FLOW_ID = parent.FLOW_ID;

Ext.onReady(function(){
	
	flwCommonPanel = new Ext.Panel({
		tbar: tbs, 
		hander: false,
		region: 'center',
		iconCls: 'flow',
		border: false,
		autoLoad: {
			url: BASE_PATH + 'jsp/flow/defDispatcher.jsp',
			params: 'page=' + step[0],
			text: 'Loading...',
			callback: checkBtnState
		},
		bbar: ['->',{
			id: 'prev', text: '上一步',
			iconCls: 'pagePrev',
			handler: processJump
		},'-',{
			id: 'next', text: '下一步',
			iconCls: 'pageNext',
			handler: processJump
		},'-']
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [flwCommonPanel]
	});
	
	baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwCommonNode", "flowid='"+FLOW_ID+"' and nodeid='"+B_NODEID+"'", function(list){
		if(list.length > 0){
			loadFlowCommonData(B_NODEID);
		}
	});
});

function processJump(){
	var _type = this.id, _page;
	var _pageIndex = findPageIndex();
	if (null != _pageIndex){
		if ('prev' == _type){
			_page = step[_pageIndex - 1];
		} else if ('next' == _type){
			_page = step[_pageIndex + 1];
		}
		flwCommonPanel.autoLoad.url = BASE_PATH + 'jsp/flow/defDispatcher.jsp';
		flwCommonPanel.autoLoad.params = 'page=' + _page;
		flwCommonPanel.autoLoad.callback = checkBtnState;
		flwCommonPanel.doAutoLoad();
	}
}

function findPageIndex(){
	var _params = flwCommonPanel.autoLoad.params;
	var _page = _params.substring(_params.lastIndexOf('=') + 1, _params.length);
	for (var i = 0; i < step.length; i++) {
		if (_page == step[i]) return i;
	}
	return null;
}

function checkBtnState(){
	var _btns = flwCommonPanel.getBottomToolbar();
	var _pageIndex = findPageIndex();
	controlGuideTbar(_pageIndex);
	if (null != _pageIndex){
		if (0 == _pageIndex){
			_btns.items.get('prev').disable();
			_btns.items.get('next').enable();
			if (_btns.items.get('finish')) _btns.items.get('finish').destroy();
		} else if (step.length - 1 == _pageIndex){
			_btns.items.get('prev').enable();
			_btns.items.get('next').disable();
			_btns.addButton(
				new Ext.Button({
					id: 'finish', text: '完成',
					iconCls: 'finish',
					handler: finishGuide
				})
			)
		} else {
			_btns.items.get('prev').enable();
			_btns.items.get('next').enable();
			if (_btns.items.get('finish')) _btns.items.get('finish').destroy();
		}
	}
}

function controlGuideTbar(pageIndex){
	var _index = ['1','3','5'];
	var _text = flwCommonPanel.getTopToolbar().items;
	for (var i = 0; i < _index.length; i++) {
		if (pageIndex == i){
			_text.itemAt(_index[i]).enable();
			continue;
		}
		_text.itemAt(_index[i]).disable();
	}
}

//function interruptGuide(){
//	if (_xmlName && STATE == 0) flwDefinitionMgm.deleteXML(_xmlName);
//	_xmlName = null, _allFigurePath.length = 0, _allFlowNode.length = 0;
//	with(flwCommonPanel.autoLoad){
//		url = BASE_PATH + 'jsp/flow/defDispatcher.jsp';
//		params = 'page=' + step[0];
//		text = 'Loading...';
//		callback = checkBtnState;
//	}
//}

/**
 * 最终保存定义的方法
 */
function finishGuide(){
	if (STATE == 2){
		flwDefinitionMgm.saveFlwCommonNode(false, FLOW_ID, B_NODEID, _xmlName, Ext.encode(_allFigurePath), Ext.encode(_allFlowNode), function(flag){
			if (flag == 0) {
		 	  	window.frames[0].document.getElementById('viewApplet').style.display = 'none';
				Ext.Msg.show({
					title: '提示',
					msg: '成功修改普通节点！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO,
					fn: function(value){
						if (value == 'ok'){
							window.location.reload();
						}
					}
				});
			}
		});
	} else {
		STATE = 1;
		flwDefinitionMgm.saveFlwCommonNode(true, FLOW_ID, B_NODEID, _xmlName, Ext.encode(_allFigurePath), Ext.encode(_allFlowNode), function(flag){
			if (flag == 0) {
				STATE = 2;
				window.frames[0].document.getElementById('viewApplet').style.display = 'none';
				Ext.Msg.show({
					title: '提示',
					msg: '成功定义普通节点！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO,
					fn: function(value){
						if (value == 'ok'){
							window.location.reload();
						}
					}
				});
			}
		});
	}
}

/**
 * 修改时，加载_xmlName, _allFigurePath, _allFlowNode
 */
function loadFlowCommonData(nodeid){
	var FigurePath = function(){
		this.cpathid,
		this.flowid,
		this.nodeid,
		this.startid,
		this.starttype,
		this.endid
	};
	var FlowNode = function(){
		this.cnodeid,
		this.nodeid,
		this.flowid,
		this.name,
		this.handler,
		this.role,
		this.rolename,
		this.realname,
		this.bifurcate,
		this.merge,
		this.istopromoter
	};
	DWREngine.setAsync(false);
	baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwNodeView", "flowid='"+FLOW_ID+"' and nodeid='"+nodeid+"'", function(list){
		_xmlName = list[0].xmlname;
	});
	baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwCommonNodePath", "flowid='"+FLOW_ID+"'", function(list){
		for (var i = 0; i < list.length; i++) {
			var obj = new FigurePath();
			obj.cpathid = list[i].cpathid;
			obj.flowid = list[i].flowid;
			obj.nodeid = list[i].nodeid;
			obj.startid = list[i].startid;
			obj.starttype = list[i].starttype;
			obj.endid = list[i].endid;
			_allFigurePath.push(obj);
		}
	});
	baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwCommonNode", "flowid='"+FLOW_ID+"' and nodeid='"+nodeid+"'", function(list){
		for (var i = 0; i < list.length; i++) {
			var o = new FlowNode();
			o.cnodeid = list[i].cnodeid;
			o.nodeid = list[i].nodeid;
			o.flowid = list[i].flowid;
			o.name = list[i].name;
			o.handler = list[i].handler;
			o.role = list[i].role;
			o.rolename = getRolename(list[i].role);
			o.realname = getRealname(list[i].handler);
			o.bifurcate = list[i].bifurcate;
			o.merge = list[i].merge;
			o.istopromoter = list[i].istopromoter;
			_allFlowNode.push(o);
		}
	});
	DWREngine.setAsync(true);
	STATE = 2;
}

function getRolename(strRole){
	var arr = strRole.split(',');
	var strName = "";
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < _roleData.length; j++){
			if (arr[i] == _roleData[j][0]) {
				strName += _roleData[j][1];
				break;
			}
		}
		if (i != arr.length - 1) strName += ',';
	}
	return strName;
}

function getRealname(userid){
	for (var i=0; i<parent._userData.length; i++) {
		if (parent._userData[i][0] == userid){
			return parent._userData[i][1];
		}
	}
}