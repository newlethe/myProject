package com.sgepit.pmis.finalAccounts.finance.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FABdgInfo;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAGcType;
import com.sgepit.pmis.finalAccounts.finance.dao.FAFinanceDAO;
import com.sgepit.pmis.finalAccounts.finance.hbm.FAOtherDetailReport;
import com.sgepit.pmis.finalAccounts.finance.hbm.FAOutcomeAppReport;

public class FAOtherAppServiceImpl implements FAOtherAppService {

	private FAFinanceDAO faFinanceDAO;

	public static final String MAIN_ROOT_NO = "01";
	public static final String BUILD_ROOT_NO = BusinessConstants.BDG_BUILD_ROOT_ID;
	public static final String INSTALL_ROOT_NO = BusinessConstants.BDG_INSTALL_ROOT_ID;
	public static final String EQU_ROOT_NO = BusinessConstants.BDG_EQUIP_ROOT_ID;
	public static final String OTHER_ROOT_NO = BusinessConstants.BDG_OTHER_ROOT_ID;
	

	public static final String FA_OTHER_ROOT_NO = "0104";

	private String mainRootId;
	private String buildRootId;
	private String equipRootId;
	private String installRootId;
	private String otherRootId;
	private String faOtherRootId;
	
	public FAFinanceDAO getFaFinanceDAO() {
		return faFinanceDAO;
	}

	public void setFaFinanceDAO(FAFinanceDAO faFinanceDAO) {
		this.faFinanceDAO = faFinanceDAO;
	}
	
	/**
	 * 获得当前项目下四部分的概算id
	 */
	private void getMainPartBdgid(String pid){

		String whereStr = "bdgno = '%s' and pid = '%s'";
		List<BdgInfo> mainRootList = faFinanceDAO.findByWhere(BdgInfo.class.getName(), String.format(whereStr, MAIN_ROOT_NO, pid));
		if ( mainRootList.size() > 0 ){
			mainRootId = mainRootList.get(0).getBdgid();
		}
		//建筑
		List<BdgInfo> buildRootList = faFinanceDAO.findByWhere(BdgInfo.class.getName(), String.format(whereStr, BUILD_ROOT_NO, pid));
		if ( buildRootList.size() > 0 ){
			buildRootId = buildRootList.get(0).getBdgid();
		}
		//设备
		List<BdgInfo> equipRootList = faFinanceDAO.findByWhere(BdgInfo.class.getName(), String.format(whereStr, EQU_ROOT_NO, pid));
		if ( equipRootList.size() > 0 ){
			equipRootId = equipRootList.get(0).getBdgid();
		}
		//安装
		List<BdgInfo> installRootList = faFinanceDAO.findByWhere(BdgInfo.class.getName(), String.format(whereStr, INSTALL_ROOT_NO, pid));
		if ( installRootList.size() > 0 ){
			installRootId = installRootList.get(0).getBdgid();
		}
		//其它
		List<BdgInfo> otherRootList = faFinanceDAO.findByWhere(BdgInfo.class.getName(), String.format(whereStr, OTHER_ROOT_NO, pid));
		if ( otherRootList.size() > 0 ){
			otherRootId = otherRootList.get(0).getBdgid();
		}
		//竣建结构其它
		List<FABdgInfo> faOtherRootList = faFinanceDAO.findByWhere(FABdgInfo.class.getName(), String.format(whereStr, FA_OTHER_ROOT_NO, pid));
		if ( faOtherRootList.size() > 0 ){
			faOtherRootId = faOtherRootList.get(0).getBdgid();
		}
		
	}

	/**
	 * 向上汇总待摊支出以及各项专属费
	 * 
	 * @param outcomeApp
	 */
	private void caclOutcomeApp(FAOutcomeAppReport outcomeApp) {

		FABdgInfo curBdgInfo = (FABdgInfo) faFinanceDAO.findById(
				FABdgInfo.class.getName(), outcomeApp.getBdgid());

		List<FAOutcomeAppReport> siblingList = faFinanceDAO.findByWhere(
				FAOutcomeAppReport.class.getName(),
				"bdgid in ( select t2.bdgid from FABdgInfo t2 where t2.parent = '"
						+ curBdgInfo.getParent() + "')");
		BigDecimal totalDeferredExpense = new BigDecimal(0);
		BigDecimal totalBuildPublic = new BigDecimal(0);
		BigDecimal totalBuildExcl = new BigDecimal(0);
		BigDecimal totalInstallPublic = new BigDecimal(0);
		BigDecimal totalInstallExcl = new BigDecimal(0);
		BigDecimal totalEquipPublic = new BigDecimal(0);
		BigDecimal totalEquipExcl = new BigDecimal(0);
		for (FAOutcomeAppReport report : siblingList) {
			if (report.getDeferredExpense() != null) {
				totalDeferredExpense = totalDeferredExpense.add(report
						.getDeferredExpense());
			}
			if ( report.getBuildExclExpense() != null ){
				totalBuildExcl = totalBuildExcl.add(report.getBuildExclExpense());
			}
			if (report.getBuildPubExpense() != null) {
				totalBuildPublic = totalBuildPublic.add(report
						.getBuildPubExpense());
			}
			if (report.getInstallPubExpense() != null) {
				totalInstallPublic = totalInstallPublic.add(report
						.getInstallPubExpense());
			}
			if (report.getInstallExclExpense() != null){
				totalInstallExcl = totalInstallExcl.add(report.getInstallExclExpense());
			}
			if (report.getEquPubExpense() != null) {
				totalEquipPublic = totalEquipPublic.add(report
						.getEquPubExpense());
			}
			if (report.getEquExclExpense() != null){
				totalEquipExcl = totalEquipExcl.add(report.getEquExclExpense());
			}
		}
		
		if ( curBdgInfo.getParent().equals("root") )
			return;
		
		// 取得父节点的report对象
		FAOutcomeAppReport parentReport;
		List<FAOutcomeAppReport> parentList = faFinanceDAO.findByProperty(
				FAOutcomeAppReport.class.getName(), "bdgid", curBdgInfo
						.getParent());
		if (parentList.size() > 0) {
			parentReport = parentList.get(0);
		} else {
			FABdgInfo parentBdg = (FABdgInfo) faFinanceDAO.findById(
					FABdgInfo.class.getName(), curBdgInfo.getParent());
			parentReport = new FAOutcomeAppReport();
			parentReport.setBdgid(parentBdg.getBdgid());
			parentReport.setBdgname(parentBdg.getBdgname());
		}

		parentReport.setDeferredExpense(totalDeferredExpense);
		parentReport.setBuildPubExpense(totalBuildPublic);
		parentReport.setBuildExclExpense(totalBuildExcl);
		parentReport.setInstallPubExpense(totalInstallPublic);
		parentReport.setInstallExclExpense(totalInstallExcl);
		parentReport.setEquPubExpense(totalEquipPublic);
		parentReport.setEquExclExpense(totalEquipExcl);
		
		//重新计算共益费
		//updatePubExpense(parentReport);
		
		faFinanceDAO.saveOrUpdate(parentReport);

		if (!parentReport.getBdgid().equals(faOtherRootId)) {
			caclOutcomeApp(parentReport);
		}

	}

	public void saveOutcomeApp(FAOutcomeAppReport outcomeApp) {
		if ( outcomeApp.getUids() != null ){
			if ( outcomeApp.getUids().equals("") ){
				outcomeApp.setUids(null);
			}
		}
		faFinanceDAO.saveOrUpdate(outcomeApp);
		getMainPartBdgid(outcomeApp.getPid());
		caclOutcomeApp(outcomeApp);

	}

	public void autoCalcPubExpense(FAOutcomeAppReport outcomeApp) {
		getMainPartBdgid(outcomeApp.getPid());
		// 概算总额
//		BdgInfo mainRootBdg = (BdgInfo) faFinanceDAO.findById(BdgInfo.class
//				.getName(), MAIN_ROOT_ID);
		BigDecimal totalBdg = new BigDecimal(0);
		BigDecimal buildBdg = new BigDecimal(0);
		BigDecimal installBdg = new BigDecimal(0);
		BigDecimal equBdg = new BigDecimal(0);
		// 建筑
		Object buildObj = faFinanceDAO.findById(BdgInfo.class.getName(),
				buildRootId);
		if (buildObj != null) {
			buildBdg = new BigDecimal(((BdgInfo) buildObj).getBdgmoney());
		}
		// 安装
		Object installObj = faFinanceDAO.findById(BdgInfo.class.getName(),
				installRootId);
		if (installObj != null) {
			installBdg = new BigDecimal(((BdgInfo) installObj).getBdgmoney());
		}
		// 设备
		Object equObj = faFinanceDAO.findById(BdgInfo.class.getName(),
				equipRootId);
		if (equObj != null) {
			equBdg = new BigDecimal(((BdgInfo) equObj).getBdgmoney());
		}
		
		totalBdg = buildBdg.add(installBdg).add(equBdg);

		// 各项专属费
		BigDecimal buildExclExp = outcomeApp.getBuildExclExpense() == null ? new BigDecimal(
				0)
				: outcomeApp.getBuildExclExpense();
		BigDecimal installExclExp = outcomeApp.getInstallExclExpense() == null ? new BigDecimal(
				0)
				: outcomeApp.getInstallExclExpense();
		BigDecimal equExclExp = outcomeApp.getEquExclExpense() == null ? new BigDecimal(
				0)
				: outcomeApp.getEquExclExpense();

		// 待摊支出
		BigDecimal defExp = outcomeApp.getDeferredExpense() == null ? new BigDecimal(0)
				: outcomeApp.getDeferredExpense();

		BigDecimal remain = defExp.subtract(buildExclExp.add(installExclExp)
				.add(equExclExp));
		outcomeApp.setBuildPubExpense(remain
				.multiply(buildBdg.divide(totalBdg,6 , BigDecimal.ROUND_HALF_UP)).setScale(2, BigDecimal.ROUND_HALF_UP));
		outcomeApp.setInstallPubExpense(remain.multiply(installBdg
				.divide(totalBdg,6 , BigDecimal.ROUND_HALF_UP)).setScale(2, BigDecimal.ROUND_HALF_UP));
		outcomeApp.setEquPubExpense(remain.multiply(equBdg.divide(totalBdg,6 , BigDecimal.ROUND_HALF_UP)).setScale(2, BigDecimal.ROUND_HALF_UP));

	}

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		
		//费用分摊定义模块其他费用的概算树
		if(treeName.equals("faOutcomeAppTree")) {
			if ( parentId.equals("-1") ){
				String pid = ((String[])params.get("pid"))[0];
				getMainPartBdgid(pid);
				parentId = otherRootId;
			}
			
			List<FABdgInfo> objects = faFinanceDAO.findByProperty(FABdgInfo.class
					.getName(), "parent", parentId, "bdgno");
			for (FABdgInfo bdgInfo : objects) {
				ColumnTreeNode columnTreeNode = new ColumnTreeNode();
				TreeNode node = new TreeNode();
				
				boolean leaf = bdgInfo.getIsLeaf();
				node.setId(bdgInfo.getBdgid());
				node.setText(bdgInfo.getBdgname());
				if (leaf) {
					node.setLeaf(true);
					node.setIconCls("task");
				} else {
					node.setLeaf(false);
					node.setCls("master-task");
					node.setIconCls("task-folder");
				}
				node.setIfcheck("none");
				columnTreeNode.setTreenode(node);
				FAOutcomeAppReport outcomeApp;
				List outcomeAppList = faFinanceDAO.findByProperty(
						FAOutcomeAppReport.class.getName(), "bdgid", bdgInfo
						.getBdgid());
				if (outcomeAppList.size() == 0) {
					outcomeApp = new FAOutcomeAppReport();
					outcomeApp.setBdgid(bdgInfo.getBdgid());
					outcomeApp.setBdgname(bdgInfo.getBdgname());
					
				} else {
					outcomeApp = (FAOutcomeAppReport) outcomeAppList.get(0);
					
				}
				
				JSONObject jo = JSONObject.fromObject(outcomeApp);
				columnTreeNode.setColumns(jo); // columns
				list.add(columnTreeNode);
			}
		}
		
		//费用分摊定义模块其他费用的概算树
		if(treeName.equals("faOutcomeAppTree")) {
			
		}
		return list;
	}

	public void initAllOutcomeApp(String pid) {
		getMainPartBdgid(pid);
		DetachedCriteria criteria = DetachedCriteria
				.forClass(FAOutcomeAppReport.class);
		criteria
				.add(Restrictions
						.sqlRestriction(" bdgid in (select bdgid from bdg_info start with bdgid = '"
								+ otherRootId
								+ "' connect by prior bdgid = parent )"));
		List<FAOutcomeAppReport> list = faFinanceDAO.getHibernateTemplate()
				.findByCriteria(criteria);
		for (FAOutcomeAppReport outcomeApp : list) {
			caclOutcomeApp(outcomeApp);
		}
	}
	
	public void initFAOtherDetailReport(Boolean force, String pid){
		initFAOtherDetailReport(force, pid, false);
	}

	public void initFAOtherDetailReport(Boolean force, String pid, Boolean exchangeData) {
		// 若报表中有数据且 force = false 则不进行初始化
		if (!force) {
			List repList = faFinanceDAO.findByProperty(FAOtherDetailReport.class
					.getName(), "pid", pid);
			if (repList.size() > 0) {
				if ( exchangeData ){
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					String sqlBefore = "delete from fa_overall_report where pid = '" + pid + "'";
					List<PcDataExchange> excList = dataExchangeService.getExcDataList(repList, "1", pid, sqlBefore, null, "待摊基建支出分摊明细表【竣建03表附表】");
					if ( excList.size() > 0 )
						dataExchangeService.sendExchangeData(excList);
					exchangeAllFaBdgInfoByPid(pid);
				}
				return;
			}

		}
		//数据交换列表 
		List<PcDataExchange> dataExchangeList = new ArrayList<PcDataExchange>();

		String sql = "delete from fa_other_detail_report where pid='" + pid + "'";
		JdbcUtil.update(sql);

		String rootId = faOtherRootId;
		List<FABdgInfo> bdgList = new ArrayList<FABdgInfo>();
		String lastLevelId = "03";
		List gcTypeList = faFinanceDAO.findByProperty(FAGcType.class.getName(),
				"gcTypeName", "分项工程");
		if (gcTypeList.size() > 0) {
			lastLevelId = ((FAGcType) gcTypeList.get(0)).getUids();
		}
		getOtherBdgList(bdgList, rootId, lastLevelId);
		for (FABdgInfo bdgInfo : bdgList) {
			FAOtherDetailReport otherDetailReport = new FAOtherDetailReport();
			
			otherDetailReport.setPid(bdgInfo.getPid());

			otherDetailReport.setBdgid(bdgInfo.getBdgid());
			otherDetailReport.setBdgname(bdgInfo.getBdgname());

			if (bdgInfo.getOtherbdg() != null) {
				Object obj = faFinanceDAO.findById(BdgInfo.class.getName(),
						bdgInfo.getOtherbdg());
				if (obj != null) {
					BdgInfo otherBdg = (BdgInfo) obj;
					otherDetailReport
							.setBdgmoney(new BigDecimal(
									otherBdg.getBdgmoney() == null ? 0
											: otherBdg.getBdgmoney()));

				}
			}

			faFinanceDAO.saveOrUpdate(otherDetailReport);
			long xh = 1;
			String txGroup = SnUtil.getNewID("tx-");
			if ( exchangeData ){
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("FA_OTHER_DETAIL_REPORT");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("UIDS", otherDetailReport.getUids());
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				exchange.setBizInfo("待摊基建支出分摊明细表【竣建03表附表】");
				exchange.setXh(xh++);
				exchange.setTxGroup(txGroup);
				exchange.setPid("1");
				dataExchangeList.add(exchange);
			}
		}
		
		//进行数据交换
		if ( exchangeData && dataExchangeList.size() > 0){
			//设置前置SQL，清空已有的报表数据
			dataExchangeList.get(0).setSpareC1(sql);
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
				dataExchangeService.sendExchangeData(dataExchangeList);
			exchangeAllFaBdgInfoByPid(pid);
		}


	}

	public void initFAOutcomeAppReport(Boolean force, String pid) {
		// 若报表中有数据且 force = false 则不进行初始化
		if (!force) {
			List repList = faFinanceDAO.findByProperty(FAOtherDetailReport.class
					.getName(), "pid", pid);
			if (repList.size() > 0) {
				return;
			}

		}

		String sql = "delete from fa_other_detail_report where pid = '" + pid + "'";
		JdbcUtil.update(sql);

		String rootId = faOtherRootId;
		List<FABdgInfo> bdgList = new ArrayList<FABdgInfo>();
		String lastLevelId = "03";
		List gcTypeList = faFinanceDAO.findByProperty(FAGcType.class.getName(),
				"gcTypeName", "分项工程");
		if (gcTypeList.size() > 0) {
			lastLevelId = ((FAGcType) gcTypeList.get(0)).getUids();
		}
		getOtherBdgList(bdgList, rootId, lastLevelId);

		for (FABdgInfo faBdgInfo : bdgList) {
			FAOutcomeAppReport outcomeAppReport = new FAOutcomeAppReport();

			outcomeAppReport.setBdgid(faBdgInfo.getOtherbdg());
			outcomeAppReport.setBdgname(faBdgInfo.getBdgname());
		}

	}

	private void getOtherBdgList(List<FABdgInfo> bdgList, String parent,
			String lastLevelId) {
		if(parent==null || parent.length()==0) {
			parent = "0104";
		}
		Object bdgInfoObj = faFinanceDAO.findById(FABdgInfo.class.getName(),
				parent);
		if (bdgInfoObj != null) {
			FABdgInfo bdgInfo = (FABdgInfo) bdgInfoObj;

			// if (bdgInfo.getOtherbdg() == null) {
			// return;
			// } else if (bdgInfo.getInstallbdg().equals("")) {
			// return;
			//
			// }

			bdgList.add(bdgInfo);
			if (bdgInfo.getGcType() != null) { // 到了指定的层级则返回（单项工程, etc...）
				if (bdgInfo.getGcType().equals(lastLevelId)) {
					return;
				}
			}

			List<FABdgInfo> list = faFinanceDAO.findByProperty(FABdgInfo.class
					.getName(), "parent", parent);
			for (FABdgInfo bdgInfo2 : list) {
				getOtherBdgList(bdgList, bdgInfo2.getBdgid(), lastLevelId);
			}

		}

	}
	
	/**
	 * 根据pid对竣工决算结构全部进行数据交换
	 * @param pid
	 * @author zhangh 2012-05-22
	 */
	public void exchangeAllFaBdgInfoByPid(String pid){
		//数据交互竣工决算概算结构
		List<FABdgInfo> list = faFinanceDAO.findByProperty(FABdgInfo.class.getName(), "pid", pid);
		PCDataExchangeService dataExchangeService = 
			(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		List<PcDataExchange> dataExchangeList = dataExchangeService.getExcDataList(list, "1", pid, null, null, "数据交互竣工决算概算结构");
		dataExchangeService.sendExchangeData(dataExchangeList);
	}
	
}
