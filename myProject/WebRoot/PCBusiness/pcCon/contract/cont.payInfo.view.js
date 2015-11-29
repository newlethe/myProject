var conBean = "com.sgepit.pmis.contract.hbm.ConPay"
var SPLITB = "`"
var pid = CURRENTAPPID;
var payTypes = new Array();
var billTypes = new Array();
var conAllInfo = null;
var conAccInfoList = new Array();
var cashuse_list = new Array();

Ext.onReady(function (){

	DWREngine.setAsync(false);	
	appMgm.getCodeValue('合同付款方式',function(list){			//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		payTypes.push(temp);
    	}
    });
	appMgm.getCodeValue('单据状态', function(list) { // 获取付款类型
			for (i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].propertyCode);
				temp.push(list[i].propertyName);
				billTypes.push(temp);
			}
		});
    baseMgm.findById(conBean, g_payid, function(con_obj){
    	conAllInfo = con_obj;
    });
    
    conAccinfoMgm.getConAccinfoBeans(g_payid, function(list){
    	if (list != null){
	    	for (var i = 0; i < list.length; i++){
	    		var temp = new Array();
	    		temp.push(list[i].expression);
	    		temp.push(list[i].expvalue);
	    		conAccInfoList.push(temp);
	    	}
    	}
    });
    
    appMgm.getCodeValue('合同费用归属',function(list){			
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		cashuse_list.push(temp);
    	}
    });
    
    DWREngine.setAsync(true);
    
	var fm = Ext.form;
    
    var viewPanel = new Ext.Panel({
        id: 'view-panel',
        header: false,
        title: '合同付款详细信息',
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
					text: '<font color=#15428b><b>&nbsp;合同付款详细信息</b></font>',
					iconCls: 'title'
				}),'->',
				new Ext.Button({
					text: '修改',
					tooltip: '修改当前付款',
					iconCls: 'btn',
					disabled : dyView=='true'?true:false,
					handler: function(){
						var url = BASE_PATH+"Business/contract/cont.payInfo.addorupdate.jsp?";
						//国锦项目单独付款新增页面
			    		if(CURRENTAPPID=='1030603') {
				    		var url = BASE_PATH+"Business/contract/cont.payInfo.addorupdate_guoj.jsp?";
			    		}
						window.location.href = url + "conid="+g_conid+"&payid="+g_payid;
					
					}
				})
		],
    	items: [viewPanel]
    });
    
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [panel]
    });

    // 12. 加载表单数据
	var formData = new Object(conAllInfo);
	
	formData.billstate = billTypeRender(formData.billstate);
	formData.paytype = payTypeRender(formData.paytype);
	formData.cashuse = cashuseRender(formData.cashuse);
	formData.paydate = formatDate(formData.paydate);
	formData.invoiceno= "￥"+ formData.invoiceno;
	formData.applydate=formatDate(formData.applydate);
	formData.approvedate= formatDate(formData.approvedate);
	DWREngine.setAsync(false);	
	conoveMgm.getRealName(formData.actman, function(real_name){
		formData.actman = real_name;
    });
    DWREngine.setAsync(true);
	
	for (var o in formData){
		if (formData[o] == null || formData[o] == "null") formData[o] = "&nbsp;"
		if(o.indexOf('money') != -1) formData[o] = "￥"+formData[o];
	}
	
	var tplstr = new Array();
	tplstr = "<table style='width:100%' border=0 cellpadding=3 cellspacing=1>";
	tplstr += "<tr>";
	tplstr += "<td class='viewLabel'>合同名称</td><td class='viewData'>"+g_conname+"</td>";
	tplstr += "<td class='viewLabel'>合同编号</td><td class='viewData'>"+g_conno+"</td>";
	tplstr += "<td class='viewLabel'>付款凭证号</td><td class='viewData'>"+formData.paymentno+"</td>";
	tplstr += "</tr>";
	tplstr += document.all.viewFormDiv.innerHTML
	if (conAccInfoList.length > 0){
		var step = 0;
		for (var i = 0; i < conAccInfoList.length; i++){
			if (step % 2 == 0) tplstr += "<tr>";
			tplstr += "<td class='viewLabel'>"+conAccInfoList[i][0]+"</td>";
			tplstr += "<td class='viewData'>￥"+conAccInfoList[i][1]+"</td>";
			if (step % 2 == 1) tplstr += "</tr>";
			step++;
		}
	}
	tplstr += "</table>";
    var tpl = new Ext.Template(tplstr);
	tpl.overwrite(viewPanel.body, formData);

    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
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
   	function payTypeRender(value){	//付款类型
   		var str = '';
   		for(var i=0; i<payTypes.length; i++) {
   			if (payTypes[i][0] == value) {
   				str = payTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	function billTypeRender(value){	//单据状态类型
   		var str = '';
   		for(var i=0; i<billTypes.length; i++) {
   			if (billTypes[i][0] == value) {
   				str = billTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	function cashuseRender(value){
   		var str = '';
   		for(var i=0; i<cashuse_list.length; i++) {
   			if (cashuse_list[i][0] == value) {
   				str = cashuse_list[i][1]
   				break; 
   			}
   		}
   		return str;  	
   	}
});




