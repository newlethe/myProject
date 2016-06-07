package com.sgepit.pcmis.bid.service;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import oracle.sql.BLOB;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.SQLQuery;
import org.hibernate.Session;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.dataexchange.PCDataExchangeException;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.dao.SystemDao;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pcmis.bid.dao.PCBidDAO;
import com.sgepit.pcmis.bid.hbm.PcBidAcceptTbdocAndBond;
import com.sgepit.pcmis.bid.hbm.PcBidAssessCouncil;
import com.sgepit.pcmis.bid.hbm.PcBidClarificateTbdoc;
import com.sgepit.pcmis.bid.hbm.PcBidClarificateZbdoc;
import com.sgepit.pcmis.bid.hbm.PcBidIssueWinDoc;
import com.sgepit.pcmis.bid.hbm.PcBidJudgeBidding;
import com.sgepit.pcmis.bid.hbm.PcBidNoticeContent;
import com.sgepit.pcmis.bid.hbm.PcBidOpenBidding;
import com.sgepit.pcmis.bid.hbm.PcBidOverallDTO;
import com.sgepit.pcmis.bid.hbm.PcBidProgress;
import com.sgepit.pcmis.bid.hbm.PcBidPublishNotice;
import com.sgepit.pcmis.bid.hbm.PcBidSendZbdoc;
import com.sgepit.pcmis.bid.hbm.PcBidSupervisereportD;
import com.sgepit.pcmis.bid.hbm.PcBidSupervisereportM;
import com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo;
import com.sgepit.pcmis.bid.hbm.PcBidZbAgency;
import com.sgepit.pcmis.bid.hbm.PcBidZbApply;
import com.sgepit.pcmis.bid.hbm.PcBidZbApplyTreeView;
import com.sgepit.pcmis.bid.hbm.PcBidZbContent;
import com.sgepit.pcmis.bid.hbm.VPcBidSupervisereportM;
import com.sgepit.pcmis.bid.hbm.VPcJiaJieReportIndex;
import com.sgepit.pcmis.common.hbm.PcBusniessBack;
import com.sgepit.pcmis.common.util.MultistageReportUtil;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pcmis.jdgk.hbm.VPcJdgkReport;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglDyreport1M;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglDyreport2M;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglDyreport3M;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglMonthCompM;
import com.sgepit.pcmis.tzgl.hbm.VPcTzglYearPlanM;
import com.sgepit.pmis.document.hbm.ZlInfoBlobList;
import com.sgepit.pmis.document.hbm.ZlTree;



public class PCBidServiceImpl<UUIDGenerator> implements PCBidService {
	private static final Log log = LogFactory.getLog(PCBidServiceImpl.class);
	private PCBidDAO pcBidDAO;
	private SystemDao systemDao;
	private Map<String,PropertyCode> propsMap = new HashMap<String,PropertyCode>();
	public PCBidDAO getPcBidDAO() {
		return pcBidDAO;
	}

	public void setPcBidDAO(PCBidDAO pcBidDAO) {
		this.pcBidDAO = pcBidDAO;
	}
	public SystemDao getSystemDao() {
		return systemDao;
	}

	public void setSystemDao(SystemDao systemDao) {
		this.systemDao = systemDao;
	}
	public boolean deleteZbApplyById(String zbApplyId) {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean deleteZbContentById(String zbContentId) {
		// TODO Auto-generated method stub
		return false;
	}

	public List getZtbStatisticsByWhereOrderBy(String orderBy, Integer start,
			Integer limit, HashMap<String, String> params) {
		List returnList = new ArrayList();
		String pid = (String) params.get("pid");
		String proName = (String) params.get("proName");
		SystemMgmFacade systemMgm = (SystemMgmFacade) Constant.wact
				.getBean("systemMgm");
		List listSgcc = systemMgm.getPidsByUnitid(pid);
		String pidInStr = "";
		if (pid != null && !pid.equals("") && listSgcc.size() == 0) {
			return returnList;
		}
		for (int i = 0; i < listSgcc.size(); i++) {
			SgccIniUnit siu = (SgccIniUnit) listSgcc.get(i);
			pidInStr += "'" + siu.getUnitid() + "'";
			if (i < listSgcc.size() - 1) {
				pidInStr += ",";
			}
		}

		String sql = "select rownum r, t1.*, "
				+ "(select count(uids) from pc_bid_zb_content t2 where t2.pid = t1.pid) zb_app_count, "
				+ "(select count(uids) from pc_bid_zb_content t3 where t3.pid = t1.pid and "
				+ "nvl((select rate_status from pc_bid_progress p where p.content_uids = t3.uids and p.progress_type = 'TbUnitInfo'), 0) > 0) zb_app_start_count, "
				+ "(select count(uids) from pc_bid_zb_content t4 where t4.pid = t1.pid and "
				+ " t4.uids in (select w2.content_uids from pc_bid_issue_win_doc w2 where w2.content_uids = t4.uids and w2.rate_status=100)) zb_app_end_count, "
				+ "(select sum(t10.bdg_money) from pc_bid_zb_content t10 where t10.pid=t1.pid) as bdg_money, "
				//+ "(select count(conid) from con_ove t5 where t5.bidtype in ( select uids from pc_bid_zb_content t7 where t7.pid = t1.pid )) zb_con_count, "
				+ "(select count(conid) from con_ove t5 where t5.pid = t1.pid and "
				+ " t5.bidtype in (select w2.content_uids from pc_bid_issue_win_doc w2 where w2.content_uids = t5.bidtype and w2.rate_status=100)) zb_con_count, "
				//+ "(select sum(conmoney) from con_ove t8 where t8.bidtype in ( select uids from pc_bid_zb_content t9 where t9.pid = t1.pid)) contract_sum_amount, "
				+ "(select sum(convaluemoney) from v_con t8 where t8.pid = t1.pid and t8.bidtype IS NOT NULL) contract_sum_amount, "
				+ "(select sum (tb_price) from pc_bid_issue_win_doc t9 where t9.pid = t1.pid) zb_app_tb_price, "
				+ "(select sum(apply_amount) from pc_bid_zb_content t6 where t6.pid = t1.pid) zb_app_sum_amount "
				+ "from pc_zhxx_prj_info t1 where 1 = 1";
		log.info("招投标首页数据："+sql);
		if (pidInStr != null && !"".equals(pidInStr)) {
			sql += " and t1.pid in ( " + pidInStr + ")";
		} else {
			return returnList;
		}

		if (proName != null && (!proName.equals(""))) {
			sql += " and prj_name like '%" + proName + "%'";
		}

		if (orderBy != null && !orderBy.trim().equals("")) {
			sql += " order by " + orderBy;
		}
		if (start == null || limit == null) {

			List<Map<String, Object>> resultList = JdbcUtil.query(sql);
			for (Map<String, Object> map : resultList) {
				PcBidOverallDTO overallDTO = new PcBidOverallDTO();
				overallDTO.setPid(map.get("pid").toString());
				overallDTO.setZbAppCount(map.get("zb_app_count") == null ? 0
						: Integer.valueOf(map.get("zb_app_count").toString()));
				overallDTO
						.setZbAppStartCount(map.get("zb_app_start_count") == null ? 0
								: Integer.valueOf(map.get("zb_app_start_count")
										.toString()));
				overallDTO
						.setZbAppEndCount(map.get("zb_app_end_count") == null ? 0
								: Integer.valueOf(map.get("zb_app_end_count")
										.toString()));
				overallDTO.setZbConCount(map.get("zb_con_count") == null ? 0
						: Integer.valueOf(map.get("zb_con_count").toString()));
				overallDTO
						.setZbAppSumAmount(map.get("zb_app_sum_amount") == null ? 0.0
								: Double.valueOf(map.get("zb_app_sum_amount")
										.toString()));
				overallDTO
						.setContractSumAmount(map.get("contract_sum_amount") == null ? 0.0
								: Double.valueOf(map.get("contract_sum_amount")
										.toString()));
				overallDTO
				.setZbAppTbPrice(map.get("zb_app_tb_price") == null ? 0.0
						: Double.valueOf(map.get("zb_app_tb_price")
								.toString()));
				overallDTO.setBdgMoney(map.get("bdg_money")== null ? 0.0
						: Double.valueOf(map.get("bdg_money")
								.toString()));
				returnList.add(overallDTO);
			}

		} else {
			Integer lastRowNum = start + limit;
			String countSql = "select count(*) as num from (" + sql
					+ " ) temp ";
			String pageSql = " select * from (" + sql + " ) temp where temp.r>"
					+ start + " and temp.r<=" + lastRowNum;
			List<Map<String, Object>> countList = JdbcUtil.query(countSql);
			Integer count = Integer.valueOf(countList.get(0).get("num")
					.toString());
			List<Map<String, Object>> resultList = JdbcUtil.query(pageSql);
			for (Map<String, Object> map : resultList) {
				PcBidOverallDTO overallDTO = new PcBidOverallDTO();
				overallDTO.setPid(map.get("pid").toString());
				overallDTO.setZbAppCount(map.get("zb_app_count") == null ? 0
						: Integer.valueOf(map.get("zb_app_count").toString()));
				overallDTO
						.setZbAppStartCount(map.get("zb_app_start_count") == null ? 0
								: Integer.valueOf(map.get("zb_app_start_count")
										.toString()));
				overallDTO
						.setZbAppEndCount(map.get("zb_app_end_count") == null ? 0
								: Integer.valueOf(map.get("zb_app_end_count")
										.toString()));
				overallDTO.setZbConCount(map.get("zb_con_count") == null ? 0
						: Integer.valueOf(map.get("zb_con_count").toString()));
				overallDTO
						.setZbAppSumAmount(map.get("zb_app_sum_amount") == null ? 0.0
								: Double.valueOf(map.get("zb_app_sum_amount")
										.toString()));
				overallDTO
						.setContractSumAmount(map.get("contract_sum_amount") == null ? 0.0
								: Double.valueOf(map.get("contract_sum_amount")
										.toString()));
				overallDTO
				.setZbAppTbPrice(map.get("zb_app_tb_price") == null ? 0.0
						: Double.valueOf(map.get("zb_app_tb_price")
								.toString()));
				overallDTO.setBdgMoney(map.get("bdg_money")== null ? 0.0
						: Double.valueOf(map.get("bdg_money")
								.toString()));
				returnList.add(overallDTO);
			}
			returnList.add(count);

		}

		return returnList;
	}

	public boolean publishZbNoticeById(String zbNoticeId) {
		// TODO Auto-generated method stub
		return false;
	}
	
	public boolean clearZbApplyAttachment(String[] uidArr){
		String uidInStr = "";
		try {
			for (int i = 0; i < uidArr.length; i++) {
				String applyUids = uidArr[i];
				uidInStr += String.format("'%s'", applyUids);
				if (i < uidArr.length - 1) {
					uidInStr += ",";
				}
			}
			List<SgccAttachList> attachList = new ArrayList<SgccAttachList>();
			//招标代理机构
			List<SgccAttachList> agencyList = pcBidDAO
			.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type in ('PCBidAgency', 'PCBidAgencyOther', 'PCBidAgencyContract') and transaction_id in ( select uids from PcBidZbAgency t1 where t1.zbUids in ("
							+ uidInStr + "))");
			attachList.addAll(agencyList);
			//发布招标公告
			List<SgccAttachList> noticeList = pcBidDAO
			.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type in ('PCBidNotice', 'PCBidNoticeOther') and transaction_id in ( select uids from PcBidPublishNotice t1 where t1.zbUids in ("
							+ uidInStr + "))");
			attachList.addAll(noticeList);
			for (int i = 0; i < attachList.size(); i++) {
				String deleteSql = "delete from SGCC_ATTACH_BLOB where FILE_LSH='"
						+ attachList.get(i).getFileLsh() + "'";
				JdbcUtil.execute(deleteSql);
			}
			pcBidDAO.deleteAll(attachList);
			
			String contentSql = "select uids from pc_bid_zb_content where zb_uids in (" + uidInStr + ")";
			List<Map<String, Object>> uidList = JdbcUtil.query(contentSql);
			if ( uidList.size() > 0 ){
				String[] contentUidArr = new String[uidList.size()];
				for ( int j = 0; j < uidList.size(); j++ ){
					contentUidArr[j] = uidList.get(j).get("UIDS").toString();
				}
				clearZbDetailAttachment(contentUidArr);
			}
			
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
		
	}
	
	public boolean clearZbDetailAttachment(String[] uidArr) {
		String uidInStr = "";
		for (int i = 0; i < uidArr.length; i++) {
			String contentUids = uidArr[i];
			uidInStr += String.format("'%s'", contentUids);
			if (i < uidArr.length - 1) {
				uidInStr += ",";
			}
		}
		try {
			List<SgccAttachList> attachList = new ArrayList<SgccAttachList>();
			// 阶段进度信息
			List<SgccAttachList> progressList = pcBidDAO
					.findByWhere(
							SgccAttachList.class.getName(),
							"transaction_type in ('PCBidProgress') and transaction_id in ( select uids from PcBidProgress t1 where t1.contentUids in ("
									+ uidInStr + "))");
			attachList.addAll(progressList);
			// 报名信息及预审结果
			List<SgccAttachList> tbUnitList = pcBidDAO
					.findByWhere(
							SgccAttachList.class.getName(),
							"transaction_type in ('PCBidPreVeryfy') and transaction_id in ( select uids from PcBidTbUnitInfo t1 where t1.contentUids in ("
									+ uidInStr + "))");
			attachList.addAll(tbUnitList);
			
			//招标文件澄清
			List<SgccAttachList> zbClaList = pcBidDAO
			.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type in ('PCBidZbNeedCla', 'PCBidZbCla') and transaction_id in ( select uids from PcBidClarificateZbdoc t1 where t1.contentUids in ("
							+ uidInStr + "))");
			attachList.addAll(zbClaList);
			//组建评标委员会
			List<SgccAttachList> assessCouncilList = pcBidDAO
			.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type in ('PCBidCouncilResume') and transaction_id in ( select uids from PcBidAssessCouncil t1 where t1.contentUids in ("
							+ uidInStr + "))");
			attachList.addAll(assessCouncilList);
			//接受投标文件及保证金
			List<SgccAttachList> acceptList = pcBidDAO
			.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type in ('PCBidFile', 'PCBidZbOther') and transaction_id in ( select uids from PcBidAcceptTbdocAndBond t1 where t1.contentUids in ("
							+ uidInStr + "))");
			attachList.addAll(acceptList);
			//开标
			List<SgccAttachList> openList = pcBidDAO
			.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type in ('PCBidOpenBidOther') and transaction_id in ( select uids from PcBidOpenBidding t1 where t1.contentUids in ("
							+ uidInStr + "))");
			attachList.addAll(openList);
			//评标
			List<SgccAttachList> assessList = pcBidDAO
			.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type in ('PCBidFile', 'PCBidClarifyContent', 'PCBidAssessReport', 'PCBidAssessOther') and transaction_id in ( select uids from PcBidJudgeBidding t1 where t1.contentUids in ("
							+ uidInStr + "))");
			attachList.addAll(assessList);
			//评标结果公示
			List<SgccAttachList> assessPublishList = pcBidDAO
			.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type in ('PCBidAssessPublishOther') and transaction_id in ( select uids from PcBidAssessPublish t1 where t1.contentUids in ("
							+ uidInStr + "))");
			attachList.addAll(assessPublishList);
			//发放中标通知书
			List<SgccAttachList> winList = pcBidDAO
			.findByWhere(
					SgccAttachList.class.getName(),
					"transaction_type in ('PCBidIssueWinNotice', 'PCBidIssueWinOther') and transaction_id = ( select uids from PcBidIssueWinDoc t1 where t1.contentUids in ("
							+ uidInStr + "))");
			attachList.addAll(winList);
			for (int i = 0; i < attachList.size(); i++) {
				String deleteSql = "delete from SGCC_ATTACH_BLOB where FILE_LSH='"
						+ attachList.get(i).getFileLsh() + "'";
				JdbcUtil.execute(deleteSql);
			}
			pcBidDAO.deleteAll(attachList);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}

	}

	public boolean deleteZbAttachment(String[] businessTypes, String id) {

		String businessTypeStr = "";
		for (int i = 0; i < businessTypes.length; i++) {
			String businessType = businessTypes[i];
			businessTypeStr += String.format("'%s'", businessType);
			if (i < businessTypes.length - 1) {
				businessTypeStr += ",";
			}
		}

		try {
			List<SgccAttachList> attachList = pcBidDAO.findByWhere(
					SgccAttachList.class.getName(), "transaction_type in ("
							+ businessTypeStr + ") and transaction_id = '" + id
							+ "' ");
			for (int i = 0; i < attachList.size(); i++) {
				String deleteSql = "delete from SGCC_ATTACH_BLOB where FILE_LSH='"
						+ attachList.get(i).getFileLsh() + "'";
				JdbcUtil.execute(deleteSql);
			}
			pcBidDAO.deleteAll(attachList);
			return true;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}

	}

	public void exchangeDeletedZbData(String beanType, String[] ids,
			boolean immediate) {
		// 上报PID
		String pid = Constant.DefaultOrgRootID;
		List dataList = new ArrayList();
		String sqlIn = transStrForSqlIn(ids);
		String blobDeleteSql = "DELETE FROM SGCC_ATTACH_BLOB WHERE FILE_LSH IN (%s)";
		String attachListDeleteSql = "DELETE FROM SGCC_ATTACH_LIST ";
		String bizInfo = "招投标模块数据交互-删除";
		if (beanType.equalsIgnoreCase(PcBidZbApply.class.getName())) { // 招标申请
			for (String uids : ids) {
				PcBidZbApply apply = new PcBidZbApply();
				apply.setUids(uids);
				dataList.add(apply);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type = 'PCBidApplyReport' and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "招标申请信息删除";
		} else if (beanType.equalsIgnoreCase(PcBidZbContent.class.getName())) { // 招标内容
			for (String uids : ids) {
				PcBidZbContent content = new PcBidZbContent();
				content.setUids(uids);
				dataList.add(content);
			}
			//需要删除详细过程及所有的附件信息（数据量比较大，暂时不做）
			attachListDeleteSql ="";//招标内容没有附件
			blobDeleteSql = "";
			bizInfo = "招标内容信息删除";
		} else if (beanType.equalsIgnoreCase(PcBidZbAgency.class.getName())) { // 代理机构
			for (String uids : ids) {
				PcBidZbAgency agency = new PcBidZbAgency();
				agency.setUids(uids);
				dataList.add(agency);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type in ('PCBidAgency', 'PCBidAgencyContract', 'PCBidAgencyOther') and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "招标代理机构信息删除";
		} else if (beanType
				.equalsIgnoreCase(PcBidPublishNotice.class.getName())) { // 招标公告
			for (String uids : ids) {
				PcBidPublishNotice notice = new PcBidPublishNotice();
				notice.setUids(uids);
				dataList.add(notice);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type in ('PCBidNotice', 'PCBidNoticeOther') and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "招标公告信息删除";
		} else if (beanType.equalsIgnoreCase(PcBidTbUnitInfo.class.getName())) { // 招标人报名信息及预审结果
			for (String uids : ids) {
				PcBidTbUnitInfo unitInfo = new PcBidTbUnitInfo();
				unitInfo.setUids(uids);
				dataList.add(unitInfo);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type in ('PCBidPreVeryfy', 'PCBidApplicantOther') and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "招标人报名信息及预审结果信息删除";
		} else if (beanType.equalsIgnoreCase(PcBidSendZbdoc.class.getName())) { // 发售招标文件
			for (String uids : ids) {
				PcBidSendZbdoc sendZbdoc = new PcBidSendZbdoc();
				sendZbdoc.setUids(uids);
				dataList.add(sendZbdoc);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type in ('PCBidBook', 'PCBidZbdocther') and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "发售招标文件信息删除";
		} else if (beanType.equalsIgnoreCase(PcBidClarificateZbdoc.class
				.getName())) { // 招标文件澄清
			for (String uids : ids) {
				PcBidClarificateZbdoc clarificateZbdoc = new PcBidClarificateZbdoc();
				clarificateZbdoc.setUids(uids);
				dataList.add(clarificateZbdoc);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type in ('PCBidZbNeedCla', 'PCBidZbCla', 'PCBidZbOther') and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "招标文件澄清信息删除";
		} else if (beanType
				.equalsIgnoreCase(PcBidAssessCouncil.class.getName())) { // 组建评标委员会
			for (String uids : ids) {
				PcBidAssessCouncil assessCouncil = new PcBidAssessCouncil();
				assessCouncil.setUids(uids);
				dataList.add(assessCouncil);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type in ('PCBidCouncilResume', 'PCBidCouncilOther') and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "组建评标委员会信息删除";
		} else if (beanType.equalsIgnoreCase(PcBidAcceptTbdocAndBond.class
				.getName())) { // 接受招标文件及投标保证金
			for (String uids : ids) {
				PcBidAcceptTbdocAndBond andBond = new PcBidAcceptTbdocAndBond();
				andBond.setUids(uids);
				dataList.add(andBond);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type in ('PCBidFile', 'PCBidAcceptTbdocOther') and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "接受招标文件及投标保证金信息删除";
		} else if (beanType.equalsIgnoreCase(PcBidOpenBidding.class.getName())) { // 开标
			for (String uids : ids) {
				PcBidOpenBidding openBidding = new PcBidOpenBidding();
				openBidding.setUids(uids);
				dataList.add(openBidding);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type = 'PCBidOpenBidOther' and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "开标信息删除";
		} else if (beanType.equalsIgnoreCase(PcBidClarificateTbdoc.class
				.getName())) { // 投标文件澄清
			for (String uids : ids) {
				PcBidClarificateTbdoc clarificateTbdoc = new PcBidClarificateTbdoc();
				clarificateTbdoc.setUids(uids);
				dataList.add(clarificateTbdoc);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type in ('PCBidTbNeedCla', 'PCBidTbCla', 'PCBidTbOther') and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "投标文件澄清信息删除";
		} else if (beanType.equalsIgnoreCase(PcBidIssueWinDoc.class.getName())) { // 发送中标通知书
			for (String uids : ids) {
				PcBidIssueWinDoc issueWinDoc = new PcBidIssueWinDoc();
				issueWinDoc.setUids(uids);
				dataList.add(issueWinDoc);
			}
			// 删除AttachList和AttachBlob的前置SQL
			String attachWhere = "where transaction_type in ('PCBidIssueWinNotice', 'PCBidIssueWinOther') and transaction_id in "
					+ sqlIn;
			attachListDeleteSql += attachWhere;
			String attachIdStr = " select file_lsh from sgcc_attach_list "
					+ attachWhere;
			blobDeleteSql = String.format(blobDeleteSql, attachIdStr);
			bizInfo = "发送中标通知书信息删除";
		}
		String sqlBefore = attachListDeleteSql + (blobDeleteSql.equals("")?"":(";" + blobDeleteSql));
		PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		List<PcDataExchange> exchangeList = dataExchangeService
				.getExchangeDataList(dataList, pid, sqlBefore, null, bizInfo);
		if (immediate) {
			// 立即发送
			dataExchangeService.sendExchangeData(exchangeList);
		} else {
			// 加入队列定时发送
			dataExchangeService.addExchangeListToQueue(exchangeList);
		}
	}

	/**
	 * 交换数据：将制定的数据发送到集团公司
	 * 
	 * @param beanType
	 *            实体类型字符串
	 * @param ids
	 *            对象主键值得数组
	 * @param immediate
	 *            是否立即发送
	 */
	public void exchangeSavedZbData(String beanType, String[] ids,
			boolean immediate) {
		// 上报PID
		String pid = Constant.DefaultOrgRootID;
		List dataList = new ArrayList();
		String sqlIn = transStrForSqlIn(ids);
		// 附件列表
		List<SgccAttachList> attachList = new ArrayList<SgccAttachList>();
		String bizInfo = "招投标模块数据交互-保存";
		if (beanType.equalsIgnoreCase(PcBidZbApply.class.getName())) { // 招标申请
			for (String uids : ids) {
				PcBidZbApply apply = new PcBidZbApply();
				apply.setUids(uids);
				dataList.add(apply);
			}
			// 找出所有AttachList
			attachList = pcBidDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_type = 'PCBidApplyReport' and transaction_id in "
							+ sqlIn);
			dataList.addAll(attachList);
			bizInfo = "招标申请-编辑";
		} else if (beanType.equalsIgnoreCase(PcBidZbContent.class.getName())) { // 招标内容
			for (String uids : ids) {
				PcBidZbContent content = new PcBidZbContent();
				content.setUids(uids);
				dataList.add(content);
			}
			bizInfo = "招标内容-编辑";
		} else if (beanType.equalsIgnoreCase(PcBidZbAgency.class.getName())) { // 代理机构
			for (String uids : ids) {
				PcBidZbAgency agency = new PcBidZbAgency();
				agency.setUids(uids);
				dataList.add(agency);
			}
			// 找出所有AttachList
			attachList = pcBidDAO
					.findByWhere(
							SgccAttachList.class.getName(),
							"transaction_type in ('PCBidAgency', 'PCBidAgencyContract', 'PCBidAgencyOther')"
									+ " and transaction_id in " + sqlIn);
			dataList.addAll(attachList);
			bizInfo = "代理机构-编辑";
		} else if (beanType
				.equalsIgnoreCase(PcBidPublishNotice.class.getName())) { // 招标公告
			for (String uids : ids) {
				PcBidPublishNotice notice = new PcBidPublishNotice();
				notice.setUids(uids);
				dataList.add(notice);
			}
			// 找出所有AttachList
			attachList = pcBidDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_type in ('PCBidNotice', 'PCBidNoticeOther')"
							+ " and transaction_id in " + sqlIn);
			dataList.addAll(attachList);
			bizInfo = "招标公告-编辑";
		} else if (beanType.equalsIgnoreCase(PcBidTbUnitInfo.class.getName())) { // 招标人报名信息及预审结果
			for (String uids : ids) {
				PcBidTbUnitInfo unitInfo = new PcBidTbUnitInfo();
				unitInfo.setUids(uids);
				dataList.add(unitInfo);
			}
			// 找出所有AttachList
			attachList = pcBidDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_type in ('PCBidPreVeryfy', 'PCBidApplicantOther')"
							+ " and transaction_id in " + sqlIn);
			dataList.addAll(attachList);
			bizInfo = "招标人报名信息及预审结果-编辑";
		} else if (beanType.equalsIgnoreCase(PcBidSendZbdoc.class.getName())) { // 发售招标文件
			for (String uids : ids) {
				PcBidSendZbdoc sendZbdoc = new PcBidSendZbdoc();
				sendZbdoc.setUids(uids);
				dataList.add(sendZbdoc);
			}
			// 找出所有AttachList
			attachList = pcBidDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_type in ('PCBidBook', 'PCBidZbdocther')"
							+ " and transaction_id in " + sqlIn);
			dataList.addAll(attachList);
			bizInfo = "发售招标文件-编辑";
		} else if (beanType.equalsIgnoreCase(PcBidClarificateZbdoc.class
				.getName())) { // 招标文件澄清
			for (String uids : ids) {
				PcBidClarificateZbdoc clarificateZbdoc = new PcBidClarificateZbdoc();
				clarificateZbdoc.setUids(uids);
				dataList.add(clarificateZbdoc);
			}
			// 找出所有AttachList
			attachList = pcBidDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_type in ('PCBidZbNeedCla', 'PCBidZbCla', 'PCBidZbOther')"
							+ " and transaction_id in " + sqlIn);
			dataList.addAll(attachList);
			bizInfo = "招标文件澄清-编辑";
		} else if (beanType
				.equalsIgnoreCase(PcBidAssessCouncil.class.getName())) { // 组建评标委员会
			for (String uids : ids) {
				PcBidAssessCouncil assessCouncil = new PcBidAssessCouncil();
				assessCouncil.setUids(uids);
				dataList.add(assessCouncil);
			}
			// 找出所有AttachList
			attachList = pcBidDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_type in ('PCBidCouncilResume', 'PCBidCouncilOther')"
							+ " and transaction_id in " + sqlIn);
			dataList.addAll(attachList);
			bizInfo = "组建评标委员会-编辑";
		} else if (beanType.equalsIgnoreCase(PcBidAcceptTbdocAndBond.class
				.getName())) { // 接受招标文件及投标保证金
			for (String uids : ids) {
				PcBidAcceptTbdocAndBond andBond = new PcBidAcceptTbdocAndBond();
				andBond.setUids(uids);
				dataList.add(andBond);
			}
			// 找出所有AttachList
			attachList = pcBidDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_type in ('PCBidFile', 'PCBidAcceptTbdocOther')"
							+ " and transaction_id in " + sqlIn);
			dataList.addAll(attachList);
			bizInfo = "接受招标文件及投标保证金-编辑";
		} else if (beanType.equalsIgnoreCase(PcBidOpenBidding.class.getName())) { // 开标
			for (String uids : ids) {
				PcBidOpenBidding openBidding = new PcBidOpenBidding();
				openBidding.setUids(uids);
				dataList.add(openBidding);
			}
			// 找出所有AttachList
			attachList = pcBidDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_type in ('PCBidOpenBidOther')"
							+ " and transaction_id in " + sqlIn);
			dataList.addAll(attachList);
			bizInfo = "开标-编辑";
		} else if (beanType.equalsIgnoreCase(PcBidClarificateTbdoc.class
				.getName())) { // 投标文件澄清
			for (String uids : ids) {
				PcBidClarificateTbdoc clarificateTbdoc = new PcBidClarificateTbdoc();
				clarificateTbdoc.setUids(uids);
				dataList.add(clarificateTbdoc);
			}
			// 找出所有AttachList
			attachList = pcBidDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_type in ('PCBidTbNeedCla', 'PCBidTbCla', 'PCBidTbOther')"
							+ " and transaction_id in " + sqlIn);
			dataList.addAll(attachList);
			bizInfo = "投标文件澄清-编辑";
		} else if (beanType.equalsIgnoreCase(PcBidIssueWinDoc.class.getName())) { // 发送中标通知书
			for (String uids : ids) {
				PcBidIssueWinDoc issueWinDoc = new PcBidIssueWinDoc();
				issueWinDoc.setUids(uids);
				dataList.add(issueWinDoc);
			}
			// 找出所有AttachList
			attachList = pcBidDAO.findByWhere(SgccAttachList.class.getName(),
					"transaction_type in ('PCBidIssueWinNotice', 'PCBidIssueWinOther')"
							+ " and transaction_id in " + sqlIn);
			dataList.addAll(attachList);
			bizInfo = "发送中标通知书-编辑";
		}

		// 获取service实例
		PCDataExchangeService dataExchangeService = (PCDataExchangeService) Constant.wact
				.getBean("PCDataExchangeService");
		List<PcDataExchange> exchangeList = dataExchangeService
				.getExchangeDataList(dataList, pid, bizInfo);
		PcDataExchange tempExc = exchangeList.get(exchangeList.size() - 1);
		Long curXh = tempExc.getXh() + 1;
		String curTxGroup = tempExc.getTxGroup();
		// 手动生成所有attachBlob的dataExchange记录
		for (int i = 0; i < attachList.size(); i++) {
			SgccAttachList attach = attachList.get(i);
			PcDataExchange exchange = new PcDataExchange();
			exchange.setTableName("SGCC_ATTACH_BLOB");
			exchange.setBlobCol("FILE_NR");
			JSONArray kvarr = new JSONArray();
			JSONObject kv = new JSONObject();
			kv.put("FILE_LSH", attach.getFileLsh());
			kvarr.add(kv);
			exchange.setKeyValue(kvarr.toString());
			exchange.setSuccessFlag("0");

			exchange.setXh(curXh + i);
			exchange.setPid(pid);
			exchange.setTxGroup(curTxGroup);
			exchange.setBizInfo("招投标附件信息");
			exchangeList.add(exchange);
		}

		if (immediate) {
			// 立即发送
			dataExchangeService.sendExchangeData(exchangeList);
		} else {
			// 加入队列定时发送
			dataExchangeService.addExchangeListToQueue(exchangeList);
		}
	}

	private String transStrForSqlIn(String[] oriStrArr) {
		String rtnStr = "(";
		for (int i = 0; i < oriStrArr.length; i++) {
			rtnStr += "'" + oriStrArr[i] + "',";
		}
		return rtnStr.substring(0, rtnStr.length() - 1) + ")";
	}

	public PcBidProgress getCurrentPhaseProgress(String contentUids,
			String progressType) {
		PcBidProgress progress = null;

		List list = pcBidDAO.findByWhere(PcBidProgress.class.getName(),
				"content_uids = '" + contentUids + "' and progressType = '"
						+ progressType + "'");
		if (list.size() > 0) {
			progress = (PcBidProgress) list.get(0);
		}else{
			//如果没有，则实例化
			PcBidZbContent zbContent =(PcBidZbContent) pcBidDAO.findById(PcBidZbContent.class.getName(), contentUids);
			progress = new PcBidProgress();
			progress.setContentUids(contentUids);
			progress.setPid(zbContent.getPid());
			progress.setProgressType(progressType);
			progress.setRespondDept(zbContent.getRespondDept());
			progress.setRespondUser(zbContent.getRespondUser());
			progress.setPbWays(""); //初始化评标方法属性编号为"";
			pcBidDAO.insert(progress);
			//判断是否需要数据交互
			String deployType = Constant.propsMap.get("DEPLOY_UNITTYPE")==null?"0":Constant.propsMap.get("DEPLOY_UNITTYPE");
			if(deployType.equals("A")){
				// 获取service实例
//				PcDynamicData dyda=new PcDynamicData();
//				dyda.setPid(progress.getPid());
//				dyda.setPctablebean(PcBidProgress.class.getName());
//				dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcBidProgress.class.getName()));
//				dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
//				dyda.setPctableuids(progress.getUids());
//				dyda.setPcdynamicdate(new Date());
//				dyda.setPcurl(DynamicDataUtil.BID_SCHEDULE_URL);
//				
//				Session session =pcBidDAO.getSessionFactory().openSession();
//				session.beginTransaction();
//				session.save(dyda);
//				session.getTransaction().commit();
//				session.close();
				
				PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				PcDataExchange excHbm = excService.getExcData(progress, Constant.DefaultOrgRootID, zbContent.getPid(), 
						null, null, "招标阶段信息编辑【"+zbContent.getPid()+"】");
//				PcDataExchange dydaHbm = excService.getExcData(dyda, Constant.DefaultOrgRootID, zbContent.getPid(), 
//						null, null, "招标阶段信息编辑【"+zbContent.getPid()+"】");
//				dydaHbm.setTxGroup(excHbm.getTxGroup());
				
				List<PcDataExchange> excList = new ArrayList<PcDataExchange>();
				excList.add(excHbm);
//				excList.add(dydaHbm);
				excService.addExchangeListToQueue(excList);
			}
		}

		return progress;
	}

	/**
	 *说明: 在保存招标过程信息对象之前, 判断该招标过程信息对象是否要写入动态数据表(新增的,或者进度字段修改了的招标过程信息要写入动态数据表)
	 * @param progress 招标过程对象
	 * @throws BusinessException
	 */
	public void saveBidProgress(PcBidProgress progress)
			throws BusinessException {
		PcBidProgress prs = (PcBidProgress)pcBidDAO.findById(PcBidProgress.class.getName(), progress.getUids());
		if(prs !=null){
			Double newRateStatus=progress.getRateStatus();
			Double oldRateStatus=prs.getRateStatus();
			boolean flag=true;
			if(oldRateStatus==null&&newRateStatus==null){
				flag=false;
			}else if(oldRateStatus!=null&&newRateStatus!=null){
				if(oldRateStatus.compareTo(newRateStatus)==0) flag=false;
			}
			if(flag){
				PcDynamicData dyda=new PcDynamicData();
				dyda.setPid(progress.getPid());
				dyda.setPctablebean(PcBidProgress.class.getName());
				dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcBidProgress.class.getName()));
				dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
				dyda.setPctableuids(progress.getUids());
				dyda.setPcdynamicdate(new Date());
				dyda.setPcurl(DynamicDataUtil.BID_SCHEDULE_URL);
				
				Session session =pcBidDAO.getSessionFactory().openSession();
				session.beginTransaction();
				session.save(dyda);
				session.getTransaction().commit();
				session.close();
			}
			prs.setUids(progress.getUids());
			prs.setPid(progress.getPid());
			prs.setContentUids(progress.getContentUids());
			prs.setProgressType(progress.getProgressType());
			prs.setStartDate(progress.getStartDate());
			prs.setEndDate(progress.getEndDate());
			prs.setRateStatus(progress.getRateStatus());
			prs.setRespondDept(progress.getRespondDept());
			prs.setRespondUser(progress.getRespondUser());
			prs.setMemo(progress.getMemo());
			prs.setIsActive(progress.getIsActive());
			prs.setKbPrice(progress.getKbPrice());
			prs.setPbWays(progress.getPbWays());
			prs.setPbWaysAppend(progress.getPbWaysAppend()); //该字段已经不再使用
			pcBidDAO.saveOrUpdate(prs);
		}else{
			pcBidDAO.saveOrUpdate(progress);
		}
		
	}
	
	/**
	 * 项目单位向二级单位上报 招标（合同）月报。如果不存在二级单位则直接报到集团
	 * @param uids
	 * @param fromUnit
	 * @param toUnit
	 * @param dataExchangeFlag : 是否需要进行数据交换（光伏项目无需数据交换） added by liuay 2012-06-15
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public String misToLev2OfSuperviseReport(String uids ,String fromUnit,String toUnit,String reportMan, String dataExchangeFlag){
		String flag = "1";
		try{
			if(uids.equals("")){
				flag = "0";
			}else{
				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
				java.util.Date date=new java.util.Date();  
				String reportDate=sdf.format(date);
				
				//主表记录
				PcBidSupervisereportM m_record = (PcBidSupervisereportM) pcBidDAO.findBeanByProperty(PcBidSupervisereportM.class.getName(), "uids", uids);
				if(m_record==null){
					flag = "0";
				}else{
					//查询此项目单位对应的二级企业，插入二级企业记录，便于二级企业上报到集团(需要二级企业的主记录)
					List lt = pcBidDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='2' " +
							"connect by prior t.upunit = t.unitid start with t.unitid='"+m_record.getPid()+"' ");
					String mergeSql = "";
					String gfSql="";
					if(lt.size()>0){
						Object[] obj = (Object[]) lt.get(0);
						String newUids = SnUtil.getNewID();
						String unitid = (String) obj[0];
						toUnit = unitid;
						String unitname = (String) obj[1];
						String reportname = unitname+m_record.getSjType().substring(0, 4)+"年"+m_record.getSjType().substring(4, 6)+"月招标(合同)月度报表";
						
						mergeSql = "merge into PC_BID_SUPERVISEREPORT_M tab1 using (select '"+unitid+"' as pid," +
						"'"+newUids+"' as uids,sysdate as createdate,'"+reportname+"' as reportname, 0 as state," +
						"'"+m_record.getSjType()+"' as sj_type from dual ) tab2 " +
						"on ( tab1.sj_type=tab2.sj_type and tab1.pid=tab2.pid ) when not matched then " +
						"insert (pid,uids,create_date,title,state,sj_type) values (tab2.pid,tab2.uids," +
						"tab2.createdate,tab2.reportname,tab2.state,tab2.sj_type) when matched then update set tab1.memo=''";
					}
					gfSql+=mergeSql;
					//在PC_BUSNIESS_BACK表中插入日志记录
					if (mergeSql.length()>0) {
						mergeSql += ";";
					}
					VPcBidSupervisereportM vm_record = (VPcBidSupervisereportM) pcBidDAO.findBeanByProperty(VPcBidSupervisereportM.class.getName(), "uids", uids);
					PcBusniessBack bussBack=new PcBusniessBack();
					bussBack.setPid(vm_record.getPid());
					bussBack.setBusniessId(vm_record.getUids());
					bussBack.setBackUser(reportMan);
					bussBack.setBackDate(date);
					bussBack.setBusniessType("招标(合同)月报上报【项目单位上报到二级企业】");
					bussBack.setSpareC1("上报");
					bussBack.setSpareC2(vm_record.getUnitname());
					bussBack.setBackReason("  ");
					String logStr="insert into PC_BUSNIESS_BACK (pid,uids,busniess_id,back_user,back_date,busniess_type,spare_c1,spare_c2,back_reason)"+
					"values('"+vm_record.getPid()+"','"+SnUtil.getNewID()+"','"+vm_record.getUids()+"','"+reportMan+
					"',to_date('"+reportDate+"','YYYY-MM-DD HH24:MI:SS'),'招标(合同)月报上报【项目单位上报到二级企业】','上报','"+
					vm_record.getUnitname()+"','  ')";
					mergeSql += logStr;
					//动态数据
					PcDynamicData dyda=new PcDynamicData();
					dyda.setPid(vm_record.getPid());
					dyda.setPctablebean(PcBidSupervisereportM.class.getName());
					dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcBidSupervisereportM.class.getName()));
					dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
					dyda.setPctableuids(vm_record.getUids());
					dyda.setPcdynamicdate(new Date());
					dyda.setPcurl(DynamicDataUtil.BID_REPORT_URL);
					
					Session session =pcBidDAO.getSessionFactory().openSession();
					session.beginTransaction();
					session.save(dyda);
					session.getTransaction().commit();
					session.close();
					
					if((Constant.propsMap.get("DEPLOY_UNITTYPE").equals("A")||true) && !dataExchangeFlag.equals("0")){//需要进行数据交互
						List<PcDataExchange> excList= new ArrayList<PcDataExchange>();
						PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
						
						String beforeSql = "delete from PC_BID_SUPERVISEREPORT_D where sj_type='"+m_record.getSjType()+"' and unit_id='"+m_record.getPid()+"'";
						
						String afterSql = mergeSql;
						if (mergeSql.length()>0) {
							afterSql += ";";
						}
						afterSql  += "update PC_BID_SUPERVISEREPORT_M set state='1', report_date=to_date('"+
						reportDate+"','YYYY-MM-DD HH24:MI:SS') where uids = '"+uids+"'";
						
						PcDataExchange excMaster = excService.getExcData(m_record, toUnit, fromUnit, beforeSql, afterSql, "招标(合同)月度报表");
						excList.add(excMaster);
						
						String txGroup = excMaster.getTxGroup();
						long xh = excMaster.getXh();
						//细表数据（概算执行及备注等信息）;
						List lt1 = pcBidDAO.findByWhere(PcBidSupervisereportD.class.getName(), 
								"sj_type='"+m_record.getSjType()+"' and unit_id='"+m_record.getPid()+"'");
						for(int i=0;i<lt1.size();i++){
							PcDataExchange excHbm = excService.getExcData(lt1.get(i), toUnit, fromUnit, null, null, "招标(合同)月度报表");
							excHbm.setTxGroup(txGroup);
							excHbm.setXh(++xh);
							excList.add(excHbm);
						}
						if(dyda !=null){
							PcDataExchange dydaHbm = excService.getExcData(dyda, toUnit, fromUnit, null, null, "招标(合同)月度报表");
							//事务编号
							dydaHbm.setTxGroup(txGroup);
							excList.add(dydaHbm);
						}
						
						Map<String,String> rtnMap = excService.sendExchangeData(excList);
						if(rtnMap.get("result").equals("success")){
							m_record.setState("1");
							m_record.setReportDate(date);
							pcBidDAO.saveOrUpdate(m_record);
							pcBidDAO.saveOrUpdate(bussBack);
						}else{
							flag = "0";//报送失败
							pcBidDAO.delete(dyda);
						}
					}else{//不需要进行数据交互，直接修改报送状态
						m_record.setState("1");
						m_record.setReportDate(date);
						pcBidDAO.saveOrUpdate(m_record);
						pcBidDAO.saveOrUpdate(bussBack);
						pcBidDAO.delete(dyda);
						JdbcUtil.execute(gfSql);
					}
				}
			}
		}catch (PCDataExchangeException e) {
			e.printStackTrace();
			flag = "0";
		}
		return flag;
	}
	/**
	 * 更新状态，并实时进行数据交互。
	 * @param uids
	 * @param bean
	 * @param sql
	 * @return
	 */
	public String updateState(String uids,String backUser,String unitname,String reason,String fromUnit,String state){
		String flag = "1";
		String op="";
		if(state.equals("2"))op="退回";
		if(state.equals("3"))op="审核通过";
		try{
			VPcBidSupervisereportM reportHbmV = (VPcBidSupervisereportM) pcBidDAO.findById(VPcBidSupervisereportM.class.getName(), uids);
			if(reportHbmV!=null){
				PcBidSupervisereportM reportHbm = (PcBidSupervisereportM) pcBidDAO.findById(PcBidSupervisereportM.class.getName(), uids);
				//退回原因
				PcBusniessBack bussBack=MultistageReportUtil.getInsertObjectOfPcBusniessBack(reportHbm.getPid(), reportHbm.getUids(),
							backUser, unitname, op, reason, "招标(合同)月报"+op);
				String unitTypeId = reportHbmV.getUnitTypeId();
				String oldState = reportHbm.getState();
				
				reportHbm.setState(state);
				
				Session session =HibernateSessionFactory.getSession();
				session.beginTransaction();
				session.update(reportHbm);
				session.save(bussBack);
				session.getTransaction().commit();
				List<Object> objList=new ArrayList<Object>();
				objList.add(reportHbm);
				flag=MultistageReportUtil.multiReport(objList, bussBack, unitTypeId,fromUnit, reportHbm.getPid(), "招标(合同)月报"+op);
				if(flag.equals("0")){
					reportHbm.setState(oldState);
					session.beginTransaction();
					session.update(reportHbm);
					session.delete(bussBack);
					session.getTransaction().commit();
				}
				session.close();
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		
		return flag;
	}

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		String pid = "";
		if ( params.get("pid") != null ){
			pid = ((String[])params.get("pid"))[0];
		}
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();

		if (treeName.equalsIgnoreCase("SuperviseReportTree")) { // 概算结构树
			String rootPid = ((String[])params.get("rootpid"))[0];
			String sjType = ((String[])params.get("sjtype"))[0];
			String unitType=((String[])params.get("unitType"))[0];
			list =getSuperviseReportTree(rootPid, sjType,unitType);
			return list;
		}

		return list;
		
	}
	
	private List<ColumnTreeNode> getSuperviseReportTree(String rootPid, String sjType, String unitType){
		List<ColumnTreeNode> nodeList = new ArrayList<ColumnTreeNode>();
		
		//得到当前用户管辖所有项目
		int length=0;
		SystemMgmFacade systemMgm=(SystemMgmFacade)Constant.wact.getBean("systemMgm");
		   List<SgccIniUnit> unitList=(List<SgccIniUnit>)systemMgm.getPidsByUnitid(rootPid);
		   length=unitList.size();
		   List objList=null;
		if(unitType.equals("2")){
			objList = pcBidDAO.getDataAutoCloseSes("select unitid,unitname from sgcc_ini_unit t where t.unit_type_id='2' " +
			 		"connect by prior t.unitid=t.upunit start with t.unitid='"+rootPid+"' ");
			if(objList!=null)length=objList.size();
		}
		for (int i=0;i<length;i++) {
			//找到该项目当月报表上报情况
			String unitId=unitList.get(i).getUnitid();
			String unitname=unitList.get(i).getUnitname();
			if(unitType.equals("2")){
				Object[] obj = (Object[]) objList.get(i);
				unitId = (String) obj[0];//二级企业单位id
				unitname = (String) obj[1];//二级企业名称
			}
			
			String sqlWhere = " pid = '%s' and sjType = '%s' and state in ('1','2')";
			List<VPcBidSupervisereportM> tempList = pcBidDAO.findByWhere(VPcBidSupervisereportM.class.getName(), String.format(sqlWhere, unitId, sjType));
			VPcBidSupervisereportM mainReport;
			if ( tempList.size() > 0 ){
				mainReport = tempList.get(0);
			}
			else{
				mainReport = new VPcBidSupervisereportM();
				mainReport.setPid(unitId);
				mainReport.setState("0");
			}
			ColumnTreeNode columnNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();
			node.setId(unitId);
			node.setText(unitname);
			node.setLeaf(true);
			node.setIconCls("task");
			
			columnNode.setTreenode(node);
			JSONObject jsonObject = JSONObject.fromObject(mainReport);
			columnNode.setColumns(jsonObject);
			nodeList.add(columnNode);
		}
		   
		return nodeList;
	}
	/**
	 * 招标(合同)月报回退
	 */
	public String sendBackSuperviseReport(String uids, String reason,String backUser, String fromUnit,String unitname) {
		String flag = "1";
		try{
			VPcBidSupervisereportM reportHbmV = (VPcBidSupervisereportM) pcBidDAO.findById(VPcBidSupervisereportM.class.getName(), uids);
			log.debug("【招标(合同)月报退回】退回人："+backUser+",退回原因："+reason);
			if(reportHbmV!=null){
				PcBidSupervisereportM reportHbm = (PcBidSupervisereportM) pcBidDAO.findById(PcBidSupervisereportM.class.getName(), uids);
				//退回原因
				PcBusniessBack bussBack=MultistageReportUtil.getInsertObjectOfPcBusniessBack(reportHbm.getPid(), reportHbm.getUids(),
							backUser, unitname, "退回", reason, "招标(合同)月报退回");
				String unitTypeId = reportHbmV.getUnitTypeId();
				reportHbm.setState("2");
				Session session =pcBidDAO.getSessionFactory().openSession();
				session.beginTransaction();
				session.update(reportHbm);
				session.save(bussBack);
				session.getTransaction().commit();
				List<Object> objList=new ArrayList<Object>();
				objList.add(reportHbm);
				flag=MultistageReportUtil.multiReport(objList, bussBack, unitTypeId, fromUnit,reportHbm.getPid(), "招标(合同)月报退回");
				if(flag.equals("0")){
					session.getTransaction().rollback();
				}
			}else{
				flag = "0";
			}
		}catch (BusinessException e) {
			flag = "0";
			e.printStackTrace();
			log.debug(Constant.getTrace(e));
		}
		return flag;
	}

	/**
	 * 配置每个月的中标信息
	 * @param zbNrIds
	 * @param pid
	 * @param sjType
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public boolean addZbNr2Report(String[] zbNrIds, String pid, String sjType) {
		try{
			Connection conn = HibernateSessionFactory.getConnection();
			Statement stmt = conn.createStatement();
			conn.setAutoCommit(false);
			//先查询细表中设置过的中标信息					
			Map<String, String> savedIds = new HashMap<String, String>();
			List<Map> hasZbIds = JdbcUtil.query("select zb_seqno from pc_bid_supervisereport_d where sj_type='"+sjType+"' " +
					"and unit_id='"+pid+"' and zb_seqno is not null");
			for(int i=0;i<hasZbIds.size();i++){
				Map m = hasZbIds.get(i);			
				savedIds.put(m.get("zb_seqno").toString(), "");
			}
			
			for(String zbNrId : zbNrIds){
				List<Map> v = JdbcUtil.query("select zb_seqno,bdg_value,memo from pc_bid_supervisereport_d where sj_type='"+sjType+"' " +
						"and unit_id='"+pid+"' and zb_seqno='"+zbNrId+"'");				
				Double bdgValue=null;
				String memo="";
				if(v.size()>0){
					if(null!=v.get(0).get("bdg_value")){
						bdgValue=Double.parseDouble(v.get(0).get("bdg_value").toString());
					}
					if(null!=v.get(0).get("memo")){
						memo=v.get(0).get("memo").toString();
					}					
				}				
				if(savedIds.containsKey(zbNrId)){
					savedIds.remove(zbNrId);
					String delSql = "delete from pc_bid_supervisereport_d where sj_type='"+sjType+"' and " +
					"unit_id='"+pid+"' and zb_seqno='"+zbNrId+"'";
					JdbcUtil.execute(delSql);//已经设置过，删除了在重新设置
				}

				String insertSql = "insert into pc_bid_supervisereport_d " +
				" (bdg_value,memo,uids,sj_type,unit_id,zb_seqno,unitname,zbnr,zbbh,kbrq,zbfs,dljg,zbdw,kbjg,zbjg,pbbf,convalue) " +
				" (select "+bdgValue+",'"+memo+"','"+SnUtil.getNewID()+"','"+sjType+"','"+pid+"','"+zbNrId+"',unitname,zbnr,zbbh," +
				" kbrq,zbfs,dljg,zbdw,kbjg,zbjg,pbbf,convalue " +
				" from v_pc_zb_report where zb_seqno = '"+zbNrId+"')";
				stmt.addBatch(insertSql);				 
			}
			//如果savedIds不为空，说明剩下的需要删除的不需要上报的中标内容
			if(!savedIds.isEmpty()){
				Iterator<String> it = savedIds.keySet().iterator();
				for(;it.hasNext();){
					String id = it.next();
					String delSql = "delete from pc_bid_supervisereport_d where sj_type='"+sjType+"' and " +
						"unit_id='"+pid+"' and zb_seqno='"+id+"'";
					stmt.addBatch(delSql);
					
				}
			}
			stmt.executeBatch();
			conn.commit();
			stmt.close();
			conn.close();
			return true;
		}catch(Exception ex ){
			ex.printStackTrace();
			return false;
		}
	}
	/**
	 * 配置每个月的中标信息,未上报不重新选择时更新报表信息
	 * @param pid
	 * @param sjType
	 * @return
	 */
	public boolean updateZbNr2Report(String pid, String sjType) {
		try{
			Connection conn = HibernateSessionFactory.getConnection();
			Statement stmt = conn.createStatement();
			conn.setAutoCommit(false);
			//先查询细表中设置过的中标信息					
			Map<String, String> savedIds = new HashMap<String, String>();
			List<Map> hasZbIds = JdbcUtil.query("select zb_seqno from pc_bid_supervisereport_d where sj_type='"+sjType+"' " +
					"and unit_id='"+pid+"' and zb_seqno is not null");
			for(int i=0;i<hasZbIds.size();i++){
				Map m = hasZbIds.get(i);
				String zbNrId=m.get("zb_seqno").toString();
				List<Map> v = JdbcUtil.query("select zb_seqno,bdg_value,memo from pc_bid_supervisereport_d where sj_type='"+sjType+"' " +
						"and unit_id='"+pid+"' and zb_seqno='"+zbNrId+"'");				
				Double bdgValue=null;
				String memo="";
				if(v.size()>0){
					if(null!=v.get(0).get("bdg_value")){
						bdgValue=Double.parseDouble(v.get(0).get("bdg_value").toString());
					}
					if(null!=v.get(0).get("memo")){
						memo=v.get(0).get("memo").toString();
					}					
				}				
				String delSql = "delete from pc_bid_supervisereport_d where sj_type='"+sjType+"' and " +
				"unit_id='"+pid+"' and zb_seqno='"+zbNrId+"'";
				JdbcUtil.execute(delSql);//已经设置过，删除了在重新设置
				String insertSql = "insert into pc_bid_supervisereport_d " +
				" (bdg_value,memo,uids,sj_type,unit_id,zb_seqno,unitname,zbnr,zbbh,kbrq,zbfs,dljg,zbdw,kbjg,zbjg,pbbf,convalue) " +
				" (select "+bdgValue+",'"+memo+"','"+SnUtil.getNewID()+"','"+sjType+"','"+pid+"','"+zbNrId+"',unitname,zbnr,zbbh," +
				" kbrq,zbfs,dljg,zbdw,kbjg,zbjg,pbbf,convalue " +
				" from v_pc_zb_report where zb_seqno = '"+zbNrId+"')";
				stmt.addBatch(insertSql);	   
			}
			stmt.executeBatch();
			conn.commit();
			stmt.close();
			conn.close();
			return true;
		}catch(Exception ex ){
			ex.printStackTrace();
			return false;
		}
	}
	
	/**
	 * 发放中标通知书自定义保存方法
	 * @param records  修改的记录集合
	 * @param currentPid 数据交换发送单位
	 * @param defaultOrgRootID  数据交换接收单位
	 * @return
	 */
	public boolean saveWindocs(List<PcBidIssueWinDoc> records, String currentPid, String defaultOrgRootID) 
	{
		List<PcDynamicData> list = new ArrayList<PcDynamicData>();  //将新产生的动态数据对象加入到该集合,便于加入数据交互队列
		List<PcBidIssueWinDoc> addDocList = new ArrayList<PcBidIssueWinDoc>();  //新增的发放中标通知书对象
		List<PcBidIssueWinDoc> updateDocList = new ArrayList<PcBidIssueWinDoc>(); //更新的发放中标通知书对象
		
		try{
			for(int i=0; i<records.size(); i++)
			{
				PcBidIssueWinDoc windocBeanCur = records.get(i);
				if(windocBeanCur.getStartDate()!=null){
					if (windocBeanCur.getStartDate().toString().equals("Thu Jan 01 08:00:00 CST 1970")){
						windocBeanCur.setStartDate(null);
					}					
				}
				PcBidIssueWinDoc windocBeanOld = 
					(PcBidIssueWinDoc)this.pcBidDAO.findById(PcBidIssueWinDoc.class.getName(),windocBeanCur.getUids());			
				
				if(windocBeanOld!=null)              //修改的只需要判断进度值是否相等
				{
					Double rateOld = windocBeanOld.getRateStatus();
					Double rateCur = windocBeanCur.getRateStatus();
					
					if(rateOld!=null && rateCur!=null && rateOld.compareTo(rateCur)!=0) //修改了进度信息, 加入动态数据表
					{
						windocBeanOld.setRateStatus(windocBeanCur.getRateStatus());
						
						PcDynamicData dyda = new PcDynamicData();
						dyda.setUids(SnUtil.getNewID());
						dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
						dyda.setPid(windocBeanCur.getPid());
						dyda.setPctablebean(PcBidIssueWinDoc.class.getName());
						dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcBidIssueWinDoc.class.getName()));
						dyda.setPctableuids(windocBeanCur.getUids());
						dyda.setPcdynamicdate(new Date());
						dyda.setPcurl(DynamicDataUtil.BID_SCHEDULE_URL);
						
						Session session = pcBidDAO.getSessionFactory().openSession();
						session.beginTransaction();
						session.save(dyda);
//						session.saveOrUpdate(windocBeanOld);
						session.getTransaction().commit();
						session.close();
						updateDocList.add(windocBeanOld);
						list.add(dyda);
					}
					//BeanUtils.copyProperties(windocBeanOld, windocBeanCur);
					windocBeanOld.setUids(windocBeanCur.getUids());
					windocBeanOld.setTbUnit(windocBeanCur.getTbUnit());
					windocBeanOld.setTbPrice(windocBeanCur.getTbPrice());
					windocBeanOld.setState(windocBeanCur.getState());
					windocBeanOld.setStartDate(windocBeanCur.getStartDate());
					windocBeanOld.setRespondUser(windocBeanCur.getRespondUser());
					windocBeanOld.setRespondDept(windocBeanCur.getRespondDept());
					windocBeanOld.setRateStatus(windocBeanCur.getRateStatus());
					windocBeanOld.setPid(windocBeanCur.getPid());
					windocBeanOld.setMemo(windocBeanCur.getMemo());
					windocBeanOld.setEndDate(windocBeanCur.getEndDate());
					windocBeanOld.setContentUids(windocBeanCur.getContentUids());					
					this.pcBidDAO.saveOrUpdate(windocBeanOld);
//					windocBeanOld.setContentUids(windocBeanCur.getContentUids());
				}
				else      //如果是新增的, 这里给定主键然后保存, 便于加入动态数据时Pctableuids字段的设定
				{   
//					windocBeanCur.setUids(SnUtil.getNewID());
					String uidsTemp = this.pcBidDAO.insert(windocBeanCur);  //如果新增的记录已经认为分配了主键, 默认会update, 所以插入记录会失败
					
					PcDynamicData dyda = new PcDynamicData();
					dyda.setUids(SnUtil.getNewID());
					dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
					dyda.setPid(windocBeanCur.getPid());
					dyda.setPctablebean(PcBidIssueWinDoc.class.getName());
					dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcBidIssueWinDoc.class.getName()));
					dyda.setPctableuids(uidsTemp);
					dyda.setPcdynamicdate(new Date());
					dyda.setPcurl(DynamicDataUtil.BID_SCHEDULE_URL);
					
					Session session = pcBidDAO.getSessionFactory().openSession();
					session.beginTransaction();
					session.save(dyda);
//					session.save(windocBeanCur);
					session.getTransaction().commit();
					session.close();
					addDocList.add(windocBeanCur);
					list.add(dyda);
//					is.pcBidDAO.insert(windocBeanCur);  //如果新增的记录已经认为分配了主键, 默认会update, 所以插入记录会失败
				}
			}
			
			String deployType =  Constant.propsMap.get("DEPLOY_UNITTYPE");
			if(deployType.equals("A"))
			{
				String bizInfo = "动态数据发放中标通知-新增";
				PCDataExchangeService exService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				List<PcDataExchange> excList = exService.getExcDataList(list, defaultOrgRootID, currentPid, null, null, bizInfo);
				
				if(addDocList.size() > 0)
				{
					excList.addAll(exService.getExcDataList(addDocList, defaultOrgRootID, currentPid, null, null, "发放中标通知书-新增"));
				}
				
				if(updateDocList.size() > 0)
				{
					excList.addAll(exService.getExcDataList(updateDocList, defaultOrgRootID, currentPid, null, null, "发放中标通知书-修改"));
				}
				
				exService.addExchangeListToQueue(excList);
			}
			
			return true;
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
	}
	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-4
	 */
	public InputStream getExcelTemplate(String businessType){
		InputStream ins = null;
		String templateSql = "select fileid from app_template t where templatecode='" + businessType + "' order by lastmodify desc";
		List<Map<String, String>> l = JdbcUtil.query(templateSql);
		String templateFileId = "";
		if (l.size()>0) {
			templateFileId = l.get(0).get("fileid");
		}
		
		if (templateFileId!=null && templateFileId.length()>0) {
			try {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource) JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement();
				ResultSet rs = null;
				rs = stmt.executeQuery("SELECT BLOB FROM APP_BLOB WHERE FILEID ='"+templateFileId+"'");
				if(rs.next()) {
					BLOB blob = (BLOB) rs.getBlob(1);
					ins = blob.getBinaryStream();
				}
				rs.close() ;
				stmt.close() ;
				conn.close() ;
				initCtx.close() ;
				
			} catch (Exception ex) {
				ex.printStackTrace();
				return null ;
			}
		}
		return ins;
	}	
	
	/**
	 * 获取三级企业部门信息；
	 * @param businessType
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-4
	 */	
	public String syncBuilding3GroupUnitTree(Map paramsmap) {
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
			System.out.println("sql is*********"+sql);
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
	/**
	 * 获取三级企业部门所有员工；
	 * @param deptId
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-4
	 */		
	public List<RockUser> getUserInDept(String deptId) {
		List<RockUser> returnList = new ArrayList();	
		String deptFilterStr = "select unitid from sgcc_ini_unit start with unitid = '" + deptId +"' connect by prior unitid = upunit";
		String sql="select userid,realname from rock_user where dept_id in (" + deptFilterStr + ")";
		List<Map> users = JdbcUtil.query(sql);
		for(int i=0;i<users.size();i++){
			Map m = users.get(i);
			if(null!=m.get("userid")&&null!=m.get("realname")){
				String userid=m.get("userid").toString();
				String realname=m.get("realname").toString();
				RockUser rockUser=new RockUser();
				rockUser.setUserid(userid);
				rockUser.setRealname(realname);
				returnList.add(rockUser);				
			}
		}
		return returnList;
	}	
	/**
	 * 判断投标单位预审信息是否能被删除
	 * @param bidContentId
	 * @param uids
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-5
	 */		
	public String checkIfApplicantDelete(String bidContentId,String uids){
		String flag="1";
		List<PcBidSendZbdoc> pcBidSendZbdoc=pcBidDAO.findByWhere(PcBidSendZbdoc.class.getName(), "CONTENT_UIDS='"+bidContentId+"' and TB_UNIT='"+uids+"'");
		List<PcBidAcceptTbdocAndBond> pcBidAcceptTbdocAndBond=pcBidDAO.findByWhere(PcBidAcceptTbdocAndBond.class.getName(), "CONTENT_UIDS='"+bidContentId+"' and TB_UNIT='"+uids+"'");
		List<PcBidOpenBidding> pcBidOpenBidding=pcBidDAO.findByWhere(PcBidOpenBidding.class.getName(), "CONTENT_UIDS='"+bidContentId+"' and TB_UNIT='"+uids+"'");
		List<PcBidJudgeBidding> pcBidJudgeBidding=pcBidDAO.findByWhere(PcBidJudgeBidding.class.getName(), "CONTENT_UIDS='"+bidContentId+"' and TB_UNIT='"+uids+"'");
		List<PcBidIssueWinDoc> pcBidIssueWinDoc=pcBidDAO.findByWhere(PcBidIssueWinDoc.class.getName(), "CONTENT_UIDS='"+bidContentId+"' and TB_UNIT='"+uids+"'");
		if(null!=pcBidSendZbdoc&&pcBidSendZbdoc.size()>0){
			flag="2";
		}
		if(null!=pcBidAcceptTbdocAndBond&&pcBidAcceptTbdocAndBond.size()>0){
			flag="2";
		}
		if(null!=pcBidOpenBidding&&pcBidOpenBidding.size()>0){
			flag="2";
		}
		if(null!=pcBidJudgeBidding&&pcBidJudgeBidding.size()>0){
			flag="2";
		}
		if(null!=pcBidIssueWinDoc&&pcBidIssueWinDoc.size()>0){
			flag="2";
		}
		
		return flag;
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
	 * 【发售招标文件】、【接收投标文件及投标保证金】、【开标】、【评标及评标结果公示】、【发放中标通知书】
	 * 选择预审结果里面的单位
	 * @param tbUnitType
	 * @param bidContentId
	 * @param orderby
	 * @param start
	 * @param limit
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-5
	 */
	public List<PcBidTbUnitInfo> getUnselectTbUnit(String tbUnitType,String bidContentId,String orderby, Integer start,
			Integer limit){
		String whereStr="preHearResult=1";
		String uidsStr="";
		if(bidContentId!=""){
			whereStr+=" and contentUids='"+bidContentId+"'";
		}		
		if("PcBidSendZbdoc".equals(tbUnitType)){
			List<PcBidSendZbdoc> pcBidSendZbdoc=pcBidDAO.findByWhere(PcBidSendZbdoc.class.getName(), "CONTENT_UIDS='"+bidContentId+"'");
		    if(pcBidSendZbdoc!=null&&pcBidSendZbdoc.size()>0){
		    	for(int i=0;i<pcBidSendZbdoc.size();i++){
		    		PcBidSendZbdoc obj=pcBidSendZbdoc.get(i);
		    		uidsStr+="'"+obj.getTbUnit()+"'"+",";	
		    	}
		    	
		    }
		}
		else if("PcBidOpenBidding".equals(tbUnitType)){
			List<PcBidOpenBidding> pcBidOpenBidding=pcBidDAO.findByWhere(PcBidOpenBidding.class.getName(), "CONTENT_UIDS='"+bidContentId+"'");
		    if(pcBidOpenBidding!=null&&pcBidOpenBidding.size()>0){
		    	for(int i=0;i<pcBidOpenBidding.size();i++){
		    		PcBidOpenBidding obj=pcBidOpenBidding.get(i);
		    		uidsStr+="'"+obj.getTbUnit()+"'"+",";	
		    	}
		    	
		    }			
		}
		else if("PcBidAcceptTbdocAndBond".equals(tbUnitType)){
			List<PcBidAcceptTbdocAndBond> pcBidAcceptTbdocAndBond=pcBidDAO.findByWhere(PcBidAcceptTbdocAndBond.class.getName(), "CONTENT_UIDS='"+bidContentId+"'");
		    if(pcBidAcceptTbdocAndBond!=null&&pcBidAcceptTbdocAndBond.size()>0){
		    	for(int i=0;i<pcBidAcceptTbdocAndBond.size();i++){
		    		PcBidAcceptTbdocAndBond obj=pcBidAcceptTbdocAndBond.get(i);
		    		uidsStr+="'"+obj.getTbUnit()+"'"+",";	
		    	}
		    	
		    }			
		}
		else if("PcBidJudgeBidding".equals(tbUnitType)){
			List<PcBidJudgeBidding> pcBidJudgeBidding=pcBidDAO.findByWhere(PcBidJudgeBidding.class.getName(), "CONTENT_UIDS='"+bidContentId+"'");
		    if(pcBidJudgeBidding!=null&&pcBidJudgeBidding.size()>0){
		    	for(int i=0;i<pcBidJudgeBidding.size();i++){
		    		PcBidJudgeBidding obj=pcBidJudgeBidding.get(i);
		    		uidsStr+="'"+obj.getTbUnit()+"'"+",";	
		    	}
		    	
		    }				
		}
		else if("PcBidIssueWinDoc".equals(tbUnitType)){
			List<PcBidIssueWinDoc> pcBidIssueWinDoc=pcBidDAO.findByWhere(PcBidIssueWinDoc.class.getName(), "CONTENT_UIDS='"+bidContentId+"'");
		    if(pcBidIssueWinDoc!=null&&pcBidIssueWinDoc.size()>0){
		    	for(int i=0;i<pcBidIssueWinDoc.size();i++){
		    		PcBidIssueWinDoc obj=pcBidIssueWinDoc.get(i);
		    		uidsStr+="'"+obj.getTbUnit()+"'"+",";	
		    	}
		    	
		    }			
		}	
		if(uidsStr!=""){
			uidsStr=uidsStr.substring(0, uidsStr.length()-1);
			whereStr+=" and uids not in ("+uidsStr+")";
		}
		List<PcBidTbUnitInfo> list = this.pcBidDAO.findByWhere(PcBidTbUnitInfo.class.getName(),whereStr,
				orderby, start, limit);		
		return list;
	}
	/**
	 * 保存发售招标文件选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param rateStatus
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */		
	public String[] savePcBidSendZbdocByTbUnits(String currentPid,String bidContentId,Double rateStatus,String tbUidsArray[]){
		String uidsArr[]=null;
		if(tbUidsArray!=null&&tbUidsArray.length>0){
			PcBidSendZbdoc pcBidSendZbdoc=null;
			uidsArr=new String[tbUidsArray.length];
			for(int i=0;i<tbUidsArray.length;i++){
				pcBidSendZbdoc=new PcBidSendZbdoc();
				pcBidSendZbdoc.setPid(currentPid);
				pcBidSendZbdoc.setContentUids(bidContentId);
				pcBidSendZbdoc.setRateStatus(rateStatus);
				pcBidSendZbdoc.setTbUnit(tbUidsArray[i]);
				try {
					String uids=pcBidDAO.insert(pcBidSendZbdoc);
					uidsArr[i]=uids;
				} catch (RuntimeException e) {
				}
			}
		}
		
		return uidsArr;
	}	
	/**
	 * 保存接收投标文件及投标保证金选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param rateStatus
	 * @param isPayBond
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */	
	public String[] savePcBidAcceptTbdocAndBondByTbUnits(String currentPid,String bidContentId,Double rateStatus,String isPayBond,String tbUidsArray[]){
		String uidsArr[]=null;
		if(tbUidsArray!=null&&tbUidsArray.length>0){
			uidsArr=new String[tbUidsArray.length];
			PcBidAcceptTbdocAndBond pcBidAcceptTbdocAndBond=null;
			for(int i=0;i<tbUidsArray.length;i++){
				pcBidAcceptTbdocAndBond=new PcBidAcceptTbdocAndBond();
				pcBidAcceptTbdocAndBond.setPid(currentPid);
				pcBidAcceptTbdocAndBond.setContentUids(bidContentId);
				pcBidAcceptTbdocAndBond.setRateStatus(rateStatus);
				pcBidAcceptTbdocAndBond.setIsPayBond(isPayBond);
				pcBidAcceptTbdocAndBond.setTbUnit(tbUidsArray[i]);
				try {
					String uids=pcBidDAO.insert(pcBidAcceptTbdocAndBond);
					uidsArr[i]=uids;
				} catch (RuntimeException e) {
				}
			}
		}
		
		return uidsArr;
	}	
	/**
	 * 开标选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param rateStatus
	 * @param offer
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */	
	public String[] savePcBidOpenBiddingByTbUnits(String currentPid,String bidContentId,Double rateStatus,Double offer,String tbUidsArray[]){
		String uidsArr[]=null;
		if(tbUidsArray!=null&&tbUidsArray.length>0){
			uidsArr=new String[tbUidsArray.length];
			PcBidOpenBidding pcBidOpenBidding=null;
			for(int i=0;i<tbUidsArray.length;i++){
				pcBidOpenBidding=new PcBidOpenBidding();
				pcBidOpenBidding.setPid(currentPid);
				pcBidOpenBidding.setContentUids(bidContentId);
				pcBidOpenBidding.setRateStatus(rateStatus);
				pcBidOpenBidding.setOffer(offer);
				pcBidOpenBidding.setTbUnit(tbUidsArray[i]);
				try {
					String uids=pcBidDAO.insert(pcBidOpenBidding);
					uidsArr[i]=uids;
				} catch (RuntimeException e) {
				}
			}
		}
		
		return uidsArr;
	}
	/**
	 * 评标及评标结果公示选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */	
	public String[] savePcBidJudgeBiddingByTbUnits(String currentPid,String bidContentId,String tbUidsArray[]){
		String uidsArr[]=null;
		if(tbUidsArray!=null&&tbUidsArray.length>0){
			uidsArr=new String[tbUidsArray.length];
			PcBidJudgeBidding pcBidJudgeBidding=null;
			for(int i=0;i<tbUidsArray.length;i++){
				pcBidJudgeBidding=new PcBidJudgeBidding();
				pcBidJudgeBidding.setPid(currentPid);
				pcBidJudgeBidding.setContentUids(bidContentId);
				pcBidJudgeBidding.setTbUnit(tbUidsArray[i]);
				try {
					String uids=pcBidDAO.insert(pcBidJudgeBidding);
					uidsArr[i]=uids;
				} catch (RuntimeException e) {
				}
			}
		}
		
		return uidsArr;
	}	
	/**
	 * 发放中标通知书选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param rateStatus
	 * @param USERDEPTID
	 * @param USERID
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */	
	public String[] savePcBidIssueWinDocByTbUnits(String currentPid,String bidContentId,Double rateStatus,String USERDEPTID,String USERID,String tbUidsArray[]){
		String uidsArr[]=null;
		if(tbUidsArray!=null&&tbUidsArray.length>0){
			PcBidIssueWinDoc pcBidIssueWinDoc=null;
			uidsArr=new String[tbUidsArray.length];
			for(int i=0;i<tbUidsArray.length;i++){
				pcBidIssueWinDoc=new PcBidIssueWinDoc();
				pcBidIssueWinDoc.setPid(currentPid);
				pcBidIssueWinDoc.setContentUids(bidContentId);
				pcBidIssueWinDoc.setRateStatus(rateStatus);
				pcBidIssueWinDoc.setRespondDept(USERDEPTID);
				pcBidIssueWinDoc.setRespondUser(USERID);
				pcBidIssueWinDoc.setTbUnit(tbUidsArray[i]);
				try {
					String uids=pcBidDAO.insert(pcBidIssueWinDoc);
					uidsArr[i]=uids;
				} catch (RuntimeException e) {

				}
			}
		}
		
		return uidsArr;
	}		
	
	/**
	 * 保存光伏项目的报表明细数据到数据库中
	 * @param bidSupervisereportD
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-12
	 */
	public String insertZbNr2Report(PcBidSupervisereportD bidSupervisereportD){
		if(bidSupervisereportD.getUids()!=null && bidSupervisereportD.getUids().length()>0) {
			this.pcBidDAO.saveOrUpdate(bidSupervisereportD);
		} else {
			this.pcBidDAO.insert(bidSupervisereportD);
		}
		return "";
	}
	
	/**
	 * 删除招投标报表的一条记录【光伏】
	 * @param sjType	时间
	 * @param pid		项目单位ID
	 * @param zbSeqno	指标ID
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-13
	 */
	public String deleteZbNr2Report(String sjType, String pid, String zbSeqno){
		List<PcBidSupervisereportD> list = this.pcBidDAO.findByWhere(PcBidSupervisereportD.class.getName(), "sj_type='" + sjType + "' and unit_id='" + pid + "' and zb_seqno='" + zbSeqno + "'");
		this.pcBidDAO.deleteAll(list);
		return "";
	}
	
	/**
	 * 获取招投标报表的一条记录【光伏】
	 * @param sjType	时间
	 * @param pid		项目单位ID
	 * @param zbSeqno	指标ID
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-13
	 */
	public PcBidSupervisereportD getZbNr2Report(String sjType, String pid,	String zbSeqno){
		List<PcBidSupervisereportD> list = this.pcBidDAO.findByWhere(PcBidSupervisereportD.class.getName(), "sj_type='" + sjType + "' and unit_id='" + pid + "' and zb_seqno='" + zbSeqno + "'");
		if(list.size()>0) {
			return list.get(0);
		} else {
			return null;
		}
	}
	/**
	 * 嘉节首页查询七大报表【嘉节】
	 * @param pid		项目单位ID
	 * @return list
	 * @author: shangtw
	 * @createDate: 2012-7-10
	 */
	public List<VPcJiaJieReportIndex> getJiaJieReportIndex(String pid) {
		Calendar cal = Calendar.getInstance();
		int curYear = cal.get(Calendar.YEAR);
		int curMonth = cal.get(Calendar.MONTH )+1;
		int lastMonth=curMonth-1;
		String curYearStr=String.valueOf(curYear);
		String curMonthStr=String.valueOf(curMonth);
		String lastMonthStr=String.valueOf(lastMonth);
		if(curMonthStr.length()<2){//月份补0
			curMonthStr="0"+curMonthStr;
		}
		if(lastMonthStr.length()<2){//月份补0
			lastMonthStr="0"+lastMonthStr;
		}		
		//年度投资计划报表		
		List<VPcJiaJieReportIndex>vPcJiaJieReportIndexList=new ArrayList<VPcJiaJieReportIndex>();
		List<VPcTzglYearPlanM>vPcTzglYearPlanMList=pcBidDAO.findByWhere(VPcTzglYearPlanM.class.getName(), "pid='"+pid+"' and sjType="+curYearStr);
		if(vPcTzglYearPlanMList!=null&&vPcTzglYearPlanMList.size()>0){
			VPcJiaJieReportIndex vPcJiaJieReportIndex=new VPcJiaJieReportIndex();
			VPcTzglYearPlanM vPcTzglYearPlanM=vPcTzglYearPlanMList.get(0);
			vPcJiaJieReportIndex.setPeriod(curYearStr);
			vPcJiaJieReportIndex.setPid(pid);
			vPcJiaJieReportIndex.setUids(vPcTzglYearPlanM.getUids());
			vPcJiaJieReportIndex.setReportName(vPcTzglYearPlanM.getTitle());
			vPcJiaJieReportIndex.setReportPerson(vPcTzglYearPlanM.getUserId());
			vPcJiaJieReportIndex.setReportTime(vPcTzglYearPlanM.getCreateDate());
			vPcJiaJieReportIndex.setType("VPcTzglYearPlanM");
			vPcJiaJieReportIndex.setState(String.valueOf(vPcTzglYearPlanM.getIssueStatus()));
			vPcJiaJieReportIndexList.add(vPcJiaJieReportIndex);
		}
		// 投资完成月度报表
		List<VPcTzglMonthCompM>vPcTzglMonthCompMList=pcBidDAO.findByWhere(VPcTzglMonthCompM.class.getName(), "pid='"+pid+"' and (substr(sjType,5,2)='"+curMonthStr+"' or substr(sjType,5,2)='"+lastMonthStr+"')");
		if(vPcTzglMonthCompMList!=null&&vPcTzglMonthCompMList.size()>0){
			VPcJiaJieReportIndex vPcJiaJieReportIndex=null;
			for(int i=0;i<vPcTzglMonthCompMList.size();i++){
				vPcJiaJieReportIndex=new VPcJiaJieReportIndex();
				VPcTzglMonthCompM vPcTzglMonthCompM=vPcTzglMonthCompMList.get(i);
				vPcJiaJieReportIndex.setPeriod(vPcTzglMonthCompM.getSjType());
				vPcJiaJieReportIndex.setReportName(vPcTzglMonthCompM.getTitle());
				vPcJiaJieReportIndex.setReportPerson(vPcTzglMonthCompM.getCreateperson());
				vPcJiaJieReportIndex.setReportTime(vPcTzglMonthCompM.getCreateDate());
				vPcJiaJieReportIndex.setType("VPcTzglMonthCompM");
				vPcJiaJieReportIndex.setPid(pid);
				vPcJiaJieReportIndex.setUids(vPcTzglMonthCompM.getUids());
				vPcJiaJieReportIndex.setState(String.valueOf(vPcTzglMonthCompM.getReportStatus()));		
				vPcJiaJieReportIndexList.add(vPcJiaJieReportIndex);
			}
		}
		
		//进度情况月度报表	  
		List<VPcJdgkReport>vPcJdgkReportList=pcBidDAO.findByWhere(VPcJdgkReport.class.getName(), "pid='"+pid+"' and (substr(sjType,5,2)='"+curMonthStr+"' or substr(sjType,5,2)='"+lastMonthStr+"')");
		if(vPcJdgkReportList!=null&&vPcJdgkReportList.size()>0){
			VPcJiaJieReportIndex vPcJiaJieReportIndex=null;
			for(int i=0;i<vPcJdgkReportList.size();i++){
				vPcJiaJieReportIndex=new VPcJiaJieReportIndex();
				VPcJdgkReport vPcJdgkReport=vPcJdgkReportList.get(i);
				vPcJiaJieReportIndex.setPeriod(vPcJdgkReport.getSjType());
				vPcJiaJieReportIndex.setReportName(vPcJdgkReport.getReportname());
				vPcJiaJieReportIndex.setReportPerson(vPcJdgkReport.getCreateperson());
				vPcJiaJieReportIndex.setReportTime(vPcJdgkReport.getCreatedate());
				vPcJiaJieReportIndex.setType("VPcJdgkReport");
				vPcJiaJieReportIndex.setPid(pid);   
				vPcJiaJieReportIndex.setUids(vPcJdgkReport.getUids());
				vPcJiaJieReportIndex.setState(vPcJdgkReport.getState());	
				vPcJiaJieReportIndexList.add(vPcJiaJieReportIndex);
			}
		}		
		
		//电源固定资产投资完成情况月报
		List<VPcTzglDyreport1M>vPcTzglDyreport1MList=pcBidDAO.findByWhere(VPcTzglDyreport1M.class.getName(), "pid='"+pid+"' and (substr(sjType,5,2)='"+curMonthStr+"' or substr(sjType,5,2)='"+lastMonthStr+"')");
		if(vPcTzglDyreport1MList!=null&&vPcTzglDyreport1MList.size()>0){
			VPcJiaJieReportIndex vPcJiaJieReportIndex=null;
			for(int i=0;i<vPcTzglDyreport1MList.size();i++){
				vPcJiaJieReportIndex=new VPcJiaJieReportIndex();
				VPcTzglDyreport1M vPcTzglDyreport1M=vPcTzglDyreport1MList.get(i);
				vPcJiaJieReportIndex.setPeriod(vPcTzglDyreport1M.getSjType());
				vPcJiaJieReportIndex.setReportName(vPcTzglDyreport1M.getTitle());
				vPcJiaJieReportIndex.setReportPerson(vPcTzglDyreport1M.getUserId());
				vPcJiaJieReportIndex.setReportTime(vPcTzglDyreport1M.getCreateDate());
				vPcJiaJieReportIndex.setType("VPcTzglDyreport1M");
				vPcJiaJieReportIndex.setPid(pid);
				vPcJiaJieReportIndex.setUids(vPcTzglDyreport1M.getUids());
				vPcJiaJieReportIndex.setState(vPcTzglDyreport1M.getState());	
				vPcJiaJieReportIndexList.add(vPcJiaJieReportIndex);
			}
		}		
		//电源建设规模和新增生产能力月报
		List<VPcTzglDyreport2M>vPcTzglDyreport2MList=pcBidDAO.findByWhere(VPcTzglDyreport2M.class.getName(), "pid='"+pid+"' and (substr(sjType,5,2)='"+curMonthStr+"' or substr(sjType,5,2)='"+lastMonthStr+"')");
		if(vPcTzglDyreport2MList!=null&&vPcTzglDyreport2MList.size()>0){
			VPcJiaJieReportIndex vPcJiaJieReportIndex=null;
			for(int i=0;i<vPcTzglDyreport2MList.size();i++){
				vPcJiaJieReportIndex=new VPcJiaJieReportIndex();
				VPcTzglDyreport2M vPcTzglDyreport2M=vPcTzglDyreport2MList.get(i);
				vPcJiaJieReportIndex.setPeriod(vPcTzglDyreport2M.getSjType());
				vPcJiaJieReportIndex.setReportName(vPcTzglDyreport2M.getTitle());
				vPcJiaJieReportIndex.setReportPerson(vPcTzglDyreport2M.getUserId());
				vPcJiaJieReportIndex.setReportTime(vPcTzglDyreport2M.getCreateDate());
				vPcJiaJieReportIndex.setType("VPcTzglDyreport2M");
				vPcJiaJieReportIndex.setPid(pid);
				vPcJiaJieReportIndex.setUids(vPcTzglDyreport2M.getUids());
				vPcJiaJieReportIndex.setState(vPcTzglDyreport2M.getState());	
				vPcJiaJieReportIndexList.add(vPcJiaJieReportIndex);
			}
		}			
		// 电源固定资产本年资金到位情况
		List<VPcTzglDyreport3M>VPcTzglDyreport3MList=pcBidDAO.findByWhere(VPcTzglDyreport3M.class.getName(), "pid='"+pid+"' and (substr(sjType,5,2)='"+curMonthStr+"' or substr(sjType,5,2)='"+lastMonthStr+"')");
		if(VPcTzglDyreport3MList!=null&&VPcTzglDyreport3MList.size()>0){
			VPcJiaJieReportIndex vPcJiaJieReportIndex=null;
			for(int i=0;i<VPcTzglDyreport3MList.size();i++){
				vPcJiaJieReportIndex=new VPcJiaJieReportIndex();
				VPcTzglDyreport3M vPcTzglDyreport3M=VPcTzglDyreport3MList.get(i);
				vPcJiaJieReportIndex.setPeriod(vPcTzglDyreport3M.getSjType());
				vPcJiaJieReportIndex.setReportName(vPcTzglDyreport3M.getTitle());
				vPcJiaJieReportIndex.setReportPerson(vPcTzglDyreport3M.getUserId());
				vPcJiaJieReportIndex.setReportTime(vPcTzglDyreport3M.getCreateDate());
				vPcJiaJieReportIndex.setType("VPcTzglDyreport3M");
				vPcJiaJieReportIndex.setPid(pid);
				vPcJiaJieReportIndex.setUids(vPcTzglDyreport3M.getUids());
				vPcJiaJieReportIndex.setState(vPcTzglDyreport3M.getState());
				vPcJiaJieReportIndexList.add(vPcJiaJieReportIndex);
			}
		}		
		
		// 招标（合同）月度报表
		
		List<VPcBidSupervisereportM>vPcBidSupervisereportMList=pcBidDAO.findByWhere(VPcBidSupervisereportM.class.getName(), "pid='"+pid+"' and (substr(sjType,5,2)='"+curMonthStr+"' or substr(sjType,5,2)='"+lastMonthStr+"')");
		if(vPcBidSupervisereportMList!=null&&vPcBidSupervisereportMList.size()>0){
			VPcJiaJieReportIndex vPcJiaJieReportIndex=null;
			for(int i=0;i<vPcBidSupervisereportMList.size();i++){
				vPcJiaJieReportIndex=new VPcJiaJieReportIndex();
				VPcBidSupervisereportM vPcBidSupervisereportM=vPcBidSupervisereportMList.get(i);
				vPcJiaJieReportIndex.setPeriod(vPcBidSupervisereportM.getSjType());
				vPcJiaJieReportIndex.setReportName(vPcBidSupervisereportM.getTitle());
				vPcJiaJieReportIndex.setReportPerson(vPcBidSupervisereportM.getUserId());
				vPcJiaJieReportIndex.setReportTime(vPcBidSupervisereportM.getCreateDate());
				vPcJiaJieReportIndex.setType("VPcBidSupervisereportM");
				vPcJiaJieReportIndex.setPid(pid);
				vPcJiaJieReportIndex.setUids(vPcBidSupervisereportM.getUids());
				vPcJiaJieReportIndex.setState(vPcBidSupervisereportM.getState());	
				vPcJiaJieReportIndexList.add(vPcJiaJieReportIndex);
			}
		}			
		return vPcJiaJieReportIndexList;
	}
	/**
	 * 根据招标公告选择招标内容进行保存
	 * @param pid		项目单位ID
	 * @param noticeUids	公告主键
	 * @param contentUidsArray	招标内容数组
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-13
	 */	
	public String[] saveContentByNotice(String currentPid,String noticeUids,String contentUidsArray[]){
		String array[]=null;
		try {
			JdbcUtil.execute("delete from pc_bid_notice_content where pid='"+currentPid+"' and noticeuids='"+noticeUids+"'");
			if(contentUidsArray!=null&&contentUidsArray.length>0){
				array=new String[contentUidsArray.length];
				for(int i=0;i<contentUidsArray.length;i++){				
					PcBidNoticeContent pcBidNoticeContent=new PcBidNoticeContent();
					pcBidNoticeContent.setPid(currentPid);
					pcBidNoticeContent.setContentuids(contentUidsArray[i]);
					pcBidNoticeContent.setNoticeuids(noticeUids);
					String uids=pcBidDAO.insert(pcBidNoticeContent);	
					array[i]=uids;
				}
			}
		} catch (RuntimeException e) {
		}
		return array;
	}
	/**
	 * 根据招标内容得到开标信息
	 * @param pid		项目单位ID
	 * @param bidContentId	招标内容
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-9-6
	 */	
	public List<PcBidOpenBidding> getVeryfiedUnits(String bidContentId,String pid) {
		String whereStr = String.format("contentUids = '%s' and pid = '%s'", bidContentId, pid);
		List<PcBidOpenBidding> veryfiedUnitList = pcBidDAO.findByWhere(PcBidOpenBidding.class.getName(), whereStr, "uids");
		return veryfiedUnitList;
	}	
	/**
	 * 根据招标类型得到所有招标内容
	 * @param pid		项目单位ID
	 * @author: shangtw
	 * @createDate: 2012-9-19
	 */	
	public int  getContentBidCountByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway) {
		int count=0;
		String sql = "";
		String bw = "";
		if((!"".equals(bidway))&&bidway!=null){
			sql = "select t.property_code from PROPERTY_CODE t where t.property_name = '"+bidway+"'";
			List<Map<String, Object>> wayList = JdbcUtil.query(sql);
			for(Map<String, Object> wayMap:wayList){
				bw = wayMap.get("property_code").toString();
			}
		}
		//String sql1="select pbc.uids,pbc.contentes,pbz.zb_type,pbz.uids as zbuids from pc_bid_zb_content pbc,pc_bid_zb_apply pbz where pbc.pid='"+pid+"' and pbz.pid='"+pid+"' and pbc.zb_uids=pbz.uids order by pbz.zb_type";//查询招标类型招标内容
		String sql1 = "select pbc.uids,pbc.contentes,pbz.zb_type,pbz.uids as zbuids from " +
						" pc_bid_zb_content pbc,pc_bid_zb_apply pbz,V_CON V,pc_bid_issue_win_doc pw,pc_bid_tb_unit_info pu," +
						" pc_bid_progress pp " +
						" where pbc.pid='"+pid+"' " +
							"and pbz.pid='"+pid+"' " +
							"and pbc.zb_uids=pbz.uids " +
							"and pw.pid = '"+pid+"' " +
							"and pu.pid='"+pid+"' " +
							"and pp.pid='"+pid+"' " +
							"and pw.content_uids = pbc.uids " +
							"and pu.uids = pw.tb_unit " +"and " +
							"pu.content_uids = pbc.uids "+
							"and pp.content_uids = pbc.uids " +
							"and pp.progress_type='BidAssess' "+
							" AND V.BIDTYPE(+)= PBC.UIDS " ;
		if((!"".equals(zbType))&&zbType!=null && (!"-1".equals(zbType))){
			//sql1="select pbc.uids,pbc.contentes,pbz.zb_type,pbz.uids as zbuids from pc_bid_zb_content pbc,pc_bid_zb_apply pbz where pbc.pid='"+pid+"' and pbz.pid='"+pid+"' and pbc.zb_uids=pbz.uids and pbz.zb_type='"+zbType+"' order by pbz.zb_type";//查询招标类型招标内容	
			sql1 +=" and pbz.zb_type='"+zbType+"'";
		}
		if((!"".equals(isBid)) && isBid !=null && (!"-1".equals(isBid))){
			sql1 +=" and v.is_bid = '"+isBid+"'";
		}
		if((!"".equals(tbunit))&&tbunit!=null){
			sql1 +=" and pu.tb_unit like '%"+tbunit+"%'";
		}
		if((!"".equals(bidstarttime))&&bidstarttime!=null){
			sql1 +=" and pp.start_date=TO_DATE('"+bidstarttime+"','yyyy-mm-dd')";
		}
		if((!"".equals(bidcontent))&&bidcontent !=null){
			sql1 +=" and pbc.contentes like '%"+bidcontent+"%'";
		}
		if((!"".equals(bw))&&bw !=null){
			sql1 +=" and pp.pb_ways = '"+bw+"'";
		}
		List<Map<String, Object>> resultList1 = JdbcUtil.query(sql1);
		if(resultList1.size()>0){
			count=resultList1.size();
		}
		return count;
	}	
	/**
	 * 根据招标类型得到所有招标合同价格 
	 * @param pid		项目单位ID
	 * @author: shangtw
	 * @createDate: 2012-9-19
	 */	
	public Double  getContentConMoneyByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway) {
	   Double convaluemoney=0.0;  
	   String sql = "";
		String bw = "";
		if((!"".equals(bidway))&&bidway!=null){
			sql = "select t.property_code from PROPERTY_CODE t where t.property_name = '"+bidway+"'";
			List<Map<String, Object>> wayList = JdbcUtil.query(sql);
			for(Map<String, Object> wayMap:wayList){
				bw = wayMap.get("property_code").toString();
			}
		}
		String sql1=" select round(sum(conmoney)/10000) as conmoney,count(conid) as conidcount " +
						"from v_con v,pc_bid_zb_content pb,pc_bid_zb_apply pz,pc_bid_issue_win_doc pw,pc_bid_tb_unit_info pu, " +
						" pc_bid_progress pp " +
							"where v.pid='"+pid+"' " +
							"and bidtype in(select pbc.uids from pc_bid_zb_content pbc,pc_bid_zb_apply pbz where pbc.pid='"+pid+"' " +
								"and pbz.pid='"+pid+"' " +
								"and pbc.zb_uids=pbz.uids) " +
							"and pb.pid='"+pid+"' " +
							"and pz.pid='"+pid+"' " +
							"and pb.zb_uids=pz.uids " +
							"and pw.pid = '"+pid+"' " +
							"and pu.pid='"+pid+"' " +
							"and pp.pid='"+pid+"' " +
							"and pw.content_uids = pb.uids " +
							"and pu.uids = pw.tb_unit " +"and " +
							"pu.content_uids = pb.uids "+
							"and pp.content_uids = pb.uids " +
							"and pp.progress_type='BidAssess' "+
							" AND V.BIDTYPE(+)= PB.UIDS ";
		if((!"".equals(zbType))&&zbType!=null&&(!"-1".equals(zbType))){
			sql1=" select round(sum(conmoney)/10000) as conmoney,count(conid) as conidcount " +
					"from v_con v ,pc_bid_zb_content pb,pc_bid_zb_apply pz,pc_bid_issue_win_doc pw,pc_bid_tb_unit_info pu, " +
					" pc_bid_progress pp " +
						"where v.pid='"+pid+"' " +
							"and bidtype " +
								"in(select pbc.uids from pc_bid_zb_content pbc,pc_bid_zb_apply pbz " +
									"where pbc.pid='"+pid+"' " +
										"and pbz.pid='"+pid+"' " +
										"and pbc.zb_uids=pbz.uids " +
										"and pbz.zb_type='"+zbType+"')" +
							"and pb.pid='"+pid+"' " +
							"and pz.pid='"+pid+"' " +
							"and pb.zb_uids=pz.uids " +
							"and pw.pid = '"+pid+"' " +
							"and pu.pid='"+pid+"' " +
							"and pp.pid='"+pid+"' " +
							"and pw.content_uids = pb.uids " +
							"and pu.uids = pw.tb_unit " +"and " +
							"pu.content_uids = pb.uids "+
							"and pp.content_uids = pb.uids " +
							"and pp.progress_type='BidAssess' "+
							" AND V.BIDTYPE(+)= PB.UIDS ";				
			//sql1 +=" and pbz.zb_type='"+zbType+"'";
		}
		if((!"".equals(isBid))&&isBid!=null&&(!"-1".equals(isBid))){
			sql1 +=" and v.is_bid='"+isBid+"'";
		}
		if((!"".equals(tbunit))&&tbunit!=null){
			sql1 +=" and pu.tb_unit like '%"+tbunit+"%'";
		}
		if((!"".equals(bidstarttime))&&bidstarttime!=null){
			sql1 +=" and pp.start_date=TO_DATE('"+bidstarttime+"','yyyy-mm-dd')";
		}
		if((!"".equals(bidcontent))&&bidcontent !=null){
			sql1 +=" and pb.contentes like '%"+bidcontent+"%'";
		}
		if((!"".equals(bw))&&bw !=null){
			sql1 +=" and pp.pb_ways = '"+bw+"'";
		}
		List<Map<String, Object>> resultList1 = JdbcUtil.query(sql1);
		if(resultList1.size()>0){
			for (Map<String, Object> map : resultList1) {	
				Object o=map.get("conmoney");
				if(o!=null){
					String conM=o.toString();
					convaluemoney=Double.valueOf(conM);
				}
			}				
		}
		return convaluemoney;
	}
	/**
	 * 根据招标类型得到所有中标价格 
	 * @param pid		项目单位ID
	 * @author: shuz
	 * @createDate: 2012-9-19
	 */	
	public Double  getContentBidPriceByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway) {
	   Double bidPrice=0.0; 
	   String sql = "";
		String bw = "";
		if((!"".equals(bidway))&&bidway!=null){
			sql = "select t.property_code from PROPERTY_CODE t where t.property_name = '"+bidway+"'";
			List<Map<String, Object>> wayList = JdbcUtil.query(sql);
			for(Map<String, Object> wayMap:wayList){
				bw = wayMap.get("property_code").toString();
			}
		}
		String sql1="select sum(p.tb_price)  as bidPrice " +
					"from pc_bid_issue_win_doc p,pc_bid_zb_content pbc,pc_bid_zb_apply pbz,v_con v,pc_bid_tb_unit_info pu, " +
					" pc_bid_progress pp " +
						"where p.pid = '"+pid+"' and pbc.pid = '"+pid+"' " +
							"and pbc.uids in p.content_uids " +
							"and pbc.zb_uids = pbz.uids " +
							"and p.pid = '"+pid+"' " +
							"and pu.pid='"+pid+"' " +
							"and pp.pid='"+pid+"' " +
							"and pu.uids = p.tb_unit " +
							"and pu.content_uids = pbc.uids " +
							"and pp.content_uids = pbc.uids " +
							"and pp.progress_type='BidAssess' "+
							"AND V.BIDTYPE(+)= PBC.UIDS ";
		if((!"".equals(zbType))&&zbType!=null&&(!"-1".equals(zbType))){
//			sql1="select sum(p.tb_price) as bidPrice " +
//					"from pc_bid_issue_win_doc p,pc_bid_zb_content pbc,pc_bid_zb_apply pbz " +
//						"where p.pid = '"+pid+"' and pbc.pid = '"+pid+"' " +
//							"and pbc.uids in p.content_uids " +
//							"and pbz.zb_type = '"+zbType+"' " +
//							"and pbc.zb_uids = pbz.uids";
			sql1 +=" and pbz.zb_type = '"+zbType+"'";
		}
		if((!"".equals(isBid))&&isBid!=null&&(!"-1".equals(isBid))){
			sql1 +=" and v.is_bid='"+isBid+"'";
		}
		if((!"".equals(tbunit))&&tbunit!=null){
			sql1 +=" and pu.tb_unit like '%"+tbunit+"%'";
		}
		if((!"".equals(bidstarttime))&&bidstarttime!=null){
			sql1 +=" and pp.start_date=TO_DATE('"+bidstarttime+"','yyyy-mm-dd')";
		}
		if((!"".equals(bidcontent))&&bidcontent !=null){
			sql1 +=" and pbc.contentes like '%"+bidcontent+"%'";
		}
		if((!"".equals(bw))&&bw !=null){
			sql1 +=" and pp.pb_ways = '"+bw+"'";
		}
		List<Map<String, Object>> resultList1 = JdbcUtil.query(sql1);
		if(resultList1.size()>0){
			for (Map<String, Object> map : resultList1) {	
				Object o=map.get("bidPrice");
				if(o!=null){
					String bidP=o.toString();
					bidPrice=Double.valueOf(bidP);
				}
			}				
		}
		return bidPrice;
	}
	/**
	 * 根据招标类型得到所有概算金额 
	 * @param pid		项目单位ID
	 * @author: shuz
	 * @createDate: 2014-7-15
	 */	
	public Double getContentBdgMoneyByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway) {
	   Double bdgMoney=0.0; 
	   String sql = "";
		String bw = "";
		if((!"".equals(bidway))&&bidway!=null){
			sql = "select t.property_code from PROPERTY_CODE t where t.property_name = '"+bidway+"'";
			List<Map<String, Object>> wayList = JdbcUtil.query(sql);
			for(Map<String, Object> wayMap:wayList){
				bw = wayMap.get("property_code").toString();
			}
		}
		String sql1="select sum(pbc.bdg_money)  as bdg_money " +
					"from pc_bid_issue_win_doc p,pc_bid_zb_content pbc,pc_bid_zb_apply pbz,v_con v,pc_bid_tb_unit_info pu, " +
					" pc_bid_progress pp " +
						"where p.pid = '"+pid+"' and pbc.pid = '"+pid+"' " +
							"and pbc.uids in p.content_uids " +
							"and pbc.zb_uids = pbz.uids " +
							"and p.pid = '"+pid+"' " +
							"and pu.pid='"+pid+"' " +
							"and pp.pid='"+pid+"' " +
							"and pu.uids = p.tb_unit " +
							"and pu.content_uids = pbc.uids " +
							"and pp.content_uids = pbc.uids " +
							"and pp.progress_type='BidAssess' "+
							"AND V.BIDTYPE(+)= PBC.UIDS ";
		if((!"".equals(zbType))&&zbType!=null&&(!"-1".equals(zbType))){
//			sql1="select sum(p.tb_price) as bidPrice " +
//					"from pc_bid_issue_win_doc p,pc_bid_zb_content pbc,pc_bid_zb_apply pbz " +
//						"where p.pid = '"+pid+"' and pbc.pid = '"+pid+"' " +
//							"and pbc.uids in p.content_uids " +
//							"and pbz.zb_type = '"+zbType+"' " +
//							"and pbc.zb_uids = pbz.uids";
			sql1 +=" and pbz.zb_type = '"+zbType+"'";
		}
		if((!"".equals(isBid))&&isBid!=null&&(!"-1".equals(isBid))){
			sql1 +=" and v.is_bid='"+isBid+"'";
		}
		if((!"".equals(tbunit))&&tbunit!=null){
			sql1 +=" and pu.tb_unit like '%"+tbunit+"%'";
		}
		if((!"".equals(bidstarttime))&&bidstarttime!=null){
			sql1 +=" and pp.start_date=TO_DATE('"+bidstarttime+"','yyyy-mm-dd')";
		}
		if((!"".equals(bidcontent))&&bidcontent !=null){
			sql1 +=" and pbc.contentes like '%"+bidcontent+"%'";
		}
		if((!"".equals(bw))&&bw !=null){
			sql1 +=" and pp.pb_ways = '"+bw+"'";
		}
		List<Map<String, Object>> resultList1 = JdbcUtil.query(sql1);
		if(resultList1.size()>0){
			for (Map<String, Object> map : resultList1) {	
				Object o=map.get("bdg_money");
				if(o!=null){
					String bidP=o.toString();
					bdgMoney=Double.valueOf(bidP);
				}
			}				
		}
		return bdgMoney;
	}
	/**
	 * 获取招投标模块文件移交资料室的grid 的数据
	 * @param type
	 * @param fileId
	 * @param fileTypes
	 * @param yjrId
	 * @return
	 */
	public String getJsonStrForTransToZLSByType(String type,String fileIds, String fileTypes, String yjrName) {
		String fileIdSqlStr = StringUtil.transStrToIn(fileIds, ",");
		List<SgccAttachList> list = this.pcBidDAO.findByWhere(SgccAttachList.class.getName(), "TRANSACTION_ID in (" + fileIdSqlStr
						+ ") and TRANSACTION_TYPE in ("
						+ StringUtil.transStrToIn(fileTypes, ",") + ") ");

		// 所有主文件列表
		Map<String, String> mainFileNameMap = new HashMap<String, String>();
		Map<String, String> zlTitleMap = new HashMap<String, String>();
		String inWhereStr = "UIDS in (" + fileIdSqlStr + ")";
		if("PcBidZbApply".equals(type)){
			List<PcBidZbApply>mainFile=this.pcBidDAO.findByWhere(PcBidZbApply.class.getName(), inWhereStr);
			for (PcBidZbApply pcBidZbApply : mainFile) {
				mainFileNameMap.put(pcBidZbApply.getUids(), pcBidZbApply.getZbName());
				zlTitleMap.put(pcBidZbApply.getUids(), pcBidZbApply.getZbName()+"-"+"申请报告");				
			}
		}
		else if("PcBidZbAgency".equals(type)){
			List<PcBidZbAgency>mainFile=this.pcBidDAO.findByWhere(PcBidZbAgency.class.getName(), inWhereStr);
			for (PcBidZbAgency pcBidZbAgency : mainFile) {
				mainFileNameMap.put(pcBidZbAgency.getUids(), pcBidZbAgency.getAgencyName());
				zlTitleMap.put(pcBidZbAgency.getUids(), pcBidZbAgency.getAgencyName()+"-"+"招标代理机构文件");				
			}
		}			
		else if("PcBidPublishNotice".equals(type)){
			List<PcBidPublishNotice>mainFile=this.pcBidDAO.findByWhere(PcBidPublishNotice.class.getName(), inWhereStr);
			for (PcBidPublishNotice pcBidPublishNotice : mainFile) {
				mainFileNameMap.put(pcBidPublishNotice.getUids(), pcBidPublishNotice.getPubTitle());
				zlTitleMap.put(pcBidPublishNotice.getUids(),pcBidPublishNotice.getPubTitle()+"-"+"招标公告文件资料");				
			}
		}
		else if("PcBidTbUnitInfo".equals(type)){
			List<PcBidTbUnitInfo>mainFile=this.pcBidDAO.findByWhere(PcBidTbUnitInfo.class.getName(), inWhereStr);
			for (PcBidTbUnitInfo pcBidTbUnitInfo : mainFile) {
				mainFileNameMap.put(pcBidTbUnitInfo.getUids(), pcBidTbUnitInfo.getMemo());
				String bidContentStr = "";
				PcBidZbContent bidZbContent = (PcBidZbContent) this.pcBidDAO.findById(PcBidZbContent.class.getName(), pcBidTbUnitInfo.getContentUids());
				bidContentStr = bidZbContent.getContentes();
				String bidUnitName = "";
				bidUnitName = pcBidTbUnitInfo.getTbUnit();
				zlTitleMap.put(pcBidTbUnitInfo.getUids(), bidContentStr+"-"+bidUnitName+"预审资料");				
			}
		}
		else if("PcBidAcceptTbdocAndBond".equals(type)){
			List<PcBidAcceptTbdocAndBond>mainFile=this.pcBidDAO.findByWhere(PcBidAcceptTbdocAndBond.class.getName(),
					"UIDS in (" + fileIdSqlStr + ")");
			for (PcBidAcceptTbdocAndBond pcBidAcceptTbdocAndBond : mainFile) {
				mainFileNameMap.put(pcBidAcceptTbdocAndBond.getUids(), pcBidAcceptTbdocAndBond.getMemo());
				String bidContentStr = "";
				PcBidZbContent bidZbContent = (PcBidZbContent) this.pcBidDAO.findById(PcBidZbContent.class.getName(), pcBidAcceptTbdocAndBond.getContentUids());
				bidContentStr = bidZbContent.getContentes();
				String bidUnitName = "";
				PcBidTbUnitInfo bidTbUnitInfo = (PcBidTbUnitInfo) this.pcBidDAO.findById(PcBidTbUnitInfo.class.getName(), pcBidAcceptTbdocAndBond.getTbUnit());
				bidUnitName = bidTbUnitInfo.getTbUnit();
				zlTitleMap.put(pcBidAcceptTbdocAndBond.getUids(), bidContentStr+"-"+bidUnitName+"投标文件");
			}
		}
		else if("PcBidOpenBidding".equals(type)){
			List<PcBidOpenBidding>mainFile=this.pcBidDAO.findByWhere(PcBidOpenBidding.class.getName(), inWhereStr);
			for (PcBidOpenBidding pcBidOpenBidding : mainFile) {
				mainFileNameMap.put(pcBidOpenBidding.getUids(), pcBidOpenBidding.getMemo());
				String bidContentStr = "";
				PcBidZbContent bidZbContent = (PcBidZbContent) this.pcBidDAO.findById(PcBidZbContent.class.getName(), pcBidOpenBidding.getContentUids());
				bidContentStr = bidZbContent.getContentes();
				String bidUnitName = "";
				PcBidTbUnitInfo bidTbUnitInfo = (PcBidTbUnitInfo) this.pcBidDAO.findById(PcBidTbUnitInfo.class.getName(), pcBidOpenBidding.getTbUnit());
				bidUnitName = bidTbUnitInfo.getTbUnit();
				zlTitleMap.put(pcBidOpenBidding.getUids(), bidContentStr+"-"+bidUnitName+"其他资料");				
			}
		}
		else if("PcBidJudgeBidding".equals(type)){
			List<PcBidJudgeBidding>mainFile=this.pcBidDAO.findByWhere(PcBidJudgeBidding.class.getName(), inWhereStr);
			for (PcBidJudgeBidding pcBidJudgeBidding : mainFile) {
				mainFileNameMap.put(pcBidJudgeBidding.getUids(), pcBidJudgeBidding.getMemo());
				String bidContentStr = "";
				PcBidZbContent bidZbContent = (PcBidZbContent) this.pcBidDAO.findById(PcBidZbContent.class.getName(), pcBidJudgeBidding.getContentUids());
				bidContentStr = bidZbContent.getContentes();
				String bidUnitName = "";
				PcBidTbUnitInfo bidTbUnitInfo = (PcBidTbUnitInfo) this.pcBidDAO.findById(PcBidTbUnitInfo.class.getName(), pcBidJudgeBidding.getTbUnit());
				bidUnitName = bidTbUnitInfo.getTbUnit();
				zlTitleMap.put(pcBidJudgeBidding.getUids(), bidContentStr+"-"+bidUnitName+"澄清文件");
			}
		}
		else if("PcBidIssueWinDoc".equals(type)){
			List<PcBidIssueWinDoc>mainFile=this.pcBidDAO.findByWhere(PcBidIssueWinDoc.class.getName(), inWhereStr);
			for (PcBidIssueWinDoc pcBidIssueWinDoc : mainFile) {
				mainFileNameMap.put(pcBidIssueWinDoc.getUids(), pcBidIssueWinDoc.getMemo());
				String bidContentStr = "";
				PcBidZbContent bidZbContent = (PcBidZbContent) this.pcBidDAO.findById(PcBidZbContent.class.getName(), pcBidIssueWinDoc.getContentUids());
				bidContentStr = bidZbContent.getContentes();
				String bidUnitName = "";
				PcBidTbUnitInfo bidTbUnitInfo = (PcBidTbUnitInfo) this.pcBidDAO.findById(PcBidTbUnitInfo.class.getName(), pcBidIssueWinDoc.getTbUnit());
				bidUnitName = bidTbUnitInfo.getTbUnit();
				zlTitleMap.put(pcBidIssueWinDoc.getUids(), bidContentStr+"-"+bidUnitName+"中标通知书");
			}
		}
		else if("PcBidProgress".equals(type)||"PcBidSendZbdoc".equals(type)){
			List<PcBidProgress>mainFile=this.pcBidDAO.findByWhere(PcBidProgress.class.getName(), inWhereStr);
			for (PcBidProgress pcBidProgress : mainFile) {
				mainFileNameMap.put(pcBidProgress.getUids(), pcBidProgress.getMemo());
				
				String bidContentStr = "";
				PcBidZbContent bidZbContent = (PcBidZbContent) this.pcBidDAO.findById(PcBidZbContent.class.getName(), pcBidProgress.getContentUids());
				bidContentStr = bidZbContent.getContentes();
				zlTitleMap.put(pcBidProgress.getUids(), bidContentStr+"招标文件");
			}
		}		

		StringBuffer rtnStrBuf = new StringBuffer("[");
		for (int i = 0; i < list.size(); i++) {
			SgccAttachList sgccAttachList = (SgccAttachList) list.get(i);
			List<ZlInfoBlobList> zlList1 = this.pcBidDAO.findWhereOrderBy(
					ZlInfoBlobList.class.getName(), "filelsh = '" + sgccAttachList.getFileLsh() + "'", null);
			rtnStrBuf.append("{");

			PropertyCodeDAO propertyDAO = PropertyCodeDAO.getInstence();
			String fileTypeName = propertyDAO.getCodeNameByPropertyName(
					sgccAttachList.getTransactionType(), "文件类型");
			fileTypeName = fileTypeName == null ? "" : fileTypeName;
			rtnStrBuf.append("fileType:'" + sgccAttachList.getTransactionType() + "',");
			rtnStrBuf.append("fileTypeName:'" + fileTypeName + "',");
			rtnStrBuf.append("fileId:'"	+ sgccAttachList.getId().getTransactionId() + "',");
			rtnStrBuf.append("mainFileName:'"  + mainFileNameMap.get(sgccAttachList.getId().getTransactionId()) + "',");
			rtnStrBuf.append("zlTitle:'"  + zlTitleMap.get(sgccAttachList.getId().getTransactionId()) + "',");
			rtnStrBuf.append("fileLsh:'" + sgccAttachList.getFileLsh() + "',");
			rtnStrBuf.append("fileName:'" + sgccAttachList.getFileName() + "',");
			if (zlList1.size() == 1) {
				ZlInfo zlInfo = (ZlInfo) this.pcBidDAO.findById(ZlInfo.class.getName(), zlList1.get(0).getInfoid());
				String yjr = zlInfo.getYjr();
				List<ZlTree> zlTreeList = this.pcBidDAO.findByWhere(
						"com.sgepit.pmis.document.hbm.ZlTree", "indexId = '"
								+ zlInfo.getIndexid() + "'");
				ZlTree zlTree = zlTreeList.size() == 1 ? zlTreeList.get(0) : null;
				String yjStr = "";
				if (yjr != null) {
					if (yjr.equals(yjrName)) {
						yjStr = "已被 【我】 移交到 【" + zlTree.getMc() + "】 分类下";
					} else {
						yjStr = "已被 【" + yjr + "】 移交到 【" + zlTree.getMc() + "】 分类下";
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
		if (rtnStrBuf.lastIndexOf(",") == rtnStrBuf.length() - 1){
			rtnStrBuf.deleteCharAt(rtnStrBuf.length() - 1);
		}
		rtnStrBuf.append("]");
		return rtnStrBuf.toString();
	}	
	/**
	 * 招投标模块文件移交资料室
	 * @param pid	
	 * @param userdeptid
	 * @param username
	 * @param type			招标文件类型
	 * @param fileLshs		移交的文件流水号
	 * @param fileNames		移交的文件名称
	 * @param fileIds		移交业务主记录ID
	 * @param zlSortId		移交分类
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-10-16
	 */
	public boolean transToZLSByType(String pid, String userdeptid, String username, String type, String fileLshs, 
			String fileNames, String fileIds, String zlSortId) {

		try {
			String tableName = "";
			if("PcBidZbApply".equals(type)){
				tableName = "PC_BID_ZB_APPLY";
			}
			else if("PcBidZbAgency".equals(type)){
				tableName = "PC_BID_ZB_AGENCY";
			}	
			else if("PcBidPublishNotice".equals(type)){
				tableName = "PC_BID_PUBLISH_NOTICE";
			}	
			else if("PcBidTbUnitInfo".equals(type)){
				tableName = "PC_BID_TB_UNIT_INFO";
			}	
			else if("PcBidAcceptTbdocAndBond".equals(type)){
				tableName = "PC_BID_ACCEPT_TB_DOC_AND_BOND";
			}		
			else if("PcBidOpenBidding".equals(type)){
				tableName = "PC_BID_OPEN_BIDDING";
			}
			else if("PcBidJudgeBidding".equals(type)){
				tableName = "PC_BID_JUDGE_BIDDING";
			}	
			else if("PcBidIssueWinDoc".equals(type)){
				tableName = "PC_BID_ISSUE_WIN_DOC";
			}
			else if("PcBidProgress".equals(type)){
				tableName = "PC_BID_PROGRESS";
			}

			String zlType = PropertyCodeDAO.getInstence().getCodeValueByPropertyName("招投标文件", "资料类型");
			if (zlType != null) {
				zlType = "4";
			}
			Long zlTypeNum = Long.valueOf(zlType);
			String[] fileLshArr = fileLshs.split(",");
			String[] fileNameArr = fileNames.split(",");
			String[] fileIdArr = fileIds.split(",");
			
			for (int i = 0; i < fileLshArr.length; i++) {
				String fileId = fileIdArr[i];
				String tableAndId = tableName+"`" + fileId;
				List<ZlInfo> l = this.pcBidDAO.findByWhere(ZlInfo.class.getName(), "YJ_TABLEANDID='" + tableAndId + "'");

				String fileLsh = fileLshArr[i];
				List<SgccAttachList> list = this.pcBidDAO.findByWhere(SgccAttachList.class.getName(), "file_lsh = '" + fileLsh + "'");
				
				ZlInfo zlinfo = new ZlInfo();
				if (l.size()>0) {
					zlinfo = l.get(0);
				} else {
					zlinfo.setBillstate(new Long(0));
					zlinfo.setIndexid(zlSortId);
					zlinfo.setPid(pid);
					String fileName = fileNameArr[i];
					zlinfo.setMaterialname(fileName);
					zlinfo.setResponpeople(username);
					zlinfo.setYjr(username);
					zlinfo.setStockdate(list.get(0).getUploadDate());
					zlinfo.setOrgid(userdeptid);
					// 资料类型、份数、责任人、单位；默认值分别为：资料，1，用户自己，页
					zlinfo.setWeavecompany(username);
					zlinfo.setBook(3L);
					zlinfo.setZltype(zlTypeNum);
					zlinfo.setPortion(1L);
					zlinfo.setQuantity(1L);
					zlinfo.setRkrq(new Date());
					zlinfo.setYjTableAndId(tableAndId);
					this.pcBidDAO.insert(zlinfo);
				}

				if (list.size() == 1) {
//					增加资料与大对象表的关联信息
					ZlInfoBlobList blobList = new ZlInfoBlobList(zlinfo.getInfoid(), "SGCC_ATTACH_BLOB", fileLsh);
					this.pcBidDAO.insert(blobList);
				}
			}
			return true;
		} catch (Exception ex) {
			return false;
		}
	}
	
	/**
	 * 撤销资料移交
	 * @param fileLsh
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-10-17
	 */
	public boolean cancelTrans(String fileLsh) {
		try {
			List<ZlInfoBlobList> blobLists = this.pcBidDAO.findByWhere(ZlInfoBlobList.class.getName(), "file_lsh='" + fileLsh + "'");
			if (blobLists.size()>0) {
				ZlInfo zlInfo = (ZlInfo) this.pcBidDAO.findById(ZlInfo.class.getName(), blobLists.get(0).getInfoid());
				this.pcBidDAO.deleteAll(blobLists);
				
				if (zlInfo!=null) {
					List<ZlInfoBlobList> blobLists1 = this.pcBidDAO.findByWhere(ZlInfoBlobList.class.getName(), "infoid='" + zlInfo.getInfoid() + "'");
					if (blobLists1.size()==0) {
						this.pcBidDAO.delete(zlInfo);
					}
				}
			}
			return true;
		} catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
	}
	/**
	 * 投标单位预审信息数据导入
	 */
	@Override
	public String importData(Map<String,String> paramMap,
			FileItem fileItem) {
		String rtn = "";
		try {
			Workbook wb = null;
			try {
				// 导入*.xls文件
				InputStream is = fileItem.getInputStream();
				wb = new HSSFWorkbook(is);
				is.close();
			} catch (Exception e) {
				// 导入*.xlsx文件
				InputStream is = fileItem.getInputStream();
				wb = new XSSFWorkbook(is);
				is.close();
			}
			boolean impBool = false;
			if (wb == null) {
				return rtn = "{success:false,msg:[{result:'上传失败,没有Excel文档！'}]}";
			} else {
				Sheet sheet = wb.getSheetAt(0);
				// 判断是否是对于的excel表
				Row row2 = sheet.getRow(1);
				Cell cellA2 = row2.getCell(0);
				//Excel的A2单元格包含“importData”，则为规定的模板
				if (!cellA2.getStringCellValue().equals("importData"))
					return rtn = "{success:false,msg:[{result:'模板上传错误！请下载模板填写好数据再上传！'}]}";
				Row row = null;
				Cell cell = null;
				//一个map为一行数据，map存放列名（excel中第二行隐藏的列名，列名和实体属性名对应）和值
				List<Map<String, String>> list = new ArrayList<Map<String,String>>();
				// 得到excel的总记录条数
				int totalRow = sheet.getLastRowNum();
				Row columnRow = null;// 列配置行，单元格的值与bean的属性对应
				for (int i = 0; i <= totalRow; i++) {
					if (i == 0 || i == 1 || i == 2) {
						if (i == 1)	columnRow = sheet.getRow(i);
						continue;
					}else{
						row = sheet.getRow(i);
						Map<String, String> map = new HashMap<String, String>();
						for (int j = 0; j < columnRow.getPhysicalNumberOfCells(); j++) {
							if (j == 0){
								continue;
							}else{
								String cellValue = null;
								cell = row.getCell(j);
								if (cell != null) {
									cell.setCellType(1);
									cellValue = cell.getStringCellValue();
								}
								//为null转为空字符串存放，避免后面对null进行toString()操作
								map.put(columnRow.getCell(j).getStringCellValue(),
										cellValue==null?"":cellValue);
							}
						}
						list.add(map);
					}
				}
				impBool=importDataByExcel(paramMap,list);
				if(impBool)
					return rtn = "{success:true,msg:[{result:'上传成功！'}]}";
				else
					return rtn = "{success:false,msg:[{result:'上传失败'}]}";
			}
		} catch (Exception e) {
			e.printStackTrace();
			return rtn = "{success:false,msg:[{result:'上传失败'}]}";
		}
	}
	public boolean importDataByExcel(Map<String,String> paramMap, List<Map<String, String>> list){
		try {
			for (int i = 0; i < list.size(); i++) {
				Map<String, String> map = list.get(i);
				// 新增数据生成主键
				PcBidTbUnitInfo tbUnitInfo=new PcBidTbUnitInfo();
				tbUnitInfo.setPid(paramMap.get("pid"));
				tbUnitInfo.setContentUids(paramMap.get("masterId"));
				tbUnitInfo.setRateStatus(0d);
				tbUnitInfo.setTbUnit(map.get("tbUnit"));
				if("通过".equals(map.get("preHearResult"))){
					tbUnitInfo.setPreHearResult("1");
				}else{
					tbUnitInfo.setPreHearResult("0");
				}
				tbUnitInfo.setContactPerson(map.get("contactPerson"));
				tbUnitInfo.setContactPhone(map.get("contactPhone"));
				tbUnitInfo.setContactMail(map.get("contactMail"));
				tbUnitInfo.setMemo(map.get("memo"));
				this.pcBidDAO.insert(tbUnitInfo);
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * 招标项目及内容信息树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 */
	public List<ColumnTreeNode> getPcBidZbApplyTree(String orderBy,
			Integer start, Integer limit, HashMap map) {
		List<PcBidZbApplyTreeView> list = new ArrayList();
		// 页面定义处的参数
		String pid = (String) map.get("pid");
		String parentid = (String) map.get("parentid");
		
		// 拼装一般查询语句
		list = pcBidDAO.findByWhere(PcBidZbApplyTreeView.class.getName(),
				"pid = '" + pid + "' and parentid='" + parentid + "'", "treeid");
		
		List newList = DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}

}