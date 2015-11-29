Ext.onReady(function() {
    
	var tabs = new Ext.TabPanel({
		//renderTo : Ext.getBody(),
        border : false,
		activeTab : 0,
		items : [{
            id : 'tab_info',
			title : '合同信息汇总分析',
			html : '<div id="contInfo"></div>'
		}, {
            id : 'tab_sign',
			title : '合同签订数据分析',
			html : '<div id="contSign"></div>'
		}, {
            id : 'tab_pay',
            title : '合同付款数据分析',
            html : '<div id="contPay"></div>'
        }]
	});

	 var viewport = new Ext.Viewport({
        layout:'fit',
        items: [tabs]
     });
     
    //参数依次为：swf文件、组件ID、宽度、高度、背景颜色、是否缩放
    //缩放参数：0图形不随容器大小变化，1图形随容器大小等比例缩放
    var chartInfo,chartSign,chartPay;
    chartInfo = new Carton("/"+ROOT_CHART+"/XCarton.swf", "chartInfo", "100%", "100%", "#FFFFFF", "1");
    chartInfo.render("contInfo");
    chartInfo.setParam("pname",CURRENTAPPNAME);
    chartInfo.setDataURL("PCBusiness/cml/contInfo.cml");
    
    tabs.on('tabchange' , function(tabs,newTab,oldTab){
        if(newTab.id == "tab_info"){
            if(typeof chartInfo == "undefined"){
                chartInfo = new Carton("/"+ROOT_CHART+"/XCarton.swf", "chartInfo", "100%", "100%", "#FFFFFF", "1");
                chartInfo.render("contInfo");
                chartInfo.setDataURL("PCBusiness/cml/contInfo.cml");
            }
        }
        if(newTab.id == "tab_sign"){
		    if(typeof chartSign == "undefined"){
                chartSign = new Carton("/"+ROOT_CHART+"/XCarton.swf", "chartSign", "100%", "100%", "#FFFFFF", "1");
                chartSign.render("contSign");
                chartSign.setParam("pname",CURRENTAPPNAME);
                chartSign.setDataURL("PCBusiness/cml/contSign.cml");
            }
        }
        if(newTab.id == "tab_pay"){
		    if(typeof chartPay == "undefined"){
                chartPay = new Carton("/"+ROOT_CHART+"/XCarton.swf", "chartPay", "100%", "100%", "#FFFFFF", "1");
                chartPay.render("contPay");
                chartPay.setParam("pname",CURRENTAPPNAME);
                chartPay.setDataURL("PCBusiness/cml/contPay.cml");
            }
        }
    })
});

function clickFlexFun(t,conttype){
    var url = "";
    if(t=="sign"){
        url = BASE_PATH+"Business/contract/cont.generalInfo.input.jsp?query=true&conttype="+conttype;
    }else if(t=="pay"){
        url = BASE_PATH+"Business/complexQuery/contractPayinfoQuery.jsp?conttype="+conttype;
    }else{
        return false;
    }
    openUrl(url);
}

function clickFlexSignFun(conttype,contyear){
    var url = BASE_PATH+"Business/contract/cont.generalInfo.input.jsp?query=true&conttype="+conttype+"&contyear="+contyear;
    openUrl(url);
}

function clickFlexPayFun(conttype,contyear){
    var url = BASE_PATH+"Business/complexQuery/contractPayinfoQuery.jsp?conttype="+conttype+"&contyear="+contyear;
    openUrl(url);
}
function openUrl(url){
    var w = (document.body.clientWidth*.98);
    var h = (document.body.clientHeight*.98);
    window.showModalDialog(url,"",
        "dialogWidth:"+w+"px;dialogHeight:"+h+"px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
}