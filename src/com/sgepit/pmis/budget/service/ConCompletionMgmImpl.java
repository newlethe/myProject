package com.sgepit.pmis.budget.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.budget.dao.ConCompletionDAO;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.ConCompletionSub;
import com.sgepit.pmis.common.BusinessConstants;

public class ConCompletionMgmImpl extends BaseMgmImpl implements ConCompletionMgmFacade {

	private ConCompletionDAO conCompletionDao;
	
	private String bean = BusinessConstants.BDG_PACKAGE + BusinessConstants.CON_COMPLETION;
	private String beanSub = BusinessConstants.BDG_PACKAGE + BusinessConstants.CON_COMPLETION_SUB;
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static ConCompletionMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		return (ConCompletionMgmImpl) ctx.getBean("conCompletionMgm");
	}


	// -------------------------------------------------------------------------
	// Operation methods, implementing the ContractMgmFacade interface
	// -------------------------------------------------------------------------
	
	public void setConCompletionDAO(ConCompletionDAO conCompletionDao) {
		this.conCompletionDao = conCompletionDao;
	}
	
	/**
	 * @description 获得所有有合同投资完成的合同ID
	 * @return conidList
	 */
	public List getCompleteConids(){
//		List conidList = new ArrayList();
//		List list = this.conCompletionDao.findAll(BusinessConstants.CON_PACKAGE + BusinessConstants.CON_OVE);
//		for (int i = 0; i < list.size(); i++) {
//			ConOve conove = (ConOve)list.get(i);
//			List list2 = this.conCompletionDao.findByProperty(BusinessConstants.BDG_PACKAGE + BusinessConstants.BDG_MONEY_APP, "conid", conove.getConid());
//			if (list2.isEmpty()) continue;
//			conidList.add(conove.getConid());
//		}
//		return conidList;
		List list = new ArrayList();
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = "select distinct t.conid from bdg_money_app t";
		list = jdbc.queryForList(sql);
		return list;
	}

	/**
	 * @description 合同投资完成初始化从表数据
	 * @param conid
	 * @param concomid
	 */
	public void initConCompletionSub(String conid, String concomid){
		List subList = this.conCompletionDao.findByProperty(beanSub, "concomid", concomid);
		if (!subList.isEmpty()) this.conCompletionDao.deleteAll(subList);
		String beanName = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_MONEY_APP);
		List list = this.conCompletionDao.findByProperty(beanName, "conid", conid);
		for (Iterator iterator = list.iterator(); iterator.hasNext();) {
			BdgMoneyApp bdgMoneyApp = (BdgMoneyApp) iterator.next();
			if (0==bdgMoneyApp.getIsleaf()) continue;
			String beanInfo = BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO);
			BdgInfo bdgInfo = (BdgInfo) this.conCompletionDao.findById(beanInfo, bdgMoneyApp.getBdgid());
			ConCompletionSub sub = new ConCompletionSub();
			sub.setBdgid(bdgMoneyApp.getBdgid());
			sub.setBdgname(bdgInfo.getBdgname());
			sub.setBdgmoney(bdgInfo.getBdgmoney());
			sub.setConcomid(concomid);
			this.conCompletionDao.insert(sub);
		}
	}
	
	/**
	 * @description 删除主表前判断从表是否有数据
	 * @param equids
	 * @return String
	 */
	public String checkDelete(String[] concomids){
		String state = "";
		for (int i = 0; i < concomids.length; i++){
			List list = this.conCompletionDao.findByProperty(beanSub, "concomid", concomids[i]);
			if (!list.isEmpty()){
				state = "本月合同投资完成数据已存在，如需清除点[初始化]即可！";
				break;
			}
		}
		return state;
	}
	
	public List setTotalMoney(String conid, String bdgid, String month){
		String sql = "select sum(s.currentmoney) total from con_completion c, con_completion_sub s "
					+"where c.concomid = s.concomid " 
					+"and c.conid = '"+conid+"' " 
					+"and s.bdgid = '"+bdgid+"' "
					+"and c.month < to_date('"+month+"', 'YYYY-MM-DD')";
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		List list = jdbc.queryForList(sql);
		System.out.println(list);
		return list;
	}
}
