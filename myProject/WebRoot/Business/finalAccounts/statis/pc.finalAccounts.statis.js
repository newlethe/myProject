if(parent.CT_TOOL_DISPLAY){
    parent.CT_TOOL_DISPLAY(false);
}

var _reg=/,/g    //正则表达式
var sqlPid=USERPIDS.replace(_reg,"','");
	sqlPid="('"+sqlPid+"')";

Ext.onReady(function (){


    var projDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo",				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params:"pid in"+sqlPid
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "pid"
        }, [
        	{name: 'pid', type: 'string'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	
	var _columns = [
		{
			header : '开工日期',
			dataIndex : 'buildStart',
			align : 'center',
			width :80,
			renderer : Ext.util.Format.dateRenderer('Y-m-d') // Ext内置日期renderer
		},
		{
			header : '竣工日期',
			dataIndex : 'buildEnd',
			align : 'center',
			width :80,
			renderer : Ext.util.Format.dateRenderer('Y-m-d') // Ext内置日期renderer
		},
		{
			header : '竣工决算报表',
			dataIndex : 'uids',
			width : 150,
			align : 'center',
			renderer : function(value, meta, record) {
				var pid = record.get('pid');
				var prjName = record.get('prjName');
				var lsh = "";
				//查询上报状态和流水号
				DWREngine.setAsync(false);
				faReportDWR.getFAReportLshByPid(pid,function(str){
					lsh = str;
				});
				DWREngine.setAsync(true);
				if(lsh == "0"){
					return "未上报";
				}else if(lsh == "1" ){
					return "<a href='javascript:showFAReport(\""+pid+"\")'>" + '查看' + "</a>";
				}else{
					return "<a href='javascript:downloadFile(\""+lsh+"\")'>" + '查看' + "</a>";
				}
			}
		}
		
		
		
	]
	
	var p = new PC.ProjectStatisGrid({
		prjRenderer:function(value,meta,record,store){
			var pid=record.get('pid');
			var pname=record.get('prjName');
			var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
				//output += '\'"><a href="javascript:loadFirstModule(\'' + pid + '\', \'' + pname + '\')" >' + value + '</a></span>'
				output += '\'"><a href="javascript:loadMisModule(\'' + pid + '\', \'' + pname + '\')" >' + value + '</a></span>';
			return output;
		},
		ds:projDS,
		columns:_columns,
		viewConfig:{forceFit:true},
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
	})
	new Ext.Viewport({
		layout:'fit',
		items:[p]
	})
	//隐藏字段
	p.getColumnModel().setHidden(3,true);
	p.getColumnModel().setHidden(6,true);
	p.getColumnModel().setHidden(7,true);
	projDS.load();
	projDS.on('load',function(){
		//初始化所有项目单位报表数据记录
		var pidArr = new Array();
		for(var i=0;i<projDS.getCount();i++){
			pidArr.push(projDS.getAt(i).get('pid'))
		}
		faReportDWR.initAllFAUnitReport(pidArr);
	})
});

function showFAReport(pid) {
	//修改为弹出窗口
	window.showModalDialog(BASE_PATH+'Business/finalAccounts/report/fa.report.jsp?pid='+pid,'',"dialogWidth=660px;dialogHeight=430px");
}

function downloadFile(fileLsh) {
	if (fileLsh != "") {
		var openUrl = CONTEXT_PATH + "/filedownload?method=fileDownload&id=" + fileLsh;
		document.all.formAc.action = openUrl
		document.all.formAc.submit()
	} else {
		Ext.Msg.alert("提示", "该文件不存在!");
	}
}

function loadMisModule(pid, prjName){
	var modid = "";
	DWREngine.setAsync(false);
	faReportDWR.getModidByIsHaveAppUrl(pid,USERID,function(str){
		modid = str;
	});
	DWREngine.setAsync(true);
	if(modid != ""){
		switchoverProj(pid, prjName);
		parent.lt.expand();
		parent.proTreeCombo.show();
		parent.proTreeCombo.setValue(CURRENTAPPID)
		parent.backToSubSystemBtn.show();
	
		if (top.pathButton && top.pathButton.setText && top.selectedSubSystemName)
			top.pathButton.setText("<b>当前位置:"+ top.selectedSubSystemName + "/竣工决算报表</b>");
		//parent.frames['contentFrame'].location.href = url;
		loadModule(modid,parent.frames["contentFrame"],'');
	}
}


