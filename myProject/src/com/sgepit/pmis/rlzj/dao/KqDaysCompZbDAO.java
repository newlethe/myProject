package com.sgepit.pmis.rlzj.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.pmis.rlzj.hbm.KqDaysCompZb;

/**
 * A data access object (DAO) providing persistence and search support for
 * KqDaysCompZb entities. Transaction control of the save(), update() and
 * delete() operations can directly support Spring container-managed
 * transactions or they can be augmented to handle user-managed Spring
 * transactions. Each of these methods provides additional information for how
 * to configure it for the desired type of transaction control.
 * 
 * @see com.sgepit.pmis.rlzj.hbm.KqDaysCompZb
 * @author MyEclipse Persistence Tools
 */

public class KqDaysCompZbDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(KqDaysCompZbDAO.class);
	// property constants
	public static final String SJ_TYPE = "sjType";
	public static final String UNIT_ID = "unitId";
	public static final String DEPT_ID = "deptId";
	public static final String TITLE = "title";
	public static final String USER_ID = "userId";
	public static final String STATUS = "status";
	public static final String BILL_STATUS = "billStatus";
	public static final String MEMO = "memo";

	protected void initDao() {
		// do nothing
		sBeanName = "com.sgepit.pmis.rlzj.hbm.KqDaysCompZb";
	}

	public void save(KqDaysCompZb transientInstance) {
		log.debug("saving KqDaysCompZb instance");
		try {
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re) {
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(KqDaysCompZb persistentInstance) {
		log.debug("deleting KqDaysCompZb instance");
		try {
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public KqDaysCompZb findById(java.lang.String id) {
		log.debug("getting KqDaysCompZb instance with id: " + id);
		try {
			KqDaysCompZb instance = (KqDaysCompZb) getHibernateTemplate().get(
					"com.sgepit.pmis.rlzj.hbm.KqDaysCompZb", id);
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(KqDaysCompZb instance) {
		log.debug("finding KqDaysCompZb instance by example");
		try {
			List results = getHibernateTemplate().findByExample(instance);
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}

	public List findByProperty(String propertyName, Object value) {
		log.debug("finding KqDaysCompZb instance with property: "
				+ propertyName + ", value: " + value);
		try {
			String queryString = "from KqDaysCompZb as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re) {
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findBySjType(Object sjType) {
		return findByProperty(SJ_TYPE, sjType);
	}

	public List findByUnitId(Object unitId) {
		return findByProperty(UNIT_ID, unitId);
	}

	public List findByDeptId(Object deptId) {
		return findByProperty(DEPT_ID, deptId);
	}

	public List findByTitle(Object title) {
		return findByProperty(TITLE, title);
	}

	public List findByUserId(Object userId) {
		return findByProperty(USER_ID, userId);
	}

	public List findByStatus(Object status) {
		return findByProperty(STATUS, status);
	}

	public List findByBillStatus(Object billStatus) {
		return findByProperty(BILL_STATUS, billStatus);
	}

	public List findByMemo(Object memo) {
		return findByProperty(MEMO, memo);
	}

	public List findAll() {
		log.debug("finding all KqDaysCompZb instances");
		try {
			String queryString = "from KqDaysCompZb";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re) {
			log.error("find all failed", re);
			throw re;
		}
	}

	public KqDaysCompZb merge(KqDaysCompZb detachedInstance) {
		log.debug("merging KqDaysCompZb instance");
		try {
			KqDaysCompZb result = (KqDaysCompZb) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(KqDaysCompZb instance) {
		log.debug("attaching dirty KqDaysCompZb instance");
		try {
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(KqDaysCompZb instance) {
		log.debug("attaching clean KqDaysCompZb instance");
		try {
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public static KqDaysCompZbDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (KqDaysCompZbDAO) ctx.getBean("KqDaysCompZbDAO");
	}
}