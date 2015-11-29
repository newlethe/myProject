var mygrid,myDataProcessor
function buildInterface(){
	mygrid = new dhtmlXGridObject('gridbox');
	mygrid.enableSmartRendering(true,50);//异步加载
	
	var p = parent.xgridParam;
	var powerLevel = p.powerLevel;
	filter = p.filter
	var widths = p.widths==undefined?null:p.widths ;
	var queryToolbar = p.queryToolbar;
	
	mygrid.setHeader("员工姓名,部门,打卡情况,#cspan,#cspan,出差,请假,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,#cspan,考勤调整,旷工"); 
	if(powerLevel == 'geren'){
		mygrid.attachHeader("#rspan,#rspan,出勤,迟到,早退,#rspan,事假,病假,年休假,探亲假,产假,婚假,丧假,工伤假,#rspan,#rspan");
	}else{
		mygrid.attachHeader("#text_filter,#text_filter,出勤,迟到,早退,#rspan,事假,病假,年休假,探亲假,产假,婚假,丧假,工伤假,#rspan,#rspan");
	}
	mygrid.setInitWidths(widths);
	mygrid.setColAlign("center,center,center,center,center,center,center,center,center,center,center,center,center,center,center,center");
	mygrid.setColTypes("coro,coro,link,link,link,link,link,link,link,link,link,link,link,link,link,link");
	mygrid.setColSorting("str,str,str,str,str,str,str,str,str,str,str,str,str,str,str,str");
	//mygrid.setSkin("light");
	mygrid.init();
	
	mygrid.attachEvent('onEditCell',
       function(stage, rId, cInd, nValue, oValue) {
      		if(cInd == 0 && cInd ==1){
      			return false;
      		}
      		return true;
      	}
   );
	
	myDataProcessor = new dataProcessor(CONTEXT_PATH +"/servlet/RlzyServlet?ac=getKqtj&filter="+filter);
	myDataProcessor.setUpdateMode("off");
	myDataProcessor.init(mygrid);
	mygrid.load(CONTEXT_PATH +"/servlet/RlzyServlet?ac=getKqtj&filter="+filter, 'xml');
	
	queryToolbar.attachEvent('onClick',function(id){
		if(id == 'query'){
			var year = queryToolbar.getCombo("year").getSelectedValue();
			var month = queryToolbar.getCombo("month").getSelectedValue();
			var sj = year+month;
			if(year !='' && month !=''){
				str =' and kqdate='+sj;
				mygrid.clearAndLoad(CONTEXT_PATH +"/servlet/RlzyServlet?ac=getKqtj&filter="+filter+str);
			}
		}
	});
	
}
 function openDetail(userid,type) {
	 var width =  1000
	 var height = 450
	 var url = CONTEXT_PATH+"/Business/rlzy/kqgl/RzglKqhzQuery.jsp?userid="+userid+"&type="+type;
	 window.showModelessDialog(url, null,'dialogWidth:' + width + 'px;dialogHeight:' + height + 'px;center:yes;resizable:yes;Minimize=yes;Maximize=yes;')
  }
dhtmlxEvent(window,"load", buildInterface); //使用dhtmlxEvent兼容浏览器