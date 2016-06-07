/***********************************************************************
 * Module:  INFManageDAO.java
 * Author:  Administrator
 * Purpose: Defines the Class INFManageDAO
 ***********************************************************************/
package com.sgepit.pmis.document.dao;
import java.util.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessException;

/** @pdOid ede5832f-e4fb-454b-8755-4290caeaa353 */
public class ZlGlDAO extends com.sgepit.frame.base.dao.BaseDAO {
	private static final Log log = LogFactory.getLog(ZlGlDAO.class);

   /** @pdOid 69e6f432-5536-4071-a4aa-42eecbd28f92 */
   protected void initDao() {
      // TODO: implement
	   super.initDao();
   }
   
   /** 从上下文获取对象
    * 
    * @param ctx
    * @pdOid d88825a5-52eb-4182-859a-7e4e467b6c61 */
   public static ZlGlDAO getFromApplicationContext(ApplicationContext ctx) {
      // TODO: implement
	   return (ZlGlDAO) ctx.getBean("zlglDAO");
   }

	/**
	 * 删除数据,调用HibernateTemplate的delete方法,捕获相关异常并抛出。
	 * @param persistentInstance 需要删除的bean实例。
	 */
	public void delete(Object persistentInstance) {
		log.debug("delete " + persistentInstance.getClass().getName());
		try {
			getHibernateTemplate().delete(persistentInstance);
			getHibernateTemplate().flush();
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}
	/**
	 * 插入数据，调用HibernateTemplate的save方法,捕获相关异常并抛出。
	 * @param transientInstance 需要保存的bean实例。
	 * @return 所保存记录的id.
	 */
	public String insert(Object transientInstance) {
		log.debug("insert " + transientInstance.getClass().getName());
		String id=null;
		try {
			id = getHibernateTemplate().save(transientInstance).toString();
			getHibernateTemplate().flush();
			log.debug("insert successful");
		} catch (RuntimeException re) {
			log.error("insert failed", re);
			throw re;
		}
		return id;
	}
}