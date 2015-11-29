parent._xmlName == null ? parent.flwDefWindow.getBottomToolbar().items.get('next').disable() :
	parent.flwDefWindow.getBottomToolbar().items.get('next').enable()

Ext.onReady(function(){
	
	var appletPanel = new Ext.Panel({
		region: 'center',
		border: false
    });
    
	var appletTpl = new Ext.XTemplate(
        '<applet code="org.jhotdraw.samples.draw.DrawApplet"',
		'name="drawApplet" width="700" height="400" archive="'+CONTEXT_PATH+'/jsp/flow/FlowDraw.jar" id="drawApplet">',
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
});

function createXML(xmlOutput, name){
	flwDefinitionMgm.createXML(xmlOutput, name, function(xmlName){
		parent._xmlName = xmlName;
		oPopup._alert(window, '提示', '流程图保存成功，可以进行下一步配置！', parent.flwDefWindow.getSize());
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
		this.pathid,
		this.flowid,
		this.startid,
		this.startType,
		this.endid
	};
	var _linkNum = allFigureInfo.replace(/]/, "").split(',');
	parent._allFigurePath.length = 0;
	for (var i = 0; i < _linkNum.length; i++) {
		var _property = _linkNum[i].split('@');
		var _figurePath = new FigurePath();
		_figurePath.pathid = '';
		_figurePath.flowid = '';
		_figurePath.startid = _property[0].split(':')[1];
		_figurePath.startType = _property[3].split(':')[1];
		_figurePath.endid = _property[4].split(':')[1];
		parent._allFigurePath.push(_figurePath);
	}
	parent.flwDefWindow.getBottomToolbar().items.get('next').enable();
}

/**
 * 与Applet通信的方法 - 设置[下一步]按钮变灰
 */
function disableNextBtn(){
	parent.flwDefWindow.getBottomToolbar().items.get('next').disable();
}