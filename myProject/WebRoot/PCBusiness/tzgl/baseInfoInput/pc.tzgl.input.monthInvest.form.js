var bean3="com.sgepit.pcmis.tzgl.hbm.VPcTzglMonthReport";
var tpl =
'<div style="float:right;">单位:元&nbsp;&nbsp;&nbsp;&nbsp;</div>' +
'<div style="border-style:double;width:800px;">' +
'	<div>' +
'		<div class="div_t" style="border-top-style:none">项目信息</div>' +
'			<div>' +
'				<table width="100%"  cellpadding="0" cellspacing="0">' +
'					<tr>' +
'						<td width="20%" class="tNormal td_disable">项目名称</td>' +
'						<td width="40%" class="tNormal td_disable">' +
'							<input type="text" style="text-align:left;border:1px solid #E1E1E1;" readOnly id=unitname value="{unitname}"/>' +
'						</td>' +
'						<td width="20%" class="tNormal td_disable">总投资</td>' +
'						<td width="20%" class="td_r td_disable">' +
'							<input name="text" type="text" id=totalinvestcal style="text-align:center;border:1px solid #E1E1E1;" value="{totalinvestcal}" readonly/>' +
'						</td>' +
'					</tr>' +
'					<tr>' +
'						<td width="20%" class="tNormal td_disable">至上年底累计完成投资</td>' +
'						<td width="40%" class="tNormal td_disable">' +
'							<input type="text" style="text-align:center;border:1px solid #E1E1E1;" readOnly id=lastyeartotalcomp value="{lastyeartotalcomp}"/>' +
'						</td>' +
'						<td width="20%" class="tNormal td_disable">本年计划投资(万元）</td>' +
'						<td width="20%" class="td_r td_disable">' +
'							<input type="text" style="text-align:center;border:1px solid #E1E1E1;" readOnly id=yearinvestfund value="{yearinvestfund}"/>' +
'						</td>' +
'					</tr>' +
'					<tr>' +
'						<td class="tNormal td_disable">工程形象进度</td>' +
'						<td colspan="3" class="td_r" style=" text-align:left;">' +
'							<input type="text" maxlength=100 onfocus="onfocusFn(this)" onblur="onblurFn(this)" id=progressObjective style="text-align:left;" value="{progressObjective}"/>' +
'						</td>' +
'					</tr>' +
'					<tr>' +
'						<td class="td_b td_disable">备注</td>' +
'						<td colspan="3" class="td_r_b">' +
'							<input type="text" maxlength=100 onfocus="onfocusFn(this)" onblur="onblurFn(this)" style="text-align:left;" id=memo value="{memo}"/>' +		  
'						</td>' +
'					</tr>' +
'				</table>' +
'			</div>' +
'		</div>' +
'	<div>' +
'	<div class="div_t">本年投资完成</div>' +
'		<div>' +
'			<table width="100%" border="0" cellpadding="0" cellspacing="0">' +
'				<tr>' +
'					<td colspan="2" width="25%" class="tNormal td_disable">土建</td>' +
'					<td colspan="2" width="25%" class="tNormal td_disable">设备</td>' +
'					<td colspan="2" width="25%" class="tNormal td_disable">安装</td>' +
'					<td colspan="2" width="25%" class="td_r td_disable">其他</td>' +
'				</tr>' +
'				<tr>' +
'					<td width="12.5%" class="tNormal td_disable">累计</td>' +
'					<td width="12.5%" class="tNormal td_disable">其中：本月</td>' +
'					<td width="12.5%" class="tNormal td_disable">累计</td>' +
'					<td width="12.5%" class="tNormal td_disable">其中：本月</td>' +
'					<td width="12.5%" class="tNormal td_disable">累计</td>' +
'					<td width="12.5%" class="tNormal td_disable">其中：本月</td>' +
'					<td width="12.5%" class="tNormal td_disable">累计</td>' +
'					<td width="12.5%" class="td_r td_disable">其中：本月</td>' +
'				</tr>' +
'				<tr>' +
'					<td width="12.5%" class="td_b  td_disable">' +
'						<input type="text" style="text-align:center;border:1px solid #E1E1E1;" readOnly id=totalbuild value="{totalbuild}"/>' +		  
'					</td>' +
'					<td width="12.5%" class="td_b">' +
'						<input type="text" maxlength=12 onfocus="onfocusFn(this)" onblur="onblurFn(this)" onkeyup="onkeyupFn(this)" onafterpaste="onafterpasteFn(this)" id=monthCompBuild value="{monthCompBuild}"/>' +		  
'					</td>' +
'					<td width="12.5%" class="td_b td_disable">' +
'						<input type="text" style="text-align:center;border:1px solid #E1E1E1;" readOnly id=totalequip value="{totalequip}"/>' +		  
'					</td>' +
'					<td width="12.5%" class="td_b">' +
'						<input type="text" maxlength=12 onfocus="onfocusFn(this)" onblur="onblurFn(this)" onkeyup="onkeyupFn(this)" onafterpaste="onafterpasteFn(this)" id=monthCompEquip value="{monthCompEquip}"/>' +		  
'					</td>' +
'					<td width="12.5%" class="td_b td_disable">' +
'						<input type="text" style="text-align:center;border:1px solid #E1E1E1;" readOnly id=totalinstall value="{totalinstall}"/>' +		  
'					</td>' +
'					<td width="12.5%" class="td_b">' +
'						<input type="text" maxlength=12 onfocus="onfocusFn(this)" onblur="onblurFn(this)" onkeyup="onkeyupFn(this)" onafterpaste="onafterpasteFn(this)" id=monthCompInstall value="{monthCompInstall}"/>' +		  
'					</td>' +
'					<td width="12.5%" class="td_b td_disable">' +
'						<input type="text" style="text-align:center;border:1px solid #E1E1E1;" readOnly id=totalother value="{totalother}"/>' +		  
'					</td>' +
'					<td width="12.5%" class="td_r_b">' +
'						<input type="text" maxlength=12 onfocus="onfocusFn(this)" onblur="onblurFn(this)" onkeyup="onkeyupFn(this)" onafterpaste="onafterpasteFn(this)" id=monthCompOther value="{monthCompOther}"/>' +		  
'					</td>' +
'				</tr>' +
'			</table>' +
'		</div>' +
'	</div>' +
'	<div>' +
'		<div class="div_t">资金到位</div>' +
'		<div>' +
'			<table width="100%" cellpadding="0" cellspacing="0">' +
'				<tr>' +
'					<td width="29%" rowspan="2"  class="tNormal td_disable">累计资金到位</td>' +
'					<td width="36%" rowspan="2" class="tNormal td_disable">本年计划资金到位</td>' +
'					<td colspan="2" class="td_r td_disable">本年到位</td>' +
'				</tr>' +
'				<tr>' +
'					<td width="19%" class="tNormal td_disable">累计</td>' +
'					<td width="16%" class="td_r td_disable">其中：本月</td>' +
'				</tr>' +
'				<tr>' +
'					<td class="td_b td_disable">' +
'						<input type="text" style="text-align:center;border:1px solid #E1E1E1;" readOnly id=totalfunded value="{totalfunded}"/>' +
'					</td>' +
'					<td class="td_b td_disable">' +
'						<input type="text" style="text-align:center;border:1px solid #E1E1E1;" readOnly id=yearplanfund value="{yearplanfund}"/>' +
'					</td>' +
'					<td class="td_b td_disable">' +
'						<input type="text" style="text-align:center;border:1px solid #E1E1E1;" readOnly id=totalfundedyear value="{totalfundedyear}"/>' +
'					</td>' +
'					<td class="td_r_b">' +
'						<input type="text" maxlength=12 onfocus="onfocusFn(this)" onblur="onblurFn(this)" onkeyup="onkeyupFn(this)" ' +
'							onafterpaste="onafterpasteFn(this)" id=monthFullFunded value="{monthFullFunded}"/>' +
'					</td>' +
'				</tr>' +
'			</table>' +
'		</div>' +
'	</div>' +
'</div>';
var columns = [
	{id:"progressObjective",type:"text", events:{onfocus:"onfocusFn",onblur:"onblurFn"}},
	{id:"memo",type:"text", events:{onfocus:"onfocusFn",onblur:"onblurFn"}},
	{id:"monthFullFunded",type:"number"},
	{id:"monthCompBuild",type:"number"},
	{id:"monthCompEquip",type:"number"},
	{id:"monthCompInstall",type:"number"},
	{id:"monthCompOther",type:"number"}
];
var m_record = window.dialogArguments;
var initData = {};
Ext.onReady(function(){
	var isHidden = false; 
	if(m_record.get('reportStatus')==1) isHidden=true;
	var formPanel = new Ext.Panel({
		bodyStyle:'padding:10px;',
		buttonAlign:'center',
		buttons: [{
				text:"获取数据",
				id:"getData",
				hidden:isHidden,
				handler:function(){
					var sjType=m_record.get('sjType');
					var pid=m_record.get('pid');
					DWREngine.setAsync(false);
					pcTzglService.getCompData(pid,sjType,function(list){
						if(list.length>0){
							initData.totalbuild = list[0];
							initData.monthCompBuild = list[1];
							initData.totalequip = list[2];
							initData.monthCompEquip = list[3];
							initData.totalinstall = list[4];
							initData.monthCompInstall = list[5];
							initData.totalother = list[6];
							initData.monthCompOther = list[7];
						}
						var viewTpl = new Ext.XTemplate(tpl);
						viewTpl.overwrite(formPanel.body,initData);					
					});
					DWREngine.setAsync(true);
				}
			
			},{
				text:"确定",
				id:"save",
				hidden:isHidden,
				handler:function(){
					DWREngine.setAsync(false);
					if(initData.uids==undefined||initData.uids==null||initData.uids ==""){//主键为空表示新增数据
			    		initData.masterId=m_record.get('uids');	
						initData.pid=m_record.get('pid');
						initData.sjType=m_record.get('sjType');
						initData.unitId=m_record.get('pid');
						initData.zbSeqno=m_record.get('pid');
					}	
					for(var i in columns) {
						var id = columns[i].id;
						var o = document.getElementById(id);
						if(o) initData[id] = o.value;
					}
					var ob=document.getElementById('yearinvestfund');
					if(ob)initData.yearPlanInves=ob.value;
					ob=document.getElementById('yearplanfund');
					if(ob)initData.yearPlanFullFunded=ob.value;
					ob=document.getElementById('totalinvestcal');
					if(ob)initData.totalInvest=ob.value;
			   		pcTzglService.monthCompddOrUpdate(initData, function(state){
			   			if (state=="1"||state=="2"){
			   				var msg = '您成功'+(state=="1"?"新增":"修改")+'了一条记录！'
			   				Ext.Msg.alert('保存成功！', msg);
			   				window.setTimeout("Ext.Msg.hide()", 1000);
			   				DWREngine.setAsync(false);
			   				Ext.getCmp("save").disable();
			   				baseDao.findByWhere2(bean3, "masterId='"+initData.masterId+"' and sjType='"+initData.sjType+"'",function(list){
								if(list.length>0){//数据存在，表示保存过数据
									initData = list[0];	
								}	
				   				Ext.getCmp("save").enable();
							})
			   				DWREngine.setAsync(true);
			   			}else{
			   				Ext.Msg.show({
								title: '提示',
								msg: state,
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.ERROR
							});
			   			}
			   		});
			   		DWREngine.setAsync(true);
				}
			},{
				text:"取消",
				hidden:isHidden,
				handler : function(){
					window.close();
				}
		}],
		listeners:{
				'render':function(form){
					if(m_record.get('reportStatus')==1)Ext.getCmp('save').hide();
				}
			}
	});
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [formPanel]
	});
	var viewTpl = new Ext.XTemplate(tpl);
	viewTpl.overwrite(formPanel.body,initData);
	
	//从后台查询保存过的数据
	var uids=m_record.get('uids');
	var sjType=m_record.get('sjType');
	var pid=m_record.get('pid');
	DWREngine.setAsync(false);
	pcTzglService.monthCompIni(uids,pid,sjType,function(list){
		if(list.length>0){
			initData = list[0];
		}
		var viewTpl = new Ext.XTemplate(tpl);
		viewTpl.overwrite(formPanel.body,initData);					
	});
	DWREngine.setAsync(true);
	
	
	//end Ext.onReady
});
//获取焦点的节点的当前值
var pre_value="";
var inputObj=null;
var totalObj=null;
function onfocusFn(o){
	if(o.style)	o.style.backgroundColor="#D3FCD7";
	if(o.id=="monthFullFunded"){
		pre_value=o.value;
		inputObj="monthFullFunded";
		totalObj="totalfundedyear";
	}
	if(o.id=="monthCompBuild"){
		pre_value=o.value;
		inputObj="monthCompBuild";
		totalObj="totalbuild";
	}
	if(o.id=="monthCompEquip"){
		pre_value=o.value;
		inputObj="monthCompEquip";
		totalObj="totalequip";
	}
	if(o.id=="monthCompInstall"){
		pre_value=o.value;
		inputObj="monthCompInstall";
		totalObj="totalinstall";
	}
	if(o.id=="monthCompOther"){
		pre_value=o.value;
		inputObj="monthCompOther";
		totalObj="totalother";
	}
}
function onblurFn(o){
	if(o.style)	o.style.background="transparent"
}
function onkeyupFn(o){
	o.value=o.value.replace(/\D/g,'');
	if(isNaN(parseFloat(o.value))){
		o.value="";
	}else{
		o.value = parseFloat(o.value);
	}
	if(inputObj&&totalObj)totalOnChange(inputObj,totalObj);
}
function onafterpasteFn(o){
	o.value=o.value.replace(/\D/g,'')
	if(isNaN(parseFloat(o.value))){
		o.value="";
	}else{
		o.value = parseFloat(o.value);
	}
	if(inputObj&&totalObj)totalOnChange(inputObj,totalObj);
}
function totalOnChange(input_id, total_id){
	var ot1 = document.getElementById(total_id);
	if(!ot1) return;
	var o1 = document.getElementById(input_id);
	if(o1&&o1.value!=""&&validateNumber(o1.value)&&validateNumber(pre_value)){
		ot1.value=parseFloat(ot1.value)-parseFloat(pre_value)+parseFloat(o1.value);
		pre_value= parseFloat(o1.value);
	}
}
function validateNumber(val){
	var strP=/^\d+$/;
	if(!strP.test(val)) {
		return false; 
	}else{
		return true; 
	}
}
