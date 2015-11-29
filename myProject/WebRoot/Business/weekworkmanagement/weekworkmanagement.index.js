var lastWeekWorkDGrid,lastWeekWorkDTbar,lastWeekWorkDDp,currentWeekWorkDGrid,currentWeekWorkDTbar,currentWeekWorkDDp,currentWeekWorkMTbar;
var currentWeekWorkMForm;
var currentWeekWork=null;
var currentWeekProfessional=null;
var lastWeekWork=null;
var lastWeekProfessional=null;
var selvletUrl = CONTEXT_PATH + "/servlet/WeekWorkManagementServlet";
var currentPid=CURRENTAPPID;
var currentUserid=USERID;
var lastWeekWorkMainId=null;//上周次事项主键
var currentWeekWorkMainId=null;
var initFlag=false;
function pageOnload(){
	dhtmlx.image_path='/dhx/codebase/imgs/';
	var viewport=new dhtmlXLayoutObject(document.body, '3E');
	var a=viewport.cells('a');
	a.hideHeader();
	lastWeekWorkDTbar = a.attachToolbar();
	var tbStr = [{
				type : 'label',
				text : '上周落实事项'
			}, {
				type : 'separator'
			}, {
				id : 'add',
				text:"新增"
			}, {
				type : 'separator'
			}, {
				id : 'save'
			}, {
				type : 'separator'
			}, {
				id : 'delete'
			}, {
				type : 'spacer',
				id : 'delete'
			},{
				type : 'label',
				text : ':专业'
			}, {
				type : 'combo',
				id : 'professional',
				width : 120
			},{
				type : 'label',
				text : ':周次'
			}, {
				type : 'combo',
				id : 'weekPeriod',
				width : 180
			}];
	lastWeekWorkDTbar.render(tbStr);
	lastWeekWorkDTbar.getCombo("professional").readonly(true);
	lastWeekWorkDTbar.getCombo("professional").loadXML(selvletUrl+"?ac=loadProfessional&userid="+currentUserid+"&pid="+currentPid,function(){
			lastWeekWorkDTbar.getCombo("professional").selectOption(0);
			lastWeekProfessional = lastWeekWorkDTbar.getCombo('professional').getActualValue();
	});
	lastWeekWorkDTbar.getCombo("professional").attachEvent("onChange", function(){
		lastWeekProfessional = lastWeekWorkDTbar.getCombo('professional').getActualValue();
		if(initFlag){
			lastWeekWorkDGrid.clearAndLoad(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+lastWeekWork+"&weekProfessional="+lastWeekProfessional);
		}
	});
	lastWeekWorkDTbar.getCombo("weekPeriod").readonly(true);
	weekWorkManagementService.getWeekPeriod(function (data)
	{
    	var returnText=eval(data);
		 if(returnText!=null&&returnText!="")
		 {
		 	lastWeekWorkDTbar.getCombo("weekPeriod").addOption(returnText);
		 	lastWeekWorkDTbar.getCombo("weekPeriod").selectOption(0);
			lastWeekWork = lastWeekWorkDTbar.getCombo('weekPeriod').getActualValue();
		}
   });
	lastWeekWorkDTbar.getCombo("weekPeriod").attachEvent("onChange", function(){
		lastWeekWork = lastWeekWorkDTbar.getCombo('weekPeriod').getActualValue();
		if(initFlag){
			lastWeekWorkDGrid.clearAndLoad(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+lastWeekWork+"&weekProfessional="+lastWeekProfessional);
		}
	});
	lastWeekWorkDTbar.attachEvent('onClick', lastWeekWorkDTbarHandler);
	
	lastWeekWorkDGrid = a.attachGrid();
	lastWeekWorkDGrid.setImagePath('/dhx/codebase/imgs/');
	lastWeekWorkDGrid.setHeader(["uids","序号","落实事项","责任人","交付进度","完成情况描述","主记录id"]);
	lastWeekWorkDGrid.setColTypes("ro,cntr,ed,coro,ed,ed,ro");
	lastWeekWorkDGrid.setColAlign('left,center,left,left,left,left,left');
	lastWeekWorkDGrid.setColSorting('str,str,str,str,str,str,str');
	lastWeekWorkDGrid.setInitWidths("0,50,300,80,80,*,0");
	lastWeekWorkDGrid.setColumnHidden(0,true);
	lastWeekWorkDGrid.setColumnHidden(6,true);
	lastWeekWorkDGrid.init();
	lastWeekWorkDGrid.attachEvent('onEditCell',
	    function(stage, rId, cInd, nValue, oValue) {
	        if (cInd == '3') return false;
	        else return true;
	    });
	lastWeekWorkDGrid.attachEvent('onXLE', function(grid_obj, count) {
		var rowCount=lastWeekWorkDGrid.getRowsNum();
		if(rowCount > 0){
    		lastWeekWorkMainId=lastWeekWorkDGrid.cells(lastWeekWorkDGrid.getRowId(0),6).getValue();
    	}else{
    		lastWeekWorkMainId=null;
    	}
	});
	lastWeekWorkDGrid.attachFooter(["<div id='grid_lastWeekWorkD' style='width:100%;height:100%'></div>", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan"], ['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
    lastWeekWorkDGrid.enablePaging(true, 15, 3, 'grid_lastWeekWorkD');
    lastWeekWorkDGrid.setPagingSkin('toolbar', 'dhx_skyblue');
	lastWeekWorkDDp = new dataProcessor(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+lastWeekWork+"&weekProfessional="+lastWeekProfessional);
	lastWeekWorkDDp.setUpdateMode('off');
	lastWeekWorkDDp.init(lastWeekWorkDGrid);
	lastWeekWorkDDp.attachEvent("onAfterUpdateFinish",function(){
		dhxMessageWin("保存成功！","","","","",function(){
			lastWeekWorkDGrid.clearAndLoad(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+lastWeekWork+"&weekProfessional="+lastWeekProfessional);
		});
	});
	
	function lastWeekWorkDTbarHandler(itemId){
		if(itemId == 'add'){
			weekWorkManagementService.getUuidValue(function (data)
			{
		    	var newId=data;
	  			 if(newId!=null&&newId!="")
	  			 {
	  			 	lastWeekWorkDGrid.addRow(newId, [newId,"","",USERID,"","",lastWeekWorkMainId ], 0);
	  			 	lastWeekWorkDGrid.setRowColor(lastWeekWorkDGrid.getRowId(0),"#F0F8FF");
	  			}
	       });
		}else if(itemId == 'delete'){
			var rowId = lastWeekWorkDGrid.getSelectedRowId();
			if(rowId) {
				lastWeekWorkDGrid.deleteRow(rowId);
				dhxConfirmWin("您选择了删除该条信息,删除后将不可恢复，确定要删除?",null,null,null,null,function (){
					lastWeekWorkDDp.sendData();
					},function (){
						lastWeekWorkDGrid.clearAndLoad(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+lastWeekWork+"&weekProfessional="+lastWeekProfessional);		
				});
			}
		}else{
			lastWeekWorkDDp.setVerificator(4,ckWorkSchedule);
			lastWeekWorkDDp.sendData();
		}
	}
	var b = viewport.cells('b');
	b.hideHeader();
	b.setHeight(150)
	currentWeekWorkMTbar = b.attachToolbar();
	var tbStr = [{
				type : 'label',
				text : '本周待落实事项'
			}, {
				type : 'separator'
			}, {
				id : 'add',
				text:'新增'
			}, {
				type : 'separator'
			}, {
				id : 'edit',
				text:"修改"
			}, {
				type : 'separator'
			}, {
				id : 'attachListFiles',
				type:'label',
				text:'<a class="weekfile" href="javascript:showUploadWin(\'weekWorkFile\', true, \'\')">相关文件(0)</a>'
			}, {
				type : 'spacer',
				id : 'attachListFiles'
			},{
				type : 'label',
				text : ':专业'
			}, {
				type : 'combo',
				id : 'professional',
				width : 120
			},{
				type : 'label',
				text : ':周次'
			}, {
				type : 'combo',
				id : 'weekPeriod',
				width : 180
			}];
	currentWeekWorkMTbar.render(tbStr);
	currentWeekWorkMTbar.getCombo("professional").readonly(true);
	currentWeekWorkMTbar.getCombo("professional").loadXML(selvletUrl+"?ac=loadProfessional&userid="+currentUserid+"&pid="+currentPid,function(){
			currentWeekWorkMTbar.getCombo("professional").selectOption(0);
			currentWeekProfessional = currentWeekWorkMTbar.getCombo('professional').getActualValue();
			weekWorkManagementService.getCurrentWeekPeriod(currentPid,currentWeekProfessional,function (data){
				var returnText=data;
				 if(returnText!=null)
				 {
				 	currentWeekWorkMainId=returnText.uids;
				 	currentWeekWorkMTbar.getCombo("weekPeriod").setComboValue(returnText.weekPeriod);
					currentWeekWork = currentWeekWorkMTbar.getCombo('weekPeriod').getActualValue();
					initFlag=true;
					currentWeekWorkMForm.load(selvletUrl+"?ac=loadWeekWorkM&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
				}else{
					initFlag=true;
				}
			})
	});
	currentWeekWorkMTbar.getCombo("professional").attachEvent("onChange", function(){
		currentWeekProfessional = currentWeekWorkMTbar.getCombo('professional').getActualValue();
		if(currentWeekWorkMForm){ currentWeekWorkMForm.reset();}
		if(initFlag){
			currentWeekWorkMForm.load(selvletUrl+"?ac=loadWeekWorkM&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
		}
	});
	currentWeekWorkMTbar.getCombo("weekPeriod").readonly(true);
	weekWorkManagementService.getWeekPeriod(function (data)
	{
    	var returnText=eval(data);
		 if(returnText!=null&&returnText!="")
		 {
		 	currentWeekWorkMTbar.getCombo("weekPeriod").addOption(returnText);
		 	currentWeekWorkMTbar.getCombo("weekPeriod").selectOption(0);
			currentWeekWork = currentWeekWorkMTbar.getCombo('weekPeriod').getActualValue();
		}
   });
	currentWeekWorkMTbar.getCombo("weekPeriod").attachEvent("onChange", function(){
		currentWeekWork = currentWeekWorkMTbar.getCombo('weekPeriod').getActualValue();
		if(currentWeekWorkMForm){ currentWeekWorkMForm.reset();}
		if(initFlag){
			currentWeekWorkMForm.load(selvletUrl+"?ac=loadWeekWorkM&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
		}
	});
	currentWeekWorkMTbar.attachEvent('onClick', currentWeekWorkMTbarHandler);
	var str = [
		{ type:"hidden" , name:"uids", label:"主键：", width:"120", labelWidth:"70",labelAlign:"right", position:""  },
		{ type:"hidden" , name:"PROFESSIONAL_ID", label:"专业：", width:"120", labelWidth:"70",labelAlign:"right", position:""  },
		{ type:"hidden" , name:"WEEK_PERIOD", label:"周次：", width:"120", labelWidth:"70",labelAlign:"right", position:""  },
		{ type:"hidden" , name:"PID", label:"PID：",maxLength:20, width:"120", labelWidth:"70",labelAlign:"right", position:""  },
		{ type:"input" , name:"LAST_WEEK_WORK", readonly:true ,rows:"5" ,label:"上周工作完成情况分析", width:530, labelWidth:"250", labelHeight:"21", inputWidth:"530", inputHeight:"98", labelLeft:"0", labelTop:"-10", inputLeft:"-0", inputTop:"5", position:"absolute"  },
		{ type:"input" , name:"CURRENT_WEEK_WORK", readonly:true ,rows:"5" ,label:"本周工作重点、需协助事项及存在困难", width:533, labelWidth:"250", labelHeight:"21", inputWidth:"533", inputHeight:"98", labelLeft:"530", labelTop:"-10", inputLeft:"530", inputTop:"5", position:"absolute"  }
	];

	currentWeekWorkMForm=b.attachForm(str);
	dhtmlxEvent(currentWeekWorkMForm.getInput("LAST_WEEK_WORK"), "focus", function() {
		currentWeekWorkMForm.blur();
		return false;
	})
	dhtmlxEvent(currentWeekWorkMForm.getInput("CURRENT_WEEK_WORK"), "focus", function() {
		currentWeekWorkMForm.blur();
		return false;
	})
	var currentWeekWorkMDp = new dataProcessor(selvletUrl+"?ac=loadWeekWorkM");
	currentWeekWorkMDp.init(currentWeekWorkMForm);
	currentWeekWorkMDp.setUpdateMode("off")
	
	currentWeekWorkMForm.attachEvent("onXLE", function (){
		currentWeekWorkMainId = currentWeekWorkMForm.getItemValue("uids");
		var businessType='weekWorkFile';
		var businessId=currentWeekWorkMainId;
		var downloadStr = "";
		var count = 0;
		DWREngine.setAsync(false);
		db2Json.selectData(
				"select count(file_lsh) as num from sgcc_attach_list where transaction_id='"
						+ businessId
						+ "' and transaction_type='" + businessType
						+ "'", function(jsonData) {
					var list = eval(jsonData);
					if (list != null) {
						count = list[0].num;
					}
				});
		DWREngine.setAsync(true);
		downloadStr = "相关文件(" + count + ")";
		var editable=true;
		currentWeekWorkMTbar.setItemText("attachListFiles",'<a class="weekfile" href="javascript:showUploadWin(\''+ businessType + '\', ' + editable + ', \'' + businessId
				+ '\')">' + downloadStr + '</a>');
		currentWeekWorkDGrid.clearAndLoad(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
		weekWorkManagementService.getLastWeekPeriod(currentPid,currentWeekProfessional,currentWeekWork,function (data){
			var returnText=data;
			 if(returnText!=null)
			 {
			 	lastWeekWorkMainId=returnText.uids;
			 	lastWeekWorkDTbar.getCombo("weekPeriod").setComboValue(returnText.weekPeriod);
				lastWeekWork = lastWeekWorkDTbar.getCombo('weekPeriod').getActualValue();
			}else{
				lastWeekWorkDTbar.getCombo("weekPeriod").setComboValue("");
				lastWeekWork = lastWeekWorkDTbar.getCombo('weekPeriod').getActualValue();
			}
		 	lastWeekWorkDTbar.getCombo("professional").setComboValue(currentWeekProfessional);
			lastWeekProfessional=currentWeekProfessional;
			if(currentWeekWorkMainId!=null&&currentWeekWorkMainId.length>0){
				lastWeekWorkDGrid.clearAndLoad(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+lastWeekWork+"&weekProfessional="+lastWeekProfessional);
			}else{
				lastWeekWorkDGrid.clearAndLoad(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&existCurrentWeekWork=false&weekPeriod="+lastWeekWork+"&weekProfessional="+lastWeekProfessional);
			}
		})
	});
	currentWeekWorkMForm.attachEvent("onAfterReset", function (){
		currentWeekWorkMForm.setItemValue("uids",""); 
		currentWeekWorkMForm.setItemValue("PROFESSIONAL_ID",""); 
		currentWeekWorkMForm.setItemValue("WEEK_PERIOD",""); 
		currentWeekWorkMForm.setItemValue("PID",""); 
		currentWeekWorkMForm.setItemValue("LAST_WEEK_WORK",""); 
		currentWeekWorkMForm.setItemValue("CURRENT_WEEK_WORK",""); 
	});
	function currentWeekWorkMTbarHandler(itemId){
		if(itemId == 'add'){
			createWin(itemId);
		}else if(itemId == 'edit'){
			createWin(itemId);
		}
	}
	
	
	var c=viewport.cells('c');
	c.hideHeader();
	currentWeekWorkDTbar = c.attachToolbar();
	var tbStr = [{
				id : 'add',
				text:"新增"
			}, {
				type : 'separator'
			}, {
				id : 'save'
			}, {
				type : 'separator'
			}, {
				id : 'delete'
			}];
	currentWeekWorkDTbar.render(tbStr);
	currentWeekWorkDTbar.attachEvent('onClick', currentWeekWorkDTbarHandler);
	
	currentWeekWorkDGrid = c.attachGrid();
	currentWeekWorkDGrid.setImagePath('/dhx/codebase/imgs/');
	currentWeekWorkDGrid.setHeader(["uids","序号","落实事项","责任人","计划进度","完成情况描述","主记录id"]);
	currentWeekWorkDGrid.setColTypes("ro,cntr,ed,coro,ed,ed,ro");
	currentWeekWorkDGrid.setColAlign('left,center,left,left,left,left,left');
	currentWeekWorkDGrid.setColSorting('str,str,str,str,str,str,str');
	currentWeekWorkDGrid.setInitWidths("0,50,300,80,80,*,0");
	currentWeekWorkDGrid.setColumnHidden(0,true);
	currentWeekWorkDGrid.setColumnHidden(6,true);
	currentWeekWorkDGrid.init();
	currentWeekWorkDGrid.attachEvent('onEditCell',
	    function(stage, rId, cInd, nValue, oValue) {
	        if (cInd == '3') return false;
	        else return true;
	    });
	currentWeekWorkDGrid.attachFooter(["<div id='grid_currentWeekWorkD' style='width:100%;height:100%'></div>", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan"], ['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
    currentWeekWorkDGrid.enablePaging(true, 15, 3, 'grid_currentWeekWorkD');
    currentWeekWorkDGrid.setPagingSkin('toolbar', 'dhx_skyblue');
	currentWeekWorkDp = new dataProcessor(selvletUrl+"?ac=loadWeekWorkD");
	currentWeekWorkDp.setUpdateMode('off');
	currentWeekWorkDp.init(currentWeekWorkDGrid);
	currentWeekWorkDp.attachEvent("onAfterUpdateFinish",function(){
		dhxMessageWin("保存成功！","","","","",function(){
			currentWeekWorkDGrid.clearAndLoad(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);		
		});
	});
	
	function currentWeekWorkDTbarHandler(itemId){
		if(itemId == 'add'){
			weekWorkManagementService.getUuidValue(function (data)
			{
		    	var newId=data;
	  			 if(newId!=null&&newId!="")
	  			 {
	  			 	currentWeekWorkDGrid.addRow(newId, [newId,"","",USERID,"","",currentWeekWorkMainId ], 0);
	  			 	currentWeekWorkDGrid.setRowColor(currentWeekWorkDGrid.getRowId(0),"#F0F8FF");
	  			}
	       });
		}else if(itemId == 'delete'){
			var rowId = currentWeekWorkDGrid.getSelectedRowId();
			if(rowId) {
				currentWeekWorkDGrid.deleteRow(rowId);
				dhxConfirmWin("您选择了删除该条信息,删除后将不可恢复，确定要删除?",null,null,null,null,function (){
					currentWeekWorkDp.sendData();
					},function (){
						currentWeekWorkDGrid.clearAndLoad(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);		
				});
			}
		}else{
			currentWeekWorkDp.setVerificator(4,ckWorkSchedule);
			currentWeekWorkDp.sendData();
		}
	}
}
function ckWorkSchedule(value,id,ind){
	if(ckLengthOnSave(value,"",20)){
		return true;
	}else{
		return false;
	}
}
//新增与修改的form
	function createWin(btnType){
		var windows = new dhtmlXWindows();
		win_pass = windows.createWindow('win_pass', 0, 0, 700, 500);
		
		win_pass.center();
		//win_pass.denyMove();//不允许移动
		win_pass.denyResize();//不允许最大化、最小化
		win_pass.setModal(1);
		win_pass.button('park').hide();
		win_pass.button('minmax1').hide();
		
	var str = [{
        				type: "hidden",
        				name: "uids",
        				label: "uids",
				        position: ""
    
				},
				{
				    type: "fieldset",
				    label: "周工作事项基本信息",
				    width:"650",
				    position: "",
				    list: [
					{ type:"combo" , name:"PROFESSIONAL_ID", label:"专业：",width:"120", labelWidth:"75",labelAlign:"right",  position:""},
					{ type: "newcolumn",position: "" },
				    { type:"combo" , name:"WEEK_PERIOD", label:"周次选择：",width:"180", labelWidth:"75",labelAlign:"right",  position:""}
				]
				},
				{
				    type: "fieldset",
				    label: "周工作事项内容",
				    width:"650",
				    position: "",
				    list: [
				    { type:"hidden" , name:"PID", label:"PID：",maxLength:20, width:"120", labelWidth:"70",labelAlign:"right", position:""  },
					{ type:"input" , name:"LAST_WEEK_WORK", rows:"5" ,label:"上周工作完成情况分析", width:620, labelWidth:"250", labelHeight:"21", inputHeight:"118",position:""  },
					{ type:"input" , name:"CURRENT_WEEK_WORK", rows:"5" ,label:"本周工作重点、需协助事项及存在困难", width:620, labelWidth:"250", labelHeight:"21", inputHeight:"118",position:""  }
				]
				}
				
				];
		weekWorkForm = win_pass.attachForm(str);
		
		var weekWorkForm_dp = new dataProcessor(selvletUrl+"?ac=loadWeekWorkM&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
		weekWorkForm_dp.init(weekWorkForm);
		
		weekWorkForm_dp.setUpdateMode("off");
		weekWorkFormBar = win_pass.attachToolbar("","bottom");
		weekWorkFormBar.render([{id:'save',text:'保存'},{id:'cancel',text:'取消',img:'no.png'}]);
		weekWorkFormBar.setItemCenter();
		var weekPeriodCombox = weekWorkForm.getCombo("WEEK_PERIOD");
		var professionalCombox = weekWorkForm.getCombo("PROFESSIONAL_ID");
		professionalCombox.readonly(true,true);
		professionalCombox.loadXML(selvletUrl+"?ac=loadProfessional&userid="+currentUserid+"&pid="+currentPid,function(){
			if(btnType=="add"){
				professionalCombox.setComboValue(currentWeekProfessional);
			}
		});
		professionalCombox.attachEvent("onChange", function(){
			currentWeekProfessional = professionalCombox.getActualValue();
			DWREngine.setAsync(false);
			weekWorkManagementService.getWeekPeriod(function (data)
			{
		    	var returnText=eval(data);
				 if(returnText!=null&&returnText!="")
				 {
				  		var weeksql = "select WEEK_PERIOD from WEEKWORK_MANAGEMENT_M  where pid='"+currentPid+"' and PROFESSIONAL_ID='"+currentWeekProfessional+"'";
				  		weeksql += " order by WEEK_PERIOD desc";
				  		db2Json.selectSimpleData(weeksql, function(dat){
							var data1 = eval(dat);
							if(dat!='[]'){
								for (j=0; j<data1.length; j++) {
									for (i=0; i<returnText.length; i++) {
										if(data1[j][0] == returnText[i][0]) {
											if(btnType=="add"){
												returnText.splice(i, 1);
											}else if(returnText[i][0]!=currentWeekWork){
												returnText.splice(i, 1);
											}
										}
									}
								}
							}
						});
						weekPeriodCombox.clearAll(true);
						weekPeriodCombox.addOption(returnText);
						weekPeriodCombox.selectOption(0);
				}
		   });
		});
		weekPeriodCombox.readonly(true,true);
			
	   DWREngine.setAsync(true);
		switch(btnType){
					case "add":
						win_pass.setText('新增周工作事项分析');
						weekWorkForm.setItemValue("PID", currentPid);
					break;
					case "edit":
						win_pass.setText('修改周工作事项分析');
						//加载form
							weekWorkForm.load(selvletUrl+"?ac=loadWeekWorkM&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
					break;
				}

				//form上的按钮事件
				weekWorkFormBar.attachEvent("onClick",function(id){
					weekWorkForm.blur();//form必须先失去焦点再提交，不然就会出现第一次点保存无效
					var last_week_work = weekWorkForm.getItemValue("LAST_WEEK_WORK");
					switch(id){
						case "save":
							//保存前做编码唯一验证
							if(last_week_work == '' || last_week_work == null){
								dhxMessageWin("上周工作完成情况分析不能为空！");
								return false;
							}
									weekWorkForm.save();
//									weekWorkForm_dp.sendData();
									//form操作后的事件
									weekWorkForm_dp.attachEvent("onAfterUpdate",function(sid,action,tid,xml_node){
									   //提示操作成功
										var showStr='';
										currentWeekWork=weekWorkForm.getCombo('WEEK_PERIOD').getActualValue();
										currentWeekProfessional=weekWorkForm.getCombo('PROFESSIONAL_ID').getActualValue();
										if(btnType == 'add'){
											showStr = '新增成功！';
										}else if(btnType == 'edit'){
											showStr = '修改成功！';
										}
										dhxMessageWin(showStr);
										currentWeekWorkMForm.load(selvletUrl+"?ac=loadWeekWorkM&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
										currentWeekWorkMTbar.getCombo("weekPeriod").setComboValue(currentWeekWork);
										currentWeekWorkMTbar.getCombo("professional").setComboValue(currentWeekProfessional);
										win_pass.close();
									   return true;
									});
						break;
						case "cancel":
							win_pass.close();
						break;
					}
									
				});
	}
	/*附件上传方法要作一个全局方法*/
	function showUploadWin(businessType, editable, businessId) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
		return;
	}
	var fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin1 = new Ext.Window({
				title : '周工作相关文件',
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin1.show();
	fileWin1.on("close", function() {
				currentWeekWorkMForm.load(selvletUrl+"?ac=loadWeekWorkM&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
			});
}