package com.sgepit.portal;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.sysman.dao.SgccAttachListDAO;
import com.sgepit.frame.sysman.dao.SgccIniUnitDAO;
import com.sgepit.frame.sysman.hbm.SgccAttachBlob;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.file.FileUtil;

/**
 * 
 * 集团跨域访问项目单位大对象
 * @author zhangh 2012-10-25
 *
 */

public class FileDownloadCrossDomainServletJT extends MainServlet {
	
	private static final long serialVersionUID = 1L;
	private WebApplicationContext wac;
	private BaseDAO baseDAO;
	private SystemMgmFacade systemMgm;
	private static final Log log = LogFactory.getLog(BaseMgmImpl.class);

	public FileDownloadCrossDomainServletJT() {
		super();
	}

	public void destroy() {
		super.destroy();
	}
	
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.systemMgm = (SystemMgmFacade) this.wac.getBean("systemMgm");
		this.baseDAO = (BaseDAO) this.wac.getBean("baseDAO");
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		String method = request.getParameter("ac");
		if (method != null) {
			if (method.equals("fileDownload")) {
				fileDownload(request, response);
				return;
			}
		}
	}
	
	
	

	/**
	 * 根据fileLsh下载文档
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 * @author xz 
	 * @createTime 2010-1-8 上午11:50:07
	 */
	private void fileDownload(HttpServletRequest request, HttpServletResponse response)throws IOException, ServletException {
		try {
			String fieldId = request.getParameter("id");
			String pid = request.getParameter("pid");
			
			//查询该大对象在本地数据库中是否存在
			SgccAttachListDAO attachListDao = SgccAttachListDAO.getInstance();
			Object attach = attachListDao.findBeanByProperty("id.fileLsh", fieldId);
			SgccAttachBlob blob = (SgccAttachBlob) this.baseDAO.findById(SgccAttachBlob.class.getName(), fieldId);
			if(attach!=null && blob!=null) {  //存在直接读取本地数据库大对象
				fileDownloadByFileId(fieldId, request,response);
			} else if(attach!=null && blob==null){    //不存在读取项目单位的大对象
				SgccIniUnitDAO UnitDao = SgccIniUnitDAO.getInstence();
				SgccIniUnit sgccIniUnit = (SgccIniUnit) UnitDao.findBeanByProperty("unitid", pid);
				if(sgccIniUnit != null) {
					String Url = sgccIniUnit.getAppUrl() + "filedownloadCrossDomainServletForJT?ac=fileDownload&id=" + fieldId;
					response.sendRedirect(Url);
				}
			} else {
				response.sendError(response.SC_NO_CONTENT);
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}
	
	/**
	 * 根据fileLsh下载文档
	 * @param fileLsh
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletExceptionxz
	 * @author xz 
	 * @createTime 2012-11-9 上午11:50:25
	 */
	private void fileDownloadByFileId(String fileLsh,HttpServletRequest request, HttpServletResponse response)throws IOException, ServletException {
		try {
			FileUtil fileUtil = new FileUtil();
			fileUtil.fileDownload(response, fileLsh,null);
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}	
}
