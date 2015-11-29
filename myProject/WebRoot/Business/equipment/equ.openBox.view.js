
var bean = "com.sgepit.pmis.equipment.hbm.EquOpenBox"
var formData ;
var title = "合同： "　+ conname + ", 到货批次： " + ggNo + ",&nbsp;&nbsp;&nbsp;所有信息"
Ext.onReady(function(){
 
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
		 history.back();
		 
		}
	});

	DWREngine.setAsync(false);
	baseMgm.findById(bean, uuid, function(obj){            // 获得表单数据
   		formData = obj
    });
    DWREngine.setAsync(true);
	
	for (var o in formData){
		if (formData[o] == null || formData[o] == "null"){
			formData[o] = "&nbsp;"
		} 
		if(o.indexOf('money') != -1){
			formData[o] = "￥"+formData[o];
		}
	}
	formData.opendate = formatDate(formData.opendate)
	formData.checkdate = formatDate(formData.checkdate)
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
	 //加载表单数据
	var viewPanel = new Ext.Panel({
        id: 'view-panel',
        header: false,
        autoHeight: true,
        bodyStyle: 'padding: 5px;',
        border: false
    });
    var panel = new Ext.Panel({
    	//renderTo: document.body,
    	region: 'center',
    	border: false,
    	layout: 'fit',
		tbar: [
				{
				text: '<font color=#15428b><b>&nbsp;'+ title +'</b></font>',
				iconCls: 'title'
				},'->',
				new Ext.Button({
					text: '修改',
					tooltip: '修改当前开箱记录',
					iconCls: 'btn',
					handler: function(){
					var url = BASE_PATH+"Business/equipment/equ.openBox.addorupdate.jsp?";
					window.location.href = url + "conid=''&conname=" + conname +"&partB=''&ggId=''&partyId=''&ggNo=" + ggNo + "&uuid=" +uuid ;
					}
				}),'-',
				new Ext.Button({
					text: '返回',
					tooltip: '返回',
					iconCls: 'returnTo',
					handler: function(){
						history.back();
					}
				})
		],
    	items: [viewPanel]
    });
    
	var viewport = new Ext.Viewport({
	    layout: 'border',
	    items: [panel]
	});
	
	var tplstr = new Array();
	tplstr = document.getElementById('viewFormDiv').innerHTML; 
    var tpl = new Ext.Template(tplstr);
	tpl.overwrite(viewPanel.body, formData);
	

});




