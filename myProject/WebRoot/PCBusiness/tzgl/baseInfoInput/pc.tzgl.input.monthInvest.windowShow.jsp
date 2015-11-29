<%@ page language="java" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>月度投资完成报表详细录入</title>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script>
Ext.onReady(function(){
	var m_record = window.dialogArguments;
	var fieldSet1 = new Ext.form.FieldSet({
			title:"本项目基本信息",
			layout:"column",
			id:'fieldset1',
			items:[
				{
					xtype:"form",
					id:'form1',
					labelWidth:80,
					labelAlign:"right",
					bodyStyle: 'padding:5px 5px;',
					layout:"form",
					border:false,
					columnWidth:0.5,
					items:[
						{
							xtype:"textfield",
							id:'unitname',
							name:'unitname',
							fieldLabel:"项目名称",
							disabled:true,
							anchor:"95%"
						},
						{
							xtype:"numberfield",
							id:'lastyeartotalcomp',
							name:'lastyeartotalcomp',
							decimalPrecision : 5,
							fieldLabel:"至上年底累计",
							disabled:true,
							anchor:"95%"
						}
					]
				},
				{
					xtype:"form",
					id:'form2',
					labelWidth:80,
					labelAlign:"right",
					bodyStyle: 'padding:5px 5px;',
					border:false,
					layout:"form",
					columnWidth:0.5,
					items:[
						{
							xtype:"numberfield",
							fieldLabel:"总投资",
							id:'totalinvestcal',
							name:'totalinvestcal',
							decimalPrecision : 5,
							disabled:true,
							anchor:"95%"
						},
						{
							xtype:"numberfield",
							id:'yearinvestfund',
							name:'yearinvestfund',
							decimalPrecision : 5,
							fieldLabel:"本年计划投资",
							disabled:true,
							anchor:"95%"
						}
					]
				}
			]
	});
	var fieldSet2 = new Ext.form.FieldSet({
		title:"本年完成投资",
		id:'fieldset2',
		layout:"column",
		items:[
			{
				xtype:"form",
				id:'form3',
				labelWidth:100,
				labelAlign:"right",
				layout:"form",
				border:false,
				columnWidth:0.5,
				items:[
					{
						xtype:"numberfield",
						id:'monthCompBuild',
						name:'monthCompBuild',
						decimalPrecision : 5,
						fieldLabel:"本月土建",
						anchor:"95%",
						listeners:{
							'change':function(obj,newValue,oldValue){
								var comp=thisForm.findById('totalbuild');
								comp.setValue(comp.getValue()-oldValue+newValue);
								var comp2=thisForm.findById('totalcomp');
								comp2.setValue(comp2.getValue()-oldValue+newValue);
								var comp3=thisForm.findById('thisyeartotalcomp');
								comp3.setValue(comp3.getValue()-oldValue+newValue);
							}
						}
					},
					{
						xtype:"numberfield",
						id:'monthCompInstall',
						name:'monthCompInstall',
						decimalPrecision : 5,
						fieldLabel:"本月安装",
						anchor:"95%",
						listeners:{
							'change':function(obj,newValue,oldValue){
								var comp=thisForm.findById('totalinstall');
								comp.setValue(comp.getValue()-oldValue+newValue);
								var comp2=thisForm.findById('totalcomp');
								comp2.setValue(comp2.getValue()-oldValue+newValue);
								var comp3=thisForm.findById('thisyeartotalcomp');
								comp3.setValue(comp3.getValue()-oldValue+newValue);
							}
						}
					},
					{
						xtype:"numberfield",
						id:'monthCompEquip',
						name:'monthCompEquip',
						decimalPrecision : 5,
						fieldLabel:"本月设备",
						anchor:"95%",
						listeners:{
							'change':function(obj,newValue,oldValue){
								var comp=thisForm.findById('totalequip');
								comp.setValue(comp.getValue()-oldValue+newValue);
								var comp2=thisForm.findById('totalcomp');
								comp2.setValue(comp2.getValue()-oldValue+newValue);
								var comp3=thisForm.findById('thisyeartotalcomp');
								comp3.setValue(comp3.getValue()-oldValue+newValue);
							}
						}
					},
					{
						xtype:"numberfield",
						id:'monthCompOther',
						name:'monthCompOther',
						decimalPrecision : 5,
						fieldLabel:"本月其它",
						anchor:"95%",
						listeners:{
							'change':function(obj,newValue,oldValue){
								var comp=thisForm.findById('totalother');
								comp.setValue(comp.getValue()-oldValue+newValue);
								var comp2=thisForm.findById('totalcomp');
								comp2.setValue(comp2.getValue()-oldValue+newValue);
								var comp3=thisForm.findById('thisyeartotalcomp');
								comp3.setValue(comp3.getValue()-oldValue+newValue);
							}
						}
					},
					{
						xtype:"numberfield",
						disabled:true,
						id:'totalcomp',
						name:'totalcomp',
						decimalPrecision : 5,
						fieldLabel:"本月累计",
						anchor:"95%"
					}
				]
			},
			{
				xtype:"form",
				id:'form4',
				labelWidth:100,
				labelAlign:"right",
				border:false,
				layout:"form",
				columnWidth:0.5,
				items:[
					{
						xtype:"numberfield",
						id:'totalbuild',
						name:'totalbuild',
						disabled:true,
						fieldLabel:'土建累计',
						decimalPrecision : 5,
						anchor:"95%"
					},
					{
						xtype:"numberfield",
						disabled:true,
						id:'totalinstall',
						name:'totalinstall',
						decimalPrecision : 5,
						fieldLabel:"安装累计",
						anchor:"95%"
					},
					{
						xtype:"numberfield",
						disabled:true,
						id:'totalequip',
						name:'totalequip',
						decimalPrecision : 5,
						fieldLabel:"设备累计",
						anchor:"95%"
					},
					{
						xtype:"numberfield",
						disabled:true,
						id:'totalother',
						name:'totalother',
						decimalPrecision : 5,
						fieldLabel:"其它累计",
						anchor:"95%"
					},
					{
						xtype:"numberfield",
						disabled:true,
						id:'thisyeartotalcomp',
						name:'thisyeartotalcomp',
						decimalPrecision : 5,
						fieldLabel:"本年累计",
						anchor:"95%"
					}
				]
			}
		]
	});
	var fieldSet3 = new Ext.form.FieldSet({
		title:"资金到位",
		id:'fieldset3',
		layout:"column",
		items:[
			{
				xtype:"form",
				id:'form5',
				title:"",
				labelWidth:110,
				labelAlign:"right",
				layout:"form",
				border:false,
				columnWidth:0.5,
				items:[
					{
						xtype:"numberfield",
						id:'yearplanfund',
						name:'yearplanfund',
						decimalPrecision : 5,
						fieldLabel:"本年计划资金到位",
						disabled:true,
						anchor:"95%"
					},
					{
						xtype:"numberfield",
						id:'totalfunded',
						name:'totalfunded',
						decimalPrecision : 5,
						fieldLabel:"累计资金到位",
						disabled:true,
						anchor:"95%"
					}
				]
			},
			{
				xtype:"form",
				id:'form6',
				title:"",
				labelWidth:100,
				labelAlign:"right",
				layout:"form",
				border:false,
				columnWidth:0.5,
				items:[
					{
						xtype:"numberfield",
						id:'monthFullFunded',
						name:'monthFullFunded',
						decimalPrecision : 5,
						fieldLabel:"本月到位",
						anchor:"95%",
						listeners:{
							'change':function(obj,newValue,oldValue){
								var comp=thisForm.findById('totalfundedyear');
								comp.setValue(comp.getValue()-oldValue+newValue);
								var comp2=thisForm.findById('totalfunded');
								comp2.setValue(comp2.getValue()-oldValue+newValue);
							}
						}
					},
					{
						xtype:"numberfield",
						id:'totalfundedyear',
						name:'totalfundedyear',
						decimalPrecision : 5,
						disabled:true,
						fieldLabel:"本年累计到位",
						anchor:"95%"
					}
				]
			}
		]
	});
	var fieldSet4 = new Ext.form.FieldSet({
		layout:"form",
		id:'fieldset4',
		border:false,
		items:[
			{
				xtype:"form",
				id:'form7',
				title:"",
				labelWidth:100,
				labelAlign:"right",
				layout:"form",
				border:false,
				items:[
					{
						xtype:"textfield",
						id:'progressObjective',
						name:'progressObjective',
						fieldLabel:"工程形象进度",
						anchor:"95%"
					},
					{
						xtype:"textarea",
						id:'memo',
						name:'memo',
						fieldLabel:"备注",
						anchor:"95%"
					},
					new Ext.form.Hidden({id:'uids',name:'uids'}),
                	new Ext.form.Hidden({id:'masterId',name:'masterId'}),
                	new Ext.form.Hidden({id:'pid',name:'pid'}),
                	new Ext.form.Hidden({id:'sjType',name:'sjType'}),
  						new Ext.form.Hidden({id:'unitId',name:'unitId'}),
  						new Ext.form.Hidden({id:'zbSeqno',name:'zbSeqno'})
				]
			}
		]
	});
	
	var thisForm =new Ext.Panel({
		layout:'form',
		region:'center',
		xtype:'form',
		items:[fieldSet1,fieldSet2,fieldSet3,fieldSet4]
	});
			
	var tbar=new Ext.Panel({
		border:false,
		height:40,
		region:'south',
		buttonAlign:'center',
		buttons: [{
				text:"确定",
				handler :function(){
						var obj={uids:'',masterId:'',pid:'',sjType:'',unitId:'',zbSeqno:'',
								yearPlanInves:'',monthCompBuild:'',monthCompEquip:'',
								monthCompInstall:'',monthCompOther:'',yearPlanFullFunded:'',
								monthFullFunded:'',progressObjective:'',memo:'',totalInvest:''};
						obj.uids=thisForm.findById('uids').getValue();
						if(obj.uids !=""){
							obj.masterId=thisForm.findById('masterId').getValue();	
							obj.pid=thisForm.findById('pid').getValue();	
							obj.sjType=thisForm.findById('sjType').getValue();	
							obj.unitId=thisForm.findById('unitId').getValue();	
						}else{
				    		obj.masterId=m_record.get('uids');	
							obj.pid=m_record.get('pid');
							obj.sjType=m_record.get('sjType');
							obj.unitId=m_record.get('unitId');
						}	
						obj.monthCompBuild=thisForm.findById('monthCompBuild').getValue();	
						obj.monthCompEquip=thisForm.findById('monthCompEquip').getValue();	
						obj.monthCompInstall=thisForm.findById('monthCompInstall').getValue();	
						obj.monthCompOther=thisForm.findById('monthCompOther').getValue();	
						obj.monthFullFunded=thisForm.findById('monthFullFunded').getValue();	
						obj.progressObjective=thisForm.findById('progressObjective').getValue();	
						obj.memo=thisForm.findById('memo').getValue();	
						DWREngine.setAsync(false);
				    	if (obj.uids == '' || obj.uids == null){
					   		pcTzglService.monthCompddOrUpdate(obj, function(state){
					   			if ("1" == state){
					   				Ext.example.msg('保存成功！', '您成功新增了一条记录！');
					   				window.close();
					   			}else{
					   				Ext.Msg.show({
										title: '提示',
										msg: state,
										buttons: Ext.Msg.OK,
										icon: Ext.MessageBox.ERROR
									});
					   			}
					   		});
				   		}else{
				   			pcTzglService.monthCompddOrUpdate(obj, function(state){
					   			if ("2" == state){
					   				Ext.example.msg('保存成功！', '您成功修改了一条记录！');
									window.close();
					   			}else{
					   				Ext.Msg.show({
										title: '提示',
										msg: state,
										buttons: Ext.Msg.OK,
										icon: Ext.MessageBox.ERROR
									});
					   			}
					   		});
				   		}
				   		DWREngine.setAsync(true);	
				}
			},{
				text:"取消",
				handler : function(){
					window.close();
				}
			}],
			listeners:{
				'render':function(form){
					if(m_record.get('reportStatus')==1) form.hide();
				}
			}
	});	
		
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [thisForm,tbar],
		listeners:{
			'render':function(){
					var uids=m_record.get('uids');
					var sjType=m_record.get('sjType');
					var pid=m_record.get('pid');
					 DWREngine.setAsync(false);
						pcTzglService.monthCompIni(uids,pid,sjType,function(list){
							if(list.length>0){
								if(list[0].unitname==null || list[0].unitname==""){
									thisForm.findById('unitname').setValue(CURRENTAPPNAME);
								}else{
									thisForm.findById('unitname').setValue(list[0].unitname);
								}
								thisForm.findById('lastyeartotalcomp').setValue(list[0].lastyeartotalcomp);
								thisForm.findById('totalinvestcal').setValue(list[0].totalinvestcal);
								thisForm.findById('yearinvestfund').setValue(list[0].yearinvestfund);
								thisForm.findById('monthCompBuild').setValue(list[0].monthCompBuild);
								thisForm.findById('monthCompInstall').setValue(list[0].monthCompInstall);
								thisForm.findById('monthCompEquip').setValue(list[0].monthCompEquip);
								thisForm.findById('monthCompOther').setValue(list[0].monthCompOther);
								thisForm.findById('totalcomp').setValue(list[0].totalcomp);
								thisForm.findById('totalbuild').setValue(list[0].totalbuild);
								thisForm.findById('totalinstall').setValue(list[0].totalinstall);
								thisForm.findById('totalequip').setValue(list[0].totalequip);
								thisForm.findById('totalother').setValue(list[0].totalother);
								thisForm.findById('thisyeartotalcomp').setValue(list[0].thisyeartotalcomp);
								thisForm.findById('yearplanfund').setValue(list[0].yearplanfund);
								thisForm.findById('totalfunded').setValue(list[0].totalfunded);
								thisForm.findById('monthFullFunded').setValue(list[0].monthFullFunded);
								thisForm.findById('totalfundedyear').setValue(list[0].totalfundedyear);
								thisForm.findById('progressObjective').setValue(list[0].progressObjective);
								thisForm.findById('memo').setValue(list[0].memo);
								thisForm.findById('uids').setValue(list[0].uids);
								thisForm.findById('masterId').setValue(list[0].masterId);
								thisForm.findById('pid').setValue(list[0].pid);
								thisForm.findById('sjType').setValue(list[0].sjType);
								thisForm.findById('unitId').setValue(list[0].unitId);
								thisForm.findById('zbSeqno').setValue(list[0].zbSeqno);
							}
						});
					DWREngine.setAsync(true);
				}
		}
	});
});
			
</script>
		
	</head>

	<body>
	</body>
</html>
