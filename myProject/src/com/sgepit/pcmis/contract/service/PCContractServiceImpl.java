package com.sgepit.pcmis.contract.service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pcmis.bid.hbm.PcBidZbApply;
import com.sgepit.pcmis.bid.hbm.PcBidZbContent;
import com.sgepit.pcmis.contract.hbm.ConInfoBean;
import com.sgepit.pcmis.contract.hbm.ConReportBean;
import com.sgepit.pmis.contract.dao.ContractDAO;
import com.sgepit.pmis.contract.hbm.ConOveView;
import com.sgepit.pmis.contract.service.ConAccinfoMgmImpl;

public class PCContractServiceImpl extends BaseMgmImpl implements
		PCContractService {
	private ContractDAO contractDAO;

	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static ConAccinfoMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (ConAccinfoMgmImpl) ctx.getBean("pcConMgm");
	}

	// -------------------------------------------------------------------------
	// Setter methods for dependency injection
	// -------------------------------------------------------------------------
	public void setContractDAO(ContractDAO contractDAO) {
		this.contractDAO = contractDAO;
	}

	public ContractDAO getContractDAO() {
		return (ContractDAO) com.sgepit.frame.base.Constant.wact
				.getBean("contractDAO");
	}

	public List getConInfoGridStr(String orderby, Integer start, Integer limit,
			HashMap params) {
		List list = new ArrayList();
		String sql = "select t.*, rownum as r, pc.pid from pc_zhxx_prj_info pc left join "
				+ "(select temp.p, temp.connum, temp.bdgmoney, temp.changemoney, temp.convalue, temp.conpay from"
                + " (select c.pid as p, (select count(*) from con_ove t where t.pid=c.PID) as connum,"
                + "(select bdgmoney from v_bdg_info b where b.bdgno='01' and b.pid = c.PID) as bdgmoney,"
                + "nvl(sum(nvl(c.convaluemoney, 0)), 0) as convalue,"
                + "nvl(sum(nvl(c.concha, 0)), 0) as changemoney,"
                + "nvl(sum(nvl(c.conpay, 0)), 0) as conpay "
                + "from v_con c  where c.billstate >= 1 group by c.pid) temp) t on pc.pid = t.p where 1 = 1";
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

		if (sbuff.toString() != null && !"".equals(sbuff.toString())) {
			sql += " and  Instr ( '" + sbuff.toString() + "',pc.pid)>0 ";
		} else {
			return list;
		}
		if (proName != null && !"".equals(proName)) {
			sql += " and pc.prj_name like '%" + proName + "%'";
		}
		if (orderby != null && !orderby.trim().equals("")) {
			sql += " order by " + orderby;
		}
		if (start == null || limit == null) {
			List<Map> list1 = JdbcUtil.query(sql);
			if (!list1.isEmpty()) {
				for (int i = 0; i < list1.size(); i++) {
					ConInfoBean con = new ConInfoBean();
					con.setPid((String) list1.get(i).get("PID"));
					con.setConValue((BigDecimal) list1.get(i).get("CONVALUE"));// 合同总金额
					con.setChangeMoney((BigDecimal) list1.get(i).get("CHANGEMONEY"));// 合同变更总金额
					con.setConNum((BigDecimal) list1.get(i).get("CONNUM"));//合同签订总数
					con.setAlreadyPay((BigDecimal) list1.get(i).get("CONPAY"));//合同付款
					con.setBdgMoney((BigDecimal) list1.get(i).get("BDGMONEY"));//执行概算
					list.add(con);
				}
			}

		} else {
			Integer lastRowNum = start + limit;
			String countSql = "select count(*) as num from (" + sql
					+ " ) temp ";
			String pageSql = " select * from (" + sql + " ) p where p.r>"
					+ start + " and p.r<=" + lastRowNum;
			// 查询页数
			List<Map<String, Object>> countList = JdbcUtil.query(countSql);
			Integer count = Integer.valueOf(countList.get(0).get("num")
					.toString());
			List<Map> lis2 = JdbcUtil.query(pageSql);
			if (!lis2.isEmpty()) {
				for (int k = 0; k < lis2.size(); k++) {
					ConInfoBean con = new ConInfoBean();
					con.setPid((String) lis2.get(k).get("PID"));
					con.setConValue((BigDecimal) lis2.get(k).get("CONVALUE"));// 合同总金额
					con.setChangeMoney((BigDecimal) lis2.get(k).get(
							"CHANGEMONEY"));// 合同变更总金额
					list.add(con);
				}
			}
			list.add(count);
		}
		return list;
	}

	public List getConInfoManagerStr(String orderby, Integer start,
			Integer limit, HashMap params) {
		List list = new ArrayList();
		String sql = "select t.*,rownum as r,pc.pid from pc_zhxx_prj_info pc left join "
				+ " (select temp.p,temp.changemoney,temp.bremoney,temp.clamoney,temp.conmoney,temp.alreadypay,temp.convalue,temp.balappmoney from "
				+ " (select c.pid as p, nvl(sum(nvl(c.concha,0)),0) as changemoney,nvl(sum(nvl(c.conbre,0)),0) as bremoney, nvl(sum(nvl(c.concla,0)),0) as clamoney ,"
				+ " nvl(sum(nvl(c.conmoney,0)),0) as conmoney,nvl(sum(nvl(c.conpay,0)),0)as alreadypay,nvl(sum(nvl(c.convaluemoney,0)),0) as convalue, nvl(sum(nvl(c.conbal,0)),0) as balappmoney from v_con c  group by c.pid) temp) t  on pc.pid=t.p where 1=1 ";
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
		if (sbuff.toString() != null && !"".equals(sbuff.toString())) {
			sql += " and  Instr ( '" + sbuff.toString() + "',pc.pid)>0 ";
		} else {
			return list;
		}
		if (proName != null && !"".equals(proName)) {
			sql += " and pc.prj_name like '%" + proName + "%'";
		}
		if (orderby != null && !orderby.trim().equals("")) {
			sql += " order by " + orderby;
		}
		if (start == null || limit == null) {
			List<Map> list1 = JdbcUtil.query(sql);
			if (!list1.isEmpty()) {
				for (int i = 0; i < list1.size(); i++) {
					ConInfoBean con = new ConInfoBean();
					String PID = (String) list1.get(i).get("PID");
					con.setPid(PID);
					// 获取合同实际付款金额
					// String realMoneysql="select sum(paymoney) as paymoney
					// from con_pay where billstate=2 and pid='"+PID+"'";
					// List<Map> realList = JdbcUtil.query(realMoneysql);
					con.setBalAppMoney((BigDecimal) list1.get(i).get(
							"BALAPPMONEY"));// 结算金额
					con.setConValue((BigDecimal) list1.get(i).get("CONVALUE"));// 合同总金额
					con.setChangeMoney((BigDecimal) list1.get(i).get(
							"CHANGEMONEY"));// 合同变更总金额
					con.setClaMoney((BigDecimal) list1.get(i).get("CLAMONEY"));// 索赔金额
					con.setAlreadyPay((BigDecimal) list1.get(i).get(
							"ALREADYPAY"));// 以付款金额
					con.setBreMoney((BigDecimal) list1.get(i).get("BREMONEY"));// 合同违约金额
					con.setConMoney((BigDecimal) list1.get(i).get("CONMONEY"));// 签订金额
					list.add(con);
				}
			}

		} else {
			Integer lastRowNum = start + limit;
			String countSql = "select count(*) as num from (" + sql
					+ " ) temp ";
			String pageSql = " select * from (" + sql + " ) p where p.r>"
					+ start + " and p.r<=" + lastRowNum;
			// 查询页数
			List<Map<String, Object>> countList = JdbcUtil.query(countSql);
			Integer count = Integer.valueOf(countList.get(0).get("num")
					.toString());
			List<Map> lis2 = JdbcUtil.query(pageSql);
			if (!lis2.isEmpty()) {
				for (int k = 0; k < lis2.size(); k++) {
					ConInfoBean con = new ConInfoBean();
					String PID = (String) lis2.get(k).get("PID");
					con.setPid(PID);
					// 获取合同实际付款金额
					// String realMoneysql="select sum(paymoney) as paymoney
					// from con_pay where billstate=2 and pid='"+PID+"'";
					// List<Map> realList = JdbcUtil.query(realMoneysql);
					con.setBalAppMoney((BigDecimal) lis2.get(k).get(
							"BALAPPMONEY"));// 结算金额
					con.setConValue((BigDecimal) lis2.get(k).get("CONVALUE"));// 合同总金额
					con.setChangeMoney((BigDecimal) lis2.get(k).get(
							"CHANGEMONEY"));// 合同变更总金额
					con.setClaMoney((BigDecimal) lis2.get(k).get("CLAMONEY"));// 索赔金额
					con.setAlreadyPay((BigDecimal) lis2.get(k)
							.get("ALREADYPAY"));// 以付款金额
					con.setBreMoney((BigDecimal) lis2.get(k).get("BREMONEY"));// 合同违约金额
					con.setConMoney((BigDecimal) lis2.get(k).get("CONMONEY"));// 签订金额
					list.add(con);
				}
			}
			list.add(count);
		}
		return list;
	}

	public Map<String, String> getProjectSheduleByPid(String pid) {
		double totalmoney = 0;// 签订合同金额
		int connum = 0;// 签订合同数
		double conZX = 0;// 合同执行金额
		List zbPrjList = contractDAO.findByWhere(PcBidZbApply.class.getName(),
				" pid='" + pid + "'");
		for (int i = 0; i < zbPrjList.size(); i++) {
			PcBidZbApply pcBidZbApply = (PcBidZbApply) zbPrjList.get(i);
			List zbContentList = contractDAO.findByWhere(PcBidZbContent.class
					.getName(), " zbUids='" + pcBidZbApply.getUids()
					+ "' and pid='" + pid + "'");
			for (int k = 0; k < zbContentList.size(); k++) {
				PcBidZbContent pcZbCon = (PcBidZbContent) zbContentList.get(k);
				List money = contractDAO.findByWhere(ConOveView.class.getName(),
						"bidtype='" + pcZbCon.getUids() + "'");
				for (int m = 0; m < money.size(); m++) {
					ConOveView conOveView = (ConOveView) money.get(m);
					totalmoney = totalmoney + conOveView.getConmoney();
					conZX = conZX + conOveView.getConvaluemoney();
				}
				connum = connum + money.size();
			}
		}
		Map map = new HashMap<String, String>();
		map.put("sigedConNum", String.valueOf(connum));
		map.put("conMoney", String.valueOf(conZX));
		return map;
	}

	@SuppressWarnings("all")
	public Map<String, String> calculateMoneyByPid(String pid,
			String dateFormat, String sjType) {
		Map map = new HashMap<String, String>();
		// 当月新签合同
		String newcon = " select count(*) from  con_ove c where to_char(c.signdate,'"
				+ dateFormat + "')='" + sjType + "' and c.pid='" + pid + "' and c.BILLSTATE>=1";
		List newConList = contractDAO.getDataAutoCloseSes(newcon);
		if (newConList.size() > 0)
			map.put("newconNum", newConList.get(0));
		else
			map.put("newconNum", "0");
		// 当月新签合同金额
		String newConMoney = "select nvl(sum(nvl(c.convaluemoney,0)),0) from v_con c where to_char(c.signdate,'"
				+ dateFormat + "')='" + sjType + "' and c.pid='" + pid + "' and c.BILLSTATE>=1";
		List monthMoney = contractDAO.getDataAutoCloseSes(newConMoney);
		if (monthMoney.size() > 0)
			map.put("newconMoney", monthMoney.get(0));
		else
			map.put("newconMoney", "0");
		// 累计合同
		String totalConNum = "select count(*) from  con_ove c where c.pid='"
				+ pid + "'  and c.BILLSTATE>=1";
		List totalConNumList = contractDAO.getDataAutoCloseSes(totalConNum);
		if (totalConNumList.size() > 0)
			map.put("totalconNum", totalConNumList.get(0));
		else
			map.put("totalconNum", "0");
		// 累计金额
		String totalConMon = "select nvl(sum(nvl(c.convaluemoney,0)),0) from v_con c where c.pid='"
				+ pid + "' and c.BILLSTATE>=1";
		List totalConMonList = contractDAO.getDataAutoCloseSes(totalConMon);
		if (totalConMonList.size() > 0)
			map.put("totalconMon", totalConMonList.get(0));
		else
			map.put("totalconMon", "0");
		// 本月发生付款合同
		List monConpayNumList = contractDAO
				.getDataAutoCloseSes(" select count(*) from  con_pay c where "
						+ "to_char(c.paydate,'"
						+ dateFormat
						+ "')='"
						+ sjType
						+ "' and c.pid='" + pid + "' and c.billstate=1");
		if (monConpayNumList.size() > 0)
			map.put("monthpayNum", monConpayNumList.get(0));
		else
			map.put("monthpayNum", "0");
		// 本月发生金额
		List monpayMonList = contractDAO
				.getDataAutoCloseSes(" select nvl(sum(nvl(c.paymoney,0)),0) from  con_pay c where "
						+ "to_char(c.paydate,'"
						+ dateFormat
						+ "')='"
						+ sjType
						+ "' and c.pid='" + pid + "' and c.billstate=1");
		if (monpayMonList.size() > 0)
			map.put("monthpayMon", monpayMonList.get(0));
		else
			map.put("monthpayMon", "0");

		List totalConPayNumList = contractDAO
				.getDataAutoCloseSes(" select count(*) from  con_pay c where c.pid='"
						+ pid + "' and c.billstate=1");
		if (totalConPayNumList.size() > 0)
			map.put("totalpayNum", totalConPayNumList.get(0));
		else
			map.put("totalpayNum", "0");

		List totalConPayMonList = contractDAO
				.getDataAutoCloseSes("  select nvl(sum(nvl(c.paymoney,0)),0) from  con_pay c where  c.pid='"
						+ pid + "' and c.billstate=1");
		if (totalConPayMonList.size() > 0)
			map.put("totalPayMon", totalConPayMonList.get(0));
		else
			map.put("totalPayMon", "0");

		// 本月发生概算金额
		String monBdgSql = "select nvl(sum(nvl(bi.bdgmoney,0)),0) from bdg_info bi ";
		monBdgSql += " where bi.bdgid in (select distinct(b.bdgid) ";
		monBdgSql += " from con_ove c, bdg_money_app b ";
		monBdgSql += "   where c.conid = b.conid and b.isleaf = 1 ";
		monBdgSql += "  and c.pid = '" + pid + "' ";
		monBdgSql += "  and to_char(c.signdate,'" + dateFormat + "')='"
				+ sjType + "')";
		List bdgMonList = contractDAO.getDataAutoCloseSes(monBdgSql);
		if (bdgMonList.size() > 0)
			map.put("monthbdgMon", bdgMonList.get(0));
		else
			map.put("monthbdgMon", "0");
		// 累计发生概算金额
		String TotalBdgSql = "select nvl(sum(nvl(bi.bdgmoney,0)),0) from bdg_info bi ";
		TotalBdgSql += " where bi.bdgid in (select distinct(b.bdgid) ";
		TotalBdgSql += " from con_ove c, bdg_money_app b ";
		TotalBdgSql += "   where c.conid = b.conid and b.isleaf = 1 ";
		TotalBdgSql += "  and c.pid = '" + pid + "' )";
		List bdgTotalList = contractDAO.getDataAutoCloseSes(TotalBdgSql);
		if (bdgTotalList.size() > 0)
			map.put("totalbdgMon", bdgTotalList.get(0));
		else
			map.put("totalbdgMon", 0);

		return map;
	}

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) {
		
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		if ("conReport".equals(treeName)) {
			String pid = ((String[]) params.get("pid"))[0];
			if ("-1".equals(parentId)) {
				ConReportBean cb = new ConReportBean();
				String conTypeSql = "select m.* from property_code m, property_type t where m.type_name = t.uids  and t.type_name = '合同划分类型'";
				List typeList = contractDAO.getDataAutoCloseSes(conTypeSql);
				int num=0;
				for (int i = 0; i < typeList.size(); i++) {
					Object[] objs = (Object[]) typeList.get(i);
					ColumnTreeNode ctn = new ColumnTreeNode();
					TreeNode tn = new TreeNode();
					ConReportBean crb = new ConReportBean();
					crb.setContypeid((String) objs[1]);
					crb.setContypename((String) objs[3]);
					tn.setId((String) objs[1]);
					List listCon = contractDAO.findByWhere(ConOveView.class
							.getName(), "condivno='" + (String) objs[1]+"' and pid='"+pid+"'");
					num+=listCon.size();
					if (listCon.size() > 0) {
						tn.setLeaf(false); // treenode.leaf
						tn.setCls("master-task"); // treenode.cls
						tn.setIconCls("task-folder");
						tn.setIfcheck("none");
						crb.setConname(String.valueOf(listCon.size()));// 设置该合同下的总条数
						cb.setConname("");//
					} else {
						tn.setLeaf(true);
						tn.setIconCls("task");// 其下没有几点
						tn.setIfcheck("none");
						crb.setConname("0");// 设置总条数0
						crb.setContotalmoney(0d);// 设置总金额数0
						crb.setSingledmoney(0d);// 设置签订金额0
						crb.setClaandchangemoney(0d);// 设置变更金额
						crb.setBalmoney(0d);// 设置结算金额
						crb.setBdgmoney(0d);// 概算金额
						crb.setMoninvestment(0d);// 设置月投资
						crb.setYearinvestment(0d);// 设置年投资
						crb.setTotalinvestment(0d);// 设置总投资
						crb.setMonpay(0d); // 设置月付款
						crb.setTotalpaypercent("0.00%");// 累计已付比例
						crb.setNotpaymoney(0d);
						crb.setTotalpay(0d);
					}
					tn.setText((String) objs[3]+"("+listCon.size()+")");
					ctn.setTreenode(tn);
					double contotalmoney = 0;
					double singledmoney = 0;
					double claandchangemoney = 0;
					double balmoney = 0;
					double bdgmoney = 0;
					double moninvestment = 0;
					double yearinvestment = 0;
					double totalinvestment = 0;
					double monpay = 0;
					double totalpay = 0;
					double notpaymoney = 0;
					for (int m = 0; m < listCon.size(); m++) {
						ConOveView conOveView = (ConOveView) listCon.get(m);
						contotalmoney += (conOveView.getConvaluemoney());
						singledmoney += (conOveView.getConmoney() == null ? 0
								: conOveView.getConmoney());// 合同签订金额
						claandchangemoney += ((conOveView.getConcha()) + (conOveView
								.getConcla()));// 索赔变更金额
						balmoney +=conOveView.getConbal();
						bdgmoney += (conOveView.getBdgmoney() == null ? 0 : conOveView
								.getBdgmoney());// 概算金额
						Date date = new Date();
						SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
						String str = sdf.format(date);
						String monSql = "select nvl(pro.ratiftmoney,0) from pro_acm_month pro ";
						monSql += " where pro.billstate = 1 ";
						monSql += "  and pro.conid = '" + conOveView.getConid()
						+ "'";
						monSql += " and pro.month ='" + str + "' and pro.pid='"
						+ conOveView.getPid() + "'";
						List monList = contractDAO.getDataAutoCloseSes(monSql);
						if (monList.size() > 0) {
							moninvestment += (((BigDecimal) monList.get(0))
									.doubleValue());// 月投资
						}
						String yearSql = "select nvl(sum(nvl(pro.ratiftmoney,0)),0) ";
						yearSql += " from pro_acm_month pro ";
						yearSql += " where pro.billstate = 1 ";
						yearSql += " and pro.conid = '" + conOveView.getConid()
						+ "'";
						yearSql += " and pro.month like '"
							+ str.substring(0, 4) + "%' and pro.pid='"
							+ conOveView.getPid() + "'";
						List yearList = contractDAO
						.getDataAutoCloseSes(yearSql);
						if (yearList.size() > 0) {
							yearinvestment += (((BigDecimal) yearList.get(0))
									.doubleValue());// 年投资
						}
						String totalSql = "select nvl(sum(nvl(pro.ratiftmoney,0)),0) ";
						totalSql += " from pro_acm_month pro ";
						totalSql += " where pro.billstate = 1 ";
						totalSql += " and pro.conid = '" + conOveView.getConid()
						+ "'";
						totalSql += " and  to_number(pro.month) <= to_number('"
							+ str + "') and pro.pid='" + conOveView.getPid()
							+ "'";
						List totalList = contractDAO
						.getDataAutoCloseSes(totalSql);
						if (totalList.size() > 0) {
							totalinvestment += (((BigDecimal) totalList.get(0))
									.doubleValue());// 合同累计完成投资;
						}
						totalpay += conOveView.getConpay();// 合同累计已付金额
						String monthPay = "select  nvl(sum(nvl(c.paymoney,0)),0) from con_pay c where to_char(c.paydate,'yyyy') ='"
							+ str.substring(0, 4)
							+ "' and to_char(c.paydate,'mm')='"
							+ str.substring(4)
							+ "' and c.billstate=1 and c.conid= '"
							+ conOveView.getConid()
							+ "' and c.pid='"
							+ conOveView.getPid() + "' ";
						List monPay = contractDAO.getDataAutoCloseSes(monthPay);
						if (monPay.size() > 0) {
							monpay += (((BigDecimal) monPay.get(0))
									.doubleValue());// 本月累计付款
						}
						
					}
					crb.setContotalmoney(contotalmoney);// 设置总金额数0
					crb.setSingledmoney(singledmoney);// 设置签订金额0
					crb.setClaandchangemoney(claandchangemoney);// 设置变更金额
					crb.setBalmoney(balmoney);// 设置结算金额
					crb.setBdgmoney(bdgmoney);// 概算金额
					crb.setMoninvestment(moninvestment);// 设置月投资
					crb.setYearinvestment(yearinvestment);// 设置年投资
					crb.setTotalinvestment(totalinvestment);// 设置总投资
					crb.setMonpay(monpay); // 设置月付款
					crb.setTotalpay(totalpay);// 设置总付款
					// 累计已付比例
					if (totalpay == 0 || contotalmoney == 0) {
						crb.setTotalpaypercent("0.00%");// 累计已付比例
					} else {
						double result = totalpay / contotalmoney;
						NumberFormat nf = NumberFormat.getPercentInstance();
						nf.setMaximumFractionDigits(2);
						crb.setTotalpaypercent(nf.format(result));// 累计已付比例
					}
					crb.setNotpaymoney(crb.getContotalmoney()
							- crb.getTotalpay());// 累计未付
					
					cb.setContotalmoney((cb.getContotalmoney() == null ? 0 : cb
							.getContotalmoney())
							+ contotalmoney);// 设置总金额数0
					cb.setSingledmoney((cb.getSingledmoney() == null ? 0 : cb
							.getSingledmoney())
							+ singledmoney);// 设置签订金额0
					cb
					.setClaandchangemoney((cb.getClaandchangemoney() == null ? 0
							: cb.getClaandchangemoney())
							+ claandchangemoney);// 设置变更金额
					cb.setBalmoney((cb.getBalmoney() == null ? 0 : cb
							.getBalmoney())
							+ balmoney);// 设置结算金额
					cb.setBdgmoney((cb.getBdgmoney() == null ? 0 : cb
							.getBdgmoney())
							+ bdgmoney);// 概算金额
					cb.setMoninvestment((cb.getMoninvestment() == null ? 0 : cb
							.getMoninvestment())
							+ moninvestment);// 设置月投资
					cb.setYearinvestment((cb.getYearinvestment() == null ? 0
							: cb.getYearinvestment())
							+ yearinvestment);// 设置年投资
					cb.setTotalinvestment((cb.getTotalinvestment() == null ? 0
							: cb.getTotalinvestment())
							+ totalinvestment);// 设置总投资
					cb.setMonpay((cb.getMonpay() == null ? 0 : cb.getMonpay())
							+ monpay); // 设置月付款
					cb.setTotalpay((cb.getTotalpay() == null ? 0 : cb
							.getTotalpay())
							+ totalpay);// 设置总付款
					ctn.setColumns(JSONObject.fromObject(crb));
					list.add(ctn);
				}
				ColumnTreeNode cn = new ColumnTreeNode();
				TreeNode tNode = new TreeNode();
				tNode.setId("heji");
				tNode.setLeaf(true);
				tNode.setIconCls("task");// 其下没有几点
				tNode.setIfcheck("none");
				cn.setTreenode(tNode);
				// 累计
				if (cb.getTotalpay() == null || cb.getTotalpay() == 0
						|| cb.getContotalmoney() == 0) {
					cb.setTotalpaypercent("0.00%");// 累计已付比例
					cb.setNotpaymoney(cb.getContotalmoney() - cb.getTotalpay());
				} else {
					double result = cb.getTotalpay() / cb.getContotalmoney();
					NumberFormat nf = NumberFormat.getPercentInstance();
					nf.setMaximumFractionDigits(2);
					cb.setTotalpaypercent(nf.format(result));// 累计已付比例
					cb.setNotpaymoney(cb.getContotalmoney() - cb.getTotalpay());
				}
				cb.setContypename("合&nbsp;计"+"("+num+")");
				cn.setColumns(JSONObject.fromObject(cb));
				list.add(cn);
			} else {
				List<ColumnTreeNode> list1 = new ArrayList<ColumnTreeNode>();
				List listCon = contractDAO.findByWhere(ConOveView.class.getName(),
						"condivno='" + parentId + "' and pid='" + pid + "'");
				for (int m = 0; m < listCon.size(); m++) {
					ColumnTreeNode columnTreeNode = new ColumnTreeNode();
					TreeNode treeNode = new TreeNode();
					ConOveView conOveView = (ConOveView) listCon.get(m);
					treeNode.setId(conOveView.getConid());
					treeNode.setText(conOveView.getConname());
					treeNode.setLeaf(true);
					treeNode.setIconCls("task");// 其下没有几点
					treeNode.setIfcheck("none");
					ConReportBean conReportBean = new ConReportBean();
					conReportBean.setContypename(conOveView.getConname());
					conReportBean.setContypeid(conOveView.getConid());
					conReportBean.setConname(conOveView.getConname());
					conReportBean
					.setContotalmoney(conOveView.getConvaluemoney());// 合同总金额
					conReportBean.setSingledmoney(conOveView.getConmoney());// 合同签订金额
					conReportBean
					.setClaandchangemoney((conOveView.getConcha())
							+ (conOveView.getConcla()));// 索赔变更金额
					// 合同结算金额
					conReportBean.setBalmoney(conOveView.getConbal());// 设置结算金额
					conReportBean.setBdgmoney(conOveView.getBdgmoney());// 概算金额
					conReportBean.setPaypercent(conOveView.getPayper());// 付款比例
					Date date = new Date();
					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
					String str = sdf.format(date);
					String monSql = "select nvl(pro.ratiftmoney,0) from pro_acm_month pro ";
					monSql += " where pro.billstate = 1 ";
					monSql += "  and pro.conid = '" + conOveView.getConid() + "'";
					monSql += " and pro.month ='" + str + "' and pro.pid='"
					+ conOveView.getPid() + "'";
					List monList = contractDAO.getDataAutoCloseSes(monSql);
					if (monList.size() > 0) {
						conReportBean.setMoninvestment(((BigDecimal) monList
								.get(0)).doubleValue());// 月投资
					} else {
						conReportBean.setMoninvestment(0d);
					}
					String yearSql = "select nvl(sum(nvl(pro.ratiftmoney,0)),0) ";
					yearSql += " from pro_acm_month pro ";
					yearSql += " where pro.billstate = 1 ";
					yearSql += " and pro.conid = '" + conOveView.getConid() + "'";
					yearSql += " and pro.month like '" + str.substring(0, 4)
					+ "%' and pro.pid='" + conOveView.getPid() + "'";
					List yearList = contractDAO.getDataAutoCloseSes(yearSql);
					if (yearList.size() > 0) {
						conReportBean.setYearinvestment(((BigDecimal) yearList
								.get(0)).doubleValue());// 年投资
					} else {
						conReportBean.setYearinvestment(0d);
					}
					
					String totalSql = "select nvl(sum(nvl(pro.ratiftmoney,0)),0) ";
					totalSql += " from pro_acm_month pro ";
					totalSql += " where pro.billstate = 1 ";
					totalSql += " and pro.conid = '" + conOveView.getConid() + "'";
					totalSql += " and  to_number(pro.month) <= to_number('"
						+ str + "') and pro.pid='" + conOveView.getPid() + "'";
					List totalList = contractDAO.getDataAutoCloseSes(totalSql);
					if (totalList.size() > 0) {
						conReportBean
						.setTotalinvestment(((BigDecimal) totalList
								.get(0)).doubleValue());// 合同累计完成投资;
					} else {
						conReportBean.setTotalinvestment(0d);// 合同累计完成投资;
					}
					conReportBean
					.setTotalpay(conOveView.getConpay());// 合同累计已付金额
					String monthPay = "select  nvl(sum(nvl(c.paymoney,0)),0) from con_pay c where to_char(c.paydate,'yyyy') ='"
						+ str.substring(0, 4)
						+ "' and to_char(c.paydate,'mm')='"
						+ str.substring(4)
						+ "' and c.billstate=1 and c.conid= '"
						+ conOveView.getConid()
						+ "' and c.pid='"
						+ conOveView.getPid() + "' ";
					List monPay = contractDAO.getDataAutoCloseSes(monthPay);
					if (monPay.size() > 0) {
						conReportBean.setMonpay(((BigDecimal) monPay.get(0))
								.doubleValue());// 本月累计付款
					} else {
						conReportBean.setMonpay(0d);
					}
					// 累计已付比例
					if (conReportBean.getTotalpay() == null
							|| conReportBean.getTotalpay() == 0
							|| conReportBean.getContotalmoney() == 0) {
						conReportBean.setTotalpaypercent("0.00%");// 累计已付比例
						conReportBean.setNotpaymoney(conReportBean
								.getContotalmoney()
								- conReportBean.getTotalpay());
					} else {
						double result = conReportBean.getTotalpay()
						/ conReportBean.getContotalmoney();
						NumberFormat nf = NumberFormat.getPercentInstance();
						nf.setMaximumFractionDigits(2);
						conReportBean.setTotalpaypercent(nf.format(result));// 累计已付比例
						conReportBean.setNotpaymoney(conReportBean
								.getContotalmoney()
								- conReportBean.getTotalpay());
					}
					columnTreeNode.setTreenode(treeNode);
					JSONObject jObject = JSONObject.fromObject(conReportBean);
					columnTreeNode.setColumns(jObject);
					list1.add(columnTreeNode);
				}
				return list1;
			}
		}
		return list;
	}
	
	/**
	 * 合同动态台帐数据 treegrid
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param params
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-3-15
	 */
	public List<ConReportBean> buildConReportTreeGrid(String orderBy, Integer start, Integer limit, HashMap params) {
		List<ConReportBean> list = new ArrayList<ConReportBean>();
		String pid = (String) params.get("pid");
		String parentId = (String) params.get("parent");
		String sjType= (String) params.get("nowdate");	
		if ("0".equals(parentId)) {
//			获取合同分类
			ConReportBean cb = new ConReportBean();
			String conTypeSql = "select m.* from property_code m, property_type t where m.type_name = t.uids  and t.type_name = '合同划分类型' order by item_id";
			List typeList = contractDAO.getDataAutoCloseSes(conTypeSql);
			int num=0;
			
//			分类合计数据
			double cb_m_build = 0;
			double cb_y_build = 0;
			double cb_t_build = 0;
			
			double cb_m_equ = 0;
			double cb_y_equ = 0;
			double cb_t_equ = 0;
			
			double cb_m_install = 0;
			double cb_y_install = 0;
			double cb_t_install = 0;
			
			double cb_m_other = 0;
			double cb_y_other = 0;
			double cb_t_other = 0;
			
			for (int i = 0; i < typeList.size(); i++) {
				Object[] objs = (Object[]) typeList.get(i);
				String condivno = (String) objs[1];
				ConReportBean crb = new ConReportBean();
				crb.setContypeid(condivno);
				crb.setParent("0");					
				List listCon = contractDAO.findByWhere(ConOveView.class.getName(), "condivno='" + condivno +"' and pid='"+pid+"'");
				crb.setContypename((String) objs[3]+"(" + listCon.size() + ")");
				num+=listCon.size();
				if (listCon.size() > 0) {
					crb.setIsleaf(0L);
					crb.setConname(String.valueOf(listCon.size()));// 设置该合同下的总条数
					cb.setConname("");//
				} else {
					crb.setIsleaf(1L);
					crb.setConname("0");// 设置总条数0
					crb.setContotalmoney(0d);// 设置总金额数0
					crb.setSingledmoney(0d);// 设置签订金额0
					crb.setClaandchangemoney(0d);// 设置变更金额
					crb.setBalmoney(0d);// 设置结算金额
					crb.setBdgmoney(0d);// 概算金额
					crb.setMoninvestment(0d);// 设置月投资
					crb.setYearinvestment(0d);// 设置年投资
					crb.setTotalinvestment(0d);// 设置总投资
					crb.setMonpay(0d); // 设置月付款
					crb.setTotalpaypercent("0.00%");// 累计已付比例
					crb.setNotpaymoney(0d);
					crb.setTotalpay(0d);
				}
				double contotalmoney = 0;
				double singledmoney = 0;
				double claandchangemoney = 0;
				double balmoney = 0;
				double bdgmoney = 0;
				double moninvestment_build = 0;
				double yearinvestment_build = 0;
				double totalinvestment_build = 0;
				double moninvestment_install = 0;
				double yearinvestment_install = 0;
				double totalinvestment_install = 0;
				double moninvestment_equ = 0;
				double yearinvestment_equ = 0;
				double totalinvestment_equ = 0;
				double moninvestment_other = 0;
				double yearinvestment_other = 0;
				double totalinvestment_other = 0;
				double monpay = 0;
				double totalpay = 0;
				String monthPayAll = "select  nvl(sum(nvl(c.paymoney,0)),0) from con_pay c where to_char(c.paydate,'yyyy') ='" + sjType.substring(0, 4)
				+ "' and to_char(c.paydate,'mm')='" + sjType.substring(4)
				+ "' and c.billstate=1 and c.conid in(select conid from con_ove where condivno='" + condivno +"' and pid='"+pid+"') and c.pid='" + pid+ "' ";
				List monPayAll = contractDAO.getDataAutoCloseSes(monthPayAll);
				if (monPayAll.size() > 0) {
					monpay=((BigDecimal) monPayAll.get(0)).doubleValue();// 本月累计付款按分类
				}				
				//建筑
				String buildDataSql_m = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and month ='" + sjType + "' and pid='" + pid + "'" +
						" and bdgno = '0101'";
				String buildDataSql_y = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and month like '" + sjType.substring(0,4) + "%' and pid='" + pid + "'" +
						" and bdgno = '0101'";
				String buildDataSql_t = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and pid='" + pid + "'" +
						" and bdgno = '0101'";
				List monList_build = contractDAO.getDataAutoCloseSes(buildDataSql_m);
				if (monList_build.size() > 0) {
					moninvestment_build = (((BigDecimal) monList_build.get(0)).doubleValue());// 月投资
				}
				List yearList_build = contractDAO.getDataAutoCloseSes(buildDataSql_y);
				if (yearList_build.size() > 0) {
					yearinvestment_build = (((BigDecimal) yearList_build.get(0)).doubleValue());// 年度投资累计
				}
				List totalList_build = contractDAO.getDataAutoCloseSes(buildDataSql_t);
				if (totalList_build.size() > 0) {
					totalinvestment_build = (((BigDecimal) totalList_build.get(0)).doubleValue());// 自开工累计
				}
				crb.setMoninvestment_build(moninvestment_build);
				crb.setYearinvestment_build(yearinvestment_build);
				crb.setTotalinvestment_build(totalinvestment_build);
				
				//安装
				String installDataSql_m = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and month ='" + sjType + "' and pid='" + pid + "'" +
						" and bdgno = '0103'";
				String installDataSql_y = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and month like '" + sjType.substring(0,4) + "%' and pid='" + pid + "'" +
						" and bdgno = '0103'";
				String installDataSql_t = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and pid='" + pid + "'" +
						" and bdgno = '0103'";
				List monList_install = contractDAO.getDataAutoCloseSes(installDataSql_m);
				if (monList_install.size() > 0) {
					moninvestment_install = (((BigDecimal) monList_install.get(0)).doubleValue());// 月投资
				}
				List yearList_install = contractDAO.getDataAutoCloseSes(installDataSql_y);
				if (yearList_install.size() > 0) {
					yearinvestment_install = (((BigDecimal) yearList_install.get(0)).doubleValue());// 年度投资累计
				}
				List totalList_install = contractDAO.getDataAutoCloseSes(installDataSql_t);
				if (totalList_install.size() > 0) {
					totalinvestment_install = (((BigDecimal) totalList_install.get(0)).doubleValue());// 自开工累计投资
				}
				crb.setMoninvestment_install(moninvestment_install);
				crb.setYearinvestment_install(yearinvestment_install);
				crb.setTotalinvestment_install(totalinvestment_install);
				
				//设备
				String equDataSql_m = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and month ='" + sjType + "' and pid='" + pid + "'" +
						" and bdgno = '0102'";
				String equDataSql_y = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and month like '" + sjType.substring(0,4) + "%' and pid='" + pid + "'" +
						" and bdgno = '0102'";
				String equDataSql_t = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and pid='" + pid + "'" +
						" and bdgno = '0102'";
				List monList_equ = contractDAO.getDataAutoCloseSes(equDataSql_m);
				if (monList_equ.size() > 0) {
					moninvestment_equ = (((BigDecimal) monList_equ.get(0)).doubleValue());// 月投资
				}
				List yearList_equ = contractDAO.getDataAutoCloseSes(equDataSql_y);
				if (yearList_equ.size() > 0) {
					yearinvestment_equ = (((BigDecimal) yearList_equ.get(0)).doubleValue());// 年度投资累计
				}
				List totalList_equ = contractDAO.getDataAutoCloseSes(equDataSql_t);
				if (totalList_equ.size() > 0) {
					totalinvestment_equ = (((BigDecimal) totalList_equ.get(0)).doubleValue());// 自开工累计
				}
				crb.setMoninvestment_equ(moninvestment_equ);
				crb.setYearinvestment_equ(yearinvestment_equ);
				crb.setTotalinvestment_equ(totalinvestment_equ);
				
				//其他
				String otherDataSql_m = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and month ='" + sjType + "' and pid='" + pid + "'" +
						" and bdgno = '0104'";
				String otherDataSql_y = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and month like '" + sjType.substring(0,4) + "%' and pid='" + pid + "'" +
						" and bdgno = '0104'";
				String otherDataSql_t = "select nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and condivno ='" + condivno + "'" +
						" and pid='" + pid + "'" +
						" and bdgno = '0104'";
				List monList_other = contractDAO.getDataAutoCloseSes(otherDataSql_m);
				if (monList_other.size() > 0) {
					moninvestment_other = (((BigDecimal) monList_other.get(0)).doubleValue());// 月投资
				}
				List yearList_other = contractDAO.getDataAutoCloseSes(otherDataSql_y);
				if (yearList_other.size() > 0) {
					yearinvestment_other = (((BigDecimal) yearList_other.get(0)).doubleValue());// 年度累计
				}
				List totalList_other = contractDAO.getDataAutoCloseSes(otherDataSql_t);
				if (totalList_other.size() > 0) {
					totalinvestment_other = (((BigDecimal) totalList_other.get(0)).doubleValue());// 自开工累计
				}
				crb.setMoninvestment_other(moninvestment_other);
				crb.setYearinvestment_other(yearinvestment_other);
				crb.setTotalinvestment_other(totalinvestment_other);
				
				//合同数据汇总
				for (int m = 0; m < listCon.size(); m++) {				
					ConOveView conOveView = (ConOveView) listCon.get(m);
					contotalmoney += (conOveView.getConvaluemoney());
					singledmoney += (conOveView.getConmoney() == null ? 0 : conOveView.getConmoney());// 合同签订金额
					claandchangemoney += ((conOveView.getConcha()) + (conOveView.getConcla()));// 索赔变更金额
					balmoney +=conOveView.getConbal();
					bdgmoney += (conOveView.getBdgmoney() == null ? 0 : conOveView.getBdgmoney());// 概算金额
					totalpay += conOveView.getConpay();// 合同累计已付金额
				}							
				crb.setContotalmoney(contotalmoney);// 设置总金额数0
				crb.setSingledmoney(singledmoney);// 设置签订金额0
				crb.setClaandchangemoney(claandchangemoney);// 设置变更金额
				crb.setBalmoney(balmoney);// 设置结算金额
				crb.setBdgmoney(bdgmoney);// 概算金额
				crb.setMonpay(monpay); // 设置月付款
				crb.setTotalpay(totalpay);// 设置总付款
				// 累计已付比例
				if (totalpay == 0 || contotalmoney == 0) {
					crb.setTotalpaypercent("0.00%");// 累计已付比例
				} else {
					double result = totalpay / contotalmoney;
					NumberFormat nf = NumberFormat.getPercentInstance();
					nf.setMaximumFractionDigits(2);
					crb.setTotalpaypercent(nf.format(result));// 累计已付比例
				}
				crb.setNotpaymoney(crb.getContotalmoney() - crb.getTotalpay());// 累计未付

				cb.setContotalmoney((cb.getContotalmoney() == null ? 0 : cb.getContotalmoney()) + contotalmoney);// 设置总金额数0
				cb.setSingledmoney((cb.getSingledmoney() == null ? 0 : cb.getSingledmoney()) + singledmoney);// 设置签订金额0
				cb.setClaandchangemoney((cb.getClaandchangemoney() == null ? 0 : cb.getClaandchangemoney()) + claandchangemoney);// 设置变更金额
				cb.setBalmoney((cb.getBalmoney() == null ? 0 : cb.getBalmoney()) + balmoney);// 设置结算金额
				cb.setBdgmoney((cb.getBdgmoney() == null ? 0 : cb.getBdgmoney()) + bdgmoney);// 概算金额
//				建筑
				cb.setMoninvestment_build((cb.getMoninvestment_build() == null ? 0 : cb.getMoninvestment_build()) + moninvestment_build);// 设置月投资
				cb.setYearinvestment_build((cb.getYearinvestment_build() == null ? 0 : cb.getYearinvestment_build()) + yearinvestment_build);// 设置年投资
				cb.setTotalinvestment_build((cb.getTotalinvestment_build() == null ? 0 : cb.getTotalinvestment_build()) + totalinvestment_build);// 设置总投资
//				设备
				cb.setMoninvestment_equ((cb.getMoninvestment_equ() == null ? 0 : cb.getMoninvestment_equ()) + moninvestment_equ);// 设置月投资
				cb.setYearinvestment_equ((cb.getYearinvestment_equ() == null ? 0 : cb.getYearinvestment_equ()) + yearinvestment_equ);// 设置年投资
				cb.setTotalinvestment_equ((cb.getTotalinvestment_equ() == null ? 0 : cb.getTotalinvestment_equ()) + totalinvestment_equ);// 设置总投资
//				安装
				cb.setMoninvestment_install((cb.getMoninvestment_install() == null ? 0 : cb.getMoninvestment_install()) + moninvestment_install);// 设置月投资
				cb.setYearinvestment_install((cb.getYearinvestment_install() == null ? 0 : cb.getYearinvestment_install()) + yearinvestment_install);// 设置年投资
				cb.setTotalinvestment_install((cb.getTotalinvestment_install() == null ? 0 : cb.getTotalinvestment_install()) + totalinvestment_install);// 设置总投资
//				其他
				cb.setMoninvestment_other((cb.getMoninvestment_other() == null ? 0 : cb.getMoninvestment_other()) + moninvestment_other);// 设置月投资
				cb.setYearinvestment_other((cb.getYearinvestment_other() == null ? 0 : cb.getYearinvestment_other()) + yearinvestment_other);// 设置年投资
				cb.setTotalinvestment_other((cb.getTotalinvestment_other() == null ? 0 : cb.getTotalinvestment_other()) + totalinvestment_other);// 设置总投资
				cb.setMonpay((cb.getMonpay() == null ? 0 : cb.getMonpay()) + monpay); // 设置月付款
				cb.setTotalpay((cb.getTotalpay() == null ? 0 : cb.getTotalpay()) + totalpay);// 设置总付款
				list.add(crb);
			}
			// 累计
			if (cb.getTotalpay() == null || cb.getTotalpay() == 0 || cb.getContotalmoney() == 0) {
				cb.setTotalpaypercent("0.00%");// 累计已付比例
				cb.setNotpaymoney(cb.getContotalmoney() - cb.getTotalpay());
			} else {
				double result = cb.getTotalpay() / cb.getContotalmoney();
				NumberFormat nf = NumberFormat.getPercentInstance();
				nf.setMaximumFractionDigits(2);
				cb.setTotalpaypercent(nf.format(result));// 累计已付比例
				cb.setNotpaymoney(cb.getContotalmoney() - cb.getTotalpay());
			}
			cb.setParent("0");
			cb.setIsleaf(1L);
			cb.setContypeid("ALL");
			cb.setContypename("合&nbsp;计"+"("+num+")");
			list.add(cb);
		} else {
			List<ConReportBean> list1 = new ArrayList<ConReportBean>();
			List listCon = contractDAO.findByWhere(ConOveView.class.getName(), "condivno='" + parentId + "' and pid='" + pid + "'");
			for (int m = 0; m < listCon.size(); m++) {
				ConOveView conOveView = (ConOveView) listCon.get(m);
				ConReportBean conReportBean = new ConReportBean();
				conReportBean.setParent(conOveView.getCondivno());
				conReportBean.setContypename(conOveView.getConname());
				conReportBean.setContypeid(conOveView.getConid());
				conReportBean.setConname(conOveView.getConname());
				conReportBean.setContotalmoney(conOveView.getConvaluemoney());// 合同总金额
				conReportBean.setSingledmoney(conOveView.getConmoney());// 合同签订金额
				conReportBean.setClaandchangemoney((conOveView.getConcha()) + (conOveView.getConcla()));// 索赔变更金额
				// 合同结算金额
				conReportBean.setBalmoney(conOveView.getConbal());// 设置结算金额
				conReportBean.setBdgmoney(conOveView.getBdgmoney());// 概算金额
				conReportBean.setPaypercent(conOveView.getPayper());// 付款比例
				
				//建筑
				String buildDataSql_m = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and month ='" + sjType + "' and pid='" + pid + "'" +
						" and bdgno = '0101'";
				String buildDataSql_y = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and month like '" + sjType.substring(0,4) + "%' and pid='" + pid + "'" +
						" and bdgno = '0101'";
				String buildDataSql_t = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and pid='" + pid + "'" +
						" and bdgno = '0101'";
				List monList_build = contractDAO.getDataAutoCloseSes(buildDataSql_m);
				if (monList_build.size() > 0) {
					double m_investment_build = (((BigDecimal) monList_build.get(0)).doubleValue());// 月投资
					conReportBean.setMoninvestment_build(m_investment_build);
				}
				List yearList_build = contractDAO.getDataAutoCloseSes(buildDataSql_y);
				if (yearList_build.size() > 0) {
					double y_investment_build = (((BigDecimal) yearList_build.get(0)).doubleValue());// 年度投资累计
					conReportBean.setYearinvestment_build(y_investment_build);
				}
				List totalList_build = contractDAO.getDataAutoCloseSes(buildDataSql_t);
				if (totalList_build.size() > 0) {
					double t_investment_build = (((BigDecimal) totalList_build.get(0)).doubleValue());// 自开工累计
					conReportBean.setTotalinvestment_build(t_investment_build);
				}
				
				//安装
				String installDataSql_m = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and month ='" + sjType + "' and pid='" + pid + "'" +
						" and bdgno = '0103'";
				String installDataSql_y = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and month like '" + sjType.substring(0,4) + "%' and pid='" + pid + "'" +
						" and bdgno = '0103'";
				String installDataSql_t = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and pid='" + pid + "'" +
						" and bdgno = '0103'";
				List monList_install = contractDAO.getDataAutoCloseSes(installDataSql_m);
				if (monList_install.size() > 0) {
					double m_investment_install = (((BigDecimal) monList_install.get(0)).doubleValue());// 月投资
					conReportBean.setMoninvestment_install(m_investment_install);
				}
				List yearList_install = contractDAO.getDataAutoCloseSes(installDataSql_y);
				if (yearList_install.size() > 0) {
					double y_investment_install = (((BigDecimal) yearList_install.get(0)).doubleValue());// 年度投资累计
					conReportBean.setYearinvestment_install(y_investment_install);
				}
				List totalList_install = contractDAO.getDataAutoCloseSes(installDataSql_t);
				if (totalList_install.size() > 0) {
					double t_investment_install = (((BigDecimal) totalList_install.get(0)).doubleValue());// 自开工累计投资
					conReportBean.setTotalinvestment_install(t_investment_install);
				}
				
				//设备
				String equDataSql_m = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and month ='" + sjType + "' and pid='" + pid + "'" +
						" and bdgno = '0102'";
				String equDataSql_y = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and month like '" + sjType.substring(0,4) + "%' and pid='" + pid + "'" +
						" and bdgno = '0102'";
				String equDataSql_t = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and pid='" + pid + "'" +
						" and bdgno = '0102'";
				List monList_equ = contractDAO.getDataAutoCloseSes(equDataSql_m);
				if (monList_equ.size() > 0) {
					double m_investment_equ = (((BigDecimal) monList_equ.get(0)).doubleValue());// 月投资
					conReportBean.setMoninvestment_equ(m_investment_equ);
				}
				List yearList_equ = contractDAO.getDataAutoCloseSes(equDataSql_y);
				if (yearList_equ.size() > 0) {
					double y_investment_equ = (((BigDecimal) yearList_equ.get(0)).doubleValue());// 年度投资累计
					conReportBean.setYearinvestment_equ(y_investment_equ);
				}
				List totalList_equ = contractDAO.getDataAutoCloseSes(equDataSql_t);
				if (totalList_equ.size() > 0) {
					double t_investment_equ = (((BigDecimal) totalList_equ.get(0)).doubleValue());// 自开工累计
					conReportBean.setTotalinvestment_equ(t_investment_equ);
				}
				
				//其他
				String otherDataSql_m = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and month ='" + sjType + "' and pid='" + pid + "'" +
						" and bdgno = '0104'";
				String otherDataSql_y = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and month like '" + sjType.substring(0,4) + "%' and pid='" + pid + "'" +
						" and bdgno = '0104'";
				String otherDataSql_t = "select  nvl(sum(nvl(ratiftmoney, 0)), 0) from v_tzwc_month_data  " +
						" where billstate = 1 " +
						" and conid ='" + conOveView.getConid() + "'" +
						" and pid='" + pid + "'" +
						" and bdgno = '0104'";
				List monList_other = contractDAO.getDataAutoCloseSes(otherDataSql_m);
				if (monList_other.size() > 0) {
					double m_investment_other = (((BigDecimal) monList_other.get(0)).doubleValue());// 月投资
					conReportBean.setMoninvestment_other(m_investment_other);
				}
				List yearList_other = contractDAO.getDataAutoCloseSes(otherDataSql_y);
				if (yearList_other.size() > 0) {
					double y_investment_other = (((BigDecimal) yearList_other.get(0)).doubleValue());// 年度累计
					conReportBean.setYearinvestment_other(y_investment_other);
				}
				List totalList_other = contractDAO.getDataAutoCloseSes(otherDataSql_t);
				if (totalList_other.size() > 0) {
					double t_investment_other = (((BigDecimal) totalList_other.get(0)).doubleValue());// 自开工累计
					conReportBean.setTotalinvestment_other(t_investment_other);
				}
				
				conReportBean.setTotalpay(conOveView.getConpay());// 合同累计已付金额
				String monthPay = "select  nvl(sum(nvl(c.paymoney,0)),0) from con_pay c where to_char(c.paydate,'yyyy') ='" + sjType.substring(0, 4)
						+ "' and to_char(c.paydate,'mm')='" + sjType.substring(4)
						+ "' and c.billstate=1 and c.conid= '" + conOveView.getConid()
						+ "' and c.pid='" + conOveView.getPid() + "' ";
				List monPay = contractDAO.getDataAutoCloseSes(monthPay);
				if (monPay.size() > 0) {
					conReportBean.setMonpay(((BigDecimal) monPay.get(0)).doubleValue());// 本月累计付款
				} else {
					conReportBean.setMonpay(0d);
				}
				// 累计已付比例
				if (conReportBean.getTotalpay() == null
						|| conReportBean.getTotalpay() == 0
						|| conReportBean.getContotalmoney() == 0) {
					conReportBean.setTotalpaypercent("0.00%");// 累计已付比例
					conReportBean.setNotpaymoney(conReportBean.getContotalmoney() - conReportBean.getTotalpay());
				} else {
					double result = conReportBean.getTotalpay() / conReportBean.getContotalmoney();
					NumberFormat nf = NumberFormat.getPercentInstance();
					nf.setMaximumFractionDigits(2);
					conReportBean.setTotalpaypercent(nf.format(result));// 累计已付比例
					conReportBean.setNotpaymoney(conReportBean.getContotalmoney() - conReportBean.getTotalpay());
				}
				conReportBean.setIsleaf(1L);
				list1.add(conReportBean);
			}
			return list1;
		}
		return list;
	}
}
