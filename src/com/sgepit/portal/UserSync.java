package com.sgepit.portal;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.net.URL;
import java.rmi.RemoteException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import javax.xml.rpc.ServiceException;

import org.apache.log4j.Logger;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.sysman.dao.SystemDao;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.MD5Util;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.portal.sso.corp.GDHRServiceImplServiceLocator;
import com.sgepit.portal.sso.corp.GDHRServiceImplSoapBindingStub;

public class UserSync {
	private String hrJdbcUrl;
	private String hrDbUser;
	private String hrDbPwd;
	private String defaultUnitId;
	private String defaultDeptId;
	private String hrDataUser;
	private String hrWsUrlStr;
	private URL hrWsUrl;
	static Logger logger = Logger.getLogger(UserSync.class);

	public UserSync() {
		InputStream is = UserSync.class.getResourceAsStream("/jdbc.properties");
		Properties p = new Properties();
		try {
			p.load(is);
			this.hrJdbcUrl = p.getProperty("hr.jdbc.driverUr");
			this.hrDbUser = p.getProperty("hr.jdbc.user");
			this.hrDbPwd = p.getProperty("hr.jdbc.password");
			this.defaultUnitId = p.getProperty("hr.info.corp");
			this.defaultDeptId = p.getProperty("hr.info.dept");
			this.hrDataUser = p.getProperty("hr.jdbc.relationUser");
			this.hrWsUrlStr = p.getProperty("hr.ws.url");
			this.hrWsUrl = new URL(this.hrWsUrlStr);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public String syncUser() {
		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
			try {
				Context initCtx = null;
				Connection conn = null, con = null;
				Statement stmtt = null, stmt = null;
				try {
					initCtx = new InitialContext();
					DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
					conn = ds.getConnection();
					stmtt = conn.createStatement();
					con = DriverManager.getConnection(this.hrJdbcUrl,this.hrDbUser, this.hrDbPwd);
					stmt = con.createStatement();
					String sql = "select a.pk_psndoc as userpk,a.psncode as usercode,a.psnname as username,b.basgroupdef16 as useraccout,"
							+ "b.sex as sex ,c.unitcode ,c.unitname from "
							+ this.hrDataUser
							+ ".bd_psndoc a,"
							+ this.hrDataUser
							+ ".bd_psnbasdoc b,"
							+ this.hrDataUser + ".bd_corp c  " +
							// "where a.pk_psnbasdoc = b.pk_psnbasdoc and
							// a.pk_corp = c.pk_corp and c.unitcode in
							// ("+StringUtil.transStrToIn(corps, ",")+")";
							// 由于集团公司需要进行整体的
							"where a.pk_psnbasdoc = b.pk_psnbasdoc and a.pk_corp = c.pk_corp ";
					ResultSet rs = stmt.executeQuery(sql);
					SimpleDateFormat sdf = new SimpleDateFormat(
							"yyyy-MM-dd HH:mm:ss");
					Date date = new Date();
					String createTime = "to_date('" + sdf.format(date)
							+ "','yyyy-mm-dd h24:mi:ss')";
					String defaultPwd = "e10adc3949ba59abbe56e057f20f883e";// 123456
					String unitId = Constant.DefaultOrgRootID == "" ? "1"
							: Constant.DefaultOrgRootID;
					while (rs.next()) {
						String pk = rs.getString(1);
						String userCode = rs.getString(2);
						String fullname = rs.getString(3);
						String userAccount = rs.getString(4);
						String sex = rs.getString(5) != null ? (rs.getString(5) == "女" ? "1"
								: "0")
								: "0";
						String unitCode = rs.getString(6);
						String unitName = rs.getString(7);
						/**
						 * 判断基建MIS系统是否有该用户，有该用户则更新相关属性，没有该用户则插入该用户
						 */
						String updateSql = "MERGE into rock_user tab1 USING"
								+ " (select '"
								+ userAccount
								+ "' as useraccount,'"
								+ fullname
								+ "' as realname from dual) tab2 on (tab1. useraccount = tab2.useraccount and tab1.realname = tab2.realname)"
								// + " when matched then update set
								// realname='"+fullname+"',sex = '"+sex+"'
								// ,useraccount = '"+userAccount+"'"
								+ " when matched then update set realname='"
								+ fullname
								+ "',sex = '"
								+ sex
								+ "'"
								+ " when not matched then insert(userid,useraccount,realname,sex,unitid,dept_id,posid,createdon,USERPASSWORD,USERSTATE,email) values"
								+ "('"
								+ pk
								+ "','"
								+ userAccount
								+ "','"
								+ fullname
								+ "','"
								+ sex
								+ "','"
								+ unitId
								+ "','"
								+ this.defaultDeptId
								+ "','"
								+ this.defaultDeptId
								+ "',"
								+ createTime
								+ ",'"
								+ defaultPwd + "','1','" + unitName + "')";
						System.out.println(updateSql);
						stmtt.addBatch(updateSql);
					}
					stmtt.executeBatch();
					return "更新成功";

				} catch (NamingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					return "更新失败" + e.getMessage();
				} finally {
					try {
						stmtt.close();
						stmt.close();
						con.close();
						conn.close();
						initCtx.close();
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
						return "更新失败" + e.getMessage();
					}
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return "更新失败" + e.getMessage();
			}
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "更新失败" + e.getMessage();
		}
	}

	public String getHRUserCont() {
		GDHRServiceImplSoapBindingStub service;
		try {
			service = (GDHRServiceImplSoapBindingStub) new GDHRServiceImplServiceLocator()
					.getGDHRServiceImpl(this.hrWsUrl);
			try {
				String res = service.getPeoplesCount();
				if (res != null && !"".equals(res)) {
					try {
						SAXBuilder sBuilder = new SAXBuilder();
						Document document = sBuilder
								.build(new StringReader(res));
						Element rootElement = (Element) document
								.getRootElement();
						Element succEle = rootElement.getChild("success");
						if ("1".equals(succEle.getTextTrim())) {
							Element countElement = rootElement
									.getChild("count");
							return countElement.getTextTrim();
						} else {
							logger.error("HR服务getPeoplesCount操作返回失败信息，失败信息为："
									+ rootElement.getChildText("message"));
							return "HR服务getPeoplesCount操作返回失败信息";
						}
					} catch (Exception e) {
						logger
								.error("HR服务getPeoplesCount操作返回值无法解析，返回值为："
										+ res);
						return "HR服务getPeoplesCount操作返回值无法解析";
					}
				}
			} catch (RemoteException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
				logger.error("HR服务getPeoplesCount操作执行失败");
				return "HR服务调用失败";
			}
		} catch (ServiceException e2) {
			// TODO Auto-generated catch block
			e2.printStackTrace();
			logger.error("HR服务调用失败");
			return "HR服务调用失败";
		}

		return "获取用户总数失败";
	}
	
	
	/**
	 * 检查是否进行过全部更新，已确定能否进行增量更新
	 * @return
	 */
	public String checkLastUpdate(){
		try {
			String path = Constant.AppClassesDir.concat("jdbc.properties");
			InputStream is = new FileInputStream(path);
			Properties p = new Properties();
			p.load(is);

			
			String ti = p.getProperty("hr.info.updatetime");
			
			if (ti == null || "".equals(ti))
				return "没有最新同步记录,请先同步所有";
			else
				return "success";
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			logger.error("本地资源文件加载失败");
			return "本地资源文件加载失败";
		} catch (IOException e) {
			e.printStackTrace();
			logger.error("本地资源文件加载失败");
			return "本地资源文件加载失败";
		}
	}

	@SuppressWarnings("all")
	public String sysHRUserByNum(Integer start, Integer end, String time) {
		GDHRServiceImplSoapBindingStub service;
		try {
			service = (GDHRServiceImplSoapBindingStub) new GDHRServiceImplServiceLocator()
					.getGDHRServiceImpl(this.hrWsUrl);
			String path = Constant.AppClassesDir.concat("jdbc.properties");

			InputStream is = new FileInputStream(path);
			Properties p = new Properties();
			p.load(is);

			String deptId = p.getProperty("hr.info.dept");
			String corps = p.getProperty("hr.info.corp");
			String ti = p.getProperty("hr.info.updatetime");
			Class.forName("oracle.jdbc.driver.OracleDriver");

			Context initCtx = null;
			Connection conn = null, con = null;
			Statement stmtt = null, stmt = null;
			initCtx = new InitialContext();
			DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
			conn = ds.getConnection();
			stmtt = conn.createStatement();
			String res = null;
			Date date = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String currentTime = sdf.format(date);
			String defaultPwd = "e10adc3949ba59abbe56e057f20f883e";// 123456
			if ("1".equals(time)) {
				if (ti == null || "".equals(ti))
					return "没有最新同步记录请同步所有";
				res = service.getNewPeoples(ti);
				FileOutputStream fio;
				Enumeration enu = p.propertyNames();
				while (enu.hasMoreElements()) {
					String key = (String) enu.nextElement();
					if ("hr.info.updatetime".equals(key)) {
						p.setProperty(key, currentTime);
					} else {
						p.setProperty(key, p.getProperty(key));
					}
				}
				fio = new FileOutputStream(path);
				p.store(fio, "end");
				fio.close();
			} else if (end > start && (time == null || "".equals(time))) {
				res = service.getPeoplesByAll(start, end);
				FileOutputStream fio;
				Enumeration enu = p.propertyNames();
				while (enu.hasMoreElements()) {
					String key = (String) enu.nextElement();
					if ("hr.info.updatetime".equals(key)) {
						p.setProperty(key, currentTime);
					} else {
						p.setProperty(key, p.getProperty(key));
					}
				}
				fio = new FileOutputStream(path);
				p.store(fio, "end");
				fio.close();
			}
			if (res != null && !"".equals(res)) {
				SAXBuilder saBuilder = new SAXBuilder();
				Document document = saBuilder.build(new StringReader(res));
				Element rootElement = (Element) document.getRootElement();
				boolean flag = false;
				if ("root".equals(rootElement.getName())) {
					Element succElement = rootElement.getChild("success");
					if ("1".equals(succElement.getTextTrim())) {
						List elList = XPath.selectNodes(rootElement,
								"/root/persons/person");
						logger.info("获取到的用户数目：" + elList.size());
						for (int i = 0; i < elList.size(); i++) {
							Element personElment = (Element) elList.get(i);
							List childList = personElment.getChildren();
							String userid = SnUtil.getNewID();
							String name = null;
							String sex = null;
							String Ucode = null;
							String Dcode = null;
							String gangwei = null;
							String loginid = null;
							String cardid = "";
							String mail = "";
							String usertype = "";
							for (int j = 0; j < childList.size(); j++) {
								Element el = (Element) childList.get(j);
								/*
								 * if ("pid".equals(el.getName())) { pid =
								 * el.getTextTrim(); continue; }
								 */
								if ("name".equals(el.getName())) {
									name = el.getTextTrim();
									continue;
								}
								if ("sex".equals(el.getName())) {
									sex = el.getTextTrim() != null ? (("男"
											.equals(el.getTextTrim()) ? "0"
											: "1")) : "0";
									continue;
								}
								if ("Ucode".equals(el.getName())) {
									Ucode = el.getTextTrim();
									continue;
								}
								if ("Dcode".equals(el.getName())) {
									Dcode = el.getTextTrim();
									continue;
								}
								if ("gangwei".equals(el.getName())) {
									gangwei = el.getTextTrim();
									continue;
								}
								if ("spellingname".equals(el.getName())) {
									loginid = el.getTextTrim();
									continue;
								}
								if ("cardid".equals(el.getName())) {
									if (el.getTextTrim() != null
											&& el.getTextTrim().length() > 6) {
										cardid = el.getTextTrim();
										MD5Util md5Util = new MD5Util();
										defaultPwd = md5Util.md5(cardid
												.substring(cardid.length() - 6,
														cardid.length() - 1));
									}
									continue;
								}
								if ("psnclassname".equals(el.getName())) {
									usertype = el.getTextTrim();
									continue;
								}
								if ("loginid".equals(el.getName())) {

									continue;
								}

							}
							// 获取组织机构
							mail = "";
							String unitRes = service.getUnitsById(Ucode);
							if (unitRes != null && !"".equals(unitRes)) {
								SAXBuilder sb = new SAXBuilder();
								Document docu = sb.build(new StringReader(
										unitRes));
								Element unitRoot = docu.getRootElement();
								if ("root".equals(unitRoot.getName())) {
									Element unitSucc = unitRoot
											.getChild("success");
									if ("1".equals(unitSucc.getTextTrim())) {
										List listUnit = XPath.selectNodes(
												unitRoot,
												"/root/units/unit/descripiton");
										if (listUnit.size() > 0) {
											Element unitElement = (Element) listUnit
													.get(0);
											if ("descripiton"
													.equals(unitElement
															.getName()))
												mail += unitElement
														.getTextTrim()
														+ "/";
										} else {
											mail += "";
										}
									}
								}
							}
							// 获取部门
							String deptRes = service.getDeptById(Dcode);
							if (deptRes != null && !"".equals(deptRes)) {
								SAXBuilder sBuilder = new SAXBuilder();
								Document doc = sBuilder.build(new StringReader(
										deptRes));
								Element deptRoot = doc.getRootElement();
								if ("root".equals(deptRoot.getName())) {
									List listdept = XPath
											.selectNodes(deptRoot,
													"/root/departs/department/description");
									if (listdept.size() > 0) {
										Element dept = (Element) listdept
												.get(0);
										if ("description"
												.equals(dept.getName()))
											mail += dept.getTextTrim() + "/";
									} else {
										mail += "";
									}
								}
							}
							if (mail == null || "".equals(mail)) {
								mail += "/";
							}
							mail += gangwei;
							mail += "/" + cardid + "/" + usertype;
							boolean isSameUser = false;
							SystemDao dao = SystemDao
									.getFromApplicationContext(Constant.wact);
							RockUser user = (RockUser) dao.findBeanByProperty(
									"com.sgepit.frame.sysman.hbm.RockUser",
									"useraccount", loginid);
							if (user != null) {
								String realname = user.getRealname();
								if (!realname.equals(name)) {// 表示该用户(登录名)在我系统中存在,但是中文姓名与我系统不一致,此种情况,需要对HR登录名做出特殊标记,加上HR_前缀
									loginid = "HR_" + loginid;
								} else { // 如果用户在我系统中存在,并且姓名与我系统一致,则认为我系统中已经存在该用户,只需要更新email字段值即可.
									isSameUser = true;
								}
							}
							String updateSql = "update rock_user set email='"
									+ mail + "' where useraccount = '"
									+ loginid + "'"; // 如果用户存在,只用更新email值
							if (!isSameUser) {
								updateSql = "insert into rock_user(userid,useraccount,realname,sex,unitid,dept_id,posid,USERPASSWORD,USERSTATE,email) values"
										+ "('"
										+ userid
										+ "','"
										+ loginid
										+ "','"
										+ name
										+ "','"
										+ sex
										+ "','"
										+ this.defaultUnitId
										+ "','"
										+ this.defaultDeptId
										+ "','"
										+ this.defaultDeptId
										+ "','"
										+ defaultPwd + "','1','" + mail + "')";
							}
							logger.info("用户同步SQL：" + updateSql);
							stmtt.addBatch(updateSql);
						}
						stmtt.executeBatch();
						return "同步数据成功," + currentTime;
					}
				}
			}
		} catch (ServiceException e) {
			e.printStackTrace();
			logger.error("HR服务getPeoplesCount操作执行失败");
			return "HR服务调用失败";
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			logger.error("本地资源文件加载失败");
			return "本地资源文件加载失败";
		} catch (IOException e) {
			e.printStackTrace();
			logger.error("本地资源文件加载失败");
			return "本地资源文件加载失败";
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
			logger.error("本地资源文件加载失败");
			return "本地资源文件加载失败";
		} catch (NamingException e) {
			e.printStackTrace();
			logger.error("本地连接池加载失败");
			return "本地连接池加载失败";
		} catch (SQLException e) {
			e.printStackTrace();
			logger.error("SQL执行异常");
			return "SQL执行异常";
		} catch (JDOMException e) {
			e.printStackTrace();
			logger.error("HR服务返回数据解析失败");
			return "HR服务返回数据解析失败";
		}
		return "同步数据失败";
	}

	public String syncHRUser(List<RockUser> userList) {
		String retMessage = "同步数据成功";
		String path = Constant.AppClassesDir.concat("jdbc.properties");
		
		Context initCtx = null;
		Connection conn = null;
		Statement stmtt = null;

		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");

			initCtx = new InitialContext();
			DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
			conn = ds.getConnection();
			stmtt = conn.createStatement();
			conn.setAutoCommit(false); 
			Date date = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String currentTime = sdf.format(date);
			String defaultPwd = "e10adc3949ba59abbe56e057f20f883e";// 123456
			
			//最近一次更新的时间保存到配置文件
			InputStream is = new FileInputStream(path);
			Properties p = new Properties();
			p.load(is);
			FileOutputStream fio;
			Enumeration enu = p.propertyNames();
			while (enu.hasMoreElements()) {
				String key = (String) enu.nextElement();
				if ("hr.info.updatetime".equals(key)) {
					p.setProperty(key, currentTime);
				} else {
					p.setProperty(key, p.getProperty(key));
				}
			}
			fio = new FileOutputStream(path);
			p.store(fio, "end");
			fio.close();

			int i = 0;
			for (RockUser rockUser : userList) {
				String updateSql;
				i++;
				if (rockUser.getUserid() == null
						|| rockUser.getUserid().equals("")) {
					updateSql = "insert into rock_user(userid,useraccount,realname,sex,unitid,dept_id,posid,USERPASSWORD,USERSTATE,email) values"
							+ "('"
							+ SnUtil.getNewID()
							+ "','"
							+ rockUser.getUseraccount()
							+ "','"
							+ rockUser.getRealname()
							+ "','"
							+ rockUser.getSex()
							+ "','"
							+ this.defaultUnitId
							+ "','"
							+ this.defaultDeptId
							+ "','"
							+ this.defaultDeptId
							+ "','"
							+ rockUser.getUserpassword()
							+ "','1','"
							+ rockUser.getEmail() + "')";
				} else {
					updateSql = "update rock_user set email='"
							+ rockUser.getEmail() + "' where userid = '"
							+ rockUser.getUserid() + "'"; // 如果用户存在,只用更新email值

				}
				logger.info("用户同步SQL：" + updateSql);
				stmtt.addBatch(updateSql);
				
				if (i % 500 == 0) {
					stmtt.executeBatch();  
					conn.commit();
					stmtt.clearBatch();
				}  
			}
			stmtt.executeBatch();
			conn.commit();
			retMessage = "同步数据成功," + currentTime;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			logger.error("本地资源文件加载失败");
			return "本地资源文件加载失败";
		} catch (IOException e) {
			e.printStackTrace();
			logger.error("本地资源文件加载失败");
			return "本地资源文件加载失败";
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
			logger.error("本地资源文件加载失败");
			return "本地资源文件加载失败";
		} catch (NamingException e) {
			e.printStackTrace();
			logger.error("本地连接池加载失败");
			return "本地连接池加载失败";
		} catch (SQLException e) {
			e.printStackTrace();
			logger.error("SQL执行异常");
			//return "SQL执行异常";
		} finally {
			try {
				stmtt.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return retMessage;
	}

	/**
	 * 返回增量同步的用户列表
	 * 
	 * @param start
	 * @param end
	 * @param time
	 * @return
	 */
	public List<RockUser> sysHRUserByNumToList(Integer start, Integer end, String time) {
		List<RockUser> returnList = new ArrayList<RockUser>();
		GDHRServiceImplSoapBindingStub service;
		try {
			
			Map<String, Integer> hrUserMap = new HashMap<String, Integer>();
			
			service = (GDHRServiceImplSoapBindingStub) new GDHRServiceImplServiceLocator()
					.getGDHRServiceImpl(this.hrWsUrl);
			String path = Constant.AppClassesDir.concat("jdbc.properties");

			InputStream is = new FileInputStream(path);
			Properties p = new Properties();
			p.load(is);

			String deptId = p.getProperty("hr.info.dept");
			String corps = p.getProperty("hr.info.corp");
			String ti = p.getProperty("hr.info.updatetime");
			
			SystemDao dao = SystemDao.getFromApplicationContext(Constant.wact);
			List<RockUser> rockUserList = dao.findByWhere(RockUser.class.getName(), "");
			Map<String, RockUser> userMap = new HashMap<String, RockUser>();
			for (int i = 0; i < rockUserList.size(); i++) {
				userMap.put(rockUserList.get(i).getUseraccount(), rockUserList.get(i));
			}

			String res = null;
			String defaultPwd = "e10adc3949ba59abbe56e057f20f883e";// 123456
			if ("1".equals(time)) {
				if (ti == null || "".equals(ti))
					return returnList;
				res = service.getNewPeoples(ti);

			} else if (end > start && (time == null || "".equals(time))) {
				res = service.getPeoplesByAll(start, end);
			}
			
//			FileWriter writer;
//			获取组织机构
			Document docu = null;
			String unitRes = service.getUnitsByAll();
			if (unitRes != null && !"".equals(unitRes)) {
				SAXBuilder sb = new SAXBuilder();
				docu = sb.build(new StringReader(unitRes));
				/*
				try {
					writer = new FileWriter("d:/hr_unit.xml");
					Format format = Format.getRawFormat();
					format.setEncoding("GBK");
					XMLOutputter xop = new XMLOutputter(format);
					xop.output(docu,writer);
				} catch (IOException e) {
					e.printStackTrace();
				}
				*/
			}
			
			// 获取部门
			Document doc = null;
			String deptRes = service.getDeptsByAll();
			if (deptRes != null && !"".equals(deptRes)) {
				SAXBuilder sBuilder = new SAXBuilder();
				doc = sBuilder.build(new StringReader(deptRes));
				/*
				try {
					writer = new FileWriter("d:/hr_dept.xml");
					Format format = Format.getRawFormat();
					format.setEncoding("GBK");
					XMLOutputter xop = new XMLOutputter(format);
					xop.output(doc,writer);
				} catch (IOException e) {
					e.printStackTrace();
				}
				*/
			}
			
			if (res != null && !"".equals(res)) {
				SAXBuilder saBuilder = new SAXBuilder();
				Document document = saBuilder.build(new StringReader(res));
				/*
				try {
					writer = new FileWriter("d:/hr_user1.xml");
					Format format = Format.getRawFormat();
					format.setEncoding("GBK");
					XMLOutputter xop = new XMLOutputter(format);
					xop.output(document,writer);
				} catch (IOException e) {
					e.printStackTrace();
				}
				*/
				Element rootElement = (Element) document.getRootElement();

				if ("root".equals(rootElement.getName())) {
					Element succElement = rootElement.getChild("success");
					if ("1".equals(succElement.getTextTrim())) {
						List elList = XPath.selectNodes(rootElement,"/root/persons/person");
						logger.info("获取到的用户数目：" + elList.size());
						for (int i = 0; i < elList.size(); i++) {
							Element personElment = (Element) elList.get(i);
							List childList = personElment.getChildren();
							String name = null;
							String sex = null;
							String Ucode = null;
							String Dcode = null;
							String gangwei = null;
							String loginid = null;
							String cardid = "";
							String mail = "";
							String usertype = "";
							for (int j = 0; j < childList.size(); j++) {
								Element el = (Element) childList.get(j);
								if ("name".equals(el.getName())) {
									name = el.getTextTrim();
									continue;
								}
								if ("sex".equals(el.getName())) {
									sex = el.getTextTrim() != null ? (("男".equals(el.getTextTrim()) ? "0" : "1")) : "0";
									continue;
								}
								if ("Ucode".equals(el.getName())) {
									Ucode = el.getTextTrim();
									continue;
								}
								if ("Dcode".equals(el.getName())) {
									Dcode = el.getTextTrim();
									continue;
								}
								if ("gangwei".equals(el.getName())) {
									gangwei = el.getTextTrim();
									continue;
								}
								if ("spellingname".equals(el.getName())) {
									loginid = el.getTextTrim();
									continue;
								}
								if ("cardid".equals(el.getName())) {
									if (el.getTextTrim() != null && el.getTextTrim().length() > 6) {
										cardid = el.getTextTrim();
										MD5Util md5Util = new MD5Util();
										defaultPwd = md5Util.md5(cardid.substring(cardid.length() - 6, cardid.length() - 1));
									}
									continue;
								}
								if ("psnclassname".equals(el.getName())) {
									usertype = el.getTextTrim();
									continue;
								}
								if ("loginid".equals(el.getName())) {
									continue;
								}

							}
							// 获取组织机构
							mail = "";
							if (docu!=null) {
								Element unitRoot = docu.getRootElement();
								List<Element> unitElList = XPath.selectNodes(unitRoot, "/root/units/unit/code[starts-with(text(),'" + Ucode + "')]");
								Element unitEl = null;
								for (int j = 0; j < unitElList.size(); j++) {
									Element unitElement = unitElList.get(j).getParentElement();
									String unitCode = unitElement.getText();
									if (unitElement!=null && unitCode.equals(Ucode)) {
										unitEl = unitElement;
										break;
									}
								}
								if (unitEl!=null) {
									Element descEl = unitEl.getChild("descripiton");
									mail += descEl.getTextTrim()+ "/";
								} else {
									mail += "";
								}
							}
							
							if (doc!=null) {
								Element deptRoot = doc.getRootElement();
								List<Element> deptElList = XPath.selectNodes(deptRoot,	"/root/departs/department/code[starts-with(text(),'" + Dcode + "')]");
								Element deptEl =null;
								for (int j = 0; j < deptElList.size(); j++) {
									Element deptElement = deptElList.get(j).getParentElement();
									String deptCode = deptElement.getText();
									if (deptElement!=null && deptCode.equals(Dcode)) {
										deptEl = deptElement;
										break;
									}
								}
								if (deptEl!=null) {
									Element descEl = deptEl.getChild("descripiton");
									mail += descEl.getTextTrim()+ "/";
								} else {
									mail += "";
								}
							}
							if (mail == null || "".equals(mail)) {
								mail += "/";
							}
							mail += gangwei;
							mail += "/" + cardid + "/" + usertype;
							System.out.println(mail);
							boolean isSameUser = false;
							/*
							RockUser user = (RockUser) dao.findBeanByProperty(
									"com.sgepit.frame.sysman.hbm.RockUser",
									"useraccount", loginid);
							*/
							RockUser user = userMap.get(loginid);
							if (user != null) {
								String realname = user.getRealname();
								if (realname==null || name==null || !realname.equals(name)) {// 表示该用户(登录名)在我系统中存在,但是中文姓名与我系统不一致,此种情况,需要对HR登录名做出特殊标记,加上HR_前缀
									loginid = "HR_" + loginid;
									if (userMap.containsKey(loginid)) {
										user = userMap.get(loginid);
										isSameUser = true;
									}
								} else { // 如果用户在我系统中存在,并且姓名与我系统一致,则认为我系统中已经存在该用户,只需要更新email字段值即可.
									isSameUser = true;
								}
							}
							RockUser hrNewUser;
							if (!isSameUser) {
								hrNewUser = new RockUser();
								// hrNewUser.setUserid(null);
								hrNewUser.setUseraccount(loginid);
								hrNewUser.setRealname(name);
								hrNewUser.setSex(sex);
								hrNewUser.setUnitid(defaultUnitId);
								hrNewUser.setDeptId(deptId);
								hrNewUser.setPosid(defaultDeptId);
								hrNewUser.setUserpassword(defaultPwd);
								hrNewUser.setUserstate("1");
								hrNewUser.setEmail(mail);

							} else {
								hrNewUser = user;
							}
							if (!hrUserMap.containsKey(loginid)) {
								hrUserMap.put(loginid, new Integer(1));
								returnList.add(hrNewUser);
							}
						}
						return returnList;
					}
				}
			}
		} catch (ServiceException e) {
			e.printStackTrace();
			logger.error("HR服务getPeoplesCount操作执行失败");
			return returnList;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			logger.error("本地资源文件加载失败");
			return returnList;
		} catch (IOException e) {
			e.printStackTrace();
			logger.error("本地资源文件加载失败");
			return returnList;
		} catch (JDOMException e) {
			e.printStackTrace();
			logger.error("HR服务返回数据解析失败");
			return returnList;
		}
		return returnList;
	}

	public String getNewTime() {
		String path = Constant.AppClassesDir.concat("jdbc.properties");// 
		Properties p = null;
		InputStream is;
		try {
			is = new FileInputStream(path);
			p = new Properties();
			p.load(is);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("获取最新更新时间失败");
			return "获取最新更新时间失败";
		}
		String ti = p.getProperty("hr.info.updatetime");
		return ti;
	}
}
