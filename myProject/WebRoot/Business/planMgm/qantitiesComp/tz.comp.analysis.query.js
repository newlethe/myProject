var array_industryType = new Array();
var array_prjType = new Array();
var array_prjStage = new Array();
var appArr = new Array();

var proInfo = 
''+
'<table width="98%" border="0" cellpadding="5" cellspacing="1" bgcolor="#000000" id="proTable"> '+
'  <tr bgcolor="#FFFFFF"> '+
'    <td height="50" colspan="4" class="proTitle">{prjName}投资信息</td> '+
'  </tr> '+
'  <tr bgcolor="#FFFFFF"> '+
'    <td colspan="4">' +
'<span class="part">项目名称：{prjName}</span>' +
'<span class="part">所属单位：{prjName}</span>' +
'<span class="part">项目地址：{prjAddress} </span></td> '+
'  </tr> '+
'  <tr bgcolor="#FFFFFF"> '+
'    <td width="25%">项目编码：{pid}</td> '+
'    <td width="25%">投资完成（元）：{investScale}</td> '+
'    <td width="25%">开建日期：{buildStart}</td> '+
'    <td width="25%">是否核准：{isapproved} </td> '+
'  </tr> '+
'  <tr bgcolor="#FFFFFF"> '+
'    <td>产业类型：{industryType}</td> '+
'    <td>项目负责人：{prjRespond}</td> '+
'    <td>结束日期：{buildEnd}</td> '+
'    <td>总投资（核准）：{totalinvestment}</td> '+
'  </tr> '+
'  <tr bgcolor="#FFFFFF"> '+
'    <td>项目类型：{prjType} </td> '+
'    <td>项目阶段：{prjStage}</td> '+
'    <td>建设规模：{memoC2}</td> '+
'    <td>接入系统是否批复：{isapproval} </td> '+
'  </tr> '+
'</table> '+
'';

var inputData1 = {};
Ext.onReady(function() { 
    
    DWREngine.setAsync(false);
    appMgm.getCodeValue('产业类型',function(list){    
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            array_industryType.push(temp);          
        }
    }); 
    appMgm.getCodeValue('项目阶段',function(list){    
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            array_prjStage.push(temp);          
        }
    }); 
    appMgm.getCodeValue('项目类型',function(list){    
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            array_prjType.push(temp);           
        }
    }); 
    appMgm.getCodeValue('接入系统批复类型',function(list){    
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            appArr.push(temp);          
        }
    });
    
    baseDao.findByWhere2("com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo", "pid='"+CURRENTAPPID+"'",function(list){
        if(list.length>0){
            
            list[0].industryType = getDataFromArray(array_industryType,list[0].industryType);
            list[0].prjType = getDataFromArray(array_prjType,list[0].prjType);
            list[0].prjStage = getDataFromArray(array_prjStage,list[0].prjStage);
            list[0].isapproval = getDataFromArray(appArr,list[0].isapproval);
            
            list[0].buildStart = formatDate(list[0].buildStart);
            list[0].buildEnd = formatDate(list[0].buildEnd);
            if(list[0].prjAddress == null && list[0].memoC3 == null){
            	list[0].prjAddress = '';
            }else if(list[0].prjAddress == null && list[0].memoC3 != null){
            	 list[0].prjAddress = list[0].memoC3
            }else if(list[0].prjAddress != null && list[0].memoC3 == null){
            	 list[0].prjAddress = list[0].prjAddress+"省"
            }else{
            	 list[0].prjAddress = list[0].prjAddress+"省"+list[0].memoC3;
            }
            list[0].memoC2 = list[0].memoC2+"×"+list[0].memoC4+"MW"; 
            inputData1 = list[0];
        }
    });
    
    baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.SgccIniUnit", "unitid='"+inputData1.memoC1+"'",function(list){
        if(list.length>0){
            inputData1.memoC1=list[0].unitname;
        }
    });
    DWREngine.setAsync(true);
    
    //总投资分部情况
    var totalNorthPanel =  new Ext.Panel({
        region : 'north',
        //border : false,
        height : 180
    });
    var totalSouthPanel =  new Ext.Panel({ 
        region: 'center',
        //border : false,
        html : '<div id="tzTotal" style="width:780px;height:300px;"></div>'
    });
    
    var tabs = new Ext.TabPanel({
        border : false,
        activeTab : 0,
        items : [{
            id : 'tab_total',
            title : '总投资分布情况',
            layout : 'border',
            items : [totalNorthPanel,totalSouthPanel]
        }, {
            id : 'tab_compl',
            title : '工程投资完成情况',
//        html : '<div id="tzComplete" style="width:780px;height:510px;float:left;"></div><a class="tz" href="javascript:openTzWin()" >工程投资完成数据报表查询</a>'
        html : '<div id="tzComplete" style="width:1030px;height:510px;float:left;"></div>'
        }, {
            id : 'tab_sched',
            title : '工程进度完成情况',
//            html : '<div id="tzSchedule" style="width:780px;height:510px;float:left;"></div><a class="tz" href="javascript:openJdWin()" >工程进度完成数据报表查询</a>'
            html : '<div id="tzSchedule" style="width:1030px;height:510px;float:left;"></div>'
        }]
    });
    
    var panel = new Ext.Panel({
        title : '欢迎进入投资完成综合分析页面',
        border : false,
        layout:'fit',
        items : [tabs]
    });

     var viewport = new Ext.Viewport({
        layout:'fit',
        items: [panel]
     });
     
     var viewXtp1 = new Ext.XTemplate(proInfo);
        viewXtp1.overwrite(totalNorthPanel.body, inputData1);
     
     
    //参数依次为：swf文件、组件ID、宽度、高度、背景颜色、是否缩放
    //缩放参数：0图形不随容器大小变化，1图形随容器大小等比例缩放
    var charOne,charTwo,charThree;
    charOne = new Carton("/"+ROOT_CHART+"/XCarton.swf", "charOne", "100%", "100%", "#FFFFFF", "1");
    charOne.render("tzTotal");
    charOne.setParam("PID",CURRENTAPPID);
   	charOne.setParam("pname",CURRENTAPPNAME);
    charOne.setDataURL("PCBusiness/cml/tzTotal.cml");
    
    tabs.on('tabchange' , function(tabs,newTab,oldTab){
        if(newTab.id == "tab_total"){
            if(typeof charOne == "undefined"){
                charOne = new Carton("/"+ROOT_CHART+"/XCarton.swf", "charOne", "100%", "100%", "#FFFFFF", "1");
                charOne.render("tzTotal");
                charOne.setParam("PID",CURRENTAPPID);
                charOne.setDataURL("PCBusiness/cml/tzTotal.cml");
            }
        }
        if(newTab.id == "tab_compl"){
            if(typeof charTwo == "undefined"){
                charTwo = new Carton("/"+ROOT_CHART+"/XCarton.swf", "charTwo", "100%", "100%", "#FFFFFF", "1");
                charTwo.render("tzComplete");
              	charTwo.setParam("pname",CURRENTAPPNAME);
                charTwo.setDataURL("PCBusiness/cml/tzComplete.cml");
            }
        }
        if(newTab.id == "tab_sched"){
            if(typeof charThree == "undefined"){
                charThree = new Carton("/"+ROOT_CHART+"/XCarton.swf", "charThree", "100%", "100%", "#FFFFFF", "1");
                charThree.render("tzSchedule");
                charThree.setParam("pname",CURRENTAPPNAME);
                charThree.setDataURL("PCBusiness/cml/tzSchedule.cml");
            }
        }
    })
    
    function formatDate(value){
	    return value ? value.dateFormat('Y-m-d') : '';
	}
	
	function getDataFromArray(arr,str){
	    for(var i = 0;i<arr.length;i++){
	        if(str == arr[i][0]){
	            return arr[i][1];
	        }
	    }
	}
});


function openUrl(url){
    var w = (document.body.clientWidth*.98);
    var h = (document.body.clientHeight*.98);
    window.showModalDialog(url,"",
        "dialogWidth:"+w+"px;dialogHeight:"+h+"px;status:no;center:yes;resizable:no;Minimize:no;Maximize:no");
}

function openTzWin(){
    var xgridUrl = CONTEXT_PATH
        + "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
		var queryStr = "?";
		queryStr += 'sj_type=2011'; // 时间
		queryStr += '&unit_id='+defaultOrgRootID; // 取表头用
		//param.company_id = ''; // 取数据用（为空是全部单位）
		queryStr += '&keycol=uids';
		queryStr += '&headtype=INVEST_MONTH_REPORT';    //类型
		queryStr += '&ordercol=sj_type desc';
		queryStr += '&hasSaveBtn=false';    //是否显示保存按钮，如果支持新增、编辑、删除的操作，此参数设置为true;
		queryStr += '&hasInsertBtn=false';  //grid是否可新增；
		queryStr += '&hasDelBtn=false';     //grid是否可删除；
		queryStr += '&hasFooter=false';    //grid下面的汇总行是否显示
    openUrl(xgridUrl+queryStr);
}

function openJdWin(){
    var url = BASE_PATH+"PCBusiness/jdgk/pc.jdgk.index.gcjd.jsp";
    openUrl(url);
}
