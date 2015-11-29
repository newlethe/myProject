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
		<STYLE type=text/css>
			.bea-portal-body
			{
			    margin: 0px;
			    padding: 0px;
			    font-family: Verdana, Arial, Helvetica, sans-serif;
			}
			.h12 {
				FONT-SIZE: 12px;
				COLOR: #646464;
				LINE-HEIGHT: 120%;
				FONT-FAMILY: "宋体";
				TEXT-DECORATION: none
			}
			
			A:hover {
				TEXT-DECORATION: underline
			}
			.green12 {
				FONT-SIZE: 15px;
				LINE-HEIGHT: 100%;
				FONT-FAMILY: "宋体";
				padding: 1px;
				TEXT-DECORATION: none
			}
			.red12 {
				FONT-SIZE: 12px;
				COLOR: red;
				LINE-HEIGHT: 130%;
				FONT-FAMILY: "宋体";
				TEXT-DECORATION: none
			}
			.orange12 {
				FONT-SIZE: 12px; COLOR: green; LINE-HEIGHT: 130%; FONT-FAMILY: "宋体"; TEXT-DECORATION: none;overflow: hidden; text-overflow:ellipsis;white-space:nowrap;
			}

		</STYLE>
<%
//查询已发布的前10条新闻纪录
String whereSql="select *from (select an.uids,an.title,an.picture,an.author,an.pubperson,to_char(an.createtime, 'YYYY-MM-DD')pubtime,ru.realname from app_news an,rock_user ru where  an.status=1 and an.pid='"+currentAppid+"' and an.pubperson=ru.userid order by an.createtime desc) where rownum<=13";
List list=JdbcUtil.query(whereSql);
%>			
	</HEAD>
	<BODY class="bea-portal-body" scroll=no>
		<TABLE cellSpacing=1 cellPadding=0 width=100% align=center border=0>
			<TBODY>
				<TR>
					<TD>
						<TABLE cellSpacing=0 cellPadding=0 width=100% border=0>
							<TBODY>
								<TR>
									<TD align=middle>
											<TABLE cellSpacing=1 cellPadding=0 width="100%" border=0>
												<TBODY>
												<%
												if(list!=null&&list.size()>0)
												{
													for(int i=0;i<list.size();i++)
													{
														Map m=(Map) list.get(i);
														Object uids=m.get("uids");
														Object title=m.get("title");
														Object pubPerson=m.get("author");
														Object pubTime=m.get("pubtime");
														String uidsStr=uids.toString();
														String titleStr=title.toString();
														String oldtitleStr=title.toString();
														if(titleStr.length()>21){
															titleStr=titleStr.substring(0,21)+"...";
														}
														String pubPersonStr=pubPerson.toString();
														String pubTimeStr=pubTime.toString();
												%>
													<TR>
														<TD class=green12 vAlign=top width="5%">
															<img src='<%=path%>/jsp/res/images/icons/bullet_red.png'' />
														</TD>
														<TD class=green12 width="60%">
															<A class=green12 style='color:blue;' title="<%=oldtitleStr%>" href="javascript:openPubInfoFile('<%=uidsStr%>')"><%=titleStr %></A>
														</TD>
														<TD class=green12 width="10%" align='center'>
															<A class=green12 ><%=pubPersonStr %></A>
														</TD>
														<TD class=green12 width="15%" align='center'>
														<A class=green12 ><%=pubTimeStr %></A>
														</TD>												 
													</TR>	
												<% 
													}
												}
												 %>												
												</TBODY>
											</TABLE>
									</TD>
								</TR>
							</TBODY>
						</TABLE>
						

					</TD>
				</TR>
				<TR>
					<TD align=right>
						<A class=orange12 onclick=showMoreNews() href="javascript:void(0)">更多&gt;&gt; </A>
					</TD>
				</TR>
			</TBODY>
		</TABLE>
		
	</BODY>
</HTML>
<script type="text/javascript">

	function openPubInfoFile(filePk){
			//新闻详情窗口居中显示参数WLeft,WTop
			var   WLeft   = Math.ceil((window.screen.width-850)/2 );   
			var   WTop    = Math.ceil((window.screen.height-600)/2);	
			var winUrl = CONTEXT_PATH
			+ "/login/guoj/portal/news/com.news.query.jsp?filePk="+filePk;
			　window.open (winUrl, '新闻详情', 'height=600px, width=850px, top='+WTop+', left='+WLeft+', toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no');
			
	}
	function notReminderMsg(id){
		
	}
	function showMoreNews(){
		window.parent.location.href=CONTEXT_PATH+"/Business/newsManage/com.news.list.jsp?dyView=1";
	}
	
	function fastIntoModuleAndAction(modid,actionName,actionParm){
	}

</script>