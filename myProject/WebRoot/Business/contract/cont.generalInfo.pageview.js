

var conBean = "com.sgepit.pmis.contract.hbm.ConOveView"
var countInfoList = new Array();
var partBs = new Array();
var contractType = new Array();
var sortType = new Array();
var BillState = new Array();
var payways = new Array();
var penaltytypes = new Array();
var changes = new Array();
var compensateTypes = new Array();
var bidways=new Array();
var conAllInfo = null;
var tabPay, tabChange, tabBreach, tabCompensate, tabBalance,filelst
var payMoneyTotal,alreadyMoney,processMoney
var flowWindow;
Ext.onReady(function (){

	DWREngine.setAsync(false);	
    conpartybMgm.getPartyB(function(list){        				 //获取乙方单位
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].partybno);			
			temp.push(list[i].partyb);	
			partBs.push(temp);			
		}
    });
    conoveMgm.getContractSortByDept(USERDEPTID, function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					contractType.push(temp);
				}
			})
   	baseMgm.findById(conBean, g_conid, function(con_obj){
    	conAllInfo = con_obj;
    	
    });
    for(var i=0;i<contractType.length;i++){
    	
        if(conAllInfo.condivno==contractType[i][0]){
             appMgm.getCodeValue(contractType[i][1], function(list) { // 获取合同划分类型
					for (i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i].propertyCode);
						temp.push(list[i].propertyName);
						sortType.push(temp);
					}
				}); 
				break;
        }
    }
    
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
    
    DWREngine.setAsync(true);
    
    var dsContractType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:contractType
    });
    
    var payTypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : payways
    });
    var dsbidway = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: bidways
    });

    var dsPartB = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: partBs
    });
    
    var dsBillState = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:BillState
    });
    
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
    
    var viewPanel = new Ext.Panel({
        id: 'view-panel',
        header: false,
        title: '合同详细信息',
        autoHeight: true,
        bodyStyle: 'padding: 5px;',
        border: false
    });
    
	var bodyPanel = new Ext.Panel({
    	border: false,
    	autoScroll: true,
    	layout: 'fit',
		tbar: [
				new Ext.Button({
					text: '<font color=#15428b><b>&nbsp;合同详细信息</b></font>',
					iconCls: 'title'
				}),'->',
				new Ext.Button({
					text: '返回',
					iconCls: 'returnTo',
					handler: function(){
						history.back();
					}
				})
		],
    	items: [viewPanel, tabPay, tabChange, tabBreach, tabCompensate, filelst]
    	//items: [viewPanel,filelst]
    });
    
    var viewport = new Ext.Viewport({
        layout: 'fit',
        items: [bodyPanel]
    });
   

    // 12. 加载表单数据
	var formData = new Object(conAllInfo);
	if(formData.convaluemoney == 0)formData.actualPercent = 0;
	else formData.actualPercent = (alreadyMoney*100/formData.convaluemoney).toPrecision(4) +'%';	
	formData.condivno = contractTypeRender(formData.condivno);
	formData.sort = sortTypeRender(formData.sort);
	formData.billstate = billTypeRender(formData.billstate);
	formData.payway = payTypeRender(formData.payway);
	formData.signdate = formatDate(formData.signdate);
	formData.enddate = formatDate(formData.enddate);
	formData.startdate = formatDate(formData.startdate);	
	formData.biddate = formatDate(formData.biddate);
	formData.convalue = "￥"+formData.convaluemoney;
	formData.changemoney=formData.concha;
	formData.payMoneyTotal = "￥"+payMoneyTotal; 
	formData.bidprice = "￥"+formData.bidprice
	formData.processMoney = "￥"+processMoney;
	formData.alreadyMoney = "￥"+alreadyMoney;
	formData.judgeprice= "￥"+ formData.judgeprice;
	formData.bidtype=sortbidway(formData.bidtype)
	formData.performancedate=formatDate(formData.performancedate)
	for (var o in formData){
		if (formData[o] == null || formData[o] == "null") formData[o] = "&nbsp;"
		if(o.indexOf('money') != -1) formData[o] = "￥"+formData[o];
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
});

	function showFlow(_insid) {
		if (!flowWindow) {
			flowWindow = new Ext.Window({
						title : ' 流程信息',
						iconCls : 'form',
						width : 900,
						height : 500,
						modal : true,
						closeAction : 'hide',
						maximizable : false,
						resizable : false,
						plain : true,
						autoLoad : {
							url : BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
							params : 'type=flwInfo&insid=' + _insid,
							text : 'Loading...'
						}
					});
		} else {
			flowWindow.autoLoad.params = 'type=flwInfo&insid=' + _insid;
			flowWindow.doAutoLoad();
		}
		flowWindow.show();
	}


