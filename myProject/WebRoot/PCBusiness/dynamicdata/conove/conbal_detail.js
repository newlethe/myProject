var conBean = "com.sgepit.pmis.contract.hbm.ConBal"
var SPLITB = "`"
var pid = CURRENTAPPID;
var billTypes = [['1','处理完毕'],['0','未开始'],['-1','处理中']];
var conAllInfo = null;
var conObj = null;
var ConOveObj;
var conAccInfoList = new Array();

Ext.onReady(function (){

     DWREngine.setAsync(false);
    baseMgm.findById(conBean, g_balid, function(con_obj){
    	conAllInfo = con_obj;
    });
    baseMgm.findById('com.sgepit.pmis.contract.hbm.ConOveView',conAllInfo.conid,function(obj){
    	conAllInfo.conid = obj.conid;
	    conAllInfo.conno = obj.conno;
	    conAllInfo.conname = obj.conname;
	    conAllInfo.convalue = obj.convaluemoney;
    })
    conAccinfoMgm.getConAccinfoBeans(g_balid, function(list){
    	if (list != null){
	    	for (var i = 0; i < list.length; i++){
	    		var temp = new Array();
	    		temp.push(list[i].expression);
	    		temp.push(list[i].expvalue);
	    		conAccInfoList.push(temp);
	    	}
    	}
    });
    DWREngine.setAsync(true);
    
    var billTypestate = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : billTypes
    });
    
	var fm = Ext.form;
	
	var fc = {		// 创建编辑域配置
    	 'balid': {
			name: 'balid',
			fieldLabel: '结算编号',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'conno': {
			name: 'conno',
			fieldLabel: '合同编号',
			anchor:'95%'
         }, 'conname': {
			name: 'conname',
			fieldLabel: '合同名称', 
			readOnly: true,         
			anchor:'95%'
         }, 'baldate': {
			name: 'baldate',
			format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
			fieldLabel: '结算日期',          
			anchor:'95%'
         }, 'convalue': {
			name: 'convalue',
			fieldLabel: '合同金额',  
			allowNegative: false,   
			readOnly : true,     
			anchor:'95%'
         }, 'balappmoney': {
			name: 'balappmoney',
			fieldLabel: '结算审定金额',  
			allowNegative: false,   
			readOnly : true,     
			anchor:'95%'
         }, 'actpaymoney': {
			name: 'actpaymoney',
			fieldLabel: '实际支付金额',  
			allowNegative: false,   
			readOnly : true,     
			anchor:'95%'
         }, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',  
			allowNegative:false,
			readOnly : true,        
			anchor:'95%'
         }, 'actman': {
			name: 'actman',
			fieldLabel: '经办人',
			readOnly : true,          
			anchor:'95%'
         }, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			readOnly : true,          
			anchor:'95%'
         }
    }
    
    var viewPanel = new Ext.Panel({
        id: 'view-panel',
        header: false,
        title: '合同结算详细信息',
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
					text: '<font color=#15428b><b>&nbsp;合同结算详细信息</b></font>',
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

    // 12. 加载表单数据
	var formData = new Object(conAllInfo);
	
	formData.billstate = billTypeRender(formData.billstate);
	formData.baldate = formatDate(formData.baldate);
	formData.convalue = "￥"+formData.convalue;
	for (var o in formData){
		if (formData[o] == null || formData[o] == "null") formData[o] = "&nbsp;"
		if(o.indexOf('money') != -1) formData[o] = "￥"+formData[o];
	}
	
	var tplstr = new Array();
	tplstr = "<table style='width:100%' border=0 cellpadding=3 cellspacing=1>";
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
});




