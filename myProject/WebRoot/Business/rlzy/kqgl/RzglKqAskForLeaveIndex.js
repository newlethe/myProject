var controlUrl = CONTEXT_PATH +"/servlet/RlzyServlet?ac=getAskForLeave";
var baseServlet=CONTEXT_PATH +"/servlet/RlzyServlet";
var pid = CURRENTAPPID;
var askForLeaveGrid,askForLeaveDp,askForLeaveToolbar;
var params="1=1";
if(powerLevel=='0'){
	params="EMPLOYEE_ID='"+USERID+"'";
}
var readHtml ="<font color='red'>*</font>";
var hasFlow=false;//页面是否配置流程
dwr.engine.setAsync(false);
var rtnState='';
rzglMainMgm.hasContainsFlow(USERUNITID,MODID,function(rtn){
	if(rtn=='true'){
		hasFlow=true;
	}else if(rtn=='false'){
		hasFlow=false;
	}
    rtnState=rtn;
})
if(bpmMode==1){
	hasFlow=true;
}
dwr.engine.setAsync(true);
function buildInterface(){
	dhtmlx.image_path='/dhx/codebase/imgs/';

	var main_layout = new dhtmlXLayoutObject(document.body, '1C');
	
	var a = main_layout.cells('a');
	a.setText('请假单');
	a.setWidth('0');
	
	askForLeaveGrid = a.attachGrid();	
	askForLeaveGrid.setHeader(["uids","PID","请假人","部门","请假原因","请假类型","批准人","预计请假时间","预计结束时间","实际请假时间","实际结束时间","审批状态"]);
	askForLeaveGrid.setColumnIds("UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,TYPE,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE");
	askForLeaveGrid.setColTypes("ro,ro,coro,coro,txt,coro,coro,dhxCalendar,dhxCalendar,dhxCalendar,dhxCalendar,coro");
	
	askForLeaveGrid.setColAlign('left,left,left,left,left,left,left,center,center,center,center,left');
	askForLeaveGrid.setColSorting('str,str,str,str,str,str,str,dhxCalendar,dhxCalendar,dhxCalendar,dhxCalendar,str');
	askForLeaveGrid.setInitWidths("*,*,*,*,*,*,*,*,*,*,*,*");
	askForLeaveGrid.setColumnHidden(0,true);
	askForLeaveGrid.setColumnHidden(1,true);
	if(!hasFlow){
	   // askForLeaveGrid.setColumnHidden(11,true);
	}else{
		//askForLeaveGrid.setColumnHidden(6,true);
	}
	askForLeaveGrid.enableValidation(true, false);
	askForLeaveGrid.setColValidators(',,,,,,,,,,,');
	askForLeaveGrid.setDateFormat('%Y-%m-%d %H:%i:%s',null, 7);
	askForLeaveGrid.setDateFormat('%Y-%m-%d %H:%i:%s',null, 8);
	askForLeaveGrid.setDateFormat('%Y-%m-%d %H:%i:%s',null, 9);
	askForLeaveGrid.setDateFormat('%Y-%m-%d %H:%i:%s',null, 10);
	askForLeaveDp = new dataProcessor(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
	askForLeaveDp.setUpdateMode('off');
	askForLeaveDp.init(askForLeaveGrid);
	
	askForLeaveDp.attachFunctions("",function(){
		askForLeaveGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
	});
	
	askForLeaveGrid.init();
	askForLeaveGrid.attachFooter(["<div id='askForLeaveGrid_recinfoArea' style='width:100%;height:100%'></div>", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan"], ['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
	askForLeaveGrid.enablePaging(true,20,5,"askForLeaveGrid_recinfoArea");
	askForLeaveGrid.setPagingSkin('toolbar','dhx_skyblue');
	askForLeaveGrid.load(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""), 'xml');
	//事件部分 
	askForLeaveGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){
		return false;
	});
	askForLeaveToolbar = a.attachToolbar();
	var tbar =[]
	if(powerLevel=='0'){
		tbar = [{id:'add',text:'新增'},
		{id:'edit',text:'修改'},
		{id:'delete',text:'删除'},
		{
			type: 'button',
			id: 'exp',
			img:'excel_exp.png',
			text: '导出',
			func: function(){
				  askForLeaveGrid.toExcel(CONTEXT_PATH+"/servlet/DhtmlxExcelGeneratorServlet");
			}
		}];
	}else{
		tbar = [{id:'add',text:'新增'},
		{id:'edit',text:'修改'},
		{id:'delete',text:'删除'},
				{
			type: 'label',
			text: '请假人:'
		},
		{
			type: 'input',
			id : 'userInput'
		},
				{
			type: 'label',
			text: '部门:'
		},
		{
			type: 'combo',
			id : 'dept',
			data:baseServlet+'?ac=loadDeptCombo'
		},	{
				type: 'button',
				id: 'query',
				img:'query.png',
				text: '查询'
			},	
		{
			type: 'button',
			id: 'exp',
			img:'excel_exp.png',
			text: '导出',
			func: function(){
				  askForLeaveGrid.toExcel(CONTEXT_PATH+"/servlet/DhtmlxExcelGeneratorServlet");
			}
		}];
	}
	askForLeaveToolbar.render(tbar);
	if(powerLevel=='2'){
		askForLeaveToolbar.hideItem("add");
		askForLeaveToolbar.hideItem("edit");
		askForLeaveToolbar.hideItem("delete");
	}
	askForLeaveToolbar.attachEvent('onClick',function(id){
		var checked = askForLeaveGrid.getCheckedRows(askForLeaveGrid.getColIndexById("UIDS"));
		if(id == 'add'){
			rzglMainMgm.getUuidValue(function (data){
		    	var newId=data;
	  			 if(newId!=null&&newId!="")
	  			 {
	  			 	showAskForLeaveWin(newId,true);
	  			}
	       });
		}else if(id == 'delete'){
			var rowId = askForLeaveGrid.getSelectedRowId();
			if(rowId) {
				askForLeaveGrid.deleteRow(rowId);
				dhxConfirmWin("删除后将不可恢复，确定要删除?",null,null,null,null,function (){
					askForLeaveDp.sendData();
					askForLeaveGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
				},function (){
						askForLeaveGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
				});
			}
			
		}else if(id == 'edit'){
			var rowId = askForLeaveGrid.getSelectedRowId();
			if(rowId&&rowId != null && rowId != ''){
				showAskForLeaveWin(rowId,false);
			}else{
				dhxMessageWin('请先选择一条记录。');
			}
			
		}else if(id == 'query'){
			var dept = this.getCombo('dept').getActualValue();
			var userName = this.getValue("userInput");;
			askForLeaveGrid.clearAndLoad(controlUrl+"&params="+params+"&dept="+dept+"&userName="+encodeURI(encodeURI(userName)));
		}
	});
	if((isFlwView==true)){
    	askForLeaveToolbar.disableItem("add");
    	askForLeaveToolbar.disableItem("edit");
        askForLeaveToolbar.disableItem("delete");
        askForLeaveToolbar.disableItem("exp");
    }
	askForLeaveGrid.attachEvent('onXLE', function(grid_obj, count) {
		if(isFlwTask==true&&count>0){
            askForLeaveToolbar.disableItem("add");
            askForLeaveToolbar.disableItem("delete");
            askForLeaveToolbar.disableItem("exp");
        }
	});
	//选中  askForLeaveGrid 的行后触发 
	askForLeaveGrid.attachEvent('onRowSelect', function(id, ind) {
		var billState=askForLeaveGrid.cells(id,11).getValue();
		if(isFlwTask==true){
            if(billState=='1'){
                askForLeaveToolbar.disableItem("edit");
                askForLeaveToolbar.disableItem("delete");
            }else{
               askForLeaveToolbar.ag("edit");
                askForLeaveToolbar.ag("delete");
            }
        }else{
			if(hasFlow){
				if(billState=='0'){
	                overtimeToolbar.ag("edit");
	                overtimeToolbar.ag("delete");//取消禁用
	            }else{
	                overtimeToolbar.disableItem("edit");
	                overtimeToolbar.disableItem("delete");
	            }
        	}
        }
        //流程中，已经添加过一条数据后，禁用新增删除按钮
        if((isFlwTask==true)){
        	askForLeaveToolbar.disableItem("add");
            askForLeaveToolbar.disableItem("delete");
            askForLeaveToolbar.disableItem("exp");
        }
        if((isFlwView==true)){
        	askForLeaveToolbar.disableItem("add");
        	askForLeaveToolbar.disableItem("edit");
            askForLeaveToolbar.disableItem("delete");
            askForLeaveToolbar.disableItem("exp");
        }
		
	});
}
function showAskForLeaveWin(uid,bol){
		if(bol !== true){
			if(uid){}else{dhxMessageWin("请先选择一条记录");return false;}
		}
		var windows = new getWin();
		var window_1 = windows.createWindow('window_1', 0, 0, 760, 400);
		window_1.setText('新增请假单');
		window_1.setModal(1);
		window_1.centerOnScreen();
		window_1.button('park').hide();
		window_1.button('minmax1').hide();
		var str = [
			{ type:"fieldset" , name:"f1", label:"请假基本信息", width:"720", position:"", list:[
			{ type:"combo" , name:"EMPLOYEE_ID", label:"请假人：",inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:hasFlow?"combo":"hidden" , name:"BILL_STATE", label:"审批状态：",value:hasFlow?"0":"1",inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:!hasFlow?"input":"hidden" , name:"APPROVER", label:"批准人：", inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:"input" , name:"REASON", label:"请假原因"+readHtml+"：", validate:"NotEmpty", rows:"4",inputWidth:"240", labelWidth:"80",labelAlign:"right", position:""  },
			{ type:"hidden" , name:"UIDS",value:uid, position:""  },
			{ type:"newcolumn" , position:""  },
			{ type:"combo" , name:"DEPT_ID", label:"部门：",inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:"combo" , name:"TYPE", label:"请假类型"+readHtml+"：", validate:"NotEmpty",inputWidth:"240", labelWidth:"80",labelAlign:"right", position:""  },
			{ type:"hidden" , name:"PID",value:pid, position:""  }
			]  },
			{ type:"fieldset" , name:"f2", label:"预计请假情况", width:"720", position:"", list:[
			{ type:"calendar" , name:"PLAN_START_DATE", label:"预计开始请假时间"+readHtml+"：", validate:"NotEmpty",dateFormat: "%Y-%m-%d %H:%i:%s",enableTime: true,readonly:true,inputWidth:"180", labelWidth:"140",labelAlign:"right",position:""  },
			{ type:"newcolumn" , position:""  },
			{ type:"calendar" , name:"PLAN_FINISH_DATE", label:"预计结束请假时间"+readHtml+"：", validate:"NotEmpty",dateFormat: "%Y-%m-%d %H:%i:%s",enableTime: true,readonly:true,inputWidth:"180", labelWidth:"140",labelAlign:"right",position:""  }
			]  },
			{ type:"fieldset" , name:"f3", label:"实际请假情况", width:"720", position:"", list:[
			{ type:"calendar" , name:"ACTUAL_START_DATE", label:"实际开始请假时间"+readHtml+"：", validate:"NotEmpty",dateFormat: "%Y-%m-%d %H:%i:%s",enableTime: true,readonly:true,inputWidth:"180", labelWidth:"140",labelAlign:"right",position:""  },
			{ type:"newcolumn" , position:""  },
			{ type:"calendar" , name:"ACTUAL_FINISH_DATE", label:"实际结束请假时间"+readHtml+"：", validate:"NotEmpty",dateFormat: "%Y-%m-%d %H:%i:%s",enableTime: true,readonly:true,inputWidth:"180", labelWidth:"140",labelAlign:"right",position:""  }
			]  }
		];
	
		var askForLeave_form = window_1.attachForm(str);
		var form_dp = new dataProcessor(baseServlet+'?ac=loadAskForLeaveForm');
		form_dp.init(askForLeave_form);
		form_dp.setUpdateMode("off");
		var addFormToolbar = window_1.attachToolbar("","bottom");
		addFormToolbar.render([{id:'save',text:'保存'},{id:'cancel',text:'取消',img:'no.png'}]);
		addFormToolbar.setItemCenter();
		var employeeIdCombo = askForLeave_form.getCombo("EMPLOYEE_ID");
		employeeIdCombo.loadXML(baseServlet+"?ac=loadUserComo",function (){
			if(bol == true){
				employeeIdCombo.setComboValue(USERID);
				askForLeave_form.disableItem("EMPLOYEE_ID")
			}
		});
		var deptIddCombo = askForLeave_form.getCombo("DEPT_ID");
		deptIddCombo.loadXML(baseServlet+"?ac=loadDeptCombo",function (){
			if(bol == true){
				deptIddCombo.setComboValue(USERDEPTID);
				askForLeave_form.disableItem("DEPT_ID")
			}
		});
		var typeCombo = askForLeave_form.getCombo("TYPE");
		typeCombo.loadXML(baseServlet+"?ac=loadAskForLeaveTypeComo",function (){
		});
		if(hasFlow){
		    var billStateCombo = askForLeave_form.getCombo("BILL_STATE");
			billStateCombo.loadXML(baseServlet+"?ac=loadBillStateComo",function (){
				if(bol == true){
					billStateCombo.setComboValue("0")
					askForLeave_form.disableItem("BILL_STATE")
				}
			});
		}
		askForLeave_form.attachEvent("onXLE", function (){
		     askForLeave_form.disableItem("EMPLOYEE_ID")
			askForLeave_form.disableItem("DEPT_ID")
		     if(hasFlow){
		    	var billStateCombo = askForLeave_form.getCombo("BILL_STATE");
				askForLeave_form.disableItem("BILL_STATE")
			  }
		});
		askForLeave_form.attachEvent("onChange", function (id, value){
		     if(id=='PLAN_START_DATE'){
		     	if(value){
		     		askForLeave_form.setFormData({ACTUAL_START_DATE:value});
		     	}
		     }else if(id=='PLAN_FINISH_DATE'){
		     	if(value){
		     		askForLeave_form.setFormData({ACTUAL_FINISH_DATE:value});
		     	}
		     }
		});
		//新增还是编辑 
		if(bol == false){
			window_1.setText('编辑请假单');
			askForLeave_form.loadAfterAll(baseServlet+"?ac=loadAskForLeaveForm&id="+uid);
		}
		if(stepType=='1'){
			askForLeave_form.disableItem("ACTUAL_START_DATE");
			askForLeave_form.disableItem("ACTUAL_FINISH_DATE");
		}else if(stepType=='2'){
			askForLeave_form.disableItem("REASON");
			askForLeave_form.disableItem("TYPE");
			askForLeave_form.disableItem("PLAN_START_DATE");
			askForLeave_form.disableItem("PLAN_FINISH_DATE");
		}
		addFormToolbar.attachEvent('onClick', function(btnId) {
			askForLeave_form.blur();
			if(btnId =='save'){
				if(askForLeave_form.validate()){
//					askForLeave_form.save();
					form_dp.sendData();
				}else{
					dhxMessageWin("有必填项未填写，请填写完整再保存。");
				}
			}else{
				window_1.close();
			}
		});
		form_dp.attachFunctions("", function(){
			window_1.close();
			if(isFlwTask){
				var paramObject=new Object();
	        	paramObject.masterid=uid;
	        	masterid=uid;
	        	parent.saveBpmIntParamObj(paramObject);
			}
			if(!hasFlow){
				rzglMainMgm.doAskForLeaveInfo(uid,function (){
	       		});
			}
			askForLeaveGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
		});
	}
dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器