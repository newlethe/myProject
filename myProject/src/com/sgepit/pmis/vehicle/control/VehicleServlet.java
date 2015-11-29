package com.sgepit.pmis.vehicle.control;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.SQLException;
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
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.webdynproService.export.ExcelPortException;
import com.sgepit.pmis.vehicle.service.VehicleMgmFacade;

public class VehicleServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(VehicleServlet.class);
	private WebApplicationContext wac;
	private VehicleMgmFacade vehicleMgmFacade;
	private BaseDAO baseDao;
	/**
	 * Constructor of the object.
	 */
	public VehicleServlet() {
		super();
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
			if(method.equals("printData")){
				try {
					printData(request, response);
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
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException if an error occurs
	 */
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
		this.vehicleMgmFacade = (VehicleMgmFacade) this.wac.getBean("vehicleMgm");
		this.baseDao = (BaseDAO)this.wac.getBean("baseDAO");
	}
	public void printData(HttpServletRequest request,	HttpServletResponse response) throws IOException, ExcelPortException, DbPropertyException, SQLException{
		String businessType = request.getParameter("fileid")==null ? "" : request.getParameter("fileid");
		InputStream templateIn = this.vehicleMgmFacade.getExcelTemplate(businessType);
		if (templateIn!=null) {
			OutputStream os = response.getOutputStream();
		      byte[] buf = new byte[8096];
		      for (int bytes = 0; (bytes = templateIn.read(buf, 0, 8096)) != -1; ) {
		        os.write(buf, 0, bytes);
		      }
		      os.flush();
		      os.close();
		      templateIn.close();
		} else {
			System.out.println("没有相关的模板信息！");
		}
	}
}
