package com.sgepit.pmis.budget.control;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmFacade;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.ExcelExportByTemplate;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.budget.service.BdgInfoMgmFacade;
import com.sgepit.pmis.budget.service.BdgProjectMgmFacade;
import com.sgepit.pmis.contract.control.ConServlet;
import com.sgepit.pmis.contract.hbm.ConBre;
import com.sgepit.pmis.contract.hbm.ConCha;
import com.sgepit.pmis.contract.hbm.ConCla;
import com.sgepit.pmis.contract.hbm.ConPay;
import com.sgepit.pmis.contract.service.ConBreMgmFacade;
import com.sgepit.pmis.contract.service.ConChaMgmFacade;
import com.sgepit.pmis.contract.service.ConClaMgmFacade;
import com.sgepit.pmis.contract.service.ConOveMgmFacade;
import com.sgepit.pmis.contract.service.ConPayMgmFacade;

public class BdgServlet extends MainServlet {
	
	private static final Log log = LogFactory.getLog(ConServlet.class);
	private WebApplicationContext wac;
	private BdgInfoMgmFacade bdgInfoMgmFacade;
	private BaseMgmFacade baseMgm;
	private ConClaMgmFacade conclaMgm;
	private ConChaMgmFacade conchaMgm;
	private ConBreMgmFacade conbreMgm;
	private ConPayMgmFacade conpayMgm;
	private BdgProjectMgmFacade bdgProjectMgm;
	
	/**
	 * Constructor of the object.
	 */
	public BdgServlet() {
		super();
	}

	/**
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException if an error occurs
	 */
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
		this.bdgInfoMgmFacade = (BdgInfoMgmFacade) this.wac.getBean("bdgInfoMgm");
		this.baseMgm = (BaseMgmFacade) Constant.wact.getBean("baseMgm");
		this.conclaMgm = (ConClaMgmFacade) Constant.wact.getBean("conclaMgm");
		this.conchaMgm=(ConChaMgmFacade)Constant.wact.getBean("conchaMgm");
		this.conbreMgm=(ConBreMgmFacade)Constant.wact.getBean("conbreMgm");
		this.conpayMgm=(ConPayMgmFacade)Constant.wact.getBean("conpayMgm");
		this.bdgProjectMgm=(BdgProjectMgmFacade)Constant.wact.getBean("bdgProjectMgm");
	}
	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String method = request.getParameter("ac");
		if (method != null) {
			if(method.equals("exportData")){
				try {
					exportData(request, response);
				} catch (ExcelPortException e) {
					e.printStackTrace();
				} catch (DbPropertyException e) {
					e.printStackTrace();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			else if(method.equals("listCla")){
				listClaData(request,response,"listCla");
			}
			else if(method.equals("listCha")){
				listClaData(request,response,"listCha");
			}
			else if(method.equals("listBre")){
				listClaData(request,response,"listBre");
			}
			else if(method.equals("listPay")){
				listClaData(request,response,"listPay");
			}
			else if(method.equals("importData")){
				try {
					importData(request, response);
				} catch (FileUploadException e) {
					e.printStackTrace();
				}
			}
		}
	}

	private void listClaData(HttpServletRequest request,
			HttpServletResponse response,String type) {
		String beanName = request.getParameter("bean");
		String businessName = request.getParameter("business");
		String methodName = request.getParameter("method");
		String params = request.getParameter("params");
		String conid = request.getParameter("conid");
		String sort = request.getParameter("sort");
		String dir = request.getParameter("dir");
		Integer start = request.getParameter("start") != null ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer
				.valueOf(request.getParameter("limit")) : null;
		String orderby = (sort != null && dir != null) ? sort + " " + dir
				: null;
		List list = this.baseMgm.find(businessName, beanName, methodName,
				params, orderby, start, limit);
		if(list!=null){
			if(type.equals("listCla")){
				for(int i=0;i<list.size()-1;i++){
					ConCla c=(ConCla)list.get(i);
					try {
						Double claappmoney= this.conclaMgm.getClaappmoney(conid,"0",c.getClaid());
						c.setClaappmoney(claappmoney);
					} catch (BusinessException e) {
						e.printStackTrace();
					} catch (SQLException e) {
						e.printStackTrace();
					}
				}
			}
			else if(type.equals("listCha")){
				for(int i=0;i<list.size()-1;i++){
					ConCha c=(ConCha)list.get(i);
					try {
						Double changeappmoney= this.conchaMgm.getChangeappmoney(conid,"0",c.getChaid());
						c.setChangeappmoney(changeappmoney);
					} catch (BusinessException e) {
						e.printStackTrace();
					} catch (SQLException e) {
						e.printStackTrace();
					}
					
				}
			}
			else if(type.equals("listBre")){
				for(int i=0;i<list.size()-1;i++){
					ConBre c=(ConBre)list.get(i);
					try {
						Double breachappmoney= this.conbreMgm.getBreachappmoney(conid,"0",c.getBreid());
						c.setBreachappmoney(breachappmoney);
					} catch (BusinessException e) {
						e.printStackTrace();
					} catch (SQLException e) {
						e.printStackTrace();
					}
					
				}
			}
			else if(type.equals("listPay")){
				for(int i=0;i<list.size()-1;i++){
					ConPay c=(ConPay)list.get(i);
					try {
						Double factpaymoney= this.conpayMgm.getFactpaymoney(conid,"0",c.getPayid());
						c.setFactpaymoney(factpaymoney);
					} catch (BusinessException e) {
						e.printStackTrace();
					}
					
				}
			}			
		}
		try {
			String json=makeJsonDataForGrid(list);
			outputString(response,json);
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}

	/**
	 * 到出概算列表
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String unitId = request.getParameter("unitId")==null ? "" : request.getParameter("unitId");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		InputStream templateIn = this.bdgInfoMgmFacade.getExcelTemplate(businessType);
		
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			map1.put("unitId", unitId);
			map1.put("businessType", businessType);
			ExcelExportByTemplate excelExport = new ExcelExportByTemplate(templateIn, map1);
			ByteArrayOutputStream outStream = excelExport.fillDataToExcel();
			
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + businessType + "_" + unitId + ".xls");
			OutputStream out = response.getOutputStream();
			out.write(outStream.toByteArray());
			
			out.flush();
			out.close();
		} else {
			response.setContentType("text/html");
			PrintWriter out = response.getWriter();
			out.println("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">");
			out.println("<HTML>");
			out.println("  <HEAD><TITLE>A Servlet</TITLE></HEAD>");
			out.println("  <BODY>");
			out.println("提示 : 请先在【系统管理】->【office模板】中维护概算模板，模板标识符号为"+businessType+"。");
			out.println("  </BODY>");
			out.println("</HTML>");
			out.flush();
			out.close();
			System.out.println("没有相关的模板信息！");
		}
	}

	/**
	 * 工程量分摊excel数据导入
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws FileUploadException
	 * @author pengy 2013-8-20
	 */
	@SuppressWarnings("unchecked")
	private void importData(HttpServletRequest request,
			HttpServletResponse response) throws IOException,FileUploadException {
		String pid = request.getParameter("pid")==null ? "" : request.getParameter("pid");
		String conid = request.getParameter("conid")==null ? "" : request.getParameter("conid");
		String bdgid = request.getParameter("bdgid")==null ? "" : request.getParameter("bdgid");
		String bean = request.getParameter("bean")==null ? "" : request.getParameter("bean");
		
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
       ServletFileUpload upload = new ServletFileUpload(factory);
       upload.setHeaderEncoding(Constant.ENCODING);
       List<FileItem> fileItemList = upload.parseRequest(request);
       String message = "";
       if(fileItemList.size()>0){
    	   for(FileItem fileItem : fileItemList){
    		   if(!fileItem.isFormField()){
    			   message = this.bdgProjectMgm.importData(pid, conid, bdgid, bean, fileItem);
    			   System.out.println(">>>>>>"+message);
    			   }}
    		   }
		out.print(message);
		out.flush();
		out.close();
	}

}
