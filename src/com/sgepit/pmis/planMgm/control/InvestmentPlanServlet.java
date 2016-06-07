package com.sgepit.pmis.planMgm.control;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.ExcelExportByTemplate;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.planMgm.hbm.PlanMaster;
import com.sgepit.pmis.planMgm.service.FundMonthPlanService;
import com.sgepit.pmis.planMgm.service.InvestmentPlanService;

/**
 * 投资计划管理的相关servlet
 * @author Ivy
 * @createDate 2010-12-12
 * 
 */
public class InvestmentPlanServlet extends MainServlet{
	private WebApplicationContext wac;
	private InvestmentPlanService investmentPlanService;
	private FundMonthPlanService fundMonthPlanService;
	/**
	 * Constructor of the object.
	 */
	public InvestmentPlanServlet() {
		super();
	}
	/**
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException if an error occurs
	 */
	public void init(ServletConfig config) throws ServletException {
		// Put your code here
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.investmentPlanService =  (InvestmentPlanService) this.wac.getBean("investmentPlanService");
		this.fundMonthPlanService =  (FundMonthPlanService) this.wac.getBean("fundMonthPlanService");
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
			if(method.equals("savePlanMaster")){
				savePlanMaster(request, response);
			} else if (method.equals("exportData")) {
				try {
					exportData(request, response);
				} catch (ExcelPortException e) {
					e.printStackTrace();
				} catch (DbPropertyException e) {
					e.printStackTrace();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}else if (method.equals("exportFundData")) {
				try {
					exportFundData(request, response);
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
	 * 保存投资计划的主记录信息
	 * @param request
	 * @param response
	 * @author: Ivy
	 * @throws IOException 
	 * @createDate: 2010-12-12
	 */
	private void savePlanMaster(HttpServletRequest request,	HttpServletResponse response) throws IOException {
		String rtn = "{success:";
		String lsh = "";
		try {
			String json = StringUtil.getInputStream(request.getInputStream(), Constant.ENCODING);
			
			String ITEMBEAN = PlanMaster.class.getName();
			PlanMaster master = (PlanMaster) JSONObject.toBean(JSONObject.fromObject(json), Class.forName(ITEMBEAN));
			String dateStr = master.getOperateTimeStr();
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        	df.setTimeZone(TimeZone.getTimeZone("GMT+8"));
        	if (dateStr!=null && !dateStr.equals("")) {
        		master.setOperateTime(df.parse(dateStr));
			}
			lsh = this.investmentPlanService.savePlanMaster(master);
			
			if (lsh!=null) {
				rtn += "true,msg:'" + lsh + "'}";
			} else {
				rtn += "false,msg:'保存失败！'}";
			}
		} catch (Exception ex) {
			rtn += "false,msg:'" + ex.getMessage() + "'}";
			ex.printStackTrace();
		}
		outputStr(response, rtn);
	}
	
//********************************************* 数据导出  *****************************************************************
	public void exportData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String sjType = request.getParameter("sjType")==null ? "" : request.getParameter("sjType");
		String unitId = request.getParameter("unitId")==null ? "" : request.getParameter("unitId");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		String masterId = request.getParameter("masterId")==null ? "" : request.getParameter("masterId");
		String contractId = request.getParameter("contractId")==null ? "" : request.getParameter("contractId");
		String monId = request.getParameter("monId")==null ? "" : request.getParameter("monId");
		
		InputStream templateIn = investmentPlanService.getExcelTemplate(businessType);
		
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			map1.put("sjType", sjType);
			map1.put("unitId", unitId);
			map1.put("businessType", businessType);
			map1.put("masterId", masterId);
			map1.put("contractId", contractId);
			map1.put("monId", monId);
			ExcelExportByTemplate excelExport = new ExcelExportByTemplate(templateIn, map1);
			ByteArrayOutputStream outStream = excelExport.fillDataToExcel();
			
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=计划数据_" + businessType + "_" + unitId + "_" + sjType + ".xls");
			OutputStream out = response.getOutputStream();
			out.write(outStream.toByteArray());
			
			out.flush();
			out.close();
		} else {
			System.out.println("没有相关的模板信息！");
		}
	}
	//月度资金计划导出
	public void exportFundData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String sjType = request.getParameter("sjType")==null ? "" : request.getParameter("sjType");
		String unitId = request.getParameter("unitId")==null ? "" : request.getParameter("unitId");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		String reportId = request.getParameter("reportId")==null ? "" : request.getParameter("reportId");
		InputStream templateIn = investmentPlanService.getExcelTemplate(businessType);
		if(templateIn !=null){
			ByteArrayOutputStream outStream = fundMonthPlanService.exportFundData(sjType, unitId, businessType, reportId);
			String fileName="月度资金计划数据_"+ unitId + "_" + sjType + ".xls";
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" +new String( fileName.getBytes("gb2312"), "ISO8859-1" ));
			OutputStream out = response.getOutputStream();
			out.write(outStream.toByteArray());
			out.flush();
			out.close();
		}else{
			System.out.println("没有相关的模板信息！");
		}
		
	}
}
