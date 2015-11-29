/***********************************************************************
 * Module:  INFManageDAO.java
 * Author:  Administrator
 * Purpose: Defines the Class INFManageDAO
 ***********************************************************************/

package com.sgepit.pmis.INFManage.dao;
import java.util.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessException;

/** @pdOid ede5832f-e4fb-454b-8755-4290caeaa353 */
public class INFManageDAO extends com.sgepit.frame.base.dao.BaseDAO {
	private static final Log log = LogFactory.getLog(INFManageDAO.class);

   /** @pdOid 69e6f432-5536-4071-a4aa-42eecbd28f92 */
   protected void initDao() {
      // TODO: implement
	   super.initDao();
   }
   
   /** 从上下文获取对象
    * 
    * @param ctx
    * @pdOid d88825a5-52eb-4182-859a-7e4e467b6c61 */
   public static INFManageDAO getFromApplicationContext(ApplicationContext ctx) {
      // TODO: implement
	   return (INFManageDAO) ctx.getBean("infmanageDAO");
   }

}