package com.sgepit.pcmis.aqgk.control;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

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
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.dhtmlx.connector.ComboConnector;
import com.dhtmlx.connector.ConnectorBehavior;
import com.dhtmlx.connector.DataAction;
import com.dhtmlx.connector.DataItem;
import com.dhtmlx.connector.GridConnector;
import com.dhtmlx.connector.SortingRule;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.ConnectionMan;
import com.sgepit.frame.util.DhxUtil;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.ExcelExportByTemplate;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.contract.service.ConOveMgmFacade;

public class AqgkServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(AqgkServlet.class);
	private WebApplicationContext wac;
	private ConOveMgmFacade conOveMgmFacade;
	private BaseDAO baseDao;
	/**
	 * Constructor of the object.
	 */
	public AqgkServlet() {
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
				else if(method.equals("importData")){
					importData(request, response);
				}
				else if("loadDhxData".equals(method)){
					loadDhxData(request, response);
				}
				else if("getCodeValue".equals(method)){
					getCodeValue(request, response);
				}
				
			}
		}
	
	/**
	 * 根据属性类型名称获取属性下拉框数据
	 * 
	 * @param req
	 * @param res
	 */
	public void getCodeValue(HttpServletRequest req,
			HttpServletResponse res) {
		Connection conn = ConnectionMan.getConnection();
	try {
		req.setCharacterEncoding("UTF-8");
		String typeName = req.getParameter("typeName");
		String all = req.getParameter("all");
		ComboConnector combo = new ComboConnector(conn, req, res);
		String sql = "select property_code,property_name,item_id from " +
				"property_code where type_name=(SELECT t.uids FROM " +
				"property_type t WHERE t.type_name = '"+typeName+"') ";
		if (all != null) {
			if (all.equals(""))
				all = "ALL";
			sql += "union all select '" + all + "','所有',-1 from dual";
		}
		class getCodeValueBehavior extends ConnectorBehavior{
			@Override
			public void beforeSort(ArrayList<SortingRule> sorters) {
				SortingRule sr = new SortingRule("item_id", "asc");
				sorters.add(sr);
			}
		}
		combo.event.attach(new getCodeValueBehavior());
		combo.render_sql(sql, "property_code", "property_name");
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	}
	
	
	public void loadDhxData(HttpServletRequest request,
			HttpServletResponse response) {
		Connection conn = ConnectionMan.getConnection();
		String pid = request.getParameter("pid") == null ? "" : request.getParameter("pid");
		String safeType = request.getParameter("safeType") == null ? "" : request.getParameter("safeType");
		String unitid = request.getParameter("unitid") == null ? "" : request.getParameter("unitid");
		
		String month = request.getParameter("month") == null ? "" : request.getParameter("month");
		String yhxz = request.getParameter("yhxz") == null ? "" : request.getParameter("yhxz");
		String zgdw = request.getParameter("zgdw") == null ? "" : request.getParameter("zgdw");
		String ysqk = request.getParameter("ysqk") == null ? "" : request.getParameter("ysqk");
		try {
			String columnList = "UIDS,PID,ADDTYPE,BH,YHNR,YHMS,YHXZ,ZGDW,LRR,LRSJ";
				columnList += ",ZGR,ZGWCSJ,ZGSM,ZGMS,YSR,YSSJ,YSQK,BZ";
			
			String sql = "select * from PC_AQGK_SAFETY_CHANGE where pid = '"+pid+"'";
			if("send".equals(safeType)){
				sql += " and ADDTYPE = '1'";
			}
			if(!"".equals(month) && !"ALL".equalsIgnoreCase(month) && !"null".equalsIgnoreCase(month)){
				sql += " and TO_CHAR(LRSJ,'YYYYMM') = '"+month+"'";
			}
			if(!"".equals(yhxz)  && !"ALL".equalsIgnoreCase(yhxz) && !"null".equalsIgnoreCase(yhxz)){
				sql += " and YHXZ = '"+yhxz+"'";
			}
			if(!"".equals(zgdw)  && !"ALL".equalsIgnoreCase(zgdw) && !"null".equalsIgnoreCase(zgdw)){
				sql += " and ZGDW = '"+zgdw+"'";
			}
			if(!"".equals(ysqk)  && !"ALL".equalsIgnoreCase(ysqk) && !"null".equalsIgnoreCase(ysqk)){
				sql += " and YSQK = '"+ysqk+"'";
			}
			if(!"".equals(unitid)){
				sql += " and ZGDW = '"+unitid+"'";
			}
			GridConnector gc = new GridConnector(conn, request, response);
			class pcAqgkSafetyChangeBehavior extends ConnectorBehavior{
				@Override
				public void beforeRender(DataItem data) {
					DhxUtil.transConnectorQueryDateTime(data, "LRSJ", "yyyy-MM-dd HH:mm");
					DhxUtil.transConnectorQueryDateTime(data, "ZGWCSJ", "yyyy-MM-dd HH:mm");
					DhxUtil.transConnectorQueryDateTime(data, "YSSJ", "yyyy-MM-dd HH:mm");
					
					String uids = data.get_id();
					String ysqk = data.get_value("YSQK");
					
					String sql1 = "select t.transaction_id  from sgcc_attach_list t where t.transaction_id='"+uids+"' and t.transaction_type = 'AQGK_YHMS'";
					List list1 = baseDao.getData(sql1);
					String fileStr_YHMS = DhxUtil.renderLinkValue("查看[<span id='YHMS"+uids+"'>"+list1.size()+"</span>]", "showFileWin", uids, "AQGK_YHMS",ysqk);
					data.set_value("YHMS", fileStr_YHMS);
					
					String sql2 = "select t.transaction_id  from sgcc_attach_list t where t.transaction_id='"+uids+"' and t.transaction_type = 'AQGK_ZGMS'";
					List list2 = baseDao.getData(sql2);
					String fileStr_ZGMS = DhxUtil.renderLinkValue("查看[<span id='ZGMS"+uids+"'>"+list2.size()+"</span>]", "showFileWin", uids, "AQGK_ZGMS",ysqk);
					data.set_value("ZGMS", fileStr_ZGMS);
				}
				
				@Override
				public void beforeUpdate(DataAction action) {
					DhxUtil.transConnectorModifyDateTime(action, "LRSJ",null,null,"datetime");
					DhxUtil.transConnectorModifyDateTime(action, "ZGWCSJ",null,null,"datetime");
					DhxUtil.transConnectorModifyDateTime(action, "YSSJ",null,null,"datetime");
				}
			
				@Override
				public void beforeSort(ArrayList<SortingRule> sorters){
					SortingRule sr = new SortingRule("LRSJ", "DESC");
					sorters.add(sr);
				}

				@Override
				public void beforeInsert(DataAction action) {
					DhxUtil.transConnectorModifyDateTime(action, "LRSJ",null,null,"datetime");
					DhxUtil.transConnectorModifyDateTime(action, "ZGWCSJ",null,null,"datetime");
					DhxUtil.transConnectorModifyDateTime(action, "YSSJ",null,null,"datetime");
				}

				
				
				@Override
				public void beforeDelete(DataAction action) {
					String uids = action.get_id();
					List<SgccAttachList> attachList = baseDao.findByWhere(SgccAttachList.class.getName(), "transaction_id = '"+uids+"'");
					for (int i = 0; i < attachList.size(); i++) {
						String deleteSql = "delete from SGCC_ATTACH_BLOB where FILE_LSH='"
								+ attachList.get(i).getFileLsh() + "'";
						JdbcUtil.execute(deleteSql);
					}
					baseDao.deleteAll(attachList);
				}
			}
			gc.event.attach(new pcAqgkSafetyChangeBehavior());
			
			gc.set_options("YHXZ", DhxUtil.getOptionsMap("property_code", 
					"property_name", "property_code", 
					"type_name=(SELECT t.uids FROM property_type t WHERE t.type_name = '隐患性质')"));
			gc.set_options("ZGDW", DhxUtil.getOptionsMap("property_code", 
					"property_name", "property_code", 
					"type_name=(SELECT t.uids FROM property_type t WHERE t.type_name = '整改单位')"));
			gc.set_options("YSQK", DhxUtil.getOptionsMap("property_code", 
					"property_name", "property_code", 
					"type_name=(SELECT t.uids FROM property_type t WHERE t.type_name = '验收情况')"));
			
			
			if (gc.is_select_mode()) {
				gc.render_sql(sql, "UIDS",columnList);
			} else {
				gc.render_table("PC_AQGK_SAFETY_CHANGE", "UIDS",columnList);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 导出安全隐患信息表
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String pid = request.getParameter("pid")==null ? "" : request.getParameter("pid");
		String state = request.getParameter("state")==null ? "" : request.getParameter("state");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		String batUids = request.getParameter("batUids")==null ? "" : request.getParameter("batUids");
		
		//当前框架不支持分页打印, 暂不考虑分页情况的以下两参数
		String start = request.getParameter("start")==null ? "" : request.getParameter("start");
		String limit = request.getParameter("limit")==null ? "" : request.getParameter("limit");
		
		StringBuffer filter = new StringBuffer();
		filter.append("pid='"+pid+"'");
		if(state.equals("0")||state.equals("1")||state.equals("2"))
		{
			filter.append(" and state='"+state+"'");
		}
		if(!batUids.equals(""))
		{
			filter.append(" and bat_uids='"+batUids+"'");
		}
		
		//生成excle文档名称
		String fileName = createFileName(pid, batUids);
		InputStream templateIn = this.conOveMgmFacade.getExcelTemplate(businessType);
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			map1.put("filter",filter.toString());
			ExcelExportByTemplate excelExport = new ExcelExportByTemplate(templateIn, map1);
			ByteArrayOutputStream outStream = excelExport.fillDataToExcel();
			response.setContentType("application/octet-stream");
			response.setCharacterEncoding("utf-8");
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName + ".xls");
			OutputStream out = response.getOutputStream();
			out.write(outStream.toByteArray());
			
			out.flush();
			out.close();
		} else {
			System.out.println("没有相关的模板信息！");
		}
	}
	
	/**
	 * 根据某个项目单位编号, 生成导出安全隐患excel文件名称
	 * @param pid 项目编号
	 * @param batUids 检查批次主键
	 * @return
	 * @throws UnsupportedEncodingException 
	 */
	public String createFileName(String pid, String batUids) throws UnsupportedEncodingException
	{
		SystemMgmFacade sys = (SystemMgmFacade) Constant.wact.getBean("systemMgm");
		
		String sql = "select jypc from pc_aqgk_inspection_bat_info where uids='"+batUids+"'";
		String batName =  (String)this.baseDao.getDataAutoCloseSes(sql).get(0);
		SgccIniUnit unitBean  = sys.getUnitById(pid);
		
		//获得检验批次名称
		
		GregorianCalendar now = new GregorianCalendar();
		String attachDate = now.get(Calendar.YEAR) + "-" +
							(now.get(Calendar.MONTH)+1) + "-" +
							(now.get(Calendar.DAY_OF_MONTH));
		if(unitBean==null)
			return attachDate;
		else
			return new String((unitBean.getUnitname()+ batName).getBytes("gb2312"),"iso8859-1") + attachDate;
	}
	
	public void importData(HttpServletRequest request,	HttpServletResponse response) throws IOException
	{
		String pid = request.getParameter("pid")==null ? "" : request.getParameter("pid");
		String batUids = request.getParameter("batUids")==null ? "" : request.getParameter("batUids");
		Boolean bool = false;
		StringBuilder rtn = new StringBuilder();
		
		PreparedStatement  pst = null;
		Connection conn = null;
		
		try {
			//数据库相关资源
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			conn = ds.getConnection();  
			
			//当前日期, 作为sql语句的一个属性值
			GregorianCalendar now = new GregorianCalendar();
			Date curDate = new Date(now.getTimeInMillis());
			
			String uploadTempFolder = Constant.AppRootDir.concat(java.io.File.separator).concat(Constant.TEMPFOLDER);
			DiskFileItemFactory factory = new DiskFileItemFactory();
			// 缓冲区大小
			factory.setSizeThreshold(4096);
			// 临时文件目录
			File tempFolder = new File(uploadTempFolder);
			if (!tempFolder.exists()) {
				tempFolder.createNewFile();
			}
			factory.setRepository(tempFolder);
			ServletFileUpload upload = new ServletFileUpload(factory);
			// 编码
			upload.setHeaderEncoding(Constant.ENCODING);

			List<FileItem> fileItemList = upload.parseRequest(request);
			if(fileItemList.size() > 0){
				for (FileItem fileItem : fileItemList) {
					if(!fileItem.isFormField()){
						try {
							Workbook wb = null;
					        try {
					        	//导入*.xls文件
					        	InputStream is = fileItem.getInputStream();
					        	wb = new HSSFWorkbook(is);
					        	is.close();
					        } catch (Exception ex) {
					        	//导入*.xlsx文件
					        	InputStream is = fileItem.getInputStream();
					        	//FileInputStream fis = new FileInputStream(fileItem.getName());
					        	wb = new XSSFWorkbook(is);
					        	is.close();
					        }
							if (wb == null){
								bool = false;
							} else {
								Sheet sheet = wb.getSheetAt(0);
								Row row = null;//对应excel的行
								Cell cell = null;//对应excel的列
								   
								String sql = "insert into PC_AQGK_HIDDENDANGER_INFO(UIDS,PID,BAT_UIDS,YHBH," +
								    			 "YHNR,GXSJ,STATE,OVER_DATE,MEMO)" +"values(?,?,?,?,?,?,?,?,?)"; 
								int totalRow=sheet.getLastRowNum();//得到excel的总记录条数
								for(int i=1;i<=totalRow;i++)
								{
									row = sheet.getRow(i);
									
									String yhbh = "";
									cell = row.getCell(0);
									if(cell != null)
									{
										cell.setCellType(1);            //单元给类型0代表数字，1代表文本
										yhbh = cell.getRichStringCellValue().toString();
									}
									
									String yhnr = "";
									cell = row.getCell(1);
									if(cell != null)
									{
										cell.setCellType(1);            //单元给类型0代表数字，1代表文本
										yhnr = (cell==null ? "" : cell.getRichStringCellValue().toString());
									}
									
									if(yhbh.equals("") && yhnr.equals(""))
										continue;
									
									pst = conn.prepareStatement(sql);
									pst.setString(1,SnUtil.getNewID());
									pst.setString(2,pid);
									pst.setString(3,batUids);
									pst.setString(4,yhbh);
									pst.setString(5,yhnr);
									pst.setDate(6, curDate);
									pst.setLong(7, new Long(0));	    
									pst.setDate(8, null);
									pst.setString(9, null);
									pst.execute();
								}
								bool = true;
							}
						} catch (IOException e) {
							e.printStackTrace();
						} catch (SQLException e) {
							e.printStackTrace();
						}
					}
				}
			}
		} catch (FileUploadException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (NamingException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally{
			if (bool) {
				rtn.insert(0, "{success:true,msg:[");
				rtn.append("{result:'OK'}");
				rtn.append("]}");
			} else {
				rtn.insert(0, "{success:false,msg:[");
				rtn.append("{result:'ERR'}");
				rtn.append("]}");
			}
			response.setContentType("text/html;charset=UTF-8");
			PrintWriter outP = response.getWriter();
			outP.print(rtn);
			outP.flush();
			outP.close();
		}
	}
}


