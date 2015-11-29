var currDate = new Date();
var currYear = currDate.getYear();
var currMonth = (currDate.getMonth()+101+"").substring(1);
var cellURL = "/"+ROOT_CELL+"/cell/eReport.jsp?";
var reportParams = {
	p_type:"PROJ_INFO",
	p_date:"2010",
	p_corp:USERBELONGUNITID,
	p_inx:"PROJECT",
	openCellType:'frame'
};
Ext.onReady(function(){
    var cellSrc = (cellURL+Ext.urlEncode(reportParams));
    new Ext.Viewport({
        layout : 'fit',
        border : false,
        items:[{
        	xtype:'panel',
        	html: '<iframe name="cellFrm" src="'+cellSrc+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
        }]
    });
});