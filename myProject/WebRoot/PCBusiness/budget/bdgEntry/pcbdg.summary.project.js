if(parent.CT_TOOL_DISPLAY){
    parent.CT_TOOL_DISPLAY(false);
}

function prjRender(value, metadata, record) {
		var pid=record.get('pid');
		var pname=record.get('prjName');
		return "<a href=javascript:loadFirstModule('"+pid+"','"+pname+"')>"+value+"</a>"
	}
var str ="pid`"+USERBELONGUNITID;
var chart;
//得到项目编号, 项目合同总金额数据
var prj_conTotalValueArr = [];

var sql = "select pid, sum(convaluemoney) from v_con group by pid";

//得到项目编号, 合同分摊总金额, 预计超概金额
var prj_bdgArr = [];
var bdgSql = "select pid, conbdgappmoney,expectedAmountMoney,bidbdgmoney,bidconothermoney from v_bdg_info where bdgno='01'";
DWREngine.setAsync(false);
	 baseMgm.getData(sql, function(list){
	 	if(list!=null && list.length>0)
	 	{
			for(var i=0; i<list.length;i++)
			{
				var temp = new Array();
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				prj_conTotalValueArr.push(temp)
			}
	 	}
	 })
	 
	  baseMgm.getData(bdgSql, function(list){
	 	if(list!=null && list.length>0)
	 	{
			for(var i=0; i<list.length;i++)
			{
				var temp = new Array();
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				temp.push(list[i][2]);
				temp.push(list[i][3]);
				temp.push(list[i][4]);
				prj_bdgArr.push(temp)
			}
	 	}
	 })
DWREngine.setAsync(true);
Ext.onReady(function (){
    var roleDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pmis.budget.hbm.BdgInfo",				
	    	business: "pcBdgInfoMgm",
	    	method: "getBdgMainGridStr",
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
        	{name: 'bdgTotalMoney', type: 'float'},		//Grid显示的列，必须包括主键(可隐藏)
	    	{name: 'pid', type: 'string'},	
			{name: 'conMoney', type: 'float'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	roleDS.load()
	var _columns = [{
           header: (DEPLOY_UNITTYPE == "0") ? "执行概算" : "概算总金额",
           dataIndex: "bdgTotalMoney",
           align : 'right',
           width: 120,
           renderer: function (value){
            return  cnMoneyToPrec(value/10000,2)
           }
        },/**{
        	header:'合同分摊总金额',
        	align : 'right',
        	dataIndex: "conMoney",
        	width : 150,
        	renderer: function (value){
            return  cnMoneyToPrec(value/10000,2)
           }
        },{
            header: '差值',
        	dataIndex: "conMoney",
        	align : 'right',
        	width :150,
            renderer :function(value, cellmeta, record){
                var leftmoney =record.get('bdgTotalMoney')-record.get('conMoney');
                var left =cnMoneyToPrec(leftmoney/10000,2);
                return '<span style="color:red;">' + left + '</span>';
            }
        }*/
        {
//           header: "已签订合同<br>总金额",
           header: "合同金额",
           dataIndex: 'conTotalValue',
           width: 120,
           align: 'right',
           renderer: function(value,meta,record){
           				var v = record.get('pid');
		           		for(var i=0; i<prj_conTotalValueArr.length; i++)
		           		{
		           			if(v==prj_conTotalValueArr[i][0])
		           			{
		           				return cnMoneyToPrec(prj_conTotalValueArr[i][1]/10000,2);
		           			}	
		           		}
		           		return 0;
           			}
        }, 
        
        {
        	//BUG8335新增字段 zhangh 2015-11-18
			//系统自动计算，取所有招标项分摊到概算的累计金额；
			header : '招标对应概算金额',
			dataIndex : 'bidbdgmoney',
			width : 120,
			align : 'right',
			renderer:  function(valeu, meta,record){
           					var v = record.get('pid');
							for(var i=0; i<prj_bdgArr.length; i++)
							{
								if(v==prj_bdgArr[i][0])
									return cnMoneyToPrec(prj_bdgArr[i][3]/10000,2);
							}
			        	   	return 0;
           			} 
		},
        
          {
//           header:"合同实际分摊<br>总金额",
           header:"合同分摊金额",
           dataIndex: 'coMoney',
           width: 120,
           align: 'right',
           renderer:  function(valeu, meta,record){
           					var v = record.get('pid');
							for(var i=0; i<prj_bdgArr.length; i++)
							{
								if(v==prj_bdgArr[i][0])
									return cnMoneyToPrec(prj_bdgArr[i][1]/10000,2);
							}
			        	   	return 0;
           			} 
        }, 
        
         {
			//BUG8335新增字段 zhangh 2015-11-18
			//招标合同结余金额=（已签合同）招标对应概算金额-招标合同分摊金额 
			header : '招标合同结余金额',
			width : 120, 
			align : 'right',
			dataIndex : 'bidconothermoney',
			renderer:  function(valeu, meta,record){
           					var v = record.get('pid');
							for(var i=0; i<prj_bdgArr.length; i++)
							{
								if(v==prj_bdgArr[i][0])
									return cnMoneyToPrec(prj_bdgArr[i][4]/10000,2);
							}
			        	   	return 0;
           			} 
		},
        	
		{
//         header:'预计超概金额',
           header:'预计结余金额',
           dataIndex: 'precastMoney',
           width: 120,
           hidden : true,
           align: 'right',
           renderer: function(v){
				for(var i=0; i<prj_bdgArr.length; i++)
				{
					if(v==prj_bdgArr[i][0])
						return cnMoneyToPrec(prj_bdgArr[i][2]/10000,2);
				}
				return 0;
           } 
        }, 
        	{
           header : '概算动态管理台帐',
           align : 'center',
           dataIndex : 'bdgMoney',
           width : 90,
           hidden : true,
           renderer : function (value, cellmeta, record){
	           			var pid = record.get('pid');
	           			var pname = record.get('prjName');
	           			return "<a href='javascript:turnTo(\"" + pid
										+ "\",\"" + pname + "\")'>" + '查看'
										+ "</a>"
           			  }
        }, {
           header:'项目编号',
           dataIndex: 'pid',
           hidden : true,
           width: 180
        }
	]
	
	var p = new PC.ProjectStatisGrid({
		prjRenderer:prjRender,
		title:'<center><b><font size=3>项目概算基本信息一览表</font></b></center>',
		ds:roleDS,
		region : 'center',
		columns:_columns,
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
		items:[p,{
			region:'south',
			height:240,
			split:true,
			layout:'border',
			items:[{
				region:'center',
				html:'<div id="myChart" style="height:100%"></div>'
			}]
		}]
	})
	
	p.getColumnModel().setHidden(3, true);              //隐藏产业类型字段  
	p.getColumnModel().setHidden(6, true);             //隐藏建设性质字段
	p.getColumnModel().setHidden(7, true);             //隐藏项目负责人字段
	//参数依次为：swf文件、组件ID、宽度、高度、背景颜色、是否缩放
    //缩放参数：0图形不随容器大小变化，1图形随容器大小等比例缩放
    chart = new Carton("/"+ROOT_CHART+"/XCarton.swf", "ChartId", "100%", "100%", "#FFFFFF", "1");
    chart.render("myChart");
    //读取服务器端的配置文件
    chart.setDataURL("PCBusiness/cml/bdg.cml");
    p.on('cellclick',function(g,rowIndex,colIndex,e){
    	changeCarton(rowIndex);
    });
    roleDS.on('load', function(){
		changeCarton(0)
    });
	//修改图形界面
    function changeCarton(i){
        var record = roleDS.getAt(i);
        if(record!=null){
	    	var pid = roleDS.getAt(i).get('pid');
	        var pname = roleDS.getAt(i).get('prjName');
			chart.setParam("pid",pid);
	    	chart.setParam("pname",pname);
        }
    }
});
function turnTo(pid,prjname){
DWREngine.setAsync(false);
switchoverProj(pid,prjname)
DWREngine.setAsync(true);
window.location.href=BASE_PATH+"PCBusiness/budget/bdgEntry/pc.bdg.info.report.jsp";
}

function lookDetail(value){
	var url=BASE_PATH+"PCBusiness/budget/bdgEntry/pc.bdg.info.report.jsp?pid="+value;
	var Height=window.screen.height;
    var Width=window.screen.width;
    var width=1000; height=450;
    var top,left;
    if (Height==600)
    {
       top="10px";
       left=(Width-parseInt(width))/2;
    }
    else
    {
      top=(Height-parseInt(height))/2;
      left=(Width-parseInt(width))/2;
    }
   window.open (url, '概算动态管理台帐', 'height='+height+', width='+width+', top='+top+', left='+left+', toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no'); 
}
