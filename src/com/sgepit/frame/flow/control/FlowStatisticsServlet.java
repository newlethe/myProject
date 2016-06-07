package com.sgepit.frame.flow.control;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.flow.service.FlwBizMgmFacade;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.ExcelExportByTemplate;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pcmis.aqgk.control.AqgkServlet;
import com.sgepit.pmis.contract.service.ConOveMgmFacade;

public class FlowStatisticsServlet extends HttpServlet{

	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(AqgkServlet.class);
	private WebApplicationContext wac;
	private ConOveMgmFacade conOveMgmFacade;
	private BaseDAO baseDao;
	private FlwBizMgmFacade flwBizMgmFacade;

	/**
	 * Constructor of the object.
	 */
	public FlowStatisticsServlet() {
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
		this.baseDao = (BaseDAO)this.wac.getBean("baseDAO");
		this.flwBizMgmFacade = (FlwBizMgmFacade)this.wac.getBean("flwBizMgm");
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
			if (method != null) 
			{
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
			}
			
		}

	/**
	 * 导出流程统计信息
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String unitid = request.getParameter("unitid")==null ? "" : request.getParameter("unitid");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
        //国锦excel导出
		String whereStr = request.getParameter("whereStr");
		String pid = request.getParameter("pid");
		String filter = unitid.equals("") ? "1=1":"unitid='"+unitid+"'";
		//生成excle文档名称
		InputStream templateIn = this.conOveMgmFacade.getExcelTemplate(businessType);
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			ByteArrayOutputStream outStream = null;
			String fileName = "";
			if ("FlowStatistics".equals(businessType)){
				fileName = "流程使用情况统计表";
				if((whereStr!=null && !whereStr.equals("")) && pid.equals("1030603")){
					filter += " and userstate not in('0','2') and unitid='"+pid+"' and posid in ("+whereStr+") order by vieworder";
				}else{
					filter += " and userstate not in('0','2') and unitid='"+pid+"' order by vieworder";
				}
				map1.put("filter", filter);
				ExcelExportByTemplate excelExport = new ExcelExportByTemplate(templateIn,map1);
				outStream = excelExport.fillDataToExcel();
			} else if ("exportTaskView".equals(businessType)){
				String orderBy = request.getParameter("orderBy") == null ? "" : request.getParameter("orderBy");
				fileName = "流程数据导出模板";
				Workbook wb = new HSSFWorkbook(templateIn);
				outStream = this.flwBizMgmFacade.fillDataToTaskViewExcel(wb, orderBy, parseParams(whereStr));
			}
			response.setContentType("application/octet-stream");
			response.setCharacterEncoding("utf-8");
			response.setHeader("Content-Disposition", "attachment; filename=" + new String(fileName.getBytes("gb2312"),"iso8859-1") + ".xls");
			OutputStream out = response.getOutputStream();
			out.write(outStream.toByteArray());
			
			out.flush();
			out.close();
		} else {
			System.out.println("没有相关的模板信息！");
		}
	}

	/**
	 * 用来修改导出流程统计文件名称（备用）
	 * @param pid 项目编号
	 * @param batUids 检查批次主键
	 * @return
	 * @throws UnsupportedEncodingException 
	 */
	public String createFileName(String pid, String batUids) throws UnsupportedEncodingException {
		SystemMgmFacade sys = (SystemMgmFacade) Constant.wact.getBean("systemMgm");
		SgccIniUnit unitBean  = sys.getUnitById(pid);
		
		GregorianCalendar now = new GregorianCalendar();
		String attachDate = now.get(Calendar.YEAR) + "-" +
							(now.get(Calendar.MONTH)+1) + "-" +
							(now.get(Calendar.DAY_OF_MONTH));
		if(unitBean==null)
			return attachDate;
		else
			return "流程统计信息";
	}

	/**
	 * 解析参数字符串
	 * @param params
	 * @return
	 */
	private HashMap parseParams(String params) {
		HashMap map = new HashMap();
		if(!params.equals("")){
			String[] a = params.split(Constant.SPLITA);
			for (int i = 0; i < a.length; i++) {
				String[] b = a[i].split(Constant.SPLITB);
				map.put(b[0], b[1]);
			}
		}
		return map;
	}

}