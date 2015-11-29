package com.sgepit.pcmis.budget.control;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.fileAndPublish.control.ComFileSortServlet;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.pcmis.bid.service.PCBidApplyService;
import com.sgepit.pcmis.bid.service.PCBidService;
import com.sgepit.pcmis.bid.service.PCBidTbUnitService;
import com.sgepit.pcmis.budget.service.PCBdgInfoService;

public class PCBdgService extends MainServlet {
	private static final Log log = LogFactory.getLog(ComFileSortServlet.class);
	private WebApplicationContext wac;
	private PCBdgInfoService  pcBdgInfoService;
	/**
	 * Constructor of the object.
	 */
	public PCBdgService() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.pcBdgInfoService=(PCBdgInfoService)this.wac.getBean("pcBdgInfoMgm");
	}
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		doPost(request, response);

	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
     
		request.setCharacterEncoding("UTF-8");
		String method = request.getParameter("ac") == null ? ""
				: (String) request.getParameter("ac");
		Integer start = request.getParameter("start") != null ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer
				.valueOf(request.getParameter("limit")) : null;
		String pid = request.getParameter("pid");
		System.out.println("method="+method);
        if(method != null){
        	if(method.equals("getJsonPcBdgTrans")){
        		System.out.println("222222222222222222222");
        		String fileId = request.getParameter("fileId").toString();
        		System.out.println("fileId="+fileId);
				String fileTypes = "PCBdgMoneyReport";
				String yjrName = request.getParameter("yjrName").toString();
				System.out.println("yjrName="+yjrName);
				String type = request.getParameter("type")==null?"":request.getParameter("type").toString();
				System.out.println("type="+type);
				String jsonStr = this.pcBdgInfoService.getJsonStrForTransToZLSByType(type,fileId, fileTypes, yjrName);
				System.out.println("jsonStr="+jsonStr);
				super.outputStr(response, jsonStr);
        	}
        }

	}

}
