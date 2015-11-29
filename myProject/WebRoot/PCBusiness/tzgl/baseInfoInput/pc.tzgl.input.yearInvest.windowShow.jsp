<%@ page language="java" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>年度投资计划报表详细录入</title>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script>
Ext.onReady(function(){
	var m_record = window.dialogArguments;
	//alert(m_record.get('uids'));
	var thisForm=new Ext.Panel({
		autoScroll:true,
		region:'center',
		layout:"form",
		width:1220,
		items:[
			{
				xtype:"fieldset",
				title:"本项目基本信息",
				collapsible:true,//折叠
				layout:"column",
				width:970,
				height:50,
				bodyStyle:"",
				items:[
					{
						xtype:"panel",
						title:"",
						layout:"form",
						labelAlign:"right",
						border:false,
						width:190,
						bodyStyle:"padding:0px 0px;",
						labelWidth:80,
						items:[
							{
								xtype:"textfield",
								id:'unitname',
								name:'unitname',
								disabled:true,
								fieldLabel:"项目名称",
								anchor:"100%",
								width:100
							}
						]
					},
					{
						xtype:"panel",
						layout:"form",
						border:false,
						width:210,
						labelWidth:100,
						labelAlign:"right",
						items:[
							{
								xtype:"textfield",
								id:'buildLimit',
								name:'buildLimit',
								disabled:true,
								fieldLabel:"建设起止年限",
								anchor:"100%",
								width:100
							}
						]
					},
					{
						xtype:"panel",
						border:false,
						width:190,
						layout:"form",
						labelAlign:"right",
						labelWidth:80,
						items:[
							{
								xtype:"textfield",
								id:'buildScale',
								name:'buildScale',
								disabled:true,
								fieldLabel:"建设规模",
								anchor:"100%",
								width:100
							}
						]
					},
					{
						xtype:"panel",
						border:false,
						layout:"form",
						width:190,
						labelWidth:80,
						labelAlign:"right",
						items:[
							{
								xtype:"textfield",
								id:'buildNature',
								name:'buildNature',
								disabled:true,
								fieldLabel:"建设性质",
								anchor:"100%",
								width:100
							}
						]
					}
				]
			},
			{
				xtype:"fieldset",
				title:"资金来源",
				layout:"column",
				bodyStyle:"padding:0px 0px;",
				width:970,
				collapsible:true,//折叠
				collapsed:true,
				height:150,
				items:[
					{
						xtype:"panel",
						border:false,
						layout:"form",
						labelAlign:"right",
						width:970,
						labelWidth:70,
						bodyStyle:"padding:0px 0px;",
						items:[
							{
								xtype:"numberfield",
								id:'investTotal',
								name:'investTotal',
								decimalPrecision : 5,
								disabled:true,
								fieldLabel:"总投资",
								anchor:"20%",
								width:100
							},
							{
								xtype:"fieldset",
								title:"其中资本金",
								layout:"column",
								width:770,
								items:[
									{
										xtype:"panel",
										layout:"form",
										border:false,
										width:190,
										labelWidth:80,
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'srcZbjjt',
												name:'srcZbjjt',
												disabled:true,
												fieldLabel:"集团出资",
												anchor:"100%",
												width:100
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										width:190,
										labelWidth:80,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'srcZbjzy',
												name:'srcZbjzy',
												disabled:true,
												fieldLabel:"自有资金",
												anchor:"100%",
												width:100
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										width:170,
										labelWidth:60,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'srcZbjqt',
												name:'srcZbjqt',
												disabled:true,
												fieldLabel:"其它",
												anchor:"100%",
												width:100
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										width:170,
										labelWidth:60,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'srcZbjTotal',
												name:'srcZbjTotal',
												disabled:true,
												fieldLabel:"小计",
												anchor:"100%",
												width:100
											}
										]
									}
								]
							},
							{
								xtype:"fieldset",
								border:false,
								layout:"column",
								items:[
									{
										xtype:"panel",
										border:false,
										width:150,
										labelWidth:40,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'srcDk',
												name:'srcDk',
												disabled:true,
												fieldLabel:"贷款",
												anchor:"100%",
												width:100
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										width:170,
										labelWidth:60,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'srcQt',
												name:'srcQt',
												disabled:true,
												fieldLabel:"其它",
												anchor:"100%",
												width:100
											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				xtype:"fieldset",
				title:"上年累计完成投资",
				layout:"column",
				collapsible:true,//折叠
				collapsed:true,
				height:50,
				width:970,
				items:[
					{
						xtype:"panel",
						border:false,
						width:220,
						labelWidth:110,
						layout:"form",
						labelAlign:"right",
						items:[
							{
								xtype:"numberfield",
								decimalPrecision : 5,
								id:'lastYearCompTotal',
								name:'lastYearCompTotal',
								disabled:true,
								fieldLabel:"完成工程量总额",
								anchor:"100%",
								width:100
							}
						]
					},
					{
						xtype:"panel",
						border:false,
						width:210,
						labelWidth:100,
						layout:"form",
						labelAlign:"right",
						items:[
							{
								xtype:"numberfield",
								decimalPrecision : 5,
								id:'lastYearFundedTotal',
								name:'lastYearFundedTotal',
								disabled:true,
								fieldLabel:"资金到位总额",
								anchor:"100%",
								width:100
							}
						]
					}
				]
			},
			{
				xtype:"fieldset",
				title:"本年工程计划",
				layout:"form",
				collapsible:true,//折叠
				height:80,
				width:970,
				items:[
					{
						xtype:"panel",
						border:false,
						layout:"form",
						labelAlign:"right",
						labelWidth:60,
						items:[
							{
								xtype:"numberfield",
								decimalPrecision : 5,
								id:'prjMoneyTotal',
								name:'prjMoneyTotal',
								disabled:true,
								fieldLabel:"总额",
	//							anchor:"20%",
								width:100
							},
							{
								xtype:"fieldset",
								border:false,
								layout:"column",
								items:[
									{
										xtype:"panel",
										border:false,
										width:170,
										labelWidth:60,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'buildMoney',
												name:'buildMoney',
												fieldLabel:"土建",
												anchor:"100%",
												width:100,
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('prjMoneyTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
													}
												}
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										width:170,
										labelWidth:60,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'equipMoney',
												name:'equipMoney',
												fieldLabel:"设备",
												anchor:"100%",
												width:100,
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('prjMoneyTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
													}
												}
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										width:170,
										labelWidth:60,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'installMoney',
												name:'installMoney',
												fieldLabel:"安装",
												anchor:"100%",
												width:100,
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('prjMoneyTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
													}
												}
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										width:170,
										labelWidth:60,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'routeMoney',
												name:'routeMoney',
												fieldLabel:"线路",
												anchor:"100%",
												width:100,
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('prjMoneyTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
													}
												}
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										width:170,
										labelWidth:60,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'otherMoney',
												name:'otherMoney',
												fieldLabel:"其它",
												anchor:"100%",
												width:100,
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('prjMoneyTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
													}
												}
											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				xtype:"fieldset",
				title:"本年资金计划",
				layout:"form",
				collapsible:true,//折叠
				height:150,
				width:970,
				items:[
					{
						xtype:"panel",
						border:false,
						layout:"form",
						labelAlign:"right",
						labelWidth:60,
						items:[
							{
								xtype:"numberfield",
								decimalPrecision : 5,
								id:'planFundTotal',
								name:'planFundTotal',
								disabled:true,
								fieldLabel:"总额",
								width:100
							},
							{
								xtype:"fieldset",
								title:"其中资本金",
								width:940,
								layout:"column",
								items:[
									{
										xtype:"panel",
										border:false,
										labelWidth:80,
										width:190,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'groupAddFund',
												name:'groupAddFund',
												fieldLabel:"集团增资",
												anchor:"100%",
												width:100,
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('planFundTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
														var comp2=thisForm.findById('planZbjTotal');
														comp2.setValue(comp2.getValue()-oldValue+newValue);
													}
												}
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										labelWidth:80,
										width:190,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'equityFund',
												name:'equityFund',
												fieldLabel:"自有资金",
												anchor:"100%",
												width:100,
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('planFundTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
														var comp2=thisForm.findById('planZbjTotal');
														comp2.setValue(comp2.getValue()-oldValue+newValue);
													}
												}
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										labelWidth:60,
										width:170,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'capitalLoan',
												name:'capitalLoan',
												fieldLabel:"贷款",
												anchor:"100%",
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('planFundTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
														var comp2=thisForm.findById('planZbjTotal');
														comp2.setValue(comp2.getValue()-oldValue+newValue);
													}
												}
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										labelWidth:60,
										width:170,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'capitalOther',
												name:'capitalOther',
												fieldLabel:"其它",
												anchor:"100%",
												width:100,
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('planFundTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
														var comp2=thisForm.findById('planZbjTotal');
														comp2.setValue(comp2.getValue()-oldValue+newValue);
													}
												}
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										labelWidth:60,
										width:170,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'planZbjTotal',
												name:'planZbjTotal',
												disabled:true,
												fieldLabel:"合计",
												anchor:"100%",
												width:100
											}
										]
									}
								]
							},
							{
								xtype:"fieldset",
								border:false,
								layout:"column",
								items:[
									{
										xtype:"panel",
										border:false,
										labelWidth:60,
										width:170,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'fundPlanLoan',
												name:'fundPlanLoan',
												fieldLabel:"贷款",
												anchor:"100%",
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('planFundTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
													}
												}
											}
										]
									},
									{
										xtype:"panel",
										border:false,
										labelWidth:60,
										width:170,
										layout:"form",
										items:[
											{
												xtype:"numberfield",
												decimalPrecision : 5,
												id:'fundPlanOther',
												name:'fundPlanOther',
												fieldLabel:"其它",
												anchor:"100%",
												listeners:{
													'change':function(obj,newValue,oldValue){
														var comp=thisForm.findById('planFundTotal');
														comp.setValue(comp.getValue()-oldValue+newValue);
													}
												}
											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				xtype:"fieldset",
				border:false,
				layout:"column",
				width:970,
				items:[
					{
						xtype:"panel",
						border:false,
						layout:"form",
						labelAlign:"right",
						width:510,
						labelWidth:100,
						items:[
							{
								xtype:"textarea",
								id:'progressObjective',
								name:'progressObjective',
								fieldLabel:"形象进度目标",
								width:400
							}
						]
					},
					{
						xtype:"panel",
						border:false,
						labelWidth:60,
						width:370,
						layout:"form",
						labelAlign:"right",
						items:[
							{
								xtype:"textarea",
								id:'memo',
								name:'memo',
								fieldLabel:"备注",
								width:300
							},
							new Ext.form.Hidden({id:'uids',name:'uids'}),
		                	new Ext.form.Hidden({id:'masterUids',name:'masterUids'}),
		                	new Ext.form.Hidden({id:'pid',name:'pid'}),
		                	new Ext.form.Hidden({id:'sjType',name:'sjType'}),
	   						new Ext.form.Hidden({id:'unitId',name:'unitId'}),
	   						new Ext.form.Hidden({id:'zbSeqno',name:'zbSeqno'})
						]
					}
				]
			}
		]
	});
			
	var tbar=new Ext.Panel({
		border:false,
		height:40,
		region:'south',
		buttonAlign:'center',
		buttons: [{
				text:"确定",
				handler :  function(){
						var obj={uids:'',masterUids:'',pid:'',sjType:'',unitId:'',zbSeqno:'',val1:'',
								totalWorkAmount:'',totalFullFunded:'',buildMoney:'',equipMoney:'',installMoney:'',routeMoney:'',
								otherMoney:'',groupAddFund:'',equityFund:'',capitalLoan:'',capitalOther:'',fundPlanLoan:'',
								fundPlanOther:'',progressObjective:'',memo:''};
						obj.uids=thisForm.findById('uids').getValue();
						if(obj.uids !=""){
							obj.masterUids=thisForm.findById('masterUids').getValue();	
							obj.pid=thisForm.findById('pid').getValue();	
							obj.sjType=thisForm.findById('sjType').getValue();	
							obj.unitId=thisForm.findById('unitId').getValue();	
						}else{
				    		obj.masterUids=m_record.get('uids');	
							obj.pid=m_record.get('pid');
							obj.sjType=m_record.get('sjType');
							obj.unitId=m_record.get('pid');
						}	
//						obj.zbSeqno=thisForm.findById('zbSeqno').getValue();	
						obj.buildMoney=thisForm.findById('buildMoney').getValue();	
						obj.equipMoney=thisForm.findById('equipMoney').getValue();	
						obj.installMoney=thisForm.findById('installMoney').getValue();	
						obj.routeMoney=thisForm.findById('routeMoney').getValue();	
						obj.otherMoney=thisForm.findById('otherMoney').getValue();	
						obj.groupAddFund=thisForm.findById('groupAddFund').getValue();	
						obj.equityFund=thisForm.findById('equityFund').getValue();	
						obj.capitalLoan=thisForm.findById('capitalLoan').getValue();	
						obj.capitalOther=thisForm.findById('capitalOther').getValue();	
						obj.fundPlanLoan=thisForm.findById('fundPlanLoan').getValue();	
						obj.fundPlanOther=thisForm.findById('fundPlanOther').getValue();	
						obj.progressObjective=thisForm.findById('progressObjective').getValue();	
						obj.memo=thisForm.findById('memo').getValue();	
						
						DWREngine.setAsync(false);
				    	if (obj.uids == '' || obj.uids == null){
					   		pcTzglService.yearPlanAddOrUpdate(obj, function(state){
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
				   			pcTzglService.yearPlanAddOrUpdate(obj, function(state){
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
					if(m_record.get('issueStatus')==1) form.hide();
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
						pcTzglService.yearPlanIni(uids,pid,sjType,function(list){
							if(list.length>0){
								thisForm.findById('unitname').setValue(list[0].unitname);
								thisForm.findById('buildLimit').setValue(list[0].buildLimit);
								thisForm.findById('buildScale').setValue(list[0].buildScale);
								thisForm.findById('buildNature').setValue(list[0].buildNature);
								thisForm.findById('investTotal').setValue(list[0].investTotal);
								thisForm.findById('srcZbjjt').setValue(list[0].srcZbjjt);
								thisForm.findById('srcZbjzy').setValue(list[0].srcZbjzy);
								thisForm.findById('srcZbjqt').setValue(list[0].srcZbjqt);
								thisForm.findById('srcZbjTotal').setValue(list[0].srcZbjTotal);
								thisForm.findById('srcDk').setValue(list[0].srcDk);
								thisForm.findById('srcQt').setValue(list[0].srcQt);
								thisForm.findById('lastYearCompTotal').setValue(list[0].lastYearCompTotal);
								thisForm.findById('lastYearFundedTotal').setValue(list[0].lastYearFundedTotal);
								thisForm.findById('prjMoneyTotal').setValue(list[0].prjMoneyTotal);
								thisForm.findById('buildMoney').setValue(list[0].buildMoney);
								thisForm.findById('equipMoney').setValue(list[0].equipMoney);
								thisForm.findById('installMoney').setValue(list[0].installMoney);
								thisForm.findById('routeMoney').setValue(list[0].routeMoney);
								thisForm.findById('otherMoney').setValue(list[0].otherMoney);
								thisForm.findById('planFundTotal').setValue(list[0].planFundTotal);
								thisForm.findById('groupAddFund').setValue(list[0].groupAddFund);
								thisForm.findById('equityFund').setValue(list[0].equityFund);
								thisForm.findById('capitalLoan').setValue(list[0].capitalLoan);
								thisForm.findById('capitalOther').setValue(list[0].capitalOther);
								thisForm.findById('planZbjTotal').setValue(list[0].planZbjTotal);
								thisForm.findById('fundPlanLoan').setValue(list[0].fundPlanLoan);
								thisForm.findById('fundPlanOther').setValue(list[0].fundPlanOther);
								thisForm.findById('progressObjective').setValue(list[0].progressObjective);
								thisForm.findById('memo').setValue(list[0].memo);
								thisForm.findById('uids').setValue(list[0].uids);
								thisForm.findById('masterUids').setValue(list[0].masterUids);
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
