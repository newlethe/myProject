package com.sgepit.fileAndPublish.control;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.fileAndPublish.FAPConstant;
import com.sgepit.fileAndPublish.dao.ComFileInfoDAO;
import com.sgepit.fileAndPublish.dao.ComFilePublishHistoryDAO;
import com.sgepit.fileAndPublish.dao.ComFileSortDAO;
import com.sgepit.fileAndPublish.hbm.ComFileInfo;
import com.sgepit.fileAndPublish.hbm.ComFilePublishHistory;
import com.sgepit.fileAndPublish.hbm.ComFileSort;
import com.sgepit.fileAndPublish.hbm.ReformNoticeInfo;
import com.sgepit.fileAndPublish.hbm.ReformNoticeInfoView;
import com.sgepit.fileAndPublish.service.IComFileManageService;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.dao.SgccAttachListDAO;
import com.sgepit.frame.sysman.dao.SgccIniUnitDAO;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccAttachListId;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;

public class ComFileManageServlet extends MainServlet {
	private static final Log log = LogFactory.getLog(ComFileSortServlet.class);
	private WebApplicationContext wac;
	private IComFileManageService comFileManageService;

	/**
	 * Constructor of the object.
	 */
	public ComFileManageServlet() {
		super();
	}

	/**
	 * Initialization of the servlet. <br>
	 * 
	 * @throws ServletException
	 *             if an error occurs
	 */
	public void init(ServletConfig config) throws ServletException {
		// Put your code here
		ServletContext servletContext = config.getServletContext();
		this.wac = WebApplicationContextUtils
				.getRequiredWebApplicationContext(servletContext);
		this.comFileManageService = (IComFileManageService) this.wac
				.getBean("ComFileManageService");
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	/**
	 * The doGet method of the servlet. <br>
	 * 
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		this.doPost(request, response);
	}

	/**
	 * The doPost method of the servlet. <br>
	 * 
	 * This method is called when a form has its tag value method equals to
	 * post.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
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
		if (method.equals("getComFileInfoBySortId")) {
			String sortId = request.getParameter("sortId") != null ? (String) request
					.getParameter("sortId")
					: null;
			String sortIds = "";
			String whereStr = "1=1 ";
			if(pid!=null&&pid!=""){
				whereStr+="and pid = '" + pid + "'";
			}
			if ( request.getParameter("whereStr") != null ){
				whereStr += "and " + request.getParameter("whereStr");
			}
		
			String orderby = request.getParameter("orderby") != null ? (String) request
					.getParameter("orderby")
					: null;
			String showType = request.getParameter("showType") != null ? (String) request
					.getParameter("showType")
					: "1-1";
			String deptIds = request.getParameter("deptIds") != null ? (String) request
					.getParameter("deptIds")
					: Constant.DefaultOrgRootID;
			String userId = request.getSession().getAttribute(Constant.USERID)
					.toString();
			//2012-4-16 增加搜索功能
			String dateSelected = request.getParameter("dateSelected");
			String keyword = request.getParameter("keyword");
			
			/*
			 * showType参数说明 
			 * 1-0：获取以sortId为根节点所有分类下，本部门的文档
			 * 1-1：获取以sortId为根节点所有分类下，所有的文档
			 * 1-2：获取以sortId为根节点所有分类下，本部门及发布给部门和本人的文档
			 * 
			 * 0-0: 获取以sortId为根节点且具备访问权限的所有分类下，本部门的文档 
			 * 0-1：获取以sortId为根节点且具备访问权限的所有分类下，所有的文档
			 * 0-2: 获取以sortId为根节点且具备访问权限的所有分类下，本部门及发布给不部门和本人的文档 
			 * 0-3: 获取以sortId为根节点且具备访问权限的所有分类下，本部门的文档以及上报的文档
			 * 
			 * 2-0：获取以sortId为分类下，本部门的文档 
			 * 2-1：获取以sortId为分类的所有文档
			 * 2-2：获取以sortId为分类下，本部门及发布给本部门和本人的文档
			 * 
			 */
			if (showType.equals("1-1")) {
				sortIds = this.getSortIds("ALL", sortId, deptIds);
			} else if (showType.equals("1-0")) {
				sortIds = this.getSortIds("ALL", sortId, deptIds);
				whereStr = this.getWhereStr("ALL", deptIds, userId, whereStr);
			} else if (showType.equals("1-2")) {
				sortIds = this.getSortIds("ALL", sortId, deptIds);
				whereStr = this.getWhereStr("DEPT", deptIds, userId, whereStr);
			} else if (showType.equals("0-1")) {
				sortIds = this.getSortIds("RIGHT", sortId, deptIds);
			} else if (showType.equals("0-0")) {
				sortIds = this.getSortIds("RIGHT", sortId, deptIds);
				whereStr = this.getWhereStr("ALL", deptIds, userId, whereStr);
			} else if (showType.equals("0-2")) {
				sortIds = this.getSortIds("RIGHT", sortId, deptIds);
				whereStr = this.getWhereStr("DEPT", deptIds, userId, whereStr);
			} else if ( showType.equals("0-3") ){
				sortIds = getSortIds("RIGHT", sortId, deptIds);
				whereStr = this.getWhereStr("DEPT", deptIds, userId, whereStr);
				whereStr += " or report_status = 1";
			}
			
			//文件时间范围
			if ( dateSelected != null ){
				if ( dateSelected.equals("all") ){
					
				}
				else if ( dateSelected.equals("oneMonth") ){
					String dateStr = getDateStrForMonth(-1);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < file_createtime " ;
				}
				else if ( dateSelected.equals("threeMonth") ){
					String dateStr = getDateStrForMonth(-3);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < file_createtime " ;
				}
			}
			//标题查找
			if ( keyword != null ){
				whereStr += " and (file_tile like '%" + keyword + "%' or file_id like '%" + keyword + "%' )";
			}
			
			List<ComFileInfo> cfiList = this.comFileManageService
					.getComFileInfoBySortId(sortIds, whereStr, orderby, start,
							limit);
			for (int i = 0; i < cfiList.size() - 1; i++) {
				ComFileInfo comFileInfo = cfiList.get(i);
				comFileInfo = this.setComFileInfoName(comFileInfo);
			}
			String jsonStr = makeJsonDataForGrid(cfiList);
			super.outputStr(response, jsonStr);
		} 
		else if (method.equals("getComFileInfoBySortIdNoDepts")) {
			String sortId = request.getParameter("sortId") != null ? (String) request
					.getParameter("sortId")
					: null;
			String sortIds = "";
			String whereStr = "1=1 ";
			if(pid!=null&&pid!=""){
				whereStr+="and pid = '" + pid + "'";
			}
			if ( request.getParameter("whereStr") != null ){
				whereStr += "and " + request.getParameter("whereStr");
			}
		
			String orderby = request.getParameter("orderby") != null ? (String) request
					.getParameter("orderby")
					: null;
			String showType = request.getParameter("showType") != null ? (String) request
					.getParameter("showType")
					: "1-1";
			String deptIds = request.getParameter("deptIds") != null ? (String) request
					.getParameter("deptIds")
					: Constant.DefaultOrgRootID;
			String userId = request.getSession().getAttribute(Constant.USERID)
					.toString();
			//2012-4-16 增加搜索功能
			String dateSelected = request.getParameter("dateSelected");
			String keyword = request.getParameter("keyword");
			
			/*
			 * showType参数说明 
			 * 0-0: 获取以sortId为根节点且具备访问权限的所有分类下
			 */
		  if (showType.equals("0-0")) {
				sortIds = this.getSortIds("ALL", sortId, deptIds);
			}
			
			//文件时间范围
			if ( dateSelected != null ){
				if ( dateSelected.equals("all") ){
					
				}
				else if ( dateSelected.equals("oneMonth") ){
					String dateStr = getDateStrForMonth(-1);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < file_createtime " ;
				}
				else if ( dateSelected.equals("threeMonth") ){
					String dateStr = getDateStrForMonth(-3);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < file_createtime " ;
				}
			}
			//标题查找
			if ( keyword != null ){
				whereStr += " and (file_tile like '%" + keyword + "%' or file_id like '%" + keyword + "%' )";
			}
			
			List<ComFileInfo> cfiList = this.comFileManageService
					.getComFileInfoBySortId(sortIds, whereStr, orderby, start,
							limit);
			for (int i = 0; i < cfiList.size() - 1; i++) {
				ComFileInfo comFileInfo = cfiList.get(i);
				comFileInfo = this.setComFileInfoName(comFileInfo);
			}
			String jsonStr = makeJsonDataForGrid(cfiList);
			super.outputStr(response, jsonStr);
		} 		
		
		else if (method.equals("getComFileReadOrNotInfoBySortId")) {
			String sortId = request.getParameter("sortId") != null ? (String) request
					.getParameter("sortId")
					: null;
			String sortIds = "";
			String whereStr ="1=1 ";
		    if(pid!=null&&pid!=""){
		    	whereStr+="  and pid = '" + pid + "' ";
		    } else {
		    	HttpSession ses = request.getSession();
		    	String userBelongUnitTypeId = (String) ses.getAttribute(Constant.USERBELONGUNITTYPEID);
		    	if (userBelongUnitTypeId.equals("0")) {
//					集团用户，可以显示所有
				} else if (userBelongUnitTypeId.equals("2") || userBelongUnitTypeId.equals("3")) {
//					二级单位或三级单位：显示本单位及其下所有项目单位单位的数据
					String sql1 = "select unitid from (select * from sgcc_ini_unit u start with u.unitid='" + ses.getAttribute(Constant.USERBELONGUNITID) + "' connect by prior u.unitid = u.upunit) where unit_type_id = 'A'";
					List l = JdbcUtil.query(sql1);
					String unitIdStr = "";
					for (int i = 0; i < l.size(); i++) {
						Map<String, String> map = (Map<String, String>) l.get(i);
						unitIdStr += "`" + map.get("unitid");
					}
					if (unitIdStr.length()>0) {
						unitIdStr = unitIdStr.substring(1);
					}
					whereStr += " and pid in (" + StringUtil.transStrToIn(unitIdStr, "`") + ")";
				}
		    }
			if ( request.getParameter("whereStr") != null ){
				whereStr += "and " + request.getParameter("whereStr");
			}
			String orderby = request.getParameter("orderby") != null ? (String) request
					.getParameter("orderby")
					: null;
			String showType = request.getParameter("showType") != null ? (String) request
					.getParameter("showType")
					: "1-1";
			String deptIds = request.getParameter("deptIds") != null ? (String) request
					.getParameter("deptIds")
					: Constant.DefaultOrgRootID;
			//2012-4-16 增加搜索功能
			String dateSelected = request.getParameter("dateSelected");
			String keyword = request.getParameter("keyword");
			String stateSelected = request.getParameter("stateSelected")
			.toString();
			String userId = request.getParameter("userId").toString();			
			/*
			 * showType参数说明 
			 * 0-0: 获取以sortId为根节点且具备访问权限的所有分类下，
			 */
			if (showType.equals("1-1")) {
				sortIds = this.getSortIds("ALL", sortId, deptIds);
			} else if (showType.equals("1-0")) {
				sortIds = this.getSortIds("ALL", sortId, deptIds);
				whereStr = this.getWhereStr("ALL", deptIds, userId, whereStr);
			} else if (showType.equals("1-2")) {
				sortIds = this.getSortIds("ALL", sortId, deptIds);
				whereStr = this.getWhereStr("DEPT", deptIds, userId, whereStr);
			} else if (showType.equals("0-1")) {
				sortIds = this.getSortIds("RIGHT", sortId, deptIds);
			} else if (showType.equals("0-0")) {
				sortIds = this.getSortIds("ALL", sortId, deptIds);
			} else if (showType.equals("0-2")) {
				sortIds = this.getSortIds("RIGHT", sortId, deptIds);
				whereStr = this.getWhereStr("DEPT", deptIds, userId, whereStr);
			} else if ( showType.equals("0-3") ){
				sortIds = getSortIds("RIGHT", sortId, deptIds);
				whereStr = this.getWhereStr("DEPT", deptIds, userId, whereStr);
				whereStr += " or report_status = 1";
			}
			
			//文件时间范围
			if ( dateSelected != null ){
				if ( dateSelected.equals("all") ){
					
				}
				else if ( dateSelected.equals("oneMonth") ){
					String dateStr = getDateStrForMonth(-1);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < file_createtime " ;
				}
				else if ( dateSelected.equals("threeMonth") ){
					String dateStr = getDateStrForMonth(-3);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < file_createtime " ;
				}
			}
			//标题查找
			if ( keyword != null ){
				whereStr += " and (file_tile like '%" + keyword + "%' or file_id like '%" + keyword + "%' )";
			}
			
			List<ComFileInfo> cfiList = this.comFileManageService
					.getComFileoReadOrNotInfoBySortId(sortIds,stateSelected,userId, whereStr, orderby, start,
							limit);
			for (int i = 0; i < cfiList.size() - 1; i++) {
				ComFileInfo comFileInfo = cfiList.get(i);
				comFileInfo = this.setComFileInfoNameWithFlag(userId,comFileInfo);
			}
			String jsonStr = makeJsonDataForGrid(cfiList);
			super.outputStr(response, jsonStr);
		} 
		
		
		else if (method.equals("saveNewLocalFile")) {
			String rtn = "{success:";
			InputStream in = null;

			boolean isMultiPart = ServletFileUpload.isMultipartContent(request);// 必须是multi的表单模式才行
			if (isMultiPart) {
				try {
					String tmp = Constant.AppRootDir
							.concat(Constant.TEMPFOLDER);
					File f2 = new File(tmp);
					if (!f2.exists()) {
						f2.mkdirs();
					}
					DiskFileItemFactory factory = new DiskFileItemFactory();
					factory.setSizeThreshold(10 * 2014);
					factory.setRepository(new File(tmp));
					ServletFileUpload upload = new ServletFileUpload(factory);
					// 解决文件名乱码问题
					upload.setHeaderEncoding("UTF-8");
					List items = upload.parseRequest(request);
					Iterator iter = items.iterator();

					ComFileInfo comFileInfo = new ComFileInfo();

					while (iter.hasNext()) {
						FileItem item = (FileItem) iter.next();

						if (!item.isFormField() && item.getSize() >= 0) {
							String filePath = item.getName();

							// 保存文件名 10-12-28 用于在线文档编辑后的保存
							if (filePath.indexOf(".") > 0) {
								String fileName = filePath.substring(filePath
										.lastIndexOf("\\") + 1, filePath
										.lastIndexOf("."));
								comFileInfo.setFileName(fileName);

								// 保存文件后缀名
								String fileSuffix = filePath.substring(filePath
										.lastIndexOf(".") + 1, filePath
										.length());
								comFileInfo.setFileSuffix(fileSuffix);
							} else {

								comFileInfo
										.setFileName(filePath
												.substring(filePath
														.lastIndexOf("\\") + 1));

							}

							in = item.getInputStream();
						} else {
							String fName = item.getFieldName();
							String tempValue = StringUtil.getInputStream(item
									.getInputStream(), Constant.ENCODING);
							if (fName.equals("fileTile")) {
								comFileInfo.setFileTile(tempValue);
							} else if (fName.equals("fileContent")) {
								comFileInfo.setFileContent(tempValue);
							} else if (fName.equals("fileCreatetime")) {
								DateFormat df = new SimpleDateFormat(
										"yyyy-MM-dd HH:mm:ss");
								df.setTimeZone(TimeZone.getTimeZone("GMT+8"));
								if (tempValue != null && !tempValue.equals("")) {
									comFileInfo.setFileCreatetime(df
											.parse(tempValue));
								}
							} else if (fName.equals("fileId")) {
								comFileInfo.setFileId(tempValue);
							} else if (fName.equals("billState")) {
								comFileInfo.setBillState(Long
										.valueOf(tempValue));
							} else if (fName.equals("statePublish")) {
								comFileInfo.setPublisStateName(tempValue);
							} else if (fName.equals("fileSortId")) {
								comFileInfo.setFileSortId(tempValue);
							} else if (fName.equals("fileAuther")) {
								comFileInfo.setFileAuther(tempValue);
							} else if (fName.equals("fileDept")) {
								comFileInfo.setFileDept(tempValue);
							} else if (fName.equals("pid")) {
								comFileInfo.setPid(tempValue);
							} else if (fName.equals("reportStatus")){
								comFileInfo.setReportStatus(Integer.valueOf(tempValue));
							} else if (fName.equals("uids")){	//主键值在页面上生成，用于在保存到数据库之前也可以上传附件
								comFileInfo.setUids(tempValue);
							}

						}
					}
					
					String fileUids = this.comFileManageService.saveNewFile(
							comFileInfo, in);
					rtn += "true,msg:'" + fileUids + "'}";
					
				} catch (Exception ex) {
					rtn += "false,msg:'" + ex.getMessage() + "'}";
					ex.printStackTrace();
				}
			}
			outputStr(response, rtn);
		} else if (method.equals("updateFileInfo")) {
			String rtn = "{success:";
			try {
				String json = StringUtil.getInputStream(request
						.getInputStream(), Constant.ENCODING);
				// String json =
				// request.getParameter("xmlData")==null?"":request.getParameter("xmlData").toString();
				System.out.println(json);

				String beanName = ComFileInfo.class.getName();
				ComFileInfo newComFileInfo = (ComFileInfo) JSONObject.toBean(
						JSONObject.fromObject(json), Class.forName(beanName));

				ComFileInfoDAO comFileInfoDAO = ComFileInfoDAO.getInstance();
				ComFileInfo oldComFileInfo = (ComFileInfo) comFileInfoDAO
						.findById(newComFileInfo.getUids());

				String fileCreatetimeStr = newComFileInfo
						.getFileCreatetimeStr();
				if (fileCreatetimeStr != null && fileCreatetimeStr.length() > 0) {
					DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					df.setTimeZone(TimeZone.getTimeZone("GMT+8"));
					oldComFileInfo.setFileCreatetime(df
							.parse(fileCreatetimeStr));
				}
				oldComFileInfo.setFileContent(newComFileInfo.getFileContent());
				oldComFileInfo.setFileId(newComFileInfo.getFileId());
				oldComFileInfo.setFileSortId(newComFileInfo.getFileSortId());
				oldComFileInfo.setFileTile(newComFileInfo.getFileTile());
				comFileInfoDAO.saveOrUpdate(oldComFileInfo);
				rtn += "true,msg:'OK'}";
			} catch (Exception ex) {
				rtn += "false,msg:'" + ex.getMessage() + "'}";
				ex.printStackTrace();
			}
			outputStr(response, rtn);
		} else if (method.equals("getComFileInfoPbulishedByUserId")) {

			String dateSelected = request.getParameter("dateSelected")
					.toString();
			String stateSelected = request.getParameter("stateSelected")
					.toString();
			String userId = request.getParameter("userId").toString();
			String deptId = request.getParameter("deptId").toString();
			String sortId = request.getParameter("sortId");
			String whereStr = request.getParameter("whereStr").toString();
			String orderBy = request.getParameter("orderby").toString();
			String keyword = request.getParameter("keyword");
			if (sortId != null) {
				if (whereStr == null || whereStr.equals("")) {
					whereStr = "1=1 ";
				}
				whereStr += " and file_id in (select uids from com.sgepit.fileAndPublish.hbm.ComFileInfo where fileSortId in ("
						+ StringUtil.transStrToIn(this.getSortIds("ALL",
								sortId, null).substring(1), FAPConstant.SPLITB)
						+ "))";
			}
			List<ComFilePublishHistory> phList = this.comFileManageService
					.getFileListByPublish(dateSelected, stateSelected, userId,
							deptId, whereStr, keyword, orderBy, start, limit);
			for (int i = 0; i < phList.size() - 1; i++) {
				this.setComFilePublishHistoryProperty(userId, phList.get(i));
			}
			String jsonStr = makeJsonDataForGrid(phList);
			super.outputStr(response, jsonStr);
		} else if (method.equals("getJsonStrForTransToZLS")) {
			String fileId = request.getParameter("fileId").toString();
			String fileTypes = "FAPDocument,FAPAttach";
			String yjrName = request.getParameter("yjrName").toString();
			String jsonStr = this.comFileManageService.getJsonStrForTransToZLS(
					fileId, fileTypes, yjrName);
			super.outputStr(response, jsonStr);
		}
		
		else if(method.equals("buildingUnitNewTree")){
			buildingUnitNewTree(request, response);
			return;
		}
		 else if (method.equals("getJsonStrForTransToZLSByType")) {
				String fileId = request.getParameter("fileId").toString();
				String fileTypes = "FAPDocument,FAPAttach,PCBidApplyReport,PCBidNoticeOther,PCBidOpenBidOther,PCBidAssessReport," +
						"PCBidPreVeryfy,PCBidApplicantOther,PCBidFile,PCBidFile,PCBidClarifyContent,PCBidIssueWinNotice," +
						"PCBidAgency,PCBidAgencyOther,PCBidAgencyContract,PCBidNotice";
				String yjrName = request.getParameter("yjrName").toString();
				String type = request.getParameter("type")==null?"":request.getParameter("type").toString();
				String jsonStr = this.comFileManageService.getJsonStrForTransToZLSByType(
						type,fileId, fileTypes, yjrName);
				super.outputStr(response, jsonStr);
			}
		//整改通知单
		else if (method.equals("getReformNoticeBySortIdNoDepts")) {
			String sortId = request.getParameter("sortId") != null ? (String) request.getParameter("sortId") : null;
			String sortIds = "";
			String whereStr = "1=1 ";
			if (pid!=null&&pid!=""){
				whereStr+="and pid = '" + pid + "'";
			}
			if (request.getParameter("whereStr") != null ){
				whereStr += "and " + request.getParameter("whereStr");
			}
			String orderby = request.getParameter("orderby") != null ? (String) request.getParameter("orderby") : null;
			String showType = request.getParameter("showType") != null ? (String) request.getParameter("showType") : "1-1";
			String deptIds = request.getParameter("deptIds") != null ? (String) request.getParameter("deptIds") : Constant.DefaultOrgRootID;
			
			String dateSelected = request.getParameter("dateSelected");
			String keyword = request.getParameter("keyword");
			
			/*
			 * showType参数说明 
			 * 0-0: 获取以sortId为根节点且具备访问权限的所有分类下
			 */
			if (showType.equals("0-0")) {
				sortIds = this.getSortIds("ALL", sortId, deptIds);
			}
			
			//文件时间范围
			if (dateSelected != null ){
				if (dateSelected.equals("all") ){
				
				} else if (dateSelected.equals("oneMonth") ){
					String dateStr = getDateStrForMonth(-1);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < file_createtime " ;
				} else if (dateSelected.equals("threeMonth") ){
					String dateStr = getDateStrForMonth(-3);
					whereStr += " and to_date(" + dateStr +  ",'YYYYMMDD') < file_createtime " ;
				}
			}
			//标题查找
			if (keyword != null ){
				whereStr += " and (file_tile like '%" + keyword + "%' or file_id like '%" + keyword + "%' )";
			}
			
			List<ReformNoticeInfoView> refList = this.comFileManageService.getReformNoticeBySortId(sortIds, whereStr, orderby, start, limit);
			for (int i = 0; i < refList.size() - 1; i++) {
				ReformNoticeInfoView ref = refList.get(i);
				ComFileInfo comfi = new ComFileInfo();
				comfi.setBillState(ref.getBillState());
				comfi.setStatePublish(ref.getStatePublish());
				comfi.setFileAuther(ref.getFileAuther());
				comfi.setFileDept(ref.getFileDept());
				comfi.setFileSortId(ref.getFileSortId());
				comfi = this.setComFileInfoName(comfi);
				ref.setFileUnitName(comfi.getFileUnitName());
				ref.setBillStateName(comfi.getBillStateName());
				ref.setFileAutherName(comfi.getFileAutherName());
				ref.setFileDeptName(comfi.getFileDeptName());
				ref.setFileSortName(comfi.getFileSortName());
				ref.setPublisStateName(comfi.getPublisStateName());
				ref.setIsTransfered(comfi.getIsTransfered());
				ref.setFileName(comfi.getFileName());
				ref.setFileSuffix(comfi.getFileSuffix());
			}
			String jsonStr = makeJsonDataForGrid(refList);
			super.outputStr(response, jsonStr);
		}
		//新增整改通知单
		else if (method.equals("saveNewReformNotice")) {
			String rtn = "{success:";
			InputStream in = null;

			boolean isMultiPart = ServletFileUpload.isMultipartContent(request);// 必须是multi的表单模式才行
			if (isMultiPart) {
				try {
					String tmp = Constant.AppRootDir.concat(Constant.TEMPFOLDER);
					File f2 = new File(tmp);
					if (!f2.exists()) {
						f2.mkdirs();
					}
					DiskFileItemFactory factory = new DiskFileItemFactory();
					factory.setSizeThreshold(10 * 2014);
					factory.setRepository(new File(tmp));
					ServletFileUpload upload = new ServletFileUpload(factory);
					// 解决文件名乱码问题
					upload.setHeaderEncoding("UTF-8");
					List items = upload.parseRequest(request);
					Iterator iter = items.iterator();

					ComFileInfo comFileInfo = new ComFileInfo();

					while (iter.hasNext()) {
						FileItem item = (FileItem) iter.next();
						if (!item.isFormField() && item.getSize() >= 0) {
							String filePath = item.getName();
							// 保存文件名 10-12-28 用于在线文档编辑后的保存
							if (filePath.indexOf(".") > 0) {
								String fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.lastIndexOf("."));
								comFileInfo.setFileName(fileName);
								// 保存文件后缀名
								String fileSuffix = filePath.substring(filePath.lastIndexOf(".") + 1, filePath.length());
								comFileInfo.setFileSuffix(fileSuffix);
							} else {
								comFileInfo.setFileName(filePath.substring(filePath.lastIndexOf("\\") + 1));
							}
							in = item.getInputStream();
						} else {
							String fName = item.getFieldName();
							String tempValue = StringUtil.getInputStream(item
									.getInputStream(), Constant.ENCODING);
							if (fName.equals("fileTile")) {
								comFileInfo.setFileTile(tempValue);
							} else if (fName.equals("fileContent")) {
								comFileInfo.setFileContent(tempValue);
							} else if (fName.equals("fileCreatetime")) {
								DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
								df.setTimeZone(TimeZone.getTimeZone("GMT+8"));
								if (tempValue != null && !tempValue.equals("")) {
									comFileInfo.setFileCreatetime(df.parse(tempValue));
								}
							} else if (fName.equals("fileId")) {
								comFileInfo.setFileId(tempValue);
							} else if (fName.equals("billState")) {
								comFileInfo.setBillState(Long.valueOf(tempValue));
							} else if (fName.equals("statePublish")) {
								comFileInfo.setStatePublish(Long.valueOf(tempValue));
							} else if (fName.equals("fileSortId")) {
								comFileInfo.setFileSortId(tempValue);
							} else if (fName.equals("fileAuther")) {
								comFileInfo.setFileAuther(tempValue);
							} else if (fName.equals("fileDept")) {
								comFileInfo.setFileDept(tempValue);
							} else if (fName.equals("pid")) {
								comFileInfo.setPid(tempValue);
							} else if (fName.equals("reportStatus")){
								comFileInfo.setReportStatus(Integer.valueOf(tempValue));
							} else if (fName.equals("uids")){	//主键值在页面上生成，用于在保存到数据库之前也可以上传附件
								comFileInfo.setUids(tempValue);
							}
						}
					}
					String comfileUids = this.comFileManageService.saveNewFile(comFileInfo, in);
					ReformNoticeInfo ref = new ReformNoticeInfo();
					ref.setComfileUids(comfileUids);
					ref.setIsreform(0L);
					ref.setPid(comFileInfo.getPid());
					ref.setReportState("0");
					this.comFileManageService.saveNewReformNotice(ref);
					rtn += "true,msg:'" + comfileUids + "'}";
				} catch (Exception ex) {
					rtn += "false,msg:'" + ex.getMessage() + "'}";
					ex.printStackTrace();
				}
			}
			super.outputStr(response, rtn);
		}
		//已审批的整改通知单查询
		else if (method.equals("getReformNoticeInfoPublished")) {
				String dateSelected = request.getParameter("dateSelected").toString();
				String stateSelected = request.getParameter("stateSelected").toString();
				String userId = request.getParameter("userId").toString();
				String sortId = request.getParameter("sortId");
				String whereStr = request.getParameter("whereStr").toString();
				String orderBy = request.getParameter("orderby").toString();
				String keyword = request.getParameter("keyword");
				if (sortId != null) {
					if (whereStr == null || whereStr.equals("")) {
						whereStr = "1=1 ";
					}
					whereStr += " and file_id in (select comfileUids from com.sgepit.fileAndPublish.hbm.ReformNoticeInfoView"
								+ " where reportState = '3' and fileSortId in (" + StringUtil.transStrToIn(
								this.getSortIds("ALL", sortId, null).substring(1), FAPConstant.SPLITB) + "))";
				}
				List<ComFilePublishHistory> phList = this.comFileManageService.getReformNoticeListByPublish(
							dateSelected, stateSelected, userId,whereStr, keyword, orderBy, start, limit);
				for (int i = 0; i < phList.size() - 1; i++) {
					this.setComFilePublishHistoryProperty(userId, phList.get(i));
				}
				String jsonStr = makeJsonDataForGrid(phList);
				super.outputStr(response, jsonStr);
			}
	}

	private void buildingUnitNewTree(HttpServletRequest request,
			HttpServletResponse response)  throws IOException {
		Map paramsmap = new HashMap();
		Enumeration  enumer = request.getParameterNames();
		while(enumer.hasMoreElements()){
			String key = enumer.nextElement().toString();
			paramsmap.put(key,request.getParameter(key));
		}
		String unitid=request.getParameter("unitid");
		String upunit=request.getParameter("upunit");
		String hascheck=request.getParameter("hascheck");
		String USERBELONGUNITTYPEID=request.getParameter("USERBELONGUNITTYPEID");
		paramsmap.put("DefaultOrgRootID", Constant.DefaultOrgRootID);
		paramsmap.put(Constant.UNITTYPE, request.getSession().getAttribute(Constant.UNITTYPE));
		paramsmap.put(Constant.USERID, request.getSession().getAttribute(Constant.USERID));
		paramsmap.put(Constant.USERUNITID, upunit);
		paramsmap.put(Constant.USERDEPTID, request.getSession().getAttribute(Constant.USERDEPTID));
		paramsmap.put(Constant.USERPOSID, request.getSession().getAttribute(Constant.USERPOSID));
		paramsmap.put("unitid", unitid);
		paramsmap.put("upunit", upunit);
		paramsmap.put("hascheck", hascheck);
		outputString(response, this.comFileManageService.syncBuilding3GroupUnitNewTree(paramsmap));
	}
	private String getSortIds(String type, String sortId, String deptIds) {
		String sortIds = "";
		if (type.equals("ALL")) {
			String sortSql = "select uids from  (select uids from  COM_FILE_SORT t start WITH uids = '"
					+ sortId + "' connect by PRIOR uids = parent_id) ";
			List<Map> list = JdbcUtil.query(sortSql);
			for (int i = 0; i < list.size(); i++) {
				sortIds += FAPConstant.SPLITB
						+ list.get(i).get("uids").toString();
			}
		} else {
			String sortSql = "select uids from  (select uids from  COM_FILE_SORT t start WITH uids = '"
					+ sortId
					+ "' connect by PRIOR uids = parent_id) "
					+ " where uids in (select file_sort_id from com_file_sort_dept where dept_id in ("
					+ StringUtil.transStrToIn(deptIds, FAPConstant.SPLITB)
					+ ") and "
					+ " right_lvl <> '"
					+ FAPConstant.right_None
					+ "')";
			List<Map> list = JdbcUtil.query(sortSql);
			for (int i = 0; i < list.size(); i++) {
				sortIds += FAPConstant.SPLITB
						+ list.get(i).get("uids").toString();
			}
		}
		return sortIds;
	}

	private String getWhereStr(String type, String deptIds, String userId,
			String whereStr) {
		if (type.equals("ALL")) {
			whereStr += " and file_dept in ("
					+ StringUtil.transStrToIn(deptIds, FAPConstant.SPLITB)
					+ ")";
		} else if (type.equals("DEPT")) {
			whereStr += " and file_dept in ("
					+ StringUtil.transStrToIn(deptIds, FAPConstant.SPLITB)
					+ ")";

			ComFilePublishHistoryDAO comFilePublishHistoryDAO = ComFilePublishHistoryDAO
					.getInstance();
			List<ComFilePublishHistory> historyList = comFilePublishHistoryDAO
					.findWhere("(publish_type = 'group' and receiver in ("
							+ StringUtil.transStrToIn(deptIds,
									FAPConstant.SPLITB) + "))"
							+ " or (publish_type = 'person'  and receiver = '"
							+ userId + "')");
			if (historyList.size() > 0) {
				String fileStr = "";
				for (int i = 0; i < historyList.size(); i++) {
					fileStr += FAPConstant.SPLITB
							+ historyList.get(i).getFileId();
				}
//				whereStr = "(" + whereStr + ") or (uids in("
//						+ StringUtil.transStrToIn(deptIds, FAPConstant.SPLITB)
//						+ "))";
			}
		}
		return whereStr;
	}

	/**
	 * 设置属性名称
	 * 
	 * @param comFileInfo
	 * @return
	 */
	private ComFileInfo setComFileInfoName(ComFileInfo comFileInfo) {
		Long billState = comFileInfo.getBillState();
		Long statePublish = comFileInfo.getStatePublish();
		String fileAuther = comFileInfo.getFileAuther();
		String fileDeptId = comFileInfo.getFileDept();
		String fileSortId = comFileInfo.getFileSortId();

		PropertyCodeDAO pcDAO = PropertyCodeDAO.getInstence();
		String billStateName = pcDAO.getCodeNameByPropertyName(String
				.valueOf(billState), "流程状态");
		String statePublishName = pcDAO.getCodeNameByPropertyName(String
				.valueOf(statePublish), "信息发布状态");
		String fileDeptName = "";
		//2012-4-12 发布人所属单位
		String fileUnitName = null;
		String fileUnitId = null;
		SgccIniUnitDAO unitDAO = SgccIniUnitDAO.getInstence();
		SgccIniUnit unit = (SgccIniUnit) unitDAO.findBeanByProperty(
				"unitid", fileDeptId);
		if (unit != null) {
			fileDeptName = unit.getUnitname();
		}
		String fileAutherName = "";
		List<Map> userList = JdbcUtil
				.query("select realname, unitid from rock_user where userid = '"
						+ fileAuther + "'");
		if (userList.size() == 1) {
			if (userList.get(0) != null
					&& userList.get(0).get("realname") != null) {
				fileAutherName = userList.get(0).get("realname").toString();
				if ( userList.get(0).get("unitid") != null ){
					fileUnitId = userList.get(0).get("unitid").toString();
				}
			}
		}
		
		if ( fileUnitId != null  ){
			if ( fileUnitId.equals(fileDeptId) ){
				fileUnitName = fileDeptName;
			}
			else{
				String sql = "select unitname from sgcc_ini_unit where unitid = '" + fileUnitId + "'";
				List<Map> unitList = JdbcUtil.query(sql);
				if ( unitList.size() > 0 ){
					fileUnitName = unitList.get(0).get("unitname").toString();
				}
			}
			comFileInfo.setFileUnitName(fileUnitName);
		}
		String fileSortName = "";
		ComFileSortDAO sortDAO = ComFileSortDAO.getInstance();
		ComFileSort sort = (ComFileSort) sortDAO.findById(fileSortId);
		if (sort != null) {
			fileSortName = sort.getSortName();
		}

		comFileInfo.setBillStateName(billStateName);
		comFileInfo.setFileAutherName(fileAutherName);
		comFileInfo.setFileDeptName(fileDeptName);
		comFileInfo.setFileSortName(fileSortName);
		comFileInfo.setPublisStateName(statePublishName == null ? "未发布"
				: statePublishName);

		// 填充文件的附件文件名，移交状态字段
		SgccAttachListDAO attachListDAO = SgccAttachListDAO.getInstance();
		// 找到当前记录对应的主文档
		// 生成联合主键
		SgccAttachListId attachListId = new SgccAttachListId("FAPDocument",
				comFileInfo.getUids(), comFileInfo.getFileLsh());
		Object attObj = attachListDAO.findByCompId(attachListId);
		if (attObj != null) {
			SgccAttachList attachList = (SgccAttachList) attObj;

			// 移交状态
			if (attachList.getIsTrans() != null) {
				if (attachList.getIsTrans().equals("1")) {
					comFileInfo.setIsTransfered(true);
				} else {
					comFileInfo.setIsTransfered(false);
				}
			} else {
				comFileInfo.setIsTransfered(false);
			}

			// 附件的文件名,在线编辑保存时需要
			String fileFullName = attachList.getFileName();
			int dotIndex = fileFullName.lastIndexOf(".");
			String fileName = "";
			String fileSuffix = "";
			if (dotIndex < 0) {
				fileName = fileFullName;
			} else {
				fileName = fileFullName.substring(0, dotIndex);
				fileSuffix = fileFullName.substring(dotIndex + 1);
			}

			comFileInfo.setFileName(fileName);
			comFileInfo.setFileSuffix(fileSuffix);

		}
		return comFileInfo;
	}

	/**
	 * 设置属性名称
	 * 
	 * @param comFileInfo
	 * @return
	 */
	private ComFilePublishHistory setComFilePublishHistoryProperty(
			String userId, ComFilePublishHistory comFilePublishHistory) {
		String fileUids = comFilePublishHistory.getFileId();
		ComFileInfo comFileInfo = (ComFileInfo) ComFileInfoDAO.getInstance()
				.findById(fileUids);
		if (comFileInfo != null) {
			comFilePublishHistory.setFileLsh(comFileInfo.getFileLsh());
			comFilePublishHistory.setFileTile(comFileInfo.getFileTile());
			comFilePublishHistory.setFileBh(comFileInfo.getFileId());
			comFilePublishHistory.setFileContent(comFileInfo.getFileContent());

			comFilePublishHistory.setFileCreatetime(comFileInfo
					.getFileCreatetime());
			Long billState = comFileInfo.getBillState();
			Long statePublish = comFileInfo.getStatePublish();
			String fileAuther = comFileInfo.getFileAuther();
			String fileDeptId = comFileInfo.getFileDept();
			String fileSortId = comFileInfo.getFileSortId();

			PropertyCodeDAO pcDAO = PropertyCodeDAO.getInstence();
			String billStateName = pcDAO.getCodeNameByPropertyName(String
					.valueOf(billState), "流程状态");
			String statePublishName = pcDAO.getCodeNameByPropertyName(String
					.valueOf(statePublish), "信息发布状态");
			String fileDeptName = "";
			//2012-4-12 发布人所属单位
			String fileUnitName = null;
			String fileUnitId = null;
			SgccIniUnitDAO unitDAO = SgccIniUnitDAO.getInstence();
			SgccIniUnit unit = (SgccIniUnit) unitDAO.findBeanByProperty(
					"unitid", fileDeptId);
			if (unit != null) {
				fileDeptName = unit.getUnitname();
			}
			String fileAutherName = "";
			List<Map> userList = JdbcUtil
					.query("select realname, unitid from rock_user where userid = '"
							+ fileAuther + "'");
			if (userList.size() == 1) {
				if (userList.get(0) != null
						&& userList.get(0).get("realname") != null) {
					fileAutherName = userList.get(0).get("realname").toString();
					if ( userList.get(0).get("unitid") != null ){
						fileUnitId = userList.get(0).get("unitid").toString();
					}
				}
			}
			
			if ( fileUnitId != null  ){
				if ( fileUnitId.equals(fileDeptId) ){
					fileUnitName = fileDeptName;
				}
				else{
					String sql = "select unitname from sgcc_ini_unit where unitid = '" + fileUnitId + "'";
					List<Map> unitList = JdbcUtil.query(sql);
					if ( unitList.size() > 0 ){
						fileUnitName = unitList.get(0).get("unitname").toString();
					}
				}
				comFilePublishHistory.setFileUnitName(fileUnitName);
			}
			
			
			String fileSortName = "";
			ComFileSortDAO sortDAO = ComFileSortDAO.getInstance();
			ComFileSort sort = (ComFileSort) sortDAO.findById(fileSortId);
			if (sort != null) {
				fileSortName = sort.getSortName();
			}
			comFilePublishHistory.setBillStateName(billStateName);
			comFilePublishHistory.setFileAutherName(fileAutherName);
			comFilePublishHistory.setFileDeptName(fileDeptName);
			comFilePublishHistory.setFileSortName(fileSortName);
			comFilePublishHistory
					.setPublisStateName(statePublishName == null ? "未发布"
							: statePublishName);

			String publishUserId = comFilePublishHistory.getPublishUser();
			String publishUserName = "";
			List<Map> userList2 = JdbcUtil
					.query("select realname from rock_user where userid = '"
							+ publishUserId + "'");
			if (userList2.size() == 1) {
				if (userList2.get(0) != null
						&& userList2.get(0).get("realname") != null) {
					publishUserName = userList2.get(0).get("realname")
							.toString();
				}
			}
			comFilePublishHistory.setPublishUserName(publishUserName);

			List readList = JdbcUtil
					.query("select file_id from com_file_read_history where file_id = '"
							+ fileUids + "' and FILE_READER = '" + userId + "'");
			String str;
			if (readList.size() == 0) {
				str = "<img src='"+Constant.AppRoot+"jsp/res/images/new.gif'></img>[未读] "
						+ comFilePublishHistory.getFileTile();
				
			} else {
				str = "[已读] "
						+ comFilePublishHistory.getFileTile();
				
			}
			if (comFilePublishHistory.getFileBh() != null) {
				str += "【" + comFilePublishHistory.getFileBh() + "】";
			}
			comFilePublishHistory.setFileTile(str);

		}

		return comFilePublishHistory;
	}
	
	private String getDateStrForMonth( int monthAgo ){
		String dateStr = "";
		Calendar calendar = Calendar.getInstance();
		
		calendar.add(Calendar.MONTH, monthAgo);
		DateFormat format = new SimpleDateFormat("yyyyMMdd");
		return format.format(calendar.getTime());
	}
	/**
	 * 设置属性名称,带已读未读标记的
	 * 
	 * @param comFileInfo
	 * @return
	 */
	private ComFileInfo setComFileInfoNameWithFlag(String userId,ComFileInfo comFileInfo) {
		Long billState = comFileInfo.getBillState();
		Long statePublish = comFileInfo.getStatePublish();
		String fileAuther = comFileInfo.getFileAuther();
		String fileDeptId = comFileInfo.getFileDept();
		String fileSortId = comFileInfo.getFileSortId();

		PropertyCodeDAO pcDAO = PropertyCodeDAO.getInstence();
		String billStateName = pcDAO.getCodeNameByPropertyName(String
				.valueOf(billState), "流程状态");
		String statePublishName = pcDAO.getCodeNameByPropertyName(String
				.valueOf(statePublish), "信息发布状态");
		String fileDeptName = "";
		//2012-4-12 发布人所属单位
		String fileUnitName = null;
		String fileUnitId = null;
		SgccIniUnitDAO unitDAO = SgccIniUnitDAO.getInstence();
		SgccIniUnit unit = (SgccIniUnit) unitDAO.findBeanByProperty(
				"unitid", fileDeptId);
		if (unit != null) {
			fileDeptName = unit.getUnitname();
		}
		String fileAutherName = "";
		List<Map> userList = JdbcUtil
				.query("select realname, unitid from rock_user where userid = '"
						+ fileAuther + "'");
		if (userList.size() == 1) {
			if (userList.get(0) != null
					&& userList.get(0).get("realname") != null) {
				fileAutherName = userList.get(0).get("realname").toString();
				if ( userList.get(0).get("unitid") != null ){
					fileUnitId = userList.get(0).get("unitid").toString();
				}
			}
		}
		
		if ( fileUnitId != null  ){
			if ( fileUnitId.equals(fileDeptId) ){
				fileUnitName = fileDeptName;
			}
			else{
				String sql = "select unitname from sgcc_ini_unit where unitid = '" + fileUnitId + "'";
				List<Map> unitList = JdbcUtil.query(sql);
				if ( unitList.size() > 0 ){
					fileUnitName = unitList.get(0).get("unitname").toString();
				}
			}
			comFileInfo.setFileUnitName(fileUnitName);
		}
		String fileSortName = "";
		ComFileSortDAO sortDAO = ComFileSortDAO.getInstance();
		ComFileSort sort = (ComFileSort) sortDAO.findById(fileSortId);
		if (sort != null) {
			fileSortName = sort.getSortName();
		}

		comFileInfo.setBillStateName(billStateName);
		comFileInfo.setFileAutherName(fileAutherName);
		comFileInfo.setFileDeptName(fileDeptName);
		comFileInfo.setFileSortName(fileSortName);
		comFileInfo.setPublisStateName(statePublishName == null ? "未发布"
				: statePublishName);

		// 填充文件的附件文件名，移交状态字段
		SgccAttachListDAO attachListDAO = SgccAttachListDAO.getInstance();
		// 找到当前记录对应的主文档
		// 生成联合主键
		SgccAttachListId attachListId = new SgccAttachListId("FAPDocument",
				comFileInfo.getUids(), comFileInfo.getFileLsh());
		Object attObj = attachListDAO.findByCompId(attachListId);
		if (attObj != null) {
			SgccAttachList attachList = (SgccAttachList) attObj;

			// 移交状态
			if (attachList.getIsTrans() != null) {
				if (attachList.getIsTrans().equals("1")) {
					comFileInfo.setIsTransfered(true);
				} else {
					comFileInfo.setIsTransfered(false);
				}
			} else {
				comFileInfo.setIsTransfered(false);
			}

			// 附件的文件名,在线编辑保存时需要
			String fileFullName = attachList.getFileName();
			int dotIndex = fileFullName.lastIndexOf(".");
			String fileName = "";
			String fileSuffix = "";
			if (dotIndex < 0) {
				fileName = fileFullName;
			} else {
				fileName = fileFullName.substring(0, dotIndex);
				fileSuffix = fileFullName.substring(dotIndex + 1);
			}

			comFileInfo.setFileName(fileName);
			comFileInfo.setFileSuffix(fileSuffix);

		}
		List readList = JdbcUtil
		.query("select file_id from com_file_read_history where file_id = '"
				+ comFileInfo.getUids() + "' and FILE_READER = '" + userId + "'");
		String str;
		if (readList.size() == 0) {
			str = "<img src='"+Constant.AppRoot+"jsp/res/images/new.gif'></img>[未读] "
			+ comFileInfo.getFileTile();
	
		} else {
			str = "[已读] "
				+ comFileInfo.getFileTile();
		}
		comFileInfo.setFileTile(str);
		return comFileInfo;
	}	
}
