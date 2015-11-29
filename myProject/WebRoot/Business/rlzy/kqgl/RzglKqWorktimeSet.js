var controlUrl = CONTEXT_PATH +"/servlet/RlzyServlet?ac=getWorktimeSet";
var pid = CURRENTAPPID;
var worktimeGrid,worktimeDp;
function buildInterface(){
	dhtmlx.image_path='/dhx/codebase/imgs/';

	var main_layout = new dhtmlXLayoutObject(document.body, '1C');
	
	var a = main_layout.cells('a');
	a.setText('工作时间设置');
	a.setWidth('0');
	
	var worktimeGrid = a.attachGrid();	
	worktimeGrid.setHeader(["uids","PID","时间类型","上午上班时间","上午下班时间","下午上班时间","下午下班时间","考勤记录开始时间","考勤记录结束时间"]);
	worktimeGrid.setColumnIds("UIDS,PID,SJTYPE,ONWORKTIMEAM,OFFWORKTIMEAM,ONWORKTIMEPM,OFFWORKTIMEPM,STARTTIME,ENDTIME");
	worktimeGrid.setColTypes("ro,ro,coro,dhxCalendar,dhxCalendar,dhxCalendar,dhxCalendar,dhxCalendar,dhxCalendar");
	
	worktimeGrid.setColAlign('left,left,left,center,center,center,center,center,center');
	worktimeGrid.setColSorting('str,str,str,dhxCalendar,dhxCalendar,dhxCalendar,dhxCalendar,dhxCalendar,dhxCalendar');
	worktimeGrid.setInitWidths("*,*,*,*,*,*,*,*,*");
	worktimeGrid.setColumnHidden(0,true);
	worktimeGrid.setColumnHidden(1,true);
	
	worktimeGrid.enableValidation(true, false);
	worktimeGrid.setColValidators(',,,,,,,,,');
	worktimeGrid.setDateFormat('%H:%i',null, 3);
	worktimeGrid.setDateFormat('%H:%i',null, 4);
	worktimeGrid.setDateFormat('%H:%i',null, 5);
	worktimeGrid.setDateFormat('%H:%i',null, 6);
	worktimeGrid.setDateFormat('%Y-%m-%d',null, 7);
	worktimeGrid.setDateFormat('%Y-%m-%d',null, 8);
	//worktimeGrid.setDateFormat('%Y-%m-%d');
	worktimeDp = new dataProcessor(controlUrl+"&pid="+pid);
	worktimeDp.setUpdateMode('off');
	worktimeDp.init(worktimeGrid);
	
	worktimeDp.attachFunctions("",function(){
		worktimeGrid.clearAndLoad(controlUrl+"&pid="+pid);
	});
	
	worktimeGrid.init();
	worktimeGrid.attachFooter(["<div id='worktimeGrid_recinfoArea' style='width:100%;height:100%'></div>", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan"], ['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
	worktimeGrid.enablePaging(true,20,5,"worktimeGrid_recinfoArea");
	worktimeGrid.setPagingSkin('toolbar','dhx_skyblue');
	worktimeGrid.load(controlUrl+"&pid="+pid+"", 'xml');
		
	var worktimeToolbar = a.attachToolbar();
	var tbar = [{id:'add',text:'新增'},{id:'delete',text:'删除'},{id:'save',text:'保存'}];//{id:'edit',text:'修改'},
	worktimeToolbar.render(tbar);
		
	worktimeToolbar.attachEvent('onClick',function(id){
		var checked = worktimeGrid.getCheckedRows(worktimeGrid.getColIndexById("UIDS"));
		if(id == 'add'){
			rzglMainMgm.getUuidValue(function (data){
		    	var newId=data;
	  			 if(newId!=null&&newId!="")
	  			 {
	  			 	worktimeGrid.addRow(newId, [newId,CURRENTAPPID,"","","","","","","" ], 0);
	  			 	worktimeGrid.setRowColor(worktimeGrid.getRowId(0),"#F0F8FF");
	  			}
	       });
		}else if(id == 'delete'){
			var rowId = worktimeGrid.getSelectedRowId();
			if(rowId) {
				var date = new Date();
				var year = date.getFullYear();
				var mon = date.getMonth()+1;
				var da = date.getDate();
				var kqdate =  year+"-"+mon+"-"+da;
				var sql = "select t.uids "+
					"from RZGL_KQGL_WORKTIME_SET t where t.start_time<=to_date('"+kqdate+"','yyyy-MM-dd') and t.end_time>=to_date('"+kqdate+"','yyyy-MM-dd') and t.uids='"+rowId+"'";
				dhxConfirmWin("删除后将不可恢复，确定要删除?",null,null,null,null,function (){
					rzglMainMgm.getWorkTime(sql,function(list){
						if(list.length>0){
							dhxMessageWin("该条数据正在被使用，不能删除");
							return;
						}else{
							worktimeGrid.deleteRow(rowId);
							worktimeDp.sendData();
							
							worktimeGrid.clearAndLoad(controlUrl+"&pid="+pid);
						}
					});
				},function (){
						worktimeGrid.clearAndLoad(controlUrl+"&pid="+pid);
				});
			}
			
		}else if(id == 'save'){
			var rowId = worktimeGrid.getSelectedRowId();
			var onAmIndex=worktimeGrid.getColIndexById("ONWORKTIMEAM");
			var ONWORKTIMEAM = worktimeGrid.cells(rowId,onAmIndex).getValue();
			var offAmIndex=worktimeGrid.getColIndexById("OFFWORKTIMEAM");
			var OFFWORKTIMEAM = worktimeGrid.cells(rowId,offAmIndex).getValue();
			var onPmIndex=worktimeGrid.getColIndexById("ONWORKTIMEPM");
			var ONWORKTIMEPM = worktimeGrid.cells(rowId,onPmIndex).getValue();
			var offPmIndex=worktimeGrid.getColIndexById("OFFWORKTIMEPM");
			var OFFWORKTIMEPM = worktimeGrid.cells(rowId,offPmIndex).getValue();

			if(ONWORKTIMEAM > OFFWORKTIMEAM){
				dhxMessageWin('上午上班时间不能早于上午下班时间!');
				return;
			}else if(ONWORKTIMEAM > ONWORKTIMEPM){
				dhxMessageWin('上午上班时间不能早于下午上班时间!');
				return;
			}else if(ONWORKTIMEAM > OFFWORKTIMEPM){
				dhxMessageWin('上午上班时间不能早于下午下班时间!');
				return;
			}else if(OFFWORKTIMEAM > ONWORKTIMEPM){
				dhxMessageWin('上午下班时间不能早于下午上班时间!');
				return;
			}else if(OFFWORKTIMEAM > OFFWORKTIMEPM){
				dhxMessageWin('上午下班时间不能早于下午下班时间!');
				return;
			}else if(ONWORKTIMEPM > OFFWORKTIMEPM){
				dhxMessageWin('下午上班时间不能早于下午下班时间!');
				return;
			}else{
				worktimeDp.sendData();
				
			}
			
		
		}
	});
}

dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器