package com.sgepit.pmis.budget.service;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.budget.dao.MatCompletionDAO;
import com.sgepit.pmis.budget.hbm.MatCompletionSub;

public class MatCompletionMgmImpl extends BaseMgmImpl implements MatCompletionMgmFacade {

	MatCompletionDAO  matCompletionDAO;
	
	public static MatCompletionMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (MatCompletionMgmImpl) ctx.getBean("matCompletionMgmImpl");
	}

	public void setMatCompletionDAO(MatCompletionDAO matCompletionDAO) {
		this.matCompletionDAO = matCompletionDAO;
	}

	public void initMatCompletion(String acmid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = " select t.uuid ,t.matid,t.plan_sum, m.bdgid,m.conid, m.plan_type " + 
					 " from mat_houseout_sub t, mat_applysub s, mat_apply m " + 
					 " where t.matid=s.matid and s.appid=m.appid and t.flag='false'  ";
		List list = jdbc.queryForList(sql);
		Iterator it = list.iterator();
		while (it.hasNext()){
			Map m = (Map)it.next();
			MatCompletionSub  ms = new MatCompletionSub();
			ms.setAcmid(acmid);
			ms.setMatoutid(m.get("uuid").toString());
			ms.setMatid(m.get("matid").toString());
			ms.setMoney(new Double(m.get("plan_sum").toString()));
			ms.setBdgid(m.get("bdgid").toString());
			ms.setPartyb(m.get("plan_type").toString());
			ms.setConid(m.get("conid").toString());
			this.matCompletionDAO.insert(ms);
			String sql2 = " update mat_houseout_sub t set t.flag = 'true'  " +
						  " where t.uuid = '"+m.get("uuid").toString()+"'  ";
			jdbc.update(sql2);
		}
	}
	
	/**
	 * 获得材料投资完成的概算
	 * @param acmid
	 * @return
	 */
	public List getBdgData(String acmid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql3 = " select t.bdgid , sum(t.money) total " + 
		  "	from mat_completion_sub t " + 
		  "	where t.acmid='"+acmid+"'" +  
		  "	group by t.bdgid";
		List list3 = jdbc.queryForList(sql3);
		return list3;
	}
	
	/**
	 * 获得材料投资完成的某概算下的乙方单位
	 * @param acmid
	 * @param bdgid
	 * @return
	 */
	public List getPartyb(String acmid,String bdgid){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = " select t.partyb, sum(money) total " +  
					  "	from mat_completion_sub t " + 
					  " where t.acmid='"+acmid+"' and t.bdgid='"+bdgid+"' " +
					  " group by t.partyb " ;
		List list = jdbc.queryForList(sql);
		return list;
	}
	
	/**
	 * 获得材料投资完成的某概算下的乙方单位下所有材料
	 * @param acmid
	 * @param bdgid
	 * @param partyb
	 * @return
	 */
	public List getMat(String acmid,String bdgid,String partyb){
		JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
		String sql = " select t.matid, t.money " +  
					  "	from mat_completion_sub t " + 
					  " where t.acmid='"+acmid+"' and t.bdgid='"+bdgid+"' and t.partyb='" +partyb +"' "; 
		List list = jdbc.queryForList(sql);
		return list;
	}
		
}
