package com.sgepit.portal;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.sysman.dao.SgccAttachListDAO;
import com.sgepit.frame.util.file.FileUtil;

/**
 * 
 * 集团跨域访问项目单位大对象
 * @author zhangh 2012-10-25
 *
 */

public class FileDownLoadCrossDomainServletForJT extends MainServlet {
	
	private static final long serialVersionUID = 1L;
	private WebApplicationContext wac;

	public FileDownLoadCrossDomainServletForJT() {
		super();
	}

	public void destroy() {
		super.destroy();
	}
	
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
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
			if(attach != null ) {  //存在直接读取本地数据库大对象
				FileUtil fileUtil = new FileUtil();
				fileUtil.fileDownload(response, fieldId,null);
			} 
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}
}
