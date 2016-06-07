package com.sgepit.pmis.news.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.springframework.context.ApplicationContext;

import com.enterprisedt.net.ftp.FTPException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.sysman.dao.SgccAttachListDAO;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.SgccAttachBlob;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccAttachListId;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.FtpUtil;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pmis.news.dao.AppNewsDAO;
import com.sgepit.pmis.news.hbm.AppEqu;
import com.sgepit.pmis.news.hbm.AppNews;

public class AppNewsMgmImpl extends BaseMgmImpl implements AppNewsMgmFacade {
	private static String transType = "NewsAttach"; // 文档信息大对象的业务标识
	private static String transType_attach = "NewsAttach"; // 文档附件大对象业务标识
	private static String compressFlag = "0"; // 是否压缩存储的标志。(不压缩)
	private AppNewsDAO appNewsDao;
	private SgccAttachListDAO sgccAttachListDAO;
	public static AppNewsMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (AppNewsMgmImpl) ctx.getBean("appNewsMgm");
	}
	public void setAppNewsDao(AppNewsDAO appNewsDao) {
		this.appNewsDao = appNewsDao;
	}
	public void setSgccAttachListDAO(SgccAttachListDAO sgccAttachListDAO) {
		this.sgccAttachListDAO = sgccAttachListDAO;
	}	
		/**
		 * 获取符合查询条件的所有新闻信息
		 * 
		 * @param stateSelected 发布状态
		 * @param whereStr 动态查询条件
		 * @param orderby 排序条件
		 * author:shangtw
		 * createtime:2012-5-28
		 * @return
		 */		
	public List<AppNews> getNews(String stateSelected,String whereStr,String orderby,Integer start, Integer limit) {
		String where = whereStr == null ? "1=1" : whereStr;
		if (stateSelected.equals("all")) {
			where += " and 1=1 ";
		} else {
			if(stateSelected.equals("unPublish")){
				where+=" and status=0 ";
			}else if(stateSelected.equals("publish")){
				where+=" and status=1 ";
			}
		}		
		List<AppNews> list = this.appNewsDao.findByWhere(AppNews.class.getName(),where,
				orderby, start, limit);
		return list;
	}	
	
	/**
	 * 删除单个文件
	 * @param filePk
	 * @author shangtw
	 * @createtime 2012-5-28
	 * @return
	 */
	public boolean deleteNew(String filePk) {
		// 1.删除文档附件及附件对应的大对象;2.删除文档大对象;3.删除文件本身
		try {
			List<SgccAttachList> attachList = appNewsDao
					.findByWhere(SgccAttachList.class.getName(),"transaction_type in ('" + transType_attach
							+ "','" + transType + "') and transaction_id = '"
							+ filePk + "' ");
			for (int i = 0; i < attachList.size(); i++) {
				String deleteSql = "delete from SGCC_ATTACH_BLOB where FILE_LSH='"
						+ attachList.get(i).getFileLsh() + "'";
				JdbcUtil.execute(deleteSql);
			}
			appNewsDao.deleteAll(attachList);
			AppNews appNews=(AppNews) this.appNewsDao.findById(AppNews.class.getName(), filePk);
			this.appNewsDao.delete(appNews);
			return true;
		} catch (Exception e) {
			return false;
		}

	}	
	/**
	 * 批量删除新闻
	 * 
	 * @param filePks
	 * @author shangtw
	 * @createtime 2012-5-28
	 * @return
	 */
	public boolean deleteSelectedNews(String[] filePks) {
		for (int i = 0; i < filePks.length; i++) {
			// 若文件删除失败则终止整个批处理操作
			if (!deleteNew(filePks[i]))
				return false;
		}
		return true;
	}	
	
	/**
	 * 批量发布新闻
	 * 
	 * @param filePks
	 * @author shangtw
	 * @createtime 2012-5-28
	 * @return
	 */
	public boolean publishNews(String[] filePks,String pubtime,String userId)throws Exception {	
		String localNewsFolder="/Business/newsManage/guoj/news/upload";
		String tmpDir= Constant.AppRootDir.concat(localNewsFolder);		
		File f2 = new File(tmpDir);
		if (!f2.exists()) {
			f2.mkdirs();
		}		
		for (int i = 0; i < filePks.length; i++) {
			AppNews appNews=(AppNews) this.appNewsDao.findById(AppNews.class.getName(), filePks[i]);
			//若有一条没有发布成功则回滚所有数据
			if(null!=appNews){
				appNews.setStatus(Long.parseLong(String.valueOf("1")));
				DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date date=new Date();
				try {
					date = df.parse(pubtime);
				} catch (ParseException e) {
				}
				appNews.setPubtime(date);
				appNews.setPubperson(userId);
				List<SgccAttachList> attachList=appNewsDao.findByWhere(SgccAttachList.class.getName(), "transaction_id='"+appNews.getUids()+"'");
				//新闻与图片一对多的关系
				if(attachList.size()>0){
					//将BLOB文件写入到项目目录中
					for(int c=0;c<attachList.size();c++){
						SgccAttachList sgccAttachList=attachList.get(c);
						List<SgccAttachBlob> sgccAttachBlob=appNewsDao.findByWhere(SgccAttachBlob.class.getName(), "file_lsh='"+sgccAttachList.getFileLsh()+"'");
						if(null!=sgccAttachBlob){
						    Blob blob=sgccAttachBlob.get(0).getFileNr();
						    String fileName=attachList.get(c).getFileName();
						    String fileSuffix=fileName.substring(attachList.get(c).getFileName().lastIndexOf(".")+1, fileName.length());
						    if(!fileSuffix.equalsIgnoreCase("jpg")&&!fileSuffix.equalsIgnoreCase("png")&&!fileSuffix.equalsIgnoreCase("gif")
						    		&&!fileSuffix.equalsIgnoreCase("jpeg")&&!fileSuffix.equalsIgnoreCase("bmp")&&!fileSuffix.equalsIgnoreCase("tif")){
						    	continue;//发布只生成图片格式文件
						    }
						    String localFileName=sgccAttachList.getFileLsh()+"."+fileSuffix;
						    String filePath=tmpDir+"/"+localFileName;
						    //解压缩
						    GZIPInputStream ins=new GZIPInputStream(blob.getBinaryStream());
						    BufferedInputStream bufferedInputStream = new
						     BufferedInputStream(ins);
						    File file=new File(filePath); 
						    OutputStream ous=new BufferedOutputStream(new FileOutputStream(file));
						    byte buf[]=new byte[1024];
						    for(int t=0;(t=bufferedInputStream.read(buf))!= -1;){
						    	ous.write(buf,0,t);
						    }				    
						    ous.flush();
						    ous.close();
						    bufferedInputStream.close(); 								
						}
					
					}     
				}				
				this.appNewsDao.saveOrUpdate(appNews);				
		}else{
				return false;
			}
		}
		return true;
	}	
	
	public AppNews getNewsById(String uids) {
		AppNews appNews = (AppNews) appNewsDao.findById(
				AppNews.class.getName(), uids);
		return appNews;
	}	
	/**
	 * 保存新闻及其新闻附件
	 * @param AppNews
	 * @param InputStream
	 * @author shangtw
	 * @createtime 2012-5-29
	 * @return
	 */
	public String saveLocalNews(AppNews appNews, InputStream inputStream) {
		// 1.先插入到新闻信息表，2.更新到大对象表，3.更新到attach_list表
		//用于保存前可以上传附件，uids已在页面上生成，若uids为空则手动生成
		String fileUids = appNews.getUids();
		if ( fileUids == null || fileUids.equals("")){
			fileUids = SnUtil.getNewID();
			appNews.setUids(fileUids);
		}

		//没有上传主文件则跳过
		if ( inputStream != null ){
			
			String fileLsh = this.updateFileBlob(this.transType, SnUtil.getNewID(),
					inputStream, this.compressFlag, "saveOrUpdate");
			appNews.setPicture(fileLsh);
			
			// 保存附件的基本信息到SGCC_ATTACH_LIST表中
			SgccAttachListId attachListId = new SgccAttachListId(this.transType,
					fileUids, fileLsh);
			SgccAttachList attachList = new SgccAttachList();
			attachList.setId(attachListId);
			attachList.setFileName(appNews.getFileName());
			attachList.setIsCompress(compressFlag);
			attachList.setUnitId(Constant.APPOrgRootID);
			attachList.setUploadDate(appNews.getCreatetime());
			attachList.setUserid(Constant.USERID);			
			attachList.setFileSource(this.getFileSource("NewsAttach")); // added
			if (attachList.getFileSource().equals("blob")) {
				attachList.setBlobTable("sgcc_attach_blob");
			}
			sgccAttachListDAO.insert(attachList);
		}
		List<SgccAttachList> attachList=appNewsDao.findByWhere(SgccAttachList.class.getName(), "transaction_id='"+fileUids+"'");
		//新闻与图片一对一的关系，将图片主键更新到新闻表中
		if(attachList.size()>0){
			appNews.setPicture(attachList.get(0).getFileLsh());	    
		}
		return appNewsDao.insert(appNews);
	}	

	/**
	 * 更新报告材料部分的大对象信息(只更新大对象信息，sgcc_attach_blob或ftp上的文件) --
	 * 通用的方法(根据业务处理ftp和blob大对象的更新)
	 * 
	 * @param thisTransType
	 *            大对象的业务标识 (不能为Null)
	 * @param fileLsh
	 *            file流水号 (不能为Null)
	 * @param in
	 *            大对象信息 (可为Null)
	 * @param thisCompressFlag
	 *            : 是否压缩存储的标识 0：不压缩；1：压缩存储。(可为Null)
	 * @param operateStr
	 *            具体操作的参数：saveOrUpdate:新增或更新大对象的操作; delete: 删除大对象；
	 *            当operateStr=="delete" 参数in为null, thisCompressFlag为null
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-1-8
	 */
	public String updateFileBlob(String thisTransType, String fileLsh,
			InputStream in, String thisCompressFlag, String operateStr) {
		/*
		 * 2010-01-08更新--大对象处理兼容（数据库存储和ftp存储两种方式）
		 */
		String fileSource = this.getFileSource(thisTransType);
		if (fileSource.equalsIgnoreCase("blob")) {
			try {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();

				// 删除已经存在的文件
				String deleteSql = "delete from SGCC_ATTACH_BLOB where FILE_LSH='"
						+ fileLsh + "'";
				Statement stmt = conn.createStatement();
				stmt.execute(deleteSql);
				stmt.close();

				if (operateStr.equalsIgnoreCase("saveOrUpdate")) {
					// 插入新的文件
					PreparedStatement pstmt = null;
					pstmt = conn
							.prepareStatement("insert into SGCC_ATTACH_BLOB(FILE_LSH,FILE_NR) values (?,?)");
					pstmt.setString(1, fileLsh);

					byte b[] = this.getBytesFromInputStream(in);

					// GZIP压缩
					if (thisCompressFlag.equals("1")) {
						ByteArrayOutputStream bout = new ByteArrayOutputStream();
						GZIPOutputStream zout = new GZIPOutputStream(bout);
						zout.write(b);
						zout.finish();
						pstmt.setBytes(2, bout.toByteArray());
						zout.close();
						bout.close();
					} else {
						pstmt.setBytes(2, b);
					}
					pstmt.execute();
					pstmt.close();
					conn.close();
				}

				initCtx.close();
			} catch (NamingException e) {
				e.printStackTrace();
				return "-1";
			} catch (SQLException e) {
				e.printStackTrace();
				return "-1";
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else if (fileSource.equalsIgnoreCase("ftp")) {
			// 大对象存到FTP的处理方式-----------2010-01-08 Modified By Ivy;
			
			try {
				if (operateStr.equalsIgnoreCase("saveOrUpdate")) {
					FtpUtil.ftpPut(in, fileLsh, "FAPDocument");
				} else if (operateStr.equalsIgnoreCase("delete")) {
					FtpUtil.ftpDel(fileLsh, "FAPDocument");
				} else {
					System.out.println("操作错误！");
					return "-1";
				}
			} catch (IOException e) {
				e.printStackTrace();
				return "-1";
			} catch (FTPException e) {
				e.printStackTrace();
				return "-1";
			}
		} else {
			System.out.println("您设置的大对象存储方式错误。在系统属性处配置为ftp/blob");
			return "-1";
		}
		return fileLsh;
	}

	/**
	 * inputstream 转换为 byte[]的方法
	 * 
	 * @param in
	 * @return
	 * @throws IOException
	 * @author: Ivy
	 * @createDate: 2010-1-11
	 */
	private byte[] getBytesFromInputStream(InputStream in) throws IOException {
		ByteArrayOutputStream os = new java.io.ByteArrayOutputStream();
		byte[] buffer = new byte[64 * 1024];
		for (;;) {
			int count = in.read(buffer);
			if (count < 0)
				break;
			os.write(buffer, 0, count);
		}
		return os.toByteArray();
	}	
	
	/**
	 * 获得业务数据大对象的存储方式
	 * 
	 * @param businessType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-1-8
	 */
	public String getFileSource(String businessType) {
		String fileSource = "blob";
		// 获取本模块对对象的存储方式 -- 默认是存储到数据库(blob)
		SystemMgmFacade sysMgm = (SystemMgmFacade) Constant.wact
				.getBean("systemMgm");
		List<PropertyCode> listProperty = sysMgm.getCodeValue("大对象存储方式");
		if (listProperty != null) {
			for (int i = 0; i < listProperty.size(); i++) {
				if (listProperty.get(i).getPropertyCode().equalsIgnoreCase(
						businessType)) {
					fileSource = listProperty.get(i).getPropertyName();
					break;
				}
			}
		}

		return fileSource;
	}
	/**
	 * 保存设备到货信息登记
	 * @param AppEqu
	 * @param InputStream
	 * @author shangtw
	 * @createtime 2013-3-21
	 * @return
	 */
	public String saveLocalEquInfo(AppEqu appEqu, InputStream inputStream) {
		// 1.先插入到设备到货信息表，2.更新到大对象表，3.更新到attach_list表
		//用于保存前可以上传附件，uids已在页面上生成，若uids为空则手动生成
		String fileUids = appEqu.getUids();
		if ( fileUids == null || fileUids.equals("")){
			fileUids = SnUtil.getNewID();
			appEqu.setUids(fileUids);
		}

		//没有上传主文件则跳过
		if ( inputStream != null ){
			
			String fileLsh = this.updateFileBlob("equManamentAttach", SnUtil.getNewID(),
					inputStream, this.compressFlag, "saveOrUpdate");
			appEqu.setPicture(fileLsh);
			
			// 保存附件的基本信息到SGCC_ATTACH_LIST表中
			SgccAttachListId attachListId = new SgccAttachListId(this.transType,
					fileUids, fileLsh);
			SgccAttachList attachList = new SgccAttachList();
			attachList.setId(attachListId);
			attachList.setFileName(appEqu.getFileName());
			attachList.setIsCompress(compressFlag);
			attachList.setUnitId(Constant.APPOrgRootID);
			attachList.setUploadDate(appEqu.getCreatetime());
			attachList.setUserid(Constant.USERID);			
			attachList.setFileSource(this.getFileSource("equManamentAttach")); // added
			if (attachList.getFileSource().equals("blob")) {
				attachList.setBlobTable("sgcc_attach_blob");
			}
			sgccAttachListDAO.insert(attachList);
		}
		List<SgccAttachList> attachList=appNewsDao.findByWhere(SgccAttachList.class.getName(), "transaction_id='"+fileUids+"'");
		//新闻与图片一对一的关系，将图片主键更新到新闻表中
		if(attachList.size()>0){
			appEqu.setPicture(attachList.get(0).getFileLsh());	    
		}
		return appNewsDao.insert(appEqu);
	}	
	/**
	 * 获取符合查询条件的所有新闻信息
	 * 
	 * @param stateSelected 发布状态
	 * @param whereStr 动态查询条件
	 * @param orderby 排序条件
	 * author:shangtw
	 * createtime:2013-3-21
	 * @return
	 */		
	public List<AppEqu> getEqus(String stateSelected,String whereStr,String orderby,Integer start, Integer limit) {
	String where = whereStr == null ? "1=1" : whereStr;	
	List<AppEqu> list = this.appNewsDao.findByWhere(AppEqu.class.getName(),where,
			orderby, start, limit);
	return list;
	}		
	
	/**
	 * 隐式发布图片到tomcat下
	 * 
	 * @param filePks
	 * @param pubtime
	 * @param userId
	 * @author shangtw
	 * @createtime 2013-3-21
	 * @return
	 * @throws Exception 
	 */
	public boolean publishEquManagement(String[] filePks,String pubtime,String userId)throws Exception {	
		String localEquFolder="/Business/equipment/management/upload";
		String tmpDir= Constant.AppRootDir.concat(localEquFolder);		
		File f2 = new File(tmpDir);
		if (!f2.exists()) {
			f2.mkdirs();
		}		
		for (int i = 0; i < filePks.length; i++) {
			AppEqu appequ=(AppEqu) this.appNewsDao.findById(AppEqu.class.getName(), filePks[i]);
			//若有一条没有发布成功则回滚所有数据
			if(null!=appequ){
				List<SgccAttachList> attachList=appNewsDao.findByWhere(SgccAttachList.class.getName(), "transaction_id='"+appequ.getUids()+"'");
				//新闻与图片一对多的关系
				if(attachList.size()>0){
					//将BLOB文件写入到项目目录中
					for(int c=0;c<attachList.size();c++){
						SgccAttachList sgccAttachList=attachList.get(c);
						List<SgccAttachBlob> sgccAttachBlob=appNewsDao.findByWhere(SgccAttachBlob.class.getName(), "file_lsh='"+sgccAttachList.getFileLsh()+"'");
						if(null!=sgccAttachBlob){
						    Blob blob=sgccAttachBlob.get(0).getFileNr();
						    String fileName=attachList.get(c).getFileName();
						    String fileSuffix=fileName.substring(attachList.get(c).getFileName().lastIndexOf(".")+1, fileName.length());
						    String localFileName=sgccAttachList.getFileLsh()+"."+fileSuffix;
						    String filePath=tmpDir+"/"+localFileName;
						    //解压缩
						    GZIPInputStream ins=new GZIPInputStream(blob.getBinaryStream());
						    BufferedInputStream bufferedInputStream = new
						     BufferedInputStream(ins);
						    File file=new File(filePath); 
						    OutputStream ous=new BufferedOutputStream(new FileOutputStream(file));
						    byte buf[]=new byte[1024];
						    for(int t=0;(t=bufferedInputStream.read(buf))!= -1;){
						    	ous.write(buf,0,t);
						    }				    
						    ous.flush();
						    ous.close();
						    bufferedInputStream.close(); 								
						}
					
					}     
				}				
				this.appNewsDao.saveOrUpdate(appequ);				
		}else{
				return false;
			}
		}
		return true;
	}	
		 
	/**
	 * 删除设备到货信息
	 * @param filePk
	 * @author shangtw
	 * @createtime 2013-3-21
	 * @return
	 */
	public boolean deleteEqu(String filePk) {
		// 1.删除文档附件及附件对应的大对象;2.删除文档大对象;3.删除文件本身
		try {
			List<SgccAttachList> attachList = appNewsDao
					.findByWhere(SgccAttachList.class.getName(),"transaction_type in ('equManamentAttach') and transaction_id = '"
							+ filePk + "' ");
			for (int i = 0; i < attachList.size(); i++) {
				String deleteSql = "delete from SGCC_ATTACH_BLOB where FILE_LSH='"
						+ attachList.get(i).getFileLsh() + "'";
				JdbcUtil.execute(deleteSql);
			}
			appNewsDao.deleteAll(attachList);
			AppEqu appEqu=(AppEqu) this.appNewsDao.findById(AppEqu.class.getName(), filePk);
			this.appNewsDao.delete(appEqu);
			return true;
		} catch (Exception e) {
			return false;
		}

	}	
	/**
	 * 批量设备到货信息
	 * 
	 * @param filePks
	 * @author shangtw
	 * @createtime 2013-3-21
	 * @return
	 */
	public boolean deleteSelectedEqus(String[] filePks) {
		for (int i = 0; i < filePks.length; i++) {
			// 若文件删除失败则终止整个批处理操作
			if (!deleteEqu(filePks[i]))
				return false;
		}
		return true;
	}		
	
	
}
