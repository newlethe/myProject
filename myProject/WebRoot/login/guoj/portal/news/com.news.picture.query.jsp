<%@ page language="java" import="java.util.*,com.sgepit.frame.util.JdbcUtil" pageEncoding="UTF-8"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
	<HEAD>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/appNewsMgm.js'></script>	
	
		<TITLE>国家电网公司-基建管理</TITLE>
<%
//查询已发布的前5条新闻纪录
String whereSgccSql="select * from sgcc_attach_list l1,(select transaction_id, min(upload_date) minDate from  sgcc_attach_list where transaction_id in(select uids from (select * from app_news where uids in(select  an.uids from app_news an, sgcc_attach_list sal where an.status = 1 and an.pid ='"+currentAppid+"' and sal.transaction_id = an.uids)order by createtime desc) where rownum<=10) group by transaction_id ) l2 where l1.transaction_id = l2.transaction_id and l1.upload_date = l2.minDate order by l1.transaction_id desc";
List listSgcc=JdbcUtil.query(whereSgccSql);
%>	
		
	</HEAD>
	<BODY scroll=no>
<style type="text/css">
#demo {
background: #FFF;
overflow:hidden;
width: 100%;
}
#demo img {
	 max-width: 380px;
     max-height: 330px;
     height:expression(document.body.clientWidth*0.86);
     zoom:expression( function(e) {
     	divWidth = document.body.clientWidth;
     	var v_divWidth = divWidth-6;
   		e.height = e.height*(v_divWidth /e.width);
   		e.width = v_divWidth;
		e.style.zoom = '1';
	}(this));
    overflow:hidden; 
}
#indemo {
float: left;
width: 100%;
}
#demo1 {
    float: left;
	width:100%;  
    height:270px;  
}
</style>
<div id="demo">
<div id="indemo">
<div id="demo1">
<table width="100%" height="100%">
<tr>
<%
if(listSgcc!=null){
	for(int i=0;i<listSgcc.size();i++)
	{
		String picName="";
		Map m=(Map) listSgcc.get(i);
		Object uids=m.get("transaction_id");
		Object fileName=m.get("file_name");
		String file_lsh=m.get("file_lsh").toString();
		String fileNameStr=fileName.toString();
		List listNews=JdbcUtil.query("select title from app_news where uids='"+uids+"' order by createtime desc");
		Map news=(Map)listNews.get(0);
		String title=news.get("title").toString();
		String oldTitle=news.get("title").toString();
		if(title.length()>20){
			title=title.substring(0,20)+"...";
		}
		picName=file_lsh+"."+fileNameStr.substring(fileNameStr.lastIndexOf(".")+1, fileNameStr.length());
%>
<td>
<table width="100%" height="100%">
<tr height="80%">
<td>
<div width="100%">
<a href="javascript:goToUrl('<%=uids%>')">
	<img src="<%=path%>/Business/newsManage/guoj/news/upload/<%=picName%>"/>
</a>
</div>
</td>
</tr>
<tr height="20%" align="center" >
<td width="100%"; style="word-wrap: break-word;word-break:break-all;">
<div><a href="javascript:goToUrl('<%=uids%>')" title="<%=oldTitle%>"><font size="3" style='color:blue;'><%= title%></font></a></div>
</td>
</tr>
</table>
</td>
<%
	}
		} 
	%>
</tr>
</table>
</div>
</div>
</div>
<script type='text/javascript'>
var divWidth;
//新闻详情窗口居中显示参数WLeft,WTop
var   WLeft   = Math.ceil((window.screen.width-850)/2);   
var   WTop    = Math.ceil((window.screen.height-600)/2);
function goToUrl(filePk){
			var winUrl = CONTEXT_PATH
			+ "/login/guoj/portal/news/com.news.query.jsp?filePk="+filePk;
				　window.open (winUrl, '新闻详情', 'height=600px, width=850px, top='+WTop+', left='+WLeft+', toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
}


<!--
var speed=3000;
var tab=document.getElementById("demo");
var tab1=document.getElementById("demo1");  
function Marquee(){
	if(tab.scrollLeft<=divWidth*<%=listSgcc.size()-1%>){
		tab.scrollLeft+=divWidth
	}else{
		tab.scrollLeft = 0;
	}
	
}
var MyMar=setInterval(Marquee,speed);
tab.onmouseover=function() {clearInterval(MyMar)};
tab.onmouseout=function() {MyMar=setInterval(Marquee,speed)};

-->
</script>
	</BODY>
</HTML>






