package com.sgepit.pcmis.zlgk.control;

import java.io.ByteArrayOutputStream;
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

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.ExcelExportByTemplate;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pcmis.zlgk.service.PCZlgkService;

public class PCZlgkServlet extends MainServlet {

	private WebApplicationContext wac;
	private PCZlgkService pcZlgkService;
	public PCZlgkServlet(){
		super();
	}
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
		this.pcZlgkService = (PCZlgkService) this.wac.getBean("zlgkImpl");
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

		response.setContentType("text/html");
		String method = request.getParameter("ac");
		String pid = request.getParameter("pid");
		if (method != null){
			if(method.equals("getJsonStrForTransToZlgkZlyp")){
				PcZlgkFileTrans(request,response);
			}
			if(method.equals("pcZlgkBuileRightTree")){
				if (request.getParameter("sortId") != null) {
					String sortId = request.getParameter("sortId").toString();
					String excludeDept = request.getParameter("excludeDept") == null ? "0" : request.getParameter("excludeDept");
					String fileStorId = request.getParameter("fileStorId") .equals("") ? "01" : request.getParameter("fileStorId");
					List list;
					if ( excludeDept.equals("1") ){
						list = this.pcZlgkService.getComFileSortRightTree(sortId, pid,fileStorId, true);
					}
					else{
						list = this.pcZlgkService
						.getComFileSortRightTree(sortId, pid,fileStorId, false);
					}
					
					JSONArray arrayjson = new JSONArray();// 定义一个jsonarray型的对象
					int size = list.size();
					if (list != null && list.size() > 0) {
						if (list.get(list.size() - 1).getClass().getName().equals(
								"java.lang.Integer")) {
							size = (Integer) list.get(list.size() - 1);
							list.remove(list.size() - 1);
						}
					}
					JsonConfig jsonConfig = new JsonConfig();
					jsonConfig.registerJsonValueProcessor(String.class,
							new JSONUtil.NullValueProcesser());
					arrayjson = JSONArray.fromObject(list, jsonConfig);
					JSONObject jsonResult = new JSONObject();
					jsonResult.put("topics", arrayjson);
					jsonResult.put("totalCount", size);
					outputString(response, jsonResult.toString());
				}
			}
			if(method.equals("exportData")){
				String startTime = request.getParameter("getStartTime") == null ? null : request.getParameter("getStartTime");
				String endTime = request.getParameter("getEndTime") == null ? null : request.getParameter("getEndTime");
				String unitSTr = request.getParameter("unitComValue") == null ? null : request.getParameter("unitComValue");
				String billstateStr = request.getParameter("billstateComValue") == null ? null : request.getParameter("billstateComValue");
				String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
				HSSFWorkbook web = this.pcZlgkService.exportExcelByQuerySql(pid,startTime,endTime, unitSTr,billstateStr);
				if(web != null){
					response.setContentType("text/html");
					response.setContentType("application/octet-stream");
					response.setHeader("Content-Disposition", "attachment; filename="+businessType+".xls");
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
//				try {
//					exportData(request, response);
//				} catch (ExcelPortException e) {
//					e.printStackTrace();
//				} catch (DbPropertyException e) {
//					e.printStackTrace();
//				} catch (SQLException e) {
//					e.printStackTrace();
//				}
			}
			
			if(method.equals("exportDataJdgkMonthTask")){
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
	 * 质量验评记录管理文件移交
	 * @param request
	 * @param response
	 * @author yanglh
	 * @date 3013-6-25
	 */
	private void PcZlgkFileTrans(HttpServletRequest request,
			HttpServletResponse response) {
			String fileId = request.getParameter("fileId").toString();
			String fileTypes = "zlMaterail";
			String yjrName = request.getParameter("yjrName").toString();
			String type = request.getParameter("type")==null?"":request.getParameter("type").toString();
			String uuid = request.getParameter("uuid")==null?"":request.getParameter("uuid").toString();
			String jsonStr = this.pcZlgkService.getJsonStrForTransToZlgkZlyp(type,fileId, fileTypes, yjrName,uuid);
			try {
				super.outputStr(response, jsonStr);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	}
	//数据导出
	public void exportData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String unitId = request.getParameter("unitId")==null ? "" : request.getParameter("unitId");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		String sjType = request.getParameter("sjType")==null ? "" : request.getParameter("sjType");
		String masterId = request.getParameter("masterId")==null ? "" : request.getParameter("masterId");
		InputStream templateIn = this.pcZlgkService.getExcelTemplate(businessType);
		
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
}
