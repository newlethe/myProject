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
var businessType="PCAqgkSafetymonthAffix"
var accident_bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkAccidenrInfo"

var pidAndFileCountArray = [];

//一周前的日期字符串表示形式
var afterDate = new Date().add(Date.DAY, -7).format('Y-m-d');
			
DWREngine.setAsync(false);
	pcAqgkService.getAttachNumberForPrj(afterDate, function(list){
		if(list.length > 0) {
			for(var i=0; i<list.length; i++) 
			{
				var tmp = [];
				tmp.push(list[i][0]);
				tmp.push(list[i][1]);
				pidAndFileCountArray.push(tmp);
			}
		}
	});
DWREngine.setAsync(true);

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
	    /**
		{
           header: "人身安全事故列表",
           dataIndex: "pname",
           width: 120,
           align:"center",
           hidden: true,
           renderer:function(value,meta,rec){
           		var v = rec.get('pid');
           		var num=0;
           		DWREngine.setAsync(false);
					baseDao.findByWhere2(accident_bean, "pid='"+v+"' and accidentType='RSSG' and REPORT_STATUS in (1,3)",function(list){
						if(list.length>0){
							num=list.length;
						}
					});
					
				DWREngine.setAsync(true);
          		 return "<a href='javascript:projDetail(\""+v+"\",\"RSSG\")'>"+num+"</a>"
          	}
        },{
        	header:'设备安全事故列表',
        	dataIndex: "pname",
        	hidden: true,
        	width: 120,
        	align:"center",
        	renderer:function(v,meta,rec){
        		var v = rec.get('pid');
           		var num=0;
           		DWREngine.setAsync(false);
					baseDao.findByWhere2(accident_bean, "pid='"+v+"' and accidentType='SBSG' and REPORT_STATUS in (1,3)",function(list){
						if(list.length>0){
							num=list.length;
						}
					});
					
				DWREngine.setAsync(true);
          		 return "<a href='javascript:projDetail(\""+v+"\",\"SBSG\")'>"+num+"</a>"
          	}
        },  */
        {
        	header:'隐患排查治理',
        	dataIndex: "pname",
        	width:100,
        	align:"center",
        	renderer:function(v,meta,rec){
        		var pid = rec.get('pid');
        		var pname = rec.get('prjName');
				return "<a href='javascript:jumpToHiddenDanger(\""+pid+"\",\""+pname+"\")'>查看</a>"}
        },{
        	header:'最新安全报告',
        	dataIndex: "pname",
            width:100,
        	align:"center",
        	renderer:function(v,meta,rec){
        		var v = rec.get('pid');
        		if(pidAndFileCountArray.length > 0) {
        			for(var i=0; i<pidAndFileCountArray.length; i++)
					{
						if(v==pidAndFileCountArray[i][0])
						{
							return "<a href='javascript:downloadfile(\""+v+"\")'><font color='blue'>附件["+pidAndFileCountArray[i][1]+"]</font></a>";
						}
					}
        		}
        		
        		return "附件[0]";
			}
        }
	]
	
	var p = new PC.ProjectStatisGrid({
		prjRenderer:function(value,meta,record,store){
			var pid=record.get('pid');
			var pname=record.get('prjName');
			return "<a href=javascript:loadFirstModule('"+pid+"','"+pname+"')>"+value+"</a>";
		},
		ds:projDS,
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
});

function jumpToHiddenDanger(pid, pname) {
	var url = BASE_PATH + "PCBusiness/aqgk/baseInfoInput/pc.aqgk.hiddenDanger.trace.jsp?pid="+pid+"&pname="+pname;
	window.location.href = url;
}

function downloadfile(pid){
	//安全管理目前固定根文件分类（aqxxbs 201207271425434940000 aqwmsg aqsgjc）
	var fileids = "";
	if(pid){
		var nsql = "select uids from com_file_info where pid='" + pid +"'"
			+ " and to_char(file_createtime,'yyyy-mm-dd')>='"+afterDate+"' and report_status='1'"
			+ " and file_sort_id in" 
			+ " (select uids from com_file_sort connect by prior uids=parent_id" 
			+ " start with uids='aqxxbs' or uids='aqwmsg' or uids='aqsgjc' or uids='201207271425434940000')"; 
		DWREngine.setAsync(false);
			baseDao.getDataAutoCloseSes(nsql,function(ids){
				fileids = ids;
				if(ids.length > 0) {
					fileids = "("
					for(var i=0; i<ids.length; i++) 
					{
						if(i==ids.length-1) {
							fileids += "'"+ids[i] +"')";
						}
						else
						{
							fileids += "'"+ids[i] +"',"
						}
					}
				}
			});
		DWREngine.setAsync(true);
	}
	var param = {
		whereCondition:  "transaction_id in" + fileids +" and transaction_type='FAPAttach'"
	};
	showMultiFileWin(param);
	multiFileWin.setTitle("最新安全报告");
}

function projDetail(pid,accidentType){
	if(pid){
		var pname="";
		DWREngine.setAsync(false);
			var bean="com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo";
			baseDao.findByWhere2(bean, "pid='"+pid+"'",function(list){
				if(list.length>0){
					pname=list[0].prjName;
				}
			});
		switchoverProj(pid,pname);
		DWREngine.setAsync(true);
		parent.lt.expand();
		parent.proTreeCombo.show();
		parent.proTreeCombo.setValue(CURRENTAPPID)
		parent.backToSubSystemBtn.show();
		var text = "人身安全事故列表";
		if(accidentType=="SBSG") text = "设备安全事故列表";
		if(top.pathButton&&top.pathButton.setText&&top.selectedSubSystemName){
		   top.pathButton.setText("<b>当前位置:"+top.selectedSubSystemName+"/"+text+"</b>")
		}
		parent.frames["contentFrame"].location.href =CONTEXT_PATH+'/PCBusiness/aqgk/baseInfoInput/pc.aqgk.accident.query.jsp?isQuery=true&edit_accidentType='+accidentType;
	}
}

