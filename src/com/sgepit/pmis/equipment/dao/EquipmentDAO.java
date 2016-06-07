package com.sgepit.pmis.equipment.dao;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.BaseDAO;


public class EquipmentDAO extends BaseDAO {
	private static final Log log = LogFactory.getLog(EquipmentDAO.class);

	protected void initDao() {
		super.initDao();
	}

	public static EquipmentDAO getFromApplicationContext(ApplicationContext ctx) {
		return (EquipmentDAO) ctx.getBean("equipmentDAO");
	}
	
	public void saveOrUpdate(Object transientInstance) {
		log.debug("saveOrUpdate " + transientInstance.getClass().getName());
		try {
			getHibernateTemplate().saveOrUpdate(transientInstance);
			getHibernateTemplate().flush();
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}
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