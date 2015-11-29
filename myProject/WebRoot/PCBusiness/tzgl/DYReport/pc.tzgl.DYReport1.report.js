var m_record = window.dialogArguments;
var sjType = m_record.get('sjType');
var rq = ""
if(sjType.length==6){
	rq = sjType.substring(0,4)+"年"+sjType.substring(4,6)+"月";
}
var tpl =
'<div style="width:800px;">' +
'<div>' +
'<table width="100%" cellpadding="0" cellspacing="0">' +
'  <tr>' +
'    <td colspan="3" style="font-size:24px;text-align:center;font-weight:bold;">电源固定资产投资完成情况月报</td>' +
'  </tr>' +
'  <tr>' +
'    <td width="33%">填报单位：{unitname}</td>' +
'    <td width="33%" align=center>日期：'+rq+'</td>' +
'    <td width="34%" align=right>计量单位：万元</td>' +
'  </tr>' +
'</table>' +
'</div>' +
'<div style="border:1px solid;width:100%;">' +
	'<table width="100%" style="border-top-style:none" cellpadding="0" cellspacing="0">'+
	'  <tr>'+
	'    <td width="20%" class="tNormal td_disable">项目名称：</td>'+
	'    <td colspan="4" class="td_r td_disable">'+
	'      <input name="unitname" type="text" id="unitname" style="text-align:left;border:1px solid #E1E1E1;" readOnly value=\'{unitname}\' />'+
	'    </form>    </td>'+
	'  </tr>'+
	'  <tr>'+
	'    <td width="20%" class="tNormal td_disable">计划总投资</td>'+
	'    <td width="20%" class="tNormal td_disable">其中：本年新开工<br/>项目计划总投资</td>'+
	'    <td width="20%" class="tNormal td_disable">自开工累计完成投资</td>'+
	'    <td width="20%" class="tNormal td_disable">本年计划投资</td>'+
	'    <td width="20%" class="td_r td_disable">本年新增固定资产</td>'+
	'  </tr>'+
	'  <tr>'+
	'    <td width="20%" class="tNormal td_disable">'+
	'     <input type="text" name="val1" id="val1" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{val1}\' maxlength="12"/>' +
	'    </td>'+
	'    <td width="20%" class="td_l">'+
	'	  <input type="text" name="val2" id="val2" style="width:95%;" value=\'{val2}\' maxlength="17"/>	' +
	'    </td>'+
	'    <td width="20%" class="tNormal td_disable">'+
	'	  <input type="text" name="val3" id="val3" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{val3}\' maxlength="12"/>' +
	'    </td>'+
	'    <td width="20%" class="tNormal td_disable">'+
	'	  <input type="text" name="val4" id="val4" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{val4}\' maxlength="12"/>' +
	'	 </td>'+
	'    <td width="20%" class="td_r">'+
	'	  <input type="text" name="val10" id="val10" style="width:95%;" value=\'{val10}\' maxlength="17"/>' +
	'	</td>'+
	'  </tr>'+
	'  <tr>'+
	'    <td rowspan="2" width="20%" class="tNormal td_disable">本年完成投资</td>'+
	'    <td colspan="4" class="td_r td_disable">本年完成投资按构成分</td>'+
	'  </tr>'+
	'  <tr>'+
	'    <td width="20%" class="tNormal td_disable">建筑工程</td>'+
	'    <td width="20%" class="tNormal td_disable">安装工程</td>'+
	'    <td width="20%" class="tNormal td_disable">设备工器具购置</td>'+
	'    <td width="20%" class="td_r td_disable">其它费用</td>'+
	'  </tr>'+
	'  <tr>'+
	'     <td width="20%" class="td_b td_disable">'+
	'	  	<input type="text" name="val5" id="val5" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{val5}\' maxlength="12"/>' +
	'	  </td>'+
	'     <td width="20%" class="td_b td_disable">'+
	'	  	<input type="text" name="val6" id="val6" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{val6}\' maxlength="12"/>' +
	'     </td>'+
	'     <td width="20%" class="td_b td_disable">'+
	'	  	<input type="text" name="val7" id="val7" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{val7}\' maxlength="12"/>' +
	'     </td>'+
	'     <td width="20%" class="td_b td_disable">'+
	'	  	<input type="text" name="val8" id="val8" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{val8}\' maxlength="12"/>' +
	'     </td>'+
	'     <td width="20%" class="td_r_b td_disable">'+
	'	  	<input type="text" name="val9" id="val9" style="border:1px solid #E1E1E1;width:95%;" readOnly value=\'{val9}\' maxlength="12"/>' +
	'     </td>'+
	'  </tr>'+
	'</table>'+
'</div>' +
'</div>';

var bean="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport1D";
var initData = {};
var columns = [
	{id:"val2",type:"float", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val10",type:"float", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}}
];

Ext.onReady(function(){
	var isHidden = true; 
//	if(m_record.get('state')==1 || m_record.get('state')==3) isHidden=true;
//	if(m_record.get('state')==4)isHidden=true;
	if(m_record.get('state')==0||m_record.get('state')=='0'||m_record.get('state')==2||m_record.get('state')=='2'){
	   isHidden = false;
	}
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
					baseDao.updateBySQL("update PC_TZGL_DYREPORT1_M t " +
				    				"set t.FLAG_NULL='"+flag+"' where t.uids='"+m_record.get('uids')+"'");
					
					DWREngine.setAsync(false);
					if(initData.uids==undefined||initData.uids==null||initData.uids ==""){//主键为空表示新增数据
						initData.sjType=m_record.get('sjType');
						initData.unitId=m_record.get('pid');
					}	
						initData.zbSeqno='DY_MONTHREPORT1';
					for(var i in columns) {
						var id = columns[i].id;
						var o = document.getElementById(id);
						if(o) initData[id] = o.value;
					}
			   		pcTzglService.dyReport1AddOrUpdate(initData, function(state){
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
	pcTzglService.dyReport1Ini(unitId,sjType,function(list){
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
	DWREngine.setAsync(true);
	//end Ext.onReady
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