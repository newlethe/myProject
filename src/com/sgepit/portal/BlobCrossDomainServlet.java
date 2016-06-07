package com.sgepit.portal;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.messaging.URLEndpoint;
import javax.xml.soap.AttachmentPart;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPConnection;
import javax.xml.soap.SOAPConnectionFactory;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.sysman.dao.SgccAttachListDAO;
import com.sgepit.frame.sysman.dao.SgccIniUnitDAO;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.hbm.SgccAttachBlob;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.file.FileUtil;

/**
 * 
 * 集团跨域访问项目单位大对象
 * <pre>
 * 集团通过此servlet跨域访问项目单位大对象。
 * 目前大对象分别存放在APP_BLOB和SGCC_ATTACH_BLOB两张表，需分别进行处理。
 * 通过表单文件域上传的大对象，一般存放在APP_BLOB中，通过MainServlet?ac=downloadFile访问。
 * 多附近上传的大对象，存放在SGCC_ATTACH_BLOB中，通过fileUploadSwf.jsp通用组件管理。
 * 
 * </pre>
 * @author zhangh 2013-3-26
 */

public class BlobCrossDomainServlet extends MainServlet {
	
	private static final long serialVersionUID = 1L;
	private WebApplicationContext wac;
	private BaseDAO baseDAO;
	private FlowDAO flowDao;
	private ApplicationMgmFacade appMgm;
	private static final Log log = LogFactory.getLog(BaseMgmImpl.class);

	public BlobCrossDomainServlet() {
		super();
	}

	public void destroy() {
		super.destroy();
	}
	
	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.baseDAO = (BaseDAO) this.wac.getBean("baseDAO");
		this.flowDao = (FlowDAO) this.wac.getBean("flowDAO");
		this.appMgm = (ApplicationMgmFacade) Constant.wact.getBean("applicationMgm");
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
			try {
				if(method.equals("sgccfile")){
					downloadSgccAttachBlob(request, response);
				}else if(method.equals("appfile")){
					downloadAppBlob(request, response);
				}else if(method.equals("loadDoc")){
					loadDoc(request, response);
				}
			} catch (SOAPException e) {
				PrintWriter out = response.getWriter();
				out.print("{msg:'请检查远程地址，无法远程访问附件!'}");
				e.printStackTrace();
			} catch (SQLException e) {
				PrintWriter out = response.getWriter();
				out.print("{msg:'查询异常!'}");
				e.printStackTrace();
			}
			return;
		}
	}
	
	
	
	/**
	 * 根据fileid下载SGCC_ATTACH_BLOB中的文档
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 * @author zhangh 2013-03-26
	 * @throws SOAPException 
	 */
	private void downloadSgccAttachBlob(HttpServletRequest request,
			HttpServletResponse response) throws IOException, ServletException, SOAPException {
		String fileid = request.getParameter("fileid");
		String pid = request.getParameter("pid");

		// 查询该大对象在本地数据库中是否存在
		SgccAttachListDAO attachListDao = SgccAttachListDAO.getInstance();
		Object attach = attachListDao.findBeanByProperty("id.fileLsh",
				fileid);
		SgccAttachBlob blob = (SgccAttachBlob) this.baseDAO.findById(
				SgccAttachBlob.class.getName(), fileid);
		if (attach != null && blob != null) { // 存在直接读取本地数据库大对象
			try {
				FileUtil fileUtil = new FileUtil();
				fileUtil.fileDownload(response, fileid, null);
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		} else if (attach != null && blob == null) { // 不存在读取项目单位的大对象
			SgccIniUnitDAO UnitDao = SgccIniUnitDAO.getInstence();
			SgccIniUnit sgccIniUnit = (SgccIniUnit) UnitDao
					.findBeanByProperty("unitid", pid);
			if (sgccIniUnit != null) {
				getAttachBySOAP(sgccIniUnit, "sgccfile", fileid, request, response);
			}
		} else {
			response.sendError(response.SC_NO_CONTENT);
		}
	}
	
	
	/**
	 * 根据fileid下载APP_BLOB中的文档
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws ServletException
	 * @author zhangh 2013-03-26
	 * @throws SOAPException 
	 */
	private void downloadAppBlob(HttpServletRequest request,
			HttpServletResponse response) throws IOException, ServletException, SOAPException {
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
		} else {
			// 不存在，转到项目单位BlobCrossDomainServlet
			SgccIniUnitDAO UnitDao = SgccIniUnitDAO.getInstence();
			SgccIniUnit sgccIniUnit = (SgccIniUnit) UnitDao.findBeanByProperty(
					"unitid", pid);
			if (sgccIniUnit != null) {
				getAttachBySOAP(sgccIniUnit, "appfile", fileid, request, response);
			}
		}

	}
	
	public void outPutStream(HttpServletResponse response, InputStream is,
			String filename) throws IOException {
		response.setContentType("application/octet-stream");
		if (filename != null && !filename.equals("")) {
			filename = StringUtil.encodingFileName(filename);
			response.setHeader("Content-disposition", "attachment; filename="
					+ filename);
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
	
	
	
	
	private void loadDoc(HttpServletRequest request,
			HttpServletResponse response) throws IOException, SQLException, SOAPException {
		String fileid = request.getParameter("fileid");
		String pid = request.getParameter("pid");

		String sql = "select FILEID from APP_BLOB where FILEID ='" + fileid + "'";
		List list = this.baseDAO.getData(sql);
		if (list != null && list.size() > 0) {
			OutputStream os = response.getOutputStream();
			InputStream is = flowDao.getFileBlob(fileid);
			byte buf[] = new byte[8096];
			for (int bytes = 0; (bytes = is.read(buf, 0, 8096)) != -1;)
				os.write(buf, 0, bytes);

			os.flush();
			os.close();
			is.close();

		} else {
			SgccIniUnitDAO UnitDao = SgccIniUnitDAO.getInstence();
			SgccIniUnit sgccIniUnit = (SgccIniUnit) UnitDao
					.findBeanByProperty("unitid", pid);
			if (sgccIniUnit != null) {
				getAttachBySOAP(sgccIniUnit, "appfile", fileid, request, response);
			}
		}
	}
	
	/**
	 * 跨域交换附件，使用SOAP
	 * 
	 * @param unit 附件来源的单位对象
	 * @param fileType 大对象来源 sgccAttachBlob或appBlob
	 * @param fileId 文件ID
	 * @param request
	 * @param response
	 * @throws IOException
	 * @throws SOAPException 
	 */
	private void getAttachBySOAP(SgccIniUnit unit, String fileType, String fileId, HttpServletRequest request,
			HttpServletResponse response) throws IOException, SOAPException{
		SOAPMessage  message = MessageFactory.newInstance().createMessage();
		SOAPPart soapPart = message.getSOAPPart();
		SOAPEnvelope requestEnvelope = soapPart.getEnvelope();
		SOAPBody body = requestEnvelope.getBody();
		SOAPElement filesElement = body.addBodyElement(requestEnvelope.createName("files"));
		SOAPElement fileEl = filesElement.addChildElement("file");
		fileEl.addAttribute(requestEnvelope.createName("fid"), fileId);
		fileEl.addAttribute(requestEnvelope.createName("fType"), fileType);
		message.saveChanges();

		SOAPConnectionFactory soapConnFactory = SOAPConnectionFactory.newInstance();
		SOAPConnection connection = soapConnFactory.createConnection();
		String url = unit.getAppUrl() + "/servlet/BlobFetchCrossDomainServlet";
		URLEndpoint destination = new URLEndpoint(url);
		log.info("向【"+(unit==null?"":unit.getUnitname())+"】下载附件,发送请求......");
		SOAPMessage returnMsg = connection.call(message, destination);
		log.info("接收到远程响应，处理返回的附件......");
		
		//处理返回的附件
		Iterator<SOAPElement> it = returnMsg.getAttachments();
		if (it.hasNext()){
			AttachmentPart attachment = (AttachmentPart) it.next();
			InputStream ins = attachment.getDataHandler().getInputStream();
		
			//对压缩文件进行解压，解压为单个文件保存到temp文件夹
			ZipInputStream zis = new ZipInputStream(ins);
			ZipEntry ze = null;
			if((ze=zis.getNextEntry())!=null){
				if(!ze.isDirectory()){
					int bufferSize = 102400;
					byte[] buffer = new byte[bufferSize];
					response.setContentType("application/octet-stream");
					String filename = ze.getName();
					if (filename != null && !filename.equals("")) {
						filename = StringUtil.encodingFileName(filename);
						response.setHeader("Content-disposition", "attachment; filename="
								+ filename);
					}
					OutputStream outs = response.getOutputStream();
					int length;
					while ((length = zis.read(buffer)) != -1) {
						outs.write(buffer, 0, length);
					}
					outs.flush();
					outs.close();
				}
				zis.closeEntry();
			}
			zis.close();
		}
	} 
}
