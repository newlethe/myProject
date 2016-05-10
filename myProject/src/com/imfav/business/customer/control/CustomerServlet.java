package com.imfav.business.customer.control;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
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
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.imfav.business.customer.service.CustomerMgm;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.ExcelExportByTemplate;
import com.sgepit.helps.webdynproService.export.ExcelPortException;

/**
 * 类说明
 * @author zhangh
 * @version 创建时间：2016年1月23日 上午2:48:40
 */
public class CustomerServlet extends MainServlet {
	
	private static final Log log = LogFactory.getLog(CustomerServlet.class);
	private WebApplicationContext wac;
	private CustomerMgm customerMgm;
	private ServletConfig servletConfig;
	private BaseDAO baseDao;

	public CustomerServlet() {
		super();
	}
	
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
		this.customerMgm = (CustomerMgm) this.wac.getBean("customerMgmImpl");
		baseDao = (BaseDAO) wac.getBean("systemDao");
		servletConfig = config;
	}

	public void destroy() {
		super.destroy();
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String method = request.getParameter("ac");
		if (method != null) {
			if(method.equals("businessStatistics")){
				businessStatistics(request, response);
			}else if(method.equals("exportDataByTemp")){
				try {
					exportDataByTemp(request, response);
				} catch (ExcelPortException e) {
					e.printStackTrace();
				} catch (DbPropertyException e) {
					e.printStackTrace();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}else if(method.equals("exportDataByHssf")){
				try {
					exportDataByHssf(request, response);
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
	
	public void businessStatistics(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String beanName = request.getParameter("bean");
		String params = request.getParameter("params");
		String orderby = request.getParameter("orderby");
		String sort = request.getParameter("sort");
		String isManager = request.getParameter("isManager");
		String between = request.getParameter("between");

		Integer start = (request.getParameter("start") != null) ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = (request.getParameter("limit") != null) ? Integer
				.valueOf(request.getParameter("limit")) : null;
		List list = customerMgm.findBusinessStatistics(beanName, params,
				orderby, start, limit, isManager, between);
		outputString(response, makeJsonDataForGrid(list));
	}
	
	/**
	 * 通过excel模板导出Excel文件
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportDataByTemp(HttpServletRequest request,HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String unitId = request.getParameter("unitId")==null ? "" : request.getParameter("unitId");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		String sjType = request.getParameter("sjType")==null ? "" : request.getParameter("sjType");
		String masterId = request.getParameter("masterId")==null ? "" : request.getParameter("masterId");
		InputStream templateIn = null;//this.pcZlgkService.getExcelTemplate(businessType);
		
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			map1.put("unitId", unitId);
			map1.put("businessType", businessType);
			if(sjType != null && !"".equals(sjType)) map1.put("sjType", sjType);
			if(masterId != null && !"".equals(masterId)) map1.put("masterId", masterId);
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
	
	
	
	public void exportDataByHssf(HttpServletRequest request,HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String header = request.getParameter("header") == null ? null : request.getParameter("header");
		String where = request.getParameter("where") == null ? null : request.getParameter("where");
		Date date = new Date();
		DateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		String filename = format.format(date);
		HSSFWorkbook web = customerMgm.exportExcelByHeaderAndWhere(header,where);
		if(web != null){
			response.setContentType("text/html");
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename="+filename+".xls");
			OutputStream out = response.getOutputStream();
			web.write(out);
			out.flush();
			out.close();
		}else{
			response.setContentType("text/html");
			PrintWriter out = response.getWriter();
			out.println("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">");
			out.println("<HTML>");
			out.println("  <HEAD><TITLE>A Servlet</TITLE></HEAD>");
			out.println("  <BODY>");
			out.println("excel数据导出失败！");
			out.println("  </BODY>");
			out.println("</HTML>");
			out.flush();
			out.close();
		}
	}




}
