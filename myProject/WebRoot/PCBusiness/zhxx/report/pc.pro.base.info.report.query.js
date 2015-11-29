var param = new Object()
param.sj_type = '2013'; // 时间
param.unit_id = CURRENTAPPID; // 取表头用
param.company_id = ''; // 取数据用（为空是全部单位）
param.editable=false;
param.hasSaveBtn = false;
param.headtype = 'PRO_BASE_INFO_REPORT';
param.keycol = 'uids';
param.xgridtype = 'grid';
param.initInsertData = "pid`" + CURRENTAPPID;
//param.filter = " order by pc_pro_base_info_d.pid"
param.hasInsertBtn = false;
param.hasDelBtn = false;
//param.ordercol = "pid";
var xgridUrl = CONTEXT_PATH
			+ "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
xgridUrl+="?sj_type="+param.sj_type+"&unit_id="+param.unit_id+"&company_id="+param.company_id+"&editable="+param.editable+"&hasSaveBtn="+param.hasSaveBtn
	+"&headtype="+param.headtype+"&keycol="+param.keycol+"&xgridtype="+param.xgridtype+"&initInsertData="+param.initInsertData
	+"&hasInsertBtn="+param.hasInsertBtn+"&hasDelBtn="+param.hasDelBtn;
Ext.onReady(function(){
    new Ext.Viewport({
        layout : 'fit',
        border : false,
        items:[{
        	xtype:'panel',
        	html: '<iframe name="cellFrm" src="'+xgridUrl+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
        }]
    });
});