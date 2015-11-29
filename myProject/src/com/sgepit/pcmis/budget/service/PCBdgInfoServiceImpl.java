package com.sgepit.pcmis.budget.service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.frame.sysman.dao.PropertyCodeDAO;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.pcmis.budget.hbm.BdgReportBean;
import com.sgepit.pcmis.budget.hbm.BudgetProInfo;
import com.sgepit.pcmis.budget.hbm.PCBudgetProInof;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pmis.budget.dao.BdgInfoDAO;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMonthMoneyPlan;
import com.sgepit.pmis.budget.hbm.VBdgInfo;
import com.sgepit.pmis.document.hbm.ZlInfoBlobList;
import com.sgepit.pmis.document.hbm.ZlTree;

public class PCBdgInfoServiceImpl extends BaseMgmImpl implements
		PCBdgInfoService {
	private BdgInfoDAO bdgInfoDao;
	private BusinessException businessException;

	public BdgInfoDAO getBdgInfoDao() {
		return bdgInfoDao;
	}

	public void setBdgInfoDao(BdgInfoDAO bdgInfoDao) {
		this.bdgInfoDao = bdgInfoDao;
	}

	public BusinessException getBusinessException() {
		return businessException;
	}

	public void setBusinessException(BusinessException businessException) {
		this.businessException = businessException;
	}

	public static PCBdgInfoServiceImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (PCBdgInfoServiceImpl) ctx.getBean("pcBdgInfoMgm");
	}

	public List getBdgMainGridStr(String orderby, final Integer start,
			final Integer limit, HashMap params) {
		List list = new ArrayList();
		String sql = "select pc.pid,b.bdgmoney,b.contmoney,rownum r from pc_zhxx_prj_info pc left join "
				+ "(select * from bdg_info t where t.parent='0' or t.parent is null) b on pc.pid=b.pid   where 1=1 ";
		String pid = (String) params.get("pid");
		String proName = (String) params.get("proName");
		SystemMgmFacade systemMgm = (SystemMgmFacade) Constant.wact
				.getBean("systemMgm");
		List listSgcc = systemMgm.getPidsByUnitid(pid);
		StringBuffer sbuff = new StringBuffer();
		for (int i = 0; i < listSgcc.size(); i++) {
			SgccIniUnit siu = (SgccIniUnit) listSgcc.get(i);
			sbuff.append(siu.getUnitid());
			if (i < listSgcc.size() - 1) {
				sbuff.append(",");
			}
		}
		if (proName != null && !"".equals(proName)) {
			sql += " and pc.prj_name like '%" + proName + "%'";
		}
		if (sbuff.toString() != null && !"".equals(sbuff.toString())) {
			sql += " and  Instr ( '" + sbuff.toString() + "',pc.pid)>0 ";
		} else {
			return list;
		}
		if (orderby != null && !orderby.trim().equals("")) {
			sql += " order by " + orderby;
		}
		if (start == null || limit == null) {
			List<Map> list1 = JdbcUtil.query(sql);
			if (!list1.isEmpty()) {
				for (int i = 0; i < list1.size(); i++) {
					BudgetProInfo bpi = new BudgetProInfo();
					bpi.setPid((String) list1.get(i).get("PID"));
					bpi.setBdgTotalMoney((java.math.BigDecimal) list1.get(i)
							.get("BDGMONEY"));
					bpi.setConMoney((java.math.BigDecimal) list1.get(i).get(
							"CONTMONEY"));
					list.add(bpi);
				}
			}

		} else {
			Integer lastRowNum = start + limit;
			String countSql = "select count(*) as num from (" + sql
					+ " ) temp ";
			String pageSql = " select * from (" + sql + " ) temp where temp.r>"
					+ start + " and temp.r<=" + lastRowNum;
			// 查询页数
			List<Map<String, Object>> countList = JdbcUtil.query(countSql);
			Integer count = Integer.valueOf(countList.get(0).get("num")
					.toString());
			List<Map> lis2 = JdbcUtil.query(pageSql);
			if (!lis2.isEmpty()) {
				for (int k = 0; k < lis2.size(); k++) {
					BudgetProInfo bpi = new BudgetProInfo();
					bpi.setPid((String) lis2.get(k).get("PID"));
					bpi.setBdgTotalMoney((java.math.BigDecimal) lis2.get(k)
							.get("BDGMONEY"));
					bpi.setConMoney((java.math.BigDecimal) lis2.get(k).get(
							"CONTMONEY"));
					list.add(bpi);
				}
			}
			list.add(count);
		}
		return list;
	}

	@SuppressWarnings("all")
	public List buildColumnNodeTree(String treeName,
			String parentId, Map params) {
		List list = new ArrayList();
		if ("budgetReport".equals(treeName)) {
			String where = " pid='" + ((String[]) params.get("pid"))[0]
					+ "' and parent='" + parentId + "'";
			List<BdgInfo> bdgList = bdgInfoDao.findByWhere(BdgInfo.class
					.getName(), where);
			for (int i = 0; i < bdgList.size(); i++) {
				ColumnTreeNode col = new ColumnTreeNode();
				TreeNode treeNode = new TreeNode();
				BdgReportBean bdgReportBean = new BdgReportBean();
				BdgInfo bdg = bdgList.get(i);
				bdgReportBean.setBdgid(bdg.getBdgid());
				bdgReportBean.setBdgname(bdg.getBdgname());
				bdgReportBean.setBdgmoney(bdg.getBdgmoney());
				//bdgReportBean.setContmoney(bdg.getContmoney());
				treeNode.setId(bdg.getBdgid());
				treeNode.setText(bdg.getBdgname());
				int leaf = bdg.getIsleaf().intValue();
				if (leaf == 1) {
					treeNode.setLeaf(true);
					treeNode.setIconCls("task");
				} else {
					treeNode.setLeaf(false); // treenode.leaf
					treeNode.setCls("master-task"); // treenode.cls
					treeNode.setIconCls("task-folder"); // treenode.iconCls
				}
				treeNode.setIfcheck("none");
				col.setTreenode(treeNode); // ColumnTreeNode.treenode

				List<VBdgInfo> vBdgInfoList = this.bdgInfoDao.findByWhere(
						VBdgInfo.class.getName(), "pid='" + bdg.getPid()
								+ "' and bdgid='" + bdg.getBdgid() + "'");
				double claAndChangeApp = 0; // 索赔、变更金额
				double conTotalMoney = 0; // 合同分摊总金额
				double bdgcalconmoney = 0; // 差值 = 概算金额 - 分摊总金额
				double conapp = 0;			//已签合同总金额
				if (vBdgInfoList.size() > 0) {
					claAndChangeApp = vBdgInfoList.get(0).getChangeapp()
							+ vBdgInfoList.get(0).getClaapp();
					conTotalMoney = vBdgInfoList.get(0).getConbdgappmoney();
					bdgcalconmoney = vBdgInfoList.get(0).getBdgmoney()
							- vBdgInfoList.get(0).getConbdgappmoney();
					conapp = vBdgInfoList.get(0).getConapp();
				}
				bdgReportBean.setChangeappmoney(claAndChangeApp);
				bdgReportBean.setChangemoney(conTotalMoney);
				bdgReportBean.setBdgcalconmoney(bdgcalconmoney);
				bdgReportBean.setContmoney(conapp);
				/*
				 * //计算合同概算分摊中索赔分摊+变更分摊的总金额 double claAndChangeApp=0;
				 * List<BdgClaApp>
				 * bdgClaAppList=bdgInfoDao.findByWhere(BdgClaApp
				 * .class.getName(),
				 * "pid='"+bdg.getPid()+"' and bdgid='"+bdg.getBdgid()+"'");
				 * if(bdgClaAppList.size()>0){
				 * 
				 * claAndChangeApp+=bdgClaAppList.get(0).getClamoney()==null?0:
				 * bdgClaAppList.get(0).getClamoney(); } List<BdgChangApp>
				 * bdgChangeAppList
				 * =bdgInfoDao.findByWhere(BdgChangApp.class.getName(),
				 * "pid='"+bdg.getPid()+"' and bdgid='"+bdg.getBdgid()+"'");
				 * if(bdgChangeAppList.size()>0){
				 * claAndChangeApp+=bdgChangeAppList
				 * .get(0).getCamoney()==null?0:
				 * bdgChangeAppList.get(0).getCamoney(); }
				 * bdgReportBean.setChangeappmoney
				 * (claAndChangeApp);//设置合同索赔分摊，变更分摊金额值 double conTotalMoney
				 * =claAndChangeApp
				 * +(bdg.getContmoney()==null?0:bdg.getContmoney());
				 * bdgReportBean.setChangemoney(conTotalMoney);//合同总金额
				 * bdgReportBean
				 * .setBdgcalconmoney((bdg.getBdgmoney()==null?0:bdg
				 * .getBdgmoney())-conTotalMoney);//差值
				 */

				String nowDate = ((String[]) params.get("nowdate"))[0];
				String nowYear = nowDate.substring(0, 4) + "00";
				// 计算当前概算项对应的本月投资总额
				String monthSql = "select nvl(sum(nvl(pi.ratiftmoney,0)),0) from pro_acm_tree  pi left join pro_acm_month  pm on pi.mon_id=pm.uids where pm.month='"
						+ nowDate
						+ "' and pi.bdgid='"
						+ bdg.getBdgid()
						+ "' and pi.pid='" + bdg.getPid() + "'";
				System.out.println("本月"+monthSql);
				double monthProjectMoney = ((BigDecimal) bdgInfoDao
						.getDataAutoCloseSes(monthSql).get(0)).doubleValue();
				bdgReportBean.setMonthmoney(monthProjectMoney);// 工程量月度统计金额
				// 计算当前年份的投资总额
				String yearSql = "select nvl(sum(nvl(pi.ratiftmoney,0)),0) from pro_acm_tree  pi left join pro_acm_month  pm on pi.mon_id=pm.uids where To_number(pm.month)> To_number('"
						+ nowYear
						+ "') and pi.bdgid='"
						+ bdg.getBdgid()
						+ "' and To_number(pm.month)<= To_number('"
						+ nowDate
						+ "') and pi.pid='" + bdg.getPid() + "'";
				System.out.println("本年"+yearSql);
				double yearProjectMoney = ((BigDecimal) bdgInfoDao
						.getDataAutoCloseSes(yearSql).get(0)).doubleValue();
				bdgReportBean.setYearmoney(yearProjectMoney);
				// 计算所有的投资总额
				String allSql = "select nvl(sum(nvl(pi.ratiftmoney,0)),0) from pro_acm_tree  pi left join pro_acm_month  pm on pi.mon_id=pm.uids where   pi.bdgid='"
						+ bdg.getBdgid()
						+ "' and To_number(pm.month)<= To_number('"
						+ nowDate
						+ "') and pi.pid='" + bdg.getPid() + "'";
				System.out.println("全部"+allSql);
				double allProjectMoney = ((BigDecimal) bdgInfoDao
						.getDataAutoCloseSes(allSql).get(0)).doubleValue();
				bdgReportBean.setAllmoney(allProjectMoney);
				// 累计完成比例
				if (conTotalMoney == 0) {
					bdgReportBean.setPercent("0.00%");
				} else {
					double per = allProjectMoney / conTotalMoney;
					NumberFormat nf = NumberFormat.getPercentInstance();
					nf.setMaximumFractionDigits(2);
					nf.setMinimumFractionDigits(2);
					if (per == 0) {
						bdgReportBean.setPercent("0.00%");
					} else {

						String p = nf.format(per);
						bdgReportBean.setPercent(p);
					}
				}
				JSONObject jo = JSONObject.fromObject(bdgReportBean);
				col.setColumns(jo);
				list.add(col);
			}
		}
		return list;
	}

	public List getBdgInfoGridStr(String orderby, Integer start, Integer limit,
			HashMap params) {
		List list = new ArrayList();
		String sql = "select pc.pid,b.bdgmoney,b.contmoney,rownum r from pc_zhxx_prj_info pc left join "
				+ "(select * from bdg_info t where t.parent='0' or t.parent is null) b on pc.pid=b.pid";
		String pid = (String) params.get("pid");
		String proName = (String) params.get("proName");
		SystemMgmFacade systemMgm = (SystemMgmFacade) Constant.wact
				.getBean("systemMgm");
		List listSgcc = systemMgm.getPidsByUnitid(pid);
		StringBuffer sbuff = new StringBuffer();
		for (int i = 0; i < listSgcc.size(); i++) {
			SgccIniUnit siu = (SgccIniUnit) listSgcc.get(i);
			sbuff.append(siu.getUnitid());
			if (i < listSgcc.size() - 1) {
				sbuff.append(",");
			}
		}
		if (proName != null && !"".equals(proName)) {
			sql += " and pc.prj_name like '%" + proName + "%'";
		}
		if (sbuff.toString() != null && !"".equals(sbuff.toString())) {
			sql += " and  Instr ( '" + sbuff.toString() + "',pc.pid)>0 ";
		} else {
			return list;
		}
		if (orderby != null && !orderby.trim().equals("")) {
			sql += " order by " + orderby;
		}
		if (start == null || limit == null) {
			List<Map> list1 = JdbcUtil.query(sql);
			if (!list1.isEmpty()) {
				for (int i = 0; i < list1.size(); i++) {
					BudgetProInfo bpi = new BudgetProInfo();
					String PID = (String) list1.get(i).get("PID");
					bpi.setPid(PID);
					// 获取合同付款分摊总金额
					String conSql = "select nvl(sum(nvl(factpay,0)),0) as sumfactpay  from bdg_pay_app where BDGID='01' and PID='"
							+ PID + "'";
					List<Map> listtotal = JdbcUtil.query(conSql);
					bpi.setBalMoney((java.math.BigDecimal) listtotal.get(0)
							.get("SUMFACTPAY"));
					bpi.setBdgTotalMoney((java.math.BigDecimal) list1.get(i)
							.get("BDGMONEY"));
					bpi.setConMoney((java.math.BigDecimal) list1.get(i).get(
							"CONTMONEY"));
					list.add(bpi);
				}
			}

		} else {
			Integer lastRowNum = start + limit;
			String countSql = "select count(*) as num from (" + sql
					+ " ) temp ";
			String pageSql = " select * from (" + sql + " ) temp where temp.r>"
					+ start + " and temp.r<=" + lastRowNum;
			// 查询页数
			List<Map<String, Object>> countList = JdbcUtil.query(countSql);
			Integer count = Integer.valueOf(countList.get(0).get("num")
					.toString());
			List<Map> lis2 = JdbcUtil.query(pageSql);
			if (!lis2.isEmpty()) {
				for (int k = 0; k < lis2.size(); k++) {
					BudgetProInfo bpi = new BudgetProInfo();
					String PID = (String) lis2.get(k).get("PID");
					bpi.setPid(PID);
					// 获取合同付款分摊总金额
					String conSql = "select nvl(sum(nvl(factpay,0)),0) as sumfactpay  from bdg_pay_app where BDGID='01' and PID='"
							+ PID + "'";
					List<Map> listtotal = JdbcUtil.query(conSql);
					bpi.setBalMoney((java.math.BigDecimal) listtotal.get(0)
							.get("SUMFACTPAY"));
					bpi.setBdgTotalMoney((java.math.BigDecimal) lis2.get(k)
							.get("BDGMONEY"));
					bpi.setConMoney((java.math.BigDecimal) lis2.get(k).get(
							"CONTMONEY"));
					list.add(bpi);
				}
			}
			list.add(count);
		}
		return list;
	}

	public Map getProjectShedulePercentByPid(String pid) {
		List bdgList = bdgInfoDao.findByWhere(BdgInfo.class.getName(), "pid='"
				+ pid + "' and bdgno='01'");
		BdgInfo bdg = null;
		for (int i = 0; i < bdgList.size(); i++) {
			bdg = (BdgInfo) bdgList.get(i);
		}
		double bdgmoney = 0d;
		double contMoney = 0d;
		if (bdg == null) {
			bdgmoney = 0d;
			contMoney = 0d;
		} else {
			bdgmoney = bdg.getBdgmoney();// 概算金额
			contMoney = bdg.getContmoney() == null ? 0d : bdg.getContmoney();// 分摊总金额
		}
		String bdgPrecent = "";
		java.text.DecimalFormat fnum = new java.text.DecimalFormat("0.00000");

		if (contMoney == 0d || bdgmoney == 0d) {
			bdgPrecent = fnum.format(0f);
		} else {
			bdgPrecent = fnum.format(contMoney / bdgmoney);
		}
		Map map = new HashMap<String, String>();
		map.put("bdgPercent", bdgPrecent);
		return map;
	}

	@SuppressWarnings("all")
	public List getBdgAppInfoByPidAndBdgId(String orderby, Integer start,
			Integer limit, HashMap params) {
		String pid = (String) params.get("pid");
		String bdgid = (String) params.get("bdgid");
		List list = new ArrayList();
		String bdgSql = "select b.bdgname,nvl(b.bdgmoney,0),c.conname,c.conid";
		bdgSql += " from bdg_money_app bma ";
		bdgSql += " left join bdg_info b ";
		bdgSql += " on bma.bdgid = b.bdgid ";
		bdgSql += " left join con_ove c ";
		bdgSql += " on bma.conid = c.conid ";
		bdgSql += " where bma.pid = '" + pid + "'";
		bdgSql += " and bma.bdgid = '" + bdgid + "'";
		List bdgList = bdgInfoDao.getDataAutoCloseSes(bdgSql);
		for (int i = 0; i < bdgList.size(); i++) {
			Object[] objs = (Object[]) bdgList.get(i);
			BdgReportBean bdgReportBean = new BdgReportBean();
			bdgReportBean.setBdgname((String) objs[0]);
			bdgReportBean.setBdgmoney(((BigDecimal) objs[1]).doubleValue());
			bdgReportBean.setConname((String) objs[2]);
			String conId = (String) objs[3];
			String moneyApp = "select nvl(sum(nvl(b.realmoney,0)),0)  from bdg_money_app b where b.pid='"
					+ pid
					+ "' and b.bdgid='"
					+ bdgid
					+ "' and b.conid='"
					+ conId + "'";
			double conMoney = 0;
			List moneyList = bdgInfoDao.getDataAutoCloseSes(moneyApp);
			if (moneyList.size() > 0)
				conMoney += ((BigDecimal) moneyList.get(0)).doubleValue();
			String claApp = "select nvl(sum(nvl(bca.clamoney,0)),0)  from bdg_cla_app  bca where bca.bdgid='"
					+ bdgid
					+ "' and bca.conid='"
					+ conId
					+ "' and bca.pid='"
					+ pid + "'";
			List claList = bdgInfoDao.getDataAutoCloseSes(claApp);
			if (claList.size() > 0) {
				conMoney += ((BigDecimal) claList.get(0)).doubleValue();
			}
			String changeApp = "select nvl(sum(nvl(bca.camoney,0)),0)  from bdg_chang_app  bca where bca.bdgid='"
					+ bdgid
					+ "' and bca.pid= '"
					+ pid
					+ "' and bca.conid='"
					+ conId + "'";
			List changeList = bdgInfoDao.getDataAutoCloseSes(changeApp);
			if (changeList.size() > 0)
				conMoney += ((BigDecimal) changeList.get(0)).doubleValue();
			bdgReportBean.setContmoney(conMoney);
			list.add(bdgReportBean);
		}

		return list;
	}

	@SuppressWarnings("all")
	public List getBdgInfoForInvestManagement(String pid, String time) {
		List list = new ArrayList();
		String tujian = getBdgIdStrByPidAndRootId(pid, "0101");
		double yearTujian = getTotalInverstmentByPidAndTimeAndCondition(pid,
				time, tujian);
		list.add(yearTujian);// 土建年统计
		double monTujian = getMonInvestmentByPidAndTimeAndCondition(pid, time,
				tujian);
		list.add(monTujian);
		// 设备
		String sheBei = getBdgIdStrByPidAndRootId(pid, "0102");
		double yearsheBei = getTotalInverstmentByPidAndTimeAndCondition(pid,
				time, sheBei);
		list.add(yearsheBei);// 设备
		double monsheBei = getMonInvestmentByPidAndTimeAndCondition(pid, time,
				sheBei);
		list.add(monsheBei);
		// 安装
		String anzhuang = getBdgIdStrByPidAndRootId(pid, "0103");
		double yearanzhuang = getTotalInverstmentByPidAndTimeAndCondition(pid,
				time, anzhuang);
		list.add(yearanzhuang);// 土建年统计
		double monanzhuang = getMonInvestmentByPidAndTimeAndCondition(pid,
				time, anzhuang);
		list.add(monTujian);
		// 其他
		String qita = getBdgIdStrByPidAndRootId(pid, "0104");
		double yearqita = getTotalInverstmentByPidAndTimeAndCondition(pid,
				time, qita);
		list.add(yearqita);// 土建年统计
		double monqita = getMonInvestmentByPidAndTimeAndCondition(pid, time,
				qita);
		list.add(monqita);

		return list;
	}

	// 获取条件
	public String getBdgIdStrByPidAndRootId(String pid, String rootId) {
		StringBuffer sBuffer = new StringBuffer();
		String sql = "select b.bdgid ";
		sql += " from bdg_info b ";
		sql += " start with b.bdgid in (select bdg.bdgid ";
		sql += " from bdg_info bdg ";
		sql += " where bdg.pid = '" + pid + "'";
		sql += " and bdg.bdgno = '" + rootId + "')";
		sql += " connect by prior b.bdgid = b.parent";
		List list = bdgInfoDao.getDataAutoCloseSes(sql);
		sBuffer.append("'");
		for (int i = 0; i < list.size(); i++) {
			sBuffer.append((String) list.get(i));
			if (i < list.size() - 1) {
				sBuffer.append(",");
			}
			if (i == (list.size() - 1)) {
				sBuffer.append("'");
			}

		}
		return sBuffer.toString();
	}

	// 根据传入获取当月投资金额
	public double getMonInvestmentByPidAndTimeAndCondition(String pid,
			String time, String contdition) {
		double money = 0d;
		String monPay = "select nvl(sum(nvl(pac.Ratiftmoney,0)),0) ";
		monPay += " from pro_acm_info pac";
		monPay += " left join pro_acm_month pam";
		monPay += " on pac.mon_id = pam.mon_id where pam.billstate=1 and  instr("
				+ contdition + ",pac.bdgid)>0 ";
		monPay += " and pac.pid='" + pid + "' and  pam.month='" + time + "'";
		List monList = bdgInfoDao.getDataAutoCloseSes(monPay);
		if (monList.size() > 0) {
			money = ((BigDecimal) monList.get(0)).doubleValue();
		}
		return money;
	}

	// 获取年投资
	public double getTotalInverstmentByPidAndTimeAndCondition(String pid,
			String time, String condition) {
		double totalMoney = 0d;
		if (time.length() < 4)
			return 0d;
		String t = time.substring(0, 4);
		t += "00";
		String totalSql = "select nvl(sum(nvl(pac.Ratiftmoney,0)),0) ";
		totalSql += " from pro_acm_info pac ";
		totalSql += " left join pro_acm_month pam";
		totalSql += " on pac.mon_id = pam.mon_id";
		totalSql += " where pam.billstate = 1";
		totalSql += " and  instr(" + condition + ", pac.bdgid) > 0";
		totalSql += " and pac.pid = '" + pid + "' ";
		totalSql += " and to_number(pam.month)>to_number(" + t + ")";
		totalSql += " and to_number(pam.month)<=to_number(" + time + ")";

		List yearList = bdgInfoDao.getDataAutoCloseSes(totalSql);
		if (yearList.size() > 0) {
			totalMoney = ((BigDecimal) yearList.get(0)).doubleValue();
		}
		return totalMoney;
	}

	@SuppressWarnings("all")
	public List buildTreeGridNodeTree(String orderBy,
			Integer start, Integer limit, HashMap map) {
		String  parent=(String)map.get("parent");
		String  pid=(String)map.get("pid");
		List<PCBudgetProInof>  list = new ArrayList<PCBudgetProInof>();
		List<BdgInfo> bdgList = bdgInfoDao.findByWhere(BdgInfo.class.getName(), " parent='"+parent+"' and pid='"+pid+"'","bdgid");
		for(int i = 0; i<bdgList.size();i++){
		    PCBudgetProInof pcBdg = new PCBudgetProInof();
		    BdgInfo bdg=new BdgInfo();
		    bdg=bdgList.get(i);
		    pcBdg.setBdgid(bdg.getBdgid());
		    pcBdg.setBdgname(bdg.getBdgname());
		    pcBdg.setBdgmoney(bdg.getBdgmoney());
		    pcBdg.setParent(bdg.getParent());
		    List<VBdgInfo> vBdgInfoList = this.bdgInfoDao.findByWhere(
                    VBdgInfo.class.getName(), "pid='" + bdg.getPid()
                            + "' and bdgid='" + bdg.getBdgid() + "'");
            double claAndChangeApp = 0; // 索赔、变更金额
            double conTotalMoney = 0; // 合同分摊总金额
            double bdgcalconmoney = 0; // 差值 = 概算金额 - 分摊总金额
            double conapp = 0;          //已签合同总金额
			if (vBdgInfoList.size() > 0) {
				claAndChangeApp = vBdgInfoList.get(0).getChangeapp()
						+ vBdgInfoList.get(0).getClaapp();
				conTotalMoney = vBdgInfoList.get(0).getConbdgappmoney();
				bdgcalconmoney = vBdgInfoList.get(0).getBdgmoney()
						- vBdgInfoList.get(0).getConbdgappmoney();
				conapp = vBdgInfoList.get(0).getConapp();
			}
			pcBdg.setChangeappmoney(claAndChangeApp);
			pcBdg.setChangemoney(conTotalMoney);
			pcBdg.setBdgcalconmoney(bdgcalconmoney);
			pcBdg.setContmoney(conapp);
			String nowDate = (String) map.get("nowdate");
			String nowYear = nowDate.substring(0, 4) + "00";
			
			// 计算当前概算项对应的本月投资总额
			String monthSql = "select nvl(sum(nvl(pi.ratiftmoney,0)),0) from pro_acm_tree  pi left join pro_acm_month  pm on pi.mon_id=pm.uids where pm.month='"
					+ nowDate
					+ "' and pi.bdgid='"
					+ bdg.getBdgid()
					+ "' and pi.pid='" + bdg.getPid() + "'";
			double monthProjectMoney = ((BigDecimal) bdgInfoDao
					.getDataAutoCloseSes(monthSql).get(0)).doubleValue();
			pcBdg.setMonthmoney(monthProjectMoney);// 工程量月度统计金额
			// 计算当前年份的投资总额
			String yearSql = "select nvl(sum(nvl(pi.ratiftmoney,0)),0) from pro_acm_tree  pi left join pro_acm_month  pm on pi.mon_id=pm.uids where To_number(pm.month)> To_number('"
					+ nowYear
					+ "') and pi.bdgid='"
					+ bdg.getBdgid()
					+ "' and To_number(pm.month)<= To_number('"
					+ nowDate
					+ "') and pi.pid='" + bdg.getPid() + "'";
			double yearProjectMoney = ((BigDecimal) bdgInfoDao
					.getDataAutoCloseSes(yearSql).get(0)).doubleValue();
			pcBdg.setYearmoney(yearProjectMoney);
			// 计算所有的投资总额
			String allSql = "select nvl(sum(nvl(pi.ratiftmoney,0)),0) from pro_acm_tree  pi left join pro_acm_month  pm on pi.mon_id=pm.uids where   pi.bdgid='"
					+ bdg.getBdgid()
					+ "' and To_number(pm.month)<= To_number('"
					+ nowDate
					+ "') and pi.pid='" + bdg.getPid() + "'";
			double allProjectMoney = ((BigDecimal) bdgInfoDao
					.getDataAutoCloseSes(allSql).get(0)).doubleValue();
			pcBdg.setAllmoney(allProjectMoney);
			// 累计完成比例
			if (conTotalMoney == 0) {
				pcBdg.setPercent("0.00%");
			} else {
				double per = allProjectMoney / conTotalMoney;
				NumberFormat nf = NumberFormat.getPercentInstance();
				nf.setMaximumFractionDigits(2);
				nf.setMinimumFractionDigits(2);
				if (per == 0) {
					pcBdg.setPercent("0.00%");
				} else {
					String p = nf.format(per);
					pcBdg.setPercent(p);
				}
			}
			
           pcBdg.setIsleaf(bdg.getIsleaf());
//         BUG8335新增字段 zhangh 2015-11-16
           String bidbdgmoney_sql = "(SELECT NVL(SUM(NVL(bba.plan_bgmoney,0)),0) bidbdgmoney FROM pc_bid_bdg_apportion bba "
           		+ " WHERE bba.bdgid = '"+bdg.getBdgid()+"' AND bba.pid = '"+bdg.getPid()+"')";
           double bidbdgmoney = ((BigDecimal) bdgInfoDao
					.getDataAutoCloseSes(bidbdgmoney_sql).get(0)).doubleValue();
           pcBdg.setBidbdgmoney(bidbdgmoney);
           list.add(pcBdg);
		} 

		List<PCBudgetProInof>  newList=DynamicDataUtil.changeisLeaf(list, "isleaf");
		return newList;
	}

	public String getJsonStrForTransToZLSByType(String type, String fileId,
			String fileTypes, String yjrName) {

		String fileIdSqlStr = StringUtil.transStrToIn(fileId, ",");
		List<SgccAttachList> list = this.bdgInfoDao.findByWhere(SgccAttachList.class.getName(), "TRANSACTION_ID in (" + fileIdSqlStr
						+ ") and TRANSACTION_TYPE in ("
						+ StringUtil.transStrToIn(fileTypes, ",") + ") ");

		Map<String, String> mainFileNameMap = new HashMap<String, String>();
		Map<String, String> zlTitleMap = new HashMap<String, String>();
		String inWhereStr = "UIDS in (" + fileIdSqlStr + ")";
		if("PCBdgMoneyReport".equals(type)){
			List<BdgMonthMoneyPlan>mainFile=this.bdgInfoDao.findByWhere(BdgMonthMoneyPlan.class.getName(), inWhereStr);
			for (BdgMonthMoneyPlan bdgMonthMoneyPlan : mainFile) {
				zlTitleMap.put(bdgMonthMoneyPlan.getUids(), bdgMonthMoneyPlan.getContent()+" — 费用计划");
			}
		}		

		StringBuffer rtnStrBuf = new StringBuffer("[");
		for (int i = 0; i < list.size(); i++) {
			SgccAttachList sgccAttachList = (SgccAttachList) list.get(i);
			List<ZlInfoBlobList> zlList1 = this.bdgInfoDao.findWhereOrderBy(
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
				ZlInfo zlInfo = (ZlInfo) this.bdgInfoDao.findById(ZlInfo.class.getName(), zlList1.get(0).getInfoid());
				String yjr = zlInfo.getYjr();
				List<ZlTree> zlTreeList = this.bdgInfoDao.findByWhere(
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
}













