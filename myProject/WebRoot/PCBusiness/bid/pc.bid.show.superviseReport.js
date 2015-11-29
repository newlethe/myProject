var cellURL = "/"+ROOT_CELL+"/cell/eReport.jsp?";
var currDate = new Date();
var currMonth = (currDate.getMonth()+101+"").substring(1);
var curSjType = currDate.getFullYear() +currMonth;
var edit_unitid = USERBELONGUNITID;
var fliterSql="";
if(USERBELONGUNITTYPEID=="0"){
	edit_unitid = "103";
	fliterSql="(select pid from v_pc_bid_supervisereport_m where state='3' and unit_type_id='2' and sj_type='"+curSjType+"')";
}else if(USERBELONGUNITTYPEID=="2"){
	fliterSql="(select pid from v_pc_bid_supervisereport_m where state='3' and unit_type_id='A' and sj_type='"+curSjType+"' " +
			" and pid in (select unitid from sgcc_ini_unit start with unitid = '" + USERBELONGUNITID + "' connect by prior unitid = upunit))";
}
var sjArr=getTimeStoreArr(edit_unitid);
var unit2Name = ''; //招投标首页传递项目单位的二级公司名称

if(curSjType=="") {
	curSjType = currDate.getFullYear() +currMonth;
}
var	reportParams = {
		p_type: "ZTB_MONTH_REPORT",
		p_date:curSjType,
		savable:false,
		openCellType:'frame',
		p_corp:edit_unitid,
		onCellOpened:onCellOpened
	};
	
Ext.onReady(function(){
	var array_level2Unit=new Array();
	var dsCombo_level2Unit=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: [['','']]
	});
	DWREngine.setAsync(false);
	var bean="com.sgepit.frame.sysman.hbm.SgccIniUnit";
	baseDao.findByWhere2(bean, "unitTypeId='2'",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].unitid);
			temp.push(list[i].unitname);
			array_level2Unit.push(temp);			
		}
	});
	DWREngine.setAsync(true);
	dsCombo_level2Unit.loadData(array_level2Unit);
	var	level2UnitCombo=new Ext.form.ComboBox({
			id: 'unitCombo',
			anchor : '95%',
			width:200,
			listWidth:200,
			store:dsCombo_level2Unit,
        	displayField:'v',
       		valueField:'k',
        	typeAhead: true,
        	editable:false,
       		mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"请选择...",
        	value: edit_unitid,
       		selectOnFocus:true,
       		listeners:{
				select:function(cb,rec,inx){
					edit_unitid=rec.get('k');
					sjArr=getTimeStoreArr(edit_unitid);
					timeStore.loadData(sjArr);
					timeCombo.setValue(curSjType);
					reportParams.p_corp = edit_unitid;
					resetCellFrm();
				}
			}
		});

    var timeStore = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : sjArr
    });
    
    timeCombo = new Ext.form.ComboBox({
    	store:timeStore,
    	typeAhead : true,
		triggerAction : 'all',
		mode : 'local',
		valueField : 'k',
		displayField : 'v',
		editable:false,
//		allowBlank:true,
		value : curSjType,
		emptyText: '选择月份',
		width : 100,
    	listeners:{
    		select:function(cb,rec,inx){
					curSjType=rec.get('k');
					 resetCellFrm();
				}
    	}
    });
    var tbar = ['单位',level2UnitCombo,'&nbsp;&nbsp;时间&nbsp;',timeCombo];
    if(USERBELONGUNITTYPEID=="2")tbar=['&nbsp;&nbsp;时间&nbsp;',timeCombo];
    var cellSrc = (cellURL+Ext.urlEncode(reportParams));
    new Ext.Viewport({
        layout : 'fit',
        border : false,
        items:[{
        	xtype:'panel',
        	tbar:tbar,
        	html: '<iframe name="cellFrm" src="'+cellSrc+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
        }]
    });
});
function resetCellFrm(){
		 if(USERBELONGUNITTYPEID=="0"){
			 fliterSql="(select pid from v_pc_bid_supervisereport_m where state='3' and pid='"+edit_unitid
				+"' and unit_type_id='2' and sj_type='"+curSjType+"')";
		}
		else if(USERBELONGUNITTYPEID=="2"){
			fliterSql="(select pid from v_pc_bid_supervisereport_m where state='3' and unit_type_id='A' and sj_type='"+curSjType+"' " +
					" and pid in (select unitid from sgcc_ini_unit start with unitid = '" + USERBELONGUNITID + "' connect by prior unitid = upunit))";
		}		
		reportParams.p_date = curSjType;
		window.frames["cellFrm"].location.href=(cellURL+Ext.urlEncode(reportParams));
}
function onCellOpened(CellWeb1,win){
	var row,col;
	with(CellWeb1) {
			var maxCol = GetCols(0)
			var maxRow = GetRows(0)
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
	
	if(col&&row){
		//if(USERBELONGUNITTYPEID==0) {
			var unitName = Ext.getCmp('unitCombo').getRawValue();
			var unitIdTemp = Ext.getCmp('unitCombo').getValue();
			var reportTitle = unitName + "招标(合同)月度报表";
			if(unitIdTemp!="") {
				fliterSql="(select pid from v_pc_bid_supervisereport_m where state='3' and unit_type_id='A' and sj_type='"+curSjType+"' " +
					" and pid in (select unitid from sgcc_ini_unit start with unitid = '" + unitIdTemp + "' connect by prior unitid = upunit))";
			}
		//}
		var sql = "select distinct t.zb_seqno,t.unitname,t.unit_id from pc_bid_supervisereport_d t where t.unit_id in('"+pid+"') and t.zb_seqno in " +
			"(select e.zb_seqno from pc_bid_supervisereport_d e where e.sj_type='"+curSjType+"' " +
			"and e.unit_id in ("+fliterSql+") and e.zb_seqno is not null) order by t.unit_id asc";
			//sql="select *from pc_bid_supervisereport_d where 1=2";
			var whereSql = "sj_type='" + curSjType+ "' and pid='"+ edit_unitid+ "'";
		baseDao.getData(sql,function(lt){	
			var preUnitname = "";
			var startRow = row+1;
			if(lt.length>0) CellWeb1.InsertRow(row+1, lt.length,0);
			for(var i=0;i<lt.length;i++){
				CellWeb1.SetRowHeight(1, 25, row+1+i,0);
				CellWeb1.SetCellString(col,row+i+1,0,lt[i][0]+"/"+lt[i][2]);//混合报表
				if(col>1){
					var curUnitname = lt[i][1];
					CellWeb1.SetCellString(col-1,row+i+1,0,curUnitname);
					CellWeb1.SetCellAlign(col-1,row+i+1,0,4);
					CellWeb1.SetCellAlign(col-1,row+i+1,0,32);
					if(preUnitname==curUnitname){
						CellWeb1.MergeCells(col-1,startRow,col-1,row+1+i);
					}else{
						startRow = row+1+i;
						preUnitname = curUnitname;
					}
				} 
			}
			
		
			DWREngine.setAsync(false);
			baseDao.findByWhere2("com.sgepit.pcmis.bid.hbm.VPcBidSupervisereportM",
						whereSql, function(list) {
				if (list.length > 0) {
					masterRecord=list[0];
				}else{
					masterRecord="";
				}
			});
			DWREngine.setAsync(true);
			var mrd={"MEMO_VAR1":masterRecord.memoVar1,"MEMO_VAR2":masterRecord.memoVar2,
				"USER_ID":masterRecord.userId,"MEMO_VAR3":masterRecord.memoVar3,
				"corpname":masterRecord.unitname,"CREATE_DATE":masterRecord.createDate}
			CellDoc=new CellXmlDoc(CellWeb1);
			CellDoc.replaceSign(mrd);
			window.frames["cellFrm"].loadXMLData();
		})
	}
}

function getTimeStoreArr(unitid){
	var sjArr=new Array();
	DWREngine.setAsync(false);
	var whereSql="pid='"+ unitid+ "' and state='3' order by sj_type asc";
	if(USERBELONGUNITTYPEID=="2" || USERBELONGUNITTYPEID=="0"){
		whereSql="pid in (select  t1.unitid from SGCC_INI_UNIT t1 " +
				"where t1.unitid is not null and t1.unit_type_id = 'A' " +
				"start with t1.upunit = '"+unitid+"'  connect by  t1.upunit = PRIOR t1.unitid)  " +
				"and state='3' order by sj_type asc";
	}
	if( USERBELONGUNITTYPEID=="0"){
		whereSql="t.UNIT_TYPE_ID = '2' and t.state='3' order by t.sj_type asc";
	}
	baseDao.getData("select distinct t.SJ_TYPE from V_Pc_Bid_Supervisereport_M t where "+whereSql, function(list){
		if(list.length > 0){   
			for(var i=list.length-1; i>=0; i--)
			{   
				if(i == list.length-1){
				  curSjType = list[i];
				}
				var temp = new Array();
				temp.push(list[i])
				temp.push(list[i].toString().substr(0,4)+"年"+list[i].toString().substr(4,6)+"月")
				sjArr.push(temp);
			}
		}
		if(list.length==0){
			curSjType="";
		}
	});
	DWREngine.setAsync(true);
	return sjArr;
}
