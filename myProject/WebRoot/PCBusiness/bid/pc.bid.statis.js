
if(parent.CT_TOOL_DISPLAY){
    parent.CT_TOOL_DISPLAY(false);
}

Ext.onReady(function (){
    var roleDS = new PC.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.pmis.budget.hbm.BdgInfo",	//无作用			
	    	business: "pcBidService",
	    	method: "getZtbStatisticsByWhereOrderBy",
	    	params : 'pid`'+USERBELONGUNITID
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount'
        }, [
	    	{name: 'pid', type: 'string'},	
			{name: 'zbAppCount', type: 'int'},
			{name: 'zbAppStartCount', type: 'int'},
			{name: 'zbAppEndCount', type: 'int'},
			{name: 'zbConCount', type: 'int'},
			{name : 'zbAppSumAmount', type : 'float'},
			{name : 'contractSumAmount', type : 'float'},
			{name : 'zbAppTbPrice', type : 'float'},
			{name : 'bdgMoney', type : 'float'}
        ]),

        remoteSort: true,
        pruneModifiedRecords: true
    });
	roleDS.load()
	var _columns = [{
           header: "招标申请项目",
           dataIndex: "zbAppCount",
           hidden:true,
           align : 'center',
           width: 80,
           renderer:function(value,meta, record){
				var prjId = record.get('pid');
				return "<a href='javascript:toApplyQuery(\"" + prjId+ "\")'>"+value+"</a>";    	
           }
        },{
        	hidden:true,
        	header : '招标申请<br>总金额',
        	dataIndex : 'zbAppSumAmount',
        	align : 'right',
        	width : 120,
        	renderer : function (value){
			    return cnMoneyToPrec(value/10000,2);
			}
        },{
           hidden:true,
           header: "招标开始项目",
           dataIndex: "zbAppStartCount",
           align : 'center',
           width: 120
        },{
           header: "招标项目",
           dataIndex: "zbAppEndCount",
           align : 'right',
           width: 120,
           renderer:function(value,meta, record){
				var prjId = record.get('pid');
				var winName ="发放中标通知书";
				var rateStatus=100;
				var winUrl='PCBusiness/bid/pc.bid.issue.win.doc.jsp?hasBtn=false&pid='+ prjId+'&rateStatus='+rateStatus;
				return "<a href='javascript:openDialog(\"" + winUrl
							+ "\",\"" + winName + "\")'>"
							+ value + "</a>";
           } 
        },{
           header: "合同签订",
           dataIndex: "zbConCount",
           align : 'right',
           width: 120,
           renderer:function(value,meta, record){
				var prjId = record.get('pid');
				var winName ="合同签订情况跟踪";
				var rateStatus=100;
				var winUrl='PCBusiness/bid/pc.bid.contract.track.jsp?hasCon=1&pid='+ prjId;
				return "<a href='javascript:openDialog(\"" + winUrl
							+ "\",\"" + winName + "\")'>"
							+ value + "</a>";
           }            
          
        },{
        	header : '概算金额',
        	dataIndex : 'bdgMoney',
        	align : 'right',
        	hidden : true,
        	renderer : function (value){
			    return cnMoneyToPrec(value,2);
			},
           width: 120
        },{
        	header : '招标金额',
        	dataIndex : 'zbAppTbPrice',
        	align : 'right',
        	renderer : function (value){
			    return cnMoneyToPrec(value,2);
			},
           width: 120
        },{
        	header : '合同金额',
        	dataIndex : 'contractSumAmount',
        	align : 'right',
        	renderer : function (value){
			    return cnMoneyToPrec(value/10000,2);
			},
           width: 120
        },{
        	header : '招标(合同)<br>汇总查询',
        	dataIndex : 'contractSumAmount',
        	align : 'center',
            width: 110,
            hidden:true,
            renderer: function(value,meta, record){
				var prjId = record.get('pid');
				var prjName = record.get('prjName');
				var winName="招标(合同)汇总查询";
				var winUrl='PCBusiness/bid/pc.bid.show.superviseReport.jsp?pid='+ prjId +'&prjName='+prjName;				
				return  "<a href='javascript:openDialog(\"" + winUrl
							+ "\",\"" + winName + "\")'>"
							+ '查看'+ "</a>";
            }
        },{
        	header : '招投标汇总查询',
        	hidden:true,
        	dataIndex : 'comp',
        	align : 'center',
            width: 110,
            renderer: function(value,meta, record){
				var prjId = record.get('pid');
				var prjName = record.get('prjName');
				var winName="招投标汇总查询";
				var winUrl='PCBusiness/bid/pc.bid.comp.query.jsp?pid='+prjId;				
				return  "<a href='javascript:openDialog(\"" + winUrl
							+ "\",\"" + winName + "\")'>"
							+ '查看'+ "</a>";
            }
        },{
           header:'项目编号',
           dataIndex: 'pid',
           hidden : true,
           width: 80
        }
	]
	
	var grid = new PC.ProjectStatisGrid({
		prjRenderer:prjRenderer,
		title:'<center><b><font size=3>招投标信息一览表</font></b></center>',
		ds:roleDS,
		columns:_columns,
		viewConfig : {
					forceFit : false
				},
		searchHandler:function(store,unitid,projName){
			var st="过滤函数设定，需要在PC.ProjectStatisGrid中设定searchHandler属性，该属性的值一个函数，该函数有3个参数，一个参数是Store，" +
					"第二个参数是选定的单位id，第三个参数是项目名称的关键字，编写自己的过滤方法，可以用store.baseParams.params改变过滤条件"
			var sqlStr="";
			if(unitid!=""){
			sqlStr='pid`'+unitid;
			}
			if(projName!=''){
			sqlStr+=';proName`'+projName;
			}
	
			store.baseParams.params=sqlStr;
			store.load();
			
		}
	})
	//roleDS.load()
	new Ext.Viewport({
		layout:'fit',
		items:[grid]
	})
	
	//隐藏字段
	grid.getColumnModel().setHidden(3, true);              //隐藏产业类型字段  
	grid.getColumnModel().setHidden(6, true);             //隐藏建设性质字段
	grid.getColumnModel().setHidden(7, true);             //隐藏项目负责人字段
});

function prjRenderer(value, metadata, record) {
		  var pid=record.get('pid');
		  var pname=record.get('prjName');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
			output += '\'"><a href="javascript:loadFirstModule(\'' + pid + '\', \'' + pname + '\')" >' + value + '</a></span>'
		return output;
	}
	
function toMonthReport(pid, prjName)
{
	var path = parent.frames['contentFrame'].location.href = 
		BASE_PATH +'PCBusiness/bid/pc.bid.show.superviseReport.jsp?pid=' 
																	+ pid +  '&prjName='+prjName;
}
function toApplyQuery(pid)
{
	var path = parent.frames['contentFrame'].location.href = 
		BASE_PATH +'PCBusiness/bid/pc.bid.zb.apply.input.jsp?hasBtn=false&pid='+ pid;
}
function openDialog(url, winName){
    var r = BASE_PATH + url;
	var h = screen.availHeight;
	var w = screen.availWidth;
    	try{
    	 window.open(r,null,"width="+w+"px, height="+h+"px, status=no, center=yes," +
    				"resizable=no, alwaysRaised=yes, location=no, left=0px, titlebar=yes"); 
    	}
    	catch(e){
    		//alert(e.description);
    		//window.open(r);
    	}
}
