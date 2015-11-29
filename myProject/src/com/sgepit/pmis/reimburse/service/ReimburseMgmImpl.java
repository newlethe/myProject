package com.sgepit.pmis.reimburse.service;

import org.springframework.jdbc.core.JdbcTemplate;

import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.pmis.reimburse.dao.ReimburseDao;
import com.sgepit.pmis.reimburse.hbm.DeptReimburse;

public class ReimburseMgmImpl implements ReimburseMgmFacade {
	private ReimburseDao reimburseDao;

	public ReimburseDao getReimburseDao() {
		return reimburseDao;
	}

	public void setReimburseDao(ReimburseDao reimburseDao) {
		this.reimburseDao = reimburseDao;
	}
	
	/**
	 * 费用报销表
	 * @param cjspb
	 * @return
	 */
	public String addOrUpdateRe(DeptReimburse deptre) {
		String flag = "0";
		System.out.println(deptre.getUids());
		try{
			if("".equals(deptre.getUids())||deptre.getUids()==null){//新增
				this.reimburseDao.insert(deptre);
				flag="1";
			}else{//修改
				this.reimburseDao.saveOrUpdate(deptre);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}	
	public String udpateBillState(String bh) {
		String flag = "0";
		try{
			String  sql="update dept_reimburse set bill_state='-1' where memo='"+bh+"'";
			JdbcTemplate jdbc = JdbcUtil.getJdbcTemplate();
			jdbc.update(sql);
			flag = "1";
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		return flag;
	}	
}
