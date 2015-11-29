<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>  
	<head>
		<title>GridComboPanel</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<style>
			tr.dbnetgrid { white-space: nowrap; text-align: center; }
		</style>		
  </head>
	<body topmargin=0 leftmargin=0 rightmargin=0 scroll=auto><div id=debug></div>
		<div id="dbnetgrid1" style="behavior:url(/dbnetgrid/htc/dbnetgrid.htc);"></div>
	</body>
</html>

<script>
var createDate=""
window.onload = init;
function init(){
	with(document.all.dbnetgrid1){
		fromPart = "SGCC_INFO_PUB"
		primaryKeyColumn = "PUBINFO_ID"
		selectPart = ["PUBINFO_ID","PUB_UNIT","PUB_USER","PUB_DATE","PUB_TITLE","CONTENT","FILE_NAME","FILE_LSH","MEMO","FILE_TYPE"]
		headings = ["发布信息编号","发布单位","发布人","发布日期","标题","内容简述","附件名称","附件编号","备注说明","信息类型"]
		orderColumn = "PUB_DATE"
		orderSequence = "desc"
		dateFormat = 'y-m-d h:mi:s'
		editFields = ["PUBINFO_ID","PUB_UNIT","PUB_USER","PUB_DATE","PUB_TITLE","CONTENT","FILE_LSH","FILE_NAME","MEMO","FILE_TYPE"]
		editLabels = ["发布信息编号","发布单位","发布人","发布日期","标题","内容简述","附件编号","附件名称","备注说明","信息类型"]
		dataOnlyColumns = ["PUBINFO_ID","PUB_UNIT","PUB_USER","PUB_DATE","PUB_TITLE","CONTENT","FILE_NAME","FILE_LSH","MEMO","FILE_TYPE"];
		headings = ["发布信息编号","发布单位","发布人","发布日期","标题","内容简述","附件编号","附件名称","备注说明","信息类型"];
		pageSize = 10
		//displayToolbar = true
		integration = "true"
		addRowIndex = true

		setColumnProperty("CONTENT","ellipsis:100")
		setColumnProperty("pub_unit","transform:transunit")
		setColumnProperty("pub_user","transform:transuser")
		setColumnProperty("CONTENT","transform:contentTran")
		setColumnProperty("FILE_TYPE","transform:transfileType")
		setColumnProperty("FILE_NAME","transform:transfileName")
		setColumnProperty("file_lsh","display:none")
		setColumnProperty("PUBINFO_ID","display:none")
		setColumnProperty("memo","display:none")
		setEditColumnProperty("PUBINFO_ID","display:none")
		setEditColumnProperty("FILE_LSH","display:none")
		setEditColumnProperty("FILE_NAME","elementType:hidden")
		setEditColumnProperty("CONTENT","elementType:textarea")
		setEditColumnProperty("CONTENT","width:650px")
		setEditColumnProperty("CONTENT","height:150px")
		setEditColumnProperty("PUB_USER","display:none")
		setEditColumnProperty("PUB_UNIT","display:none")
		setEditColumnProperty("PUB_USER","initialValue:"+parent.USERID)
		setEditColumnProperty("PUB_UNIT","initialValue:"+parent.USERUNITID)
		setEditColumnProperty("PUB_DATE","width:110px")
		setEditColumnProperty("PUB_DATE","editReadOnly:true")
		setEditColumnProperty('FILE_TYPE',"lookup:[['tz','通知'],['gg','公告'],['tb','通报'],['qt','其他']]")
		setEditColumnProperty('FILE_TYPE',"required:true")
		setEditColumnProperty('CONTENT',"required:true")
		setEditColumnProperty('PUB_TITLE',"required:true")
		setEditColumnProperty('PUB_DATE',"required:true")
		setEditColumnProperty('PUBINFO_ID',"initialValue:"+getSN())
		
		editRowInitialisation = "grid1Init"
		editSections = [ 
						 ["",3,"100%"],
						 ["",2,"100%"],
						 ["",4,"100%"] ]
		editSectionsFields = [["PUB_USER","PUB_UNIT","PUB_DATE"],
							["PUB_TITLE","CONTENT"],
							["FILE_LSH","FILE_NAME","FILE_TYPE","MEMO","PUBINFO_ID"]]
		
		//设置属性
		//setEditColumnProperty("uid_","required:true")
		if(parent.pubinfoQueryId!=""){
		//alert(parent.pubinfoQueryId)
			fixedFilterPart = "PUBINFO_ID = '"+parent.pubinfoQueryId+"' "
		}
		
		setHeadingProperty("textAlign:left")
		//加载数据
		loadData()

	}
	
}

function grid1Init(editControl) {
	if(editControl.mode == 'insert') {	
	    var data = document.all.dbnetgrid1.selectData("select to_char(sysdate,'yyyy-mm-dd HH24:mi:ss') rq,substr(to_char(systimestamp,'Iyyymmddhh24missff'),1,17) xh from dual")
		editControl.inputControl('PUB_DATE').value = data.rq
		createDate=	data.rq
	}
    var file_name = editControl.inputControl('FILE_NAME')
    var mbtn = document.all.mybtn
   	if(mbtn == null || mbtn =='undefined'){
   		file_name.insertAdjacentHTML("afterEnd","<button class=pageBtn id = mybtn onclick=openReportDocZ('"+editControl.inputControl('PUBINFO_ID').value+"')>编辑附件</button>")
   	}else{
   		mbtn.outerHTML = "<button class=pageBtn id = mybtn onclick=openReportDocZ('"+editControl.inputControl('PUBINFO_ID').value+"')>编辑附件</button>"
   	}
   	editControl.all.apply.disabled = true//不能保存
    
}	
function transunit(cell){
	var sql = "select unitname   from  sgcc_ini_unit  where  unitid ='" + cell.innerText+"'"
    var data = document.all.dbnetgrid1.selectData(sql)
       cell.innerText = data.unitname   
}
function transuser(cell){
    var sql = " select realname from  rock_user  where  userid ='" + cell.innerText+"'"
    var data = document.all.dbnetgrid1.selectData(sql)
    cell.innerText = data.realname   
}
function contentTran(cell){
	if(cell.innerText.length>20){
		cell.innerText = cell.innerText.substring(0,10)+"....."
	}
}
function transfileType(cell){
    if(cell.innerText == 'tz'){
    	cell.innerText="通知";
    }
	if(cell.innerText == 'gg'){
    	cell.innerText="公告";
	}
	if(cell.innerText == 'tb'){
    	cell.innerText="通报";
	}
	if(cell.innerText == 'qt'){
    	cell.innerText="其他";
	}
} 
function getSN() {
        var date = new Date();
        var s = date.getYear()
                + (date.getMonth()+101+"").substring(1)
                + (date.getDate()+100+"").substring(1)
                + (date.getHours()+100+"").substring(1)
                + (date.getMinutes()+100+"").substring(1)
                + (date.getSeconds()+100+"").substring(1)
                + (date.getMilliseconds()+1000+"").substring(1)
                + (Math.random()*1000+1000).toFixed(0).substring(1);
        return s;
}

function transFile(cell){
	cell.innerHTML = "<a href=javascript:openReportDocZ()>明细附件</a>";
}	

function openReportDocZ(pubinfoid){
	var pk = pubinfoid;
	var sj = document.all.dbnetgrid1.currentRow.sj_type;
	//alert(file_flag)
	parent.showFileWin( "bussiness_pubinfo", pk ,true,"",createDate);
}

function transfileName(cell){
	cell.innerHTML = "<a href=javascript:openReportDocCurrent()>明细附件</a>";
}
function openReportDocCurrent(){
	var masterGrid = document.all.dbnetgrid1
	if(masterGrid.currentRow == null) {
		parent.Ext.MessageBox.alert("提示信息","请选择记录!");
		return;		
	}
	var pk = document.all.dbnetgrid1.currentRow.id;
	var sj = document.all.dbnetgrid1.currentRow.pub_date;
	//alert(file_flag)
	parent.showFileWin( "bussiness_pubinfo", pk ,true,"",sj);
}
</script>