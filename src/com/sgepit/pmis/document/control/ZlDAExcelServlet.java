package com.sgepit.pmis.document.control;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.pmis.document.service.ZlGlMgmFacade;

public class ZlDAExcelServlet extends HttpServlet {
	private ZlGlMgmFacade zlGlMgmFacade;
	private WebApplicationContext wac;

	/**
	 * Constructor of the object.
	 */
	public ZlDAExcelServlet() {
		super();
	}
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
		this.zlGlMgmFacade =(ZlGlMgmFacade) this.wac.getBean("zlMgm");
	}
	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}
	public void PostConstruct() {
		//ServletContext servletContext = config.getServletContext();
		this.wac = Constant.wact;
		this.zlGlMgmFacade =(ZlGlMgmFacade) this.wac.getBean("zlMgm");
	}
	/**
	 * The doGet method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
          		doPost(request,response);
	}

	/**
	 * The doPost method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to post.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
			request.setCharacterEncoding("UTF-8");
			response.setCharacterEncoding("UTF-8");
		    String method = request.getParameter("ac");
		    if(method.equals("importExcelData")){
		    	try {
					doActionExcelInput(request,response);
				} catch (FileUploadException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		    }
	}

	private void doActionExcelInput(HttpServletRequest request,
			HttpServletResponse response) throws IOException, FileUploadException {
		HttpSession ses = request.getSession();
		String realName = (String)ses.getAttribute(Constant.USERNAME);
	    String pid =   request.getParameter("pid");
	    String selectdaid = request.getParameter("selectdaid");
	    response.setCharacterEncoding("utf-8");           
	    response.setContentType("text/html; charset=utf-8"); 
	    PrintWriter out = response.getWriter();
        String upLoad =  Constant.AppRootDir.concat(java.io.File.separator).concat(Constant.TEMPFOLDER);;
        DiskFileItemFactory factory = new DiskFileItemFactory();
        // 缓冲区大小
        factory.setSizeThreshold(4096);  
       // 临时文件目录
        File tempFolder = new File(upLoad);
        if (!tempFolder.exists()){
        	tempFolder.createNewFile();
		}
       factory.setRepository(tempFolder);
       ServletFileUpload  upload = new ServletFileUpload(factory);
       upload.setHeaderEncoding(Constant.ENCODING);
       List<FileItem> fileItemList = upload.parseRequest(request);
       String message = "";
       if(fileItemList.size()>0){
    	   for(FileItem fileItem : fileItemList){
    		   if(!fileItem.isFormField()){
    			   message = this.zlGlMgmFacade.ZLDAExcelInputData(pid, selectdaid,fileItem,realName);
    			   }}
    		   }
		out.print(message);
		out.flush();
		out.close();
	}

}
