var nowDate = new Date();
var nowYear = nowDate.getYear();
var nowMonth = nowDate.getMonth()+1;
var nowSjDesc = nowYear+'年'+(((nowMonth<10)?'0':'') + nowMonth)+'月'
var months = new Array()
var data_sj = new Array()
var combox_month,combox_sj
 var label_user_count
var deptId = ""
if(USERDEPTID!=null && USERDEPTID != ''){
	deptId = USERDEPTID
}else if(USERPOSID!=null && USERPOSID != ''){
	deptId = USERPOSID
}else{
	deptId = UNITID 
}
var kqDaysDeptZb
var upDeptName=(USERORG==""?UNITNAME:USERORG);
Ext.onReady(function (){
	var fm = Ext.form;			// 包名简写（缩写）
    
    //考勤报表上报，接受报表领导
    var leadArr = new Array();
    var lead = '';
	var cellPanel = new Ext.Panel({
        id : 'user',
		region: 'center',
        title: '部门员工加班未打卡情况说明表',
		//frame: true,
        border : false,
        layout: 'fit',
		html: '<iframe name="cellFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
    
    var bossCellPanel = new Ext.Panel({
        id : 'boss',
        region: 'center',
        title: '部门领导加班未打卡情况说明表',
        //frame: true,
        border : false,
        layout: 'fit',
        html: '<iframe name="bossCellFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
    });
	var contentPanel = new Ext.TabPanel({
        activeTab: 0,
        deferredRender: false,
        split: true,
        plain: true,
        border: true,
        region: 'center',
        forceFit: true,
        items: [cellPanel,bossCellPanel]
	});
    
//viewport--------------------------------------------------------------------------------------------------	
//    var viewport = new Ext.Viewport({
//        layout:'border',
//        items:[contentPanel]
//    });	
    //判断是否有领导加班未打卡
    var sql = "SELECT t.val1 FROM kq_days_dept_xb t WHERE t.sj_type LIKE '"+nowSj+"%' " +
            "AND t.val1 IN ('●','◇') AND t.unit_id IN " +
            "(SELECT ru.userid FROM rock_role2user ru ,rock_role r " +
            "WHERE ru.rolepk = r.rolepk AND r.rolename LIKE '%经理')";
    var hasBossOvertime = false;
    DWREngine.setAsync(false);
    baseMgm.getData(sql,function(list){
        if(list.length>0){
            hasBossOvertime = true;
        }
    })
    DWREngine.setAsync(true);
    
     if(hasBossOvertime){
        var viewport = new Ext.Viewport({
	        layout:'border',
	        items:[contentPanel]
	    }); 
    }else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items:[cellPanel]
        }); 
    }
    
//viewport--------------------------------------------------------------------------------------------------	

//加载数据--------------------------------------------------------------------------------------------------
	findKqDeptZb();
    var usetCell = bossCell = false;
    contentPanel.on('tabchange',function(value){
        var panelId = value.getActiveTab().id;
        if(panelId == "user" && usetCell == false){
            createOvertime();
        }else if(panelId == "boss" && bossCell == false){
            createBossOvertime();
        }
    })

    
    
//自定方法--------------------------------------------------------------------------------------------------
	function findKqDeptZb(){
		var rtn = false;
		DWREngine.setAsync(false);
		rlzyKqglMgm.findKqDeptZbByDeptIdAndSj(deptId,nowSj,function(obj){
			if(obj!=null && obj.lsh!=null){
				kqDaysDeptZb = obj
				rtn = true;
			}else{
				rtn = false;
			}
		});
	    DWREngine.setAsync(true);
	    createOvertime()
	    return rtn
	}


	function createOvertime(){
		DWREngine.setAsync(false);
		rlzyKqglMgm.saveOrUpdateOvertime(nowSj,CURRENTAPPID,(USERORGID==""?UNITID:USERORGID),masterlsh,function(uidsArr){
		});
		DWREngine.setAsync(true);
		/*
		p_type	报表类型	必选	无	属性表中定义了报表类型
		p_date	数据期别	必选 	无	必须符合系统的数据期别规则
		p_corp	数据及报表所属单位（部门）
		在报表中定义{CORP}时，替换成该参数对应的单位名称。 	必选 	无	可以为 单位ID/部门ID模式，此种模式下表示应用于同单位下多个部门情况，根据部门ID查找报表模板，根据单位ID进行数据的存储。如果为单位ID模式，则报表模板和报表数据均用同一个单位ID。
		p_inx	指标（产品ID）。在报表中定义{INX}时，替换成该参数对应的指标（产品）名称。	可选 	无	指标管理中的指标ID
		saveAsFile	是否将cell保存为文件	可选	False	布尔类型
		savable	是否具备保存权限	可选	False	布尔类型
		p_key_col	保存数据主表主键	有主从关系结构且需要保存时，必选	无	数据表列
		p_key_val	保存数据主表主键值	有主从关系结构且需要保存时，必选	无	主表主键值
		拓展的参数
		p_remarkTable	数据说明信息对应的数据表	需要填写数据说明时，必选	无	数据表
		p_remarkCol	数据说明信息对应的数据列	需要填写数据说明时，必选	无	数据列
		p_where	拓展的数据过滤条件。针对仅用于数据查询的报表，除了报表的基础过滤条件外增加了该参数。	可选	无	table1`whereStr1|table2`whereStr2
		p_showVersion	是否显示历史版本按钮	可选	“none”	字符串，none或block
		p_showRemark	是否显示数据说明按钮	可选	“none”	字符串，none或block
		*/
		var whereStr="masterlsh ='"+masterlsh+"'";
		cellType = 'KQ_DAYS_OVERTIME';
		cellDate = nowSj
		corp = (USERORGID==""?UNITID:USERORGID)
		corp = (USERORGID==""?UNITID:USERORGID) + '/' + kqDaysDeptZb.deptId;
		REMARKTABLE = ''
		REMARKCOL = ''
        p_where = "KQ_DAYS_OVERTIME`isboss=0";
		cellUrl = "/"+ROOT_CELL+ "/cell/eReport.jsp?openCellType=iframe&p_type="
			+cellType+"&p_date=" + cellDate + "&p_corp=" + corp +"&p_inx=zb_seqno"
			+"&savable=true"+ "&p_key_col=MASTERLSH&p_key_val=" + masterlsh
			+"&p_showVersion=none&p_showRemark=none&p_saveAsFile=false"
			+"&p_remarkTable="+REMARKTABLE+"&p_where="+p_where;
        document.all.cellFrame.src = cellUrl;
        usetCell = true;
	}	
	
	//
	function createBossOvertime(){
	   var whereStr="masterlsh ='"+masterlsh+"'";
        cellType = 'KQ_DAYS_OVERTIME';
        cellDate = nowSj
        corp = (USERORGID==""?UNITID:USERORGID)
        corp = (USERORGID==""?UNITID:USERORGID) + '/' + kqDaysDeptZb.deptId;
        REMARKTABLE = ''
        REMARKCOL = ''
        p_where = "KQ_DAYS_OVERTIME`isboss=1";
        cellUrl = "/"+ROOT_CELL+ "/cell/eReport.jsp?openCellType=iframe&p_type="
            +cellType+"&p_date=" + cellDate + "&p_corp=" + corp +"&p_inx=zb_seqno"
            +"&savable=true"+ "&p_key_col=MASTERLSH&p_key_val=" + masterlsh
            +"&p_showVersion=none&p_showRemark=none&p_saveAsFile=false"
            +"&p_remarkTable="+REMARKTABLE+"&p_where="+p_where;
        document.all.bossCellFrame.src = cellUrl;
        bossCell = true;
	}


   
});

function afterCellSaved(CellWeb,callback){

}
	
function onCellOpened(c){
    var CellWeb1 = c;
    var row,col;
    var maxCol = CellWeb1.GetCols(0)
    var maxRow = CellWeb1.GetRows(0)
    with(CellWeb1) {
        for( var c=1; c<maxCol; c++ ) {
            for( var r=1; r<maxRow; r++ ) {
                var cellStr = GetCellString(c, r, 0)
                if(cellStr.indexOf("table:")>-1) {
                    col = c;
                    row = r;
                    break;
                }
            }
        }
    }
    
    for(var i=row; i<=maxRow; i++) {
        var cellStr = CellWeb1.GetCellString(5, i, 0)
        if(cellStr == null || cellStr == "")
            CellWeb1.SetRowHidden(i,i);
    }
}

