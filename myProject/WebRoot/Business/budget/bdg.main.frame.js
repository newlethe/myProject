
var conid = "";
var conno = "";
var conname = "";
var conmoney = "";

//encodeURIComponent()函数，对传递的参数进行编码，使带#、+、%...等特殊符号能正常传递
if(PID!=""&&PRONAME!=""){
    switchoverProj(PID,PRONAME);
}
Ext.onReady(function (){

	function doLoad(){
		var modName = "合同"+this.text;
		var url = "";
		if (this.text)
		loadModule(modName, window.frames[0], "conid=" + conid + "&conname=" + conname + "&conno=" + conno)
	}
	var btnMoney = new Ext.Button({
		id: 'money',
		text: '合同分摊',
		tooltip: '合同分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			var appUrl;
			if ( hasNk == '0' ){
				appUrl = "Business/budget/bdg.money.apportion.jsp?conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
			}
			else{
				appUrl = "Business/budget/bdg.money.apportion.combine.jsp";
			}
			if(appUrl.indexOf("?")>-1) {
				appUrl = appUrl + "&"
			} else {
				appUrl = appUrl + "?"
			}
			window.frames[0].location.href = BASE_PATH
							+ appUrl +"conid="
							+ conid + "&conname=" + encodeURIComponent(conname)
							+ "&conmoney=" + conmoney + "&conno=" + conno + "&isquery=1";

		}
	});
	var btnChange = new Ext.Button({
		id: 'change',
		text: '变更分摊',
		tooltip: '变更分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.change.jsp?conid=" + conid + "&conname=" + encodeURIComponent(conname)
			 +　"&conmoney=" + conmoney+ "&conno=" + conno + "&hasNk=" + hasNk+"&conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
		}
	});
	var btnPayInfo = new Ext.Button({
		id: 'pay',
		text: '付款分摊',
		tooltip: '付款分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.payInfo.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno + "&hasNk=" + hasNk+"&conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
		}
	});
	var btnBreach = new Ext.Button({
		id: 'breach',
		text: '违约分摊',
		tooltip: '违约分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.breach.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname)+ "&conno=" + conno + "&hasNk=" + hasNk+"&conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
		}
	});
	var btnCompensate = new Ext.Button({
		id: 'compensate',
		text: '索赔分摊',
		tooltip: '索赔分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.compensate.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno + "&hasNk=" + hasNk+"&conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
		}
	});
	var btnBalance = new Ext.Button({
		id: 'balance',
		text: '结算分摊',
		tooltip: '结算分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.balance.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno+"&conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
		}
		
	});
	var btnMain = new Ext.Button({
		id: 'main',
		text: '合同信息主页',
		tooltip: '合同信息主页',
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.generalInfo.input.jsp?"+"conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
		}
	});
	var btnProject = new Ext.Button({
		id: 'project',
		text: '工程量分摊',
		tooltip: '工程量分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.project.apportion.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno + "&type=normal"+"&conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
		}
	});
	
	var btnChangeProject = new Ext.Button({
	    id : 'changeproject',
	    text : '工程量变更分摊',
	    tooltip : '工程量变更分摊',
	    iconCls :'btn',
	    disabled: true,
	    handler : function (){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.project.change.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno + "&type=normal";	        
	    }
	})
	var btnEqu = new Ext.Button({
		id: 'equation',
		text: '平衡检查',
		tooltip: '平衡检查',
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.conmoney.realmoney.jsp";
		}
	});
	
	var btnPro = new Ext.Button({
		id: 'equproject',
		text: '工程量检查',
		tooltip: '工程量检查',
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.bdgmoney.project.jsp";
		}
	});
	var btn = new  Ext.Button({
	      text : '返回',
	      iconCls :'returnTo',
	      handler : function (){
	          ///
	      }
	
	})
	var addToolBar = new Ext.Toolbar({
	    items :[btnProject, '&nbsp;&nbsp;', btnChangeProject, "->", '-', btnEqu, '&nbsp;&nbsp;', btnPro]
	})
    mainPanel = new Ext.Panel({
    	layout: 'fit',
    	region: 'center',
    	border: false,
    	header: false,
    	contentEl: 'mainDiv',
    	tbar: (DEPLOY_UNITTYPE == "0") ? '' : new Ext.Toolbar({
    	    items :[btnMoney, '&nbsp;&nbsp;', btnChange, '&nbsp;&nbsp;', btnCompensate, '&nbsp;&nbsp;', btnBreach, '&nbsp;&nbsp;', '-', btnPayInfo, '->', btnMain ]
    	}),
    	listeners : {
    	    "render" : function (){
    	       (DEPLOY_UNITTYPE == "0") ? '' : addToolBar.render(this.tbar);
    	    }
    	}
    })
    
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [mainPanel]
    });
	
	var gridTopBar = mainPanel.getTopToolbar();
//	with(gridTopBar){
//		add( btnMoney,"-",btnChange, "-",btnPayInfo , "-", btnCompensate, "-", btnBreach, 
//			"-",btnBalance,'-',btnProject,'-',btnEqu,'-',btnPro,'-',btnMain);
//	} 
	 function disableed(){
	     Ext.getCmp(value).disable();
	 }
	window.frames[0].location.href = CONTEXT_PATH + '/Business/budget/bdg.generalInfo.input.jsp?'+"conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE+"&dyView="+dyView;
});
 function enable(){
 	     if(OPTYPE!=""){
 	     if(OPTYPE==="MONEYAPP")
	     Ext.getCmp("money").enable();
 	     if(OPTYPE==="CHANGEAPP")
	     Ext.getCmp("change").enable();
 	     if(OPTYPE==="PAYAPP")
	     Ext.getCmp("pay").enable();
 	     if(OPTYPE==="CLAAPP")
	     Ext.getCmp("compensate").enable();
 	     if(OPTYPE==="BREAPP")
	     Ext.getCmp("breach").enable();
 	     if(OPTYPE==="BALAPP")
	     Ext.getCmp("balance").enable();
 	     if(OPTYPE==="PROAPP")
	     Ext.getCmp("project").enable();
//	     Ext.getCmp("equation").enable();
//	     Ext.getCmp("equproject").enable();
	     Ext.getCmp("main").enable();
//	     Ext.getCmp("changeproject").enable();
 	     }else {
	     Ext.getCmp("money").enable();
	     Ext.getCmp("change").enable();
	     Ext.getCmp("pay").enable();
	     Ext.getCmp("compensate").enable();
	     Ext.getCmp("breach").enable();
	     Ext.getCmp("balance").enable();
	     Ext.getCmp("project").enable();
	     Ext.getCmp("equation").enable();
	     Ext.getCmp("equproject").enable();
	     Ext.getCmp("main").enable();
	     Ext.getCmp("changeproject").enable();
 	     }
	 }
 function disableed(){
         Ext.getCmp("money").disable();
	     Ext.getCmp("change").disable();
	     Ext.getCmp("pay").disable();
	     Ext.getCmp("compensate").disable();
	     Ext.getCmp("breach").disable();
	     Ext.getCmp("balance").disable();
	     Ext.getCmp("project").disable();
	     Ext.getCmp("equation").disable();
	     Ext.getCmp("equproject").disable();
	     Ext.getCmp("main").disable();
	     Ext.getCmp("changeproject").disable();
 }	 