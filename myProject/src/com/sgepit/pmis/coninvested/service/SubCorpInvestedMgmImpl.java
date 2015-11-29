/***********************************************************************
 * Module:  ProjectConMgmImpl.java
 * Author:  lxb 　工程合同投资完成
 * Purpose: Defines the Class ProjectConMgmImpl
 ***********************************************************************/

package com.sgepit.pmis.coninvested.service;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.budget.dao.BdgInfoDAO;
import com.sgepit.pmis.budget.dao.ConInvestedDAO;
import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.common.BusinessConstants;
import com.sgepit.pmis.coninvested.hbm.CorpCompletionSub;


/** @pdOid 96d8d597-4fdb-4052-98cb-b52795d56ca7 */
public class SubCorpInvestedMgmImpl extends BaseMgmImpl  implements SubCorpInvestedMgmFacade{
	private ConInvestedDAO conInvestedDAO;
	private BdgInfoDAO bdginfodao;
	private String BeanName = BusinessConstants.ConInv_PACKAGE + BusinessConstants.corp_invested;
	private String subBeanName = BusinessConstants.ConInv_PACKAGE + BusinessConstants.Sub_CorpInvested;
	
	// -------------------------------------------------------------------------
	// Return business logic instance
	// -------------------------------------------------------------------------
	public static SubCorpInvestedMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (SubCorpInvestedMgmImpl) ctx.getBean("subcorpMgm");
	}
   /**
	 * @param conInvestedDAO the conInvestedDAO to set
	 */
	public void setConInvestedDAO(ConInvestedDAO conInvestedDAO) {
		this.conInvestedDAO = conInvestedDAO;
	}

	public void saveGetBudgetTree(String corpbasicid, String[] ids,String month) {
		for (int i = 0; i < ids.length; i++) {
			CorpCompletionSub bme = new CorpCompletionSub();
			BdgInfo dgInfo = (BdgInfo) this.conInvestedDAO.findById(BusinessConstants.BDG_PACKAGE.concat(BusinessConstants.BDG_INFO), ids[i]);
			//找出本月以前所有其它费用投资完成的总和
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			String sql = "select nvl(sum(s.currentmoney),0) total from CORP_COMPLETION c, CORP_COMPLETION_SUB s "
				+"where s.corpinvesteid in (select c.corpinvesteid from CORP_COMPLETION c where   c.month < to_date('"+month+"', 'YYYY-MM-DD')) and s.corpinvesteid=c.corpinvesteid and s.bdgid='"+ids[i]+"'"; 
			List list3 = jdbc.queryForList(sql);
			Iterator it = list3.iterator();
			if (it.hasNext()){
			 Map map = (Map)it.next();
				bme.setCorpinvesteid(corpbasicid);
				bme.setBdgid(ids[i]);
				bme.setBdgmoney(dgInfo.getBdgmoney());
				bme.setBdgname(dgInfo.getBdgname());
				Double totalmoney = new Double(map.get("total").toString());
				bme.setTotalmoney(totalmoney);
				Double bdgmoney = dgInfo.getBdgmoney();
				if (bdgmoney != 0){
					double percent =( totalmoney.doubleValue()/dgInfo.getBdgmoney())*100; 
					bme.setTotalpercent(percent);
				}
				conInvestedDAO.insert(bme);
			}
	      
		}
	}
	/**
	 * 重新计算累计金额和百分比
	 */
	public void reCalculate(String[] ids, String[] bdgid, Double[] curMoney, String month){
		for (int i=0; i<ids.length; i++){
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			String sql = "select nvl(sum(s.currentmoney),0) total from CORP_COMPLETION c, CORP_COMPLETION_SUB s "
				+"where s.corpinvesteid in (select c.corpinvesteid from CORP_COMPLETION c where   c.month< to_date('"+month+"', 'YYYY-MM-DD')) and s.corpinvesteid=c.corpinvesteid and s.bdgid='"+bdgid[i]+"'"; 
			List list3 = jdbc.queryForList(sql);
			Iterator it = list3.iterator();
			if (it.hasNext()){
				CorpCompletionSub ccs = (CorpCompletionSub)this.conInvestedDAO.findById(subBeanName, ids[i]);
				Map map = (Map)it.next();
				Double totalmoney = new Double(map.get("total").toString());
				Double bdgmoney = ccs.getBdgmoney();
				ccs.setTotalmoney(totalmoney + curMoney[i]);
				if (bdgmoney !=0){
					Double totalpercent = (totalmoney + curMoney[i])/bdgmoney;
					ccs.setTotalpercent(totalpercent);
				}
				this.conInvestedDAO.saveOrUpdate(ccs);
			}
		}
	}
	
	

}