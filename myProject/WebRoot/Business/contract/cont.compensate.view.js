
var bean = "com.sgepit.pmis.contract.hbm.ConCla"
var formData = null;
var compensateTypes = new Array();
var tabPay, tabChange, tabBreach, tabCompensate, tabBalance


Ext.onReady(function (){

	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			//window.location.href = BASE_PATH+"Business/contract/cont.compensate.input.jsp?conid="
		    //		+ g_conid + "&conname=" + conname + "&conno="+conno;
		     history.back();
		}
	});

	DWREngine.setAsync(false);
		appMgm.getCodeValue('合同索赔类型',function(list){		//获取合同索赔类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		compensateTypes.push(temp);
	    	}
	    });
	
		baseMgm.findById(bean, g_claid, function(obj){            // 获得表单数据
    	formData = obj
    });
    DWREngine.setAsync(true);
	
	formData.clatype = compTypeRender(formData.clatype)
	formData.cladate = formatDateFun(formData.cladate)
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
					text: '<font color=#15428b><b>&nbsp;合同索赔详细信息</b></font>',
					iconCls: 'title'
				}),'->',
				new Ext.Button({
					text: '修改',
					tooltip: '修改当前索赔',
					iconCls: 'btn',
					disabled :dyView=='true'?true:false,
					handler: function(){
						var url = BASE_PATH+"Business/contract/cont.compensate.input.addorupdate.jsp?";
						window.location.href = url + "conid="+g_conid+"&conno="+g_conno+"&conname="+g_conname+"&claid="+g_claid;
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
	tplstr = document.getElementById('viewFormDiv').innerHTML
    var tpl = new Ext.Template(tplstr);
	tpl.overwrite(viewPanel.body, formData);
	
  	function compTypeRender(value){	                        //索赔类型
  		var str = '';
  		for(var i=0; i<compensateTypes.length; i++) {
  			if (compensateTypes[i][0] == value) {
  				str = compensateTypes[i][1]
  				break; 
  			}
  		}
  		return str;
   	}
	
	 function formatDateFun(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
	
    function getComboxValue(k, ds){
    	var str = "&nbsp;"
    	for(var i=0; i<ds.getCount(); i++){
    		var r = ds.getAt(i)
    		if (r.get('k') == k) {
    			str = r.get('v')
    			break;
    		}
    	}
    	if (str != "")
    		return str
    	else
    		return k
    }
    // 下拉列表中 k v 的mapping 

});




