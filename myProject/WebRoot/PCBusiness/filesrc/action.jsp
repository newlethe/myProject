<%@ page contentType="text/html;charset=utf-8"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%@page import="org.apache.commons.fileupload.*"%>
<%@page import="org.apache.commons.fileupload.disk.DiskFileItemFactory"%>
<%@page import="org.apache.commons.fileupload.servlet.ServletFileUpload"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.io.*"%>
<%
		String ac = request.getParameter("ac")==null?"":request.getParameter("ac");
		String root = Constant.AppRootDir;
		root = root.substring(0, root.lastIndexOf("/"));
		root = root.substring(0, root.lastIndexOf("/")).concat("/");
		out.clear();
		if(ac.equals("upload")){//上传文件
			try{
				String fpath = request.getParameter("fpath");
				
				DiskFileItemFactory factory = new DiskFileItemFactory();
				ServletFileUpload upload = new ServletFileUpload(factory);
				// 设置上传文件大小的上限，-1表示无上限
				upload.setSizeMax(100 * 1024 * 1024);
				List<FileItem> items = upload.parseRequest(request);
				// 下面对每个字段进行处理，分普通字段和文件字段
				Iterator<FileItem> it = items.iterator();
				while (it.hasNext()) {
					FileItem fileItem = it.next();
					if (fileItem.getName() != null && fileItem.getSize() != 0) {
						File fullFile = new File(fileItem.getName());
						String fname = fullFile.getName();
						File newFile = null;
						
						if(fpath.toLowerCase().endsWith(fname.toLowerCase())){
							newFile = new File(root.concat(fpath));
						}else{
							String tmp = fpath.substring(0,fpath.lastIndexOf("/")).concat("/");
							newFile = new File(root.concat(tmp).concat(fname));
						}
						
						fileItem.write(newFile);
					}
				}
				out.println("({success: 1, msg: '文件上传成功！'})");
			}catch(Exception ex){
				out.println("({success: 0, msg: '文件上传失败！'})");
			}
		}else if(ac.equals("save")){//保存编辑好的文件
			String htmlstr = request.getParameter("html");
			String fpath = request.getParameter("fpath");
			String bak = request.getParameter("bak");

			File newFile = new File(root.concat(fpath));
			
			if(bak.equals("1")&&newFile.exists()){
				try{
					File bakFile = new File(newFile.getPath()+".bak");
					FileInputStream is = new FileInputStream(newFile);
					FileOutputStream os = new FileOutputStream(bakFile);
					
					int len = 0;
					byte[] buf = new byte[1024*1000];
					while ((len = is.read(buf, 0, 1024*1000)) != -1) {
						os.write(buf, 0, len);
					}
					os.close();
					is.close();
					
				}catch(Exception ex){}
			}
			if(!newFile.exists()) newFile.createNewFile();
			FileOutputStream os = new FileOutputStream(newFile);
			os.write(htmlstr.getBytes("UTF-8"));
			os.close();
		}else if(ac.equals("get")){//获取文本文件内容
			String fpath = request.getParameter("fpath");
			File newFile = new File(root.concat(fpath));
			if(newFile.exists()&&(!newFile.isDirectory())){
				BufferedReader br=new BufferedReader(new InputStreamReader(new FileInputStream(newFile),"UTF-8"));      
				String line = null;      
				while ((line = br.readLine()) != null) {      
					out.println(line);  
				}      
				br.close();  
			}
	        out.flush();
		}else if(ac.equals("del")){
			String fpath = request.getParameter("fpath");
			File newFile = new File(root.concat(fpath));
			if(newFile.exists()){
				System.out.println(newFile.getAbsolutePath());
				boolean b = newFile.delete();
				if(b){
					out.println("操作成功");	
				}else{
					out.println("操作失败");	
				}
			}else{
				out.println("文件不存在");	
			}
		}
%>