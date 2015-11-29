var controlUrl = CONTEXT_PATH +"/servlet/RlzyServlet?ac=getOnBusiness";
var baseServlet=CONTEXT_PATH +"/servlet/RlzyServlet";
var pid = CURRENTAPPID;
var onBusinessGrid,onBusinessDp,onBusinessToolbar;
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
	a.setText('出差单');
	a.setWidth('0');
	
	onBusinessGrid = a.attachGrid();	
	onBusinessGrid.setHeader(["uids","PID","出差人","部门","出差原因","出差地点","批准人","预计出差时间","预计结束时间","实际出差时间","实际结束时间","审批状态"]);
	onBusinessGrid.setColumnIds("UIDS,PID,EMPLOYEE_ID,DEPT_ID,REASON,ADDRESS,APPROVER,PLAN_START_DATE,PLAN_FINISH_DATE,ACTUAL_START_DATE,ACTUAL_FINISH_DATE,BILL_STATE");
	onBusinessGrid.setColTypes("ro,ro,coro,coro,txt,ed,coro,dhxCalendar,dhxCalendar,dhxCalendar,dhxCalendar,coro");
	
	onBusinessGrid.setColAlign('left,left,left,left,left,left,left,center,center,center,center,left');
	onBusinessGrid.setColSorting('str,str,str,str,str,str,str,dhxCalendar,dhxCalendar,dhxCalendar,dhxCalendar,str');
	onBusinessGrid.setInitWidths("*,*,*,*,*,*,*,*,*,*,*,*");
	onBusinessGrid.setColumnHidden(0,true);
	onBusinessGrid.setColumnHidden(1,true);
	if(!hasFlow){
	   // onBusinessGrid.setColumnHidden(11,true);
	}else{
		//onBusinessGrid.setColumnHidden(6,true);
	}
	onBusinessGrid.enableValidation(true, false);
	onBusinessGrid.setColValidators(',,,,,,,,,,,');
	onBusinessGrid.setDateFormat('%Y-%m-%d %H:%i:%s',null, 7);
	onBusinessGrid.setDateFormat('%Y-%m-%d %H:%i:%s',null, 8);
	onBusinessGrid.setDateFormat('%Y-%m-%d %H:%i:%s',null, 9);
	onBusinessGrid.setDateFormat('%Y-%m-%d %H:%i:%s',null, 10);
	onBusinessDp = new dataProcessor(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
	onBusinessDp.setUpdateMode('off');
	onBusinessDp.init(onBusinessGrid);
	
	onBusinessDp.attachFunctions("",function(){
		onBusinessGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
	});
	
	onBusinessGrid.init();
	onBusinessGrid.attachFooter(["<div id='onBusinessGrid_recinfoArea' style='width:100%;height:100%'></div>", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan"], ['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
	onBusinessGrid.enablePaging(true,20,5,"onBusinessGrid_recinfoArea");
	onBusinessGrid.setPagingSkin('toolbar','dhx_skyblue');
	onBusinessGrid.load(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""), 'xml');
	//事件部分 
	onBusinessGrid.attachEvent('onEditCell', function(stage,rId,cInd,nValue,oValue){
		return false;
	});
	onBusinessToolbar = a.attachToolbar();
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
				  onBusinessGrid.toExcel(CONTEXT_PATH+"/servlet/DhtmlxExcelGeneratorServlet");
			}
		}];
	}else{
		tbar = [{id:'add',text:'新增'},
		{id:'edit',text:'修改'},
		{id:'delete',text:'删除'},
				{
			type: 'label',
			text: '出差人:'
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
				  onBusinessGrid.toExcel(CONTEXT_PATH+"/servlet/DhtmlxExcelGeneratorServlet");
			}
		}];
	}
	onBusinessToolbar.render(tbar);
	if(powerLevel=='2'){
		onBusinessToolbar.hideItem("add");
		onBusinessToolbar.hideItem("edit");
		onBusinessToolbar.hideItem("delete");
	}
	onBusinessToolbar.attachEvent('onClick',function(id){
		var checked = onBusinessGrid.getCheckedRows(onBusinessGrid.getColIndexById("UIDS"));
		if(id == 'add'){
			rzglMainMgm.getUuidValue(function (data){
		    	var newId=data;
	  			 if(newId!=null&&newId!="")
	  			 {
	  			 	showOnBusinessWin(newId,true);
	  			}
	       });
		}else if(id == 'delete'){
			var rowId = onBusinessGrid.getSelectedRowId();
			if(rowId) {
				onBusinessGrid.deleteRow(rowId);
				dhxConfirmWin("删除后将不可恢复，确定要删除?",null,null,null,null,function (){
					onBusinessDp.sendData();
					
				},function (){
						onBusinessGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
				});
			}
			
		}else if(id == 'edit'){
			var rowId = onBusinessGrid.getSelectedRowId();
			if(rowId&&rowId != null && rowId != ''){
				showOnBusinessWin(rowId,false);
			}else{
				dhxMessageWin('请先选择一条记录。');
			}
			
		}else if(id == 'query'){
			var dept = this.getCombo('dept').getActualValue();
			var userName = this.getValue("userInput");;
			onBusinessGrid.clearAndLoad(controlUrl+"&params="+params+"&dept="+dept+"&userName="+encodeURI(encodeURI(userName)));
		}
	});
	if((isFlwView==true)){
    	onBusinessToolbar.disableItem("add");
    	onBusinessToolbar.disableItem("edit");
        onBusinessToolbar.disableItem("delete");
        onBusinessToolbar.disableItem("exp");
    }
	onBusinessGrid.attachEvent('onXLE', function(grid_obj, count) {
		if(isFlwTask==true&&count>0){
            onBusinessToolbar.disableItem("add");
            onBusinessToolbar.disableItem("delete");
            onBusinessToolbar.disableItem("exp");
        }
	});
	//选中  onBusinessGrid 的行后触发 
	onBusinessGrid.attachEvent('onRowSelect', function(id, ind) {
		var billState=onBusinessGrid.cells(id,11).getValue();
		if(isFlwTask==true){
            if(billState=='1'){
                onBusinessToolbar.disableItem("edit");
                onBusinessToolbar.disableItem("delete");
            }else{
               onBusinessToolbar.ag("edit");
                onBusinessToolbar.ag("delete");
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
        	onBusinessToolbar.disableItem("add");
            onBusinessToolbar.disableItem("delete");
            onBusinessToolbar.disableItem("exp");
        }
        if((isFlwView==true)){
        	onBusinessToolbar.disableItem("add");
        	onBusinessToolbar.disableItem("edit");
            onBusinessToolbar.disableItem("delete");
            onBusinessToolbar.disableItem("exp");
        }
		
	});
}
function showOnBusinessWin(uid,bol){
		if(bol !== true){
			if(uid){}else{dhxMessageWin("请先选择一条记录");return false;}
		}
		var windows = new getWin();
		var window_1 = windows.createWindow('window_1', 0, 0, 760, 400);
		window_1.setText('新增出差单');
		window_1.setModal(1);
		window_1.centerOnScreen();
		window_1.button('park').hide();
		window_1.button('minmax1').hide();
		var str = [
			{ type:"fieldset" , name:"f1", label:"出差基本信息", width:"720", position:"", list:[
			{ type:"combo" , name:"EMPLOYEE_ID", label:"出差人：",inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:hasFlow?"combo":"hidden" , name:"BILL_STATE", label:"审批状态：",value:hasFlow?"0":"1",inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:!hasFlow?"input":"hidden" , name:"APPROVER", label:"批准人：", inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:"input" , name:"REASON", label:"出差原因"+readHtml+"：", validate:"NotEmpty", rows:"4",inputWidth:"240", labelWidth:"80",labelAlign:"right", position:""  },
			{ type:"hidden" , name:"UIDS",value:uid, position:""  },
			{ type:"newcolumn" , position:""  },
			{ type:"combo" , name:"DEPT_ID", label:"部门：",inputWidth:"240", labelWidth:"80",labelAlign:"right",  position:""  },
			{ type:"input" , name:"ADDRESS", label:"出差地点"+readHtml+"：", validate:"NotEmpty",inputWidth:"240", labelWidth:"80",labelAlign:"right", position:""  },
			{ type:"hidden" , name:"PID",value:pid, position:""  }
			]  },
			{ type:"fieldset" , name:"f2", label:"预计出差情况", width:"720", position:"", list:[
			{ type:"calendar" , name:"PLAN_START_DATE", label:"预计开始出差时间"+readHtml+"：", validate:"NotEmpty",dateFormat: "%Y-%m-%d %H:%i:%s",enableTime: true,readonly:true,inputWidth:"180", labelWidth:"140",labelAlign:"right",position:""  },
			{ type:"newcolumn" , position:""  },
			{ type:"calendar" , name:"PLAN_FINISH_DATE", label:"预计结束出差时间"+readHtml+"：", validate:"NotEmpty",dateFormat: "%Y-%m-%d %H:%i:%s",enableTime: true,readonly:true,inputWidth:"180", labelWidth:"140",labelAlign:"right",position:""  }
			]  },
			{ type:"fieldset" , name:"f3", label:"实际出差情况", width:"720", position:"", list:[
			{ type:"calendar" , name:"ACTUAL_START_DATE", label:"实际开始出差时间"+readHtml+"：", validate:"NotEmpty",dateFormat: "%Y-%m-%d %H:%i:%s",enableTime: true,readonly:true,inputWidth:"180", labelWidth:"140",labelAlign:"right",position:""  },
			{ type:"newcolumn" , position:""  },
			{ type:"calendar" , name:"ACTUAL_FINISH_DATE", label:"实际结束出差时间"+readHtml+"：", validate:"NotEmpty",dateFormat: "%Y-%m-%d %H:%i:%s",enableTime: true,readonly:true,inputWidth:"180", labelWidth:"140",labelAlign:"right",position:""  }
			]  }
		];
	
		var onBusiness_form = window_1.attachForm(str);
		var form_dp = new dataProcessor(baseServlet+"?ac=loadOnBusinessForm");
		form_dp.init(onBusiness_form);
		form_dp.setUpdateMode("off");
		var addFormToolbar = window_1.attachToolbar("","bottom");
		addFormToolbar.render([{id:'save',text:'保存'},{id:'cancel',text:'取消',img:'no.png'}]);
		addFormToolbar.setItemCenter();
		var employeeIdCombo = onBusiness_form.getCombo("EMPLOYEE_ID");
		employeeIdCombo.loadXML(baseServlet+"?ac=loadUserComo",function (){
			if(bol == true){
				employeeIdCombo.setComboValue(USERID);
				onBusiness_form.disableItem("EMPLOYEE_ID")
			}
		});
		var deptIddCombo = onBusiness_form.getCombo("DEPT_ID");
		deptIddCombo.loadXML(baseServlet+"?ac=loadDeptCombo",function (){
			if(bol == true){
				deptIddCombo.setComboValue(USERDEPTID);
				onBusiness_form.disableItem("DEPT_ID")
			}
		});
		if(hasFlow){
		    var billStateCombo = onBusiness_form.getCombo("BILL_STATE");
			billStateCombo.loadXML(baseServlet+"?ac=loadBillStateComo",function (){
				if(bol == true){
					billStateCombo.setComboValue("0")
					onBusiness_form.disableItem("BILL_STATE")
				}
			});
		}
		onBusiness_form.attachEvent("onXLE", function (){
		     onBusiness_form.disableItem("EMPLOYEE_ID")
			onBusiness_form.disableItem("DEPT_ID")
		     if(hasFlow){
		    	var billStateCombo = onBusiness_form.getCombo("BILL_STATE");
				onBusiness_form.disableItem("BILL_STATE")
			  }
		});
		onBusiness_form.attachEvent("onChange", function (id, value){
		     if(id=='PLAN_START_DATE'){
		     	if(value){
		     		onBusiness_form.setFormData({ACTUAL_START_DATE:value});
		     	}
		     }else if(id=='PLAN_FINISH_DATE'){
		     	if(value){
		     		onBusiness_form.setFormData({ACTUAL_FINISH_DATE:value});
		     	}
		     }
		});
		//新增还是编辑 
		if(bol == false){
			window_1.setText('编辑出差单');
			onBusiness_form.loadAfterAll(baseServlet+"?ac=loadOnBusinessForm&id="+uid);
		}
		if(stepType=='1'){
			onBusiness_form.disableItem("ACTUAL_START_DATE");
			onBusiness_form.disableItem("ACTUAL_FINISH_DATE");
		}else if(stepType=='2'){
			onBusiness_form.disableItem("REASON");
			onBusiness_form.disableItem("ADDRESS");
			onBusiness_form.disableItem("PLAN_START_DATE");
			onBusiness_form.disableItem("PLAN_FINISH_DATE");
		}
		addFormToolbar.attachEvent('onClick', function(btnId) {
			onBusiness_form.blur();
			if(btnId =='save'){
				if(onBusiness_form.validate()){
//					onBusiness_form.save();
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
				rzglMainMgm.doOnBusinessInfo(uid,function (){
	       		});
			}
			onBusinessGrid.clearAndLoad(controlUrl+"&params="+params+((isFlwTask==true ||isFlwView==true)?(" and uids='"+masterid+"'"):""));
		});
	}
dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器