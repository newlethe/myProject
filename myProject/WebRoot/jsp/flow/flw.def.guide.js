/**
 * 临时存储流程定义相关信息
 * 
 * _allFigurePath - 数据结构
 * var FigurePath = function(){
 *		this.pathid,
 *		this.flowid,
 *		this.startid,
 *		this.startType,
 *		this.endid
 *	};
 * 
 * _allFlowNode - 数据结构
 * var FlowNode = function(){
 *		this.nodeid,
 *		this.flowid,
 *		this.name,
 *		this.handler,
 *		this.role,
 *		this.rolename,
 *		this.type,
 *		this.funid,
 *		this.funname,
 *		this.realname
 *	};
 */
var _flwTitle, _xmlName, _allFigurePath = new Array(), _allFlowNode = new Array();

var flwDefWindow;
var _WIDTH = 712, _HEIGHT = 472;
var step = [
	'flw.def.main.jsp',
	'flw.def.draw.jsp',
	'flw.def.config.jsp',
	'flw.def.finish.jsp'
];
var _modData = new Array();
var _funData = new Array();
var _roleData = new Array();

var STATE = 0	//0 - 未完成；1 - 完成；2 - 修改；(在删除xml时判断)

baseDao.findByWhere2('com.sgepit.frame.sysman.hbm.RockPower','', function(list){
	for (var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i].powerpk);
		temp.push(list[i].powername);
		_modData.push(temp);
	}
});
baseDao.findByWhere2('com.sgepit.frame.flow.hbm.FlwFace','', function(list){
	var arrNull = new Array();
	arrNull.push('"null"');
	arrNull.push('无');
	_funData.push(arrNull)
	for (var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i].faceid);
		temp.push(list[i].funname);
		_funData.push(temp);
	}
});
systemMgm.getRoles(function(list){
	for (var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i].rolepk);
		temp.push(list[i].rolename);
		_roleData.push(temp);
	}
});

var tbs = [
	{
		xtype: 'tbtext',
		text: '<font color=#15428b>　导航:　</font>'		
	},{
		xtype: 'tbtext',
		text: '<font color=#3C8E60>关联业务模块</font>'
	},{ 
		xtype: 'tbtext', text: ' >> '
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

function flwDefWin(){
	if (!flwDefWindow){
		flwDefWindow = new Ext.Window({
			title: '流程定义向导 v1.0',
			tbar: tbs,
			iconCls: 'flow', closeAction: 'hide',
			width: _WIDTH, height: _HEIGHT,
			modal: true, plain: true, border: false, resizable: false,
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
		//TODO
		flwDefWindow.on('beforeHide', function(){
			ds.load({
				params: {
					start: 0,
					limit: PAGE_SIZE
				}
			});
//			oPopup._msgBox(
//				window, 
//				'提示', 
//				'您确定要退出吗？', 
//				flwDefWindow.getSize(),
//				check
//			);
////			return false;
			interruptGuide();
		})
	} else { flwDefWindow.doAutoLoad(); }
	flwDefWindow.show();
}

function processJump(){
	var _type = this.id, _page;
	var _pageIndex = findPageIndex();
	if (_pageIndex == '0') {
		_flwTitle = window.frames("defDispatcher").panel.getForm().findField('flowTitle').getValue();
	}
	if (null != _pageIndex){
		if ('prev' == _type){
			_page = step[_pageIndex - 1];
		} else if ('next' == _type){
			_page = step[_pageIndex + 1];
		}
		flwDefWindow.autoLoad.url = BASE_PATH + 'jsp/flow/defDispatcher.jsp';
		flwDefWindow.autoLoad.params = 'page=' + _page;
		flwDefWindow.autoLoad.callback = checkBtnState;
		flwDefWindow.doAutoLoad();
	}
}

function findPageIndex(){
	var _params = flwDefWindow.autoLoad.params;
	var _page = _params.substring(_params.lastIndexOf('=') + 1, _params.length);
	for (var i = 0; i < step.length; i++) {
		if (_page == step[i]) return i;
	}
	return null;
}

function checkBtnState(){
	var _btns = flwDefWindow.getBottomToolbar();
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
		2 == _pageIndex ? flwDefWindow.setWidth(850) : flwDefWindow.setWidth(_WIDTH)
	}
}

function controlGuideTbar(pageIndex){
	var _index = ['1','3','5','7'];
	var _text = flwDefWindow.getTopToolbar().items;
	for (var i = 0; i < _index.length; i++) {
		if (pageIndex == i){
			_text.itemAt(_index[i]).enable();
			continue;
		}
		_text.itemAt(_index[i]).disable();
	}
}

function interruptGuide(){
	if (_xmlName && STATE == 0) flwDefinitionMgm.deleteXML(_xmlName);
	_flwTitle = null, _xmlName = null, _allFigurePath.length = 0, _allFlowNode.length = 0;
	with(flwDefWindow.autoLoad){
		url = BASE_PATH + 'jsp/flow/defDispatcher.jsp';
		params = 'page=' + step[0];
		text = 'Loading...';
		callback = checkBtnState;
	}
}

/**
 * 最终保存流程定义的方法
 */
function finishGuide(){
	if (STATE == 2){
		flwDefinitionMgm.saveFlwDefGuide(smFlw.getSelected().get('flowid'), _flwTitle, _xmlName, Ext.encode(_allFigurePath),
			Ext.encode(_allFlowNode), USERBELONGUNITID, function(flag){
			if (flag == 0) {
				Ext.Msg.show({
					title: '提示',
					msg: '成功修改流程！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO
				});
				//flwDefWindow.hide();
				window.location.href = window.location.href;
			}
		});
	} else {
		STATE = 1;
		flwDefinitionMgm.saveFlwDefGuide('', _flwTitle, _xmlName, Ext.encode(_allFigurePath),
				Ext.encode(_allFlowNode),USERBELONGUNITID, function(flag){
			if (flag == 0) {
				Ext.Msg.show({
					title: '提示',
					msg: '成功定义流程！',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO
				});
				flwDefWindow.hide();
			}
		});
	}
}