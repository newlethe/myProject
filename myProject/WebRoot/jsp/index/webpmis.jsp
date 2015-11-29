<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.sql.SQLException,java.sql.Connection,java.sql.Statement,java.sql.DriverManager,java.sql.ResultSet;"%>
<!-- date:2008-12-27
镶嵌到门户网站的mis系统待办事项页面，移植的时候请将其中相关的参数进行修改
1：17行的jdbc连接；
2：203/208/215行的mis URL
-->
<%!
//由于要放到别的系统的web容器里面，所以在页面写了jdbc连接
public class GetWebpmisCon{
	private Connection con;
	
	public Connection getConnection(){
		try{
			Class.forName("oracle.jdbc.driver.OracleDriver");
			con = DriverManager.getConnection("jdbc:oracle:thin:@127.0.0.1:1521:liuhc","swdc","swdc");
		}catch(Exception e){
			e.printStackTrace();
		}
		return con;
	}
}

%>
<script type="text/javascript">
var net=new Object();
net.READY_STATE_UNINITIALIZED=0;
net.READY_STATE_LOADING=1;
net.READY_STATE_LOADED=2;
net.READY_STATE_INTERACTIVE=3;
net.READY_STATE_COMPLETE=4;
net.ContentLoader=function(url,onload,onerror){
	this.url=url;
	this.req=null;
	this.onload=onload;
	this.onerror=(onerror) ? onerror : this.defaultError;
	this.loadXMLDoc(url);
}
net.ContentLoader.prototype={
	loadXMLDoc:function(url){
		if (window.XMLHttpRequest){
			this.req=new XMLHttpRequest();
		} else if (window.ActiveXObject){
			this.req=new ActiveXObject("Microsoft.XMLHTTP");
		}
		if (this.req){
			try{
				var loader=this;
				this.req.onreadystatechange=function(){
				loader.onReadyState.call(loader);
				}
				this.req.open('POST',url,true);
				this.req.send(null);
			}catch (err){
				this.onerror.call(this);
			}
		}
	},
	onReadyState:function(){
		var req=this.req;
		var ready=req.readyState;
		if (ready==net.READY_STATE_COMPLETE){
			var httpStatus=req.status;
			if (httpStatus==200 || httpStatus==0){
				this.onload.call(this);
			}else{
				this.onerror.call(this);
			}
		}
	},
	defaultError:function(){
		alert("error fetching data!"
		+"\n\nreadyState:"+this.req.readyState
		+"\nstatus: "+this.req.status
		+"\nheaders: "+this.req.getAllResponseHeaders());
	}
}

</script>

<netui:html>
<Head>
<style type="text/css">
<!--
body,td,th {
	font-family: "宋体";
	font-size: 12px;
	color: #09469F;
}
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
	background-color: #FFFFFF;
}
.body{
	margin: 0px;
}
/*------------------------------------------------------------------------------------------------------------------------------
	设置待办列表主题样式
------------------------------------------------------------------------------------------------------------------------------*/
	/*设置titlebar的样式*/
	.bea-portal-daibian-window-titlebar {
		background-image: url(images/daibian_titlebar_bg.gif);
		background-repeat: repeat-x;
		border-top: 1px solid #9cb3c5;
		border-right: 1px solid #9cb3c5;
		border-left: 1px solid #9cb3c5;
	}
	/*设置图标的样式*/
	.bea-portal-daibian-window-icon {
		height: 33px;
		width: 23px;
		background-image: url(images/daibian_titlebar_left.gif);
}
	/*设置title的样式*/
	.bea-portal-daibian-window-titlebar-title {
		font-size: 14px;
		font-weight: bold;
		color: #07479e;
		text-indent: 8pt;
	}
	/*设置右图片的样式*/
	.bea-portal-daibian-window-titlebar-icon2 {
		height: 33px;
		width: 23px;
		background-image: url(images/daibian_titlebar_right.gif);
	}
	/*设置外框的样式*/
	.bea-portal-daibian-window-titlebar-binkan {
		border-right: 1px solid #9cb3c5;
		border-left: 1px solid #9cb3c5;
		margin-bottom: 8px;
		border-bottom: 1px solid #9cb3c5;
	}
	/*设置表格内字体的样式*/
	.bea-portal-daibian-window-tabletext{
		font-size:12;
		color:#1453a3;
		background-image: url(images/daibian_table_bg2.gif);
		line-height: 25px;
	}
	/*设置表格内链接字体的样式*/
	.bea-portal-daibian-window-tabletextlink:link{
		color:#1453a3;
		text-decoration: none;
	}
	.bea-portal-daibian-window-tabletextlink:visited{
		color:#1453a3;
		text-decoration: none;
	}
	.bea-portal-daibian-window-tabletextlink:hover{
		color:#f30;
		text-decoration: none;
	}
	.bea-portal-daibian-window-tabletextlink:active{
		color:#f30;
		text-decoration: none;
	}
	/*设置上一页、下一页字体的样式*/
	.bea-portal-daibian-window-grey{
	font-size:12;
	color:#333;
	line-height: 25px;
	background-color: #F5F5F5;
	}
	.bea-portal-daibian-window-greylink:link{
		font-size:12;
		color:#333;
		line-height: 25px;
		text-decoration: none;
	}
	.bea-portal-daibian-window-greylink:visited{
		font-size:12;
		color:#333;
		line-height: 25px;
		text-decoration: none;
	}
	.bea-portal-daibian-window-greylink:hover{
		font-size:12;
		color:#f30;
		line-height: 25px;
		text-decoration: none;
	}
	.bea-portal-daibian-window-greylink:active{
		font-size:12;
		color:#f30;
		line-height: 25px;
		text-decoration: none;
	}
-->
</style>

</Head>

<script type="text/javascript">
//ajax发送doPost请求
var _thiswindow, _condition;
function callback(condition){
	_condition = condition;
	_thiswindow = window.open("http://localhost/wbf/jsp/index/index.jsp");
	window.setTimeout("opendaiban()",3000)
}

function opendaiban(){
	_thiswindow.frames[0].location.href = "http://localhost/wbf/jsp/flow/flw.wait.process.jsp"+_condition
}

function error(){
}   
 
function doPostSumit(args1,args2,args3){
	var _ajax = new net.ContentLoader("http://localhost/wbf/servlet/SysServlet?ac=login&username="+args1+"&password="+args2, callback(args3), error);	
}  
</script>        
<body topmargin="0" leftmargin="0" rightmargin="0" bottommargin="0" marginwidth="0" marginheight="0">
<% 
String username = (String)session.getAttribute("username"); 
if(username==null) 
{ 
%>
<br>
<center>
    请先登录门户！
</center>

<%
}
else
{

int i=1;//序号的初始值

GetWebpmisCon webpmis = new GetWebpmisCon();
Connection conins = webpmis.getConnection();
Statement st = conins.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
ResultSet rs = st.executeQuery("select  t.flowtitle,t.title,t.ftime,t.fromname,t.ftype,s.password,t.logid,t.flowid,t.insid,t.fromnode from task_view t, sys_user s where t.tonode = s.userid and s.username = '"+username +"' and flag='0' order by ftime desc");

//得到待办事项的总条数
rs.last();
int totalRow  = rs.getRow();
rs.beforeFirst(); 


ArrayList alCol=new ArrayList();//alCol是10个字段的名称
alCol.add("flowtitle");
alCol.add("title");
alCol.add("ftime");
alCol.add("fromname");
alCol.add("ftype");
alCol.add("password");
alCol.add("logid");
alCol.add("flowid");
alCol.add("insid");
alCol.add("fromnode");

ArrayList alColname=new ArrayList();//alColname是10个字段的名称
alColname.add("流程类型");
alColname.add("主题");
alColname.add("发送时间");
alColname.add("发送人");
alColname.add("处理说明");
alColname.add("password");
alColname.add("logid");
alColname.add("flowid");
alColname.add("insid");
alColname.add("fromnode");


%>
<script type="text/javascript">

</script>
<form name="maxinbox" method="post" action="">
<table width="100%" border="1" cellpadding="0" cellspacing="0" bordercolordark="FFFFFF"  id='myTable' class="bea-portal-daibian-window-tabletext">
  <caption>您一共有<font color=red><%=totalRow%></font>条待办事项</caption>
  <tr>
  <%int k; for(k=0; k<4; k++) {%>
   <td  background="/Web/porlets/deptnav/index/images/daibian_table_bg.gif" >
    <a STYLE='color:#0000CC;'> <p align="center"><%=alColname.get(k).toString()%></p></a>
     </td>
   <%
   }
   %>
  </tr>
<%
  while (rs.next())
{
%>
<tr style="cursor:hand">
  <td width="25%" align="left">
  <a href="#" onclick="doPostSumit('<%=username%>','<%=rs.getString(6)%>','?logid=<%=rs.getString(7)%>&flowid=<%=rs.getString(8)%>&title=<%=rs.getString(2)%>&insid=<%=rs.getString(9)%>&ftype=<%=rs.getString(5)%>&fromnode=<%=rs.getString(10)%>')" class="bea-portal-daibian-window-tabletextlink" >
  	<%=(rs.getString(alCol.get(0).toString())==null)?"&nbsp;":rs.getString(alCol.get(0).toString())%>
  </a></td>
  <td width="35%" align="left">
  <a href="#" onclick="doPostSumit('<%=username%>','<%=rs.getString(6)%>','?logid=<%=rs.getString(7)%>&flowid=<%=rs.getString(8)%>&title=<%=rs.getString(2)%>&insid=<%=rs.getString(9)%>&ftype=<%=rs.getString(5)%>&fromnode=<%=rs.getString(10)%>')" class="bea-portal-daibian-window-tabletextlink">
  	<%=(rs.getString(alCol.get(1).toString())==null)?"&nbsp;":rs.getString(alCol.get(1).toString())%>
  </a></td>
  <td width="25%" align="center">
  	<%=(rs.getString(alCol.get(2).toString())==null)?"&nbsp;":rs.getString(alCol.get(2).toString())%>
  </td>
  <td width="15%" align="center">
  	<%=(rs.getString(alCol.get(3).toString())==null)?"&nbsp;":rs.getString(alCol.get(3).toString())%>
  </td>
  </tr>
<%
i++;
}
%>

</table>
</form>
<%
conins.close();
}
%>
<body>
</netui:html>