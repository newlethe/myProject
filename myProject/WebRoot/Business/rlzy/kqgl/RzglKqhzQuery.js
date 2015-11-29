var controlUrl = CONTEXT_PATH +"/servlet/RlzyServlet?ac=getKqhzQuery";
var pid = CURRENTAPPID;
var kqQueryGrid,kqQueryDp;
var main_layout;
var parameter = "";
if(userId !='null' && kqtype !='null'){
	if(kqtype == 'mod'){
		parameter += " 1=1 and t.user_id in(select r.user_id from rzgl_kqgl_kq_adjust r where r.user_id='"+userId+"') and (is_mod_am ='0' or is_mod_pm='0') ";
	}else{
		parameter += " 1=1 and t.user_id='"+userId+"' and (t.kq_situation_am='"+kqtype+"' or t.kq_situation_pm='"+kqtype+"')";
	}
}
function buildInterface(){
	dhtmlx.image_path='/dhx/codebase/imgs/';

	main_layout = new dhtmlXLayoutObject(document.body, '1C');
	
	var a = main_layout.cells('a');
	a.setText('考勤汇总查询');
	a.setWidth('0');
	
	kqQueryGrid = a.attachGrid();	
	kqQueryGrid.setHeader(["uids","PID","员工编号","部门","姓名","考勤日期","上午考勤情况","考勤开始时间","考勤结束时间","请假","出差","是否有修正","下午考勤情况","考勤开始时间","考勤结束时间","请假","出差","是否有修正"]);
	kqQueryGrid.setColumnIds("UIDS,PID,USERNUM,DEPTID,USERID,KQDATE,KQSITUATIONAM,KQSTARTTIMEAM,KQSENDIMEAM,QINGJIAAM,CHUCHAIAM,XIUZHENGAM,KQSITUATIONPM,KQSTARTTIMEPM,KQSENDIMEPM,QINGJIAPM,CHUCHAIPM,XIUZHENGPM");
	kqQueryGrid.setColTypes("ro,ro,ro,coro,coro,dhxCalendar,coro,dhxCalendar,dhxCalendar,ro,ro,ro,coro,dhxCalendar,dhxCalendar,ro,ro,ro");
	
	kqQueryGrid.setColAlign('left,left,left,left,center,center,center,center,center,center,center,center,center,center,center,center,center,center');
	kqQueryGrid.setColSorting('str,str,str,str,str,dhxCalendar,str,dhxCalendar,dhxCalendar,str,str,str,str,dhxCalendar,dhxCalendar,str,str,str');
	kqQueryGrid.setInitWidths("0,0,80,100,80,90,90,120,120,70,70,70,90,120,120,70,70,70");
	kqQueryGrid.setColumnHidden(0,true);
	kqQueryGrid.setColumnHidden(1,true);
	
	kqQueryGrid.enableValidation(true, false);
	kqQueryGrid.setColValidators(',,,,,,,,,,,,,,,,,,');
	kqQueryGrid.setDateFormat('%Y-%m-%d',null, 5);
	kqQueryGrid.setDateFormat('%Y-%m-%d %H:%i',null, 7);
	kqQueryGrid.setDateFormat('%Y-%m-%d %H:%i',null, 8);
	kqQueryGrid.setDateFormat('%Y-%m-%d %H:%i',null, 13);
	kqQueryGrid.setDateFormat('%Y-%m-%d %H:%i',null, 14);
	//kqQueryGrid.setDateFormat('%Y-%m-%d');
	//kqQueryGrid.enableAutoWidth(true);
	if(parameter !=''){
		kqQueryDp = new dataProcessor(controlUrl+"&pid="+pid+"&parameter="+parameter);
	}else{
		kqQueryDp = new dataProcessor(controlUrl+"&pid="+pid+"&powerLevel="+powerLevel+"&userid="+USERID);
	}
	kqQueryDp.setUpdateMode('off');
	kqQueryDp.init(kqQueryGrid);
	kqQueryGrid.init();
	
	kqQueryGrid.attachFooter(["<div id='kqQueryGrid_recinfoArea' style='width:100%;height:100%'></div>", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan","#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan"], ['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
	kqQueryGrid.enablePaging(true,20,5,"kqQueryGrid_recinfoArea");
	kqQueryGrid.setPagingSkin('toolbar','dhx_skyblue');
	if(parameter !=''){
		kqQueryGrid.load(controlUrl+"&pid="+pid+"&parameter="+parameter, 'xml');
	}else{
		kqQueryGrid.load(controlUrl+"&pid="+pid+"&powerLevel="+powerLevel+"&userid="+USERID, 'xml');
	}

	kqQueryGrid.attachEvent('onEditCell',
        function(stage, rId, cInd, nValue, oValue) {
            return false;
       	}
    );
		
	var queryToolbar = a.attachToolbar();
	var tbar = [{type:"label",text:"姓名:",id:'lxm'},
	 			{type:"input",id:"xm"}, 
	 			{type:"label",text:"部门:",id:'ldept'},
				{type:"combo",id:"dept",name:'dept',width:'110'},
				//{type:"datebetween",id: 'rq',format: '%Y-%m-%d',width: '80',ksText:'开始时间：',jsText:'结束时间：'},
				{type:"label",text:"起始时间:"},
				{type:"calendar",id: 'start',format: '%Y-%m-%d',width: '80'},
				{type:"label",text:"结束时间:"},
				{type:"calendar",id: 'end',format: '%Y-%m-%d',width: '80'},
				{type:"button",id:"query",text:"查询"},
				{id:'exp'}
			    ];
	queryToolbar.render(tbar);
	queryToolbar.getCombo("dept").loadXML(CONTEXT_PATH +"/servlet/RlzyServlet?ac=loadDeptCombo");
	if(powerLevel == 'geren'){
		queryToolbar.hideItem('xm');
		queryToolbar.hideItem('dept');
		queryToolbar.hideItem('lxm');
		queryToolbar.hideItem('ldept');
	}
	if(parameter !=''){
		queryToolbar.hideItem('xm');
		queryToolbar.hideItem('dept');
		queryToolbar.hideItem('lxm');
		queryToolbar.hideItem('ldept');
	}		
	queryToolbar.attachEvent('onClick',function(id){
		//var checked = kqQueryGrid.getCheckedRows(kqQueryGrid.getColIndexById("UIDS"));
		var str = "1=1";
		if(id == 'exp'){
			//kqQueryGrid.expToExcel();
			kqQueryGrid.toExcel(basePath+"/servlet/DhtmlxExcelGeneratorServlet");
		}else if(id == 'query'){
			//得到ToolBar上的过滤条件组成json串。
			var start = queryToolbar.getCalendarValue("start");
			var end = queryToolbar.getCalendarValue("end");
			var xm = queryToolbar.getValue("xm");
			var dept = queryToolbar.getCombo('dept').getActualValue();
			
			if(start != null && start != ''){
				str += " and t.kq_date >= to_date('"+start+"','yyyy-MM-dd')";
			}
			if(end != null && end != ''){
				str +=" and t.kq_date <= to_date('"+end+"','yyyy-MM-dd')";
			}
			if(xm != null && xm != ''){
				str += "and t.user_id in(select i.userid from hr_man_info i where i.realname like '%"+xm+"%')";
			}
			if(dept != null && dept != ''){
				str += " and t.dept_id='"+dept+"'";
			}
			if(parameter !=''){
				kqQueryGrid.clearAndLoad(encodeURI(controlUrl+"&str="+str+"&parameter="+parameter));
			}else{
				kqQueryGrid.clearAndLoad(encodeURI(controlUrl+"&str="+str+"&powerLevel="+powerLevel+"&userid="+USERID));
			}
		}
	});
}
dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器