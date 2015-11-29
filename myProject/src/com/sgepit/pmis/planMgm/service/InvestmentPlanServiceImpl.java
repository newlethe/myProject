package com.sgepit.pmis.planMgm.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import oracle.sql.BLOB;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.planMgm.PlanMgmConstant;
import com.sgepit.pmis.planMgm.dao.PlanMasterDAO;
import com.sgepit.pmis.planMgm.hbm.PlanMaster;
import com.sgepit.pmis.planMgm.hbm.PlanOtherCostItem;

/**
 * 投资及资金计划主记录信息
 * 
 * @author Ivy
 * @createDate 2010-12-12
 * 
 */
public class InvestmentPlanServiceImpl extends BaseMgmImpl implements InvestmentPlanService{
	
	public PlanMasterDAO planMasterDAO;
	
	private String rootBdgId = "010401";
	
	public void setPlanMasterDAO(PlanMasterDAO planMasterDAO) {
		this.planMasterDAO = planMasterDAO;
	}

	/**
	 * 保存投资和资金计划主记录的信息：(包括插入和更新)
	 * @param master
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-12
	 */
	public String savePlanMaster(PlanMaster master){
		if (master!=null) {
			String masterId = master.getUids();
			if (masterId==null || masterId.trim().length()==0) {
				masterId = planMasterDAO.insert( master);
			}else{
				planMasterDAO.saveOrUpdate(master);
			}			
			return masterId;
		} else {
			return null;
		}
	}
	
	/**
	 * 根据业务类型、单位、 时间， 获得投资计划的主记录信息；
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-12
	 */
	public PlanMaster getPlanMasterInfo(String businessType, String unitId, String sjType) {
		List<PlanMaster> l = planMasterDAO.findByWhere(PlanMaster.class.getName(), "business_type='" + businessType + "' and unit_Id='" + unitId + "' and sj_type='" + sjType + "'");
		if (l.size()>0) {
			return l.get(0);
		} else {
			return null;
		}
	}
	
	/**
	 * 检查要添加的记录中，是否在数据库中已存在；
	 * @param businessType
	 * @param unitId
	 * @param sjType	可能为多个时间，用`连接；
	 * @param contractId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-19
	 */
	public boolean checkSaveData(String businessType, String sjTypes, String unitId, String contractId){
		String sjTypeInStr = StringUtil.transStrToIn(sjTypes, "`");
		String selectSql = " select uids from plan_master where business_type='" + businessType + "' and unit_id='" + unitId + "' and sj_type in (" + sjTypeInStr + ")";
		if (contractId!=null && contractId.length()>0) {
			selectSql += " and conid ='" + contractId + "'";
		}
		List l = JdbcUtil.query(selectSql);
		if (l.size()>0) {
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * 根据主键 获得投资计划的主记录信息；
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-12
	 */
	public PlanMaster getPlanMasterInfoById(String masterId) {
		return (PlanMaster) planMasterDAO.findById(PlanMaster.class.getName(), masterId);
	}
	/**
	 * 获取可以新增的数据期别
	 * @param businessType   业务类型
	 * @param unitId         上报单位ID
	 * @param conId          合同ID
	 * @return
	 */
	public String getSjTypeForPlan(String businessType,String unitId,String conId){
		String jsonStr = "";
		Date date = new Date();
		int curYear = date.getYear()+1900;
		int lastYear = curYear - 0;
		int nextYear = curYear + 1;
		//从计划主表中获取已经存在的数据期别
		String yearInStr = "'"+String.valueOf(lastYear)+"',"+"'"+String.valueOf(curYear)+"',"+"'"+String.valueOf(nextYear)+"'"; 
		List<PlanMaster> list = this.planMasterDAO.findWhereOrderBy("com.sgepit.pmis.planMgm.hbm.PlanMaster", 
				"unit_id = '"+unitId+"' and business_type = '"+businessType+"' and conid = '"+conId+"' and substr(sj_type,1,4) in("+yearInStr+")", "sj_type asc");
		String exsitSjType = "";
		for (int i =0;i<list.size();i++){
			exsitSjType = exsitSjType + "," + list.get(i).getSjType();
		}
		if(list.size()>0){
			exsitSjType = exsitSjType.substring(1);
		}
		
		//年计划
		if(businessType.indexOf("P_Y")>-1){
			for(int i= lastYear;i<=nextYear;i++){
				String sjType = String.valueOf(i);
				String sjTypeDes = String.valueOf(i)+"年";
				if(exsitSjType.indexOf(sjType)==-1){
					jsonStr = jsonStr + ",['"+sjType+"','"+sjTypeDes+"']";
				}
			}
		}		
		//月度计划
		if(businessType.indexOf("P_M")>-1){
			for(int i= lastYear;i<=nextYear;i++){
				for(int j=1;j<=12;j++){
					String sjType = String.valueOf(i)+(j<10?"0"+String.valueOf(j):String.valueOf(j));
					String sjTypeDes = String.valueOf(i)+"年" + String.valueOf(j)+"月";
					if(exsitSjType.indexOf(sjType)==-1){
						jsonStr = jsonStr + ",['"+sjType+"','"+sjTypeDes+"']";
					}
				}
			}
		}
		//季度计划
		if(businessType.indexOf("P_Q")>-1){
			for(int i= lastYear;i<=nextYear;i++){
				for(int j=1;j<=4;j++){
					String sjType = String.valueOf(i)+String.valueOf(j);
					String sjTypeDes = String.valueOf(i)+"年" + String.valueOf(j)+"季度";
					if(exsitSjType.indexOf(sjType)==-1){
						jsonStr = jsonStr + ",['"+sjType+"','"+sjTypeDes+"']";
					}
				}
			}
		}
		if(jsonStr.length()>0){
			jsonStr = "[" + jsonStr.substring(1)+"]";
		}else{
			jsonStr = "[]";
		}
		return jsonStr;		
	}
	/************************   初始化数据的相关方法 begin ***************************************************************/
	/**
	 * 工程量投资计划初始化
	 */
	public boolean initQuantitiesPlanData(String masterId){
		boolean returnValue = false;
		try{
			PlanMaster master = this.getPlanMasterInfoById(masterId);
			if(master != null){
				initInvestmentPlan_Quantities(master);
				returnValue = true;
			}
			return returnValue;
		}catch(Exception ex){
			return returnValue;
		}
	}
	/**
	 * 根据主表ID生成工程量投资计划
	 * @param masterId
	 */
	private void initInvestmentPlan_Quantities(PlanMaster master) {		
		if (master.getSjType().length()==4) {
			initInvestmentPlanYear_Quantities(master.getUnitId(), master.getSjType(), master.getUids());
		} else if (master.getSjType().length()==5) {
			initInvestmentPlanQuarter_Quantities(master.getUnitId(), master.getSjType(), master.getUids());
		} else if (master.getSjType().length()==6) {
			initInvestmentPlanMonth_Quantities(master.getUnitId(), master.getSjType(), master.getUids());
		}
		
//		计算累计：
		calCollectData(master.getBusinessType(), master.getConid(), master.getSjType());
	}
	/**
	 * 初始化投资计划的数据；
	 * 根据businessType做不同的处理； 根据sjType的位数判断初始化的类型；
	 * @param businessType
	 * @param unitId
	 * @param sj_type
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-12
	 */
	public boolean initInvestmentPlanData(String businessType, String unitId, String sj_type){
		PlanMaster master = this.getPlanMasterInfo(businessType, unitId, sj_type);
		if (master!=null) {
			//年度计划
			if (sj_type!=null && sj_type.length()==4) {
				//工程量投资计划年度计划
				if (businessType.equalsIgnoreCase(PlanMgmConstant.QUANTITIES_PLAN_YEAR)) {
					initInvestmentPlanYear_Quantities(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR)) {
//					建安工程投资计划
					initInvestmentPlanYear_Install(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.OtherCost_PLAN_YEAR)) {
//					部门其他费用投资计划
					initInvestmentPlanYear_OtherCost(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.EQUIPMENT_PLAN_YEAR)) {
//					设备购置费投资计划
					initInvestmentPlanYear_Equipment(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.INSTALL_FUND_PLAN_YEAR)) {
//					建安工程资金计划
					initFundPlanYear_Install(unitId, sj_type, master.getUids());
				}
			} else if (sj_type!=null && sj_type.length()==5) {
				//工作量投资计划年度计划
				if (businessType.equalsIgnoreCase(PlanMgmConstant.QUANTITIES_PLAN_QUARTER)) {
					initInvestmentPlanQuarter_Quantities(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.INSTALL_INVEST_PLAN_QUARTER)) {
					initInvestmentPlanQuarter_Install_FromY(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.OtherCost_PLAN_QUARTER)) {
					initInvestmentPlanQuarter_OtherCost(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.EQUIPMENT_PLAN_QUARTER)) {
					initInvestmentPlanQuarter_Equipment(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.INSTALL_FUND_PLAN_QUARTER)) {
					initFundPlanQuarter_Install(unitId, sj_type, master.getUids());
				}
			} else if (sj_type!=null && sj_type.length()==6) {
				if (businessType.equalsIgnoreCase(PlanMgmConstant.QUANTITIES_PLAN_MONTH)) {
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.INSTALL_INVEST_PLAN_MONTH)) {
					initInvestmentPlanMonth_Install_FromQ(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.OtherCost_PLAN_MONTH)) {
					initInvestmentPlanMonth_OtherCost(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.EQUIPMENT_PLAN_MONTH)) {
					initInvestmentPlanMonth_Equipment(unitId, sj_type, master.getUids());
				} else if (businessType.equalsIgnoreCase(PlanMgmConstant.INSTALL_FUND_PLAN_MONTH)) {
					initFundPlanMonth_Install(unitId, sj_type, master.getUids());
				}
			}
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 插入多条主记录时，对多条主记录的计划数据初始化；
	 * @param businessType
	 * @param unitId
	 * @param sjTypes
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-19
	 */
	public boolean initInvestmentPlanDatas(String businessType, String unitId, String sjTypes){
		String[] sjTypeArr = sjTypes.split("`");
		for (int i = 0; i < sjTypeArr.length; i++) {
			this.initInvestmentPlanData(businessType, unitId, sjTypeArr[i]);
		}
		return true;
	}

	/**
	 * 初始化工作量投资计划的年度计划数据： plan_year表
	 * 年度计划没有参考数据，直接录入，但是需要根据单位签订的合同关联的工作量来填报；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @author: Ivy
	 * @createDate: 2010-12-12
	 */
	private void initInvestmentPlanYear_Quantities(String unitId, String sjType, String masterId) {
		PlanMaster master = this.getPlanMasterInfoById(masterId);
//		(1)删除已经存在的数据；
		String deleteSql = "delete from plan_year where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.QUANTITIES_PLAN_YEAR + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		(2)初始化工程量投资计划数据；
		String insertSql = "insert into plan_year (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, QUANTITIES_ID, BDG_ID, CONTRACT_ID, UNIT_ID, PID) " +
			" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.QUANTITIES_PLAN_YEAR + "', p.proappid, p.bdgid, p.conid," +
				" '" + unitId + "', '" + master.getPid() + "' " + "from bdg_project p where conid = '" + master.getConid() + "'";	
		JdbcUtil.execute(insertSql);
	}
	
	/**
	 * 初始化工作量投资计划的季度度计划数据： plan_quarter表
	 * 季度计划参考年度计划本季度的数据；
	 * @param unitId
	 * @param sjType  季度时间
	 * @param masterId
	 * @author: Ivy
	 * @createDate: 2010-12-12
	 */
	private void initInvestmentPlanQuarter_Quantities(String unitId, String sjType, String masterId) {
		int q = Integer.parseInt(sjType.substring(4,5));
		String fromColumns = "";
		switch (q) {
		case 1:
			fromColumns = ", m01, m02, m03";
			break;
		case 2:
			fromColumns = ", m04, m05, m06";
			break;
		case 3:
			fromColumns = ", m07, m08, m09";
			break;
		case 4:
			fromColumns = ", m10, m11, m12";
			break;
			
		default:
			break;
		}
		
//		(1)删除已经存在的数据；
		String deleteSql = "delete from plan_quarter where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.QUANTITIES_PLAN_QUARTER + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		(2)从年度计划的来的初始化数据
		String insertSql = "insert into plan_quarter (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, BDG_ID, QUANTITIES_ID, UNIT_ID, PID" +
				" ,m1, m2, m3) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.QUANTITIES_PLAN_QUARTER + "', contract_id, bdg_id, quantities_id, unit_id, PID" +
				fromColumns + " from plan_year " +
				" where business_Type = '" + PlanMgmConstant.QUANTITIES_PLAN_YEAR + "' and sj_type='" + sjType.substring(0, 4) + "' and unit_id ='" + unitId + "' and quantities_id is not null ";
		JdbcUtil.execute(insertSql);
	}
	
	/**
	 * 初始化工程量投资计划数据
	 * 初始化数据来源于季度数据；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @author: Ivy
	 * @createDate: 2011-3-23
	 */
	private void initInvestmentPlanMonth_Quantities(String unitId, String sjType, String masterId){
		int m = Integer.parseInt(sjType.substring(4,6));
		int q = (m-1)/3+1;
		int md = m%3;
		String quarter = sjType.substring(0,4) + String.valueOf(q);
		String fromColumn = ", m" + String.valueOf(md==0 ? 3 : md);
		
//		(1)删除已经存在的数据；
		String deleteSql = "delete from plan_month where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.QUANTITIES_PLAN_MONTH + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		(2)从季度计划的来的初始化数据
		String insertSql = "insert into plan_month (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, BDG_ID, QUANTITIES_ID, UNIT_ID, PID" +
				" , MONTH_QUANTITIES) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.QUANTITIES_PLAN_MONTH + "', contract_id, bdg_id, quantities_id, unit_id, PID" +
				fromColumn + " from plan_quarter " +
				" where business_Type = '" + PlanMgmConstant.QUANTITIES_PLAN_QUARTER + "' and sj_type='" + quarter + "' and unit_id ='" + unitId + "' and quantities_id is not null ";
		JdbcUtil.execute(insertSql);
	}
	
	/**
	 * 建安工程投资计划年度计划
	 * 初始化数据取： 取工程量投资计划中，年度计划的合同的合计数据
	 * 如果工程量投资计划中有相应合同的投资计划数据，则取工程量投资计划的数据作为初始数据，否则按照建安的合同来初始化数据
	 * （1）删除已存在的年度计划数据；
	 * （2）先根据工程量的投资计划数据作为建筑安装工程的初始化数据；
	 * ----（3）如果工程量年计划中没有相关的数据，直接根据建筑安装的合同来初始化；[03][01]
	 * （4）计算累计值： 所有年度计划的数据金额的累计；累计% = 累计/合同分摊总额；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @author: Ivy
	 * @createDate: 2010-12-13
	 */
	public void initInvestmentPlanYear_Install(String unitId, String sjType, String masterId) {
		PlanMaster master = this.getPlanMasterInfoById(masterId);
//		(1)删除已经存在的数据；
		String deleteSql = "delete from plan_year where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
		//从属性代码中查询出工程类合同
		String gcSql = "select c.property_code,c.property_name from property_code c " +
						"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
						"and c.detail_type like '%GC%'";
		String contFilterId = "";
		List<Map<String, String>> list = JdbcUtil.query(gcSql);
		for(int i = 0; i < list.size(); i++) {
			contFilterId+="'"+list.get(i).get("property_code")+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length()-1);
		
//		(2)从工程量年度计划得来的初始化数据
		String selectContractSql = " select conid from con_ove where condivno in ("+contFilterId+") and pid = '" + master.getPid() + "'";
		String insertSql = "insert into plan_year (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, pid" +
			" ,m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, year_amount) " +
			" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR + "', p.contract_id, '" + unitId + "', " + master.getPid() +
			" ,p.m01, p.m02, p.m03, p.m04, p.m05, p.m06, p.m07, p.m08, p.m09, p.m10, p.m11, p.m12, p.year_amount from plan_year p " +
			" where p.contract_id in (" + selectContractSql + ") and p.business_Type = '" + PlanMgmConstant.QUANTITIES_PLAN_YEAR + "' and p.sj_type='" + sjType + "' and p.quantities_id is null";
		JdbcUtil.execute(insertSql);
		
//		(3)如果没有工程量的年度计划数据，根据建筑安装工程的合同初始化数据；
		String selectContractSql1 = " select conid from con_ove where condivno in ("+contFilterId+") " +
				" and conid not in " +
				" (select distinct contract_id from plan_year where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR + "' and unit_id ='" + unitId + "')" +
				" and pid='" + master.getPid() + "'";
		String insertSql1 = "insert into plan_year (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, pid" +
				" ) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR + "', p.conid, '" + unitId + "', " + master.getPid() +
				" from con_ove p " +
				" where p.conid in (" + selectContractSql1 + ")";
		JdbcUtil.execute(insertSql1);
		
//		(4)计算累计值和累计%
		calCollectData(PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR, unitId, sjType);
	}
	
	/**
	 * 初始化部门其他费用的年计划数据： 根据概算项目中的其他费用（010401）的细项填写
	 * (1)删除已存在的数据
	 * (2)初始化数据；
	 * (3)计算累计值：该概算项目年度计划金额的所有值的合计； 累计% = 累计/概算项目的总金额；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public boolean initInvestmentPlanYear_OtherCost(String unitId, String sjType, String masterId) {
		PlanMaster master = this.getPlanMasterInfoById(masterId);
//		(1)删除已经存在的数据；
		String deleteSql = "delete from plan_year where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.OtherCost_PLAN_YEAR + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		(2)初始化数据
		//初始化plan_othercost_item表中的数据；
		String initItemSql = "merge into plan_othercost_item i using (select bdgid, pid, bdgname, parent from bdg_info where pid='" + master.getPid() + "') b" +
				" on (b.bdgid = i.item_id and b.pid = i.pid)" +
				" when not matched then" +
				" insert (item_id, parent_id, item_name, pid) values (b.bdgid, b.parent, b.bdgname, b.pid)";
		JdbcUtil.execute(initItemSql);
		
		String selectBdgSql = " select item_id from plan_othercost_item t where pid = '" + master.getPid() + "' start with item_id = '" + rootBdgId + "' connect by prior item_id = parent_id " ;
		String insertSql = "insert into plan_year (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, BDG_ID, UNIT_ID, PID" +
				" ) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.OtherCost_PLAN_YEAR + "', p.item_id, '" + unitId + "', pid" +
				" from plan_othercost_item p " +
				" where p.item_id in (" + selectBdgSql + ")";
		JdbcUtil.execute(insertSql);
		
//		(3)计算累计
		calCollectData(PlanMgmConstant.OtherCost_PLAN_YEAR, unitId, sjType);
		return true;
	}
	
	/**
	 * 设备购置费投资计划 - 年度 【设备合同中获取相关信息】[02]
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public boolean initInvestmentPlanYear_Equipment(String unitId, String sjType, String masterId) {
		PlanMaster master = this.getPlanMasterInfoById(masterId);
//		(1)删除已经存在的数据；
		String deleteSql = "delete from plan_year where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.EQUIPMENT_PLAN_YEAR + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		(2)初始化数据
		//从属性代码中查询出设备类合同
		String sbSql = "select c.property_code,c.property_name from property_code c " +
						"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
						"and c.detail_type like '%SB%'";
		String contFilterId = "";
		List<Map<String, String>> list = JdbcUtil.query(sbSql);
		for(int i = 0; i < list.size(); i++) {
			contFilterId+="'"+list.get(i).get("property_code")+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length()-1);
		
		String selectContractSql = " select conid from con_ove where condivno in ("+contFilterId+") and pid ='" + master.getPid() + "' ";
		String insertSql = "insert into plan_year (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, PID" +
				" ) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.EQUIPMENT_PLAN_YEAR + "', p.conid, '" + unitId + "', p.pid" +
				" from con_ove p " +
				" where p.conid in (" + selectContractSql + ")";
		JdbcUtil.execute(insertSql);
		
//		(3)计算累计：
		calCollectData(PlanMgmConstant.EQUIPMENT_PLAN_YEAR, unitId, sjType);
		return true;
	}
	
	/**
	 * 初始化建筑安装资金计划 - 年度 根据建筑安装的合同生成记录；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-17
	 */
	private boolean initFundPlanYear_Install(String unitId, String sjType, String masterId){
		PlanMaster master = this.getPlanMasterInfoById(masterId);
		
//		(1)删除已经存在的数据；
		String deleteSql = "delete from plan_year where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.INSTALL_FUND_PLAN_YEAR + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
//		(2)根据建筑安装工程的年度投资计划的数据；
		String insertSql = "insert into plan_year (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, PID" +
			" ,m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, YEAR_AMOUNT) " +
			" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.INSTALL_FUND_PLAN_YEAR + "', p.contract_id, '" + unitId + "', pid" +
			" ,p.m01, p.m02, p.m03, p.m04, p.m05, p.m06, p.m07, p.m08, p.m09, p.m10, p.m11, p.m12, p.YEAR_AMOUNT from plan_year p " +
			" where p.business_Type = '" + PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR + "' and p.sj_type='" + sjType + "'" +
			" and pid='" + master.getPid() + "'";
		JdbcUtil.execute(insertSql);
		
//		(3)计算累计值和累计%
		calCollectData(PlanMgmConstant.INSTALL_FUND_PLAN_YEAR, unitId, sjType);
		return true;
	}
	
	/**
	 * 初始化建筑安装投资计划的季度数据：从年度计划中获取；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @author: Ivy
	 * @createDate: 2010-12-15
	 */
	private void initInvestmentPlanQuarter_Install_FromY(String unitId, String sjType, String masterId){
		int q = Integer.parseInt(sjType.substring(4,5));
		String fromColumns = "";
		switch (q) {
		case 1:
			fromColumns = ", m01, m02, m03";
			break;
		case 2:
			fromColumns = ", m04, m05, m06";
			break;
		case 3:
			fromColumns = ", m07, m08, m09";
			break;
		case 4:
			fromColumns = ", m10, m11, m12";
			break;
			
		default:
			break;
		}
		
//		(1)删除已经存在的数据；
		String deleteSql = "delete from plan_quarter where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.INSTALL_INVEST_PLAN_QUARTER + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		(2)从年度计划的来的初始化数据
		String insertSql = "insert into plan_quarter (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, BDG_ID, UNIT_ID, pid" +
				" ,m1, m2, m3) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.INSTALL_INVEST_PLAN_QUARTER + "', contract_id, bdg_id, unit_id, pid" +
				fromColumns + " from plan_year " +
				" where business_Type = '" + PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR + "' and sj_type='" + sjType.substring(0, 4) + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(insertSql);
		/*		
//		(3)如果没有建筑安装的年度计划数据，根据建筑安装工程的合同初始化数据；
		String selectContractSql1 = " select conid from con_ove where condivno in ('03') and sort in ('01') " +
				" and conid not in " +
				" (select distinct contract_id from plan_quarter where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.INSTALL_INVEST_PLAN_QUARTER + "' and unit_id ='" + unitId + "')";
		String insertSql1 = "insert into plan_quarter (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID" +
				" ) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.INSTALL_INVEST_PLAN_QUARTER + "', p.conid, '" + unitId + "'" +
				" from con_ove p " +
				" where p.conid in (" + selectContractSql1 + ")";
		JdbcUtil.execute(insertSql1);
		*/
//		(4)计算累计值和累计%
		calCollectData(PlanMgmConstant.INSTALL_INVEST_PLAN_QUARTER, unitId, sjType);
	}
	
	/**
	 * 初始化部门其他费用的季度投资计划数据：从年度计划中获取；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	private boolean initInvestmentPlanQuarter_OtherCost(String unitId, String sjType, String masterId){
		int q = Integer.parseInt(sjType.substring(4,5));
		String fromColumns = "";
		switch (q) {
		case 1:
			fromColumns = ", m01, m02, m03";
			break;
		case 2:
			fromColumns = ", m04, m05, m06";
			break;
		case 3:
			fromColumns = ", m07, m08, m09";
			break;
		case 4:
			fromColumns = ", m10, m11, m12";
			break;
			
		default:
			break;
		}
		
//		(1)删除数据；
		String deleteSql = "delete from plan_quarter where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.OtherCost_PLAN_QUARTER + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		（2）从年度计划的来的初始化数据
		String insertSql = "insert into plan_quarter (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, BDG_ID, UNIT_ID, pid" +
				" ,m1, m2, m3) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.OtherCost_PLAN_QUARTER + "', bdg_id, '" + unitId + "', pid" +
				fromColumns + " from plan_year " +
				" where business_Type = '" + PlanMgmConstant.OtherCost_PLAN_YEAR + "' and sj_type='" + sjType.substring(0, 4) + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(insertSql);
		
//		(4)计算累计
		calCollectData(PlanMgmConstant.OtherCost_PLAN_QUARTER, unitId, sjType);
		return true;
	}
	
	/**
	 * 设备购置费 投资计划 -- 季度；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public boolean initInvestmentPlanQuarter_Equipment(String unitId, String sjType, String masterId){
		int q = Integer.parseInt(sjType.substring(4,5));
		String fromColumns = "";
		switch (q) {
		case 1:
			fromColumns = ", m01, m02, m03";
			break;
		case 2:
			fromColumns = ", m04, m05, m06";
			break;
		case 3:
			fromColumns = ", m07, m08, m09";
			break;
		case 4:
			fromColumns = ", m10, m11, m12";
			break;
			
		default:
			break;
		}
		
//		(1)删除数据；
		String deleteSql = "delete from plan_quarter where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.EQUIPMENT_PLAN_QUARTER + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		(2)从年度计划的来的初始化数据
		String insertSql = "insert into plan_quarter (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, pid" +
				" ,m1, m2, m3) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.EQUIPMENT_PLAN_QUARTER + "', contract_id, '" + unitId + "', pid" +
				fromColumns + " from plan_year " +
				" where business_Type = '" + PlanMgmConstant.EQUIPMENT_PLAN_YEAR + "' and sj_type='" + sjType.substring(0, 4) + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(insertSql);
		
		//从属性代码中查询出设备类合同
		String sbSql = "select c.property_code,c.property_name from property_code c " +
						"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
						"and c.detail_type like '%SB%'";
		String contFilterId = "";
		List<Map<String, String>> list = JdbcUtil.query(sbSql);
		for(int i = 0; i < list.size(); i++) {
			contFilterId+="'"+list.get(i).get("property_code")+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length()-1);
		
//		(2)如果没有年度计划，按照设备合同初始化数据
		String selectContractSql = " select conid from con_ove where condivno in ("+contFilterId+")  and conid not in (" +
				" select distinct contract_id from plan_quarter where sj_type = '" + sjType + "' and business_type ='" + PlanMgmConstant.EQUIPMENT_PLAN_QUARTER + "' and unit_id ='" + unitId + "' ) ";
		String insertSql1 = "insert into plan_quarter(UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, pid" +
				" ) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.EQUIPMENT_PLAN_QUARTER + "', p.conid, '" + unitId + "', pid" +
				" from con_ove p " +
				" where p.conid in (" + selectContractSql + ")";
		JdbcUtil.execute(insertSql1);
		
//		(3)计算累计：
		calCollectData(PlanMgmConstant.EQUIPMENT_PLAN_QUARTER, unitId, sjType);
		return true;
	}
	
	/**
	 * 建筑安装资金计划 -- 季度；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public boolean initFundPlanQuarter_Install(String unitId, String sjType, String masterId){
		int q = Integer.parseInt(sjType.substring(4,5));
		String fromColumns = "";
		switch (q) {
		case 1:
			fromColumns = ", m01, m02, m03";
			break;
		case 2:
			fromColumns = ", m04, m05, m06";
			break;
		case 3:
			fromColumns = ", m07, m08, m09";
			break;
		case 4:
			fromColumns = ", m10, m11, m12";
			break;
			
		default:
			break;
		}
		
//		(1)删除数据；
		String deleteSql = "delete from plan_quarter where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.INSTALL_FUND_PLAN_QUARTER + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		(2)从年度计划的来的初始化数据
		String insertSql = "insert into plan_quarter (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, pid" +
				" ,m1, m2, m3) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.INSTALL_FUND_PLAN_QUARTER + "', contract_id, '" + unitId + "', pid" +
				fromColumns + " from plan_year " +
				" where business_Type = '" + PlanMgmConstant.INSTALL_FUND_PLAN_YEAR + "' and sj_type='" + sjType.substring(0, 4) + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(insertSql);

		//		(4)计算累计：
		calCollectData(PlanMgmConstant.INSTALL_FUND_PLAN_QUARTER, unitId, sjType);
		return true;
	}
	
	/**
	 * 初始化建筑安装投资计划的月度数据：从季度计划中获取；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @author: Ivy
	 * @createDate: 2010-12-19
	 */
	private void initInvestmentPlanMonth_Install_FromQ(String unitId, String sjType, String masterId){
		int m = Integer.parseInt(sjType.substring(4,6));
		int q = (m-1)/3+1;
		int md = m%3;
		String quarter = sjType.substring(0,4) + String.valueOf(q);
		String fromColumn = ", m" + String.valueOf(md==0 ? 3 : md);
		
//		(1)删除已经存在的数据；
		String deleteSql = "delete from plan_month where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.INSTALL_INVEST_PLAN_MONTH + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		(2)从季度计划的来的初始化数据
		String insertSql = "insert into plan_month (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, pid" +
				" , month_amount) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.INSTALL_INVEST_PLAN_MONTH + "', contract_id, unit_id, pid" +
				fromColumn + " from plan_quarter " +
				" where business_Type = '" + PlanMgmConstant.INSTALL_INVEST_PLAN_QUARTER + "' and sj_type='" + quarter + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(insertSql);

		//		(4)计算累计值和累计%
		updateDataAddup(PlanMgmConstant.INSTALL_INVEST_PLAN_MONTH, unitId, sjType);
	}
	
	/**
	 * 初始化部门其他费用月度投资计划的信息； 从季度数据中获取
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	private boolean initInvestmentPlanMonth_OtherCost(String unitId, String sjType, String masterId){
		int m = Integer.parseInt(sjType.substring(4,6));
		int q = (m-1)/3+1;
		int md = m%3;
		String quarter = sjType.substring(0,4) + String.valueOf(q);
		String fromColumn = ",m" + String.valueOf(md==0 ? 3 : md);
		
//		(1)删除数据
		String deleteSql = "delete from plan_month where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.OtherCost_PLAN_MONTH + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		（2）初始化数据，从季度计划的来的初始化数据
		String insertSql = "insert into plan_month (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, BDG_ID, UNIT_ID, pid" +
			" ,month_amount) " +
			" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.OtherCost_PLAN_MONTH + "', bdg_id, unit_id, pid" +
			fromColumn + " from plan_quarter " +
			" where business_Type = '" + PlanMgmConstant.OtherCost_PLAN_QUARTER + "' and sj_type='" + quarter + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(insertSql);
		
//		(4)计算累计
		updateDataAddup(PlanMgmConstant.OtherCost_PLAN_MONTH, unitId, sjType);
		
		return true;
	}
	
	/**
	 * 设备购置费投资计划 -- 月度；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public boolean initInvestmentPlanMonth_Equipment(String unitId, String sjType, String masterId){
		int m = Integer.parseInt(sjType.substring(4,6));
		int q = (m-1)/3+1;
		int md = m%3;
		String quarter = sjType.substring(0,4) + String.valueOf(q);
		String fromColumn = ", m" + String.valueOf(md==0 ? 3 : md);
		
//		(1)删除数据
		String deleteSql = "delete from plan_month where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.EQUIPMENT_PLAN_MONTH + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		（2）初始化数据：从季度计划的来的初始化数据
		String insertSql = "insert into plan_month (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, pid" +
				" ,month_amount) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.EQUIPMENT_PLAN_MONTH + "', contract_id, unit_id, pid" +
				fromColumn + " from plan_quarter " +
				" where business_Type = '" + PlanMgmConstant.EQUIPMENT_PLAN_QUARTER + "' and sj_type='" + quarter + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(insertSql);
		
//		(3)如果没有季度计划，按照设备合同初始化数据
		//从属性代码中查询出设备类合同
		String sbSql = "select c.property_code,c.property_name from property_code c " +
						"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
						"and c.detail_type like '%SB%'";
		String contFilterId = "";
		List<Map<String, String>> list = JdbcUtil.query(sbSql);
		for(int i = 0; i < list.size(); i++) {
			contFilterId+="'"+list.get(i).get("property_code")+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length()-1);
		
		String selectContractSql = " select conid from con_ove where condivno in ("+contFilterId+")  and conid not in (" +
				" select distinct contract_id from plan_month where sj_type = '" + sjType + "' and business_type ='" + PlanMgmConstant.EQUIPMENT_PLAN_MONTH + "' and unit_id ='" + unitId + "' ) ";
		String insertSql1 = "insert into plan_month(UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, pid" +
				" ) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.EQUIPMENT_PLAN_MONTH + "', p.conid, '" + unitId + "', p.pid" +
				" from con_ove p " +
				" where p.conid in (" + selectContractSql + ")";
		JdbcUtil.execute(insertSql1);
		
//		(4)计算累计
		updateDataAddup(PlanMgmConstant.EQUIPMENT_PLAN_MONTH, unitId, sjType);
		
		return true;
	}
	
	/**
	 * 建筑安装资金计划 -- 月度； 初始化数据取工程量投资完成的数据；
	 * 月度初始化数据获取 : 本月的资金计划 取 上月的工作量投资完成作为本月的资金计划；
	 * @param unitId
	 * @param sjType
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public boolean initFundPlanMonth_Install(String unitId, String sjType, String masterId){
		int m = Integer.parseInt(sjType.substring(4,6));
		int q = (m-1)/3+1;
		int md = m%3;
		String quarter = sjType.substring(0,4) + String.valueOf(q);
		String fromColumn = ", m" + String.valueOf(md==0 ? 3 : md);
		
//		(1)删除数据
		String deleteSql = "delete from plan_month where sj_type = '" + sjType + "' and business_Type = '" + PlanMgmConstant.INSTALL_FUND_PLAN_MONTH + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(deleteSql);
		
//		（2）初始化数据：从季度计划的来的初始化数据
		String insertSql = "insert into plan_month (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, CONTRACT_ID, UNIT_ID, pid" +
				" ,month_amount) " +
				" select SYS_MANAGER.newidbydate21(), '" + masterId + "', '" + sjType + "', '" + PlanMgmConstant.INSTALL_FUND_PLAN_MONTH + "', contract_id, unit_id, pid" +
				fromColumn + " from plan_quarter " +
				" where business_Type = '" + PlanMgmConstant.INSTALL_FUND_PLAN_QUARTER + "' and sj_type='" + quarter + "' and unit_id ='" + unitId + "'";
		JdbcUtil.execute(insertSql);

		//		(4)计算累计
		updateDataAddup(PlanMgmConstant.INSTALL_FUND_PLAN_MONTH, unitId, sjType);
		
		return true;
	}
	
	/************************   初始化数据的相关方法 end ***************************************************************/
	
	/**
	 * 获得合同的相关信息；
	 * @param whereStr
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public List<ConOve> getConOveInfo (String whereStr) {
		return planMasterDAO.findByWhere(ConOve.class.getName(), whereStr);
	}
	
	/**
	 * 删除计划主记录及其关联的明细数据信息
	 * @param sjFlag	年：Y；季度Q；月度：M；
	 * @param masterIds	主记录的主键信息；
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public boolean deleteMasterAndDetailData(String sjFlag, String masterIds){
		String delDetailSql = "";
		String masterIdInStr = StringUtil.transStrToIn(masterIds, ",");
		if (sjFlag.equalsIgnoreCase("Y")) {
			delDetailSql = "delete from PLAN_YEAR where master_id in (" + masterIdInStr + ")";
		} else if (sjFlag.equalsIgnoreCase("Q")) {
			delDetailSql = "delete from PLAN_QUARTER where master_id in (" + masterIdInStr + ")";
		} else if (sjFlag.equalsIgnoreCase("M")) {
			delDetailSql = "delete from PLAN_MONTH where master_id in (" + masterIdInStr + ")";
		}
		
		String delMasterSql = "delete from PLAN_MASTER where uids in (" + masterIdInStr + ")";
		
		if (delDetailSql!=null) {
			JdbcUtil.execute(delDetailSql);
		}
		JdbcUtil.execute(delMasterSql);
		
		return true;
	}
	
	/************************   数据合计、数据汇总、数据累计的相关方法 begin ***************************************************************/
	/**
	 * 计算计划数据的年度、季度的合计值；
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public boolean calCollectData(String businessType, String unitId, String sjType){
		String updateSql = "";
		if(businessType.indexOf("Qantities")==-1) {
			if (sjType.length()==4) {
				updateSql = "update plan_year set year_amount = nvl(m01,0) + nvl(m02,0) + nvl(m03,0) + nvl(m04,0) + nvl(m05,0) + nvl(m06,0) + nvl(m07,0) + nvl(m08,0) + nvl(m09,0) + nvl(m10,0) + nvl(m11,0) + nvl(m12,0) " +
				" where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id='" + unitId + "'";
			} else if (sjType.length()==5) {
				updateSql = "update plan_quarter set quarter_amount = nvl(m1,0)+nvl(m2,0)+nvl(m3,0) " +
				" where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id='" + unitId + "'";
			}
		} else {
			if (sjType.length()==4) {
				updateSql = "update plan_year set year_quantities = nvl(m01,0) + nvl(m02,0) + nvl(m03,0) + nvl(m04,0) + nvl(m05,0) + nvl(m06,0) + nvl(m07,0) + nvl(m08,0) + nvl(m09,0) + nvl(m10,0) + nvl(m11,0) + nvl(m12,0) " +
					" , year_amount=(nvl(m01,0) + nvl(m02,0) + nvl(m03,0) + nvl(m04,0) + nvl(m05,0) + nvl(m06,0) + nvl(m07,0) + nvl(m08,0) + nvl(m09,0) + nvl(m10,0) + nvl(m11,0) + nvl(m12,0)) * (select b.price from bdg_project b where b.proappid=quantities_id)"+
					" where business_type='" + businessType + "' and sj_type='" + sjType + "' and contract_id='" + unitId + "' and quantities_id is not null ";
			} else if (sjType.length()==5) {
				updateSql = "update plan_quarter set quarter_quantities = nvl(m1,0)+nvl(m2,0)+nvl(m3,0) " +
				", quarter_amount=( nvl(m1,0)+nvl(m2,0)+nvl(m3,0)) * (select b.price from bdg_project b where b.proappid=quantities_id)"+
				" where business_type='" + businessType + "' and sj_type='" + sjType + "' and contract_id='" + unitId + "' and quantities_id is not null ";
			} else if (sjType.length()==6) {
				updateSql = "update plan_month set month_amount= month_quantities * (select b.price from bdg_project b where b.proappid=quantities_id)"+
						" where business_type='" + businessType + "' and sj_type='" + sjType + "' and contract_id='" + unitId + "' and quantities_id is not null ";
			}
		}
		if(updateSql!=null && updateSql.length()>0){
			JdbcUtil.execute(updateSql);
		}
		
		updateDataAddup(businessType, unitId, sjType);
		return true;
	}
	
	/**
	 * 计算工程量投资计划在合同上的合计
	 * 
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-22
	 */
	public boolean collectQuantitiesAmount(String businessType, String unitId, String sjType){
		String tableName = "";
		String sumColumn =  "";
		String sumColumnForGcl = "";
		if (sjType.length()==4) {
			tableName = "plan_year";
			sumColumn = ",year_amount";
			sumColumnForGcl = ",M01,M02,M03,M04,M05,M06,M07,M08,M09,M10,M11,M12";
		} else if (sjType.length()==5) {
			tableName = "plan_quarter";
			sumColumn = ",quarter_amount";
			sumColumnForGcl = ",M1,M2,M3";
		} else if (sjType.length()==6) {
			tableName = "plan_month";
			sumColumn = ",month_amount";
		}
		
		String sumColumnForGclAmount = "";
		String gclPriceSql = "(select b.price from bdg_project b where b.proappid=t.quantities_id)";
		if (sumColumnForGcl!=null && sumColumnForGcl.length()>0) {
			String[] sumColumnForGclArr = sumColumnForGcl.substring(1).split(",");
			for (int i = 0; i < sumColumnForGclArr.length; i++) {
				sumColumnForGclAmount += ", sum(t." +  sumColumnForGclArr[i] + "*" + gclPriceSql + ")";
			}
		}
		
		String sumColumnAmount = "";
		if (sumColumn!=null && sumColumn.length()>0) {
			String[] sumColumnArr = sumColumn.substring(1).split(",");
			for (int i = 0; i < sumColumnArr.length; i++) {
				sumColumnAmount += ", sum(t." + sumColumnArr[i] + ")";
			}
		}
		
		String unitWhere = "";
		if (unitId!=null && unitId.length()>0) {
			unitWhere = " and unit_id = '" + unitId + "'";
		}
		
//		计算工程量投资计划在合同中的汇总值
		String deleteSql = "delete from " + tableName + " where quantities_id is null and business_type='" + businessType + "' and sj_type='" + sjType + "' " + unitWhere;
		JdbcUtil.execute(deleteSql);
		
		String contractCollectSql = "insert into " + tableName + "(uids, master_id, business_type, sj_type, unit_id, pid, contract_id" + sumColumnForGcl + sumColumn + ")" +
				" select sys_manager.newidbydate21(), t.master_id, '" + businessType + "', '" + sjType + "', t.unit_id, t.pid, t.contract_id" + sumColumnForGclAmount + sumColumnAmount + " from " + tableName + " t" +
				" where business_type = '" + businessType + "' and sj_type='" + sjType + "'" + unitWhere + " group by t.master_id, t.unit_id, t.pid, t.contract_id";
		JdbcUtil.execute(contractCollectSql);
		
		return true;
	}
	
	/**
	 * 计算数据的累计值和累计%
	 * @param businessType
	 * @param unitId    工程量投资计划时，该字段为contract_id
	 * @param sjType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-17
	 */
	public boolean updateDataAddup(String businessType, String unitId, String sjType){
		String updateAddupSql = "";
		String tableName = "";
		String sumColumn =  "";
		//工程量累计列
		String sumColumnForGcl = "";
//		更新累计数据
		if (sjType.length()==4) {
			tableName = "plan_year";
			sumColumn = "year_amount";
			sumColumnForGcl = "YEAR_QUANTITIES";
		} else if (sjType.length()==5) {
			tableName = "plan_quarter";
			sumColumn = "quarter_amount";
			sumColumnForGcl = "QUARTER_QUANTITIES";
		} else if (sjType.length()==6) {
			tableName = "plan_month";
			sumColumn = "month_amount";
			sumColumnForGcl = "MONTH_QUANTITIES";
		}
		if (tableName.length()>0 && sumColumn.length()>0) {
			//增加对工程量投资计划累计值计算的支持
			if(businessType.indexOf("Qantities")>-1){
				updateAddupSql = "update " + tableName + " t1 set t1.amount_addup = (" +
						" select sum(t." + sumColumn + ") from " + tableName + " t " +
						" where t.sj_type<='" + sjType + "' and t.business_type=t1.business_type and t.contract_id=t1.contract_id " +
								"and ((t.bdg_id is not null and t.bdg_id=t1.bdg_id) or t.bdg_id is null)" +
								"and ((t.quantities_id is not null and t.quantities_id=t1.quantities_id) or t.quantities_id is null)) " +
						" ,t1.QUANTITIES_ADDUP = (" +
						" select sum(t." + sumColumnForGcl + ") from " + tableName + " t " +
						" where t.sj_type<='" + sjType + "' and t.business_type=t1.business_type and t.contract_id=t1.contract_id " +
								"and ((t.bdg_id is not null and t.bdg_id=t1.bdg_id) or t.bdg_id is null)" +
								"and ((t.quantities_id is not null and t.quantities_id=t1.quantities_id) or t.quantities_id is null)) " +
						" where t1.sj_type='" + sjType + "' and t1.business_type='" + businessType + "' and t1.contract_id='" + unitId + "'";
				JdbcUtil.execute(updateAddupSql);
			}else{
				//
				updateAddupSql = "update " + tableName + " t1 set t1.amount_addup = (" +
						" select sum(t." + sumColumn + ") from " + tableName + " t " +
						" where t.sj_type<='" + sjType + "' and t.business_type=t1.business_type and t.unit_id=t1.unit_id and ((t.contract_id is not null and t.contract_id = t1.contract_id) or t.contract_id is null) and ((t.bdg_id is not null and t.bdg_id=t1.bdg_id) or t.bdg_id is null)) " +
						" where t1.sj_type='" + sjType + "' and t1.business_type='" + businessType + "' and t1.unit_id='" + unitId + "'";
				JdbcUtil.execute(updateAddupSql);
			}		
		}
		
		
		
//		更新累计% = 累计值/合同分摊金额（或概算项目金额）
		String updatePerDataSql = "";
		String baseDataSql = "";
		String baseDataSqlForGcl = "";
		if (businessType.indexOf("OtherCost")==0) {
//			其他费用的累积%计算：比概算项目金额
			baseDataSql = "(select bdgmoney from bdg_info where bdgid=t1.bdg_id)";
		} else if(businessType.indexOf("Qantities")>-1){ //工程量投资计划
			baseDataSql = "(select money from bdg_project where proappid= t1.quantities_id)";
			baseDataSqlForGcl = "(select amount from bdg_project where proappid= t1.quantities_id)";			
		}else {
//			比合同签订金额
			baseDataSql = "(select CONVALUE from CON_OVE where conid=t1.contract_id)";
		}
		if(!baseDataSqlForGcl.equals("")){
			updatePerDataSql = "update " + tableName + " t1 set t1.per_amount_addup = " +
			"decode(nvl(" + baseDataSql + ", 0 ), 0, 0, (nvl(t1.amount_addup, 0)/" + baseDataSql + ")*100)," +
					" t1.PER_QUANTITIES_ADDUP = " +
			"decode(nvl(" + baseDataSqlForGcl + ", 0 ), 0, 0, (nvl(t1.QUANTITIES_ADDUP, 0)/" + baseDataSql + ")*100)" +
			" where t1.sj_type='" + sjType + "' and t1.business_type='" + businessType + "' and t1.unit_id='" + unitId + "'";	
		}else{
			updatePerDataSql = "update " + tableName + " t1 set t1.per_amount_addup = " +
			"decode(nvl(" + baseDataSql + ", 0 ), 0, 0, (nvl(t1.amount_addup, 0)/" + baseDataSql + ")*100)" +
			" where t1.sj_type='" + sjType + "' and t1.business_type='" + businessType + "' and t1.unit_id='" + unitId + "'";
		}
		JdbcUtil.execute(updatePerDataSql);
		
		return true;
	}
	
	/**
	 * 根据合同ID和所选择的分摊的概算ID，获取包括该概算ID下的所有子节点
	 * @param conId
	 * @param bdgId
	 * @return
	 */
	public String getFullBdgPath(String conId,String bdgId){
		String bdgIds = "";
		String sortSql = "select bdgid from  (select * from  bdg_money_app t  where conid = '"+conId+"' ) start WITH bdgid = '"+bdgId+"' connect by PRIOR bdgid = parent";
		List<Map> list = JdbcUtil.query(sortSql);
		for(int i=0;i<list.size();i++){
			bdgIds += "," + list.get(i).get("bdgid").toString();
		}
		if(list.size()>0){
			bdgIds = bdgIds.substring(1);
		}
		return StringUtil.transStrToIn(bdgIds, ",");
	}
	
	/**
	 * 投资计划、资金计划的数据汇总
	 * @param collectToUnitId
	 * @param businessType
	 * @param sjType
	 * @param state
	 * @param pid
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-20
	 */
	public boolean calCollectToUnit(String collectToUnitId, String businessType, String sjType, String state, String pid){
		String businessType1 = "";
		String businessType2 = "";
		String businessType3 = "";
		String businessType4 = "";
		String tempTableName = "";
		
		String tempBusinessType = "";
		String tempBusinessType1 = "";
		
		if (businessType.indexOf("Install_I")==0
				|| businessType.indexOf("Install_F")==0
				|| businessType.indexOf("OtherCost")==0
				|| businessType.indexOf("Equipment")==0) {
			if (sjType.length()==4) {
				businessType1 = PlanMgmConstant.INSTALL_INVEST_PLAN_YEAR;
				businessType2 = PlanMgmConstant.OtherCost_PLAN_YEAR;
				businessType3 = PlanMgmConstant.EQUIPMENT_PLAN_YEAR;
				businessType4 = PlanMgmConstant.INSTALL_FUND_PLAN_YEAR;
				tempTableName = "PLAN_YEAR";
				
				tempBusinessType = PlanMgmConstant.INVEST_PLAN_YEAR;
				tempBusinessType1 = PlanMgmConstant.FUND_PLAN_YEAR;
			} else if (sjType.length()==5) {
				businessType1 = PlanMgmConstant.INSTALL_INVEST_PLAN_QUARTER;
				businessType2 = PlanMgmConstant.OtherCost_PLAN_QUARTER;
				businessType3 = PlanMgmConstant.EQUIPMENT_PLAN_QUARTER;
				businessType4 = PlanMgmConstant.INSTALL_FUND_PLAN_QUARTER;
				tempTableName = "PLAN_QUARTER";
				
				tempBusinessType = PlanMgmConstant.INVEST_PLAN_QUARTER;
				tempBusinessType1 = PlanMgmConstant.FUND_PLAN_QUARTER;
			} else if (sjType.length()==6) {
				businessType1 = PlanMgmConstant.INSTALL_INVEST_PLAN_MONTH;
				businessType2 = PlanMgmConstant.OtherCost_PLAN_MONTH;
				businessType3 = PlanMgmConstant.EQUIPMENT_PLAN_MONTH;
				businessType4 = PlanMgmConstant.INSTALL_FUND_PLAN_MONTH;
				tempTableName = "PLAN_MONTH";
				
				tempBusinessType = PlanMgmConstant.INVEST_PLAN_MONTH;
				tempBusinessType1 = PlanMgmConstant.FUND_PLAN_MONTH;
			}
		}
		
		String stateWhere = "";
		if (state!=null && state.length()>0) {
			String stateInStr = StringUtil.transStrToIn(state, "`");
			stateWhere = " and master_id in (select uids from plan_master where state in (" + stateInStr + ") and business_type='" + businessType + "' and sj_type='" + sjType + "' and pid='" + pid + "')";
		}
		
//		详细项目投资计划
		PlanMaster master0 = this.getPlanMasterInfo(businessType, collectToUnitId, sjType);
		if (master0==null) {
			master0 = new PlanMaster();
			master0.setUnitId(collectToUnitId);
			master0.setSjType(sjType);
			master0.setBusinessType(businessType);
			master0.setPid(pid);
			master0.setUids(this.planMasterDAO.insert(master0));
		}
		
//		投资计划
		PlanMaster master = this.getPlanMasterInfo(tempBusinessType, collectToUnitId, sjType);
		if (master==null) {
			master = new PlanMaster();
			master.setUnitId(collectToUnitId);
			master.setSjType(sjType);
			master.setBusinessType(tempBusinessType);
			master.setPid(pid);
			master.setUids(this.planMasterDAO.insert(master));
		}
		
//		资金计划
		PlanMaster master1 = this.getPlanMasterInfo(tempBusinessType1, collectToUnitId, sjType);
		if (master1==null) {
			master1 = new PlanMaster();
			master1.setUnitId(collectToUnitId);
			master1.setSjType(sjType);
			master1.setBusinessType(tempBusinessType1);
			master1.setPid(pid);
			master1.setUids(this.planMasterDAO.insert(master1));
		}
			
		if (sjType.length()==4) {
			String deleteSql = "delete from plan_year where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id='" + collectToUnitId + "' and pid='" + pid + "'";
			JdbcUtil.execute(deleteSql);
			
//			计算公司的汇总数据
			String collectSql0 = "insert into plan_year (UIDS, MASTER_ID, quantities_id, bdg_id, contract_id, SJ_TYPE, BUSINESS_TYPE,UNIT_ID, pid, M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, YEAR_AMOUNT, AMOUNT_ADDUP)" +
					"select sys_manager.newidbydate21(), '" + master0.getUids() + "', quantities_id, bdg_id, contract_id, '" + sjType + "', '" + businessType + "', '" + collectToUnitId + "', pid, sum(m01), sum(m02), sum(M03), sum(M04), sum(M05), sum(M06), sum(M07), sum(M08), sum(M09), sum(M10), sum(M11), sum(M12), sum(YEAR_AMOUNT), sum(AMOUNT_ADDUP)" +
					"from plan_year where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id <> '" + collectToUnitId + "'" + stateWhere;
			collectSql0 += " group by quantities_id, bdg_id, contract_id, pid";
			JdbcUtil.execute(collectSql0);
//			计算公司汇总数据的累计%
			this.updateDataAddup(businessType, collectToUnitId, sjType);
			
//			除了建筑安装投资计划，其他的都列为资金计划
			if (businessType.indexOf("Install_I")==-1) {
				String collectSql = "insert into plan_year (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE,UNIT_ID, pid, M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, YEAR_AMOUNT, AMOUNT_ADDUP)" +
						"select sys_manager.newidbydate21(), '" + master1.getUids() + "', '" + sjType + "', '" + businessType + "', '" + collectToUnitId + "', '" + master1.getPid() + "', sum(m01), sum(m02), sum(M03), sum(M04), sum(M05), sum(M06), sum(M07), sum(M08), sum(M09), sum(M10), sum(M11), sum(M12), sum(YEAR_AMOUNT), sum(AMOUNT_ADDUP)" +
						"from plan_year where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id <> '" + collectToUnitId + "'" + stateWhere;
				if (businessType.indexOf("OtherCost")==0) {
					collectSql += " and bdg_id='" + rootBdgId + "'";
				}
				JdbcUtil.execute(collectSql);
			}
//			除了建筑安装资金计划，其他的都列为投资计划
			if (businessType.indexOf("Install_F")==-1) {
				String collectSql = "insert into plan_year (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE,UNIT_ID, pid, M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, YEAR_AMOUNT, AMOUNT_ADDUP)" +
						"select sys_manager.newidbydate21(), '" + master.getUids() + "', '" + sjType + "', '" + businessType + "', '" + collectToUnitId + "', '" + master.getPid() + "', sum(m01), sum(m02), sum(M03), sum(M04), sum(M05), sum(M06), sum(M07), sum(M08), sum(M09), sum(M10), sum(M11), sum(M12), sum(YEAR_AMOUNT), sum(AMOUNT_ADDUP)" +
						"from plan_year where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id <> '" + collectToUnitId + "'" + stateWhere;
				if (businessType.indexOf("OtherCost")==0) {
					collectSql += " and bdg_id='" + rootBdgId + "'";
				}
				JdbcUtil.execute(collectSql);
			}
			
//			汇总数据
			String deleteSql1 = "delete from plan_year where business_type in ('" + tempBusinessType + "', '" + tempBusinessType1 + "') and sj_type='" + sjType + "' and unit_id='" + collectToUnitId + "'";
			JdbcUtil.execute(deleteSql1);
//			(1)投资计划合计
			String collectSql1 = "insert into plan_year (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE,UNIT_ID, pid, M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, YEAR_AMOUNT, AMOUNT_ADDUP)" +
					"select sys_manager.newidbydate21(), '" + master.getUids() + "', '" + sjType + "', '" + master.getBusinessType() + "', '" + collectToUnitId + "', '" + master.getPid() + "', sum(m01), sum(m02), sum(M03), sum(M04), sum(M05), sum(M06), sum(M07), sum(M08), sum(M09), sum(M10), sum(M11), sum(M12), sum(YEAR_AMOUNT), sum(AMOUNT_ADDUP)" +
					"from plan_year where  master_id = '" + master.getUids() + "'";
			JdbcUtil.execute(collectSql1);
//			(2)资金计划合计
			String collectSql2 = "insert into plan_year (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE,UNIT_ID, pid, M01, M02, M03, M04, M05, M06, M07, M08, M09, M10, M11, M12, YEAR_AMOUNT, AMOUNT_ADDUP)" +
					"select sys_manager.newidbydate21(), '" + master1.getUids() + "', '" + sjType + "', '" + master1.getBusinessType() + "', '" + collectToUnitId + "', '" + master1.getPid() + "', sum(m01), sum(m02), sum(M03), sum(M04), sum(M05), sum(M06), sum(M07), sum(M08), sum(M09), sum(M10), sum(M11), sum(M12), sum(YEAR_AMOUNT), sum(AMOUNT_ADDUP)" +
					"from plan_year where  master_id = '" + master1.getUids() + "'";
			JdbcUtil.execute(collectSql2);
			
		} else if (sjType.length()==5) {
			String deleteSql = "delete from plan_quarter where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id='" + collectToUnitId + "'";
			JdbcUtil.execute(deleteSql);
			
//				计算公司的汇总数据
			String collectSql0 = "insert into plan_quarter (UIDS, MASTER_ID, quantities_id, bdg_id, contract_id, SJ_TYPE, BUSINESS_TYPE, UNIT_ID, pid, M1, M2, M3, QUARTER_AMOUNT, AMOUNT_ADDUP)" +
					"select sys_manager.newidbydate21(), '" + master0.getUids() + "', quantities_id, bdg_id, contract_id, '" + sjType + "', '" + businessType + "', '" + collectToUnitId + "', '" + master0.getPid() + "', sum(m1), sum(m2), sum(M3), sum(QUARTER_AMOUNT), sum(AMOUNT_ADDUP)" +
					"from plan_quarter where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id <> '" + collectToUnitId + "'" + stateWhere +
					" group by quantities_id, bdg_id, contract_id, pid";
			JdbcUtil.execute(collectSql0);
//			计算公司汇总数据的累计%
			this.updateDataAddup(businessType, collectToUnitId, sjType);
			
//			除了建筑安装投资计划，其他的都列为资金计划
			if (businessType.indexOf("Install_I")==-1) {
				String collectSql = "insert into plan_quarter (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, UNIT_ID, pid, M1, M2, M3, QUARTER_AMOUNT, AMOUNT_ADDUP)" +
						"select sys_manager.newidbydate21(), '" + master1.getUids() + "', '" + sjType + "', '" + businessType + "', '" + collectToUnitId + "', '" + master1.getPid() + "', sum(m1), sum(m2), sum(M3), sum(QUARTER_AMOUNT), sum(AMOUNT_ADDUP)" +
						"from plan_quarter where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id <> '" + collectToUnitId + "'" + stateWhere;
				if (businessType.indexOf("OtherCost")==0) {
					collectSql += " and bdg_id='" + rootBdgId + "'";
				}
				JdbcUtil.execute(collectSql);
			}
//			除了建筑安装资金计划，其他的都列为投资计划
			if (businessType.indexOf("Install_F")==-1) {
				String collectSql = "insert into plan_quarter (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, UNIT_ID, pid, M1, M2, M3, QUARTER_AMOUNT, AMOUNT_ADDUP)" +
						"select sys_manager.newidbydate21(), '" + master.getUids() + "', '" + sjType + "', '" + businessType + "', '" + collectToUnitId + "', '" + master.getPid() + "', sum(m1), sum(m2), sum(M3), sum(QUARTER_AMOUNT), sum(AMOUNT_ADDUP)" +
						"from plan_quarter where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id <> '" + collectToUnitId + "'" + stateWhere;
				if (businessType.indexOf("OtherCost")==0) {
					collectSql += " and bdg_id='" + rootBdgId + "'";
				}
				JdbcUtil.execute(collectSql);
			}
			
//			汇总数据
			String deleteSql1 = "delete from plan_quarter where business_type in ('" + tempBusinessType + "', '" + tempBusinessType1 + "') and sj_type='" + sjType + "' and unit_id='" + collectToUnitId + "'";
			JdbcUtil.execute(deleteSql1);
//			(1)投资计划汇总
			String collectSql1 = "insert into plan_quarter (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE,UNIT_ID, pid, M1, M2, M3, QUARTER_AMOUNT, AMOUNT_ADDUP)" +
					"select sys_manager.newidbydate21(), '" + master.getUids() + "', '" + sjType + "', '" + master.getBusinessType() + "', '" + collectToUnitId + "', '" + master.getPid() + "', sum(m1), sum(m2), sum(M3), sum(QUARTER_AMOUNT), sum(AMOUNT_ADDUP)" +
					"from plan_quarter where  master_id = '" + master.getUids() + "'";
			JdbcUtil.execute(collectSql1);
//			(2)资金计划汇总
			String collectSql2 = "insert into plan_quarter (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE,UNIT_ID, pid, M1, M2, M3, QUARTER_AMOUNT, AMOUNT_ADDUP)" +
					"select sys_manager.newidbydate21(), '" + master1.getUids() + "', '" + sjType + "', '" + master1.getBusinessType() + "', '" + collectToUnitId + "', '" + master1.getPid() + "', sum(m1), sum(m2), sum(M3), sum(QUARTER_AMOUNT), sum(AMOUNT_ADDUP)" +
					"from plan_quarter where  master_id = '" + master1.getUids() + "'";
			JdbcUtil.execute(collectSql2);
			
		} else if (sjType.length()==6) {
			String deleteSql = "delete from plan_month where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id='" + collectToUnitId + "'";
			JdbcUtil.execute(deleteSql);
			
//			计算公司的汇总数据
			String collectSql0 = "insert into plan_month (UIDS, MASTER_ID, quantities_id, bdg_id, contract_id, SJ_TYPE, BUSINESS_TYPE, UNIT_ID, pid, MONTH_AMOUNT, AMOUNT_ADDUP)" +
					"select sys_manager.newidbydate21(), '" + master0.getUids() + "', quantities_id, bdg_id, contract_id, '" + sjType + "', '" + businessType + "', '" + collectToUnitId + "', '" + master0.getPid() + "', sum(MONTH_AMOUNT), sum(AMOUNT_ADDUP)" +
					"from plan_month where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id <> '" + collectToUnitId + "'" + stateWhere +
							" group by quantities_id, bdg_id, contract_id, pid";
			JdbcUtil.execute(collectSql0);
//			计算公司汇总数据的累计%
			this.updateDataAddup(businessType, collectToUnitId, sjType);
			
//			除了建筑安装投资计划，其他的都列为资金计划
			if (businessType.indexOf("Install_I")==-1) {
				String collectSql = "insert into plan_month (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, UNIT_ID, pid, month_AMOUNT, AMOUNT_ADDUP)" +
						"select sys_manager.newidbydate21(), '" + master1.getUids() + "', '" + sjType + "', '" + businessType + "', '" + collectToUnitId + "', '" + master1.getPid() + "', sum(MONTH_AMOUNT), sum(AMOUNT_ADDUP)" +
						"from plan_month where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id <> '" + collectToUnitId + "'" + stateWhere;
				if (businessType.indexOf("OtherCost")==0) {
					collectSql += " and bdg_id='" + rootBdgId + "'";
				}
				JdbcUtil.execute(collectSql);
			}
//			除了建筑安装资金计划，其他的都列为投资计划
			if (businessType.indexOf("Install_F")==-1) {
				String collectSql = "insert into plan_month (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, UNIT_ID, pid, month_AMOUNT, AMOUNT_ADDUP)" +
						"select sys_manager.newidbydate21(), '" + master.getUids() + "', '" + sjType + "', '" + businessType + "', '" + collectToUnitId + "', '" + master.getPid() + "', sum(MONTH_AMOUNT), sum(AMOUNT_ADDUP)" +
						"from plan_month where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id <> '" + collectToUnitId + "'" + stateWhere;
				if (businessType.indexOf("OtherCost")==0) {
					collectSql += " and bdg_id='" + rootBdgId + "'";
				}
				JdbcUtil.execute(collectSql);
			}
			
//			汇总数据
			String deleteSql1 = "delete from plan_month where business_type in ('" + tempBusinessType + "', '" + tempBusinessType1 + "') and sj_type='" + sjType + "' and unit_id='" + collectToUnitId + "'";
			JdbcUtil.execute(deleteSql1);
//			(1)投资计划汇总
			String collectSql1 = "insert into plan_month (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE,UNIT_ID, pid, MONTH_AMOUNT, AMOUNT_ADDUP)" +
					"select sys_manager.newidbydate21(), '" + master.getUids() + "', '" + sjType + "', '" + master.getBusinessType() + "', '" + collectToUnitId + "', '" + master.getPid() + "', sum(MONTH_AMOUNT), sum(AMOUNT_ADDUP)" +
					"from plan_month where  master_id = '" + master.getUids() + "'";
			JdbcUtil.execute(collectSql1);
//			(2)资金计划汇总
			String collectSql2 = "insert into plan_month (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE,UNIT_ID, pid, MONTH_AMOUNT, AMOUNT_ADDUP)" +
					"select sys_manager.newidbydate21(), '" + master1.getUids() + "', '" + sjType + "', '" + master1.getBusinessType() + "', '" + collectToUnitId + "', '" + master1.getPid() + "', sum(MONTH_AMOUNT), sum(AMOUNT_ADDUP)" +
					"from plan_month where  master_id = '" + master1.getUids() + "'";
			JdbcUtil.execute(collectSql2);
		}
		
//		计算汇总数据的累计%
		String tableName = "";
		if (sjType.length()==4) {
			tableName = "plan_year";
		} else if (sjType.length()==6) {
			tableName = "plan_quarter";
		} else if (sjType.length()==5) {
			tableName = "plan_month";
		}
		
		String totelDataSql = "";
		if (businessType.indexOf("Install")==0) {
			//从属性代码中查询出工程类合同
			String gcSql = "select c.property_code,c.property_name from property_code c " +
							"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
							"and c.detail_type like '%GC%'";
			String contFilterId = "";
			List<Map<String, String>> list = JdbcUtil.query(gcSql);
			for(int i = 0; i < list.size(); i++) {
				contFilterId+="'"+list.get(i).get("property_code")+"',";				
			}
			contFilterId = contFilterId.substring(0,contFilterId.length()-1);
			totelDataSql = "(select sum(CONVALUE) from CON_OVE where condivno in ("+contFilterId+") and pid='" + pid + "')";
		} else if (businessType.indexOf("Equipment")==0) {
			//从属性代码中查询出设备类合同
			String sbSql = "select c.property_code,c.property_name from property_code c " +
							"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
							"and c.detail_type like '%SB%'";
			String contFilterId = "";
			List<Map<String, String>> list = JdbcUtil.query(sbSql);
			for(int i = 0; i < list.size(); i++) {
				contFilterId+="'"+list.get(i).get("property_code")+"',";				
			}
			contFilterId = contFilterId.substring(0,contFilterId.length()-1);
			totelDataSql = "(select sum(CONVALUE) from CON_OVE where condivno in ("+contFilterId+") and pid='" + pid + "')";
		} else if (businessType.indexOf("OtherCost")==0) {
			totelDataSql = "(select bdgmoney from bdg_info where bdgid='" + rootBdgId + "' and pid='" + pid + "')";
		} 
		
		if (tableName.length()>0 && totelDataSql.length()>0) {
			String updateSql = "update " + tableName + " set per_amount_addup = decode(" + totelDataSql + ", null, null, 0, null, nvl(amount_addup, 0)/" + totelDataSql + ") where business_type='" + businessType + "' and sj_type='" + sjType + "' and unit_id='" + collectToUnitId + "' and pid='" + pid + "'";
			JdbcUtil.execute(updateSql);
		}
		
//		计算投资计划、资金计划合计数据的累积%
		String totelDataSql1 = "(select bdgmoney from bdg_info where bdgid='01' and pid='" + pid + "')";
		String updateSql = "update " + tableName + " set per_amount_addup = decode(" + totelDataSql1 + ", null, null, 0, null, nvl(amount_addup, 0)/" + totelDataSql1 + ") where business_type in ('" + tempBusinessType + "', '" + tempBusinessType + "') and sj_type='" + sjType + "' and unit_id='" + collectToUnitId + "' and pid='" + pid + "'";
		JdbcUtil.execute(updateSql);
		
		String insertSql1 = "merge into " + tempTableName + " L" +
			" using (select '" + businessType1 + "' businessType from dual) b" +
			" on ( l.contract_id is null and l.bdg_id is null and l.quantities_id is null " +
			" and l.business_type = '" + businessType1 + "' and l.sj_type='" + sjType + "' and l.unit_id='" + collectToUnitId + "' and master_id = '" + master.getUids() + "')" +
			" WHEN NOT MATCHED THEN" +
			" INSERT (uids, master_id, business_type, sj_type, unit_id, pid) values (" + SnUtil.getNewID() + ", '" + master.getUids() + "', '" + businessType1 + "', '" + sjType + "', '" + collectToUnitId + "', '" + master.getPid() + "')";
		JdbcUtil.execute(insertSql1);
		
		String insertSql2 = "merge into " + tempTableName + " L" +
				" using (select '" + businessType2 + "' businessType from dual) b" +
				" on ( l.contract_id is null and l.bdg_id is null and l.quantities_id is null " +
				" and l.business_type = '" + businessType2 + "' and l.sj_type='" + sjType + "' and l.unit_id='" + collectToUnitId + "' and master_id = '" + master.getUids() + "')" +
				" WHEN NOT MATCHED THEN" +
				" INSERT (uids, master_id, business_type, sj_type, unit_id, pid) values (" + SnUtil.getNewID() + ", '" + master.getUids() + "', '" + businessType2 + "', '" + sjType + "', '" + collectToUnitId + "', '" + master.getPid() + "')";
		JdbcUtil.execute(insertSql2);
		
		String insertSql20 = "merge into " + tempTableName + " L" +
				" using (select '" + businessType2 + "' businessType from dual) b" +
				" on ( l.contract_id is null and l.bdg_id is null and l.quantities_id is null " +
				" and l.business_type = '" + businessType2 + "' and l.sj_type='" + sjType + "' and l.unit_id='" + collectToUnitId + "' and master_id = '" + master1.getUids() + "')" +
				" WHEN NOT MATCHED THEN" +
				" INSERT (uids, master_id, business_type, sj_type, unit_id, pid) values (" + SnUtil.getNewID() + ", '" + master1.getUids() + "', '" + businessType2 + "', '" + sjType + "', '" + collectToUnitId + "', '" + master1.getPid() + "')";
		JdbcUtil.execute(insertSql20);
		
		String insertSql3 = "merge into " + tempTableName + " L" +
				" using (select '" + businessType3 + "' businessType from dual) b" +
				" on ( l.contract_id is null and l.bdg_id is null and l.quantities_id is null " +
				" and l.business_type = '" + businessType3 + "' and l.sj_type='" + sjType + "' and l.unit_id='" + collectToUnitId + "' and master_id = '" + master.getUids() + "')" +
				" WHEN NOT MATCHED THEN" +
				" INSERT (uids, master_id, business_type, sj_type, unit_id, pid) values (" + SnUtil.getNewID() + ", '" + master.getUids() + "', '" + businessType3 + "', '" + sjType + "', '" + collectToUnitId + "', '" + master.getPid() + "')";
		JdbcUtil.execute(insertSql3);
		
		String insertSql30 = "merge into " + tempTableName + " L" +
				" using (select '" + businessType3 + "' businessType from dual) b" +
				" on ( l.contract_id is null and l.bdg_id is null and l.quantities_id is null " +
				" and l.business_type = '" + businessType3 + "' and l.sj_type='" + sjType + "' and l.unit_id='" + collectToUnitId + "' and master_id = '" + master1.getUids() + "')" +
				" WHEN NOT MATCHED THEN" +
				" INSERT (uids, master_id, business_type, sj_type, unit_id, pid) values (" + SnUtil.getNewID() + ", '" + master1.getUids() + "', '" + businessType3 + "', '" + sjType + "', '" + collectToUnitId + "', '" + master1.getPid() + "')";
		JdbcUtil.execute(insertSql30);
		
		String insertSql4 = "merge into " + tempTableName + " L" +
				" using (select '" + businessType4 + "' businessType from dual) b" +
				" on ( l.contract_id is null and l.bdg_id is null and l.quantities_id is null " +
				" and l.business_type = '" + businessType4 + "' and l.sj_type='" + sjType + "' and l.unit_id='" + collectToUnitId + "' and master_id = '" + master1.getUids() + "')" +
				" WHEN NOT MATCHED THEN" +
				" INSERT (uids, master_id, business_type, sj_type, unit_id, pid) values (" + SnUtil.getNewID() + ", '" + master1.getUids() + "', '" + businessType4 + "', '" + sjType + "', '" + collectToUnitId + "', '" + master1.getPid() + "')";
		JdbcUtil.execute(insertSql4);
		
		return true;
	}
	
	/**
	 * 计划数据上报
	 * @param masterIds
	 * @param state 状态
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-21
	 */
	public boolean reportPlanData(String masterIds, String state){
		String masterIdInStr = StringUtil.transStrToIn(masterIds, "`");
		List<PlanMaster> masterList = this.planMasterDAO.findByWhere(PlanMaster.class.getName(), "uids in (" + masterIdInStr + ")");
		
		PlanMaster master = null;
		for (int i = 0; i < masterList.size(); i++) {
			master = masterList.get(i);
			if (master.getState()==null || !master.getState().equals(state)) {
				master.setState(state);
				this.planMasterDAO.saveOrUpdate(master);

//				只汇总已上报的数据
				this.calCollectToUnit(Constant.DefaultOrgRootID, master.getBusinessType(), master.getSjType(), "1", master.getPid());
			}
		}
		
		return true;
	}	
	/**
	 * 根据流程编号获取PlanMaster
	 * @param flowbh 流程中业务编号
	 * @return
	 * @author: hanhl
	 * @createDate: 2010-12-24
	 */
	public PlanMaster findPlanMasterByFlowbh(String flowbh){
		Object obj = this.planMasterDAO.findBeanByProperty(PlanMaster.class.getName(), "flowbh", flowbh);
		if(obj != null){
			return (PlanMaster) obj;
		}else{
			return null;
		}
		
	
	}
	
	/**
	 * 获取其他费用计划的xgridTree的xml数据；
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-22
	 */
	public String getOtherCostPlanXml(String businessType, String unitId, String sjType){
		String tableName = "";
		String dataColumns = "";
		
		String xmlString = "";
		xmlString += "<rows>";
		xmlString += "<head>";
		xmlString += "<column id='bdgname' width='250' type='tree' align='left' sort='str' >概算项目</column>";
		xmlString += "<column id='uids' width='250' type='ro' align='left'  sort='str' hidden='true'>uids</column>";
		xmlString += "<column id='master_id' width='250' type='ro' align='left'  sort='str' hidden='true'>master_id</column>";
		xmlString += "<column id='sj_type' width='250' type='ro' align='left'  sort='str' hidden='true'>sj_type</column>";
		xmlString += "<column id='business_type' width='250' type='ro' align='left'  sort='str' hidden='true'>business_type</column>";
		xmlString += "<column id='bdg_id' width='250' type='ro' align='left'  sort='str' hidden='true'>概算项目</column>";
		xmlString += "<column id='unit_id' width='250' type='ro' align='left'  sort='str' hidden='true'>unit_id</column>";
		
		if (sjType.length()==4) {
			tableName = "plan_year";
			dataColumns = "uids,master_id,sj_type,business_type,bdg_id,unit_id,M01,M02,M03,M04,M05,M06,M07,M08,M09,M10,M11,M12,year_amount";
			
			xmlString += "<column id='M01' width='70' type='ed[=sum]' align='left'  sort='str'>1月</column>";
			xmlString += "<column id='M02' width='70' type='ed[=sum]' align='left'  sort='str'>2月</column>";
			xmlString += "<column id='M03' width='70' type='ed[=sum]' align='left'  sort='str'>3月</column>";
			xmlString += "<column id='M04' width='70' type='ed[=sum]' align='left'  sort='str'>4月</column>";
			xmlString += "<column id='M05' width='70' type='ed[=sum]' align='left'  sort='str'>5月</column>";
			xmlString += "<column id='M06' width='70' type='ed[=sum]' align='left'  sort='str'>6月</column>";
			xmlString += "<column id='M07' width='70' type='ed[=sum]' align='left'  sort='str'>7月</column>";
			xmlString += "<column id='M08' width='70' type='ed[=sum]' align='left'  sort='str'>8月</column>";
			xmlString += "<column id='M09' width='70' type='ed[=sum]' align='left'  sort='str'>9月</column>";
			xmlString += "<column id='M10' width='70' type='ed[=sum]' align='left'  sort='str'>10月</column>";
			xmlString += "<column id='M11' width='70' type='ed[=sum]' align='left'  sort='str'>11月</column>";
			xmlString += "<column id='M12' width='70' type='ed[=sum]' align='left'  sort='str'>12月</column>";
			xmlString += "<column id='year_amount' width='70' type='ed[=c7+c8+c9+c10+c11+c12+c13+c14+c15+c16+c17+c18]' align='left'  sort='str'>总金额</column>";
		} else if (sjType.length()==5) {
			tableName = "plan_quarter";
			dataColumns = "uids,master_id,sj_type,business_type,bdg_id,unit_id,M1,M2,M3,quarter_amount";
			
			xmlString += "<column id='M1' width='180' type='ed[=sum]' align='left'  sort='str'>头月</column>";
			xmlString += "<column id='M2' width='180' type='ed[=sum]' align='left'  sort='str'>中月</column>";
			xmlString += "<column id='M3' width='180' type='ed[=sum]' align='left'  sort='str'>末月</column>";
			xmlString += "<column id='quarter_amount' width='180' type='ed[=c7+c8+c9]' align='left'  sort='str'>总金额</column>";
		} else if (sjType.length()==6) {
			tableName = "plan_month";
			dataColumns = "uids,master_id,sj_type,business_type,bdg_id,unit_id,month_amount";
			
			xmlString += "<column id='month_amount' width='180' type='ed[=sum]' align='left'  sort='str'>总金额</column>";
		}
		/*
		xmlString += "<column id='amount_addup' width='70' type='ro' align='left'  sort='str'>累计</column>";
		xmlString += "<column id='per_amount_addup' width='70' type='ro' align='left'  sort='str'>累计%</column>";
		*/
		xmlString += "</head>";
		if (businessType!=null && businessType.length()>0 && unitId!=null && businessType.length()>0 && sjType!=null && sjType.length()>0) {
			xmlString += this.getChildXmlStr(rootBdgId, tableName, dataColumns, businessType, unitId, sjType);
		}
		xmlString += "</rows>";
		return xmlString;
	}
	
	/**
	 * 获取概算项目树的xml串
	 * 
	 * @param bdgId
	 * @param tableName
	 * @param dataColumns
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-22
	 */
	public String getChildXmlStr(String bdgId, String tableName, String dataColumns, String businessType, String unitId, String sjType){
		String returnStr = "";
		String[] dataColumnArr = dataColumns.split(",");
//		BdgInfo bdgInfo = (BdgInfo) this.planMasterDAO.findById(BdgInfo.class.getName(), bdgId);
		PlanOtherCostItem otherCostItem = (PlanOtherCostItem) this.planMasterDAO.findById(PlanOtherCostItem.class.getName(), bdgId);
		
		String selectSql = "select " + dataColumns + " from " + tableName + " where bdg_id='" + bdgId + "' and business_type='" + businessType + "' and unit_id='" + unitId + "' and sj_type='" + sjType + "'";
		List<Map<String, Object>> list = JdbcUtil.query(selectSql);
		if (list.size()==1) {
			Map<String, Object> map = list.get(0);
			
//			String subNodeSql = "select bdgid from bdg_info where parent='" + bdgId + "' order by bdgid";
			String subNodeSql = "select item_id from plan_othercost_item where parent_id='" + bdgId + "' order by item_id";
			List<Map<String, String>> bdgList = JdbcUtil.query(subNodeSql);
			
			returnStr = "<row id='" + bdgId + "`" + (bdgList.size()==0) + "`" + otherCostItem.getParentId() + "' open='1'>";
			returnStr += "<cell>" + otherCostItem.getItemName() + "</cell>";
			
			for (int i = 0; i < bdgList.size(); i++) {
				Map<String, String> bdgMap = bdgList.get(i);
				returnStr += getChildXmlStr(bdgMap.get("item_id"), tableName, dataColumns, businessType, unitId, sjType);
			}
			
			for (int i = 0; i < dataColumnArr.length; i++) {
				String keyStr = dataColumnArr[i];
				String val = "";
				if (map.get(keyStr)!=null) {
					Object valObject = map.get(keyStr);
					if (valObject.getClass().getName().equals("java.lang.String")) {
						val = (String)valObject;
					} else if (valObject.getClass().getName().equals("java.math.BigDecimal")) {
						val = ((BigDecimal)valObject).toPlainString();
					}
				}
				
				//如果是父节点，则不设置值,是叶子节点，并且是需要级联汇总的列，才填写相应的值；
				if (keyStr.indexOf("M")==0 || keyStr.equalsIgnoreCase("month_amount") || keyStr.equalsIgnoreCase("quarter_amount") || keyStr.equalsIgnoreCase("year_amount")){
					if(bdgList.size()==0){
						returnStr += "<cell>" + val + "</cell>";
					} else {
						returnStr += "<cell></cell>";
					}
				} else {
					returnStr += "<cell>" + val + "</cell>";
				}
			}
			
			returnStr += "</row>";
		}
		return returnStr;
	}
	
	/**
	 * 更新xgrid中填写的投资计划的数据；
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @param dataXML
	 * @return
	 * @author: Ivy
	 * @throws IOException 
	 * @throws JDOMException 
	 * @throws NamingException 
	 * @throws SQLException 
	 * @createDate: 2010-12-23
	 */
	public String updateInvestmentData(String businessType, String unitId, String sjType, String dataXML) throws JDOMException, IOException, NamingException, SQLException{
		String tableName = "";
		if (sjType.length()==4) {
			tableName = "plan_year";
		} else if (sjType.length()==5) {
			tableName = "plan_quarter";
		} else if (sjType.length()==6) {
			tableName = "plan_month";
		}
		
		Context initCtx = new InitialContext();
		DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
		Connection conn = ds.getConnection();
		Statement stmt = conn.createStatement();
		Statement insertStmt = conn.createStatement();
		Statement delStmt = conn.createStatement();
		
		System.out.println(dataXML);
		SAXBuilder sb = new SAXBuilder();
		Document doc = sb.build(new StringReader(dataXML));
		
		Element root = doc.getRootElement();
		List<Element> insertRows = XPath.selectNodes(root, "/rows/row[@type='insert']/cell[@id='master_id']");
		List<Element> updateRows = XPath.selectNodes(root, "/rows/row[@type='update']/cell[@id='uids']");
		List<Element> deleteRows = XPath.selectNodes(root, "/rows/row[@type='delete']");
		
		for (int i = 0; i < insertRows.size(); i++) {
			Element masterIdCell = insertRows.get(i);
			String rowId = masterIdCell.getParentElement().getAttributeValue("id");
			String bdgId = rowId.split("`")[0];
			String masterId = masterIdCell.getText();
			PlanMaster master = this.getPlanMasterInfoById(masterId);
			
			String newId = SnUtil.getNewID();
			String sql = "insert into " + tableName + " (UIDS, MASTER_ID, SJ_TYPE, BUSINESS_TYPE, BDG_ID, UNIT_ID, pid" +
				" ) values ('" + newId + "', '" + masterId + "', '" + sjType + "', '" + businessType + "', '" + bdgId + "', '" + unitId + "', '" + master.getPid() + "')";
			insertStmt.addBatch(sql);
			
			Element uidsCell = (Element) XPath.selectSingleNode(root, "/rows/row[@id='" + rowId + "']/cell[@id='uids']");
			uidsCell.setText(newId);
			if (updateRows==null || updateRows.size()==0) {
				updateRows = new ArrayList<Element>();
			}
			updateRows.add(uidsCell);
		}
		
		for (int i = 0; i < updateRows.size(); i++) {
			Element uidsCell = updateRows.get(i);
			Element rowEl = uidsCell.getParentElement();
			
			List<Element> updateCellList = XPath.selectNodes(root, "/rows/row[@id='" + rowEl.getAttributeValue("id") + "']/cell[starts-with(@type, 'ed') or starts-with(@type, 'math')]");
			String uids = uidsCell.getText();
			String sql = "update " + tableName;
			if (updateCellList.size()>0) {
				Element updateCell = updateCellList.get(0);
				String columnName = updateCell.getAttributeValue("id");
				String cellValue = updateCell.getText().trim();
				if (cellValue.length()==0) {
					cellValue = null;
				}
				sql += " set " + columnName + "=" + cellValue + ",";
				
				for (int j = 1; j < updateCellList.size(); j++) {
					updateCell = updateCellList.get(j);
					columnName = updateCell.getAttributeValue("id");
					cellValue = updateCell.getText().trim();
					if (cellValue.length()==0) {
						cellValue = null;
					}
					
					sql += columnName + "=" + cellValue + ",";
				}
			
				sql = sql.substring(0, sql.length()-1);
				sql += " where uids=" + uids;
				
				System.out.println(sql);
				stmt.addBatch(sql);
			}
		}
		
		for (int i = 0; i < deleteRows.size(); i++) {
			Element deleteRow = deleteRows.get(i);
			String bdgId = deleteRow.getAttributeValue("id").split("`")[0];
			String sql = "delete from " + tableName;
			sql += " where business_type='" + businessType + "' and bdg_id='" + bdgId + "' and sj_type='" + sjType + "' and unit_id='" + unitId + "'";
			
			delStmt.addBatch(sql);
		}
		
		insertStmt.executeBatch();
		stmt.executeBatch();
		delStmt.executeBatch();
		
		calCollectData_otherCost(businessType, unitId, sjType, rootBdgId);
		
		insertStmt.close();
		stmt.close();
		delStmt.close();
		conn.close();
		initCtx.close();
		
		return "";
	}
	
	/**
	 * 计算其他费用各个父节点上的合计数据
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @param bdgId
	 * @author: Ivy
	 * @createDate: 2011-1-13
	 */
	private void calCollectData_otherCost(String businessType, String unitId, String sjType, String bdgId) {
		String tableName = "";
		String dataColumns = "";
		
		PlanMaster master = this.getPlanMasterInfo(businessType, unitId, sjType);
		
		if (sjType.length()==4) {
			tableName = "plan_year";
			dataColumns = "M01,M02,M03,M04,M05,M06,M07,M08,M09,M10,M11,M12,year_amount";
		} else if (sjType.length()==5) {
			tableName = "plan_quarter";
			dataColumns = "M1,M2,M3,quarter_amount";
		} else if (sjType.length()==6) {
			tableName = "plan_month";
			dataColumns = "month_amount";
		}
		
		String selSql = "select item_id from plan_othercost_item where parent_id='" + bdgId + "' and pid='" + master.getPid() + "'";
		List<Map<String, String>> list = JdbcUtil.query(selSql);
		
		if (list.size()==0) {
			
		} else {
			for (int j = 0; j < list.size(); j++) {
				String subItemId = list.get(j).get("item_id");
				calCollectData_otherCost(businessType, unitId, sjType, subItemId);
			}
			
			String colArr[] = dataColumns.split(",");
			String whereStr = " where business_type='" + businessType + "' and unit_id='" + unitId + "' and sj_type='" + sjType + "' and bdg_Id in (" + selSql + ")";
			String updateSql = "update " + tableName + " set ";
			for (int i = 0; i < colArr.length; i++) {
				updateSql += colArr[i] + "=(select sum(" + colArr[i] + ") from " + tableName + whereStr + ") ,";
			}
			updateSql = updateSql.substring(0, updateSql.length()-1);
			updateSql += " where business_type='" + businessType + "' and unit_id='" + unitId + "' and sj_type='" + sjType + "' and bdg_Id = '" + bdgId + "'";
			JdbcUtil.execute(updateSql);
		}
		
	}

	/**
	 * 根据概算项目ID，获得概算项目的相关信息；
	 * @param bdgId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-24
	 */
	public BdgInfo getBdgInfoById(String bdgId){
		BdgInfo bdgInfo = (BdgInfo) this.planMasterDAO.findById(BdgInfo.class.getName(), bdgId);
		return bdgInfo;
	}
	
	/**
	 * 根据其他费用项目ID，获得项目的相关信息；
	 * @param itemId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-24
	 */
	public PlanOtherCostItem getItemInfoById(String itemId){
		PlanOtherCostItem otherCostItem = (PlanOtherCostItem) this.planMasterDAO.findById(PlanOtherCostItem.class.getName(), itemId);
		return otherCostItem;
	}
	
	/**
	 * 根据其他费用项目编号，获取全路径信息；
	 * @param itemId
	 * @param rootId
	 * @return
	 */
	public String getOtherCostFullPath(String itemId, String rootId){
		String parentItemSql = "select parent_id, item_name from plan_othercost_item where item_id = '" + itemId + "'";
		List<Map<String, String>> l = JdbcUtil.query(parentItemSql);
		String itemName = "";
		String parentId = "";
		
		if (l!=null && l.size()==1) {
			Map<String, String> map = l.get(0);
			parentId = map.get("parent_id");
			itemName = map.get("item_name");
			
			if (rootId==null || rootId.length()==0 || !itemId.equalsIgnoreCase(rootId)) {
				return getOtherCostFullPath(parentId, rootId) + "/" + itemName;
			} else {
				return "";
			}
		} else {
			return "";
		}
	}
	
	/**
	 * 根据父节点，获得此节点下新增的项目的编码信息
	 * 
	 * @param parentId
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-1-12
	 */
	public String getCodeForNewItem(String parentId){
		String parentItemSql = "select max(item_id) maxCode from plan_othercost_item where parent_id = '" + parentId + "'";
		List<Map<String, String>> l = JdbcUtil.query(parentItemSql);
		
		if (l!=null && l.size()==1) {
			Map<String, String> map = l.get(0);
			String maxCode = map.get("maxCode");
			int lastPart = 1;
			if (maxCode!=null && maxCode.length()>2) {
				lastPart = Integer.valueOf(maxCode.substring(maxCode.length()-2))+1;
			}
			String newCode = parentId + (lastPart<10 ? ("0"+String.valueOf(lastPart)) : String.valueOf(lastPart));
			
			return newCode;
		} else {
			return "04001";
		}
	}
	
	//****************************************************** Excel 数据导出   ***************************************
	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-28
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
}
