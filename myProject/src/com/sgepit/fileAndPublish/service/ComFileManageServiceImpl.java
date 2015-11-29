package com.sgepit.fileAndPublish.service;

import java.io.ByteArrayOutputStream;
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
import java.util.Properties;
import java.util.zip.GZIPOutputStream;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.SQLQuery;
import org.hibernate.Session;

import com.enterprisedt.net.ftp.FTPException;
import com.sgepit.fileAndPublish.FAPConstant;
import com.sgepit.fileAndPublish.dao.ComFileInfoDAO;
import com.sgepit.fileAndPublish.dao.ComFilePublishHistoryDAO;
import com.sgepit.fileAndPublish.dao.ComFileReadHistoryDAO;
import com.sgepit.fileAndPublish.dao.ComFileSortDAO;
import com.sgepit.fileAndPublish.dao.ComFileSortDeptDAO;
import com.sgepit.fileAndPublish.hbm.ComFileInfo;
import com.sgepit.fileAndPublish.hbm.ComFilePublishHistory;
import com.sgepit.fileAndPublish.hbm.ComFileReadHistory;
import com.sgepit.fileAndPublish.hbm.ComFileSort;
import com.sgepit.fileAndPublish.hbm.ReformNoticeInfo;
import com.sgepit.fileAndPublish.hbm.ReformNoticeInfoView;
import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.dao.SgccAttachListDAO;
import com.sgepit.frame.sysman.dao.SgccIniUnitDAO;
import com.sgepit.frame.sysman.dao.SystemDao;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.RockPower;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccAttachListId;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.BusinessConstants;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.FtpUtil;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.frame.util.sms.service.SendMessageFacade;
import com.sgepit.pcmis.bid.hbm.PcBidAcceptTbdocAndBond;
import com.sgepit.pcmis.bid.hbm.PcBidIssueWinDoc;
import com.sgepit.pcmis.bid.hbm.PcBidJudgeBidding;
import com.sgepit.pcmis.bid.hbm.PcBidOpenBidding;
import com.sgepit.pcmis.bid.hbm.PcBidProgress;
import com.sgepit.pcmis.bid.hbm.PcBidPublishNotice;
import com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo;
import com.sgepit.pcmis.bid.hbm.PcBidZbAgency;
import com.sgepit.pcmis.bid.hbm.PcBidZbApply;
import com.sgepit.pmis.document.dao.ZlGlDAO;
import com.sgepit.pmis.document.hbm.ZlTree;

public class ComFileManageServiceImpl implements IComFileManageService {
	private static final Log log = LogFactory
			.getLog(ComFileSortServiceImpl.class);
	private ComFileSortDAO comFileSortDAO;// 文档分类树DAO对象
	private ComFileSortDeptDAO comFileSortDeptDAO; // 分类节点对应部门权限DAO对象
	private ComFileInfoDAO comFileInfoDAO;
	private ComFilePublishHistoryDAO comFilePublishHistoryDAO;
	private SgccAttachListDAO sgccAttachListDAO;
	private ComFileReadHistoryDAO comFileReadHistoryDAO;
	private SystemDao systemDao;
	private SystemMgmFacade systemMgm;
	private Map<String,PropertyCode> propsMap = new HashMap<String,PropertyCode>();
	private static String transType = "FAPDocument"; // 文档信息大对象的业务标识
	private static String transType_attach = "FAPAttach"; // 文档附件大对象业务标识
	private static String compressFlag = "0"; // 是否压缩存储的标志。(不压缩)

	/**
	 * 获取符合查询条件的所有文档信息
	 * 
	 * @param sortIds
	 *            分类节点ID，多个用CAFConsatan.SPLITB进行分割
	 * @param showType
	 *            数据格式 是否显示自分类数据-是否显示无权限访问的数据 1-1：显示该分类及他所有子分类下所有的文档；
	 *            1-0：显示该分类及他所有自分类下的且该用户具备访问权限的所有文档；
	 * @param deptIds
	 *            其他辅助过滤条件
	 * @return
	 */
	public List<ComFileInfo> getComFileInfoBySortId(String sortIds,
			String whereStr, String orderby, Integer start, Integer limit) {
		String where = whereStr == null ? "1=1" : whereStr
				+ " and file_sort_id in ("
				+ StringUtil.transStrToIn(sortIds, FAPConstant.SPLITB) + ")";
		List<ComFileInfo> list = this.comFileInfoDAO.findByWhere(where,
				orderby, start, limit);
		return list;
	}

	/**
	 * 删除对应分类下所有的文件
	 * 
	 * @param sortId
	 * @return
	 */
	public boolean deleteAllFilesBySort(String sortId) {
		return true;
	}

	/**
	 * 批量删除
	 * 
	 * @param filePks
	 * @return
	 */
	public boolean deleteSelectedFiles(String[] filePks) {
		for (int i = 0; i < filePks.length; i++) {
			// 若文件删除失败则终止整个批处理操作
			if (!deleteFile(filePks[i]))
				return false;
		}

		return true;
	}

	/**
	 * 删除单个文件
	 * 
	 * @param filePk
	 * @return
	 */
	public boolean deleteFile(String filePk) {
		// 1.删除文档附件及附件对应的大对象;2.删除文档大对象;3.删除文件本身
		try {
			List<SgccAttachList> attachList = sgccAttachListDAO
					.findWhere("transaction_type in ('" + transType_attach
							+ "','" + transType + "') and transaction_id = '"
							+ filePk + "' ");
			for (int i = 0; i < attachList.size(); i++) {
				String deleteSql = "delete from SGCC_ATTACH_BLOB where FILE_LSH='"
						+ attachList.get(i).getFileLsh() + "'";
				JdbcUtil.execute(deleteSql);
			}
			sgccAttachListDAO.deleteAll(attachList);
			this.comFileInfoDAO.delete((ComFileInfo) this.comFileInfoDAO
					.findById(filePk));
			return true;
		} catch (Exception e) {
			return false;
		}

	}

	/**
	 * 保存从本地上传的新文件
	 * 
	 * @param comFileInfo
	 * @param inputStream
	 * @return
	 */
	public String saveNewFile(ComFileInfo comFileInfo, InputStream inputStream) {
		// 1.先插入到文件信息表，2.更新到大对象表，3.更新到attach_list表
		//用于保存前可以上传附件，uids已在页面上生成，若uids为空则手动生成
		String fileUids = comFileInfo.getUids();
		if ( fileUids == null || fileUids.equals("")){
			fileUids = SnUtil.getNewID();
			comFileInfo.setUids(fileUids);
		}
	//	String fileUids = this.comFileInfoDAO.insert(comFileInfo);
		
		//没有上传主文件则跳过
		if ( inputStream != null ){
			
			String fileLsh = this.updateFileBlob(this.transType, SnUtil.getNewID(),
					inputStream, this.compressFlag, "saveOrUpdate");
			comFileInfo.setFileLsh(fileLsh);
			
			// 保存附件的基本信息到SGCC_ATTACH_LIST表中
			SgccAttachListId attachListId = new SgccAttachListId(this.transType,
					fileUids, fileLsh);
			SgccAttachList attachList = new SgccAttachList();
			attachList.setId(attachListId);
			attachList.setDeptId(comFileInfo.getFileDept());
			attachList.setFileName(comFileInfo.getFileTile() + "."
					+ comFileInfo.getFileSuffix());
			attachList.setIsCompress(compressFlag);
			attachList.setUnitId(Constant.APPOrgRootID);
			attachList.setUploadDate(comFileInfo.getFileCreatetime());
			attachList.setUserid(comFileInfo.getFileAuther());
			
			attachList.setFileSource(this.getFileSource("FAPDocument")); // added
			// by
			// Liuay
			// 2010-01-08
			// --设置大对象的存储方式
			if (attachList.getFileSource().equals("blob")) {
				attachList.setBlobTable("sgcc_attach_blob");
			}
			sgccAttachListDAO.insert(attachList);
		}

		return comFileInfoDAO.insert(comFileInfo);
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
	};

	/**
	 * 
	 * @param userId
	 * @param deptId
	 * @return
	 */
	public Integer getUnreadMsgNum(String userId, String deptId) {
		String whereStr = " 1 = 1 ";
		List<ComFileReadHistory> readHistoryList = this.comFileReadHistoryDAO
				.findWhere("file_reader = '" + userId + "'");
		if (readHistoryList.size() > 0) {
			String fileIds = "";
			for (int i = 0; i < readHistoryList.size(); i++) {
				fileIds += "," + readHistoryList.get(i).getFileId();
			}
			fileIds = fileIds.substring(1);

			whereStr += " and file_id not in "
					+ this.transStrForSqlIn(fileIds, ",") + "";

		}

		whereStr += " and ((publish_type = 'group' and receiver = '" + deptId
				+ "') or (publish_type = 'person' and receiver = '" + userId
				+ "'))";
		List<ComFilePublishHistory> phList = this.comFilePublishHistoryDAO
				.findByWhere(ComFilePublishHistory.class.getName(), whereStr);

		return phList.size();
	}

	/**
	 * 根据用户及相关查询条件，获取发布到用户及用户所在部门的信息
	 * 
	 * @param dateSelected
	 * @param stateSelected
	 * @param userId
	 * @param deptId
	 * @param whereStr
	 * @param orderBy
	 * @return
	 */
	public List<ComFilePublishHistory> getFileListByPublish(
			String dateSelected, String stateSelected, String userId,
			String deptId, String whereStr, String keyword, String orderBy,
			Integer start, Integer limit) {
		if (dateSelected.equals("all")) {
			whereStr += " and 1=1 ";
		} else if (dateSelected.equals("oneMonth")) {
			Date date = new Date();
			String year = String.valueOf(date.getYear() + 1900);
			String month = date.getMonth() < 10 ? "0"
					+ String.valueOf(date.getMonth()) : String.valueOf(date
					.getMonth());
			String day = date.getDay() < 10 ? "0"
					+ String.valueOf(date.getDay()) : String.valueOf(date
					.getDay());
			String dateStr = year + month + day;
			whereStr += " and to_char(publish_time,'yyyymmdd') > '" + dateStr
					+ "'";
		} else if (dateSelected.equals("threeMonth")) {
			Date date = new Date();
			String year = String.valueOf(date.getYear() + 1900);
			String month = date.getMonth() - 2 < 10 ? "0"
					+ String.valueOf(date.getMonth() - 2) : String.valueOf(date
					.getMonth() - 2);
			String day = date.getDay() < 10 ? "0"
					+ String.valueOf(date.getDay()) : String.valueOf(date
					.getDay());
			String dateStr = year + month + day;
			whereStr += " and to_char(publish_time,'yyyymmdd') > '" + dateStr
					+ "'";
		}
		if (stateSelected.equals("all")) {
			whereStr += " and 1=1 ";
		} else {
			List<ComFileReadHistory> readHistoryList = this.comFileReadHistoryDAO
					.findWhere("file_reader = '" + userId + "'");
			if (readHistoryList.size() > 0) {
				String fileIds = "";
				for (int i = 0; i < readHistoryList.size(); i++) {
					fileIds += "," + readHistoryList.get(i).getFileId();
				}
				fileIds = fileIds.substring(1);
				if (stateSelected.equals("unRead")) {
					whereStr += " and file_id not in "
							+ this.transStrForSqlIn(fileIds, ",") + "";
				} else if (stateSelected.equals("read")) {
					whereStr += " and file_id in "
							+ this.transStrForSqlIn(fileIds, ",") + "";
				}
			}
		}
		whereStr += " and ((publish_type = 'group' and receiver = '" + deptId
				+ "') or (publish_type = 'person' and receiver = '" + userId
				+ "'))";

		// 增加按标题关键字模糊查找
		if (keyword != null) {
			if (!keyword.equals("")) {
				whereStr += " and file_id in ( select uids from ComFileInfo fileinfo where fileTile like '%"
						+ keyword + "%' or fileId like '%" + keyword + "%' )";
			}
		}

		List<ComFilePublishHistory> phList = this.comFilePublishHistoryDAO
				.findByWhere(whereStr, orderBy, start, limit);
		return phList;
	}
	
	/**
	 * 将用户的所有未读文件标记为已读
	 * 
	 * @param userId 用户id
	 * @param sortId 分类id
	 * @return true 表示成功， false表示失败
	 */
	public boolean markAllAsReadForUser(String userId, String sortId){
		boolean retVal = true;
		
		//加上分类
		String sortSql = "select uids from  (select uids from  COM_FILE_SORT t start WITH uids = '"
			+ sortId + "' connect by PRIOR uids = parent_id) ";
	List<Map> list = JdbcUtil.query(sortSql);
	String sortIds = "";
	for (int i = 0; i < list.size(); i++) {
		sortIds += FAPConstant.SPLITB
				+ list.get(i).get("uids").toString();
	}
	String whereStr = "file_id in (select uids from com.sgepit.fileAndPublish.hbm.ComFileInfo where fileSortId in ("
		+ StringUtil.transStrToIn(sortIds.substring(1), FAPConstant.SPLITB) + ")) ";
		
		//找到当前用户所属部门
		Object userObj = systemDao.findById(RockUser.class.getName(), userId);
		if ( userObj == null )
			return retVal;
		
		RockUser user = (RockUser) userObj;
		String deptId = user.getDeptId();
		whereStr += "and ((publish_type = 'group' and receiver = '" + deptId
		+ "') or (publish_type = 'person' and receiver = '" + userId
		+ "'))";
		
		
		List<ComFilePublishHistory> phList = comFilePublishHistoryDAO
		.findByWhere(ComFilePublishHistory.class.getName(), whereStr);
		if ( phList.size() > 0 ){
			
			String[] filePks = new String[phList.size()];
			for (int i = 0; i < phList.size(); i++) {
				filePks[i] = phList.get(i).getFileId();
			}
			retVal = markSelectedFilesAsRead(userId, filePks, true);
			
		}
		
		return retVal;
		
	}

	public boolean markSelectedFilesAsRead(String userId, String[] filePks,
			Boolean read) {
		if (read) {
			try {
				for (String filePk : filePks) {
					// 查找是否已存在已读记录
					List<ComFileReadHistory> list = comFileReadHistoryDAO
							.findWhere("file_id = '" + filePk
									+ "' and file_reader = '" + userId + "'");
					if (list.size() > 0)
						continue;
					ComFileReadHistory hbm = new ComFileReadHistory();
					hbm.setFileId(filePk);
					hbm.setFileReader(userId);
					hbm.setFileReadLasttime(new Date());
					comFileReadHistoryDAO.insert(hbm);

				}
			} catch (Exception e) {
				return false;
			}
		}

		return true;
	}

	public boolean changeUserReadState(String userId, String filePk,
			String state) {
		if (state.equals("read")) {
			List<ComFileReadHistory> list = this.comFileReadHistoryDAO
					.findWhere("file_id = '" + filePk + "' and file_reader = '"
							+ userId + "'");
			if (list.size() > 0) {
				return true;
			}

			ComFileReadHistory hbm = new ComFileReadHistory();
			hbm.setFileId(filePk);
			hbm.setFileReader(userId);
			hbm.setFileReadLasttime(new Date());
			this.comFileReadHistoryDAO.insert(hbm);
		} else if (state.equals("unRead")) {
			List<ComFileReadHistory> list = this.comFileReadHistoryDAO
					.findWhere("file_id = '" + filePk + "' and file_reader = '"
							+ userId + "'");
			if (list.size() == 1) {
				this.comFileReadHistoryDAO.delete(list.get(0));
			}
		}
		return true;
	}

	
	public List getPublishUserInDept(String orderBy, Integer start,
			Integer limit, HashMap<String, String> params) {
		List returnList = new ArrayList();
		
		String deptId = params.get("unitId");
		String posId = params.get("posId");
		String fileId = params.get("fileId");
		
		String deptFilterStr = "select unitid from sgcc_ini_unit start with unitid = '" + deptId +"' connect by prior unitid = upunit";
		if (Constant.propsMap.get("DEPLOY_UNITTYPE").equals("0")){
			deptFilterStr += " and unit_type_id != '7'";
		}

		String sql = " select (select unitname from sgcc_ini_unit where unitid = "
				+ "t1.unitid "
				+ ") unitname," 
				+ "(select view_order_num from sgcc_ini_unit where unitid = t1.unitid ) unitorder, "
				+ "(select view_order_num from sgcc_ini_unit where unitid = t1.dept_id ) deptorder, "
				+ "(select unitname from sgcc_ini_unit where unitid = t1.posid) posname,"
				+ " t1.userid,t1.realname,t1.phone,t2.* from rock_user t1 left join (select * from com_file_publish_history "
				+ " where file_id = '"
				+ fileId
				+ "' and publish_type = 'person') t2 on "
				+ " t1.userid = t2.receiver where t1.dept_id in"
				+ " (" + deptFilterStr + ") " 
				+ " and t1.userstate = '1'";
		if (posId != null) {
			sql += " and posid = '" + posId + "' ";
		}
		if ( deptId.equals("1") ){
			sql += " order by userid";
		}
		else{
			sql += " order by unitorder,deptorder, t1.posid, t1.userid  ";
		}

		Integer lastRowNum = start +limit;
		String countSql = "select count(*) as num from (" + sql
				+ " ) temp ";
		String pageSql = "select * from ( select rownum num, temp.* from (" + sql + " ) temp ) where num>"
				+ start + " and num<=" + lastRowNum;
		List<Map<String, Object>> countList = JdbcUtil.query(countSql);
		Integer count = Integer.valueOf(countList.get(0).get("num")
				.toString());
		List<Map<String, Object>> resultList = JdbcUtil.query(pageSql);

		for (int i = 0; i < resultList.size(); i++) {
			Map m = (Map) resultList.get(i);
			ComFilePublishHistory hbm = new ComFilePublishHistory();
			hbm.setFileId(fileId);
			hbm.setPublishType("person");
			hbm.setReceiver(m.get("userid").toString());// 接受用户ID
			hbm.setPublishUser(m.get("realname") == null ? null : m.get(
					"realname").toString());// 接受用户姓名
			hbm.setPublishTime(m.get("publish_time") == null ? null : ((Date) m
					.get("publish_time")));// 发布时间，时间为空则表示未发布
			hbm.setPublishDept(m.get("posname") == null ? null : m.get(
					"posname").toString());// 存放接受用户所在部门，岗位名称
			hbm.setFileDeptName(m.get("unitname") == null ? null : m.get(
			"unitname").toString());
			hbm.setUids(m.get("phone") == null ? null : m.get("phone")
					.toString());// 接受用户用户电话号码
			returnList.add(hbm);
		}
		returnList.add(count);
		return returnList;
	}

	public List getPublishUser(String fileId, String deptStr) {
		List returnList = new ArrayList();
		// 11-2-16 部门和岗位信息
		String[] tempArr = deptStr.split(Constant.SPLITE);
		String deptId = tempArr[0]; // 代表部门
		String posId = deptId;
		if (tempArr.length > 1) {
			posId = tempArr[1]; // 若选择的是岗位节点则还有岗位编号
		}

		String sql = " select (select unitname from sgcc_ini_unit where unitid = "
				+ "t1.unitid "
				+ ") unitname," 
				+ "(select unitname from sgcc_ini_unit where unitid = t1.posid) posname,"
				+		" t1.userid,t1.realname,t1.phone,t2.* from rock_user t1,(select * from com_file_publish_history "
				+ " where file_id = '"
				+ fileId
				+ "' and publish_type = 'person') t2 where "
				+ " t1.userid = t2.receiver(+) and t1.unitid = '"
				+  deptId +"' "
				+ " and t1.userstate = '1'";
		if (tempArr.length > 1) {
			sql += " and posid = '" + posId + "' ";
		}
		sql += " order by t1.userid";
		List list = JdbcUtil.query(sql);

		for (int i = 0; i < list.size(); i++) {
			Map m = (Map) list.get(i);
			ComFilePublishHistory hbm = new ComFilePublishHistory();
			hbm.setFileId(fileId);
			hbm.setPublishType("person");
			hbm.setReceiver(m.get("userid").toString());// 接受用户ID
			hbm.setPublishUser(m.get("realname") == null ? null : m.get(
					"realname").toString());// 接受用户姓名
			hbm.setPublishTime(m.get("publish_time") == null ? null : ((Date) m
					.get("publish_time")));// 发布时间，时间为空则表示未发布
			hbm.setPublishDept(m.get("posname") == null ? null : m.get(
					"posname").toString());// 存放接受用户所在部门，岗位名称
			hbm.setFileDeptName(m.get("unitname") == null ? null : m.get(
			"unitname").toString());
			hbm.setUids(m.get("phone") == null ? null : m.get("phone")
					.toString());// 接受用户用户电话号码
			returnList.add(hbm);
		}
		return returnList;
	}

	/**
	 * 多个文件批量发布给个人
	 * 
	 * @param publishUserId
	 *            发布人用户id
	 * @param publishDeptId
	 *            发布人部门id
	 * @param uidArr
	 *            发布的文件id数组
	 * @param userIdArrStr
	 *            发布到用户的id数组
	 * @return
	 */
	public String filesPublishToUser(String publishUserId,
			String publishDeptId, String[] uidArr, String userIdArrStr, Boolean doExchange) {
		String returnStatus = "success";

		RockUser user = (RockUser) systemDao.findById(RockUser.class.getName(), publishUserId);
		//当前用户所属组织机构PID 
		String currentUserPid= getPidForExchange(user.getUnitid());
		
		String[] userIds = userIdArrStr.split("[,]");
		Map<String, String> pidRefMap = new HashMap<String, String>();
		Map<String, List<ComFilePublishHistory>> dataExchangeMap = new HashMap<String, List<ComFilePublishHistory>>();
		if ( doExchange ){
			String userInStr = transStrForSqlIn(userIds);
			String deptSql = "select distinct unitid from rock_user t where t.userid in "+ userInStr + " order by unitid";
			List<Map<String, String>>deptList = JdbcUtil.query(deptSql);
			//*数据交互 将所有发布用户对应的部门所对应的实际应发送PID集合成MAP
			
			for (Map<String, String> map : deptList) {
				String deptId = map.get("unitid");
				String exchangePid = getPidForExchange(deptId);
				pidRefMap.put(deptId, exchangePid);
			}
		}
		
		for (String userId : userIds) {
			try {
				boolean canAdd = false;

				// 查询当前用户部门
				List<Map> list = JdbcUtil.query("select dept_id, unitid from rock_user where userid = '" + userId + "'");

				// 循环要发布的文件id
				for (String fileId : uidArr) {
					ComFilePublishHistory hbm = new ComFilePublishHistory();
					// 筛选当前发布信息是否需要添加
					// 是否已有发布记录
					List<ComFilePublishHistory> listPubHistory = comFilePublishHistoryDAO
							.findWhere("file_id='"
									+ fileId
									+ "' and publish_type = 'person' and receiver = '"
									+ userId + "'");
					if (listPubHistory.size() == 0){
						canAdd = true;
					} else{
						canAdd = false;
					}

					if (list.size() == 1 && canAdd) {// 用户有所属部门
						String deptId = list.get(0).get("dept_id").toString();

						// 查找是否已对部门发布: 如果已经对部门发布，则不再对用户发布
						List listDeptPub = this.comFilePublishHistoryDAO
								.findWhere("file_id = '"
										+ fileId
										+ "' and publish_type = 'group' and receiver = '"
										+ deptId + "'");
						if (listDeptPub.size() > 0) {
							canAdd = false;
						}
					} 

					if (canAdd) {
						hbm = new ComFilePublishHistory();
						hbm.setUids(SnUtil.getNewID());
						hbm.setFileId(fileId);
						hbm.setPublishTime(new Date());
						hbm.setPublishType("person");
						hbm.setReceiver(userId);
						hbm.setPublishUser(publishUserId);
						hbm.setPublishDept(publishDeptId);
						comFilePublishHistoryDAO.insert(hbm);
					}

					// 更新发布状态
					ComFileInfo comFileInfo = (ComFileInfo) this.comFileInfoDAO.findById(fileId);
					if (comFileInfo != null) {
						if (comFileInfo.getStatePublish() != null) {
							if (comFileInfo.getStatePublish() == 0L||comFileInfo.getStatePublish() == 2L) {
								comFileInfo.setStatePublish(Long.valueOf("1"));
								this.comFileInfoDAO.saveOrUpdate(comFileInfo);
							}
						} else {
							comFileInfo.setStatePublish(Long.valueOf("1"));
							this.comFileInfoDAO.saveOrUpdate(comFileInfo);
						}
					}
					
					//*数据交互
					if ( doExchange && canAdd ){
					
						String curUnitId = list.get(0).get("unitid").toString();

						//*数据交互，获取当前用户的所属单位作为发送id
						String exchangePid = pidRefMap.get(curUnitId);
						if ( exchangePid.equals(currentUserPid)){//不给本单位进行交互
							continue;
						} 											
						if ( dataExchangeMap.get(exchangePid) == null ){	//没有该PID对应的交互数据列表则新增一个
							List<ComFilePublishHistory> exchangeDataList = new ArrayList<ComFilePublishHistory>();
							exchangeDataList.add(hbm);
							dataExchangeMap.put(exchangePid, exchangeDataList);
						} else {
							List<ComFilePublishHistory> exchangeDataList = dataExchangeMap.get(exchangePid);
							exchangeDataList.add(hbm);
						}
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
				return "failed";
			}

		}
		//执行数据交互
		if (doExchange && dataExchangeMap.size()>0){
			List<String> failedPids = exchangePublishedFileToUser(uidArr, dataExchangeMap);
			
			if ( failedPids.size() > 0 ){	//数据交互有失败的情况
				//把失败PID的本地记录删除
				for (String pid : failedPids) {
					List<ComFilePublishHistory> deleteHistoryList = dataExchangeMap.get(pid);
					comFileInfoDAO.deleteAll(deleteHistoryList);
				}
				
				
				//查询所有PID对应的名称
				String[] pidArr = new String[failedPids.size()];
				failedPids.toArray(pidArr);
				String deptNameSql = "select unitname from sgcc_ini_unit where unitid in " +
						transStrForSqlIn(pidArr);
				List<Map<String, Object>> deptNameList = JdbcUtil.query(deptNameSql);
				returnStatus = "";
				for (Map<String, Object> map : deptNameList) {
					returnStatus += map.get("unitname") + ",";
				}
				returnStatus = "以下单位所属用户的文件发布失败：" + returnStatus.substring(0, returnStatus.length() - 1);
				returnStatus += "<br />原因：数据交互失败";
			}
		}

		return returnStatus;
	}

	/**
	 * 多个文件批量发布到部门，同时删除已发布到该部门的用户发布记录
	 * @param publishUserId 发布人id
	 * @param publishDeptId 发布人的部门id
	 * @param fileIds 发布的文件id数组
	 * @param deptIds 发布到的部门id数组
	 * @param doExchange 是否进行数据交互
	 * @return
	 */
	public String filesPublishToDept(String publishUserId,
			String publishDeptId, String[] fileIds, String deptIds, Boolean doExchange) {
		String returnStatus = "success";
		RockUser user = (RockUser) systemDao.findById(RockUser.class.getName(), publishUserId);
		//当前用户所属组织机构PID
		String currentUserPid= getPidForExchange(user.getUnitid());
		
		try {
			String[] deptIdArr = deptIds.split("[,]");
			// *数据交互， 定义PID-交互文件MAP
			Map<String, List<ComFilePublishHistory>> dataExchangeMap = new HashMap<String, List<ComFilePublishHistory>>();
			
			// 遍历所有的文件id
			for (String fileId : fileIds) {
				for (String deptId : deptIdArr) {
		
					// 添加发布记录
					ComFilePublishHistory hbm = new ComFilePublishHistory();
					// 筛选当前发布信息是否需要添加
					// 是否已有部门发布记录
					List<ComFilePublishHistory> listPubHistory = comFilePublishHistoryDAO
							.findWhere("file_id='"
									+ fileId
									+ "' and publish_type = 'group' and receiver = '"
									+ deptId + "'");
					if (listPubHistory.size() == 0){
						hbm.setUids(SnUtil.getNewID());
						hbm.setFileId(fileId);
						hbm.setPublishTime(new Date());
						hbm.setPublishType("group");
						hbm.setReceiver(deptId);
						hbm.setPublishUser(publishUserId);
						hbm.setPublishDept(publishDeptId);
						comFilePublishHistoryDAO.insert(hbm);
						// 发布到部门后，要删除已经发布到该部门下的人员的记录
						List<Map> list = JdbcUtil
								.query("select userid from rock_user where dept_id = '"
										+ deptId + "'");
						String userIds = "";
						for (int i = 0; i < list.size(); i++) {
							userIds += "," + list.get(i).get("userid").toString();
						}
						List<ComFilePublishHistory> delList = this.comFilePublishHistoryDAO
								.findWhere("file_id = '" + fileId
										+ "' and receiver in "
										+ this.transStrForSqlIn(userIds, ",")
										+ " and publish_type = 'person' ");
						this.comFilePublishHistoryDAO.deleteAll(delList);
					}else{
						hbm = listPubHistory.get(0);
						
					}
						
					if ( doExchange ){
						//*数据交互，获取当前deptID对应的实际应该交互的PID
						String exchangePid = getPidForExchange(deptId);
						if ( exchangePid.equals(currentUserPid)){//不给本单位进行交互
							continue;
						} 
						if ( dataExchangeMap.get(exchangePid) == null ){	//没有该PID对应的交互数据列表则新增一个
							List<ComFilePublishHistory> exchangeDataList = new ArrayList<ComFilePublishHistory>();
							exchangeDataList.add(hbm);
							dataExchangeMap.put(exchangePid, exchangeDataList);
						}
						else{
							List<ComFilePublishHistory> exchangeDataList = dataExchangeMap.get(exchangePid);
							exchangeDataList.add(hbm);
						}
					}
				}
				// 更新发布状态
				ComFileInfo comFileInfo = (ComFileInfo) this.comFileInfoDAO
						.findById(fileId);
				if (comFileInfo != null) {
					comFileInfo.setStatePublish(Long.valueOf("1"));
					this.comFileInfoDAO.saveOrUpdate(comFileInfo);
				}
					
			}
			//*数据交互执行
			if (doExchange && dataExchangeMap.size()>0){
				List<String> failedPids = exchangePublishedFileToDept(fileIds, dataExchangeMap);
				
				if ( failedPids.size() > 0 ){	//数据交互有失败的情况
					//把失败PID的本地记录删除
					for (String pid : failedPids) {
						List<ComFilePublishHistory> deleteHistoryList = dataExchangeMap.get(pid);
						comFileInfoDAO.deleteAll(deleteHistoryList);
					}
					
					
					//查询所有PID对应的名称
					String[] pidArr = new String[failedPids.size()];
					failedPids.toArray(pidArr);
					String deptNameSql = "select unitname from sgcc_ini_unit where unitid in " +
							transStrForSqlIn(pidArr);
					List<Map<String, Object>> deptNameList = JdbcUtil.query(deptNameSql);
					returnStatus = "";
					for (Map<String, Object> map : deptNameList) {
						returnStatus += map.get("unitname") + ",";
					}
					returnStatus = "以下单位的文件发布失败：" + returnStatus.substring(0, returnStatus.length() - 1) ;
					returnStatus += "<br />原因：数据交互失败";
				}
			}
			
			return returnStatus;
		} catch (Exception e) {
			e.printStackTrace();
			return "failed";
		}
	}
	
	/**
	 * 将指定文件通过数据交换发布到相应的组织机构程序中(发布到用户)
	 * @param fileIds 要发送的文件id数组
	 * @param pids 要交换到的组织pid数组
	 * @throws BusinessException
	 */
	private List<String> exchangePublishedFileToUser(String[] fileIds, Map<String, List<ComFilePublishHistory>> exchangeMap){
		List<String> failedPids = new ArrayList<String>();
		
		String fileIdInStr = transStrForSqlIn(fileIds);
		// 文件信息列表
		List<ComFileInfo> fileList = comFileInfoDAO.findByWhere(
				ComFileInfo.class.getName(), "uids in " + fileIdInStr, "uids");
		// sgcc_attach_list,包括主文档和附件
		List<SgccAttachList> attachList = comFileInfoDAO.findByWhere(
				SgccAttachList.class.getName(),
				"transaction_type in ('FAPDocument', 'FAPAttach') and transaction_id in "
						+ fileIdInStr);
		List<PcDataExchange> blobExchangeList = new ArrayList<PcDataExchange>();
		// 手动生成所有attachBlob的dataExchange记录
		for (SgccAttachList attach : attachList) {
			PcDataExchange exchange = new PcDataExchange();
			exchange.setTableName("SGCC_ATTACH_BLOB");
			exchange.setBlobCol("FILE_NR");
			JSONArray kvarr = new JSONArray();
			JSONObject kv = new JSONObject();
			kv.put("FILE_LSH", attach.getFileLsh());
			kvarr.add(kv);
			exchange.setKeyValue(kvarr.toString());
			exchange.setSuccessFlag("0");
			exchange.setBizInfo("文件发布到用户");

			blobExchangeList.add(exchange);
		}
		PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
				.getBean("PCDataExchangeService");

		boolean allSuccess = true;
		//所有发送PID
		Iterator<String> pidIterator = exchangeMap.keySet().iterator();
		
		while( pidIterator.hasNext() ) {

			String pid = pidIterator.next();
			// com_file_publish_history 发布历史数据，只需要将发送到机构所属的历史数据传输过去
			
			List<ComFilePublishHistory> historyList = exchangeMap.get(pid);
			List<String> pubedDeptIdList = new ArrayList<String>();
			
			//String[] pubedDeptIdArr = new String[historyList.size()];
			for (int i = 0; i < historyList.size(); i++) {
				if ( !pubedDeptIdList.contains(historyList.get(i).getReceiver()) ){
					pubedDeptIdList.add(historyList.get(i).getReceiver());
				}
			}
			
			String recieverInStr = transStrForSqlIn(pubedDeptIdList.toArray(new String[pubedDeptIdList.size()]));

			// 避免重复插入数据
			String beforeSql = "delete from com_file_publish_history t "
					+ "where file_id in "
					+ fileIdInStr
					+ " and publish_type = 'person' "
					+ "and receiver in " + recieverInStr;

			// 删除已存在的发布到部门用户的发布记录
			String afterSql = "delete from com_file_publish_history t "
					+ "where file_id in "
					+ fileIdInStr
					+ " and publish_type = 'person' and receiver in "
					+ "( select userid from rock_user u where u.dept_id in "
					+ "(select receiver from com_file_publish_history t1 where t1.file_id in " + fileIdInStr +
					" and publish_type = 'group'  )) ";

			afterSql = String.format(afterSql, pid);

			List allDataList = new ArrayList();
			allDataList.addAll(fileList);
			allDataList.addAll(attachList);
			//allDataList.addAll(historyList);

			List<PcDataExchange> exchangeList = dataExchangeService
					.getExcDataList(allDataList, pid,Constant.DefaultOrgRootID,beforeSql, afterSql,"发布文件到用户");
			// 再将生成的attach_blob记录添加到队列中
			// 当前的xh, tx_group
			PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
			Long curXh = tempExc.getXh() + 1;
			String curTxGroup = tempExc.getTxGroup();
			for (int i = 0; i < blobExchangeList.size(); i++) {
				PcDataExchange curBlobExchange = blobExchangeList.get(i);
				++curXh;
				curBlobExchange.setXh(curXh);
				curBlobExchange.setPid(pid);
				curBlobExchange.setTxGroup(curTxGroup);
				exchangeList.add(curBlobExchange);
			}
			// 再生成历史记录数据交互对象
			for (int i = 0; i < historyList.size(); i++) {
				ComFilePublishHistory history = historyList.get(i);
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("COM_FILE_PUBLISH_HISTORY");
				String sql = createSQLForPubedHistory(history);
				exchange.setSqlData(sql);
				exchange.setKeyValue(SnUtil.getNewID("SQL-"));
				exchange.setSuccessFlag("0");
				exchange.setBizInfo("文件发布到用户");
				++curXh;
				exchange.setXh(curXh);
				exchange.setPid(pid);
				exchange.setTxGroup(curTxGroup);
				
				exchangeList.add(exchange);
			}
			
			Map<String, String> retVal = dataExchangeService.sendExchangeData(exchangeList);
			String result = retVal.get("result");
			String status = retVal.get("status");
		
			if ( !result.equals("success") && !status.equals("url_empty")){
				failedPids.add(pid);
			}
		}
		
		return failedPids;
	}
	

	/**
	 * 将指定文件通过数据交换发布到相应的组织机构程序中
	 * @param fileIds 要发送的文件id数组
	 * @param pids 要交换到的组织pid数组
	 * @return List 失败的pid列表
	 */
	private List<String> exchangePublishedFileToDept(String[] fileIds, Map<String, List<ComFilePublishHistory>> exchangeMap)
			 {
		List<String> failedPids = new ArrayList<String>();
		String fileIdInStr = transStrForSqlIn(fileIds);
		// 文件信息列表
		List<ComFileInfo> fileList = comFileInfoDAO.findByWhere(
				ComFileInfo.class.getName(), "uids in " + fileIdInStr, "uids");
		// sgcc_attach_list,包括主文档和附件
		List<SgccAttachList> attachList = comFileInfoDAO.findByWhere(
				SgccAttachList.class.getName(),
				"transaction_type in ('FAPDocument', 'FAPAttach') and transaction_id in "
						+ fileIdInStr);
		List<PcDataExchange> blobExchangeList = new ArrayList<PcDataExchange>();
		// 手动生成所有attachBlob的dataExchange记录
		for (SgccAttachList attach : attachList) {
			PcDataExchange exchange = new PcDataExchange();
			exchange.setTableName("SGCC_ATTACH_BLOB");
			exchange.setBlobCol("FILE_NR");
			JSONArray kvarr = new JSONArray();
			JSONObject kv = new JSONObject();
			kv.put("FILE_LSH", attach.getFileLsh());
			kvarr.add(kv);
			exchange.setKeyValue(kvarr.toString());
			exchange.setSuccessFlag("0");
			exchange.setBizInfo("文件发布到部门");

			blobExchangeList.add(exchange);
			
		}
		PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
				.getBean("PCDataExchangeService");

		boolean allSuccess = true;
		//所有发送PID
		Iterator<String> pidIterator = exchangeMap.keySet().iterator();
		
		while( pidIterator.hasNext() ) {
			String pid = pidIterator.next();
			

			List<ComFilePublishHistory> historyList = exchangeMap.get(pid);
			List<String> pubedDeptIdList = new ArrayList<String>();
			
			//String[] pubedDeptIdArr = new String[historyList.size()];
			for (int i = 0; i < historyList.size(); i++) {
				if ( !pubedDeptIdList.contains(historyList.get(i).getReceiver()) ){
					pubedDeptIdList.add(historyList.get(i).getReceiver());
				}
			}
			
			String recieverInStr = transStrForSqlIn(pubedDeptIdList.toArray(new String[pubedDeptIdList.size()]));
			// 避免重复插入数据
			String beforeSql = "delete from com_file_publish_history t "
					+ "where file_id in "
					+ fileIdInStr
					+ " and publish_type = 'group' "
					+ "and receiver in " + recieverInStr;

			// 删除已存在的发布到部门用户的发布记录
			String afterSql = "delete from com_file_publish_history t "
					+ "where file_id in "
					+ fileIdInStr
					+ " and publish_type = 'person' and receiver in "
					+ "( select userid from rock_user u where u.dept_id in "
					+ recieverInStr 
					+ ")";
					

			afterSql = String.format(afterSql, pid);

			List allDataList = new ArrayList();
			allDataList.addAll(fileList);
			allDataList.addAll(attachList);
			//allDataList.addAll(historyList);

			List<PcDataExchange> exchangeList = dataExchangeService
					.getExcDataList(allDataList, pid,Constant.DefaultOrgRootID,beforeSql, afterSql,"文件发布到部门");
			// 再将生成的attach_blob记录添加到队列中
			// 当前的xh, tx_group
			PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
			Long curXh = tempExc.getXh() + 1;
			String curTxGroup = tempExc.getTxGroup();
			for (int i = 0; i < blobExchangeList.size(); i++) {
				PcDataExchange curBlobExchange = blobExchangeList.get(i);
				++curXh;
				curBlobExchange.setXh(curXh);
				curBlobExchange.setPid(pid);
				curBlobExchange.setTxGroup(curTxGroup);
				exchangeList.add(curBlobExchange);
			}
			// 再生成历史记录数据交互对象
			for (int i = 0; i < historyList.size(); i++) {
				ComFilePublishHistory history = historyList.get(i);
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("COM_FILE_PUBLISH_HISTORY");
				String sql = createSQLForPubedHistory(history);
				exchange.setSqlData(sql);
				exchange.setKeyValue(SnUtil.getNewID("SQL-"));
				exchange.setSuccessFlag("0");
				exchange.setBizInfo("文件发布到部门");
				++curXh;
				exchange.setXh(curXh);
				exchange.setPid(pid);
				exchange.setTxGroup(curTxGroup);
				
				exchangeList.add(exchange);
			}
			
			Map<String, String> retVal = dataExchangeService.sendExchangeData(exchangeList);

			String result = retVal.get("result");
			String status = retVal.get("status");
		
			if ( !result.equals("success") && !status.equals("url_empty")){
				failedPids.add(pid);
			}
			
		}
		
		return failedPids;

	}
	
	
	/**
	 * 根据传递的参数UnitID， 判断需要进行数据交换的单位ID
	 * 主要判断三级单位 和 集团本部
	 * 
	 * @param unitId
	 * @return
	 * @createDate: 2012-5-23
	 */
	private String getPidForExchange(String unitId){
		List<SgccIniUnit> tempList = comFileInfoDAO.findByProperty(SgccIniUnit.class.getName(), "unitid", unitId);
		String pidType = "0`3";
		if (tempList.size()>0) {
			SgccIniUnit tempUnit = tempList.get(0);
			String tempUnitTypeId = tempUnit.getUnitTypeId();
			if (tempUnitTypeId!=null && pidType.indexOf(tempUnitTypeId)>-1) {
				return unitId;
			} else {
				return getPidForExchange(tempUnit.getUpunit());
			}
		} else {
			return unitId;
		}
	}
	
	private String createSQLForPubedHistory(ComFilePublishHistory history){
		String sql = "INSERT INTO COM_FILE_PUBLISH_HISTORY " +
				"( UIDS, FILE_ID, PUBLISH_TYPE, RECEIVER, PUBLISH_USER, PUBLISH_DEPT, PUBLISH_TIME ) VALUES " +
				"('%s', '%s', '%s', '%s', '%s', '%s', to_date('%s','yyyymmddhh24miss'))";
		DateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		String dateStr = format.format(history.getPublishTime());
		sql = String.format(sql, SnUtil.getNewID(), history.getFileId(), history.getPublishType(), history.getReceiver(), history.getPublishUser(), history.getPublishDept(), dateStr);
		return sql;
	}

	/**
	 * 获取文件移交资料室的grid 的数据
	 * 
	 * @param fileId
	 * @param fileTypes
	 * @param yjrId
	 * @return
	 */
	public String getJsonStrForTransToZLS(String fileIds, String fileTypes,
			String yjrName) {
		String fileIdSqlStr = transStrForSqlIn(fileIds, ",");
		List<SgccAttachList> list = this.sgccAttachListDAO
				.findWhere("TRANSACTION_ID in " + fileIdSqlStr
						+ " and TRANSACTION_TYPE in "
						+ this.transStrForSqlIn(fileTypes, ",") + " ");

		// 所有主文件列表
		List<ComFileInfo> mainFileList = comFileInfoDAO.findWhere("UIDS in "
				+ fileIdSqlStr);
		// id - 主文件名对应map
		Map<String, String> mainFileNameMap = new HashMap<String, String>();
		for (ComFileInfo comFileInfo : mainFileList) {
			mainFileNameMap.put(comFileInfo.getUids(), comFileInfo
					.getFileTile());
		}

		StringBuffer rtnStrBuf = new StringBuffer("[");
		for (int i = 0; i < list.size(); i++) {
			SgccAttachList sgccAttachList = (SgccAttachList) list.get(i);
			List<ZlInfo> zlList = this.sgccAttachListDAO.findWhereOrderBy(
					ZlInfo.class.getName(), "filelsh = '"
							+ sgccAttachList.getFileLsh() + "'", null);
			rtnStrBuf.append("{");

			PropertyCodeDAO propertyDAO = PropertyCodeDAO.getInstence();
			String fileTypeName = propertyDAO.getCodeNameByPropertyName(
					sgccAttachList.getTransactionType(), "文件类型");
			fileTypeName = fileTypeName == null ? "" : fileTypeName;
			rtnStrBuf.append("fileType:'" + sgccAttachList.getTransactionType()
					+ "',");
			rtnStrBuf.append("fileTypeName:'" + fileTypeName + "',");
			rtnStrBuf.append("fileId:'"
					+ sgccAttachList.getId().getTransactionId() + "',");
			rtnStrBuf.append("mainFileName:'"
					+ mainFileNameMap.get(sgccAttachList.getId()
							.getTransactionId()) + "',");
			rtnStrBuf.append("fileLsh:'" + sgccAttachList.getFileLsh() + "',");
			rtnStrBuf
					.append("fileName:'" + sgccAttachList.getFileName() + "',");
			if (zlList.size() == 1) {
				ZlInfo zlInfo = zlList.get(0);
				String yjr = zlInfo.getYjr();
				List<ZlTree> zlTreeList = this.sgccAttachListDAO.findByWhere(
						"com.sgepit.pmis.document.hbm.ZlTree", "indexId = '"
								+ zlInfo.getIndexid() + "'");
				ZlTree zlTree = zlTreeList.size() == 1 ? zlTreeList.get(0)
						: null;
				String yjStr = "";
				if (yjr != null) {
					if (yjr.equals(yjrName)) {
						yjStr = "已被 【我】 移交到 【" + zlTree.getMc() + "】 分类下";
					} else {
						yjStr = "已被 【" + yjr + "】 移交到 【" + yjrName + "】 分类下";
					}
				} else {
					yjStr = "已移交到 【" + zlTree.getMc() + "】 分类下";
				}
				rtnStrBuf.append("isTrans:'1',");
				rtnStrBuf.append("transState:'" + zlInfo.getBillstate() + "',");
				rtnStrBuf.append("yjStr:'" + yjStr + "'");

			} else {
				rtnStrBuf.append("isTrans:'0',");
				rtnStrBuf.append("yjStr:'未移交'");
			}
			rtnStrBuf.append("},");
		}
		if (rtnStrBuf.lastIndexOf(",") == rtnStrBuf.length() - 1)
			rtnStrBuf.deleteCharAt(rtnStrBuf.length() - 1);
		rtnStrBuf.append("]");
		return rtnStrBuf.toString();
	}

	/**
	 * 文件移交资料室
	 * 
	 * @param fileMap
	 * @param fileId
	 * @param zlSortId
	 * @param userId
	 * @return
	 */
	public boolean transToZLS(String fileLshs, String fileNames, String fileId,
			String zlSortId, String yjrName) {

		try {

			String zlType = PropertyCodeDAO.getInstence()
					.getCodeValueByPropertyName("资料", "资料类型");
			if (zlType != null) {
				zlType = "3";
			}
			Long zlTypeNum = Long.valueOf(zlType);

			ComFileInfo comFileInfo = (ComFileInfo) this.comFileInfoDAO
					.findById(fileId);
			if (comFileInfo != null) {
				String[] fileLshArr = fileLshs.split(",");
				String[] fileNameArr = fileNames.split(",");
				for (int i = 0; i < fileLshArr.length; i++) {
					ZlInfo zlinfo = new ZlInfo();
					zlinfo.setBillstate(new Long(0));
					zlinfo.setIndexid(zlSortId);
					zlinfo.setPid(comFileInfo.getPid());
					zlinfo.setFileno(comFileInfo.getFileId());
					ZlGlDAO zlglDAO = ZlGlDAO
							.getFromApplicationContext(Constant.wact);
					String fileLsh = fileLshArr[i];
					String fileName = fileNameArr[i];
					zlinfo.setFilelsh(fileLsh);
					zlinfo.setFilename(fileName);
					List<RockUser> userList = this.sgccAttachListDAO
							.findByWhere(
									"com.sgepit.frame.sysman.hbm.RockUser",
									"userid = '" + comFileInfo.getFileAuther()
											+ "'");
					if (userList.size() == 1) {
						zlinfo.setResponpeople(userList.get(0).getRealname());
					}
					zlinfo.setYjr(yjrName);
					zlinfo.setStockdate(comFileInfo.getFileCreatetime());
					zlinfo.setMaterialname(fileName);
					zlinfo.setOrgid(comFileInfo.getFileDept());

					// 资料类型、份数、责任人、单位；默认值分别为：资料，1，用户自己，页
					zlinfo.setWeavecompany(userList.get(0).getRealname());
					zlinfo.setBook(3L);
					zlinfo.setZltype(zlTypeNum);
					zlinfo.setPortion(1L);

					zlglDAO.saveOrUpdate(zlinfo);
					List<SgccAttachList> list = this.sgccAttachListDAO
							.findWhere("file_lsh = '" + fileLsh + "'");
					if (list.size() == 1) {
						SgccAttachList attch = list.get(0);
						attch.setIsTrans("1");
						this.sgccAttachListDAO.saveOrUpdate(attch);
					}
				}
			}
			return true;
		} catch (Exception ex) {
			return false;
		}
	}

	public boolean cancelTrans(String fileLsh) {
		try {
			String sql = "delete zl_info where filelsh = '" + fileLsh + "'";
			String attachSql = "update SGCC_ATTACH_LIST set IS_TRANS = '0' where file_lsh ='"
					+ fileLsh + "'";
			JdbcUtil.update(attachSql);
			JdbcUtil.execute(sql);
			return true;
		} catch (Exception ex) {
			return false;
		}
	}

	public ComFileSortDAO getComFileSortDAO() {
		return comFileSortDAO;
	}

	public void setComFileSortDAO(ComFileSortDAO comFileSortDAO) {
		this.comFileSortDAO = comFileSortDAO;
	}

	public ComFileSortDeptDAO getComFileSortDeptDAO() {
		return comFileSortDeptDAO;
	}

	public void setComFileSortDeptDAO(ComFileSortDeptDAO comFileSortDeptDAO) {
		this.comFileSortDeptDAO = comFileSortDeptDAO;
	}

	public ComFileInfoDAO getComFileInfoDAO() {
		return comFileInfoDAO;
	}

	public void setComFileInfoDAO(ComFileInfoDAO comFileInfoDAO) {
		this.comFileInfoDAO = comFileInfoDAO;
	}

	public ComFilePublishHistoryDAO getComFilePublishHistoryDAO() {
		return comFilePublishHistoryDAO;
	}

	public void setComFilePublishHistoryDAO(
			ComFilePublishHistoryDAO comFilePublishHistoryDAO) {
		this.comFilePublishHistoryDAO = comFilePublishHistoryDAO;
	}

	public ComFileReadHistoryDAO getComFileReadHistoryDAO() {
		return comFileReadHistoryDAO;
	}

	public void setComFileReadHistoryDAO(
			ComFileReadHistoryDAO comFileReadHistoryDAO) {
		this.comFileReadHistoryDAO = comFileReadHistoryDAO;
	}

	public static Log getLog() {
		return log;
	}

	public SgccAttachListDAO getSgccAttachListDAO() {
		return sgccAttachListDAO;
	}

	public void setSgccAttachListDAO(SgccAttachListDAO sgccAttachListDAO) {
		this.sgccAttachListDAO = sgccAttachListDAO;
	}

	/**
	 * 将字符串转换成sql语句中in所需要的字符串
	 * 
	 * @param oriStr
	 *            原始串
	 * @param spStr
	 *            分隔符
	 * @return 返回需要的串
	 */
	private String transStrForSqlIn(String oriStr, String spStr) {

		String[] oriStrArr = oriStr.split(spStr);

		return transStrForSqlIn(oriStrArr);
	}

	private String transStrForSqlIn(String[] oriStrArr) {
		String rtnStr = "(";
		for (int i = 0; i < oriStrArr.length; i++) {
			rtnStr += "'" + oriStrArr[i] + "',";
		}
		return rtnStr.substring(0, rtnStr.length() - 1) + ")";
	}

	public ComFileInfo getFileInfoById(String uids) {
		ComFileInfo comFileInfo = (ComFileInfo) comFileInfoDAO.findById(
				"com.sgepit.fileAndPublish.hbm.ComFileInfo", uids);
		if (comFileInfo == null)
			return null;
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
		String fileAutherName = "";
		List<Map> userList = JdbcUtil
				.query("select realname from rock_user where userid = '"
						+ fileAuther + "'");
		if (userList.size() == 1) {
			if (userList.get(0) != null
					&& userList.get(0).get("realname") != null) {
				fileAutherName = userList.get(0).get("realname").toString();
			}
		}
		String fileDeptName = "";
		SgccIniUnitDAO unitDAO = SgccIniUnitDAO.getInstence();
		SgccIniUnit unit = (SgccIniUnit) unitDAO.findBeanByProperty("unitid",
				fileDeptId);
		if (unit != null) {
			fileDeptName = unit.getUnitname();
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
		return comFileInfo;
	}
	
	/**
	 * 删除没有保存的文件上传的附件
	 * 
	 * @param fileUids 文件主ID
	 */
	public void deleteUnsavedFileAttatchment( String fileUids ){
		
		String blobSql = "delete from sgcc_attach_blob where file_lsh in ( select t.file_lsh from sgcc_attach_list t where t.transaction_id = '" + fileUids + "' )";
		String attachSql = "delete from sgcc_attach_list where transaction_id = '" + fileUids + "'";
		JdbcUtil.update(blobSql);
		JdbcUtil.update(attachSql);
		
	}
	
	/**
	 * 获取文件的附件数量
	 * 
	 * @param fileUids 文件uids
	 * @param includeMainDoc 是否包含主文档的附件数量
	 * @return 附件数量
	 */
	public Integer getFileAttachCount(String fileUids, Boolean includeMainDoc){
		Integer attachCount = 0;
		String transTypeStr = "('" + transType_attach + "')";
		if (includeMainDoc  ){
			transTypeStr = "('" + transType_attach + "','" + transType + "')";
		}
		String sql = "select count(*) cnt from sgcc_attach_list where TRANSACTION_TYPE in " +
		transTypeStr + " and TRANSACTION_ID = '" + fileUids  + "'";
		List<Map<String, Object>> resultList= JdbcUtil.query(sql);
		attachCount = Integer.valueOf(resultList.get(0).get("cnt").toString());
		return attachCount;
	}

	public void reportSelectedFiles(String[] filePks, Integer reportStatus, Boolean transfer)
			throws BusinessException {
		String sql = "update com_file_info t set t.report_status = %d where t.uids in %s";
		String inStr = transStrForSqlIn(filePks);
		sql = String.format(sql, reportStatus, inStr);
		JdbcUtil.update(sql);
		
		if ( transfer ){
			exchangeReportedFiles(filePks, "1");
		}		
		
		
	}
	/**
	 * 
	 * @param fileIds
	 * @param pid
	 * @return
	 * @modify by liangwj 数据交互加入发送单位
	 */
	@SuppressWarnings("unchecked")
	public String exchangeReportedFiles(String[] fileIds, String pid){
			String fileIdInStr = transStrForSqlIn(fileIds);
			// 文件信息列表
			List<ComFileInfo> fileList = comFileInfoDAO.findByWhere(ComFileInfo.class.getName(), "uids in " + fileIdInStr, "uids");
			
			if(fileList==null||fileList.size()==0) 
				return "fail";
			// sgcc_attach_list,包括主文档和附件
			List<SgccAttachList> attachList = comFileInfoDAO.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type in ('FAPDocument', 'FAPAttach') and transaction_id in "
							+ fileIdInStr);
			List<PcDataExchange> blobExchangeList = new ArrayList<PcDataExchange>();
			// 手动生成所有attachBlob的dataExchange记录
			for (SgccAttachList attach : attachList) {
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("SGCC_ATTACH_BLOB");
				exchange.setBlobCol("FILE_NR");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("FILE_LSH", attach.getFileLsh());
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
	
				blobExchangeList.add(exchange);
			}
			PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
				.getBean("PCDataExchangeService");

			List allDataList = new ArrayList();
			allDataList.addAll(fileList);
			allDataList.addAll(attachList);
		

			List<PcDataExchange> exchangeList = dataExchangeService.getExcDataList(allDataList, pid, fileList.get(0).getPid(), 
					null, null, "文件上报【"+fileList.get(0).getPid()+"】");
			// 再将生成的attach_blob记录添加到队列中
			// 当前的xh, tx_group
			PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
			Long curXh = tempExc.getXh() + 1;
			String curTxGroup = tempExc.getTxGroup();
			for (int i = 0; i < blobExchangeList.size(); i++) {
				PcDataExchange curBlobExchange = blobExchangeList.get(i);
				curBlobExchange.setXh(curXh + i);
				curBlobExchange.setPid(pid);
				curBlobExchange.setTxGroup(curTxGroup);
				curBlobExchange.setBizInfo( "文件上报【"+fileList.get(0).getPid()+"】");
				curBlobExchange.setSpareC5(fileList.get(0).getPid());
				
				exchangeList.add(curBlobExchange);
			}
			Map<String, String> retVal = dataExchangeService.sendExchangeData(exchangeList);
			String result = retVal.get("result");
			String message = retVal.get("message");
			String retMessage = "";
			if ( result.equals("success") ){
				retMessage = "success";
			}
			else {
				retMessage = message;
			}
		return retMessage;
	}
	public String syncBuilding3GroupUnitNewTree(Map paramsmap) {
		String parentId    = paramsmap.get("parentId")==null?"":paramsmap.get("parentId").toString();//父节点
		boolean columnTree = paramsmap.get("columnTree")==null||paramsmap.get("columnTree").toString().equals("false")?false:true;
		boolean ifcheck   = paramsmap.get("ifcheck")==null||paramsmap.get("ifcheck").toString().equals("false")?false:true;
		String userunitid  = paramsmap.get(Constant.USERUNITID).toString();
		String typeName    = paramsmap.get("typeName")==null?"组织机构类型": paramsmap.get("typeName").toString();
		String unitbean    = "com.sgepit.frame.sysman.hbm.SgccIniUnit";
		String _unitsort = ((SgccIniUnit)systemDao.findBeanByProperty(unitbean, "unitid", userunitid)).getUnitTypeId();
		String baseWhere  = paramsmap.get("baseWhere")!=null?paramsmap.get("baseWhere").toString():"1=1";
		String unitid_=paramsmap.get("unitid").toString();
		String upunit=paramsmap.get("upunit").toString();
		String hascheck=paramsmap.get("hascheck").toString();
		String jsonstring = "";
		//部署在项目单位还是集团
		String deployUnitType = Constant.propsMap.get("DEPLOY_UNITTYPE");
		
		Map<String,Object> attrMap = new HashMap<String,Object>();
		if(hascheck!=null&&hascheck.equals("yes")){
			if(ifcheck)   attrMap.put("checked", false);
			if(columnTree) attrMap.put("uiProvider", "col");
			attrMap.put("modifyauth", true);//具有编辑权限	
			
		}
		
		String unitTypeStr = "'9'";
		//若是部署到集团，则不显示外部单位
		if ( deployUnitType.equals("0") ){
			unitTypeStr = "'7', '9'";
		}
		
			JSONArray jsonArray = new JSONArray();			
			String sql = "select distinct * from (select distinct * from " +
				"(select * from sgcc_ini_unit start with unitid ='"+unitid_+"' connect by prior upunit=unitid union all" +
				" select * from sgcc_ini_unit start with unitid in " +
				"(select unitid from (select t.* from sgcc_ini_unit t start with unitid ='"+upunit+"' connect by prior" +
				" unitid=upunit) where unit_type_id='1') connect by prior unitid = upunit union all " +
				" select t.* from sgcc_ini_unit t start with unitid ='"+unitid_+"' connect by prior unitid=upunit ) )t1 " +
				"where t1.unit_type_id not in(" + unitTypeStr + ") start with t1.unitid = '"+upunit+"' connect by prior " +
				"t1.unitid=t1.upunit";
			sql += " order siblings by view_order_num";
			Session ses = HibernateSessionFactory.getSession();
			SQLQuery q = ses.createSQLQuery(sql).addEntity(SgccIniUnit.class);
			List<SgccIniUnit> list = q.list();
			ses.close();
			SgccIniUnit hbm = (SgccIniUnit)list.get(0);
			if(list!=null){
				for(int i=0;i<list.size();i++){
					SgccIniUnit hbmback= (SgccIniUnit)list.get(i);
					if(hbmback.getUnitid().equals(upunit)){
						hbm=hbmback;
						break;
					}
				}
			}
				hbm.setLeaf(1);
				List<SgccIniUnit> list1 = list;
				for (int i=0; i<list1.size(); i++){
					SgccIniUnit hbm1 = list1.get(i);
					if(hbm1.getUpunit().equals(hbm.getUnitid())) {
						hbm.setLeaf(0);
						break;
					}
				}
				
				JSONObject jsonobject = JSONObject.fromObject(hbm);
				addAttributesToUnitNode(jsonobject, attrMap);
				
				if(hbm.getLeaf()==0){
					jsonobject.put("children",syncGetUnitChildrens1(hbm,list,baseWhere, attrMap));
				}
				jsonArray.add(jsonobject);
			jsonstring = jsonArray.toString();
			//System.out.println("-----: " + jsonstring);
		
		return jsonstring;
	}
	private void addAttributesToUnitNode(JSONObject jsonObject, Map<String,Object> attributesMap){
		PropertyCode pchbm = propsMap.get(jsonObject.get("unitTypeId").toString());
		jsonObject.put("text", jsonObject.get("unitname"));
		jsonObject.put("id", jsonObject.get("unitid"));
		if(attributesMap!=null) jsonObject.putAll(attributesMap);
		
		if(pchbm!=null){
			jsonObject.put("orgsort", pchbm.getDetailType());//类别代码
			jsonObject.put("orgtypename", pchbm.getPropertyName());//分类名称
		}else{
			jsonObject.put("orgsort", "");//类别代码
			jsonObject.put("orgtypename", "");//分类名称
		}
	}
	private JSONArray syncGetUnitChildrens1( SgccIniUnit hbm , List<SgccIniUnit> unitList,String baseWhere, Map<String,Object> attributesMap){
		
		JSONArray jsonarray = new JSONArray();
		for(Iterator it=unitList.iterator();it.hasNext();){
			SgccIniUnit hbm0 = (SgccIniUnit) it.next();
			if(hbm.getUnitid().equals(hbm0.getUpunit())) {
				hbm0.setLeaf(1);
				List<SgccIniUnit> list1 = unitList;
				for (int i=0; i<list1.size(); i++){
					SgccIniUnit hbm1 = list1.get(i);
					if(hbm1.getUpunit().equals(hbm0.getUnitid())) {
						hbm0.setLeaf(0);
						break;
					}
				}
				JSONObject jsonobject = JSONObject.fromObject(hbm0);
				addAttributesToUnitNode(jsonobject, attributesMap);
				if(hbm0.getLeaf()==0){
					jsonobject.put("children",syncGetUnitChildrens1(hbm0, unitList,baseWhere,attributesMap));
				}
				jsonarray.add(jsonobject);
			}
		}
		//System.out.println("====" + jsonarray);
		return jsonarray;
	}
	/**
	 * 获取符合查询条件的所有已读或未读文档信息
	 * 
	 * @param sortIds
	 *            分类节点ID，多个用CAFConsatan.SPLITB进行分割
	 * @param showType
	 *            数据格式 是否显示自分类数据-是否显示无权限访问的数据 1-1：显示该分类及他所有子分类下所有的文档；
	 *            1-0：显示该分类及他所有自分类下的且该用户具备访问权限的所有文档；
	 * @param whereStr过滤条件
	 * @param stateSelected过滤条件
	 * @return
	 */
	public List<ComFileInfo> getComFileoReadOrNotInfoBySortId(String sortIds,String stateSelected,
			String userId,String whereStr, String orderby, Integer start, Integer limit) {
		String where = whereStr == null ? "1=1" : whereStr
				+ " and file_sort_id in ("
				+ StringUtil.transStrToIn(sortIds, FAPConstant.SPLITB) + ")";
		if (stateSelected.equals("all")) {
			where += " and 1=1 ";
		} else {
			List<ComFileReadHistory> readHistoryList = this.comFileReadHistoryDAO
					.findWhere("file_reader = '" + userId + "'");
			if (readHistoryList.size() > 0) {
				String fileIds = "";
				for (int i = 0; i < readHistoryList.size(); i++) {
					fileIds += "," + readHistoryList.get(i).getFileId();
				}
				fileIds = fileIds.substring(1);
				if (stateSelected.equals("unRead")) {
					where += " and uids not in "
							+ this.transStrForSqlIn(fileIds, ",") + "";
				} else if (stateSelected.equals("read")) {
					where += " and uids in "
							+ this.transStrForSqlIn(fileIds, ",") + "";
				}
			}
		}		
		List<ComFileInfo> list = this.comFileInfoDAO.findByWhere(where,
				orderby, start, limit);
		
		
		return list;
	}
	/**
	 * 获取未读消息数量,发布与上报之和
	 * @param pid项目单位
	 * @param userId
	 * @param deptId
	 *@param rootIdPublish项目单位模块根节点
	 *@param rootIdUpload项目单位模块根节点
	 * @return
	 */
	public Integer getUnreadMsgNumTotal(String pid,String userId, String deptId,String rootIdPublish,String rootIdUpload) {		
		String whereStr = " 1 = 1 ";
		String whereUpload= " reportStatus = 1 ";
		if (rootIdPublish != null) {
			if (whereStr == null || whereStr.equals("")) {
				whereStr = "1=1 ";
			}
			whereStr += " and file_id in (select uids from com.sgepit.fileAndPublish.hbm.ComFileInfo where fileSortId in ("
					+ StringUtil.transStrToIn(this.getSortIds("ALL",
							rootIdPublish, null).substring(1), FAPConstant.SPLITB)
					+ "))";		
		}	
		if(rootIdUpload!=null){
			whereUpload += " and uids in (select uids from com.sgepit.fileAndPublish.hbm.ComFileInfo where fileSortId in ("
				+ StringUtil.transStrToIn(this.getSortIds("ALL",
						rootIdUpload, null).substring(1), FAPConstant.SPLITB)
				+ "))";	
		}
		List<ComFileReadHistory> readHistoryList = this.comFileReadHistoryDAO
				.findWhere("file_reader = '" + userId + "'");
		if (readHistoryList.size() > 0) {
			String fileIds = "";
			for (int i = 0; i < readHistoryList.size(); i++) {
				fileIds += "," + readHistoryList.get(i).getFileId();
			}
			fileIds = fileIds.substring(1);

			whereStr += " and file_id not in "
					+ this.transStrForSqlIn(fileIds, ",") + "";
			whereUpload+=" and uids not in "
			+ this.transStrForSqlIn(fileIds, ",") + "";
		}

		whereStr += " and ((publish_type = 'group' and receiver = '" + deptId
				+ "') or (publish_type = 'person' and receiver = '" + userId
				+ "'))";
		List<ComFilePublishHistory> phList = this.comFilePublishHistoryDAO
				.findByWhere(ComFilePublishHistory.class.getName(), whereStr);

		List<ComFileInfo> list = this.comFileInfoDAO.findByWhere(ComFileInfo.class.getName(),whereUpload
				);
		return phList.size()+list.size();
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
	/**
	 * 将用户上报的所有未读文件标记为已读
	 * 
	 * @param userId 用户id
	 * @param sortId 文件分类ID
	 * @param pid 项目单位ID
	 * @return true 表示成功， false表示失败
	 */	
	public boolean markAllAsReadForUserUpload(String userId, String sortId,String pid){
		boolean retVal = true;
		String whereUpload= " reportStatus = 1 ";
		if(!pid.equals("")){
			whereUpload+=" and pid = '" + pid + "' ";			
		}
		if (sortId != null) {
			whereUpload += " and uids in (select uids from com.sgepit.fileAndPublish.hbm.ComFileInfo where fileSortId in ("
				+ StringUtil.transStrToIn(this.getSortIds("ALL",
						sortId, null).substring(1), FAPConstant.SPLITB)
				+ "))";			
		}		
		List<ComFileReadHistory> readHistoryList = this.comFileReadHistoryDAO
		.findWhere("file_reader = '" + userId + "'");
		if (readHistoryList.size() > 0) {
			String fileIds = "";
			for (int i = 0; i < readHistoryList.size(); i++) {
				fileIds += "," + readHistoryList.get(i).getFileId();
			}
			fileIds = fileIds.substring(1);
			whereUpload+=" and uids not in "
				+ this.transStrForSqlIn(fileIds, ",") + "";
			}	
		List<ComFileInfo> list = this.comFileInfoDAO.findByWhere(ComFileInfo.class.getName(),whereUpload);
			if(list.size()>0){
				String[] filePks = new String[list.size()];
				for (int i = 0; i < list.size(); i++) {
					filePks[i] = list.get(i).getUids();
				}
				retVal = markSelectedFilesAsRead(userId,filePks, true);	
		}
		
		return retVal;
		
	}	
	/**
	 * 获取未读消息数量,发布到当前节点的
	 * @param userId
	 * @param deptId
	* @param rootId项目单位模块根节点
	 * @return
	 */
	public Integer getUnreadMsgNumPublish(String userId, String deptId,String rootId) {		
		String whereStr = " 1 = 1 ";
		if (rootId != null) {
			if (whereStr == null || whereStr.equals("")) {
				whereStr = "1=1 ";
			}
			whereStr += " and file_id in (select uids from com.sgepit.fileAndPublish.hbm.ComFileInfo where fileSortId in ("
					+ StringUtil.transStrToIn(this.getSortIds("ALL",
							rootId, null).substring(1), FAPConstant.SPLITB)
					+ "))";
			}		
		List<ComFileReadHistory> readHistoryList = this.comFileReadHistoryDAO
				.findWhere("file_reader = '" + userId + "'");
		if (readHistoryList.size() > 0) {
			String fileIds = "";
			for (int i = 0; i < readHistoryList.size(); i++) {
				fileIds += "," + readHistoryList.get(i).getFileId();
			}
			fileIds = fileIds.substring(1);

			whereStr += " and file_id not in "
					+ this.transStrForSqlIn(fileIds, ",") + "";
		}

		whereStr += " and ((publish_type = 'group' and receiver = '" + deptId
				+ "') or (publish_type = 'person' and receiver = '" + userId
				+ "'))";
		List<ComFilePublishHistory> phList = this.comFilePublishHistoryDAO
				.findByWhere(ComFilePublishHistory.class.getName(), whereStr);
		return phList.size();
	}	
	
	/**
	 * 获取未读消息数量,上报到当前节点的
	 * @param userId
	 * @param deptId
	* @param rootId项目单位模块根节点
	 * @return
	 */
	public Integer getUnreadMsgNumUpload(String userId, String deptId,String rootId) {		
		String whereUpload= " reportStatus = 1 ";
		if (rootId != null) {
			whereUpload += " and uids in (select uids from com.sgepit.fileAndPublish.hbm.ComFileInfo where fileSortId in ("
				+ StringUtil.transStrToIn(this.getSortIds("ALL",
						rootId, null).substring(1), FAPConstant.SPLITB)
				+ "))";			
		}		
		List<ComFileReadHistory> readHistoryList = this.comFileReadHistoryDAO
				.findWhere("file_reader = '" + userId + "'");
		if (readHistoryList.size() > 0) {
			String fileIds = "";
			for (int i = 0; i < readHistoryList.size(); i++) {
				fileIds += "," + readHistoryList.get(i).getFileId();
			}
			fileIds = fileIds.substring(1);
		whereUpload+=" and uids not in "
			+ this.transStrForSqlIn(fileIds, ",") + "";
		}
		List<ComFileInfo> list = this.comFileInfoDAO.findByWhere(ComFileInfo.class.getName(),whereUpload
				);
		return list.size();
	}	
	/**
	 * 根据模块名称，用户主键获取模块的URL
	 * @param moduleName模块名称
	 * @param userId
	 * @return
	 */
	public String getModuleUrlByUserId(String moduleName,String userId){
		String url="";
		try {
			String moduleId=systemMgm.getModuleIdByName(moduleName, null);
			RockUser rockUser=(RockUser) systemDao.findById("com.sgepit.frame.sysman.hbm.RockUser", userId);			
			HashMap<String,RockPower>mapModules=systemMgm.getUserModules(rockUser);
			RockPower mapModule=mapModules.get(moduleId);
			if(null!=mapModule){
				url=mapModule.getUrl();
			}
		} catch (RuntimeException e) {
			url="";
		}
		return url;
	}
	
	/**
	 * 根据模块id，用户主键获取模块的URL
	 * @param moduleName模块名称
	 * @param userId
	 * @return
	 */
	public String getModuleUrlByUserModouleId(String powerPk,String userId){
		String url="";
		try {
			RockUser rockUser=(RockUser) systemDao.findById("com.sgepit.frame.sysman.hbm.RockUser", userId);			
			HashMap<String,RockPower>mapModules=systemMgm.getUserModules(rockUser);
			RockPower mapModule=mapModules.get(powerPk);
			if(null!=mapModule){
				url=mapModule.getUrl();
			}
		} catch (RuntimeException e) {
			url="";
		}
		return url;
	}
	public SystemDao getSystemDao() {
		return systemDao;
	}

	public void setSystemDao(SystemDao systemDao) {
		this.systemDao = systemDao;
	}

	public SystemMgmFacade getSystemMgm() {
		return systemMgm;
	}

	public void setSystemMgm(SystemMgmFacade systemMgm) {
		this.systemMgm = systemMgm;
	}
	/**
	 * @param paramsmap
	 * @流程统计页面选择项目单位下拉框
	 */
	public String buildingFlowGroupUnitNewTree(Map paramsmap) {
		// TODO Auto-generated method stub
		String parentId    = paramsmap.get("parentId")==null?"":paramsmap.get("parentId").toString();//父节点
		boolean columnTree = paramsmap.get("columnTree")==null||paramsmap.get("columnTree").toString().equals("false")?false:true;
		boolean ifcheck   = paramsmap.get("ifcheck")==null||paramsmap.get("ifcheck").toString().equals("false")?false:true;
		String userunitid  = paramsmap.get(Constant.USERUNITID).toString();
		String typeName    = paramsmap.get("typeName")==null?"组织机构类型": paramsmap.get("typeName").toString();
		String unitbean    = "com.sgepit.frame.sysman.hbm.SgccIniUnit";
		String _unitsort = ((SgccIniUnit)systemDao.findBeanByProperty(unitbean, "unitid", userunitid)).getUnitTypeId();
		String baseWhere  = paramsmap.get("baseWhere")!=null?paramsmap.get("baseWhere").toString():"1=1";
		String unitid_=paramsmap.get("unitid").toString();
		String upunit=paramsmap.get("upunit").toString();
		String hascheck=paramsmap.get("hascheck").toString();
		String jsonstring = "";
		//部署在项目单位还是集团
		String deployUnitType = Constant.propsMap.get("DEPLOY_UNITTYPE");
		String unitTypeStr = "'9'";
		//若是部署到集团，则不显示外部单位
		if ( deployUnitType.equals("0") ){
			unitTypeStr = "'7', '9'";
		}
		
			JSONArray jsonArray = new JSONArray();			
			String sql = "select distinct * from (select distinct * from " +
				"(select * from sgcc_ini_unit start with unitid ='"+unitid_+"' connect by prior upunit=unitid union all" +
				" select * from sgcc_ini_unit start with unitid in " +
				"(select unitid from (select t.* from sgcc_ini_unit t start with unitid ='"+upunit+"' connect by prior" +
				" unitid=upunit) where unit_type_id='1') connect by prior unitid = upunit union all " +
				" select t.* from sgcc_ini_unit t start with unitid ='"+unitid_+"' connect by prior unitid=upunit ) )t1 " +
				"where t1.unit_type_id not in(" + unitTypeStr + ") start with t1.unitid = '"+upunit+"' connect by prior " +
				"t1.unitid=t1.upunit";
			sql += " order siblings by view_order_num";
			Session ses = HibernateSessionFactory.getSession();
			SQLQuery q = ses.createSQLQuery(sql).addEntity(SgccIniUnit.class);
			List<SgccIniUnit> list = q.list();
			ses.close();
			SgccIniUnit hbm = (SgccIniUnit)list.get(0);
			if(list!=null){
				for(int i=0;i<list.size();i++){
					SgccIniUnit hbmback= (SgccIniUnit)list.get(i);
					if(hbmback.getUnitid().equals(upunit)){
						hbm=hbmback;
						break;
					}
				}
			}
				hbm.setLeaf(1);
				List<SgccIniUnit> list1 = list;
				for (int i=0; i<list1.size(); i++){
					SgccIniUnit hbm1 = list1.get(i);
					if(hbm1.getUpunit().equals(hbm.getUnitid())) {
						hbm.setLeaf(0);
						break;
					}
				}
				JSONObject jsonobject = JSONObject.fromObject(hbm);
				Map<String,Object> attrMap = new HashMap<String,Object>();
				if(hascheck!=null&&hascheck.equals("yes")){
					if(ifcheck)   attrMap.put("checked", false);
					if(columnTree) attrMap.put("uiProvider", "col");
					if(hbm.getLeaf()==0){
					   attrMap.put("modifyauth", true);//具有编辑权限	
					}else{
					   attrMap.put("modifyauth", false);//没有编辑权限	
					}
				}
		
				addAttributesToUnitNode(jsonobject, attrMap);
				if(hbm.getLeaf()==0){
					jsonobject.put("children",syncGetUnitChildrens1(hbm,list,baseWhere, attrMap));
				}
				jsonArray.add(jsonobject);
			jsonstring = jsonArray.toString();
			//System.out.println("-----: " + jsonstring);
		
		return jsonstring;
	
	}
	/**
	 * 根据集团删除分类模块时，下发分类的项目单位也对应删除
	 * @param fileArr模块流水号 
	 * @param unitId项目单位编号 
	 * @param businessType模块类型
	 * @param blobTable大对象表名称
	 * @param beanName模板主表名称
	 * @return
	 */
	public String deleteFileByUnitId(String fileArr[],String unitId[],String businessType,String blobTable,String beanName){
		String flag="1";
		PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
		.getBean("PCDataExchangeService");			
		if(fileArr!=null){
			for(int i=0;i<fileArr.length;i++){//待删除的模板
				String afterSqlMain="delete from "+beanName+" where transaction_type='"+businessType+"' and file_lsh='"+fileArr[i]+"'";	
				String afterSqlBlob="delete from "+blobTable+" where file_lsh='"+fileArr[i]+"'";	
			    if(unitId!=null){//已下发的项目单位
			    	for(int j=0;j<unitId.length;j++){
			    		String pid=unitId[j];
			    		String txGroup=SnUtil.getNewID();
			    		List<PcDataExchange> excList = new ArrayList<PcDataExchange>();
						PcDataExchange pe = new PcDataExchange();
						pe.setUids(SnUtil.getNewID());
						pe.setSqlData(afterSqlMain);
						pe.setPid(pid);
						pe.setTxGroup("tx"+txGroup);
						pe.setBizInfo("项目编码为【"+pid+"】的项目单位删除分类模块文件主表。");
						PcDataExchange pe2 = new PcDataExchange();
						pe2.setSqlData(afterSqlBlob);
						pe2.setPid(pid);
						pe2.setUids(SnUtil.getNewID());
						pe2.setTxGroup("tx"+txGroup);
						pe2.setBizInfo("项目编码为【"+pid+"】的项目单位删除分类模块文件大对象表。");
						excList.add(pe);
						excList.add(pe2);					
						try {
							dataExchangeService.sendExchangeData(excList);
						} catch (RuntimeException e) {
						
						}			    		
			    	}
			    }
				
			}
		}
		return flag;
	}
	/**
	 * 获取招投标模块文件移交资料室的grid 的数据
	 * @param type
	 * @param fileId
	 * @param fileTypes
	 * @param yjrId
	 * @return
	 */
	public String getJsonStrForTransToZLSByType(String type,String fileIds, String fileTypes,
			String yjrName) {
		String fileIdSqlStr = transStrForSqlIn(fileIds, ",");
		List<SgccAttachList> list = this.sgccAttachListDAO
				.findWhere("TRANSACTION_ID in " + fileIdSqlStr
						+ " and TRANSACTION_TYPE in "
						+ this.transStrForSqlIn(fileTypes, ",") + " ");

		// 所有主文件列表
		Map<String, String> mainFileNameMap = new HashMap<String, String>();
		if("PcBidZbApply".equals(type)){
			List<PcBidZbApply>mainFile=comFileInfoDAO.findWhere("UIDS in "
					+ fileIdSqlStr);
			for (PcBidZbApply pcBidZbApply : mainFile) {
				mainFileNameMap.put(pcBidZbApply.getUids(), pcBidZbApply
						.getZbName());
			}
		}
		else if("PcBidZbAgency".equals(type)){
			List<PcBidZbAgency>mainFile=comFileInfoDAO.findWhere("UIDS in "
					+ fileIdSqlStr);
			for (PcBidZbAgency pcBidZbAgency : mainFile) {
				mainFileNameMap.put(pcBidZbAgency.getUids(), pcBidZbAgency
						.getAgencyName());
			}
		}	
		else if("PcBidPublishNotice".equals(type)){
			List<PcBidPublishNotice>mainFile=comFileInfoDAO.findWhere("UIDS in "
					+ fileIdSqlStr);
			for (PcBidPublishNotice pcBidPublishNotice : mainFile) {
				mainFileNameMap.put(pcBidPublishNotice.getUids(), pcBidPublishNotice
						.getPubTitle());
			}
		}
		else if("PcBidTbUnitInfo".equals(type)){
			List<PcBidTbUnitInfo>mainFile=comFileInfoDAO.findWhere("UIDS in "
					+ fileIdSqlStr);
			for (PcBidTbUnitInfo pcBidTbUnitInfo : mainFile) {
				mainFileNameMap.put(pcBidTbUnitInfo.getUids(), pcBidTbUnitInfo
						.getMemo());
			}
		}
		else if("PcBidAcceptTbdocAndBond".equals(type)){
			List<PcBidAcceptTbdocAndBond>mainFile=comFileInfoDAO.findWhere("UIDS in "
					+ fileIdSqlStr);
			for (PcBidAcceptTbdocAndBond pcBidAcceptTbdocAndBond : mainFile) {
				mainFileNameMap.put(pcBidAcceptTbdocAndBond.getUids(), pcBidAcceptTbdocAndBond
						.getMemo());
			}
		}
		else if("PcBidOpenBidding".equals(type)){
			List<PcBidOpenBidding>mainFile=comFileInfoDAO.findWhere("UIDS in "
					+ fileIdSqlStr);
			for (PcBidOpenBidding pcBidOpenBidding : mainFile) {
				mainFileNameMap.put(pcBidOpenBidding.getUids(), pcBidOpenBidding
						.getMemo());
			}
		}
		else if("PcBidJudgeBidding".equals(type)){
			List<PcBidJudgeBidding>mainFile=comFileInfoDAO.findWhere("UIDS in "
					+ fileIdSqlStr);
			for (PcBidJudgeBidding pcBidJudgeBidding : mainFile) {
				mainFileNameMap.put(pcBidJudgeBidding.getUids(), pcBidJudgeBidding
						.getMemo());
			}
		}
		else if("PcBidIssueWinDoc".equals(type)){
			List<PcBidIssueWinDoc>mainFile=comFileInfoDAO.findWhere("UIDS in "
					+ fileIdSqlStr);
			for (PcBidIssueWinDoc pcBidIssueWinDoc : mainFile) {
				mainFileNameMap.put(pcBidIssueWinDoc.getUids(), pcBidIssueWinDoc
						.getMemo());
			}
		}
		else if("PcBidProgress".equals(type)){
			List<PcBidProgress>mainFile=comFileInfoDAO.findWhere("UIDS in "
					+ fileIdSqlStr);
			for (PcBidProgress pcBidProgress : mainFile) {
				mainFileNameMap.put(pcBidProgress.getUids(), pcBidProgress
						.getMemo());
			}
		}		

		StringBuffer rtnStrBuf = new StringBuffer("[");
		for (int i = 0; i < list.size(); i++) {
			SgccAttachList sgccAttachList = (SgccAttachList) list.get(i);
			List<ZlInfo> zlList = this.sgccAttachListDAO.findWhereOrderBy(
					ZlInfo.class.getName(), "filelsh = '"
							+ sgccAttachList.getFileLsh() + "'", null);
			rtnStrBuf.append("{");

			PropertyCodeDAO propertyDAO = PropertyCodeDAO.getInstence();
			String fileTypeName = propertyDAO.getCodeNameByPropertyName(
					sgccAttachList.getTransactionType(), "文件类型");
			fileTypeName = fileTypeName == null ? "" : fileTypeName;
			rtnStrBuf.append("fileType:'" + sgccAttachList.getTransactionType()
					+ "',");
			rtnStrBuf.append("fileTypeName:'" + fileTypeName + "',");
			rtnStrBuf.append("fileId:'"
					+ sgccAttachList.getId().getTransactionId() + "',");
			rtnStrBuf.append("mainFileName:'"
					+ mainFileNameMap.get(sgccAttachList.getId()
							.getTransactionId()) + "',");
			rtnStrBuf.append("fileLsh:'" + sgccAttachList.getFileLsh() + "',");
			rtnStrBuf
					.append("fileName:'" + sgccAttachList.getFileName() + "',");
			if (zlList.size() == 1) {
				ZlInfo zlInfo = zlList.get(0);
				String yjr = zlInfo.getYjr();
				List<ZlTree> zlTreeList = this.sgccAttachListDAO.findByWhere(
						"com.sgepit.pmis.document.hbm.ZlTree", "indexId = '"
								+ zlInfo.getIndexid() + "'");
				ZlTree zlTree = zlTreeList.size() == 1 ? zlTreeList.get(0)
						: null;
				String yjStr = "";
				if (yjr != null) {
					if (yjr.equals(yjrName)) {
						yjStr = "已被 【我】 移交到 【" + zlTree.getMc() + "】 分类下";
					} else {
						yjStr = "已被 【" + yjr + "】 移交到 【" + yjrName + "】 分类下";
					}
				} else {
					yjStr = "已移交到 【" + zlTree.getMc() + "】 分类下";
				}
				rtnStrBuf.append("isTrans:'1',");
				rtnStrBuf.append("transState:'" + zlInfo.getBillstate() + "',");
				rtnStrBuf.append("yjStr:'" + yjStr + "'");

			} else {
				rtnStrBuf.append("isTrans:'0',");
				rtnStrBuf.append("yjStr:'未移交'");
			}
			rtnStrBuf.append("},");
		}
		if (rtnStrBuf.lastIndexOf(",") == rtnStrBuf.length() - 1)
			rtnStrBuf.deleteCharAt(rtnStrBuf.length() - 1);
		rtnStrBuf.append("]");
		return rtnStrBuf.toString();
	}	
	/**
	 * 招投标模块文件移交资料室
	 * @param userdeptid
 	 * @param uesrid
	 * @param type
	 * @param fileMap
	 * @param fileId
	 * @param zlSortId
	 * @param userId
	 * @return
	 */
	public boolean transToZLSByType(String userdeptid,String userid,String type,String fileLshs, String fileNames, String fileId,
			String zlSortId, String yjrName) {

		try {

			String zlType = PropertyCodeDAO.getInstence()
					.getCodeValueByPropertyName("招投标文件", "资料类型");
			if (zlType != null) {
				zlType = "4";
			}
			Long zlTypeNum = Long.valueOf(zlType);
			ComFileInfo comFileInfo = new ComFileInfo();
			if("PcBidZbApply".equals(type)){
				PcBidZbApply pcBidZbApply= (PcBidZbApply) this.systemDao.findById(PcBidZbApply.class.getName(), fileId);
				comFileInfo.setPid(pcBidZbApply.getPid());
				comFileInfo.setFileId(pcBidZbApply.getUids());
				comFileInfo.setFileAuther(userid);
				comFileInfo.setFileCreatetime(new Date());
				comFileInfo.setFileDept(userdeptid);
			}
			else if("PcBidZbAgency".equals(type)){
				PcBidZbAgency pcBidZbAgency= (PcBidZbAgency) this.systemDao.findById(PcBidZbAgency.class.getName(), fileId);
				comFileInfo.setPid(pcBidZbAgency.getPid());
				comFileInfo.setFileId(pcBidZbAgency.getUids());
				comFileInfo.setFileAuther(userid);
				comFileInfo.setFileCreatetime(new Date());
				comFileInfo.setFileDept(userdeptid);
			}	
			else if("PcBidPublishNotice".equals(type)){
				PcBidPublishNotice pcBidPublishNotice= (PcBidPublishNotice) this.systemDao.findById(PcBidPublishNotice.class.getName(), fileId);
				comFileInfo.setPid(pcBidPublishNotice.getPid());
				comFileInfo.setFileId(pcBidPublishNotice.getUids());
				comFileInfo.setFileAuther(userid);
				comFileInfo.setFileCreatetime(new Date());
				comFileInfo.setFileDept(userdeptid);
			}	
			else if("PcBidTbUnitInfo".equals(type)){
				PcBidTbUnitInfo pcBidTbUnitInfo= (PcBidTbUnitInfo) this.systemDao.findById(PcBidTbUnitInfo.class.getName(), fileId);
				comFileInfo.setPid(pcBidTbUnitInfo.getPid());
				comFileInfo.setFileId(pcBidTbUnitInfo.getUids());
				comFileInfo.setFileAuther(userid);
				comFileInfo.setFileCreatetime(new Date());
				comFileInfo.setFileDept(userdeptid);
			}	
			else if("PcBidAcceptTbdocAndBond".equals(type)){
				PcBidAcceptTbdocAndBond pcBidAcceptTbdocAndBond= (PcBidAcceptTbdocAndBond) this.systemDao.findById(PcBidAcceptTbdocAndBond.class.getName(), fileId);
				comFileInfo.setPid(pcBidAcceptTbdocAndBond.getPid());
				comFileInfo.setFileId(pcBidAcceptTbdocAndBond.getUids());
				comFileInfo.setFileAuther(userid);
				comFileInfo.setFileCreatetime(new Date());
				comFileInfo.setFileDept(userdeptid);
			}		
			else if("PcBidOpenBidding".equals(type)){
				PcBidOpenBidding pcBidOpenBidding= (PcBidOpenBidding) this.systemDao.findById(PcBidOpenBidding.class.getName(), fileId);
				comFileInfo.setPid(pcBidOpenBidding.getPid());
				comFileInfo.setFileId(pcBidOpenBidding.getUids());
				comFileInfo.setFileAuther(userid);
				comFileInfo.setFileCreatetime(new Date());
				comFileInfo.setFileDept(userdeptid);
			}
			else if("PcBidJudgeBidding".equals(type)){
				PcBidJudgeBidding pcBidJudgeBidding= (PcBidJudgeBidding) this.systemDao.findById(PcBidJudgeBidding.class.getName(), fileId);
				comFileInfo.setPid(pcBidJudgeBidding.getPid());
				comFileInfo.setFileId(pcBidJudgeBidding.getUids());
				comFileInfo.setFileAuther(userid);
				comFileInfo.setFileCreatetime(new Date());
				comFileInfo.setFileDept(userdeptid);
			}	
			else if("PcBidIssueWinDoc".equals(type)){
				PcBidIssueWinDoc pcBidIssueWinDoc= (PcBidIssueWinDoc) this.systemDao.findById(PcBidIssueWinDoc.class.getName(), fileId);
				comFileInfo.setPid(pcBidIssueWinDoc.getPid());
				comFileInfo.setFileId(pcBidIssueWinDoc.getUids());
				comFileInfo.setFileAuther(userid);
				comFileInfo.setFileCreatetime(new Date());
				comFileInfo.setFileDept(userdeptid);
			}
			else if("PcBidProgress".equals(type)){
				PcBidProgress pcBidProgress= (PcBidProgress) this.systemDao.findById(PcBidProgress.class.getName(), fileId);
				comFileInfo.setPid(pcBidProgress.getPid());
				comFileInfo.setFileId(pcBidProgress.getUids());
				comFileInfo.setFileAuther(userid);
				//comFileInfo.setFileCreatetime(new Date());
				comFileInfo.setFileDept(userdeptid);
			}
			if (comFileInfo != null) {
				String[] fileLshArr = fileLshs.split(",");
				String[] fileNameArr = fileNames.split(",");
				for (int i = 0; i < fileLshArr.length; i++) {
					ZlInfo zlinfo = new ZlInfo();
					zlinfo.setBillstate(new Long(0));
					zlinfo.setIndexid(zlSortId);
					zlinfo.setPid(comFileInfo.getPid());
					//zlinfo.setFileno(comFileInfo.getFileId());
					ZlGlDAO zlglDAO = ZlGlDAO
							.getFromApplicationContext(Constant.wact);
					String fileLsh = fileLshArr[i];
					String fileName = fileNameArr[i];
					zlinfo.setFilelsh(fileLsh);
					zlinfo.setFilename(fileName);
					List<RockUser> userList = this.sgccAttachListDAO
							.findByWhere(
									"com.sgepit.frame.sysman.hbm.RockUser",
									"userid = '" + comFileInfo.getFileAuther()
											+ "'");
					if (userList.size() == 1) {
						zlinfo.setResponpeople(userList.get(0).getRealname());
					}
					zlinfo.setYjr(yjrName);
					List<SgccAttachList> list = this.sgccAttachListDAO
					.findWhere("file_lsh = '" + fileLsh + "'");				
					zlinfo.setStockdate(list.get(0).getUploadDate());
					zlinfo.setMaterialname(fileName);
					zlinfo.setOrgid(comFileInfo.getFileDept());

					// 资料类型、份数、责任人、单位；默认值分别为：资料，1，用户自己，页
					zlinfo.setWeavecompany(userList.get(0).getRealname());
					zlinfo.setBook(3L);
					zlinfo.setZltype(zlTypeNum);
					zlinfo.setPortion(1L);
					zlinfo.setQuantity(1L);
					zlinfo.setRkrq(new Date());
					zlglDAO.saveOrUpdate(zlinfo);
					if (list.size() == 1) {
						SgccAttachList attch = list.get(0);
						attch.setIsTrans("1");
						this.sgccAttachListDAO.saveOrUpdate(attch);
					}
				}
			}
			return true;
		} catch (Exception ex) {
			return false;
		}
	}
	/**
	 * 批量回收 
	 * 
	 * @param filePks
	 * @return
	 */
	public boolean recycleSelectedFiles(String[] filePks) {
		for (int i = 0; i < filePks.length; i++) {
			ComFileInfo comFileInfo=(ComFileInfo) this.comFileInfoDAO
					.findById(filePks[i]);
			comFileInfo.setStatePublish(Long.valueOf("2"));
			this.comFileInfoDAO.saveOrUpdate(comFileInfo);
			List<ComFilePublishHistory>list=this.comFileInfoDAO.findByWhere(ComFilePublishHistory.class.getName(), "fileId='"+filePks[i]+"'");
			this.comFileInfoDAO.deleteAll(list);
			List<ComFileReadHistory>listRead=this.comFileInfoDAO.findByWhere(ComFileReadHistory.class.getName(), "fileId='"+filePks[i]+"'");
			this.comFileInfoDAO.deleteAll(listRead);
			
		}

		return true;
	}	

	/**
	 * 获取符合查询条件的所有整改通知单
	 * 
	 * @param sortIds
	 *            分类节点ID，多个用CAFConsatan.SPLITB进行分割
	 * @param showType
	 *            数据格式 是否显示自分类数据-是否显示无权限访问的数据 1-1：显示该分类及他所有子分类下所有的文档；
	 *            1-0：显示该分类及他所有自分类下的且该用户具备访问权限的所有文档；
	 * @param deptIds
	 *            其他辅助过滤条件
	 * @return
	 */
	public List<ReformNoticeInfoView> getReformNoticeBySortId(String sortIds, String whereStr, String orderby, Integer start, Integer limit){
		String where = whereStr == null ? "1=1" : whereStr + " and file_sort_id in ("
				+ StringUtil.transStrToIn(sortIds, FAPConstant.SPLITB) + ")";
		List<ReformNoticeInfoView> list = this.comFileInfoDAO.findByWhere(
				ReformNoticeInfoView.class.getName(), where, orderby, start, limit);
		return list;
	}

	/**
	 * 保存
	 * @param refFileInfo	整改通知单对象
	 * @return
	 */
	public String saveNewReformNotice(ReformNoticeInfo refInfo) {
		// 1.先插入到文件信息表，2.更新到大对象表，3.更新到attach_list表
		//用于保存前可以上传附件，uids已在页面上生成，若uids为空则手动生成
		String fileUids = refInfo.getReformUids();
		if (fileUids == null || fileUids.equals("")){
			fileUids = SnUtil.getNewID();
			refInfo.setReformUids(fileUids);
		}
		return comFileInfoDAO.insert(refInfo);
	}

	/**
	 * 批量删除整改通知单及文件
	 * @param filePk	整改通知单主键数组
	 * @return
	 */
	public boolean deleteReformNotices(String[] filePks) {
		// 1.删除文档附件及附件对应的大对象;2.删除文档大对象;3.删除文件本身
		for (int j=0; j<filePks.length; j++){
			try {
				List<SgccAttachList> attachList = sgccAttachListDAO.findWhere("transaction_type in ('"
							+ transType_attach + "','" + transType + "') and transaction_id = '" + filePks[j] + "' ");
				for (int i = 0; i < attachList.size(); i++) {
					String deleteSql = "delete from SGCC_ATTACH_BLOB where FILE_LSH='" + attachList.get(i).getFileLsh() + "'";
					JdbcUtil.execute(deleteSql);
				}
				sgccAttachListDAO.deleteAll(attachList);
				this.comFileInfoDAO.delete((ComFileInfo)this.comFileInfoDAO.findById(filePks[j]));
				List<ReformNoticeInfo> refs = this.comFileInfoDAO.findByProperty(
						ReformNoticeInfo.class.getName(), "comfileUids", filePks[j]);
				this.comFileInfoDAO.delete(refs.get(0));
			} catch (Exception e) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 获取整改通知单文件的附件数量
	 * @param fileUids 文件uids
	 * @return 附件数量
	 */
	public Integer getReformFileAttachCount(String fileUids){
		Integer attachCount = 0;
		String transTypeStr = "('ReformAttach')";
		String sql = "select count(*) cnt from sgcc_attach_list where TRANSACTION_TYPE in " +
		transTypeStr + " and TRANSACTION_ID = '" + fileUids  + "'";
		List<Map<String, Object>> resultList= JdbcUtil.query(sql);
		attachCount = Integer.valueOf(resultList.get(0).get("cnt").toString());
		return attachCount;
	}

	/**
	 * 上报、审批
	 * @param uids	RrformNoticInfo主键
	 * @param reportState 要改变的状态
	 * @return
	 */
	public boolean reportReformNotices(String[] uids, String reportState){
		for (int j=0; j<uids.length; j++){
			try{
				ReformNoticeInfo ref = new ReformNoticeInfo();
				ref = (ReformNoticeInfo) this.comFileInfoDAO.findById(ReformNoticeInfo.class.getName(), uids[j]);
				ref.setReportState(reportState);
				this.comFileInfoDAO.saveOrUpdate(ref);
			} catch (Exception e) {
				return false;
			}	
		}
		return true;
	}

	/**
	 * 获取所有已审批的通知单的发布信息
	 * @param dateSelected
	 * @param stateSelected
	 * @param userId
	 * @param deptId
	 * @param whereStr
	 * @param orderBy
	 * @return
	 */
	public List<ComFilePublishHistory> getReformNoticeListByPublish(
			String dateSelected, String stateSelected, String userId, String whereStr,
			String keyword, String orderBy, Integer start, Integer limit) {
		if (dateSelected.equals("all")) {
			whereStr += " and 1=1 ";
		} else if (dateSelected.equals("oneMonth")) {
			Date date = new Date();
			String year = String.valueOf(date.getYear() + 1900);
			String month = date.getMonth() < 10 ? "0"
					+ String.valueOf(date.getMonth()) : String.valueOf(date
					.getMonth());
			String day = date.getDay() < 10 ? "0"
					+ String.valueOf(date.getDay()) : String.valueOf(date
					.getDay());
			String dateStr = year + month + day;
			whereStr += " and to_char(publish_time,'yyyymmdd') > '" + dateStr
					+ "'";
		} else if (dateSelected.equals("threeMonth")) {
			Date date = new Date();
			String year = String.valueOf(date.getYear() + 1900);
			String month = date.getMonth() - 2 < 10 ? "0"
					+ String.valueOf(date.getMonth() - 2) : String.valueOf(date
					.getMonth() - 2);
			String day = date.getDay() < 10 ? "0"
					+ String.valueOf(date.getDay()) : String.valueOf(date
					.getDay());
			String dateStr = year + month + day;
			whereStr += " and to_char(publish_time,'yyyymmdd') > '" + dateStr
					+ "'";
		}
		if (stateSelected.equals("all")) {
			whereStr += " and 1=1 ";
		} else {
			List<ComFileReadHistory> readHistoryList = this.comFileReadHistoryDAO
					.findWhere("file_reader = '" + userId + "'");
			if (readHistoryList.size() > 0) {
				String fileIds = "";
				for (int i = 0; i < readHistoryList.size(); i++) {
					fileIds += "," + readHistoryList.get(i).getFileId();
				}
				fileIds = fileIds.substring(1);
				if (stateSelected.equals("unRead")) {
					whereStr += " and file_id not in " + this.transStrForSqlIn(fileIds, ",") + "";
				} else if (stateSelected.equals("read")) {
					whereStr += " and file_id in " + this.transStrForSqlIn(fileIds, ",") + "";
				}
			}
		}
		// 增加按标题关键字模糊查找
		if (keyword != null && !keyword.equals("")) {
			whereStr += " and file_id in ( select uids from ComFileInfo fileinfo where fileTile like '%"
					+ keyword + "%' or fileId like '%" + keyword + "%' )";
		}
		List<ComFilePublishHistory> phList = this.comFilePublishHistoryDAO
				.findByWhere(whereStr, orderBy, start, limit);
		return phList;
	}

	/**================== 短信发送service注入================================*/
	private SendMessageFacade sendMessage;
	
	public SendMessageFacade getSendMessage() {
		return sendMessage;
	}

	public void setSendMessage(SendMessageFacade sendMessage) {
		this.sendMessage = sendMessage;
	}

	/**
	 * 向部门发送短信
	 * @param userName	发送人
	 * @param userDept	发送人部门
	 * @param toDeptIds	发送到部门
	 * @param uids		短信内容对应数据的主键
	 * @return	true 成功，false 失败
	 * @author pengy 2013-08-19
	 */
	public String sendSmsToDept(String userName, String userDept, String toDeptIds, String uids) {
		try {
			InputStream is = this.getClass().getResourceAsStream(
					"/sendmessage_sgcc.properties");
			Properties props = new Properties();
			props.load(is);
			// 是否需要发送短信
			String isSendMessage = props.getProperty("IS_SENDMESSAGE");
			is.close();
			//是否开启短信
			if (isSendMessage.equals("true")) {
				ComFileInfo fileInfo = (ComFileInfo) this.comFileInfoDAO.findById(uids);
				if (fileInfo == null)
					return "false";
				ComFileSort fileSort = (ComFileSort) this.comFileSortDAO.findById(fileInfo.getFileSortId());
				if (fileSort == null)
					return "false";
				String fileSortName = fileSort.getSortName();
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
				String nowDate = df.format(new Date());
				// 查询提醒用户
				String[] deptIdArr = toDeptIds.split("[,]");
				for (int i = 0; i < deptIdArr.length; i++) {
					// 查询用户
					List<RockUser> users = this.comFileInfoDAO.findByProperty(RockUser.class.getName(), "deptId", deptIdArr[i]);
					if (users == null || users.size() == 0){
						continue;
					}
					for (int j=0; j<users.size(); j++){
						if (users.get(j).getMobile() == null || users.get(j).getMobile().equals("")){
							continue;
						}
						String content = users.get(j).getRealname() + ", 您有一条来自信息发布的消息。"
								+ " 文件分类: " + fileSortName + ", 发送人部门: " + userDept
								+ ", 发送人: " + userName + ", 标题: " + fileInfo.getFileTile()
								+ ", 内容简述: " + fileInfo.getFileContent() + ", 发送时间: " + nowDate;
						// 短信接收号码
						String mobile = users.get(j).getMobile();
//						System.out.println("-----"+content);
						this.sendMessage.sendASms(content, mobile);
					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
			return "false";
		}
		return "true";
	}

	/**
	 * 向用户发送短信
	 * @param userName	发送人ID
	 * @param userDept	发送人部门
	 * @param toUsers	发送到用户
	 * @param uids		短信内容对应数据的主键
	 * @return	true 成功，false 失败
	 * @author pengy 2013-08-19
	 */
	public String sendSmsToUser(String userName, String userDept, String toUsers, String uids) {
		try {
			InputStream is = this.getClass().getResourceAsStream(
					"/sendmessage_sgcc.properties");
			Properties props = new Properties();
			props.load(is);
			// 是否需要发送短信
			String isSendMessage = props.getProperty("IS_SENDMESSAGE");
			is.close();
			//是否开启短信
			if (isSendMessage.equals("true")) {
				ComFileInfo fileInfo = (ComFileInfo) this.comFileInfoDAO.findById(uids);
				if (fileInfo == null)
					return "false";
				ComFileSort fileSort = (ComFileSort) this.comFileSortDAO.findById(fileInfo.getFileSortId());
				if (fileSort == null)
					return "false";
				String fileSortName = fileSort.getSortName();
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
				String nowDate = df.format(new Date());
				// 查询提醒用户
				String[] userArr = toUsers.split("[,]");
				for (int i = 0; i < userArr.length; i++) {
					// 查询用户
					RockUser user = (RockUser) this.comFileInfoDAO.findById(RockUser.class.getName(), userArr[i]);
					if (user == null){
						continue;
					}
					if (user.getMobile() == null || user.getMobile().equals("")){
						continue;
					}
					String content = user.getRealname() + ", 您有一条来自信息发布的消息。"
							+ " 文件分类: " + fileSortName + ", 发送人部门: " + userDept
							+ ", 发送人: " + userName + ", 标题: " + fileInfo.getFileTile()
							+ ", 内容简述: " + fileInfo.getFileContent() + ", 发送时间: " + nowDate;
					// 短信接收号码
					String mobile = user.getMobile();
//					System.out.println("-----"+content);
					this.sendMessage.sendASms(content, mobile);
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
			return "false";
		}
		return "true";
	}
}
