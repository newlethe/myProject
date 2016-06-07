package com.sgepit.frame.base.servlet;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
import net.sf.json.util.JSONUtils;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.ProxoolDataSourceExt;
import com.sgepit.frame.base.service.BaseMgmFacade;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.UpdateBeanInfo;
import com.sgepit.frame.sysman.hbm.AppFileinfo;
import com.sgepit.frame.sysman.service.ApplicationMgmFacade;
import com.sgepit.frame.util.DateUtil;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.frame.util.JXLUtil;
import com.sgepit.frame.util.StringUtil;



public class OOOoOo0O0o extends HttpServlet {

	private static final Log log = LogFactory.getLog(MainServlet.class);
	private static final long serialVersionUID = 1L;
	protected WebApplicationContext wac;
	private BaseMgmFacade baseMgm;
	private ApplicationMgmFacade appMgm;
	private HashMap<String, Integer> PoClassMap;
	private Configuration HibernateConfiguration;

	public OOOoOo0O0o() {
		super();
	}

	public void destroy() {
		super.destroy();
	}

	public void init(ServletConfig ooo000O0o) throws ServletException {
		ProxoolDataSourceExt.verify();
		ServletContext O0O0oo00OOOooOooo = ooo000O0o.getServletContext();		
		this.wac = WebApplicationContextUtils.getRequiredWebApplicationContext(O0O0oo00OOOooOooo);
		this.baseMgm = (BaseMgmFacade) com.sgepit.frame.base.Constant.wact.getBean("baseMgm");		
		this.baseMgm.setWac(Constant.wact);
		this.appMgm = (ApplicationMgmFacade) com.sgepit.frame.base.Constant.wact.getBean("applicationMgm");
		Constant.AppRootDir = ooo000O0o.getServletContext().getRealPath("/");
		Constant.AppRoot = "/".concat(O0O0oo00OOOooOooo.getServletContextName()).concat("/");
		Constant.LOGINURL = Constant.AppRoot;
		this.PoClassMap = new HashMap<String, Integer>();
		String[] Ooo0O0Ooo0o000 = new String[] { "yyyy-MM-dd HH:mm:ss" };
		JSONUtils.getMorpherRegistry().registerMorpher( new DateMorpher(Ooo0O0Ooo0o000) );
	}

	

	public void doGet(HttpServletRequest Oo00oooo0o, HttpServletResponse O0Ooo00Oo0o)
			throws ServletException, IOException {
		doPost(Oo00oooo0o, O0Ooo00Oo0o);
	}

	public void doPost(HttpServletRequest Oo00oooo0o, HttpServletResponse O0Ooo00Oo0o)
			throws ServletException, IOException {
		verify();
		String OoO0oo00o = Oo00oooo0o.getParameter("ac");
		if (OoO0oo00o != null) {
			if (OoO0oo00o.equals("getPropertyInfo")) {
				getPropertyInfo(Oo00oooo0o, O0Ooo00Oo0o);
				return;
			}
			if (OoO0oo00o.equals("save") || OoO0oo00o.equals("saveorinsert")) {
				save(Oo00oooo0o, O0Ooo00Oo0o, OoO0oo00o);
				return;
			}

			if (OoO0oo00o.equalsIgnoreCase("list")) {
				listData(Oo00oooo0o, O0Ooo00Oo0o);
			}

			if (OoO0oo00o.equalsIgnoreCase("delete")) {
				delete(Oo00oooo0o, O0Ooo00Oo0o);
			}
			if (OoO0oo00o.equals("columntree")) {
				buildColumnNodeTree(Oo00oooo0o, O0Ooo00Oo0o);
			}
			if (OoO0oo00o.equals("upload")) {
				upload(Oo00oooo0o, O0Ooo00Oo0o);
				return;
			}	

			if (OoO0oo00o.equalsIgnoreCase("downloadFile")||OoO0oo00o.equalsIgnoreCase("deleteFile")) {
				detachFile(Oo00oooo0o, O0Ooo00Oo0o);
			}
			
			if (OoO0oo00o.equalsIgnoreCase("getTemplate")) {
				getTemplate(Oo00oooo0o, O0Ooo00Oo0o);
			}
			
			if (OoO0oo00o.equalsIgnoreCase("retrieve")) {
				retrieve(Oo00oooo0o, O0Ooo00Oo0o);
			}
			if (OoO0oo00o.equalsIgnoreCase("form-insert")) {
				saveFormBean(Oo00oooo0o, O0Ooo00Oo0o);
			}
			
			if (OoO0oo00o.equals("opExcel")) {
				opExcel(Oo00oooo0o, O0Ooo00Oo0o);
				return;
			}
			
			if(OoO0oo00o.equals("upExcel")){
				
				return;
			}
			if(OoO0oo00o.equals("ImportExcel")){
				
				
				return;
			}
		}
	}

	

	private void saveFormBean(HttpServletRequest Oo00oooo0o,
			HttpServletResponse O0Ooo00Oo0o) throws IOException {
		String O0O0O0O0Ooo = Oo00oooo0o.getParameter("bean");
		String ooO00 = Oo00oooo0o.getParameter("id");
		String Oo00OO = "";
		try {
			ooO00 = this.baseMgm.saveFormBean(StringUtil.getInputStream(Oo00oooo0o.getInputStream(), Constant.ENCODING), O0O0O0O0Ooo, ooO00);
			Oo00OO = "{success:true,msg:'" + ooO00 + "'}";
		}catch(Exception o0OO){
			Oo00OO = "{success:false,msg:'" + getSQLErrorMsg(o0OO) + "'}";
		}
		outputString(O0Ooo00Oo0o, Oo00OO);
	}

	private void retrieve(HttpServletRequest Oo00oooo0o,
			HttpServletResponse O0Ooo00Oo0o) throws IOException {
		String O0O0O0O0Ooo = Oo00oooo0o.getParameter("bean");
		String ooO00 = Oo00oooo0o.getParameter("id");
		String OOooO0 = this.baseMgm.retrieve(O0O0O0O0Ooo, ooO00);
		outputString(O0Ooo00Oo0o, OOooO0);
	}

	private void getPropertyInfo(HttpServletRequest Oo00oooo0o,
			HttpServletResponse O0Ooo00Oo0o) throws IOException {
		String O0O0O0O0Ooo = Oo00oooo0o.getParameter("bean");
		String OOooO0 = this.baseMgm.getPropertyInfo(O0O0O0O0Ooo);
		outputString(O0Ooo00Oo0o, OOooO0);
	}

	public void delete(HttpServletRequest Oo00oooo0o, HttpServletResponse O0Ooo00Oo0o) {
		String o00o0o = Constant.SUCCESS;
		String oOO00oo0OOooO = "";
		String O0O0O0O0Ooo = Oo00oooo0o.getParameter("bean");
		String ooO00o00oOO0Oo0 = Oo00oooo0o.getParameter("business");
		String OOOooOOooOo0o = Oo00oooo0o.getParameter("method");
		int o0Oo = 0;
		try {
			String OoOo0O = (String) Oo00oooo0o.getParameter("ids");
			String[] OOO00o = OoOo0O.split("\\,");
			o0Oo = baseMgm.delete(ooO00o00oOO0Oo0, O0O0O0O0Ooo, OOOooOOooOo0o, OOO00o);
		} catch (Exception o0OO) {
			o00o0o = getSQLErrorMsg(o0OO);
			oOO00oo0OOooO = getStackTrace(o0OO);
		}
		sendMsgResponse(o00o0o, oOO00oo0OOooO, o0Oo, O0Ooo00Oo0o);
	}

	public void listData(HttpServletRequest Oo00oooo0o,
			HttpServletResponse O0Ooo00Oo0o) throws IOException {
		String O0O0O0O0Ooo = Oo00oooo0o.getParameter("bean");
		String ooO00o00oOO0Oo0 = Oo00oooo0o.getParameter("business");
		String OOOooOOooOo0o = Oo00oooo0o.getParameter("method");
		String OOoOoOoO0 = Oo00oooo0o.getParameter("params");
		if( OOoOoOoO0!=null)
		{
			//OOoOoOoO0 = new String(OOoOoOoO0.getBytes("ISO-8859-1"),"utf-8");
		}

		String oo0O0O0 = Oo00oooo0o.getParameter("sort");
		String oo0o0O = Oo00oooo0o.getParameter("dir");
		Integer oOO0OOoo = Oo00oooo0o.getParameter("start") != null ? java.lang.Integer
				.valueOf(Oo00oooo0o.getParameter("start")) : null;
		Integer o000OOoo = Oo00oooo0o.getParameter("limit") != null ? java.lang.Integer
				.valueOf(Oo00oooo0o.getParameter("limit")) : null;
		String oOO00oo0oo = (oo0O0O0 != null && oo0o0O != null) ? oo0O0O0 + " " + oo0o0O
				: null;
		List Oo0o0oo = this.baseMgm.find(ooO00o00oOO0Oo0, O0O0O0O0Ooo, OOOooOOooOo0o,
				OOoOoOoO0, oOO00oo0oo, oOO0OOoo, o000OOoo);
		outputString(O0Ooo00Oo0o, makeJsonDataForGrid(Oo0o0oo));
	}

	
	public void save(HttpServletRequest Oo00oooo0o, HttpServletResponse O0Ooo00Oo0o,
			String OoO0oo00o) {
		String O0O0O0O0Ooo = Oo00oooo0o.getParameter("bean");
		String ooO00o00oOO0Oo0 = Oo00oooo0o.getParameter("business");
		String ooO0OOOoOoOoo0OOO = Oo00oooo0o.getParameter("method");
		String o0o00oOO0OOo0 = Oo00oooo0o.getParameter("primaryKey");
		String o00oo0oOO0o0o0OoOO0 = ooO0OOOoOoOoo0OOO;
		if (OoO0oo00o.equalsIgnoreCase("saveorinsert")) {
			o00oo0oOO0o0o0OoOO0 = ooO0OOOoOoOoo0OOO.split("\\|")[0];
			ooO0OOOoOoOoo0OOO = ooO0OOOoOoOoo0OOO.split("\\|")[1];
		}
		int oooo0oOO0oO0ooO = java.lang.Integer.parseInt(Oo00oooo0o
				.getParameter("insertDiffer"));
		String o00o0o = Constant.SUCCESS;
		String oOO00oo0OOooO = "";
		int o0Oo = 0;
		try {
			UpdateBeanInfo OOoooo = parseJsonStr(StringUtil.getInputStream(Oo00oooo0o
					.getInputStream(), Constant.ENCODING), O0O0O0O0Ooo, o0o00oOO0OOo0);
			List<Object> beanList = OOoooo.beanList;
			Set<String> columnSet = OOoooo.columnSet;
			int oOoo0Oo0oo0o0 = columnSet.size();
			List<String> pkValueList = OOoooo.pkValueList;

			for (int OOoo = 0; OOoo < beanList.size(); OOoo++) {
				String ooO00 = (String) pkValueList.get(OOoo);
				if (ooO00 != null && !ooO00.equals("")) {
					Integer o0OoO = (Integer) this.PoClassMap.get(O0O0O0O0Ooo);
					if (o0OoO == null) {
						o0OoO = baseMgm.getBeanPropertyCount(O0O0O0O0Ooo);
						this.PoClassMap.put(O0O0O0O0Ooo, o0OoO);
					}
					if (o0OoO.intValue() > oOoo0Oo0oo0o0) {
						baseMgm.save(ooO00o00oOO0Oo0, O0O0O0O0Ooo, ooO0OOOoOoOoo0OOO,
								baseMgm.mergeBean(O0O0O0O0Ooo, beanList.get(OOoo),
										o0o00oOO0OOo0, ooO00, columnSet));
					} else {
						baseMgm.save(ooO00o00oOO0Oo0, O0O0O0O0Ooo, ooO0OOOoOoOoo0OOO,
								beanList.get(OOoo));
					}
				} else {
					baseMgm.insert(ooO00o00oOO0Oo0, O0O0O0O0Ooo, o00oo0oOO0o0o0OoOO0,
							beanList.get(OOoo));
				}
				o0Oo++;
			}
		} catch (Exception o0OO) {
			o00o0o = getSQLErrorMsg(o0OO);
			o0OO.printStackTrace();
			oOO00oo0OOooO = getStackTrace(o0OO);
		}
		sendMsgResponse(o00o0o, oOO00oo0OOooO, o0Oo, O0Ooo00Oo0o);
	}

	
	public void sendMsgResponse(String o00o0o, String oOO00oo0OOooO, int o0Oo,
			HttpServletResponse O0Ooo00Oo0o) {
		O0Ooo00Oo0o.setContentType("text/xml");
		O0Ooo00Oo0o.setCharacterEncoding(Constant.ENCODING);
		PrintWriter O00000;
		try {
			O00000 = O0Ooo00Oo0o.getWriter();
			O00000.println("<root><msg><![CDATA[" + o00o0o
					+ "]]></msg><stackTrace><![CDATA[" + oOO00oo0OOooO
					+ "]]></stackTrace><done>" + o0Oo + "</done></root>");
			O00000.flush();
			O00000.close();
		} catch (IOException o0OO) {
			o0OO.printStackTrace();
		}
	}
	
	public void sendMsgResponseLogin(String o00o0o, String oOO00oo0OOooO, String OOO0o0,
			HttpServletResponse O0Ooo00Oo0o) {
		O0Ooo00Oo0o.setContentType("text/xml");
		O0Ooo00Oo0o.setCharacterEncoding(Constant.ENCODING);
		PrintWriter O00000;
		try {
			O00000 = O0Ooo00Oo0o.getWriter();
			O00000.println("<root><msg><![CDATA[" + o00o0o
					+ "]]></msg><stackTrace><![CDATA[" + oOO00oo0OOooO
					+ "]]></stackTrace><jsp>" + OOO0o0 + "</jsp></root>");
			O00000.flush();
			O00000.close();
		} catch (IOException o0OO) {
			o0OO.printStackTrace();
		}
	}

	
	public String getStackTrace(Exception o0OO) {
		StringBuffer o00o0o = new StringBuffer("");
		StackTraceElement[] OoO00 = o0OO.getStackTrace();
		for (int OOoo = 0; OOoo < OoO00.length; OOoo++) {
			if (OoO00[OOoo].getClassName().indexOf("com.sgepit") > -1) {
				o00o0o.append("at ");
				o00o0o.append(OoO00[OOoo].getClassName());
				o00o0o.append(".");
				o00o0o.append(OoO00[OOoo].getMethodName());
				o00o0o.append("(");
				o00o0o.append(OoO00[OOoo].getFileName());
				o00o0o.append(":");
				o00o0o.append(OoO00[OOoo].getLineNumber());
				o00o0o.append(")\n");
			}
		}
		return o00o0o.toString();
	}

	
	public String getSQLErrorMsg(Exception o0OO) {
		Exception o00o0 = (Exception) o0OO.getCause();
		while (o00o0 != null
				&& (o00o0.getClass().getName().indexOf("java.sql") < 0 && o00o0
						.getClass().getName().indexOf("com.sgepit") < 0)) {
			o00o0 = (Exception) o00o0.getCause();
		}
		if (o00o0 == null) {
			o00o0 = o0OO;
		}
		return (o00o0.getClass().getName().indexOf("java.sql") < 0 && o00o0
				.getClass().getName().indexOf("com.sgepit") < 0) ? o00o0.getClass()
				.getName().concat(": ").concat(o00o0.getMessage()) : o00o0
				.getMessage();
	}

	
	public String makeJsonDataForGrid(List Oo0o0oo) {
		int oOoooOo = Oo0o0oo.size();
		if (Oo0o0oo != null && Oo0o0oo.size() > 0) {
			if (Oo0o0oo.get(Oo0o0oo.size() - 1).getClass().getName().equals(
					"java.lang.Integer")) {
				oOoooOo = (Integer) Oo0o0oo.get(Oo0o0oo.size() - 1);
				Oo0o0oo.remove(Oo0o0oo.size() - 1);
			}
		}
		JSONArray oO0000O = net.sf.json.JSONArray.fromObject(Oo0o0oo);
		StringBuffer OOo0 = new StringBuffer("{\"totalCount\":\"");
		log.debug(oO0000O);
		OOo0.append(oOoooOo);
		OOo0.append("\",\"topics\":");
		OOo0.append(oO0000O.toString());
		OOo0.append("}");
		return OOo0.toString();
	}

	
	public UpdateBeanInfo parseJsonStr(String OOooO0, String oooOooO0o0OO,
			String O0O00oO0oooo) {
		List ooo0oOo0o0o = new ArrayList();
		if (OOooO0 != null) {
			JSONArray ooOoO = net.sf.json.JSONArray.fromObject(OOooO0);
			Set oooO00 = ooOoO.getJSONObject(0).keySet();
			List o00O0000o0O0oO = new ArrayList();
			for (int OOoo = 0; OOoo < ooOoO.size(); OOoo++) {
				JSONObject Oo0OOo = ooOoO.getJSONObject(OOoo);
				if (Oo0OOo.containsKey(O0O00oO0oooo))
					o00O0000o0O0oO.add(Oo0OOo.getString(O0O00oO0oooo));
				else
					o00O0000o0O0oO.add(null);
			}
			try {
				ooo0oOo0o0o = net.sf.json.JSONArray.toList(ooOoO, java.lang.Class.forName(oooOooO0o0OO));
			} catch (ClassNotFoundException o0OO) {
				o0OO.printStackTrace();
			}
			return new UpdateBeanInfo(oooO00, ooo0oOo0o0o, o00O0000o0O0oO);
		}
		return null;
	}

	
	private void buildColumnNodeTree(HttpServletRequest Oo00oooo0o,
			HttpServletResponse O0Ooo00Oo0o) throws IOException {
		String Oo0OOoo00oo = Oo00oooo0o.getParameter("parent");
		String oOoOOoo0O00 = Oo00oooo0o.getParameter("treeName");
		String ooO00o00oOO0Oo0 = Oo00oooo0o.getParameter("businessName");
		Map OOoOoOoO0 = Oo00oooo0o.getParameterMap();
		List<ColumnTreeNode> list;
		String OOooO0 = "";
		try {
			list = this.baseMgm.buildColumnNodeTree(oOoOOoo0O00, Oo0OOoo00oo,
					ooO00o00oOO0Oo0, OOoOoOoO0);
			if (list != null) {
				List oOo0O00 = new ArrayList();
				for (int OOoo = 0; OOoo < list.size(); OOoo++) {
					ColumnTreeNode OoOoO0 = (ColumnTreeNode) list.get(OOoo);
					JSONObject OooO0 = net.sf.json.JSONObject.fromObject(OoOoO0.getTreenode());
					JSONObject OOO0oo = OoOoO0.getColumns();
					Iterator ooOOoO = OOO0oo.keys();
					while (ooOOoO.hasNext()) {
						String o0O00o = (String) ooOOoO.next();
						OooO0.element(o0O00o, OOO0oo.get(o0O00o));
					}
					OooO0.element("uiProvider", "col");
					oOo0O00.add(OooO0);
				}

				OOooO0 = JSONUtil.formObjectsToJSONStr(oOo0O00);
				log.info(OOooO0);
			}
		} catch (BusinessException o0OO) {
			OOooO0 = o0OO.getMessage();
		}
		outputString(O0Ooo00Oo0o, OOooO0);
	}
	

	
	public void upload(HttpServletRequest Oo00oooo0o, HttpServletResponse O0Ooo00Oo0o)
			throws IOException {
		String O00OO0o0O = "";
		int o0o0O0O0oOOOoO0 = 0;
		int O0OoOoOo0O0oO = 0;
		List Oo0o0oo = new ArrayList();
		StringBuffer Oo00OO = new StringBuffer("");
		try {
			String o00O000oooOOoo0o0o0 = com.sgepit.frame.base.Constant.AppRootDir.concat(
					java.io.File.separator).concat(Constant.TEMPFOLDER);
			log.debug("file uploading begin at "
					+ DateUtil.getSystemDateTimeStr(Constant.DATETIMEFORMAT)
					+ ". using temp folder: " + o00O000oooOOoo0o0o0);

			DiskFileItemFactory OOOOo0Oo00 = new DiskFileItemFactory();

			
			OOOOo0Oo00.setSizeThreshold(4096);

			
			File oo0oo0oOooOoo = new File(o00O000oooOOoo0o0o0);
			if (!oo0oo0oOooOoo.exists()){
				oo0oo0oOooOoo.createNewFile();
			}
			OOOOo0Oo00.setRepository(oo0oo0oOooOoo);

			ServletFileUpload oO00o000O = new ServletFileUpload(OOOOo0Oo00);

			
			oO00o000O.setSizeMax(Constant.MAXFILESIZE);

			
			oO00o000O.setHeaderEncoding(Constant.ENCODING);

			
			HashMap<String, String> fieldMap = new HashMap<String, String>();
			HashMap<String, FileItem> fileMap = new HashMap<String, FileItem>();
			List<FileItem> fileItems = oO00o000O.parseRequest(Oo00oooo0o);
			Iterator Oo00oOo = fileItems.iterator();
			while (Oo00oOo.hasNext()) {
				FileItem oOooo0o = (FileItem) Oo00oOo.next();
				String o0O00o = oOooo0o.getFieldName();
				if (oOooo0o.isFormField()) {
					if (o0O00o != null && o0O00o.indexOf("businessid") > -1
							&& fieldMap.get(o0O00o) == null) {
						fieldMap.put(o0O00o, oOooo0o.getString());
					}
					if (o0O00o != null && o0O00o.indexOf("fileid") > -1
							&& fieldMap.get(o0O00o) == null) {
						fieldMap.put(o0O00o, oOooo0o.getString());
					}
					} else {
						if (fieldMap.get(o0O00o) == null) {
							fieldMap.put(o0O00o,
									oOooo0o.getName().split("\\\\")[oOooo0o.getName()
											.split("\\\\").length - 1]); 
							fileMap.put(o0O00o, oOooo0o);
						}
					}
			}

			
			Iterator ooOOoO = fieldMap.entrySet().iterator();
			while (ooOOoO.hasNext()) {
				Map.Entry<String, String> entry = (Entry<String, String>) ooOOoO
						.next();
				String oo0ooo00 = entry.getKey().toString();
				String O000OOOO = (String) entry.getValue();
				
				if (oo0ooo00.indexOf("filename") > -1 && O000OOOO != null
						&& !O000OOOO.equals("")) {
					
					String o0OO0O = oo0ooo00.replace("filename", "");
					String OOoOOoOoo = (String) fieldMap.get("fileid" + o0OO0O);
					String OO0oo0Oo0o0oO = (String) fieldMap.get("businessid");
					FileItem oOooo0o = fileMap.get("filename" + o0OO0O);
					log.debug("file No." + oo0ooo00 + "------------");
					log.debug("fileid: " + OOoOOoOoo);
					log.debug("businessid: " + OO0oo0Oo0o0oO);
					log.debug("filename: " + O000OOOO);
					log.debug("filesize: " + oOooo0o.getSize());
					String Oooo000oO = Constant.SUCCESS;
					String OOooO0 = "";
					try {
						OOooO0 = this.appMgm.updateFile(OOoOOoOoo,OO0oo0Oo0o0oO,oOooo0o);
						o0o0O0O0oOOOoO0++;
					} catch (Exception o00o0) {
						o00o0.printStackTrace();
						Oooo000oO = o00o0.getMessage()!=null?o00o0.getMessage():"error";
					}
					Oo00OO.append("{result:'"+Oooo000oO+"',fieldname:'");
					Oo00OO.append(oo0ooo00);
					Oo00OO.append("',fileid:'");
					Oo00OO.append(OOooO0);
					Oo00OO.append("',filename:'");
					Oo00OO.append(O000OOOO);
					Oo00OO.append("'},");
					O0OoOoOo0O0oO++;
				}
			}
		} catch (Exception o00o0) {
			O00OO0o0O = o00o0.getMessage();
		} finally {
			if (Oo00OO.lastIndexOf(",") == Oo00OO.length() - 1)
				Oo00OO.deleteCharAt(Oo00OO.length() - 1);
			if (O00OO0o0O.equals("") && o0o0O0O0oOOOoO0==O0OoOoOo0O0oO) {
				Oo00OO.insert(0, "{success:true,msg:[");
				Oo00OO.append("]}");
			} else {
				Oo00OO.insert(0, "{success:false,msg:[");
				Oo00OO.append("],error:'");
				Oo00OO.append(O00OO0o0O);
				Oo00OO.append("'}");
			}
			java.lang.System.out.println(Oo00OO.toString());
			O0Ooo00Oo0o.setContentType("text/html;charset=UTF-8");
			PrintWriter OOoO000 = O0Ooo00Oo0o.getWriter();
			OOoO000.print(Oo00OO);
			OOoO000.flush();
			OOoO000.close();
		}
	}	
	
	public void detachFile(HttpServletRequest Oo00oooo0o,
			HttpServletResponse O0Ooo00Oo0o){
		String OO0oo0Oo0o0oO = Oo00oooo0o.getParameter("businessid");
		String OOoOOoOoo = Oo00oooo0o.getParameter("fileid");
		String O000oO000 = Oo00oooo0o.getParameter("ac");
		String o00o0o = "";
		if (OOoOOoOoo != null) {
			detachFile(Oo00oooo0o, O0Ooo00Oo0o,OOoOOoOoo,O000oO000);

		}else{
			if(OO0oo0Oo0o0oO != null){
				List<AppFileinfo> filelist = this.appMgm.getFiles(OO0oo0Oo0o0oO);
				for (int OOoo=0;OOoo<filelist.size();OOoo++){
					AppFileinfo ooO0OO0OoO = filelist.get(OOoo);
					detachFile(Oo00oooo0o, O0Ooo00Oo0o,ooO0OO0OoO.getFileid(),O000oO000);
				}
			}else{
				if (!o00o0o.equals("")) {
					try {
						O0Ooo00Oo0o.reset();
						o00o0o = com.sgepit.frame.base.Constant.HTMLMETAHEADER.concat(o00o0o);
						outputString(O0Ooo00Oo0o, o00o0o);
					} catch (IOException o0OO) {
						o0OO.printStackTrace();
					}
				}
			}
		}
	}
	
	
	public void detachFile(HttpServletRequest Oo00oooo0o,
			HttpServletResponse O0Ooo00Oo0o,String OOoOOoOoo,String O000oO000) {
		String o00o0o = "";
		if (OOoOOoOoo == null) {
			o00o0o = "缺少参数：文件编号fileid";
		} else {
			try {
				if (O000oO000.equalsIgnoreCase("downloadfile")) {
					AppFileinfo O0ooO0O = this.appMgm.getFile(OOoOOoOoo);
					if (O0ooO0O != null) {
						InputStream o0OOO = this.appMgm.getFileInputStream(O0ooO0O);
						if (o0OOO == null) {
							o00o0o = "文件缺失：" + OOoOOoOoo;
						} else {
							this.outPutStream(O0Ooo00Oo0o, o0OOO, O0ooO0O.getFilename());
							return;
						}
					} else {
						o00o0o = "文件不存在，流水号：" + OOoOOoOoo;
					}
				} else if (O000oO000.equalsIgnoreCase("deletefile")) {
					AppFileinfo O0ooO0O = this.appMgm.getFile(OOoOOoOoo);
					this.appMgm.deleteFile(O0ooO0O);
				} else {
					o00o0o = "无法识别的参数值action：" + O000oO000;
				}
			} catch (Exception o00o0) {
				if(!o00o0.getClass().getSimpleName().equalsIgnoreCase("ClientAbortException")){
					o00o0.printStackTrace();
					o00o0o = o00o0.getMessage()!=null?o00o0.getMessage():o00o0.getClass().getName();
				}
			}
			
		}
		if (!o00o0o.equals("")) {
			try {
				O0Ooo00Oo0o.reset();
				o00o0o = com.sgepit.frame.base.Constant.HTMLMETAHEADER.concat(o00o0o);
				outputString(O0Ooo00Oo0o, o00o0o);
			} catch (IOException o0OO) {
				o0OO.printStackTrace();
			}
		}
	}

	public void outputStr(HttpServletResponse O0Ooo00Oo0o, String OOooO0)
			throws IOException {
		O0Ooo00Oo0o.setCharacterEncoding(Constant.ENCODING);
		PrintWriter O00000 = O0Ooo00Oo0o.getWriter();
		O00000.println(OOooO0);
		O00000.flush();
		O00000.close();
	}

	public void outputString(HttpServletResponse O0Ooo00Oo0o, String OOooO0)
			throws IOException {
		O0Ooo00Oo0o.setCharacterEncoding(Constant.ENCODING);
		PrintWriter O00000 = O0Ooo00Oo0o.getWriter();
		log.debug(OOooO0);
		O00000.println(OOooO0);
		O00000.flush();
		O00000.close();
	}

	public void outPutStream(HttpServletResponse O0Ooo00Oo0o, InputStream o0OOO, String o0O0oo0o00o) throws IOException {
		O0Ooo00Oo0o.setContentType("application/octet-stream");
		if (o0O0oo0o00o!=null && !o0O0oo0o00o.equals("")){
			o0O0oo0o00o = StringUtil.encodingFileName(o0O0oo0o00o);
			O0Ooo00Oo0o.setHeader("Content-disposition", "attachment; filename=" + o0O0oo0o00o);
		}
		ServletOutputStream OO0oo0 = O0Ooo00Oo0o.getOutputStream();
		int ooO0OO;
		byte[] buf = new byte[2048];
		while ((ooO0OO = o0OOO.read(buf, 0, 2048)) != -1) {
			OO0oo0.write(buf, 0, ooO0OO);
		}
		o0OOO.close();
		OO0oo0.close();
	}	


	private void getTemplate(HttpServletRequest Oo00oooo0o,
			HttpServletResponse O0Ooo00Oo0o) {
		String oo0oO00oOO0OOoO = Oo00oooo0o.getParameter("templateCode");
		InputStream o0OOO = this.appMgm.getTemplate(oo0oO00oOO0OOoO);
		if (o0OOO!=null) {
			try {
				outPutStream(O0Ooo00Oo0o, o0OOO, "");
			} catch (IOException o0OO) {
				o0OO.printStackTrace();
			}
		}
	}
	
	
	public void opExcel(HttpServletRequest Oo00oooo0o, HttpServletResponse O0Ooo00Oo0o)
			throws ServletException, IOException {
		String[] ooOoo0OOOo0O = Oo00oooo0o.getParameterValues("title");
		String[] ooO0O0ooo00 = Oo00oooo0o.getParameterValues("data");

		
		UUID OoOoOOO = java.util.UUID.randomUUID();
		String OoOoo0O = com.sgepit.frame.base.Constant.AppRootDir.concat(Constant.TEMPFOLDER).concat("/").replace("\\", "//");
		File OOo0O = new File(OoOoo0O.concat(OoOoOOO.toString()) + ".xls");
		JXLUtil.writeExc(OOo0O, ooOoo0OOOo0O, ooO0O0ooo00);

		String oo00o = com.sgepit.frame.base.Constant.AppRoot.concat("/").concat(Constant.TEMPFOLDER)
		.concat("/").concat(OoOoOOO.toString()) + ".xls";
		java.lang.System.out.println("******:" + OoOoo0O);
		java.lang.System.out.println("******:" + oo00o);
		O0Ooo00Oo0o.getWriter().write(oo00o);
	}

	public static void verify() {
		/*if (new Random().nextInt(100) < 90) {
			return;
		}*/
		try {
			InputStream o0O0o = OOOoOo0O0o.class.getResourceAsStream("/jdbc.properties");
			Properties OOOoO = new Properties();
			OOOoO.load(o0O0o);
			o0O0o.close();
			Pattern ooo0OOoOo0o0o000 = java.util.regex.Pattern.compile(
					".*((:?[0-9a-f]{1,2}[-:\\.]){5}[0-9a-f]{1,2}).*",
					2);
			ArrayList Oo000O0o0OooOOooOO00 = new ArrayList();
			String oOoOooOO = java.lang.System.getProperty("os.name");
			if (oOoOooOO.startsWith("Windows")) {
				String O0oOOoOo00o0OO[] = { "ping", OOOoO.getProperty("system.macip") == null ? "" : OOOoO.getProperty("system.macip") };
				java.lang.Runtime.getRuntime().exec(O0oOOoOo00o0OO);
				String OooOOOOoo0o0[] = { "arp", "/a" };
				Process oo0OOOOooO0oo = java.lang.Runtime.getRuntime().exec(OooOOOOoo0o0);
				BufferedReader o0ooOooo00oo = new BufferedReader(
						new InputStreamReader
						(oo0OOOOooO0oo.getInputStream()));
				for (String oOo000oO0o = null; (oOo000oO0o = o0ooOooo00oo.readLine())
				!= null;) {
					Matcher Ooooo0oOoOO0O = ooo0OOoOo0o0o000.matcher(oOo000oO0o);
					if (Ooooo0oOoOO0O.matches()) {
						String O00oO00o0o[] = Ooooo0oOoOO0O.group

						(1).split("[-:\\.]");
						String o00oOO0oOO0O = "";
						for (int OoOo0Oo = 0; OoOo0Oo < O00oO00o0o.length;

						OoOo0Oo++)
							o00oOO0oOO0O = o00oOO0oOO0O + o0oo

							(O00oO00o0o[OoOo0Oo]);

						Oo000O0o0OooOOooOO00.add(o00oOO0oOO0O);
					}
				}

				o0ooOooo00oo.close();
			}
			
			String oOo0 = OOOoO.getProperty("system.mackey") == null ? "" : OOOoO.getProperty("system.mackey");
			for (int oo0oooOoO = 0; oo0oooOoO < Oo000O0o0OooOOooOO00.size(); oo0oooOoO++) {
				//System.out.println(Oo000O0o0OooOOooOO00.get(oo0oooOoO)+"物理地址： ====>>> "+oOo0);
				if (oOo0.equals(Oo000O0o0OooOOooOO00.get(oo0oooOoO))) {
					return;
				}
			}
		} catch (IOException o0OO) {
		}
		System.exit(0);//退出系统
	}

	private static String o0oo(String oOOoOOo0o) {
		if (oOOoOOo0o.length() < 2)
			return "0" + oOOoOOo0o;
		else
			return oOOoOOo0o;
	}

}	

