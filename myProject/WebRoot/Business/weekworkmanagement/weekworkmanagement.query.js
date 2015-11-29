var currentWeekWorkDGrid,currentWeekWorkDTbar,currentWeekWorkDDp,currentWeekWorkMTbar;
var currentWeekWorkMForm;
var currentWeekWork=null;
var currentWeekProfessional=null;
var lastWeekWork=null;
var lastWeekProfessional=null;
var selvletUrl = CONTEXT_PATH + "/servlet/WeekWorkManagementServlet";
var currentPid=CURRENTAPPID;
var initFlag=false;
function pageOnload(){
	dhtmlx.image_path='/dhx/codebase/imgs/';
	var viewport=new dhtmlXLayoutObject(document.body, '2E');
	var a = viewport.cells('a');
	a.hideHeader();
	a.setHeight(170)
	currentWeekWorkMTbar = a.attachToolbar();
	var tbStr = [{
		        id:"weekWork",
				type : 'label',
				text : '周事项落实情况查询'
			}, {
				type : 'separator'
			}, {
				id : 'attachListFiles',
				type:'label',
				text:'<a class="weekfile" href="javascript:showUploadWin(\'weekWorkFile\', false, \'\')">相关文件(0)</a>'
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
	currentWeekWorkMTbar.getCombo("professional").loadXML(selvletUrl+"?ac=loadProfessional&pid="+currentPid,function(){
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
		if(currentWeekWorkMForm) currentWeekWorkMForm.reset();
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
		if(currentWeekWorkMForm) currentWeekWorkMForm.reset();
		if(initFlag){
			currentWeekWorkMForm.load(selvletUrl+"?ac=loadWeekWorkM&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
		}
	});
	var str = [
		{ type:"hidden" , name:"uids", label:"主键：", width:"120", labelWidth:"70",labelAlign:"right", position:""  },
		{ type:"hidden" , name:"PROFESSIONAL_ID", label:"专业：", width:"120", labelWidth:"70",labelAlign:"right", position:""  },
		{ type:"hidden" , name:"WEEK_PERIOD", label:"周次：", width:"120", labelWidth:"70",labelAlign:"right", position:""  },
		{ type:"hidden" , name:"PID", label:"PID：",maxLength:20, width:"120", labelWidth:"70",labelAlign:"right", position:""  },
		{ type:"input" , name:"LAST_WEEK_WORK", readonly:true ,rows:"5" ,label:"上周工作完成情况分析", width:530, labelWidth:"250", labelHeight:"21", inputWidth:"530", inputHeight:"118", labelLeft:"0", labelTop:"-10", inputLeft:"-0", inputTop:"5", position:"absolute"  },
		{ type:"input" , name:"CURRENT_WEEK_WORK", readonly:true ,rows:"5" ,label:"本周工作重点、需协助事项及存在困难", width:533, labelWidth:"250", labelHeight:"21", inputWidth:"533", inputHeight:"118", labelLeft:"530", labelTop:"-10", inputLeft:"530", inputTop:"5", position:"absolute"  }
	];

	currentWeekWorkMForm=a.attachForm(str);
	dhtmlxEvent(currentWeekWorkMForm.getInput("LAST_WEEK_WORK"), "focus", function() {
		currentWeekWorkMForm.blur();
		return false;
	})
	dhtmlxEvent(currentWeekWorkMForm.getInput("CURRENT_WEEK_WORK"), "focus", function() {
		currentWeekWorkMForm.blur();
		return false;
	})
	currentWeekWorkMForm.attachEvent("onAfterReset", function (){
		currentWeekWorkMForm.setItemValue("uids",""); 
		currentWeekWorkMForm.setItemValue("PROFESSIONAL_ID",""); 
		currentWeekWorkMForm.setItemValue("WEEK_PERIOD",""); 
		currentWeekWorkMForm.setItemValue("PID",""); 
		currentWeekWorkMForm.setItemValue("LAST_WEEK_WORK",""); 
		currentWeekWorkMForm.setItemValue("CURRENT_WEEK_WORK",""); 
	});
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
		var editable=false;
		currentWeekWorkMTbar.setItemText("attachListFiles",'<a class="weekfile" href="javascript:showUploadWin(\''+ businessType + '\', ' + editable + ', \'' + businessId
				+ '\')">' + downloadStr + '</a>');
		currentWeekWorkDGrid.clearAndLoad(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
	});
	
	var b=viewport.cells('b');
	b.hideHeader();
	currentWeekWorkDGrid = b.attachGrid();
	currentWeekWorkDGrid.setImagePath('/dhx/codebase/imgs/');
	currentWeekWorkDGrid.setHeader(["uids","序号","落实事项","责任人","交付进度","完成情况描述","主记录id"]);
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
	currentWeekWorkDp = new dataProcessor(selvletUrl+"?ac=loadWeekWorkD&pid="+currentPid+"&weekPeriod="+currentWeekWork+"&weekProfessional="+currentWeekProfessional);
	currentWeekWorkDp.setUpdateMode('off');
	currentWeekWorkDp.init(currentWeekWorkDGrid);
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