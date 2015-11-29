var format = "Y-m-d";
var m_record = window.dialogArguments;
var sjType=m_record.get('sjType');
var rq = ""
if(sjType.length==6){
	rq = sjType.substring(0,4)+"年"+sjType.substring(4,6)+"月";
}else{
	rq = sjType+"年";
}
var tpl =
'<div style="width:1000px;">' +
'<div>' +
'<table width="100%" cellpadding="0" cellspacing="0">' +
'  <tr>' +
'    <td colspan="3" style="font-size:24px;text-align:center;font-weight:bold;">电源固定资产投资本年资金到位情况月报</td>' +
'  </tr>' +
'  <tr>' +
'    <td width="33%">填报单位：{unitname}</td>' +
'    <td width="33%" align=center>日期：'+rq+'</td>' +
'    <td width="34%" align=right>计量单位：万元</td>' +
'  </tr>' +
'</table>' +
'</div>' +
'<div style="border:1px solid;width:1000px;">' +
'<table width="100%" style="border-top-style:none" cellpadding="0" cellspacing="0">' +
'  <tr>' +
'    <td colspan="4" class="tNormal td_disable">项目名称</td>' +
'    <td colspan="2" class="tNormal td_disable">自开工累计资金到位</td>' +
'    <td colspan="2" class="tNormal td_disable">本年资金到位</td>' +
'    <td colspan="2" class="td_r td_disable">其中：本年资本金到位</td>' +
'  </tr>' +
'  <tr>' +
'    <td colspan="4" class="tNormal td_disable"><input type="text" name="unitname" id="unitname" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{unitname}\' maxlength="6"/></td>' +
'    <td colspan="2" class="tNormal td_disable"><input type="text" name="val1" id="val1" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{val1}\' maxlength="10"/></td>' +
'    <td colspan="2" class="tNormal td_disable"><input type="text" name="val2" id="val2" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{val2}\' maxlength="10"/></td>' +
'    <td colspan="2" class="td_r"><input type="text" name="val3" id="val3" value=\'{val3}\' maxlength="17"/></td>' +
'  </tr>' +
'  <tr>' +
'    <td colspan="10" class="td_r td_disable">本年资金到位按来源分</td>' +
'  </tr>' +
'  <tr>' +
'    <td rowspan="2" class="tNormal td_disable">企业自有</td>' +
'    <td rowspan="2" class="tNormal td_disable">开行软贷</td>' +
'    <td rowspan="2" class="tNormal td_disable">银行贷款</td>' +
'    <td rowspan="2" class="tNormal td_disable">其它长期贷款</td>' +
'    <td rowspan="2" class="tNormal td_disable">三峡基金</td>' +
'    <td rowspan="2" class="tNormal td_disable">专项资金</td>' +
'    <td rowspan="2" class="tNormal td_disable">债券</td>' +
'    <td colspan="2" class="tNormal td_disable">利用外资</td>' +
'    <td rowspan="2" class="td_r td_disable">其它资金来源</td>' +
'  </tr>' +
'  <tr>' +
'    <td class="tNormal td_disable">合计</td>' +
'    <td class="tNormal td_disable">其中：外商直接投资</td>' +
'  </tr>' +
'  <tr>' +
'    <td width="10%" class="td_b"><input type="text" name="val4" id="val4" style="width:95%;" value=\'{val4}\' maxlength="17"/></td>' +
'    <td width="10%" class="td_b"><input type="text" name="val5" id="val5" style="width:95%;" value=\'{val5}\' maxlength="17"/></td>' +
'    <td width="10%" class="td_b"><input type="text" name="val6" id="val6" style="width:95%;" value=\'{val6}\' maxlength="17"/></td>' +
'    <td width="10%" class="td_b"><input type="text" name="val7" id="val7" style="width:95%;" value=\'{val7}\' maxlength="17"/></td>' +
'    <td width="10%" class="td_b"><input type="text" name="val8" id="val8" style="width:95%;" value=\'{val8}\' maxlength="17"/></td>' +
'    <td width="10%" class="td_b"><input type="text" name="val9" id="val9" style="width:95%;" value=\'{val9}\' maxlength="17"/></td>' +
'    <td width="9%" class="td_b"><input type="text" name="val10" id="val10" style="width:95%;" value=\'{val10}\' maxlength="17"/></td>' +
'    <td width="9%" class="td_b"><input type="text" name="val11" id="val11" style="width:95%;" value=\'{val11}\' maxlength="17"/></td>' +
'    <td width="13%" class="td_b"><input type="text" name="val12" id="val12" style="width:95%;" value=\'{val12}\' maxlength="17"/></td>' +
'    <td width="9%" ><input type="text" name="val13" id="val13" style="width:95%;" value=\'{val13}\' maxlength="17"/></td>' +
'  </tr>' +
'</table>' +
'</div>';

var bean="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport3D";
var initData = {};
var columns = [
	{id:"val3",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val4",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val5",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val6",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val7",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val8",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val9",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val10",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val11",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val12",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val13",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}}
];
Ext.onReady(function(){
	var isHidden = false; 
	if(m_record.get('state')==1 || m_record.get('state')==3) isHidden=true;
	if(m_record.get('state')==4)isHidden=true;
	var formPanel = new Ext.Panel({
		bodyStyle:'padding:10px;',
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
					baseDao.updateBySQL("update PC_TZGL_DYREPORT3_M t " +
				    				"set t.FLAG_NULL='"+flag+"' where t.uids='"+m_record.get('uids')+"'");
					
					DWREngine.setAsync(false);
					if(initData.uids==undefined||initData.uids==null||initData.uids ==""){//主键为空表示新增数据
						initData.sjType=m_record.get('sjType');
						initData.unitId=m_record.get('pid');
					}	
					initData.zbSeqno='DY_MONTHREPORT3';
					for(var i in columns) {
						var id = columns[i].id;
						var o = document.getElementById(id);
						if(o) initData[id] = o.value;
					}
			   		pcTzglService.dyReport3AddOrUpdate(initData, function(state){
			   			if (state=="1"||state=="2"){
			   				var msg = '您成功'+(state=="1"?"新增":"修改")+'了一条记录！'
			   				Ext.Msg.alert('保存成功！', msg);
			   				window.setTimeout("Ext.Msg.hide()", 1000);
			   				DWREngine.setAsync(false);
			   				Ext.getCmp("save").disable();
			   				baseDao.findByWhere2(bean, "unitId='"+initData.unitId+"' and sjType='"+initData.sjType+"'",function(list){
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
			}
	});
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [formPanel]
	});
	var viewTpl = new Ext.XTemplate(tpl);
	viewTpl.overwrite(formPanel.body,initData);
	//从后台查询保存过的数据
	var unitId=m_record.get('unitId');
	var sjType=m_record.get('sjType');
	DWREngine.setAsync(false);
	pcTzglService.dyReport3Ini(unitId,sjType,function(list){
		if(list.length>0){
			initData = list[0];
		}
		if(initData.unitId=="") initData.unitId = CURRENTAPPID;
		if(initData.unitId==CURRENTAPPID){
			initData.unitname=CURRENTAPPNAME;
		}else{
			baseDao.getData("select unitname from sgcc_ini_unit where unitid = '"+initData.unitId+"'" ,function(lt){
				if(lt.length>0){
					initData.unitname=lt[0];
				}
			})			
		} 
		var viewTpl = new Ext.XTemplate(tpl);
		viewTpl.overwrite(formPanel.body,initData);		
		//input加入事件
		for(var i=0;i<columns.length;i++){
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
	});
});

function onkeyupFn(){
	//不能输入字母
	var array=this.value.split('.');
	if(array&&array.length>1){//存在小数
		this.value=array[0].replace(/\D/g,'')+"."+array[1].replace(/\D/g,'');
		var dotAfter=array[1].replace(/\D/g,'');
		if(dotAfter.length>5){
			this.value=array[0].replace(/\D/g,'')+"."+dotAfter.substring(0,5);
		}
	}else{//不存在小数
		this.value=this.value.replace(/\D/g,'');
		if(this.value.length>11){
			this.value=this.value.substring(0,11);
		}
	}
}
function onblurFn(){
	var o = this;
	if(o.style)	o.style.background="transparent"
}
function onfocusFn(){
	var o = this;
	if(o.style)	o.style.backgroundColor="#D3FCD7"
}
function onafterpasteFn(){
	//不能输入字母
	var array=this.value.split('.');
	if(array&&array.length>1){//存在小数
		this.value=array[0].replace(/\D/g,'')+"."+array[1].replace(/\D/g,'');
		var dotAfter=array[1].replace(/\D/g,'');
		if(dotAfter.length>5){
			this.value=array[0].replace(/\D/g,'')+"."+dotAfter.substring(0,5);
		}
	}else{//不存在小数
		this.value=this.value.replace(/\D/g,'');
		if(this.value.length>11){
			this.value=this.value.substring(0,11);
		}
	}
}













