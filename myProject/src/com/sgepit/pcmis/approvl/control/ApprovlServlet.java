package com.sgepit.pcmis.approvl.control;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.SocketException;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPInputStream;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.excelService.ExcelExportByTemplate;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.contract.service.ConOveMgmFacade;

public class ApprovlServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(ApprovlServlet.class);
	private WebApplicationContext wac;
	private ConOveMgmFacade conOveMgmFacade;
	/**
	 * Constructor of the object.
	 */
	public ApprovlServlet() {
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
			
			if(method.equals("downloadApprovls")){
					try {
						downloadApprovls(request, response);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
			}
		}
		}

	/**
	 * 导出批文办理信息表
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ExcelPortException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public void exportData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String level = request.getParameter("level")==null ? "" : request.getParameter("level");
		String unitId = request.getParameter("unitId")==null ? "" : request.getParameter("unitId");
		String businessType = request.getParameter("businessType")==null ? "" : request.getParameter("businessType");
		String projName = request.getParameter("projName")==null ? "" : request.getParameter("projName");
		String type = request.getParameter("type")==null ? "" : request.getParameter("type");
		InputStream templateIn = this.conOveMgmFacade.getExcelTemplate(businessType);
		
		StringBuffer filter = new StringBuffer();
		
		//过滤器添加单位参数,

		if(!unitId.startsWith("Q"))
		{
			SystemMgmFacade sys = (SystemMgmFacade) Constant.wact.getBean("systemMgm");
			SgccIniUnit unitHbm = sys.getUnitById(unitId);
			if(unitHbm.getUnitTypeId().equals("0"))  //集团公司
			{
				//do nothing	
				filter.append("prj_name like '%"+projName+"%'");
			}
			else if(unitHbm.getUnitTypeId().equals("2"))  //集团二级公司
			{
				filter.append("unit2id='"+unitId+"' and prj_name like '%"+projName+"%'"); 
			}
			else if(unitHbm.getUnitTypeId().equals("3"))  //集团三级公司
			{
				//针对前期项目批文维护有很多三级公司下建立三级公司的情况, 如果选择的是父三级公司, 必须找到所有的子三级公司
				StringBuffer buffer = new StringBuffer(); 
				String sql = "select unitid from sgcc_ini_unit where unit_type_id='3' " +
						"connect by prior unitid=upunit start with unitid='" + unitId + "'";
				BaseDAO baseDAO = (BaseDAO) this.wac.getBean("baseDAO");
				List<String> list = baseDAO.getDataAutoCloseSes(sql);
				if(list.isEmpty())
				{	
					buffer.append("'" + unitId + "'");
				}
				else
				{
					for(Iterator itor = list.iterator(); itor.hasNext();)
					{
						buffer.append("'"+itor.next().toString()+"',");
					}
				}
				buffer.deleteCharAt(buffer.length()-1);
				filter.append("unit3id in("+buffer.toString()+") and prj_name like '%"+projName+"%'"); 
			}
			else                                       //正式项目单位
			{   
				filter.append("pid='"+unitId+"' and prj_name like '%"+projName+"%'"); 
			}	
		}
		else                                             //前期项目单位
		{
			filter.append("pid='"+unitId+"' and prj_name like '%"+projName+"%'");
		}
		
		//添加项目类型
		if(!type.equals(""))
		{
			filter.append(" and prj_type in ('"+type.replace(",", "','")+"')");
		}
		//添加项目级别
		if(!level.equals(""))
		{
			filter.append(" and backup_c1 in ('"+level.replace(",", "','")+"')");
		}
		
		if (templateIn!=null) {
			Map<String, String> map1 = new HashMap<String, String>();
			map1.put("filter",filter.toString());
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
	 * 批量下载批文附件
	 * @param request
	 * @param response
	 * @throws Exception 
	 * @throws SQLException306
	 * 
	 */
	@SuppressWarnings("unchecked")
	public void downloadApprovls(HttpServletRequest request, HttpServletResponse response)throws Exception{
		String uidsStr = request.getParameter("selectedUids")==null?"":request.getParameter("selectedUids");
		String transactionType = request.getParameter("bussinessType")==null?"":request.getParameter("bussinessType");
		String whereSQL = "transaction_type='"+transactionType+"' and transaction_id in"+uidsStr;
		BaseDAO baseDAO = (BaseDAO) this.wac.getBean("baseDAO");
		List<SgccAttachList> attachList = baseDAO.findByWhere(SgccAttachList.class.getName(), whereSQL);
		if(attachList.isEmpty()) //为空的情况通过前台给用户提示
		{
				//do nothing
		}
		else
		{
			fileDownload(response,attachList);
		}
	}
    
    public void fileDownload(HttpServletResponse response, List<SgccAttachList> attachList) throws Exception
   {
    String targetFileName = "项目批文附件.zip";  //定义下载文件名称
    OutputStream out = response.getOutputStream();   //获得输出流
    ZipOutputStream zos = new ZipOutputStream(out);  //生成Zip格式输出流
    response.setContentType("application/octet-stream");
	response.setHeader("Content-Disposition", "attachment; filename=" + new String(targetFileName.getBytes("GB2312"), "ISO8859-1"));

    Context initCtx = null;
    DataSource ds = null;
    Connection conn = null;
    Statement stmt = null;
    ResultSet rs = null;
    try
    {
	    initCtx = new InitialContext();
	    ds = (DataSource)JNDIUtil.lookup(initCtx);
	    conn = ds.getConnection();
	    stmt = conn.createStatement();
	    
		for(int i=0; i<attachList.size(); i++)
	   	{	
		    String compress = attachList.get(i).getIsCompress() == null ? "1" : attachList.get(i).getIsCompress();
		    String fileName = attachList.get(i).getFileName() == null ? "未命名" : attachList.get(i).getFileName().trim();
		    String fileLsh = attachList.get(i).getFileLsh()==null?"":(String)attachList.get(i).getFileLsh();
		    String sql = "select FILE_NR from sgcc_attach_blob where file_lsh='"+fileLsh+"'" ;
		    
		    rs = stmt.executeQuery(sql);
		    if (rs.next()) 
		    {
			      InputStream ins = null;
			      Blob blob = rs.getBlob(1);
			      if (compress.equals("1")) 
			      {	
			    	    ins = blob.getBinaryStream();
			            byte[] buffer = new byte[1024];
			            int offset = -1;
			            ZipEntry entry = new ZipEntry(fileName);
			            zos.putNextEntry(entry);
			            GZIPInputStream zin = new GZIPInputStream(ins);
			            while ((offset = zin.read(buffer)) != -1) 
			            {
			            	zos.write(buffer, 0, offset);
			            }
			            zos.closeEntry();
			            zin.close();
			      }//eof compress.equals
			      else 
			      {
		              try 
		              {
		                out.write(blob.getBytes(1L, (int)blob.length()));
		              } catch (SocketException e) {
		                System.out.println("FileDownLoad Error::::::");
		                e.printStackTrace();
		              }
			      }
		    }//eof rs.next()
		    else
		    {
		    	response.sendError(404);
		    }
    }  //eof if(attachList.isEmpty())
    }catch(Exception e){
    	e.printStackTrace();
    }finally{
        zos.close();
        out.close();
    }
  } //eof downLoadApprovls class
}
