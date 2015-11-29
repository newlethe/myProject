<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>报表录入招投标数据</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
	</head>
	<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
<script type="text/javascript">
param = window.dialogArguments
var m_record = param.rec;
var gridPanel = param.gridPanel;
var pid = param.pid?param.pid:""
var sjType = param.sjType?param.sjType:""
var savable = param.savable?param.savable:"";

var formPanel, addWin;

var cellUrl = ROOT_CELL + "/cell/eReport.jsp?openCellType=iframe&p_type=ZTB_MONTH_REPORT" +
		"&p_date=" + sjType + "&p_corp=" + pid + "&p_inx=&savable=" + savable
		+ "&p_key_col=&p_key_val="
		+ "&p_showVersion=none&p_showRemark=none&p_saveAsFile=false&p_checkNull=true";
Ext.onReady(function() {
	
	
	var addBtn = new Ext.Button({
		id:'add',
		text: '新增',
		iconCls: 'add',
		handler: addBtnFun
	});
	
	var editBtn = new Ext.Button({
		id:'edit',
		text: '修改',
		iconCls: 'option',
		handler: editBtnFun
	});
	
	var delBtn = new Ext.Button({
		id:'del',
		text: '删除当前行',
		iconCls: 'remove',
		handler: delBtnFun
	});
	
	var cellPanel = new Ext.Panel({
		tbar: [addBtn, editBtn, delBtn],
		border: false,
		title:"招投标（合同）月报",
		layout:'fit',
		html:"<iframe name='cellFrame' scrolling='auto' src='/"+cellUrl+"' width='100%' height='100%' ></iframe>"
	}) ;
	
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [cellPanel]
	});
	
	if(savable) {
		cellPanel.getTopToolbar().setDisabled(false);	
	} else {
		cellPanel.getTopToolbar().setDisabled(true);	
	}
});

//新增一行招投标月报数据
function addBtnFun(){
	var reportParams = {
		m_record: m_record,
		onWinClosed: onWinClosed,
		cellWeb : document.frames["cellFrame"].CellWeb1,
		addType : 'add'
	};
	
	window.showModalDialog(
		CONTEXT_PATH+ "/PCBusiness/bid/pc.bid.input.superviseReport_editCell_add.jsp",
		reportParams,"dialogWidth:800px;dialogHeight:360px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
}

function editBtnFun(){
	var CellWeb = document.frames["cellFrame"].CellWeb1;
	var row,col;
	with(CellWeb) {
		var maxCol = GetCols(0)
		var maxRow = GetRows(0)
		for( var c=1; c<maxCol; c++ ) {
			for( var r=1; r<maxRow; r++ ) {
				var cellStr = GetCellString(c, r, 0)
				if(cellStr.indexOf("table:")>-1) {
					col = c;
					row = r;
					break;
				}
			}
		}
	}
	var curRow = CellWeb.GetCurrentRow();
	var tableContent = CellWeb.GetCellString(col, curRow, 0)
	if(tableContent.indexOf("/")>0) {
		var cArr = tableContent.split("/");
		var reportParams = {
			m_record: m_record,
			onWinClosed: onWinClosed,
			cellWeb : document.frames["cellFrame"].CellWeb1,
			editZbSeqno : cArr[0],
			addType : 'edit'
		};
		
		window.showModalDialog(
			CONTEXT_PATH+ "/PCBusiness/bid/pc.bid.input.superviseReport_editCell_add.jsp",
			reportParams,"dialogWidth:800px;dialogHeight:360px;status:no;center:yes;resizable:no;Minimize=yes;Maximize=yes");
	} else {
		Ext.example.msg('不能修改', '当前行是报表模板内容，不允许修改！');
	}
}

//删除一行报表数据
function delBtnFun(){
	var CellWeb = document.frames["cellFrame"].CellWeb1;
	var row,col;
	with(CellWeb) {
		var maxCol = GetCols(0)
		var maxRow = GetRows(0)
		for( var c=1; c<maxCol; c++ ) {
			for( var r=1; r<maxRow; r++ ) {
				var cellStr = GetCellString(c, r, 0)
				if(cellStr.indexOf("table:")>-1) {
					col = c;
					row = r;
					break;
				}
			}
		}
	}
	var curRow = CellWeb.GetCurrentRow();
	var tableContent = CellWeb.GetCellString(col, curRow, 0)
	if(tableContent.indexOf("/")>0) {
		Ext.Msg.confirm('提示','您是否确认要删除此条记录？',function(txt){
			if(txt=='yes'){
				var cArr = tableContent.split("/");
				DWREngine.setAsync(false);
				PCBidDWR.deleteZbNr2Report(sjType, pid, cArr[0], function(state){
					if ("" == state){
						Ext.example.msg('删除成功！', '您成功删除了一条信息！');
						CellWeb.DeleteRow(curRow, 1, 0);
						CellDoc=new CellXmlDoc(CellWeb);
			 		}else{
			 			Ext.Msg.show({
							title: '提示',
							msg: state,
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.ERROR
						});
			 		}
				});
				DWREngine.setAsync(true);
			}
		});
	} else {
		Ext.example.msg('不能删除', '当前行是报表模板内容，不允许删除！');
	}
}

//--------------------------------------------------报表相关
var sign = {
	memoVar1:{label:'单位负责人',id:'memoVar1',column:'MEMO_VAR1'},
	memoVar2:{label:'统计负责人',id:'memoVar2',column:'MEMO_VAR2'},
	memoVar3:{label:'联系方式',id:'memoVar3',column:'MEMO_VAR3'},
	userId:{label:'填报人',id:'userId',column:'USER_ID'}
}

//数据动态写入报表中
var CellDoc=null;
function onCellOpened(CellWeb1){
	if(!m_record) return;
	var maxColNum;
	var row,col;
	with(CellWeb1) {
		var maxCol = GetCols(0)
		maxColNum = maxCol;
		var maxRow = GetRows(0)
		for( var c=1; c<maxCol; c++ ) {
			for( var r=1; r<maxRow; r++ ) {
				var cellStr = GetCellString(c, r, 0)
				if(cellStr.indexOf("table:")>-1) {
					col = c;
					row = r;
					break;
				}
			}
		}
	}
	
	if(col&&row){
		var sql = "select zb_seqno,unitname,unit_id  from pc_bid_supervisereport_d where sj_type='"+ sjType + "'" +
          " and unit_id='"+ pid +"' and zb_seqno is not null order by unit_id asc,nvl(kbrq,'00000000') desc";
		//报表记录的扩展
		baseDao.getData(sql, function(lt){
			var preUnitname = "";
			var maxRow = row+1;
			var startRow = maxRow;
			for(var i=0;i<lt.length;i++){
				CellWeb1.InsertRow(maxRow+i, 1,0);
				CellWeb1.SetRowHeight(1, 25, maxRow+i,0);
				CellWeb1.SetCellString(col,maxRow+i,0,lt[i][0]+"/"+lt[i][2]);//混合报表
				if(col>1){
					var curUnitname = lt[i][1];
					CellWeb1.SetCellString(col-1,maxRow+i,0,curUnitname);
					CellWeb1.SetCellAlign(col-1,maxRow+i,0,4);
					CellWeb1.SetCellAlign(col-1,maxRow+i,0,32);
					if(preUnitname==curUnitname){
						CellWeb1.MergeCells(col-1,startRow,col-1,row+1+i);
					}else{
						startRow = startRow+i;
						preUnitname = curUnitname;
					}
				}
/*				
				//标的
				CellWeb1.SetCellNumType(col+1, maxRow+i, 0, 7);
				//招标编号
				CellWeb1.SetCellNumType(col+2, maxRow+i, 0, 7);
				//开标日期
				CellWeb1.SetCellNumType(col+3, maxRow+i, 0, 3);
				//招标方式
				CellWeb1.SetCellNumType(col+4, maxRow+i, 0, 7);
				//评标办法
				CellWeb1.SetCellNumType(col+5, maxRow+i, 0, 7);
				//代理机构名称
				CellWeb1.SetCellNumType(col+6, maxRow+i, 0, 7);
				//中标单位
				CellWeb1.SetCellNumType(col+7, maxRow+i, 0, 7);
				//开标价格
				CellWeb1.SetCellNumType(col+8, maxRow+i, 0, 1);
				//中标价格
				CellWeb1.SetCellNumType(col+9, maxRow+i, 0, 1);
				//合同价格
				CellWeb1.SetCellNumType(col+10, maxRow+i, 0, 1);
				//执行概算价格
				CellWeb1.SetCellNumType(col+11, maxRow+i, 0, 1);
				//备注
				CellWeb1.SetCellNumType(col+12, maxRow+i, 0, 7);
*/
			}
			
			CellDoc=new CellXmlDoc(CellWeb1);
			DWREngine.setAsync(false);
			pcTzglService.findDataByTableId("PC_BID_SUPERVISEREPORT_M","uids='"+m_record.get('uids')+"'",function(masterRecord){
				CellDoc.replaceSign(masterRecord);
			});
			DWREngine.setAsync(true);
			window.frames["cellFrame"].loadXMLData();
		})
	}
}

function afterCellSaved(CellWeb1,v_checkNullResult){
	var flag = 0;
	if(!m_record) return;
	var dataMap=CellDoc.getValues();
	if(dataMap&&dataMap.length>0){
		pcTzglService.updateDataByTableId("PC_BID_SUPERVISEREPORT_M", " uids='" + m_record.get('uids') + "'", dataMap, function(){
			if(v_checkNullResult == true){
               flag = 0;//报表中单元格不为空
            }else{
               flag = 1;//报表中存在单元格为空
            }
            var sql = "update pc_bid_supervisereport_m t set t.FLAG_NULL='"+flag+"' where t.sj_type='"+m_record.get('sjType')+"' and t.pid='"+m_record.get('pid')+"'";
            baseDao.updateBySQL(sql);
            gridPanel.getStore().reload();
		});
	}
}

function beforeCellSaved(CellWeb1,win){
	var signCells=CellDoc.signCells;
	for(var i in sign){
		var tag=sign[i].column;
		var flag =  win.isNull(signCells[tag].c,signCells[tag].r,signCells[tag].s);
		if(flag=="1"){//单元格数据为空
			return {success:false,msg:"'"+sign[i].label+"为必填项'"}
		}
	}
	return {success:true};	
}

function onWinClosed(){
	document.all.cellFrame.src = "/" + cellUrl;
}


function myRGB(b,g,r){   
	return   r*65536+g*256+b   
}

//检查报表填写的列是否填写了数据
function checkSavabeColNull(CellWeb1){
	var row,col;
	with(CellWeb1) {
			var maxCol = GetCols(0)
			var maxRow = GetRows(0)
			for( var c=1; c<maxCol; c++ ) {
				for( var r=1; r<maxRow; r++ ) {
					var cellStr = GetCellString(c, r, 0)
					if(cellStr.indexOf("table:")>-1) {
						col = c;
						row = r;
						break;
					}
				}
			}
	}
	var validFlag = true;
	var redIndex = CellWeb1.FindColorIndex(myRGB(255,0,0),1);
	var whiteIndex = CellWeb1.FindColorIndex(myRGB(255,255,255),1);
	var rowNum = CellWeb1.GetRows(0);
	var colNum = CellWeb1.GetCols(0);
	
	for(j=row+1; j<=rowNum; j++){
		var rowConfigText = CellWeb1.GetCellString(col, j, 0);
		if(rowConfigText && rowConfigText!=null && rowConfigText.length>0) {
			for(k=col+1; k<=colNum; k++) {
				if (CellWeb1.IsColHidden(k, 0)==0){	//不判断隐藏单元格
					var colConfigText = CellWeb1.GetCellString(k, row, 0);
					if(colConfigText && colConfigText!=null){
						if(colConfigText.indexOf("CONVALUE")>-1) {
							continue;
						}
						var cellVal = CellWeb1.GetCellString(k, j, 0);
						if(!cellVal || cellVal==null || cellVal.length==0){
							CellWeb1.SetCellBackColor(k, j, 0, redIndex);
							validFlag = false;
						}else{
							var rdOnly = CellWeb1.GetCellInput(k, j, 0);
							if(rdOnly == 5) continue;
							CellWeb1.SetCellBackColor(k, j, 0, whiteIndex);
						}
					}
				}
			}
		} else {
			return validFlag;
		}
	}
	return validFlag;
}
</script>
</html>