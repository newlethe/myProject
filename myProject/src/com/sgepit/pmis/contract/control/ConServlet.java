package com.sgepit.pmis.contract.control;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.jspsmart.upload.SmartUpload;
import com.jspsmart.upload.SmartUploadException;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.ExcelExportByTemplate;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.contract.service.ConOveMgmFacade;
import com.sgepit.pmis.contract.service.ConPayMgmFacade;

public class ConServlet extends MainServlet {

	private static final Log log = LogFactory.getLog(ConServlet.class);
	private WebApplicationContext wac;
	private ConOveMgmFacade conOveMgmFacade;
	private ConPayMgmFacade conPayMgmFacade;
	private ServletConfig servletConfig;

	/**
	 * Constructor of the object.
	 */
	public ConServlet() {
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
		this.conOveMgmFacade = (ConOveMgmFacade) this.wac.getBean("conoveMgm");
		this.conPayMgmFacade = (ConPayMgmFacade) this.wac.getBean("conpayMgm");
		servletConfig = config;
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
			else if(method.equals("listPcBusinessCon")){
					try {
						findPcBusinessCon(request,response);
					} catch (ExcelPortException e) {
						e.printStackTrace();
					} catch (DbPropertyException e) {
						e.printStackTrace();
					} catch (SQLException e) {
						e.printStackTrace();
					}
			}
			else if(method.equals("listPcBusinessConPay")){
				try {
					findPcBusinessConPay(request,response);
				} catch (ExcelPortException e) {
					e.printStackTrace();
				} catch (DbPropertyException e) {
					e.printStackTrace();
				} catch (SQLException e) {
					e.printStackTrace();
				}				
						
			}
			else if(method.equalsIgnoreCase("saveDoc")){
				saveDoc(request, response);
	        }
			else if(method.equals("exportConPayAccount")){
				try {
					exportConPayAccount(request, response);
				} catch (ExcelPortException e) {
					e.printStackTrace();
				} catch (DbPropertyException e) {
					e.printStackTrace();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
	}

	/**
	 * 导出合同列表
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String conDiv = request.getParameter("conDiv")==null ? "" : request.getParameter("conDiv");
		String conSort = request.getParameter("conSort")==null ? "" : request.getParameter("conSort");
		String unitId = request.getParameter("unitId")==null ? "" : request.getParameter("unitId");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		String pid = request.getParameter("pid")==null ? "" : request.getParameter("pid");
		String typeName = request.getParameter("typeName")==null ? "合同状态" : request.getParameter("typeName");
		InputStream templateIn = this.conOveMgmFacade.getExcelTemplate(businessType);
		
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			map1.put("conDiv", conDiv);
			map1.put("conSort", conSort);
			map1.put("unitId", unitId);
			map1.put("businessType", businessType);
			map1.put("pid", pid);   
			map1.put("typeName", typeName);
			ExcelExportByTemplate excelExport = new ExcelExportByTemplate(templateIn, map1);
			ByteArrayOutputStream outStream = excelExport.fillDataToExcel();
			
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + businessType + "_" + unitId + ".xls");
			OutputStream out = response.getOutputStream();
			out.write(outStream.toByteArray());
			
			out.flush();
			out.close();
		} else {
			System.out.println("没有相关的模板信息！");
		}
	}
	/**
	 * 查询本月新增签订合同与累计签订合同
	 */
	public void findPcBusinessCon(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		Integer start = request.getParameter("start") != null ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer
				.valueOf(request.getParameter("limit")) : null;
		String params = request.getParameter("params");			
		String sj=request.getParameter("sj");
		String type=request.getParameter("type");
		String pid=request.getParameter("pid");
		List list =conOveMgmFacade.findPcBusinessCon(sj,type,pid, params, start, limit);
		String json = "";
		json = makeJsonDataForGrid(list);
		outputString(response, json);
	}
	private void findPcBusinessConPay(HttpServletRequest request,
			HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String params = request.getParameter("params");			
		String sj=request.getParameter("sj");
		Map m=request.getParameterMap();
		List list =conPayMgmFacade.findPcBusinessConPay(sj, params);
		String json = "";
		json = makeJsonDataForGrid(list);
		outputString(response, json);
	}

	/**
	 * 保存合同付款的文档：付款申请单、增值税专用发票收具单
	 * @param request
	 * @param response
	 * @author pengy 2013-12-03
	 */
	private void saveDoc(HttpServletRequest request, HttpServletResponse response) {
		try {
			request.setCharacterEncoding("UTF-8");
			response.setCharacterEncoding("UTF-8");
			com.jspsmart.upload.File myFile = null;
			SmartUpload mySmartUpload = new SmartUpload();
			mySmartUpload.initialize(servletConfig, request, response);
			mySmartUpload.upload();
			int i = 0;
			while (i < mySmartUpload.getFiles().getCount()) {
				myFile = mySmartUpload.getFiles().getFile(i++);
				System.out.println((new StringBuilder("File=")).append(myFile.getFileName()).toString());
				if (myFile.isMissing())
					continue;
				String uids = mySmartUpload.getRequest().getParameter("uids");
				String fieldname = mySmartUpload.getRequest().getParameter("fieldname");
				String fileid = mySmartUpload.getRequest().getParameter("fileid");
				String hasfile = mySmartUpload.getRequest().getParameter("hasfile");
				String msg = null;
				//保存付款申请单、增值税专用发票收具单
				if (fieldname.equals("APPLY_FILEID") || fieldname.equals("INVOICE_FILEID")){
					msg = conPayMgmFacade.saveOrUpdateBlob(uids, fieldname, fileid, hasfile, myFile);
				}
				if (msg != null) {
					response.setCharacterEncoding("GB2312");
					PrintWriter pw = response.getWriter();
					pw.print(msg);
					pw.flush();
					pw.close();
				}
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (ServletException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SmartUploadException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 导出合同付款台账列表
	 * 直接将页面ds.baseparams.params传到后台进行查询，可通用
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportConPayAccount(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		String filter = request.getParameter("filter")==null ? "" : URLDecoder.decode(request.getParameter("filter"),"UTF-8");
		InputStream templateIn = this.conOveMgmFacade.getExcelTemplate(businessType);
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			if (businessType.equals("ConList")){
				filter = filter.replaceAll("( pid=)", " v_con.pid=");
			}
			map1.put("filter", filter);
			map1.put("businessType", businessType);
			ExcelExportByTemplate excelExport = new ExcelExportByTemplate(templateIn, map1);
			ByteArrayOutputStream outStream = excelExport.fillDataToExcel();
			String filename = businessType;
			if (businessType.equals("ConPayAccountCon")){
				filename = new String("合同付款台账合同信息".getBytes("gb2312"),"iso8859-1");
			} else if (businessType.equals("ConPayAccountPay")){
				filename = new String("合同付款台账付款信息".getBytes("gb2312"),"iso8859-1");
			} else if (businessType.equals("ConList")){
				filename = new String("合同信息".getBytes("gb2312"),"iso8859-1");
			}
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + filename + ".xls");
			OutputStream out = response.getOutputStream();
			out.write(outStream.toByteArray());
			
			out.flush();
			out.close();
		} else {
			System.out.println("没有相关的模板信息！");
		}
	}

}