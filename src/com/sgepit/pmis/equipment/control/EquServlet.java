package com.sgepit.pmis.equipment.control;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
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
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.jspsmart.upload.SmartUpload;
import com.jspsmart.upload.SmartUploadException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.ExcelExportByTemplate;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.equipment.hbm.EquGoodsBodys;
import com.sgepit.pmis.equipment.service.EquMgmFacade;

public class EquServlet extends MainServlet{

	private static final Log log = LogFactory.getLog(EquServlet.class);
	private WebApplicationContext wac;
	private EquMgmFacade equMgmFacade;
	private ServletConfig servletConfig;
	private BaseDAO baseDao;
	public EquServlet() {
		super();
	}
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
		this.equMgmFacade = (EquMgmFacade) this.wac.getBean("equMgm");
		baseDao = (BaseDAO)wac.getBean("systemDao");
		servletConfig=config;
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
			if(method.equals("getJsonEquTrans")){
				FileTrans(request,response);
			}
			if(method.equals("importData")){
				try {
					importData(request, response);
				} catch (FileUploadException e) {
					e.printStackTrace();
				}
			}
			if(method.equalsIgnoreCase("saveDoc")){
	            try {
					saveDoc(request, response);
				} catch (Exception e) {
					e.printStackTrace();
				}
	            return;
	        }
			//物资编码，审核日期双排序的查询	pengy 2013-09-10
			if(method.equals("equGoodsTz")){
				String beanName = request.getParameter("bean");
				String params = request.getParameter("params");
				String orderby2 = request.getParameter("orderby");
				String sort = request.getParameter("sort");
				String dir = request.getParameter("dir");
				Integer start = (request.getParameter("start") != null) ? 
				Integer.valueOf(request.getParameter("start")) : null;
				Integer limit = (request.getParameter("limit") != null) ? 
				Integer.valueOf(request.getParameter("limit")) : null;
				String orderby = ((sort != null) && (dir != null)) ? sort + " " + dir : null;
				orderby = orderby2 != null ? orderby2 + "," + orderby : orderby;
				List list = this.equMgmFacade.findWzOrderBy(beanName, params, orderby, start, limit);
				outputString(response, makeJsonDataForGrid(list));
			}
			if(method.equals("exportTzData")){
				try {
					exportTzData(request, response);
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
	private void saveDoc(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String uploadTempFolder = Constant.AppRootDir
				.concat(Constant.TEMPFOLDER);
		SmartUpload mySmartUpload;
		String filename = "";
		StringBuilder msg = null;
		com.jspsmart.upload.File myFile = null;
		int i = 0;
		mySmartUpload = new SmartUpload();
		mySmartUpload.initialize(servletConfig, request, response);
		try {
			mySmartUpload.upload();
		} catch (SmartUploadException e) {
			e.printStackTrace();
		}
		while (i < mySmartUpload.getFiles().getCount()) {
			int file_size;
			java.io.File file;
			myFile = mySmartUpload.getFiles().getFile(i++);
			System.out.println((new StringBuilder("File=")).append(
					myFile.getFileName()).toString());
			if (myFile.isMissing())
				continue;
			filename = myFile.getFileName();
			file_size = myFile.getSize();
			file = new java.io.File(uploadTempFolder.concat("/") + filename);
			try {
				myFile.saveAs(file.getAbsolutePath(), 2);
			} catch (SmartUploadException e) {
				e.printStackTrace();
			}
			String uids = mySmartUpload.getRequest().getParameter("uids");
			String beanname = mySmartUpload.getRequest().getParameter("beanname");
			String fileid = mySmartUpload.getRequest().getParameter("fileid");
			String hasfile = mySmartUpload.getRequest().getParameter("hasfile");
			//由于设备退库模块，一条数据两个文档，故添加一个参数，params，使用逗号分号分割其中参数，以后不用再新增参数 pengy 2014-11-19
			String params = mySmartUpload.getRequest().getParameter("params");
			String[] fileFields = params.split(";")[0].split(",");
			String fileField = "fileid";
			if (fileFields.length>1){
				fileField = fileFields[1];
			}
			Boolean isNew = true;
			
			//第一次保存后传过来的fileid为模板的fileid
			AppFileinfo obj = fileid == null ? null : (AppFileinfo) this.baseDao
					.findById(AppFileinfo.class.getName(), fileid);
			if(hasfile.equals("true")){
				//hasfile为true:表示主记录中fileid没有值，附件直接使用模板，由模板保存新附件，updateBlob中进行新增文档
				isNew = false;
			}else{
				//hasfile为true:表示主记录中fileid有值，附件已经生成过，保存直接更新当前附件，updateBlob中进行更新文档
				//fileid = UUID.randomUUID().toString().replace("-", "");
				String compressed = "zip,rar,gz".indexOf(filename.substring(
						filename.lastIndexOf(".") + 1).toLowerCase()) > -1 ? "1" : "0";
				AppFileinfo fileinfo = new AppFileinfo(filename,
						Constant.FILESOURCE, myFile.getContentType(), compressed,
						DateUtil.getSystemDateTime(), Long.parseLong(file_size+""),"");
				fileid = this.baseDao.insert(fileinfo); 
			}
			try {
				this.baseDao.updateBlob(fileid, new FileInputStream(file),	file_size, isNew);
			} catch (SQLException e) {
				e.printStackTrace();
				msg = new StringBuilder();
				msg.append("文件另存为失败！<br>");
				msg.append("错误原因：");
				msg.append((new StringBuilder("&nbsp;&nbsp;")).append(e.getMessage()).toString());
			}
			//更新业务数据主记录中的fileid
			try {
				this.baseDao.executeHQL("update "+beanname+" set " + fileField + "='"+fileid+"' where uids='"+uids+"'");
			} catch (Exception e) {
				//beanname中主键不为uids则通过uuid进行更新
				System.out.println("beanname="+beanname+",主键不为uids则通过uuid进行更新");
				this.baseDao.executeHQL("update "+beanname+" set " + fileField + "='"+fileid+"' where uuid='"+uids+"'");
			}
			msg = new StringBuilder();
			msg.append("保存成功！ ");
			msg.append((new StringBuilder("在线编辑的文件: 《")).append(filename)
					.append("》  ").toString());
			msg.append((new StringBuilder("大小: ")).append(file_size)
					.append(" bytes").toString());
			file.delete();
		}
		if (msg != null) {
			response.setCharacterEncoding("GB2312");
			PrintWriter pw = response.getWriter();
			pw.print(msg.toString());
			pw.flush();
			pw.close();
		}
		return;
	}
	/**
	 * 导出设备入库（出库）单明细
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String pid = request.getParameter("pid")==null ? "" : request.getParameter("pid");
		//品名
		String pm = request.getParameter("pm")==null ? "" : request.getParameter("pm");
		//Excel模板标识符
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		InputStream templateIn = this.equMgmFacade.getExcelTemplate(businessType);
		//过来条件 yanglh 2013-10-31
		String whereS = request.getParameter("uidS")==null ? "" : request.getParameter("uidS");
		whereS=java.net.URLDecoder.decode(whereS , "UTF-8"); 
		//查询条件
		StringBuffer conditionAll = new StringBuffer();
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			map1.put("businessType", businessType);
			if(!whereS.equals("")){
				map1.put("uidsS",whereS);
			}else{
				map1.put("uidsS","");
			}
			if(businessType.equalsIgnoreCase("wztzList")){//物资台账
				map1.put("pm", pm);
				conditionAll.append(pm.equals("") ? pm : "_" + pm);
			}else if(businessType.startsWith("wztz")){
				//物资台账编码
				String bm = request.getParameter("bm")==null ? "" : request.getParameter("bm");
				//申请台账：申请部门；采购台账：稽核员；入库台帐：经手人；出库台账：领用人
				String condition2 = request.getParameter("condition2")==null ? "" : request.getParameter("condition2");
				//开始时间
				String begin = request.getParameter("begin")==null ? "11110101" : request.getParameter("begin");
				//结束时间
				String end = request.getParameter("end")==null ? "21000101" : request.getParameter("end");
				
				map1.put("bm", bm);
				map1.put("pm", pm);
				map1.put("condition2", condition2);
				map1.put("begin",begin);
				map1.put("end",end);
				
				if(!pm.equals("")){
					conditionAll.append("_" + pm);
				}
				if(!condition2.equals("")){
					conditionAll.append("_" + condition2);
				}
				if(!begin.equals("11110101")){
					conditionAll.append("_" + begin);
				}
				if(!end.equals("21000101")){
					conditionAll.append("_" + end);
				}
			}else if(businessType.equalsIgnoreCase("StockOutList")){
				//选择的合同树节点
				String contreeid = request.getParameter("contreeid")==null?"" : request.getParameter("contreeid");
				map1.put("pid",pid);
				map1.put("contreeid",contreeid);
				conditionAll.append("_" + pid);
			}else{
				map1.put("pid", pid);
				conditionAll.append("_" + pid);
			}
			ExcelExportByTemplate excelExport = new ExcelExportByTemplate(templateIn, map1);
			ByteArrayOutputStream outStream = excelExport.fillDataToExcel();
			
			response.setContentType("application/octet-stream");
			//接受到的中文要转码
			response.setHeader("Content-Disposition", "attachment; filename=" + businessType +  new String(conditionAll.toString().getBytes("gb2312"),"ISO8859-1") + ".xls");
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
			out.println("提示 : 请先在【系统管理】->【office模板】中维护相关模板，模板标识符号为"+businessType+"。");
			out.println("  </BODY>");
			out.println("</HTML>");
			out.flush();
			out.close();
			System.out.println("没有相关的模板信息！");
		}
	}
	
	/**
	 * @param request
	 * @param response
	 * 
	 */
	private void FileTrans(HttpServletRequest request, HttpServletResponse response) {
		// TODO Auto-generated method stub
		String fileId = request.getParameter("fileId").toString();
		String fileTypes = "zlMaterial";
		String yjrName = request.getParameter("yjrName").toString();
		String type = request.getParameter("type")==null?"":request.getParameter("type").toString();
		String conid = request.getParameter("conid")==null?"":request.getParameter("conid").toString();
		String jsonStr = this.equMgmFacade.getJsonStrForTransToZLSByType(type,fileId, fileTypes, yjrName,conid);
		try {
			super.outputStr(response, jsonStr);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	/**
	 * excel数据导入
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws FileUploadException
	 * @author zhangh 2013-5-21
	 */
	private void importData(HttpServletRequest request, HttpServletResponse response) throws IOException, FileUploadException {
		String pid = request.getParameter("pid") == null ? "" : request.getParameter("pid");
		String uids = request.getParameter("uids") == null ? "" : request.getParameter("uids");
		String bean = request.getParameter("bean") == null ? "" : request.getParameter("bean");
		
		String selectUuid = request.getParameter("selectUuid") == null ? "" : request.getParameter("selectUuid");
		String selectConid = request.getParameter("selectConid") == null ? "" : request.getParameter("selectConid");
		String userDept = request.getParameter("userDept") == null ? "" : request.getParameter("userDept");

		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html; charset=utf-8");
		PrintWriter out = response.getWriter();
		String upLoad = Constant.AppRootDir.concat(java.io.File.separator).concat(Constant.TEMPFOLDER);
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// 缓冲区大小
		factory.setSizeThreshold(4096);
		// 临时文件目录
		File tempFolder = new File(upLoad);
		if (!tempFolder.exists()) {
			tempFolder.createNewFile();
		}
		factory.setRepository(tempFolder);
		ServletFileUpload upload = new ServletFileUpload(factory);
		upload.setHeaderEncoding(Constant.ENCODING);
		List<FileItem> fileItemList = upload.parseRequest(request);
		String message = "";
		if (fileItemList.size() > 0) {
			for (FileItem fileItem : fileItemList) {
				if (!fileItem.isFormField()) {
					if(bean.equals(EquGoodsBodys.class.getName())){//主体设备导入
						message = this.equMgmFacade.importBodyData(pid, selectUuid,selectConid,userDept,bean, fileItem);
					}else{
						message = this.equMgmFacade.importData(pid, uids, bean, fileItem);
						//System.out.println(">>>>>>" + message);
					}
					
				}
			}
		}
		out.print(message);
		out.flush();
		out.close();
	}

	/**
	 * 导出物资出入库台账
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportTzData(HttpServletRequest request, HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String type = request.getParameter("type")==null ? "" : request.getParameter("type");
		String exportFilter = request.getParameter("exportFilter")==null ? "" : request.getParameter("exportFilter");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		InputStream templateIn = this.equMgmFacade.getExcelTemplate(businessType);
		
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			map1.put("type", type);
			map1.put("exportFilter", exportFilter);
			//map1.put("masterId", masterId);
			map1.put("businessType", businessType);
			//通用导出无法处理数据，此处要处理一组物资，只有第一条有期初，最后一条有结存
//			ExcelExportByTemplate excelExport = new ExcelExportByTemplate(templateIn, map1);
//			ByteArrayOutputStream outStream = excelExport.fillDataToExcel();
			Workbook wb = new HSSFWorkbook(templateIn);
			ByteArrayOutputStream outStream = null;
			String filename = businessType;
			if ("ExportEquGoodsTz".equals(businessType)){
				outStream = this.equMgmFacade.fillDataToEquGoodsTzExcel(wb, map1);
				filename = new String("设备物资台账".getBytes("gb2312"),"ISO8859-1");
			} else if ("ExportMonthTotalTz".equals(businessType)){
				outStream = this.equMgmFacade.fillDataToMonthTotalTzExcel(wb, map1);
				filename = new String("库存物资月度汇总表".getBytes("gb2312"),"ISO8859-1");
			}
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment; filename=" + filename + ".xls");
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