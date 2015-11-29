var controlUrl = CONTEXT_PATH +"/servlet/RlzyServlet?ac=getOvertime";
var baseServlet=CONTEXT_PATH +"/servlet/RlzyServlet";
var pid = CURRENTAPPID;
var overtimeGrid,overtimeDp,overtimeToolbar;
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
	a.setText('加班单');
	a.setWidth('0');
	
	overtimeGrid = a.attachGrid();	
	overtimeGrid.setHeader(["uids","PID","加班人","部门","加班工作","加班时长","审核人","加班开始时间","加班结束时间","审批状态"]);
	overtimeGrid.setColumnIds("UIDS,PID,EMPLOYEE_ID,DEPT_ID,WORK_DESCRIBE,HOURS,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,BILL_STATE");
	overtimeGrid.setColTypes("ro,ro,coro,coro,txt,ed,coro,dhxCalendar,dhxCalendar,coro");
	
	overtimeGrid.setColAlign('left,left,left,left,left,left,left,center,center,left');
	overtimeGrid.setColSorting('str,str,str,str,str,str,str,dhxCalendar,dhxCalendar,str');
	overtimeGrid.setInitWidths("*,*,*,*,*,*,*,*,*,*");
	overtimeGrid.setColumnHidden(0,true);
	overtimeGrid.setColumnHidden(1,true);
	if(!hasFlow){
	   // overtimeGrid.setColumnHidden(9,true);
	}else{
		//overtimeGrid.setColumnHidden(6,true);
	}
	overtimeGrid.enableValidation(true, false);
	overtimeGrid.setColValidators(',,,,,,,,,,,');
	overtimeGrid.setDateFormat('%Y-%m-%d %H:%i:%s',null, 7);
	overtimeGrid.setDateFormat('%Y-%m-%d %H:%i:%s',null, 8);
	overtimeDp = new dataProcessor(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
	overtimeDp.setUpdateMode('off');
	overtimeDp.init(overtimeGrid);
	
	overtimeDp.attachFunctions("",function(){
		overtimeGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
	});
	
	overtimeGrid.init();
	overtimeGrid.attachFooter(["<div id='overtimeGrid_recinfoArea' style='width:100%;height:100%'></div>", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan"], ['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
	overtimeGrid.enablePaging(true,20,5,"overtimeGrid_recinfoArea");
	overtimeGrid.setPagingSkin('toolbar','dhx_skyblue');
	overtimeGrid.load(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""), 'xml');
	//事件部分 
	overtimeGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){
		return false;
	});
	overtimeToolbar = a.attachToolbar();
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
				  overtimeGrid.toExcel(CONTEXT_PATH+"/servlet/DhtmlxExcelGeneratorServlet");
			}
		}];
	}else{
		tbar = [{id:'add',text:'新增'},
		{id:'edit',text:'修改'},
		{id:'delete',text:'删除'},
				{
			type: 'label',
			text: '加班人:'
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
				  overtimeGrid.toExcel(CONTEXT_PATH+"/servlet/DhtmlxExcelGeneratorServlet");
			}
		}];
	}
	overtimeToolbar.render(tbar);
	if(powerLevel=='2'){
		overtimeToolbar.hideItem("add");
		overtimeToolbar.hideItem("edit");
		overtimeToolbar.hideItem("delete");
	}
	overtimeToolbar.attachEvent('onClick',function(id){
		var checked = overtimeGrid.getCheckedRows(overtimeGrid.getColIndexById("UIDS"));
		if(id == 'add'){
			rzglMainMgm.getUuidValue(function (data){
		    	var newId=data;
	  			 if(newId!=null&&newId!="")
	  			 {
	  			 	showOvertimeWin(newId,true);
	  			}
	       });
		}else if(id == 'delete'){
			var rowId = overtimeGrid.getSelectedRowId();
			if(rowId) {
				overtimeGrid.deleteRow(rowId);
				dhxConfirmWin("删除后将不可恢复，确定要删除?",null,null,null,null,function (){
					overtimeDp.sendData();
					overtimeGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
				},function (){
						overtimeGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
				});
			}
			
		}else if(id == 'edit'){
			var rowId = overtimeGrid.getSelectedRowId();
			if(rowId&&rowId != null && rowId != ''){
				showOvertimeWin(rowId,false);
			}else{
				dhxMessageWin('请先选择一条记录。');
			}
			
		}else if(id == 'query'){
			var dept = this.getCombo('dept').getActualValue();
			var userName = this.getValue("userInput");;
			overtimeGrid.clearAndLoad(controlUrl+"&params="+params+"&dept="+dept+"&userName="+encodeURI(encodeURI(userName)));
		}
	});
	if((isFlwView==true)){
    	overtimeToolbar.disableItem("add");
    	overtimeToolbar.disableItem("edit");
        overtimeToolbar.disableItem("delete");
        overtimeToolbar.disableItem("exp");
    }
	overtimeGrid.attachEvent('onXLE', function(grid_obj, count) {
		if(isFlwTask==true&&count>0){
            overtimeToolbar.disableItem("add");
            overtimeToolbar.disableItem("delete");
            overtimeToolbar.disableItem("exp");
        }
	});
	//选中  overtimeGrid 的行后触发 
	overtimeGrid.attachEvent('onRowSelect', function(id, ind) {
		var billState=overtimeGrid.cells(id,9).getValue();
		if(isFlwTask==true){
            if(billState=='1'){
                overtimeToolbar.disableItem("edit");
                overtimeToolbar.disableItem("delete");
            }else{
               overtimeToolbar.ag("edit");
                overtimeToolbar.ag("delete");
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
        	overtimeToolbar.disableItem("add");
            overtimeToolbar.disableItem("delete");
            overtimeToolbar.disableItem("exp");
        }
        if((isFlwView==true)){
        	overtimeToolbar.disableItem("add");
        	overtimeToolbar.disableItem("edit");
            overtimeToolbar.disableItem("delete");
            overtimeToolbar.disableItem("exp");
        }
		
	});
}
function showOvertimeWin(uid,bol){
		if(bol !== true){
			if(uid){}else{dhxMessageWin("请先选择一条记录");return false;}
		}
		var windows = new getWin();
		var window_1 = windows.createWindow('window_1', 0, 0, 760, 300);
		window_1.setText('新增加班单');
		window_1.setModal(1);
		window_1.centerOnScreen();
		window_1.button('park').hide();
		window_1.button('minmax1').hide();
		var str = [
			{ type:"fieldset" , name:"f1", label:"加班基本信息", width:"720", position:"", list:[
			{ type:"combo" , name:"EMPLOYEE_ID", label:"加班人：",inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:"calendar" , name:"PLAN_START_DATE", label:"加班开始时间"+readHtml+"：", validate:"NotEmpty",dateFormat: "%Y-%m-%d %H:%i:%s",enableTime: true,readonly:true,inputWidth:"180", labelWidth:"140",labelAlign:"right",position:""  },
			{ type:!hasFlow?"input":"hidden" , name:"APPROVER", label:"审核人：", inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:hasFlow?"combo":"hidden" , name:"BILL_STATE", label:"审批状态：",value:hasFlow?"0":"1",inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:"input" , name:"WORK_DESCRIBE", label:"加班工作"+readHtml+"：", validate:"NotEmpty", rows:"4",inputWidth:"240", labelWidth:"80",labelAlign:"right", position:""  },
			{ type:"hidden" , name:"UIDS",value:uid, position:""  },
			{ type:"newcolumn" , position:""  },
			{ type:"combo" , name:"DEPT_ID", label:"部门：",inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:"calendar" , name:"PLAN_FINISH_DATE", label:"加班结束时间"+readHtml+"：", validate:"NotEmpty",dateFormat: "%Y-%m-%d %H:%i:%s",enableTime: true,readonly:true,inputWidth:"180", labelWidth:"140",labelAlign:"right",position:""  },
			{ type:"input" , name:"HOURS", label:"加班时长"+readHtml+"：", validate:"NotEmpty",inputWidth:"240", labelWidth:"80",labelAlign:"right", position:""  },
			{ type:"hidden" , name:"PID",value:pid, position:""  }
			]  }
		];
	
		var overtime_form = window_1.attachForm(str);
		var form_dp = new dataProcessor(baseServlet+"?ac=loadOvertimeForm");
		form_dp.init(overtime_form);
		form_dp.setUpdateMode("off");
		var addFormToolbar = window_1.attachToolbar("","bottom");
		addFormToolbar.render([{id:'save',text:'保存'},{id:'cancel',text:'取消',img:'no.png'}]);
		addFormToolbar.setItemCenter();
		var employeeIdCombo = overtime_form.getCombo("EMPLOYEE_ID");
		employeeIdCombo.loadXML(baseServlet+"?ac=loadUserComo",function (){
			if(bol == true){
				employeeIdCombo.setComboValue(USERID);
				overtime_form.disableItem("EMPLOYEE_ID")
			}
		});
		var deptIddCombo = overtime_form.getCombo("DEPT_ID");
		deptIddCombo.loadXML(baseServlet+"?ac=loadDeptCombo",function (){
			if(bol == true){
				deptIddCombo.setComboValue(USERDEPTID);
				overtime_form.disableItem("DEPT_ID")
			}
		});
		if(hasFlow){
		    var billStateCombo = overtime_form.getCombo("BILL_STATE");
			billStateCombo.loadXML(baseServlet+"?ac=loadBillStateComo",function (){
				if(bol == true){
					billStateCombo.setComboValue("0")
					overtime_form.disableItem("BILL_STATE")
				}
			});
		}
		overtime_form.attachEvent("onXLE", function (){
		     overtime_form.disableItem("EMPLOYEE_ID")
			overtime_form.disableItem("DEPT_ID")
		     if(hasFlow){
		    	var billStateCombo = overtime_form.getCombo("BILL_STATE");
				overtime_form.disableItem("BILL_STATE")
			  }
		});
		overtime_form.attachEvent("onChange", function (id, value){
		     if(id=='PLAN_START_DATE'){
		     	var planFinishDateValue=overtime_form.getItemValue("PLAN_FINISH_DATE");
		     	if(value&&planFinishDateValue){
		     		var date3=planFinishDateValue.getTime()-value.getTime();  //时间差的毫秒数
		     		var hours=0;
		     		if((date3%(3600*1000))<(3600*50)){
		     			hours=(date3/(3600*1000)).toFixed(0)
		     		}else{
		     			hours=(date3/(3600*1000)).toFixed(1);
		     		} 
		     		overtime_form.setFormData({HOURS:hours});
		     	}
		     }else if(id=='PLAN_FINISH_DATE'){
		     	var planStartDateValue=overtime_form.getItemValue("PLAN_START_DATE");
		     	if(value&&planStartDateValue){
		     		var date3=value.getTime()-planStartDateValue.getTime()  //时间差的毫秒数
		     		var hours=0;
		     		if((date3%(3600*1000))<(3600*50)){
		     			hours=(date3/(3600*1000)).toFixed(0)
		     		}else{
		     			hours=(date3/(3600*1000)).toFixed(1);
		     		}
		     		overtime_form.setFormData({HOURS:hours});
		     	}
		     }
		});
		//新增还是编辑 
		if(bol == false){
			window_1.setText('编辑加班单');
			overtime_form.loadAfterAll(baseServlet+"?ac=loadOvertimeForm&id="+uid);
		}
		addFormToolbar.attachEvent('onClick', function(btnId) {
			overtime_form.blur();
			if(btnId =='save'){
				if(overtime_form.validate()){
//					overtime_form.save();
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
				rzglMainMgm.doOvertimeInfo(uid,function (){
	       		});
			}
			overtimeGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
		});
	}
dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器