var selectWin;
var maxStockBh = ""
var maxStockBhPrefix
var incrementLsh =0
var gridPanel,gridPanelB

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function() {
	maxStockBhPrefix = USERNAME + new Date().format('ym');
	DWREngine.setAsync(false);	
	stockMgm.getStockPlanNewBh(maxStockBhPrefix,"bh","wz_cjhpb",null,function(dat){
		if(dat != "")	{
			maxStockBh = dat;
			incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
		}	
	})
	DWREngine.setAsync(true); 
	if(isFlwTask && bh!=null && bh!="") maxStockBh = bh;  

	
	//根据流程状态查询
    var billFilterArr = [['','查看全部'],['0','新建'],['-1','审批中'],['1','已审批']];
 	var dsBillState = new Ext.data.SimpleStore({
 		fields:['v','k'],
 		data:billFilterArr
 	})
 	
    var billStateFilter = new Ext.form.ComboBox({
    	id : 'billFilter',
    	fieldLabel : '流程状态',
		readOnly : true,
    	store : dsBillState,
    	width : 70,
    	readOnly : true,
		displayField : 'k',
    	valueField : 'v',
    	mode : 'local',
    	triggerAction : 'all',
    	emptyText : '查看全部',
    	listeners : {
			select : filterByBillState
		}
    })
    function filterByBillState(){
    	var filter = Ext.getCmp('billFilter').getValue();
    	if(filter==""){
    		ds.baseParams.params = " jhr='" + USERID +"'";
    	}else{
    		ds.baseParams.params = "billState='"+filter+"' and jhr='" + USERID +"'";	
    	}
    	ds.reload();
    }
	
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		tbar : ['<font color=#15428b><b>采购计划</b></font>','-'],
		border : false,
		region : 'center',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 10,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey,
		deleteHandler: deleteStockFun,
		//流程状态不为0时，取消编辑
		listeners: {
			beforeedit:function(e){
	            var currRecord = e.record;   
	            if (hasFlow&&currRecord.get("billState") != '0')   
	                e.cancel = true;   
	        }
		}
	});
	
	gridPanel.on("afterinsert",function(){
		var rec = sm.getSelected();
		if(maxStockBh!= null){
			rec.set("bh",maxStockBh);
		} else{
			incrementLsh = incrementLsh +1
			rec.set("bh",maxStockBhPrefix + String.leftPad(incrementLsh,4,"0"))
		}
		maxStockBh = null;
	})
	
	ds.on('load',function(ds1){
   		sm.selectFirstRow();   		
   		
   	});
	ds.load({ params:{start: 0, limit: 10 }});
	//-----------------------------------------从grid begin-------------------------
	var gridPanelB = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-gridB-panel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		tbar : [],
		border : false,
		region : 'south',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		height: 300, 
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsB,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties				
		plant : PlantB,
		plantInt : PlantIntB,
		servletUrl : MAIN_SERVLET,
		bean : beanB,
		business : business,		
		primaryKey : primaryKeyB ,		
		//crudText: {add:'汇总申请计划'},
		crudText: {add:'从计划汇总中选'},
		saveHandler:saveHandler,
		insertHandler: getBuyMat,
		deleteHandler: deleteStockMatFun
	});
	
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false, 
		items: [gridPanel,gridPanelB]
		
	}) 

	//-----------------------------------------从grid end---------------------------
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel],
		listeners: {
			afterlayout: function(){
				if (isFlwView == true){
					gridPanel.getTopToolbar().disable();
					gridPanelB.getTopToolbar().disable();
			    }
			    if(isFlwTask || isFlwView){
					with(gridPanel.getTopToolbar().items){
				    	get('add').disable();
				    	get('del').disable();
				    }
				}
			}
		}
	});
//	if(!isFlwTask && !isFlwView)gridPanel.getTopToolbar().add('审批状态：',billStateFilter);
	if (!isFlwTask && !isFlwView){
		if(hasFlow){
			gridPanel.getTopToolbar().add('审批状态：',billStateFilter);
		}
	}
	if(isFlwTask){
		DWREngine.setAsync(false);
		baseMgm.getData("select uids,bh from wz_cjhpb where bh='"+bh+"' ",function(list){
			if(list.length==0){
				gridPanel.defaultInsertHandler();
    			gridPanel.defaultSaveHandler();
			}
		})
		DWREngine.setAsync(true);
	} 
	

	//-----------------------------------------function --------------------------------
	
	sm.on('rowselect', function(sm, rowIndex, record){
   		var buyId = record.get('bh');
   		var billstate = record.get('billState')
   		dsB.baseParams.params = " bh ='" + buyId + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   		if(!isFlwTask && !isFlwView&&hasFlow){
	   		if(billstate!='0'){
				with(gridPanel.getTopToolbar().items){
			    	get('save').disable();
			    	get('del').disable();
			    }
			    with(gridPanelB.getTopToolbar().items){
			    	get('add').disable();
			    	get('save').disable();
			    	get('del').disable();
			    }
			}else{
				with(gridPanel.getTopToolbar().items){
			    	get('save').enable();
			    	get('del').enable();
			    }
			    with(gridPanelB.getTopToolbar().items){
			    	get('add').enable();
			    	get('save').enable();
			    	get('del').enable();
			    }
			}
   		}
   })
	
  
    function saveHandler(){
    	var flag=false;
    	records=this.getStore().getModifiedRecords();
    	if(records.length==0){
            Ext.example.msg('提示', '没有修改数据，不能保存！');
//    		    Ext.Msg.show({
//					title: '提示',
//		            msg: '请填写完整数据',
//		            icon: Ext.Msg.WARNING, 
//		            width:200,
//		            buttons: Ext.MessageBox.OK
//				})	
    	}
    	else if(records.length>0){
    	for(var i=0;i<records.length;i++){
    		if(records[i].get('xz')==""&&records[i].get('xz')==''){
				falg=false;
				break;
    		}
    			else{flag=true;}
    		}
    		if(flag==true){
    			gridPanelB.defaultSaveHandler()
    		}
    		else{
	 			 Ext.Msg.show({
					title: '提示',
		            msg: '请填写采购方式',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
				})
    		}
   		}
   }
    function appStateRender(value){
   		var str = '';
   		for(var i=0; i<appStates.length; i++) {
   			if (appStates[i][0] == value) {
   				if (value == 2){
   					str = '<font color=#0000ff>'+appStates[i][1]+'</font>';
   				}
   				if (value == 3){
   					str = '<font color=#00ff00>'+appStates[i][1]+'</font>';
   				}
   				break; 
   			}
   		}
   		return str;
   	}
   	
   function getBuyMat(){
   		if (ds.getModifiedRecords().length >0){
   			Ext.Msg.show({
					title: '提示',
		            msg: '请先保存上边的采购计划列表的数据',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
			return
   		}
   		if (sm.hasSelection()){
   			var buyId = sm.getSelected().get('bh');
//   			window.location.href = BASE_PATH+"jsp/material/mat.appbuy.buy.select.jsp?buyId="
//   					+buyId 
   			//if (!selectWin){
	   			selectWin = new Ext.Window({
					title: '选择',
					//closeAction: 'hide',
					width: document.body.clientWidth*0.95,
					height: document.body.clientHeight*0.95,
					modal: true, plain: true, border: false, resizable: false,
					autoLoad: {
						//url: BASE_PATH + 'Business/wzgl/viewDispatcher.jsp',
						//params: 'page=buy&buyId='+buyId,
						//text: 'Loading...'
						url: BASE_PATH + 'Business/wzgl/viewDispatcher.jsp',
						params: 'page=applyHz&buyId='+buyId,
						text: 'Loading...'
					},
					listeners: {
						hide: function(){
							dsB.reload();
							if (isFlwTask == true){
								Ext.Msg.show({
									title: '您成功维护了采购计划信息！',
									msg: '您是否进行发送流程到下一步操作！<br><br>是：[完成流程任务] 否：[继续维护数据]',
									buttons: Ext.Msg.YESNO,
									icon: Ext.MessageBox.INFO,
									fn: function(value){
								   		if ('yes' == value){
								   			parent.IS_FINISHED_TASK = true;
											parent.mainTabPanel.setActiveTab('common');
								   		}
									}
								});
							}
						}
					}
				});
   			//}   			
			selectWin.show();
   		}else{
   			Ext.Msg.show({
					title: '提示',
		            msg: '请选择一条采购计划',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
   		}
   	}
   	
   	function deleteStockMatFun(){
   		var recArr = smB.getSelections();
   	
		if (recArr.length==0) {
			Ext.Msg.alert("删除采购物资清单", "请选择要删除的采购物资清单！");
		} else {
			Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,	text) {
				if (btn == "yes") {
					var docIDs = "";
					for (i=0; i<recArr.length; i++) {
						docIDs += "`" + recArr[i].data["uids"];
					}
					if(docIDs.length>0) {
						docIDs = docIDs.substring(1);
					}					
					stockMgm.deleteStockPlanMat(docIDs,function(dat){
						if(dat){
							dsB.reload();
						}else{
							Ext.Msg.alert("提示",'删除失败');
						}
					});
				}
			});
   		}
   	}
   	
   	function deleteStockFun(){
   		var recordCjhpb = sm.getSelected();
   	
		if (recordCjhpb ==null) {
			Ext.Msg.alert("删除采购计划", "请选择要删除的采购计划！");
		} else {
			Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,	text) {
				if (btn == "yes") {
					var uids = recordCjhpb.data["uids"];		
					stockMgm.deleteStockPlan(uids,function(dat){
						if(dat){
							ds.reload();
							dsB.reload();
						}else{
							Ext.Msg.alert("提示",'删除失败');
						}
					});
				}
			});
   		}
   	}
   	
   	
});

