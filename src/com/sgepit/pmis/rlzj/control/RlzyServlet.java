package com.sgepit.pmis.rlzj.control;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.dom4j.DocumentException;
import org.jdom.JDOMException;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.dhtmlx.connector.ComboConnector;
import com.dhtmlx.connector.FormConnector;
import com.dhtmlx.connector.GridConnector;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmFacade;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.ConnectionMan;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.pmis.rlzj.service.RlzyKqglMgmFacade;
import com.sgepit.pmis.rlzj.service.RlzyMgmFacade;
import com.sgepit.pmis.rlzj.service.RlzyXcglMgmFacade;
import com.sgepit.pmis.rlzj.service.RzglMainMgmFacade;
import com.sgepit.pmis.rlzj.service.RzglMgmFacade;
import com.sgepit.pmis.rlzj.util.XgridBean;

public class RlzyServlet extends MainServlet {

	private static final long serialVersionUID = 1L;
	private WebApplicationContext wac;
	private SystemMgmFacade systemMgm;
	private BaseMgmFacade baseMgm;
	private RlzyMgmFacade rlzyMgm;
	private RlzyKqglMgmFacade rlzyKqglMgm;
	private RlzyXcglMgmFacade rlzyXcglMgm;
	
	private RzglMainMgmFacade rzglMainMgm;
	private RzglMgmFacade rzglMgm;
	private ApplicationMgmFacade appMgm;
	private BaseDAO baseDAO;
	private static final Log log = LogFactory.getLog(BaseMgmImpl.class);
	/**
	 * Constructor of the object.
	 */
	public RlzyServlet() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
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
		doPost(request, response);
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
		if (method != null) {
			if (method.equals("getKqGridTree")) {
				getKqGridTree(request, response);
			}else if (method.equals("getBonusGridTree")) {
				getBonusGridTree(request, response);
			}
			else if (method.equals("getSjTypeTillNow")) {
				String startDate = null;
				if (request.getParameter("startDate") != null) {
					if (!request.getParameter("startDate").equals("")) {
						startDate = request.getParameter("startDate");
					}
				}

				response.getWriter()
						.write(rlzyKqglMgm.getSjTypeStrToNow(startDate));
			}
			else if (method.equals("unitListBox")) {
				String userBelongUnitid = request.getParameter("userBelongUnitid")==null?"":(String)request.getParameter("userBelongUnitid");
				response.getWriter().write(rlzyKqglMgm.getUnitListBoxStr(userBelongUnitid));

			}
			else if (method.equals("userListBox")) {
				String userBelongUnitid = request.getParameter("userBelongUnitid")==null?"":(String)request.getParameter("userBelongUnitid");
				String[] unitIds = request.getParameterValues("unitIds");
				if (unitIds != null) {
					if (unitIds.length == 0) {
						unitIds = null;
					}
				}
				response.getWriter().write(rlzyKqglMgm.getUserListBoxStr(unitIds,userBelongUnitid));
			} 
			else if (method.equals("exportSalaryData")) {
				try {
					exportSalaryData(request, response);
				} catch (DocumentException e) {
					e.printStackTrace();
				} catch (JDOMException e) {
					e.printStackTrace();
				}
			}
			else if (method.equals("getBonusGridNewTree")) {
				getBonusGridNewTree(request, response);
			}
			 else if (method.equals("exportCell")) {
					try {
						exportCell(request, response);
					} catch (DocumentException e) {
						e.printStackTrace();
					}
				}
			 else if (method.equals("exportBonusGrid")) {//导出奖金单根部门信息
					try {
						exportBonusGrid(request, response);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}  
				}
			 else if (method.equals("getWorktimeSet")) {
				getWorktimeSet(request, response);
			}
			 else if (method.equals("getHolidaySet")) {
				 getHolidaySet(request, response);
			 }
			 else if (method.equals("getKqImport")) {
				 getKqImport(request, response);
			 }
			 else if (method.equals("loadDeptCombo")) {
				 loadDeptCombo(request, response);
			 }
			 else if (method.equals("importData")) {
				 try {
					importData(request, response);
				} catch (FileUploadException e) {
					e.printStackTrace();
				}
			 }
			 else if (method.equals("getKqAdjust")) {
				 getKqAdjust(request, response);
			 }
			 else if (method.equals("getKqhzQuery")) {
				 getKqhzQuery(request, response);
			 }else if("getKqtj".equals(method)){
				 getKqtj(request,response);
			 }
			 else if (method.equals("dowload")) {
				 downloadAppBlob(request, response);
			 }
			 else if (method.equals("getOnBusiness")) {
				 getOnBusiness(request, response);
			 }
			 else if (method.equals("loadOnBusinessForm")) {
				 loadOnBusinessForm(request, response);
			 }
			 else if (method.equals("loadUserComo")) {
				 loadUserComo(request, response);
			 }
			 else if (method.equals("loadBillStateComo")) {
				 loadBillStateComo(request, response);
			 }
			 else if (method.equals("loadAskForLeaveTypeComo")) {
				 loadAskForLeaveTypeComo(request, response);
			 }
			 else if (method.equals("getAskForLeave")) {
				 getAskForLeave(request, response);
			 }
			 else if (method.equals("loadAskForLeaveForm")) {
				 loadAskForLeaveForm(request, response);
			 }
			 else if (method.equals("getOvertime")) {
				 getOvertime(request, response);
			 }
			 else if (method.equals("loadOvertimeForm")) {
				 loadOvertimeForm(request, response);
			 }
		}
	}

	private void getKqGridTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String sjType = request.getParameter("sjType")!=null?request.getParameter("sjType").toString():"";
		String deptId = request.getParameter("deptId")==null?"0":(String)request.getParameter("deptId");
		String userBelongUnitid = request.getParameter("userBelongUnitid")==null?"":(String)request.getParameter("userBelongUnitid");
		String str = rlzyKqglMgm.getBulidTreeJson(sjType,deptId,userBelongUnitid);
		PrintWriter out = response.getWriter();
		out.print(str);
		out.flush();
		out.close();
	}

	private void getBonusGridTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String sjType = request.getParameter("sjType")!=null?request.getParameter("sjType").toString():"";
		String deptId = request.getParameter("deptId")==null?"0":(String)request.getParameter("deptId");
		String str = rlzyMgm.getBulidTreeJsonForBonus(sjType,deptId);
		PrintWriter out = response.getWriter();
		out.print(str);
		out.flush();
		out.close();
	}
	private void getBonusGridNewTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String sjType = request.getParameter("sjType") != null ? request
				.getParameter("sjType").toString() : "";
		String deptId = request.getParameter("deptId") == null ? "0"
				: (String) request.getParameter("deptId");
		String userBelongUnitid = request.getParameter("userBelongUnitid")==null?"":(String)request.getParameter("userBelongUnitid");
		String pid = request.getParameter("pid")==null?"":(String)request.getParameter("pid");
		String str =rlzyXcglMgm.getBulidTreeJsonForBonus(sjType, deptId,userBelongUnitid,pid);
		PrintWriter out = response.getWriter();
		out.print(str);
		out.flush();
		out.close();
	}
	public void exportCell(HttpServletRequest request,
			HttpServletResponse response) throws IOException, DocumentException {
		String startSjType = request.getParameter("startSj");
		String endSjType = request.getParameter("endSj");
		String deptIds = request.getParameter("depts");
		String userIds = request.getParameter("users");
		String itemIds = request.getParameter("items");
		String typeIds = request.getParameter("types");
		String pid = request.getParameter("pid");
		System.out.println("deptIds:" + deptIds + "userIds:" + userIds
				+ "itemIds" + itemIds + "typeIds:" + typeIds);
		String userDetailItems = request.getParameter("userDetailItems");
		String[] userIds_n = userIds == "" ? null : userIds.split(",");
		String[] deptIds_n = deptIds == "" ? null : deptIds.split(",");
		String[] itemIds_n = itemIds == "" ? null : itemIds.split(",");
		String[] typeIds_n = typeIds == "" ? null : typeIds.split(",");
		String[] userDetailItems_n = userDetailItems == "" ? null
				: userDetailItems.split(",");
		SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmm");
		String xml = this.rlzyXcglMgm.getSalaryStatisticXml(startSjType,
				endSjType, deptIds_n, userIds_n, itemIds_n, typeIds_n,
				userDetailItems_n,pid);
		if (!xml.equals("") && xml != null) {
			System.out.println(xml + "==============");
			ByteArrayOutputStream outStream = this.rlzyXcglMgm.getExcelTem(xml);
			response.setContentType("application/octet-stream");
			response
					.setHeader("Content-Disposition", "attachment; filename="
							+ "_" + sf.format(new java.util.Date()) + "Salary"
							+ ".xls");
			OutputStream out = response.getOutputStream();
			if (outStream != null) {
				out.write(outStream.toByteArray());
			}
			out.flush();
			out.close();
		} else {
			System.out.println("数据加载错误或数据为空");
		}
		//String xml=this.hrSalaryMgm.getSalaryStatisticXml(startSjType,endSjType,deptIds,userIds,itemIds,typeIds,userDetailItems);

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
		this.baseMgm = (BaseMgmFacade) this.wac.getBean("baseMgm");
		this.systemMgm = (SystemMgmFacade) this.wac.getBean("systemMgm");
		this.rlzyMgm = (RlzyMgmFacade) this.wac.getBean("rlzyMgm");
		this.rlzyKqglMgm = (RlzyKqglMgmFacade) this.wac.getBean("rlzyKqglMgm");
		this.rlzyXcglMgm = (RlzyXcglMgmFacade) this.wac.getBean("rlzyXcglMgm");
		this.rzglMainMgm = (RzglMainMgmFacade) this.wac.getBean("rzglMainMgm");
		this.rzglMgm = (RzglMgmFacade) this.wac.getBean("rzglMgm");
		this.appMgm = (ApplicationMgmFacade) this.wac.getBean("applicationMgm");
		this.baseDAO = (BaseDAO) this.wac.getBean("baseDAO");
	} 
	
	/**
	 * 导出工资单信息
	 * 
	 * @param request
	 * @param response
	 * @author: Liuay
	 * @throws IOException
	 * @throws JDOMException
	 * @throws DocumentException
	 * @createDate: Jun 30, 2011
	 */
	public void exportSalaryData(HttpServletRequest request,
			HttpServletResponse response) throws IOException,
			DocumentException, JDOMException {
		String templateId = request.getParameter("templateId") == null ? ""
				: request.getParameter("templateId");
		String reportId = request.getParameter("reportId") == null ? ""
				: request.getParameter("reportId");
		String sjType = request.getParameter("sjType") == null ? "" : request
				.getParameter("sjType");

		XgridBean xgridBean = new XgridBean();
		String xmlData = xgridBean.getXgridXML(templateId, "", reportId,
				sjType, "true");
		// System.out.println(xmlData);
		SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmm");
		if (templateId != null) {
			ByteArrayOutputStream outStream = xgridBean.exportDataToExcel(
					templateId, xmlData);
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename="
					+ templateId + "_" + sf.format(new java.util.Date())
					+ ".xls");
			OutputStream out = response.getOutputStream();
			if (outStream != null) {
				out.write(outStream.toByteArray());
			}
			out.flush();
			out.close();
		} else {
			System.out.println("没有相关的模板信息！");
		}
	}

	/**
	 * 导出奖金单根部门信息
	 * 
	 * @param request
	 * @param response
	 * @author: Shangtw
	 * @throws IOException
	 * @throws JDOMException
	 * @throws DocumentException
	 * @createDate: August 15, 2011
	 */
	public void exportBonusGrid(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String startSjType = request.getParameter("startSj");
		String deptIds = request.getParameter("depts");
		System.out.println("deptIds:" + deptIds);	
		String[] deptIds_n = deptIds == "" ? null : deptIds.split(",");
		String pid=request.getParameter("pid");
		SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmm");
		String xml = this.rlzyXcglMgm.getBonusStatisticXml(deptIds_n, startSjType,pid);
		if (!xml.equals("") && xml != null) {
			System.out.println(xml + "==============");
			ByteArrayOutputStream outStream = this.rlzyXcglMgm.getExcelTem(xml);
			response.setContentType("application/octet-stream");
			response
					.setHeader("Content-Disposition", "attachment; filename="
							+ "_" + sf.format(new java.util.Date()) + "Bonus"
							+ ".xls");
			OutputStream out = response.getOutputStream();
			if (outStream != null) {
				out.write(outStream.toByteArray());
			}
			out.flush();
			out.close();
		} else {
			System.out.println("数据加载错误或数据为空");
		}
		//String xml=this.hrSalaryMgm.getSalaryStatisticXml(startSjType,endSjType,deptIds,userIds,itemIds,typeIds,userDetailItems);

	}
	
	
	//shuz
	/**
	 * 考勤管理工作时间设置
	 * @param request
	 * @param response
	 */
	public void getWorktimeSet(HttpServletRequest request,HttpServletResponse response) {
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			GridConnector gridConnector = new GridConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			map.put("pid", request.getParameter("pid"));
			rzglMainMgm.getWorktimeSet(map, gridConnector);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 考勤管理节假日设置
	 * @param request
	 * @param response
	 */
	public void getHolidaySet(HttpServletRequest request,HttpServletResponse response) {
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			GridConnector gridConnector = new GridConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			map.put("pid", request.getParameter("pid"));
			rzglMainMgm.getHolidaySet(map, gridConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 考勤导入读取数据
	 * @param request
	 * @param response
	 */
	public void getKqImport(HttpServletRequest request,HttpServletResponse response) {
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			GridConnector gridConnector = new GridConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			map.put("pid", request.getParameter("pid")==null?"":request.getParameter("pid"));
			map.put("str", request.getParameter("str")==null?"":request.getParameter("str"));
			rzglMainMgm.getKqImport(map, gridConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 
	* 
	* 加载部门下拉框信息
	* @param request
	* @param response   
	* @return void    
	* @author shuz 2014-5-8
	 */
	public void loadDeptCombo(HttpServletRequest request,
			HttpServletResponse response){
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			ComboConnector combo = new ComboConnector(conn, request, response);
			rzglMainMgm.loadDeptCombo(combo);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	
	/**
	* 导入考勤记录数据导入
	* @param request
	* @param response   
	* @return void    
	* @author shuz 2014-5-8
	 * @throws IOException 
	 * @throws FileUploadException 
	 */
	public void importData(HttpServletRequest request,
			HttpServletResponse response) throws IOException, FileUploadException{
		String bean = request.getParameter("bean")==null ? "" : request.getParameter("bean");
		int rows = Integer.parseInt(request.getParameter("rows"));
		String pid = request.getParameter("pid")==null?"":request.getParameter("pid");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("rows", rows);
		map.put("pid", pid);
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
       List fileItemList = upload.parseRequest(request);
//		HashMap<String, String> map=getMap();
		String message = "";
		if (fileItemList.size() > 0) {
			for (Iterator iterator = fileItemList.iterator(); iterator
					.hasNext();) {
				FileItem fileItem = (FileItem) iterator.next();
				if (!fileItem.isFormField()){
					message = getExcelData(bean, fileItem,map);
				}
			}
		}
		String msg = "<script type='text/javascript'>parent.addCallback('"+message+"');</script>";
		out.print(msg);
		out.flush();
		out.close();
	}
	/**
	 * 获取导入模板数据
	 * @param beanName
	 * @param fileItem
	 * @return
	 */
	public String getExcelData(String beanName, FileItem fileItem,Map<String,Object> m){
		String rtn = "";
		String pid = m.get("pid").toString();
		int rows = Integer.parseInt(m.get("rows").toString());
		try {
			Workbook wb = null;
			try {
				// 导入*.xls文件
				InputStream is = fileItem.getInputStream();
				wb = new HSSFWorkbook(is);
				is.close();
			} catch (Exception e) {
				// 导入*.xlsx文件
				InputStream is = fileItem.getInputStream();
				wb = new XSSFWorkbook(is);
				is.close();
			}
			if (wb == null) {
				return rtn = "上传失败,没有Excel文档！";
			} else {
				Sheet sheet = wb.getSheetAt(0);
				// 判断是否是对于的excel表
				Row row2 = sheet.getRow(rows);
				Cell cellA2 = row2.getCell(0);
				//Excel的A2单元格包含“importData”，则为规定的模板
				if (!cellA2.getStringCellValue().equals("importData"))
					return rtn = "模板上传错误！请下载模板填写好数据再上传!";
				Row row = null;
				Cell cell = null;
				//int count = 0;
				//String text = "个单元格为必填写项，请填写完整,详情如下：</br>";
				//一个map为一行数据，map存放列名（excel中第二行隐藏的列名，列名和实体属性名对应）和值
				List<Map<String, String>> list = new ArrayList<Map<String,String>>();
				// 得到excel的总记录条数
				int totalRow = sheet.getLastRowNum();
				Row columnRow = null;// 列配置行，单元格的值与bean的属性对应
				for (int i = 0; i <= totalRow; i++) {
					if (i <= rows) {
						if (i == rows)	columnRow = sheet.getRow(i);
						continue;
					}else{
						row = sheet.getRow(i);
						Map<String, String> map = new HashMap<String, String>();
						for (int j = 0; j < columnRow.getPhysicalNumberOfCells(); j++) {
							cell = row.getCell(j);
							if (j==0){
								continue;
							}else{
								String cellValue = null;
								if (cell != null) {
									cell.setCellType(1);
									cellValue = cell.getStringCellValue();
								}
								//为null转为空字符串存放，避免后面对null进行toString()操作
								map.put(columnRow.getCell(j).getStringCellValue(),
										cellValue==null?"":cellValue);
							}
						}
						list.add(map);
					}
				}
//				if(count > 0){
//					return rtn = "{success:false,msg:[{result:'"+text+"'}]}";
//				}
				//RzglMgmFacade = new JjmisRzglMgmFacadeImpl();
				String text = rzglMgm.importData(beanName, list,pid);
				return text;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return rtn = "上传失败！";
		}
	}
	/**
	 * 考勤调整读取数据
	 * @param request
	 * @param response
	 */
	public void getKqAdjust(HttpServletRequest request,HttpServletResponse response) {
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			GridConnector gridConnector = new GridConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			String userid = request.getParameter("userid")==null?"":request.getParameter("userid");
			map.put("pid", request.getParameter("pid")==null?"":request.getParameter("pid"));
			map.put("userid", userid);
			rzglMainMgm.getKqAdjust(map, gridConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 考勤查询
	 * @param request
	 * @param response
	 */
	public void getKqhzQuery(HttpServletRequest request,HttpServletResponse response) {
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			GridConnector gridConnector = new GridConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			String powerLevel = request.getParameter("powerLevel")==null?"":request.getParameter("powerLevel");
			String userid = request.getParameter("userid");
			map.put("powerLevel", powerLevel);
			map.put("parameter", request.getParameter("parameter")==null?"":request.getParameter("parameter"));
			map.put("userid", userid);
			map.put("pid", request.getParameter("pid")==null?"":request.getParameter("pid"));
			map.put("str", request.getParameter("str")==null?"":request.getParameter("str"));
			rzglMainMgm.getKqhzQuery(map, gridConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 考勤统计查询
	 * @param request
	 * @param response
	 */
	public void getKqtj(HttpServletRequest request,HttpServletResponse response) {
		Connection conn = null;
		String powerLevel = request.getParameter("powerLevel")==null?"":request.getParameter("powerLevel");
		String filter = request.getParameter("filter")==null?"":request.getParameter("filter");
		try{
			conn = ConnectionMan.getConnection();
			GridConnector gridConnector = new GridConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			map.put("powerLevel", powerLevel);
			map.put("filter", filter);
			map.put("pid", request.getParameter("pid")==null?"":request.getParameter("pid"));
			map.put("str", request.getParameter("str")==null?"":request.getParameter("str"));
			rzglMainMgm.getKqtj(map, gridConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	/**
	 * 根据fileid下载APP_BLOB中的文档
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 * @author shuz 2014-04-28
	 */
	private void downloadAppBlob(HttpServletRequest request,
			HttpServletResponse response) throws IOException, ServletException {
		String fileid = request.getParameter("fileid");
		String pid = request.getParameter("pid");
		
		AppFileinfo file = (AppFileinfo) this.baseDAO.findById(
				AppFileinfo.class.getName(), fileid);
		String sql = "select FILEID from APP_BLOB where FILEID ='" + fileid + "'";
		List list = this.baseDAO.getData(sql);
		if (list != null && list.size() > 0) {
			// 存在，直接打开
			InputStream is = this.appMgm.getFileInputStream(file);
			outPutStream(response, is, file.getFilename());
		} 

	}
	public void outPutStream(HttpServletResponse response, InputStream is, String filename) throws IOException {
		response.setContentType("application/octet-stream");
		if (filename!=null && !filename.equals("")){
			filename = StringUtil.encodingFileName(filename);
			response.setHeader("Content-disposition", "attachment; filename=" + filename);
		}
		ServletOutputStream sop = response.getOutputStream();
		int len;
		byte[] buf = new byte[2048];
		while ((len = is.read(buf, 0, 2048)) != -1) {
			sop.write(buf, 0, len);
		}
		is.close();
		sop.close();
	}	
	//qiupy
	/**
	 * 获取
	 */
	public void getOnBusiness(HttpServletRequest request,HttpServletResponse response){
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			GridConnector gridConnector = new GridConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			map.put("params", request.getParameter("params")==null?"":request.getParameter("params"));
			map.put("dept", request.getParameter("dept")==null?"":request.getParameter("dept"));
			map.put("userName", request.getParameter("userName")==null?"":URLDecoder.decode(request.getParameter("userName"),"UTF-8"));
			rzglMainMgm.getOnBusiness(map, gridConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 
	* @Title: loadOnBusinessForm
	* @Description: 加载出差数据表单
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadOnBusinessForm(HttpServletRequest request,HttpServletResponse response){
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			FormConnector formConnector = new FormConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			map.put("uids", request.getParameter("id")==null?"":request.getParameter("id"));
			rzglMainMgm.loadOnBusinessForm(map, formConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 
	* @Title: loadUserComo
	* @Description: 加载用户下拉框数据
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadUserComo(HttpServletRequest request,HttpServletResponse response){
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			ComboConnector combo = new ComboConnector(conn, request, response);
			rzglMainMgm.loadUserComo(combo);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 
	* @Title: loadBillStateComo
	* @Description: 加载审批状态下拉框数据
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadBillStateComo(HttpServletRequest request,HttpServletResponse response){
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			ComboConnector combo = new ComboConnector(conn, request, response);
			rzglMainMgm.loadBillStateComo(combo);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	
	/**
	 * 
	* @Title: loadAskForLeaveTypeComo
	* @Description: 加载请假类型下拉框数据
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadAskForLeaveTypeComo(HttpServletRequest request,HttpServletResponse response){
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			ComboConnector combo = new ComboConnector(conn, request, response);
			rzglMainMgm.loadAskForLeaveTypeComo(combo);
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	
	/**
	 * 请假数据读取
	 */
	public void getAskForLeave(HttpServletRequest request,HttpServletResponse response){
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			GridConnector gridConnector = new GridConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			map.put("params", request.getParameter("params")==null?"":request.getParameter("params"));
			map.put("dept", request.getParameter("dept")==null?"":request.getParameter("dept"));
			map.put("userName", request.getParameter("userName")==null?"":URLDecoder.decode(request.getParameter("userName"),"UTF-8"));
			rzglMainMgm.getAskForLeave(map, gridConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 
	* @Title: loadAskForLeaveForm
	* @Description: 加载请假数据表单
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadAskForLeaveForm(HttpServletRequest request,HttpServletResponse response){
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			FormConnector formConnector = new FormConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			map.put("uids", request.getParameter("id")==null?"":request.getParameter("id"));
			rzglMainMgm.loadAskForLeaveForm(map, formConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	
	/**
	 * 加班数据读取
	 */
	public void getOvertime(HttpServletRequest request,HttpServletResponse response){
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			GridConnector gridConnector = new GridConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			map.put("params", request.getParameter("params")==null?"":request.getParameter("params"));
			map.put("dept", request.getParameter("dept")==null?"":request.getParameter("dept"));
			map.put("userName", request.getParameter("userName")==null?"":URLDecoder.decode(request.getParameter("userName"),"UTF-8"));
			rzglMainMgm.getOvertime(map, gridConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
	/**
	 * 
	* @Title: loadOvertimeForm
	* @Description: 加载加班数据表单
	* @param request
	* @param response   
	* @return void    
	* @throws
	* @author qiupy 2014-5-10
	 */
	public void loadOvertimeForm(HttpServletRequest request,HttpServletResponse response){
		Connection conn = null;
		try {
			conn = ConnectionMan.getConnection();
			FormConnector formConnector = new FormConnector(conn,request,response);
			Map<String, String> map = new HashMap<String, String>();
			map.put("uids", request.getParameter("id")==null?"":request.getParameter("id"));
			rzglMainMgm.loadOvertimeForm(map, formConnector);
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			if (conn != null) {
				try {
					conn.close();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
			}
		}
	}
}
