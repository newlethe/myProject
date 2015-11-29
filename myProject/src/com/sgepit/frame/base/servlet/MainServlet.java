package com.sgepit.frame.base.servlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.Map.Entry;
import java.util.zip.GZIPInputStream;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.ezmorph.object.DateMorpher;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;
import net.sf.json.JsonConfig;
import net.sf.json.util.JSONUtils;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.jspsmart.upload.SmartUpload;
import com.jspsmart.upload.SmartUploadException;
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmFacade;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.datastructure.UpdateBeanInfo;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.frame.util.JXLUtil;
import com.sgepit.frame.util.JsonDateProcessor;
import com.sgepit.frame.util.StringUtil;

/**
 * 通用控制层
 * 
 * @author xjdawu
 * @since 2007.11.16
 */

public class MainServlet extends HttpServlet {

	private static final Log log = LogFactory.getLog(MainServlet.class);
	private static final long serialVersionUID = 1L;
	protected WebApplicationContext wac;
	private BaseMgmFacade baseMgm;
	private ApplicationMgmFacade appMgm;
	private HashMap<String, Integer> PoClassMap;
	private Configuration HibernateConfiguration;
	private ServletConfig servletConfig;

	public MainServlet() {
		super();
	}

	public void destroy() {
		super.destroy();
	}

	public void init(ServletConfig config) throws ServletException {
		ServletContext servletContext = config.getServletContext();		
		this.wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
		this.baseMgm = (BaseMgmFacade) Constant.wact.getBean("baseMgm");		
		this.baseMgm.setWac(Constant.wact);
		this.appMgm = (ApplicationMgmFacade) Constant.wact.getBean("applicationMgm");
		this.servletConfig = config;
		
		if(Constant.propsMap.containsKey("WEBROOT")&&Constant.propsMap.get("WEBROOT")!=null&&
			Constant.propsMap.get("WEBROOT").equals("TRUE")){
			//如果没在tomcat的server.xml中添加<Context path="" docBase="frame" debug="0" reloadable="true" />
			Constant.AppRoot = Constant.propsMap.get("ROOT_APP")!=null?"/".concat(Constant.propsMap.get("ROOT_APP").toString()).concat("/")
					:"/".concat(servletContext.getServletContextName()).concat("/");
		}else{
			//如果加了：正式服务器地址
			Constant.AppRoot = "/";
		}
		log.info("Constant.AppRoot="+Constant.AppRoot);
		Constant.LOGINURL = Constant.AppRoot;
		Constant.WEBCONTEXT = this.wac;
		this.PoClassMap = new HashMap<String, Integer>();
		String[] dateFormats = new String[] { "yyyy-MM-dd HH:mm:ss" };
		JSONUtils.getMorpherRegistry().registerMorpher( new DateMorpher(dateFormats) );
	}

	

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String method = request.getParameter("ac");
		if (method != null) {
			if (method.equals("getPropertyInfo")) {
				getPropertyInfo(request, response);
				return;
			}
			if (method.equals("save") || method.equals("saveorinsert")) {
				save(request, response, method);
				return;
			}

			if (method.equalsIgnoreCase("list")) {
				listData(request, response);
				return;
			}

			if (method.equalsIgnoreCase("delete")) {
				delete(request, response);
				return;
			}
			if (method.equals("columntree")) {
				buildColumnNodeTree(request, response);
				return;
			}
			if (method.equals("tree")) {
				buildTree(request, response);
				return;
			}
			if (method.equals("upload")) {
				upload(request, response);
				return;
			}
			
			//added by Liuay 2011-12-19 根据大对象文件的ID， 从app_blob或SGCC_ATTACH_BLOB表中直接下载大对象信息；
			if (method.equals("downloadBlobFileByFileId")) {
				downloadBlobFileByFileId(request, response);
				return;
			}	

			if (method.equalsIgnoreCase("downloadFile")||method.equalsIgnoreCase("deleteFile")) {
				detachFile(request, response);
				return;
			}
			
			if (method.equalsIgnoreCase("getTemplate")) {
				getTemplate(request, response);
				return;
			}
			/* 以下为form用 */
			if (method.equalsIgnoreCase("retrieve")) {
				retrieve(request, response);
				return;
			}
			if (method.equalsIgnoreCase("form-insert")) {
				saveFormBean(request, response);
				return;
			}
			
			if (method.equals("opExcel")) {
				opExcel(request, response);
				return;
			}
			
			if(method.equals("upExcel")){
				//upLoadExcel(request,response);
				return;
			}
			
			if(method.equals("ImportExcel")){
				//ImportExcel(request,response);
				//upLoadExcel(request,response);
				return;
			}
			
			if(method.equals("downloadNtko")){
				downloadFileFromNtko(request,response);
				return;
			}
		}
	}

	

	private void saveFormBean(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String beanName = request.getParameter("bean");
		String id = request.getParameter("id");
		String rtn = "";
		try {
			id = this.baseMgm.saveFormBean(StringUtil.getInputStream(request.getInputStream(), Constant.ENCODING), beanName, id);
			rtn = "{success:true,msg:'" + id + "'}";
		}catch(Exception e){
			rtn = "{success:false,msg:'" + getSQLErrorMsg(e) + "'}";
		}
		outputString(response, rtn);
	}

	private void retrieve(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String beanName = request.getParameter("bean");
		String id = request.getParameter("id");
		String str = this.baseMgm.retrieve(beanName, id);
		outputString(response, str);
	}

	private void getPropertyInfo(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String beanName = request.getParameter("bean");
		String str = this.baseMgm.getPropertyInfo(beanName);
		outputString(response, str);
	}

	public void delete(HttpServletRequest request, HttpServletResponse response) {
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		String beanName = request.getParameter("bean");
		String businessName = request.getParameter("business");
		String methodName = request.getParameter("method");
		int c = 0;
		try {
			String ids = (String) request.getParameter("ids");
			String[] ida = ids.split("\\,");
			c = baseMgm.delete(businessName, beanName, methodName, ida);
		} catch (Exception e) {
			msg = getSQLErrorMsg(e);
			stackTrace = getStackTrace(e);
		}
		sendMsgResponse(msg, stackTrace, c, response);
	}

	public void listData(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String beanName = request.getParameter("bean");
		String businessName = request.getParameter("business");
		String methodName = request.getParameter("method");
		String params = request.getParameter("params");
		//外部统一过滤参数，过滤参数支持一般的where语法。该参数页面无法进行修改，第一阶段用于动态数据展示
		String outFilter = request.getParameter("outFilter");
		if(outFilter != null && !outFilter.equals("") && !outFilter.equals("null")){
			//如果前端传递了outFilter参数，那么params一定是查询条件参数
			params = params==null?outFilter: "(" +outFilter+") and "+ params;
		}
		String sort = request.getParameter("sort");
		String dir = request.getParameter("dir");
		Integer start = request.getParameter("start") != null ? Integer
				.valueOf(request.getParameter("start")) : null;
		Integer limit = request.getParameter("limit") != null ? Integer
				.valueOf(request.getParameter("limit")) : null;
		String orderby = (sort != null && dir != null) ? sort + " " + dir
				: null;
		Object data = this.baseMgm.find(businessName, beanName, methodName,
				params, orderby, start, limit);
		if(data instanceof java.util.List) {
			List list = (List) data;
			outputString(response, makeJsonDataForGrid(list));
		}else{
			outputString(response, data.toString());
		}
	}

	/**
	 * 根据提供的业务层方法名更新实体Bean
	 * 
	 * @param request
	 * @param response
	 * @param method
	 *            业务层方法名
	 */
	public void save(HttpServletRequest request, HttpServletResponse response,
			String method) {
		String beanName = request.getParameter("bean");
		String businessName = request.getParameter("business");
		String saveMethodName = request.getParameter("method");
		String primaryKey = request.getParameter("primaryKey");
		String insertMethodName = saveMethodName;
		if (method.equalsIgnoreCase("saveorinsert")) {
			insertMethodName = saveMethodName.split("\\|")[0];
			saveMethodName = saveMethodName.split("\\|")[1];
		}
		int insertDiffer = Integer.parseInt(request
				.getParameter("insertDiffer"));
		String msg = Constant.SUCCESS;
		String stackTrace = "";
		int c = 0;

		StringBuilder idsOfInsert = new StringBuilder();
		StringBuilder idsOfUpdate = new StringBuilder();
		
		try {
			UpdateBeanInfo jab = parseJsonStr(StringUtil.getInputStream(request
					.getInputStream(), Constant.ENCODING), beanName, primaryKey);
			List<Object> beanList = jab.beanList;
			Set<String> columnSet = jab.columnSet;
			int columnSize = columnSet.size();
			List<String> pkValueList = jab.pkValueList;
			
			for (int i = 0; i < beanList.size(); i++) {
				String id = (String) pkValueList.get(i);
				if (id != null && !id.equals("")) {
					Integer cl = (Integer) this.PoClassMap.get(beanName);
					if (cl == null) {
						cl = baseMgm.getBeanPropertyCount(beanName);
						this.PoClassMap.put(beanName, cl);
					}
					if (cl.intValue() > columnSize) {
						baseMgm.save(businessName, beanName, saveMethodName,
								baseMgm.mergeBean(beanName, beanList.get(i),
										primaryKey, id, columnSet));
					} else {
						baseMgm.save(businessName, beanName, saveMethodName,
								beanList.get(i));
					}
					idsOfUpdate.append(id).append(",");
				} else {
					baseMgm.insert(businessName, beanName, insertMethodName,
							beanList.get(i));
					JSONObject o = JSONObject.fromObject(beanList.get(i));
					if(o.containsKey(primaryKey)){
						idsOfInsert.append(o.get(primaryKey)).append(",");
					}
				}
				c++;
			}
			if(idsOfInsert.length()>0) 
				idsOfInsert.deleteCharAt(idsOfInsert.length()-1);
			if(idsOfUpdate.length()>0) 
				idsOfUpdate.deleteCharAt(idsOfUpdate.length()-1);
		} catch (Exception e) {
			msg = getSQLErrorMsg(e);
			e.printStackTrace();
			stackTrace = getStackTrace(e);
		}
		//sendMsgResponse(msg, stackTrace, c, response);
		response.setContentType("text/xml");
		response.setCharacterEncoding(Constant.ENCODING);
		PrintWriter out;
		try {
			out = response.getWriter();
			out.println("<root>" +
							"<msg><![CDATA[" + msg+ "]]></msg>" +
							"<stackTrace><![CDATA[" + stackTrace + "]]></stackTrace>" +
							"<done>" + c + "</done>" +
							"<insert><![CDATA[" + idsOfInsert.toString() + "]]></insert>" +
							"<update><![CDATA[" + idsOfUpdate.toString() + "]]></update>" +
						"</root>");
			out.flush();
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 向客户端响应非数据请求类型的操作成功与否的信息
	 * @param msg
	 * @param stackTrace
	 * @param c
	 * @param response
	 */
	public void sendMsgResponse(String msg, String stackTrace, int c,
			HttpServletResponse response) {
		response.setContentType("text/xml");
		response.setCharacterEncoding(Constant.ENCODING);
		PrintWriter out;
		try {
			out = response.getWriter();
			out.println("<root><msg><![CDATA[" + msg
					+ "]]></msg><stackTrace><![CDATA[" + stackTrace
					+ "]]></stackTrace><done>" + c + "</done></root>");
			out.flush();
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 向客户端响应非数据请求类型的操作成功与否的信息
	 * 
	 * @param msg
	 * @param stackTrace
	 * @param response
	 * @param jsp
	 */
	public void sendMsgResponseLogin(String msg, String stackTrace, String jsp,
			HttpServletResponse response) {
		response.setContentType("text/xml");
		response.setCharacterEncoding(Constant.ENCODING);
		PrintWriter out;
		try {
			out = response.getWriter();
			out.println("<root><msg><![CDATA[" + msg
					+ "]]></msg><stackTrace><![CDATA[" + stackTrace
					+ "]]></stackTrace><jsp>" + jsp + "</jsp></root>");
			out.flush();
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 从异常堆栈中获取和应用相关的信息
	 * 
	 * @param e
	 * @return
	 */
	public String getStackTrace(Exception e) {
		StringBuffer msg = new StringBuffer("");
		StackTraceElement[] st = e.getStackTrace();
		for (int i = 0; i < st.length; i++) {
			if (st[i].getClassName().indexOf("com.sgepit") > -1) {
				msg.append("at ");
				msg.append(st[i].getClassName());
				msg.append(".");
				msg.append(st[i].getMethodName());
				msg.append("(");
				msg.append(st[i].getFileName());
				msg.append(":");
				msg.append(st[i].getLineNumber());
				msg.append(")\n");
			}
		}
		return msg.toString();
	}

	/**
	 * 从异常中获取和应用相关的信息
	 * 
	 * @param e
	 * @return
	 */
	public String getSQLErrorMsg(Exception e) {
		Exception ex = (Exception) e.getCause();
		while (ex != null
				&& (ex.getClass().getName().indexOf("java.sql") < 0 && ex
						.getClass().getName().indexOf("com.sgepit") < 0)) {
			ex = (Exception) ex.getCause();
		}
		if (ex == null) {
			ex = e;
		}
		return (ex.getClass().getName().indexOf("java.sql") < 0 && ex
				.getClass().getName().indexOf("com.sgepit") < 0) ? ex.getClass()
				.getName().concat(": ").concat(ex.getMessage()) : ex
				.getMessage();
	}

	/**
	 * 为客户端的GRID展示数据提供JSON格式的字符串
	 * 
	 * @param list Bean集合，最后一个元素可能为GRID所请求数据的记录总数
	 * @return JSON字符串
	 */
	public String makeJsonDataForGrid(List list) {
		int size = list.size();
		if (list != null && list.size() > 0) {
			if (list.get(list.size() - 1).getClass().getName().equals(
					"java.lang.Integer")) {
				size = (Integer) list.get(list.size() - 1);
				list.remove(list.size() - 1);
			}
		}
		//JSONArray json = JSONArray.fromObject(list);
		JsonConfig jsonConfig = new JsonConfig(); 
		//Map<String,Object> classMap = new HashMap<String,Object>();
		Map classMap = new HashMap();
		classMap.put("*", HashMap.class);
		jsonConfig.setClassMap(classMap);
		jsonConfig.registerJsonValueProcessor(Timestamp.class, new JsonDateProcessor());
		jsonConfig.registerJsonValueProcessor(Date.class, new JsonDateProcessor());
		//JSONSerializer.toJSON(list, jsonConfig).toString()return JSONSerializer.toJSON(list, jsonConfig).toString();
		
		StringBuffer s = new StringBuffer("{\"totalCount\":\"");
	//	log.debug(json);
		log.debug(JSONSerializer.toJSON(list, jsonConfig).toString());
		s.append(size);
		s.append("\",\"topics\":");
		s.append(JSONSerializer.toJSON(list, jsonConfig).toString().toString());
		s.append("}");
		return s.toString();
	}

	/**
	 * 解析客户端提交的更新记录的JSON数据，构建三个要素：bean集合，要更新的属性集合，主键值的集合（可能为多条记录）
	 * 
	 * @param str JSON数据
	 * @param className bean的类名
	 * @param primayKey 主键名，一般为bean的id属性
	 * @return
	 */
	public UpdateBeanInfo parseJsonStr(String str, String className,
			String primayKey) {
		List beanList = new ArrayList();
		if (str != null) {
			JSONArray ja = JSONArray.fromObject(str);
			JsonConfig jsonConfig = new JsonConfig();
			jsonConfig.registerJsonValueProcessor(Timestamp.class, new JsonDateProcessor());
			jsonConfig.registerJsonValueProcessor(Date.class, new JsonDateProcessor());
			Set set = ja.getJSONObject(0).keySet();
			List pkValueList = new ArrayList();
			for (int i = 0; i < ja.size(); i++) {
				JSONObject obj = ja.getJSONObject(i);
				if (obj.containsKey(primayKey))
					pkValueList.add(obj.getString(primayKey));
				else
					pkValueList.add(null);
			}
			try {
				beanList = JSONArray.toList(ja, Class.forName(className));
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			}
			return new UpdateBeanInfo(set, beanList, pkValueList);
		}
		return null;
	}
	/**
	 * 解决客户端通用树的JSON数据
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	private void buildTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String parentId = request.getParameter("parent");
		String treeName = request.getParameter("treeName");
		String businessName = request.getParameter("businessName");
		Map params = request.getParameterMap();
		List<TreeNode> list;
		String str = "";
		try {
			list = this.baseMgm.buildTree(treeName, parentId,
					businessName, params);
			if (list != null) {
				List temp = new ArrayList();
				for (int i = 0; i < list.size(); i++) {
					TreeNode tn = list.get(i);
					JSONObject jo = JSONObject.fromObject(tn);
					temp.add(jo);
				}
				str = JSONUtil.formObjectsToJSONStr(temp);
				//log.info(str);
			}
		} catch (BusinessException e) {
			str = e.getMessage();
		}
		outputString(response, str);
	}
	/**
	 * 创建客户端Ext.tree.ColumnTree的节点数据
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	private void buildColumnNodeTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		String parentId = request.getParameter("parent");
		String treeName = request.getParameter("treeName");
		String businessName = request.getParameter("businessName");
		Map params = request.getParameterMap();
		List<ColumnTreeNode> list;
		String str = "";
		try {
			list = this.baseMgm.buildColumnNodeTree(treeName, parentId,
					businessName, params);
			if (list != null) {
				List temp = new ArrayList();
				for (int i = 0; i < list.size(); i++) {
					ColumnTreeNode ctn = (ColumnTreeNode) list.get(i);
					JSONObject jo = JSONObject.fromObject(ctn.getTreenode());
					JSONObject joc = ctn.getColumns();
					Iterator itr = joc.keys();
					while (itr.hasNext()) {
						String key = (String) itr.next();
						jo.element(key, joc.get(key));
					}
					jo.element("uiProvider", ctn.getUiProvider());
					temp.add(jo);
				}

				str = JSONUtil.formObjectsToJSONStr(temp);
				log.info(str);
			}
		} catch (BusinessException e) {
			str = e.getMessage();
		}
		outputString(response, str);
	}
	

	/**
	 * 使用commons-fileupload上传多个文件, 临时目录使用的是 $AppRoot/temp
	 * 由于传上来的表单域在fileItems中是无序的，所以先遍历一遍存到map中, 形成
	 * fieldMap(fileid--filename)--fileMap(file)的对应关系
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	public void upload(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		String errMsg = "";
		int countSuccess = 0;
		int countTotal = 0;
		StringBuffer rtn = new StringBuffer("");
		try {
			String uploadTempFolder = Constant.AppRootDir.concat(Constant.TEMPFOLDER);
			log.debug("file uploading begin at "
					+ DateUtil.getSystemDateTimeStr(Constant.DATETIMEFORMAT)
					+ ". using temp folder: " + uploadTempFolder);

			DiskFileItemFactory factory = new DiskFileItemFactory();

			// 缓冲区大小
			factory.setSizeThreshold(4096);

			// 临时文件目录
			File tempFolder = new File(uploadTempFolder);
			if (!tempFolder.exists()){
				tempFolder.mkdirs();
			}
			factory.setRepository(tempFolder);

			ServletFileUpload upload = new ServletFileUpload(factory);

			// 设置文件大小的上限
			upload.setSizeMax(Constant.MAXFILESIZE);

			// 编码
			upload.setHeaderEncoding(Constant.ENCODING);

			// 获取并组织表单域
			HashMap<String, String> fieldMap = new HashMap<String, String>();
			HashMap<String, FileItem> fileMap = new HashMap<String, FileItem>();
			List<FileItem> fileItems = upload.parseRequest(request);
			Iterator iter = fileItems.iterator();
			while (iter.hasNext()) {
				FileItem item = (FileItem) iter.next();
				String key = item.getFieldName();
				if (item.isFormField()) {
					if (key != null && key.indexOf("businessid") > -1
							&& fieldMap.get(key) == null) {
						fieldMap.put(key, item.getString());
					}
					if (key != null && key.indexOf("fileid") > -1
							&& fieldMap.get(key) == null) {
						fieldMap.put(key, item.getString());
					}
					} else {
						if (fieldMap.get(key) == null) {
							fieldMap.put(key,
									item.getName().split("\\\\")[item.getName()
											.split("\\\\").length - 1]); // "filename"
							fileMap.put(key, item);
						}
					}
			}

			// 保存文件
			Iterator itr = fieldMap.entrySet().iterator();
			while (itr.hasNext()) {
				Map.Entry<String, String> entry = (Entry<String, String>) itr
						.next();
				String field = entry.getKey().toString();
				String value = (String) entry.getValue();
				// 如果是文件域并且文件名不为空，表示该域有文件上传
				if (field.indexOf("filename") > -1 && value != null
						&& !value.equals("")) {
					// 通过序号后缀，得到其他信息
					String idx = field.replace("filename", "");
					String fileid = (String) fieldMap.get("fileid" + idx);
					String businessid = (String) fieldMap.get("businessid");
					FileItem item = fileMap.get("filename" + idx);
					log.debug("file No." + field + "------------");
					log.debug("fileid: " + fileid);
					log.debug("businessid: " + businessid);
					log.debug("filename: " + value);
					log.debug("filesize: " + item.getSize());
					String result = Constant.SUCCESS;
					String str = "";
					try {
						str = this.appMgm.updateFile(fileid,businessid,item);
						countSuccess++;
					} catch (Exception ex) {
						ex.printStackTrace();
						result = ex.getMessage()!=null?ex.getMessage():"error";
					}
					rtn.append("{result:'"+result+"',fieldname:'");
					rtn.append(field);
					rtn.append("',fileid:'");
					rtn.append(str);
					rtn.append("',filename:'");
					rtn.append(value);
					rtn.append("'},");
					countTotal++;
				}
			}
		} catch (Exception ex) {
			errMsg = ex.getMessage();
		} finally {
			if (!rtn.toString().equals("") && rtn.lastIndexOf(",") == rtn.length() - 1)
				rtn.deleteCharAt(rtn.length() - 1);
			if (errMsg.equals("") && countSuccess==countTotal) {
				rtn.insert(0, "{success:true,msg:[");
				rtn.append("]}");
			} else {
				rtn.insert(0, "{success:false,msg:[");
				rtn.append("],error:'");
				rtn.append(errMsg);
				rtn.append("'}");
			}
			//System.out.println(rtn.toString());
			response.setContentType("text/html;charset=UTF-8");
			PrintWriter outP = response.getWriter();
			outP.print(rtn);
			outP.flush();
			outP.close();
		}
	}	
	
	public void detachFile(HttpServletRequest request,
			HttpServletResponse response){
		String businessid = request.getParameter("businessid");
		String fileid = request.getParameter("fileid");
		String action = request.getParameter("ac");
		String msg = "";
		if (fileid != null) {
			detachFile(request, response,fileid,action);

		}else{
			if(businessid != null){
				List<AppFileinfo> filelist = this.appMgm.getFiles(businessid);
				for (int i=0;i<filelist.size();i++){
					AppFileinfo tmpFile = filelist.get(i);
					detachFile(request, response,tmpFile.getFileid(),action);
				}
			}else{
				if (!msg.equals("")) {
					try {
						response.reset();
						msg = Constant.HTMLMETAHEADER.concat(msg);
						outputString(response, msg);
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
		}
	}
	
	/**
	 * 文件下载/删除
	 * 
	 * @param request
	 * @param response
	 */
	public void detachFile(HttpServletRequest request,
			HttpServletResponse response,String fileid,String action) {
		String msg = "";
		if (fileid == null) {
			msg = "缺少参数：文件编号fileid";
		} else {
			try {
				if (action.equalsIgnoreCase("downloadfile")) {
					AppFileinfo file = this.appMgm.getFile(fileid);
					if (file != null) {
						InputStream is = this.appMgm.getFileInputStream(file);
						if (is == null) {
							msg = "文件缺失：" + fileid;
						} else {
							this.outPutStream(response, is, file.getFilename());
							return;
						}
					} else {
						msg = "文件不存在，流水号：" + fileid;
					}
				} else if (action.equalsIgnoreCase("deletefile")) {
					AppFileinfo file = this.appMgm.getFile(fileid);
					this.appMgm.deleteFile(file);
				} else {
					msg = "无法识别的参数值action：" + action;
				}
			} catch (Exception ex) {
				if(!ex.getClass().getSimpleName().equalsIgnoreCase("ClientAbortException")){
					ex.printStackTrace();
					msg = ex.getMessage()!=null?ex.getMessage():ex.getClass().getName();
				}
			}
			
		}
		if (!msg.equals("")) {
			try {
				response.reset();
				msg = Constant.HTMLMETAHEADER.concat(msg);
				outputString(response, msg);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public void outputStr(HttpServletResponse response, String str)
			throws IOException {
		response.setCharacterEncoding(Constant.ENCODING);
		PrintWriter out = response.getWriter();
		out.println(str);
		out.flush();
		out.close();
	}

	public void outputString(HttpServletResponse response, String str)
			throws IOException {
		response.setCharacterEncoding(Constant.ENCODING);
		PrintWriter out = response.getWriter();
		log.debug(str);
		out.println(str);
		out.flush();
		out.close();
	}

	public void outPutStream(HttpServletResponse response, InputStream is, String filename) throws IOException {
		response.setContentType("application/octet-stream");
		if (filename!=null && !filename.equals("")){
			filename = StringUtil.encodingFileName(filename);
			response.setHeader("Content-disposition", "attachment; filename=" + filename);
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


	private void getTemplate(HttpServletRequest request,
			HttpServletResponse response) {
		String templateCode = request.getParameter("templateCode");
		InputStream is = this.appMgm.getTemplate(templateCode);
		if (is!=null) {
			try {
				outPutStream(response, is, "");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * 客户端Excel下载
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	public void opExcel(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String[] titleList = request.getParameterValues("title");
		String[] dataList = request.getParameterValues("data");

		
		UUID uuid = UUID.randomUUID();
		String path = Constant.AppRootDir.concat(Constant.TEMPFOLDER).concat("/").replace("\\", "//");
		File wp = new File(path.concat(uuid.toString()) + ".xls");
		JXLUtil.writeExc(wp, titleList, dataList);

		String gp = Constant.AppRoot.concat("/").concat(Constant.TEMPFOLDER)
		.concat("/").concat(uuid.toString()) + ".xls";
		//System.out.println("******:" + path);
		//System.out.println("******:" + gp);
		response.getWriter().write(gp);
	}

	public void downloadBlobFileByFileId (HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
		String blobTableName = request.getParameter("blobTable");
		String fileId = request.getParameter("fileId");
		String fileName = request.getParameter("fileName");
		// 是否压缩存储
		String compress = request.getParameter("isCompressed");
		
		String returnMsg = "";
		
		Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null;
		try {
			conn = HibernateSessionFactory.getConnection();
			stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			
			InputStream ins = null;
			String sql = "";
			if (blobTableName!=null && blobTableName.trim().length()>0) {
				blobTableName = blobTableName.trim();
				if (blobTableName.equalsIgnoreCase("SGCC_ATTACH_BLOB")) {
					sql = "select FILE_NR from SGCC_ATTACH_BLOB where file_lsh ='" + fileId+ "'";
				} if (blobTableName.equalsIgnoreCase("APP_BLOB")) {
					sql = "select BLOB from APP_BLOB where FILEID ='" + fileId+ "'";
				} if (blobTableName.equalsIgnoreCase("SYSTEM_LONGDATA")) {
					sql = "select FILE_NR from SYSTEM_LONGDATA where file_lsh ='" + fileId + "'";
				}
				rs = stmt.executeQuery(sql);
				if(rs.next()) {				
					Blob blob = rs.getBlob(1);
					ins = blob.getBinaryStream();
	
					if(compress!=null && compress.equals("1")) {
						GZIPInputStream zin = new GZIPInputStream(ins);			
						ins = zin;
						//zin.close();
					}
				}
			} else {
				sql = "select FILE_NR from SGCC_ATTACH_BLOB where file_lsh ='" + fileId+ "'";
				rs = stmt.executeQuery(sql);
				if (!rs.next()) {
					sql = "select BLOB from APP_BLOB where FILEID ='" + fileId+ "'";
					rs = stmt.executeQuery(sql);
					if(!rs.next()) {
						sql = "select FILE_NR from SYSTEM_LONGDATA where file_lsh ='" + fileId + "'";
						rs = stmt.executeQuery(sql);
					}
				}
				rs.beforeFirst();
				if(rs.next()) {
					Blob blob = rs.getBlob(1);
					ins = blob.getBinaryStream();
					
					if(compress!=null && compress.equals("1")) {
						GZIPInputStream zin = new GZIPInputStream(ins);			
						ins = zin;
						//zin.close();
					}
				}
			}
			
			if (ins != null) {
				this.outPutStream(response, ins, fileName);
			} else {
				returnMsg = "文件不存在： 流水号：" + fileId;
				log.error(returnMsg);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				if(returnMsg!=null && returnMsg.length()>0) {
					response.reset();
					returnMsg = Constant.HTMLMETAHEADER.concat(returnMsg);
					outputString(response, returnMsg);
				}
				
				rs.close();
				stmt.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}		
		
		
	}
	
	
	/**
	 * 直接从office空间中下载文件（此时的文件可能没有保存到数据库）
	 * @param request
	 * @param response
	 * @author zhangh 2014-12-11
	 */
	public void downloadFileFromNtko(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
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
		InputStream ins = null;
		String fileName = "123456.xls";
		while (i < mySmartUpload.getFiles().getCount()) {
			java.io.File file;
			myFile = mySmartUpload.getFiles().getFile(i++);
			System.out.println((new StringBuilder("File=")).append(
					myFile.getFileName()).toString());
			if (myFile.isMissing())
				continue;
			filename = myFile.getFileName();
			file = new java.io.File(uploadTempFolder.concat("/") + filename);
			try {
				myFile.saveAs(file.getAbsolutePath(), 2);
			} catch (SmartUploadException e) {
				e.printStackTrace();
			}
			ins = new FileInputStream(file);
		}
		if(null != ins)
			this.outPutStream(response, ins, fileName);
		
		//String gp = Constant.TEMPFOLDER.concat("/").concat(filename);
		//response.getWriter().write(gp);
	}
			
}	

