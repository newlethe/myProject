//项目切换js
var uids = parent.formPanel.getForm().findField('uids').getValue();
var oldStage = parent.formPanel.getForm().findField('prjStage').getValue();
//var upUnitId = parent.formPanel.getForm().findField('memoC1').getValue();
var formPanel = null;
var unitTree = null;
var editAble = '';

var bean2 = "com.sgepit.frame.sysman.hbm.SgccIniUnit";

var array_prjStage=new Array();

	//项目进度
	var dsCombo_prjStage=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: [['','']]
	});
	
Ext.onReady(function (){
	Ext.QuickTips.init();
		
	DWREngine.setAsync(false);  
	appMgm.getCodeValue('项目阶段',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_prjStage.push(temp);			
		}
    }); 
  	DWREngine.setAsync(true);
  	
  	//各store加载数据
  	dsCombo_prjStage.loadData(array_prjStage);
  	
	var fc = { // 创建编辑域配置
		'pid' : {
			id:'pid',
			name : 'pid',
			fieldLabel : '项目编码',
			readOnly :false,
			anchor : '95%',
			readOnly: true,
			listeners:{
			}
		},
		'prjStage' : {
			name : 'prjStage',
			fieldLabel : '项目阶段',
			store:dsCombo_prjStage,
        	displayField:'v',
        	valueField:'k',
        	readOnly: true,
        	mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	anchor : '95%'
		},
		'memo_c1' : {
			name : 'memoC1',
			id: 'memoC1',
			fieldLabel : '所属单位',
			editable : false,
			allowBlank : false,
			anchor : '95%'
		}
	}
	
	var Columns = [
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'prjStage',
				type : 'string'
			},{
				name : 'memoC1',
				type : 'string'
			}]
			
	unitTree=_createUniteTree(Ext.apply(fc['memo_c1']));
	var formRecord = Ext.data.Record.create(Columns);
	
	var formRecord1 = new formRecord({
		pid: '',
		prjStage: oldStage,
		memoC1: USERBELONGUNITID
	})
	
	formPanel = new Ext.FormPanel({
				width : 400,
				border : false,
				layout : 'column',
				frame: true,
				split : true,
				bodyStyle : 'padding:10px 10px; border:0px dashed #3764A0',
				labelAlign : 'left',
				items:[		
					{
		    			autoWidth:true,
		    			autoHight: true,
		                border: false,
		                labelWidth: 60,
		                layout: 'column',
						items : [
							{
									layout : 'form',
									border : false,
									defaults : { 
										width : 300
									},
									items : [
										unitTree,
										{
							    			xtype:'panel',
							    			baseCls:"x-plain",
							    			height:15
							    		},
										new Ext.form.TextField(fc['pid']),
										{
							    			xtype:'panel',
							    			baseCls:"x-plain",
							    			height:15
							    		},
//										new Ext.form.ComboBox((editAble==false?Ext.apply(fc['prjStage'],{onTriggerClick:Ext.emptyFn}):fc['prjStage'])),
										new Ext.form.ComboBox(fc['prjStage']),
											{
							    			xtype:'panel',
							    			baseCls:"x-plain",
							    			height:15,
							    			listeners:{
							    				render : function(){
													formPanel.getForm().loadRecord(formRecord1);
												}
							    			}
							    		}
									]
							}],
					buttonAlign : 'center',
					buttons : [{
								name : 'save',
								text : '确定',
								handler : _switchFn
							},{
								name : 'cancle',
								text : '取消',
								handler: _cancleFun
							}]
				}]
			});
			
	//项目转换按钮执行函数
	function _switchFn()
	{
		
		var newPid = formPanel.getForm().findField("pid").getValue();
		var prjStage = formPanel.getForm().findField("prjStage").getValue();
		var unit3id = formPanel.getForm().findField("memoC1").getValue();
		var unitType = '';
		
		//数据校验
		DWREngine.setAsync(false);
				baseDao.findByWhere2(bean2, "unitid='"+unit3id+"'",function(list){
					if(list.length>0){
						unitType = list[0].unitTypeId
					}
				});
		DWREngine.setAsync(true);
		
		if(unitType!='3')
		{
			Ext.Msg.show({
				title: '提示',
				msg: '所属单位选择错误!',  
				buttons: Ext.Msg.OK,
				icon: Ext.MessageBox.INFO
			});
			return;
		}
		
//		if(prjStage=='QQ')
//		{
//			Ext.Msg.show({
//							title: '提示',
//							msg: '请选择其他项目阶段进行项目转换!',  
//							buttons: Ext.Msg.OK,
//							icon: Ext.MessageBox.INFO
//					});
//			return;
//		}
		Ext.MessageBox.confirm('确认','前期项目转换操作不可逆, 确定要进行项目转换吗？',function(btn,text){
				if(btn=='yes'){
				DWREngine.setAsync(false);
					pcPrjService.prjSwitch(uids,newPid,prjStage,unit3id,function(flag){
						if(flag=="1")
						{
							Ext.Msg.show({
											title: '提示',
											msg: '项目转换成功!',  
											buttons: Ext.Msg.OK,
											icon: Ext.MessageBox.INFO
										});
										
							window.setTimeout(_cancleFun,3000);
							parent.history.back();
						}
						else
						{
							Ext.Msg.show({
											title: '提示',
											msg: '项目转换失败!',
											buttons: Ext.Msg.OK,
											icon: Ext.MessageBox.INFO
										});
						}
					});
				DWREngine.setAsync(true);}
		})
	}
	
	function _cancleFun()
	{
  		parent.dailogWin.close();
	}
	
	// 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
            layout: 'fit',
            autoWidth:true,
            items: [formPanel]
    });

    //创建单位树函数
  function _createUniteTree(config){    
    	var loader = new Ext.tree.TreeLoader({
			dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
			requestMethod: "GET",
			baseParams:{
				parentId:USERBELONGUNITID,
				ac:"buildingUnitTree",
				baseWhere:"unitTypeId in ('0','2','3','4')"
//				baseWhere:"unitTypeId in ('3')"
			}
		});
		var treeCombo = new Ext.ux.TreeCombo({
			width: 300,
			id:'unitTree',
			loader:loader,
			resizable:true,
			root:  new Ext.tree.AsyncTreeNode({
			   text: USERBELONGUNITNAME,
			   id: USERBELONGUNITID,
		       expanded:true
		    })
		});
		Ext.apply(treeCombo,config);
		
		treeCombo.getTree().on('beforeload',function(node){
			loader.baseParams.parentId = node.id; 
		});
		
		treeCombo.getTree().on('click',function(node){
			var unit3id = treeCombo.getValue();
			DWREngine.setAsync(false);
				pcPrjService.getUnumber(unit3id,function(pid_value){
					formPanel.findById('pid').setValue(pid_value);
				});
			DWREngine.setAsync(true);
		});
		
		return treeCombo;
	}    
}); // eo Ext.onReady
