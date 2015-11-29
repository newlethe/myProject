
var bean = "com.sgepit.pmis.contract.hbm.ConBre"
var formData = null;
var breachTypes = new Array();

Ext.onReady(function (){


	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
		 history.back();
		 
		}
	});

	DWREngine.setAsync(false);
	
	appMgm.getCodeValue('合同违约类型',function(list){		//获取合同索赔类型
	   	for (i = 0; i < list.length; i++){
	   		var temp = new Array();
	   		temp.push(list[i].propertyCode);
	   		temp.push(list[i].propertyName);
	   		breachTypes.push(temp);
	    }
    });
	
	baseMgm.findById(bean, g_breid, function(obj){            // 获得表单数据
   		formData = obj
    });
    
    DWREngine.setAsync(true);
	
	formData.bretype = compTypeRender(formData.bretype)
	formData.bredate = formatDateFun(formData.bredate)

	for (var o in formData){
		if (formData[o] == null || formData[o] == "null"){
			formData[o] = "&nbsp;"
		} 
		if(o.indexOf('money') != -1){
			formData[o] = "￥"+formData[o];
		}
	}
    
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
				new Ext.Button({
					text: '<font color=#15428b><b>&nbsp;合同违约详细信息</b></font>',
					iconCls: 'title'
				}),'->',
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
	
	
	function compTypeRender(value){	                        //索赔类型
  		var str = '';
  		for(var i=0; i<breachTypes.length; i++) {
  			if (breachTypes[i][0] == value) {
  				str = breachTypes[i][1]
  				break; 
  			}
  		}
  		return str;
   	}
	
	function formatDateFun(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

});




