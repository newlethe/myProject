var controlUrl = CONTEXT_PATH +"/servlet/RlzyServlet?ac=getHolidaySet";
var pid = CURRENTAPPID;
var holidayGrid,holidayDp;
function buildInterface(){
	dhtmlx.image_path='/dhx/codebase/imgs/';

	var main_layout = new dhtmlXLayoutObject(document.body, '1C');
	
	var a = main_layout.cells('a');
	a.setText('节假日设置');
	a.setWidth('0');
	
	var holidayGrid = a.attachGrid();	
	holidayGrid.setHeader(["uids","PID","日期","类型","说明"]);
	holidayGrid.setColumnIds("UIDS,PID,HOLIDAYDATE,TYPE,REMARK");
	holidayGrid.setColTypes("ro,ro,dhxCalendar,coro,ed");
	
	holidayGrid.setColAlign('left,left,center,center,left');
	holidayGrid.setColSorting('str,str,dhxCalendar,str,str');
	holidayGrid.setInitWidths("*,*,300,300,*");
	holidayGrid.setColumnHidden(0,true);
	holidayGrid.setColumnHidden(1,true);
	
	holidayGrid.enableValidation(true, false);
	holidayGrid.setColValidators(',,,,,');
	holidayGrid.setDateFormat('%Y-%m-%d',null, 2);
	//holidayGrid.setDateFormat('%Y-%m-%d');
	holidayDp = new dataProcessor(controlUrl+"&pid="+pid);
	holidayDp.setUpdateMode('off');
	holidayDp.init(holidayGrid);
	
	holidayDp.attachFunctions("",function(){
		holidayGrid.clearAndLoad(controlUrl+"&pid="+pid);
	});
			
	holidayGrid.init();
	holidayGrid.attachFooter(["<div id='holidayGrid_recinfoArea' style='width:100%;height:100%'></div>", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan"], ['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
	holidayGrid.enablePaging(true,20,5,"holidayGrid_recinfoArea");
	holidayGrid.setPagingSkin('toolbar','dhx_skyblue');
	holidayGrid.load(controlUrl+"&pid="+pid+"", 'xml');
		
	var worktimeToolbar = a.attachToolbar();
	var tbar = [{id:'add',text:'新增'},{id:'delete',text:'删除'},{id:'save',text:'保存'}];//{id:'edit',text:'修改'},
	worktimeToolbar.render(tbar);
		
	worktimeToolbar.attachEvent('onClick',function(id){
		var checked = holidayGrid.getCheckedRows(holidayGrid.getColIndexById("UIDS"));
		if(id == 'add'){
			rzglMainMgm.getUuidValue(function (data){
		    	var newId=data;
	  			 if(newId!=null&&newId!="")
	  			 {
	  			 	holidayGrid.addRow(newId, [newId,CURRENTAPPID,"","1",""], 0);
	  			 	holidayGrid.setRowColor(holidayGrid.getRowId(0),"#F0F8FF");
	  			}
	       });
		}else if(id == 'delete'){
			var rowId = holidayGrid.getSelectedRowId();
			if(rowId) {
				holidayGrid.deleteRow(rowId);
				dhxConfirmWin("删除后将不可恢复，确定要删除?",null,null,null,null,function (){
					holidayDp.sendData();
					//holidayGrid.clearAndLoad(controlUrl+"&pid="+pid);
				},function (){
						holidayGrid.clearAndLoad(controlUrl+"&pid="+pid);
				});
			}
			
		}else{
			holidayDp.sendData();
		}
	});
}

dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器