package com.sgepit.pmis.safeManage.dao;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class SafeManageDao extends BaseDAO{
	private static final Log log = LogFactory.getLog(SafeManageDao.class);
	
	protected void initDao() {
	      // TODO: implement
		   super.initDao();
	   }
	
	/** 从上下文获取对象
	    * 
	    * @param ctx
	    * @pdOid d88825a5-52eb-4182-859a-7e4e467b6c61 */
	   public static SafeManageDao getFromApplicationContext(ApplicationContext ctx) {
	      // TODO: implement
		   return (SafeManageDao) ctx.getBean("safeManageDao");
	   }

}
