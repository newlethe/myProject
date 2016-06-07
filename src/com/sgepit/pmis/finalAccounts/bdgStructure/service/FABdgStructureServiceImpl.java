package com.sgepit.pmis.finalAccounts.bdgStructure.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.VBdgpayapp;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.finalAccounts.bdgStructure.dao.FABdgStructureDAO;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FABdgInfo;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FABuildOveReport;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAGcType;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAInstallEquReport;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAOverallReport;
import com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAUnfinishedPrjReport;
import com.sgepit.pmis.finalAccounts.report.hbm.FAReportConfig;

public class FABdgStructureServiceImpl implements FABdgStructureService {

	private static final String FA_OVERALL_REPORT = "FA_OVERALL_02";
	private static final String FA_BUILD_REPORT = "FA_BUILD_OVE_02-1";
	private static final String FA_INSTALL_EQU_REPORT = "FA_INSTALL_EQU_02-2";
	private static final String FA_UNFINISHED_PRJ_REPORT = "FA_UNFINISHED_PRJ_02A";

	public static final String MAIN_ROOT_ID = "01";

	
	private FABdgStructureDAO bdgStructureDAO;
	private String beanName = BusinessConstants.FA_BDG_STRUC_PKG
			+ BusinessConstants.FA_BDG_INFO;

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException {
		String pid = "";
		if (params.get("pid") != null) {
			pid = ((String[]) params.get("pid"))[0];
		}
		if (treeName.equals("faBdgTree")) {
			return getFaBdgInfoTree(parentId, pid);
		} else if (treeName.equals("bdgSelectTree")) {
			return getSelectBdgTree(parentId, pid);
		} else if (treeName.equals("bdgSelectTreeToLevel")) {
			String[] levelStr = (String[]) params.get("level");
			Integer level = 6;
			try {
				level = Integer.valueOf(levelStr[0]);
			} catch (Exception e) {
				System.out.println("Number format error");
			}
			return getSelectBdgTree(parentId, pid, level);

		} else if (treeName.equals("bdgAppDefineTree")) {
			String curParentId = parentId;
			if ( parentId.equals("-1") ){
				
				String whereStr = "bdgno = '%s' and pid = '%s'";
				String defTreeType = ((String[]) params.get("defTreeType"))[0];
				
				if ( defTreeType.equalsIgnoreCase("build") ){
					//建筑
					List<BdgInfo> buildRootList = bdgStructureDAO.findByWhere(BdgInfo.class.getName(), String.format(whereStr, BusinessConstants.BDG_BUILD_ROOT_ID, pid));
					if ( buildRootList.size() > 0 ){
						curParentId = buildRootList.get(0).getBdgid();
					}
				}
				else if ( defTreeType.equalsIgnoreCase("install") ){
					//安装
					List<BdgInfo> installRootList = bdgStructureDAO.findByWhere(BdgInfo.class.getName(), String.format(whereStr, BusinessConstants.BDG_INSTALL_ROOT_ID, pid));
					if ( installRootList.size() > 0 ){
						curParentId = installRootList.get(0).getBdgid();
					}
				}
				else if ( defTreeType.equalsIgnoreCase("other") ){
					//其它
					List<BdgInfo> otherRootList = bdgStructureDAO.findByWhere(BdgInfo.class.getName(), String.format(whereStr, BusinessConstants.BDG_OTHER_ROOT_ID, pid));
					if ( otherRootList.size() > 0 ){
						curParentId = otherRootList.get(0).getBdgid();
					}
				}
			
			}
			return getDefineAppTree(curParentId, pid);
		}

		return null;
	}

	public void deleteNode(String id, Boolean exchangeData) throws BusinessException {
		FABdgInfo node = (FABdgInfo) bdgStructureDAO.findById(beanName, id);

		String sql = "delete from FA_BDG_INFO where bdgid in ( select bdgid from FA_BDG_INFO start with bdgid = '"
				+ id + "' connect by prior bdgid = parent )";
		JdbcUtil.update(sql);
		
		
		List<PcDataExchange> exchangeList = new ArrayList<PcDataExchange>();
		String txGroup = "";
		if ( exchangeData ){
			PcDataExchange dataExchange = new PcDataExchange();
			txGroup = SnUtil.getNewID("tx-");
			dataExchange.setTableName("FA_BDG_INFO");
			dataExchange.setKeyValue(SnUtil.getNewID("sql-"));
			dataExchange.setSqlData(sql);
			dataExchange.setTxGroup(txGroup);
			dataExchange.setSuccessFlag("0");
			dataExchange.setBizInfo("竣工决算概算结构删除");
			dataExchange.setXh(1L);

			dataExchange.setPid("1");
			exchangeList.add(dataExchange);
			}
		
		List siblingList = bdgStructureDAO.findByProperty(beanName, "parent",
				node.getParent());
		Integer siblingCount = siblingList.size();

		if (siblingCount == 0) {
			// 将父节点的isLeaf设为true

			FABdgInfo parent = (FABdgInfo) bdgStructureDAO.findById(beanName,
					node.getParent());
			parent.setIsLeaf(true);
			bdgStructureDAO.saveOrUpdate(parent);
			
			if ( exchangeData ){
				//数据交换
				PcDataExchange exchange2 = new PcDataExchange();
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("bdgid", parent.getBdgid());
				kvarr.add(kv);
				exchange2.setKeyValue(kvarr.toString());
				exchange2.setSuccessFlag("0");
				exchange2.setBizInfo("竣工决算概算结构修改");
				exchange2.setXh(2L);
				exchange2.setTxGroup(txGroup);
				exchange2.setPid("1");
				exchangeList.add(exchange2);
			}
			
		}
		
		if ( exchangeData ){
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			
			dataExchangeService.sendExchangeData(exchangeList);
		}


	}

	private void getBdgList(List<FABdgInfo> bdgList, String parent,
			String lastLevelId) {
		getBdgList(bdgList, parent, lastLevelId, null);
	}

	private void getBdgList(List<FABdgInfo> bdgList, String parent,
			String lastLevelId, String reportType) {
		Object bdgInfoObj = bdgStructureDAO.findById(FABdgInfo.class.getName(),
				parent);
		if (bdgInfoObj != null) {
			FABdgInfo bdgInfo = (FABdgInfo) bdgInfoObj;
			if (reportType != null) {
				if (reportType.equals(FA_BUILD_REPORT)) { // 筛选出建筑概算
					if (bdgInfo.getBuildbdg() == null) {
						return;
					} else if (bdgInfo.getBuildbdg().equals("")) {
						return;
					}
				} else if (reportType.equals(FA_INSTALL_EQU_REPORT)) { // 筛选出设备-安装概算
					if (bdgInfo.getInstallbdg() == null
							&& bdgInfo.getEquipbdg() == null) {
						return;
					} else {
						if (bdgInfo.getInstallbdg() != null) {
							if (bdgInfo.getInstallbdg().equals("")) {
								return;
							}
						}
						if (bdgInfo.getEquipbdg() != null) {
							if (bdgInfo.getEquipbdg().equals("")) {
								return;
							}
						}
					}
				} else if (reportType.equals(FA_UNFINISHED_PRJ_REPORT)) { // 筛选出未完工工程
					if (!hasUnfinishedPrj(bdgInfo)) {
						return;
					}
				}
			}
			bdgList.add(bdgInfo);
			if (bdgInfo.getGcType() != null) { // 到了指定的层级则返回（单项工程, etc...）
				if (bdgInfo.getGcType().equals(lastLevelId)) {
					return;
				}

			}

			List<FABdgInfo> list = bdgStructureDAO.findByProperty(
					FABdgInfo.class.getName(), "parent", parent);
			for (FABdgInfo bdgInfo2 : list) {
				getBdgList(bdgList, bdgInfo2.getBdgid(), lastLevelId,
						reportType);
			}

		}

	}

	public FABdgStructureDAO getBdgStructureDAO() {
		return bdgStructureDAO;
	}

	/*
	 * 工程项目对应树
	 */
	public List<ColumnTreeNode> getDefineAppTree(String parentId, String pid)
			throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		
		String whereStr = "parent = '%s' and pid = '%s'";
		whereStr = String.format(whereStr, parentId, pid);
		List<BdgInfo> objects = bdgStructureDAO.findByWhere(
				BusinessConstants.BDG_PACKAGE
						.concat(BusinessConstants.BDG_INFO), whereStr, "bdgno");
		Iterator<BdgInfo> itr = objects.iterator();

		while (itr.hasNext()) {
			ColumnTreeNode cn = new ColumnTreeNode();
			TreeNode n = new TreeNode();
			BdgInfo temp = (BdgInfo) itr.next();

			if (temp.getCorrespondbdg() != null) {
				BdgInfo bdgCo = (BdgInfo) bdgStructureDAO.findById(
						BusinessConstants.BDG_PACKAGE
								.concat(BusinessConstants.BDG_INFO), temp
								.getCorrespondbdg());
				temp.setCobdgno(bdgCo.getBdgno());
				temp.setCobdgname(bdgCo.getBdgname());
			}
			int leaf = temp.getIsleaf().intValue();

			n.setId(temp.getBdgid()); // treenode.id
			n.setText(temp.getBdgname()); // treenode.text
			if (leaf == 1 || temp.getBdgno().length() > 13) {
				n.setLeaf(true);
				n.setIconCls("task");
			} else {
				n.setLeaf(false); // treenode.leaf
				n.setCls("master-task"); // treenode.cls
				n.setIconCls("task-folder"); // treenode.iconCls
			}

			cn.setTreenode(n); // ColumnTreeNode.treenode

			JSONObject jo = JSONObject.fromObject(temp);
			cn.setColumns(jo); // ColumnTreeNode.columns
			list.add(cn);
		}

		return list;
	}

	public List<ColumnTreeNode> getFaBdgInfoTree(String parentId, String pid) {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String parent = parentId != null && !parentId.equals("") ? parentId
				: BusinessConstants.FA_BDG_ROOT_ID;
		String whereStr = "parent = '%s' and pid = '%s'";
		whereStr = String.format(whereStr, parent, pid);
		List<FABdgInfo> objects = bdgStructureDAO.findByWhere(beanName,
				whereStr, "bdgno");

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
				node.setLeaf(false); // treenode.leaf
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}

			node.setIfcheck("none");
			columnTreeNode.setTreenode(node); // ColumnTreeNode.treenode

			setExtendAttributes(bdgInfo);

			JSONObject jo = JSONObject.fromObject(bdgInfo);
			columnTreeNode.setColumns(jo); // columns
			list.add(columnTreeNode);
		}

		return list;

	}

	/**
	 * 计算该概算发生的实际价值
	 * 
	 * @param bdgid
	 *            概算id
	 * @param internal
	 *            若为真，则取出该概算的“已付款分摊”金额
	 * @return
	 */
	private BigDecimal getFinancialValue(String bdgid, boolean internal) {
		if (bdgid == null)
			return null;
		if (bdgid.equals(""))
			return null;

		BigDecimal retVal = null;
		List<VBdgpayapp> list = bdgStructureDAO.findByProperty(VBdgpayapp.class
				.getName(), "bdgid", bdgid, "bdgid", 0, 1);
		if (list.size() > 0) {
			Object vBdgObj = list.get(0);
			if (vBdgObj instanceof VBdgpayapp) {
				VBdgpayapp bdgPayapp = (VBdgpayapp) vBdgObj;
				if (bdgPayapp.getSumfactpay() != null) {
					retVal = new BigDecimal(
							bdgPayapp.getSumfactpay() == null ? 0 : bdgPayapp
									.getSumfactpay());

				}
			}

		}
		return retVal;
	}

	public List<ColumnTreeNode> getSelectBdgTree(String parentId, String pid) {
		return getSelectBdgTree(parentId, pid, null);
	}

	public List<ColumnTreeNode> getSelectBdgTree(String parentId, String pid,
			Integer level) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		String whereStr = "parent = '%s' and pid = '%s'";
		whereStr = String.format(whereStr, parentId, pid);
		List<BdgInfo> bdgInfos = bdgStructureDAO.findByWhere(BdgInfo.class
				.getName(), whereStr, "bdgno");
		for (BdgInfo bdgInfo : bdgInfos) {
			ColumnTreeNode columnTreeNode = new ColumnTreeNode();
			TreeNode node = new TreeNode();

			boolean leaf = bdgInfo.getIsleaf() == 1;

			if (leaf) {
				node.setLeaf(true);
				node.setIconCls("task");
			} else {
				node.setLeaf(false); // treenode.leaf
				node.setCls("master-task"); // treenode.cls
				node.setIconCls("task-folder"); // treenode.iconCls
			}

			if (level != null) {
				if (bdgInfo.getBdgno().length() == level * 2) {
					node.setLeaf(true);
					node.setIconCls("task");
				}
			}

			columnTreeNode.setTreenode(node);
			JSONObject jo = JSONObject.fromObject(bdgInfo);

			// UIProvider
			String uiProvider = "col";

			jo.accumulate("uiProvider", uiProvider);

			columnTreeNode.setColumns(jo); // columns
			list.add(columnTreeNode);
		}

		return list;
	}
	
	public void initFABuildOveReport(Boolean force, String pid){
		initFABuildOveReport(force, pid, false);
	}

	public void initFABuildOveReport(Boolean force, String pid, Boolean exchangeData) {
		// 若报表中有数据且 force = false 则不进行初始化
		if (!force) {
			List repList = bdgStructureDAO.findByWhere(FABuildOveReport.class
					.getName(), "pid = '" + pid + "'");
			if (repList.size() > 0) {
				if ( exchangeData ){
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					String sqlBefore = "delete from fa_build_ove_report where pid = '" + pid + "'";
					List<PcDataExchange> excList = dataExchangeService.getExcDataList(repList, "1", pid, sqlBefore, null, "竣工工程决算一览表（建筑工程部分）【竣建02-1表】");
					if ( excList.size() > 0 )
						dataExchangeService.sendExchangeData(excList);
					exchangeAllFaBdgInfoByPid(pid);
				}
				return;
			}
		}	
		//数据交换列表
		List<PcDataExchange> dataExchangeList = new ArrayList<PcDataExchange>();

		String sql = "delete from fa_build_ove_report where pid = '" + pid + "'";
		JdbcUtil.update(sql);
		// 财务数据来源（内部，外部）
		String finValueSource = "";
		String lastLevelId = "03";

		List<FAReportConfig> configList = bdgStructureDAO.findByProperty(
				FAReportConfig.class.getName(), "reportModuleName",
				FA_BUILD_REPORT);
		if (configList.size() > 0) {
			FAReportConfig config = configList.get(0);
			finValueSource = config.getFinancialSource();
			lastLevelId = config.getBdgLevel();
		} else {
			List gcTypeList = bdgStructureDAO.findByProperty(FAGcType.class
					.getName(), "gcTypeName", "分项工程");
			if (gcTypeList.size() > 0) {
				lastLevelId = ((FAGcType) gcTypeList.get(0)).getUids();
			}
		}

		//找到当前项目的概算根节点id
		String rootSql = "select bdgid from bdg_info where parent = '0' and pid = '" + pid + "'";
		List<Map<String, Object>> resultList = JdbcUtil.query(rootSql);
		if ( resultList.size() == 0 )
			return;
		String rootId = resultList.get(0).get("bdgid").toString();
		List<FABdgInfo> bdgList = new ArrayList<FABdgInfo>();

		getBdgList(bdgList, rootId, lastLevelId, FA_BUILD_REPORT);
		for (FABdgInfo bdgInfo : bdgList) {
			FABuildOveReport buildOveReport = new FABuildOveReport();
			buildOveReport.setPid(bdgInfo.getPid());
			buildOveReport.setBdgid(bdgInfo.getBdgid());
			buildOveReport.setBdgname(bdgInfo.getBdgname());

			// 建筑-概算
			if (bdgInfo.getBuildbdg() != null) {
				if (!bdgInfo.getBuildbdg().equals("")) {
					Object obj = bdgStructureDAO.findById(BdgInfo.class
							.getName(), bdgInfo.getBuildbdg());
					if (obj != null) {
						BdgInfo sysBdgBuild = (BdgInfo) obj;
						BigDecimal buildBdgValue = new BigDecimal(sysBdgBuild
								.getBdgmoney() == null ? 0d : sysBdgBuild
								.getBdgmoney());
						buildOveReport.setBuildBdgValue(buildBdgValue);
					}
				}
			}
			if (finValueSource.equalsIgnoreCase("internal")) {
				BigDecimal buildReal = getFinancialValue(bdgInfo.getBuildbdg(),
						true);
				if (buildReal != null) {
					buildOveReport.setBuildRealValue(buildReal);
				}
			}

			bdgStructureDAO.saveOrUpdate(buildOveReport);
			long xh = 1;
			String txGroup = SnUtil.getNewID("tx-");
			if ( exchangeData && dataExchangeList.size() > 0 ){
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("FA_BUILD_OVE_REPORT");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("UIDS", buildOveReport.getUids());
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				exchange.setBizInfo("竣工工程决算一览表（建筑工程部分）【竣建02-1表】");
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
	
	public void initFAInstallEquReport(Boolean force, String pid){
		initFAInstallEquReport(force, pid, false);
	}

	public void initFAInstallEquReport(Boolean force, String pid, Boolean exchangeData) {
		// 若报表中有数据且 force = false 则不进行初始化
		if (!force) {
			List repList = bdgStructureDAO.findByWhere(FAInstallEquReport.class
					.getName(), "pid = '" + pid + "'");
			if (repList.size() > 0) {
				if ( exchangeData ){
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					String sqlBefore = "delete from fa_install_equ_report where pid = '" + pid + "'";
					List<PcDataExchange> excList = dataExchangeService.getExcDataList(repList, "1", pid, sqlBefore, null, "竣工工程决算一览表（安装工程和设备购置部分）【竣建02-2表】");
					if ( excList.size() > 0 )
						dataExchangeService.sendExchangeData(excList);
					exchangeAllFaBdgInfoByPid(pid);
				}
				return;
			}

		}
		
		//数据交换列表
		List<PcDataExchange> dataExchangeList = new ArrayList<PcDataExchange>();

		String sql = "delete from fa_install_equ_report where pid = '" + pid + "'";
		JdbcUtil.update(sql);

		// 财务数据来源（内部，外部）
		String finValueSource = "";
		// 细化到的工程类型
		String lastLevelId = "03";

		List<FAReportConfig> configList = bdgStructureDAO.findByProperty(
				FAReportConfig.class.getName(), "reportModuleName",
				FA_INSTALL_EQU_REPORT);
		if (configList.size() > 0) {
			FAReportConfig config = configList.get(0);
			finValueSource = config.getFinancialSource();
			lastLevelId = config.getBdgLevel();
		} else {
			List gcTypeList = bdgStructureDAO.findByProperty(FAGcType.class
					.getName(), "gcTypeName", "分项工程");
			if (gcTypeList.size() > 0) {
				lastLevelId = ((FAGcType) gcTypeList.get(0)).getUids();
			}
		}

		//找到当前项目的概算根节点id
		String rootSql = "select bdgid from bdg_info where parent = '0' and pid = '" + pid + "'";
		List<Map<String, Object>> resultList = JdbcUtil.query(rootSql);
		if ( resultList.size() == 0 )
			return;
		String rootId = resultList.get(0).get("bdgid").toString();
		List<FABdgInfo> bdgList = new ArrayList<FABdgInfo>();

		getBdgList(bdgList, rootId, lastLevelId, FA_INSTALL_EQU_REPORT);
		for (FABdgInfo bdgInfo : bdgList) {
			FAInstallEquReport installEquReport = new FAInstallEquReport();
			installEquReport.setPid(bdgInfo.getPid());
			installEquReport.setBdgid(bdgInfo.getBdgid());
			installEquReport.setBdgname(bdgInfo.getBdgname());
			// 安装-概算
			if (bdgInfo.getInstallbdg() != null) {
				Object obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
						bdgInfo.getInstallbdg());
				if (obj != null) {
					BdgInfo sysBdgInfo = (BdgInfo) obj;
					installEquReport.setInstallBdgValue(new BigDecimal(
							sysBdgInfo.getBdgmoney() == null ? 0d : sysBdgInfo
									.getBdgmoney()));
				}
			}
			// 设备-概算
			if (bdgInfo.getEquipbdg() != null) {
				Object obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
						bdgInfo.getEquipbdg());
				if (obj != null) {
					BdgInfo sysBdgInfo = (BdgInfo) obj;
					installEquReport.setEquBdgValue(new BigDecimal(sysBdgInfo
							.getBdgmoney() == null ? 0d : sysBdgInfo
							.getBdgmoney()));
				}
			}
			if (finValueSource.equalsIgnoreCase("internal")) {
				BigDecimal totalInstallValue = new BigDecimal(0);
				BigDecimal installRealValue = getFinancialValue(bdgInfo
						.getInstallbdg(), true);
				if (installRealValue != null) {
					totalInstallValue = installRealValue;

				}
				installEquReport.setInstallRealValue(totalInstallValue);

				BigDecimal totalEquValue = new BigDecimal(0);
				BigDecimal equRealValue = getFinancialValue(bdgInfo
						.getEquipbdg(), true);
				if (equRealValue != null) {
					totalEquValue = equRealValue;

				}
				installEquReport.setEquRealValue(totalEquValue);
			}

			bdgStructureDAO.saveOrUpdate(installEquReport);
			long xh = 1;
			String txGroup = SnUtil.getNewID("tx-");
			if ( exchangeData ){
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("FA_INSTALL_EQU_REPORT");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("UIDS", installEquReport.getUids());
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				exchange.setBizInfo("竣工工程决算一览表（安装工程和设备购置部分）【竣建02-2表】");
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

	/**
	 * 初始化[竣工工程决算一览表(竣建02)表]，不进行数据交互
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 */
	public void initFAOverallReport( Boolean force, String pid ){
		initFAOverallReport(force, pid, false);
	}
	
	/**
	 * 初始化[竣工工程决算一览表(竣建02)表]
	 * @param force 是否强制初始化，如果该参数为true，则会覆盖掉原有生成的报表数据；<br />如果参数为false，会判断是否存在有报表数据，若存在则不执行任何操作
	 * @param pid 初始化的项目PID
	 * @param exchangeData 是否进行数据交换。如果该参数为True，会在初始化的同时将数据发送到集团
	 */
	public void initFAOverallReport(Boolean force, String pid, Boolean exchangeData) {
		
	
		if (!force) {
			List repList = bdgStructureDAO.findByWhere(FAOverallReport.class
					.getName(), "pid = '" + pid + "'");
			if (repList.size() > 0) {
				if ( exchangeData ){
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					String sqlBefore = "delete from fa_overall_report where pid = '" + pid + "'";
					List<PcDataExchange> excList = dataExchangeService.getExcDataList(repList, "1", pid, sqlBefore, null, "竣工工程决算一览表(竣建02)表");
					if ( excList.size() > 0 )
					dataExchangeService.sendExchangeData(excList);
					exchangeAllFaBdgInfoByPid(pid);
				}
				return;
			}
		}
		
		//数据交换列表
		List<PcDataExchange> dataExchangeList = new ArrayList<PcDataExchange>();

		String sql = "delete from fa_overall_report where pid = '" + pid + "'";
		JdbcUtil.update(sql);

		// 财务数据来源
		String finValueSource = "";
		// 细化到的概算工程类型
		String lastLevelId = "01";

		List<FAReportConfig> configList = bdgStructureDAO.findByProperty(
				FAReportConfig.class.getName(), "reportModuleName",
				FA_OVERALL_REPORT);
		if (configList.size() > 0) {
			FAReportConfig config = configList.get(0);
			finValueSource = config.getFinancialSource();
			lastLevelId = config.getBdgLevel();
		} else {
			List gcTypeList = bdgStructureDAO.findByProperty(FAGcType.class
					.getName(), "gcTypeName", "单项工程");
			if (gcTypeList.size() > 0) {
				lastLevelId = ((FAGcType) gcTypeList.get(0)).getUids();
			}
		}

		//找到当前项目的概算根节点id
		String rootSql = "select bdgid from bdg_info where parent = '0' and pid = '" + pid + "'";
		List<Map<String, Object>> resultList = JdbcUtil.query(rootSql);
		if ( resultList.size() == 0 )
			return;
		String rootId = resultList.get(0).get("bdgid").toString();
		List<FABdgInfo> bdgList = new ArrayList<FABdgInfo>();

		getBdgList(bdgList, rootId, lastLevelId);

		for (FABdgInfo bdgInfo : bdgList) {
			FAOverallReport overallReport = new FAOverallReport();
			overallReport.setPid(bdgInfo.getPid());
			overallReport.setFaBdgid(bdgInfo.getBdgid());
			overallReport.setFaBdgname(bdgInfo.getBdgname());

			Object obj;
			BigDecimal bdgTotal = new BigDecimal(0);
			// 建筑-概算
			if (bdgInfo.getBuildbdg() != null) {
				if (!bdgInfo.getBuildbdg().equals("")) {
					obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
							bdgInfo.getBuildbdg());
					if (obj != null) {
						BdgInfo sysBdgBuild = (BdgInfo) obj;
						BigDecimal buildBdgValue = new BigDecimal(sysBdgBuild
								.getBdgmoney() == null ? 0d : sysBdgBuild
								.getBdgmoney());
						overallReport.setBuildBdgValue(buildBdgValue);
						bdgTotal = bdgTotal.add(buildBdgValue);
					}
				}
			}

			// 设备-概算
			if (bdgInfo.getEquipbdg() != null) {
				if (!bdgInfo.getEquipbdg().equals("")) {
					obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
							bdgInfo.getEquipbdg());
					if (obj != null) {
						BdgInfo sysBdgEqu = (BdgInfo) obj;
						BigDecimal equipBdgValue = new BigDecimal(sysBdgEqu
								.getBdgmoney() == null ? 0d : sysBdgEqu
								.getBdgmoney());
						overallReport.setEquBdgValue(equipBdgValue);
						bdgTotal = bdgTotal.add(equipBdgValue);
					}
				}
			}

			// 安装-概算
			if (bdgInfo.getInstallbdg() != null) {
				if (!bdgInfo.getInstallbdg().equals("")) {
					obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
							bdgInfo.getInstallbdg());
					if (obj != null) {
						BdgInfo sysBdgInstall = (BdgInfo) obj;
						BigDecimal installBdgValue = new BigDecimal(
								sysBdgInstall.getBdgmoney() == null ? 0d
										: sysBdgInstall.getBdgmoney());
						overallReport.setInstallBdgValue(installBdgValue);
						bdgTotal = bdgTotal.add(installBdgValue);
					}
				}
			}

			// 其它-概算
			if (bdgInfo.getOtherbdg() != null) {
				if (!bdgInfo.getOtherbdg().equals("")) {
					obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
							bdgInfo.getOtherbdg());
					if (obj != null) {
						BdgInfo sysBdgOther = (BdgInfo) obj;
						BigDecimal otherBdgValue = new BigDecimal(sysBdgOther
								.getBdgmoney() == null ? 0d : sysBdgOther
								.getBdgmoney());
						overallReport.setOtherBdgValue(otherBdgValue);
						bdgTotal = bdgTotal.add(otherBdgValue);
					}
				}
			}

			overallReport.setTotalBdgValue(bdgTotal);

			// 实际价值

			if (finValueSource.equalsIgnoreCase("internal")) {
				BigDecimal realTotal = new BigDecimal(0);
				BigDecimal buildReal = getFinancialValue(bdgInfo.getBuildbdg(),
						true);
				if (buildReal != null) {
					overallReport.setBuildRealValue(buildReal);
					realTotal = realTotal.add(buildReal);
				}
				BigDecimal installReal = getFinancialValue(bdgInfo
						.getInstallbdg(), true);
				if (installReal != null) {
					overallReport.setInstallRealValue(installReal);
					realTotal = realTotal.add(installReal);
				}
				BigDecimal equipReal = getFinancialValue(bdgInfo.getEquipbdg(),
						true);
				if (equipReal != null) {
					overallReport.setEquRealValue(equipReal);
					realTotal = realTotal.add(equipReal);
				}
				BigDecimal otherReal = getFinancialValue(bdgInfo.getOtherbdg(),
						true);
				if (otherReal != null) {
					overallReport.setOtherRealValue(otherReal);
					realTotal = realTotal.add(otherReal);
				}
				overallReport.setTotalRealValue(realTotal);

			}

			// TODO 增减额等统计部分

			bdgStructureDAO.saveOrUpdate(overallReport);
			long xh = 1;
			String txGroup = SnUtil.getNewID("tx-");
			if ( exchangeData ){
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("FA_OVERALL_REPORT");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("UIDS", overallReport.getUids());
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				exchange.setBizInfo("竣工工程决算一览表(竣建02)表");
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

	public void initFAUnfinishedPrjReport(Boolean force, String pid){
		initFAUnfinishedPrjReport(force, pid, false);
	}


	public void initFAUnfinishedPrjReport(Boolean force, String pid, Boolean exchangeData) {
		if (!force) {
			List repList = bdgStructureDAO.findByWhere(
					FAUnfinishedPrjReport.class.getName(), "pid = '" + pid + "'");
			if (repList.size() > 0) {
				if ( exchangeData ){
					PCDataExchangeService dataExchangeService = 
						(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
					String sqlBefore = "delete from fa_unfinished_prj_report where pid = '" + pid + "'";
					List<PcDataExchange> excList =dataExchangeService.getExcDataList(repList, "1", pid, sqlBefore, null, "预计未完工程明细表【竣建02表附表】");
					if ( excList.size() > 0 )
					dataExchangeService.sendExchangeData(excList);
					exchangeAllFaBdgInfoByPid(pid);
				}
				return;
			}
		}

		//数据交换列表
		List<PcDataExchange> dataExchangeList = new ArrayList<PcDataExchange>();
		String sql = "delete from fa_unfinished_prj_report where pid = '" + pid + "'";
		JdbcUtil.update(sql);

		// 所有项目列表
		List<FABdgInfo> bdgList = new ArrayList<FABdgInfo>();

		// 报表设置
		String bdgLevel = "3";
		List<FAReportConfig> configList = bdgStructureDAO.findByProperty(
				FAReportConfig.class.getName(), "reportModuleName",
				FA_UNFINISHED_PRJ_REPORT);
		if (configList.size() > 0) {
			FAReportConfig config = configList.get(0);
			bdgLevel = config.getBdgLevel();
		} else {
			List<FAGcType> gcTypeList = bdgStructureDAO.findByProperty(
					FAGcType.class.getName(), "gcTypeName", "分项工程");
			if (gcTypeList.size() > 0) {
				bdgLevel = gcTypeList.get(0).getUids();
			}
		}
		//找到当前项目的概算根节点id
		String rootSql = "select bdgid from bdg_info where parent = '0' and pid = '" + pid + "'";
		List<Map<String, Object>> resultList = JdbcUtil.query(rootSql);
		if ( resultList.size() == 0 )
			return;
		String rootId = resultList.get(0).get("bdgid").toString();
		getBdgList(bdgList, rootId, bdgLevel, FA_UNFINISHED_PRJ_REPORT);

		// 建筑
		// curLevel = 1;
		// getSysBdgList(bdgList, MAIN_ROOT_ID);
		for (FABdgInfo bdgInfo : bdgList) {
			FAUnfinishedPrjReport unfinishedPrjReport = new FAUnfinishedPrjReport();
			unfinishedPrjReport.setPid(bdgInfo.getPid());
			unfinishedPrjReport.setBdgid(bdgInfo.getBdgid());
			unfinishedPrjReport.setBdgname(bdgInfo.getBdgname());
			setUnfinishedReportValues(bdgInfo, unfinishedPrjReport);

			// setProAcmValue(unfinishedPrjReport, "build");

			bdgStructureDAO.saveOrUpdate(unfinishedPrjReport);
			long xh = 1;
			String txGroup = SnUtil.getNewID("tx-");
			if ( exchangeData ){
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("FA_UNFINISHED_PRJ_REPORT");
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("UIDS", unfinishedPrjReport.getUids());
				kvarr.add(kv);
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				exchange.setBizInfo("预计未完工程明细表【竣建02表附表】");
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

	private void setUnfinishedReportValues(FABdgInfo faBdgInfo,
			FAUnfinishedPrjReport report) {
		// 概算总值（四部分概算之和）
		BigDecimal totalBdgMoney = new BigDecimal(0);
		// 已完成工作量金额 (四部分概算已付款金额之和)
		BigDecimal totalAmountDoneValue = new BigDecimal(0);

		// 建筑
		if (faBdgInfo.getBuildbdg() != null) {
			if (!faBdgInfo.getBuildbdg().equals("")) {

				Object obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
						faBdgInfo.getBuildbdg());
				if (obj != null) {
					BdgInfo bdgInfo = (BdgInfo) obj;
					BigDecimal bdgMoney = new BigDecimal(
							bdgInfo.getBdgmoney() == null ? 0 : bdgInfo
									.getBdgmoney());
					totalBdgMoney = totalBdgMoney.add(bdgMoney);
					if (bdgInfo.getIsfinish() == null) {
						BigDecimal amountDoneValue = getFinancialValue(bdgInfo
								.getBdgid(), true);
						if (amountDoneValue == null) {
							amountDoneValue = new BigDecimal(0);
						}

						totalAmountDoneValue = totalAmountDoneValue
								.add(amountDoneValue);

						BigDecimal unfinishedBuild = bdgMoney
								.subtract(amountDoneValue);
						report.setUnfinishedBuild(unfinishedBuild);

					} else if (bdgInfo.getIsfinish() == 0) {
						BigDecimal amountDoneValue = getFinancialValue(bdgInfo
								.getBdgid(), true);
						if (amountDoneValue == null) {
							amountDoneValue = new BigDecimal(0);
						}

						totalAmountDoneValue = totalAmountDoneValue
								.add(amountDoneValue);

						BigDecimal unfinishedBuild = bdgMoney
								.subtract(amountDoneValue);
						report.setUnfinishedBuild(unfinishedBuild);
					}

				}
			}
		}

		// 安装--设备
		if (faBdgInfo.getInstallbdg() != null) {
			if (!faBdgInfo.getInstallbdg().equals("")) {
				Object obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
						faBdgInfo.getInstallbdg());
				if (obj != null) {
					BdgInfo bdgInfo = (BdgInfo) obj;
					BdgInfo bdgInfoEquip = null;
					BigDecimal bdgMoney = new BigDecimal(
							bdgInfo.getBdgmoney() == null ? 0 : bdgInfo
									.getBdgmoney());

					totalBdgMoney = totalBdgMoney.add(bdgMoney);
					Object obj2 = bdgStructureDAO.findById(BdgInfo.class
							.getName(), faBdgInfo.getEquipbdg());
					if (obj2 != null) {
						bdgInfoEquip = (BdgInfo) obj2;
						BigDecimal equipMoney = new BigDecimal(bdgInfoEquip
								.getBdgmoney() == null ? 0 : bdgInfoEquip
								.getBdgmoney());
						totalBdgMoney = totalBdgMoney.add(equipMoney);
						boolean isFinish = true;
						if (bdgInfo.getIsfinish() == null) {
							isFinish = false;
						} else if (bdgInfo.getIsfinish() == 0) {
							isFinish = false;
						}
						if (!isFinish) {
							BigDecimal amountDoneValue = getFinancialValue(
									bdgInfo.getBdgid(), true);
							if (amountDoneValue == null) {
								amountDoneValue = new BigDecimal(0);
							}

							totalAmountDoneValue = totalAmountDoneValue
									.add(amountDoneValue);
							BigDecimal unfinishedInstall = bdgMoney
									.subtract(amountDoneValue);
							report.setUnfinishedInstall(unfinishedInstall);

							if (bdgInfoEquip != null) {
								BigDecimal amountDoneValueEquip = getFinancialValue(
										bdgInfoEquip.getBdgid(), true);
								if (amountDoneValueEquip == null) {
									amountDoneValueEquip = new BigDecimal(0);
								}

								totalAmountDoneValue = totalAmountDoneValue
										.add(amountDoneValueEquip);
								BigDecimal unfinishedEquip = equipMoney
										.subtract(amountDoneValueEquip);
								report.setUnfinishedEqu(unfinishedEquip);

							}
						}

					}

				}
			}
		}

		// 其它
		if (faBdgInfo.getOtherbdg() != null) {
			if (!faBdgInfo.getOtherbdg().equals("")) {
				Object obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
						faBdgInfo.getOtherbdg());
				if (obj != null) {
					BdgInfo bdgInfo = (BdgInfo) obj;
					BigDecimal bdgMoney = new BigDecimal(
							bdgInfo.getBdgmoney() == null ? 0 : bdgInfo
									.getBdgmoney());
					totalBdgMoney = totalBdgMoney.add(bdgMoney);

					if (bdgInfo.getIsfinish() == null) {
						BigDecimal amountDoneValue = getFinancialValue(bdgInfo
								.getBdgid(), true);
						if (amountDoneValue == null) {
							amountDoneValue = new BigDecimal(0);
						}

						totalAmountDoneValue = totalAmountDoneValue
								.add(amountDoneValue);

						BigDecimal unfinishedOther = bdgMoney
								.subtract(amountDoneValue);
						report.setUnfinishedOther(unfinishedOther);
					} else if (bdgInfo.getIsfinish() == 0) {
						BigDecimal amountDoneValue = getFinancialValue(bdgInfo
								.getBdgid(), true);
						if (amountDoneValue == null) {
							amountDoneValue = new BigDecimal(0);
						}

						totalAmountDoneValue = totalAmountDoneValue
								.add(amountDoneValue);

						BigDecimal unfinishedOther = bdgMoney
								.subtract(amountDoneValue);
						report.setUnfinishedOther(unfinishedOther);
					}

				}
			}
		}

		report.setBdgmoney(totalBdgMoney);
		report.setAmountDoneValue(totalAmountDoneValue);

	}

	// 设置概算项对应的项目
	public void saveCoBdgid(String bdgid, String coBdgid)
			throws BusinessException {
		BdgInfo bdgInfo = (BdgInfo) bdgStructureDAO.findById(
				BusinessConstants.BDG_PACKAGE
						.concat(BusinessConstants.BDG_INFO), bdgid);
		bdgInfo.setCorrespondbdg(coBdgid);
		bdgStructureDAO.saveOrUpdate(bdgInfo);
	}

	public String saveOrUpdateNode(FABdgInfo node, Boolean exchangeData) throws BusinessException {
		boolean isAdd = false;
		if (node.getBdgid() == null) {
			isAdd = true;
		} else if (node.getBdgid().equals("")) {
			isAdd = true;
		}
		String id = node.getBdgid();

		if (isAdd) {

			id = bdgStructureDAO.insert(node);
			// 若为新增子节点则把父节点的isLeaf属性设为false
			// 获取父节点
			FABdgInfo parentNode = (FABdgInfo) bdgStructureDAO.findById(
					beanName, node.getParent());
			if (parentNode.getIsLeaf()) {
				parentNode.setIsLeaf(false);
				bdgStructureDAO.saveOrUpdate(parentNode);
				if ( exchangeData ){
					List<FABdgInfo> excList = new ArrayList<FABdgInfo>();
					excList.add(node);
					excList.add(parentNode);
					exchangeFaBdgInfo(excList);
				}
			}

		} else {
			bdgStructureDAO.saveOrUpdate(node);
			if ( exchangeData ){
				exchangeFaBdgInfo(node);
			}
		}

		return id;
	}

	public void setCoSysBdgUpToRoot(FABdgInfo faBdgInfo, Boolean exchangeData) {
		if (faBdgInfo.getBdgid().equals(MAIN_ROOT_ID)) {
			return;
		}

		// 父节点
		Object parentObj = bdgStructureDAO.findById(FABdgInfo.class.getName(),
				faBdgInfo.getParent());
		if (parentObj == null) {
			return;
		}
		FABdgInfo parentBdg = (FABdgInfo) parentObj;

		// 建筑
		if (faBdgInfo.getBuildbdg() != null) {

			Object curSysBdgObj = bdgStructureDAO.findById(BdgInfo.class
					.getName(), faBdgInfo.getBuildbdg());
			if (curSysBdgObj != null) {
				parentBdg.setBuildbdg(((BdgInfo) curSysBdgObj).getParent());
			}

		}

		// 设备
		if (faBdgInfo.getEquipbdg() != null) {

			Object curSysBdgObj = bdgStructureDAO.findById(BdgInfo.class
					.getName(), faBdgInfo.getEquipbdg());
			if (curSysBdgObj != null) {
				parentBdg.setEquipbdg(((BdgInfo) curSysBdgObj).getParent());
			}

		}

		// 安装
		if (faBdgInfo.getInstallbdg() != null) {

			Object curSysBdgObj = bdgStructureDAO.findById(BdgInfo.class
					.getName(), faBdgInfo.getInstallbdg());
			if (curSysBdgObj != null) {
				parentBdg.setInstallbdg(((BdgInfo) curSysBdgObj).getParent());
			}

		}

		// 其它
		if (faBdgInfo.getOtherbdg() != null) {

			Object curSysBdgObj = bdgStructureDAO.findById(BdgInfo.class
					.getName(), faBdgInfo.getOtherbdg());
			if (curSysBdgObj != null) {
				parentBdg.setOtherbdg(((BdgInfo) curSysBdgObj).getParent());
			}

		}

		bdgStructureDAO.saveOrUpdate(parentBdg);
		if ( exchangeData ){
			exchangeFaBdgInfo(parentBdg);
		}
		setCoSysBdgUpToRoot(parentBdg, exchangeData);

	}

	public void setBdgStructureDAO(FABdgStructureDAO bdgStructureDAO) {
		this.bdgStructureDAO = bdgStructureDAO;
	}

	/**
	 * 为竣建概算结构对象设置扩展属性（各个部分金额）
	 * 
	 * @param bdgInfo
	 */
	private void setExtendAttributes(FABdgInfo bdgInfo) {
		// 建筑
		if (bdgInfo.getBuildbdg() != null) {
			List list = bdgStructureDAO.findByProperty(
					BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO,
					"bdgid", bdgInfo.getBuildbdg());
			if (list.size() > 0) {
				BdgInfo sysBdgInfo = (BdgInfo) list.get(0);
				bdgInfo.setBuildno(sysBdgInfo.getBdgno());
				bdgInfo.setBuildname(sysBdgInfo.getBdgname());
				bdgInfo.setBuildmoney(sysBdgInfo.getBdgmoney());

			}

		}

		// 设备
		if (bdgInfo.getEquipbdg() != null) {
			List list = bdgStructureDAO.findByProperty(
					BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO,
					"bdgid", bdgInfo.getEquipbdg());
			if (list.size() > 0) {
				BdgInfo sysBdgInfo = (BdgInfo) list.get(0);
				bdgInfo.setEquipno(sysBdgInfo.getBdgno());
				bdgInfo.setEquipname(sysBdgInfo.getBdgname());
				bdgInfo.setEquipmoney(sysBdgInfo.getBdgmoney());

			}

		}

		// 安装
		if (bdgInfo.getInstallbdg() != null) {
			List list = bdgStructureDAO.findByProperty(
					BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO,
					"bdgid", bdgInfo.getInstallbdg());
			if (list.size() > 0) {
				BdgInfo sysBdgInfo = (BdgInfo) list.get(0);
				bdgInfo.setInstallno(sysBdgInfo.getBdgno());
				bdgInfo.setInstallmoney(sysBdgInfo.getBdgmoney());
				bdgInfo.setInstallname(sysBdgInfo.getBdgname());

			}

		}

		// 其它
		if (bdgInfo.getOtherbdg() != null) {
			List list = bdgStructureDAO.findByProperty(
					BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_INFO,
					"bdgid", bdgInfo.getOtherbdg());
			if (list.size() > 0) {
				BdgInfo sysBdgInfo = (BdgInfo) list.get(0);
				bdgInfo.setOtherno(sysBdgInfo.getBdgno());
				bdgInfo.setOthermoney(sysBdgInfo.getBdgmoney());
				bdgInfo.setOthername(sysBdgInfo.getBdgname());

			}

		}
	}

	// 设置竣工
	public void setFinish(String bdgid, Boolean isFinish, Boolean exchangeData)
			throws BusinessException {
		// JdbcTemplate jdbc = Constant.getJdbcTemplate();
		// String sql = null;
		String val = isFinish ? "1" : "0";

		String sql = "update bdg_info set isfinish = "
				+ val
				+ " where bdgid in ( select bdgid from BDG_INFO start with bdgid = '"
				+ bdgid + "' connect by prior bdgno = parent )";

		JdbcUtil.update(sql);
		if ( exchangeData ){
			List<PcDataExchange> exchangeList = new ArrayList<PcDataExchange>();
			PcDataExchange dataExchange = new PcDataExchange();
			String txGroup = SnUtil.getNewID("tx-");
			dataExchange.setTableName("FA_BDG_INFO");
			dataExchange.setKeyValue(SnUtil.getNewID("sql-"));
			dataExchange.setSqlData(sql);
			dataExchange.setTxGroup(txGroup);
			dataExchange.setSuccessFlag("0");
			dataExchange.setBizInfo("竣工决算概算结构删除");
			dataExchange.setXh(1L);

			dataExchange.setPid("1");
			exchangeList.add(dataExchange);
			PCDataExchangeService dataExchangeService = 
				(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			
			dataExchangeService.sendExchangeData(exchangeList);
		}

	}

	private boolean hasUnfinishedPrj(FABdgInfo faBdgInfo) {

		// 建筑
		if (faBdgInfo.getBuildbdg() != null) {
			Object obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
					faBdgInfo.getBuildbdg());
			if (obj != null) {
				BdgInfo bdgInfo = (BdgInfo) obj;
				if (bdgInfo.getIsfinish() == null) {
					return true;
				} else if (bdgInfo.getIsfinish() == 0) {
					return true;
				}
			}
		}

		// 安装
		if (faBdgInfo.getInstallbdg() != null) {
			Object obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
					faBdgInfo.getInstallbdg());
			if (obj != null) {
				BdgInfo bdgInfo = (BdgInfo) obj;
				if (bdgInfo.getIsfinish() == null) {
					return true;
				} else if (bdgInfo.getIsfinish() == 0) {
					return true;
				}
			}
		}

		// 其它
		if (faBdgInfo.getOtherbdg() != null) {
			Object obj = bdgStructureDAO.findById(BdgInfo.class.getName(),
					faBdgInfo.getOtherbdg());
			if (obj != null) {
				BdgInfo bdgInfo = (BdgInfo) obj;
				if (bdgInfo.getIsfinish() == null) {
					return true;
				} else if (bdgInfo.getIsfinish() == 0) {
					return true;
				}
			}
		}

		return false;
	}
	
	/**
	 * 对竣工决算概算结构进行数据交换
	 * @param bdgInfo
	 */
	public void exchangeFaBdgInfo(List<FABdgInfo> list){
	
		if ( list.size() ==0 )
			return;
		PCDataExchangeService dataExchangeService = 
			(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		
		FABdgInfo info = list.get(0);
		List<PcDataExchange> dataExchangeList = dataExchangeService.getExcDataList(list, "1", info.getPid(), null, null, "竣工决算概算结果数据交互");
		
		dataExchangeService.sendExchangeData(dataExchangeList);
		
	}
	
	
	/**
	 * 对竣工决算概算结构进行数据交换
	 * @param bdgInfo
	 */
	public void exchangeFaBdgInfo(FABdgInfo bdgInfo){
		List<FABdgInfo> list = new ArrayList<FABdgInfo>();
		list.add(bdgInfo);
		PCDataExchangeService dataExchangeService = 
			(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		List<PcDataExchange> dataExchangeList = dataExchangeService.getExcDataList(list, "1", bdgInfo.getPid(), null, null, "竣工决算概算结果数据交互");
		
		dataExchangeService.sendExchangeData(dataExchangeList);
		
	}
	
	
	/**
	 * 根据pid对竣工决算结构全部进行数据交换
	 * @param pid
	 * @author zhangh 2012-05-22
	 */
	public void exchangeAllFaBdgInfoByPid(String pid){
		//数据交互竣工决算概算结构
		List<FABdgInfo> list = bdgStructureDAO.findByProperty(FABdgInfo.class.getName(), "pid", pid);
		PCDataExchangeService dataExchangeService = 
			(PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
		List<PcDataExchange> dataExchangeList = dataExchangeService.getExcDataList(list, "1", pid, null, null, "数据交互竣工决算概算结构");
		dataExchangeService.sendExchangeData(dataExchangeList);
	}

}
