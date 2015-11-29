if(parent.CT_TOOL_DISPLAY){
    parent.CT_TOOL_DISPLAY(false);
}
if(parent.wanyuan){
    //parent.wanyuan.setVisible(false);
    parent.wanyuan.setText('');
}

var _reg=/,/g    //正则表达式
var sqlPid=USERPIDS.replace(_reg,"','");
	sqlPid="('"+sqlPid+"')";
var primaryKey = "pid";
var editText = "查看";

Ext.onReady(function(){

	var perArr = new Array();
	DWREngine.setAsync(false);
	var sql = "select e1.pid,t.PERCENTCOMPLETE_ from edo_project e1, edo_task t " +
			"where e1.uid_ = t.projectuid_ and e1.name_ = '一级网络计划' and t.id_ = '1'";
	baseDao.getData(sql,function(list){
		for(var i=0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			perArr.push(temp);
		}
	})
	DWREngine.setAsync(true);

	var projDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo",				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params:"pid in"+sqlPid
		},
		proxy:new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader:new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: primaryKey
		}, [
			{name: 'buildStart',type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'buildEnd',type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'pid', type: 'string'},
			{name: 'yiPercent', type: 'string'},
			{name: 'liUid', type: 'string'},
			{name: 'yiUid', type: 'string'}
		]),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	
	var _columns = [
		{header:'开工日期',dataIndex:'buildStart',
		    align : 'right',
			renderer:formatDate
		},
		{header:'竣工日期',dataIndex:'buildEnd',
		    align : 'right',
			renderer:formatDate
		},
		{header:'建设工期<br>（月）',dataIndex:'',width:90,align:'right',
			renderer:function(value,meta,record){
				var start = formatDate(record.get('buildStart'));
				var end = formatDate(record.get('buildEnd'));
				
				//获得开工时间的年, 月, 日
				var s_year = parseInt(start.substr(0,4),10);
				var s_month = parseInt(start.substr(5,2),10);
				var s_day = parseInt(start.substr(8,2),10);
				
				//获得结束时间的年, 月, 日
				var e_year = parseInt(end.substr(0,4),10);
				var e_month = parseInt(end.substr(5,2),10);
				var e_day = parseInt(end.substr(8,2),10);
				
				//获得两个时间段相差的月份数(可以为小数)
				var dispMonth = ((e_year-s_year)*12+(e_month-s_month)+(e_day-s_day+1)/30).toFixed(1);
				if((dispMonth*10)%10<=2 && dispMonth>0)
				{
					return Math.floor(dispMonth);
				}
				else if((dispMonth*10)%10>2 && (dispMonth*10)%10<8 && dispMonth>0)
				{
					return (Math.floor(dispMonth)+Math.ceil(dispMonth))/2;
				}
				else if((dispMonth*10)%10>=8 && dispMonth>0)
				{
					return Math.ceil(dispMonth);
				}
				else
				{
					return 0;
				}
			}	
		},
		{header:'进度计划<br>完成率',dataIndex:'yiPercent',width:90,align:'right',
			renderer:function(value,meta,record){
				var pid = record.get("pid");
				for(var i=0;i<perArr.length;i++){
					if(perArr[i][0]==pid){
						value = perArr[i][1];
						continue;
					}
				}
				return value===""?"0%":(value+"%")
			}	
		},
		{header:'里程碑计划',dataIndex:'liUid',width:90,align:'center',
			renderer:function(value,meta,record){
				var pid = record.get("pid");
				var prjName = record.get("prjName");
				return "<a href='javascript:openPlan(\"li\",\""+value+"\",\""+pid+"\",\""+prjName+"\")'>"+editText+"</a>";
			}	
		},
		{header:'一级网络计划',dataIndex:'yiUid',width:100,align:'center',
			renderer:function(value,meta,record){
				var pid = record.get("pid");
				var prjName = record.get("prjName");
				return "<a href='javascript:openPlan(\"yi\",\""+value+"\",\""+pid+"\",\""+prjName+"\")'>"+editText+"</a>";
			}	
		},
		{header:'月度任务分析',dataIndex:'monthUid',width:160,align:'center',
			renderer:function(value,meta,record){
				var pid = record.get("pid");
				var prjName = record.get("prjName");
				return "<a href='javascript:openPlan(\"month\",\""+value+"\",\""+pid+"\",\""+prjName+"\")'>"+editText+"</a>";
			},
			summaryType:'count',summaryRenderer:function(v){
				return "<a style='font-size:12px;' href='"+BASE_PATH+"PCBusiness/jdgk/pc.jdgk.month.task.list.query.jsp'>多项目月度任务分析汇总</a>"
				}
		},
		{header:'项目周报',dataIndex:'weekReport',width:90,align:'center',
			renderer:function(value,meta,record){
				var pid = record.get("pid");
				var prjName = record.get("prjName");
				return "<a href='javascript:openPlan(\"week\",\""+value+"\",\""+pid+"\",\""+prjName+"\")'>"+editText+"</a>";
			}	
		}
	];
	
	var p = new PC.ProjectStatisGrid({
		prjRenderer:function(value,meta,record,store){
			var pid = record.get("pid");
			var prjName = record.get("prjName");
			var uid = record.get("liUid");
			return "<a href='javascript:loadFirstModule(\""+pid+"\",\""+prjName+"\",\"\")'>"+prjName+"</a>"
		},
		ds:projDS,
		bbar : ['zzzz'],
		columns:_columns,
		viewConfig:{forceFit:false},
		searchHandler:function(store,unitid,projName){
			systemMgm.getPidsByUnitid(unitid,function(list){
				var unit_pids = ""
				for(var i=0;i<list.length;i++){
					unit_pids+=",'"+list[i].unitid+"'";
				}
				if(unit_pids.length=="") 
					unit_pids="('')";
				else
					unit_pids="("+unit_pids.substring(1)+")";
					
				if(projName==null || projName ==""){
					if(unitid==null || unitid==""){
						store.baseParams.params="pid in"+sqlPid;
					}else{
						store.baseParams.params="pid in"+unit_pids;
					}
				}else{
					if(unitid==null || unitid==""){
						store.baseParams.params="pid in"+sqlPid+" and prj_name like '%"+projName+"%'";
					}else{
						store.baseParams.params="pid in"+unit_pids+" and prj_name like '%"+projName+"%'";
					}
				}
				store.load();
			});
		}
	});
	
	projDS.load();
	
	new Ext.Viewport({
		layout:'fit',
		items:[p]
	});
	//if(isEditPlan)p.setTitle('');
	p.getColumnModel().setHidden(3,true);
	p.getColumnModel().setHidden(6,true);
	p.getColumnModel().setHidden(7,true);

	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  

})

function openPlan(p,uid,pid,pname){
	var powername = p == "li" ? "里程碑计划" : p=="yi" ? "一级网络计划" : "月度任务分析";
	DWREngine.setAsync(false);
	switchoverProj(pid,pname)
	DWREngine.setAsync(true);
	parent.lt.expand();
	parent.proTreeCombo.show();
	parent.proTreeCombo.setValue(CURRENTAPPID)
	parent.backToSubSystemBtn.show();
	parent.pathButton.setText("<b>当前位置:"+parent.selectedSubSystemName+"/"+powername+"</b>")
	var url = "/PCBusiness/jdgk/pc.jdgk.project.jsp?projectid="+uid+"&plan="+p+"&isEditPlan="+isEditPlan+"&lvl=3";
	if (p == "month"){
		url = "/PCBusiness/jdgk/pc.jdgk.month.task.jsp";
	} else if (p == "week"){
		url = "/PCBusiness/jdgk/pc.jdgk.week.work.index.jsp?dydaView=true";
	}
	parent.frames["contentFrame"].location.href = CONTEXT_PATH + url;
}

//工程进展
function openReport(pid, pname, type)
{
	switchoverProj(pid,pname);
	var aw = screen.availWidth, ah = screen.availHeight;
	var url = BASE_PATH+"PCBusiness/jdgk/pc.jdgk.index.gcjd.jsp";
		window.showModalDialog(url,null,"dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;status:no;center:yes;" +
				"resizable:yes;Minimize:no;Maximize:yes");	
}