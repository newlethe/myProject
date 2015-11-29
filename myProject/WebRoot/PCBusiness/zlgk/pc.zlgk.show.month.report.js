var cellURL = "/"+ROOT_CELL+"/cell/eReport.jsp?";
var currDate = new Date();
var currMonth = (currDate.getMonth()+101+"").substring(1);
var curSjType = currDate.getFullYear() +currMonth;
var edit_unitid=USERBELONGUNITID;
if(USERBELONGUNITTYPEID=="0"){
	edit_unitid = "103";
}
var sjArr=getTimeStoreArr(edit_unitid);
var unitfilter = (USERBELONGUNITTYPEID=="0"||USERBELONGUNITTYPEID=="2")?getFile("Filter_zlyp.java"):"";
if(curSjType=="") {
	curSjType = currDate.getFullYear() +currMonth;
}
var	reportParams = {
	p_type:"ZLGL_ZLYP_MONTH_REPORT_2",
	p_date:curSjType,
	p_inx:"1",
	p_corp : edit_unitid,
	savable:false,
	openCellType:'frame',
	onCellOpened:onCellOpened,
	p_unitfilter:unitfilter
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
        	value:edit_unitid,
       		selectOnFocus:true,
       		listeners:{
				select:function(cb,rec,inx){
					edit_unitid=rec.get('k');
					sjArr=getTimeStoreArr(edit_unitid);
					timeStore.loadData(sjArr);
					timeCombo.setValue(curSjType);
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
		value :curSjType,
		width : 100,
    	listeners:{
    		select:function(cb,rec,inx){
					curSjType=rec.get('k');
					 resetCellFrm();
				}
    	}
    });
    var tbar=['单位',level2UnitCombo,'&nbsp;&nbsp;时间&nbsp;',timeCombo];
    if(USERBELONGUNITTYPEID=="2")tbar=['&nbsp;&nbsp;时间&nbsp;',timeCombo];
    if(USERBELONGUNITTYPEID=="0") {
	    edit_unitid = level2UnitCombo.getValue();
    }
    curSjType = timeCombo.getValue();
    reportParams = {
		p_type:"ZLGL_ZLYP_MONTH_REPORT_2",
		p_date:curSjType,
		p_inx:"1",
		p_corp : edit_unitid,
		savable:false,
		openCellType:'frame',
		onCellOpened:onCellOpened,
		p_unitfilter:unitfilter
	};
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
var masterRecord="";
function resetCellFrm(){
		DWREngine.setAsync(false);
		baseDao.findByWhere2("com.sgepit.pcmis.zlgk.hbm.VPcZlgkQuaInfo",
					"sj_type='" + curSjType+ "' and pid='"+ edit_unitid+ "'", function(list) {
			if (list.length > 0) {
				masterRecord=list[0];
			}else{
				masterRecord=null;
			}
		});
		DWREngine.setAsync(true);
		reportParams.p_date = curSjType;
		reportParams.p_corp = edit_unitid;
		if(masterRecord && masterRecord!=null) {
			reportParams.p_key_val =masterRecord['uids'];
		}
		window.frames["cellFrm"].location.href=(cellURL+Ext.urlEncode(reportParams));
}
function onCellOpened(CellWeb1,win){
	mrd={"CREATEDATE":"","UNIT_USERNAME":"","COUNT_USERNAME":"",
			"REPORT_PERSON":"","REPORT_PERSON_TEL":"",
			"corpname":""};

	if(masterRecord==""){
		DWREngine.setAsync(false);
		baseDao.findByWhere2("com.sgepit.pcmis.zlgk.hbm.VPcZlgkQuaInfo",
					"sj_type='" + curSjType+ "' and pid='"+ edit_unitid+ "'", function(list) {
			if (list.length > 0) {
				masterRecord=list[0];
			}else{
				masterRecord=null;
			}
		});
		DWREngine.setAsync(true);
	}
	if(masterRecord && masterRecord!=null) {
		mrd={"CREATEDATE":masterRecord.createdate,"UNIT_USERNAME":masterRecord.unitUsername,"COUNT_USERNAME":masterRecord.countUsername,
			"REPORT_PERSON":masterRecord.reportPerson,"REPORT_PERSON_TEL":masterRecord.reportPersonTel,
			"corpname":masterRecord.unitname};
	}
	CellDoc=new CellXmlDoc(CellWeb1);
	CellDoc.replaceSign(mrd);
}

//如果是集团用户，查看集团审核通过的二级单位的数据； 如果是二级单位用户，显示有项目单位数据被二级企业审核通过的
function getTimeStoreArr(unitid){
	var sjArr=new Array();
	DWREngine.setAsync(false);
	var whereSql="pid='"+ edit_unitid+ "' and report_status=3 order by sj_type asc";
	if(USERBELONGUNITTYPEID=="2"){
       whereSql="pid in (select  t1.unitid from SGCC_INI_UNIT t1 " +
				"where t1.unitid is not null and t1.unit_type_id = 'A' " +
				"start with t1.upunit = '"+edit_unitid+"'  connect by  t1.upunit = PRIOR t1.unitid)  " +
				"and report_status='3' order by sj_type asc";
	}
	
	baseDao.getData("select distinct t.SJ_TYPE from V_Pc_Zlgk_Qua_Info t where "+whereSql, function(list){
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
