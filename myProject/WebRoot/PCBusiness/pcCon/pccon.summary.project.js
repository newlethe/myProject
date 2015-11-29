if(parent.CT_TOOL_DISPLAY){
    parent.CT_TOOL_DISPLAY(false);
}

function test(value, metadata, record) {
		  var pid=record.get('pid');
		  var pname=record.get('prjName');
		return "<a href=javascript:loadFirstModule('"+pid+"','"+pname+"')>"+value+"</a>"
	}
var str ="pid`"+USERBELONGUNITID;
var newconNum=0;
var newconMoney =0;
var totalconNum = 0;
var totalconMon = 0;
var monthpayNum = 0;
var monthpayMon = 0;
var totalpayNum = 0;
var totalPayMon = 0;
var projectname ='';
var chart;
var selectedPid;
var sj = (new Date().getYear())+""+(new Date().getMonth()+101+"").substr(1);
var roleDS;

Ext.onReady(function (){
    roleDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pcmis.contract.hbm.ConInfoBean",				
	    	business: "pcConMgm",
	    	method: "getConInfoGridStr",
	    	params:str
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount'
        }, [
        	{name: 'conValue', type: 'float'},		//Grid显示的列，必须包括主键(可隐藏)
	    	{name: 'pid', type: 'string'},	
			{name: 'changeMoney', type: 'float'},
			{name : 'alreadyPay', type : 'float'},
			{name : 'claMoney', type : 'float'},
			{name : 'balAppMoney', type : 'float'},
			{name : 'bdgMoney', type : 'float'},
			{name : 'conNum', type : 'float'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	roleDS.load();
	var _columns = [{
			header: "合同签订份数",
			dataIndex: "conNum",
			align : 'right',
			width: 130
		}, {
           header: "执行概算金额",
           dataIndex: "bdgMoney",
           align : 'right',
           hidden : true,
           width: 120,
           renderer: function (value,meta, record){
            	return cnMoneyToPrec(value/10000,2);
           }
        },{
           header: "合同签订金额",
           dataIndex: "conValue",
           align : 'right',
           width: 120,
           renderer: function (value){
            return cnMoneyToPrec(value/10000,2);
           }
        },{
           header: "合同付款金额",
           dataIndex: "alreadyPay",
           align : 'right',
           width: 120,
           renderer: function (value){
            return cnMoneyToPrec(value/10000,2)
           }
        }, {
			header : '合同执行概况',
			dataIndex : 'conExcute',
			align : 'center',
			width : 120,
			renderer : function (value, cellmeta, record){
				return "<span style=\"color:#2222AA;cursor:pointer;\" onmouseover=\"showDiv('" + record.get('pid') + 
					"','"+record.get('prjName') +"', event)\" onmouseLeave=\"hideDiv(event)\">查看</div>";
			}
        }
//        ,{
//        	 header : '合同动态管理台帐',
//        	 dataIndex : 'changeMoney',
//        	 align : 'center',
//        	 width : 130,
//        	 renderer : function (value, cellmeta, record){
//           			var pid = record.get('pid');
//           			var pname =record.get('prjName');
//               		return "<a href='javascript:turnTo(\"" + pid
//									+ "\",\"" + pname + "\")'>" + '查看'
//									+ "</a>"        	 
//        	 }
//           
//        }
        ,{
           header:'pid',
           dataIndex: 'pid',
           hidden : true,
           width: 180
        }
	]
	
	var p = new PC.ProjectStatisGrid({
		prjRenderer:test,
		title:'<center><b><font size=3>项目合同信息一览表</font></b></center>',
		ds:roleDS,
		columns:_columns,
		region:'center',
		viewConfig:{forceFit:false},
		searchHandler:function(store,unitid,projName){
			var sqlStr="";
			if(unitid!=""){
				sqlStr='pid`'+unitid;
			}
			if(projName!=''){
				sqlStr+=';proName`'+projName;
			}
			store.baseParams.params=sqlStr;
			store.load();
		}/*,
		bbar: new Ext.PagingToolbar({
		    pageSize : 10,
		    store : roleDS,
		    displayInfo : true,
		    displayMsg : ' {0} - {1} / {2}',
		    emptyMsg: "无记录。"
		})*/
	})
	//roleDS.load()
	new Ext.Viewport({
		layout:'border',
		items:[p]
	});
/**
		,{
			region:'south',
			height:220,
			split:true,
			layout:'border',
			items:[
				{
				region:'center',
				html:'<div id="myChart" style="height:100%"></div>'
			},
				{
				region:'east',
				width:280,
				html:'<div id="msg" style="height:100%"></div>'
			}]
		}]
	})
*/
	p.getColumnModel().setHidden(3, true);              //隐藏产业类型字段  
	p.getColumnModel().setHidden(6, true);             //隐藏建设性质字段
	p.getColumnModel().setHidden(7, true);             //隐藏项目负责人字段
	//参数依次为：swf文件、组件ID、宽度、高度、背景颜色、是否缩放
    //缩放参数：0图形不随容器大小变化，1图形随容器大小等比例缩放
/** chart = new Carton("/"+ROOT_CHART+"/XCarton.swf", "ChartId", "100%", "100%", "#FFFFFF", "1");
    chart.render("myChart");
    chart.setParam("mindate",2004);
    chart.setParam("maxdate",2011);
    //读取服务器端的配置文件
    chart.setDataURL("PCBusiness/cml/conove.cml");
    p.on('cellclick',function(g,rowIndex,colIndex,e){
    	changeCartonAndMsg(rowIndex);
    })
    roleDS.on('load', function(){
        changeCartonAndMsg(0)
    })
*/

});

function turnTo(pid,prjname){
	DWREngine.setAsync(false);
	switchoverProj(pid,prjname)
	DWREngine.setAsync(true);
	window.location.href=BASE_PATH+"PCBusiness/pcCon/pc.con.info.report.jsp";
}

    //修改图形界面和消息界面
    function changeCartonAndMsg(i){
    	var pid = roleDS.getAt(i).get('pid');
        var pname = roleDS.getAt(i).get('prjName');
    	DWREngine.setAsync(false);
    	projectname = pname;
		pcContractMgm.calculateMoneyByPid(pid, 'yyyyMM', sj, function(rtn) {
			newconNum = rtn.newconNum;
			newconMoney = rtn.newconMoney;
			totalconNum = rtn.totalconNum;
			totalconMon = rtn.totalconMon;
			monthpayNum = rtn.monthpayNum;
			monthpayMon = rtn.monthpayMon;
			totalpayNum = rtn.totalpayNum;
			totalPayMon = rtn.totalPayMon;
			selectedPid=pid;
			//金额转换
			newconMoney=(newconMoney/10000).toFixed(4);
			totalconMon=(totalconMon/10000).toFixed(4);
			monthpayMon=(monthpayMon/10000).toFixed(4);
			totalPayMon=(totalPayMon/10000).toFixed(4);
			loadMsg();
		})
		DWREngine.setAsync(true);
		chart.setParam("pid",pid);
    	chart.setParam("pname",pname);
    }
function loadMsg(){
	var style = "color:#FF0000;text-decoration:underline;padding:0 1px;";
	var tpl = new Ext.Template(
			'<div style="padding:10px 10px 0 10px; line-height:30px;">',
			//'<p><span style="'+style+'">{projectname}合同签订概况</span><br/>',
			'<p>本月新签订合同<u onclick="conCurMonWin()" style="cursor:hand"><span style="'+style+'">{newconNum}</span></u>份&nbsp;&nbsp;金额<span style="'+style+'">{newconMoney}</span>万元<br/>',
			'累计已签合同<u  onclick="conTotalWin()" style="cursor:hand"><span style="'+style+'">{totalconNum}</span></u>份&nbsp;&nbsp;金额<span style="'+style+'">{totalconMon}</span>万元<br/>',
			'<p>本月<u onclick="conPayCurMonWin()" style="cursor:hand"><span style="'+style+'">{monthpayNum}</span></u>项合同发生付款&nbsp;&nbsp;金额<span style="'+style+'">{monthpayMon}</span>万元<br/>',
			'累计<u onclick="conPayTotalMonWin()" style="cursor:hand"><span style="'+style+'">{totalpayNum}</span></u>项合同发生付款&nbsp;&nbsp;金额<span style="'+style+'">{totalPayMon}</span>万元',
			'</div>'		
		)
	tpl.overwrite('msg',{newconNum:newconNum,newconMoney:newconMoney,totalconNum:totalconNum,totalconMon:totalconMon,monthpayNum:monthpayNum,monthpayMon:monthpayMon,totalpayNum:totalpayNum,totalPayMon:totalPayMon,projectname : projectname});
}
//查看本月新签订合同列表窗口
function conCurMonWin(){
	var curMonUrl = CONTEXT_PATH+'/PCBusiness/pcCon/contract/cont.frame.jsp?sj='+sj+'&pid='+selectedPid+"&type=con";
	openModelessDialog(curMonUrl,"本月新签订合同信息查询");
}
//查看累计签订合同列表窗口
function conTotalWin(){
	var curMonTotalUrl = CONTEXT_PATH+'/PCBusiness/pcCon/contract/cont.frame.jsp?pid='+selectedPid+"&type=con";	
	openModelessDialog(curMonTotalUrl,"累计已签订合同信息查询");
}

//查看本月合同付款信息查询列表窗口
function conPayCurMonWin(){
	var curPayMonUrl = CONTEXT_PATH+'/PCBusiness/pcCon/contract/cont.frame.jsp?sj='+sj+'&pid='+selectedPid+"&type=conPay";
	openModelessDialog(curPayMonUrl,"本月新签订合同信息查询");
}
//查看累计合同付款信息查询列表窗口
function conPayTotalMonWin(){
	var curPayTotalUrl = CONTEXT_PATH+'/PCBusiness/pcCon/contract/cont.frame.jsp?pid='+selectedPid+"&type=conPay";
	openModelessDialog(curPayTotalUrl,"累计已签订合同信息查询");
}
function openModelessDialog(url,title){
		window.showModalDialog(url,title,"dialogHeight:800;dialogWidth:450;scroll:0;status:0;help:1;resizable:1;Minimize=no;Maximize=yes;");
}

//隐藏了图形，将右下角的合同签订情况信息显示到合同执行概况字段的div中 peng 2014-02-10
function showDiv(pid, prjName, event){
	DWREngine.setAsync(false);
	projectname = prjName;
	pcContractMgm.calculateMoneyByPid(pid, 'yyyyMM', sj, function(rtn) {
		newconNum = rtn.newconNum;
		newconMoney = rtn.newconMoney;
		totalconNum = rtn.totalconNum;
		totalconMon = rtn.totalconMon;
		monthpayNum = rtn.monthpayNum;
		monthpayMon = rtn.monthpayMon;
		totalpayNum = rtn.totalpayNum;
		totalPayMon = rtn.totalPayMon;
		selectedPid=pid;
		//金额转换
		newconMoney=(newconMoney/10000).toFixed(4);
		totalconMon=(totalconMon/10000).toFixed(4);
		monthpayMon=(monthpayMon/10000).toFixed(4);
		totalPayMon=(totalPayMon/10000).toFixed(4);
		loadMsg();
	})
	DWREngine.setAsync(true);
	//鼠标所在元素event.srcElement（IE支持） pengy 2014-02-11
	var top = getTop(event.srcElement);
	var left = getLeft(event.srcElement);
	//若div的下边界查出浏览器窗口，则在鼠标坐上显示，否则在左下显示
	document.getElementById('msg').style.top = document.body.clientHeight < (top + 220) ? (top - 205) : top;
	document.getElementById('msg').style.left = left - 280;
	document.getElementById('msg').style.display = 'block';
}

//判断鼠标移开时，是否是移进了div中，如果是，不隐藏，不是则隐藏
function hideDiv(event){
	var div = document.getElementById("msg");
	var x = event.clientX;
	var y = event.clientY;
	var divx1 = div.offsetLeft;
	var divy1 = div.offsetTop;
	var divx2 = div.offsetLeft + div.offsetWidth;
	var divy2 = div.offsetTop + div.offsetHeight;
	if(x < divx1 || x > divx2 || y < divy1 || y > divy2){  
		document.getElementById('msg').style.display = 'none';
	}
}

// 获取元素的纵坐标
function getTop(e) {
	var offset = e.offsetTop;
	if (e.offsetParent != null)
		offset += getTop(e.offsetParent);
	return offset;
}
// 获取元素的横坐标
function getLeft(e) {
	var offset = e.offsetLeft;
	if (e.offsetParent != null)
		offset += getLeft(e.offsetParent);
	return offset;
}
