parent._xmlName == null ? parent.flwCommonPanel.getBottomToolbar().items.get('next').disable() :
	parent.flwCommonPanel.getBottomToolbar().items.get('next').enable()

Ext.onReady(function(){
	
	var appletPanel = new Ext.Panel({
		region: 'center',
		border: false,
		autoScroll: true
    });
    
	var appletTpl = new Ext.XTemplate(
        '<applet code="org.jhotdraw.samples.draw.CommonApplet"',
		'name="commonApplet" width="700" height="400" archive="'+CONTEXT_PATH+'/jsp/flow/FlowDraw.jar" id="commonApplet">',
		'<tpl if="xmlName != null">',
		'<param name="datafile" value="../../temp/{xmlName}.xml" />',
		'</tpl>',
		'</applet>'
    );
    
    var data = {
    	xmlName: parent._xmlName
    };
    
	var viewport1 = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [appletPanel]
	});
	
	appletTpl.overwrite(appletPanel.body, data);
	
	if (parent._xmlName == null){
		window.document.applets[0].setFigure(parent.B_NODEID, parent.B_NAME, parent.E_NODEID, parent.E_NAME);
	}

});

function createXML(xmlOutput, name){
	flwDefinitionMgm.createXML(xmlOutput, name, function(xmlName){
		parent._xmlName = xmlName;
		oPopup._alert(window, '提示', '流程图保存成功，可以进行下一步配置！', parent.flwCommonPanel.getSize());
	});
}

/**
 * 与Applet通信的方法 - 保存绘图区的矢量图、图形之间的关联关系
 */
function saveFigures(xmlOutput, allFigureInfo){
	createXML(
		xmlOutput, 
		(parent._xmlName == null ? '' : parent._xmlName)
	);
	var FigurePath = function(){
		this.cpathid,
		this.flowid,
		this.nodeid,
		this.startid,
		this.starttype,
		this.endid
	};
	var _linkNum = allFigureInfo.replace(/]/, "").split(',');
	parent._allFigurePath.length = 0;
	for (var i = 0; i < _linkNum.length; i++) {
		var _property = _linkNum[i].split('@');
		var _figurePath = new FigurePath();
		_figurePath.cpathid = '';
		_figurePath.flowid = parent.FLOW_ID;
		_figurePath.nodeid = parent.B_NODEID;
		_figurePath.startid = _property[0].split(':')[1];
		_figurePath.starttype = _property[3].split(':')[1];
		_figurePath.endid = _property[4].split(':')[1];
		parent._allFigurePath.push(_figurePath);
	}
	parent.flwCommonPanel.getBottomToolbar().items.get('next').enable();
}

/**
 * 与Applet通信的方法 - 设置[下一步]按钮变灰
 */
function disableNextBtn(){
	parent.flwCommonPanel.getBottomToolbar().items.get('next').disable();
}

/**
 * 与Applet通信的方法 - 删除节点信息
 */
function deleteFigure(hashCode){
	if (parent._allFlowNode){
		var nodes = parent._allFlowNode;
		for (var i=0; i<nodes.length; i++){
			if (nodes[i].cnodeid == hashCode){
				nodes.splice(i, 1);
			}
		}
	}
}