var professinalGrid,professinalTbar,professinalDp,userGrid,userTbar,userDp;
var professionalId=null;
var selvletUrl = CONTEXT_PATH + "/servlet/WeekWorkManagementServlet";
var currentPid=CURRENTAPPID;
function pageOnload(){
	dhtmlx.image_path='/dhx/codebase/imgs/';
	var viewport=new dhtmlXLayoutObject(document.body, '2U');
	var a=viewport.cells('a');
	a.hideHeader();
	professinalTbar = a.attachToolbar();
	professinalTbar.render([{type:'label',text:'专业分类'},{type:'separator'},{id:'add',text:'新增'},{type:'separator'},{id:'save'},{type:'separator'},{id:'delete'}]);
	professinalTbar.attachEvent('onClick', professinalTbarHandler);
	
	professinalGrid = a.attachGrid();
	professinalGrid.setImagePath('/dhx/codebase/imgs/');
	professinalGrid.setHeader(["uids","系统编号","专业分类名称","PID"]);
	professinalGrid.setColTypes("ro,ed,ed,ro");
	professinalGrid.setColAlign('left,left,left,left');
	professinalGrid.setColSorting('str,str,str,str');
	professinalGrid.setInitWidths("*,*,*,*");
	professinalGrid.setColumnHidden(0,true);
	professinalGrid.setColumnHidden(3,true);
	professinalGrid.init();
	professinalDp = new dataProcessor(selvletUrl+"?ac=loadProfessionalGrid&pid="+currentPid);
	professinalDp.setUpdateMode('off');
	professinalDp.init(professinalGrid);
	professinalGrid.attachEvent('onXLE', function(grid_obj, count) {
		var rowCount=professinalGrid.getRowsNum();
		if(rowCount > 0){
    		professinalGrid.selectRow(0,true,true,true);
    	}
	});
	professinalDp.attachEvent("onAfterUpdateFinish",function(){
		dhxMessageWin("保存成功！","","","","",function(){
			professinalGrid.clearAndLoad(selvletUrl+"?ac=loadProfessionalGrid&pid="+currentPid);
		});
	});
	professinalGrid.load(selvletUrl+"?ac=loadProfessionalGrid&pid="+currentPid,'xml');
	professinalGrid.attachEvent('onRowSelect', function(id, ind){
		professionalId =professinalGrid.cells(id,0).getValue();
		if(professionalId&&professionalId != null){
			userGrid.clearAndLoad(selvletUrl+"?ac=loadUserGrid&professionalId="+professionalId);
		}		
	});
	var b=viewport.cells('b');
	b.setWidth(400);
	b.hideHeader();
	userTbar = b.attachToolbar();
	userTbar.render([{type:'label',text:'分类权限设置'},{type:'separator'},{id:'add',text:'新增'},{type:'separator'},{id:'delete'}]);
	userTbar.attachEvent('onClick', userTbarHandler);
			
	userGrid = b.attachGrid();
	userGrid.setImagePath('/dhx/codebase/imgs/');
	userGrid.setHeader(["uids","单位或部门名称","用户姓名","专业id"]);
	userGrid.setColTypes("ro,coro,coro,ro");
	userGrid.setColAlign('left,left,left,left');
	userGrid.setColSorting('str,coro,coro,str');
	userGrid.setInitWidths("0,*,*,*");
	userGrid.setColumnHidden(0,true);
	userGrid.setColumnHidden(3,true);
	userGrid.init();
	userDp = new dataProcessor(selvletUrl+"?ac=loadUserGrid");
	userDp.setUpdateMode('off');
	userDp.init(userGrid);
	userGrid.attachEvent('onEditCell',
	    function(stage, rId, cInd, nValue, oValue) {
	        if (cInd == '4') return false;
	        else return false;
	    });
	userDp.attachEvent("onAfterUpdateFinish",function(){
		dhxMessageWin("保存成功！","","","","",function(){
			userGrid.clearAndLoad(selvletUrl+"?ac=loadUserGrid&professionalId="+professionalId,'xml');
		});
	});
	function professinalTbarHandler(itemId){
		if(itemId == 'add'){
			weekWorkManagementService.getUuidValue(function (data)
			{
		    	var newId=data;
	  			 if(newId!=null&&newId!="")
	  			 {
	  			 	professinalGrid.addRow(newId, [newId,"", "",CURRENTAPPID ], 0);
	  			 	professinalGrid.setRowColor(professinalGrid.getRowId(0),"#F0F8FF");
	  			}
	       });
		}else if(itemId == 'delete'){
			var rowId = professinalGrid.getSelectedRowId();
			if(rowId) {
				professinalGrid.deleteRow(rowId);
				dhxConfirmWin("您选择了删除该条信息,删除后将不可恢复，确定要删除?",null,null,null,null,function (){
					professinalDp.sendData();
					professinalGrid.clearAndLoad(selvletUrl+"?ac=loadProfessionalGrid&pid="+currentPid);
					},function (){
						professinalGrid.clearAndLoad(selvletUrl+"?ac=loadProfessionalGrid&pid="+currentPid);
				});
			}
		}else{
			professinalDp.sendData();
		}
	}
	function userTbarHandler(itemId){
		if(itemId == 'add'){
			showUserWin();
		}else if(itemId == 'delete'){
			var rowId = userGrid.getSelectedRowId();
			if(rowId) {
				userGrid.deleteRow(rowId);
				dhxConfirmWin("您选择了删除该条信息,删除后将不可恢复，确定要删除?",null,null,null,null,function (){
					userDp.sendData();
					userGrid.clearAndLoad(selvletUrl+"?ac=loadUserGrid&professionalId="+professionalId,'xml');
					},function (){
						userGrid.clearAndLoad(selvletUrl+"?ac=loadUserGrid&professionalId="+professionalId,'xml');		
				});
			}
		}
	}
}
function showUserWin(){
	var windows = new dhtmlXWindows();
	var userUnitWin = windows.createWindow('userUnitWin', 0, 0, 300, 400);
	userUnitWin.setText('用户选择');
	userUnitWin.denyResize();
	userUnitWin.setModal(1);
	userUnitWin.centerOnScreen();
	userUnitWin.button('stick').hide();
	userUnitWin.button('park').hide();
	userUnitWin.button('minmax1').hide();

	var unitUserTree = userUnitWin.attachGrid();
	unitUserTree.setImagePath('/dhx/codebase/imgs/');
	unitUserTree.setHeader(["名称","选择"]);
	unitUserTree.setColTypes("tree,ch");
	unitUserTree.setColSorting('str,str');
	unitUserTree.setColAlign('left,center');
	unitUserTree.setInitWidths("*,40");
	unitUserTree.init();
	unitUserTree.load(selvletUrl+"?ac=userUnitTree&professionalId="+professionalId+"&id="+currentPid.substring(0,currentPid.length-2), 'xml');
	unitUserTree.attachEvent('onXLE', function(grid_obj, count) {
		var rowCount=unitUserTree.getRowsNum();
		if(rowCount > 0){
    		unitUserTree.openItem(unitUserTree.getRowId(0));
    	}
	});
	unitUserTree.attachEvent("onCheck", 	function(rId,cInd,state){
		setTreeGridCascadSelect(currentPid.substring(0,currentPid.length-2), unitUserTree, rId, cInd, state);
	});

	var tbar = userUnitWin.attachToolbar();
	tbar.render([{id:'save',func:function(){
		var checked = getCheckedValue(unitUserTree);
		dhtmlxAjax.post(selvletUrl, 'ac=saveSelectUser&data='+checked+'&professionalId='+professionalId, function(res){
			var result = res.xmlDoc.responseText;
			if(result && result=='true'){
				dhxMessageWin("保存成功！","","","","",function(){
					userGrid.clearAndLoad(selvletUrl+"?ac=loadUserGrid&professionalId="+professionalId);
				});
				userUnitWin.close();
			}else
				dhxMessageWin('保存失败，请重试！');
		});
	}}]);
}
function SetUnchecked(obj){
	obj.forEachRow(function(id){
		var cell = obj.cells(id,1);
		var type = obj.getRowAttribute(id,'type');
		cell.setDisabled(type=='unit');
	});
}
function getCheckedValue(obj){
	var str="";
	obj.forEachRow(function(id){
		var cell = obj.cells(id,1);
		if(cell.getValue()==1){
			str+=","+id;
		}
	});
	return str.substring(1);
}