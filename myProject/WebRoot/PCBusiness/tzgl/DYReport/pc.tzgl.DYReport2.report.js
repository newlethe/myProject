var format = "Y-m-d";
var m_record = window.dialogArguments;
var sjType=m_record.get('sjType');
var rq = "";
var month=false;
var bgclass='';
var readOnly='';

DWREngine.setAsync(false);
	var year=sjType.substring(0,4);
	baseDao.findByWhere2('com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport2M', 
		"pid='"+m_record.get('pid')+"' and state=3 and sjType>'"+
		year+"00"+"' and sjType<'"+(year+1)+"00"+"'",function(list){
		if(list.length>0){//如果有已经审核通过的数据，就不容许填写 “本年施工规模”、“本年新开工规模”、“本年计划投产规模”中的台 和容量 字段
			month=true;
		}	
	})
DWREngine.setAsync(true);
if(sjType.length==6){
	rq = sjType.substring(0,4)+"年"+sjType.substring(4,6)+"月";
}
if(month) {
	bgclass='td_disable';
	readOnly='readOnly';
}
var tpl =
'<div style="width:1000px;">' +
'<div>' +
'<table width="100%" cellpadding="0" cellspacing="0">' +
'  <tr>' +
'    <td colspan="3" style="font-size:24px;text-align:center;font-weight:bold;">电源项目建设规模和新增生产能力月报</td>' +
'  </tr>' +
'  <tr>' +
'    <td width="33%">填报单位：{unitname}</td>' +
'    <td width="33%" align=center>日期：'+rq+'</td>' +
'    <td width="34%" align=right>计量单位：万千瓦</td>' +
'  </tr>' +
'</table>' +
'</div>' +
'<div style="border:1px solid;width:100%;">' +
'  <table width="100%" cellpadding="0" cellspacing="0" style="border-top-style:none">' +
'    <tr>' +
'      <td colspan="3" rowspan="2" class="tNormal td_disable" >项目名称</td>' +
'      <td colspan="2" class="tNormal td_disable">建设地址</td>' +
'      <td rowspan="2" class="tNormal td_disable">开工时间</td>' +
'      <td colspan="2" class="tNormal td_disable">建设规模</td>' +
'      <td colspan="2" class="td_r td_disable">本年施工规模</td>' +
'    </tr>' +
'    <tr>' +
'      <td class="tNormal td_disable">省份</td>' +
'      <td class="tNormal td_disable">地级市县</td>' +
'      <td class="tNormal td_disable">台</td>' +
'      <td class="tNormal td_disable">容量</td>' +
'      <td class="tNormal td_disable">台</td>' +
'      <td class="td_r td_disable">容量</td>' +
'    </tr>' +
'    <tr>' +
'      <td colspan="3" align="center"class="tNormal td_disable"><input name="unitname" type="text" id="unitname" style="border:1px solid #E1E1E1;" readOnly value=\'{unitname}\' maxlength="12" /></td>' +
'      <td class="tNormal td_disable"><input name="val11" type="text" id="val11" style="border:1px solid #E1E1E1;" readOnly value=\'{val11}\' maxlength="12"/></td>' +
'      <td class="tNormal td_disable"><input name="val12" type="text" id="val12" style="border:1px solid #E1E1E1;" readOnly value=\'{val12}\' maxlength="12" /></td>' +
'      <td class="tNormal td_disable"><input name="starttime" type="text" id="starttime" style="border:1px solid #E1E1E1;" readOnly value=\'{starttime}\' maxlength="12" /></td>' +
'      <td class="tNormal td_disable"><input name="val31" type="text" id="val31" style="border:1px solid #E1E1E1;" readOnly value=\'{val31}\' maxlength="12" /></td>' +
'      <td class="tNormal td_disable"><input name="val32" type="text" id="val32" style="border:1px solid #E1E1E1;" readOnly value=\'{val32}\' maxlength="12" /></td>' +
'      <td class="tNormal"><input name="val41" type="text" id="val41" readOnly+ value=\'{val41}\' maxlength="17" /></td>' +
'      <td class="td_r  bgclass+"><input name="val42" type="text" id="val42" readOnly+ value=\'{val42}\' maxlength="17" /></td>' +
'    </tr>' +
'    <tr>' +
'      <td colspan="2" class="tNormal td_disable">本年新开工规模</td>' +
'      <td colspan="3" class="tNormal td_disable">本年计划投产规模</td>' +
'      <td colspan="2" class="tNormal td_disable">累计新增生产能力</td>' +
'      <td colspan="3" class="td_r td_disable">本年新增生产能力</td>' +
'    </tr>' +
'    <tr>' +
'      <td class="tNormal td_disable">台</td>' +
'      <td class="tNormal td_disable">容量</td>' +
'      <td class="tNormal td_disable">台</td>' +
'      <td class="tNormal td_disable">容量</td>' +
'      <td class="tNormal td_disable">投产日期</td>' +
'      <td class="tNormal td_disable">台</td>' +
'      <td class="tNormal td_disable">容量</td>' +
'      <td class="tNormal td_disable">台</td>' +
'      <td class="tNormal td_disable">容量</td>' +
'      <td class="td_r td_disable">投产日期</td>' +
'    </tr>' +
'    <tr>' +
'      <td width="10%" class="td_b bgclass+"><input name="val51" type="text" id="val51" readOnly+ value=\'{val51}\' maxlength="17" /></td>' +
'      <td width="10%" class="td_b bgclass+"><input name="val52" type="text" id="val52" readOnly+ value=\'{val52}\' maxlength="17"/></td>' +
'      <td width="10%" class="td_b bgclass+"><input name="val61" type="text" id="val61" readOnly+ value=\'{val61}\' maxlength="17" /></td>' +
'      <td width="10%" class="td_b bgclass+"><input name="val62" type="text" id="val62" readOnly+ value=\'{val62}\' maxlength="17" /></td>' +
'      <td width="10%" class="td_b bgclass+"><input name="val63" type="text" id="val63" readOnly+ value=\'{val63}\' maxlength="17"  readonly/></td>' +
'      <td width="10%" class="td_b td_disable"><input name="val71hide" type="hidden" id="val71hide" value=\'{val71hide}\' />' +
'        <input name="val71" type="text" id="val71" style="border:1px solid #E1E1E1;" readOnly value=\'{val71}\' maxlength="17" /></td>' +
'      <td width="10%" class="td_b td_disable"><input name="val72hide" type="hidden" id="val72hide" value=\'{val72hide}\' />' +
'        <input name="val72" type="text" id="val72" style="border:1px solid #E1E1E1;" readOnly value=\'{val72}\' maxlength="17" /></td>' +
'      <td width="10%" class="td_b"><input name="val81" type="text" id="val81" value=\'{val81}\' maxlength="17" /></td>' +
'      <td width="10%" class="td_b"><input name="val82" type="text" id="val82" value=\'{val82}\' maxlength="17" /></td>' +
'      <td width="10%" class="bgclass+" align="center"><input name="val83" type="text" id="val83" value=\'{val83}\' maxlength="17" / readonly></td>' +
'    </tr>' +
'  </table>' +
'</div>' +
'</div>';
var bean="com.sgepit.pcmis.tzgl.hbm.PcTzglDyreport2D";
var initData = {};
var columns = [
	{id:"val61",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val62",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val63",type:"date", events:{onfocus:"onfocusDateFn"}},
	{id:"val71",type:"number"},
	{id:"val72",type:"number"},
	{id:"val81",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val82",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val83",type:"date", events:{onfocus:"onfocusDateFn"}},
	{id:"val41",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val42",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val51",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
	{id:"val52",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}}
];
if(month){
	columns = [
		{id:"val71",type:"number"},
		{id:"val72",type:"number"},
		{id:"val63",type:"date", events:{onfocus:"onfocusDateFn"}},
		{id:"val81",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
		{id:"val82",type:"number", events:{onfocus:"onfocusFn",onblur:"onblurFn",onkeyup:"onkeyupFn",onafterpaste:"onafterpasteFn"}},
		{id:"val83",type:"date", events:{onfocus:"onfocusDateFn"}}
	];
}
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
					baseDao.updateBySQL("update PC_TZGL_DYREPORT2_M t " +
				    				"set t.FLAG_NULL='"+flag+"' where t.uids='"+m_record.get('uids')+"'");
					
					DWREngine.setAsync(false);
					if(initData.uids==undefined||initData.uids==null||initData.uids ==""){//主键为空表示新增数据
						initData.sjType=m_record.get('sjType');
						initData.unitId=m_record.get('pid');
					}	
					initData.zbSeqno='DY_MONTHREPORT2';
					for(var i in columns) {
						var id = columns[i].id;
						var o = document.getElementById(id);
						if(o){
							//判断input的类型
							if(columns[i].type==="number"){//数值型
								if(isNaN(parseFloat(o.value))){
									initData[id]="";
								}else{
									initData[id]=parseFloat(o.value);
								}
							}else if(columns[i].type==="date"){//日期型
								initData[id]=Date.parseDate(o.value, "Y-m-d");
							}
						}
					}
					//alert(Ext.encode(initData));
			   		pcTzglService.dyReport2AddOrUpdate(initData, function(state){
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
	pcTzglService.dyReport2Ini(unitId,sjType,function(list){
		if(list.length>0){
			initData = list[0];
			initData.val32=initData.val32*1;
//			initData.val32=accMul(initData.val32,0.1);
		}
		//alert(Ext.encode(initData));
		if(!Ext.isEmpty(initData.val2)) initData.starttime=initData.val2.format(format);
		if(!Ext.isEmpty(initData.val63)) initData.val63=initData.val63.format(format);
		if(!Ext.isEmpty(initData.val83)) initData.val83=initData.val83.format(format);
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
	});
	DWREngine.setAsync(true);
});
//按键事件，
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
	var inpId = this.id;
	if(inpId == "val81"){
		var v = this.value == "" ? 0 : this.value;
		var v71h = document.getElementById("val71hide");
		var v71 = document.getElementById("val71");
		v71.value = parseFloat(v71h.value) + parseFloat(v);
	}
	if(inpId == "val82"){
		var v = this.value == "" ? 0 : this.value;
		var v72h = document.getElementById("val72hide");
		var v72 = document.getElementById("val72");
		v72.value = parseFloat(v72h.value) + parseFloat(v);
	}
}
//失去焦点事件
function onblurFn(){
	var o = this;
	if(o.style)	o.style.background="transparent"
}
//获取焦点事件
function onfocusFn(){
	if(m_record.get("state")==="1") return 
	var o = this;
	if(o.style)	o.style.backgroundColor="#D3FCD7"
}
//粘贴事件
function onafterpasteFn(){
	if(m_record.get("state")==="1") return;
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
//日期输入获取焦点事件
function onfocusDateFn(){
	if(m_record.get("state")==="1") return 
	var o = this;
	if(o.style)	o.style.backgroundColor="#D3FCD7";
	//弹出日期选择框
	if(window["menu"] == null){
	    window["menu"] = new Ext.menu.DateMenu();
    };
 	window["menuListeners"] = {
	  	select: function(m, d){
	    	o.value = d.format(format) ;
		},
		hide : function(){
	        window["menu"].un("select",window["menuListeners"].select,o);
	        window["menu"].un("hide",  window["menuListeners"].hide,  o);
	        if(o.style)	o.style.background="transparent"
	    }
 	};
 	window["menu"].on(Ext.apply({}, window["menuListeners"], {scope:o}))
    window["menu"].picker.setValue(Date.parseDate(o.value, format)||new Date());
    window["menu"].show(o, "tl-bl?", false);
}
//小数乘法返回精确的结果
function accMul(arg1,arg2)

{ 

    var m=0,s1=arg1.toString(),s2=arg2.toString(); 

    try{m+=s1.split(".")[1].length}catch(e){} 

    try{m+=s2.split(".")[1].length}catch(e){} 

    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 

}