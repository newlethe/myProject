var controlUrl = CONTEXT_PATH +"/servlet/RlzyServlet?ac=getKqAdjust";
var parameter = "";
if(ModuleLVL < 3){
	parameter = "&pid="+pid+"&userid="+USERID
}else{
	parameter = "&pid="+pid
}
var pid = CURRENTAPPID;
var kqAdjustGrid,kqAdjustDp;
var main_layout;
dwr.engine.setAsync(false);
var rtnState='';
var hasFlow=false;//页面是否配置流程
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

	main_layout = new dhtmlXLayoutObject(document.body, '1C');
	
	var a = main_layout.cells('a');
	a.setText('考勤调整');
	a.setWidth('0');
	
	kqAdjustGrid = a.attachGrid();	
	kqAdjustGrid.setHeader(["uids","PID","员工姓名","部门","考勤日期","调整类型","开始时间","结束时间","证明人","审核状态"]);
	kqAdjustGrid.setColumnIds("UIDS,PID,USERID,DEPTID,KQDATE,ADJUSTTYPE,STARTTIME,ENDTIME,PROVEMAN,BILLSTATE");
	kqAdjustGrid.setColTypes("ro,ro,coro,coro,dhxCalendar,coro,dhxCalendar,dhxCalendar,ed,coro");
	
	kqAdjustGrid.setColAlign('left,left,left,left,center,center,center,center,left,left');
	kqAdjustGrid.setColSorting('str,str,str,str,dhxCalendar,str,dhxCalendar,dhxCalendar,str,str');
	kqAdjustGrid.setInitWidths("*,*,*,*,*,*,*,*,*,*");
	kqAdjustGrid.setColumnHidden(0,true);
	kqAdjustGrid.setColumnHidden(1,true);
	
	kqAdjustGrid.enableValidation(true, false);
	kqAdjustGrid.setColValidators(',,,,,,,,,,');
	kqAdjustGrid.setDateFormat('%Y-%m-%d',null, 4);
	kqAdjustGrid.setDateFormat('%Y-%m-%d %H:%i',null, 6);
	kqAdjustGrid.setDateFormat('%Y-%m-%d %H:%i',null, 7);
	kqAdjustDp = new dataProcessor(controlUrl+parameter);
	kqAdjustDp.setUpdateMode('off');
	kqAdjustDp.init(kqAdjustGrid);
	
	kqAdjustDp.attachFunctions("",function(){
		kqAdjustGrid.clearAndLoad(controlUrl+parameter);
	});
	
	kqAdjustGrid.init();
	
	kqAdjustGrid.attachFooter(["<div id='kqAdjustGrid_recinfoArea' style='width:100%;height:100%'></div>", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan"], ['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
	kqAdjustGrid.enablePaging(true,20,5,"kqAdjustGrid_recinfoArea");
	kqAdjustGrid.setPagingSkin('toolbar','dhx_skyblue');
	kqAdjustGrid.load(controlUrl+parameter, 'xml');
	
	kqAdjustGrid.attachEvent('onEditCell',
        function(stage, rId, cInd, nValue, oValue) {
       		if(cInd !=4 && cInd !=5 && cInd !=8){
       			return false;
       		}
       		if(stage==2){
				if(cInd==kqAdjustGrid.getColIndexById("KQDATE")||cInd==kqAdjustGrid.getColIndexById("ADJUSTTYPE")){
					var kqrqIndex=kqAdjustGrid.getColIndexById("KQDATE");
					var kqrq = kqAdjustGrid.cells(rId,kqrqIndex).getValue();
					var kqlxIndex=kqAdjustGrid.getColIndexById("ADJUSTTYPE");
					var kqlx = kqAdjustGrid.cells(rId,kqlxIndex).getValue();
					var sql = "select to_char(t.on_worktime_am,'hh24:mi') onAm,to_char(t.off_worktime_am,'hh24:mi') offAm," +
					"to_char(t.on_worktime_pm,'hh24:mi') onPm,to_char(t.off_worktime_pm,'hh24:mi') offPm "+
					"from RZGL_KQGL_WORKTIME_SET t where t.start_time<=to_date('"+kqrq+"','yyyy-MM-dd') and t.end_time>=to_date('"+kqrq+"','yyyy-MM-dd')";
					var onAm = '';
					var offAm = '';
					var onPm = '';
					var offPm = '';
					rzglMainMgm.getWorkTime(sql,function(list){
						if(list && list.length>0){
							onAm = list[0][0];
							offAm = list[0][1];
							onPm = list[0][2];
							offPm = list[0][3];
							if(kqrq!=null&&kqrq!=""&&kqlx!=null&&kqlx!=""){
								var startIndex = kqAdjustGrid.getColIndexById("STARTTIME");
								var endIndex = kqAdjustGrid.getColIndexById("ENDTIME");
								if(kqlx==1){
									kqAdjustGrid.cells(rId,startIndex).setValue(kqrq+" "+onAm);
									kqAdjustGrid.cells(rId,endIndex).setValue(kqrq+" "+offAm);
								}else if(kqlx==2){
									kqAdjustGrid.cells(rId,startIndex).setValue(kqrq+" "+onPm);
									kqAdjustGrid.cells(rId,endIndex).setValue(kqrq+" "+offPm);
								}
			    			}
						}else{
							alert("您还没有在工作时间设置模块设置考勤记录时间！");	
						}
					});
				}
				return true;
			}
       		return true;
       	}
    );
		
	var adjustToolbar = a.attachToolbar();
	var tbar = [{id:'add',text:'新增'},{id:'delete',text:'删除'},{id:'save',text:'保存'}];
	adjustToolbar.render(tbar);	
	if(ModuleLVL >= 3){
		adjustToolbar.hideItem("add");
		adjustToolbar.hideItem("delete");
		adjustToolbar.hideItem("save");
		kqAdjustGrid.setEditable(false);
		
	}
	kqAdjustGrid.attachEvent("onRowSelect",function(rowId,cellIndex){
		var stateIndex=kqAdjustGrid.getColIndexById("BILLSTATE");
		var billstate = kqAdjustGrid.cells(rowId,stateIndex).getValue();
		if(hasFlow == true){//使用流程时，当审批状态为已审批时，不可修改和删除
			if(billstate == '1'){
				adjustToolbar.disableItem("delete");
				kqAdjustGrid.setEditable(false);
			}
		}
  	});
	
	adjustToolbar.attachEvent('onClick',function(id){
		var rowId = kqAdjustGrid.getSelectedRowId();
		if(id == 'add'){
			rzglMainMgm.getUuidValue(function (data){
		    	var newId=data;
	  			 if(newId!=null&&newId!=""){
	  			 	if(hasFlow == true){
	  			 		kqAdjustGrid.addRow(newId, [newId,CURRENTAPPID,USERID,USERPOSID,"","","","","","0"], 0);
	  			 		kqAdjustGrid.setRowColor(kqAdjustGrid.getRowId(0),"#F0F8FF");
	  			 	}else{
	  			 		kqAdjustGrid.addRow(newId, [newId,CURRENTAPPID,USERID,USERPOSID,"","","","","","1"], 0);
	  			 		kqAdjustGrid.setRowColor(kqAdjustGrid.getRowId(0),"#F0F8FF");
	  			 	}
	  			 	
	  			}
	       });
		}else if(id == 'delete'){
			if(rowId) {
				dhxConfirmWin("删除后将不可恢复，确定要删除?",null,null,null,null,function (){
					if(hasFlow == false){
						kqAdjustGrid.deleteRow(rowId);
						kqAdjustDp.sendData();
						kqAdjustGrid.clearAndLoad(controlUrl+parameter);
					}else{
						kqAdjustGrid.deleteRow(rowId);
						kqAdjustDp.sendData();
						kqAdjustGrid.clearAndLoad(controlUrl+parameter);
					}
				},function (){
						kqAdjustGrid.clearAndLoad(controlUrl+parameter);
				});
			}
				
		}else{
			kqAdjustDp.sendData();
		}
	}); 	
}
dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器