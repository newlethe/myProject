var contentPanel;
var treePanelTitle = CURRENTAPPNAME+ "&nbsp;-&nbsp;合同动态台帐";
var rootText = "所有合同";
var bdgWin;//概算分摊情况查看
var bdgGrid;//详情列表
var showMDType = window.dialogArguments;
var date= new Date();
var store;
var hiddenFlag=true;
Ext.onReady(function() {
	var arrayYear = arrayYearCreater();
	var yearStore = new Ext.data.SimpleStore({
	    fields : ['k','v'],
	    data : arrayYear
	})
	
	var monthStore = new Ext.data.SimpleStore({
	    fields : ['k','v'],
	    data : [['', '']]
	})
	
	var fullMonth=[['12月','12'],['11月','11'],['10月','10'],['09月','09'],['08月','08'],
	    ['07月','07'],['06月','06'],['05月','05'],['04月','04'],['03月','03'],['02月','02'],['01月','01']];
	    
	var yearStr = date.getYear();
	var arrayMonth=new Array();
	var a ="0";
	var monStr =(date.getMonth()).toString();//默认显示上月
	var monStrThis=(date.getMonth()+1).toString();//本月
	var tempThis=new Array();
	if(monStrThis.length<2){
		tempThis.push("0".concat(monStrThis)+"月");
		tempThis.push("0".concat(monStrThis));
		arrayMonth.push(tempThis);			
	}else{
		tempThis.push(monStrThis+"月");
		tempThis.push(monStrThis);
		arrayMonth.push(tempThis);			
	}
	for(var i=monStr;i>=1;i--){
		var temp=new Array();
		if(i.length<2){
			temp.push("0".concat(i)+"月");
			temp.push("0".concat(i));			
		}else{
			temp.push(i+"月");
			temp.push(i);
		}
		arrayMonth.push(temp);
	}	
	if(monStr.length<2){
		monStr=a.concat(monStr);
	}
	
  	var currentDate = yearStr.toString().concat(monStr)	
  	
	var yearCom = new Ext.form.ComboBox({
		store : yearStore,
		width : 75,
		displayField : 'k',
		valueField : 'v',
		typeAhead : true,
		value: SYS_DATE_DATE.getYear(),
		mode : 'local',
		triggerAction : 'all',
		emptyText : '选择年份',
		selectOnFocus : true
	})
	
//	yearCom.setValue(yearStr);
	
	yearCom.on('select', yearComselect);
	
	function yearComselect(){
		var curYear=yearCom.getValue();
		if(curYear==yearStr){
			monthStore.loadData(arrayMonth);
			monthCom.setValue(monStr); 
		}else{
			monthStore.loadData(fullMonth);
		}
	}
	
	monthStore.loadData(arrayMonth);
	
	var monthCom = new Ext.form.ComboBox({
	    store : monthStore,
		width : 75,
		displayField : 'k',
		valueField : 'v',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',    
		emptyText : '选择月份',
		selectOnFocus : true
	})
	
	monthCom.setValue(monStr); 
	
	var btn = new Ext.Button({  
		 id : 'btn',
		 text : '查询',
		 handler : function (){  
			store.load();  
		 }
	})
	if(showMDType=="合同动态管理台账"){
	}else{
		if(parent.proTreeCombo){
			parent.proTreeCombo.show();
			parent.proTreeCombo.setValue(CURRENTAPPID);
			if(parent.backToSubSystemBtn){
				parent.backToSubSystemBtn.show();				
			}
			if(parent.pathButton){
				parent.pathButton.setText("<b>当前位置:"+parent.selectedSubSystemName+"/合同动态台帐</b>");						
			}
		}
	}
	
	var continentGroupRow=[  
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
        {header:'投资完成-建筑',align:'center',colspan:3},
        {header:'投资完成-设备',align:'center',colspan:3},
        {header:'投资完成-安装',align:'center',colspan:3},
        {header:'投资完成-其他',align:'center',colspan:3}
    ];  
	var group = new Ext.ux.grid.ColumnHeaderGroup({  
	     rows: [continentGroupRow]  
	 });
	
	var columns = [{
			id : 'contypename',
			header : "合同类型",
			width : 340,
			renderer :function(value, metadata, record, rowIndex,
                        columnIndex, store) {
                var conid=record.data.contypeid;
                var qtip = "qtip=" + value;
  				if(conid=="FW"||conid=="CL"||conid=="QT"||conid=="SG"||conid=="SB"||conid=="ALL"){
  					return'<span ' + qtip + '>' + value + '</span>';
  				}
  				else{
  					var winName="合同详细信息";
					var winUrl='Business/contract/cont.generalInfo.view.jsp?windowMode=1&dyView=true&query=true&acc=con&conid='+ conid+'&conids='+conid;
					return "<a href='javascript:openDialog(\"" + winUrl
							+ "\",\"" + winName + "\")'>"
							+ value + "</a>";						
  				}			
			},
			dataIndex : 'contypename'
		}, {
			id : 'parent',
			header : '父节点',
			hidden : true,
			dataIndex : 'parent'
		}, {
			id : 'contypeid',
			header : '合同主键',
			hidden : true,
			dataIndex : 'contypeid'
		},  {
			header : '<div align="center">合同金额</div>',
			width : 85,
			dataIndex : 'contotalmoney',
			align : 'right',
			renderer: function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
	    			return "<div id='contotalmoney' align='right'>"+cnMoneyToPrec(value,2)+"</div>";
				} else {
	    			return value;
				}
   			}
		}, {
			header : '合同签订金额',
			align : 'right',
			width : 95,
			dataIndex : 'singledmoney',
			hidden:true,
			renderer: function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
	    			return "<div id='singledmoney'>"+cnMoneyToPrec(value,2)+"</div>";
				} else {
	    			return value;
				}
   		 	}
		}, {
			header : '变更金额',
			align : 'right',
			width : 105,
			dataIndex : 'claandchangemoney',
			renderer: function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='claandchangemoney'>"+cnMoneyToPrec(value,2)+"</div>";
				}
    			else
    			return value;
   		 	}
		}, {
			header : '累计结算金额',
			align : 'right',
			width : 95,
			dataIndex : 'balmoney',
			renderer: function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='balmoney'>"+cnMoneyToPrec(value,2)+"</div>";
				}
    			else
    			return value;
   		 	}
		}, {
			header : '<div align="center">概算金额</div>',
			align : 'right',
			width : 90,
			hidden:true,
			dataIndex : 'bdgmoney',
			renderer: function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='bdgmoney' align='right'>"+cnMoneyToPrec(value,2)+"</div>";
				}
    			else 
    			return value;
   		 	}
		}, {
			header : '付款比例',
			align : 'right',
			width : 95,
			hidden:true,
			dataIndex : 'paypercent'
		},{
		    header : '本月付款金额',
		    width :95,
		    align : 'right',
		    dataIndex : 'monpay',
		    renderer:function(value){
		    	if(value!=0){
		    		value=(value/10000).toFixed(2);
		    		return "<div id='monpay'>"+cnMoneyToPrec(value,2)+"</div>";
		    	}else{
		    		return value;
		    	}
		    }
		},{
		    header : '累计已付金额',
		    width : 95,
		    align : 'right',
		    dataIndex : 'totalpay',
			renderer: function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='totalpay'>"+cnMoneyToPrec(value,2)+"</div>";
				}
    			else 
    			return value;
   		 	}
		},{
		    header : '累计已付比例',
		    width : 95,
		    align : 'center',
		    dataIndex : 'totalpaypercent'
		},{
		    header : '<div align="center">未付金额</div>',
		    width : 95,
		   	align : 'right',
           // hidden : (DEPLOY_UNITTYPE == "0"),
           hidden:true,
		    dataIndex : 'notpaymoney',
			renderer: function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='notpaymoney' align='right'>"+cnMoneyToPrec(value,2)+"</div>";
				}
    			else
    			return value;
   		 	}
		}/*, {
			header : '<div align="center">本月完成</div>',
			align : 'right',
			hidden:hiddenFlag,
			width : 70,
			dataIndex : 'moninvestment_build',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='moninvestment_build'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '本年累计',
			align : 'right',
			hidden:hiddenFlag,
			width : 70,
			dataIndex : 'yearinvestment_build',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='yearinvestment_build'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '自开工累计',
			width : 80,
			hidden:hiddenFlag,
			align : 'right',
			dataIndex : 'totalinvestment_build',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='totalinvestment_build'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '本月完成',
			align : 'right',
			hidden:hiddenFlag,
			width : 70,
			dataIndex : 'moninvestment_equ',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='moninvestment_equ'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '本年累计',
			align : 'right',
			hidden:hiddenFlag,
			width : 70,
			dataIndex : 'yearinvestment_equ',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='yearinvestment_equ'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '自开工累计',
			width : 80,
			hidden:hiddenFlag,
			align : 'right',
			dataIndex : 'totalinvestment_equ',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='totalinvestment_equ'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '本月完成',
			align : 'right',
			hidden:hiddenFlag,
			width : 70,
			dataIndex : 'moninvestment_install',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='moninvestment_install'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '本年累计',
			align : 'right',
			hidden:hiddenFlag,
			width : 70,
			dataIndex : 'yearinvestment_install',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='yearinvestment_install'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '自开工累计',
			width : 80,
			hidden:hiddenFlag,
			align : 'right',
			dataIndex : 'totalinvestment_install',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='totalinvestment_install'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '本月完成',
			align : 'right',
			hidden:hiddenFlag,
			width : 70,
			dataIndex : 'moninvestment_other',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='moninvestment_other'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '本年累计',
			align : 'right',
			hidden:hiddenFlag,
			width : 70,
			dataIndex : 'yearinvestment_other',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='yearinvestment_other'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}, {
			header : '自开工累计',
			width : 80,
			hidden:hiddenFlag,
			align : 'right',
			dataIndex : 'totalinvestment_other',
			renderer:function(value){
				if(value!=0){
					value=(value/10000).toFixed(2);
					return "<div id='totalinvestment_other'>"+cnMoneyToPrec(value,2)+"</div>";
				}
				else
				return value;
			}
		}*/];
	
	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
		autoLoad : true,
		leaf_field_name : 'isleaf',// 是否叶子节点字段
		parent_id_field_name : 'parent',// 树节点关联父节点字段
		url : MAIN_SERVLET,
		baseParams : {
			ac : 'list',
			method : 'buildConReportTreeGrid',// 后台java代码的业务逻辑方法定义
			business : 'pcConMgm',// spring 管理的bean定义
			bean : 'com.sgepit.pcmis.contract.hbm.ConReportBean',// gridtree展示的bean
			params : 'pid' + SPLITB +  CURRENTAPPID + SPLITB// 查询条件
		},
		reader : new Ext.data.JsonReader({
			id : 'contypeid',
			root : 'topics',
			totalProperty : 'totalCount',
			fields : ["contypeid", "contypename", "conname", "contotalmoney",
					'singledmoney', 'claandchangemoney', 'balmoney', 'bdgmoney',
					'paypercent', 'moninvestment_build','yearinvestment_build', 'totalinvestment_build',
					'moninvestment_equ','yearinvestment_equ', 'totalinvestment_equ',
					'moninvestment_install','yearinvestment_install', 'totalinvestment_install',
					'moninvestment_other','yearinvestment_other', 'totalinvestment_other',
					'monpay', 'totalpay', 'totalpaypercent', 'notpaymoney',
					"parent", "isleaf"]
		}),
		listeners : {
			'beforeload' : function(ds, options) {
				var parent = null;
				if (options.params[ds.paramNames.active_node] == null) {
					options.params[ds.paramNames.active_node] = '0';
					parent = "0"; // 此处设置第一次加载时的parent参数
				} else {
					parent = options.params[ds.paramNames.active_node];
				}
				var cyear =yearCom.getValue().toString();
				var cmonth=monthCom.getValue().toString();
				if(cmonth.length==1){
					cmonth="0"+cmonth;
				}
				var nowDate =cyear.concat(cmonth);
				ds.baseParams.params = 'pid' + SPLITB + CURRENTAPPID + ";parent" + SPLITB + parent+ ";nowdate" + SPLITB + nowDate;// 此处设置除第一次加载外的加载参数设置
			},
			'load' : function (){
			}
		}
	});
	
	var treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'pccon-tree-panel',
		iconCls : 'icon-by-category',
		store : store,
		master_column_id : 'contypename',// 定义设置哪一个数据项为展开定义
		autoScroll : true,
		region : 'center',
		frame : false,
		collapsible : false,
		animCollapse : false,
		border : true,
		columns : columns,
		//plugins: group,
		stripeRows : true
	});		

	var backbtn = new Ext.Button({
	    id :'backbtn',
	    text : '返回子系统',
	    iconCls : 'returnTo',
	    handler : function (){
	        window.location.href=BASE_PATH+'PCBusiness/pcCon/pccon.summary.project.jsp';
	    }
	})
	
  	var tbarArr = [
        /*'<font color=#15428b><b>&nbsp;' + treePanelTitle
								+ '</b></font>', 
						 '-',{
                            iconCls : 'icon-expand-all',
                            tooltip : '全部展开',
                            handler : function() {
                               store.expandAllNode();
                            }
                        },
						'-',
						{
                           iconCls : 'icon-collapse-all',
                            tooltip : '全部收起',
                            handler : function() {
                                store.collapseAllNode();
                            }
                        },
                        */
						 '-',"年份：",yearCom," 月份:",monthCom,'-', btn,
						 '->',"计量单位： 万元" ];
						 
	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		tbar : tbarArr,
		items : [treeGrid]
	});
	
	// 7. 创建viewport加入面板content
	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
					layout : 'border',
					items : [contentPanel],
					title : 'Simple Tasks',
					iconCls : 'icon-show-all'
				}).render();
	} else {
		var viewport = new Ext.Viewport({
					layout : 'border',
					items : [contentPanel]
				});
	}
});
function openDialog(url, winName){
	var h =600;
	var w =900;
	var   WLeft   = Math.ceil((window.screen.width-w)/2);   
	var   WTop    = Math.ceil((window.screen.height-h)/2);
    var r = BASE_PATH + url;

    	try{
    	 window.open(r,null,"width="+w+"px,, top="+WTop+", left="+WLeft+",  height="+h+"px, status=no, center=yes," +
    				"resizable=yes, alwaysRaised=yes, underline=yes,location=no, titlebar=yes"); 
    	}
    	catch(e){
    		//alert(e.description);
    		//window.open(r);
    	}
}

function arrayYearCreater() {
	var arrayYear = [];
	var curYear = SYS_DATE_DATE.getYear();
	var startYear = 2009;
	for(var i=curYear; i>=startYear; i--) {
		var tmpArray = [];
		tmpArray.push(i + "年");
		tmpArray.push(i);
		arrayYear.push(tmpArray);
	}
	
	return arrayYear;
}