package com.sgepit.portal;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;
import java.util.zip.GZIPInputStream;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.xml.messaging.JAXMServlet;
import javax.xml.messaging.ReqRespListener;
import javax.xml.soap.AttachmentPart;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;
import org.hibernate.Hibernate;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.dao.SgccAttachListDAO;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.hbm.SgccAttachBlob;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.db.SnUtil;



public class BlobFetchCrossDomainServlet extends JAXMServlet implements ReqRespListener {
	private WebApplicationContext wac;
	private BaseDAO baseDAO;
	private ApplicationMgmFacade appMgm;
	Log log = LogFactory.getLog(BaseMgmImpl.class);
	
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.baseDAO = (BaseDAO) this.wac.getBean("baseDAO");
		this.appMgm = (ApplicationMgmFacade) Constant.wact.getBean("applicationMgm");

	}
	
	@Override
	public SOAPMessage onMessage(SOAPMessage message){
		log.info("接收到远程下载附件请求，发送SOAPMessage消息......");
		
		SOAPMessage rtnMessage = null;
		String fileId = null;
		String fileType = null;
		ZipOutputStream zout = null;
		File zip = null;
		try {
			SOAPBody soapBody = message.getSOAPBody();
			Iterator<SOAPElement> iterator = soapBody.getChildElements();
			if ( iterator.hasNext() ){
				SOAPElement filesElement = iterator.next();
				Iterator<SOAPElement> flsIterator = filesElement.getChildElements();
				if ( flsIterator.hasNext() ){
					SOAPElement flElement = flsIterator.next();
					fileId = flElement.getAttribute("fid");
					fileType = flElement.getAttribute("fType");
				}
			}

			rtnMessage = MessageFactory.newInstance().createMessage();
			SOAPPart soapPart = rtnMessage.getSOAPPart();
			SOAPEnvelope requestEnvelope = soapPart.getEnvelope();
			SOAPBody body = requestEnvelope.getBody();
			SOAPElement fileEl = body.addBodyElement(requestEnvelope.createName("file"));
			fileEl.addAttribute(requestEnvelope.createName("fid"), fileId);
			fileEl.addAttribute(requestEnvelope.createName("fType"), fileType);
			
			String zipName = SnUtil.getNewID().concat(".zip");
			String tempdir = Constant.AppRootDir.concat(Constant.TEMPFOLDER).concat("/").replace("\\", "//");
			zip = new File(tempdir.concat(zipName));
			zout = new ZipOutputStream(zip);
			zout.setEncoding("UTF-8");
			boolean success = setFileBlob(fileId, fileType, zout);
			
			if (success){
				DataSource ds = new FileDataSource(zip);
				DataHandler dh = new DataHandler(ds);
				AttachmentPart attachment = rtnMessage.createAttachmentPart(dh);
				attachment.setContentId(zipName);
				rtnMessage.addAttachmentPart(attachment);
				rtnMessage.saveChanges();
			}
			
				
			
		} catch (SOAPException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (zout != null) {
				try {
					zout.close();
				} catch (IOException e) {
					//e.printStackTrace();
				}
			}
			if (zip != null && zip.exists())
				zip.delete();

		}
		
		return rtnMessage;
	}
	
	private boolean setFileBlob(String fileId, String fileType, ZipOutputStream zout) throws IOException, SQLException{
		Blob blob = null;
		String fileName = "文件";
		String compress = null;
		if ( fileType.equals("appfile")){
			AppFileinfo file = (AppFileinfo) baseDAO.findById(
					AppFileinfo.class.getName(), fileId);
			fileName = file.getFilename();
			String sql = "select FILEID from APP_BLOB where FILEID ='" + fileId + "'";
			List list = this.baseDAO.getData(sql);
			if (list != null && list.size() > 0) {
				// 存在，直接打开
				InputStream is = appMgm.getFileInputStream(file);
				blob = Hibernate.createBlob(is);
			}
		}
		else if ( fileType.equals("sgccfile") ){
			SgccAttachListDAO attachListDao = SgccAttachListDAO.getInstance();
			Object attach = attachListDao.findBeanByProperty("id.fileLsh",
					fileId);
			if (attach!= null){
				fileName = ((SgccAttachList)attach).getFileName();
				compress = ((SgccAttachList)attach).getIsCompress();
			}
			SgccAttachBlob sgccAttachBlob = (SgccAttachBlob) this.baseDAO.findById(
					SgccAttachBlob.class.getName(), fileId);
			if (attach != null && sgccAttachBlob != null) { // 存在直接读取本地数据库大对象
				try {
					blob = sgccAttachBlob.getFileNr();
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
		}
		
		if ( blob != null){
			log.info("附件《"+fileName+"》下载成功，正在打开......");
			InputStream in = blob.getBinaryStream();
			BufferedInputStream bis = new BufferedInputStream(null);
			
			//如果是压缩模式
			if("1".equals(compress)){
				log.info("附件为压缩模式，进行解压缩......");
				GZIPInputStream zin = new GZIPInputStream(in);
				bis = new BufferedInputStream(zin);
			}else{
				bis = new BufferedInputStream(in);
			}
			
			ZipEntry ze = new ZipEntry(fileName);
			zout.putNextEntry(ze);
			int len = 0;
			int bufferSize = 102400;
			byte[] buf = new byte[bufferSize];
			while ((len = bis.read(buf, 0, bufferSize)) != -1) {
				zout.write(buf, 0, len);
			}
			bis.close();
			zout.closeEntry();
			return true;
		}
		else{
			return false;
		}
		
		
	}

	
	
}
