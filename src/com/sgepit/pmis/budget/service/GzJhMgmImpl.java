package com.sgepit.pmis.budget.service;



import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;

import com.sgepit.frame.base.service.BaseMgmImpl;

import com.sgepit.pmis.budget.dao.GzJhDAO;


import com.sgepit.pmis.routine.hbm.GzJh;



public class GzJhMgmImpl extends BaseMgmImpl implements GzJhMgmFacade {

	
	private BusinessException businessException;

	public static GzJhMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		
		return (GzJhMgmImpl) ctx.getBean("gzJhMgm");
	}
	

	private GzJhDAO gzJhDao;
	
	public void setGzJhDao(GzJhDAO gzJhDao) {
		this.gzJhDao = gzJhDao;
	}

	public String addOrUpdateGzJh(GzJh gzjh) {
		String flag = "0";
		System.out.print(gzjh.getUids());
		try{
			if("".equals(gzjh.getUids())||gzjh.getUids()==null){//新增
				/*if ("Thu Jan 01 08:00:00 CST 1970".equals(cjspb.getPzrq().toString())){
					cjspb.setPzrq(null);
				}*/
				this.gzJhDao.insert(gzjh);
				flag="1";
			}else{//修改
				this.gzJhDao.saveOrUpdate(gzjh);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		System.out.print(flag);
		return flag;
	}


	
}
