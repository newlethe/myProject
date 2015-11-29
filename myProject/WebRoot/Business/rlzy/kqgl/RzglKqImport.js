var controlUrl = CONTEXT_PATH +"/servlet/RlzyServlet?ac=getKqImport";
var pid = CURRENTAPPID;
var kqImportGrid,kqImportDp;
var beanName = "com.sgepit.pmis.rlzj.hbm.RzglKqglKqImport";
var main_layout;
var importWin;
function buildInterface(){
	dhtmlx.image_path='/dhx/codebase/imgs/';

	main_layout = new dhtmlXLayoutObject(document.body, '1C');
	
	var a = main_layout.cells('a');
	a.setText('考勤导入');
	a.setWidth('0');
	
	kqImportGrid = a.attachGrid();	
	kqImportGrid.setHeader(["uids","PID","员工编号","部门","姓名","考勤日期","上午考勤情况","上午考勤开始时间","上午考勤结束时间","下午考勤情况","下午考勤开始时间","下午考勤结束时间"]);
	kqImportGrid.setColumnIds("UIDS,PID,USERNUM,DEPTID,USERID,KQDATE,KQSITUATIONAM,KQSTARTTIMEAM,KQSENDIMEAM,KQSITUATIONPM,KQSTARTTIMEPM,KQSENDIMEPM");
	kqImportGrid.setColTypes("ro,ro,ro,coro,coro,dhxCalendar,coro,dhxCalendar,dhxCalendar,coro,dhxCalendar,dhxCalendar");
	
	kqImportGrid.setColAlign('left,left,left,left,center,center,center,center,center,center,center,center');
	kqImportGrid.setColSorting('str,str,str,str,str,dhxCalendar,str,dhxCalendar,dhxCalendar,str,dhxCalendar,dhxCalendar');
	kqImportGrid.setInitWidths("*,*,90,*,90,90,85,*,*,85,*,*");
	kqImportGrid.setColumnHidden(0,true);
	kqImportGrid.setColumnHidden(1,true);
	
	kqImportGrid.enableValidation(true, false);
	kqImportGrid.setColValidators(',,,,,,,,,,,,');
	kqImportGrid.setDateFormat('%Y-%m-%d',null, 5);
	kqImportGrid.setDateFormat('%Y-%m-%d %H:%i',null, 7);
	kqImportGrid.setDateFormat('%Y-%m-%d %H:%i',null, 8);
	kqImportGrid.setDateFormat('%Y-%m-%d %H:%i',null, 10);
	kqImportGrid.setDateFormat('%Y-%m-%d %H:%i',null, 11);
	//kqImportGrid.setDateFormat('%Y-%m-%d');
	kqImportDp = new dataProcessor(controlUrl+"&pid="+pid);
	kqImportDp.setUpdateMode('off');
	kqImportDp.init(kqImportGrid);
	kqImportGrid.init();
	
	kqImportGrid.attachFooter(["<div id='kqImportGrid_recinfoArea' style='width:100%;height:100%'></div>", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan", "#cspan"], ['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
	kqImportGrid.enablePaging(true,20,5,"kqImportGrid_recinfoArea");
	kqImportGrid.setPagingSkin('toolbar','dhx_skyblue');
	kqImportGrid.load(controlUrl+"&pid="+pid+"", 'xml');

	kqImportGrid.attachEvent('onEditCell',
        function(stage, rId, cInd, nValue, oValue) {
            return false;
       	}
    );
		
	var importToolbar = a.attachToolbar();
	var tbar = [{type:"label",text:"姓名:"},
	 			{type:"input",id:"xm"}, 
	 			{type:"label",text:"部门:"},
				{type:"combo",id:"dept",name:'dept',width:"110"},
				{type:"datebetween",id: 'rq',format: '%Y-%m-%d',width: '80',ksText:'开始时间：',jsText:'结束时间：'},
				{type:"button",id:"query",text:"查询"},
				{id:'imp',text:'导入考勤记录',img:'excel_imp.png'},
				{id:'download',text:'下载模板',img:'excel_exp.png'}
			    ];
	importToolbar.render(tbar);
	importToolbar.addSpacer('imp');
	importToolbar.getCombo("dept").loadXML(CONTEXT_PATH +"/servlet/RlzyServlet?ac=loadDeptCombo");
	
		
	importToolbar.attachEvent('onClick',function(id){
		//var checked = kqImportGrid.getCheckedRows(kqImportGrid.getColIndexById("UIDS"));
		var str = "1=1";
		if(id == 'imp'){
			importDataFile();
		}else if(id == 'download'){
			var filePrintType = "kqImport";
			var sql = "select t.fileid from APP_TEMPLATE  t where t.templatecode='"
            + filePrintType + "'";
		   dwr.engine.setAsync(false);
		    rzglMainMgm.getWorkTime(sql, function(str) {
		                fileid = str;
		            });
		   dwr.engine.setAsync(true);
		   var openUrl = CONTEXT_PATH +"/servlet/RlzyServlet?ac=dowload&fileid=" + fileid + "&pid=" + CURRENTAPPID;
		    document.all.formAc.action = openUrl;
		    document.all.formAc.submit();
		}else if(id == 'query'){
			//得到ToolBar上的过滤条件组成json串。
			var start = importToolbar.getCalendarValue("rq","start");
			var end = importToolbar.getCalendarValue("rq","end");
			var xm = importToolbar.getValue("xm");
			var dept = importToolbar.getCombo('dept').getActualValue();
			
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
			
			kqImportGrid.clearAndLoad(encodeURI(controlUrl+"&str="+str));
		}
	});
	//导入数据
	
	var fileForm;
	function importDataFile(){
		var allowedDocTypes = "xls,xlsx";
		var windows = new dhtmlXWindows();
		importWin = windows.createWindow('importWin',0,0,400,130);
		importWin.setText('上传文件');
		importWin.denyResize();
		importWin.setModal(1);
		importWin.centerOnScreen();
		importWin.button('stick').hide();
		importWin.button('park').hide();
		importWin.button('minmax1').hide();
		var importWintbar = importWin.attachToolbar("","bottom");
		importWintbar.setIconsPath(CONTEXT_PATH+"/dhtmlx/images/icon/");
		
		var str = [
			{ type:"file" , name:"filename",label:"请选择文件:",inputWidth:250, labelLeft:15, labelTop:5, inputTop:5  }
		];
		var winToolbar = [{id:'upload',text:'上传',img:'excel_imp.png'}];
		importWintbar.render(winToolbar)
		importWintbar.setItemCenter();
		importWintbar.attachEvent("onClick", function(id) {
	       	if(id == 'upload'){
   		  	 //  var filename=fileForm.getItemValue("filename");
               if(filename!=""){
                   var fileExt=filename.substring(filename.lastIndexOf(".")+1,filename.length).toLowerCase();
                   if(allowedDocTypes.indexOf(fileExt)==-1){
                   		dhxMessageWin("请选择Excel文档！");
                       	return;
                   }else{
						document.getElementById("uploadForm").submit();
						main_layout.progressOn();
                   }
               }else{
               		dhxMessageWin("请选择要上传的文件！");
               		return;
               }
	       	}else if(id == 'close'){
	       		importWin.close();
	       		main_layout.progressOff();
	       	}
   		});
		var rows = 3;//excel导入模板表头行数，从0开始计数。
		var url = CONTEXT_PATH +"/servlet/RlzyServlet?ac=importData&bean="+beanName+"&rows="+rows+"&pid="+pid;
		var formHtml = '<form id="uploadForm" method="post" action="'+url 
				+'" enctype="multipart/form-data" target="importframe" ><div id="uploadFormDiv"></div></form>'
				+ '<iframe id="importframe" name="importframe" style="visibility:hidden;" >';	
		importWin.attachHTMLString(formHtml);
		fileForm = new dhtmlXForm("uploadFormDiv", str);
		
		//获取文件名称
		var filename = '';
   		fileForm.attachEvent('onChange',function(name,value){
   			if(name == 'filename'){
   				filename = value;
   			}
   		});   	
	}
	
}
//回调函数
function addCallback(msg){
	importWin.close();
	main_layout.progressOff();
	kqImportGrid.clearAndLoad(controlUrl+"&pid="+pid);
	alert(msg);
}
dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器