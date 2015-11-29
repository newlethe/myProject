var obj;
var unitList; // 所属单位
var array_buildNature; // 建设性质
var array_industryType; // 产业类型
var array_prjStage; // 项目阶段
var array_prjType; // 项目类型
var appArr; // 接入系统批复类型
var array_guiMoDw; // 建设规模单位
var array_fundSrc; // 资金类型
Ext.onReady(function() {
	DWREngine.setAsync(false);
	// 获取项目基本信息
	baseDao.findByWhere2("com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo", "pid='"
					+ CURRENTAPPID + "'", function(list) {
				if (list.length > 0) {
					obj = list[0];
				}
			})
	// 获取项目所属单位
	baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.SgccIniUnit",
			"unitTypeId in('0','2','3','4','6','7')", function(list) {
				if (list.length > 0) {
					unitList = list;
				}
			})
	appMgm.getCodeValue('建设性质', function(list) {
				array_buildNature = list;
			});
	appMgm.getCodeValue('产业类型', function(list) {
				array_industryType = list;
			});
	appMgm.getCodeValue('项目阶段', function(list) {
				array_prjStage = list;
			});
	appMgm.getCodeValue('项目类型', function(list) {
				array_prjType = list;
			});
	appMgm.getCodeValue('接入系统批复类型', function(list) {
				appArr = list;
			});
	appMgm.getCodeValue('建设规模单位', function(list) {
				array_guiMoDw = list;
			});
	appMgm.getCodeValue('资金类型', function(list) {
				array_fundSrc = list;
			});
	DWREngine.setAsync(true);

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'srcType',
				type : 'string'
			}, {
				name : 'amount',
				type : 'string'
			}, {
				name : 'memo',
				type : 'string'
			}];
	var fundds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : "com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjFundsrc",
					business : "baseMgm",
					method : "findWhereOrderby",
					params : "pid='" + CURRENTAPPID + "'"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'uids'
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	fundds.load({
				params : {
					start : 0,
					limit : 20
				}
			});
	var fundcm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				id : 'uids',
				header : "主键",
				dataIndex : "uids",
				hidden : true
			}, {
				id : 'pid',
				header : "项目编号",
				dataIndex : "pid",
				hidden : true
			}, {
				id : 'srcType',
				header : "资金类型",
				dataIndex : "srcType",
				width :50,
				align : 'center',
				renderer : function(k) {
					for (var i = 0; i < array_fundSrc.length; i++) {
						if (k == array_fundSrc[i].propertyCode) {
							return array_fundSrc[i].propertyName;
						}
					}
				}
			}, {
				id : 'amount',
				header : "金额(元)",
				dataIndex : "amount",
				width :50,
				align : 'right',
				renderer : function(v) {
					return cnMoneyToPrec(v, 0);
				}
			}, {
				id : 'memo',
				header : "说明",
				dataIndex : "memo",
				type : 'string',
				width : 200
			}])
	var fundsrc_grid = new Ext.grid.GridPanel({
				title : '资金来源',
				store : fundds,
				cm : fundcm,
				plugins : [new Ext.ux.grid.GridSummary()],
				border : false,
				autoScroll : true,
				collapsible : false,
				animCollapse : false,
				autoExpandColumn : 'uids',
				stripeRows : true,
				trackMouseOver : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({
							pageSize : 20,
							store : fundds,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录。"
						})
			});
	var tabs = new Ext.TabPanel({
		autoScroll : true,
		activeTab : 0,
		items : [fundsrc_grid, {
			title : '组织机构',
			html : '<iframe name="contentFrame" src="'
					+ "PCBusiness/zhxx/query/pc.zhxx.projinfo.unitStructure.jsp?edit=false"+"&flag="+flag
					+ '" frameborder="0" style="width:100%;height:100%;"></iframe>'
		}, {
			title : '主要人员',
			html : '<iframe name="contentFrame" src="'
					+ "PCBusiness/zhxx/query/pc.zhxx.projinfo.keyman.jsp?edit=false"
					+ '" frameborder="0" style="width:100%;height:100%;"></iframe>'
		}, {
			title : '主要合作单位',
			html : '<iframe name="contentFrame" src="'
					+ "PCBusiness/zhxx/query/pc.zhxx.projinfo.coUnit.jsp?edit=false"
					+ '" frameborder="0" style="width:100%;height:100%;"></iframe>'
		}, {
			title : '主要事件',
			html : '<iframe name="contentFrame" src="'
					+ "Business/fileAndPublish/fileManage/com.fileManage.query.jsp?rootId=big_event_root&canReport=1"+"&flag="+flag
					+ '" frameborder="0" style="width:100%;height:100%;"></iframe>'
		}]
	});
	var topPanel = new Ext.Panel({
				region : 'north',
				header : false,
				split : true,
				collapseMode : 'mini',
				height : 210,
				bodyStyle : 'padding: 5px;',
				border : false
			})
	var centerPanel = new Ext.Panel({
		region : 'center',
		autohHeight : true,
		split : true,
		collapseMode : 'mini',
		layout : 'fit',
		items : [tabs]
			// tabs
		})
	new Ext.Viewport({
				layout : 'border',
				items : [topPanel, centerPanel]
			})
	var formData = new Object(obj);
	formData.unitName = checkUnitName(formData.memoC1); // 所属单位
	formData.startDate =formatDate(formData.buildStart);//开建日期
	formData.endDate =formatDate(formData.buildEnd);//开建日期
	formData.chayeleixing = chanye(formData.industryType); // 产业类型
	formData.xiangmuleixing = xiangmuleixing(formData.prjType); // 项目类型
	formData.jianshe = jianshe(formData.buildNature); // 建设性质
	formData.xiangmujieduan = xiangmujieduan(formData.prjStage); // 项目阶段
	formData.jianshegmDW=jiansheguimoDW(formData.guiMoDw);//建设规模单位
	formData.jiruxitongsfpf=jieruXtsfPf(formData.isapproval);//建设规模单位
	formData.memoC2=formData.memoC2==null?"":formData.memoC2;//建设规模
	formData.prjName=formData.prjName==null?"":formData.prjName;//项目名称
	formData.pid=formData.pid==null?"":formData.pid;//项目PID
	formData.investScale=formData.investScale==null?"":formData.investScale;//投资规模
	formData.isapproved=formData.isapproved==null?"":formData.isapproved;//是否核准
	formData.prjRespond=formData.prjRespond==null?"":formData.prjRespond;//项目负责人
	formData.totalinvestment=formData.totalinvestment==null?"":formData.totalinvestment;//总投资
	formData.buildLimit=formData.buildLimit==null?"":formData.buildLimit;//建设年限
	formData.prjSummary=formData.prjSummary==null?"":formData.prjSummary;//项目简介
	formData.memo=formData.memo==null?"":formData.memo;//备注
	formData.address = formatAdress(formData.prjAddress,formData.memoC3);//转化地址
	formData.jiansheguimo=changejiansheGM(formData.memoC2,formData.memoC4,formData.jianshegmDW)//转化建设规模显示
	var tplstr = new Array();
	tplstr = document.all.Main.innerHTML
	var tpl = new Ext.Template(tplstr);
	tpl.overwrite(topPanel.body, formData);
})
// 计算所属单位

function checkUnitName(pid) {
	for (var i = 0; i < unitList.length; i++) {
		var obj = unitList[i];
		if (obj.unitid == pid) {
			return obj.unitname;
		}
	}
}
// 产业类型

function chanye(v) {
	for (var i = 0; i < array_industryType.length; i++) {
		if (v == array_industryType[i].propertyCode) {
			return array_industryType[i].propertyName;
		}
	}
}
// 项目类型

function xiangmuleixing(v) {
	for (var i = 0; i < array_prjType.length; i++) {
		if (v == array_prjType[i].propertyCode) {
			return array_prjType[i].propertyName;
		}
	}
}
// 建设性质

function jianshe(v) {
	for (var i = 0; i < array_buildNature.length; i++) {
		if (v == array_buildNature[i].propertyCode) {
			return array_buildNature[i].propertyName;
		}
	}
}
// 项目阶段

function xiangmujieduan(v) {
	for (var i = 0; i < array_prjStage.length; i++) {
		if (v == array_prjStage[i].propertyCode) {
			return array_prjStage[i].propertyName;
		}
	}
}
// 建设规模单位

function jiansheguimoDW(v) {
	for (var i = 0; i < array_guiMoDw.length; i++) {
		if (v == array_guiMoDw[i].propertyCode) {
			return array_guiMoDw[i].propertyName;
		}
	}
}
// 接入系统是否批复

function jieruXtsfPf(v) {
	for (var i = 0; i < appArr.length; i++) {
		if (v == appArr[i].propertyCode) {
			return appArr[i].propertyName;
		}
	}
}
function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
};
function uploadfile() {
    var param = {
        businessId: CURRENTAPPID,
        businessType: "PCZhxxPrjAffix",
        editable: false
    };
    showMultiFileWin(param);
}
function formatAdress(add,me){
	var str ="";
    if(add!=null&&add!=""){
        str+=add+"省"
    }
    if(me!=null&&me!=""){
        str+=me+""
    }
    return str
}
function changejiansheGM(v1,v2,v3){
	if(v3!=null&&v3!=""){
	    if(v1!=null&&v1!=""&&v2!=null&&v2!=""){
	        return v1+"X"+v2+v3;
	    }else if(v2!=null&&v2!=""){
	       return v2+v3;
	    }else if(v1!=null&&v1!=''){
	    	
	        return v1+v3;
	    }else {
	        return '';
	    }
	}else {
	     return "";
	}
}
