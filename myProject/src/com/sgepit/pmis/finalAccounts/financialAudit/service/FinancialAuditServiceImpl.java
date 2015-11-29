package com.sgepit.pmis.finalAccounts.financialAudit.service;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.finalAccounts.basicData.hbm.FAAssetsSortHBM;
import com.sgepit.pmis.finalAccounts.financialAudit.dao.FaAuditMasterDAO;
import com.sgepit.pmis.finalAccounts.financialAudit.dao.FaBuildingAuditReportDAO;
import com.sgepit.pmis.finalAccounts.financialAudit.dao.FaEquAuditReportDAO;
import com.sgepit.pmis.finalAccounts.financialAudit.dao.FaMatAuditReportDAO;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FAAssetsSort;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaAssetsView;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaAuditMaster;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaAuditReport;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaBuildingAuditReport;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaEquAuditReport;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaMatAuditReport;
import com.sgepit.pmis.finalAccounts.interfaces.EquFaFacade;
import com.sgepit.pmis.finalAccounts.interfaces.MatFaFacade;
import com.sgepit.pmis.finalAccounts.interfaces.vo.BuildingBdgDetailVO;
import com.sgepit.pmis.finalAccounts.interfaces.vo.EquStockOutDetailVO;
import com.sgepit.pmis.finalAccounts.interfaces.vo.MatStockOutDetailVO;

/**
 * @author Ivy
 * @createDate 2011-3-10
 * 
 */
public class FinancialAuditServiceImpl extends BaseMgmImpl implements FinancialAuditService {
	private final static String AUDIT_TYPE_MAT = "MAT";
	private final static String AUDIT_TYPE_EQU = "EQU";
	private final static String AUDIT_TYPE_BUILDING = "BUILDING";
	
	public FaAuditMasterDAO faAuditMasterDAO = null;
	
	public FaBuildingAuditReportDAO faBuildingAuditReportDAO = null;
	
	public FaEquAuditReportDAO faEquAuditReportDAO = null;
	
	public FaMatAuditReportDAO faMatAuditReportDAO = null;
	
	public EquFaFacade equStockOutMgm = null;
	
	public MatFaFacade matStockOutMgm = null;
	
	public MatFaFacade matStockOutMgm_guoj = null;
	
	public void setFaAuditMasterDAO(FaAuditMasterDAO faAuditMasterDAO) {
		this.faAuditMasterDAO = faAuditMasterDAO;
	}

	public void setFaBuildingAuditReportDAO(
			FaBuildingAuditReportDAO faBuildingAuditReportDAO) {
		this.faBuildingAuditReportDAO = faBuildingAuditReportDAO;
	}

	public void setMatStockOutMgm_guoj(MatFaFacade matStockOutMgmGJ) {
		matStockOutMgm_guoj = matStockOutMgmGJ;
	}

	public void setFaEquAuditReportDAO(FaEquAuditReportDAO faEquAuditReportDAO) {
		this.faEquAuditReportDAO = faEquAuditReportDAO;
	}

	public void setFaMatAuditReportDAO(FaMatAuditReportDAO faMatAuditReportDAO) {
		this.faMatAuditReportDAO = faMatAuditReportDAO;
	}
	
	public void setEquStockOutMgm(EquFaFacade equStockOutMgm) {
		this.equStockOutMgm = equStockOutMgm;
	}

	public void setMatStockOutMgm(MatFaFacade matStockOutMgm) {
		this.matStockOutMgm = matStockOutMgm;
	}

	//**********************************************************稽核主记录相关
	/**
	 * 新增稽核
	 * @param auditMaster
	 * @param mergeFlag
	 * 			N：表示单独稽核；（mainAuditId为null；mainObjectID为null）
	 *			M：表示合并稽核；（mainAuditId为null，系统自动生成，mainObjectID必须有值，为主设备或主建筑物编号）
	 *			MT：表示合并到稽核（mainAuditId不为null，为稽核到的主设备的稽核系统编号；mainObjectID为null）
	 * @param mainAuditId	当mergeFlag==MT,此字段标识合并到稽核的已稽核的主设备的稽核系统编号；
	 * @param mainObjectID	当mergeFlag==M，此字段标识合并稽核时主设备【出库单号`设备编码】或主建筑物的编号； 
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-9
	 */
	public String auditAdd(FaAuditMaster auditMaster, String mergeFlag, String mainAuditId, String mainObjectID){
		String businessType = auditMaster.getBusinessType();
		String sourceNos = auditMaster.getSourceNos();
		String objectIds = auditMaster.getObjectIDs();
		String mergeAuditNo = this.getNewestAuditNo(businessType, "");	//合并稽核时用到，稽核流水号
		String mergeAuditId = SnUtil.getNewID();	//合并稽核时用到，主设备或主建筑的稽核系统编号
		String mergeToAuditNo = "";
		String mergeMainAuditId = "";
		
		if (mergeFlag.equalsIgnoreCase("MT") && mainAuditId!=null && mainAuditId.length()>0) {
			FaAuditMaster master = (FaAuditMaster) this.faAuditMasterDAO.findById(FaAuditMaster.class.getName(), mainAuditId);
			if (master!=null && master.getAuditNo()!=null) {
				mergeToAuditNo = master.getAuditNo();
			}
		}
		boolean hasSourceNo = businessType.equalsIgnoreCase(AUDIT_TYPE_MAT) || businessType.equalsIgnoreCase(AUDIT_TYPE_EQU);
		
		if (objectIds!=null) {
			String[] objectIdArr = objectIds.split("`"); 
			FaAuditMaster newAuditMaster = null;
			for (int i = 0; i < objectIdArr.length; i++) {
				newAuditMaster = new FaAuditMaster();
				if ((sourceNos!=null&&hasSourceNo) || !hasSourceNo) {
					String[] sourceNoArr = sourceNos==null ? null : sourceNos.split("`");
					if ((hasSourceNo && sourceNoArr!=null && sourceNoArr.length==objectIdArr.length) || (sourceNoArr==null&&!hasSourceNo)) {
						if (hasSourceNo) {
							newAuditMaster.setSourceNo(sourceNoArr[i]);
						}
						newAuditMaster.setBusinessType(businessType);
						newAuditMaster.setObjectId(objectIdArr[i]);
						newAuditMaster.setOperateTime(new Date());
						newAuditMaster.setOperator(auditMaster.getOperator());
						newAuditMaster.setPid(auditMaster.getPid());
						newAuditMaster.setRemark(auditMaster.getRemark());
						if (mergeFlag.equalsIgnoreCase("N")) {	//单独稽核
							newAuditMaster.setAuditNo(this.getNewestAuditNo(businessType, ""));
							newAuditMaster.setState("1");
							newAuditMaster.setUids(SnUtil.getNewID());
						} else if (mergeFlag.equalsIgnoreCase("M")) {	//合并稽核
							newAuditMaster.setAuditNo(mergeAuditNo);
							newAuditMaster.setState("1");
							
							String keyStr = ((sourceNoArr==null&&!hasSourceNo)?"":(sourceNoArr[i]+"`")) + objectIdArr[i];
							if (keyStr.equals(mainObjectID)) {
								newAuditMaster.setUids(mergeAuditId);
							} else {
								newAuditMaster.setUids(SnUtil.getNewID());
								newAuditMaster.setMainId(mergeAuditId);
							}
							mergeMainAuditId = mergeAuditId;
						} else if (mergeFlag.equalsIgnoreCase("MT")) {	//合并到稽核
							newAuditMaster.setAuditNo(mergeToAuditNo);
							newAuditMaster.setState("1");
							newAuditMaster.setMainId(mainAuditId);
							newAuditMaster.setUids(SnUtil.getNewID());
							
							mergeMainAuditId = mainAuditId;
						}
						
						this.faAuditMasterDAO.insert(newAuditMaster);
					} else {
						return "参数错误！";
					}
				} else {
					return "参数错误！";
				}
			}
			
			//稽核信息保存到报表中
			if (businessType.equalsIgnoreCase(AUDIT_TYPE_EQU)) {
				EquStockOutDetailVO[] equStockOutDetailVOArr = auditMaster.getEquStockOutDetailVOArr();
				this.addEquAuditDetail(equStockOutDetailVOArr);
			} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_BUILDING)) {
				BuildingBdgDetailVO[] buildingBdgDetailVOArr = auditMaster.getBuildingBdgDetailVOArr();
				this.addBuildingAuditDetail(buildingBdgDetailVOArr);
			} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_MAT)) {
				MatStockOutDetailVO[] matStockOutDetailVOArr = auditMaster
						.getMatStockOutDetailVOArr();

				this.addMatAuditDetail(matStockOutDetailVOArr);
			}
			
			//合并稽核、合并到稽核时，计算主设备或主建筑的价值、所有附属设备价值；主设备的价值 = 设备自身价值+所有附属设备价值；
			if (mergeMainAuditId!=null && mergeMainAuditId.length()>0) {
				if (businessType.equalsIgnoreCase(AUDIT_TYPE_EQU)) {
					this.calEquAmount(null, newAuditMaster.getPid(), mergeMainAuditId);
				} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_BUILDING)) {
					this.calBuildingAmount(null, newAuditMaster.getPid(), mergeMainAuditId);
				}
			}
			
			return "OK";
		} else {
			return "没有稽核物资";
		}
	}

	/**
	 * 撤销设备稽核：撤销主设备的稽核，以及附属设备的稽核信息，如果已经设置了固定资产分类，清楚固定资产分类的信息；
	 * @param delAuditIds
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-14
	 */
	public String delAuditByIds(String delAuditIds) {
		String auditIdInStr = StringUtil.transStrToIn(delAuditIds, "`");
		List<FaAuditMaster> l = this.faAuditMasterDAO.findByWhere(FaAuditMaster.class.getName(), "uids in (" + auditIdInStr + ")");
		FaAuditMaster master = null;
		for (int i = 0; i < l.size(); i++) {
			master = l.get(i);
			String businessType = master.getBusinessType();
			
			List<FaAuditMaster> l2 = this.faAuditMasterDAO.findByWhere(FaAuditMaster.class.getName(), "main_id = '" + master.getUids() + "'");
			//撤销的是主设备的稽核信息，需要同时撤销附属设备的稽核信息
			if(l2.size()>0){
				for (int j = 0; j < l2.size(); j++) {
					delAuditByIds(l2.get(j).getUids());
				}
			}
			
			String beanName = "";
			String tableName = "";
			if (businessType.equalsIgnoreCase(AUDIT_TYPE_MAT)) {
				beanName = FaMatAuditReport.class.getName();
				tableName = "FA_MAT_AUDIT_REPORT";
			} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_EQU)) {
				beanName = FaEquAuditReport.class.getName();
				tableName = "FA_EQU_AUDIT_REPORT";
			} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_BUILDING)) {
				beanName = FaBuildingAuditReport.class.getName();
				tableName = "FA_BUILDING_AUDIT_REPORT";
			}
			
			Session ses = HibernateSessionFactory.getSession();
			String selSql = "select * from " + tableName + " where audit_id='" + master.getUids() + "'";
			SQLQuery sq00 = ses.createSQLQuery(selSql).addEntity(beanName);
			List<FaAuditReport> l3 = sq00.list();
			String assetsNos = "";
			for (int j = 0; j < l3.size(); j++) {
				assetsNos += "`" + l3.get(j).getAssetsNo();
			}
			Transaction tx = ses.getTransaction();
			tx.begin();
			try {
				
				String delSql = "delete from  " + tableName + " where audit_id='" + master.getUids() + "'";
				SQLQuery sq0 = ses.createSQLQuery(delSql);
				sq0.executeUpdate();
				
				String updateSql = "update FA_AUDIT_MASTER set STATE ='0' where uids='" + master.getUids() + "'";
				SQLQuery sq = ses.createSQLQuery(updateSql);
				sq.executeUpdate();
				
				//如果撤销附属设备的稽核信息， 需重新计算设备总价值及附属设备价值
				if (businessType.equalsIgnoreCase(AUDIT_TYPE_EQU) && master.getMainId()!=null && master.getMainId().length()>0) {
					this.calEquAmount(ses, master.getPid(), master.getMainId());
				}
				//设备稽核的合并
				if (businessType.equalsIgnoreCase(AUDIT_TYPE_BUILDING) && master.getMainId()!=null && master.getMainId().length()>0) {
					this.calBuildingAmount(ses, master.getPid(), master.getMainId());
				}
				//如果撤销的稽核已经设置了固定资产分类，需要重新汇总资产分类的合计数据
				if (assetsNos!=null && assetsNos.length()>0) {
					assetsNos = assetsNos.substring(1);
					this.collectAssetsData(ses, master.getPid(), businessType, assetsNos, master.getObjectId());
				}
				tx.commit();
			} catch (Exception e) {
				e.printStackTrace();
				tx.rollback();
			} finally {
				ses.close();
			}
			
		}
		return "OK";
	}
	
	/**
	 * 设置或取消稽核的资产分类设置
	 * @param pid	项目编号
	 * @param ids	需要设置的ids；如果是批量设置，用`分隔
	 * @param ids	设置资产分类的对象编号：物资编号、设备编号、房屋建筑物的概算编号；
	 * @param businessType	MAT 物资、 EQU 设备、BUILDING 房屋建筑物
	 * @param assetsNo	选中的资产编号，如果此值为空，表示取消固定资产设置；
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-10
	 */
	public String setAssetsNo(String pid, String ids, String objectIds, String businessType, String assetsNo){
		String beanName = "";
		String tableName = "";
		if (businessType.equalsIgnoreCase(AUDIT_TYPE_MAT)) {
			beanName = FaMatAuditReport.class.getName();
			tableName = "FA_MAT_AUDIT_REPORT";
		} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_EQU)) {
			beanName = FaEquAuditReport.class.getName();
			tableName = "FA_EQU_AUDIT_REPORT";
		} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_BUILDING)) {
			beanName = FaBuildingAuditReport.class.getName();
			tableName = "FA_BUILDING_AUDIT_REPORT";
		}
		
		if (ids!=null && ids.length()>0) {
			String idInStr = StringUtil.transStrToIn(ids, "`");
			List<FaAuditReport> l = null;
			FaAuditReport auditReport = null;
			l = this.faAuditMasterDAO.findByWhere(beanName, "uids in (" + idInStr + ")");
			for (int i = 0; i < l.size(); i++) {
				auditReport = l.get(i);
				
				String changeAssetsNos = "`" + assetsNo + "`";
				String assetsNoTemp = auditReport.getAssetsNo(); 
				if (assetsNoTemp!=null && assetsNoTemp.length()>0) {
					if (!changeAssetsNos.contains("`" + assetsNoTemp + "`")) {
						changeAssetsNos += assetsNoTemp + "`";
					}
				}
				if (changeAssetsNos.length()>0) {
					changeAssetsNos = changeAssetsNos.substring(1, changeAssetsNos.length()-1);
				}
				
				Session ses = HibernateSessionFactory.getSession();
				Transaction tx = ses.getTransaction();
				tx.begin();
				try {
					String updateSql = "update " + tableName + " set assets_no ='" + assetsNo + "' where uids='" + auditReport.getUids() + "'";
					SQLQuery sq = ses.createSQLQuery(updateSql);
					sq.executeUpdate();
					
					this.collectAssetsData(ses, pid, businessType, changeAssetsNos, objectIds);
					tx.commit();
				} catch (Exception e) {
					e.printStackTrace();
					tx.rollback();
				} finally {
					ses.close();
				}
			}
		} else {
			return "ERR";
		}
		Map<String, BigDecimal> map = new HashMap<String, BigDecimal>();
		
		//(1)房屋建筑物
		List<FaBuildingAuditReport> l1 = this.faAuditMasterDAO.findByWhere(FaBuildingAuditReport.class.getName(), " assets_no is not null and budget_id is null");
		for (int i = 0; i < l1.size(); i++) {
			FaBuildingAuditReport report = l1.get(i);
			String assetsNo1 = report.getAssetsNo();
			String key1 = assetsNo1 + "`" + "BUILDING_AMOUNT";
			BigDecimal v1 = report.getBuildingAmount();
			if (map.containsKey(key1)) {
				if (v1!=null) {
					map.put(key1, map.get(key1).add(v1));
				}
			} else {
				if (v1!=null) {
					map.put(key1, v1);
				}
			}
			String key2 = assetsNo1+ "`" + "OTHER_APPORTION_AMOUNT";
			BigDecimal v2 = report.getApportionAmount();
			if (map.containsKey(key2)) {
				if (v2!=null) {
					map.put(key2, map.get(key2).add(v2));
				}
			} else {
				if (v2!=null) {
					map.put(key2, v2);
				}
			}
		}
		
		//(2)设备
		List<FaEquAuditReport> l2 = this.faAuditMasterDAO.findByWhere(FaEquAuditReport.class.getName(), " assets_no is not null and equ_id is null");
		for (int i = 0; i < l2.size(); i++) {
			FaEquAuditReport report = l2.get(i);
			String assetsNo1 = report.getAssetsNo();
			String key1 = assetsNo1 + "`" + "BUILDING_AMOUNT";
			BigDecimal v1 = report.getEquBaseAmount();
			if (map.containsKey(key1)) {
				if (v1!=null) {
					map.put(key1, map.get(key1).add(v1));
				}
			} else {
				if (v1!=null) {
					map.put(key1, v1);
				}
			}
			String key2 = assetsNo1 + "`" + "OTHER_APPORTION_AMOUNT";
			BigDecimal v2 = report.getEquOtherAmount();
			if (map.containsKey(key2)) {
				if (v2!=null) {
					map.put(key2, map.get(key2).add(v2));
				}
			} else {
				if (v2!=null) {
					map.put(key2, v2);
				}
			}
			
			String key3 = assetsNo + "`" + "EQU_AMOUNT";
			BigDecimal v3 = report.getEquAmount();
			if (map.containsKey(key3)) {
				if (v3!=null) {
					map.put(key3, map.get(key3).add(v3));
				}
			} else {
				if (v3!=null) {
					map.put(key3, v3);
				}
			}
			
			String key4 = assetsNo + "`" + "INSTALL_AMOUNT";
			BigDecimal v4 = report.getEquInstallAmount();
			if (map.containsKey(key4)) {
				if (v4!=null) {
					map.put(key4, map.get(key4).add(v4));
				}
			} else {
				if (v4!=null) {
					map.put(key4, v4);
				}
			}
		}
		
		//(3)物资
		List<FaMatAuditReport> l3 = this.faAuditMasterDAO.findByWhere(FaMatAuditReport.class.getName(), " assets_no is not null and mat_id is null");
		for (int i = 0; i < l3.size(); i++) {
			FaMatAuditReport report = l3.get(i);
			String assetsNo1 = report.getAssetsNo();
			String key1 = assetsNo1 + "`" + "OTHER_DIRECT_AMOUNT";
			BigDecimal v1 = report.getFinFixedAmount();
			if (map.containsKey(key1)) {
				if (v1!=null) {
					map.put(key1, map.get(key1).add(v1));
				}
			} else {
				if (v1!=null) {
					map.put(key1, v1);
				}
			}
			String key2 = assetsNo1 + "`" + "OTHER_DIRECT_AMOUNT";
			BigDecimal v2 = report.getFinCurrentAmount();
			if (map.containsKey(key2)) {
				if (v2!=null) {
					map.put(key2, map.get(key2).add(v2));
				}
			} else {
				if (v2!=null) {
					map.put(key2, v2);
				}
			}
		}
		
		Iterator<String> iter = map.keySet().iterator();
		while (iter.hasNext()) {
			String key = (String)iter.next();
			String[] keyArr = key.split("`");
			String updateSql = "update fa_assets_report set " + keyArr[1] + "=" + map.get(key) + " where assets_id ='" + keyArr[0] + "'";
			JdbcUtil.execute(updateSql);
		}
		
		String updateSql1 = "update fa_assets_report set OTHER_AMOUNT = nvl(OTHER_APPORTION_AMOUNT,0)+nvl(OTHER_DIRECT_AMOUNT,0)";
		JdbcUtil.execute(updateSql1);
		String updateSql2 = "update fa_assets_report set AMOUNT = nvl(OTHER_AMOUNT,0)+nvl(BUILDING_AMOUNT,0)+nvl(EQU_AMOUNT,0)+nvl(INSTALL_AMOUNT,0)";
		JdbcUtil.execute(updateSql2);
		
		return "OK";
	}

	/**
	 * 物资财务稽核的信息记入稽核详细信息表中
	 * 
	 * @param stockOutDetailList
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-10
	 */
	public String addMatAuditDetail(MatStockOutDetailVO[] stockOutDetailList) {
		MatStockOutDetailVO vo = null;
		FaAuditMaster master = null;
		FaMatAuditReport matReport = null;
		for (int i = 0; i < stockOutDetailList.length; i++) {
			vo = stockOutDetailList[i];
			String sourceNo = vo.getOutNo();
			String objectId = vo.getMatId();
			master = this.getAuditMasterBySource(sourceNo, objectId);
			if (master != null) {
				matReport = new FaMatAuditReport();
				matReport.setUids(SnUtil.getNewID());
				matReport.setPid(master.getPid());
				matReport.setAuditId(master.getUids());
				matReport.setMatId(objectId);
				matReport.setMatName(vo.getMatName());
				matReport.setMatSpec(vo.getMatSpec());
				matReport.setUnit(vo.getMatUnit());
				matReport.setMatUser(vo.getUsingUser());
				matReport.setNumA(vo.getNum());
				matReport.setAmountA(vo.getAmount());
				if (master.getMainId() == null
						|| master.getMainId().length() == 0) {
					matReport.setMainFlag("1");
				} else {
					matReport.setMainFlag("0");
				}
				matReport.setNumF(vo.getNum());
				matReport.setFinOAmount(vo.getFinOAmount());
				matReport.setFinDepAmount(vo.getFinDepAmount());
				matReport.setFinFixedAmount(vo.getFinFixedAmount());
				matReport.setFinCurrentAmount(vo.getFinCurrentAmount());

				this.faMatAuditReportDAO.insert(matReport);
			}
		}
		return "OK";
	}
	
	/**
	 * @param stockOutDetailList
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-14
	 */
	public String addEquAuditDetail(EquStockOutDetailVO[] stockOutDetailList){
		EquStockOutDetailVO vo = null;
		FaAuditMaster master = null;
		FaEquAuditReport report = null;
		for (int i = 0; i < stockOutDetailList.length; i++) {
			vo = stockOutDetailList[i];
			String sourceNo = vo.getOutno();
			String objectId = vo.getEquId();
			master = this.getAuditMasterBySource(sourceNo, objectId);
			if (master!=null) {
				report = new FaEquAuditReport();
				report.setUids(SnUtil.getNewID());
				report.setPid(master.getPid());
				report.setAuditId(master.getUids());
				report.setEquId(objectId);
				report.setEquName(vo.getEquName());
				report.setEquSpec(vo.getEquSpec());
				report.setUnit(vo.getEquUnit());
				report.setEquSupplyunit(vo.getEquSupplyunit());
				report.setEquLocation(vo.getEquLocation());
				report.setNum(vo.getEquNum());
				report.setEquMainAmount(vo.getEquMainAmount());
				report.setEquAmount(vo.getEquAmount());
				report.setBdgid(vo.getBdgid());
				report.setEquBaseAmount(vo.getEquBaseAmount());
				report.setEquInstallAmount(vo.getEquInstallAmount());
				report.setEquOtherAmount(vo.getEquOtherAmount());
				BigDecimal total = new BigDecimal(0);
				if (vo.getEquAmount()!=null) {
					total = total.add(vo.getEquAmount());
				}
				if (vo.getEquBaseAmount()!=null) {
					total = total.add(vo.getEquBaseAmount());
				}
				if (vo.getEquInstallAmount()!=null) {
					total = total.add(vo.getEquInstallAmount());
				}
				if (vo.getEquOtherAmount()!=null) {
					total = total.add(vo.getEquOtherAmount());
				}
				report.setAmount(total);
				if (master.getMainId()==null || master.getMainId().length()==0) {
					report.setMainFlag("1");
				} else {
					report.setMainFlag("0");
				}
				
				this.faEquAuditReportDAO.insert(report);
			}
		}
		return "OK";
	}
	
	/**	稽核房屋或建筑物的详细信息保存到数据库
	 * @param buildingBdgDetailVOArr
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-14
	 */
	public String addBuildingAuditDetail(BuildingBdgDetailVO[] buildingBdgDetailVOArr){
		BuildingBdgDetailVO vo = null;
		FaAuditMaster master = null;
		FaBuildingAuditReport report = null;
		for (int i = 0; i < buildingBdgDetailVOArr.length; i++) {
			vo = buildingBdgDetailVOArr[i];
			String objectId = vo.getBdgid();
			master = this.getAuditMasterBySource("", objectId);
			if (master!=null) {
				report = new FaBuildingAuditReport();
				report.setUids(SnUtil.getNewID());
				report.setPid(master.getPid());
				report.setAuditId(master.getUids());
				report.setBudgetId(objectId);
				report.setBuildingSpec(vo.getBuildingSpec());
				report.setBuildingName(vo.getBdgname());
				report.setBuildingLocation(vo.getBuildingLocation());
				report.setUnit(vo.getBuildingUnit());
				report.setNum(vo.getBuildingNum());
				report.setBuildingSelfAmount(vo.getBuildingSelfAmount());
				report.setBuildingAmount(vo.getBuildingSelfAmount());
				report.setApportionAmount(vo.getApportionAmount());
				BigDecimal total = new BigDecimal(0);
				if (vo.getBuildingAmount()!=null) {
					total = total.add(vo.getBuildingAmount());
				}
				if (vo.getApportionAmount()!=null) {
					total = total.add(vo.getApportionAmount());
				}
				report.setAmount(total);
				
				if (master.getMainId()==null || master.getMainId().length()==0 || master.getMainId().equals("1")) {
					report.setMainFlag("1");
				} else {
					report.setMainFlag("0");
				}
				
				this.faBuildingAuditReportDAO.insert(report);
			}
		}
		return "OK";
	}
	
	/**
	 * @param sourceNo
	 * @param objectId
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-10
	 */
	public FaAuditMaster getAuditMasterBySource(String sourceNo, String objectId) {
		String whereStr = "1=1";
		if (sourceNo==null || sourceNo.length()==0) {
			whereStr += " and source_no is null";
		} else {
			whereStr += " and source_no='" + sourceNo + "'" ;
		}
		if (objectId!=null && objectId.length()>0) {
			whereStr += " and object_id='" + objectId + "' and state='1'";
			List<FaAuditMaster> l = this.faAuditMasterDAO.findByWhere(FaAuditMaster.class.getName(),  whereStr);
			if (l.size()==1) {
				return l.get(0);
			} else {
				return null;
			}
		}
		return null;
	}

	/**
	 * 获取稽核流水号信息
	 * @param businessType
	 * @param preStr
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-9
	 */
	private String getNewestAuditNo(String businessType, String preStr){
		String returnStr = "";
		if (preStr!=null && preStr.length()>0) {
			returnStr += preStr + "-"; 
		}
		returnStr += businessType + SnUtil.getNewID();
		return returnStr;
	}
	
	/**
	 * 根据设备或物资的出库单号及物资设备编码，获取此物资有效的稽核信息
	 * @param businessType
	 * @param outno
	 * @param objectno
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-12
	 */
	public FaAuditMaster getAuditInfoByOutno(String businessType, String outno, String objectno){
		String whereStr = "business_type='" + businessType + "' and state='1' and object_id='" + objectno + "'";
		if (outno!=null && outno.length()>0) {
			whereStr += " and source_no='" + outno + "'";
		} else {
			whereStr += " and source_no is null";
		}
		List<FaAuditMaster> l = this.faAuditMasterDAO.findByWhere(FaAuditMaster.class.getName(), whereStr);
		if (l.size()==1) {
			return l.get(0);
		}
		
		return null;
	}
	
	//*********************************************************************合并稽核的数据合计功能
	/**
	 * 根据稽核的主设备信息，计算设备稽核的设备总价值和附属设备价值
	 * 		计算附属设备的价值；如果是合并稽核或合并到稽核，需重新计算附属设备的价值和设备购置总价
	 *		附属设备的价值 = 稽核的附属设备价值之和；设备总价 = 设备自身价值 + 所有附属设备价值； 
	 * @param ses
	 * @param pid
	 * @param mergeMainAuditId
	 * @author: Ivy
	 * @createDate: 2011-3-22
	 */
	private void calEquAmount(Session ses, String pid, String mergeMainAuditId) {
		if (ses == null) {
			List<FaEquAuditReport> mainList = this.faEquAuditReportDAO.findByWhere(FaEquAuditReport.class.getName(), "audit_id='" + mergeMainAuditId + "'");
			if (mainList==null || mainList.size()!=1) {
			} else {
				FaEquAuditReport mainReport = mainList.get(0);
				
				List<FaAuditMaster> masterList = this.faAuditMasterDAO.findByWhere(FaAuditMaster.class.getName(), "main_id='" + mergeMainAuditId + "' and state='1'");
				if (masterList.size()>0) {
					String ids = "";
					for (int i = 0; i < masterList.size(); i++) {
						ids += "`" + masterList.get(i).getUids();
					}
					if (ids.length()>0) {
						ids = ids.substring(1);
						BigDecimal total = new BigDecimal(0);
						List<FaEquAuditReport> reportList = this.faEquAuditReportDAO.findByWhere(FaEquAuditReport.class.getName(), "audit_id in (" + StringUtil.transStrToIn(ids, "`") + ")");
						for (int j = 0; j < reportList.size(); j++) {
							BigDecimal v = reportList.get(j).getEquMainAmount();
							if (v!=null) {
								total = total.add(v);
							}
						}
						if (mainReport.getEquMainAmount()==null) {
							mainReport.setEquAmount(total);
						} else {
							mainReport.setEquAmount(mainReport.getEquMainAmount().add(total));
						}
						mainReport.setEquSubAmount(total);
						
						BigDecimal amount = new BigDecimal(0);
						if (mainReport.getEquAmount()!=null) {
							amount = amount.add(mainReport.getEquAmount());
						}
						if (mainReport.getEquBaseAmount()!=null) {
							amount = amount.add(mainReport.getEquBaseAmount());
						}
						if (mainReport.getEquInstallAmount()!=null) {
							amount = amount.add(mainReport.getEquInstallAmount());
						}
						if (mainReport.getEquOtherAmount()!=null) {
							amount = amount.add(mainReport.getEquOtherAmount());
						}
						mainReport.setAmount(amount);
						this.faEquAuditReportDAO.saveOrUpdate(mainReport);
					}
				}
			}
		} else {
			String updateSql = " update fa_equ_audit_report set equ_amount = nvl(equ_main_amount, 0) + " +
					" (select sum(equ_main_amount) from fa_equ_audit_report t" +
					" where t.audit_id in (select uids from fa_audit_master m  where main_id = '" + mergeMainAuditId + "' and state='1'))where audit_id = '" + mergeMainAuditId + "'";
			String updateSql1 = "update fa_equ_audit_report set amount = nvl(equ_amount, 0) + nvl(equ_base_amount, 0) + nvl(equ_install_amount,0)+ nvl(equ_other_amount, 0)" +
					" where audit_id = '" + mergeMainAuditId + "'";
			
			SQLQuery sq = ses.createSQLQuery(updateSql);
			sq.executeUpdate();
			SQLQuery sq1 = ses.createSQLQuery(updateSql1);
			sq1.executeUpdate();
		}
	}
	
	/**
	 * 根据稽核的主建筑信息，计算主建筑的建筑价值
	 *		主建筑的建筑价值 = 稽核的主建筑自身建筑价值+附属建筑的建筑价值； 
	 * @param pid
	 * @param mergeMainAuditId
	 * @author: Ivy
	 * @createDate: 2011-3-22
	 */
	private void calBuildingAmount(Session ses, String pid, String mergeMainAuditId) {
		if (ses==null) {
			List<FaBuildingAuditReport> mainList = this.faBuildingAuditReportDAO.findByWhere(FaBuildingAuditReport.class.getName(), "audit_id='" + mergeMainAuditId + "'");
			if (mainList==null || mainList.size()!=1) {
			} else {
				FaBuildingAuditReport mainReport = mainList.get(0);
				
				List<FaAuditMaster> masterList = this.faAuditMasterDAO.findByWhere(FaAuditMaster.class.getName(), "main_id='" + mergeMainAuditId + "' and state='1'");
				if (masterList.size()>0) {
					String ids = "";
					for (int i = 0; i < masterList.size(); i++) {
						ids += "`" + masterList.get(i).getUids();
					}
					if (ids.length()>0) {
						ids = ids.substring(1);
						BigDecimal total = new BigDecimal(0);
						List<FaBuildingAuditReport> reportList = this.faBuildingAuditReportDAO.findByWhere(FaBuildingAuditReport.class.getName(), "audit_id in (" + StringUtil.transStrToIn(ids, "`") + ")");
						for (int j = 0; j < reportList.size(); j++) {
							BigDecimal v = reportList.get(j).getBuildingSelfAmount();
							if (v!=null) {
								total = total.add(v);
							}
						}
						if (mainReport.getBuildingSelfAmount()==null) {
							mainReport.setBuildingAmount(total);
						} else {
							mainReport.setBuildingAmount(mainReport.getBuildingSelfAmount().add(total));
						}
						
						BigDecimal amount = new BigDecimal(0);
						if (mainReport.getBuildingAmount()!=null) {
							amount = amount.add(mainReport.getBuildingAmount());
						}
						if (mainReport.getApportionAmount()!=null) {
							amount = amount.add(mainReport.getApportionAmount());
						}
						mainReport.setAmount(amount);
						this.faEquAuditReportDAO.saveOrUpdate(mainReport);
					}
				}
			}
		} else {
			String updateSql = " update FA_BUILDING_AUDIT_REPORT set building_amount = nvl(building_self_amount, 0) + " +
					" (select sum(building_self_amount) from FA_BUILDING_AUDIT_REPORT t" +
					" where t.audit_id in (select uids from fa_audit_master m  where main_id = '" + mergeMainAuditId + "' and state='1'))where audit_id = '" + mergeMainAuditId + "'";
			String updateSql1 = "update FA_BUILDING_AUDIT_REPORT set amount = nvl(building_amount, 0) + nvl(APPORTION_AMOUNT, 0)" +
					" where audit_id = '" + mergeMainAuditId + "'";
			
			SQLQuery sq = ses.createSQLQuery(updateSql);
			sq.executeUpdate();
			SQLQuery sq1 = ses.createSQLQuery(updateSql1);
			sq1.executeUpdate();
		}
	}
	
	//*********************************************************************固定资产设置的数据汇总功能
	/**
	 * 对固定资产的数据进行汇总
	 * 	(1)	汇总某固定资产分类下面的某些物资的合计；
	 * 	(2)	汇总某固定资产分类的合计数据；
	 * @param pid	项目编号
	 * @param businessType
	 * @param asstesNos
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-21
	 */
	public String collectAssetsData(Session ses, String pid, String businessType, String assetsNos, String objectIds) {
		String[] collectInfoArr = this.getCollectDataByBusinessType(businessType);
		String tableName = collectInfoArr[0];
		String objectIdCol = collectInfoArr[1];
		String columns = collectInfoArr[2];
		String otherGroupByCols = collectInfoArr[3];
		
		String insertSubSql = "";
		String sumSubSql = "";
		String groupByCol = "";
		String[] columnArr = columns.split("`");
		for (int i = 0; i < columnArr.length; i++) {
			sumSubSql += ", sum(" + columnArr[i] + ")";
		}
		insertSubSql = ", " + columns.replaceAll("`", ", ");
		groupByCol = ", " + otherGroupByCols.replaceAll("`", ", ");
		
		String assetsNoInStr = "";
		if (assetsNos==null || assetsNos.length()==0) {
			assetsNoInStr = " select assets_no from fa_assets_sort ";
		} else {
			assetsNoInStr = StringUtil.transStrToIn(assetsNos, "`");
		}
		
		String objectIdInStr = "";
		if (objectIds==null || objectIds.length()==0) {
			objectIdInStr = " select distinct " + objectIdCol + " from " + tableName + " where assets_no is not null and audit_id is not null and mainflag = '1' and pid='" + pid + "'";
		} else {
			objectIdInStr = StringUtil.transStrToIn(objectIds, "`");
		}
		
		//(1)删除已有的汇总数据
		String deleteSql1 = "delete from " + tableName + 
				" where audit_id is null and assets_no in(" + assetsNoInStr + ") and " + objectIdCol + " in (" + objectIdInStr + ") and pid='" + pid + "'" ;
		String deleteSql2 = "delete from " + tableName + 
				" where audit_id is null and " + objectIdCol + " is null and assets_no in(" + assetsNoInStr + ")  and pid='" + pid + "'" ;
		
		//(2)汇总资产分类下同一对象的数据；
		String insertSql1 = "";
		String where1 = " where audit_id is not null and assets_no in (" + assetsNoInStr + ") and " + objectIdCol + " in (" + objectIdInStr + ") and pid='" + pid + "'";
		if(!businessType.equalsIgnoreCase(AUDIT_TYPE_BUILDING)) {
			insertSql1 = "insert into " + tableName + " (UIDS, PID, ASSETS_NO, " + objectIdCol + insertSubSql + groupByCol + ") " +
					"select pid||assets_no||" + objectIdCol + ", pid, assets_no, " + objectIdCol + sumSubSql + groupByCol + " from " + tableName + 
					where1 +
					" group by pid, assets_no, " + objectIdCol + groupByCol;
		}
		
		//(3)汇总资产分类下所有对象的数据；
		String where2 = " where audit_id is null and assets_no in (" + assetsNoInStr + ") and pid='" + pid + "' ";
		if (businessType.equalsIgnoreCase(AUDIT_TYPE_BUILDING)) {
			where2 = " where assets_no in (" + assetsNoInStr + ") and pid='" + pid + "' ";
		}
		String insertSql2 = "insert into " + tableName + " (UIDS, PID, ASSETS_NO " + insertSubSql + ") " +
				"select pid||assets_no, pid, assets_no " + sumSubSql + " from " + tableName + 
				where2 +
				" group by pid, assets_no ";
		
		SQLQuery sq1 = ses.createSQLQuery(deleteSql1);
		sq1.executeUpdate();
		SQLQuery sq2 = ses.createSQLQuery(deleteSql2);
		sq2.executeUpdate();
		if(!insertSql1.equals("")){
			SQLQuery sq3 = ses.createSQLQuery(insertSql1);
			sq3.executeUpdate();
		}
		System.out.println(insertSql2);
		SQLQuery sq4 = ses.createSQLQuery(insertSql2);
		sq4.executeUpdate();
		
		return "OK";
	}
	
	/**
	 * 数据汇总时需要汇总的表 及 表的字段 及汇总方式
	 * @param businessType
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-21
	 */
	public String[] getCollectDataByBusinessType(String businessType) {
		String[] dataCols = new String[4];
		String tableName = "";
		String objectIdCol = "";
		String columns = "";
		String otherGroupByCol = "";
		if (businessType.equalsIgnoreCase(AUDIT_TYPE_MAT)) {
			tableName = "FA_MAT_AUDIT_REPORT";
			objectIdCol = "MAT_ID";
			columns = "NUM_A`AMOUNT_A`NUM_F`AMOUNT_F`F_O_AMOUNT`F_DEP_AMOUNT`F_FIXED_AMOUNT`F_CURRENT_AMOUNT";
			otherGroupByCol = "MAT_NAME`MAT_SPEC`MAT_SUPPLYUNIT`UNIT";
		} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_EQU)) {
			tableName = "FA_EQU_AUDIT_REPORT";
			objectIdCol = "EQU_ID";
			columns = "NUM`EQU_AMOUNT`EQU_SUB_AMOUNT`EQU_BASE_AMOUNT`EQU_INSTALL_AMOUNT`EQU_OTHER_AMOUNT`AMOUNT";
			otherGroupByCol = "EQU_NAME`EQU_SPEC`EQU_SUPPLYUNIT`EQU_LOCATION`UNIT`BDGID";
		} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_BUILDING)) {
			tableName = "FA_BUILDING_AUDIT_REPORT";
			objectIdCol = "BUDGET_ID";
			columns = "NUM`BUILDING_AMOUNT`APPORTION_AMOUNT`AMOUNT";
			otherGroupByCol = "BUILDING_NAME`BUILDING_SPEC`BUILDING_LOCATION`UNIT";
		}
		dataCols[0] = tableName;
		dataCols[1] = objectIdCol;
		dataCols[2] = columns;
		dataCols[3] = otherGroupByCol;
		return dataCols;
	}
	
	//****************************************************************************** 业务数据相关的方法
	//-------------------------------------------------------------------------------begin【物资部分】
	/**
	 * 获取物资出库单信息
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param param
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-20
	 */
	public List getMatStockOut(String orderBy, Integer start, Integer limit, HashMap<String, String> param){
		String pid = param.get("pid");
		String outType = "0"; // 所有出库单
		if(pid.equals("1030603")) {
			return matStockOutMgm_guoj.getMatStockOut(pid, outType, orderBy, param, start, limit);
		} else {
			return matStockOutMgm.getMatStockOut(pid, outType, orderBy, param, start, limit);
		}
	}
	
	/**
	 * 根据物资出库单的主键，获取出库单出库物资明细信息；
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param param
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-20
	 */
	public List getMatStockOutDetail(String orderBy, Integer start, Integer limit, HashMap<String, String> param){

		String outId = param.get("outId");
		param.remove("outId");
		String pid = param.get("pid");
		param.remove("pid");

		List list = null;
		if(pid.equals("1030603")) {
			list = matStockOutMgm_guoj.getMatStockOutDetail(pid, outId, orderBy,	param, start, limit);
		} else {
			list = matStockOutMgm.getMatStockOutDetail(pid, outId, orderBy,	param, start, limit);
		}
		for (int i = 0; i < list.size() - 1; i++) {
			MatStockOutDetailVO matStockOutDetailVO = (MatStockOutDetailVO) list
					.get(i);

			FaAuditMaster auditMaster = this.getAuditInfoByOutno(
					AUDIT_TYPE_MAT, matStockOutDetailVO.getOutNo(),
					matStockOutDetailVO.getMatId());
			if (auditMaster != null) {
				matStockOutDetailVO.setAuditId(auditMaster.getUids());
				matStockOutDetailVO.setAuditNo(auditMaster.getAuditNo());
				matStockOutDetailVO.setAuditState(auditMaster.getState());
			}
		}

		return list;

	}
	//-------------------------------------------------------------------------------end【物资部分】
	
	
	//-------------------------------------------------------------------------------begin【设备部分】
	/**
	 * 根据设备合同信息，获取该合同对应设备的出库单出库设备的信息；
	 * @param orderby	排序信息
	 * @param start	分页信息
	 * @param limit	分页信息
	 * @param param	查询的条件信息
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-10
	 */
	public List getEquStockOutDetail(String orderBy, Integer start, Integer limit, HashMap<String, String> param){
		String conId = "";
		String pid = "";
		if (param!=null && !param.isEmpty()) {
			Iterator<String> iterator = param.keySet().iterator();
			while (iterator.hasNext()) {
				String key = iterator.next();
				String value = param.get(key);
				if (key.equalsIgnoreCase("conid")) {
					conId = value;
					param.remove(key);
				} else if (key.equalsIgnoreCase("pid")) {
					pid = value;
					param.remove(key);
				}
			}
		}
		
		List l = this.equStockOutMgm.getEquStockOutDetail(pid, conId, orderBy, param, start, limit);
		
		for (int i = 0; i <l.size()-1; i++) {
			EquStockOutDetailVO stockOutDetailVO = (EquStockOutDetailVO) l.get(i);
			
			FaAuditMaster auditMaster = this.getAuditInfoByOutno(AUDIT_TYPE_EQU, stockOutDetailVO.getOutno(), stockOutDetailVO.getEquId());
			if (auditMaster!=null) {
				stockOutDetailVO.setAuditId(auditMaster.getUids());
				stockOutDetailVO.setAuditNo(auditMaster.getAuditNo());
				stockOutDetailVO.setOutState(auditMaster.getState());
			}
		}
		
		return l;
	}
	
	/**
	 * 获取稽核信息；
	 * @param businessType
	 * @param whereStr
	 * @param orderByStr
	 * @param start
	 * @param limit
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-14
	 */
	public List getAuditReportInfo(String orderByStr, Integer start, Integer limit, HashMap<String, String> param){
		String businessType = param.get("businessType");
		String mainFlag = param.get("mainFlag");
		String mainAuditId = param.get("mainAuditId");
		String pid = param.get("pid");
		String whereStr = param.get("whereStr");
		String beanName = "";
		if (businessType.equalsIgnoreCase(AUDIT_TYPE_MAT)) {
			beanName = FaMatAuditReport.class.getName();
		} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_EQU)) {
			beanName = FaEquAuditReport.class.getName();
		} else if (businessType.equalsIgnoreCase(AUDIT_TYPE_BUILDING)) {
			beanName = FaBuildingAuditReport.class.getName();
		}
		
		if (whereStr==null) {
			whereStr = "1=1";
		}
		if (pid!=null && pid.length()>0) {
			whereStr += " and pid = '" + pid + "'";
		}
		if (mainFlag==null || mainFlag.equals("")) {
			whereStr += " and mainflag is null ";
		} else {
			whereStr += " and mainflag='" + mainFlag + "'";
		}
		if (mainFlag.equals("0") && mainAuditId!=null && mainAuditId.length()>0) {
			List<FaAuditMaster> l1 = this.faAuditMasterDAO.findByWhere(FaAuditMaster.class.getName(), "main_id = '" + mainAuditId + "'");
			String subAuditIds = "";
			for (int i = 0; i < l1.size(); i++) {
				subAuditIds += "`" + l1.get(i).getUids(); 
			}
			if (subAuditIds.length()>0) {
				String subAuditIdInStr = StringUtil.transStrToIn(subAuditIds.substring(1), "`");
				whereStr += " and audit_id in (" + subAuditIdInStr + ")";
			} else {
				whereStr += " and 1=2";
			}
		}
		whereStr += " and audit_id is not null";
		
		List returnList = new ArrayList();
		List l = this.faAuditMasterDAO.findByWhere(beanName, whereStr, orderByStr, start, limit);
		for (int i = 0; i < l.size()-1; i++) {
			FaAuditReport auditReport = (FaAuditReport) l.get(i);
			FaAuditMaster auditMaster = (FaAuditMaster) this.faAuditMasterDAO.findById(FaAuditMaster.class.getName(), auditReport.getAuditId());
			auditReport.setAuditNo(auditMaster.getAuditNo());
			auditReport.setSourceNo(auditMaster.getSourceNo());
			
			if (auditReport.getAssetsNo() != null) {
				// 设置资产名称
				List assetsList = faAuditMasterDAO.findByProperty(
						FAAssetsSortHBM.class.getName(), "assetsNo",auditReport
								.getAssetsNo());
				if (assetsList.size() > 0) {
					FAAssetsSortHBM assetsSort = (FAAssetsSortHBM) assetsList.get(0);
					auditReport.setAssetsName(assetsSort.getAssetsName());
				}
			}

			returnList.add(auditReport);
		}
		
		
		returnList.add(l.get(l.size()-1));
		return returnList;
	}
	//-------------------------------------------------------------------------------end【设备部分】
	
	
	//-------------------------------------------------------------------------------begin【房屋及建筑物】
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		
		if (treeName.equalsIgnoreCase("getBuildingTree")) {
			String[] pArr = (String[]) params.get("pid");
			String pid = pArr[0];
			list = this.getBuildingTree(parentId, pid);  
		}  
		return list;
	}

	/**
	 * 获得需要稽核的房屋建筑物的概算树
	 * @param parentId
	 * @param pid
	 * @return
	 * @throws BusinessException
	 * @author: Ivy
	 * @createDate: 2011-3-15
	 */
	public List<ColumnTreeNode> getBuildingTree(String parentId, String pid) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>(); 
		String parent = parentId != null ? parentId: Constant.APPBudgetRootID;
		String str = "parent='"+ parent +"' and pid='" + pid + "' and length(bdgno)<=12 order by bdgid ";
		List<BdgInfo> objects = this.faAuditMasterDAO.findByWhere2(BdgInfo.class.getName(), str);
		Iterator<BdgInfo> itr = objects.iterator();
		
		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			
			BdgInfo temp = (BdgInfo) itr.next();
			BuildingBdgDetailVO vo = new BuildingBdgDetailVO();
			try {
				BeanUtils.copyProperties(vo, temp);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
			FaAuditMaster auditMaster = this.getAuditInfoByOutno(AUDIT_TYPE_BUILDING, "", vo.getBdgid());
			if (auditMaster!=null) {
				vo.setAuditId(auditMaster.getUids());
				vo.setAuditNo(auditMaster.getAuditNo());
				vo.setAuditState(auditMaster.getState());
			}
			
			String leafSql = "select bdgid c from bdg_info where parent='"+ vo.getBdgid() +"' and length(bdgno)<=12";
			List l = JdbcUtil.query(leafSql);
			int leaf = l.size();			
			n.setId(vo.getBdgid());			// treenode.id
			n.setText(vo.getBdgname());		// treenode.text
			if (leaf == 0) {
				n.setLeaf(true);				
				n.setIconCls("task");			
			} else {
				n.setLeaf(false);				// treenode.leaf
				n.setCls("master-task");		// treenode.cls
				n.setIconCls("task-folder");	// treenode.iconCls
			}
			cn.setTreenode(n);					// ColumnTreeNode.treenode

			JSONObject jo = JSONObject.fromObject(vo);
			cn.setColumns(jo);						// ColumnTreeNode.columns
			list.add(cn);
		}
		return list;
	}
	//-------------------------------------------------------------------------------end【房屋及建筑物】
	
	//-------------------------------------------------------------------------------begin【物资部分】
	//-------------------------------------------------------------------------------end【物质部分】
	
	
	//-------------------------------------------------------------------------------财务稽核部分报表数据生成
	/** 初始化竣建04表的数据
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-4-6
	 */
	public String initAssetsReportData(String pid) {
		Session ses = HibernateSessionFactory.getSession();
		
		this.collectAssetsData(ses, pid, AUDIT_TYPE_BUILDING, "", "");
		this.collectAssetsData(ses, pid, AUDIT_TYPE_EQU, "", "");
		this.collectAssetsData(ses, pid, AUDIT_TYPE_MAT, "", "");
		
		String insertSql = "merge into fa_assets_report t" +
				" using (select uids, pid, assets_no FROM fa_assets_sort where pid='SXGJ') t1" +
				" on (t.assets_ID = t1.assets_no and t.pid = t1.pid)" +
				" WHEN NOT MATCHED THEN " +
				" INSERT (uids, pid, assets_ID) VALUES(t1.uids, t1.pid, t1.assets_no)";
		JdbcUtil.execute(insertSql);
		/*
		Map<String, BigDecimal> map = new HashMap<String, BigDecimal>();
		
		//(1)房屋建筑物
		List<FaBuildingAuditReport> l1 = this.faAuditMasterDAO.findByWhere(FaBuildingAuditReport.class.getName(), " assets_no is not null and budget_id is null");
		for (int i = 0; i < l1.size(); i++) {
			FaBuildingAuditReport report = l1.get(i);
			String assetsNo = report.getAssetsNo();
			String key1 = assetsNo + "`" + "BUILDING_AMOUNT";
			BigDecimal v1 = report.getBuildingAmount();
			if (map.containsKey(key1)) {
				if (v1!=null) {
					map.put(key1, map.get(key1).add(v1));
				}
			} else {
				if (v1!=null) {
					map.put(key1, v1);
				}
			}
			String key2 = assetsNo + "`" + "OTHER_APPORTION_AMOUNT";
			BigDecimal v2 = report.getApportionAmount();
			if (map.containsKey(key2)) {
				if (v2!=null) {
					map.put(key2, map.get(key2).add(v2));
				}
			} else {
				if (v2!=null) {
					map.put(key2, v2);
				}
			}
		}
		
		//(2)设备
		List<FaEquAuditReport> l2 = this.faAuditMasterDAO.findByWhere(FaEquAuditReport.class.getName(), " assets_no is not null and equ_id is null");
		for (int i = 0; i < l2.size(); i++) {
			FaEquAuditReport report = l2.get(i);
			String assetsNo = report.getAssetsNo();
			String key1 = assetsNo + "`" + "BUILDING_AMOUNT";
			BigDecimal v1 = report.getEquBaseAmount();
			if (map.containsKey(key1)) {
				if (v1!=null) {
					map.put(key1, map.get(key1).add(v1));
				}
			} else {
				if (v1!=null) {
					map.put(key1, v1);
				}
			}
			String key2 = assetsNo + "`" + "OTHER_APPORTION_AMOUNT";
			BigDecimal v2 = report.getEquOtherAmount();
			if (map.containsKey(key2)) {
				if (v2!=null) {
					map.put(key2, map.get(key2).add(v2));
				}
			} else {
				if (v2!=null) {
					map.put(key2, v2);
				}
			}
			
			String key3 = assetsNo + "`" + "EQU_AMOUNT";
			BigDecimal v3 = report.getEquAmount();
			if (map.containsKey(key3)) {
				if (v3!=null) {
					map.put(key3, map.get(key3).add(v3));
				}
			} else {
				if (v3!=null) {
					map.put(key3, v3);
				}
			}
			
			String key4 = assetsNo + "`" + "INSTALL_AMOUNT";
			BigDecimal v4 = report.getEquInstallAmount();
			if (map.containsKey(key4)) {
				if (v4!=null) {
					map.put(key4, map.get(key4).add(v4));
				}
			} else {
				if (v4!=null) {
					map.put(key4, v4);
				}
			}
		}
		
		//(3)物资
		List<FaMatAuditReport> l3 = this.faAuditMasterDAO.findByWhere(FaMatAuditReport.class.getName(), " assets_no is not null and mat_id is null");
		for (int i = 0; i < l3.size(); i++) {
			FaMatAuditReport report = l3.get(i);
			String assetsNo = report.getAssetsNo();
			String key1 = assetsNo + "`" + "OTHER_DIRECT_AMOUNT";
			BigDecimal v1 = report.getFinFixedAmount();
			if (map.containsKey(key1)) {
				if (v1!=null) {
					map.put(key1, map.get(key1).add(v1));
				}
			} else {
				if (v1!=null) {
					map.put(key1, v1);
				}
			}
			String key2 = assetsNo + "`" + "OTHER_DIRECT_AMOUNT";
			BigDecimal v2 = report.getFinCurrentAmount();
			if (map.containsKey(key2)) {
				if (v2!=null) {
					map.put(key2, map.get(key2).add(v2));
				}
			} else {
				if (v2!=null) {
					map.put(key2, v2);
				}
			}
		}
		
		Iterator<String> iter = map.keySet().iterator();
		while (iter.hasNext()) {
			String key = (String)iter.next();
			String[] keyArr = key.split("`");
			String updateSql = "update fa_assets_report set " + keyArr[1] + "=" + map.get(key) + " where assets_id ='" + keyArr[0] + "'";
			JdbcUtil.execute(updateSql);
		}
		
		String updateSql1 = "update fa_assets_report set OTHER_AMOUNT = nvl(OTHER_APPORTION_AMOUNT,0)+nvl(OTHER_DIRECT_AMOUNT,0)";
		JdbcUtil.execute(updateSql1);
		String updateSql2 = "update fa_assets_report set AMOUNT = nvl(OTHER_AMOUNT,0)+nvl(BUILDING_AMOUNT,0)+nvl(EQU_AMOUNT,0)+nvl(INSTALL_AMOUNT,0)";
		JdbcUtil.execute(updateSql2);
		*/
		return "OK";
	}
	
	public List<FAAssetsSort> getFAAssetsSortTree(String pid){
		updateAssetsReportData(pid);
		
		List<FAAssetsSort> list = new ArrayList<FAAssetsSort>();
		String str = " 1=1 order by assets_no";
		List unlist=this.faAuditMasterDAO.findByWhere2(FaAssetsView.class.getName(), str);
		for(int i=0;i<unlist.size();i++){
			FaAssetsView temp =(FaAssetsView) unlist.get(i);
			FAAssetsSort sort=new FAAssetsSort();
			sort.setAssetsName(temp.getAssetsName());
			sort.setAssetsNo(temp.getAssetsNo());
			sort.setDepreciationRate(temp.getDepreciationRate());
			sort.setParentId(temp.getParentId());
			sort.setPid(temp.getPid());
			sort.setRemark(temp.getRemark());
			sort.setUids(temp.getUids());
			sort.setAmount(temp.getAmount());
			sort.setBuildingAmount(temp.getBuildingAmount());
			sort.setEquAmount(temp.getEquAmount());
			sort.setInstallAmount(temp.getInstallAmount());
			sort.setOtherAmount(temp.getOtherAmount());
			sort.setOtherApportionAmount(temp.getOtherApportionAmount());
			sort.setOtherDirectAmount(temp.getOtherDirectAmount());
			if(temp.getIsleaf()==1){
				sort.setIsleaf(true);
			} else if(temp.getIsleaf()==0){
				sort.setIsleaf(false);
			}
			list.add(sort);
		}
		
		return list;
	}
	
	/**
	 * 计算Fa_assets_report 表中 父节点的数据的合计；
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 15, 2011
	 */
	public String updateAssetsReportData(String pid){
		Session ses = HibernateSessionFactory.getSession();
//		initAssetsReportData();
		this.collectAssetsData(ses, pid, AUDIT_TYPE_BUILDING, "", "");
		this.collectAssetsData(ses, pid, AUDIT_TYPE_EQU, "", "");
		this.collectAssetsData(ses, pid, AUDIT_TYPE_MAT, "", "");
		
		String sql = "merge into fa_assets_report t" +
				" using (  " +
				" select root_id, root_name, sum(building_amount) buildingAmount, sum(equ_amount) equAmount, sum(install_amount) installAmount," +
				" sum(OTHER_APPORTION_AMOUNT) otherApportionAmount, sum(OTHER_DIRECT_AMOUNT) otherDirectAmount, sum (OTHER_AMOUNT) otherAmount, sum(amount) amount" +
				" from (select connect_by_root(uids) root_id, connect_by_root(assets_name) root_name," +
				" building_amount, equ_amount, install_amount, OTHER_APPORTION_AMOUNT, OTHER_DIRECT_AMOUNT, OTHER_AMOUNT, amount" +
				" from fa_assets_view where connect_by_isleaf = 1 connect by prior uids = parent_id)" +
				" group by root_id, root_name order by root_id) t1" +
				" on (t.uids = t1.root_id)" +
				" when matched then" +
				" update set building_amount = t1.buildingAmount, equ_amount =t1.equAmount, install_amount = t1.installAmount, " +
				" other_apportion_amount = t1.otherApportionAmount, other_direct_amount = t1.otherDirectAmount, other_amount = t1.otherAmount, amount=t1.amount";
		System.out.println("sql----   " + sql);
		SQLQuery sq1 = ses.createSQLQuery(sql);
		sq1.executeUpdate();
		return "OK";
	}
}
