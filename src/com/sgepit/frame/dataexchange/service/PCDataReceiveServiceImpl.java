package com.sgepit.frame.dataexchange.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.xml.soap.AttachmentPart;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;
import javax.xml.soap.Text;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.w3c.dom.DOMException;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.dataexchange.hbm.PcDataExchangeLog;
import com.sgepit.frame.dataexchange.hbm.PcDataExchangeLogDetail;

public class PCDataReceiveServiceImpl implements PCDataReceiveService {
	Log log = LogFactory.getLog(PCDataReceiveServiceImpl.class);
	
	private BaseDAO baseDAO;
	/**
	 * 是否为调试模式
	 */
	private boolean debug;
	/**
	 * 读写文件时缓冲区大小
	 */
	private int bufferSize;
	
	public int getBufferSize() {
		return bufferSize;
	}
	public void setBufferSize(int bufferSize) {
		this.bufferSize = bufferSize;
	}
	public BaseDAO getBaseDAO() {
		return baseDAO;
	}
	public void setBaseDAO(BaseDAO baseDAO) {
		this.baseDAO = baseDAO;
	}
	public boolean isDebug() {
		return debug;
	}
	public void setDebug(boolean debug) {
		this.debug = debug;
	}
	/* (non-Javadoc)
	 * @see com.sgepit.frame.dataexchange.service.PCDataReceiveService#executeDataExchange(javax.xml.soap.SOAPMessage)
	 */
	public SOAPMessage executeDataExchange(SOAPMessage message) {
		log.info("接收端：发送端与接收端连接成功！");
		//返回信息
		SOAPMessage rtnMessage = null;
		
		String tempdir = Constant.AppRootDir.concat(Constant.TEMPFOLDER).concat("/").replace("\\", "//");
		FileOutputStream fos = null;
		List<File> allFileList = new ArrayList<File>();  //存放所有的文件，便于执行结束后删除
		
		try {
			rtnMessage = MessageFactory.newInstance().createMessage();
			SOAPPart soapPart = rtnMessage.getSOAPPart();
			SOAPEnvelope requestEnvelope = soapPart.getEnvelope();
			SOAPBody body = requestEnvelope.getBody();
			SOAPElement rltEl = body.addBodyElement(requestEnvelope.createName("result"));
			//附件处理<附件是经过压缩的,如果有附件传递，则只有一个压缩文件>
			Iterator it = message.getAttachments();
			if(it.hasNext()){
				AttachmentPart attachment = (AttachmentPart) it.next();
				File zipFile = new File(tempdir.concat(attachment.getContentId()));//唯一的压缩文件
				allFileList.add(zipFile);
				//保存压缩文件
				fos = new FileOutputStream(zipFile);
				InputStream is = attachment.getDataHandler().getInputStream();
				BufferedInputStream bis = new BufferedInputStream(is);
				BufferedOutputStream bos = new BufferedOutputStream(fos);
				byte[] buffer = new byte[bufferSize];
				int count = 0;
				while ((count = bis.read(buffer)) != -1) {
					bos.write(buffer, 0, count);
				}
				bos.close();
				bis.close();
				//对压缩文件进行解压，解压为单个文件保存到temp文件夹
				ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile));
				ZipEntry ze = null;
				while((ze=zis.getNextEntry())!=null){
					if(!ze.isDirectory()){
						File f = new File(tempdir.concat(ze.getName()));
						allFileList.add(f);
						FileOutputStream os = new FileOutputStream(f);
						int length;
						while ((length = zis.read(buffer)) != -1) {
							os.write(buffer, 0, length);
						}
						os.close();
					}
					zis.closeEntry();
				}
				zis.close();
				
				
			}
			//删除消息中的附件
			message.removeAllAttachments();
			
			SOAPBody soapBody = message.getSOAPBody();
			Iterator ite = soapBody.getChildElements();
			
			if(ite.hasNext()) {
				Connection conn = HibernateSessionFactory.getConnection();
				conn.setAutoCommit(false);
				
				SOAPElement soapElement = (SOAPElement) ite.next();
				Text text = (Text) soapElement.getChildElements().next();
				String filename = text.getValue();//xml文件名称
				
				
				Map<String, String> byteUpdateMap = new HashMap<String, String>();
				Map<String, String> charUpdateMap = new HashMap<String, String>();
				File xmlfile = new File(tempdir.concat(filename));
				
				SAXReader saxReader=new SAXReader();
				Document doc=saxReader.read(xmlfile);
				//doc结构<data><tx><row><row></tx></data> ,tx下的sql语句为事务，需要集中提交
				List tx = doc.selectNodes("//data/tx") ;
				
				for(Iterator it0=tx.iterator();it0.hasNext();){
					PcDataExchangeLog mainLog = new PcDataExchangeLog();	//主日志
					String logMessage = "";
					List<PcDataExchangeLogDetail> logDetailList = new ArrayList<PcDataExchangeLogDetail>();  //存放所有日志详细信息
					
					Element txEl = (Element) it0.next();
					String txInx = txEl.attributeValue("index");
					String id = txEl.attributeValue("id");
					
					List sqlBefores = txEl.selectNodes("//data/tx[@index='"+txInx+"']/sqlBefore/sql");
					List sqlAfters = txEl.selectNodes("//data/tx[@index='"+txInx+"']/sqlAfter/sql");
					//业务说明
					Element bizInfoEl = (Element) txEl.selectSingleNode("//data/tx[@index='"+txInx+"']/bizInfo");
					String bizInfo = bizInfoEl.getText();
					//发送单位
					Element fromEl = (Element) txEl.selectSingleNode("//data/tx[@index='"+txInx+"']/from");
					String fromunit = fromEl.getText();
					//业务说明
					Element toEl = (Element) txEl.selectSingleNode("//data/tx[@index='"+txInx+"']/to");
					String tounit = toEl.getText();
					
					mainLog.setFromunit(fromunit);//发送单位
					mainLog.setTounit(tounit);//接收单位
					
					SOAPElement txRtEl = rltEl.addChildElement("tx");
					txRtEl.setAttribute("index", txInx);
					txRtEl.setAttribute("id", id);
					//返回日志使用，提示当前执行到哪一步骤
					String currentStep = "";
					int ifSuccess = 1;
					try{
						//执行前置sql
						if ( sqlBefores.size() > 0 ){
							currentStep = "执行前置SQL语句";
							Statement preStmt = conn.createStatement();
							String beforeSql = "";
							for (Object sqlElement : sqlBefores) {
								String curSql = ((Element)sqlElement).getText();
								beforeSql+=";"+curSql;
								preStmt.addBatch(curSql);
							}
							//日志中加入前置SQL信息
							if(beforeSql.length()>0){
								mainLog.setSpareC1(beforeSql.substring(1));
							}
							
							preStmt.executeBatch();
						}

						currentStep = "执行业务数据保存/删除";
						List rows =  txEl.selectNodes("//data/tx[@index='"+txInx+"']/rows/row");
						for(Iterator it1=rows.iterator();it1.hasNext();){
							Statement stmt = conn.createStatement();
							Element rowEl = (Element) it1.next();
							String rowInx = rowEl.attributeValue("index");
							
							String mergeSql = ((Element)rowEl.selectSingleNode("//data/tx[@index='"+txInx+"']/rows/row[@index='"+rowInx+"']/mergeSql")).getText();
							Element updateElement = (Element)rowEl.selectSingleNode("//data/tx[@index='"+txInx+"']/rows/row[@index='"+rowInx+"']/updateSql");
							String updateColType = updateElement.attributeValue("colType");
							String updateSql = updateElement.getText();
							String fileName = ((Element)rowEl.selectSingleNode("//data/tx[@index='"+txInx+"']/rows/row[@index='"+rowInx+"']/fileName")).getText();
							
							if(mergeSql!=null&&!mergeSql.equals("")){
								//生成当前数据行的日志
				    			PcDataExchangeLogDetail detail = new PcDataExchangeLogDetail();
				    			detail.setTxGroupId(id);
				    			detail.setSqlData(mergeSql);
				    			//detail.setErrorMessage(sqlError);
				    			logDetailList.add(detail);
								stmt.addBatch(mergeSql);
								if(updateSql!=null&&!updateSql.equals("")){
									//分为字节(Blob)和字符(Long, Clob)两种情况
									if ( updateColType.equalsIgnoreCase("Blob") ){
										byteUpdateMap.put(updateSql, fileName);
									}
									else{
										charUpdateMap.put(updateSql, fileName);
									}
								}
							}
							
							stmt.executeBatch();
							stmt.close();
						}
						//含blob数据类型的表的处理，使用的是update语句
						for(Iterator<String> it1=byteUpdateMap.keySet().iterator();it1.hasNext();){
							currentStep = "执行BLOB对象插入";
							String updateSQL = it1.next();
							PreparedStatement stmt1 = conn.prepareStatement(updateSQL);
							
							File blob = new File(tempdir.concat(byteUpdateMap.get(updateSQL)));
							FileInputStream is = new FileInputStream(blob);
							
							ByteArrayOutputStream bout = new ByteArrayOutputStream();
							
							byte[] buffer = new byte[bufferSize];
							int count = 0;
							while ((count = is.read(buffer)) != -1) {
								bout.write(buffer, 0, count);
							}
							stmt1.setBytes(1, bout.toByteArray());
							stmt1.execute();
							stmt1.close();
							
							bout.close();
							is.close();
							
							
						}
						//含clob,long数据类型的表的处理，使用的是update语句
						for(Iterator<String> it2=charUpdateMap.keySet().iterator();it2.hasNext();){
							currentStep = "执行CLOB/LONG对象插入";
							String updateSQL = it2.next();
							PreparedStatement stmt2 = conn.prepareStatement(updateSQL);
							
							File clob = new File(tempdir.concat(charUpdateMap.get(updateSQL)));
							int length = new Long(clob.length()).intValue();
							BufferedReader reader = new BufferedReader(new FileReader(clob));
							stmt2.setCharacterStream(1, reader, length);
							
							reader.close();
							stmt2.execute();
							stmt2.close();
							
							
						}
						//执行后置sql
						if ( sqlAfters.size() > 0 ){
							currentStep = "执行后置SQL语句";
							String afterSql = "";
							Statement postStmt = conn.createStatement();
							for (Object sqlElement : sqlAfters) {
								String curSql = ((Element)sqlElement).getText();
								afterSql+=";"+curSql;
								postStmt.addBatch(curSql);
							}
							//日志中加入后置SQL信息
							if(afterSql.length()>0){
								mainLog.setSpareC2(afterSql.substring(1));
							}
							
							postStmt.executeBatch();
						}
						
						conn.commit();
						txRtEl.setAttribute("success", "1");
						logMessage = "执行数据交互成功。";
					}catch(SQLException sqlEx){
						conn.rollback();
						sqlEx.printStackTrace();
						log.error(Constant.getTrace(sqlEx));
						ifSuccess = 0;
						txRtEl.setAttribute("success", "0");
						logMessage = currentStep + "时出错。详细信息：" + sqlEx.getMessage();
						txRtEl.addTextNode(logMessage);
					}catch(Exception ex){
						conn.rollback();
						ex.printStackTrace();
						
						log.error(Constant.getTrace(ex));
						ifSuccess = 0;
						txRtEl.setAttribute("success", "0");
						logMessage = ex.getMessage();
						txRtEl.addTextNode(logMessage);
					} finally{
						//记录操作时间
						Date curDate = new Date();
						DateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
						txRtEl.setAttribute("opDate", format.format(curDate));
						
						//保存接收端日志
						mainLog.setLogType("receive");
						mainLog.setTxGroupId(id);
						mainLog.setLogDate(curDate);
						mainLog.setSpareN1(ifSuccess);
						if ( bizInfo != null && !bizInfo.equals("") ){
							logMessage += " 交互业务内容：" + bizInfo;
						}
						mainLog.setLogContent(logMessage);
						addDataReceiveLog(mainLog, logDetailList);
						
					}
				}
				rtnMessage.getSOAPBody().setAttribute("flag", "1");
				conn.close();
				
			}
			rtnMessage.saveChanges();
		} catch (SOAPException e) {
			try {
				rtnMessage.getSOAPBody().setAttribute("flag", "0");
			} catch (DOMException e1) {
				e1.printStackTrace();
			} catch (SOAPException e1) {
				e1.printStackTrace();
			}
			log.error(Constant.getTrace(e));
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			try {
				rtnMessage.getSOAPBody().setAttribute("flag", "0");
			} catch (DOMException e1) {
				e1.printStackTrace();
			} catch (SOAPException e1) {
				e1.printStackTrace();
			}
			log.error(Constant.getTrace(e));
			e.printStackTrace();
		} catch (IOException e) {
			try {
				rtnMessage.getSOAPBody().setAttribute("flag", "0");
			} catch (DOMException e1) {
				e1.printStackTrace();
			} catch (SOAPException e1) {
				e1.printStackTrace();
			}
			log.error(Constant.getTrace(e));
			e.printStackTrace();
		} catch (SQLException e) {
			try {
				rtnMessage.getSOAPBody().setAttribute("flag", "0");
			} catch (DOMException e1) {
				e1.printStackTrace();
			} catch (SOAPException e1) {
				e1.printStackTrace();
			}
			log.error(Constant.getTrace(e));
			e.printStackTrace();
		} catch (DocumentException e) {
			try {
				rtnMessage.getSOAPBody().setAttribute("flag", "0");
			} catch (DOMException e1) {
				e1.printStackTrace();
			} catch (SOAPException e1) {
				e1.printStackTrace();
			}
			log.error(Constant.getTrace(e));
			e.printStackTrace();
		}finally{
			if(fos!=null){
				try {
					fos.close();
				} catch (IOException e) {
					log.error(Constant.getTrace(e));
					e.printStackTrace();
				}
			}
			if ( !debug ){
				for (File file : allFileList) {
					if ( file.exists() && !file.isDirectory())
					file.delete();
				}
			}
			
		}
		return rtnMessage;
	}
	
	private void addDataReceiveLog(PcDataExchangeLog mainLog, List<PcDataExchangeLogDetail> detailList){
		String logId = baseDAO.insert(mainLog);
		for (PcDataExchangeLogDetail pcDataExchangeLogDetail : detailList) {
			pcDataExchangeLogDetail.setLogId(logId);
			baseDAO.insert(pcDataExchangeLogDetail);
		}
	}

}
