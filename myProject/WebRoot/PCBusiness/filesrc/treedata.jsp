<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%@page import="java.io.*"%>
<%@page import="net.sf.json.JSONArray"%>
<%@page import="net.sf.json.JSONObject"%>
<%
	String path = request.getContextPath();
	String base = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort();
	String basePath = base+path+"/";
	String fpath = request.getParameter("fpath")==null?"":request.getParameter("fpath");
	
	String root = Constant.AppRootDir;
	root = root.substring(0, root.lastIndexOf("/"));
	root = root.substring(0, root.lastIndexOf("/")).concat("/");
	
	String proot = request.getParameter("proot")==null?"":request.getParameter("proot");
	if(!proot.equals("")){
		if(!proot.endsWith("/")) proot = proot.concat("/");
		if(proot.startsWith("/")) proot = proot.substring(1);
		root = root.concat(proot);
	}
	
	java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	JSONArray arr0 = new JSONArray();
	JSONArray arr1 = new JSONArray();
	File file = new File(root.concat(fpath));
	
	if(file.exists()&&file.isDirectory()){
		File[] subFiles = file.listFiles();
        for(int i = 0 ;i < subFiles.length; i++) {
        	JSONObject o = new JSONObject();
        	File subf = subFiles[i];
        	
        	String spath = subf.getPath().replace("\\", "/");
        	spath = spath.substring(root.length());
        	long s = 0;
        	
        	try{
	        	FileInputStream fis = null;
	            fis = new FileInputStream(subf);
	            s= fis.available();
	            fis.close();
        	}catch(Exception ex){}
        	
            o.put("id", spath);
            o.put("text", subf.getName());
            o.put("fpath", spath);
            o.put("uiProvider", "col");
            o.put("ifcheck", "none");
            
           
        	if(subf.isDirectory()){
	            o.put("leaf", false);
	            o.put("edit", false);
	            o.put("type","item");
	            arr0.add(o);
           	}else{
           	 	o.put("leaf", true);
           	 	o.put("type", "file");
	            o.put("size", s);
	            o.put("durl", spath);
	            o.put("update", sdf.format(new Date(subf.lastModified())));
	            if(spath.endsWith(".js")||spath.endsWith(".html")||spath.endsWith(".bak")||
	            		spath.endsWith(".htm")||spath.endsWith(".jsp")||
	            		spath.endsWith(".xml")||spath.endsWith(".properties")||
	            		spath.endsWith(".css")||spath.endsWith(".txt")){
	            	o.put("edit", true);
	            }else{
	            	o.put("edit", false);
	            }
	            arr1.add(o);
           	}
        }
	}
	arr0.addAll(arr1);
	out.print(arr0.toString());
%>