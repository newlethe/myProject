var ocxBookMarks;//word中所包含的书签
﻿var bean = "com.sgepit.pmis.contract.hbm.ConPay"
//关联数据	
function printDataToFile(obj, table){
	table = table.toUpperCase();
	ocxBookMarks = TANGER_OCX_OBJ.activeDocument.BookMarks;
	var isSign = false;
	if(!(obj.subdata)){
		obj.subdata = new Array();
	}
	for (var o in obj){
		for (var i=0; i<ocxBookMarks.Count; i++){
			var bookmark = ocxBookMarks(i+1).Name;
			if (bookmark == o){
			
				
				if(null != obj[o]){
					
					//11-1-20 签订日期格式过滤为yyyy-MM-dd Yinzf
					if ( o == 'SIGNDATE' && obj[o].dateFormat ){
							obj[o] = obj[o].dateFormat('Y-m-d');				
					}
					else{
						obj[o]=dateFilter(obj[o]);
					}
					
					if (bookmark == 'JZH') obj[o]=jzhRender(obj[o]);
				}
					
				TANGER_OCX_OBJ.SetBookmarkValue(bookmark, obj[o]);
				isSign = true;
			}
			if (bookmark == 'NOWDATE'){
				if ('EQU_OPEN_BOX_VIEW' == table || 'EQU_REC_VIEW' == table){
					var date = new Date();
					var today = date.getYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
					TANGER_OCX_OBJ.SetBookmarkValue(bookmark, today);
					isSign = true;
				}
			}
			if ('EQU_OPEN_BOX_SUB_VIEW' == table){
				if (bookmark == 'YEAR'){
					TANGER_OCX_OBJ.SetBookmarkValue(bookmark, new Date().getYear());
					isSign = true;
				} else if (bookmark == 'MONTH'){
					TANGER_OCX_OBJ.SetBookmarkValue(bookmark, new Date().getMonth()+1);
					isSign = true;
				} else if (bookmark == 'DATE'){
					TANGER_OCX_OBJ.SetBookmarkValue(bookmark, new Date().getDate());
					isSign = true;
				}
			}
            //--2012-12-13--【设备入库单新增】和【设备出库单新增】流程时间处理--zhangh--
            if(table == 'EQU_GOODS_STOREIN_FLOW_VIEW' 
                || table == 'EQU_GOODS_STOCK_OUT_FLOW_VIEW'
                || table == 'EQU_GOODS_STOCK_OUT_NEW_VIEW'){
                if (bookmark == 'SJ' && o == 'SJ' && obj[o]!=null){
                    var sj = obj[o].substring(0,10).split("-");
                        TANGER_OCX_OBJ.SetBookmarkValue(bookmark, sj[0]+'年'+sj[1]+'月'+sj[2]+'日');
                    isSign = true;
                }
            }
		}
	}
	switch(table){
        //start 设备模块更新后，新增的流程数据打印 2012-09-10
        case 'EQU_GOODS_ARRIVAL_VIEW' : //设备到货新增
            equGoodsArrivalView(obj, table);
            isSign = true;
            break;
        case 'EQU_GOODS_OPENBOX_NOTICE' : //设备到货新增
            equGoodsOpenboxNotice(obj, table);
            isSign = true;
            break;
        //end 设备模块更新后，新增的流程数据打印 2012-09-10
		case 'EQU_REC_VIEW'://设备领料单
			equRecView(obj, table);
			isSign = true;
			break;
		case 'EQU_OPEN_BOX_VIEW'://设备开箱通知单
			equOpenBoxView(obj, table);
			isSign = true;
			isSign = true;
			break;
		case 'EQU_OPEN_BOX_SUB_VIEW'://设备材料验收记录
			equOpenBoxSubView(obj, table);
			isSign = true;
			break;
		case 'EQU_GET_GOODS_VIEW'://设备入库单
			equGetGoodsView(obj, table);
			isSign = true;
			break;
		case 'VIEW_PRO_ACM_MONTH_INFO'://工程月度付款
			viewProZcmMonthInfo(obj, table);
			isSign = true;
			break;
		//////////////////////////////////////////
		//2011-09-23 以下内容为移植国锦流程中打印数据到word的方法
		case 'VIEW_WZ_CJSXB_PB'://物资申请计划
			viewWzCjsxbPb(obj, table);
			isSign = true;
			break;
		case 'VIEW_WZ_CJHXB'://物资采购计划
			viewWzCjhxb(obj, table);
			isSign = true;
			break;
		case 'VIEW_WZINPUT_WZCDJINPB'://物资到货登记
			viewWzinputWzcdjinpb(obj, table);
			isSign = true;
			break;
		case 'WZ_OUTPUT'://物资领用
			wzOutput(obj, table);
			isSign = true;
			break;
		case 'WZ_INPUT'://
			wzInput(obj, table);
			isSign = true;
			break;
		case 'BDG_MONTH_MONEY_PLAN_VIEW'://部门资金计划上报
			bdgMonthMoneyPlanView(obj, table);
			isSign = true;
			break;
		case 'BDG_MONTH_MONEY_PLAN_HZ_VIEW'://部门资金计划汇总
			bdgMonthMoneyPlanHzView(obj, table);
			isSign = true;
			break;
		case 'BDG_MONTH_MONEY_PLAN_BL_VIEW'://部门资金计划补录
			bdgMonthMoneyPlanBlView(obj, table);
			isSign = true;
			break;
		case 'SAFETY_MONEY_APPLY'://2010-12-29 安全专款申请 流程中打印到word模板
			safetyMoneyApply(obj, table);
			isSign = true;
			break;
		case 'SAFETY_MONEY_APPLY_PG'://2010-12-29 安全执行情况评估 流程中打印到word模板
			safetyMoneyApplyPg(obj, table);
			isSign = true;
			break;
		case 'GZ_WEEK_REPORT_VIEW'://2010-12-09 打印部门周工作上
			gzWeekReportView(obj, table);
			isSign = true;
			break;
		case 'GZ_WEEK_REPORT_HZ_VIEW'://2010-12-10 部门周报汇总打印
			gzWeekReportHzView(obj, table);
			isSign = true;
			break;
		case 'GZ_MONTH_REPORT_VIEW'://2010-12-10 部门月工作上报
			gzMonthReportView(obj, table);
			isSign = true;
			break;
		case 'GZ_MONTH_REPORT_HZ_VIEW'://2010-12-10 部门月工作汇总
			gzMonthReportHzView(obj, table);
			isSign = true;
			break;
		//////////////////////////////////////////
		case 'CON_PAY_VIEW'://合同付款
			conPapView(obj, table);
			isSign = true;
			break;
		case 'MAT_STORE_OUT'://物资计划内(外)出库
			matStoreOut(obj, table);
			isSign = true;
			break;
		case 'MAT_STORE_IN'://物资入出库
			matStoreIn(obj, table);
			isSign = true;
			break;
		case 'VIW_GCZL_JY_STAT': //质量验评统计
			zlypStat(obj, table);
			isSign = true;
			break;
        //--2012-12-13--【设备入库单新增】流程--zhangh--
        case 'EQU_GOODS_STOREIN_FLOW_VIEW':
            equGoodsStoreinFlowView(obj, table);
            isSign = true;
            break;
        //--2012-12-13--【设备出库单新增】流程--zhangh--
        case 'EQU_GOODS_STOCK_OUT_FLOW_VIEW':
            equGoodsStockOutFlowView(obj, table);
            isSign = true;
            break;
        //--2013-03-06--【设备出库单新增】流程--燃气使用--zhangh--
        case 'EQU_GOODS_STOCK_OUT_NEW_VIEW':
            equGoodsStockOutNewView(obj, table);
            isSign = true;
            break;
        case 'EQU_STOCK_SPECIAL_TOOLS_VIEW'://专用工具借用新增
            equSpecialToolsView(obj, table);
            isSign = true;
            break;
		default:
			isSign = true;
			break;
	}
	if (isSign){
		var outHTML = document.all.item("TANGER_OCX").SaveToURL(
			_basePath+'/servlet/FlwServlet?ac=saveDoc',
			'EDITFILE',
			'fileid='+FlwControl.CURRENT_FILE_ID,
			FlwControl.CURRENT_FILE_NAME
		);
		Ext.example.msg('提示', '数据打印成功！');
	} else {
		Ext.example.msg('打印失败', '该文档上没有需要打印的数据位！');
	}
}
//设备到货新增
function equGoodsArrivalView(obj, table){
    if ('EQU_GOODS_ARRIVAL_VIEW' == table){
        ocxBookMarks('ROWNUM').Select();
        with(TANGER_OCX_OBJ.ActiveDocument){
            var rowNum = Application.Selection.Text;
            if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
                for(var i=0;i<obj["subdata"].length;i++){
                    var arrival = obj["subdata"][i];
                    Tables.Item(2).Cell(3+i, 1).Range.Text = i*1+1;
                    Tables.Item(2).Cell(3+i, 2).Range.Text = arrival.BOX_NAME == null?"":arrival.BOX_NAME;
                    Tables.Item(2).Cell(3+i, 3).Range.Text = arrival.BOX_NO == null?"":arrival.BOX_NO;
                    Tables.Item(2).Cell(3+i, 4).Range.Text = arrival.REAL_NUM == null?"":arrival.REAL_NUM;
                    Tables.Item(2).Cell(3+i, 5).Range.Text = arrival.WEIGHT == null?"":arrival.WEIGHT;
                    Tables.Item(2).Cell(3+i, 6).Range.Text = arrival.JOIN_PLACE == null?"":arrival.JOIN_PLACE;
                }                   
            }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
                for(var i=0;i<obj["subdata"].length;i++){
                    var arrival = obj["subdata"][i];
                    Tables.Item(2).Cell(3, 1).Range.Text = obj["subdata"].length - i;
                    Tables.Item(2).Cell(3, 2).Range.Text = arrival.BOX_NAME == null?"":arrival.BOX_NAME;
                    Tables.Item(2).Cell(3, 3).Range.Text = arrival.BOX_NO == null?"":arrival.BOX_NO;
                    Tables.Item(2).Cell(3, 4).Range.Text = arrival.REAL_NUM == null?"":arrival.REAL_NUM;
                    Tables.Item(2).Cell(3, 5).Range.Text = arrival.WEIGHT == null?"":arrival.WEIGHT;
                    Tables.Item(2).Cell(3, 6).Range.Text = arrival.JOIN_PLACE == null?"":arrival.JOIN_PLACE;
                    if(i<obj["subdata"].length-1)
                        Application.Selection.Rows.Add(Application.Selection.Rows(1));
                    Tables.Item(2).Cell(3, 1).Range.Select();                   
                }
            }
        }
    }
}
//设备开箱通知单
function equGoodsOpenboxNotice(obj, table){
    //分别打印年月日
    for (var i=0; i<ocxBookMarks.Count; i++){
        var bookmark = ocxBookMarks(i+1).Name;
        var date = new Date(obj["OPEN_DATE"])
        if (bookmark == 'YEAR'){
            TANGER_OCX_OBJ.SetBookmarkValue(bookmark, date.getYear());
            isSign = true;
        } else if (bookmark == 'MONTH'){
            TANGER_OCX_OBJ.SetBookmarkValue(bookmark, date.getMonth()+1);
            isSign = true;
        } else if (bookmark == 'DATE'){
            TANGER_OCX_OBJ.SetBookmarkValue(bookmark, date.getDate());
            isSign = true;
        } else if (bookmark == 'HOUR'){
            TANGER_OCX_OBJ.SetBookmarkValue(bookmark, date.getHours());
            isSign = true;
        }
    }
}

//设备领料单
function equRecView(obj, table){
	if ('EQU_REC_VIEW' == table){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var sbly = obj["subdata"][i];
					Tables.Item(1).Cell(5+i, 1).Range.Text = i*1+1;
					Tables.Item(1).Cell(5+i, 2).Range.Text = sbly.WZTYPE == null?"":wztypeRender(sbly.WZTYPE);
					Tables.Item(1).Cell(5+i, 3).Range.Text = sbly.SBMC == null?"":sbly.SBMC;
					Tables.Item(1).Cell(5+i, 4).Range.Text = sbly.GGXH == null?"":sbly.GGXH;
					Tables.Item(1).Cell(5+i, 5).Range.Text = sbly.DW == null?"":sbly.DW;
					Tables.Item(1).Cell(5+i, 6).Range.Text = sbly.PLE_RECNUM == null?"":sbly.PLE_RECNUM;
					Tables.Item(1).Cell(5+i, 7).Range.Text = sbly.SCCJ == null?"":sbly.SCCJ;
					Tables.Item(1).Cell(5+i, 8).Range.Text = sbly.MACHINE_NO == null?"":jzhRender(sbly.MACHINE_NO);
					Tables.Item(1).Cell(5+i, 9).Range.Text = sbly.REMARK == null?"":sbly.REMARK;
					Tables.Item(1).Cell(5+i, 10).Range.Text = sbly.RECNUM == null?"":sbly.RECNUM;
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var sbly = obj["subdata"][i];
					Tables.Item(1).Cell(5, 1).Range.Text = obj["subdata"].length - i;
					Tables.Item(1).Cell(5, 2).Range.Text = sbly.WZTYPE == null?"":wztypeRender(sbly.WZTYPE);
					Tables.Item(1).Cell(5, 3).Range.Text = sbly.SBMC == null?"":sbly.SBMC;
					Tables.Item(1).Cell(5, 4).Range.Text = sbly.GGXH == null?"":sbly.GGXH;
					Tables.Item(1).Cell(5, 5).Range.Text = sbly.DW == null?"":sbly.DW;
					Tables.Item(1).Cell(5, 6).Range.Text = sbly.PLE_RECNUM == null?"":sbly.PLE_RECNUM;
					Tables.Item(1).Cell(5, 7).Range.Text = sbly.SCCJ == null?"":sbly.SCCJ;
					Tables.Item(1).Cell(5, 8).Range.Text = sbly.MACHINE_NO == null?"":jzhRender(sbly.MACHINE_NO);
					Tables.Item(1).Cell(5, 9).Range.Text = sbly.REMARK == null?"":sbly.REMARK;
					Tables.Item(1).Cell(5, 10).Range.Text = sbly.RECNUM == null?"":sbly.RECNUM;
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(1).Cell(5, 1).Range.Select();					
				}
			}
		}
	}
}
//设备开箱通知单
function equOpenBoxView(obj,table){
	if('EQU_OPEN_BOX_VIEW' == table){
		if(obj.CONID&&ocxBookMarks.Exists("CONNO")){
			baseDao.findById("com.sgepit.pmis.contract.hbm.ConOve",obj.CONID,function(ConOve){
				if(ConOve&&ConOve.CONNO){
					TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks('CONID'), obj.CONNO);
				}else{
					TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks('CONID'), "");
				}
			})
		}
	}
}
//设备材料验收记录
function equOpenBoxSubView(obj,table){
	if ('EQU_OPEN_BOX_SUB_VIEW' == table){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var sbkx = obj["subdata"][i];
					Tables.Item(1).Cell(5+i, 1).Range.Text = i*1+1;
					Tables.Item(1).Cell(5+i, 2).Range.Text = sbkx.SBBM == null?"":sbkx.SBBM;
					Tables.Item(1).Cell(5+i, 3).Range.Text = sbkx.SBBMC == null?"":sbkx.SBBMC;
					Tables.Item(1).Cell(5+i, 4).Range.Text = sbkx.GGXH == null?"":sbkx.GGXH;
					Tables.Item(1).Cell(5+i, 5).Range.Text = sbkx.OPENSL == null?"0":sbkx.OPENSL+"/"+sbkx.DW == null?"":sbkx.DW;
					Tables.Item(1).Cell(5+i, 6).Range.Text = sbkx.SCCJ == null?"":sbkx.SCCJ;
					Tables.Item(1).Cell(5+i, 7).Range.Text = sbkx.GETGOODS_DIFF == null?"":sbkx.GETGOODS_DIFF;
					Tables.Item(1).Cell(5+i, 8).Range.Text = sbkx.SL_DIFF == null?"":sbkx.SL_DIFF;
					Tables.Item(1).Cell(5+i, 9).Range.Text = sbkx.OUTSHOW == null?"":sbkx.OUTSHOW;
					Tables.Item(1).Cell(5+i, 10).Range.Text = sbkx.PROCESS == null?"":sbkx.PROCESS;
					Tables.Item(1).Cell(5+i, 11).Range.Text = sbkx.PICTURENO == null?"":sbkx.PICTURENO;
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var sbkx = obj["subdata"][i];
					Tables.Item(1).Cell(5, 1).Range.Text = obj["subdata"].length - i;
					Tables.Item(1).Cell(5, 2).Range.Text = sbkx.SBBM == null?"":sbkx.SBBM;
					Tables.Item(1).Cell(5, 3).Range.Text = sbkx.SBBMC == null?"":sbkx.SBBMC;
					Tables.Item(1).Cell(5, 4).Range.Text = sbkx.GGXH == null?"":sbkx.GGXH;
					Tables.Item(1).Cell(5, 5).Range.Text = (sbkx.OPENSL==null?"0":sbkx.OPENSL)+"/"+(sbkx.DW==null?"":sbkx.DW);
					Tables.Item(1).Cell(5, 6).Range.Text = sbkx.SSCJ == null?"":sbkx.SSCJ;
					Tables.Item(1).Cell(5, 7).Range.Text = sbkx.GETGOODS_DIFF == null?"":sbkx.GETGOODS_DIFF;
					Tables.Item(1).Cell(5, 8).Range.Text = sbkx.SL_DIFF == null?"":sbkx.SL_DIFF;
					Tables.Item(1).Cell(5, 9).Range.Text = sbkx.OUTSHOW == null?"":sbkx.OUTSHOW;
					Tables.Item(1).Cell(5, 10).Range.Text = sbkx.PROCESS == null?"":sbkx.PROCESS;
					Tables.Item(1).Cell(5, 11).Range.Text = sbkx.PICTURENO == null?"":sbkx.PICTURENO;
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(1).Cell(5, 1).Range.Select();					
				}
			}
		}
	}
}
//设备入库单
function equGetGoodsView(obj,table){
	if ('EQU_GET_GOODS_VIEW' == table){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(8+i, 1).Range.Text = i*1+1;
					Tables.Item(1).Cell(8+i, 2).Range.Text = sbdh.JZH == null?"":jzhRender(sbdh.PRONAME)
					Tables.Item(1).Cell(8+i, 3).Range.Text = sbdh.WZTYPE == null?"":wztypeRender(sbdh.WZTYPE)
					Tables.Item(1).Cell(8+i, 4).Range.Text = sbdh.BDGNO == null?"":sbdh.BDGNO
					Tables.Item(1).Cell(8+i, 5).Range.Text = sbdh.BDGNAME == null?"":sbdh.BDGNAME
					Tables.Item(1).Cell(8+i, 6).Range.Text = sbdh.SB_BM == null?"":sbdh.SB_BM
					Tables.Item(1).Cell(8+i, 7).Range.Text = sbdh.SB_MC == null?"":sbdh.SB_MC
					Tables.Item(1).Cell(8+i, 8).Range.Text = sbdh.GGXH == null?"":sbdh.GGXH
					Tables.Item(1).Cell(8+i, 9).Range.Text = sbdh.SCCJ == null?"":sbdh.SCCJ
					Tables.Item(1).Cell(8+i, 10).Range.Text = sbdh.DW == null?"":sbdh.DW
					Tables.Item(1).Cell(8+i, 11).Range.Text = sbdh.ZS == null?"":sbdh.ZS
					Tables.Item(1).Cell(8+i, 12).Range.Text = sbdh.DJ == null?"":sbdh.DJ
					Tables.Item(1).Cell(8+i, 13).Range.Text = sbdh.WAREHOUSENO == null?"":sbdh.WAREHOUSENO
					Tables.Item(1).Cell(8+i, 14).Range.Text = sbdh.LIBRARYNO == null?"":sbdh.LIBRARYNO
					Tables.Item(1).Cell(8+i, 15).Range.Text = sbdh.DJ * sbdh.ZS
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(8, 1).Range.Text = obj["subdata"].length - i
					Tables.Item(1).Cell(8, 2).Range.Text = sbdh.JZH == null?"":jzhRender(sbdh.JZH)
					Tables.Item(1).Cell(8, 3).Range.Text = sbdh.WZTYPE == null?"":wztypeRender(sbdh.WZTYPE)
					Tables.Item(1).Cell(8, 4).Range.Text = sbdh.BDGNO == null?"":sbdh.BDGNO
					Tables.Item(1).Cell(8, 5).Range.Text = sbdh.BDGNAME == null?"":sbdh.BDGNAME
					Tables.Item(1).Cell(8, 6).Range.Text = sbdh.SB_BM == null?"":sbdh.SB_BM
					Tables.Item(1).Cell(8, 7).Range.Text = sbdh.SB_MC == null?"":sbdh.SB_MC
					Tables.Item(1).Cell(8, 8).Range.Text = sbdh.GGXH == null?"":sbdh.GGXH
					Tables.Item(1).Cell(8, 9).Range.Text = sbdh.SCCJ == null?"":sbdh.SCCJ
					Tables.Item(1).Cell(8, 10).Range.Text = sbdh.DW == null?"":sbdh.DW
					Tables.Item(1).Cell(8, 11).Range.Text = sbdh.ZS == null?"":sbdh.ZS
					Tables.Item(1).Cell(8, 12).Range.Text = sbdh.DJ == null?"":sbdh.DJ
					Tables.Item(1).Cell(8, 13).Range.Text = sbdh.WAREHOUSENO == null?"":sbdh.WAREHOUSENO
					Tables.Item(1).Cell(8, 14).Range.Text = sbdh.LIBRARYNO == null?"":sbdh.LIBRARYNO
					Tables.Item(1).Cell(8, 15).Range.Text = sbdh.DJ * sbdh.ZS
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(1).Cell(8, 1).Range.Select();					
				}
			}
		}
	}
}
//工程月度付款
function viewProZcmMonthInfo(obj,table){
	if ('VIEW_PRO_ACM_MONTH_INFO' == table){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				var j = 0;
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]					
					if(sbdh.DECLPRO != null && sbdh.DECLPRO != "" && sbdh.DECLPRO != 0){ //申请数量大于0 的才显示
						j = j*1 + 1					
						Tables.Item(3).Cell(7+i, 1).Range.Text = j;
						Tables.Item(3).Cell(7+i, 2).Range.Text = sbdh.PRONAME == null?"":sbdh.PRONAME//项目名称（合同清单部分）
						Tables.Item(3).Cell(7+i, 3).Range.Text = sbdh.UNIT == null?"":sbdh.UNIT//单位（合同清单部分）
						Tables.Item(3).Cell(7+i, 4).Range.Text = sbdh.AMOUNT == null?"":sbdh.AMOUNT//工程量（合同清单部分）
						Tables.Item(3).Cell(7+i, 5).Range.Text = sbdh.PRICE == null?"": parseFloat(sbdh.PRICE).toFixed(2)//单价（合同清单部分）
						Tables.Item(3).Cell(7+i, 6).Range.Text = sbdh.MONEY == null?"":parseFloat(sbdh.MONEY).toFixed(2)//合价（合同清单部分）
						Tables.Item(3).Cell(7+i, 7).Range.Text = sbdh.DECLPRO == null?"":sbdh.DECLPRO//工程量（申请单位部分）
						Tables.Item(3).Cell(7+i, 8).Range.Text = ""//累计（申请单位部分）
						Tables.Item(3).Cell(7+i, 9).Range.Text = sbdh.DECMONEY == null?"":parseFloat(sbdh.DECMONEY).toFixed(0)//金额（申请单位部分）
						Tables.Item(3).Cell(7+i, 10).Range.Text = sbdh.CHECKPRO == null?"":sbdh.CHECKPRO//本月工程量（监理单位）
						Tables.Item(3).Cell(7+i, 11).Range.Text = ""//累计工程量（监理单位）
						Tables.Item(3).Cell(7+i, 12).Range.Text = sbdh.CHECKMONEY == null?"":parseFloat(sbdh.CHECKMONEY).toFixed(0)//金额（监理单位）
						Tables.Item(3).Cell(7+i, 13).Range.Text = sbdh.RATIFTPRO == null?"":sbdh.RATIFTPRO//本月工程量（工程部）
						Tables.Item(3).Cell(7+i, 14).Range.Text = sbdh.TOTALPRO == null?"":sbdh.TOTALPRO//累计工程量（工程部）
						Tables.Item(3).Cell(7+i, 15).Range.Text = ""//本月工程量（计划部）
						Tables.Item(3).Cell(7+i, 16).Range.Text = ""//累计工程量（计划部）
						Tables.Item(3).Cell(7+i, 17).Range.Text = sbdh.RATIFTMONEY == null?"":parseFloat(sbdh.RATIFTMONEY).toFixed(0)//本月金额（计划部）
						Tables.Item(3).Cell(7+i, 18).Range.Text = ""//累计金额（计划部）
					}
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					if(sbdh.DECLPRO != null && sbdh.DECLPRO != "" && sbdh.DECLPRO != 0){	 //申请数量大于0 的才显示
						Tables.Item(3).Cell(7, 1).Range.Text = obj["subdata"].length - i;
						Tables.Item(3).Cell(7, 2).Range.Text = sbdh.PRONAME == null?"":sbdh.PRONAME//项目名称（合同清单部分）
						Tables.Item(3).Cell(7, 3).Range.Text = sbdh.UNIT == null?"":sbdh.UNIT//单位（合同清单部分）
						Tables.Item(3).Cell(7, 4).Range.Text = sbdh.AMOUNT == null?"":sbdh.AMOUNT//工程量（合同清单部分）
						Tables.Item(3).Cell(7, 5).Range.Text = sbdh.PRICE == null?"":parseFloat(sbdh.PRICE).toFixed(2)//单价（合同清单部分）
						Tables.Item(3).Cell(7, 6).Range.Text = sbdh.MONEY == null?"":parseFloat(sbdh.MONEY).toFixed(2)//合价（合同清单部分）
						Tables.Item(3).Cell(7, 7).Range.Text = sbdh.DECLPRO == null?"":sbdh.DECLPRO//工程量（申请单位部分）
						Tables.Item(3).Cell(7, 8).Range.Text = ""//累计（申请单位部分）
						Tables.Item(3).Cell(7, 9).Range.Text = sbdh.DECMONEY == null?"":parseFloat(sbdh.DECMONEY).toFixed(0)//金额（申请单位部分）
						Tables.Item(3).Cell(7, 10).Range.Text = sbdh.CHECKPRO == null?"":sbdh.CHECKPRO//本月工程量（监理单位）
						Tables.Item(3).Cell(7, 11).Range.Text = ""//累计工程量（监理单位）
						Tables.Item(3).Cell(7, 12).Range.Text = sbdh.CHECKMONEY == null?"":parseFloat(sbdh.CHECKMONEY).toFixed(0)//金额（监理单位）
						Tables.Item(3).Cell(7, 13).Range.Text = sbdh.RATIFTPRO == null?"":sbdh.RATIFTPRO//本月工程量（工程部）
						Tables.Item(3).Cell(7, 14).Range.Text = sbdh.TOTALPRO == null?"":sbdh.TOTALPRO//累计工程量（工程部）
						Tables.Item(3).Cell(7, 15).Range.Text = ""//本月工程量（计划部）
						Tables.Item(3).Cell(7, 16).Range.Text = ""//累计工程量（计划部）
						Tables.Item(3).Cell(7, 17).Range.Text = sbdh.RATIFTMONEY == null?"":parseFloat(sbdh.RATIFTMONEY).toFixed(0)//本月金额（计划部）
						Tables.Item(3).Cell(7, 18).Range.Text = ""//累计金额（计划部）
						try{
							if(i<obj["subdata"].length-1)
								Application.Selection.Rows.Add(Application.Selection.Rows(1));
							Tables.Item(3).Cell(7, 1).Range.Select();								
						}catch(ex){
							alert(ex)
						}
					}					
				}
				Tables.Item(3).Cell(3, 1).Merge(Tables.Item(3).Cell(6, 1));
				Tables.Item(3).Cell(3, 2).Merge(Tables.Item(3).Cell(6, 2));
				Tables.Item(3).Cell(3, 3).Merge(Tables.Item(3).Cell(4, 3));
				Tables.Item(3).Cell(5, 3).Merge(Tables.Item(3).Cell(6, 3));
				Tables.Item(3).Cell(5, 4).Merge(Tables.Item(3).Cell(6, 4));
				Tables.Item(3).Cell(5, 5).Merge(Tables.Item(3).Cell(6, 5));
				Tables.Item(3).Cell(5, 6).Merge(Tables.Item(3).Cell(6, 6));
				Tables.Item(3).Cell(3, 4).Merge(Tables.Item(3).Cell(4, 4));
				Tables.Item(3).Cell(5, 8).Merge(Tables.Item(3).Cell(6, 9));
				Tables.Item(3).Cell(3, 5).Merge(Tables.Item(3).Cell(4, 5));
				Tables.Item(3).Cell(5, 10).Merge(Tables.Item(3).Cell(6, 12));
			}
			//特殊性处理 需要替换WORD中的申请单位(甲方)和合同名称标签，需要查询合同信息表
			if(obj["subdata"].length>0&&obj["subdata"][0].CONID){
				DWREngine.setAsync(false);
				baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOve",obj["subdata"][0].CONID,function(o){
					if(o){
						if(ocxBookMarks.Exists("PARTYA")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("PARTYA"), o.partya);}
						if(ocxBookMarks.Exists("CONNAME")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("CONNAME"), o.conname);}
					}
				})
				DWREngine.setAsync(true);
			}
		}
	}
}
//////////////////////////////////////////
//2011-09-23 以下内容为移植国锦流程中打印数据到word的方法
//物资申请计划
//2013-03-21 国锦物资申请计划调整
function viewWzCjsxbPb(obj,table){
	if ('VIEW_WZ_CJSXB_PB' == table){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var rowNum = Application.Selection.Text;
            var totaDJ = 0;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(5+i, 1).Range.Text = i*1+1;
					Tables.Item(1).Cell(5+i, 2).Range.Text = sbdh.PM == null?"":sbdh.PM
					Tables.Item(1).Cell(5+i, 3).Range.Text = sbdh.GG == null?"":sbdh.GG
					Tables.Item(1).Cell(5+i, 4).Range.Text = sbdh.SQSL == null?"":sbdh.SQSL
					Tables.Item(1).Cell(5+i, 5).Range.Text = sbdh.DW == null?"":sbdh.DW;//单位
					Tables.Item(1).Cell(5+i, 6).Range.Text = sbdh.DJ == null?"":(sbdh.DJ).toString();//计划单价
					Tables.Item(1).Cell(5+i, 7).Range.Text = sbdh.DJ == null?"":(sbdh.SQSL*sbdh.DJ).toString();//金额
					Tables.Item(1).Cell(5+i, 8).Range.Text = sbdh.XQRQ == null?"":formatDate(sbdh.XQRQ).substring(0,10)
                    totaDJ += sbdh.DJ == null?"":sbdh.SQSL*sbdh.DJ;
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(5, 1).Range.Text = obj["subdata"].length - i
					//Tables.Item(1).Cell(5, 2).Range.Text = sbdh.BM == null?"":sbdh.BM
					Tables.Item(1).Cell(5, 2).Range.Text = sbdh.PM == null?"":sbdh.PM
					Tables.Item(1).Cell(5, 3).Range.Text = sbdh.GG == null?"":sbdh.GG
					Tables.Item(1).Cell(5, 4).Range.Text = sbdh.SQSL == null?"":sbdh.SQSL
					Tables.Item(1).Cell(5, 5).Range.Text = sbdh.DW == null?"":sbdh.DW;//单位
					Tables.Item(1).Cell(5, 6).Range.Text = sbdh.DJ == null?"":(sbdh.DJ).toString();//计划单价
					Tables.Item(1).Cell(5, 7).Range.Text = sbdh.DJ == null?"":(sbdh.SQSL*sbdh.DJ).toString();//金额
					Tables.Item(1).Cell(5, 8).Range.Text = sbdh.XQRQ == null?"":formatDate(sbdh.XQRQ).substring(0,10)
                    totaDJ += sbdh.DJ == null?"":sbdh.SQSL*sbdh.DJ;
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(1).Cell(5, 1).Range.Select();					
				}
			} 
            if(ocxBookMarks.Exists("TOTALMONEY")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("TOTALMONEY"), (totaDJ).toString());}
		}
	}
}
//物资采购计划
//2013-03-21 国锦物资申请计划调整
function viewWzCjhxb(obj,table){
	if ('VIEW_WZ_CJHXB' == table){
			ocxBookMarks('ROWNUM').Select();
			with(TANGER_OCX_OBJ.ActiveDocument){
				var rowNum = Application.Selection.Text;
                var totaDJ = 0;
				if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
					for(var i=0;i<obj["subdata"].length;i++){
						var sbdh = obj["subdata"][i]
						Tables.Item(1).Cell(2+i, 1).Range.Text = i*1+1;
						Tables.Item(1).Cell(2+i, 2).Range.Text = sbdh.PM == null?"":sbdh.PM
						Tables.Item(1).Cell(2+i, 3).Range.Text = sbdh.GG == null?"":sbdh.GG
						Tables.Item(1).Cell(2+i, 4).Range.Text = sbdh.DW == null?"":sbdh.DW
						Tables.Item(1).Cell(2+i, 5).Range.Text = sbdh.HZSL == null?"":sbdh.HZSL
						Tables.Item(1).Cell(2+i, 6).Range.Text = sbdh.YGSL == null?"":sbdh.YGSL
						Tables.Item(1).Cell(2+i, 7).Range.Text =""
						Tables.Item(1).Cell(2+i, 8).Range.Text = sbdh.CSDM == null?"":sbdh.CSDM
						Tables.Item(1).Cell(2+i, 9).Range.Text =  sbdh.DJ == null?"":(sbdh.DJ).toString();
						Tables.Item(1).Cell(2+i, 10).Range.Text = sbdh.DJ == null?"":(sbdh.YGSL*sbdh.DJ).toString();//金额
						totaDJ += sbdh.DJ == null?"":sbdh.YGSL*sbdh.DJ;
					}					
				}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
					for(var i=0;i<obj["subdata"].length;i++){
						var sbdh = obj["subdata"][i]
						Tables.Item(1).Cell(2, 1).Range.Text = obj["subdata"].length - i
						Tables.Item(1).Cell(2, 2).Range.Text = sbdh.PM == null?"":sbdh.PM
						Tables.Item(1).Cell(2, 3).Range.Text = sbdh.GG == null?"":sbdh.GG
						Tables.Item(1).Cell(2, 4).Range.Text = sbdh.DW == null?"":sbdh.DW
						Tables.Item(1).Cell(2, 5).Range.Text = sbdh.HZSL == null?"":sbdh.HZSL
						Tables.Item(1).Cell(2, 6).Range.Text = sbdh.YGSL == null?"":sbdh.YGSL
						Tables.Item(1).Cell(2, 7).Range.Text =""
						Tables.Item(1).Cell(2, 8).Range.Text = sbdh.CSDM == null?"":sbdh.CSDM
						Tables.Item(1).Cell(2, 9).Range.Text = sbdh.DJ == null?"":(sbdh.DJ).toString();
						Tables.Item(1).Cell(2, 10).Range.Text = sbdh.DJ == null?"":(sbdh.YGSL*sbdh.DJ).toString();//金额
						totaDJ += sbdh.DJ == null?"":sbdh.YGSL*sbdh.DJ;
						if(i<obj["subdata"].length-1)
							Application.Selection.Rows.Add(Application.Selection.Rows(1));
						Tables.Item(1).Cell(2, 1).Range.Select();					
					}
				} 
                if(ocxBookMarks.Exists("TOTALMONEY")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("TOTALMONEY"), (totaDJ).toString());}
			}
		}
}
//物资到货登记
function viewWzinputWzcdjinpb(obj,table){
	if ('VIEW_WZINPUT_WZCDJINPB' == table){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(2+i, 1).Range.Text = i*1+1;
					Tables.Item(1).Cell(2+i, 2).Range.Text = ""
					Tables.Item(1).Cell(2+i, 3).Range.Text = sbdh.BM == null?"":sbdh.BM
					Tables.Item(1).Cell(2+i, 4).Range.Text = sbdh.PM == null?"":sbdh.PM
					Tables.Item(1).Cell(2+i, 5).Range.Text = sbdh.GG == null?"":sbdh.GG
					Tables.Item(1).Cell(2+i, 6).Range.Text = ""
					Tables.Item(1).Cell(2+i, 7).Range.Text = sbdh.DW == null?"":sbdh.DW
					Tables.Item(1).Cell(2+i, 8).Range.Text = sbdh.SL == null?"":sbdh.SL
					Tables.Item(1).Cell(2+i, 9).Range.Text = sbdh.BZ == null?"":sbdh.BZ
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(2, 1).Range.Text = obj["subdata"].length - i
					Tables.Item(1).Cell(2, 2).Range.Text = ""
					Tables.Item(1).Cell(2, 3).Range.Text = sbdh.BM == null?"":sbdh.BM
					Tables.Item(1).Cell(2, 4).Range.Text = sbdh.PM == null?"":sbdh.PM
					Tables.Item(1).Cell(2, 5).Range.Text = sbdh.GG == null?"":sbdh.GG
					Tables.Item(1).Cell(2, 6).Range.Text = ""
					Tables.Item(1).Cell(2, 7).Range.Text = sbdh.DW == null?"":sbdh.DW
					Tables.Item(1).Cell(2, 8).Range.Text = sbdh.SL == null?"":sbdh.SL
					Tables.Item(1).Cell(2, 9).Range.Text = sbdh.BZ == null?"":sbdh.BZ
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(1).Cell(2, 1).Range.Select();					
				}
			} 
		}
	}
}
//物资领用
function wzOutput(obj,table){
		if ('WZ_OUTPUT' == table){
			ocxBookMarks('ROWNUM').Select();
			with(TANGER_OCX_OBJ.ActiveDocument){
				var rowNum = Application.Selection.Text;
				if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
					for(var i=0;i<obj["subdata"].length;i++){
						var sbdh = obj["subdata"][i]
						Tables.Item(1).Cell(1+i, 1).Range.Text = i*1+1;
						Tables.Item(1).Cell(2+i, 2).Range.Text = sbdh.BM == null?"":sbdh.BM
						Tables.Item(1).Cell(2+i, 3).Range.Text = sbdh.PM == null?"":sbdh.PM
						Tables.Item(1).Cell(2+i, 4).Range.Text = sbdh.GG == null?"":sbdh.GG
						Tables.Item(1).Cell(2+i, 5).Range.Text = sbdh.DW == null?"":sbdh.DW
						Tables.Item(1).Cell(2+i, 6).Range.Text = sbdh.SQSL == null?"":sbdh.SQSL
						Tables.Item(1).Cell(3, 7).Range.Text = sbdh.JHDJ == null?"":sbdh.JHDJ
						Tables.Item(1).Cell(2+i, 8).Range.Text = sbdh.JHDJ_SL == null?"0":sbdh.JHDJ_SL
						Tables.Item(1).Cell(2+i, 9).Range.Text = sbdh.HTH == null?"":sbdh.HTH
					}					
				}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
					for(var i=0;i<obj["subdata"].length;i++){
						var sbdh = obj["subdata"][i]
						if(i==0){
							Tables.Item(1).Cell(1, 2).Range.Text = sbdh.BH == null?"":sbdh.BH
						}
						Tables.Item(1).Cell(3, 1).Range.Text = obj["subdata"].length - i
						Tables.Item(1).Cell(3, 2).Range.Text = sbdh.BM == null?"":sbdh.BM
						Tables.Item(1).Cell(3, 3).Range.Text = sbdh.PM == null?"":sbdh.PM
						Tables.Item(1).Cell(3, 4).Range.Text = sbdh.GG == null?"":sbdh.GG
						Tables.Item(1).Cell(3, 5).Range.Text = sbdh.DW == null?"":sbdh.DW
						Tables.Item(1).Cell(3, 6).Range.Text = sbdh.SQSL == null?"":sbdh.SQSL
						Tables.Item(1).Cell(3, 7).Range.Text = sbdh.JHDJ == null?"":sbdh.JHDJ
						Tables.Item(1).Cell(3, 8).Range.Text = sbdh.JHDJ_SL == null?"0":sbdh.JHDJ_SL
						Tables.Item(1).Cell(3, 9).Range.Text = sbdh.HTH == null?"":sbdh.HTH
						if(i<obj["subdata"].length-1)
							Application.Selection.Rows.Add(Application.Selection.Rows(1));
						Tables.Item(1).Cell(3, 1).Range.Select();					
					}
				} 
			}
		}
}
//部门资金计划上报
function bdgMonthMoneyPlanView(obj,table){
	if ('BDG_MONTH_MONEY_PLAN_VIEW' == table){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(2+i, 1).Range.Text = i*1+1;
					Tables.Item(1).Cell(2+i, 2).Range.Text = sbdh.CONTENT == null?"":sbdh.CONTENT
					Tables.Item(1).Cell(2+i, 3).Range.Text = sbdh.PLANMONEY == null?"":sbdh.PLANMONEY
					Tables.Item(1).Cell(2+i, 4).Range.Text = sbdh.ENDDATE == null?"":formatDate(sbdh.ENDDATE).substring(0,10)
					Tables.Item(1).Cell(2+i, 5).Range.Text = sbdh.FZR == null?"":sbdh.FZR
					Tables.Item(1).Cell(2+i, 6).Range.Text = sbdh.MEMO == null?"":sbdh.MEMO
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(2, 1).Range.Text = obj["subdata"].length - i
					Tables.Item(1).Cell(2, 2).Range.Text = sbdh.CONTENT == null?"":sbdh.CONTENT
					Tables.Item(1).Cell(2, 3).Range.Text =  sbdh.PLANMONEY == null?"":sbdh.PLANMONEY
					Tables.Item(1).Cell(2, 4).Range.Text = sbdh.ENDDATE == null?"":formatDate(sbdh.ENDDATE).substring(0,10)
					Tables.Item(1).Cell(2, 5).Range.Text = sbdh.FZR == null?"":sbdh.FZR
					Tables.Item(1).Cell(2, 6).Range.Text = sbdh.MEMO == null?"":sbdh.MEMO
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(1).Cell(2, 1).Range.Select();					
				}
			} 
		}
	}
}
//部门资金计划汇总
function bdgMonthMoneyPlanHzView(obj,table){
	if ('BDG_MONTH_MONEY_PLAN_HZ_VIEW' == table){
		var sumplanmoney=0
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(2+i, 1).Range.Text = i*1+1;
					Tables.Item(1).Cell(2+i, 2).Range.Text = sbdh.DEPT == null?"":sbdh.DEPT
					Tables.Item(1).Cell(2+i, 3).Range.Text = sbdh.CONTENT == null?"":sbdh.CONTENT
					Tables.Item(1).Cell(2+i, 4).Range.Text = sbdh.PLANMONEY == null?"":sbdh.PLANMONEY
					Tables.Item(1).Cell(2+i, 5).Range.Text = sbdh.ENDDATE == null?"":formatDate(sbdh.ENDDATE).substring(0,10)
					Tables.Item(1).Cell(2+i, 6).Range.Text = sbdh.FZR == null?"":sbdh.FZR
					Tables.Item(1).Cell(2+i, 7).Range.Text = sbdh.MEMO == null?"":sbdh.MEMO
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					sumplanmoney+=sbdh.PLANMONEY
					Tables.Item(1).Cell(2, 1).Range.Text = obj["subdata"].length - i
					Tables.Item(1).Cell(2, 2).Range.Text = sbdh.DEPT == null?"":sbdh.DEPT
					Tables.Item(1).Cell(2, 3).Range.Text = sbdh.CONTENT == null?"":sbdh.CONTENT
					Tables.Item(1).Cell(2, 4).Range.Text =  sbdh.PLANMONEY == null?"":sbdh.PLANMONEY
					Tables.Item(1).Cell(2, 5).Range.Text = sbdh.ENDDATE == null?"":formatDate(sbdh.ENDDATE).substring(0,10)
					Tables.Item(1).Cell(2, 6).Range.Text = sbdh.FZR == null?"":sbdh.FZR
					Tables.Item(1).Cell(2, 7).Range.Text = sbdh.MEMO == null?"":sbdh.MEMO
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(1).Cell(2, 1).Range.Select();					
				}
			} 
		}
		for (var i=0; i<ocxBookMarks.Count; i++){
			var bookmark = ocxBookMarks(i+1).Name;
					if (bookmark == 'SUMPLANMONEY'){
							TANGER_OCX_OBJ.SetBookmarkValue(bookmark,sumplanmoney)}}
	}
}
//部门资金计划补录
function bdgMonthMoneyPlanBlView(obj,table){
	if ('BDG_MONTH_MONEY_PLAN_BL_VIEW' == table){
			ocxBookMarks('ROWNUM').Select();
			with(TANGER_OCX_OBJ.ActiveDocument){
				var rowNum = Application.Selection.Text;
				if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
					for(var i=0;i<obj["subdata"].length;i++){
						var sbdh = obj["subdata"][i]
						Tables.Item(1).Cell(2+i, 1).Range.Text = i*1+1;
						Tables.Item(1).Cell(2+i, 2).Range.Text = sbdh.DEPT == null?"":sbdh.DEPT
						Tables.Item(1).Cell(2+i, 3).Range.Text = sbdh.CONTENT == null?"":sbdh.CONTENT
						Tables.Item(1).Cell(2+i, 4).Range.Text = sbdh.PLANMONEY == null?"":sbdh.PLANMONEY
						Tables.Item(1).Cell(2+i, 5).Range.Text = sbdh.ENDDATE == null?"":formatDate(sbdh.ENDDATE).substring(0,10)
						Tables.Item(1).Cell(2+i, 6).Range.Text = sbdh.FZR == null?"":sbdh.FZR
						Tables.Item(1).Cell(2+i, 7).Range.Text = sbdh.MEMO == null?"":sbdh.MEMO
					}					
				}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
					for(var i=0;i<obj["subdata"].length;i++){
						var sbdh = obj["subdata"][i]
						Tables.Item(1).Cell(2, 1).Range.Text = obj["subdata"].length - i
						Tables.Item(1).Cell(2, 2).Range.Text = sbdh.DEPT == null?"":sbdh.DEPT
						Tables.Item(1).Cell(2, 3).Range.Text = sbdh.CONTENT == null?"":sbdh.CONTENT
						Tables.Item(1).Cell(2, 4).Range.Text =  sbdh.PLANMONEY == null?"":sbdh.PLANMONEY
						Tables.Item(1).Cell(2, 5).Range.Text = sbdh.ENDDATE == null?"":formatDate(sbdh.ENDDATE).substring(0,10)
						Tables.Item(1).Cell(2, 6).Range.Text = sbdh.FZR == null?"":sbdh.FZR
						Tables.Item(1).Cell(2, 7).Range.Text = sbdh.MEMO == null?"":sbdh.MEMO
						if(i<obj["subdata"].length-1)
							Application.Selection.Rows.Add(Application.Selection.Rows(1));
						Tables.Item(1).Cell(2, 1).Range.Select();					
					}
				} 
			}
		}
}
//2010-12-29 安全专款申请 流程中打印到word模板
function safetyMoneyApply(obj,table){
	if('SAFETY_MONEY_APPLY' == table) {
		with(TANGER_OCX_OBJ.ActiveDocument){
			var apply = obj["subdata"][0]
			with(TANGER_OCX_OBJ){
				SetBookmarkValue(ocxBookMarks("APPLYTIME"), formatDate(apply.APPLYTIME).substring(0,10));//时间
				SetBookmarkValue(ocxBookMarks("APPLYMONEY"), apply.APPLYMONEY);//费用
				SetBookmarkValue(ocxBookMarks("USING"), apply.USING);//用途
			}
		}			
	}
}
//2010-12-29 安全执行情况评估 流程中打印到word模板
function safetyMoneyApplyPg(obj,table){
	if('SAFETY_MONEY_APPLY_PG' == table) {
		with(TANGER_OCX_OBJ.ActiveDocument){
			var applyPG = obj["subdata"][0]
			with(TANGER_OCX_OBJ){
				SetBookmarkValue(ocxBookMarks("PGTIME"), formatDate(applyPG.PGTIME).substring(0,10));//时间
				SetBookmarkValue(ocxBookMarks("USING"), applyPG.USING);//用途
			}
		}				
	}
}
//2010-12-09 打印部门周工作上报
function gzWeekReportView(obj,table){
	if ('GZ_WEEK_REPORT_VIEW' == table){
		with(TANGER_OCX_OBJ.ActiveDocument){
			var zhoubao = obj["subdata"][0]
			with(TANGER_OCX_OBJ){
				SetBookmarkValue(ocxBookMarks("REPORTDEPT"), zhoubao.REPORTDEPT);//部门
				SetBookmarkValue(ocxBookMarks("REPORTTIME"), formatDate(zhoubao.REPORTTIME).substring(0,10));//时间
				SetBookmarkValue(ocxBookMarks("REPORTMONTH"), zhoubao.REPORTMONTH);//几月
				SetBookmarkValue(ocxBookMarks("REPORTWEEK"), zhoubao.REPORTWEEK);//第几周
			}
			var typeX = new Array();
			var type0 = new Array();
			var type1 = new Array();
			var type2 = new Array();
			var type3 = new Array();
			var rowNumList = new Array();
			for(var i=0;i<obj["subdata"].length;i++){
				var data = obj["subdata"][i];
				if(data.CONTENTTYPE == 0) type0.push(data);
				if(data.CONTENTTYPE == 1) type1.push(data);
				if(data.CONTENTTYPE == 2) type2.push(data);
				if(data.CONTENTTYPE == 3) type3.push(data);
			}
			
			typeX = [type0,type1,type2,type3];
			rowNumList = ['ROWNUM0','ROWNUM1','ROWNUM2','ROWNUM3'];
			
			var row = 3;
			for(var t=0; t<typeX.length;t++){
				if(typeX[t].length>0){
					ocxBookMarks(rowNumList[t]).Select();
					var rowNum = Application.Selection.Text;
					for(var i=0;i<typeX[t].length;i++){
						if(/^([1-9]\d*)$/.test(rowNum)){//如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
							Tables.Item(1).Cell(row+i, 1).Range.Text = i*1+1;
							Tables.Item(1).Cell(row+i, 2).Range.Text = typeX[t][i].REPORTCONTENT == null?"":typeX[t][i].REPORTCONTENT
						}else{//否则则说明是第一次关联，直接按照实际数据创建表格
							Tables.Item(1).Cell(row, 1).Range.Text = typeX[t].length-i;
							Tables.Item(1).Cell(row, 2).Range.Text = typeX[t][i].REPORTCONTENT == null?"":typeX[t][i].REPORTCONTENT
							if(i<typeX[t].length-1)
								Application.Selection.Rows.Add(Application.Selection.Rows(1));
							Tables.Item(1).Cell(row, 1).Range.Select();
						}
					}
					row = row + 3 + typeX[t].length-1;
				}else{
					row = row + 3;
				}
			}
		}
	}	
}
//2010-12-10 部门周报汇总打印
function gzWeekReportHzView(obj,table){
	if("GZ_WEEK_REPORT_HZ_VIEW" == table){
		with(TANGER_OCX_OBJ.ActiveDocument){
			var zhoubao = obj["subdata"][0]
			with(TANGER_OCX_OBJ){
				SetBookmarkValue(ocxBookMarks("REPORTTIME"), formatDate(zhoubao.REPORTTIME).substring(0,10));//时间
				SetBookmarkValue(ocxBookMarks("REPORTMONTH"), zhoubao.REPORTMONTH);//几月
				SetBookmarkValue(ocxBookMarks("REPORTWEEK"), zhoubao.REPORTWEEK);//第几周
			}			
			
			var typeX = new Array();
			var type0 = new Array();
			var type1 = new Array();
			var type2 = new Array();
			var type3 = new Array();
			var rowNumList = new Array();
			for(var i=0;i<obj["subdata"].length;i++){
				var data = obj["subdata"][i];
				if(data.CONTENTTYPE == 0) type0.push(data);
				if(data.CONTENTTYPE == 1) type1.push(data);
				if(data.CONTENTTYPE == 2) type2.push(data);
				if(data.CONTENTTYPE == 3) type3.push(data);
			}
			
			typeX = [type0,type1,type2,type3];
			rowNumList = ['ROWNUM0','ROWNUM1','ROWNUM2','ROWNUM3'];
			
			var row = 3;
			for(var t=0; t<typeX.length;t++){
				if(typeX[t].length>0){
					ocxBookMarks(rowNumList[t]).Select();
					var rowNum = Application.Selection.Text;
					for(var i=0;i<typeX[t].length;i++){
						if(/^([1-9]\d*)$/.test(rowNum)){//如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
							Tables.Item(1).Cell(row+i, 1).Range.Text = i*1+1;
							Tables.Item(1).Cell(row+i, 2).Range.Text = typeX[t][i].REPORTCONTENT == null?"":("["+typeX[t][i].REPORTDEPT+"]"+typeX[t][i].REPORTCONTENT)
						}else{//否则则说明是第一次关联，直接按照实际数据创建表格
							Tables.Item(1).Cell(row, 1).Range.Text = typeX[t].length-i;
							Tables.Item(1).Cell(row, 2).Range.Text = typeX[t][i].REPORTCONTENT == null?"":("["+typeX[t][i].REPORTDEPT+"]"+typeX[t][i].REPORTCONTENT)
							if(i<typeX[t].length-1)
								Application.Selection.Rows.Add(Application.Selection.Rows(1));
							Tables.Item(1).Cell(row, 1).Range.Select();
						}
					}
					row = row + 3 + typeX[t].length-1;
				}else{
					row = row + 3;
				}
			}
		}
	}
}
//2010-12-10 部门月工作上
function gzMonthReportView(obj,table){
	if ('GZ_MONTH_REPORT_VIEW' == table){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var zhoubao = obj["subdata"][0]
			with(TANGER_OCX_OBJ){
				SetBookmarkValue(ocxBookMarks("REPORTDEPT"), zhoubao.REPORTDEPT);//部门
				SetBookmarkValue(ocxBookMarks("MONTH"), (zhoubao.MONTH).substring(0,4)+"年"+(zhoubao.MONTH).substring(4,6));//几月
			}
		
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(2+i, 1).Range.Text = i*1+1;
					Tables.Item(1).Cell(2+i, 2).Range.Text = sbdh.THISMONTHITEM == null?"":sbdh.THISMONTHITEM
					Tables.Item(1).Cell(2+i, 3).Range.Text = sbdh.THISUSER == null?"":sbdh.THISUSER
					Tables.Item(1).Cell(2+i, 4).Range.Text = sbdh.PLANTIME == null?"":formatDate(sbdh.PLANTIME).substring(0,10)
					Tables.Item(1).Cell(2+i, 5).Range.Text = sbdh.LASTMONTHITEM == null?"":sbdh.LASTMONTHITEM
					Tables.Item(1).Cell(2+i, 6).Range.Text = sbdh.LASTUSER == null?"":sbdh.LASTUSER
					Tables.Item(1).Cell(2+i, 7).Range.Text = sbdh.COMPLETE == null?"":sbdh.COMPLETE
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(2, 1).Range.Text = obj["subdata"].length - i
					Tables.Item(1).Cell(2, 2).Range.Text = sbdh.THISMONTHITEM == null?"":sbdh.THISMONTHITEM
					Tables.Item(1).Cell(2, 3).Range.Text = sbdh.THISUSER == null?"":sbdh.THISUSER
					Tables.Item(1).Cell(2, 4).Range.Text = sbdh.PLANTIME == null?"":formatDate(sbdh.PLANTIME).substring(0,10)
					Tables.Item(1).Cell(2, 5).Range.Text = sbdh.LASTMONTHITEM == null?"":sbdh.LASTMONTHITEM
					Tables.Item(1).Cell(2, 6).Range.Text = sbdh.LASTUSER == null?"":sbdh.LASTUSER
					Tables.Item(1).Cell(2, 7).Range.Text = sbdh.COMPLETE == null?"":sbdh.COMPLETE
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(1).Cell(2, 1).Range.Select();					
				}
			} 
		}
	}
}
//2010-12-10 部门月工作汇总
function gzMonthReportHzView(obj,table){
	if ('GZ_MONTH_REPORT_HZ_VIEW' == table){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var zhoubao = obj["subdata"][0]
			with(TANGER_OCX_OBJ){
				SetBookmarkValue(ocxBookMarks("REPORTDEPT"), zhoubao.REPORTDEPT);//部门
				SetBookmarkValue(ocxBookMarks("MONTH"), (zhoubao.MONTH).substring(0,4)+"年"+(zhoubao.MONTH).substring(4,6));//几月
			}
		
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(2+i, 1).Range.Text = i*1+1
					Tables.Item(1).Cell(2+i, 2).Range.Text = sbdh.REPORTDEPT == null?"":sbdh.REPORTDEPT
					Tables.Item(1).Cell(2+i, 3).Range.Text = sbdh.THISMONTHITEM == null?"":sbdh.THISMONTHITEM
					Tables.Item(1).Cell(2+i, 4).Range.Text = sbdh.THISUSER == null?"":sbdh.THISUSER
					Tables.Item(1).Cell(2+i, 5).Range.Text = sbdh.PLANTIME == null?"":formatDate(sbdh.PLANTIME).substring(0,10)
					Tables.Item(1).Cell(2+i, 6).Range.Text = sbdh.LASTMONTHITEM == null?"":sbdh.LASTMONTHITEM
					Tables.Item(1).Cell(2+i, 7).Range.Text = sbdh.LASTUSER == null?"":sbdh.LASTUSER
					Tables.Item(1).Cell(2+i, 8).Range.Text = sbdh.COMPLETE == null?"":sbdh.COMPLETE
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var sbdh = obj["subdata"][i]
					Tables.Item(1).Cell(2, 1).Range.Text = obj["subdata"].length - i
					Tables.Item(1).Cell(2, 2).Range.Text = sbdh.REPORTDEPT == null?"":sbdh.REPORTDEPT
					Tables.Item(1).Cell(2, 3).Range.Text = sbdh.THISMONTHITEM == null?"":sbdh.THISMONTHITEM
					Tables.Item(1).Cell(2, 4).Range.Text = sbdh.THISUSER == null?"":sbdh.THISUSER
					Tables.Item(1).Cell(2, 5).Range.Text = sbdh.PLANTIME == null?"":formatDate(sbdh.PLANTIME).substring(0,10)
					Tables.Item(1).Cell(2, 6).Range.Text = sbdh.LASTMONTHITEM == null?"":sbdh.LASTMONTHITEM
					Tables.Item(1).Cell(2, 7).Range.Text = sbdh.LASTUSER == null?"":sbdh.LASTUSER
					Tables.Item(1).Cell(2, 8).Range.Text = sbdh.COMPLETE == null?"":sbdh.COMPLETE
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(1).Cell(2, 1).Range.Select();					
				}
			} 
		}
	}
}
//////////////////////////////////////////
	
//合同付款
function conPapView(obj,table){
	if ('CON_PAY_VIEW' == table) {
		//获取累计付款信息
		DWREngine.setAsync(false);
		conexpMgm.getCountInfo('合同付款', obj['CONID'], obj['PAYID'], function(list){
	    	for (var i = 0; i < list.length; i++){
	    		var name = list[i][0];
	    		var money = list[i][1];
	    		for (var j=0; j<ocxBookMarks.Count; j++){
					var bookmark = ocxBookMarks(j+1).Name;
					if (bookmark == name){
						TANGER_OCX_OBJ.SetBookmarkValue(bookmark, money);
					}
				}
	    	}
	    });
	    DWREngine.setAsync(true);
	}
	var _value_finish = 0;
	//应支付和扣减转换成万元
	if ( ! isNaN(obj['PASSMONEY']) ){
		var value = (obj['PASSMONEY'] / 10000) + '';
		TANGER_OCX_OBJ.SetBookmarkValue("PASSMONEYMI", value);
		
	}
	
	if (!isNaN(obj['DEMONEY'])) {
		var value = (obj['DEMONEY'] / 10000) + '';
		TANGER_OCX_OBJ.SetBookmarkValue("DEMONEYMI", value);
	}

	DWREngine.setAsync(false);
	baseDao.findByWhere5(bean, "conid='" + obj['CONID'] + "'", null, null,
			null, function(list) {
				if (list) {
					for (var i = 0; i < list.length; i++) {
						if (1 == list[i].billstate) {
							_value_finish += list[i].paymoney;
						}
					}
				}
			});
	DWREngine.setAsync(true);
	TANGER_OCX_OBJ.SetBookmarkValue("ALREADYPAY", _value_finish);
	
	// 关联到合同余额：合同余额 = 合同金额-本次支付-已付金额（已处理累计付款）
	var conTbValue = (obj['CONVALUE'] - obj['PAYMONEY'] - _value_finish);
    if(conTbValue != null && conTbValue != "")
        conTbValue = parseFloat(parseFloat(conTbValue).toFixed(2));
	TANGER_OCX_OBJ.SetBookmarkValue("CONTRACTBLANCE", conTbValue);
}
function equSpecialToolsView(obj,table){
	var bidtype="",partyb="",usetime="";
	DWREngine.setAsync(false);
	baseDao.findByWhere5("com.sgepit.pmis.contract.hbm.ConOve", "conid='" + obj['CONID'] + "'", null, null,
			null, function(list) {
				if (list) {
					for (var i = 0; i < list.length; i++) {
					//找出招标内容和乙方单位
						bidtype=list[i].bidtype;
						partyb=list[i].partybno;
					}
				}
			});
	baseDao.findByWhere5("com.sgepit.pcmis.bid.hbm.PcBidZbContent", "uids='" + bidtype + "'", null, null,
			null, function(list) {
				if (list) {
					for (var i = 0; i < list.length; i++) {
					//找出招标内容
						bidtype=list[i].contentes;
					}
				}
			});	
	baseDao.findByWhere5("com.sgepit.pmis.contract.hbm.ConPartyb", "cpid='" + partyb + "'", null, null,
			null, function(list) {
				if (list) {
					for (var i = 0; i < list.length; i++) {
					//找出招标内容
						partyb=list[i].partyb;
					}
				}
			});						
	db2Json.selectData(" select uids,to_char(usetime,'yyyy-mm-dd')tdate from EQU_SPECIAL_TOOLS where bh='"+obj['BH']+"'", function(jsonData) {
				var list = eval(jsonData);
				if (list) {
					for (var i = 0; i < list.length; i++) {
					//找出借用日期
						usetime=list[i].tdate;
					}
				}
			});			
			
	DWREngine.setAsync(true);
	TANGER_OCX_OBJ.SetBookmarkValue("USETIME", usetime);//日期
	TANGER_OCX_OBJ.SetBookmarkValue("CONTENTNAME", bidtype);//主设备名称
	TANGER_OCX_OBJ.SetBookmarkValue("PARTYBNAME", partyb);//供货厂家
	
	/*
	根据masteruids循环EquSpecialToolsDetail
	*/
	ocxBookMarks('ROWNUM').Select();
	//alert(obj["subdata"].length);
	with(TANGER_OCX_OBJ.ActiveDocument){
		var rowNum = Application.Selection.Text;
		if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
			for(var i=0;i<obj["subdata"].length;i++){
				var equSpecialToolsDetailView = obj["subdata"][i];
				//Tables.Item(2).Cell(2+i, 1).Range.Text = i*1+1;
				Tables.Item(2).Cell(2+i, 2).Range.Text = equSpecialToolsDetailView.TOOLSNAME == null?"":equSpecialToolsDetailView.TOOLSNAME
				Tables.Item(2).Cell(2+i, 3).Range.Text = equSpecialToolsDetailView.TOOLSXH == null?"":equSpecialToolsDetailView.TOOLSXH
				Tables.Item(2).Cell(2+i, 5).Range.Text = equSpecialToolsDetailView.JCNUM == null?"":equSpecialToolsDetailView.JCNUM
				Tables.Item(2).Cell(2+i, 6).Range.Text = equSpecialToolsDetailView.MEMO == null?"":equSpecialToolsDetailView.MEMO
			}					
		}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
			for(var i=0;i<obj["subdata"].length;i++){
				var equSpecialToolsDetailView = obj["subdata"][i]
				//Tables.Item(2).Cell(2, 1).Range.Text = i*1+1;
				Tables.Item(2).Cell(2, 2).Range.Text = equSpecialToolsDetailView.TOOLSNAME == null?"":equSpecialToolsDetailView.TOOLSNAME
				Tables.Item(2).Cell(2, 3).Range.Text = equSpecialToolsDetailView.TOOLSXH == null?"":equSpecialToolsDetailView.TOOLSXH
				Tables.Item(2).Cell(2, 5).Range.Text = equSpecialToolsDetailView.JCNUM == null?"":equSpecialToolsDetailView.JCNUM
				Tables.Item(2).Cell(2, 6).Range.Text = equSpecialToolsDetailView.MEMO == null?"":equSpecialToolsDetailView.MEMO
				if(i<obj["subdata"].length-1)
					Application.Selection.Rows.Add(Application.Selection.Rows(1));
				Tables.Item(2).Cell(2, 1).Range.Select();					
			}
		} 
	}
}
// 物资出库
function matStoreOut(obj,table){
	if(ocxBookMarks.Exists('ROWNUM')){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var wzck = obj["subdata"][i];
					Tables.Item(2).Cell(2+i, 1).Range.Text = i*1+1;
					Tables.Item(2).Cell(2+i, 2).Range.Text = wzck.CAT_NO==null?"":wzck.CAT_NO;//材料编码
					Tables.Item(2).Cell(2+i, 3).Range.Text = wzck.CAT_NAME == null?"":wzck.CAT_NAME;//材料名称
					Tables.Item(2).Cell(2+i, 4).Range.Text = wzck.SPEC == null?"":wzck.SPEC;//规格型号
					Tables.Item(2).Cell(2+i, 5).Range.Text = wzck.UNIT == null?"":wzck.UNIT;//库存单位
					Tables.Item(2).Cell(2+i, 6).Range.Text = wzck.REAL_NUM == null?"":wzck.REAL_NUM;//数量
					Tables.Item(2).Cell(2+i, 7).Range.Text = wzck.PRICE == null?"":wzck.PRICE;//单价
					Tables.Item(2).Cell(2+i, 8).Range.Text = wzck.MONEY == null?"":wzck.MONEY;//金额
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var wzck = obj["subdata"][i];
					Tables.Item(2).Cell(2, 1).Range.Text = obj["subdata"].length - i;
					Tables.Item(2).Cell(2, 2).Range.Text = wzck.CAT_NO==null?"":wzck.CAT_NO;//材料编码
					Tables.Item(2).Cell(2, 3).Range.Text = wzck.CAT_NAME == null?"":wzck.CAT_NAME;//材料名称
					Tables.Item(2).Cell(2, 4).Range.Text = wzck.SPEC == null?"":wzck.SPEC;//规格型号
					Tables.Item(2).Cell(2, 5).Range.Text = wzck.UNIT == null?"":wzck.UNIT;//库存单位
					Tables.Item(2).Cell(2, 6).Range.Text = wzck.REAL_NUM == null?"":wzck.REAL_NUM;//数量
					Tables.Item(2).Cell(2, 7).Range.Text = wzck.PRICE == null?"":wzck.PRICE;//单价
					Tables.Item(2).Cell(2, 8).Range.Text = wzck.MONEY == null?"":wzck.MONEY;//金额
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(2).Cell(2, 1).Range.Select();					
				}
			}
			//替换出库单信息
			if( obj["subdata"].length>0){
				DWREngine.setAsync(false);
				var sql = "  select to_char(mo.out_date,'yyyy-mm-dd') " +
						  " OUTDATE," +
						  " mo.out_no," +
						  "  (select max(wc.CKMC) from wz_ckh wc where " +
						  "  wc.ckh=mo.send_ware) " +
						  " SENDWARE,(case mo.out_type when 1 then '领料单'when 2 then '非计划出库' when 3 then '退料单' " +
						  "  when 4 then '计划内领用' else ' ' end) " +
						  " OUTTYPE," +
						  "  (select max(su.unitname) from sgcc_ini_unit su where " +
						  "  su.unitid=mo.dept) " +
						  " DEPT," +
						  " mo.REMARK from MAT_STORE_OUT mo where mo.uuid = '"+obj["subdata"][0].OUT_ID+"'";
				baseMgm.getData(sql,function(list){
					if(list.length>0){
						if(ocxBookMarks.Exists("OUTDATE")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("OUTDATE"), list[0][0]);}//出库日期
						if(ocxBookMarks.Exists("OUTNO")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("OUTNO"), list[0][1]);}//出库单号
						if(ocxBookMarks.Exists("SENDWARE")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("SENDWARE"), list[0][2]);}//仓库
						if(ocxBookMarks.Exists("OUTTYPE")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("OUTTYPE"), list[0][3]);}//出库类别
						if(ocxBookMarks.Exists("DEPT")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("DEPT"), list[0][4]);}//部门
						if(ocxBookMarks.Exists("REMARK")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("REMARK"), list[0][5]);}//备注
						//if(ocxBookMarks.Exists("OUTNAME")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("OUTNAME"), o.outName);}//领料单位
					}
				})
				DWREngine.setAsync(true);				
			}
			//填写合计信息
			var SQSLTotal=0,priceTotal=0;
			for(var i=2;i<Tables.Item(2).rows.count;i++){
				//if(Tables.Item(2).Cell(i, 7).Range.Text!=null){
				//	SQSLTotal+=isNaN(parseFloat(Tables.Item(2).Cell(i, 7).Range.Text))?0:parseFloat(Tables.Item(2).Cell(i, 7).Range.Text);
				//}
				if(Tables.Item(2).Cell(i, 8).Range.Text!=null){
					priceTotal+=isNaN(parseFloat(Tables.Item(2).Cell(i, 8).Range.Text))?0:parseFloat(Tables.Item(2).Cell(i, 8).Range.Text);
				}
			}
			if(obj["subdata"].length>0){
				//Tables.Item(2).Cell(Tables.Item(2).rows.count, 7).Range.Text = SQSLTotal
				Tables.Item(2).Cell(Tables.Item(2).rows.count, 8).Range.Text = priceTotal
			}
			
		}
	}
}
//物资入库
function matStoreIn(obj,table){
	if(ocxBookMarks.Exists('ROWNUM')){
		ocxBookMarks('ROWNUM').Select();
		with(TANGER_OCX_OBJ.ActiveDocument){
			var rowNum = Application.Selection.Text;
			if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
				for(var i=0;i<obj["subdata"].length;i++){
					var wzrk = obj["subdata"][i];
					Tables.Item(2).Cell(2+i, 1).Range.Text = i*1+1;
					Tables.Item(2).Cell(2+i, 2).Range.Text = wzrk.CAT_NO==null?"":wzrk.CAT_NO;//存货编码
					Tables.Item(2).Cell(2+i, 3).Range.Text = wzrk.CAT_NAME == null?"":wzrk.CAT_NAME;//存货名称
					Tables.Item(2).Cell(2+i, 4).Range.Text = wzrk.SPEC == null?"":wzrk.SPEC;//规格型号
					Tables.Item(2).Cell(2+i, 5).Range.Text = wzrk.UNIT == null?"":wzrk.UNIT;//库存单位
					Tables.Item(2).Cell(2+i, 6).Range.Text = wzrk.IN_NUM == null?"":wzrk.IN_NUM;//数量
					Tables.Item(2).Cell(2+i, 7).Range.Text = wzrk.PRICE == null?"":wzrk.PRICE;//原币单价
					Tables.Item(2).Cell(2+i, 8).Range.Text = wzrk.SUB_SUM == null?"":wzrk.SUB_SUM;//原币金额
					//Tables.Item(2).Cell(2+i, 9).Range.Text = wzrk.MONEY == null?"":wzrk.MONEY;//原币价税合计
				}					
			}else{   //否则则说明是第一次关联，直接按照实际数据创建表格
				for(var i=0;i<obj["subdata"].length;i++){
					var wzrk = obj["subdata"][i];
					Tables.Item(2).Cell(2, 1).Range.Text = obj["subdata"].length - i;
					Tables.Item(2).Cell(2, 2).Range.Text = wzrk.CAT_NO==null?"":wzrk.CAT_NO;//存货编码
					Tables.Item(2).Cell(2, 3).Range.Text = wzrk.CAT_NAME == null?"":wzrk.CAT_NAME;//存货名称
					Tables.Item(2).Cell(2, 4).Range.Text = wzrk.SPEC == null?"":wzrk.SPEC;//规格型号
					Tables.Item(2).Cell(2, 5).Range.Text = wzrk.UNIT == null?"":wzrk.UNIT;//库存单位
					Tables.Item(2).Cell(2, 6).Range.Text = wzrk.IN_NUM == null?"":wzrk.IN_NUM;//数量
					Tables.Item(2).Cell(2, 7).Range.Text = wzrk.PRICE == null?"":wzrk.PRICE;//原币单价
					Tables.Item(2).Cell(2, 8).Range.Text = wzrk.SUB_SUM == null?"":wzrk.SUB_SUM;//原币金额
					//Tables.Item(2).Cell(2, 9).Range.Text = wzrk.MONEY == null?"":wzrk.MONEY;//原币价税合计
					if(i<obj["subdata"].length-1)
						Application.Selection.Rows.Add(Application.Selection.Rows(1));
					Tables.Item(2).Cell(2, 1).Range.Select();					
				}
			}
			//替换入库单信息
			if( obj["subdata"].length>0){
				DWREngine.setAsync(false);
				var sql = "  select (select max(co.CONNO) from con_ove co where co.conid = mi.conid) " +
						  " CONNO," +//合同编号
						  " mi.OFFER_DEPT," +//供货单位
						  " mi.MAT_TYPE," +//物品类型
						  " to_char(mi.ARRIV_DATE,'yyyy-mm-dd') ARRIV_DATE," +//到货日期
						  " mi.REMARK, " +//备注
						  " to_char(mi.IN_DATE,'yyyy-mm-dd') IN_DATE, " + //入库日期
						  " mi.IN_NO, " +    //入库编号
     					  " mi.DEPT " +     //部门名称
						  " from MAT_STORE_IN mi where mi.uuid = '"+obj["subdata"][0].IN_ID+"'";
				baseMgm.getData(sql,function(list){
					
					if(list.length>0){
						if(ocxBookMarks.Exists("CONNO")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("CONNO"), list[0][0]);}//合同号
						if(ocxBookMarks.Exists("OFFERDEPT")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("OFFERDEPT"), list[0][1]);}//供货单位
						if(ocxBookMarks.Exists("MATTYPE")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("MATTYPE"), list[0][2]);}//采购类型
						if(ocxBookMarks.Exists("ARRIVDATE")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("ARRIVDATE"), list[0][3]);}//到货日期
						if(ocxBookMarks.Exists("REMARK")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("REMARK"), list[0][4]);}//备注
						if(ocxBookMarks.Exists("RQ")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("RQ"), list[0][5]);}//入库日期
						if(ocxBookMarks.Exists("INNO")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("INNO"), list[0][6]);}//入库编号
						if(ocxBookMarks.Exists("DEPT")){TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("DEPT"), list[0][7]);}//部门名称
					}
				})
				DWREngine.setAsync(true);				
			}
			//填写合计信息
			var SQSLTotal=0,priceTotal=0;
			for(var i=2;i<Tables.Item(2).rows.count;i++){
				if(Tables.Item(2).Cell(i, 7).Range.Text!=null){
					SQSLTotal+=isNaN(parseFloat(Tables.Item(2).Cell(i, 7).Range.Text))?0:parseFloat(Tables.Item(2).Cell(i, 7).Range.Text);
				}
				if(Tables.Item(2).Cell(i, 8).Range.Text!=null){
					priceTotal+=isNaN(parseFloat(Tables.Item(2).Cell(i, 8).Range.Text))?0:parseFloat(Tables.Item(2).Cell(i, 8).Range.Text);
				}
			}
			if(obj["subdata"].length>0){
				Tables.Item(2).Cell(Tables.Item(2).rows.count, 7).Range.Text = SQSLTotal
				Tables.Item(2).Cell(Tables.Item(2).rows.count, 8).Range.Text = priceTotal
			}
		}
	}
}

// 质量验评统计
function zlypStat(obj, table) {
	
	//设置年月
	if ( obj.SJ_TYPE.length == 6 ){
		var year = obj.SJ_TYPE.substr(0,4);
		var month = obj.SJ_TYPE.substr(4,2);
		TANGER_OCX_OBJ.SetBookmarkValue("YEAR", year);
		TANGER_OCX_OBJ.SetBookmarkValue("MONTH", month);
	}

	ocxBookMarks('ROWNUM').Select();
	with (TANGER_OCX_OBJ.ActiveDocument) {

		var rowNum = Application.Selection.Text;
		if (/^([1-9]\d*)$/.test(rowNum)) { // 如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
			var j = 0;
			for (var i = 0; i < obj["subdata"].length; i++) {
				var zljyDetail = obj["subdata"][i];

				Tables(1).Cell(5+i, 1).Range.Text = i + 1;
				Tables(1).Cell(5+i, 2).Range.Text = zljyDetail.XMMC == null
						? ""
						: zljyDetail.XMMC;
				Tables(1).Cell(5+i, 3).Range.Text = zljyDetail.JYP == null
						? ""
						: zljyDetail.JYP;
				Tables(1).Cell(5+i, 4).Range.Text = zljyDetail.SUM_JYP == null
						? ""
						: zljyDetail.SUM_JYP;
				Tables(1).Cell(5+i, 5).Range.Text = zljyDetail.FX_PRJ == null
						? ""
						: zljyDetail.FX_PRJ;
				Tables(1).Cell(5+i, 6).Range.Text = zljyDetail.SUM_FX_PRJ == null
						? ""
						: zljyDetail.SUM_FX_PRJ;
				Tables(1).Cell(5+i, 7).Range.Text = zljyDetail.ZFB_PRJ == null
						? ""
						: zljyDetail.ZFB_PRJ;
				Tables(1).Cell(5+i, 8).Range.Text = zljyDetail.SUM_ZFB_PRJ == null
						? ""
						: zljyDetail.SUM_ZFB_PRJ;
				Tables(1).Cell(5+i, 9).Range.Text = zljyDetail.FB_PRJ == null
						? ""
						: zljyDetail.FB_PRJ;
				Tables(1).Cell(5+i, 10).Range.Text = zljyDetail.SUM_FB_PRJ == null
						? ""
						: zljyDetail.SUM_FB_PRJ;
				Tables(1).Cell(5+i, 11).Range.Text = zljyDetail.ZDW_PRJ == null
						? ""
						: zljyDetail.ZDW_PRJ;
				Tables(1).Cell(5+i, 12).Range.Text = zljyDetail.SUM_ZDW_PRJ == null
						? ""
						: zljyDetail.SUM_ZDW_PRJ;
				Tables(1).Cell(5+i, 13).Range.Text = zljyDetail.PRJ_PD == null
						? ""
						: zljyDetail.PRJ_PD;

			}
		} else { // 否则则说明是第一次关联，直接按照实际数据创建表格
			for (var i = 0; i < obj["subdata"].length ; i++) {
				var zljyDetail = obj["subdata"][i];

				Tables(1).Cell(5+i, 1).Range.Text = i + 1;
				Tables(1).Cell(5+i, 2).Range.Text = zljyDetail.XMMC == null
						? ""
						: zljyDetail.XMMC;
				Tables(1).Cell(5+i, 3).Range.Text = zljyDetail.JYP == null
						? ""
						: zljyDetail.JYP;
				Tables(1).Cell(5+i, 4).Range.Text = zljyDetail.SUM_JYP == null
						? ""
						: zljyDetail.SUM_JYP;
				Tables(1).Cell(5+i, 5).Range.Text = zljyDetail.FX_PRJ == null
						? ""
						: zljyDetail.FX_PRJ;
				Tables(1).Cell(5+i, 6).Range.Text = zljyDetail.SUM_FX_PRJ == null
						? ""
						: zljyDetail.SUM_FX_PRJ;
				Tables(1).Cell(5+i, 7).Range.Text = zljyDetail.ZFB_PRJ == null
						? ""
						: zljyDetail.ZFB_PRJ;
				Tables(1).Cell(5+i, 8).Range.Text = zljyDetail.SUM_ZFB_PRJ == null
						? ""
						: zljyDetail.SUM_ZFB_PRJ;
				Tables(1).Cell(5+i, 9).Range.Text = zljyDetail.FB_PRJ == null
						? ""
						: zljyDetail.FB_PRJ;
				Tables(1).Cell(5+i, 10).Range.Text = zljyDetail.SUM_FB_PRJ == null
						? ""
						: zljyDetail.SUM_FB_PRJ;
				Tables(1).Cell(5+i, 11).Range.Text = zljyDetail.ZDW_PRJ == null
						? ""
						: zljyDetail.ZDW_PRJ;
				Tables(1).Cell(5+i, 12).Range.Text = zljyDetail.SUM_ZDW_PRJ == null
						? ""
						: zljyDetail.SUM_ZDW_PRJ;
				Tables(1).Cell(5+i, 13).Range.Text = zljyDetail.PRJ_PD == null
						? ""
						: zljyDetail.PRJ_PD;

				if (i < obj["subdata"].length -1)
					Tables(1).Rows.Add();
				
			}
		}

	}
}

function equGoodsStoreinFlowView(obj,table){
    if ('EQU_GOODS_STOREIN_FLOW_VIEW' == table){
        ocxBookMarks('ROWNUM').Select();
        with(TANGER_OCX_OBJ.ActiveDocument){
            var rowNum = Application.Selection.Text;
            if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
                if(CURRENTAPPID != "1031902"){
	                for(var i=0;i<obj["subdata"].length;i++){
	                    var equIn = obj["subdata"][i]
		                    // zhangh 国锦新增入库单打印
		                    Tables.Item(2).Cell(2+i, 1).Range.Text = i*1+1;
		                    Tables.Item(2).Cell(2+i, 2).Range.Text = equIn.TH == null?"":equIn.TH
		                    Tables.Item(2).Cell(2+i, 3).Range.Text = equIn.XHJH == null?"":equIn.XHJH
		                    Tables.Item(2).Cell(2+i, 4).Range.Text = equIn.SBMC == null?"":equIn.SBMC
		                    Tables.Item(2).Cell(2+i, 5).Range.Text = equIn.GGXH == null?"":equIn.GGXH
		                    Tables.Item(2).Cell(2+i, 6).Range.Text = equIn.DW == null?"":equIn.DW
		                    Tables.Item(2).Cell(2+i, 7).Range.Text = equIn.SL == null?"":equIn.SL
		                    Tables.Item(2).Cell(2+i, 8).Range.Text = equIn.BZ == null?"":equIn.BZ                    
	                    }
	                }else{
	                	 for(var i=0;i<obj["subdata"].length;i++){
	                         var equIn = obj["subdata"][i]
	                        //yanglh 2013-07-11 燃气新增入库单打印
		                    Tables.Item(1).Cell(5+i, 1).Range.Text = i*1+1;
		                    Tables.Item(1).Cell(5+i, 2).Range.Text = equIn.SBMC == null?"":equIn.SBMC
		                    Tables.Item(1).Cell(5+i, 3).Range.Text = equIn.GGXH == null?"":equIn.GGXH
		                    Tables.Item(1).Cell(5+i, 4).Range.Text = equIn.DW == null?"":equIn.DW
		                    Tables.Item(1).Cell(5+i, 6).Range.Text = equIn.SL == null?"":equIn.SL
		                    Tables.Item(1).Cell(5+i, 9).Range.Text = equIn.BZ == null?"":equIn.BZ                    	
                         }
	                }
            }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
            	if(CURRENTAPPID != "1031902"){
	                 for(var i=0;i<obj["subdata"].length;i++){
		                    var equIn = obj["subdata"][i]
		                     // zhangh 国锦新增入库单打印
		                    Tables.Item(2).Cell(2, 1).Range.Text = obj["subdata"].length - i
		                    Tables.Item(2).Cell(2, 2).Range.Text = equIn.TH == null?"":equIn.TH
		                    Tables.Item(2).Cell(2, 3).Range.Text = equIn.XHJH == null?"":equIn.XHJH
		                    Tables.Item(2).Cell(2, 4).Range.Text = equIn.SBMC == null?"":equIn.SBMC
		                    Tables.Item(2).Cell(2, 5).Range.Text = equIn.GGXH == null?"":equIn.GGXH
		                    Tables.Item(2).Cell(2, 6).Range.Text = equIn.DW == null?"":equIn.DW
		                    Tables.Item(2).Cell(2, 7).Range.Text = equIn.SL == null?"":equIn.SL
		                    Tables.Item(2).Cell(2, 8).Range.Text = equIn.BZ == null?"":equIn.BZ
		                    if(i<obj["subdata"].length-1)
		                        Application.Selection.Rows.Add(Application.Selection.Rows(1));
		                    Tables.Item(2).Cell(2, 1).Range.Select();
	                 }
            	}else{
            		for(var i=0;i<obj["subdata"].length;i++){
                        var equIn = obj["subdata"][i]
                    	//yanglh 2013-07-11 燃气新增入库单打印
	                    Tables.Item(1).Cell(5, 1).Range.Text = i*1+1;
	                    Tables.Item(1).Cell(5, 2).Range.Text = equIn.SBMC == null?"":equIn.SBMC
	                    Tables.Item(1).Cell(5, 3).Range.Text = equIn.GGXH == null?"":equIn.GGXH
	                    Tables.Item(1).Cell(5, 4).Range.Text = equIn.DW == null?"":equIn.DW
	                    Tables.Item(1).Cell(5, 6).Range.Text = equIn.SL == null?"":equIn.SL
	                    Tables.Item(1).Cell(5, 9).Range.Text = equIn.BZ == null?"":equIn.BZ
	                    if(i<obj["subdata"].length-1)
	                        Application.Selection.Rows.Add(Application.Selection.Rows(1));
	                    Tables.Item(1).Cell(5, 1).Range.Select();
	                    //5,7,8列手填
            		   }
                    }
                }
           } 
     }
}

function equGoodsStockOutFlowView(obj,table){
    if ('EQU_GOODS_STOCK_OUT_FLOW_VIEW' == table){
        ocxBookMarks('ROWNUM').Select();
        with(TANGER_OCX_OBJ.ActiveDocument){
            var rowNum = Application.Selection.Text;
            if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
                for(var i=0;i<obj["subdata"].length;i++){
                    var equIn = obj["subdata"][i]
                    Tables.Item(2).Cell(2+i, 1).Range.Text = i*1+1;
                    Tables.Item(2).Cell(2+i, 2).Range.Text = equIn.TH == null?"":equIn.TH
                    Tables.Item(2).Cell(2+i, 3).Range.Text = equIn.XHJH == null?"":equIn.XHJH
                    Tables.Item(2).Cell(2+i, 4).Range.Text = equIn.SBMC == null?"":equIn.SBMC
                    Tables.Item(2).Cell(2+i, 5).Range.Text = equIn.GGXH == null?"":equIn.GGXH
                    Tables.Item(2).Cell(2+i, 6).Range.Text = equIn.DW == null?"":equIn.DW
                    Tables.Item(2).Cell(2+i, 7).Range.Text = equIn.SL == null?"":equIn.SL
                    Tables.Item(2).Cell(2+i, 8).Range.Text = equIn.BZ == null?"":equIn.BZ
                }                   
            }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
                for(var i=0;i<obj["subdata"].length;i++){
                    var equIn = obj["subdata"][i]
                    Tables.Item(2).Cell(2, 1).Range.Text = obj["subdata"].length - i
                    Tables.Item(2).Cell(2, 2).Range.Text = equIn.TH == null?"":equIn.TH
                    Tables.Item(2).Cell(2, 3).Range.Text = equIn.XHJH == null?"":equIn.XHJH
                    Tables.Item(2).Cell(2, 4).Range.Text = equIn.SBMC == null?"":equIn.SBMC
                    Tables.Item(2).Cell(2, 5).Range.Text = equIn.GGXH == null?"":equIn.GGXH
                    Tables.Item(2).Cell(2, 6).Range.Text = equIn.DW == null?"":equIn.DW
                    Tables.Item(2).Cell(2, 7).Range.Text = equIn.SL == null?"":equIn.SL
                    Tables.Item(2).Cell(2, 8).Range.Text = equIn.BZ == null?"":equIn.BZ
                    if(i<obj["subdata"].length-1)
                        Application.Selection.Rows.Add(Application.Selection.Rows(1));
                    Tables.Item(2).Cell(2, 1).Range.Select();                   
                }
            }
        }
    }
}

function equGoodsStockOutNewView(obj,table){
    if ('EQU_GOODS_STOCK_OUT_NEW_VIEW' == table){
        ocxBookMarks('ROWNUM').Select();
        with(TANGER_OCX_OBJ.ActiveDocument){
            var rowNum = Application.Selection.Text;
            if(/^([1-9]\d*)$/.test(rowNum)){  //如果光标所指位置的值为数字，则说明不是第一次关联，直接将表格的值覆写
                for(var i=0;i<obj["subdata"].length;i++){
                    var equOut = obj["subdata"][i]
                    Tables.Item(2).Cell(4+i, 1).Range.Text = i*1+1;
                    Tables.Item(2).Cell(4+i, 2).Range.Text = equOut.EQU_PART_NAME == null?"":equOut.EQU_PART_NAME
                    Tables.Item(2).Cell(4+i, 3).Range.Text = equOut.GGXH == null?"":equOut.GGXH
                    Tables.Item(2).Cell(4+i, 4).Range.Text = equOut.UNIT == null?"":equOut.UNIT
                    Tables.Item(2).Cell(4+i, 6).Range.Text = equOut.OUT_NUM == null?"":equOut.OUT_NUM
                    Tables.Item(2).Cell(4+i, 9).Range.Text = equOut.REMARK == null?"":equOut.REMARK
                }                   
            }else{   //否则则说明是第一次关联，直接按照实际数据创建表格
                for(var i=0;i<obj["subdata"].length;i++){
                    var equOut = obj["subdata"][i]
                    Tables.Item(2).Cell(4, 1).Range.Text = obj["subdata"].length - i
                    Tables.Item(2).Cell(4, 2).Range.Text = equOut.EQU_PART_NAME == null?"":equOut.EQU_PART_NAME
                    Tables.Item(2).Cell(4, 3).Range.Text = equOut.GGXH == null?"":equOut.GGXH
                    Tables.Item(2).Cell(4, 4).Range.Text = equOut.UNIT == null?"":equOut.UNIT
                    Tables.Item(2).Cell(4, 6).Range.Text = equOut.OUT_NUM == null?"":equOut.OUT_NUM
                    Tables.Item(2).Cell(4, 9).Range.Text = equOut.REMARK == null?"":equOut.REMARK
                    if(i<obj["subdata"].length-1)
                        Application.Selection.Rows.Add(Application.Selection.Rows(1));
                    Tables.Item(2).Cell(4, 1).Range.Select();       
                    //5,7,8列手填
                }
            }
        }
    }
}