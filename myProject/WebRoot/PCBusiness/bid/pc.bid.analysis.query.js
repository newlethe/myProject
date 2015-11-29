Ext.onReady(function(){
    var mainPanel =  new Ext.Panel({ 
        border : false,
        title : '欢迎进入招标内容综合分析页面',
        html : '<div id="bidChart" style="width:900px;height:485px;"></div>'
    });
    
    var viewport = new Ext.Viewport({
        layout : 'fit',
        items : [mainPanel]
    });
    
    var charOne;
    charOne = new Carton("/"+ROOT_CHART+"/XCarton.swf", "charOne", "100%", "100%", "#FFFFFF", "1");
    charOne.render("bidChart");
    charOne.setParam("pname",CURRENTAPPNAME);
    charOne.setDataURL("PCBusiness/cml/bidChart.cml");
})

function openBidQuery(id){
    var w = (document.body.clientWidth*.98);
    var h = (document.body.clientHeight*.98);
    var url = BASE_PATH+"PCBusiness/bid/pc.bid.comp.query.jsp?chart=true&bidtypeid="+id;
    window.showModalDialog(url,"",
        "dialogWidth:"+w+"px;dialogHeight:"+h+"px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
}