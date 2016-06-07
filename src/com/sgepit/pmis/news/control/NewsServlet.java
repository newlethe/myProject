package com.sgepit.pmis.news.control;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.sql.Blob;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.TimeZone;
import java.util.zip.GZIPInputStream;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.sysman.hbm.SgccAttachBlob;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.pmis.contract.control.ConServlet;
import com.sgepit.pmis.news.dao.AppNewsDAO;
import com.sgepit.pmis.news.hbm.AppEqu;
import com.sgepit.pmis.news.hbm.AppNews;
import com.sgepit.pmis.news.service.AppNewsMgmFacade;

public class NewsServlet extends MainServlet{

	private static final Log log = LogFactory.getLog(ConServlet.class);
	private WebApplicationContext wac;
	private AppNewsMgmFacade appNewsMgm;
	private String localNewsFolder="/Business/newsManage/guoj/news/upload";
	private String localEquFolder="/Business/equipment/management/upload";
	
	/**
	 * Constructor of the object.
	 */
	public NewsServlet() {
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
		this.appNewsMgm = (AppNewsMgmFacade) this.wac.getBean("appNewsMgm");	
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
		request.setCharacterEncoding("UTF-8");
		String method = request.getParameter("method") == null ? ""
				: (String) request.getParameter("method");
		Integer start = request.getParameter("start") != null ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer
				.valueOf(request.getParameter("limit")) : null;
		String pid = request.getParameter("pid");
		String whereStr=request.getParameter("whereStr")==null?"":request.getParameter("whereStr");
		String orderby = request.getParameter("orderby") != null ? (String) request
				.getParameter("orderby")
				: null;
		String stateSelected = request.getParameter("stateSelected");
		String dateSelected = request.getParameter("dateSelected");
		String classSelected = request.getParameter("classSelected");
		String keyword = request.getParameter("keyword");							
		if("getNews".equals(method)){
			if(null!=pid&&pid!=""){
				whereStr+=" and pid='"+pid+"'";
			}

			//文件时间范围
			if ( dateSelected != null ){
				if ( dateSelected.equals("all") ){
					
				}
				else if ( dateSelected.equals("oneMonth") ){
					String dateStr = getDateStrForMonth(-1);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < createtime " ;
				}
				else if ( dateSelected.equals("threeMonth") ){
					String dateStr = getDateStrForMonth(-3);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < createtime " ;
				}
			}
			//新闻分类查询
			if(classSelected !=null){
				if("all".equals(classSelected)){
					
				}else{
					whereStr += " and newsclass = '"+classSelected+"'";
				}
			}
			//标题或内容查找
			if ( keyword != null ){
				whereStr += " and (title like '%" + keyword + "%' or content like '%" + keyword + "%' )";
			}		
			List<AppNews> appNews = this.appNewsMgm
			.getNews(stateSelected, whereStr, orderby, start,
					limit);				
			String jsonStr = makeJsonDataForGrid(appNews);	
			super.outputStr(response, jsonStr);
		}
		
		
		else if("getEqu".equals(method)){
			if(null!=pid&&pid!=""){
				whereStr+=" and pid='"+pid+"'";
			}

			//文件时间范围
			if ( dateSelected != null ){
				if ( dateSelected.equals("all") ){
					
				}
				else if ( dateSelected.equals("oneMonth") ){
					String dateStr = getDateStrForMonth(-1);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < createtime " ;
				}
				else if ( dateSelected.equals("threeMonth") ){
					String dateStr = getDateStrForMonth(-3);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < createtime " ;
				}
			}
			
			//标题或内容查找
			if ( keyword != null ){
				whereStr += " and (content like '%" + keyword + "%' )";
			}					
			List<AppEqu> appEqus= this.appNewsMgm
			.getEqus(stateSelected, whereStr, orderby, start,
					limit);				
			String jsonStr = makeJsonDataForGrid(appEqus);	
			super.outputStr(response, jsonStr);
		}	
		else if (method.equals("saveLocalNews")) {
			String rtn = "{success:";
			InputStream in = null;
			boolean isMultiPart = ServletFileUpload.isMultipartContent(request);// 必须是multi的表单模式才行
			if (isMultiPart) {
				try {
					String tmpDir= Constant.AppRootDir
							.concat(localNewsFolder);		  
					File f2 = new File(tmpDir);
					if (!f2.exists()) {
						f2.mkdirs();
					}
					DiskFileItemFactory factory = new DiskFileItemFactory();
					factory.setSizeThreshold(10 * 2014);
					factory.setRepository(new File(tmpDir));
					ServletFileUpload upload = new ServletFileUpload(factory);
					// 解决文件名乱码问题
					upload.setHeaderEncoding("UTF-8");
					List items = upload.parseRequest(request);
					Iterator iter = items.iterator();

					AppNews appNews = new AppNews();

					while (iter.hasNext()) {
						FileItem item = (FileItem) iter.next();

						if (!item.isFormField() && item.getSize() >= 0) {
							String filePath = item.getName();

							// 保存文件名 10-12-28 用于在线文档编辑后的保存
							if (filePath.indexOf(".") > 0) {
								String fileName = filePath.substring(filePath
										.lastIndexOf("\\") + 1, filePath
										.lastIndexOf("."));
								appNews.setFileName(fileName);

								// 保存文件后缀名
								String fileSuffix = filePath.substring(filePath
										.lastIndexOf(".") + 1, filePath
										.length());
								appNews.setFileSuffix(fileSuffix);
							} else {

								appNews
										.setFileName(filePath
												.substring(filePath
														.lastIndexOf("\\") + 1));

							}

							in = item.getInputStream();
						} else {
							String fName = item.getFieldName();
							String tempValue = StringUtil.getInputStream(item
									.getInputStream(), Constant.ENCODING);
							if (fName.equals("title")) {
								appNews.setTitle(tempValue);
							} else if (fName.equals("content")) {
								appNews.setContent(tempValue);
							} else if (fName.equals("createtime")) {
								DateFormat df = new SimpleDateFormat(
										"yyyy-MM-dd HH:mm:ss");
								df.setTimeZone(TimeZone.getTimeZone("GMT+8"));
								if (tempValue != null && !tempValue.equals("")) {
									appNews.setCreatetime(df
											.parse(tempValue));
								}
							} else if (fName.equals("status")) {
								appNews.setStatus(Long.parseLong(tempValue));
							} else if (fName.equals("author")) {
								appNews.setAuthor(tempValue);
							}  else if (fName.equals("pid")) {
								appNews.setPid(tempValue);
							}  else if (fName.equals("uids")){	//主键值在页面上生成，用于在保存到数据库之前也可以上传附件
								appNews.setUids(tempValue);
							} else if(fName.equals("newsclass")){
								appNews.setNewsclass(tempValue);
							}
						}
					}
					
					String fileUids = this.appNewsMgm.saveLocalNews(
							appNews, in);
					
				  	rtn += "true,msg:'" + fileUids + "'}";
					
				} catch (Exception ex) {
					rtn += "false,msg:'" + ex.getMessage() + "'}";
					ex.printStackTrace();
				}
			}
			outputStr(response, rtn);
		} 	
		else if (method.equals("saveLocalEquInfo")) {
			String rtn = "{success:";
			InputStream in = null;
			boolean isMultiPart = ServletFileUpload.isMultipartContent(request);// 必须是multi的表单模式才行
			if (isMultiPart) {
				try {
					String tmpDir= Constant.AppRootDir
							.concat(localNewsFolder);		  
					File f2 = new File(tmpDir);
					if (!f2.exists()) {
						f2.mkdirs();
					}
					DiskFileItemFactory factory = new DiskFileItemFactory();
					factory.setSizeThreshold(10 * 2014);
					factory.setRepository(new File(tmpDir));
					ServletFileUpload upload = new ServletFileUpload(factory);
					// 解决文件名乱码问题
					upload.setHeaderEncoding("UTF-8");
					List items = upload.parseRequest(request);
					Iterator iter = items.iterator();

					AppEqu appEqu = new AppEqu();

					while (iter.hasNext()) {
						FileItem item = (FileItem) iter.next();

						if (!item.isFormField() && item.getSize() >= 0) {
							String filePath = item.getName();

							// 保存文件名 10-12-28 用于在线文档编辑后的保存
							if (filePath.indexOf(".") > 0) {
								String fileName = filePath.substring(filePath
										.lastIndexOf("\\") + 1, filePath
										.lastIndexOf("."));
								appEqu.setFileName(fileName);

								// 保存文件后缀名
								String fileSuffix = filePath.substring(filePath
										.lastIndexOf(".") + 1, filePath
										.length());
								appEqu.setFileSuffix(fileSuffix);
							} else {

								appEqu
										.setFileName(filePath
												.substring(filePath
														.lastIndexOf("\\") + 1));

							}

							in = item.getInputStream();
						} else {
							String fName = item.getFieldName();
							String tempValue = StringUtil.getInputStream(item
									.getInputStream(), Constant.ENCODING);
							if (fName.equals("content")) {
								appEqu.setContent(tempValue);
							} else if (fName.equals("createtime")) {
								DateFormat df = new SimpleDateFormat(
										"yyyy-MM-dd HH:mm:ss");
								df.setTimeZone(TimeZone.getTimeZone("GMT+8"));
								if (tempValue != null && !tempValue.equals("")) {
									appEqu.setCreatetime(df
											.parse(tempValue));
								}
							} 
							else if (fName.equals("author")) {
								appEqu.setAuthor(tempValue);
							}  else if (fName.equals("pid")) {
								appEqu.setPid(tempValue);
							}  else if (fName.equals("uids")){	//主键值在页面上生成，用于在保存到数据库之前也可以上传附件
								appEqu.setUids(tempValue);
							} 
						}
					}
					
					String fileUids = this.appNewsMgm.saveLocalEquInfo(
							appEqu, in);
					
				  	rtn += "true,msg:'" + fileUids + "'}";
					
				} catch (Exception ex) {
					rtn += "false,msg:'" + ex.getMessage() + "'}";
					ex.printStackTrace();
				}
			}
			outputStr(response, rtn);
		} 		
		else if (method.equals("updateNewsInfo")) {
			String rtn = "{success:";
			try {
				String tmpDir = Constant.AppRootDir
				.concat(localNewsFolder);		  
				File f2 = new File(tmpDir);
				if (!f2.exists()) {
					f2.mkdirs();
				}				
				String json = StringUtil.getInputStream(request
						.getInputStream(), Constant.ENCODING);
				// String json =
				// request.getParameter("xmlData")==null?"":request.getParameter("xmlData").toString();
				System.out.println(json);

				String beanName = AppNews.class.getName();
				AppNews appNews = (AppNews) JSONObject.toBean(
						JSONObject.fromObject(json), Class.forName(beanName));

				AppNewsDAO appNewsDAO = AppNewsDAO.getInstance();
				AppNews oldappNews = (AppNews) appNewsDAO
						.findById(AppNews.class.getName(),appNews.getUids());

				String fileCreatetimeStr ="";
				Date createtime= appNews.getCreatetime();
				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				fileCreatetimeStr=sdf.format(createtime);
				if (fileCreatetimeStr != null && fileCreatetimeStr.length() > 0) {
					DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					df.setTimeZone(TimeZone.getTimeZone("GMT+8"));
					oldappNews.setCreatetime(df
							.parse(fileCreatetimeStr));
				}
				oldappNews.setNewsclass(appNews.getNewsclass());
				oldappNews.setContent(appNews.getContent());
				oldappNews.setAuthor(appNews.getAuthor());
				oldappNews.setTitle(appNews.getTitle());							
				appNewsDAO.saveOrUpdate(oldappNews);
				rtn += "true,msg:'OK'}";
			} catch (Exception ex) {
				rtn += "false,msg:'" + ex.getMessage() + "'}";
				ex.printStackTrace();
			}
			outputStr(response, rtn);
		} 		
		else if (method.equals("updateEquInfo")) {
			String rtn = "{success:";
			try {
				String tmpDir = Constant.AppRootDir
				.concat(localEquFolder);		  
				File f2 = new File(tmpDir);
				if (!f2.exists()) {
					f2.mkdirs();
				}				
				String json = StringUtil.getInputStream(request
						.getInputStream(), Constant.ENCODING);
				// String json =
				// request.getParameter("xmlData")==null?"":request.getParameter("xmlData").toString();
				System.out.println(json);

				String beanName = AppEqu.class.getName();
				AppEqu appEqu = (AppEqu) JSONObject.toBean(
						JSONObject.fromObject(json), Class.forName(beanName));

				AppNewsDAO appNewsDAO = AppNewsDAO.getInstance();
				AppEqu oldappEqu = (AppEqu) appNewsDAO
						.findById(AppEqu.class.getName(),appEqu.getUids());

				String fileCreatetimeStr ="";
				Date createtime= appEqu.getCreatetime();
				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				fileCreatetimeStr=sdf.format(createtime);
				if (fileCreatetimeStr != null && fileCreatetimeStr.length() > 0) {
					DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					df.setTimeZone(TimeZone.getTimeZone("GMT+8"));
					oldappEqu.setCreatetime(df
							.parse(fileCreatetimeStr));
				}
				oldappEqu.setContent(appEqu.getContent());						
				appNewsDAO.saveOrUpdate(oldappEqu);
				rtn += "true,msg:'OK'}";
			} catch (Exception ex) {
				rtn += "false,msg:'" + ex.getMessage() + "'}";
				ex.printStackTrace();
			}
			outputStr(response, rtn);
		} 			
		
		
	}	
	
	
	
	//月份期数
	private String getDateStrForMonth( int monthAgo ){
		String dateStr = "";
		Calendar calendar = Calendar.getInstance();
		
		calendar.add(Calendar.MONTH, monthAgo);
		DateFormat format = new SimpleDateFormat("yyyyMMdd");
		return format.format(calendar.getTime());
	}	
	
	
}



