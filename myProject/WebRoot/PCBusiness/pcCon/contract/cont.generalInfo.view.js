

var conBean = "com.sgepit.pmis.contract.hbm.ConOveView"
var countInfoList = new Array();
var partBs= new Array();
var contractType = new Array();
var contarctType2 = new Array();

var sortType = new Array();
var BillState = new Array();
var payways = new Array();
var penaltytypes = new Array();
var changes = new Array();
var compensateTypes = new Array();
var billTypes = new Array();
var bidways=new Array();
var conAllInfo = null;
var tabPay, tabChange, tabBreach, tabCompensate, tabBalance
var payMoneyTotal,alreadyMoney,processMoney
var disableBtn = windowMode == "1";
Ext.onReady(function (){
   
	DWREngine.setAsync(false);	
	appMgm.getCodeValue('合同划分类型',function(list){         //获取合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contractType.push(temp);			
		}
    }); 
    conpartybMgm.getPartyB(function(list){        				 //获取乙方单位
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].partybno);			
			temp.push(list[i].partyb);		
			partBs.push(temp);			
		}
    });
   	baseMgm.findById(conBean, g_conid, function(con_obj){
    	conAllInfo = con_obj;
    	appMgm.getCodeValueForContractSort(con_obj.condivno,function(list){	
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);	
				sortType.push(temp);			
			}
		 }); 
    });
    
    appMgm.getCodeValue('合同状态',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			BillState.push(temp);			
		}
    }); 
    appMgm.getCodeValue('合同付款方式',function(list){         //获取合同付款方式
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			payways.push(temp);			
		}
    }); 
    appMgm.getCodeValue('合同变更类型',function(list){         //获取变更类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			changes.push(temp);			
		}
    }); 
    appMgm.getCodeValue('合同索赔类型',function(list){         //获取合同索赔类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			compensateTypes.push(temp);			
		}
    }); 
    appMgm.getCodeValue('合同违约类型',function(list){         //获取合同违约类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			penaltytypes.push(temp);			
		}
    }); 
    appMgm.getCodeValue('合同结算类型',function(list){         //获取合同违约类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			billTypes.push(temp);			
		}
    }); 
     baseDao.findByWhere2('com.sgepit.pcmis.bid.hbm.PcBidZbContent',"pid='"+CURRENTAPPID+"'",function(list){ 
     	//获取招标内容
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].uids);		
			temp.push(list[i].contentes);	
			bidways.push(temp);			
		}
    }); 
    conexpMgm.getCountInfo("合同付款",g_conid,"",function(list){
    	for(var i=0;i<list.length;i++){
    		if(list[i][0] == "累计实际付款"){
    			payMoneyTotal = list[i][1];
    			break;
    		}
    	}
    })
    
    conpayMgm.getMoneyMessage(g_conid,function(obj){  // 获得合同查询里面的已付金额  和 处理中金额
    	alreadyMoney = obj[0];
    	processMoney = obj[1];
    })
    
    //DWREngine.endBatch();
    DWREngine.setAsync(true);
    DWREngine.setAsync(false);
    conpartybMgm.getPartyBBean(conAllInfo.partybno, function(pd_obj){
    	conAllInfo.partybbank = pd_obj.partybbank;
    	conAllInfo.partybbankno = pd_obj.partybbankno;
    	conAllInfo.partyb = pd_obj.partyb;
    	conAllInfo.partyblawer = pd_obj.partyblawer;
    	conAllInfo.address = pd_obj.address;
    	conAllInfo.postalcode = pd_obj.postalcode;
    	conAllInfo.phoneno = pd_obj.phoneno;
    	conAllInfo.homepage = pd_obj.homepage;
    	
    });
    DWREngine.setAsync(true);
    
    var dsContractType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:contractType
    });
    
    var payTypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : payways
    });
    //1结算 0未结算 -1流程中
    var billTypestate = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : billTypes
    });
    


	
	////////////////////////////////////////////////////////////////////////////////////////////////
	tabPay = new Ext.TabPanel({
        activeTab: 0,
        height: 155,  
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
           	id: 'pay',
			title: '付款情况',
			autoLoad: {
				url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
				params: 'type=pay&conid='+ g_conid,
				text: "Loading..."
			}
        }]
    });
    
    tabChange = new Ext.TabPanel({
        activeTab: 0,
        height: 155,        
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
	            	id: 'change',
	            	title: '变更情况',
					autoLoad: {
						url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
						params: 'type=change&conid='+ g_conid,
						text: "Loading..."
					}
	            }
        ]
    });

    tabBreach = new Ext.TabPanel({
        activeTab: 0,
        height: 155,        
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
	            	id: 'breach',
					title: '违约情况',
					autoLoad: {
						url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
						params: 'type=breach&conid='+ g_conid,
						text: "Loading..."
					}
	            }
        ]
    });
    
    tabCompensate = new Ext.TabPanel({
        activeTab: 0,
        height: 155,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
	            	id: 'compensate',
	                title: '索赔情况',
					autoLoad: {
						url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
						params: 'type=compensate&conid='+ g_conid,
						text: "Loading..."
					}
	            }
        ]
    });
    
    tabBalance = new Ext.TabPanel({
        activeTab: 0,
        height: 155,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
	          	id: 'balance',
	            title: '结算情况',
				autoLoad: {
					url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
					params: 'type=balance&conid='+ g_conid,
					text: "Loading..."
				}
        	}
        ]
    });
    var viewPanel = new Ext.Panel({
        id: 'view-panel',
        header: false,
        title: '合同详细信息',
        autoHeight: true,
        bodyStyle: 'padding: 5px;',
        border: false
    });
    
       //附件列表
    filelst = new Ext.TabPanel({
        activeTab: 0,
        height: 170,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[{
	          	id: 'filelist',
	            title: '附件列表',
				autoLoad: {
					url: BASE_PATH+'Business/contract/viewDisOth.jsp',
					params: 'type=adjunct&conid='+ conAllInfo.conid+"&conname=" + conAllInfo.conname + "&conno=" + conAllInfo.conno,
					text: "Loading..."
				}
        	}
        ]
    });
	var bodyPanel = new Ext.Panel({
    	//renderTo: document.body,
    	border: false,
    	autoScroll: true,
    	//autoWidth: true,
    	layout: 'fit',
		tbar: [
				new Ext.Button({
					text: '<font color=#15428b><b>&nbsp;合同详细信息</b></font>',
					iconCls: 'title'
				}),'->',
				new Ext.Button({
					hidden:query,
					text: '修改',
					iconCls: 'btn',
					handler: function(){
						var url = BASE_PATH+"Business/contract/cont.generalInfo.addorupdate.jsp?";
						window.location.href = url + "conid="+g_conid;
					},
					disabled : dyView=='true'?true:disableBtn
				})
		],
    	items: [viewPanel,filelst, tabPay, tabChange, tabCompensate, tabBreach]
    });
    
    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: [bodyPanel]
    });
   
	tabPay.getEl().setDisplayed("none");
	tabChange.getEl().setDisplayed("none");
	tabBreach.getEl().setDisplayed("none");
	tabCompensate.getEl().setDisplayed("none");
	tabFileDisplayOrHide();
	function tabFileDisplayOrHide(){
	    var countFile=0;
		DWREngine.setAsync(false);
        db2Json.selectData("select count(infoid) as infoid,count(fileno) as fileno from zl_info where modtabid='"+conAllInfo.conid+"'", function (jsonData) {
	    var list = eval(jsonData);
	    if(list!=null){
	   	 countFile=list[0].infoid;
	     		 }  
	      	 });
	    DWREngine.setAsync(true);
	    if(countFile==0){
	    	filelst.getEl().setDisplayed("none");
	    	countFile=0;
	    }    	    	
	}
    // 12. 加载表单数据
	var formData = new Object(conAllInfo);
	if(formData.convaluemoney == 0||alreadyMoney==0)formData.actualPercent ="";
	else formData.actualPercent = (alreadyMoney/formData.convaluemoney*100).toFixed(2) +'%';
	formData.condivno = contractTypeRender(formData.condivno);
	formData.sort = sortTypeRender(formData.sort);
	formData.billstate = billTypeRender(formData.billstate);
	formData.payway = payTypeRender(formData.payway);
	formData.signdate = formatDate(formData.signdate);
	formData.enddate = formatDate(formData.enddate);
	formData.startdate = formatDate(formData.startdate);
	formData.biddate = formatDate(formData.biddate);
	if(formData.convaluemoney!=0)
	formData.convalue = "￥"+formData.convaluemoney;
	if(formData.concha==0)formData.concha="";
	formData.changemoney=formData.concha;
	formData.payMoneyTotal = "￥"+payMoneyTotal
	formData.bidprice = "￥"+formData.bidprice
	formData.processMoney = "￥"+processMoney;
	if(alreadyMoney!=0&&alreadyMoney!=undefined){
		formData.alreadyMoney = "￥"+alreadyMoney;		
	}
	formData.judgeprice= "￥"+ formData.judgeprice;
	formData.bidtype=sortbidway(formData.bidtype);
	formData.performancedate=formatDate(formData.performancedate);
	if(formData.coninvoicemoney==0)formData.coninvoicemoney="";
	formData.invoicemoney=formData.coninvoicemoney;
	if(formData.bdgmoney==0||formData.bdgmoney==null)formData.bdgmoney="";
	if(formData.conmoney==0)formData.conmoney="";
    DWREngine.setAsync(true);
	for (var o in formData){
		if (formData[o] == null || formData[o] == "null") formData[o] = "&nbsp;"
		if(o.indexOf('money') != -1&&formData[o]!=0){
			formData[o] = "￥"+formData[o];	
		} 
	}
	
	var tplstr = new Array();
	tplstr = document.all.viewFormDiv.innerHTML
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
   		for(var i=0; i<payways.length; i++) {
   			if (payways[i][0] == value) {
   				str = payways[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	function contractTypeRender(value){	//合同类型
   		var str = '';
   		for(var i=0; i<contractType.length; i++) {
   			if (contractType[i][0] == value) {
   				str = contractType[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
	function sortTypeRender(value){
		var str = '';
   		for(var i=0; i<sortType.length; i++) {
   			if (sortType[i][0] == value) {
   				str = sortType[i][1]
   				break; 
   			}
   		}
   		return str;		
	}	
	//招标方式
   	function sortbidway(value){
		var str = '';
   		for(var i=0; i<bidways.length; i++) {
   			if (bidways[i][0] == value) {
   				str = bidways[i][1]
   				break; 
   			}
   		}
   		return str;		
	}	
   	function billTypeRender(value){	//合同状态类型
   		var str = '';
   		for(var i=0; i<BillState.length; i++) {
   			if (BillState[i][0] == value) {
   				str = BillState[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
});




