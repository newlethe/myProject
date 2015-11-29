var currDate = new Date();
var currYear = (new Date()).getYear();
var cellURL = "/"+ROOT_CELL+"/cell/eReport.jsp?";
var curSjType = currDate.getFullYear();
var projCombo;
var reportParams = {
	p_type:"PC_TZGL_YEAR_PLAN_REPORT_VIEW",
	p_date:curSjType,
	p_corp:'103',
	p_inx:"PC_TZGL_YEAR_PLAN_REPORT",
	openCellType:'iframe'
};

Ext.onReady(function(){
    
    var sjArr=getYearBysjType(null,null);
    var curSjType = currDate.getFullYear()+"";
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
		value : curSjType,
		maxHeight:110,
		width : 100,
    	listeners:{
    		select:function(combo,record){
	       				resetCellFrm(combo);
	       			}
    	}
    });
    
    var cellSrc = (cellURL+Ext.urlEncode(reportParams));
    var mainPanel = new Ext.Panel({
		id : 'main-panel',
		tbar : ['<h2>基建项目年度投资计划报表</h2>','-','&nbsp;时间：',timeCombo,'->','单位：万元'],
		region : 'center',
		items:[{
			xtype:'panel',
			height : document.body.clientHeight*0.96,
        	html: '<iframe name="cellFrm" src="'+cellSrc+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
        }]
    })
    new Ext.Viewport({
        layout : 'fit',
        border : false,
        items:[mainPanel]
    });
});
function resetCellFrm(sjType){
	if(timeCombo.getValue()!=""){
		sjType = timeCombo.getValue();
		reportParams.p_date = sjType;
		window.frames["cellFrm"].location.href=(cellURL+Ext.urlEncode(reportParams));
	}
}

