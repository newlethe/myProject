var bean3="com.sgepit.pcmis.tzgl.hbm.VPcTzglYearPlanReport";
var tpl = 
'<div style="float:right;">单位:万元&nbsp;&nbsp;&nbsp;&nbsp;</div>' +
'<div style="border:1px solid;width:800px;">' +
'	<div>' +
'		<div id="prjSort" onclick="collapse (this)" class="div_t" style="border-top-style:none !important"><b>-</b>&nbsp;&nbsp;项目信息</div>' +
'		<div id="prjInfo">' +
'			<table cellpadding="0" cellspacing="0">' +
'				<tr>' +
'					<td width="82" class="tNormal" style="background-color:#E1E1E1;">项目名称</td>' +
'					<td width="315" class="tNormal" style="background-color:#E1E1E1;">' +
'						<input type="text" style="text-align:left;border:1px solid #E1E1E1;" readOnly id=unitname value=\'{unitname}\'/>' +
'					</td>' +
'					<td width="112" class="tNormal" style="background-color:#E1E1E1;">建设规模</td>' +
'					<td width="289" colspan="3" class="td_r" style="background-color:#E1E1E1;">' +
'						<input type="text" style="text-align:left;border:1px solid #E1E1E1;" readOnly id=buildScale value=\'{buildScale}\'/>' +
'					</td>' +
'				</tr>' +
'				<tr>' +
'					<td class="tNormal" style="background-color:#E1E1E1;">建设性质</td>' +
'					<td class="tNormal" style="background-color:#E1E1E1;">' +
'						<input type="text" style="text-align:left;border:1px solid #E1E1E1;" readOnly id=buildNature value=\'{buildNature}\'/>' +
'					</td>' +
'					<td class="tNormal" style="background-color:#E1E1E1;">建设起止年限</td>' +
'					<td class="td_r" colspan="3" style="background-color:#E1E1E1;">' +
'						<input type="text" style="text-align:left;border:1px solid #E1E1E1;" readOnly id=buildLimit  value=\'{buildLimit}\'/>' +
'					</td>' +
'				</tr>' +
'				<tr>' +
'					<td class="tNormal" style="background-color:#E1E1E1;">形象进度</td>' +
'					<td class="td_r" colspan="5">' +
'						<input type="text" style="text-align:left" id=progressObjective  value=\'{progressObjective}\'/>' +
'					</td>' +
'				</tr>' +
'				<tr>' +
'					<td class="td_b tNormal" style="background-color:#E1E1E1;">备注</td>' +
'					<td colspan="5" class="td_r_b">' +
'						<input type="text" style="text-align:left;" id=memo  value=\'{memo}\'/>'+
'					</td>' +
'				</tr>' +
'			</table>' +
'		</div>' +
'	</div>' +
'	<div>' +
'		<div id="tzSort" onclick="collapse (this)" class="div_t"><b>-</b>&nbsp;&nbsp;总投资</div>' +
'		<div>' +
'			<table cellpadding="0" cellspacing="0" width="100%">' +
'				<tr>' +
'					<td rowspan="3" class="td_l" style="background-color:#E1E1E1;" width="16%">总额</td>' +
'					<td colspan="7" class="td_r" style="background-color:#E1E1E1;" width="84%">资金来源</td>' +
'				</tr>' +
'				<tr>' +
'					<td colspan="4" class="tNormal" width="56%" style="background-color:#E1E1E1;">资本金</td>' +
'					<td rowspan="2" class="tNormal" width="14%" style="background-color:#E1E1E1;">贷款</td>' +
'					<td colspan="2" rowspan="2" class="td_r" width="14%" style="background-color:#E1E1E1;">其它</td>' +
'				</tr>' +
'				<tr>' +
'					<td class="tNormal" width="14%" style="background-color:#E1E1E1;">小计</td>' +
'					<td class="tNormal" width="14%" style="background-color:#E1E1E1;">集团出资</td>' +
'					<td class="tNormal" width="14%" style="background-color:#E1E1E1;">自有资金</td>' +
'					<td class="tNormal" width="14%" style="background-color:#E1E1E1;">其它</td>' +
'				</tr>' +
'				<tr>' +
'					<td class="td_b" width="16%" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;" readOnly id=investTotal value=\'{investTotal}\' maxlength="12"/>' +
'					</td>' +
'					<td class="td_b" width="14%" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;" readOnly id=srcZbjTotal value=\'{srcZbjTotal}\' maxlength="12"/>' +
'					</td>' +
'					<td class="td_b" width="14%" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;" readOnly id=srcZbjjt value=\'{srcZbjjt}\' maxlength="12"/>' +
'					</td>' +
'					<td class="td_b" width="14%" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;" readOnly id=srcZbjzy value=\'{srcZbjzy}\' maxlength="12"/>' +
'					</td>' +
'					<td class="td_b" width="14%" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;" readOnly id=srcZbjqt value=\'{srcZbjqt}\' maxlength="12">' +
'					</td>' +
'					<td class="td_b" width="14%" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;" readOnly id=srcDk value=\'{srcDk}\' maxlength="12">' +
'					</td>' +
'					<td class="td_r_b" colspan="3" width="14%" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;" readOnly id=srcQt value=\'{srcQt}\' maxlength="12">' +
'					</td>' +
'				</tr>' +
'			</table>' +
'		</div>' +
'	</div>' +
'	<div>' +
'		<div onclick="collapse (this)" class="div_t"><b>-</b>&nbsp;&nbsp;至{lastYear}年底累计完成投资</div>' +
'		<div>' +
'			<table cellpadding="0" cellspacing="0" width="100%">' +
'				<tr>' +
'					<td width="19%" class="td_b" style="background-color:#E1E1E1;">完成工程量总额</td>' +
'					<td width="31%" class="td_b" style="background-color:#E1E1E1;">' +
'						<input type="text"  style="border:1px solid #E1E1E1;" readOnly id=lastYearCompTotal value=\'{lastYearCompTotal}\' maxlength="12">' +
'					</td>' +
'					<td width="17%" class="td_b" style="background-color:#E1E1E1;">资金到位总额</td>' +
'					<td width="33%" class="td_r_b" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;" readOnly id=lastYearFundedTotal value=\'{lastYearFundedTotal}\' maxlength="12">' +
'					</td>' +
'				</tr>' +
'			</table>' +
'		</div>' +
'	</div>' +
'	<div>' +
'		<div onclick="collapse (this)" class="div_t"><b>-</b>&nbsp;&nbsp;{sjType}年工程计划</div>' +
'		<div>' +
'			<table cellpadding="0" cellspacing="0" width="100%">' +
'				<tr>' +
'					<td class="tNormal" width="20%" style="background-color:#E1E1E1;">总额</td>' +
'					<td class="tNormal" width="16%" style="background-color:#E1E1E1;">土建</td>' +
'					<td class="tNormal" width="16%" style="background-color:#E1E1E1;">设备</td>' +
'					<td class="tNormal" width="16%" style="background-color:#E1E1E1;">安装</td>' +
'					<td class="tNormal" width="16%" style="background-color:#E1E1E1;">线路</td>' +
'					<td class="td_r" width="16%" style="background-color:#E1E1E1;">其他</td>' +
'				</tr>' +
'				<tr>' +
'					<td class="td_b" width="20%" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;"  readOnly id=prjMoneyTotal value=\'{prjMoneyTotal}\' maxlength="12"/>' +
'					</td>' +
'					<td class="td_b" width="16%">' +
'						<input type="text" id=buildMoney value=\'{buildMoney}\' maxlength="12"/>' +
'					</td>' +
'					<td class="td_b" width="16%">' +
'						<input type="text" id=equipMoney value=\'{equipMoney}\' maxlength="12"/>' +
'					</td>' +
'					<td class="td_b" width="16%">' +
'						<input type="text" id=installMoney value=\'{installMoney}\' maxlength="12"/>' +
'					</td>' +
'					<td class="td_b" width="16%">' +
'						<input type="text" id=routeMoney value=\'{routeMoney}\' maxlength="12"/>' +
'					</td>' +
'					<td class="t_r_b" width="16%">' +
'						<input type="text" id=otherMoney value=\'{otherMoney}\' maxlength="12"/>' +
'					</td>' +
'				</tr>' +
'			</table>' +
'		</div>' +
'	</div>' +
'	<div>' +
'		<div onclick="collapse (this)" class="div_t"><b>-</b>&nbsp;&nbsp;{sjType}年资金计划</div>' +
'		<div>' +
'			<table cellpadding="0" cellspacing="0" width="100%">' +
'				<tr>' +
'					<td rowspan="2" class="td_l" width="14%" style="background-color:#E1E1E1;">总额</td>' +
'					<td colspan="5" class="tNormal" style="background-color:#E1E1E1;">资本金</td>' +
'					<td rowspan="2" class="tNormal" width="14%" style="background-color:#E1E1E1;">贷款</td>' +
'					<td colspan="2" rowspan="2" class="td_r" width="14%" style="background-color:#E1E1E1;">其它</td>' +
'				</tr>' +
'				<tr>' +
'					<td class="tNormal" width="14%" style="background-color:#E1E1E1;">合计</td>' +
'					<td class="tNormal" width="12%" style="background-color:#E1E1E1;">集团增资</td>' +
'					<td class="tNormal" width="12%" style="background-color:#E1E1E1;">自有资金</td>' +
'					<td class="tNormal" width="12%" style="background-color:#E1E1E1;">贷款</td>' +
'					<td class="tNormal" width="12%" style="background-color:#E1E1E1;">其它</td>' +
'				</tr>' +
'				<tr>' +
'					<td class="td_b" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;"  readOnly id=planFundTotal value=\'{planFundTotal}\' maxlength="12"/>' +
'					</td>' +
'					<td class="td_b" style="background-color:#E1E1E1;">' +
'						<input type="text" style="border:1px solid #E1E1E1;"  readOnly id=planZbjTotal value=\'{planZbjTotal}\' maxlength="12"/>' +
'					</td>' +
'					<td class="td_b">' +
'						<input type="text" id=groupAddFund value=\'{groupAddFund}\' maxlength="12">' +
'					</td>' +
'					<td class="td_b">' +
'						<input type="text" id=equityFund value=\'{equityFund}\' maxlength="12">' +
'					</td>' +
'					<td class="td_b">' +
'						<input type="text" id=capitalLoan value=\'{capitalLoan}\' maxlength="12">' +
'					</td>' +
'					<td class="td_b">' +
'						<input type="text" id=capitalOther value=\'{capitalOther}\' maxlength="12">' +
'					</td>' +
'					<td class="td_b">' +
'						<input type="text" id=fundPlanLoan value=\'{fundPlanLoan}\' maxlength="12">' +
'					</td>' +
'					<td class="td_b_r">' +
'						<input type="text" id=fundPlanOther value=\'{fundPlanOther}\' maxlength="12">' +
'					</td>' +
'				</tr>' +
'			</table>' +
'		</div>' +
'	</div>' +
'</div>';
var columns = [
	{id:"progressObjective",type:"text", events:{onfocus:"onfocusFn",onblur:"onblurFn"}},
	{id:"memo",type:"text", events:{onfocus:"onfocusFn",onblur:"onblurFn"}},
//	{id:"srcZbjjt",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
//	{id:"srcZbjzy",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
//	{id:"srcZbjqt",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
//	{id:"srcDk",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
//	{id:"srcQt",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
//	{id:"lastYearCompTotal",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
//	{id:"lastYearFundedTotal",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"buildMoney",type:"text", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"equipMoney",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"installMoney",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"routeMoney",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"otherMoney",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"groupAddFund",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"equityFund",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"capitalLoan",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"capitalOther",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"fundPlanLoan",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"fundPlanOther",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}}
];
var m_record = window.dialogArguments;
var initData = {};
Ext.onReady(function(){
	var isHidden = true; 
	
	if(m_record.get('issueStatus')!=1 && m_record.get('issueStatus')!=3) isHidden=false;
	var formPanel = new Ext.Panel({
		bodyStyle:'padding-left:10px;',
		buttonAlign:'center',
		buttons: [{
				text:"确定",
				id:"save",
				hidden:isHidden,
				handler:function(){
					//判断报表是否填写完整
					var inpObj = document.getElementsByTagName("input");
					var isNull = false;
					var flag = '0';
					for(var o in inpObj){
						if(o == 'length') continue;
						var inp = inpObj[o];
						if(inp.value === '' && inp.id.indexOf('ext') == -1){
							inp.style.background = '#FF0000';
							isNull = true;
						}
					}
					if(isNull){
						if(confirm("有单元格未填写，请填写完整。\n填写说明见：系统右上角【帮助—系统使用帮助—报表填写说明】\n\n确认保存？")){
							//修改主表flag_null = '1'
							flag = '1';
						}else{
							return false;
						}
					}
					baseDao.updateBySQL("update Pc_Tzgl_Year_Plan_M t " +
				    				"set t.FLAG_NULL='"+flag+"' where t.uids='"+m_record.get('uids')+"'");
					
					DWREngine.setAsync(false);
					if(initData.uids==undefined||initData.uids==null||initData.uids ==""){//主键为空表示新增数据
			    		initData.masterUids=m_record.get('uids');	
						initData.pid=m_record.get('pid');
						initData.sjType=m_record.get('sjType');
						initData.unitId=m_record.get('pid');
						initData.zbSeqno='1';
					}	
					for(var i in columns) {
						var id = columns[i].id;
						var o = document.getElementById(id);
						if(o) initData[id] = o.value;
					}
			   		pcTzglService.yearPlanAddOrUpdate(initData, function(state){
			   			if (state=="1"||state=="2"){
			   				Ext.Msg.alert('提示','操作成功');
			   				window.setTimeout("Ext.Msg.hide()", 1000);
			   				DWREngine.setAsync(false);
			   				Ext.getCmp("save").disable();
			   				baseDao.findByWhere2(bean3, "masterUids='"+initData.masterUids+"' and sjType='"+initData.sjType+"'",function(list){
								if(list.length>0){//数据存在，表示保存过数据
									initData = list[0];	
									initData.lastYear = parseInt(initData.sjType)-1;
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
					if(m_record.get('issueStatus')==1)Ext.getCmp('save').hide();
				}
			}
	});
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [formPanel]
	});
	//从后台查询保存过的数据
	var uids=m_record.get('uids');
	var sjType=m_record.get('sjType');
	var pid=m_record.get('pid');
	DWREngine.setAsync(false);
	pcTzglService.yearPlanIni(uids,pid,sjType,function(list){
		if(list.length>0){
			initData = list[0];
//			initData.investTotal=(initData.investTotal/10000).toFixed(2);
//			initData.srcZbjTotal=(initData.srcZbjTotal/10000).toFixed(2);
//			initData.srcZbjzy=(initData.srcZbjzy/10000).toFixed(2);
//			initData.srcZbjqt=(initData.srcZbjqt/10000).toFixed(2);
//			initData.srcZbjjt=(initData.srcZbjjt/10000).toFixed(2);
//			initData.srcDk=(initData.srcDk/10000).toFixed(2);
//			initData.srcQt=(initData.srcQt/10000).toFixed(2);
		}else{
			initData.sjType = sjType;
		}
		initData.lastYear = parseInt(initData.sjType)-1;
		var viewTpl = new Ext.XTemplate(tpl);
		viewTpl.overwrite(formPanel.body,initData);
		//input加入事件
		for(var i in columns){
			var o = columns[i];
			var events = o.events;
			if(events){
				obj = document.getElementById(o.id);
				if(obj){
					for(var j in events){
						obj[j] = window[events[j]]
					}
				}
			}
		}
		//计算合计值
//		ztzOnChange();
		gcjhOnChange();
		bjzjjhOnChange()
	});
	DWREngine.setAsync(true);
	
});
function collapse(o){
	return;
	var sign = o.childNodes[0];
	var display = sign.innerText=="-"?"none":"block";
	o.nextSibling.style.display=display;
	sign.innerHTML = sign.innerText=="-"?"+":"-";
}
function onkeyupFn(){
	var result=this.value.match(/^\d*\.?\d{0,2}$/g);
	var indx=this.value.indexOf('.');
	indx+=3;
	if(result==null) {
		if(indx<this.value.length&&!isNaN(parseFloat(this.value)))
		{
			this.value=this.value.substr(0,indx);
		}else{
			this.value="";
		}
	
	}
//	if(isNaN(parseFloat(this.value))){
//		this.value="";
//	}else{
//		this.value = parseFloat(this.value);
//	}
//	ztzOnChange();
//	gcjhOnChange();
//	bjzjjhOnChange()
}
function onafterpasteFn(){
//	this.value=this.value.replace(/^[0-9]+(.[0-9]{1,2})?$/g,'')
	var result=this.value.match(/^\d*\.?\d{0,2}$/g);
	var indx=this.value.indexOf('.');
	indx+=3;
	if(result==null) {
		if(indx<this.value.length&&!isNaN(parseFloat(this.value)))
		{
			this.value=this.value.substr(0,indx);
		}else{
			this.value="";
		}
	
	}
//	if(isNaN(parseFloat(this.value))){
//		this.value="";
//	}else{
//		this.value = parseFloat(this.value);
//	}
//	ztzOnChange();
//	gcjhOnChange();
//	bjzjjhOnChange()
}
function onfocusFn(){
	var o = this;
	if(o.style)	o.style.backgroundColor="#D3FCD7"
}
function onblurFn(){
	var o = this;
	if(o.style)	o.style.background="transparent";
	
//	ztzOnChange();
	gcjhOnChange();
	bjzjjhOnChange()
}
function validateNumber(val){
	var strP=/^\d*\.?\d{0,2}$/;
	if(!strP.test(val)) {
		return false; 
	}else{
		return true; 
	}
}
//onchange event
function ztzOnChange(){
	var o1 = document.getElementById("srcZbjjt");
	var o2 = document.getElementById("srcZbjzy");
	var o3 = document.getElementById("srcZbjqt");
	var o4 = document.getElementById("srcDk");
	var o5 = document.getElementById("srcQt");
	var ot1 = document.getElementById("investTotal");
	var ot2 = document.getElementById("srcZbjTotal");
	var t1 = null,t2 = null;
	if(o1&&o1.value!=""&&validateNumber(o1.value)){
		t1 +=parseFloat(o1.value); 
		t2 +=parseFloat(o1.value); 
	}
	if(o2&&o2.value!=""&&validateNumber(o2.value)){
		t1 +=parseFloat(o2.value); 
		t2 +=parseFloat(o2.value); 
	} 
	if(o3&&o3.value!=""&&validateNumber(o3.value)){
		t1 +=parseFloat(o3.value); 
		t2 +=parseFloat(o3.value); 
	} 
	if(o4&&o4.value!=""&&validateNumber(o4.value)){
		t1 +=parseFloat(o4.value); 
	} 
	if(o5&&o5.value!=""&&validateNumber(o5.value)){
		t1 +=parseFloat(o5.value); 
	} 
	if(t1!=null&&ot1) 
		ot1.value = t1;
	else if(ot1)
		ot1.value = "";
	if(t2!=null&&ot2) 
		ot2.value = t2;
	else if(ot2)
		ot2.value = "";
}
//onchange event
function gcjhOnChange(){
	var ot1 = document.getElementById("prjMoneyTotal");
	if(!ot1) return;
	var o1 = document.getElementById("buildMoney");
	var o2 = document.getElementById("equipMoney");
	var o3 = document.getElementById("installMoney");
	var o4 = document.getElementById("routeMoney");
	var o5 = document.getElementById("otherMoney");
	var t1 = null;
	if(o1&&o1.value!=""&&validateNumber(o1.value)){
		t1 +=parseFloat(o1.value); 
	}
	if(o2&&o2.value!=""&&validateNumber(o2.value)){
		t1 +=parseFloat(o2.value); 
	} 
	if(o3&&o3.value!=""&&validateNumber(o3.value)){
		t1 +=parseFloat(o3.value); 
	} 
	if(o4&&o4.value!=""&&validateNumber(o4.value)){
		t1 +=parseFloat(o4.value); 
	} 
	if(o5&&o5.value!=""&&validateNumber(o5.value)){
		t1 +=parseFloat(o5.value);  
	} 
	if(t1!=null&&ot1) {
		ot1.value = t1.toFixed(2);
		if(ot1.style)	ot1.style.background="transparent";
	}else if(ot1){
		ot1.value = "";
	}
}
//onchange event
function bjzjjhOnChange(){
	var o1 = document.getElementById("groupAddFund");
	var o2 = document.getElementById("equityFund");
	var o3 = document.getElementById("capitalLoan");
	var o4 = document.getElementById("capitalOther");
	var o5 = document.getElementById("fundPlanLoan");
	var o6 = document.getElementById("fundPlanOther");
	
	var ot1 = document.getElementById("planFundTotal");
	var ot2 = document.getElementById("planZbjTotal");
	var t1 = null,t2 = null;
	if(o1&&o1.value!=""&&validateNumber(o1.value)){
		t1 +=parseFloat(o1.value); 
		t2 +=parseFloat(o1.value); 
	}
	if(o2&&o2.value!=""&&validateNumber(o2.value)){
		t1 +=parseFloat(o2.value);  
		t2 +=parseFloat(o2.value);  
	} 
	if(o3&&o3.value!=""&&validateNumber(o3.value)){
		t1 +=parseFloat(o3.value);  
		t2 +=parseFloat(o3.value);  
	} 
	if(o4&&o4.value!=""&&validateNumber(o4.value)){
		t1 +=parseFloat(o4.value); 
		t2 +=parseFloat(o4.value); 
	} 
	if(o5&&o5.value!=""&&validateNumber(o5.value)){
		t1 +=parseFloat(o5.value); 
	} 
	if(o6&&o6.value!=""&&validateNumber(o6.value)){
		t1 +=parseFloat(o6.value); 
	} 
	if(t1!=null&&ot1) {
		ot1.value = t1.toFixed(2);
		if(ot1.style)	ot1.style.background="transparent";
	}else if(ot1){
		ot1.value = "";
	}if(t2!=null&&ot2) {
		ot2.value = t2.toFixed(2);
		if(ot2.style)	ot2.style.background="transparent";
	}else if(ot2){
		ot2.value = "";
	}
}