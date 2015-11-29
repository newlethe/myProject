
Ext.onReady(function(){
	
	var viewPanel = new Ext.Panel({
		region: 'center',
		border: false,
		autoScroll: true
	});
	
	var viewTpl = new Ext.XTemplate(
		'<table width="680" border=0 cellpadding=3 cellspacing=5>',
		'	<tr>',
		'		<td colspan="3" style="color: #15428b">&nbsp;&nbsp;状态节点</td>',
		'		<td>',
		'			<table width="100%" border=0 cellpadding=0 cellspacing=0>',
		'				<tr>',
		'					<td width="590"></td>',
		'					<td><div class="trFurlBtn" onclick="showOrHide(this, \'tr1\')" onmouseover="this.style.cursor=\'hand\'">&nbsp;</div></td>',
		'				</tr>',
		'			</table>',
		'		</td>',
		'	</tr>',
		'	<tr><td colspan="4"><hr></td></tr>',
		'	<tr id="tr1">',
		'		<td colspan="4">',
		'			<table width="100%" border=0 cellpadding=0 cellspacing=0>',
		'				<tr>',
		'					<td class="viewLabel">上一节点</td>',
		'					<td class="viewData">{bnode}</td>',
		'					<td class="viewLabel">下一节点</td>',
		'					<td class="viewData">{enode}</td>',
		'				</tr>',
		'			</table>',
		'		</td>',
		'	</tr>',
		'	<tr>',
		'		<td colspan="3" style="color: #15428b">&nbsp;&nbsp;普通节点</td>',
		'		<td>',
		'			<table width="100%" border=0 cellpadding=0 cellspacing=0>',
		'				<tr>',
		'					<td width="590"></td>',
		'					<td><div class="trFurlBtn" onclick="showOrHide(this, \'tr2\')" onmouseover="this.style.cursor=\'hand\'">&nbsp;</div></td>',
		'				</tr>',
		'			</table>',
		'		</td>',
		'	</tr>',
		'	<tr><td colspan="4"><hr></td></tr>',
		'	<tr id="tr2">',
		'		<td colspan="4">',
		'			<table width="100%" border=0 cellpadding=2 cellspacing=3>',
		'				<tr>',
		'					<td class="viewTitle" width="30">序号</td>',
		'					<td class="viewTitle">节点名称</td>',
		'					<td class="viewTitle">处理人类型</td>',
		'					<td class="viewTitle">处理角色</td>',
		'					<td class="viewTitle">默认处理人</td>',
		'				</tr>',
		'				<tpl for="flowNode">',
		'					<tr>',
		'						<td style="text-align: center">{#}</td>',
		'						<td style="text-align: center">{name}</td>',
		'						<td style="text-align: center">',
		'							<tpl if="istopromoter == \'S\'">普通</tpl>',
		'							<tpl if="istopromoter == \'P\'">流程发起人</tpl>',
		'						</td>',
		'						<td class="">',
		'							<div id="role{#}" style="display: none;">{rolename}</div>',
		'							<div id="sel{#}"></div>',
		'						</td>',
		'						<td style="text-align: center">{realname}</td>',
		'					</tr>',
		'				</tpl>',
		'			</table>',
		'		</td>',
		'	</tr>',
		'	<tr>',
		'		<td colspan="3" style="color: #15428b">&nbsp;&nbsp;流程图</td>',
		'		<td>',
		'			<table width="100%" border=0 cellpadding=0 cellspacing=0>',
		'				<tr>',
		'					<td width="590"></td>',
		'					<td><div class="trFurlBtn" onclick="showOrHide(this, \'viewApplet\')" onmouseover="this.style.cursor=\'hand\'">&nbsp;</div></td>',
		'				</tr>',
		'			</table>',
		'		</td>',
		'	</tr>',
		'	<tr><td colspan="4"><hr></td></tr>',
		'</table>',
		'<div style="padding: 5px 5px;">',
		'	<applet code="org.jhotdraw.samples.draw.ViewApplet" ',
		'	name="viewApplet" width="674" height="400" ',
		'	archive="'+CONTEXT_PATH+'/jsp/flow/FlowDraw.jar" id="viewApplet">',
		'		<param name="datafile" value="../../temp/{xmlName}.xml" />',
		'	</applet>',
		'</div>'
	);
	
	
	var data = {
		xmlName: parent._xmlName,
		flowNode: parent._allFlowNode,
		bnode: parent.B_NAME,
		enode: parent.E_NAME
	};
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [viewPanel]
	});
	
	viewTpl.overwrite(viewPanel.body, data);
	
	setSelect();
	
});

function setSelect(){
	for (var i = 1; i < parent._allFlowNode.length+1; i++) {
		var arr = document.getElementById('role'+i).innerHTML.split(',');
		var outStr = '<select size="1" style="width: 100%">';
			for (var j = 0; j < arr.length; j++) {
				outStr += '<option value="'+j+'">'+arr[j];
			}
		outStr += '</select>';
		document.getElementById('sel'+i).innerHTML = outStr;
	}
}