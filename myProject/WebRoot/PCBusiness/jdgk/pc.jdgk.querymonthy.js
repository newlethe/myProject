var months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
var curSjType,yearMonthCombo;
var curSjStr;
var Columns;
var MainReport;
var treePanel;
Ext.onReady(function(){
	var sjArr=new Array();
	var curDate = new Date();
	var lastYear=curDate.getFullYear()-1;
	curSjType = curDate.getFullYear() + months[curDate.getMonth()];
	curSjStr = curDate.getFullYear() +'年'+ months[curDate.getMonth()]+'月';
	for(i =0 ; i <2 ; i++) {
		for(j=0;j<12;j++){
			var temp = new Array();	
			var sjType = lastYear+i+months[j];
			temp.push(sjType);		
			temp.push(lastYear+i+"年"+months[j]+"月");	
			sjArr.push(temp);
			if ( sjType == curSjType ){
				break;
			}
		}			
	}
	sjArr.reverse();
	var sjStore=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: sjArr
	});
	yearMonthCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				store :sjStore,
				valueField : 'k',
				displayField : 'v',
				editable:false,
				value : curSjType,
				width : 100,
				listeners:{
	       			'select':function(combo,record){
	       				curSjType = record.get('k');
	       				root.reload();
	       			}
	       		}
			});
	var reportBtn = new Ext.Toolbar.Button({
		text : '汇总表',
		tooltip : USERBELONGUNITNAME+"进度完成信息表",
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		hidden:(USERBELONGUNITTYPEID=="A"?true:false),//如果当前登录用户录属项目单位则隐藏汇总按钮
		handler : viewReport
	})
			
			
	var root = new Ext.tree.AsyncTreeNode({
			cls : 'master-task',
			id:USERBELONGUNITID,
            text:USERBELONGUNITNAME,
            children:[{
				id:USERBELONGUNITID,
	            text:USERBELONGUNITNAME,
	            ifcheck:"none",
				expanded:true,
	            uiProvider:"col"
            }]
    })
	var treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "UnitMonthReportTree",
			businessName : "pcJdgkMgm",
			rootpid : USERBELONGUNITID,
			sjtype : curSjType
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});
	// 覆盖每个节点的Loader，将相应的节点id作为parent参数发送请求
	treeLoader.on('beforeload', function(treeLoader, node) {
				treeLoader.baseParams.sjtype = curSjType;
				curSjStr = curSjType.substr(0,4)+'年'+curSjType.substr(4,2) + '月';
			})
	treePanel = new Ext.tree.ColumnTree({
        id:'month-report-tree-panel',
        iconCls: 'icon-by-category',
        frame: false,
        border: false,
		tbar : ['填报月份 ', ' ',yearMonthCombo,reportBtn],
        title:'月度进度管控上报查询',
        autoScroll:true,
        rootVisible : false,
        columns:[{
            header:'<center>项目名称</center>',
            width:370,
            dataIndex:'unitname'
        },{
            header:'<center>标题</center>',
            width:360,
            dataIndex:'reportname',
            renderer : function(value, metaData, record, rowIndex, colIndex, store) {
					if (record.uids){
						var sjType = record.sjType;
						var pid = record.pid;
						var id = record.id;
						return "<span onclick='openReport(\""+id+"\",\""+sjType+"\",\""+pid+"\")'" +
								"style='text-decoration:underline;color:blue;'>"+value+"</span>";
					}
					else{
						return "<font color=gray></font>"
					}
			}
        },{
            header:'<center>上报状态</center>',
            width:140,
            dataIndex:'state',
            align: 'center',
            renderer : function(value, metaData, record, rowIndex,	colIndex, store) {
            	if(value==undefined) return "<center title='由集团公司退回'><font color=green>退回重报</font></center>";
				if ( value == '1' ){
					return '<center>已上报 <a href="javascript:void(0)" onclick="sendBackReport()"><font color=red>【退回】</font></a></center>';
				}
				else{
					var style = ' style="color:gray;text-align:center" ';
				    return '<center><span' + style + '>未上报</span></center>';
				}
			}
        },{
        	header : '填报人',
        	width : 140,
        	dataIndex : 'createperson'
        },{
            header:'流程状态',
            width:0,
            dataIndex:'billStatus',
            align: 'center'
           
        }],       
        loader: treeLoader,
        root: root
	});
	 var viewport = new Ext.Viewport({
    	//layout:'fit',
        layout:'fit',
        items:[ treePanel]
    });	
	
});

function openReport(id,sjType,pid){
	if(id==null)
	   return;
	var node = treePanel.getNodeById(id);
	if(node) 
		node.select(); 
	var reportParams = {
		p_type:"JDGL_TA",
		p_corp:pid+"/1",
		p_date:sjType,
		p_inx:"45",
		savable:false,
		openCellType:'frame'
	};
	var w = 800;
	var h=600;
	if(screen&&screen.availHeight&&screen.availWidth){
		w = screen.availWidth;
		h = screen.availHeight;
	}
	window.showModalDialog(
			"/"+ROOT_CELL+"/cell/eReport.jsp",
			reportParams,"dialogWidth:"+w+"px;dialogHeight:"+h+"px;status:no;center:yes;resizable:no;Minimize:yes;Maximize:no");
}
function viewReport(uids){
	var URL = "/"+ROOT_CELL+"/cell/eReport.jsp";
	var w = 800;
	var h=600;
	if(screen&&screen.availHeight&&screen.availWidth){
		w = screen.availWidth;
		h = screen.availHeight;
	}
	var features = "status:no;center:yes;resizable:no;Minimize:yes;Maximize:no;dialogWidth:"+w+"px;dialogHeight:"+h+"px;"
	var sjType = yearMonthCombo.getValue();
	var reportParams = {
		p_corp:USERBELONGUNITID+"/1",
		p_date:sjType,
		p_inx:"45",
		savable:false
	};
	if(USERBELONGUNITTYPEID=="0"){//集团公司汇总表
		reportParams.p_type = "JDGL_T0"
	}else if(USERBELONGUNITTYPEID=="2"){//二级公司汇总表
		reportParams.p_corp = USERBELONGUNITID;
		reportParams.p_type = "JDGL_T2"
	}else if(USERBELONGUNITTYPEID=="3"){//三级公司汇总表
		reportParams.p_type = "JDGL_T3"
	}else if(USERBELONGUNITTYPEID=="A"){//项目单位汇总表
		reportParams.p_type = "JDGL_TA"
	}
	window.showModalDialog(URL,reportParams,features);
}
//退回重报
function sendBackReport(){
	 var win = (new BackWindow())
	 win.show()
}