/***********************************************************************
 * Module:  ConInvestedDAO.java
 * Author:  lxb
 * Purpose: Defines the Class ConInvestedDAO
 ***********************************************************************/

package com.sgepit.pmis.budget.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;

/** 合同投资完成
 * 
 * @pdOid e39d9453-c841-4847-ac0d-76e84adef9ff */
public class ConInvestedDAO extends BaseDAO {
   /** @pdOid bd00332b-e6d1-41a7-b222-97385a4d1610 */
   private static final Log log = LogFactory.getLog(ConInvestedDAO.class);
   
   /** @pdOid bbff2fc8-6aee-44c1-b1a6-65e73cc54762 */
   protected void initDao() {
      // TODO: implement
	   super.initDao();
   }
   
   /** 从上下文获取对象
    * 
    * @param ctx
    * @pdOid 78aa4df8-8013-4c5a-bbc2-5d5fcb1d1383 */
   public static ConInvestedDAO getFromApplicationContext(ApplicationContext ctx) {
	   return (ConInvestedDAO) ctx.getBean("conInvestedDAO");
	   
   }

}