<%@ page language="java" pageEncoding="UTF-8"%>
<%
String type = (String)request.getParameter("type");
String conid = (String)request.getParameter("conid");
String conname = (String)request.getParameter("conname");
String url = "";
String setPage = "";
if (!"".equals(type)){
	if ("getgoods".equals(type)) setPage = "equ.getGoods.addorupdate.jsp";
	if ("tkgoods".equals(type)) setPage = "equ.tkGoods.addorupdate.jsp";
	if ("select".equals(type)) setPage = "equ.list.selectTree.jsp";
	if ("selectkx".equals(type)) setPage = "equ.list.selectkxTree.jsp";
	if ("openbox".equals(type)) setPage = "equ.openBox.input.jsp";
	if ("getgoodsarr".equals(type)) setPage = "equ.getGoods.arr.addorupdate.jsp";
	if("equrecedit".equals(type)) setPage = "equ.recipients.addorupdate.jsp";
	if("houseout".equals(type)) setPage = "equ.houseOut.addorupdate.jsp";
	
	
	if ("getgoods".equals(type)){
		String conno = (String)request.getParameter("conno");
		String ggid = (String)request.getParameter("ggid");
		String isTask = (String)request.getParameter("isTask");
		String ggno = (String)request.getParameter("ggno");
		url = setPage+"?conid="+conid+"&conname="+conname+"&conno="+conno+"&ggid="+ggid+"&isTask="+isTask+"&ggno="+ggno;
	}else if("houseout".equals(type)){
		String conno = (String)request.getParameter("conno");
		String outid = (String)request.getParameter("outid");
		String isTask = (String)request.getParameter("isTask");
		String outno = (String)request.getParameter("outno");
		url = setPage+"?conid="+conid+"&conname="+conname+"&conno="+conno+"&outid="+outid+"&isTask="+isTask+"&outno="+outno;
	}else if ("tkgoods".equals(type)){
		String conno = (String)request.getParameter("conno");
		String ggid = (String)request.getParameter("ggid");
		url = setPage+"?conid="+conid+"&conname="+conname+"&conno="+conno+"&ggid="+ggid;
	} 
	else if ("select".equals(type)){
		String conno = (String)request.getParameter("conno");
		String ggid = (String)request.getParameter("ggid");
		String argments = (String)request.getParameter("argments");
		url = setPage+"?conid="+conid+"&conname="+conname+"&conno="+conno+"&ggid="+ggid +"&argments="+argments;
	} else if ("openbox".equals(type)){
		String uuids = (String)request.getParameter("uuids");
		String uuid = (String)request.getParameter("uuid");
		String partId = (String)request.getParameter("partId");
		url = setPage+"?uuids="+uuids+"&conid="+conid+"&conname="+conname+"&partId="+partId+"&uuid="+uuid;
	} else if ("getgoodsarr".equals(type)){
		String conno = (String)request.getParameter("conno");
		String ggid = (String)request.getParameter("ggid");
		String isTask = (String)request.getParameter("isTask");
		String ggno = (String)request.getParameter("ggno");
		url = setPage+"?conid="+conid+"&conname="+conname+"&conno="+conno+"&ggid="+ggid+"&isTask="+isTask+"&ggno="+ggno;
	}  else if ("equrecedit".equals(type)){
		String recsubid = (String)request.getParameter("recsubid");
		String storenum = (String)request.getParameter("storenum");
		String recid = (String)request.getParameter("recid");
		url = setPage+"?recid="+recid+"&conid="+conid+"&recsubid="+recsubid+"&storenum="+storenum;
	} else if ("selectkx".equals(type)){
		String conno = (String)request.getParameter("conno");
		String uuid = (String)request.getParameter("uuid");
		String ggid = (String)request.getParameter("ggid");
		String sbid = (String)request.getParameter("sbid");
		String argments = (String)request.getParameter("argments");
		url = setPage+"?conid="+conid+"&conname="+conname+"&conno="+conno+"&kxuuid="+uuid+"&ggid="+ggid+"&kxsbid="+sbid+"&argments="+argments;
	}
}
%>

<div>
    <iframe src="Business/equipment/<%=url%>" style="width:100%; height:100%" frameborder=no></iframe>
</div>